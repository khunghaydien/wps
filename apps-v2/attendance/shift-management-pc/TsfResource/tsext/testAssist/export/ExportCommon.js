define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤怠共通設定
	return declare("tsext.testAssist.ExportCommon", ExportObj, {
		constructor: function(manager, obj, parent){
			this.obj.LastAccessControlLogTime__c = Util.formatDateTime(this.obj.LastAccessControlLogTime__c);
			this.obj.Config__c = (this.obj.Config__c ? Util.fromJson(this.obj.Config__c) : null);
		},
		getPlugJavaScript: function(){
			return this.obj.PlugJavaScript__c || '';
		},
		getSummarySettings: function(){
			var c = this.obj.Config__c || {};
			if(c.summarySettings){
				return Util.toJson(c.summarySettings, true);
			}
			return '';
		},
		getMessageTable: function(){
			return this.obj.MessageTable__c || '';
		},
		getDefaultWorkLocationName: function(){
			const id = this.obj.DefaultWorkLocationId__c || null;
			const workLocation = (id ? this.manager.getWorkLocationById(id) : null);
			return (workLocation ? workLocation.getName() : '');
		},
		isExistPlugin: function(){
			var js = this.getPlugJavaScript();
			var ss = this.getSummarySettings();
			var mt = this.getMessageTable();
			return ((js || ss || mt) ? true : false);
		},
		/**
		 * 勤怠共通設定をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @returns {Array.<string>}
		 */
		outputExportCommon: function(lst, visit){
			var heads = [Constant.KEY_SETTING, Constant.KEY_COMMON]; // 設定,共通
			this.L(lst, [Constant.OPTION_CHANGE], heads); // 変更
			this.outputExportCommonImpl({
				lst   : lst,
				head  : heads.concat(''),
				org   : null,
				allin : true
			});
			this.L(lst, [Constant.OPTION_END], heads); // 終了
			return lst;
		},
		/**
		 * 勤怠共通設定をエクスポート
		 * @param {{lst:{Array.<Object>}, head:{string}, org:{Object}, seize:{Array.<string|Object>}, allin:{boolean}}} cpx 
		 * @returns {Array.<string>}
		 */
		outputExportCommonImpl: function(cpx){
			this.P(cpx, Constant.SET_REQUIRE_NOTE           , 'RequireNote__c'                       ); // 申請時の備考入力を必須にする
			this.P(cpx, Constant.SET_DISABLED_TIMEREPORT    , 'DisabledTimeReport__c'                ); // タイムレポートを使用不可にする
			this.P(cpx, Constant.SET_DISABLED_EMPEXP        , 'DisabledEmpExp__c'                    ); // 経費精算を使用不可にする
			this.P(cpx, Constant.SET_DISABLED_EMPJOB        , 'DisabledEmpJob__c'                    ); // 工数実績を使用不可にする
			this.P(cpx, Constant.SET_USE_DATA_STORAGE       , 'Config__c.useDataStorage'             ); // データ保管機能を使用する
			this.P(cpx, Constant.SET_DATA_OUTPUT_OPTION     , 'DataOutputOption__c'                  ); // データ出力オプションを追加する
			this.P(cpx, Constant.SET_NAMING_RULE            , 'NamingRule__c'                        ); // 承認申請のタイトルと内容を日本語と英語の併記にする

			this.P(cpx, Constant.SET_COMMENT_IF_ABSENCE     , 'CommentIfAbsence__c'                  ); // 控除のある日は備考必須にする
			this.P(cpx, Constant.SET_COMMENT_IF_NOPUSHTIME  , 'CommentIfNoPushTime__c'               ); // 打刻なしは備考必須にする
			this.P(cpx, Constant.SET_CANCEL_MONTH_APPLY     , 'CancelMonthApply__c'                  ); // 本人が勤務確定承認取消可能
			this.P(cpx, Constant.SET_CANCEL_DAY_APPLY       , 'CancelDayApply__c'                    ); // 本人が勤怠申請承認取消可能
			this.P(cpx, Constant.SET_INDICATE_NO_PUSHTIME   , 'IndicateNoPushTime__c'                ); // 打刻なしを表示する
			this.P(cpx, Constant.SET_MAIL_EMPAPPLY_CANCELED , 'mailEmpApplyCanceled__c'              ); // 勤怠申請の取消をメールする
			this.P(cpx, Constant.SET_USE_FIXED_BUTTON       , 'UseFixedButton__c'                    ); // 定時打刻ボタンの使用
			this.P(cpx, Constant.SET_USE_RESTARTABLE        , 'UseRestartable__c'                    ); // 退社後の再出社打刻可能
			this.P(cpx, Constant.SET_FLEX_GRAPH             , 'FlexGraph__c'                         ); // フレックスで日ごとの残業を表示する
			this.P(cpx, Constant.SET_DISCRETIONARY_OPTION   , 'DiscretionaryOption__c'               ); // 裁量労働／管理監督者で実労働時間を表示する
			this.P(cpx, Constant.SET_KEEP_EXTERIOR_TIME     , 'KeepExteriorTime__c'                  ); // 勤務時間外の休憩・公用外出を記録する
			this.P(cpx, Constant.SET_TREAT_LATE_START       , 'TreatLateStart__c', null, '0'         ); // 遅刻取扱い
			this.P(cpx, Constant.SET_TREAT_EARLY_END        , 'TreatEarlyEnd__c' , null, '0'         ); // 早退取扱い
			this.P(cpx, Constant.SET_CHECK_DEFAULT_DAILYFIX , 'CheckDefaultDailyFix__c'              ); // 退社打刻時の日次確定のデフォルトをオンにする
			this.P(cpx, Constant.SET_MS_WORKTIME_IS_REAL    , 'MsDailyWorkTimeIsReal__c'             ); // 月次サマリーの日次の労働時間に実時間を表示
			this.P(cpx, Constant.SET_NOT_INFO_AUTO_VIEW     , 'NotInfoAutoView__c'                   ); // お知らせの自動表示をしない
			this.P(cpx, Constant.SET_DISABLE_KINTAI_FEED    , 'DisableKintaiFeed__c'                 ); // 出社・退社時のChatterフィードを行わない
			this.P(cpx, Constant.SET_HANDLE_INVALID_APPLY   , 'HandleInvalidApply__c'                ); // 取消または却下された申請の扱い
			this.P(cpx, Constant.SET_CLARIFY_AFTER_APPLY    , 'ClarifyAfterApply__c'                 ); // 事前申請と事後申請を区別する
			this.P(cpx, Constant.SET_PERMIT_LEAVING_PUSH24  , 'permitLeavingPush24hours__c'          ); // 退社打刻は出社時刻から24時間後までとする
			this.P(cpx, Constant.SET_PERMIT_START_DAYCHANGE , 'PermitStartBtnDateChange__c'          ); // 退社時刻未入力でも日付が変われば出社打刻可
			this.P(cpx, Constant.SET_HIDE_MONTHLY_SUMMARY   , 'HideMonthlySummary__c'                ); // 勤務表の月次サマリーボタンを非表示にする
			this.P(cpx, Constant.SET_HIDE_BOTTOM_SUMMARY    , 'HideBottomSummary__c'                 ); // 勤務表の下部の集計値エリアを非表示にする
			this.P(cpx, Constant.SET_HIDE_TIME_GRAPH_POPUP  , 'HideTimeGraphPopup__c'                ); // 勤怠グラフのポップアップを非表示にする
			this.P(cpx, Constant.SET_SEPARATE_DAILY_NOTE    , 'SeparateDailyNote__c'                 ); // 申請の備考と日次の備考を保存時に結合しない
			this.P(cpx, Constant.SET_PROHIBIT_ACROSS_MONTH  , 'ProhibitAcrossMonthApply__c'          ); // 申請期間が月度をまたぐ申請を禁止する
			this.P(cpx, Constant.SET_LIMITED_TIME_DISTANCE  , 'LimitedTimeDistance__c'               ); // 出社時刻から退社時刻の制限
			this.P(cpx, Constant.SET_DISABLE_CHATTER_PUSH   , 'DisableChatterPushTime__c'            ); // Chatter打刻を利用しない
			this.P(cpx, Constant.SET_PAID_RESTTIME_LIMIT    , 'PaidRestTimeLimit__c', null, 5        ); // 時間単位有休の年間取得限度時間
			this.P(cpx, Constant.SET_PAID_REST_LIMIT_SYNC   , 'Config__c.paidRestTimeLimitSyncYuq'   ); // 時間単位有休の起算日は、年次有給休暇の有効開始日を起算日とする
			this.P(cpx, Constant.SET_VALIDATE_MONTHLYFIX    , 'Config__c.validateAllDayMonthlyFix'   ); // 月次確定時に勤務表を再チェックする
			this.P(cpx, Constant.SET_TS1_OPTIMIZE_OPTION    , 'Config__c.ts1OptimizeOption'          ); // TeamSpirit1上で利用する勤務表の表示タイプ
			this.P(cpx, Constant.SET_FLEXIBLE_HALFDAY_TIME  , 'Config__c.flexibleHalfDayTime'        ); // コア時間なしフレックスの半日休暇適用時間を使用しない
			this.P(cpx, Constant.SET_USE_ACCESS_CONTROL     , 'UseAccessControlSystem__c'            ); // 入退館管理機能
			this.P(cpx, Constant.SET_LAST_ACCESS_LOG_TIME   , 'LastAccessControlLogTime__c'          ); // 最終入退館管理ログ連携時刻
			this.P(cpx, Constant.SET_DEFAULT_WORK_LOCATION  , null, 'getDefaultWorkLocationName'     ); // デフォルトの勤務場所

			return cpx.lst;
/*
TODO 裏設定に対応
勤怠
hidePersonalInfo						{boolean} false  // 勤務表の写真をクリックした時に個人設定画面を表示しないようにする。
useLegacyIrregularLogicUntil			{number}         // 変形労働制の週の法定労働時間の対応を旧ロジックに戻す
adjustLateTimeEarlyTime					{boolean} false  // 退社後または出社前に時間単位休や半休がある時、定時で所定勤務に達していれば遅刻・早退時間をカウントしない
overwriteStampEndTime					{boolean} FALSE  // 退勤打刻時刻は既存の退勤時刻より前の場合、上書きするフラグ
hourlyLeaveLimitOfDay					{number}  3      // 1日に申請可能な時間単位休の回数上限を3以外に変えたい場合に指定する。1～8が有効。それ以外は無視して3を適用する。
useShiftChange							{boolean}        // シフト振替申請の有効化（勤務日非勤務日の振替、Mcd様限定）
use36AgreementCap						{boolean}        // 勤務体系設定画面に36協定上限設定設定画面を表示する
シフト
enableShiftManagement					{boolean} false  // シフト管理画面を有効化する
enableShiftCsvImport					{boolean} false  // シフト管理画面の[CSVインポート]ボタンを表示する
enableShiftImportToolDownload			{boolean} false  // シフト管理画面の[シフト登録ツールをダウンロードする]リンクを表示する
shiftImportToolCustomURL				{boolean} null   // シフト管理画面の[シフト登録ツールをダウンロードする]リンクのDLファイルURLを変更する
入退館
DivergenceInnerCheck					{boolean} false  // (入退館乖離判定) 出社時刻 < 入館時刻, 退館時刻 < 退社時刻でも、マージン以上ズレている場合は乖離ありにする
SuppressDivergenceCheckOnFixedMonth		{boolean} false  // 入退館管理機能：月次確定後は乖離判定しない
AutoReJudgeDays							{number}  null   // 入退館管理機能： 指定された日数以内のログ更新があった場合は、対象日次の入退館判定が判定済みでも再判定を行う
工数
timeReportDedicatedToJob				{boolean} false  // タイムレポートの勤怠情報と経費精算を非表示にする
checkInputWorkHours						{boolean} false  // 工数実績入力時に工数と勤務時間が合わなければ入力不可とする
warningOnMAPHW							{boolean} false  // 工数実績画面に勤務時間と工数時間不一致の警告アイコンを表示する
*/
		}
	});
});
