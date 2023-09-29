define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/util/Util"
], function(declare, lang, json, array, Util) {
	return declare("tsext.obj.ChangeInitDateAttEmpType", null, {
		constructor: function(empType){
			this.obj = empType;
			this.emps = [];
			this.calendars = null;
		},
		getObj: function(){
			return this.obj;
		},
		setEmps: function(emps){
			array.forEach(emps.getList(), function(emp){
				if(emp.getEmpTypeId() == this.getId()){
					this.emps.push(emp);
				}
			}, this);
		},
		getEmps: function(){
			return this.emps;
		},
		getEmpById: function(empId){
			for(var i = 0 ; i < this.emps.length ; i++){
				if(this.emps[i].getId() == empId){
					return this.emps[i];
				}
			}
			return null;
		},
		getEmpsByIds: function(empIds){
			var emps = [];
			array.forEach(this.emps, function(emp){
				if(empIds.indexOf(emp.getId()) >= 0){
					emps.push(emp);
				}
			});
			return emps;
		},
		getEmpIdList: function(){
			var empIds = [];
			array.forEach(this.emps, function(emp){
				empIds.push(emp.getId());
			}, this);
			return empIds;
		},
		getEmpCount: function(){
			return this.emps.length;
		},
		getEmpMonthCount: function(){
			var empMonthCount = 0;
			array.forEach(this.emps, function(emp){
				empMonthCount += emp.getEmpMonthCount();
			}, this);
			return empMonthCount;
		},
		getId: function(){
			return this.obj.Id;
		},
		getName: function(){
			return this.obj.Name;
		},
		getEmpTypeCode: function(){
			return this.obj.EmpTypeCode__c || null;
		},
		getConfigBaseId: function(){
			return this.obj.ConfigBaseId__c || null;
		},
		isRemoved: function(){
			return this.obj.Removed__c || false;
		},
		// 起算月 flag=1:数値 それ以外:生値のまま
		getStartMonth: function(flag){
			var v = this.obj.ConfigBaseId__r.InitialDateOfYear__c;
			return (flag == 1 ? parseInt(v, 10) : v);
		},
		// 年度の表記 flag=1:数値  flag=2:日本語フル flag=3:日本語略称 それ以外:生値のまま
		getDisplayYear: function(flag){
			var v = this.obj.ConfigBaseId__r.MarkOfYear__c;
			if(flag == 2){
				return (v == '1' ? '起算月に合わせる' : '締め月に合わせる');
			}else if(flag == 3){
				return (v == '1' ? '起' : '締');
			}
			return (flag == 1 ? parseInt(v, 10) : v);
		},
		// 起算日 flag=1:数値 それ以外:生値のまま
		getStartDate: function(flag){
			var v = this.obj.ConfigBaseId__r.InitialDateOfMonth__c;
			return (flag == 1 ? parseInt(v, 10) : v);
		},
		// 月度の表記 flag=1:数値  flag=2:日本語フル flag=3:日本語略称 それ以外:生値のまま
		getDisplayMonth: function(flag){
			var v = this.obj.ConfigBaseId__r.MarkOfMonth__c;
			if(flag == 2){
				return (v == '1' ? '起算日に合わせる' : '締め日に合わせる');
			}else if(flag == 3){
				return (v == '1' ? '起' : '締');
			}
			return (flag == 1 ? parseInt(v, 10) : v);
		},
		// 週の起算日 flag=1:数値 flag==2:日本語の曜日で返す それ以外:生値のまま
		getStartWeek: function(flag){
			var v = this.obj.ConfigBaseId__r.InitialDayOfWeek__c;
			var n = parseInt(v, 10);
			return (flag == 2 ? Util.getWeekJp(n) : (flag == 1 ? n : v));
		},
		// 有効・無効 flag=2:〇×で返す それ以外 boolean
		isValid: function(flag){
			if(flag == 2){
				return this.obj.Removed__c ? '×' : '〇';
			}
			return this.obj.Removed__c || false;
		},
		// 勤怠カレンダー読み込み済みか
		isCalendarLoaded: function(){
			return (!this.calendars ? false : true);
		},
		setCalendar: function(cal){
			if(!this.calendars){
				this.calendars = [];
			}
			cal.Date__c = Util.formatDate(cal.Date__c);
			this.calendars.push(cal);
		},
		getCalendars: function(){
			return this.calendars || [];
		},
		getCalendarIds: function(cd){
			var calIds = [];
			array.forEach(this.calendars || [], function(cal){
				if(cal.Date__c >= cd){
					calIds.push(cal.Id);
				}
			});
			return calIds;
		},
		// 勤務体系コピーを行った結果をセット
		setCopyResult: function(result){
			this.copyResult = result;
		},
		// コピー元の勤務体系の情報
		getCopyOrgEmpType: function(){
			var copyOrg = (this.copyResult && this.copyResult.copyOrg);
			if(copyOrg && copyOrg.upd){
				var upd = copyOrg.upd;
				return {
					Id            : upd.Id,
					Name          : upd.Name,
					EmpTypeCode__c: upd.EmpTypeCode__c,
					Removed__c    : upd.Removed__c
				};
			}
			return {
				Id            : this.getId(),
				Name          : this.getName(),
				EmpTypeCode__c: this.getEmpTypeCode(),
				Removed__c    : this.isRemoved()
			};
		},
		// コピー先の勤務体系の情報
		getCopyToEmpType: function(){
			var et = this.copyResult.copyTo.empType;
			return {
				Id            : et.Id,
				Name          : et.Name,
				EmpTypeCode__c: et.EmpTypeCode__c,
				Removed__c    : et.Removed__c
			};
		},
		// 勤務体系履歴
		getEmpTypeHistory: function(date){
			return {
				date: date,
				empTypeId: this.getCopyOrgEmpType().Id
			};
		},
		// 勤務体系コピーリカバリースクリプト
		// @return {Array.<string>}
		getCopyEmpTypeRecoveryScripts: function(){
			var copyTo  = this.copyResult.copyTo;
			var copyOrg = this.copyResult.copyOrg;
			var ms = [];
			ms.push('// AtkEmpType__c Copy Recovery');
			ms.push('//-------------------------------------');
			ms.push('{');
			ms.push("delete [select Id from AtkEmpType__c where Id = '" + copyTo.empType.Id + "'];");
			var configIds = [];
			array.forEach(copyTo.configs, function(config){
				configIds.push(config.Id);
			});
			ms.push("delete [select Id from AtkConfig__c where Id in ('" + configIds.join("','") + "')];");
			ms.push("delete [select Id from AtkConfigBase__c where Id = '" + copyTo.configBase.Id + "'];");
			if(copyOrg){
				var org = copyOrg.org;
				var upd = copyOrg.upd;
				ms.push("AtkEmpType__c et = [select Id,Name,EmpTypeCode__c,Removed__c from AtkEmpType__c where Id = '" + upd.Id + "'];");
				if(org.EmpTypeCode__c != upd.EmpTypeCode__c){
					ms.push("et.EmpTypeCode__c = '" + org.EmpTypeCode__c + "';");
				}
				if(org.Name != upd.Name){
					ms.push("et.Name = '" + org.Name + "';");
				}
				if(org.Removed__c != upd.Removed__c){
					ms.push("et.Removed__c = " + org.Removed__c + ";");
				}
				ms.push("update et;");
			}
			ms.push('}');
			ms.push('//-------------------------------------');
			return ms.join('\n');
		},
		// 勤務体系履歴更新リカバリースクリプト
		// @return {Array.<string>}
		getUpdateEmpTypeHistoryRecoveryScripts: function(){
			var emps = this.getEmps();
			var oldEmpTypeHistoryMap = {};

			array.forEach(emps, function(emp){
				var eh = emp.getEmpTypeHistory() || '';
				var l = oldEmpTypeHistoryMap[eh];
				if(!l){
					l = oldEmpTypeHistoryMap[eh] = [];
				}
				l.push(emp.getId());
			});
			var ms = [];
			ms.push('// AtkEmp__c.EmpTypeHistory__c Recovery');
			ms.push('//-------------------------------------');
			ms.push('{');
			ms.push('List<AtkEmp__c> emps = new List<AtkEmp__c>();');
			for(var eh in oldEmpTypeHistoryMap){
				if(!oldEmpTypeHistoryMap.hasOwnProperty(eh)){
					continue;
				}
				var empIds = oldEmpTypeHistoryMap[eh];
				ms.push("for(AtkEmp__c emp : [select Id, EmpTypeHistory__c, EmpTypeId__c from AtkEmp__c where Id in (");
				for(var i = 0 ; i < empIds.length ; i++){
					var empId = empIds[i];
					ms.push((i > 0 ? ',' : ' ') + "'" + empId + "'");
				}
				ms.push(")]){");
				ms.push("  emp.EmpTypeHistory__c = " + (!eh ? "null;" : "'" + eh + "';"));
				ms.push("  emp.EmpTypeId__c = '" + this.getId() + "';");
				ms.push("  emps.add(emp);");
				ms.push('}');
			}
			ms.push('update emps;');
			ms.push('}');
			ms.push('//-------------------------------------');
			return ms.join('\n');
		},
		// 勤怠カレンダー更新リカバリースクリプト
		// @return {Array.<string>}
		getUpdateEmpTypeCalsRecoveryScripts: function(invalidate){
			var cals = this.getCalendars();
			var ms = [];
			ms.push('// AtkCalendar__c Recovery');
			ms.push('//-------------------------------------');
			ms.push('{');
			if(invalidate){
				ms.push('List<AtkCalendar__c> cals = new List<AtkCalendar__c>();');
				ms.push("for(AtkCalendar__c cal : [select Id, EmpTypeId__c from AtkCalendar__c where Id in (");
				for(var i = 0 ; i < cals.length ; i++){
					var cal = cals[i];
					ms.push((i > 0 ? ',' : ' ') + "'" + cal.Id + "'");
				}
				ms.push(")]){");
				ms.push("  cal.EmpTypeId__c = '" + this.getId() + "';");
				ms.push("  cals.add(cal);");
				ms.push('}');
				ms.push('update cals;');
			}else{
				ms.push("delete [select Id from AtkCalendar__c where EmpTypeId__c = '" + this.getCopyToEmpType().Id + "'];");
			}
			ms.push('}');
			ms.push('//-------------------------------------');
			return ms.join('\n');
		}
	});
});
