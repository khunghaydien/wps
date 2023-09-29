import {HourlyLeavePeriod} from "./HourlyLeavePeriod.js?v=XVERSIONX";
/**
 * Empクラス
 */
export class HourlyLeavePeriods {
    constructor(tsaMain, leaveManager, empId){
        this.tsaMain = tsaMain;
        this.leaveManager = leaveManager;
        this.empId = empId;
        this.periods = null;
    }
    get domH(){ return this.tsaMain.domH; }

    /**
     * UIブロック
     * @param {boolean} flag 
     * @param {string} message 
     */
    blockingUI(flag, message){
        this.tsaMain.blockingUI(flag, message);
    }
    /**
     * レコードの配列から年度・期間クラスのインスタンスを生成して保持
     * @param {Array.<Object>} records 
     */
    setRecords(records){
        this.periods = [];
        records.forEach((record) => {
            this.periods.push(new HourlyLeavePeriod(record));
        });
    }
    /**
     * データ格納済み
     * @returns {boolean}
     */
    isStandby(){
        return (this.periods ? true : false);
    }
    /**
     * データ格納前にする
     */
    clear(){
        this.periods = null;
    }
    /**
     * データ読み込み
     * @param {Function} callback 
     */
    fetch(callback){
        if(this.periods){
            callback(true);
            return;
        }
        this.blockingUI(true);
        this.leaveManager.getHourlyPaidLeavePeriods(this.empId).then((ranges) => {
            this.setRecords(ranges);
            callback(true);
        }).catch((errobj) => {
            callback(false, this.msgH.parseErrorMessage(errobj));
        }).then(() => {
            this.blockingUI(false);
        });
    }
    /**
     * 年度・期間を返す
     * @param {string} yearValue 
     * @returns {HourlyLeavePeriod|null}
     */
    getPeriodByYearValue(yearValue){
        if(!yearValue){
            return null;
        }
        const ps = this.periods.filter((period) => { return period.getYearValue() == yearValue; });
        return (ps.length ? ps[0] : null);
    }
    /**
     * 選択リストに年度・期間の選択肢をセット
     * @param {DOM} select 
     * @param {HourlyLeavePeriod} defaultPeriod 
     * @param {Function} callback 
     */
    fillPulldown(select, defaultPeriod, callback){
        if(defaultPeriod){
            this.domH.empty(select);
            this.domH.create('option', { value:defaultPeriod.getYearValue(), textContent:defaultPeriod.getYearDisplay() }, select);
            select.value = defaultPeriod.getYearValue();
            return;
        }
        this.fetch((flag, errmsg) => {
            if(flag){
                this.domH.empty(select);
                this.domH.create('option', { textContent:'', value:'' }, select);
                let exist = false;
                this.periods.forEach((period) => {
                    this.domH.create('option', { value:period.getYearValue(), textContent:period.getYearDisplay() }, select);
                    if(defaultPeriod && period.getYearValue() == defaultPeriod.getYearValue()){
                        exist = true;
                    }
                });
                if(defaultPeriod){
                    if(!exist){
                        this.domH.create('option', { value:defaultPeriod.getYearValue(), textContent:defaultPeriod.getYearDisplay() }, select);
                    }
                    select.value = defaultPeriod.getYearValue();
                }
                callback(true);
            }else{
                callback(false, errmsg);
            }
        });
    }
}