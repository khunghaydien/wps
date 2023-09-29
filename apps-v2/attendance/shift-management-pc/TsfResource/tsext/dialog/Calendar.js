define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/query",
	"dojo/on",
	"dojo/text!tsext/template/calendar.html",
	"dijit/TooltipDialog",
	"dijit/Calendar",
	"dijit/popup"
], function(declare, lang, domConstruct, domStyle, query, on, template, TooltipDialog, Calendar, popup) {
	return new (declare("tsext.dialog.Calendar", null, {
		constructor: function(){
			this.dialog = null;
			this.calendar = null;
			this.opend = false;
			this.blockSet = false;
			this.targetNode = null;
			this.areaClickEventHandle = null;
		},
		getPoint: function(){
			if(!this.dialog){
				this.dialog = new TooltipDialog({
					title: "",
					content: template,
					onClick  : function(e){
						// クリックイベントを親ウィンドウへ伝播させない
						e.preventDefault();
						e.stopPropagation();
					},
					onKeyPress :lang.hitch(this, function(e){
						if(e.keyCode === 27){
							this.hide();
						}
					})
				});
				this.dialog.own(
					// ダイアログを開いた時
					on(this.dialog, 'open', lang.hitch(this, function(){
						var node = query('div.tsext-calendar', this.domNode)[0];
						if(!this.calendar){
							this.calendar = new Calendar({ onValueSelected: lang.hitch(this, this.selected) }, node);
							this.calendar.startup();
						}
						this.blockSet = true;
						if(this.targetNode && this.targetNode.value){
							// テキストボックスの日付をカレンダーの初期値にする
							var d = moment(this.targetNode.value, 'YYYY/MM/DD');
							this.calendar.set('value', (d && d.isValid() ? d.toDate() : (new Date())));
						}else{
							this.calendar.set('value', new Date());
						}
					})),
					on(query('input[type="button"]', this.dialog.domNode)[0], 'click', lang.hitch(this, this.hide))
				);
				this.dialog.startup();
			}
			return this.dialog;
		},
		selected: function(d){
			if(!this.blockSet){
				if(this.targetNode){
					// テキストボックスに選択された日付をセット
					this.targetNode.value = moment(d).format('YYYY/MM/DD');
					on.emit(this.targetNode, "calendar", {
						bubbles: true,
						cancelable: true
					});
				}
				this.hide();
			}
			this.blockSet = false;
		},
		popup: function(node, area){
			if(this.opend){
				popup.close(this.dialog);
			}
			this.opend = true;
			this.targetNode = node;
			popup.open({
				popup: this.getPoint(),
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
			if(this.calendar){
				this.calendar.destroyRecursive(true);
			}
			if(this.dialog){
				this.dialog.destroyRecursive(true);
			}
			this.inherited(arguments);
		}
	}))();
});
