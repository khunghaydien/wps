define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤怠設定
	return declare("tsext.testAssist.ExportConfig", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 * @param {tsext.testAssist.ExportObjs} parent
		 */
		constructor: function(manager, obj, parent){
			this.obj.ValidStartDate__c = Util.formatDate(this.obj.ValidStartDate__c);
			this.obj.ValidEndDate__c = Util.formatDate(this.obj.ValidEndDate__c);
			this.obj.Config__c = Util.fromJson(this.obj.Config__c);
			this.obj.RestTimeCheck__c = Util.fromJson(this.obj.RestTimeCheck__c);
		},
		getConfigBaseId: function(){
			return this.obj.ConfigBaseId__c;
		},
		isMatchByConfigBaseId: function(configBaseId){
			return (this.getConfigBaseId() == configBaseId);
		},
		isMatchByConfigBaseIdAndDate: function(configBaseId, d){
			if(this.getConfigBaseId() == configBaseId
			&& (!this.obj.ValidStartDate__c || this.obj.ValidStartDate__c <= d)
			&& (!this.obj.ValidEndDate__c || d <= this.obj.ValidEndDate__c)){
				return true;
			}
			return false;
		},
		getValidStartDate: function(){
			return this.obj.ValidStartDate__c || null;
		},
		getValidEndDate: function(){
			return this.obj.ValidEndDate__c || null;
		},
		compareRevision: function(other){
			var vs1 = this.getValidStartDate();
			var vs2 = other.getValidStartDate();
			if(!vs1 && vs2){
				return -1;
			}else if(vs1 && !vs2){
				return 1;
			}else if(vs1 == vs2){ // あり得ない
				return (this.getId() < other.getId() ? -1 : 1);
			}else{
				return (vs1 < vs2 ? -1 : 1);
			}
		},
		getWorkSystem: function(){
			var ws = this.obj.WorkSystem__c;
			switch(ws){
			case '0': return '固定';
			case '1': return 'フレックス';
			case '2': return '変形';
			case '3': return '管理監督';
			}
		},
		isWorkSystemManager: function(){
			return (this.obj.WorkSystem__c == '3');
		},
		getVariablePeriod: function(){
			var ws = this.obj.WorkSystem__c;
			var p = this.obj.VariablePeriod__c;
			if(ws == '0'
			|| ws == '3'
			|| (ws == '1' && p != '2' && p != '3')){
				return null;
			}
			return p;
		},
		getHolidays: function(){
			var h = (this.obj.Holidays__c || '') + '0000000';
			var w = ['日','月','火','水','木','金','土'];
			var l = [];
			for(var i = 0 ; i < 7 ; i++){
				var s = h.substring(i, i + 1);
				if(s == '1'){
					l.push(w[i] + ':' + '休日');
				}else if(s == '2'){
					l.push(w[i] + ':' + '法定休日');
				}
			}
			return l.join('|');
		},
		getUseOverTimeFlagItem: function(flag, borderTime){
			var item = '';
			if(!flag){
				item = 'OFF';
			}else{
				switch(flag){
				case 1: item = 'ON'; break;
				case 2: item = '必須'; break;
				case 4: item = '複数申請可'; break;
				case 6: item = '必須|複数申請可'; break;
				case 7: item = '必須|所定'; break;
				case 8: item = '必須|所定|複数申請可'; break;
				}
			}
			var t = borderTime;
			if(Util.isNum(t) && t >= 0 && item.indexOf('必須') >= 0){
				item += ('|' + Util.formatTime(t));
			}
			return item;
		},
		// 残業申請
		getUseOverTimeFlag: function(){
			return this.getUseOverTimeFlagItem(this.obj.UseOverTimeFlag__c, this.obj.OverTimeBorderTime__c);
		},
		// 早朝勤務申請
		getUseEarlyWorkFlag: function(){
			return this.getUseOverTimeFlagItem(this.obj.UseEarlyWorkFlag__c, this.obj.EarlyWorkBorderTime__c);
		},
		// 残業申請必須境界
		getOverTimeRequireTime: function(){
			return Math.max(this.getValueByKey('Config__c.empApply.overTimeRequireTime', 0), 0);
		},
		// 早朝勤務申請必須境界
		getEarlyWorkRequireTime: function(){
			return Math.max(this.getValueByKey('Config__c.empApply.earlyWorkRequireTime', 0), 0);
		},
		getWorkingAcrossNextDayItem: function(){
			var item = '';
			var c = this.obj.ClassificationNextDayWork__c;
			if(!this.obj.ExtendDayType__c){
				if(c == '0'){
					item = '法定休日を分けて計算する';
				}else if(c == '1'){
					item = '所定休日、法定休日を分けて計算する';
				}
			}else{
				if(c == '0'){
					item = '1暦日で計算する';
				}
			}
			return item;
		},
		getLeavingAcrossNextDayItem: function(){
			var item = '';
			var c = this.obj.LeavingAcrossNextDay__c;
			if(c == '2'){
				item = '休日出勤の場合は不可';
			}else if(c == '1'){
				item = '勤務日種別が異なる場合は不可';
			}
			return item;
		},
		getRestTimeCheckItem: function(){
			var rcs = this.obj.RestTimeCheck__c || [];
			var bufs = [];
			for(var i = 0 ; i < rcs.length ; i++){
				var rc = rcs[i];
				var s = (rc.check ? 'ON' : 'OFF') + (Util.formatTime(rc.workTime) + '->' + Util.formatTime(rc.restTime));
				if(typeof(rc.offset) == 'number'){
					s += ('->' + (rc.push ? 'ON' : 'OFF') + Util.formatTime(rc.offset));
				}
				bufs.push(s);
			}
			return bufs.join('|');
		},
		getUseHolidayWorkFlagItem : function(){
			var flag = this.obj.UseHolidayWorkFlag__c || 0;
			if(flag == 4){
				return '複数申請可';
			}else{
				return this.Bool(flag == 1);
			}
		},
		getExchangeLimit : function(n){
			if(typeof(n) != 'number'){
				return '';
			}
			switch(n){
			case 0: return '当月度内';
			case 1: return '次月度内';
			default: return n + '月度内';
			}
		},
		// 振替休日を取得した日の振替勤務日を選択できる期間
		getExchangeOnLimit : function(){
			return this.getExchangeLimit(this.obj.ExchangeLimit2__c);
		},
		// 休日に勤務した日の振替休日を選択できる期間
		getExchangeOffLimit : function(){
			return this.getExchangeLimit(this.obj.ExchangeLimit__c);
		},
		// 勤務時間を修正できる社員
		getPermitUpdateTimeLevel : function(){
			switch(this.obj.PermitUpdateTimeLevel__c){
			case '1': return '本人以外';
			case '2': return '管理者のみ';
			case '3': return '全社員のデータ編集者と管理者';
			}
			return '制限なし';
		},
		getTimeRoundBegin : function(){
			return (this.obj.TimeRoundBegin__c == '1' ? '切り捨て' : '切り上げ');
		},
		getTimeRoundEnd : function(){
			return (this.obj.TimeRoundEnd__c == '1' ? '切り捨て' : '切り上げ');
		},
		getWorkTypeList: function(){
			return (this.obj.WorkTypeList__c || '').split(/\r?\n/).join('|');
		},
		getDailyFixApprover: function(){
			var approver = this.obj.approverilyApprover__c;
			return (approver == '1' ? 'ジョブリーダー' : '上長');
		},
		// 月の所定労働時間
		getFlexFixMonthTime: function(){
			return (this.obj.FlexFixOption__c == '2' ? '自動' : Util.formatTime(this.obj.FlexFixMonthTime__c));
		},
		/**
		 * 勤怠設定をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {tsext.testAssist.ExportEmpType} empType
		 * @param {Array.<tsext.testAssist.ExportVirMonth>} virMonths
		 * @returns {Array.<string>}
		 */
		 outputExportConfig: function(lst, visit){
			var heads = [Constant.KEY_SETTING, Constant.KEY_EMPTYPE, '']; // 設定,勤務体系,
			return this.outputExportConfigImpl({
				lst   : lst,
				head  : heads,
				org   : this.parent.getDefaultConfig(),
				seize : ['WorkSystem__c','StdStartTime__c','RestTimes__c','StandardFixTime__c','UseHalfHoliday__c','AmHolidayStartTime__c','PmHolidayStartTime__c']
			});
		},
		/**
		 * 勤怠設定の改定をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {tsext.testAssist.ExportEmpType} empType
		 * @param {string} sd (yyyy-MM-dd)
		 * @returns {Array.<string>}
		 */
		 outputExportConfigRevision: function(lst, visit, empType, sd){
			var ym = empType.calcYearMonth(sd);
			var heads = [Constant.KEY_SETTING, Constant.KEY_CONFIG]; // 設定,勤怠設定
			this.L(lst, [Constant.OPTION_REV, empType.getName(), ym], heads); // 改定,{勤務体系名},{年月}
			this.outputExportConfigImpl({
				lst    : lst,
				head   : heads.concat(''),
				org    : this.parent.getDefaultConfig(),
				seize  : []
			});
			this.L(lst, [Constant.OPTION_END], heads); // 終了
			return lst;
		},
		/**
		 * 勤怠設定の変更をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {tsext.testAssist.ExportEmpType} empType
		 * @param {tsext.testAssist.ExportConfig} org
		 * @param {string} sd (yyyy-MM-dd)
		 * @returns {Array.<string>}
		 */
		 outputExportConfigChange: function(lst, visit, empType, org, sd){
			var ym = empType.calcYearMonth(sd);
			var heads = [Constant.KEY_SETTING, Constant.KEY_CONFIG]; // 設定,勤怠設定
			var changeList = [];
			this.outputExportConfigImpl({
				lst    : changeList,
				head   : heads.concat(''),
				org    : org,
				seize  : []
			});
			if(changeList.length > 0){
				this.L(lst, [Constant.OPTION_CHANGE, empType.getName()], heads); // 変更,{勤務体系名},{年月}
				for(var i = 0 ; i < changeList.length ; i++){
					lst.push(changeList[i]);
				}
				this.L(lst, [Constant.OPTION_END], heads); // 終了
			}
			return lst;
		},
		/**
		 * 勤怠設定をエクスポート
		 * @param {{lst:{Array.<Object>}, head:{string}, org:{Object}, seize:{Array.<string|Object>}, allin:{boolean}}} cpx 
		 * @returns {Array.<string>}
		 */
		outputExportConfigImpl: function(cpx){
			this.P(cpx, Constant.SET_WORKSYSTM              , null, 'getWorkSystem'                                      ); // 労働時間制
			this.P(cpx, Constant.SET_PERIOD                 , null, 'getVariablePeriod', '1'                             ); // 変形期間
			this.P(cpx, Constant.SET_WEEKLY_HOLIDAY         , null, 'getHolidays'                                        ); // 休日
			this.P(cpx, Constant.SET_AUTO_LEGAL_HOLIDAY     , 'AutoLegalHoliday__c'                                      ); // 法定休日の自動判定
			this.P(cpx, Constant.SET_PUBLIC_HOLIDAY         , 'NonPublicHoliday__c'                                      ); // 祝日は休日ではない
			this.P(cpx, Constant.SET_START_END_WORK_TIME    , ['StdStartTime__c','StdEndTime__c'], 'formatTimeRange'     ); // 始業終業
			this.P(cpx, Constant.SET_BREAK_TIME             , 'RestTimes__c'                     , 'formatCommaTimes'    ); // 休憩時間
			this.P(cpx, Constant.SET_REGULAR_WORK_TIME      , 'StandardFixTime__c'               , 'formatTime'          ); // 所定労働時間
			this.P(cpx, Constant.SET_BASE_TIME              , 'BaseTime__c', 'formatTime'                                ); // 時間単位休の基準時間(年次有給休暇用)
			if(Util.isNum(this.obj.BaseTimeForStock__c)){
				this.P(cpx, Constant.SET_BASE_TIME_FOR_STOCK, 'BaseTimeForStock__c', 'formatTime'                        ); // 時間単位休の基準時間(日数管理休暇用)
			}
			this.P(cpx, Constant.SET_USE_HALF_HOLIDAY       , 'UseHalfHoliday__c'                                        ); // 半日休暇取得可
			if(this.obj.UseHalfHoliday__c){
				this.P(cpx, Constant.SET_HALF_AM_TIME, ['AmHolidayStartTime__c','AmHolidayEndTime__c'], 'formatTimeRange'); // 午前半休適用時間
				this.P(cpx, Constant.SET_HALF_PM_TIME, ['PmHolidayStartTime__c','PmHolidayEndTime__c'], 'formatTimeRange'); // 午後半休適用時間
			}
			this.P(cpx, Constant.SET_USE_HALF_BREAK_TIME    , 'UseHalfHolidayRestTime__c'                                ); // 半休取得時の休憩時間
			if(this.obj.UseHalfHolidayRestTime__c){
				this.P(cpx, Constant.SET_AM_HOLIDAY_BREAK   , 'AmHolidayRestTimes__c', 'formatCommaTimes'                ); // 午前半休時休憩時間
				this.P(cpx, Constant.SET_PM_HOLIDAY_BREAK   , 'PmHolidayRestTimes__c', 'formatCommaTimes'                ); // 午後半休時休憩時間
			}
			this.P(cpx, Constant.SET_IGNORE_NIGHT_CHARGE    , 'IgonreNightWork__c'                                       ); // 深夜労働割増なし
			this.P(cpx, Constant.SET_BAN_BORDER_REST        , 'Config__c.prohibitBorderRestTime'                         ); // 出退社時刻を含む休憩不可
			this.P(cpx, Constant.SET_OFFSET_OVER_DEDUCT     , 'DeductWithFixedTime__c'                                   ); // 残業と控除の相殺しない
			this.P(cpx, Constant.SET_HIGHLIGHT_LATE_EARLY   , 'HighlightLateEarly__c'                                    ); // 遅刻・早退を強調表示する
			this.P(cpx, Constant.SET_INPUT_AFTER_APPROVED   , 'ProhibitInputTimeUntilApproved__c'                        ); // (休日出勤申請または振替申請が)承認されるまで勤務時間の入力不可
			this.P(cpx, Constant.SET_DISCRETIONARY          , 'UseDiscretionary__c'                                      ); // 裁量労働
			this.P(cpx, Constant.SET_WEEKLY_LEGAL_TIME      , 'LegalTimeOfWeek__c', 'formatTime'                         ); // 週の法定労働時間
			this.P(cpx, Constant.SET_DAIQ_IS_WORK_TIME      , 'HalfDaiqReckontoWorked__c'                                ); // 代休は勤務時間とみなす
			this.P(cpx, Constant.SET_WORK_ACROSS_NEXTDAY    , null, 'getWorkingAcrossNextDayItem'                        ); // 翌日にまたがる勤務時間の取扱い
			this.P(cpx, Constant.SET_INPUT_OVER_24          , null, 'getLeavingAcrossNextDayItem'                        ); // 24:00以降の入力
			this.P(cpx, Constant.SET_REST_TIME_CHECK        , null, 'getRestTimeCheckItem'                               ); // 法定休憩時間のチェック
			this.P(cpx, Constant.SET_PERMIT_UPDATE_LEVEL    , null, 'getPermitUpdateTimeLevel'                           ); // 勤務時間を修正できる社員
			this.P(cpx, Constant.SET_TIME_ROUND             , 'TimeRound__c'                                             ); // 時刻の丸め
			this.P(cpx, Constant.SET_TIME_ROUND_BEGIN       , null, 'getTimeRoundBegin'                                  ); // 出社時刻の端数処理
			this.P(cpx, Constant.SET_TIME_ROUND_END         , null, 'getTimeRoundEnd'                                    ); // 退社時刻の端数処理
			this.P(cpx, Constant.SET_TIME_FORMAT            , 'TimeFormat__c'                                            ); // 時刻表示形式
			this.P(cpx, Constant.SET_MAN_HOURS_TIMESHEET    , 'InputWorkingTimeOnWorkTimeView__c'                        ); // 勤務表で工数入力

			this.P(cpx, Constant.SET_USE_APPROVAL_PROCESS   , 'UseWorkFlow__c'                                           ); // 承認ワークフロー
			this.P(cpx, Constant.SET_USE_APPROVER_SETTING   , 'UseApplyApproverTemplate__c'                              ); // 承認者設定
			this.P(cpx, Constant.SET_APPLY_HOLIDAY_WORK     , null, 'getUseHolidayWorkFlagItem'                          ); // 休日出勤申請
			this.P(cpx, Constant.SET_HOLIDAY_WORK_BREAK     , 'Config__c.empApply.holidayWorkRestChangeable'             ); // 休日出勤申請で休憩時間の変更を許可
			this.P(cpx, Constant.SET_APPLY_EXCHANGE         , 'UseMakeupHoliday__c'                                      ); // 振替申請
			this.P(cpx, Constant.SET_EXCHANGE_ON_LIMIT      , null, 'getExchangeOnLimit'                                 ); // 振替申請で振替勤務日を選択できる期間
			this.P(cpx, Constant.SET_EXCHANGE_OFF_LIMIT     , null, 'getExchangeOffLimit'                                ); // 振替申請で振替休日を選択できる期間
			this.P(cpx, Constant.SET_EXCHANGE_BAN_ALL_ON    , 'ProhibitApplicantEliminatingLegalHoliday__c'              ); // 週内の法定休日がなくなる振替を禁止
			this.P(cpx, Constant.SET_APPLY_SHIFTCHANGE      , 'Config__c.empApply.useShiftChange'                        ); // シフト振替申請
			this.P(cpx, Constant.SET_APPLY_PATTERNS         , 'ChangePattern__c', 'formatBoolean'                        ); // 勤務時間変更申請
			var useChangePattern = Util.parseInt(this.obj.ChangePattern__c) || 0;
			if(useChangePattern){
				this.P(cpx, Constant.SET_SELF_SHIFT         , 'ChangeShift__c'  , 'formatBoolean'                        ); // 勤務時間変更申請でシフト可
				this.P(cpx, Constant.SET_SELF_DAYTYPE       , 'ChangeDayType__c', 'formatBoolean'                        ); // 勤務時間変更申請で平日・休日変更を許可
				this.P(cpx, Constant.SET_SELF_LEGAL_HOLIDAY , 'Config__c.empApply.allowSelectionOfLegalHoliday'          ); // 勤務時間変更申請で法定休日を指定可
				this.P(cpx, Constant.SET_PROHIBIT_WS_CHANGE , 'Config__c.empApply.prohibitWorkShiftChange'               ); // 勤務パターンの指定不可
			}
			this.P(cpx, Constant.SET_APPLY_OVER_WORK        , null, 'getUseOverTimeFlag'                                 ); // 残業申請
			this.P(cpx, Constant.SET_MUST_OVER_APPLY        , null, 'getOverTimeRequireTime'                             ); // 残業申請必須境界
			this.P(cpx, Constant.SET_BULK_OVER_APPLY        , 'Config__c.empApply.useBulkOverTime'                       ); // 残業申請を期間で申請可
			this.P(cpx, Constant.SET_OVER_APPLY_INIT_FLEX   , 'Config__c.empApply.overTimeInitOverFlexZone'              ); // 残業申請の初期値をフレックス時間に合わせる
			this.P(cpx, Constant.SET_APPLY_MONTHLY_OVER     , 'Config__c.empApply.useMonthlyOverTimeApply'               ); // 月次残業申請
			this.P(cpx, Constant.SET_MONTHLY_OVER_MUST      , 'Config__c.empApply.monthlyOverTimeRequireFlag'            ); // 月次残業申請必須
			this.P(cpx, Constant.SET_MONTHLY_OVER_BORDER    , 'Config__c.empApply.monthlyOverTimeRequireTime'            ); // 月次残業申請必須境界
			this.P(cpx, Constant.SET_MONTHLY_OVER_DUPL      , 'Config__c.empApply.monthlyOverTimeDupl'                   ); // 月次残業申請複数申請可
			this.P(cpx, Constant.SET_APPLY_EARLY_WORK       , null, 'getUseEarlyWorkFlag'                                ); // 早朝勤務申請
			this.P(cpx, Constant.SET_MUST_EARLY_APPLY       , null, 'getEarlyWorkRequireTime'                            ); // 早朝勤務申請必須境界
			this.P(cpx, Constant.SET_BULK_EARLY_APPLY       , 'Config__c.empApply.useBulkEarlyWork'                      ); // 早朝勤務申請を期間で申請可
			this.P(cpx, Constant.SET_EARLY_WORK_INIT_FLEX   , 'Config__c.empApply.earlyWorkInitOverFlexZone'             ); // 早朝勤務申請の初期値をフレックス時間に合わせる
			this.P(cpx, Constant.SET_APPLY_LATESTART        , 'UseLateStartApply__c'                                     ); // 遅刻申請
			this.P(cpx, Constant.SET_MUST_LATESTART         , 'Config__c.empApply.requireLateApply'                      ); // 遅刻申請必須
			this.P(cpx, Constant.SET_APPLY_EARLYEND         , 'UseEarlyEndApply__c'                                      ); // 早退申請
			this.P(cpx, Constant.SET_MUST_EARLYEND          , 'Config__c.empApply.requireEarlyEndApply'                  ); // 早退申請必須
			this.P(cpx, Constant.SET_APPLY_DIRECT           , 'UseDirectApply__c'                                        ); // 直行・直帰申請
			this.P(cpx, Constant.SET_DIRECT_WORKTYPES       , null, 'getWorkTypeList'                                    ); // 作業区分
			this.P(cpx, Constant.SET_APPLY_REVISE_TIME      , 'UseReviseTimeApply__c'                                    ); // 勤怠時刻修正申請
			this.P(cpx, Constant.SET_APPLY_DAILY_FIX        , 'UseDailyApply__c'                                         ); // 日次確定
			// 日次確定
			if(this.obj.UseDailyApply__c){
				this.P(cpx, Constant.SET_DAILY_FIX_BUTTON   , 'SeparateDailyFixButton__c'                                ); // 日次確定ボタンを表示
				this.P(cpx, Constant.SET_DAILY_FIX_APPROVER , null, 'getDailyFixApprover'                                ); // 日次確定申請の承認者
				this.P(cpx, Constant.SET_DAILY_FIX_CHECK    , 'CheckDailyFixLeak__c', 'formatBoolean'                    ); // 日次確定申請漏れのチェック
				this.P(cpx, Constant.SET_CHECK_TIME_DAILY   , 'CheckWorkingTime__c'                                      ); // 日次確定時に工数入力時間をチェック
				this.P(cpx, Constant.SET_CHECK_TIME_MONTHLY , 'CheckWorkingTimeMonthly__c'                               ); // 月次確定時に工数入力時間をチェック
			}
			this.P(cpx, Constant.SET_CHECK_EMPTY            , 'Config__c.requireDailyInput'                              ); // 勤怠入力必須
			// フレックスタイムの設定
			if(this.obj.WorkSystem__c == '1'){ // フレックス
				this.P(cpx, Constant.SET_FLEX_TIME          , ['FlexStartTime__c','FlexEndTime__c'], 'formatTimeRange'   ); // フレックス時間
				this.P(cpx, Constant.SET_USE_CORE_TIME      , 'UseCoreTime__c'                                           ); // コア時間を設定する
				if(this.obj.UseCoreTime__c){
					this.P(cpx, Constant.SET_CORE_TIME      , ['CoreStartTime__c','CoreEndTime__c'], 'formatTimeRange'   ); // コア時間
					this.P(cpx, Constant.SET_SHOW_CORE_TIME , 'CoreTimeGraph__c'                                         ); // コア時間を表示する
				}
				this.P(cpx, Constant.SET_FLEX_MONTHLY_TIME  , null, 'getFlexFixMonthTime'                                ); // 月の所定労働時間
				this.P(cpx, Constant.SET_ADJUST_LEGAL_TIME  , 'FlexLegalWorkTimeOption__c'                               ); // 法定労働時間調整
			}
			// 入退館管理
			this.P(cpx, Constant.SET_USE_ACCESS_CONTROL     , 'UseAccessControlSystem__c'                                ); // 入退館管理
			if(this.obj.UseAccessControlSystem__c){
				this.P(cpx, Constant.SET_PERMIT_DIVERGENCE  , 'PermitDivergenceTime__c'                                  ); // 乖離許容時間
				this.P(cpx, Constant.SET_WEEKDAY_ACCESS_BASE, 'WeekDayAccessBaseTime__c', 'formatTime'                   ); // 入退館基準時間(平日)
				this.P(cpx, Constant.SET_HOLIDAY_ACCESS_BASE, 'HolidayAccessBaseTime__c', 'formatTime'                   ); // 入退館基準時間(休日)
				this.P(cpx, Constant.SET_DAYFIX_PRE_DIVERGE , 'PermitDailyApply__c'                                      ); // 乖離判定前の日次確定許可
				this.P(cpx, Constant.SET_MONTHFIX_ON_DIVERGE, 'PermitMonthlyApply__c'                                    ); // 乖離発生時の月次確定許可
				this.P(cpx, Constant.SET_MS_ACCESS_INFO     , 'MsAccessInfo__c'                                          ); // 月次サマリーに入退館情報を表示
			}
			// 36協定上限設定
			this.P(cpx, Constant.SET_OVERTIME_MONTH_LIMIT   , 'OverTimeMonthLimit__c'  , 'formatTime'                    ); // 月間時間外勤務限度時間
			this.P(cpx, Constant.SET_OVERTIME_YEAR_LIMIT    , 'OverTimeYearLimit__c'   , 'formatTime'                    ); // 年間時間外勤務限度時間
			this.P(cpx, Constant.SET_OVERTIME_LHMONTH_LIMIT , 'OverTimeLHMonthLimit__c', 'formatTime'                    ); // 月間時間外勤務(法定休日含む)限度時間
			this.P(cpx, Constant.SET_OVERTIME_SPYEAR_LIMIT  , 'OverTimeSPYearLimit__c' , 'formatTime'                    ); // 特別条項・年間時間外勤務限度時間
			this.P(cpx, Constant.SET_OVERTIME_SPCOUNT_LIMIT , 'OverTimeSPCountLimit__c'                                  ); // 特別条項・月間時間外勤務限度超過限度回数

			// テレワーク勤務
			this.P(cpx, Constant.SET_USE_WORK_LOCATION      , 'UseWorkLocation__c'                                       ); // 勤務場所を使用する
			this.P(cpx, Constant.SET_REQUIRE_WORK_LOCATION  , 'RequireWorkLocation__c'                                   ); // 勤務場所を必須とする
			return cpx.lst;
		}
	});
});
