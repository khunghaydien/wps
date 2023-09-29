if(typeof(teasp) == 'object' && !teasp.resolved['V5-2145'] && teasp.view && teasp.view.MonthlySummary){
teasp.view.MonthlySummary.prototype.getPdfWorkData0 = teasp.view.MonthlySummary.prototype.getPdfWorkData;
teasp.view.MonthlySummary.prototype.getPdfWorkData = function(pouch, steps, stepShow){
	const o = this.getPdfWorkData0(pouch, steps, stepShow);
	const head = (o && o.summary && o.summary.head);
	if(head){
		head.deptName    = teasp.patchLineBreak(head.deptName   , 17);
		head.empTypeName = teasp.patchLineBreak(head.empTypeName, 14);
		head.empName     = teasp.patchLineBreak(head.empName    , 14);
	}
	return o;
};
teasp.patchLineBreak = function(val, size){
	const v = val || '';
	const results = [];
	var n = 0;
	while(n < v.length){
		results.push(v.substring(n, n + size));
		n += size;
	}
	return results.join('\n');
};
}
