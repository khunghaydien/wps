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
	"dojo/Deferred",
	"dojo/_base/lang",
	"dojo/text!tsext/testAssist/export/TestAssistExportView.html",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/dialog/Calendar",
	"tsext/testAssist/export/ExportManager",
	"tsext/util/DomUtil",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domStyle, query, on, str, Deferred, lang, template, Request, Wait, Calendar, ExportManager, DomUtil, Util) {
	return declare("tsext.testAssist.TestAssistExportView", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(mode, empId, dataObj){
			this.empId = empId;
			this.dataObj = dataObj;
			this.exportManager = new ExportManager({
				empId: this.empId,
				sd: this.dataObj.month.startDate,
				ed: this.dataObj.month.endDate
			});
			this.ymList = [];
		},
		placeAt: function(){
			this.inherited(arguments);
			this.startup();
		},
		destroy : function(){
			this.inherited(arguments);
		},
		// エラー表示
		showError: function(errmsg){
			Wait.show(false);
			var els = query('div.tsext-error', this.domNode);
			if(els.length){
				var el = els[0];
				domConstruct.empty(el);
				domConstruct.create('div', { innerHTML: (errmsg ? 'ERROR: ' : '') + errmsg }, el);
				domStyle.set(el, 'display', (errmsg ? '' : 'none'));
			}
		},
		startup: function(){
			this.inherited(arguments);
			this.own(
				on(dom.byId('testAssistExportOutput'), 'click', lang.hitch(this, this.fetchStep2Start)),
				on(dom.byId('testAssistExportDL')    , 'click', lang.hitch(this, this.onDataDownload)),
				on(dom.byId('testAssistExportPrefix'), 'input', lang.hitch(this, this.onPrefixInput)),
				on(dom.byId('testAssistExportPlugin'), 'click', lang.hitch(this, this.onPluginDownload)),
				on(dom.byId('testAssistExportHelp')  , 'click', lang.hitch(this, this.onHelpOpen)),
				on(query('input[name="export-range"]', this.domNode), 'click', lang.hitch(this, this.onRangeType))
			);
			// パラメータの初期値をセット
			var emp = this.dataObj.targetEmp || {}; // 対象社員
			if(!emp){
				this.showError('異常終了');
				return;
			}
			dom.byId('testAssistExportEmpName').innerHTML = (emp.code ? emp.code + '  ' : '') + emp.name; // 社員コード 社員名
			dom.byId('testAssistExportHideName').checked = true; // 実名を使用しない
			dom.byId('testAssistExportRange').checked = true; // 期間
			dom.byId('testAssistExportPrefixOrgId').checked = true; // 組織ID
			dom.byId('testAssistExportDLText').checked = true; // ダウンロードの拡張子
			this.enableDLDiv();
			this.enablePluginDiv();
			this.fetchStep1Start();
		},
		// 期間のラジオボタン選択
		onRangeType: function(){
			var isRangeAll = dom.byId('testAssistExportRangeAll').checked; // 全期間
			domAttr.set('testAssistExportRangeFrom', 'disabled', isRangeAll);
			domAttr.set('testAssistExportRangeTo'  , 'disabled', isRangeAll);
		},
		// プレフィックス入力
		onPrefixInput: function(){
			dom.byId('testAssistExportPrefixFree').checked = true;
		},
		// CSVのダウンロード
		onDataDownload: function(){
			var value = dom.byId('testAssistExportTextArea').value.trim();
			if(!value){
				return;
			}
			var extCsv = dom.byId('testAssistExportDLCsv').checked;
			var organization = this.exportManager.getOrganization();
			var fname = (organization ? organization.getId() + '-' : '') + 'TestData.' + (extCsv ? 'csv' : 'txt');
			DomUtil.setDownloadLink(dom.byId('testAssistExportLink'), true, fname, value, true);
		},
		// プラグインのダウンロード
		onPluginDownload: function(){
			var common = this.exportManager.getExportCommon();
			if(!common || !common.isExistPlugin()){
				return;
			}
			var organization = this.exportManager.getOrganization();
			var fname = (organization ? organization.getId() + '-' : '') + 'Plugin.zip';
			var zip = new JSZip();
			var oj = Util.toJson(this.exportManager.getInfo(), true);
			var js = common.getPlugJavaScript();
			var ss = common.getSummarySettings();
			var mt = common.getMessageTable();
			var po = this.exportManager.getPrivateOptionsJson();
			if(oj){ zip.file('Info.txt'           , Util.unicodeStringToTypedArray(oj, true), {binary:true}); }
			if(js){ zip.file('PlugJavaScript.txt' , Util.unicodeStringToTypedArray(js, true), {binary:true}); }
			if(ss){ zip.file('SummarySettings.txt', Util.unicodeStringToTypedArray(ss, true), {binary:true}); }
			if(mt){ zip.file('MessageTable.txt'   , Util.unicodeStringToTypedArray(mt, true), {binary:true}); }
			if(po){ zip.file('PrivateOptions.txt' , Util.unicodeStringToTypedArray(po, true), {binary:true}); }
			zip.generateAsync({ type: 'blob', compression: "DEFLATE" }).then(lang.hitch(this, function(content){
				// IEか他ブラウザかの判定
				if(window.navigator.msSaveBlob){
					// IEなら独自関数を使います。
					window.navigator.msSaveBlob(content, fname);
				} else {
					// それ以外はaタグを利用してイベントを発火させます
					var a = dom.byId('testAssistExportHideLink');
					a.href = URL.createObjectURL(content);
					a.download = fname;
					a.target = '_blank';
					a.click();
					setTimeout(function(){
						URL.revokeObjectURL(a.href);
					}, 3000);
				}
			}));
		},
		onHelpOpen: function(){
			var c = dom.byId('testAssistExportHelpContent');
			var o = (domStyle.get(c, 'display') == 'none' ? false : true);
			domStyle.set(c, 'display', (o ? 'none' : ''));
			var b = dom.byId('testAssistExportHelp');
			b.innerHTML = b.innerHTML.replace(/[－＋]/, (o ? '＋' : '－'));
		},
		// パラメータ採取
		setParameter: function(){
			var isRangeAll = dom.byId('testAssistExportRangeAll').checked; // 全期間
			var rs, re;
			if(isRangeAll){
				var range = this.exportManager.getFullRange();
				rs = (range ? range.from : this.ymList[0]);
				re = (range ? range.to   : this.ymList[this.ymList.length - 1]);
			}else{
				rs = this.getSelectYm(dom.byId('testAssistExportRangeFrom'));
				re = this.getSelectYm(dom.byId('testAssistExportRangeTo'));
			}
			return this.exportManager.setParameter({
				empId         : this.empId,
				sd            : rs.sd, // 開始日(yyyy-MM-dd)
				ed            : re.ed, // 終了日(yyyy-MM-dd)
				ysd           : rs.ym, // 開始月
				yed           : re.ym, // 終了月
				isRangeAll    : isRangeAll,
				isPrefixOrgId : dom.byId('testAssistExportPrefixOrgId').checked,
				prefixValue   : dom.byId('testAssistExportPrefix').value.trim(),
				isHideName    : dom.byId('testAssistExportHideName').checked
			});
		},
		// データ読み込み Step1 開始（初期表示時に実行）
		fetchStep1Start: function(){
			Wait.show(true);
			this.exportManager.fetchStart(1, {
				errmsg: null,
				callback: lang.hitch(this, this.fetchStep1End)
			});
		},
		// データ読み込み Step1 終了
		fetchStep1End: function(expObj){
			if(expObj.errmsg){
				this.showError(expObj.errmsg);
				return;
			}
			// Step1で得た情報で期間の選択肢を作成
			this.ymList = this.exportManager.getEmpMonthYmList({
				sd: this.exportManager.getTargetStartDate(),
				ed: this.exportManager.getTargetEndDate()
			});
			this.setSelectYmList(dom.byId('testAssistExportRangeFrom'));
			this.setSelectYmList(dom.byId('testAssistExportRangeTo'));
			this.enablePluginDiv();
			Wait.show(false);
			return expObj;
		},
		// データ読み込み Step2 開始（CSV作成ボタン押下で実行）
		fetchStep2Start: function(){
			var ngmsg = this.setParameter();
			if(ngmsg){
				this.showError(ngmsg);
				return;
			}
			Wait.show(true);
			this.exportManager.fetchStart(2, {
				errmsg: null,
				callback: lang.hitch(this, this.fetchStep2End)
			});
		},
		// データ読み込み Step2 終了
		fetchStep2End: function(expObj){
			if(expObj.errmsg){
				this.showError(expObj.errmsg);
				return;
			}
			// CSV作成
			var lst = this.exportManager.outputExportList([]);
			dom.byId('testAssistExportTextArea').value = lst.join('\n');
			this.enableDLDiv();
			Wait.show(false);
			return expObj;
		},
		/**
		 * select に期間の選択肢をセット
		 * @param {DOM} select 
		 */
		setSelectYmList: function(select){
			var defaultYm = null;
			for(var i = 0 ; i < this.ymList.length ; i++){
				var o = this.ymList[i];
				domConstruct.create('option', { value:o.ym, innerHTML:o.ym }, select);
				if(!defaultYm && o.target){
					defaultYm = o;
				}
			}
			if(defaultYm){
				select.value = defaultYm.ym;
			}
		},
		/**
		 * select の選択を取得
		 * @param {DOM} select 
		 * @returns {string|null}
		 */
		getSelectYm: function(select){
			var v = select.value;
			for(var i = 0 ; i < this.ymList.length ; i++){
				var o = this.ymList[i];
				if(v == o.ym){
					return o;
				}
			}
			return null;
		},
		enableDLDiv: function(){
			var flag = dom.byId('testAssistExportTextArea').value ? true : false;
			query('#testAssistExportDLDiv *').forEach(function(el){
				domStyle.set(el, 'color', (flag ? '#000' : '#ccc'));
				domAttr.set(el, 'disabled', !flag);
			}, this);
		},
		enablePluginDiv: function(){
			var common = this.exportManager.getExportCommon();
			var flag = (common && common.isExistPlugin()) || this.exportManager.isExistPrivateOptions();
			query('#testAssistExportPluginDiv *').forEach(function(el){
				domStyle.set(el, 'color', (flag ? '#000' : '#ccc'));
				domAttr.set(el, 'disabled', !flag);
			}, this);
		}
	});
});
