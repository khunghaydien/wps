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
	// 早退申請
	return declare("tsext.testAssist.EntryApplyEarlyEnd", EntryBase2, {
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
			if(ed && sd != ed){
				this.addError(Constant.ERROR_INVALID, ['終了日付']); // 無効
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
			var t = this.getStartTime();
			this.border = Current.getBdrStartEndTime(this.getStartDate());
			if(this.border.bdrEndTime <= t){
				console.log('就業時刻=' + Util.formatTime(this.border.bdrEndTime));
				console.log('早退時刻=' + Util.formatTime(t));
				this.addError(Constant.ERROR_INVALID_EARLY_TIME); // 早退時刻が無効
				return false;
			}
			return true;
		},
		isOwnReason: function(){
			return false;
		},
		getTreatEarlyEnd: function(){
			return '0';
		},
		/**
		 * applyEmpDay に渡す引数
		 * @see tsext.testAssist.EntryBase2.execute
		 */
		getApplyEmpDayRequest: function(){
			var month = Current.getMonth();
			var apply = Current.getCanceldApply(Constant.APPLY_TYPE_EARLYEND, this.getStartDate());
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			var t = this.getStartTime();
			return {
				empId			: Current.getEmpId(),
				month			: month.yearMonth,
				startDate		: month.startDate,
				lastModifiedDate: month.lastModifiedDate,
				date			: this.getStartDate(),
				apply: {
					id			: (apply && apply.id) || null,
					applyType	: Constant.APPLY_TYPE_EARLYEND,
					startDate	: sd,
					endDate		: sd,
					startTime	: t,
					endTime		: this.border.bdrEndTime,
					note		: this.getNote(),
					ownReason	: this.isOwnReason(),
					treatDeduct	: this.getTreatEarlyEnd()
				}
			};
		}
	});
});
