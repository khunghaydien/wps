define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/absorber/EmpType",
	"tsext/obj/HistoryRange",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, EmpType, HistoryRange, Util){
	return new (declare("tsext.absorber.EmpTypeAgent", null, {
		constructor : function(){
			this.empTypes = [];
		},
		// AtkEmpType__c を取得
		// 勤務体系履歴を参照するため、無効（Removed__c=true）も含める
		fetchEmpTypes: function(){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",CreatedById"
				+ ",CreatedBy.Name"
				+ ",LastModifiedDate"
				+ ",LastModifiedById"
				+ ",LastModifiedBy.Name"
				+ ",EmpTypeCode__c"
				+ ",Removed__c"
				+ ",ConfigBaseId__r.InitialDateOfYear__c"
				+ ",ConfigBaseId__r.MarkOfYear__c"
				+ ",ConfigBaseId__r.InitialDateOfMonth__c"
				+ ",ConfigBaseId__r.MarkOfMonth__c"
				+ ",ConfigBaseId__r.InitialDayOfWeek__c"
				+ " from AtkEmpType__c"
				;
			Request.actionB(
				tsCONST.API_SEARCH_DATA,
				[{ soql:soql, limit:50000, offset:0 }],
				true
			).then(
				deferred.resolve,
				deferred.reject,
				lang.hitch(this, function(result){
					for(var i = 0 ; i < result.records.length ; i++){
						this.empTypes.push(new EmpType(result.records[i]));
					}
				})
			);
			return deferred.promise;
		},
		getEmpTypeById: function(id){
			for(var i = 0 ; i < this.empTypes.length ; i++){
				var empType = this.empTypes[i];
				if(empType.getId() == id){
					return empType;
				}
			}
			return null;
		},
		getHistoryRanges: function(empTypeHistory, currentEmpTypeId){
			// 勤務体系履歴の配列を作る
			var F = 'YYYY-MM-DD';
			var eths = [];
			array.forEach(Util.fromJson(empTypeHistory) || [], function(eth){
				if(eth.date && eth.empTypeId){
					var d = moment(eth.date, F);
					var et = this.getEmpTypeById(eth.empTypeId);
					if(d.isValid() && et){
						eth.date = d.format(F);
						eths.push(eth);
					}
				}
			}, this);
			eths = eths.sort(function(a, b){
				return (a.date < b.date ? -1 : 1);
			});
			var hists = [];
			var xd = null;
			array.forEach(eths, function(eth){
				var hist = {
					sd: xd,
					ed: moment(eth.date, F).add(-1, 'd').format(F),
					empType: this.getEmpTypeById(eth.empTypeId).getObj()
				};
				hists.push(hist);
				xd = eth.date;
			}, this);
			var et = this.getEmpTypeById(currentEmpTypeId);
			hists.push({
				sd: xd,
				ed: null,
				empType: et.getObj()
			});
			// 勤務体系履歴の配列から HistoryRange の配列を作る
			var hrs = [];
			var prevHr = null;
			array.forEach(hists, function(hist){
				var hr = new HistoryRange({
					sd: hist.sd,
					ed: hist.ed,
					et: hist.empType,
					prevHr: prevHr
				});
				prevHr = hr;
				hrs.push(hr);
			}, this);
			return hrs;
		},
		getMonthInfo: function(historyRanges, yearMonth, subNo){
			var F = 'YYYY-MM-DD';
			var d = moment(yearMonth + '01', 'YYYYMMDD').add(-12, 'M').format(F);
			var ld = moment(d, F).add(24,'M').format(F);
			var hrs = historyRanges || [];
			var ymMap = {};
			while(d <= ld){
				var hr = null;
				for(var i = 0 ; i < hrs.length ; i++){
					if(hrs[i].contains(d)){
						hr = hrs[i];
						break;
					}
				}
				var ym = hr.getYearMonth(d);
				var sn = ymMap[ym] || null;
				ymMap[ym] = (!sn ? 1 : sn + 1);
				if(ym == yearMonth && subNo == sn){
					return {
						ym     : ym,
						subNo  : sn,
						sd     : hr.getStartDate(ym),
						ed     : hr.getEndDate(ym),
						empType: hr.getEmpType(),
						inid   : hr.getInitialDate()
					};
				}
				d = moment(hr.getEndDate(ym), F).add(1, 'd').format(F);
			}
			return null;
		}
	}))();
});
