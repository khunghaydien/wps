define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/tsjtb/JtbObj",
	"tsext/util/Util"
], function(declare, lang, json, array, JtbObj, Util) {
	return declare("tsext.tsjtb.JtbReserve", [JtbObj], {
		constructor: function(obj){
			this.moneyKey = 'HCCHUKG';
		},
		clone: function(){
			return new tsext.tsjtb.JtbReserve(lang.clone(this.obj));
		}
	});
});
