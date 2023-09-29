/**
 * 直行・直帰申請フォーム生成
 *
 * @param {string} key 申請キー
 * @param {Object} node フォームの親ノード
 * @param {string} contId IDに使用する番号
 */
teasp.dialog.EmpApply.prototype.createDirectForm = function(key, node, contId, applyObj, btnbox){
	var fix = (applyObj && teasp.constant.STATUS_FIX.contains(applyObj.status)) || this.isReadOnly();
	var inputClass = this.getInputClass(fix, applyObj);

	// 勤怠時刻修正申請で更新される可能性のある出退社時刻と入力済みの出退社時刻をマージ
	var robj = this.dayWrap.existWaitReviseTime() || {};
	var st = this.dayWrap.getStartTime(true, null, teasp.constant.C_REAL);
	var et = this.dayWrap.getEndTime(true, null, teasp.constant.C_REAL);
	robj.from = (typeof(st) == 'number' ? st : robj.from);
	robj.to   = (typeof(et) == 'number' ? et : robj.to  );

	var tbody = dojo.create('div', null, node);

	// 直行・直帰
	var row = dojo.create('div', { className:'empApply2Div' }, tbody);

	dojo.create('div', { className:'empApply2CL', innerHTML:teasp.message.getLabel('tk10004670') }, row); // 直行・直帰

	var cell = dojo.create('div', { className: 'empApply2VL' }, row);
	var div = dojo.create('div', { style:'margin:2px 10px 2px 2px;float:left;' }, cell);
	var label = dojo.create('label', null, div);
	var chk1 = dojo.create('input', { type: 'checkbox', style:'margin:2px;', id: 'dialogApplyDirectIn' + contId }, label); // 直行チェックボックス
	dojo.create('span', { innerHTML: teasp.message.getLabel('tk10004680'), style:'margin:2px;' }, label); // 直行

	div = dojo.create('div', { style:'margin:2px 10px 2px 2px;float:left' }, cell);
	label = dojo.create('label', null, div);
	var chk2 = dojo.create('input', { type: 'checkbox', style:'margin:2px;', id: 'dialogApplyDirectOut' + contId }, label); // 直帰チェックボックス
	dojo.create('span', { innerHTML: teasp.message.getLabel('tk10004690'), style:'margin:2px;' }, label); // 直帰

	dojo.create('div', { style:'clear:both;' }, cell);

	if(applyObj){
		chk1.checked = ((applyObj.directFlag & 1) != 0);
		chk2.checked = ((applyObj.directFlag & 2) != 0);
	}
	chk1.disabled = (applyObj ? (teasp.constant.STATUS_FIX.contains(applyObj.status) || !applyObj.active) : false);
	chk2.disabled = (applyObj ? (teasp.constant.STATUS_FIX.contains(applyObj.status) || !applyObj.active) : false);
	// 出社時刻が入力済み（または勤怠時刻修正申請により更新される可能性がある）の場合は「直行」を非活性にする
	if(!chk1.disabled && typeof(robj.from) == 'number'){
		chk1.checked = false;
		chk1.disabled = true;
	}
	// 退社時刻が入力済み（または勤怠時刻修正申請により更新される可能性がある）の場合は「直帰」を非活性にする
	if(!chk2.disabled && typeof(robj.to) == 'number'){
		chk2.checked = false;
		chk2.disabled = true;
	}

	// 期間
	var range = { from: this.args.date, to: this.getEndOfNormal(this.args.date) };
	this.createRangeParts(key, tbody, contId, applyObj, range);

	// 作業区分
	row = dojo.create('div', { className: 'empApply2Div' }, tbody);
	dojo.create('div', { className:'empApply2CL', innerHTML:teasp.message.getLabel('tk10004700') }, row); // 作業区分
	if(applyObj && (fix || !applyObj.active)){
		var m = (applyObj.workType || '');
		dojo.create('div', { innerHTML: m, style:'margin:2px;' }, dojo.create('div', { className:'empApply2VL' }, row));
		row.style.display = (m ? '' : 'none');
	}else{
		var select = dojo.create('select', { id: 'dialogApplyWorkType' + contId, className: 'inputran', style:'width:' + (teasp.isNarrow() ? 270 : 320) + 'px;margin:2px;' }, dojo.create('div', { className:'empApply2VL' }, row));
		var l = (this.pouch.getWorkTypeList() || []);
		dojo.create('option', { value: '', innerHTML: '' }, select);
		for(var i = 0 ; i < l.length ; i++){
			dojo.create('option', { value: l[i], innerHTML: l[i] }, select);
		}
		row.style.display = (l.length > 0 ? '' : 'none');
	}

	this.createNoteParts(key, tbody, contId, applyObj); // 備考

	// 前泊移動時間
	row = dojo.create('div', { className: 'empApply2Div' }, tbody);
	dojo.create('div', { className:'empApply2CL', innerHTML: teasp.message.getLabel('tk10004710') }, row); // 前泊移動時間
	var inp = dojo.create('input', { type:'text', id:'dialogApplyTravelTime' + contId, style:'margin:2px;', className:'inputime ' + inputClass }, dojo.create('div', { className:'empApply2VL' }, row));
	if(applyObj && typeof(applyObj.travelTime) == 'number'){
		inp.value = teasp.util.time.timeValue(applyObj.travelTime);
	}

	this.changeInputAreaView(inp, applyObj, fix);
	if(fix){
		inp.readOnly = 'readOnly';
	}else{
		this.eventHandles.push(dojo.connect(inp, 'blur'      , this, teasp.util.time.onblurTime    ));
		this.eventHandles.push(dojo.connect(inp, 'onkeypress', this, teasp.util.time.onkeypressTime));
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
			var req = {
				empId                  : this.pouch.getEmpId(),
				month                  : this.pouch.getYearMonth(),
				startDate              : this.pouch.getStartDate(),
				lastModifiedDate       : this.pouch.getLastModifiedDate(),
				date                   : this.args.date,
				apply                  : {
					id                 : (applyObj ? applyObj.id : null),
					name               : teasp.constant.APPLY_TYPE_DIRECT,
					applyType          : teasp.constant.APPLY_TYPE_DIRECT,
					patternId          : null,
					holidayId          : null,
					status             : null,
					startDate          : this.args.date,
					endDate            : this.args.date,
					exchangeDate       : null,
					startTime          : null,
					endTime            : null,
					note               : (dojo.byId('dialogApplyNote' + contId).value || null),
					contact            : null,
					directFlag         : 0,
					workType           : null,
					travelTime         : null
				}
			};

			var sd = teasp.util.strToDate(dojo.byId('dialogApplyStartDate' + contId).value);
			var ed = teasp.util.strToDate(dojo.byId('dialogApplyEndDate'   + contId).value);
			if(sd.failed != 0){
				teasp.dialog.EmpApply.showError(contId, dojo.replace(sd.tmpl, [teasp.message.getLabel('rangeStartDate_label')])); // 期間の開始日
				return;
			}
			dojo.byId('dialogApplyStartDate' + contId).value = sd.dater;
			if(ed.failed != 0){
				teasp.dialog.EmpApply.showError(contId, dojo.replace(ed.tmpl, [teasp.message.getLabel('rangeEndDate_label')])); // 期間の終了日
				return;
			}
			dojo.byId('dialogApplyEndDate' + contId).value = ed.dater;

			if(sd.datef != ed.datef){
				var maxd = this.getEndOfNormal(this.args.date);
				if(dojo.date.compare(sd.date, ed.date, 'date') > 0){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003300')); // 期間の設定が無効です
					return;
				}
				if(teasp.util.date.compareDate(ed.date, this.monthLastDate) > 0){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003320')); // 期間は今月度内で設定してください
					return;
				}
				if(teasp.util.date.compareDate(ed.date, maxd) > 0){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10004730')); // 直行・直帰申請の期間内に休日を含めることはできません。
					return;
				}
			}else{
				ed = sd;
			}
			req.apply.startDate = sd.datef;
			req.apply.endDate   = ed.datef;

			if(this.pouch.isRequireNote(teasp.constant.APPLY_KEY_DIRECT)
			&&(!req.apply.note || !req.apply.note.replace(/[\s　]+$/g,''))){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003680')); // 備考を入力してください
				return;
			}
			if(dojo.byId('dialogApplyDirectIn' + contId).checked){
				req.apply.directFlag |= 1;
			}
			if(dojo.byId('dialogApplyDirectOut' + contId).checked){
				req.apply.directFlag |= 2;
			}
			if(!req.apply.directFlag){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10004720')); // 直行、直帰どちらかまたは両方を選択してください。
				return;
			}
			if(req.apply.directFlag == 1){
				req.apply.name = teasp.message.getLabel('tk10004760', teasp.message.getLabel('tk10004680'));
			}else if(req.apply.directFlag == 2){
				req.apply.name = teasp.message.getLabel('tk10004760', teasp.message.getLabel('tk10004690'));
			}
			req.apply.workType = (dojo.byId('dialogApplyWorkType' + contId).value || null);

			var t = teasp.util.time.clock2minutes(dojo.byId('dialogApplyTravelTime' + contId).value);
			req.apply.travelTime = (typeof(t) == 'number' ? t : null);

			var directFlag = req.apply.directFlag;
			var rangeDays = teasp.util.date.getDateList(req.apply.startDate, req.apply.endDate);
			for(var i = 0 ; i < rangeDays.length ; i++){
				var k = rangeDays[i];
				var dw = this.pouch.getEmpDay(k);
				if(!teasp.logic.EmpTime.isFixDay(dw.getObj()) || dw.getObj().plannedHoliday || dw.isHolidayAll()){ // 休日である
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10004730')); // 直行・直帰申請の期間内に休日を含めることはできません。
					return;
				}
				if((directFlag & 1) && typeof(dw.getObj().startTime) == 'number'){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10004740')); // 期間内に出社時刻を入力済みの日があるため、直行を選択できません。
					return;
				}
				if((directFlag & 2) && typeof(dw.getObj().endTime) == 'number'){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10004750')); // 期間内に退社時刻を入力済みの日があるため、直帰を選択できません。
					return;
				}
				var ro = dw.existWaitReviseTime(); // 承認待ちの勤怠時刻修正申請で出退社時刻を更新する可能性があるものを取得
				if(ro && (directFlag & 1) && typeof(ro.from) == 'number'){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10005200')); // 期間内に承認待ちの勤怠時刻修正申請があるため、直行を選択できません。
					return;
				}
				if(ro && (directFlag & 2) && typeof(ro.to) == 'number'){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10005210')); // 期間内に承認待ちの勤怠時刻修正申請があるため、直帰を選択できません。
					return;
				}
			}

			if(directFlag & 2){ // 直帰あり
				var ld = this.pouch.getEmpDay(req.apply.endDate); // 終了日
				var tt = teasp.logic.EmpTime.filterTimeTable(ld.createTimeTableFix(directFlag), 1);
				if(tt.length && typeof(tt[0].to) == 'number' && tt[0].to > 1440){ // 終了日の退社時刻が24時を超える
					var nd = this.pouch.getEmpDay(teasp.util.date.addDays(req.apply.endDate, 1)); // 終了日の翌日
					var h = nd.getProhibitOverNightWorkHoliday(); // 休暇の延長勤務禁止＝オンの休暇申請がある
					if(h){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008360', h.name)); // {0}の前日は24:00を超える勤務はできません。
						return;
					}
				}
			}
			if(directFlag & 1){ // 直行あり
				var fd = this.pouch.getEmpDay(req.apply.startDate); // 開始日
				var tt = teasp.logic.EmpTime.filterTimeTable(fd.createTimeTableFix(directFlag), 1);
				if(tt.length && typeof(tt[0].from) == 'number'){
					var pd = this.pouch.getEmpDay(teasp.util.date.addDays(req.apply.startDate, -1)); // 開始日の前日
					if(pd && typeof(pd.getObj().endTime) == 'number' && (pd.getObj().endTime - 1440) > tt[0].from){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002060')); // 勤務時間が前日の勤務時間と重なっています
						return;
					}
				}
			}

			teasp.dialog.EmpApply.showError(contId, null);

			// サーバへ送信
			this.requestDirectApply(contId, req);
		}));
	}
};
