define([
	"dojo/_base/declare",
	"dojo/_base/json",
	"dojo/_base/array",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/query",
	"dojo/on",
	"dojo/string",
	"dojo/_base/lang",
	"dojo/text!tsext/template/checkTable.html",
	"tsext/service/Request",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domClass, domStyle, query, on, str, lang, template, Request, Util) {
	return declare("tsext.widget.CheckTable", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(tableObj, checkedEvent, opt){
			this.tableObj = tableObj;
			this.checkedEvent = checkedEvent;
			this.sortKeys = [{key:'Name',desc:false}];
			this.MIN_ROWS = (opt && opt.minRows) || 4;
			this.SCROLL_BAR_WIDTH = 17;
			this.CHECK_CELL_WIDTH = 24;
		},
		placeAt: function(){
			this.inherited(arguments);
			this.startup();
		},
		startup: function(){
			this.inherited(arguments);
		},
		destroy: function(){
			array.forEach(this.headHandles || [], function(headHandle){
				headHandle.remove();
			});
			array.forEach(this.bodyHandles || [], function(bodyHandle){
				bodyHandle.remove();
			});
		},
		showError: function(errmsg){
		},
		buildTable: function(){
			array.forEach(this.headHandles || [], function(headHandle){
				headHandle.remove();
			});
			this.headHandles = [];
			// ヘッダ部
			var thead = query('.tsext-check-table-area thead', this.domNode)[0];
			domConstruct.empty(thead);
			var tr = domConstruct.create('tr', null, thead);

			var th = domConstruct.create('th', { className: 'tsext-check' }, tr);
			var el = domConstruct.create('input', { type: 'checkbox' }, th);
			this.headHandles.push(on(el, 'click', lang.hitch(this, this.checkAll)));
			var w = this.CHECK_CELL_WIDTH;
			array.forEach(this.tableObj.heads || [], function(head){
				th = domConstruct.create('th', { className: 'tsext-sortable head-' + (head.apiKey || '') }, tr);
				domStyle.set(th, 'width', head.width + 'px');
				var hdiv = domConstruct.create('div', null, th);
				domConstruct.create('div', { innerHTML: (head.name || head.apiKey) }, hdiv);
				domConstruct.create('div', { className: 'tsext-sort' }, hdiv);
				w += head.width;
			});
			domConstruct.create('th', { style:'width:' + this.SCROLL_BAR_WIDTH + 'px;' }, tr);
			domStyle.set(query('.tsext-check-table-area', this.domNode)[0], 'width', (w + this.SCROLL_BAR_WIDTH + 2) + 'px');
			domStyle.set(query('.tsext-check-table-area > div', this.domNode)[0], 'height', (21 * this.MIN_ROWS + 1) + 'px'); // データ領域高さ

			query('th.tsext-sortable', tr).forEach(function(el){
				this.headHandles.push(on(el, 'click', lang.hitch(this, this.clickSort)));
			}, this);

			this.buildBody();
		},
		buildBody: function(flag){
			var objIds = (flag ? this.getObjIds(true) : []);
			array.forEach(this.bodyHandles || [], function(bodyHandle){
				bodyHandle.remove();
			});
			this.bodyHandles = [];
			// ボディ部
			var tbody = query('.tsext-check-table-area > div > table > tbody', this.domNode)[0];
			domConstruct.empty(tbody);
			var values = this.tableObj.values || [];
			var cnt = Math.max(values.length, this.MIN_ROWS);
			for(var i = 0 ; i < cnt ; i++){
				var value = (i < values.length ? values[i] : null);
				var tr = domConstruct.create('tr', {
					className: ((i%2)==0 ? 'tsext-row-even' : 'tsext-row-odd'),
					style    : 'cursor:' + (value ? 'pointer' : 'default'),
					data     : (value ? value.Id : '')
				}, tbody);
				var td = domConstruct.create('td', { className: 'tsext-check', style:'width:24px;' }, tr);
				if(value && !value.nocheck){
					var chk = domConstruct.create('input', { type: 'checkbox', name: 'rowSelect' }, td);
					if(flag && objIds.indexOf(value.Id) >= 0){
						chk.checked = true;
					}
				}
				array.forEach(this.tableObj.heads || [], function(head){
					var td = domConstruct.create('td', { className:'body-value', style:str.substitute('text-align:${0};', [head.align]) }, tr);
					domStyle.set(td, 'width', head.width + 'px');
					if(head.link){
						var id = Util.parseValue(value, 'Id');
						if(id){
							domConstruct.create('a', {
								href:tsCONST.empTypeEditView + str.substitute("?empTypeId=${0}&retURL=${1}", [id, encodeURIComponent(tsCONST.configView)]),
								innerHTML: 'LINK',
								target: '_blank'
							}, domConstruct.create('div', null, td));
						}
					}else{
						domConstruct.create('div', { innerHTML: Util.parseValue(value, head.apiKey) || '&nbsp;' }, td);
					}
				}, this);
				// 行クリックでチェックされるようにする
				this.bodyHandles.push(on(tr, 'click', lang.hitch(this, function(e){
					if(e.target.tagName == 'A'){
						return;
					}
					if(!e.target.type || e.target.type != 'checkbox'){
						var chks = query('input[type="checkbox"]', Util.getAncestorByTagName(e.target, 'TR'));
						if(chks && chks.length && !chks[0].disabled){
							chks[0].checked = !chks[0].checked;
							if(this.checkedEvent){
								this.checkedEvent();
							}
						}
					}else if(this.checkedEvent){
						this.checkedEvent();
					}
				})));
			}
		},
		setValues: function(values, flag){
			this.tableObj.values = values;
			this.changeSort();
			this.buildBody(flag);
			this.markingSort();
		},
		addValues: function(values){
			var objIds = this.getObjIds();
			array.forEach(values, function(value){
				if(objIds.indexOf(value.Id) < 0){
					this.tableObj.values.push(value);
				}
			}, this);
			this.changeSort();
			this.buildBody();
		},
		clearValues: function(){
			this.tableObj.values = [];
			this.buildBody();
		},
		checkAll: function(e){
			var chk = query('.tsext-check-table-area thead input[type="checkbox"]', this.domNode)[0];
			query('.tsext-check-table-area > div > table > tbody input[type="checkbox"]', this.domNode).forEach(function(el){
				el.checked = chk.checked;
			}, this);
			if(this.checkedEvent){
				this.checkedEvent();
			}
		},
		removeCheckedRow: function(){
			var objIds = this.getObjIds(true);
			var values = this.tableObj.values || [];
			for(var i = values.length - 1 ; i >= 0 ; i--){
				if(objIds.indexOf(values[i].Id) >= 0){
					values.splice(i, 1);
				}
			}
			this.buildBody();
		},
		isSortable: function(){
			var chks = query('.tsext-check-table-area th input', this.domNode);
			return (!chks || !chks.length || !chks[0].disabled);
		},
		clickSort: function(e){
			var th = Util.getAncestorByTagName(e.target, 'TH');
			if(!th){
				return;
			}
			if(!this.isSortable()){
				return;
			}
			var m = /head-([^ ]+)/.exec(th.className);
			if(!m || m.length <= 1){
				return;
			}
			var key = m[1];
			var sortKey = null;
			for(var index = 0 ; index < this.sortKeys.length ; index++){
				if(this.sortKeys[index].key == key){
					sortKey = this.sortKeys[index];
					break;
				}
			}
			if(sortKey && !index){
				this.sortKeys[0].desc = !this.sortKeys[0].desc;
			}else{
				if(index > 0){
					this.sortKeys.splice(index, 1);
				}
				this.sortKeys.unshift({ key: key, desc: false });
			}
			this.changeSort();
			this.buildBody(true);
			this.markingSort();
		},
		changeSort: function(){
			this.tableObj.values = this.tableObj.values.sort(lang.hitch(this, function(a, b){
				var o = null;
				for(var i = 0 ; i < this.sortKeys.length ; i++){
					o = this.sortKeys[i];
					if(a[o.key] != b[o.key]){
						break;
					}
				}
				return (a[o.key] <= b[o.key] ? -1 : 1) * (o.desc ? (-1) : 1);
			}));
		},
		markingSort: function(){
			var sortKeys = this.sortKeys || [];
			var key = (sortKeys.length ? sortKeys[0].key : null);
			query('.tsext-check-table-area th.tsext-sortable', this.domNode).forEach(function(el){
				var n = query('div.tsext-sort', el)[0];
				if(key && domClass.contains(el, 'head-' + key)){
					domClass.toggle(n, 'tsext-sort-asc' , !sortKeys[0].desc);
					domClass.toggle(n, 'tsext-sort-desc',  sortKeys[0].desc);
				}else{
					domClass.toggle(n, 'tsext-sort-asc' , false);
					domClass.toggle(n, 'tsext-sort-desc', false);
				}
			}, this);
		},
		getObjs: function(checked){
			var objIds = this.getObjIds(checked);
			var values = [];
			array.forEach(this.tableObj.values || [], function(value){
				if(objIds.indexOf(value.Id) >= 0){
					values.push(value);
				}
			}, this);
			return values;
		},
		getObjIds: function(checked){
			var selector = '.tsext-check-table-area > div input[type="checkbox"]';
			if(checked){
				selector += ':checked';
			}
			var ids = [];
			query(selector, this.domNode).forEach(function(el){
				var tr = Util.getAncestorByTagName(el, 'TR');
				if(tr){
					ids.push(domAttr.get(tr, 'data'));
				}
			});
			return ids;
		}
	});
});
