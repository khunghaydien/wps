define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/leave/ConfigHistorys",
	"tsext/leave/EmpMonths",
	"tsext/leave/EmpStocks",
	"tsext/leave/StockTransitions",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Wait, ConfigHistorys, EmpMonths, EmpStocks, StockTransitions, Util){
	return declare("tsext.leave.Emp", null, {
		constructor : function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			o.EntryDate__c	   = Util.formatDate(o.EntryDate__c);
			o.EndDate__c	   = Util.formatDate(o.EndDate__c);
			this.obj = o;
			this.configHistorys = null;
			this.empMonths = null;
			this.empStocks = new EmpStocks();
			this.stockTransitions = new StockTransitions();
		},
		reset: function(){
			this.configHistorys = null;
			this.empMonths = null;
			this.empStocks = new EmpStocks();
			this.stockTransitions = new StockTransitions();
		},
		getId: function(){
			return this.obj.Id;
		},
		getEmpCode: function(){
			return this.obj.EmpCode__c || null;
		},
		getName: function(){
			return this.obj.Name;
		},
		getCodeAndName: function(){
			return (this.getEmpCode() || '') + ' - ' + this.getName();
		},
		getDeptCode   : function(){ return (this.obj.DeptId__r && this.obj.DeptId__r.DeptCode__c) || ''; },
		getDeptName   : function(){ return (this.obj.DeptId__r && this.obj.DeptId__r.Name) || ''; },
		getEntryDate  : function(){ return this.obj.EntryDate__c || ''; },
		getEndDate    : function(){ return this.obj.EndDate__c || ''; },
		getEmpTypeName: function(){ return (this.obj.EmpTypeId__r && this.obj.EmpTypeId__r.Name) || ''; },
		getConfigHistorys: function(){ return this.configHistorys; },
		getEmpMonths: function(){ return this.empMonths; },
		getEmpStocks: function(){
			return this.empStocks;
		},
		addEmpStock: function(empStock){
			this.empStocks.addEmpStock(empStock);
		},
		compare: function(other){
			var c1 = this.getEmpCode();
			var c2 = other.getEmpCode();
			if(c1 && c2){
				return (c1 < c2 ? -1 : 1);
			}else if(!c1 && !c2){
				return (this.getName() < other.getName() ? -1 : 1);
			}else{
				return (c1 ? 1 : -1);
			}
		},
		fetchConfigHistory: function(callback){
			if(this.configHistorys){
				callback(true);
				return;
			}
			var req = {
				action: 'fetchConfigHistory',
				empId: this.getId()
			};
			Request.actionA(
				tsCONST.API_GET_EXT_RESULT,
				req,
				true
			).then(
				lang.hitch(this, function(result){
					this.configHistorys = new ConfigHistorys(result.configHistory);
					callback(true);
				}),
				lang.hitch(this, function(errmsg){
					callback(false, errmsg);
				})
			);
		},
		fetchMonthRanges: function(callback){
			var req = {
				action: 'fetchMonthRanges',
				empId: this.getId()
			};
			Request.actionA(
				tsCONST.API_GET_EXT_RESULT,
				req,
				true
			).then(
				lang.hitch(this, function(result){
					this.empMonths = new EmpMonths(result.monthRanges);
					callback(true);
				}),
				lang.hitch(this, function(errmsg){
					callback(false, errmsg);
				})
			);
		},
		// 積休再計算を実行
		rebuildStock: function(dt, manageName, callback){
			var req = {
				action: 'operateEmpStock',
				operateType: 'rebuildStockWithTime',
				empId: this.getId(),
				stockType: manageName,
				baseDate: dt
			};
			Request.actionA(
				tsCONST.API_GET_EXT_RESULT,
				req,
				true
			).then(
				lang.hitch(this, function(result){
					callback(true, result);
				}),
				lang.hitch(this, function(errmsg){
					callback(false, errmsg);
				})
			);
		},
		checkSyncStocks: function(){
			array.forEach(this.empStocks.getAll(), function(stock){
				var bt = stock.getBaseTime();
				if(bt){
					var d = (stock.isProvide() ? stock.getStartDate() : stock.getDate());
					var c = this.configHistorys.getConfigByDate(d);
					stock.setSyncBaseTime(c ? c.getBaseTimeForStock() : null);
				}
			}, this);
		},
		// 指定日時点の残日数を取得
		getRemainDaysByDate: function(d, stepValue){
			var rd = new Decimal(0);
			array.forEach(this.empStocks.getAll(), function(stock){
				rd = rd.plus(stock.getRemainByDate(d));
			}, this);
			var c = this.configHistorys.getConfigByDate(d);
			return Util.parseDaysAndHours(rd.toNumber(), {baseTime:c.getBaseTimeForStock(), stepValue:stepValue, flag:1}); // 残日数を日数＋時間に分解
		},
		getProvideStocks: function(){
			var lst = [];
			var stocks = this.empStocks.getAll();
			for(var i = 0 ; i < stocks.length ; i++){
				var stock = stocks[i];
				if(stock.isProvide()){
					lst.push(stock);
				}
			}
			return lst;
		},
		getConfigByDate: function(d){
			return this.configHistorys.getConfigByDate(d);
		},
		// 積休変遷リストをリセット
		resetStockTransitions: function(){
			this.stockTransitions.reset();
		},
		// 積休変遷リストを生成
		createStockTransitions: function(stepValue){
			if(!this.configHistorys){
				return [];
			}
			return this.stockTransitions.createTransitions(this.empStocks.getAll(), this.configHistorys.getAll(), stepValue);
		},
		// 積休変遷リストを返す
		getStockTransitions: function(viewMode){
			return this.stockTransitions.getTransitions(viewMode, true);
		}
	});
});
