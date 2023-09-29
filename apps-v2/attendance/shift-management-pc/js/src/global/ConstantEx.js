/**
 * 定数クラス
 *
 * @author DCI小島
 */
teasp.constant = teasp.util.extend(teasp.constant, {
    STATUS_REJECTS             : ['却下'    , '却下済み'],
    STATUS_CANCELS             : ['申請取消', '確定取消'],
    STATUS_NOTADMITS           : ['未確定'  , '未承認'  ],
    STATUS_APPROVES            : ['承認済み', '確定済み'],
    STATUS_FIX                 : ['承認済み', '確定済み', '承認待ち', '承認中', '精算済み'],
    STATUS_NEGATIVE            : ['却下'    , '却下済み', '申請取消', '確定取消'],
    STATUS_EDITABLE            : ['未確定','未申請','確定取消','申請取消','却下'],
    STATUS_ALL                 : ['未確定','未申請','確定取消','申請取消','却下','却下済み','承認待ち','確定済み','承認済み','精算済み'],

    APPROVER_TYPE_MONTH        : '勤怠月次確定',
    APPROVER_TYPE_MONTHLY      : '勤怠月次申請',
    APPROVER_TYPE_DAILY        : '勤怠日次申請',
    APPROVER_TYPE_DAILYFIX     : '勤怠日次確定',
    APPROVER_TYPE_JOB          : '工数月次確定',
    APPROVER_TYPE_EXP          : '経費申請',

    P_E                        : 1,             // 編集権限あり
    P_ME                       : (1<<1) + 1,    // 対象社員＝自身
    P_MA                       : (1<<2) + 1,    // 対象社員の上長
    P_DM                       : (1<<3) + 1,    // 対象社員の部署の管理者
    P_D1                       : (1<<4) + 1,    // 対象社員の部署の補助管理者１
    P_D2                       : (1<<5) + 1,    // 対象社員の部署の補助管理者２
    P_SS                       : (1<<6) + 1,    // システム管理者
    P_AD                       : (1<<7) + 1,    // 管理機能の使用
    P_AE                       : (1<<8) + 1,    // 全社員のデータ編集
    P_AR                       : (1<<9),        // 全社員のデータ参照
    P_AX                       : (1<<10),       // 経費管理機能の使用
//    P_JL                       : (1<<11),       // ジョブリーダー
    P_AJ                       : (1<<11),       // ジョブ管理機能の使用
    P_JL                       : (1<<12),       // ジョブリーダー
    P_AP                       : (1<<13),       // 部署管理機能の使用

    TARGET_EXP                 : 1,

    DAY_TYPE_NORMAL            : 0, // 平日
    DAY_TYPE_NORMAL_HOLIDAY    : 1, // 所定休日
    DAY_TYPE_LEGAL_HOLIDAY     : 2, // 法定休日
    DAY_TYPE_PUBLIC_HOLIDAY    : 3, // 祝日
    DAY_TYPE_PLANNED_HOLIDAY   : 4, // 有休計画付与日

    NORMAL_HOLIDAY_COLOR       : '#DEEFFF',   // 水色
    LEGAL_HOLIDAY_COLOR        : '#EFCFBD',   // うすい赤
    PRIVATE_HOLIDAY_COLOR      : '#FFCFA5',   // オレンジ

    APPLY_TYPE_HOLIDAY         : '休暇申請',
    APPLY_TYPE_EXCHANGE        : '振替申請',
    APPLY_TYPE_ZANGYO          : '残業申請',
    APPLY_TYPE_EARLYSTART      : '早朝勤務申請',
    APPLY_TYPE_KYUSHTU         : '休日出勤申請',
    APPLY_TYPE_PATTERNS        : '勤務時間変更申請',
    APPLY_TYPE_PATTERNL        : '長期時間変更申請',
    APPLY_TYPE_LATESTART       : '遅刻申請',
    APPLY_TYPE_EARLYEND        : '早退申請',
    APPLY_TYPE_MONTHLY         : '勤務確定',
    APPLY_TYPE_DAILY           : '日次確定',
    APPLY_TYPE_REVISETIME      : '勤怠時刻修正申請',
    APPLY_TYPE_DIRECT          : '直行・直帰申請',
    APPLY_TYPE_SHIFTCHANGE     : 'シフト振替申請',
    APPLY_TYPE_MONTHLYOVERTIME : '月次残業申請',

    APPLY_KEY_HOLIDAY         : 'holiday',
    APPLY_KEY_EXCHANGES       : 'exchangeS',
    APPLY_KEY_EXCHANGEE       : 'exchangeE',
    APPLY_KEY_ZANGYO          : 'zangyo',
    APPLY_KEY_EARLYSTART      : 'earlyStart',
    APPLY_KEY_KYUSHTU         : 'kyushtu',
    APPLY_KEY_PATTERNS        : 'patternS',
    APPLY_KEY_PATTERNL        : 'patternL',
    APPLY_KEY_PATTERND        : 'patternD',
    APPLY_KEY_LATESTART       : 'lateStart',
    APPLY_KEY_EARLYEND        : 'earlyEnd',
    APPLY_KEY_MONTHLY         : 'monthly',
    APPLY_KEY_DAILY           : 'dailyFix',
    APPLY_KEY_EXPAPPLY        : 'expApply',
    APPLY_KEY_JOBAPPLY        : 'jobApply',
    APPLY_KEY_REVISETIME      : 'reviseTime',
    APPLY_KEY_SHIFT           : 'shiftSet',
    APPLY_KEY_SHIFTCHANGE     : 'shiftChange',
    APPLY_KEY_DIRECT          : 'direct',
    APPLY_KEY_EXPPREAPPLY     : 'expPreApply',
    APPLY_KEY_COMMUTERPASS    : 'commuterPass',
    APPLY_KEY_MONTHLYOVERTIME : 'monthlyOverTime',

    APPLY_KEY_HOLIDAY_ALL     : 'holidayAll',
    APPLY_KEY_HOLIDAY_AM      : 'holidayAm',
    APPLY_KEY_HOLIDAY_PM      : 'holidayPm',
    APPLY_KEY_HOLIDAY_TIME    : 'holidayTime',

    APPLY_CLIENT_DAILY        : 'daily',
    APPLY_CLIENT_MONTHLY      : 'monthly',
    APPLY_CLIENT_EMP_WORK     : 'empWork',
    APPLY_CLIENT_EMP_EXP      : 'empExp',
    APPLY_CLIENT_CHANGE_EMP   : 'changeEmp',
    APPLY_CLIENT_REQUEST_LIST : 'requestList',
    APPLY_CLIENT_CHANGE_HRM_EMP : 'changeHRMEmp',
    APPLY_CLIENT_REQUEST_HRM_LIST : 'requestHRMList',

    REASON_DUPL                : 1,  // 申請種類が重複した申請
    REASON_RANGE_DUPL          : 2,  // 休暇範囲が重複した休暇申請
    REASON_NOHALF              : 3,  // 半日休をとれない勤務パターンの日に半日休を申請した
    REASON_NOTIME              : 4,  // 時間単位休の時間帯が無効（0時間になる）
    REASON_60RULE              : 5,  // 時間単位休が１時間単位でない
    REASON_NG_HOLIDAY          : 6,  // 休日に休暇申請
    REASON_NG_KYUSHTU          : 7,  // 平日に休日出勤申請
    REASON_NG_EXCHANGE         : 8,  // 振替申請の振替先・元の組合せが不正
    REASON_NG_ZANGYO           : 9,  // 休日に残業申請
    REASON_NG_EARLYSTART       : 10, // 休日に早朝勤務申請
    REASON_NG_LATESTART        : 11, // 休日に遅刻申請
    REASON_NG_EARLYEND         : 12, // 休日に早退申請
    REASON_NOT_EXCHANGE        : 13, // 有休計画付与日に振替申請
    REASON_NG_DAYTYPE1         : 14, // 休日に勤務時間変更申請で非勤務日に変更
    REASON_NG_SHIFTCHANGE1     : 15, // シフト振替申請の振替先・元の組合せが不正

    HOLIDAY_TYPE_PAID          : '1', // 有給
    HOLIDAY_TYPE_FREE          : '2', // 無給
    HOLIDAY_TYPE_DAIQ          : '3', // 代休

    RANGE_ALL                  : '1', // 終日休
    RANGE_AM                   : '2', // 午前半休
    RANGE_PM                   : '3', // 午後半休
    RANGE_TIME                 : '4', // 時間単位休

    RANGE_SHORT                : '1', // 短期
    RANGE_LONG                 : '2', // 長期

    WORK_SYSTEM_FIX            : '0',  // 固定時間制
    WORK_SYSTEM_FLEX           : '1',  // フレックスタイム制
    WORK_SYSTEM_MUTATE         : '2',  // 変形労働時間制
    WORK_SYSTEM_MANAGER        : '3',  // 管理監督

    C_REAL                     : 'real',  // 実労働で計算
    C_DISC                     : 'disc',  // 裁量で計算
    C_FREAL                    : 'freal', // １日ごとに実労働の残業時間を出す（フレックスタイム制のみ）
    C_FDISC                    : 'fdisc', // １日ごとに裁量労働の残業時間を出す（フレックスタイム制のみ）

    COPYTAG                    : '(copy)',

    STOCK_DAIQ                 : '代休',

    INPUT_VOLUME               : 0,
    INPUT_TIME                 : 1,
    INPUT_VOLUME_FIX           : 2,

    INPUT_FLAG_NORMAL          : 0,
    INPUT_FLAG_BULK            : 1,
    INPUT_FLAG_EXEMPT          : 2,

    GRAPH_AREA_WIDTH           : 960,

    AREA_W_MIN                 : 790,
    AREA_W_MAX                 : 960,
    AREA_W_MAX_EXP             : 930,
    AREA_W_MAX_JOB             : 930,
    AREA_W_MARGIN              : 100,
    AREA_W_ADJUST              : 30,

    getStepStatus              : function(status){
        // シングルトンの関数（最初の呼び出しだけオブジェクトを初期化、2度目以降はオブジェクトを参照するだけ）
        var map = {
            'started'    : teasp.message.getLabel('tm10003470'), // 申請済み
            'approved'   : teasp.message.getLabel('tm10003480'), // 承認済み
            'rejected'   : teasp.message.getLabel('tm10003490'), // 却下
            'removed'    : teasp.message.getLabel('tm10003500'), // 申請取消
            'noresponse' : teasp.message.getLabel('tm10003510'), // 応答なし
            'reassigned' : teasp.message.getLabel('tm10003520'), // 再割当済み
            'fault'      : teasp.message.getLabel('tm10003530'), // 障害
            'held'       : teasp.message.getLabel('tm10003540'), // 保留
            'pending'    : teasp.message.getLabel('tm10003550')  // 未承認
        };
        teasp.constant.getStepStatus = function(s){
            if(teasp.constant.STATUS_ALL.contains(s)){
                return teasp.constant.getDisplayStatus(s);
            }
            return (s ? (map[s.toLowerCase()] || '') : '');
        };
        return teasp.constant.getStepStatus(status);
    },
    getStatusStyleSuffix       : function(status){
        if(teasp.constant.STATUS_REJECTS.contains(status)){
            return '_ng';
        }else if(teasp.constant.STATUS_APPROVES.contains(status)){
            return '_ok';
        }else{
            return '_up';
        }
    },
    /**
     * 駅探設定の「地域」の選択肢
     *
     * @param {number=} areaNo
     * @returns {Object}
     */
    getEkitanAreas             : function(areaNo){
        // シングルトンの関数（最初の呼び出しだけオブジェクトを初期化、2度目以降はオブジェクトを参照するだけ）
        var lst = [
            { areaNo:-1, name: teasp.message.getLabel('tm20007010') }, // 全国
            { areaNo: 0, name: teasp.message.getLabel('tm20007020') }, // 首都圏
            { areaNo: 1, name: teasp.message.getLabel('tm20007030') }, // 関西
            { areaNo: 2, name: teasp.message.getLabel('tm20007040') }, // 東海
            { areaNo: 3, name: teasp.message.getLabel('tm20007050') }, // 北海道
            { areaNo: 4, name: teasp.message.getLabel('tm20007060') }, // 東北
            { areaNo: 5, name: teasp.message.getLabel('tm20007070') }, // 北陸
            { areaNo: 6, name: teasp.message.getLabel('tm20007080') }, // 甲信越
            { areaNo: 7, name: teasp.message.getLabel('tm20007090') }, // 中国
            { areaNo: 8, name: teasp.message.getLabel('tm20007100') }, // 四国
            { areaNo: 9, name: teasp.message.getLabel('tm20007110') }  // 九州
        ];
        teasp.constant.getEkitanAreas = function(an){
            if(an === null || an === undefined){
                return lst;
            }
            for(var i = 0 ; i < lst.length ; i++){
                if(lst[i].areaNo == an){
                    return lst[i];
                }
            }
            return lst[0];
        };
        return teasp.constant.getEkitanAreas(areaNo);
    },
    // 駅探設定の「優先する航空会社」の選択肢
    getPreferredAirLine        : function(lineNo){
        // シングルトンの関数（最初の呼び出しだけオブジェクトを初期化、2度目以降はオブジェクトを参照するだけ）
        var lst = [
            { no: 0, name: teasp.message.getLabel('preferredAirLineNo_label') }, // なし
            { no: 1, name: 'JAL'     },
            { no: 2, name: 'ANA'     },
            { no: 4, name: 'SKY/ADO' }
        ];
        teasp.constant.getPreferredAirLine = function(n){
            if(n === null || n === undefined){
                return lst;
            }
            for(var i = 0 ; i < lst.length ; i++){
                if(lst[i].no == n){
                    return lst[i];
                }
            }
            return lst[0];
        };
        return teasp.constant.getPreferredAirLine(lineNo);
    },
    // 駅探設定の「検索結果のソート」の選択肢
    getRoutePreference         : function(no){
        // シングルトンの関数（最初の呼び出しだけオブジェクトを初期化、2度目以降はオブジェクトを参照するだけ）
        var lst = [
           { no: 0, name: teasp.message.getLabel('routeSortTime_label')     }, // 時間優先
           { no: 1, name: teasp.message.getLabel('routeSortCost_label')     }, // 料金優先
           { no: 2, name: teasp.message.getLabel('routeSortChange_label')   }, // 乗換回数優先
           { no: 3, name: teasp.message.getLabel('routeSortCommuter_label') }  // 定期料金優先
        ];
        teasp.constant.getRoutePreference = function(n){
            if(n === null || n === undefined){
                return lst;
            }
            for(var i = 0 ; i < lst.length ; i++){
                if(lst[i].no == n){
                    return lst[i];
                }
            }
            return lst[0];
        };
        return teasp.constant.getRoutePreference(no);
    },
    // 駅探設定の「定期区間の取扱」の選択肢
    getExcludeCommuterRoute    : function(flag){
        // シングルトンの関数（最初の呼び出しだけオブジェクトを初期化、2度目以降はオブジェクトを参照するだけ）
        var lst = [
           { flag: false, name: teasp.message.getLabel('excludeCommuterNo_label')  }, // 考慮しない
           { flag: true , name: teasp.message.getLabel('excludeCommuterYes_label') }  // 除いた交通費を計算
        ];
        teasp.constant.getExcludeCommuterRoute = function(f){
            if(f === null || f === undefined){
                return lst;
            }
            for(var i = 0 ; i < lst.length ; i++){
                if(lst[i].flag == f){
                    return lst[i];
                }
            }
            return lst[0];
        };
        return teasp.constant.getExcludeCommuterRoute(flag);
    },
    // 日タイプを返す
    getDayTypeWord : function(dayType){
        if(dayType == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY){       return teasp.message.getLabel('fixHoliday_label');      // 所定休日
        }else if(dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){  return teasp.message.getLabel('legalHoliday_label');    // 法定休日
        }else if(dayType == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){ return teasp.message.getLabel('fixHoliday_label');      // 所定休日
        }else{                                                       return teasp.message.getLabel('tk10000260');            // 平日
        }
    },
    // 対象者フラグ名を返す
    getInputFlagName : function(inputFlag){
        switch(inputFlag){
        case teasp.constant.INPUT_FLAG_BULK   : return teasp.message.getLabel('inputFlagBulk'); // 一括
        case teasp.constant.INPUT_FLAG_EXEMPT : return teasp.message.getLabel('inputFlagExempt'); // 対象外
        default: return teasp.message.getLabel('inputFlagNormal'); // 通常
        }
    }
});
