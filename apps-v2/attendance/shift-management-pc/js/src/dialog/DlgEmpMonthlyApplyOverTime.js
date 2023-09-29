/**
 * 月次残業申請フォーム生成
 *
 * @param {string} key 申請キー
 * @param {Object} node フォームの親ノード
 * @param {string} contId IDに使用する番号
 * @param {Object=} applyObj 申請データ
 */
teasp.dialog.EmpMonthlyApply.prototype.createMonthlyOverTimeForm = function(key, node, contId, applyObj, btnbox){
	var fix = (applyObj && teasp.constant.STATUS_FIX.contains(applyObj.status) || this.isReadOnly());
	var inputClass = this.getInputClass(fix, applyObj);
	var tbody = dojo.create('div', null, node);

	// 過不足時間
	var row = dojo.create('div', { id: 'dialogMonthlyOverTimeRow' + contId, className: 'empApply2Div' }, tbody);
	dojo.create('div', {
		className : 'empApply2CL',
		innerHTML : teasp.message.getLabel('tf10010290') // 当月過不足時間
	}, row);
	dojo.create('div', {
		id        : 'dialogMonthlyOverTime' + contId,
		style     : 'margin:4px;',
		className : 'empApply2VL',
		innerHTML : this.pouch.getAmountTimeForApply(applyObj)
	}, row);
	// 見込み残業時間
	var row = dojo.create('div', { id: 'dialogApplyTimeRow' + contId, className:'empApply2Div' }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML:teasp.message.getLabel('mo00000006') }, row); // 見込み残業時間
	var inp = dojo.create('input', {
		type: 'text',
		id: 'dialogApplyTime' + contId,
		style: "margin:2px;width:60px;",
		maxLength: 6,
		className: 'inputime ' + inputClass
	}, dojo.create('div', { className:'empApply2VL' }, row));
	if(applyObj){
		inp.value = teasp.util.time.timeValue(applyObj.estimatedOverTime, this.timeForm);
		if(teasp.constant.STATUS_FIX.contains(applyObj.status) || this.isReadOnly()){
			inp.readOnly = 'readOnly';
		}
		this.changeInputAreaView(inp, applyObj, fix);
	}

	this.createNoteParts     (key, tbody, contId, applyObj); // 備考
	this.createApplySetParts (key, tbody, contId, applyObj); // 承認者設定
	this.createApplyTimeParts(key, tbody, contId, applyObj); // 申請日時
	this.createStatusParts   (key, tbody, contId, applyObj); // 状況
	this.createErrorParts    (key, tbody, contId); // エラーメッセージ出力エリア
	this.createWarnParts     (key, tbody, contId); // 警告メッセージ出力エリア

	if(applyObj && !this.pouch.isValidMonthlyOverTimeApply(applyObj)){
		teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('mo00000013')); // 月次残業申請の使用設定は解除されているため、この申請は無効です。
	}

	if(btnbox){
		dojo.place(btnbox, tbody);
	}

	// 時刻入力時の補正
	dojo.query('.inputime', dojo.byId('dialogApplyTimeRow' + contId)).forEach(function(elem) {
		this.eventHandles.push(dojo.connect(elem, 'blur'      , this, teasp.util.time.onblurTime));
		this.eventHandles.push(dojo.connect(elem, 'onkeypress', this, teasp.util.time.onkeypressTime));
	}, this);

	this.drawLast(applyObj, node);

	// 申請ボタンが押された時の処理
	var btnOk = dojo.byId('empApplyDone' + contId);
	if(btnOk){
		this.eventHandles.push(dojo.connect(btnOk, 'onclick', this, function(e){
			this.submitMonthlyOverTime(contId, applyObj);
		}));
	}
};
teasp.dialog.EmpMonthlyApply.prototype.submitMonthlyOverTime = function(contId, applyObj){
	var t = teasp.util.time.clock2minutes(dojo.byId('dialogApplyTime' + contId).value);
	if(t === undefined){
		teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('mo00000007')); // 見込み残業時間を入力してください。
		return;
	}
	if(t < 0 || t > 59999){
		teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('mo00000008')); // 見込み残業時間は 0:00～999:59 の間で入力してください。
		return;
	}
	var req = {
		empId            : this.pouch.getEmpId(),
		month            : this.pouch.getYearMonth(),
		startDate        : this.pouch.getStartDate(),
		lastModifiedDate : this.pouch.getLastModifiedDate(),
		apply            : {
			id           : (applyObj ? applyObj.id : null),
			applyType    : teasp.constant.APPLY_TYPE_MONTHLYOVERTIME,
			estimatedOverTime: t,
			note         : (dojo.byId('dialogApplyNote' + contId).value || null)
		}
	};
	if(this.pouch.isRequireNote(teasp.constant.APPLY_KEY_MONTHLYOVERTIME)
	&&(!req.apply.note || !req.apply.note.replace(/[\s　]+$/g,''))){
		teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003680')); // 備考を入力してください
		return;
	}
	this.requestSend(contId, req);
};

