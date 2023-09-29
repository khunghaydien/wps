define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/tsobj/Helper",
	"tsext/logic/DataLoader",
	"tsext/service/Request",
	"tsext/service/Agent",
	"tsext/configDownload/ConfigDownloadEmpTypePattern",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Helper, DataLoader, Request, Agent, ConfigDownloadEmpTypePattern, Util){
	return declare("tsext.configDownload.ConfigDownloadEmpTypePatterns", null, {
		constructor : function(opt){
			this.opt = opt;
			this.empTypePatternObjs = [
			{ name:'勤務体系ID'		, oid:true },
			{ name:'勤務体系名'		},
			{ name:'勤務パターンID'	, oid:true },
			{ name:'勤務パターン名'	},
			{ name:'適用日'			}
			];
		},
		setEmpTypePatterns: function(records){
			this.empTypePatterns = records;
		},
		createEmpTypePatternContents: function(){
			this.empTypePatternList = [];
			array.forEach(this.empTypePatterns, function(empTypePattern){
				this.empTypePatternList.push(new ConfigDownloadEmpTypePattern(empTypePattern, this));
			}, this);
		},
		getEmpTypePatternCsvHeads: function(objs){
			var heads = [];
			var x = 0;
			array.forEach(this.empTypePatternObjs, function(obj){
				if(this.isEmpTypePatternObj(x++)){
					heads.push(obj.name);
				}
			}, this);
			return heads;
		},
		isEmpTypePatternObj: function(index){
			var obj = this.empTypePatternObjs[index];
			var flag = true;
			if(obj.oid && !this.opt.oid){ flag = false; }
			if(obj.oby && !this.opt.oby){ flag = false; }
			if(obj.odt && !this.opt.odt){ flag = false; }
			return flag;
		},
		getEmpTypePatternCsvContents: function(){
			this.createEmpTypePatternContents();
			var head = this.getEmpTypePatternCsvHeads().join(',');
			var body = '';
			for(var i = 0 ; i < this.empTypePatternList.length ; i++){
				var empTypePattern = this.empTypePatternList[i];
				var vals = [];
				var x = 0;
				if(this.isEmpTypePatternObj(x++)){ vals.push(Util.escapeCsv(empTypePattern.getEmpTypeId())); }
				if(this.isEmpTypePatternObj(x++)){ vals.push(Util.escapeCsv(empTypePattern.getEmpTypeName())); }
				if(this.isEmpTypePatternObj(x++)){ vals.push(Util.escapeCsv(empTypePattern.getPatternId())); }
				if(this.isEmpTypePatternObj(x++)){ vals.push(Util.escapeCsv(empTypePattern.getPatternName())); }
				if(this.isEmpTypePatternObj(x++)){ vals.push(Util.escapeCsv(empTypePattern.getDateOfApplication())); }
				body += vals.join(',') + '\n';
			}
			return head + '\n' + body;
		}
	});
});
