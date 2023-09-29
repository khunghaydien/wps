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
	"dojo/text!tsext/testAssist/DialogOption.html",
	"tsext/service/Request",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/DomUtil",
	"tsext/util/Util"
], function(declare, lang, json, array, str, query, on, Deferred, dom, domConstruct, domAttr, domClass, domStyle, Dialog, template, Request, Current, Constant, DomUtil, Util) {
	return declare("tsext.testAssist.DialogOption", null, {
		// 削除行挿入ダイアログ
		constructor : function(distributor){
			this.distributor = distributor;
		},
		/**
		 * ダイアログオープン
		 */
		show : function() {
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: 'オプション',
				class: 'tsext-test-assist-dialog',
				content: template
			});
			this.dialog.own(
				on(this.dialog, 'cancel', lang.hitch(this, this.onCancel)),
				on(query('.tsext-c-ok'    , this.dialog.domNode)[0], 'click', lang.hitch(this, this.onOk)),
				on(query('.tsext-c-cancel', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onCancel)),
				on(dom.byId('testAssistDelAfter'), 'click', lang.hitch(this, this.onDeleteAfter))
			);

			domAttr.set('testAssistDelBefore', 'disabled', !this.distributor.isCanInjectTop()); // 前に追加できる
			dom.byId('testAssistDelBefore').checked = this.distributor.isCanInjectTop();
			dom.byId('testAssistDelAfter' ).checked = true;
			dom.byId('testAssistPauseAfter').checked = true;

			this.dialog.show();
			return this.deferred.promise;
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
		onCancel : function(){
			this.deferred.reject();
			this.hide();
		},
		/**
		 * OK
		 */
		onOk : function(){
			this.deferred.resolve({
				injectDeleteBefore: dom.byId('testAssistDelBefore').checked,
				injectDeleteAfter:  dom.byId('testAssistDelAfter').checked,
				injectPauseAfter:   dom.byId('testAssistPauseAfter').checked
			});
			this.hide();
		},
		onDeleteAfter: function(){
			domAttr.set('testAssistPauseAfter', 'disabled', !dom.byId('testAssistDelAfter').checked);
		}
	});
});
