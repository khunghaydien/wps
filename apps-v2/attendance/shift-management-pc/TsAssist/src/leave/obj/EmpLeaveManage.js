import {Util}              from "../../_common/Util.js?v=XVERSIONX";
import {BaseObj}           from "../../_common/BaseObj.js?v=XVERSIONX";
import {HourlyLeavePeriod} from "./HourlyLeavePeriod.js?v=XVERSIONX";
/**
 * 社員休暇管理クラス
 */
export class EmpLeaveManage extends BaseObj {
    constructor(obj){
        super(obj);
        this.obj.StartDate__c     = Util.formatDate(this.obj.StartDate__c);
        this.obj.EndDate__c       = Util.formatDate(this.obj.EndDate__c);
    }
    /**
     * クローン生成
     * @returns クローン
     */
    clone(){
        return Object.assign({}, this.obj);
    }
    /**
     * 編集可否
     * @returns {boolean}
     */
    isEditable(){
        // 時間単位有休制限の定期付与のデータは変更不可
        if(this.getHolidayGroupType() == 'H' && this.isPeriodic()){
            return false;
        }
        // 勤怠申請に紐づくデータと有休計画付与の消化データは変更不可
        if(this.obj.EmpApplyId__c || this.isPlannedHoliday()){
            return false;
        }
        // マイナス付与以外の消化データは変更不可
        // if(this.isConsume() && !this.isMinus()){
        //     return false;
        // }
        return true;
    }
    /**
     * 削除可否
     * @returns {boolean}
     */
    isDeletable(){
        return this.isEditable();
    }
    /**
     * ソート用の比較
     * @param {EmpLeaveManage} other 
     * @returns {number}
     */
    compare(other){
        if(this.getStartDate() == other.getStartDate()){
            if(this.getPcType() != other.getPcType()){
                return (this.getPcType() < other.getPcType() ? 1 : -1);
            }else if(this.getEndDate() == other.getEndDate()){
                if(this.getPcType() == other.getPcType()){
                    const type1 = this.getHolidayGroupType();
                    const type2 = other.getHolidayGroupType();
                    if(type1 == type2){
                        const p1 = (this.isPeriodic() ? 0 : 1);
                        const p2 = (other.isPeriodic() ? 0 : 1);
                        if(p1 == p2){
                            const dt1 = (this.getDayType() == '2' ? 0 : 1);
                            const dt2 = (other.getDayType() == '2' ? 0 : 1);
                            return dt1 - dt2;
                        }
                        return p1 - p2;
                    }
                    return (type1 < type2 ? -1 : 1);
                }else{
                    return (this.getPcType() < other.getPcType() ? 1 : -1);
                }
            }
            return (this.getEndDate() < other.getEndDate() ? -1 : 1);
        }
        return (this.getStartDate() < other.getStartDate() ? -1 : 1);
    }
    /**
     * 時間単位休の年度・期間クラスのインスタンスを生成
     * @returns 
     */
    getHourlyLeavePeriod(){
        return new HourlyLeavePeriod({
            year: this.obj.AdjustYear__c,
            subNo: this.obj.AdjustYearSubNo__c,
            startDate: this.obj.StartDate__c,
            endDate: this.obj.EndDate__c
        });
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
     * 休暇グループタイプ
     * @returns {string}
     */
    getHolidayGroupType(){
        return this.obj.HolidayGroupId__r.Type__c;
    }
    /**
     * 時間単位有休制限の休暇グループ
     * @returns {boolean}
     */
    isTypeH(){
        return (this.getHolidayGroupType() == 'H');
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
     * マイナス付与データ
     * @parma {boolean} flag
     * @returns {boolean|string} flag=trueの場合は○か''で返す
     */
    isMinus(flag){
        const v = (this.obj.PcType__c == 'C' && this.obj.AdjustTargetId__c) ? true : false;
        if(flag){
            return (v ? '○' : '');
        }
        return (v || false);
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
     * @param {*} flag 
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
        if(!this.isProvide()){
            return this.obj.ConsumeDays__c || 0;
        }else{
            return '';
        }
    }
    /**
     * 消化時間
     * @param {boolean} flag 
     * @returns {number|string} flag=trueの場合はh:mmで返す
     */
    getConsumeTime(flag){
        if(!this.isProvide()){
            return (flag ? Util.formatTime(this.obj.ConsumeTime__c) : this.obj.ConsumeTime__c);
        }else{
            return '';
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
     * 除外日
     * @returns {string}
     */
    getExcludeDate(){
        return this.obj.ExcludeDate__c || '';
    }
    /**
     * 定期付与
     * @parma {boolean} flag
     * @returns {boolean|string} flag=trueの場合は○か''で返す
     */
    isPeriodic(flag){
        const v = this.obj.Periodic__c;
        if(flag){
            return (v ? '○' : '');
        }
        return (v || false);
    }
    /**
     * 計画有休
     * @parma {boolean} flag
     * @returns {boolean|string} flag=trueの場合は○か''で返す
     */
    isPlannedHoliday(flag){
        const v = this.obj.PlannedHolidayFlag__c;
        if(flag){
            return (v ? '○' : '');
        }
        return (v || false);
    }
    /**
     * 取得義務判定対象外フラグ
     * @parma {boolean} flag
     * @returns {boolean|string} flag=trueの場合は○か''で返す
     */
    isNotObligatoryFlag(flag){
        const v = this.obj.NotObligatoryFlag__c;
        if(flag){
            return (v ? '○' : '');
        }
        return (v || false);
    }
    /**
     * 実付与日数
     * @returns {number|string}
     */
    getRealProvideDays(){
        if(this.isProvide()){
            return this.obj.RealProvideDays__c || '';
        }else{
            return '';
        }
    }
    /**
     * 日タイプ
     * @returns {string|null}
     */
     getDayType(){
        if(this.isProvide()){
            return this.obj.DayType__c || '';
        }else{
            return '';
        }
    }
    /**
     * 時間単位休フラグ
     * @parma {boolean} flag
     * @returns {boolean|string} flag=trueの場合は○か''で返す
     */
    isHourlyPaidLeave(flag){
        const v = this.obj.HourlyPaidLeaveFlag__c;
        if(flag){
            return (v ? '○' : '');
        }
        return (v || false);
    }
    /**
     * 説明
     * @returns {string}
     */
    getDescription(){
        if(this.obj.EmpApplyId__r){
            return this.obj.EmpApplyId__r.Name;
        }else{
            return this.obj.Description__c || '';
        }
    }
    /**
     * 休暇型
     * @returns {string|null}
     */
    getHolidayRange(){
        return (this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.HolidayId__r && this.obj.EmpApplyId__r.HolidayId__r.Range__c) || null;
    }
    /**
     * 対象年度
     * @returns {string}
     */
    getAdjustYear(){
        const y = this.obj.AdjustYear__c;
        const sn = this.obj.AdjustYearSubNo__c;
        if(y){
            return '' + y + (sn ? '(' + (sn + 1) + ')' : '');
        }
        return '';
    }
    /**
     * マイナス対象ID
     * @returns {string}
     */
    getAdjustTargetId(){
        return this.obj.AdjustTargetId__c || '';
    }
    getAdjustTargetStartDate(fmt){
        const sd = (this.obj.AdjustTargetId__r && this.obj.AdjustTargetId__r.StartDate__c) || null;
        return (sd ? Util.formatDate(sd, fmt) : '');
    }
    getAdjustTargetEndDate(fmt){
        const ed = (this.obj.AdjustTargetId__r && this.obj.AdjustTargetId__r.EndDate__c) || null;
        return (ed ? Util.formatDate(ed, fmt) : '');
    }
    /**
     * マイナス対象選択肢用の書式に変換
     * @param {number|null} days 
     * @param {number|null} minutes 
     * @param {string} startDate 
     * @param {string} endDate 
     * @returns {string}
     */
    formatTargetName(days, minutes, startDate, endDate){
        return Util.formatDaysAndHours(days || 0, minutes || 0)
            + `（${Util.formatDate(startDate, 'YYYY/MM/DD')}～${Util.formatDate(endDate, 'YYYY/MM/DD')}）`;
    }
    /**
     * マイナス対象選択肢
     * @returns {string}
     */
    getTargetName(){
        return this.formatTargetName(this.getProvideDays(), this.getProvideTime(), this.getStartDate(), this.getEndDate());
    }
    /**
     * マイナス対象
     * @returns {string}
     */
    getAdjustTargetName(){
        const at = this.obj.AdjustTargetId__r;
        if(at){
            return this.formatTargetName(at.ProvideDays__c || 0, at.ProvideTime__c || 0, at.StartDate__c, at.EndDate__c);
        }else{
            return '';
        }
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
    /**
     * 関連するマイナス付与データが存在する
     * @returns {boolean}
     */
    isAdjusted(){
        return (this.obj.AdjustTarget__r && this.obj.AdjustTarget__r.length ? true : false);
    }
}