define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/tsjtb/JtbReserve",
	"tsext/tsjtb/JtbActual",
	"tsext/tsjtb/JtbInvoice",
	"tsext/util/Util"
], function(declare, lang, json, array, JtbReserve, JtbActual, JtbInvoice, Util) {
	teaspex.jtbData = (new declare("tsext.tsjtb.JtbData", null, {
		init: function(info){
			this.info = info;
			Util.excludeNameSpace(this.info);
			this.args = this.getArgs();
		},
		getArgs: function(){
			var obj = {};
			var args = location.search.split('&');
			for(var i = 0 ; i < args.length ; i++){
				var v = args[i];
				if(i == 0){
					v = v.substring(1);
				}
				var p = v.split('=');
				if(p.length){
					obj[p[0].toLowerCase()] = (p.length > 1 ? p[1] : null);
				}
			}
			return obj;
		},
		setParam: function(page, prefix){
			var ps = page.split(prefix);
			var keyList = new Array();
			var keySet = {};
			for(var i = 0 ; i < ps.length ; i++){
				var p = ps[i].split(/:/);
				var key = p[0].toLowerCase();
				if(!key){
					continue;
				}
				keyList.push(key);
				if(p.length > 1){
					keySet[key] = p[1] || null;
				}
			}
			this.param = {
				keyList : keyList,
				keySet	: keySet
			};
		},
		getParam: function(){
			return this.param;
		},
		getPage: function(){
			return this.param.keyList[0];
		},
		getCurrentId: function(){
			return this.param.keySet.id || null;
		},
		getSsoMode: function(){
			return this.param.keySet.ssomode || null;
		},
		getCommon: function(){
			return this.info.common;
		},
		isUnlock: function(){
			return this.unlock || false;
		},
		setUnlock: function(flag){
			this.unlock = flag;
		},
		getLocationCode: function(){
			return this.locationCode;
		},
		getJsNaviId: function(){
			return this.info.targEmp && this.info.targEmp.emp.JsNaviId__c || null;
		},
		getEmpName: function(){
			return this.info.targEmp && this.info.targEmp.emp.Name || null;
		},
		getUserName: function(jsNaviId){
			if(!jsNaviId){
				return null;
			}
			var emps = this.emps || [];
			for(var i = 0 ; i < emps.length ; i++){
				if(emps[i].JsNaviId__c == jsNaviId){
					return emps[i].Name;
				}
			}
			return null;
		},
		setRecord: function(result){
			this.expPreApply = (result.records && result.records.length && result.records[0]) || null;
			this.rights = result.rights || 0;
			this.exps = result.exps || [];
			this.attachBody = (result.attachBody ? Util.fromJson(result.attachBody) : null);
			this.attachId = result.attachId || null;
			this.attachParentId = result.attachParentId || null;
			this.travelNo = (this.attachBody && this.attachBody.travelNo) || null;
			this.locationCode = result.locationCode || null;
			this.common = result.common;
			this.emps = result.emps;
			this.controlData = result.controlData;
			this.attachmentNameFormat = result.attachmentNameFormat;
			if(this.expPreApply){
				this.expPreApply.StartDate__c = Util.formatDate(this.expPreApply.StartDate__c);
				this.expPreApply.EndDate__c   = Util.formatDate(this.expPreApply.EndDate__c);
			}
		},
		getExpPreApply: function(){
			return this.expPreApply;
		},
		getExpPreApplyNo: function(){
			return (this.expPreApply && this.expPreApply.ExpPreApplyNo__c) || '';
		},
		getStartDate: function(){
			return (this.expPreApply && this.expPreApply.StartDate__c) || '';
		},
		getEndDate: function(){
			return (this.expPreApply && this.expPreApply.EndDate__c) || '';
		},
		getOperationNo: function(){
			if(this.getExpPreApplyNo()){
				return 'P' + this.getExpPreApplyNo();
			}
			return null;
		},
		getTravelNo: function(){
			if(!this.travelNo){
				var v = parseInt(moment().format('YYMMDDHHmmss'), 10);
				this.travelNo = 'DJ' + v.toString(16).toUpperCase();
			}
			return this.travelNo;
		},
		getAttachId: function(){
			return this.attachId || null;
		},
		getAttachParentId: function(){
			return this.attachParentId || null;
		},
		getAttachmentNameFormat: function(){
			return this.attachmentNameFormat || '';
		},
		getRawReserves: function(){
			return (this.attachBody && this.attachBody.reserves) || [];
		},
		getRawActuals: function(){
			return (this.attachBody && this.attachBody.actuals) || [];
		},
		getRawInvoices: function(){
			return (this.attachBody && this.attachBody.invoices) || [];
		},
		setRawActuals: function(actuals){
			if(!this.attachBody){
				this.attachBody = {};
			}
			this.attachBody.actuals = actuals;
		},
		setRawInvoices: function(invoices){
			if(!this.attachBody){
				this.attachBody = {};
			}
			this.attachBody.invoices = invoices;
		},
		getReserves: function(){
			var insts = [];
			if(this.attachBody){
				array.forEach(this.getRawReserves(), function(obj){
					insts.push(new JtbReserve(obj));
				}, this);
			}
			return insts;
		},
		getActuals: function(){
			var insts = [];
			if(this.attachBody){
				array.forEach(this.getRawActuals(), function(obj){
					insts.push(new JtbActual(obj));
				}, this);
			}
			return insts;
		},
		getInvoices: function(){
			var insts = [];
			if(this.attachBody){
				array.forEach(this.getRawInvoices(), function(obj){
					insts.push(new JtbInvoice(obj));
				}, this);
			}
			return insts;
		},
		getJsNaviIdValues: function(){
			var objs = [];
			array.forEach(this.emps, function(emp){
				if(emp.JsNaviId__c){
					objs.push({
						value: emp.JsNaviId__c,
						name: emp.JsNaviId__c
					});
				}
			}, this);
			return objs;
		}
	}))();
	return teaspex.jtbData;
});
