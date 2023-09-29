teasp.provide('teasp.helper.Diverge');
/**
 * 乖離判定クラス
 *
 * @constructor
 * @param {Object} o // 入退館情報
 */
teasp.helper.Diverge = function(o){
	this.date = o.date;
	this.dIn  = new teasp.helper.DivergeOne({
		logt   : o.enterTime,
		judge  : o.enterDivergenceJudgement,
		reason : o.enterDivergenceReason,
		stamp  : o.st
	});
	this.dOut = new teasp.helper.DivergeOne({
		logt   : o.exitTime,
		judge  : o.exitDivergenceJudgement,
		reason : o.exitDivergenceReason,
		stamp  : o.et
	});
};

teasp.helper.Diverge.prototype.getJudge = function(){
	var o1 = this.dIn.getJudge();
	var o2 = this.dOut.getJudge();
	var res;
	if(o1.type === 0 && o2.type === 0){
		var reason = (o1.reason | o2.reason);
		res = {
			type   : 0,  // 乖離なし
			reason : reason,
			css    : (reason ? 'pp_base pp_acc_03' : 'png-add'), // ペン or ＋
			title  : teasp.message.getLabel((reason ? 'ac00000420' : 'ac00000410')), // 理由入力済み or 乖離理由入力
			summ   : teasp.message.getLabel((reason ? 'ac00000390' : 'ac00000400'))  // 乖離なし(理由あり) or 乖離なし(理由なし)
		};
	}else if(o1.type > 0 || o2.type > 0){
		var reason = (o1.type > 0 && !o1.reason) ? 0 : ((o2.type > 0 && !o2.reason) ? 0 : 1);
		res = {
			type   : ((o1.type || 0) | (o2.type || 0)),  // 乖離あり
			reason : reason,
			css    : (reason ? 'pp_base pp_acc_01' : 'pp_base pp_acc_02'), // 赤びっくり＋ペン or 赤びっくり
			title  : teasp.message.getLabel((reason ? 'ac00000370' : 'ac00000380')), // 乖離あり(理由あり) or 乖離あり(理由なし)
			summ   : teasp.message.getLabel((reason ? 'ac00000370' : 'ac00000380'))  // 乖離あり(理由あり) or 乖離あり(理由なし)
		};
	}else{
		var reason = (o1.reason | o2.reason);
		var stampd = (o1.stampd | o2.stampd);
		res = {
			type   : -1,  // 未判定
			reason : reason,
			css    : (reason ? 'pp_base pp_acc_03' : 'png-add'), // ペン or ＋
			title  : teasp.message.getLabel((reason ? 'ac00000420' : 'ac00000410')), // 理由入力済み or 乖離理由入力
			summ   : '',
			stampd : stampd
		};
	}
	res.date = this.date;
	res.dIn  = o1;
	res.dOut = o2;
	return res;
};

teasp.helper.DivergeOne = function(o){
	this.logt    = o.logt;    // ログの時刻（分: null, 0～2880）
	this.judge   = o.judge;   // バッチ判定（null, 0, 1, 2 のいずれか）
	this.reason  = o.reason;  // 理由
	this.stamp   = o.stamp;   // 打刻時刻（分: null, 0～2880）
};

teasp.helper.DivergeOne.prototype.getJudge = function(){
	var res;
	if(typeof(this.judge) == 'number'){
		res = { type: this.judge };
	}else{
		res = {
			type   : null, // 未判定
			stampd : (typeof(this.stamp) == 'number' ? 1 : 0)
		};
	}
	res.reason = (this.reason ? 1 : 0);
	return res;
};
