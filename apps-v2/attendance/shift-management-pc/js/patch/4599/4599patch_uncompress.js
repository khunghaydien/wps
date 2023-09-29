if(typeof(teasp) == 'object' && (!teasp.resolved || !teasp.resolved['4599']) && teasp.data && teasp.data.Pouch){
teasp.data.Pouch.getDaiqZan = function(_stocks, td, sd, ed){
	var stockType = '代休';
	var stocks = [];
	var consumers = {};
	var rngZan = 0; // 残日数
	if(typeof(td) == 'object'){
		td = teasp.util.date.formatDate(td);
	}
	if(typeof(sd) == 'object'){
		sd = teasp.util.date.formatDate(sd);
	}
	if(typeof(ed) == 'object'){
		ed = teasp.util.date.formatDate(ed);
	}
	for(var i = 0 ; i < _stocks.length ; i++){
		if(_stocks[i].type == stockType){
			var stock = _stocks[i];
			stocks.push(stock);
			if(stock.days < 0){
				continue;
			}
			if(teasp.util.date.compareDate(stock.startDate, td) <= 0
			&& teasp.util.date.compareDate(stock.limitDate, td) > 0){
				rngZan += (stock.remainDays || 0);
			}
			stock.zans = (stock.days || 0); // 残数を別の変数にコピー
			for(var j = 0 ; j < stock.consumers.length ; j++){
				var consumer = stock.consumers[j];
				var o = consumers[consumer.consumedByStockId];
				// 作業用に、子オブジェクトに親オブジェクトの参照を保持させる
				if(!o){
					o = consumers[consumer.consumedByStockId] = consumer;
					o.parents = [];
					o.parentMap = {};
					stocks.push({
						id	   : consumer.consumedByStockId,
						parent : stock
					});
				}
				if(!o.parentMap[stock.id]){
					// 親オブジェクトの参照はそのままセットすること。
					// ※クローンを作りクローンの参照をセットするようなことをすると、
					//	 １つの親に紐づく子供が多数いると、オブジェクトが肥大化して、
					//	 クローン処理に膨大な時間がかかるようになる（らしい）。
					o.parents.push(stock);
					o.parentMap[stock.id] = { cdays: consumer.cdays };
				}
			}
		}
	}
	var overSpend = 0;
	if(stockType == teasp.constant.STOCK_DAIQ){ // 代休の場合
		// 指定日の残日数を得る
		for(var i = 0 ; i < stocks.length ; i++){
			var stock = stocks[i];
			if((!ed || stock.date <= ed) && !stock.parent && stock.days < 0 && !consumers[stock.id]){
				rngZan += (stock.days || 0);
			}
		}
		if(rngZan < 0){
			overSpend = rngZan;
		}
	}
	var history = [];
	var applys = {};
	var done = {};
	var x = 0;
	for(var i = 0 ; i < stocks.length ; i++){
		var stock = stocks[i];
		var stats = [];
		var subject = '';
		if(done[stock.id]){
			continue;
		}
		done[stock.id] = 1;
		if(stock.parent){
			var consumer = consumers[stock.id];
			var sumDays = 0;
			for(var j = 0 ; j < consumer.parents.length ; j++){
				var p = consumer.parents[j];
				if(stock.parent.type == teasp.constant.STOCK_DAIQ && p.apply){
					stats.push(teasp.message.getLabel('tm10003720', teasp.util.date.formatDate(p.date, '+M/d')));
				}else{
					stats.push(teasp.message.getLabel('tm10003723', teasp.util.date.formatDate(p.date, '+M/d'), p.name));
				}
				sumDays += p.days;
			}
			if(sumDays < Math.abs(consumer.days)) {
				stats.push('???');
			}
			if(consumer.empApplyId){
				subject = consumer.holidayName;
			}else{
				subject = consumer.name;
			}
			var o = {
				date		   : teasp.util.date.formatDate((consumer.date ? consumer.date : consumer.startDate), 'SLA'),
				subject 	   : subject,
				plus		   : '-',
				minus		   : teasp.message.getLabel('tk10005151', Math.abs(consumer.days)), // {0}日
				startDate	   : '-',
				limitDate	   : '-',
				status		   : stats.join(teasp.message.getLabel('tm10001540')),
				seq 		   : (++x),
				applyStartDate : consumer.applyStartDate, // 休暇期間開始日
				applyEndDate   : consumer.applyEndDate	  // 休暇期間終了日
			};
			history.push(o);
			if(consumer.empApplyId){
				applys[consumer.empApplyId] = o;
			}
		}else{
			var o = {};
			var plus = stock.days;
			if(stock.type == teasp.constant.STOCK_DAIQ){
				if(!stock.apply){
					subject = stock.name;
				}else{
					subject = (stock.days >= 0
							? teasp.message.getLabel('tm10001390') + (typeof(stock.workRealTime) == 'number' && stock.workRealTime >= 0 ? ' (' + teasp.util.time.timeValue(stock.workRealTime) + ')' : '')
							: (stock.apply.holiday ? stock.apply.holiday.name : '???'));
				}
				if(stock.days == 0) {
					stats.push(teasp.message.getLabel('tm10003752')); // 代休取得可能な労働時間未達
				}else if(stock.days > 0){
					var tmps = [];
					for(var key in consumers){
						if(consumers.hasOwnProperty(key) && consumers[key].parentMap[stock.id]){
							var consumer = consumers[key];
							tmps.push(teasp.util.date.formatDate(consumer.date, '+M/d'));
						}
					}
					if(tmps.length > 0){
						stats.push(teasp.message.getLabel('tm10003730', tmps.join(', '))); // 代休日 {0}
					}
					if(stock.remainDays > 0 && stock.limitDate <= td){
						stats.push(teasp.message.getLabel('tm10010710')); // 失効
					}
				}else{
					if(consumers[stock.id]){
						plus = 0;
						delete done[stock.id];
					}
				}
				if(!stock.apply && plus > 0){
					stats.push(teasp.message.getLabel('tm10003722', teasp.util.date.formatDate(stock.date, 'SLA')));  // （{0} 付与）
					o.date = teasp.util.date.formatDate(stock.startDate, 'SLA');
				}else{
					o.date = teasp.util.date.formatDate(stock.date, 'SLA');
				}
			}else{
				subject = (stock.days >= 0 ? stock.name : (stock.apply && stock.apply.holiday ? stock.apply.holiday.name : stock.name));
				stats.push(teasp.message.getLabel('tm10003722', teasp.util.date.formatDate(stock.date, 'SLA')));  // （{0} 付与）
				if(stock.remainDays > 0 && stock.limitDate <= td){
					stats.push(teasp.message.getLabel('tm10010710')); // 失効
				}else if(stock.days < 0){
					if(consumers[stock.id]){
						plus = 0;
						delete done[stock.id];
					}
				}
				o.date = teasp.util.date.formatDate(stock.startDate, 'SLA');
			}
			if(plus != 0){
				o.subject	= subject;
				o.plus		= (plus < 0 ? '-' : teasp.message.getLabel('tk10005151', stock.days));
				o.minus 	= (plus < 0 ? teasp.message.getLabel('tk10005151', Math.abs(stock.days)) : '-');
				o.startDate = (plus < 0 ? '-' : teasp.util.date.formatDate(stock.startDate, 'SLA'));
				o.limitDate = (plus < 0 ? '-' : (stock.limitDate == '2999-12-31' ? teasp.message.getLabel('infinite_date') : teasp.util.date.formatDate(stock.limitDate, 'SLA')));
				o.status	= (plus < 0 ? '???' : stats.join(teasp.message.getLabel('tm10001540')));
				o.seq		= (++x);
				history.push(o);
				if(stock.apply){
					applys[stock.apply.id] = o;
				}
			}
		}
	}
	history = history.sort(function(a, b){
		if(a.date == b.date){
			return a.seq - b.seq;
		}
		return (a.date < b.date ? -1 : (a.date > b.date ? 1 : 0));
	});
	// 作業用の親オブジェクト参照用の変数は、循環参照の状態を避けるために削除する。
	// pouch.dataObj のクローンを作りたい時、循環参照があると、JSエラー「Maximum call stack size exceeded」になる。
	for(var key in consumers){
		if(consumers.hasOwnProperty(key)){
			var consumer = consumers[key];
			if(consumer.parents){
				delete consumer.parents;
			}
			if(consumer.parentMap){
				delete consumer.parentMap;
			}
		}
	}
	return { zan: rngZan, overSpend: overSpend, stocks: stocks, consumers: consumers, history: history, applys: applys };
};
}
