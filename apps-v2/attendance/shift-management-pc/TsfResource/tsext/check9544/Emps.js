define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/check9544/Emp",
	"tsext/check9544/EmpMonth",
	"tsext/check9544/WaitProgress",
	"tsext/check9544/Const",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Emp, EmpMonth, WaitProgress, Const, Util){
	return declare("tsext.check9544.Emps", null, {
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
				+ ",EmpId__r.EntryDate__c"
				+ ",EmpId__r.EndDate__c"
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
				+ ",ConfigId__r.StandardFixTime__c"
				+ ",ConfigId__r.FlexLegalWorkTimeOption__c"
				+ ",AdditionalWorkChargeTime__c"
				+ ",WorkLegalOverTime__c"
				+ ",WorkLegalOutOverTime__c"
				+ ",WorkChargeTime__c"
				+ ",LegalWorkTime__c"
				+ ",LegalWorkTimeOfPeriod__c"
				+ ",WorkFixedTime__c"
				+ ",WorkRealTime__c"
				+ ",WorkWholeTime__c"
				+ ",HolidayWorkTime__c"
				+ ",(select Id,DayType__c,EndTime__c,ExchangeSApplyId__c,ExchangeEApplyId__c"
				+ ",PatternSApplyId__r.DayType__c,PatternLApplyId__r.DayType__c, PatternId__c from EmpMonthDay__r"
				+ " where ExchangeSApplyId__c != null or ExchangeEApplyId__c != null"
				+ " or PatternSApplyId__r.DayType__c != null or PatternLApplyId__r.DayType__c != null or PatternId__c != null"
				+ " or (DayType__c = '2' and EndTime__c > 1440))"
				+ " from AtkEmpMonth__c"
				+ " where (ConfigId__r.WorkSystem__c = '1' or (ConfigId__r.WorkSystem__c = '2' and ConfigId__r.VariablePeriod__c > '1'))"
				+ " and EndDate__c >= " + param.startDt;
			if(param.endDt){
				soql += " and StartDate__c <=" + param.endDt;
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
		// 日タイプ変更した勤務時間変更申請を取得
		fetchEmpShifts: function(param, empIds){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",EmpId__c"
				+ ",StartDate__c"
				+ ",EndDate__c"
				+ ",DayType__c"
				+ " from AtkEmpApply__c"
				+ " where EmpId__c in ('" + empIds.join("','") +"')"
				+ " and ApplyType__c = '勤務時間変更申請'"
				+ " and DayType__c != null"
				+ " and TempFlag__c = false"
				+ " and Status__c in ('承認待ち','承認済み','確定済み')"
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					array.forEach(records, function(record){
						var emp = this.getEmpById(record.EmpId__c);
						if(emp){
							emp.addDayTypeChangedDate(Util.formatDate(record.StartDate__c), Util.formatDate(record.EndDate__c), record.DayType__c);
						}
					}, this);
					deferred.resolve(param);
				}),
				deferred.reject
			);
			return deferred.promise;
		},
		//
		get9393EmpIds: function(){
			var empIds = [];
			array.forEach(this.emps, function(emp){
				if(emp.is9393Target()){
					empIds.push(emp.getId());
				}
			}, this);
			return empIds;
		},
		// 対象月度に絞り込む
		squeezeMonths: function(notSqueeze){
			array.forEach(this.emps, function(emp){
				emp.squeezeMonths(notSqueeze);
			}, this);
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
			if(index >= empMonths.length || (!param.expert && this.ngCount > 0)){
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
						if(param.expert){
							WaitProgress.setProgressVal2(this.ngCount);
							WaitProgress.setProgressMsg1('<span style="font-weight:bold;">不正データが検出されました。</span>');
							WaitProgress.setProgressMsg2('<span style="font-size:90%;">すべての不正データを検出する必要がありましたらこのまま続行してください。<br/>それ以外は下のボタンで中止していただいてかまいません。</span>');
							WaitProgress.enableStop(true);
						}
					}
					this.doneCount++;
					setTimeout(lang.hitch(this, function(){
						this.loadEmpMonthPrint(param, index + 1, callback);
					}), 100);
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
				'経過月',
				'月度',
				'ステータス',
				'労働時間制',
				'所定労働時間',
				'月度開始日',
				'月度終了日',
				'勤怠月次ID',
				'月度最終更新日時',
				'所定＝法定',
				'日タイプ変更',
				'パターン変更',
				'振替申請あり',
				'法定休日24時超',
				'日数×40÷7',
				'月の法定労働時間',
				'月の所定労働時間',
				'総労働時間',
				'実労働時間',
				'法定休日労働時間',
				'法定時間内残業',
				'法定時間外残業',
				'法定時間外割増',
				'本来の法定時間内残業',
				'本来の法定時間外残業',
				'本来の法定時間外割増',
				'検査対象',
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
