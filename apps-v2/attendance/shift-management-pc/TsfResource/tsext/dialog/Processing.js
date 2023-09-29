define([
	"dojo/_base/declare",
	"dojo/dom-style",
	"dojo/query",
	"dojo/text!tsext/template/processing.html",
	"dijit/Dialog"
], function(declare, domStyle, query, template, Dialog) {
	return new (declare("tsext.dialog.Processing", null, {
		constructor: function(){
			this.dialog = null;
		},
		show: function(flag){
			if(!this.dialog){
				this.dialog = new Dialog({
					title: "処理中",
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
		},
		// ログ出力
		outLog: function(msg, flag){
			var textArea = query('.tsext-form-log textarea', this.dialog.domNode)[0];
			if(flag){
				textArea.value = '';
			}
			textArea.value += ((flag ? '' : '\n') + moment().format('YYYY/MM/DD HH:mm:ss') + ' ' +  (msg || ''));
			textArea.scrollTop = textArea.scrollHeight;
		},
		// ログ内容取得
		getLog: function(){
			return query('.tsext-form-log textarea', this.dialog.domNode)[0].value;
		}
	}))();
});
