define([
	"dojo/_base/declare",
	"dijit/Dialog"
], function(declare, Dialog) {
	return declare(null, {
		constructor : function(obj){
			this.counter = 1;
		},
		createDialog : function(first) {
			// Create a new dialog
			var dialog = new Dialog({
				// Dialog title
				title: "New Dialog " + this.counter,
				// Create Dialog content
				content: (!first ? "I am a dialog on top of other dialogs" : "I am the bottom dialog") + "<br /><br /><button onclick=\"createDialog();\">Create another dialog.</button>"
			});
			dialog.show();
			this.counter++;
		}
	});
});
