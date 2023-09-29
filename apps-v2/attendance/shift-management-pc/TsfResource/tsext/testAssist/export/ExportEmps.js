define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObjs",
	"tsext/testAssist/export/ExportEmp",
	"tsext/testAssist/export/ExportEmpMonth",
	"tsext/testAssist/export/ExportEmpDay",
	"tsext/testAssist/export/ExportEmpApply",
	"tsext/testAssist/export/ExportEmpYuq",
	"tsext/testAssist/export/ExportEmpYuqDetail",
	"tsext/testAssist/export/ExportEmpStock",
	"tsext/testAssist/export/ExportEmpStockDetail",
	"tsext/testAssist/DefaultSettings",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObjs, ExportEmp, ExportEmpMonth, ExportEmpDay, ExportEmpApply, ExportEmpYuq, ExportEmpYuqDetail, ExportEmpStock, ExportEmpStockDetail, DefaultSettings, Util){
	// 勤怠社員のコレクション
	return declare("tsext.testAssist.ExportEmps", ExportObjs, {
		createObj: function(record){
			return new ExportEmp(this.manager, record, this);
		},
		getDefaultEmp: function(){
			if(!this.defaultEmp){
				this.defaultEmp = new ExportEmp(this.mangager, DefaultSettings.getDefaultEmp(), this);
			}
			return this.defaultEmp;
		},
		getEmpById: function(id){
			return this.getObjById(id);
		},
		addEmpMonths: function(records){
			for(var i = 0 ; i < records.length ; i++){
				var emp = this.getEmpById(records[i].EmpId__c);
				if(emp){
					emp.addEmpMonth(new ExportEmpMonth(this.manager, records[i]));
				}
			}
			for(var x = 0 ; x < this.objs.length ; x++){
				this.objs[x].sortEmpMonths();
			}
		},
		addEmpDays: function(records){
			for(var i = 0 ; i < records.length ; i++){
				var empMonth = this.getEmpMonthById(records[i].EmpMonthId__c);
				if(empMonth){
					empMonth.addEmpDay(new ExportEmpDay(this.manager, records[i]));
				}
			}
			for(var x = 0 ; x < this.objs.length ; x++){
				this.objs[x].sortEmpDays();
			}
		},
		addEmpApplys: function(records){
			for(var i = 0 ; i < records.length ; i++){
				var emp = this.getEmpById(records[i].EmpId__c);
				if(emp){
					emp.addEmpApply(new ExportEmpApply(this.manager, records[i]));
				}
			}
		},
		addEmpYuqs: function(records){
			for(var i = 0 ; i < records.length ; i++){
				var emp = this.getEmpById(records[i].EmpId__c);
				if(emp){
					emp.addEmpYuq(new ExportEmpYuq(this.manager, records[i]));
				}
			}
		},
		addEmpYuqDetails: function(records){
			for(var i = 0 ; i < records.length ; i++){
				var emp = this.getEmpById(records[i].EmpYuqId__r.EmpId__c);
				if(emp){
					emp.addEmpYuqDetail(new ExportEmpYuqDetail(this.manager, records[i]));
				}
			}
			for(var x = 0 ; x < this.objs.length ; x++){
				this.objs[x].sortEmpYuqs();
			}
		},
		addEmpStocks: function(records){
			for(var i = 0 ; i < records.length ; i++){
				var emp = this.getEmpById(records[i].EmpId__c);
				if(emp){
					emp.addEmpStock(new ExportEmpStock(this.manager, records[i]));
				}
			}
		},
		addEmpStockDetails: function(records){
			for(var i = 0 ; i < records.length ; i++){
				var emp = this.getEmpById(records[i].ConsumedByStockId__r.EmpId__c);
				if(emp){
					emp.addEmpStockDetail(new ExportEmpStockDetail(this.manager, records[i]));
				}
			}
			for(var x = 0 ; x < this.objs.length ; x++){
				this.objs[x].sortEmpStocks();
			}
		},
		/**
		 * 社員毎に仮想月度を作成する。
		 * ※ 必要なデータ（勤務体系）が読み込まれてから行う。
		 */
		buildEmps: function(){
			for(var i = 0 ; i < this.objs.length ; i++){
				this.objs[i].buildEmp();
			}
		},
		getEmpById: function(id){
			for(var x = 0 ; x < this.objs.length ; x++){
				var obj = this.objs[x];
				if(obj.getId() == id){
					return obj;
				}
			}
			return null;
		},
		getEmpMonthById: function(id){
			for(var x = 0 ; x < this.objs.length ; x++){
				var obj = this.objs[x];
				var empMonth = obj.getEmpMonthById(id);
				if(empMonth){
					return empMonth;
				}
			}
			return null;
		},
		getEmpTypeIds: function(){
			var ids = [];
			for(var x = 0 ; x < this.objs.length ; x++){
				var obj = this.objs[x];
				Util.mergeList(ids, obj.getEmpTypeIds());
			}
			return ids;
		},
		getConfigIds: function(){
			var ids = [];
			for(var x = 0 ; x < this.objs.length ; x++){
				var obj = this.objs[x];
				Util.mergeList(ids, obj.getConfigIds());
			}
			return ids;
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
		getEmpYuqById: function(empId, yuqId){
			var emp = this.getEmpById(empId);
			return emp.getEmpYuqById(yuqId);
		},
		getEmpStockById: function(empId, stockId){
			var emp = this.getEmpById(empId);
			return emp.getEmpStockById(stockId);
		}
	});
});
