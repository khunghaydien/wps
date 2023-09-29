/**
 * 勤務表のロード
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId</td><td>{string}</td><td>社員ID</td><td>省略可</td></tr>
 *     <tr><td>month</td><td>{number}</td><td>月度  </td><td>省略可</td></tr>
 *     <tr><td>mode </td><td>{string}</td><td>モード</td><td>省略可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.loadEmpMonth = function(params, pouch, thisObject, onSuccess, onFailure){
	var o = { params: params };
	teasp.action.contact.remoteMethod(
		'loadEmpMonth',
		[
			(params.empId || '')
			, (params.month || '')
			, (params.mode  || '')
			, (params.date  || '')
			, (params.subNo || '')
		],
		function(result){
			if(result.result == 'OK'){
				pouch.setKeyObj('params', o.params);
				var s = null, t = null;
				if(result.targetEmp.length == 1){ // レコードが１件の場合、対象社員とセッションユーザは同じ
					t  = result.targetEmp[0];
					s  = result.targetEmp[0];
				}else if(result.targetEmp.length > 1){
					t  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 0 : 1];
					s  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 1 : 0];
				}
				pouch.setKeyObj('sessionInfo', teasp.logic.convert.convSessionInfoObj(s, t, result.rights));
				pouch.setKeyObj('targetEmp'  , teasp.logic.convert.convTargetEmpObj(t, o.params.mode));

				// 勤務体系履歴と勤務体系リストをセット（必ず pouch.setKeyObj('months'..) より前で呼ぶ）
				pouch.setKeyObj('empTypeInfo', teasp.logic.convert.convEmpTypeInfo(result.empTypeInfo, result.yearMonth, result.startDate));

				pouch.setKeyObj('common'     , teasp.logic.convert.convCommonObj(result.common, result.borderRevNo));
				if(!pouch.getEmpId()){
					onSuccess.apply(thisObject, [true]);
				}else{
					pouch.setKeyObj('empMonthList'   , result.empMonthList);
					pouch.setParams(dojo.mixin({}, teasp.action.contact.createParamByEmpMonth(pouch, result.yearMonth, result.startDate)));
					pouch.setKeyObj('deptHist'       , teasp.logic.convert.convDeptHist(result.deptHist));
					pouch.setKeyObj('months'         , teasp.logic.convert.convEmpMonthObjs(result.empMonths, result.deptMonths, pouch.getEmpMonthCustomKeys()));
					pouch.setKeyObj('configs'        , teasp.logic.convert.convConfigObjs(result.configs));
					pouch.setKeyObj('applys'         , teasp.logic.convert.convEmpApplyObjs(result.empApplys));
					pouch.setParams(dojo.mixin({}, teasp.action.contact.createParamByEmpApplys(pouch, pouch.getKeyObj('applys'))));

					pouch.setKeyObj('cals'           , teasp.logic.convert.convCalendarObjs(result.calendar));
					pouch.setKeyObj('empTypePatterns', teasp.logic.convert.convEmpTypePatternObjs(result.empTypePattern));
					pouch.setKeyObj('patterns'       , teasp.logic.convert.convPatternObjs(result.empTypePattern));
					pouch.setKeyObj('days'           , teasp.logic.convert.convEmpDayObjs(result.empDays));
					pouch.setKeyObj('infos'          , teasp.logic.convert.convInfoObjs(result.infos));
					pouch.setKeyObj('sumTime'        , teasp.logic.convert.convSumTimeObjs(result));
					pouch.setKeyObj('rejects'        , teasp.logic.convert.convRejectApplyList(result));
					pouch.setKeyObj('cancels'        , teasp.logic.convert.convCancelApplyList(result));
					pouch.setKeyObj('approver'       , teasp.logic.convert.convApprover(result.approver));
					pouch.setKeyObj('stocks'         , teasp.logic.convert.convStockObjs(result.stocks));
					pouch.setKeyObj('jobAssigns'     , teasp.logic.convert.convJobAssignObjs(result.jobAssign || []));
					pouch.setKeyObj('works'          , teasp.logic.convert.convWorkObjs(result.empWorks || []));
					pouch.setKeyObj('jobApplys'      , teasp.logic.convert.convJobApplysObj(result.jobApplys || []));
					pouch.setKeyObj('workLocations'  , result.workLocations || []);

					var empTime  = new teasp.logic.EmpTime(pouch);
					empTime.mergeCalendar();
					empTime.buildConfig();
					empTime.buildEmpMonth();

					onSuccess.apply(thisObject, [o.params.noDelay ? true : false]);
					if(!o.params.noDelay){
						teasp.action.contact.loadEmpMonthDelay(params, pouch, thisObject, onSuccess, onFailure);
					}
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 勤務表のロード後の遅延データ取得
 *
 * @param {Object} params パラメータ
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.loadEmpMonthDelay = function(params, pouch, thisObject, onSuccess, onFailure){
	var startYm = teasp.util.date.addYearMonth(pouch.getYearMonth(),-13); // １年前の月度の値を得る
	var endYm   = teasp.util.date.addYearMonth(pouch.getYearMonth(), 13); // １年後の月度の値を得る
	var startM = pouch.getEmpMonth(startYm, null, 0, true);
	var endM   = pouch.getEmpMonth(endYm  , null);
	var o = {
		params: {
			empId         : pouch.getEmpId()                       // 社員ID
			, empTypeId     : pouch.getEmpTypeId()                   // 勤務体系ID
			, startDate     : startM.startDate                       // 翌月度の開始日
			, endDate       : endM.endDate                           // Nか月後の月度の末日
			, baseStartDate : pouch.getEmpMonthStartDate()           // 有休残日数の基準日（開始日）
			, baseEndDate   : pouch.getEmpMonthLastDate()            // 有休残日数の基準日（終了日）
			, endLdate      : endM.endDate                           // 計画付与有休の取得範囲末日
		}
	};
	var reqs = [
		o.params.empId
		, o.params.empTypeId
		, o.params.startDate
		, o.params.endDate
		, o.params.baseStartDate
		, o.params.baseEndDate
		, o.params.endLdate
	];
	if(params && params.date){
		reqs.push(params.date);
	}
	teasp.action.contact.remoteMethod('loadEmpMonthDelay',
		reqs,
		function(result){
			if(result.result == 'OK'){
				pouch.setKeyObj('holidays'       , teasp.logic.convert.convEmpTypeHolidayObjs(result.empTypeHoliday));
				pouch.setKeyObj('yuqRemains'     , teasp.logic.convert.convYuqRemainObjs(result.yuqRemains));
				pouch.setKeyObj('plannedHolidays', result.plannedHolidays);
				pouch.setNextMonth(teasp.logic.convert.convCalendarObjs(result.calendar),
									teasp.logic.convert.convSimpleEmpDayObjs(result.simpleDays),
									teasp.action.createApplyMap(teasp.logic.convert.convEmpApplyObjs(result.empApplys)),
									o.params.startDate, o.params.endDate,
									teasp.logic.convert.convConfigMinObjs(result.configMins)
									); // nextMonth を作る
				pouch.setKeyObj('approverSet'    , teasp.logic.convert.convApproverSetObjs(result.approverSet));
				pouch.setKeyObj('depts'          , teasp.logic.convert.convDeptList(result.depts));
				pouch.setKeyObj('configHistory'  , teasp.logic.convert.convConfigHistory(result.configHistory));
				var steps = teasp.logic.convert.convMixApplySteps(result, true);
				onSuccess.apply(thisObject, [true, steps]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

teasp.action.createApplyMap = function(_applys){
	var applys = _applys || [];
	var amap = {};
	for(var j = 0 ; j < applys.length ; j++){
		var a = applys[j];
		var excludeDate = ((a.holiday && a.holiday.displayDaysOnCalendar) ? [] : a.excludeDate);
		var sd = a.startDate;
		var ed = (a.endDate || a.startDate);
		if(!sd || typeof(sd) != 'string'){
			continue;
		}
		var dlst = teasp.util.date.getDateList(sd, ed);
		if(a.exchangeDate && !dlst.contains(a.exchangeDate)){
			dlst.push(a.exchangeDate);
		}
		for(var x = 0 ; x < dlst.length ; x++){
			var d = dlst[x];
			if(teasp.constant.STATUS_FIX.contains(a.status)
			&& ((sd <= d && d <= ed) || (a.exchangeDate == d))
			&& !excludeDate.contains(d)){
				var l = amap[d];
				if(!l){
					l = amap[d] = [];
				}
				l.push(a);
			}
		}
	}
	return amap;
};

/**
 * 勤務表の月度変更
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId</td><td>{string}</td><td>社員ID</td><td>省略不可</td></tr>
 *     <tr><td>month</td><td>{number}</td><td>月度  </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.transEmpMonth = function(params, pouch, thisObject, onSuccess, onFailure){
	var o = { params: params };
	teasp.action.contact.remoteMethod('transEmpMonth',
		[
			params.empId
			, params.month
			, pouch.getMode()
			, params.startDate
		],
		function(result){
			if(result.result == 'OK'){
				// 勤務体系履歴と勤務体系リストをセット（必ず pouch.setKeyObj('months'..) より前で呼ぶ）
				pouch.setKeyObj('empTypeInfo', teasp.logic.convert.convEmpTypeInfo(result.empTypeInfo, result.yearMonth, result.startDate));

				pouch.setKeyObj('empMonthList'   , result.empMonthList);
				pouch.setParams(dojo.mixin(o.params, teasp.action.contact.createParamByEmpMonth(pouch, result.yearMonth, result.startDate)));

				// 勤務体系履歴から勤務体系をセット（必ず pouch.setKeyObj('months'..) より前で呼ぶ）
				pouch.setEmpTypeByDate(result.yearMonth, result.startDate);

				pouch.setKeyObj('months'         , teasp.logic.convert.convEmpMonthObjs(result.empMonths, result.deptMonths, pouch.getEmpMonthCustomKeys()));
				pouch.setKeyObj('configs'        , teasp.logic.convert.convConfigObjs(result.configs));
				pouch.setKeyObj('applys'         , teasp.logic.convert.convEmpApplyObjs(result.empApplys));
				pouch.setParams(dojo.mixin({}, teasp.action.contact.createParamByEmpApplys(pouch, pouch.getKeyObj('applys'))));
				pouch.setKeyObj('cals'           , teasp.logic.convert.convCalendarObjs(result.calendar));
				pouch.setKeyObj('empTypePatterns', teasp.logic.convert.convEmpTypePatternObjs(result.empTypePattern));
				pouch.setKeyObj('patterns'       , teasp.logic.convert.convPatternObjs(result.empTypePattern));
				pouch.setKeyObj('days'           , teasp.logic.convert.convEmpDayObjs(result.empDays));
				pouch.setKeyObj('sumTime'        , teasp.logic.convert.convSumTimeObjs(result));
				pouch.setKeyObj('rejects'        , teasp.logic.convert.convRejectApplyList(result));
				pouch.setKeyObj('cancels'        , teasp.logic.convert.convCancelApplyList(result));
				pouch.setKeyObj('approver'       , teasp.logic.convert.convApprover(result.approver));
				pouch.setKeyObj('stocks'         , teasp.logic.convert.convStockObjs(result.stocks));
				pouch.setKeyObj('works'          , teasp.logic.convert.convWorkObjs(result.empWorks || []));
				pouch.setKeyObj('jobApplys'      , teasp.logic.convert.convJobApplysObj(result.jobApplys || []));

				var empTime  = new teasp.logic.EmpTime(pouch);
				empTime.mergeCalendar();
				empTime.buildConfig();
				empTime.buildEmpMonth();
				onSuccess.apply(thisObject, [(o.params.noDelay ? true : false), pouch.getObj()]);

				if(!o.params.noDelay){
					teasp.action.contact.transEmpMonthDelay(params, pouch, thisObject, onSuccess, onFailure);
				}else{
					pouch.getObj().dayMap = null;
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 勤務表の月度変更の遅延データ取得
 *
 * @param {Object} params
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.transEmpMonthDelay = function(params, pouch, thisObject, onSuccess, onFailure){
	var startYm = teasp.util.date.addYearMonth(pouch.getYearMonth(),-13); // １年前の月度の値を得る
	var endYm   = teasp.util.date.addYearMonth(pouch.getYearMonth(), 13); // １年後の月度の値を得る
	var startM = pouch.getEmpMonth(startYm, null, 0, true);
	var endM   = pouch.getEmpMonth(endYm  , null);
	var o = {
		params: {
			empId         : pouch.getEmpId()                                // 社員ID
			, empTypeId     : pouch.getEmpTypeId()                            // 勤務体系ID
			, startDate     : startM.startDate                                 // 翌月度の開始日
			, endDate       : endM.endDate                                   // 翌月度の末日
			, baseStartDate : pouch.getEmpMonthStartDate()                    // 有休残日数の基準日（開始日）
			, baseEndDate   : pouch.getEmpMonthLastDate()                     // 有休残日数の基準日（終了日）
			, endLdate      : teasp.util.date.addMonths(startM.startDate, 12)  // 計画付与有休の取得範囲末日
		}
	};
	teasp.action.contact.remoteMethod('transEmpMonthDelay',
		[
			o.params.empId
			, o.params.empTypeId
			, o.params.startDate
			, o.params.endDate
			, o.params.baseStartDate
			, o.params.baseEndDate
			, o.params.endLdate
		],
		function(result){
			if(result.result == 'OK'){
				pouch.setKeyObj('yuqRemains'     , teasp.logic.convert.convYuqRemainObjs(result.yuqRemains));
				pouch.setKeyObj('plannedHolidays', result.plannedHolidays);
				pouch.setNextMonth(teasp.logic.convert.convCalendarObjs(result.calendar),
									teasp.logic.convert.convSimpleEmpDayObjs(result.simpleDays),
									teasp.action.createApplyMap(teasp.logic.convert.convEmpApplyObjs(result.empApplys)),
									o.params.startDate, o.params.endDate,
									teasp.logic.convert.convConfigMinObjs(result.configMins)
									); // nextMonth を作る
				onSuccess.apply(thisObject, [true]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 月次サマリー
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId</td><td>{string}</td><td>社員ID</td><td>省略不可</td></tr>
 *     <tr><td>month</td><td>{number}</td><td>月度  </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.loadEmpMonthPrint = function(params, pouch, thisObject, onSuccess, onFailure){
	var o = { params: params };
	teasp.action.contact.remoteMethod('loadEmpMonthPrint',
		[
			(params.empId || '')
			, (params.month || '')
			, 'read'
			, (params.date || '')
			, (params.subNo || '')
		],
		function(result){
			if(result.result == 'OK'){
				pouch.setKeyObj('params', o.params);
				var s = null, t = null;
				if(result.targetEmp.length == 1){ // レコードが１件の場合、対象社員とセッションユーザは同じ
					t  = result.targetEmp[0];
					s  = result.targetEmp[0];
				}else if(result.targetEmp.length > 1){
					t  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 0 : 1];
					s  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 1 : 0];
				}
				pouch.setKeyObj('sessionInfo'    , teasp.logic.convert.convSessionInfoObj(s, t, result.rights));
				pouch.setKeyObj('targetEmp'      , teasp.logic.convert.convTargetEmpObj(t, o.params.mode));

				// 勤務体系履歴と勤務体系リストをセット（必ず pouch.setKeyObj('months'..) より前で呼ぶ）
				pouch.setKeyObj('empTypeInfo'    , teasp.logic.convert.convEmpTypeInfo(result.empTypeInfo, result.yearMonth, result.startDate));

				pouch.setKeyObj('common'         , teasp.logic.convert.convCommonObj(result.common, result.borderRevNo));
				if(!pouch.getEmpId()){
					onSuccess.apply(thisObject, [true]);
				}else{
					pouch.setKeyObj('empMonthList'   , result.empMonthList);
					pouch.setParams(dojo.mixin({}, teasp.action.contact.createParamByEmpMonth(pouch, result.yearMonth, result.startDate)));
					pouch.setKeyObj('deptHist'       , teasp.logic.convert.convDeptHist(result.deptHist));
					pouch.setKeyObj('months'         , teasp.logic.convert.convEmpMonthObjs(result.empMonths, result.deptMonths, pouch.getEmpMonthCustomKeys()));
					pouch.setKeyObj('configs'        , teasp.logic.convert.convConfigObjs(result.configs));
					pouch.setKeyObj('applys'         , teasp.logic.convert.convEmpApplyObjs(result.empApplys));
					pouch.setParams(dojo.mixin({}, teasp.action.contact.createParamByEmpApplys(pouch, pouch.getKeyObj('applys'))));

					pouch.setKeyObj('cals'           , teasp.logic.convert.convCalendarObjs(result.calendar));
					pouch.setKeyObj('empTypePatterns', teasp.logic.convert.convEmpTypePatternObjs(result.empTypePattern));
					pouch.setKeyObj('patterns'       , teasp.logic.convert.convPatternObjs(result.empTypePattern));
					pouch.setKeyObj('days'           , teasp.logic.convert.convEmpDayObjs(result.empDays));
					pouch.setKeyObj('infos'          , teasp.logic.convert.convInfoObjs(result.infos));
					pouch.setKeyObj('sumTime'        , teasp.logic.convert.convSumTimeObjs(result));
					pouch.setKeyObj('yuqRemains'     , teasp.logic.convert.convYuqRemainObjs(result.yuqRemains));
					pouch.setKeyObj('plannedHolidays', result.plannedHolidays);
					pouch.setKeyObj('approver'       , teasp.logic.convert.convApprover(result.approver));
					pouch.setKeyObj('workLocations'  , result.workLocations || []);

					var empTime  = new teasp.logic.EmpTime(pouch);
					empTime.mergeCalendar();
					empTime.buildConfig();
					empTime.buildEmpMonth();

					onSuccess.apply(thisObject, [true]);
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 個人設定のロード
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId</td><td>{string}</td><td>社員ID</td><td>省略可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.loadEmpConfig = function(params, pouch, thisObject, onSuccess, onFailure){
	var o = { params: params };
	teasp.action.contact.remoteMethod('loadEmpConfig',
		[
				(params.empId || '')
			, ''
			, 'read'
		],
		function(result){
			if(result.result == 'OK'){
				pouch.setKeyObj('params', o.params);
				var s = null, t = null;
				if(result.targetEmp.length == 1){ // レコードが１件の場合、対象社員とセッションユーザは同じ
					t  = result.targetEmp[0];
					s  = result.targetEmp[0];
				}else if(result.targetEmp.length > 1){
					t  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 0 : 1];
					s  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 1 : 0];
				}
				pouch.setKeyObj('sessionInfo'    , teasp.logic.convert.convSessionInfoObj(s, t, result.rights));
				pouch.setKeyObj('targetEmp'      , teasp.logic.convert.convTargetEmpObj(t, o.params.mode));

				// 勤務体系履歴と勤務体系リストをセット（必ず pouch.setKeyObj('months'..) より前で呼ぶ）
				pouch.setKeyObj('empTypeInfo'    , teasp.logic.convert.convEmpTypeInfo(result.empTypeInfo, result.yearMonth, result.startDate));

				pouch.setKeyObj('common'         , teasp.logic.convert.convCommonObj(result.common, result.borderRevNo));
				if(!pouch.getEmpId()){
					onSuccess.apply(thisObject, [true]);
				}else{
					pouch.setKeyObj('empMonthList'   , result.empMonthList);
					pouch.setParams(dojo.mixin({}, teasp.action.contact.createParamByEmpMonth(pouch, result.yearMonth, result.startDate)));
					pouch.setKeyObj('months'         , teasp.logic.convert.convEmpMonthObjs(result.empMonths, result.deptMonths, pouch.getEmpMonthCustomKeys()));
					pouch.setKeyObj('configs'        , teasp.logic.convert.convConfigObjs(result.configs));
					pouch.setKeyObj('applys'         , teasp.logic.convert.convEmpApplyObjs(result.empApplys));
					pouch.setParams(dojo.mixin({}, teasp.action.contact.createParamByEmpApplys(pouch, pouch.getKeyObj('applys'))));

					pouch.setKeyObj('cals'           , teasp.logic.convert.convCalendarObjs(result.calendar));
					pouch.setKeyObj('empTypePatterns', teasp.logic.convert.convEmpTypePatternObjs(result.empTypePattern));
					pouch.setKeyObj('patterns'       , teasp.logic.convert.convPatternObjs(result.empTypePattern));
					pouch.setKeyObj('holidays'       , teasp.logic.convert.convEmpTypeHolidayObjs(result.empTypeHoliday));
					pouch.setKeyObj('days'           , teasp.logic.convert.convEmpDayObjs(result.empDays));
					pouch.setKeyObj('infos'          , teasp.logic.convert.convInfoObjs(result.infos));
					pouch.setKeyObj('sumTime'        , teasp.logic.convert.convSumTimeObjs(result));
					pouch.setKeyObj('yuqRemains'     , teasp.logic.convert.convYuqRemainObjs(result.yuqRemains));
					pouch.setKeyObj('stocks'         , teasp.logic.convert.convStockObjs(result.stocks));
//					pouch.setKeyObj('holidayHistory' , teasp.logic.convert.convHolidayHistoryObjs(result.holidayHistory));
					pouch.setKeyObj('commuterPasses' , teasp.logic.convert.convCommuterPasses(result.commuterPasses));

					var empTime  = new teasp.logic.EmpTime(pouch);
					empTime.mergeCalendar();
					empTime.buildConfig();
					empTime.buildEmpMonth();

					onSuccess.apply(thisObject, [true]);
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * ウィジェット画面のロード
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId</td><td>{string}</td><td>社員ID</td><td>省略可</td></tr>
 *     <tr><td>month</td><td>{number}</td><td>月度  </td><td>省略可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.loadWidget = function(params, pouch, thisObject, onSuccess, onFailure){
	var o = { params: params };
	teasp.action.contact.remoteMethod('loadWidget', [ '', ''],
		function(result){
			if(result.result == 'OK'){
				pouch.setKeyObj('params', o.params);
				var s = null, t = null;
				if(result.targetEmp.length == 1){ // レコードが１件の場合、対象社員とセッションユーザは同じ
					t  = result.targetEmp[0];
					s  = result.targetEmp[0];
				}else if(result.targetEmp.length > 1){
					t  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 0 : 1];
					s  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 1 : 0];
				}
				pouch.setKeyObj('sessionInfo'    , teasp.logic.convert.convSessionInfoObj(s, t, result.rights));
				pouch.setKeyObj('targetEmp'      , teasp.logic.convert.convTargetEmpObj(t, o.params.mode));

				// 勤務体系履歴と勤務体系リストをセット（必ず pouch.setKeyObj('months'..) より前で呼ぶ）
				pouch.setKeyObj('empTypeInfo'    , teasp.logic.convert.convEmpTypeInfo(result.empTypeInfo, result.yearMonth, result.startDate));

				pouch.setKeyObj('common'         , teasp.logic.convert.convCommonObj(result.common, result.borderRevNo));
				if(!pouch.getEmpId()){
					onSuccess.apply(thisObject, [true]);
				}else{
					pouch.setKeyObj('empMonthList'   , result.empMonthList);
					pouch.setParams(dojo.mixin({}, teasp.action.contact.createParamByEmpMonth(pouch, result.yearMonth, result.startDate)));
					pouch.setKeyObj('months'         , teasp.logic.convert.convEmpMonthObjs(result.empMonths, result.deptMonths, pouch.getEmpMonthCustomKeys()));
					pouch.setKeyObj('configs'        , teasp.logic.convert.convConfigObjs(result.configs));
					pouch.setKeyObj('applys'         , teasp.logic.convert.convEmpApplyObjs(result.empApplys));
					pouch.setParams(dojo.mixin({}, teasp.action.contact.createParamByEmpApplys(pouch, pouch.getKeyObj('applys'))));

					pouch.setKeyObj('cals'           , teasp.logic.convert.convCalendarObjs(result.calendar));
					pouch.setKeyObj('empTypePatterns', teasp.logic.convert.convEmpTypePatternObjs(result.empTypePattern));
					pouch.setKeyObj('patterns'       , teasp.logic.convert.convPatternObjs(result.empTypePattern));
					pouch.setKeyObj('days'           , teasp.logic.convert.convEmpDayObjs(result.empDays));
					pouch.setKeyObj('infos'          , teasp.logic.convert.convInfoObjs(result.infos));
					pouch.setKeyObj('sumTime'        , teasp.logic.convert.convSumTimeObjs(result));
					pouch.setKeyObj('rejects'        , teasp.logic.convert.convRejectApplyList(result));
					pouch.setKeyObj('cancels'        , teasp.logic.convert.convCancelApplyList(result));
					pouch.setKeyObj('workLocations'  , result.workLocations || []);

					var empTime  = new teasp.logic.EmpTime(pouch);
					empTime.mergeCalendar();
					empTime.buildConfig();
					empTime.buildEmpMonth();

					onSuccess.apply(thisObject, [true]);
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * タイムレポートのロード
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId</td><td>{string}</td><td>社員ID</td><td>省略可</td></tr>
 *     <tr><td>date </td><td>{string}</td><td>日付  </td><td>省略可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.loadEmpDay = function(params, pouch, thisObject, onSuccess, onFailure){
	var o = { params: params };
	teasp.action.contact.remoteMethod('loadEmpDay',
		[
			(params.empId || '')
			, (params.date  || '')
			, (params.mode  || '')
		],
		function(result){
			if(result.result == 'OK'){
				pouch.setKeyObj('params', o.params);
				var s = null, t = null;
				if(result.targetEmp.length == 1){ // レコードが１件の場合、対象社員とセッションユーザは同じ
					t  = result.targetEmp[0];
					s  = result.targetEmp[0];
				}else if(result.targetEmp.length > 1){
					t  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 0 : 1];
					s  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 1 : 0];
				}
				pouch.setKeyObj('sessionInfo'    , teasp.logic.convert.convSessionInfoObj(s, t, result.rights));
				pouch.setKeyObj('targetEmp'      , teasp.logic.convert.convTargetEmpObj(t, o.params.mode));

				// 勤務体系履歴と勤務体系リストをセット（必ず pouch.setKeyObj('months'..) より前で呼ぶ）
				pouch.setKeyObj('empTypeInfo'    , teasp.logic.convert.convEmpTypeInfo(result.empTypeInfo, result.yearMonth, teasp.logic.convert.valDate(result.date)));

				pouch.setKeyObj('common'         , teasp.logic.convert.convCommonObj(result.common, result.borderRevNo));
				if(!pouch.getEmpId()){
					onSuccess.apply(thisObject, [true]);
				}else{
					pouch.setKeyObj('empMonthList'   , result.empMonthList);
					pouch.setParams(dojo.mixin({}, teasp.action.contact.createParamByEmpMonth(pouch, result.yearMonth, result.startDate)));
					pouch.setKeyObj('deptHist'       , teasp.logic.convert.convDeptHist(result.deptHist));
					pouch.setKeyObj('months'         , teasp.logic.convert.convEmpMonthObjs(result.empMonths, result.deptMonths, pouch.getEmpMonthCustomKeys()));
					pouch.setKeyObj('configs'        , teasp.logic.convert.convConfigObjs(result.configs || []));
					pouch.setKeyObj('applys'         , teasp.logic.convert.convEmpApplyObjs(result.empApplys || []));
					pouch.setParams(dojo.mixin({}, teasp.action.contact.createParamByEmpApplys(pouch, pouch.getKeyObj('applys'))));

					pouch.setKeyObj('cals'           , teasp.logic.convert.convCalendarObjs(result.calendar || []));
					pouch.setKeyObj('empTypePatterns', teasp.logic.convert.convEmpTypePatternObjs(result.empTypePattern || []));
					pouch.setKeyObj('patterns'       , teasp.logic.convert.convPatternObjs(result.empTypePattern || []));
					pouch.setKeyObj('days'           , teasp.logic.convert.convEmpDayObjs(result.empDays || []));
					pouch.setKeyObj('infos'          , teasp.logic.convert.convInfoObjs(result.infos || []));
					pouch.setKeyObj('sumTime'        , teasp.logic.convert.convSumTimeObjs(result));
					pouch.setKeyObj('rejects'        , teasp.logic.convert.convRejectApplyList(result));
					pouch.setKeyObj('cancels'        , teasp.logic.convert.convCancelApplyList(result));
					pouch.setKeyObj('approver'       , teasp.logic.convert.convApprover(result.approver));
					pouch.setKeyObj('stocks'         , teasp.logic.convert.convStockObjs(result.stocks));

					pouch.setKeyObj('jobApply'       , teasp.logic.convert.convJobApplyObj(result.jobApply || null));
					pouch.setKeyObj('jobAssigns'     , teasp.logic.convert.convJobAssignObjs(result.jobAssign || []));
					pouch.setKeyObj('works'          , teasp.logic.convert.convWorkObjs(result.empWorks || []));
					pouch.setKeyObj('expLogs'        , teasp.logic.convert.convExpLogObjs(result.expLogs || []));
					pouch.setKeyObj('events'         , teasp.logic.convert.convEvents(result.events || []));
					pouch.setKeyObj('txsLogs'        , teasp.logic.convert.convTxsLogs(result.txsLogs || []));

					pouch.setKeyObj('calAccessService', teasp.logic.convert.convCalAccessService(result.calAccessService || ''));
					pouch.setKeyObj('calAuthResult'   , teasp.logic.convert.convCalAuthResult(result.calAuthResult || {}));
					pouch.setKeyObj('workLocations'   , result.workLocations || []);

					if(tsfManager){
						var empExps = result.empExps || [];
						teasp.logic.convert.excludeNameSpace(empExps);
						tsfManager.showFormT(empExps, pouch.getParamDate());
					}

					var empTime  = new teasp.logic.EmpTime(pouch);
					empTime.mergeCalendar();
					empTime.buildConfig();
					empTime.buildEmpMonth();

					onSuccess.apply(thisObject, [false]);

					teasp.action.contact.loadEmpDayDelay(pouch, thisObject, onSuccess, onFailure);
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * タイムレポートのロード後の遅延データ取得
 *
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.loadEmpDayDelay = function(pouch, thisObject, onSuccess, onFailure){
	var startYm = teasp.util.date.addYearMonth(pouch.getYearMonth(),-13); // １年前の月度の値を得る
	var endYm   = teasp.util.date.addYearMonth(pouch.getYearMonth(), 13); // １年後の月度の値を得る
	var startM = pouch.getEmpMonth(startYm, null, 0, true);
	var endM   = pouch.getEmpMonth(endYm  , null);
	var o = {
		params: {
			empId     : pouch.getEmpId()                                // 社員ID
			, date      : pouch.getParamDate()
			, mode      : pouch.getMode()
			, empTypeId : pouch.getEmpTypeId()                            // 勤務体系ID
			, startDate : startM.startDate                                 // 翌月度の開始日
			, endDate   : endM.endDate                                   // 翌月度の末日
			, baseDate  : pouch.getEmpMonthLastDate()                     // 有休残日数の基準日
			, endLdate  : teasp.util.date.addMonths(startM.startDate, 12)  // 計画付与有休の取得範囲末日
		}
	};
	teasp.action.contact.remoteMethod('loadEmpDayDelay',
		[
			o.params.empId
		, o.params.date
		, o.params.mode
		, o.params.empTypeId
		, o.params.startDate
		, o.params.endDate
		, o.params.baseDate
		, o.params.endLdate
		],
		function(result){
			if(result.result == 'OK'){
				pouch.setKeyObj('expItems'       , teasp.logic.convert.convExpItemObjs(result.expItems || []));
				pouch.setKeyObj('foreignCurrency', teasp.logic.convert.convForeignCurrencyObjs(result.foreignCurrency || []));
				pouch.setKeyObj('expHistory'     , (result.expHistory || null));
				pouch.setKeyObj('holidays'       , teasp.logic.convert.convEmpTypeHolidayObjs(result.empTypeHoliday));
				pouch.setKeyObj('yuqRemains'     , teasp.logic.convert.convYuqRemainObjs(result.yuqRemains));
				pouch.setKeyObj('plannedHolidays', result.plannedHolidays);
				pouch.setNextMonth(teasp.logic.convert.convCalendarObjs(result.calendar),
									teasp.logic.convert.convSimpleEmpDayObjs(result.simpleDays),
									teasp.action.createApplyMap(teasp.logic.convert.convEmpApplyObjs(result.empApplys)),
									o.params.startDate, o.params.endDate,
									teasp.logic.convert.convConfigMinObjs(result.configMins)
									); // nextMonth を作る
				pouch.setKeyObj('approverSet'    , teasp.logic.convert.convApproverSetObjs(result.approverSet));
				pouch.setKeyObj('depts'          , teasp.logic.convert.convDeptList(result.depts));
				pouch.setKeyObj('configHistory'  , teasp.logic.convert.convConfigHistory(result.configHistory));
				onSuccess.apply(thisObject, [true]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * タイムレポートの日付変更
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId</td><td>{string}</td><td>社員ID</td><td>省略不可</td></tr>
 *     <tr><td>date </td><td>{string}</td><td>日付  </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.transEmpDay = function(params, pouch, thisObject, onSuccess, onFailure){
	var o = { params: params };
	teasp.action.contact.remoteMethod('transEmpDay',
		[
			params.empId
			, params.date
			, pouch.getMode()
		],
		function(result){
			if(result.result == 'OK'){
				pouch.resetDailyData();
				pouch.setKeyObj('params', o.params);
				// 勤務体系履歴と勤務体系リストをセット（必ず pouch.setKeyObj('months'..) より前で呼ぶ）
				pouch.setKeyObj('empTypeInfo', teasp.logic.convert.convEmpTypeInfo(result.empTypeInfo, result.yearMonth, result.startDate));

				pouch.setKeyObj('empMonthList'   , result.empMonthList);
				pouch.setParams(dojo.mixin({}, teasp.action.contact.createParamByEmpMonth(pouch, result.yearMonth, result.startDate)));

				// 勤務体系履歴から勤務体系をセット（必ず pouch.setKeyObj('months'..) より前で呼ぶ）
				pouch.setEmpTypeByDate(null, teasp.logic.convert.valDate(result.date));

				pouch.setKeyObj('months'         , teasp.logic.convert.convEmpMonthObjs(result.empMonths, result.deptMonths, pouch.getEmpMonthCustomKeys()));
				pouch.setKeyObj('configs'        , teasp.logic.convert.convConfigObjs(result.configs || []));
				pouch.setKeyObj('applys'         , teasp.logic.convert.convEmpApplyObjs(result.empApplys || []));
				pouch.setParams(dojo.mixin({}, teasp.action.contact.createParamByEmpApplys(pouch, pouch.getKeyObj('applys'))));
				pouch.setKeyObj('cals'           , teasp.logic.convert.convCalendarObjs(result.calendar || []));
				pouch.setKeyObj('empTypePatterns', teasp.logic.convert.convEmpTypePatternObjs(result.empTypePattern || []));
				pouch.setKeyObj('patterns'       , teasp.logic.convert.convPatternObjs(result.empTypePattern || []));
				pouch.setKeyObj('holidays'       , teasp.logic.convert.convEmpTypeHolidayObjs(result.empTypeHoliday));
				pouch.setKeyObj('days'           , teasp.logic.convert.convEmpDayObjs(result.empDays || []));
				pouch.setKeyObj('infos'          , teasp.logic.convert.convInfoObjs(result.infos || []));
				pouch.setKeyObj('sumTime'        , teasp.logic.convert.convSumTimeObjs(result));
				pouch.setKeyObj('approver'       , teasp.logic.convert.convApprover(result.approver));
				pouch.setKeyObj('stocks'         , teasp.logic.convert.convStockObjs(result.stocks));

				pouch.setKeyObj('jobApply'       , teasp.logic.convert.convJobApplyObj(result.jobApply || null));
				pouch.setKeyObj('works'          , teasp.logic.convert.convWorkObjs(result.empWorks || []));
				pouch.setKeyObj('expLogs'        , teasp.logic.convert.convExpLogObjs(result.expLogs || []));
				pouch.setKeyObj('events'         , teasp.logic.convert.convEvents(result.events || []));
				pouch.setKeyObj('txsLogs'        , teasp.logic.convert.convTxsLogs(result.txsLogs || []));
				pouch.setKeyObj('rejects'        , teasp.logic.convert.convRejectApplyList(result));
				pouch.setKeyObj('cancels'        , teasp.logic.convert.convCancelApplyList(result));

				pouch.setKeyObj('calAccessService', teasp.logic.convert.convCalAccessService(result.calAccessService || ''));
				pouch.setKeyObj('calAuthResult'   , teasp.logic.convert.convCalAuthResult(result.calAuthResult || ''));

				if(tsfManager){
					var empExps = result.empExps || [];
					teasp.logic.convert.excludeNameSpace(empExps);
					tsfManager.showFormT(empExps, pouch.getParamDate());
				}

				var empTime  = new teasp.logic.EmpTime(pouch);
				empTime.mergeCalendar();
				empTime.buildConfig();
				empTime.buildEmpMonth();
				onSuccess.apply(thisObject, [true, pouch.getObj()]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 勤務確定の承認履歴取得
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId  </td><td>{string}</td><td>社員ID    </td><td>省略不可</td></tr>
 *     <tr><td>month  </td><td>{number}</td><td>月度      </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getEmpMonthApplySteps = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('getEmpMonthApplySteps',
		[
			obj.applyId,
			obj.empId,
			obj.month
		],
		function(result){
			if(result.result == 'OK'){
				onSuccess.apply(thisObject, [true, teasp.logic.convert.convMixApplySteps(result, true)]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 勤怠関連（日次）の承認履歴取得
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId  </td><td>{string}</td><td>社員ID    </td><td>省略不可</td></tr>
 *     <tr><td>date   </td><td>{string}</td><td>日付      </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getEmpDayApplySteps = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('getEmpDayApplySteps',
		[
			obj.empId,
			obj.date
		],
		function(result){
			if(result.result == 'OK'){
				onSuccess.apply(thisObject, [true, teasp.logic.convert.convMixApplySteps(result, true)]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 申請の承認履歴取得
 *
 * @param {Object} ids 申請レコードのID（カンマ区切りで複数指定可）
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getApplyStepsById = function(ids, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('getApplyStepsById',
		ids,
		function(result){
			if(result.result == 'OK'){
				onSuccess.apply(thisObject, [true, teasp.logic.convert.convMixApplySteps(result, true)]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 勤怠関連申請
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td colspan="2">empId        </td><td>{string}  </td><td>社員ID            </td><td>省略不可               </td></tr>
 *     <tr><td colspan="2">month        </td><td>{number}  </td><td>月度              </td><td>省略不可               </td></tr>
 *     <tr><td colspan="2">date         </td><td>{string}  </td><td>日付              </td><td>省略不可               </td></tr>
 *     <tr><td colspan="2">apply        </td><td>          </td><td>                  </td><td>                       </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>id  </td><td>{string}  </td><td>申請ID            </td><td>新規の申請の場合はnull </td></tr>
 *     <tr><td></td><td>applyType       </td><td>{string}  </td><td>申請種類          </td><td>                       </td></tr>
 *     <tr><td></td><td>holidayId       </td><td>{string}  </td><td>休暇ID            </td><td>                       </td></tr>
 *     <tr><td></td><td>status          </td><td>{string}  </td><td>ステータス        </td><td>                       </td></tr>
 *     <tr><td></td><td>startDate       </td><td>{string}  </td><td>開始日            </td><td>                       </td></tr>
 *     <tr><td></td><td>endDate         </td><td>{string}  </td><td>終了日            </td><td>                       </td></tr>
 *     <tr><td></td><td>note            </td><td>{string}  </td><td>備考              </td><td>                       </td></tr>
 *     <tr><td></td><td>contact         </td><td>{string}  </td><td>連絡先            </td><td>                       </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.applyEmpDay = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('applyEmpDay', obj,
		function(result){
			if(result.result == 'OK'){
				if(obj.client == teasp.constant.APPLY_CLIENT_DAILY){
					teasp.action.contact.transEmpDay(obj, pouch, thisObject, onSuccess, onFailure);
				}else{
					teasp.action.contact.transEmpMonth(obj, pouch, thisObject, onSuccess, onFailure);
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 勤怠関連申請取消または却下申請の取消（兼用）
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId        </td><td>{string}  </td><td>社員ID               </td><td>省略不可 </td></tr>
 *     <tr><td>appId        </td><td>{string}  </td><td>申請ID               </td><td>省略不可 </td></tr>
 *     <tr><td>clearTime    </td><td>{boolean} </td><td>true:勤怠情報リセット</td><td>省略不可 </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.cancelApplyEmpDay = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod(obj.action, obj,
		function(result){
			if(result.result == 'OK'){
				if(obj.client == teasp.constant.APPLY_CLIENT_DAILY){
					teasp.action.contact.transEmpDay(obj, pouch, thisObject, onSuccess, onFailure);
				}else{
					teasp.action.contact.transEmpMonth(obj, pouch, thisObject, onSuccess, onFailure);
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 有休消化する休暇申請、勤務確定の申請が却下された場合、クリーンアップ
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId</td><td>{string}</td><td>社員ID </td><td>省略不可</td></tr>
 *     <tr><td>month</td><td>{number}</td><td>月度   </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.cleanupEmpReject = function(obj, pouch, thisObject, onSuccess, onFailure){
	var month = (obj.currMonth || obj.month);
	teasp.action.contact.remoteMethod('cleanupEmpReject', obj,
		function(result){
			if(result.result == 'OK'){
				if(result.lastModifiedDate && pouch.getYearMonth() == month){
					pouch.setLastModifiedDate(result.lastModifiedDate);
				}
				teasp.action.contact.getEmpYuqs(obj.empId, pouch, thisObject, onSuccess, onFailure);
				if(pouch.isInputAccessControl()){ // 入退館管理を使用する
					// 読み込み直した入退館乖離判定を反映する
					var empDays = (result.empDays || []);
					teasp.logic.convert.excludeNameSpace(empDays);
					for(var i = 0 ; i < empDays.length ; i++){
						var ed = empDays[i];
						var dk = teasp.util.date.formatDate(ed.Date__c);
						var dayObj = pouch.getDayObj(dk);
						dayObj.dairyDivergenceJudgement  = ed.DairyDivergenceJudgement__c; // 日単位乖離判定
						dayObj.enterDivergenceJudgement  = teasp.logic.convert.valNumber(ed.EnterDivergenceJudgement__c, null); // 入館乖離判定
						dayObj.enterTime                 = ed.EnterTime__c;                // 入館時間
						dayObj.exitDivergenceJudgement   = teasp.logic.convert.valNumber(ed.ExitDivergenceJudgement__c, null);  // 退館乖離判定
						dayObj.exitTime                  = ed.ExitTime__c;                 // 退館時間
					}
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 有休残日数情報を取得.
 *
 * @param {Object} empId 社員ID
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getEmpYuqs = function(empId, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('getEmpYuqs', empId,
		function(result){
			if(result.result == 'OK'){
				pouch.setKeyObj('yuqRemains' , teasp.logic.convert.convYuqRemainObjs(result.yuqRemains));
				pouch.setKeyObj('stocks'     , teasp.logic.convert.convStockObjs(result.stocks));
				onSuccess.apply(thisObject, [true]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 月次勤務確定申請
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId           </td><td>{string}</td><td>社員ID          </td><td>省略不可</td></tr>
 *     <tr><td>month           </td><td>{number}</td><td>月度            </td><td>省略不可</td></tr>
 *     <tr><td>lastModifiedDate</td><td>{string}</td><td>月度最終更新日時</td><td>省略不可</td></tr>
 *     <tr><td>note            </td><td>{string}</td><td>コメント        </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.applyEmpMonth = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('applyEmpMonth', obj,
		function(result){
			if(result.result == 'OK'){
				teasp.action.contact.transEmpMonth(obj, pouch, thisObject, onSuccess, onFailure);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 月次勤務確定申請の取消
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId           </td><td>{string}</td><td>社員ID          </td><td>省略不可</td></tr>
 *     <tr><td>month           </td><td>{number}</td><td>月度            </td><td>省略不可</td></tr>
 *     <tr><td>lastModifiedDate</td><td>{string}</td><td>月度最終更新日時</td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.cancelApplyEmpMonth = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('cancelApplyEmpMonth', obj,
		function(result){
			if(result.result == 'OK'){
				if(result.lastModifiedDate){
					pouch.setLastModifiedDate(result.lastModifiedDate);
				}
				teasp.action.contact.transEmpMonth(obj, pouch, thisObject, onSuccess, onFailure);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 承認／却下
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId           </td><td>{string} </td><td>社員ID                </td><td>省略不可</td></tr>
 *     <tr><td>month           </td><td>{number} </td><td>月度                  </td><td>省略不可</td></tr>
 *     <tr><td>lastModifiedDate</td><td>{string} </td><td>月度最終更新日時      </td><td>省略不可</td></tr>
 *     <tr><td>applyid         </td><td>{string} </td><td>申請ID                </td><td>省略不可</td></tr>
 *     <tr><td>appflag         </td><td>{boolean}</td><td>=True:承認 =False:却下</td><td>省略不可</td></tr>
 *     <tr><td>comment         </td><td>{string} </td><td>コメント              </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 *
 */
teasp.action.contact.empExpApproval = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('empExpApproval', obj,
		function(result){
			if(result.result == 'OK'){
				if(obj.refresh && obj.objKey == 'empApply'){
					obj.empId = pouch.getEmpId();
					obj.month = pouch.getYearMonth();
					obj.date  = pouch.getStartDate();
					obj.startDate = obj.date;
					teasp.action.contact.transEmpMonth(obj, pouch, thisObject, onSuccess, onFailure);
				}else if(obj.refresh && obj.objKey == 'expApply'){
					obj.empId      = pouch.getEmpId();
					obj.expApplyId = pouch.getExpApplyId();
					teasp.action.contact.transEmpExp(obj, pouch, thisObject, onSuccess, onFailure);
				}else if(obj.refresh && obj.objKey == 'jobApply'){
					obj.empId = pouch.getEmpId();
					obj.month = pouch.getJobYearMonth();
					obj.date  = pouch.getJobStartDate();
					obj.startDate = obj.date;
					teasp.action.contact.transJobMonth(obj, pouch, thisObject, onSuccess, onFailure);
				}else{
					onSuccess.apply(thisObject, [true]);
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 月次勤務確定申請の却下後の取消
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId           </td><td>{string}</td><td>社員ID          </td><td>省略不可</td></tr>
 *     <tr><td>month           </td><td>{number}</td><td>月度            </td><td>省略不可</td></tr>
 *     <tr><td>lastModifiedDate</td><td>{string}</td><td>月度最終更新日時</td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.closeApplyEmpMonth = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('closeApplyEmpMonth', obj,
		function(result){
			if(result.result == 'OK'){
				if(result.lastModifiedDate){
					pouch.setLastModifiedDate(result.lastModifiedDate);
				}
				var empApply = teasp.logic.convert.convEmpMonthApplyObjs(result.apply);
				pouch.removeReject(empApply);
				teasp.action.contact.transEmpMonth(obj, pouch, thisObject, onSuccess, onFailure);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 勤怠情報の登録
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td colspan="2">empId           </td><td>{string} </td><td>社員ID          </td><td>省略不可    </td></tr>
 *     <tr><td colspan="2">month           </td><td>{number} </td><td>月度            </td><td>省略不可    </td></tr>
 *     <tr><td colspan="2">lastModifiedDate</td><td>{string} </td><td>月度最終更新日時</td><td>省略不可    </td></tr>
 *     <tr><td colspan="2">date            </td><td>{string} </td><td>日付            </td><td>省略不可    </td></tr>
 *     <tr><td colspan="2">timeTable       </td><td>[        </td><td>                </td><td>            </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>face   </td><td>{number} </td><td>                </td><td>省略可(null)</td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>type   </td><td>{number} </td><td>終了時刻        </td><td>省略可(null)</td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>fix    </td><td>{boolean}</td><td>定時フラグ      </td><td>省略可(null)</td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>time   </td><td>{number} </td><td>定時フラグ      </td><td>省略可(null)</td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>comment</td><td>{string} </td><td>定時フラグ      </td><td>省略可(null)</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.inputTimeTable = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('inputTimeTable',
		obj,
		function(result){
			if(result.result == 'OK'){
				if((obj.client && obj.dayFix) || pouch.existEmpMonthCustomKeys()){
					if(obj.client == teasp.constant.APPLY_CLIENT_DAILY){
						teasp.action.contact.transEmpDay(obj, pouch, thisObject, onSuccess, onFailure);
					}else{
						teasp.action.contact.transEmpMonth(obj, pouch, thisObject, onSuccess, onFailure);
					}
				}else{
					if(result.lastModifiedDate){
						pouch.setLastModifiedDate(result.lastModifiedDate);
					}
					if(result.stocks){
						pouch.setKeyObj('stocks', teasp.logic.convert.convStockObjs(result.stocks));
					}
					var empDays = result.empDays || [];
					teasp.logic.convert.excludeNameSpace(empDays);
					for(var i = 0 ; i < empDays.length ; i++){
						var ed = empDays[i];
						var dk = teasp.util.date.formatDate(ed.Date__c);
						var dayObj = pouch.getDayObj(dk);
						if(dk == obj.date){
							dayObj.startTime = ed.StartTime__c;
							dayObj.endTime   = ed.EndTime__c;
							if(typeof(dayObj.startTime) != 'number'){
								dayObj.startTime = null;
							}
							if(typeof(dayObj.endTime) != 'number'){
								dayObj.endTime = null;
							}
							dayObj.timeTable = teasp.util.extractTimes(ed.TimeTable__c || '');
							pouch.replaceWorkNote(obj.date, (ed.WorkNote__c || '')); // 作業報告（クリアされることもあるので再取得）
							dayObj.workLocationId = ed.WorkLocationId__c;
						}
						if(obj.useInputAccessControl){ // 入退館管理を使用する
							// 対象日以外でも乖離判定が変わっている可能性があるため、更新する
							dayObj.dairyDivergenceJudgement  = ed.DairyDivergenceJudgement__c; // 日単位乖離判定
							dayObj.enterDivergenceJudgement  = teasp.logic.convert.valNumber(ed.EnterDivergenceJudgement__c, null); // 入館乖離判定
							dayObj.enterDivergenceReason     = ed.EnterDivergenceReason__c;    // 入館乖離理由
							dayObj.enterTime                 = ed.EnterTime__c;                // 入館時間
							dayObj.exitDivergenceJudgement   = teasp.logic.convert.valNumber(ed.ExitDivergenceJudgement__c, null);  // 退館乖離判定
							dayObj.exitDivergenceReason      = ed.ExitDivergenceReason__c;     // 退館乖離理由
							dayObj.exitTime                  = ed.ExitTime__c;                 // 退館時間
						}
					}

					if(obj.refreshWork){
						pouch.setKeyObj('jobAssigns', teasp.logic.convert.convJobAssignObjs(result.jobAssign || []));
						pouch.replaceWorks(obj.date, teasp.logic.convert.convWorkObjs(result.empWorks || []));
					}

					var empTime  = new teasp.logic.EmpTime(pouch);
					empTime.mergeCalendar();
					empTime.buildEmpMonth();
					onSuccess.apply(thisObject, [true]);
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 勤怠打刻・chatter投稿・直近投稿の削除
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td colspan="2">empId           </td><td>{string} </td><td>社員ID                </td><td>省略不可    </td></tr>
 *     <tr><td colspan="2">month           </td><td>{number} </td><td>月度                  </td><td>省略不可    </td></tr>
 *     <tr><td colspan="2">lastModifiedDate</td><td>{string} </td><td>月度最終更新日時      </td><td>省略不可    </td></tr>
 *     <tr><td colspan="2">date            </td><td>{string} </td><td>日付                  </td><td>省略不可    </td></tr>
 *     <tr><td colspan="2">input           </td><td>[        </td><td>                      </td><td>            </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>face   </td><td>{number} </td><td>0:出社 1:退社         </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>type               </td><td>{number} </td><td>0:投稿のみ 10:打刻    </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>fix                </td><td>{boolean}</td><td>true:定時             </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>time               </td><td>{number} </td><td>(予約領域)            </td><td>省略可      </td></tr>
 *     <tr><td></td><td>comment            </td><td>{string} </td><td>chatterコメント       </td><td>省略可      </td></tr>
 *     <tr><td></td><td>commentId          </td><td>{string} </td><td>削除するコメントのID  </td><td>省略可(※)  </td></tr>
 *     </table>
 *     (※)直近投稿の削除の場合のみ指定
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.inputTime = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('inputTime',
		obj,
		function(result){
			if(result.result == 'OK'){
				if(obj.client && obj.dayFix){
					if(obj.client == teasp.constant.APPLY_CLIENT_DAILY){
						teasp.action.contact.transEmpDay(obj, pouch, thisObject, onSuccess, onFailure);
					}else{
						teasp.action.contact.transEmpMonth(obj, pouch, thisObject, onSuccess, onFailure);
					}
				}else{
					if(result.lastModifiedDate){
						pouch.setLastModifiedDate(result.lastModifiedDate);
					}
					pouch.replaceDays(teasp.logic.convert.convEmpDayObjs(result.empDays || []));

					var empTime  = new teasp.logic.EmpTime(pouch);
					empTime.mergeCalendar();
					empTime.buildEmpMonth();
					onSuccess.apply(thisObject, [true]);
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 日次の備考の登録
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId           </td><td>{string} </td><td>社員ID                </td><td>省略不可    </td></tr>
 *     <tr><td>month           </td><td>{number} </td><td>月度                  </td><td>省略不可    </td></tr>
 *     <tr><td>lastModifiedDate</td><td>{string} </td><td>月度最終更新日時      </td><td>省略不可    </td></tr>
 *     <tr><td>date            </td><td>{string} </td><td>日付                  </td><td>省略不可    </td></tr>
 *     <tr><td>note            </td><td>{string} </td><td>備考                  </td><td>省略不可    </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.saveEmpNoteByDay = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('saveEmpNoteByDay',
		obj,
		function(result){
			if(result.result == 'OK'){
				if(result.lastModifiedDate){
					pouch.setLastModifiedDate(result.lastModifiedDate);
				}
				pouch.getEmpDay(obj.date).setDayNote(obj.note);
				var empTime  = new teasp.logic.EmpTime(pouch);
				empTime.decorateEmpDay(pouch.getCommonObj(), pouch.getConfigObj(), pouch.getDayObj(obj.date));
				onSuccess.apply(thisObject, [true]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * お知らせの了解
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId           </td><td>{string}  </td><td>社員ID               </td><td>省略不可    </td></tr>
 *     <tr><td>infoId          </td><td>{Array.<string>}</td><td>お知らせIDの配列     </td><td>省略不可    </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.setInfoAgree = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('setInfoAgree', obj,
		function(result){
			if(result.result == 'OK'){
				var infos = pouch.getInfos();
				for(var i = 0 ; i < infos.length ; i++){
					var info = infos[i];
					for(var j = 0 ; j < obj.infoId.length ; j++){
						if(info.id == obj.infoId[j]){
							info.agree = true;
						}
					}
				}
				onSuccess.apply(thisObject, [true]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 社員名から社員ID取得（テスト・デモデータ作成用）
 *
 * @param {string} name 社員名
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getEmpIdByName = function(name, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('getEmpByName',
		[
			name
		],
		function(result){
			teasp.logic.convert.excludeNameSpace(result);
			onSuccess.apply(thisObject, [true, result]);
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 月度の集計データ取得（テスト用）
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId           </td><td>{string} </td><td>社員ID                </td><td>省略不可    </td></tr>
 *     <tr><td>month           </td><td>{number} </td><td>月                    </td><td>省略不可    </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getEmpMonth = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('getEmpMonth',
		[ obj.empId, obj.month ],
		function(result){
			onSuccess.apply(thisObject, [true, teasp.logic.convert.convEmpMonthObj(result)]);
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 有休データ取得（テスト用）
 *
 * @param {Object} obj パラメータ
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getAllEmpYuqs = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('getEmpYuqByEmpId',
		[ obj.empId ],
		function(result){
			var o = {
				empYuqs       : teasp.logic.convert.convEmpYuqObj(result.empYuqs),
				empYuqDetails : teasp.logic.convert.convEmpYuqDetailObj(result.empYuqDetails)
			};
			onSuccess.apply(thisObject, [true, o]);
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 集計、データ要求等に必要なパラメータの生成.<br/>
 *
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {string|number} month 対象の月次オブジェクト
 * @return {Object} 生成したパラメータ値を保持するオブジェクト
 */
teasp.action.contact.createParamByEmpMonth = function(pouch, month, dt){
	// ※ この中の処理は pouch.dataObj.empMonthMap があることが前提
	var params = pouch.getParams();
	month = (typeof(month) == 'string' ? parseInt(month, 10) : month);
	params.month = month;
	params.monthEx = dt;
	// 対象月度の開始日と終了日を得る
	var o = pouch.dataObj.empMonthMap[params.monthEx] || pouch.dataObj.empMonthMap[month];
	params.subNo     = o.subNo || null;
	params.startDate = o.startDate;
	params.endDate   = o.endDate;

	// 勤怠集計のために必要な前月度翌月度の値を得る
	params.startYm   = teasp.util.date.addYearMonth(month, -13);
	params.endYm     = teasp.util.date.addYearMonth(month,  13);

	// 勤怠集計のために必要な日付の範囲を得る
	var sw = o.empType.configBase.initialDayOfWeek; // 週の起算曜日
	var d = teasp.util.date.parseDate(params.startDate); // 対象月度の開始日
	var dw = d.getDay();
	var n = (sw == dw ? -1 : (sw - dw - (dw < sw ? 7 : 0))); // 対象月度の開始日と週の起算曜日の差分
	if(n == 0){
		n = -1; // 対象月度の開始日が週の起算日の場合、拡大開始日を１日前にする
	}
	// 適用期間>1 のフレックスに対応するため、前後3ヶ月分広げる。
	// 適用期間の所定労働時間の合計を得るため
	var sd = teasp.util.date.addDays(d, n);
	params.startLdate = teasp.util.date.formatDate(teasp.util.date.addDays(sd, -366)); // 集計に必要な開始日
	params.endLdate   = teasp.util.date.formatDate(teasp.util.date.addDays(teasp.util.date.parseDate(params.endDate), 366)); // 集計に必要な終了日
	return params;
};

/**
 * 集計、データ要求等に必要なパラメータの生成.<br/>
 *
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {*} applys 申請オブジェクトの配列
 * @return {Object} 生成したパラメータ値を保持するオブジェクト
 */
teasp.action.contact.createParamByEmpApplys = function(pouch, applys){
	var params = pouch.getParams();
	params.dateList = [];
	for(var i = 0 ; i < applys.length ; i++){
		var a = applys[i];
		if(a.applyType == teasp.constant.APPLY_TYPE_EXCHANGE){
			if(a.exchangeDate < params.startLdate || params.endLdate < a.exchangeDate){
				params.dateList.push(a.exchangeDate);
			}else if(a.startDate < params.startLdate || params.endLdate < a.startDate){
				params.dateList.push(a.startDate);
			}
		}
	}
	return params;
};

/**
 * 日単位の勤怠情報の再計算.<br/>
 *
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} day 対象の日次オブジェクト（メソッド内で更新）
 */
teasp.action.contact.recalcOneDay = function(pouch, day){
	if(day.dayType == teasp.constant.DAY_TYPE_NORMAL || day.workFlag || day.autoLH || day.rack.validApplys.kyushtu.length > 0){
		day.rack.worked = teasp.util.time.isValidRange(day.startTime, day.endTime);
	}else{
		day.rack.worked = false;
	}
	var empTime  = new teasp.logic.EmpTime(pouch);
	empTime.calculateEmpDay(day, dojo.clone(day.period), pouch.getConfigObj(day.date), pouch.getCommonObj(), teasp.constant.C_REAL);
	empTime.calculateEmpDay(day, dojo.clone(day.period), pouch.getConfigObj(day.date), pouch.getCommonObj(), teasp.constant.C_DISC);
	empTime.calculateEmpDay(day, dojo.clone(day.period), pouch.getConfigObj(day.date), pouch.getCommonObj(), teasp.constant.C_FREAL);
	empTime.calculateEmpDay(day, dojo.clone(day.period), pouch.getConfigObj(day.date), pouch.getCommonObj(), teasp.constant.C_FDISC);
};

/**
 * 承認者設定取得
 *
 * @param {Object} obj パラメータ
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getAtkApproverSet = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod(obj.action, obj,
		function(result){
			if(result.result == 'OK'){
				pouch.setKeyObj('approverSet', teasp.logic.convert.convApproverSetObjs(result.approverSet));
				onSuccess.apply(thisObject, [true]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

teasp.action.contact.saveDivergenceReason = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('saveDivergenceReason',
		obj,
		function(result){
			if(result.result == 'OK'){
				if(result.lastModifiedDate){
					pouch.setLastModifiedDate(result.lastModifiedDate);
				}
				var dayObj = pouch.getDayObj(obj.date);
				var empDay = (result.empDay.length > 0 ? result.empDay[0] : {});
				teasp.logic.convert.excludeNameSpace(empDay);
				dayObj.dairyDivergenceJudgement  = empDay.DairyDivergenceJudgement__c; // 日単位乖離判定
				dayObj.enterDivergenceJudgement  = teasp.logic.convert.valNumber(empDay.EnterDivergenceJudgement__c, null); // 入館乖離判定
				dayObj.enterDivergenceReason     = empDay.EnterDivergenceReason__c;    // 入館乖離理由
				dayObj.enterTime                 = empDay.EnterTime__c;                // 入館時間
				dayObj.exitDivergenceJudgement   = teasp.logic.convert.valNumber(empDay.ExitDivergenceJudgement__c, null);  // 退館乖離判定
				dayObj.exitDivergenceReason      = empDay.ExitDivergenceReason__c;     // 退館乖離理由
				dayObj.exitTime                  = empDay.ExitTime__c;                 // 退館時間

				var empTime  = new teasp.logic.EmpTime(pouch);
				empTime.mergeCalendar();
				empTime.buildEmpMonth();

				onSuccess.apply(thisObject, [true]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

teasp.action.contact.createEmpMonthHook = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('createEmpMonthHook',
		obj,
		function(result){
			if(result.result == 'OK'){
				if(result.monthId){ // 勤怠月次が生成済みの状態になっているため、月次情報を再取得する
					teasp.action.contact.transEmpMonth(obj, pouch, thisObject, onSuccess, onFailure);
				}else{
					onSuccess.apply(thisObject, [true]);
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

teasp.action.contact.rebuildStockWithTime = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('rebuildStockWithTime',
		obj,
		function(result){
			if(result.result == 'OK'){
				onSuccess.apply(thisObject, [true, result]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};
