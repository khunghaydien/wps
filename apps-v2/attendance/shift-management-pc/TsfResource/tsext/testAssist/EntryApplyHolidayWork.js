define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/EntryBase2",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, EntryBase2, Current, Constant, Util){
	// 休日出勤申請
	return declare("tsext.testAssist.EntryApplyHolidayWork", EntryBase2, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			var st = this.getStartTime();
			var et = this.getEndTime();
			if(!sd){
				this.addError(Constant.ERROR_EMPTY_DATE); // 日付未入力
			}
			if(ed && sd != ed){
				this.addError(Constant.ERROR_INVALID, ['終了日付']); // 無効
			}
			if(st === null || et === null || st >= et){
				this.addError(Constant.ERROR_EMPTY_OR_INVALID, ['時間']); // 未入力または無効
			}
		},
		/**
		 * 申請直前のチェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			var month = Current.getMonth();
			if(month.fixed){
				this.addError(Constant.ERROR_FIXED_MONTH);
				return false;
			}
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			if(!Current.isHoliday(sd)){
				this.addError(Constant.ERROR_NOT_HOLIDAY); // 休日でない
				return false;
			}
			if(Current.isUseDaiqManage() && Current.isUseDaiqReserve()){ // 代休管理を行う＆申請時に代休有無を指定する
				try{
					var item8 = this.getItem(7);
					if(!item8){
						this.daiqReserve = true;
					}else{
						this.daiqReserve = this.getBoolean(item8); // 代休取得予定
					}
				}catch(e){
					this.addError(e.getErrorLevel(), e.getMessage());
				}
				try{ this.daiqDate1      = this.getDate(this.getItem(8), true);    }catch(e){ this.addError(e.getErrorLevel(), e.getMessage()); } // 代休取得予定日1
				try{ this.daiqDate1Range = this.getDaiqRange(this.getItem(9));     }catch(e){ this.addError(e.getErrorLevel(), e.getMessage()); } // 代休タイプ1
				try{ this.daiqDate2      = this.getDate(this.getItem(10), true);   }catch(e){ this.addError(e.getErrorLevel(), e.getMessage()); } // 代休取得予定日2
				try{ this.daiqDate2Range = this.getDaiqRange(this.getItem(11));    }catch(e){ this.addError(e.getErrorLevel(), e.getMessage()); } // 代休タイプ2
			}else{
				this.daiqReserve = true;
			}
			if(Current.isUseDirectApply()){ // 直行直帰申請を使用する
				try{
					this.directFlag = this.getDirectFlag(this.getItem(12));
				}catch(e){
					this.addError(e.getErrorLevel(), e.getMessage());
				}
				this.workType = this.getItem(13); // 作業区分
				try{
					this.travelTime = this.getTime(this.getItem(14), true); // 前泊移動時間
				}catch(e){
					this.addError(e.getErrorLevel(), e.getMessage());
				}
			}
			var item6 = this.getItem(5);
			if(item6){
				try{
					this.timeTable = this.getRestTimes(item6, 1); // 休憩時間
				}catch(e){
					this.addError(e.getErrorLevel(), e.getMessage());
				}
			}
			return true;
		},
		getDaiqRange: function(v){
			if(v == '終日休'){
				return '1';
			}else if(v == '午前半休'){
				return '2';
			}else if(v == '午後半休'){
				return '3';
			}
			return null;
		},
		getDirectFlag: function(v){
			if(v == '直行'){
				return 1;
			}else if(v == '直帰'){
				return 2;
			}else if(v == '直行直帰'){
				return 3;
			}
			return 0;
		},
		/**
		 * applyEmpDay に渡す引数
		 * @see tsext.testAssist.EntryBase2.execute
		 */
		getApplyEmpDayRequest: function(){
			var month = Current.getMonth();
			var apply = Current.getCanceldApply(Constant.APPLY_TYPE_HOLIDAY_WORK, this.getStartDate());
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			return {
				empId 				: Current.getEmpId(),
				month 				: month.yearMonth,
				startDate 			: month.startDate,
				lastModifiedDate	: month.lastModifiedDate,
				date				: this.getStartDate(),
				apply: {
					id				: (apply && apply.id) || null,
					applyType		: Constant.APPLY_TYPE_HOLIDAY_WORK,
					startDate		: sd,
					endDate			: sd,
					startTime		: this.getStartTime(),
					endTime			: this.getEndTime(),
					note			: this.getNote(),
					daiqReserve		: this.daiqReserve,
					daiqProvide		: 1,
					daiqDate1		: this.daiqDate1 || null,
					daiqDate1Range	: this.daiqDate1Range || null,
					daiqDate2		: this.daiqDate2 || null,
					daiqDate2Range	: this.daiqDate2Range || null,
					useRegulateHoliday: Current.isUseRegulateHoliday(),
					afterFlag		: false,
					directFlag		: this.directFlag || 0,
					workType		: this.workType || null,
					travelTime		: Util.dispNum(this.travelTime, null),
					timeTable		: this.timeTable || null
				}
			};
		}
	});
});
