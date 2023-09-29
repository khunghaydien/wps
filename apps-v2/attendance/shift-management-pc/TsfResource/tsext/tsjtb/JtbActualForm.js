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
	"dojo/text!tsext/template/jtbActualForm.html",
	"tsext/tsjtb/JtbObjForm",
	"tsext/tsjtb/JtbData",
	"tsext/tsjtb/JtbAssist",
	"tsext/tsjtb/JtbActual",
	"tsext/dialog/Calendar",
	"tsext/dialog/Selector",
	"tsext/util/Util"
], function(declare, lang, json, array, str, query, on, Deferred, domConstruct, domAttr, domClass, domStyle, Dialog, template, JtbObjForm, JtbData, JtbAssist, JtbActual, Calendar, Selector, Util) {
	return declare("tsext.tsjtb.JtbActualForm", [JtbObjForm], {
		constructor: function(){
			this.oldFc = null;
			this.inputMap = {
				'HCCHUKINOUCD'		 : '.tsext-jtb-hcchukinoucd input',
				'SPYMD' 			 : '.tsext-jtb-spymd input.tsext-jtb-date',
				'TCYMD' 			 : '.tsext-jtb-tcymd input.tsext-jtb-date',
				'KG'				 : '.tsext-jtb-kg input', // 金額項目として扱う場合はinput.tsext-jtb-amount
				'DATA01'			 : '.tsext-jtb-data01 input',
				'DATA02'			 : '.tsext-jtb-data02 input',
				'DATA03'			 : '.tsext-jtb-data03 input',
				'DATA04'			 : '.tsext-jtb-data04 input',
				'DATA05'			 : '.tsext-jtb-data05 input',
				'DATA06'			 : '.tsext-jtb-data06 input',
				'DATA07'			 : '.tsext-jtb-data07 input',
				'DATA08'			 : '.tsext-jtb-data08 input',
				'DATA09'			 : '.tsext-jtb-data09 input',
				'DATA10'			 : '.tsext-jtb-data10 input',
				'DATA11'			 : '.tsext-jtb-data11 input',
				'DATA12'			 : '.tsext-jtb-data12 input',
				'DATA13'			 : '.tsext-jtb-data13 input',
				'DATA14'			 : '.tsext-jtb-data14 input',
				'DATA15'			 : '.tsext-jtb-data15 input',
				'KGYOUCD'			 : '.tsext-jtb-kgyoucd input',
				'OPERATIONNUMBER'	 : '.tsext-jtb-operationnumber input',
				'SUBNUMBER'			 : '.tsext-jtb-subnumber input',
				'RYOKOUNO'			 : '.tsext-jtb-ryokouno input',
				'SEQNO'				 : '.tsext-jtb-seqno input',
				'BNO'				 : '.tsext-jtb-bno input',
				'USERID'			 : '.tsext-jtb-userid input',
				'SEIKYUHSSEIYMD'	 : '.tsext-jtb-seikyuhsseiymd input',
				'SETSHOUKBN'		 : '.tsext-jtb-setshoukbn input',
				'RNKEITWSEKBN'		 : '.tsext-jtb-rnkeitwsekbn input',
				'RNKEITWSEYMDTIME'	 : '.tsext-jtb-rnkeitwseymdtime input',
				'WSRNKEITWSEKBN'	 : '.tsext-jtb-wsrnkeitwsekbn input',
				'WSRNKEITWSEYMDTIME' : '.tsext-jtb-wsrnkeitwseymdtime input',
				'SYSTEMKBN' 		 : '.tsext-jtb-systemkbn input',
				'WFKNRENFLG'		 : '.tsext-jtb-wfknrenflg input',
				'PAYNY' 			 : '.tsext-jtb-payny input',
				'SKSEIYMDTIME'		 : '.tsext-jtb-skseiymdtime input',
				'KSHNYMDTIME'		 : '.tsext-jtb-kshnymdtime input',
				'CCCD'				 : '.tsext-jtb-cccd input'
			};
		},
		getTitle: function(){
			return "出張手配実績";
		},
		getContent: function(){
			return template;
		},
		setEventHandler: function(){
			this.dialog.own(
				on(query('.tsext-jtb-type select', this.dialog.domNode)[0], 'change', lang.hitch(this, this.changedFunction))
			);
			query('.tsext-jtb-hcchukinoucd input[type="text"]', this.dialog.domNode).forEach(function(el){
				this.dialog.own(
					on(el, 'keyup', lang.hitch(this, function(e){
						e.target.value = e.target.value.toUpperCase();
						this.changedFunction();
					}))
				);
			}, this);
			query('.tsext-jtb-hcchukinoucd input'
				+ ',.tsext-jtb-data01 input'
				+ ',.tsext-jtb-data02 input'
				+ ',.tsext-jtb-data03 input'
				+ ',.tsext-jtb-data04 input'
				+ ',.tsext-jtb-data05 input'
				+ ',.tsext-jtb-data06 input'
				+ ',.tsext-jtb-data07 input'
				+ ',.tsext-jtb-data11 input'
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
			query('.tsext-jtb-payny input')[0].value = this.buildPayny();
		},
		buildPayny: function() {
			var contents = [];
			query('.tsext-jtb-hcchukinoucd input'
				+ ',.tsext-jtb-data01 input'
				+ ',.tsext-jtb-data02 input'
				+ ',.tsext-jtb-data03 input'
				+ ',.tsext-jtb-data04 input'
				+ ',.tsext-jtb-data05 input'
				+ ',.tsext-jtb-data06 input'
				+ ',.tsext-jtb-data07 input'
				+ ',input[type="text"].tsext-jtb-time'
				+ ',input[type="text"].tsext-jtb-amount'
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
			var fc = query('.tsext-jtb-hcchukinoucd input', this.dialog.domNode)[0].value;
			if(domClass.contains(row, 'tsext-jtb-hcchukinoucd')){	return JtbAssist.getFunctionCodeValues('actual');
			}else if(domClass.contains(row, 'tsext-jtb-data01')){	return JtbAssist.getServiceNameValues(fc);
			}else if(domClass.contains(row, 'tsext-jtb-data02')){	return JtbAssist.getTransportNameValues(fc);
			}else if(domClass.contains(row, 'tsext-jtb-data03')
				  || domClass.contains(row, 'tsext-jtb-data04')){	return JtbAssist.getPlaceValues(fc);
			}else if(domClass.contains(row, 'tsext-jtb-data06')){	return JtbAssist.getFlightNameValues(fc);
			}else if(domClass.contains(row, 'tsext-jtb-data07')){	return JtbAssist.getClassNameValues(fc);
			}else if(domClass.contains(row, 'tsext-jtb-data05')){	return JtbAssist.getFareTypeValues(fc);
			}else if(domClass.contains(row, 'tsext-jtb-data11')){	return JtbAssist.getDisplayStatusValues(fc);
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
		changedFunction: function(){
			var fc = query('.tsext-jtb-hcchukinoucd input', this.dialog.domNode)[0].value.trim() || null;
			var fcType = JtbAssist.getFunctionCodeType(fc);
			var fcTypeSelect = query('.tsext-jtb-type select', this.dialog.domNode)[0];
			if(!fcType){
				fcType = parseInt(fcTypeSelect.value, 10);
				domAttr.set(fcTypeSelect, 'disabled', false);
			}else{
				fcTypeSelect.value = '' + fcType;
				domAttr.set(fcTypeSelect, 'disabled', true);
			}
			domStyle.set(query('.tsext-jtb-data15 input', this.dialog.domNode)[0], 'background-color', '#ddd');
			this.oldFc = fc;
		},
		onOk: function(){
			this.showError();
			var act = new JtbActual();
			for(var key in this.inputMap){
				act.set(key, query(this.inputMap[key], this.dialog.domNode)[0].value);
			}
			this.inst.setObj(act.getObj());
			this.deferred.resolve(this.inst);
			this.hide();
		},
		resetForm: function(){
			for(var key in this.inputMap){
				query(this.inputMap[key], this.dialog.domNode)[0].value = this.inst.get(key);
			}
			var lock = !JtbData.isUnlock();
			query('.tsext-jtb-kgyoucd input'
				+ ',.tsext-jtb-operationnumber input'
				+ ',.tsext-jtb-ryokouno input'
				+ ',.tsext-jtb-subnumber input'
				+ ',.tsext-jtb-seqno input'
			, this.dialog.domNode).forEach(function(el){
				domAttr.set(el, 'disabled', lock);
			}, this);
			this.oldFc = this.inst.get('HCCHUKINOUCD');
			this.changedFunction();
		}
	});
});
