/**
 * 日次確定申請フォーム生成
 *
 * @param {string} key 申請キー
 * @param {Object} node フォームの親ノード
 * @param {string} contId IDに使用する番号
 */
teasp.dialog.EmpApply.prototype.createDailyForm = function(key, node, contId, applyObj, btnbox){
	var tip = this.dayWrap.getDaySummary();

	var accLog = this.pouch.isInputAccessControl();
	var tbody = dojo.create('div', null, node);

	var row = dojo.create('div', { className: 'empApply2Div in-out' }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('startEndTime_label') }, row);
	dojo.create('div', { className: 'empApply2VL valfont', style:'vertical-align:top;margin-top:4px;', innerHTML: (tip.st || '') + '-' + (tip.et || '') }, row);

	row = dojo.create('div', { className: 'empApply2Div' }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('restTime_label') }, row);
	dojo.create('div', { className: 'empApply2VL valfont', innerHTML: tip.restSpan }, row);

	row = dojo.create('div', { className: 'empApply2Div' }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('wholeTime_label') }, row);
	dojo.create('div', { className: 'empApply2VL valfont', innerHTML: teasp.util.time.timeValue(tip.workWholeTime) }, row);

	row = dojo.create('div', { className: 'empApply2Div' }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel(tip.workNetTime != tip.workRealTime ? 'tm10009230' : 'workRealTime_label') }, row);
	dojo.create('div', { className: 'empApply2VL valfont', innerHTML: teasp.util.time.timeValue(tip.workNetTime) }, row);

	this.createNoteParts(key, tbody, contId, applyObj); // 備考

	if(accLog){ // 入退館管理対象者
		row = dojo.create('div', { className: 'empApply2Div' }, tbody);
		dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('ac00000210') }, row); // 入館乖離理由
		dojo.create('div', { className: 'empApply2VL valfont', innerHTML: this.dayWrap.getEnterDivergenceReason(false) }, row);
		row = dojo.create('div', { className: 'empApply2Div' }, tbody);
		dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('ac00000220') }, row); // 退館乖離理由
		dojo.create('div', { className: 'empApply2VL valfont', innerHTML: this.dayWrap.getExitDivergenceReason(false) }, row);

		var inout = dojo.query('.in-out', tbody)[0];
		var area = (teasp.isNarrow() ? null : dojo.create('div', {
			className:(teasp.isNarrow() ? 'empApply2Div' : 'empApply2VL'),
			style:'margin-left:' + (teasp.isNarrow() ? 20 : 60) + 'px;'
		}, inout));

		row = dojo.create('div', { className: 'empApply2Div' }, (area ? area : inout), (area ? 'last' : 'after'));
		var divin = dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('ac00000250') }, row); // 入館
		dojo.create('div', { className: 'empApply2VL', style:'width:48px;',       innerHTML: this.dayWrap.getEnterTime()          }, row);
		dojo.create('div', { className: 'empApply2VL', style:'margin-left:20px;', innerHTML: this.dayWrap.getEnterDivergence()    }, row);
		if(!teasp.isNarrow()){
			dojo.style(divin, 'width', '60px');
			dojo.style(divin, 'min-width', '60px');
		}

		row = dojo.create('div', { className: 'empApply2Div' }, (area ? area : row), (area ? 'last' : 'after'));
		var divout = dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('ac00000260') }, row); // 退館
		dojo.create('div', { className: 'empApply2VL', style:'width:48px;',       innerHTML: this.dayWrap.getExitTime()           }, row);
		dojo.create('div', { className: 'empApply2VL', style:'margin-left:20px;', innerHTML: this.dayWrap.getExitDivergence()     }, row);
		if(!teasp.isNarrow()){
			dojo.style(divout, 'width', '60px');
			dojo.style(divout, 'min-width', '60px');
		}
	}

	this.createApplySetParts (key, tbody, contId, applyObj); // 承認者設定
	this.createApplyTimeParts(key, tbody, contId, applyObj); // 申請日時
	this.createStatusParts   (key, tbody, contId, applyObj); // 状況
	this.createErrorParts    (key, tbody, contId); // エラーメッセージ出力エリア

	if(btnbox){
		dojo.place(btnbox, tbody);
	}

	this.drawLast(applyObj, node);

	// 申請ボタンが押された時の処理
	var btnOk = dojo.byId('empApplyDone' + contId);
	if(btnOk){
		this.eventHandles.push(dojo.connect(btnOk, 'onclick', this, function(e){
			var o = this.dayWrap.canSelectDailyEx(1);
			if(!o.flag){
				teasp.dialog.EmpApply.showError(contId, o.reason, true);
				return;
			}
			var req = {
				empId            : this.pouch.getEmpId(),
				month            : this.pouch.getYearMonth(),
				startDate        : this.pouch.getStartDate(),
				lastModifiedDate : this.pouch.getLastModifiedDate(),
				date             : this.args.date,
				apply            : {
					id           : (applyObj ? applyObj.id : null),
					applyType    : teasp.constant.APPLY_TYPE_DAILY,
					patternId    : null,
					holidayId    : null,
					status       : null,
					startDate    : this.args.date,
					endDate      : this.args.date,
					exchangeDate : null,
					startTime    : null,
					endTime      : null,
					note         : (dojo.byId('dialogApplyNote' + contId).value || null),
					contact      : null
				}
			};
			if(this.pouch.isRequireNote(teasp.constant.APPLY_KEY_DAILY)
			&& (!req.apply.note || !req.apply.note.replace(/[\s　]+$/g,''))){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003680')); // 備考を入力してください
				return;
			}
			// サーバへ送信
			this.requestSend(contId, req);
		}));
	}
};

