define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/leave/ConfigHistory",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Wait, ConfigHistory, Util){
	return declare("tsext.leave.ConfigHistorys", null, {
		constructor : function(lst){
			this.configHistorys = [];
			array.forEach(lst, function(o){
				this.configHistorys.push(new ConfigHistory(o));
			}, this);
			if(this.configHistorys.length){
				this.configHistorys[0].setStartDate('');
				this.configHistorys[this.configHistorys.length - 1].setEndDate('');
			}
		},
		getAll: function(){
			return this.configHistorys;
		},
		getConfigByDate: function(d){
			for(var i = 0 ; i < this.configHistorys.length ; i++){
				var ch = this.configHistorys[i];
				var sd = ch.getStartDate();
				var ed = ch.getEndDate();
				if((!sd || sd <= d) && (!ed || d <= ed)){
					return ch;
				}
			}
			return null;
		},
		showDebug: function(){
			array.forEach(this.configHistorys, function(configHistory){
				console.log(configHistory.toString());
			}, this);
		}
	});
});
