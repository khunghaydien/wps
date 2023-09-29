import {BaseObj}        from "../../_common/BaseObj.js?v=XVERSIONX";
/**
 * 休暇グループクラス
 */
export class HolidayGroup extends BaseObj {
    constructor(obj){
        super(obj);
    }
    /**
     * 休暇種別
     * @returns {string}
     */
    getType(){
        return this.obj.Type__c || '';
    }
    /**
     * 日数管理
     * @returns {boolean}
     */
    isDaysManage(){
        return this.obj.DaysManage__c || false;
    }
    /**
     * 休暇グループ＝年次有給休暇
     * @returns {boolean}
     */
    isTypeA(){
        return (this.obj.Type__c == 'A');
    }
    /**
     * 休暇グループ＝時間単位有休制限
     * @returns {boolean}
     */
    isTypeH(){
        return (this.obj.Type__c == 'H');
    }
    /**
     * 休暇グループ＝代休
     * @returns {boolean}
     */
    isTypeS(){
        return (this.obj.Type__c == 'S');
    }
    /**
     * 休暇グループ＝ユーザ定義の日数管理休暇グループ
     * @returns {boolean}
     */
    isTypeU(){
        return (this.obj.Type__c == 'U');
    }
}