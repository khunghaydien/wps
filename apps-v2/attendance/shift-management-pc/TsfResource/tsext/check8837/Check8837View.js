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
	"dojo/text!tsext/check8837/Check8837View.html",
	"tsext/service/Request",
	"tsext/dialog/Wait",
	"tsext/dialog/Confirm",
	"tsext/check8837/Emps",
	"tsext/service/Agent",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domStyle, query, on, str, Deferred, lang, template, Request, Wait, Confirm, Emps, Agent, Util) {
	return declare("tsext.check8837.Check8837View", [_WidgetBase, _TemplatedMixin], {
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
			Wait.show(false);
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
		// 全勤務体系CSV、全勤怠社員CSVを出力
		isDetail: function(){
			return /^detail$/i.test(this.hash);
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
					Wait.show(true);
					this.showSystemAdmin(false);
					this.fetchEmps();
				})
			);
		},
		fetchEmps: function(){
			this.emps.fetch().then(
				lang.hitch(this, function(){
					this.emps.reset();
					var param = { normal: !this.isDetail() };
					this.fetchEmpMonths(param);
				}),
				lang.hitch(this, this.showError)
			);
		},
		// AtkEmpMonth__c を取得
		fetchEmpMonths: function(param){
			this.emps.fetchEmpMonths(param).then(
				lang.hitch(this, function(param){
					this.showResult(param);
					Wait.show(false);
				}),
				lang.hitch(this, this.showError)
			);
		},
		showResult: function(param){
			this.removeHandles();
			var lines = this.emps.getErrorLines(param);
			if(lines.length > 0){
				this.showFinish(false);
				this.setErrorFileLink(lines);
			}else{
				this.showFinish(true);
			}
		},
		setErrorFileLink: function(lines){
			var atag = query('div.tsext-check-ngmsg a.tsext-check-link')[0];
			this.setLink(atag, null, '不具合影響リスト.csv', this.emps.getEmpResultCsv(lines));
		},
		setLink: function(atag, area, fname, contents){
			if((window.navigator.msSaveBlob || dojo.isChrome || dojo.isFF) && typeof(Blob) !== "undefined"){
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
