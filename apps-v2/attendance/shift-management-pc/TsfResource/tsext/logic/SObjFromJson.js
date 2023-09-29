define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/tsobj/Helper",
	"tsext/service/Request",
	"tsext/service/Agent",
	"dojo/text!tsext/tsobj/json_fields.txt",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Helper, Request, Agent, json_fields, Util){
	return declare("tsext.logic.SObjFromJson", null, {
		constructor : function(){
		},
		load: function(dataLoader){
			var sobjs = Util.fromJson(json_fields);
			for(var i = 0 ; i < sobjs.length ; i++){
				var sobj = sobjs[i];
				Agent.setSObjectList(sobj.key, sobj);
				dataLoader.cacheSObjectInfo(sobj);
			}
		}
	});
});
