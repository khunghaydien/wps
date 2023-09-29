define([
	"dojo/_base/declare",
	"dojo/string"
], function(declare, str){
	return new (declare("tsext.tsobj.TsConstant", null, {
	    STATUS_FIX : ['承認済み', '確定済み', '承認待ち', '承認中', '精算済み'],
		isFixed: function(status){
			return (this.STATUS_FIX.indexOf(status) >= 0);
		}
	}))();
});
