define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, Constant, Util){
	// 勤怠月次
	return declare("tsext.testAssist.ExportVirMonth", null, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 */
		constructor: function(manager, vm){
			this.manager = manager;
			this.vm = vm;
			this.empMonth = null;
			this.empApplys = [];
		},
		setEmpMonth: function(empMonth){
			this.empMonth = empMonth;
		},
		getEmpMonth: function(){
			return this.empMonth;
		},
		getStartDate: function(){
			return this.vm.sd;
		},
		getEndDate: function(){
			return this.vm.ed;
		},
		getYearMonth: function(flag){
			if(flag == 1){
				return this.vm.ym + (this.vm.subNo ? ('(' + this.vm.subNo + ')') : '');
			}
			return this.vm.ym + (this.vm.subNo ? ('_' + this.vm.subNo) : '');
		},
		isSameMonth: function(other){
			return this.getYearMonth() == other.getYearMonth();
		},
		/**
		 * 勤務体系変更履歴に基づく勤務体系変更後の最初の月
		 * @returns {boolean}
		 */
		isChangeEmpType: function(){
			return this.vm.changeEt;
		},
		getEmpType: function(){
			if(this.empMonth && this.empMonth.isFixed()){
				return this.empMonth.getEmpType();
			}
			return this.vm.empType;
		},
		getConfig: function(){
			if(this.empMonth && this.empMonth.isFixed()){
				return this.manager.getConfigById(this.empMonth.getConfigId());
			}
			var empType = this.getEmpType();
			return this.manager.getConfigByConfigBaseIdAndDate(empType.getConfigBaseId(), this.vm.ed);
		},
		/**
		 * 全勤怠申請から当月に関連する勤怠申請を抽出する
		 * @param {Array.<tsext.testAssist.ExportEmpApply>} allApplys 
		 */
		setEmpApplys: function(allApplys){
			var sd = this.getStartDate(), ed = this.getEndDate();
			var eas = [];
			var exmap = {};
			var orgDates = [];
			for(var i = 0 ; i < allApplys.length ; i++){
				var ea = allApplys[i];
				if(ea.getApplyType() == '振替申請'){
					var d1 = (ea.getStartDate() < ea.getExchangeDate() ? ea.getStartDate() : ea.getExchangeDate());
					var d2 = (ea.getStartDate() < ea.getExchangeDate() ? ea.getExchangeDate() : ea.getStartDate());
					if(d1 <= ed && sd <= d2){
						exmap[ea.getId()] = 1;
						Util.mergeList(orgDates, ea.getOriginalStartDate());
						eas.push(ea);
					}
				}else{
					if(ea.getStartDate() <= ed && sd <= ea.getEndDate()){
						eas.push(ea);
					}
				}
			}
			for(var i = 0 ; i < allApplys.length ; i++){
				var ea = allApplys[i];
				if(ea.getApplyType() == '振替申請' && !exmap[ea.getId()] && orgDates.indexOf(ea.getOriginalStartDate()) >= 0){
					eas.push(ea);
					exmap[ea.getId()] = 1;
				}
			}
			eas = eas.sort(function(a, b){
				return a.compare(b);
			});
			this.empApplys = eas;
		},
		getEmpApplys: function(){
			return this.empApplys;
		},
		getPatterns: function(){
			var empType = this.getEmpType();
			var ids = empType.getPatternIds();
			if(this.empMonth){
				Util.mergeList(ids, this.empMonth.getPatternIds());
			}
			for(var i = 0 ; i < this.empApplys.length ; i++){
				Util.mergeList(ids, this.empApplys[i].getPatternId());
			}
			return this.manager.getPatternsByIds(ids, true);
		},
		getHolidays: function(){
			var empType = this.getEmpType();
			var ids = empType.getHolidayIds();
			if(this.empMonth){
				Util.mergeList(ids, this.empMonth.getHolidayIds());
			}
			for(var i = 0 ; i < this.empApplys.length ; i++){
				Util.mergeList(ids, this.empApplys[i].getHolidayId());
			}
			return this.manager.getHolidaysByIds(ids, true);
		},
		mergeEmpTypes: function(objs){
			return this.mergeObj(objs, this.getEmpType());
		},
		mergePatterns: function(objs){
			return this.mergeObjs(objs, this.getPatterns());
		},
		mergeHolidays: function(objs){
			return this.mergeObjs(objs, this.getHolidays());
		},
		mergeObj: function(objs, target){
			for(var i = 0 ; i < objs.length ; i++){
				if(objs[i].getId() == target.getId()){
					break;
				}
			}
			if(i >= objs.length){
				objs.push(target);
			}
			return objs;
		},
		mergeObjs: function(objs, targets){
			for(var i = 0 ; i < targets.length ; i++){
				this.mergeObj(objs, targets[i]);
			}
			return objs;
		},
		/**
		 * 当月の勤怠データに関与する全ての日付を返す
		 * @param {Object} dateMap
		 * @returns {Object}
		 */
		 addInvolvedDateMap: function(dateMap){
			var d = this.getStartDate();
			var ed = this.getEndDate();
			while(d <= ed){
				dateMap[d] = 1;
				d = Util.addDays(d, 1);
			}
			for(var i = 0 ; i < this.empApplys.length ; i++){
				var ea = this.empApplys[i];
				if(ea.getApplyType() == '振替申請'){
					dateMap[ea.getStartDate()] = 1;
					dateMap[ea.getExchangeDate()] = 1;
					dateMap[ea.getOriginalStartDate()] = 1;
				}else{
					d = ea.getStartDate();
					ed = ea.getEndDate();
					while(d <= ed){
						dateMap[d] = 1;
						d = Util.addDays(d, 1);
					}
				}
			}
			return dateMap;
		},
		/**
		 * 分別した申請の配列を返す
		 * @param {number} phase 1:日次確定以外 2:日次確定
		 * @returns {Array.<tsext.testAssist.ExportEmpApply>}
		 */
		filterEmpApplys: function(phase){
			var eas = [];
			for(var i = 0 ; i < this.empApplys.length ; i++){
				var ea = this.empApplys[i];
				if((ea.getApplyType() != '日次確定' && phase == 1)
				|| (ea.getApplyType() == '日次確定' && phase == 2)){
					eas.push(ea);
				}
			}
			return eas;
		},
		/**
		 * 勤怠申請をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {tsext.testAssist.ExportEmp} emp
		 * @param {Array.<tsext.testAssist.ExportEmpApply>} applys
		 * @param {{virMonth:{tsext.testAssist.ExportVirMonth},loaded:{boolean}}} curLoad 
		 * @returns {Array.<string>}
		 */
		 outputExportApply: function(lst, visit, emp, applys, curLoad){
			for(var i = 0 ; i < applys.length ; i++){
				applys[i].outputExportEmpApply(lst, visit, emp, curLoad, this);
			}
		},
		/**
		 * 月単位の勤怠申請、打刻、月次確定をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {tsext.testAssist.ExportEmp} emp
		 * @param {tsext.testAssist.ExportConfig} config
		 * @param {{virMonth:{tsext.testAssist.ExportVirMonth},loaded:{boolean}}} curLoad 
		 * @returns {Array.<string>}
		 */
		 outputExportMonth: function(lst, visit, emp, config, curLoad){
			// 勤怠申請（日次確定以外）
			this.outputExportApply(lst, visit, emp, this.filterEmpApplys(1), curLoad);
			// 打刻
			if(this.empMonth){
				this.empMonth.outputExportEmpMonth(lst, visit, emp, curLoad, this);
			}
			// 勤怠申請（日次確定）
			this.outputExportApply(lst, visit, emp, this.filterEmpApplys(2), curLoad);
			// 月次確定
			if(this.empMonth && this.empMonth.isFixed()){
				this.empMonth.outputExportFixMonth(lst, visit, emp, curLoad, this);
			}
			return lst;
		}
	});
});
