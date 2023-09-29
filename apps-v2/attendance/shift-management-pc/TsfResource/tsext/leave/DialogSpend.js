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
	"dojo/text!tsext/leave/DialogSpend.html",
	"tsext/util/Util"
], function(declare, lang, json, array, query, on, Deferred, dom, domConstruct, domAttr, domClass, domStyle, Dialog, Request, Wait, Calendar, template, Util) {
	return declare("tsext.leave.DialogSpend", null, {
		constructor : function(d){
			this.emp = null;
			this.manageName = null;
			this.empStock = null;
			this.initDate = d;
		},
		show : function(emp, manageName, empStock) {
			this.emp = emp;
			this.manageName = manageName;
			this.empStock = empStock;
			this.deferred = new Deferred();
			this.dialog = new Dialog({
				title: "消化",
				content: template
			});
			this.dialog.own(
				on(this.dialog, 'cancel', lang.hitch(this, this.onCancel)),
				on(query('.tsext-c-ok'    , this.dialog.domNode)[0], 'click', lang.hitch(this, this.onOk    )),
				on(query('.tsext-c-cancel', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onCancel)),
				on(query('input[type="radio"].holyrange', this.dialog.domNode), 'click', lang.hitch(this, this.checkedHolyRange)),
				on(dom.byId('spendStartDate'), 'click', lang.hitch(this, function(e){
					e.preventDefault();
					e.stopPropagation();
					Calendar.popup(e.target, dom.byId(tsCONST.TOP_AREA_ID));
				})),
				on(dom.byId('spendEndDate'), 'click', lang.hitch(this, function(e){
					e.preventDefault();
					e.stopPropagation();
					Calendar.popup(e.target, dom.byId(tsCONST.TOP_AREA_ID));
				})),
				on(dom.byId('spendStartDate'), 'calendar', lang.hitch(this, this.safeSpendDate)),
				on(dom.byId('spendEndDate'  ), 'calendar', lang.hitch(this, this.safeSpendDate)),
				on(dom.byId('spendStartDate'), 'change'  , lang.hitch(this, this.safeSpendDate)),
				on(dom.byId('spendEndDate'  ), 'change'  , lang.hitch(this, this.safeSpendDate)),
				on(dom.byId('spendBaseTime') , 'change'  , lang.hitch(this, this.blurBaseTime)),
				on(dom.byId('spendBaseTime') , 'change'  , lang.hitch(this, this.showSpendTimeDays)),
				on(dom.byId('spendTime')     , 'change'  , lang.hitch(this, this.blurBaseTime)),
				on(dom.byId('spendTime')     , 'change'  , lang.hitch(this, this.showSpendTimeDays)),
				on(dom.byId('manualLink')    , 'click'   , lang.hitch(this, this.checkedManual)),
				on(query('input.detail_days', this.dialog.domNode), 'change', lang.hitch(this, this.blurLinkDays)),
				on(query('input.detail_time', this.dialog.domNode), 'change', lang.hitch(this, this.blurLinkTime))
			);
			this.init();
			this.dialog.show();
			return this.deferred.promise;
		},
		init: function(){
			if(!this.empStock){
				var bt = '8:00';
				if(this.initDate){
					var ch = this.emp.getConfigByDate(moment(this.initDate, 'YYYY/MM/DD').format('YYYY-MM-DD'));
					bt = ch.getBaseTimeForStockHMM();
				}
				dom.byId('spendBaseTime').value = bt;
				dom.byId('spendHolyAll').checked = true;
				dom.byId('spendStartDate').value = this.initDate || '2019/04/01';
				dom.byId('spendEndDate').value   = this.initDate || '2019/04/01';
				dom.byId('spendDays').value = '';
				dom.byId('spendTime').value = '';
				dom.byId('spendDescript').value = '';
			}else{
				var bt = this.empStock.getBaseTime();
				var holyRange = this.empStock.getSpendType(true);
				var sd = moment(this.empStock.getDate(), 'YYYY-MM-DD').format('YYYY/MM/DD');
				var ed = sd;
				if(holyRange == 1){
					var n = Math.abs(this.empStock.getDays());
					ed = moment(ed, 'YYYY/MM/DD').add(n - 1, 'days').format('YYYY/MM/DD');
				}
				dom.byId('spendBaseTime').value = bt ? Util.formatTime(parseInt(bt, 10)) : '';
				dom.byId('spendStartDate').value = sd;
				dom.byId('spendEndDate').value   = ed;
				dom.byId('spendDays').value = this.empStock.getDays();
				dom.byId('spendTime').value = Util.formatTime(this.empStock.getMinutes());
				dom.byId('spendHolyAll' ).checked = (holyRange == 1);
				dom.byId('spendHolyHalf').checked = (holyRange == 2);
				dom.byId('spendHolyTime').checked = (holyRange == 3);
				dom.byId('spendDescript').value = this.empStock.getName();
			}
			domAttr.set('spendDays', 'disabled', true);
			this.checkedHolyRange();
			this.checkBaseTime();
			this.initManual();
			this.checkedManual();
		},
		initManual: function(e){
			var sd = moment(dom.byId('spendStartDate').value, 'YYYY/MM/DD');
			var provideStocks = this.emp.getProvideStocks();
			query('select.targetp', this.dialog.domNode).forEach(function(select){
				domConstruct.empty(select);
				domConstruct.create('option', { value:'', innerHTML:'' }, select);
				for(var i = 0 ; i < provideStocks.length ; i++){
					var stock = provideStocks[i];
					domConstruct.create('option', { value:stock.getId(), innerHTML:stock.getMark() }, select);
				}
			}, this);
			query('input.detail_days', this.dialog.domNode).forEach(function(el){
				el.value = '0';
			}, this);
			query('input.detail_time', this.dialog.domNode).forEach(function(el){
				el.value = '0:00';
			}, this);
			this.calcManualLinkTable();
		},
		checkedManual: function(e){
			var manual = dom.byId('manualLink').checked;
			query('select.targetp,input.detail_days,input.detail_time', this.dialog.domNode).forEach(function(el){
				domAttr.set(el, 'disabled', !manual);
			}, this);
		},
		blurBaseTime: function(e){
			e.target.value = Util.formatHourEx(e.target.value, Util.str2minutes(dom.byId('spendBaseTime').value)) || '';
			this.checkBaseTime();
			this.calcManualLinkTable();
		},
		blurLinkDays: function(e){
			var v = parseFloat(e.target.value);
			e.target.value = (isNaN(v) ? '' : v);
			this.calcManualLinkTable();
		},
		blurLinkTime: function(e){
			e.target.value = Util.formatHour(e.target.value) || '';
			this.calcManualLinkTable();
		},
		calcManualLinkTable: function(){
			var sum = 0;
			query('tr.detail_line', this.dialog.domNode).forEach(function(tr){
				sum += this.calcLinkDayAndTime(tr);
			}, this);
			query('div.detail_total', this.dialog.domNode).forEach(function(el){
				el.innerHTML = ' ' + (sum ? (new Decimal(sum)).toDecimalPlaces(5).toNumber() : '');
			}, this);
		},
		calcLinkDayAndTime: function(tr){
			var bt = Util.str2minutes(dom.byId('spendBaseTime').value) || 0;
			if(bt > 0){
				var days = parseFloat(query('input.detail_days', tr)[0].value || 0);
				var time = Util.str2minutes(query('input.detail_time', tr)[0].value) || 0;
				var n = (new Decimal(time)).div(bt).plus(days).toDecimalPlaces(5).toNumber();
				query('div.detail_conv', tr)[0].innerHTML = ' ' + n;
				return n;
			}
			return 0;
		},
		showSpendTimeDays: function(e){
			var bt = Util.str2minutes(dom.byId('spendBaseTime').value);
			var tm = Util.str2minutes(dom.byId('spendTime').value);
			if(typeof(bt) == 'number' && typeof(tm) == 'number' && bt && tm){
				dom.byId('spendTimeDays').innerHTML = ' ' + (new Decimal(tm)).div(bt).toDecimalPlaces(5).toNumber();
			}else{
				dom.byId('spendTimeDays').innerHTML = '';
			}
		},
		checkedHolyRange: function(){
			Calendar.hide();
			if(dom.byId('spendHolyAll').checked){
				domStyle.set('spendEndDateRow', 'display', '');
				domStyle.set('spendDaysRow'   , 'display', '');
				domStyle.set('spendTimeRow'   , 'display', 'none');
				this.safeSpendDate();
			}else if(dom.byId('spendHolyHalf').checked){
				domStyle.set('spendEndDateRow', 'display', 'none');
				domStyle.set('spendDaysRow'   , 'display', '');
				domStyle.set('spendTimeRow'   , 'display', 'none');
				dom.byId('spendDays').value = '0.5';
			}else{
				domStyle.set('spendEndDateRow', 'display', 'none');
				domStyle.set('spendDaysRow'   , 'display', 'none');
				domStyle.set('spendTimeRow'   , 'display', '');
			}
		},
		safeSpendDate: function(e){
			var YMD = 'YYYY/MM/DD';
			var sd = moment(dom.byId('spendStartDate').value, YMD);
			var ed = moment(dom.byId('spendEndDate'  ).value, YMD);
			if(e && e.target){
				if(e.target.id == 'spendStartDate' && sd.isValid()){
					if(!ed.isValid() || sd.isAfter(ed)){
						ed = sd.clone();
						dom.byId('spendEndDate').value = ed.format(YMD);
					}
				}else if(e.target.id == 'spendEndDate' && ed.isValid()){
					if(!sd.isValid() || sd.isAfter(ed)){
						sd = ed.clone();
						dom.byId('spendStartDate').value = sd.format(YMD);
					}
				}
			}
			if(sd.isValid() && ed.isValid()){
				dom.byId('spendDays').value = ed.diff(sd, 'days') + 1;
			}
			this.checkBaseTime();
		},
		checkBaseTime: function(e){
			var sd = moment(dom.byId('spendStartDate').value, 'YYYY/MM/DD');
			var inpBt = dom.byId('spendBaseTime').value;
			var getBt = inpBt;
			if(sd.isValid()){
				var ch = this.emp.getConfigByDate(sd.format('YYYY-MM-DD'));
				getBt = ch.getBaseTimeForStockHMM();
			}
			dom.byId('spendBaseTimeWarn').innerHTML = (getBt != inpBt) ? getBt : '';
		},
		onOk : function(){
			Calendar.hide();
			var bt = Util.str2minutes(dom.byId('spendBaseTime').value);
			var sd = moment(dom.byId('spendStartDate').value, 'YYYY/MM/DD');
			var ed = moment(dom.byId('spendEndDate'  ).value, 'YYYY/MM/DD');
			var param = {};
			param.spendBaseTime   = bt;
			param.spendStartDate = sd.format('YYYY-MM-DD');
			param.spendEndDate   = ed.format('YYYY-MM-DD');
			param.spendDays	     = Util.parseInt(dom.byId('spendDays').value);
			param.spendTime	     = Util.str2minutes(dom.byId('spendTime').value);
			if(dom.byId('spendHolyAll').checked){
				if(!param.spendDays){
					this.showError('日数を入力してください');
					return;
				}
				param.spendTime = 0;
			}else if(dom.byId('spendHolyHalf').checked){
				param.spendDays = 0.5;
				param.spendTime = 0;
			}else{
				if(!param.spendBaseTime){
					this.showError('基準時間を入力してください');
					return;
				}
				if(!param.spendTime){
					this.showError('時間を入力してください');
					return;
				}
				param.spendDays = 0;
			}
			if(bt && (bt % 30) != 0){
				this.showError('基準時間の最小単位は30分です');
				return;
			}
			var req = {
				action: 'operateEmpStock',
				empId: this.emp.getId(),
				manageName: this.manageName,
				operateType: 'spend',
				empStockId: (this.empStock ? this.empStock.getId() : null),
				description: dom.byId('spendDescript').value,
				param: param
			};
			Wait.show(true);
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
