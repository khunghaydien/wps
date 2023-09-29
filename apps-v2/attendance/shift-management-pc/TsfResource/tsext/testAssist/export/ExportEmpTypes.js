define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObjs",
	"tsext/testAssist/export/ExportEmpType",
	"tsext/testAssist/export/ExportEmpTypePattern",
	"tsext/testAssist/export/ExportEmpTypeHoliday",
	"tsext/testAssist/DefaultSettings",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObjs, ExportEmpType, ExportEmpTypePattern, ExportEmpTypeHoliday, DefaultSettings, Util){
	// 勤務体系のコレクション
	return declare("tsext.testAssist.ExportEmpTypes", ExportObjs, {
		createObj: function(record){
			return new ExportEmpType(this.manager, record, this);
		},
		getDefaultEmpType: function(){
			if(!this.defaultEmpType){
				this.defaultEmpType = new ExportEmpType(this.mangager, DefaultSettings.getDefaultEmpType(), this);
			}
			return this.defaultEmpType;
		},
		getConfigBaseIds: function(){
			var cbIds = [];
			for(var x = 0 ; x < this.objs.length ; x++){
				var cbId = this.objs[x].getConfigBaseId();
				if(cbIds.indexOf(cbId) < 0){
					cbIds.push(cbId);
				}
			}
			return cbIds;
		},
		getEmpTypeById: function(id){
			return this.getObjById(id);
		},
		addEmpTypePatterns: function(records){
			for(var i = 0 ; i < records.length ; i++){
				var empTypePattern = new ExportEmpTypePattern(this.manager, records[i]);
				var et = this.getEmpTypeById(empTypePattern.getEmpTypeId());
				if(et){
					et.addEmpTypePattern(empTypePattern);
				}
			}
			for(var x = 0 ; x < this.objs.length ; x++){
				this.objs[x].sortEmpTypePatterns();
			}
		},
		addEmpTypeHolidays: function(records){
			for(var i = 0 ; i < records.length ; i++){
				var empTypeHoliday = new ExportEmpTypeHoliday(this.manager, records[i]);
				var et = this.getEmpTypeById(empTypeHoliday.getEmpTypeId());
				if(et){
					et.addEmpTypeHoliday(empTypeHoliday);
				}
			}
			for(var x = 0 ; x < this.objs.length ; x++){
				this.objs[x].sortEmpTypeHolidays();
			}
		},
		getPatternIds: function(){
			var ids = [];
			for(var x = 0 ; x < this.objs.length ; x++){
				var obj = this.objs[x];
				Util.mergeList(ids, obj.getPatternIds());
			}
			return ids;
		},
		getHolidayIds: function(){
			var ids = [];
			for(var x = 0 ; x < this.objs.length ; x++){
				var obj = this.objs[x];
				Util.mergeList(ids, obj.getHolidayIds());
			}
			return ids;
		},
		outputExportEmpTypes: function(lst){
			for(var x = 0 ; x < this.objs.length ; x++){
				var obj = this.objs[x];
				obj.outputExportEmpType(lst);
			}
			return lst;
		}
	});
});
