/**
 * 早退申請フォーム生成
 *
 * @param {string} key 申請キー
 * @param {Object} node フォームの親ノード
 * @param {string} contId IDに使用する番号
 */
teasp.dialog.EmpApply.prototype.createEarlyEndForm = function(key, node, contId, applyObj, btnbox){
	var fix = (applyObj && teasp.constant.STATUS_FIX.contains(applyObj.status)) || this.isReadOnly();
	var inputClass = this.getInputClass(fix, applyObj);

	var tbody = dojo.create('div', null, node);

	// 退社時刻
	var row = dojo.create('div', { id: 'dialogApplyTimeRow' + contId, className:'empApply2Div' }, tbody);
	dojo.create('div', { className:'empApply2CL', innerHTML:teasp.message.getLabel('endTime_label') }, row); // 退社時刻
	var inp = dojo.create('input', { type:'text', id:'dialogApplyTime' + contId, style:"margin:2px;", className:'inputime ' + inputClass }, dojo.create('div', { className:'empApply2VL' }, row));
	if(applyObj){
		inp.value = teasp.util.time.timeValue(applyObj.startTime, this.timeForm);
		if(teasp.constant.STATUS_FIX.contains(applyObj.status) || this.isReadOnly()){
			inp.readOnly = 'readOnly';
		}
		this.changeInputAreaView(inp, applyObj, fix);
	}else{
		var et = this.dayWrap.getEndTime(true, null, teasp.constant.C_REAL);
		if(et){
			inp.value = teasp.util.time.timeValue(et, this.timeForm);
		}
	}

	this.createNoteParts(key, tbody, contId, applyObj, teasp.message.getLabel('reason_label')); // 理由
	if((fix && applyObj && applyObj.treatDeduct) || this.pouch.isUseOwnReasonEarlyEnd()){ // "自己都合による"チェックボックスを使用
		row  = dojo.create('div', { id:'dialogApplyEarlyEscapeRow' + contId, className:'empApply2Div' }, tbody);
		dojo.create('div', { className:'empApply2CL' }, row);
		var label = dojo.create('label', { style:"margin:4px 2px;" }, dojo.create('div', { className:'empApply2VL' }, row));
		inp = dojo.create('input', { type: 'checkbox', id: 'dialogApplyEarlyEscape' + contId }, label);
		label.appendChild(dojo.doc.createTextNode(teasp.message.getLabel('tm10003330'))); // 自己都合による
		label.title = teasp.message.getLabel('tm10003341'); // 自己都合による早退の場合は、チェックしてください。
		inp.checked = (applyObj ? applyObj.ownReason : true);
		inp.disabled = (applyObj ? teasp.constant.STATUS_FIX.contains(applyObj.status) : false);
	}

	this.createApplySetParts (key, tbody, contId, applyObj); // 承認者設定
	this.createApplyTimeParts(key, tbody, contId, applyObj); // 申請日時
	this.createStatusParts   (key, tbody, contId, applyObj); // 状況
	this.createErrorParts    (key, tbody, contId); // エラーメッセージ出力エリア

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
			var t = teasp.util.time.clock2minutes(dojo.byId('dialogApplyTime' + contId).value);
			if(t === undefined){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003350')); // 時刻を入力してください
				return;
			}
			var et = this.dayWrap.getBorderTime().et;
			if(et < 0 || et <= t){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003370', teasp.util.time.timeValue(et, this.timeForm))); // 入力された時刻は早退に該当しません（定時：{0}）
				return;
			}
			var chk = dojo.byId('dialogApplyEarlyEscape' + contId);
			var req = {
				empId            : this.pouch.getEmpId(),
				month            : this.pouch.getYearMonth(),
				startDate        : this.pouch.getStartDate(),
				lastModifiedDate : this.pouch.getLastModifiedDate(),
				date             : this.args.date,
				apply            : {
					id           : (applyObj ? applyObj.id : null),
					applyType    : teasp.constant.APPLY_TYPE_EARLYEND,
					patternId    : null,
					holidayId    : null,
					status       : null,
					startDate    : this.args.date,
					endDate      : this.args.date,
					exchangeDate : null,
					startTime    : t,
					endTime      : et,
					note         : (dojo.byId('dialogApplyNote' + contId).value || null),
					contact      : null,
					ownReason    : (chk ? chk.checked : false),
					treatDeduct  : this.pouch.getTreatEarlyEnd()
				}
			};
			chk = null;
			if(this.pouch.isRequireNote(teasp.constant.APPLY_KEY_EARLYEND)
			&& (!req.apply.note || !req.apply.note.replace(/[\s　]+$/g,''))){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003690')); // 理由を入力してください
				return;
			}
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

