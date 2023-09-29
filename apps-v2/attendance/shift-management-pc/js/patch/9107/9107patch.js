if(typeof(teasp) == 'object' && !teasp.resolved['9107'] && teasp.data && teasp.data.EmpDay){
teasp.data.EmpDay.prototype.getStartTimeJudge = function(flag){
	var day = this.day;
	var deco = day.deco;
	var direct = (day.rack && day.rack.validApplys && day.rack.validApplys.direct) || 0;
	if(typeof(day.startTime) == 'number'
	&& typeof(day.pushStartTime) == 'number'
	&& day.startTime != day.pushStartTime
	&& deco.ct.st != -2
	&& !(direct & 1)){
		deco.ct.st = -2;
		deco.ct.stan = teasp.message.getLabel('tm10001310', teasp.util.time.timeValue(day.pushStartTime)); // 打刻 {0}
		if(deco.ct.stan && deco.ct.etan){
			deco.ct.note = teasp.message.getLabel('tm10001330', deco.ct.stan, deco.ct.etan); // 出社{0}、退社{1}
		}else if(deco.ct.stan){
			deco.ct.note = teasp.message.getLabel('tm10001340', deco.ct.stan); // 出社{0}
		}
	}
	return (flag ? this.day.deco.ct.stan : this.day.deco.ct.st);
};
teasp.data.EmpDay.prototype.getEndTimeJudge = function(flag){
	var day = this.day;
	var deco = day.deco;
	var direct = (day.rack && day.rack.validApplys && day.rack.validApplys.direct) || 0;
	if(typeof(day.endTime) == 'number'
	&& typeof(day.pushEndTime) == 'number'
	&& day.endTime != day.pushEndTime
	&& deco.ct.et != -2
	&& !(direct & 2)){
		deco.ct.et = -2;
		deco.ct.etan = teasp.message.getLabel('tm10001310', teasp.util.time.timeValue(day.pushEndTime)); // 打刻 {0}
		if(deco.ct.stan && deco.ct.etan){
			deco.ct.note = teasp.message.getLabel('tm10001330', deco.ct.stan, deco.ct.etan); // 出社{0}、退社{1}
		}else if(deco.ct.etan){
			deco.ct.note = teasp.message.getLabel('tm10001350', deco.ct.etan); // 退社{0}
		}
	}
	return (flag ? this.day.deco.ct.etan : this.day.deco.ct.et);
};
}
