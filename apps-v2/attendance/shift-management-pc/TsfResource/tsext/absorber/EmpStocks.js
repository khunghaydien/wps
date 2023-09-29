define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/absorber/Emp",
	"tsext/util/Util"
], function(declare, lang, array, str, Emp, Util){
	return declare("tsext.absorber.EmpStocks", null, {
		constructor : function(){
			this.stocks = [];
		},
		getSize    : function(){ return this.stocks.length; },
		get        : function(index){ return this.stocks[index]; },
		addEmpStock: function(stock){ this.stocks.push(stock); },

		getStockById: function(id){
			for(var i = 0 ; i < this.stocks.length ; i++){
				var stock = this.stocks[i];
				if(stock.getId() == id){
					return stock;
				}
			}
			return null;
		},
		addEmpStockDetail: function(detail){
			var provide = this.getStockById(detail.getConsumesStockId());
			if(provide){
				provide.addDetail(detail);
				if(detail.isLostFlag()){
					var spend = this.getStockById(detail.getConsumedByStockId());
					provide.addChild(spend);
				}
			}
		},
		build: function(){
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
			for(var i = 0 ; i < this.stocks.length ; i++){
				var stock = this.stocks[i];
				if(stock.isSpend()){
					this.matching(stock);
				}
			}
		},
		matching: function(spend){
			for(var i = 0 ; i < this.stocks.length && spend.getRemainOptimal() > 0 ; i++){
				var stock = this.stocks[i];
				if(stock.isProvide()
				&& stock.getRemainOptimal() > 0
				&& stock.inRange(spend)){
					stock.addChild(spend);
				}
			}
		},
		// 出力対象リスト
		getOutputList: function(){
			var list = [];
			array.forEach(this.stocks, function(stock){
				if(stock.isProvide()){
					list.push({ stock: stock });
					for(var i = 0 ; i < stock.children.length ; i++){
						list.push(stock.children[i]);
					}
				}
			}, this);
			array.forEach(this.stocks, function(stock){
				if(!stock.isProvide() && stock.getRemainOptimal() > 0){
					var tgt = { stock: stock, days: stock.getRemainOptimal(), invalid: true };
					var pushed = false;
					for(var i = 0 ; i < list.length ; i++){
						var o = list[i];
						if((o.stock.isSpend()   && tgt.stock.getDate() < o.stock.getDate())
						|| (o.stock.isProvide() && tgt.stock.getDate() < o.stock.getStartDate())){
							list.splice(i, 0, tgt);
							pushed = true;
							break;
						}
					}
					if(!pushed){
						list.push(tgt);
					}
				}
			}, this);
			return list;
		},
		// 付与の合計日数
		getProvideDays: function(){
			var days = 0;
			array.forEach(this.stocks, function(stock){
				if(stock.isProvide()){
					days += (stock.getProvideDays() || 0);
				}
			}, this);
			return days;
		},
		// 失効分した付与の合計日数
		getExpiredDays: function(){
			var days = 0;
			array.forEach(this.stocks, function(stock){
				if(stock.isProvide() && stock.getRemainOptimal() > 0 && stock.isExpired()){
					days += stock.getRemainOptimal();
				}
			}, this);
			return days;
		},
		// ロジックで算出した失効分を除いた残日数
		getRemainDays: function(){
			var days = 0;
			array.forEach(this.stocks, function(stock){
				if(stock.isProvide() && stock.getRemainOptimal() > 0 && !stock.isExpired()){
					days += stock.getRemainOptimal();
				}
			}, this);
			return days;
		},
		// 消化の合計日数
		getSpendDays: function(){
			var days = 0;
			array.forEach(this.stocks, function(stock){
				if(stock.isSpend()){
					days += Math.abs(stock.getSpendDays() || 0);
				}
			}, this);
			return days;
		},
		// 範囲内の残日数
		getStockRemainDaysInRange: function(sd, ed){
			var days = 0;
			array.forEach(this.stocks, function(stock){
				if(stock.isProvide() && stock.getRemain() > 0
				&& stock.getStartDate() <= ed && stock.getLimitDate() > sd){
					days += stock.getRemain();
				}
			}, this);
			return days;
		},
		// 範囲内の残日数のある積休付与を返す
		getRemainStocksInRange: function(sd, ed){
			var objs = [];
			array.forEach(this.stocks, function(stock){
				if(stock.isProvide() && stock.getRemain() > 0
				&& stock.getStartDate() <= ed && stock.getLimitDate() > sd){
					objs.push({
						stock: stock,
						days: stock.getRemain()
					});
				}
			}, this);
			return objs;
		},
		// 範囲内の消化の合計日数
		getStockSpendDaysInRange: function(sd, ed){
			var days = 0;
			array.forEach(this.stocks, function(stock){
				if(stock.isSpend()){
					days += Math.abs(stock.getStockSpendDaysInRange(sd, ed) || 0);
				}
			}, this);
			return days;
		},
		// 付与レコードに紐づけられない消化レコードの合計日数
		getInvalidDays: function(){
			var days = 0;
			array.forEach(this.stocks, function(stock){
				if(stock.isSpend() && stock.getRemainOptimal() > 0){
					days += stock.getRemainOptimal();
				}
			}, this);
			return days;
		},
		// 関連する勤怠積休詳細レコードが存在しない消化レコードの合計日数
		getDisconnectDays: function(){
			var days = 0;
			array.forEach(this.stocks, function(stock){
				if(stock.isSpend() && !stock.isConnect()){
					days += Math.abs(stock.getSpendDays());
				}
			}, this);
			return days;
		}
	});
});
