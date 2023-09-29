define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/absorber/Emp",
	"tsext/absorber/EmpMonth",
	"tsext/absorber/EmpYuq",
	"tsext/absorber/EmpYuqDetail",
	"tsext/absorber/EmpStock",
	"tsext/absorber/EmpStockDetail",
	"tsext/absorber/CommonAgent",
	"tsext/absorber/LogAgent",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Emp, EmpMonth, EmpYuq, EmpYuqDetail, EmpStock, EmpStockDetail, CommonAgent, LogAgent, Util){
	return declare("tsext.absorber.Emps", null, {
		constructor : function(){
			this.emps = [];
			this.empCodeMap = {};
			this.empNameMap = {};
		},
		// 勤怠社員リストを取得
		fetchEmps: function(){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",LastModifiedDate"
				+ ",EmpCode__c"
				+ ",EntryDate__c"
				+ ",EndDate__c"
				+ ",EmpTypeId__r.Name"
				+ ",EmpTypeHistory__c"
				+ ",DeptId__r.DeptCode__c"
				+ ",DeptId__r.Name"
				+ " from AtkEmp__c"
				;
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					// ソート order by EndDate__c nulls last, CreatedDate, Id の順となるようにする
					// (Request.fetch() の都合で SOQL では指定できないため、JS 側でソートする）
					records = records.sort(function(a, b){
						if((a.EndDate__c && b.EndDate__c) || (!a.EndDate__c && !b.EndDate__c)){
							if(a.EndDate__c != b.EndDate__c){
								return (a.EndDate__c || 0) - (b.EndDate__c || 0);
							}
							if(a.CreatedDate == b.CreatedDate){
								return (a.Id < b.Id ? -1 : 1);
							}
							return a.CreatedDate - b.CreatedDate;
						}else if(a.EndDate__c){
							return -1;
						}
						return 1;
					});
					array.forEach(records, function(record){
						var emp = new Emp(record);
						this.emps.push(emp);
						if(emp.getEmpCode()){
							this.empCodeMap[emp.getEmpCode()] = emp;
						}
					}, this);
					deferred.resolve();
				}),
				deferred.reject
			);
			return deferred.promise;
		},
		// 勤怠月次を取得
		fetchEmpMonths: function(param){
			var deferred = new Deferred();
			var plus = CommonAgent.getValidMappedFields();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",CreatedById"
				+ ",CreatedBy.Name"
				+ ",LastModifiedDate"
				+ ",LastModifiedById"
				+ ",LastModifiedBy.Name"
				+ ",EmpId__c"
				+ ",StartDate__c"
				+ ",EndDate__c"
				+ ",YearMonth__c"
				+ ",SubNo__c"
				+ ",EmpApplyId__r.Status__c"
				+ ",DeptMonthId__r.DeptId__c"
				+ (plus.length ? "," + plus.join(",") : "")
				+ " from AtkEmpMonth__c"
				+ " where EmpId__c in ('" + param.empIds.join("','") + "')"
				+ " and YearMonth__c = " + param.yearMonth
				+ " and SubNo__c = " + (param.subNo || "null")
				;
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					array.forEach(records, function(record){
						var month = new EmpMonth(record);
						var emp = this.getEmpById(month.getEmpId());
						if(emp){
							emp.addEmpMonth(month);
						}
					}, this);
					deferred.resolve(param);
				}),
				deferred.reject
			);
			return deferred.promise;
		},
		// 勤怠有休を取得
		fetchEmpYuqs: function(param){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",CreatedById"
				+ ",CreatedBy.Name"
				+ ",LastModifiedDate"
				+ ",LastModifiedById"
				+ ",LastModifiedBy.Name"
				+ ",EmpId__c"
				+ ",StartDate__c"
				+ ",LimitDate__c"
				+ ",Date__c"
				+ ",TotalTime__c"
				+ ",BaseTime__c"
				+ ",EmpApplyId__c"
				+ ",EmpApplyId__r.Name"
				+ ",EmpApplyId__r.Status__c"
				+ ",EmpApplyId__r.ApplyType__c"
				+ ",EmpApplyId__r.StartDate__c"
				+ ",EmpApplyId__r.EndDate__c"
				+ ",EmpApplyId__r.ExcludeDate__c"
				+ ",EmpApplyId__r.Close__c"
				+ ",EmpApplyId__r.HolidayId__r.Name"
				+ ",EmpApplyId__r.HolidayId__r.Type__c"
				+ ",EmpApplyId__r.HolidayId__r.Range__c"
				+ ",EmpApplyId__r.HolidayId__r.Managed__c"
				+ ",EmpApplyId__r.HolidayId__r.ManageName__c"
				+ ",EmpApplyId__r.HolidayId__r.DisplayDaysOnCalendar__c"
				+ ",LostFlag__c"
				+ ",AutoFlag__c"
				+ ",TimeUnit__c"
				+ ",Subject__c"
				+ ",PaidRestTime__c"
				+ ",TempFlag__c"
				+ ",YearOfPaidRestTime__c"
				+ ",SubNoOfPaidRestTime__c"
				+ ",oldNextYuqProvideDate__c"
				+ ",BatchId__c"
				+ ",StockProvideBatchId__c"
				+ ",(select Id, Name from EmpYuqDetailR__r)"
				+ " from AtkEmpYuq__c"
				+ " where EmpId__c in ('" + param.empIds.join("','") + "')"
				;
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					array.forEach(records, function(record){
						var yuq = new EmpYuq(record);
						var emp = this.getEmpById(yuq.getEmpId());
						if(emp){
							emp.addEmpYuq(yuq);
						}
					}, this);
					deferred.resolve(param);
				}),
				deferred.reject
			);
			return deferred.promise;
		},
		// 勤怠有休詳細を取得
		fetchEmpYuqDetails: function(param){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",CreatedById"
				+ ",CreatedBy.Name"
				+ ",LastModifiedDate"
				+ ",LastModifiedById"
				+ ",LastModifiedBy.Name"
				+ ",EmpYuqId__c"
				+ ",EmpYuqId__r.EmpId__c"
				+ ",GroupId__c"
				+ ",Time__c"
				+ " from AtkEmpYuqDetail__c"
				+ " where EmpYuqId__r.EmpId__c in ('" + param.empIds.join("','") + "')"
				;
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					array.forEach(records, function(record){
						var detail = new EmpYuqDetail(record);
						var emp = this.getEmpById(detail.getEmpId());
						if(emp){
							emp.addEmpYuqDetail(detail);
						}
					}, this);
					deferred.resolve(param);
				}),
				deferred.reject
			);
			return deferred.promise;
		},
		// 勤怠積休を取得
		fetchEmpStocks: function(param){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",CreatedById"
				+ ",CreatedBy.Name"
				+ ",LastModifiedDate"
				+ ",LastModifiedById"
				+ ",LastModifiedBy.Name"
				+ ",EmpId__c"
				+ ",Type__c"
				+ ",StartDate__c"
				+ ",LimitDate__c"
				+ ",Date__c"
				+ ",Days__c"
				+ ",EmpApplyId__c"
				+ ",EmpApplyId__r.Name"
				+ ",EmpApplyId__r.Status__c"
				+ ",EmpApplyId__r.ApplyType__c"
				+ ",EmpApplyId__r.StartDate__c"
				+ ",EmpApplyId__r.EndDate__c"
				+ ",EmpApplyId__r.ExcludeDate__c"
				+ ",EmpApplyId__r.Close__c"
				+ ",EmpApplyId__r.HolidayId__r.Name"
				+ ",EmpApplyId__r.HolidayId__r.Type__c"
				+ ",EmpApplyId__r.HolidayId__r.Range__c"
				+ ",EmpApplyId__r.HolidayId__r.Managed__c"
				+ ",EmpApplyId__r.HolidayId__r.ManageName__c"
				+ ",EmpApplyId__r.HolidayId__r.DisplayDaysOnCalendar__c"
				+ ",LostFlag__c"
				+ ",ConsumedDays__c"
				+ ",DaiqAllBorderTime__c"
				+ ",DaiqHalfBorderTime__c"
				+ ",DayType__c"
				+ ",RemainDays__c"
				+ ",WorkRealTime__c"
				+ ",BatchKey__c"
				+ ",Removed__c"
				+ ",(select Id, Name from Consumes__r)"
				+ " from AtkEmpStock__c"
				+ " where EmpId__c in ('" + param.empIds.join("','") + "')"
				;
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					array.forEach(records, function(record){
						var stock = new EmpStock(record);
						var emp = this.getEmpById(stock.getEmpId());
						if(emp){
							emp.addEmpStock(stock);
						}
					}, this);
					deferred.resolve(param);
				}),
				deferred.reject
			);
			return deferred.promise;
		},
		// 勤怠積休詳細を取得
		fetchEmpStockDetails: function(param){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",CreatedById"
				+ ",CreatedBy.Name"
				+ ",LastModifiedDate"
				+ ",LastModifiedById"
				+ ",LastModifiedBy.Name"
				+ ",ConsumesStockId__c"
				+ ",ConsumedByStockId__c"
				+ ",Days__c"
				+ ",ConsumesStockId__r.EmpId__c"
				+ ",ConsumesStockId__r.Type__c"
				+ ",ConsumedByStockId__r.LostFlag__c"
				+ " from AtkEmpStockDetail__c"
				+ " where ConsumesStockId__r.EmpId__c in ('" + param.empIds.join("','") + "')"
				;
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					array.forEach(records, function(record){
						var detail = new EmpStockDetail(record);
						var emp = this.getEmpById(detail.getEmpId());
						if(emp){
							emp.addEmpStockDetail(detail);
						}
					}, this);
					deferred.resolve(param);
				}),
				deferred.reject
			);
			return deferred.promise;
		},
		reset: function(){
			for(var i = 0 ; i < this.emps.length ; i++){
				this.emps[i].reset();
			}
		},
		buildYuqs: function(){
			for(var i = 0 ; i < this.emps.length ; i++){
				this.emps[i].buildYuqs();
			}
		},
		buildStocks: function(){
			for(var i = 0 ; i < this.emps.length ; i++){
				this.emps[i].buildStocks();
			}
		},
		getEmps: function(){
			return this.emps;
		},
		getEmpById: function(id){
			for(var i = 0 ; i < this.emps.length ; i++){
				var emp = this.emps[i];
				if(emp.getId() == id){
					return emp;
				}
			}
			return null;
		},
		getEmpByEmpCode: function(empCode){
			return this.empCodeMap[empCode];
		},
		getStockTypeList: function(){
			var mp = {};
			for(var i = 0 ; i < this.emps.length ; i++){
				var emp = this.emps[i];
				var types = emp.getStockTypeList();
				for(var j = 0 ; j < types.length ; j++){
					mp[types[j]] = 1;
				}
			}
			return Object.keys(mp).sort(function(a, b){
				return (a < b ? -1 : 1);
			});
		}
	});
});
