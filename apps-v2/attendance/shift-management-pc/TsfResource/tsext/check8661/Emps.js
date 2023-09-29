define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/check8661/Emp",
	"tsext/check8661/EmpYuq",
	"tsext/check8661/EmpYuqDetail",
	"tsext/check8661/EmpMonth",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Wait, Emp, EmpYuq, EmpYuqDetail, EmpMonth, Util){
	return declare("tsext.check8661.Emps", null, {
		constructor : function(){
			this.emps = [];
		},
		reset: function(){
			for(var i = 0 ; i < this.emps.length ; i++){
				this.emps[i].reset();
			}
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
		getTargetEmpIds: function(){
			var empIds = [];
			for(var i = 0 ; i < this.emps.length ; i++){
				var emp = this.emps[i];
				if(emp.isTarget()){
					empIds.push(emp.getId());
				}
			}
			return empIds;
		},
		buildYuqs: function(){
			for(var i = 0 ; i < this.emps.length ; i++){
				this.emps[i].buildYuqs();
			}
		},
		// 社員を取得
		fetch: function(){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",LastModifiedDate"
				+ ",EmpCode__c"
				+ ",EntryDate__c"
				+ ",EndDate__c"
				+ ",EmpTypeId__c"
				+ ",EmpTypeId__r.Name"
				+ ",EmpTypeHistory__c"
				+ ",DeptId__r.DeptCode__c"
				+ ",DeptId__r.Name"
				+ " from AtkEmp__c"
				;
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					array.forEach(records || [], function(record){
						this.emps.push(new Emp(record));
					}, this);
					deferred.resolve();
				}),
				deferred.reject
			);
			return deferred.promise;
		},
		// 有休付与情報を取得
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
				;
			if(param.empIds && param.empIds.length){
				soql += " where EmpId__c in ('" + param.empIds.join("','") + "')";
			}
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
				;
			if(param.empIds && param.empIds.length){
				soql += " where EmpYuqId__r.EmpId__c in ('" + param.empIds.join("','") + "')";
			}
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
		// 勤怠月次を取得
		fetchEmpMonths: function(param){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",CreatedById"
				+ ",LastModifiedDate"
				+ ",LastModifiedById"
				+ ",EmpId__c"
				+ ",StartDate__c"
				+ ",EndDate__c"
				+ ",YearMonth__c"
				+ ",SubNo__c"
				+ ",EmpApplyId__c"
				+ ",EmpApplyId__r.CreatedDate"
				+ ",EmpApplyId__r.LastModifiedDate"
				+ ",EmpApplyId__r.Status__c"
				+ ",DeptMonthId__r.DeptId__c"
				+ ",DeptMonthId__r.DeptId__r.DeptCode__c"
				+ ",DeptMonthId__r.DeptId__r.Name"
				+ ",EmpTypeId__c"
				+ ",EmpTypeId__r.Name"
				+ ",YuqLog__c"
				+ " from AtkEmpMonth__c"
				;
			if(param.empIds && param.empIds.length){
				soql += " where EmpId__c in ('" + param.empIds.join("','") + "')";
			}
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
		// 不具合影響リストのCSV行を取得
		getErrorLines: function(){
			var lines = [];
			array.forEach(this.emps, function(emp){
				lines = lines.concat(emp.getErrorLines());
			}, this);
			return lines;
		},
		// 不具合影響リストCSV
		getEmpResultCsv: function(lines){
			var value = '"' + [
				'社員コード',
				'社員名',
				'部署コード',
				'部署名',
				'勤務体系名',
				'入社日',
				'付与理由',
				'有効開始日',
				'失効日',
				'付与日数',
				'適正付与日数',
				'付与日時',
				'継続勤務日数',
				'付与時の勤務体系'
			].join('","') + '"\n';
			value += (lines.join('\n') + '\n');
			return value;
		},
		// 全勤怠社員CSV
		getEmpCsv: function(){
			var value = '"' + [
				'社員ID',
				'社員コード',
				'社員名',
				'生成日時',
				'最終更新日時',
				'部署コード',
				'部署名',
				'勤務体系ID',
				'勤務体系名',
				'入社日',
				'退社日',
				'調査対象'
			].join('","') + '"\n';
			array.forEach(this.emps, function(emp){
				value += emp.getEmpCsv();
			}, this);
			return value;
		},
		// 有休付与消化集計CSV
		getEmpYuqCsv: function(){
			var value = '"' + [
				'社員コード',
				'社員名',
				'部署コード',
				'部署名',
				'勤務体系名',
				'入社日',
				'退社日',
				'付与日数',
				'付与時間',
				'消化日数',
				'消化時間',
				'失効日数',
				'失効時間',
				'残日数',
				'残時間'
			].join('","') + '"\n';
			array.forEach(this.emps, function(emp){
				value += emp.getYuqCsv();
			}, this);
			return value;
		},
		// 有休付与消化明細CSV
		getEmpYuqDetailCsv: function(){
			var value = '"' + [
				'社員コード',
				'社員名',
				'部署コード',
				'部署名',
				'勤務体系名',
				'入社日',
				'退社日',
				'分類',
				'基準時間',
				'付与日数',
				'付与時間',
				'消化日数',
				'消化時間',
				'残日数',
				'残時間',
				'失効',
				'有効開始日',
				'失効日',
				'消化日',
				'分割',
				'付与/消化要因',
				'事柄',
				'生成日時',
				'調査対象',
				'適正付与日数',
				'影響',
				'継続勤務日数',
				'付与時の勤務体系',
				'自動付与',
				'付与方法',
				'指定日',
				'付与日数設定'
			].join('","') + '"\n';
			array.forEach(this.emps, function(emp){
				value += emp.getYuqDetailCsv();
			}, this);
			return value;
		},
		// 勤怠月次CSV
		getEmpMonthCsv: function(){
			var value = '"' + [
				'社員コード',
				'社員名',
				'部署コード',
				'部署名',
				'勤務体系名',
				'入社日',
				'退社日',
				'月度',
				'サブNo',
				'勤務体系ID',
				'勤務体系名',
				'開始日',
				'終了日',
				'ステータス',
				'生成日時',
				'最終更新日時',
				'有休ログ'
			].join('","') + '"\n';
			array.forEach(this.emps, function(emp){
				value += emp.getEmpMonthCsv();
			}, this);
			return value;
		}
	});
});
