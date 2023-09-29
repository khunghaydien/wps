define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/service/Request",
	"tsext/service/Agent",
	"tsext/util/Util"
], function(declare, lang, array, str, Request, Agent, Util){
	return declare("tsext.settings.SettingCsvObj", null, {
		constructor : function(csobj, csvRow){
			this.csobj = csobj;
			this.csvRow = csvRow;
			this.existId = null;
			this.newId = null;
		},
		getId : function(){
			return (this.newId || this.existId);
		},
		getCsvId : function(){
			return this.csvRow.getId();
		},
		getName : function(){
			return this.csvRow.getName();
		},
		getLogName : function(){
			if(this.existId){
				return str.substitute("${0}：${1}（${2}）",
						[this.typeName || '', this.csvRow.getName(), this.existId]);
			}
			return str.substitute("${0}：${1}",
					[this.typeName || '', this.csvRow.getName()]);
		},
		getExistId : function(){
			return this.existId;
		},
		setExistId : function(id){
			this.existId = id;
		},
		getDstField : function(csvField){
			var name = Util.adaptPrefix(csvField.getName()).toLowerCase();
			var info = Agent.getSObject(Util.adaptPrefix(this.objName));
			// 1)インポート先に合わせて名前空間を追加(または除去)したフィールド名で検索
			// （ユーザ定義の項目はヒットしない。例:sumh_KANGO__c）
			for(var i = 0 ; i < info.exFields.length ; i++){
				var field = info.exFields[i];
				if(field.name.toLowerCase() == name){
					return field;
				}
			}
			// 2)名前空間考慮なしのフィールド名で検索(ユーザ定義の項目を検索)
			// TODO  型を考慮してない
			name = csvField.getName().toLowerCase();
			for(var i = 0 ; i < info.exFields.length ; i++){
				var field = info.exFields[i];
				if(field.name.toLowerCase() == name){
					return field;
				}
			}
			return null;
		},
		import : function(helper, callback){
			if(this.getExistId()){
				callback(true);
				return;
			}
			this.doImport(helper, callback);
		},
		doImport : function(helper, callback){
			var csvFields = this.csobj.getCsvFields();
			var req = {
				action: "insertSObject",
				key: Util.adaptPrefix(this.objName),
				values: [],
				typeMap: {}
			};
			var vobj = {};
			for(var i = 0 ; i < csvFields.length ; i++){
				var csvField = csvFields[i];
				var dstField = this.getDstField(csvField);
				if(!dstField || csvField.type == 'LOCATION'){
					continue;
				}
//				console.log(csvField.name + ', type=' + csvField.type);
				var fieldName = dstField.name;
				var v = this.csvRow.getValueByField(csvField);
				var fieldRawName = Util.rawName(csvField.name);
				if(helper.isKnown(fieldName)){
					vobj[fieldName] = helper.getValue(fieldName);
				}else if(csvField.type == 'DATETIME'){
					vobj[fieldName] = (v ? v + ':00' : null);
				}else if(csvField.type == 'REFERENCE'){
					vobj[fieldName] = helper.getIdPair(v);
				}else if(/(BOOLEAN|DOUBLE|CURRENCY|PERCENT)/.test(csvField.type)){
					vobj[fieldName] = v;
				}else{
					vobj[fieldName] = v || null;
				}
				if((csvField.type == 'STRING' || csvField.type == 'TEXTAREA')
				&& vobj[fieldName]
				&& vobj[fieldName].length > csvField.length){
					vobj[fieldName] = vobj[fieldName].substring(0, csvField.length);
				}
				// TODO JSONテキストでIDを参照している場合、IDを差し替える処理が必要
				req.typeMap[fieldName] = csvField.type;
			}
			req.values.push(vobj);
			console.log(req);
			Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(result){
					this.newId = result.records[0].Id;
					helper.setIdPair(this.getCsvId(), this.newId);
					callback(true, this.newId);
				}),
				lang.hitch(this, function(errmsg){
					callback(false, errmsg);
				})
			);
		}
	});
});
