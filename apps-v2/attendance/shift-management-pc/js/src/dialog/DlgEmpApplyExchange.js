/**
 * 振替申請フォーム生成
 *
 * @param {string} key 申請キー
 * @param {Object} node フォームの親ノード
 * @param {string} contId IDに使用する番号
 * @param {Object=} applyObj 申請データ
 */
teasp.dialog.EmpApply.prototype.createExchangeForm = function(key, node, contId, applyObj, btnbox){
	var fix = (applyObj && teasp.constant.STATUS_FIX.contains(applyObj.status)) || this.isReadOnly();
	var inputClass = this.getInputClass(fix, applyObj);

	var tbody = dojo.create('div', null, node);

	// 振替日
	var row = dojo.create('div', { id: 'dialogApplyExchangeRow' + contId, className: 'empApply2Div' }, tbody);
	dojo.create('div', {
		className: 'empApply2CL',
		innerHTML: teasp.message.getLabel('exchangeDate_label')
	}, row); // 振替日

	if(applyObj){
		var pair = teasp.message.getLabel('tm10003240', teasp.util.date.formatDate(applyObj.startDate, 'M/d+'), teasp.util.date.formatDate(applyObj.exchangeDate, 'M/d+')); // {0} ⇔ {1}
		if(applyObj.originalStartDate != applyObj.startDate){
			pair += /*'<br/>' +*/ teasp.message.getLabel('tm10003800', teasp.util.date.formatDate(applyObj.originalStartDate, 'M/d+')); // 再振替（振替元：{0}）
		}
		dojo.create('div', {
			className: 'empApply2VL',
			innerHTML: pair,
			style: { margin:"4px" }
		}, row);
	}else{
		var ctb = dojo.create('tbody' , null, dojo.create('table' , { className: 'pane_table' }, dojo.create('div', { className: 'empApply2VL' }, row)));
		var cr  = dojo.create('tr', null, ctb);
		var cc  = dojo.create('td', null, cr);
		dojo.create('input', { type: 'text', id: 'dialogApplyExchangeDate' + contId, style: { margin:"2px" }, className: 'inpudate ' + inputClass }, cc);
		cc   = dojo.create('td', null, cr);
		var btn = dojo.create('input', { type: 'button', id: 'dialogApplyExchangeDateCal' + contId, style: { margin:"2px" }, className: 'pp_base pp_btn_cal' }, cc);
		if(applyObj){
			dojo.byId('dialogApplyExchangeDate' + contId).value = teasp.util.date.formatDate(applyObj.exchangeDate, 'SLA'); // 振替日
		}

		// カレンダーボタンが押された時の処理
		this.eventHandles.push(dojo.connect(btn, 'onclick', this, function(e){
			var ind = teasp.util.date.parseDate(dojo.byId('dialogApplyExchangeDate' + contId).value); // 期間終了日の入力値を取得
			var bd = (ind || this.args.date);
			teasp.manager.dialogOpen(
				'Calendar',
				{
					date               : bd,
					isDisabledDateFunc : dojo.hitch(this, function(d) {
						var key2 = teasp.util.date.formatDate(d);
						if(teasp.util.date.compareDate(d, bd) == 0){
							return false;
						}
						return (this.enableMap && this.enableMap[key2] ? false : true);
					})
				},
				null,
				this,
				function(o){
					dojo.byId('dialogApplyExchangeDate' + contId).value = teasp.util.date.formatDate(o, 'SLA');
					teasp.dialog.EmpApply.showError(contId, null);
				}
			);
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
			var req = {
				empId            : this.pouch.getEmpId(),
				month            : this.pouch.getYearMonth(),
				startDate        : this.pouch.getStartDate(),
				lastModifiedDate : this.pouch.getLastModifiedDate(),
				date             : this.args.date,
				apply            : {
					id           : (applyObj ? applyObj.id : null),
					applyType    : teasp.constant.APPLY_TYPE_EXCHANGE,
					patternId    : null,
					holidayId    : null,
					status       : null,
					startDate    : this.args.date,
					endDate      : this.args.date,
					exchangeDate : null,
					startTime    : null,
					endTime      : null,
					note         : (dojo.byId('dialogApplyNote'    + contId).value || null),
					contact      : (dojo.byId('dialogApplyContact' + contId).value || null)
				}
			};
			var exchangeE = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_EXCHANGEE);
			var osd = (exchangeE ? exchangeE.originalStartDate : null);
			var startDate;
			var exchangeDate;
			var enable;
			if(applyObj){
				startDate    = applyObj.startDate;
				exchangeDate = applyObj.exchangeDate;
				enable = this.pouch.checkExchangable((osd ? osd : startDate), exchangeDate);
			}else{
				startDate    = this.args.date;
				var ed = teasp.util.strToDate(dojo.byId('dialogApplyExchangeDate' + contId).value);
				if(ed.failed != 0){
					teasp.dialog.EmpApply.showError(contId, dojo.replace(ed.tmpl, [teasp.message.getLabel('exchangeDate_label')])); // 振替日
					return;
				}
				dojo.byId('dialogApplyExchangeDate' + contId).value = ed.dater;
				exchangeDate = ed.datef;
				enable = (this.enableMap ? this.enableMap[exchangeDate] : null);
			}
			if(!enable){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003260')); // 振替先は無効です
				return;
			}
			var dr = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_DIRECT); // 直行・直帰申請
			var hw = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_KYUSHTU); // 休日出勤申請
			if(dr || hw){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003040', '', teasp.dialog.EmpApply.getApplyTypesName([dr, hw]))); // 先に{1}を取り消してください
				return;
			}
			if(this.args.date == exchangeDate){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10004820')); // 振替申請の再申請は振替元の日付の申請画面から行ってください。
				return;
			}
			var exDayWrap = this.pouch.getEmpDay(exchangeDate);
			var ignore0 = [ // 振替で平日→休日に変わる日にもしあっても無視する申請
				teasp.constant.APPLY_TYPE_EXCHANGE
			];
			var ignore1 = [ // 振替で休日→平日に変わる日にもしあっても無視する申請
				teasp.constant.APPLY_TYPE_ZANGYO,
				teasp.constant.APPLY_TYPE_EARLYSTART,
				teasp.constant.APPLY_TYPE_LATESTART,
				teasp.constant.APPLY_TYPE_EARLYEND,
				teasp.constant.APPLY_TYPE_EXCHANGE
			];
			var fdel = function(alst){
				var x = [];
				for(var i = 0 ; i < alst.length ; i++){
					var a = alst[i];
					// 勤務時間変更申請がある場合、勤務日の設定をしていない申請は無視するので削除
					if(a.applyType == teasp.constant.APPLY_TYPE_PATTERNS
					|| a.applyType == teasp.constant.APPLY_TYPE_PATTERNL){
						if(!a.dayType){
							x.push(i);
						}
					}
					// 勤怠時刻修正申請は承認済みなら無視するので削除
					if(a.applyType == teasp.constant.APPLY_TYPE_REVISETIME
					&& teasp.constant.STATUS_APPROVES.contains(a.status)){
						x.push(i);
					}
				}
				for(i = x.length - 1 ; i >= 0 ; i--){
					alst.splice(x[i], 1);
				}
			};
			var ngApplys = this.pouch.getApplyListByDate(startDate, (this.dayWrap.getDayType() === 0 ? ignore0 : ignore1));
			fdel(ngApplys);
			if(ngApplys.length > 0){
				var nms = teasp.dialog.EmpApply.getApplyTypesName(ngApplys);
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003040', '', nms)); // 先に{1}を取り消してください
				return;
			}
			ngApplys = this.pouch.getApplyListByDate(exchangeDate, (this.dayWrap.getDayType() === 0 ? ignore1 : ignore0));
			fdel(ngApplys);
			if(ngApplys.length > 0){
				var nms = teasp.dialog.EmpApply.getApplyTypesName(ngApplys);
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003270', teasp.util.date.formatDate(exchangeDate, 'M/d'), nms)); // 先に {0} の{1}を取り消してください
				return;
			}
			var el1 = this.pouch.getExchangeLimit();
			var el2 = this.pouch.getExchangeLimit2();
			var orgdkey = (exchangeE ? exchangeE.originalStartDate : startDate);
			var orgday = this.pouch.getDayInfoByDate(orgdkey);
			var exYm = this.pouch.getEmpMonth(null, exchangeDate);
			if(orgday.dayType != teasp.constant.DAY_TYPE_NORMAL){ // 休日に勤務した日の振替休日を選択できる期間
				if(el1 == 0){
					var ym = this.pouch.getYearMonth();
					if(ym != exYm.yearMonth){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003920', (ym % 100))); // 振替の期間制限（{0}月度末日）内の日付を指定してください
						return;
					}
				}else{
					var eom = this.pouch.getEmpMonth(null, orgdkey, el1);
					if(eom.endDate < exchangeDate){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003920', (nxm % 100))); // 振替の期間制限（{0}月度末日）内の日付を指定してください
						return;
					}
				}
			}else{ // 振替休日を取得した日の振替勤務日を選択できる期間
				if(el2 == 0){
					var ym = this.pouch.getYearMonth();
					if(ym != exYm.yearMonth){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003920', (ym % 100))); // 振替の期間制限（{0}月度末日）内の日付を指定してください
						return;
					}
				}else{
					var eom = this.pouch.getEmpMonth(null, orgdkey, el2);
					if(eom.endDate < exchangeDate){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003920', (nxm % 100))); // 振替の期間制限（{0}月度末日）内の日付を指定してください
						return;
					}
				}
			}
			var m = this.pouch.getEmpMonthByDate(exchangeDate);
			if(m && this.pouch.isEmpMonthFixed(m)){ // 対象日の月度は確定済み
				var ym = m.yearMonth;
				var sn = m.subNo;
				var ymj = teasp.util.date.formatMonth('zv00000020', Math.floor(ym / 100), (ym % 100), sn);
				teasp.dialog.EmpApply.showError(contId
						, teasp.message.getLabel('tk10005180' // {0}は勤務確定されています。{1}を見直してください。
						, ymj
						, teasp.message.getLabel('exchangeDate_label'))); // 振替日
				return;
			}
			if(this.pouch.isProhibitApplicantEliminatingLegalHoliday()){
				var begw = this.pouch.getInitialDayOfWeek();
				var tgd = startDate;
				var ow = teasp.util.date.getWeekByDate(tgd         , begw);
				var ew = teasp.util.date.getWeekByDate(exchangeDate, begw);
				if(ow[0] != ew[0]){ // 週が同じならチェックしない
					var oh = this.pouch.getFirstHolidayOfWeek(ow, tgd, exchangeDate);
					var eh = this.pouch.getFirstHolidayOfWeek(ew, exchangeDate, tgd);
					if(!oh){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10001176', // {0}～{1}の週の休日がなくなるため振替できません
								teasp.util.date.formatDate(ow[0], 'M/d+'),
								teasp.util.date.formatDate(ow[ow.length - 1], 'M/d+')));
						return;
					}
					if(!eh){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10001176', // {0}～{1}の週の休日がなくなるため振替できません
								teasp.util.date.formatDate(ew[0], 'M/d+'),
								teasp.util.date.formatDate(ew[ew.length - 1], 'M/d+')));
						return;
					}
				}
			}
			req.apply.startDate  = startDate;
			req.apply.exchangeDate  = exchangeDate;
			var mkey = null;
			// 振替の結果、休日になる方に出退時刻が入力されている場合、クリア警告を出す
			// （※振替先が別の月度の場合は警告を出さない）
			if(exDayWrap){
				if(this.pouch.isDayInMonth(startDate) && this.pouch.isDayInMonth(exchangeDate)){
					var cw1 = (this.pouch.getObj().works ? this.pouch.getClassifyJobWorks(startDate)    : null);
					var cw2 = (this.pouch.getObj().works ? this.pouch.getClassifyJobWorks(exchangeDate) : null);
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
				if(mkey){
					teasp.manager.dialogOpen('MessageBox', {
						title   : teasp.message.getLabel('em10002080'), // 確認
						message : teasp.message.getLabel(mkey) // 入力された時間をクリアします。よろしいですか？
					}, this.pouch, this, function(){
						this.submitExchangeApply(contId, req, osd);
					});
				}
			}
			if(!mkey){
				this.submitExchangeApply(contId, req, osd);
			}
		}));
	}
};

teasp.dialog.EmpApply.prototype.submitExchangeApply = function(contId, req, osd){
	if(this.pouch.isRequireNote(teasp.constant.APPLY_KEY_EXCHANGES)
	&&(!req.apply.note || !req.apply.note.replace(/[\s　]+$/g,''))){
		teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003680')); // 備考を入力してください
		return;
	}
	if(osd){
		teasp.manager.dialogOpen('BusyWait');
		this.checkExchangeApplys(osd, req.apply.startDate, dojo.hitch(this, function(applys, od, ed){
			var d = od;
			applys = applys.sort(function(a, b){
				return (a.applyTime < b.applyTime ? -1 : 1);
			});
			while(d != ed){
				var pd = d;
				for(var i = 0 ; i < applys.length ; i++){
					var a = applys[i];
					if(a.startDate != d){
						continue;
					}
					if(teasp.constant.STATUS_FIX.contains(a.status)){ // 有効な申請
						d = a.exchangeDate;
						break;
					}
				}
				if(pd == d){
					break;
				}
			}
			if(d != ed){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10005350'));
				teasp.manager.dialogClose('BusyWait');
				return;
			}
			// サーバへ送信
			this.requestSend(contId, req, true);
		}));
	}else{
		// サーバへ送信
		this.requestSend(contId, req);
	}
};

