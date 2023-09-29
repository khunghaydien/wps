define([
	"dojo/_base/declare",
	"dojo/_base/json",
	"dojo/_base/array",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/query",
	"dojo/on",
	"dojo/string",
	"dojo/_base/lang",
	"tsext/service/Request",
	"tsext/dialog/Processing",
	"tsext/tsjtb/JtbData",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domStyle, domClass, query, on, str, lang, Request, Processing, JtbData, Util) {
	return declare("tsext.tsjtb.JtbObjList", [_WidgetBase, _TemplatedMixin], {
		constructor: function(){
			this.insts = [];
		},
		setParentView : function(p){
			this.parentView = p;
		},
		getDataType: function(){
			return '';
		},
		getInsts : function(){
			return this.insts;
		},
		getInst : function(index){
			return (index < this.insts.length ? this.insts[index] : null);
		},
		setInsts : function(insts){
			this.insts = insts;
		},
		addInst : function(inst){
			this.insts.push(inst);
		},
		getTravelNo : function(){
			return this.parentView.getTravelNo();
		},
		startup: function(){
			this.inherited(arguments);
			this.own(
				on(query('.tsext-jtb-insert', this.domNode)[0], 'click', lang.hitch(this, this.onInsert)),
				on(query('.tsext-jtb-delete', this.domNode)[0], 'click', lang.hitch(this, this.onDelete)),
				on(query('.tsext-jtb-copy'  , this.domNode)[0], 'click', lang.hitch(this, this.onCopy)),
				on(this.getAllCheckbox()  , 'click', lang.hitch(this, this.onAllCheck))
			);
			this.buildList();
		},
		destroy : function(){
			this.inherited(arguments);
		},
		showError: function(errmsg){
			var els = query('div.tsext-error', this.domNode);
			if(els.length){
				var el = els[0];
				domConstruct.empty(el);
				domConstruct.create('div', { innerHTML: (errmsg ? 'ERROR: ' : '') + errmsg }, el);
				domStyle.set(el, 'display', (errmsg ? '' : 'none'));
			}
		},
		blockUI: function(flag, finish){
		},
		getAllCheckbox : function(){
			return query('table.tsext-jtb-head input[type="checkbox"]', this.domNode)[0];
		},
		onAllCheck: function(){
			var checked = this.getAllCheckbox().checked;
			query('.tsext-jtb-table-box tbody input[type="checkbox"]', this.domNode).forEach(function(el){
				el.checked = checked;
			}, this);
		},
		onInsert: function(){
		},
		openEdit: function(index){
		},
		onDelete: function(){
			var indexes = this.getCheckedIndexes();
			if(indexes.length){
				indexes = indexes.sort(function(a, b){
					return (a - b);
				});
				for(var i = indexes.length - 1 ; i >= 0 ; i--){
					this.insts.splice(indexes[i], 1);
				}
				this.buildList();
			}
		},
		onCopy: function(e){
			var indexes = this.getCheckedIndexes();
			if(indexes.length > 0){
				if(indexes.length > 1){
					var messageArea = query('#tsext-jtb-message')[0];
					messageArea.innerText = 'コピーは1件ずつ行ってください';
					return;
				}
				this.copyInst(indexes[0]);
				this.buildList();
			}
		},
		copyInst: function(index){
			this.insts.push(this.insts[index].clone());
		},
		getCheckedIndexes: function(){
			var indexes = [];
			query('.tsext-jtb-table-box tbody input[type="checkbox"]:checked', this.domNode).forEach(function(el){
				var row = Util.getAncestorByTagName(el, 'TR');
				var index = parseInt(domAttr.get(row, 'objIndex'), 10);
				indexes.push(index);
			}, this);
			return indexes;
		},
		refresh: function(){
		},
		buildList: function(){
			array.forEach(this.eventHandles || [], function(eventHandle){
				eventHandle.remove();
			});
			this.eventHandles = [];
			this.getAllCheckbox().checked = false;
			var tbody = query('.tsext-jtb-table-area tbody', this.domNode)[0];
			domConstruct.empty(tbody);
			var siz = Math.max(6, this.insts.length);
			for(var i = 0 ; i < siz ; i++){
				var tr = domConstruct.create('tr', { className:'tsext-row-' + (i%2?'odd':'even') }, tbody);
				var obj = (i < this.insts.length ? this.insts[i] : null);
				var td1 = domConstruct.create('td', { style:'width:24px;' }, tr);
				var td2 = domConstruct.create('td', { style:'width:50px;' }, tr);
				var td3 = domConstruct.create('td', { style:'width:auto;text-align:left;' }, tr);
				if(!obj){
					domConstruct.create('div', { innerHTML:'&nbsp;' }, td1);
				}else{
					domAttr.set(tr, 'objIndex', i);
					this.eventHandles.push(on(tr, 'click', lang.hitch(this, function(e){
						if(e.target.type && e.target.type == 'checkbox'){
						}else if(e.target.tagName && e.target.tagName.toLowerCase() == 'a'){
							var row = Util.getAncestorByTagName(e.target, 'TR');
							var index = domAttr.get(row, 'objIndex');
							this.openEdit(index);
						}else{
							var chks = query('input[type="checkbox"]', Util.getAncestorByTagName(e.target, 'TR'));
							if(chks && chks.length){
								chks[0].checked = !chks[0].checked;
							}
						}
					})));
					domConstruct.create('input', { type:'checkbox' }, td1);
					domConstruct.create('a', { innerHTML:'編集', href:'javascript:void(0);' }, td2);
					this.appendObjDivs(obj, td3);
				}
			}
		},
		appendObjDivs: function(obj, node){
		}
	});
});
