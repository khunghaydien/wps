define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return new (declare("tsext.testAssist.DefaultSettings", null, {
		getDefaultCommon: function(){
			return {
				Config__c: {},
				UseAccessControlSystem__c: false
			};
		},
		getDefaultConfig: function(){
			return {
				WorkSystem__c: '0',					// 労働時間制
				VariablePeriod__c: '1',				// 変形期間の単位
				Holidays__c: '2000001',				// 休日
				DefaultLegalHoliday__c: null,		// 優先法定休日
				AutoLegalHoliday__c: false,			// 法定休日の自動判定
				NonPublicHoliday__c: false,			// 国民の祝日は会社休日とする
				StdStartTime__c: 540,				// 始業終業の時刻
				StdEndTime__c: 1035,				// 〃
				StandardFixTime__c: null,			// 所定労働時間（★自動計算）
				RestTimes__c: '720-780',			// 休憩時間
				UseHalfHoliday__c: true,			// 半日休暇取得可
				AmHolidayStartTime__c: 540,			// 午前半休適用時間
				AmHolidayEndTime__c: 810,			// 〃
				PmHolidayStartTime__c: 810,			// 午後半休適用時間
				PmHolidayEndTime__c: 1035,			// 〃
				UseHalfHolidayRestTime__c: false,	// 半休取得時の休憩時間
				AmHolidayRestTimes__c: null,		// 午前半休時休憩時間
				PmHolidayRestTimes__c: null,		// 午後半休時休憩時間
				LegalTimeOfWeek__c: 2400,			// １週間の法定労働時間
				BaseTime__c: null,					// 時間単位休の基準時間(年次有給休暇用)（★自動計算）
				BaseTimeForStock__c: null,			// 時間単位休の基準時間(日数管理休暇用)（★自動計算）
				IgonreNightWork__c: false,			// 深夜労働割増
				DeductWithFixedTime__c: false,		// 残業と控除の相殺: しない
				HalfDaiqReckontoWorked__c: true,	// 代休: 勤務時間とみなして勤怠計算を行う
				PastTimeOnly__c: false,				// 未来の時刻は入力不可
				HighlightLateEarly__c: false,		// 遅刻・早退を強調表示する
				ProhibitInputTimeUntilApproved__c: false, // 休日出勤時の制限: (休日出勤申請または振替申請が)承認されるまで勤務時間の入力不可
				Config__c: {
					empApply: {
						overTimeInitOverFlexZone: false,
						earlyWorkInitOverFlexZone: false,
						allowSelectionOfLegalHoliday: false,
						requireLateApply: false,
						requireEarlyEndApply: false,
						overTimeRequireTime: 0,
						earlyWorkRequireTime: 0,
						holidayWorkRestChangeable: false,
						prohibitWorkShiftChange: false,
						useShiftChange: false,
						useBulkOverTime: false,
						useBulkEarlyWork: false,
						useMonthlyOverTimeApply: false,
						monthlyOverTimeRequireFlag: false,
						monthlyOverTimeRequireTime: null,
						monthlyOverTimeDupl: false,
					},
					requireDailyInput: false,
					prohibitBorderRestTime: false
				},
				UseDiscretionary__c: false,			// 裁量労働
				NightChargeOnly__c: false,			// 残業申請・早朝勤務申請は深夜割増のみ認める
				ExtendDayType__c: false,			// 翌日にまたがる勤務時間の取扱い
				ClassificationNextDayWork__c: '0',	// 〃
				LeavingAcrossNextDay__c: '0',		// 2暦日で勤務日種別が異なる24:00以降の入力不可
				RestTimeCheck__c: [
					{check: false, workTime: 360, restTime: 45, push: false, offset: null},
					{check: false, workTime: 480, restTime: 60, push: false, offset: null}
				],
				PermitUpdateTimeLevel__c: '0',		// 勤務時間を修正できる社員
				TimeRound__c: '1',					// 時刻の丸め
				TimeRoundBegin__c: '1',				// 出社時刻の端数処理
				TimeRoundEnd__c: '2',				// 退社時刻の端数処理
				TimeFormat__c: 'hh:mm',				// 時刻の表示形式
				InputWorkingTimeOnWorkTimeView__c: true, // 勤務表に工数入力ボタン
				// 申請関連設定
				UseWorkFlow__c: true,				// 承認ワークフロー
				UseApplyApproverTemplate__c: false,	// 承認者設定を使用する
				UseHolidayWorkFlag__c: 1,			// 休日出勤申請
				UseMakeupHoliday__c: true,			// 振替申請
				ExchangeLimit2__c: null,			// 振替休日を取得した日の振替勤務日を選択できる期間
				ExchangeLimit__c: null,				// 休日に勤務した日の振替休日を選択できる期間
				ProhibitApplicantEliminatingLegalHoliday__c: false, // 週内の法定休日がなくなる振替を禁止
				ChangePattern__c: '1',				// 勤務時間変更申請
				ChangeDayType__c: false,			// 平日・休日変更を許可
				ChangeShift__c: '0',				// シフト可（始業・終業時刻変更を許可）
				UseOverTimeFlag__c: 1,				// 残業申請
				OverTimeBorderTime__c: -1320,		// 以前の勤務は申請なしでも認める
				UseEarlyWorkFlag__c: 1,				// 早朝勤務申請
				EarlyWorkBorderTime__c: -300,		// 以降の勤務は申請なしでも認める
				UseLateStartApply__c: true,			// 遅刻申請
				UseEarlyEndApply__c: true,			// 早退申請
				UseDirectApply__c: false,			// 直行・直帰申請
				WorkTypeList__c: null,				// 作業区分
				UseReviseTimeApply__c: false,		// 勤怠時刻修正申請
				UseDailyApply__c: false,			// 日次確定申請
				SeparateDailyFixButton__c: false,	// 勤務表上(日付欄)にボタンを表示する
				DailyApprover__c: '0',				// 日次確定申請の承認者
				CheckDailyFixLeak__c: 0,			// 日次確定申請漏れのチェック
				CheckWorkingTime__c: false,			// 工数入力時間のチェック（日次確定の時に行う）
				CheckWorkingTimeMonthly__c: false,	// 工数入力時間のチェック（月次確定の時に行う）
				// フレックスタイム設定
				FlexStartTime__c: 360,				// フレックス時間帯
				FlexEndTime__c: 1305,				// 〃
				UseCoreTime__c: true,				// コア時間帯: 設定する
				CoreStartTime__c: 660,				// コア時間帯
				CoreEndTime__c: 900,				// 〃
				CoreTimeGraph__c: false,			// 勤怠グラフにコア時間を表示する
				FlexFixOption__c: '2',				// 月の所定労働時間（一律固定 or 自動計算）
				FlexFixMonthTime__c: 9600,			// １ヶ月の所定労働時間
				FlexLegalWorkTimeOption__c: '0',	// 所定労働時間＞法定労働時間の場合、所定労働時間を法定労働時間として扱う
				// 入退館管理設定
				UseAccessControlSystem__c: false,	// 入退館管理機能を使用する
				PermitDivergenceTime__c: 15,		// 乖離許容時間(分)
				WeekDayAccessBaseTime__c: 300,		// 入退館基準時間(平日)
				HolidayAccessBaseTime__c: 0,		// 入退館基準時間(休日)
				PermitDailyApply__c: false,			// 日次確定申請時の乖離判定
				PermitMonthlyApply__c: false,		// 月次確定申請時の乖離判定
				MsAccessInfo__c: true,				// 月次サマリーに入退館情報を表示する
				// 36協定上限設定
				OverTimeMonthLimit__c: null,		// 月間時間外勤務限度時間
				OverTimeYearLimit__c: null, 		// 年間時間外勤務限度時間
				OverTimeLHMonthLimit__c: null,		// 月間時間外勤務(法定休日含む)限度時間
				OverTimeSPYearLimit__c: null,		// 特別条項・年間時間外勤務限度時間
				OverTimeSPCountLimit__c: null,		// 特別条項・月間時間外勤務限度超過限度回数
				// テレワーク勤務
				UseWorkLocation__c: false,			// 勤務場所を使用する
				RequireWorkLocation__c: false,		// 勤務場所を必須とする

				Generation__c: 1,
				ValidStartDate__c: null,
				ValidEndDate__c: null,
				ValidStartMonth__c: null,
				ValidEndMonth__c: null,
				Removed__c: false,
				// ?(おそらく不要)
				CheckSatisfyWorkFixTime__c: false,
				DisplayLegalHoliday__c: false,
				RoundMonthlyTime__c: '0',
				Summary36TimePeriod__c: false
			};
		},
		getDefaultConfigBase: function(){
			return {
				InitialDateOfMonth__c: '1',
				MarkOfMonth__c: '1',
				InitialDateOfYear__c: '1',
				MarkOfYear__c: '1',
				InitialDayOfWeek__c: '0'
			};
		},
		getDefaultEmpType: function(){
			return {
				EmpTypeCode__c: null,
				ConfigBaseId__r: {
					InitialDateOfMonth__c: '1',
					MarkOfMonth__c: '1',
					InitialDateOfYear__c: '1',
					MarkOfYear__c: '1',
					InitialDayOfWeek__c: '0'
				},
				// 積立休暇の設定
				EnableStockHoliday__c: false,		// 失効した有給休暇を積立休暇として積立てる
				TargetStockHoliday__c: null,		// 積立休暇の選択
				MaxStockHolidayPerYear__c: null,	// 一回の積立日数
				MaxStockHoliday__c: null,			// 最大積立日数
				// 代休管理の設定
				UseDaiqManage__c: false,			// 代休管理を行う
				UseHalfDaiq__c: false,				// 半日代休: 許可する
				DaiqAllBorderTime__c: null,			// 終日代休取得可能休日出勤労働時間
				DaiqHalfBorderTime__c: null,		// 半日代休取得可能休日出勤労働時間
				DaiqLimit__c: 0,					// 代休の有効期限
				UseDaiqReserve__c: true,			// 申請時に代休有無を指定する
				UseDaiqLegalHoliday__c: true,		// 法定休日出勤の代休可
				UseRegulateHoliday__c: false,		// 休日出勤の勤怠規則は平日に準拠する
				NoDaiqExchanged__c: false,			// 振替休日に出勤した場合は代休不可
				// 残業警告の設定
				OverTimeMonthLimit__c: 3000,
				OverTimeMonthAlert1__c: 1800,
				OverTimeMonthAlert2__c: 2400,
				OverTimeMonthAlert3__c: 2700,
				OverTimeYearLimit__c: 21600,
				OverTimeQuartAlert1__c: 4200,
				OverTimeQuartAlert2__c: 4800,
				OverTimeQuartLimit__c: 5400,
				OverTimeYearAlert1__c: 16800,
				OverTimeYearAlert2__c: 19200,
				OverTimeCountLimit__c: 6,
				OverTimeCountAlert__c: 3,
				// 有休自動付与の設定
				YuqOption__c: '2',
				YuqDate1__c: 401,
				YuqDate2__c: null,
				YuqAssignNoMessages__c: false,
				//
				AutoProvidePerYear__c: false,
				Config__c: null,
				PatternId__c: null,
				PlugJsSummary__c: null
			};
		},
		getDefaultHoliday: function(){
			return {
				Name: null,							// 休暇名
				Type__c: '2',						// 種類（1:有給,2:無給,3:代休）
				Range__c: '1',						// 範囲（1:全休 2:午前半休 3:午後半休 4:時間単位休）
				YuqSpend__c: false,					// 有休消化
				IsWorking__c: true,					// 出勤率判定
				DisplayDaysOnCalendar__c: false,	// 暦日表示
				TimeUnit__c: null,                  // 休暇時間制限単位
				Managed__c: false,					// 日数管理
				ManageName__c: null,				// 管理名
				Symbol__c: null,					// 略称
				SummaryCode__c: null,				// SUMHコード
				IsSummaryRoot__c: true,				// 大分類
				SummaryName__c: null,				// 大分類名
				LinkNumber__c: null,				// 連携時の休暇番号
				Description__c: null,				// 説明
				Config__c: {						// 設定
					prohibitOverNightWork: false
				},
				PlannedHoliday__c: false,			// 有休計画付与
				Removed__c: false,					// 無効
				Order__c: null,						// 並び順
				OriginalId__c: null
			};
		},
		getDefaultPattern: function(){
			return {
				Name: null,
				StdStartTime__c: 540,
				StdEndTime__c: 1080,
				RestTimes__c: '720-780',
				StandardFixTime__c: null,
				UseHalfHoliday__c: true,
				AmHolidayStartTime__c: 540,
				AmHolidayEndTime__c: 840,
				PmHolidayStartTime__c: 840,
				PmHolidayEndTime__c: 1080,
				UseHalfHolidayRestTime__c: false,
				AmHolidayRestTimes__c: null,
				PmHolidayRestTimes__c: null,
				IgonreNightWork__c: false,
				UseDiscretionary__c: false,
				Range__c: '1',
				Symbol__c: null,
				ProhibitChangeWorkTime__c: false,
				ProhibitChangeHolidayWorkTime__c: false,
				ProhibitChangeExchangedWorkTime__c: false,
				WorkTimeChangesWithShift__c: false,
				EnableRestTimeShift__c: true,
				DisableCoreTime__c: false,
				Order__c: null,
				Removed__c: false,
				OriginalId__c: null
			};
		},
		getDefaultWorkLocation: function(){
			return {
				Name: null,							// 表示名
				OfficeDays__c: 0,					// 出社日数
				HomeDays__c: 0,						// テレワーク日数
				WorkLocationCode__c: null,			// 勤務場所コード
				Removed__c: false					// 無効
			};
		},
		getDefaultEmp: function(){
			return {
				EmpCode__c: null,						// 社員コード
				Name: null,								// 社員名
				EmpTypeHistory__c: null,				// 勤務体系履歴
				EmpTypeId__c: null,						// 勤務体系
				DeptId__c: null,						// 部署
				Manager__c: null,						// 上長
				UserId__c: null,						// ユーザ
				EntryDate__c: null,						// 入社日
				EndDate__c: null,						// 退社日
				NextYuqProvideDate__c: null,			// 次回有休付与日
				IsAdmin__c: false,						// 管理機能の使用
				IsAllEditor__c: false,					// 全社員のデータ編集
				IsAllReader__c: false,					// 全社員のデータ参照
				IsDeptAdmin__c: false,					// 部署管理者
				IsExpAdmin__c: false,					// 経費管理機能の使用
				IsJobAdmin__c: false,					// ジョブ管理機能の使用
				Config__c: {
					useGeofence: false,
					expenseTypes: [],
					JsNaviServer:{
						jsNaviCCCD: null,
						jsNaviKnmchiCd: null,
						jsNaviRyohiKbn: null
					}
				},
				ExpConfig__c: {
					ekitanArea: -1,
					usePaidExpress: false,
					useReservedSheet: false,
					preferredAirLine: 0,
					routePreference: 0,
					excludeCommuterRoute: true,
					commuterRouteCode: null,
					commuterRouteNote: null,
					commuterRouteRoute: null
				},
				DeptStartDate__c: null,					// 部署有効開始日
				DeptStartMonth__c: null,				// 部署有効開始月度
				InputAccessControlFlagHistory__c: null,	// 入退館管理対象者フラグ履歴
				InputAccessControlFlagLock__c: false,	// 入退館管理対象者フラグ上書き禁止
				InputAccessControlFlag__c: '0',			// 入退館管理対象者フラグ
				InputFlagHistory__c: null,				// 対象者フラグ履歴
				InputFlagLock__c: false,				// 対象者フラグ上書き禁止
				InputFlag__c: '0',						// 対象者フラグ
				InputManager__c: null,					// 勤怠管理者
				// 経費関連
				PayExpItemId__c: null,					// 精算方法
				ExpItemClass__c: null,					// 経費費目表示区分
				ExpHistory__c: null,					// 交通費履歴
				SMCCEmpCode__c: null,					// 社員コード(SMCCカード用)
				CommuterRouteLock__c: false,			// 定期区間ロック
				CommuterRouteNote__c: null,				// 定期区間
				ReceivedReceiptDoneMail__c: false,		// 領収書入力完了メール受信
				UsingReceiptSystem__c: false,			// 領収書登録機能を使用する
				UsingConnectIC__c: false,				// IC連携機能利用可
				JsNaviId__c: null,						// J'sNAVI Jr用ID
				JsNaviRegistStatus__c: null,			// J'sNAVI Jr登録ステータス
				UsingJsNaviSystem__c: false,			// J'sNAVI Jrを使用する
				ZGRecipientAccountNo__c: null,			// 振込先口座番号
				ZGRecipientAccountType__c: '1',			// 振込先預金種目
				ZGRecipientBankCode__c: null,			// 振込先銀行コード
				ZGRecipientBankName__c: null,			// 振込先銀行名
				ZGRecipientBranchCode__c: null,			// 振込先支店コード
				ZGRecipientBranchName__c: null,			// 振込先支店名
				ZGRecipientName__c: null,				// 振込受取人名
				// 承認者
				DailyApplyApprover__c: null,			// 勤怠日次申請承認者
				DailyFixApplyApprover__c: null,			// 勤怠日次確定承認者
				MonthApplyApprover__c: null,			// 勤怠月次確定承認者
				ExpApplyApprover__c: null,				// 経費申請承認者
				JobApplyApprover__c: null,				// 工数月次確定承認者
				// シフト関連
				DefaultRule__c: null,					// デフォルト勤怠ルール
				Hidden__c: false,						// 非表示フラグ
				Title__c: null,							// 役職
				// 工数関連
				JobAssignClass__c: null,				// ジョブ割当区分
				LeftoverJobId__c: null,					// 残工数登録ジョブID
				TaskNoteOption__c: false,				// タスクごとの作業報告を入力する
				WorkInputType__c: '1',					// 工数入力方式
				WorkNoteOption__c: true					// 作業報告入力を使用する
			};
		}
	}))();
});
