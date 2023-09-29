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
	// 打刻
	return declare("tsext.testAssist.LoadEmpMonth", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			this.empMonthLoader = true;
			this.yearMonth = null;
			this.subNo = null;
			try {
				var o = this.getYm(this.getItem(1));
				this.yearMonth = o.yearMonth;
				this.subNo = o.subNo;
			}catch(e){
				this.addError(e.getErrorLevel(), e.getMessage());
			}
		},
		/**
		 * 入力直前のチェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			try{
				this.empId = Current.getIdByName('emps', this.getItem(0));
			}catch(e){
				this.addError(e.getErrorLevel(), e.getMessage()); // 該当なしか同名で重複がある
			}
			return this.inherited(arguments);
		},
		/**
		 * 社員ID
		 * @return {string}
		 */
		getEmpId: function(){
			return this.empId;
		},
		/**
		 * 社員名
		 * @return {string}
		 */
		getEmpName: function(){
			return this.getItem(0);
		},
		/**
		 * 月度
		 * @return {number}
		 */
		getYearMonth: function(){
			return this.yearMonth;
		},
		getSubNo: function(){
			return this.subNo;
		},
		execute: function(bagged){
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			bagged.outputLog(this.getEntryName());
			var req = {
				empId: this.getEmpId(),
				month: this.getYearMonth(),
				subNo: this.getSubNo()
			};
			console.log(req);
			var chain = Current.loadEmpMonth(req).then(
				lang.hitch(this, function(){
					var month = Current.getMonth();
					return bagged.stayResult({
						result: 0,
						name: str.substitute('【勤務表】 ${0} ${1}', [
							Current.getEmpName(),
							(month.yearMonth + (month.subNo ? '(' + (month.subNo + 1) + ')' : ''))
						]),
						href: tsCONST.workTimeView
								+ '?empId=' + Current.getEmpId()
								+ '&month=' + month.yearMonth
								+ '&subNo=' + (month.subNo ? month.subNo : '')
					});
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(this, function(bagged){
				if(bagged.stopped()){
					return;
				}
				Current.loadEmpMonthDelay(lang.hitch(this, function(flag, errmsg){
					if(flag){
						bagged.doneResult();
					}else{
						bagged.doneResult(this.addError(errmsg));
					}
				}));
			}));
		}
	});
});
