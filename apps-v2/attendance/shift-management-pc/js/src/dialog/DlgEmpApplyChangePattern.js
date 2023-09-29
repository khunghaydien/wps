/**
 * 勤務時間変更申請フォーム生成
 *
 * @param {string} key 申請キー
 * @param {Object} node フォームの親ノード
 * @param {string} contId IDに使用する番号
 * @param {Object=} applyObj 申請データ
 */
teasp.dialog.EmpApply.prototype.createChangePatternForm = function(key, node, contId, applyObj, btnbox){
	var fix = (applyObj && (teasp.constant.STATUS_FIX.contains(applyObj.status) || applyObj.startDate != this.args.date)) || this.isReadOnly();
	var inputClass = this.getInputClass(fix, applyObj);

	var pslist = this.patternSList;
	var pllist = this.patternLList;
	var patternList = pslist.concat(pllist);

	var pas = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNS);
	var pal = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNL);

	if(pas){ // 短期間用勤務パターン変更申請済み
		pslist = [];
	}
	if(pal){ // 長期間用勤務パターン変更申請済み
		pllist = [];
	}

	var tbody = dojo.create('div', null, node);
	var changedDayType = null;
	var hidePattern = false;
	var p = this.dayWrap.getPattern();
	if(!fix){
		if(this.pouch.isProhibitWorkShiftChange()
		&& (!this.pouch.isUseChangeShift() || !p || !p.id)){
			hidePattern = true;
		}
		if(!patternList.length){
			hidePattern = true;
		}
	}

	// 個人単位で平日・休日を設定できる
	if(!this.dayWrap.isPlannedHoliday() && (this.pouch.isChangeDayType() || (fix && applyObj && applyObj.dayType !== null))){
		var row = dojo.create('div', { className: 'empApply2Div' }, tbody);
		dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('dayType_label') }, row); // 平日/休日の切替
		if(fix && applyObj){
			dojo.create('div', {
				innerHTML: this.pouch.getDisplayDayType(applyObj.dayType, teasp.message.getLabel('tm10003890')),
				style    : 'margin:2px;'
			}, dojo.create('div', {
				className: 'empApply2VL'
			}, row));
		}else{
			var div = dojo.create('div', {
				className: 'empApply2VL'
			}, row);
			var select = dojo.create('select', {
				id       : 'dlgApplyDayType' + contId,
				className: inputClass,
				style    : 'margin:2px 12px 2px 2px;'
			}, div);

			// 非勤務日の場合、所定休日と法定休日を選択するUIを表示
			var opts = dojo.create('div', { id:'dlgApplyDayTypeOption' + contId, style:'display:none;margin:0px;' }, div);
			var lb1 = dojo.create('label', { style:'margin-right:8px;' }, opts);
			var lb2 = dojo.create('label', { style:'margin-right:8px;' }, opts);
			var dayType1 = dojo.create('input',{ type:'radio', name:'dayTypeOption', style:'margin:2px;', id:'dayTypeRegularHoliday' }, lb1);
			dojo.create('span', { innerHTML:teasp.message.getLabel('fixHoliday_label')   }, lb1); // 所定休日
			var dayType2 = dojo.create('input',{ type:'radio', name:'dayTypeOption', style:'margin:2px;', id:'dayTypeLegalHoliday'   }, lb2);
			dojo.create('span', { innerHTML:teasp.message.getLabel('legalHoliday_label') }, lb2); // 法定休日
			if(this.pouch.isAllowSelectionOfLegalHoliday()){
				if(applyObj && applyObj.dayType == '2'){
					dayType2.checked = true;
				}else{
					dayType1.checked = true;
				}
			}

			dojo.create('option', { value: '-', innerHTML: teasp.message.getLabel('tm10003890')        }, select);
			dojo.create('option', { value: '0', innerHTML: teasp.message.getLabel('normalDay_label')   }, select);
			dojo.create('option', { value: '1', innerHTML: teasp.message.getLabel('notWorkDay_label')  }, select);
			var v = (applyObj ? (applyObj.dayType || '-') : '-');
			select.value = (v == '2' ? '1' : v);
			changedDayType = dojo.hitch(this, function(){
				var dtyp = dojo.byId('dlgApplyDayType' + contId).value;
				if(!hidePattern){
					dojo.style(dojo.byId('dlgApplyPatternRow' + contId), 'display', (dtyp == '1' ? 'none' : ''));
					dojo.style(dojo.byId('dialogApplyTimeRow' + contId), 'display', (dtyp == '1' ? 'none' : ''));
				}
				teasp.dialog.EmpApply.adjustContentHeight();
				if(this.pouch.isAllowSelectionOfLegalHoliday()){
					dojo.style(dojo.byId('dlgApplyDayTypeOption' + contId), 'display', (dtyp == '1' ? (teasp.isNarrow() ? 'block' : 'inline-block') : 'none'));
				}
			});
			this.eventHandles.push(dojo.connect(select, 'onchange', this, changedDayType));
		}
	}

	// 勤務パターン
	var row = dojo.create('div', { id:'dlgApplyPatternRow' + contId, className: 'empApply2Div' }, tbody);
	dojo.create('div', { className:'empApply2CL', innerHTML:teasp.message.getLabel('patterns_label') }, row); // 勤務パターン

	var nameDiv = dojo.create('div', { className: 'empApply2VL' }, row);
	if(applyObj && (fix || !applyObj.active)){
		dojo.create('div', { innerHTML: (applyObj.pattern ? applyObj.pattern.name : ''), style: { margin:"2px" } }, nameDiv);
	}else{
		var cta = dojo.create('table', { className:'pane_table', style:'width:' + (teasp.isNarrow() ? 260 : 300) + 'px;' }, nameDiv);
		var ctb = dojo.create('tbody' , null, cta);
		var cr  = dojo.create('tr'    , null, ctb);
		var select = dojo.create('select', { id:'dlgApplyPatternList' + contId, className:inputClass, style:'width:100%;' }, dojo.create('td', null, cr));
		dojo.create('option', { value: '-', innerHTML: (this.pouch.isChangeDayType() ? teasp.message.getLabel('tm10003890') : '') }, select);
		if(pslist.length > 0){
			if(pllist.length > 0){
				dojo.create('option', { value: 'S', innerHTML: teasp.message.getLabel('tm10003900') }, select);
			}
			for(var i = 0 ; i < pslist.length ; i++){
				dojo.create('option', { value: pslist[i].id, innerHTML: '&nbsp;' + pslist[i].name }, select);
			}
		}
		if(pllist.length > 0){
			if(pslist.length > 0){
				dojo.create('option', { value: 'L', innerHTML: teasp.message.getLabel('tm10003910') }, select);
			}
			for(var i = 0 ; i < pllist.length ; i++){
				dojo.create('option', { value: pllist[i].id, innerHTML: '&nbsp;' + pllist[i].name }, select);
			}
		}
		if(this.pouch.isProhibitWorkShiftChange()){ // 勤務パターンの指定不可
			var p = this.dayWrap.getPattern();
			if(p && p.id){
				var x = -1;
				for(var i = 0 ; i < patternList.length ; i++){
					if(p.id == patternList[i].id){
						x = i;
						break;
					}
				}
				if(x < 0){
					dojo.create('option', { value: p.id, innerHTML: '&nbsp;' + p.name }, select);
				}else{
					select.value = p.id;
				}
			}
			dojo.setAttr(select, 'disabled', true);
		}else{
			if(applyObj){
				select.value = (applyObj.pattern ? applyObj.pattern.id : '-'); // 休暇種類
			}
			dojo.setAttr(select, 'disabled', false);
		}
	}

	// 期間
	var range = this.pouch.getDateRangeOfMonth(this.args.date, 3, -1); // 今月～3か月後の日付を得る
	range.from = this.args.date;
	if(this.pouch.isProhibitAcrossMonthApply()){ // 申請期間が月度をまたぐ申請を禁止する
		range.to = this.monthLastDate;
	}
	this.createRangeParts(key, tbody, contId, applyObj, range);

	this.displayOnOff('dialogApplyRangeRow' + contId, !this.pouch.isProhibitWorkShiftChange());

	var changedTime = function(){
		// 入力した開始・終了時刻から所定勤務時間を得る
		var st = teasp.util.time.clock2minutes(dojo.byId('dialogApplyStartTime' + contId).value);
		var et = teasp.util.time.clock2minutes(dojo.byId('dialogApplyEndTime' + contId).value);
		var o = getPatternById(dojo.byId('dlgApplyPatternList' + contId).value);
		var msg = '';
		if(o && st !== undefined && et !== undefined && st < et && et <= 2880){
			var restTimes = dojo.clone((o && o.restTimes) || []);
			if(o.enableRestTimeShift && st != o.stdStartTime){ // シフト開始時刻に合わせて、所定休憩と半休の時間帯をずらす＝オン かつ 開始時刻！＝始業時刻
				var diff = st - o.stdStartTime;
				for(var i = 0 ; i < restTimes.length ; i++){
					restTimes[i].from += diff;
					restTimes[i].to   += diff;
				}
			}
			var rsum = teasp.util.time.rangeTime({ from: st, to: et }, restTimes);
			var t = et - st - rsum;
			if(t < 0){
				t = 0;
			}
			var lg = this.pouch.getLegalTimeOfDay(); // 法定労働時間
			var fo = o.standardFixTime || 0; // 所定労働時間
			var wsys = this.pouch.getWorkSystem();
			if(wsys == teasp.constant.WORK_SYSTEM_FLEX){ // フレックスタイム制
				if(this.pouch.isFlexFixTime() || o.disableCoreTime){
					msg = teasp.message.getLabel('tk10001180' // （コアタイム時間 {0}）
							, (o.disableCoreTime ? teasp.message.getLabel('tm10010150') : teasp.util.time.timeValue(t)));
				}else{
					msg = teasp.message.getLabel('tf10004740' // （所定勤務時間 {0} コアタイム時間 {1}）
							, teasp.util.time.timeValue(fo)
							, teasp.util.time.timeValue(t));
				}
			}else if(o.useDiscretionary && wsys != teasp.constant.WORK_SYSTEM_MANAGER){
				if(!o.workTimeChangesWithShift){ // 所定労働時間連動しない
					msg = teasp.message.getLabel('tf10004750'   // （所定勤務時間 {0} みなし労働時間 {1}）
							, teasp.util.time.timeValue(fo), teasp.util.time.timeValue(fo));
				}else{
					msg = teasp.message.getLabel('tf10004750'   // （所定勤務時間 {0} みなし労働時間 {1}）
							, teasp.util.time.timeValue(Math.min(t, fo)), teasp.util.time.timeValue(t));
				}
			}else{
				if(!fo                                                // 所定労働時間==0
				|| (t != fo                                           // または所定労働時間と実勤務時間が異なる
					&& (!o.workTimeChangesWithShift || wsys == teasp.constant.WORK_SYSTEM_MANAGER)  //     かつ(所定労働時間連動しない or 管理監督者)
				   )
				){
					msg = teasp.message.getLabel('tf10004720'   // （所定勤務時間 {0} 実勤務時間 {1}）
							, teasp.util.time.timeValue(fo), teasp.util.time.timeValue(t));
				}else if(t != fo                                // 勤務時間を変えた
				&& t > lg                                       // かつ所定が法定労働時間を超えている
				&& wsys == teasp.constant.WORK_SYSTEM_FIX){     // かつ固定労働時間制
					msg = teasp.message.getLabel('tf10004730'   // （所定勤務時間 {0} ＋残業 {1}）
							, teasp.util.time.timeValue(lg), teasp.util.time.timeValue(t - lg));
				}else{
					msg = teasp.message.getLabel('tk10001161'   // （所定勤務時間 {0}）
							, teasp.util.time.timeValue(t));
				}
			}
		}
		dojo.byId('dialogApplyTimeNote' + contId).innerHTML = msg;
		teasp.dialog.EmpApply.adjustContentHeight();
	};

	this.createTimeParts     (key, tbody, contId, applyObj, false, changedTime); // 時間
	if(fix && applyObj){
		if(!applyObj.pattern){
			dojo.style(dojo.byId('dlgApplyPatternRow' + contId), 'display', 'none');
		}
		if(typeof(applyObj.startTime) != 'number' && typeof(applyObj.endTime) != 'number'){
			dojo.style(dojo.byId('dialogApplyTimeRow' + contId), 'display', 'none');
		}
	}
	this.createNoteParts     (key, tbody, contId, applyObj); // 備考
	dojo.byId('dialogApplyTimeNote' + contId).style.fontSize = '90%';
	dojo.byId('dialogApplyTimeNote' + contId).style.color = '#696969';
	this.createApplySetParts (key, tbody, contId, applyObj); // 承認者設定
	this.createApplyTimeParts(key, tbody, contId, applyObj); // 申請日時
	this.createStatusParts   (key, tbody, contId, applyObj); // 状況
	this.createErrorParts    (key, tbody, contId); // エラーメッセージ出力エリア

	if(btnbox){
		dojo.place(btnbox, tbody);
	}

	// 勤務パターンIDから勤務パターンオブジェクトを得る
	var getPatternById = function(id){
		for(var i = 0 ; i < patternList.length ; i++){
			if(patternList[i].id == id){
				return patternList[i];
			}
		}
		return null;
	};

	// 勤務パターン選択リストで選択されている勤務パターンのデータを得る
	var getSelectedPattern = function(node){
		return getPatternById.apply(this, [node.value]);
	};

	// 勤務パターンに応じて初期値を変更
	var changedPatternType = function(o, flag){
		if(!flag){
			dojo.byId('dialogApplyStartTime' + contId).value = (o ? teasp.util.time.timeValue(o.stdStartTime, this.timeForm) : '');
			dojo.byId('dialogApplyEndTime'   + contId).value = (o ? teasp.util.time.timeValue(o.stdEndTime  , this.timeForm) : '');
		}
		dojo.byId('dialogApplyStartTime' + contId).disabled = (this.pouch.isUseChangeShift() ? false : true);
		dojo.byId('dialogApplyEndTime'   + contId).disabled = (this.pouch.isUseChangeShift() ? false : true);
		changedTime.apply(this);
		showTimeParts(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX && o && o.disableCoreTime ? false : true);
	};

	var showTimeParts = function(flag){
		dojo.query('td.time-parts', dojo.byId('dialogApplyTimeRow' + contId)).forEach(function(el){
			dojo.style(el, 'display', (flag ? '' : 'none'));
		});
	};
	if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX
	&& applyObj
	&& applyObj.pattern
	&& applyObj.pattern.disableCoreTime){
		showTimeParts(false);
		 dojo.byId('dialogApplyTimeNote' + contId).innerHTML
			 = teasp.message.getLabel('tk10001180' // （コアタイム時間 {0}）
					 , teasp.message.getLabel('tm10010150')); // なし
	}else{
		showTimeParts(true);
	}

	// 勤務パターンが変更された時の処理
	var select = dojo.byId('dlgApplyPatternList' + contId);
	if(select){
		this.eventHandles.push(dojo.connect(select, 'onchange', this, function(e){
			changedPatternType.apply(this, [ getSelectedPattern.apply(this, [e.target]) ]);
		}));
		var pattern = getSelectedPattern.apply(this, [select]);
		var notime = (applyObj && applyObj.pattern && pattern && applyObj.pattern.id == pattern.id) ? true : false;
		changedPatternType.apply(this, [ pattern, notime ]);
	}
	if(!fix && (patternList.length <= 0 || hidePattern)){
		dojo.style(dojo.byId('dlgApplyPatternRow' + contId), 'display', 'none');
		dojo.style(dojo.byId('dialogApplyTimeRow' + contId), 'display', 'none');
	}

	if(changedDayType){
		changedDayType(); // 勤務日の指定が変更された時の処理
	}

	this.drawLast(applyObj, node);

	// 申請ボタンが押された時の処理
	var btnOk = dojo.byId('empApplyDone' + contId);
	if(btnOk){
		this.eventHandles.push(dojo.connect(btnOk, 'onclick', this, function(e){
			var select = dojo.byId('dlgApplyPatternList' + contId);
			if(select.value == 'S' || select.value == 'L'){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003290')); // 勤務パターンを選択してください
				return;
			}
			var dayTypeVal = null;
			if(this.pouch.isChangeDayType()){
				var dtyp = dojo.byId('dlgApplyDayType' + contId);
				if(dtyp && dtyp.value != '-'){
					dayTypeVal = dtyp.value;
					if(dayTypeVal == '1'
					&& this.pouch.isAllowSelectionOfLegalHoliday()
					&& dojo.byId('dayTypeLegalHoliday').checked){
						dayTypeVal = '2';
					}
					dtyp = null;
				}
			}
			var o = (dayTypeVal != '1' && dayTypeVal != '2' && !hidePattern ? getSelectedPattern.apply(this, [select]) : null);
			select = null;

			var req = {
				empId            : this.pouch.getEmpId(),
				month            : this.pouch.getYearMonth(),
				startDate        : this.pouch.getStartDate(),
				lastModifiedDate : this.pouch.getLastModifiedDate(),
				date             : this.args.date,
				apply            : {
					id           : (applyObj ? applyObj.id : null),
					applyType    : (o && o.range == teasp.constant.RANGE_LONG ? teasp.constant.APPLY_TYPE_PATTERNL : teasp.constant.APPLY_TYPE_PATTERNS),
					patternId    : (o ? o.id : null),
					holidayId    : null,
					status       : null,
					dayType      : dayTypeVal,
					startDate    : this.args.date,
					endDate      : this.args.date,
					exchangeDate : null,
					startTime    : null,
					endTime      : null,
					note         : (dojo.byId('dialogApplyNote' + contId).value || null),
					contact      : null
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
				if(dojo.date.compare(sd.date, ed.date, 'date') > 0){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003300')); // 期間の設定が無効です
					return;
				}
				if(o && o.range == teasp.constant.RANGE_LONG){
					if(this.pouch.isProhibitAcrossMonthApply() // 申請期間が月度をまたぐ申請を禁止する
					&& teasp.util.date.compareDate(ed.date, this.monthLastDate) > 0){ // 期間の終了日が月度最終日より後
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10001185')); // 月度をまたぐ期間は指定できません
						return;
					}
					var applyRange = this.pouch.getDateRangeOfMonth(this.args.date, 3, -1);
					if(teasp.util.date.compareDate(applyRange.to, ed.date) < 0){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003310')); // 3ヶ月以上先の日付を期間の終了日にすることはできません
						return;
					}
				}else{
					if(teasp.util.date.compareDate(ed.date, this.monthLastDate) > 0){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003320')); // 期間は今月度内で設定してください
						return;
					}
				}
			}else{
				ed = sd;
			}
			req.apply.startDate = sd.datef;
			req.apply.endDate   = ed.datef;
			var st = (o ? o.stdStartTime : null);
			var et = (o ? o.stdEndTime   : null);

			if(o && this.pouch.isUseChangeShift()){
				st = teasp.util.time.clock2minutes(dojo.byId('dialogApplyStartTime' + contId).value);
				et = teasp.util.time.clock2minutes(dojo.byId('dialogApplyEndTime'   + contId).value);
				if(st === undefined || et === undefined){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003100')); // 時間を設定してください
					return;
				}
				if(st >= et){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003110')); // 正しい時間を設定してください
					return;
				}
				if(st >= 1440){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002030')); // 出社時刻に 24:00 以降の時刻を入力できません
					return;
				}
				if(et > 2880){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003120')); // 48:00以降の時刻を設定できません
					return;
				}
				var checkFix = false;
				if(this.pouch.getWorkSystem() != teasp.constant.WORK_SYSTEM_MANAGER){ // 管理監督者以外
					if(this.dayWrap.getDayType() ==  teasp.constant.DAY_TYPE_NORMAL){ // 平日
						if(this.dayWrap.isExchangedEdge()){ // 振替で平日になった日である
							checkFix = o.prohibitChangeExchangedWorkTime;
						}else{ // 元々平日
							checkFix = o.prohibitChangeWorkTime;
						}
					}else{ // 休日
						checkFix = o.prohibitChangeHolidayWorkTime;
					}
				}
				if(checkFix && (o.stdStartTime != st || o.stdEndTime != et)){ // 所定時間の変更を禁止がオンかつ始業or終業時刻が変更されている
					// 所定の時間
					var oft = o.stdEndTime - o.stdStartTime - teasp.util.time.rangeTime({ from: o.stdStartTime, to: o.stdEndTime }, o.restTimes);
					// 入力の時間
					var restTimes = dojo.clone(o.restTimes || []);
					if(o.enableRestTimeShift && st != o.stdStartTime){ // シフト開始時刻に合わせて、所定休憩と半休の時間帯をずらす＝オン かつ 開始時刻！＝始業時刻
						var diff = st - o.stdStartTime;
						for(var i = 0 ; i < restTimes.length ; i++){
							restTimes[i].from += diff;
							restTimes[i].to   += diff;
						}
					}
					var ft = (et - st - teasp.util.time.rangeTime({ from: st, to: et }, restTimes));
					if(oft != ft){
						ft -= oft;
						var arg = teasp.message.getLabel((ft < 0 ? 'tk10001162' : 'tk10001163'), teasp.util.time.timeValue(Math.abs(ft))); // "（{0}不足）" or "（{0}オーバー）"
						var tng = teasp.message.getLabel(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX ? 'coreTime_label' : 'tk10000111'); // "コアタイム" or "勤務時間"
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10001160', tng, arg)); // {0}が変わらないように開始・終了時刻を設定してください{1}
						return;
					}
				}
				req.apply.startTime = st;
				req.apply.endTime   = et;
			}
			if(this.pouch.isProhibitWorkShiftChange()){ // 勤務パターンの指定不可
				if(hidePattern && this.pouch.isChangeDayType() && !req.apply.dayType){ // 平日・休日の変更許可
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10011240')); // 勤務日の設定を指定してください
					return;
				}
			}else{
				if(this.pouch.isChangeDayType()){ // 平日・休日の変更許可
					if(!req.apply.patternId && !req.apply.dayType){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10011250')); // 勤務日の設定または勤務パターンを選択してください
						return;
					}
				}else if(!req.apply.patternId){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003290')); // 勤務パターンを選択してください
					return;
				}
			}
			if(this.pouch.isRequireNote(key)
			&&(!req.apply.note || !req.apply.note.replace(/[\s　]+$/g,''))){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003680')); // 備考を入力してください
				return;
			}
			// 期間内の申請をチェック
			var days = this.getRangeApplys(req.apply.startDate, req.apply.endDate);
			var d = req.apply.startDate;
			var confirms = {};
			while(d <= req.apply.endDate){
				var day = days[d];
				var dps = day.rack.validApplys.patternS; // 勤務時間変更申請（短期）
				var dpl = day.rack.validApplys.patternL; // 勤務時間変更申請（長期）
				var dpd = day.rack.validApplys.patternD; // 勤務時間変更申請（勤務日・非勤務日変更）
				var dta = (dps && dps.dayType) ? dps : ((dpl && dpl.dayType) ? dpl : null); // 勤務日・非勤務日と勤務パターンを同時申請した申請
				var m = this.pouch.getEmpMonthByDate(d);
				if(m && this.pouch.isEmpMonthFixed(m)){ // 対象日の月度は確定済み
					var ym = m.yearMonth;
					var sn = m.subNo;
					var ymj = teasp.util.date.formatMonth('zv00000020', Math.floor(ym / 100), (ym % 100), sn);
					teasp.dialog.EmpApply.showError(contId
							, teasp.message.getLabel('tk10005180' // {0}は勤務確定されています。{1}を見直してください。
							, ymj
							, teasp.message.getLabel('range_label'))); // 期間
					return;
				}
				if(day.rack.validApplys.dailyFix){ // 対象日は日次確定済み
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10005190'
							, teasp.util.date.formatDate(d, 'M/d')
							, teasp.message.getLabel('range_label'))); // {0} は日次確定されています。{1}を見直してください。
					return;
				}
				if(o && ((o.range == teasp.constant.RANGE_LONG  && dpl) || (o.range == teasp.constant.RANGE_SHORT && dps))){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10004630')); // 期間内に重複して申請できない他の勤務時間変更申請があります。
					return;
				}
				var hw = (day.rack.validApplys.kyushtu.length > 0 ? day.rack.validApplys.kyushtu[0] : null); // 休日出勤申請
				if(req.apply.dayType){  // 勤務日の設定あり
					if(day.plannedHoliday){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10004600')); // 期間内に有休計画付与日が含まれないようにしてください。
						return;
					}
					if(dpd || dta){ // 勤務日の設定をした勤務時間変更申請がある
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10004630')); // 期間内に重複して申請できない他の勤務時間変更申請があります。
						return;
					}
					var es = day.rack.validApplys.exchangeS;  // 振替申請
					var ee = day.rack.validApplys.exchangeE;  // 振替申請
					if(es || ee){
						teasp.dialog.EmpApply.showError(contId
								, teasp.message.getLabel('tk10005230'       // {0}の{1}を先に取り消してください。
								, teasp.message.getLabel('tm10009070')      // 期間内
								, (es || ee).applyType));
						return;
					}
					if(hw
					&& hw.status == teasp.constant.STATUS_WAIT              // 休日出勤申請は承認待ち
					&& this.pouch.isProhibitInputTimeUntilApproved()){      // 承認されるまで時間入力を禁止
						teasp.dialog.EmpApply.showError(contId
								, teasp.message.getLabel('tk10005230'       // {0}の{1}を先に取り消してください。
								, teasp.message.getLabel('tm10009070')      // 期間内
								, hw.applyType));
						return;
					}
				}
				var za = (day.rack.validApplys.zangyo.length     > 0 ? day.rack.validApplys.zangyo[0]     : null);  // 残業申請
				var es = (day.rack.validApplys.earlyStart.length > 0 ? day.rack.validApplys.earlyStart[0] : null);  // 早朝勤務申請
				var hal = day.rack.validApplys.holidayAll;  // 休暇申請（終日）
				var ham = day.rack.validApplys.holidayAm;   // 休暇申請（午前）
				var hpm = day.rack.validApplys.holidayPm;   // 休暇申請（午後）
				var htm = (day.rack.validApplys.holidayTime.length > 0 ? day.rack.validApplys.holidayTime[0] : null); // 休暇申請（時間単位）
				if(req.apply.dayType == '1' || req.apply.dayType == '2'){ // 非勤務日にする
					var dir = day.rack.validApplys.direct;      // 直行・直帰申請
					var ls  = day.rack.validApplys.lateStart;   // 遅刻申請
					var ee  = day.rack.validApplys.earlyEnd;    // 早退申請
					if(hw){                         // 休日出勤申請あり
						za = es = null;             // 休日出勤申請ありなら残業申請、早朝勤務申請があっても良い
						if(hw.useRegulateHoliday){  // 休日出勤の勤怠を平日扱いする
							ls = ee = null;         // 遅刻申請、早退申請があっても良い
						}
					}
					if(hal || ham || hpm || htm || dir || ls || ee || za || es){
						teasp.dialog.EmpApply.showError(contId
								, teasp.message.getLabel('tk10005230'       // {0}の{1}を先に取り消してください。
								, teasp.message.getLabel('tm10009070')      // 期間内
								, teasp.dialog.EmpApply.getApplyTypesName([hal, ham, hpm, htm, dir, ls, ee, za, es])));
						return;
					}
					if(req.apply.startDate != req.apply.endDate){
						var dk = req.apply.startDate;
						var inpt = false;
						while(dk <= req.apply.endDate){
							var cw = (this.pouch.getObj().works ? this.pouch.getClassifyJobWorks(dk) : null);
							if((cw && (cw.sumTime > 0 || cw.sumVolume > 0))
							|| (this.pouch.getObj().days[dk] && (typeof(this.pouch.getObj().days[dk].startTime) == 'number' || typeof(this.pouch.getObj().days[dk].endTime) == 'number'))
							){
								inpt = true;
								break;
							}
							dk = teasp.util.date.addDays(dk, 1);
						}
						if(inpt){
							confirms.clear = {
								bullet: true,
								title: teasp.message.getLabel('tm10003195') // 時間が入力されていればクリアします。
							};
						}
					}else{
						var cw = (this.pouch.getObj().works ? this.pouch.getClassifyJobWorks(req.apply.startDate) : null);
						if(this.dayWrap.isInputTime() || (cw && (cw.sumTime > 0 || cw.sumVolume > 0))){
							confirms.clear = {
								bullet: true,
								title: teasp.message.getLabel('tm10003194') // 入力された時間をクリアします。
							};
						}
					}
				}else{
					if(req.apply.dayType == '0'){ // 勤務日にする
						if(hw){
							teasp.dialog.EmpApply.showError(contId
									, teasp.message.getLabel('tk10005230'       // {0}の{1}を先に取り消してください。
									, teasp.message.getLabel('tm10009070')      // 期間内
									, hw.applyType));
							return;
						}
					}
					if((za && st > za.startTime) || (es && et < es.endTime)){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10004770')); // 時間帯が申請済みの残業申請または早朝勤務申請と整合しません。該当する申請を取り消してから本申請を行ってください。
						return;
					}
					// 半休や時間単位有休を取っている場合、指定勤務パターンと半休や時間単位有休の整合性をチェックする
					// （既存の短期の勤務パターンが存在する場合は影響を与えないので無視する）
					if(!dps && o && (ham || hpm || htm) && !(ham && hpm)){
						// シフト開始時刻に合わせて、所定休憩と半休の時間帯をずらす＝オン かつ 開始時刻！＝始業時刻
						var diff = ((o.enableRestTimeShift && st != o.stdStartTime) ? (st - o.stdStartTime) : 0);
						var dw = this.pouch.getEmpDay(d);
						var ic = dw.checkInconsistent(ham ? teasp.constant.RANGE_AM : (hpm ? teasp.constant.RANGE_PM : null), o, diff);
						if(ic){
							if(ic == -2){
								teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008240')); // 時間単位有休が半休適用時間と重なるため、申請は無効です。
							}else if(ic == -3){
								teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008230')); // 時間単位有休が所定時間外となるため、申請は無効です。
							}else if(ic == -4){
								teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008250')); // 時間単位有休が他の休憩と重なるため、申請できません。
							}else{
								teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003200')); // 出社・退社時刻が休暇の時間帯と重なっています
							}
							return;
						}
					}
				}
				d = teasp.util.date.addDays(d, 1);
			}
			if(Object.keys(confirms).length > 0){ // 注意事項がある
				// ※ setTimeout() を介して呼んでいる理由は、ダイアログを閉じて戻った時に
				// 描画領域の高さが狭まってしまう現象を回避するため
				setTimeout(dojo.hitch(this, function(){
					teasp.manager.dialogOpen(
						'MessageBox',
						{
							title   : teasp.message.getLabel('tf10009760'), // ご注意ください
							message : '',
							check   : confirms,
							hint    : null,
							dialogWidth: '560px'
						},
						this.pouch,
						this,
						function(obj){
							this.requestSend(contId, req); // サーバへ送信
						}
					);
				}), 100);
			}else{
				this.requestSend(contId, req); // サーバへ送信
			}
		}));
	}
};

