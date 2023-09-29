teasp.provide('teasp.dialog.WorkBalance');
/**
 * 工数実績入力ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.WorkBalance = function(){
	this.widthHint = 615;
	this.heightHint = 480;
	this.id = 'dialogWorkBalance';
	this.title = teasp.message.getLabel('empWorkEdit_btn_title'); //工数実績入力
	this.duration = 1;
	this.okLink = {
		id       : 'empWorkOk',
		callback : this.ok
	};
	this.cancelLink = {
		id       : 'empWorkCancel',
		callback : this.hide
	};
	this.closeLink = {
		id       : 'empWorkClose',
		callback : this.hide
	};
	this.slider = [];
	this.sliderRules = [];
	this.percents = [];
	this.slideInit = [];
	this.rowMin = 5;
	this.sliderBusy = false;
	this.sliderEventIgnore = [];
	this.progressOn = false;
	this.taskNoteOn = false;
	this.jobWorks = null;
	this.classifyJobWorks = null;
	this.eventHandles1 = [];
	this.eventHandles2 = [];
	this.notApprove = null;
};

teasp.dialog.WorkBalance.prototype = new teasp.dialog.Base();

teasp.dialog.WorkBalance.prototype.getCookie = function(){
	return teasp.getCookie('empWorkDialog');
};

teasp.dialog.WorkBalance.prototype.setCookie = function(obj){
	teasp.setCookie('empWorkDialog', obj);
};

teasp.dialog.WorkBalance.prototype.getLocalStorage = function(){
	return teasp.getLocalStorage('empWorkDialog');
};

teasp.dialog.WorkBalance.prototype.setLocalStorage = function(obj){
	teasp.setLocalStorage('empWorkDialog', obj);
};
/**
 *
 * @override
 */
teasp.dialog.WorkBalance.prototype.ready = function(){
	this.progressOn = (this.pouch.getProgressList().length > 0);
	this.taskNoteOn = this.pouch.getTaskNoteOption();
	this.duplable = (!this.isReadOnly() && this.pouch.isPermitDuplicateJobProcess());
};

/**
 * 画面生成
 * @override
 */
teasp.dialog.WorkBalance.prototype.preInit = function(){
	require(["dijit/form/Slider", "dojox/layout/ResizeHandle", "dojo/cookie"]);

	var eg = (this.progressOn ? 'x' : 'x_edge');

	this.content = '<div id="empWorkDialog" style="position:relative;"><table class="emp_work_frame" style="width:100%;"><tr><td style="padding: 0px 6px 6px 6px;"><table class="horiz" style="width:100%;"><tr><td style="text-align:left;"><table class="pane_table"><tr><td><div id="empWorkDate"></div></td><td><div id="empWorkRealTime" style="margin-left:25px;"></div></td></tr></table></td><td style="text-align:right;"><div id="empWorkLockMsg"></div></td></tr></table></td></tr><tr class="emp_work_note_area"><td style="background-color:#CCDDEA;border:1px solid #74A3C5;text-align:left;"><div style="margin-left:12px;color:#4684B2;font-size:13px;font-weight:bold;" id="jobWorks_workReport_label"></div></td></tr><tr class="emp_work_note_area" style="height:1px;"><td><div style="height:1px;"></div></td></tr><tr class="emp_work_note_area"><td style="border:1px solid #74A3C5;text-align:left;"><table class="pane_table" style="width:100%;"><tr><td><textarea id="empWorkTableNote" style="width:99%;height:70px;border:none;margin:0px;line-height:120%;" maxLength="32000"></textarea></td></tr></table></td></tr><tr class="emp_work_note_area" style="height:4px;"><td><div style="height:4px;"></div></td></tr><tr><td><table class="head" style="width:100%;"><thead><tr><th class="num" >#</th><th class="name" id="jobWorks_jobName_head"></th><th class="volume"><table class="meter"><tr><td colspan="13" class="title" id="meterName"></td></tr><tr><td class="edge"></td><td class="mid">0</td><td class="mid">1</td><td class="mid">2</td><td class="mid">3</td><td class="mid">4</td><td class="mid">5</td><td class="mid">6</td><td class="mid">7</td><td class="mid">8</td><td class="mid">9</td><td class="mid" style="width:20px;">10</td><td class="edge"></td></tr></table></th><th class="time XXXXX"></th><!--$$PROGRESS$$--></tr></thead></table></td></tr><tr style="height:1px;"><td></td></tr><tr><td><table class="horiz" style="width:100%;"><tr><td><div class="scroll_area disp_block" style="width:auto;" id="empWorkTableArea"><table class="data" style="width:100%;"><tbody id="empWorkTableBody"></tbody></table></div></td></tr></table></td></tr><tr><td><table class="foot" id="empWorkTableFoot" style="width:100%;"><tbody id="empWorkTableFootBody"></tbody></table></td></tr><tr class="exp_table_edit_row" style="display:none;"><td><table class="horiz" style="width:100%;"><tr class="ts-buttons-row"><td style="width:90px;text-align:left;padding-left:10px;padding-bottom:auto;"><input type="button" class="pb_btn_plusL" id="empWorkPlus" /></td><td style="text-align:center;padding-top:12px;padding-bottom:4px;"><div><button class="std-button1" id="empWorkOk" ><div></div></button><button class="std-button2" id="empWorkCancel" ><div></div></button></div></td><td style="width:90px;text-align:right;padding-top:12px;padding-right:8px;"><button class="std-button2" style="margin-left:auto;" id="empWorkOption1" ><div></div></button></td></tr></table></td></tr><tr class="exp_table_ref_row"><td><table class="horiz" style="width:100%;"><tr class="ts-buttons-row"><td style="width:90px;text-align:left;padding-top:0px;padding-bottom:auto;"></td><td style="text-align:center;padding-top:12px;padding-bottom:4px;"><div><button class="std-button2" id="empWorkClose" ><div></div></button></div></td><td style="width:90px;text-align:right;padding-top:12px;padding-right:8px;"><button class="std-button2" style="margin-left:auto;" id="empWorkOption2" ><div></div></button></td></tr></table></td></tr></table><div id="empWorkHandle"></div></div>';
	this.content = this.content.replace('<!--$$PROGRESS$$-->',
					(this.progressOn ? '<th class="prog">'+teasp.message.getLabel('progress_head') + '</th>' : '')); // 進捗
	this.content = this.content.replace(' XXXXX', eg);
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.WorkBalance.prototype.preStart = function(){
	// 設定ボタンがクリックされた
	dojo.connect(dojo.byId('empWorkOption1'), 'onclick', this, this.openEmpWorkOption);
	dojo.connect(dojo.byId('empWorkOption2'), 'onclick', this, this.openEmpWorkOption);

	dojo.connect(this.dialog, 'onCancel', this, this.hide);

	//文字情報設定
	//  innerHTML
	teasp.message.setLabelHtml('jobWorks_workReport_label' ,'workReport_label'); // 作業報告
	teasp.message.setLabelHtml('jobWorks_jobName_head'     ,'task_head');        // タスク
	teasp.message.setLabelHtml('meterName'                 ,'workVolume_head');  // 作業時間・ボリューム
	teasp.message.setLabelHtml('time_label'); // 時間
	//  TITLE
	teasp.message.setLabelTitle('empWorkPlus'   , 'tm20003010');       // ジョブアサイン
	teasp.message.setLabelTitle('empWorkOk'     , 'save_btn_title');   // 登録
	teasp.message.setLabelTitle('empWorkCancel' , 'cancel_btn_title'); // キャンセル
	teasp.message.setLabelTitle('empWorkOption1', 'tm20002010');       // 工数入力設定
	teasp.message.setLabelTitle('empWorkClose'  , 'close_btn_title');  // 閉じる
	teasp.message.setLabelTitle('empWorkOption2', 'tm20002010');       // 工数入力設定

	dojo.byId('empWorkOk'     ).firstChild.innerHTML = teasp.message.getLabel('save_btn_title');        // 登録
	dojo.byId('empWorkCancel' ).firstChild.innerHTML = teasp.message.getLabel('cancel_btn_title');      // キャンセル
	dojo.byId('empWorkClose'  ).firstChild.innerHTML = teasp.message.getLabel('close_btn_title');       // 閉じる
	dojo.byId('empWorkOption1').firstChild.innerHTML = teasp.message.getLabel('tk10005500');            // 設定
	dojo.byId('empWorkOption2').firstChild.innerHTML = teasp.message.getLabel('tk10005500');            // 設定

	if(this.pouch.isDeployJobSearchBox()){ // 検索窓を設置
		this.showSearchBox();
	}
};

// 検索窓を設置する
teasp.dialog.WorkBalance.prototype.showSearchBox = function(){
	var div = dojo.create('div', { className:'searchbox' }, dojo.byId('jobWorks_jobName_head'));
	dojo.create('div', { className:'loupe' }, dojo.create('div', null, div)); // 虫眼鏡アイコン
	var inp = dojo.create('input', {
		type:'text',
		placeholder:teasp.message.getLabel('tf10008560'), // (全件表示)
		maxLength:80
	}, dojo.create('div', null, div));
	var clr = dojo.create('div', null, div);
	dojo.create('div', { className:'clear', style:'display:none;' }, clr); // クリアボタン

	// iPad/iPhone の場合、漢字変換後に keyup イベントがこないため、
	// タイマーでテキストボックスを監視
	if(/iPad|iPhone/.test(navigator.userAgent)){
		this.watchTimer = null;
		this.watchValue = null;
		dojo.connect(inp, 'onblur', this, this.watchOff);
		dojo.connect(inp, 'onkeyup', this, this.watchOn);
	}else{
		dojo.connect(inp, 'onkeyup', this, this.filterJob);
	}
	dojo.connect(inp, 'onpaste', this, this.filterDelay); // 貼り付けイベント
	dojo.connect(inp, 'oncut'  , this, this.filterDelay); // 切り取りイベント
	dojo.connect(clr, 'onclick', this, this.clearFilter); // クリアボタン
};

// iPad/iPhone の場合、漢字変換時に keyup イベントがこないため、
// タイマーでテキストボックスを監視(0.5秒間隔)
teasp.dialog.WorkBalance.prototype.watchOn = function(){
	var inps = dojo.query('#jobWorks_jobName_head input');
	if(!inps || !inps.length){
		return;
	}
	if(inps[0].value != this.watchValue){
		this.filterJob();
		this.watchValue = inps[0].value;
		if(!this.watchTimer){
			this.watchTimer = window.setInterval(dojo.hitch(this, this.watchOn), 500);
		}
	}
};

// (iPad/iPhone の場合)監視を止める
teasp.dialog.WorkBalance.prototype.watchOff = function(){
	if(this.watchTimer){
		window.clearInterval(this.watchTimer);
		this.watchTimer = null;
	}
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.WorkBalance.prototype.preShow = function(){
	this.dialog.maxRatio = 1.0;
	this.CAP_MARGIN_H = 54; // ダイアログのキャプション＋empWorkDialogのパディング高さ
	this.OTHER_H = 163; // ダイアログの日付エリア高さ＋ボタンエリア高さ
	this.NOTE_H = 103; // 日次の作業報告エリアのデフォルトの高さ
	this.SCROLLL_W = 30 // ダイアログのスクロールバーの横幅

	this.inputOk = true;
	// 前回のイベントハンドルをクリアする
	for(var i = 0 ; i < this.eventHandles1.length ; i++){
		dojo.disconnect(this.eventHandles1[i]);
		delete this.eventHandles1[i];
	}
	this.eventHandles1 = [];

	this.clearFilter(); // 検索窓クリア

	this.isSaveAssignIfOnlyScheduled = this.args.scheduleImport;
	this.classifyJobWorks = this.args.classifyJobWorks;
	this.jobWorks = this.pouch.getJobWorks(this.classifyJobWorks);

	this.orgLeftoverJobId = this.pouch.getLeftoverJobId(); // 残工数を登録するジョブ

	teasp.util.time.setTimeFormat({form:'h:mm', round:1});

	this.notApprove = null;
	if(this.pouch.isProhibitInputTimeUntilApproved()){  // 承認されるまで時間入力を禁止
		var empDay = this.pouch.getEmpDay(this.args.date);
		this.notApprove = empDay.isInputableEx();
	}

	dojo.query('.emp_work_note_area').forEach(function(elem){
		dojo.style(elem, 'display', (!this.pouch.getWorkNoteOption() ? 'none' : ''));
	}, this);

	dojo.query('.exp_table_ref_row').forEach(function(elem){
		elem.style.display = (this.isReadOnly() ? '' : 'none');
	}, this);
	dojo.query('.exp_table_edit_row').forEach(function(elem){
		elem.style.display = (this.isReadOnly() ? 'none' : '');
	}, this);

	dojo.byId('empWorkDate').innerHTML = teasp.util.date.formatDate(this.args.date, 'JP1');
	if(this.args.workRealTime){
		dojo.byId('empWorkRealTime').innerHTML = teasp.message.getLabel('tm20002030')
							+ teasp.util.time.timeValue(this.args.workRealTime)
							+ (this.args.zanteiFlag ? teasp.message.getLabel('tm20002040') : ''); // 暫定
	}else{
		dojo.byId('empWorkRealTime').innerHTML = '';
	}

	dojo.byId('empWorkTableNote').value = (this.args.workNote || this.pouch.getWorkNoteTemplate() || '');
	dojo.byId('empWorkTableNote').readOnly = (this.isReadOnly() ? true : false);
	dojo.style(dojo.byId('empWorkTableNote')           , 'background-color', (this.isReadOnly() ? '#eee' : '#fff'));
	dojo.style(dojo.byId('empWorkTableNote').parentNode, 'background-color', (this.isReadOnly() ? '#eee' : '#fff'));

	if(!this.isReadOnly()){
		this.eventHandles1.push(dojo.connect(dojo.byId('empWorkPlus'), 'onclick', this, this.showEmpJobAssign));
	}

	this.createBody();

	this.setTopRightMessage();

	dojo.style('empWorkDialog', 'min-width', (780 - (this.progressOn ? 0 : 101))+'px');
	if(this.noDialog()){
		dojo.style('empWorkTableArea', 'height', 'auto');
	}else{
		var areaH = 0;
		var areaW = 0;
		var noteH = 0;
		if(!this.resizeHandle){
			this.resizeHandle = new dojox.layout.ResizeHandle({
				resizeAxis:'xy',
				activeResize:true,
				intermediateChanges: true,
				minWidth:(780 - (this.progressOn ? 0 : 101)),
				minHeight:172,
				targetId: 'empWorkDialog'
			}, dojo.byId('empWorkHandle'));
			dojo.connect(this.resizeHandle, 'onResize', this, this.resizeDialog);

			var obj = this.getLocalStorage(); // 保存されているサイズを読み込み
			if(obj && obj.height && obj.width){
				areaH = obj.height;
				areaW = obj.width;
			}else{
				areaH = 300;
				areaW = 1101 - (this.progressOn ? 0 : 101); // ジョブ名が1行に50文字入るくらいの横幅を初期値とする

				this.sizeByRow = true;
			}
			noteH = this.NOTE_H;
		}else{
			areaH = this.workTableHeight;
			areaW = this.dialogWidth;
			noteH = this.workNoteHeight;
		}
		// 縦サイズが表示領域高さを超えないようにサイズを調整
		var box = dojo.window.getBox();
		box.h -= ((this.CAP_MARGIN_H + this.OTHER_H) + (this.pouch.getWorkNoteOption() ? noteH : 0)) ;
		if(box.h < 0){
			box.h = 0;
		}
		if(areaH > box.h){
			areaH = Math.max(34, box.h - 10); // 最低高さ＝１行分とする。-10はスクロールバーが出てしまう対策
			this.areaMaxHeight = areaH;
		}
		dojo.style('empWorkTableArea', 'height', areaH + 'px');
		dojo.style('empWorkDialog', 'width', areaW + 'px');
	}
	dojo.style('empWorkDialog', 'margin'   , '0px');
	dojo.style('empWorkDialog', 'padding'  , '10px 8px');
	dojo.style(dojo.byId('empWorkDialog').parentNode, 'padding', '0px');

	return true;
};

teasp.dialog.WorkBalance.prototype.hide = function(){
	this.watchOff();
	if(!this.noDialog()){
		var area = dojo.byId('empWorkTableArea');
		var dialog = dojo.byId('empWorkDialog');
		this.workTableHeight = area.clientHeight;
		this.dialogWidth = parseInt(dialog.style.width, 10);
		this.workNoteHeight = this.getDailyNoteHeight();
		this.setLocalStorage({ height: this.workTableHeight, width: this.dialogWidth });
	}
	teasp.dialog.Base.prototype.hide.call(this);
};

teasp.dialog.WorkBalance.prototype.resizeDialog = function(o){
	if(!this.noDialog()){
		var h = dojo.byId('empWorkDialog').clientHeight; // コンテンツ高さ
		var w = parseInt(dojo.byId('empWorkDialog').style.width, 10); // コンテンツ横幅
		var box = dojo.window.getBox();
		var maxH = box.h - this.CAP_MARGIN_H; // ウィンドウ表示領域高さ－（キャプション高さ＋マージン）＝コンテンツ高さの上限
		if(maxH < h){
			h = maxH;
		}
		var dnh = this.getDailyNoteHeight();	// 作業報告領域の高さ
		h -= dnh + this.OTHER_H + (dojo.isFF ? 6 : 0); // コンテンツ高さー（作業報告高さ＋その他高さ）＝タスク領域高さ
		var maxW = box.w - this.SCROLLL_W; // ウィンドウ表示領域横幅 － スクロールバー ＝ コンテンツ横幅の上限
		if(maxW < w){
			w = maxW;
		}
		dojo.style('empWorkTableArea', 'height', h + 'px');
		dojo.style('empWorkDialog', 'height', 'auto');
		dojo.style('empWorkDialog', 'width', w + 'px');
		this.sizeByRow = false;
	}
};

/**
 * 作業報告の高さを取得
 * @returns 作業報告領域のheight
 */
teasp.dialog.WorkBalance.prototype.getDailyNoteHeight = function(){
	var h = 0;
	if(this.pouch.getWorkNoteOption()){
		dojo.query('.emp_work_note_area', this.dialog.domNode).forEach(function(elem){
			h += elem.clientHeight;
		});
	}
	return h;
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.WorkBalance.prototype.postShow = function(){
	this.adjustHeight();
	if(!this.noDialog()){
		this.dialog._position();
	}
};

/**
 * 参照モードか登録モードか
 * @return {boolean} true:参照モード
 */
teasp.dialog.WorkBalance.prototype.isReadOnly = function(){
	return (this.pouch.isJobMonthFixedByDate(this.args.date)
		 || this.pouch.isJobMonthReadOnly()
		 || this.args.monthFix
		 || this.args.dayFix
		 || (this.notApprove && !this.notApprove.inputable));
};

teasp.dialog.WorkBalance.prototype.setTopRightMessage = function(){
	if(this.pouch.isJobMonthFixedByDate(this.args.date)){
		dojo.byId('empWorkLockMsg').innerHTML = teasp.message.getLabel('tm20002070'); // ※月次工数実績確定済みのため変更不可
	}else if(this.args.monthFix){
		dojo.byId('empWorkLockMsg').innerHTML = teasp.message.getLabel('tm20002090'); // ※勤怠月次確定済みのため変更不可
	}else if(this.args.dayFix){
		dojo.byId('empWorkLockMsg').innerHTML = teasp.message.getLabel('tm20002080'); // ※勤怠日次確定済みのため変更不可
	}else if(this.notApprove && !this.notApprove.inputable){
		dojo.byId('empWorkLockMsg').innerHTML = teasp.message.getLabel('tk10001152', this.notApprove.applyName); // {0} が未承認のため入力できません
	}else{
		dojo.byId('empWorkLockMsg').innerHTML = '';
	}
	if(this.isReadOnly()){
		dojo.style('empWorkLockMsg', 'color', '#00008b');
	}
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.WorkBalance.prototype.ok = function(){
	if(!this.inputOk){
		return;
	}
	var jobs  = [];
	var works = [];
	var cnt = 0;

	this.collectValue();

	var leftoverJobId = this.pouch.getLeftoverJobId();
	var newJobWorks = this.jobWorks;
	var sumTime     = this.getSumTime();
	var isSaveAssign = false;
	for(var i = 0 ; i < newJobWorks.length ; i++){
		var nj = newJobWorks[i];
		if (!nj.copied
		&& (!teasp.util.equalId(nj.jobId, leftoverJobId) || nj.process)
		&& (nj.isAssigned || nj.key == 'scheduleWorks')) {
			jobs.push({
				id       : (nj.jobAssign ? nj.jobAssign.id : null),
				jobId    : nj.jobId,
				process  : nj.process
			});
		}
		if(nj.onlyScheduled && this.isSaveAssignIfOnlyScheduled){
			isSaveAssign = true;
		}
		if(sumTime <= 0
		&& leftoverJobId
		&& teasp.util.equalId(nj.jobId, leftoverJobId)
		&& !nj.process
		&& !nj.time
		&& !this.args.zanteiFlag){
			continue;
		}
		works.push({
			id             : (nj.workId || null),
			jobId          : nj.jobId,
			time           : (this.args.zanteiFlag && !nj.timeFix ? 0 : (nj.time || 0)),
			timeFix        : nj.timeFix,
			taskNote       : nj.taskNote,
			percent        : nj.percent,
			volume         : nj.volume,
			progress       : nj.progress,
			process        : nj.process,
			extraItem1     : nj.extraItem1,
			extraItem2     : nj.extraItem2,
			extraItem1Name : nj.extraItem1Name,
			extraItem2Name : nj.extraItem2Name,
			order          : (++cnt)
		});
	}
	var workNote = dojo.byId('empWorkTableNote').value.trim();
	teasp.manager.request(
		'saveEmpWork',
		{
			empId     : this.pouch.getEmpId(),
			month     : this.args.jobMonth,
			startDate : this.args.date,
			jobs      : jobs,
			works     : works,
			workNote  : (workNote || null),
			isSaveAssign: isSaveAssign
		},
		this.pouch,
		{ hideBusy : false },
		this,
		function(){
			this.onfinishfunc(this.classifyJobWorks, workNote);
			this.close();
		},
		function(event){
			teasp.message.alertError(event);
		}
	);
};

/**
 * 入力エリア作成
 */
teasp.dialog.WorkBalance.prototype.createBody = function(){
	// 前回のイベントハンドルをクリアする
	for(var i = 0 ; i < this.eventHandles2.length ; i++){
		dojo.disconnect(this.eventHandles2[i]);
		delete this.eventHandles2[i];
	}
	this.eventHandles2 = [];

	for(var i = 0 ; i < this.slider.length ; i++){
		this.slider[i].destroyRecursive();
	}
	this.slider = [];

	for(i = 0 ; i < this.sliderRules.length ; i++){
		this.sliderRules[i].destroyRecursive();
	}
	this.sliderRules = [];

	var tbody = dojo.byId('empWorkTableBody');
	dojo.empty(tbody);
	var rowSize = this.jobWorks.length;
	for(var r = 0 ; r < rowSize ; r++){
		this.sliderEventIgnore[r] = true; // スライダー移動イベントで showTime() 処理をしないようにする
		this.createRow(tbody, r, this.jobWorks[r]);
	}
	if(!rowSize){
		dojo.create('div', {
			innerHTML: teasp.message.getLabel('tm20003040'), // ジョブは割り当てられていません
			style: 'margin:4px;'
		}, dojo.create('td', null, dojo.create('tr', null, tbody)));
	}
	this.adjustHeight();

	for(r = 0 ; r < rowSize ; r++){
		if(this.isReadOnly()){
			this.slider[r].readOnly = true;
		}else{
			this.eventHandles2.push(dojo.connect(this.slider[r], 'onChange', this, function(){
				var rowIndex = r;
				return function(){
					this.sliderChanged(this.slider[rowIndex]);
				};
			}()));
		}
		// 初期処理でスライダーを0以外の位置へセットした箇所は onChange イベントが直後に
		// 呼ばれてしまうが、初回のイベントハンドラ内で showTime() 処理へ行かないようにする。
		if(!this.slideInit[r]){
			this.sliderEventIgnore[r] = false;
		}
	}
	// フッタ部
	var tfoot = dojo.byId('empWorkTableFootBody');
	dojo.empty(tfoot);
	var row = dojo.create('tr', null, tfoot);
	dojo.create('div', { style:"margin-left:24px;text-align:left;", innerHTML: teasp.message.getLabel('total_label') /*合計*/ }, dojo.create('td', null, row));
	dojo.create('div', { id : 'empWorkTotalTime', style:"text-align:center;" }, dojo.create('td', { className : 'time' }, row));
	var rs = (this.progressOn ? 'blankr1' : 'blankr3');
	dojo.create('td', { className : rs }, row);

	this.showTime();
	this.filterJob(); // 検索窓
};

teasp.dialog.WorkBalance.prototype.adjustHeight = function(){
	if(!this.noDialog() && this.sizeByRow){
		var tbody = dojo.byId('empWorkTableBody');
		var h = 0;
		for(var r = 0 ; r < tbody.rows.length ; r++){
			var rh = 28;
			for(var c = 0 ; c < tbody.rows[r].cells.length ; c++){
				var ch = tbody.rows[r].cells[c].clientHeight;
				if(rh < ch){
					rh = ch;
				}
			}
			h += rh;
		}
		if(this.areaMaxHeight){
			h = Math.min(h, this.areaMaxHeight);
		}
		dojo.style('empWorkTableArea', 'height', '' + Math.min(h, 300) + 'px');
	}
};

/**
 * 入力行作成
 *
 * @param {Object} tbody テーブルボディ
 * @param {number} r 行インデックス
 * @param {Object} jobWork 工数実績
 */
teasp.dialog.WorkBalance.prototype.createRow = function(tbody, r, jobWork){
	var row, cell, div;
	this.percents[r] = jobWork.percent;

	// 入力方式切替ボタン
	var inputFix = 0;
	var leftoverJobId = this.pouch.getLeftoverJobId();
	if(this.pouch.getWorkInputType() == teasp.constant.INPUT_VOLUME_FIX
	|| (jobWork.jobAssign && !jobWork.process && leftoverJobId && teasp.util.equalId(jobWork.jobAssign.jobId, leftoverJobId)) && !jobWork.copied){
		inputFix = 2;
		jobWork.timeFix = false;
	}else if(this.pouch.isWorkInputTimeFix(true)){
		inputFix = 1;
		jobWork.timeFix = true;
	}

	var rowStyle = ((r%2)==0 ? 'even' : 'odd');
	row = dojo.create('tr', { className: rowStyle, style:/* (r > 0 ? 'border-top:1px dashed #A3A4A3;' : '')*/'' }, tbody);

	// #
	cell = dojo.create('td', { style: "width:auto;" }, row);
	div = dojo.create('div', { style: { margin:"2px", width:"19px", display:"table-cell" }, innerHTML: '' + (r + 1) }, cell);
	dojo.create('input', { type: 'hidden', id: 'empWorkSeq' + r, value: '' + jobWork.seq }, cell);

	if(this.duplable){
		var pdiv = dojo.create('div', { style: { margin:"2px 2px 2px 0px", display:"table-cell" } }, cell);
		if(jobWork.copied){
			var copyDiv = dojo.create('div', { className: 'pp_base pp_work_delete', title: teasp.message.getLabel('delete_btn_title') }, pdiv); // 削除
			this.eventHandles2.push(dojo.connect(copyDiv, 'onclick', this, this.deleteCopiedWorkRow(r)));
		}else{
			var copyDiv = dojo.create('div', { className: 'pp_base pp_work_copy', title: teasp.message.getLabel('tk10000297') }, pdiv); // コピー
			this.eventHandles2.push(dojo.connect(copyDiv, 'onclick', this, this.copyWorkRow(r)));
		}
	}

	// タスク名
	var jobText = jobWork.jobName + (jobWork.process ? teasp.message.getLabel('tm10001470') + jobWork.process : ''); // ／
	div = dojo.create('div', {
		className : 'name',
		style : { margin:"2px", textAlign:"left", wordBreak:"break-all", display:"table-cell", width:"auto" },
		innerHTML : jobText
	}, cell);
	dojo.create('input', { type:'hidden', value:this.convertStr(jobText) }, cell);
	
	// 入力部分のwidth算出(DOM生成はpreInit関数で行っている)
	var inputContainerWidth = 0;
	const volumeWidth = 246; // table.emp_work_frame table.head th.volume
	const dlgScrollW = 15;
	if(this.progressOn){
		const timexWidth = 121;	// table.emp_work_frame table.head th.timex
		const progWidth = 134; // table.emp_work_frame table.head th.prog
		inputContainerWidth = volumeWidth + timexWidth + progWidth;
		inputContainerWidth -= this.noDialog() ? 0 : dlgScrollW;	// モバイルでない場合はスクロールバー横幅分縮める
	} else {
		const timexEdgeWidth = 154; // table.emp_work_frame table.head th.timex_edge
		inputContainerWidth = volumeWidth + timexEdgeWidth;
		inputContainerWidth -= this.noDialog() ? 0 : dlgScrollW;	// モバイルでない場合はスクロールバー横幅分縮める
	}

	cell = dojo.create('td', { style: { width: inputContainerWidth + "px" } }, row);
	// 作業ボリューム
	// スライダー
	var sliderDiv = dojo.create('div', { style: { margin:"6px 2px", width:"244px", "float":"left" } }, cell);
	div = dojo.create('div', { id: 'empWorkSlider' + r, style: { width:"238px", marginLeft:"2px", marginRight:"2px" } }, sliderDiv);
	// スライダーのルーラー
	this.sliderRules[r] = new dijit.form.HorizontalRule({ count: 11, style: { height:"2px" } }, dojo.create('div', null, div));
	// スライダーの本体
	this.slider[r] = new dijit.form.HorizontalSlider({
		name                : 'empWorkSlider' + r,
		value               : 0,
		minimum             : 0,
		maximum             : (jobWork.timeFix ? 120 : 1000),
		discreteValues      : (jobWork.timeFix ? 121 : 1001),
		intermediateChanges : true,
		style               : { width:"238px", textAlign:"center", marginLeft:"2px", marginRight:"2px" }
	},
	div);

	if(jobWork.timeFix){
		var p = Math.round(jobWork.time / 5);
		if(p > 120){
			p = 120;
		}
		this.slider[r].setValue(p);
		this.slideInit[r] = (p > 0);
	}else{
		this.slider[r].setValue(jobWork.volume || 0);
	}
	// 時間
	var timeDiv = dojo.create('div', {
		style     : { margin:"6px 2px", width:"54px", "float":"left" }
	}, cell);
	var inp = dojo.create('input', {
		type       : 'text',
		className  : 'inputime' + (this.isReadOnly() ? ' inputro' : ''),
		style      : { border:"1px solid #539AC7", fontSize:"12px" },
		id         : 'empInputTime' + r,
		maxLength  : '5',
		value      : (teasp.util.time.timeValue(jobWork.time) || '0:00')
	}, timeDiv);
	if(this.isReadOnly()){
		inp.readOnly = 'readOnly';
	}
	this.eventHandles2.push(dojo.connect(inp, 'blur'      , this, this.onblurTime));
	this.eventHandles2.push(dojo.connect(inp, 'onkeypress', this, this.onkeypressTime));
	var timeLabel = dojo.create('div', {
		style      : { width:"54px", marginTop:"1px", padding:"0px", textAlign:"center" },
		id         : 'empTimeLabel' + r,
		innerHTML  : (teasp.util.time.timeValue(jobWork.time) || '')
	}, timeDiv);
	dojo.style(inp      , 'display', jobWork.timeFix ? '' : 'none');
	dojo.style(timeLabel, 'display', jobWork.timeFix ? 'none' : '');

	var btncs = (jobWork.timeFix ? 'pb_btn_clockon' : 'pb_btn_clock');
	div = dojo.create('div', {
		id        : 'empWorkLock' + r,
		style     : { margin:"2px", "float":"left" },
		className : 'change_input_type pb_base ' + btncs
	}, cell);
	if(!this.isReadOnly() && !inputFix){
		this.eventHandles2.push(dojo.connect(div, 'onclick', this, this.onInputLock));
	}else{
		div.style.cursor = 'default';
	}
	// タスク毎の作業報告入力ダイアログ表示ボタン
	var cols = 4;
	div = dojo.create('div', {
		id        : 'empWorkNote' + r,
		style     : { margin:"2px", "float":"left", display:(this.taskNoteOn ? "" : "none") },
		className : 'change_input_type pb_base pb_btn_tasknote'
	}, cell);
	this.eventHandles2.push(dojo.connect(div, 'onclick', this, this.openTaskNote(jobWork, r)));

	if(this.progressOn){
		var progressList = this.pouch.getProgressList();
		// 進捗選択プルダウン
		var progressDiv = dojo.create('div', {
			style     : { margin:"2px", width:"92px", "float":"left" }
		}, cell);
		var select = dojo.create('select', {
			style     : { width:"92px" },
			id        : 'empWorkProgress' + r,
			className : (this.isReadOnly() ? 'inputro' : '')
		}, progressDiv);
		dojo.create('option', { value: '', innerHTML: '' }, select);
		for(var i = 0 ; i < progressList.length ; i++){
			dojo.create('option', {
				value     : progressList[i],
				innerHTML : progressList[i]
			}, select);
		}
		select.value = jobWork.progress;
		if(this.isReadOnly()){
			select.disabled = true;
		}
		cols++;
	}
	div = dojo.create('div', { style: { clear:"both" } }, cell);

	var extraItems = this.pouch.getExtraItems(jobWork);
	for(var i = 0 ; i < extraItems.length ; i++){
		var item = extraItems[i];
		if(!item){
			continue;
		}
		var extraDiv = dojo.create('div', {
			style     : { margin:"2px", "float":"left" }
		}, cell);
		dojo.create('div', {
			style     : { margin:"4px 4px 4px 2px", "float":"left" },
			innerHTML : (item.name || '')
		}, extraDiv);
		dojo.create('input', {
			type      : 'hidden',
			id        : 'empWorkExtName' + (i + 1) + r,
			value     : (item.name || '')
		}, extraDiv);
		inp = dojo.create('input', {
			type      : 'text',
			id        : 'empWorkExtItem' + (i + 1) + r,
			style     : { margin:"2px", width:item.width + "px" },
			maxLength : item.length,
			className : 'inputran' + (this.isReadOnly() ? ' inputro' : ''),
			value     : (item.value || '')
		}, extraDiv);
		if(this.isReadOnly()){
			inp.readOnly = 'readOnly';
		}
	}
	if(extraItems.length > 0){
		div = dojo.create('div', { style: { clear:"both" } }, cell);
	}
	// タスク毎の作業報告表示エリア
	var taskNote = this.pouch.convNoteString(teasp.util.entitize(jobWork.taskNote, ''));
	dojo.create('div', {
		id        : 'empWorkTaskNote' + r,
		style     : { margin:"2px", textAlign:"left", display:(taskNote ? "" : "none") },
		innerHTML : taskNote
	}, cell);
	dojo.create('input', {
		type  : 'hidden',
		id    : 'empWorkTaskNoteH' + r,
		value : (jobWork.taskNote || '')
	}, cell);
};

/**
 * 時刻入力欄からフォーカスが離れた時の処理
 *
 * @param {Object} e イベント
 */
teasp.dialog.WorkBalance.prototype.onblurTime = function(e){
	teasp.util.time.inputSupportTime(e.target);
	this.moveSlider(e.target);
};

/**
 * 時刻入力欄でキーボード入力された時の処理
 *
 * @param {Object} e イベント
 */
teasp.dialog.WorkBalance.prototype.onkeypressTime = function(e){
	if (e.keyChar == "" && e.keyCode == 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
		teasp.util.time.inputSupportTime(e.target);
		this.moveSlider(e.target);
		e.preventDefault();
		e.stopPropagation();
	}
};

/**
 * 入力方式を変更した時の処理
 *
 * @param {Object} _e イベント
 */
teasp.dialog.WorkBalance.prototype.onInputLock = function(_e){
	var e = (_e || window.event);
	var nd = (e.target || e.srcElement);
	var match = /empWorkLock(\d+)/.exec(nd.id);
	if(match){
		var rowIndex = parseInt(match[1], 10);
		var locked = this.isLockedRow(rowIndex);
		var lock = !locked;
		dojo.toggleClass(nd, 'pb_btn_clock'  , !lock);
		dojo.toggleClass(nd, 'pb_btn_clockon',  lock);
		dojo.style('empInputTime' + rowIndex, 'display', (lock ? '' : 'none'));
		dojo.style('empTimeLabel' + rowIndex, 'display', (lock ? 'none' : ''));
		var orgVal = this.slider[rowIndex].getValue();
		this.slider[rowIndex].maximum = (lock ? 120 : 1000);
		this.slider[rowIndex].discreteValues = (lock ? 121 : 1001);
		if(lock){ // ボリューム入力→時間入力に変えた
			var mm = teasp.util.time.clock2minutes(dojo.byId('empTimeLabel' + rowIndex).innerHTML);
			if(typeof(mm) == 'number'){
				var d = dojo.byId('empInputTime' + rowIndex);
				d.value = teasp.util.time.timeValue(mm || 0);
				this.moveSlider(d);
			}else{
				var v = Math.round(orgVal * 120/1000);
				this.slider[rowIndex].setValue(v);
				dojo.byId('empInputTime' + rowIndex).value = teasp.util.time.timeValue(v / 5);
				this.showTime();
			}
		}else{ // 時間入力→ボリューム入力に変えた
			this.slider[rowIndex].setValue(Math.round(orgVal * 1000/120));
			this.showTime();
		}
	}
};

/**
 * タスク毎の作業報告入力ダイアログを開く
 *
 * @param {Object} jw 工数情報
 * @param {number} rx 行インデックス
 * @return {Function}
 */
teasp.dialog.WorkBalance.prototype.openTaskNote = function(jw, rx){
	var jobWork = jw;
	var rowIndex = rx;
	return function(){
		teasp.manager.dialogOpen(
			'TaskNote',
			{
				title    : jobWork.jobName + (jobWork.process ? teasp.message.getLabel('tm10001470') + jobWork.process : ''), // ／
				note     : (jobWork.taskNote || ''),
				date     : this.args.date,
				readOnly : this.isReadOnly()
			},
			this.pouch,
			this,
			function(o){
				jobWork.taskNote = o.note;
				var taskNote = this.pouch.convNoteString(teasp.util.entitize(jobWork.taskNote, ''));
				dojo.byId('empWorkTaskNote' + rowIndex).innerHTML = taskNote;
				dojo.byId('empWorkTaskNoteH' + rowIndex).value = jobWork.taskNote;
				dojo.style('empWorkTaskNote' + rowIndex, 'display', (taskNote ? '' : 'none'));
				this.adjustHeight();
			}
		);
	};
};

/**
 * 工数入力行をコピー
 *
 * @param {Object} jw 工数情報
 * @param {number} rx 行インデックス
 * @return {Function}
 */
teasp.dialog.WorkBalance.prototype.copyWorkRow = function(rx){
	var rowIndex = rx;
	return function(){
		this.collectValue();
		var o = dojo.clone(this.jobWorks[rowIndex]);
		o.work = null;
		o.workId = null;
		o.time = 0;
		o.volume = 0;
		o.percent = 0;
		o.progress = null;
		o.taskNote = null;
		o.extraItem1 = null;
		o.extraItem2 = null;
		if(o.jobAssign){
			o.jobAssign.id = null;
		}
		o.seq = teasp.sequence.jobWork++;
		if(teasp.util.equalId(o.jobId, this.pouch.getLeftoverJobId()) && !o.process){
			o.timeFix = true;
		}
		o.copied = true;
		this.jobWorks.splice(rowIndex + 1, 0, o);
		for(var i = 0 ; i < this.jobWorks.length ; i++){
			var jw = this.jobWorks[i];
			jw.order = (i + 1);
		}
		this.createBody();
	};
};

/**
 * 工数入力行をコピー
 *
 * @param {Object} jw 工数情報
 * @param {number} rx 行インデックス
 * @return {Function}
 */
teasp.dialog.WorkBalance.prototype.deleteCopiedWorkRow = function(rx){
	var rowIndex = rx;
	return function(){
		this.collectValue();
		this.jobWorks.splice(rowIndex, 1);
		for(var i = 0 ; i < this.jobWorks.length ; i++){
			var jw = this.jobWorks[i];
			jw.order = (i + 1);
		}
		this.createBody();
	};
};

/**
 * 工数入力オプションダイアログを開く
 *
 */
teasp.dialog.WorkBalance.prototype.openEmpWorkOption = function(){
	this.collectValue();
	var lo = {}, mp = {}, lst = [];
	var empLoJobId = this.pouch.getLeftoverJobId();
	var comLoJobId = this.pouch.getLeftoverJobId(true);
	this.orgLeftoverJobId = empLoJobId;
	for(var r = 0 ; r < this.jobWorks.length ; r++){
		var o = this.jobWorks[r];
		if(mp[o.jobId]){
			continue;
		}
		mp[o.jobId] = 1;
		lst.push({ jobId: o.jobId, jobName: o.jobName, flag:(lo[o.jobId] || 0) });
	}
	teasp.manager.dialogOpen(
		'EmpWorkOption',
		{
			empLoJobId  : empLoJobId,
			comLoJobId  : comLoJobId,
			jobs        : lst
		},
		this.pouch,
		this,
		function(o, res){
			dojo.query('.emp_work_note_area').forEach(function(elem){
				dojo.style(elem, 'display', (o.workNoteOption ? '' : 'none'));
			});
			this.pouch.setWorkInputType(o.workInputType);
			this.pouch.setWorkNoteOption(o.workNoteOption);
			this.pouch.setTaskNoteOption(o.taskNoteOption);
			this.pouch.setLeftoverJob(res);
			this.taskNoteOn = o.taskNoteOption;
			for(var r = 0 ; r < this.slider.length ; r++){
				dojo.style('empWorkNote' + r, 'display', (o.taskNoteOption ? '' : 'none'));
			}
			if(this.args.reflectWorkOption){
				this.args.reflectWorkOption.apply(this.args.thisObject);
			}
			if(o.changeLeftoverJob){
				setTimeout(dojo.hitch(this, this.ok), 100);
			}
		}
	);
};

/**
 * スライダー移動
 *
 * @param {Object} node ノード
 */
teasp.dialog.WorkBalance.prototype.sliderChanged = function(node){
	if(this.sliderBusy){
		return;
	}
	this.sliderBusy = true;

	var match = /empWorkSlider(\d+)/.exec(node.id);
	var rowIndex = parseInt((match ? match[1] : null), 10);
	if(typeof(rowIndex) != 'number' || isNaN(rowIndex)){
		this.sliderBusy = false;
		return;
	}
	if(this.sliderEventIgnore[rowIndex]){
		this.sliderEventIgnore[rowIndex] = false;
		this.sliderBusy = false;
		return;
	}
	var locked = this.isLockedRow(rowIndex);
	if(locked){
		dojo.byId('empInputTime' + rowIndex).value = teasp.util.time.timeValue(this.slider[rowIndex].getValue() * 5);
	}
	this.showTime();
	this.sliderBusy = false;
};

/**
 * タスク割当てのダイアログを表示
 */
teasp.dialog.WorkBalance.prototype.showEmpJobAssign = function(){
	this.collectValue();
	var f = dojo.hitch(this, function(){
		teasp.manager.dialogOpen(
			'EmpJobAssign',
			{
				empId            : this.pouch.getEmpId(),
				date             : this.args.date,
				classifyJobWorks : this.classifyJobWorks
			},
			this.pouch,
			this,
			function(o){
				// 変更前の工数入力値を採取する
				var vmap = {};
				for(var i = 0 ; i < this.jobWorks.length ; i++){
					var jw = this.jobWorks[i];
					var key = jw.jobId + (jw.process ? ('\t' + jw.process) : '');
					var o = vmap[key];
					if(!o){
						o = vmap[key] = {
							jobId: jw.jobId,
							process: jw.process,
							lst:[]
						};
					}
					o.lst.push({ time: jw.time, volume: jw.volume, timeFix: jw.timeFix });
				}
				// 変更が反映されたリストに工数入力値をセットする
				this.classifyJobWorks = dojo.clone(this.pouch.getClassifyJobWorks(this.args.date, true));
				this.onfinishfunc(this.classifyJobWorks, null, true);
				this.isSaveAssignIfOnlyScheduled = false;
				if(this.args.reflectJobAssign){
					this.args.reflectJobAssign(this.classifyJobWorks);
				}
				this.jobWorks = this.pouch.getJobWorks(this.classifyJobWorks);
				// 1.変更前と変更後で、ジョブID＋作業分類が一致するものを探して値をセット
				var sumi = {};
				for(var key in vmap){
					var o = vmap[key];
					var lst = o.lst || [];
					for(var x = 0 ; x < lst.length ; x++){
						var v = lst[x];
						if(!v.done){
							for(var i = 0 ; i < this.jobWorks.length ; i++){
								var jw = this.jobWorks[i];
								var k = jw.jobId + (jw.process ? ('\t' + jw.process) : '');
								if(!sumi[i] && key == k){
									jw.time   = v.time;
									jw.volume = v.volume;
									jw.timeFix = v.timeFix;
									sumi[i] = 1;
									v.done = true;
									break;
								}
							}
						}
					}
				}
				// 2.1で相手が見つからなかった場合、ジョブIDが一致するものを探して値をセット
				for(var key in vmap){
					var o = vmap[key];
					var lst = o.lst || [];
					for(var x = 0 ; x < lst.length ; x++){
						var v = lst[x];
						if(!v.done){
							for(var i = 0 ; i < this.jobWorks.length ; i++){
								var jw = this.jobWorks[i];
								if(!sumi[i] && o.jobId == jw.jobId){
									jw.time   = v.time;
									jw.volume = v.volume;
									jw.timeFix = v.timeFix;
									sumi[i] = 1;
									v.done = true;
									break;
								}
							}
						}
					}
				}
				this.createBody();
			}
		);
	});
	if(this.args.client != teasp.constant.APPLY_CLIENT_EMP_WORK
	&& !this.pouch.getObj().dayMap){ // 申請用の情報がない
		teasp.manager.request(
			'loadEmpMonthDelay',
			{
				empId : this.pouch.getEmpId(),
				date  : this.args.date
			},
			this.pouch,
			{ hideBusy : false },
			this,
			function(obj){
				f();
			},
			function(event){
				teasp.message.alertError(event);
			}
		);
	}else{
		f();
	}
};

/**
 * その行の入力タイプを取得
 *
 * @param {number} rowIndex 行インデックス
 * @return {boolean} true:時間で入力
 */
teasp.dialog.WorkBalance.prototype.isLockedRow = function(rowIndex, jobWork){
	if(jobWork){
		var loJobId = this.pouch.getLeftoverJobId();
		if(loJobId){
			return (jobWork.jobId == loJobId ? false : true);
		}
	}
	var div = dojo.byId('empWorkLock' + rowIndex);
	return (dojo.hasClass(div, 'pb_btn_clockon') || dojo.hasClass(div, 'pb_btn_clockon_dis'));
};

/**
 * 時間入力された行のスライダーを移動する
 *
 * @param {Object} node ノード
 */
teasp.dialog.WorkBalance.prototype.moveSlider = function(node){
	var match = /(\d+)/.exec(node.id);
	if(match){
		var r = parseInt(match[1], 10);
		if(node.value == ''){
			node.value = teasp.util.time.timeValue(0);
		}
		var mm = teasp.util.time.clock2minutes(node.value);
		mm = ((typeof(mm) == 'number' && mm > 0) ? Math.round(mm / 5) : 0);
		if(mm > 120){
			mm = 120;
		}
		// 直後の onChange イベントで showTime() に行かないようにしておく。
		this.sliderEventIgnore[r] = true;
		this.slider[r].setValue(mm);
	}
	this.showTime();
};

/**
 * ボリューム入力行のボリューム合計
 *
 * @return {number} ボリューム
 */
teasp.dialog.WorkBalance.prototype.getSumVolume = function(){
	var sumVolume = 0;
	for(var r = 0 ; r < this.slider.length ; r++){
		if(!this.isLockedRow(r)){
			sumVolume += this.slider[r].getValue();
		}
	}
	return sumVolume;
};

/**
 * 時間入力行の時間合計
 *
 * @return {number} 合計時間
 */
teasp.dialog.WorkBalance.prototype.getSumTime = function(){
	var sumTime = 0;
	for(var r = 0 ; r < this.slider.length ; r++){
		if(this.isLockedRow(r)){
//                sumTime += (this.slider[r].getValue() * 5);
			sumTime += teasp.util.time.clock2minutes(dojo.byId('empInputTime' + r).value);
		}
	}
	return sumTime;
};

/**
 * 時間を取得
 *
 * @param {number} rowIndex 行インデックス
 * @param {number=} per パーセント
 * @param {number=} tm 時間
 * @return {number|null|undefined} 時間
 */
teasp.dialog.WorkBalance.prototype.getTime = function(rowIndex, per, tm){
	var locked = this.isLockedRow(rowIndex);
	if(locked){ // 時間で入力
		return teasp.util.time.clock2minutes(dojo.byId('empInputTime' + rowIndex).value);
	}else{
		return ((tm && tm > 0) ? Math.round(tm * per / 1000) : null);
//            return (workRealTime ? Math.floor(workRealTime * per / 1000) : null);
	}
};

/**
 * 指定行のボリュームを取得.<br/>
 * 時間で入力された行はボリュームに換算した値を返す
 *
 * @param {number} rowIndex 行インデックス
 * @param {number=} sumTime 合計時間
 * @return {number} ボリューム
 */
teasp.dialog.WorkBalance.prototype.getVolume = function(rowIndex, sumTime){
	var locked = this.isLockedRow(rowIndex);
	if(locked){ // 時間で入力
		var m = teasp.util.time.clock2minutes(dojo.byId('empInputTime' + rowIndex).value);
		return (sumTime > 0 ? Math.round(m * 1000 / sumTime) : 0);
	}else{ // ボリュームで入力
		return this.slider[rowIndex].getValue();
	}
};

/**
 * 作業時間合計時間を得る
 *
 * @return {Object} 作業時間合計
 */
teasp.dialog.WorkBalance.prototype.getCurrentTotalTime = function(){
	var sumTime   = this.getSumTime();
	var sumVolume = this.getSumVolume();
	var mm = 0;
	if(this.args.workRealTime > 0 && sumVolume > 0){
		mm = (this.args.workRealTime < sumTime ? sumTime : this.args.workRealTime);
	}else{
		mm = sumTime;
	}
	return {
		total       : mm,
		fixTime     : sumTime,
		volume      : sumVolume
	};
};

/**
 * 作業時間合計の表示、ボリュームから時間を再計算
 *
 */
teasp.dialog.WorkBalance.prototype.showTime = function(){
	var ctt = this.getCurrentTotalTime();
	dojo.byId('empWorkTotalTime').innerHTML = teasp.util.time.timeValue(ctt.total);

	var matched = (this.args.workRealTime == ctt.total); // 工数と実労働時間が一致
	if(!this.isReadOnly()){
		this.collectValue();
		if(this.pouch.isCheckInputWorkHours() // 入力時チェック＝オン
		&& this.args.worked
		&& !this.args.zanteiFlag){ // 出退社時刻入力済み
			this.inputOk = matched;
		}
	}
	if(this.pouch.isCheckInputWorkHours()){
		this.inputBlock(matched);
	}
	var complex = false;
	for(var r = 0 ; r < this.jobWorks.length ; r++){
		var jobWork = this.jobWorks[r];
		if(jobWork.timeFix && jobWork.time){
			complex = true;
			break;
		}
	}
	for(var r = 0 ; r < this.jobWorks.length ; r++){
		var jobWork = this.jobWorks[r];
		if(jobWork.timeFix){
			continue;
		}
		var node = dojo.byId('empTimeLabel' + r);
		var mode = 0; // 0:time, 1:volume, 2:percent
		if(!jobWork.timeFix && !this.args.worked && !this.args.zanteiFlag){
			mode = (!complex && jobWork.perDisp && jobWork.per100 > 0) ? 2 : 1;
		}
		if(!jobWork.volume){
			node.innerHTML = '-';
		}else{
			if(mode == 0){
				node.innerHTML = teasp.util.time.timeValue(jobWork.time || 0);
			}else if(mode == 2){
				node.innerHTML = jobWork.per100.toFixed(0) + '%';
			}else{
				node.innerHTML = teasp.message.getLabel('tm20002050'); // ＊＊
			}
		}
		dojo.toggleClass(node, 'time-label'   , (mode == 0));
		dojo.toggleClass(node, 'volume-label' , (mode == 1));
		dojo.toggleClass(node, 'percent-label', (mode == 2));
	}
};

teasp.dialog.WorkBalance.prototype.inputBlock = function(matched){
	var diff = !matched; // 一致しない→差異ありの表示をする
	var ex = dojo.query('#empWorkTableFootBody .time')[0];
	dojo.style(ex, 'background-color', (diff ? '#ffc0cb' : 'transparent')); // 合計時間のセルの背景色
	dojo.byId('empWorkTotalTime').title = (diff ? teasp.message.getLabel('tf10008580') : ''); // 実労働時間と作業時間の合計を合わせてください
	if(!this.isReadOnly()){
		var okbtn = dojo.byId('empWorkOk');
		dojo.toggleClass(okbtn, 'std-button1', this.inputOk);
		dojo.toggleClass(okbtn, 'std-button1-disabled', !this.inputOk);
		if(this.inputOk){
			okbtn.title = teasp.message.getLabel('save_btn_title');
			dojo.byId('empWorkLockMsg').innerHTML = '';
		}else{
			okbtn.title = teasp.message.getLabel('tf10008580'); // 実労働時間と作業時間の合計を合わせてください
			dojo.byId('empWorkLockMsg').innerHTML = teasp.message.getLabel('tf10008580'); // 実労働時間と作業時間の合計を合わせてください
			dojo.style('empWorkLockMsg', 'color', 'red');
		}
	}
};

/**
 * シーケンス番号から工数実績データを返す
 *
 * @param {number} seq シーケンス番号
 * @return {Object} 工数実績オブジェクト
 */
teasp.dialog.WorkBalance.prototype.getJobWorkBySeq = function(seq){
	for(var i = 0 ; i < this.jobWorks.length ; i++){
		if(this.jobWorks[i].seq == seq){
			return this.jobWorks[i];
		}
	}
	return null;
};

/**
 * 行インデックスから工数実績データを返す
 *
 * @param {number} index 行インデックス
 * @return {Object} 工数実績オブジェクト
 */
teasp.dialog.WorkBalance.prototype.getJobWorkByIndex = function(index){
	for(var i = 0 ; i < this.jobWorks.length ; i++){
		if(this.jobWorks[i].index == index){
			return this.jobWorks[i];
		}
	}
	return null;
};

/**
 * 入力値をオブジェクトにセットする
 *
 */
teasp.dialog.WorkBalance.prototype.collectValue = function(){
	var sumVolume = this.getSumVolume();
	var sumTime   = this.getSumTime();
	var zanTime = (this.args.workRealTime - sumTime);
	var plst = [];
	var pmap = {};
	var percentAll = 0;
	var per100All  = 0;
	var jws = [];
	for(var i = 0 ; i < this.slider.length ; i++){
		var progress = (this.progressOn ? (dojo.byId('empWorkProgress' + i).value || null) : null);
		var taskNote = (this.taskNoteOn ? (dojo.byId('empWorkTaskNoteH' + i).value || null) : null);
		var jobWork = this.getJobWorkBySeq(dojo.byId('empWorkSeq' + i).value);
		var extraItem1Name = dojo.byId('empWorkExtName1' + i);
		var extraItem2Name = dojo.byId('empWorkExtName2' + i);
		var extraItem1 = dojo.byId('empWorkExtItem1' + i);
		var extraItem2 = dojo.byId('empWorkExtItem2' + i);
		if(extraItem1){
			jobWork.extraItem1Name = (extraItem1Name.value || null);
			jobWork.extraItem1     = (extraItem1.value     || null);
		}
		if(extraItem2){
			jobWork.extraItem2Name = (extraItem2Name.value || null);
			jobWork.extraItem2     = (extraItem2.value     || null);
		}
		if(this.isLockedRow(i, jobWork)){
			var t = this.getTime(i);
			var v = (t > 0 ? this.getVolume(i, sumTime) : 0);
			jobWork.index    = i;
			jobWork.volume   = v;
			jobWork.percent  = 0;         // 時間入力の場合、percent は 0 固定
			jobWork.per100   = 0;
			jobWork.perDisp  = false;
			jobWork.time     = t;
			jobWork.timeFix  = true;
			jobWork.progress = progress;
			jobWork.taskNote = taskNote;
		}else{
			var v = this.getVolume(i);
			if(sumTime > 0
			&& !v
			&& this.pouch.getLeftoverJobId() == jobWork.jobId
			&& this.pouch.getLeftoverJobId() != this.orgLeftoverJobId){
				v = 100;
			}
			var p = 0, pp = 0, m;
			var volFix = true;
			p  = (v ? Math.round(v * 1000 / sumVolume) : 0);
			pp = p ? Math.round(p / 10) : 0;
			m = this.getTime(i, p, zanTime);
			if(m < 0){
				m = 0;
			}
			jobWork.index    = i;
			jobWork.volume   = v;
			jobWork.percent  = p;
			jobWork.per100   = pp;
			jobWork.perDisp  = volFix;     // パーセント表示フラグ
			jobWork.time     = m;
			jobWork.timeFix  = false;
			jobWork.progress = progress;
			jobWork.taskNote = taskNote;
			if(p > 0){
				plst.push(i);
				pmap[i] = { percent: p, per100: pp };
				percentAll += p;
				per100All += pp;
			}
		}
		jws.push(jobWork);
	}
	if(plst.length > 1){
		var x = plst[plst.length - 1];
		var jobWork = jws[x];
		jobWork.percent -= (percentAll - 1000);
		jobWork.per100  = Math.round(jobWork.percent / 10);
		jobWork.time = this.getTime(x, jobWork.percent, (this.args.workRealTime - sumTime));
	}
	this.pouch.adjustJobWorkTimes(jws, this.args.workRealTime, true);
};

//検索窓で右クリック－ポップアップメニューから貼り付け、切り取りを選択した時の動作
teasp.dialog.WorkBalance.prototype.filterDelay = function(e){
	setTimeout(dojo.hitch(this, this.filterJob), 10);
};

// 検索窓の文字列で絞り込み
teasp.dialog.WorkBalance.prototype.filterJob = function(e){
	const jobNameInput = dojo.query('#jobWorks_jobName_head input');
	if(!jobNameInput || !jobNameInput.length){
		return;
	}
	const clearButton = dojo.query('#jobWorks_jobName_head div.clear')[0];		// 入力文字列をクリアするボタン
	const jobNameStr = jobNameInput[0].value;
	var convertedStr = this.convertStr(jobNameStr);
	const escape_pattern = /[.+?^=!:${}()|[\]\/%\\]/g;
	convertedStr = convertedStr.replace(escape_pattern,'\\$&');

	/**
	 * 正規表現文字列に変換
	 * @param {String} input 変換前文字列
	 * @return {String} 正規表現文字列
	 */
	const toRegex = function(input){
		var regex = input.split(' ')
			.filter(Boolean)	
			.map(function(str){
				return str.replace(/^\*+|\*+$/g, '');	// 先頭と末尾の*をtrimする
			})
			.map(function(str){
				return str.replace(/\*/g, '.*');	// ワイルドカードを正規表現の書き方にする 「*」→「.*」
			}).map(function(str){
				if(input.indexOf(' ') !== -1){		// スペースで区切られている場合はAND条件の正規表現にする 「ABC DEF」→「(?=.*ABC)(?=.*DEF).*」
					return '(?=.*' + str + ')';
				}
				return str;
			}).join('');

		if(input.indexOf(' ') !== -1){
			regex += '.*';	// スペースで区切られている場合は末尾に.*を追加 「ABC DEF」→「(?=.*ABC)(?=.*DEF).*」
		}

		return regex;
	}

	var regexStr = toRegex(convertedStr);
	dojo.style(clearButton, 'display', (convertedStr ? '' : 'none'));
	var found = 0;
	var cnt = 0;
	dojo.query('#empWorkTableBody tr').forEach(function(tr){
		dojo.query('div.name + input[type="hidden"]', tr).forEach(function(hid){
			cnt++;
			var name = hid.value;
			if(convertedStr && !name.match(regexStr)){
				dojo.style(tr, 'display', 'none');
			}else{
				dojo.style(tr, 'display', '');
				found++;
			}
		});
	});
	if(cnt > 0){
		this.displayNoMatch(found, jobNameStr);
	}
};

// 絞り込み窓の文字に一致するタスクがない時のメッセージ表示
teasp.dialog.WorkBalance.prototype.displayNoMatch = function(found, str){
	var tbody = dojo.byId('empWorkTableBody');
	var divs = dojo.query('div.no-match', tbody);
	var v = (found ? '' : teasp.message.getLabel('tf10008570', str)); // 「{0}」に一致するタスクはありません
	if(divs.length){
		if(!found){
			divs[0].innerHTML = v;
		}
		dojo.style(divs[0], 'display', (found ? 'none' : ''));
	}else if(!found){
		dojo.create('div', { innerHTML:v, className:'no-match' }, tbody);
	}
};

// 検索窓をクリア
teasp.dialog.WorkBalance.prototype.clearFilter = function(e){
	var inps = dojo.query('#jobWorks_jobName_head input');
	if(!inps || !inps.length){
		return;
	}
	inps[0].value = '';
	inps[0].focus();
	this.filterJob();
};

// 「ジョブ／作業分類」を 全角→半角 ＋ 小文字→大文字 変換
// （英数記号の全角半角、大小文字の区別をしないで検索できるように）
teasp.dialog.WorkBalance.prototype.convertStr = function(strVal){
	// 英数記号を半角変換（全角アスタリスクだけはワイルドカード扱いしたくないため半角にしない）
	var halfVal = strVal.replace(/(?![＊])[！-～]/g, // U+FF01～U+FF5E → U+0021～U+007E
		function( tmpStr ) {
			return String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0);
		}
	);
	// 文字コードシフトで対応できない文字の変換
	// （全角のダブルクォート、シングルクォート、バッククォート、円マーク、スペース、波ダッシュ）
	halfVal = halfVal.replace(/”/g, "\"") // U+201D → U+0022
	.replace(/’/g, "'")  // U+2019 → U+0027
	.replace(/‘/g, "`")  // U+2018 → U+0060
	.replace(/￥/g, "\\") // U+FFE5 → U+005C
	.replace(/¥/g,  "\\") // U+00A5 → U+005C
	.replace(/〜/g, "~")  // U+301C → U+007E
	.replace(/　/g, " ")  // U+3000 → U+0020
	.toUpperCase(); // 小文字→大文字へ変換
	var v = halfVal.replace(/^\s+|\s+$/g,""); // 前後の空白を除去
	return (v ? v : halfVal); // 空白のみの入力ならそのまま返す
};
