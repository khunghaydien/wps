define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/query",
	"dojo/on",
	"dojo/string",
	"dojo/_base/lang",
	"dojo/text!tsext/template/changeInitDateAttView.html",
	"tsext/service/Request",
	"tsext/dialog/Calendar",
	"tsext/dialog/Confirm",
	"tsext/widget/CheckTable",
	"tsext/logic/ChangeInitDateAttLogic",
	"tsext/obj/ChangeInitDateAttEmpTypes",
	"tsext/obj/ChangeInitDateAttEmps",
	"tsext/util/Util"
], function(declare, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domClass, domStyle, query, on, str, lang, template, Request, Calendar, Confirm, CheckTable, ChangeInitDateAttLogic, ChangeInitDateAttEmpTypes, ChangeInitDateAttEmps, Util) {
	return declare("tsext.view.ChangeInitDateAttView", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(){
		},
		placeAt: function(){
			this.inherited(arguments);
			this.startup();
		},
		startup: function(){
			this.inherited(arguments);
			domStyle.set(query('div.tsext-know', this.domNode)[0], 'display', 'none');
			// 勤務体系一覧
			var heads = [
				{ name:'勤務体系コード' , apiKey:'EmpTypeCode__c'   , width:140, align:'left'   },
				{ name:'勤務体系名'     , apiKey:'Name'             , width:260, align:'left'   },
				{ name:'起算<br/>月'    , apiKey:'startMonth'       , width: 50, align:'center' },
				{ name:'年度の<br/>表記', apiKey:'displayYear'      , width: 50, align:'center' },
				{ name:'起算<br/>日'    , apiKey:'startDate'        , width: 50, align:'center' },
				{ name:'月度の<br/>表記', apiKey:'displayMonth'     , width: 50, align:'center' },
				{ name:'週の<br/>起算日', apiKey:'startWeek'        , width: 50, align:'center' },
				{ name:'有効'           , apiKey:'valid'            , width: 50, align:'center' },
				{ name:'関連<br/>社員数', apiKey:'empCount'         , width: 60, align:'center' },
				{ name:'関連<br/>月度数', apiKey:'monthCount'       , width: 60, align:'center' },
				{ name:'リンク'         , apiKey:'link'             , width: 60, align:'center', link:true }
			];
			this.empTypeTable = new CheckTable({ heads: heads, values: [] }, lang.hitch(this, this.checkExecutable), { minRows:8 });
			this.empTypeTable.placeAt(query('div.tsext-emptype-table', this.domNode)[0]);
			this.empTypeTable.buildTable();
			query('div.tsext-changesd-radio input[type="radio"]:first-child', this.domNode)[0].checked = true;
			query('input[type="checkbox"].tsext-changesd-invalidate', this.domNode)[0].checked = true;
			// イベントハンドラ
			this.own(
				// 切替日入力欄クリック
				on(dom.byId('tsextChangeSdDate'), /*'mouseover'*/'click', lang.hitch(this, function(e){
					e.preventDefault();
					e.stopPropagation();
					Calendar.popup(e.target, dom.byId('tsExtArea'));
				})),
				// 切替日入力欄フォーカスが離れた
				on(dom.byId('tsextChangeSdDate'), 'blur', lang.hitch(this, function(e){
					e.preventDefault();
					e.stopPropagation();
					this.blurDate();
				})),
				// 切替日入力欄の値がカレンダーでセットされた
				on(dom.byId('tsextChangeSdDate'), 'calendar', lang.hitch(this, this.blurDate)),
				// 変更タイプがクリックされた
				on(query('div.tsext-changesd-radio input[type="radio"]', this.domNode), 'click', lang.hitch(this, this.checkExecutable)),
				on(query('div.tsext-changesd-settings select.tsext-changesd-dest-empTypes', this.domNode), 'change', lang.hitch(this, this.checkExecutable)),
				// 起算月が変更された
				on(query('div.tsext-changesd-settings select.tsext-changesd-month', this.domNode), 'change', lang.hitch(this, this.changedStartMonth)),
				// 起算日が変更された
				on(query('div.tsext-changesd-settings select.tsext-changesd-date', this.domNode), 'change', lang.hitch(this, this.changedStartDate)),
				// 変更内容を確認する
				on(dom.byId('tsextChangeInitDateAttConfirm'), 'click', lang.hitch(this, this.confirmChangeInitDateAtt)),
				// キャンセル
				on(dom.byId('tsextChangeInitDateAttCancel'), 'click', lang.hitch(this, this.cancelChangeInitDateAtt)),
				// 起算日変更実行
				on(dom.byId('tsextChangeInitDateAtt'), 'click', lang.hitch(this, this.startChangeInitDateAtt)),
				// 無効化分も含めて表示
				on(dom.byId('tsextInvalidEmpType'), 'click', lang.hitch(this, function(){ this.buildEmpTypeTable(true); })),
				// 終了またはエラーメッセージを閉じる
				on(query('div.tsext-finish-button', this.domNode), 'click', lang.hitch(this, this.closeFinishChangeInitDateAtt)),
				// ログをダウンロード
				on(query('div.tsext-changesd-log a', this.domNode), 'click', lang.hitch(this, this.downloadLog))
			);
			this.displayByStage(-1);
			this.searchEmpType();
		},
		destroy : function(){
			this.inherited(arguments);
		},
		showError: function(errmsg){
			query('div.tsext-error-top', this.domNode).forEach(function(el){
				domConstruct.empty(el);
				domConstruct.create('div', { innerHTML: (errmsg ? 'エラー: ' : '') + errmsg }, el);
				domStyle.set(el, 'display', (errmsg ? '' : 'none'));
			});
		},
		// リセット
		reset: function(){
			delete this.empTypes;
			delete this.emps;
			this.empTypes = null;
			this.emps = null;
			this.searchEmpType();
		},
		// 勤務体系検索
		searchEmpType: function(){
			var reqs = [];
			reqs.push({
				soql: "select Id,Name from Organization",
				limit: 50000,
				offset: 0
			});
			reqs.push({
				soql: "select Id,Name,EmpTypeCode__c,Removed__c,ConfigBaseId__r.InitialDateOfYear__c,ConfigBaseId__r.MarkOfYear__c,ConfigBaseId__r.InitialDateOfMonth__c,ConfigBaseId__r.MarkOfMonth__c,ConfigBaseId__r.InitialDayOfWeek__c from AtkEmpType__c",
				limit: 50000,
				offset: 0
			});
			reqs.push({
				soql: "select Id,Name,EmpCode__c,EmpTypeId__c,EmpTypeHistory__c,EntryDate__c,EndDate__c from AtkEmp__c",
				limit: 50000,
				offset: 0
			});
			reqs.push({
				soql: "select Id,Name,EmpId__c,EmpTypeId__c,YearMonth__c,SubNo__c,EmpApplyId__r.Status__c,StartDate__c,EndDate__c,InitialDate__c from AtkEmpMonth__c",
				limit: 50000,
				offset: 0
			});
			Request.actionB(tsCONST.API_SEARCH_DATA, reqs).then(
				lang.hitch(this, function(result){
					this.buildEmpTypeTable();
				}),
				lang.hitch(this, this.showError),
				lang.hitch(this, function(result){
					if(result.index == 0){
						this.organization = result.records[0];
					}else if(result.index == 1){
						this.empTypes = new ChangeInitDateAttEmpTypes(result.records);
					}else if(result.index == 2){
						this.emps = new ChangeInitDateAttEmps(result.records);
					}else if(result.index == 3){
						this.emps.setEmpMonths(result.records);
						this.empTypes.setEmps(this.emps);
					}
				})
			);
		},
		// 勤務体系ごとのカレンダーを取得
		fetchCalendar: function(callback){
			var cp = this.getParameter();
			var empTypeIds = [];
			array.forEach(cp.empTypes, function(empType){
				if(!empType.isCalendarLoaded()){
					empTypeIds.push(empType.getId());
				}
			}, this);
			if(empTypeIds.length){
				var req = {
					soql: "select Id, Date__c, Event__c, EmpTypeId__c from AtkCalendar__c where EmpTypeId__c in ('" + empTypeIds.join("','") + "') order by EmpTypeId__c, Date__c",
					limit: 5000,
					offset: 0
				};
				Request.actionA(tsCONST.API_SEARCH_DATA, req).then(
					lang.hitch(this, function(result){
						this.empTypes.setCalendars(result.records);
						callback(1);
					}),
					lang.hitch(this, function(errmsg){
						callback(-1, errmsg);
					})
				);
			}else{
				callback(1);
			}
		},
		// 勤務体系テーブルを表示
		buildEmpTypeTable: function(flag){
			var ets = [];
			var inv = dom.byId('tsextInvalidEmpType').checked;
			array.forEach(this.empTypes.getList(), function(et){
				if(inv || !et.isRemoved()){
					ets.push({
						Id            : et.getId(),
						Name          : et.getName(),
						EmpTypeCode__c: et.getEmpTypeCode() || '',
						startMonth    : et.getStartMonth(),
						displayYear   : et.getDisplayYear(3),
						startDate     : et.getStartDate(),
						displayMonth  : et.getDisplayMonth(3),
						startWeek     : et.getStartWeek(2),
						valid         : et.isValid(2),
						empCount      : et.getEmpCount(),
						monthCount    : et.getEmpMonthCount(),
						nocheck       : !et.getEmpCount()
					});
				}
			});
			this.empTypeTable.setValues(ets, flag);
			this.setEmpTypePulldown();
			this.displayByStage(0);
			this.checkExecutable();
		},
		// 勤務体系のプルダウンをセット
		setEmpTypePulldown: function(){
			var select = query('div.tsext-changesd-settings select.tsext-changesd-dest-empTypes', this.domNode)[0];
			domConstruct.empty(select);
			domConstruct.create('option', { textContent: '', value: '' }, select);
			var ets = this.empTypes.getList().sort(function(a, b){
				if(a.getName() == b.getName()){
					return (a.getEmpTypeCode() < b.getEmpTypeCode() ? -1 : 1);
				}
				return (a.getName() < b.getName() ? -1 : 1);
			});
			array.forEach(ets, function(et){
				if(!et.isRemoved()){
					domConstruct.create('option', { textContent:et.getName(), value:et.getId() }, select);
				}
			});
		},
		// 切替日を取得
		getChangeDate: function(){
			var v = dom.byId('tsextChangeSdDate').value;
			if(v){
				var d = moment(v, 'YYYY/MM/DD');
				dom.byId('tsextChangeSdDate').value = (d.isValid() ? d.format('YYYY/MM/DD') : '');
				return d.format('YYYY-MM-DD');
			}
			return null;
		},
		// 切替日入力欄からフォーカスが離れた時の処理
		blurDate: function(e){
			this.changeAutoStartDate();
			this.checkExecutable();
		},
		// 起算日を切替日の日付に強制的に変える
		changeAutoStartDate: function(e){
			var d = this.getChangeDate();
			if(d){
				var n = parseInt(d.substring(8, 10), 10);
				if(n >= 1 && n <= 28){
					query('div.tsext-changesd-settings select.tsext-changesd-date' , this.domNode)[0].value = '' + n;
					this.changedStartDate();
				}
			}
		},
		// 変更先（0:コピー生成、1:既存の勤務体系）
		getChangeParam: function(e){
			var cp = { type: 0 };
			query('div.tsext-changesd-radio input[type="radio"]:checked', this.domNode).forEach(function(el){
				cp.type = (domClass.contains(el, 'tsext-changesd-type2') ? 1 : 0);
			});
			if(!cp.type){
				cp.empTypeId = null;
				cp.startMonth   = query('div.tsext-changesd-settings select.tsext-changesd-month', this.domNode)[0].value;
				cp.startDate    = query('div.tsext-changesd-settings select.tsext-changesd-date' , this.domNode)[0].value;
				cp.startWeek    = query('div.tsext-changesd-settings select.tsext-changesd-week' , this.domNode)[0].value;
				cp.displayYear  = query('div.tsext-changesd-settings input[name="displayYear"]'  , this.domNode)[0].checked ? '1' : '2';
				cp.displayMonth = query('div.tsext-changesd-settings input[name="displayMonth"]' , this.domNode)[0].checked ? '1' : '2';
				cp.invalidate   = query('div.tsext-changesd-settings input[type="checkbox"].tsext-changesd-invalidate' , this.domNode)[0].checked;
			}else{
				cp.empTypeId = this.getDestEmpTypeId(); // 変更先の勤務体系ID
				cp.invalidate = false;
				if(cp.empTypeId){
					var empType = this.empTypes.getEmpTypeById(cp.empTypeId);
					cp.empTypeName  = empType.getName();
					cp.empTypeCode  = empType.getEmpTypeCode();
					cp.startMonth   = empType.getStartMonth();
					cp.startDate    = empType.getStartDate();
					cp.startWeek    = empType.getStartWeek();
					cp.displayYear  = empType.getDisplayYear();
					cp.displayMonth = empType.getDisplayMonth();
				}
			}
			return cp;
		},
		// 変更先の勤務体系
		getDestEmpTypeId: function(e){
			var select = query('div.tsext-changesd-settings select.tsext-changesd-dest-empTypes', this.domNode)[0];
			return (select.value || null);
		},
		// パラメータを取得
		getParameter: function(){
			// 選択された勤務体系のリストを得る
			var ets = this.empTypes.getEmpTypesByIds(this.empTypeTable.getObjIds(true));
			// 対象社員数を数える
			var empCount = 0;
			array.forEach(ets, function(et){
				empCount += et.getEmpCount();
			});
			var cd = this.getChangeDate(); // 切替日
			var cp = this.getChangeParam(); // 変更値
			return {
				empTypeCount: ets.length,
				empCount: empCount,
				empTypes: ets,
				changeDate: cd,
				changeParam: cp,
				valid: (empCount && cd && (!cp.type || cp.empTypeId))
			};
		},
		displayByStage : function(stage){
			this.stage = stage;
			domAttr.set('tsextChangeInitDateAtt'       , 'disabled', (this.stage != 1));
			domAttr.set('tsextChangeInitDateAttCancel' , 'disabled', (this.stage != 1));
			domAttr.set('tsextChangeInitDateAttConfirm', 'disabled', (this.stage != 0));
			query('.tsext-settings input, .tsext-settings select', this.domNode).forEach(function(el){
				domAttr.set(el, 'disabled', (this.stage != 0));
			}, this);
			query('.tsext-busy-caution', this.domNode).forEach(function(el){
				domStyle.set(el, 'display', (this.stage == 2 ? '' : 'none'));
			}, this);
			if(this.stage == 0){
				this.changedStartMonth();
				this.changedStartDate();
			}
		},
		// 勤務体系選択時処理
		checkExecutable: function(){
			var param = this.getParameter();
			var div = query('div.tsext-emptype-note', this.domNode)[0];
			div.innerHTML = str.substitute("対象勤務体系: ${0}  対象社員: ${1}", [param.empTypeCount, param.empCount]);
			domAttr.set('tsextChangeInitDateAttConfirm', 'disabled', !param.valid);
		},
		// 起算月が変更された
		changedStartMonth: function(e){
			var v = query('div.tsext-changesd-settings select.tsext-changesd-month', this.domNode)[0].value;
			var i = 0;
			query('div.tsext-changesd-settings input[name="displayYear"]', this.domNode).forEach(function(el){
				if(i==0 && v == '1'){
					el.checked = true;
				}else if(i==1){
					domAttr.set(el, 'disabled', (v == '1'));
				}
				i++;
			});
		},
		// 起算日が変更された
		changedStartDate: function(e){
			var v = query('div.tsext-changesd-settings select.tsext-changesd-date', this.domNode)[0].value;
			var i = 0;
			query('div.tsext-changesd-settings input[name="displayMonth"]', this.domNode).forEach(function(el){
				if(i==0 && v == '1'){
					el.checked = true;
				}else if(i==1){
					domAttr.set(el, 'disabled', (v == '1'));
				}
				i++;
			});
		},
		// ログを表示
		showLog: function(msg, noTime, noScroll, clear){
			var areas = query('div.tsext-changesd-log textarea');
			if(!areas.length){
				return;
			}
			var area = areas[0];
			if(clear){
				area.value = '';
			}
			if(!noTime){
				area.value += moment().format('YYYY/MM/DD HH:mm:ss') + ' ' +  (msg || '') + '\n';
			}else{
				area.value += msg + '\n';
			}
			if(!noScroll){
				area.scrollTop = area.scrollHeight;
			}
		},
		// 実行キャンセル
		cancelChangeInitDateAtt: function(e){
			this.displayByStage(0);
		},
		// 変更内容を確認
		confirmChangeInitDateAtt: function(e){
			this.showError();
			this.fetchCalendar(lang.hitch(this, function(flag, errmsg){
				if(flag < 0){
					this.showError(errmsg);
					return;
				}
				var changeInitDateAttLogic = new ChangeInitDateAttLogic(
					this.empTypes,
					this.getParameter(),
					lang.hitch(this, this.showLog)
				);
				var check = changeInitDateAttLogic.checkValid();
				this.showLog(check.log, false, false, true);
				if(check.errorCnt || check.warnCnt){
					(new Confirm({
						title:(check.errorCnt ? 'エラー' : '警告'),
						message:Util.joinEx(check.errors.concat(check.warns), '<br/>', 8),
						alertMode: (check.errorCnt > 0),
						okLabel: (!check.errorCnt ? '続行' : null)
					})).show().then(
						lang.hitch(this, function(){
							this.displayByStage(1);
						}),
						lang.hitch(this, function(){
							this.displayByStage(0);
						})
					);
				}else{
					this.displayByStage(1);
				}
			}));
		},
		// 起算日変更開始
		startChangeInitDateAtt: function(e){
			this.fetchCalendar(lang.hitch(this, function(flag, errmsg){
				if(flag < 0){
					this.showError(errmsg);
					return;
				}
				this.executeChangeInitDateAtt();
			}));
		},
		// 起算日変更実行
		executeChangeInitDateAtt: function(){
			(new Confirm({
				title:'確認',
				message:'起算日変更を実行します。よろしいですか？'
			})).show().then(
				lang.hitch(this, function(){
					this.displayByStage(2);
					var changeInitDateAttLogic = new ChangeInitDateAttLogic(
						this.empTypes,
						this.getParameter(),
						lang.hitch(this, this.showLog)
					);
					var check = changeInitDateAttLogic.checkValid();
					this.showLog(check.log, false, false, true);
					this.showLog(str.rep('*', 60));
					this.showLog('起算日変更開始');
					changeInitDateAttLogic.executeStep1(0, lang.hitch(this, function(flag, result){
						if(flag == 0){ // 途中経過
							this.showLog(result);
						}else if(flag < 0){ // エラー
							this.showLog('エラー: ' + result);
//							this.showLog(changeInitDateAttLogic.getRecoveryScripts(), true, true);
							this.showError(result);
							this.showLog("異常終了しました");
							this.finishChangeInitDateAtt(result);
							this.downloadLog();
						}else{ // 正常終了
							this.showLog(result);
							this.showLog(str.rep('*', 60));
							this.finishChangeInitDateAtt();
							this.downloadLog();
						}
					}));
				})
			);
		},
		// 起算日変更実行終了
		finishChangeInitDateAtt: function(errmsg){
			query('.tsext-busy-caution', this.domNode).forEach(function(el){
				domStyle.set(el, 'display', 'none');
			}, this);
			var div = query('div.' + (errmsg ? 'tsext-finish-error' : 'tsext-finish-ok'), this.domNode)[0];
			domStyle.set(div, 'display', '');
			if(errmsg){
				query('div > div:first-child', div)[0].innerHTML = 'エラー：' + errmsg;
			}
		},
		//
		closeFinishChangeInitDateAtt: function(){
			query('div.tsext-finish-error, div.tsext-finish-ok', this.domNode).forEach(function(el){
				domStyle.set(el, 'display', 'none');
			});
			this.reset();
			this.displayByStage(0);
		},
		// ログをダウンロードする
		downloadLog: function(){
			var area = query('div.tsext-changesd-log textarea')[0];
			if(!area.value){
				return;
			}
			if((dojo.isChrome || dojo.isFF) && typeof(Blob) !== "undefined"){
				var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
				var content = new Blob([bom, area.value], { "type" : "text/plain" });
				var fname = this.organization.Id + '_' + moment().format('YYYYMMDDHHmmss') + '.txt';
				// IEか他ブラウザかの判定
				if(window.navigator.msSaveBlob){
					// IEなら独自関数を使います。
					window.navigator.msSaveBlob(content, fname);
				} else {
					// それ以外はaタグを利用してイベントを発火させます
					var a = query('.tsext-form-download a', this.domNode)[0];
					a.href = URL.createObjectURL(content);
					a.download = fname;
					a.target = '_blank';
					a.click();
					setTimeout(function(){
						URL.revokeObjectURL(a.href);
					}, 3000);
				}
			}
		}
	});
});
