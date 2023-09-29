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
	return declare("tsext.leave.ManageNames", null, {
		constructor : function(){
			this.manageNames = [];
		},
		getManageNames: function(){
			return this.manageNames;
		},
		// 日数管理休暇名を取得
		fetch: function(){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",ManageName__c"
				+ " from AtkHoliday__c"
				+ " where Managed__c = true"
				;
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					var map = {};
					array.forEach(records || [], function(record){
						if(record.ManageName__c){
							map[record.ManageName__c] = 1;
						}
					}, this);
					for(var key in map){
						this.manageNames.push(key);
					}
					deferred.resolve();
				}),
				deferred.reject
			);
			return deferred.promise;
		}
	});
});
