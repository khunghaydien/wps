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
	// 月次残業申請
	return declare("tsext.testAssist.EntryApplyMonthlyZangyo", EntryBase2, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			this.holiday = null;
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			if(!sd){
				this.addError(Constant.ERROR_EMPTY_DATE); // 日付未入力
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
			return true;
		},
		/**
		 * applyEmpDay に渡す引数
		 * @see tsext.testAssist.EntryBase2.execute
		 */
		getApplyEmpDayRequest: function(){
			var month = Current.getMonth();
			var apply = Current.getCanceldApply(Constant.APPLY_TYPE_MONTHLY_ZANGYO, this.getStartDate());
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			return {
				empId			: Current.getEmpId(),
				month			: month.yearMonth,
				startDate		: month.startDate,
				lastModifiedDate: month.lastModifiedDate,
				date			: this.getStartDate(),
				apply: {
					id					: (apply && apply.id) || null,
					applyType			: Constant.APPLY_TYPE_MONTHLY_ZANGYO,
					estimatedOverTime	: this.getStartTime(),
					note				: this.getNote()
				}
			};
		}
	});
});
