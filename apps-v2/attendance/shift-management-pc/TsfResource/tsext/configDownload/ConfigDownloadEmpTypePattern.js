define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, json, array, str, Util) {
	return declare("tsext.configDownload.ConfigDownloadEmpTypePattern", null, {
		constructor: function(record){
			this.etp = record;
		},
		getEmpTypeId:   function(){ return this.etp.EmpTypeId__c; },
		getEmpTypeCode: function(){ return (this.etp.EmpTypeId__r && this.etp.EmpTypeId__r.EmpTypeCode__c) || null; },
		getEmpTypeName: function(){ return this.etp.EmpTypeId__r.Name; },
		getPatternId:   function(){ return this.etp.PatternId__c; },
		getPatternName: function(){ return this.etp.PatternId__r.Name; },
		getOrder:       function(){ return this.etp.Order__c || 0; },
		// 0-6 を曜日に変換
		getWeekJp: function(n){
			if(typeof(n) == 'string'){
				if(n.length == 1 && n >= '0' && n <= '6'){
					n = parseInt(n, 10);
				}else{
					return '';
				}
			}
			return (n >= 0 && n <= 6 ? '日月火水木金土'.substring(n, n + 1) : '');
		},
		getWeeksJp: function(v){
			var wks = v || '';
			var ws = [];
			for(var i = 0 ; i < wks.length ; i++){
				var w = this.getWeekJp(wks.substring(i, i + 1));
				if(w){
					ws.push(w);
				}
			}
			return ws.join(',');
		},
		// 適用日
		getDateOfApplication: function(){
			var v = this.etp.SchedOption__c;
			if(v === null || v === undefined){
				return '';
			}
			switch(v){
			case '0': return '任意日';
			case '1':
				var v = this.getWeeksJp(this.etp.SchedWeekly__c);
				return str.substitute('毎週 ${0} 曜日', [v]);
			case '2':
				var v = this.etp.SchedMonthlyDate__c || 0;
				if(v >= 32){
					return '毎月最終日';
				}
				return str.substitute('毎月 ${0} 日', [v]);
			case '3':
				var w = this.getWeeksJp(this.etp.SchedMonthlyWeek__c);
				var n = this.etp.SchedMonthlyLine__c || '';
				if(n == '5'){
					return str.substitute('毎月最終 ${0} 曜日', [w]);
				}else{
					return str.substitute('毎月第${0} ${1} 曜日', [n, w]);
				}
			}
			return '';
		}
	});
});
