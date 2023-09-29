define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.check8837.EmpMonths", null, {
		constructor : function(){
			this.months = [];
		},
		addEmpMonth: function(month){
			this.months.push(month);
		},
		sort: function(){
			this.months = this.months.sort(function(a, b){
				return a.getYearMonth() - b.getYearMonth();
			});
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
	});
});
