teasp.provide('teasp.dialog.InputTime');
/**
 * 出退勤時刻入力ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.InputTime = function(){
	this.widthHint = 310;
	this.heightHint = 380;
	this.id = 'dialogInputTime';
	this.title = teasp.message.getLabel('empTimeEdit_caption'); // 勤怠情報入力
	this.duration = 100;
	this.content = '<table class="pane_table tt_input_area" style="width:382px;"><tr><td style="padding-bottom:4px;"><table class="pane_table" style="width:100%;"><tr><td style="padding-left:4px;white-space:nowrap;width:130px;"><span id="dlgInpTimeDate"></span></td><td style="padding-left:4px;text-align:left;"><span id="dlgInpTimeEvent" style="word-break:break-all;"></span></td><td id="dlgInpTimeLog" style="width:90px;text-align:right;"><button class="std-button2" style="margin-left:auto;margin-right:0px;" ><div></div></button></td></tr></table></td></tr><tr><td style="text-align:center;" id="dlgInputTimeTabs"></td></tr><tr id="dlgInpTimeErrorRow"><td><span id="dlgInpTimeError" style="color:#FF0000;"></span></td></tr><tr id="dlgInpTimeCtrl1" class="ts-buttons-row"><td style="text-align:center;padding-top:10px;padding-bottom:4px;"><div style="position:relative;width:100%;"><div style="margin-left:auto;margin-right:auto;display:table;"><button class="std-button1" id="dlgInpTimeOk" ><div></div></button><button class="std-button2" id="dlgInpTimeCancel" ><div></div></button></div><button class="red-button1-s" id="dlgInpTimeReset" style="position:absolute;right:0px;top:0px;" ><div style="font-size:80%;"></div></button></div></td></tr><tr id="timeInputDayFixRow"><td style="text-align:center;padding:8px 2px 2px 2px;"><label id="timeInputDayFixLabel"><input type="checkbox" id="timeInputDayFix" /> <span id="spanTimeInputDayFix"></span></label></td></tr><tr id="dlgInpTimeCtrl2" class="ts-buttons-row"><td style="text-align:center;padding-top:10px;padding-bottom:4px;"><div><button class="std-button2" id="dlgInpTimeClose" ><div></div></button></div></td></tr></table>';
	this.okLink = {
		id       : 'dlgInpTimeOk',
		callback : this.ok
	};
	this.cancelLink = {
		id       : 'dlgInpTimeCancel',
		callback : this.hide
	};
	this.closeLink = {
		id       : 'dlgInpTimeClose',
		callback : this.hide
	};
	this.dayWrap = null;
	this.pattern = null;
	this.zenNum = ['１','２','３','４','５','６','７','８','９','１０'];
	this.outMax = 5;
	this.restMax = 10;
	this.dailyFixable = { flag: false };
	this.readOnly = false;
	this.eventHandles = {};
	this.IO_AREA = 1;
	this.REST_AREA = 2;
	this.OUT_AREA = 3;
};

teasp.dialog.InputTime.prototype = new teasp.dialog.Base();

teasp.dialog.InputTime.prototype.hide = function(){
	if(this.tc){
		this.tc.destroyRecursive(false);
	}
	for(var key in this.eventHandles){
		if(this.eventHandles.hasOwnProperty(key)){
			dojo.disconnect(this.eventHandles[key]);
			delete this.eventHandles[key];
		}
	}
	this.eventHandles = {};
    this.dialog.hide();
	this.free();
    this.dialog.destroy();
    teasp.manager.dialogRemove('InputTime');
};
/**
 *
 * @override
 */
teasp.dialog.InputTime.prototype.ready = function(){
	this.dayWrap = this.pouch.getEmpDay(this.args.date);
	this.pattern = this.dayWrap.getPattern();
	this.readOnly = (this.pouch.isUseReviseTimeApply() && typeof(this.dayWrap.getObj().startTime) != 'number' && typeof(this.dayWrap.getObj().endTime) != 'number');
//	this.nohack = this.pouch.isInputAccessControl(true);
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.InputTime.prototype.preStart = function(){
	teasp.message.setLabelEx('spanTimeInputDayFix', 'tk10004050');  // 日次確定する
	this.eventHandles['dialogEv1'] = dojo.connect(dojo.byId('dlgInpTimeReset'), 'onclick', this, this.reset);
	this.eventHandles['dialogEv2'] = dojo.connect(this.dialog, 'onCancel', this, this.hide);

	dojo.byId('dlgInpTimeOk'    ).firstChild.innerHTML = teasp.message.getLabel('save_btn_title');
	dojo.byId('dlgInpTimeCancel').firstChild.innerHTML = teasp.message.getLabel('cancel_btn_title');
	dojo.byId('dlgInpTimeReset' ).firstChild.innerHTML = teasp.message.getLabel('reset_btn_title');
	dojo.byId('dlgInpTimeClose' ).firstChild.innerHTML = teasp.message.getLabel('close_btn_title');

	if(this.pouch.isInputAccessControl(true)){
		dojo.query('#dlgInpTimeLog > button > div')[0].innerHTML = teasp.message.getLabel('ac00000300'); // ログ明細

		var tabDiv = dojo.create('div', { id:"dlgInputTimeDiv" }, dojo.byId('dlgInputTimeTabs'));
		this.tc = new dijit.layout.TabContainer({
			style: { height:"328px", width:"430px" }
		}, tabDiv);

		this.tc.addChild(new dijit.layout.ContentPane({
			id: 'dlgInputTimeContent0',
			title: teasp.message.getLabel('ac00000190'), // 勤怠
			content: '<table class="pane_table tt_input_table" style="width:400px;"><tbody id="timeInputArea"></tbody></table>',
			onShow: this.changedPane(0)
		}));

		this.tc.addChild(new dijit.layout.ContentPane({
			id: 'dlgInputTimeContent1',
			title: teasp.message.getLabel('ac00000200'), // 乖離理由
			content: '<div class="diverge-content"><table class="diverge-table1"><tr><td class="diverge-info"><div class="diverge-form"></div><table><tbody></tbody></table></td><td><div><select></select></div><div><textarea></textarea></div></td></tr></table><table class="diverge-table2"><tr><td class="diverge-info"><div class="diverge-form"></div><table><tbody></tbody></table></td><td><div><select></select></div><div><textarea></textarea></div></td></tr></table></div>',
			onShow: this.changedPane(1)
		}));
	}else{
		dojo.style('dlgInpTimeLog', 'display', 'none');
		if(teasp.isNarrow()){
			dojo.style(dojo.query('.tt_input_area', this.dialog.domNode)[0], 'width', '100%');
			dojo.create('tbody', {
				id: 'timeInputArea'
			}, dojo.create('table', {
				className: 'pane_table tt_input_table',
				style: 'width:100%;'
			}, dojo.byId('dlgInputTimeTabs')));
		}else{
			dojo.style(dojo.query('.tt_input_area', this.dialog.domNode)[0], 'width', '322px');
			dojo.create('tbody', {
				id: 'timeInputArea'
			}, dojo.create('table', {
				className: 'pane_table tt_input_table',
				style: 'width:320px;'
			}, dojo.byId('dlgInputTimeTabs')));
		}
	}
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.InputTime.prototype.preShow = function(){
	this.showError(null);

	this.dailyFixable = this.dayWrap.canSelectDailyEx(1);

	dojo.byId('dlgInpTimeDate' ).innerHTML = teasp.util.date.formatDate(this.args.date, 'JP1');
	dojo.byId('dlgInpTimeEvent').innerHTML = this.dayWrap.getCalendarEvent();

	dojo.style('dlgInpTimeCtrl1', 'display', this.isReadOnly() ? 'none' : '');
	dojo.style('dlgInpTimeCtrl2', 'display', this.isReadOnly() ? '' : 'none');

	teasp.util.time.setTimeFormat(this.pouch.getTimeFormObj());

	var aways = [];
	var rests = [];
	var timeTable = dojo.clone(this.dayWrap.getTimeTable());
	for(var i = timeTable.length - 1 ; i >= 0 ; i--){
		if(timeTable[i].type == teasp.constant.REST_PAY
		|| timeTable[i].type == teasp.constant.REST_UNPAY){
			timeTable.splice(i, 1);
		}
	}
	if(this.dayWrap.isInputTime() || timeTable.length > 0){
		for(var i = 0 ; i < timeTable.length ; i++){
			var tt = timeTable[i];
			if(tt.type == teasp.constant.AWAY){
				aways.push(tt);
			}else if(tt.type == teasp.constant.REST_FIX || tt.type == teasp.constant.REST_FREE){
				rests.push(tt);
			}
		}
	}else{
		if(this.pattern){
			for(i = 0 ; i < this.pattern.restTimes.length ; i++){
				var tt = this.pattern.restTimes[i];
				rests.push(tt);
			}
		}
	}
	rests = rests.sort(function(a, b){
		var na = (typeof(a.from) == 'number' ? a.from : a.to);
		var nb = (typeof(b.from) == 'number' ? b.from : b.to);
		return na - nb;
	});
	aways = aways.sort(function(a, b){
		var na = (typeof(a.from) == 'number' ? a.from : a.to);
		var nb = (typeof(b.from) == 'number' ? b.from : b.to);
		return na - nb;
	});

	this.createInputArea(rests.length, aways.length);

	dojo.byId('startTime').value     = this.dayWrap.getStartTime(false, null, teasp.constant.C_REAL);
	dojo.byId('endTime'  ).value     = this.dayWrap.getEndTime(false, null, teasp.constant.C_REAL);
	if(this.isNoEntry(true)){
		dojo.style('dlgInpTimeReset', 'display', 'none');
	}else{
		dojo.style('dlgInpTimeReset', 'display', '');
	}
	if(!this.tc){
		dojo.byId('pushStartTime').innerHTML = this.dayWrap.getStartTimeEmboss();
		dojo.byId('pushEndTime'  ).innerHTML = this.dayWrap.getEndTimeEmboss();
	}
	for(var i = 0 ; i < rests.length ; i++){
		dojo.byId('startRest' + (i + 1)).value = this.pouch.getDisplayTime(rests[i].from);
		dojo.byId('endRest'   + (i + 1)).value = this.pouch.getDisplayTime(rests[i].to  );
	}
	for(i = 0 ; i < aways.length ; i++){
		dojo.byId('startOut' + (i + 1)).value = this.pouch.getDisplayTime(aways[i].from);
		dojo.byId('endOut'   + (i + 1)).value = this.pouch.getDisplayTime(aways[i].to  );
	}

	if(this.pouch.isUseDailyApply() && !this.isReadOnly()){
		dojo.style('timeInputDayFixRow', 'display', '');
		const b = (this.dailyFixable.flag && this.dayWrap.isInputable(true) && this.isWorkLocationOk());
		if(!b){
			dojo.byId('timeInputDayFix').checked = false;
		}
		dojo.byId('timeInputDayFix').disabled = !b;
		dojo.style('timeInputDayFixLabel', 'color', (b ? '#222222' : '#CCCCCC'));
	}else{
		dojo.style('timeInputDayFixRow', 'display', 'none');
	}
	this.changedTime();

	this.orgHolidayTime = this.dayWrap.getTimeHolidayTime(this.dayWrap.isInputTime() || timeTable.length > 0 ? timeTable : this.pattern.restTimes);

	// 乖離理由タブ
	var area = dojo.byId(this.dialog.id);
	if(this.tc){
		// ログ明細ボタン
		this.eventHandles['diverge0'] = dojo.connect(dojo.query('#dlgInpTimeLog > button')[0], 'onclick', this, this.openAccessLog);

	    var dlst = this.pouch.getDivergenceReasonList();
		var vrea = (dlst.length > 0 && !this.isReadOnly());

		// 上段
		dojo.query('.diverge-table1 .diverge-form', area)[0].innerHTML = teasp.message.getLabel('ac00000210'); // 入館乖離理由
		var select1 = dojo.query('.diverge-table1 select', area)[0];
		dojo.empty(select1);
		if(vrea){
			dojo.create('option', { innerHTML: '', value: '' }, select1);
			dojo.forEach(dlst, function(v){
				dojo.create('option', { innerHTML: v, value: v }, select1);
			});
			this.eventHandles['diverge1'] = dojo.connect(select1, 'onchange', this, this.changedReason(1));
		}
		dojo.style(select1, 'display', (vrea ? '' : 'none'));
		dojo.query('.diverge-table1 textarea', area)[0].readOnly = (this.isReadOnly() ? 'readOnly' : '');
		dojo.toggleClass(dojo.query('.diverge-table1 textarea', area)[0], 'inputro', this.isReadOnly());
		dojo.query('.diverge-table1 textarea', area)[0].maxLength = teasp.constant.DIVERGE_REASON_MAX;
		dojo.query('.diverge-table1 textarea', area)[0].value = this.dayWrap.getEnterDivergenceReason(); // 入館乖離理由

		// 下段
		dojo.query('.diverge-table2 .diverge-form', area)[0].innerHTML = teasp.message.getLabel('ac00000220'); // 退館乖離理由
		var select2 = dojo.query('.diverge-table2 select', area)[0];
		dojo.empty(select2);
		if(vrea){
			dojo.create('option', { innerHTML: '', value: '' }, select2);
			dojo.forEach(dlst, function(v){
				dojo.create('option', { innerHTML: v, value: v }, select2);
			});
			this.eventHandles['diverge2'] = dojo.connect(select2, 'onchange', this, this.changedReason(2));
		}
		dojo.style(select2, 'display', (vrea ? '' : 'none'));
		dojo.query('.diverge-table2 textarea', area)[0].readOnly = (this.isReadOnly() ? 'readOnly' : '');
		dojo.toggleClass(dojo.query('.diverge-table2 textarea', area)[0], 'inputro', this.isReadOnly());
		dojo.query('.diverge-table2 textarea', area)[0].maxLength = teasp.constant.DIVERGE_REASON_MAX;
		dojo.query('.diverge-table2 textarea', area)[0].value = this.dayWrap.getExitDivergenceReason();  // 退館乖離理由

		this.setDivergenceInfo();
		this.setDivergeLeftSide(area); // 乖離理由タブ側の出退社時刻、入退館時刻、乖離判定表示

		this.tc.selectChild(this.tc.getChildren()[0]);
	}

	return true;
};

//「勤怠タブ」の出社時刻と退社時刻の右側に入館・退館と乖離表示
teasp.dialog.InputTime.prototype.setDivergenceInfo = function(flag){
	var nt = this.dayWrap.getEnterTime();
	if(nt){
		dojo.byId('pushStartTime').innerHTML = '&nbsp;'
		+ teasp.message.getLabel('ac00000450', nt)  // 入館 {0}
		+ '&nbsp;&nbsp;&nbsp;'
		+ this.dayWrap.getEnterDivergence(flag) ; // 乖離判定表示
	}
	var xt = this.dayWrap.getExitTime();
	if(xt){
		dojo.byId('pushEndTime'  ).innerHTML = '&nbsp;'
		+ teasp.message.getLabel('ac00000460', xt) // 退館 {0}
		+ '&nbsp;&nbsp;&nbsp;'
		+ this.dayWrap.getExitDivergence(flag);   // 乖離判定表示
	}
};

/**
 * 乖離理由タブ側の出退社時刻、入退館時刻、乖離判定表示
 *
 * @param {Object} area
 * @param {boolean=} flag =trueなら出退社時刻と乖離判定をクリア
 */
teasp.dialog.InputTime.prototype.setDivergeLeftSide = function(area, flag){
	var tbody, tr;
	// 上段
	tbody = dojo.query('.diverge-table1 td.diverge-info tbody', area)[0];
	dojo.empty(tbody);
	tr = dojo.create('tr', null, tbody);
	dojo.create('td', { innerHTML: teasp.message.getLabel('startTime_head') }, tr); // 出社
	dojo.create('td', { innerHTML: (flag ? '' : this.dayWrap.getStartTime(false, null, teasp.constant.C_REAL)) }, tr); // 出社時刻
	tr = dojo.create('tr', null, tbody);
	dojo.create('td', { innerHTML: teasp.message.getLabel('ac00000250') }, tr); // 入館
	dojo.create('td', { innerHTML: this.dayWrap.getEnterTime()          }, tr); // 入館時刻
	tr = dojo.create('tr', null, tbody);
	dojo.create('td', { innerHTML: this.dayWrap.getEnterDivergence(flag), colSpan: 2 }, tr); // 乖離判定表示

	// 下段
	tbody = dojo.query('.diverge-table2 td.diverge-info tbody', area)[0];
	dojo.empty(tbody);
	tr = dojo.create('tr', null, tbody);
	dojo.create('td', { innerHTML: teasp.message.getLabel('endTime_head') }, tr); // 退社
	dojo.create('td', { innerHTML: (flag ? '' : this.dayWrap.getEndTime(false, null, teasp.constant.C_REAL)) }, tr); // 退社時刻
	tr = dojo.create('tr', null, tbody);
	dojo.create('td', { innerHTML: teasp.message.getLabel('ac00000260') }, tr); // 退館
	dojo.create('td', { innerHTML: this.dayWrap.getExitTime()           }, tr); // 退館時刻
	tr = dojo.create('tr', null, tbody);
	dojo.create('td', { innerHTML: this.dayWrap.getExitDivergence(flag), colSpan: 2 }, tr); // 乖離判定表示
};

/**
 * @override
 */
teasp.dialog.InputTime.prototype.postShow = function(){
	if(this.tc){
		this.tc.startup();
	}
	setTimeout(function(){
		var n = dojo.byId('startTime');
		n.focus();
		n.select();
	}, 100);
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.InputTime.prototype.ok = function(){
	var resp;
	var inpTime = this.checkInput();
	var confirmMsg1 = null;
	var confirmMsg2 = null;
	var confirmMsg3 = null;
	var alertMsg1 = null;
	if(inpTime){
		var st = teasp.util.time.clock2minutes(dojo.byId('startTime').value);
		var et = teasp.util.time.clock2minutes(dojo.byId('endTime').value);

		if(st === undefined && et === undefined){
			this.showError(teasp.message.getLabel('tm10002010')); // 出社・退社時刻どちらかを入力してください
			return;
		}
		if(st !== undefined && et !== undefined && st >= et){
			this.showError(teasp.message.getLabel('tm10002020')); // 出社・退社時刻が正しくありません
			return;
		}
		if(st != undefined && st >= 1440){
			this.showError(teasp.message.getLabel('tm10002030')); // 出社時刻に 24:00 以降の時刻を入力できません
			return;
		}
		if(et != undefined && et > 2880){
			this.showError(teasp.message.getLabel('tm10002040')); // 退社時刻に 48:00 以降の時刻を入力できません
			return;
		}
		if(st != undefined && et != undefined && (et - st) > this.pouch.getLimitedTimeDistance()){
			var m = Math.floor(this.pouch.getLimitedTimeDistance() * 100 / 60) / 100;
			this.showError(teasp.message.getLabel('tm10002050', m)); // 出社－退社時刻の差が24時間を超えるような時刻を入力できません
			return;
		}
		if(this.pouch.isPastTimeOnly()){
			var now = teasp.util.date.getToday().getTime();
			var inputLimit = this.dayWrap.getInputLimit();
			if(st != undefined && (inputLimit && !(inputLimit.directFlag & 1))){
				var stdt = teasp.util.date.parseDate(this.args.date + ' ' + teasp.util.time.timeValue(st) + ':00');
				if(now < stdt.getTime()){
					this.showError(teasp.message.getLabel('tm10002140')); // 未来の時刻は入力できません
					return;
				}
			}
			if(et != undefined && (inputLimit && !(inputLimit.directFlag & 2))){
				var etdt = teasp.util.date.parseDate(this.args.date + ' ' + teasp.util.time.timeValue(et) + ':00');
				if(now < etdt.getTime()){
					this.showError(teasp.message.getLabel('tm10002140')); // 未来の時刻は入力できません
					return;
				}
			}
		}
		if(this.pouch.isProhibitInputTimeUntilApproved()){  // 承認されるまで時間入力を禁止
			var aex = this.dayWrap.isInputableEx();
			if(!aex.inputable){
				this.showError(teasp.message.getLabel('tk10001152', aex.applyName)); // {0} が未承認のため入力できません
				return;
			}
		}
		var pd = this.pouch.getEmpDay(teasp.util.date.addDays(this.args.date, -1));
		var nd = this.pouch.getEmpDay(teasp.util.date.addDays(this.args.date, 1));
		if(pd && typeof(pd.getObj().endTime) == 'number' && pd.getObj().endTime > 1440){
			var pe = pd.getObj().endTime - 1440;
			if(st != undefined && st < pe){
				this.showError(teasp.message.getLabel('tm10002060')); // 勤務時間が前日の勤務時間と重なっています
				return;
			}
		}
		if(this.pouch.isProhibitAcrossNextDayOfHolidayWork() // 休日出勤時には24:00を超えた勤務を許さない
		&& this.dayWrap.isHoliday()
		&& this.dayWrap.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)
		&& et != undefined
		&& et > 1440
		){
			this.showError(teasp.message.getLabel('tf10008430')); // 休日出勤時には24:00以降の退社時刻を入力できません。
			return;
		}
		if(this.pouch.isLeavingAcrossNextDay() // 24:00を超えた退社時間の入力
		&& nd
		&& (this.dayWrap.getDayType() == 3 ? 1 : this.dayWrap.getDayType()) != (nd.getDayType() == 3 ? 1 : nd.getDayType())
		&& et != undefined
		&& et > 1440){
			this.showError(teasp.message.getLabel('tk10001153',
				teasp.constant.getDayTypeWord(this.dayWrap.getDayType()),
				teasp.constant.getDayTypeWord(nd.getDayType())
			)); // 日付をまたぎ{0}から{1}となるため、24:00以降の勤務入力はできません
			return;
		}
		if(nd && et != undefined && et > 1440){
			if(typeof(nd.getObj().startTime) == 'number'){
				var ce = et - 1440;
				if(ce > nd.getObj().startTime){
					this.showError(teasp.message.getLabel('tm10002070')); // 勤務時間が翌日の勤務時間と重なっています
					return;
				}
			}
			// 翌日に休暇の延長勤務禁止＝オンの休暇申請があれば、退社時刻が24時超は不可
			var h = nd.getProhibitOverNightWorkHoliday();
			if(h){
				this.showError(teasp.message.getLabel('tf10008360', h.name)); // {0}の前日は24:00を超える勤務はできません。
				return;
			}
		}
		var rests = this.getRests(true);
		var inprng = this.dayWrap.getInputTimeRange(rests);
		var adjust = 0;
		if(st != undefined && st < inprng.from){
			adjust = (et != undefined && et <= inprng.from) ? -1 : 1;
		}
		if(et != undefined && et > inprng.to){
			adjust = (st != undefined && st >= inprng.to) ? -1 : 2;
		}
		if(this.dayWrap.isCheckTimeOnHalfHoliday()){ // 出退社時刻と半休適用時間のチェック＝する
			if(adjust < 0){ // 調整不可
				this.showError(teasp.message.getLabel('tm10002080')); // 出社・退社時刻が休暇の時間帯と重なっています
				return;
			}else if(adjust){
				confirmMsg1 = teasp.message.getLabel('tm10002090', // {0}が休暇の時間帯と重なっているため調整した時刻を入力します。\nよろしければＯＫをクリックしてください
					(adjust == 1 ? teasp.message.getLabel('startTime_label') : teasp.message.getLabel('endTime_label'))); // 出社時刻 or 退社時刻
				if(adjust == 1){
					st = inprng.from;
				}else{
					et = inprng.to;
				}
			}
		}

		var aways = this.getAways();
		var fixRests  = this.getFixRests();
		var keepExterior = this.pouch.isKeepExteriorTime();
		resp = checkTimes(rests, aways, fixRests, st, et, keepExterior);
		if(resp.message){
			this.showError(resp.message);
			return;
		}
		var newHolidayTime = this.dayWrap.getTimeHolidayTime(resp.timeTable);
		if(this.orgHolidayTime != newHolidayTime){
			this.showError(teasp.message.getLabel('tk10005110')); // 時間単位休の時間が申請時点と異なるため変更できません。
			return;
		}

		this.showError(null);
		if(!keepExterior && resp.over){
			confirmMsg2 = teasp.message.getLabel('tm10002100'); // 勤務時間外の所定外休憩時間、公用外出時間は削除します。よろしいですか？
		}

		if(this.pouch.isValidRestTimeCheck()
		|| (dojo.byId('timeInputDayFix').checked
		&& (this.pouch.isOverTimeRequireTime()
		 || this.pouch.isEarlyWorkRequireTime()
		 || this.pouch.isRequiredLateStartApply()
		 || this.pouch.isRequiredEarlyEndApply()
		))){
			// 実労働時間と休憩時間を得る
			var o = teasp.logic.EmpTime.getWorkAndRestTime(this.pouch.getObj(), this.dayWrap.getKey(), st, et, resp.rests);
			if(this.pouch.isValidRestTimeCheck() && o.workTime > 0){
				// 法定休憩時間のチェック
				var rcs = this.pouch.getRestTimeCheck();
				var lack = 0;
				if(rcs && is_array(rcs)){
					for(var i = 0 ; i < rcs.length ; i++){
						var rc = rcs[i];
						if(rc.check && o.workTime > rc.workTime && o.restTime < rc.restTime){
							lack = (rc.push ? 2 : 1);
							break;
						}
					}
				}
				if(lack){
					if(lack == 2){
						alertMsg1 = teasp.message.getLabel('tm10002121'); // 労働時間に対して休憩が不足しているため休憩が自動挿入されます。
					}else{
						confirmMsg3 = teasp.message.getLabel('tm10002120'); // ！ 警告 ！\n労働時間に対して休憩が不足しています。\nOKでこのまま登録、キャンセルで入力画面に戻ります。
					}
				}
			}
			if(dojo.byId('timeInputDayFix').checked){
				var errs = [];
				if(o.missingOverTimeApply){
					errs.push(teasp.message.getLabel('tf10008740', teasp.message.getLabel('tm10001293'))); // 残業申請してください
				}
				if(o.missingEarlyWorkApply){
					errs.push(teasp.message.getLabel('tf10008740', teasp.message.getLabel('tm10001294'))); // 早朝勤務申請してください
				}
				if(o.missingOverTimeApplyExist || o.missingEarlyWorkApplyExist){
					errs.push(teasp.message.getLabel('tf10008760')); // （申請なしで勤務した時間がないようにしてください）
				}
				if(o.missingLateStartApply){
					errs.push(teasp.message.getLabel('tf10008740', teasp.message.getLabel('applyLateStart_label'))); // 遅刻申請してください
				}
				if(o.missingEarlyEndApply){
					errs.push(teasp.message.getLabel('tf10008740', teasp.message.getLabel('applyEarlyEnd_label'))); // 早退申請してください
				}
				if(errs.length){
					errs.unshift(teasp.message.getLabel('tf10008750')); // 日次確定できません
					teasp.tsAlert(errs.join('\n'), this);
					return;
				}
			}
		}
		resp.inpTime = true;
	}else{
		resp = {
			inpTime: false,
			timeTable: []
		};
	}
	if(dojo.byId('timeInputDayFix').checked){
		var o = this.dayWrap.canSelectDailyEx(3, resp, {
			enterDivergenceReason : this.getEnterDivergenceReason(),
			exitDivergenceReason  : this.getExitDivergenceReason()
		});
		if(!o.flag){
			this.showError(o.reason, true);
			return;
		}
	}
	// 出社・退社時間を含む休憩は入力できないようにする＝オン
	if(this.pouch.isProhibitBorderRestTime()
	&& teasp.logic.EmpTime.checkBorderRestTime(resp.startTime, resp.endTime, resp.timeTable)){
		this.showError(teasp.message.getLabel('tf10008400')); // 休憩時間が出社時刻または退社時刻と重ならないようにしてください。
		return;
	}

	this.showError(null);

	var innerOkLast = dojo.hitch(this, function(){
		if(confirmMsg3){
			// ！ 警告 ！\n労働時間に対して休憩が不足しています。\nOKでこのまま登録、キャンセルで入力画面に戻ります。
			teasp.tsConfirmA(confirmMsg3, this, function(){
				this.save(resp);
			});
		}else if(alertMsg1){
			// 労働時間に対して休憩が不足しているため休憩が自動挿入されます。
			teasp.tsAlert(alertMsg1, this, function(){
				this.save(resp);
			});
		}else{
			this.save(resp);
		}
	});
	var innerOk = dojo.hitch(this, function(){
		if(confirmMsg2){
			 // 勤務時間外の所定外休憩時間、公用外出時間は削除します。よろしいですか？
			teasp.tsConfirmA(confirmMsg2, this, function(){
				innerOkLast();
			});
		}else{
			innerOkLast();
		}
	});
	if(confirmMsg1){
		// {0}が休暇の時間帯と重なっているため調整した時刻を入力します。\nよろしければＯＫをクリックしてください
		teasp.tsConfirmA(confirmMsg1, this, function(){
			if(typeof(resp.startTime) == 'number'){
				dojo.byId('startTime').value = teasp.util.time.timeValue(resp.startTime);
			}
			if(typeof(resp.endTime) == 'number'){
				dojo.byId('endTime').value = teasp.util.time.timeValue(resp.endTime);
			}
			innerOk();
		});
	}else{
		innerOk();
	}
};

teasp.dialog.InputTime.prototype.save = function(resp){
	var tt1 = {
		from : (typeof(resp.startTime) == 'number' ? resp.startTime : null),
		to   : (typeof(resp.endTime)   == 'number' ? resp.endTime   : null),
		type : 1
	};
	var req = {
		empId            : this.pouch.getEmpId(),
		month            : this.pouch.getYearMonth(),
		startDate        : this.pouch.getStartDate(),
		lastModifiedDate : this.pouch.getLastModifiedDate(),
		mode             : this.pouch.getMode(),
		date             : this.args.date,
		dayFix           : (this.pouch.isUseDailyApply() && tt1.from !== null && tt1.to !== null && dojo.byId('timeInputDayFix').checked),
		client           : this.args.client,
		timeTable        : [ tt1 ].concat(resp.timeTable),
		refreshWork      : this.pouch.isInputWorkingTimeOnWorkTImeView(),
		useInputAccessControl : this.pouch.isInputAccessControl(),
		enterDivergenceReason : this.getEnterDivergenceReason(),
		exitDivergenceReason  : this.getExitDivergenceReason()
	};
	if(this.pouch.isUseWorkLocation()){ // 勤務場所
		req.workLocationId = this.getSelectedWorkLocationId();
	}

	var f = this.execInputTimeTable(req);
	if(resp.inpTime || !this.dayWrap.isInputTime()){
		f(false);
	}else{
		var o = null;
		if(this.pouch.isExistWorksByDate(req.date)){ // 指定日に工数実績が入力済み
			o = { clear: { checked:true, title: teasp.message.getLabel('tk10001166') } };
		}
		teasp.manager.dialogOpen(
			'MessageBox',
			{
				title   : teasp.message.getLabel('tk10001164'),
				message : teasp.message.getLabel('tk10001165', teasp.util.date.formatDate(req.date, 'M/d')),
				check   : o
			},
			this.pouch,
			this,
			function(obj){
				f(obj.clear ? obj.clear.checked : false);
			}
		);
	}
};

teasp.dialog.InputTime.prototype.execInputTimeTable = function(_req){
	var req = _req;
	var that = this;
	return function(flag){
		var t1 = teasp.timestamp('inputTime start');
		req.clearWork = flag;
		teasp.manager.request(
			'inputTimeTable',
			req,
			that.pouch,
			{ hideBusy : false },
			that,
			function(){
				if(this.tc){
					this.dayWrap = this.pouch.getEmpDay(this.args.date);
					var dj = this.dayWrap.getDivergenceJudge();
					if(dj.type > 0 && !dj.reason){ // 乖離あり（理由なし）
						this.onfinishfunc();
						 // 出退社時刻、入退館時刻、乖離判定を再表示
						this.setDivergenceInfo();
						this.setDivergeLeftSide(dojo.byId(this.dialog.id));
						this.showError(teasp.message.getLabel('ac00000430')); // ログとの乖離があります。乖離理由を入力してください。
						// 乖離理由タブ＆乖離ありの方のテキストエリアにフォーカスをセット
						this.tc.selectChild(this.tc.getChildren()[1]);
						this.focusReasonTextArea(dj.dIn.type > 0 ? 1 : 2);
						return;
					}
				}
				this.onfinishfunc();
				var t2 = new Date();
				teasp.timestamp('inputTime end - ' + (t2.getTime() - t1.getTime()));
				this.close();
			},
			function(event){
				this.showError(teasp.message.getErrorMessage(event));
			}
		);
	};
};

/**
 * 入力エリア作成
 * @param {number} _restCnt 休憩の数
 * @param {number} _awayCnt 公用外出の数
 * @param {boolean=} clearWorkLocation true:勤務場所を空にする
 */
teasp.dialog.InputTime.prototype.createInputArea = function(_restCnt, _awayCnt, clearWorkLocation){
	var awayCnt = (_awayCnt < 2 ? 2 : _awayCnt);
	var restCnt = (_restCnt < 2 ? 2 : _restCnt);

	var tbody = dojo.byId('timeInputArea');
	dojo.empty(tbody);

	var directFlag = this.dayWrap.getInputLimit().flag;

	var row = dojo.create('tr', null, tbody);
	dojo.create('td', { className: 'edge_gray_tl' }, row);
	dojo.create('td', { colSpan: '5' }, row);
	dojo.create('td', { className: 'edge_gray_tr' }, row);

	row = dojo.create('tr', { style: { height:"5px" } }, tbody);
	dojo.create('td', { colSpan: '7' }, row);

	// 出社時刻
	row = dojo.create('tr', null, tbody);
	dojo.create('td', null, row);
	var cell = dojo.create('td', { style: 'width:124px;vertical-align:middle;' }, row);
	dojo.create('div', { className: 'tt_col start-end', innerHTML: teasp.message.getLabel('startTime_head') }, cell); // 出社
	cell = dojo.create('td', { style: 'width:49px;' }, row);
//	cell.style.paddingLeft = '2px';
	var inp = dojo.create('input', { type: 'text', className: 'inputime roundBegin', id: 'startTime' }, cell);
	if(this.isReadOnly(this.IO_AREA) || this.isNoEntry() || (directFlag & 1)){
		inp.readOnly = 'readOnly';
		dojo.toggleClass(inp, 'inputro', true);
	}else{
		this.eventHandles['startTimeb'] = dojo.connect(inp, 'blur'      , this, function(e){ teasp.util.time.onblurTime(e);     this.changedTime(); });
		this.eventHandles['startTimek'] = dojo.connect(inp, 'onkeypress', this, function(e){ teasp.util.time.onkeypressTime(e); if(e.keyCode === 13){ this.changedTime(); } });
	}
	cell = dojo.create('td', { id: 'pushStartTime', colSpan: '4', style:'padding-left:8px;font-size:0.8em;color:#3333CC;white-space:nowrap;' }, row);

	row = dojo.create('tr', null, tbody);
	dojo.create('td', null, row);
	dojo.create('td', { colSpan: '5', className: 'gyokan_dash' }, row);
	dojo.create('td', null, row);

	// 退社時刻
	row = dojo.create('tr', null, tbody);
	dojo.create('td', null, row);
	cell = dojo.create('td', { style: 'width:124px;vertical-align:middle;' }, row);
	dojo.create('div', { className: 'tt_col start-end', innerHTML: teasp.message.getLabel('endTime_head') }, cell); // 退社
	cell = dojo.create('td', { style: 'width:49px;' }, row);
//	cell.style.paddingLeft = '2px';
	inp = dojo.create('input', { type: 'text', className: 'inputime roundEnd', id: 'endTime' }, cell);
	if(this.isReadOnly(this.IO_AREA) || this.isNoEntry() || (directFlag & 2)){
		inp.readOnly = 'readOnly';
		dojo.toggleClass(inp, 'inputro', true);
	}else{
		this.eventHandles['endTimeb'] = dojo.connect(inp, 'blur'      , this, function(e){ teasp.util.time.onblurTime(e);     this.changedTime(); });
		this.eventHandles['endTimek'] = dojo.connect(inp, 'onkeypress', this, function(e){ teasp.util.time.onkeypressTime(e); if(e.keyCode === 13){ this.changedTime(); } });
	}
	cell = dojo.create('td', { id: 'pushEndTime', colSpan: '4', style:'padding-left:8px;font-size:0.8em;color:#3333CC;white-space:nowrap;' }, row);

	// 休憩時間
	row = dojo.create('tr', null, tbody);
	dojo.create('td', null, row);
	dojo.create('td', { colSpan: '5', className: 'gyokan_dash' }, row);
	dojo.create('td', null, row);

	for(var i = 0 ; i < restCnt ; i++){
		this.createRestRow(tbody, i, -1, (i === 0), (restCnt * 2 - 1));
	}
	dojo.query('.tt_rest_plus').forEach(function(elem){
		elem.firstChild.disabled = (restCnt >= this.restMax);
		elem.firstChild.className = ((restCnt >= this.restMax || this.isReadOnly(this.REST_AREA) || this.isNoEntry()) ? 'pb_btn_plusL_dis' : 'pb_btn_plusL');
	}, this);
	row = dojo.create('tr', { className: 'tt_rest_end' }, tbody);

	// 公用外出時間
	if(!this.pouch.isHideAwayTimeInputField() || _awayCnt > 0){
		dojo.create('td', null, row);
		dojo.create('td', { colSpan: '5', className: 'gyokan_dash' }, row);
		dojo.create('td', null, row);
	
		for(i = 0 ; i < awayCnt ; i++){
			this.createOutRow(tbody, i, -1, (i === 0), (awayCnt * 2 - 1));
		}
		dojo.query('.tt_out_plus').forEach(function(elem){
			elem.firstChild.disabled = (awayCnt >= this.outMax);
			elem.firstChild.className = ((awayCnt >= this.outMax || this.isReadOnly(this.OUT_AREA)) ? 'pb_btn_plusL_dis' : 'pb_btn_plusL');
		}, this);
		row = dojo.create('tr', { className: 'tt_out_end' }, tbody);
	}

	if(this.pouch.isUseWorkLocation()){ // 勤務場所
		dojo.create('td', null, row);
		dojo.create('td', { colSpan: '5', className: 'gyokan_dash' }, row);
		dojo.create('td', null, row);
		this.createWorkLocationRow(tbody, clearWorkLocation);
		row = dojo.create('tr', { className: 'tt_workLocation_end' }, tbody);
	}

	dojo.create('td', null, row);
	dojo.create('td', { colSpan: '5', className: 'tt_gyokan' }, row);
	dojo.create('td', null, row);

	row = dojo.create('tr', null, tbody);
	dojo.create('td', { className: 'edge_gray_bl' }, row);
	dojo.create('td', { colSpan: '5' }, row);
	dojo.create('td', { className: 'edge_gray_br' }, row);
};

teasp.dialog.InputTime.prototype.changedTime = function(){
	if(this.pouch.isUseDailyApply() && this.dayWrap.isInputable(true)){
		const f = (dojo.byId('startTime').value == '' || dojo.byId('endTime').value == '' || this.dailyFixable.pending || !this.isWorkLocationOk());
		dojo.style('timeInputDayFixLabel', 'color', (f ? '#CCCCCC' : '#222222'));
		if(f){
			dojo.byId('timeInputDayFix').checked = false;
		}else if(this.pouch.isCheckDefaultDailyFix()){
			dojo.byId('timeInputDayFix').checked = (f ? false : true);
		}
		dojo.byId('timeInputDayFix').disabled = f;
	}
};

/**
 * 公用外出時刻入力エリア作成
 */
teasp.dialog.InputTime.prototype.insertOutArea = function(){
	var row = null, cnt = 0;

	dojo.query('.tt_outdoor').forEach(function(elem){ cnt++; });
	dojo.query('.tt_out_end').forEach(function(elem){ row = elem; });

	this.createOutRow(row.parentNode, cnt, row.rowIndex);

	dojo.query('.tt_out_plus').forEach(function(elem){
		var n = parseInt(elem.rowSpan, 10);
		elem.rowSpan = '' + (n + 2);
		elem.firstChild.disabled = (cnt >= (this.outMax - 1));
		elem.firstChild.className = ((cnt >= (this.outMax - 1) || this.isReadOnly(this.OUT_AREA)) ? 'pb_btn_plusL_dis' : 'pb_btn_plusL');
	}, this);
};

/**
 * 休憩時刻入力エリア作成
 */
teasp.dialog.InputTime.prototype.insertRestArea = function(){
	var row = null, cnt = 0;

	dojo.query('.tt_rest').forEach(function(elem){ cnt++; });
	dojo.query('.tt_rest_end').forEach(function(elem){ row = elem; });

	this.createRestRow(row.parentNode, cnt, row.rowIndex);

	dojo.query('.tt_rest_plus').forEach(function(elem){
		var n = parseInt(elem.rowSpan, 10);
		elem.rowSpan = '' + (n + 2);
		elem.firstChild.disabled = (cnt >= (this.restMax - 1));
		elem.firstChild.className = ((cnt >= (this.restMax - 1) || this.isReadOnly(this.REST_AREA) || this.isNoEntry()) ? 'pb_btn_plusL_dis' : 'pb_btn_plusL');
	}, this);
};

/**
 * 公用外出時刻入力行作成
 *
 * @param {Object} tbody テーブルボディ
 * @param {number} index
 * @param {number} rowIndex
 * @param {boolean=} flag
 * @param {number=} rowCnt
 */
teasp.dialog.InputTime.prototype.createOutRow = function(tbody, index, rowIndex, flag, rowCnt){
	var x = rowIndex;

	if(!flag){
		var row = (x < 0 ? dojo.create('tr', null, tbody) : dojo.create('tr', null, tbody.rows[x], 'before'));
		dojo.create('td', null, row);
		dojo.create('td', { colSpan: '4', className: 'tt_gyokan' }, row);
		dojo.create('td', null, row);
		if(x >= 0){
			x++;
		}
	}
	var row = (x < 0 ? dojo.create('tr', null, tbody) : dojo.create('tr', null, tbody.rows[x], 'before'));
	dojo.create('td', null, row);
	var cell = dojo.create('td', null, row);
	cell.style.verticalAlign = 'middle';
	dojo.create('div', { className: 'tt_col tt_outdoor', id: 'rowOut' + (index + 1), innerHTML: teasp.message.getLabel('awayInput_label') + this.zenNum[index] }, cell); // 公用外出
	cell = dojo.create('td', { style: 'width:49px;', className: 'input-out-time' }, row);
//	cell.style.paddingLeft = '2px';
	var inp = dojo.create('input', { type: 'text', className: 'inputime roundBegin', id: 'startOut' + (index + 1) }, cell);
	if(this.isReadOnly(this.OUT_AREA)){
		inp.readOnly = 'readOnly';
		dojo.toggleClass(inp, 'inputro', true);
	}else{
		this.eventHandles['startOutb' + (index + 1)] = dojo.connect(inp, 'blur'      , teasp.util.time.onblurTime);
		this.eventHandles['startOutk' + (index + 1)] = dojo.connect(inp, 'onkeypress', teasp.util.time.onkeypressTime);
	}
	dojo.create('td', { className: 'tt_span', innerHTML: teasp.message.getLabel('wave_label') }, row); // ～

	cell = dojo.create('td', { style: 'width:49px;', className: 'input-out-time' }, row);
	inp = dojo.create('input', { type: 'text', className: 'inputime roundEnd', id: 'endOut' + (index + 1) }, cell);
	if(this.isReadOnly(this.OUT_AREA)){
		inp.readOnly = 'readOnly';
		dojo.toggleClass(inp, 'inputro', true);
	}else{
		this.eventHandles['endOutb' + (index + 1)] = dojo.connect(inp, 'blur'      , teasp.util.time.onblurTime);
		this.eventHandles['endOutk' + (index + 1)] = dojo.connect(inp, 'onkeypress', teasp.util.time.onkeypressTime);
	}

	if(flag){
		cell = dojo.create('td', { rowSpan: rowCnt, className: 'tt_out_plus', style:'text-align:left;' }, row);
		cell.style.verticalAlign = 'bottom';
		inp = dojo.create('input', {
			type      : 'button',
			className : (this.isReadOnly(this.OUT_AREA) ? 'pb_btn_plusL_dis' : 'pb_btn_plusL'),
			title     : teasp.message.getLabel('awayInsert_label'), // 公用外出時間入力行追加
			style     : 'width:24px;height:24px;margin-left:4px;'
		}, cell);
		if(!this.isReadOnly(this.OUT_AREA)){
//            inp.onclick = /** @ignore */function(){ this.insertOutArea(); };
			this.eventHandles['awayPlus'] = dojo.connect(inp, 'onclick', this, this.insertOutArea);
		}
	}
	dojo.create('td', null, row);
};

/**
 * 勤務場所入力行作成
 * @param {Object} tbody テーブルボディ
 * @param {boolean=} clearWorkLocation true:勤務場所を空にする
 */
teasp.dialog.InputTime.prototype.createWorkLocationRow = function(tbody, clearWorkLocation){
	const row = dojo.create('tr', null, tbody);
	dojo.create('td', null, row);
	dojo.create('div', {
		className: 'tt_col tt_workLocation',
		innerHTML: teasp.message.getLabel('tw00000010') // 勤務場所
	}, dojo.create('td', { style:'vertical-align:middle;' }, row));
	// 勤務場所のプルダウンを作成
	const workLocations = this.pouch.getWorkLocations();
	var id = this.dayWrap.getWorkLocationId();
	if(this.isReadOnly()){
		const workLocation = (id ? this.pouch.getWorkLocationById(id) : null);
		const name = (workLocation && workLocation.getName()) || '';
		dojo.create('input', {
			type: 'text',
			id: 'workLocationId',
			style: 'width:93%;font-size:12px;padding:1px 4px;border:1px solid #808080;color:black;',
			disabled: 'disabled',
			value: name,
			title: name
		}, dojo.create('td', { colSpan:5, style:'text-align:left;' }, row));
	}else{
		const select = dojo.create('select', {
			id: 'workLocationId',
			style: 'width:100%;'
		}, dojo.create('td', { colSpan:5 }, row));
		dojo.create('option', { value:'', innerHTML:'' }, select);
		for(var i = 0 ; i < workLocations.length ; i++){
			const workLocation = workLocations[i];
			dojo.create('option', {
				value: workLocation.getId(),
				innerHTML: workLocation.getName()
			}, select);
			if(!id && workLocation.isInitFlag()){
				id = workLocation.getId();
			}
		}
		const workLocation = (id ? this.pouch.getWorkLocationById(id) : null);
		if(workLocation && workLocation.isRemoved()){ // 無効化された勤務場所
			dojo.create('option', {
				value: workLocation.getId(),
				innerHTML: workLocation.getName()
			}, select);
		}
		select.value = (!clearWorkLocation && id) || '';
		this.eventHandles['workLocation'] = dojo.connect(select, 'change', this, this.changeWorkLocation);
	}
	dojo.create('td', null, row);
};
/**
 * 選択中の勤務場所IDを得る
 * @returns {string|null}
 */
teasp.dialog.InputTime.prototype.getSelectedWorkLocationId = function(){
	const select = dojo.byId('workLocationId');
	return (select && select.value) || null;
};
/**
 * 勤務場所のチェック
 * @returns {boolean}
 */
teasp.dialog.InputTime.prototype.isWorkLocationOk = function(){
	if(!this.pouch.isRequireWorkLocation() // 勤務場所入力は必須ではない
	){
		return true;
	}
	return (this.getSelectedWorkLocationId() != null);
};
/**
 * 勤務場所をリセット
 */
teasp.dialog.InputTime.prototype.resetWorkLocation = function(){
	const select = dojo.byId('workLocationId');
	if(select){
		select.value = '';
	}
};
/**
 * 勤務場所を変更した
 */
teasp.dialog.InputTime.prototype.changeWorkLocation = function(e){
	const f = (dojo.byId('startTime').value == '' || dojo.byId('endTime').value == '' || this.dailyFixable.pending || !this.isWorkLocationOk());
	if(f){
		dojo.byId('timeInputDayFix').checked = false;
	}
	dojo.byId('timeInputDayFix').disabled = f;
	dojo.style('timeInputDayFixLabel', 'color', (!f ? '#222222' : '#CCCCCC'));
};

/**
 * 休憩時刻入力行作成
 *
 * @param {Object} tbody テーブルボディ
 * @param {number} index
 * @param {number} rowIndex
 * @param {boolean=} flag
 * @param {number=} rowCnt
 */
teasp.dialog.InputTime.prototype.createRestRow = function(tbody, index, rowIndex, flag, rowCnt){
	var x = rowIndex;

	if(!flag){
		var row = (x < 0 ? dojo.create('tr', null, tbody) : dojo.create('tr', null, tbody.rows[x], 'before'));
		dojo.create('td', null, row);
		dojo.create('td', { colSpan: '4', className: 'tt_gyokan' }, row);
		dojo.create('td', null, row);
		if(x >= 0){
			x++;
		}
	}
	var row = (x < 0 ? dojo.create('tr', null, tbody) : dojo.create('tr', null, tbody.rows[x], 'before'));
	dojo.create('td', null, row);
	var cell = dojo.create('td', null, row);
	cell.style.verticalAlign = 'middle';
	dojo.create('div', { className: 'tt_col tt_rest', id: 'rowRest' + (index + 1), innerHTML: teasp.message.getLabel('restInput_label') + this.zenNum[index] }, cell); // 休憩
	cell = dojo.create('td', { style: 'width:49px;', className: 'input-rest-time' }, row);
	var inp = dojo.create('input', { type: 'text', className: 'inputime roundBegin', id: 'startRest' + (index + 1) }, cell);
	if(this.isReadOnly(this.REST_AREA) || this.isNoEntry()){ // 読み込み専用か裁量労働の場合はリードオンリー
		inp.readOnly = 'readOnly';
		dojo.toggleClass(inp, 'inputro', true);
	}else{
		this.eventHandles['startRestb' + (index + 1)] = dojo.connect(inp, 'blur'      , teasp.util.time.onblurTime);
		this.eventHandles['startRestk' + (index + 1)] = dojo.connect(inp, 'onkeypress', teasp.util.time.onkeypressTime);
		dojo.attr(inp, 'fxtimes', this.dayWrap.getFixTimeNums()); // 所定休憩の設定時刻は丸めないようにする
	}
	dojo.create('td', { className: 'tt_span', innerHTML: teasp.message.getLabel('wave_label') }, row); // ～

	cell = dojo.create('td', { style: 'width:49px;', className: 'input-rest-time' }, row);
	inp = dojo.create('input', { type: 'text', className: 'inputime roundEnd', id: 'endRest' + (index + 1) }, cell);
	if(this.isReadOnly(this.REST_AREA) || this.isNoEntry()){ // 読み込み専用か裁量労働の場合はリードオンリー
		inp.readOnly = 'readOnly';
		dojo.toggleClass(inp, 'inputro', true);
	}else{
		this.eventHandles['endRestb' + (index + 1)] = dojo.connect(inp, 'blur'      , teasp.util.time.onblurTime);
		this.eventHandles['endRestk' + (index + 1)] = dojo.connect(inp, 'onkeypress', teasp.util.time.onkeypressTime);
		dojo.attr(inp, 'fxtimes', this.dayWrap.getFixTimeNums()); // 所定休憩の設定時刻は丸めないようにする
	}

	if(flag){
		cell = dojo.create('td', { rowSpan: rowCnt, className: 'tt_rest_plus', style:'text-align:left;' }, row);
		cell.style.verticalAlign = 'bottom';
		inp = dojo.create('input', {
			type      : 'button',
			className : ((this.isReadOnly(this.REST_AREA) || this.isNoEntry()) ? 'pb_btn_plusL_dis' : 'pb_btn_plusL'),
			title     : teasp.message.getLabel('restInsert_label'), // 休憩時間入力行追加
			style     : 'width:24px;height:24px;margin-left:4px;'
		}, cell);
		if(!this.isReadOnly(this.REST_AREA) && !this.isNoEntry()){
//            inp.onclick = /** @ignore */function(){ this.insertRestArea(); };
			this.eventHandles['restPlus'] = dojo.connect(inp, 'onclick', this, this.insertRestArea);
		}
	}
	dojo.create('td', null, row);
};

/**
 * リセットボタンクリック
 */
teasp.dialog.InputTime.prototype.reset = function(){
	var aways = [];
	var rests = [];
	if(this.pattern){
		for(var i = 0 ; i < this.pattern.restTimes.length ; i++){
			var tt = this.pattern.restTimes[i];
			rests.push(tt);
		}
	}
	rests = rests.sort(function(a, b){
		var na = (typeof(a.from) == 'number' ? a.from : a.to);
		var nb = (typeof(b.from) == 'number' ? b.from : b.to);
		return na - nb;
	});

	if(this.dayWrap.isConflictTimeHoliay(this.dayWrap.getTimeTable(), rests)){
		teasp.tsAlert(teasp.message.getLabel('tm10003040' // 先に{1}を取り消してください
				, '', teasp.data.EmpApply.getDisplayApplyType(teasp.constant.APPLY_TYPE_HOLIDAY)), this); // 休暇申請
		return;
	}
	const inpTime = this.checkInput();
	const inpReason = (this.tc && this.checkReason());

	if(inpTime || inpReason){
		// 勤怠情報をリセットします。よろしいですか？
		teasp.tsConfirmA(teasp.message.getLabel('tm10002110'), this, function(){
			var orgSt = dojo.byId('startTime').value;
			var orgEt = dojo.byId('endTime').value;
		
			this.createInputArea(rests.length, aways.length, true);
		
			var directFlag = this.dayWrap.getInputLimit().flag;
		
			if(directFlag & 1){
				dojo.byId('startTime').value = orgSt;
			}
			if(directFlag & 2){
				dojo.byId('endTime').value   = orgEt;
			}
			if(!this.tc){
				dojo.byId('pushStartTime').innerHTML = this.dayWrap.getStartTimeEmboss();
				dojo.byId('pushEndTime'  ).innerHTML = this.dayWrap.getEndTimeEmboss();
			}
			for(var i = 0 ; i < rests.length ; i++){
				dojo.byId('startRest' + (i + 1)).value = this.pouch.getDisplayTime(rests[i].from);
				dojo.byId('endRest'   + (i + 1)).value = this.pouch.getDisplayTime(rests[i].to  );
			}
			this.changedTime();
			this.resetDivergence();
			this.resetWorkLocation();
		});
	}else{
		this.resetWorkLocation();
	}
};

/**
 * 入力値が初期値と同じかチェック
 *
 * @return {boolean} true:違う false:同じ
 */
teasp.dialog.InputTime.prototype.checkInput = function(){
	var i;
	if(dojo.byId('startTime').value != '' || dojo.byId('endTime').value != ''){
		return true;
	}
	var aways = this.getAways();
	if(aways.length > 0){
		return true;
	}
	var rests = this.getRests();
	var fixRests = this.getFixRests();
	if(rests.length != fixRests.length){
		return true;
	}
	for(i = 0 ; i < rests.length ; i++){
		var a = rests[i];
		var b = fixRests[i];
		if(a.from != b.from || a.to != b.to || a.type != b.type){
			return true;
		}
	}
	return false;
};

teasp.dialog.InputTime.prototype.getFixRests = function(){
	var fixRests = [];
	if(this.pattern){
		for(var i = 0 ; i < this.pattern.restTimes.length ; i++){
			var tt = this.pattern.restTimes[i];
			fixRests.push(tt);
		}
	}
	if(fixRests.length > 0){
		fixRests = fixRests.sort(function(a, b){
			var na = (typeof(a.from) == 'number' ? a.from : a.to);
			var nb = (typeof(b.from) == 'number' ? b.from : b.to);
			return na - nb;
		});
	}
	return fixRests;
};

/**
 * 編集不可の場合、trueを返す
 * 参照モード/月次確定/日次確定の場合、true を返す。それ以外は引数の説明に従う
 * @param {number} inpTarget （勤怠時刻修正申請=オンまたは本人入力不可）かつ引数の示す箇所が編集不可なら true を返す
 *      IO_AREA:出退社時刻
 *      REST_AREA:休憩
 *      OUT_AREA:公用外出 
 * 		省略時: (公用外出編集不可または(公用外出未入力かつ公用外出入力オフ))かつ勤務場所入力オフの場合 true を返す
 * @return {boolean}
 */
teasp.dialog.InputTime.prototype.isReadOnly = function(inpTarget){
	if(this.pouch.isEmpMonthReadOnly() || this.dayWrap.isDailyFix()){ // 月次確定済みor参照モードor日次確定済み
		return true;
	}
	if(this.pouch.isUseReviseTimeApply() || !this.pouch.isUpdater()){ // 勤怠時刻修正=オンまたは本人入力不可
		if(inpTarget == this.IO_AREA || inpTarget == this.REST_AREA){ // 出退社時刻 or 休憩
			return true;
		}else{
			const empty = (typeof(this.dayWrap.getObj().startTime) != 'number' && typeof(this.dayWrap.getObj().endTime) != 'number'); // 出退社未入力
			if(inpTarget == this.OUT_AREA){ // 公用外出
				return empty;
			}
			const existAwayTime = (!empty && this.dayWrap.getAwayTimes().length >  0);
			return ((empty || (!existAwayTime && this.pouch.isHideAwayTimeInputField())) // 出退社未入力または（公用外出未入力かつ公用外出入力オフ）
				&& !this.pouch.isUseWorkLocation() // 勤務場所入力オフ
				&& !this.pouch.isInputAccessControl(true)); // 入退館管理使用しない
		}
	}
	return false;
};

/**
 * 入力禁止か
 *
 * @param {boolean=} flag true:直行直帰申請は無視する
 * @return {boolean} true:参照モード
 */
teasp.dialog.InputTime.prototype.isNoEntry = function(flag){
	return (this.isReadOnly(this.IO_AREA) || (!flag && this.dayWrap.getInputLimit().flag == 3));
};

/**
 * エラーメッセージ表示
 *
 * @param {?string} msg メッセージ
 * @param {boolean=} flag
 */
teasp.dialog.InputTime.prototype.showError = function(msg, flag){
	if(this.tc){
	    this.tc.selectChild(this.tc.getChildren()[0]);
	}
	dojo.style('dlgInpTimeErrorRow', 'display', (msg ? '' : 'none'));
	dojo.byId('dlgInpTimeError').innerHTML = (msg ? (flag ? msg : msg.entitize()) : '');
};

/**
 * 所定休憩時間か
 *
 * @param {Object} o 時間帯オブジェクト
 * @return {boolean} true:所定休憩時間である
 */
teasp.dialog.InputTime.prototype.isFixRest = function(o){
	if(this.pattern){
		for(var i = 0 ; i < this.pattern.restTimes.length ; i++){
			var rt = this.pattern.restTimes[i];
			if(rt.from == o.from && rt.to == o.to){
				return true;
			}
		}
	}
	return false;
};

/**
 * 休憩時間オブジェクトの配列を返す
 *
 * @param {boolean=} flag true:時間単位有休を含める
 * @return {Array.<Object>} 休憩時間オブジェクトの配列
 */
teasp.dialog.InputTime.prototype.getRests = function(flag){
	var o, n, from, to;
	var rests = [];
	dojo.query('.tt_rest').forEach(function(elem) {
		var match = /rowRest(\d+)/.exec(elem.id);
		if(match){
			n = match[1];
			from = teasp.util.time.clock2minutes(dojo.byId('startRest' + n).value);
			to   = teasp.util.time.clock2minutes(dojo.byId('endRest'   + n).value);
			if(from != undefined || to != undefined){
				o = {
					from: (from != undefined ? from : null),
					to  : (to   != undefined ? to   : null)
				};
				o.type = this.isFixRest(o) ? 21 : 22;
				rests.push(o);
			}
		}
	}, this);

	if(flag){ // 時間単位休を含める
		rests = rests.concat(this.dayWrap.getHourRests());
	}

	rests = rests.sort(function(a, b){
		var na = (typeof(a.from) == 'number' ? a.from : a.to);
		var nb = (typeof(b.from) == 'number' ? b.from : b.to);
		return na - nb;
	});
	return rests;
};

/**
 * 公用外出時間オブジェクトの配列を返す
 *
 * @return {Array.<Object>} 公用外出時間オブジェクトの配列
 */
teasp.dialog.InputTime.prototype.getAways = function(){
	var n, from, to;
	var aways = [];
	dojo.query('.tt_outdoor').forEach(function(elem) {
		var match = /rowOut(\d+)/.exec(elem.id);
		if(match){
			n = match[1];
			from = teasp.util.time.clock2minutes(dojo.byId('startOut' + n).value);
			to   = teasp.util.time.clock2minutes(dojo.byId('endOut'   + n).value);
			if(from != undefined || to != undefined){
				aways.push({
					from: (from != undefined ? from : null),
					to  : (to   != undefined ? to   : null),
					type: 30
				});
			}
		}
	}, this);
	aways = aways.sort(function(a, b){
		var na = (typeof(a.from) == 'number' ? a.from : a.to);
		var nb = (typeof(b.from) == 'number' ? b.from : b.to);
		return na - nb;
	});
	return aways;
};

/**
 * 乖離理由をプルダウンから選択した
 * @param {number} secn =1:入館乖離理由、=2:退館乖離理由
 * @returns {Function}
 */
teasp.dialog.InputTime.prototype.changedReason = function(secn){
	return function(e){
		var v = e.target.value;
		if(v){
			var textArea = dojo.query('.diverge-table' + secn + ' textarea', dojo.byId(this.dialog.id))[0];
			textArea.value = textArea.value + v;
			if(textArea.value.length > teasp.constant.DIVERGE_REASON_MAX){
				textArea.value = textArea.value.substring(0, teasp.constant.DIVERGE_REASON_MAX);
			}
		}
	};
};

teasp.dialog.InputTime.prototype.openAccessLog = function(e){
	teasp.manager.dialogOpen(
		'AccessControlLog',
		{
			date: this.args.date
		},
		this.pouch,
		this,
		null
	);
};

// 入館乖離理由の入力値
teasp.dialog.InputTime.prototype.getEnterDivergenceReason = function(){
	if(this.tc){
		var area = dojo.byId(this.dialog.id);
		return dojo.query('.diverge-table1 textarea', area)[0].value;
	}
	return this.dayWrap.getEnterDivergenceReason();
};

// 退館乖離理由の入力値
teasp.dialog.InputTime.prototype.getExitDivergenceReason = function(){
	if(this.tc){
		var area = dojo.byId(this.dialog.id);
		return dojo.query('.diverge-table2 textarea', area)[0].value;
	}
	return this.dayWrap.getExitDivergenceReason();
};

// 乖離理由テキストエリアにフォーカスをセット
teasp.dialog.InputTime.prototype.focusReasonTextArea = function(n){
	if(this.tc){
		var o = dojo.query('.diverge-table' + n + ' textarea', dojo.byId(this.dialog.id));
		if(o && o.length){
			o = o[0];
			setTimeout(function(){ o.focus(); }, 100);
		}
	}
};

/**
 * 理由が入力されているか
 * @returns {boolean}
 */
teasp.dialog.InputTime.prototype.checkReason = function(){
	var area = dojo.byId(this.dialog.id);
	return (
	   dojo.query('.diverge-table1 select', area)[0].value
	|| dojo.query('.diverge-table2 select', area)[0].value
	|| this.getEnterDivergenceReason()
	|| this.getExitDivergenceReason()
	);
};

// リセットボタン押下時の「勤怠タブ」、「乖離理由」タブの入館乖離関連リセット
teasp.dialog.InputTime.prototype.resetDivergence = function(){
	if(this.tc){
		this.setDivergenceInfo(true);
		this.setDivergeLeftSide(dojo.byId(this.dialog.id), true);
    }
};

/**
 * タブ切り替え時の処理
 * @param {number} tabn 変更先のタブ =0:勤怠タブ、=1:乖離理由タブ
 */
teasp.dialog.InputTime.prototype.changedPane = function(tabn){
	return dojo.hitch(this, function(){
		// 乖離理由タブでは［リセット］ボタンを非表示にする
		dojo.style('dlgInpTimeReset', 'display', ((this.isNoEntry(true) || tabn) ? 'none' : ''));
	});
};
