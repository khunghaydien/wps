define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤怠積休
	return declare("tsext.testAssist.ExportEmpStock", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 */
		constructor: function(manager, obj){
			this.obj.StartDate__c = Util.formatDate(this.obj.StartDate__c);
			this.obj.LimitDate__c = Util.formatDate(this.obj.LimitDate__c);
			this.obj.Date__c      = Util.formatDate(this.obj.Date__c);
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
		/**
		 * 管理名を返す。代休はプレフィックスをつけない
		 * @returns 
		 */
		getType: function(){
			if(this.obj.Type__c == '代休'){
				return this.obj.Type__c;
			}
			return this.manager.getNamePrefix() + this.obj.Type__c;
		},
		isProvide: function(){
			return (this.obj.Days__c > 0 || this.obj.Hours__c > 0);
		},
		isLostFlag: function(){
			return this.obj.LostFlag__c || false;
		},
		compare: function(other){
			if(this.isLostFlag() && other.isProvide() && this.getMinusStockId() == other.getId()){
				return 1;
			}else if(other.isLostFlag() && this.isProvide() && other.getMinusStockId() == this.getId()){
				return -1;
			}
			return this.inherited(arguments);
		},
		/**
		 * 付与/消化の日数、時間(分とH:mm)を返す
		 * @param {number} orgd 日数
		 * @param {number} orgh 時間（取得時間 ÷ 基準時間）
		 * @param {number} bt 基準時間(分)
		 * @param {boolean=} flag 時間が0の時にhmmにflag=trueなら''をセット、flag=falseなら'0:00'をセット
		 * @returns 
		 */
		getDaysAndMinutes: function(orgd, orgh, bt, flag){
			var o = {
				days: (new Decimal(orgd)).abs().toNumber(),
				minutes: (new Decimal(orgh)).abs().times(bt || 0).round().toNumber()
			};
			o.hmm = (flag && !o.minutes ? '' : Util.formatTime(o.minutes));
			return o;
		},
		/**
		 * 付与日数/時間
		 * @returns {{day:{number},minutes:{number},hmm:{string}}}
		 */
		getProvideValue: function(){
			var d = (this.obj.Days__c  > 0 ? this.obj.Days__c  : 0);
			var h = (this.obj.Hours__c > 0 ? this.obj.Hours__c : 0);
			return this.getDaysAndMinutes(Math.max(d, 0), Math.max(h, 0), this.obj.BaseTime__c, true);
		},
		/**
		 * 消化日数/時間
		 * @returns {{day:{number},minutes:{number},hmm:{string}}}
		 */
		getSpendValue: function(){
			var d = (this.obj.Days__c  < 0 ? this.obj.Days__c  : 0);
			var h = (this.obj.Hours__c < 0 ? this.obj.Hours__c : 0);
			return this.getDaysAndMinutes(Math.min(d, 0), Math.min(h, 0), this.obj.BaseTime__c, true);
		},
		addDetail: function(detail){
			this.details.push(detail);
		},
		/**
		 * マイナス付与レコードの場合、マイナス対象の付与レコードIDを返す
		 * @returns {String}
		 */
		getMinusStockId: function(){
			return (this.details.length ? this.details[0].getConsumesStockId() : null);
		},
		/**
		 * マイナス付与レコードの場合、マイナス対象の付与レコードを返す
		 * @returns {tsext.testAssist.ExportEmpStock}
		 */
		getMinusStock: function(){
			var id = this.getMinusStockId();
			return (id ? this.manager.getEmpStockById(this.getEmpId(), id) : null);
		}
	});
});
