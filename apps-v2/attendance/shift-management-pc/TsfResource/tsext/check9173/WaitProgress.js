define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/query",
	"dojo/on",
	"dojo/text!tsext/check9173/waitProgress.html",
	"dijit/Dialog"
], function(declare, lang, dom, domStyle, domAttr, query, on, template, Dialog) {
	return new (declare("tsext.dialog.waitProgress", null, {
		constructor: function(){
			this.dialog = null;
			this.stopped = false;
		},
		show: function(flag){
			if(!this.dialog){
				this.dialog = new Dialog({
					title: "診断ツール実行中",
					content: template,
					closable: false
				});
			}
			this.dialog.own(
				on(query('.tsext-check-stop', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onStop))
			);
			this.enableStop(false);
			this.stopped = false;
			if(flag){
				this.dialog.show();
			}else{
				this.dialog.hide();
			}
		},
		hide: function(){
			if(this.dialog){
				this.dialog.hide();
			}
		},
		onStop: function(){
			this.stopped = true;
		},
		isStopped: function(){
			return this.stopped;
		},
		enableStop: function(flag){
			domAttr.set(query('.tsext-check-stop', this.dialog.domNode)[0], 'disabled', !flag);
		},
		setProgressMsg1: function(msg){
			dom.byId('progressMsg1').innerHTML = msg;
		},
		setProgressMsg2: function(msg){
			dom.byId('progressMsg2').innerHTML = msg;
		},
		setProgressVal1: function(msg){
			dom.byId('progressVal1').innerHTML = msg;
		},
		setProgressVal2: function(msg){
			dom.byId('progressVal2').innerHTML = msg;
		}
	}))();
});
