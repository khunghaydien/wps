teasp.provide('teasp.view.Monthly');
/**
 * 勤務表画面
 *
 * @constructor
 * @extends {teasp.view.Base}
 * @author DCI小島
 */
teasp.view.Monthly = function(){
	/** @private */
	this.rangeYear = null;
	/** @private */
	this.viewPos = null;
	/** @private */
	this.eventHandles = [];
	this.empWorkIn = true;
	this.graph = null;
	// 変動列
	this.workLocIn = false; // 勤務場所
	this.empAccsIn = false; // 乖離判定
	this.empWorkIn = false; // 工数
	// 変動列の幅（tsman.scss の変数 $tblTelework, $tblAcc, $tblJob の値と一致する）
	this.workLocWidth = 87; // 勤務場所列の幅
	this.empAccsWidth = 45; // 乖離判定列の幅
	this.empWorkWidth = 45; // 工数列の幅
	this.gw1off = 0;
	this.gw2off = 0;
	this.gw3off = 0;
};

teasp.view.Monthly.prototype = new teasp.view.Base();

/**
 * 画面初期化
 *
 * @param {Object} messageMap メッセージテーブル
 * @param {Function} onSuccess レスポンス正常受信時の処理
 * @param {Function} onFailure レスポンス異常受信時の処理
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.init = function(messageMap, onSuccess, onFailure){

	teasp.message.mergeLabels(globalMessages || {});
	teasp.message.mergeLabels(messageMap ? (messageMap[teasp.message.getLanguageLocaleKey()] || {}) : {});
	this.readParams({ target: 'empMonth', noDelay: true });
	if(this.viewParams.debug){
		teasp.manager.testInit('tsfArea');
	}

//    teasp.manager.dialogOpen('BusyWait', null, null);
	// サーバへリクエスト送信
	teasp.manager.request(
		'loadEmpMonth',
		this.viewParams,
		this.pouch,
		{ hideBusy : true },
		this,
		function(){
			if(this.pouch.isOldRevision()){
				teasp.locationHref(teasp.getPageUrl('convertView') + '?forwardURL=' + encodeURIComponent(teasp.getPageUrl('workTimeView')));
			}else if(!this.pouch.getEmpId()){
				teasp.locationHref(teasp.getPageUrl('empRegistView') + '?forwardURL=' + encodeURIComponent(teasp.getPageUrl('workTimeView')));
			}else{
				this.initMonthly();
			}
			onSuccess();
		},
		function(event){
			onFailure(event);
		}
	);
};

/**
 * 画面初期化
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.initMonthly = function(){
	teasp.setDeviceWidth();

	this.empWorkIn = this.pouch.isInputWorkingTimeOnWorkTImeView(); // 勤務表に工数入力ボタンを表示
	this.empAccsIn = this.pouch.isInputAccessControl(true); // 入退館管理機能を使用するかつ入退館管理対象者
	this.workLocIn = this.pouch.isUseWorkLocation(true); // 勤務場所入力

	var mainTable = this.buildMainTable();
	dojo.place(mainTable, dojo.byId('mainTableArea'));

	if(teasp.isNarrow()){
        dojo.style(dojo.body(),{ 'overflow':'visible'});
		dojo.query('.normal-width').forEach(function(el){
			dojo.style(el, 'display', 'none');
		});
		dojo.toggleClass('largeTableTop', 'ts-top-desktop', false);
		dojo.toggleClass('largeTableTop', 'ts-top-mobile' , true );
		dojo.style('mainTableArea'  , 'padding', '0px');
		dojo.style('mainTableBottom', 'padding', '0px');
		dojo.style('bottomSummaryTable', 'width', '100%');
		dojo.style('ts1TopView', 'display', '');
		// タイトル
		dojo.query('div.main-title').forEach(function(elem){
			elem.innerHTML = teasp.message.getLabel('workTable_label'); // 勤務表
		}, this);
	}else{
		dojo.style('expTopView', 'display', '');
		dojo.toggleClass('largeTableTop', 'ts-top-desktop', true );
		dojo.toggleClass('largeTableTop', 'ts-top-mobile' , false);
		// タイトル
		dojo.query('td.ts-top-title > div.main-title').forEach(function(elem){
			elem.innerHTML = teasp.message.getLabel('workTable_label'); // 勤務表
		}, this);
		dojo.query('td.ts-top-title > div.sub-title').forEach(function(elem){
			elem.innerHTML = teasp.message.getLabel('tf10004550'); // 勤務表(英語)
		}, this);
	}

	dojo.query('td.ts-top-empinfo td.ts-top-info-l > div.dept-name'   ).forEach(function(el){ el.innerHTML = teasp.message.getLabel('dept_label'); }); //部署
	dojo.query('td.ts-top-empinfo td.ts-top-info-l > div.emptype-name').forEach(function(el){ el.innerHTML = teasp.message.getLabel('empType_label'); }); // 勤務体系
	dojo.query('td.ts-top-empinfo td.ts-top-info-l > div.emp-name'    ).forEach(function(el){ el.innerHTML = teasp.message.getLabel('empName_label'); }); // 社員名

	dojo.byId('prevMonthButton').innerHTML = teasp.message.getLabel(teasp.isNarrow() && teasp.isEnglish() ? 'tf10000301' : 'tf10000300');  // <<
	dojo.byId('currMonthButton').innerHTML = teasp.message.getLabel('currMonth_btn_title'); // 今月
	dojo.byId('nextMonthButton').innerHTML = teasp.message.getLabel(teasp.isNarrow() && teasp.isEnglish() ? 'tf10000311' : 'tf10000310');  // <<

	dojo.byId('monthlyApplyButtonLabel').innerHTML = teasp.message.getLabel(teasp.isNarrow() ? 'mo00000009' : 'mo00000001'); // 月次残業申請

	dojo.query('div.info-cn').forEach(function(el){
		el.innerHTML = teasp.message.getLabel('info_btn_title'); // お知らせ
	});
	dojo.query('button.monthlySum > div').forEach(function(el){
		el.innerHTML = teasp.message.getLabel(teasp.isNarrow() && teasp.isEnglish() ? 'monthSummary_btn_omit' : 'monthSummary_btn_title'); // 月次サマリー
	});

	dojo.query('.pb_btn_prevm').forEach(function(elem){ dojo.connect(elem, 'onclick', this, this.changePrevMonth); elem.title = teasp.message.getLabel('prevMonth_button_title'); }, this); // 前月
	dojo.query('.pb_btn_currm').forEach(function(elem){ dojo.connect(elem, 'onclick', this, this.changeCurrMonth); elem.title = teasp.message.getLabel('currMonth_button_title'); }, this); // 今月
	dojo.query('.pb_btn_nextm').forEach(function(elem){ dojo.connect(elem, 'onclick', this, this.changeNextMonth); elem.title = teasp.message.getLabel('nextMonth_button_title'); }, this); // 次月
	dojo.query('button.apply-button').forEach(function(el){
		el.style.display = 'none';
	}, this);
	dojo.query('.infoButton').forEach(function(elem){ dojo.connect(elem, 'onclick', this, this.openInfoView);  elem.title = teasp.message.getLabel('info_button_title');         }, this); // お知らせ

	dojo.query('button.monthlySum').forEach(function(elem){ // 月次サマリーボタン
		dojo.style(elem, 'display', (this.pouch.isHideMonthlySummary() ? 'none' : ''));
		if(!this.pouch.isHideMonthlySummary()){
			dojo.connect(elem, 'onclick', this, this.openPrintView); elem.title = teasp.message.getLabel('monthSummary_button_title');
		}
	}, this);

	dojo.connect(dojo.byId('monthlyStatus'), 'onclick', this, this.openStatusView);
	dojo.byId('monthlyStatusH').innerHTML = (teasp.isNarrow() ? '' : teasp.message.getLabel('status_label'));
	dojo.byId('monthlyStatus').title = teasp.message.getLabel('status_button_title'); // ステータス

	dojo.style('bottomSummaryTable', 'display', (this.pouch.isHideBottomSummary() ? 'none' : ''));

	var pDiv = dojo.query((teasp.isNarrow() ? '#ts1TopPhoto' : '#expTopView td.ts-top-photo > div'))[0];
	var photoUrl = this.pouch.getSmallPhotoUrl();
	var photoDiv = null;
	if(photoUrl){
		photoDiv = dojo.create('img', {
			src       : photoUrl,
			className : 'smallPhoto'
		}, pDiv);
	}else{
		photoDiv = dojo.create('img', {
			className : 'pp_base pp_default_photo'
		}, pDiv);
	}
	if(!teasp.isNarrow()){
		if(!this.pouch.isHidePersonalInfo()){
			dojo.style(photoDiv, 'cursor', 'pointer');
			dojo.connect(photoDiv, 'onclick', this, this.openEmpView);
			photoDiv.title = teasp.message.getLabel('personal_link_title'); // 個人設定
		}
		var holyBtn = dojo.query('#holyLink > div');
		if(holyBtn){
			holyBtn[0].innerHTML = teasp.message.getLabel('tf10003620'); // 休暇情報
		}
		dojo.connect(dojo.byId('holyLink') , 'onclick', this, this.openHolidayView);
		dojo.connect(dojo.byId('empListButton'), 'onclick', this, this.openEmpList); // 社員月別リスト
	}else{
		// 写真タップでツールチップ表示切替
		// 個人設定/休暇情報/HELP のリンクをツールチップで表示する
		this.toolTipOn = false;
		dijit.Tooltip.showDelay = 0;
		dijit.Tooltip.hideDelay = 0;
		dojo.connect(photoDiv, 'onclick', this, function(){
			if(!this.toolTipOn){
				var dom = '';
				if(!this.pouch.isHidePersonalInfo()){
					dom += '<div id="ts1TopPersonalInfo"><a href="#" onclick="teasp.viewPoint.openEmpView();return false;">'
						+ teasp.message.getLabel('personal_link_title') // 個人設定
						+ '</a></div>';
				}
				dom += '<div id="ts1TopHolidayInfo"><a href="#" onclick="teasp.viewPoint.openHolidayView();return false;">'
					+ teasp.message.getLabel('tk10003220') // 休暇情報
					+ '</a></div>'
					+'<div id="ts1TopHelp"><a href="' + this.pouch.getHelpLink() + '">HELP</a></div>';
				dijit.Tooltip.show(dom, dojo.byId('ts1TopPhoto'));
			}else{
				dijit.Tooltip.hide(dojo.byId('ts1TopPhoto'));
			}
			this.toolTipOn = !this.toolTipOn;
		});
		dojo.connect(dojo.byId('ts1TopPhoto'), 'onmouseleave', this, function(){
			if(this.toolTipOn){
				dijit.Tooltip.hide(dojo.byId('ts1TopPhoto'));
				this.toolTipOn = !this.toolTipOn;
			}
		});
		dojo.connect(dojo.byId('empListButton2'), 'onclick', this, this.openEmpList); // 社員月別リスト
	}

	var helpLinks = dojo.query('td.ts-top-button3 > a', dojo.byId('expTopView'));
	if(helpLinks.length > 0){
		helpLinks[0].href = this.pouch.getHelpLink();
	}

	dojo.connect(dojo.byId('yearMonthList'), 'onchange', this, this.changedMonthSelect); // 月度選択リスト

	//--------------------------------------------------------------------------------
	// 裏コマンド 出退時刻一括入力
	//--------------------------------------------------------------------------------
	if(this.pouch.isBulkInputOn()){
		dojo.byId('startTimeColumn').style.cursor = 'pointer';
		dojo.byId('endTimeColumn'  ).style.cursor = 'pointer';
		dojo.connect(dojo.byId('startTimeColumn'), 'onclick', this, this.openBulkInput);
		dojo.connect(dojo.byId('endTimeColumn'  ), 'onclick', this, this.openBulkInput);
	}
	//--------------------------------------------------------------------------------
	if(this.viewParams.verify){
		this.pouch.setAutoVerify(true);
	}
	if(this.pouch.isAutoVerify()){ // 勤怠計算自動ベリファイがオン
		// 画面左上の勤務表ロゴのクリックで、ベリファイ結果画面を表示するようにする。
		dojo.query('#expTopView .ts-top-logo div.work-list').forEach(function(el){
			dojo.style(el, 'cursor', 'pointer');
			dojo.connect(el, 'click', this, this.openVerify);
		}, this);
	}

	// 表の項目名
	dojo.byId('dateColumn').innerHTML      = teasp.message.getLabel('date_head');      // 日付
	dojo.byId('stateColumn').innerHTML     = teasp.message.getLabel('state_head');     // 勤務<br/>状況
	dojo.byId('applyColumn').innerHTML     = teasp.message.getLabel('apply_head');     // 申請
	dojo.byId('startTimeColumn').innerHTML = teasp.message.getLabel('startTime_head'); // 出社
	dojo.byId('endTimeColumn').innerHTML   = teasp.message.getLabel('endTime_head');   // 退社
	dojo.byId('teleworkColumn').innerHTML  = teasp.message.getLabel('tw00000010');     // 勤務場所
	dojo.byId('accColumn').innerHTML       = teasp.message.getLabel('ac00000280');     // 乖離<br/>状況
	dojo.byId('jobColumn').innerHTML       = teasp.message.getLabel('jobTime_head');   // 工数
	dojo.byId('noteColumn').innerHTML      = teasp.message.getLabel('note_head');      // 備考

	this.gw1off = (this.empWorkIn ? this.empWorkWidth : 0);
	this.gw2off = (this.empAccsIn ? this.empAccsWidth : 0);
	this.gw3off = (this.workLocIn ? this.workLocWidth : 0);

	var d = dojo.byId('graphDiv');
	if(d){
		dojo.connect(d, 'onmousedown', this, function(_e){
			var e = (_e ? _e : window.event);
			this.viewPos = { x: e.clientX };
		});
		dojo.connect(d, 'onmousemove', this, function(_e){
			if(!this.viewPos){
				return;
			}
			var e = (_e ? _e : window.event);
			d.scrollLeft -= (e.clientX - this.viewPos.x);
			this.viewPos.x = e.clientX;
		});
		dojo.connect(d, 'onmouseup', this, function(_e){
			this.viewPos = null;
		});
	}

	this.refreshMonthly();

	dojo.query('.inputime').forEach(function(elem) {
		dojo.connect(elem, 'blur'      , this, teasp.util.time.onblurTime);
		dojo.connect(elem, 'onkeypress', this, teasp.util.time.onkeypressTime);
	}, this);

	var initInfoButton = function(){
		if(this.pouch.isNonDialogMode() || teasp.isSforce1() || this.pouch.isNotInfoAutoView()){
			dojo.query('div.info-icon').forEach(function(el){ // お知らせボタンのアイコン
				dojo.toggleClass(el, 'info-an', true);
				dojo.toggleClass(el, 'info-bl', false);
			});
		}else{
			this.openInfoView();
		}
	};

	this.disposeInit(dojo.hitch(this, function(result){
		if(result){
			if(this.pouch.getAllInfoCount() > 0){ // お知らせがあればお知らせダイアログを表示
				initInfoButton.apply(this);
				teasp.manager.dialogClose('BusyWait');
			}else if(dojo.isIE <= 7){
				teasp.manager.dialogOpen('BusyWait', null, null);
				setTimeout(function(){
					teasp.manager.dialogClose('BusyWait');
				}, 500);
			}else{
				teasp.manager.dialogClose('BusyWait');
			}
		}else{
			teasp.manager.dialogClose('BusyWait');
		}
	}));

	setTimeout(dojo.hitch(this, this.resizeArea), 50);

	var sideBarButton = dojo.byId('handlebarContainer'); // Salesforce領域のサイドバー開閉ボタンのID
	if(sideBarButton){
		dojo.connect(sideBarButton, 'onclick', this, function(){
			setTimeout(dojo.hitch(this, this.resizeArea), 50);
		});
	}
	dojo.style('largeTable', 'display', '');

	// 参照モードの場合、モードを表示
	this.viewPlus();
	this.viewPostProcess();

//	dojo.empty('debugArea');
//	dojo.create('input', { type:'text', style:'width:300px;', value: navigator.userAgent /* '' + window.innerWidth + ' x ' + window.innerHeight*/ }, dojo.byId('debugArea'));
};

teasp.view.Monthly.prototype.resizeArea = function(){
	var graphArea = dojo.byId('graphDiv');
	if(!graphArea){
		return;
	}
	try{
		var w = window.innerWidth; // ウィンドウ幅を得る
		if(this.prevWidth && Math.abs(this.prevWidth - w) < 10){
			return;
		}
		if(!teasp.isSforce1()){ // Salesforce1の場合は固定幅
			var bc = dojo.byId('bodyCell');
			if(bc){
				w -= bc.offsetLeft; // （サイドバー幅を引く）
			}
			if(w < 768){ // 最低幅= 768
				w = 768;
			}
		}
		var lw = w - (508 + (teasp.isSforce1() ? 0 : 8) + this.gw1off + this.gw2off + this.gw3off); // グラフエリア幅
		if(lw > 976){
			lw = 976; // グラフエリア幅の最大
		}
		this.prevWidth = w;
		dojo.query('.graph_area').forEach(function(el){
			el.style.width = '' + lw + 'px';
			dojo.byId('graphDiv').style.width = '' + lw + 'px';
		}, this);
	}catch(e){
	}
};

teasp.view.Monthly.prototype.adjustGraphAreaScroll = function(){
	var div = dojo.byId('graphDiv');
	if(div){
		var w = div.offsetWidth;
		var x = Math.max(0, 140 - (!w || w <= 380 ? 0 : w - 380));
		div.scrollLeft = x; // 初期表示水平スクロール位置
	}
};

/**
 * 有休消化する休暇申請の却下または勤務確定の却下のクリーンアップ実行
 *
 * @param {Object} spendReject
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
teasp.view.Monthly.prototype.cleanupEmpReject = function(spendReject, onSuccess, onFailure){
	teasp.manager.request(
		'cleanupEmpReject',
		{
			empId     : this.pouch.getEmpId(),
			month     : spendReject.month,
			currMonth : this.pouch.getYearMonth(),
			currSubNo : this.pouch.getSubNo(),
			accLog    : this.pouch.isInputAccessControl()
		},
		this.pouch,
		{ hideBusy : true },
		this,
		onSuccess,
		onFailure
	);
};

/**
 * 直行･直帰申請の却下または取消のクリーンアップ
 *
 * @param {Array.<Object>} applyList
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
teasp.view.Monthly.prototype.cleanupDirectApply = function(applyList, onSuccess, onFailure){
	var lst = [];
	var dm = {};
	for(var i = 0 ; i < applyList.length ; i++){
		var a = applyList[i];
		if(!a.directFlag || a.entered){ // a.entered==true は、クリーンアップ済み
			continue;
		}
		var dlst = teasp.util.date.getDateList(a.startDate, a.endDate);
		var directFlag = a.directFlag;
		for(var j = 0 ; j < dlst.length ; j++){
			var dkey = dlst[j];
			var dw = this.pouch.getEmpDay(dkey);
			if(!dw.isValid()){
				continue;
			}
			var orgSt = dw.getStartTime(true, null, teasp.constant.C_REAL); // 入力済みの出社時刻
			var orgEt = dw.getEndTime(true, null, teasp.constant.C_REAL);   // 入力済みの退社時刻
			if(orgSt === ''){ orgSt = null; }
			if(orgEt === ''){ orgEt = null; }
			var newSt = ((directFlag & 1) ? null : orgSt);
			var newEt = ((directFlag & 2) ? null : orgEt);
			if(orgSt != newSt || orgEt != newEt){
				var tt = dw.createTimeTable(newSt, newEt);
				lst.push({
					date       : dkey,
					timeTable  : tt,
					empApplyId : a.id, // Entered__cをオンにするためにこれをセットする
					clearWorkLocation: (a.applyType == teasp.constant.APPLY_TYPE_KYUSHTU && dw.getWorkLocationId() && !newSt && !newEt ? true : false) // 出退社クリアなら勤務場所クリア
				});
				dm[dkey] = 1;
			}
		}
	}
	for(i = 0 ; i < applyList.length ; i++){
		var a = applyList[i];
		if(a.directFlag || dm[a.startDate]){
			continue;
		}
		var dw = this.pouch.getEmpDay(a.startDate);
		if(!dw.isValid()){
			continue;
		}
		var orgSt = dw.getStartTime(true, null, teasp.constant.C_REAL); // 入力済みの出社時刻
		var orgEt = dw.getEndTime(true, null, teasp.constant.C_REAL);   // 入力済みの退社時刻
		if(orgSt === ''){ orgSt = null; }
		if(orgEt === ''){ orgEt = null; }
		var directFlag = dw.getInputLimit().flag;
		var tt = dw.createTimeTableFix(directFlag);
		var newSt = null, newEt = null;
		for(var j = 0 ; j < tt.length ; j++){
			if(tt[j].type == 1){
				newSt = tt[j].from;
				newEt = tt[j].to;
				break;
			}
		}
		if(orgSt != newSt || orgEt != newEt){
			lst.push({
				date       : a.startDate,
				timeTable  : tt,
				clearWorkLocation: (a.applyType == teasp.constant.APPLY_TYPE_KYUSHTU && dw.getWorkLocationId() && !newSt && !newEt ? true : false) // 出退社クリアなら勤務場所クリア
			});
			dm[a.startDate] = 1;
		}
	}
	if(lst.length <= 0){
		onSuccess.apply(this);
		return;
	}
	var index = 0;
	var f = null;
	f = dojo.hitch(this, function(){
		var req = {
			empId             : this.pouch.getEmpId(),
			month             : this.pouch.getYearMonth(),
			startDate         : this.pouch.getStartDate(),
			lastModifiedDate  : this.pouch.getLastModifiedDate(),
			mode              : this.pouch.getMode(),
			date              : lst[index].date,
			dayFix            : false,
			client            : teasp.constant.APPLY_CLIENT_MONTHLY,
			timeTable         : lst[index].timeTable,
			refreshWork       : true,
			clearWork         : false,
			empApplyId        : lst[index].empApplyId || null,
			useInputAccessControl : this.pouch.isInputAccessControl()
		};
		if(lst[index].clearWorkLocation){ // 勤務場所クリア
			req.workLocationId = null;
		}
		teasp.manager.request(
			'inputTimeTable',
			req,
			this.pouch,
			{ hideBusy : true },
			this,
			function(){
				index++;
				if(index < lst.length){
					setTimeout(f, 100);
				}else{
					onSuccess.apply(this);
				}
			},
			onFailure
		);
	});
	f();
};

/**
 * 勤怠時刻修正申請の承認済みかつ未反映のものを反映させる処理
 *
 * @param {Object} reviseApply
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
teasp.view.Monthly.prototype.reviseApplyEnter = function(reviseApply, onSuccess, onFailure){
	var empDay = this.pouch.getEmpDay(reviseApply.startDate);
	var tt = empDay.getReviseTimeTable(reviseApply);

	var ngFlag = false;
	for(var i = 0 ; i < tt.length ; i++){
		var t = tt[i];
		if(t.type == 1 && typeof(t.from) == 'number' && typeof(t.to) == 'number' && t.from >= t.to){
			ngFlag = true; // 出社時刻≧退社時刻になってしまったので、反映処理を走らせない
			break;
		}
	}
	teasp.manager.request(
		'inputTimeTable',
		{
			empId            : this.pouch.getEmpId(),
			month            : this.pouch.getYearMonth(),
			startDate        : this.pouch.getStartDate(),
			lastModifiedDate : this.pouch.getLastModifiedDate(),
			mode             : this.pouch.getMode(),
			date             : reviseApply.startDate,
			dayFix           : false,
			client           : teasp.constant.APPLY_CLIENT_MONTHLY,
			timeTable        : tt,
			empApplyId       : reviseApply.id,
			ngFlag           : ngFlag,
			refreshWork      : this.pouch.isInputWorkingTimeOnWorkTImeView(),
			useInputAccessControl : this.pouch.isInputAccessControl()
		},
		this.pouch,
		{ hideBusy : true },
		this,
		onSuccess,
		onFailure
	);
};

/**
 * 画面初期表示直後に行う処理
 *
 * @param {Function} onFinish
 */
teasp.view.Monthly.prototype.disposeInit = function(onFinish){
	var methods = [];
	var mIndex = 0;
	var reloadFlag = false;
	var disposeLoop = dojo.hitch(this, function(){
		if(mIndex >= methods.length){
			if(mIndex > 0){
				if(reloadFlag){
					this.changeMonth(this.pouch.dataObj.month);
				}else{
					this.refreshMonthly2();
					setTimeout(function(){
						teasp.manager.dialogClose('BusyWait');
					}, 500);
				}
			}
			onFinish(true);
		}else{
			if(mIndex == 0){
				teasp.manager.dialogOpen('BusyWait', null, null);
			}
			methods[mIndex++]();
		}
	});
	var spendReject = this.pouch.getDirtyApplys();
	reloadFlag = spendReject.reload;
	if(spendReject.directs.length > 0){  // 直行・直帰申請の却下or取消がある
		methods.push(dojo.hitch(this, function(){
			var lst = spendReject.directs;
			return dojo.hitch(this, function(){
				this.cleanupDirectApply(lst, function(){
					setTimeout(dojo.hitch(this, disposeLoop), 100);
				}, function(event){
					teasp.message.alertError(event);
					onFinish(false);
				});
			});
		})());
	}
	if(spendReject.lst.length > 0){  // 有休消化する休暇申請の却下または勤務確定の却下がある
		methods.push(dojo.hitch(this, function(){
			var sr = spendReject;
			return dojo.hitch(this, function(){
				this.cleanupEmpReject(sr, function(){
					setTimeout(dojo.hitch(this, disposeLoop), 100);
				}, function(event){
					teasp.message.alertError(event);
					onFinish(false);
				});
			});
		})());
	}
	var reviseApplys = this.pouch.getReviseTimeApplys();
	for(var i = 0 ; i < reviseApplys.length ; i++){
		methods.push(dojo.hitch(this, function(){
			var ra = reviseApplys[i];
			return dojo.hitch(this, function(){
				this.reviseApplyEnter(ra, function(){
					ra.entered = true; // 反映済みフラグを更新
					setTimeout(dojo.hitch(this, disposeLoop), 100);
				}, function(event){
					teasp.message.alertError(event);
					onFinish(false);
				});
			});
		})());
	}
	disposeLoop();
};

/**
 * 勤務表を構築
 *
 * @param {boolean=} flag true:有休消化する休暇申請の却下または勤務確定の却下があるかチェックして、あればクリーンアップを実行
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.refreshMonthly = function(flag){
	this.pouch.clearClassifyJobWorks();
	dojo.query('.atk_link_help').forEach(function(elem){
		elem.href = this.pouch.getHelpLink();
	}, this);
	this.rangeYear = this.pouch.getDateRangeOfMonth(teasp.util.date.getToday(), 13, -12);

	this.createMonthList();

	this.refreshContents();
	this.viewPostProcess();
	this.resizeArea();

	if(flag){
		this.disposeInit(function(){
			teasp.manager.dialogClose('BusyWait');
			teasp.manager.testSignal();
		});
	}else{
		teasp.manager.testSignal();
	}
};

/**
 * 勤務表にデータをセット
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.refreshMonthly2 = function(){
	this.pouch.clearClassifyJobWorks();
	this.refreshContents();
	this.viewPostProcess();

	teasp.manager.testSignal();
};

/**
 * 勤務表のリフレッシュ
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.refreshContents = function(){
	var r, div, val, mm = 0, cell;

	this.empWorkIn = this.pouch.isInputWorkingTimeOnWorkTImeView(); // 勤務表に工数入力ボタンを表示
	this.empAccsIn = this.pouch.isInputAccessControl(true); // 入退館管理機能を使用するかつ入退館管理対象者
	this.workLocIn = this.pouch.isUseWorkLocation(true); // 勤務場所入力
	var tbody = dojo.byId('mainTableBody');
	var dateList = this.pouch.getMonthDateList();
	var calcType = (this.pouch.isDiscretionaryOption() ? teasp.constant.C_REAL : teasp.constant.C_DISC);

	var gt = dojo.byId('graphTable');
	var adjustTag = dojo.byId("ruler2");
	var readOnly = (this.pouch.isEmpMonthFixed() || this.pouch.isReadOnly());
	var high = this.pouch.isHighlightLateEarly();
	var chkWrk = (this.pouch.isCheckWorkingTime() || this.pouch.isCheckWorkingTimeMonthly()); // 工数入力時間のチェックをする（日次確定時 or 月次確定時）

	dojo.query('td.hacc,td.vacc,#accColumnProp', dojo.byId('mainTable')).forEach(function(el){
		dojo.style(el, 'display', (this.empAccsIn ? '' : 'none'));
	}, this);
	dojo.query('td.htelework,td.vtelework,#telColumnProp', dojo.byId('mainTable')).forEach(function(el){
		dojo.style(el, 'display', (this.workLocIn ? '' : 'none'));
	}, this);
	dojo.query('td.hjob,td.vjob,#jobColumnProp', dojo.byId('mainTable')).forEach(function(el){
		dojo.style(el, 'display', (this.empWorkIn ? '' : 'none'));
	}, this);
//	dojo.attr(dojo.query('td.foot', dojo.byId('mainTable'))[0], 'colSpan', (this.empAccsIn ? 8 : (this.empWorkIn ? 7 : 6)));
	this.gw1off = (this.empWorkIn ? this.empWorkWidth : 0);
	this.gw2off = (this.empAccsIn ? this.empAccsWidth : 0);
	this.gw3off = (this.workLocIn ? this.workLocWidth : 0);

	var row = tbody.rows[0];

	for(var i = 0 ; i < this.eventHandles.length ; i++){
		dojo.disconnect(this.eventHandles[i]);
		delete this.eventHandles[i];
	}
	this.eventHandles = [];
	teasp.manager.testReset();

	for(r = 0 ; r < dateList.length ; r++){
		var dkey = dateList[r];
		var dayWrap = this.pouch.getEmpDay(dkey);
		var dayFix = dayWrap.isExistApply(teasp.constant.APPLY_KEY_DAILY);
		var aliveDay = this.pouch.isAlive(dkey);
		var seed = { dkey: dkey };

		var d = teasp.util.date.parseDate(dkey);
		val = '' + d.getDate();
		if(mm != (d.getMonth() + 1)){
			val = '' + (d.getMonth() + 1) + '/' + val;
			mm = (d.getMonth() + 1);
		}

		var stjdg = dayWrap.getStartTimeJudge();
		var etjdg = dayWrap.getEndTimeJudge();

		row = tbody.rows[r + 1];
		row.id = 'dateRow' + dkey;
		var dayType = dayWrap.getDayType();
		var xdType = dayType;
		if(dayWrap.getHolidayFlag() == 3 || dayWrap.isPlannedHoliday()){
			xdType = 4;
		}
		if(xdType == 0){
			row.className = 'days ' + ((r%2) === 0 ? 'even' : 'odd');
			if(gt){
				gt.rows[r + 1].className = 'dayLine  ' + ((r%2) === 0 ? 'dl_even' : 'dl_odd');
			}
		}else{
			row.className = 'days rowcl' + xdType;
			if(gt){
				gt.rows[r + 1].className = 'dayLine rowcl' + xdType;
			}
		}
		dojo.style(row           , 'display', '');
		dojo.forEach(row.cells           , function(cell){ dojo.removeClass(cell, 'bot-border'); });
		if(gt){
			dojo.style(gt.rows[r + 1], 'display', '');
			dojo.forEach(gt.rows[r + 1].cells, function(cell){ dojo.removeClass(cell, 'bot-border'); });
		}

		// 日付
		cell = dojo.query('td.vdate', row)[0];
		dojo.empty(cell);
		div = dojo.create('div', { style : { width:"51px", margin:"0px", padding:"0px", position:"relative" } }, cell);
		dojo.create('div', { innerHTML : val, style : { marginTop:"auto" } }, div);
		var dayApply = dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_DAILY, true);
		if(dayFix){
			var dayLock = dojo.create('div', {
				id        : 'ttvDayFix' + dkey,
				className : 'dayFix ts-status-img ts-ap_day' + teasp.constant.getStatusStyleSuffix(dayWrap.getApplyStatus(teasp.constant.APPLY_KEY_DAILY)),
				style     : { cursor:"pointer" },
				title     : teasp.message.getLabel('tm10001690') // 日次確定
							+ teasp.message.getLabel('tm10001680', teasp.constant.getDisplayStatus(dayWrap.getApplyStatus(teasp.constant.APPLY_KEY_DAILY))) // ステータス
			}, div);
			if(dayApply){
				this.eventHandles.push(dojo.connect(dayLock, 'onclick', this, this.openEmpApply(dkey, dayApply.id)));
				seed.dayFixed = true;
			}
		}else if(!readOnly && aliveDay && dayWrap.isInputable()){
			div.style.height = '20px';
			if(this.pouch.isUseDailyApply() && this.pouch.isSeparateDailyFixButton()){ // 日次確定申請を使用かつ日次確定ボタンを独立させる
				var dayLock = dojo.create('div', {
					id        : 'ttvDayFix' + dkey,
					className : 'dayFix png-add',
					style     : { cursor:"pointer" },
					title     : teasp.message.getLabel('tm10001690') // 日次確定
				}, div);
				this.eventHandles.push(dojo.connect(dayLock, 'onclick', this, this.applyDailyFix(dkey, (dayApply ? dayApply.id : null))));
				seed.dayFixable = true;
			}
		}
		if(!this.pouch.isDisabledTimeReport() && !teasp.isNarrow()){
			if(teasp.isDisplayingPcVersionOnTs1()){
				//タイムレポート遷移無効
			}else{
				this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.openTimeReport(teasp.util.date.formatDate(d, 'yyyyMMdd'))));
				cell.style.cursor = 'pointer';
				cell.title = teasp.message.getLabel('timeReport_link_title'); // タイムレポートへ
			}
		}
		cell.style.fontWeight = (dayWrap.isToday() ? 'bold' : 'normal');

		// 曜日
		cell = dojo.query('td.vweek', row)[0];
		cell.innerHTML = teasp.util.date.formatDate(dkey, 'JPW');
		if(!this.pouch.isDisabledTimeReport() && !teasp.isNarrow()){
			if(teasp.isDisplayingPcVersionOnTs1()){
				//タイムレポート遷移無効
			}else{
				this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.openTimeReport(teasp.util.date.formatDate(d, 'yyyyMMdd'))));
				cell.style.cursor = 'pointer';
				cell.title = teasp.message.getLabel('timeReport_link_title'); // タイムレポートへ
			}
		}
		cell.style.fontWeight = (dayWrap.isToday() ? 'bold' : 'normal');
		var wd = d.getDay();
		if(wd == 0){ // 曜日の文字色を日曜は赤、土曜は青に
			cell.style.color = 'red';
		}else if(wd == 6){
			cell.style.color = 'blue';
		}else{
			cell.style.color = '#222222';
		}

		// 勤務状況
		cell = dojo.query('td.vstatus', row)[0];
		cell.title = dayWrap.getDayTitle();
		div = cell.firstChild;
		div.className = (aliveDay ? dayWrap.getDayIconClass() : '');
		dojo.empty(div);
		if(dayWrap.isRestLack()){
			div.style.position = 'relative';
			dojo.create('div', { className: 'statex pp_base pp_exclamation', title: teasp.message.getLabel('tm10002130') }, div); // 休憩時間が不足しています
		}

		// 申請
		cell = dojo.query('td.vapply', row)[0];
//        cell.className = 'dval vapply day_btn' + dayType;
		cell.className = 'dval vapply';
		var apply = dayWrap.getTypicalEmpApply();
		if(apply && !apply.close && (!apply.decree || apply.applyType == teasp.constant.APPLY_TYPE_HOLIDAY)){
			if(teasp.constant.STATUS_APPROVES.contains(apply.status)){ // 承認済み
				cell.firstChild.className = 'ts-status-img ts-s-approve';
				cell.title = teasp.constant.getDisplayStatus(apply.status);
			}else if(teasp.constant.STATUS_REJECTS.contains(apply.status)){ // 却下
				cell.firstChild.className = 'ts-status-img ts-s-reject';
				cell.title = teasp.constant.getDisplayStatus(apply.status);
			}else if(teasp.constant.STATUS_WAIT == apply.status){ // 「承認待ち」
				cell.firstChild.className = 'ts-status-img ts-s-wait';
				cell.title = teasp.constant.getDisplayStatus(apply.status);
			}else{
				cell.firstChild.className = 'png-add';
				cell.title = teasp.message.getLabel('dayApply_caption'); // 勤怠関連申請
			}
		}else{
			cell.firstChild.className = 'png-add';
			cell.title = teasp.message.getLabel('dayApply_caption'); // 勤怠関連申請
		}

		if(!aliveDay
		|| (!apply && readOnly)){
			cell.style.cursor = 'default';
		}else{
			cell.style.cursor = 'pointer';
			// 日付が本日日付の前後１年以内またはその制限が解除されている場合のみ申請できる
			if((teasp.util.date.compareDate(this.rangeYear.from, d) <= 0 && teasp.util.date.compareDate(this.rangeYear.to, d) >= 0)
			|| this.pouch.isApplyLimitOff()){
				this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.openEmpApply(dkey)));
				cell.id = 'ttvApply' + dkey;
				seed.applyable = true;
			}else{
				this.eventHandles.push(dojo.connect(cell, 'onclick', this, function(){
					 // 申請を行うことができるのは現在月の前後１２ヶ月度以内です
					 teasp.tsAlert(teasp.message.getLabel('tm10001050'), this);
				}));
			}
		}
		// 出社時刻
		cell = dojo.query('td.vst', row)[0];
		cell.style.color  = (aliveDay && high && dayWrap.getLateFlag() == 1 ? '#cc0000' : '#222222');
		if(!aliveDay){
			cell.className    = 'dval vst';
			cell.style.cursor = '';
			cell.innerHTML    = '';
		}else if(readOnly || dayFix){
			if(dayWrap.isInputTime()){
				cell.style.cursor = 'pointer';
				this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.openInputTime(dkey)));
				cell.innerHTML    = dayWrap.getStartTime(false, null, calcType);
				var fn = (stjdg < 0 ? 5 : (stjdg == 2 ? 7 : 0));
				cell.className = 'dval vst' + (fn ? ' day_time' + fn : '');
			}else{
				cell.className    = 'dval vst';
				cell.style.cursor = '';
				cell.innerHTML    = '';
			}
		}else{
			if(dayWrap.isInputable()){
				var fn = (stjdg < 0 ? 4 : (stjdg == 2 ? 6 : 0));
				cell.className    = 'dval vst day_time' + fn;
				cell.style.cursor = 'pointer';
				this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.openInputTime(dkey)));
				cell.innerHTML    = dayWrap.getStartTime(false, null, calcType);

				cell.id = 'ttvTimeSt' + dkey;
				seed.inputable = true;
			}else{
				cell.className    = 'dval vst';
				cell.style.cursor = '';
				cell.innerHTML    = '';
			}
		}

		// 退社時刻
		cell = dojo.query('td.vet', row)[0];
		cell.style.color  = (aliveDay && high && dayWrap.getEarlyFlag() == 1 ? '#cc0000' : '#222222');
		if(!aliveDay){
			cell.className    = 'dval vet';
			cell.style.cursor = '';
			cell.innerHTML    = '';
		}else if(readOnly || dayFix){
			if(dayWrap.isInputTime()){
				cell.style.cursor  = 'pointer';
				this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.openInputTime(dkey)));
				cell.innerHTML     = dayWrap.getEndTime(false, null, calcType);
				var fn = (etjdg < 0 ? 5 : (etjdg == 2 ? 7 : 0));
				cell.className = 'dval vet' + (fn ? ' day_time' + fn : '');
			}else{
				cell.className    = 'dval vet';
				cell.style.cursor = '';
				cell.innerHTML    = '';
			}
		}else{
			if(dayWrap.isInputable()){
				var fn = (etjdg < 0 ? 4 : (etjdg == 2 ? 6 : 0));
				cell.className    = 'dval vet day_time' + fn;
				cell.style.cursor = 'pointer';
				this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.openInputTime(dkey)));
				cell.innerHTML     = dayWrap.getEndTime(false, null, calcType);
			}else{
				cell.className     = 'dval vet';
				cell.style.cursor  = '';
				cell.innerHTML     = '';
			}
		}

		// 勤務場所
		if(this.workLocIn){
			cell = dojo.query('td.vtelework', row)[0];
			var showWorkLocation = false;
			if(aliveDay){
				if(dayWrap.isInputTime() || dayWrap.isInputable()){
					cell.style.cursor  = 'pointer';
					cell.className = 'dval vtelework' + (readOnly || dayFix ? '' : ' day_tele0');
					this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.openInputTime(dkey)));
					dojo.empty(cell);
					dojo.create('div', {
						innerHTML: dayWrap.getWorkLocationName(),
						title    : dayWrap.getWorkLocationName()
					}, dojo.create('div', { className:'tele' }, cell));
					showWorkLocation = true;
				}
			}
			if(!showWorkLocation){
				cell.className     = 'dval vtelework';
				cell.style.cursor  = '';
				cell.innerHTML     = '';
			}
		}
		// 乖離状況
		if(this.empAccsIn){
			cell = dojo.query('td.vacc', row)[0];
			cell.id = 'dailyAccsCell' + dkey;
			cell.className = 'dval vacc';
			dojo.empty(cell);
			var div = dojo.create('div', { style: 'margin:auto;' }, dojo.create('div', null, cell));
			var o = dayWrap.getDivergenceJudge();
			dojo.style(cell, 'cursor', (o.css ? 'pointer' : 'default'));
			if(o.css){
				dojo.addClass(div, o.css);
				if(aliveDay){
					this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.openDivergenceReason(dkey))); // 乖離理由入力
				}
			}
			dojo.attr(cell, 'title', (o.title || ''));
		}

		// 工数入力
		if(this.empWorkIn){
			cell = dojo.query('td.vjob', row)[0];
			cell.id = 'dailyWorkCell' + dkey;
			var classifyJobWorks = (this.pouch.getObj().works ? this.pouch.getClassifyJobWorks(dkey) : null);
			var jobbtn = ((aliveDay && dayWrap.isInputable()) || (classifyJobWorks && (classifyJobWorks.sumTime > 0 || classifyJobWorks.sumVolume > 0)));
			cell.className = 'dval vjob';
			dojo.empty(cell);
			if(jobbtn){
				var nt = dayWrap.getDaySubTimeByKey('workRealTime', true, 0, null, teasp.constant.C_REAL);
				var wng = ((nt > 0 || classifyJobWorks.sumTime > 0) && nt != classifyJobWorks.sumTime);
				var div = dojo.create('div', { style: { position:"relative", paddingLeft:'0px' } }, cell);
				if(chkWrk && wng){
					dojo.create('div', { className : 'workng pp_base pp_exclamatio2' }, div);
					div.title = teasp.message.getLabel('tf10007310'); // 実労働時間と工数入力時間に差異があります
				}
				if(classifyJobWorks && classifyJobWorks.sumTime > 0){
					dojo.create('div', {
						style     : { margin:"auto", fontSize:"11px" },
						className : 'work-job-time',
						id        : 'dailyWorkButton' + dkey,
						innerHTML : teasp.util.time.timeValue(classifyJobWorks.sumTime)
					}, div);
				}else if(classifyJobWorks && classifyJobWorks.sumVolume > 0){
					dojo.create('div', {
						style     : { margin:"auto", fontSize:"11px", paddingTop:"4px" },
						className : 'work-job-time',
						id        : 'dailyWorkButton' + dkey,
						innerHTML : '* *'
					}, div);
				}else {
					dojo.create('div', {
						style     : { margin:"auto", paddingTop:"4px" },
						className : 'png-add'
					}, div);
				}
				this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.openWorkBalance(dkey)));
				cell.style.cursor = 'pointer';
			}else{
				cell.style.cursor = 'default';
			}
		}

		// 備考アイコン
		cell = dojo.query('td.vbttn', row)[0];
		cell.title = teasp.message.getLabel('note_btn_title'); // 備考入力
		cell.id = 'dailyNoteIcon' + dkey;
		dojo.empty(cell);
		if(aliveDay){
			this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.openNote(dkey)));
		}
		var note = dayWrap.getDayNote(!this.pouch.isSeparateDailyNote());
		div = dojo.create('div', { style: { marginLeft:"auto", marginRight:"auto" } }, cell);
		div.className = 'png-add';
		if(this.noteWidth < 2 && note){
			dojo.create('div', { style:"position:absolute;bottom:1px;right:1px;", innerHTML:"..." }, cell);
		}

		// 備考
		cell = dojo.query('td.vnote', row)[0];
		cell.id = 'dailyNote' + dkey;
		dojo.empty(cell);
		var s_margin = 0;
		if(dayWrap.isExistApply(teasp.constant.APPLY_KEY_SHIFT)){
			div = dojo.create('div', {
				className : 'pp_base pp_shift_done',
				style     : { "float":"left", cursor:"pointer", marginRight:"2px", marginTop:"2px" }
			}, cell);
			var f = this.openEmpApply(dkey, dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_SHIFT).id);
			this.eventHandles.push(dojo.connect(div, 'onclick', this, f));
			s_margin += 17;
			var wp = dayWrap.getWorkPlaceSymbol();
			if(wp){
				div = dojo.create('div', {
					innerHTML : wp,
					className : 'workPlace',
					style     : { "float":"left", cursor:"pointer" }
				}, cell);
				this.eventHandles.push(dojo.connect(div, 'onclick', this, f));
				s_margin += 40;
			}
		}
		cell.title = note;
		var note_ = teasp.util.entitize(note.replace(/\r\n|\r|\n/g, ' '), '');
		var w = Math.max(this.noteWidth - s_margin - 16, 0);
		if(w){
			var noteArea = dojo.create('div', { style:"overflow-x:hidden;max-width:" + w + "px;", className:"note-area" }, cell);
			dojo.create('div', { innerHTML:note_, style:"white-space:nowrap;display:table;" }, noteArea);
			dojo.create('div', { style:"position:absolute;bottom:2px;right:2px;display:none;", innerHTML:"...", className:"note-cont" }, cell);
		}

		teasp.manager.testSeed(seed);
	}
	var rcnt = r;
	while(r < 31){
		row = tbody.rows[r + 1];
		row.className = 'days ' + ((r%2) === 0 ? 'even' : 'odd');
		dojo.style(row, 'display', 'none');
		if(gt){
			gt.rows[r + 1].className = 'dayLine  ' + ((r%2) === 0 ? 'dl_even' : 'dl_odd');
			dojo.style(gt.rows[r + 1], 'display', 'none');
		}

		// 日付
		cell = dojo.query('td.vdate', row)[0];
		cell.innerHTML = '';
		cell.style.cursor = 'default';
		cell.style.fontWeight = 'normal';
		cell.title = '';

		// 曜日
		cell = dojo.query('td.vweek', row)[0];
		cell.innerHTML = '';
		cell.style.cursor = 'default';
		cell.style.fontWeight = 'normal';
		cell.title = '';

		// 勤務状況
		cell = dojo.query('td.vstatus', row)[0];
		cell.title = '';
		cell.firstChild.className = '';

		// 申請
		cell = dojo.query('td.vapply', row)[0];
		cell.className = 'dval vapply';
		cell.firstChild.className = '';
		cell.title = '';
		cell.style.cursor = 'default';

		// 出社時刻
		cell = dojo.query('td.vst', row)[0];
		cell.className = 'dval vst';
		cell.style.cursor = 'default';
		cell.innerHTML = '';

		// 退社時刻
		cell = dojo.query('td.vet', row)[0];
		cell.className = 'dval vet';
		cell.style.cursor = 'default';
		cell.innerHTML = '';

		// 乖離状況
		if(this.empAccsIn){
			cell = dojo.query('td.vacc', row)[0];
			cell.className = 'dval vacc';
			if(cell.firstChild){
				cell.firstChild.className = '';
			}
			cell.title = '';
			cell.innerHTML = '';
			cell.style.cursor = 'default';
		}

		// 工数入力
		if(this.empWorkIn){
			cell = dojo.query('td.vjob', row)[0];
			cell.className = 'dval vjob';
			if(cell.firstChild){
				cell.firstChild.className = '';
			}
			cell.title = '';
			cell.innerHTML = '';
			cell.style.cursor = 'default';
		}

		// 備考アイコン
		cell = dojo.query('td.vbttn', row)[0];
		cell.className = 'dval vbttn';
		if(cell.firstChild){
			cell.firstChild.className = '';
		}

		// 備考
		cell = dojo.query('td.vnote', row)[0];
		cell.title = '';
		cell.innerHTML = '';

		r++;
	}
	dojo.forEach(tbody.rows[rcnt].cells, function(cell){ dojo.addClass(cell, 'bot-border'); });
	if(gt){
		dojo.forEach(gt.rows[rcnt].cells, function(cell){ dojo.addClass(cell, 'bot-border'); });
	}

	dojo.style('mainTable', 'height', (24 * rcnt + 42 + 42) + 'px');

	dojo.query('td.ts-top-empinfo td.ts-top-info-r > div.dept-name'   ).forEach(function(el){ el.innerHTML = this.pouch.getDeptName();    }, this); //部署
	dojo.query('td.ts-top-empinfo td.ts-top-info-r > div.emptype-name').forEach(function(el){ el.innerHTML = this.pouch.getEmpTypeName(); }, this); // 勤務体系
	dojo.query('td.ts-top-empinfo td.ts-top-info-r > div.emp-name'    ).forEach(function(el){ el.innerHTML = this.pouch.getName();        }, this); // 社員名

	var deptFixMode = this.pouch.isPermitDeptFixWoMonthFix();

	if(this.pouch.isEmpMonthApprover()){
		// 承認/却下ボタン・有効化
		dojo.query('button.apply-button').forEach(function(el){
			el.style.display = '';
			dojo.toggleClass(el, 'std-button1'         , false);
			dojo.toggleClass(el, 'std-button1-disabled', false);
			dojo.toggleClass(el, 'std-button3'         , true);
			el.firstChild.innerHTML = teasp.message.getLabel('tf10000270'); // 承認／却下
		}, this);
		this.eventHandles.push(dojo.connect(dojo.byId('applyButton1'), 'onclick', this, this.approveMonthly));
		this.eventHandles.push(dojo.connect(dojo.byId('applyButton2'), 'onclick', this, this.approveMonthly));
	}else{
		// 管理者かつ月次未確定かつ部署確定済みか
		var spMode = ((this.pouch.isSysAdmin() || this.pouch.isAdmin()) && !readOnly && this.pouch.isDeptMonthFixed());
		// 月次確定なしで部署確定可能かつ対象フラグが「通常」以外の場合、承認申請ボタンを非表示にする
		if(deptFixMode && (!spMode || this.pouch.getInputFlag() != teasp.constant.INPUT_FLAG_NORMAL)){
			// 承認申請ボタン・非表示
			dojo.query('button.apply-button').forEach(function(el){
				el.style.display = 'none';
			}, this);
		}else{
			if(readOnly){
				// 承認申請ボタン・無効化
				dojo.query('button.apply-button').forEach(function(el){
					el.style.display = '';
					dojo.toggleClass(el, 'std-button1'         , false);
					dojo.toggleClass(el, 'std-button1-disabled', true);
					dojo.toggleClass(el, 'std-button3'         , false);
					el.firstChild.innerHTML = teasp.message.getLabel((this.pouch.isUseWorkFlow() && !deptFixMode) ? 'applyx_btn_title' : 'fix_btn_title'); // 承認申請 or 確定
				}, this);
			}else{
				// 承認申請ボタン・有効化
				dojo.query('button.apply-button').forEach(function(el){
					el.style.display = '';
					dojo.toggleClass(el, 'std-button1'         , true);
					dojo.toggleClass(el, 'std-button1-disabled', false);
					dojo.toggleClass(el, 'std-button3'         , false);
					el.firstChild.innerHTML = teasp.message.getLabel((this.pouch.isUseWorkFlow() && !deptFixMode) ? 'applyx_btn_title' : 'fix_btn_title'); // 承認申請 or 確定
				}, this);
				this.eventHandles.push(dojo.connect(dojo.byId('applyButton1'), 'onclick', this, this.applyMonthly));
				this.eventHandles.push(dojo.connect(dojo.byId('applyButton2'), 'onclick', this, this.applyMonthly));
			}
		}
	}
	dojo.byId('applyButton1').title = teasp.message.getLabel((this.pouch.isUseWorkFlow() && !deptFixMode) ? 'applyx_button_title' : 'fix_button_title');
	dojo.byId('applyButton2').title = teasp.message.getLabel((this.pouch.isUseWorkFlow() && !deptFixMode) ? 'applyx_button_title' : 'fix_button_title');

//    dojo.byId('monthlyStatus').className = 'pb_base ' + this.pouch.getEmpMonthStatusIconClass();
//    // 月次確定なしで部署確定可能かつ対象者フラグが「対象外」ならステータスボタンは非表示にする
//    if(deptFixMode && this.pouch.getInputFlag() == teasp.constant.INPUT_FLAG_EXEMPT){
//        dojo.style('monthlyStatusH', 'display', 'none');
//        dojo.style('monthlyStatus' , 'display', 'none');
//    }else{
//        dojo.style('monthlyStatusH', 'display', '');
//        dojo.style('monthlyStatus' , 'display', '');
//    }
	// ステータス
	var el = dojo.byId('monthlyStatus');
	dojo.empty(el);
	dojo.create('div', { className: 'png-' + this.pouch.getEmpMonthStatusIconClass() }, el);
	if(!teasp.isNarrow(343) || !teasp.isEnglish()){ // TS1勤務表モバイル最適化条件を満たしかつ幅343px未満の時はステータスの文字列を表示しない
		dojo.create('div', { innerHTML: teasp.constant.getDisplayStatus(this.pouch.getEmpMonthApplyStatus(0, true)) || teasp.message.getLabel('notFix_label') }, el); // 未確定
	}

	this.showTimeViewBottom();
	this.showMonthlyApplyButton(); // 月次残業申請

	this.createGraphArea();
	if(this.pouch.isAutoVerify()){ // 勤怠計算自動ベリファイがオン
		this.verifyMonth(); // ベリファイ実行
	}
}; // function refreshContents()

teasp.view.Monthly.prototype.showTimeViewBottom = function(){
	this.helperSummary = new teasp.helper.Summary(this.pouch);
	var targetContents = this.helperSummary.getTimeViewBottomContents();
	var area = dojo.byId('bottomSummaryTable');
	dojo.empty(area);
	var numberOfColumns = targetContents.numberOfColumns || 0;
	if(!numberOfColumns){
		return;
	}
	// 指定列数分のセルを作成
	var tbodys = [];
	var cells = [];
	for(var i = 0 ; i < numberOfColumns ; i++){
		var div = dojo.create('div', { style:'vertical-align:top;min-width:260px;max-width:300px;' }, area);
		cells.push(div);
		tbodys.push(dojo.create('tbody', null, dojo.create('table', { className:'param' }, div)));
	}
	// 各列に項目を配置
	cx = 1;
	while(cx <= numberOfColumns){
		var tbody = tbodys[cx - 1];
		var fields = targetContents['column' + cx] || [];
		var n = 0;
		var separated = false;
		for(var i = 0 ; i < fields.length ; i++){
			var field = fields[i];
			if(field.skip){
				continue;
			}
			// セパレータの場合はTABLEを分け、間にDIVを挟む
			if(field.separator){
				if(field.label){
					dojo.create('div', { style:'padding:1px 4px;text-align:left;', innerHTML:field.label }, cells[cx - 1]);
				}else{
					dojo.create('div', { style:'height:4px;' }, cells[cx - 1]);
				}
				n = 0;
				separated = true;
				continue;
			}
			if(!n && separated){
				tbody = tbodys[cx - 1] = dojo.create('tbody', null, dojo.create('table', { className:'param' }, cells[cx- 1]));
			}
			// 行作成して出力
			var tr = dojo.create('tr', null, tbody);
			if(field.labelOnly){
				dojo.create('div', { innerHTML:field.label || '&nbsp;', className:'left', style:'margin-bottom:4px;'  }, dojo.create('td', { className:'left', colSpan:'2' }, tr));
			}else{
				dojo.create('div', { innerHTML:field.label || '&nbsp;', className:'left'  }, dojo.create('td', { className:'left'  }, tr));
				dojo.create('div', { innerHTML:teasp.util.dspVal(field.value, '&nbsp;'), className:'right' }, dojo.create('td', { className:'right' }, tr));
			}
			if(field.lines && !field.noDetail){ // 休暇の明細
				var td = dojo.create('td', {
					colSpan:'2',
					className:'tb_detail_area'
				}, dojo.create('tr', null, tbody));
				this.displayHolidayItems(td, field.lines);
			}
			n++;
		}
		cx++;
	}
};

/**
 * 明細の内訳を出力
 *
 * @param {Array.<Object>} lines head,label,value 要素を持つオブジェクトの配列
 */
teasp.view.Monthly.prototype.displayHolidayItems = function(area, lines){
	var tbody = dojo.create('tbody', null, dojo.create('table', { className:'tb_holy_item_table' }, area));
    for(var i = 0 ; i < lines.length ; i++){
        var o = lines[i];
        var tr = dojo.create('tr', null, tbody);
        dojo.create('td', { innerHTML: o.head , className:'holy_item_col1' }, tr); // [内訳]
        dojo.create('td', { innerHTML: o.label, className:'holy_item_col2' }, tr);
        dojo.create('td', { innerHTML: o.value, className:'holy_item_col3' }, tr); // 日
    }
};

/**
 * 勤怠計算自動ベリファイの実行
 */
teasp.view.Monthly.prototype.verifyMonth = function(){
	var logo = dojo.query('.ts-top-logo div.work-list')[0];
	this.pouch.verifyMonth(
		dojo.hitch(this, function(o){ // 不一致があった
//            console.log(o);
		}),
		dojo.hitch(this, function(n){ // 成功：戻り値 n>0 なら不一致がある
			if(!n){
				dojo.empty(logo);
			}else{
				if(!logo.firstChild){ // logo.firstChild があればすでに赤表示済み
					// 左上勤務表ロゴを赤表示する
					dojo.create('div', { className: 'redmask' }, logo);
				}
			}
		}),
		dojo.hitch(this, function(result){ // 失敗時は赤表示のみ解除
			// デバッガコンソールにエラーメッセージだけ出力
			console.log(teasp.message.getErrorMessage(result));
			dojo.empty(logo);
		})
	);
};

/**
 * マーカーエリアを構築
 *
 * @param {Object} this.pouch データ管理クロージャ
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.createGraphArea = function(){
	var div = dojo.byId('graphDiv');
	if(!div){
		return;
	}
	if(!this.graph){
		this.graph = new teasp.helper.Graph({
			widthPerH          : 20
		, startY             : 48
		, sizeType           : 'small'
		, movable            : false
		, clickedEvent       : this.openEditTime
		, clickedApply       : this.openEmpApply
		, hideTimeGraphPopup : this.pouch.isHideTimeGraphPopup()
		, that               : this
	});
	}
	this.graph.clear();
	this.graph.draw(this.pouch, 'graphDiv', this.pouch.getMonthDateList());
	setTimeout(dojo.hitch(this, this.adjustGraphAreaScroll), 100);
};

/**
 * 年月プルダウンを作成
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.createMonthList = function(){
	var ymx = teasp.util.date.formatDate(this.pouch.getStartDate(), 'yyyyMMdd');
	var months = this.pouch.getEmpMonthList(teasp.util.date.getToday(), 1, -12);
	var x = -1;
	for(var i = 0 ; i < months.length ; i++){
		var month = months[i];
		if(month.yearMonthEx == ymx){
			x = i;
			break;
		}
	}
	if(x < 0){
		months.push(this.pouch.getEmpMonth(null, this.pouch.getStartDate()));
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
 * タイムレポートへ遷移（クロージャ）
 *
 * @param {string} _date 日付
 * @return {Function}
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.openTimeReport = function(_date){
	var d = _date;
	return dojo.hitch(this, function(){
		teasp.locationHref(teasp.getPageUrl('timeReportView') + '?empId=' + this.pouch.getEmpId() + '&date=' + d + '&mode=' + this.pouch.getMode());
	});
};

teasp.view.Monthly.prototype.openWorkBalance = function(_date){
	var date = _date;
	return dojo.hitch(this, function(e){
		e.preventDefault();
		e.stopPropagation();
		var classifyJobWorks = this.pouch.getClassifyJobWorks(date);
		var dayWrap          = this.pouch.getEmpDay(date);
		var jm               = this.pouch.getJobMonthByDate(date);
		var zanteiFlag = false;
		var workRealTime = dayWrap.getDaySubTimeByKey('workRealTime', true, 0, 0, teasp.constant.C_REAL);
		if(!workRealTime){
			var t = dayWrap.getZanteiRealTime(teasp.util.date.getToday());
			if(t){
				zanteiFlag = true;
				workRealTime = t;
			}
		}
		teasp.manager.dialogOpen(
			'WorkBalance',
			{
				date              : date,
				jobMonth          : jm,
				workRealTime      : workRealTime,
				worked            : dayWrap.isWorked(),
				workNote          : dayWrap.getWorkNote(),
				zanteiFlag        : zanteiFlag,
				classifyJobWorks  : dojo.clone(classifyJobWorks),
				reflectWorkOption : null,
				monthFix          : this.pouch.isEmpMonthFixed(),
				dayFix            : dayWrap.isDailyFix(),
				client            : teasp.constant.APPLY_CLIENT_MONTHLY
			},
			this.pouch,
			this,
			function(newClassifyJobWorks, workNote, flag){
				if(!flag){
					this.refreshMonthly();
				}
			}
		);
	});
};

/**
 * 月次サマリー（＝印刷プレビュー）を別ウィンドウで表示
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.openPrintView = function(){
	var w = 810;
	var h = Math.min(screen.availHeight || 800, 800);
	var args = [
		'empId=' + this.pouch.getEmpId(),
		'date=' + teasp.util.date.formatDate(this.pouch.getStartDate(), 'yyyyMMdd'),
		'mode=read'
	];
	var ops = [
		'width=' + w,
		'height=' + h
	];
	if(teasp.isNarrow()){
		args.push('narrow=1');
	}else{
		ops.push('resizable=yes');
		ops.push('scrollbars=yes');
	}
	var href = teasp.getPageUrl('workTimePrintView') + '?' + args.join('&');
	var op = ops.join(',');
	if(teasp.isSforce1()){
		sforce.one.navigateToURL(href);
	}else{
		var wh = window.open(href, 'print', op);
		setTimeout(function(){ wh.resizeTo(w + 10, h); }, 100);
	}
};

/**
 * 個人設定を別ウィンドウで表示
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.openEmpView = function(){
	var w = 700;
	var h = Math.min(screen.availHeight || 800, 800);
	var args = [
		'empId=' + this.pouch.getEmpId(),
		'mode=read'
	];
	var ops = [
		'width=' + w,
		'height=' + h
	];
	if(teasp.isNarrow()){
		args.push('narrow=1');
	}else{
		ops.push('resizable=yes');
		ops.push('scrollbars=yes');
	}
	var href = teasp.getPageUrl('workEmpView') + '?' + args.join('&');
	var op = ops.join(',');
	if(teasp.isSforce1()){
		sforce.one.navigateToURL(href);
	}else{
		var wh = window.open(href, 'empInfo', op);
		setTimeout(function(){ wh.resizeTo(w + 10, h); }, 100);
	}
};

/**
 * 休暇情報を別ウィンドウで表示
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.openHolidayView = function(){
	var w = 800;
	var h = Math.min(screen.availHeight || 800, 800);
	var args = [
		'empId=' + this.pouch.getEmpId(),
		'date=' + teasp.util.date.formatDate(this.pouch.getStartDate(), 'yyyyMMdd')
	];
	var ops = [
		'width=' + w,
		'height=' + h
	];
	if(teasp.isNarrow()){
		args.push('narrow=1');
	}else{
		ops.push('resizable=yes');
		ops.push('scrollbars=yes');
	}
	var href = teasp.getPageUrl('holidayView') + '?' + args.join('&');
	var op = ops.join(',');
	if(teasp.isSforce1()){
		sforce.one.navigateToURL(href);
	}else{
		var wh = window.open(href, 'empInfo', op);
		setTimeout(function(){ wh.resizeTo(w + 10, h); }, 100);
	}
};

/**
 * 社員リストを別ウィンドウで表示
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.openEmpList = function(){
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
	var url = (teasp.getPageUrl('deptRefView') + '?type=Time&empId=' + (sinfo && sinfo.emp && sinfo.emp.id || this.pouch.getEmpId())
			+ '&deptId=' + this.pouch.getDeptId()
			+ '&month=' + this.pouch.getYearMonth()
			+ '&subNo=' + (this.pouch.getSubNo() || ''))
			+ (mode ? '&mode=' + mode : '');
	// TS1の場合はnarrow=1を引数に追加（「閉じる」ボタンを非表示にする）
	if(teasp.isSforce1()){
		url += '&narrow=1';
	}
	if(teasp.isSforce1()){
		sforce.one.navigateToURL(url);
	}else{
		var wh = window.open(url, 'empTable', 'width=690,height=340,resizable=yes,scrollbars=yes');
		if(wh){
			wh.focus();
		}
	}
};

/**
 * お知らせダイアログを表示
 *
 */
teasp.view.Monthly.prototype.openInfoView = function(){
	dojo.query('div.info-icon').forEach(function(el){ // お知らせボタンのアイコン
		dojo.toggleClass(el, 'info-an', false);
		dojo.toggleClass(el, 'info-bl', true);
	});
	teasp.manager.dialogOpen(
		'Info',
		{},
		this.pouch
	);
};

/**
 * ステータスボタンがクリックされた時の処理
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.openStatusView = function(){
	var monthApply = this.pouch.getEmpMonthApplyObj();
	if(monthApply.id && (!monthApply.steps || monthApply.steps.length <= 0)){
		teasp.manager.request(
			'getEmpMonthApplySteps',
			{
				applyId  : this.pouch.getEmpMonthApplyId(),
				empId    : this.pouch.getEmpId(),
				month    : this.pouch.getYearMonth(),
				startDate: this.pouch.getStartDate()
			},
			this.pouch,
			{ hideBusy : true },
			this,
			function(steps){
				monthApply.steps = (typeof(steps) == 'object' ? steps.steps : steps);
				this.openStatusDialog(monthApply);
			},
			function(event){
				teasp.message.alertError(event);
			}
		);
	}else{
		this.openStatusDialog();
	}
};

/**
 * ステータス（月次承認）ダイアログを表示
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.openStatusDialog = function(){
	var monthApply = this.pouch.getEmpMonthApplyObj();
	var removable = (!monthApply.status
				|| teasp.constant.STATUS_NOTADMITS.contains(monthApply.status)
				|| teasp.constant.STATUS_CANCELS.contains(monthApply.status)
				|| (teasp.constant.STATUS_APPROVES.contains(monthApply.status) && !this.pouch.canCancelMonthApply())) ? false : true;
	if(removable && !this.pouch.isAdmin(true) && this.pouch.isDeptMonthFixed()){
		removable = false;
	}
	var removeButtonType = 0;
	if(teasp.constant.STATUS_APPROVES.contains(monthApply.status)){
		if(this.pouch.getEmpMonthApplyStatus() == teasp.constant.STATUS_ADMIT){
			removeButtonType = 4; // 確定取消
		}else{
			removeButtonType = 2; // 承認取消
		}
	}else if(teasp.constant.STATUS_REJECTS.contains(monthApply.status)){
		removeButtonType = 3;     // 申請取下
	}else{
		if(this.pouch.isPermitDeptFixWoMonthFix() || !this.pouch.isUseWorkFlow()){
			removeButtonType = 4; // 確定取消
		}else{
			removeButtonType = 1; // 申請取消
		}
	}
	teasp.manager.dialogOpen(
		'Status',
		{
			apply             : monthApply,
			removable         : (removable && !this.pouch.isReadOnly()),
			removeButtonType  : removeButtonType,
			cancelApply       : this.requestCancelEmpMonthApply
		},
		this.pouch,
		this,
		function(){
			this.pouch.clearEmpMonthApprover();
			this.refreshMonthly();
		}
	);
};

/**
 * ステータスダイアログで確定取消ボタンがクリックされた時の処理
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.requestCancelEmpMonthApply = function(apply, onSuccess, onFailure){
	var monthApply = this.pouch.getEmpMonthApplyObj();
	var tgt, msgkey;
	if(apply && teasp.constant.STATUS_REJECTS.contains(apply.status)){
		msgkey = 'tm10001041';
		tgt = teasp.message.getLabel('apply_head');
	}else{
		msgkey = 'tm10001040';
		tgt = teasp.message.getLabel('fixMonth_caption');
	}
	// {0}の{1}を取り消します。\nよろしいですか？
	teasp.tsConfirmA(teasp.message.getLabel(msgkey, this.pouch.getYearMonthJp(), tgt), this, function(){
		var action = ((teasp.constant.STATUS_REJECTS.contains(monthApply.status) && !monthApply.close) ? 'closeApplyEmpMonth' : 'cancelApplyEmpMonth');
		teasp.manager.request(
			action,
			{
				empId            : this.pouch.getEmpId(),
				month            : this.pouch.getYearMonth(),
				startDate        : this.pouch.getStartDate(),
				lastModifiedDate : this.pouch.getLastModifiedDate()
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
 * 申請の矛盾チェック
 *
 * @return {boolean} false:申請不可 true:申請可
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.checkPreApplyMonthly = function(callback){
	var dlst = this.pouch.getMonthDateList();
	var wtitle = teasp.message.getLabel('tm10001060'); // ＊＊＊＊＊＊ 申請できません ＊＊＊＊＊＊
	var cauts = [];
	var invalids = this.pouch.getInvalidApplys(true);
	var msg = wtitle;
	if(invalids.length > 0){
		for(var i = 0 ; i < invalids.length ; i++){
			if(i >= 2){
				msg += '\n...';
				break;
			}
			msg += '\n' + teasp.message.getLabel('tm10001070', teasp.util.date.formatDate(invalids[i].date, 'M/d'), invalids[i].text); // {0}：{1}
		}
		teasp.tsAlert(msg, this);
		return false;
	}
	var reviseApplys = this.pouch.getReviseTimeApplys();
	if(reviseApplys.length){
		msg += '\n' + teasp.message.getLabel('tf10008480'); // 勤怠時刻修正申請が反映されていません。勤務表を再表示して操作をやり直してください。
		teasp.tsAlert(msg, this);
		return false;
	}

	var waitCnt = 0;
	var ngTimeHolys = [];
	var noDailyFixed = [];
	var diverges = [];
	var jobTime = 0;
	var netTime = 0;
	var diffs = [];
	var emptys = {st:[],et:[],both:[],ng:[],workLocations:[]};
	var overs = {ew:[],ot:[]};
	var misses = {ls:[],ee:[]};
	var mm = -1;
	var ecnt = 0;
	var workLocationInEmpty = 0;
	var confirmMsg1 = null;
	var confirmMsg2 = null;
	for(var r = 0 ; r < dlst.length ; r++){
		var dayWrap = this.pouch.getEmpDay(dlst[r]);
		var aliveDay = this.pouch.isAlive(dlst[r]);
		// 工数時間との比較
		var cjw = (this.pouch.getObj().works ? this.pouch.getClassifyJobWorks(dlst[r]) : null);
		var jt = (cjw ? cjw.sumTime : 0);
		var nt = dayWrap.getDaySubTimeByKey('workRealTime', true, 0, null, teasp.constant.C_REAL);
		if(jt != nt){
			diffs.push({ dkey: dlst[r], job: jt, net: nt });
		}
		jobTime += jt;
		netTime += nt;
		if(!aliveDay){
			continue;
		}
		// 出退社時刻入力チェック
		const deficit = dayWrap.getDeficit();
		if(deficit.empty == 1){
			emptys.st.push(dlst[r]);
		}else if(deficit.empty == 2){
			emptys.et.push(dlst[r]);
		}else if(deficit.ng){
			emptys.ng.push(dlst[r]);
		}else if(deficit.empty == 3){
			emptys.both.push(dlst[r]);
		}
		if(this.pouch.isRequireWorkLocation()){ // 勤務場所必須
			if((deficit.entered || deficit.empty == 1 || deficit.empty == 2)
			&& !dayWrap.getWorkLocationId()){
				emptys.workLocations.push(dlst[r]);
			}
		}
		if(this.pouch.isUseWorkLocation() // テレワークオン
		&& !deficit.entered // 出退社未入力
		&& dayWrap.getWorkLocationId()){ // 勤務場所入力済み
			workLocationInEmpty++;
		}
		// 休日出勤日の勤怠入力チェック
		if(dayWrap.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU) && !dayWrap.isWorked() && this.pouch.isUseDaiqManage()){
			cauts.push(teasp.message.getLabel('tm10001700', teasp.util.date.formatDate(dlst[r], 'M/d'))); // {0}の休日出勤日の出退時刻を入力するか、休日出勤申請を取り消して下さい。
		}
		// 非勤務日の工数入力のチェック
		if(this.pouch.isUseDailyApply() && this.pouch.getObj().config.checkWorkingTime && !dayWrap.isInputable()){
			var classifyJobWorks = (this.pouch.getObj().works ? this.pouch.getClassifyJobWorks(dlst[r]) : null);
			if(classifyJobWorks && classifyJobWorks.sumTime > 0){
				cauts.push(teasp.message.getLabel('tk10004590', teasp.util.date.formatDate(dlst[r], 'M/d'))); // {0}は非勤務日ですが、工数入力されています。工数入力を取り消してください。
			}
		}
		// 日次確定チェック
		if(dayWrap.isInputable() && !dayWrap.isExistApply(teasp.constant.APPLY_KEY_DAILY)){
			var d = teasp.util.date.parseDate(dlst[r]);
			var m = (d.getMonth() + 1);
			noDailyFixed.push(m == mm ? d.getDate() : m + '/' + d.getDate());
			mm = m;
		}
		// 控除のある日の備考必須/打刻なしの備考必須チェック
		var warn = dayWrap.getDayNoteWarning();
		if(warn){
			cauts.push(warn);
		}
		// 時間単位有休申請日の出勤チェック
		if(this.pouch.isEmptyDay(dlst[r]) && dayWrap.getTimeHolidayApply().length > 0){
			ngTimeHolys.push(teasp.util.date.formatDate(dlst[r], 'M/d'));
		}
		// 入退館管理チェック
		if(this.pouch.isInputAccessControl()){
			var divergeNg = dayWrap.getDivergeNg();
			if(divergeNg){
				diverges.push(divergeNg);
			}
		}
		// 残業申請・早朝勤務申請必須チェック
		var disc = dayWrap.getDiscretionaryLevel();
		var otrt = this.pouch.getOverTimeRequireTime(disc);  // 無申請残業時間の境界時間
		var ewrt = this.pouch.getEarlyWorkRequireTime(disc); // 無申請早朝勤務時間の境界時間
		var svz = dayWrap.getMissingOverTime(otrt);
		var sve = dayWrap.getMissingEarlyWork(ewrt);
		if(svz > 0){
			overs.ot.push(dlst[r]);
			if(dayWrap.isExistApply(teasp.constant.APPLY_KEY_ZANGYO)){ // 残業申請はある
				ecnt++;
			}
		}
		if(sve > 0){
			overs.ew.push(dlst[r]);
			if(dayWrap.isExistApply(teasp.constant.APPLY_KEY_EARLYSTART)){ // 早朝勤務申請はある
				ecnt++;
			}
		}
		// 遅刻申請・早退申請必須チェック
		if(this.pouch.isRequiredLateStartApply() && dayWrap.isMissingLateStartApply()){
			misses.ls.push(dlst[r]);
		}
		if(this.pouch.isRequiredEarlyEndApply() && dayWrap.isMissingEarlyEndApply()){
			misses.ee.push(dlst[r]);
		}
		waitCnt += dayWrap.getEmpApplyList('ALL_WAIT').length;
	}
	if(waitCnt > 0 || this.pouch.getPendingMonthlyOverTimeApplys().length > 0){
		teasp.tsAlert(wtitle + teasp.message.getLabel('tm10001080'), this);
		return false;
	}
	if(emptys.st.length || emptys.et.length || emptys.both.length || emptys.ng.length || emptys.workLocations.length){
		var emptyMsgs = [];
		if(emptys.ng.length){
			emptyMsgs.push(teasp.message.getLabel('tf10008770' // {0} の{1}が不正です。
					, teasp.util.date.joinEx(emptys.ng)
					, teasp.message.getLabel('startEndTime_label'))); // 出退社時刻
		}
		if(emptys.both.length){
			emptyMsgs.push(teasp.message.getLabel('tk10005420' // {0}の{1}が未入力です。
					, teasp.util.date.joinEx(emptys.both)
					, teasp.message.getLabel('startEndTime_label'))); // 出退社時刻
		}
		if(emptys.st.length){
			emptyMsgs.push(teasp.message.getLabel('tk10005420' // {0}の{1}が未入力です。
					, teasp.util.date.joinEx(emptys.st)
					, teasp.message.getLabel('startTime_label'))); // 出社時刻
		}
		if(emptys.et.length){
			emptyMsgs.push(teasp.message.getLabel('tk10005420' // {0}の{1}が未入力です。
					, teasp.util.date.joinEx(emptys.et)
					, teasp.message.getLabel('endTime_label'))); // 退社時刻
		}
		if(emptys.workLocations.length){
			emptyMsgs.push(teasp.message.getLabel('tk10005420' // {0}の{1}が未入力です。
					, teasp.util.date.joinEx(emptys.workLocations)
					, teasp.message.getLabel('tw00000010'))); // 勤務場所
		}
		cauts = emptyMsgs.concat(cauts);
	}
	if(overs.ot.length || overs.ew.length){
		if(overs.ot.length){
			cauts.push(teasp.message.getLabel('tf10008730' // {0} {1}してください
					, teasp.util.date.joinEx(overs.ot)
					, teasp.message.getLabel('tm10001293'))); // 残業申請
		}
		if(overs.ew.length){
			cauts.push(teasp.message.getLabel('tf10008730' // {0} {1}してください
					, teasp.util.date.joinEx(overs.ew)
					, teasp.message.getLabel('tm10001294'))); // 早朝勤務申請
		}
		if(ecnt > 0){
			cauts.push(teasp.message.getLabel('tf10008760')); // （申請なしで勤務した時間がないようにしてください）
		}
	}
	if(misses.ls.length || misses.ee.length){
		if(misses.ls.length){
			cauts.push(teasp.message.getLabel('tf10008730' // {0} {1}してください
					, teasp.util.date.joinEx(misses.ls)
					, teasp.message.getLabel('applyLateStart_label'))); // 遅刻申請
		}
		if(misses.ee.length){
			cauts.push(teasp.message.getLabel('tf10008730' // {0} {1}してください
					, teasp.util.date.joinEx(misses.ee)
					, teasp.message.getLabel('applyEarlyEnd_label'))); // 早退申請
		}
	}
	if(cauts.length > 0){
		var _cauts = cauts.slice(0, 10);
		if(cauts.length > 10){
			_cauts.push('...');
		}
		teasp.tsAlert(wtitle + '\n' + _cauts.join('\n'), this);
		return false;
	}
	if(diverges.length > 0){
		if(this.pouch.isPermitMonthlyApply()){ // 乖離が発生していても月次確定可
			confirmMsg1 = teasp.message.getLabel('ac00000500') // ＊＊＊＊＊＊ 警告 ＊＊＊＊＊＊
							+ '\n' + diverges.join('\n')
							+ '\n\n' + teasp.message.getLabel('ac00000510') // 続行する場合はOKをクリックしてください。
							+ '\n';
		}else{
			teasp.tsAlert(wtitle + '\n' + diverges.join('\n'), this);
			return false;
		}
	}

	if(this.pouch.isProhibitApplicantEliminatingLegalHoliday()){ // 法定休日がなくなる申請を禁止
		var ed = dlst[dlst.length - 1];
		var weekObjs = teasp.logic.EmpTime.createWeekObjs(
				dlst[0], teasp.util.date.addDays(ed, 6), this.pouch.getInitialDayOfWeek(), dojo.hitch(this.pouch, this.pouch.isAlive));
		dlst = teasp.logic.EmpTime.getDateListByWeekObjs(weekObjs);
		for(r = 0 ; r < dlst.length ; r++){
			var day = this.pouch.getObj().days[dlst[r]];
			var weekObj = teasp.logic.EmpTime.getWeekObj(weekObjs, dlst[r]);
			if(day.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){ // 法定休日
				weekObj.legalHolidays++;
			}else if(day.dayType != teasp.constant.DAY_TYPE_NORMAL){
				weekObj.lastHoliday = day.rack.key;
			}
		}
		var noholys = [];
		for(r = 0 ; r < weekObjs.length ; r++){
			var weekObj = weekObjs[r];
			if(ed < weekObj.dkeys[0]){
				break;
			}
			if(!weekObj.legalHolidays && !weekObj.lastHoliday && weekObj.liveWeekAll){
				var f = false;
				for(var i = 0 ; i < weekObj.dkeys.length ; i++){
					var dw = this.pouch.getEmpDay(weekObj.dkeys[i]);
					var es = dw.isExistApply(teasp.constant.APPLY_KEY_EXCHANGES);
					var ee = dw.isExistApply(teasp.constant.APPLY_KEY_EXCHANGEE);
					if(es || ee){
						f = true;
						break;
					}
				}
				if(f){
					noholys.push(teasp.message.getLabel('tk10001178', // {0}～{1}の週の法定休日がありません。
							teasp.util.date.formatDate(weekObj.dkeys[0], 'M/d+'),
							teasp.util.date.formatDate(weekObj.dkeys[weekObj.dkeys.length - 1], 'M/d+')));
				}
			}
		}
		if(noholys.length > 0){
			noholys.push(teasp.message.getLabel('tk10001179')); // 振替申請を休日出勤申請に変更するなど対応を行ってください
			teasp.tsAlert(noholys.join('\n'), this);
			return false;
		}
	}

	if(this.pouch.isUseDaiqManage()){ // 代休管理をする設定
		// 代休関連情報
		var daiqZan = teasp.data.Pouch.getDaiqZan( // 今月取得可能な代休の残日数を取得
							this.pouch.getStocks(),
							this.pouch.getEmpMonthLastDate(),
							this.pouch.getEmpMonthStartDate(),
							this.pouch.getEmpMonthLastDate(),
							this.pouch.isOldDate());
		if(daiqZan.overSpend < 0){
			// 代休可能残日数が{0}日分不足しています。代休の休暇申請を取消してください。
			teasp.tsAlert(wtitle + '\n' + teasp.message.getLabel('tm10001650', Math.abs(daiqZan.overSpend)), this);
			return false;
		}
	}
	var stockLack = this.pouch.getStockLack();
	for(var key in stockLack){
		if(cauts.length > 4){
			break;
		}
		if(stockLack.hasOwnProperty(key)){
			var o = stockLack[key];
			if(cauts.length >= 4){
				cauts.push('...');
			}else{
				cauts.push(teasp.message.getLabel('tm10003782', teasp.util.date.formatDate(o.info.date, 'M/d'), o.info.name)); // {0}の{1}の休暇申請は残日数不足のため無効です。休暇申請を取消してください。
			}
		}
	}
	if(cauts.length > 0){
		teasp.tsAlert(wtitle + '\n' + cauts.join('\n'), this);
		return false;
	}
	if(this.pouch.isCheckDailyFixLeak() && noDailyFixed.length > 0){
		teasp.tsAlert(wtitle + '\n' + teasp.message.getLabel('tm10001710', noDailyFixed.join(',')), this);
		return false;
	}
	var emptyCnt = this.pouch.getEmptyDayCount();
	if(emptyCnt > 0){
		var msg = teasp.message.getLabel('tm10001090', emptyCnt); // 未入力日が {0} 日あります。これらは欠勤扱いとなりますが、よろしいですか？
		if(workLocationInEmpty >0){
			msg += ('\n' + teasp.message.getLabel('tw00000320')); // （欠勤日に入力された勤務場所はクリアします）
		}
		confirmMsg2 = msg;
	}
	if(ngTimeHolys.length > 0){
		var buf = '';
		for(var i = 0 ; i < ngTimeHolys.length ; i++){
			if(i >= 3){
				buf += teasp.message.getLabel('tm10001100');
				break;
			}
			buf += (i > 0 ? ', ' : '') + ngTimeHolys[i];
		}
		buf += '';
		// \n欠勤日（{0}）の時間単位有休の申請は無効です。申請取消をしてください。
		teasp.tsAlert(wtitle + teasp.message.getLabel('tm10001110', buf), this);
		return false;
	}
	var monthlyOverTimeResult = this.pouch.checkMonthlyOverTimeApplys(); // 月次残業申請のチェック
	if(monthlyOverTimeResult.errmsg){
		teasp.tsAlert(wtitle + '\n' + monthlyOverTimeResult.errmsg, this);
		return false;
	}
	if(this.pouch.isCheckWorkingTimeMonthly() // 月次確定時に工数入力時間のチェックをする
	&& diffs.length > 0){ // 差異がある
		var msg = teasp.message.getLabel('tk10004920'); // 実労働時間と工数の合計時間に差異があります。<br/>一致するように修正してください。
		msg += '<br/><br/>';
		msg += '<table class="pane_table" style="margin-left:auto;margin-right:auto;">';
		msg += '<tr style="border-bottom:1px solid gray;">';
		msg += '<td style="width:70px;text-align:center;">'      + teasp.message.getLabel('date_head');          // 日付
		msg += '</td><td style="width:90px;text-align:center;">' + teasp.message.getLabel('workRealTime_label'); // 実労働時間
		msg += '</td><td style="width:90px;text-align:center;">' + teasp.message.getLabel('tk10004930');         // 工数合計
		msg += '</td><td style="width:90px;text-align:center;">' + teasp.message.getLabel('tk10004940');         // 差異
		msg += '</td></tr>';
		for(var i = 0 ; i < diffs.length ; i++){
			var diff = diffs[i];
			msg += '<tr>';
			msg += '<td style="text-align:center;">' + teasp.util.date.formatDate(diff.dkey, 'M/d')   + '</td>';
			msg += '<td style="text-align:center;">' + teasp.util.time.timeValue(diff.net)            + '</td>';
			msg += '<td style="text-align:center;">' + teasp.util.time.timeValue(diff.job)            + '</td>';
			msg += '<td style="text-align:center;">' + teasp.util.time.timeValue(diff.net - diff.job) + '</td>';
			msg += '</tr>';
		}
		msg += '<tr style="border-top:1px solid gray;"><td colSpan="4"></td></tr>';
		msg += '</table>';
		teasp.manager.dialogOpen(
			'MessageBox',
			{
				title        : teasp.message.getLabel('tk10004910'), // 工数入力時間が合いません
				message      : msg,
				closeOnly    : true,
				titleBgColor : '#f5b2b2'
			},
			this.pouch,
			this,
			function(){}
		);
		return false;
	}
	var innerLastCheck = dojo.hitch(this, function(){
		if(confirmMsg2){
			teasp.tsConfirmA(confirmMsg2, this, function(){
				callback();
			});
		}else{
			callback();
		}
	});
	if(confirmMsg1){
		teasp.tsConfirmA(confirmMsg1, this, function(){
			innerLastCheck();
		});
	}else{
		innerLastCheck();
	}
};

/**
 * 承認申請ボタンクリック時の処理
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.applyMonthly = function(){
	this.checkPreApplyMonthly(dojo.hitch(this, function(){
		if(this.pouch.isUseApproverSet() && !this.pouch.getObj().approverSet){
			teasp.manager.request(
				'getAtkApproverSet',
				{
					action : 'getAtkApproverSet',
					empId  : this.pouch.getEmpId(),
					type   : teasp.constant.APPROVER_TYPE_MONTH
				},
				this.pouch,
				{ hideBusy : false },
				this,
				function(){
					this.doApplyMonthly();
				},
				function(event){
					teasp.message.alertError(event);
				}
			);
		}else{
			this.doApplyMonthly();
		}
	}));
};

teasp.view.Monthly.prototype.doApplyMonthly = function(){
	var deptFixMode = this.pouch.isPermitDeptFixWoMonthFix();
	var req = {
		title       : teasp.message.getLabel('fixMonth_caption'), // 勤務確定
		buttonType  : ((this.pouch.isUseWorkFlow() && !deptFixMode) ? 0 : 1),
		descript    : '',
		applyKey    : teasp.constant.APPLY_KEY_MONTHLY,
		deptFixMode : deptFixMode
	};
	if(this.pouch.isUseWorkFlow() && !deptFixMode){
		req.descript = teasp.message.getLabel('tm10001120', this.pouch.getYearMonthJp()); // {0}の勤務を確定して承認申請をします。よろしければ申請ボタンをクリックしてください。
	}else{
		req.descript = teasp.message.getLabel('tm10001130', this.pouch.getYearMonthJp()); // {0}の勤務を確定します。よろしければ確定ボタンをクリックしてください。
	}
	teasp.manager.dialogOpen(
		'ApplyComment',
		req,
		this.pouch,
		this,
		function(obj){
			teasp.manager.request(
				'applyEmpMonth',
				{
					empId            : this.pouch.getEmpId(),
					month            : this.pouch.getYearMonth(),
					startDate        : this.pouch.getStartDate(),
					lastModifiedDate : this.pouch.getLastModifiedDate(),
					note             : obj.comment,
					attributeAtConfirm   : this.pouch.getPeriodInfo(true),
					legalWorkTimeOfPeriod: this.pouch.getLegalWorkTimeOfPeriod()
				},
				this.pouch,
				{ hideBusy : false },
				this,
				function(res){
					this.refreshMonthly();
				},
				function(event){
					teasp.message.alertError(event);
				}
			);
		}
	);
};

/**
 * 承認/却下ボタンクリック時の処理
 *
 */
teasp.view.Monthly.prototype.approveMonthly = function(){
	teasp.manager.dialogOpen(
		'Approval',
		{
			apply   : { id: this.pouch.getEmpMonthApplyId() },
			objKey  : 'empApply',
			refresh : true
		},
		this.pouch,
		this,
		function(){
			this.refreshMonthly(true);
		}
	);
};

/**
 * 前月ボタンクリック時の処理
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.changePrevMonth = function(){
	return this.changeMonth(this.pouch.getEmpMonth(null, this.pouch.getStartDate(), -1));
};

/**
 * 今月ボタンクリック時の処理
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.changeCurrMonth = function(){
	return this.changeMonth(this.pouch.getEmpMonth(null, teasp.util.date.getToday()));
};

/**
 * 次月ボタンクリック時の処理
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.changeNextMonth = function(){
	return this.changeMonth(this.pouch.getEmpMonth(null, this.pouch.getStartDate(), 1));
};

/**
 * 月度変更
 *
 * @return {boolean} false固定
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.changeMonth = function(month){
	var obj = this.pouch.getObj();
	obj.params = {
		target    : 'empMonth',
		empId     : this.pouch.getEmpId(),
		empTypeId : this.pouch.getEmpTypeId(),
		month     : month.yearMonth,
		subNo     : month.subNo,
		startDate : month.startDate,
		endDate   : month.endDate,
		mode      : this.pouch.getMode()
	};
	document.body.style.cursor = 'wait';
//    teasp.manager.dialogOpen('BusyWait', null, null);
	teasp.manager.request(
		'transEmpMonth',
		{
			empId   : this.pouch.getEmpId(),
			month   : month.yearMonth,
			startDate: month.startDate,
			noDelay : true
		},
		this.pouch,
		{ hideBusy : true, shim : true },
		this,
		function(obj){
			this.refreshMonthly(true);
			document.body.style.cursor = 'default';
		},
		function(event){
			var select = dojo.byId('yearMonthList');
			select.value = '' + this.pouch.getYearMonth();
//            teasp.manager.dialogClose('BusyWait');
			document.body.style.cursor = 'default';
			teasp.message.alertError(event);
		}
	);
	return false;
};

/**
 * 年月プルダウン変更
 *
 * @return {boolean} false固定
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.changedMonthSelect = function(){
	var select = dojo.byId('yearMonthList');
	var d = teasp.util.date.formatDate(teasp.util.date.parseDate(select.value));
	return this.changeMonth(this.pouch.getEmpMonth(null, d));
};

//--------------------------------------------------------------------------
/**
 * 勤怠時刻入力ダイアログを開く（クロージャ）
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {Function}
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.openInputTime = function(dkey){
	var req = { date: dkey, client: teasp.constant.APPLY_CLIENT_MONTHLY };
	return function(o){
		this.pouch.checkEmpMonthHook(dojo.hitch(this, function(succeed, event){
			if(!succeed){
				teasp.tsAlert(teasp.message.getErrorMessage(event), this);
				return;
			}
			teasp.manager.dialogOpen(
				'InputTime',
				req,
				this.pouch,
				this,
				this.refreshMonthly2
			);
		}));
	};
};

/**
 * 休憩・公用外出入力ダイアログを開く（クロージャ）
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {Function}
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.openEditTime = function(dkey){
	var req = { date: dkey };
	return function(){
		teasp.manager.dialogOpen(
			'EditTime',
			req,
			this.pouch,
			this,
			this.refreshMonthly2
		);
	};
};

/**
 * 備考入力（クロージャ）
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {Function}
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.openNote = function(dkey){
	var req = { date: dkey };
	return function(){
		teasp.manager.dialogOpen(
			'Note',
			req,
			this.pouch,
			this,
			this.refreshMonthly2
		);
	};
};

/**
 * 乖離理由入力
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {Function}
 */
teasp.view.Monthly.prototype.openDivergenceReason = function(dkey){
	var req = { date: dkey };
	return function(){
		this.pouch.checkEmpMonthHook(dojo.hitch(this, function(succeed, event){
			if(!succeed){
				teasp.tsAlert(teasp.message.getErrorMessage(event), this);
				return;
			}
			teasp.manager.dialogOpen(
				'DivergenceReason',
				req,
				this.pouch,
				this,
				this.refreshMonthly2
			);
		}));
	};
};

/**
 * 日次確定を実行（クロージャ）
 *
 * @param {string} _dkey 日付('yyyy-MM-dd')
 * @param {string=} _applyId 申請ID
 * @return {Function}
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.applyDailyFix = function(_dkey, _applyId){
	var dkey = _dkey;
	var applyId = _applyId;
	return dojo.hitch(this, function(e){
		e.preventDefault();
		e.stopPropagation();
		this.applyDailyFixReal.apply(this, [dkey, applyId]);
	});
};

teasp.view.Monthly.prototype.applyDailyFixReal = function(dkey, applyId){
	var dayWrap = this.pouch.getEmpDay(dkey);
	var o = dayWrap.canSelectDailyEx(1);
	if(!o.flag){
		teasp.tsAlert(o.reason.replace(/<br\/>/g, '\n'), this);
		return;
	}
	var req = {
		empId            : this.pouch.getEmpId(),
		month            : this.pouch.getYearMonth(),
		startDate        : this.pouch.getStartDate(),
		lastModifiedDate : this.pouch.getLastModifiedDate(),
		date             : dkey,
		client           : teasp.constant.APPLY_CLIENT_MONTHLY,
		apply            : {
			id           : (applyId || null),
			applyType    : teasp.constant.APPLY_TYPE_DAILY,
			patternId    : null,
			holidayId    : null,
			status       : null,
			startDate    : dkey,
			endDate      : dkey,
			exchangeDate : null,
			startTime    : null,
			endTime      : null,
			note         : null,
			contact      : null
		}
	};
	if(this.pouch.isRequireNote(teasp.constant.APPLY_KEY_DAILY)){
		this.openEmpApply(dkey, applyId, true)();
		return;
	}
	// サーバへ送信
	teasp.manager.request(
		'applyEmpDay',
		req,
		this.pouch,
		{},
		this,
		this.refreshMonthly2,
		function(event){
			teasp.tsAlert(teasp.message.getErrorMessage(event), this);
		}
	);
};

/**
 * 申請ダイアログを開く（クロージャ）
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @param {string=} applyId 申請ID
 * @param {boolean=} dfix
 * @return {Function}
 * @this {teasp.view.Monthly}
 */
teasp.view.Monthly.prototype.openEmpApply = function(dkey, applyId, dfix){
	var req = {
		date     : dkey,
		applyId  : (applyId || null),
		client   : teasp.constant.APPLY_CLIENT_MONTHLY,
		dailyFix : (dfix || false)
	};
	return dojo.hitch(this, function(e){
		if(e){
			e.preventDefault();
			e.stopPropagation();
		}
		this.pouch.checkEmpMonthHook(dojo.hitch(this, function(succeed, event){
			if(!succeed){
				teasp.tsAlert(teasp.message.getErrorMessage(event), this);
				return;
			}
			var f = dojo.hitch(this, function(){
				teasp.manager.dialogOpen(
					'EmpApply',
					req,
					this.pouch,
					this,
					function(flag, opt){
						if(opt){
							this.openBulkZangyo(opt.date, opt.applyType);
						}else if(flag){ // 画面リフレッシュ後、クリーンアップ処理を走らせる
							this.refreshMonthly(true);
						}else{
							this.refreshMonthly2();
						}
					}
				);
			});
			var day = this.pouch.getEmpDay(dkey);
			if(!this.pouch.getObj().dayMap){ // 申請用の情報がない
				teasp.manager.request(
					'loadEmpMonthDelay',
					{
						empId : this.pouch.getEmpId(),
						date  : dkey
					},
					this.pouch,
					{ hideBusy : false },
					this,
					function(obj){
						day.setEmpApplySteps(obj.steps, obj.items);
						f();
					},
					function(event){
						teasp.message.alertError(event);
					}
				);
			}else{
				if(day.getEmpApplyList('ALL').length > 0){ // 申請がある
					teasp.manager.request( // 承認履歴を取得
						'getEmpDayApplySteps',
						{
							empId : this.pouch.getEmpId(),
							date  : dkey
						},
						this.pouch,
						{ hideBusy : false },
						this,
						function(obj){
							day.setEmpApplySteps(obj.steps, obj.items);
							f();
						},
						function(event){
							teasp.message.alertError(event);
						}
					);
				}else{
					f();
				}
			}
		}));
	});
};

teasp.view.Monthly.prototype.openBulkInput = function(){
	teasp.manager.dialogOpen(
		'BulkInput',
		{},
		this.pouch,
		this,
		this.refreshMonthly2
	);
};

teasp.view.Monthly.prototype.openBulkZangyo = function(date, applyType){
	teasp.manager.dialogOpen(
		'BulkOverTime',
		{
			date      : date,
			applyType : applyType
		},
		this.pouch,
		this,
		this.refreshMonthly2
	);
};

/**
 * ベリファイ結果表示ウィンドウをオープン
 */
teasp.view.Monthly.prototype.openVerify = function(){
	var wh = window.open(teasp.getPageUrl('configRefView'), 'tsscan', 'width=420,height=900,resizable=yes,scrollbars=yes');
	if(wh){
		wh.focus();
	}
};

teasp.view.Monthly.prototype.buildMainTable = function(){
	this.noteWidth = (teasp.isTs1Optimize() ? Math.max(Math.min(window.innerWidth - 303 - 16, 160), 0) : 160);
	var table = dojo.create('table', { className:"main_table", id:"mainTable" });
	if(teasp.isNarrow()){
		dojo.style('tsfArea', 'margin', '0px');
	}
	var tbody = dojo.create('tbody', { id:"mainTableBody" }, table);
	var tr = dojo.create('tr', null, tbody);
	dojo.create('td', { className:"head hdate", colSpan:"2", id:"dateColumn" }, tr);
	dojo.create('div', { id:"stateColumn" }, dojo.create('td', { className:"head hstatus" }, tr));
	dojo.create('td', { className:"head happly", id:"applyColumn" }, tr);
	dojo.create('td', { className:"head hst", id:"startTimeColumn" }, tr);
	dojo.create('td', { className:"head het", id:"endTimeColumn" }, tr);
	dojo.create('td', { className:"head htelework", id:"teleworkColumn" }, tr);
	dojo.create('td', { className:"head hacc", id:"accColumn" }, tr);
	dojo.create('td', { className:"head hjob", id:"jobColumn" }, tr);
	if(teasp.isShowGraph()){
		this.buildGraphArea(tr);
	}
	dojo.create('td', {
		className:"head hnote",
		colSpan:"2",
		id:"noteColumn",
		style:"width:" + (this.noteWidth + 38) + 'px'
	}, tr);
	for(var i = 0 ; i < 31 ; i++){
		tr = dojo.create('tr', { className:"days " + ((i%2)==0 ? "odd" : "even"), id:"empDay" + i }, tbody);
		dojo.create('td', { className:"dval vdate" }, tr);
		dojo.create('td', { className:"dval vweek" }, tr);
		dojo.create('div', null, dojo.create('td', { className:"dval vstatus" }, tr));
		dojo.create('div', null, dojo.create('td', { className:"dval vapply" }, tr));
		dojo.create('td', { className:"dval vst" }, tr);
		dojo.create('td', { className:"dval vet" }, tr);
		dojo.create('div', null, dojo.create('td', { className:"dval vtelework" }, tr));
		dojo.create('div', null, dojo.create('td', { className:"dval vacc" }, tr));
		dojo.create('div', null, dojo.create('td', { className:"dval vjob" }, tr));
		dojo.create('div', null, dojo.create('td', { className:"dval vbttn", style:"position:relative;" }, tr));
		dojo.create('td', { className:"dval vnote", style:"width:" + this.noteWidth + 'px;position:relative;' }, tr);
	}
	tr = dojo.create('tr', null, tbody);
	var colSpan = 8;
	dojo.create('td', { className:"foot", colSpan:colSpan }, tr);
	dojo.create('td', { className:"foot" }, tr);
	dojo.create('td', { className:"foot" }, tr);
	var tfoot = dojo.create('tfoot', null, table);
	tr = dojo.create('tr', { id:"mainTableFoot" }, tfoot);
	dojo.create('div', { className:'fdate'    }, dojo.create('td', null, tr));
	dojo.create('div', { className:'fweek'    }, dojo.create('td', null, tr));
	dojo.create('div', { className:'fstatus'  }, dojo.create('td', null, tr));
	dojo.create('div', { className:'fapply'   }, dojo.create('td', null, tr));
	dojo.create('div', { className:'fst'      }, dojo.create('td', null, tr));
	dojo.create('div', { className:'fet'      }, dojo.create('td', null, tr));
	dojo.create('div', { className:'ftelework'}, dojo.create('td', { id:"telColumnProp" }, tr));
	dojo.create('div', { className:'facc'     }, dojo.create('td', { id:"accColumnProp" }, tr));
	dojo.create('div', { className:'fjob'     }, dojo.create('td', { id:"jobColumnProp" }, tr));
	if(teasp.isShowGraph()){
		dojo.create('div', { className:"graph_foot" }, dojo.create('td', null, tr));
	}
	dojo.create('div', { className:'fbttn' }, dojo.create('td', null, tr));
	dojo.create('div', {
		style:"width:" + this.noteWidth + 'px;',
		className:'fnote'
	}, dojo.create('td', { className:"vnote" }, tr));
	return table;
};

teasp.view.Monthly.prototype.buildGraphArea = function(tr){
	var area  = dojo.create('td',  { className:"head graph_area", rowSpan:"33", style:"background-color:transparent;width:100px;" }, tr);
	var div   = dojo.create('div', { className:"graph_over rel_div", id:"graphDiv", style:"width:100px;margin:0px;padding:0px;" }, area);
	var table = dojo.create('table', { frame:"box", id:"graphTable", className:"graphTable", style:"width:500px;display:none;" }, div);
	var tbody = dojo.create('tbody', null, table);
	var tr = dojo.create('tr', { style:"height:42px;border-bottom:1px solid #ACC2E9;height:42px;" }, tbody);
	for(var n = 0 ; n <= 48 ; n++){
		dojo.create('div', { innerHTML:n }, dojo.create('td', { className:'meter' }, tr));
	}
	for(var n = 0 ; n < 31 ; n++){
		var td = dojo.create('td', {
			colSpan  :"49",
			className:"dayLine"
		}, dojo.create('tr', {
			className:((n%2)==0 ? "dl_odd" : "dl_even")
		}, tbody));
		if(n == 30){
			td.style.borderBottom = "1px solid #ACC2E9;";
		}
	}
	var tr = dojo.create('tr', { style:"height:42px;" }, tbody);
	for(var n = 0 ; n <= 48 ; n++){
		dojo.create('div', { innerHTML:n }, dojo.create('td', { className:'meter' }, tr));
	}
	return area;
};

/**
 * 勤務表の備考欄の文字列が枠幅に収まるかチェックして、収まる場合は、「...」を表示しない
 */
teasp.view.Monthly.prototype.viewPostProcess = function(){
	dojo.query('td.vnote', dojo.byId('mainTableBody')).forEach(function(td){
		dojo.query('div.note-area', td).forEach(function(el){
			if(el.nextSibling && el.firstChild && el.firstChild.offsetWidth > el.offsetWidth){
				dojo.style(el.nextSibling, 'display', '');
			}
		});
	});
};
/**
 * 月次残業申請ボタンの初期化
 */
teasp.view.Monthly.prototype.showMonthlyApplyButton = function(){
	var monthApplyButton = dojo.byId('monthlyApplyButtonLabel');
	var showButton = this.pouch.isShowMonthlyOverTimeApplyButton();
	var div = dojo.query('#monthlyApplyButton > div:first-child')[0];
	div.className = this.pouch.getStatusClassOfApplysIcon(this.pouch.getMonthlyOverTimeApplys());
	dojo.style(monthlyApplyButton.parentNode, 'display', (showButton ? '' : 'none'));
	if(showButton){
		this.eventHandles.push(dojo.connect(dojo.byId('monthlyApplyButton'), 'onclick', this, this.doOpenMonthlyApply));
	}
};
/**
 * 月次残業申請のダイアログを表示
 */
teasp.view.Monthly.prototype.doOpenMonthlyApply = function(){
	var applyIds = this.pouch.getMonthlyOverTimeApplyIds(true); // 承認履歴未取得の月次残業申請のID配列
	if(!applyIds.length){
		this.openMonthlyApply();
		return;
	}
	teasp.manager.request( // 承認履歴を取得
		'getApplyStepsById',
		applyIds,
		this.pouch,
		{ hideBusy : false },
		this,
		function(obj){
			this.pouch.setMonthlyApplySteps(obj);
			this.openMonthlyApply();
		},
		function(event){
			teasp.message.alertError(event);
		}
	);
};
/**
 * 月次残業申請のダイアログを表示
 */
teasp.view.Monthly.prototype.openMonthlyApply = function(){
	this.loadApproverSet(dojo.hitch(this, function(flag){
		if(flag){
			teasp.manager.dialogOpen(
				'EmpMonthlyApply',
				{},
				this.pouch,
				this,
				function(){
					this.refreshMonthly(true);
				}
			);
		}
	}));
};
/**
 * 承認者設定の読み込み
 * @param {Function} callback 
 */
teasp.view.Monthly.prototype.loadApproverSet = function(callback){
	if(!this.pouch.isUseApproverSet()  // 承認者設定を使用しない
	|| this.pouch.isLoadedApproverSet()){ // 読み込み済み
		callback(true);
	}else{
		teasp.manager.request(
			'getAtkApproverSet',
			{
				action : 'getAtkApproverSet',
				empId  : this.pouch.getEmpId()
			},
			this.pouch,
			{ hideBusy : false },
			this,
			function(){
				callback(true);
			},
			function(event){
				teasp.message.alertError(event);
				callback(false);
			}
		);
	}
};
