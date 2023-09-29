define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return new (declare("tsext.testAssist.Constant", null, {
		constructor : function(){
			this.INDEX_KEY    = 0;
			this.INDEX_SUBKEY = 1;
			this.INDEX_OPTION = 2;
			this.INDEX_ITEM1  = 3;
			this.INDEX_ITEM2  = 4;
			this.INDEX_DATE1  = 5;
			this.INDEX_DATE2  = 6;
			this.INDEX_INOUT  = 7;
			this.INDEX_RESTS  = 8;
			this.INDEX_NOTE   = 9;
			this.INDEX_ETC1   = 10;
			this.INDEX_ETC2   = 11;
			this.INDEX_ETC3   = 12;
			this.INDEX_ETC4   = 13;
			this.INDEX_ETC5   = 14;
			this.INDEX_ETC6   = 15;
			this.INDEX_ETC7   = 16;
			this.INDEX_ETC8   = 17;
			this.INDEX_ETC9   = 18;
			this.INDEX_ETC10  = 19;
			this.INDEX_ERROR  = 20;

			this.HEADERS = [
				'キー','サブキー','オプション',
				'項目1','項目2','項目3','項目4','項目5','項目6','項目7','項目8','項目9','項目10','項目11','項目12','項目13','項目14','項目15','項目16',
				'エラー期待値','エラー'
			];

			this.HEAD_KEY = 'キー';

			this.YMD1 = 'YYYY-MM-DD';
			this.YMD2 = 'YYYY/MM/DD';
			this.YMDHMS1 = 'YYYY-MM-DD HH:mm:ss';
			this.YMDHMS2 = 'YYYY/MM/DD HH:mm:ss';

			// Key
			this.KEY_ENTRY			= '入力';
			this.KEY_SETTING		= '設定';
			this.KEY_LOAD			= '読込';
			this.KEY_TEST			= '検査';
			this.KEY_COMMENT		= '説明';

			// Key=入力の場合のSubKey
			this.KEY_SHEET			= '勤務表';
			this.KEY_ACCESS_LOG		= '入退館ログ';
			// Key=設定の場合のSubKey
			this.KEY_EMPTYPE		= '勤務体系';
			this.KEY_CONFIG			= '勤怠設定';
			this.KEY_EMP			= '社員';
			this.KEY_HOLIDAY		= '休暇';
			this.KEY_PATTERN		= '勤務パターン';
			this.KEY_CALENDAR		= 'カレンダー';
			this.KEY_LEAVE_GRANT	= '休暇付与';
			this.KEY_LEAVE_REMOVE	= '休暇剥奪';
			this.KEY_EMP_CET		= '勤務体系変更';
			this.KEY_COMMON			= '共通';
			this.KEY_WORK_LOCATION	= '勤務場所';
			// Option
			this.OPTION_NEW			= '新規';
			this.OPTION_END			= '終了';
			this.OPTION_DELETE		= '削除';
			this.OPTION_REV			= '改定';
			this.OPTION_CHANGE		= '変更';
			this.OPTION_TEST		= '検査';
			this.OPTION_PAUSE		= '一時停止';
			this.OPTION_APPROVE		= '承認';
			this.OPTION_REJECT		= '却下';
			this.OPTION_REFLECT		= '反映';

			// Item1
			this.ITEM1_INOUT		= '打刻';
			this.ITEM1_APPLY		= '申請';

			this.ITEM1_LEAVE		= '休暇申請';
			this.ITEM1_HOLIDAY_WORK	= '休日出勤申請';
			this.ITEM1_PATTERN		= '勤務時間変更申請';
			this.ITEM1_PATTERNL		= '長期時間変更申請';
			this.ITEM1_EXCHANGE		= '振替申請';
			this.ITEM1_ZANGYO		= '残業申請';
			this.ITEM1_MONTHLY_ZANGYO = '月次残業申請';
			this.ITEM1_EARLYSTART	= '早朝勤務申請';
			this.ITEM1_LATESTART	= '遅刻申請';
			this.ITEM1_EARLYEND		= '早退申請';
			this.ITEM1_REVISE_TIME	= '勤怠時刻修正申請';
			this.ITEM1_DIRECT		= '直行・直帰申請';
			this.ITEM1_SHIFTCHANGE  = 'シフト振替申請';
			this.ITEM1_DAILY_FIX	= '日次確定';
			this.ITEM1_MONTHLY_FIX	= '月次確定';
			this.ITEM1_SHIFT		= 'シフト設定';
			this.ITEM1_SHIFT_REMOVE	= 'シフト削除';
			// Item2
			this.ITEM2_CANCEL		= '取消';
			this.ITEM2_APPROVE		= '承認';
			this.ITEM2_REJECT		= '却下';

			this.STATUS_WAIT		= '承認待ち';

			this.LOG_STARTING		= '開始（${0}）';
			this.LOG_FINISHED		= '終了';
			this.LOG_OK				= 'OK';
			this.LOG_ERROR			= 'エラー';
			this.LOG_NOTHING		= '入力なし!';

			this.ERROR_LEVEL_1		= 1;
			this.ERROR_LEVEL_2		= 2;

			this.BIT_C_INPUT		= 0x1;
			this.BIT_C_START		= 0x2;
			this.BIT_C_PAUSE		= 0x4;
			this.BIT_C_LOG			= 0x8;
			this.BIT_C_OPTION		= 0x10;

			this.OPE_WAITING		= 'Waiting';
			this.OPE_PAUSE			= 'Pause';
			this.OPE_SKIP			= 'Skip';
			this.OPE_DONE			= 'Done';
			this.OPE_DOING			= 'Doing';

			this.ERROR_SYSTEM              = 'System Error';
			this.ERROR_DATE_OUT_OF_RANGE   = '日付範囲外（今開いている勤務表の月内のみ）';
			this.ERROR_MONTH_UNMATCH       = '月度不一致（今開いている勤務表の月度のみ）';
			this.ERROR_EMPTY_DATE          = '日付未入力';
			this.ERROR_EMPTY_MONTH         = '月度未入力';
			this.ERROR_EMPTY_HOLIDAY       = '休暇名未入力';
			this.ERROR_EMPTY_REQUIRED      = '必須項目が未入力';
			this.ERROR_EMPTY               = '${0}が未入力';
			this.ERROR_EMPTY_OR_INVALID    = '${0}が未入力または無効';
			this.ERROR_INVALID             = '${0}が無効';
			this.ERROR_INVALID_FORMAT      = '${0}の書式が無効';
			this.ERROR_INVALID_VALUE       = '無効な値';
			this.ERROR_UNDEFINED           = '未定義';
			this.ERROR_NOTFOUND            = '該当なし';
			this.ERROR_FIXED_MONTH         = '月次確定済みのため入力不可';
			this.ERROR_FIXED_DAY           = '日次確定済みのため入力不可';
			this.ERROR_NOT_WORKDAY         = '非出勤日のため入力不可';
			this.ERROR_NO_INPUTTABLE       = '入力不可';
			this.ERROR_NOT_HOLIDAY         = '休日でない';
			this.ERROR_NOT_EXCHANGE        = '振替不可';
			this.ERROR_INVALID_LINE        = '無効行';
			this.ERROR_INVALID_DATES       = '開始日付＞終了日付';
			this.ERROR_INVALID_TIMES       = '開始時刻≧終了時刻';
			this.ERROR_INVALID_MONTH       = '月度不正';
			this.ERROR_NAME_DUPLICATE      = '名称重複';
			this.ERROR_NAME_DUPLICATE2     = '既存の${0}と名称が重複します';
			this.ERROR_APPLY_DUPLICATE     = '申請重複';
			this.ERROR_INVALID_CHANGE_DATE = '切替日不正';
			this.ERROR_INVALID_REV_MONTH   = '改定月度が無効';
			this.ERROR_INVALID_LATE_TIME   = '遅刻時刻が無効';
			this.ERROR_INVALID_EARLY_TIME  = '早退時刻が無効';

			this.APPLY_TYPE_LEAVE          = '休暇申請';
			this.APPLY_TYPE_HOLIDAY_WORK   = '休日出勤申請';
			this.APPLY_TYPE_PATTERNS       = '勤務時間変更申請';
			this.APPLY_TYPE_PATTERNL       = '長期時間変更申請';
			this.APPLY_TYPE_ZANGYO         = '残業申請';
			this.APPLY_TYPE_EARLY_WORK     = '早朝勤務申請';
			this.APPLY_TYPE_EXCHANGE       = '振替申請';
			this.APPLY_TYPE_LATESTART      = '遅刻申請';
			this.APPLY_TYPE_EARLYEND       = '早退申請';
			this.APPLY_TYPE_REVISE_TIME    = '勤怠時刻修正申請';
			this.APPLY_TYPE_DIRECT         = '直行・直帰申請';
			this.APPLY_TYPE_DAILY_FIX      = '日次確定';
			this.APPLY_TYPE_MONTHLY_FIX    = '勤務確定';
			this.APPLY_TYPE_SHIFTCHANGE    = 'シフト振替申請';
			this.APPLY_TYPE_MONTHLY_ZANGYO = '月次残業申請';

			this.YUQ_NAME = '年次有給休暇';

			this.APPLY_INPUT_ORDER = [
				this.APPLY_TYPE_EXCHANGE,
				this.APPLY_TYPE_HOLIDAY_WORK,
				this.APPLY_TYPE_LEAVE,
				this.APPLY_TYPE_PATTERNL,
				this.APPLY_TYPE_PATTERNS,
				this.APPLY_TYPE_ZANGYO,
				this.APPLY_TYPE_EARLY_WORK,
				this.APPLY_TYPE_LATESTART,
				this.APPLY_TYPE_EARLYEND,
				this.APPLY_TYPE_REVISE_TIME,
				this.APPLY_TYPE_DAILY_FIX,
				this.APPLY_TYPE_MONTHLY_FIX
			];

			// 勤務体系
			this.SET_EMPTYPE_NAME          = {name:'名称',alias:['勤務体系名']};
			this.SET_EMPTYPE_CODE          = {name:'コード',alias:['勤務体系コード']};
			this.SET_START_MONTH           = {name:'起算月'};
			this.SET_START_DATE            = {name:'起算日'};
			this.SET_START_DAYOFWEEK       = {name:'週の起算日',alias:['起算曜日']};
			this.SET_YEAR_NOTATION         = {name:'年度の表記'};
			this.SET_MONTH_NOTATION        = {name:'月度の表記'};
			this.SET_EMPTYPE_HOLIDAY       = {name:'休暇'};
			this.SET_EMPTYPE_PATTERN       = {name:'勤務パターン',alias:['パターン']};
			this.SET_EMPTYPE_GRANTDAYS     = {name:'付与日数',alias:['有休付与日数']};
			this.SET_WORKSYSTM             = {name:'労働時間制'};
			this.SET_PERIOD                = {name:'変形期間',alias:['清算期間']};
			this.SET_WEEKLY_HOLIDAY        = {name:'休日'};
			this.SET_PUBLIC_HOLIDAY        = {name:'祝日は休日ではない'};
			this.SET_AUTO_LEGAL_HOLIDAY    = {name:'法定休日の自動判定'};
			this.SET_START_END_WORK_TIME   = {name:'始業終業',sw:true};
			this.SET_REGULAR_WORK_TIME     = {name:'所定労働時間'};
			this.SET_BREAK_TIME            = {name:'休憩時間'};
			this.SET_USE_HALF_HOLIDAY      = {name:'半日休暇取得可'};
			this.SET_HALF_AM_TIME          = {name:'午前半休適用時間'};
			this.SET_HALF_PM_TIME          = {name:'午後半休適用時間'};
			this.SET_USE_HALF_BREAK_TIME   = {name:'半休取得時の休憩時間'};
			this.SET_AM_HOLIDAY_BREAK      = {name:'午前半休時休憩時間'};
			this.SET_PM_HOLIDAY_BREAK      = {name:'午後半休時休憩時間'};
			// 詳細設定
			this.SET_WEEKLY_LEGAL_TIME     = {name:'週の法定労働時間'};
			this.SET_BASE_TIME             = {name:'時間単位休の基準時間(年次有給休暇用)',alias:['年次有給休暇基準時間']};
			this.SET_BASE_TIME_FOR_STOCK   = {name:'時間単位休の基準時間(日数管理休暇用)',alias:['日数管理休暇基準時間']};
			this.SET_IGNORE_NIGHT_CHARGE   = {name:'深夜労働割増'};
			this.SET_DAIQ_IS_WORK_TIME     = {name:'代休は勤務時間とみなす'};
			this.SET_OFFSET_OVER_DEDUCT    = {name:'残業と控除の相殺',sw:true};
			this.SET_HIGHLIGHT_LATE_EARLY  = {name:'遅刻・早退を強調表示'};
			this.SET_INPUT_AFTER_APPROVED  = {name:'承認されるまで入力禁止'};
			this.SET_BAN_BORDER_REST       = {name:'出退社時刻を含む休憩不可'};
			this.SET_DISCRETIONARY         = {name:'裁量労働'};
			this.SET_WORK_ACROSS_NEXTDAY   = {name:'翌日にまたがる勤務時間の取扱い'};
			this.SET_INPUT_OVER_24         = {name:'24:00以降の入力'};
			this.SET_REST_TIME_CHECK       = {name:'法定休憩時間のチェック'};
			this.SET_PERMIT_UPDATE_LEVEL   = {name:'勤務時間を修正できる社員'};
			this.SET_TIME_ROUND            = {name:'時刻の丸め'};
			this.SET_TIME_ROUND_BEGIN      = {name:'出社時刻の端数処理'};
			this.SET_TIME_ROUND_END        = {name:'退社時刻の端数処理'};
			this.SET_TIME_FORMAT           = {name:'時刻表示形式'};
			this.SET_MAN_HOURS_TIMESHEET   = {name:'勤務表で工数入力'};
			// 申請関連設定
			this.SET_USE_APPROVAL_PROCESS  = {name:'承認ワークフロー'};
			this.SET_USE_APPROVER_SETTING  = {name:'承認者設定'};
			this.SET_APPLY_HOLIDAY_WORK    = {name:'休日出勤申請'};
			this.SET_HOLIDAY_WORK_BREAK    = {name:'休日出勤申請で休憩時間の変更を許可'};
			this.SET_APPLY_EXCHANGE        = {name:'振替申請'};
			this.SET_EXCHANGE_ON_LIMIT     = {name:'振替申請で振替勤務日を選択できる期間'};
			this.SET_EXCHANGE_OFF_LIMIT    = {name:'振替申請で振替休日を選択できる期間'};
			this.SET_EXCHANGE_BAN_ALL_ON   = {name:'週内の法定休日がなくなる振替を禁止'};
			this.SET_APPLY_SHIFTCHANGE     = {name:'S:シフト振替申請'};
			this.SET_APPLY_PATTERNS        = {name:'勤務時間変更申請'};
			this.SET_SELF_SHIFT            = {name:'勤務時間変更申請でシフト可',sw:true};
			this.SET_SELF_DAYTYPE          = {name:'勤務時間変更申請で平日・休日変更を許可'};
			this.SET_SELF_LEGAL_HOLIDAY    = {name:'勤務時間変更申請で法定休日を指定可'};
			this.SET_PROHIBIT_WS_CHANGE    = {name:'勤務時間変更申請で勤務パターンの指定不可'};
			this.SET_APPLY_OVER_WORK       = {name:'残業申請'};
			this.SET_MUST_OVER_APPLY       = {name:'残業申請必須境界'};
			this.SET_BULK_OVER_APPLY       = {name:'残業申請を期間で申請可'};
			this.SET_OVER_APPLY_INIT_FLEX  = {name:'残業申請の初期値をフレックス時間に合わせる'};
			this.SET_APPLY_MONTHLY_OVER    = {name:'月次残業申請'};
			this.SET_MONTHLY_OVER_MUST     = {name:'月次残業申請必須'};
			this.SET_MONTHLY_OVER_BORDER   = {name:'月次残業申請必須境界'};
			this.SET_MONTHLY_OVER_DUPL     = {name:'月次残業申請複数申請可'};
			this.SET_APPLY_EARLY_WORK      = {name:'早朝勤務申請'};
			this.SET_MUST_EARLY_APPLY      = {name:'早朝勤務申請必須境界'};
			this.SET_BULK_EARLY_APPLY      = {name:'早朝勤務申請を期間で申請可'};
			this.SET_EARLY_WORK_INIT_FLEX  = {name:'早朝勤務申請の初期値をフレックス時間に合わせる'};
			this.SET_APPLY_LATESTART       = {name:'遅刻申請'};
			this.SET_MUST_LATESTART        = {name:'遅刻申請必須'};
			this.SET_APPLY_EARLYEND        = {name:'早退申請'};
			this.SET_MUST_EARLYEND         = {name:'早退申請必須'};
			this.SET_APPLY_DIRECT          = {name:'直行・直帰申請'};
			this.SET_APPLY_REVISE_TIME     = {name:'勤怠時刻修正申請'};
			this.SET_DIRECT_WORKTYPES      = {name:'直行・直帰申請作業区分'};
			this.SET_APPLY_DAILY_FIX       = {name:'日次確定'};
			this.SET_DAILY_FIX_BUTTON      = {name:'日次確定ボタンを表示'};
			this.SET_DAILY_FIX_APPROVER    = {name:'日次確定申請の承認者'};
			this.SET_DAILY_FIX_CHECK       = {name:'日次確定申請漏れのチェック'};
			this.SET_CHECK_TIME_DAILY      = {name:'日次確定時に工数入力時間をチェック'};
			this.SET_CHECK_TIME_MONTHLY    = {name:'月次確定時に工数入力時間をチェック'};
			this.SET_CHECK_EMPTY           = {name:'勤怠入力必須'};
			// フレックスタイム設定
			this.SET_FLEX_TIME             = {name:'フレックス時間'};
			this.SET_USE_CORE_TIME         = {name:'コア時間を設定する'};
			this.SET_CORE_TIME             = {name:'コア時間'};
			this.SET_SHOW_CORE_TIME        = {name:'コア時間を表示する'};
			this.SET_FLEX_MONTHLY_TIME     = {name:'月の所定労働時間'};
			this.SET_ADJUST_LEGAL_TIME     = {name:'法定労働時間調整'};
			// 入退館管理
			this.SET_USE_ACCESS_CONTROL    = {name:'入退館管理',sw:true};
			this.SET_PERMIT_DIVERGENCE     = {name:'乖離許容時間',sw:true};
			this.SET_WEEKDAY_ACCESS_BASE   = {name:'入退館基準時間(平日)'};
			this.SET_HOLIDAY_ACCESS_BASE   = {name:'入退館基準時間(休日)'};
			this.SET_DAYFIX_PRE_DIVERGE    = {name:'乖離判定前の日次確定許可'};
			this.SET_MONTHFIX_ON_DIVERGE   = {name:'乖離発生時の月次確定許可'};
			this.SET_MS_ACCESS_INFO        = {name:'月次サマリーに入退館情報を表示'};
			// 積立休暇の設定
			this.SET_STOCK_HOLIDAY_ENABLE  = {name:'積立休暇設定'};
			this.SET_STOCK_HOLIDAY_TARGET  = {name:'積立休暇の選択'};
			this.SET_STOCK_MAX_DAYS_YEAR   = {name:'一回の積立日数'};
			this.SET_STOCK_MAX_DAYS        = {name:'最大積立日数'};
			// 代休管理
			this.SET_USE_DAIQ_MANAGE       = {name:'代休管理',sw:true};
			this.SET_USE_HALF_DAIQ         = {name:'半日代休'};
			this.SET_DAIQ_ALL_BORDER       = {name:'終日代休可',sw:true};
			this.SET_DAIQ_HALF_BORDER      = {name:'半日代休可',sw:true};
			this.SET_DAIQ_LIMIT            = {name:'代休の有効期間'};
			this.SET_DAIQ_RESERVE          = {name:'申請時に代休有無を指定',sw:true};
			this.SET_DAIQ_LEGAL_HOLIDAY    = {name:'法定休日出勤の代休可'};
			this.SET_REGULATE_HOLIDAY      = {name:'休日出勤の勤怠規則は平日に準拠'};
			this.SET_NO_DAIQ_EXCHANGED     = {name:'振替休日に出勤した場合は代休不可'};
			// 残業警告の設定
			this.SET_OVERTIME_MONTH_MAX    = {name:'月間残業時間上限'};
			this.SET_OVERTIME_MONTH_WARN1  = {name:'月間残業時間警告1'};
			this.SET_OVERTIME_MONTH_WARN2  = {name:'月間残業時間警告2'};
			this.SET_OVERTIME_MONTH_WARN3  = {name:'月間残業時間警告3'};
			this.SET_OVERTIME_QTR_MAX      = {name:'4半期残業時間上限'};
			this.SET_OVERTIME_QTR_WARN1    = {name:'4半期残業時間警告1'};
			this.SET_OVERTIME_QTR_WARN2    = {name:'4半期残業時間警告2'};
			this.SET_OVERTIME_YEAR_MAX     = {name:'年間残業時間上限'};
			this.SET_OVERTIME_YEAR_WARN1   = {name:'年間残業時間警告1'};
			this.SET_OVERTIME_YEAR_WARN2   = {name:'年間残業時間警告2'};
			this.SET_OVERTIME_COUNT_MAX    = {name:'残業超過回数上限'};
			this.SET_OVERTIME_COUNT_WARN1  = {name:'残業超過回数警告1'};
			// 36協定上限設定
			this.SET_OVERTIME_MONTH_LIMIT  = {name:'月間時間外勤務限度時間'                  };
			this.SET_OVERTIME_YEAR_LIMIT   = {name:'年間時間外勤務限度時間'                  };
			this.SET_OVERTIME_LHMONTH_LIMIT= {name:'月間時間外勤務(法定休日含む)限度時間'    };
			this.SET_OVERTIME_SPYEAR_LIMIT = {name:'特別条項・年間時間外勤務限度時間'        };
			this.SET_OVERTIME_SPCOUNT_LIMIT= {name:'特別条項・月間時間外勤務限度超過限度回数'};
			// テレワーク勤務
			this.SET_USE_WORK_LOCATION     = {name:'テレワーク勤務可'                      };
			this.SET_REQUIRE_WORK_LOCATION = {name:'勤務場所入力必須'                      };
			// 有休自動付与
			this.SET_LEAVE_PROVIDE_AUTO    = {name:'有休自動付与'};
			this.SET_LEAVE_PROVIDE_DATE    = {name:'指定日'};
			this.SET_WORKING_DAYS_BORDER   = {name:'継続勤務日数の範囲条件'};
			this.SET_LEAVE_PROVIDE_NOTICE  = {name:'付与のお知らせ'};
			// 勤務パターン
			this.SET_PATTERN_NAME          = {name:'名称',alias:['パターン名','勤務パターン名']};
			this.SET_PATTERN_RANGE         = {name:'対象期間'};
			this.SET_BAN_REG_NORMAL        = {name:'平日勤務の所定時間の変更を禁止',sw:true};
			this.SET_BAN_REG_HOLIDAY       = {name:'休日出勤の所定時間の変更を禁止',sw:true};
			this.SET_BAN_REG_EXCHANGED     = {name:'休日の振替勤務日の所定時間の変更を禁止',sw:true};
			this.SET_SHIFT_SYNC_REGULTER   = {name:'シフト時刻と所定勤務時間を連動させる'};
			this.SET_SHIFT_SYNC_START      = {name:'シフト始業時刻と所定休・半休を連動させる'};
			this.SET_NOT_USE_CORE          = {name:'コア時間帯を使わない'};
			// 休暇
			this.SET_HOLIDAY_NAME          = {name:'名称',alias:['休暇名']};
			this.SET_TYPE                  = {name:'種類'};
			this.SET_RANGE                 = {name:'範囲'};
			this.SET_ALL_HOLIDAY           = {name:'終日休',alias:['全休']};
			this.SET_AM_HOLIDAY            = {name:'午前休',alias:['午前半休']};
			this.SET_PM_HOLIDAY            = {name:'午後休',alias:['午後半休']};
			this.SET_TIME_HOLIDAY          = {name:'時間休',alias:['時間単位休']};
			this.SET_YUQ_SPEND             = {name:'有休消化'};
			this.SET_IS_WORKING            = {name:'出勤率判定'};
			this.SET_DISP_ON_CALENDAR      = {name:'暦日表示'};
			this.SET_HOLIDAY_TIME_UNIT     = {name:'休暇時間制限単位'};
			this.SET_MANAGED               = {name:'日数管理',sw:true};
			this.SET_MANAGE_NAME           = {name:'管理名'};
			this.SET_SYMBOL                = {name:'略称'};
			this.SET_SUMMARY_CODE          = {name:'集計コード'};
			this.SET_SUMMARY_ROOT          = {name:'大分類に設定'};
			this.SET_SUMMARY_NAME          = {name:'大分類名'};
			this.SET_LINK_NUMBER           = {name:'連携時の休暇番号'};
			this.SET_DESCRIPTION           = {name:'説明'};
			this.SET_PLANNED_HOLIDAY       = {name:'計画付与'};
			this.SET_REMOVED               = {name:'無効'};
			// 勤務場所
			this.SET_WORK_LOCATION_NAME    = {name:'名称',alias:['勤務場所名']};
			this.SET_COUNT_TARGET          = {name:'カウント対象'};
			this.SET_CT_OFFICE             = {name:'出社'};
			this.SET_CT_HOME               = {name:'テレワーク'};
			this.SET_CT_OFFICE_HOME        = {name:'出社・テレワーク'};
			this.SET_CT_OUT_OF_SCOPE       = {name:'対象外'};
			this.SET_REMOVED               = {name:'無効'};
			this.SET_WORK_LOCATION_CODE    = {name:'勤務場所コード'};
			// 社員
			this.SET_EMP_NAME              = {name:'名称',alias:['社員名','名前']};
			this.SET_EMP_CODE              = {name:'コード',alias:['社員コード']};
			this.SET_ENTRY_DATE            = {name:'入社日'};
			this.SET_END_DATE              = {name:'退社日'};
			this.SET_NEXT_PROVIDE_DATE     = {name:'次回有休付与日'};
			this.SET_TS_ADMIN              = {name:'管理機能の使用'};
			this.SET_TS_ALL_EDIT           = {name:'全社員のデータ編集'};
			this.SET_TS_ALL_READ           = {name:'全社員のデータ参照'};
			this.SET_TS_EXP_ADMIN          = {name:'経費管理機能の使用'};
			this.SET_TS_JOB_ADMIN          = {name:'ジョブ管理機能の使用'};
			this.SET_EMPTYPE_NAME          = {name:'勤務体系',sw:true};
			this.SET_DEPT_NAME             = {name:'部署',sw:true};
			this.SET_MANAGER               = {name:'上長'};
			this.SET_USER                  = {name:'ユーザ'};
			this.SET_ACCESS_CONTROL        = {name:'入退館管理',sw:true};
			// 共通設定
			this.SET_REQUIRE_NOTE          = {name:'申請時の備考入力を必須にする'};
			this.SET_DISABLED_TIMEREPORT   = {name:'タイムレポートを使用不可にする'};
			this.SET_DISABLED_EMPEXP       = {name:'経費精算を使用不可にする'};
			this.SET_DISABLED_EMPJOB       = {name:'工数実績を使用不可にする'};
			this.SET_USE_DATA_STORAGE      = {name:'データ保管機能を使用する'};
			this.SET_DATA_OUTPUT_OPTION    = {name:'データ出力オプションを追加する'};
			this.SET_NAMING_RULE           = {name:'承認申請のタイトルと内容を日本語と英語の併記にする'};
			this.SET_COMMENT_IF_ABSENCE    = {name:'控除のある日は備考必須にする'};
			this.SET_COMMENT_IF_NOPUSHTIME = {name:'打刻なしは備考必須にする'};
			this.SET_CANCEL_MONTH_APPLY    = {name:'本人が勤務確定承認取消可能'};
			this.SET_CANCEL_DAY_APPLY      = {name:'本人が勤怠申請承認取消可能'};
			this.SET_INDICATE_NO_PUSHTIME  = {name:'打刻なしを表示する'};
			this.SET_MAIL_EMPAPPLY_CANCELED= {name:'勤怠申請の取消をメールする'};
			this.SET_USE_FIXED_BUTTON      = {name:'定時打刻ボタンの使用'};
			this.SET_USE_RESTARTABLE       = {name:'退社後の再出社打刻可能'};
			this.SET_FLEX_GRAPH            = {name:'フレックスで日ごとの残業を表示する'};
			this.SET_DISCRETIONARY_OPTION  = {name:'裁量労働／管理監督者で実労働時間を表示する'};
			this.SET_KEEP_EXTERIOR_TIME    = {name:'勤務時間外の休憩・公用外出を記録する'};
			this.SET_TREAT_LATE_START      = {name:'遅刻取扱い'};
			this.SET_TREAT_EARLY_END       = {name:'早退取扱い'};
			this.SET_CHECK_DEFAULT_DAILYFIX= {name:'退社打刻時の日次確定のデフォルトをオンにする'};
			this.SET_MS_WORKTIME_IS_REAL   = {name:'月次サマリーの日次の労働時間に実時間を表示'};
			this.SET_NOT_INFO_AUTO_VIEW    = {name:'お知らせの自動表示をしない'};
			this.SET_DISABLE_KINTAI_FEED   = {name:'出社・退社時のChatterフィードを行わない'};
			this.SET_HANDLE_INVALID_APPLY  = {name:'取消または却下された申請の扱い'};
			this.SET_CLARIFY_AFTER_APPLY   = {name:'事前申請と事後申請を区別する'};
			this.SET_PERMIT_LEAVING_PUSH24 = {name:'退社打刻は出社時刻から24時間後までとする'};
			this.SET_PERMIT_START_DAYCHANGE= {name:'退社時刻未入力でも日付が変われば出社打刻可'};
			this.SET_HIDE_MONTHLY_SUMMARY  = {name:'勤務表の月次サマリーボタンを非表示にする'};
			this.SET_HIDE_BOTTOM_SUMMARY   = {name:'勤務表の下部の集計値エリアを非表示にする'};
			this.SET_HIDE_TIME_GRAPH_POPUP = {name:'勤怠グラフのポップアップを非表示にする'};
			this.SET_SEPARATE_DAILY_NOTE   = {name:'申請の備考と日次の備考を保存時に結合しない'};
			this.SET_PROHIBIT_ACROSS_MONTH = {name:'申請期間が月度をまたぐ申請を禁止する'};
			this.SET_LIMITED_TIME_DISTANCE = {name:'出社時刻から退社時刻の制限'};
			this.SET_DISABLE_CHATTER_PUSH  = {name:'Chatter打刻を利用しない'};
			this.SET_PAID_RESTTIME_LIMIT   = {name:'時間単位有休の年間取得限度時間'};
			this.SET_PAID_REST_LIMIT_SYNC  = {name:'時間単位有休の起算日は、年次有給休暇の有効開始日を起算日とする'};
			this.SET_VALIDATE_MONTHLYFIX   = {name:'月次確定時に勤務表を再チェックする'};
			this.SET_TS1_OPTIMIZE_OPTION   = {name:'TeamSpirit1上で利用する勤務表の表示タイプ'};
			this.SET_FLEXIBLE_HALFDAY_TIME = {name:'コア時間なしフレックスの半日休暇適用時間を使用しない'};
			this.SET_USE_ACCESS_CONTROL    = {name:'入退館管理機能'};
			this.SET_LAST_ACCESS_LOG_TIME  = {name:'最終入退館管理ログ連携時刻'};
			this.SET_DEFAULT_WORK_LOCATION = {name:'デフォルトの勤務場所'};

			this.INSPECT_NORMAL            = 1;
			this.INSPECT_REMAIN_DAYS       = 2;
		}
	}))();
});
