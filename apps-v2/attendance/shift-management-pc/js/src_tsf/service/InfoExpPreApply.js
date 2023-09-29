/**
 * 経費事前申請情報のサービスクラス
 *
 * @constructor
 */
teasp.Tsf.InfoExpPreApply = function(){
};

teasp.Tsf.InfoExpPreApply.prototype = new teasp.Tsf.InfoBase();

/**
 * 新規の経費事前申請のインスタンスを作成
 *
 * @returns {Object}
 */
teasp.Tsf.InfoExpPreApply.prototype.createObject = function(view){
    if(!tsfManager.isEmpTargetMode()){
        // ターゲット社員を自分にする
        this.setTargetSessionEmp();
    }

    var o = {
        Id          : null,
        EmpId__c    : this.getEmpId(),
        EmpId__r    : {
            EmpCode__c      : this.getEmpCode(),
            Name            : this.getEmpName(),
            ExpItemClass__c : this.getEmpExpItemClass(),
            UserId__r : {
                SmallPhotoUrl : this.getSmallPhotoUrl()
            }
        },
        DeptId__c    : this.getDeptId(),
        DeptId__r    : this.getDept(),
        Status__c   : '未確定'
    };
    var conf = this.getExpPreApplyConfigByView(view);
    o.Type__c     = conf.key;
    o.instantFlag = conf.instant || false;

    // 申請情報の初期値をセット
    if(this.isUsePayMethod(o.Type__c)){ // 精算方法を使う
        o.PayExpItemId__c = this.getPayExpItemId();
    }
    if(this.isUseApplyDate(o.Type__c) || o.Type__c == teasp.constant.EXP_PRE_FORM4){ // 申請日を使うまたは仮払申請
        o.ApplyDate__c = teasp.util.date.formatDate(teasp.util.date.getToday());
    }
    if(this.isUseChargeDept(o.Type__c)){ // 負担部署を使う
        o.ChargeDeptId__c = this.getDeptId();
    }

    var p = new teasp.Tsf[tsfManager.getTarget()](o);
    p.setRights(teasp.constant.P_E|teasp.constant.P_ME);
    this.objects.push(p);
    return p;
};

teasp.Tsf.InfoExpPreApply.prototype.getExpCouponList      = function(){ return this.common.getExpCouponList(); };
teasp.Tsf.InfoExpPreApply.prototype.getExpPreApplyConfigs = function(){ return this.common.getExpPreApplyConfigs(); };

teasp.Tsf.InfoExpPreApply.prototype.getExpPreApplyConfigByName = function(name){
    return this.common.getExpPreApplyConfigByName(name);
};

teasp.Tsf.InfoExpPreApply.prototype.getExpPreApplyConfigByView = function(view){
    return this.common.getExpPreApplyConfigByView(view);
};

teasp.Tsf.InfoExpPreApply.prototype.submitApply = function(form, id, req, callback){
    var obj = null;

    if(tsfManager.checkDiff()){
        var data = form.getDomValues();
        obj = data.values[0];
        obj.days = (data.ExpPreApplyDay__r && data.ExpPreApplyDay__r.values) || [];
        obj.exps = (data.EmpExp__r         && data.EmpExp__r.values        ) || [];
    }
    var arg = {
        method       : 'submitExpPreApply',
        id           : id,
        comment      : req.comment || null,
        expPreApply  : obj
    };
    console.log('[InfoExpPreApply.submitApply] submitExpPreApply');
    console.log(arg);

    tsfManager.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                this.removeObject([{ Id: null }]); // いらなくなったレコードを削除
                callback(true, result);
            }else{
                tsfManager.loading.hide(); // お待ちくださいオフ
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.InfoExpPreApply.prototype.cancelApply = function(obj, req, callback){
    var arg = {
        method            : 'cancelExpPreApply',
        id                : obj.id,
        cancelApplyId     : obj.cancelApplyId,
        isCancelApplyWait : obj.isCancelApplyWait,
        comment           : req.comment || null
    };
    console.log('[InfoExpPreApply.cancelApply] cancelExpPreApply');
    console.log(arg);

    tsfManager.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result.id);
            }else{
                tsfManager.loading.hide(); // お待ちくださいオフ
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.InfoExpPreApply.prototype.approveApply = function(form, obj, flag, callback){
    var arg = {
        method            : (flag ? 'approveExpPreApply' : 'rejectExpPreApply'),
        id                : obj.id,
        cancelApplyId     : obj.cancelApplyId,
        isCancelApplyWait : obj.isCancelApplyWait,
        comment           : obj.comment || null
    };
    console.log('[InfoExpPreApply.approveApply] ' + arg.method);
    console.log(arg);

    tsfManager.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result.id);
            }else{
                tsfManager.loading.hide(); // お待ちくださいオフ
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};
