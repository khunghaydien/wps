define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/string",
	"dojo/query",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dijit/Dialog",
	"dojox/layout/ResizeHandle",
	"dojo/text!tsext/testAssist/DialogData.html",
	"tsext/service/Request",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/DomUtil",
	"tsext/util/Util"
], function(declare, lang, json, array, str, query, on, Deferred, dom, domConstruct, domAttr, domClass, domStyle, Dialog, ResizeHandle, template, Request, Current, Constant, DomUtil, Util) {
	return declare("tsext.testAssist.DialogData", null, {
		// テキスト表示ダイアログ
		constructor : function(param){
			this.param = param || {};
		},
		/**
		 * ダイアログオープン
		 */
		show : function(content) {
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: this.param.title || '',
				class: 'tsext-test-assist-dialog',
				content: template
			});
			domStyle.set('testAssistData', 'width' , '600px');
			domStyle.set('testAssistData', 'height', '200px');
			this.resizeHandle = new ResizeHandle({
				activeResize:true,
				intermediateChanges: true,
				minWidth:360,
				minHeight:140,
				style:'right:-6px;bottom:-8px',
				targetId: 'testAssistData'
			}, dom.byId('testAssistDataResize'));
			this.dialog.own(
				on(this.dialog, 'cancel', lang.hitch(this, this.onClose)),
				on(query('.tsext-c-cancel'  , this.dialog.domNode)[0], 'click', lang.hitch(this, this.onClose)),
				on(query('.tsext-c-download', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onDataDownload)),
				on(this.resizeHandle, 'resize', lang.hitch(this, this.onResize))
			);
			dom.byId('testAssistDataText').value = content;
			domAttr.set('testAssistDataText', 'disabled', true);
			this.dialog.show();
			this.onResize();
			return this.deferred.promise;
		},
		/**
		 * ダイアログサイズ変更
		 */
		onResize : function(){
			var cw = dom.byId('testAssistData').clientWidth;
			var ch = dom.byId('testAssistData').clientHeight;
			var rowHeight = 12;
			query('tr.test-assist-row-fix', this.dialog.domNode).forEach(function(tr){
				rowHeight += tr.clientHeight;
			});
			var h = (ch - rowHeight);
			domStyle.set('testAssistDataText', 'width', '100%');
			domStyle.set('testAssistDataText', 'height', h + 'px');
		},
		/**
		 * ダイアログを閉じる（DOMごと削除）
		 */
		hide : function(){
			if(this.dialog){
				this.dialog.hide().then(lang.hitch(this, function(){
					this.dialog.destroyRecursive();
					this.dialog = null;
				}));
			}
		},
		/**
		 * 閉じる
		 */
		onClose : function(){
			this.deferred.reject();
			this.hide();
		},
		/**
		 * ログ内容を返す
		 * @return {string}
		 */
		getLog : function(){
			return dom.byId('testAssistDataText').value;
		},
		/**
		 * ログをダウンロード
		 */
		onDataDownload: function(){
			var fname = moment().format('YYYYMMDDHHmmss') + (this.param.suffix || 'Data') + '.' + (this.param.extension || 'csv');
			DomUtil.setDownloadLink(dom.byId('testAssistDataLink'), true, fname, this.getLog(), true);
		}
	});
});
