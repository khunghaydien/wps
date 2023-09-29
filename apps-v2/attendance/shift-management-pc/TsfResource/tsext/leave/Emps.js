define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/leave/Emp",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Wait, Emp, Util){
	return declare("tsext.leave.Emps", null, {
		constructor : function(){
			this.emps = [];
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
		getSize: function(){
			return this.emps.length;
		},
		getEmpByIndex: function(index){
			return this.emps[index];
		},
		sort: function(){
			this.emps = this.emps.sort(function(a, b){
				return a.compare(b);
			});
		},
		// 社員を取得
		fetch: function(ids){
			var deferred = new Deferred();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",LastModifiedDate"
				+ ",EmpCode__c"
				+ ",EntryDate__c"
				+ ",EndDate__c"
				+ ",EmpTypeId__c"
				+ ",EmpTypeId__r.Name"
				+ ",EmpTypeHistory__c"
				+ ",DeptId__r.DeptCode__c"
				+ ",DeptId__r.Name"
				+ " from AtkEmp__c"
				;
			if(ids && ids.length){
				soql += (" where Id in ('" + ids.join("','") + "')");
			}
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					array.forEach(records || [], function(record){
						this.emps.push(new Emp(record));
					}, this);
					this.sort();
					deferred.resolve();
				}),
				deferred.reject
			);
			return deferred.promise;
		}
	});
});
