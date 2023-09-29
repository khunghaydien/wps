if(typeof(teasp) == 'object' && !teasp.resolved['9768'] && teasp.view && teasp.view.Monthly){
var globalPathUpdateEmpDept = false;
teasp.view.Monthly.prototype.viewPostProcess0 = teasp.view.Monthly.prototype.viewPostProcess;
teasp.view.Monthly.prototype.viewPostProcess = function(){
	this.viewPostProcess0();
	if(!globalPathUpdateEmpDept && !this.pouch.isReadOnly()){
		globalPathUpdateEmpDept = true;
		var emp = this.pouch.getTargetEmpObj();
		var dhs = this.pouch.getObj().deptHist;
		if(dhs && dhs.length > 0){
			this.patchUpdateEmpDept(emp, dhs);
		}
	}
};
teasp.view.Monthly.prototype.patchUpdateEmpDept = function(emp, dhs){
	var d = null;
	for(var i = 0 ; i < dhs.length ; i++){
		var dh = dhs[i];
		if(!d || dh.endDate == '2999-12-31'){
			d = dh.startDate;
		}
	}
	if(emp.deptStartDate == d){
		return;
	}
	var o = (d ? teasp.util.searchYearMonthDate(emp.configBase.initialDateOfMonth,emp.configBase.markOfMonth,null,d) : null);
	if(!o){
		return;
	}
	var v = {};
	v[emp.id] = {DeptStartDate__c:d,DeptStartMonth__c:o.yearMonth};
	var tm = {DeptStartDate__c:'DATE',DeptStartMonth__c:'DOUBLE'};
	teasp.action.contact.remoteMethods(
		[{funcName:'getExtResult',params:{action:'updateSObject',objName:'AtkEmp__c',idList:[emp.id],values:v,typeMap:tm}}],
		{errorAreaId:null,nowait:true},
		dojo.hitch(this,function(result){
			teasp.util.excludeNameSpace(result);
			if(result.records.length > 0){
				emp.deptStartDate = teasp.logic.convert.valDate(result.records[0].DeptStartDate__c);
				emp.deptStartMonth = result.records[0].DeptStartMonth__c;
			}
			console.log(result);
		}),
		dojo.hitch(this,function(result){console.log(result);}),
		this
	);
};
}