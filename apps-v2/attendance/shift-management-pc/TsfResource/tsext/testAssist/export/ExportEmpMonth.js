define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤怠月次
	return declare("tsext.testAssist.ExportEmpMonth", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 */
		constructor: function(manager, obj){
			this.obj.StartDate__c = Util.formatDate(this.obj.StartDate__c);
			this.obj.EndDate__c = Util.formatDate(this.obj.EndDate__c);
			this.obj.InitialDate__c = Util.formatDate(this.obj.InitialDate__c);
			this.clearCollect();
		},
		clearCollect: function(){
			this.empDays = []; // 勤怠日次
		},
		addEmpDay: function(empDay){
			this.empDays.push(empDay);
		},
		sortEmpDays: function(){
			this.empDays = this.empDays.sort(function(a, b){
				return (a.getDate() < b.getDate() ? -1 : 1);
			});
		},
		isFixed: function(){
			var status = (this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.Status__c) || null;
			if(status && ['承認済み','承認待ち','確定済み'].indexOf(status) >= 0){
				return true;
			}
			return false;
		},
		getStartDate: function(){
			return this.obj.StartDate__c;
		},
		getEndDate: function(){
			return this.obj.EndDate__c;
		},
		getYearMonth: function(flag){
			if(flag == 1){
				return this.obj.YearMonth__c + (this.obj.SubNo__c ? ('(' + this.obj.SubNo__c + ')') : '');
			}
			return this.obj.YearMonth__c + (this.obj.SubNo__c ? ('_' + this.obj.SubNo__c) : '');
		},
		getEmpTypeId: function(){
			return this.obj.EmpTypeId__c;
		},
		getEmpType: function(){
			return this.manager.getEmpTypeById(this.getEmpTypeId());
		},
		getConfigId: function(){
			return this.obj.ConfigId__c;
		},
		getPatternIds: function(){
			var ids = [];
			for(var i = 0 ; i < this.empDays.length ; i++){
				Util.mergeList(ids, this.empDays[i].getPatternId());
			}
			return ids;
		},
		getHolidayIds: function(){
			var ids = [];
			for(var i = 0 ; i < this.empDays.length ; i++){
				Util.mergeList(ids, this.empDays[i].getHolidayIds());
			}
			return ids;
		},
		outputExportEmpMonth: function(lst, visit, emp, curLoad){
			for(var i = 0 ; i < this.empDays.length ; i++){
				this.empDays[i].outputExportEmpDay(lst, visit, emp, curLoad);
			}
			return lst;
		},
		/**
		 * 月次確定をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {tsext.testAssist.ExportEmp} emp
		 * @param {{virMonth:{tsext.testAssist.ExportVirMonth},loaded:{boolean}}} curLoad 
		 * @returns {Array.<string>}
		 */
		 outputExportFixMonth: function(lst, visit, emp, curLoad){
			if(this.isFixed()){
				emp.outputExportLoadMonth(lst, visit, curLoad, this.getStartDate());
				this.L(lst, [
					Constant.KEY_ENTRY, // 入力
					Constant.KEY_SHEET, // 勤務表
					'',
					Constant.ITEM1_MONTHLY_FIX, // 月次確定
					this.getYearMonth() // 月度
				]);
			}
			return lst;
		}
	});
});
