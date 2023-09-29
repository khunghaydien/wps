define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/settings/SettingCsvObjs",
	"tsext/settings/SettingCsvEmpType",
	"tsext/util/Util"
], function(declare, lang, array, str, SettingCsvObjs, SettingCsvEmpType, Util){
	return declare("tsext.settings.SettingCsvEmpTypes", SettingCsvObjs, {
		constructor : function(csobj){
			this.inherited(arguments);
		},
		createSettingCsvObj : function(csobj, csvRow){
			return new SettingCsvEmpType(csobj, csvRow);
		},
		setConfigBases : function(csobj){
			array.forEach(this.settingCsvObjs, function(settingCsvEmpType){
				var configBaseId = settingCsvEmpType.getConfigBaseId();
				var csvRow = this.getCsvRowById(csobj.getCsvRows(), configBaseId);
				if(csvRow){
					settingCsvEmpType.setConfigBase(csobj, csvRow);
				}
			}, this);
		},
		setConfigs : function(csobj){
			array.forEach(this.settingCsvObjs, function(settingCsvEmpType){
				var configBaseId = settingCsvEmpType.getConfigBaseId();
				settingCsvEmpType.setConfigs(csobj, this.getCsvRowsByKeyValue(csobj.getCsvRows(), 'ConfigBaseId__c', configBaseId));
			}, this);
		},
		setEmpTypePatterns : function(csobj){
			array.forEach(this.settingCsvObjs, function(settingCsvEmpType){
				settingCsvEmpType.setEmpTypePatterns(csobj, this.getCsvRowsByKeyValue(csobj.getCsvRows(), 'EmpTypeId__c', settingCsvEmpType.getCsvId()));
			}, this);
		},
		setEmpTypeHolidays : function(csobj){
			array.forEach(this.settingCsvObjs, function(settingCsvEmpType){
				settingCsvEmpType.setEmpTypeHolidays(csobj, this.getCsvRowsByKeyValue(csobj.getCsvRows(), 'EmpTypeId__c', settingCsvEmpType.getCsvId()));
			}, this);
		},
		setEmpTypeYuqs : function(csobj){
			array.forEach(this.settingCsvObjs, function(settingCsvEmpType){
				settingCsvEmpType.setEmpTypeYuqs(csobj, this.getCsvRowsByKeyValue(csobj.getCsvRows(), 'EmpTypeId__c', settingCsvEmpType.getCsvId()));
			}, this);
		},
		verify : function(){
			array.forEach(this.settingCsvObjs, function(settingCsvEmpType){
				settingCsvEmpType.verify();
			}, this);
		},
		importStart : function(helper, callback){
			this.import(helper, 0, callback);
		},
		import : function(helper, index, callback){
			var settingCsvEmpType = this.getByIndex(index);
			if(!settingCsvEmpType){
				callback(true);
				return;
			}
			settingCsvEmpType.import(helper, lang.hitch(this, function(flag, errmsg){
				if(flag){
					this.import(helper, index + 1, callback);
				}else{
					callback(flag, errmsg);
				}
			}));
		}
	});
});
