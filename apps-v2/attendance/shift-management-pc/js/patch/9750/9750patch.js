if(typeof(teasp) == 'object' && !teasp.resolved['DENTSU1'] && teasp.helper && teasp.helper.Summary){
// 勤務表集計エリア設定情報取得(override)
teasp.helper.Summary.prototype.getTimeViewBottomContents = function(){
	var defaults = this.getDefaultTimeViewBottomContents(this.monSum.o);
	var contents = this.getSummaryContentsByCategory('timeViewBottom', this.categoryL, this.categoryS);
	if(!contents){
		contents = defaults;
	}else{
		contents = this.mergeFields(defaults, contents);
	}
	contents = this.buildFields(this.setDefaultSummaryValues(contents));
	contents.numberOfColumns = contents.numberOfColumns || 0;
	// カスタマイズ開始
	for(var key in contents){
		if(!/^column\d$/.test(key)){
			continue;
		}
		var lst = contents[key];
		for(var i = 0 ; i < lst.length ; i++){
			var o = lst[i];
			if(o.key == 'amountTime'){ // フレックス過不足時間のラベルと値を書き換える
				var cat = this.calcAmountTime();
				o.label = cat.label;
				o.value = cat.value;
			}else if(o.key == 'legalTime' && (this.categoryL == 'man' || this.categoryL == 'fix')){ // 法定労働時間の値が入ってない
				var sd = this.pouch.dataObj.month.startDate;
				var ed = this.pouch.dataObj.month.endDate;
				var dayLen = teasp.util.date.daysInRange(sd, ed);
				o.value = teasp.util.time.timeValue(Math.floor(dayLen * 40 * 60 / 7))
			}
		}
	}
	// カスタマイズ終了
	return contents;
};
// フレックス過不足時間を計算(new function)
// 所定労働時間と所定労働日（平日）の労働時間の差を得る
teasp.helper.Summary.prototype.calcAmountTime = function(){
	var pouch = teasp.viewPoint.pouch;
	var empTime  = new teasp.logic.EmpTime(pouch);
	var common = pouch.dataObj.common;
	var config = pouch.dataObj.config;
	var allt = 0;
	var curt = 0;
	var curd = null;
	var sd = pouch.dataObj.month.startDate;
	var ed = pouch.dataObj.month.endDate;
	var td = teasp.util.date.formatDate(new Date()); // 本日日付
	var d = sd;
	var fixTime = 0;
	while(d <= ed){
		var day = pouch.dataObj.days[d];
		var calc = day.real;
		var t = 0;
		if(day.rack.worked || day.rack.paidHolySpans.length > 0){
			var excludes = teasp.util.time.margeTimeSpans([]
				.concat(day.rack.fixRests  || [])
				.concat(day.rack.freeRests || [])
				.concat(day.rack.paidRests || [])
			);
			var wtList = empTime.getSlicedList(day, [{ from: calc.calcStartTime, to: calc.calcEndTime }], excludes, config, common, false);
			for(var i = 0 ; i < wtList.length ; i++){
				var wt = wtList[i];
				if(wt.dayType == teasp.constant.DAY_TYPE_NORMAL){
					t += (wt.to - wt.from);
				}
			}
		}
		if(sd <= td && td <= ed && (d < td || (d == td && day.rack.worked))){ // 昨日まで（本日分が入力済みなら本日まで）
			curt += t; // 労働時間＋有休を集計
			fixTime += day.rack.fixTime || 0;
			curd = d;  // いつまでか
		}
		allt += t;
		d = teasp.util.date.addDays(d, 1);
	}
	var eod = (curd ? curt : allt) - (curd ? fixTime : pouch.dataObj.month.fixTime); // 過不足を計算
	console.log('allt='    + teasp.util.time.timeValue(allt));
	console.log('curd='    + (curd || ''));
	console.log('curt='    + teasp.util.time.timeValue(curt));
	console.log('fixTime=' + teasp.util.time.timeValue(pouch.dataObj.month.fixTime));
	console.log('excess='  + teasp.util.time.timeValue(eod));
	return {
		label : 'フレックス過不足時間' + (curd ? '(' + teasp.util.date.formatDate(curd, 'M/d') + 'まで)' : ''),
		value : teasp.util.time.timeValue(eod)
	};
};
}