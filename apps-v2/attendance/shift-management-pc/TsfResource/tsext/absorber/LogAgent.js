define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return new (declare("tsext.absorber.LogAgent", null, {
		constructor : function(){
			this.reset();
		},
		reset: function(){
			this.logs = [];
		},
		getTime: function(){
			return moment().format('YYYY-MM-DD HH:mm:ss');
		},
		getLogText: function(){
			return this.logs.join('\n') + '\n';
		},
		addLog: function(msg){
			this.logs.push(this.getTime() + ' ' + msg);
		}
	}))();
});
