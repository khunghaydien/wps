define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.absorber.EmpType", null, {
		constructor : function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			this.obj = o;
		},
		getId: function(){
			return this.obj.Id;
		},
		getName: function(){
			return this.obj.Name;
		},
		getObj: function(){
			return this.obj;
		}
	});
});
