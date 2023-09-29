define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/check9544/EmpMonths",
	"tsext/check9544/Const",
	"tsext/util/Util"
], function(declare, lang, array, str, EmpMonths, Const, Util){
	return declare("tsext.check9544.Emp", null, {
		constructor : function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			o.EntryDate__c	   = Util.formatDate(o.EntryDate__c);
			o.EndDate__c	   = Util.formatDate(o.EndDate__c);
			this.obj = o;
			this.dayTypeChangeMap = {};
		},
		reset: function(){
			this.months   = new EmpMonths();
		},
		getId: function(){
			return this.obj.Id;
		},
		getEmpCode: function(){
			return this.obj.EmpCode__c || null;
		},
		getName: function(){
			return this.obj.Name;
		},
		getDeptCode   : function(){ return (this.obj.DeptId__r && this.obj.DeptId__r.DeptCode__c) || ''; },
		getDeptName   : function(){ return (this.obj.DeptId__r && this.obj.DeptId__r.Name) || ''; },
		getEntryDate  : function(){ return this.obj.EntryDate__c || ''; },
		getEndDate    : function(){ return this.obj.EndDate__c || ''; },
		getEmpTypeName: function(){ return (this.obj.EmpTypeId__r && this.obj.EmpTypeId__r.Name) || ''; },
		addEmpMonth: function(month){
			this.months.addEmpMonth(month);
		},
		getEmpMonths: function(){
			return this.months.getEmpMonths();
		},
		/**
		 * 検査対象に絞り込んだ月度の配列に変換
		 * @param {boolean} notSuqeeze trueの場合は検査対象フラグのみセットして配列は変換しない
		 * @return {boolean}
		 */
		squeezeMonths: function(notSqueeze){
			var targets = [];
			var months = this.months.getEmpMonths();
			for(var i = 0 ; i < months.length ; i++){
				var month = months[i];
				var p = this.getPrevMonth(month);
				if(month.checkTarget(p)){
					month.setTarget(true);
					targets.push(month);
				}
			}
			if(!notSqueeze){
				this.months.resetEmpMonths(targets);
			}
			return this.months.getEmpMonths();
		},
		/**
		 * #9393の発生条件を満たすか
		 * @return {boolean}
		 */
		is9393Target: function(){
			var months = this.months.getEmpMonths();
			for(var i = 0 ; i < months.length ; i++){
				var month = months[i];
				if(month.getWorkSystem() == 1 // フレックス
				&& month.isFlexLegalWorkTimeOption1()){ // 所定労働時間＞法定労働時間の場合、所定労働時間を法定労働時間として扱う＝オン
					return true;
				}
			}
			return false;
		},
		/**
		 * 日タイプ変更を行った日付をセット
		 * @param {String} sd (yyyy-MM-dd)
		 * @param {String} ed (yyyy-MM-dd)
		 * @param {String} dayType (0,1,2)
		 */
		addDayTypeChangedDate: function(sd, ed, dayType){
			var d = sd;
			while(d && d <= (ed || sd)){
				this.dayTypeChangeMap[d] = 1;
				d = Util.addDays(d, 1);
			}
		},
		/**
		 * 日タイプ変更を行ったか
		 * @return {boolean}
		 */
		isDayTypeChanged: function(){
			return (Object.keys(this.dayTypeChangeMap).length > 0);
		},
		/**
		 * 日タイプ変更を行った日か
		 * @return {boolean}
		 */
		isDayTypeChangedDate: function(d){
			return (d && this.dayTypeChangeMap[d]) ? true : false;
		},
		/**
		 * 前月を返す
		 * @param {tsext.check9544.EmpMonth} month
		 * @return {tsext.check9544.EmpMonth|null}
		 */
		getPrevMonth: function(month){
			var d = moment(month.getStartDate(), 'YYYY-MM-DD').add(-1, 'd').format('YYYY-MM-DD');
			var months = this.months.getEmpMonths();
			for(var i = 0 ; i < months.length ; i++){
				var m = months[i];
				if(m.getStartDate() <= d && d <= m.getEndDate()){
					return m;
				}
			}
			return null;
		},
		getEmpMonth: function(yearMonth, subNo){
			return this.months.getEmpMonth(yearMonth, subNo);
		},
		getEmpMonthIds: function(){
			return (this.months ? this.months.getEmpMonthIds() : []);
		},
		getEmpMonthById: function(monthId){
			return (this.months ? this.months.getEmpMonthById(monthId) : null);
		},
		getWorkSystem: function(workSystem){
			switch(workSystem){
			case 1: return 'フレックス';
			case 2: return '変形';
			case 3: return '管理監督者';
			default: return '固定';
			}
		},
		// 社員ソート用の比較
		compare: function(other){
			var c1 = this.getEmpCode();
			var c2 = other.getEmpCode();
			if(c1 && c2){
				if(c1 == c2){
					if(this.getName() == other.getName()){
						return (this.getId() < other.getId() ? -1 : 1);
					}
					return (this.getName() < other.getName() ? -1 : 1);
				}
				return (c1 < c2 ? -1 : 1);
			}else if(!c1 && !c2){
				if(this.getName() == other.getName()){
					return (this.getId() < other.getId() ? -1 : 1);
				}
				return (this.getName() < other.getName() ? -1 : 1);
			}else{
				return (c1 ? 1 : -1);
			}
		},
		// CSV出力データ作成
		getErrorLines: function(param){
			this.months.sort();
			var months = this.months.getEmpMonths();
			if(!months.length){
				return '';
			}
			var lines = [];
			var line1 = [];
			line1.push(Util.escapeCsv(this.getEmpCode()));		// 社員コード
			line1.push(Util.escapeCsv(this.getName()));			// 社員名
			for(var i = 0 ; i < months.length ; i++){
				var month = months[i];
				if(!month.isBuildMonthData()){
					continue;
				}
				var monthData = month.getMonthData();
				if(!monthData.ng && !param.notbug){
					continue;
				}
				month.buildDetectionType(); // 検出タイプを得る
				var line2 = lang.clone(line1);
				line2.push(Util.escapeCsv(month.getDeptCode()));				// 部署コード
				line2.push(Util.escapeCsv(month.getDeptName()));				// 部署名
				line2.push(Util.escapeCsv(month.getEmpTypeName()));				// 勤務体系名
				line2.push(Util.escapeCsv(monthData.periodSize));						// 変形期間
				line2.push(Util.escapeCsv(monthData.monthIndex + 1));					// 経過月
				line2.push(Util.escapeCsv(month.getYearMonthS()));				// 月度
				line2.push(Util.escapeCsv(month.getStatus()));					// ステータス
				line2.push(Util.escapeCsv(this.getWorkSystem(monthData.workSystem)));	// 労働時間制
				line2.push(Util.escapeCsv(Util.formatTime(monthData.standardFixTime)));	// 所定労働時間
				line2.push(Util.escapeCsv(month.getStartDate()));				// 月度開始日
				line2.push(Util.escapeCsv(month.getEndDate()));					// 月度終了日
				line2.push(Util.escapeCsv(month.getId()));						// 勤怠月次ID
				line2.push(Util.escapeCsv(month.getLastModifiedDate()));		// 月度最終更新日時
				line2.push(Util.escapeCsv(month.getAdjustOption()));				// 法定調整
				line2.push(Util.escapeCsv(month.getDayTypeChanged()));				// 日タイプ変更
				line2.push(Util.escapeCsv(month.getPatternChanged()));				// 勤務パターン変更
				line2.push(Util.escapeCsv(month.getExchanged()));					// 振替申請
				line2.push(Util.escapeCsv(month.getOver24AtLegalHoliday()));		// 法定休日24時超
				line2.push(Util.escapeCsv(month.getOrgLegalWorkTime(true)));		// 日数×40÷7（元の月の法定労働時間）
				line2.push(Util.escapeCsv(month.getLegalWorkTime(true)));			// 月の法定労働時間
				line2.push(Util.escapeCsv(month.getWorkFixedTime(true)));			// 月の所定労働時間
				line2.push(Util.escapeCsv(month.getWorkWholeTime(true)));			// 総労働時間
				line2.push(Util.escapeCsv(month.getWorkRealTime(true)));			// 実労働時間
				line2.push(Util.escapeCsv(month.getHolidayWorkTime(true)));			// 法定休日労働時間
				line2.push(Util.escapeCsv(month.getWorkLegalOverTime(true)));				// 法定時間内残業
				line2.push(Util.escapeCsv(month.getWorkLegalOutOverTime(true)));			// 法定時間外残業
				line2.push(Util.escapeCsv(month.getWorkChargeTime(true)));					// 法定時間外割増
				line2.push(Util.escapeCsv(Util.formatTime(monthData.dispTime.workLegalOverTime)));		// 本来の法定時間内残業
				line2.push(Util.escapeCsv(Util.formatTime(monthData.dispTime.workLegalOutOverTime)));	// 本来の法定時間外残業
				line2.push(Util.escapeCsv(Util.formatTime(monthData.dispTime.workChargeTime)));			// 本来の法定時間外割増
				line2.push(Util.escapeCsv(month.isTarget() ? '1' : ''));			// 検査対象
				line2.push(Util.escapeCsv(monthData.ng ? 'NG' : ''));			// "NG" or ""
				if(param.normal || !monthData.days.length){
					lines.push(line2.join(','));
				}else{
					line2.push(Util.escapeCsv(month.getAdditionalWorkChargeTime(true)));	// 追加割増労働時間
					for(var j = 0 ; j < monthData.days.length ; j++){
						var dayData = monthData.days[j];
						var line3 = lang.clone(line2);
						line3.push(Util.escapeCsv(dayData.date));			// 日付
						line3.push(Util.escapeCsv(dayData.dayOfWeek));		// 曜日
						line3.push(Util.escapeCsv(dayData.weekNo));			// 週
						line3.push(Util.escapeCsv(dayData.innerMonth));		// =1:月内である  =空:月外
						line3.push(Util.escapeCsv(Util.formatTime(dayData.workFixedTime)));			// 所定労働時間
						line3.push(Util.escapeCsv(Util.formatTime(dayData.workWholeTime)));			// 総労働時間
						line3.push(Util.escapeCsv(Util.formatTime(dayData.workRealTime)));			// 実労働時間
						line3.push(Util.escapeCsv(Util.formatTime(dayData.workLegalOutOverTime)));	// 法定時間外残業
						line3.push(Util.escapeCsv(Util.formatTime(dayData.workHolidayTime)));		// 法定休日労働
						line3.push(Util.escapeCsv(Util.formatTime(Math.max(dayData.workRealTime - dayData.workLegalOutOverTime - dayData.workHolidayTime)))); // 実労働時間－法定時間外残業
						line3.push(Util.escapeCsv(Util.formatTime(dayData.legalTimeOfWeek)));		// 週の法定労働時間
						line3.push(Util.escapeCsv(Util.formatTime(dayData.fixedTimeOfWeek)));		// 週の所定労働時間
						line3.push(Util.escapeCsv(Util.formatTime(dayData.workLegalTimeOfWeek)));	// 週の実労働時間－法定時間外残業
						line3.push(Util.escapeCsv(Util.formatTime(dayData.chargeTimeOfWeek)));		// 週の割増労働時間
						lines.push(line3.join(','));
					}
				}
			}
			return (lines.length ? lines.join('\n') : '');
		}
	});
});
