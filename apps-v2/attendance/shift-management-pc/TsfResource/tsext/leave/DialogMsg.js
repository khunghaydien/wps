define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/query",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dijit/Dialog",
	"tsext/service/Request",
	"dojo/text!tsext/leave/DialogMsg.html",
	"tsext/util/Util"
], function(declare, lang, json, array, query, on, Deferred, dom, domConstruct, domAttr, domClass, domStyle, Dialog, Request, template, Util) {
	return declare("tsext.leave.DialogMsg", null, {
		constructor : function(){
		},
		show : function(message, closeOnly) {
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: "",
				content: template
			});
			this.dialog.own(
				on(this.dialog, 'cancel', lang.hitch(this, this.onCancel)),
				on(query('.tsext-c-ok'    , this.dialog.domNode)[0], 'click', lang.hitch(this, this.onOk    )),
				on(query('.tsext-c-cancel', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onCancel))
			);
			query('div.tsext-message', this.dialog.domNode).forEach(function(el){
				el.innerHTML = message || '';
			});
			if(closeOnly){
				domStyle.set(query('.tsext-c-ok', this.dialog.domNode)[0], 'display', 'none');
				query('.tsext-c-cancel', this.dialog.domNode)[0].value = 'Close';
			}
			this.dialog.show();
			return this.deferred.promise;
		},
		onOk : function(){
			this.deferred.resolve();
			this.hide();
		},
		onCancel : function(){
			this.deferred.reject();
			this.hide();
		},
		hide : function(){
			if(this.dialog){
				this.dialog.hide().then(lang.hitch(this, function(){
					this.dialog.destroyRecursive();
					this.dialog = null;
				}));
			}
		}
	});
});
