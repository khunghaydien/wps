define([
	"dojo/_base/declare",
	"dojo/_base/json",
	"dojo/_base/array",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/Tooltip",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/query",
	"dojo/on",
	"dojo/string",
	"dojo/_base/lang",
	"dojo/text!tsext/template/exportView.html",
	"tsext/service/Request",
	"tsext/dialog/EmpSearch",
	"tsext/dialog/Processing",
	"tsext/dialog/Calendar",
	"tsext/widget/CheckTable",
	"tsext/logic/ExportLogic",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, Tooltip, dom, domConstruct, domAttr, domStyle, domClass, query, on, str, lang, template, Request, EmpSearch, Processing, Calendar, CheckTable, ExportLogic, Util) {
	return declare("tsext.view.ExportView", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(){
			this.empSearch = null;
		},
		placeAt: function(){
			this.inherited(arguments);
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
			this.checkSelectors = [
				'div.tsext-option-time input[type="checkbox"]',
				'div.tsext-option-exp input[type="checkbox"]'
			]
			array.forEach(this.checkSelectors, function(checkSelector){
				query(checkSelector, this.domNode)[0].checked = true;
			}, this);
			dom.byId('tsextOptionJointWork').checked = true;  // 工数データを含める
			dom.byId('tsextOptionMaskEmp').checked = true;    // 社員名・ユーザ名をマスク
			dom.byId('tsextOptionMaskNote').checked = true;   // 備考・コメントをマスク
			dom.byId('tsextOptionJobMinimum').checked = true; // ジョブマスタは関連のみ
			dom.byId('tsextOptionStepHistory').checked = true; // 承認履歴をエクスポートする
			this.setInitRange('div.tsext-option-time');
			this.setInitRange('div.tsext-option-exp');
			domAttr.set('tsextExport'   , 'disabled', true); // エクスポートボタン
			domAttr.set('tsextEmpRemove', 'disabled', true); // 削除ボタン
			// 社員選択テーブル
			var heads = [
				{ name:'社員コード', apiKey:'EmpCode__c'       , width:180, align:'left' },
				{ name:'社員名'    , apiKey:'Name'             , width:200, align:'left' }
			];
			this.empTable = new CheckTable({ heads: heads, values: [] }, lang.hitch(this, this.checkedEmp));
			this.empTable.placeAt(query('div.tsext-emp-table', this.domNode)[0]);
			this.empTable.buildTable();
			// ツールヒント
			this.hintStepHistory = new Tooltip({
				connectId: [tsextStepHistoryHelp],
				position: ['below'],
				label: '下記オブジェクトの承認履歴を ProcessInstanceStep.csv に出力します。<br/>'
					+ '・勤怠申請（AtkEmpApply__c）<br/>'
					+ '・経費申請（AtkExpApply__c）<br/>'
					+ '・経費事前申請（AtkExpPreApply__c）<br/>'
					+ '・経費取消申請（AtkExpCancelApply__c）<br/>'
					+ '・工数実績申請（AtkJobApply__c）<br/>'
					+ '・定期券区間履歴（AtkCommuterPass__c）<br/>'
			});
			// イベントハンドラ
			this.own(
				// 追加
				on(dom.byId('tsextEmpInsert'), 'click', lang.hitch(this, function(e){
					this.showError(null);
					this.empSearch = new EmpSearch({});
					this.empSearch.show().then(
						lang.hitch(this, function(emps){
							this.empTable.addValues(emps);
							this.enableExport();
						}),
						lang.hitch(this, function(errmsg){
							this.empSearch.hide();
							this.showError(errmsg);
						})
					);
				})),
				// 削除
				on(dom.byId('tsextEmpRemove'), 'click', lang.hitch(this, function(e){
					this.showError(null);
					this.empTable.removeCheckedRow();
					this.enableExport();
				})),
				// オプション－日付入力欄クリック時
				on(query('div.tsext-options input[type="text"]', this.domNode), /*'mouseover'*/'click', lang.hitch(this, function(e){
					e.preventDefault();
					e.stopPropagation();
					Calendar.popup(e.target, dom.byId('tsExtArea'));
				})),
				// オプション－日付入力欄フォーカスが離れた時
				on(query('div.tsext-options input[type="text"]', this.domNode), 'blur', lang.hitch(this, function(e){
					e.preventDefault();
					e.stopPropagation();
					this.blurDate();
				})),
				// オプション－日付入力欄のクリア
				on(query('div.tsext-options a', this.domNode), 'click', lang.hitch(this, this.clearDate)),
				// オプション－データ種類選択
				on(query(this.checkSelectors.join(','), this.domNode), 'click', lang.hitch(this, this.enableExport)),
				// エクスポート
				on(dom.byId('tsextExport'), 'click', lang.hitch(this, this.execExport))
			);
		},
		// 社員選択時処理（削除ボタンの活性／非活性切替）
		checkedEmp: function(){
			domAttr.set('tsextEmpRemove', 'disabled', !this.empTable.getObjIds(true).length);
		},
		// エクスポートボタンの活性／非活性切替
		enableExport: function(){
			var o = this.getOption();
			domAttr.set('tsextExport', 'disabled', !(o.emps.length && (o.exportTime || o.exportExp)));
		},
		// UIブロックのオンオフ
		blockUI: function(flag, finish){
			Processing.show(flag);
			if(!flag){
				var textArea = query('.tsext-form-log textarea', this.domNode)[0];
				textArea.value = Processing.getLog();
				textArea.scrollTop = textArea.scrollHeight;
			}
		},
		// ログ出力
		outLog: function(msg, flag){
			Processing.outLog(msg, flag);
		},
		// ログ内容取得
		getLog: function(){
			return Processing.getLog();
		},
		// 終了処理
		finished: function(result, errmsg){
			this.blockUI(false, true);
			if(!result){
				this.showError(errmsg);
			}
		},
		// 社員検索
		searchEmpMonth: function(emp){
			var soql = str.substitute("select Id, YearMonth__c from AtkEmpMonth__c where EmpId__c = '${0}' order by YearMonth__c", [emp.Id]);
			var req = {
				soql: soql,
				limit: 50000,
				offset: 0
			};
			Request.actionA(tsCONST.API_SEARCH_DATA, req).then(
				lang.hitch(this, function(result){
					var select = query('select.tsext-emp-month', this.domNode)[0];
					domConstruct.empty(select);
					domConstruct.create('option', { textContent: '(すべて)', value: '0' }, select);
					array.forEach(result.records || [], function(record){
						domConstruct.create('option', { textContent: Util.formatMonth(record.YearMonth__c), value: record.YearMonth__c }, select);
					});
				}),
				lang.hitch(this, this.showError)
			);
		},
		// オプション－データの範囲値取得
		getRange: function(selector){
			var rangeObj = { checked: false, type: 0, from: null, to: null };
			var rangeAreas = query(selector, this.domNode);
			var rangeArea = (rangeAreas && rangeAreas.length ? rangeAreas[0] : null);
			if(rangeArea){
				var chkboxes = query('div.tsext-option-range1 input[type="checkbox"]', rangeArea);
				rangeObj.checked = (chkboxes && chkboxes.length && chkboxes[0].checked);
				var inps = query('div.tsext-option-range2 input[type="text"]', rangeArea);
				if(inps && inps.length >= 2){
					var v1 = inps[0].value;
					var v2 = inps[1].value;
					var d1 = (v1 ? moment(v1, 'YYYY/MM/DD') : null);
					var d2 = (v2 ? moment(v2, 'YYYY/MM/DD') : null);
					rangeObj.from = (d1 && d1.isValid() ? d1.format('YYYY-MM-DD') : null);
					rangeObj.to   = (d2 && d2.isValid() ? d2.format('YYYY-MM-DD') : null);
					inps[0].value = (d1 && d1.isValid() ? d1.format('YYYY/MM/DD') : '');
					inps[1].value = (d2 && d2.isValid() ? d2.format('YYYY/MM/DD') : '');
				}
				rangeObj.type = (rangeObj.from || rangeObj.to) ? 1 : 0;
			}
			return rangeObj;
		},
		// オプション－データの範囲値の初期値をセット
		setInitRange: function(selector){
			var rangeAreas = query(selector, this.domNode);
			var rangeArea = (rangeAreas && rangeAreas.length ? rangeAreas[0] : null);
			if(rangeArea){
				var inps = query('div.tsext-option-range2 input[type="text"]', rangeArea);
				if(inps && inps.length >= 2){
					var md = moment();
					inps[0].value = moment([md.year(), md.month(), 1]).add(-1, 'M').format('YYYY/MM/DD'); // 前月1日
					inps[1].value = moment([md.year(), md.month(), 1]).add(1, 'M').add(-1, 'd').format('YYYY/MM/DD'); // 当月末
				}
			}
		},
		// オプション－オプション値取得
		getOption: function(){
			return {
				emps:       this.empTable.getObjs(),
				exportTime: this.getRange('div.tsext-option-time'),
				exportExp:  this.getRange('div.tsext-option-exp'),
				jointWork:  dom.byId('tsextOptionJointWork').checked,
				maskEmp:    dom.byId('tsextOptionMaskEmp').checked,
				maskNote:   dom.byId('tsextOptionMaskNote').checked,
				jobMinimum: dom.byId('tsextOptionJobMinimum').checked,
				stepHistory:dom.byId('tsextOptionStepHistory').checked,
				comment:    query('textarea.tsext-comment', this.domNode)[0].value
			};
		},
		// 日付入力欄からフォーカスが離れた時の処理
		blurDate: function(e){
			this.getOption();
		},
		// 日付入力欄をクリア
		clearDate: function(e){
			var div = Util.getAncestorByTagName(e.target, 'DIV');
			if(div){
				dojo.query('input[type="text"]', div.parentNode).forEach(function(el){
					el.value = '';
				});
			}
		},
		// エクスポート実行
		execExport: function(){
			var option = this.getOption();
			if(!option.emps.length){
				this.showError('社員を選択してください');
				return;
			}
			if(!option.exportTime.checked && !option.exportExp.checked){
				this.showError('対象データを選択してください');
				return;
			}
			if((option.exportTime.type == 1 && option.exportTime.from && option.exportTime.to && option.exportTime.from > option.exportTime.to)
			|| (option.exportExp.type  == 1 && option.exportExp.from  && option.exportExp.to  && option.exportExp.from  > option.exportExp.to)){
				this.showError('期間の指定が正しくありません');
				return;
			}
			if(!option.exportTime.checked && option.jointWork){
				this.showError('工数データを含める場合は勤怠をチェックしてください');
				return;
			}
			this.blockUI(true);
			this.showError();
			this.outLog('エクスポート開始', true);
			var empIds = [];
			var empNames = [];
			this.outLog('対象社員');
			array.forEach(option.emps, function(emp){
				this.outLog('- ' + (emp.EmpCode__c ? emp.EmpCode__c + ' ' : '') + emp.Name);
				empIds.push(emp.Id);
				empNames.push(emp.Name);
			}, this);
			this.outLog('対象データ');
			if(option.exportTime.checked){
				this.outLog('- 勤怠 ' + (!option.exportTime.type ? 'すべて' : ((option.exportTime.from || '') + '～' + (option.exportTime.to || ''))));
			}
			if(option.exportExp.checked ){
				this.outLog('- 経費 ' + (!option.exportExp.type ? 'すべて' : ((option.exportExp.from || '') + '～' + (option.exportExp.to || ''))));
			}
			this.outLog('- 工数データを含める = '       + (option.jointWork ? 'オン' : 'オフ'));
			this.outLog('- 社員名・ユーザ名をマスク = ' + (option.maskEmp  ? 'オン' : 'オフ'));
			this.outLog('- 備考・コメントをマスク = '   + (option.maskNote ? 'オン' : 'オフ'));
			this.outLog('- ジョブマスタは関連のみ = '   + (option.jobMinimum ? 'オン' : 'オフ'));
			this.outLog('- 承認履歴をエクスポートする = '   + (option.stepHistory ? 'オン' : 'オフ'));
			this.outLog('- 名前空間 = '   + (tsCONST.prefixBar || 'なし'));
			var exportLogic = new ExportLogic();
			exportLogic.exportLoop({
				targetEmpIds    : empIds,
				targetEmpNames  : empNames,
				option          : option,
				downloadElement : query('div.tsext-form-download a', this.domNode)[0],
				outLog          : lang.hitch(this, this.outLog),
				getLog          : lang.hitch(this, this.getLog),
				finished        : lang.hitch(this, this.finished)
			});
		}
	});
});
