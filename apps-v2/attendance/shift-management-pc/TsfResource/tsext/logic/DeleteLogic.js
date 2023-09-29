define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/tsobj/Helper",
	"tsext/logic/DataLoader",
	"tsext/service/Request",
	"tsext/service/Agent",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Helper, DataLoader, Request, Agent, Util){
	return declare("tsext.logic.DeleteLogic", null, {
		constructor : function(){
			this.dataLoader = new DataLoader();
		},
		empSearch: function(callback){
			var deferred = new Deferred();
			var soql = 'select Id, Name, EmpCode__c, EmpTypeId__c, EmpTypeId__r.Name from AtkEmp__c';
			soql += ' order by Name';
			var req = {
				soql: soql,
				limit: 5000,
				offset: 0
			};
			Request.actionA(tsCONST.API_SEARCH_DATA, req, true).then(deferred.resolve, deferred.reject);
			return deferred.promise;
		},
		loadPrefixNames: function(index, nameMap, outLog, callback){
			if(index >= Helper.getTargetCheckName().length){
				callback(true);
				return;
			}
			if(!index){
				outLog(Helper.getTargetCheckName().join(','));
			}
			var name = Helper.getTargetCheckName()[index];
			var req = {
				soql: str.substitute("select Id, Name from ${0} where Name like '\\_%'", [name]),
				limit: 50000,
				offset: 0
			};
			Request.actionA(tsCONST.API_SEARCH_DATA, req, true).then(
				lang.hitch(this, function(result){
					var mp = {};
					for(var i = 0 ; i < result.records.length ; i++){
						var m = /\_...\_/.exec(result.records[i].Name);
						if(m){
							mp[m[0]] = 1;
						}
					}
					console.log(name);
					console.log(mp);
					lang.mixin(nameMap, mp);
					this.loadPrefixNames(index + 1, nameMap, outLog, callback);
				}),
				lang.hitch(this, function(errmsg){
					callback(false, errmsg);
				})
			);
		},
		dataDelete: function(prefix, outLog, callback){
			var deleteTargets = array.map(Helper.getDeleteTargets(), function(target){
				return tsCONST.prefixBar + target;
			});
			var req = {
				action: "deleteSObject",
				keys: deleteTargets,
				prefix: prefix
			};
			outLog('削除開始');
			outLog('プレフィックス = ' + prefix);
			outLog(deleteTargets.join(','));
			Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(result){
					outLog('削除終了');
					callback(true);
				}),
				lang.hitch(this, function(errmsg){
					outLog('delete failed');
					outLog(errmsg);
					callback(false, errmsg);
				})
			);
		}
	});
});
