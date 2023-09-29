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
	"tsext/configDownload/ConfigDownloadEmpTypeHoliday",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Helper, DataLoader, Request, Agent, ConfigDownloadEmpTypeHoliday, Util){
	return declare("tsext.configDownload.ConfigDownloadEmpTypeHolidays", null, {
		constructor : function(opt){
			this.opt = opt;
			this.empTypeHolidayObjs = [
			{ name:'勤務体系ID'		, oid:true },
			{ name:'勤務体系名'		},
			{ name:'勤怠休暇ID'		, oid:true },
			{ name:'勤怠休暇名'		}
			];
		},
		setEmpTypeHolidays: function(records){
			this.empTypeHolidays = records;
		},
		createEmpTypeHolidayContents: function(){
			this.empTypeHolidayList = [];
			array.forEach(this.empTypeHolidays, function(empTypeHoliday){
				this.empTypeHolidayList.push(new ConfigDownloadEmpTypeHoliday(empTypeHoliday, this));
			}, this);
		},
		getEmpTypeHolidayCsvHeads: function(objs){
			var heads = [];
			var x = 0;
			array.forEach(this.empTypeHolidayObjs, function(obj){
				if(this.isEmpTypeHolidayObj(x++)){
					heads.push(obj.name);
				}
			}, this);
			return heads;
		},
		isEmpTypeHolidayObj: function(index){
			var obj = this.empTypeHolidayObjs[index];
			var flag = true;
			if(obj.oid && !this.opt.oid){ flag = false; }
			if(obj.oby && !this.opt.oby){ flag = false; }
			if(obj.odt && !this.opt.odt){ flag = false; }
			return flag;
		},
		getEmpTypeHolidayCsvContents: function(){
			this.createEmpTypeHolidayContents();
			var head = this.getEmpTypeHolidayCsvHeads().join(',');
			var body = '';
			for(var i = 0 ; i < this.empTypeHolidayList.length ; i++){
				var empTypeHoliday = this.empTypeHolidayList[i];
				var vals = [];
				var x = 0;
				if(this.isEmpTypeHolidayObj(x++)){ vals.push(Util.escapeCsv(empTypeHoliday.getEmpTypeId())); }
				if(this.isEmpTypeHolidayObj(x++)){ vals.push(Util.escapeCsv(empTypeHoliday.getEmpTypeName())); }
				if(this.isEmpTypeHolidayObj(x++)){ vals.push(Util.escapeCsv(empTypeHoliday.getHolidayId())); }
				if(this.isEmpTypeHolidayObj(x++)){ vals.push(Util.escapeCsv(empTypeHoliday.getHolidayName())); }
				body += vals.join(',') + '\n';
			}
			return head + '\n' + body;
		}
	});
});
