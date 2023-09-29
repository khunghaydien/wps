if(typeof(teasp) == 'object' && !teasp.resolved['9723'] && teasp.helper && teasp.helper.ScheduleJobs){
teasp.helper.ScheduleJobs.prototype.mapByCode = function(map, job){
	var o = map[job.getCode()];
	if(!o){
		map[job.getCode()] = job;
	}else{
		allDayEvent = (typeof(job.isAllDayEvent) == 'boolean' ? job.isAllDayEvent : job.isAllDayEvent());
		o.add(job.getSpans(), {minutes:job.getMinutes(), inner:job.getInner(), orgSdt:job.getOrgSdt()}, allDayEvent);
	}
};
}