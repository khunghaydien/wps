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
	// シフト設定
	return declare("tsext.testAssist.EntryShift", EntryBase2, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			this.pattern = null;
			var item1 = this.getItem(0);
			var item2 = this.getItem(1);
			var item8 = this.getItem(7);
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			if(!sd){
				this.addError(Constant.ERROR_EMPTY_DATE); // 日付未入力
			}
			if(item1 == Constant.ITEM1_SHIFT){
//				if(!item2 && !item8){
//					this.addError(Constant.ERROR_EMPTY_REQUIRED);
//				}
				if(item8){
					try{
						this.dayType = this.getDayType(item8); // 種別
					}catch(e){
						this.addError(e.getErrorLevel(), e.getMessage());
					}
				}
			}
		},
		/**
		 * 申請直前のチェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			var month = Current.getMonth();
			if(month.fixed){
				this.addError(Constant.ERROR_FIXED_MONTH);
				return false;
			}
			var item1 = this.getItem(0);
			if(item1 == Constant.ITEM1_SHIFT){ // シフト設定
				var item2 = this.getItem(1);
				var item9 = this.getItem(8);
				try{
					if(item2){
						this.pattern = Current.getObjByName('patterns', item2); // 勤務パターン
					}
					if(item9){
						this.workPlaceId = Current.getIdByName('depts', item9); // 主管部署
					}
				}catch(e){
					this.addError(e.getErrorLevel(), e.getMessage()); // 該当なしか同名で重複がある
				}
			}
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			return true;
		},
		execute: function(bagged){
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			bagged.outputLog(this.getEntryName());
			var item1 = this.getItem(0);
			var target = {};
			if(item1 == Constant.ITEM1_SHIFT){ // シフト設定
				var p = target[Current.getEmpId()] = {};
				var d  = this.getStartDate();
				var ed = this.getEndDate() || d;
				while(d <= ed){
					p[d] = {
						dayType: this.dayType,
						workPlaceId: (this.workPlaceId || '*'),
						deptId: Current.getDeptId(),
						patternId: (this.pattern && this.pattern.Id) || null,
						note: this.getItem(6),
						startTime: null,
						endTime: null
					};
					d = Util.addDays(d, 1);
				}
			}else{ // シフト削除
				var p = target[Current.getEmpId()] = [];
				var d  = this.getStartDate();
				var ed = this.getEndDate() || d;
				while(d <= ed){
					p.push(d);
					d = Util.addDays(d, 1);
				}
			}
			var chain = Current.request(
				{
					action: 'operateTestAssist',
					operateType: 'entryShift',
					target: target,
					deleteShift: (item1 == Constant.ITEM1_SHIFT_REMOVE),
					isRealShift: true
				},
				bagged
			).then(
				lang.hitch(this, function(){
					return bagged.doneResult();
				}),
				lang.hitch(this, function(errmsg){
					return bagged.doneResult(this.addError(errmsg));
				})
			);
		}
	});
});
