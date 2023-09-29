teasp.provide('teasp.data.EmpApply');
/**
 * 勤怠申請関連データクラス.
 *
 * @constructor
 */
teasp.data.EmpApply = function(apply){
    /** @private */
    this.apply = apply;
};

/**
 * 申請IDを返す
 * @return {string} 申請ID
 */
teasp.data.EmpApply.prototype.getId = function(){
    return this.apply.id;
};

/**
 * 申請種類を返す
 * @return {string} 申請種類
 */
teasp.data.EmpApply.prototype.getApplyType = function(){
    return this.apply.applyType;
};

/**
 * 表示用の（翻訳済みの）申請種類を返す
 * @return {string} 表示用の申請種類
 */
teasp.data.EmpApply.prototype.getDisplayApplyType = function(){
    return teasp.data.EmpApply.getDisplayApplyType(this.apply.applyType);
};

/**
 * 表示用の（翻訳済みの）申請種類を返す
 * @param {string} applyType 申請種類名
 * @return {string} 表示用の申請種類
 */
teasp.data.EmpApply.getDisplayApplyType = function(applyType){
    switch(applyType){
    case teasp.constant.APPLY_TYPE_HOLIDAY        : return teasp.message.getLabel('applyHoliday_label');     // 休暇申請
    case teasp.constant.APPLY_TYPE_EXCHANGE       : return teasp.message.getLabel('applyExchange_label');    // 振替申請
    case teasp.constant.APPLY_TYPE_ZANGYO         : return teasp.message.getLabel('applyZangyo_label');      // 残業申請
    case teasp.constant.APPLY_TYPE_EARLYSTART     : return teasp.message.getLabel('applyEarlyWork_label');   // 早朝勤務申請
    case teasp.constant.APPLY_TYPE_KYUSHTU        : return teasp.message.getLabel('applyHolidayWork_label'); // 休日出勤申請
    case teasp.constant.APPLY_TYPE_PATTERNS       : return teasp.message.getLabel('applyPatternS_label');    // 勤務時間変更申請
    case teasp.constant.APPLY_TYPE_PATTERNL       : return teasp.message.getLabel('applyPatternL_label');    // 長期時間変更申請
    case teasp.constant.APPLY_TYPE_LATESTART      : return teasp.message.getLabel('applyLateStart_label');   // 遅刻申請
    case teasp.constant.APPLY_TYPE_EARLYEND       : return teasp.message.getLabel('applyEarlyEnd_label');    // 早退申請
    case teasp.constant.APPLY_TYPE_MONTHLY        : return teasp.message.getLabel('fixMonth_caption');       // 勤務確定
    case teasp.constant.APPLY_TYPE_DAILY          : return teasp.message.getLabel('applyDaily_label');       // 日次確定
    case teasp.constant.APPLY_TYPE_REVISETIME     : return teasp.message.getLabel('applyReviseTime_label');  // 勤怠時刻修正申請
    case teasp.constant.APPLY_TYPE_DIRECT         : return teasp.message.getLabel('tk10004650');             // 直行・直帰申請
    case teasp.constant.APPLY_TYPE_SHIFTCHANGE    : return teasp.message.getLabel('tf10011260');             // シフト振替申請
    case teasp.constant.APPLY_TYPE_MONTHLYOVERTIME: return teasp.message.getLabel('mo00000001');             // 月次残業申請
    }
    return applyType;
};

/**
 * 休暇名を返す
 * @return {string} 休暇名
 */
teasp.data.EmpApply.prototype.getHolidayName = function(){
    return this.apply.holiday.name;
};

/**
 * 時間単位休の申請か
 * @return {boolean} true:時間単位休の申請
 */
teasp.data.EmpApply.prototype.isTimeHoliday = function(){
    return (this.apply.holiday.range == teasp.constant.RANGE_TIME);
};

/**
 * 振替先の日付を返す
 * @return {string} 振替先の日付('yyyy-MM-dd')
 */
teasp.data.EmpApply.prototype.getExchangeDate = function(){
    return this.apply.exchangeDate;
};

/**
 * 振替元・先の日付を表示。
 * @return {string} 振替元・先の日付('yyyy/MM/dd ⇔ M/d)
 */
teasp.data.EmpApply.prototype.getExchangePair = function(){
    return teasp.message.getLabel('tm10001520' // {0} ⇔ {1}
            , teasp.util.date.formatDate(this.apply.startDate, 'SLA')
            , teasp.util.date.formatDate(this.apply.exchangeDate, 'M/d'));
};

/**
 * 勤務パターン名を返す
 * @return {string} 勤務パターン名
 */
teasp.data.EmpApply.prototype.getPatternName = function(){
    return this.apply.pattern.name;
};

/**
 * 日付範囲を示す文字列を返す
 * @return {string} 日付範囲を示す文字列
 */
teasp.data.EmpApply.prototype.getDateRange = function(){
    return teasp.util.date.formatDateRange(this.apply.startDate, this.apply.endDate, 'SLA');
};

/**
 * 申請対象日付（期間の場合は開始日）を返す
 * @return {string} 申請対象日付（期間の場合は開始日）('yyyy-MM-dd')
 */
teasp.data.EmpApply.prototype.getStartDate = function(){
    return this.apply.startDate;
};

/**
 * 申請対象の終了日を返す
 * @return {string} 申請対象の終了日('yyyy-MM-dd')
 */
teasp.data.EmpApply.prototype.getEndDate = function(){
    return this.apply.endDate;
};

/**
 * 申請時に入力した備考を返す
 * @return {string} 申請時に入力した備考
 */
teasp.data.EmpApply.prototype.getNote = function(){
    return (this.apply.note    || '');
};

/**
 * 申請時に入力した連絡先を返す
 * @return {string} 申請時に入力した連絡先
 */
teasp.data.EmpApply.prototype.getContact = function(){
    return (this.apply.contact || '');
};

/**
 * 申請日付を返す
 * @return {string} 申請日付（'yyyy-MM-dd H:mm')
 */
teasp.data.EmpApply.prototype.getApplyTime = function(){
    return teasp.util.date.formatDateTime(this.apply.applyTime, 'SLA-HM');
};

/**
 * 申請のステータスを返す
 * @return {string} 申請のステータス
 */
teasp.data.EmpApply.prototype.getStatus = function(){
    return (this.apply.status || teasp.message.getLabel('notFix_label'));
};

/**
 * 承認済み（確定済み）か
 * @return {boolean} 承認済み（確定済み）である
 */
teasp.data.EmpApply.prototype.isApprove = function(){
    return teasp.constant.STATUS_APPROVES.contains(this.apply.status);
};

/**
 * 却下（却下済み）か
 * @return {boolean} 却下（却下済み）である
 */
teasp.data.EmpApply.prototype.isReject = function(){
    return teasp.constant.STATUS_REJECTS.contains(this.apply.status);
};

/**
 * 却下済みか
 * @return {boolean} 却下済みである
 */
teasp.data.EmpApply.prototype.isRejectDone = function(){
    return (teasp.constant.STATUS_REJECTDONE == this.apply.status);
};

/**
 * 却下承諾済みか
 * @return {boolean}
 */
teasp.data.EmpApply.prototype.isClose = function(){
    return (this.apply.close || false);
};

/**
 * 取消済みか
 * @return {boolean} 取消済みである
 */
teasp.data.EmpApply.prototype.isCancel = function(){
    return teasp.constant.STATUS_CANCELS.contains(this.apply.status);
};

/**
 * 勤務時間変更申請か
 * @return {boolean} 勤務時間変更申請である
 */
teasp.data.EmpApply.prototype.isApplyPatternS = function(){
    return (this.apply.applyType == teasp.constant.APPLY_TYPE_PATTERNS);
};

/**
 * 長期時間変更申請か
 * @return {boolean} 長期時間変更申請である
 */
teasp.data.EmpApply.prototype.isApplyPatternL = function(){
    return (this.apply.applyType == teasp.constant.APPLY_TYPE_PATTERNL);
};

/**
 * 休暇申請か
 * @return {boolean} 休暇申請である
 */
teasp.data.EmpApply.prototype.isApplyHoliday  = function(){
    return (this.apply.applyType == teasp.constant.APPLY_TYPE_HOLIDAY );
};

/**
 * 残業申請か
 * @return {boolean} 残業申請である
 */
teasp.data.EmpApply.prototype.isApplyZangyo   = function(){
    return (this.apply.applyType == teasp.constant.APPLY_TYPE_ZANGYO  );
};

/**
 * 振替申請か
 * @return {boolean} 振替申請である
 */
teasp.data.EmpApply.prototype.isApplyExchange = function(){
    return (this.apply.applyType == teasp.constant.APPLY_TYPE_EXCHANGE);
};

/**
 * シフト振替申請か
 * @return {boolean} シフト振替申請である
 */
teasp.data.EmpApply.prototype.isApplyShiftChange = function(){
    return (this.apply.applyType == teasp.constant.APPLY_TYPE_SHIFTCHANGE);
};

/**
 * 休日出勤申請か
 * @return {boolean} 休日出勤申請である
 */
teasp.data.EmpApply.prototype.isApplyKyushtu  = function(){
    return (this.apply.applyType == teasp.constant.APPLY_TYPE_KYUSHTU );
};

/**
 * 時間範囲表示
 * @return {string} 'H:mm ～ H:mm'
 */
teasp.data.EmpApply.prototype.getTimeRange = function(){
    var st = this.apply.startTime;
    var et = this.apply.endTime;
    if(typeof(st) != 'number' || typeof(et) != 'number'){
        if(this.isApplyPatternS() || this.isApplyPatternL()){
            st = this.apply.pattern.stdStartTime;
            et = this.apply.pattern.stdEndTime;
        }else{
            return '';
        }
    }
    return teasp.message.getLabel('tm10003590', teasp.util.time.timeValue(st), teasp.util.time.timeValue(et)); // {0} ～ {1}
};

/**
 * 自己都合か
 * @return {boolean} 自己都合である
 */
teasp.data.EmpApply.prototype.isOwnReason  = function(){
    return this.apply.ownReason;
};

/**
 * 遅刻早退取扱い
 * @return {number} 0:遅刻/早退申請ありなら控除せず（自己都合かどうかは関係なく）
 * 1:遅刻/早退申請ありかつ自己都合でない場合は控除せず
 * 2:遅刻/早退申請ありかつ自己都合でない場合は控除せず＆定時出社or退社とみなす
 */
teasp.data.EmpApply.prototype.getTreatDeduct  = function(){
    return this.apply.treatDeduct;
};
