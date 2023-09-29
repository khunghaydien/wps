define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObjs",
	"tsext/testAssist/export/ExportConfig",
	"tsext/testAssist/DefaultSettings",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObjs, ExportConfig, DefaultSettings, Util){
	// 勤怠設定のコレクション
	return declare("tsext.testAssist.ExportConfigs", ExportObjs, {
		createObj: function(record){
			return new ExportConfig(this.manager, record, this);
		},
		getDefaultConfig: function(){
			if(!this.defaultConfig){
				this.defaultConfig = new ExportConfig(this.mangager, DefaultSettings.getDefaultConfig(), this);
			}
			return this.defaultConfig;
		},
		getConfigById: function(id){
			return this.getObjById(id);
		},
		getConfigsByConfigBaseId: function(configBaseId){
			var configs = [];
			for(var x = 0 ; x < this.objs.length ; x++){
				var c = this.objs[x];
				if(c.isMatchByConfigBaseId(configBaseId)){
					configs.push(c);
				}
			}
			configs = configs.sort(function(a, b){
				return a.compareRevision(b);
			});
			return configs;
		},
		getConfigByConfigBaseIdAndDate: function(configBaseId, d){
			for(var x = 0 ; x < this.objs.length ; x++){
				var c = this.objs[x];
				if(c.isMatchByConfigBaseIdAndDate(configBaseId, d)){
					return c;
				}
			}
			return null;
		}
	});
});
