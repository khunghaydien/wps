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
	// 勤務時間変更申請（長期時間変更申請）
	return declare("tsext.testAssist.EntryApplyPattern", EntryBase2, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			this.pattern = null;
			var item2 = this.getItem(1); // 勤務パターン
			var item8 = this.getItem(7); // 勤務日の設定
			if(!item2 && !item8){
				this.addError(Constant.ERROR_EMPTY_REQUIRED);
			}
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			if(!sd){
				this.addError(Constant.ERROR_EMPTY_DATE); // 日付未入力
			}
			try{
				this.dayType = this.getDayType(item8);
			}catch(e){
				this.addError(e.getErrorLevel(), e.getMessage());
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
			var item2 = this.getItem(1);
			if(item2){
				var patterns = Current.getPatternsByName(item2); // 休暇名から休暇オブジェクトを得る
				if(!patterns.length){
					this.addError(Constant.ERROR_NOTFOUND); // 該当なし
				}else if(patterns.length > 1){
					this.addError(Constant.ERROR_NAME_DUPLICATE); // 該当が複数
				}else{
					this.pattern = patterns[0];
				}
			}
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			if(this.pattern){
				if(Current.isDuplicatePattern(sd, ed, this.pattern)){
					this.addError(Constant.ERROR_APPLY_DUPLICATE); // 申請重複
					return false;
				}
				if(!Current.isUseChangeShift()){
					if((this.st && this.st != this.pattern.stdStartTime)
					|| (this.et && this.et != this.pattern.stdEndTime)){
						this.addError(Constant.ERROR_INVALID, ['時間']); // 無効
					}
					this.st = this.pattern.stdStartTime;
					this.et = this.pattern.stdEndTime;
				}else{
					if(this.st === null){
						this.st = this.pattern.stdStartTime;
					}
					if(this.et === null){
						this.et = this.pattern.stdEndTime;
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
			var apply = Current.getCanceldApply([Constant.APPLY_TYPE_PATTERNS, Constant.APPLY_TYPE_PATTERNL], this.getStartDate());
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
					applyType	: ((!this.pattern || this.pattern.range == '1') ? Constant.APPLY_TYPE_PATTERNS : Constant.APPLY_TYPE_PATTERNL),
					patternId	: (this.pattern ? this.pattern.id : null),
					dayType		: this.dayType,
					startDate	: sd,
					endDate		: (ed || sd),
					startTime	: this.getStartTime(),
					endTime		: this.getEndTime(),
					note		: this.getNote()
				}
			};
		}
	});
});
