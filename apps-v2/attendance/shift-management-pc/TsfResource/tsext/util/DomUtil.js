define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/date/locale",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/_base/fx",
	"dojo/string",
	"dojo/dom-style",
	"dojo/dom-attr"
], function(declare, lang, locale, json, array, fx, str, domStyle, domAttr){
	return new (declare("tsext.util.DomUtil", null, {
		/**
		 * アンカータグにBlobデータをセット
		 * @param {Object} atag アンカータグ
		 * @param {boolean} flag =true:CSV形式 =false:テキスト
		 * @param {string} fname ファイル名
		 * @param {string} contents データ
		 * @param {boolean=} auto true:ダウンロード実行
		 */
		setDownloadLink: function(atag, flag, fname, contents, auto){
			var blob = null;
			if(flag){
				var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
				blob = new Blob([bom, contents], { type: "text/csv" });
			}else{
				blob = new Blob([contents], { type:"text/plain" });
			}
			if(window.navigator.msSaveBlob){
				if(auto){
					window.navigator.msSaveBlob(blob, fname);
				}else{
					this.dialog.own(on(atag, 'click', lang.hitch(this, function(e){
						window.navigator.msSaveBlob(blob, fname);
					})));
				}
			}else{
				var url = (window.URL || window.webkitURL).createObjectURL(blob);
				domAttr.set(atag, 'download', fname);
				domAttr.set(atag, 'href', url);
				if(auto){
					atag.click();
					setTimeout(function(){
						(window.URL || window.webkitURL).revokeObjectURL(atag.href);
					}, 3000);
				}
			}
		}
	}))();
});
