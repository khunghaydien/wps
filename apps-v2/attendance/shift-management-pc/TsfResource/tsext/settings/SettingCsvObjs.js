define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/settings/SettingCsvObj",
	"tsext/util/Util"
], function(declare, lang, array, str, SettingCsvObj, Util){
	return declare("tsext.settings.SettingCsvObjs", null, {
		constructor : function(csobj){
			this.csobj = csobj;
			var csvRows = csobj.getCsvRows();
			this.settingCsvObjs = [];
			array.forEach(csvRows, function(csvRow){
				this.settingCsvObjs.push(this.createSettingCsvObj(this.csobj, csvRow));
			}, this);
		},
		createSettingCsvObj : function(csobj, csvRow){
			return new SettingCsvObj(csobj, csvRow);
		},
		getSize : function(){
			return this.settingCsvObjs.length;
		},
		getByIndex : function(index){
			return (length < this.settingCsvObjs.length ? this.settingCsvObjs[index] : null);
		},
		excludeExisting: function(helper, name, id){
			for(var i = this.settingCsvObjs.length - 1 ; i >= 0 ; i--){
				var settingCsvObj = this.settingCsvObjs[i];
				if(settingCsvObj.getName() == name){
					settingCsvObj.setExistId(id);
					helper.setIdPair(settingCsvObj.getCsvId(), id);
				}
			}
		},
		getCsvRowById : function(csvRows, id){
			for(var i = 0 ; i < csvRows.length ; i++){
				var csvRow = csvRows[i];
				if(csvRow.getId() == id){
					return csvRow;
				}
			}
			return null;
		},
		getCsvRowsByKeyValue : function(csvRows, key, value){
			var results = [];
			for(var i = 0 ; i < csvRows.length ; i++){
				var csvRow = csvRows[i];
				if(csvRow.getValueByName(key) == value){
					results.push(csvRow);
				}
			}
			return results;
		},
		fillTargetsAndExcludes : function(targets, excludes){
			array.forEach(this.settingCsvObjs, function(settingCsvObj){
				if(settingCsvObj.getExistId()){
					excludes.push(settingCsvObj.getLogName());
				}else{
					targets.push(settingCsvObj.getLogName());
				}
			});
		},
		importStart : function(helper, callback){
			this.import(helper, 0, callback);
		},
		import : function(helper, index, callback){
			var settingCsvObj = this.getByIndex(index);
			if(!settingCsvObj){
				callback(true);
				return;
			}
			settingCsvObj.import(helper, lang.hitch(this, function(flag, result){
				if(flag){
					this.import(helper, index + 1, callback);
				}else{
					callback(flag, result);
				}
			}));
		}
	});
});
