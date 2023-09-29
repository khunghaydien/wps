define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/obj/ChangeInitDateAttEmpType",
	"tsext/util/Util"
], function(declare, lang, json, array, ChangeInitDateAttEmpType, Util) {
	return declare("tsext.obj.ChangeInitDateAttEmpTypes", null, {
		constructor: function(empTypes){
			this.objs = [];
			array.forEach(empTypes, function(empType){
				var et = new ChangeInitDateAttEmpType(empType);
				this.objs.push(et);
			}, this);
		},
		setEmps: function(emps){
			array.forEach(this.objs, function(empType){
				empType.setEmps(emps);
			}, this);
		},
		setCalendars: function(calendars){
			var calendarMap = {};
			array.forEach(calendars, function(calendar){
				var empType = this.getEmpTypeById(calendar.EmpTypeId__c);
				empType.setCalendar(calendar);
			}, this);
		},
		getList: function(){
			return this.objs;
		},
		getEmpTypeById: function(id){
			for(var i = 0 ; i < this.objs.length ; i++){
				var empType = this.objs[i];
				if(empType.getId() == id){
					return empType;
				}
			}
			return null;
		},
		getEmpTypesByIds: function(ids){
			var cets = [];
			array.forEach(this.objs, function(empType){
				if(ids.indexOf(empType.getId()) >= 0){
					cets.push(empType);
				}
			}, this);
			return cets;
		}
	});
});
