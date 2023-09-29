define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, json, array, str, Util) {
	return declare("tsext.configDownload.ConfigDownloadConfig", null, {
		constructor: function(record){
			this.config = record;
			if(this.config.Config__c){
				this.config.config = Util.fromJson(this.config.Config__c);
			}
			if(this.config.RestTimeCheck__c){
				this.config.restTimeCheck = Util.fromJson(this.config.RestTimeCheck__c);
			}
		},
		getConfigBaseId:		function(){ return this.config.ConfigBaseId__c; },
		getId:					function(){ return this.config.Id; },
		getName:				function(){ return this.config.Name; },
		getCreatedDate:			function(){ return this.config.CreatedDate; },
		getCreatedById:			function(){ return this.config.CreatedById; },
		getCreatedByName:		function(){ return this.config.CreatedBy.Name; },
		getLastModifiedDate:	function(){ return this.config.LastModifiedDate; },
		getLastModifiedById:	function(){ return this.config.LastModifiedById; },
		getLastModifiedByName:	function(){ return this.config.LastModifiedBy.Name; },
		getOwnerId:				function(){ return this.config.OwnerId; },
		getOwnerName:			function(){ return this.config.Owner.Name; },
		getOwnerIsActive:		function(){ return this.config.Owner.IsActive; },
		isCopy:					function(){ return (this.config.OriginalId__c ? true : false); },
		getOriginalId:			function(){ return this.config.OriginalId__c || ''; },
		getGeneration:			function(){ return this.config.Generation__c || 0; },
		getValidStartDate:		function(){ return this.config.ValidStartDate__c || ''; },
		getValidEndDate:		function(){ return this.config.ValidEndDate__c || ''; },
		getValidStartMonth:		function(){ return this.config.ValidStartMonth__c || ''; },
		getValidEndMonth:		function(){ return this.config.ValidEndMonth__c || ''; },
		isFlex: function(){
			return (this.config.WorkSystem__c == '1');
		},
		getWorkSystem: function(){
			switch(this.config.WorkSystem__c){
			case '1': return 'フレックスタイム制';
			case '2': return '変形労働時間制';
			case '3': return '管理監督者';
			default: return '固定労働時間制';
			}
		},
		getVariablePeriod: function(){
			if(this.config.WorkSystem__c != '1' && this.config.WorkSystem__c != '2'){
				return '';
			}
			switch(this.config.VariablePeriod__c){
			case '0': return '1週間';
			case '1': return '1ヵ月';
			case '2': return '2ヵ月';
			case '3': return '3ヵ月';
			case '6': return '6ヵ月';
			case '12': return '1年';
			default: return '???';
			}
		},
		getHolidays: function(){
			return this.config.Holidays__c || '';
		},
		// 法定休日自動判定
		isUseAutoLegalHoliday: function(){
			return this.config.AutoLegalHoliday__c;
		},
		// 国民の祝日
		isUsePublicHoliday: function(){
			return !this.config.NonPublicHoliday__c;
		},
		// 始業時刻
		getStdStartTime: function(){
			return Util.formatTime(this.config.StdStartTime__c);
		},
		// 終業時刻
		getStdEndTime: function(){
			return Util.formatTime(this.config.StdEndTime__c);
		},
		// 所定労働時間
		getStandardFixTime: function(){
			return Util.formatTime(this.config.StandardFixTime__c);
		},
		// 時間範囲をカンマ区切りにする
		formatTimeRanges: function(times){
			var times = (times || '').split(/,/);
			var rests = [];
			array.forEach(times, function(ts){
				var t = ts.split(/-/);
				if(t.length == 2){
					var st = Util.formatTime(t[0].trim());
					var et = Util.formatTime(t[1].trim());
					rests.push(st + '-' + et);
				}
			});
			return rests.join(',');
		},
		// 休憩
		getRestTimes: function(){
			return this.formatTimeRanges(this.config.RestTimes__c);
		},
		//-------------------------------------
		// フレックス開始時刻
		getFlexStartTime: function(){
			return (!this.isFlex() ? '' : Util.formatTime(this.config.FlexStartTime__c));
		},
		// フレックス終了時刻
		getFlexEndTime: function(){
			return (!this.isFlex() ? '' : Util.formatTime(this.config.FlexEndTime__c));
		},
		// コア時間を使用
		isUseCoreTime: function(){
			return (!this.isFlex() ? '' : (this.config.UseCoreTime__c || false));
		},
		// コア開始時刻
		getCoreStartTime: function(){
			return (!this.isFlex() ? '' : Util.formatTime(this.config.CoreStartTime__c));
		},
		// コア終了時刻
		getCoreEndTime: function(){
			return (!this.isFlex() ? '' : Util.formatTime(this.config.CoreEndTime__c));
		},
		// 勤怠グラフにコア時間を表示
		isCoreTimeGraph: function(){
			return (!this.isFlex() ? '' : (this.config.CoreTimeGraph__c || false));
		},
		// 月の所定労働時間
		getFlexFixMonthlyTime: function(){
			if(!this.isFlex()){
				return '';
			}
			if(this.config.FlexFixOption__c == '2'){
				return '自動';
			}else{
				return Util.formatTime(this.config.FlexFixMonthTime__c);
			}
		},
		// 所定労働時間を法定労働時間として扱う
		isFlexLegalWorkTimeOption: function(){
			if(!this.isFlex()){
				return '';
			}
			return (this.config.FlexLegalWorkTimeOption__c == '1');
		},
		//-------------------------------------
		// 半日休暇取得可
		isUseHalfHoliday: function(){
			return this.config.UseHalfHoliday__c;
		},
		// 午前半休開始時刻
		getAmHolidayStartTime: function(){
			return Util.formatTime(this.config.AmHolidayStartTime__c);
		},
		// 午前半休終了時刻
		getAmHolidayEndTime: function(){
			return Util.formatTime(this.config.AmHolidayEndTime__c);
		},
		// 午後半休開始時刻
		getPmHolidayStartTime: function(){
			return Util.formatTime(this.config.PmHolidayStartTime__c);
		},
		// 午後半休終了時刻
		getPmHolidayEndTime: function(){
			return Util.formatTime(this.config.PmHolidayEndTime__c);
		},
		// 半休取得時の休憩時間を適用する
		isUseHalfHolidayRestTime: function(){
			return this.config.UseHalfHolidayRestTime__c || false;
		},
		// 午前半休時休憩時間
		getAmHolidayRestTimes: function(){
			return this.formatTimeRanges(this.config.AmHolidayRestTimes__c);
		},
		// 午後半休時休憩時間
		getPmHolidayRestTimes: function(){
			return this.formatTimeRanges(this.config.PmHolidayRestTimes__c);
		},
		//-------------------------------------
		// １週間の法定労働時間
		getLegalTimeOfWeek: function(){
			return Util.formatTime(this.config.LegalTimeOfWeek__c);
		},
		// 時間単位休の基準時間
		getBaseTime: function(){
			return Util.formatTime(this.config.BaseTime__c);
		},
		// 積休用休暇換算時間
		getBaseTimeForStock: function(){
			var t = this.config.BaseTimeForStock__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 深夜労働割増
		isUseNightCharge: function(){
			return !this.config.IgonreNightWork__c;
		},
		// 残業と控除の相殺をしない
		isDeductWithFixedTime: function(){
			return this.config.DeductWithFixedTime__c;
		},
		// 代休を勤務時間とみなす
		isHalfDaiqReckontoWorked: function(){
			return this.config.HalfDaiqReckontoWorked__c;
		},
		// 未来の時刻は入力不可
		isPastTimeOnly: function(){
			return this.config.PastTimeOnly__c;
		},
		// 遅刻・早退を強調表示
		isHighlightLateEarly: function(){
			return this.config.HighlightLateEarly__c;
		},
		// 承認されるまで勤務時間の入力不可
		isProhibitInputTimeUntilApproved: function(){
			return this.config.ProhibitInputTimeUntilApproved__c;
		},
		// 出社・退社時刻を含む休憩入力不可
		isProhibitBorderRestTime: function(){
			var c = this.config.config;
			return (c && c.prohibitBorderRestTime) || false;
		},
		// 裁量労働を採用
		isUseDiscretionary: function(){
			return this.config.UseDiscretionary__c;
		},
		// 翌日にまたがる勤務時間の取扱い
		getWorkAcrossNextDay: function(){
			if(this.config.ExtendDayType__c){
				return '1暦日で計算する';
			}
			if(this.config.ClassificationNextDayWork__c == '1'){
				return '所定休日、法定休日を分けて計算する';
			}
			return '法定休日を分けて計算する';
		},
		// 2暦日で勤務日種別が異なる24:00以降の入力不可
		isLeavingAcrossNextDay: function(){
			return (this.config.LeavingAcrossNextDay__c == '1' || this.config.LeavingAcrossNextDay__c == '2');
		},
		// 休日出勤時の24:00以降の入力も不可
		isLeavingAcrossNextDay2: function(){
			return (this.config.LeavingAcrossNextDay__c == '2');
		},
		// 法定休憩時間のチェック
		getRestTimeCheck: function(index){
			var cs = this.config.restTimeCheck || [];
			var v = '';
			if(cs.length <= index){
				return v;
			}
			// 勤務時間${0}超の場合、休憩時間を${1}以上とること
			// 満たさない場合は、出社時刻から${0}後に強制的に休憩を追加する
			var c = cs[index];
			if(c.check){
				v = str.substitute("${0}->${1}", [Util.formatTime(c.workTime), Util.formatTime(c.restTime)]);
				if(c.push){
					v += str.substitute("->${0}", [Util.formatTime(c.offset)]);
				}
			}
			return v;
		},
		// 勤務時間を修正できる社員
		getPermitUpdateTimeLevel: function(){
			switch(this.config.PermitUpdateTimeLevel__c){
			case '1': return '本人以外（上司、管理者）';
			case '2': return '全社員のデータ編集者と管理者';
			case '3': return '管理者のみ';
			default : return '制限なし';
			}
		},
		// 時刻の丸め
		getTimeRound: function(){
			return this.config.TimeRound__c || '';
		},
		// 出社時刻の端数処理
		getTimeRoundBegin: function(){
			switch(this.config.TimeRoundBegin__c){
			case '1': return '切り捨て';
			case '2': return '切り上げ';
			default : return '';
			}
		},
		// 退社時刻の端数処理
		getTimeRoundEnd: function(){
			switch(this.config.TimeRoundEnd__c){
			case '1': return '切り捨て';
			case '2': return '切り上げ';
			default : return '';
			}
		},
		// 時刻の表示形式
		getTimeFormat: function(){
			return this.config.TimeFormat__c || '';
		},
		// 勤務表に工数入力ボタン表示
		isInputWorkingTimeOnWorkTimeView: function(){
			return this.config.InputWorkingTimeOnWorkTimeView__c || false;
		},
		// 承認ワークフロー
		isUseWorkFlow: function(){
			return this.config.UseWorkFlow__c || false;
		},
		// 承認者設定を使用する
		isUseApplyApproverTemplate: function(){
			return this.config.UseApplyApproverTemplate__c || false;
		},
		//-------------------------------------
		// 休日出勤申請
		isUseHolidayWorkFlag: function(){
			return (this.config.UseHolidayWorkFlag__c ? true : false);
		},
		// 休日出勤申請：休憩時間の変更を許可
		isHolidayWorkRestChangeable: function(){
			var c = this.config.config;
			return (c && c.empApply && c.empApply.holidayWorkRestChangeable) || false;
		},
		// 休日出勤申請：複数申請可
		isUseHolidayWorkDuplicate: function(){
			return (this.config.UseHolidayWorkFlag__c == 4);
		},
		//-------------------------------------
		// 振替申請
		isUseMakeupHoliday: function(){
			return this.config.UseMakeupHoliday__c || false;
		},
		// 振替申請：期間制限あり
		isExchangeLimit: function(){
			var v = this.config.ExchangeLimit__c;
			return (typeof(v) == 'number');
		},
		// 振替申請：振替休日の期間制限
		isExchangeLimitA: function(){
			var v = this.config.ExchangeLimit2__c;
			return (v === 0 ? '当月度内' : '次月度内');
		},
		// 振替申請：振替出勤の期間制限
		isExchangeLimitB: function(){
			var v = this.config.ExchangeLimit__c;
			return (v === 0 ? '当月度内' : (typeof(v) == 'number' && v > 1 ? v + 'ヵ月後まで' : '次月度内'));
		},
		// 振替申請：週内の法定休日がなくなる振替を禁止
		isProhibitApplicantEliminatingLegalHoliday: function(){
			return this.config.ProhibitApplicantEliminatingLegalHoliday__c || false;
		},
		//-------------------------------------
		// 勤務時間変更申請
		isChangePattern: function(){
			return (this.config.ChangePattern__c == '1');
		},
		// 勤務時間変更申請：シフト可
		isChangeShift: function(){
			return (this.config.ChangeShift__c == '1');
		},
		// 勤務時間変更申請：平日・休日変更を許可
		isChangeDayType: function(){
			return this.config.ChangeDayType__c || false;
		},
		// 勤務時間変更申請：法定休日を指定可
		isChangeDayType2: function(){
			var c = this.config.config;
			return (c && c.empApply && c.empApply.allowSelectionOfLegalHoliday) || false;
		},
		//-------------------------------------
		// 残業申請
		isUseOverTimeFlag: function(){
			var v = this.config.UseOverTimeFlag__c;
			return (typeof(v) == 'number' && v > 0);
		},
		// 残業申請：申請なし不可
		isUseOverTimeFlagOpt1: function(){
			var v = this.config.UseOverTimeFlag__c;
			return (typeof(v) == 'number' && (v == 2 || v == 6 || v == 7 || v == 8));
		},
		// 残業申請：申請なし－所定まで許可
		isUseOverTimeFlagOpt2: function(){
			if(this.isFlex()){ // フレックスタイム制
				return false;
			}
			var v = this.config.UseOverTimeFlag__c;
			return (typeof(v) == 'number' && (v == 7 || v == 8));
		},
		// 残業申請：申請なし－境界時刻
		getUseOverTimeFlagOpt3: function(){
			if(this.isFlex()){ // フレックスタイム制
				return '';
			}
			var v = this.config.OverTimeBorderTime__c;
			if(this.isUseOverTimeFlagOpt1() && typeof(v) == 'number' && v > 0){
				return Util.formatTime(v);
			}
			return '';
		},
		// 残業申請：申請なし－エラー時間
		getUseOverTimeFlagOpt4: function(){
			var c = this.config.config;
			if(this.isUseOverTimeFlagOpt1()){
				var t = (c && c.empApply && c.empApply.overTimeRequireTime) || 0;
				return (t > 0 ? Util.formatTime(t) : '');
			}
			return '';
		},
		// 残業申請：初期値＝フレックス境界時刻
		isUseOverTimeInitFlex: function(){
			var c = this.config.config;
			return (c && c.empApply && c.empApply.overTimeInitOverFlexZone) || false;
		},
		// 残業申請：複数申請可
		isUseOverTimeDuplicate: function(){
			var v = this.config.UseOverTimeFlag__c;
			return (typeof(v) == 'number' && (v == 4 || v == 6 || v == 8));
		},
		// 残業申請：期間で申請可
		isUseOverTimeBulk: function(){
			var c = this.config.config;
			return (c && c.empApply && c.empApply.useBulkOverTime) || false;
		},
		//-------------------------------------
		// 早朝勤務申請
		isUseEarlyWorkFlag: function(){
			var v = this.config.UseEarlyWorkFlag__c;
			return (typeof(v) == 'number' && v > 0);
		},
		// 早朝勤務申請：申請なし不可
		isUseEarlyWorkFlagOpt1: function(){
			var v = this.config.UseEarlyWorkFlag__c;
			return (typeof(v) == 'number' && (v == 2 || v == 6 || v == 7 || v == 8));
		},
		// 早朝勤務申請：申請なし－所定まで許可
		isUseEarlyWorkFlagOpt2: function(){
			if(this.isFlex()){ // フレックスタイム制
				return false;
			}
			var v = this.config.UseEarlyWorkFlag__c;
			return (typeof(v) == 'number' && (v == 7 || v == 8));
		},
		// 早朝勤務申請：申請なし－境界時刻
		getUseEarlyWorkFlagOpt3: function(){
			if(this.isFlex()){ // フレックスタイム制
				return '';
			}
			var v = this.config.EarlyWorkBorderTime__c;
			if(this.isUseEarlyWorkFlagOpt1() && typeof(v) == 'number' && v > 0){
				return Util.formatTime(v);
			}
			return '';
		},
		// 早朝勤務申請：申請なし－エラー時間
		getUseEarlyWorkFlagOpt4: function(){
			var c = this.config.config;
			if(this.isUseEarlyWorkFlagOpt1()){
				var t = (c && c.empApply && c.empApply.earlyWorkRequireTime) || 0;
				return (t > 0 ? Util.formatTime(t) : '');
			}
			return '';
		},
		// 早朝勤務申請：初期値＝フレックス境界時刻
		isUseEarlyWorkInitFlex: function(){
			var c = this.config.config;
			return (c && c.empApply && c.empApply.earlyWorkInitOverFlexZone) || false;
		},
		// 早朝勤務申請：複数申請可
		isUseEarlyWorkDuplicate: function(){
			var v = this.config.UseEarlyWorkFlag__c;
			return (typeof(v) == 'number' && (v == 4 || v == 6 || v == 8));
		},
		// 早朝勤務申請：期間で申請可
		isUseEarlyWorkBulk: function(){
			var c = this.config.config;
			return (c && c.empApply && c.empApply.useBulkEarlyWork) || false;
		},
		//-------------------------------------
		// 遅刻申請
		isUseLateStartApply: function(){
			return this.config.UseLateStartApply__c || false;
		},
		// 遅刻申請：遅刻時は必須
		isRequireLateApply: function(){
			var c = this.config.config;
			return (c && c.empApply && c.empApply.requireLateApply) || false;
		},
		//-------------------------------------
		// 早退申請
		isUseEarlyEndApply: function(){
			return this.config.UseEarlyEndApply__c || false;
		},
		// 早退申請：早退時は必須
		isRequireEarlyEndApply: function(){
			var c = this.config.config;
			return (c && c.empApply && c.empApply.requireEarlyEndApply) || false;
		},
		//-------------------------------------
		// 直行・直帰申請
		isUseDirectApply: function(){
			return this.config.UseDirectApply__c || false;
		},
		// 直行・直帰申請：作業区分
		getWorkTypeList: function(){
			var v = this.config.WorkTypeList__c;
			return v;
		},
		//-------------------------------------
		// 勤怠時刻修正申請
		isUseReviseTimeApply: function(){
			return this.config.UseReviseTimeApply__c || false;
		},
		//-------------------------------------
		// 日次確定申請
		isUseDailyApply: function(){
			return this.config.UseDailyApply__c || false;
		},
		// 日次確定申請：勤務表にボタン表示
		isInputWorkingTimeOnWorkTimeView: function(){
			if(!this.isUseDailyApply()){
				return false;
			}
			return this.config.InputWorkingTimeOnWorkTimeView__c || false;
		},
		// 日次確定申請：日次確定申請の承認者
		getDailyApprover: function(){
			if(!this.isUseDailyApply()){
				return '';
			}
			switch(this.config.DailyApprover__c){
			case '1': return 'ジョブリーダー';
			default: return '上長';
			}
		},
		// 日次確定申請：日次確定申請漏れのチェック
		isCheckDailyFixLeak: function(){
			if(!this.isUseDailyApply()){
				return false;
			}
			return (this.config.CheckDailyFixLeak__c == 1);
		},
		//-------------------------------------
		// 工数入力時間のチェック：日次確定時
		isCheckWorkingTime: function(){
			if(!this.isUseDailyApply()){
				return false;
			}
			return this.config.CheckWorkingTime__c || false;
		},
		// 工数入力時間のチェック：月次確定時
		isCheckWorkingTimeMonthly: function(){
			return this.config.CheckWorkingTimeMonthly__c || false;
		},
		//-------------------------------------
		// 勤務確定時の未入力日の扱い
		isRequireDailyInput: function(){
			var c = this.config.config;
			return (c && c.empApply && c.empApply.requireDailyInput) || false;
		},
		//-------------------------------------
		// 入退館管理：使用する
		isUseAccessControlSystem: function(){
			return this.config.UseAccessControlSystem__c || false;
		},
		// 入退館管理：乖離許容時間(分)
		getPermitDivergenceTime: function(){
			var t = this.config.PermitDivergenceTime__c;
			return (typeof(t) == 'number' ? t : '');
		},
		// 入退館管理：入退館基準時間(平日)
		getWeekDayAccessBaseTime: function(){
			var t = this.config.WeekDayAccessBaseTime__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 入退館管理：入退館基準時間(休日)
		getHolidayAccessBaseTime: function(){
			var t = this.config.HolidayAccessBaseTime__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 入退館管理：日次確定申請時の乖離判定
		isPermitDailyApply: function(){
			return this.config.PermitDailyApply__c || false;
		},
		// 入退館管理：月次確定申請時の乖離判定
		isPermitMonthlyApply: function(){
			return this.config.PermitMonthlyApply__c || false;
		},
		// 入退館管理：月次サマリーに入退館情報を表示する
		isMsAccessInfo: function(){
			return this.config.MsAccessInfo__c || false;
		}
	});
});
