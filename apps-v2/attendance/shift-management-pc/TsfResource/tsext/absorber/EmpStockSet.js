define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/absorber/EmpStocks",
	"tsext/util/Util"
], function(declare, lang, array, str, EmpStocks, Util){
	return declare("tsext.absorber.EmpStockSet", null, {
		constructor : function(){
			this.stocks = {};
		},
		getStocks: function(key, flag){
			var stocks = this.stocks[key];
			if(!stocks && flag){
				stocks = this.stocks[key] = new EmpStocks();
			}
			return stocks || null;
		},
		addEmpStock: function(stock){
			this.getStocks(stock.getType(), true).addEmpStock(stock);
		},
		addEmpStockDetail: function(detail){
			this.getStocks(detail.getType(), true).addEmpStockDetail(detail);
		},
		getStockTypeList: function(){
			return Object.keys(this.stocks);
		},
		buildStocks: function(){
			for(var key in this.stocks){
				this.stocks[key].build();
			}
		},
		// 範囲内の残日数
		getStockRemainDaysInRange: function(key, sd, ed){
			var stocks = this.getStocks(key);
			if(stocks){
				return stocks.getStockRemainDaysInRange(sd, ed);
			}else{
				return null;
			}
		},
		// 範囲内の残日数のある積休付与を返す
		getRemainStocksInRange: function(key, sd, ed){
			var stocks = this.getStocks(key);
			if(stocks){
				return stocks.getRemainStocksInRange(sd, ed);
			}else{
				return [];
			}
		},
		// 範囲内の消化の合計日数
		getStockSpendDaysInRange: function(key, sd, ed){
			var stocks = this.getStocks(key);
			if(stocks){
				return stocks.getStockSpendDaysInRange(sd, ed);
			}else{
				return null;
			}
		}
	});
});
