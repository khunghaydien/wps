define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/tsobj/Helper",
	"tsext/logic/DataLoader",
	"tsext/service/Request",
	"tsext/service/Agent",
	"tsext/configDownload/ConfigDownloadCommon",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Helper, DataLoader, Request, Agent, ConfigDownloadCommon, Util){
	return declare("tsext.configDownload.ConfigDownloadCommons", null, {
		constructor : function(opt){
			this.opt = opt;
			this.commonObjs = [
			{ name:'勤怠共通設定ID'										, oid:true },
			{ name:'勤怠共通設定名'										},
			{ name:'勤怠共通設定：作成日時'								, odt:true },
			{ name:'勤怠共通設定：作成者ID'								, oby:true, oid:true },
			{ name:'勤怠共通設定：作成者名'								, oby:true },
			{ name:'勤怠共通設定：最終更新日時'							, odt:true },
			{ name:'勤怠共通設定：最終更新者ID'							, oby:true, oid:true },
			{ name:'勤怠共通設定：最終更新者名'							, oby:true },
			{ name:'勤怠共通設定：所有者ID'								, oby:true, oid:true },
			{ name:'勤怠共通設定：所有者名'								, oby:true },
			{ name:'勤怠共通設定：所有者有効'							, oby:true },
			{ name:'HELP' },
			{ name:'申請時の備考入力を必須にする' },
			{ name:'タイムレポートを使用不可にする' },
			{ name:'経費精算を使用不可にする' },
			{ name:'工数実績を使用不可にする' },
			{ name:'データ保管機能を使用する' },
			{ name:'データ出力オプションを追加する' },
			{ name:'承認申請のタイトルと内容を日本語と英語の併記にする' },
			{ name:'控除のある日は備考必須にする' },
			{ name:'打刻なしは備考必須にする' },
			{ name:'本人が勤怠月次承認取消可能' },
			{ name:'本人が勤怠日次承認取消可能' },
			{ name:'打刻なしを表示する' },
			{ name:'勤怠申請の取消をメールする' },
			{ name:'定時打刻ボタンの使用' },
			{ name:'退社後の再出社打刻可能' },
			{ name:'フレックスで日ごとの残業を表示する' },
			{ name:'裁量労働／管理監督者で実労働時間を表示する' },
			{ name:'勤務時間外の休憩・公用外出を記録する' },
			{ name:'遅刻取扱い' },
			{ name:'早退取扱い' },
			{ name:'退社打刻時の日次確定のデフォルトをオンにする' },
			{ name:'月次サマリーの日次の労働時間に実時間を表示' },
			{ name:'お知らせの自動表示をしない' },
			{ name:'出社・退社時のChatterフィードを行わない' },
			{ name:'取消または却下された申請の扱い' },
			{ name:'休日出勤申請、残業申請、早朝勤務申請の事前申請と事後申請を区別する' },
			{ name:'退社打刻は出社時刻から24時間後までとする' },
			{ name:'退社時刻未入力でも日付が変われば出社打刻可' },
			{ name:'勤務表の月次サマリーボタンを非表示にする' },
			{ name:'勤務表の下部の集計値エリアを非表示にする' },
			{ name:'勤怠グラフのポップアップを非表示にする' },
			{ name:'申請の備考と日次の備考を保存時に結合しない' },
			{ name:'申請期間が月度をまたぐ申請を禁止する' },
			{ name:'出社時刻から退社時刻の制限' },
			{ name:'打刻を許可するIPアドレス' },
			{ name:'Chatter打刻を利用しない' },
			{ name:'時間単位有休の年間取得限度時間' },
			{ name:'時間単位有休の起算日は、年次有給休暇の有効開始日を起算日とする' },
			{ name:'月次確定時に勤務表を再チェックする' },
			{ name:'Salesforce1の勤怠打刻で位置情報を記録する' },
			{ name:'Webタイムレコーダーとタイムレポートの打刻で位置情報を記録する' },
			{ name:'Chatterに位置情報を出力する' },
			{ name:'自分がジョブリーダーのジョブのみ表示' },
			{ name:'作業報告の改行を有効のまま表示する' },
			{ name:'ジョブ管理機能の使用者の制限' },
			{ name:'仕訳データを作成する' },
			{ name:'仮払いの精算時の仕訳データを出力する' },
			{ name:'承認済みでも経費管理者は経費明細の修正ができる' },
			{ name:'承認中でも上長が経費明細の修正ができる' },
			{ name:'費目設定の新しいユーザインターフェースを有効化' },
			{ name:'スマホ領収書登録機能を使用する' },
			{ name:'領収書OCR登録機能を使用する' },
			{ name:'店名キャッシュ機能を使用する' },
			{ name:'店名検索の外部サービスを使用する' },
			{ name:'ファイル拡張子による添付可否の設定' }
			];
		},
		convertBase: function(records){
			array.forEach(records, function(record){
				record.CreatedDate      = Util.formatDateTime(record.CreatedDate);
				record.LastModifiedDate = Util.formatDateTime(record.LastModifiedDate);
			});
			return records;
		},
		setCommons: function(records){
			this.commons = this.convertBase(records);
		},
		createCommonContents: function(){
			this.commonList = [];
			array.forEach(this.commons, function(common){
				this.commonList.push(new ConfigDownloadCommon(common));
			}, this);
		},
		getCommonCsvHeads: function(objs){
			var heads = [];
			var x = 0;
			array.forEach(this.commonObjs, function(obj){
				if(this.isCommonObj(x++)){
					heads.push(obj.name);
				}
			}, this);
			return heads;
		},
		isCommonObj: function(index){
			var obj = this.commonObjs[index];
			var flag = true;
			if(obj.oid && !this.opt.oid){ flag = false; }
			if(obj.oby && !this.opt.oby){ flag = false; }
			if(obj.odt && !this.opt.odt){ flag = false; }
			return flag;
		},
		getCommonCsvContents: function(){
			this.createCommonContents();
			var heads = this.getCommonCsvHeads();
			var common = (this.commonList.length ? this.commonList[0] : null);
			var vals = [];
			var x = 0;
			if(this.isCommonObj(x++)){ vals.push(common.getId()); }
			if(this.isCommonObj(x++)){ vals.push(Util.escapeCsv(common.getName())); }
			if(this.isCommonObj(x++)){ vals.push(common.getCreatedDate()); }
			if(this.isCommonObj(x++)){ vals.push(common.getCreatedById()); }
			if(this.isCommonObj(x++)){ vals.push(common.getCreatedByName()); }
			if(this.isCommonObj(x++)){ vals.push(common.getLastModifiedDate()); }
			if(this.isCommonObj(x++)){ vals.push(common.getLastModifiedById()); }
			if(this.isCommonObj(x++)){ vals.push(common.getLastModifiedByName()); }
			if(this.isCommonObj(x++)){ vals.push(common.getOwnerId()); }
			if(this.isCommonObj(x++)){ vals.push(common.getOwnerName()); }
			if(this.isCommonObj(x++)){ vals.push(common.getOwnerIsActive()); }
			if(this.isCommonObj(x++)){ vals.push(common.getHelp()); }
			if(this.isCommonObj(x++)){ vals.push(common.isRequireNote()); }
			if(this.isCommonObj(x++)){ vals.push(common.isDisabledTimeReport()); }
			if(this.isCommonObj(x++)){ vals.push(common.isDisabledEmpExp()); }
			if(this.isCommonObj(x++)){ vals.push(common.isDisabledEmpJob()); }
			if(this.isCommonObj(x++)){ vals.push(common.isUseDataStorage()); }
			if(this.isCommonObj(x++)){ vals.push(common.isDataOutputOption()); }
			if(this.isCommonObj(x++)){ vals.push(common.isNamingRule()); }
			if(this.isCommonObj(x++)){ vals.push(common.isCommentIfAbsence()); }
			if(this.isCommonObj(x++)){ vals.push(common.isCommentIfNoPushTime()); }
			if(this.isCommonObj(x++)){ vals.push(common.isCancelMonthApply()); }
			if(this.isCommonObj(x++)){ vals.push(common.isCancelDayApply()); }
			if(this.isCommonObj(x++)){ vals.push(common.isIndicateNoPushTime()); }
			if(this.isCommonObj(x++)){ vals.push(common.isMailEmpApplyCanceled()); }
			if(this.isCommonObj(x++)){ vals.push(common.isUseFixedButton()); }
			if(this.isCommonObj(x++)){ vals.push(common.isUseRestartable()); }
			if(this.isCommonObj(x++)){ vals.push(common.isFlexGraph()); }
			if(this.isCommonObj(x++)){ vals.push(common.isDiscretionaryOption()); }
			if(this.isCommonObj(x++)){ vals.push(common.isKeepExteriorTime()); }
			if(this.isCommonObj(x++)){ vals.push(common.getTreatLateStart()); }
			if(this.isCommonObj(x++)){ vals.push(common.getTreatEarlyEnd()); }
			if(this.isCommonObj(x++)){ vals.push(common.isCheckDefaultDailyFix()); }
			if(this.isCommonObj(x++)){ vals.push(common.isMsDailyWorkTimeIsReal()); }
			if(this.isCommonObj(x++)){ vals.push(common.isNotInfoAutoView()); }
			if(this.isCommonObj(x++)){ vals.push(common.isDisableKintaiFeed()); }
			if(this.isCommonObj(x++)){ vals.push(common.getHandleInvalidApply()); }
			if(this.isCommonObj(x++)){ vals.push(common.isClarifyAfterApply()); }
			if(this.isCommonObj(x++)){ vals.push(common.isPermitLeavingPush24hours()); }
			if(this.isCommonObj(x++)){ vals.push(common.isPermitStartBtnDateChange()); }
			if(this.isCommonObj(x++)){ vals.push(common.isHideMonthlySummary()); }
			if(this.isCommonObj(x++)){ vals.push(common.isHideBottomSummary()); }
			if(this.isCommonObj(x++)){ vals.push(common.isHideTimeGraphPopup()); }
			if(this.isCommonObj(x++)){ vals.push(common.isSeparateDailyNote()); }
			if(this.isCommonObj(x++)){ vals.push(common.isProhibitAcrossMonthApply()); }
			if(this.isCommonObj(x++)){ vals.push(common.getLimitedTimeDistance()); }
			if(this.isCommonObj(x++)){ vals.push(common.getLimitedPushTimeIPList()); }
			if(this.isCommonObj(x++)){ vals.push(common.isDisableChatterPushTime()); }
			if(this.isCommonObj(x++)){ vals.push(common.getPaidRestTimeLimit()); }
			if(this.isCommonObj(x++)){ vals.push(common.isPaidRestTimeLimitSyncYuq()); }
			if(this.isCommonObj(x++)){ vals.push(common.isValidateAllDayMonthlyFix()); }
			if(this.isCommonObj(x++)){ vals.push(common.isPushTimeWithLocationTs1()); }
			if(this.isCommonObj(x++)){ vals.push(common.isPushTimeWithLocationWeb()); }
			if(this.isCommonObj(x++)){ vals.push(common.isChatterWithLocation()); }
			if(this.isCommonObj(x++)){ vals.push(common.isJobLeaderFilter()); }
			if(this.isCommonObj(x++)){ vals.push(common.isWorkNoteCrlfOn()); }
			if(this.isCommonObj(x++)){ vals.push(common.getLimitToMainteJob()); }
			if(this.isCommonObj(x++)){ vals.push(common.getOutputJournal()); }
			if(this.isCommonObj(x++)){ vals.push(common.isOutputJournalOnProvisionalPayment()); }
			if(this.isCommonObj(x++)){ vals.push(common.isAllowEditExpAdmin()); }
			if(this.isCommonObj(x++)){ vals.push(common.isAllowEditManager()); }
			if(this.isCommonObj(x++)){ vals.push(common.isExpItemRevise()); }
			if(this.isCommonObj(x++)){ vals.push(common.isUsingReceiptSystem()); }
			if(this.isCommonObj(x++)){ vals.push(common.isUseReceiptOCR()); }
			if(this.isCommonObj(x++)){ vals.push(common.isUseShopCache()); }
			if(this.isCommonObj(x++)){ vals.push(common.isUseExternalShopSearch()); }
			if(this.isCommonObj(x++)){ vals.push(common.getAttachmentType()); }
			var body = '項目,値\n';
			for(var i = 0 ; i < heads.length ; i++){
				body += heads[i] + ',' + vals[i] + '\n';
			}
			return body;
		}
	});
});
