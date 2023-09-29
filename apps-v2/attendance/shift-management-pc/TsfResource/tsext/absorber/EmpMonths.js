define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/absorber/YuqDays",
	"tsext/util/Util"
], function(declare, lang, array, str, YuqDays, Util){
	return declare("tsext.absorber.EmpMonths", null, {
		constructor : function(){
			this.months = [];
		},
		addEmpMonth: function(month){
			this.months.push(month);
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
		}
	});
});
