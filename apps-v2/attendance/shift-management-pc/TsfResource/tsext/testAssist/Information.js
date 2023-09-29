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
	// 説明
	return declare("tsext.testAssist.Information", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			if(this.option == Constant.OPTION_PAUSE
			|| this.option == '停止'
			|| this.option == 'ポーズ'){
				this.setMode(Constant.OPE_PAUSE);
			}else if(this.option){
				this.addError(Constant.ERROR_UNDEFINED); // 未定義
			}
		}
	});
});
