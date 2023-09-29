if(typeof(teasp) == 'object' && !teasp.resolved['8943'] && teasp.data && teasp.data.EmpDay){
teasp.data.EmpDay.prototype.getCoreTime = function(){
	var pas = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNS);
	var pal = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNL);
	var pa = (pas || pal);
	if(!pa){
		pa = this.day.rack.validApplys.shiftSet;
	}
	if(pa){
		return {
			st : pa.startTime || pa.pattern.stdStartTime,
			et : pa.endTime   || pa.pattern.stdEndTime
		};
	}
	return {
		st : this.parent.getConfigObj().coreStartTime,
		et : this.parent.getConfigObj().coreEndTime
	};
};
}
