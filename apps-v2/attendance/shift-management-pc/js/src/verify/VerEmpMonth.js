teasp.provide('teasp.verify.VerEmpMonth');
/**
 *
 */
teasp.verify.VerEmpMonth = function(){
    this.record = null;
    this.errorId = null;
};

teasp.verify.VerEmpMonth.prototype.setErrorId = function(errorId){
    this.errorId = errorId;
};

teasp.verify.VerEmpMonth.prototype.getRecord = function(){
    return this.record;
};

teasp.verify.VerEmpMonth.getRequest = function(param){
    if(!param.monthId){
        return null;
    }
    var soql = teasp.message.format(
            "select {0} from AtkEmpMonth__c where Id = '{1}'"
            , teasp.verify.VerDef.getNames(teasp.verify.VerDef.EmpMonthFields)
            , param.monthId);
    return { funcName: 'getExtResult', params: { soql: soql, limit: 1, offset: 0 } };
};

/**
 *
 */
teasp.verify.VerEmpMonth.prototype.getEmpMonth = function(param, onSuccess, onFailure){
    if(this.record){
        onSuccess();
    }else if(!param.monthId){
        onFailure('勤怠月次ID がありません');
    }else{
        teasp.action.contact.remoteMethods(
            [teasp.verify.VerEmpMonth.getRequest(param)],
            { errorAreaId: this.errorId, nowait: true },
            function(result){
                if(result.result == 'NG'){
                    onFailure(result);
                }else{
                    this.record = (result.records && result.records.length > 0 ? result.records[0] : null);
                    onSuccess();
                }
            },
            null,
            this
        );
    }
};
