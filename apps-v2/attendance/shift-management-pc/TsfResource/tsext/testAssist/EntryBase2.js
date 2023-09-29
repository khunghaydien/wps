define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/EntryBase1",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, EntryBase1, Current, Constant, Util){
	// 指示データタイプ1クラス
	return declare("tsext.testAssist.EntryBase2", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor: function(args, lineNo){
			this.mdate1 = null;
			this.mdate2 = null;
			this.ym1 = null;
			this.ym2 = null;
			this.st = null;
			this.et = null;
			this.ioClear = false;
			this.restTimes = [];
			this.restClear = false;
			this.restDefault = false;

			this.date1  = this.getRawDataByIndex(args, Constant.INDEX_DATE1);
			this.date2  = this.getRawDataByIndex(args, Constant.INDEX_DATE2);
			this.inout  = this.getRawDataByIndex(args, Constant.INDEX_INOUT);
			this.rests  = this.getRawDataByIndex(args, Constant.INDEX_RESTS);
			this.note   = this.getRawDataByIndex(args, Constant.INDEX_NOTE);
			this.etc1   = this.getRawDataByIndex(args, Constant.INDEX_ETC1);
			this.etc2   = this.getRawDataByIndex(args, Constant.INDEX_ETC2);
			this.etc3   = this.getRawDataByIndex(args, Constant.INDEX_ETC3);
			this.etc4   = this.getRawDataByIndex(args, Constant.INDEX_ETC4);
			this.etc5   = this.getRawDataByIndex(args, Constant.INDEX_ETC5);
			this.etc6   = this.getRawDataByIndex(args, Constant.INDEX_ETC6);
			this.etc7   = this.getRawDataByIndex(args, Constant.INDEX_ETC7);
			this.etc8   = this.getRawDataByIndex(args, Constant.INDEX_ETC8);
			this.etc9   = this.getRawDataByIndex(args, Constant.INDEX_ETC9);
			this.etc10  = this.getRawDataByIndex(args, Constant.INDEX_ETC10);

			if(args.length >= 3){
				if(this.date1 && /^\d{6}$/.test(this.date1)){
					try{
						this.ym1 = this.getYm(this.date1).yearMonth;
						this.ym2 = this.getYm(this.date2, true).yearMonth;
					}catch(e){
						this.addError(e.message);
					}
				}else{
					// 開始日付、終了日付
					this.mdate1 = (this.date1 ? moment(this.date1.replace(/\//g,'-'), Constant.YMD1) : null);
					this.mdate2 = (this.date2 ? moment(this.date2.replace(/\//g,'-'), Constant.YMD1) : null);
					if(!this.mdate1 || !this.mdate1.isValid()){
						this.addError(Constant.ERROR_EMPTY_OR_INVALID, ['開始日付']);
					}else if(this.mdate2 && !this.mdate2.isValid()){
						this.addError(Constant.ERROR_INVALID_FORMAT, ['終了日付']);
					}
					if(this.mdate1 !== null && this.mdate2 !== null
					&& this.mdate1.isAfter(this.mdate2)
					&& this.getApplyType() != Constant.ITEM1_EXCHANGE){ // 振替申請以外で開始日付と終了日付が逆転している
						this.addError(Constant.ERROR_INVALID_DATES);
					}
				}
				// 開始終了時刻
				if(!this.inout){
					this.ioClear = true;
				}else{
					var ios = this.inout.split(/\-/);
					if(ios.length > 2){
						this.addError(Constant.ERROR_INVALID_FORMAT, ['開始終了時刻']);
					}else{
						this.st = (ios[0] ? Util.str2minutes(ios[0]) : null);
						this.et = (ios.length > 1 && ios[1] ? Util.str2minutes(ios[1]) : null);
						if(ios[0] && this.st === null){
							this.addError(Constant.ERROR_INVALID_FORMAT, ['開始時刻']);
						}
						if(ios.length > 1 && ios[1] && this.et === null){
							this.addError(Constant.ERROR_INVALID_FORMAT, ['終了時刻']);
						}
						if(this.st !== null && this.et !== null && this.st >= this.et){
							this.addError(Constant.ERROR_INVALID_TIMES);
						}
					}
				}
				// 休憩時間
				if(!this.rests){
					this.restDefault = true;
				}else{
					if(/^(Clear|C)$/i.test(this.rests)){
						this.restClear = true;
					}else if(/^(Default|D)$/i.test(this.rests)){
						this.restDefault = true;
					}else{
						var vals = (this.rests || '').split(/[,\|]/);
						var ng = false;
						for(var i = 0 ; (i < vals.length && !ng) ; i++){
							var val = vals[i];
							var vs = (val || '').split(/\-/);
							if(vs.length){
								var rest = {
									from: (vs[0] ? Util.str2minutes(vs[0]) : null),
									to  : (vs.length > 1 && vs[1] ? Util.str2minutes(vs[1]) : null),
									type: 21
								};
								if((vs[0] && rest.from === null) || (vs.length > 1 && vs[1] && rest.to === null)){
									this.addError(Constant.ERROR_INVALID_FORMAT, ['休憩時間']);
									ng = true;
								}else{
									this.restTimes.push(rest);
								}
							}
						}
					}
				}
			}
		},
		getApplyType: function(){
			return this.items[0];
		},
		/**
		 * 開始日付
		 * @return {string|null} 'YYYY-MM-DD'
		 */
		getStartDate: function(){
			return (this.mdate1 ? this.mdate1.format(Constant.YMD1) : null);
		},
		/**
		 * 終了日付
		 * @return {string|null} 'YYYY-MM-DD'
		 */
		getEndDate: function(){
			return (this.mdate2 ? this.mdate2.format(Constant.YMD1) : null);
		},
		/**
		 * 出社時刻
		 * @return {number|null}
		 */
		getStartTime : function(){
			return this.st;
		},
		/**
		 * 退社時刻
		 * @return {number|null}
		 */
		getEndTime : function(){
			return this.et;
		},
		/**
		 * 備考
		 * @return {string|null}
		 */
		getNote: function(){
			return this.note;
		},
		/**
		 * 連絡先
		 * 休暇申請と振替申請のみ
		 * @return {string|null}
		 */
		getContact : function(){
			return this.etc1;
		},
		/**
		 * @return {string|null}
		 */
		getEtc1 : function(){
			return this.etc1;
		},
		/**
		 * @return {string|null}
		 */
		getEtc2 : function(){
			return this.etc2;
		},
		/**
		 * @return {string|null}
		 */
		getEtc3 : function(){
			return this.etc3;
		},
		getEtc10 : function(){
			return this.etc10;
		},
		getExecuteLog: function(){
			return '';
		},
		/**
		 * 勤怠日次申請の実行
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			var chain = Current.applyEmpDay(bagged, this.getApplyEmpDayRequest(), this.getEntryName()).then(
				lang.hitch(this, function(){
					return bagged.stayResult();
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(this, this.afterApply1));
		},
		/**
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		 afterApply1: function(bagged){
			if(bagged.stopped()){
				return;
			}
			if(this.option == Constant.OPTION_APPROVE   // 承認
			|| this.option == Constant.OPTION_REFLECT   // 反映
			){
				var apply = Current.getWaitingApplyByApplyType(this.getStartDate(), this.getApplyType());
				if(apply){
					var chain = Current.approveOrReject(
						bagged,
						true,   // true=承認, false=却下
						null,   // コメント
						[{id:apply.id}]   // 申請IDを持つオブジェクトの配列
					).then(
						lang.hitch(this, function(){
							return bagged.stayResult();
						}),
						lang.hitch(this, function(errmsg){
							return bagged.stayResult(this.addError(errmsg));
						})
					);
					chain.then(lang.hitch(this, function(bagged){
						this.afterApply2(bagged, apply);
					}));
					return;
				}
			}
			return bagged.doneResult();
		},
		/**
		 * @param {tsext.testAssist.Bagged} bagged
		 * @param {Object} apply
		 */
		 afterApply2: function(bagged, apply){
			if(this.option == Constant.OPTION_REFLECT // 反映
			&& this.getApplyType() == Constant.ITEM1_REVISE_TIME // 勤怠時刻修正申請
			&& apply && !apply.entered){ // 未反映
				Current.reviseApplyEnter(
					bagged,
					apply
				).then(
					lang.hitch(this, function(){
						bagged.doneResult();
					}),
					lang.hitch(this, function(errmsg){
						bagged.doneResult(this.addError(errmsg));
					})
				);
			}else{
				return bagged.doneResult();
			}
		}
	});
});
