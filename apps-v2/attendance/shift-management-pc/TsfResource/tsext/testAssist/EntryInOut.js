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
	// 打刻
	return declare("tsext.testAssist.EntryInOut", EntryBase2, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			this.awayTimes = [];
			this.awayClear = false;

			if(!this.mdate1){
				this.addError(Constant.ERROR_EMPTY_DATE); // 日付が未入力
			}
			// 公用外出時間
			if(this.etc1){
				if(/^(Clear|C)$/i.test(this.etc1)){
					this.awayClear = true;
				}else{
					var vals = (this.etc1 || '').split(/[,\|]/);
					var ng = false;
					for(var i = 0 ; (i < vals.length && !ng) ; i++){
						var val = vals[i];
						var vs = (val || '').split(/\-/);
						if(vs.length){
							var away = {
								from: (vs[0] ? Util.str2minutes(vs[0]) : null),
								to  : (vs.length > 1 && vs[1] ? Util.str2minutes(vs[1]) : null),
								type: teasp.constant.AWAY
							};
							if((vs[0] && away.from === null) || (vs.length > 1 && vs[1] && away.to === null)){
								this.addError(Constant.ERROR_INVALID_FORMAT, ['公用外出']);
								ng = true;
							}else{
								this.awayTimes.push(away);
							}
						}
					}
				}
			}
		},
		/**
		 * 休憩・公用外出時間
		 * @return {string|null}
		 */
		getTimeTable : function(){
			var pattern = Current.getPatternByDate(this.getStartDate());
			if(this.restDefault || this.ioClear){
				return Current.getDbTimeTable(pattern.restTimes);
			}
			const rests = this.restClear ? [] : this.resetRestType(this.restTimes, pattern.restTimes);
			return Current.getDbTimeTable(rests.concat(this.awayClear ? [] : this.awayTimes));
		},
		/**
		 * 休憩のtypeを再セットする
		 * @param {Array.<Object>} rests 入力する休憩時間。EntryBase2.constructorでtype=21がセットされている。
		 * @param {Array.<Object>} fixRests 所定休憩の設定
		 * @returns {Array.<Object>}
		 */
		resetRestType : function(rests, fixRests){
			array.forEach(rests, function(rest){
				if(rest.type == teasp.constant.REST_FIX){ // typeが所定休憩
					if(typeof(rest.from) == 'number' && typeof(rest.to) == 'number' && rest.from < rest.to){
						var fix = false;
						// 1件ずつ所定休憩の設定と比較して一致（または内側にある）する場合はそのまま所定休憩、
						// それ以外は無給休憩と判断してtypeを変更する
						array.some(fixRests, function(fixRest){
							if(fixRest.from <= rest.from && rest.to <= fixRest.to){
								fix = true;
								return true;
							}
						}, this);
						if(!fix){
							rest.type = teasp.constant.REST_FREE;
						}
					}else{
						rest.type = teasp.constant.REST_FREE;
					}
				}
			}, this);
			return rests;
		},
		/**
		 * 打刻情報を入力
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			var elements = [this].concat(this.getElements());
			var month = Current.getMonth();
			bagged.outputLog(this.getEntryName());
			var daymap = {};
			for(var i = 0 ; i < elements.length ; i++){
				var element = elements[i];
				var sd = element.getStartDate();
				var ed = element.getEndDate();
				var input = {
					startTime : element.getStartTime(),
					endTime   : element.getEndTime(),
					timeTable : element.getTimeTable(),
					note      : element.getNote()
				};
				var error = Current.loadInputDays(daymap, input, sd, ed);
				if(error){
					element.addError(error);
				}
			}
			var days = [];
			for(var d in daymap){
				if(daymap.hasOwnProperty(d)){
					days.push(daymap[d]);
				}
			}
			if(!days.length){
				bagged.stayResult({
					result: 0,
					note: Constant.LOG_NOTHING // 入力なし
				});
				Current.changeMonth(bagged, month).then(
					lang.hitch(this, function(){
						bagged.loopNext();
					}),
					lang.hitch(this, function(errmsg){
						bagged.doneResult(this.addError(errmsg));
					})
				);
				return;
			}
			month.days = days.sort(function(a, b){
				return (a.date < b.date ? -1 : 1);
			});
			var chain = Current.request(
				{
					action: 'operateTestAssist',
					operateType: 'inputInOut',
					empId: Current.getEmpId(),
					month: month
				},
				bagged
			).then(
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
				var month = Current.getMonth();
				Current.changeMonth(bagged, month).then(
					lang.hitch(this, function(){
						bagged.doneResult();
					}),
					lang.hitch(this, function(errmsg){
						bagged.doneResult(this.addError(errmsg));
					})
				);
			}));
		}
	});
});
