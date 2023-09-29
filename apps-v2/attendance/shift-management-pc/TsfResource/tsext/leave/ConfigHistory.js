define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Wait, Util){
	return declare("tsext.leave.ConfigHistory", null, {
		constructor : function(o){
			o.startDate	   = Util.formatDate(o.startDate);
			o.endDate	   = Util.formatDate(o.endDate);
			this.obj = o;
		},
		getStartDate: function(){
			return this.obj.startDate;
		},
		getEndDate: function(){
			return this.obj.endDate;
		},
		setStartDate: function(v){
			this.obj.startDate = v;
		},
		setEndDate: function(v){
			this.obj.endDate = v;
		},
		getEmpType: function(){
			return this.obj.empType;
		},
		getEmpTypeId: function(){
			return (this.obj.empType && this.obj.empType.Id) || '';
		},
		getEmpTypeName: function(){
			return (this.obj.empType && this.obj.empType.Name) || '';
		},
		getConfig: function(){
			return this.obj.config;
		},
		getBaseTimeForStock: function(){
			return (this.obj.config && this.obj.config.BaseTimeForStock__c) || null;
		},
		getBaseTime: function(){
			return (this.obj.config && this.obj.config.BaseTime__c) || null;
		},
		getBaseTimeForStockHMM: function(){
			return (this.getBaseTimeForStock() === null ? '' : Util.formatTime(this.getBaseTimeForStock()));
		},
		getBaseTimeHMM: function(){
			return (this.getBaseTime() === null ? '' : Util.formatTime(this.getBaseTime()));
		},
		toString: function(){
			return this.getStartDate() + '～' + this.getEndDate()
				+ ', empType=' + this.getEmpType().Name
				+ ', baseTime=' + this.getConfig().BaseTime__c;
		}
	});
});
