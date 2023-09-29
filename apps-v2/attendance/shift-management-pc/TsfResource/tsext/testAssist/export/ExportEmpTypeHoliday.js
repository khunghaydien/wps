define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤務体系別休暇
	return declare("tsext.testAssist.ExportEmpTypeHoliday", ExportObj, {
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
		getHolidayId: function(){
			return this.obj.HolidayId__c;
		},
		getOrder: function(){
			return this.obj.Order__c;
		}
	});
});
