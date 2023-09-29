define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/settings/SettingCsvObj",
	"tsext/util/Util"
], function(declare, lang, array, str, SettingCsvObj, Util){
	return declare("tsext.settings.SettingCsvEmpTypeYuq", SettingCsvObj, {
		constructor : function(csobj, csvRow){
			this.objName = 'AtkEmpTypeYuq__c';
			this.typeName = '勤怠有休付与設定';
			this.inherited(arguments);
		},
		import : function(helper, callback){
			this.doImport(helper, callback);
		}
	});
});
