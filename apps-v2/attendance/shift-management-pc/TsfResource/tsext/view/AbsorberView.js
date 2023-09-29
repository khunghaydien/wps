define([
	"dojo/_base/declare",
	"dojo/_base/json",
	"dojo/_base/array",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/query",
	"dojo/on",
	"dojo/string",
	"dojo/_base/lang",
	"dojo/text!tsext/template/absorberView.html",
	"tsext/service/Request",
	"tsext/dialog/EmpSearch",
	"tsext/dialog/Processing",
	"tsext/dialog/Wait",
	"tsext/widget/CheckTable",
	"tsext/service/Agent",
	"tsext/absorber/CsvRows",
	"tsext/absorber/Emps",
	"tsext/absorber/CommonAgent",
	"tsext/absorber/HolidayAgent",
	"tsext/absorber/EmpTypeAgent",
	"tsext/absorber/LogAgent",
	"tsext/absorber/ProcessUnits",
	"tsext/absorber/Constant",
	"tsext/absorber/Debug",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domStyle, query, on, str, lang, template, Request, EmpSearch, Processing, Wait, CheckTable, Agent, CsvRows, Emps, CommonAgent, HolidayAgent, EmpTypeAgent, LogAgent, ProcessUnits, Constant, Debug, Util) {
	return declare("tsext.view.AbsorberView", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(){
			this.csvRows = null;
			this.emps = new Emps();
			this.debug = new Debug();
			this.lastPreCheck = null;
		},
		placeAt: function(){
			this.inherited(arguments);
			this.startup();
		},
		startup: function(){
			this.inherited(arguments);
			this.own(
				on(dom.byId('absorberUpload'), 'change' , lang.hitch(this, this.loadData)),
				on(query('.tsext-c-check' , this.domNode)[0], 'click' , lang.hitch(this, this.checkStart)), // 事前チェック
				on(query('.tsext-c-import', this.domNode)[0], 'click' , lang.hitch(this, this.importStart)) // 取り込み開始
			);
			this.enableCheckStart(false);
			this.enableImportStart(false);
			this.fetchCommon(); // データ採取
		},
		destroy : function(){
			this.inherited(arguments);
		},
		// エラー表示
		showError: function(errmsg){
			Wait.show(false);
			LogAgent.addLog(errmsg);
			var els = query('div.tsext-error', this.domNode);
			if(els.length){
				var el = els[0];
				domConstruct.empty(el);
				domConstruct.create('div', { innerHTML: (errmsg ? 'ERROR: ' : '') + errmsg }, el);
				domStyle.set(el, 'display', (errmsg ? '' : 'none'));
			}
		},
		// 事前チェックボタンの活性/非活性切替
		enableCheckStart: function(flag){
			domAttr.set(query('.tsext-c-check', this.domNode)[0], 'disabled', !flag);
		},
		// 取り込み開始ボタンの活性/非活性切替
		enableImportStart: function(flag){
			domAttr.set(query('.tsext-c-import', this.domNode)[0], 'disabled', !flag);
		},
		// AtkCommon__c を取得
		fetchCommon: function(){
			Wait.show(true);
			CommonAgent.fetchCommon().then(
				lang.hitch(this, this.fetchEmpMonthDefs),
				lang.hitch(this, this.showError)
			);
		},
		// AtkEmpMonth__c の項目定義を取得
		fetchEmpMonthDefs: function(){
			CommonAgent.fetchEmpMonthDefs().then(
				lang.hitch(this, this.fetchHolidays),
				lang.hitch(this, this.showError)
			);
		},
		// AtkHoliday__c を取得
		fetchHolidays: function(){
			HolidayAgent.fetchHolidays().then(
				lang.hitch(this, this.fetchEmpTypes),
				lang.hitch(this, this.showError)
			);
		},
		// AtkEmpType__c を取得
		fetchEmpTypes: function(){
			EmpTypeAgent.fetchEmpTypes().then(
				lang.hitch(this, this.fetchEmps),
				lang.hitch(this, this.showError)
			);
		},
		// AtkEmp__c を取得
		fetchEmps: function(){
			this.emps.fetchEmps().then(
				lang.hitch(this, function(){
					Wait.show(false);
				}),
				lang.hitch(this, this.showError)
			);
		},
		// ファイル選択時
		loadData: function(){
			// ファイル内容、結果エリア、ボタンの状態を初期状態に戻す
			var area = query('div.tsext-show-data', this.domNode)[0];
			domStyle.set(area, 'display', 'none');
			var msgArea = query('div.tsext-data-message > div', this.domNode)[0];
			domStyle.set(msgArea, 'display', 'none');
			this.clearCheckResult();
			this.enableCheckStart(false);
			this.enableImportStart(false);

			var files = dom.byId('absorberUpload').files;
			if(!files.length){
				return;
			}
			this.fileName = files[0].name;
			var x = this.fileName.lastIndexOf('.');
			if(x < 0 || this.fileName.substring(x + 1).toLowerCase() != 'csv'){
				this.csvRows = null;
				this.showFileNameAndRowCount();
				this.showError(Constant.MSG_NOT_CSV);
				return;
			}
			this.showError('');
			// ファイル読み込み
			var reader = new FileReader();
			reader.readAsText(files[0]);
			reader.onload = lang.hitch(this, function(){
				Papa.parse(reader.result, { // CSVをパース
					newline: '\n',
					delimiter: ',',
					complete: lang.hitch(this, this.showData)
				});
			});
		},
		// ファイルの解析、内容表示
		showData: function(results){
			console.log(results.data);
			this.csvRows = new CsvRows(results.data);
			this.csvRows.setEmp(this.emps); // 各行に対して勤怠社員をセット
			this.buildTable();
			this.enableCheckStart(true);
		},
		// ファイル名と件数表示
		showFileNameAndRowCount: function(){
			// メッセージ部
			var msgArea = query('div.tsext-data-message', this.domNode)[0];
			domConstruct.empty(msgArea);
			domConstruct.create('div', { innerHTML:str.substitute(Constant.MSG_FILE_NAME, [this.fileName]) }, msgArea);// ファイル名:${0}
			if(this.csvRows){
				domConstruct.create('div', { innerHTML:str.substitute(Constant.MSG_ROW_COUNT, [this.csvRows.getCount()]) }, msgArea);// ${0} 件のデータがあります
			}
			domStyle.set(msgArea, 'display', '');
			dom.byId('absorberUpload').value = '';
		},
		// ファイルの内容を先頭3行分のみ表示
		buildTable: function(){
			var area = query('div.tsext-show-data', this.domNode)[0];
			domStyle.set(area, 'display', '');
			// ヘッダ部
			var thead = query('thead', area)[0];
			domConstruct.empty(thead);
			var tr = domConstruct.create('tr', null, thead);
			domConstruct.create('div', { innerHTML:Constant.EMP_CODE     }, domConstruct.create('th', null, tr));
			domConstruct.create('div', { innerHTML:Constant.EMP_NAME     }, domConstruct.create('th', null, tr));
			domConstruct.create('div', { innerHTML:Constant.YEAR_MONTH   }, domConstruct.create('th', null, tr));
			domConstruct.create('div', { innerHTML:Constant.HOLIDAY_NAME }, domConstruct.create('th', null, tr));
			domConstruct.create('div', { innerHTML:Constant.SPEND_DAYS   }, domConstruct.create('th', null, tr));
			domConstruct.create('div', { innerHTML:Constant.SPEND_TIME   }, domConstruct.create('th', null, tr));
			// ボディ部
			var tbody = query('tbody', area)[0];
			domConstruct.empty(tbody);
			var rowSize = Math.min(Math.max(this.csvRows.getCount(), 3), 3);
			for(var i = 0 ; i < rowSize ; i++){
				var cr = (i < this.csvRows.getCount() ? this.csvRows.getCsvRow(i) : null);
				var tr = domConstruct.create('tr', { className:'tsext-row-' + ((i%2)==0 ? 'even' : 'odd') }, tbody);
				domConstruct.create('div', { innerHTML:(cr ? cr.getEmpCode() : '&nbsp;') }, domConstruct.create('td', { style:'' }, tr));
				domConstruct.create('div', { innerHTML:(cr ? cr.getEmpName()       : '') }, domConstruct.create('td', { style:'' }, tr));
				domConstruct.create('div', { innerHTML:(cr ? cr.getDispYearMonth() : '') }, domConstruct.create('td', { style:'text-align:center;' }, tr));
				domConstruct.create('div', { innerHTML:(cr ? cr.getHolidayName()   : '') }, domConstruct.create('td', { style:'text-align:left;'  }, tr));
				domConstruct.create('div', { innerHTML:(cr ? cr.getSpendDays()     : '') }, domConstruct.create('td', { style:'text-align:center;' }, tr));
				domConstruct.create('div', { innerHTML:(cr ? cr.getSpendTime()     : '') }, domConstruct.create('td', { style:'text-align:center;' }, tr));
			}
			this.showFileNameAndRowCount();
		},
		// 事前チェック
		checkStart: function(){
			this.lastPreCheck = moment();
			this.preProcess(false);
		},
		// 取り込み開始
		importStart: function(){
			this.enableImportStart(false);
			this.enableCheckStart(false);
			this.preProcess(true);
		},
		// 関連データ取得
		// flag:false なら事前チェック、true なら取り込み開始
		preProcess: function(flag){
			LogAgent.reset();
			LogAgent.addLog(flag ? Constant.MSG_PROC_IMPORT : Constant.MSG_PROC_CHECK);
			LogAgent.addLog(this.fileName);
			LogAgent.addLog(str.substitute(Constant.MSG_ROW_COUNT, [this.csvRows.getCount()]));
			CommonAgent.outputLogFieldMap();
			this.csvRows.outputLogError();
			var param = {
				update: flag,
				empIds: this.csvRows.getEmpIds(),
				yearMonth: this.csvRows.getFirstYearMonth(),
				subNo: this.csvRows.getFirstSubNo()
			};
			if(!param.empIds.length || !param.yearMonth){ // すべてエラー
				this.showCheckResult(param);
				return;
			}
			Wait.show(true);
			if(!flag
			|| moment().subtract(5, 'm').isAfter(this.lastPreCheck) // 前回の事前チェックから5分以上経過した
			){
				this.emps.reset();
				this.fetchEmpMonths(param);
			}else{
				this.processStart(param);
			}
		},
		// 処理開始
		processStart: function(param){
			this.processUnits = new ProcessUnits(this.csvRows);
			this.processUnits.processStart(
				param,
				lang.hitch(this, function(){
					Wait.show(false);
					this.buildTable();
					this.showCheckResult(param);
//					this.debugData();
				})
			);
		},
		// AtkEmpMonth__c を取得
		fetchEmpMonths: function(param){
			this.emps.fetchEmpMonths(param).then(
				lang.hitch(this, this.fetchEmpYuqs),
				lang.hitch(this, this.showError)
			);
		},
		// AtkEmpYuq__c を取得
		fetchEmpYuqs: function(param){
			this.emps.fetchEmpYuqs(param).then(
				lang.hitch(this, this.fetchEmpYuqDetails),
				lang.hitch(this, this.showError)
			);
		},
		// AtkEmpYuqDetail__c を取得
		fetchEmpYuqDetails: function(param){
			this.emps.fetchEmpYuqDetails(param).then(
				lang.hitch(this, function(param){
					this.emps.buildYuqs();
					this.fetchEmpStocks(param);
				}),
				lang.hitch(this, this.showError)
			);
		},
		// AtkEmpStock__c を取得
		fetchEmpStocks: function(param){
			this.emps.fetchEmpStocks(param).then(
				lang.hitch(this, this.fetchEmpStockDetails),
				lang.hitch(this, this.showError)
			);
		},
		// AtkEmpStockDetail__c を取得
		fetchEmpStockDetails: function(param){
			this.emps.fetchEmpStockDetails(param).then(
				lang.hitch(this, function(param){
					this.emps.buildStocks();
					this.processStart(param);
				}),
				lang.hitch(this, this.showError)
			);
		},
		// 結果出力エリアをクリア
		clearCheckResult: function(){
			dom.byId('absorberPrechkResult').innerHTML = '';
			dom.byId('absorberPrechkCsv').innerHTML = '';
			dom.byId('absorberPrechkLog').innerHTML = '';
			dom.byId('absorberImportResult').innerHTML = '';
			dom.byId('absorberImportCsv').innerHTML = '';
			dom.byId('absorberImportLog').innerHTML = '';
		},
		// 結果出力
		showCheckResult: function(param){
			LogAgent.addLog(Constant.MSG_PROC_DIV);
			var allCnt = this.csvRows.getCount();
			var errorCnt = this.csvRows.getAllErrorRowCount();
			if(errorCnt > 0){ // エラーあり
				LogAgent.addLog(str.substitute(Constant.MSG_ERROR_COUNT, [errorCnt, allCnt]));
				var area = dom.byId(param.update ? 'absorberImportResult' : 'absorberPrechkResult');
				domConstruct.empty(area);
				domConstruct.create('div', {
					innerHTML: str.substitute(Constant.MSG_ERROR_COUNT, [errorCnt, allCnt]), // ${1} 件中 ${0} 件のエラーがあります
					style:'display:inline-block;'
				}, area);
				// エラー詳細ファイル作成
				area = dom.byId(param.update ? 'absorberImportCsv' : 'absorberPrechkCsv');
				domConstruct.empty(area);
				this.download(
					area,
					{
						fname: Constant.ERROR_FILE_NAME, // エラー詳細.csv
						heads: this.getOutputHead(),
						value: this.csvRows.getOutput()
					}
				);
			}else{
				LogAgent.addLog(Constant.MSG_NO_ERROR);
				var area = dom.byId(param.update ? 'absorberImportResult' : 'absorberPrechkResult');
				domConstruct.empty(area);
				domConstruct.create('div', {
					innerHTML: Constant.MSG_NO_ERROR, // エラーはありません
					style:'display:inline-block;'
				}, area);
			}
			// 取り込み可能な行があれば、取り込み開始ボタンを活性にする
			this.enableCheckStart(false);
			this.enableImportStart(!param.update && (allCnt - errorCnt) > 0);
			if(param.update){
				this.enableCheckStart(false);
			}
			LogAgent.addLog(Constant.MSG_PROC_END);
			var area = dom.byId(param.update ? 'absorberImportLog' : 'absorberPrechkLog');
			domConstruct.empty(area);
			this.setLogLink(area);
		},
		// ログ出力
		setLogLink: function(area){
			// ログファイル作成
			this.download(
				domConstruct.create('div', null, area),
				{
					fname: moment().format('YYYYMMDDHHmmss') + '-log.txt',
					heads: '',
					value: LogAgent.getLogText()
				}
			);
		},
		// ダウンロードファイルのリンクをセット
		download: function(area, param){
			if((dojo.isChrome || dojo.isFF) && typeof(Blob) !== "undefined"){
				var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
				var blob = new Blob([bom, (param.heads ? (param.heads + '\r\n') : '') + param.value], { "type" : "text/csv" });
				var url = (window.URL || window.webkitURL).createObjectURL(blob);

				domConstruct.create('a', {
					href: url,
					download: param.fname,
					innerHTML: param.fname,
					target: '_blank'
				}, domConstruct.create('div', null, area));
			}
		},
		// エラー詳細ファイルのヘッダ部
		getOutputHead: function(){
			return ('"' + [
				Constant.EMP_CODE,
				Constant.EMP_NAME,
				Constant.YEAR_MONTH,
				Constant.HOLIDAY_NAME,
				Constant.SPEND_DAYS,
				Constant.SPEND_TIME,
				Constant.ERROR_NOTE
			].join('","') + '"');
		},
		// デバッグ用
		debugData: function(){
			var checkArea = query('div.tsext-check-area', this.domNode)[0];
			var area = domConstruct.create('div', null, checkArea);
			this.debug.outputCsv(lang.hitch(this, this.download), area, this.emps);
			this.showLink(true);
		},
		showLink: function(flag){
			var area = query('div.tsext-form-download', this.domNode)[0];
			domStyle.set(area, 'display', (flag ? '' : 'none'));
		}
	});
});
