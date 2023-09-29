if(typeof(teasp) == 'object' && !teasp.resolved['DENTSU2'] && teasp.dialog && teasp.dialog.EmpApply){
teasp.dialog.EmpApply.prototype.createHolidayForm = function(key, node, contId, applyObj, btnbox){
	var fix = (applyObj && (teasp.constant.STATUS_FIX.contains(applyObj.status) || applyObj.startDate != this.args.date)) || this.isReadOnly();
	var inputClass = this.getInputClass(fix, applyObj);

	var tbody = dojo.create('div', null, node);
	var row = dojo.create('div', { className: 'empApply2Div' }, tbody);

	// 休暇種類
	var div1 = dojo.create('div', { className:'empApply2CL', innerHTML:teasp.message.getLabel('holidayType_label') }, row); // 休暇種類
	var div2 = dojo.create('div', { className:'empApply2VL' }, row);

	if(applyObj && (fix || !applyObj.active)){
		dojo.create('div', { innerHTML:applyObj.holiday.name, style:'margin:0px 2px;word-break:break-all;' }, div2);
	}else{
		var ctb  = dojo.create('tbody', null, dojo.create('table', { className:'pane_table', style:'width:' + (teasp.isNarrow() ? 260 : 330) + 'px;' }, div2));
		var cr   = dojo.create('tr'    , null, ctb);
		// ここで canSelectHoliday() が false を返したら申請の対象日が休日であることを意味するので、暦日表示休暇限定
		var onlyRekiH = (this.dayWrap.canSelectHoliday() ? false : true);
		var select = dojo.create('select', { id:'dialogApplyHolidayList' + contId, className:inputClass, style:'margin:0px 2px;width:100%;' }, dojo.create('td', null, cr));
		for(var i = 0 ; i < this.holidayList.length ; i++){
			var h = this.holidayList[i];
			if(this.pouch.isUseDaiqManage()
			&& h.type == teasp.constant.HOLIDAY_TYPE_DAIQ
			&& (this.daiqZan.zan || 0) <= 0
			&& (!applyObj || applyObj.holiday.id != h.id)){
				continue;
			}
			if(h.managed
			&& (this.stockZan[h.manageName].zan || 0) <= 0
			&& (!applyObj || applyObj.holiday.id != h.id)){
				continue;
			}
			if(onlyRekiH && !h.displayDaysOnCalendar){ // 暦日表示休暇限定の場合、ここではじく
				continue;
			}
			dojo.create('option', { value: h.id, innerHTML: h.name }, select);
		}
		if(applyObj){
			select.value = applyObj.holiday.id; // 休暇種類
		}
	}
	dojo.create('div', { id: 'dialogApplyHolidayTip' + contId, className: 'pp_base pp_ico_info', style: { marginLeft:"12px", display:"none" } }, dojo.create('td', { style:'width:22px;' }, cr));

	// 新規申請か却下申請の場合、有休残日数を表示
	if(!fix){
		// 有休残日数
		row  = dojo.create('div', { id:'dialogApplyYuqRow' + contId, className:'empApply2Div' }, tbody);
		dojo.create('div', {
			className : 'empApply2CL',
			innerHTML : teasp.message.getLabel('remainYuq_label')
		}, row); // 有休残日数
		dojo.create('div', {
			id        : 'dialogApplyYuq' + contId,
			style     : 'margin:0px 4px;',
			className : 'empApply2VL',
			innerHTML : this.pouch.getDspYuqRemain(this.args.date).display
		}, row);
	}

	// 期間
	var range = this.pouch.getDateRangeOfMonth(this.args.date, 2, -1); // １ヶ月前～１ヶ月後の日付を得る
	range.from = this.args.date;
	if(this.pouch.isProhibitAcrossMonthApply()){ // 申請期間が月度をまたぐ申請を禁止する
		range.to = this.monthLastDate;
	}
	this.createRangeParts(key, tbody, contId, applyObj, range);

	var changedTime = function(){
		dojo.byId('dialogApplyTimeNote' + contId).innerHTML = '';
		var o = getSelectedHoliday.apply(this, [dojo.byId('dialogApplyHolidayList' + contId)]);
		if(!o || !o.type){
			return;
		}
		if(o.range == teasp.constant.RANGE_TIME){ // 時間単位有休
			var st = teasp.util.time.clock2minutes(dojo.byId('dialogApplyStartTime' + contId).value);
			var et = teasp.util.time.clock2minutes(dojo.byId('dialogApplyEndTime' + contId).value);
			if(st === undefined || et === undefined || st >= et || et > 2880){
				return;
			}
			var rests = [];
			var timeTable = this.dayWrap.getTimeTable();
			if(timeTable && timeTable.length > 0){
				for(var i = 0 ; i < timeTable.length ; i++){
					var tt = timeTable[i];
					if(tt.type == teasp.constant.REST_FIX){
						rests.push(tt);
					}
				}
			}else if(!this.dayWrap.isInputTime()){
				var pattern = this.dayWrap.getPattern();
				if(pattern && pattern.restTimes){
					rests = pattern.restTimes;
				}
			}
			var t = et - st;
			if(rests.length > 0){
				var rt = teasp.util.time.rangeTime({from: st, to: et }, rests);
				if(rt > 0){
					t -= rt;
				}
			}
			t = Math.ceil(t / 60);
			if(o.yuqSpend){
				dojo.byId('dialogApplyTimeNote' + contId).innerHTML = teasp.message.getLabel('tm10003131', t);
			}
			teasp.dialog.EmpApply.adjustContentHeight();
		}
	};

	this.createTimeParts     (key, tbody, contId, applyObj, false, changedTime); // 時間
	this.createNoteParts     (key, tbody, contId, applyObj); // 備考
	this.createContactParts  (key, tbody, contId, applyObj); // 連絡先
	this.createApplySetParts (key, tbody, contId, applyObj); // 承認者設定
	this.createApplyTimeParts(key, tbody, contId, applyObj); // 申請日時
	this.createStatusParts   (key, tbody, contId, applyObj); // 状況
	this.createAnnotateParts (key, tbody, contId);
	this.createErrorParts    (key, tbody, contId); // エラーメッセージ出力エリア

	if(btnbox){
		dojo.place(btnbox, tbody);
	}

	if(applyObj
	&& (applyObj.holiday.type == teasp.constant.HOLIDAY_TYPE_DAIQ || applyObj.holiday.managed)){ // 代休
		var anyZan;
		if(applyObj.holiday.type == teasp.constant.HOLIDAY_TYPE_DAIQ){
			anyZan = this.daiqZan;
		}else{
			anyZan = this.stockZan[applyObj.holiday.manageName];
			if(!anyZan){
				anyZan = this.stockZan[applyObj.holiday.manageName] = teasp.data.Pouch.getStockZan( // 積休関連情報を取得
						this.pouch.getStocks(),
						applyObj.holiday.manageName,
						this.args.date);
			}
		}
		if(anyZan.applys[applyObj.id]){
			dojo.byId('dialogApplyAnnotate' + contId).innerHTML = anyZan.applys[applyObj.id].status;
		}
	}

	var holidayTip = new dijit.Tooltip({
		connectId: 'dialogApplyHolidayTip' + contId,
		label: teasp.message.getLabel('tm10003080'), // 休暇を選択してください
		position: ['below']
	});

	// 休暇IDから休暇オブジェクトを得る
	var getHolidayById = function(id){
		for(var i = 0 ; i < this.holidayList.length ; i++){
			if(this.holidayList[i].id == id){
				return this.holidayList[i];
			}
		}
		return null;
	};

	// 休暇種類選択リストで選択されている休暇のデータを得る
	var getSelectedHoliday = function(node){
		if(!node){
			return null;
		}
		return getHolidayById.apply(this, [node.value]);
	};

	// 休暇の属性に応じて表示・非表示を動的に制御
	var changedHolidayType = function(o, flag, applyObj){
		var daiq = (o && (this.pouch.isUseDaiqManage() && o.type == teasp.constant.HOLIDAY_TYPE_DAIQ));
		var stockable = (daiq || (o && o.managed));
		this.displayOnOff('dialogApplyHolidayTip' + contId, (o && o.name && o.description));
		if(o && o.description){
			holidayTip.label = '<b>' + o.name + '</b><br/>'
				+ '<div style="overflow:auto;"><pre class="holiday-descript">' + o.description + '</pre></div>';
		}
		var notrange = (daiq || (o && o.range != teasp.constant.RANGE_ALL));
		if(notrange && applyObj && applyObj.startDate != applyObj.endDate){
			notrange = false;
		}
		this.displayOnOff('dialogApplyYuqRow'       + contId, (o && o.yuqSpend));
		this.displayOnOff('dialogApplyRangeRow'     + contId, notrange ? false : true);
		this.displayOnOff('dialogApplyTimeRow'      + contId, (o && o.range == teasp.constant.RANGE_TIME) ? true : false);
		this.displayOnOff('dialogApplyAnnotateRow'  + contId, stockable ? true : false);

		teasp.dialog.EmpApply.showError(contId, null);

		if(stockable && !flag){ // 代休かつ代休管理する設定または日数管理する休暇を選択
			var anyZan;
			if(o.type == teasp.constant.HOLIDAY_TYPE_DAIQ){
				anyZan = this.daiqZan;
			}else{
				anyZan = this.stockZan[o.manageName];
			}
			dojo.byId('dialogApplyAnnotate' + contId).innerHTML
					= teasp.message.getLabel(((this.pouch.isUseDaiqManage() && o.type == teasp.constant.HOLIDAY_TYPE_DAIQ) ? 'tm10003760' : 'tm10003761')
					, (anyZan.zan || 0)); // 代休取得可能日数 {0} 日
		}
		changedTime.apply(this);
	};

	// 休暇種類が変更された時の処理
	var select = dojo.byId('dialogApplyHolidayList' + contId);
	if(select){
		this.eventHandles.push(dojo.connect(select, 'onchange', this, function(e){
			changedHolidayType.apply(this, [ getSelectedHoliday.apply(this, [e.target]) ]);
		}));
		changedHolidayType.apply(this, [ getSelectedHoliday.apply(this, [ select ]) ]);
		select = null;
	}else if(applyObj){
		changedHolidayType.apply(this, [ applyObj.holiday, fix, applyObj ]);
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
					applyType    : teasp.constant.APPLY_TYPE_HOLIDAY,
					patternId    : null,
					holidayId    : null,
					status       : null,
					startDate    : null,
					endDate      : null,
					exchangeDate : null,
					startTime    : null,
					endTime      : null,
					note         : (dojo.byId('dialogApplyNote'    + contId).value || null),
					contact      : (dojo.byId('dialogApplyContact' + contId).value || null)
				}
			};
			var o = getSelectedHoliday.apply(this, [dojo.byId('dialogApplyHolidayList' + contId)]);
			if(!o || !o.type){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003090')); // 休暇種類を選択してください
				return;
			}

			var za = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_ZANGYO);        // 残業申請
			var es = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_EARLYSTART);    // 早朝勤務申請
			var ls = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_LATESTART);     // 遅刻申請
			var ee = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_EARLYEND);      // 早退申請
			if(o.range == teasp.constant.RANGE_ALL && (za || es || ls || ee)){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003040', '', teasp.dialog.EmpApply.getApplyTypesName([za, es, ls, ee]))); // 先に{1}を取り消してください
				return;
			}

			// 有休消化する休暇の場合、有休残日数チェックをするために消化情報を作成
			var spend = (o.yuqSpend ? { dt: this.args.date, days: 0, minutes: 0 } : null);
			var manad = (o.managed ? {} : null);
			var notrange = (o.range != teasp.constant.RANGE_ALL
					|| (this.pouch.isUseDaiqManage() && o.type == teasp.constant.HOLIDAY_TYPE_DAIQ)); // 終日休暇以外または代休の場合、期間指定不可

			// 休暇の延長勤務禁止＝オンの場合、前日の退社時刻が24:00を超えてないかをチェック
			if(o.config && o.config.prohibitOverNightWork){
				var pd = this.pouch.getEmpDay(teasp.util.date.addDays(this.args.date, -1)); // 前日
				if(pd){
					if(typeof(pd.getObj().endTime) == 'number' && pd.getObj().endTime > 1440){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008380', o.name)); // 前日の退社時刻が24:00を超えているため、 {0} を申請できません。
						return;
					}
					var ra = pd.getEmpApplyByKey(teasp.constant.APPLY_KEY_REVISETIME); // 勤怠時刻修正申請
					if(ra && ra.timeTable){
						var rtt = teasp.logic.EmpTime.filterTimeTable(ra.timeTable, 1);
						var et = (rtt.length && rtt[0].to) || 0;
						if(et > 1440){
							teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008390', o.name)); // 前日の勤怠時刻修正申請の退社時刻が24:00を超えているため、{0}を申請できません。
							return;
						}
					}
				}
			}

			req.apply.holidayId = o.id;
			if(o.range == teasp.constant.RANGE_TIME){ // 時間単位有休
				req.apply.startDate = this.args.date;
				req.apply.endDate   = this.args.date;

				var st = teasp.util.time.clock2minutes(dojo.byId('dialogApplyStartTime' + contId).value);
				var et = teasp.util.time.clock2minutes(dojo.byId('dialogApplyEndTime' + contId).value);
				if(st === undefined || et === undefined){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003100')); // 時間を設定してください
					return;
				}
				if(st >= et){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003110')); // 正しい時間を設定してください
					return;
				}
				if(et > 2880){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003120')); // 48:00以降の時刻を設定できません
					return;
				}
				var rests = this.dayWrap.getSeparatedRests();
				var rest1 = rests.fix; // 所定休憩
				var rest2 = rests.free.concat(rests.paid); // 任意休憩と時間単位有休のミックス
				if(rest2.length > 0){
					var rt = teasp.util.time.rangeTime({from: st, to: et }, rest2);
					if(rt > 0){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003140')); // 他の休憩時間と重ならないように時間を設定してください
						return;
					}
				}
				var t = et - st;
				if(rest1.length > 0){
					var rt = teasp.util.time.rangeTime({ from: st, to: et }, rest1);
					if(rt > 0){
						t -= rt;
					}
				}
				if(t <= 0){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003110')); // 正しい時間を設定してください
					return;
				}
				if(spend){ // 消化情報をセット
					spend.days    = 0;
					spend.minutes = Math.ceil(t / 60) * 60;
				}
				var inprng = this.dayWrap.getInputTimeRange();
				if(inprng && (st < inprng.from || et > inprng.to)){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003141')); // 休暇申請の時間と重ならないように時間を設定してください
					return;
				}
				if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX){
					var ro = this.pouch.getStandardRange({
						st       : this.dayWrap.getFixStartTime(),
						et       : this.dayWrap.getFixEndTime(),
						pattern  : this.dayWrap.getPattern(),
						timeHolidayApplys: this.dayWrap.getTimeHolidayApply(), // 申請済みの時間単位有休のリスト
						useCoreTime      : this.dayWrap.isUseCoreTime() // コアタイムを使用するか
					});
					if(st < ro.from || ro.to < et){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003142')); // 所定の勤務時間内の時間を設定してください
						return;
					}
				}else{
					if(st < this.dayWrap.getFixStartTime() || this.dayWrap.getFixEndTime() < et){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003142')); // 休暇申請の時間と重ならないように時間を設定してください
						return;
					}
				}
				req.apply.startTime = st;
				req.apply.endTime   = et;

			}else{ // 時間単位有休以外
				var sd = teasp.util.strToDate(dojo.byId('dialogApplyStartDate' + contId).value);
				if(sd.failed != 0){
					teasp.dialog.EmpApply.showError(contId, dojo.replace(sd.tmpl, [teasp.message.getLabel('rangeStartDate_label')])); // 期間の開始日
					return;
				}
				dojo.byId('dialogApplyStartDate' + contId).value = sd.dater;
				var ed = sd;

				if(!notrange){
					ed = teasp.util.strToDate(dojo.byId('dialogApplyEndDate' + contId).value);
					if(ed.failed == 1){
						dojo.byId('dialogApplyEndDate' + contId).value = sd.dater;
						ed = sd;
					}else if(ed.failed != 0){
						teasp.dialog.EmpApply.showError(contId, dojo.replace(ed.tmpl, [teasp.message.getLabel('rangeEndDate_label')])); // 期間の終了日
						return;
					}
					dojo.byId('dialogApplyEndDate' + contId).value = ed.dater;
				}
				if(sd.datef != ed.datef){
					if(dojo.date.compare(sd.date, ed.date, 'date') >= 0){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003160')); // 期間の設定が無効です
						return;
					}
					if(this.pouch.isProhibitAcrossMonthApply() // 申請期間が月度をまたぐ申請を禁止する
					&& teasp.util.date.compareDate(ed.date, this.monthLastDate) > 0){ // 期間の終了日が月度最終日より後
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10001185')); // 月度をまたぐ期間は指定できません
						return;
					}
					var d = dojo.date.add(sd.date, 'month', 1);
					if(dojo.date.compare(d, ed.date, 'date') <= 0){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003170')); // １か月を超える期間の休暇申請はできません
						return;
					}
					if(!this.pouch.isApplyLimitOff()){ // #6193
						var applyRange = this.pouch.getDateRangeOfMonth(teasp.util.date.getToday(), 12, -12);
						if(teasp.util.date.compareDate(applyRange.to, ed.date) <= 0){
							teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003180')); // １年以上先の日付を期間の終了日にすることはできません
							return;
						}
					}
					var edo = this.pouch.getMonthDay(ed.datef);
					if(!o.displayDaysOnCalendar
					&& edo.dayType != teasp.constant.DAY_TYPE_NORMAL){  // 暦日休暇でないかつ期間最終日が休日
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10005400')); // 期間の最終日が休日にならないようにしてください。
						return;
					}
				}else{
					if((this.pouch.isUseDaiqManage() && o.type == teasp.constant.HOLIDAY_TYPE_DAIQ) || o.managed){ // 代休または積休を選択した
						var n = (o.range == teasp.constant.RANGE_ALL ? 1 : 0.5);
						if(o.type == teasp.constant.HOLIDAY_TYPE_DAIQ){
							if((this.daiqZan.zan || 0) < n){
								teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003700')); // 代休可能残日数が不足しています
								return;
							}
						}else{
							if((this.stockZan[o.manageName].zan || 0) < n){
								teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003701', o.name)); // 代休可能残日数が不足しています
								return;
							}
						}
					}
				}
				req.apply.startDate = (typeof(sd) == 'string' ? sd : sd.datef);
				req.apply.endDate   = (typeof(ed) == 'string' ? ed : ed.datef);

				var rangeDays = teasp.util.date.getDateList(req.apply.startDate, req.apply.endDate);
				var planned = (this.pouch.getPlannedHoldays() || []);
				for(var i = 0 ; i < rangeDays.length ; i++){
					if(typeof(planned[rangeDays[i]]) == 'number'){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10004600')); // 期間内に有休計画付与日が含まれないようにしてください。
						return;
					}
				}
				var ds = [];
				for(var i = 0 ; i < rangeDays.length ; i++){
					var k = rangeDays[i];
					var d = this.pouch.getMonthDay(k);
					if(!d.dayType){ // 期間内の平日が休暇対象日
						ds.push(d.date);
					}
				}
				if(spend){ // 有休用に消化情報をセット
					spend.days    = (o.range == teasp.constant.RANGE_ALL ? 1 : 0.5) * ds.length;
					spend.minutes = 0;
				}
				if(manad){ // 日数管理休暇用に消化情報をセット
					manad.spd  = (o.range == teasp.constant.RANGE_ALL ? 1 : 0.5);
					manad.ds   = ds;
				}
			}
			if(spend){ // 有休消化する休暇の場合、有休残日数のチェックをする
				if(!spend.days){ // 日数がない＝時間単位有休である
					var yqs = this.pouch.getObj().yuqRemains;
					var firstYq = null;
					for(var i = 0 ; i < yqs.length ; i++){
						var yq = yqs[i];
						if(yq.remainDays || yq.remainTime){ // 残あり
							firstYq = yq;
							break;
						}
					}
					if(firstYq && firstYq.remainDays == 0.5 && !firstYq.remainTime){ // 残日数＝0.5日
						teasp.dialog.EmpApply.showError(contId, '残日数が不足しているため、時間単位休ではなく、半日休を申請してください。');
						return;
					}
					var day = this.pouch.getObj().days[req.apply.startDate];
					if(day && day.rack && day.rack.fixTime <= spend.minutes){
						teasp.dialog.EmpApply.showError(contId, '1日の所定労働時間を超える時間単位休は申請できません。');
						return;
					}
				}
				var syr = this.pouch.simulateDspYuqRemain(req.apply.startDate, spend);
				var ngd = [];
				var wad = [];
				for(var i = 0 ; i < syr.spends.length ; i++){
					var sp = syr.spends[i];
					if(!sp.ng){
						continue;
					}
					if(sp.planned == 1){
						ngd.push(teasp.util.date.formatDate(sp.dt, 'M/d'));
					}else if(sp.planned == 2){
						if(wad.length == 5){
							wad.push('...');
						}else if(wad.length < 5){
							wad.push(teasp.util.date.formatDate(sp.dt, 'M/d'));
						}
					}else{
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm11012020')); // 有給休暇が不足しています
						return;
					}
				}
				if(ngd.length > 0){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10005070', ngd.join(', '))); // 有休計画付与日（{0}）の分の有給休暇が不足します。
					return;
				}
				if(wad.length > 0){
					if(!confirm(teasp.message.getLabel('tk10005080', wad.join(', ')))){ // ！ 警告 ！\n次月以降の有休計画付与日（{0}）の分の有給休暇が不足します。\n休暇申請を行ってもよろしいですか？
						return;
					}
				}
			}
			if(manad){ // 日数管理休暇を消化する休暇の場合、日数管理休暇の残日数のチェックをする
				var stocks = this.stockZan[o.manageName].stocks; // 日数管理休暇の付与・消化情報
				var zs = [];
				for(var i = 0 ; i < stocks.length ; i++){
					var stock = stocks[i];
					if(stock.days > 0 && stock.remainDays > 0){ // 付与かつ残日数ありの情報を集める
						zs.push({
							remainDays  : stock.remainDays,
							startDate   : stock.startDate,
							limitDate   : stock.limitDate
						});
					}
				}
				// 失効日の早いもの順にソート
				zs = zs.sort(function(a, b){
					if(a.limitDate == b.limitDate){
						return (a.startDate < b.startDate ? -1 : 1);
					}
					return (a.limitDate < b.limitDate ? -1 : 1);
				});
				// 期間内１日ずつ残日数を消化して、消化できない日があれば、残日数不足
				var spd = manad.spd; // 1日の消化数
				var oks = []; // 消化できる日
				var ngs = []; // 消化できない日
				for(var i = 0 ; i < manad.ds.length ; i++){
					var dk = manad.ds[i];
					var zn = spd;
					for(var j = 0 ; (j < zs.length && zn > 0) ; j++){
						var z = zs[j];
						if(z.remainDays > 0 && z.startDate <= dk && dk < z.limitDate){
							var n = Math.min(z.remainDays, zn);
							z.remainDays -= n;
							zn -= n;
						}
					}
					if(zn <= 0){
						oks.push(dk);
					}else{
						ngs.push(dk);
					}
				}
				if(ngs.length > 0){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003701', o.name)); // {0}取得可能残日数が不足しています。
					return;
				}
			}
			// 期間内の申請をチェック
			var days = this.getRangeApplys(req.apply.startDate, req.apply.endDate);
			var d = req.apply.startDate;
			var oths = { cnt: 0 };
			while(d <= req.apply.endDate){
				var day = days[d];
				var msg = this.conflictHoliday(day
						, o
						, {
							msge1: teasp.message.getLabel('range_label'),   // 期間
							msge2: teasp.message.getLabel('tm10009070')     // 期間内
						}
						, oths);
				if(msg){
					teasp.dialog.EmpApply.showError(contId, msg);
					return;
				}
				d = teasp.util.date.addDays(d, 1);
			}
			if(oths.cnt){
				teasp.dialog.EmpApply.showError(contId
					, teasp.message.getLabel('tk10005230'       // {0}の{1}を先に取り消してください。
						, teasp.message.getLabel('tm10009070')  // 期間内
						, teasp.dialog.EmpApply.getApplyTypesName(oths)
						)
				);
				return;
			}

			teasp.dialog.EmpApply.showError(contId, null);

			if(this.pouch.isRequireNote(teasp.constant.APPLY_KEY_HOLIDAY)
			&& !req.apply.note){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003680')); // 備考を入力してください
				return;
			}

			var va = this.dayWrap.getObj().rack.validApplys;
			var hf = 0;
			if(va.holidayAm ){ hf |= 1; }
			if(va.holidayPm ){ hf |= 2; }
			if(va.holidayAll){ hf |= 3; }
			if(o.range == teasp.constant.RANGE_AM){ hf |= 1; }
			if(o.range == teasp.constant.RANGE_PM){ hf |= 2; }

			var confirms = {};
			// 入力済みの値とのギャップをチェック
			if(o.range == teasp.constant.RANGE_ALL || (hf & 3) == 3){ // 終日休
				if(req.apply.startDate != req.apply.endDate){
					var dk = req.apply.startDate;
					var inpt = false;
					var lasd = this.pouch.getObj().month.endDate;
					while(dk <= req.apply.endDate){
						var cw = (this.pouch.getObj().works ? this.pouch.getClassifyJobWorks(dk) : null);
						if(dk > lasd
						|| (cw && (cw.sumTime > 0 || cw.sumVolume > 0))
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
			}else if((o.range == teasp.constant.RANGE_AM || o.range == teasp.constant.RANGE_PM) && this.dayWrap.isCheckTimeOnHalfHoliday()){ // 半日休でチェック対象
				var incons = this.dayWrap.checkInconsistent(o.range);
				if(incons < 0){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003200')); // 出社・退社時刻が休暇の時間帯と重なっています
					return;
				}
				if(incons > 0){
					confirms.adjust = {
						bullet: true,
						title: teasp.message.getLabel('tm10002091', // {0}が休暇の時間帯と重なっているため調整した時刻を入力します。
							(incons == 1
							? teasp.message.getLabel('startTime_label')
							: teasp.message.getLabel('endTime_label')
							)
						)
					};
				}
			}
			var confirmHint = null;
			// 半休申請後の所定休憩と入力済みの所定休憩が異なるかどうかを判定
			// 異なる場合は休憩時間リセットの確認を表示する
			if((o.range == 2 || o.range == 3) && (hf & 3) != 3){
				var compRestsResult = this.dayWrap.compareRestsAfterApply({holidayRange:o.range});
				if(compRestsResult.diff){
					confirmHint = compRestsResult.note;
					confirms.noteBreak = {
						style: {'marginBottom':'8px'},
						bullet: true,
						title: teasp.message.getLabel('tf10009770') // 休憩時間をリセットします。しない方が良い時は下記のチェックを外してください。
					};
					confirms.resetBreak = {
						style: {'paddingLeft':'40px'},
						title: teasp.message.getLabel('tf10009780'), // 休憩時間をリセットする
						checked: true
					};
				}
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
							hint    : confirmHint,
							dialogWidth: '560px'
						},
						this.pouch,
						this,
						function(obj){
							req.apply.resetBreak = (obj.resetBreak && obj.resetBreak.checked) || false;
							this.requestSend(contId, req); // サーバへ送信
						}
					);
				}), 100);
			}else{
				this.requestSend(contId, req); // サーバへ送信
			}

		}));
		btnOk = null;
	}
};
}