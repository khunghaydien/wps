define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/query",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dijit/Dialog",
	"tsext/service/Request",
	"dojo/text!tsext/leave/DialogConfigHistory.html",
	"tsext/util/Util"
], function(declare, lang, json, array, query, on, Deferred, dom, domConstruct, domAttr, domClass, domStyle, Dialog, Request, template, Util) {
	return declare("tsext.leave.DialogConfigHistory", null, {
		constructor : function(){
			this.emp = null;
		},
		show : function(emp) {
			this.emp = emp;
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: "勤怠設定履歴",
				content: template
			});
			this.dialog.own(
				on(this.dialog, 'cancel', lang.hitch(this, this.onClose)),
				on(query('.tsext-c-cancel', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onClose))
			);
			this.init();
			this.dialog.show();
			return this.deferred.promise;
		},
		init : function(){
			var chs = this.emp.getConfigHistorys();
			var area = query('div.tsext-config-history', this.dialog.domNode)[0];
			domConstruct.empty(area);
			var table = domConstruct.create('table', null, area);
			var thead = domConstruct.create('thead', null, table);
			var tr = domConstruct.create('tr', null, thead);
			domConstruct.create('th', { innerHTML:'開始日'             }, tr);
			domConstruct.create('th', { innerHTML:'終了日'             }, tr);
			domConstruct.create('th', { innerHTML:'勤務体系名'         }, tr);
			domConstruct.create('th', { innerHTML:'基準時間<br/>(日数管理)' }, tr);
			domConstruct.create('th', { innerHTML:'基準時間<br/>(年次有給)' }, tr);
			var tbody = domConstruct.create('tbody', null, table);
			array.forEach(chs.getAll(), function(ch){
				var tr = domConstruct.create('tr', null, tbody);
				domConstruct.create('div', { innerHTML:ch.getStartDate()   }, domConstruct.create('td', { style:'text-align:center;' }, tr));
				domConstruct.create('div', { innerHTML:ch.getEndDate()     }, domConstruct.create('td', { style:'text-align:center;' }, tr));
				domConstruct.create('a', {
					innerHTML:ch.getEmpTypeName(),
					href: tsCONST.empTypeEditView + '?empTypeId=' + ch.getEmpTypeId(),
					target: '_blank'
				}, domConstruct.create('td', { style:'text-align:left;'   }, tr));
				domConstruct.create('div', { innerHTML:ch.getBaseTimeForStockHMM() }, domConstruct.create('td', { style:'text-align:right;'  }, tr));
				domConstruct.create('div', { innerHTML:ch.getBaseTimeHMM()         }, domConstruct.create('td', { style:'text-align:right;'  }, tr));
			}, this);
		},
		onClose : function(){
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
		}
	});
});
