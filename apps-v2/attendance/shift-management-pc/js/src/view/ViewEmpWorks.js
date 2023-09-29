teasp.provide('teasp.view.EmpWorks');
/**
 * 月次工数実績画面（月次工数実績印刷プレビュー兼用）
 *
 * @constructor
 * @extends {teasp.view.Base}
 * @param {boolean} printFlag true:印刷モード
 * @author DCI小島
 */
teasp.view.EmpWorks = function(printFlag){
	/** @private */
	this.printFlag = printFlag;
	/** @private */
	this.imageMap = {};
	/** @private */
	this.eventHandles = {};
};

teasp.view.EmpWorks.prototype = new teasp.view.Base();

/**
 * 画面初期化
 *
 * @param {Object} messageMap メッセージテーブル
 * @param {Function} onSuccess 正常受信時の処理
 * @param {Function} onFailure 異常受信時の処理
 */
teasp.view.EmpWorks.prototype.init = function(messageMap, onSuccess, onFailure){

	teasp.message.mergeLabels(globalMessages || {});
	teasp.message.mergeLabels(messageMap ? (messageMap[teasp.message.getLanguageLocaleKey()] || {}) : {});

	this.readParams();

	if(teasp.isSforce1()){ // SF1で[プリンタへ出力][閉じる]ボタンを非表示にする
		dojo.query('#areaBody tr.control_bar').forEach(function(el){
			dojo.style(el, 'display', 'none');
		});
	}

	// サーバへリクエスト送信
	teasp.manager.request(
		'loadJobMonth',
		this.viewParams,
		this.pouch,
		{ hideBusy : true },
		this,
		function(){
			if(this.printFlag){
				this.initShow();
			}else{
				if (this.pouch.isOldRevision()) {
					teasp.locationHref(teasp.getPageUrl('convertView') + '?forwardURL=' + encodeURIComponent(teasp.getPageUrl('empJobView')));
				}else{
					if (!this.pouch.getEmpId()) {
						teasp.locationHref(teasp.getPageUrl('empRegistView') + '?forwardURL=' + encodeURIComponent(teasp.getPageUrl('empJobView')));
					}else{
						this.initShow();
					}
				}
			}
			onSuccess();
		},
		function(event){
			onFailure(event);
		}
	);
};

teasp.view.EmpWorks.prototype.initShow = function(){
	if (!this.printFlag) {
		//innerHTML
		teasp.message.setLabelHtml('section_label'); //部門
		teasp.message.setLabelHtml('empName_label'); //社員名
		teasp.message.setLabelHtml('status_label'); //ステータス
		teasp.message.setLabelHtml('date_head'); //日付
		teasp.message.setLabelHtml('task_head'); //タスク
		teasp.message.setLabelHtml('taskPercent_head'); //作業割合
		teasp.message.setLabelHtml('taskTime_head'); //作業時間
		teasp.message.setLabelHtml('jobSTitle','taskSummary_label'); //月次集計
		teasp.message.setLabelHtml('task_head2','task_head'); //タスク
		teasp.message.setLabelHtml('taskPercent_head2','taskPercent_head'); //作業割合
		teasp.message.setLabelHtml('taskTime_head2','taskTime_head'); //作業時間
		teasp.message.setLabelHtml('taskTimeTotal_label'); //作業時間合計
		teasp.message.setLabelEx('spanInputToHoliday', 'tk10004580'); // 休日も入力

		// タイトル
		dojo.query('td.ts-top-title > div.main-title').forEach(function(elem){
			elem.innerHTML = teasp.message.getLabel('tk10000430'); // 月次工数実績
		}, this);
		dojo.query('td.ts-top-title > div.sub-title').forEach(function(elem){
			elem.innerHTML = teasp.message.getLabel('tf10004570'); // 月次工数実績(英語)
		}, this);

		//TITLE
		teasp.message.setLabelTitle('help_link_title'); //操作マニュアル
		teasp.message.setLabelTitle('prevMonth_btn_title'); //前月
		teasp.message.setLabelTitle('nextMonth_btn_title'); //次月
		teasp.message.setLabelTitle('currMonth_btn_title'); //今月

		dojo.byId('empTypeTitle').innerHTML  = teasp.message.getLabel('empType_label'); // 勤務体系
		dojo.byId('print_btn_title').firstChild.innerHTML = teasp.message.getLabel('print_btn_title'); // 印刷
		dojo.byId('applyButton1').firstChild.innerHTML = teasp.message.getLabel('applyx_btn_title'); //承認申請
	}else{
		//innerHTML
		teasp.message.setLabelHtml('empWork_label'); //工数実績
		teasp.message.setLabelHtml('status_label'); //ステータス
		teasp.message.setLabelHtml('section_label'); //部門
		teasp.message.setLabelHtml('empCode_label'); //社員コード
		teasp.message.setLabelHtml('empName_label'); //社員名
		teasp.message.setLabelHtml('date_head'); //日付
		teasp.message.setLabelHtml('task_head'); //タスク
		teasp.message.setLabelHtml('jobName_head'); //ジョブ名
		teasp.message.setLabelHtml('taskPercent_head'); //作業割合
		teasp.message.setLabelHtml('taskTime_head'); //作業時間
		teasp.message.setLabelHtml('jobSTitle','taskSummary_label'); //月次集計
		teasp.message.setLabelHtml('task_head2','task_head'); //タスク
		teasp.message.setLabelHtml('jobName_head2','jobName_head'); //ジョブ名
		teasp.message.setLabelHtml('taskPercent_head2','taskPercent_head'); //作業割合
		teasp.message.setLabelHtml('taskTime_head2','taskTime_head'); //作業時間
		teasp.message.setLabelHtml('taskTimeTotal_label'); //作業時間合計

		dojo.byId('printOut_btn_title').firstChild.innerHTML = teasp.message.getLabel('printOut_btn_title'); // プリンタへ出力
		dojo.byId('close_btn_title'   ).firstChild.innerHTML = teasp.message.getLabel('close_btn_title');  // 閉じる
		dojo.byId('jobApplyApprove'   ).firstChild.innerHTML = teasp.message.getLabel('tf10000270');  // 承認／却下

		// 月次工数実績の確定を行わない＝オンの時は、ステータスを非表示にする。
		if(this.pouch.isDontFixJobMonthly()){
			dojo.style(dojo.byId('status_label').parentNode.parentNode, 'display', 'none');
		}
	}

	if (!this.printFlag) {
		// 前月
		dojo.query('.pb_btn_prevm').forEach(function(elem){
			elem.firstChild.innerHTML = teasp.message.getLabel('tf10000300');   // <<前月
			dojo.connect(elem, 'onclick', this, this.changePrevMonth);
		}, this);
		// 今月
		dojo.query('.pb_btn_currm').forEach(function(elem){
			elem.firstChild.innerHTML = teasp.message.getLabel('currMonth_btn_title');   // 今月
			dojo.connect(elem, 'onclick', this, this.changeCurrMonth);
		}, this);
		// 次月
		dojo.query('.pb_btn_nextm').forEach(function(elem){
			elem.firstChild.innerHTML = teasp.message.getLabel('tf10000310');   // 次月>>
			dojo.connect(elem, 'onclick', this, this.changeNextMonth);
		}, this);

		dojo.query('.pb_btn_print').forEach(function(elem){
			dojo.connect(elem, 'onclick', this, this.openPrintView);
		}, this);

		var pDiv = dojo.query('#expTopView td.ts-top-photo > div')[0];
		var photoUrl = this.pouch.getSmallPhotoUrl();
		if(photoUrl){
			dojo.create('img', {
				src       : photoUrl,
				className : 'smallPhoto'
			}, pDiv);
		}else{
			dojo.create('img', {
				className : 'pp_base pp_default_photo'
			}, pDiv);
		}

		// ステータス
		var el = dojo.byId('monthlyStatus');
		dojo.empty(el);
		dojo.create('div', { className: 'png-' + this.pouch.getJobApplyStatusIconClass() }, el);
		dojo.create('div', { innerHTML: teasp.constant.getDisplayStatus(this.pouch.getJobApplyStatus(true)) }, el); // 未確定
		dojo.connect(dojo.byId('monthlyStatus'), 'onclick', this, this.openStatusView);

		// 月度選択
		dojo.connect(dojo.byId('yearMonthList'), 'onchange', this, this.changedMonthSelect);

		// 非勤務日も入力する
		dojo.connect(dojo.byId('inputToHoliday'), 'onclick', this, this.refreshMonthly);

		// 社員選択ウィンドウを表示
		dojo.connect(dojo.byId('empListButton'), 'onclick', this, this.openEmpList);

		// 参照モードの場合、モードを表示
		this.viewPlus();
	}else{
		if(this.pouch.isEmpJobApprover()){ // ステータスが承認待ちかつ自分が承認者である
			dojo.style('jobApplyApproveArea', 'display', '');
			var that = this;
			dojo.connect(dojo.byId('jobApplyApprove'), 'onclick', function(){
				teasp.manager.dialogOpen(
					'Approval',
					{
						apply   : { id: that.pouch.getJobApplyId() },
						objKey  : 'jobApply',
						refresh : false
					},
					that.pouch,
					that,
					function(){
						location.reload();
					}
				);
			});
		}
	}

	this.refreshMonthly();

	this.resizeArea();
};

//teasp.view.EmpWorks.prototype.resizeArea = function(){
//    try{
//        var bc = dojo.byId('bodyCell');
////        var tw = (bc ? bc.offsetWidth : teasp.constant.AREA_W_MIN);
////        if(tw > teasp.constant.AREA_W_MAX_JOB){
////            tw = teasp.constant.AREA_W_MAX_JOB;
////        }
////        var minLw = teasp.constant.AREA_W_MIN;
////        var k = teasp.constant.AREA_W_MARGIN;
////        var sa = (tw >= (minLw + k) ? k : (tw <= minLw ? 0 : (tw - minLw))) + teasp.constant.AREA_W_ADJUST;
////        var lw = tw - sa;
////        dojo.query('.month_frame').forEach(function(el){ el.style.width = '' + lw + 'px'; });
////        dojo.query('td.name'    ).forEach(function(el){ el.style.width = '' + (lw - 545) + 'px'; });
////        dojo.query('td.tasknote').forEach(function(el){ el.style.width = '' + (lw - 455) + 'px'; });
//    }catch(e){
//    }
//};

teasp.view.EmpWorks.prototype.resizeArea = function(){
	try{
		var w = dojo.window.getBox().w; // ウィンドウ幅を得る
		var bc = dojo.byId('bodyCell');
		if(bc){
			w -= bc.offsetLeft; // （サイドバー幅を引く）
		}
		if(w < 800){ // 最低幅= 800
			w = 800;
		}
	}catch(e){
	}
};

/**
 * 表示更新
 */
teasp.view.EmpWorks.prototype.refreshMonthly = function(){
	this.pouch.clearClassifyJobWorks();

	if(this.printFlag){
		try{ // Safari では失敗する
			var winTitles = document.getElementsByTagName('title');
			if(winTitles && winTitles.length > 0){
				var ym = this.pouch.getJobYearMonth() + teasp.util.date.dispSubNo(this.pouch.getJobSubNo());
				winTitles[0].innerHTML = teasp.message.getLabel('tm40001020', ym, this.pouch.getName());
			}
		}catch(e){}
	}

	var barWidth = (this.printFlag ? 72 : 92);

	var inputToHoliday = false;

	for(var key in this.eventHandles){
		if(this.eventHandles.hasOwnProperty(key)){
			dojo.disconnect(this.eventHandles[key]);
			delete this.eventHandles[key];
		}
	}

	if(!this.printFlag){
		var helpLinks = dojo.query('td.ts-top-button3 > a', dojo.byId('expTopView'));
		if(helpLinks.length > 0){
			helpLinks[0].href = this.pouch.getHelpLink();
		}

		this.createMonthList();

		if (this.pouch.isEmpJobApprover()) {
			// 承認/却下ボタン
			dojo.style('applyButton1', 'display', '');
			dojo.byId('applyButton1').className = 'std-button3';
			dojo.byId('applyButton1').firstChild.innerHTML = teasp.message.getLabel('tf10000270'); // 承認／却下

			this.eventHandles['applyButton1'] = dojo.connect(dojo.byId('applyButton1'), 'onclick', this, this.approveMonthly);
		}else if(this.pouch.isDontFixJobMonthly()){
			// 月次工数実績の確定を行わない＝オンの時は、ステータスと承認申請ボタンを非表示にする。
			dojo.style('applyButton1', 'display', 'none');
//            dojo.byId('applyButton1').className = 'pb_base clear-74x26';
			dojo.style(dojo.byId('status_label' ).parentNode, 'display', 'none');
			dojo.style(dojo.byId('monthlyStatus').parentNode, 'display', 'none');
		}else{
			if(this.pouch.isJobApplyable() && !this.pouch.isReadOnly()){ // 承認申請ボタン・有効化
				dojo.style('applyButton1', 'display', '');
				dojo.byId('applyButton1').className = 'std-button1';
				dojo.byId('applyButton1').firstChild.innerHTML = teasp.message.getLabel(this.pouch.isUseJobWorkFlow() ? 'applyx_btn_title' : 'fix_btn_title');
				this.eventHandles['applyButton1'] = dojo.connect(dojo.byId('applyButton1'), 'onclick', this, this.openExpApply);
			}else{ // 承認申請ボタン・無効化
				dojo.style('applyButton1', 'display', '');
				dojo.byId('applyButton1').className = 'std-button1-disabled';
				dojo.byId('applyButton1').firstChild.innerHTML = teasp.message.getLabel(this.pouch.isUseJobWorkFlow() ? 'applyx_btn_title' : 'fix_btn_title');
			}
		}

		var el = dojo.byId('monthlyStatus');
		dojo.empty(el);
		dojo.create('div', { className: 'png-' + this.pouch.getJobApplyStatusIconClass() }, el);
		dojo.create('div', { innerHTML: teasp.constant.getDisplayStatus(this.pouch.getJobApplyStatus(true)) }, el); // 未確定

		dojo.byId('empTypeName').innerHTML      = this.pouch.getEmpTypeName();

		if(this.pouch.isUseDailyApply() && this.pouch.getObj().checkWorkingTime){
			dojo.style('inputToHolidayDiv', 'display', 'none');
			inputToHoliday = false;
		}else{
			dojo.style('inputToHolidayDiv', 'display', '');
			inputToHoliday = dojo.byId('inputToHoliday').checked;
		}
	}else{
		dojo.byId('yearMonth').innerHTML     = this.pouch.getJobYearMonthJp(); // {0}年{1}月度
		dojo.byId('monthlyStatus').innerHTML = teasp.constant.getDisplayStatus(this.pouch.getJobApplyStatus());
		dojo.byId('empCode').innerHTML       = this.pouch.getEmpCode();
	}
	dojo.byId('department').innerHTML       = this.pouch.getDeptName();
	dojo.byId('empName').innerHTML          = this.pouch.getName();

	var table = dojo.byId('jobTable');
	var tbody = table.getElementsByTagName('tbody')[0];
	dojo.empty(tbody);

	var jobYmObj = this.pouch.getJobApply();
	var dlst = teasp.util.date.getDateList(jobYmObj.startDate, jobYmObj.endDate);
	var allWorks = this.pouch.getWorks();

	var dwMap = {};
	var map = {};
	for(var i = 0 ; i < dlst.length ; i++){
		var dkey = dlst[i];
		dwMap[dkey] = { time: 0, works: [], timeFixTime: 0 };
		var dayWork = dwMap[dkey];
		for(var j = 0 ; j < allWorks.length ; j++){
			var work = allWorks[j];
			if(work.date == dkey
			&& (work.time > 0
			|| work.volume > 0
			|| ((work.taskNote || '') != '')
			|| ((work.progress || '') != '')
			|| ((work.extraItem1 || '') != '')
			|| ((work.extraItem2 || '') != '')
			)){
				dayWork.works.push(work);
				dayWork.time += work.time;
				if(work.timeFix){
					dayWork.timeFixTime += work.time;
				}
				var process = (!work.process)? '' : work.process;
				var mKey = work.jobId+':'+process;
				var wt = map[mKey];
				if(!wt){
					wt = map[mKey] = { jobName: work.job.name, time: 0, process:work.process, jobLeaderId: work.job.jobLeaderId };
				}
				wt.time += work.time;
			}
		}
	}
	var onlyJl = (this.pouch.isJobLeaderFilter() && this.pouch.isOnlyJL());
	var summaryList = [];
	var monthlySum = 0;
	var colorMap = {};
	var colors = 'ABCDEFGHIJKLMNO';
	for(var key in map){
		if(map.hasOwnProperty(key)){
			if(onlyJl && map[key].jobLeaderId != this.pouch.getSessionUserId()){
				continue;
			}
			monthlySum += map[key].time;
			summaryList.push({jobId: key, jobName: map[key].jobName, time: map[key].time, process: map[key].process});
		}
	}
	summaryList.sort(function(a, b){
		return b.time - a.time;
	});
	var w = 0;
	for(i = 0 ; i < summaryList.length ; i++){
		var s = summaryList[i];
		s.percent = Math.round(s.time * 100 / monthlySum);
		colorMap[summaryList[i].jobId] = colors.substring(w, w + 1);
		w++;
		if(w >= colors.length){
			w = 0;
		}
	}
	var r = 0;
	var prg = false;
	var mm = null;
	for(i = 0 ; i < dlst.length ; i++){
		var dkey = dlst[i];
		var dayWork = dwMap[dkey];
		var dayFix = this.pouch.isDailyFixByDate(dkey);
		var day = this.pouch.getObj().days[dkey];
		var workNote = this.pouch.getJobWorkNote(dkey);
		var inputable = inputToHoliday || ((day && day.rack && day.rack.inputable) || (dayWork.works.length > 0) || workNote);
		var kintain = (typeof(day.startTime) == 'number' && typeof(day.endTime) == 'number');
		var works;
		if(onlyJl){
			works = [];
			for(var ii = 0 ; ii < dayWork.works.length ; ii++){
				if(dayWork.works[ii].job.jobLeaderId == this.pouch.getSessionUserId()){
					works.push(dayWork.works[ii]);
				}
			}
		}else{
			works = dayWork.works;
		}

		var row = tbody.insertRow(-1);
		var rowClass = ((r%2)==0 ? 'even' : 'odd');
//        if(day.dayType){
//            rowClass = 'rowcl' + day.dayType;
//        }else if(day.plannedHoliday || (day.rack && day.rack.holidayJoin && day.rack.holidayJoin.flag == 3)){
//            rowClass = 'rowcl4';
//        }
		row.className = rowClass + ' day_border';
		// 日付
		var cell = row.insertCell(-1);
		cell.className = 'date' + (this.printFlag ? '' : ' date_label' + (dayFix ? '_lock' : ''));
		var d = teasp.util.date.parseDate(dkey);
		var dspd = d.getDate();
		if(mm === null || (d.getMonth() + 1) != mm){
			mm = (d.getMonth() + 1);
			dspd = mm + '/' + d.getDate();
		}
		var div = dojo.create('div', {
			style       : { margin:"0px 4px", width:"43px" },
//            innerHTML   : teasp.util.date.formatDate(dkey, 'M/d')
			innerHTML   : dspd
		}, cell);
		if(!this.printFlag && !this.pouch.isDisabledTimeReport()){
			div.style.cursor = 'pointer';
			div.title = teasp.util.date.formatDate(dkey, 'M/d') + ':' + teasp.message.getLabel('tm30001040');
			this.eventHandles['d-' + dkey] = dojo.connect(div, 'onclick', this, this.jumpToDaily(dkey));
		}
		cell.rowSpan = ((works.length * 2) + (onlyJl ? 0 : 1)) || 1;

		// 曜日
		cell = row.insertCell(-1);
		cell.className = 'yobi';
		cell.innerHTML = '<div style="margin:0px 4px;width:15px;">' + teasp.util.date.formatDate(dkey, 'JPW') + '</div>';
		cell.rowSpan = ((works.length * 2) + (onlyJl ? 0 : 1)) || 1;

		if(!this.printFlag){
			// 編集ボタン
			cell = row.insertCell(-1);
			if(inputable){
				cell.className = 'edit';
				var wak = dojo.create('div', { style: 'position:relative;' }, cell);
				var warn = this.setWarningMarker(wak, dkey, dayWork, kintain);
				var inp = dojo.create('input', {
					type      : 'button',
					id        : 'empJobEdit' + dkey,
//                    className : 'pb_base pb_btn_pen',
					className : 'png-add',
					style     : { margin:"1px 8px" },
					title     : (warn && warn.diff ? warn.msg : teasp.message.getLabel('empWorkEdit_btn_title'))
				}, wak);
				this.eventHandles['empJobEdit' + dkey] = dojo.connect(inp, 'onclick', this, function(){
					var _dkey = dkey;
					return function(){
						this.clickedEmpJob('empJobEdit' + _dkey);
					};
				}());
				cell.rowSpan = ((works.length * 2) + (onlyJl ? 0 : 1)) || 1;
			}
		}

		if(works.length <= 0){
			if(workNote != '' && !onlyJl){
				cell = row.insertCell(-1);
				cell.colSpan = 5;
				cell.className = 'worknote';
				cell.innerHTML = '<div class="worknote">' + ' ' + workNote + '</div>';
			}else{
				// 連番
				cell = row.insertCell(-1);
				cell.className = 'sharp';
				// ジョブ名
				cell = row.insertCell(-1);
				cell.className = 'name';
				cell.innerHTML = '<div></div>';
				// 作業割合
				cell = row.insertCell(-1);
				cell.className = 'volume';
				// 作業時間
				cell = row.insertCell(-1);
				cell.className = 'time';
				// 作業報告
				cell = row.insertCell(-1);
				cell.className = 'worknote' + (this.printFlag ? 'p' : '');
				cell.innerHTML = '<div></div>';
				cell.style.textAlign = 'left';
			}
		}else{
			var complex = false;
			for(w = 0 ; w < works.length ; w++){
				if(works[w].timeFix && works[w].time){
					complex = true;
					break;
				}
			}
			var inserted = 0;
			for(w = 0 ; w < (works.length + 1) ; w++){
				if(w == works.length){
					if(!onlyJl){
						if(inserted > 0){
							row = tbody.insertRow(-1);
							row.className = rowClass;
						}
						cell = row.insertCell(-1);
						cell.colSpan = 5;
						cell.className = 'worknote';
						var t = (kintain ? dayWork.time : dayWork.timeFixTime);
						cell.innerHTML = '<div class="worknote">'
							+ teasp.message.getLabel('tm40001100', teasp.util.time.timeValue(t))
							+ ' ' + workNote + '</div>';
						inserted++;
					}
				}else{
					var workWrap = this.pouch.getEmpWork(works[w]);
					var extraItems = workWrap.getExtraItems();
					if(inserted > 0){
						row = tbody.insertRow(-1);
						row.className = rowClass;
					}
					// 連番
					cell = row.insertCell(-1);
					cell.className = 'sharp';
					cell.rowSpan = 2;
					cell.innerHTML = '<div class="sharp">' + (w + 1) + '</div>';
					// ジョブ名
					cell = row.insertCell(-1);
					cell.className = 'name';
					cell.rowSpan = 2;
					var jobNameText = workWrap.getProcessName();
					cell.innerHTML = '<div class="name">' + workWrap.getJobName() + (jobNameText != '' ? teasp.message.getLabel('tm10001470') + jobNameText : '') + '</div>'; // ／
					// 作業割合
					cell = row.insertCell(-1);
					cell.className = 'volume';
					var percent = (workWrap.getTime() ? workWrap.getPercent(dayWork.time) : works[w].percent);
					if(workWrap.getTime() > 0 || (!kintain && !complex)){
						div = document.createElement('div');
						div.className = 'div_volume';

						var process = (!workWrap.getProcess())? '' : workWrap.getProcess();
						var s = colorMap[workWrap.getJobId()+':'+process];
						var bw1 = this.getBarWidth(1, barWidth, percent / 10);
						var bw2 = this.getBarWidth(2, barWidth, percent / 10);
						var bw3 = this.getBarWidth(3, barWidth, percent / 10);
						div.innerHTML = '<table class="pane_table" style="margin-left:2px;margin-right:2px;"><tr>'
									+ '<td class="marker_' + s + '_L" style="width:' + bw1 + 'px;height:15px;"><img src="" class="volume_barL" style="width:' + bw1 + 'px;height:15px;" /></td>'
									+ '<td class="marker_' + s + '_M" style="width:' + bw2 + 'px;height:15px;"><img src="" class="volume_barM" style="width:' + bw2 + 'px;height:15px;" /></td>'
									+ '<td class="marker_' + s + '_R" style="width:' + bw3 + 'px;height:15px;"><img src="" class="volume_barR" style="width:' + bw3 + 'px;height:15px;" /></td>'
									+ '</tr></table>';
						cell.appendChild(div);
					}else if(workWrap.getVolume() > 0){
						cell.style.whiteSpace = 'nowrap';
						cell.innerHTML = '<span style="font-size:13px;">' + teasp.message.getLabel('tm20002060') + '</span>'; // ＊＊＊＊＊＊＊
					}
					// 作業時間
					cell = row.insertCell(-1);
					cell.className = 'time';
					var mode = 0; // 0:time, 1:volume, 2:percent
					if(!works[w].timeFix && !kintain && workWrap.getVolume() > 0){
						mode = (!complex ? 2 : 1);
					}
					if(mode == 0){
						cell.innerHTML = '<div class="time">' + teasp.util.time.timeValue(workWrap.getTime()) + '</div>';
					}else if(mode == 1){
						cell.innerHTML = '<div class="time">' + teasp.message.getLabel('tm20002050') + '</div>';
					}else{
						cell.innerHTML = '<div class="percent">' + Math.round(works[w].percent / 10) + '%</div>';
					}
					// 進捗
					var progress = workWrap.getProgress();
					if(!prg && progress){
						prg = true;
					}
					cell = row.insertCell(-1);
					cell.className = 'progress';
					cell.innerHTML = '<div class="progress">' + progress + '</div>';
					inserted++;
					// タスク毎の作業報告
					row = tbody.insertRow(-1);
					row.className = rowClass;
					cell = row.insertCell(-1);
					cell.className = 'tasknote';
					cell.colSpan = 3;
					if(extraItems.length > 0){
						for(var x = 0 ; x < extraItems.length ; x++){
							var item = extraItems[x];
							if(!item){
								continue;
							}
							dojo.create('div', {
								className : 'extraItem',
								style : { "float":"left" },
								innerHTML : (item.name ? (item.name + ' : ') : '')
							}, cell);
							var style = { "float":"left" };
							if(x == 0 && extraItems[1]){
								style.marginRight = '10px';
							}
							dojo.create('div', {
								className : 'extraItem',
								style : style,
								innerHTML : teasp.util.entitize(item.value || '', '')
							}, cell);
						}
						dojo.create('div', { style: { clear:"both" } }, cell);
					}
					dojo.create('div', { className: 'tasknote', innerHTML: this.pouch.convNoteString(teasp.util.entitize(workWrap.getTaskNote(), '')) }, cell);
				}
			}
		}
		r++;
	}
	if(tbody.rows.length > 0){
		var row = tbody.rows[0];
		dojo.style(row, 'border-top', 'none');
		for(i = 0 ; i < row.cells.length ; i++){
			cell = row.cells[i];
			dojo.style(cell, 'border-top', 'none');
		}
	}
	dojo.byId('workReport_label').innerHTML = ((prg || this.pouch.getProgressList().length > 0) ? teasp.message.getLabel('progress_head') : '');
	table = dojo.byId('jobSumTable');
	tbody = table.getElementsByTagName('tbody')[0];
	dojo.empty(tbody);
	for(r = 0 ; r < summaryList.length ; r++){
		var row = dojo.create('tr', { className: ((r%2)==0 ? 'even' : 'odd') }, tbody);

		var jobNameText = summaryList[r].jobName;
		if(summaryList[r].process){
			jobNameText += teasp.message.getLabel('tm10001470') + summaryList[r].process; // ／
		}
		dojo.create('div', { style: { margin:"2px 4px", wordBreak:"break-all", textAlign:"left" }, innerHTML: jobNameText }, dojo.create('td', { className: "name" }, row));
		cell = dojo.create('td', { className: "volume" }, row);
		if(summaryList[r].percent > 0){
			var s = colorMap[summaryList[r].jobId];
			var bw1 = this.getBarWidth(1, 212, summaryList[r].percent);
			var bw2 = this.getBarWidth(2, 212, summaryList[r].percent);
			var bw3 = this.getBarWidth(3, 212, summaryList[r].percent);
			var irow = dojo.create('tr', null, dojo.create('tbody', null, dojo.create('table', { style:{ margin:"2px" }, className:"pane_table" }, dojo.create('div', null, cell))));
			dojo.create('img', { src:"", className:"volume_barL", style:{ width:(bw1 + "px"), height:"15px" } }, dojo.create('td', { className:"marker_" + s + "_L", style:{ width:(bw1 + "px"), height:"17px" } }, irow));
			dojo.create('img', { src:"", className:"volume_barM", style:{ width:(bw2 + "px"), height:"15px" } }, dojo.create('td', { className:"marker_" + s + "_M", style:{ width:(bw2 + "px"), height:"17px" } }, irow));
			dojo.create('img', { src:"", className:"volume_barR", style:{ width:(bw3 + "px"), height:"15px" } }, dojo.create('td', { className:"marker_" + s + "_R", style:{ width:(bw3 + "px"), height:"17px" } }, irow));
		}
		dojo.create('div', { style: { margin:"2px 4px" }, innerHTML: teasp.util.time.timeValue(summaryList[r].time) }, dojo.create('td', { className: "time" }, row));
	}
	if(tbody.rows.length > 0){
		var row = tbody.rows[0];
		dojo.style(row, 'border-top', 'none');
		for(i = 0 ; i < row.cells.length ; i++){
			cell = row.cells[i];
			dojo.style(cell, 'border-top', 'none');
		}
	}
	table = dojo.byId('jobSFoot');
	tbody = table.getElementsByTagName('tbody')[0];
	tbody.rows[0].cells[1].innerHTML = '<div style="margin:2px 4px;">' + teasp.util.time.timeValue(monthlySum) + '</div>';
};

/**
 * 勤怠と工数が合わない場合、警告アイコンを表示
 * @param {Object} div DOM
 * @param {string} dkey 日付キー
 * @param {Object} dayWork 日の情報を持つオブジェクト
 * @param {boolean} kintain 出勤したか
 * @returns {Object|null} null:チェックしない、Object:一致or不一致、メッセージ
 */
teasp.view.EmpWorks.prototype.setWarningMarker = function(div, dkey, dayWork, kintain){
	if(!this.pouch.isWarningOnMAPHW()){ // オプションがオフなら何もしない
		return null;
	}
	var wrt = this.pouch.getJobWorkRealTime(dkey);
	var diff = false;
	if(kintain){
		diff = (dayWork.time != wrt);
	}else if(dayWork.time){
		diff = true;
	}
	if(diff){
		div.title = teasp.message.getLabel('tf10008580'); // 実労働時間と作業時間の合計が一致していません
		dojo.create('div', {
			className:'pp_base pp_exclamatio2', // ！マーク
			style:'position:absolute;left:2px;top:3px;'
		}, div);
	}
	return {
		diff: diff,
		msg: (diff ? teasp.message.getLabel('tf10008580') : null) // 実労働時間と作業時間の合計が一致していません
	};
};

/**
 * マーカー幅を返す
 *
 * @param {number} index マーカーパーツのインデックス
 * @param {number} width 基準の幅
 * @param {number} percent パーセント
 * @returns {number} マーカー幅
 */
teasp.view.EmpWorks.prototype.getBarWidth = function(index, width, percent){
	var w = Math.round(width * percent / 100);
	if(index == 1 || index == 3){
		if(w > 14){
			return 7;
		}else{
			return (w / 2);
		}
	}
	if(w <= 14){
		return 0;
	}
	return (w - 14);
};

/**
 * タイムレポートへ遷移時の処理（クロージャ）
 *
 * @param {string} _hizuke 日付
 * @returns {Function}
 */
teasp.view.EmpWorks.prototype.jumpToDaily = function(_hizuke){
	var hizuke = _hizuke;
	return function(){
		var d = teasp.util.date.formatDate(hizuke, 'yyyyMMdd');
		teasp.locationHref(teasp.getPageUrl('timeReportView') + '?empId=' + this.pouch.getEmpId() + '&date=' + d + '&mode=' + this.pouch.getMode());
	};
};

/**
 * 年月プルダウンを作成
 *
 */
teasp.view.EmpWorks.prototype.createMonthList = function(){
	var ymx = teasp.util.date.formatDate(this.pouch.getJobStartDate(), 'yyyyMMdd');
	var months = this.pouch.getJobMonthList(teasp.util.date.getToday(), 1, -12);
	var x = -1;
	for(var i = 0 ; i < months.length ; i++){
		var month = months[i];
		if(month.yearMonthEx == ymx){
			x = i;
			break;
		}
	}
	if(x < 0){
		months.push(this.pouch.getJobMonth(this.pouch.getJobYearMonth(), null, null));
	}
	months = months.sort(function(a, b){
		return (a.startDate < b.startDate ? 1 : -1);
	});
	var select = dojo.byId('yearMonthList');
	dojo.empty(select);
	for(var i = 0 ; i < months.length ; i++){
		var month = months[i];
		var y = Math.floor(month.yearMonth / 100);
		var m = month.yearMonth % 100;
		var ym = teasp.util.date.formatMonth('zv00000021', y, m, month.subNo);
		dojo.create('option', { value: month.yearMonthEx, innerHTML: ym }, select);
	}
	select.value = ymx;
};

/**
 * 承認申請ボタンクリック時の処理
 *
 */
teasp.view.EmpWorks.prototype.openExpApply = function(){
	var jobYmObj = this.pouch.getJobApply();
	var warning = null;
	var dlst = teasp.util.date.getDateList(jobYmObj.startDate, jobYmObj.endDate);
	var l = [];
	var mp = {};
	for(var i = 0 ; i < dlst.length ; i++){
		var dkey = dlst[i];
		var month = this.pouch.getEmpMonthByDate(dkey);
		if(mp[month.yearMonth]){
			continue;
		}
		mp[month.yearMonth] = 1;
		if(((month.config.useDailyApply && month.config.checkWorkingTime) || month.config.checkWorkingTimeMonthly)
		&& !teasp.constant.STATUS_FIX.contains(month.apply.status)){
			var y = Math.floor(month.yearMonth / 100);
			var m = month.yearMonth % 100;
			var sn = month.subNo;
			l.push(teasp.util.date.formatMonth('zv00000020', y, m, sn)); // yyyy年MM月度
		}
	}
	if(l.length > 0){
		teasp.tsAlert(teasp.message.getLabel('tk10005000' // 工数入力時間のチェックのため、先に勤務表（{0}）の確定を行ってください。
				, l.join(teasp.message.getLabel('tm10001540'))), this);
		return;
	}
	var innerOpenExpApply = dojo.hitch(this, function(){
		var req = {
			title      : teasp.message.getLabel('tm40001060'),
			buttonType : (this.pouch.isUseJobWorkFlow() ? 0 : 1),
			descript   : '',
			applyKey   : teasp.constant.APPLY_KEY_JOBAPPLY,
			warning    : warning
		};
		if(this.pouch.isUseJobWorkFlow()){
			req.descript = teasp.message.getLabel('tm40001070', this.pouch.getJobYearMonthJp());
		}else{
			req.descript = teasp.message.getLabel('tm40001080', this.pouch.getJobYearMonthJp());
		}
		teasp.manager.dialogOpen(
			'ApplyComment',
			req,
			this.pouch,
			this,
			function(obj){
				teasp.manager.request(
					'submitJobApply',
					{
						empId     : this.pouch.getEmpId(),
						month     : this.pouch.getJobYearMonth(),
						startDate : this.pouch.getJobStartDate(),
						comment   : obj.comment
					},
					this.pouch,
					{ hideBusy : false },
					this,
					function(){
						this.refreshMonthly();
					},
					function(event){
						teasp.message.alertError(event);
					}
				);
			}
		);
	});
	var works = this.pouch.getWorks() || [];
	if(!works.length){
		teasp.tsConfirmA(teasp.message.getLabel('tf10008160', // 工数実績が入力されていません。{0}してよろしいですか？
			(this.pouch.isUseJobWorkFlow() ? teasp.message.getLabel('applyx_btn_title') : teasp.message.getLabel('fix_btn_title')) // 承認申請 or 確定
		), this, function(){
			innerOpenExpApply();
		});
	}else{
		innerOpenExpApply();
	}
};

/**
 * 承認/却下ボタンクリック時の処理
 *
 */
teasp.view.EmpWorks.prototype.approveMonthly = function(){
	var jobApply = this.pouch.getJobApply();
	teasp.manager.dialogOpen(
		'Approval',
		{
			apply   : { id: jobApply.id },
			objKey  : 'jobApply',
			refresh : true
		},
		this.pouch,
		this,
		function(){
			this.refreshMonthly();
		}
	);
};

/**
 * ステータス（月次承認）ボタンクリック時の処理
 *
 */
teasp.view.EmpWorks.prototype.openStatusView = function(){
	var jobApply = this.pouch.getJobApply();
	if(jobApply && jobApply.id && (!jobApply.steps || jobApply.steps.length <= 0)){
		teasp.manager.request(
			'getJobApplySteps',
			{
				empId  : this.pouch.getEmpId(),
				month  : this.pouch.getJobYearMonth(),
				subNo  : this.pouch.getJobSubNo()
			},
			this.pouch,
			{ hideBusy : false },
			this,
			function(steps){
				jobApply.steps = (typeof(steps) == 'object' ? steps.steps : steps) || [];
				this.openStatusDialog(jobApply);
			},
			function(event){
				teasp.message.alertError(event);
			}
		);
	}else{
		this.openStatusDialog(jobApply);
	}
};

/**
 * 年月プルダウン変更時の処理
 *
 */
teasp.view.EmpWorks.prototype.changedMonthSelect = function(){
	var select = dojo.byId('yearMonthList');
	var d = teasp.util.date.formatDate(teasp.util.date.parseDate(select.value));
	return this.changeMonth(this.pouch.getJobMonth(null, d));
};

/**
 * 前月ボタンクリック時の処理
 *
 */
teasp.view.EmpWorks.prototype.changePrevMonth = function(){
	return this.changeMonth(this.pouch.getJobMonth(null, this.pouch.getJobStartDate(), -1));
};

/**
 * 今月ボタンクリック時の処理
 *
 */
teasp.view.EmpWorks.prototype.changeCurrMonth = function(){
	return this.changeMonth(this.pouch.getJobMonth(null, teasp.util.date.getToday()));
};

/**
 * 次月ボタンクリック時の処理
 *
 */
teasp.view.EmpWorks.prototype.changeNextMonth = function(){
	return this.changeMonth(this.pouch.getJobMonth(null, this.pouch.getJobStartDate(), 1));
};

/**
 * 月度変更
 *
 * @param {number} ym 月度
 * @returns {boolean} false固定
 */
teasp.view.EmpWorks.prototype.changeMonth = function(month){
	document.body.style.cursor = 'wait';
	teasp.manager.request(
		'transJobMonth',
		{
			empId : this.pouch.getEmpId(),
			month : month.yearMonth,
			startDate: teasp.util.date.formatDate(month.startDate, 'yyyyMMdd')
		},
		this.pouch,
		{ hideBusy : false },
		this,
		function(){
			this.refreshMonthly();
			document.body.style.cursor = 'default';
		},
		function(event){
			document.body.style.cursor = 'default';
			teasp.message.alertError(event);
		}
	);
	return false;
};

/**
 * ステータスダイアログを開く
 *
 * @param {Object} jobApply 申請オブジェクト
 */
teasp.view.EmpWorks.prototype.openStatusDialog = function(jobApply){
	var removable;
	if(jobApply && jobApply.status && (teasp.constant.STATUS_FIX.contains(jobApply.status) || teasp.constant.STATUS_REJECTS.contains(jobApply.status))){
		removable = true;
	}else{
		removable = false;
	}
	var removeButtonType = 0;
	if(this.pouch.isUseJobWorkFlow()){
		if(teasp.constant.STATUS_APPROVES.contains(jobApply.status)){
			removeButtonType = 2;
		}else if(teasp.constant.STATUS_REJECTS.contains(jobApply.status)){
			removeButtonType = 3;
		}else{
			removeButtonType = 1;
		}
	}
	teasp.manager.dialogOpen(
		'Status',
		{
			apply             : jobApply,
			removable         : (removable && !this.pouch.isReadOnly()),
			removeButtonType  : removeButtonType,
			cancelApply       : this.requestCancelJobApply
		},
		this.pouch,
		this,
		function(res){
			this.refreshMonthly();
		}
	);
};

/**
 * 申請取消リクエスト送信
 *
 * @param {Object} apply 申請オブジェクト
 * @param {Function} onSuccess 正常レスポンス受信時のイベントハンドラ
 * @param {Function} onFailure 異常レスポンス受信時のイベントハンドラ
 * @returns {boolean} true:リクエスト送信実行 false:中止
 */
teasp.view.EmpWorks.prototype.requestCancelJobApply = function(apply, onSuccess, onFailure){
	var msgkey = (teasp.constant.STATUS_REJECTS.contains(apply.status) ? 'tm40001091' : 'tm40001090');
	teasp.tsConfirmA(teasp.message.getLabel(msgkey, this.pouch.getJobYearMonthJp()), this, function(){
		teasp.manager.request(
			'cancelJobApply',
			{
				empId     : this.pouch.getEmpId(),
				month     : this.pouch.getJobYearMonth(),
				startDate : this.pouch.getJobStartDate(),
				date      : this.pouch.getJobStartDate()
			},
			this.pouch,
			{ hideBusy : false },
			this,
			onSuccess,
			onFailure
		);
	});
};

/**
 * 印刷ボタンクリック時の処理
 *
 */
teasp.view.EmpWorks.prototype.openPrintView = function(){
	var h = (screen.availHeight || 800);
	if(h > 800){
		h = 800;
	}
	var href = teasp.getPageUrl('empJobPrintView') + '?empId=' + this.pouch.getEmpId()
		+ '&date=' + teasp.util.date.formatDate(this.pouch.getJobStartDate(), 'yyyyMMdd')
		+ '&mode=read';
	if(teasp.isSforce1()){
		sforce.one.navigateToURL(href);
	}else{
		var wh = window.open(href, 'print', 'width=700,height=' + h + ',resizable=yes,scrollbars=yes');
		setTimeout(function(){ wh.resizeTo(710, h); }, 100);
	}
};

/**
 * 編集ボタンクリック時の処理
 *
 * @param {string} nodeId ノード
 */
teasp.view.EmpWorks.prototype.clickedEmpJob = function(nodeId){
	var match = /^empJobEdit(.+)$/.exec(nodeId);
	if(match){
		var date = match[1];
		var classifyJobWorks = this.pouch.getClassifyJobWorks(date);
		teasp.manager.dialogOpen(
			'WorkBalance',
			{
				date              : date,
				jobMonth          : this.pouch.getJobYearMonth(),
				workRealTime      : this.pouch.getJobWorkRealTime(date),
	            worked            : this.pouch.isWorked(date),
				workNote          : this.pouch.getJobWorkNote(date, true),
				zanteiFlag        : false,//this.pouch.getZanteiFlag(date),
				classifyJobWorks  : dojo.clone(classifyJobWorks),
				reflectWorkOption : null,
				monthFix          : this.pouch.isMonthFixByDate(date),
				dayFix            : this.pouch.isDailyFixByDate(date),
				client            : teasp.constant.APPLY_CLIENT_EMP_WORK
			},
			this.pouch,
			this,
			function(newClassifyJobWorks, workNote, flag){
				if(!flag){
					this.refreshMonthly();
				}
			}
		);
	}
};

/**
 * イメージをセット
 *
 * @param {string} pos マーカーのパーツを示す識別子
 * @param {string} color マーカーの色を示す識別子
 * @param {string} path イメージのパス
 */
teasp.view.EmpWorks.prototype.setImagePath = function(pos, color, path) {
	this.imageMap[pos + color] = path;
};

/**
 * イメージをイメージタグにセット
 *
 * @param {string} className タグのクラス名
 * @param {string} pos マーカーのパーツを示す識別子
 */
teasp.view.EmpWorks.prototype.setImageSrc = function(className, pos) {
	dojo.query(className).forEach(function(elem){
		var match = /marker_(.)_([LMR])/.exec(elem.parentNode.className);
		if(match){
			var c = match[1];
			var p = match[2];
			if(pos == p){
				elem.src = this.imageMap[p + c];
			}
		}
	}, this);
};

/**
 * 社員リストを別ウィンドウで表示
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.EmpWorks.prototype.openEmpList = function(){
	var deptCode = this.pouch.getDeptCode();
	if(deptCode == ''){
		deptCode = '-1';
	}
	var mode = this.pouch.getParamByKey('mode') || '';
	var h = (screen.availHeight || 400);
	if(h > 400){
		h = 400;
	}
	var sinfo = this.pouch.getObj().sessionInfo;
	var url = (teasp.getPageUrl('deptRefView') + '?type=Job&empId=' + (sinfo && sinfo.emp && sinfo.emp.id || this.pouch.getEmpId())
			+ '&deptId=' + this.pouch.getDeptId()
			+ '&month=' + this.pouch.getJobYearMonth()
			+ '&subNo=' + (this.pouch.getJobSubNo() || ''))
			+ (mode ? '&mode=' + mode : '');
	if(teasp.isSforce1()){
		sforce.one.navigateToURL(url);
	}else{
		var wh = window.open(url, 'empTable', 'width=690,height=340,resizable=yes,scrollbars=yes');
		if(wh){
			wh.focus();
		}
	}
};
