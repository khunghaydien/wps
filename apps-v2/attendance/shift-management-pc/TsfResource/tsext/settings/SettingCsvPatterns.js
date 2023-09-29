define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/settings/SettingCsvObjs",
	"tsext/settings/SettingCsvPattern",
	"tsext/util/Util"
], function(declare, lang, array, str, SettingCsvObjs, SettingCsvPattern, Util){
	return declare("tsext.settings.SettingCsvPatterns", SettingCsvObjs, {
		constructor : function(csobj){
			this.inherited(arguments);
		},
		createSettingCsvObj : function(csobj, csvRow){
			return new SettingCsvPattern(csobj, csvRow);
		}
	});
});
