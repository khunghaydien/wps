/*
 * 日次データ出力のソース
 *
 *
 */
tsq.QueryObj.prototype.buildForm = function(){
	this.destroy();
	var that = this;
	this.contact(
		{
			funcName: 'getExtResult',
			params	: { soql: 'select Id, DeptCode__c, Name, ParentId__c from AtkDept__c', limit: 1000, offset: 0 }
		},
		function(result){
			that.depts = result.records;
			tsq.QueryObj.levelingDepts(that.depts);
			this.step();
			that.buildForm2();
		},
		true
	);
};

tsq.QueryObj.prototype.buildForm2 = function(){
	var today = new Date();
	var lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	var qform = dojo.byId('queryForm');
	var tbody = dojo.create('tbody', null, dojo.create('table', { className: 'pane_table' }, qform));

	var row = dojo.create('tr', null, tbody);

	var table = dojo.create('table', { className: 'pane_table' }, qform);
	tbody = dojo.create('tbody', null, table);
	tbody.style.marginTop = '8px';
	row = dojo.create('tr', null, tbody);
	var div = dojo.create('div', { innerHTML: '期間' }, dojo.create('td', { width: '96px' }, row));
	div.style.marginRight = '20px';

	new dijit.form.NumberSpinner({ value:today.getFullYear() , constraints:{ min:1900,max:2100, pattern:'####' }, id:"queryStartYear" , style:"width:60px;margin-right:2px;" }, dojo.create('div', null, dojo.create('td', null, row)));
	new dijit.form.NumberSpinner({ value:today.getMonth() + 1, constraints:{ min:1	 ,max:12  , pattern:'00'   }, id:"queryStartMonth", style:"width:42px;margin-right:2px;" }, dojo.create('div', null, dojo.create('td', null, row)));
	new dijit.form.NumberSpinner({ value:1					 , constraints:{ min:1	 ,max:31  , pattern:'00'   }, id:"queryStartDate" , style:"width:42px;margin-right:2px;" }, dojo.create('div', null, dojo.create('td', null, row)));

	div = dojo.create('div', { innerHTML: '～', style: 'margin-left:4px;margin-right:4px;' }, dojo.create('td', null, row));
	div.style.marginLeft  = '4px';
	div.style.marginRight = '4px';

	new dijit.form.NumberSpinner({ value:lastDate.getFullYear() , constraints:{ min:1900,max:2100,pattern:'####' }, id:"queryEndYear" , style:"width:60px;margin-right:2px;" }, dojo.create('div', null, dojo.create('td', null, row)));
	new dijit.form.NumberSpinner({ value:lastDate.getMonth() + 1, constraints:{ min:1	,max:12  ,pattern:'00'	 }, id:"queryEndMonth", style:"width:42px;margin-right:2px;" }, dojo.create('div', null, dojo.create('td', null, row)));
	new dijit.form.NumberSpinner({ value:lastDate.getDate() 	, constraints:{ min:1	,max:31  ,pattern:'00'	 }, id:"queryEndDate" , style:"width:42px;margin-right:2px;" }, dojo.create('div', null, dojo.create('td', null, row)));

	this.dijitParts['queryStartYear' ] = 1;
	this.dijitParts['queryStartMonth'] = 1;
	this.dijitParts['queryStartDate' ] = 1;
	this.dijitParts['queryEndYear'   ] = 1;
	this.dijitParts['queryEndMonth'  ] = 1;
	this.dijitParts['queryEndDate'   ] = 1;

	table = dojo.create('table', { className: 'pane_table' }, qform);
	table.style.marginTop = '8px';
	tbody = dojo.create('tbody', null, table);
	row = dojo.create('tr', null, tbody);
	div = dojo.create('div', { innerHTML: '部署' }, dojo.create('td', { width: '96px' }, row));
	div.style.marginRight = '20px';
	var select = dojo.create('select', { id: 'queryDept' }, dojo.create('td', null, row));
	dojo.create('option', { innerHTML: '(すべて)', value: '-' }, select);
	for(var i = 0 ; i < this.depts.length ; i++){
		var dept = this.depts[i];
		dojo.create('option', { innerHTML: dept.displayName, value: dept.Id }, select);
	}
	row = dojo.create('tr', null, tbody);
	dojo.create('td', null, row);
	var label = dojo.create('label', null, dojo.create('td', null, row));
	label.style.paddingTop = '4px';
	dojo.create('input', { type: 'checkbox', id: 'queryDeptBelow' }, label);
	dojo.create('span', { innerHTML: ' 下位層を含める（3階層分まで）' }, label);

	table = dojo.create('table', { className: 'pane_table' }, qform);
    table.style.marginTop = '8px';
	tbody = dojo.create('tbody', null, table);
	row = dojo.create('tr', null, tbody);
	div = dojo.create('div', { innerHTML: '社員コード<br/>(前方一致検索)' }, dojo.create('td', { width: '96px', rowSpan: 4, style: 'vertical-align:top;' }, row));
	dojo.create('input', { type: 'text', id: 'queryEmpCode1', style: 'width:90px;', maxLength:20, className: 'inputran' }, dojo.create('td', null, row));

    row = dojo.create('tr', null, tbody);
    dojo.create('input', { type: 'text', id: 'queryEmpCode2', style: 'width:90px;', maxLength:20, className: 'inputran' }, dojo.create('td', null, row));

    row = dojo.create('tr', null, tbody);
    dojo.create('input', { type: 'text', id: 'queryEmpCode3', style: 'width:90px;', maxLength:20, className: 'inputran' }, dojo.create('td', null, row));

    row = dojo.create('tr', null, tbody);
    label = dojo.create('label', null, dojo.create('td', null, row));
    dojo.create('input', { type: 'checkbox', id: 'queryEmpExclude' }, label);
    dojo.create('span', { innerHTML: ' これらの社員を除く' }, label);

	var inp = dojo.create('input', { type: 'button', value: 'ダウンロード', style: 'margin-top:20px;' }, qform);
	dojo.connect(inp, 'onclick', this, function(){
		this.folder = {};
		var sm = new Date(parseInt(dijit.byId('queryStartYear').value, 10), parseInt(dijit.byId('queryStartMonth').value, 10) - 1, parseInt(dijit.byId('queryStartDate').value, 10));
		var em = new Date(parseInt(dijit.byId('queryEndYear').value, 10)  , parseInt(dijit.byId('queryEndMonth').value	, 10) - 1, parseInt(dijit.byId('queryEndDate').value, 10));
		this.folder.param = {
			sm	        : teasp.util.date.formatDate(sm),
			em	        : teasp.util.date.formatDate(em),
			deptId      : (dojo.byId('queryDept').value == '-' ? null : dojo.byId('queryDept').value),
			deep        : dojo.byId('queryDeptBelow').checked,
			empCode1    : dojo.byId('queryEmpCode1').value.trim(),
            empCode2    : dojo.byId('queryEmpCode2').value.trim(),
            empCode3    : dojo.byId('queryEmpCode3').value.trim(),
            empExclude  : dojo.byId('queryEmpExclude').checked
		};
        if(this.folder.param.sm > this.folder.param.em){
			teasp.util.showErrorArea('期間が正しくありません', 'error_area');
			return;
        }
		teasp.manager.dialogOpen('BusyWait');

		var soql = "select StartDate__c, ExchangeDate__c, OriginalStartDate__c from AtkEmpApply__c"
		+ " where ApplyType__c = '振替申請'"
		+ " and ((StartDate__c <= {1} and EndDate__c >= {0}) or (ExchangeDate__c >= {0} and ExchangeDate__c <= {1}) or (OriginalStartDate__c >= {0} and OriginalStartDate__c <= {1}))"
		+ " and (Status__c = null or Status__c = '承認待ち' or Status__c = '承認済み' or Status__c = '確定済み')"
		+ " and Removed__c = false";
		if(this.folder.param.deptId){
			soql += " and (EmpId__r.DeptId__c = '{2}'";
			if(this.folder.param.deep){
				soql += " or EmpId__r.DeptId__r.ParentId__c = '{2}'";
				soql += " or EmpId__r.DeptId__r.ParentId__r.ParentId__c = '{2}'";
			}
			soql += ')';
		}
		var emlst = [];
		if(this.folder.param.empCode1){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpId__r.EmpCode__c like '{3}%')");
		}
        if(this.folder.param.empCode2){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpId__r.EmpCode__c like '{4}%')");
        }
        if(this.folder.param.empCode3){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpId__r.EmpCode__c like '{5}%')");
        }
        if(emlst.length > 0){
            soql += (" and (" + emlst.join(this.folder.param.empExclude ? " and " : " or ") + ")");
        }
		soql = tsq.getString(soql, this.folder.param.sm, this.folder.param.em, this.folder.param.deptId, this.folder.param.empCode1, this.folder.param.empCode2, this.folder.param.empCode3);
		this.search(soql, true);
	});
};

tsq.QueryObj.levelingDepts = function(depts){
	depts = depts.sort(function(a, b){
		return (a.DeptCode__c < b.DeptCode__c ? -1 : (a.DeptCode__c > b.DeptCode__c ? 1 : 0));
	});
	var setDeptLevel = function(depts, parent, oo){
		var parentId = (parent ? parent.Id : null);
		for(var i = 0 ; i < depts.length ; i++){
			var dept = depts[i];
			if(dept.ParentId__c == parentId){
				if(parent){
					parent.parentFlag = true;
					dept.parentMap = (parent.parentMap ? dojo.clone(parent.parentMap) : {});
					dept.parentMap[parent.id] = parent.level;
				}
				dept.level = (parent ? parent.level + 1 : 1);
				var spc = '';
				for(var j = 0 ; j < dept.level ; j++){
					spc += '&nbsp;&nbsp;';
				}
				dept.displayName = spc + dept.DeptCode__c + '-' + dept.Name;
				dept.order = oo.order++;
				setDeptLevel(depts, dept, oo);
			}
		}
	};
	setDeptLevel(depts, null, { order: 1 });
	return depts.sort(function(a, b){
		return a.order - b.order;
	});
};

tsq.QueryObj.prototype.buildData = function(records){
	if(!this.folder.range){
		var minDt = this.folder.param.sm;
		var maxDt = this.folder.param.em;
		var alst = (records || []);
		for(var i = 0 ; i < alst.length ; i++){
			var a = alst[i];
			if(a.StartDate__c		  < minDt){ minDt = a.StartDate__c; 		}
			if(a.OriginalStartDate__c < minDt){ minDt = a.OriginalStartDate__c; }
			if(a.ExchangeDate__c	  < minDt){ minDt = a.ExchangeDate__c;		}
			if(a.StartDate__c		  > maxDt){ maxDt = a.StartDate__c; 		}
			if(a.OriginalStartDate__c > maxDt){ maxDt = a.OriginalStartDate__c; }
			if(a.ExchangeDate__c	  > maxDt){ maxDt = a.ExchangeDate__c;		}
		}
		this.folder.range = { minDt: minDt, maxDt: maxDt };

		var soql = "select Id, ConfigBaseId__c, ValidStartDate__c, ValidEndDate__c, StdStartTime__c, StdEndTime__c, RestTimes__c, UseDiscretionary__c, Holidays__c, NonPublicHoliday__c"
				+ " from AtkConfig__c where Removed__c = false and OriginalId__c = null"
				+ " and (ValidStartDate__c = null or ValidStartDate__c <= {1}) and (ValidEndDate__c   = null or ValidEndDate__c   >= {0})";
		soql = tsq.getString(soql, this.folder.range.minDt, this.folder.range.maxDt);
		this.search(soql, true);

	}else if(!this.folder.configs){
		this.folder.configs = records;

		var soql = "select Count() from AtkEmpDay__c"
				+ " where Date__c >= {0} and Date__c <= {1}";
		if(this.folder.param.deptId){
			soql += " and (EmpMonthId__r.EmpId__r.DeptId__c = '{2}'";
			if(this.folder.param.deep){
				soql += " or EmpMonthId__r.EmpId__r.DeptId__r.ParentId__c = '{2}'";
				soql += " or EmpMonthId__r.EmpId__r.DeptId__r.ParentId__r.ParentId__c = '{2}'";
			}
			soql += ")";
		}
        var emlst = [];
        if(this.folder.param.empCode1){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpMonthId__r.EmpId__r.EmpCode__c like '{3}%')");
        }
        if(this.folder.param.empCode2){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpMonthId__r.EmpId__r.EmpCode__c like '{4}%')");
        }
        if(this.folder.param.empCode3){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpMonthId__r.EmpId__r.EmpCode__c like '{5}%')");
        }
        if(emlst.length > 0){
            soql += (" and (" + emlst.join(this.folder.param.empExclude ? " and " : " or ") + ")");
        }
		soql = tsq.getString(soql, this.folder.param.sm, this.folder.param.em, this.folder.param.deptId, this.folder.param.empCode1, this.folder.param.empCode2, this.folder.param.empCode3);
		this.getCount(soql, true);

	}else if(typeof(this.folder.empDayCount) != 'number'){
		this.folder.empDayCount = records.count;
		if(this.folder.empDayCount > 20000){
            teasp.manager.dialogClose('BusyWait');
			teasp.util.showErrorArea('対象レコード数が多すぎます。条件を絞り込んでください。', 'error_area');
			return;
		}

		this.search("select Id, Name, ConfigBaseId__c from AtkEmpType__c", true);

	}else if(!this.folder.empTypes){
		this.folder.empTypes = records;

		this.search("select Id, Name, StdStartTime__c, StdEndTime__c, Range__c, RestTimes__c, UseDiscretionary__c from AtkPattern__c", true);

	}else if(!this.folder.patterns){
		this.folder.patterns = records;

		this.search("select EmpTypeId__c, SchedMonthlyDate__c, SchedMonthlyLine__c, SchedMonthlyWeek__c, SchedOption__c, SchedWeekly__c, Order__c, PatternId__c from AtkEmpTypePattern__c", true);

	}else if(!this.folder.empTypePatterns){
		this.folder.empTypePatterns = records;

		var soql = "select Id, Date__c, EmpTypeId__c, Event__c, PlannedHoliday__c, Priority__c, Type__c, DeptId__c, Note__c, ShiftPlan__c"
				+ ", PatternId__r.Id, PatternId__r.Name, PatternId__r.StdStartTime__c, PatternId__r.StdEndTime__c"
				+ ", PatternId__r.Range__c, PatternId__r.RestTimes__c, PatternId__r.UseDiscretionary__c, PatternId__r.Symbol__c"
				+ " from AtkCalendar__c"
				+ " where Date__c >= {0} and Date__c <= {1}";
		soql = tsq.getString(soql, this.folder.range.minDt, this.folder.range.maxDt);
		this.search(soql, true);

	}else if(!this.folder.cals){
		this.folder.cals = records;

		var soql = "select  Id, EmpId__c, ApplyType__c, ApplyTime__c, DayType__c, Status__c, StartDate__c, EndDate__c, StartTime__c, EndTime__c"
			+ ", Decree__c, ExchangeDate__c, OriginalStartDate__c, TempFlag__c, Removed__c"
			+ ", WorkPlaceId__r.Id, WorkPlaceId__r.Name, WorkPlaceId__r.Symbol__c, WorkPlaceId__r.DeptCode__c"
			+ ", PatternId__r.Id, PatternId__r.Name, PatternId__r.StdStartTime__c, PatternId__r.StdEndTime__c"
			+ ", PatternId__r.Range__c, PatternId__r.RestTimes__c, PatternId__r.UseDiscretionary__c, PatternId__r.Symbol__c"
			+ ", HolidayId__r.Id, HolidayId__r.Name, HolidayId__r.Range__c, HolidayId__r.Removed__c"
			+ ", HolidayId__r.Type__c, HolidayId__r.YuqSpend__c"
			+ " from AtkEmpApply__c"
			+ " where ((StartDate__c <= {1} and EndDate__c >= {0})"
			+ " or (ApplyType__c = '振替申請' and ((ExchangeDate__c >= {0} and ExchangeDate__c <= {1}) or (OriginalStartDate__c >= {0} and OriginalStartDate__c <= {1}))))"
			+ " and (Status__c = null or Status__c = '承認待ち' or Status__c = '承認済み' or Status__c = '確定済み')"
			+ " and Removed__c = false and TempFlag__c = false";
		if(this.folder.param.deptId){
			soql += " and (EmpId__r.DeptId__c = '{2}'";
			if(this.folder.param.deep){
				soql += " or EmpId__r.DeptId__r.ParentId__c = '{2}'";
				soql += " or EmpId__r.DeptId__r.ParentId__r.ParentId__c = '{2}'";
			}
			soql += ")";
		}
        var emlst = [];
        if(this.folder.param.empCode1){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpId__r.EmpCode__c like '{3}%')");
        }
        if(this.folder.param.empCode2){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpId__r.EmpCode__c like '{4}%')");
        }
        if(this.folder.param.empCode3){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpId__r.EmpCode__c like '{5}%')");
        }
        if(emlst.length > 0){
            soql += (" and (" + emlst.join(this.folder.param.empExclude ? " and " : " or ") + ")");
        }
		soql = tsq.getString(soql, this.folder.param.sm, this.folder.param.em, this.folder.param.deptId, this.folder.param.empCode1, this.folder.param.empCode2, this.folder.param.empCode3);
		this.search(soql, true);

	}else if(!this.folder.applys){
		this.folder.applys = records;

		var soql = "select Id, Name, EmpMonthId__r.YearMonth__c, EmpMonthId__r.SubNo__c, EmpMonthId__r.EmpId__r.Name, EmpMonthId__r.EmpId__r.EmpCode__c"
				+ ", EmpMonthId__r.EmpId__r.DeptId__r.DeptCode__c, EmpMonthId__r.EmpId__r.DeptId__r.Name"
				+ ", EmpMonthId__r.EmpId__r.EmpTypeId__c, EmpMonthId__r.EmpId__r.EmpTypeId__r.Name"
				+ ", EmpMonthId__r.EmpApplyId__r.Status__c, Date__c, DayType__c, StartTime__c, EndTime__c, RealStartTime__c, RealEndTime__c, Note__c, AbsentTime__c"
				+ ", WorkNetTime__c, WorkWholeTime__c, WorkRealTime__c, WorkOffTime__c, WorkOverTime__c, WorkHolidayTime__c, WorkNightTime__c"
				+ ", HolidayId1__r.PlannedHoliday__c, PatternId__r.Id, PatternId__r.Name, PatternId__r.StdStartTime__c, PatternId__r.StdEndTime__c"
				+ ", PatternId__r.Range__c, PatternId__r.RestTimes__c, PatternId__r.UseDiscretionary__c, OrgDayType__c"
				+ " from AtkEmpDay__c"
				+ " where Date__c >= {0} and Date__c <= {1}";
		if(this.folder.param.deptId){
			soql += " and (EmpMonthId__r.EmpId__r.DeptId__c = '{2}'";
			if(this.folder.param.deep){
				soql += " or EmpMonthId__r.EmpId__r.DeptId__r.ParentId__c = '{2}'";
				soql += " or EmpMonthId__r.EmpId__r.DeptId__r.ParentId__r.ParentId__c = '{2}'";
			}
			soql += ")";
		}
        var emlst = [];
        if(this.folder.param.empCode1){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpMonthId__r.EmpId__r.EmpCode__c like '{3}%')");
        }
        if(this.folder.param.empCode2){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpMonthId__r.EmpId__r.EmpCode__c like '{4}%')");
        }
        if(this.folder.param.empCode3){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpMonthId__r.EmpId__r.EmpCode__c like '{5}%')");
        }
        if(emlst.length > 0){
            soql += (" and (" + emlst.join(this.folder.param.empExclude ? " and " : " or ") + ")");
        }
		soql += " order by EmpMonthId__r.EmpId__r.EmpCode__c, EmpMonthId__r.EmpId__r.Name, Date__c";
		soql = tsq.getString(soql, this.folder.param.sm, this.folder.param.em, this.folder.param.deptId, this.folder.param.empCode1, this.folder.param.empCode2, this.folder.param.empCode3);
		this.search(soql, true);

	}else if(!this.folder.days){
		this.folder.days = records;

		var soql = "select Id, Name, EmpId__c, CalcTime__c, WorkDate__c"
				+ " from AtkEmpWork__c"
				+ " where EmpDayId__r.Date__c >= {0} and EmpDayId__r.Date__c <= {1}";
		if(this.folder.param.deptId){
			soql += " and (EmpDayId__r.EmpMonthId__r.EmpId__r.DeptId__c = '{2}'";
			if(this.folder.param.deep){
				soql += " or EmpDayId__r.EmpMonthId__r.EmpId__r.DeptId__r.ParentId__c = '{2}'";
				soql += " or EmpDayId__r.EmpMonthId__r.EmpId__r.DeptId__r.ParentId__r.ParentId__c = '{2}'";
			}
			soql += ")";
		}
        var emlst = [];
        if(this.folder.param.empCode1){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpDayId__r.EmpMonthId__r.EmpId__r.EmpCode__c like '{3}%')");
        }
        if(this.folder.param.empCode2){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpDayId__r.EmpMonthId__r.EmpId__r.EmpCode__c like '{4}%')");
        }
        if(this.folder.param.empCode3){
            emlst.push((this.folder.param.empExclude ? "(not " : "(") + "EmpDayId__r.EmpMonthId__r.EmpId__r.EmpCode__c like '{5}%')");
        }
        if(emlst.length > 0){
            soql += (" and (" + emlst.join(this.folder.param.empExclude ? " and " : " or ") + ")");
        }
		soql += " order by WorkDate__c, Order__c";
		soql = tsq.getString(soql, this.folder.param.sm, this.folder.param.em, this.folder.param.deptId, this.folder.param.empCode1, this.folder.param.empCode2, this.folder.param.empCode3);
		this.search(soql, true);

	}else{
		this.folder.works = records;
		this.buildData2();
	}
};

tsq.QueryObj.prototype.getWorkTime = function(empId, dt){
	if(!this.folder.workmap){
		this.folder.workmap = {};
		for(var i = 0 ; i < this.folder.works.length ; i++){
			var w = this.folder.works[i];
			var key = w.EmpId__c + teasp.util.date.formatDate(w.WorkDate__c);
			var n = this.folder.workmap[key];
			if(!n){
				this.folder.workmap[key] = (w.CalcTime__c || 0);
			}else{
				this.folder.workmap[key] = (n + (w.CalcTime__c || 0));
			}
		}
	}
	return (this.folder.workmap[empId + dt] || null);
};

tsq.QueryObj.prototype.buildData2 = function(){
	this.step();
	var dkeys = teasp.util.date.getDateList(this.folder.param.sm, this.folder.param.em);

	var i, j, k;
	this.folder.events	   = {};
	this.folder.pubEvents  = {};
	this.folder.emps	   = {};
	var tempCbmap = {};
	var tempPmap  = {};
	var tempEpmap = {};
	var tempCalmap = { common: {} };
	var tempEtmap = {};
	var tempEamap = {};
	var tempDkeys = {};
	// 勤怠関連申請
	for(i = 0 ; i < this.folder.applys.length ; i++){
		var empApply = this.folder.applys[i];
		empApply.startDate		   = teasp.logic.convert.valDate(empApply.StartDate__c);
		empApply.endDate		   = teasp.logic.convert.valDate(empApply.EndDate__c);
		empApply.exchangeDate	   = teasp.logic.convert.valDate(empApply.ExchangeDate__c);
		empApply.originalStartDate = teasp.logic.convert.valDate(empApply.OriginalStartDate__c);
		if(!tempEamap[empApply.EmpId__c]){
			tempEamap[empApply.EmpId__c] = [];
		}
		tempEamap[empApply.EmpId__c].push(empApply);
		if(!dkeys.contains(empApply.startDate)){
			tempDkeys[empApply.startDate] = 1;
		}
		if(!dkeys.contains(empApply.endDate)){
			tempDkeys[empApply.endDate] = 1;
		}
		if(empApply.exchangeDate && !dkeys.contains(empApply.exchangeDate)){
			tempDkeys[empApply.exchangeDate] = 1;
		}
		if(empApply.originalStartDate && !dkeys.contains(empApply.originalStartDate)){
			tempDkeys[empApply.originalStartDate] = 1;
		}
	}
	var allDkeys = [].concat(dkeys);
	for(var key in tempDkeys){
		if(!tempDkeys.hasOwnProperty(key)){
			continue;
		}
		allDkeys.push(key);
	}
	allDkeys = allDkeys.sort(function(a, b){
		return (a < b ? -1 : (a > b ? 1 : 0));
	});

	var sd = allDkeys[0];
	var ed = allDkeys[allDkeys.length - 1];

	for(i = 0 ; i < this.folder.configs.length ; i++){
		var c = this.folder.configs[i];
		if(!tempCbmap[c.ConfigBaseId__c]){
			tempCbmap[c.ConfigBaseId__c] = [];
		}
		c.validStartDate = (c.ValidStartDate__c ? teasp.logic.convert.valDate(c.ValidStartDate__c) : null);
		c.validEndDate	 = (c.ValidEndDate__c	? teasp.logic.convert.valDate(c.ValidEndDate__c  ) : null);
		// 期間内の週休と祝日を得る
		var holidays = (c.Holidays__c || '0000000');
		var weekHolys = [];
		var legalHolys = [];
		for(j = 0 ; j < holidays.length ; j++){
			var h = holidays.substring(j, j + 1);
			if(h != '0'){
				weekHolys.push(j);
			}
			if(h == '2'){
				legalHolys.push(j);
			}
		}
		c.fixHolys = getHolidays(
					teasp.util.date.parseDate(c.validStartDate ? (c.validStartDate <= sd ? sd : c.validStartDate) : sd),
					teasp.util.date.parseDate(c.validEndDate   ? (c.validEndDate   >= ed ? ed : c.validEndDate	) : ed),
					weekHolys,
					false);
		for(var dkey in c.fixHolys){
			if(c.fixHolys.hasOwnProperty(dkey)){
				var fh = c.fixHolys[dkey];
				if(legalHolys.contains(fh.dayOfWeek)){
					fh.dayType = teasp.constant.DAY_TYPE_LEGAL_HOLIDAY;
				}else if(weekHolys.contains(fh.dayOfWeek)){
					fh.dayType = teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
				}else{
					if(c.NonPublicHoliday__c){
						fh.dayType = teasp.constant.DAY_TYPE_NORMAL;
					}else{
						fh.dayType = teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY;
					}
				}
			}
		}
		tempCbmap[c.ConfigBaseId__c].push(c);
	}
	// カレンダー
	for(i = 0 ; i < this.folder.cals.length ; i++){
		var cal = this.folder.cals[i];
		var dkey = teasp.logic.convert.valDate(cal.Date__c);
		var key = (cal.EmpTypeId__c ? cal.EmpTypeId__c : 'common');
		if(!tempCalmap[key]){
			tempCalmap[key] = {};
		}
		tempCalmap[key][dkey] = cal;
	}
	// 勤務パターン
	for(i = 0 ; i < this.folder.patterns.length ; i++){
		var p = this.folder.patterns[i];
		tempPmap[p.Id] = p;
	}
	// 勤務体系別パターン
	for(i = 0 ; i < this.folder.empTypePatterns.length ; i++){
		var ep = this.folder.empTypePatterns[i];
		ep.pattern = tempPmap[ep.PatternId__c];
		if(!tempEpmap[ep.EmpTypeId__c]){
			tempEpmap[ep.EmpTypeId__c] = [];
		}
		tempEpmap[ep.EmpTypeId__c].push(ep);
	}
	this.step();

	// 勤務体系単位・日単位で集約
	for(i = 0 ; i < this.folder.empTypes.length ; i++){
		var empType = this.folder.empTypes[i];
		tempEtmap[empType.Id] = empType;
		empType.patterns = (tempEpmap[empType.Id] || []).sort(function(a, b){ return a.Order__c - b.Order__c; });
		empType.days = {};
		var configs = tempCbmap[empType.ConfigBaseId__c];
		for(j = 0 ; j < allDkeys.length ; j++){
			var dkey = allDkeys[j];
			var d = empType.days[dkey] = {
				date : teasp.util.date.parseDate(dkey)
			};
			if(configs.length == 1){
				d.config = configs[0];
			}else{
				for(k = 0 ; k < configs.length ; k++){
					var c = configs[k];
					if((!c.validStartDate || c.validStartDate <= dkey)
					&& (!c.validEndDate   || c.validEndDate   >= dkey)){
						d.config = c;
						break;
					}
				}
			}
			// 設定から dayType を決定
			d.layer1 = function(){
				var o = {};
				var fh = d.config.fixHolys[dkey];
				o.dayType = (fh ? fh.dayType : teasp.constant.DAY_TYPE_NORMAL);
				o.event = (fh && fh.title || null);
				var ep = tsq.getPatternByDate(empType.patterns, d.date);
				o.pattern = (ep && ep.pattern || null);
				return o;
			}();
			// カレンダーから dayType, pattern を決定
			d.layer2 = function(co, et){
				if(!co && !et){
					return {};
				}
				var o = {};
				var type2DayType = function(type){
					switch(type){
					case '1': return teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
					case '2': return teasp.constant.DAY_TYPE_LEGAL_HOLIDAY;
					case '3': return teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY;
					default : return teasp.constant.DAY_TYPE_NORMAL;
					}
				};
				// 共通の設定
				if(co){
					if(co.Type__c){
						o.dayType = type2DayType(co.Type__c);
						o.plannedHoliday = (co.PlannedHoliday__c || false);
						o.commonPriority = (co.Priority__c == '1');
					}
					if(co.Event__c && co.Event__c.length > 0){
						o.commonEvent = co.Event__c;
					}
					if(co.Note__c && co.Note__c.length > 0){
						o.commonNote = co.Note__c;
					}
				}
				// 勤務体系別の設定
				if(et){
					if(et.Type__c && !o.commonPriority){
						o.dayType = type2DayType(et.Type__c);
						o.plannedHoliday = (et.PlannedHoliday__c || false);
					}
					if(et.Event__c && et.Event__c.length > 0){
						o.event = et.Event__c;
					}
					if(et.Note__c && et.Note__c.length > 0){
						o.note = et.Note__c;
					}
					o.pattern = (et.PatternId__r || null);
				}
				return o;
			}(tempCalmap['common'][dkey] || null, (tempCalmap[empType.Id] || {})[dkey] || null);
			// 日タイプ、勤務パターン、イベントを決定
			d.dayType		 = (d.layer2.dayType ? d.layer2.dayType : d.layer1.dayType);
			d.plannedHoliday = (d.dayType == teasp.constant.DAY_TYPE_NORMAL && d.layer2.plannedHoliday || false);
			d.pattern		 = (d.layer2.pattern ? d.layer2.pattern : d.layer1.pattern);
			var evts = [];
			if(d.layer1.event){
				evts.push(d.layer1.event);
			}
			if(d.layer2.commonEvent){
				evts.push(d.layer2.commonEvent);
			}
			if(d.layer2.event){
				evts.push(d.layer2.event);
			}
			d.event = (evts.length > 0 ? evts.join(teasp.message.getLabel('tm10001470')) : null);
			d.note = d.layer2.note;
			this.folder.pubEvents[dkey] = d.layer1.event;
			this.folder.events[dkey]	= d.layer2.commonEvent;
		}
	}

	var value = '';
	for(i = 0 ; i < this.folder.days.length ; i++){
		var d = this.folder.days[i];
		var dkey = teasp.util.date.formatDate(d.Date__c);
		var empId = d.EmpMonthId__r.EmpId__c;
		if(!this.folder.emps[empId]){
			this.folder.emps[empId] = { days: {}, empType: tempEtmap[d.EmpMonthId__r.EmpId__r.EmpTypeId__c] };
		}
		var emp = this.folder.emps[empId];
		emp.days[dkey] = d;
		d.date = teasp.util.date.formatDate(dkey, 'SLA');
        d.dayOfWeek = teasp.util.date.formatDate(dkey, 'JPW');
		d.wt = this.getWorkTime(d.EmpMonthId__r.EmpId__c, dkey);
		d.sa = (typeof(d.WorkNetTime__c) == 'number' && d.wt !== null ? d.WorkNetTime__c - d.wt : (typeof(d.WorkNetTime__c) == 'number' ? '工数入力なし' : null));
		// 勤怠関連申請
		var applys = [];
		if(tempEamap[empId]){
			var l = tempEamap[empId];
			for(k = 0 ; k < l.length ; k++){
				var a = l[k];
				if((a.startDate <= dkey && dkey <= a.endDate)
				|| (a.ApplyType__c == teasp.constant.APPLY_TYPE_EXCHANGE && dkey == a.exchangeDate)
				|| (a.ApplyType__c == teasp.constant.APPLY_TYPE_EXCHANGE && dkey == a.originalStartDate)){
					applys.push(a);
				}
			}
		}
		var amap = {};
		var dmap = {};
		for(k = 0 ; k < applys.length ; k++){
			var a = applys[k];
			tsq.setApplyToDayObj((a.Decree__c ? dmap : amap), tsq.getApplyKey(a, dkey), a);
		}
		d.applys  = tsq.getValidApplys(amap);
		d.decrees = tsq.getValidApplys(dmap);
		d.fix = (d.EmpMonthId__r.EmpApplyId__r && teasp.constant.STATUS_FIX.contains(d.EmpMonthId__r.EmpApplyId__r.Status__c)
				|| d.applys.dailyFix && teasp.constant.STATUS_FIX.contains(d.applys.dailyFix.Status__c));
		var dp = (d.decrees.patternS || d.decrees.patternL); // シフト設定がある
		var shiftp = (dp && dp.PatternId__r || null);
		var ap = (d.applys.patternS || d.applys.patternL); // 勤務時間変更申請がある
		// 日タイプをセット
		if(!d.fix){
			d.dayType		 = emp.empType.days[dkey].dayType;
			d.plannedHoliday = emp.empType.days[dkey].plannedHoliday;
			d.pattern		 = emp.empType.days[dkey].pattern;
			if(dp){
				if(typeof(dp.DayType__c) == 'string'){
					d.dayType = parseInt(dp.DayType__c, 10);
				}
				d.pattern	= (dp.PatternId__r || null);
				d.workPlace = (dp.WorkPlaceId__r || null);
			}
			if(ap){
				if(typeof(ap.DayType__c) == 'string'){
					d.dayType = parseInt(ap.DayType__c, 10);
				}
				d.pattern	= (ap.PatternId__r || null);
				d.workPlace = (ap.WorkPlaceId__r || null);
			}
			if(d.applys.exchangeS){ // 振替申請がある（振替元）
				d.dayType = emp.empType.days[d.applys.exchangeS.exchangeDate].dayType;
			}else if(!d.applys.exchangeS && d.applys.exchangeE){ // 振替申請がある（振替先）
				d.dayType = emp.empType.days[d.applys.exchangeE.originalStartDate].dayType;
			}
		}else{
			d.dayType		 = parseInt(d.DayType__c, 10);
			d.plannedHoliday = (d.HolidayId1__r && d.HolidayId1__r.PlannedHoliday__c || false);
			d.pattern		 = d.PatternId__r;
		}

		var ktm = {
			dayType : d.dayType,
			hlys	: '',
			excs	: '',
			pats	: '',
			hwks	: '',
			zans	: '',
			ezas	: '',
			lats	: '',
			ends	: '',
			dfxs	: '',
			mfxs	: '',
			shft	: '',
			stst	: '',
			stet	: '',
			st		: '',
			et		: '',
			rst		: '',
			ret		: '',
			whole	: '',
			realt	: '',
			overt	: '',
			holyt	: '',
			night	: '',
			absnt	: '',
			wofft	: '',
			netwt	: '',
			workt	: ''
		};
		var p = (d.applys.patternS || d.applys.patternL);
		var ex = (d.applys.exchangeS || d.applys.exchangeE);
		var kp = (d.pattern || emp.empType.days[dkey].config);
		ktm.pats  = function(_p){
						if(!_p){
							return '';
						}
						if(_p.PatternId__r){
							return _p.PatternId__r.Name + ' (' + p.Status__c + ')';
						}else if(_p.DayType__c == '0'){
							ktm.dayType = 0;
							return '(勤務日)' + ' (' + p.Status__c + ')';
						}else if(_p.DayType__c == '1'){
							ktm.dayType = 1;
							return '(非勤務日)' + ' (' + p.Status__c + ')';
						}
						return '';
					}(p);
		ktm.excs  = function(_ex){
						if(!_ex){
							return '';
						}
						var sd = teasp.util.date.formatDate(_ex.StartDate__c);
						if(sd == dkey){
							return '振替[' + teasp.util.date.formatDate(_ex.ExchangeDate__c, 'M/d') + '] (' + ex.Status__c + ')';
						}else{
							return '振替[' + teasp.util.date.formatDate(_ex.StartDate__c, 'M/d') + '] (' + ex.Status__c + ')';
						}
					}(ex);
		ktm.dfxs  = (d.applys.dailyFix && d.applys.dailyFix.Status__c || '');
		ktm.mfxs  = (d.EmpMonthId__r.EmpApplyId__r && d.EmpMonthId__r.EmpApplyId__r.Status__c || '未確定');
		ktm.shft  = (shiftp && shiftp.Name || '');
		if((d.dayType == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY  // 所定休日 or 祝日
		 || d.dayType == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY)
		&& !d.applys.kyushtu){

		}else if(d.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY && d.OrgDayType__c != '0' && !d.applys.kyushtu){ // 法定休日

		}else{ // 平日
			var hsta = [];
			if(d.applys.holidayAll){
				hsta.push(d.applys.holidayAll.HolidayId__r.Name + ' (' + d.applys.holidayAll.Status__c + ')');
			}
			if(d.applys.holidayAm){
				hsta.push(d.applys.holidayAm.HolidayId__r.Name + ' (' + d.applys.holidayAm.Status__c + ')');
			}
			if(d.applys.holidayPm){
				hsta.push(d.applys.holidayPm.HolidayId__r.Name + ' (' + d.applys.holidayPm.Status__c + ')');
			}
			if(d.applys.holidayTime && d.applys.holidayTime.length > 0){
				for(j = 0 ; j < d.applys.holidayTime.length ; j++){
					var h = d.applys.holidayTime[j];
					hsta.push(h.HolidayId__r.Name + '[' + teasp.util.time.timeValue(h.StartTime__c) + '～' + teasp.util.time.timeValue(h.EndTime__c) + '] (' + h.Status__c + ')');
				}
			}
			ktm.hlys  = (hsta.length > 0 ? hsta.join(', ') : '');
			ktm.zans  = (d.applys.zangyo     ? '[' + teasp.util.time.timeValue(d.applys.zangyo.StartTime__c)     + '～' + teasp.util.time.timeValue(d.applys.zangyo.EndTime__c)     + '] (' + d.applys.zangyo.Status__c     + ')' : '');
			ktm.ezas  = (d.applys.earlyStart ? '[' + teasp.util.time.timeValue(d.applys.earlyStart.StartTime__c) + '～' + teasp.util.time.timeValue(d.applys.earlyStart.EndTime__c) + '] (' + d.applys.earlyStart.Status__c + ')' : '');
			ktm.hwks  = (d.applys.kyushtu    ? '[' + teasp.util.time.timeValue(d.applys.kyushtu.StartTime__c)    + '～' + teasp.util.time.timeValue(d.applys.kyushtu.EndTime__c)    + '] (' + d.applys.kyushtu.Status__c    + ')' : '');
			ktm.lats  = (d.applys.lateStart  ? '[' + teasp.util.time.timeValue(d.applys.lateStart.EndTime__c)  + '] (' + d.applys.lateStart.Status__c + ')' : '');
			ktm.ends  = (d.applys.earlyEnd   ? '[' + teasp.util.time.timeValue(d.applys.earlyEnd.StartTime__c) + '] (' + d.applys.earlyEnd.Status__c  + ')' : '');
			ktm.stst  = teasp.util.time.timeValue(kp.StdStartTime__c);
			ktm.stet  = teasp.util.time.timeValue(kp.StdEndTime__c);
			ktm.st	  = teasp.util.time.timeValue(d.StartTime__c);
			ktm.et	  = teasp.util.time.timeValue(d.EndTime__c);
			ktm.rst	  = teasp.util.time.timeValue(d.RealStartTime__c);
			ktm.ret	  = teasp.util.time.timeValue(d.RealEndTime__c);
			ktm.whole = teasp.util.time.timeValue(d.WorkWholeTime__c);
			ktm.realt = teasp.util.time.timeValue(d.WorkRealTime__c);
			ktm.overt = teasp.util.time.timeValue(d.WorkOverTime__c);
			ktm.holyt = teasp.util.time.timeValue(d.WorkHolidayTime__c);
			ktm.night = teasp.util.time.timeValue(d.WorkNightTime__c);
			ktm.absnt = teasp.util.time.timeValue(d.AbsentTime__c);
			ktm.wofft = teasp.util.time.timeValue(d.WorkOffTime__c);
			ktm.netwt = teasp.util.time.timeValue(d.WorkNetTime__c);
			ktm.workt = teasp.util.time.timeValue(d.wt);
		}

		value += '"' + (d.EmpMonthId__r.EmpId__r.DeptId__r && d.EmpMonthId__r.EmpId__r.DeptId__r.DeptCode__c || '')
			 + '","' + (d.EmpMonthId__r.EmpId__r.DeptId__r && d.EmpMonthId__r.EmpId__r.DeptId__r.Name || '')
			 + '","' + d.EmpMonthId__r.EmpId__r.EmpTypeId__r.Name
			 + '","' + (d.EmpMonthId__r.EmpId__r.EmpCode__c || '')
			 + '","' + d.EmpMonthId__r.EmpId__r.Name
			 + '","' + d.EmpMonthId__r.YearMonth__c + (d.EmpMonthId__r.SubNo__c ? '(' + (d.EmpMonthId__r.SubNo__c + 1) + ')' : '')
			 + '","' + d.date
			 + '","' + d.dayOfWeek
			 + '","' + function(dayType, plan){
						switch(dayType){
						case 0:
							if(plan){
								return '有休計画付与日';
							}
							return '平日';
						case 1: return '所定休日';
						case 2: return '法定休日';
						case 3: return '祝日';
						}
					}(ktm.dayType, d.plannedHoliday)
			 + '","' + ktm.hlys
			 + '","' + ktm.excs
			 + '","' + ktm.pats
			 + '","' + ktm.hwks
			 + '","' + ktm.zans
			 + '","' + ktm.ezas
			 + '","' + ktm.lats
			 + '","' + ktm.ends
			 + '","' + ktm.dfxs
			 + '","' + ktm.mfxs
			 + '","' + ktm.shft
			 + '","' + ktm.stst
			 + '","' + ktm.stet
			 + '","' + ktm.st
			 + '","' + ktm.et
			 + '","' + ktm.rst
			 + '","' + ktm.ret
			 + '","' + ktm.whole
			 + '","' + ktm.realt
			 + '","' + ktm.overt
			 + '","' + ktm.holyt
			 + '","' + ktm.night
			 + '","' + ktm.absnt
			 + '","' + ktm.wofft
			 + '","' + ktm.netwt
			 + '","' + ktm.workt
			 + '","' + tsq.escapeStr(d.Note__c)
			 + '"\r\n';
	}

	var heads = '"部署コード","部署名","勤務体系","社員コード","社員名","月度","日付","曜日","種別"'
			  + ',"休暇申請","振替申請","勤務時間変更申請","休日出勤申請","残業申請","早朝勤務申請","遅刻申請","早退申請","日次確定","月次確定","シフト"'
			  + ',"始業","終業","出社","退社","出社(丸めなし)","退社(丸めなし)","総労働時間","実労働時間","残業時間","法定休日労働時間","深夜労働時間","欠勤時間","休憩時間","実時間","工数合計時間","備考"';
	this.inputDownload(heads, value, 'daily_' + this.folder.param.sm + '_' + this.folder.param.em + '.csv');
};

