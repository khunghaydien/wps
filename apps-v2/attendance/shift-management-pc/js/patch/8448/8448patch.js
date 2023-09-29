if(typeof(teasp) == 'object' && !teasp.resolved['8448'] && teasp.data && teasp.data.EmpDay){
teasp.data.EmpDay.prototype.isDivergeBeforeJudge = function(flag){
	return (this.isInputed()
	&& this.getDivergenceJudge().type < 0
	&& !this.parent.isPermitDailyApply());
};
}
