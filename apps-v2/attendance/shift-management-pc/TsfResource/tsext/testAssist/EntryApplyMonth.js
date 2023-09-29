define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/EntryBase1",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, EntryBase1, Current, Constant, Util){
	// 月次確定
	return declare("tsext.testAssist.EntryApplyMonth", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			this.note   = this.getRawDataByIndex(args, Constant.INDEX_NOTE);
		},
		isCancel: function(){
			return (this.getItem(1) == Constant.ITEM2_CANCEL);
		},
		/**
		 * 備考
		 * @return {string|null}
		 */
		getNote: function(){
			return this.note;
		},
		/**
		 * applyEmpMonth に渡す引数
		 * @see execute
		 */
		getApplyEmpMonthRequest: function(){
			var month = Current.getMonth();
			return {
				empId					: Current.getEmpId(),
				month					: month.yearMonth,
				startDate				: month.startDate,
				lastModifiedDate		: month.lastModifiedDate,
				note					: this.getNote(),
				attributeAtConfirm		: Current.getPeriodInfo(true),
				legalWorkTimeOfPeriod	: Current.getLegalWorkTimeOfPeriod()
			};
		},
		/**
		 * cancelApplyEmpMonth に渡す引数
		 */
		getCancelApplyEmpMonthRequest: function(){
			var month = Current.getMonth();
			return {
				empId					: Current.getEmpId(),
				month					: month.yearMonth,
				startDate				: month.startDate,
				lastModifiedDate		: month.lastModifiedDate
			};
		},
		/**
		 * 月次確定
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			var reqType = (this.isCancel() ? -1 : 1);
			var req = (this.isCancel()
					? this.getCancelApplyEmpMonthRequest()
					: this.getApplyEmpMonthRequest());
			var chain = Current.applyEmpMonth(
				bagged,
				reqType,
				req
			).then(
				lang.hitch(this, function(){
					return bagged.stayResult();
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(this, function(bagged){
				if(bagged.stopped()){
					return;
				}
				var month = Current.getMonth();
				Current.changeMonth(bagged, month).then(
					lang.hitch(this, function(){
						bagged.doneResult();
					}),
					lang.hitch(this, function(errmsg){
						bagged.doneResult(this.addError(errmsg));
					})
				);
			}));
		}
	});
});
