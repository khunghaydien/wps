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
	"dojo/dom-class",
	"dojo/query",
	"dojo/on",
	"dojo/string",
	"dojo/Deferred",
	"dojo/_base/lang",
	"dojo/text!tsext/testAssist/TestAssistView.html",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/dialog/Calendar",
	"tsext/testAssist/TestAssistWidget",
	"tsext/testAssist/Constant",
	"tsext/util/DomUtil",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domStyle, domClass, query, on, str, Deferred, lang, template, Request, Wait, Calendar, TestAssistWidget, Constant, DomUtil, Util) {
	return declare("tsext.testAssist.TestAssistView", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(){
			this.widget = new TestAssistWidget();
			this.eventHandles = [];
		},
		placeAt: function(){
			this.inherited(arguments);
			this.startup();
		},
		startup: function(){
			this.inherited(arguments);
			this.own(
				on(dom.byId('testAssistInput')     , 'click', lang.hitch(this, this.showDialogAction)), // テストデータ入力
				on(dom.byId('testAssistStart')     , 'click', lang.hitch(this, this.startEntry)), // 開始
				on(dom.byId('testAssistPause')     , 'click', lang.hitch(this, this.pauseEntry)), // 一時停止
				on(dom.byId('testAssistShowLog')   , 'click', lang.hitch(this, this.showLog)), // ログ
				on(dom.byId('testAssistOption')    , 'click', lang.hitch(this, this.showOption)), // 補助
				on(window, 'resize', lang.hitch(this, this.resizeArea))
			);
			dom.byId('testAssistAutoScroll').checked = true;
			this.resetControl(0);
			this.widget.setMainView(this);
		},
		destroy : function(){
			this.inherited(arguments);
		},
		resizeArea: function(){
			var box = dojo.window.getBox();
		},
		// エラー表示
		showError: function(errmsg){
			var area = query('div.tsext-test-message', this.domNode)[0];
			domStyle.set(area, 'color', 'red');
			area.innerHTML = errmsg || '&nbsp;';
		},
		// メッセージ表示
		showMessage: function(msg){
			var area = query('div.tsext-test-message', this.domNode)[0];
			domStyle.set(area, 'color', '#17222d');
			area.innerHTML = msg || '&nbsp;';
		},
		showDialogAction: function(){
			this.widget.showDialogAction(this);
		},
		showLog: function(){
			this.widget.showDialogLog(this);
		},
		showOption: function(){
			this.widget.showDialogOption(this);
		},
		isAutoScroll: function(){
			return dom.byId('testAssistAutoScroll').checked;
		},
		// 状態ボタンクリック
		toggleMode: function(e){
			var btn = e.target;
			var n = domAttr.get(btn, 'data');
			var ope = this.widget.toggleMode(n);
			btn.value = ope.mode;
			domClass.toggle(btn, 'ope_pause', (ope.mode == Constant.OPE_PAUSE));
			domClass.toggle(btn, 'ope_skip' , (ope.mode == Constant.OPE_SKIP));
		},
		// 一時停止
		pauseEntry: function(){
			this.widget.pauseEntry();
		},
		/**
		 * 開始
		 */
		startEntry: function(){
			this.showMessage();
			this.widget.startEntry();
		},
		clearShowArea: function(obj){
			var areas = query('div.tsext-test-data', this.domNode);
			if(areas.length){
				domConstrcut.empty(areas[0]);
			}
		},
		resetControl: function(flag){
			domAttr.set('testAssistInput'  , 'disabled', !(flag & Constant.BIT_C_INPUT));
			domAttr.set('testAssistStart'  , 'disabled', !(flag & Constant.BIT_C_START));
			domAttr.set('testAssistPause'  , 'disabled', !(flag & Constant.BIT_C_PAUSE));
			domAttr.set('testAssistShowLog', 'disabled', !(flag & Constant.BIT_C_LOG));
			domAttr.set('testAssistOption' , 'disabled', !(flag & Constant.BIT_C_OPTION));
		},
		setProgress: function(distributor){
			dom.byId('testAssistCount').innerHTML = distributor.getDoneCount() + '/' + distributor.getEntryCount();
			dom.byId('testAssistNgCount').innerHTML = distributor.getNgCount();
			domClass.toggle('testAssistNgCount', 'meter-ng', (distributor.getNgCount() > 0));
		},
		clearEventHandles: function(){
			for(var i = 0 ; i < this.eventHandles.length ; i++){
				var eventHandle = this.eventHandles[i];
				eventHandle.remove();
			}
			this.eventHandles = [];
		},
		buildLogTable: function(distributor, flag){
			this.showMessage();
			var area = query('div.tsext-test-logs', this.domNode)[0];
			var tbody = dom.byId('testAssistListBody');
			this.clearEventHandles();
			domConstruct.empty(tbody);
			var entrys = distributor.getEntrys();
			var bagged = distributor.getPauseBagged();
			var size = Math.max(entrys.length, 10);
			for(var i = 0 ; i < size ; i++){
				var entry = (i < entrys.length ? entrys[i] : null);
				var tr = domConstruct.create('tr', null, tbody);
				// カーソル列
				var td1 = domConstruct.create('td', { className:'test-cursor'  }, tr);
				var td2 = domConstruct.create('td', { className:'test-no'      }, tr);
				var td3 = domConstruct.create('td', { className:'test-operate' }, tr);
				var td4 = domConstruct.create('td', { className:'test-message' }, tr);
				var td5 = domConstruct.create('td', { className:'test-result'  }, tr);
				if(entry){
					domConstruct.create('div', null, td2); // 連番
					domConstruct.create('div', { innerHTML:(i+1) }, td2); // 連番
					var btn = domConstruct.create('input', { type: 'button', value: entry.getMode() }, td3); // 状態
					domAttr.set(btn, 'data', i);
					this.eventHandles.push(on(btn, 'click', lang.hitch(this, this.toggleMode)));
					domConstruct.create('div', { innerHTML:entry.getEntryName() }, td4); // 説明
					this.showEntryResult(tr, entry);
					domClass.toggle(tr, 'test-comment', entry.isInformation());
					domClass.toggle(tr, 'test-delete' , entry.isDelete());
					domClass.toggle(tr, 'test-inspect', entry.isTest());
					this.showCursor(tr, (bagged && i == bagged.getIndex()), entry);
					domAttr.set(tr, 'title', entry.getTitle());
				}else{
					td1.innerHTML = '&nbsp;';
				}
			}
			domStyle.set(area, 'display', '');
			if(flag === undefined){
				this.resetControl(Constant.BIT_C_INPUT|Constant.BIT_C_OPTION| (distributor.isReady() ? Constant.BIT_C_START : 0));
			}else{
				this.resetControl(flag);
			}
			this.setProgress(distributor);
		},
		// カーソルクリア
		clearCursor: function(distributor){
			this.setProgress(distributor);
			var tbody = dom.byId('testAssistListBody');
			query('td.test-cursor', tbody).forEach(function(el){
				el.innerHTML = '&nbsp;';
			});
			query('tr', tbody).forEach(function(el){
				domClass.toggle(el, 'test-cursor', false);
			});
		},
		// カーソル（処理中の行を示すマーク）をセット
		setCursor: function(index, distributor){
			this.setProgress(distributor);
			var tbody = dom.byId('testAssistListBody');
			var curH = 0;
			for(var i = 0 ; i < tbody.rows.length ; i++){
				var tr = tbody.rows[i];
				if(i < index){
					curH += tr.offsetHeight;
				}else if(i > index){
					break;
				}
				if(index > 0 && i == (index - 1)){
					this.showCursor(tr, false, this.widget.getEntryByIndex(index - 1));
				}else if(i == index){
					this.showCursor(tr, true , this.widget.getEntryByIndex(index));
				}
			}
			if(this.isAutoScroll()){
				tbody.scrollTop = Math.max(curH - 200, 0);
			}
		},
		showCursor: function(tr, flag, entry){
			var td = query('td.test-cursor', tr)[0];
			domClass.toggle(tr, 'test-cursor', (entry && flag));
			if(entry && flag){
				td.innerHTML = '>';
			}else{
				td.innerHTML = '&nbsp;';
			}
			if(entry){
				var btn = query('td.test-operate input', tr)[0];
				btn.value = entry.getMode();
				domClass.toggle(btn, 'ope_doing', entry.isDoing());
				domClass.toggle(btn, 'ope_pause', entry.isPause());
				if(!flag && ((entry.isDone() && !entry.isError()) || entry.isSkip())){
					domAttr.set(btn, 'disabled', true);
				}
			}
		},
		// 結果を表示
		setEntryResult: function(index){
			var entry = this.widget.getEntryByIndex(index);
			if(!entry){
				return;
			}
			var tbody = dom.byId('testAssistListBody');
			var tr = tbody.rows[index];
			this.showEntryResult(tr, entry);
			var flag = ((entry.isDone() && !entry.isError()) || entry.isSkip()); // 失敗なく処理したかスキップした
			this.showCursor(tr, !flag, entry);
		},
		showEntryResult: function(tr, entry){
			var td0 = query('td.test-message', tr)[0]; //
			var td1 = query('td.test-result' , tr)[0]; // 結果
			domConstruct.empty(td1);
			domClass.toggle(tr , 'test-error', entry.isError()); // エラー
			if(entry.isTest(true)){
				domClass.toggle(td1, 'test-test-ng', entry.isTestNg()); // 検査NG
				domClass.toggle(td1, 'test-test-ok', entry.isTestOk()); // 検査OK
			}
			domConstruct.create('div', { innerHTML: entry.getResultMessage() }, td1); // 結果
			query('.test-link-div', td0).forEach(function(el){
				domConstruct.destroy(el);
			});
			var link = entry.getLink();
			if(link){ // リンク
				var linkt = '';
				if(entry.isLinkSheet()){		linkt = ' link-sheet';
				}else if(entry.isLinkEmp()){	linkt = ' link-emp';
				}else if(entry.isLinkSf()){		linkt = ' link-sf';
				}
				domConstruct.create('a', {
					innerHTML: '...',
					href: link.href,
					title: entry.getLinkTitle(),
					target: '_blank'
				}, domConstruct.create('div', {
					className: 'test-link-div' + linkt
				}, td0));
			}
		},
		setClearnUpData: function(injectLines){
			var area = dom.byId('testAssistDeleteLink');
			domConstruct.empty(area);
			if(!injectLines || !injectLines.length){
				return;
			}
			var datas = [];
			datas.push(Util.arrayToCsvString(Constant.HEADERS));
			for(var i = 0 ; i < injectLines.length ; i++){
				datas.push(injectLines[i]);
			}
			var csvData = datas.join('\n');
			var fname = '後始末用データ.txt';
			var a = domConstruct.create('a', {
				innerHTML:'後始末用データ',
				title:'テストデータ生成後のデータ削除用のCSVデータです。\nダウンロードしておくと、削除する際に利用できます。'
			}, area);
			DomUtil.setDownloadLink(a, true, fname, csvData);
		}
	});
});
