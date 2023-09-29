define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤怠申請
	return declare("tsext.testAssist.ExportEmpApply", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 */
		constructor: function(manager, obj){
			this.obj.StartDate__c = Util.formatDate(this.obj.StartDate__c);
			this.obj.EndDate__c = Util.formatDate(this.obj.EndDate__c);
			this.obj.ExchangeDate__c = Util.formatDate(this.obj.ExchangeDate__c);
			this.obj.OriginalStartDate__c = Util.formatDate(this.obj.OriginalStartDate__c);
			this.obj.DaiqDate1__c = Util.formatDate(this.obj.DaiqDate1__c);
			this.obj.DaiqDate2__c = Util.formatDate(this.obj.DaiqDate2__c);
			this.obj.ApplyTime__c = Util.formatDateTime(this.obj.ApplyTime__c);
			this.obj.ApproveTime__c = Util.formatDateTime(this.obj.ApproveTime__c);
		},
		getStartDate: function(){
			return this.obj.StartDate__c;
		},
		getEndDate: function(){
			return this.obj.EndDate__c;
		},
		getExchangeDate: function(){
			return this.obj.ExchangeDate__c;
		},
		getOriginalStartDate: function(){
			return this.obj.OriginalStartDate__c;
		},
		getApplyType: function(){
			return this.obj.ApplyType__c;
		},
		getPatternId: function(){
			return this.obj.PatternId__c;
		},
		getHolidayId: function(){
			return this.obj.HolidayId__c;
		},
		getStartEndTime: function(){
			var st = (typeof(this.obj.StartTime__c) == 'number' ? Util.formatTime(this.obj.StartTime__c) : null);
			var et = (typeof(this.obj.EndTime__c)   == 'number' ? Util.formatTime(this.obj.EndTime__c)   : null);
			return (st && et) ? (st + '-' + et) : '';
		},
		getApplyTime: function(){
			return this.obj.ApplyTime__c;
		},
		isStatusWait: function(){
			return (this.obj.Status__c == '承認待ち');
		},
		isStatusFix: function(){
			return (['承認済み', '確定済み'].indexOf(this.obj.Status__c) >= 0);
		},
		compare: function(other){
			var at1 = this.getApplyTime();
			var at2 = other.getApplyTime();
			if(at1 == at2){
				var x1 = Constant.APPLY_INPUT_ORDER.indexOf(this.getApplyType());
				var x2 = Constant.APPLY_INPUT_ORDER.indexOf(other.getApplyType());
				if(x1 == x2){
					return (this.getId() < other.getId() ? -1 : 1);
				}
				return x1 - x2;
			}
			return (at1 < at2 ? -1 : 1);
		},
		/**
		 * 勤怠申請のCSV作成
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {tsext.testAssist.ExportEmp} emp
		 * @param {{virMonth:{tsext.testAssist.ExportVirMonth},loaded:{boolean}}} curLoad 
		 * @param {tsext.testAssist.ExportVirMonth} virMonths
		 * @returns {Array.<string>}
		 */
		 outputExportEmpApply: function(lst, visit, emp, curLoad, virMonth){
			if(this.manager.checkApplyStored(this.getId())){
				return lst;
			}
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			var valid = false;
			var comments = [];
			var items = [
				Constant.KEY_ENTRY,
				Constant.KEY_SHEET,
				(this.isStatusFix() ? '承認' : '')
			];
			switch(this.getApplyType()){
			case Constant.ITEM1_EXCHANGE:		// 振替申請
				valid = this.outputEmpApplyExchange(items, comments, sd, ed);
				break;
			case Constant.ITEM1_LEAVE:			// 休暇申請
				valid = this.outputEmpApplyLeave(items, comments, sd, ed);
				break;
			case Constant.ITEM1_HOLIDAY_WORK:	// 休日出勤申請
				valid = this.outputEmpApplyHolidayWork(items, comments, sd, ed);
				break;
			case Constant.ITEM1_PATTERN:		// 勤務時間変更申請
			case Constant.ITEM1_PATTERNL:
				valid = this.outputEmpApplyPattern(items, comments, sd, ed);
				break;
			case Constant.ITEM1_ZANGYO:			// 残業申請
			case Constant.ITEM1_EARLYSTART:		// 早朝勤務申請
				valid = this.outputEmpApplyOverWork(items, comments, sd, ed);
				break;
			case Constant.ITEM1_LATESTART:		// 遅刻申請
			case Constant.ITEM1_EARLYEND:		// 早退申請
				valid = this.outputEmpApplyAbsence(items, comments, sd, ed);
				break;
			case Constant.ITEM1_REVISE_TIME:	// 勤怠時刻修正申請
				valid = this.outputEmpApplyReviseTime(items, comments, sd, ed);
				break;
			case Constant.ITEM1_MONTHLY_ZANGYO:	// 月次残業申請
				valid = this.outputEmpApplyMonthlyOverTime(items, comments, sd, ed);
				break;
			case Constant.ITEM1_DIRECT:			// 直行・直帰申請
				valid = this.outputEmpApplyDirect(items, comments, sd, ed);
				break;
			case Constant.ITEM1_SHIFTCHANGE:	// シフト振替申請
				valid = this.outputEmpApplyShiftChange(items, comments, sd, ed);
				break;
			case Constant.ITEM1_DAILY_FIX:		// 日次確定
				valid = this.outputEmpApplyDailyFix(items, comments, sd, ed);
				break;
			}
			if(valid){
				emp.outputExportLoadMonth(lst, visit, curLoad, sd);
				for(var i = 0 ; i < comments.length ; i++){
					lst.push(this.getCommentLine(comments[i]));
				}
				this.L(lst, items);
			}
			return lst;
		},
		// 振替申請
		outputEmpApplyExchange: function(items, comments, sd, ed){
			items.push(this.getApplyType());
			items.push('');
			items.push(sd);
			items.push(this.getExchangeDate());
			return true;
		},
		// 休暇申請
		outputEmpApplyLeave: function(items, comments, sd, ed){
			var holiday = this.manager.getHolidayById(this.getHolidayId());
			items.push(this.getApplyType());
			items.push(holiday.getName());
			items.push(sd);
			items.push(sd != ed ? ed : '');
			if(holiday.isTimeHoliday()){
				items.push(this.getStartEndTime());
			}else{
				items.push('');
			}
			return true;
		},
		// 休日出勤申請
		outputEmpApplyHolidayWork: function(items, comments, sd, ed){
			items.push(this.getApplyType());
			items.push('');
			items.push(sd);
			items.push(sd != ed ? ed : '');
			items.push(this.getStartEndTime());
			items.push(Util.convertTimeTable(this.obj.TimeTable__c || '', [21]));
			items.push('');
			items.push(this.Bool(this.obj.DaiqReserve__c));
			// 代休取得予定日は強制で空にする
			// items.push(this.obj.DaiqDate1__c || '');
			// items.push(Util.getRangeNumToJp(this.obj.DaiqDate1Range__c || ''));
			// items.push(this.obj.DaiqDate2__c || '');
			// items.push(Util.getRangeNumToJp(this.obj.DaiqDate2Range__c || ''));
			items.push('');
			items.push('');
			items.push('');
			items.push('');
			// 代休取得予定日が指定されていた場合、コメント行を追加
			if(this.obj.DaiqDate1__c && this.obj.DaiqDate1Range__c){
				var msg = '※次の申請の代休取得予定日1「' + this.obj.DaiqDate1__c + '（' + Util.getRangeNumToJp(this.obj.DaiqDate1Range__c) + '）」→空';
				if(this.obj.DaiqDate2__c && this.obj.DaiqDate2Range__c){
					msg += '、代休取得予定日2「' + this.obj.DaiqDate2__c + '（' + Util.getRangeNumToJp(this.obj.DaiqDate2Range__c) + '）」→空';
				}
				msg += 'に変換';
				comments.push(msg);
			}
			return true;
		},
		// 勤務時間変更申請
		outputEmpApplyPattern: function(items, comments, sd, ed){
			if(this.obj.Decree__c){
				items.push(Constant.ITEM1_SHIFT); // シフト設定
			}else{
				items.push(Constant.ITEM1_PATTERN); // 勤務時間変更申請
			}
			var patternId = this.getPatternId();
			var pattern = (patternId ? this.manager.getPatternById(patternId) : null);
			items.push(pattern ? pattern.getName() : '');
			items.push(sd);
			items.push(sd != ed ? ed : '');
			items.push(this.getStartEndTime());
			items.push('');
			items.push('');
			if(this.obj.DayType__c == '0'){
				items.push('勤務日');
			}else if(this.obj.DayType__c == '1'){
				items.push('所定休日');
			}else if(this.obj.DayType__c == '2'){
				items.push('法定休日');
			}else{
				items.push('');
			}
			return true;
		},
		// 残業申請, 早朝勤務申請
		outputEmpApplyOverWork: function(items, comments, sd, ed){
			items.push(this.getApplyType());
			items.push('');
			items.push(sd);
			items.push(sd != ed ? ed : '');
			items.push(this.getStartEndTime());
			return true;
		},
		// 遅刻申請, 早退申請
		outputEmpApplyAbsence: function(items, comments, sd, ed){
			items.push(this.getApplyType());
			items.push('');
			items.push(sd);
			items.push(sd != ed ? ed : '');
			if(this.getApplyType() == Constant.ITEM1_LATESTART){
				items.push(Util.formatTime(this.obj.EndTime__c));
			}else{
				items.push(Util.formatTime(this.obj.StartTime__c));
			}
			return true;
		},
		// 勤怠時刻修正申請
		outputEmpApplyReviseTime: function(items, comments, sd, ed){
			var tt = Util.fromJson(this.obj.TimeTable__c);
			var inout = null, rests = [];
			for(var i = 0 ; i < tt.length ; i++){
				var t = tt[i];
				if(t.type == 1){
					inout = Util.formatTime(t.from) + '-' + Util.formatTime(t.to);
				}else if(t.type == 21 || t.type == 22){
					rests.push(Util.formatTime(t.from) + '-' + Util.formatTime(t.to));
				}
			}
			if(this.isStatusFix()){
				items[2] = '反映';
			}
			items.push(this.getApplyType());
			items.push('');
			items.push(sd);
			items.push(sd != ed ? ed : '');
			items.push(inout);
			items.push(rests.join('|'));
			return true;
		},
		// 直行・直帰申請
		outputEmpApplyDirect: function(items, comments, sd, ed){
			var direct = '';
			if(this.obj.DirectFlag__c == 1){
				direct = '直行';
			}else if(this.obj.DirectFlag__c == 2){
				direct = '直帰';
			}else if(this.obj.DirectFlag__c == 3){
				direct = '直行直帰';
			}
			var time = (typeof(this.obj.TravelTime__c) == 'number' ? Util.formatTime(this.obj.TravelTime__c) : '');
			items.push(this.getApplyType());
			items.push(direct);
			items.push(sd);
			items.push(sd != ed ? ed : '');
			items.push(time);
			items.push('');
			items.push('');
			items.push(this.obj.WorkType__c || '');
			return true;
		},
		// シフト振替申請
		outputEmpApplyShiftChange: function(items, comments, sd, ed){
			items.push(this.getApplyType());
			items.push('');
			items.push(sd);
			items.push(this.getExchangeDate());
			return true;
		},
		// 日次確定
		outputEmpApplyDailyFix: function(items, comments, sd, ed){
			items.push(this.getApplyType());
			items.push('');
			items.push(sd);
			items.push(sd != ed ? ed : '');
			return true;
		},
		// 月次残業申請
		outputEmpApplyMonthlyOverTime: function(items, comments, sd, ed){
			items.push(this.getApplyType());
			items.push('');
			items.push(sd);
			items.push(sd != ed ? ed : '');
			items.push(Util.formatTime(this.obj.EstimatedOverTime__c));
			return true;
		}
	});
});
