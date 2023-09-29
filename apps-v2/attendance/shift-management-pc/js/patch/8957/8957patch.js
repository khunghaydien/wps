if(typeof(teasp) == 'object' && !teasp.resolved['8957'] && teasp.logic && teasp.logic.EmpTime){
teasp.logic.EmpTime.prototype.mergeEmpDay0 = teasp.logic.EmpTime.prototype.mergeEmpDay;
teasp.logic.EmpTime.prototype.mergeEmpDay = function(days, dkey, alst, dlst, config){
	var day = this.mergeEmpDay0(days, dkey, alst, dlst, config);
	var va = day.rack.validApplys;
	var freeRests = day.rack.freeRests || [];
	var htime = 0;
	for(var i = 0 ; i < va.holidayTime.length ; i++){
		var ht = va.holidayTime[i];
		var paids = teasp.util.time.excludeRanges([{from:ht.startTime,to:ht.endTime}], day.rack.fixRests);
		if(paids.length && freeRests.length){
			freeRests = teasp.util.time.excludeRanges(freeRests, paids);
		}
		if(paids.length){
			var h = teasp.logic.EmpTime.getSpanTime(paids);
			va.holidayTime[i]._spendTime = h;
			htime += h;
		}
	}
	if(va.holidayTime.length && htime > day.rack.paidHolyTime){
		var tt = day.timeTable || [];
		for(var j = tt.length - 1 ; j >= 0 ; j--){
			if(tt[j].type == 22){
				tt.splice(j, 1);
			}
		}
		for(var j = 0 ; j < freeRests.length ; j++){
			tt.push({from:freeRests[j].from, to:freeRests[j].to, type:22});
		}
		day.timeTable = tt;
		day.rack.freeRests = freeRests;
		day.rack.holyTime     = htime;
		day.rack.paidRestTime = htime;
		day.rack.paidHolyTime = htime;
	}
	return day;
};
}