define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/settings/SettingCsvObj",
	"tsext/util/Util"
], function(declare, lang, array, str, SettingCsvObj, Util){
	return declare("tsext.settings.SettingCsvHoliday", SettingCsvObj, {
		constructor : function(csobj, csvRow){
			this.objName = 'AtkHoliday__c';
			this.typeName = '休暇';
			this.inherited(arguments);
		}
	});
});
