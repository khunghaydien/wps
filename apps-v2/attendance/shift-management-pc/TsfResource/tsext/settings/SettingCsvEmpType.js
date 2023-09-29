define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/settings/SettingCsvObj",
	"tsext/settings/SettingCsvConfigBase",
	"tsext/settings/SettingCsvConfig",
	"tsext/settings/SettingCsvEmpTypePattern",
	"tsext/settings/SettingCsvEmpTypeHoliday",
	"tsext/settings/SettingCsvEmpTypeYuq",
	"tsext/util/Util"
], function(declare, lang, array, str, SettingCsvObj, SettingCsvConfigBase, SettingCsvConfig, SettingCsvEmpTypePattern, SettingCsvEmpTypeHoliday, SettingCsvEmpTypeYuq, Util){
	return declare("tsext.settings.SettingCsvEmpType", SettingCsvObj, {
		constructor : function(csobj, csvRow){
			this.objName = 'AtkEmpType__c';
			this.typeName = '勤務体系';
			this.configBase = null;
			this.configs = [];
			this.empTypePatterns = [];
			this.empTypeHolidays = [];
			this.empTypeYuqs = [];
			this.ng = [];
			this.inherited(arguments);
		},
		getConfigBaseId : function(){
			return this.csvRow.getValueByName('ConfigBaseId__c');
		},
		setConfigBase : function(csobj, csvRow){
			if(this.configBase){
				this.ng.push('duplicate configBase');
			}
			this.configBase = new SettingCsvConfigBase(csobj, csvRow);
		},
		setConfigs : function(csobj, csvRows){
			array.forEach(csvRows, function(csvRow){
				this.configs.push(new SettingCsvConfig(csobj, csvRow));
			}, this);
		},
		setEmpTypePatterns : function(csobj, csvRows){
			array.forEach(csvRows, function(csvRow){
				this.empTypePatterns.push(new SettingCsvEmpTypePattern(csobj, csvRow));
			}, this);
		},
		setEmpTypeHolidays : function(csobj, csvRows){
			array.forEach(csvRows, function(csvRow){
				this.empTypeHolidays.push(new SettingCsvEmpTypeHoliday(csobj, csvRow));
			}, this);
		},
		setEmpTypeYuqs : function(csobj, csvRows){
			array.forEach(csvRows, function(csvRow){
				this.empTypeYuqs.push(new SettingCsvEmpTypeYuq(csobj, csvRow));
			}, this);
		},
		isValid : function(){
			return (this.configBase && this.configs.length > 0);
		},
		verify : function(){
			console.log(this.getName() + ' - ' + this.isValid()
					+ ' empTypePatterns=' + this.empTypePatterns.length
					+ ' empTypeHolidays=' + this.empTypeHolidays.length);
		},
		import : function(helper, callback){
			if(this.getId()){
				callback(true);
				return;
			}
			helper.clearValues();
			helper.setValue('Name', this.getName());
			this.configBase.import(helper, lang.hitch(this, function(flag, result){
				if(flag){
					helper.setValue('ConfigBaseId__c', result);
					this.importConfigs(helper, 0, callback);
				}else{
					callback(flag, result);
				}
			}));
		},
		importConfigs : function(helper, index, callback){
			if(index >= this.configs.length){
				this.importEmpType(helper, callback);
			}
			this.configs[index].import(helper, lang.hitch(this, function(flag, result){
				if(flag){
					this.importConfigs(helper, index + 1, callback);
				}else{
					callback(flag, result);
				}
			}));
		},
		importEmpType : function(helper, callback){
			this.doImport(helper, lang.hitch(this, function(flag, result){
				if(flag){
					helper.setValue('EmpTypeId__c', result);
					this.importEmpTypePatterns(helper, 0, callback);
				}else{
					callback(flag, result);
				}
			}));
		},
		importEmpTypePatterns : function(helper, index, callback){
			if(index >= this.empTypePatterns.length){
				this.importEmpTypeHolidays(helper, 0, callback);
			}
			this.empTypePatterns[index].import(helper, lang.hitch(this, function(flag, result){
				if(flag){
					this.importEmpTypePatterns(helper, index + 1, callback);
				}else{
					callback(flag, result);
				}
			}));
		},
		importEmpTypeHolidays : function(helper, index, callback){
			if(index >= this.empTypeHolidays.length){
				this.importEmpTypeYuqs(helper, 0, callback);
			}
			this.empTypeHolidays[index].import(helper, lang.hitch(this, function(flag, result){
				if(flag){
					this.importEmpTypeHolidays(helper, index + 1, callback);
				}else{
					callback(flag, result);
				}
			}));
		},
		importEmpTypeYuqs : function(helper, index, callback){
			if(index >= this.empTypeYuqs.length){
				callback(true);
			}
			this.empTypeYuqs[index].import(helper, lang.hitch(this, function(flag, result){
				if(flag){
					this.importEmpTypeYuqs(helper, index + 1, callback);
				}else{
					callback(flag, result);
				}
			}));
		}
	});
});
