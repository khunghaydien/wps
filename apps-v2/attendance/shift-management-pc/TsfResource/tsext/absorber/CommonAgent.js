define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/absorber/Constant",
	"tsext/absorber/LogAgent",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Constant, LogAgent, Util){
	return new (declare("tsext.absorber.CommonAgent", null, {
		constructor : function(){
			this.common = null;
			this.empMonthDefs = null;
			this.holidayFieldMap = {};
			this.minusSubject = Constant.MINUS_SUBJECT;
			this.applyComment = Constant.APPLY_COMMENT;
			this.noLock = false;
		},
		fetchCommon: function(){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",LastModifiedDate"
				+ ",Config__c"
				+ " from AtkCommon__c"
				;
			Request.actionB(
				tsCONST.API_SEARCH_DATA,
				[{ soql:soql, limit:50000, offset:0 }],
				true
			).then(
				deferred.resolve,
				deferred.reject,
				lang.hitch(this, function(result){
					this.common = result.records[0];
					if(this.common.Config__c){
						var c = Util.fromJson(this.common.Config__c);
						this.common.Config__c = c;
						this.holidayFieldMap = (c.absorber && c.absorber.empMonth) || {};
						if(c.absorber){
							if(c.absorber.minusSubject !== undefined){
								this.minusSubject = c.absorber.minusSubject;
							}
							if(c.absorber.applyComment !== undefined){
								this.applyComment = c.absorber.applyComment;
							}
							if(c.absorber.noLock !== undefined){
								this.noLock = c.absorber.noLock;
							}
						}
					}
				})
			);
			return deferred.promise;
		},
		fetchEmpMonthDefs: function(){
			var deferred = new Deferred();
			var req = {
				action: "SObject",
				key: tsCONST.prefixBar + "AtkEmpMonth__c"
			};
			Request.actionA(
				tsCONST.API_GET_EXT_RESULT,
				req,
				true
			).then(
				lang.hitch(this, function(result){
					this.empMonthDefs = result;
					deferred.resolve();
				}),
				deferred.reject
			);
			return deferred.promise;
		},
		getFieldByApiName: function(apiKey){
			var fields = this.empMonthDefs.fields || [];
			for(var i = 0 ; i < fields.length ; i++){
				var f = fields[i];
				if(f.name.toLowerCase() == apiKey){
					return f;
				}
			}
			return null;
		},
		outputLogFieldMap: function(){
			LogAgent.addLog(Constant.MSG_EMP_MONTH_TARGET_FIELD);
			var keys = Object.keys(this.holidayFieldMap);
			for(var i = 0 ; i < keys.length ; i++){
				var key = keys[i];
				var apiKeys = (this.holidayFieldMap[key] || '').split(',');
				if(apiKeys.length){
					for(var k = 0 ; k < apiKeys.length && k < 2 ; k++){
						var apiKey = apiKeys[k].trim();
						var field = this.getFieldByApiName(apiKey.toLowerCase());
						var note = (apiKeys.length > 1 ? (k == 0 ? Constant.B_DAYS : Constant.B_HOURS) : '');
						if(field){
							LogAgent.addLog(str.substitute(Constant.MSG_EMP_MONTH_MAPPING  , [key, apiKey, note]));
						}else{
							LogAgent.addLog(str.substitute(Constant.MSG_EMP_MONTH_NO_DEFINE, [key, apiKey, note]));
						}
					}
				}
			}
		},
		getFieldsByHolidayName: function(key){
			var fields = [];
			var apiKeys = (this.holidayFieldMap[key] || '').split(',');
			if(apiKeys.length){
				for(var k = 0 ; k < apiKeys.length && k < 2 ; k++){
					var apiKey = apiKeys[k].trim();
					var field = this.getFieldByApiName(apiKey.toLowerCase());
					if(field){
						fields.push(field);
					}
				}
			}
			return fields;
		},
		getValidMappedFields: function(){
			var names = [];
			array.forEach(Object.keys(this.holidayFieldMap), function(key){
				var fields = this.getFieldsByHolidayName(key);
				for(var i = 0 ; i < fields.length ; i++){
					names.push(fields[i].name);
				}
			}, this);
			return names;
		},
		// マイナス付与の事柄にセットする文字列
		getMinusSubject: function(){
			return this.minusSubject;
		},
		// 勤務確定時のコメントにセットする文字列
		getApplyComment: function(){
			return this.applyComment;
		},
		// 勤務確定しない
		isNoLock: function(){
			return this.noLock;
		}
	}))();
});
