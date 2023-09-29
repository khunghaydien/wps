define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/EntryBase2",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, EntryBase2, Current, Constant, Util){
	// 申請（一括取消、一括承認、一括却下）
	return declare("tsext.testAssist.EntryApplyCommon", EntryBase2, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			this.applys = [];
			var item2 = this.getItem(1);
			if(!item2
			|| (item2 != Constant.ITEM2_CANCEL
			 && item2 != Constant.ITEM2_APPROVE
			 && item2 != Constant.ITEM2_REJECT)){
				this.addError(Constant.ERROR_UNDEFINED); // 未定義
			}else{
				if(!this.mdate1){
					this.addError(Constant.ERROR_EMPTY_DATE); // 日付未入力
				}
			}
		},
		/**
		 * 申請直前のチェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			if(!ed){
				ed = sd;
			}
			this.applys = Current.getApplys(sd, ed, (this.isApprove() || this.isReject()));
			return true;
		},
		isCancel:  function(){ return (this.getItem(1) == Constant.ITEM2_CANCEL);  }, // 取消
		isApprove: function(){ return (this.getItem(1) == Constant.ITEM2_APPROVE); }, // 承認
		isReject:  function(){ return (this.getItem(1) == Constant.ITEM2_REJECT);  }, // 却下
		/**
		 * 申請IDを持つ要素の配列を返す
		 * @return {Array.<{{id:{string}}>}
		 */
		getIdSet: function(){
			var objs = [];
			for(var i = 0 ; i < this.applys.length ; i++){
				var apply = this.applys[i];
				objs.push({id:apply.id});
			}
			return objs;
		},
		/**
		 * 申請オブジェクトを追加
		 * @param {Object} apply
		 */
		addApply: function(apply){
			this.applys.push(apply);
		},
		/**
		 * 申請オブジェクトの配列を返す
		 * @return {Array.<Object>}
		 */
		getApplys: function(){
			return this.applys;
		},
		/**
		 * 取消/承認/却下1
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			if(this.isCancel()){ // 取消
				this.cancelLoop(bagged.resetSubIndex());
			}else{ // 承認or却下
				var chain = Current.approveOrReject(
					bagged,
					this.isApprove(), // true=承認, false=却下
					this.getNote(),   // コメント
					this.getIdSet()   // 申請IDを持つオブジェクトの配列
				).then(
					lang.hitch(this, function(){
						return bagged.stayResult();
					}),
					lang.hitch(this, function(errmsg){
						return bagged.stayResult(this.addError(errmsg));
					})
				);
				chain.then(lang.hitch(bagged, bagged.loopNext));
			}
		},
		/**
		 * 取消
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		cancelLoop: function(bagged){
			if(bagged.getSubIndex() >= this.getApplys().length){
				bagged.loopNext();
				return;
			}
			var applys = this.getApplys();
			var chain = Current.cancelApplyEmpDay(bagged, applys[bagged.getSubIndex()]).then(
				lang.hitch(this, function(){
					return bagged.stayResult();
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(this, function(bagged){
				if(bagged.stopped()){
					return;
				}
				this.cancelLoop(bagged.nextSub());
			}));
		}
	});
});
