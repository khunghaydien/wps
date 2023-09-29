define([
	"dojo/_base/declare",
	"tsext/testAssist/EntryInOut",
	"tsext/testAssist/EntryAccessLog",
	"tsext/testAssist/EntryApplyLeave",
	"tsext/testAssist/EntryApplyPattern",
	"tsext/testAssist/EntryApplyHolidayWork",
	"tsext/testAssist/EntryApplyExchange",
	"tsext/testAssist/EntryApplyZangyo",
	"tsext/testAssist/EntryApplyMonthlyZangyo",
	"tsext/testAssist/EntryApplyEarlyStart",
	"tsext/testAssist/EntryApplyReviseTime",
	"tsext/testAssist/EntryApplyLateStart",
	"tsext/testAssist/EntryApplyEarlyEnd",
	"tsext/testAssist/EntryApplyDirect",
	"tsext/testAssist/EntryApplyDailyFix",
	"tsext/testAssist/EntryApplyShiftChange",
	"tsext/testAssist/EntryApplyMonth",
	"tsext/testAssist/EntryApplyCommon",
	"tsext/testAssist/EntryShift",
	"tsext/testAssist/LoadEmpMonth",
	"tsext/testAssist/InspectValue",
	"tsext/testAssist/Information",
	"tsext/testAssist/Setting",
	"tsext/testAssist/SettingHoliday",
	"tsext/testAssist/SettingPattern",
	"tsext/testAssist/SettingWorkLocation",
	"tsext/testAssist/SettingEmpType",
	"tsext/testAssist/SettingConfig",
	"tsext/testAssist/SettingCalendar",
	"tsext/testAssist/SettingEmp",
	"tsext/testAssist/SettingEmpLeave",
	"tsext/testAssist/SettingEmpCET",
	"tsext/testAssist/SettingCommon",
	"tsext/testAssist/EntryBase1",
	"tsext/testAssist/Constant",
	"tsext/util/TsError"
], function(
	declare,
	EntryInOut,
	EntryAccessLog,
	EntryApplyLeave,
	EntryApplyPattern,
	EntryApplyHolidayWork,
	EntryApplyExchange,
	EntryApplyZangyo,
	EntryApplyMonthlyZangyo,
	EntryApplyEarlyStart,
	EntryApplyReviseTime,
	EntryApplyLateStart,
	EntryApplyEarlyEnd,
	EntryApplyDirect,
	EntryApplyDailyFix,
	EntryApplyShiftChange,
	EntryApplyMonth,
	EntryApplyCommon,
	EntryShift,
	LoadEmpMonth,
	InspectValue,
	Information,
	Setting,
	SettingHoliday,
	SettingPattern,
	SettingWorkLocation,
	SettingEmpType,
	SettingConfig,
	SettingCalendar,
	SettingEmp,
	SettingEmpLeave,
	SettingEmpCET,
	SettingCommon,
	EntryBase1,
	Constant,
	TsError
){
	// 指示データクラスを生成
	return new (declare("tsext.testAssist.EntryFactory", null, {
		/**
		 * 指示データインスタンス生成
		 * @param {Array.<string>} v CSVの1行
		 * @param {number} lineNo 行番号
		 * @return {tsext.testAssist.EntryBase1}(の継承クラス)
		 */
		createEntry: function(v, lineNo){
			var entry = null;
			var key    = (v.length > Constant.INDEX_KEY    ? v[Constant.INDEX_KEY]    : null);
			var subKey = (v.length > Constant.INDEX_SUBKEY ? v[Constant.INDEX_SUBKEY] : null);
			var option = (v.length > Constant.INDEX_OPTION ? v[Constant.INDEX_OPTION] : null);
			var item1  = (v.length > Constant.INDEX_ITEM1  ? v[Constant.INDEX_ITEM1]  : null);
			if(key == Constant.KEY_SETTING){ // 設定
				if(!option){
					if(subKey == Constant.KEY_LEAVE_GRANT || subKey == Constant.KEY_LEAVE_REMOVE){
																	entry = new SettingEmpLeave(v, lineNo);			// 休暇付与
					}else if(subKey == Constant.KEY_EMP_CET){		entry = new SettingEmpCET(v, lineNo);			// 勤務体系変更
					}else{											entry = new Setting(v, lineNo);					// 設定要素
					}
				}else if(option == Constant.OPTION_NEW // 新規
				|| option == Constant.OPTION_DELETE){ // 削除
					if(subKey == Constant.KEY_EMPTYPE){				entry = new SettingEmpType(v, lineNo);			// 勤務体系
					}else if(subKey == Constant.KEY_HOLIDAY){		entry = new SettingHoliday(v, lineNo);			// 休暇
					}else if(subKey == Constant.KEY_PATTERN){		entry = new SettingPattern(v, lineNo);			// 勤務パターン
					}else if(subKey == Constant.KEY_WORK_LOCATION){	entry = new SettingWorkLocation(v, lineNo);		// 勤務場所
					}else if(subKey == Constant.KEY_EMP){			entry = new SettingEmp(v, lineNo);				// 社員
					}else if(subKey == Constant.KEY_CALENDAR){		entry = new SettingCalendar(v, lineNo);			// カレンダー
					}
				}else if(option == Constant.OPTION_REV // 改定
				|| option == Constant.OPTION_CHANGE){ // 変更
					if(subKey == Constant.KEY_CONFIG){				entry = new SettingConfig(v, lineNo);			// 勤務体系
					}else if(subKey == Constant.KEY_COMMON){		entry = new SettingCommon(v, lineNo);			// 共通
					}else if(subKey == Constant.KEY_EMP){			entry = new SettingEmp(v, lineNo);				// 社員
					}
				}
			}else if(key == Constant.KEY_LOAD && subKey == Constant.KEY_SHEET){ // 読込、勤務表
																	entry = new LoadEmpMonth(v, lineNo);			// 勤務表読込
			}else if(key == Constant.KEY_ENTRY && subKey == Constant.KEY_SHEET){ // 入力、勤務表
				if(!option || [Constant.OPTION_TEST, Constant.OPTION_APPROVE, Constant.OPTION_REFLECT].indexOf(option) >= 0){
					if(item1 == Constant.ITEM1_INOUT){				entry = new EntryInOut(v, lineNo);				// 打刻
					}else if(item1 == Constant.ITEM1_LEAVE){		entry = new EntryApplyLeave(v, lineNo);			// 休暇
					}else if(item1 == Constant.ITEM1_PATTERN){		entry = new EntryApplyPattern(v, lineNo);		// 勤務時間変更
					}else if(item1 == Constant.ITEM1_HOLIDAY_WORK){	entry = new EntryApplyHolidayWork(v, lineNo);	// 休日出勤
					}else if(item1 == Constant.ITEM1_EXCHANGE){		entry = new EntryApplyExchange(v, lineNo);		// 振替
					}else if(item1 == Constant.ITEM1_ZANGYO){		entry = new EntryApplyZangyo(v, lineNo);		// 残業
					}else if(item1 == Constant.ITEM1_MONTHLY_ZANGYO){ entry = new EntryApplyMonthlyZangyo(v, lineNo); // 月次残業
					}else if(item1 == Constant.ITEM1_EARLYSTART){	entry = new EntryApplyEarlyStart(v, lineNo);	// 早朝勤務
					}else if(item1 == Constant.ITEM1_REVISE_TIME){	entry = new EntryApplyReviseTime(v, lineNo);	// 勤怠時刻修正
					}else if(item1 == Constant.ITEM1_LATESTART){	entry = new EntryApplyLateStart(v, lineNo);		// 遅刻申請
					}else if(item1 == Constant.ITEM1_EARLYEND){		entry = new EntryApplyEarlyEnd(v, lineNo);		// 早退申請
					}else if(item1 == Constant.ITEM1_DIRECT){		entry = new EntryApplyDirect(v, lineNo);		// 直行・直帰申請
					}else if(item1 == Constant.ITEM1_SHIFTCHANGE){	entry = new EntryApplyShiftChange(v, lineNo);	// シフト振替申請
					}else if(item1 == Constant.ITEM1_DAILY_FIX){	entry = new EntryApplyDailyFix(v, lineNo);		// 日次確定
					}else if(item1 == Constant.ITEM1_MONTHLY_FIX){	entry = new EntryApplyMonth(v, lineNo);			// 月次確定
					}else if(item1 == Constant.ITEM1_APPLY){		entry = new EntryApplyCommon(v, lineNo);		// 申請
					}else if(item1 == Constant.ITEM1_SHIFT || item1 == Constant.ITEM1_SHIFT_REMOVE){
																	entry = new EntryShift(v, lineNo);				// シフト設定
					}
				}
			}else if(key == Constant.KEY_ENTRY && subKey == Constant.KEY_ACCESS_LOG){ // 入力、入退館ログ
																	entry = new EntryAccessLog(v, lineNo);			// 入退館ログ
			}else if(key == Constant.KEY_TEST && subKey == Constant.KEY_SHEET){ // 検査、勤務表
																	entry = new InspectValue(v, lineNo);			// 検査
			}else if(key == Constant.KEY_COMMENT){ // 説明
																	entry = new Information(v, lineNo);				// 説明
			}
			if(!entry){
				entry = new EntryBase1(v, lineNo);
				if(!entry.isEmpty() && option != Constant.OPTION_END && key != Constant.HEAD_KEY){
					entry.addError(Constant.ERROR_LEVEL_1, Constant.ERROR_INVALID_LINE);
				}
			}
			return entry;
		}
	}))();
});
