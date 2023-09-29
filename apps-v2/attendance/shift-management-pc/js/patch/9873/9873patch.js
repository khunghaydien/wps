if(typeof(teasp) == 'object' && !teasp.resolved['9873'] && teasp.dialog && teasp.dialog.EmpApply){
teasp.dialog.EmpApply.prototype.ready0 = teasp.dialog.EmpApply.prototype.ready;
teasp.dialog.EmpApply.prototype.ready = function(){
	this.applyMenus = [
	  'daily'
	, null
	, 'holiday'
	, 'exchange'
	, 'zangyo'
	, 'earlyStart'
	, 'holidayWork'
	, 'patternS'
	, 'patternL'
	, 'lateStart'
	, 'earlyEnd'
	, 'direct'
	, 'reviseTime'
	];
	this.ready0();
};
}
