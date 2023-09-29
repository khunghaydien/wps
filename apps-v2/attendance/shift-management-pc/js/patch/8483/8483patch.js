if(typeof(teasp) == 'object' && !teasp.resolved['8483'] && teasp.view && teasp.view.Daily){
teasp.view.Daily.prototype.pushTimeStep4 = function(geoerr, callback){
	this.showBusyWait();
	var soql = "select Id, DailyApplyId__c from AtkEmpDay__c where EmpMonthId__r.EmpId__c = '" + this.pouch.getEmpId() + "' and Date__c = " + this.pouch.getParamDate();
	teasp.action.contact.remoteMethods(
		[{ funcName: 'getExtResult', params: { soql: soql, limit: 1, offset: 0 } }],
		{ errorAreaId: null, nowait: true },
		dojo.hitch(this, function(result){
			teasp.util.excludeNameSpace(result);
			console.log(result);
			this.pushTimeStep5({
				empDayId:     (result.records.length && result.records[0].Id) || null,
				dailyApplyId: (result.records.length && result.records[0].DailyApplyId__c) || null,
				recordLen:    result.records.length
			}, geoerr, callback);
		}),
		dojo.hitch(this, function(result){
			console.log(result);
            teasp.manager.dialogClose('BusyWait2');
			callback();
		}),
		this
	);
};
teasp.view.Daily.prototype.pushTimeStep5 = function(param, geoerr, callback){
	var soql = "select Id from AtkEmpApply__c where EmpId__c = '" + this.pouch.getEmpId() + "' and ApplyType__c = '日次確定' and Status__c in ('承認待ち','承認済み','確定済み') and StartDate__c = " + this.pouch.getParamDate();
	teasp.action.contact.remoteMethods(
		[{ funcName: 'getExtResult', params: { soql: soql, limit: 1, offset: 0 } }],
		{ errorAreaId: null, nowait: true },
		dojo.hitch(this, function(result){
			teasp.util.excludeNameSpace(result);
			console.log(result);
			this.pushTimeStep6({
				empDayId:     param.empDayId,
				dailyApplyId: (result.records.length && result.records[0].Id),
				recordLen:    result.records.length
			}, geoerr, callback);
		}),
		dojo.hitch(this, function(result){
			console.log(result);
            teasp.manager.dialogClose('BusyWait2');
			callback();
		}),
		this
	);
};
teasp.view.Daily.prototype.pushTimeStep6 = function(param, geoerr, callback){
	var values = {};
	values[param.empDayId] = {DailyApplyId__c: param.dailyApplyId};
	var typeMap = {
		DailyApplyId__c:'REFERENCE'
	};
	teasp.action.contact.remoteMethods(
		[{
			funcName: 'getExtResult',
			params	 : {
				action	: 'updateSObject',
				objName : 'AtkEmpDay__c',
				idList	: [ param.empDayId ],
				values	: values,
				typeMap : typeMap
			}
		}],
		{ errorAreaId: null, nowait: true },
		dojo.hitch(this, function(result){
			teasp.util.excludeNameSpace(result);
			console.log(result);
			this.pushTimeStep7(geoerr, callback);
		}),
		dojo.hitch(this, function(result){
			console.log(result);
            teasp.manager.dialogClose('BusyWait2');
			callback();
		}),
		this
	);
};
teasp.view.Daily.prototype.pushTimeStep7 = function(geoerr, callback){
	teasp.manager.dialogClose('BusyWait2');
	if(geoerr){
		var err = teasp.view.Widget.getGetLocationError(geoerr);
		this.showMessage(err, callback);
	}else{
		callback();
	}
};
}
