define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/dom-style",
	"dojo/query",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom-construct",
	"dijit/Dialog",
	"dojo/text!tsext/template/confirm.html",
	"tsext/service/Request",
	"tsext/util/Util"
], function(declare, lang, json, array, domStyle, query, on, Deferred, domConstruct, Dialog, template, Request, Util) {
	return declare("tsext.dialog.Confirm", null, {
		constructor : function(param){
			this.param = param;
		},
		show : function() {
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: this.param.title || '',
				content: template
			});
			query('.tsext-confirm', this.domNode)[0].innerHTML = this.param.message;
			if(this.param.okLabel){
				query('.tsext-c-ok', this.dialog.domNode)[0].value = this.param.okLabel;
			}
			domStyle.set(query('.tsext-button-confirm', this.domNode)[0], 'display', (!this.param.alertMode ? '' : 'none'));
			domStyle.set(query('.tsext-button-alert'  , this.domNode)[0], 'display', (!this.param.alertMode ? 'none' : ''));
			on.once(this.dialog, 'cancel', lang.hitch(this, this.onCancel));
			on.once(query('.tsext-c-ok'    , this.dialog.domNode)[0], 'click', lang.hitch(this, this.onOk    ));
			query('.tsext-c-cancel', this.dialog.domNode).forEach(function(el){
				on.once(el, 'click', lang.hitch(this, this.onCancel));
			}, this);
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
