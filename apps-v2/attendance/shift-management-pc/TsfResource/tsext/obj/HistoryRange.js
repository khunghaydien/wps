define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/tsobj/TsConstant",
	"tsext/util/Util"
], function(declare, lang, json, array, TsConstant, Util) {
	return declare("tsext.obj.HistoryRange", null, {
		/**
		 * @param {
		 *   {
		 *     sd       :string, YYYY-MM-DD
		 *     ed       :string, YYYY-MM-DD
		 *     et       :Object|Null,  勤務体系オブジェクト   ※勤怠のみ
		 *     prevHr   :Object|Null,  前の履歴のインスタンス ※勤怠のみ
		 *     inid     :string|number, 工数の起算日
		 *     markm    :string|number, 工数の月度の表記
		 *   }
		 * }
		 */
		constructor: function(param){
			this.sd = param.sd;
			this.ed = param.ed;
			this.et = param.et;
			if(this.et){
				this.inid   = parseInt(this.et.ConfigBaseId__r.InitialDateOfMonth__c, 10);  // 月度の起算日
				this.markm  = parseInt(this.et.ConfigBaseId__r.MarkOfMonth__c       , 10);  // 月度の表記
				this.inim   = parseInt(this.et.ConfigBaseId__r.InitialDateOfYear__c , 10);  // 年度の起算月
				this.marky  = parseInt(this.et.ConfigBaseId__r.MarkOfYear__c        , 10);  // 年度の表記
				this.iniw   = parseInt(this.et.ConfigBaseId__r.InitialDayOfWeek__c  , 10);  // 週の起算日
				this.stamp    = this.et.ConfigBaseId__r.InitialDateOfMonth__c
						+ '-' + this.et.ConfigBaseId__r.MarkOfMonth__c
						+ '-' + this.et.ConfigBaseId__r.InitialDateOfYear__c
						+ '-' + this.et.ConfigBaseId__r.MarkOfYear__c
						+ '-' + this.et.ConfigBaseId__r.InitialDayOfWeek__c;
				if(param.prevHr == null){
					this.initialDate = null;
				}else{
					// 前の期間の起算日情報と比較して、異なる場合は開始日を切替日にセット、同じ場合は前の期間の切替日を引き継ぐ
					this.initialDate = (param.prevHr.stamp != this.stamp ? this.sd : param.prevHr.getInitialDate());
					param.prevHr.setNext(this);
				}
			}else{
				this.inid   = (typeof(param.inid)  == 'string' ? parseInt(param.inid , 10) : param.inid );  // 月度の起算日
				this.markm  = (typeof(param.markm) == 'string' ? parseInt(param.markm, 10) : param.markm);  // 月度の表記
			}
		},
		contains: function(d){
			return (!this.sd || this.sd <= d) && (!this.ed || this.ed >= d);
		},
		getYearMonth: function(d){
			return this.calcYearMonth(d, this.inid, this.markm);
		},
		getStartDate: function(ym){
			if(!ym){
				return this.sd;
			}
			var d = this.calcStartDate(ym, this.inid, this.markm).format('YYYY-MM-DD');
			return ((!this.sd || this.sd < d) ? d : this.sd);
		},
		getEndDate: function(ym){
			if(!ym){
				return this.ed;
			}
			var d = this.calcEndDate(ym, this.inid, this.markm).format('YYYY-MM-DD');
			return ((!this.ed || d < this.ed) ? d : this.ed);
		},
		getStartDateOfYear: function(y){
			var d = this.calcYearStartDate(y, this.marky, this.markm, this.inim, this.inid);
			return ((!this.sd || this.sd < d) ? d : this.sd);
		},
		getEndDateOfYear: function(y){
			var d = this.calcYearEndDate(y, this.marky, this.markm, this.inim, this.inid);
			return ((!this.ed || d < this.ed) ? d : this.ed);
		},
		getEmpType: function(){
			return this.et;
		},
		getInitialDate: function(d){
			return this.initialDate;
		},
		getNext: function(){
			return this.next;
		},
		setNext: function(hr){
			this.next = hr;
		},
		setStartDate: function(d){
			this.sd = d;
		},
		checkChangeDate: function(){
			var F = 'YYYY-MM-DD';
			if(this.next != null && this.stamp == this.next.stamp){
				// 次の勤務体系と起算情報が同じ場合、起算日変更と認識しないようにするため、
				// 切替日が起算日と異なる時は、切替日を起算日と合うように調整する。
				var nd = moment(this.ed, F).add(1, 'd').format(F);
				var d = this.calcStartDate(this.calcYearMonth(nd, this.inid, this.markm), this.inid, this.markm);
				if(nd != d){
					if(!this.sd || this.sd < d){
						this.ed = moment(d, F).add(-1, 'd').format(F);
						this.next.setStartDate(d);
					}else{
						// ここに来る場合は、次の勤務体系で上書きする
						this.next.setStartDate(this.sd);
						return false;
					}
				}
			}
			// 調整の結果、期間がマイナスになる可能性を考慮し、勤務体系履歴から除去する目的で false を返す。
			return (!this.sd || !this.ed || (this.sd <= this.ed));
		},
		getYearByDate: function(d){
			var ym = this.getYearMonth(d);
			var y = Math.floor(ym / 100);
			var m = Math.mod(ym, 100);
			var delta = 0;
			if(this.inim > m){
				delta = -1;
			}
			if(this.marky == 2){
				delta += 1;
			}
			y = y + delta;
			return y;
		},
		calcYearMonth: function(dt, id, mark) {
			var delta = 0;
			var d = moment(dt, 'YYYY-MM-DD');
			if(id > d.date()){
				delta = -1;
			}
			if(mark == 2){
				delta += 1;
			}
			d = d.add(delta, 'M');
			return d.year() * 100 + (d.month() + 1);
		},
		// 注: moment()を返す
		calcStartDate: function(yyyymm, id, mark) {
			var y = Math.floor(yyyymm / 100);
			var m = yyyymm - (y * 100);
			if(mark == 2){
				if(m > 1){
					m --;
				}else{
					y --;
					m = 12;
				}
			}
			return moment({y:y, M:(m-1), d:id});
		},
		// 注: moment()を返す
		calcEndDate: function(yyyymm, id, mark) {
			var d = this.calcStartDate(yyyymm, id, mark);
			return d.add(1, 'M').add(-1, 'd');
		}
	});
});
