define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/EntryBase1",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/testAssist/DefaultSettings",
	"tsext/util/TsError",
	"tsext/util/TimeUtil",
	"tsext/util/Util"
], function(declare, lang, array, str, EntryBase1, Current, Constant, DefaultSettings, TsError, TimeUtil, Util){
	// 勤務パターン
	return declare("tsext.testAssist.SettingPattern", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor: function(args, lineNo){
			this.pattern = DefaultSettings.getDefaultPattern();
			this.pattern.Name = this.getItem(0); // 名称
			if(this.getOption() == Constant.OPTION_NEW){ // オプション=新規
				this.setContinued(true);
			}else if(this.getOption() != Constant.OPTION_DELETE){
				this.addError(Constant.ERROR_UNDEFINED); // 未定義
			}
		},
		/**
		 * @param {tsext.testAssist.EntryBase1} el
		 */
		setSetting: function(el){
			var item1 = el.getItem(0);
			var item2 = el.getItem(1);
			if(this.MN(item1, Constant.SET_PATTERN_NAME)){
				this.pattern.Name = item2;
			}else if(this.MN(item1, Constant.SET_REGULAR_WORK_TIME)  ){ try{ this.pattern.StandardFixTime__c                = this.getTime(item2);         }catch(e){ this.addNgElement(el,e); } // 所定労働時間
			}else if(this.MN(item1, Constant.SET_BREAK_TIME)         ){ try{ this.pattern.RestTimes__c                      = this.getRestTimes(item2);    }catch(e){ this.addNgElement(el,e); } // 休憩時間
			}else if(this.MN(item1, Constant.SET_USE_HALF_HOLIDAY)   ){ try{ this.pattern.UseHalfHoliday__c                 = this.getBoolean(item2);      }catch(e){ this.addNgElement(el,e); } // 半日休暇取得可
			}else if(this.MN(item1, Constant.SET_USE_HALF_BREAK_TIME)){ try{ this.pattern.UseHalfHolidayRestTime__c         = this.getBoolean(item2);      }catch(e){ this.addNgElement(el,e); } // 半休取得時の休憩時間
			}else if(this.MN(item1, Constant.SET_AM_HOLIDAY_BREAK)   ){ try{ this.pattern.AmHolidayRestTimes__c             = this.getRestTimes(item2);    }catch(e){ this.addNgElement(el,e); } // 午前半休時休憩時間
			}else if(this.MN(item1, Constant.SET_PM_HOLIDAY_BREAK)   ){ try{ this.pattern.PmHolidayRestTimes__c             = this.getRestTimes(item2);    }catch(e){ this.addNgElement(el,e); } // 午後半休時休憩時間
			}else if(this.MN(item1, Constant.SET_IGNORE_NIGHT_CHARGE)){ try{ this.pattern.IgonreNightWork__c                = this.getBoolean(item2);      }catch(e){ this.addNgElement(el,e); } // 深夜労働割増
			}else if(this.MN(item1, Constant.SET_DISCRETIONARY)      ){ try{ this.pattern.UseDiscretionary__c               = this.getBoolean(item2);      }catch(e){ this.addNgElement(el,e); } // 裁量労働
			}else if(this.MN(item1, Constant.SET_SYMBOL)             ){ try{ this.pattern.Symbol__c                         = this.getStr(item2, true, 3); }catch(e){ this.addNgElement(el,e); } // 略称
			}else if(this.MN(item1, Constant.SET_BAN_REG_NORMAL)     ){ try{ this.pattern.ProhibitChangeWorkTime__c         = this.getBoolean(item2);      }catch(e){ this.addNgElement(el,e); } // 平日勤務の所定時間の変更を禁止
			}else if(this.MN(item1, Constant.SET_BAN_REG_HOLIDAY)    ){ try{ this.pattern.ProhibitChangeHolidayWorkTime__c  = this.getBoolean(item2);      }catch(e){ this.addNgElement(el,e); } // 休日出勤の所定時間の変更を禁止
			}else if(this.MN(item1, Constant.SET_BAN_REG_EXCHANGED)  ){ try{ this.pattern.ProhibitChangeExchangedWorkTime__c= this.getBoolean(item2);      }catch(e){ this.addNgElement(el,e); } // 休日の振替勤務日の所定時間の変更を禁止
			}else if(this.MN(item1, Constant.SET_SHIFT_SYNC_REGULTER)){ try{ this.pattern.WorkTimeChangesWithShift__c       = this.getBoolean(item2);      }catch(e){ this.addNgElement(el,e); } // シフトした勤務時間と所定勤務時間を連動させる
			}else if(this.MN(item1, Constant.SET_SHIFT_SYNC_START)   ){ try{ this.pattern.EnableRestTimeShift__c            = this.getBoolean(item2);      }catch(e){ this.addNgElement(el,e); } // シフト開始時刻に合わせて、所定休憩と半休の時間帯をずらす
			}else if(this.MN(item1, Constant.SET_NOT_USE_CORE)       ){ try{ this.pattern.DisableCoreTime__c                = this.getBoolean(item2);      }catch(e){ this.addNgElement(el,e); } // コア時間帯を使わない
			}else if(this.MN(item1, Constant.SET_START_END_WORK_TIME)){ // 始業終業
				try{
					var o = this.getStartEndTime(item2);
					this.pattern.StdStartTime__c = o.st;
					this.pattern.StdEndTime__c   = o.et;
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_HALF_AM_TIME)){ // 午前半休適用時間
				try{
					var o = this.getStartEndTime(item2);
					this.pattern.AmHolidayStartTime__c = o.st;
					this.pattern.AmHolidayEndTime__c   = o.et;
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_HALF_PM_TIME)){ // 午後半休適用時間
				try{
					var o = this.getStartEndTime(item2);
					this.pattern.PmHolidayStartTime__c = o.st;
					this.pattern.PmHolidayEndTime__c   = o.et;
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_PATTERN_RANGE)){ // 対象期間
				this.pattern.Range__c = (item2.startsWith('長') ? '2' : '1');
			}else{
				this.addNgElement(el, new TsError(Constant.ERROR_UNDEFINED)); // 未定義
			}
		},
		calcSetting: function(){
			if(typeof(this.pattern.StdStartTime__c) == 'number'
			&& typeof(this.pattern.StdEndTime__c) == 'number'){
				var rests = [];
				var rts = (this.pattern.RestTimes__c || '').split(/,/);
				for(var i = 0 ; i < rts.length ; i++){
					var rt = rts[i];
					var r = rt.split(/\-/);
					if(r.length == 2 && /^\d+$/.test(r[0]) && /^\d+$/.test(r[1])){
						rests.push({from:parseInt(r[0], 10), to:parseInt(r[1], 10)});
					}
				}
				rests = TimeUtil.mergeRanges(rests);
				var stdft = TimeUtil.spanTime(TimeUtil.excludeRanges([{from:this.pattern.StdStartTime__c,to:this.pattern.StdEndTime__c}], rests));
				if(this.pattern.StandardFixTime__c == null){
					this.pattern.StandardFixTime__c = stdft;
				}
			}
		},
		/**
		 * 入力直前のチェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			this.calcSetting();
			this.patternId = null;
			if(this.isDelete()){ // 削除
				try{
					this.patternId = Current.getIdByName('patterns', this.pattern.Name, false, true);
				}catch(e){
					this.addError(e.getErrorLevel(), e.getMessage());
				}
				if(!this.patternId){
					this.addError(Constant.ERROR_LEVEL_1, Constant.ERROR_NOTFOUND);
				}
			}else{
				if(Current.getIdByName('patterns', this.pattern.Name, true, true)){
					this.addError(Constant.ERROR_NAME_DUPLICATE2, ['勤務パターン']);
				}
			}
			return this.inherited(arguments);
		},
		getPattern: function(flag){
			var obj = lang.clone(this.pattern);
			return obj;
		},
		/**
		 * 勤務パターンを設定
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			bagged.outputLog(this.getEntryName());
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			var req = {
				action: 'operateTestAssist'
			};
			if(this.isDelete()){
				req.operateType = 'deletePattern';
				req.patternId = this.patternId;
			}else{
				req.operateType = 'settingPattern';
				req.pattern = this.getPattern(true);
			}
			var chain = Current.request(req, bagged).then(
				lang.hitch(this, function(result){
					var resultObj = null;
					if(result && result.result == 'NG'){
						resultObj = this.addError(result.message);
					}else if(result && result.pattern){
						resultObj = {
							result: 0,
							name: str.substitute('【勤務パターン】 ${0}', [result.pattern.Name]),
							href: '/' + result.pattern.Id
						};
					}
					return bagged.stayResult(resultObj);
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(this, function(bagged){
				if(bagged.stopped()){
					return;
				}
				Current.fetchMaster(bagged.getDistributor(), ['patterns']).then(
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
