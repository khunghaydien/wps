define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/json",
	"dojo/string",
	"dojo/Deferred",
	"tsext/tsobj/Helper",
	"tsext/logic/DataLoader",
	"tsext/service/Request",
	"tsext/service/Agent",
	"tsext/util/Util"
], function(declare, lang, array, json, str, Deferred, Helper, DataLoader, Request, Agent, Util){
	return declare("tsext.logic.AtkCommonLogic", null, {
		constructor : function(){
			this.dataLoader = new DataLoader();
		},
		loadAtkCommon: function(outLog, callback){
			outLog('オブジェクトリスト取得');
			this.dataLoader.getSObjectListLoop({
				outLog: this.outLog
			}).then(
				lang.hitch(this, function(){
					this.exportAtkCommon1(outLog, callback);
				}),
				lang.hitch(this, function(errmsg){
					callback(false, errmsg);
				})
			);
		},
		exportAtkCommon1: function(outLog, callback){
			outLog('オブジェクト定義取得');
			this.dataLoader.getSObjectInfoLoop({
				sobjs : [{ key: 'AtkCommon__c', all: true }],
				outLog: outLog
			}).then(
				lang.hitch(this, function(){
					this.exportAtkCommon2(outLog, callback);
				}),
				lang.hitch(this, function(errmsg){
					callback(false, errmsg);
				})
			);
		},
		exportAtkCommon2: function(outLog, callback){
			outLog('データ取得');
			var sobj = Agent.getSObjectList(Util.adaptPrefix('AtkCommon__c'));
			this.dataLoader.getData({
				sobj  : sobj,
				outLog: this.outLog
			}).then(
				lang.hitch(this, function(result){
					callback(true, result.records[0]);
				}),
				lang.hitch(this, function(errmsg){
					callback(false, errmsg);
				})
			);
		},
		convertLocalKey: function(obj){
			var _obj = {};
			for(var key in obj){
				if(obj.hasOwnProperty(key)){
					_obj[Util.rawName(key).toLowerCase()] = obj[key];
				}
			}
			return _obj;
		},
		val: function(v, flag){
			if(v === undefined && flag){
				return v;
			}
			if(typeof(v) == 'boolean'){
				return v || false;
			}
			if(typeof(v) == 'number'){
				return v || 0;
			}
			return v;
		},
		csvVal: function(v){
			if(typeof(v) == 'string'){
				return '"' + v.replace(/"/g, '""') + '"';
			}
			return v;
		},
		updateAtkCommon: function(newObj, orgObj, outLog, callback){
			var sobjName = Util.adaptPrefix('AtkCommon__c');
			var info = Agent.getSObject(sobjName);
			var _new = this.convertLocalKey(newObj);
			var _org = this.convertLocalKey(orgObj);
			var req = {
				action: "updateSObject",
				objName: sobjName,
				idList: [],
				values: {},
				typeMap: {}
			};
			req.idList.push(orgObj.Id);
			var vobj = {};
			var traces = [];
			traces.push((newObj._comment_ || 'AtkCommon__c') + ' のリストア前後比較');
			traces.push([
				'項目表示ラベル',
				'API参照名',
				'変更前の値',
				'変更後の値',
				'変更の有無'
			].join(','));
			for(var i = 0 ; i < info.exFields.length ; i++){
				var f = info.exFields[i];
				if(!f.isCustom || f.isCalculated || f.isAutoNumber){
					continue;
				}
				var name = f.localName || f.name;
				var key = name.toLowerCase();
				var vn = this.val(_new[key], true);
				if(vn === undefined){
					continue;
				}
				var vo = this.val(_org[key]);
				if(vn != vo){
					vobj[name] = vn;
					req.typeMap[name] = f.typeName;
				}
				traces.push([
					this.csvVal(f.label),
					this.csvVal(name),
					this.csvVal(vo),
					this.csvVal(vn),
					(vn != vo ? '変更' : '')
				].join(','));
			}
			req.values[orgObj.Id] = vobj;
			if(Object.keys(req.typeMap).length){
				outLog('データ更新開始');
				Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
					lang.hitch(this, function(result){
						outLog('データ更新終了');
						callback(true, traces);
					}),
					lang.hitch(this, function(errmsg){
						outLog('データ更新でエラー');
						callback(false, errmsg);
					})
				);
			}else{
				outLog('変更箇所がないため更新なし');
				callback(true, traces);
			}
		}
	});
});
