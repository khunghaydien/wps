/**
 * シフト振替申請フォーム生成
 *
 * @param {string} key 申請キー
 * @param {Object} node フォームの親ノード
 * @param {string} contId IDに使用する番号
 * @param {Object=} applyObj 申請データ
 */
teasp.dialog.EmpApply.prototype.createShiftChangeForm = function(key, node, contId, applyObj, btnbox){
	var fix = (applyObj && teasp.constant.STATUS_FIX.contains(applyObj.status)) || this.isReadOnly();
	var inputClass = this.getInputClass(fix, applyObj);

	var tbody = dojo.create('div', null, node);

	// 振替日
	var row = dojo.create('div', { id: 'dialogApplyShiftChangeRow' + contId, className: 'empApply2Div' }, tbody);
	dojo.create('div', {
		className: 'empApply2CL',
		innerHTML: teasp.message.getLabel('exchangeDate_label')
	}, row); // 振替日

	var candidates = this.pouch.getShiftChangeableDates(this.args.date);

	if(applyObj && fix){
		var pair = teasp.message.getLabel('tm10003240', teasp.util.date.formatDate(applyObj.startDate, 'M/d+'), teasp.util.date.formatDate(applyObj.exchangeDate, 'M/d+')); // {0} ⇔ {1}
		dojo.create('div', {
			className: 'empApply2VL',
			innerHTML: pair,
			style: { margin:"4px" }
		}, row);
	}else{
		var ctb = dojo.create('tbody' , null, dojo.create('table' , { className: 'pane_table' }, dojo.create('div', { className: 'empApply2VL' }, row)));
		var cr  = dojo.create('tr', null, ctb);
		var cc  = dojo.create('td', null, cr);
		var inp = dojo.create('input', { type: 'text', id: 'dialogApplyShiftChangeDate' + contId, style: { margin:"2px" }, className: 'inpudate ' + inputClass }, cc);
		if(applyObj){
			inp.value = teasp.util.date.formatDate(applyObj.exchangeDate, 'SLA');
		}
		cc   = dojo.create('td', null, cr);
		var btn = dojo.create('input', { type: 'button', id: 'dialogApplyShiftChangeDateCal' + contId, style: { margin:"2px" }, className: 'pp_base pp_btn_cal' }, cc);
		// カレンダーボタンが押された時の処理
		this.eventHandles.push(dojo.connect(btn, 'onclick', this, function(e){
			this.calendarShiftChange(contId, candidates);
		}));
	}

	this.createNoteParts     (key, tbody, contId, applyObj); // 備考
	this.createContactParts  (key, tbody, contId, applyObj); // 連絡先
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
			this.submitShiftChange(contId, applyObj, candidates)
		}));
	}
};

/**
 * カレンダーを開く
 * @param {number} contId
 * @param {Object} candidates 振替候補日情報
 */
teasp.dialog.EmpApply.prototype.calendarShiftChange = function(contId, candidates){
	var ind = teasp.util.date.parseDate(dojo.byId('dialogApplyShiftChangeDate' + contId).value); // 振替日の入力値を取得
	var bd = (ind || this.args.date);
	teasp.manager.dialogOpen(
		'Calendar',
		{
			date               : bd,
			isDisabledDateFunc : dojo.hitch(this, function(d) {
				var dk = teasp.util.date.formatDate(d);
				if(this.args.date == dk){
					return false;
				}
				var candidate = candidates[dk];
				return (candidate && candidate.changeable ? false : true);
			})
		},
		null,
		this,
		function(o){
			dojo.byId('dialogApplyShiftChangeDate' + contId).value = teasp.util.date.formatDate(o, 'SLA');
			teasp.dialog.EmpApply.showError(contId, null);
		}
	);
};

/**
 * 申請実行
 * @param {number} contId
 * @param {Object} applyObj 申請データ
 * @param {Object} candidates 振替候補日情報
 */
teasp.dialog.EmpApply.prototype.submitShiftChange = function(contId, applyObj, candidates){
	var req = {
		empId            : this.pouch.getEmpId(),
		month            : this.pouch.getYearMonth(),
		startDate        : this.pouch.getStartDate(),
		lastModifiedDate : this.pouch.getLastModifiedDate(),
		date             : this.args.date,
		apply            : {
			id           : (applyObj ? applyObj.id : null),
			applyType    : teasp.constant.APPLY_TYPE_SHIFTCHANGE,
			startDate    : this.args.date,
			endDate      : this.args.date,
			note         : (dojo.byId('dialogApplyNote'    + contId).value || null),
			contact      : (dojo.byId('dialogApplyContact' + contId).value || null)
		}
	};
	var ed = teasp.util.strToDate(dojo.byId('dialogApplyShiftChangeDate' + contId).value);
	if(ed.failed != 0){
		teasp.dialog.EmpApply.showError(contId, dojo.replace(ed.tmpl, [teasp.message.getLabel('exchangeDate_label')])); // 振替日
		return;
	}
	dojo.byId('dialogApplyShiftChangeDate' + contId).value = ed.dater;
	req.apply.exchangeDate = ed.datef;
	var exDayWrap = this.pouch.getEmpDay(req.apply.exchangeDate);

	// シフト振替可能な日かチェック
	if(!this.checkShiftChangeable(contId, this.dayWrap, exDayWrap, candidates)){
		return;
	}

	// 振替元・先双方の他の申請の存在をチェック
	if(!this.checkOtherApplyAtShiftChange(contId, applyObj, this.dayWrap, exDayWrap)){
		return;
	}

	// 振替の結果、休日になる方に出退時刻が入力されている場合、クリア警告を出す
	var mkey = null;
	if(exDayWrap){
		if(this.pouch.isDayInMonth(req.apply.startDate) && this.pouch.isDayInMonth(req.apply.exchangeDate)){
			var cw1 = (this.pouch.getObj().works ? this.pouch.getClassifyJobWorks(req.apply.startDate)    : null);
			var cw2 = (this.pouch.getObj().works ? this.pouch.getClassifyJobWorks(req.apply.exchangeDate) : null);
			if((cw1 && (cw1.sumTime > 0 || cw1.sumVolume > 0)) || (cw2 && (cw2.sumTime > 0 || cw2.sumVolume > 0))){
				mkey = 'tm10003280';
			}
			if((this.dayWrap.getDayType() === 0 && exDayWrap.getDayType() !== 0 && this.dayWrap.isInputTime()) ||
			   (this.dayWrap.getDayType() !== 0 && exDayWrap.getDayType() === 0 && exDayWrap.isInputTime())){
				mkey = 'tm10003280';
			}
		}else{
			mkey = 'tm10003192';
		}
	}
	if(this.pouch.isRequireNote(teasp.constant.APPLY_KEY_SHIFTCHANGE)
	&& (!req.apply.note || !req.apply.note.replace(/[\s　]+$/g,''))){
		teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003680')); // 備考を入力してください
		return;
	}
	if(mkey){
		// 入力された時間をクリアします。よろしいですか？
		teasp.manager.dialogOpen('MessageBox', {
			title   : teasp.message.getLabel('em10002080'), // 確認
			message : teasp.message.getLabel(mkey)
		}, this.pouch, this, function(){
			// サーバへ送信
			this.requestSend(contId, req);
		});
	}else{
		// サーバへ送信
		this.requestSend(contId, req);
	}
};

/**
 * シフト申請可能かチェック
 * @param {number} contId
 * @param {teasp.data.EmpDay} dw
 * @param {teasp.data.EmpDay} ew
 * @param {Object} candidates
 * @returns {Boolean}
 */
teasp.dialog.EmpApply.prototype.checkShiftChangeable = function(contId, dw, ew, candidates){
	var candidate = candidates[ew.getKey()];
	if(!candidate || candidate.out == 1){
		teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10011280')); // 振替日は同月同週内に限ります。
		return false;
	}else if(!candidate.changeable){
		var msg = '';
		if(candidate.out){
			msg = teasp.message.getLabel('tm10003260'); // 振替先は無効です
		}else if(!candidate.validShiftSet){
			msg = teasp.message.getLabel('tf10011290'); // 振替日にはシフト設定日を指定してください。
		}else{
			msg = teasp.message.getLabel('tm10003260'); // 振替先は無効です
		}
		teasp.dialog.EmpApply.showError(contId, msg);
		return false;
	}
	return true;
};

/**
 * 他の申請の存在をチェック
 * @param {number} contId
 * @param {Object} applyObj
 * @param {teasp.data.EmpDay} dw
 * @param {teasp.data.EmpDay} ew
 * @param {boolean} flag true:取消時 false:申請時
 * @returns {Boolean}
 */
teasp.dialog.EmpApply.prototype.checkOtherApplyAtShiftChange = function(contId, applyObj, dw, ew, flag){
	// 振替元日の他の申請をチェック
	var dng = this.getApplyListByDate(dw, []);
	var d1 = teasp.util.date.formatDate(dw.getKey(), 'M/d');
	var d2 = teasp.util.date.formatDate(ew.getKey(), 'M/d');
	var swp = (this.args.date != dw.getKey());
	if(dng.ngs.length){
		var nms = teasp.dialog.EmpApply.getApplyTypesName(dng.ngs);
		teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel((swp ? 'tm10003270' :'tm10003040'), d1, nms)); // 先に{1}を取り消してください
		return false;
	}else if(dng.waits.length){
		teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel(
				(flag ? 'tf10011310' : 'tf10011300'), // {0}に承認待ちの勤怠時刻修正申請があるため申請できません or 取り消しできません
				d1));
		return false;
	}
	// 振替先日の他の申請をチェック
	var eng = this.getApplyListByDate(ew, []);
	if(eng.ngs.length){
		var nms = teasp.dialog.EmpApply.getApplyTypesName(eng.ngs);
		teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel((swp ? 'tm10003040' : 'tm10003270'), d2, nms)); // 先に {0} の{1}を取り消してください
		return false;
	}else if(eng.waits.length){
		teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel(
				(flag ? 'tf10011310' : 'tf10011300'), // {0}に承認待ちの勤怠時刻修正申請があるため申請できません or 取り消しできません
				d2));
		return false;
	}
	return true;
};

/**
 * 当日の申請リストを取得
 * @param {teasp.data.EmpDay} dw
 * @param {Array.<string>} excludes 無視リスト（申請種類名の配列）
 * @returns {Object}
 */
teasp.dialog.EmpApply.prototype.getApplyListByDate = function(dw, excludes){
	var res = {
		ngs: [],
		waits: []
	};
	var applys = dw.getEmpApplyList();
	for(var i = 0 ; i < applys.length ; i++){
		var a = applys[i];
		// 無視リストにある、承認済みの勤怠時刻修正申請、シフト設定は除外
		if(excludes.contains(a.applyType)
		|| a.applyType == teasp.constant.APPLY_TYPE_SHIFTCHANGE
		|| (a.applyType == teasp.constant.APPLY_TYPE_REVISETIME && teasp.constant.STATUS_APPROVES.contains(a.status))
		|| (a.applyType == teasp.constant.APPLY_TYPE_PATTERNS && a.decree)
		){
			continue;
		}
		if(a.applyType == teasp.constant.APPLY_TYPE_REVISETIME){
			res.waits.push(a);
		}else if(teasp.constant.STATUS_FIX.contains(a.status)){
			res.ngs.push(a);
		}
	}
	var holidayExcludes = dw.getHolidayExcludes();
	if(holidayExcludes.length){
		res.ngs.push(holidayExcludes[0]);
	}
	return res;
};
