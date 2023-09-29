define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObjs",
	"tsext/testAssist/export/ExportPattern",
	"tsext/testAssist/DefaultSettings",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObjs, ExportPattern, DefaultSettings, Util){
	// 勤務パターンのコレクション
	return declare("tsext.testAssist.ExportPatterns", ExportObjs, {
		createObj: function(record){
			return new ExportPattern(this.manager, record, this);
		},
		getDefaultPattern: function(){
			if(!this.defaultPattern){
				this.defaultPattern = new ExportPattern(this.mangager, DefaultSettings.getDefaultPattern(), this);
			}
			return this.defaultPattern;
		},
		getPatternById: function(id){
			return this.getObjById(id);
		},
		getPatternsByIds: function(ids, flag){
			var patterns = [];
			var pmap = {};
			for(var i = 0 ; i < this.objs.length ; i++){
				var pattern = this.objs[i];
				if(ids.indexOf(pattern.getId()) >= 0){
					if(flag && pattern.isCopy()){
						pattern = this.getPatternById(pattern.getOriginalId());
					}
					if(pattern){
						if(!pmap[pattern.getId()]){
							patterns.push(pattern);
						}
						pmap[pattern.getId()] = true;
					}
				}
			}
			return patterns;
		}
	});
});
