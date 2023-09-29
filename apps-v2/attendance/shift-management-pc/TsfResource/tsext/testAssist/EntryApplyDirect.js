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
	// 直行・直帰申請
	return declare("tsext.testAssist.EntryApplyDirect", EntryBase2, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			this.pattern = null;
			var direct = this.getItem(1); // 直行直帰
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			if(!sd){
				this.addError(Constant.ERROR_EMPTY_DATE); // 日付未入力
			}
			this.directFlag = 0;
			if(direct == '直行'){
				this.directFlag = 1;
			}else if(direct == '直帰'){
				this.directFlag = 2;
			}else if(direct == '直行直帰'){
				this.directFlag = 3;
			}
			if(!this.directFlag){
				this.addError(Constant.ERROR_UNDEFINED); // 未定義
			}
			this.workType = this.getItem(7);       // 作業区分
			this.travelTime = this.getStartTime(); // 前泊移動時間
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
			var apply = Current.getCanceldApply(Constant.APPLY_TYPE_DIRECT, this.getStartDate());
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
					applyType	: Constant.APPLY_TYPE_DIRECT,
					directFlag	: this.directFlag,
					startDate	: sd,
					endDate		: (ed || sd),
					note		: this.getNote(),
					workType	: this.workType,
					travelTime	: this.travelTime
				}
			};
		}
	});
});
