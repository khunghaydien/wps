define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤務体系別パターン
	return declare("tsext.testAssist.ExportEmpTypePattern", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 */
		constructor: function(manager, obj){
		},
		getEmpTypeId: function(){
			return this.obj.EmpTypeId__c;
		},
		getPatternId: function(){
			return this.obj.PatternId__c;
		},
		getOrder: function(){
			return this.obj.Order__c;
		},
		getSchedule: function(){
			var item = '';
			var wjp = ['日','月','火','水','木','金','土'];
			if(this.obj.SchedOption__c == '1'
			&& this.obj.SchedWeekly__c && /^[0-6]+$/.test(this.obj.SchedWeekly__c)){
				item = '毎週';
				var weekly = this.obj.SchedWeekly__c || '';
				for(var x = 0 ; x < weekly.length ; x++){
					var c = weekly.substring(x, x + 1);
					if(c >= '0' && c <= '6'){
						item += wjp[c];
					}
				}
			}else if(this.obj.SchedOption__c == '2'
			&& typeof(this.obj.SchedMonthlyDate__c) == 'number'
			&& this.obj.SchedMonthlyDate__c >= 1 && this.obj.SchedMonthlyDate__c <= 31){
				item = '毎月' + this.obj.SchedMonthlyDate__c + '日';
			}else if(this.obj.SchedOption__c == '3'
			&& this.obj.SchedMonthlyLine__c && /^[1-5]$/.test(this.obj.SchedMonthlyLine__c)
			&& this.obj.SchedMonthlyWeek__c && /^[0-6]$/.test(this.obj.SchedMonthlyWeek__c)){
				item = '毎月第' + this.obj.SchedMonthlyLine__c + wjp[this.obj.SchedMonthlyWeek__c] + '曜日';
			}
			return item;
		}
	});
});
