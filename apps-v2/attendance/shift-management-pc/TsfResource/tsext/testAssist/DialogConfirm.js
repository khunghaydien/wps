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
	"dojo/text!tsext/testAssist/DialogConfirm.html",
	"tsext/service/Request",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/DomUtil",
	"tsext/util/Util"
], function(declare, lang, json, array, str, query, on, Deferred, dom, domConstruct, domAttr, domClass, domStyle, Dialog, template, Request, Current, Constant, DomUtil, Util) {
	return declare("tsext.testAssist.DialogConfirm", null, {
		// 確認ダイアログ
		constructor : function(param){
			this.param = param || {};
		},
		/**
		 * ダイアログオープン
		 */
		show : function(content) {
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: 'Confirm',
				class: 'tsext-test-assist-dialog',
				content: template
			});
			this.dialog.own(
				on(this.dialog, 'cancel', lang.hitch(this, this.onCancel)),
				on(query('.tsext-c-ok'    , this.dialog.domNode)[0], 'click', lang.hitch(this, this.onOk)),
				on(query('.tsext-c-cancel', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onCancel))
			);
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
			this.deferred.resolve();
			this.hide();
		}
	});
});
