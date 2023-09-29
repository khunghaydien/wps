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
	"dojo/text!tsext/template/importView.html",
	"tsext/service/Request",
	"tsext/dialog/EmpSearch",
	"tsext/dialog/Processing",
	"tsext/dialog/Wait",
	"tsext/dialog/Confirm",
	"tsext/widget/CheckTable",
	"tsext/csvobj/CsvData",
	"tsext/csvobj/Csobjs",
	"tsext/logic/ImportLogic",
	"tsext/logic/AtkCommonLogic",
	"tsext/service/Agent",
	"tsext/util/Util"
], function(declare, lang, json, array, _WidgetBase, _TemplatedMixin, Tooltip, dom, domConstruct, domAttr, domStyle, query, on, str, template, Request, EmpSearch, Processing, Wait, Confirm, CheckTable, CsvData, Csobjs, ImportLogic, AtkCommonLogic, Agent, Util) {
	return declare("tsext.view.ImportView", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(){
			this.empSearch = null;
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
			domAttr.set('tsextParse' , 'disabled', true);
			domAttr.set('tsextImport', 'disabled', true);
			domAttr.set('tsextPrefix', 'disabled', true);
			// 選択テーブル
			this.heads = [
				{ name:'社員コード', apiKey:'EmpCode__c'       , width:180, align:'left' },
				{ name:'社員名'    , apiKey:'Name'             , width:200, align:'left' }
			];
			this.empTable = new CheckTable({ heads: this.heads, values: [] }, lang.hitch(this, this.checkedEmp));
			this.empTable.placeAt(query('div.tsext-form-emps', this.domNode)[0]);
			this.empTable.buildTable();
			// ツールヒント
			this.hintPrexfix = new Tooltip({
				connectId: [tsextImportPrefix],
				position: ['below'],
				label: 'マスター系オブジェクトのレコード名、社員名の先頭にセットする文字列です。<br/>'
					+ '一意性の確保、データ削除時に利用します。<br/>'
					+ '特別な理由がなければデフォルトのままにしてください。'
			});
			this.hintBackup = new Tooltip({
				connectId: [tsextImportBackup],
				position: ['below'],
				label: 'インポートでは勤怠共通設定(AtkCommon__c)を上書きしますが、<br/>'
					+ 'インポートする前にバックアップをダウンロードしておくことで、<br/>'
					+ 'リストアを行うことができます（ファイル選択→[解析]）。'
			});
			// イベントハンドラ
			this.own(
				on(dom.byId('tsextUpload'), 'change', lang.hitch(this, this.loadFileList)),
				on(dom.byId('tsextParse' ), 'click' , lang.hitch(this, this.parseStart)),
				on(dom.byId('tsextImport'), 'click' , lang.hitch(this, this.importStart)),
				on(dom.byId('tsextBackup'), 'click' , lang.hitch(this, this.backupAtkCommon))
			);
		},
		// 破棄
		destroy : function(){
			if(this.empTable){
				this.empTable.destroyRecursive();
				this.empTable = null;
			}
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
			Wait.show(false);
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
			domAttr.set('tsextParse' , 'disabled', false);
			domAttr.set('tsextImport', 'disabled', true);
			domAttr.set('tsextPrefix', 'disabled', true);
			this.empTable.clearValues();
			if(!/\.zip$/.test(files[0].name)){
				this.restoreAtkCommonStep1(files[0]);
				return;
			}
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
				}));
			});
		},
		// 解析
		parseStart: function(e){
			this.showError();
			var files = dom.byId('tsextUpload').files;
			if(!files.length){
				this.showError('ファイルを選択してください');
				return;
			}
			if(!/\.zip$/.test(files[0].name)){
				this.restoreAtkCommonStep2(files[0]);
				return;
			}
			if(!Object.keys(this.csvDataMap).length){
				this.showError('CSVファイルがありません');
				return;
			}
			domAttr.set('tsextPrefix', 'disabled', false);
			query('div.tsext-check-table-area', this.domNode).forEach(function(el){
				domAttr.set(el, 'disabled', false);
			}, this);
			// ファイル読み込み
			Wait.show(true);
			var reader = new FileReader();
			reader.readAsBinaryString(files[0]);
			reader.onload = lang.hitch(this, function  () {
				var newZip = new JSZip();
				newZip.loadAsync(reader.result).then(lang.hitch(this, this.extractLoop));
			});
		},
		// ファイル読み込みループ
		extractLoop: function(zip){
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
			this.importLogic = new ImportLogic(this.csobjs);
			var emps = this.csobjs.getSobjByName('AtkEmp__c');
			if(!emps){
				this.showError('AtkEmp__c.csv がありません');
				return;
			}
			// 選択テーブルのボディ部に表示するデータをセット
			var values = [];
			array.forEach(emps.getCsvRows(), function(csvRow){
				var value = {};
				value.Id = csvRow.getId();
				for(var i = 0 ; i < this.heads.length ; i++){
					var key = this.heads[i].apiKey;
					value[key] = csvRow.getValueByName(key);
				}
				values.push(value);
			}, this);
			this.empTable.addValues(values);
			//
			domAttr.set('tsextParse' , 'disabled', true);
			domAttr.set('tsextImport', 'disabled', true);
			domAttr.set('tsextPrefix', 'disabled', false);
			// 既存のプレフィックスを取得
			this.importLogic.loadPrefixNames(0,
				this.prefixNameMap,
				lang.hitch(this, this.outLog),
				lang.hitch(this, function(succeed, errmsg){
					if(succeed){
						// 1～の連番で既存にないプレフィックスを得る
						for(var i = 1 ; i < 1000 ; i++){
							var pn = "_" + str.pad(i, 3, "0", false) + "_";
							if(!this.prefixNameMap[pn]){
								dom.byId('tsextPrefix').value = pn;
								break;
							}
						}
						Wait.show(false);
					}else{
						this.showError(errmsg);
					}
				})
			);
			console.log('importStandBy ok');
		},
		// 選択テーブル内でチェックされた時の処理
		checkedEmp: function(){
			var empIds = this.empTable.getObjIds(true);
			domAttr.set('tsextImport', 'disabled', !empIds.length);
		},
		// インポート開始
		importStart: function(e){
			if(!this.empTable){
				return;
			}
			this.showError();
			var emps = this.empTable.getObjs(true);
			if(!emps || !emps.length){
				this.showError('インポート対象の社員を選択してください');
				return;
			}
			var prefix = dom.byId('tsextPrefix').value;
			this.blockUI(true);
			this.outLog('インポート開始', true);
			this.outLog('対象社員');
			var empIds = [];
			array.forEach(emps, function(emp){
				this.outLog('- ' + (emp.EmpCode__c ? emp.EmpCode__c + ' ' : '') + emp.Name);
				empIds.push(emp.Id);
			}, this);
			this.outLog('プレフィックス = ' + (prefix || '(なし)'));
			this.importLogic.importLoop({
				empIds          : empIds,
				prefix          : prefix || '',
				updateCommon    : dom.byId('tsextUpdateCommon').checked,
				allExpItem      : dom.byId('tsextAllExpItem').checked,
				allPayee        : dom.byId('tsextAllPayee').checked,
				allDept         : dom.byId('tsextAllDept').checked,
				rawCalendar     : dom.byId('tsextRawCalendar').checked,
				rawStatus       : dom.byId('tsextRawStatus').checked,
				outLog          : lang.hitch(this, this.outLog),
				finished        : lang.hitch(this, this.finished)
			});
		},
		// AtkCommon__cバックアップ
		backupAtkCommon: function(e){
			this.blockUI(true);
			this.outLog('AtkCommon__c バックアップ', true);
			var commonLogic = new AtkCommonLogic();
			commonLogic.loadAtkCommon(
				lang.hitch(this, this.outLog),
				lang.hitch(this, function(flag, result){
					if(!flag){
						this.showError(result);
						this.blockUI(false, true);
						return;
					}
					var obj = result;
					obj._comment_ = moment().format('YYYY/MM/DD HH:mm') + '時点のAtkCommon__c';
					this.doDownload(
						json.toJson(obj, true),
						false,
						"plain/text",
						'AtkCommon__c_' + moment().format('YYYYMMDDHHmmss') + '.json'
					);
					this.blockUI(false, true);
				})
			);
		},
		// ファイルダウンロード
		doDownload: function(content, bomFlag, contentType, fname){
			var contents = [];
			if(bomFlag){
				contents.push(new Uint8Array([0xEF, 0xBB, 0xBF]));
			}
			contents.push(content);
			var blob = new Blob(contents, {"type": contentType});
			this.outLog(fname + ' をダウンロード');
			// IEか他ブラウザかの判定
			if(window.navigator.msSaveBlob){
				// IEなら独自関数を使います。
				window.navigator.msSaveBlob(blob, fname);
			} else {
				// それ以外はaタグを利用してイベントを発火させます
				var a = query('div.tsext-form-download a', this.domNode)[0];
				a.href = URL.createObjectURL(blob);
				a.download = fname;
				a.target = '_blank';
				a.click();
				setTimeout(function(){
					URL.revokeObjectURL(a.href);
				}, 3000);
			}
		},
		// AtkCommon__cリストア1
		restoreAtkCommonStep1: function(file){
		},
		// AtkCommon__cリストア2
		restoreAtkCommonStep2: function(file){
			var reader = new FileReader();
			reader.onload = lang.hitch(this, function(){
				var newObj = Util.fromJson(reader.result);
				if(!newObj){
					this.showError('無効なファイルです');
					return;
				}
				(new Confirm({
					title: '確認',
					message: (newObj._comment_ || 'AtkCommon__c') + ' をリストアします。よろしいですか？'
				})).show().then(
					lang.hitch(this, function(){
						this.restoreAtkCommonStep3(newObj);
					}),
					lang.hitch(this, function(){
					})
				);
			});
			reader.readAsText(file);
		},
		// AtkCommon__cリストア3
		restoreAtkCommonStep3: function(newObj){
			this.blockUI(true);
			this.outLog((newObj._comment_ || 'AtkCommon__c') + ' リストア', true);
			var commonLogic = new AtkCommonLogic();
			commonLogic.loadAtkCommon(
				lang.hitch(this, this.outLog),
				lang.hitch(this, function(flag, result){
					if(!flag){
						this.showError(result);
						this.blockUI(false, true);
						return;
					}
					commonLogic.updateAtkCommon(newObj, result, this.outLog, lang.hitch(this, function(flag, result){
						if(!flag){
							this.showError(result);
							this.blockUI(false, true);
							return;
						}
						var traces = result;
						this.doDownload(
							traces.join('\n'),
							true,
							"text/csv",
							'restore_log_' + moment().format('YYYYMMDDHHmmss') + '.csv'
						);
						this.blockUI(false, true);
					}));
				})
			);
		},
		// UIブロックのオンオフ
		blockUI: function(flag, finish){
			Processing.show(flag);
			if(!flag){
				var textArea = query('.tsext-form-log textarea', this.domNode)[0];
				textArea.value = Processing.getLog();
				textArea.scrollTop = textArea.scrollHeight;
				if(finish){
					domAttr.set('tsextImport', 'disabled', true);
					domAttr.set('tsextPrefix', 'disabled', true);
					query('div.tsext-check-table-area input[type="checkbox"]', this.domNode).forEach(function(el){
						domAttr.set(el, 'disabled', true);
					}, this);
				}
			}
		},
		showLink: function(){
			var linkMap = this.importLogic.getLinkMap();
			var node = query('div.tsext-form-result', this.domNode)[0];
			for(var empId in linkMap){
				var link = linkMap[empId];
				var times = link.times.sort(function(a, b){
					if(a.month == b.month){
						return (a.subNo || 0) - (b.subNo || 0);
					}
					return a.month - b.month;
				});
				var jobs = link.jobs.sort(function(a, b){
					if(a.month == b.month){
						return (a.subNo || 0) - (b.subNo || 0);
					}
					return a.month - b.month;
				});
				var exps = link.exps.sort(function(a, b){
					return (a.id < b.id ? -1 : 1);
				});
				var pres = link.pres.sort(function(a, b){
					return (a.id < b.id ? -1 : 1);
				});
				if(times.length){
					var div = domConstruct.create('div', null, node);
					domConstruct.create('a', {
						href: tsCONST.workTimeView + '?empId=' + empId,
						innerHTML: link.name + ' 勤務表',
						target: '_blank'
					}, domConstruct.create('div', null, div));
					for(var i = 0 ; i < times.length ; i++){
						var o = times[i];
						domConstruct.create('a', {
							href: tsCONST.workTimeView + '?empId=' + empId + '&month=' + o.month + '&subNo=' + (o.subNo || ''),
							innerHTML: '' + o.month,
							target: '_blank'
						}, domConstruct.create('div', null, div));
					}
				}
				if(jobs.length){
					var div = domConstruct.create('div', null, node);
					domConstruct.create('a', {
						href: tsCONST.empJobView + '?empId=' + empId,
						innerHTML: link.name + ' 工数実績',
						target: '_blank'
					}, domConstruct.create('div', null, div));
					for(var i = 0 ; i < jobs.length ; i++){
						var o = jobs[i];
						domConstruct.create('a', {
							href: tsCONST.empJobView + '?empId=' + empId + '&month=' + o.month + '&subNo=' + (o.subNo || ''),
							innerHTML: '' + o.month,
							target: '_blank'
						}, domConstruct.create('div', null, div));
					}
				}
				if(exps.length && link.empExp){
					var div = domConstruct.create('div', null, node);
					domConstruct.create('a', {
						href: tsCONST.empExpView + '?empId=' + empId,
						innerHTML: link.name + ' 経費精算',
						target: '_blank'
					}, domConstruct.create('div', null, div));
					for(var i = 0 ; i < exps.length ; i++){
						var o = exps[i];
						domConstruct.create('a', {
							href: tsCONST.empExpView + '?empId=' + empId + '&expApplyId=' + o.id,
							innerHTML: '' + o.id,
							target: '_blank'
						}, domConstruct.create('div', null, div));
					}
				}
				if(pres.length){
					var div = domConstruct.create('div', null, node);
					domConstruct.create('a', {
						href: tsCONST.expPreApplyView + '?empId=' + empId,
						innerHTML: link.name + ' 事前申請',
						target: '_blank'
					}, domConstruct.create('div', null, div));
					for(var i = 0 ; i < pres.length ; i++){
						var o = pres[i];
						domConstruct.create('a', {
							href: tsCONST.expPreApplyView + '?empId=' + empId + '&Id=' + o.id,
							innerHTML: '' + o.id,
							target: '_blank'
						}, domConstruct.create('div', null, div));
					}
				}
			}
			array.forEach(this.importLogic.getEmpTypes(), function(empType){
				var div = domConstruct.create('div', null, node);
				domConstruct.create('a', {
					href: tsCONST.empTypeEditView + '?empTypeId=' + empType.Id,
					innerHTML: empType.Name + ' 勤務体系',
					target: '_blank'
				}, domConstruct.create('div', null, div));
			}, this);
		},
		// ログ出力
		outLog: function(msg, flag){
			Processing.outLog(msg, flag);
		},
		// 終了処理
		finished: function(result, errmsg){
			if(!result){
				this.showError(errmsg);
			}else{
				this.showLink();
				this.outLog('インポート終了');
			}
			this.blockUI(false, true);
		}
	});
});
