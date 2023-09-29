if(typeof(teasp) == 'object' && !teasp.resolved['9562'] && teasp.view && teasp.view.Shift){
teasp.view.Shift.prototype.searchShiftData = function(req){
    teasp.manager.dialogOpen('BusyWait');
	if(!this.shiftCache){
		this.shiftCache = {};
	}
	var emp = globalLoadRes.emp || {};
	var mediator = {
		userId   : globalLoadRes.user.Id,
		empId    : emp.Id || null,
		month    : req.month,
		_month   : req._month,
		rangeType: req.rangeType,
		empIds   : req.empIdList,
		startDate: req.startDate,
		endDate  : req.endDate,
		deptId   : req.deptId,
		deptOpt  : req.deptOPt,
		errmsg   : null,
		param    : req
	};
	mediator.minDt = mediator.startDate;
	mediator.maxDt = mediator.endDate;
	mediator.allReader = globalLoadRes.user.Profile.PermissionsModifyAllData
		|| emp.IsAdmin__c || emp.IsAllEditor__c || emp.IsAllReader__c;

	if((mediator.deptOpt & 2) != 0 && mediator.deptId && mediator.deptId != '-1'){
		var soql = dojo.string.substitute("select Id"
			+ ", EmpId__c"
			+ " from AtkEmpApply__c"
			+ " where EndDate__c >= ${0} and StartDate__c <= ${1}"
			+ " and Status__c in ('承認済み','承認待ち','確定済み')"
			+ " and ApplyType__c in ('勤務時間変更申請','長期時間変更申請')"
			+ " and ((WorkPlaceId__c = null and EmpId__r.DeptId__c = '${2}') or WorkPlaceId__c = '${2}')"
			+ " and Removed__c = false"
			, [mediator.startDate, mediator.endDate, mediator.deptId]
			);
		var chain = this.fetch(soql).then(
			dojo.hitch(this, function(records){
				var empIdMap = {};
				for(var i = 0 ; i < records.length ; i++){
					empIdMap[records[i].EmpId__c] = 1;
				}
				mediator.empIds = Object.keys(empIdMap);
				return mediator;
			}),
			dojo.hitch(this, function(errobj){
				mediator.errmsg = teasp.message.getErrorMessage(errobj);
				return mediator;
			})
		);
		chain.then(dojo.hitch(this, this.fetchDept));
	}else{
		this.fetchDept(mediator);
	}
};
teasp.view.Shift.prototype.fetchDept = function(mediator){
	if(mediator.errmsg){
		this.showError(mediator.errmsg);
		this.closeBusyWait();
		return;
	}
	if(mediator.deptId && mediator.deptId != '-1'){
		var soql = dojo.string.substitute("select Id"
			+ ", Name"
			+ " from AtkDept__c"
			+ " where Id = '${0}'"
			, [mediator.deptId]
			);
		var chain = this.fetch(soql).then(
			dojo.hitch(this, function(records){
				if(records.length){
					mediator.param.deptName = records[0].Name;
				}
				return mediator;
			}),
			dojo.hitch(this, function(errobj){
				mediator.errmsg = teasp.message.getErrorMessage(errobj);
				return mediator;
			})
		);
		chain.then(dojo.hitch(this, this.fetchEmps));
	}else{
		this.fetchEmps(mediator);
	}
};
teasp.view.Shift.prototype.fetchEmps = function(mediator){
	if(mediator.errmsg){
		this.showError(mediator.errmsg);
		this.closeBusyWait();
		return;
	}
	var soql = dojo.string.substitute("select Id"
		+ ", EmpTypeId__c"
		+ ", EmpTypeId__r.ConfigBaseId__c"
		+ " from AtkEmp__c"
		+ " where (EntryDate__c = null or EntryDate__c <= ${1})"
		+ " and (EndDate__c = null or EndDate__c >= ${0})"
		, [mediator.startDate, mediator.endDate]
		);
	if(mediator.deptId){
		if(mediator.deptId == '-1'){
			soql += " and (DeptId__c = null";
		}else{
			soql += dojo.string.substitute(" and (DeptId__c = '${0}'", [mediator.deptId]);
		}
		if(mediator.empIds.length){
			soql += dojo.string.substitute(" or Id in ('${0}'))", [mediator.empIds.join("','")]);
		}else{
			soql += ")";
		}
	}else if(mediator.empIds.length){
		soql += dojo.string.substitute(" and Id in ('${0}')", [mediator.empIds.join("','")]);
	}
	if(!mediator.allReader){
		soql += " and (";
		if(mediator.empId){
			soql += dojo.string.substitute("Id = '${0}' or ", [mediator.empId]);
		}
		soql += dojo.string.substitute("Manager__c = '${0}'"
				+ " or DeptId__r.ManagerId__c = '${0}'"
				+ " or DeptId__r.ParentId__r.ManagerId__c = '${0}'"
				+ " or DeptId__r.ParentId__r.ParentId__r.ManagerId__c = '${0}'"
				+ " or DeptId__r.ParentId__r.ParentId__r.ParentId__r.ManagerId__c = '${0}'"
				+ " or DeptId__r.Manager1Id__c = '${0}'"
				+ " or DeptId__r.ParentId__r.Manager1Id__c = '${0}'"
				+ " or DeptId__r.ParentId__r.ParentId__r.Manager1Id__c = '${0}'"
				+ " or DeptId__r.ParentId__r.ParentId__r.ParentId__r.Manager1Id__c = '${0}'"
				+ " or DeptId__r.Manager2Id__c = '${0}'"
				+ " or DeptId__r.ParentId__r.Manager2Id__c = '${0}'"
				+ " or DeptId__r.ParentId__r.ParentId__r.Manager2Id__c = '${0}'"
				+ " or DeptId__r.ParentId__r.ParentId__r.ParentId__r.Manager2Id__c = '${0}'"
				+ ")"
				, [mediator.userId]
				);
	}
	var chain = this.fetch(soql).then(
		dojo.hitch(this, function(records){
			console.log(records);
			var empIdMap = {};
			var empTypeIdMap = {};
			var configBaseIdMap = {};
			for(var i = 0 ; i < records.length ; i++){
				var record = records[i];
				empIdMap[record.Id] = 1;
				if(record.EmpTypeId__c){
					empTypeIdMap[record.EmpTypeId__c] = 1;
					if(record.EmpTypeId__r.ConfigBaseId__c){
						configBaseIdMap[record.EmpTypeId__r.ConfigBaseId__c] = 1;
					}
				}
			}
			mediator.empIds = Object.keys(empIdMap);
			mediator.empTypeIds = Object.keys(empTypeIdMap);
			mediator.configBaseIds = Object.keys(configBaseIdMap);
			return mediator;
		}),
		dojo.hitch(this, function(errobj){
			mediator.errmsg = teasp.message.getErrorMessage(errobj);
			return mediator;
		})
	);
	chain.then(dojo.hitch(this, this.fetchDateRange));
};
teasp.view.Shift.prototype.fetchDateRange = function(mediator){
	if(mediator.errmsg){
		this.showError(mediator.errmsg);
		this.closeBusyWait();
		return;
	}
	var soql = dojo.string.substitute("select Id"
		+ ",StartDate__c"
		+ ",ExchangeDate__c"
		+ ",OriginalStartDate__c"
		+ " from AtkEmpApply__c"
		+ " where EmpId__c in ('${0}')"
		+ " and ApplyType__c = '振替申請'"
		+ " and ((StartDate__c <= ${2} and EndDate__c >= ${1})"
		+ " or (ExchangeDate__c >= ${1} and ExchangeDate__c <= ${2})"
		+ " or (OriginalStartDate__c >= ${1} and OriginalStartDate__c <= ${2}))"
		+ " and Status__c in ('承認済み','承認待ち','確定済み')"
		+ " and Removed__c = false"
		, [mediator.empIds.join("','"), mediator.startDate, mediator.endDate]
		);
	var chain = this.fetch(soql).then(
		dojo.hitch(this, function(records){
			console.log(records);
			var sd = mediator.startDate;
			var ed = mediator.endDate;
			var dmap = {};
			for(var i = 0 ; i < records.length ; i++){
				var record = records[i];
				record.StartDate__c         = teasp.util.date.formatDate(record.StartDate__c);
				record.ExchangeDate__c      = teasp.util.date.formatDate(record.ExchangeDate__c);
				record.OriginalStartDate__c = teasp.util.date.formatDate(record.OriginalStartDate__c);
				if(record.StartDate__c < sd || ed < record.StartDate__c){
					dmap[record.StartDate__c] = 1;
				}
				if(record.ExchangeDate__c < sd || ed < record.ExchangeDate__c){
					dmap[record.ExchangeDate__c] = 1;
				}
				if(record.OriginalStartDate__c < sd || ed < record.OriginalStartDate__c){
					dmap[record.OriginalStartDate__c] = 1;
				}
			}
			var dlst = Object.keys(dmap);
			for(var i = 0 ; i < dlst.length ; i++){
				var d = dlst[i];
				if(d < sd){
					sd = d;
				}
				if(d > ed){
					ed = d;
				}
			}
			mediator.dlst = dlst;
			mediator.minDt = sd;
			mediator.maxDt = ed;
			return mediator;
		}),
		dojo.hitch(this, function(errobj){
			mediator.errmsg = teasp.message.getErrorMessage(errobj);
			return mediator;
		})
	);
	chain.then(dojo.hitch(this, this.fetchEmpType));
};
teasp.view.Shift.prototype.fetchEmpType = function(mediator){
	if(mediator.errmsg){
		this.showError(mediator.errmsg);
		this.closeBusyWait();
		return;
	}
	if(this.shiftCache['empTypes']){
		mediator.empTypes = this.shiftCache['empTypes'];
		this.fetchPattern(mediator);
		return;
	}
	var soql = "select Id"
		+ ",Name"
		+ ",ConfigBaseId__c"
		+ " from AtkEmpType__c"
		;
	var chain = this.fetch(soql).then(
		dojo.hitch(this, function(records){
			console.log(records);
			mediator.empTypes = records;
			this.shiftCache['empTypes'] = mediator.empTypes;
			return mediator;
		}),
		dojo.hitch(this, function(errobj){
			mediator.errmsg = teasp.message.getErrorMessage(errobj);
			return mediator;
		})
	);
	chain.then(dojo.hitch(this, this.fetchPattern));
};
teasp.view.Shift.prototype.fetchPattern = function(mediator){
	if(mediator.errmsg){
		this.showError(mediator.errmsg);
		this.closeBusyWait();
		return;
	}
	if(this.shiftCache['patterns']){
		mediator.patterns = this.shiftCache['patterns'];
		this.fetchEmpTypePattern(mediator);
		return;
	}
	var soql = "select Id"
		+ ",Name"
		+ ",StdStartTime__c"
		+ ",StdEndTime__c"
		+ ",Range__c"
		+ ",RestTimes__c"
		+ ",UseDiscretionary__c"
		+ ",Symbol__c"
		+ ",Removed__c"
		+ ",UseHalfHolidayRestTime__c"
		+ ",AmHolidayRestTimes__c"
		+ ",PmHolidayRestTimes__c"
		+ " from AtkPattern__c"
		+ " where OriginalId__c = null"
		;
	var chain = this.fetch(soql).then(
		dojo.hitch(this, function(records){
			console.log(records);
			mediator.patterns = records;
			this.shiftCache['patterns'] = mediator.patterns;
			return mediator;
		}),
		dojo.hitch(this, function(errobj){
			mediator.errmsg = teasp.message.getErrorMessage(errobj);
			return mediator;
		})
	);
	chain.then(dojo.hitch(this, this.fetchEmpTypePattern));
};
teasp.view.Shift.prototype.fetchEmpTypePattern = function(mediator){
	if(mediator.errmsg){
		this.showError(mediator.errmsg);
		this.closeBusyWait();
		return;
	}
	if(this.shiftCache['empTypePatterns']){
		mediator.empTypePatterns = this.shiftCache['empTypePatterns'];
		this.fetchConfig(mediator);
		return;
	}
	var soql = "select Id"
		+ ",Name"
		+ ",EmpTypeId__c"
		+ ",SchedMonthlyDate__c"
		+ ",SchedMonthlyLine__c"
		+ ",SchedMonthlyWeek__c"
		+ ",SchedOption__c"
		+ ",SchedWeekly__c"
		+ ",Order__c"
		+ ",PatternId__c"
		+ " from AtkEmpTypePattern__c"
		;
	var chain = this.fetch(soql).then(
		dojo.hitch(this, function(records){
			console.log(records);
			mediator.empTypePatterns = records;
			this.shiftCache['empTypePatterns'] = mediator.empTypePatterns;
			return mediator;
		}),
		dojo.hitch(this, function(errobj){
			mediator.errmsg = teasp.message.getErrorMessage(errobj);
			return mediator;
		})
	);
	chain.then(dojo.hitch(this, this.fetchConfig));
};
teasp.view.Shift.prototype.fetchConfig = function(mediator){
	if(mediator.errmsg){
		this.showError(mediator.errmsg);
		this.closeBusyWait();
		return;
	}
	var soql = dojo.string.substitute("select Id"
		+ ",Name"
		+ ",ConfigBaseId__c"
		+ ",ValidStartDate__c"
		+ ",ValidEndDate__c"
		+ ",StdStartTime__c"
		+ ",StdEndTime__c"
		+ ",RestTimes__c"
		+ ",UseDiscretionary__c"
		+ ",Holidays__c"
		+ ",NonPublicHoliday__c"
		+ ",UseHalfHolidayRestTime__c"
		+ ",AmHolidayRestTimes__c"
		+ ",PmHolidayRestTimes__c"
		+ " from AtkConfig__c"
		+ " where Removed__c = false"
		+ " and OriginalId__c = null"
		+ " and (ValidStartDate__c = null or ValidStartDate__c <= ${1})"
		+ " and (ValidEndDate__c   = null or ValidEndDate__c   >= ${0})"
		, [mediator.minDt, mediator.maxDt]
		);
	var chain = this.fetch(soql).then(
		dojo.hitch(this, function(records){
			console.log(records);
			mediator.configs = records;
			return mediator;
		}),
		dojo.hitch(this, function(errobj){
			mediator.errmsg = teasp.message.getErrorMessage(errobj);
			return mediator;
		})
	);
	chain.then(dojo.hitch(this, this.fetchCalendar));
};
teasp.view.Shift.prototype.fetchCalendar = function(mediator){
	if(mediator.errmsg){
		this.showError(mediator.errmsg);
		this.closeBusyWait();
		return;
	}
	var soql = dojo.string.substitute("select Id"
		+ ",Name"
		+ ",Date__c"
		+ ",EmpTypeId__c"
		+ ",Event__c"
		+ ",PlannedHoliday__c"
		+ ",Priority__c"
		+ ",Type__c"
		+ ",DeptId__c"
		+ ",Note__c"
		+ ",ShiftPlan__c"
		+ ",PatternId__r.Id"
		+ ",PatternId__r.Name"
		+ ",PatternId__r.StdStartTime__c"
		+ ",PatternId__r.StdEndTime__c"
		+ ",PatternId__r.Range__c"
		+ ",PatternId__r.RestTimes__c"
		+ ",PatternId__r.UseDiscretionary__c"
		+ ",PatternId__r.Symbol__c"
		+ ",PatternId__r.UseHalfHolidayRestTime__c"
		+ ",PatternId__r.AmHolidayRestTimes__c"
		+ ",PatternId__r.PmHolidayRestTimes__c"
		+ " from AtkCalendar__c"
		+ " where Date__c >= ${0} and Date__c <= ${1}"
		+ (mediator.deptId && mediator.deptId != '-1' ?
			" and (DeptId__c = null or DeptId__c = '${2}')" :
			" and DeptId__c = null")
		, [mediator.minDt, mediator.maxDt, mediator.deptId]
		);
	var chain = this.fetch(soql).then(
		dojo.hitch(this, function(records){
			console.log(records);
			mediator.calendars = records;
			return mediator;
		}),
		dojo.hitch(this, function(errobj){
			mediator.errmsg = teasp.message.getErrorMessage(errobj);
			return mediator;
		})
	);
	chain.then(dojo.hitch(this, this.fetchEmp));
};
teasp.view.Shift.prototype.fetchEmp = function(mediator){
	if(mediator.errmsg){
		this.showError(mediator.errmsg);
		this.closeBusyWait();
		return;
	}
	var soql = dojo.string.substitute("select Id"
		+ ",Name"
		+ ",EmpCode__c"
		+ ",DeptId__c"
		+ ",DeptId__r.DeptCode__c"
		+ ",DeptId__r.Name"
		+ ",DeptId__r.ManagerId__c"
		+ ",DeptId__r.Manager1Id__c"
		+ ",DeptId__r.Manager2Id__c"
		+ ",DeptId__r.ParentId__r.ManagerId__c"
		+ ",DeptId__r.ParentId__r.Manager1Id__c"
		+ ",DeptId__r.ParentId__r.Manager2Id__c"
		+ ",DeptId__r.ParentId__r.ParentId__r.ManagerId__c"
		+ ",DeptId__r.ParentId__r.ParentId__r.Manager1Id__c"
		+ ",DeptId__r.ParentId__r.ParentId__r.Manager2Id__c"
		+ ",DeptId__r.ParentId__r.ParentId__r.ParentId__r.ManagerId__c"
		+ ",DeptId__r.ParentId__r.ParentId__r.ParentId__r.Manager1Id__c"
		+ ",DeptId__r.ParentId__r.ParentId__r.ParentId__r.Manager2Id__c"
		+ ",EmpTypeId__c"
		+ ",EmpTypeId__r.Name"
		+ ",EmpTypeId__r.ConfigBaseId__c"
		+ ",EmpTypeId__r.ConfigBaseId__r.InitialDateOfMonth__c"
		+ ",EmpTypeId__r.ConfigBaseId__r.MarkOfMonth__c"
		+ ",UserId__c"
		+ ",UserId__r.SmallPhotoUrl"
		+ ",Title__c"
		+ ",DefaultRule__c"
		+ ",Manager__c"
		+ ",Manager__r.Name"
		+ " from AtkEmp__c"
		+ " where Id in ('${0}')"
		+ " and Hidden__c = false"
		, [mediator.empIds.join("','")]
		);
	var chain = this.fetch(soql).then(
		dojo.hitch(this, function(records){
			console.log(records);
			mediator.emps = records;
			return mediator;
		}),
		dojo.hitch(this, function(errobj){
			mediator.errmsg = teasp.message.getErrorMessage(errobj);
			return mediator;
		})
	);
	chain.then(dojo.hitch(this, this.fetchEmpMonth));
};
teasp.view.Shift.prototype.fetchEmpMonth = function(mediator){
	if(mediator.errmsg){
		this.showError(mediator.errmsg);
		this.closeBusyWait();
		return;
	}
	var soql = dojo.string.substitute("select Id"
		+ ",Name"
		+ ",EmpId__c"
		+ ",EmpId__r.Name"
		+ ",EmpApplyId__r.Status__c"
		+ ",YearMonth__c"
		+ ",StartDate__c"
		+ ",EndDate__c"
		+ " from AtkEmpMonth__c"
		+ " where EmpId__c in ('${0}')"
		+ " and (EndDate__c >= ${1} and StartDate__c <= ${2})"
		, [mediator.empIds.join("','"), mediator.minDt, mediator.maxDt]
		);
	var chain = this.fetch(soql).then(
		dojo.hitch(this, function(records){
			console.log(records);
			mediator.empMonths = records;
			return mediator;
		}),
		dojo.hitch(this, function(errobj){
			mediator.errmsg = teasp.message.getErrorMessage(errobj);
			return mediator;
		})
	);
	chain.then(dojo.hitch(this, this.fetchEmpApply));
};
teasp.view.Shift.prototype.fetchEmpApply = function(mediator){
	if(mediator.errmsg){
		this.showError(mediator.errmsg);
		this.closeBusyWait();
		return;
	}
	var soql = dojo.string.substitute("select Id"
		+ ",Name"
		+ ",EmpId__c"
		+ ",ApplyType__c"
		+ ",ApplyTime__c"
		+ ",DayType__c"
		+ ",Status__c"
		+ ",StartDate__c"
		+ ",EndDate__c"
		+ ",StartTime__c"
		+ ",EndTime__c"
		+ ",Decree__c"
		+ ",ExchangeDate__c"
		+ ",OriginalStartDate__c"
		+ ",TempFlag__c"
		+ ",Removed__c"
		+ ",Content__c"
		+ ",WorkPlaceId__r.Id"
		+ ",WorkPlaceId__r.Name"
		+ ",WorkPlaceId__r.Symbol__c"
		+ ",WorkPlaceId__r.DeptCode__c"
		+ ",PatternId__r.Id"
		+ ",PatternId__r.Name"
		+ ",PatternId__r.StdStartTime__c"
		+ ",PatternId__r.StdEndTime__c"
		+ ",PatternId__r.Range__c"
		+ ",PatternId__r.RestTimes__c"
		+ ",PatternId__r.UseDiscretionary__c"
		+ ",PatternId__r.Symbol__c"
		+ ",PatternId__r.UseHalfHolidayRestTime__c"
		+ ",PatternId__r.AmHolidayRestTimes__c"
		+ ",PatternId__r.PmHolidayRestTimes__c"
		+ ",HolidayId__r.Id"
		+ ",HolidayId__r.Name"
		+ ",HolidayId__r.Range__c"
		+ ",HolidayId__r.Removed__c"
		+ ",HolidayId__r.Type__c"
		+ ",HolidayId__r.YuqSpend__c"
		+ ",HolidayId__r.Symbol__c"
		+ " from AtkEmpApply__c"
		+ " where EmpId__c in ('${0}')"
		+ " and ((StartDate__c <= ${2} and EndDate__c >= ${1})"
		+ " or (ApplyType__c = '振替申請'"
		+ " and ((ExchangeDate__c >= ${1} and ExchangeDate__c <= ${2})"
		+ " or (OriginalStartDate__c >= ${1} and OriginalStartDate__c <= ${2}))))"
		+ " and Status__c in ('承認済み','承認待ち','確定済み')"
		+ " and ApplyType__c in ('勤務時間変更申請','長期時間変更申請','休暇申請','休日出勤申請','振替申請','日次確定申請')"
		+ " and (Removed__c = false or TempFlag__c = true)"
		, [mediator.empIds.join("','"), mediator.minDt, mediator.maxDt]
		);
	var chain = this.fetch(soql).then(
		dojo.hitch(this, function(records){
			console.log(records);
			mediator.empApplys = records;
			return mediator;
		}),
		dojo.hitch(this, function(errobj){
			mediator.errmsg = teasp.message.getErrorMessage(errobj);
			return mediator;
		})
	);
	chain.then(dojo.hitch(this, this.fetchFinish));
};
teasp.view.Shift.prototype.fetchFinish = function(mediator){
	if(mediator.errmsg){
		this.showError(mediator.errmsg);
		this.closeBusyWait();
		return;
	}
	this.collectData(mediator);
	this.createTable();
	this.closeBusyWait();
};
teasp.view.Shift.prototype.fetch = function(soql){
	var deferred = new dojo.Deferred();
	var param = {
		nextId: null,
		allRows: false,
		limit: 1000,
		records: []
	};
	this.fetchLoop(
		soql,
		param,
		function(){
			deferred.resolve(param.records);
		},
		function(errobj){
			deferred.reject(errobj);
		}
	);
	return deferred.promise;
};
teasp.view.Shift.prototype.fetchLoop = function(soql, param, onSuccess, onFailure){
	var _soql;
	if(param.nextId){
		if(soql.indexOf(' where ') > 0){
			_soql = soql + " and ";
		}else{
			_soql = soql + " where ";
		}
		_soql += "Id > '" + param.nextId + "' order by Id";
	}else{
		_soql = soql + " order by Id";
	}
	this.contact(
		{
			funcName: 'collectShift',
			params	: {
				extendMode: true,
				soql   : _soql,
				limit  : param.limit,
				offset : 0,
				allRows: param.allRows
			}
		},
		dojo.hitch(this, function(result){
			var record = (result.records.length > 0 ? result.records[result.records.length - 1] : null);
			param.records = param.records.concat(result.records);
			if(record && result.records.length >= param.limit){
				param.nextId = record.Id;
				this.fetchLoop(soql, param, onSuccess, onFailure);
			}else{
				onSuccess();
			}
		}),
		dojo.hitch(this, function(errobj){
			onFailure(errobj);
		}),
		true
	);
};
teasp.view.Shift.prototype.contact = function(req, onSuccess, onFailure, nowait){
	teasp.action.contact.remoteMethods(
		(is_array(req) ? req : [req]),
		{
			errorAreaId : (req.errorAreaId ? req.errorAreaId : this.errorAreaId),
			nowait		: (nowait || false)
		},
		onSuccess,
		onFailure,
		this
	);
};
}
