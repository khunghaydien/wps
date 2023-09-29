import {EmpLeaveManage}      from "./EmpLeaveManage.js?v=XVERSIONX";
/**
 * 社員休暇管理クラスのインスタンスの配列を持つクラス
 */
export class EmpLeaveManages {
    constructor(){
        this.elms = null; // nullはデータ未採取を示す
    }
    /**
     * 未採取ならtrue、採取済みならfalseを返す
     * @returns {boolean}
     */
    isEmpty(){
        return this.elms ? false : true;
    }
    /**
     * 未採取に戻す
     */
    setEmpty(){
        this.elms = null;
    }
    /**
     * レコードの配列から EmpLeaveManageクラスのインスタンスを生成して保持
     * ※ 表示用にソートする
     * @param {Array.<Object>} records 
     */
    setRecords(records){
        this.elms = [];
        (records || []).forEach((record) => {
            this.elms.push(new EmpLeaveManage(record));
        });
        this.elms = this.elms.sort((a, b) => {
            return a.compare(b);
        });
    }
    /**
     * idに該当するインスタンスを返す
     * @param {string|null} id 
     * @returns {EmpLeaveManage}
     */
    getById(id){
        if(!id){ return null; }
        const elms = this.elms.filter((elm) => { return (elm.getId() == id); });
        return (elms.length ? elms[0] : null);
    }
    /**
     * holidayGroupとpcTypeで絞り込んだ配列を返す
     * @param {HolidayGroup|null} holidayGroup 
     * @param {string|null} pcType 
     * @returns {Array.<EmpLeaveManage>}
     */
    getByHolidyGroupAndPcType(holidayGroup, pcType){
        return this.elms.filter((elm) => {
            return (!holidayGroup || elm.isSameGroup(holidayGroup))
                && (!pcType || elm.getPcType() == pcType);
        });
    }
}