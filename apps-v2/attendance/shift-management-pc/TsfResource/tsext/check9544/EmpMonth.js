define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.check9544.EmpMonth", null, {
		constructor : function(emps, o){
			this.emps = emps;
			o.longLastModifiedDate = o.LastModifiedDate;
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			o.StartDate__c	   = Util.formatDate(o.StartDate__c);
			o.EndDate__c	   = Util.formatDate(o.EndDate__c);
			if(o.EmpId__r.EntryDate__c){
				o.EmpId__r.EntryDate__c = Util.formatDate(o.EmpId__r.EntryDate__c);
			}
			if(o.EmpId__r.EndDate__c){
				o.EmpId__r.EndDate__c = Util.formatDate(o.EmpId__r.EndDate__c);
			}
			if(o.EmpApplyId__r){
				o.EmpApplyId__r.CreatedDate	     = Util.formatDateTime(o.EmpApplyId__r.CreatedDate);
				o.EmpApplyId__r.LastModifiedDate = Util.formatDateTime(o.EmpApplyId__r.LastModifiedDate);
			}
			this.obj = o;
			this.targetFlag = false;
			this.detectionType = null;
		},
		getId           : function(){ return this.obj.Id; },
		getName         : function(){ return this.obj.Name; },
		getEmpId        : function(){ return this.obj.EmpId__c; },
		getEmpEntryDate : function(){ return this.obj.EmpId__r.EntryDate__c || null; },
		getEmpEndDate   : function(){ return this.obj.EmpId__r.EndDate__c || null; },
		getCreatedDate  : function(){ return this.obj.CreatedDate; },
		getLastModifiedDate: function(){ return this.obj.LastModifiedDate; },
		getStartDate    : function(){ return this.obj.StartDate__c; },
		getEndDate      : function(){ return this.obj.EndDate__c; },
		getYearMonth    : function(){ return this.obj.YearMonth__c; },
		getYearMonthS   : function(){ return this.obj.YearMonth__c + (this.obj.SubNo__c ? '(' + (this.obj.SubNo__c + 1) + ')' : ''); },
		getSubNo        : function(){ return this.obj.SubNo__c; },
		getStatus       : function(){ return (this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.Status__c) || '未確定'; },
		getDeptId       : function(){ return (this.obj.DeptMonthId__r && this.obj.DeptMonthId__r.DeptId__c) || null; },
		getDeptCode     : function(){ return (this.obj.DeptMonthId__r && this.obj.DeptMonthId__r.DeptId__r && this.obj.DeptMonthId__r.DeptId__r.DeptCode__c) || null; },
		getDeptName     : function(){ return (this.obj.DeptMonthId__r && this.obj.DeptMonthId__r.DeptId__r && this.obj.DeptMonthId__r.DeptId__r.Name) || null; },
		getEmpTypeId    : function(){ return this.obj.EmpTypeId__c; },
		getEmpTypeName  : function(){ return (this.obj.EmpTypeId__r && this.obj.EmpTypeId__r.Name) || null; },
		getWorkSystem      : function(){ return parseInt(this.obj.ConfigId__r.WorkSystem__c    , 10); },
		getVariablePeriod  : function(){ return parseInt(this.obj.ConfigId__r.VariablePeriod__c, 10); },
		getStandardFixTime : function(){ return this.obj.ConfigId__r.StandardFixTime__c; },
		getInitialDayOfWeek: function(){ return parseInt(this.obj.EmpTypeId__r.ConfigBaseId__r.InitialDayOfWeek__c, 10); },
		getWorkChargeTime       : function(flag){ return flag ? Util.formatTime(this.obj.WorkChargeTime__c)       : (this.obj.WorkChargeTime__c       || 0); },
		getWorkLegalOverTime    : function(flag){ return flag ? Util.formatTime(this.obj.WorkLegalOverTime__c)    : (this.obj.WorkLegalOverTime__c    || 0); },
		getWorkLegalOutOverTime : function(flag){ return flag ? Util.formatTime(this.obj.WorkLegalOutOverTime__c) : (this.obj.WorkLegalOutOverTime__c || 0); },
		getLegalWorkTimeOfPeriod: function(flag){ return flag ? Util.formatTime(this.obj.LegalWorkTimeOfPeriod__c) : (this.obj.LegalWorkTimeOfPeriod__c || 0); },
		getWorkFixedTime        : function(flag){ return flag ? Util.formatTime(this.obj.WorkFixedTime__c        ) : (this.obj.WorkFixedTime__c         || 0); },
		getWorkWholeTime        : function(flag){ return flag ? Util.formatTime(this.obj.WorkWholeTime__c        ) : (this.obj.WorkWholeTime__c         || 0); },
		getWorkRealTime         : function(flag){ return flag ? Util.formatTime(this.obj.WorkRealTime__c         ) : (this.obj.WorkRealTime__c          || 0); },
		getHolidayWorkTime      : function(flag){ return flag ? Util.formatTime(this.obj.HolidayWorkTime__c      ) : (this.obj.HolidayWorkTime__c       || 0); },
		getAdditionalWorkChargeTime  : function(flag){ return flag ? Util.formatTime(this.obj.AdditionalWorkChargeTime__c) : (this.obj.AdditionalWorkChargeTime__c || 0); },
		isFlexLegalWorkTimeOption1   : function(){ return (this.obj.ConfigId__r && this.obj.ConfigId__r.FlexLegalWorkTimeOption__c == '1'); },
		getLongLastModifiedDate: function(){
			return this.obj.longLastModifiedDate;
		},
		setTarget: function(flag){
			this.targetFlag = flag;
		},
		isTarget: function(){
			return this.targetFlag;
		},
		/**
		 * 元の月の法定労働時間
		 * @param {boolean=} flag
		 * @return {string|number}
		 */
		getOrgLegalWorkTime: function(flag){
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			var empSd = this.getEmpEntryDate();
			var empEd = this.getEmpEndDate();
			if(empSd && sd < empSd){
				sd = empSd;
			}
			if(empEd && empEd < ed){
				ed = empEd;
			}
			var dayCnt = teasp.util.date.daysInRange(sd, ed);
			var t = Math.floor(dayCnt*40*60/7);
			return flag ? Util.formatTime(t) : t;
		},
		/**
		 * 月の法定労働時間（勤怠月次の値そのまま）
		 * @param {boolean=} flag
		 * @return {string|number}
		 */
		getLegalWorkTime: function(flag){
			var t = this.obj.LegalWorkTime__c;
			if(!t){
				return '';
			}
			return flag ? Util.formatTime(t) : t;
		},
		/**
		 * 法定調整
		 * フレックスかつ清算期間=1ヶ月かつ所定労働時間＞法定労働時間の場合、所定労働時間を法定労働時間として扱う＝オンなら"1"、それ以外は""を返す
		 * @return {string}
		 */
		getAdjustOption: function(){
			return (this.getWorkSystem() == 1 && this.getVariablePeriod() == 1 && this.isFlexLegalWorkTimeOption1()) ? "1" : "";
		},
		/**
		 * 検出タイプを得る
		 * ・日タイプ変更あり=1
		 * ・勤務パターン変更あり=2
		 * ・振替あり=4
		 * ・法定休日の退社時刻24時超え=8
		 */
		buildDetectionType: function(){
			if(this.getWorkSystem() != 1){ // フレックスでなければ空欄を返す
				this.detectionType = null;
			}
			var opt = this.isFlexLegalWorkTimeOption1();
			var bit = 0;
			var days = this.obj.EmpMonthDay__r || [];
			for(var i = 0 ; i < days.length ; i++){
				var day = days[i];
				if((day.PatternSApplyId__r && day.PatternSApplyId__r.DayType__c)
				|| (day.PatternLApplyId__r && day.PatternLApplyId__r.DayType__c) // 日タイプ変更の勤務時間変更申請がある
				){
					bit |= 1;
				}
				if(day.PatternId__c){ // 勤務パターンの変更があった
					bit |= 2;
				}
				if((day.ExchangeSApplyId__c || day.ExchangeEApplyId__c)
				&& !(day.ExchangeSApplyId__c && day.ExchangeEApplyId__c)){ // 振替申請がある
					bit |= 4;
				}
				if(day.DayType__c == '2' && day.EndTime__c > (24*60)){
					bit |= 8;
				}
			}
			this.detectionType = bit;
		},
		getDayTypeChanged      : function(){ return (this.detectionType & 1) ? "1" : '' },
		getPatternChanged      : function(){ return (this.detectionType & 2) ? "1" : '' },
		getExchanged           : function(){ return (this.detectionType & 4) ? "1" : '' },
		getOver24AtLegalHoliday: function(){ return (this.detectionType & 8) ? "1" : '' },
		/**
		 * 振替申請または日タイプ変更の勤務時間変更申請がある
		 * #9393 の発生条件
		 * @return {boolean}
		 */
		existExchangeOrChangeDayType: function(){
			if(!this.isFlexLegalWorkTimeOption1()){ // 所定労働時間＞法定労働時間の場合、所定労働時間を法定労働時間として扱う＝オフ
				return false;
			}
			var days = this.obj.EmpMonthDay__r || [];
			for(var i = 0 ; i < days.length ; i++){
				var day = days[i];
				if((day.ExchangeSApplyId__c || day.ExchangeEApplyId__c)
				&& !(day.ExchangeSApplyId__c && day.ExchangeEApplyId__c)){ // 振替申請がある
					return true;
				}
				if((day.PatternSApplyId__r && day.PatternSApplyId__r.DayType__c)
				|| (day.PatternLApplyId__r && day.PatternLApplyId__r.DayType__c) // 日タイプ変更の勤務時間変更申請がある
				|| day.PatternId__c // 勤務パターンの変更があった
				){
					return true;
				}
			}
			// 勤怠日次に紐づかない日タイプ変更の勤務時間変更申請があるか
			var flag = false;
			var emp = this.emps.getEmpById(this.getEmpId());
			if(emp && emp.isDayTypeChanged()){
				var d = this.getStartDate();
				var ed = this.getEndDate();
				while(d <= ed && !flag){
					if(emp.isDayTypeChangedDate(d)){
						flag = true;
					}
					d = Util.addDays(d, 1);
				}
			}
			return flag;
		},
		/**
		 * 法定休日の退社時刻が24時を超えている
		 * #9431 の発生条件
		 * @return {boolean}
		 */
		existOver24LegalHolidayWork: function(){
			var days = this.obj.EmpMonthDay__r || [];
			for(var i = 0 ; i < days.length ; i++){
				var day = days[i];
				if(day.DayType__c == '2' && day.EndTime__c > (24*60)){
					return true;
				}
			}
			return false;
		},
		/**
		 * 検査対象の月度か判別
		 * @param {tsext.check9544.EmpMonth} prevMonth
		 * @return {boolean}
		 */
		checkTarget: function(prevMonth){
			if(this.getEmpEntryDate() && this.getEndDate() < this.getEmpEntryDate()){
				return false;
			}
			if(this.getWorkSystem() == 1){ // フレックス
				if(this.existExchangeOrChangeDayType() // 振替申請または日タイプ変更の勤務時間変更申請がある
				|| this.existOver24LegalHolidayWork()  // 法定休日の退社時刻が24時を超えている
				){
					return true;
				}
			}
			if(this.getWorkSystem() != 2){ // 変形ではない
				return false;
			}
			if(!prevMonth){ // 前月の情報が取れない
				return false;
			}
			// #9372 発生条件
			var monthData = this.getMonthData();
			var prevMonthData = prevMonth.getMonthData();
			if(prevMonth.getWorkSystem() == 2 // 前月も変形
			&& monthData.periodSize == prevMonthData.periodSize // 前月と同じ変形期間
			&& monthData.periodSize > 1 // 変形期間1ヶ月超
			&& monthData.monthIndex > 0 // 変形期間の2ヶ月目以降
			&& monthData.standardFixTime != prevMonthData.standardFixTime // 前月と所定労働時間が違う
			&& (monthData.standardFixTime > 480 || prevMonthData.standardFixTime > 480) // 前月か当月のどちらかの所定労働時間が8h超
			&& this.isWeekSpanningFromLastMonth() // 最初の週は月跨ぎである
			){
				return true;
			}
			return false;
		},
		/**
		 * 月次サマリーデータを取得する
		 * @param {Object} param
		 * @param {Function} callback
		 */
		loadEmpMonthPrint: function(param, callback){
			this.pouch = new teasp.data.Pouch();
			teasp.manager.request(
				'loadEmpMonthPrint',
				{ target:"empMonth", noDelay:true, empId:this.getEmpId(), month:this.getYearMonth() },
				this.pouch,
				{ hideBusy : true },
				this,
				function(){
					var monthData = this.getMonthData(true);
					callback(true, monthData.ng);
				},
				function(event){
					callback(false, Util.getErrorMessage(event));
				}
			);
		},
		/**
		 * 指定年度の開始日～終了日を返す
		 * @param {number} year yyyy
		 * @return {{sd:{string},  // 開始日 yyyy-MM-dd
		 *           ed:{string}}} // 終了日 yyyy-MM-dd
		 */
		dateRangeOfYear: function(year){
			return teasp.util.date.dateRangeOfYear(
				this.obj.EmpTypeId__r.ConfigBaseId__r.InitialDateOfYear__c,
				this.obj.EmpTypeId__r.ConfigBaseId__r.MarkOfYear__c,
				this.obj.EmpTypeId__r.ConfigBaseId__r.InitialDateOfMonth__c,
				this.obj.EmpTypeId__r.ConfigBaseId__r.MarkOfMonth__c,
				year
			);
		},
		/**
		 * 当月を含む年度の開始日～終了日を返す
		 * @return {{sd:{string},  // 開始日 yyyy-MM-dd
		 *           ed:{string}}} // 終了日 yyyy-MM-dd
		 */
		getFiscalYear: function(){
			var y = Math.floor(this.getYearMonth() / 100);
			var yr = this.dateRangeOfYear(y);
			if(yr.ed < this.getStartDate()){
				yr = this.dateRangeOfYear(++y);
			}else if(this.getEndDate() < yr.sd){
				yr = this.dateRangeOfYear(--y);
			}
			return yr;
		},
		/**
		 * 当月を含む年度の期間の開始日～終了日を返す
		 * @return {Array.<{sd:{string},   // 開始日 yyyy-MM-dd
		 *                  ed:{string}}>} // 終了日 yyyy-MM-dd
		 */
		getPeriodRanges: function(){
			var YMD = 'YYYY-MM-DD';
			var yr = this.getFiscalYear();
			var periods = [];
			var vp = this.getVariablePeriod(); // 変形期間(0,1,2,3,6,12 のいずれか)
			if(!vp){
				vp = 1;
			}
			var mn = 12 / vp; // 12,4,2,1
			var sd = moment(yr.sd, YMD);
			for(var i = 0 ; i < mn ; i++){
				var nsd = moment(sd, YMD).add(vp, 'M');
				periods.push({
					sd: sd.format(YMD),
					ed: nsd.clone().add(-1, 'd').format(YMD)
				});
				sd = nsd;
			}
			return periods;
		},
		/**
		 * 年度内の変形期間何期目かを返す
		 * @param {Array.<{sd:{string},   // 開始日 yyyy-MM-dd
		 *                 ed:{string}}>} // 終了日 yyyy-MM-dd
		 * @return {number} 0～:何期目か -1:(ありえない)
		 */
		getPeriodIndex: function(periods){
			for(var i = 0 ; i < periods.length ; i++){
				var period = periods[i];
				if(period.sd < this.getEndDate()
				&& period.ed > this.getStartDate()){
					return i;
				}
			}
			return -1;
		},
		/**
		 * 変形期間内の何月目か（経過月）を返す
		 * @param {{sd:{string},  // 開始日 yyyy-MM-dd
		 *          ed:{string}}} // 終了日 yyyy-MM-dd
		 * @return {number} 0～:何月目か -1:(ありえない)
		 */
		getMonthIndex: function(period){
			var YMD = 'YYYY-MM-DD';
			var sd = period.sd;
			var index = 0;
			while(sd < period.ed){
				var nsd = moment(sd, YMD).add(1, 'M');
				var ed = nsd.clone().add(-1, 'd').format(YMD);
				if(sd < this.getEndDate()
				&& ed > this.getStartDate()){
					return index;
				}
				sd = nsd.format(YMD);
				index++;
			}
			return -1;
		},
		/*
		 * 先月から今月にまたぐ週があるか
		 * @return {boolean}
		 */
		isWeekSpanningFromLastMonth: function(){
			var YMD = 'YYYY-MM-DD';
			var idw = this.getInitialDayOfWeek();
			var sd = moment(this.getStartDate(), YMD); // 開始日
			var sdw = sd.day();
			if(sdw != idw){
				return true;
			}
			return false;
		},
		/**
		 * 週情報の配列を返す
		 * @param {Object} monthData 月度情報
		 * @return {Array.<Object>} 週情報の配列
		 */
		getWeeks: function(monthData){
			var YMD = 'YYYY-MM-DD';
			var idw = this.getInitialDayOfWeek();
			var sd = moment(this.getStartDate(), YMD); // 開始日
			var nd = moment(this.getEndDate()  , YMD).add(1, 'd'); // 終了日+1日
			var sdw = sd.day();
			var ndw = nd.day();
			if(monthData.monthIndex > 0 && sdw != idw){
				// 開始日を前月の週の起算日へずらす
				sd = sd.add(Math.min(idw - sdw - (sdw < idw ? 7 : 0), 0), 'd');
			}
			if((monthData.monthIndex + 1) < monthData.periodSize && ndw != idw){
				// 終了日+1日を翌月の週の起算日へずらす
				nd = nd.add(Math.max(idw - ndw + (idw < ndw ? 7 : 0), 0), 'd');
			}
			var weeks = [];
			var week = { days:[] };
			weeks.push(week);
			var d = sd.clone();
			while(d.isBefore(nd)){
				if(d.day() == idw && week.days.length){
					week = { days:[] };
					weeks.push(week);
				}
				week.days.push(this.buildDayData(d.format(YMD)));
				d = d.add(1, 'd');
			}
			return weeks;
		},
		/**
		 * 日情報を返す
		 * @param {string} 日付('yyyy-MM-dd')
		 * @return {Object}
		 */
		buildDayData: function(date){
			var dw = moment(date, 'YYYY-MM-DD').day();
			var day = (this.pouch && this.pouch.dataObj && this.pouch.dataObj.days[date]);
			var dayData = {
				date                : date,
				dayOfWeek           : ['日','月','火','水','木','金','土'][dw],
				workFixedTime       : (day && day.rack && day.rack.fixTime) || 0,
				workWholeTime       : (day && day.disc && day.disc.workWholeTime) || 0,
				workRealTime        : (day && day.disc && day.disc.workRealTime) || 0,
				workLegalOutOverTime: (day && day.disc && day.disc.workLegalOutOverTime) || 0,
				workHolidayTime     : (day && day.disc && day.disc.workHolidayTime) || 0,
				workChargeTime      : (day && day.disc && day.disc.workChargeTime) || 0,
				weekNo              : 0,    // buildMonthData()内でセットする
				innerMonth          : null, // buildMonthData()内でセットする
				legalTimeOfWeek     : 0,    // buildMonthData()内でセットする
				fixedTimeOfWeek     : 0,    // buildMonthData()内でセットする
				workLegalTimeOfWeek : 0,    // buildMonthData()内でセットする
				chargeTimeOfWeek    : 0     // buildMonthData()内でセットする
			};
			return dayData;
		},
		/**
		 * 月情報作成済みか
		 * @return {Object}
		 */
		isBuildMonthData: function(){
			return (this.monthData ? true : false);
		},
		/**
		 * 月情報を返す
		 * @return {Object}
		 */
		getMonthData: function(flag){
			if(!this.monthData || flag){
				this.monthData = this.buildMonthData();
			}
			return this.monthData;
		},
		/**
		 * 月情報を作成
		 * ※(注意) loadEmpMonthPrint で生成した this.pouch を参照して最後に削除する。
		 * （this.pouch が大きすぎて解放しないとブラウザが死ぬため）
		 * @return {Object}
		 */
		buildMonthData: function(){
			var periods = this.getPeriodRanges();
			var px = this.getPeriodIndex(periods);
			var mx = this.getMonthIndex(periods[px]);
			var monthData = {
				workSystem: this.getWorkSystem(), // 労働時間制
				standardFixTime: this.getStandardFixTime(), // 所定労働時間
				periodSize: this.getVariablePeriod(), // 変形期間
				periodIndex: px,      // 年度内の変形期間何期目にあたるか（※0はじまり）
				period: periods[px],  // 当月を含む変形期間
				month: { sd:this.getStartDate(), ed:this.getEndDate() }, // 月度の開始日＆終了日
				monthIndex: mx,       // 変形期間内の何月目か（※0はじまり）
				dispTime: {
					workLegalOverTime: 0,    // 月次サマリーの法定時間内残業
					workLegalOutOverTime: 0, // 月次サマリーの法定時間外残業
					workChargeTime: 0        // 月次サマリーの法定時間外割増（※追加割増労働時間を含んだ値）
				},
				ng: false,            // NGならtrue
				weeks: [],            // 週情報
				days: [],             // 月度内の日情報
				calcChargeTime: 0,    // 週の法定時間外割増の積み上げ（内部用に集計）
			};
			// 月次サマリーの法定時間外割増の値をセット
			var month = (this.pouch && this.pouch.dataObj && this.pouch.dataObj.month);
			if(month){
				monthData.dispTime.workLegalOverTime    = (month.disc && month.disc.workLegalOverTime) || 0;
				monthData.dispTime.workLegalOutOverTime = (month.disc && month.disc.workLegalOutOverTime) || 0;
				monthData.dispTime.workChargeTime       = (month.disc && month.disc.workChargeTime) || 0;
				monthData.dispTime.legalTime            = month.legalTime || 0;
				monthData.dispTime.legalTimeOfPeriod    = month.legalTimeOfPeriod || 0;
				monthData.dispTime.workFixedTime        = (month.disc && month.disc.workFixedTime) || 0;
				monthData.dispTime.workWholeTime        = (month.disc && month.disc.workWholeTime) || 0;
				monthData.dispTime.workRealTime         = (month.disc && month.disc.workRealTime) || 0;
				monthData.dispTime.workHolidayTime      = (month.disc && month.disc.workHolidayTime) || 0;
			}
			// サーバ側法定時間外割増と月次サマリーの法定時間外割増が合わなければ ng=true
			monthData.ng = (
					   this.getWorkLegalOverTime()    != monthData.dispTime.workLegalOverTime
					|| this.getWorkLegalOutOverTime() != monthData.dispTime.workLegalOutOverTime
					|| this.getWorkChargeTime()       != monthData.dispTime.workChargeTime
					);

			// 詳細情報をセット
			monthData.weeks = this.getWeeks(monthData);
			for(var w = 0 ; w < monthData.weeks.length ; w++){
				var week = monthData.weeks[w];
				var dayCnt = 0;
				var fixTime = 0;
				var realTime = 0;
				var legalOutTime = 0;
				var holidayTime = 0;
				var chargeTime = 0;
				var lastX = -1;
				for(var x = 0 ; x < week.days.length ; x++){
					var dayData = week.days[x]; // (注)月内の日とは限らない
					monthData.days.push(dayData);
					dayData.weekNo = (w + 1);
					fixTime      += (dayData.workFixedTime || 0);
					realTime     += (dayData.workRealTime || 0);
					legalOutTime += (dayData.workLegalOutOverTime || 0);
					holidayTime  += (dayData.workHolidayTime || 0);
					chargeTime   += (dayData.workChargeTime || 0);
					dayCnt++;
					lastX = x;
				}
				// 週の法定時間外割増を計算
				var calct = Math.max(realTime - legalOutTime - holidayTime - Math.max(fixTime, Math.floor(40*60*dayCnt/7)), 0);
				if(lastX >= 0){
					// 週の最終日に値をセット
					var dayData = week.days[lastX];
					dayData.legalTimeOfWeek = Math.floor(40*60*dayCnt/7);	// 週の法定労働時間
					dayData.fixedTimeOfWeek = fixTime;						// 週の所定労働時間
					dayData.workLegalTimeOfWeek = Math.max(realTime - legalOutTime - holidayTime, 0); // 週の法休と法外残を除く実労働時間
					// 週の法定時間外割増は週の最終日から逆のぼりながらセット
					for(var x = lastX ; (x >= 0 && calct > 0) ; x--){
						var dayData = week.days[x];
						var t = Math.min(Math.max(dayData.workRealTime - dayData.workLegalOutOverTime - dayData.workHolidayTime, 0), calct);
						dayData.chargeTimeOfWeek = t;
						calct -= t;
					}
				}
			}
			// 週の法定時間外割増を月内で集計
			for(var i = 0 ; i < monthData.days.length ; i++){
				var dayData = monthData.days[i];
				if(dayData.date < this.getStartDate() || this.getEndDate() < dayData.date){
					continue;
				}
				dayData.innerMonth = 1;
				monthData.calcChargeTime += dayData.chargeTimeOfWeek;
			}
			// メモリ節約のため this.pouch は解放する
			delete this.pouch;
			this.pouch = null;
			return monthData;
		}
	});
});
