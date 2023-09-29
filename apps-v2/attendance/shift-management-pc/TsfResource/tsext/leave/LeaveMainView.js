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
	"dojo/text!tsext/leave/LeaveMainView.html",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/dialog/Calendar",
	"tsext/leave/Emps",
	"tsext/leave/ManageNames",
	"tsext/leave/EmpStocks",
	"tsext/leave/Holidays",
	"tsext/leave/DialogProvide",
	"tsext/leave/DialogMinus",
	"tsext/leave/DialogSpend",
	"tsext/leave/DialogMsg",
	"tsext/leave/DialogText",
	"tsext/leave/DialogConfigHistory",
	"tsext/leave/DialogEmpMonths",
	"tsext/leave/DialogHolidays",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domStyle, query, on, str, Deferred, lang, template, Request, Wait, Calendar, Emps, ManageNames, EmpStocks, Holidays, DialogProvide, DialogMinus, DialogSpend, DialogMsg, DialogText, DialogConfigHistory, DialogEmpMonths, DialogHolidays, Util) {
	return declare("tsext.leave.LeaveMainView", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(mode, empId){
			this.mode = mode; // 0:編集モード  1:読み取り専用モード
			this.empId = empId;
			this.emps = new Emps();
			this.manageNames = new ManageNames();
			this.holidays = new Holidays();
			this.currentEmp = null;
			this.currentManageName = null;
			this.eventHandles = [];
		},
		placeAt: function(){
			this.inherited(arguments);
			this.startup();
		},
		startup: function(){
			this.inherited(arguments);
			this.own(
				on(dom.byId('leaveEmps'), 'change', lang.hitch(this, function(e){ // 社員選択変更
					this.loadEmpStocks();
				})),
				on(dom.byId('leaveManageNames'), 'change', lang.hitch(this, function(e){ // 日数管理名選択変更
					this.loadEmpStocks();
				})),
				on(dom.byId('leaveAllClear'), 'click', lang.hitch(this, function(e){ // 全消去
					this.deleteAll();
				})),
				on(dom.byId('leaveAddProvide'), 'click', lang.hitch(this, function(e){ // 付与
					this.showProvideDialog();
				})),
				on(dom.byId('leaveAddMinus'), 'click', lang.hitch(this, function(e){ // マイナス付与
					this.showMinusDialog();
				})),
				on(dom.byId('leaveAddSpend'), 'click', lang.hitch(this, function(e){ // 消化
					this.showSpendDialog();
				})),
				on(dom.byId('leaveRefresh'), 'click', lang.hitch(this, function(e){ // 更新
					if(this.currentEmp){
						this.currentEmp.reset();
					}
					this.loadEmpStocks();
				})),
				on(dom.byId('leaveDownload'), 'click', lang.hitch(this, function(e){ // ＤＬ
					this.downloadTable();
				})),
				on(dom.byId('leaveViewMode'), 'change', lang.hitch(this, function(e){ // 表示モード
					this.loadEmpStocks();
				})),
				on(dom.byId('leaveStepValue'), 'change', lang.hitch(this, function(e){ // 切上単位
					this.loadEmpStocks();
				})),
				on(dom.byId('leaveEmpEdit'), 'click', lang.hitch(this, function(e){ // 社員設定
					this.openEmpEdit();
				})),
				on(dom.byId('leaveConfigHistory'), 'click', lang.hitch(this, function(e){ // 勤怠設定履歴
					this.loadConfigHistory();
				})),
				on(dom.byId('leaveMonthRanges'), 'click', lang.hitch(this, function(e){ // 勤怠月次情報
					this.loadMonthRanges();
				})),
				on(dom.byId('leaveHolidays'), 'click', lang.hitch(this, function(e){ // 休暇一覧
					this.loadHolidays();
				})),
				on(dom.byId('leaveTargetDate'), 'change', lang.hitch(this, function(e){ // 残日数の基準日
					this.changedTargetDate();
				})),
				on(dom.byId('leaveTargetDate'), 'click', lang.hitch(this, function(e){
					e.preventDefault();
					e.stopPropagation();
					Calendar.popup(e.target, dom.byId(tsCONST.TOP_AREA_ID));
				})),
				on(dom.byId('leaveTargetDate'), 'calendar', lang.hitch(this, this.changedTargetDate)),
				on(dom.byId('leaveRebuild'), 'click', lang.hitch(this, function(e){ // 再計算
					this.rebuildStock();
				}))
			);
			this.enableButton(false);
			if(this.isReadOnly()){
				domStyle.set('leaveAllClear'  , 'display', 'none');
				domStyle.set('leaveAddProvide', 'display', 'none');
				domStyle.set('leaveAddMinus'  , 'display', 'none');
				domStyle.set('leaveAddSpend'  , 'display', 'none');
				query('ul.tsext-pankz', this.domNode).forEach(function(el){
					domConstruct.empty(el);
					domConstruct.create('a', {
						href: tsCONST.configEditView + '?support=full#!leave',
						target: '_blank',
						innerHTML: 'メンテナンス画面を開く'
					}, domConstruct.create('li', null, el));
				});
			}
			dom.byId('leaveTargetDate').value = moment().format('YYYY/MM/DD');
			Wait.show(true);
			this.fetchEmps(lang.hitch(this, function(){
				Wait.show(false);
				this.setEmps();
				this.setManageNames();
				this.loadEmpStocks();
			}));
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
		// 参照専用
		isReadOnly: function(){
			return (this.mode == 1);
		},
		// ボタンの有効化/無効化
		enableButton: function(flag1, flag2){
			domAttr.set('leaveAllClear'     , 'disabled', !flag2);
			domAttr.set('leaveAddProvide'   , 'disabled', !flag2);
			domAttr.set('leaveAddMinus'     , 'disabled', !flag2);
			domAttr.set('leaveAddSpend'     , 'disabled', !flag2);
			domAttr.set('leaveRefresh'      , 'disabled', !flag2);
			domAttr.set('leaveDownload'     , 'disabled', !flag2);
			domAttr.set('leaveEmpEdit'      , 'disabled', !flag1);
			domAttr.set('leaveConfigHistory', 'disabled', !flag1);
			domAttr.set('leaveMonthRanges'  , 'disabled', !flag1);
			domAttr.set('leaveRebuild'      , 'disabled', !flag1);
		},
		// 社員リストを取得
		fetchEmps: function(callback){
			var empIds = [];
			if(this.empId){
				empIds.push(this.empId);
			}
			this.emps.fetch(empIds).then(
				lang.hitch(this, function(){
					this.fetchManageNames(callback);
				}),
				lang.hitch(this, this.showError)
			);
		},
		// 日数管理名リストを取得
		fetchManageNames: function(callback){
			this.manageNames.fetch().then(
				lang.hitch(this, function(){
					callback();
				}),
				lang.hitch(this, this.showError)
			);
		},
		// 社員名と休暇名の選択を取得
		refreshCurrent: function(){
			var empId = dom.byId('leaveEmps').value;
			var manageName = dom.byId('leaveManageNames').value;
			this.enableButton((empId ? true : false), (manageName ? true : false));
			if(empId && (!this.currentEmp || this.currentEmp.getId() != empId)){
				this.currentEmp = this.emps.getEmpById(empId);
			}
			this.currentManageName = manageName || null;
			return empId || null;
		},
		// 積休情報を取得
		loadEmpStocks: function(){
			this.showError();
			var empId = this.refreshCurrent();
			if(!empId || !this.currentManageName){
				this.displayEmpStocks();
				return;
			}
			Wait.show(true);
			this.currentEmp.resetStockTransitions();
			this.currentEmp.fetchConfigHistory(lang.hitch(this, function(flag, errmsg){
				if(flag){
					this.fetchEmpStocks(lang.hitch(this, function(){
						this.currentEmp.checkSyncStocks();
						this.currentEmp.createStockTransitions(this.getStepValue());
						this.displayEmpStocks();
						this.changedTargetDate();
					}));
				}else{
					this.showError(errmsg);
				}
			}));
		},
		// 表示モード
		getViewMode: function(){
			return parseInt(dom.byId('leaveViewMode').value, 10);
		},
		// 切上単位
		getStepValue: function(){
			return parseInt(dom.byId('leaveStepValue').value, 10);
		},
		// 社員設定
		openEmpEdit: function(){
			this.showError();
			if(!this.currentEmp){
				return;
			}
			window.open(tsCONST.empEditView + '?empId=' + this.currentEmp.getId());
		},
		// 勤怠設定履歴を取得
		loadConfigHistory: function(){
			this.showError();
			if(!this.currentEmp){
				return;
			}
			Wait.show(true);
			this.currentEmp.fetchConfigHistory(lang.hitch(this, function(flag, errmsg){
				Wait.show(false);
				if(!flag){
					this.showError(errmsg);
				}else{
					var dialogConfigHistory = new DialogConfigHistory();
					dialogConfigHistory.show(this.currentEmp).then(
						lang.hitch(this, function(){
						}),
						lang.hitch(this, function(errmsg){
							this.showError(errmsg);
						})
					);
				}
			}));
		},
		// 月次履歴を取得
		loadMonthRanges: function(){
			this.showError();
			if(!this.currentEmp){
				return;
			}
			Wait.show(true);
			this.currentEmp.fetchMonthRanges(lang.hitch(this, function(flag, errmsg){
				Wait.show(false);
				if(!flag){
					this.showError(errmsg);
				}else{
					var dialogEmpMonths = new DialogEmpMonths();
					dialogEmpMonths.show(this.currentEmp).then(
						lang.hitch(this, function(){
						}),
						lang.hitch(this, function(errmsg){
							this.showError(errmsg);
						})
					);
				}
			}));
		},
		// 休暇一覧を取得
		loadHolidays: function(){
			this.showError();
			Wait.show(true);
			this.holidays.fetchHolidays().then(
				lang.hitch(this, function(){
					Wait.show(false);
					var dialogHolidays = new DialogHolidays();
					dialogHolidays.show(this.holidays).then(
						lang.hitch(this, function(){
						}),
						lang.hitch(this, function(errmsg){
							this.showError(errmsg);
						})
					);
				}),
				lang.hitch(this, this.showError)
			);
		},
		// 勤怠積休の再計算
		rebuildStock: function(){
			this.showError();
			var empId = this.refreshCurrent();
			var td = moment(dom.byId('leaveTargetDate').value, 'YYYY/MM/DD');
			if(!empId || !td.isValid()){
				return;
			}
			Wait.show(true);
			this.currentEmp.rebuildStock(td.format('YYYY-MM-DD'), this.currentManageName, lang.hitch(this, function(flag, result){
				Wait.show(false);
				if(!flag){
					this.showError(result);
				}else{
					console.log(result);
					this.loadEmpStocks();
				}
			}));
		},
		// 積休を取得
		fetchEmpStocks: function(callback){
			this.currentEmp.getEmpStocks().fetchStocks(this.currentEmp, this.currentManageName).then(
				lang.hitch(this, function(){
					this.fetchEmpStockDetails(callback);
				}),
				lang.hitch(this, this.showError)
			);
		},
		// 積休詳細を取得
		fetchEmpStockDetails: function(callback){
			this.currentEmp.getEmpStocks().fetchStockDetails(this.currentEmp, this.currentManageName).then(
				lang.hitch(this, function(){
					callback();
				}),
				lang.hitch(this, this.showError)
			);
		},
		// 社員選択プルダウンをセット
		setEmps: function(){
			var select = dom.byId('leaveEmps');
			domConstruct.empty(select);
			domConstruct.create('option', {
				innerHTML: '(選択してください)',
				value: ''
			}, select);
			for(var i = 0 ; i < this.emps.getSize() ; i++){
				var emp = this.emps.getEmpByIndex(i);
				domConstruct.create('option', {
					innerHTML: emp.getCodeAndName(),
					value: emp.getId()
				}, select);
			}
			if(this.empId && this.emps.getSize()){
				select.value = this.empId;
				domAttr.set(select, 'disabled', true);
			}
		},
		// 日数管理名選択プルダウンをセット
		setManageNames: function(){
			var select = dom.byId('leaveManageNames');
			domConstruct.empty(select);
			domConstruct.create('option', {
				innerHTML: '(選択してください)',
				value: ''
			}, select);
			domConstruct.create('option', {
				innerHTML: '代休',
				value: '代休'
			}, select);
			var names = this.manageNames.getManageNames();
			for(var i = 0 ; i < names.length ; i++){
				var name = names[i];
				domConstruct.create('option', {
					innerHTML: name,
					value: name
				}, select);
			}
		},
		// リソース解放
		removeEventHandles: function(){
			array.forEach(this.eventHandles || [], function(handle){
				handle.remove();
			});
			this.eventHandles = [];
		},
		// 積休データ表作成
		displayEmpStocks: function(){
			var viewMode = this.getViewMode();
			var stepValue = this.getStepValue();
			this.removeEventHandles();
			var transitions = this.currentEmp.getStockTransitions(viewMode);

			var area = dom.byId('leaveTableArea');
			domConstruct.empty(area);
			var table = domConstruct.create('table', null, area);
			var thead = domConstruct.create('thead', null, table);

			var tr = domConstruct.create('tr', null, thead);
			domConstruct.create('th', { innerHTML:'付与'          , colSpan:12 }, tr);
			domConstruct.create('th', { innerHTML:'消化'          , colSpan:11 }, tr);
			domConstruct.create('th', { innerHTML:(!viewMode ? '時系列' : '付与別') + '残日数'    , colSpan:3 }, tr);

			tr = domConstruct.create('tr', null, thead);
			domConstruct.create('th', null, tr);
			domConstruct.create('th', null, tr);
			domConstruct.create('th', { innerHTML:'P'          }, tr);
			domConstruct.create('th', { innerHTML:'事柄'       }, tr);
			domConstruct.create('th', { innerHTML:'基準時間'   }, tr);
			domConstruct.create('th', { innerHTML:'日数'       }, tr);
			domConstruct.create('th', { innerHTML:'時間'       }, tr);
			domConstruct.create('th', { innerHTML:'日数換算'   }, tr);
			domConstruct.create('th', { innerHTML:'有効開始日' }, tr);
			domConstruct.create('th', { innerHTML:'失効日'     }, tr);
			domConstruct.create('th', { innerHTML:'付与日'     }, tr);
			domConstruct.create('th', { innerHTML:'残'         }, tr);
			domConstruct.create('th', null, tr);
			domConstruct.create('th', null, tr);
			domConstruct.create('th', { innerHTML:'P'          }, tr);
			domConstruct.create('th', { innerHTML:'S'          }, tr);
			domConstruct.create('th', { innerHTML:'事柄'       }, tr);
			domConstruct.create('th', { innerHTML:'基準時間'   }, tr);
			domConstruct.create('th', { innerHTML:'消化日'     }, tr);
			domConstruct.create('th', { innerHTML:'種類'       }, tr);
			domConstruct.create('th', { innerHTML:'日数'       }, tr);
			domConstruct.create('th', { innerHTML:'時間'       }, tr);
			domConstruct.create('th', { innerHTML:'日数換算'   }, tr);
			domConstruct.create('th', { innerHTML:'残日数'     }, tr);
			domConstruct.create('th', { innerHTML:'残時間'     }, tr);
			domConstruct.create('th', { innerHTML:'日数換算'   }, tr);

			var tbody = domConstruct.create('tbody', null, table);
			for(var i = 0 ; i < transitions.length ; i++){
				var tra = transitions[i];
				var empStock = tra.getStock();
				tr = domConstruct.create('tr', null, tbody);
				if(!empStock && !tra.isChanged() && !tra.isExpired()){ // 付与に紐づかない消化レコードとの境界
					domConstruct.create('td', {
						colSpan:26,
						innerHTML: '※以下は付与に紐づかない消化レコード',
						style:'background-color:#eaeaea;color:#555;'
					}, tr);
					continue;
				}
				if(tra.isChanged()){ // 基準時間変更
					for(var x = 0 ; x < 12 ; x++){
						domConstruct.create('td', { className:'tra-s-air' }, tr);
					}
					domConstruct.create('td', { className:'bt-change' }, tr);
					domConstruct.create('td', { className:'bt-change' }, tr);
					domConstruct.create('div', { innerHTML:tra.getMark(true)           }, domConstruct.create('td', { className:'bt-change tra-mark' }, tr));
					domConstruct.create('td', { className:'bt-change' }, tr);
					domConstruct.create('div', { innerHTML:'基準時間変更'              }, domConstruct.create('td', { className:'bt-change tra-name' }, tr));
					domConstruct.create('div', { innerHTML:tra.getBaseTimeHMM()        }, domConstruct.create('td', { className:'bt-change tra-time' }, tr));
					domConstruct.create('div', { innerHTML:tra.getDate()               }, domConstruct.create('td', { className:'bt-change tra-date' }, tr));
					for(var x = 0 ; x < 4 ; x++){
						domConstruct.create('td', { className:'bt-change' }, tr);
					}
					domConstruct.create('div', { innerHTML:tra.getRemainDays(viewMode) }, domConstruct.create('td', { className:'bt-change tra-days' }, tr));
					domConstruct.create('div', { innerHTML:tra.getRemainTime(viewMode) }, domConstruct.create('td', { className:'bt-change tra-time' }, tr));
					domConstruct.create('div', { innerHTML:tra.getRemainRaw5(viewMode) }, domConstruct.create('td', { className:'bt-change tra-days' }, tr));
					continue;
				}else if(tra.isExpired()){ // 失効
					for(var x = 0 ; x < 12 ; x++){
						domConstruct.create('td', { className:'tra-s-air' }, tr);
					}
					domConstruct.create('td', { className:'expired' }, tr);
					domConstruct.create('td', { className:'expired' }, tr);
					domConstruct.create('div', { innerHTML:tra.getMark()               }, domConstruct.create('td', { className:'expired tra-mark' }, tr));
					domConstruct.create('td', { className:'expired' }, tr);
					domConstruct.create('div', { innerHTML:'失効'                      }, domConstruct.create('td', { className:'expired tra-name' }, tr));
					domConstruct.create('div', { innerHTML:tra.getBaseTimeHMM()        }, domConstruct.create('td', { className:'expired tra-time' }, tr));
					domConstruct.create('div', { innerHTML:tra.getDate()               }, domConstruct.create('td', { className:'expired tra-name' }, tr));
					domConstruct.create('td', { className:'expired' }, tr);
					domConstruct.create('div', { innerHTML:tra.getSpendDays()          }, domConstruct.create('td', { className:'expired tra-days' }, tr));
					domConstruct.create('div', { innerHTML:tra.getSpendTime()          }, domConstruct.create('td', { className:'expired tra-time' }, tr));
					domConstruct.create('div', { innerHTML:tra.getSpendRaw5()          }, domConstruct.create('td', { className:'expired tra-days' }, tr));
					domConstruct.create('div', { innerHTML:tra.getRemainDays(viewMode) }, domConstruct.create('td', { className:'expired tra-days' }, tr));
					domConstruct.create('div', { innerHTML:tra.getRemainTime(viewMode) }, domConstruct.create('td', { className:'expired tra-time' }, tr));
					domConstruct.create('div', { innerHTML:tra.getRemainRaw5(viewMode) }, domConstruct.create('td', { className:'expired tra-days' }, tr));
					continue;
				}
				domAttr.set(tr, 'data', empStock.getId());
				if(tra.isProvide()){ // 付与
					var td1 = domConstruct.create('td', { className:'tra-ctrl' }, tr);
					var td2 = domConstruct.create('td', { className:'tra-ctrl' }, tr);
					if(!this.isReadOnly()){
						if(tra.isEditable()){
							domConstruct.create('a', { innerHTML: '編集', className:'stock_edit' }, td1);
						}
						if(tra.isDeletable()){
							domConstruct.create('a', { innerHTML: '削除', className:'stock_del', style:'display:none;'  }, td2);
						}else if(tra.isReleasable()){
							domConstruct.create('a', { innerHTML: '解除', className:'stock_del', style:'display:none;'  }, td2);
						}
					}
					domConstruct.create('div', { innerHTML:tra.getMark(), title:tra.getJson()              }, domConstruct.create('td', { className:'tra-mark' }, tr));
					domConstruct.create('div', { innerHTML:tra.getName(), title:tra.getName()              }, domConstruct.create('td', { className:'tra-name' }, tr));
					domConstruct.create('div', { innerHTML:tra.getBaseTimeHMM(), className:tra.syncClass() }, domConstruct.create('td', { className:'tra-time' }, tr));
					domConstruct.create('div', { innerHTML:tra.getProvideDays()                            }, domConstruct.create('td', { className:'point-cell tra-days' }, tr));
					domConstruct.create('div', { innerHTML:tra.getProvideTime()                            }, domConstruct.create('td', { className:'point-cell tra-time' }, tr));
					domConstruct.create('div', { innerHTML:tra.getProvideRaw5()                            }, domConstruct.create('td', { className:'tra-days' }, tr));
					domConstruct.create('div', { innerHTML:tra.getStartDate()                              }, domConstruct.create('td', { className:'tra-date' }, tr));
					domConstruct.create('div', { innerHTML:tra.getLimitDate()                              }, domConstruct.create('td', { className:'tra-date' }, tr));
					domConstruct.create('div', { innerHTML:tra.getProvideDate()                            }, domConstruct.create('td', { className:'tra-date' }, tr));
					domConstruct.create('div', { innerHTML:tra.getRemain()                                 }, domConstruct.create('td', { className:'tra-days' }, tr));
					for(var x = 0 ; x < 11 ; x++){
						domConstruct.create('td', { className:'tra-p-air' }, tr);
					}
				}else{ // 消化
					for(var x = 0 ; x < 12 ; x++){
						domConstruct.create('td', { className:'tra-s-air' }, tr);
					}
					var td1 = domConstruct.create('td', { className:'tra-ctrl' }, tr);
					var td2 = domConstruct.create('td', { className:'tra-ctrl' }, tr);
					if(!this.isReadOnly() && tra.isLostFlag()){ // マイナス付与のみ編集可
						if(tra.isEditable()){
							domConstruct.create('a', { innerHTML: '編集', className:'stock_edit' }, td1);
						}
						if(tra.isDeletable()){
							domConstruct.create('a', { innerHTML: '削除', className:'stock_del'  }, td2);
						}else if(tra.isReleasable()){
							domConstruct.create('a', { innerHTML: '解除', className:'stock_del'  }, td2);
						}
					}
					domConstruct.create('div', { innerHTML:tra.getMark(true), title:tra.getJson(true)      }, domConstruct.create('td', { className:'tra-mark' }, tr));
					domConstruct.create('div', { innerHTML:tra.getMark()    , title:tra.getJson()          }, domConstruct.create('td', { className:'tra-mark' }, tr));
					domConstruct.create('div', { innerHTML:tra.getName(),     title:tra.getName()          }, domConstruct.create('td', { className:'tra-name' }, tr));
					domConstruct.create('div', { innerHTML:tra.getBaseTimeHMM(), className:tra.syncClass() }, domConstruct.create('td', { className:'tra-time' }, tr));
					domConstruct.create('div', { innerHTML:tra.getDate()                                   }, domConstruct.create('td', { className:'tra-date' }, tr));
					domConstruct.create('div', { innerHTML:tra.getSpendType()                              }, domConstruct.create('td', { className:'tra-date' }, tr));
					domConstruct.create('div', { innerHTML:tra.getSpendDays()                              }, domConstruct.create('td', { className:'tra-days point-cell' }, tr));
					domConstruct.create('div', { innerHTML:tra.getSpendTime()                              }, domConstruct.create('td', { className:'tra-time point-cell' }, tr));
					domConstruct.create('div', { innerHTML:tra.getSpendRaw5(), title:tra.getDetailJson()   }, domConstruct.create('td', { className:'tra-days' }, tr));
				}
				domConstruct.create('div', { innerHTML:tra.getRemainDays(viewMode) }, domConstruct.create('td', { className:'tra-days point-cell' }, tr));
				domConstruct.create('div', { innerHTML:tra.getRemainTime(viewMode) }, domConstruct.create('td', { className:'tra-time point-cell' }, tr));
				domConstruct.create('div', { innerHTML:tra.getRemainRaw5(viewMode) }, domConstruct.create('td', { className:'tra-days'            }, tr));
			}
			query('a.stock_edit', table).forEach(function(el){
				this.eventHandles.push(on(el, 'click', lang.hitch(this, this.editStock)));
			}, this);
			query('a.stock_del', table).forEach(function(el){
				this.eventHandles.push(on(el, 'click', lang.hitch(this, this.deleteStock)));
			}, this);
			Wait.show(false);
		},
		// 積休変遷リストのCSVデータを作成
		createCsv: function(){
			var obj = {
				fname: this.currentEmp.getName() + '_' + this.currentManageName + '.csv',
				heads:[
					'時系列順','付与別順',
					'P','事柄','基準時間','付与日数','付与時間','付与日数換算','有効開始日','失効日','付与日','残',
					'P','S','事柄','基準時間','消化日','種類','消化日数','消化時間','消化日数換算',
					'付与別残日数','付与別残時間','付与別残日数換算','時系列残日数','時系列残時間','時系列残日数換算'
					],
				value:''
			};
			var tras = this.currentEmp.getStockTransitions(0);
			for(var i = 0 ; i < tras.length ; i++){
				var tra = tras[i];
				var empStock = tra.getStock();
				var line = [];
				if(!empStock && !tra.isChanged() && !tra.isExpired()){ // 付与に紐づかない消化レコードとの境界
					for(var x = 0 ; x < obj.heads.length ; x++){
						line.push('');
					}
					obj.value += (line.join(',') + '\n');
					continue;
				}
				line.push(tra.getTimeSn() || '-');
				line.push(tra.getSn()     || '-');
				if(tra.isChanged()){ // 基準時間変更
					for(var x = 0 ; x < 10 ; x++){
						line.push('');
					}
					line.push(tra.getMark(true));
					line.push('');
					line.push('基準時間変更');
					line.push('"' + tra.getBaseTimeHMM() + '"');
					line.push('"' + tra.getDate()        + '"');
					for(var x = 0 ; x < 4 ; x++){
						line.push('');
					}
				}else if(tra.isExpired()){ // 失効
					for(var x = 0 ; x < 10 ; x++){
						line.push('');
					}
					line.push(tra.getMark());
					line.push('');
					line.push('失効');
					line.push('"' + tra.getBaseTimeHMM() + '"');
					line.push('"' + tra.getDate()        + '"');
					line.push('');
					line.push('"' + tra.getSpendDays()   + '"');
					line.push('"' + tra.getSpendTime()   + '"');
					line.push('"' + tra.getSpendRaw5()   + '"');
				}else if(tra.isProvide()){ // 付与
					line.push(tra.getMark());
					line.push(tra.getName());
					line.push('"' + tra.getBaseTimeHMM() + '"');
					line.push('"' + tra.getProvideDays() + '"');
					line.push('"' + tra.getProvideTime() + '"');
					line.push('"' + tra.getProvideRaw5() + '"');
					line.push('"' + tra.getStartDate()   + '"');
					line.push('"' + tra.getLimitDate()   + '"');
					line.push('"' + tra.getProvideDate() + '"');
					line.push('"' + tra.getRemain()      + '"');
					for(var x = 0 ; x < 9 ; x++){
						line.push('');
					}
				}else{ // 消化
					for(var x = 0 ; x < 10 ; x++){
						line.push('');
					}
					line.push(tra.getMark(true));
					line.push(tra.getMark());
					line.push(tra.getName());
					line.push('"' + tra.getBaseTimeHMM() + '"');
					line.push('"' + tra.getDate()        + '"');
					line.push('"' + tra.getSpendType()   + '"');
					line.push('"' + tra.getSpendDays()   + '"');
					line.push('"' + tra.getSpendTime()   + '"');
					line.push('"' + tra.getSpendRaw5()   + '"');
				}
				line.push('"' + tra.getRemainDays(1) + '"');
				line.push('"' + tra.getRemainTime(1) + '"');
				line.push('"' + tra.getRemainRaw5(1) + '"');
				line.push('"' + tra.getRemainDays(0) + '"');
				line.push('"' + tra.getRemainTime(0) + '"');
				line.push('"' + tra.getRemainRaw5(0) + '"');
				obj.value += (line.join(',') + '\n');
			}
			return obj;
		},
		// 積休レコード削除実行
		deleteAll: function(){
			this.showError();
			if(this.currentEmp.getEmpStocks().isExistValidApply()){
				var msg = '消化レコードに休暇申請が紐づいているため、勤務表で休暇申請を取り消してください';
				(new DialogMsg()).show(msg, true).then(function(){},function(){});
				return;
			}
			var msg = str.substitute("${0} さんの「${1}」の勤怠積休データをすべて削除します。よろしいですか？"
					, [this.currentEmp.getName(), this.currentManageName]);
			(new DialogMsg()).show(msg).then(
				lang.hitch(this, function(){
					this.doDeleteAll();
				}),
				lang.hitch(this, function(errmsg){
				})
			);
		},
		//
		doDeleteAll: function(){
			Wait.show(true);
			var req = {
				action: 'operateEmpStock',
				empId: this.currentEmp.getId(),
				manageName: this.currentManageName,
				operateType: 'deleteAll'
			};
			Request.actionA(
				tsCONST.API_GET_EXT_RESULT,
				req,
				true
			).then(
				lang.hitch(this, function(result){
					this.loadEmpStocks();
				}),
				lang.hitch(this, function(result){
					this.showError(result);
				})
			);
		},
		// 選択した行の積休インスタンスを返す
		getEmpStockByNode: function(node){
			var tr = Util.getAncestorByTagName(node, 'TR');
			if(!tr){
				return null;
			}
			var id = domAttr.get(tr, 'data');
			if(!id){
				return null;
			}
			return this.currentEmp.getEmpStocks().getStockById(id);
		},
		// 積休レコード編集
		editStock: function(e){
			this.showError();
			var empStock = this.getEmpStockByNode(e.target);
			if(!empStock){
				return;
			}
			if(empStock.isProvide()){
				this.showProvideDialog(empStock);
			}else if(empStock.isSpend()){
				this.showSpendDialog(empStock);
			}
		},
		// 積休レコード削除
		deleteStock: function(e){
			this.showError();
			var empStock = this.getEmpStockByNode(e.target);
			if(!empStock){
				return;
			}
			var msg = '';
			if(!empStock.isSolo()){
				msg = str.substitute("${0} ${1}（${2}）の紐づけを解除してよいですか？"
						, [empStock.getCategory(), empStock.getMark(), empStock.getId()]);
			}else{
				if(empStock.isExistValidApply()){
					msg = '消化レコードに休暇申請が紐づいているため、勤務表で休暇申請を取り消してください';
					(new DialogMsg()).show(msg, true).then(function(){},function(){});
					return;
				}
				msg = str.substitute("${0} ${1}（${2}）を削除してよいですか？"
						, [empStock.getCategory(), empStock.getMark(), empStock.getId()]);
			}
			(new DialogMsg()).show(msg).then(
				lang.hitch(this, function(){
					this.doDeleteStock(empStock);
				}),
				lang.hitch(this, function(errmsg){
				})
			);
		},
		// 積休レコード削除実行
		doDeleteStock: function(empStock){
			var operateType = '';
			if(empStock.isSolo()){
				operateType = 'delete';
			}else if(empStock.isProvide()){
				operateType = 'deleteChild';
			}else if(empStock.isSpend()){
				operateType = 'deleteParent';
			}else{
				return;
			}
			Wait.show(true);
			var req = {
				action: 'operateEmpStock',
				empId: this.currentEmp.getId(),
				manageName: this.currentManageName,
				operateType: operateType,
				empStockId: empStock.getId()
			};
			Request.actionA(
				tsCONST.API_GET_EXT_RESULT,
				req,
				true
			).then(
				lang.hitch(this, function(result){
					this.loadEmpStocks();
				}),
				lang.hitch(this, function(result){
					this.showError(result);
				})
			);
		},
		// 付与ダイアログ
		showProvideDialog : function(empStock){
			this.showError();
			this.dialogProvide = new DialogProvide();
			this.dialogProvide.show(this.currentEmp, this.currentManageName, empStock).then(
				lang.hitch(this, function(){
					this.loadEmpStocks();
				}),
				lang.hitch(this, function(errmsg){
					this.dialogProvide.hide();
					this.showError(errmsg);
				})
			);
		},
		// マイナス付与ダイアログ
		showMinusDialog : function(empStock){
			this.showError();
			this.dialogMinus = new DialogMinus();
			this.dialogMinus.show(this.currentEmp, this.currentManageName, this.currentEmp.getEmpStocks()).then(
				lang.hitch(this, function(){
					this.loadEmpStocks();
				}),
				lang.hitch(this, function(errmsg){
					this.dialogMinus.hide();
					this.showError(errmsg);
				})
			);
		},
		// 消化ダイアログ
		showSpendDialog : function(empStock){
			var td = moment(dom.byId('leaveTargetDate').value, 'YYYY/MM/DD');
			this.showError();
			this.dialogSpend = new DialogSpend(td.isValid() ? td.format('YYYY/MM/DD') : null);
			this.dialogSpend.show(this.currentEmp, this.currentManageName, empStock).then(
				lang.hitch(this, function(){
					this.loadEmpStocks();
				}),
				lang.hitch(this, function(errmsg){
					this.dialogSpend.hide();
					this.showError(errmsg);
				})
			);
		},
		// 残日数の基準日変更
		changedTargetDate : function(){
			var td = moment(dom.byId('leaveTargetDate').value, 'YYYY/MM/DD');
			var remainDays = {};
			if(td.isValid() && this.currentEmp){
				remainDays = this.currentEmp.getRemainDaysByDate(td.format('YYYY-MM-DD'), this.getStepValue());
			}
			if(remainDays.disp){
				var msg = '';
				if(remainDays.baseTime){
					msg = 'の基準時間=' + Util.formatTime(remainDays.baseTime);
				}
				var raw = remainDays.raw5 + '日';
				dom.byId('leaveRemainDays').innerHTML = msg + ' 残日数=' + raw + (raw != remainDays.disp ? '=' + remainDays.disp : '');
			}else{
				dom.byId('leaveRemainDays').innerHTML = '-';
			}
		},
		// ダウンロード
		downloadTable: function(){
			this.download(this.createCsv());
		},
		download: function(param){
			var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
			var blob = new Blob([bom, (param.heads ? (param.heads + '\r\n') : '') + param.value], { "type" : "text/csv" });
			if(window.navigator.msSaveBlob){
				// IEなら独自関数を使います。
				window.navigator.msSaveBlob(blob, param.fname);
			} else {
				// それ以外はaタグを利用してイベントを発火させます
				var a = dom.byId('leaveDownloadLink');
				a.href = URL.createObjectURL(blob);
				a.download = param.fname;
				a.target = '_blank';
				a.click();
				setTimeout(function(){
					URL.revokeObjectURL(a.href);
				}, 3000);
			}
		}
	});
});
