define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/EntryBase1",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, EntryBase1, Current, Constant, Util){
	// 設定要素
	return declare("tsext.testAssist.Setting", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
		}
	});
});
