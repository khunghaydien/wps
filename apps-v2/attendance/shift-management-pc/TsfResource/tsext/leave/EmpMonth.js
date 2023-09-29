define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Wait, Util){
	return declare("tsext.leave.EmpMonth", null, {
		constructor : function(o){
			o.sd	   = Util.formatDate(o.sd);
			o.ed	   = Util.formatDate(o.ed);
			this.obj = o;
		},
		getStartDate: function(){
			return this.obj.sd;
		},
		getEndDate: function(){
			return this.obj.ed;
		},
		getYearMonth: function(){
			return this.obj.ym;
		},
		getSubNo: function(){
			return this.obj.subNo || '';
		},
		getEmpType: function(){
			return this.obj.empType;
		},
		getEmpTypeId: function(){
			return (this.obj.empType && this.obj.empType.Id) || '';
		},
		getEmpTypeName: function(){
			return (this.obj.empType && this.obj.empType.Name) || '';
		},
		existEmpMonth: function(){
			return (this.obj.empMonthId ? '有' : '無');
		}
	});
});
