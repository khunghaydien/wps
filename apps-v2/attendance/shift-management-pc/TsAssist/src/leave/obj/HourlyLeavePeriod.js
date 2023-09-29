import {Util}      from "../../_common/Util.js?v=XVERSIONX";
/**
 * 時間単位有休用の年度と期間のクラス
 */
export class HourlyLeavePeriod {
    constructor(record){
        this.year = record.year;
        this.subNo = record.subNo;
        this.startDate = record.startDate;
        this.endDate = record.endDate;
        this.yearDisplay = `${this.year}${(this.subNo ? '('+(this.subNo+1)+')' : '')} (${Util.formatDate(this.startDate, 'YYYY/MM/DD')}～${Util.formatDate(this.endDate, 'YYYY/MM/DD')})`;
        this.yearValue = `${this.year}${(this.subNo ? '_' + this.subNo : '')}`;
    }
    /**
     * 表示用の年度
     * @returns {string}
     */
    getYearDisplay(){
        return this.yearDisplay;
    }
    /**
     * 識別用の年度
     * @returns {string}
     */
    getYearValue(){
        return this.yearValue;
    }
    /**
     * 年度
     * @returns {number}
     */
    getYear(){
        return this.year;
    }
    /**
     * 年度サブナンバー
     * @returns {number|null}
     */
    getSubNo(){
        return this.subNo || null;
    }
    /**
     * 期間開始日
     * @returns {string}
     */
    getStartDate(){
        return this.startDate;
    }
    /**
     * 期間終了日
     * @returns {string}
     */
    getEndDate(){
        return this.endDate;
    }
}