define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/settings/SettingCsvObj",
	"tsext/util/Util"
], function(declare, lang, array, str, SettingCsvObj, Util){
	return declare("tsext.settings.SettingCsvPattern", SettingCsvObj, {
		constructor : function(csobj, csvRow){
			this.objName = 'AtkPattern__c';
			this.typeName = '勤務パターン';
			this.inherited(arguments);
		}
	});
});
