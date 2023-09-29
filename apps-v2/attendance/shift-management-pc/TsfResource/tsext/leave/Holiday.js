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
	return declare("tsext.leave.Holiday", null, {
		constructor : function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			this.config = (o.Config__c ? Util.fromJson(o.Config__c) : null);
			this.obj = o;
		},
		getId: function(){
			return this.obj.Id;
		},
		getName: function(){
			return this.obj.Name;
		},
		getCreated: function(){
			return this.obj.CreatedDate;
		},
		getLastModifiedDate: function(){
			return this.obj.LastModifiedDate;
		},
		getJson: function(){
			return Util.toJson(this.obj, true);
		},
		getType: function(){
			switch(this.obj.Type__c){
			case '1': return '有給';
			case '2': return '無給';
			case '3': return '代休';
			default:  return '';
			}
		},
		getRange: function(){
			switch(this.obj.Range__c){
			case '1': return '終日休';
			case '2': return '午前半休';
			case '3': return '午後半休';
			case '4': return '時間単位休';
			default:  return '';
			}
		},
		isYuqSpend: function(){
			return this.obj.YuqSpend__c;
		},
		isWorking: function(){
			return this.obj.IsWorking__c;
		},
		isDisplayDaysOnCalendar: function(){
			return this.obj.DisplayDaysOnCalendar__c;
		},
		isProhibitOverNightWork: function(){
			return (this.config && this.config.prohibitOverNightWork) || false;
		},
		isOriginal: function(){
			return (!this.obj.OriginalId__c);
		},
		isManaged: function(){
			return this.obj.Managed__c;
		},
		getManageName: function(){
			return this.obj.ManageName__c || '';
		},
		getSummaryName: function(){
			return this.obj.SummaryName__c || '';
		},
		getOrder: function(){
			return Util.dispNum(this.obj.Order__c, '');
		},
		getOriginalOrder: function(){
			return Util.dispNum(this.obj.OriginalId__r && this.obj.OriginalId__r.Order__c, '');
		}
	});
});
