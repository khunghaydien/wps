define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string"
], function(declare, lang, array, str){
	return declare("tsext.testAssist.TsError", Error, {
		/**
		 * 例外エラークラス
		 * @constructor
		 * @param {string|Object} value
		 * @param {Array.<string>} args
		 */
		constructor : function(value, args){
			if(typeof(value) == 'object'){
				this.message = str.substitute(value.message, args);
				this.errorLevel = value.errorLevel || 2;
			}else{
				this.message = str.substitute(value, args);
				this.errorLevel = 2;
			}
		},
		getMessage: function(){
			return this.message;
		},
		getErrorLevel: function(){
			return this.errorLevel;
		}
	});
});
