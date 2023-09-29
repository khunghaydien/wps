define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.settings.SettingImportHelper", null, {
		constructor : function(){
			this.valueSet = {};
			this.idPair = {};
		},
		isKnown : function(key){
			return (this.valueSet[key] ? true : false);
		},
		getValue : function(key){
			return this.valueSet[key];
		},
		setValue : function(key, value){
			this.valueSet[key] = value;
		},
		clearValues : function(){
			this.valueSet = {};
		},
		getIdPair : function(csvId){
			return this.idPair[csvId] || null;
		},
		setIdPair : function(csvId, dstId){
			this.idPair[csvId] = dstId;
		}
	});
});
