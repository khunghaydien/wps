if(typeof(teasp) == 'object' && !teasp.resolved['V5-3042'] && teasp.data && teasp.data.EmpDay){
teasp.data.EmpDay.prototype.isFlexHalfDayTimeDay = function(){
	if(this.parent.isFlexibleHalfDayTime()
	&& this.day
	&& this.day.rack.flexFlag
	&& !this.day.rack.useCoreTime){
		return true;
	}
	return false;
};
}
