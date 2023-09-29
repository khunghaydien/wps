define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/string",
	"dojo/query",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dijit/Dialog",
	"dojox/layout/ResizeHandle",
	"dojo/text!tsext/testAssist/DialogInput.html",
	"dojo/text!tsext/testAssist/SAMPLE1.csv",
	"tsext/service/Request",
	"tsext/testAssist/DialogConfirm",
	"tsext/testAssist/DialogData",
	"tsext/testAssist/DialogSample",
	"tsext/testAssist/Bagged",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/DomUtil",
	"tsext/util/Util"
], function(declare, lang, json, array, str, query, on, Deferred, dom, domConstruct, domAttr, domClass, domStyle, Dialog, ResizeHandle, template, SAMPLE1, Request, DialogConfirm, DialogData, DialogSample, Bagged, Current, Constant, DomUtil, Util) {
	// テスト支援実行ダイアログ
	return declare("tsext.testAssist.DialogInput", null, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.Distributor} distributor
		 */
		constructor : function(distributor){
			this.distributor = distributor;
			this.dialog = null;
		},
		/**
		 * ダイアログオープン
		 */
		show : function() {
			this.deferred = new Deferred();
			if(!this.dialog){
				this.dialog = new Dialog({
					title: "Test Assist Tool",
					class: 'tsext-test-assist-dialog',
					content: template
				});
				domStyle.set('testAssistAction2', 'width' , '500px');
				domStyle.set('testAssistAction2', 'height', '200px');
				dom.byId('testAssistInject').checked = true;
				this.resizeHandle = new ResizeHandle({
					activeResize:true,
					intermediateChanges: true,
					minWidth:500,
					minHeight:200,
					style:'right:-6px;bottom:-8px',
					targetId: 'testAssistAction2'
				}, dom.byId('testAssistResize2'));
				this.dialog.own(
					on(this.dialog, 'cancel', lang.hitch(this, this.onClose)),
					on(query('.tsext-c-execute', this.dialog.domNode)[0], 'click', lang.hitch(this, this.onInput)),
					on(query('.tsext-c-cancel' , this.dialog.domNode)[0], 'click', lang.hitch(this, this.onClose)),
					on(dom.byId('testAssistDataOpen2'), 'click', lang.hitch(this, this.onOpenErrorDetail)),
					on(dom.byId('testAssistSelectSample'), 'click', lang.hitch(this, this.loadSample)),
					on(this.resizeHandle, 'resize', lang.hitch(this, this.onResize))
				);
				dom.byId('testAssistText2').value = '';
			}
			this.dialog.show();
			this.showMessage('');
			return this.deferred.promise;
		},
		/**
		 * ダイアログサイズ変更
		 */
		onResize : function(){
			var ch = dom.byId('testAssistAction2').clientHeight;
			var rowHeight = 0;
			query('tr.test-assist-row-fix', this.dialog.domNode).forEach(function(tr){
				rowHeight += tr.clientHeight;
			});
			var h = ch - rowHeight;
			domStyle.set('testAssistText2', 'width', '100%');
			domStyle.set('testAssistText2', 'height', h + 'px');
		},
		/**
		 * ダイアログを閉じる（DOMごと削除）
		 */
		hide : function(){
			this.dialog.hide();
		},
		/**
		 * 閉じる
		 */
		onClose : function(){
			this.deferred.reject();
			this.hide();
		},
		/**
		 * 入力
		 */
		onInput : function(){
			this.showMessage('');
			this.setBusy(true);
			var injectFlag = dom.byId('testAssistInject').checked;
			var csvData = dom.byId('testAssistText2').value.trim();
			this.distributor.input(csvData, injectFlag, lang.hitch(this, function(flag, errmsg){
				this.setBusy(false);
				if(flag){
					if(this.distributor.getInvalidCount() > 0){
						this.showMessage('構文エラーがあります。詳細は右リンクで確認してください');
					}else{
						this.deferred.resolve(true);
						this.hide();
					}
				}else{
					this.showMessage('エラー:' + errmsg);
				}
			}));
		},
		onOpenErrorDetail: function(){
			var data = Papa.unparse(this.distributor.getData(), { header: false, newline: "\r\n" });
			var dialog = new DialogData({title:'Syntax Error', suffix:'Data'});
			dialog.show(data);
		},
		loadSample: function(){
			var dialog = new DialogSample({title:'サンプル'});
			dialog.show().then(
				function(value){
					dom.byId('testAssistText2').value = value;
				},
				function(){
				}
			);
		},
		/**
		 * 処理中の活性/非活性切り替え
		 * @param {boolean} flag
		 */
		setBusy: function(flag){
			query('input,textarea', this.dialog.domNode).forEach(function(el){
				domAttr.set(el, 'disabled', flag);
			}, this);
		},
		/**
		 * 結果メッセージ
		 * @param {string|null} msg
		 */
		showMessage: function(msg){
			dom.byId('testAssistMessage2').innerHTML = msg || '';
			domStyle.set('testAssistErrorLink', 'display', (msg ? '' : 'none'));
			this.onResize();
		}
	});
});
