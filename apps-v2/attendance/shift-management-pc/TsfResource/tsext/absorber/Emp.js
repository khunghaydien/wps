define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/obj/HistoryRange",
	"tsext/absorber/EmpTypeAgent",
	"tsext/absorber/EmpMonths",
	"tsext/absorber/EmpYuqs",
	"tsext/absorber/EmpStockSet",
	"tsext/util/Util"
], function(declare, lang, array, str, HistoryRange, EmpTypeAgent, EmpMonths, EmpYuqs, EmpStockSet, Util){
	return declare("tsext.absorber.Emp", null, {
		constructor: function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			o.EntryDate__c	   = Util.formatDate(o.EntryDate__c);
			o.EndDate__c	   = Util.formatDate(o.EndDate__c);
			this.obj = o;
			this.historyRanges = EmpTypeAgent.getHistoryRanges(this.obj.EmpTypeHistory__c, this.obj.EmpTypeId__c);
		},
		reset: function(){
			this.months   = new EmpMonths();
			this.yuqs     = new EmpYuqs();
			this.stockSet = new EmpStockSet();
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
		getDeptCode   : function(){ return (this.obj.DeptId__r && this.obj.DeptId__r.DeptCode__c) || ''; },
		getDeptName   : function(){ return (this.obj.DeptId__r && this.obj.DeptId__r.Name) || ''; },
		getEntryDate  : function(){ return this.obj.EntryDate__c || ''; },
		getEndDate    : function(){ return this.obj.EndDate__c || ''; },
		getEmpTypeName: function(){ return (this.obj.EmpTypeId__r && this.obj.EmpTypeId__r.Name) || ''; },

		addEmpMonth: function(month){
			this.months.addEmpMonth(month);
		},
		replaceEmpMonth: function(month){
			this.months.replaceEmpMonth(month);
		},
		getEmpMonth: function(yearMonth, subNo){
			return this.months.getEmpMonth(yearMonth, subNo);
		},
		addEmpYuq: function(yuq){
			this.yuqs.addEmpYuq(yuq);
		},
		addEmpYuqDetail: function(detail){
			this.yuqs.addEmpYuqDetail(detail);
		},
		addEmpStock: function(stock){
			this.stockSet.addEmpStock(stock);
		},
		addEmpStockDetail: function(detail){
			this.stockSet.addEmpStockDetail(detail);
		},
		buildYuqs: function(){
			this.yuqs.build();
		},
		buildStocks: function(){
			this.stockSet.buildStocks();
		},
		getStockTypeList: function(){
			return this.stockSet.getStockTypeList();
		},
		getMonthInfo: function(yearMonth, subNo){
			return EmpTypeAgent.getMonthInfo(this.historyRanges, yearMonth, subNo);
		},
		getYuqRemainDaysInRange: function(sd, ed){
			return this.yuqs.getYuqRemainDaysInRange(sd, ed);
		},
		getRemainYuqDaysInRange: function(sd, ed){
			return this.yuqs.getRemainYuqDaysInRange(sd, ed);
		},
		getYuqSpendDaysInRange: function(sd, ed){
			return this.yuqs.getYuqSpendDaysInRange(sd, ed);
		},
		getStockRemainDaysInRange: function(holidayName, sd, ed){
			return this.stockSet.getStockRemainDaysInRange(holidayName, sd, ed);
		},
		getRemainStocksInRange: function(holidayName, sd, ed){
			return this.stockSet.getRemainStocksInRange(holidayName, sd, ed);
		},
		getStockSpendDaysInRange: function(holidayName, sd, ed){
			return this.stockSet.getStockSpendDaysInRange(holidayName, sd, ed);
		},
		getYuqLines1: function(){
			if(!this.yuqs.getSize()){
				return '';
			}
			var line = [];
			var provideDays    = this.yuqs.getProvideDays();
			var spendDays      = this.yuqs.getSpendDays();
			var expiredDays    = this.yuqs.getExpiredDays();
			var remainDays     = this.yuqs.getRemainDays();
			var disconnectDays = this.yuqs.getDisconnectDays();
			line.push('"' + Util.escapeCsv(this.getEmpCode())     + '"');
			line.push('"' + Util.escapeCsv(this.getName())        + '"');
			line.push('"' + Util.escapeCsv(this.getDeptCode())    + '"');
			line.push('"' + Util.escapeCsv(this.getDeptName())    + '"');
			line.push('"' + Util.escapeCsv(this.getEmpTypeName()) + '"');
			line.push('"' + Util.escapeCsv(this.getEntryDate())   + '"');
			line.push('"' + Util.escapeCsv(this.getEndDate())     + '"');
			line.push('"' + Util.escapeCsv(provideDays.days)      + '"'); // 付与数(D)
			line.push('"' + Util.escapeCsv(provideDays.hours)     + '"'); // 付与数(H)
			line.push('"' + Util.escapeCsv(spendDays.days)        + '"'); // 消化数(D)
			line.push('"' + Util.escapeCsv(spendDays.hours)       + '"'); // 消化数(H)
			line.push('"' + Util.escapeCsv(expiredDays.days)      + '"'); // 失効数(D)
			line.push('"' + Util.escapeCsv(expiredDays.hours)     + '"'); // 失効数(H)
			line.push('"' + Util.escapeCsv(remainDays.days)       + '"'); // 残日数(D)
			line.push('"' + Util.escapeCsv(remainDays.hours)      + '"'); // 残日数(H)
			line.push('"' + Util.escapeCsv(disconnectDays.days)   + '"'); // 紐付切れ数(D)
			line.push('"' + Util.escapeCsv(disconnectDays.hours)  + '"'); // 紐付切れ数(H)
			return line.join(',') + '\n';
		},
		getYuqLines2: function(){
			if(!this.yuqs.getSize()){
				return '';
			}
			var lines = [];
			var bs = [];
			bs.push('"' + Util.escapeCsv(this.getEmpCode())     + '"');
			bs.push('"' + Util.escapeCsv(this.getName())        + '"');
			bs.push('"' + Util.escapeCsv(this.getDeptCode())    + '"');
			bs.push('"' + Util.escapeCsv(this.getDeptName())    + '"');
			bs.push('"' + Util.escapeCsv(this.getEmpTypeName()) + '"');
			bs.push('"' + Util.escapeCsv(this.getEntryDate())   + '"');
			bs.push('"' + Util.escapeCsv(this.getEndDate())     + '"');
			if(!this.yuqs.getSize()){
				lines.push(bs.join(','));
			}
			var list = this.yuqs.getOutputList();
			for(var i = 0 ; i < list.length ; i++){
				var obj = list[i];
				var yuq = obj.yuq;
				var line = lang.clone(bs);
				var provideDays = yuq.getProvideDays();
				var yd = (obj.time ? yuq.yd.clone(obj.time) : null);
				var spendDays = {
					days:  yd ? yd.getDays()  : '',
					hours: yd ? yd.getHours() : ''
				};
				var remainDays     = yuq.getProvideRemain();
				var disconnectDays = yuq.getDisconnectDays();
				line.push('"' + Util.escapeCsv(yuq.getCategory())      + '"');         // 分類（付与／消化）
				line.push('"' + Util.escapeCsv(provideDays.days)       + '"');         // 付与日数
				line.push('"' + Util.escapeCsv(provideDays.hours)      + '"');         // 付与時間
				line.push('"' + Util.escapeCsv(spendDays.days)         + '"');         // 消化日数
				line.push('"' + Util.escapeCsv(spendDays.hours)        + '"');         // 消化時間
				line.push('"' + Util.escapeCsv(remainDays.days)        + '"');         // 残日数
				line.push('"' + Util.escapeCsv(remainDays.hours)       + '"');         // 残時間
				line.push('"' + Util.escapeCsv(yuq.isExpired() ? '失効' : '') + '"');  // 失効
				line.push('"' + Util.escapeCsv(yuq.getStartDate())     + '"');         // 有効開始日
				line.push('"' + Util.escapeCsv(yuq.getLimitDate())     + '"');         // 失効日
				line.push('"' + Util.escapeCsv(yuq.getDate())          + '"');         // 消化日
				line.push('"' + Util.escapeCsv(yuq.getFork())          + '"');         // 分割
				line.push('"' + Util.escapeCsv(disconnectDays.days)    + '"');         // 紐付切れ日数
				line.push('"' + Util.escapeCsv(disconnectDays.hours)   + '"');         // 紐付切れ時間
				line.push('"' + Util.escapeCsv(yuq.getEmpApplyName())  + '"');         // 付与/消化要因
				line.push('"' + Util.escapeCsv(yuq.getSubject())       + '"');         // 事柄
				lines.push(line.join(','));
			}
			return lines.join('\n') + '\n';
		},
		getStockLines1: function(key){
			var stocks = this.stockSet.getStocks(key);
			if(!stocks || !stocks.getSize()){
				return '';
			}
			var line = [];
			line.push('"' + Util.escapeCsv(this.getEmpCode())     + '"');
			line.push('"' + Util.escapeCsv(this.getName())        + '"');
			line.push('"' + Util.escapeCsv(this.getDeptCode())    + '"');
			line.push('"' + Util.escapeCsv(this.getDeptName())    + '"');
			line.push('"' + Util.escapeCsv(this.getEmpTypeName()) + '"');
			line.push('"' + Util.escapeCsv(this.getEntryDate())   + '"');
			line.push('"' + Util.escapeCsv(this.getEndDate())     + '"');
			line.push('"' + Util.escapeCsv(key)                    + '"');
			line.push('"' + Util.escapeCsv(stocks.getProvideDays()) + '"');    // 付与数
			line.push('"' + Util.escapeCsv(stocks.getSpendDays())   + '"');    // 消化数
			line.push('"' + Util.escapeCsv(stocks.getExpiredDays()) + '"');    // 失効数
			line.push('"' + Util.escapeCsv(stocks.getRemainDays())  + '"');    // 残日数
			line.push('"' + Util.escapeCsv(stocks.getDisconnectDays()) + '"'); // 紐付切れ数
			return line.join(',') + '\n';
		},
		getStockLines2: function(key){
			var stocks = this.stockSet.getStocks(key);
			if(!stocks || !stocks.getSize()){
				return '';
			}
			var lines = [];
			var bs = [];
			bs.push('"' + Util.escapeCsv(this.getEmpCode())     + '"');
			bs.push('"' + Util.escapeCsv(this.getName())        + '"');
			bs.push('"' + Util.escapeCsv(this.getDeptCode())    + '"');
			bs.push('"' + Util.escapeCsv(this.getDeptName())    + '"');
			bs.push('"' + Util.escapeCsv(this.getEmpTypeName()) + '"');
			bs.push('"' + Util.escapeCsv(this.getEntryDate())   + '"');
			bs.push('"' + Util.escapeCsv(this.getEndDate())     + '"');
			var list = stocks.getOutputList();
			for(var i = 0 ; i < list.length ; i++){
				var obj = list[i];
				var stock = obj.stock;
				var line = lang.clone(bs);
				line.push('"' + Util.escapeCsv(key)                      + '"');         // 種類
				line.push('"' + Util.escapeCsv(stock.getCategory())      + '"');         // 分類（付与／消化）
				line.push('"' + Util.escapeCsv(stock.getProvideDays())   + '"');         // 付与
				line.push('"' + Util.escapeCsv(obj.days ? obj.days : '') + '"');         // 消化
				line.push('"' + Util.escapeCsv(stock.getProvideRemain()) + '"');         // 残数
				line.push('"' + Util.escapeCsv(stock.isExpired() ? '失効' : '') + '"');  // 失効
				line.push('"' + Util.escapeCsv(stock.getStartDate())     + '"');         // 有効開始日
				line.push('"' + Util.escapeCsv(stock.getLimitDate())     + '"');         // 失効日
				line.push('"' + Util.escapeCsv(stock.getDate())          + '"');         // 消化日
				line.push('"' + Util.escapeCsv(stock.getFork())          + '"');         // 分割
				line.push('"' + Util.escapeCsv(stock.getDisconnectDays()) + '"');        // 紐付切れ数
				line.push('"' + Util.escapeCsv(stock.getEmpApplyName())  + '"');         // 付与/消化要因
				lines.push(line.join(','));
			}
			return lines.join('\n') + '\n';
		},
		getMonthLines: function(){
			var lines = [];
			var bs = [];
			bs.push('"' + Util.escapeCsv(this.getEmpCode())     + '"');
			bs.push('"' + Util.escapeCsv(this.getName())        + '"');
			bs.push('"' + Util.escapeCsv(this.getDeptCode())    + '"');
			bs.push('"' + Util.escapeCsv(this.getDeptName())    + '"');
			bs.push('"' + Util.escapeCsv(this.getEmpTypeName()) + '"');
			bs.push('"' + Util.escapeCsv(this.getEntryDate())   + '"');
			bs.push('"' + Util.escapeCsv(this.getEndDate())     + '"');
			var months = this.months.getEmpMonths();
			for(var i = 0 ; i < months.length ; i++){
				var month = months[i] || '';
				var line = lang.clone(bs);
				line.push('"' + Util.escapeCsv(month.getYearMonth()) + '"');
				line.push('"' + Util.escapeCsv(month.getStartDate()) + '"');
				line.push('"' + Util.escapeCsv(month.getEndDate()) + '"');
				line.push('"' + Util.escapeCsv(month.getStatus()) + '"');
				lines.push(line.join(','));
			}
			return (lines.length > 0 ? (lines.join('\n') + '\n') : '');
		}
	});
});
