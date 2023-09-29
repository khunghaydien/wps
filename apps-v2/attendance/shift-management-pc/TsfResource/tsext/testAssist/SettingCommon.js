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
	"tsext/util/Util"
], function(declare, lang, array, str, EntryBase1, Current, Constant, DefaultSettings, TsError, Util){
	// 共通設定
	return declare("tsext.testAssist.SettingCommon", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor: function(args, lineNo){
			this.common = DefaultSettings.getDefaultCommon();
			if(this.getOption() == Constant.OPTION_CHANGE){
				this.setContinued(true);
			}else{
				this.addError(Constant.ERROR_UNDEFINED); // 未定義
			}
		},
		/**
		 * @param {tsext.testAssist.EntryBase1} el
		 */
		setSetting: function(el){
			var item1 = el.getItem(0);
			var item2 = el.getItem(1);

			if(      this.MN(item1,Constant.SET_REQUIRE_NOTE          )){try{this.common.RequireNote__c                    =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 申請時の備考入力を必須にする
			}else if(this.MN(item1,Constant.SET_DISABLED_TIMEREPORT   )){try{this.common.DisabledTimeReport__c             =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // タイムレポートを使用不可にする
			}else if(this.MN(item1,Constant.SET_DISABLED_EMPEXP       )){try{this.common.DisabledEmpExp__c                 =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 経費精算を使用不可にする
			}else if(this.MN(item1,Constant.SET_DISABLED_EMPJOB       )){try{this.common.DisabledEmpJob__c                 =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 工数実績を使用不可にする
			}else if(this.MN(item1,Constant.SET_USE_DATA_STORAGE      )){try{this.common.Config__c.useDataStorage          =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // データ保管機能を使用する
			}else if(this.MN(item1,Constant.SET_DATA_OUTPUT_OPTION    )){try{this.common.DataOutputOption__c               =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // データ出力オプションを追加する
			}else if(this.MN(item1,Constant.SET_NAMING_RULE           )){try{this.common.NamingRule__c                     =''+this.getInteger(item2,false,0,1);         }catch(e){this.addNgElement(el,e);} // 承認申請のタイトルと内容を日本語と英語の併記にする
			}else if(this.MN(item1,Constant.SET_COMMENT_IF_ABSENCE    )){try{this.common.CommentIfAbsence__c               =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 控除のある日は備考必須にする
			}else if(this.MN(item1,Constant.SET_COMMENT_IF_NOPUSHTIME )){try{this.common.CommentIfNoPushTime__c            =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 打刻なしは備考必須にする
			}else if(this.MN(item1,Constant.SET_CANCEL_MONTH_APPLY    )){try{this.common.CancelMonthApply__c               =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 本人が勤務確定承認取消可能
			}else if(this.MN(item1,Constant.SET_CANCEL_DAY_APPLY      )){try{this.common.CancelDayApply__c                 =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 本人が勤怠申請承認取消可能
			}else if(this.MN(item1,Constant.SET_INDICATE_NO_PUSHTIME  )){try{this.common.IndicateNoPushTime__c             =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 打刻なしを表示する
			}else if(this.MN(item1,Constant.SET_MAIL_EMPAPPLY_CANCELED)){try{this.common.mailEmpApplyCanceled__c           =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 勤怠申請の取消をメールする
			}else if(this.MN(item1,Constant.SET_USE_FIXED_BUTTON      )){try{this.common.UseFixedButton__c                 =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 定時打刻ボタンの使用
			}else if(this.MN(item1,Constant.SET_USE_RESTARTABLE       )){try{this.common.UseRestartable__c                 =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 退社後の再出社打刻可能
			}else if(this.MN(item1,Constant.SET_FLEX_GRAPH            )){try{this.common.FlexGraph__c                      =this.getDispOnOff(item2);                    }catch(e){this.addNgElement(el,e);} // フレックスで日ごとの残業を表示する
			}else if(this.MN(item1,Constant.SET_DISCRETIONARY_OPTION  )){try{this.common.DiscretionaryOption__c            =this.getDispOnOff(item2);                    }catch(e){this.addNgElement(el,e);} // 裁量労働／管理監督者で実労働時間を表示する
			}else if(this.MN(item1,Constant.SET_KEEP_EXTERIOR_TIME    )){try{this.common.KeepExteriorTime__c               =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 勤務時間外の休憩・公用外出を記録する
			}else if(this.MN(item1,Constant.SET_TREAT_LATE_START      )){try{this.common.TreatLateStart__c                 =''+this.getInteger(item2,false,0,2);         }catch(e){this.addNgElement(el,e);} // 遅刻取扱い
			}else if(this.MN(item1,Constant.SET_TREAT_EARLY_END       )){try{this.common.TreatEarlyEnd__c                  =''+this.getInteger(item2,false,0,2);         }catch(e){this.addNgElement(el,e);} // 早退取扱い
			}else if(this.MN(item1,Constant.SET_CHECK_DEFAULT_DAILYFIX)){try{this.common.CheckDefaultDailyFix__c           =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 退社打刻時の日次確定のデフォルトをオンにする
			}else if(this.MN(item1,Constant.SET_MS_WORKTIME_IS_REAL   )){try{this.common.MsDailyWorkTimeIsReal__c          =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 月次サマリーの日次の労働時間に実時間を表示
			}else if(this.MN(item1,Constant.SET_NOT_INFO_AUTO_VIEW    )){try{this.common.NotInfoAutoView__c                =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // お知らせの自動表示をしない
			}else if(this.MN(item1,Constant.SET_DISABLE_KINTAI_FEED   )){try{this.common.DisableKintaiFeed__c              =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 出社・退社時のChatterフィードを行わない
			}else if(this.MN(item1,Constant.SET_HANDLE_INVALID_APPLY  )){try{this.common.HandleInvalidApply__c             =this.getInteger(item2,false,0,1);            }catch(e){this.addNgElement(el,e);} // 取消または却下された申請の扱い
			}else if(this.MN(item1,Constant.SET_CLARIFY_AFTER_APPLY   )){try{this.common.ClarifyAfterApply__c              =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 事前申請と事後申請を区別する
			}else if(this.MN(item1,Constant.SET_PERMIT_LEAVING_PUSH24 )){try{this.common.permitLeavingPush24hours__c       =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 退社打刻は出社時刻から24時間後までとする
			}else if(this.MN(item1,Constant.SET_PERMIT_START_DAYCHANGE)){try{this.common.PermitStartBtnDateChange__c       =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 退社時刻未入力でも日付が変われば出社打刻可
			}else if(this.MN(item1,Constant.SET_HIDE_MONTHLY_SUMMARY  )){try{this.common.HideMonthlySummary__c             =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 勤務表の月次サマリーボタンを非表示にする
			}else if(this.MN(item1,Constant.SET_HIDE_BOTTOM_SUMMARY   )){try{this.common.HideBottomSummary__c              =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 勤務表の下部の集計値エリアを非表示にする
			}else if(this.MN(item1,Constant.SET_HIDE_TIME_GRAPH_POPUP )){try{this.common.HideTimeGraphPopup__c             =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 勤怠グラフのポップアップを非表示にする
			}else if(this.MN(item1,Constant.SET_SEPARATE_DAILY_NOTE   )){try{this.common.SeparateDailyNote__c              =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 申請の備考と日次の備考を保存時に結合しない
			}else if(this.MN(item1,Constant.SET_PROHIBIT_ACROSS_MONTH )){try{this.common.ProhibitAcrossMonthApply__c       =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 申請期間が月度をまたぐ申請を禁止する
			}else if(this.MN(item1,Constant.SET_LIMITED_TIME_DISTANCE )){try{this.common.LimitedTimeDistance__c            =this.getValueOfList(item2,false,['24','48']);}catch(e){this.addNgElement(el,e);} // 出社時刻から退社時刻の制限
			}else if(this.MN(item1,Constant.SET_DISABLE_CHATTER_PUSH  )){try{this.common.DisableChatterPushTime__c         =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // Chatter打刻を利用しない
			}else if(this.MN(item1,Constant.SET_PAID_RESTTIME_LIMIT   )){try{this.common.PaidRestTimeLimit__c              =this.getInteger(item2,false,0,99);           }catch(e){this.addNgElement(el,e);} // 時間単位有休の年間取得限度時間
			}else if(this.MN(item1,Constant.SET_PAID_REST_LIMIT_SYNC  )){try{this.common.Config__c.paidRestTimeLimitSyncYuq=this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 時間単位有休の起算日は、年次有給休暇の有効開始日を起算日とする
			}else if(this.MN(item1,Constant.SET_VALIDATE_MONTHLYFIX   )){try{this.common.Config__c.validateAllDayMonthlyFix=this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 月次確定時に勤務表を再チェックする
			}else if(this.MN(item1,Constant.SET_TS1_OPTIMIZE_OPTION   )){try{this.common.Config__c.ts1OptimizeOption       =''+this.getInteger(item2,false,1,2);         }catch(e){this.addNgElement(el,e);} // TeamSpirit1上で利用する勤務表の表示タイプ
			}else if(this.MN(item1,Constant.SET_FLEXIBLE_HALFDAY_TIME )){try{this.common.Config__c.flexibleHalfDayTime     =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // コア時間なしフレックスの半日休暇適用時間を使用しない
			}else if(this.MN(item1,Constant.SET_USE_ACCESS_CONTROL    )){try{this.common.UseAccessControlSystem__c         =this.getBoolean(item2,true);                 }catch(e){this.addNgElement(el,e);} // 入退館管理機能
			}else if(this.MN(item1,Constant.SET_LAST_ACCESS_LOG_TIME  )){try{this.common.LastAccessControlLogTime__c       =this.getDateTime(item2,true);                }catch(e){this.addNgElement(el,e);} // 最終入退館管理ログ連携時刻
			}else if(this.MN(item1,Constant.SET_DEFAULT_WORK_LOCATION )){
			}else{
				this.addNgElement(el, new TsError(Constant.ERROR_UNDEFINED)); // 未定義
			}
		},
		setSetting2: function(el){
			var item1 = el.getItem(0);
			var item2 = el.getItem(1);
			if(this.MN(item1,Constant.SET_DEFAULT_WORK_LOCATION )){
				try{
					this.common.DefaultWorkLocationId__c = Current.getIdByName('workLocations', item2);
				}catch(e){
					this.addNgElement(el,e);
				}
			}
		},
		getDispOnOff: function(item2){
			return this.getValueOfList(item2, false, ['表示しない','表示する']);
		},
		/**
		 * 入力直前のチェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			for(var i = 0 ; i < this.getElements().length ; i++){
				this.setSetting2(this.getElement(i));
			}
			return this.inherited(arguments);
		},
		getCommon: function(flag){
			var obj = lang.clone(this.common);
			if(flag){
				obj.Config__c = Util.toJson(obj.Config__c);
			}
			return obj;
		},
		/**
		 * システム設定
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			bagged.outputLog(this.getEntryName());
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			var req = {
				action: 'operateTestAssist',
				operateType: 'settingCommon',
				common: this.getCommon(true)
			};
			Current.request(req, bagged).then(
				lang.hitch(this, function(result){
					return bagged.doneResult({
						result: 0
					});
				}),
				lang.hitch(this, function(errmsg){
					return bagged.doneResult(this.addError(errmsg));
				})
			);
		}
	});
});
