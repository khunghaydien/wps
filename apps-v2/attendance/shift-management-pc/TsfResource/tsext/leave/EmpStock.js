define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.leave.EmpStock", null, {
		constructor : function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			o.StartDate__c	   = Util.formatDate(o.StartDate__c);
			o.LimitDate__c	   = Util.formatDate(o.LimitDate__c);
			o.Date__c		   = Util.formatDate(o.Date__c);
			this.obj = o;
			this.details = [];
			this.parents = [];
			this.children = [];
			this.provides = [];
			this.mark = '';
			this.syncBaseTime = null;
		},
		getId               : function(){ return this.obj.Id; },
		getName             : function(){ return this.obj.Name; },
		getCreatedDate      : function(){ return this.obj.CreatedDate; },
		getLastModifiedDate : function(){ return this.obj.LastModifiedDate; },
		getType             : function(){ return this.obj.Type__c; },
		getDays             : function(){ return this.obj.Days__c || 0; },
		getHours            : function(){ return this.obj.Hours__c || 0; },
		getBaseTime         : function(){ return Util.dispNum(/*this.obj.CurrentBaseTime__c || */this.obj.BaseTime__c, null); },
		getBaseTimeHMM      : function(){ return this.getBaseTime() !== null ? Util.formatTime(this.getBaseTime()) : ''; },
		getDayType          : function(){ return this.obj.DayType__c || '0'; },
		isLostFlag          : function(){ return this.obj.LostFlag__c || false; },
		isProvide           : function(){ return (this.getDayHours() >= 0); },
		isSpend             : function(){ return (this.getDayHours() < 0);  },
		isSolo              : function(){ return (this.isSpend() && !this.parents.length) || (this.isProvide() && !this.children.length); },
		getStartDate        : function(){ return this.isProvide() ? this.obj.StartDate__c : ''; },
		getLimitDate        : function(){ return this.isProvide() ? this.obj.LimitDate__c : ''; },
		getCategory         : function(){ return this.isProvide() ? '付与' : (this.isSpend() ? '消化' : ''); },
		getProvideDays      : function(){ return this.isProvide() ? this.getDayHours() : ''; },
		getSpendDays        : function(){ return this.isSpend()   ? this.getDayHours() : ''; },
		getDate: function(){
			return (this.isSpend() ? (this.isLostFlag() && this.parents.length ? this.parents[0].stock.getStartDate() : this.obj.Date__c) : '');
		},
		getProvideDate      : function(){
			return this.isProvide() ? this.obj.Date__c : '';
		},
		getBaseDate: function(){
			return (this.isProvide() ? this.getStartDate() : this.getDate());
		},
		getRemain : function(flag){
			var n = this.obj.RemainDaysAndHours__c || 0;
			return (flag ? (new Decimal(n)).toDecimalPlaces(5).toNumber() : n);
		},
		getRemainByDate: function(d){
			if(this.isProvide() && this.getStartDate() <= d && d < this.getLimitDate()){
				return this.getRemain();
			}
			return 0;
		},
		getDayHours : function(flag){
			var n = this.getDays() + this.getHours();
			return (flag ? (new Decimal(n)).toDecimalPlaces(5).toNumber() : n);
		},
		getConsumedDayHours: function(flag){
			var n = (this.obj.ConsumedDays__c || 0) + (this.obj.ConsumedHours__c || 0);
			return (flag ? (new Decimal(n)).toDecimalPlaces(5).toNumber() : n);
		},
		getHoursHMM : function(){
			return Util.formatTime(this.getHours() * (this.getBaseTime() || 0));
		},
		getMinutes: function(){
			var m = Math.abs(this.obj.Hours__c || 0) * (this.getBaseTime() || 0);
			return Math.round(m);
		},
		getDayHoursMix : function(){
			if(this.details.length > 1){
				return Math.abs(this.getDayHours());
			}
			return '';
		},
		getDayHoursByProvide : function(provideStock, flag){
			var n = this.getDays() + this.getHours();
			if(!provideStock){
				return Math.abs(flag ? (new Decimal(n)).toDecimalPlaces(5).toNumber() : n);
			}
			for(var i = 0 ; i < this.details.length ; i++){
				var detail = this.details[i];
				if(detail.getConsumesStockId() == provideStock.getId()){
					return detail.getDayHours(flag);
				}
			}
			return 0;
		},
		getRemainDays: function(){
			var n = new Decimal(this.obj.RemainDaysAndHours__c);
			if(n.abs().toNumber() >= 0.5){
				var n = n.times(2).floor();
				return (n.isZero() ? 0 : n.div(2).toDecimalPlaces(5).toNumber());
			}else{
				return 0;
			}
		},
		getRemainHours: function(){
			var n = new Decimal(this.obj.RemainDaysAndHours__c);
			if(n.isPositive()){
				n = n.minus(this.getRemainDays());
			}else{
				n = n.plus(this.getRemainDays());
			}
			return (n.isPositive() ? '' : '-') + Util.formatTime(n.abs().times(this.getBaseTime() || 0).round().toNumber());
		},
		getDaysByProvide : function(provideStock){
			var n = (new Decimal(this.getDays())).plus(this.getHours());
			if(!provideStock){
				return n.abs();
			}
			for(var i = 0 ; i < this.details.length ; i++){
				var detail = this.details[i];
				if(detail.getConsumesStockId() == provideStock.getId()){
					return detail.getDays();
				}
			}
			return 0;
		},
		getHoursByProvideHMM : function(provideStock){
			var n = new Decimal(this.getHours());
//			if(!provideStock){
				return Util.formatTime(n.isZero() ? 0 : n.abs().times(this.getBaseTime() || 0).round().toNumber());
//			}
//			for(var i = 0 ; i < this.details.length ; i++){
//				var detail = this.details[i];
//				if(detail.getConsumesStockId() == provideStock.getId()){
//					var n = new Decimal(detail.getHours());
//					return Util.formatTime(n.isZero() ? 0 : n.times(this.getBaseTime() || 0).round().toNumber());
//				}
//			}
			return 0;
		},
		getDH : function(v, flag){
			var n = new Decimal(v);
			return (flag ? n.toDecimalPlaces(5).toNumber() : n);
		},
		getJson: function(){
			return Util.toJson(this.obj, true);
		},
		getDetailJson : function(provideStock){
			var n = this.getDays() + this.getHours();
			if(!provideStock){
				return '-';
			}
			for(var i = 0 ; i < this.details.length ; i++){
				var detail = this.details[i];
				if(detail.getConsumesStockId() == provideStock.getId()){
					return Util.toJson(detail.obj, true)
				}
			}
			return 0;
		},
		addDetail : function(detail){
			this.details.push(detail);
		},
		addProvides : function(stock){
			this.provides.push(stock);
		},
		addChild : function(stock){
			var days = Math.min(this.getRemain(), Math.abs(stock.getRemain()));
			this.children.push({ days: days, stock: stock, date: stock.getDate(), pstock: this });
			stock.addParent(this, days);
		},
		addParent : function(stock, days){
			this.parents.push({ days: days, stock: stock });
		},
		isExpired : function(){
			if(this.isProvide()
			&& this.getRemain() > 0
			&& this.getLimitDate() <= tsq.today){
				return '失効';
			}
			return '';
		},
		getSpendType : function(flag){
			var m = 0;
			if(this.isSpend()){
				var n = Math.abs(this.getDays());
				if(n >= 1){
					m = 1; // 終日休
				}else if(n == 0.5){
					m = 2; // 半休
				}else{
					m = 3; // 時間休
				}
			}
			if(!flag){
				return {1:'終日休',2:'半日休',3:'時間休',0:''}[m] + (this.isLostFlag() ? '(ﾏｲﾅｽ)' : '');
			}
			return m;
		},
		toString: function(){
			return '付与日数=' + this.getDayHours()
				+ ',残数=' + this.getRemain()
				+ ',基準時間=' + this.getBaseTimeHMM()
				+ ',有効開始日=' + this.getStartDate()
				+ ',失効日=' + this.getLimitDate()
				;
		},
		setMark: function(v){
			this.mark = v;
		},
		getMark: function(){
			return this.mark;
		},
		getSyncBaseTime: function(){
			return this.syncBaseTime;
		},
		setSyncBaseTime: function(bt){
			this.syncBaseTime = bt;
		},
		syncClass: function(bt){
			return (this.getSyncBaseTime() != this.getBaseTime() ? 'async_base_time' : '');
		},
		sortChildren: function(){
			this.children = this.children.sort(function(a, b){
				return (a.date < b.date ? -1 : 1);
			});
		},
		isExistValidApply: function(){
			var ap = this.obj.EmpApplyId__r;
			if(ap && ["承認済み","承認待ち","確定済み"].indexOf(ap.Status__c) >= 0){
				return true;
			}
			return false;
		}
	});
});
