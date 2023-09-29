define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/obj/ChangeInitDateAttEmp",
	"tsext/util/Util"
], function(declare, lang, json, array, ChangeInitDateAttEmp, Util) {
	return declare("tsext.obj.ChangeInitDateAttEmps", null, {
		constructor: function(emps){
			this.objs = [];
			this.map = {};
			array.forEach(emps, function(emp){
				var ce = new ChangeInitDateAttEmp(emp);
				this.objs.push(ce);
				this.map[ce.getId()] = ce;
			}, this);
		},
		getList: function(){
			return this.objs;
		},
		setEmpMonths: function(empMonths){
			array.forEach(empMonths, function(empMonth){
				var emp = this.map[empMonth.EmpId__c];
				if(emp){
					emp.addEmpMonth(empMonth);
				}
			}, this);
			array.forEach(this.objs, function(emp){
				emp.sortEmpMonths();
			}, this);
		}
	});
});
