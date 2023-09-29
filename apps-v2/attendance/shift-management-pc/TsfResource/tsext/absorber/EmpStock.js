define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.absorber.EmpStock", null, {
		constructor : function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			o.StartDate__c	   = Util.formatDate(o.StartDate__c);
			o.LimitDate__c	   = Util.formatDate(o.LimitDate__c);
			o.Date__c		   = Util.formatDate(o.Date__c);
			this.obj = o;
			this.dateRange = this.getDateRange();
			this.details = [];
			this.parents = [];
			this.children = [];
		},
		getDateRange: function(){
			var sd = null;
			var ed = null;
			var em = {};
			if(this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.StartDate__c){
				sd = Util.formatDate(this.obj.EmpApplyId__r.StartDate__c);
			}
			if(this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.EndDate__c){
				ed = Util.formatDate(this.obj.EmpApplyId__r.EndDate__c);
			}
			if(!sd || !ed){
				return null;
			}
			var v = (this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.ExcludeDate__c) || null;
			if(v){
				var exds = v.split(':');
				for(var i = 0 ; i < exds.length ; i++){
					var exd = exds[i];
					if(exd && /^\d{8}$/.test(exd)){
						var d = moment(exd, 'YYYYMMDD');
						if(d.isValid()){
							em[d.format('YYYY-MM-DD')] = 1;
						}
					}
				}
			}
			return {
				sd: sd,
				ed: ed,
				exclude: em
			};
		},
		getId          : function(){ return this.obj.Id; },
		getName        : function(){ return this.obj.Name; },
		getEmpId       : function(){ return this.obj.EmpId__c; },
		getType        : function(){ return this.obj.Type__c; },
		getCreatedDate : function(){ return this.obj.CreatedDate; },
		getDays        : function(){ return this.obj.Days__c || 0; },
		isLostFlag     : function(){ return this.obj.LostFlag__c || false; },
		isProvide      : function(){ return (this.getDays() >= 0); },
		isSpend        : function(){ return (this.getDays() < 0);  },
		getStartDate   : function(){ return this.isProvide() ? this.obj.StartDate__c : ''; },
		getLimitDate   : function(){ return this.isProvide() ? this.obj.LimitDate__c : ''; },
		getDate        : function(){ return this.isProvide() ? '' : this.obj.Date__c; },
		getCategory    : function(){ return this.isProvide() ? '付与' : '消化'; },
		getProvideDays : function(){ return this.isProvide() ? this.getDays() : ''; },
		getSpendDays   : function(){ return this.isProvide() ? '' : this.getDays(); },

		getStockSpendDaysInRange: function(sd, ed){
			var dr = this.dateRange;
			var hd = this.getDate();
			if(dr && dr.sd < dr.ed){
				var n = 0;
				var F = 'YYYY-MM-DD';
				var d = dr.sd;
				while(d <= dr.ed){
					if(!dr.exclude[d] && sd <= d && d <= ed){
						n++;
					}
					d = moment(d, F).add(1, 'd').format(F);
				}
				return n;
			}else if((dr && sd <= dr.sd && dr.sd <= ed)
			|| (hd && sd <= hd && hd <= ed)){
				return this.getSpendDays();
			}
			return 0;
		},
		getEmpApplyName: function(){
			if(this.isProvide() && !this.obj.EmpApplyId__c){
				return '(手動付与)';
			}else if(!this.isProvide() && this.isLostFlag()){
				return '(マイナス付与)';
			}
			return (this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.Name) || '';
		},
		addDetail: function(detail){
			this.details.push(detail);
		},
		// 残数を返す（紐づけ情報を無視）
		getRemainOptimal: function(){
			if(this.isProvide()){
				var days = 0;
				for(var i = 0 ; i < this.children.length ; i++){
					days += this.children[i].days;
				}
				return this.getProvideDays() - days;
			}else{
				var days = 0;
				for(var i = 0 ; i < this.parents.length ; i++){
					days += this.parents[i].days;
				}
				return Math.abs(this.getSpendDays()) - days;
			}
		},
		// 残数を返す
		getRemain : function(){
			var days = 0;
			if(this.isProvide()){
				for(var i = 0 ; i < this.details.length ; i++){
					var detail = this.details[i];
					days += Math.abs(detail.getDays());
				}
			}
			return this.getProvideDays() - days;
		},
		getProvideRemain: function(){
			return (this.isProvide() ? this.getRemainOptimal() : '');
		},
		isExpired: function(){
			if(this.isProvide()
			&& this.getRemainOptimal() > 0
			&& this.getLimitDate() <= Util.today()){
				return '失効';
			}
			return '';
		},
		inRange: function(spend){
			if(this.getStartDate() <= spend.getDate()
			&& spend.getDate() < this.getLimitDate()){
				return true;
			}
			return false;
		},
		addChild: function(stock){
			var days = Math.min(this.getRemainOptimal(), Math.abs(stock.getRemainOptimal()));
			this.children.push({ days: days, stock: stock });
			stock.addParent(this, days);
		},
		addParent: function(stock, days){
			this.parents.push({ days: days, stock: stock });
		},
		getFork: function(){
			if(this.isProvide()){
				return '';
			}
			return this.parents.length;
		},
		isConnect: function(){
			return (this.isSpend() && this.obj.Consumes__r && this.obj.Consumes__r.length > 0);
		},
		isNgRecord: function(){
			return (this.isSpend() && this.obj.LimitDate__c) ? true : false;
		},
		getConnectStatus: function(){
			if(this.isProvide()){
				return '－';
			}else{
				return (this.isConnect() ? '' : '切断');
			}
		},
		// 関連する勤怠積休詳細レコードが存在しない消化レコードの日数
		getDisconnectDays: function(){
			if(this.isSpend() && !this.isConnect()){
				return Math.abs(this.getSpendDays());
			}
			return '';
		},
		getDetailById: function(obj){
			for(var i = 0 ; i < this.details.length ; i++){
				var detail = this.details[i];
				if(detail.getConsumesStockId()   == obj.ConsumesStockId__c
				&& detail.getConsumedByStockId() == obj.ConsumedByStockId__c){
					return detail;
				}
			}
			return null;
		}
	});
});
