define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/leave/StockTransition",
	"tsext/util/Util"
], function(declare, lang, array, str, StockTransition, Util){
	return declare("tsext.leave.StockTransitions", null, {
		constructor: function(){
			this.reset();
		},
		reset: function(){
			this.transitions = [];
			this.soloList = [];
		},
		/**
		 * 変遷リストを返す
		 * @param {number} viewMode =0:時系列順 =1:付与別
		 * @param {boolean} flag =true:紐づけ切れ情報も返す
		 * @return {Array.<tsext.leave.StockTransition>}
		 */
		getTransitions: function(viewMode, flag){
			var tras = [];
			tras = tras.concat(this.transitions);
			// viewModeの指定どおりに並び替える
			tras = this.setTransitionOrder(tras, viewMode);
			// flag=on で紐づけ切れリストがあれば配列に加える
			if(flag && this.soloList.length){
				tras.push(new StockTransition({}));
				tras = tras.concat(this.soloList);
			}
			// シーケンス番号をふる
			var seqno = 1;
			for(var i = 0 ; i < tras.length ; i++){
				tras[i].setSeqno(seqno++);
			}
			return tras;
		},
		/**
		 * 並び替え
		 */
		setTransitionOrder: function(tras, viewMode){
			if(!viewMode){ // 時系列順
				return tras.sort(function(a, b){
					if(a.getDate() == b.getDate()){
						return a.getSn() - b.getSn();
					}
					return (a.getDate() < b.getDate() ? -1 : 1);
				});
			}else{ // 付与別
				return tras.sort(function(a, b){
					return a.getSn() - b.getSn();
				});
			}
		},
		/**
		 * 変遷リストを作成する
		 * @param {Array.<tsext.leave.EmpStock>} stocks
		 * @param {Array.<tsext.leave.ConfigHistory>} configHistorys
		 * @param {number} stepValue  30 or 60
		 */
		createTransitions: function(stocks, configHistorys, stepValue){
			this.stocks = stocks;
			this.configHistorys = configHistorys;
			this.stepValue = stepValue;
			this.transitions = [];
			dojo.forEach(this.stocks, function(stock){
				var tras = [];
				if(stock.isProvide()){
					// 付与
					tras.push(new StockTransition({
						stock: stock,
						date: stock.getStartDate()
					}));
					// 消化
					for(var i = 0 ; i < stock.children.length ; i++){ // （※childrenは日付の昇順である）
						tras.push(new StockTransition(stock.children[i]));
					}
					// 失効
					tras.push(new StockTransition({
						expired: true,
						stock: stock,
						date: stock.getLimitDate(),
						startDate: stock.getStartDate(),
						endDate: stock.getLimitDate(),
						pstock: stock
					}));
				}
				// 基準時間変更を挿入
				var cbmap = {};
				var xs = [];
				for(var i = 0 ; i < (tras.length - 1) ; i++){
					var curr = tras[i];
					var next = tras[i + 1];
					var d1 = curr.getDate();
					var d2 = next.getDate();
					if(next.isExpired()){
						d2 = moment(d2).add(-1, 'day').format('YYYY-MM-DD');
					}
					var cbs = this.getChangedBaseTimeTransition(d1, d2, tras[0]);
					if(cbs.length){
						cbmap[i + 1] = cbs;
						xs.push(i + 1);
					}
				}
				for(var i = xs.length - 1 ; i >= 0 ; i--){
					var x = xs[i];
					var cbs = cbmap[x];
					for(var j = cbs.length - 1 ; j >= 0 ; j--){
						tras.splice(x, 0, cbs[j]);
					}
				}
				this.transitions = this.transitions.concat(tras);
			}, this);
			// 連番をふる（付与別に並び替える時に利用する）
			for(var i = 0 ; i < this.transitions.length ; i++){
				this.transitions[i].setSn(i + 1);
			}
			// 単独データリストを作成
			this.soloList = [];
			dojo.forEach(this.stocks, function(stock){
				if(stock.isSpend() && stock.isSolo()){
					this.soloList.push(new StockTransition({
						solo: true,
						stock: stock,
						date: stock.getDate()
					}));
				}
			}, this);
			// 残日数計算
			this.calcRemain();
		},
		/**
		 * 基準時間変更の情報を返す
		 * @param {string} d1 開始日
		 * @param {string} d2 終了日
		 * @param {Object} pstock 付与レコード
		 * @return {Array.<tsext.leave.StockTransition>}
		 */
		getChangedBaseTimeTransition: function(d1, d2, pstock){
			var transitions = [];
			var bt = -1;
			for(var i = 0 ; i < this.configHistorys.length ; i++){
				var ch = this.configHistorys[i];
				var sd = ch.getStartDate();
				var ed = ch.getEndDate();
				if((ed && d1 && ed < d1) || (sd && d2 && d2 < sd)){
					continue;
				}
				if(bt < 0 || bt == ch.getBaseTimeForStock()){
					bt = ch.getBaseTimeForStock();
					continue;
				}
				bt = ch.getBaseTimeForStock();
				transitions.push(new StockTransition({
					changed: true,
					startDate: sd,
					endDate: ed,
					date: sd,
					pstock: pstock,
					baseTime: bt
				}));
			}
			return transitions;
		},
		// 残日数計算
		calcRemain : function(){
			var remainDays = 0;
			var curBaseTime = null;
			// ①付与別に残日数の変遷を計算してセットする
			for(var i = 0 ; i < this.transitions.length ; i++){
				var transition = this.transitions[i];
				var empStock = transition.getStock();
				if(transition.isChanged()){ // 基準時間変更
					var dr = Util.parseDaysAndHours(remainDays, {baseTime:curBaseTime, stepValue:this.stepValue}); // 残日数を日数＋時間に分解
					if(curBaseTime && dr.minutes && transition.getBaseTime()){ // 端数がある
						// 端数に対して切り上げ
						var ft = (new Decimal(dr.minutes)).div(curBaseTime).times(transition.getBaseTime()).div(this.stepValue).ceil().times(this.stepValue);
						var ndr = ft.div(transition.getBaseTime()).plus(dr.days);
						transition.setFluct(ndr.minus(remainDays).toNumber()); // 増減をセット（新残日数－旧残日数）
						remainDays = ndr.toNumber(); // 切り上げ後の残日数
						transition.setRemain1(Util.parseDaysAndHours(remainDays, {baseTime:transition.getBaseTime(), stepValue:this.stepValue, stepHalf:true}));
					}else{ // 端数はない
						transition.setFluct(0);
						transition.setRemain1(dr);
					}
					curBaseTime = transition.getBaseTime();
				}else if(transition.isExpired()){ // 失効
					var dr = Util.parseDaysAndHours(remainDays, {baseTime:curBaseTime, stepValue:this.stepValue, flag:1}); // 残日数を日数＋時間に分解
					transition.setExpiredObj(dr); // 失効する日数・時間をセット
					transition.setFluct((new Decimal(dr.raw)).times(-1).toNumber()); // 増減をセット
					transition.setBaseTime(curBaseTime);
					transition.setRemain1(Util.parseDaysAndHours(0, {baseTime:0, stepValue:this.stepValue, stepHalf:true}))
					remainDays = 0;
				}else if(transition.isProvide()){ // 付与
					curBaseTime = empStock.getBaseTime();
					remainDays = empStock.getDayHours();
					transition.setRemain1(Util.parseDaysAndHours(remainDays, {baseTime:empStock.getBaseTime(), stepValue:this.stepValue}));
					transition.setFluct(remainDays); // 増減をセット
				}else if(transition.isSpend()){ // 消化
					var bt = empStock.getBaseTime();
					if(bt){
						curBaseTime = bt;
					}
					transition.setBaseTime(curBaseTime);
					var pstock = transition.getPstock();
					if(pstock){
						var spendDays = empStock.getDayHoursByProvide(pstock);
						remainDays = (new Decimal(remainDays)).minus(spendDays).toDecimalPlaces(5).toNumber(); // 残日数から消化分を減算
						transition.setFluct((new Decimal(spendDays)).times(-1)); // 増減をセット
						transition.setRemain1(Util.parseDaysAndHours(remainDays, {baseTime:empStock.getBaseTime(), stepValue:this.stepValue}));
					}
				}
			}
			// ②時系列順に並び替えて並び順をセット
			this.transitions = this.setTransitionOrder(this.transitions, 0);
			for(var i = 0 ; i < this.transitions.length ; i++){
				this.transitions[i].setTimeSn(i + 1);
			}
			// ③時系列順の残日数の変遷をセット
			remainDays = 0;
			for(var i = 0 ; i < this.transitions.length ; i++){
				var transition = this.transitions[i];
				remainDays = (new Decimal(remainDays)).plus(transition.getFluct()).toNumber(); // ①の計算で得た増減を行う
				transition.setRemain2(Util.parseDaysAndHours(remainDays, {baseTime:transition.getBaseTime(), stepValue:this.stepValue}));
			}
		}
	});
});
