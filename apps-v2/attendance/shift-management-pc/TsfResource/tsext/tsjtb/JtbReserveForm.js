define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/string",
	"dojo/query",
	"dojo/on",
	"dojo/Deferred",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dijit/Dialog",
	"dojo/text!tsext/template/jtbReserveForm.html",
	"tsext/tsjtb/JtbObjForm",
	"tsext/tsjtb/JtbData",
	"tsext/tsjtb/JtbAssist",
	"tsext/tsjtb/JtbReserve",
	"tsext/dialog/Calendar",
	"tsext/dialog/Selector",
	"tsext/util/Util"
], function(declare, lang, json, array, str, query, on, Deferred, domConstruct, domAttr, domClass, domStyle, Dialog, template, JtbObjForm, JtbData, JtbAssist, JtbReserve, Calendar, Selector, Util) {
	return declare("tsext.tsjtb.JtbReserveForm", [JtbObjForm], {
		constructor: function(){
			this.oldFc = null;
			this.inputMap = {
				'OPERATIONNUMBER' : '.tsext-jtb-operationnumber input',
				'RYOKOUNO'        : '.tsext-jtb-ryokouno input',
				'SUBNUMBER'       : '.tsext-jtb-subnumber input',
				'KEYS'            : '.tsext-jtb-keys input',
				'KINOUCD'         : '.tsext-jtb-kinoucd input',
				'SPYMD'           : '.tsext-jtb-spymd input.tsext-jtb-date',
				'TCYMD'           : '.tsext-jtb-tcymd input.tsext-jtb-date',
				'SPTIME'          : '.tsext-jtb-spymd input.tsext-jtb-time',
				'TCTIME'          : '.tsext-jtb-tcymd input.tsext-jtb-time',
				'KTSUKKNMEI'      : '.tsext-jtb-ktsukknmei input',
				'SPCHI'           : '.tsext-jtb-spchi input',
				'TCCHI'           : '.tsext-jtb-tcchi input',
				'AISHOUBINMEI'    : '.tsext-jtb-aishoubinmei input',
				'CLSMEI'          : '.tsext-jtb-clsmei input',
				'UNCHNSBTMEI'     : '.tsext-jtb-unchnsbtmei input',
				'HCCHUKG'         : '.tsext-jtb-hcchukg input',
				'HYOJISTS'        : '.tsext-jtb-hyojists input',
				'BIKOU'           : '.tsext-jtb-bikou input',
				'SEQNO'           : '.tsext-jtb-seqno input', // SEQNOは元の予約データにはないが疑似データ用に必要
				'USERID'          : '.tsext-jtb-userId input'
			};
		},
		getTitle: function(){
			return "出張手配予約";
		},
		getContent: function(){
			return template;
		},
		setEventHandler: function(){
			this.dialog.own(
				on(query('.tsext-jtb-type select', this.dialog.domNode)[0], 'change', lang.hitch(this, this.changedFunction))
			);
			query('.tsext-jtb-kinoucd input[type="text"]', this.dialog.domNode).forEach(function(el){
				this.dialog.own(
					on(el, 'keyup', lang.hitch(this, function(e){
						e.target.value = e.target.value.toUpperCase();
						this.changedFunction();
					}))
				);
			}, this);
			query('.tsext-jtb-kinoucd input'
				+ ',.tsext-jtb-ktsukknmei input'
				+ ',.tsext-jtb-spchi input'
				+ ',.tsext-jtb-tcchi input'
				+ ',.tsext-jtb-aishoubinmei input'
				+ ',.tsext-jtb-clsmei input'
				+ ',.tsext-jtb-unchnsbtmei input'
				+ ',.tsext-jtb-hyojists input'
				+ ',.tsext-jtb-userId input'
				+ ',input[type="text"].tsext-jtb-time'
				+ ',input[type="text"].tsext-jtb-amount'
				+ ',input[type="text"].tsext-jtb-number'
			, this.dialog.domNode).forEach(function(el){
				this.dialog.own(
					on(el, 'click'   , lang.hitch(this, this.setSelector)),
					on(el, 'selector', lang.hitch(this, this.onSelected))
				);
			}, this);
		},
		show: function(inst) {
			this.inst = inst;
			return this.inherited(arguments);
		},
		onSelected: function(e){
			var row = Util.getAncestorByTagName(e.target, 'TR');
			if(domClass.contains(row, 'tsext-jtb-kinoucd')){
				this.changedFunction();
			}else if(domClass.contains(e.target, 'tsext-jtb-time')){
				this.blurTime(e);
			}
			query('.tsext-jtb-bikou input')[0].value = this.buildBiko();
		},
		buildBiko: function() {
			var contents = [];
			query('.tsext-jtb-kinoucd input'
				+ ',.tsext-jtb-ktsukknmei input'
				+ ',.tsext-jtb-spchi input'
				+ ',.tsext-jtb-tcchi input'
				+ ',.tsext-jtb-aishoubinmei input'
				+ ',.tsext-jtb-clsmei input'
				+ ',.tsext-jtb-unchnsbtmei input'
				+ ',input[type="text"].tsext-jtb-time'
			, this.dialog.domNode).forEach(function(el){
				contents.push(el.value || '');
			});
			return contents.join(' ');
		},
		getSelectContents: function(node){
			if(domClass.contains(node, 'tsext-jtb-time')){			return JtbAssist.getTimeValues();
			}else if(domClass.contains(node, 'tsext-jtb-amount')){	return JtbAssist.getAmountValues();
			}else if(domClass.contains(node, 'tsext-jtb-number')){	return JtbAssist.getNumberValues();
			}
			var row = Util.getAncestorByTagName(node, 'TR');
			var fc = query('.tsext-jtb-kinoucd input', this.dialog.domNode)[0].value;
			if(domClass.contains(row, 'tsext-jtb-kinoucd')){				return JtbAssist.getFunctionCodeValues('reserve');
			}else if(domClass.contains(row, 'tsext-jtb-ktsukknmei')){		return JtbAssist.getTransportNameValues(fc);
			}else if(domClass.contains(row, 'tsext-jtb-spchi')
				  || domClass.contains(row, 'tsext-jtb-tcchi')){			return JtbAssist.getPlaceValues(fc);
			}else if(domClass.contains(row, 'tsext-jtb-aishoubinmei')){		return JtbAssist.getFlightNameValues(fc);
			}else if(domClass.contains(row, 'tsext-jtb-clsmei')){			return JtbAssist.getClassNameValues(fc);
			}else if(domClass.contains(row, 'tsext-jtb-unchnsbtmei')){		return JtbAssist.getFareTypeValues(fc);
			}else if(domClass.contains(row, 'tsext-jtb-hyojists')){			return JtbAssist.getDisplayStatusValues(fc);
			}else if(domClass.contains(row, 'tsext-jtb-userId')){			return JtbData.getJsNaviIdValues(fc);
			}
			return [];
		},
		blurDate: function(e){
			this.showError();
			if(e && e.target && e.target.value){
				e.target.value = Util.formatDate(e.target.value, 'YYYY/MM/DD') || '';
				var tr = Util.getAncestorByTagName(e.target, 'TR');
				if(tr && domClass.contains(tr, 'tsext-jtb-spymd')){
					var edNode = query('.tsext-jtb-tcymd input.tsext-jtb-date', this.dialog.domNode)[0];
					if(!edNode.value || edNode.value < e.target.value){
						edNode.value = e.target.value;
					}
				}else if(tr && domClass.contains(tr, 'tsext-jtb-tcymd')){
					var sdNode = query('.tsext-jtb-spymd input.tsext-jtb-date', this.dialog.domNode)[0];
					if(!sdNode.value || sdNode.value > e.target.value){
						sdNode.value = e.target.value;
					}
				}
			}
		},
		blurTime: function(e){
			this.showError();
			if(e && e.target && e.target.value){
				e.target.value = Util.formatHour(e.target.value) || '';
				var ohm = Util.str2minutes(e.target.value);
				var tr = Util.getAncestorByTagName(e.target, 'TR');
				var sdNode = query('.tsext-jtb-spymd input.tsext-jtb-date', this.dialog.domNode)[0];
				var edNode = query('.tsext-jtb-tcymd input.tsext-jtb-date', this.dialog.domNode)[0];
				if(sdNode.value && edNode.value && sdNode.value == edNode.value){
					if(tr && domClass.contains(tr, 'tsext-jtb-spymd')){
						var etNode = query('.tsext-jtb-tcymd input.tsext-jtb-time', this.dialog.domNode)[0];
						var hm = (etNode.value ? Util.str2minutes(etNode.value) : null);
						if(hm === null || hm < ohm){
							etNode.value = Util.formatTime(ohm + 120);
						}
					}else if(tr && domClass.contains(tr, 'tsext-jtb-tcymd')){
						var stNode = query('.tsext-jtb-spymd input.tsext-jtb-time', this.dialog.domNode)[0];
						var hm = (stNode.value ? Util.str2minutes(stNode.value) : null);
						if(hm === null || hm > ohm){
							stNode.value = Util.formatTime(Math.max(0, ohm - 120));
						}
					}
				}
			}
		},
		changedFunction: function(){
			var fc = query('.tsext-jtb-kinoucd input', this.dialog.domNode)[0].value.trim() || null;
			var fcType = JtbAssist.getFunctionCodeType(fc);
			var fcTypeSelect = query('.tsext-jtb-type select', this.dialog.domNode)[0];
			if(!fcType){
				fcType = parseInt(fcTypeSelect.value, 10);
				domAttr.set(fcTypeSelect, 'disabled', false);
			}else{
				fcTypeSelect.value = '' + fcType;
				domAttr.set(fcTypeSelect, 'disabled', true);
			}
			var labelMap = {
				'.tsext-jtb-spymd > td:first-child'       : ['出発日'    , 'チェックイン日'  , '配車日'          , ''    ],
				'.tsext-jtb-tcymd > td:first-child'       : ['到着日'    , 'チェックアウト日', '返車日'          , ''    ],
				'.tsext-jtb-spymd .tsext-jtb-rightcol'    : ['出発時間'  , '室数'            , '配車時間'        , ''    ],
				'.tsext-jtb-tcymd .tsext-jtb-rightcol'    : ['到着時間'  , '人数'            , '返車時間'        , ''    ],
				'.tsext-jtb-ktsukknmei   > td:first-child': ['交通機関名', '宿泊施設名'      , 'レンタカー会社名', '内容'],
				'.tsext-jtb-spchi        > td:first-child': ['出発地'    , '都市名'          , '配車場所'        , ''    ],
				'.tsext-jtb-tcchi        > td:first-child': ['到着地'    , '都市名'          , '返車場所'        , ''    ],
				'.tsext-jtb-aishoubinmei > td:first-child': ['愛称／便名', ''                , ''                , ''    ],
				'.tsext-jtb-clsmei       > td:first-child': ['クラス名'  , '食事条件名'      , '車種名'          , ''    ],
				'.tsext-jtb-unchnsbtmei  > td:first-child': ['運賃種別名', '客室タイプ名'    , ''                , ''    ],
				'.tsext-jtb-hyojists     > td:first-child': ['表示ステータス','表示ステータス','表示ステータス'  , ''    ]
			};
			for(var key in labelMap){
				query(key, this.dialog.domNode)[0].innerHTML = labelMap[key][fcType - 1];
			}
			domStyle.set(query('.tsext-jtb-spymd .tsext-jtb-time'  , this.dialog.domNode)[0], 'display', (fcType == 2 ? 'none' : ''));
			domStyle.set(query('.tsext-jtb-tcymd .tsext-jtb-time'  , this.dialog.domNode)[0], 'display', (fcType == 2 ? 'none' : ''));
			domStyle.set(query('.tsext-jtb-spymd .tsext-jtb-number', this.dialog.domNode)[0], 'display', (fcType == 2 ? '' : 'none'));
			domStyle.set(query('.tsext-jtb-tcymd .tsext-jtb-number', this.dialog.domNode)[0], 'display', (fcType == 2 ? '' : 'none'));
			var enableMap = {
				'.tsext-jtb-spymd input'       : [1,1,1,0],
				'.tsext-jtb-tcymd input'       : [1,1,1,0],
				'.tsext-jtb-spchi input'       : [1,1,1,0],
				'.tsext-jtb-tcchi input'       : [1,0,1,0],
				'.tsext-jtb-aishoubinmei input': [1,0,0,0],
				'.tsext-jtb-clsmei input'      : [1,1,1,0],
				'.tsext-jtb-unchnsbtmei input' : [1,1,0,0],
				'.tsext-jtb-hyojists input'    : [1,1,1,0],
			};
			for(var key in enableMap){
				query(key, this.dialog.domNode).forEach(function(el){
					var f = enableMap[key][fcType - 1];
					domStyle.set(el, 'background-color', (f ? '' : '#ddd'));
					if(this.oldFc != fc && !f){
						el.value = '';
					}
				}, this);
			}
			if(this.oldFc != fc){
				if(fc == 'JL'){
					query('.tsext-jtb-ktsukknmei   input', this.dialog.domNode)[0].value = 'JAL';
					query('.tsext-jtb-aishoubinmei input', this.dialog.domNode)[0].value = 'JAL';
				}else if(fc == 'NH'){
					query('.tsext-jtb-ktsukknmei   input', this.dialog.domNode)[0].value = 'ANA';
					query('.tsext-jtb-aishoubinmei input', this.dialog.domNode)[0].value = 'ANA';
				}else if(fc == 'JE'){
					query('.tsext-jtb-ktsukknmei   input', this.dialog.domNode)[0].value = 'JR';
					query('.tsext-jtb-aishoubinmei input', this.dialog.domNode)[0].value = '';
				}else if(fc == 'SF'){
					query('.tsext-jtb-ktsukknmei   input', this.dialog.domNode)[0].value = 'ｽﾀｰﾌﾗｲﾔｰ';
					query('.tsext-jtb-aishoubinmei input', this.dialog.domNode)[0].value = 'MQ0XX';
				}else if(fc == 'JN'){
					query('.tsext-jtb-ktsukknmei   input', this.dialog.domNode)[0].value = 'JR';
					query('.tsext-jtb-aishoubinmei input', this.dialog.domNode)[0].value = '';
				}else if(fc == 'HR' || fc == 'BH'){
					query('.tsext-jtb-ktsukknmei   input', this.dialog.domNode)[0].value = '○○ホテル';
					query('.tsext-jtb-aishoubinmei input', this.dialog.domNode)[0].value = '○○ホテル';
				}else{
					query('.tsext-jtb-ktsukknmei   input', this.dialog.domNode)[0].value = '';
					query('.tsext-jtb-aishoubinmei input', this.dialog.domNode)[0].value = '';
				}
			}
			this.oldFc = fc;
		},
		onOk: function(){
			this.showError();
			var rsv = new JtbReserve();
			for(var key in this.inputMap){
				if(key != 'SPTIME' && key != 'TCTIME'){
					rsv.set(key, query(this.inputMap[key], this.dialog.domNode)[0].value);
				}
			}
			var fcType = query('.tsext-jtb-type select', this.dialog.domNode)[0].value;
			if(fcType == 2){
				rsv.set('SPTIME', query('.tsext-jtb-spymd input.tsext-jtb-number', this.dialog.domNode)[0].value.trim() || null);
				rsv.set('TCTIME', query('.tsext-jtb-tcymd input.tsext-jtb-number', this.dialog.domNode)[0].value.trim() || null);
			}else{
				rsv.set('SPTIME', query('.tsext-jtb-spymd input.tsext-jtb-time', this.dialog.domNode)[0].value.trim() || null);
				rsv.set('TCTIME', query('.tsext-jtb-tcymd input.tsext-jtb-time', this.dialog.domNode)[0].value.trim() || null);
			}
			if(fcType == 2){ // 宿泊
				if(!rsv.get('TCCHI')){
					rsv.set('TCCHI', rsv.get('SPCHI'));
				}
			}
			this.inst.setObj(rsv.getObj());
			this.deferred.resolve(this.inst);
			this.hide();
		},
		resetForm: function(){
			for(var key in this.inputMap){
				query(this.inputMap[key], this.dialog.domNode)[0].value = this.inst.get(key);
			}
			var fc = query('.tsext-jtb-kinoucd input', this.dialog.domNode)[0].value.trim() || null;
			var fcType = JtbAssist.getFunctionCodeType(fc);
			query('.tsext-jtb-spymd input.tsext-jtb-number', this.dialog.domNode)[0].value = (fcType == 2 ? this.inst.get('SPTIME') : '');
			query('.tsext-jtb-tcymd input.tsext-jtb-number', this.dialog.domNode)[0].value = (fcType == 2 ? this.inst.get('TCTIME') : '');
			query('.tsext-jtb-spymd input.tsext-jtb-time'  , this.dialog.domNode)[0].value = (fcType == 2 ? '' : this.inst.get('SPTIME'));
			query('.tsext-jtb-tcymd input.tsext-jtb-time'  , this.dialog.domNode)[0].value = (fcType == 2 ? '' : this.inst.get('TCTIME'));
			var lock = !JtbData.isUnlock();
			query('.tsext-jtb-operationnumber input'
				+ ',.tsext-jtb-ryokouno input'
				+ ',.tsext-jtb-subnumber input'
				+ ',.tsext-jtb-keys input'
				+ ',.tsext-jtb-seqno input'
			, this.dialog.domNode).forEach(function(el){
				domAttr.set(el, 'disabled', lock);
			}, this);
			query('.tsext-jtb-userId input', this.dialog.domNode).forEach(function(el){
				domAttr.set(el, 'disabled', (lock && this.inst.get('OPERATIONNUMBER')) || false);
			}, this);
			this.oldFc = this.inst.get('KINOUCD');
			this.changedFunction();
		}
	});
});
