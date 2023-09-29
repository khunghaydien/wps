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
	"dojo/query",
	"dojo/on",
	"dojo/string",
	"dojo/_base/lang",
	"dojo/text!tsext/template/deleteView.html",
	"tsext/service/Request",
	"tsext/dialog/EmpSearch",
	"tsext/dialog/Processing",
	"tsext/widget/CheckTable",
	"tsext/logic/DeleteLogic",
	"tsext/service/Agent",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domStyle, query, on, str, lang, template, Request, EmpSearch, Processing, CheckTable, DeleteLogic, Agent, Util) {
	return declare("tsext.view.DeleteView", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(){
			this.deleteLogic = new DeleteLogic();
			this.prefixNameMap = {};
		},
		placeAt: function(){
			this.inherited(arguments);
			this.startup();
		},
		startup: function(){
			this.inherited(arguments);
			this.own(
				on(dom.byId('tsextDelete'), 'click' , lang.hitch(this, this.deleteStart))
			);
			this.blockUI(true);
			var heads = [
				{ name:'社員コード', apiKey:'EmpCode__c'       , width:180, align:'left' },
				{ name:'社員名'    , apiKey:'Name'             , width:200, align:'left' },
				{ name:'勤務体系'  , apiKey:'EmpTypeId__r.Name', width:200, align:'left' }
			];
			this.empTable = new CheckTable({ heads: heads, values: [] });
			this.empTable.placeAt(query('div.tsext-form-emps', this.domNode)[0]);
			this.empTable.buildTable();
			this.outLog("'_'で始まる名前を検索", true);
			this.loadEmps();
		},
		destroy : function(){
			if(this.empTable){
				this.empTable.destroyRecursive();
				this.empTable = null;
			}
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
			query('.tsext-section input, .tsext-section select', this.domNode).forEach(function(el){
				domAttr.set(el, 'disabled', flag);
			}, this);
		},
		outLog: function(msg, flag){
			var textArea = query('.tsext-form-log textarea', this.domNode)[0];
			if(flag){
				textArea.value = '';
			}
			textArea.value += ((flag ? '' : '\n') + moment().format('YYYY/MM/DD HH:mm:ss') + ' ' +  (msg || ''));
			textArea.scrollTop = textArea.scrollHeight;
		},
		finished: function(result, errmsg){
			this.blockUI(false);
			if(!result){
				this.showError(errmsg);
			}
		},
		loadEmps: function(){
			this.deleteLogic.empSearch().then(
				lang.hitch(this, function(result){
					var values = [];
					array.forEach(result.records, function(record){
						values.push(record);
					}, this);
					this.empTable.addValues(values);
					this.deleteLogic.loadPrefixNames(
						0,
						this.prefixNameMap,
						this.outLog,
						lang.hitch(this, this.loadPrefixNames)
					);
				}),
				lang.hitch(this, this.showError)
			);
		},
		loadPrefixNames: function(succeed, errmsg){
			if(!succeed){
				this.showError(errmsg);
				this.blockUI(false);
				return;
			}
			var select = dom.byId('tsextPrefix');
			var prefixNames = Object.keys(this.prefixNameMap);
			var names = prefixNames.sort(function(a, b){
				return (a < b ? -1 : 1);
			});
			domConstruct.empty(select);
			array.forEach(names, function(name){
				domConstruct.create('option', { innerHTML: name, value: name }, select);
			}, this);
			this.outLog(names.join(','));
			this.blockUI(false);
		},
		deleteStart: function(){
			var prefix = dom.byId('tsextPrefix').value;
			if(!prefix){
				this.showError('プレフィックス名が指定されていません');
				return;
			}
//			if(!confirm('名前が"' + prefix + '"で始まるデータをすべて削除します。よろしいですか？')){
//				return;
//			}
			this.blockUI(true);
			this.deleteLogic.dataDelete(
				prefix,
				this.outLog,
				lang.hitch(this, function(succeed, errmsg){
					if(!succeed){
						this.showError(errmsg);
						this.blockUI(false);
					}else{
						this.prefixNameMap = {};
						this.empTable.clearValues();
						this.outLog("'_'で始まる名前を検索");
						this.loadEmps();
					}
				})
			);
		}
	});
});
