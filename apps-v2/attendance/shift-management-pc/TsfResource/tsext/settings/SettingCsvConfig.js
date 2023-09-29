define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/settings/SettingCsvObj",
	"tsext/util/Util"
], function(declare, lang, array, str, SettingCsvObj, Util){
	return declare("tsext.settings.SettingCsvConfigBase", SettingCsvObj, {
		constructor : function(csobj, csvRow){
			this.objName = 'AtkConfig__c';
			this.typeName = '勤怠設定';
			this.inherited(arguments);
		},
		import : function(helper, callback){
			this.doImport(helper, callback);
		}
	});
});
