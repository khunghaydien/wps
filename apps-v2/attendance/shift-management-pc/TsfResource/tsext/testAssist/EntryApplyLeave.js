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
	// 休暇申請
	return declare("tsext.testAssist.EntryApplyLeave", EntryBase2, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			this.holiday = null;
			var holidayName = this.getItem(1);
			if(!holidayName){
				this.addError(Constant.ERROR_EMPTY_HOLIDAY); // 休暇名未入力
			}
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			if(!sd){
				this.addError(Constant.ERROR_EMPTY_DATE); // 日付未入力
			}else if(ed && sd > ed){ // 終了日付ありかつ開始日付>終了日付
				this.addError(Constant.ERROR_INVALID, ['終了日付']); // 無効
			}
			if(!this.checkEmpty([5,8,9,10,11,12,13,14,15])){
				this.addError(Constant.ERROR_UNDEFINED);
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
			var holidayName = this.getItem(1);
			var holidays = Current.getHolidaysByName(holidayName); // 休暇名から休暇オブジェクトを得る
			if(!holidays.length){
				this.addError(Constant.ERROR_NOTFOUND); // 該当なし
				return false;
			}else if(holidays.length > 1){
				this.addError(Constant.ERROR_NAME_DUPLICATE); // 該当が複数
				return false;
			}else{
				this.holiday = holidays[0];
				var sd = this.getStartDate();
				var ed = this.getEndDate();
				if(sd < month.startDate || month.endDate < sd){
					this.addError(Constant.ERROR_DATE_OUT_OF_RANGE); // 日付範囲外
					return false;
				}
				if(this.holiday.range == '1'){ // 終日休
					if(ed && moment(ed).diff(moment(sd), 'months') >= 1){
						this.addError(Constant.ERROR_INVALID, ['日付']); // ${0}が無効（1ヶ月以上は不可）
						return false;
					}
					if(!this.holiday.displayDaysOnCalendar // 暦日表示オフ
					&& !Current.isExistWorkDay(sd, ed)){
						this.addError(Constant.ERROR_NOT_WORKDAY); // 非出勤日のため入力不可
						return false;
					}
					if(Current.isDuplicateLeave(sd, ed)){
						this.addError(Constant.ERROR_APPLY_DUPLICATE); // 申請重複
						return false;
					}
				}else { // 終日休以外
					if(ed && sd != ed){
						this.addError(Constant.ERROR_INVALID, ['日付']); // ${0}が無効
						return false;
					}
					if(!Current.isExistWorkDay(sd, ed)){
						this.addError(Constant.ERROR_NOT_WORKDAY); // 非出勤日のため入力不可
						return false;
					}
					if(Current.isDuplicateLeaveTime(sd, this.holiday, this.getStartTime(), this.getEndTime())){
						this.addError(Constant.ERROR_APPLY_DUPLICATE); // 申請重複
						return false;
					}
					if(this.holiday.range == '4'){ // 時間単位休
						var st = this.getStartTime();
						var et = this.getEndTime();
						if(st === null || et === null || st >= et){
							this.addError(Constant.ERROR_EMPTY_OR_INVALID, ['時間']); // 未入力または無効
							return false;
						}
					}
				}
			}
			return true;
		},
		/**
		 * applyEmpDay に渡す引数
		 * @see tsext.testAssist.EntryBase2.execute
		 */
		getApplyEmpDayRequest: function(){
			var month = Current.getMonth();
			var apply = Current.getCanceldApply(Constant.APPLY_TYPE_LEAVE, this.getStartDate());
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			return {
				empId			: Current.getEmpId(),
				month			: month.yearMonth,
				startDate		: month.startDate,
				lastModifiedDate: month.lastModifiedDate,
				date			: this.getStartDate(),
				apply: {
					id			: (apply && apply.id) || null,
					applyType	: Constant.APPLY_TYPE_LEAVE,
					holidayId	: this.holiday.id,
					startDate	: sd,
					endDate		: (ed || sd),
					startTime	: this.getStartTime(),
					endTime		: this.getEndTime(),
					note		: this.getNote(),
					contact		: this.getContact()
				}
			};
		}
	});
});
