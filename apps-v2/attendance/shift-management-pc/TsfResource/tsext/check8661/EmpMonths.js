define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.check8661.EmpMonths", null, {
		constructor : function(){
			this.months = [];
			this.apEmpYuqIdMap = {};
		},
		addEmpMonth: function(month){
			this.months.push(month);
			var apEmpYuqId = month.getYuqAutoProvideEmpYuqId();
			if(apEmpYuqId){
				this.apEmpYuqIdMap[apEmpYuqId] = month;
			}
		},
		getEmpMonths: function(){
			return this.months;
		},
		getEmpMonth: function(yearMonth, subNo){
			for(var i = 0 ; i < this.months.length ; i++){
				var month = this.months[i];
				if(month.getYearMonth() == yearMonth && month.getSubNo() == subNo){
					return month;
				}
			}
			return null;
		},
		replaceEmpMonth: function(neo){
			for(var i = 0 ; i < this.months.length ; i++){
				var month = this.months[i];
				if(month.getYearMonth() == neo.getYearMonth() && month.getSubNo() == neo.getSubNo()){
					this.months.splice(i, 1, neo);
					return neo;
				}
			}
			this.months.push(neo);
			return neo;
		},
		getEmpMonthByEmpYuqId: function(empYuqId){
			return this.apEmpYuqIdMap[empYuqId];
		},
	});
});
