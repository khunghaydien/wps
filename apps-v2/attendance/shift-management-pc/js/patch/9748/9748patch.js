if(typeof(teasp) == 'object' && teasp.dialog && teasp.dialog.EmpApply){
teasp.dialog.EmpApply.prototype.createZangyoForm = function(key, node, contId, applyObj, btnbox){
	var tbody = dojo.create('div', null, node);

	if(!applyObj && !this.pouch.isHideTimeGraphPopup()){
		// 当月時間外残業
		var row = dojo.create('div', { id: 'dialogApplyZangyoRow' + contId, className: 'empApply2Div' }, tbody);
		dojo.create('div', {
			className : 'empApply2CL',
			innerHTML : teasp.message.getLabel('zangyoOfMonth_label') // 当月時間外残業
		}, row);
		dojo.create('div', {
			id        : 'dialogApplyZangyo' + contId,
			style     : 'margin:8px 4px;',
			className : 'empApply2VL',
			innerHTML : this.pouch.getMonthSubTimeByKey('workLegalOutOverTime')
		}, row);
	}

	var overTimeBorderTime = this.pouch.getOverTimeBorderTime(this.dayWrap.getFixEndTime());
	var useOverTimeFlag    = this.pouch.getUseOverTimeFlag();
	var changedTime = function(){
		var st = teasp.util.time.clock2minutes(dojo.byId('dialogApplyStartTime' + contId).value);
		var o = this.dayWrap.getDefaultZangyoRange(false, overTimeBorderTime, useOverTimeFlag); // デフォルトの残業時間帯を得る（所定終業時刻 ～ 所定終業時刻+2:00）
		var msg = null;
		if((useOverTimeFlag & 2) && o.bdrTime < st){ // 残業申請の時間帯以外の勤務は認めない かつ 申請が必要な境界時刻＜申請の開始時刻
			dojo.style('dialogApplyWarnRow' + contId, 'display', '');
			msg = teasp.message.getLabel('tk10001174'                         // {0}～残業の開始時刻の間は、勤務しても労働時間とみなされませんのでご注意ください{1}。
					, teasp.util.time.timeValue(o.bdrTime, this.timeForm)
					, (o.bdrFlag ? teasp.message.getLabel('tk10001210') : '') // （ただし所定労働時間の場合は認められます）
					);
		}
		teasp.dialog.EmpApply.showWarn(contId, msg);
	};
	//----------------------------------------
	if(this.pouch.isUseBulkOverTime() && this.client == teasp.constant.APPLY_CLIENT_MONTHLY && (!applyObj || applyObj.status != teasp.constant.STATUS_WAIT)){
		var row = dojo.create('div', { className: 'empApply2Div' }, tbody);
		dojo.create('div', {
			className: 'empApply2CL',
			innerHTML: teasp.message.getLabel('date_head') // 日付
		}, row);
		dojo.create('input', {
			type      : 'text',
			id        : 'dialogApplyStartDate' + contId,
			readOnly  : 'readOnly',
			className : 'inputro inpudate',
			style     : 'margin:2px;',
			value     : teasp.util.date.formatDate((applyObj ? applyObj.startDate : this.args.date), 'SLA')
		}, dojo.create('div', {
			className: 'empApply2VL'
		}, row));
		if(teasp.isNarrow()){
			row = dojo.create('div', { className: 'empApply2Div' }, tbody);
			dojo.create('div', { className: 'empApply2CL' }, row);
		}
		var a = dojo.create('a', {
			innerHTML: teasp.message.getLabel('tf10005110'), // 期間で申請
			style    : 'color:#000080;text-decoration:underline;cursor:pointer;'
		}, dojo.create('div', {
			className: 'empApply2VL',
			style    : 'margin:4px 0px 0px 12px;'
		}, row));
		dojo.connect(a, 'onclick', this, function(){
			this.close();
			this.onfinishfunc(false, { date: this.args.date, applyType: teasp.constant.APPLY_TYPE_ZANGYO });
		});
	}
	//----------------------------------------

	this.createTimeParts     (key, tbody, contId, applyObj, false, changedTime); // 時間
	this.createNoteParts     (key, tbody, contId, applyObj); // 備考
	this.createApplySetParts (key, tbody, contId, applyObj); // 承認者設定
	this.createApplyTimeParts(key, tbody, contId, applyObj); // 申請日時
	this.createStatusParts   (key, tbody, contId, applyObj); // 状況
	this.createErrorParts    (key, tbody, contId); // エラーメッセージ出力エリア
	this.createWarnParts     (key, tbody, contId); // 警告メッセージ出力エリア

	if(btnbox){
		dojo.place(btnbox, tbody);
	}

	var whend = dojo.byId('dialogApplyTimeNote' + contId);
	var aftered = false;
	if(!applyObj){ // デフォルト値をセット
		var o = this.dayWrap.getDefaultZangyoRange(false, overTimeBorderTime, useOverTimeFlag);
		if(o.from < (22*60)){
			o.from = (22*60);
		}
		if(o.from < (29*60)){
			o.to = (29*60);
		}
		dojo.byId('dialogApplyStartTime' + contId).value = teasp.util.time.timeValue(o.from, this.timeForm);
		dojo.byId('dialogApplyEndTime'   + contId).value = teasp.util.time.timeValue(o.to  , this.timeForm);
		var td = teasp.util.date.getToday();
		var when = teasp.util.date.compareDate(this.args.date, td);
		aftered = (when < 0); // 過去日
	}else{
		aftered = applyObj.afterFlag;
	}
	if(aftered && this.pouch.isClarifyAfterApply()){
		whend.innerHTML = teasp.message.getLabel('tm10001680', teasp.message.getLabel('tk10004030')); // (事後申請)
		whend.style.color = 'black';
	}

	this.drawLast(applyObj, node);

	// 申請ボタンが押された時の処理
	var btnOk = dojo.byId('empApplyDone' + contId);
	if(btnOk){
		this.eventHandles.push(dojo.connect(btnOk, 'onclick', this, function(e){
			var req = {
				empId            : this.pouch.getEmpId(),
				month            : this.pouch.getYearMonth(),
				startDate        : this.pouch.getStartDate(),
				lastModifiedDate : this.pouch.getLastModifiedDate(),
				date             : this.args.date,
				apply            : {
					id           : (applyObj ? applyObj.id : null),
					applyType    : teasp.constant.APPLY_TYPE_ZANGYO,
					patternId    : null,
					holidayId    : null,
					status       : null,
					startDate    : this.args.date,
					endDate      : this.args.date,
					exchangeDate : null,
					startTime    : teasp.util.time.clock2minutes(dojo.byId('dialogApplyStartTime' + contId).value),
					endTime      : teasp.util.time.clock2minutes(dojo.byId('dialogApplyEndTime'   + contId).value),
					note         : (dojo.byId('dialogApplyNote' + contId).value || null),
					contact      : null,
					afterFlag    : false
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
			if(req.apply.startTime < this.dayWrap.getFixStartTime()){
				var msgId = (this.dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL ? 'tm10003115' : 'tm10003116'); // 開始時刻が所定の始業時刻より前にならないようにしてください or 開始時刻が休日出勤申請の開始時刻より前にならないようにしてください
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel(msgId));
				return;
			}
			if(req.apply.endTime > 2880){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003120')); // 48:00以降の時刻を設定できません
				return;
			}
			var o = this.dayWrap.getDefaultZangyoRange(false, overTimeBorderTime, useOverTimeFlag); // デフォルトの残業時間帯を得る（所定終業時刻 ～ 所定終業時刻+2:00）

			if(this.dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL && !this.dayWrap.isPlannedHoliday()){
				var t = teasp.util.time.rangeTime({ from: req.apply.startTime, to: req.apply.endTime }, [{ from: o.shiftStartTime, to: o.shiftEndTime }]);
				if(t > 0){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003210')); // 残業の時間は所定の始業～終業時間と重ならない時間帯を指定してください
					return;
				}
			}
//			if(this.pouch.isProhibitAcrossNextDayOfHolidayWork() // 休日出勤時には24:00を超えた勤務を許さない
//			&& this.dayWrap.isHoliday()
//			&& this.dayWrap.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)
//			&& req.apply.endTime > 1440
//			){
//				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008430')); // 休日出勤時には24:00以降の退社時刻を入力できません。
//				return;
//			}
			if(this.pouch.isRequireNote(teasp.constant.APPLY_KEY_ZANGYO)
			&& !req.apply.note){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003680')); // 備考を入力してください
				return;
			}
			teasp.dialog.EmpApply.showError(contId, null);

			req.apply.afterFlag = this.getAfterFlag(teasp.constant.APPLY_KEY_ZANGYO, req.apply.startDate, req.apply.startTime, req.apply.endTime);

			if(this.dayWrap.getInputLimit().flag){ // 直行・直帰申請あり
				if(req.apply.endTime > 1440 && (this.dayWrap.getInputLimit().flag & 2)){ // 直帰あり
					var nd = this.pouch.getEmpDay(teasp.util.date.addDays(this.args.date, 1)); // 翌日
					var h = nd.getProhibitOverNightWorkHoliday(); // 休暇の延長勤務禁止＝オンの休暇申請がある
					if(h){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008360', h.name)); // {0}の前日は24:00を超える勤務はできません。
						return;
					}
				}
				// サーバへ送信
				this.requestDirectApply(contId, req, true);
			}else{
				// サーバへ送信
				this.requestSend(contId, req);
			}
		}));
	}
};
// 早朝勤務申請
teasp.dialog.EmpApply.prototype.createEarlyStartForm = function(key, node, contId, applyObj, btnbox){
	var tbody = dojo.create('div', null, node);

	if(!applyObj && !this.pouch.isHideTimeGraphPopup()){
		// 当月時間外残業
		var row = dojo.create('div', { id: 'dialogApplyEarlyStartRow' + contId, className: 'empApply2Div' }, tbody);
		dojo.create('div', {
			className : 'empApply2CL',
			innerHTML : teasp.message.getLabel('zangyoOfMonth_label') // 当月時間外残業
		}, row);
		dojo.create('div', {
			id        : 'dialogApplyEarlyStart' + contId,
			style     : 'margin:8px 4px;',
			className : 'empApply2VL',
			innerHTML : this.pouch.getMonthSubTimeByKey('workLegalOutOverTime')
		}, row);
	}

	var earlyWorkBorderTime = this.pouch.getEarlyWorkBorderTime(this.dayWrap.getFixStartTime());
	var useEarlyWorkFlag    = this.pouch.getUseEarlyWorkFlag();
	var changedTime = function(){
		var et = teasp.util.time.clock2minutes(dojo.byId('dialogApplyEndTime' + contId).value);
		var o = this.dayWrap.getDefaultEarlyStartRange(earlyWorkBorderTime, useEarlyWorkFlag); // デフォルトの早朝勤務時間帯を得る（所定始業時刻-1:00 ～ 所定始業時刻）
		var msg = null;
		if((useEarlyWorkFlag & 2) && et < o.bdrTime){ // 早朝勤務申請の時間帯以外の勤務は認めない かつ 申請の終了時刻＜申請が必要な境界時刻
			dojo.style('dialogApplyWarnRow' + contId, 'display', '');
			msg = teasp.message.getLabel('tk10001175'                           // 早朝勤務の終了時刻～{0}の間は、勤務しても労働時間とみなされませんのでご注意ください{1}。
					, teasp.util.time.timeValue(o.bdrTime, this.timeForm)
					, (o.bdrFlag ? teasp.message.getLabel('tk10001210') : '')   // （ただし所定労働時間の場合は認められます）
					);
		}
		teasp.dialog.EmpApply.showWarn(contId, msg);
	};
	//----------------------------------------
	if(this.pouch.isUseBulkEarlyWork() && this.client == teasp.constant.APPLY_CLIENT_MONTHLY && (!applyObj || applyObj.status != teasp.constant.STATUS_WAIT)){
		var row = dojo.create('div', { className: 'empApply2Div' }, tbody);
		dojo.create('div', {
			className: 'empApply2CL',
			innerHTML: teasp.message.getLabel('date_head') // 日付
		}, row);
		dojo.create('input', {
			type      : 'text',
			id        : 'dialogApplyStartDate' + contId,
			readOnly  : 'readOnly',
			className : 'inputro inpudate',
			style     : 'margin:2px;',
			value     : teasp.util.date.formatDate((applyObj ? applyObj.startDate : this.args.date), 'SLA')
		}, dojo.create('div', {
			className: 'empApply2VL'
		}, row));
		if(teasp.isNarrow()){
			row = dojo.create('div', { className: 'empApply2Div' }, tbody);
			dojo.create('div', { className: 'empApply2CL' }, row);
		}
		var a = dojo.create('a', {
			innerHTML: teasp.message.getLabel('tf10005110'), // 期間で申請
			style    : 'color:#000080;text-decoration:underline;cursor:pointer;'
		}, dojo.create('div', {
			className: 'empApply2VL',
			style    : 'margin:4px 0px 0px 12px;'
		}, row));
		dojo.connect(a, 'onclick', this, function(){
			this.close();
			this.onfinishfunc(false, { date: this.args.date, applyType: teasp.constant.APPLY_TYPE_EARLYSTART });
		});
	}
	//----------------------------------------

	this.createTimeParts     (key, tbody, contId, applyObj, false, changedTime); // 時間
	this.createNoteParts     (key, tbody, contId, applyObj); // 備考
	this.createApplySetParts (key, tbody, contId, applyObj); // 承認者設定
	this.createApplyTimeParts(key, tbody, contId, applyObj); // 申請日時
	this.createStatusParts   (key, tbody, contId, applyObj); // 状況
	this.createErrorParts    (key, tbody, contId); // エラーメッセージ出力エリア
	this.createWarnParts     (key, tbody, contId); // 警告メッセージ出力エリア

	if(btnbox){
		dojo.place(btnbox, tbody);
	}

	var whend = dojo.byId('dialogApplyTimeNote' + contId);
	var aftered = false;
	if(!applyObj){ // デフォルト値をセット
		var o = this.dayWrap.getDefaultEarlyStartRange(earlyWorkBorderTime, useEarlyWorkFlag);
		dojo.byId('dialogApplyStartTime' + contId).value = teasp.util.time.timeValue(o.from, this.timeForm);
		dojo.byId('dialogApplyEndTime'   + contId).value = teasp.util.time.timeValue(o.to  , this.timeForm);
		var td = teasp.util.date.getToday();
		var when = teasp.util.date.compareDate(this.args.date, td);
		aftered = (when < 0); // 過去日
	}else{
		aftered = applyObj.afterFlag;
	}
	if(aftered && this.pouch.isClarifyAfterApply()){
		whend.innerHTML = teasp.message.getLabel('tm10001680', teasp.message.getLabel('tk10004030')); // (事後申請)
		whend.style.color = 'black';
	}

	this.drawLast(applyObj, node);

	// 申請ボタンが押された時の処理
	var btnOk = dojo.byId('empApplyDone' + contId);
	if(btnOk){
		this.eventHandles.push(dojo.connect(btnOk, 'onclick', this, function(e){
			var req = {
				empId            : this.pouch.getEmpId(),
				month            : this.pouch.getYearMonth(),
				startDate        : this.pouch.getStartDate(),
				lastModifiedDate : this.pouch.getLastModifiedDate(),
				date             : this.args.date,
				apply            : {
					id           : (applyObj ? applyObj.id : null),
					applyType    : teasp.constant.APPLY_TYPE_EARLYSTART,
					patternId    : null,
					holidayId    : null,
					status       : null,
					startDate    : this.args.date,
					endDate      : this.args.date,
					exchangeDate : null,
					startTime    : teasp.util.time.clock2minutes(dojo.byId('dialogApplyStartTime' + contId).value),
					endTime      : teasp.util.time.clock2minutes(dojo.byId('dialogApplyEndTime'   + contId).value),
					note         : (dojo.byId('dialogApplyNote' + contId).value || null),
					contact      : null,
					afterFlag    : false
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
			if(req.apply.endTime > 2880){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003120')); // 48:00以降の時刻を設定できません
				return;
			}
			if(req.apply.endTime > this.dayWrap.getFixEndTime()){
				var msgId = (this.dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL ? 'tm10003117' : 'tm10003118'); // 終了時刻が所定の終業時刻より後にならないようにしてください or 終了時刻が休日出勤申請の終了時刻より後にならないようにしてください
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel(msgId));
				return;
			}
			var o = this.dayWrap.getDefaultEarlyStartRange(earlyWorkBorderTime, useEarlyWorkFlag);
			if(this.dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL && !this.dayWrap.isPlannedHoliday()){
				var t = teasp.util.time.rangeTime({ from: req.apply.startTime, to: req.apply.endTime }, [{ from: o.shiftStartTime, to: o.shiftEndTime }]);
				if(t > 0){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003210')); // 残業の時間は所定の始業～終業時間と重ならない時間帯を指定してください
					return;
				}
			}
			if(this.pouch.isRequireNote(teasp.constant.APPLY_KEY_EARLYSTART)
			&& !req.apply.note){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003680')); // 備考を入力してください
				return;
			}
			teasp.dialog.EmpApply.showError(contId, null);

			req.apply.afterFlag = this.getAfterFlag(teasp.constant.APPLY_KEY_EARLYSTART, req.apply.startDate, req.apply.startTime, req.apply.endTime);

			if(this.dayWrap.getInputLimit().flag){ // 直行・直帰申請あり
				// サーバへ送信
				this.requestDirectApply(contId, req, true);
			}else{
				// サーバへ送信
				this.requestSend(contId, req);
			}
		}));
	}
};
}