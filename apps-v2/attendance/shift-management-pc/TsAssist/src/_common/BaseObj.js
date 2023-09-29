import {Util}           from "./Util.js?v=XVERSIONX";
/**
 * BaseObj クラス
 */
export class BaseObj {
    constructor(obj){
        this.obj = obj;
        this.obj.CreatedDate      = Util.formatDateTime(this.obj.CreatedDate);
        this.obj.LastModifiedDate = Util.formatDateTime(this.obj.LastModifiedDate);
    }
    getObj(){
        return this.obj;
    }
    getId(){
        return this.obj.Id;
    }
    getName(){
        return this.obj.Name;
    }
    getCreatedDate(){
        return this.obj.CreatedDate;
    }
    getLastModifiedDate(){
        return this.obj.LastModifiedDate;
    }
}