define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObjs",
	"tsext/testAssist/export/ExportWorkLocation",
	"tsext/testAssist/DefaultSettings",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObjs, ExportWorkLocation, DefaultSettings, Util){
	// 勤務場所のコレクション
	return declare("tsext.testAssist.ExportWorkLocations", ExportObjs, {
		createObj: function(record){
			return new ExportWorkLocation(this.manager, record, this);
		},
		getDefaultWorkLocation: function(){
			if(!this.defaultWorkLocation){
				this.defaultWorkLocation = new ExportWorkLocation(this.mangager, DefaultSettings.getDefaultWorkLocation(), this);
			}
			return this.defaultWorkLocation;
		},
		getWorkLocationById: function(id){
			return this.getObjById(id);
		}
	});
});
