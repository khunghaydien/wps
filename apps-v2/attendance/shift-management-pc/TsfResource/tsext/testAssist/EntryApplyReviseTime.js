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
	// 勤怠時刻修正申請
	return declare("tsext.testAssist.EntryApplyReviseTime", EntryBase2, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			var st = this.getStartTime();
			var et = this.getEndTime();
			if(!sd){
				this.addError(Constant.ERROR_EMPTY_DATE); // 日付未入力
			}
			if(ed && sd != ed){
				this.addError(Constant.ERROR_INVALID, ['終了日付']); // 無効
			}
			if(st && et && st >= et){
				this.addError(Constant.ERROR_EMPTY_OR_INVALID, ['時間']); // 未入力または無効
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
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			var item6 = this.getItem(5);
			if(item6){
				try{
					this.timeTable = this.getRestTimes(item6, 2); // 休憩時間
				}catch(e){
					this.addError(e.getErrorLevel(), e.getMessage());
				}
			}
			return true;
		},
		getReviseElements: function(oldVals, newVals, restTimes){
			var oldSt = oldVals.startEnd[0].from;
			var oldEt = oldVals.startEnd[0].to;
			var newSt = newVals.startEnd[0].from;
			var newEt = newVals.startEnd[0].to;
			var oldRt = oldVals.rests;
			var newRt = (newSt === null && newEt === null) ? restTimes : newVals.rests;
			var revSt = (oldSt === newSt ? '0' : (oldSt === null ? '2' : '1'));
			var revEt = (oldEt === newEt ? '0' : (oldEt === null ? '2' : '1'));
			var revRt = '0';
			if(oldRt.length != newRt.length){
				revRt = '1';
			}else{
				oldRt = oldRt.sort(function(a, b){
					var na = (typeof(a.from) == 'number' ? a.from : a.to);
					var nb = (typeof(b.from) == 'number' ? b.from : b.to);
					return na - nb;
				});
				newRt = newRt.sort(function(a, b){
					var na = (typeof(a.from) == 'number' ? a.from : a.to);
					var nb = (typeof(b.from) == 'number' ? b.from : b.to);
					return na - nb;
				});
				for(var i = 0 ; i < oldRt.length ; i++){
					if(oldRt[i].from != newRt[i].from || oldRt[i].to != newRt[i].to){
						revRt = '1';
					}
				}
			}
			return {
				revise: revRt + revEt + revSt,
				content: this.getContent(revRt, revEt, revSt, oldVals, newVals)
			};
		},
		getContent: function(revRt, revEt, revSt, oldVals, newVals){
			var oldRt = null, newRt = null;
			if (revRt != '0') {
				var or = [], nr = [];
				for(var i = 0 ; i < oldVals.rests.length ; i++){
					var rests = oldVals.rests;
					or.push(Util.getLabel('tm10010461', Util.formatTime(rests[i].from), Util.formatTime(rests[i].to)));
				}
				for(var i = 0 ; i < newVals.rests.length ; i++){
					var rests = newVals.rests;
					nr.push(Util.getLabel('tm10010461', Util.formatTime(rests[i].from), Util.formatTime(rests[i].to)));
				}
				oldRt = or.join(', ');
				newRt = nr.join(', ');
			}
			var para = Current.isParallelMessage();
			var noMod = Util.getLabel(para ? 'zw00102200' : 'zv00102200'); // 修正なし
			var noEnt = Util.getLabel(para ? 'zw00102190' : 'zv00102190'); // 未入力
			var noInp = Util.getLabel(para ? 'zw00102210' : 'zv00102210'); // 入力なし
			var contss = [
				[
					Util.getLabel(para ? 'zw00102160' : 'zv00102160'), // 出社時刻
					(revSt == '0' ? noMod : (oldVals.startEnd[0].from === null ? noEnt : Util.formatTime(oldVals.startEnd[0].from))), // 修正前の値
					(revSt == '0' ? null  : (newVals.startEnd[0].from === null ? noInp : Util.formatTime(newVals.startEnd[0].from)))  // 修正後の値
				],
				[
					Util.getLabel(para ? 'zw00102170' : 'zv00102170'), // 退社時刻
					(revEt == '0' ? noMod : (oldVals.startEnd[0].to === null ? noEnt : Util.formatTime(oldVals.startEnd[0].to))), // 修正前の値
					(revEt == '0' ? null  : (newVals.startEnd[0].to === null ? noInp : Util.formatTime(newVals.startEnd[0].to)))  // 修正後の値
				],
				[
					Util.getLabel(para ? 'zw00102180' : 'zv00102180'), // 休憩時間
					(revRt == '0' ? noMod : (!oldRt ? noInp : oldRt)), // 修正前の値
					(revRt == '0' ? null  : (!newRt ? noInp : newRt))  // 修正後の値
				]
			];
			var parts = [];
			for(var i = 0 ; i < contss.length ; i++){
				var conts = contss[i];
				var fmt = (para ? 'zw00102140' : 'zv00102140'); // {0}・・{1} → {2}
				if(!conts[2]){
					fmt = (para ? 'zw00102150' : 'zv00102150'); // {0}・・{1}
				}
				parts.push(Util.getLabel(fmt, conts[0], conts[1], conts[2]));
			}
			return parts.join('\n');
		},
		/**
		 * applyEmpDay に渡す引数
		 * @see tsext.testAssist.EntryBase2.execute
		 */
		getApplyEmpDayRequest: function(){
			var month = Current.getMonth();
			var apply = Current.getCanceldApply(Constant.APPLY_TYPE_REVISE_TIME, this.getStartDate());
			var sd = this.getStartDate();
			var ed = this.getEndDate();
			var st = this.getStartTime();
			var et = this.getEndTime();
			var pattern = Current.getPatternByDate(sd) || {};
			var oldVals = Current.getReviseOldValues(sd);
			var newVals = { startEnd:[], rests:[], aways:oldVals.aways };
			newVals.startEnd.push({from:(st||null),to:(et||null),type:1});
			newVals.rests = newVals.rests.concat(this.timeTable);
			var reviseEL = this.getReviseElements(oldVals, newVals, pattern.restTimes)
			return {
				empId 				: Current.getEmpId(),
				month 				: month.yearMonth,
				startDate 			: month.startDate,
				lastModifiedDate	: month.lastModifiedDate,
				date				: this.getStartDate(),
				apply: {
					id				: (apply && apply.id) || null,
					applyType		: Constant.APPLY_TYPE_REVISE_TIME,
					startDate		: sd,
					endDate			: sd,
					timeTable		: Util.toJson(newVals.startEnd.concat(newVals.rests.concat(newVals.aways))),
					oldValue		: Util.toJson(oldVals.startEnd.concat(oldVals.rests.concat(oldVals.aways))),
					reviseType		: reviseEL.revise,
					content			: reviseEL.content,
					note			: this.getNote()
				}
			};
		}
	});
});
