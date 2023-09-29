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
	"tsext/dialog/Wait",
	"tsext/dialog/Calendar",
	"dojo/text!tsext/leave/DialogMinus.html",
	"tsext/util/Util"
], function(declare, lang, json, array, query, on, Deferred, dom, domConstruct, domAttr, domClass, domStyle, Dialog, Request, Wait, Calendar, template, Util) {
	return declare("tsext.leave.DialogMinus", null, {
		constructor : function(){
			this.emp = null;
			this.manageName = null;
			this.empStocks = null;
		},
		show : function(emp, manageName, empStocks) {
			this.emp = emp;
			this.manageName = manageName;
			this.empStocks = empStocks;
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: "マイナス付与",
				content: template
			});
			this.dialog.own(
				on(this.dialog, 'cancel', lang.hitch(this, this.onCancel)),
				on(query('.tsext-c-ok'    , this.dialog.domNode)[0], 'click', lang.hitch(this, this.onOk    )),
				on(query('.tsext-c-cancel', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onCancel)),
				on(dom.byId('minusTime')    , 'change', lang.hitch(this, this.blurBaseTime))
			);
			this.init();
			this.dialog.show();
			return this.deferred.promise;
		},
		init: function(){
			dom.byId('minusDays').value = '0';
			dom.byId('minusTime').value = '0:00';
			dom.byId('minusDescript').value = '';
			var select = dom.byId('minusStocks');
			domConstruct.empty(select);
			domConstruct.create('option', {
				innerHTML: '(選択してください)',
				value: ''
			}, select);
			for(var i = 0 ; i < this.empStocks.getSize() ; i++){
				var empStock = this.empStocks.get(i);
				if(!empStock.isProvide() || empStock.getRemain() <= 0){
					continue;
				}
				domConstruct.create('option', {
//					innerHTML: empStock.toString(),
					innerHTML: empStock.getMark(),
					value: empStock.getId()
				}, select);
			}
		},
		blurBaseTime: function(e){
			e.target.value = Util.formatHour(e.target.value) || '';
		},
		onOk : function(){
			var empStockId = dom.byId('minusStocks').value;
			if(!empStockId){
				this.showError('マイナス対象付与を選択してください');
				return;
			}
			var param = {};
			param.minusDays	     = Util.parseInt(dom.byId('minusDays').value);
			param.minusTime	     = Util.str2minutes(dom.byId('minusTime').value);
			if(!param.minusDays && !param.minusTime){
				this.showError('日数か時間を入力してください');
				return;
			}
			Wait.show(true);
			var req = {
				action: 'operateEmpStock',
				empId: this.emp.getId(),
				manageName: this.manageName,
				operateType: 'minus',
				empStockId: empStockId,
				description: dom.byId('minusDescript').value,
				param: param
			};
			Request.actionA(
				tsCONST.API_GET_EXT_RESULT,
				req,
				true
			).then(
				lang.hitch(this, function(result){
					Wait.show(false);
					this.deferred.resolve();
					this.hide();
				}),
				lang.hitch(this, function(result){
					this.showError(result);
				})
			);
		},
		onCancel : function(){
			this.deferred.reject();
			this.hide();
		},
		hide : function(){
			Calendar.hide();
			if(this.dialog){
				this.dialog.hide().then(lang.hitch(this, function(){
					this.dialog.destroyRecursive();
					this.dialog = null;
				}));
			}
		},
		showError: function(errmsg){
			Wait.show(false);
			query('div.tsext-dialog-error', this.dialog.domNode).forEach(function(el){
				domConstruct.empty(el);
				domConstruct.create('div', { innerHTML: (errmsg ? 'ERROR: ' : '') + errmsg }, el);
				domStyle.set(el, 'display', (errmsg ? '' : 'none'));
			}, this);
		}
	});
});
