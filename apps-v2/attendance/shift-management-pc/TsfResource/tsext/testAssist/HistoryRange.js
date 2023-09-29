define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/tsobj/TsConstant",
	"tsext/util/Util"
], function(declare, lang, json, array, TsConstant, Util) {
	return declare("tsext.testAssist.HistoryRange", null, {
		/**
		 * @param {
		 *   {
		 *     sd       :string, YYYY-MM-DD
		 *     ed       :string, YYYY-MM-DD
		 *     et       :tsext.empView.EmpType|Null,
		 *     prevHr   :tsext.empView.HistoryRange|Null
		 *   }
		 * }
		 */
		constructor: function(param){
			this.sd = param.sd;
			this.ed = param.ed;
			this.et = param.et;
			this.stamp = this.et.getStamp();
			if(param.prevHr == null){
				this.initialDate = null;
			}else{
				// 前の期間の起算日情報と比較して、異なる場合は開始日を切替日にセット、同じ場合は前の期間の切替日を引き継ぐ
				this.initialDate = (param.prevHr.stamp != this.stamp ? this.sd : param.prevHr.getInitialDate());
			}
		},
		contains             : function(d) { return (!this.sd || this.sd <= d) && (!this.ed || this.ed >= d); },
		getEmpType           : function()  { return this.et; },
		getInitialDateOfMonth: function()  { return this.et.getInitialDateOfMonth(); },
		getMarkOfMonth       : function()  { return this.et.getMarkOfMonth(); },
		getYearMonth         : function(d) { return this.calcYearMonth(this.getInitialDateOfMonth(), this.getMarkOfMonth(), d); },
		getInitialDate       : function(d) { return this.initialDate; },
		getStartDate: function(ym){
			if(!ym){
				return this.sd;
			}
			var d = moment(this.calcStartDate(this.getInitialDateOfMonth(), this.getMarkOfMonth(), ym)).format('YYYY-MM-DD');
			return ((!this.sd || this.sd < d) ? d : this.sd);
		},
		getEndDate: function(ym){
			if(!ym){
				return this.ed;
			}
			var d = moment(this.calcEndDate(this.getInitialDateOfMonth(), this.getMarkOfMonth(), ym)).format('YYYY-MM-DD');
			return ((!this.ed || d < this.ed) ? d : this.ed);
		},
		calcYearMonth: function(initialDateOfMonth, markOfMonth, dt) {
			var delta = 0;
			var d = (typeof(dt) == 'string' ? moment(dt, 'YYYY-MM-DD').toDate() : dt);
			if(initialDateOfMonth > d.getDate()){
				delta = -1;
			}
			if(markOfMonth == 2){
				delta += 1;
			}
			d = new Date(d.getFullYear(), d.getMonth() + delta, d.getDate());
			return d.getFullYear() * 100 + (d.getMonth() + 1);
		},
		calcStartDate: function(initialDateOfMonth, markOfMonth, ym) {
			var y = Math.floor(ym / 100);
			var m = ym % 100;
			if(markOfMonth == 2){
				if(m > 1){
					m --;
				}else{
					y --;
					m = 12;
				}
			}
			return new Date(y, m - 1, initialDateOfMonth);
		},
		calcEndDate: function(initialDateOfMonth, markOfMonth, ym) {
			var d = this.calcStartDate(initialDateOfMonth, markOfMonth, ym);
			return moment(d).add(1, 'M').add(-1, 'd').toDate();
		}
	});
});
