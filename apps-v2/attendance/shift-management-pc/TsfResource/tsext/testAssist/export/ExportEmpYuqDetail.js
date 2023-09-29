define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤怠有休詳細
	return declare("tsext.testAssist.ExportEmpYuqDetail", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 */
		constructor: function(manager, obj){
		},
		getEmpYuqId: function(){
			return this.obj.EmpYuqId__c;
		},
		getGroupId: function(){
			return this.obj.GroupId__c;
		},
		getTime: function(){
			return this.obj.Time__c;
		}
	});
});
