define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤務パターン
	var ExportPattern = declare("tsext.testAssist.ExportPattern", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 * @param {tsext.testAssist.ExportObjs=} parent
		 */
		constructor: function(manager, obj, parent){
		},
		isCopy: function(){
			return (this.obj.OriginalId__c ? true : false);
		},
		getOriginalId: function(){
			return this.obj.OriginalId__c || null;
		},
		getRange: function(){
			return (this.obj.Range__c == '2' ? '長期' : '短期');
		},
		/**
		 * 勤務パターンをエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @returns {Array.<string>}
		 */
		 outputExportPattern: function(lst, visit){
			var heads = [Constant.KEY_SETTING, Constant.KEY_PATTERN]; // 設定,勤務パターン
			this.L(lst, [Constant.OPTION_NEW, this.getName()], heads); // 新規,{勤務パターン名}
			this.outputExportPatternImpl({
				lst    : lst,
				head   : heads.concat(''),
				org    : this.parent.getDefaultPattern(),
				seize  : ['StdStartTime__c','RestTimes__c','StandardFixTime__c']
			});
			this.L(lst, [Constant.OPTION_END], heads); // 終了
			return lst;
		},
		outputExportPatternImpl: function(cpx){
			this.P(cpx, Constant.SET_START_END_WORK_TIME    , ['StdStartTime__c','StdEndTime__c'], 'formatTimeRange'     ); // 始業終業
			this.P(cpx, Constant.SET_BREAK_TIME             , 'RestTimes__c'                     , 'formatCommaTimes'    ); // 休憩時間
			this.P(cpx, Constant.SET_REGULAR_WORK_TIME      , 'StandardFixTime__c'               , 'formatTime'          ); // 所定労働時間
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
			this.P(cpx, Constant.SET_PATTERN_RANGE          , null, 'getRange'                                           ); // 対象期間
			this.P(cpx, Constant.SET_IGNORE_NIGHT_CHARGE    , 'IgonreNightWork__c'                                       ); // 深夜労働割増なし
			this.P(cpx, Constant.SET_DISCRETIONARY          , 'UseDiscretionary__c'                                      ); // 裁量労働
			this.P(cpx, Constant.SET_SYMBOL                 , 'Symbol__c'                                                ); // 略称
			this.P(cpx, Constant.SET_BAN_REG_NORMAL         , 'ProhibitChangeWorkTime__c'                                ); // 平日勤務の所定時間の変更を禁止
			this.P(cpx, Constant.SET_BAN_REG_HOLIDAY        , 'ProhibitChangeHolidayWorkTime__c'                         ); // 休日出勤の所定時間の変更を禁止
			this.P(cpx, Constant.SET_BAN_REG_EXCHANGED      , 'ProhibitChangeExchangedWorkTime__c'                       ); // 休日の振替勤務日の所定時間の変更を禁止
			this.P(cpx, Constant.SET_SHIFT_SYNC_REGULTER    , 'WorkTimeChangesWithShift__c'                              ); // シフトした勤務時間と所定勤務時間を連動させる
			this.P(cpx, Constant.SET_SHIFT_SYNC_START       , 'EnableRestTimeShift__c'                                   ); // シフト開始時刻に合わせて、所定休憩と半休の時間帯をずらす
			this.P(cpx, Constant.SET_NOT_USE_CORE           , 'DisableCoreTime__c'                                       ); // コア時間帯を使わない
			return cpx.lst;
		}
	});
	return ExportPattern;
});
