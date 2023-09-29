define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/dom",
	"dojo/query",
	"dojo/dom-style",
	"dojo/dom-construct",
	"dojo/text!tsext/template/jtbDummyMenu.html",
	"tsext/tsjtb/JtbData",
	"tsext/service/Request",
	"tsext/util/Util"
], function(declare, lang, json, array, dom, query, domStyle, domConstruct, template, JtbData, Request, Util){
	return declare("tsext.view.JtbDummyMenu", null, {
		constructor : function(bodyId){
			this.bodyId = bodyId;
			var bodyObj = dom.byId(bodyId);
			bodyObj.innerHTML = template;
			var req = {
				method: 'loadJsNaviDummy',
				id    : null,
				mode  : 'read'
			};
			Request.actionA(tsCONST.API_JTB_ACTION, req, true).then(
				lang.hitch(this, function(result){
					JtbData.setRecord(result);
					this.fetchExpPreApplys(bodyObj);
				}),
				lang.hitch(this, function(errmsg){
					this.showError(errmsg);
				})
			);
		},
		getArea: function(){
			return query('div.tsext-menu', dom.byId(this.bodyId))[0];
		},
		showError: function(errmsg){
			domStyle.set(this.getArea(), 'display', '');
			var els = query('div.tsext-error', dom.byId(this.bodyId));
			if(els.length){
				var el = els[0];
				domConstruct.empty(el);
				domConstruct.create('div', { innerHTML: (errmsg ? 'ERROR: ' : '') + errmsg }, el);
				domStyle.set(el, 'display', (errmsg ? '' : 'none'));
			}
		},
		fetchExpPreApplys: function(bodyObj){
			var soql = "select Id, Name, ExpPreApplyNo__c, PlannedAmount__c, Type__c, EmpId__r.Name, StatusD__c"
				+ ", (select Id, Name from Attachments) from AtkExpPreApply__c where Type__c = '出張・交通費'";
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					this.buildExpPreApplyList(bodyObj, records);
					var area = this.getArea();
					domStyle.set(area, 'display', '');
					Util.fadeInOut(true, { node:area });
				}),
				lang.hitch(this, function(errmsg){
					this.showError(errmsg);
				})
			);
		},
		buildExpPreApplyList: function(bodyObj, records){
			console.log(JtbData.getCommon());
			var tbody = query('table.tsext-jtb-allList tbody', bodyObj)[0];
			var r = 0;
			var tr = domConstruct.create('tr', { className:'tsext-row-' + ((r++%2)?'odd':'even') }, tbody);
			domConstruct.create('a', { href:'#!compo', innerHTML:'(なし)' }, domConstruct.create('td', null, tr));
			domConstruct.create('td', { innerHTML: '' }, tr);
			domConstruct.create('td', { innerHTML: '' }, tr);
			domConstruct.create('td', { innerHTML: '' }, tr);
			domConstruct.create('td', { innerHTML: '' }, tr);
			domConstruct.create('a', {
				href:'/' + JtbData.getAttachParentId(),
				innerHTML:'[標準]',
				target:'_blank'
			}, domConstruct.create('td', { style:'text-align:center;' }, tr));
			var td = domConstruct.create('td', { innerHTML: '' }, tr);
			if(JtbData.getAttachId()){
				domConstruct.create('a', {
					href:'/' + JtbData.getAttachId(),
					innerHTML:'[添付]',
					target:'_blank'
				}, td);
			}
			array.forEach(records, function(record){
				tr = domConstruct.create('tr', { className:'tsext-row-' + ((r++%2)?'odd':'even') }, tbody);
				domConstruct.create('a', { href:'#!compo!id:' + record.Id, innerHTML:'P' + record.ExpPreApplyNo__c }, domConstruct.create('td', null, tr));
				domConstruct.create('a', {
					href:tsCONST.expPreApplyView + '?id=' + record.Id,
					innerHTML:record.Name,
					target:'_blank'
				}, domConstruct.create('td', null, tr));
				domConstruct.create('td', { innerHTML: record.EmpId__r.Name }, tr);
				domConstruct.create('td', { innerHTML: Util.formatMoney(record.PlannedAmount__c), style:'text-align:right;' }, tr);
				domConstruct.create('td', { innerHTML: record.StatusD__c, style:'text-align:center;' }, tr);
				domConstruct.create('a', {
					href:'/' + record.Id,
					innerHTML:'[標準]',
					target:'_blank'
				}, domConstruct.create('td', { style:'text-align:center;' }, tr));
				var td = domConstruct.create('td', { innerHTML: '' }, tr);
				var attachs = record.Attachments || [];
				var attachName = JtbData.getAttachmentNameFormat().replace('{0}', 'P'+record.ExpPreApplyNo__c);
				for(var i = 0 ; i < attachs.length ; i++){
					var a = attachs[i];
					if(a.Name == attachName){
						domConstruct.create('a', {
							href:'/' + a.Id,
							innerHTML:'[添付]',
							target:'_blank'
						}, td);
						break;
					}
				}
			}, this);
		},
		destroyRecursive : function(){
		}
	});
});
