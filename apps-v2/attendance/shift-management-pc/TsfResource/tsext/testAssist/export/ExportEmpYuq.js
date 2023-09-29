define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤怠有休
	return declare("tsext.testAssist.ExportEmpYuq", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 */
		constructor: function(manager, obj){
			this.obj.StartDate__c = Util.formatDate(this.obj.StartDate__c);
			this.obj.LimitDate__c = Util.formatDate(this.obj.LimitDate__c);
			this.obj.Date__c      = Util.formatDate(this.obj.Date__c);
			this.obj.oldNextYuqProvideDate__c = Util.formatDate(this.obj.oldNextYuqProvideDate__c);
			this.details = [];
		},
		getEmpId: function(){
			return this.obj.EmpId__c;
		},
		getStartDate: function(){
			return this.obj.StartDate__c;
		},
		getLimitDate: function(){
			return this.obj.LimitDate__c;
		},
		getDate: function(){
			return this.obj.Date__c;
		},
		isProvide: function(){
			return (this.obj.TotalTime__c > 0);
		},
		isLostFlag: function(){
			return this.obj.LostFlag__c || false;
		},
		compare: function(other){
			if(this.isLostFlag() && other.isProvide() && this.getMinusYuqId() == other.getId()){
				return 1;
			}else if(this.isProvide() && other.isLostFlag() && other.getMinusYuqId() == this.getId()){
				return -1;
			}
			return this.inherited(arguments);
		},
		/**
		 * 付与/消化の日数、時間(分とH:mm)を返す
		 * @param {number} orgt 時間（日数 × 基準時間 + 時間）(分)
		 * @param {number} bt 基準時間(分)
		 * @param {boolean=} flag 時間が0の時にhmmにflag=trueなら''をセット、flag=falseなら'0:00'をセット
		 * @returns 
		 */
		getDayAndMinutes: function(orgt, bt, flag){
			if(!orgt){
				return {
					days: 0,
					minutes: 0,
					hmm: (flag ? '' : Util.formatTime(0))
				};
			}
			var ht = bt / 2;
			var t1 = Math.floor(orgt / ht);
			var t2 = orgt % ht;
			if((ht % 60) > 0 && t2 > 30 && (t2 % 60) > 0 && t1 > 0){
				t1 -= 1;
				t2 += ht;
			}
			return {
				days: (t1 ? (t1 / 2) : 0),
				minutes: t2,
				hmm: (flag && !t2 ? '' : Util.formatTime(t2))
			};
		},
		/**
		 * 付与日数/時間
		 * @returns {{day:{number},minutes:{number},hmm:{string}}}
		 */
		getProvideValue: function(){
			return this.getDayAndMinutes(Math.max(this.obj.TotalTime__c, 0), this.obj.BaseTime__c, true);
		},
		/**
		 * 消化日数/時間
		 * @returns {{day:{number},minutes:{number},hmm:{string}}}
		 */
		getSpendValue: function(){
			return this.getDayAndMinutes(Math.abs(Math.min(this.obj.TotalTime__c, 0)), this.obj.BaseTime__c, true);
		},
		getSubject: function(){
			return this.obj.Subject__c;
		},
		addDetail: function(detail){
			this.details.push(detail);
		},
		/**
		 * マイナス付与レコードの場合、マイナス対象の付与レコードのIDを返す
		 * @returns {string}
		 */
		getMinusYuqId: function(){
			return (this.details.length ? this.details[0].getGroupId() : null);
		},
		/**
		 * マイナス付与レコードの場合、マイナス対象の付与レコードを返す
		 * @returns {tsext.testAssist.ExportEmpYuq}
		 */
		getMinusYuq: function(){
			var id = this.getMinusYuqId();
			return (id ? this.manager.getEmpYuqById(this.getEmpId(), id) : null);
		}
	});
});
