define([
	"dojo/_base/declare",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/query",
	"dojo/on",
	"dojo/string",
	"dojo/_base/lang",
	"dojo/text!tsext/template/jtbActualList.html",
	"tsext/service/Request",
	"tsext/tsjtb/JtbObjList",
	"tsext/tsjtb/JtbActual",
	"tsext/tsjtb/JtbActualForm",
	"tsext/dialog/Processing",
	"tsext/tsjtb/JtbData",
	"tsext/util/Util"
], function(declare, json, array, dom, domConstruct, domAttr, domStyle, query, on, str, lang, template, Request, JtbObjList, JtbActual, JtbActualForm, Processing, JtbData, Util) {
	return declare("tsext.tsjtb.JtbActualList", [JtbObjList], {
		templateString: template,
		startup: function(){
			this.setInsts(JtbData.getActuals());
			this.form = new JtbActualForm();
			this.inherited(arguments);
		},
		getDataType: function(){
			return '実績';
		},
		onInsert: function(){
			// 実績追加
			var obj = {
				HCCHUKINOUCD		: 'JL',
				SPYMD				: Util.formatDate(JtbData.getStartDate(), 'YYYY/MM/DD'),
				KGYOUCD				: JtbData.getLocationCode(),		 	// 企業コード
				BNO					: '001',							 	// 枝番
				USERID				: JtbData.getJsNaviId(),				// ユーザID
				OPERATIONNUMBER		: JtbData.getOperationNo(),				// 処理番号
				SUBNUMBER 			: '00',									// 副番号
				SEQNO				: moment().format('YYMMDDHHmmss'),		// SEQNO
				RYOKOUNO			: this.getTravelNo(),					// 旅行番号
				DATA10			: moment().format('YYMMDDHHmmss'), // 券番 or 予約番号 or 納品書番号＋税区分等
				DATA11				: 'E発券',								// ステータス
				DATA13				: JtbData.getJsNaviId(),				// 申請者ID
				DATA14				: JtbData.getEmpName(),					// 出張者社員名
				SETSHOUKBN			: '2',									// 精算対象区分（0:実費、1:定額支給、2:会社支給）
				RNKEITWSEKBN		: '0',									// 連携問い合わせ区分
				WSRNKEITWSEKBN		: '1',									// WS連携問い合わせ区分
				SYSTEMKBN 			: 'J',									// システム区分
				WFKNRENFLG			: '0',									// WF申請書関連フラグ
				CCCD				: null									// 所属個所コード
			};
			obj.TCYMD				= obj.SPYMD;							// 到着日
			obj.DATA12				= obj.SPYMD;							// 消費税適用基準日をセット(代理店発注,GTA,Amadeusはnull)
			obj.SEIKYUHSSEIYMD		= obj.SPYMD;							// 請求発生日
			if(obj.SPYMD){
				obj.RNKEITWSEYMDTIME	= obj.SPYMD + ' 14:00:00';				// 連携問い合わせ日時
				obj.WSRNKEITWSEYMDTIME	= obj.SPYMD + ' 14:00:00';				// WS連携問い合わせ日時
				obj.SKSEIYMDTIME		= obj.SPYMD + ' 14:00:00';				// 作成日時
				obj.KSHNYMDTIME			= obj.SPYMD + ' 14:00:00';				// 更新日時
			}
			this.form.show(new JtbActual(obj)).then(
				lang.hitch(this, function(inst){
					this.addInst(inst);
					this.buildList();
				})
			);
		},
		openEdit: function(index){
			// 実績編集
			this.form.show(this.getInst(index)).then(
				lang.hitch(this, function(){
					this.buildList();
				})
			);
		},
		copyInst: function(index){
			// 実績のコピー(override)
			var inst = this.insts[index].clone();
			inst.set('SEQNO', moment().format('YYMMDDHHmmss'));
			inst.set('DATA10', moment().format('YYMMDDHHmmss'));
			this.insts.push(inst);
		},
		refresh: function(){
			this.setInsts(JtbData.getActuals());
			this.buildList();
		},
		buildList: function() {
			this.inherited(arguments);
			dom.byId('tsext-jtb-actual-count').textContent = (this.insts.length || "0") + '件';
		},
		appendObjDivs: function(inst, node){
			domConstruct.create('div', { innerHTML:'発注機能コード: '	+ inst.get('HCCHUKINOUCD') }, node);
			domConstruct.create('div', { innerHTML:'出発日: '			+ inst.get('SPYMD')        }, node);
			domConstruct.create('div', { innerHTML:'到着日: '			+ inst.get('TCYMD')        }, node);
			domConstruct.create('div', { innerHTML:'個別設定02: '		+ inst.get('DATA02')       }, node);
			domConstruct.create('div', { innerHTML:'個別設定03: '		+ inst.get('DATA03')       }, node);
			domConstruct.create('div', { innerHTML:'個別設定04: '		+ inst.get('DATA04')       }, node);
			domConstruct.create('div', { innerHTML:'金額: '				+ inst.get('KG')           }, node);
			domConstruct.create('div', { innerHTML:'個別設定11: '		+ inst.get('DATA11')       }, node);
			domConstruct.create('div', { innerHTML:'SEQNO: '			+ inst.get('SEQNO')        }, node);
		}
	});
});
