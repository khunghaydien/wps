if(typeof(teasp) == 'object' && !teasp.resolved['V5-1685'] && teasp.helper && teasp.helper.ScheduleImport){
teasp.helper.ScheduleImport.prototype.getImportRange0 = teasp.helper.ScheduleImport.prototype.getImportRange;
teasp.helper.ScheduleImport.prototype.getImportRange = function(dayWrap){
	var result = this.getImportRange0(dayWrap);
	result.rests = [];
	return result;
};
}
