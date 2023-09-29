import {Util}      from "../../_common/Util.js?v=XVERSIONX";
import {BaseObj}   from "../../_common/BaseObj.js?v=XVERSIONX";
/**
 * Empクラス
 */
export class Emp extends BaseObj {
    constructor(obj){
        super(obj);
        this.obj.EntryDate__c = Util.formatDate(this.obj.EntryDate__c);
        this.obj.EndDate__c   = Util.formatDate(this.obj.EndDate__c);
        this.obj.NextYuqProvideDate__c = Util.formatDate(this.obj.NextYuqProvideDate__c);
    }
    getCode(){
        return this.obj.EmpCode__c || '';
    }
    getNextYuqProvideDate(fmt){
        return Util.formatDate(this.obj.NextYuqProvideDate__c || '', fmt);
    }
    getEntryDate(fmt){
        return Util.formatDate(this.obj.EntryDate__c || '', fmt);
    }
    getEndDate(fmt){
        return Util.formatDate(this.obj.EndDate__c || '', fmt);
    }
}