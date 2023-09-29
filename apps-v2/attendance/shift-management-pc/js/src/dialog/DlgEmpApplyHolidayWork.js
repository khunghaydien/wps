/**
 * 休日出勤申請フォーム生成
 *
 * @param {string} key 申請キー
 * @param {Object} node フォームの親ノード
 * @param {string} contId IDに使用する番号
 * @param {Object=} applyObj 申請データ
 */
teasp.dialog.EmpApply.prototype.createHolidayWorkForm = function(key, node, contId, applyObj, btnbox){
	var input2able = false;
	var notice = null;
	var plannedHoly = false;
	// 代休管理を行うがオンかつ申請時に代休有無を指定するがオンの場合、代休有無入力可
	var daiqResvable = this.pouch.isUseDaiqManage();
	var daiqFlag = 3;
	// ただし、対象日が明示された法定休日であり、法定休日出勤の代休可がオフの設定の場合、代休有無入力不可
	if(this.dayWrap.getExplicDayType() == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY && !this.pouch.isUseDaiqLegalHoliday()){
		if(this.pouch.isUseDaiqManage() && !applyObj){
			notice = teasp.message.getLabel('tm10003770'); // （注意）法定休日の出勤の代休は取得できません
		}
		daiqResvable = false;
	}else if(this.dayWrap.isPlannedHoliday()){
		plannedHoly = true;
		if(this.pouch.isUseDaiqManage() && !applyObj){
			notice = teasp.message.getLabel('tm10003840'); // （注意）<br/>有休計画付与日の出勤の代休は取得できません。<br/>平日の出勤と同じ扱いになります。
		}
		daiqResvable = false;
	}else if(this.pouch.isNoDaiqExchanged() && this.dayWrap.isExchangedEdge()){ // 振替で休日になった日
		if(!applyObj){
			notice = teasp.message.getLabel('tm10003960'); // （注意）<br/>振替休日の出勤の代休は取得できません。
		}
		daiqResvable = false;
	}
	var fix = (applyObj && teasp.constant.STATUS_FIX.contains(applyObj.status)) || this.isReadOnly();
	var inputClass = this.getInputClass(fix, applyObj);

	var tbody = dojo.create('div', null, node);

	this.holidayWorkRests = this.dayWrap.getPattern().restTimes || [];
	if((this.pouch.isHolidayWorkRestChangeable() || fix) && applyObj && applyObj.timeTable){
		this.holidayWorkRests = teasp.util.extractTimes(applyObj.timeTable);
	}
	this.holidayWorkRestChangeable = false;

	if(!fix && !this.pouch.isHideTimeGraphPopup()){
		// 当月時間外残業
		var row = dojo.create('div', { id: 'dialogApplyZangyoRow' + contId, className: 'empApply2Div' }, tbody);
		dojo.create('div', {
			className: 'empApply2CL',
			innerHTML: teasp.message.getLabel('zangyoOfMonth_label') // 当月時間外残業
		}, row);
		dojo.create('div', {
			className: 'empApply2VL',
			innerHTML: this.pouch.getMonthSubTimeByKey('workLegalOutOverTime'),
			id       : 'dialogApplyZangyo' + contId,
			style    : 'margin:0px 4px;'
		}, row);
	}

	// 開始時刻と終了時刻から労働時間を得る
	var getWorkTime = function(){
		var st = teasp.util.time.clock2minutes(dojo.byId('dialogApplyStartTime' + contId).value);
		var et = teasp.util.time.clock2minutes(dojo.byId('dialogApplyEndTime'   + contId).value);
		var t = 0;
		var restTime = 0;
		var restTimes = this.holidayWorkRests;
		if(typeof(st) == 'number' && typeof(et) == 'number' && st < et){
			restTime = teasp.util.time.rangeTime({ from: st, to: et }, restTimes);
			t = (et - st - restTime);
			var rcs = this.pouch.getRestTimeCheck(); // 法定休憩時間のチェック
			var hsk = 0; // 休憩時間の不足分
			for(var i = 0 ; i < rcs.length ; i++){
				var rc = rcs[i];
				if(rc.check && rc.push){
					if(t > rc.workTime && restTime < rc.restTime){ // 休憩時間が少ない
						var h = rc.restTime - restTime;
						if(hsk < h){
							hsk = h;
						}
					}
				}
			}
			t -= hsk;
			restTime = (et - st) - t;
		}
		return {
			workTime : t,
			restTime : restTime
		};
	};

	var getRestAddMsg = function(){
		var rcs = this.pouch.getRestTimeCheck(); // 法定休憩時間のチェック
		var msgs = [];
		for(var i = 0 ; i < rcs.length ; i++){
			var rc = rcs[i];
			if(rc.check && rc.push){
				msgs.push(teasp.message.getLabel('tf10007290' // 勤務時間 {0} 超の場合は休憩時間 {1}
					, teasp.util.time.timeValue(rc.workTime)
					, teasp.util.time.timeValue(rc.restTime)));
			}
		}
		return (msgs.length > 0 ? teasp.message.getLabel('tf10007300' // {0} が自動挿入されます。
						, msgs.join(teasp.message.getLabel('tm10001560'))) : null);
	};

	var getTimeTable = function(){
		if(this.holidayWorkRestChangeable){
			var rests = this.holidayWorkRests || [];
			var lst = [];
			for(var i = 0 ; i < rests.length ; i++){
				var rest = rests[i];
				var s1 = '' + rest.from;
				var s2 = '' + rest.to;
				var s3 = '' + rest.type;
				while(s1.length < 4){ s1 = '0' + s1; }
				while(s2.length < 4){ s2 = '0' + s2; }
				while(s3.length < 2){ s3 = '0' + s3; }
				lst.push(s1 + s2 + s3);
			}
			return lst.join(':') + ':';
		}
		return null;
	};

	var checkedDaiqReserve = null;
	var loadDaiq1Option = null;

	// 開始時刻または終了時刻が変更された
	var changedTime = function(flag){
		var o = getWorkTime.apply(this);
		var restArea = dojo.byId('dialogApplyTimeRest' + contId);
		if(restArea){
			restArea.innerHTML = teasp.util.time.timeValue(o.restTime);
		}
		if(daiqResvable){ // 代休管理をする
			var ab = this.pouch.getDaiqAllBorderTime(); // 終日代休可能な休日労働時間
			var hb = (this.pouch.isUseHalfDaiq() ? this.pouch.getDaiqHalfBorderTime() : -1); // 半日代休可能な休日労働時間
			daiqFlag = 0;
			if(hb >= 0 && o.workTime >= hb){ // 半日代休可能な休日労働時間をクリア
				daiqFlag = 1;
			}
			if(o.workTime >= ab){ // 終日代休可能な休日労働時間をクリア
				daiqFlag |= 2;
			}
			console.log('o.workTime=' + o.workTime + ' (' + teasp.util.time.timeValue(o.workTime) + '), daiqFlag=' + daiqFlag);
			if(loadDaiq1Option){
				loadDaiq1Option.apply(this);
			}
			if(checkedDaiqReserve){
				checkedDaiqReserve.apply(this, [null, flag]);
			}
		}
	};

	this.createTimeParts(key, tbody, contId, applyObj, (this.pouch.isUseRegulateHoliday() || plannedHoly), changedTime); // 時間

	if(this.pouch.isHolidayWorkRestChangeable() || (fix && applyObj && applyObj.timeTable)){ // 休憩時間の変更を許可
		this.holidayWorkRestChangeable = true;
		var tb = dojo.byId('dialogApplyTimeNote' + contId);
		var row = dojo.create('tr', null, dojo.create('tbody' , null, dojo.create('table' , { className:'pane_table horizon' }, tb, 'before')));
		var cell  = dojo.create('td' , { style: { paddingTop:"1px" } }, row);
		dojo.create('div', {
			style    : 'margin:5px 6px 5px 2px;font-weight:bold;float:left;',
			innerHTML: teasp.message.getLabel('restTime_label') // 休憩時間
		}, cell);
		dojo.create('div', {
			id       : 'dialogApplyTimeRest' + contId,
			style    : 'margin:5px;float:left;',
			innerHTML: '0:00'
		}, cell);
		var btn = dojo.create('button', {
			id        : 'dialogApplyTimeRestChange' + contId,
			className : 'std-button2',
			style     : 'margin:0px 8px 0px 0px;'
		}, cell);
		dojo.create('div', {
			style     : 'margin:2px 6px;float:left;',
			innerHTML : teasp.message.getLabel(fix ? 'setting_btn_title' : 'change_btn_title') // 設定 or 変更
		}, btn);

		// 休憩時間の変更
		this.eventHandles.push(dojo.connect(btn, 'onclick', this, function(){
			teasp.manager.dialogOpen(
				'RestInput',
				{
					rests    : this.holidayWorkRests,
					fxtimes  : this.dayWrap.getFixTimeNums(),
					note     : getRestAddMsg.apply(this),
					fix      : fix
				},
				this.pouch,
				this,
				function(rests){
					this.holidayWorkRests = rests;
					changedTime.apply(this, [true]); // 開始・終了時刻が変更されたときのメソッドを呼ぶ
				}
			);
		}));
	}

	if(this.pouch.isUseDirectApply() || (fix && applyObj && (applyObj.directFlag || applyObj.travelTime))){
		// 直行・直帰
		var row = dojo.create('div', { className: 'empApply2Div' }, tbody);
		dojo.create('div', {
			className: 'empApply2CL',
			innerHTML: teasp.message.getLabel('tk10004670') // 直行・直帰
		}, row);
		var cell  = dojo.create('div', {
			className: 'empApply2VL',
			style    : 'padding:0px;'
		}, row);

		var tbl = dojo.create('tbody', null, dojo.create('table', { className: 'pane_table' }, cell));
		var tbr = dojo.create('tr', null, tbl);
		var tbc = dojo.create('td' , { style: { paddingTop:"1px" } }, tbr);
		var div   = dojo.create('div', { style: { margin:"2px 4px 2px 0px", "float":"left" } }, tbc);
		var label = dojo.create('label', null, div);
		var chk1 = dojo.create('input', { type: 'checkbox', style: { margin:"2px" }, id: 'dialogApplyDirectIn' + contId }, label); // 直行チェックボックス
		dojo.create('span', { innerHTML: teasp.message.getLabel('tk10004680'), style: { margin:"2px" } }, label); // 直行

		div = dojo.create('div', { style: { margin:"2px 4px 2px 0px", "float":"left" } }, tbc);
		label = dojo.create('label', null, div);
		var chk2 = dojo.create('input', { type: 'checkbox', style: { margin:"2px" }, id: 'dialogApplyDirectOut' + contId }, label); // 直帰チェックボックス
		dojo.create('span', { innerHTML: teasp.message.getLabel('tk10004690'), style: { margin:"2px" } }, label); // 直帰

		if(applyObj){
			chk1.checked = ((applyObj.directFlag & 1) != 0);
			chk2.checked = ((applyObj.directFlag & 2) != 0);
		}
		chk1.disabled = (applyObj && (teasp.constant.STATUS_FIX.contains(applyObj.status) || !applyObj.active));
		chk2.disabled = (applyObj && (teasp.constant.STATUS_FIX.contains(applyObj.status) || !applyObj.active));

		// 前泊移動時間
		if(teasp.isNarrow()){
			row = dojo.create('div', { className: 'empApply2Div' }, tbody);
		}
		dojo.create('div', {
			className : 'empApply2CL',
			style     : (!teasp.isNarrow() ? 'min-width:100px;margin-left:20px;' : ''),
			innerHTML : teasp.message.getLabel('tk10004710') // 前泊移動時間
		}, row);
		var inp = dojo.create('input', {
			type     : 'text',
			id       : 'dialogApplyTravelTime' + contId,
			style    : 'margin:2px;',
			className: 'inputime ' + inputClass
		}, dojo.create('div', {
			className: 'empApply2VL'
		}, row));
		if(applyObj){
			if(typeof(applyObj.travelTime) == 'number'){
				inp.value = teasp.util.time.timeValue(applyObj.travelTime);
			}
			this.changeInputAreaView(inp, applyObj, fix);
		}
		if(fix){
			inp.readOnly = 'readOnly';
		}else{
			this.eventHandles.push(dojo.connect(inp, 'blur'      , this, teasp.util.time.onblurTime    ));
			this.eventHandles.push(dojo.connect(inp, 'onkeypress', this, teasp.util.time.onkeypressTime));
		}
	}
	if(this.pouch.isUseDirectApply() || (fix && applyObj && applyObj.workType)){ // 直行・直帰申請を使用する
		// 作業区分
		var row = dojo.create('div', { className: 'empApply2Div' }, tbody);
		dojo.create('div', {
			className: 'empApply2CL',
			innerHTML: teasp.message.getLabel('tk10004700')
		}, row); // 作業区分
		if(applyObj && (fix || !applyObj.active)){
			var m = (applyObj.workType || '');
			dojo.create('div', {
				className: 'empApply2VL',
				innerHTML: m,
				style    : 'margin:2px;'
			}, row);
			row.style.display = (m ? '' : 'none');
		}else{
			var select = dojo.create('select', {
				id: 'dialogApplyWorkType' + contId,
				className: inputClass,
				style    : 'width:100%;margin:2px;'
			}, dojo.create('div', {
				className: 'empApply2VL',
				style    : dojo.string.substitute('width:${0};', [this.valueWidth])
			}, row));
			var l = (this.pouch.getWorkTypeList() || []);
			dojo.create('option', { value: '', innerHTML: '' }, select);
			for(var i = 0 ; i < l.length ; i++){
				dojo.create('option', { value: l[i], innerHTML: l[i] }, select);
			}
			row.style.display = (l.length > 0 ? '' : 'none');
		}
	}
	this.createNoteParts(key, tbody, contId, applyObj); // 備考

	if((daiqResvable && this.pouch.isUseDaiqReserve()) || (applyObj && applyObj.daiqReserve && applyObj.daiqDate1)){ // 代休管理する、または申請レコードの代休予定＝オン
		// 半日代休を許可または申請レコードに代休予定日２がセットされている＝代休取得予定日２の入力欄を表示
		input2able = (this.pouch.isUseHalfDaiq() || (applyObj && applyObj.daiqDate2));
		// 代休予定
		var row = dojo.create('div', { className: 'empApply2Div', id: 'dialogApplyDaiqResvRow' + contId }, tbody);
		dojo.create('div', {
			className: 'empApply2CL',
			innerHTML: teasp.message.getLabel('daiqReserve_label')
		}, row); // 代休取得予定
		dojo.create('input', {
			type   : 'checkbox',
			checked: true,
			id: 'dialogApplyDaiqResv' + contId
		}, dojo.create('div', {
			className: 'empApply2VL'
		}, row));

		// 代休取得予定日１
		var row = dojo.create('div', { className: 'empApply2Div', id: 'dialogApplyDaiq1DateRow' + contId }, tbody);
		dojo.create('div', {
			className: 'empApply2CL',
			innerHTML: teasp.message.getLabel(input2able ? 'daiqDate1_label' : 'daiqDate_label')
		}, row); // 代休取得予定日１

		var cr = dojo.create('tr', null, dojo.create('tbody' , null, dojo.create('table' , { className: 'pane_table' }, dojo.create('div', { className: 'empApply2VL' }, row))));
		dojo.create('input', { type: 'text'  , id: 'dialogApplyDaiq1Date'    + contId, style: { margin:"2px" }, className: 'inpudate ' + inputClass }, dojo.create('td', null, cr));
		var btnCal1 = (fix ? null : dojo.create('input', { type: 'button', id: 'dialogApplyDaiq1DateCal' + contId, style: { margin:"2px" }, className: 'pp_base pp_btn_cal_dis' }, dojo.create('td', null, cr)));
		var td = dojo.create('td', { className: 'daiq1-option' }, cr);

		loadDaiq1Option = function(_cell){
			var cell = _cell || dojo.query('#dialogApplyDaiq1DateRow' + contId + ' td.daiq1-option')[0];
			if(!cell){
				return;
			}
			var ov = '1';
			var select = dojo.byId('dialogApplyDaiq1Option' + contId);
			if(!select){
				select = dojo.create('select', { id: 'dialogApplyDaiq1Option' + contId, style:"margin-left:4px;", className: 'inputran' }, cell);
			}else{
				ov = select.value;
			}
			dojo.empty(select);
			dojo.create('option', { value: '0', innerHTML: '' }, select);
			if((daiqFlag & 2)){
				dojo.create('option', { value: '1', innerHTML: teasp.message.getLabel('holidayDay_label') }, select); // 終日休
			}else if(ov == '1'){
				ov = '0';
			}
			if(this.pouch.isUseHalfDaiq() || (applyObj && applyObj.daiqReserve && applyObj.daiqDate1Range != '1')){
				dojo.create('option', { value: '2', innerHTML: teasp.message.getLabel('holidayAm_label')  }, select); // 午前半休
				dojo.create('option', { value: '3', innerHTML: teasp.message.getLabel('holidayPm_label')  }, select); // 午後半休
			}else if(!this.pouch.isUseHalfDaiq()){
				dojo.style(cell, 'display', 'none');
			}
			select.value = ov;
		};
		loadDaiq1Option.apply(this, [td]);

		// 代休取得予定日２
		var row = dojo.create('div', { className: 'empApply2Div', id: 'dialogApplyDaiq2DateRow' + contId }, tbody);
		dojo.create('div', {
			className: 'empApply2CL',
			innerHTML: teasp.message.getLabel('daiqDate2_label')
		}, row); // 代休取得予定日２

		cr = dojo.create('tr', null, dojo.create('tbody' , null, dojo.create('table' , { className: 'pane_table' }, dojo.create('div', { className: 'empApply2VL' }, row))));
		dojo.create('input', { type: 'text'  , id: 'dialogApplyDaiq2Date'    + contId, style: { margin:"2px" }, className: 'inpudate ' + inputClass }, dojo.create('td', null, cr));
		var btnCal2 = (fix ? null : dojo.create('input', { type: 'button', id: 'dialogApplyDaiq2DateCal' + contId, style: { margin:"2px" }, className: 'pp_base pp_btn_cal_dis' }, dojo.create('td', null, cr)));
		select = dojo.create('select', { id: 'dialogApplyDaiq2Option' + contId, style:"margin-left:4px;", className: 'inputran' }, dojo.create('td', null, cr));
		dojo.create('option', { value: '0', innerHTML: ''       }, select);
		dojo.create('option', { value: '2', innerHTML: teasp.message.getLabel('holidayAm_label') }, select); // 午前半休
		dojo.create('option', { value: '3', innerHTML: teasp.message.getLabel('holidayPm_label') }, select); // 午後半休
		select.value = '0';

		if(!input2able){ // 代休取得予定日２を不可視にする
			dojo.style(row, 'display', 'none');
		}

		if(applyObj){
			dojo.byId('dialogApplyDaiqResv' + contId).checked = applyObj.daiqReserve;
			// 代休取得予定日１
			dojo.byId('dialogApplyDaiq1Date'    + contId).value = teasp.util.date.formatDate(applyObj.daiqDate1, 'SLA');
			if(btnCal1){
				btnCal1.className = 'pp_base pp_btn_cal';
			}
			dojo.byId('dialogApplyDaiq1Option'  + contId).value = (applyObj.daiqDate1Range || '1');
			// 代休取得予定日２
			if(applyObj.daiqDate1Range == '1'){
				dojo.byId('dialogApplyDaiq2Date'    + contId).value = '';
				if(btnCal2){
					btnCal2.className = 'pp_base pp_btn_cal_dis';
				}
				dojo.byId('dialogApplyDaiq2Option'  + contId).value = '0';
			}else{
				dojo.byId('dialogApplyDaiq2Date'    + contId).value = teasp.util.date.formatDate(applyObj.daiqDate2, 'SLA');
				if(btnCal2){
					btnCal2.className = 'pp_base pp_btn_cal';
				}
				dojo.byId('dialogApplyDaiq2Option'  + contId).value = (applyObj.daiqDate2Range || '0');
			}
			if(fix){
				dojo.byId('dialogApplyDaiqResv'     + contId).disabled = true;
				dojo.byId('dialogApplyDaiq1Date'    + contId).disabled = true;
				dojo.byId('dialogApplyDaiq2Date'    + contId).disabled = true;
				dojo.toggleClass(dojo.byId('dialogApplyDaiq1Option' + contId), 'inputro', true);
				dojo.toggleClass(dojo.byId('dialogApplyDaiq2Option' + contId), 'inputro', true);
			}
		}else{
			// 代休取得予定日１
			dojo.byId('dialogApplyDaiq1Date'    + contId).value = '';
			if(btnCal1){
				btnCal1.className = 'pp_base pp_btn_cal';
			}
			dojo.byId('dialogApplyDaiq1Option'  + contId).value = '1';
			// 代休取得予定日２（最初は無効にする）
			dojo.byId('dialogApplyDaiq2Date'    + contId).value = '';
			if(btnCal2){
				btnCal2.className = 'pp_base pp_btn_cal_dis';
			}
			dojo.byId('dialogApplyDaiq2Option'  + contId).value = '0';
			dojo.byId('dialogApplyDaiq2Date'    + contId).disabled = true;
			dojo.byId('dialogApplyDaiq2Option'  + contId).disabled = true;
			dojo.toggleClass(dojo.byId('dialogApplyDaiq2Option' + contId), 'inputro', true);
		}
		// カレンダーボタンが押された時の処理
		var pushCalendarButton = dojo.hitch(this, function(_dfId){
			var dfId = _dfId;
			return dojo.hitch(this, function(e){
				if(dojo.byId(dfId).disabled){
					return;
				}
				var dt = teasp.util.date.parseDate(dojo.byId(dfId).value);
				if(!dt){
					dt = teasp.util.date.parseDate(this.args.date);
				}
				teasp.manager.dialogOpen(
					'Calendar',
					{
						date: dt,
						isDisabledDateFunc: dojo.hitch(this, function(d) {
							var key = teasp.util.date.formatDate(d);
							if(teasp.util.date.compareDate(d, dt) == 0){
								return false;
							}
							return (this.daiqableMap[key] ? false : true);
						})
					},
					null,
					this,
					function(o){
						dojo.byId(dfId).value = teasp.util.date.formatDate(o, 'SLA');
					}
				);
			});
		});

		if(!fix){
			this.eventHandles.push(dojo.connect(btnCal1, 'onclick', this, pushCalendarButton('dialogApplyDaiq1Date' + contId)));
			if(input2able){
				this.eventHandles.push(dojo.connect(btnCal2, 'onclick', this, pushCalendarButton('dialogApplyDaiq2Date' + contId)));
			}
		}

		checkedDaiqReserve = function(e, flag){
			if(!e && !daiqFlag && !flag){ // 時間が変更されたときだけ
				dojo.byId('dialogApplyDaiqResv' + contId).checked = false; // 代休付与数が0なら、代休取得予定をオフに変える
			}
			var checked = dojo.byId('dialogApplyDaiqResv' + contId).checked;
			var d1off = (fix || !checked || !daiqFlag); // 代休取得予定日１の入力可否
			dojo.byId('dialogApplyDaiq1Date'    + contId).disabled  = d1off;
			if(btnCal1){
				btnCal1.className = 'pp_base ' + (d1off ? 'pp_btn_cal_dis' : 'pp_btn_cal');
			}
			dojo.byId('dialogApplyDaiq1Option'  + contId).disabled  = d1off;
			dojo.toggleClass(dojo.byId('dialogApplyDaiq1Option' + contId), 'inputro', d1off);
			var v = dojo.byId('dialogApplyDaiq1Option' + contId).value; // 代休取得予定日２の入力可否
			var d2off = (fix || !checked || !(daiqFlag & 2) || v=='1' || v=='0');
			dojo.byId('dialogApplyDaiq2Date'    + contId).disabled  = d2off;
			if(btnCal2){
				btnCal2.className = 'pp_base ' + (d2off ? 'pp_btn_cal_dis' : 'pp_btn_cal');
			}
			dojo.byId('dialogApplyDaiq2Option'  + contId).disabled  = d2off;
			dojo.toggleClass(dojo.byId('dialogApplyDaiq2Option' + contId), 'inputro', d2off);
		};

		// 代休予定のチェックボックスが変更された時の処理
		this.eventHandles.push(dojo.connect(dojo.byId('dialogApplyDaiqResv' + contId), 'onclick', this, checkedDaiqReserve));

		if(input2able){
			// 代休予定日１のオプションが変更された時、代休予定日２の有効化／無効化を切り替え
			this.eventHandles.push(dojo.connect(dojo.byId('dialogApplyDaiq1Option' + contId), 'onchange', this, function(e){
				var v = dojo.byId('dialogApplyDaiq1Option' + contId).value;
				var d2off = (!(daiqFlag & 2) || v=='1' || v=='0');
				dojo.byId('dialogApplyDaiq2Date'    + contId).disabled  = d2off;
				if(btnCal2){
					btnCal2.className = 'pp_base ' + (d2off ? 'pp_btn_cal_dis' : 'pp_btn_cal');
				}
				dojo.byId('dialogApplyDaiq2Option'  + contId).disabled  = d2off;
				dojo.toggleClass(dojo.byId('dialogApplyDaiq2Option' + contId), 'inputro', d2off);
			}));
		}
	}
	if(notice){ // 法定休日は代休を取れない旨のメッセージを表示
		var row = dojo.create('div', { className: 'empApply2Div' }, tbody);
		dojo.create('div', { className: 'empApply2CL' }, row);
		dojo.create('div', { className: 'empApply2VL', innerHTML: notice }, row);
	}

	this.createApplySetParts (key, tbody, contId, applyObj); // 承認者設定
	this.createApplyTimeParts(key, tbody, contId, applyObj); // 申請日時
	this.createStatusParts   (key, tbody, contId, applyObj); // 状況
	this.createAnnotateParts (key, tbody, contId);
	this.createErrorParts    (key, tbody, contId); // エラーメッセージ出力エリア

	if(btnbox){
		dojo.place(btnbox, tbody);
	}

	var whend = dojo.byId('dialogApplyTimeNote' + contId);
	var aftered = false;
	if(!applyObj){ // デフォルト値をセット
		var o = this.dayWrap.getDefaultZangyoRange(true);
		dojo.byId('dialogApplyStartTime' + contId).value = teasp.util.time.timeValue(o.from, this.timeForm);
		dojo.byId('dialogApplyEndTime'   + contId).value = teasp.util.time.timeValue(o.to  , this.timeForm);
		this.displayOnOff('dialogApplyAnnotateRow'  + contId, false);
		var td = teasp.util.date.getToday();
		var when = teasp.util.date.compareDate(this.args.date, td);
		aftered = (when < 0); // 過去日
	}else{
		this.displayOnOff('dialogApplyAnnotateRow'  + contId, true);
		if(this.daiqZan.applys[applyObj.id]){
			dojo.byId('dialogApplyAnnotate' + contId).innerHTML = this.daiqZan.applys[applyObj.id].status;
		}
		aftered = applyObj.afterFlag;
	}
	if(aftered && this.pouch.isClarifyAfterApply()){
		whend.innerHTML = teasp.message.getLabel('tm10001680', teasp.message.getLabel('tk10004030')); // (事後申請)
		whend.style.color = 'black';
	}

	changedTime.apply(this, [true]); // 開始・終了時刻が変更されたときのメソッドを呼ぶ

	this.drawLast(applyObj, node);

	// 申請ボタンが押された時の処理
	var btnOk = dojo.byId('empApplyDone' + contId);
	if(btnOk){
		this.eventHandles.push(dojo.connect(btnOk, 'onclick', this, function(e){
			var daiqR = dojo.byId('dialogApplyDaiqResv' + contId);
			var daiqProvide = ((daiqFlag & 2) ? 1 : ((daiqFlag & 1) ? 0.5 : 0)); // 付与できる日数を得る
			var daiqReserve = (daiqR ? daiqR.checked : (this.pouch.isUseDaiqManage() && daiqResvable));
			var req = {
				empId                  : this.pouch.getEmpId(),
				month                  : this.pouch.getYearMonth(),
				startDate              : this.pouch.getStartDate(),
				lastModifiedDate       : this.pouch.getLastModifiedDate(),
				date                   : this.args.date,
				apply                  : {
					id                 : (applyObj ? applyObj.id : null),
					applyType          : teasp.constant.APPLY_TYPE_KYUSHTU,
					patternId          : null,
					holidayId          : null,
					status             : null,
					startDate          : this.args.date,
					endDate            : this.args.date,
					exchangeDate       : null,
					startTime          : teasp.util.time.clock2minutes(dojo.byId('dialogApplyStartTime' + contId).value),
					endTime            : teasp.util.time.clock2minutes(dojo.byId('dialogApplyEndTime'   + contId).value),
					note               : (dojo.byId('dialogApplyNote' + contId).value || null),
					contact            : null,
					daiqReserve        : daiqReserve,
					daiqProvide        : daiqProvide,
					daiqDate1          : null,
					daiqDate1Range     : null,
					daiqDate2          : null,
					daiqDate2Range     : null,
					useRegulateHoliday : ((daiqReserve && this.pouch.isUseRegulateHoliday()) || plannedHoly),
					afterFlag          : false,
					directFlag         : 0,
					workType           : null,
					travelTime         : null,
					timeTable          : getTimeTable.apply(this)
				}
			};
			if(req.apply.startTime === undefined || req.apply.endTime === undefined){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003100')); // 時間を設定してください
				return;
			}
			if(req.apply.startTime >= req.apply.endTime){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003110')); // 正しい時間を設定してください
				return;
			}
			if(req.apply.startTime >= 1440){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002030')); // 出社時刻に 24:00 以降の時刻を入力できません
				return;
			}
//			if(this.pouch.isProhibitAcrossNextDayOfHolidayWork() // 休日出勤時には24:00を超えた勤務を許さない
//			&& req.apply.endTime > 1440
//			){
//				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008430')); // 休日出勤時には24:00以降の退社時刻を入力できません。
//				return;
//			}
			if(req.apply.endTime > 2880){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003120')); // 48:00以降の時刻を設定できません
				return;
			}
			if(daiqR && req.apply.daiqReserve){ // 代休取得予定がチェック＝オン
				var d1 = teasp.util.strToDate(dojo.byId('dialogApplyDaiq1Date' + contId).value);
				if(d1.failed > 1){
					teasp.dialog.EmpApply.showError(contId, dojo.replace(d1.tmpl, [teasp.message.getLabel(input2able ? 'daiqDate1_label' : 'daiqDate_label')])); // 代休取得予定日１
					return;
				}
				var op1 = dojo.byId('dialogApplyDaiq1Option' + contId).value;
				if(d1.failed == 0 && this.pouch.isUseHalfDaiq()){
					if(op1 == '0' || !op1){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003232')); // 代休予定日１の代休種類を選択してください
						return;
					}
				}else{
					op1 = '1';
				}
				var daiq2 = dojo.byId('dialogApplyDaiq2Date' + contId);
				var d2 = null, op2 = null;
				if(daiq2){
					d2 = teasp.util.strToDate(daiq2.value);
					if(d2.failed > 1){
						teasp.dialog.EmpApply.showError(contId, dojo.replace(d2.tmpl, [teasp.message.getLabel('daiqDate2_label')])); // 代休取得予定日２
						return;
					}
					op2 = dojo.byId('dialogApplyDaiq2Option' + contId).value;
					if(d1.failed == 1 && d2.failed == 0){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003220')); // 代休予定日２を入力する場合は代休予定日１を省略できません
						return;
					}
					if(op1 != '1' && d2.failed == 0 && op2 == '0'){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003230')); // 代休予定日２を午前休にするか午後休にするか選択してください
						return;
					}
					if(d1.datef == d2.datef && op1 == op2){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003231')); // 同一日に同じ種類の代休を取得できません。
						return;
					}
				}
				if(d1.failed == 0){
					if(!this.daiqableMap[d1.datef]){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10007940',     // {0}の日付は無効です。
															teasp.message.getLabel('daiqDate1_label'))); // 代休取得予定日１
						return;
					}
					req.apply.daiqDate1 = d1.datef;
					req.apply.daiqDate1Range = op1;
					var days = this.getRangeApplys(req.apply.daiqDate1);
					var oths = { cnt: 0 };
					var msg  = this.conflictHoliday(days[req.apply.daiqDate1]
								, { range: op1 }
								, {
									msge1: teasp.message.getLabel('tk10005200'),   // 代休予定日
									msge2: teasp.message.getLabel('tk10005200')    // 代休予定日
								}
								, oths);
					if(msg){
						teasp.dialog.EmpApply.showError(contId, msg);
						return;
					}
					if(oths.cnt){
						teasp.dialog.EmpApply.showError(contId
							, teasp.message.getLabel('tk10005230'       // {0}の{1}を先に取り消してください。
								, teasp.message.getLabel('tk10005200')  // 代休予定日
								, teasp.dialog.EmpApply.getApplyTypesName(oths)
								)
						);
						return;
					}
					if(op1 != '1' && d2 && d2.failed == 0){
						if(!this.daiqableMap[d2.datef]){
							teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10007940',     // {0}の日付は無効です。
																teasp.message.getLabel('daiqDate2_label'))); // 代休取得予定日１
							return;
						}
						req.apply.daiqDate2 = d2.datef;
						req.apply.daiqDate2Range = op2;
						days = this.getRangeApplys(req.apply.daiqDate2);
						oths = { cnt: 0 };
						msg  = this.conflictHoliday(days[req.apply.daiqDate2]
								, { range: op2 }
								, {
									msge1: teasp.message.getLabel('tk10005200'),   // 代休予定日
									msge2: teasp.message.getLabel('tk10005200')    // 代休予定日
								}
								, oths);
						if(msg){
							teasp.dialog.EmpApply.showError(contId, msg);
							return;
						}
						if(d1.datef == d2.datef){ // 同一日に午前半休、午後半休を指定
							var day = days[req.apply.daiqDate1];
							var htlst = (day && day.rack && day.rack.validApplys && day.rack.validApplys.holidayTime) || [];
							if(htlst.length){ // 時間単位休が申請されている
								teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10004610', teasp.message.getLabel('tk10005200')));
								return;
							}
						}
						if(oths.cnt){
							teasp.dialog.EmpApply.showError(contId
								, teasp.message.getLabel('tk10005230'       // {0}の{1}を先に取り消してください。
									, teasp.message.getLabel('tk10005200')  // 代休予定日
									, teasp.dialog.EmpApply.getApplyTypesName(oths)
									)
							);
							return;
						}
					}
				}
			}

			if(this.pouch.isRequireNote(teasp.constant.APPLY_KEY_KYUSHTU)
			&& (!req.apply.note || !req.apply.note.replace(/[\s　]+$/g,''))){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003680')); // 備考を入力してください
				return;
			}
			req.apply.afterFlag = this.getAfterFlag(teasp.constant.APPLY_KEY_KYUSHTU, req.apply.startDate, req.apply.startTime, req.apply.endTime);
			teasp.dialog.EmpApply.showError(contId, null);

			if(this.pouch.isUseDirectApply()){ // 直行・直帰申請を使用する
				if(dojo.byId('dialogApplyDirectIn' + contId).checked){
					req.apply.directFlag |= 1;
				}
				if(dojo.byId('dialogApplyDirectOut' + contId).checked){
					req.apply.directFlag |= 2;
				}
				req.apply.workType = (dojo.byId('dialogApplyWorkType' + contId).value || null);
				var t = teasp.util.time.clock2minutes(dojo.byId('dialogApplyTravelTime' + contId).value);
				req.apply.travelTime = (typeof(t) == 'number' ? t : null);
				// サーバへ送信
				this.requestDirectApply(contId, req);
			}else{
				// サーバへ送信
				this.requestSend(contId, req);
			}
		}));
	}
};

