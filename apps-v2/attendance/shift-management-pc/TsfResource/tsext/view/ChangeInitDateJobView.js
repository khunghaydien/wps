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
	"dojo/text!tsext/template/changeInitDateJobView.html",
	"tsext/service/Request",
	"tsext/dialog/Calendar",
	"tsext/dialog/Confirm",
	"tsext/widget/CheckTable",
	"tsext/logic/ChangeInitDateJobLogic",
	"tsext/obj/ChangeInitDateJobApplys",
	"tsext/util/Util"
], function(declare, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domClass, domStyle, query, on, str, lang, template, Request, Calendar, Confirm, CheckTable, ChangeInitDateJobLogic, ChangeInitDateJobApplys, Util) {
	return declare("tsext.view.ChangeInitDateJobView", [_WidgetBase, _TemplatedMixin], {
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
				// 起算日が変更された
				on(query('div.tsext-changesd-settings select.tsext-changesd-date', this.domNode), 'change', lang.hitch(this, this.changedStartDate)),
				// 変更内容を確認する
				on(dom.byId('tsextChangeInitDateJobConfirm'), 'click', lang.hitch(this, this.confirmChangeInitDateJob)),
				// キャンセル
				on(dom.byId('tsextChangeInitDateJobCancel'), 'click', lang.hitch(this, this.cancelChangeInitDateJob)),
				// 起算日変更実行
				on(dom.byId('tsextChangeInitDateJob'), 'click', lang.hitch(this, this.startChangeInitDateJob)),
				// 終了またはエラーメッセージを閉じる
				on(query('div.tsext-finish-button', this.domNode), 'click', lang.hitch(this, this.closeFinishChangeInitDateJob)),
				// ログをダウンロード
				on(query('div.tsext-changesd-log a', this.domNode), 'click', lang.hitch(this, this.downloadLog))
			);
			this.displayByStage(-1);
			this.searchCommon();
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
			this.displayByStage(0);
			this.searchCommon();
		},
		// 勤怠共通設定検索
		searchCommon: function(){
			var reqs = [];
			reqs.push({
				soql: "select Id,Name from Organization",
				limit: 50000,
				offset: 0
			});
			reqs.push({
				soql: "select Id,JobInitialDayOfMonth__c,JobMarkOfMonth__c,JobInitialDateHistory__c from AtkCommon__c",
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
						this.common = result.records[0];
						if(this.common.JobInitialDateHistory__c){
							this.common.JobInitialDateHistory__c = Util.fromJson(this.common.JobInitialDateHistory__c);
						}
						this.buildTable();
					}
				})
			);
		},
		//
		buildTable: function(){
			var n1 = query('div.tsext-changesd-settings td.tsext-changesd-current-date', this.domNode)[0];
			var n2 = query('div.tsext-changesd-settings td.tsext-changesd-current-mark', this.domNode)[0];
			var n3 = query('div.tsext-changesd-settings td.tsext-changesd-current-link', this.domNode)[0];
			n1.innerHTML = this.common.JobInitialDayOfMonth__c + '日';
			n2.innerHTML = (this.common.JobMarkOfMonth__c == '2' ? '締め日に合わせる' : '起算日に合わせる');
			domConstruct.empty(n3);
			domConstruct.create('a', {
				href:tsCONST.jobConfigView + str.substitute("?retURL=${0}", [tsCONST.manageView]),
				innerHTML: 'LINK',
				target: '_blank'
			}, n3);
			this.displayByStage(0);
			this.checkExecutable();
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
		// 変更先
		getChangeParam: function(e){
			return {
				org: {
					startDate   : '' + this.common.JobInitialDayOfMonth__c,
					displayMonth: this.common.JobMarkOfMonth__c
				},
				startDate   : query('div.tsext-changesd-settings select.tsext-changesd-date' , this.domNode)[0].value,
				displayMonth: query('div.tsext-changesd-settings input[name="displayMonth"]' , this.domNode)[0].checked ? '1' : '2'
			};
		},
		// パラメータを取得
		getParameter: function(){
			var cd = this.getChangeDate(); // 切替日
			var cp = this.getChangeParam(); // 変更値
			return {
				changeDate: cd,
				changeParam: cp,
				history: this.common.JobInitialDateHistory__c,
				valid: (cd ? true : false)
			};
		},
		displayByStage : function(stage){
			this.stage = stage;
			domAttr.set('tsextChangeInitDateJob'       , 'disabled', (this.stage != 1));
			domAttr.set('tsextChangeInitDateJobCancel' , 'disabled', (this.stage != 1));
			domAttr.set('tsextChangeInitDateJobConfirm', 'disabled', (this.stage != 0));
			query('.tsext-settings input, .tsext-settings select', this.domNode).forEach(function(el){
				domAttr.set(el, 'disabled', (this.stage != 0));
			}, this);
			query('.tsext-busy-caution', this.domNode).forEach(function(el){
				domStyle.set(el, 'display', (this.stage == 2 ? '' : 'none'));
			}, this);
			if(this.stage == 0){
				this.changedStartDate();
			}
		},
		// 勤務体系選択時処理
		checkExecutable: function(){
			var param = this.getParameter();
			domAttr.set('tsextChangeInitDateJobConfirm', 'disabled', !param.valid);
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
		// 工数実績申請を取得
		fetchJobApplys: function(callback){
			var cp = this.getParameter();
			var req = {
				soql: str.substitute("select Id, EmpId__c, EmpId__r.EmpCode__c, EmpId__r.Name, EmpId__r.EntryDate__c, EmpId__r.EndDate__c"
					+ ", Status__c, YearMonth__c, SubNo__c, StartDate__c, EndDate__c"
					+ " from AtkJobApply__c where EndDate__c >= ${0} order by EmpId__c, YearMonth__c, SubNo__c",
					[cp.changeDate]),
				limit: 5000,
				offset: 0
			};
			Request.actionA(tsCONST.API_SEARCH_DATA, req).then(
				lang.hitch(this, function(result){
					this.jobApplys = new ChangeInitDateJobApplys(result.records);
					callback(1);
				}),
				lang.hitch(this, function(errmsg){
					callback(-1, errmsg);
				})
			);
		},
		// 実行キャンセル
		cancelChangeInitDateJob: function(e){
			this.displayByStage(0);
		},
		// 変更内容を確認
		confirmChangeInitDateJob: function(e){
			this.fetchJobApplys(lang.hitch(this, function(flag, errmsg){
				if(flag < 0){
					this.showError(errmsg);
					return;
				}
				var changeInitDateJobLogic = new ChangeInitDateJobLogic(
					this.jobApplys,
					this.getParameter(),
					lang.hitch(this, this.showLog)
				);
				var check = changeInitDateJobLogic.checkValid();
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
		startChangeInitDateJob: function(e){
			this.executeChangeInitDateJob();
		},
		// 起算日変更実行
		executeChangeInitDateJob: function(){
			(new Confirm({
				title:'確認',
				message:'起算日変更を実行します。よろしいですか？'
			})).show().then(
				lang.hitch(this, function(){
					this.displayByStage(2);
					var changeInitDateJobLogic = new ChangeInitDateJobLogic(
						this.jobApplys,
						this.getParameter(),
						lang.hitch(this, this.showLog)
					);
					var check = changeInitDateJobLogic.checkValid();
					this.showLog(check.log, false, false, true);
					this.showLog(str.rep('*', 60));
					this.showLog('起算日変更開始');
					changeInitDateJobLogic.executeStep1(lang.hitch(this, function(flag, result){
						if(flag == 0){ // 途中経過
							this.showLog(result);
						}else if(flag < 0){ // エラー
							this.showLog('エラー: ' + result);
							this.showLog(changeInitDateJobLogic.getRecoveryScripts());
							this.showError(result);
							this.showLog("異常終了しました");
							this.finishChangeInitDateJob(result);
							this.downloadLog();
						}else{ // 正常終了
							this.showLog(result);
							this.showLog(str.rep('*', 60));
							this.showLog(changeInitDateJobLogic.getRecoveryScripts(), true, true);
							this.finishChangeInitDateJob();
							this.downloadLog();
						}
					}));
				})
			);
		},
		// 起算日変更実行終了
		finishChangeInitDateJob: function(errmsg){
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
		closeFinishChangeInitDateJob: function(){
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
