/**
 * 定数クラス
 *
 * @author DCI小島
 */
teasp.constant = {
    LEVEL_TRACE                : 6,
    LEVEL_DEBUG                : 5,
    LEVEL_INFO                 : 4,
    LEVEL_WARN                 : 3,
    LEVEL_ERROR                : 2,
    LEVEL_FATAL                : 1,
    LEVEL_OFF                  : 0,

    // ユーティリティメソッド内で参照している
    REST_FIX                   : 21, // 所定休憩
    REST_FREE                  : 22, // 私用休憩
    REST_PAY                   : 23, // 時間単位有休
    REST_UNPAY                 : 24, // 時間単位休(無給)
    AWAY                       : 30, // 私用外出

    TIMEOUT_CAUSE              : /Error parsing json response/i,

    STATUS_NOTADMIT            : '未確定',
    STATUS_NOTREQUEST          : '未申請',
    STATUS_CANCEL1             : '確定取消',
    STATUS_CANCEL2             : '申請取消',
    STATUS_REJECT              : '却下',
    STATUS_REJECTDONE          : '却下済み',
    STATUS_WAIT                : '承認待ち',
    STATUS_ADMIT               : '確定済み',
    STATUS_APPROVE             : '承認済み',
    STATUS_APPROVING           : '承認中',
    STATUS_PAYD                : '精算済み',
    STATUS_REASSIGNED          : '再割当済み',
    STATUS_REQUESTED           : '申請済み',
    STATUS_CANCEL_WAIT         : '取消伝票承認待ち',
    STATUS_CANCEL_APPROVE      : '取消伝票承認済み',
    STATUS_JOURNAL             : '仕訳済み',

    EXP_PRE_FORM1              : '出張・交通費',
    EXP_PRE_FORM2              : '会議・交際費',
    EXP_PRE_FORM3              : '一般経費',
    EXP_PRE_FORM4              : '仮払申請',
    EXP_FORM0                  : 'expApply',

    CU_INT_SIZE_MAX            : 12,                // 金額の整数の桁数最大値
    CU_DEC_POINT_MAX           : 6,                 // 小数点以下桁数の最大値（レート、現地金額で使用）
    CU_DEC_POINT_MIN           : 2,                 // 小数点以下桁数の最小値（レートの表示で使用）
    CU_INT_DISP_SIZE_MAX       : 17,                // 金額(整数)入力欄のサイズ
    CU_DEC_DISP_SIZE_MAX       : 21,                // 金額(小数点あり)入力欄のサイズ
    CU_DEC_MIN_VALUE           : 0.000001,          // 扱える最小値
    CU_TOTAL_LOWER_LIMIT       : 0,                 // 合計金額の下限値（マイナスを考慮しない場合の）
    CU_TOTAL_UPPER_LIMIT       : 9999999999999,     // 合計金額の上限値

    COUNT_LIMIT                : 10000,
    QUERY_MAX                  : 2000,

    DIVERGE_REASON_MAX         : 255,

    IC_INPUTS                  : ['spice'],
    statusJEmap                : null,

    DATE_F                     : 'YYYY-MM-DD',
    DATETIME_F                 : 'YYYY-MM-DD HH:mm:ss',

    //電帳法画像スキャン保存要件
    SHORTSIDE_LOWERLIMIT       : 1654,
    LONGSIDE_LOWERLIMIT        : 2338,
    BITSPERSAMPLE_LOWERLIMIT   : 8,
    COLORTYPE_LIMIT            : 'Color',

    // 勤怠休暇
    HOLIDAY_TYPE_PAID          : '1', // 有給
    HOLIDAY_TYPE_FREE          : '2', // 無給
    HOLIDAY_TYPE_DAIQ          : '3', // 代休

    RANGE_ALL                  : '1', // 終日休
    RANGE_AM                   : '2', // 午前半休
    RANGE_PM                   : '3', // 午後半休
    RANGE_TIME                 : '4', // 時間単位休

    // 新休暇管理　新方式
    LEAVEMANAGE_VER2           : 2,

    // ステータス値の翻訳テーブルを返す
    getStatusJEmap : function(){
        if(!teasp.constant.statusJEmap){
            teasp.constant.statusJEmap = {};
            teasp.constant.statusJEmap[teasp.constant.STATUS_NOTADMIT]       = teasp.message.getLabel('notFix_label');           // 未確定
            teasp.constant.statusJEmap[teasp.constant.STATUS_NOTREQUEST]     = teasp.message.getLabel('tm10003560');             // 未申請
            teasp.constant.statusJEmap[teasp.constant.STATUS_CANCEL1]        = teasp.message.getLabel('cancelFix_btn_title');    // 確定取消
            teasp.constant.statusJEmap[teasp.constant.STATUS_CANCEL2]        = teasp.message.getLabel('tm10003500');             // 申請取消
            teasp.constant.statusJEmap[teasp.constant.STATUS_REJECT]         = teasp.message.getLabel('tm10003490');             // 却下
            teasp.constant.statusJEmap[teasp.constant.STATUS_REJECTDONE]     = teasp.message.getLabel('rejected_label');         // 却下済み
            teasp.constant.statusJEmap[teasp.constant.STATUS_WAIT]           = teasp.message.getLabel('waitApproval_label');     // 承認待ち
            teasp.constant.statusJEmap[teasp.constant.STATUS_ADMIT]          = teasp.message.getLabel('fixed_label');            // 確定済み
            teasp.constant.statusJEmap[teasp.constant.STATUS_APPROVE]        = teasp.message.getLabel('tm10003480');             // 承認済み
            teasp.constant.statusJEmap[teasp.constant.STATUS_APPROVING]      = teasp.message.getLabel('whileApproving_label');   // 承認中
            teasp.constant.statusJEmap[teasp.constant.STATUS_PAYD]           = teasp.message.getLabel('reimbursement_label');    // 精算済み
            teasp.constant.statusJEmap[teasp.constant.STATUS_REASSIGNED]     = teasp.message.getLabel('tm10003520');             // 再割当済み
            teasp.constant.statusJEmap[teasp.constant.STATUS_REQUESTED]      = teasp.message.getLabel('tm10003470');             // 申請済み
            teasp.constant.statusJEmap[teasp.constant.STATUS_CANCEL_WAIT]    = teasp.message.getLabel('tf10006200');             // 取消伝票承認待ち
            teasp.constant.statusJEmap[teasp.constant.STATUS_CANCEL_APPROVE] = teasp.message.getLabel('tf10006210');             // 取消伝票承認済み
            teasp.constant.statusJEmap[teasp.constant.STATUS_JOURNAL]        = teasp.message.getLabel('tf10006220');             // 仕訳済み
        }
        return teasp.constant.statusJEmap;
    },
    // 表示用のステータス値を返す
    getDisplayStatus : function(status){
        return (teasp.constant.getStatusJEmap()[status] || status);
    },
    // 日本語のステータス値を返す
    getReverseStatus : function(status){
        var o = teasp.constant.getStatusJEmap();
        for(var key in o){
            if(o.hasOwnProperty(key) && o[key] == status){
                return key;
            }
        }
        return status;
    },
    // 事前申請のフォーム名を返す
    getExpPreFormName : function(name){
        switch(name){
        case teasp.constant.EXP_PRE_FORM1 : return 'tf10001410';    // 出張・交通費
        case teasp.constant.EXP_PRE_FORM2 : return 'tf10000600';    // 会議・交際費
        case teasp.constant.EXP_PRE_FORM3 : return 'tf10001420';    // 一般経費
        case teasp.constant.EXP_PRE_FORM4 : return 'tf10006120';    // 仮払申請
        }
        return name;
    },
    // 経費精算・事前申請の設定情報のデフォルト値
    getDefaultExpPreApplyConfig : function(){
        return {
            expenseTypes                : [],           // 経費精算区分
            requireChargeJob            : null,         // 明細単位のジョブ入力   : 0:入力しない 1:入力する 2:必須
            requireChargeDept           : null,         // 明細単位の負担部署入力 : 0:入力しない 1:入力する 2:必須
            expApply                    : {             // 経費申請オプション
                startFromList           : false,        // 経費精算のスタート画面を一覧にする
                hiddenApplyBtn          : false,        // 未申請明細リストでは承認申請しない
                // 基本情報
                useTitle                : false,        // 件名を入力する
                useExpenseType          : false,        // 精算区分を指定する
                usePayMethod            : false,        // 精算方法を指定する
                useApplyDate            : false,        // 申請日を指定する
                usePayDate              : false,        // 支払予定日を指定する
                useProvisional          : false,        // 仮払い申請を指定する
                useChargeJob            : false,        // ジョブを指定する
                useChargeDept           : false,        // 負担部署を指定する
                useExtraItem1           : false,        // 拡張項目1を指定する
                useExtraItem2           : false,        // 拡張項目2を指定する
                // 添付ファイル
                useAttachment           : false
            },
            '出張・交通費' : {
                msgId                   : 'tf10001410', // 表示名
                view                    : 'Form1',      // 遷移先
                order                   : 10,           // 並び順
                removed                 : false,        // 無効化
                instant                 : false,        // 申請なしで事後精算に連動
                // 基本情報
                useExpenseType          : false,        // 精算区分を指定する
                usePayMethod            : false,        // 精算方法を指定する
                useApplyDate            : false,        // 申請日を指定する
                useProvisional          : false,        // 仮払い申請を指定する
                useChargeDept           : false,        // 負担部署を指定する
                useExtraItem1           : false,        // 拡張項目1を指定する
                useExtraItem2           : false,        // 拡張項目2を指定する
                // 出発区分
                dptArvFlagsOptional     : false,        // 出発区分を必須としない
                // 出張種別
                useOverseaTravel        : true ,        // 海外出張を使う
                useOneDayTrip           : true ,        // 日帰り出張を使う
                // 使用するセクション
                useJtbSect              : false,        // 出張手配明細
                useAllowanceSect        : true ,        // 出張手当・宿泊手当セクションを使う
                useCouponTicketSect     : true ,        // 手配回数券セクションを使う
                useTicketArrangeSect    : true ,        // 手配チケットセクションを使う
                useProvisionalSect      : true ,        // 仮払申請セクションを使う
                useFreeInputSect        : true ,        // 社員立替交通費を使う
                useAttachment           : false         // 添付ファイル
            },
            '会議・交際費' : {
                msgId                   : 'tf10000600', // 表示名
                view                    : 'Form2',      // 遷移先
                order                   : 20,           // 並び順
                removed                 : false,        // 無効化
                instant                 : false,        // 申請なしで事後精算に連動
                // 基本情報
                useExpenseType          : false,        // 精算区分を指定する
                usePayMethod            : false,        // 精算方法を指定する
                useApplyDate            : false,        // 申請日を指定する
                useProvisional          : false,        // 仮払い申請を指定する
                useChargeDept           : false,        // 負担部署を指定する
                useExtraItem1           : false,        // 拡張項目1を指定する
                useExtraItem2           : false,        // 拡張項目2を指定する
                // 使用するセクション
                useProvisionalSect      : true ,        // 仮払申請セクションを使う
                useAttachment           : false         // 添付ファイル
            },
            '一般経費' : {
                msgId                   : 'tf10001420', // 表示名
                view                    : 'Form3',      // 遷移先
                order                   : 30,           // 並び順
                removed                 : false,        // 無効化
                instant                 : false,        // 申請なしで事後精算に連動
                // 基本情報
                useExpenseType          : false,        // 精算区分を指定する
                usePayMethod            : false,        // 精算方法を指定する
                useApplyDate            : false,        // 申請日を指定する
                useProvisional          : false,        // 仮払い申請を指定する
                useChargeDept           : false,        // 負担部署を指定する
                useExtraItem1           : false,        // 拡張項目1を指定する
                useExtraItem2           : false,        // 拡張項目2を指定する
                // 使用するセクション
                useProvisionalSect      : true ,        // 仮払申請セクションを使う
                useAttachment           : false         // 添付ファイル
            },
            '仮払申請' : {
                msgId                   : 'tf10006120', // 表示名
                view                    : 'Form4',      // 遷移先
                order                   : 40,           // 並び順
                removed                 : true ,        // 無効化
                instant                 : false,        // 申請なしで事後精算に連動
                // 基本情報
                useExpenseType          : false,        // 精算区分を指定する
                usePayMethod            : false,        // 精算方法を指定する
                useChargeDept           : false,        // 負担部署を指定する
                useExtraItem1           : false,        // 拡張項目1を指定する
                useExtraItem2           : false,        // 拡張項目2を指定する
                // 添付ファイル
                useAttachment           : false
            }
        };
    },
    // 経費精算・事前申請の設定情報をデフォルト値とマージして返す
    getExpPreApplyConfig : function(v){
        var o = teasp.constant.getDefaultExpPreApplyConfig();
        if(v){
            for(var key in v){
                if(v.hasOwnProperty(key)){
                    if(o[key] && typeof(o[key]) == 'object'){
                        o[key] = dojo.mixin(o[key], v[key]);
                    }else{
                        o[key] = v[key];
                    }
                }
            }
        }
        o['出張・交通費'].useChargeJob = false; // 出張・交通費のジョブを強制でオフにする
        return o;
    }
};
