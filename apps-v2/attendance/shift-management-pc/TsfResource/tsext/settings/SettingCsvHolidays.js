define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/settings/SettingCsvObjs",
	"tsext/settings/SettingCsvHoliday",
	"tsext/util/Util"
], function(declare, lang, array, str, SettingCsvObjs, SettingCsvHoliday, Util){
	return declare("tsext.settings.SettingCsvHolidays", SettingCsvObjs, {
		constructor : function(csobj){
			this.inherited(arguments);
		},
		createSettingCsvObj : function(csobj, csvRow){
			return new SettingCsvHoliday(csobj, csvRow);
		}
	});
});
