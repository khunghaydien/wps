if(typeof(teasp) == 'object' && !teasp.resolved['9874'] && teasp.view && teasp.view.Monthly){
teasp.view.Monthly.prototype.viewPostProcess0 = teasp.view.Monthly.prototype.viewPostProcess;
teasp.view.Monthly.prototype.viewPostProcess = function(){
	this.viewPostProcess0();
	if(!this.pouch.isReadOnly()){
		this.check9874();
	}
};
teasp.view.Monthly.prototype.check9874 = function(){
	var c9874 = new teasp.Correct9874();
	var eas = this.pouch.dataObj.applys || [];
	for(var i = 0 ; i < eas.length ; i++){
		var ea = eas[i];
		if(ea.applyType != '休暇申請' || !ea.holiday || ea.holiday.range != '1'){
			continue;
		}
		var eds = ea.excludeDate || [];
		for(var j = 0 ; j < eds.length ; j++){
			var ed = eds[j];
			c9874.checkDay(ea, this.pouch.dataObj.days[ed]);
		}
	}
	c9874.update(this.pouch);
};
teasp.Correct9874 = function(){
	this.obj = {};
};
teasp.Correct9874.prototype.checkDay = function(ea, day){
	var holiday = ea.holiday;
	if(holiday.displayDaysOnCalendar && !day.dayType){
		this.setFault(ea, day.date);
	}
};
teasp.Correct9874.prototype.setFault = function(ea, d){
	var o = this.obj[ea.id];
	if(!o){
		o = this.obj[ea.id] = {
			excludeDate: dojo.clone(ea.excludeDate)
		};
	}
	var x = o.excludeDate.indexOf(d);
	if(x >= 0){
		o.excludeDate.splice(x, 1);
	}
};
teasp.Correct9874.prototype.joinDate = function(dates){
	var xs = dates || [];
	var v = '';
	for(var i = 0 ; i < xs.length ; i++){
		v += xs[i].replace(/\-/g, '') + ':';
	}
	return v;
};
teasp.Correct9874.prototype.update = function(pouch){
	var v = {};
	var ids = [];
	for(var key in this.obj){
		var o = this.obj[key];
		v[key] = {ExcludeDate__c: this.joinDate(o.excludeDate)||null};
		ids.push(key);
	}
	if(!ids.length){
		return;
	}
	var tm = {ExcludeDate__c:'STRING'};
	teasp.action.contact.remoteMethods(
		[{funcName:'getExtResult',params:{action:'updateSObject',objName:'AtkEmpApply__c',idList:ids,values:v,typeMap:tm}}],
		{errorAreaId:null,nowait:true},
		dojo.hitch(this,function(result){
			teasp.util.excludeNameSpace(result);
			if(result.records.length > 0){
				this.finish(pouch);
			}
		}),
		dojo.hitch(this,function(result){console.log(result);}),
		this
	);
};
teasp.Correct9874.prototype.finish = function(pouch){
	var eas = pouch.dataObj.applys || [];
	for(var i = 0 ; i < eas.length ; i++){
		var ea = eas[i];
		var o = this.obj[ea.id];
		if(o){
			ea.excludeDate = o.excludeDate;
		}
	}
};
}