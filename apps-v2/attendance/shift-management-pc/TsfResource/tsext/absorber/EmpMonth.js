define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/absorber/YuqDays",
	"tsext/util/Util"
], function(declare, lang, array, str, YuqDays, Util){
	return declare("tsext.absorber.EmpMonth", null, {
		constructor : function(o){
			o.longLastModifiedDate = o.LastModifiedDate;
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			o.StartDate__c	   = Util.formatDate(o.StartDate__c);
			o.EndDate__c	   = Util.formatDate(o.EndDate__c);
			this.obj = o;
		},
		getId           : function(){ return this.obj.Id; },
		getName         : function(){ return this.obj.Name; },
		getEmpId        : function(){ return this.obj.EmpId__c; },
		getCreatedDate  : function(){ return this.obj.CreatedDate; },
		getStartDate    : function(){ return this.obj.StartDate__c; },
		getEndDate      : function(){ return this.obj.EndDate__c; },
		getYearMonth    : function(){ return this.obj.YearMonth__c; },
		getSubNo        : function(){ return this.obj.SubNo__c; },
		getStatus       : function(){ return (this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.Status__c) || null; },
		getDeptId       : function(){ return (this.obj.DeptMonthId__r && this.obj.DeptMonthId__r.DeptId__c) || null; },

		getLongLastModifiedDate: function(){
			return this.obj.longLastModifiedDate;
		},
		isFixed : function(){
			return /^(承認済み|承認待ち|確定済み)$/.test(this.getStatus());
		},
		getValueByKey: function(key){
			return this.obj[key];
		}
	});
});
