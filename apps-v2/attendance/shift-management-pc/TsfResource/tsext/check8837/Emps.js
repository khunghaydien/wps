define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/check8837/Emp",
	"tsext/check8837/EmpMonth",
	"tsext/check8837/Const",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Wait, Emp, EmpMonth, Const, Util){
	return declare("tsext.check8837.Emps", null, {
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
		isDetail: function(){
			return /^detail$/i.test(this.hash);
		},
		sort: function(){
			this.emps = this.emps.sort(function(a, b){
				return a.compare(b);
			});
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
					this.sort();
					deferred.resolve();
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
				+ ",WeekEndWorkTime__c"            // 所定休日労働時間
				+ ",WeekEndDayLegalFixTime__c"     // 休日日中所定
				+ ",WeekEndDayLegalOutTime__c"     // 休日日中法外
				+ ",WeekEndDayLegalTime__c"        // 休日日中法内
				+ ",WeekEndNightLegalFixTime__c"   // 休日深夜所定
				+ ",WeekEndNightLegalOutTime__c"   // 休日深夜法外
				+ ",WeekEndNightLegalTime__c"      // 休日深夜法内
				+ " from AtkEmpMonth__c"
				;
			if(param.normal){
				soql += " where LastModifiedDate >= " + Const.BORDER_DATETIME;
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
		getErrorLines: function(param){
			var lines = [];
			array.forEach(this.emps, function(emp){
				var line = emp.getErrorLines(param);
				if(line){
					lines = lines.concat(line);
				}
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
				'月度',
				'開始日',
				'終了日',
				'ステータス',
				'最終更新日時',
				'所定休日労働時間',
				'本来の所定休日労働時間'
			].join('","') + '"\n';
			value += (lines.join('\n') + '\n');
			return value;
		}
	});
});
