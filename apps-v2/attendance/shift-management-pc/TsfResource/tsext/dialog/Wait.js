define([
	"dojo/_base/declare",
	"dojo/dom-style",
	"dojo/text!tsext/template/wait.html",
	"dijit/Dialog"
], function(declare, domStyle, template, Dialog) {
	return new (declare("tsext.dialog.Wait", null, {
		constructor: function(){
			this.dialog = null;
		},
		show: function(flag){
			if(!this.dialog){
				this.dialog = new Dialog({
					title: "",
					content: template,
					closable: false
				});
			}
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
		}
	}))();
});
