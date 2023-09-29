define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/util/Util"
], function(declare, lang, json, array, Util) {
	return declare("tsext.tsjtb.JtbObj", null, {
		constructor: function(obj){
			this.setObj(obj);
		},
		setObj: function(obj){
			this.obj = obj || {};
		},
		getObj: function(){
			return this.obj;
		},
		get: function(key){
			if(key == this.moneyKey){
				return Util.formatMoney(this.obj[key]);
			}
			return this.obj[key] || '';
		},
		set: function(key, v){
			if(key == this.moneyKey){
				this.obj[key] = '' + Util.str2num(v);
			}else{
				this.obj[key] = (v || '').trim() || null;
			}
		},
		clone: function(){
			return null;
		}
	});
});
