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
	"dojo/_base/lang",
	"dojo/text!tsext/template/jtbCompoView.html",
	"tsext/service/Request",
	"tsext/tsjtb/JtbReserveList",
	"tsext/tsjtb/JtbActualList",
	"tsext/tsjtb/JtbInvoiceList",
	"tsext/dialog/Processing",
	"tsext/tsjtb/JtbData",
	"tsext/tsjtb/JtbAssist",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domStyle, query, on, str, lang, template, Request, JtbReserveList, JtbActualList, JtbInvoiceList, Processing, JtbData, JtbAssist, Util) {
	return declare("tsext.view.JtbCompoView", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(){
		},
		placeAt: function(){
			this.inherited(arguments);
			this.startup();
		},
		startup: function(){
			this.inherited(arguments);
			this.own(
				on(query('input[type="button"].tsext-jtb-save'    , this.domNode)[0], 'click', lang.hitch(this, this.onSave)),         // 保存
				on(query('input[type="button"].tsext-jtb-actual'  , this.domNode)[0], 'click', lang.hitch(this, this.onCreateActual)), // 実績データ生成
				on(query('input[type="button"].tsext-jtb-invoice' , this.domNode)[0], 'click', lang.hitch(this, this.onCreateInvoice)), // 請求データ生成
				on(query('input[type="checkbox"].tsext-jtb-unlock', this.domNode)[0], 'click', lang.hitch(this, this.onUnlock)) // ロック解除
			);
			this.load();
		},
		getTravelNo : function(){
			return query('.tsext-jtb-travelNo > input[type="text"]', this.domNode)[0].value.trim();
		},
		destroy : function(){
			this.reserveList.destroy();
			this.inherited(arguments);
		},
		showMessage: function(msg) {
			var messageArea = query('#tsext-jtb-message')[0];
			messageArea.innerText = msg;
		},
		showError: function(errmsg){
			var els = query('div.tsext-error', this.domNode);
			if(els.length){
				var el = els[0];
				domConstruct.empty(el);
				domConstruct.create('div', { innerHTML: (errmsg ? 'ERROR: ' : '') + errmsg }, el);
				domStyle.set(el, 'display', (errmsg ? '' : 'none'));
			}
		},
		build: function(){
			query('.tsext-jtb-heading', this.domNode)[0].innerHTML = str.substitute('事前申請に紐づ${0}出張手配', [(JtbData.getOperationNo() ? 'く' : 'かない')]);

			query('.tsext-jtb-jsNaviId    > span:nth-child(2)', this.domNode)[0].innerHTML = JtbData.getJsNaviId();
			query('.tsext-jtb-operationNo > span:nth-child(2)', this.domNode)[0].innerHTML = JtbData.getOperationNo() || '(なし)';
			query('.tsext-jtb-travelNo   > input[type="text"]', this.domNode)[0].value = (JtbData.getTravelNo() || '');
			this.reserveList = new JtbReserveList();
			this.reserveList.setParentView(this);
			this.reserveList.placeAt(query('div.tsext-jtb-reserve-area', this.domNode)[0]);
			this.actualList  = new JtbActualList();
			this.actualList.setParentView(this);
			this.actualList.placeAt(query('div.tsext-jtb-actual-area'  , this.domNode)[0]);
			this.invoiceList = new JtbInvoiceList();
			this.invoiceList.setParentView(this);
			this.invoiceList.placeAt(query('div.tsext-jtb-invoice-area', this.domNode)[0]);

			var attachParentId = JtbData.getAttachParentId();
			var attachId = JtbData.getAttachId();
			var parentHtml = str.substitute(attachParentId ? '<a href="/${0}" target="_blank">${1}</a>' : '${1}', [attachParentId, (JtbData.getOperationNo() ? '事前申請' : '勤怠共通設定')]);
			var attachHtml = str.substitute(attachId ? '<a href="/${0}" target="_blank">${1}</a>' : '${1}', [attachId, '添付ファイル']);
			query('.tsext-jtb-attention', this.domNode)[0].innerHTML = '※データは ' + parentHtml + ' の ' + attachHtml + ' に保存されます';

			domAttr.set(query('.tsext-jtb-travelNo input', this.domNode)[0], 'disabled', true);

			domStyle.set(this.domNode, 'display', '');
			Util.fadeInOut(true, { node:this.domNode });
		},
		load: function(){
			var req = {
				method: 'loadJsNaviDummy',
				id    : JtbData.getCurrentId() || null,
				mode  : 'read'
			};
			Request.actionA(tsCONST.API_JTB_ACTION, req, true).then(
				lang.hitch(this, function(result){
					JtbData.setRecord(result);
					this.build();
				}),
				lang.hitch(this, function(errmsg){
					this.showError(errmsg);
				})
			);
		},
		onSave : function(e){
			var expPreApply = JtbData.getExpPreApply();
			var req = {
				method: 'saveJsNaviDummy',
				id    : (expPreApply && expPreApply.Id) || null,
				data: {
					reserves: [],
					actuals : [],
					invoices: []
				}
			};
			if(JtbData.getOperationNo()){
				req.data.travelNo = this.getTravelNo();
				req.data.jsNaviId = JtbData.getJsNaviId();
			}
			array.forEach(this.reserveList.getInsts(), function(inst){
				req.data.reserves.push(inst.getObj());
			});
			array.forEach(this.actualList.getInsts(), function(inst){
				req.data.actuals.push(inst.getObj());
			});
			array.forEach(this.invoiceList.getInsts(), function(inst){
				req.data.invoices.push(inst.getObj());
			});
			Request.actionA(tsCONST.API_JTB_ACTION, req, true).then(
				lang.hitch(this, function(result){
					console.log(result);
					// LEX環境の場合、window.confirm, window.alertが動作しない
					this.showMessage('保存しました');
				}),
				lang.hitch(this, function(errmsg){
					this.showError(errmsg);
				})
			);
		},
		onUnlock: function(e){
			var checked = query('input[type="checkbox"].tsext-jtb-unlock', this.domNode)[0].checked;
			JtbData.setUnlock(checked);
			domAttr.set(query('.tsext-jtb-travelNo input', this.domNode)[0], 'disabled', !checked);
		},
		onCreateActual : function(e){
			var actuals = [];
			array.forEach(this.reserveList.getInsts(), function(reserve){
				var r = reserve.getObj();
				var a = {};
				a.KGYOUCD			 = JtbData.getLocationCode();		 	// 企業コード
				a.HCCHUKINOUCD		 = this.convertFunctionCodeReserveToActual(r.KINOUCD);						 	// 発注機能コード
				a.BNO				 = '001';							 	// 枝番
				a.USERID			 = r.USERID;							// ユーザID
				a.OPERATIONNUMBER	 = JtbData.getOperationNo();			// 処理番号
				a.SUBNUMBER 		 = '00';								// 副番号
				a.RYOKOUNO			 = r.RYOKOUNO;							// 旅行番号
				a.SEQNO				 = r.SEQNO;								// SEQNO
				a.SPYMD 			 = r.SPYMD;								// 出発日
				a.TCYMD 			 = r.TCYMD;								// 到着日
				a.KG				 = r.HCCHUKG;							// 金額
				a.DATA01			 = JtbAssist.getServiceName(r.KINOUCD);	// サービス名称
				a.DATA02			 = r.KTSUKKNMEI;						// 交通機関名、宿泊施設名等
				a.DATA03			 = r.SPCHI;								// 出発地等
				a.DATA04			 = r.TCCHI;								// 到着地等
				a.DATA05			 = r.UNCHNSBTMEI;						// 運賃種別名等
				a.DATA06			 = r.AISHOUBINMEI;						// 便名、列車名等
				a.DATA07			 = r.CLSMEI;							// クラス情報等
				a.DATA08			 = r.SPTIME;							// 出発時刻等
				a.DATA09			 = r.TCTIME;							// 到着時刻等
				a.DATA10			 = r.KEYS;								// 券番等
				a.DATA11			 = r.HYOJISTS;							// ステータス
				a.DATA12			 = r.SPYMD;								// 消費税適用基準日をセット(代理店発注,GTA,Amadeusはnull)
				a.DATA13			 = r.USERID;							// 申請者ID
				a.DATA14			 = JtbData.getUserName(r.USERID);		// 出張者社員名
				a.DATA15			 = null;								//
				a.SEIKYUHSSEIYMD	 = r.SPYMD;								// 請求発生日
				a.SETSHOUKBN		 = '2';									// 精算対象区分（0:実費、1:定額支給、2:会社支給）
				a.RNKEITWSEKBN		 = '0';									// 連携問い合わせ区分
				a.RNKEITWSEYMDTIME	 = r.SPYMD + ' 14:00:00';				// 連携問い合わせ日時
				a.WSRNKEITWSEKBN	 = '1';									// WS連携問い合わせ区分
				a.WSRNKEITWSEYMDTIME = r.SPYMD + ' 14:00:00';				// WS連携問い合わせ日時
				a.SYSTEMKBN 		 = 'J';									// システム区分
				a.WFKNRENFLG		 = '0';									// WF申請書関連フラグ
				a.PAYNY 			 = r.BIKOU;								// 支払内容
				a.SKSEIYMDTIME		 = r.SPYMD + ' 14:00:00';				// 作成日時
				a.KSHNYMDTIME		 = r.SPYMD + ' 14:00:00';				// 更新日時
				a.CCCD				 = null;								// 所属個所コード
				actuals.push(a);
			}, this);
			JtbData.setRawActuals(actuals);
			this.actualList.refresh();
			this.showMessage('実績データをクリアして、予約データから実績データを生成しました');
		},
		onCreateInvoice : function(e){
			var invoices = [];
			array.forEach(this.actualList.getInsts(), function(actual){
				var a = actual.getObj();
				var type = JtbAssist.getFunctionCodeType(a.HCCHUKINOUCD);
				var stayCount = (type == 2 ? '' + Util.getNights(a.SPYMD, a.TCYMD) : null);
				var roomCount = (type == 2 ? a.DATA08 : null);
				var yearMonth = Util.getYearMonth(a.SPYMD);
				var i = {};
				i.functionId		 = this.convertFunctionCodeActualToInvoice(a.HCCHUKINOUCD);						// 予約機能ID
				i.startDate			 = a.SPYMD;								// 出発日
				i.endDate			 = a.TCYMD;								// 帰着日
				i.useDate			 = a.SPYMD;								// 搭乗日_利用日
				i.invoiceAmount		 = a.KG;								// 請求予定金額
				i.startPlace		 = a.DATA03;							// 出発地
				i.endPlace			 = a.DATA04;							// 到着地
				i.flightName		 = a.DATA06;							// 便名列車名
				i.planName			 = a.DATA05;							// 運賃種別_プラン名
				i.status			 = a.DATA11;							// ステータス
				i.ticketNo			 = a.DATA10;							// 券番
				i.useName			 = a.DATA02;							// 利用先名称
				i.stayCount			 = stayCount;							// 泊数
				i.roomCount			 = roomCount;							// 部屋数
				i.note				 = a.PAYNY;								// 行先及び備考
				i.reserve04			 = a.DATA12;							// 予備項目04
				i.operationNo		 = a.OPERATIONNUMBER;					// 処理番号
				i.travelNo			 = a.RYOKOUNO;							// 旅行番号
				i.subNo				 = a.SUBNUMBER;							// 副番号
				i.locationCode		 = JtbData.getLocationCode();			// 企業コード
				i.locationName		 = null;								// 企業名
				i.yearMonth			 = '' + yearMonth;						// 請求対象月
				i.deptCode			 = null;								// 部署コード
				i.deptName			 = null;								// 部署名
				i.currentDeptCode	 = null;								// 現在部署コード
				i.currentDeptName	 = null;								// 現在部署名
				i.userId			 = a.DATA13;							// 出張者ユーザーID
				i.applyUserId		 = a.DATA13;							// 申請者ユーザーID
				i.userName			 = a.DATA14;							// 出張者社員名称
				i.jrexUseAmount		 = null;							 	// JREX利用金額
				i.jrexBackAmount	 = null;							 	// JREX還元額
				i.applyDateTime		 = null;							 	// 申込操作時間
				invoices.push(i);
			}, this);
			JtbData.setRawInvoices(invoices);
			this.invoiceList.refresh();
			this.showMessage('請求データをクリアして、実績データから請求データを生成しました');
		},
		convertFunctionCodeReserveToActual: function(functionCode) {
			if(['DA', 'DB', 'DC', 'DD'].indexOf(functionCode) >= 0) {
				return 'DT';
			} else if(['AA', 'AB', 'AC', 'AD'].indexOf(functionCode) >= 0) {
				return 'AD';
			} else if(['RA', 'RB', 'RC', 'RD'].indexOf(functionCode) >= 0) {
				return 'DP';
			} else {
				return functionCode;
			}
		},
		convertFunctionCodeActualToInvoice: function(functionCode) {
			switch(functionCode) {
				case 'DT':
					return 'ZZ';
				default:
					return functionCode;
			}
		}
	});
});
