if(typeof(teasp) == 'object' && !teasp.resolved['9457'] && teasp.logic && teasp.logic.EmpTime){
teasp.logic.EmpTime.prototype.calculateEmpDay0 = teasp.logic.EmpTime.prototype.calculateEmpDay;
teasp.logic.EmpTime.prototype.calculateEmpDay = function(day, period, config, common, calcType){
	if(day.rack.holidayJoin && day.rack.holidayJoin.flag == 2
	&& day.pattern.pmHolidayEndTime < day.rack.orgBdrEndTime){
		day.rack.orgBdrEndTime = day.pattern.pmHolidayEndTime;
	}
	this.calculateEmpDay0(day, period, config, common, calcType);
};
}
