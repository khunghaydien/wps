define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/check9173/Emp",
	"tsext/check9173/EmpMonth",
	"tsext/check9173/WaitProgress",
	"tsext/check9173/Const",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Emp, EmpMonth, WaitProgress, Const, Util){
	return declare("tsext.check9173.Emps", null, {
		constructor : function(){
			this.emps = [];
			this.ngCount = 0;
			this.doneCount = 0;
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
		getEmpMonthIds: function(){
			var empMonthIds = [];
			for(var i = 0 ; i < this.emps.length ; i++){
				var emp = this.emps[i];
				empMonthIds = empMonthIds.concat(emp.getEmpMonthIds());
			}
			return empMonthIds;
		},
		getEmpMonthById: function(monthId){
			for(var i = 0 ; i < this.emps.length ; i++){
				var emp = this.emps[i];
				var month = emp.getEmpMonthById(monthId);
				if(month){
					return month;
				}
			}
			return null;
		},
		isDetail: function(){
			return /^detail$/i.test(this.hash);
		},
		getNgCount: function(){
			return this.ngCount;
		},
		getDoneCount: function(){
			return this.doneCount;
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
				+ ",EmpTypeId__r.ConfigBaseId__c"
				+ ",EmpTypeId__r.ConfigBaseId__r.InitialDateOfMonth__c"
				+ ",EmpTypeId__r.ConfigBaseId__r.InitialDateOfYear__c"
				+ ",EmpTypeId__r.ConfigBaseId__r.InitialDayOfWeek__c"
				+ ",EmpTypeId__r.ConfigBaseId__r.MarkOfMonth__c"
				+ ",EmpTypeId__r.ConfigBaseId__r.MarkOfYear__c"
				+ ",ConfigId__r.WorkSystem__c"
				+ ",ConfigId__r.VariablePeriod__c"
				+ ",AdditionalWorkChargeTime__c"
				+ ",WorkChargeTime__c"
				+ " from AtkEmpMonth__c"
				+ " where ConfigId__r.WorkSystem__c='2' and ConfigId__r.VariablePeriod__c >='1'"
				+ " and YearMonth__c >= " + (param.startYm || '201904');
			if(param.endYm){
				soql += " and YearMonth__c <=" + param.endYm;
			}
			if(!param.unsettled){
				soql += " and (EmpApplyId__r.Status__c in ('承認待ち','承認済み','確定済み')";
				soql += " or DeptMonthId__r.Status__c in ('承認待ち','承認済み','確定済み'))";
			}
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					array.forEach(records, function(record){
						var month = new EmpMonth(this, record);
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
		// 全月度情報の配列を返す
		getEmpMonths: function(){
			var empMonths = [];
			array.forEach(this.emps, function(emp){
				empMonths = empMonths.concat(emp.getEmpMonths());
			}, this);
			return empMonths;
		},
		// 月次サマリーデータ取得ループ
		loadEmpMonthPrintLoop: function(param){
			var deferred = new Deferred();
			param.targetSize = this.getEmpMonths().length;
			this.ngCount = 0;
			this.doneCount = 0;
			WaitProgress.setProgressVal1('0/' + this.getEmpMonths().length);
			WaitProgress.setProgressVal2('0');
			this.loadEmpMonthPrint(param, 0, lang.hitch(this, function(flag, result){
				if(flag >= 0){
					deferred.resolve(param);
				}else{
					deferred.reject(result);
				}
			}));
			return deferred.promise;
		},
		// 月次サマリーデータ取得
		loadEmpMonthPrint: function(param, index, callback){
			var empMonths = this.getEmpMonths();
			if(index >= empMonths.length){
				callback(1);
				return;
			}
			if(WaitProgress.isStopped()){
				param.stopped = true;
				callback(0);
				return;
			}
			WaitProgress.setProgressVal1((index + 1) + '/' + empMonths.length);
			var empMonth = empMonths[index];
			empMonth.loadEmpMonthPrint(param, lang.hitch(this, function(flag, result){
				if(flag){
					if(result){ // 不正データあり
						this.ngCount++;
						WaitProgress.setProgressVal2(this.ngCount);
						WaitProgress.setProgressMsg1('<span style="font-weight:bold;">不正データが検出されました。</span>');
						WaitProgress.setProgressMsg2('<span style="font-size:90%;">すべての不正データを検出する必要がありましたらこのまま続行してください。<br/>それ以外は下のボタンで中止していただいてかまいません。</span>');
						WaitProgress.enableStop(true);
					}
					this.doneCount++;
					setTimeout(lang.hitch(this, function(){
						this.loadEmpMonthPrint(param, index + 1, callback);
					}));
				}else{
					callback(-1, result);
				}
			}));
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
		// ヘッダ
		getEmpResultHeads: function(param){
			var heads = [
				'社員コード',
				'社員名',
				'部署コード',
				'部署名',
				'勤務体系名',
				'変形期間',
				'変形開始日',
				'変形終了日',
				'経過月',
				'月度',
				'ステータス',
				'月度開始日',
				'月度終了日',
				'月度最終更新日時',
				'法定時間外割増',
				'本来の法定時間外割増',
				'結果'
			];
			if(!param.normal){
				heads = heads.concat([
					'追加割増労働時間',
					'日付',
					'曜日',
					'週',
					'月内フラグ',
					'所定労働時間',
					'総労働時間',
					'実労働時間',
					'法定時間外残業',
					'法定休日労働',
					'法休と法外残を除く実労働時間',
					'週の法定労働時間',
					'週の所定労働時間',
					'週の法休と法外残を除く実労働時間',
					'週の割増労働時間'
				]);
			}
			return heads;
		},
		// 不具合影響リストCSV
		getEmpResultCsv: function(param, lines){
			var value = '"' + this.getEmpResultHeads(param).join('","') + '"\n';
			value += (lines.join('\n') + '\n');
			return value;
		}
	});
});
