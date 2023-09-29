define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/query",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dijit/Dialog",
	"dojo/text!tsext/template/empSearch.html",
	"tsext/dialog/Wait",
	"tsext/service/Request",
	"tsext/util/Util"
], function(declare, lang, json, array, query, on, Deferred, domConstruct, domAttr, domClass, domStyle, Dialog, template, Wait, Request, Util) {
	return declare("tsext.dialog.EmpSearch", null, {
		constructor : function(){
			this.sortKeys = [
			    { key: 'EmpCode__c', desc: false }
			];
			this.records = [];
		},
		show : function() {
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: "社員選択",
				content: template
			});
			on.once(this.dialog, 'cancel', lang.hitch(this, this.onCancel));
			on.once(query('.tsext-c-ok'    , this.dialog.domNode)[0], 'click', lang.hitch(this, this.onOk    ));
			on.once(query('.tsext-c-cancel', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onCancel));
			this.search(lang.hitch(this, function(flag, errmsg){
				if(flag){
					this.dialog.show();
				}else{
					this.deferred.reject(errmsg);
				}
			}));
			return this.deferred.promise;
		},
		onOk : function(){
			var emps = [];
			query('.tsext-table-area input[type="checkbox"]:checked', this.dialog.domNode).forEach(function(el){
				var n = Util.getAncestorByTagName(el, 'TR');
				if(n){
					emp = this.getRecordById(domAttr.get(n, 'data'));
					if(emp){
						emps.push(emp);
					}
				}
			}, this);
			this.deferred.resolve(emps);
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
		},
		buildTable: function(records){
			this.records = records;
			array.forEach(this.eventHandles || [], function(eventHandle){
				eventHandle.remove();
			});
			this.eventHandles = [];
			// ヘッダ部
			var thead = query('.tsext-table-area thead', this.dialog.domNode)[0];
			domConstruct.empty(thead);
			var tr = domConstruct.create('tr', null, thead);
			domConstruct.create('th', { className: 'tsext-checkbox' }, tr);
			var hdiv;
			hdiv = domConstruct.create('div', null, domConstruct.create('th', { className: 'head-EmpCode__c tsext-sortable' }, tr));
			domConstruct.create('div', { innerHTML: '社員コード' }, hdiv);
			domConstruct.create('div', { className: 'tsext-sort' }, hdiv);
			hdiv = domConstruct.create('div', null, domConstruct.create('th', { className: 'head-Name tsext-sortable' }, tr));
			domConstruct.create('div', { innerHTML: '社員名'     }, hdiv);
			domConstruct.create('div', { className: 'tsext-sort' }, hdiv);
			query('th.tsext-sortable', tr).forEach(function(el){
				this.eventHandles.push(on(el, 'click', lang.hitch(this, this.changeSort)));
			}, this);
			// ボディ部
			var tbody = query('.tsext-table-area > div > table > tbody', this.dialog.domNode)[0];
			domConstruct.empty(tbody);
			var cnt = Math.max(records.length, 8);
			for(var i = 0 ; i < cnt ; i++){
				var record = (i < records.length ? records[i] : null);
				var tr = domConstruct.create('tr', {
					className: ((i%2)==0 ? 'tsext-row-even' : 'tsext-row-odd'),
					style: 'cursor:' + (record ? 'pointer' : 'default'),
					data: (record ? record.Id : '')
				}, tbody);
				var td = domConstruct.create('td', { className: 'tsext-check' }, tr);
				if(record){
					var check = domConstruct.create('input', { type: 'checkbox', name: 'empSelect' }, td);
					domAttr.set(check, 'data', record.Id);
				}
				domConstruct.create('div', {
					innerHTML: (record ? (record.EmpCode__c || '') : '&nbsp;')
				}, domConstruct.create('td', { className: 'body-EmpCode__c' }, tr));
				domConstruct.create('div', {
					innerHTML: (record ? (record.Name || '') : '&nbsp;')
				}, domConstruct.create('td', { className: 'body-Name'       }, tr));
				// 行クリックでチェックされるようにする
				this.eventHandles.push(on(tr, 'click', lang.hitch(this, function(e){
					if(!e.target.type || e.target.type != 'checkbox'){
						var chks = query('input[type="checkbox"]', Util.getAncestorByTagName(e.target, 'TR'));
						if(chks && chks.length){
							chks[0].checked = !chks[0].checked;
						}
					}
				})));
			}
			this.setSortIcon();
		},
		changeSort: function(e){
			var n = Util.getAncestorByTagName(e.target, 'TH');
			if(!n){
				return;
			}
			var m = /head-([^ ]+)/.exec(n.className);
			if(!m || m.length <= 1){
				return;
			}
			var key = m[1];
			var sortKeys = this.sortKeys || [];
			var index = -1;
			for(var i = 0 ; i < sortKeys.length ; i++){
				if(sortKeys[i].key == key){
					index = i;
					break;
				}
			}
			if(index == 0){
				sortKeys[i].desc = !(sortKeys[i].desc);
			}else{
				if(index > 0){
					sortKeys.splice(index, 1);
				}
				sortKeys.unshift({ key: key, desc: false });
			}
			this.setSortIcon();
			this.search(lang.hitch(this, function(flag, errmsg){
				if(!flag){
					this.showError(errmsg);
				}
			}));
		},
		setSortIcon: function(){
			var sortKeys = this.sortKeys || [];
			var key = (sortKeys.length ? sortKeys[0].key : null);
			query('.tsext-table-area th.tsext-sortable', this.dialog.domNode).forEach(function(el){
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
		getRecordById: function(id){
			var records = this.records || [];
			for(var i = 0 ; i < records.length ; i++){
				if(records[i].Id == id){
					return records[i];
				}
			}
			return null;
		},
		search: function(callback){
			var soql = 'select Id, Name, EmpCode__c from AtkEmp__c';
			var sorts = new Array();
			array.forEach(this.sortKeys || [], function(sortKey){
				sorts.push(sortKey.key + (sortKey.desc ? ' desc' : ''));
			});
			sorts.push('Id');
			soql += ' order by ' + sorts.join(',');
			var req = {
				soql: soql,
				limit: 5000,
				offset: 0
			};
			Request.actionA(tsCONST.API_SEARCH_DATA, req).then(
				lang.hitch(this, function(result){
					this.buildTable(result.records);
					if(callback){
						callback(true);
					}
				}),
				lang.hitch(this, function(errmsg){
					if(callback){
						callback(false, errmsg);
					}
				})
			);
		},
		getTableAreaWidth: function(){
			return query('div.tsext-table-area', this.dialog.domNode)[0].offsetWidth;
		},
		showError: function(errmsg){
			query('div.tsext-dialog-error', this.dialog.domNode).forEach(function(el){
				domStyle.set(el, 'max-width', this.getTableAreaWidth() + 'px');
				domConstruct.empty(el);
				domConstruct.create('div', { innerHTML: (errmsg ? 'ERROR: ' : '') + errmsg }, el);
				domStyle.set(el, 'display', (errmsg ? '' : 'none'));
			}, this);
		}
	});
});
