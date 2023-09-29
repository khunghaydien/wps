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
	"dojo/text!tsext/check9173/Check9173View.html",
	"tsext/service/Request",
	"tsext/dialog/Confirm",
	"tsext/check9173/Emps",
	"tsext/check9173/WaitProgress",
	"tsext/service/Agent",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domStyle, query, on, str, Deferred, lang, template, Request, Confirm, Emps, WaitProgress, Agent, Util) {
	return declare("tsext.check9173.Check9173View", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(){
			this.emps = new Emps();
			this.hash = Agent.getLocationHash(true);
			this.linkEventHandles = [];
		},
		placeAt: function(){
			this.inherited(arguments);
			this.startup();
		},
		startup: function(){
			this.inherited(arguments);
			this.showSystemAdmin(false);
			this.own(
				// 検査開始
				on(this.getBeginInspection(), 'click', lang.hitch(this, function(e){
					this.beginInspection();
				})),
				on(this.getSystemAdminLink(), 'click', lang.hitch(this, function(e){
					this.showSystemAdmin();
				})),
				on(dom.byId('tsextCheckImgSystemAdmin'), 'click', lang.hitch(this, function(e){
					this.showSystemAdmin(false);
				}))
			);
		},
		destroy : function(){
			this.inherited(arguments);
			this.removeHandles();
		},
		showWait : function(flag, msg, n1, n2, n3){
			WaitProgress.show(flag, msg);
			if(flag){
				if(n1){ WaitProgress.setProgressVal1(n1); }
				if(n2){ WaitProgress.setProgressVal2(n2); }
			}
		},
		//
		removeHandles: function(){
			array.forEach(this.linkEventHandles || [], function(handle){
				handle.remove();
			});
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
			WaitProgress.show(false);
		},
		// システム管理者説明を表示
		showSystemAdmin: function(flag){
			if(flag === undefined){
				this.imgOn = !this.imgOn;
			}else{
				this.imgOn = flag;
			}
			domStyle.set('tsextCheckImgSystemAdmin', 'display', '');
			if(this.imgOn){
				domStyle.set('tsextCheckImgSystemAdmin', 'height', '913px');
			}else{
				setTimeout(function(){
					domStyle.set('tsextCheckImgSystemAdmin', 'height', '10px');
				}, 500);
			}
			Util.fadeInOut(this.imgOn, { node:'tsextCheckImgSystemAdmin' });
		},
		// 保存ボタン
		getBeginInspection : function(){
			return query('input[type="button"].tsext-check-begin', this.domNode)[0];
		},
		// システム管理者説明リンク
		getSystemAdminLink : function(){
			return query('a.tsext-admin-user', this.domNode);
		},
		//
		showFinish: function(flag){
			query('div.tsext-check-topmsg', this.domNode).forEach(function(el){
				domStyle.set(el, 'color', '#ccc');
			}, this);
			query('div.tsext-check-initmsg', this.domNode).forEach(function(el){
				domStyle.set(el, 'display', 'none');
			}, this);
			query('div.tsext-check-okmsg', this.domNode).forEach(function(el){
				domStyle.set(el, 'display', (flag ? '' : 'none'));
			}, this);
			query('div.tsext-check-ngmsg', this.domNode).forEach(function(el){
				domStyle.set(el, 'display', (flag ? 'none' : ''));
			}, this);
			domAttr.set(this.getBeginInspection(), 'disabled', true);
		},
		// 検査開始
		beginInspection: function(){
			if(!Agent.isSystemAdmin() && !this.isDetail()){
				this.showSystemAdmin(false);
				this.showError('システム管理者の方でなければ実行できません');
				return;
			}
			(new Confirm({
				title:'確認',
				message:'診断ツールを実行します。よろしいですか？'
			})).show().then(
				lang.hitch(this, function(){
					WaitProgress.show(true);
					this.startTime = new Date();
					this.showSystemAdmin(false);
					this.fetchEmps();
				})
			);
		},
		// モード
		// false:通常、true:詳細、詳細はCSV出力に日次情報を含める
		// 引数の"#" の後が "detail" なら詳細モード（例: /AtkConfigEditView?check=9173#!detail）
		isDetail: function(){
			return /^detail$/i.test(this.hash);
		},
		// 社員を取得
		fetchEmps: function(){
			this.emps.fetch().then(
				lang.hitch(this, function(){
					this.emps.reset();
					// 実行オプションのセット
					var param = { normal: !this.isDetail() };
					var args = Agent.getArgs();
					if(args.startym){
						// 引数に"startYm=yyyymm"が指定されていたら（例：/AtkConfigEditView?check=9173&startYm=201901#!check）
						// その月度以降を診断する。省略時は 201904
						param.startYm = args.startym;
					}
					if(args.endym){
						// 引数に"endYm=yyyymm"が指定されていたら（例：/AtkConfigEditView?check=9173&endYm=201906#!check）
						// その月度までを診断する。省略時はなし
						param.endYm = args.endym;
					}
					if(args.hasOwnProperty('unsettled')){
						// 引数に"unsettled"が指定されていたら（例：/AtkConfigEditView?check=9173&unsettled#!check）
						// 未確定の月度も診断対象に含める
						param.unsettled = true;
					}
					if(args.hasOwnProperty('notbug')){
						// 引数に"notbug"が指定されていたら（例：/AtkConfigEditView?check=9173&unsettled#!check）
						// 診断対象となった月はすべて出力する
						param.notbug = true;
					}
					this.fetchEmpMonths(param);
				}),
				lang.hitch(this, this.showError)
			);
		},
		// 勤怠月次を取得
		fetchEmpMonths: function(param){
			this.emps.fetchEmpMonths(param).then(
				lang.hitch(this, function(param){
					this.loadEmpMonthPrint(param);
				}),
				lang.hitch(this, this.showError)
			);
		},
		// 月次サマリーデータを取得
		loadEmpMonthPrint: function(param){
			this.emps.loadEmpMonthPrintLoop(param).then(
				lang.hitch(this, function(param){
					this.showResult(param);
					WaitProgress.show(false);
				}),
				lang.hitch(this, this.showError)
			);
		},
		// 結果を出力
		showResult: function(param){
			this.removeHandles();
			var lines = this.emps.getErrorLines(param);
			if(lines.length > 0){
				this.showFinish(false);
				this.setErrorFileLink(param, lines);
			}else{
				this.showFinish(true);
			}
			this.setMeasurement(param);
		},
		setMeasurement: function(param){
			this.endTime = new Date();
			var st = moment(this.startTime);
			var et = moment(this.endTime);
			var sec = et.diff(st, 'seconds');
			var h = (sec >= 3600 ? Math.floor(sec / 3600) : 0);
			var m = (sec >= 60 ? Math.floor((sec % 3600) / 60) : 0);
			var s = sec % 60;
			var lst = [];
			if(param.stopped){
				lst.push('(中止)');
			}
			lst.push('診断対象月数 = ' + param.targetSize + '件');
			lst.push('診断件数 = ' + this.emps.getDoneCount() + '件');
			lst.push('不正件数 = ' + this.emps.getNgCount() + '件');
			lst.push('開始時刻 = ' + st.format('YYYY/MM/DD HH:mm:ss'));
			lst.push('終了時刻 = ' + et.format('YYYY/MM/DD HH:mm:ss'));
			lst.push('所要時間 = ' + (h ? h + '時間' : '') + (m ? m + '分' : '') + s + '秒');
			if(this.emps.getDoneCount() > 0){
				lst.push('1件あたり平均 = ' + (sec / this.emps.getDoneCount()).toFixed(2) + '秒');
			}
			for(var i = 0 ; i < lst.length ; i++){
				console.log(lst[i]);
			}
			query('div.tsext-measurement', this.domNode).forEach(function(el){
				el.innerHTML = lst.join('<br/>');
			}, this);
		},
		setErrorFileLink: function(param, lines){
			var atag = query('div.tsext-check-ngmsg a.tsext-check-link')[0];
			this.setLink(atag, null, '不具合影響リスト.csv', this.emps.getEmpResultCsv(param, lines));
		},
		setLink: function(atag, area, fname, contents){
			if(typeof(Blob) !== "undefined"){
				var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
				var blob = new Blob([bom, contents], { "type" : "text/csv" });
				if(window.navigator.msSaveBlob){
					if(atag){
						this.linkEventHandles.push(on(atag, 'click', lang.hitch(this, function(e){
							window.navigator.msSaveBlob(blob, fname);
						})));
					}else if(area){
						var a = domConstruct.create('a', {
							innerHTML: fname,
							target: '_blank'
						}, domConstruct.create('div', null, area));
						this.linkEventHandles.push(on(a, 'click', lang.hitch(this, function(e){
							window.navigator.msSaveBlob(blob, fname);
						})));
					}
				}else{
					var url = (window.URL || window.webkitURL).createObjectURL(blob);
					if(atag){
						domAttr.set(atag, 'download', fname);
						domAttr.set(atag, 'href', url);
					}else if(area){
						domConstruct.create('a', {
							href: url,
							download: fname,
							innerHTML: fname,
							target: '_blank'
						}, domConstruct.create('div', null, area));
					}
				}
			}
		}
	});
});
