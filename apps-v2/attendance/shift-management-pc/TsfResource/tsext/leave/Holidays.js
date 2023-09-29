define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/leave/Holiday",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Wait, Holiday, Util){
	return declare("tsext.leave.Holiday", null, {
		constructor : function(){
			this.holidays = [];
		},
		getAll: function(){
			return this.holidays;
		},
		sort: function(){
			this.holidays = this.holidays.sort(function(a, b){
				if(a.isOriginal() && !b.isOriginal()){
					return -1;
				}else if(!a.isOriginal() && b.isOriginal()){
					return 1;
				}else if(!a.isOriginal() && !b.isOriginal()){
					var an = (a.getOriginalOrder() || 0);
					var bn = (b.getOriginalOrder() || 0);
					return an - bn;
				}
				var an = (a.getOrder() || 0);
				var bn = (b.getOrder() || 0);
				if(an == bn){
					return (a.getCreated() < b.getCreated() ? -1 : 1);
				}
				return an - bn;
			});
		},
		// 休暇リストを取得
		fetchHolidays: function(){
			this.holidays = [];
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",CreatedById"
				+ ",CreatedBy.Name"
				+ ",LastModifiedDate"
				+ ",LastModifiedById"
				+ ",LastModifiedBy.Name"
				+ ",Type__c"
				+ ",Range__c"
				+ ",YuqSpend__c"
				+ ",IsWorking__c"
				+ ",DisplayDaysOnCalendar__c"
				+ ",Config__c"
				+ ",Managed__c"
				+ ",ManageName__c"
				+ ",SummaryName__c"
				+ ",SummaryCode__c"
				+ ",IsSummaryRoot__c"
				+ ",LinkNumber__c"
				+ ",OriginalId__c"
				+ ",OriginalId__r.Order__c"
				+ ",Removed__c"
				+ ",Symbol__c"
				+ ",Order__c"
				+ ",Description__c"
				+ " from AtkHoliday__c"
				;
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					array.forEach(records, function(record){
						this.holidays.push(new Holiday(record));
					}, this);
					this.sort();
					deferred.resolve();
				}),
				deferred.reject
			);
			return deferred.promise;
		}
	});
});
