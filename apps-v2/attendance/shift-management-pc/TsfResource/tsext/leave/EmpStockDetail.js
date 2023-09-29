define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.leave.EmpStockDetail", null, {
		constructor : function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			this.obj = o;
		},
		getId       : function(){ return this.obj.Id; },
		getName     : function(){ return this.obj.Name; },
		getEmpId    : function(){ return (this.obj.ConsumesStockId__r && this.obj.ConsumesStockId__r.EmpId__c) || null; },
		getDays     : function(){ return (new Decimal(this.obj.Days__c || 0)).toDecimalPlaces(5).toNumber(); },
		getHours    : function(){ return (new Decimal(this.obj.Hours__c || 0)).toDecimalPlaces(5).toNumber(); },
		isLostFlag  : function(){ return (this.obj.ConsumedByStockId__r && this.obj.ConsumedByStockId__r.LostFlag__c) || false; },
		getConsumesStockId   : function(){ return this.obj.ConsumesStockId__c; },
		getConsumedByStockId : function(){ return this.obj.ConsumedByStockId__c; },
		getDayHours : function(flag){
			var n = new Decimal(this.getDays() + this.getHours());
			return (flag ? n.abs().toDecimalPlaces(5).toNumber() : n.toNumber());
		}
	});
});
