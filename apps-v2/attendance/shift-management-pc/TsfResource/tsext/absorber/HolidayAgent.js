define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/absorber/Holiday",
	"tsext/absorber/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Holiday, Constant, Util){
	return new (declare("tsext.absorber.HolidayAgent", null, {
		constructor : function(){
			this.holidays = [];
		},
		fetchHolidays: function(){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",LastModifiedDate"
				+ ",Config__c"
				+ ",Description__c"
				+ ",DisplayDaysOnCalendar__c"
				+ ",IsSummaryRoot__c"
				+ ",IsWorking__c"
				+ ",LinkNumber__c"
				+ ",ManageName__c"
				+ ",Managed__c"
				+ ",Order__c"
				+ ",OriginalId__c"
				+ ",PlannedHoliday__c"
				+ ",Range__c"
				+ ",Removed__c"
				+ ",SummaryCode__c"
				+ ",SummaryName__c"
				+ ",Symbol__c"
				+ ",Type__c"
				+ ",YuqSpend__c"
				+ " from AtkHoliday__c"
				+ " where Removed__c = false"
				;
			Request.actionB(
				tsCONST.API_SEARCH_DATA,
				[{ soql:soql, limit:50000, offset:0 }],
				true
			).then(
				deferred.resolve,
				deferred.reject,
				lang.hitch(this, function(result){
					for(var i = 0 ; i < result.records.length ; i++){
						this.holidays.push(new Holiday(result.records[i]));
					}
				})
			);
			return deferred.promise;
		},
		getHolidayByName: function(name){
			for(var i = 0 ; i < this.holidays.length ; i++){
				var holiday = this.holidays[i];
				if(holiday.getName() == name){
					return holiday;
				}
			}
			for(i = 0 ; i < this.holidays.length ; i++){
				var holiday = this.holidays[i];
				if(holiday.isManaged() && holiday.getManageName() == name){
					return holiday;
				}
			}
			return null;
		},
		getHolidayKeyByName: function(name){
			var holiday = this.getHolidayByName(name);
			if(!holiday){
				return null;
			}
			if(holiday.isYuqSpend()){
				return Constant.YUQ_KEY;
			}
			if(holiday.isManaged()){
				return holiday.getManageName();
			}
			return holiday.getName();
		}
	}))();
});
