define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/tsobj/TsConstant",
	"tsext/util/Util"
], function(declare, lang, json, array, TsConstant, Util) {
	return declare("tsext.obj.ChangeInitDateAttEmp", null, {
		constructor: function(emp){
			this.obj = emp;
			this.obj.EntryDate__c = Util.formatDate(emp.EntryDate__c);
			this.obj.EndDate__c   = Util.formatDate(emp.EndDate__c);
			this.empTypeHistory = Util.fromJson(emp.EmpTypeHistory__c);
			this.empMonths = [];
		},
		addEmpMonth: function(empMonth){
			empMonth.StartDate__c = Util.formatDate(empMonth.StartDate__c);
			empMonth.EndDate__c   = Util.formatDate(empMonth.EndDate__c);
			this.empMonths.push(empMonth);
		},
		sortEmpMonths: function(){
			if(this.empMonths && this.empMonths.length){
				this.empMonths = this.empMonths.sort(function(a, b){
					return a.YearMonth__c - b.YearMonth__c;
				});
			}
		},
		getEmpMonthCount: function(){
			return (this.empMonths || []).length;
		},
		getTargetEmpMonthCount: function(d){
			var cnt = 0;
			for(var i = 0 ; i < this.empMonths.length ; i++){
				var m = this.empMonths[i];
				if(d <= m.EndDate__c){
					cnt++;
				}
			}
			return cnt;
		},
		getFirstYearMonth: function(){
			return (this.empMonths.length ? this.empMonths[0].YearMonth__c : null);
		},
		getLastYearMonth: function(){
			return (this.empMonths.length ? this.empMonths[this.empMonths.length - 1].YearMonth__c : null);
		},
		getId: function(){
			return this.obj.Id;
		},
		getName: function(){
			return this.obj.Name;
		},
		getEmpCode: function(){
			return this.obj.EmpCode__c;
		},
		getEmpTypeId: function(){
			return this.obj.EmpTypeId__c;
		},
		getEntryDate: function(){
			return this.obj.EntryDate__c;
		},
		getEndDate: function(){
			return this.obj.EndDate__c;
		},
		/**
		 * 勤務体系履歴を返す
		 * @return {Object|Null}
		 */
		getEmpTypeHistory: function(){
			return this.empTypeHistory || null;
		},
		isOverEmpTypeHistory: function(dt){
			var eths = this.getEmpTypeHistory();
			if(!eths || !eths.length){
				return false;
			}
			for(var i = 0 ; i < eths.length ; i++){
				if(eths[i].date >= dt){
					return true;
				}
			}
			return false;
		},
		/**
		 * 備考を返す
		 * @return {string}
		 */
		getNote: function(){
			return (this.getEmpTypeHistory() ? '*' : '');
		},
		/**
		 * 切替日以降の勤務確定済みの勤怠月度を返す
		 * @param {string} d (yyyy-MM-dd) 切替日
		 * @return {Array.<number>}
		 */
		getFixedMonthsAfterDate: function(d){
			var months = [];
			for(var i = 0 ; i < this.empMonths.length ; i++){
				var m = this.empMonths[i];
				if(m.EmpApplyId__r
				&& TsConstant.isFixed(m.EmpApplyId__r.Status__c)
				&& d <= m.EndDate__c
				){
					months.push(m.YearMonth__c);
				}
			}
			return months;
		},
		getLastDate: function(){
			if(!this.empMonths || !this.empMonths.length){
				return null;
			}
			return this.empMonths[this.empMonths.length - 1].EndDate__c;
		},
		/**
		 * @param {Object} param
		 * @param {Array.<{{ym:number,subNo:number|null,sd:string,ed:string,empType:Object}}> virMonths1
		 * @param {Array.<{{ym:number,subNo:number|null,sd:string,ed:string,empType:Object}}> virMonths2
		 * @return {Object}
		 */
		getUpdateEmpMonthParam: function(param, virMonths1, virMonths2){
			var F = 'YYYY-MM-DD';
			var pairs = [];
			for(var i = 0 ; i < virMonths1.length ; i++){
				var m = virMonths1[i];
				if(m.ed < param.changeDate){
					continue;
				}
				pairs.push({
					om: virMonths1[i],
					nm: virMonths2[i]
				});
			}
			array.forEach(this.empMonths, function(empMonth){
				for(var i = 0 ; i < pairs.length ; i++){
					var p = pairs[i];
					if(p.om.sd == empMonth.StartDate__c){
						p.empMonth = empMonth;
					}
				}
			});
			for(var i = 0 ; i < pairs.length ; i++){
				var p = pairs[i];
				var prev = (i > 0 ? pairs[i - 1] : null);
				var obj = {
					sd       : p.nm.sd,
					ed       : p.nm.ed,
					ym       : p.nm.ym,
					subNo    : p.nm.subNo,
					empTypeId: p.nm.empType.Id,
					inid     : p.nm.inid
				};
				if(p.empMonth){
					p.update = obj;
					p.update.empMonthId = p.empMonth.Id;
					if(p.update.ed < p.empMonth.EndDate__c){
						p.moveToNext = {
							sd: moment(p.update.ed, F).add(1, 'd').format(F),
							ed: p.empMonth.EndDate__c
						};
					}
				}
				if(prev && prev.moveToNext){
					if(p.empMonth){
						p.update.move = prev.moveToNext;
					}else{
						p.insert = obj;
						p.insert.move = prev.moveToNext;
					}
				}
			}
			var summary = {
				updates: [],
				inserts: []
			};
			for(var i = 0 ; i < pairs.length ; i++){
				var p = pairs[i];
				if(p.update){
					summary.updates.push(p.update);
				}
				if(p.insert){
					summary.inserts.push(p.insert);
				}
			}
			return summary;
		}
	});
});
