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
	"dojo/text!tsext/template/jtbReserveList.html",
	"tsext/service/Request",
	"tsext/tsjtb/JtbObjList",
	"tsext/tsjtb/JtbReserve",
	"tsext/tsjtb/JtbReserveForm",
	"tsext/dialog/Processing",
	"tsext/tsjtb/JtbData",
	"tsext/util/Util"
], function(declare, json, array, dom, domConstruct, domAttr, domStyle, query, on, str, lang, template, Request, JtbObjList, JtbReserve, JtbReserveForm, Processing, JtbData, Util) {
	return declare("tsext.tsjtb.JtbReserveList", [JtbObjList], {
		templateString: template,
		startup: function(){
			this.setInsts(JtbData.getReserves());
			this.form = new JtbReserveForm();
			this.inherited(arguments);
		},
		getDataType: function(){
			return '予約';
		},
		onInsert: function(){
			// 予約追加
			var obj = {
				KINOUCD        : 'JL',
				OPERATIONNUMBER: JtbData.getOperationNo(),
				RYOKOUNO       : (this.getTravelNo() || ''),
				SUBNUMBER      : '00',
				SPYMD          : Util.formatDate(JtbData.getStartDate(), 'YYYY/MM/DD'),
				HYOJISTS       : 'E発券',
				SEQNO          : moment().format('YYMMDDHHmmss'),
				USERID         : JtbData.getJsNaviId()
			};
			obj.KEYS = obj.SEQNO;
			obj.TCYMD = obj.SPYMD;
			this.form.show(new JtbReserve(obj)).then(
				lang.hitch(this, function(inst){
					this.addInst(inst);
					this.buildList();
				})
			);
		},
		openEdit: function(index){
			// 予約編集
			this.form.show(this.getInst(index)).then(
				lang.hitch(this, function(){
					this.buildList();
				})
			);
		},
		copyInst: function(index){
			// 予約のコピー(override)
			var inst = this.insts[index].clone();
			inst.set('SEQNO', moment().format('YYMMDDHHmmss'));
			inst.set('KEYS', moment().format('YYMMDDHHmmss'));
			this.insts.push(inst);
		},
		buildList: function(){
			this.inherited(arguments);
			dom.byId('tsext-jtb-reserve-count').textContent = (this.insts.length || "0") + '件';
		},
		appendObjDivs: function(inst, node){
			domConstruct.create('div', { innerHTML:'機能コード: '		+ inst.get('KINOUCD')    }, node);
			domConstruct.create('div', { innerHTML:'出発日: '			+ inst.get('SPYMD')      }, node);
			domConstruct.create('div', { innerHTML:'到着日: '			+ inst.get('TCYMD')      }, node);
			domConstruct.create('div', { innerHTML:'交通機関名: '		+ inst.get('KTSUKKNMEI') }, node);
			domConstruct.create('div', { innerHTML:'出発地: '			+ inst.get('SPCHI')      }, node);
			domConstruct.create('div', { innerHTML:'到着地: '			+ inst.get('TCCHI')      }, node);
			domConstruct.create('div', { innerHTML:'金額: '				+ inst.get('HCCHUKG')    }, node);
			domConstruct.create('div', { innerHTML:'表示ステータス: '	+ inst.get('HYOJISTS')   }, node);
			domConstruct.create('div', { innerHTML:'SEQNO: '			+ inst.get('SEQNO')      }, node);
		}
	});
});
