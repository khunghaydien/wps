define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/leave/EmpStock",
	"tsext/leave/EmpStockDetail",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Wait, EmpStock, EmpStockDetail, Util){
	return declare("tsext.leave.EmpStocks", null, {
		constructor : function(){
			this.stocks = [];
		},
		getSize: function(){
			return this.stocks.length;
		},
		get: function(index){
			return this.stocks[index];
		},
		clear: function(){
			this.stocks = [];
		},
		addEmpStock: function(stock){
			this.stocks.push(stock);
		},
		getAll: function(){
			return this.stocks;
		},
		sort: function(){
			// 勤怠積休をソート
			// 付与なら失効日＞有効開始日＞生成日時
			// 消化なら発生日＞生成日時
			this.stocks = this.stocks.sort(function(a, b){
				if(a.isProvide() && b.isProvide()){
					if(a.getLimitDate() == b.getLimitDate()){
						if(a.getStartDate() == b.getStartDate()){
							return (a.getCreatedDate() < b.getCreatedDate() ? -1 : 1);
						}else{
							return (a.getStartDate() < b.getStartDate() ? -1 : 1);
						}
					}else if(a.getStartDate() == b.getStartDate()){
						return (a.getCreatedDate() < b.getCreatedDate() ? -1 : 1);
					}else{
						return (a.getStartDate() < b.getStartDate() ? -1 : 1);
					}
				}else if(a.isSpend() && b.isSpend()){
					if(a.getDate() == b.getDate()){
						return (a.getCreatedDate() < b.getCreatedDate() ? -1 : 1);
					}else{
						return (a.getDate() < b.getDate() ? -1 : 1);
					}
				}else if(a.isProvide()){
					return -1;
				}else{
					return 1;
				}
			});
			var pcnt = 0;
			var scnt = 0;
			for(var i = 0 ; i < this.stocks.length ; i++){
				var stock = this.stocks[i];
				if(stock.isProvide()){
					stock.setMark('P' + (++pcnt));
					stock.sortChildren();
				}else if(stock.isSpend()){
					stock.setMark('S' + (++scnt));
				}
			}
		},
		// 積休を取得
		fetchStocks: function(emp, manageName){
			this.stocks = [];
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",CreatedById"
				+ ",CreatedBy.Name"
				+ ",LastModifiedDate"
				+ ",LastModifiedById"
				+ ",LastModifiedBy.Name"
				+ ",EmpId__c"
				+ ",Type__c"
				+ ",StartDate__c"
				+ ",LimitDate__c"
				+ ",Date__c"
				+ ",Days__c"
				+ ",EmpApplyId__c"
				+ ",EmpApplyId__r.Name"
				+ ",EmpApplyId__r.Status__c"
				+ ",EmpApplyId__r.ApplyType__c"
				+ ",EmpApplyId__r.Close__c"
				+ ",EmpApplyId__r.HolidayId__r.Name"
				+ ",EmpApplyId__r.HolidayId__r.Type__c"
				+ ",EmpApplyId__r.HolidayId__r.Range__c"
				+ ",EmpApplyId__r.HolidayId__r.Managed__c"
				+ ",EmpApplyId__r.HolidayId__r.ManageName__c"
				+ ",EmpApplyId__r.HolidayId__r.DisplayDaysOnCalendar__c"
				+ ",LostFlag__c"
				+ ",ConsumedDays__c"
				+ ",DaiqAllBorderTime__c"
				+ ",DaiqHalfBorderTime__c"
				+ ",DayType__c"
				+ ",RemainDays__c"
				+ ",WorkRealTime__c"
				+ ",BatchKey__c"
				+ ",Removed__c"
				+ ",BaseTime__c"
				+ ",RemainDaysAndHours__c"
				+ ",Hours__c"
				+ ",ConsumedHours__c"
				+ ",CurrentBaseTime__c"
				+ ",HoursInMinutes__c"
				+ " from AtkEmpStock__c"
				+ " where EmpId__c = '" + emp.getId() + "'"
				+ " and Type__c = '" + manageName + "'"
				;
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					array.forEach(records || [], function(record){
						this.stocks.push(new EmpStock(record));
					}, this);
					deferred.resolve();
				}),
				deferred.reject
			);
			return deferred.promise;
		},
		// 積休詳細を取得
		fetchStockDetails: function(emp, manageName){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",CreatedById"
				+ ",CreatedBy.Name"
				+ ",LastModifiedDate"
				+ ",LastModifiedById"
				+ ",LastModifiedBy.Name"
				+ ",ConsumesStockId__c"
				+ ",ConsumedByStockId__c"
				+ ",Days__c"
				+ ",ConsumesStockId__r.EmpId__c"
				+ ",ConsumedByStockId__r.LostFlag__c"
				+ ",Hours__c"
				+ ",AdjustedHours__c"
				+ ",Adjustment__c"
				+ " from AtkEmpStockDetail__c"
				+ " where ConsumesStockId__r.EmpId__c = '" + emp.getId() + "'"
				+ " and ConsumesStockId__r.Type__c = '" + manageName + "'"
				;
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					array.forEach(records || [], function(record){
						this.addEmpStockDetail(new EmpStockDetail(record));
					}, this);
					this.sort();
					deferred.resolve();
				}),
				deferred.reject
			);
			return deferred.promise;
		},
		getStockById : function(id){
			for(var i = 0 ; i < this.stocks.length ; i++){
				var stock = this.stocks[i];
				if(stock.getId() == id){
					return stock;
				}
			}
			return null;
		},
		addEmpStockDetail : function(detail){
			var provide = this.getStockById(detail.getConsumesStockId());
			var spend   = this.getStockById(detail.getConsumedByStockId());
			if(provide){
				provide.addDetail(detail);
				if(spend){
					provide.addChild(spend);
				}
			}
			if(spend){
				spend.addDetail(detail);
			}
		},
		isExistValidApply: function(){
			for(var i = 0 ; i < this.stocks.length ; i++){
				if(this.stocks[i].isExistValidApply()){
					return true;
				}
			}
			return false;
		}
	});
});
