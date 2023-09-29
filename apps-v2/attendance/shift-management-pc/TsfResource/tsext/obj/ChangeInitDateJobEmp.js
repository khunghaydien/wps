define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/tsobj/TsConstant",
	"tsext/util/Util"
], function(declare, lang, json, array, TsConstant, Util) {
	return declare("tsext.obj.ChangeInitDateJobEmp", null, {
		constructor: function(apply){
			this.applys = [];
			this.obj = {
				Id          : apply.EmpId__c,
				Name        : apply.EmpId__r.Name,
				EmpCode__c  : apply.EmpId__r.EmpCode__c,
				EntryDate__c: Util.formatDate(apply.EmpId__r.EntryDate__c),
				EndDate__c  : Util.formatDate(apply.EmpId__r.EndDate__c)
			};
			this.addApply(apply);
		},
		addApply: function(apply){
			apply.StartDate__c = Util.formatDate(apply.StartDate__c);
			apply.EndDate__c   = Util.formatDate(apply.EndDate__c);
			this.applys.push(apply);
		},
		getObj: function(){
			return this.obj;
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
		getEntryDate: function(){
			return this.obj.EntryDate__c;
		},
		getEndDate: function(){
			return this.obj.EndDate__c;
		},
		getFirstYearMonth: function(){
			return (this.applys.length ? this.applys[0].YearMonth__c : null);
		},
		getLastYearMonth: function(){
			return (this.applys.length ? this.applys[this.applys.length - 1].YearMonth__c : null);
		},
		getLastDate: function(){
			if(!this.applys || !this.applys.length){
				return null;
			}
			return this.applys[this.applys.length - 1].EndDate__c;
		},
		getTargetJobMonthCount: function(d){
			var cnt = 0;
			for(var i = 0 ; i < this.applys.length ; i++){
				var m = this.applys[i];
				if(d <= m.EndDate__c){
					cnt++;
				}
			}
			return cnt;
		},
		/**
		 * 切替日以降の工数確定済みの月度を返す
		 * @param {string} d (yyyy-MM-dd) 切替日
		 * @return {Array.<number>}
		 */
		getFixedMonthsAfterDate: function(d){
			var months = [];
			for(var i = 0 ; i < this.applys.length ; i++){
				var m = this.applys[i];
				if(TsConstant.isFixed(m.Status__c) && d <= m.EndDate__c){
					months.push(m.YearMonth__c);
				}
			}
			return months;
		},
		/**
		 * @param {Object} param
		 * @param {Array.<{{ym:number,subNo:number|null,sd:string,ed:string,empType:Object}}> virMonths1
		 * @param {Array.<{{ym:number,subNo:number|null,sd:string,ed:string,empType:Object}}> virMonths2
		 * @return {Object}
		 */
		getUpdateJobMonthParam: function(param, virMonths1, virMonths2){
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
			array.forEach(this.applys, function(apply){
				for(var i = 0 ; i < pairs.length ; i++){
					var p = pairs[i];
					if(p.om.sd == apply.StartDate__c){
						p.apply = apply;
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
					subNo    : p.nm.subNo
				};
				if(p.apply){
					p.update = obj;
					p.update.applyId = p.apply.Id;
					if(p.update.ed < p.apply.EndDate__c){
						p.moveToNext = {
							sd: moment(p.update.ed, F).add(1, 'd').format(F),
							ed: p.apply.EndDate__c
						};
					}
				}
				if(prev && prev.moveToNext){
					if(p.apply){
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
