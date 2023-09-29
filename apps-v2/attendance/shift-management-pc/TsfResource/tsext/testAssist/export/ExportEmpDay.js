define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤怠日次
	return declare("tsext.testAssist.ExportEmpDay", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 */
		constructor: function(manager, obj){
			this.obj.Date__c = Util.formatDate(this.obj.Date__c);
		},
		getEmpMonthId: function(){
			return this.obj.EmpMonthId__c;
		},
		getDate: function(){
			return this.obj.Date__c;
		},
		getPatternId: function(){
			return this.obj.PatternId__c;
		},
		getHolidayIds: function(){
			return [this.obj.HolidayId1__c, this.obj.HolidayId2__c, this.obj.TimeHolidayId1__c, this.obj.TimeHolidayId2__c, this.obj.TimeHolidayId3__c];
		},
		getStartTime: function(){
			return this.obj.StartTime__c;
		},
		getEndTime: function(){
			return this.obj.EndTime__c;
		},
		getTimeTable: function(){
			return this.obj.TimeTable__c;
		},
		/**
		 * 打刻をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {tsext.testAssist.ExportEmp} emp
		 * @param {{virMonth:{tsext.testAssist.ExportVirMonth},loaded:{boolean}}} curLoad 
		 * @returns {Array.<string>}
		 */
		 outputExportEmpDay: function(lst, visit, emp, curLoad){
			var st = Util.isNum(this.obj.StartTime__c) ? Util.formatTime(this.obj.StartTime__c) : '';
			var et = Util.isNum(this.obj.EndTime__c)   ? Util.formatTime(this.obj.EndTime__c)   : '';
			if(st || et){
				emp.outputExportLoadMonth(lst, visit, curLoad, this.getDate());
				this.L(lst, [
					Constant.KEY_ENTRY, // 入力
					Constant.KEY_SHEET, // 勤務表
					'',
					Constant.ITEM1_INOUT, // 打刻
					'',
					this.getDate(), // 日付1
					'',
					st + '-' + et, // 出退社時刻
					Util.convertTimeTable(this.obj.TimeTable__c || '', [21,22]), // 休憩
					'', // 日次備考
					Util.convertTimeTable(this.obj.TimeTable__c || '', [30]) // 公用外出
				]);
			}
			return lst;
		}
	});
});
