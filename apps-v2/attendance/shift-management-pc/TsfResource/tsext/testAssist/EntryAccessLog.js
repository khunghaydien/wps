define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/EntryBase1",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/TsError",
	"tsext/util/Util"
], function(declare, lang, array, str, EntryBase1, Current, Constant, TsError, Util){
	// 入退館ログ
	return declare("tsext.testAssist.EntryAccessLog", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			try {
				this.empName = this.getItem(0);
				this.logDate = this.getDateTime(this.getItem(1));
				this.logKey = this.getItem(2);
				this.logType = this.getInteger(this.getItem(3), false, 1, 9);
				if(this.logType != 1 && this.logType != 2 && this.logType != 9){
					throw new TsError(Constant.ERROR_INVALID_VALUE);
				}
				this.note = this.getItem(4);
				var p = this.getItem(5);
				this.processedFlag = (!p ? true : this.getBoolean(p));
			}catch(e){
				this.addError(e.getErrorLevel(), e.getMessage());
			}
		},
		/**
		 * 社員ID
		 * @return {string}
		 */
		getEmpId: function(){
			this.empId = null;
			try{
				this.empId = Current.getIdByName('emps', this.empName);
			}catch(e){
				this.addError(e.getErrorLevel(), e.getMessage()); // 該当なしか同名で重複がある
			}
			return this.empId;
		},
		/**
		 * ログ日時
		 * @return {string|null}
		 */
		getLogDate : function(){
			return this.logDate;
		},
		getLogKey : function(){
			return this.logKey || null;
		},
		getLogType : function(){
			return '' + this.logType;
		},
		getNote : function(){
			return this.note || null;
		},
		getProcessedFlag : function(){
			return this.processedFlag || false;
		},
		/**
		 * 入退館ログを入力
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			var elements = [this].concat(this.getElements());
			bagged.outputLog(this.getEntryName());
			var logs = [];
			for(var i = 0 ; i < elements.length ; i++){
				var element = elements[i];
				logs.push({
					empId: element.getEmpId(),
					logDate: element.getLogDate(),
					logKey: element.getLogKey(),
					logType: element.getLogType(),
					note: element.getNote(),
					processedFlag: element.getProcessedFlag()
				});
			}
			var chain = Current.request(
				{
					action: 'operateTestAssist',
					operateType: 'inputAccessLog',
					logs: logs
				},
				bagged
			).then(
				lang.hitch(this, function(){
					return bagged.doneResult();
				}),
				lang.hitch(this, function(errmsg){
					return bagged.doneResult(this.addError(errmsg));
				})
			);
		}
	});
});
