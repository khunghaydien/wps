define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.check8661.EmpMonth", null, {
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
			o.OrgYuqLog__c	   = o.YuqLog__c;
			o.YuqLog__c	       = (o.YuqLog__c ? Util.fromJson(o.YuqLog__c) : null);
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
		getSubNo        : function(){ return this.obj.SubNo__c; },
		getStatus       : function(){ return (this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.Status__c) || null; },
		getDeptId       : function(){ return (this.obj.DeptMonthId__r && this.obj.DeptMonthId__r.DeptId__c) || null; },
		getEmpTypeId    : function(){ return this.obj.EmpTypeId__c; },
		getEmpTypeName  : function(){ return (this.obj.EmpTypeId__r && this.obj.EmpTypeId__r.Name) || null; },
		getYuqLog       : function(){ return this.obj.YuqLog__c; },
		getOrgYuqLog    : function(){ return this.obj.OrgYuqLog__c; },

		getLongLastModifiedDate: function(){
			return this.obj.longLastModifiedDate;
		},
		isFixed : function(){
			return /^(承認済み|承認待ち|確定済み)$/.test(this.getStatus());
		},
		getValueByKey: function(key){
			return this.obj[key];
		},
		/**
		 * この月度の勤務確定時に有休自動付与が行われたかどうかを判定する
		 * YuqLog__c の情報で判断する
		 * @param {tsext.check8661.EmpYuq} yuq
		 * @return {boolean} 自動付与が行われた月ならtrue
		 */
		isYuqAutoProvided: function(yuq){
			var yL = this.getYuqLog();
			if(yL
			&& yL.op == 'fuyo'
			&& yL.id == yuq.getId()
			&& yL.fuyo > 0){
				return true;
			}
			return false;
		},
		getYuqAutoProvideEmpYuqId: function(){
			var yL = this.getYuqLog();
			if(yL
			&& yL.op == 'fuyo'
			&& yL.fuyo > 0){
				return yL.id;
			}
			return null;
		}
	});
});
