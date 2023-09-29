define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/util/Util"
], function(declare, lang, json, array, Util) {
	return declare("tsext.configDownload.ConfigDownloadCommon", null, {
		constructor: function(record){
			this.common = record;
			if(this.common.Config__c){
				this.common.config = Util.fromJson(this.common.Config__c);
			}
			if(this.common.ExpPreApplyConfig__c){
				this.common.expPreApplyConfig = Util.fromJson(this.common.ExpPreApplyConfig__c);
			}
		},
		getId:					function(){ return this.common.Id; },
		getName:				function(){ return this.common.Name; },
		getEmpTypeCode:			function(){ return this.common.EmpTypeCode__c || ''; },
		getCreatedDate:			function(){ return this.common.CreatedDate; },
		getCreatedById:			function(){ return this.common.CreatedById; },
		getCreatedByName:		function(){ return this.common.CreatedBy.Name; },
		getLastModifiedDate:	function(){ return this.common.LastModifiedDate; },
		getLastModifiedById:	function(){ return this.common.LastModifiedById; },
		getLastModifiedByName:	function(){ return this.common.LastModifiedBy.Name; },
		getOwnerId:				function(){ return this.common.OwnerId; },
		getOwnerName:			function(){ return this.common.Owner.Name; },
		getOwnerIsActive:		function(){ return this.common.Owner.IsActive; },
		//--------------------------------------------------
		// 共通設定
		// HELP
		getHelp: function(){
			return this.common.HelpLink__c || '';
		},
		// 申請時の備考入力を必須にする
		isRequireNote: function(){
			return this.common.RequireNote__c || false;
		},
		// タイムレポートを使用不可にする
		isDisabledTimeReport: function(){
			return this.common.DisabledTimeReport__c || false;
		},
		// 経費精算を使用不可にする
		isDisabledEmpExp: function(){
			return this.common.DisabledEmpExp__c || false;
		},
		// 工数実績を使用不可にする
		isDisabledEmpJob: function(){
			return this.common.DisabledEmpJob__c || false;
		},
		// データ保管機能を使用する
		isUseDataStorage: function(){
			return (this.common.config && this.common.config.useDataStorage) || false;
		},
		// データ出力オプションを追加する
		isDataOutputOption: function(){
			return this.common.DataOutputOption__c || false;
		},
		// 承認申請のタイトルと内容を日本語と英語の併記にする
		isNamingRule: function(){
			return (this.common.NamingRule__c == '1')
		},
		//--------------------------------------------------
		// 勤怠関連設定
		// 控除のある日は備考必須にする
		isCommentIfAbsence: function(){
			return this.common.CommentIfAbsence__c || false;
		},
		// 打刻なしは備考必須にする
		isCommentIfNoPushTime: function(){
			return this.common.CommentIfNoPushTime__c || false;
		},
		// 本人が勤怠月次承認取消可能
		isCancelMonthApply: function(){
			return this.common.CancelMonthApply__c || false;
		},
		// 本人が勤怠日次承認取消可能
		isCancelDayApply: function(){
			return this.common.CancelDayApply__c || false;
		},
		// 打刻なしを表示する
		isIndicateNoPushTime: function(){
			return this.common.IndicateNoPushTime__c || false;
		},
		// 勤怠申請の取消をメールする
		isMailEmpApplyCanceled: function(){
			return this.common.mailEmpApplyCanceled__c || false;
		},
		// 定時打刻ボタンの使用
		isUseFixedButton: function(){
			return this.common.UseFixedButton__c || false;
		},
		// 退社後の再出社打刻可能
		isUseRestartable: function(){
			return this.common.UseRestartable__c || false;
		},
		// フレックスで日ごとの残業を表示する
		isFlexGraph: function(){
			return this.common.FlexGraph__c || false;
		},
		// 裁量労働／管理監督者で実労働時間を表示する
		isDiscretionaryOption: function(){
			return (this.common.DiscretionaryOption__c == '1' ? '表示する' : '表示しない');
		},
		// 勤務時間外の休憩・公用外出を記録する
		isKeepExteriorTime: function(){
			return this.common.KeepExteriorTime__c || false;
		},
		// 遅刻取扱い
		getTreatLateStart: function(){
			return this.common.TreatLateStart__c || '';
		},
		// 早退取扱い
		getTreatEarlyEnd: function(){
			return this.common.TreatEarlyEnd__c || '';
		},
		// 退社打刻時の日次確定のデフォルトをオンにする
		isCheckDefaultDailyFix: function(){
			return this.common.CheckDefaultDailyFix__c || false;
		},
		// 月次サマリーの日次の労働時間に実時間を表示
		isMsDailyWorkTimeIsReal: function(){
			return this.common.MsDailyWorkTimeIsReal__c || false;
		},
		// お知らせの自動表示をしない
		isNotInfoAutoView: function(){
			return this.common.NotInfoAutoView__c || false;
		},
		// 出社・退社時のChatterフィードを行わない
		isDisableKintaiFeed: function(){
			return this.common.DisableKintaiFeed__c || false;
		},
		// 取消または却下された申請の扱い
		getHandleInvalidApply: function(){
			return (typeof(this.common.HandleInvalidApply__c) == 'number' ?  this.common.HandleInvalidApply__c : '');
		},
		// 休日出勤申請、残業申請、早朝勤務申請の事前申請と事後申請を区別する
		isClarifyAfterApply: function(){
			return this.common.ClarifyAfterApply__c || false;
		},
		// 退社打刻は出社時刻から24時間後までとする
		isPermitLeavingPush24hours: function(){
			return this.common.permitLeavingPush24hours__c || false;
		},
		// 退社時刻未入力でも日付が変われば出社打刻可
		isPermitStartBtnDateChange: function(){
			return this.common.PermitStartBtnDateChange__c || false;
		},
		// 勤務表の月次サマリーボタンを非表示にする
		isHideMonthlySummary: function(){
			return this.common.HideMonthlySummary__c || false;
		},
		// 勤務表の下部の集計値エリアを非表示にする
		isHideBottomSummary: function(){
			return this.common.HideBottomSummary__c || false;
		},
		// 勤怠グラフのポップアップを非表示にする
		isHideTimeGraphPopup: function(){
			return this.common.HideTimeGraphPopup__c || false;
		},
		// 申請の備考と日次の備考を保存時に結合しない
		isSeparateDailyNote: function(){
			return this.common.SeparateDailyNote__c || false;
		},
		// 申請期間が月度をまたぐ申請を禁止する
		isProhibitAcrossMonthApply: function(){
			return this.common.ProhibitAcrossMonthApply__c || false;
		},
		// 出社時刻から退社時刻の制限
		getLimitedTimeDistance: function(){
			return (this.common.LimitedTimeDistance__c || '48') + '時間';
		},
		// 打刻を許可するIPアドレス
		getLimitedPushTimeIPList: function(){
			var v = this.common.LimitedPushTimeIPList__c || '';
			return v;
		},
		// Chatter打刻を利用しない
		isDisableChatterPushTime: function(){
			return this.common.DisableChatterPushTime__c || false;
		},
		// 時間単位有休の年間取得限度時間
		getPaidRestTimeLimit: function(){
			var v = this.common.PaidRestTimeLimit__c;
			return (typeof(v) == 'number' ? '' + v : '5');
		},
		// 時間単位有休の起算日は、年次有給休暇の有効開始日を起算日とする
		isPaidRestTimeLimitSyncYuq: function(){
			return (this.common.config && this.common.config.paidRestTimeLimitSyncYuq) || false;
		},
		// 月次確定時に勤務表を再チェックする
		isValidateAllDayMonthlyFix: function(){
			return (this.common.config && this.common.config.validateAllDayMonthlyFix) || false;
		},
		//--------------------------------------------------
		// 位置情報設定
		// Salesforce1の勤怠打刻で位置情報を記録する
		isPushTimeWithLocationTs1: function(){
			return (this.common.config && this.common.config.pushTimeWithLocationTs1) || false;
		},
		// Webタイムレコーダーとタイムレポートの打刻で位置情報を記録する
		isPushTimeWithLocationWeb: function(){
			return (this.common.config && this.common.config.pushTimeWithLocationWeb) || false;
		},
		// Chatterに位置情報を出力する
		isChatterWithLocation: function(){
			return (this.common.config && this.common.config.chatterWithLocation) || false;
		},
		//--------------------------------------------------
		// 工数関連設定
		// 自分がジョブリーダーのジョブのみ表示
		isJobLeaderFilter: function(){
			return this.common.JobLeaderFilter__c || false;
		},
		// 作業報告の改行を有効のまま表示する
		isWorkNoteCrlfOn: function(){
			return this.common.WorkNoteCrlfOn__c || false;
		},
		// ジョブ管理機能の使用者の制限
		getLimitToMainteJob: function(){
			return this.common.LimitToMainteJob__c || '';
		},
		//--------------------------------------------------
		// 経費関連設定
		// 仕訳データを作成する
		getOutputJournal: function(){
			return this.common.OutputJournal__c || '0';
		},
		// 仮払いの精算時の仕訳データを出力する
		isOutputJournalOnProvisionalPayment: function(){
			return this.common.OutputJournalOnProvisionalPayment__c || false;
		},
		// 承認済みでも経費管理者は経費明細の修正ができる
		isAllowEditExpAdmin: function(){
			return this.common.AllowEditExpAdmin__c || false;
		},
		// 承認中でも上長が経費明細の修正ができる
		isAllowEditManager: function(){
			return this.common.AllowEditManager__c || false;
		},
		// 費目設定の新しいユーザインターフェースを有効化
		isExpItemRevise: function(){
			return (this.common.expPreApplyConfig && this.common.expPreApplyConfig.expItemRevise) || false;
		},
		// スマホ領収書登録機能を使用する
		isUsingReceiptSystem: function(){
			return this.common.UsingReceiptSystem__c || false;
		},
		// 領収書OCR登録機能を使用する
		isUseReceiptOCR: function(){
			return this.common.UseReceiptOCR__c || false;
		},
		// 店名キャッシュ機能を使用する
		isUseShopCache: function(){
			return this.common.UseShopCache__c || false;
		},
		// 店名検索の外部サービスを使用する
		isUseExternalShopSearch: function(){
			return this.common.UseExternalShopSearch__c || false;
		},
		// ファイル拡張子による添付可否の設定
		getAttachmentType: function(){
			return this.common.AttachmentType__c || '';
		}
	});
});
