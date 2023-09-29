if(typeof(teasp) == 'object' && !teasp.resolved['8796'] && teasp.Tsf && teasp.Tsf.ExpImport){
teasp.Tsf.ExpImport.prototype.getCurrentJob = function(){
	var el = this.fp.getElementByApiKey('JobId__c', null, this.getFormEl());
	var jobId = el.value || null;
	if(jobId){
		var jobs = this.getJobChoices();
		for(var i = 0 ; i < jobs.length ; i++){
			if(jobs[i].getId() == jobId){
				return jobs[i];
			}
		}
	}
	//-- 修正部分 --
	var o = tsfManager.info.cacheJob[jobId];
	if(o){
		return new teasp.Tsf.Job(o);
	}
	//--------------
	return null;
};
}
