define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/testAssist/CurrentMaster",
	"tsext/testAssist/Constant",
	"tsext/util/TsError",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, CurrentMaster, Constant, TsError, Util){
	// TS画面ロジックとのI/Fクラス
	// このI/Fクラスを介してTS画面ロジックの情報を参照する
	if(teasp.viewPoint){
		return teasp.viewPoint;
	}
	teasp.viewPoint = (new declare("tsext.testAssist.Current", null, {
		constructor : function(){
			teaspex.testAssistCurrent = this;
			this.pouch = (teasp.viewPoint && teasp.viewPoint.pouch) || new teasp.data.Pouch();
			teasp.message.mergeLabels(globalMessages || {});
			this.currentMaster = new CurrentMaster();
		},
		isSettingMode: function(){
			return (location.pathname.indexOf('AtkConfigEditView') > 0 || location.pathname.indexOf('AtkPatternView') > 0);
		},
		getEmp: function(){
			return this.pouch.dataObj.targetEmp || {};
		},
		getEmpId: function(){
			return this.getEmp().id;
		},
		getEmpName: function(){
			return this.getEmp().name;
		},
		getDeptId: function(){
			return this.getEmp().deptId || null;
		},
		/**
		 * 勤務時間変更申請／シフト可（始業・終業時刻変更を許可）
		 */
		isUseChangeShift: function(){
			return this.pouch.isUseChangeShift();
		},
		getPeriodInfo: function(flag){
			return this.pouch.getPeriodInfo(flag);
		},
		getLegalWorkTimeOfPeriod: function(){
			return this.pouch.getLegalWorkTimeOfPeriod();
		},
		getExchangableDateMap: function(d){
			return this.pouch.createExchangeEnableMap(d);
		},
		// 代休管理
		isUseDaiqManage: function(){
			return this.pouch.isUseDaiqManage();
		},
		// 申請時に代休有無を指定する
		isUseDaiqReserve: function(){
			return this.pouch.isUseDaiqReserve();
		},
		// 直行直帰申請を使用する
		isUseDirectApply: function(){
			return this.pouch.isUseDirectApply();
		},
		// 休日出勤の勤怠規則は平日に準拠する
		isUseRegulateHoliday: function(){
			return this.isUseDaiqManage() && this.pouch.isUseRegulateHoliday();
		},
		isParallelMessage: function(){
			return this.pouch.isParallelMessage();
		},
		/**
		 * 月次情報を返す（今開いている勤務表の月度）
		 * @return {{
		 *   yearMonth        {number}  yyyyMM
		 *   subNo            {number|null}  1～
		 *   key              {string}  yearMonth + subNo
		 *   id               {string}  勤怠月次ID
		 *   fixed            {boolean} 月次確定すみならtrue
		 *   startDate        {string}  開始日
		 *   endDate          {string}  終了日
		 *   lastModifiedDate {number}  最終更新日時
		 *   days             {Array.<Object>}  枠だけ用意
		 * }}
		 */
		getMonth: function(){
			var month = (this.pouch.dataObj && this.pouch.dataObj.month) || {};
			return {
				yearMonth: month.yearMonth || null,
				subNo: month.subNo || null,
				key: '' + (month.yearMonth || '') + (month.subNo ? '_' + month.subNo : ''),
				id: month.id || null,
				fixed: (month.yearMonth ? this.pouch.isEmpMonthFixed(month, true) : false),
				startDate: month.startDate || null,
				endDate: month.endDate || null,
				lastModifiedDate: (month.lastModifiedDate ? '' + month.lastModifiedDate : null),
				days: []  // ※ Distributor.input() でセットする
			};
		},
		isMonthFixedByDate: function(dkey){
			var months = (this.pouch.dataObj && this.pouch.dataObj.months) || [];
			for(var i = 0 ; i < months.length ; i++){
				var m = months[i];
				if(m.startDate <= dkey && dkey <= m.endDate){
					if(m._em){
						return m._em.fix;
					}
				}
			}
			return {
				yearMonth: month.yearMonth || null,
				subNo: month.subNo || null,
				key: '' + (month.yearMonth || '') + (month.subNo ? '_' + month.subNo : ''),
				id: month.id || null,
				fixed: (month.yearMonth ? this.pouch.isEmpMonthFixed(month, true) : false),
				startDate: month.startDate || null,
				endDate: month.endDate || null,
				lastModifiedDate: (month.lastModifiedDate ? '' + month.lastModifiedDate : null),
				days: []  // ※ Distributor.input() でセットする
			};
		},
		/**
		 * 日次情報を返す
		 * @param {string} d yyyy-MM-dd
		 * @return {{
		 *   date       {string}  yyyy-MM-dd
		 *   startTime  {number}  出社時刻
		 *   endTime    {number}  退社時刻
		 *   timeTable  {string}  休憩・公用外出
		 *   id         {string}  勤怠日次ID
		 *   fixed      {boolean} 日次確定すみならtrue
		 *   dayType    {string}  日タイプ
		 *   inputtable {boolean} 入力可否
		 * }|null}
		 */
		getDayObjByDate: function(d){
			var day = (this.pouch.dataObj.days || {})[d];
			if(day){
				var dw = new teasp.data.EmpDay(this.pouch, day.date);
				var va = (day.rack && day.rack.validApplys) || {};
				return {
					date: d,
					startTime: day.startTime,
					endTime: day.endTime,
					timeTable: this.getDbTimeTable(day.timeTable),
					id: day.id,
					fixed: (va.dailyFix ? true : false),
					dayType: day.dayType,
					inputtable: dw.isInputable()
				};
			}
			return null;
		},
		getBdrStartEndTime: function(d){
			var day = (this.pouch.dataObj.days || {})[d];
			if(day && day.rack){
				return {
					bdrStartTime: day.rack.bdrStartTime,
					bdrEndTime:   day.rack.bdrEndTime
				};
			}
			return null;
		},
		getReviseOldValues: function(d){
			var day = (this.pouch.dataObj.days || {})[d];
			var obj = { startEnd:[], rests:[], aways:[] }
			if(day){
				var st = typeof(day.startTime) == 'number' ? day.startTime : null;
				var et = typeof(day.endTime)   == 'number' ? day.endTime   : null;
				if(st !== null || et !== null){
					obj.startEnd.push({from:st, to:et, type:1});
					var timeTable = day.timeTable || [];
					for(var i = 0 ; i < timeTable.length ; i++){
						var o = timeTable[i];
						if(o.type == teasp.constant.REST_FIX
						|| o.type == teasp.constant.REST_FREE
						){
							obj.rests.push(o);
						}else if(o.type == teasp.constant.AWAY){
							obj.aways.push(o);
						}
					}
				}else{
					obj.startEnd.push({from:null, to:null, type:1});
					obj.rests = obj.rests.concat(day.pattern.restTimes || []);
				}
			}
			return obj;
		},
		/**
		 * 日次情報から日次の入力値を作成
		 * @param {Object} daymap
		 * @param {Object} input
		 * @param {string} sd yyyy-MM-dd
		 * @param {string} ed yyyy-MM-dd
		 * @return {string|null} 入力ありならNULL、入力なしならエラーを返す
		 */
		loadInputDays: function(daymap, input, sd, ed){
			var md  = moment(sd, Constant.YMD1);
			var med = moment(ed || sd, Constant.YMD1);
			var errors = [];
			var cnt = 0;
			while(md.isSameOrBefore(med)){
				var d = md.format(Constant.YMD1);
				var day = (daymap[d] || this.getDayObjByDate(d));
				if(!day){ // 今開いている月度に含まれない日付
					errors.push(Constant.ERROR_DATE_OUT_OF_RANGE); // 日付が範囲外
				}else if(day.fixed){
					errors.push(Constant.ERROR_FIXED_DAY); // 日次確定済み
				}else if(!day.inputtable){
					errors.push(Constant.ERROR_NO_INPUTTABLE); // 入力不可
				}else{
					day.startTime = input.startTime;
					day.endTime   = input.endTime;
					day.timeTable = input.timeTable;
					day.note      = input.note;
					cnt++;
					if(!daymap[d]){
						daymap[d] = day;
					}
				}
				md = md.add(1, 'day');
			}
			return (cnt ? null : (errors.length ? errors[0] : null));
		},
		/**
		 * 休暇・公用外出情報を TimeTable__c の形式で返す
		 * @param {Array.<Object>} rt
		 * @return {string}
		 */
		getDbTimeTable: function(rt){
			var restTimes = rt || [];
			var vs = [];
			for(var i = 0 ; i < restTimes.length ; i++){
				var o = restTimes[i];
				if(o.type != teasp.constant.REST_FIX
				&& o.type != teasp.constant.REST_FREE
				&& o.type != teasp.constant.AWAY){
					continue;
				}
				var st = (typeof(o.from) == 'number' ? str.pad(o.from, 4, "0", false) : '----');
				var et = (typeof(o.to)   == 'number' ? str.pad(o.to  , 4, "0", false) : '----');
				vs.push(st + et + o.type);
			}
			return vs.join(':') + ':';
		},
		/**
		 * 休暇・公用外出情報を H:mm-H:mm|H:mm-H:mm... の形式で返す
		 * @param {Array.<Object>} restTimes
		 * @return {{restTimes:{string}, awayTimes:{string}}}
		 */
		getCsvTimeTable: function(restTimes){
			if(!restTimes){
				return null;
			}
			var vs = [];
			var rests = [];
			var aways = [];
			for(var i = 0 ; i < restTimes.length ; i++){
				var o = restTimes[i];
				var t = Util.getStartEndTime(o.from, o.to, '-');
				if(o.type == teasp.constant.REST_FIX || o.type == teasp.constant.REST_FREE){
					rests.push(t);
				}else if(o.type == teasp.constant.AWAY){
					aways.push(t);
				}
			}
			return {
				rests: rests.join('|'),
				aways: aways.join('|')
			};
		},
		/**
		 * 指定日の勤務パターンを返す
		 * @param {string} d yyyy-MM-dd
		 * @return {Object|null}
		 */
		getPatternByDate: function(d){
			var day = (this.pouch.dataObj.days || {})[d];
			if(day){
				return day.pattern;
			}
			return null;
		},
		/**
		 * 勤務パターン名に一致した休暇を返す
		 * ※名称が重複する可能性を考慮して配列で返す
		 * @param {string} name
		 * @return {Array.<Object>}
		 */
		getPatternsByName: function(name){
			var patterns = (this.pouch.dataObj.patterns || []);
			var ps = [];
			for(var i = 0 ; i < patterns.length ; i++){
				var p = patterns[i];
				if(p.name == name){
					ps.push(p);
				}
			}
			return ps;
		},
		/**
		 * 休暇名に一致した休暇を返す
		 * ※名称が重複する可能性を考慮して配列で返す
		 * @param {string} name
		 * @return {Array.<Object>}
		 */
		getHolidaysByName: function(name){
			var holidays = (this.pouch.dataObj.holidays || []);
			var hs = [];
			for(var i = 0 ; i < holidays.length ; i++){
				var h = holidays[i];
				if(h.name == name){
					hs.push(h);
				}
			}
			return hs;
		},
		/**
		 * IDから休暇情報を返す
		 * @param {string} id
		 * @param {Object|null}
		 */
		getHolidayById: function(id){
			var holidays = (this.pouch.dataObj.holidays || []);
			for(var i = 0 ; i < holidays.length ; i++){
				var h = holidays[i];
				if(h.id == id){
					return h;
				}
			}
			return null;
		},
		/**
		 * 勤怠申請を集める
		 * @param {string}      sd yyyy-MM-dd
		 * @param {string|null} ed yyyy-MM-dd ※省略時はsdと同じ
		 * @param {boolean=}    flag trueなら承認待ちのみ
		 * @return {Array.<Object>}
		 */
		getApplys: function(sd, ed, flag){
			var days = (this.pouch.dataObj.days || {});
			var md  = moment(sd, Constant.YMD1);
			var med = moment(ed || sd, Constant.YMD1);
			var applys = [];
			var stats = (flag ? [Constant.STATUS_WAIT] : teasp.constant.STATUS_FIX);
			while(md.isSameOrBefore(med)){
				var day = days[md.format(Constant.YMD1)];
				var as = (day && day.rack && day.rack.allApplys) || [];
				for(var i = 0 ; i < as.length ; i++){
					var a = as[i];
					if(stats.contains(a.status)){
						applys.push(a);
					}
				}
				md = md.add(1, 'day');
			}
			return applys;
		},
		/**
		 * 再利用可能な申請を取得
		 * @param {string|Array.<string>} applyType
		 * @param {string} sd yyyy-MM-dd
		 * @return {Object|null}
		 */
		getCanceldApply: function(applyType, sd){
			var day = (this.pouch.dataObj.days || {})[sd];
			var types = (applyType instanceof Array) ? applyType : [applyType];
			var applys = [];
			if(day){
				var as = (day.rack && day.rack.allApplys) || [];
				for(var i = 0 ; i < as.length ; i++){
					var a = as[i];
					// 申請種類が同じで未申請があるか
					if(!teasp.constant.STATUS_FIX.contains(a.status)
					&& types.indexOf(a.applyType) >= 0){
						applys.push(a);
					}
				}
				if(applys.length){
					// 申請日時の降順でソート
					applys = applys.sort(function(a, b){
						return (a.applyTime < b.applyTime ? 1 : -1);
					});
					return applys[0];
				}
			}
			return null;
		},
		/**
		 * 取ろうとしている休暇（終日休のみ）が他の休暇と重ならないかチェックする
		 * @param {string}      sd yyyy-MM-dd
		 * @param {string|null} ed yyyy-MM-dd ※省略時はsdと同じ
		 * @return {boolean} NGならtrueを返す
		 */
		isDuplicateLeave: function(sd, ed){
			var days = (this.pouch.dataObj.days || {});
			var md  = moment(sd, Constant.YMD1);
			var med = moment(ed || sd, Constant.YMD1);
			while(md.isSameOrBefore(med)){
				var day = days[md.format(Constant.YMD1)];
				var as = (day.rack && day.rack.allApplys) || [];
				for(var i = 0 ; i < as.length ; i++){
					var a = as[i];
					if(teasp.constant.STATUS_FIX.contains(a.status)
					&& (a.applyType == Constant.APPLY_TYPE_LEAVE      // 休暇申請
					 || a.applyType == Constant.APPLY_TYPE_DAILY_FIX) // 日次確定
					){
						return true;
					}
				}
				md = md.add(1, 'day');
			}
			return false;
		},
		/**
		 * 取ろうとしている休暇（終日休以外）が他の休暇と重ならないかチェックする
		 * @param {string} d yyyy-MM-dd
		 * @param {Object} holiday 取ろうとしている休暇（終日休暇以外）
		 * @param {number} st 取ろうとしている開始時間（時間単位休のみ）
		 * @param {number} et 取ろうとしている終了時間（時間単位休のみ）
		 * @return {boolean} NGならtrueを返す
		 */
		isDuplicateLeaveTime: function(d, holiday, st, et){
			var day = (this.pouch.dataObj.days || {})[d];
			if(!day){
				return false;
			}
			var info = this.getDayLeaveInfo(d);
			if(!info || !info.times.length){
				return false;
			}
			var req = {
				from: st,
				to:   et
			};
			if(holiday.range == '2'){ // 午前半休
				req.from = day.pattern.amHolidayStartTime;
				req.to   = day.pattern.amHolidayEndTime;
			}else if(holiday.range == '3'){ // 午後半休
				req.from = day.pattern.pmHolidayStartTime;
				req.to   = day.pattern.pmHolidayEndTime;
			}
			var t = teasp.util.time.rangeTime(req, info.times);
			return (t > 0 ? true : false);
		},
		/**
		 * 指定日の既存の休暇申請時間を返す
		 * @param {string} d yyyy-MM-dd
		 * @return {Object}
		 */
		getDayLeaveInfo: function(d){
			var info = {
				flag: 0,
				times: []
			};
			var day = (this.pouch.dataObj.days || {})[d];
			if(!day){
				return null;
			}
			info.flag = (day.rack && day.rack.holidayJoin) || 0;
			if(info.flag == 3){ // 終日休
				info.times.push({
					from: day.pattern.stdStartTime,
					to:   day.pattern.stdEndTime
				});
			}else if(info.flag == 1){ // 午前半休
				info.times.push({
					from: day.pattern.amHolidayStartTime,
					to:   day.pattern.amHolidayEndTime
				});
			}else if(info.flag == 2){ // 午後半休
				info.times.push({
					from: day.pattern.pmHolidayStartTime,
					to:   day.pattern.pmHolidayEndTime
				});
			}
			// 時間単位休
			var hts = ((day.rack && day.rack.validApplys) || {}).holidayTime || [];
			for(var i = 0 ; i < hts.length ; i++){
				var ht = hts[i];
				info.times.push({
					from: ht.startTime,
					to:   ht.endTime
				});
			}
			return info;
		},
		/**
		 * 取ろうとしている勤務パターンが既存の申請と重ならないかチェックする
		 * @param {string}      sd yyyy-MM-dd
		 * @param {string|null} ed yyyy-MM-dd ※省略時はsdと同じ
		 * @param {Object}      pattern
		 * @return {boolean} NGならtrueを返す
		 */
		isDuplicatePattern: function(sd, ed, pattern){
			var days = (this.pouch.dataObj.days || {});
			var md  = moment(sd, Constant.YMD1);
			var med = moment(ed || sd, Constant.YMD1);
			while(md.isSameOrBefore(med)){
				var day = days[md.format(Constant.YMD1)];
				var va = (day.rack && day.rack.validApplys) || {};
				if((pattern.range == '1' && va.patternS)
				|| (pattern.range == '2' && va.patternL)){
					return true;
				}
				md = md.add(1, 'day');
			}
			return false;
		},
		/**
		 * 期間内に平日があればtrueを返す
		 * @param {string}      sd yyyy-MM-dd
		 * @param {string|null} ed yyyy-MM-dd ※省略時はsdと同じ
		 * @param {boolean=}    flag trueの場合sdとedが平日でなければエラー
		 * @return {boolean}
		 */
		isExistWorkDay: function(sd, ed, flag){
			var days = (this.pouch.dataObj.days || {});
			var md  = moment(sd, Constant.YMD1);
			var med = moment(ed || sd, Constant.YMD1);
			var existWeekDay = false;
			while(md.isSameOrBefore(med)){
				var d = md.format(Constant.YMD1);
				var day = days[d];
				if(day && (day.dayType == '0' || (day.dayType == '2' && day.autoLH))){
					existWeekDay = true;
				}else if(!day || (flag && (d == sd || d == ed))){ // 開始日または終了日が平日でなければエラーs
					return false;
				}
				md = md.add(1, 'day');
			}
			return existWeekDay;
		},
		/**
		 * 指定日が休日ならtrueを返す
		 * @param {string}   d yyyy-MM-dd
		 * @return {boolean}
		 */
		isHoliday: function(d){
			var day = (this.pouch.dataObj.days || {})[d];
			if(day){
				if(day.plannedHoliday){
					return true;
				}
				if(day.dayType == '0' || (day.dayType == '2' && day.autoLH)){
					return false;
				}
			}
			return true;
		},
		/**
		 * 勤怠積休の残日数チェック
		 * @param {string} manageName
		 * @param {string} dt (yyyy-MM-dd)
		 * @parma {Function} callback
		 */
		calcEmpStockRemainDays: function(manageName, dt, callback){
			if(!this.pouch.dataObj.configHistory){
				Current.loadEmpMonthDelay(lang.hitch(this, function(flag, errmsg){
					if(flag){
						this.getEmpStockRemainDays(manageName, dt, callback);
					}else{
						callback(false, errmsg);
					}
				}));
			}else{
				this.getEmpStockRemainDays(manageName, dt, callback);
			}
		},
		/**
		 * ベリファイ
		 * @parma {Function} callback
		 */
		verifyMonth: function(callback){
			this.pouch.verifyMonth(
				lang.hitch(this, function(values){
					//
				}),
				lang.hitch(this, function(n){ // 成功：戻り値 n>0 なら不一致がある
					callback(true, n);
				}),
				lang.hitch(this, function(result){ // 失敗
					callback(false, Util.getErrorMessage(result));
				})
			);
		},
		/**
		 * 勤怠積休/代休の残日数取得
		 * @param {string} manageName
		 * @param {string} dt (yyyy-MM-dd)
		 * @parma {Function} callback
		 */
		getEmpStockRemainDays: function(manageName, dt, callback){
			if(manageName == '代休'){
				var anyZan = teasp.data.Pouch.getDaiqZan(
						this.pouch.getStocks(),
						dt);
				var remainDays = teasp.data.Pouch.formatDays(anyZan.zan || 0, {
					flag:0
				}).disp;
				callback(true, remainDays);
			}else{
				teasp.data.Pouch.checkStockBaseTime(
					this.pouch.getEmpId(),
					this.pouch.getConfigHistory(),
					this.pouch.getStocks(),
					dt,
					null,
					lang.hitch(this, function(flag, result, mapError){
						if(flag >= 0){
							var anyZan = teasp.data.Pouch.getStockZan(
									this.pouch.getStocks(),
									manageName,
									dt);
							if(mapError && mapError[manageName]){
								anyZan.zan = 0;
								anyZan.valid = false;
							}else if(anyZan.zan <= 0 && anyZan.valid){
								var spendTimeUnitFlag = teasp.data.Pouch.getSpendStockChangedBaseTime(
									anyZan,
									this.pouch.getConfigHistory(),
									dt
								);
								if(spendTimeUnitFlag < 2){
									anyZan.valid = false;
								}
							}
							var roundUp = anyZan.startDateMin ? teasp.data.Pouch.isZanRoundUp(this.pouch.getConfigHistory(), anyZan, dt) : false;
							var remainDays = teasp.data.Pouch.formatDays(anyZan.zan || 0, {
								baseTime: this.pouch.getBaseTimeForStock(),
								flag:(roundUp ? 1 : 0)
							}).disp;
							callback(true, remainDays);
						}else{
							callback(false, result);
						}
					})
				);
			}
		},
		//----------------------------------------------------------------
		/**
		 * コントロールクラスAPI呼び出し（RtkPotalCtl.getExtResult）
		 * @param {Object} req
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		request: function(req, bagged){
			var deferred = new Deferred();
			Request.actionA(
				tsCONST.API_GET_EXT_RESULT,
				req,
				true
			).then(
				lang.hitch(this, function(result){
					deferred.resolve(result);
				}),
				lang.hitch(this, function(errmsg){
					deferred.reject(errmsg);
				})
			);
			return deferred.promise;
		},
		/**
		 * 勤怠月次を読み込む
		 * @param {{empId:{string}, month:{number}}} obj
		 * @return {Object} dojo/Deferred.promise
		 */
		loadEmpMonth: function(obj){
			var deferred = new Deferred();
			if(this.pouch){
				delete this.pouch; // 保険として解放
				this.pouch = null;
			}
			this.pouch = new teasp.data.Pouch();
			teasp.manager.request(
//				'loadEmpMonthPrint',
				'loadEmpMonth',
				{ target:"empMonth", noDelay:true, empId:obj.empId, month:obj.month, subNo:obj.subNo },
				this.pouch,
				{ hideBusy : true },
				this,
				function(){
					deferred.resolve(true);
				},
				function(event){
					deferred.reject(Util.getErrorMessage(event));
				}
			);
			return deferred.promise;
		},
		/**
		 * 休暇マスタ等のデータ取得
		 * @param {Function} callback
		 */
		loadEmpMonthDelay: function(callback){
			var empId = this.getEmpId();
			if(!empId || this.pouch.dataObj.dayMap){
				callback(true);
				return;
			}
			teasp.manager.request(
				'loadEmpMonthDelay',
				{
					empId : empId,
					date  : this.getMonth().startDate
				},
				this.pouch,
				{ hideBusy : true },
				this,
				lang.hitch(this, function(obj){
					callback(true);
				}),
				function(event){
					callback(false, Util.getErrorMessage(event));
				}
			);
		},
		/**
		 * AtkCommon__cをサーバから取得
		 * @param {tsext.testAssist.TestAssitView} view
		 * @return {Object} dojo/Deferred.promise
		 */
		fetchCommon: function(view){
			return this.currentMaster.fetchCommon(view);
		},
		/**
		 * マスタデータをサーバから取得
		 * @param {tsext.testAssist.TestAssitView} view
		 * @param {Array.<string>|null} targets
		 * @return {Object} dojo/Deferred.promise
		 */
		fetchMaster: function(view, targets){
			return this.currentMaster.fetchMasterStart(view, targets);
		},
		/**
		 * マスタデータの名前からIDを得る
		 * ※第3,4引数をtrue以外でこの関数を呼ぶ際は try-catch で囲むこと
		 * @return {string|null}
		 */
		getIdByName: function(key, name, allowDupl, nullable){
			return this.currentMaster.getIdByName(key, name, allowDupl, nullable);
		},
		/**
		 * マスタデータの名前からオブジェクトを得る
		 * ※第3,4引数をtrue以外でこの関数を呼ぶ際は try-catch で囲むこと
		 * @return {string|null}
		 */
		getObjByName: function(key, name, allowDupl, nullable){
			return this.currentMaster.getObjByName(key, name, allowDupl, nullable);
		},
		/**
		 * 休暇管理名の配列を得る
		 * @return {Array.<string>}
		 */
		getManageNames: function(){
			var nameMap = this.currentMaster.getNameMapByKey('holidays');
			var names = [];
			for(var name in nameMap){
				var objs = nameMap[name];
				for(var i = 0 ; i < objs.length ; i++){
					var obj = objs[i];
					if(obj.Managed__c){
						if(names.indexOf(obj.ManageName__c) < 0){
							names.push(obj.ManageName__c);
						}
					}
				}
			}
			return names.concat('代休');
		},
		/**
		 * 勤怠日次申請
		 * @param {tsext.testAssist.Bagged} bagged
		 * @param {Object} req
		 */
		applyEmpDay: function(bagged, req, executeLog){
			var deferred = new Deferred();
			var apply = req.apply;
//			if(executeLog){
				bagged.outputLog(executeLog);
//			}else{
//				bagged.outputLog(apply.applyType + ' ' + Util.getStartEndDate(apply.startDate, apply.endDate));
//			}
			teasp.manager.request(
				'applyEmpDay',
				req,
				this.pouch,
				{ hideBusy : true },
				this,
				function(){
					deferred.resolve(true);
				},
				function(event){
					deferred.reject(Util.getErrorMessage(event));
				},
				function(){
				}
			);
			return deferred.promise;
		},
		/**
		 * 勤怠日次申請取消
		 * @param {tsext.testAssist.Bagged} bagged
		 * @param {Object} apply
		 */
		cancelApplyEmpDay: function(bagged, apply){
			var deferred = new Deferred();
			var month = this.getMonth();
			bagged.outputLog('申請取消 ' + apply.applyType
					+ ' ' + Util.getStartEndDate(apply.startDate, apply.endDate)
					);
			var req = {
				action: "cancelApplyEmpDay",
				empId: this.getEmpId(),
				date: apply.startDate,
				month: month.yearMonth,
				startDate: month.startDate,
				lastModifiedDate: month.lastModifiedDate,
				appId: apply.id,
				clearTime: false,
				client: "monthly",
				noDelay: false,
				remove: false
			};
			teasp.manager.request(
				'cancelApplyEmpDay',
				req,
				this.pouch,
				{ hideBusy : true },
				this,
				function(){
					deferred.resolve(true);
				},
				function(event){
					deferred.reject(Util.getErrorMessage(event));
				}
			);
			return deferred.promise;
		},
		/**
		 * 月次確定
		 * @param {tsext.testAssist.Bagged} bagged
		 * @param {number} reqType 1:申請 -1:取消
		 * @param {Object} req
		 */
		applyEmpMonth: function(bagged, reqType, req){
			var deferred = new Deferred();
			var apply = req.apply;
			bagged.outputLog('月次確定' + (reqType == 1 ? '' : '取消'));
			teasp.manager.request(
				(reqType == 1 ? 'applyEmpMonth' : 'cancelApplyEmpMonth'),
				req,
				this.pouch,
				{ hideBusy : true },
				this,
				function(){
					deferred.resolve(true);
				},
				function(event){
					deferred.reject(Util.getErrorMessage(event));
				}
			);
			return deferred.promise;
		},
		/**
		 * 承認/却下
		 * @param {tsext.testAssist.Bagged} bagged
		 * @param {boolean} flag true:承認 false:却下
		 * @param {string} comment
		 * @param {Array.<{id:{string}}>} objs
		 */
		approveOrReject: function(bagged, flag, comment, objs){
			var deferred = new Deferred();
			bagged.outputLog('承認/却下');
			var req = {
				comment	: comment,
				apply	: objs,
				approve	: flag,
				objKey	: 'empApply'
			};
			teasp.manager.request(
				'empExpApproval',
				req,
				this.pouch,
				{ hideBusy : true },
				this,
				function(){
					deferred.resolve(true);
				},
				function(event){
					deferred.reject(Util.getErrorMessage(event));
				}
			);
			return deferred.promise;
		},
		/**
		 * 勤怠時刻修正申請の反映
		 * @param {tsext.testAssist.Bagged} bagged
		 * @param {Object} apply
		 */
		 reviseApplyEnter: function(bagged, apply){
			var deferred = new Deferred();
			var month = this.getMonth();
			bagged.outputLog('反映 ' + apply.applyType + ' ' + apply.startDate);
			var req = {
				empId: this.getEmpId(),
				month: month.yearMonth,
				startDate: month.startDate,
				lastModifiedDate: month.lastModifiedDate,
				mode: this.pouch.getMode(),
				date: apply.startDate,
				dayFix: false,
				client: "monthly",
				timeTable: Util.fromJson(apply.timeTable),
				empApplyId: apply.id,
				ngFlag: false,
				refreshWork: false,
				useInputAccessControl: false
			};
			teasp.manager.request(
				'inputTimeTable',
				req,
				this.pouch,
				{ hideBusy : true },
				this,
				function(){
					deferred.resolve(true);
				},
				function(event){
					deferred.reject(Util.getErrorMessage(event));
				}
			);
			return deferred.promise;
		},
		/**
		 * 勤務表再表示
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		refresh: function(bagged){
			if(this.isSettingMode()){ // 設定モードの時は不要
				return;
			}
			this.changeMonth(bagged, null);
		},
		/**
		 * 月度変更
		 * js/src/view/ViewMonthly.js の changeMonth とほぼ同じ
		 * @param {tsext.testAssist.Bagged} bagged
		 * @param {Object} month_
		 */
		changeMonth: function(bagged, month_){
			var deferred = new Deferred();
			var month = month_ || this.getMonth();
			bagged.outputLog('勤怠月次読込 ' + this.getEmpName() + ' ' + (month.yearMonth || ''));
			var obj = this.pouch.getObj();
			obj.params = {
				target    : 'empMonth',
				empId     : this.getEmpId(),
				empTypeId : this.pouch.getEmpTypeId(),
				month     : month.yearMonth,
				subNo     : month.subNo,
				startDate : month.startDate,
				endDate   : month.endDate,
				mode      : this.pouch.getMode()
			};
			this.loadEmpMonth(obj.params).then(
				lang.hitch(this, function(){
					this.loadEmpMonthDelay(lang.hitch(this, function(flag, errmsg){
						if(flag){
							bagged.outputLog(Constant.LOG_OK);
							deferred.resolve(true);
						}else{
							deferred.reject(errmsg);
						}
					}));
				}),
				lang.hitch(this, function(errmsg){
					deferred.reject(errmsg);
				})
			);
			return deferred.promise;
		},
		/**
		 * エクスポート用のデータ作成
		 * @return {Array.<Object>}
		 */
		getExportData: function(){
			var data = [];
			var inouts = [];
			var applys = [];
			var month = this.pouch.dataObj.month || {};
			var days = (this.pouch.dataObj.days || {});
			var md  = moment(month.startDate, Constant.YMD1);
			var med = moment(month.endDate  , Constant.YMD1);
			while(md.isSameOrBefore(med)){
				var d = md.format(Constant.YMD1);
				var day = days[d];
				inouts.push({
					date      : d,
					startTime : day.startTime || null,
					endTime   : day.endTime || null,
					timeTable : day.timeTable || [],
					note      : day.note || null
				});
				var as = (day.rack && day.rack.allApplys) || [];
				for(var i = 0 ; i < as.length ; i++){
					var a = as[i];
					if(teasp.constant.STATUS_FIX.contains(a.status)){
						applys.push(a);
					}
				}
				md = md.add(1, 'day');
			}
			for(var i = 0 ; i < applys.length ; i++){
				var a = applys[i];
				var v = [];
				v[Constant.INDEX_KEY]    = Constant.KEY_ENTRY;
				v[Constant.INDEX_SUBKEY] = Constant.KEY_SHEET;
				if(a.applyType == Constant.APPLY_TYPE_LEAVE){ // 休暇申請
					v[Constant.INDEX_ITEM1]  = Constant.ITEM1_LEAVE;
					v[Constant.INDEX_ITEM2]  = a.holiday.name;
					v[Constant.INDEX_DATE1]  = a.startDate || '';
					v[Constant.INDEX_DATE2]  = a.endDate || '';
					v[Constant.INDEX_INOUT]  = Util.getStartEndTime(a.startTime, a.endTime, '-');
					v[Constant.INDEX_NOTE]   = a.note || '';
					v[Constant.INDEX_ETC1]   = a.contact || '';
				}else if(a.applyType == Constant.APPLY_TYPE_HOLIDAY_WORK){ // 休日出勤申請
					v[Constant.INDEX_ITEM1] = Constant.ITEM1_HOLIDAY_WORK;
					v[Constant.INDEX_DATE1] = a.startDate || '';
					v[Constant.INDEX_DATE2] = '';
					v[Constant.INDEX_INOUT] = Util.getStartEndTime(a.startTime, a.endTime, '-');
//					v[Constant.INDEX_RESTS] = ''; // 休憩時間
					v[Constant.INDEX_NOTE]  = a.note || '';
//					v[Constant.INDEX_ETC1]  = ''; // 代休取得予定
//					v[Constant.INDEX_ETC2]  = ''; // 代休取得予定日1
//					v[Constant.INDEX_ETC3]  = ''; // 代休タイプ1
//					v[Constant.INDEX_ETC4]  = ''; // 代休取得予定日2
//					v[Constant.INDEX_ETC5]  = ''; // 代休タイプ2
//					v[Constant.INDEX_ETC6]  = ''; // 直行直帰
//					v[Constant.INDEX_ETC7]  = ''; // 作業区分
//					v[Constant.INDEX_ETC8]  = ''; // 前泊移動時間
				}else if(a.applyType == Constant.APPLY_TYPE_PATTERNS // 勤務時間変更申請
					|| a.applyType == Constant.APPLY_TYPE_PATTERNL){ // 長期時間変更申請
					v[Constant.INDEX_ITEM1] = Constant.ITEM1_PATTERN;
					v[Constant.INDEX_DATE1] = a.startDate || '';
					v[Constant.INDEX_DATE2] = a.endDate || '';
					v[Constant.INDEX_INOUT] = Util.getStartEndTime(a.startTime, a.endTime, '-');
					v[Constant.INDEX_NOTE]  = a.note || '';
//					v[Constant.INDEX_ETC1]  = ''; // 勤務日の設定
				}else if(a.applyType == Constant.APPLY_TYPE_EXCHANGE){ // 振替申請
					v[Constant.INDEX_ITEM1] = Constant.ITEM1_PATTERN;
					v[Constant.INDEX_DATE1] = a.startDate || '';
					v[Constant.INDEX_DATE2] = a.exchangeDate || '';
					v[Constant.INDEX_NOTE]  = a.note || '';
					v[Constant.INDEX_ETC1]  = a.contact || '';
				}else if(a.applyType == Constant.APPLY_TYPE_ZANGYO){ // 残業申請
					v[Constant.INDEX_ITEM1] = Constant.ITEM1_ZANGYO;
					v[Constant.INDEX_DATE1] = a.startDate || '';
					v[Constant.INDEX_DATE2] = a.endDate || '';
					v[Constant.INDEX_INOUT] = Util.getStartEndTime(a.startTime, a.endTime, '-');
					v[Constant.INDEX_NOTE]  = a.note || '';
				}else if(a.applyType == Constant.APPLY_TYPE_EARLY_WORK){ // 早朝勤務申請
					v[Constant.INDEX_ITEM1] = Constant.ITEM1_EARLYSTART;
					v[Constant.INDEX_DATE1] = a.startDate || '';
					v[Constant.INDEX_DATE2] = a.endDate || '';
					v[Constant.INDEX_INOUT] = Util.getStartEndTime(a.startTime, a.endTime, '-');
					v[Constant.INDEX_NOTE]  = a.note || '';
				}else if(a.applyType == Constant.APPLY_TYPE_LATESTART){ // 遅刻申請
					v[Constant.INDEX_ITEM1] = Constant.ITEM1_LATESTART;
					v[Constant.INDEX_DATE1] = a.startDate || '';
					v[Constant.INDEX_DATE2] = a.endDate || '';
					v[Constant.INDEX_INOUT] = Util.getStartEndTime(a.startTime, a.endTime, '-');
					v[Constant.INDEX_NOTE]  = a.note || '';
					v[Constant.INDEX_ETC1]  = (typeof(a.ownReason) == 'boolean' ? a.ownReason : '');
					v[Constant.INDEX_ETC2]  = a.treatDeduct;
				}else if(a.applyType == Constant.APPLY_TYPE_EARLYEND){ // 早退申請
					v[Constant.INDEX_ITEM1] = Constant.ITEM1_EARLYEND;
					v[Constant.INDEX_DATE1] = a.startDate || '';
					v[Constant.INDEX_DATE2] = a.endDate || '';
					v[Constant.INDEX_INOUT] = Util.getStartEndTime(a.startTime, a.endTime, '-');
					v[Constant.INDEX_NOTE]  = a.note || '';
					v[Constant.INDEX_ETC1]  = (typeof(a.ownReason) == 'boolean' ? a.ownReason : '');
					v[Constant.INDEX_ETC2]  = a.treatDeduct;
				}
				if(v.length){
					data.push(v);
				}
			}
			for(var i = 0 ; i < inouts.length ; i++){
				var io = inouts[i];
				var restAway = this.getCsvTimeTable(io.timeTable);
				var v = [];
				v[Constant.INDEX_KEY]    = Constant.KEY_ENTRY;
				v[Constant.INDEX_SUBKEY] = Constant.KEY_SHEET;
				v[Constant.INDEX_ITEM1]  = Constant.ITEM1_INOUT;
				v[Constant.INDEX_DATE1]  = io.date;
				v[Constant.INDEX_INOUT]  = Util.getStartEndTime(io.startTime, io.endTime, '-');
				v[Constant.INDEX_RESTS]  = restAway.rests;
				v[Constant.INDEX_NOTE]   = io.note;
				v[Constant.INDEX_ETC1]   = restAway.aways; // 公用外出時間
				data.push(v);
			}
			return data;
		},
		/**
		 * 承認待ちの申請を返す
		 * @param {string} d (yyyy-MM-dd)
		 * @param {string} applyType 申請種類
		 * @returns 
		 */
		getWaitingApplyByApplyType: function(d, applyType){
			if(applyType == Constant.APPLY_TYPE_MONTHLY_ZANGYO){ // 月次残業申請
				var applys = this.pouch.getMonthlyOverTimeApplys();
				var apply = (applys.length ? applys[applys.length - 1] : null);
				return ((apply.status == Constant.STATUS_WAIT) ? apply : null);
			}
			var applyTypes = [applyType];
			if(applyType == Constant.APPLY_TYPE_PATTERNS){
				applyTypes.push(Constant.APPLY_TYPE_PATTERNL);
			}
			var day = (this.pouch.dataObj.days || {})[d];
			var applys = [];
			if(day){
				var waiting = ((day.rack || {}).validApplys || {}).waiting || [];
				for(var i = 0 ; i < waiting.length ; i++){
					if(applyTypes.indexOf(waiting[i].applyType) >= 0
					&& waiting[i].startDate == d){
						applys.push(waiting[i]);
					}
				}
			}
			if(applys.length > 1){
				applys = applys.sort(function(a, b){
					if(a.applyTime == b.applyTime){
						return (a.id < b.id ? 1 : -1);
					}
					return (a.applyTime < b.applyTime ? 1 : -1);
				});
			}
			return (applys.length ? applys[0] : null);
		}
	}))();
	return teasp.viewPoint;
});
