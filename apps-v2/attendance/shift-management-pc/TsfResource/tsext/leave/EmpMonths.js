define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/leave/EmpMonth",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Wait, EmpMonth, Util){
	return declare("tsext.leave.EmpMonths", null, {
		constructor : function(lst){
			this.empMonths = [];
			array.forEach(lst, function(o){
				this.empMonths.push(new EmpMonth(o));
			}, this);
		},
		getAll: function(){
			return this.empMonths;
		}
	});
});
