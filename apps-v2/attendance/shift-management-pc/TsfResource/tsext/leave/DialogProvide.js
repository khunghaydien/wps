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
	"dojo/text!tsext/leave/DialogProvide.html",
	"tsext/util/Util"
], function(declare, lang, json, array, query, on, Deferred, dom, domConstruct, domAttr, domClass, domStyle, Dialog, Request, Wait, Calendar, template, Util) {
	return declare("tsext.leave.DialogProvide", null, {
		constructor : function(){
			this.emp = null;
			this.manageName = null;
			this.empStock = null;
		},
		show : function(emp, manageName, empStock) {
			this.emp = emp;
			this.manageName = manageName;
			this.empStock = empStock;
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: "付与",
				content: template
			});
			this.dialog.own(
				on(this.dialog, 'cancel', lang.hitch(this, this.onCancel)),
				on(query('.tsext-c-ok'    , this.dialog.domNode)[0], 'click', lang.hitch(this, this.onOk    )),
				on(query('.tsext-c-cancel', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onCancel)),
				on(dom.byId('provStartDate'), 'click', lang.hitch(this, function(e){
					e.preventDefault();
					e.stopPropagation();
					Calendar.popup(e.target, dom.byId(tsCONST.TOP_AREA_ID));
				})),
				on(dom.byId('provStartDate'), 'calendar', lang.hitch(this, this.changedStartDate)),
				on(dom.byId('provStartDate'), 'change'  , lang.hitch(this, this.changedStartDate)),
				on(dom.byId('provLimitDate'), 'click', lang.hitch(this, function(e){
					e.preventDefault();
					e.stopPropagation();
					Calendar.popup(e.target, dom.byId(tsCONST.TOP_AREA_ID));
				})),
				on(dom.byId('provProvideDate'), 'click', lang.hitch(this, function(e){
					e.preventDefault();
					e.stopPropagation();
					Calendar.popup(e.target, dom.byId(tsCONST.TOP_AREA_ID));
				})),
				on(dom.byId('provBaseTime'), 'change', lang.hitch(this, this.blurBaseTime)),
				on(dom.byId('provTime')    , 'change', lang.hitch(this, this.blurBaseTime))
			);
			this.init();
			this.dialog.show();
			return this.deferred.promise;
		},
		init: function(){
			if(!this.empStock){
				dom.byId('provBaseTime').value = '';
				dom.byId('provStartDate').value = '';
				dom.byId('provLimitDate').value = '';
				dom.byId('provProvideDate').value = moment().format('YYYY/MM/DD');
				dom.byId('provDays').value = '0';
				dom.byId('provTime').value = '0:00';
				dom.byId('provDescript').value = this.manageName + '付与';
			}else{
				var bt = this.empStock.getBaseTime();
				var sd = moment(this.empStock.getStartDate(), 'YYYY-MM-DD').format('YYYY/MM/DD');
				var ld = moment(this.empStock.getLimitDate(), 'YYYY-MM-DD').format('YYYY/MM/DD');
				dom.byId('provBaseTime').value = bt ? Util.formatTime(parseInt(bt, 10)) : '';
				dom.byId('provStartDate').value = sd;
				dom.byId('provLimitDate').value = ld;
				dom.byId('provProvideDate').value = moment(this.empStock.getProvideDate(), 'YYYY-MM-DD').format('YYYY/MM/DD');
				dom.byId('provDays').value = this.empStock.getDays();
				dom.byId('provTime').value = Util.formatTime(this.empStock.getMinutes());
				dom.byId('provDescript').value = this.empStock.getName();
			}
			this.checkBaseTime();
		},
		changedStartDate: function(e){
			this.checkBaseTime();
		},
		blurBaseTime: function(e){
			e.target.value = Util.formatHour(e.target.value) || '';
			this.checkBaseTime();
		},
		checkBaseTime: function(e){
			var sd = moment(dom.byId('provStartDate').value, 'YYYY/MM/DD');
			var inpBt = dom.byId('provBaseTime').value;
			var getBt = inpBt;
			if(sd.isValid()){
				var ch = this.emp.getConfigByDate(sd.format('YYYY-MM-DD'));
				getBt = ch.getBaseTimeForStockHMM();
			}
			dom.byId('provBaseTimeWarn').innerHTML = (getBt != inpBt) ? getBt : '';
		},
		onOk : function(){
			Calendar.hide();
			var bt = Util.str2minutes(dom.byId('provBaseTime').value);
			var sd = moment(dom.byId('provStartDate').value, 'YYYY/MM/DD');
			var ld = moment(dom.byId('provLimitDate').value, 'YYYY/MM/DD');
			var pd = moment(dom.byId('provProvideDate').value, 'YYYY/MM/DD');
			var param = {};
			param.provBaseTime    = bt;
			param.provStartDate   = sd.format('YYYY-MM-DD');
			param.provLimitDate   = ld.format('YYYY-MM-DD');
			param.provProvideDate = pd.format('YYYY-MM-DD');
			param.provDays	      = Util.parseInt(dom.byId('provDays').value);
			param.provTime	      = Util.str2minutes(dom.byId('provTime').value);
			if(this.manageName == '代休'){
				if(param.provTime > 0){
					this.showError('代休は時間単位に対応していません');
					return;
				}
				if(!(new Decimal(param.provDays)).times(2).isInt()){
					this.showError('代休は日数の端数に対応していません');
					return;
				}
			}
			if(!param.provDays && !param.provTime){
				this.showError('日数か時間を入力してください');
				return;
			}
			if(bt === null && param.provTime > 0){
				this.showError('時間を付与する時は基準時間は必須です');
				return;
			}
			if(bt && (bt % 30) != 0){
				this.showError('基準時間の最小単位は30分です');
				return;
			}
			if(this.empStock){
				var provN = param.provDays + (param.provTime > 0 ? (param.provTime / bt) : 0);
				if(provN < this.empStock.getConsumedDayHours()){
					this.showError('付与日数＜消化日数になる変更はできません');
					return;
				}
			}
			Wait.show(true);
			var req = {
				action: 'operateEmpStock',
				empId: this.emp.getId(),
				manageName: this.manageName,
				operateType: 'provide',
				empStockId: (this.empStock ? this.empStock.getId() : null),
				description: dom.byId('provDescript').value,
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
