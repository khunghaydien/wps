if(typeof(teasp) == 'object' && !teasp.resolved['V5-1023'] && teasp.view && teasp.view.Monthly){
teasp.view.Monthly.prototype.checkPreApplyMonthly0 = teasp.view.Monthly.prototype.checkPreApplyMonthly;
teasp.view.Monthly.prototype.checkPreApplyMonthly = function(){
	console.log('checkPreApplyMonthly');
	var check = this.checkPreApplyMonthly0();
	if(!check){ // エラーあり
		return check;
	}
	var config = this.pouch.getObj().config;
	var OVER_MAX = 30;
	var overs = [];
	if(config.workSystem == teasp.constant.WORK_SYSTEM_FIX // 固定
	|| config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE){ // 変形
		var dlst = this.pouch.getMonthDateList();
		for(var r = 0 ; r < dlst.length ; r++){
			var d = dlst[r];
			var dayWrap = this.pouch.getEmpDay(d);
			if(dayWrap.isHoliday() // 非勤務日
			|| dayWrap.isExistApply(teasp.constant.APPLY_KEY_ZANGYO)){ // 残業申請がある
				continue;
			}
			var st = dayWrap.getPattern().standardFixTime; // 所定労働時間
			var wt = dayWrap.getObj().disc.workRealTime;   // 実労働時間
			if(wt > (st + OVER_MAX)){
				overs.push(d);
			}
		}
	}
	if(overs.length){
		var msg = teasp.message.getLabel('tf10008730' // {0} {1}してください
				, teasp.util.date.joinEx(overs)
				, teasp.message.getLabel('tm10001293')); // 残業申請
		var wtitle = teasp.message.getLabel('tm10001060'); // ＊＊＊＊＊＊ 申請できません ＊＊＊＊＊＊
		var note = "\n（勤務時間が所定労働時間より30分を超える日は残業申請が必要です）";
		alert(wtitle + '\n' + msg + note);
		return false;
	}
	return true;
};
}