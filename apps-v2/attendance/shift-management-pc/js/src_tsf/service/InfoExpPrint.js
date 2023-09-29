/**
 * 経費精算印刷のサービスクラス
 *
 * @constructor
 */
teasp.Tsf.InfoExpPrint = function(){
};

teasp.Tsf.InfoExpPrint.prototype = new teasp.Tsf.InfoExpApply();

teasp.Tsf.InfoExpPrint.prototype.approveApply = function(form, obj, flag, callback){
    console.log(obj);
    var info = null;
    if(tsfManager.getCurrentFormType()){
        info = new teasp.Tsf.InfoExpPreApply();
    }else{
        info = new teasp.Tsf.InfoExpApply();
    }
    info.approveApply(form, obj, flag, callback);
};

teasp.Tsf.InfoExpPrint.prototype.setRecords = function(obj, id){
    if(!id && !obj.target){
        obj.target = 'AtkExpApply__c';
    }
    teasp.Tsf.InfoBase.mergeExpJsNaviRelation(obj.records,obj.jsnaviReserveList);
    return teasp.Tsf.InfoExpApply.prototype.setRecords.call(this, obj, id);
};
