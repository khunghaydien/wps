define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.absorber.Holiday", null, {
		constructor : function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			this.obj = o;
		},
		getName: function(){
			return this.obj.Name;
		},
		isManaged: function(){
			return this.obj.Managed__c || false;
		},
		getManageName: function(){
			return this.obj.ManageName__c || null;
		},
		isYuqSpend: function(){
			return this.obj.YuqSpend__c || false;
		},
		getType: function(){
			return this.obj.Type__c;
		},
		getRange: function(){
			return this.obj.Range__c;
		}
	});
});
