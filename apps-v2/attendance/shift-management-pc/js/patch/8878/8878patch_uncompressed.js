if(typeof(teasp) == 'object' && !teasp.resolved['8878'] && teasp.data && teasp.data.EmpDay){
teasp.data.EmpDay.prototype.isMissingLateStartApply = function(){
	var border = this.getBorderTime(true);
	if(border.st < 0){ // 遅刻の境界値がないので遅刻申請不要
		return false;
	}
	var st = (this.day.disc ? this.day.disc.calcStartTime : null);
	if(typeof(st) != 'number'){ // 出社時刻未入力
		return false;
	}
	if(!this.day.disc.lateTime){ // 遅刻がカウントされてない
		return false;
	}
	// 休日出勤(かつ平日に準拠ではない)
	if(this.day.dayType != teasp.constant.DAY_TYPE_NORMAL
	&& this.day.rack
	&& this.day.rack.validApplys
	&& this.day.rack.validApplys.kyushtu
	&& this.day.rack.validApplys.kyushtu.length
	&& !this.day.rack.validApplys.kyushtu[0].useRegulateHoliday
	){
		return false;
	}
	var ls = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_LATESTART);  // 遅刻申請
	var t = (ls && ls.endTime < this.day.disc.startTime
			? teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges([{from:ls.endTime,to:this.day.disc.startTime}], this.day.rack.paidRests))
			: 0
			);
	if(!ls || (t > 0 && ls.endTime < border.et)){ // 遅刻申請がない or	遅刻申請の時刻より出社時刻が遅い
		return true;
	}
	return false;
};
teasp.data.EmpDay.prototype.isMissingEarlyEndApply = function(){
	var border = this.getBorderTime(true);
	if(border.et < 0){ // 遅刻の境界値がないので遅刻申請不要
		return false;
	}
	var et = (this.day.disc ? this.day.disc.calcEndTime : null);
	if(typeof(et) != 'number'){ // 退社時刻未入力
		return false;
	}
	if(!this.day.disc.earlyTime){ // 早退がカウントされてない
		return false;
	}
	// 休日出勤(かつ平日に準拠ではない)
	if(this.day.dayType != teasp.constant.DAY_TYPE_NORMAL
	&& this.day.rack
	&& this.day.rack.validApplys
	&& this.day.rack.validApplys.kyushtu
	&& this.day.rack.validApplys.kyushtu.length
	&& !this.day.rack.validApplys.kyushtu[0].useRegulateHoliday
	){
		return false;
	}
	var ee = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_EARLYEND);	 // 早退申請
	var t = (ee && this.day.disc.endTime < ee.startTime
			? teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges([{from:this.day.disc.endTime,to:ee.startTime}], this.day.rack.paidRests))
			: 0
			);
	if(!ee || (t > 0 && border.st < ee.startTime)){ // 早退申請がない or 早退申請の時刻より退社時刻が早い
		return true;
	}
	return false;
};
}
