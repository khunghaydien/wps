import {BaseObj}        from "../../_common/BaseObj.js?v=XVERSIONX";
import {Util}           from "../../_common/Util.js?v=XVERSIONX";
/**
 * 月次休暇残高クラス
 */
export class MonthlyLeaveBalance extends BaseObj {
    constructor(obj){
        super(obj);
        this.obj.MonthStartDate__c = Util.formatDate(this.obj.MonthStartDate__c);
        this.obj.MonthEndDate__c   = Util.formatDate(this.obj.MonthEndDate__c);
        this.obj.StartDate__c      = Util.formatDate(this.obj.StartDate__c);
        this.obj.EndDate__c        = Util.formatDate(this.obj.EndDate__c);
    }
    /**
     * 社員ID
     * @returns {string}
     */
    getEmpId(){
        return this.obj.EmpId__c;
    }
    /**
     * 表示用年度
     * @returns {string}
     */
    getYearMonthS(){
        return this.obj.YearMonthS__c;
    }
    /**
     * 年度
     * @retrns {number}
     */
    getYearMonth(){
        return this.obj.YearMonth__c;
    }
    /**
     * 年度サブナンバー
     * @retrns {number|null}
     */
    getSubNo(flag){
        const sn = this.obj.SubNo__c;
        return (sn || (flag ? '' : 0));
    }
    /**
     * 月度ステータス
     * @returns {string}
     */
    getMonthStatus(){
        const status = (this.obj.EmpMonthId__r && this.obj.EmpMonthId__r.EmpApplyId__r && this.obj.EmpMonthId__r.EmpApplyId__r.Status__c) || null;
        if(!status && this.obj.EmpMonthId__c){
            return '未確定';
        }
        return (status || '');
    }
    /**
     * 月度の基準時間
     * @returns {string}
     */
    getBaseTime(){
        return Util.formatTime(this.obj.BaseTime__c);
    }
    /**
     * 休暇グループID
     * @returns {string}
     */
    getHolidayGroupId(){
        return this.obj.HolidayGroupId__c;
    }
    /**
     * 休暇グループ名
     * @returns {string}
     */
    getHolidayGroupName(){
        return this.obj.HolidayGroupId__r.Name;
    }
    /**
     * 休暇グループの休暇種別
     * @returns {string}
     */
    getHolidayGroupType(){
        return this.obj.HolidayGroupId__r.Type__c;
    }
    /**
     * 年次有給休暇の休暇グループ
     * @returns {boolean}
     */
    isTypeA(){
        return (this.getHolidayGroupType() == 'A');
    }
    /**
     * 入払区分
     * @returns {string}
     */
    getPcType(){
        return this.obj.PcType__c || '';
    }
    /**
     * 付与データ
     * @returns {boolean}
     */
    isProvide(){
        return (this.obj.PcType__c == 'P');
    }
    /**
     * 消化データ
     * @returns {boolean}
     */
    isConsume(){
        return (this.obj.PcType__c == 'C');
    }
    /**
     * 付与日数
     * @returns {number|string}
     */
    getProvideDays(){
        if(this.isProvide()){
            return this.obj.ProvideDays__c || 0;
        }else{
            return '';
        }
    }
    /**
     * 付与時間
     * @param {boolean} flag 
     * @returns {number|string} flag=trueの場合はh:mmで返す
     */
    getProvideTime(flag){
        if(this.isProvide()){
            return (flag ? Util.formatTime(this.obj.ProvideTime__c) : this.obj.ProvideTime__c);
        }else{
            return '';
        }
    }
    /**
     * 消化日数
     * @returns {number|string}
     */
    getConsumeDays(){
        return this.obj.ConsumeDays__c || 0;
    }
    /**
     * 消化時間
     * @param {boolean} flag 
     * @returns {number|string} flag=trueの場合はh:mmで返す
     */
    getConsumeTime(flag){
        return (flag ? Util.formatTime(this.obj.ConsumeTime__c) : this.obj.ConsumeTime__c);
    }
    /**
     * 残日数
     * @returns {number|string}
     */
    getRemainDays(){
        if(this.isProvide()){
            return this.obj.RemainDays__c || 0;
        }else{
            return '';
        }
    }
    /**
     * 残時間
     * @param {boolean} flag 
     * @returns {number|string} flag=trueの場合はh:mmで返す
     */
    getRemainTime(flag){
        if(this.isProvide()){
            return (flag ? Util.formatTime(this.obj.RemainTime__c) : this.obj.RemainTime__c);
        }else{
            return '';
        }
    }
    /**
     * 失効（失効の場合'E'を返す）
     * @returns {string}
     */
    getExpired(){
        return this.obj.Expired__c || '';
    }
    /**
     * 過消化日数
     * @returns {number|string}
     */
    getOvertakeDays(){
        if(this.isProvide()){
            return '';
        }else{
            return this.obj.OvertakeDays__c || 0;
        }
    }
    /**
     * 過消化時間
     * @param {boolean} flag 
     * @returns {number|string} flag=trueの場合はh:mmで返す
     */
    getOvertakeTime(flag){
        if(this.isProvide()){
            return '';
        }else{
            return (flag ? Util.formatTime(this.obj.OvertakeTime__c) : this.obj.OvertakeTime__c);
        }
    }
    /**
     * 制限外時間
     * @param {boolean} flag 
     * @returns {number|string} flag=trueの場合はh:mmで返す
     */
    getViolateTime(flag){
        if(this.isProvide()){
            return '';
        }else{
            return (flag ? Util.formatTime(this.obj.ViolateTime__c) : this.obj.ViolateTime__c);
        }
    }
    /**
     * 有効開始日
     * @param {string=} fmt 書式（YYYY/MM/DD等）
     * @returns {string}
     */
    getStartDate(fmt){
        return Util.formatDate(this.obj.StartDate__c, fmt);
    }
    /**
     * 有効終了日
     * @param {string=} fmt 書式（YYYY/MM/DD等）
     * @returns {string}
     */
    getEndDate(fmt){
        return Util.formatDate(this.obj.EndDate__c, fmt);
    }
    /**
     * 説明
     * @returns {string}
     */
    getDescription(){
        if(this.obj.EmpLeaveManageId__r){
            if(this.obj.EmpLeaveManageId__r.EmpApplyId__r){
                return this.obj.EmpLeaveManageId__r.EmpApplyId__r.Name;
            }else{
                return this.obj.EmpLeaveManageId__r.Description__c || '';
            }
        }else{
            return '';
        }
    }
    /**
     * 休暇型
     * @returns {string|null}
     */
    getHolidayRange(){
        return (this.obj.EmpLeaveManageId__r
            && this.obj.EmpLeaveManageId__r.EmpApplyId__r
            && this.obj.EmpLeaveManageId__r.EmpApplyId__r.HolidayId__r
            && this.obj.EmpLeaveManageId__r.EmpApplyId__r.HolidayId__r.Range__c) || null;
    }
    /**
     * 時間単位休
     * @returns {boolean}
     */
    isHourlyPaidLeave(){
        return (this.obj.EmpLeaveManageId__r.HourlyPaidLeaveFlag__c || false);
    }
    /**
     * 同じ休暇グループかどうかを返す
     * ※引数の休暇グループが「時間単位有休制限」の場合は「年次有給休暇」の時間単位休も同一グループとする
     * @param {HolidayGroup} holidayGroup 
     * @returns {boolean}
     */
    isSameGroup(holidayGroup){
        if(holidayGroup.isTypeH()){
            return ((this.isHourlyPaidLeave() && this.isTypeA()) || this.getHolidayGroupId() == holidayGroup.getId());
        }
        return (this.getHolidayGroupId() == holidayGroup.getId());
    }
}