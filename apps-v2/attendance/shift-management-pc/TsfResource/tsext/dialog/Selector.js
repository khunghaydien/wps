define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/query",
	"dojo/on",
	"dojo/text!tsext/template/selector.html",
	"dijit/TooltipDialog",
	"dijit/popup"
], function(declare, lang, array, domConstruct, domStyle, query, on, template, TooltipDialog, popup) {
	return new (declare("tsext.dialog.Selector", null, {
		constructor: function(){
			this.dialog = null;
			this.calendar = null;
			this.opend = false;
			this.targetNode = null;
			this.areaClickEventHandle = null;
		},
		getPoint: function(contents){
			if(!this.dialog){
				this.dialog = new TooltipDialog({
					title: "",
					content: template,
					onClick  : function(e){
						// クリックイベントを親ウィンドウへ伝播させない
						e.preventDefault();
						e.stopPropagation();
					}
				});
				var select = this.getSelect();
				this.dialog.own(
					// ダイアログを開いた時
					on(this.dialog, 'open', lang.hitch(this, function(){
						if(this.targetNode && this.targetNode.value){
							select.value = this.targetNode.value;
						}else{
							select.value = '';
						}
					})),
					on(select, 'change', lang.hitch(this, function(){
						this.selected(select.value);
					})),
					on(query('input[type="button"]', this.dialog.domNode)[0], 'click', lang.hitch(this, this.hide))
				);
				this.setContents(contents);
				this.dialog.startup();
			}else{
				this.setContents(contents);
			}
			return this.dialog;
		},
		selected: function(v){
			if(this.targetNode){
				// テキストボックスに選択された日付をセット
				this.targetNode.value = v;
				on.emit(this.targetNode, "selector", {
					bubbles: true,
					cancelable: true
				});
			}
			this.hide();
		},
		popup: function(node, area, contents){
			if(this.opend){
				popup.close(this.dialog);
			}
			this.opend = true;
			this.targetNode = node;
			popup.open({
				popup: this.getPoint(contents),
				around: node
			});
			if(area && !this.areaClickEventHandle){
				// ダイアログとテキストボックス以外の領域がクリックされたら閉じるようにする
				this.areaClickEventHandle = on.once(area, 'click', lang.hitch(this, this.hide));
			}
		},
		hide: function(){
			this.opend = false;
			this.targetNode = null;
			if(this.dialog){
				popup.close(this.dialog);
			}
			if(this.areaClickEventHandle){
				this.areaClickEventHandle.remove();
				this.areaClickEventHandle = null;
			}
		},
		destroy: function(){
			this.hide();
			if(this.dialog){
				this.dialog.destroyRecursive(true);
			}
			this.inherited(arguments);
		},
		getSelect: function(){
			var selects = query('select', this.dialog.domNode);
			return (selects.length ? selects[0] : null);
		},
		setContents: function(contents){
			var select = this.getSelect();
			if(select){
				domConstruct.empty(select);
				domConstruct.create('option', { innerHTML:'(なし)', value:'' }, select);
				array.forEach(contents, function(content){
					domConstruct.create('option', { innerHTML:content.name, value:content.value || content.name }, select);
				});
			}
		}
	}))();
});
