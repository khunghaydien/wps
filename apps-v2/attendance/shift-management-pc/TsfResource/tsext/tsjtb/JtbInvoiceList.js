define([
	"dojo/_base/declare",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/query",
	"dojo/on",
	"dojo/string",
	"dojo/_base/lang",
	"dojo/text!tsext/template/jtbInvoiceList.html",
	"tsext/service/Request",
	"tsext/tsjtb/JtbObjList",
	"tsext/tsjtb/JtbInvoice",
	"tsext/tsjtb/JtbInvoiceForm",
	"tsext/dialog/Processing",
	"tsext/tsjtb/JtbData",
	"tsext/util/Util"
], function(declare, json, array, dom, domConstruct, domAttr, domStyle, query, on, str, lang, template, Request, JtbObjList, JtbInvoice, JtbInvoiceForm, Processing, JtbData, Util) {
	return declare("tsext.tsjtb.JtbInvoiceList", [JtbObjList], {
		templateString: template,
		startup: function(){
			this.setInsts(JtbData.getInvoices());
			this.form = new JtbInvoiceForm();
			this.inherited(arguments);
		},
		getDataType: function(){
			return '請求';
		},
		onInsert: function(){
			// 請求追加
			var obj = {
				functionId   : 'JL',
				startDate    : Util.formatDate(JtbData.getStartDate(), 'YYYY/MM/DD'),
				operationNo  : JtbData.getOperationNo(), // 処理番号
				travelNo     : this.getTravelNo(),       // 旅行番号
				subNo        : '00',                     // 副番号
				locationCode : JtbData.getLocationCode(),// 企業コード
				userId       : JtbData.getJsNaviId(),    // 出張者ユーザーID
				applyUserId  : JtbData.getJsNaviId(),    // 申請者ユーザーID
				userName     : JtbData.getEmpName()      // 出張者社員名称
			};
			obj.endDate = obj.startDate;
			obj.yearMonth = '' + (Util.getYearMonth(obj.startDate) || '');
			this.form.show(new JtbInvoice(obj)).then(
				lang.hitch(this, function(inst){
					this.addInst(inst);
					this.buildList();
				})
			);
		},
		openEdit: function(index){
			// 請求編集
			this.form.show(this.getInst(index)).then(
				lang.hitch(this, function(){
					this.buildList();
				})
			);
		},
		refresh: function(){
			this.setInsts(JtbData.getInvoices());
			this.buildList();
		},
		buildList: function() {
			this.inherited(arguments);
			dom.byId('tsext-jtb-invoice-count').textContent = (this.insts.length || "0") + '件';
		},
		appendObjDivs: function(inst, node){
			domConstruct.create('div', { innerHTML:'予約機能ID: '	+ inst.get('functionId')    }, node);
			domConstruct.create('div', { innerHTML:'出発日: '		+ inst.get('startDate')     }, node);
			domConstruct.create('div', { innerHTML:'帰着日: '		+ inst.get('endDate')       }, node);
			domConstruct.create('div', { innerHTML:'利用先名称: '	+ inst.get('useName')       }, node);
			domConstruct.create('div', { innerHTML:'出発地: '		+ inst.get('startPlace')    }, node);
			domConstruct.create('div', { innerHTML:'到着地: '		+ inst.get('endPlace')      }, node);
			domConstruct.create('div', { innerHTML:'請求予定金額: '	+ inst.get('invoiceAmount') }, node);
			domConstruct.create('div', { innerHTML:'ステータス: '	+ inst.get('status')        }, node);
		}
	});
});
