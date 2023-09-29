define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/Tooltip",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/query",
	"dojo/on",
	"dojo/string",
	"dojo/text!tsext/settings/settingImportView.html",
	"tsext/service/Request",
	"tsext/dialog/Confirm",
	"tsext/widget/CheckTable",
	"tsext/csvobj/CsvData",
	"tsext/csvobj/Csobjs",
	"tsext/settings/SettingImportLogic",
	"tsext/logic/AtkCommonLogic",
	"tsext/service/Agent",
	"tsext/util/Util"
], function(declare, lang, json, array, _WidgetBase, _TemplatedMixin, Tooltip, dom, domConstruct, domAttr, domStyle, query, on, str, template, Request, Confirm, CheckTable, CsvData, Csobjs, SettingImportLogic, AtkCommonLogic, Agent, Util) {
	return declare("tsext.settings.SettingImportView", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(){
			this.csvDataMap = {};
			this.prefixNameMap = {};
		},
		placeAt: function(){
			this.inherited(arguments);
			this.startup();
		},
		// 初期化
		startup: function(){
			this.inherited(arguments);
			// ボタン等を初期値で非活性にする
			domAttr.set('tsextImport', 'disabled', true);
			// イベントハンドラ
			this.own(
				on(dom.byId('tsextUpload'), 'change', lang.hitch(this, this.loadFileList)),
				on(dom.byId('tsextImport'), 'click' , lang.hitch(this, this.importStart))
			);
		},
		// 破棄
		destroy : function(){
			if(this.hintPrexfix){
				this.hintPrexfix.destroyRecursive();
				this.hintPrexfix = null;
			}
			if(this.hintBackup){
				this.hintBackup.destroyRecursive();
				this.hintBackup = null;
			}
			this.inherited(arguments);
		},
		// エラーメッセージ
		showError: function(errmsg){
			var els = query('div.tsext-error', this.domNode);
			if(els.length){
				var el = els[0];
				domConstruct.empty(el);
				domConstruct.create('div', { innerHTML: (errmsg ? 'ERROR: ' : '') + errmsg }, el);
				domStyle.set(el, 'display', (errmsg ? '' : 'none'));
			}
		},
		// ファイル選択時処理
		loadFileList: function(e){
			this.showError();
			this.showComment('');
			this.csvDataMap = {};
			var files = dom.byId('tsextUpload').files;
			if(!files.length){
				return;
			}
			// 画面リセット
			domAttr.set('tsextImport', 'disabled', true);
			// ファイル読み込み
			var reader = new FileReader();
			reader.readAsBinaryString(files[0]);
			reader.onload = lang.hitch(this, function(){
				var newZip = new JSZip();
				newZip.loadAsync(reader.result).then(lang.hitch(this, function(zip){
					zip.filter(lang.hitch(this, function(fname, file){
						var fm = /^(.+)\.csv$/i.exec(fname);
						var key = (fm ? fm[1] : null);
						if(key){ // *.csv 1件毎に CsvData インスタンス作成
							this.csvDataMap[key] = new CsvData(key, fname);
						}else if(/comment\.txt/i.test(fname)){ // comment.txt があれば、内容をコメント表示欄に出力
							zip.file(fname).async("string").then(lang.hitch(this, this.showComment));
						}
					}));
					this.parseStart(zip);
				}));
			});
		},
		// 解析
		parseStart: function(zip){
			this.showError();
			if(!Object.keys(this.csvDataMap).length){
				this.showError('CSVファイルがありません');
				return;
			}
			Object.keys(this.csvDataMap).forEach(function(key){
				var csvData = this.csvDataMap[key];
				// CSVはBOM付きのため、いったんバイナリで読み込んでBOMを取り除いてからテキストへ変換
				zip.file(csvData.getFname()).async("uint8array").then(lang.hitch(this, function(uint8array){
					// newline と delimiter を指定しないと読み取りに失敗する
					Papa.parse(Util.uint8arrayToUtf8String(uint8array), { // CSVをパース
						newline: '\n',
						delimiter: ',',
						complete: lang.hitch(this, function(results){
							csvData.set(results.data); // CsvObjインスタンスへ解析結果をセット
							if(this.checkDone()){
								this.importStandBy();
							}
						})
					});
				}));
			}, this);
		},
		// コメントを出力
		showComment: function(comment){
			query('textarea.tsext-comment', this.domNode)[0].value = comment || '';
		},
		// 対象のCSVをすべて読み込み済みならtrueを返す
		checkDone: function(){
			for(var key in this.csvDataMap){
				if(!this.csvDataMap.hasOwnProperty(key)){
					continue;
				}
				var csvData = this.csvDataMap[key];
				if(csvData.isEmpty()){
					return false;
				}
			}
			console.log('done!!');
			return true;
		},
		// Csobjs インスタンスを生成、社員リストを対象テーブルへ出力
		importStandBy: function(){
			var objectList = this.csvDataMap['object_list'];
			if(!objectList){
				this.showError('object_list.csv がありません');
				return;
			}
			var objectFields = this.csvDataMap['object_fields'];
			if(!objectFields){
				this.showError('object_fields.csv がありません');
				return;
			}
			this.csobjs = new Csobjs(objectList);
			var csobj = this.csobjs.getSobjByName('AtkCommon__c');
			tsCONST.prefixOnCsv = Util.getPrefix(csobj.getName());
			this.csobjs.setFields(objectFields);
			this.csobjs.setRecords(this.csvDataMap);
			this.csobjs.buildReferenceSet();
			// ImportLogic
			this.settingImportLogic = new SettingImportLogic(this.csobjs);
			//
			domAttr.set('tsextImport', 'disabled', false);
			console.log('importStandBy ok');
		},
		// インポート開始
		importStart: function(e){
			this.showError();
			this.blockUI(true);
			this.outLog('インポート開始', true);
			this.settingImportLogic.importLoop({
				outLog   : lang.hitch(this, this.outLog),
				finished : lang.hitch(this, this.finished)
			});
		},
		// UIブロックのオンオフ
		blockUI: function(flag, finish){
			domAttr.set('tsextImport', 'disabled', flag);
		},
		// ログ出力
		outLog: function(msg, flag, noStamp){
			var textArea = query('.tsext-form-log textarea', this.domNode)[0];
			if(flag){
				textArea.value = '';
			}
			textArea.value += ((flag ? '' : '\n')
					+ (noStamp ? '' : moment().format('YYYY/MM/DD HH:mm:ss') + ' ')
					+ (msg || ''));
			textArea.scrollTop = textArea.scrollHeight;
		},
		// 終了処理
		finished: function(result, errmsg){
			if(!result){
				this.showError(errmsg);
			}else{
				this.outLog('インポート終了');
			}
			this.blockUI(false, true);
		}
	});
});
