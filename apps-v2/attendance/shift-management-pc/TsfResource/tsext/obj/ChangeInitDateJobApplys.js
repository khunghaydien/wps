define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/obj/ChangeInitDateJobEmp",
	"tsext/util/Util"
], function(declare, lang, json, array, ChangeInitDateJobEmp, Util) {
	return declare("tsext.obj.ChangeInitDateJobApplys", null, {
		constructor: function(jobApplys){
			this.emps = [];
			var empMap = {};
			array.forEach(jobApplys, function(jobApply){
				var je = empMap[jobApply.EmpId__c];
				if(!je){
					empMap[jobApply.EmpId__c] = new ChangeInitDateJobEmp(jobApply);
				}else{
					je.addApply(jobApply);
				}
			}, this);
			for(var empId in empMap){
				if(!empMap.hasOwnProperty(empId)){
					continue;
				}
				this.emps.push(empMap[empId]);
			}
		},
		getEmps: function(){
			return this.emps;
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
		getEmpIdList: function(){
			var empIds = [];
			array.forEach(this.emps, function(emp){
				empIds.push(emp.getId());
			}, this);
			return empIds;
		}
	});
});
