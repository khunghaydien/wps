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
	"dojo/text!tsext/template/jtbInvoiceForm.html",
	"tsext/tsjtb/JtbObjForm",
	"tsext/tsjtb/JtbData",
	"tsext/tsjtb/JtbAssist",
	"tsext/tsjtb/JtbInvoice",
	"tsext/dialog/Calendar",
	"tsext/dialog/Selector",
	"tsext/util/Util"
], function(declare, lang, json, array, str, query, on, Deferred, domConstruct, domAttr, domClass, domStyle, Dialog, template, JtbObjForm, JtbData, JtbAssist, JtbInvoice, Calendar, Selector, Util) {
	return declare("tsext.tsjtb.JtbInvoiceForm", [JtbObjForm], {
		constructor: function(){
			this.oldFc = null;
			this.inputMap = {
				'functionId'		 : '.tsext-jtb-functionId input',
				'startDate'			 : '.tsext-jtb-startDate input',
				'endDate'			 : '.tsext-jtb-endDate input',
				'useDate'			 : '.tsext-jtb-useDate input',
				'invoiceAmount'		 : '.tsext-jtb-invoiceAmount input',
				'startPlace'		 : '.tsext-jtb-startPlace input',
				'endPlace'			 : '.tsext-jtb-endPlace input',
				'flightName'		 : '.tsext-jtb-flightName input',
				'planName'			 : '.tsext-jtb-planName input',
				'status'			 : '.tsext-jtb-status input',
				'ticketNo'			 : '.tsext-jtb-ticketNo input',
				'useName'			 : '.tsext-jtb-useName input',
				'stayCount'			 : '.tsext-jtb-stayCount input',
				'roomCount'			 : '.tsext-jtb-roomCount input',
				'note'				 : '.tsext-jtb-note input',
				'reserve04'			 : '.tsext-jtb-reserve04 input',
				'operationNo'		 : '.tsext-jtb-operationNo input',
				'travelNo'			 : '.tsext-jtb-travelNo input',
				'subNo'				 : '.tsext-jtb-subNo input',
				'locationCode'		 : '.tsext-jtb-locationCode input',
				'locationName'		 : '.tsext-jtb-locationName input',
				'yearMonth'			 : '.tsext-jtb-yearMonth input',
				'deptCode'			 : '.tsext-jtb-deptCode input',
				'deptName'			 : '.tsext-jtb-deptName input',
				'currentDeptCode'	 : '.tsext-jtb-currentDeptCode input',
				'currentDeptName'	 : '.tsext-jtb-currentDeptName input',
				'userId'			 : '.tsext-jtb-userId input',
				'applyUserId'		 : '.tsext-jtb-applyUserId input',
				'userName'			 : '.tsext-jtb-userName input',
				'jrexUseAmount'		 : '.tsext-jtb-jrexUseAmount input',
				'jrexBackAmount'	 : '.tsext-jtb-jrexBackAmount input',
				'applyDateTime'		 : '.tsext-jtb-applyDateTime input'
			};
		},
		getTitle: function(){
			return "出張手配請求";
		},
		getContent: function(){
			return template;
		},
		setEventHandler: function(){
			this.dialog.own(
				on(query('.tsext-jtb-type select', this.dialog.domNode)[0], 'change', lang.hitch(this, this.changedFunction))
			);
			query('.tsext-jtb-functionId input[type="text"]', this.dialog.domNode).forEach(function(el){
				this.dialog.own(
					on(el, 'keyup', lang.hitch(this, function(e){
						e.target.value = e.target.value.toUpperCase();
						this.changedFunction();
					}))
				);
			}, this);
		},
		show: function(inst) {
			this.inst = inst;
			return this.inherited(arguments);
		},
		blurDate: function(e){
			this.showError();
			if(e && e.target && e.target.value){
				e.target.value = Util.formatDate(e.target.value, 'YYYY/MM/DD') || '';
				var tr = Util.getAncestorByTagName(e.target, 'TR');
				if(tr && domClass.contains(tr, 'tsext-jtb-startDate')){
					var edNode = query('.tsext-jtb-endDate input.tsext-jtb-date', this.dialog.domNode)[0];
					if(!edNode.value || edNode.value < e.target.value){
						edNode.value = e.target.value;
					}
				}else if(tr && domClass.contains(tr, 'tsext-jtb-endDate')){
					var sdNode = query('.tsext-jtb-startDate input.tsext-jtb-date', this.dialog.domNode)[0];
					if(!sdNode.value || sdNode.value > e.target.value){
						sdNode.value = e.target.value;
					}
				}
			}
		},
		changedFunction: function(){
			var fc = query('.tsext-jtb-functionId input', this.dialog.domNode)[0].value.trim() || null;
			var fcType = JtbAssist.getFunctionCodeType(fc);
			var fcTypeSelect = query('.tsext-jtb-type select', this.dialog.domNode)[0];
			if(!fcType){
				fcType = parseInt(fcTypeSelect.value, 10);
				domAttr.set(fcTypeSelect, 'disabled', false);
			}else{
				fcTypeSelect.value = '' + fcType;
				domAttr.set(fcTypeSelect, 'disabled', true);
			}
			this.oldFc = fc;
		},
		onOk: function(){
			this.showError();
			var act = new JtbInvoice();
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
			query('.tsext-jtb-operationNo input'
				+ ',.tsext-jtb-travelNo input'
				+ ',.tsext-jtb-subNo input'
				+ ',.tsext-jtb-locationCode input'
			, this.dialog.domNode).forEach(function(el){
				domAttr.set(el, 'disabled', lock);
			}, this);
			this.oldFc = this.inst.get('functionId');
			this.changedFunction();
		}
	});
});
