define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.absorber.EmpStockDetail", null, {
		constructor : function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			this.obj = o;
		},
		getId     : function(){ return this.obj.Id; },
		getName   : function(){ return this.obj.Name; },
		getEmpId  : function(){ return (this.obj.ConsumesStockId__r && this.obj.ConsumesStockId__r.EmpId__c) || null; },
		getType   : function(){ return (this.obj.ConsumesStockId__r && this.obj.ConsumesStockId__r.Type__c) || null; },
		getDays   : function(){ return this.obj.Days__c || 0; },
		isLostFlag: function(){ return (this.obj.ConsumedByStockId__r && this.obj.ConsumedByStockId__r.LostFlag__c) || false; },
		getConsumesStockId  : function(){ return this.obj.ConsumesStockId__c; },
		getConsumedByStockId: function(){ return this.obj.ConsumedByStockId__c; }
	});
});
