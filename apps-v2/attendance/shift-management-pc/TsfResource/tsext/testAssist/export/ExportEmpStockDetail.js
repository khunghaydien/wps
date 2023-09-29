define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤怠積休詳細
	return declare("tsext.testAssist.ExportEmpStockDetail", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 */
		constructor: function(manager, obj){
		},
		getConsumesStockId: function(){
			return this.obj.ConsumesStockId__c;
		},
		getConsumedByStockId: function(){
			return this.obj.ConsumedByStockId__c;
		}
	});
});
