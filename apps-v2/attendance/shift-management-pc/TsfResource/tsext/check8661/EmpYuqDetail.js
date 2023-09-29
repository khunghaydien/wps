define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.check8661.EmpYuqDetail", null, {
		constructor : function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			this.obj = o;
			this.empYuq = null;
			this.groupYuq = null;
		},
		getId      : function(){ return this.obj.Id; },
		getName    : function(){ return this.obj.Name; },
		getEmpId   : function(){ return (this.obj.EmpYuqId__r && this.obj.EmpYuqId__r.EmpId__c) || null; },
		getTime    : function(){ return this.obj.Time__c || 0; },
		isLostFlag : function(){ return (this.obj.EmpYuqId__r && this.obj.EmpYuqId__r.LostFlag__c) || false; },
		getGroupId : function(){ return this.obj.GroupId__c; },
		getEmpYuqId: function(){ return this.obj.EmpYuqId__c; },

		getEmpYuq: function(){ return this.empYuq; },
		getGroupYuq: function(){ return this.groupYuq; },
		setEmpYuq: function(empYuq){
			this.empYuq = empYuq;
		},
		setGroupYuq: function(groupYuq){
			this.groupYuq = groupYuq;
		}
	});
});
