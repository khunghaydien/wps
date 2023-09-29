define([
	"dojo/_base/declare",
	"dojo/_base/json",
	"dojo/_base/lang",
	"dojo/Deferred",
	"tsext/dialog/Wait",
	"tsext/util/Util"
], function(declare, json, lang, Deferred, Wait, Util){
	return new (declare("tsext.service.Request", null, {
		actionA : function(method, req, noUIblock){
			Util.consoleLog('---------------------');
			Util.consoleLog(method + ' - ' + json.toJson(req));
			var deferred = new Deferred();
			if(!noUIblock){
//				Util.loadingShow();
				Wait.show(true);
			}
			Visualforce.remoting.Manager.invokeAction(method, json.toJson(req),
				function(result, event){
					if(!noUIblock){
						Util.loadingHide();
						Wait.show(false);
					}
					if(event.status && result.result != 'NG'){
						Util.consoleLog(result);
						if(!req.keepNameSpace){
							Util.excludeNameSpace(result);
						}
						deferred.resolve(result);
					}else{
						Util.consoleLog(event);
						deferred.reject(Util.getErrorMessage(event.status ? result : event));
					}
				},
				{ escape : false }
			);
			return deferred.promise;
		},
		actionLoop : function(method, reqs, index, onSuccess, onFailure, onProgress){
			if(reqs.length <= index){
				onSuccess();
				return;
			}
			this.actionA(method, reqs[index], true).then(
				lang.hitch(this, function(result){
					onProgress(index, result);
					this.actionLoop(method, reqs, index + 1, onSuccess, onFailure, onProgress);
				}),
				lang.hitch(this, function(errmsg){
					onFailure(errmsg);
				})
			);
		},
		actionB : function(method, reqs, noUIblock){
			var deferred = new Deferred();
			if(!noUIblock){
				Wait.show(true);
			}
			this.actionLoop(
				method,
				reqs,
				0,
				function(){
					if(!noUIblock){
						Wait.show(false);
					}
					deferred.resolve();
				},
				function(errmsg){
					if(!noUIblock){
						Wait.show(false);
					}
					deferred.reject(errmsg);
				},
				function(index, result){
					deferred.progress({ index:index, records:result.records});
				}
			);
			return deferred.promise;
		},
		fetchLoop : function(soql, param, onSuccess, onFailure){
			var _soql;
			if(param.nextId){
				if(soql.indexOf(' where ') > 0){
					_soql = soql + " and ";
				}else{
					_soql = soql + " where ";
				}
				_soql += "Id > '" + param.nextId + "' order by Id";
			}else{
				_soql = soql + " order by Id";
			}
			var req = {
				soql   : _soql,
				limit  : param.limit,
				offset : 0,
				allRows: param.allRows,
				keepNameSpace: param.keepNameSpace
			};
			this.actionA(tsCONST.API_SEARCH_DATA, req, true).then(
				lang.hitch(this, function(result){
					var record = (result.records.length > 0 ? result.records[result.records.length - 1] : null);
					param.records = param.records.concat(result.records);
					if(record && result.records.length >= param.limit){
						param.nextId = record.Id;
						this.fetchLoop(soql, param, onSuccess, onFailure);
					}else{
						onSuccess();
					}
				}),
				lang.hitch(this, function(errmsg){
					onFailure(errmsg);
				})
			);
		},
		fetch : function(soql, noUIblock, keepNameSpace){
			var deferred = new Deferred();
			if(!noUIblock){
				Wait.show(true);
			}
			var param = {
				nextId: null,
				allRows: false,
				limit: 100,
				records: [],
				keepNameSpace: keepNameSpace || false
			};
			this.fetchLoop(
				soql,
				param,
				function(){
					if(!noUIblock){ Wait.show(false); }
					deferred.resolve(param.records);
				},
				function(errmsg){
					if(!noUIblock){ Wait.show(false); }
					deferred.reject(errmsg);
				},
				function(index, result){
					deferred.progress({ index:index, records:result.records});
				}
			);
			return deferred.promise;
		}
	}))();
});
