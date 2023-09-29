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
	"dojo/_base/lang",
	"dojo/text!tsext/settings/settingExportView.html",
	"tsext/service/Request",
	"tsext/settings/SettingExportLogic",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domStyle, domClass, query, on, str, lang, template, Request, SettingExportLogic, Util) {
	return declare("tsext.settings.SettingExportView", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(){
		},
		placeAt: function(){
			this.inherited(arguments);
			this.settingExportLogic = new SettingExportLogic();
			this.startup();
		},
		// エラー表示
		showError: function(errmsg){
			var els = query('div.tsext-error', this.domNode);
			if(els.length){
				var el = els[0];
				domConstruct.empty(el);
				domConstruct.create('div', { innerHTML: (errmsg ? 'ERROR: ' : '') + errmsg }, el);
				domStyle.set(el, 'display', (errmsg ? '' : 'none'));
			}
		},
		// 初期化
		startup: function(){
			this.inherited(arguments);
			// イベントハンドラ
			this.own(
				// エクスポート
				on(dom.byId('tsextExport'), 'click', lang.hitch(this, this.execExport))
			);
		},
		// UIブロックのオンオフ
		blockUI: function(flag){
			domAttr.set('tsextExport', 'disabled', flag);
		},
		// オプション－オプション値取得
		getOption: function(){
			return {
				comment: query('textarea.tsext-comment', this.domNode)[0].value
			};
		},
		// ログ出力
		outLog: function(msg, flag){
			var textArea = query('.tsext-form-log textarea', this.domNode)[0];
			if(flag){
				textArea.value = '';
			}
			textArea.value += ((flag ? '' : '\n') + moment().format('YYYY/MM/DD HH:mm:ss') + ' ' +  (msg || ''));
			textArea.scrollTop = textArea.scrollHeight;
		},
		// ログ内容取得
		getLog: function(){
			return query('.tsext-form-log textarea', this.domNode)[0].value;
		},
		// 終了処理
		finished: function(result, errmsg){
			this.blockUI(false);
			if(!result){
				this.showError(errmsg);
			}
		},
		// エクスポート実行
		execExport: function(){
			this.blockUI(true);
			this.loadSettings();
		},
		loadSettings: function(){
			this.outLog('設定データ取得中..', true);
			this.settingExportLogic.loadSettingLoop({
				finished       : lang.hitch(this, this.finished),
				outLog         : lang.hitch(this, this.outLog),
				getLog         : lang.hitch(this, this.getLog),
				option         : this.getOption(),
				downloadElement: query('div.tsext-form-download a', this.domNode)[0]
			});
		}
	});
});
