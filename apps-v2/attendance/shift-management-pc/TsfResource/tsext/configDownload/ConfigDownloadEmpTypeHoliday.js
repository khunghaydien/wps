define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/util/Util"
], function(declare, lang, json, array, Util) {
	return declare("tsext.configDownload.ConfigDownloadEmpTypeHoliday", null, {
		constructor: function(record){
			this.eth = record;
		},
		getEmpTypeId:   function(){ return this.eth.EmpTypeId__c; },
		getEmpTypeCode: function(){ return (this.eth.EmpTypeId__r && this.eth.EmpTypeId__r.EmpTypeCode__c) || null; },
		getEmpTypeName: function(){ return this.eth.EmpTypeId__r.Name; },
		getHolidayId:   function(){ return this.eth.HolidayId__c; },
		getHolidayName: function(){ return this.eth.HolidayId__r.Name; },
		getOrder:       function(){ return this.eth.Order__c || 0; }
	});
});
