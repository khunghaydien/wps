import {MonthlyLeaveBalance}      from "./MonthlyLeaveBalance.js?v=XVERSIONX";
/**
 * 月次休暇残高クラスのインスタンスの配列を持つクラス
 */
export class MonthlyLeaveBalances {
    constructor(){
        this.mlbs = null; // nullはデータ未採取を示す
    }
    /**
     * 未採取ならtrue、採取済みならfalseを返す
     * @returns {boolean}
     */
    isEmpty(){
        return this.mlbs ? false : true;
    }
    /**
     * 未採取に戻す
     */
    setEmpty(){
        this.mlbs = null;
    }
    /**
     * データをセット
     * @param {Array.<Object>} records 
     */
    setRecords(records){
        this.mlbs = [];
        (records || []).forEach((record) => {
            this.mlbs.push(new MonthlyLeaveBalance(record));
        });
    }
    /**
     * idに該当するインスタンスを返す
     * @param {string|null} id 
     * @returns {MonthlyLeaveBalance}
     */
    getById(id){
        if(!id){ return null; }
        const mlbs = this.mlbs.filter((mlb) => { return (mlb.getId() == id); });
        return (mlbs.length ? mlbs[0] : null);
    }
    /**
     * holidayGroupとpcTypeで絞り込んだ配列を返す
     * @param {HolidayGroup|null} holidayGroup 
     * @param {string|null} pcType 
     * @returns {boolean}
     */
    getByHolidyGroupAndPcType(holidayGroup, pcType){
        return this.mlbs.filter((mlb) => {
            return (!holidayGroup || mlb.isSameGroup(holidayGroup))
                && (!pcType || mlb.getPcType() == pcType);
        });
    }
}