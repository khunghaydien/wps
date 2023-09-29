teasp.provide('teasp.verify.VerEmpDays');
/**
 *
 */
teasp.verify.VerEmpDays = function(){
    this.records = null;
    this.errorId = null;
};

teasp.verify.VerEmpDays.prototype.setErrorId = function(errorId){
    this.errorId = errorId;
};

teasp.verify.VerEmpDays.prototype.getRecords = function(){
    return this.records;
};

teasp.verify.VerEmpDays.getRequest = function(param){
    if(!param.monthId){
        return null;
    }
    var soql = teasp.message.format(
            "select {0} from AtkEmpDay__c where EmpMonthId__c = '{1}'"
            , teasp.verify.VerDef.getNames(teasp.verify.VerDef.EmpDayFields)
            , param.monthId);
    return { funcName: 'getExtResult', params: { soql: soql, limit: 60, offset: 0 } };
};

/**
 *
 */
teasp.verify.VerEmpDays.prototype.getEmpDays = function(param, onSuccess, onFailure){
    if(this.records){
        onSuccess();
    }else if(!param.monthId){
        onFailure('勤怠月次ID がありません');
    }else{
        teasp.action.contact.remoteMethods(
            [teasp.verify.VerEmpDays.getRequest(param)],
            { errorAreaId: this.errorId, nowait: true },
            function(result){
                if(result.result == 'NG'){
                    onFailure(result);
                }else{
                    this.records = (result.records || []).sort(function(a, b){
                        return (a.Date__c < b.Date__c ? -1 : 1);
                    });
                    onSuccess();
                }
            },
            null,
            this
        );
    }
};
