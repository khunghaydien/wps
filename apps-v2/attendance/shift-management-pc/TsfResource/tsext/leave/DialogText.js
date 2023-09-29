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
	"dojo/text!tsext/leave/DialogText.html",
	"tsext/util/Util"
], function(declare, lang, json, array, query, on, Deferred, dom, domConstruct, domAttr, domClass, domStyle, Dialog, Request, template, Util) {
	return declare("tsext.leave.DialogText", null, {
		constructor : function(){
		},
		show : function(value) {
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: "JSON",
				content: template
			});
			this.dialog.own(
				on(this.dialog, 'cancel', lang.hitch(this, this.onCancel)),
				on(query('.tsext-c-close', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onClose))
			);
			query('textarea', this.dialog.domNode).forEach(function(el){
				el.value = value || '';
			});
			this.dialog.show();
			return this.deferred.promise;
		},
		onClose : function(){
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
