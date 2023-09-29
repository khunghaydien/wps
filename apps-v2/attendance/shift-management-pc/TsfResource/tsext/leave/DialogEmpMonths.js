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
	"dojo/text!tsext/leave/DialogEmpMonths.html",
	"tsext/util/Util"
], function(declare, lang, json, array, query, on, Deferred, dom, domConstruct, domAttr, domClass, domStyle, Dialog, Request, template, Util) {
	return declare("tsext.leave.DialogEmpMonths", null, {
		constructor : function(){
			this.emp = null;
		},
		show : function(emp) {
			this.emp = emp;
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: "勤怠月次情報",
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
			var months = this.emp.getEmpMonths();
			var area = query('div.tsext-emp-months', this.dialog.domNode)[0];
			domConstruct.empty(area);
			var table = domConstruct.create('table', null, area);
			var thead = domConstruct.create('thead', null, table);
			var tr = domConstruct.create('tr', null, thead);
			domConstruct.create('th', { innerHTML:'月度'       }, tr);
			domConstruct.create('th', { innerHTML:'開始日'     }, tr);
			domConstruct.create('th', { innerHTML:'終了日'     }, tr);
			domConstruct.create('th', { innerHTML:'勤務体系名' }, tr);
			domConstruct.create('th', { innerHTML:'勤怠月次'   }, tr);
			var tbody = domConstruct.create('tbody', null, table);
			array.forEach(months.getAll(), function(month){
				var tr = domConstruct.create('tr', null, tbody);
				domConstruct.create('a', {
					innerHTML: month.getYearMonth(),
					href: tsCONST.workTimeView + '?empId=' + this.emp.getId() + '&month=' + month.getYearMonth() + '&subNo=' + month.getSubNo() + '&mode=edit',
					target: '_blank'
				}, domConstruct.create('td', { style:'text-align:center;' }, tr));
				domConstruct.create('div', { innerHTML:month.getStartDate()   }, domConstruct.create('td', { style:'text-align:center;' }, tr));
				domConstruct.create('div', { innerHTML:month.getEndDate()     }, domConstruct.create('td', { style:'text-align:center;' }, tr));
				domConstruct.create('a', {
					innerHTML:month.getEmpTypeName(),
					href: tsCONST.empTypeEditView + '?empTypeId=' + month.getEmpTypeId(),
					target: '_blank'
				}, domConstruct.create('td', { style:'text-align:left;'   }, tr));
				domConstruct.create('div', { innerHTML:month.existEmpMonth()  }, domConstruct.create('td', { style:'text-align:center;' }, tr));
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
