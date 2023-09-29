/**
 * 経費申請情報のサービスクラス
 *
 * @constructor
 */
teasp.Tsf.InfoExpApply = function(){
};

teasp.Tsf.InfoExpApply.prototype = new teasp.Tsf.InfoBase();

teasp.Tsf.InfoExpApply.prototype.init = function(res){
    teasp.Tsf.InfoBase.prototype.init.call(this, res);

    this.expApplys = teasp.Tsf.ExpApply.createList(res.expApplys);
};

teasp.Tsf.InfoExpApply.prototype.isValid = function(id){
    return true;
//    return teasp.Tsf.InfoBase.prototype.isValid.call(this, id);
};

/**
 * スタート画面に申請一覧を表示するかどうかを判断する
 *
 * @param {string|null} argId 引数で指定されたID
 * @param {boolean} hasArgId 引数を ID で指定したかどうか。argId==null で hasArgId==true なら、null 指定
 * @returns {string|null} null以外=申請一覧、null=申請一覧ではない
 */
teasp.Tsf.InfoExpApply.prototype.getStartView = function(argId, hasArgId){
    if(argId || hasArgId){
        return null;
    }
    var config = this.common.getExpPreApplyConfigs();
    return (config.expApply.startFromList ? teasp.Tsf.Manager.EXP_LIST_VIEW : null);
};

/**
 * 未申請明細画面の承認申請ボタンを非表示にする
 * @returns {boolean}
 */
teasp.Tsf.InfoExpApply.prototype.isHiddenApplyBtn = function(){
    var config = this.common.getExpPreApplyConfigs();
    return config.expApply.hiddenApplyBtn;
};

/**
 * 未申請明細に精算開始ボタンを配置
 * 「承認申請ボタンを非表示にする」オンをAND条件とする
 * @returns {boolean}
 */
teasp.Tsf.InfoExpApply.prototype.isApplyByDetails = function(){
    return this.isHiddenApplyBtn();
};

/**
 *
 * @param {boolean} flag =true の場合は、新規作成でヘッダあり
 * @returns {Object}
 */
teasp.Tsf.InfoExpApply.prototype.newObject = function(flag){
    return {
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
        Status__c   : null,
        createFlag : (flag || false)
    };
};

/**
 * 新規の経費申請のインスタンスを作成
 *
 * @returns {Object}
 */
teasp.Tsf.InfoExpApply.prototype.createObject = function(view, flag){
    var o = this.newObject(flag);

    // 申請情報の初期値をセット
    if(this.isUsePayMethod(teasp.constant.EXP_FORM0)){ // 精算方法
        o.PayExpItemId__c = this.getPayExpItemId();
    }
    if(this.isUseApplyDate(teasp.constant.EXP_FORM0)){ // 申請日
        o.ApplyDate__c = teasp.util.date.formatDate(teasp.util.date.getToday());
    }
    if(this.isUseChargeDept(teasp.constant.EXP_FORM0)){ // 負担部署
        o.ChargeDeptId__c = this.getDeptId();
    }

    var p = new teasp.Tsf[tsfManager.getTarget()](o);
    p.setRights(teasp.constant.P_E|teasp.constant.P_ME);
    this.objects.push(p);
    return p;
};

/**
 * 経費申請履歴のIDと申請番号を持つオブジェクトのリストを返す
 *
 * @returns {Array.<Object>}
 */
teasp.Tsf.InfoExpApply.prototype.getExpApplyNoList = function(){
    var lst = [];
    dojo.forEach(this.expApplys, function(expApply){
        lst.push({
            id      : expApply.getId(),
            applyNo : expApply.getApplyNo()
        });
    });
    return lst;
};

/**
 * 検索該当リストからターゲットオブジェクトのインスタンスを生成して配列に格納する
 *
 * @param {Object} obj
 * @returns {Object}
 */
teasp.Tsf.InfoExpApply.prototype.setRecords = function(obj, id){
    teasp.Tsf.EmpExp.convertExps(obj.exps);
    if(!obj.records){
        var o = this.newObject();
        o.EmpExp__r = obj.exps || [];
        obj.records = [o];
    }else{
        teasp.Tsf.InfoBase.margeExpRelation(obj.records, obj.exps);
        // J'sNAVI Jrデータを格納する
        obj.records[0].JsNaviData = {};
        obj.records[0].JsNaviData.ReserveData  = obj.jsnaviReserveList  || [];
        obj.records[0].JsNaviData.ActualData   = obj.jsnaviActualList   || [];

        // #7381、#7415
        obj.records[0].JsNaviData.message = obj.message || [];

        obj.records[0].JsNaviData.isPossibilityNewActualDataDelivered =
            obj.isPossibilityNewActualDataDelivered || false;
    }
    if(obj.expPreApplys){
        console.log('=======================');
        console.log(obj.expPreApplys);
        teasp.Tsf.InfoBase.margeExpRelation(obj.expPreApplys, obj.expPreApplyExps);
    }
    // 申請番号のプルダウン用のリスト作成
    if(obj.expApplys){
        this.expApplys = teasp.Tsf.ExpApply.createList(obj.expApplys, id);
    }
    // フルレコードインスタンスの配列を作成
    this.objects = teasp.Tsf.ObjBase.merge(this.objects || [], teasp.Tsf.ObjBase.createList(obj.target, obj.records, obj.rights, obj.piwks, obj.steps));

    this.setTargetEmp(obj.targEmp);
    this.setCacheDeptByRecords(obj.records);
    this.setCacheProvisByRecords(obj.records);
    this.setExpPreApplys(obj);

    return (this.isValid(id) ? this.getObjById(this.objects, id) : null);
};

teasp.Tsf.InfoExpApply.prototype.setExpPreApplys = function(obj){
    var lst = obj.expPreApplys || [];
    lst = teasp.Tsf.ObjBase.createList('AtkExpPreApply__c', lst);
    // 事前申請情報を結合
    dojo.forEach(this.objects, function(o){
        for(var i = 0 ; i < lst.length ; i++){
            var p = lst[i];
            if(o.getExpPreApplyId() == p.getId()){
                o.setExpPreApply(p);
                break;
            }
        }
    }, this);
};

teasp.Tsf.InfoExpApply.prototype.submitApply = function(form, id, req, callback){
    var ids = [];
    dojo.forEach(req.ids, function(id){
        ids.push({ id: id });
    });

    var arg = {
        method      : 'submitExpApply',
        empId       : tsfManager.getEmpId(),
        expApplyId  : id,
        details     : ids,
        comment     : req.comment || null,
        ringiId     : req.ringiId || null,
        expApply    : req.expApply || null
    };
    console.log('[InfoExpApply.submitApply] submitExpApply');
    console.log(arg);

    tsfManager.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                var id = result.expApplyId;
                if(!id){
                    id = ((result.expLogs && result.expLogs.length > 0) ? result.expLogs[0].ExpApplyId__r.Id : null);
                }
                if(result.expApplys){
                    this.expApplys = teasp.Tsf.ExpApply.createList(result.expApplys, id);
                }
                callback(true, { id: id });
            }else{
                tsfManager.loading.hide(); // お待ちくださいオフ
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.InfoExpApply.prototype.cancelApply = function(obj, req, callback){
    var arg = {
        method            : 'cancelExpApply',
        empId             : tsfManager.getEmpId(),
        expApplyId        : obj.id,
        cancelApplyId     : obj.cancelApplyId,
        isCancelApplyWait : obj.isCancelApplyWait,
        comment           : req.comment || null
    };
    var mId = (req.solve ? null : obj.id);
    console.log('[InfoExpApply.cancelApply] cancelExpApply');
    console.log(arg);

    tsfManager.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                if(result.expApplys){
                    this.expApplys = teasp.Tsf.ExpApply.createList(result.expApplys, mId);
                }
                callback(true, mId);
            }else{
                tsfManager.loading.hide(); // お待ちくださいオフ
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.InfoExpApply.prototype.approveApply = function(form, obj, flag, callback){
    var arg = {
        method  : (flag ? 'approveExpApply' : 'rejectExpApply'),
        approve : (flag ? true : false),
        comment : obj.comment || null,
        apply   : [{
            id                : obj.id,
            cancelApplyId     : obj.cancelApplyId,
            isCancelApplyWait : obj.isCancelApplyWait
        }]
    };
    console.log('[InfoExpApply.approveApply] ' + arg.method);
    console.log(arg);

    tsfManager.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                if(result.expApplys){
                    this.expApplys = teasp.Tsf.ExpApply.createList(result.expApplys, obj.id);
                }
                callback(true, obj.id);
            }else{
                tsfManager.loading.hide(); // お待ちくださいオフ
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};
