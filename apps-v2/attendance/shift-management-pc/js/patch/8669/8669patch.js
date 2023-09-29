if(typeof(teasp) == 'object' && !teasp.resolved['8669'] && teasp.data && teasp.data.EmpDay){
teasp.data.EmpDay.prototype.getBorderTime = function(flag){
	var flex = (this.parent.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX);
	if(!flex){
		return {
			st : this.getFixStartTime(flag),
			et : this.getFixEndTime(flag)
		};
	}
	if(this.isUseCoreTime()){
		if(typeof(this.day.rack.bdrStartTime) == 'number'
		&& typeof(this.day.rack.bdrEndTime) == 'number'){
			return {
				st: this.day.rack.bdrStartTime,
				et: this.day.rack.bdrEndTime
			};
		}
		return this.getCoreTime();
	}else{
		return {
			st : -1,
			et : -1
		};
	}
};
}
