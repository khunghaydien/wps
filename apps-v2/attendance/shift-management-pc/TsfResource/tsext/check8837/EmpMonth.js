define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.check8837.EmpMonth", null, {
		constructor : function(o){
			o.longLastModifiedDate = o.LastModifiedDate;
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			o.StartDate__c	   = Util.formatDate(o.StartDate__c);
			o.EndDate__c	   = Util.formatDate(o.EndDate__c);
			if(o.EmpApplyId__r){
				o.EmpApplyId__r.CreatedDate	     = Util.formatDateTime(o.EmpApplyId__r.CreatedDate);
				o.EmpApplyId__r.LastModifiedDate = Util.formatDateTime(o.EmpApplyId__r.LastModifiedDate);
			}
			this.weekEndWorkTime = o.WeekEndWorkTime__c || 0;
			this.expectedValue  = (o.WeekEndDayLegalFixTime__c   || 0)
								+ (o.WeekEndDayLegalOutTime__c   || 0)
								+ (o.WeekEndDayLegalTime__c      || 0)
								+ (o.WeekEndNightLegalFixTime__c || 0)
								+ (o.WeekEndNightLegalOutTime__c || 0)
								+ (o.WeekEndNightLegalTime__c    || 0);
			this.obj = o;
		},
		getId           : function(){ return this.obj.Id; },
		getName         : function(){ return this.obj.Name; },
		getEmpId        : function(){ return this.obj.EmpId__c; },
		getCreatedDate  : function(){ return this.obj.CreatedDate; },
		getLastModifiedDate: function(){ return this.obj.LastModifiedDate; },
		getStartDate    : function(){ return this.obj.StartDate__c; },
		getEndDate      : function(){ return this.obj.EndDate__c; },
		getYearMonth    : function(){ return this.obj.YearMonth__c; },
		getYearMonthS   : function(){ return this.obj.YearMonth__c + (this.obj.SubNo__c ? '(' + (this.obj.SubNo__c + 1) + ')' : ''); },
		getSubNo        : function(){ return this.obj.SubNo__c; },
		getStatus       : function(){ return (this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.Status__c) || '未確定'; },
		getDeptId       : function(){ return (this.obj.DeptMonthId__r && this.obj.DeptMonthId__r.DeptId__c) || null; },
		getDeptCode     : function(){ return (this.obj.DeptMonthId__r && this.obj.DeptMonthId__r.DeptId__r && this.obj.DeptMonthId__r.DeptId__r.DeptCode__c) || null; },
		getDeptName     : function(){ return (this.obj.DeptMonthId__r && this.obj.DeptMonthId__r.DeptId__r && this.obj.DeptMonthId__r.DeptId__r.Name) || null; },
		getEmpTypeId    : function(){ return this.obj.EmpTypeId__c; },
		getEmpTypeName  : function(){ return (this.obj.EmpTypeId__r && this.obj.EmpTypeId__r.Name) || null; },
		getWeekEndWorkTime : function(){ return Util.formatTime(this.weekEndWorkTime); },
		getExpectedValue   : function(){ return Util.formatTime(this.expectedValue); },

		getLongLastModifiedDate: function(){
			return this.obj.longLastModifiedDate;
		},
		isFixed : function(){
			return /^(承認済み|承認待ち|確定済み)$/.test(this.getStatus());
		},
		getValueByKey: function(key){
			return this.obj[key];
		},
		isNg: function(){
			return (this.weekEndWorkTime != this.expectedValue);
		}
	});
});
