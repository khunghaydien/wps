define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/tsobj/Helper",
	"tsext/service/Request",
	"tsext/service/Agent",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Helper, Request, Agent, Util){
	return declare("tsext.logic.DataLoader", null, {
		constructor : function(){
			this.bfld = {
				id: 1,
				name: 2,
				createddate: 3,
				createdbyid: 4,
				lastmodifieddate: 5,
				lastmodifiedbyid: 6,
				systemmodstamp: 7,
				isdeleted: 8,
				ownerid: 9
			};
			this.refers = [];
		},
		getSObjectListLoop: function(reqInfo){
			var deferred = new Deferred();
			this.refers = [];
			this.getSObjectList(reqInfo, deferred.resolve, deferred.reject);
			return deferred.promise;
		},
		getSObjectInfoLoop: function(reqInfo){
			var deferred = new Deferred();
			this.refers = [];
			this.getSObjectInfo(reqInfo, deferred.resolve, deferred.reject);
			return deferred.promise;
		},
		getDataLoop: function(reqInfo){
			var deferred = new Deferred();
			this.getRecordsIteration(reqInfo, 0, deferred.resolve, deferred.reject);
			return deferred.promise;
		},
		getData: function(reqInfo){
			var deferred = new Deferred();
			this.getRecords(reqInfo, reqInfo.sobj, deferred.resolve, deferred.reject);
			return deferred.promise;
		},
		getSObjectList: function(reqInfo, onSuccess, onFailure){
			var req = {
				action: 'SObjectList',
				keepNameSpace: true
			};
			Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(result){
					var cnt = 0;
					Object.keys(result.sObjects).forEach(function(key){
						Agent.setSObjectList(key, result.sObjects[key]);
						cnt++;
					});
					onSuccess();
				}),
				lang.hitch(this, function(errmsg){
					Util.consoleLog(errmsg);
					onFailure(errmsg);
				})
			);
		},
		getSObjectInfo: function(reqInfo, onSuccess, onFailure){
			var target = null;
			for(var i = 0 ; i < this.refers.length ; i++){
				var o = Agent.getSObject(this.refers[i]);
				if(!o){
					target = { key: this.refers[i] };
					break;
				}
			}
			if(!target){
				var sobjs = reqInfo.sobjs || [];
				for(var i = 0 ; i < sobjs.length ; i++){
					var sobj = sobjs[i];
					var o = Agent.getSObject(Util.adaptPrefix(sobj.key));
					if(!o){
						target = sobj;
						break;
					}
				}
				if(!target){
					onSuccess();
					return;
				}
			}
			var req = {
				action: 'SObject',
				key: Util.adaptPrefix(target.key),
				keepNameSpace: true
			};
			Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(result){
					this.cacheSObjectInfo(result);
					this.getSObjectInfo(reqInfo, onSuccess, onFailure);
				}),
				lang.hitch(this, function(errmsg){
					Util.consoleLog(errmsg);
					onFailure(errmsg);
				})
			);
		},
		cacheSObjectInfo: function(result){
			result.fields = this.sortFields(result.fields);
			Agent.setSObject(result.key, result);
			array.forEach(result.fields || [], function(field){
				if(field.typeName == 'REFERENCE'
				&& field.referenceTo
				&& field.referenceTo.length){
					for(var i = 0 ; i < field.referenceTo.length ; i++){
						var refer = field.referenceTo[i];
						if(array.indexOf(refer) < 0 && this.refers.indexOf(refer) < 0){
							this.refers.push(refer);
						}
					}
				}
			}, this);
			result.exFields = this.excludeDuplicateField(result.fields); // API参照名重複を排除したフィールドリスト
		},
		sortFields: function(fields){
			fields = fields.sort(lang.hitch(this, function(a, b){
				var x = this.bfld[a.name.toLowerCase()];
				var y = this.bfld[b.name.toLowerCase()];
				if(x && y){
					return x - y;
				}else if(x){
					return -1;
				}else if(y){
					return 1;
				}else{
					if(a.isCustom && !b.isCustom){
						return 1;
					}else if(!a.isCustom && b.isCustom){
						return -1;
					}
					return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
				}
			}));
			return fields;
		},
		getRecordsIteration: function(reqInfo, index, onSuccess, onFailure){
			var sobjs = reqInfo.sobjs || [];
			if(index >= sobjs.length){
				this.getProcessInstanceStepStart(reqInfo, onSuccess, onFailure);
				return;
			}
			var sobj = sobjs[index];
			if((reqInfo.isTarget && !reqInfo.isTarget(sobj)) || !sobj.name){
				this.getRecordsIteration(reqInfo, index + 1, onSuccess, onFailure);
			}else{
				this.getRecords(reqInfo, sobj, lang.hitch(this, function(){
					this.getRecordsIteration(reqInfo, index + 1, onSuccess, onFailure);
				}), onFailure);
			}
		},
		getRecords: function(reqInfo, sobj, onSuccess, onFailure){
			var sobjName = Util.adaptPrefix(sobj.name);
			var info = Agent.getSObject(sobjName);
			var soql = str.substitute('select ${0} from ${1}${2}', [
				this.createSoqlFields(info.exFields),
				sobjName,
				(reqInfo.getCondition ? reqInfo.getCondition(sobj) : '')
			]);
			var req = {
				soql: soql,
				limit: 50000,
				offset: 0,
				keepNameSpace: true
			};
			Request.fetch(soql, true, true).then(
				lang.hitch(this, function(records){
					if(reqInfo.receiveData){
						reqInfo.receiveData(sobj, soql, records);
						onSuccess();
					}else{
						onSuccess({
							sobj: sobj,
							soql: soql,
							records: records
						});
					}
				}),
				lang.hitch(this, function(errmsg){
					reqInfo.outLog('Error:' + errmsg);
					onFailure(errmsg);
				})
			);
		},
		getProcessInstanceStepStart: function(reqInfo, onSuccess, onFailure){
			var pool = {
				sobj: {key:'ProcessInstanceStep',name:'ProcessInstanceStep'},
				soql: "select Id,CreatedDate,StepStatus,Comments,ActorId,Actor.Name,"
					+ "OriginalActorId,OriginalActor.Name,ProcessInstance.TargetObjectId,ProcessInstance.TargetObject.Name"
					+ " from ProcessInstanceStep",
				applyIds: lang.clone(Agent.getApplyIds(true)),
				records: []
			};
			this.getProcessInstanceStepLoop(pool, lang.hitch(this, function(){
				if(pool.records.length && reqInfo.receiveData){
					reqInfo.receiveData(pool.sobj, pool.soql, pool.records);
				}
				onSuccess();
			}), onFailure);
		},
		getProcessInstanceStepLoop: function(pool, onSuccess, onFailure){
			if(!pool.applyIds.length){
				onSuccess();
				return;
			}
			var soql = pool.soql + " where ProcessInstance.TargetObjectId in ('" + pool.applyIds.splice(0, 100).join("','") + "')";
			var req = {
				soql: soql,
				limit: 50000,
				offset: 0,
				keepNameSpace: true
			};
			Request.fetch(soql, true, true).then(
				lang.hitch(this, function(records){
					pool.records = pool.records.concat(records);
					this.getProcessInstanceStepLoop(pool, onSuccess, onFailure);
				}),
				lang.hitch(this, function(errmsg){
					reqInfo.outLog('Error:' + errmsg);
					onFailure(errmsg);
				})
			);
		},
		createSoqlFields: function(fields){
			var cols = [];
			array.forEach(fields, function(field){
				cols.push(field.name);
				var refName = this.getReferenceName(field);
				if(refName){
					cols.push(refName);
				}
			}, this);
			return cols.join(',');
		},
		excludeDuplicateField: function(orgFields){
			var fields = dojo.clone(orgFields);
			var fmap = {};
			var dels = [];
			for(var i = 0 ; i < fields.length ; i++){
				var f = fields[i];
				var key = (f.localName || f.name).toLowerCase();
				var x = fmap[key];
				if(x !== undefined){ // ローカル名が重複している
					// 文字列長が長い方(名前空間つき)を残す
					if(fields[x].name.length > fields[i].name.length){
						dels.push(i);
					}else{
						dels.push(x);
					}
				}else{
					fmap[key] = i;
				}
			}
			dels = dels.sort(function(a, b){ return b - a; });
			for(var i = 0 ; i < dels.length ; i++){
				var x = dels[i];
				fields.splice(x, 1);
			}
			return fields;
		},
		getReferenceName: function(field){
			if(field.typeName == 'REFERENCE'
			&& field.referenceTo
			&& field.referenceTo.length){
				var info = Agent.getSObject(Util.adaptPrefix(field.referenceTo[0]));
				var fs = info.fields || [];
				for(var i = 0 ; i < fs.length ; i++){
					if(fs[i].name.toLowerCase() == 'name'){
						return field.relationshipName + '.Name';
					}
				}
			}
			return null;
		},
		getSObjectListCsv: function(sobjs){
			var value = '';
			for(var i = 0 ; i < sobjs.length ; i++){
				var so = sobjs[i];
				if(!so.name){
					continue;
				}
				var lst = [];
				lst.push(so.name);
				lst.push(so.localName || so.name);
				lst.push(so.label);
				lst.push(so.labelPlural);
				lst.push(so.keyPrefix);
				lst.push(so.isAccessible		  ? '○' : '');
				lst.push(so.isCreateable		  ? '○' : '');
				lst.push(so.isCustom			  ? '○' : '');
				lst.push(so.isCustomSetting 	  ? '○' : '');
				lst.push(so.isDeletable 		  ? '○' : '');
				lst.push(so.isDeprecatedAndHidden ? '○' : '');
				lst.push(so.isFeedEnabled		  ? '○' : '');
				lst.push(so.isMergeable 		  ? '○' : '');
				lst.push(so.isQueryable 		  ? '○' : '');
				lst.push(so.isSearchable		  ? '○' : '');
				lst.push(so.isUndeletable		  ? '○' : '');
				lst.push(so.isUpdateable		  ? '○' : '');
				value += '"' + lst.join('","') + '"\n';
			}
			var heads = [
				'name',
				'localName',
				'label',
				'labelPlural',
				'keyPrefix',
				'isAccessible',
				'isCreateable',
				'isCustom',
				'isCustomSetting',
				'isDeletable',
				'isDeprecatedAndHidden',
				'isFeedEnabled',
				'isMergeable',
				'isQueryable',
				'isSearchable',
				'isUndeletable',
				'isUpdateable'
			];
			return {
				heads: '"' + heads.join('","') + '"',
				value: value
			};
		},
		getFieldListCsv: function(sobjs){
			var value = '';
			var customFieldOnly 	= false;
			var excludeRemoveField	= false;
			var excludeRemoveCalc	= false;
			var cutPickList 		= false;
			for(var i = 0 ; i < sobjs.length ; i++){
				var sobj = sobjs[i];
				if(!sobj.name){
					continue;
				}
				var info = Agent.getSObject(Util.adaptPrefix(sobj.name));
				for(var j = 0 ; j < info.fields.length ; j++){
					var field = info.fields[j];
					if(customFieldOnly && !field.isCustom){
						continue;
					}
					if(excludeRemoveField && field.label.indexOf('削除予定') >= 0){
						continue;
					}
					if(excludeRemoveCalc && field.isCalculated){
						continue;
					}
					var lst = [];
					lst.push(sobj.label || '');
					lst.push(sobj.name || '');
					lst.push(field.label);
					lst.push(field.name);
					lst.push(field.typeName);
					lst.push('' + (field.length || 0));
					lst.push('' + (field.precision || 0));
					lst.push('' + (field.scale || 0));
					lst.push((field.referenceTo || []).join(','));
					lst.push(this.getPickLabels(field.picklistValues, '\n', (cutPickList ? 100 : 0)));
					lst.push(field.inlineHelpText	 ? field.inlineHelpText.replace(/"/g, '""')    : '');
					lst.push(field.calculatedFormula ? field.calculatedFormula.replace(/"/g, '""') : '');
					lst.push(field.isAutoNumber ? '○' : '');
					lst.push(field.isIdLookup	? '○' : '');
					lst.push(field.isCalculated ? '○' : '');
					lst.push(field.isCustom 	? '○' : '');
					lst.push(field.isNillable	? '○' : '');
					lst.push(field.isUnique 	? '○' : '');
					lst.push(field.isExternalID 			 ? '○' : '');
					lst.push(field.isGroupable				 ? '○' : '');
					lst.push(field.isHtmlFormatted			 ? '○' : '');
					lst.push(field.isRestrictedDelete		 ? '○' : '');
					lst.push(this.getChildRelationshipName(sobj.name, field.name) || '');
					value += '"' + lst.join('","') + '"\n';
				}
			}
			var heads = [
				"objectLabel",
				"objectName",
				"label",
				"name",
				"type",
				"length",
				"precision",
				"scale",
				"referenceTo",
				"pickList",
				"helpText",
				"calculatedFormula",
				"isAutoNumber",
				"isIdLookup",
				"isCalculated",
				"isCustom",
				"isNilable",
				"isUnique",
				"isExternalID",
				"isGroupable",
				"isHtmlFormatted",
				"isRestrictedDelete",
				"childRelationshipName"
			];
			return {
				heads: '"' + heads.join('","') + '"',
				value: value
			};
		},
		getPickLabels: function(values, d, cutLen){
			if(!values || values.length <= 0){
				return '';
			}
			var labels = [];
			for(var i = 0 ; i < values.length ; i++){
				labels.push(values[i][0]);
				if(cutLen && labels.length >= cutLen){
					labels.push('※' + cutLen + '件に達したため打ち切り※');
					break;
				}
			}
			return labels.join(d);
		},
		getChildRelationshipName: function(soName, fieldName){
			var sn = soName.toLowerCase();
			var fn = fieldName.toLowerCase();
			var keys = Agent.getSObjectKeys();
			for(var i = 0 ; i < keys.length ; i++){
				var key = keys[i];
				var info = Agent.getSObject(Util.adaptPrefix(key));
				if(!info){
					continue;
				}
				var ships = info.childRelationships || [];
				for(var j = 0 ; j < ships.length ; j++){
					var ship = ships[j];
					if(ship.objectName.toLowerCase() == sn
					&& ship.fieldName.toLowerCase() == fn){
						return ship.relationshipName;
					}
				}
			}
			return null;
		}
	});
});
