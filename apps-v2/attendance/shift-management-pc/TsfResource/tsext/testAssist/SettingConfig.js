define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/service/Request",
	"tsext/testAssist/EntryBase1",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/testAssist/DefaultSettings",
	"tsext/util/TsError",
	"tsext/util/TimeUtil",
	"tsext/util/Util"
], function(declare, lang, array, str, Request, EntryBase1, Current, Constant, DefaultSettings, TsError, TimeUtil, Util){
	// 勤怠設定の改定用
	return declare("tsext.testAssist.SettingConfig", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor: function(args, lineNo){
			this.config = DefaultSettings.getDefaultConfig();
			this.origin = false;
			if(this.getSubKey() == Constant.KEY_CONFIG){
				if(this.getOption() == Constant.OPTION_REV // 改定
				|| this.getOption() == Constant.OPTION_CHANGE){ // 変更
					this.setContinued(true);
				}else{
					this.addError(Constant.ERROR_UNDEFINED); // 未定義
				}
				this.config.Name = this.getItem(0); // 名称
				var item2 = this.getItem(1);
				if(/^ORIGIN$/i.test(item2)){
					this.origin = true;
				}else{
					try {
						this.yearMonth = this.getYm(item2, (this.getOption() == Constant.OPTION_CHANGE)).yearMonth;
					}catch(e){
						this.addError(e.getErrorLevel(), e.getMessage());
					}
				}
			}
		},
		/**
		 * @param {tsext.testAssist.Setting} el
		 */
		setSetting: function(el){
			var item1 = el.getItem(0);
			var item2 = el.getItem(1);
			if(this.MN(item1, Constant.SET_WORKSYSTM)                ){ try{ this.config.WorkSystem__c             = this.getWorkSystem(item2);     }catch(e){ this.addNgElement(el,e); } // 労働時間制
			}else if(this.MN(item1, Constant.SET_PERIOD)             ){ try{ this.config.VariablePeriod__c         = this.getVariablePeriod(item2); }catch(e){ this.addNgElement(el,e); } // 変形期間
			}else if(this.MN(item1, Constant.SET_WEEKLY_HOLIDAY)     ){ try{ this.config.Holidays__c               = this.getHolidays(item2);       }catch(e){ this.addNgElement(el,e); } // 休日
			}else if(this.MN(item1, Constant.SET_AUTO_LEGAL_HOLIDAY) ){ try{ this.config.AutoLegalHoliday__c       = this.getBoolean(item2);        }catch(e){ this.addNgElement(el,e); } // 法定休日の自動判定
			}else if(this.MN(item1, Constant.SET_PUBLIC_HOLIDAY)     ){ try{ this.config.NonPublicHoliday__c       = this.getBoolean(item2, true);  }catch(e){ this.addNgElement(el,e); } // 祝日
			}else if(this.MN(item1, Constant.SET_START_END_WORK_TIME)){ // 始業終業
				try{
					var o = this.getStartEndTime(item2);
					this.config.StdStartTime__c = o.st;
					this.config.StdEndTime__c   = o.et;
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_REGULAR_WORK_TIME)  ){ try{ this.config.StandardFixTime__c        = this.getTime(item2, false);    }catch(e){ this.addNgElement(el,e); } // 所定労働時間
			}else if(this.MN(item1, Constant.SET_BREAK_TIME)         ){ try{ this.config.RestTimes__c              = this.getRestTimes(item2);      }catch(e){ this.addNgElement(el,e); } // 休憩時間
			}else if(this.MN(item1, Constant.SET_USE_HALF_HOLIDAY)   ){ try{ this.config.UseHalfHoliday__c         = this.getBoolean(item2);        }catch(e){ this.addNgElement(el,e); } // 半日休暇取得可
			}else if(this.MN(item1, Constant.SET_HALF_AM_TIME)       ){ // 午前半休適用時間
				try{
					var o = this.getStartEndTime(item2);
					this.config.AmHolidayStartTime__c = o.st;
					this.config.AmHolidayEndTime__c   = o.et;
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_HALF_PM_TIME)       ){ // 午後半休適用時間
				try{
					var o = this.getStartEndTime(item2);
					this.config.PmHolidayStartTime__c = o.st;
					this.config.PmHolidayEndTime__c   = o.et;
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_USE_HALF_BREAK_TIME)){ try{ this.config.UseHalfHolidayRestTime__c = this.getBoolean(item2);        }catch(e){ this.addNgElement(el,e); } // 半休取得時の休憩時間
			}else if(this.MN(item1, Constant.SET_AM_HOLIDAY_BREAK)   ){ try{ this.config.AmHolidayRestTimes__c     = this.getRestTimes(item2);      }catch(e){ this.addNgElement(el,e); } // 午前半休時休憩時間
			}else if(this.MN(item1, Constant.SET_PM_HOLIDAY_BREAK)   ){ try{ this.config.PmHolidayRestTimes__c     = this.getRestTimes(item2);      }catch(e){ this.addNgElement(el,e); } // 午後半休時休憩時間
			// 詳細設定
			}else if(this.MN(item1, Constant.SET_WEEKLY_LEGAL_TIME)  ){ try{ this.config.LegalTimeOfWeek__c        = this.getTime(item2, false);    }catch(e){ this.addNgElement(el,e); } // 週の法定労働時間
			}else if(this.MN(item1, Constant.SET_BASE_TIME)          ){ try{ this.config.BaseTime__c               = this.getTime(item2, false);    }catch(e){ this.addNgElement(el,e); } // 時間単位休の基準時間(年次有給休暇用)
			}else if(this.MN(item1, Constant.SET_BASE_TIME_FOR_STOCK)){ try{ this.config.BaseTimeForStock__c       = this.getTime(item2, false);    }catch(e){ this.addNgElement(el,e); } // 時間単位休の基準時間(日数管理休暇用)
			}else if(this.MN(item1, Constant.SET_IGNORE_NIGHT_CHARGE)){ try{ this.config.IgonreNightWork__c        = this.getBoolean(item2);        }catch(e){ this.addNgElement(el,e); } // 深夜労働割増
			}else if(this.MN(item1, Constant.SET_OFFSET_OVER_DEDUCT) ){ try{ this.config.DeductWithFixedTime__c    = this.getBoolean(item2);        }catch(e){ this.addNgElement(el,e); } // 残業と控除の相殺
			}else if(this.MN(item1, Constant.SET_DAIQ_IS_WORK_TIME)  ){ try{ this.config.HalfDaiqReckontoWorked__c = this.getBoolean(item2);        }catch(e){ this.addNgElement(el,e); } // 代休は勤務時間とみなす
			}else if(this.MN(item1, Constant.SET_BAN_BORDER_REST)    ){ try{ this.config.Config__c.prohibitBorderRestTime = this.getBoolean(item2); }catch(e){ this.addNgElement(el,e); } // 出退社時刻を含む休憩不可
			}else if(this.MN(item1, Constant.SET_HIGHLIGHT_LATE_EARLY)){ try{ this.config.HighlightLateEarly__c    = this.getBoolean(item2);        }catch(e){ this.addNgElement(el,e); } // 遅刻・早退を強調表示する
			}else if(this.MN(item1, Constant.SET_INPUT_AFTER_APPROVED)){ try{ this.config.ProhibitInputTimeUntilApproved__c = this.getBoolean(item2);}catch(e){ this.addNgElement(el,e); } // (休日出勤申請または振替申請が)承認されるまで勤務時間の入力不可
			}else if(this.MN(item1, Constant.SET_DISCRETIONARY)      ){ try{ this.config.UseDiscretionary__c       = this.getBoolean(item2);        }catch(e){ this.addNgElement(el,e); } // 裁量労働
			}else if(this.MN(item1, Constant.SET_PERMIT_UPDATE_LEVEL)){ try{ this.config.PermitUpdateTimeLevel__c = this.getPermitUpdateTimeLevel(item2);}catch(e){ this.addNgElement(el,e); } // 勤務時間を修正できる社員
			}else if(this.MN(item1, Constant.SET_TIME_ROUND)         ){ try{ this.config.TimeRound__c             = this.getTimeRound(item2);       }catch(e){ this.addNgElement(el,e); } // 時刻の丸め
			}else if(this.MN(item1, Constant.SET_TIME_ROUND_BEGIN)   ){ try{ this.config.TimeRoundBegin__c        = this.getTimeRoundUpDown(item2); }catch(e){ this.addNgElement(el,e); } // 出社時刻の端数処理
			}else if(this.MN(item1, Constant.SET_TIME_ROUND_END)     ){ try{ this.config.TimeRoundEnd__c          = this.getTimeRoundUpDown(item2); }catch(e){ this.addNgElement(el,e); } // 退社時刻の端数処理
			}else if(this.MN(item1, Constant.SET_TIME_FORMAT)        ){ try{ this.config.TimeFormat__c            = this.getTimeFormat(item2);      }catch(e){ this.addNgElement(el,e); } // 時刻表示形式
			}else if(this.MN(item1, Constant.SET_MAN_HOURS_TIMESHEET)){ try{ this.config.InputWorkingTimeOnWorkTimeView__c = this.getBoolean(item2);}catch(e){ this.addNgElement(el,e); } // 勤務表で工数入力
			}else if(this.MN(item1, Constant.SET_WORK_ACROSS_NEXTDAY)){ // 翌日にまたがる勤務時間の取扱い
				try{
					if(item2 == '法定休日を分けて計算する'){
						this.config.ExtendDayType__c = false;
						this.config.ClassificationNextDayWork__c = '0';
					}else if(item2 == '所定休日、法定休日を分けて計算する'){
						this.config.ExtendDayType__c = false;
						this.config.ClassificationNextDayWork__c = '1';
					}else if(item2 == '1暦日で計算する'){
						this.config.ExtendDayType__c = true;
						this.config.ClassificationNextDayWork__c = '0';
					}else{
						throw new TsError(Constant.ERROR_INVALID_VALUE);
					}
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_INPUT_OVER_24)){ // 24:00以降の入力
				try{
					if(item2 == '勤務日種別が異なる場合は不可'){
						this.config.LeavingAcrossNextDay__c = '1';
					}else if(item2 == '休日出勤の場合は不可'){
						this.config.LeavingAcrossNextDay__c = '2';
					}else if(!item2){
						this.config.LeavingAcrossNextDay__c = '0';
					}else{
						throw new TsError(Constant.ERROR_INVALID_VALUE);
					}
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_REST_TIME_CHECK)){ // 法定休憩時間のチェック
				try{
					var rtc = [];
					if(item2){
						var parts = item2.split(/[,\|]/);
						for(var i = 0 ; i < parts.length ; i++){
							var part = parts[i];
							var vs = part.split(/\->/);
							var m1 = /^(ON|OFF)?(\d+:\d+)?/.exec(vs[0]);
							var m2 = (vs.length > 1 ? /^(\d+:\d+)?/.exec(vs[1]) : null);
							var m3 = (vs.length > 2 ? /^(ON|OFF)?(\d+:\d+)?/.exec(vs[2]) : null);
							var rtObj = {check: false, workTime: 360, restTime: 45, push: false, offset: null};
							if(m1 && m2){
								rtObj.check    = (m1[1] && m1[1] == 'ON');
								rtObj.workTime = (m1[2] ? this.getTime(m1[2], true) : null);
								rtObj.restTime = (m2[1] ? this.getTime(m2[1], true) : null);
								if(rtObj.check && (rtObj.workTime === null || rtObj.restTime === null)){
									rtObj.check = false;
								}
								if(m3){
									rtObj.push   = (m3[1] && m3[1] == 'ON');
									rtObj.offset = (m3[2] ? this.getTime(m3[2], true) : null);
									if(rtObj.push && rtObj.offset === null){
										rtObj.push = false;
									}
								}
								rtc.push(rtObj);
							}else if(vs[0] == 'OFF'){
								continue;
							}else{
								throw new TsError(Constant.ERROR_INVALID_VALUE);
							}
						}
						this.config.RestTimeCheck__c = rtc;
					}
				}catch(e){
					this.addNgElement(el,e);
				}
			// 申請関連設定
			}else if(this.MN(item1, Constant.SET_USE_APPROVAL_PROCESS)){ try{ this.config.UseWorkFlow__c              = this.getBoolean(item2);         }catch(e){ this.addNgElement(el,e); } // 承認ワークフロー
			}else if(this.MN(item1, Constant.SET_USE_APPROVER_SETTING)){ try{ this.config.UseApplyApproverTemplate__c = this.getBoolean(item2);         }catch(e){ this.addNgElement(el,e); } // 承認者設定
			}else if(this.MN(item1, Constant.SET_APPLY_HOLIDAY_WORK) ){ // 休日出勤申請
				try{
					if(item2 == '複数申請可'){
						this.config.UseHolidayWorkFlag__c = 4;
					}else{
						this.config.UseHolidayWorkFlag__c = (this.getBoolean(item2,true)? 1 : 0);
					}
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_HOLIDAY_WORK_BREAK) ){ // 休日出勤申請で休憩時間の変更を許可
				try{
					this.config.Config__c.empApply.holidayWorkRestChangeable = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_APPLY_EXCHANGE)     ){ try{ this.config.UseMakeupHoliday__c   = this.getBoolean(item2);                }catch(e){ this.addNgElement(el,e); } // 振替申請
			}else if(this.MN(item1, Constant.SET_EXCHANGE_ON_LIMIT)  ){ try{ this.config.ExchangeLimit2__c     = this.getExchangeLimit(item2,1);        }catch(e){ this.addNgElement(el,e); } // 振替申請で振替勤務日を選択できる期間
			}else if(this.MN(item1, Constant.SET_EXCHANGE_OFF_LIMIT) ){ try{ this.config.ExchangeLimit__c      = this.getExchangeLimit(item2,12);       }catch(e){ this.addNgElement(el,e); } // 振替申請で振替休日を選択できる期間
			}else if(this.MN(item1, Constant.SET_EXCHANGE_BAN_ALL_ON)){ // 週内の法定休日がなくなる振替を禁止
				try{
					this.config.ProhibitApplicantEliminatingLegalHoliday__c = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_APPLY_SHIFTCHANGE)  ){ // シフト振替申請
				try{
					this.config.Config__c.empApply.useShiftChange = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_APPLY_PATTERNS)     ){ try{ this.config.ChangePattern__c      = (this.getBoolean(item2)?'1':'0');      }catch(e){ this.addNgElement(el,e); } // 勤務時間変更申請
			}else if(this.MN(item1, Constant.SET_SELF_SHIFT)         ){ try{ this.config.ChangeShift__c        = (this.getBoolean(item2)?'1':'0');      }catch(e){ this.addNgElement(el,e); } // シフト可
			}else if(this.MN(item1, Constant.SET_SELF_DAYTYPE)       ){ try{ this.config.ChangeDayType__c      = this.getBoolean(item2);                }catch(e){ this.addNgElement(el,e); } // 平日・休日変更を許可
			}else if(this.MN(item1, Constant.SET_SELF_LEGAL_HOLIDAY) ){ // 法定休日を指定可
				try{
					this.config.Config__c.empApply.allowSelectionOfLegalHoliday = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_PROHIBIT_WS_CHANGE) ){ // 勤務パターンの指定不可
				try{
					this.config.Config__c.empApply.prohibitWorkShiftChange = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_APPLY_OVER_WORK)    ){ // 残業申請
				try{
					var obj = this.getOverApplyFlag(item2, this.config.OverTimeBorderTime__c);
					this.config.UseOverTimeFlag__c    = obj.flag;
					this.config.OverTimeBorderTime__c = obj.borderTime;
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_MUST_OVER_APPLY)    ){ // 残業申請必須境界
				try{
					this.config.Config__c.empApply.overTimeRequireTime = this.getInteger(item2,false,0,999);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_BULK_OVER_APPLY)    ){ // 残業申請を期間で申請可
				try{
					this.config.Config__c.empApply.useBulkOverTime = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_OVER_APPLY_INIT_FLEX)){ // 残業申請の初期値をフレックス時間に合わせる
				try{
					this.config.Config__c.empApply.overTimeInitOverFlexZone = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_APPLY_MONTHLY_OVER) ){ // 月次残業申請
				try{
					this.config.Config__c.empApply.useMonthlyOverTimeApply = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_MONTHLY_OVER_MUST)  ){ // 月次残業申請必須
				try{
					this.config.Config__c.empApply.monthlyOverTimeRequireFlag = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_MONTHLY_OVER_BORDER)){ // 月次残業申請必須境界
				try{
					this.config.Config__c.empApply.monthlyOverTimeRequireTime = this.getInteger(item2,true,0,9999);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_MONTHLY_OVER_DUPL)  ){ // 月次残業申請複数申請可
				try{
					this.config.Config__c.empApply.monthlyOverTimeDupl = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_APPLY_EARLY_WORK)   ){ // 早朝勤務申請
				try{
					var obj = this.getOverApplyFlag(item2, this.config.EarlyWorkBorderTime__c);
					this.config.UseEarlyWorkFlag__c    = obj.flag;
					this.config.EarlyWorkBorderTime__c = obj.borderTime;
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_MUST_EARLY_APPLY)   ){ // 早朝勤務申請必須境界
				try{
					this.config.Config__c.empApply.earlyWorkRequireTime = this.getInteger(item2,false,0,999);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_BULK_EARLY_APPLY)    ){ // 早朝勤務申請を期間で申請可
				try{
					this.config.Config__c.empApply.useBulkEarlyWork = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_EARLY_WORK_INIT_FLEX)){ // 早朝勤務申請の初期値をフレックス時間に合わせる
				try{
					this.config.Config__c.empApply.earlyWorkInitOverFlexZone = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_APPLY_LATESTART)    ){ try{ this.config.UseLateStartApply__c  = this.getBoolean(item2);                }catch(e){ this.addNgElement(el,e); } // 遅刻申請
			}else if(this.MN(item1, Constant.SET_MUST_LATESTART)     ){ // 遅刻申請必須
				try{
					this.config.Config__c.empApply.requireLateApply = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_APPLY_EARLYEND)     ){ try{ this.config.UseEarlyEndApply__c   = this.getBoolean(item2);                }catch(e){ this.addNgElement(el,e); } // 早退申請
			}else if(this.MN(item1, Constant.SET_MUST_EARLYEND)      ){ // 早退申請必須
				try{
					this.config.Config__c.empApply.requireEarlyEndApply = this.getBoolean(item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_APPLY_DIRECT)       ){ try{ this.config.UseDirectApply__c     = this.getBoolean(item2);                }catch(e){ this.addNgElement(el,e); } // 直行・直帰申請
			}else if(this.MN(item1, Constant.SET_DIRECT_WORKTYPES)   ){ // 直行・直帰申請作業区分
				try{
					this.config.WorkTypeList__c = (item2 ? item2.split(/[,\|]/).join('\n') : null);
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_APPLY_REVISE_TIME)  ){ try{ this.config.UseReviseTimeApply__c = this.getBoolean(item2);                }catch(e){ this.addNgElement(el,e); } // 勤怠時刻修正申請
			}else if(this.MN(item1, Constant.SET_APPLY_DAILY_FIX)    ){ try{ this.config.UseDailyApply__c      = this.getBoolean(item2);                }catch(e){ this.addNgElement(el,e); } // 日次確定
			}else if(this.MN(item1, Constant.SET_DAILY_FIX_BUTTON)   ){ try{ this.config.SeparateDailyFixButton__c = this.getBoolean(item2);            }catch(e){ this.addNgElement(el,e); } // 勤務表上(日付欄)にボタンを表示する
			}else if(this.MN(item1, Constant.SET_DAILY_FIX_APPROVER) ){ // 日次確定申請の承認者
				try{
					if(item2 == '上長'){
						this.config.DailyApprover__c = '0';
					}else if(item2 == 'ジョブリーダー'){
						this.config.DailyApprover__c = '1';
					}else{
						throw new TsError(Constant.ERROR_INVALID_VALUE);
					}
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_DAILY_FIX_CHECK)    ){ try{ this.config.CheckDailyFixLeak__c = (this.getBoolean(item2) ? 1 : 0);       }catch(e){ this.addNgElement(el,e); } // 日次確定申請漏れのチェック
			}else if(this.MN(item1, Constant.SET_CHECK_TIME_DAILY)   ){ try{ this.config.CheckWorkingTime__c  = this.getBoolean(item2);                 }catch(e){ this.addNgElement(el,e); } // 日次確定時に工数入力時間をチェック
			}else if(this.MN(item1, Constant.SET_CHECK_TIME_MONTHLY) ){ try{ this.config.CheckWorkingTimeMonthly__c  = this.getBoolean(item2);          }catch(e){ this.addNgElement(el,e); } // 月次確定時に工数入力時間をチェック
			}else if(this.MN(item1, Constant.SET_CHECK_EMPTY)        ){ try{ this.config.Config__c.requireDailyInput = this.getBoolean(item2);          }catch(e){ this.addNgElement(el,e); } // 勤怠入力必須
			// フレックスタイム設定
			}else if(this.MN(item1, Constant.SET_FLEX_TIME)          ){ // フレックス時間帯
				try{
					var o = this.getStartEndTime(item2);
					this.config.FlexStartTime__c = o.st;
					this.config.FlexEndTime__c   = o.et;
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_USE_CORE_TIME)      ){ try{ this.config.UseCoreTime__c       = this.getBoolean(item2);                 }catch(e){ this.addNgElement(el,e); } // コア時間を設定する
			}else if(this.MN(item1, Constant.SET_CORE_TIME)          ){ // コア時間
				try{
					var o = this.getStartEndTime(item2);
					this.config.CoreStartTime__c = o.st;
					this.config.CoreEndTime__c   = o.et;
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_SHOW_CORE_TIME)     ){ try{ this.config.CoreTimeGraph__c     = this.getBoolean(item2);                 }catch(e){ this.addNgElement(el,e); } // コア時間を表示する
			}else if(this.MN(item1, Constant.SET_FLEX_MONTHLY_TIME)  ){ // 月の所定労働時間
				try{
					if(item2 == '自動'){
						this.config.FlexFixOption__c = '2';
					}else{
						this.config.FlexFixOption__c = '1';
						this.config.FlexFixMonthTime__c = this.getTime(item2);
					}
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_ADJUST_LEGAL_TIME)  ){ try{ this.config.FlexLegalWorkTimeOption__c = '' + this.getInteger(item2,false,0,1); }catch(e){ this.addNgElement(el,e); } // 法定労働時間調整
			// 入退館管理設定
			}else if(this.MN(item1, Constant.SET_USE_ACCESS_CONTROL) ){ try{ this.config.UseAccessControlSystem__c  = this.getBoolean(item2);           }catch(e){ this.addNgElement(el,e); } // 入退館管理
			}else if(this.MN(item1, Constant.SET_PERMIT_DIVERGENCE)  ){ try{ this.config.PermitDivergenceTime__c   = this.getInteger(item2,false,0,99); }catch(e){ this.addNgElement(el,e); } // 乖離許容時間(分)
			}else if(this.MN(item1, Constant.SET_WEEKDAY_ACCESS_BASE)){ try{ this.config.WeekDayAccessBaseTime__c   = this.getTime(item2);              }catch(e){ this.addNgElement(el,e); } // 入退館基準時間(平日)
			}else if(this.MN(item1, Constant.SET_HOLIDAY_ACCESS_BASE)){ try{ this.config.HolidayAccessBaseTime__c   = this.getTime(item2);              }catch(e){ this.addNgElement(el,e); } // 入退館基準時間(休日)
			}else if(this.MN(item1, Constant.SET_DAYFIX_PRE_DIVERGE) ){ try{ this.config.PermitDailyApply__c        = this.getBoolean(item2);           }catch(e){ this.addNgElement(el,e); } // 乖離判定前の日次確定許可
			}else if(this.MN(item1, Constant.SET_MONTHFIX_ON_DIVERGE)){ try{ this.config.PermitMonthlyApply__c      = this.getBoolean(item2);           }catch(e){ this.addNgElement(el,e); } // 乖離発生時の月次確定許可
			}else if(this.MN(item1, Constant.SET_MS_ACCESS_INFO)     ){ try{ this.config.MsAccessInfo__c            = this.getBoolean(item2);           }catch(e){ this.addNgElement(el,e); } // 月次サマリーに入退館情報を表示
			// 36協定上限設定
			}else if(this.MN(item1, Constant.SET_OVERTIME_MONTH_LIMIT  )){ try{ this.config.OverTimeMonthLimit__c   = this.getTime(item2, true);        }catch(e){ this.addNgElement(el,e); } // 月間時間外勤務限度時間
			}else if(this.MN(item1, Constant.SET_OVERTIME_YEAR_LIMIT   )){ try{ this.config.OverTimeYearLimit__c    = this.getTime(item2, true);        }catch(e){ this.addNgElement(el,e); } // 年間時間外勤務限度時間
			}else if(this.MN(item1, Constant.SET_OVERTIME_LHMONTH_LIMIT)){ try{ this.config.OverTimeLHMonthLimit__c = this.getTime(item2, true);        }catch(e){ this.addNgElement(el,e); } // 月間時間外勤務(法定休日含む)限度時間
			}else if(this.MN(item1, Constant.SET_OVERTIME_SPYEAR_LIMIT )){ try{ this.config.OverTimeSPYearLimit__c  = this.getTime(item2, true);        }catch(e){ this.addNgElement(el,e); } // 特別条項・年間時間外勤務限度時間
			}else if(this.MN(item1, Constant.SET_OVERTIME_SPCOUNT_LIMIT)){ try{ this.config.OverTimeSPCountLimit__c = this.getInteger(item2,true,0,6);  }catch(e){ this.addNgElement(el,e); } // 特別条項・月間時間外勤務限度超過限度回数
			// テレワーク勤務
			}else if(this.MN(item1, Constant.SET_USE_WORK_LOCATION)     ){ try{ this.config.UseWorkLocation__c      = this.getBoolean(item2);           }catch(e){ this.addNgElement(el,e); } // 勤務場所を使用する
			}else if(this.MN(item1, Constant.SET_REQUIRE_WORK_LOCATION) ){ try{ this.config.RequireWorkLocation__c  = this.getBoolean(item2);           }catch(e){ this.addNgElement(el,e); } // 勤務場所を必須とする
			}else{
				this.addNgElement(el, new TsError(Constant.ERROR_UNDEFINED)); // 未定義
			}
		},
		/**
		 * @param {tsext.testAssist.Setting} el
		 */
		setSetting2: function(el){
		},
		calcSetting: function(){
			if(typeof(this.config.StdStartTime__c) == 'number'
			&& typeof(this.config.StdEndTime__c) == 'number'){
				var rests = [];
				var rts = (this.config.RestTimes__c || '').split(/,/);
				for(var i = 0 ; i < rts.length ; i++){
					var rt = rts[i];
					var r = rt.split(/\-/);
					if(r.length == 2 && /^\d+$/.test(r[0]) && /^\d+$/.test(r[1])){
						rests.push({from:parseInt(r[0], 10), to:parseInt(r[1], 10)});
					}
				}
				rests = TimeUtil.mergeRanges(rests);
				var stdft = TimeUtil.spanTime(TimeUtil.excludeRanges([{from:this.config.StdStartTime__c,to:this.config.StdEndTime__c}], rests));
				if(this.config.StandardFixTime__c == null){
					this.config.StandardFixTime__c = stdft;
				}
				if(this.config.BaseTime__c == null){
					this.config.BaseTime__c = (new Decimal(stdft)).div(60).ceil().times(60).toNumber();
				}
				if(this.config.BaseTimeForStock__c == null){
					this.config.BaseTimeForStock__c = (new Decimal(stdft)).div(30).ceil().times(30).toNumber();
				}
			}
		},
		/**
		 * 入力直前のチェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			this.calcSetting();
			if(this.config.WorkSystem__c == '3'){ // 管理監督者の場合
				this.config.UseDiscretionary__c = true; // 裁量労働
				this.config.NightChargeOnly__c = true;  // 残業申請・早朝勤務申請は深夜割増のみ認める
			}
			if(this.getSubKey() == Constant.KEY_CONFIG){
				this.empType = null;
				try{
					this.empType = Current.getObjByName('empTypes', this.config.Name);
				}catch(e){
					this.addError(e.getErrorLevel(), e.getMessage());
				}
			}
			return this.inherited(arguments);
		},
		/**
		 * 労働時間制
		 * @param {string} v
		 * @return {string}
		 */
		getWorkSystem: function(v){
			if(v.startsWith('固定')){				return '0';
			}else if(v.startsWith('フレックス')){	return '1';
			}else if(v.startsWith('変形')){			return '2';
			}else if(v.startsWith('管理監督')){		return '3';
			}else{
				throw new TsError(Constant.ERROR_UNDEFINED);
			}
		},
		/**
		 * 変形期間
		 * @param {string} v
		 * @return {string}
		 */
		getVariablePeriod: function(v){
			var m = /^(1|2|3|6|12)/.exec(v);
			if(m){ // 1,2,3,6,12 のいずれか
				var n = m[1];
				if(v.indexOf('週') > 0){
					if(n == '1'){
						n = '0';
					}else{
						throw new TsError(Constant.ERROR_UNDEFINED);
					}
				}else if(v.indexOf('年') > 0){
					if(n == '1'){
						n = '12';
					}else{
						throw new TsError(Constant.ERROR_UNDEFINED);
					}
				}
				return n;
			}else{
				throw new TsError(Constant.ERROR_UNDEFINED);
			}
		},
		/**
		 * 休日
		 * @param {string} v
		 * @return {string}
		 */
		getHolidays: function(v){
			if(/^[012]{7}$/.test(v)){ // 0,1,2 で7桁
				return v;
			}
			var hs = '0000000';
			var ws = (v || '').split(/[,\|]/);
			if(!ws.length){
				throw new TsError(Constant.ERROR_UNDEFINED);
			}
			var mx = {};
			for(var i = 0 ; i < ws.length ; i++){
				var w = ws[i];
				var s = w.split(/[:：]/);
				if(s.length == 2){
					var s1 = s[0].trim();
					var s2 = s[1].trim();
					var x = "日月火水木金土".indexOf(s1);
					if(x >= 0 && !mx[x]){
						var dt = null;
						if(s2 == '法定休日'){
							dt = '2';
						}else if(s2 == '所定休日' || s2 == '休日'){
							dt = '1';
						}else if(s2 == '平日'){
							dt = '0';
						}
						if(dt){
							hs = hs.substring(0, x) + dt + hs.substring(x + 1);
						}else{
							throw new TsError(Constant.ERROR_UNDEFINED);
						}
						mx[x] = 1;
					}else{
						throw new TsError(Constant.ERROR_UNDEFINED);
					}
				}else{
					throw new TsError(Constant.ERROR_UNDEFINED);
				}
			}
			return hs;
		},
		/**
		 * 勤務時間を修正できる社員
		 * @param {string} value 
		 * @returns 
		 */
		getPermitUpdateTimeLevel : function(value){
			var v = ('' + (value || '')).trim();
			if(!v){
				return '0';
			}else if(/^\d$/.test(v)){
				return v;
			}else if(v.startsWith('本人以外')){
				return '1';
			}else if(v.startsWith('管理者のみ')){
				return '2';
			}else if(v.startsWith('全社員')){
				return '3';
			}else if(v.startsWith('制限なし') || v.startsWith('無制限')){
				return '0';
			}
			throw new TsError(Constant.ERROR_UNDEFINED); // 未定義
		},
		getTimeRound : function(value){
			var v = ('' + (value || '1')).trim();
			if(['1','5','10','15'].indexOf(v) >= 0){
				return v;
			}
			throw new TsError(Constant.ERROR_UNDEFINED); // 未定義
		},
		getTimeRoundUpDown : function(value){
			var v = ('' + (value || '')).trim();
			if(['切り捨て','切捨て','切捨','1'].indexOf(v) >= 0){
				return '1';
			}else if(['切り上げ','切上げ','切上','2'].indexOf(v) >= 0){
				return '2';
			}
			throw new TsError(Constant.ERROR_UNDEFINED); // 未定義
		},
		getTimeFormat : function(value){
			if(['hh:mm','10進数'].indexOf(value) >= 0){
				return value;
			}
			throw new TsError(Constant.ERROR_UNDEFINED); // 未定義
		},
		/**
		 * 振替申請の「～選択できる期間」の設定値を返す
		 * （設定値=AtkConfig__c.ExchangeLimit__c, ExchangeLimit2__c に格納する 0～12 の数値）
		 * @param {string} value 
		 * @param {number} maxN 1 or 12
		 * @returns 
		 */
		getExchangeLimit: function(value, maxN){
			var v = '' + value;
			if(!v){
				return null;
			}
			if(v.startsWith('当月')){
				return 0;
			}else if(v.startsWith('次月') || v.startsWith('翌月')){
				return 1;
			}
			// 上記以外は value の頭の数字を数値に変換して返す
			var m = /^(\d+)/.exec(v);
			if(m){
				var n = parseInt(m[1], 10);
				if(typeof(maxN) == 'number' && n > maxN){
					throw new TsError(Constant.ERROR_INVALID_VALUE); // 無効な値
				}
				return n;
			}
			throw new TsError(Constant.ERROR_UNDEFINED); // 未定義
		},
		/**
		 * 残業申請と早朝勤務申請のフラグ
		 * @param {string} v
		 * @return {Object}
		 */
		getOverApplyFlag: function(value, borderTime){
			var vs = value.split(/[,\|]/);
			var n = 0;
			var t = null;
			var obj = {
				flag: 0,
				borderTime: borderTime
			};
			for(var i = 0 ; i < vs.length ; i++){
				var v = vs[i].trim();
				if(v == '必須'){						n |= 1;
				}else if(v.startsWith('所定')){			n |= 2;
				}else if(v.startsWith('複数申請可')){	n |= 4;
				}else{
					var m = /(\d+:\d+)/.exec(v);
					if(m){
						t = this.getTime(m[1]);
					}
				}
			}
			if(n){
				var f = 0;
				switch(n){
				case 1: f = 2; break; // 必須
				case 3: f = 7; break; // 必須、所定
				case 4: f = 4; break; // 複数申請可
				case 5: f = 6; break; // 必須、複数申請可
				case 7: f = 8; break; // 必須、所定、複数申請可
				default: throw new TsError(Constant.ERROR_INVALID_VALUE);
				}
				obj.flag = f;
				if(t !== null){
					obj.borderTime = t;
				}else{
					if(obj.borderTime > 0){
						obj.borderTime *= (-1);
					}
				}
			}else{
				obj.flag = (this.getBoolean(value) ? 1 : 0);
				if(obj.borderTime > 0){
					obj.borderTime *= (-1);
				}
			}
			return obj;
		},
		getConfig: function(flag){
			var obj = lang.clone(this.config);
			if(flag){
				obj.Config__c        = Util.toJson(obj.Config__c);
				obj.RestTimeCheck__c = Util.toJson(obj.RestTimeCheck__c);
			}
			return obj;
		},
		activateConfig: function(obj){
			obj.Config__c        = Util.fromJson(obj.Config__c);
			obj.RestTimeCheck__c = Util.fromJson(obj.RestTimeCheck__c);
			return obj;
		},
		/**
		 * 最新の勤怠設定取得用のSOQL
		 * @return {string}
		 */
		getSoql: function(){
			var obj = DefaultSettings.getDefaultConfig();
			var keys = ['Id','Name','ConfigBaseId__c'].concat(Object.keys(obj));
			var soql = "select ${0} from AtkConfig__c where ConfigBaseId__c = '${1}' and OriginalId__c = null";
			return str.substitute(soql, [keys.join(','), this.empType.ConfigBaseId__c]);
		},
		/**
		 * 勤怠設定を読込
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			var soql = this.getSoql();
			console.log(soql);
			var chain = Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					this.oldConfigs = records;
					return bagged.stayResult();
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(this, this.execute2));
		},
		/**
		 * 勤怠設定を改定
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute2: function(bagged){
			if(bagged.stopped()){
				return;
			}
			bagged.outputLog(this.getEntryName());
			// 有効開始月の降順に並べ替え
			this.oldConfigs = this.oldConfigs.sort(function(a, b){
				return (b.ValidStartMonth__c || 0) - (a.ValidStartMonth__c || 0);
			});
			var req = {
				action: 'operateTestAssist'
			};
			// 最新の設定を得る
			var latest = this.oldConfigs[0];
			if(this.getOption() == Constant.OPTION_REV){ // 改定
				// 改定月≦最新の設定の改定月の場合はエラー
				if(latest.ValidStartMonth__c && latest.ValidStartMonth__c >= this.yearMonth){
					return bagged.doneResult(this.addError(Constant.ERROR_INVALID_REV_MONTH));
				}
				// 月度から開始日を得る
				var m = teasp.util.searchYearMonthDate(
						this.empType.ConfigBaseId__r.InitialDateOfMonth__c,
						this.empType.ConfigBaseId__r.MarkOfMonth__c,
						this.yearMonth);
				// 勤怠設定に有効開始月、有効開始日をセット
				var config = this.getConfig(true);
				config.ConfigBaseId__c = latest.ConfigBaseId__c;
				config.Generation__c = (latest.Generation__c || 0) + 1;
				config.ValidStartMonth__c = this.yearMonth;
				config.ValidStartDate__c = m.startDate;
				req.operateType = 'reviseConfig';
				req.config = config;
			}else{ // 変更
				if(this.origin){
					this.config = this.oldConfigs[this.oldConfigs.length - 1];
				}else if(this.yearMonth){
					var x = -1;
					for(var i = 0 ; i < this.oldConfigs.length ; i++){
						var oldConfig = this.oldConfigs[i];
						if(oldConfig.ValidStartMonth__c == this.yearMonth){
							x = i;
							break;
						}
					}
					if(x < 0){
						return bagged.doneResult(this.addError(Constant.ERROR_NOTFOUND));
					}
					this.config = this.oldConfigs[x];
				}else{ // 'ORIGIN'も月度も指定なしなら最新が変更対象
					this.config = latest;
				}
				this.activateConfig(this.config);
				this.config.StandardFixTime__c  = null;
				this.config.BaseTime__c         = null;
				this.config.BaseTimeForStock__c = null;
				for(var i = 0 ; i < this.getElements().length ; i++){
					this.setSetting(this.getElement(i));
				}
				this.calcSetting();
				var config = this.getConfig(true);
				req.operateType = 'changeConfig';
				req.config = config;
			}
			var chain = Current.request(req, bagged).then(
				lang.hitch(this, function(result){
					var resultObj = null;
					if(this.empType){
						resultObj = {
							result: 0,
							name: str.substitute('【勤怠設定】${0} ${1}', [(this.getOption() == Constant.OPTION_REV ? '改定' : '変更'), this.empType.Name]),
							href: tsCONST.empTypeEditView + '?empTypeId=' + this.empType.Id
						};
					}
					return bagged.stayResult(resultObj);
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(bagged, bagged.doneResult));
		}
	});
});
