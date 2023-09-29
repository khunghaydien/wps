define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/tsjtb/JtbObj",
	"tsext/util/Util"
], function(declare, lang, json, array, JtbObj, Util) {
	return declare("tsext.tsjtb.JtbActual", [JtbObj], {
		constructor: function(obj){
			// 金額項目として扱う場合は下記を設定する（マイナス入力不可）
			// this.moneyKey = 'KG';
			this.moneyKey = '';
		},
		clone: function(){
			return new tsext.tsjtb.JtbActual(lang.clone(this.obj));
		}
	});
});
