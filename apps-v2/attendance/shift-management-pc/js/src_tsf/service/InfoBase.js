/**
 * オブジェクト・セクションクラス
 *
 * @constructor
 */
teasp.Tsf.InfoBase = function(res){
};

teasp.Tsf.InfoBase.prototype.init = function(res){
    teasp.util.excludeNameSpace(res);
    teasp.Tsf.util.console(res);
    this.loadRes = res;
    this.common         = new teasp.Tsf.Common(res.common);
    this.targetEmp      = new teasp.Tsf.Emp(res.targEmp);
    this.sessionEmp     = new teasp.Tsf.Emp(res.selfEmp);
    this.sessionUser    = new teasp.Tsf.User(res.sessionUser);
    this.depts          = teasp.Tsf.Dept.createList(res.depts || []);
    this.expItems       = teasp.Tsf.ExpItem.createList(res.expItems || [], false, false);
    this.payItems       = teasp.Tsf.ExpItem.createList(res.expItems || [], true , false);
    this.foreigns       = teasp.Tsf.ForeignCurrency.createList(res.foreigns || []);
    this.zgAccounts     = teasp.Tsf.ZGAccount.createList(res.zgAccounts || []);
    this.atkApplyTypeList = teasp.Tsf.Fp.createPickList(res.atkApplyTypeList || [], true);
    this.borderRevNo    = res.borderRevNo || null;
    this.privateOption  = (res.privateOptions && res.privateOptions.length > 0 && res.privateOptions[0]) || {};
    this.objects        = [];
    this.rights         = res.rights || 0;
    this.createCacheDept();
    this.patchDef();
    this.usingJsNaviFlag = res.usingJsNaviSystem || false;
    this.usingConnectICforPitTouchExpense = (res.usingPitTouchSystem && res.usingConnectICforPitTouchExpense) || false;
};

teasp.Tsf.InfoBase.prototype.setTargetEmp = function(emp){
    this.targetEmp = new teasp.Tsf.Emp(emp);
};

/**
 * 対象社員を自分にする。
 * すでに対象社員＝＝自分なら何もしない
 *
 */
teasp.Tsf.InfoBase.prototype.setTargetSessionEmp = function(){
    if(this.targetEmp.getEmpId() == this.sessionEmp.getEmpId()){
        return;
    }
    this.targetEmp = this.sessionEmp.clone();
};

teasp.Tsf.InfoBase.prototype.isValid = function(id){
    return (id ? true : false);
};

/**
 * 配列からIDが合致するオブジェクトを検索して返す
 *
 * @param {Array.<Object>} lst
 * @param {string} id
 * @returns {Object|null}
 */
teasp.Tsf.InfoBase.prototype.getObjById = function(lst, id){
    for(var i = 0 ; i < lst.length ; i++){
        var o = lst[i];
        if(o.equalId(id)){
            return o;
        }
    }
    return null;
};

/**
 * 経費事前申請のインスタンスを作成
 *
 * @returns {Object}
 */
teasp.Tsf.InfoBase.prototype.createObject = function(view){
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
        Status__c   : null
    };
    if(tsfManager.getTarget() == teasp.Tsf.Manager.EXP_PRE_APPLY){
        var conf = this.getExpPreApplyConfigByView(view);
        o.Type__c     = conf.key;
        o.instantFlag = conf.instant || false;
    }
    var p = new teasp.Tsf[tsfManager.getTarget()](o);
    p.setRights(teasp.constant.P_E|teasp.constant.P_ME);
    this.objects.push(p);
    return p;
};

/**
 * 経費事前申請を削除
 *
 * @param {Array.<string>} idList
 */
teasp.Tsf.InfoBase.prototype.removeObject = function(idList){
    for(var i = this.objects.length - 1 ; i >= 0 ; i--){
        for(var x = 0 ; x < idList.length ; x++){
            if(this.objects[i].getId() == idList[x].Id){
                this.objects.splice(i, 1);
                break;
            }
        }
    }
};

/**
 * 検索該当リストからターゲットオブジェクトのインスタンスを生成して配列に格納する
 *
 * @param {Object} obj
 * @returns {Object}
 */
teasp.Tsf.InfoBase.prototype.setRecords = function(obj, id){
    teasp.Tsf.EmpExp.convertExps(obj.exps);
    teasp.Tsf.InfoBase.margeExpRelation(obj.records, obj.exps);
    teasp.Tsf.InfoBase.mergeExpJsNaviRelation(obj.records, obj.jsnaviReserveList);
    this.objects = teasp.Tsf.ObjBase.merge(this.objects || [], teasp.Tsf.ObjBase.createList(obj.target, obj.records, obj.rights, obj.piwks, obj.steps));
    this.setTargetEmp(obj.targEmp);
    this.setCacheDeptByRecords(obj.records);
    return (id ? this.getObjById(this.objects, id) : null);
};

/**
 * 添付ファイルの有無をセット
 *
 * @param {string} expLogId 経費明細ID
 * @param {boolean} flag
 */
teasp.Tsf.InfoBase.prototype.setAttachmentExist = function(expLogId, flag){
    dojo.forEach(this.objects, function(o){
        var exps = o.getEmpExps();
        for(var i = 0 ; i < exps.length ; i++){
            var exp = exps[i];
            if(exp.Id == expLogId){
                if(flag){
                    if(!exp.Attachments){
                        exp.Attachments = [];
                    }
                    exp.Attachments.push({ Id: 'DUMMY' }); // ダミーのIDをセット
                }else{
                    exp.Attachments = null;
                }
                break;
            }
        }
    }, this);
};

/**
 * 費目を返す
 *
 * @param {string} id
 * @returns {teasp.Tsf.ExpItem|null}
 */
teasp.Tsf.InfoBase.prototype.getExpItemById = function(id){
    for(var i = 0 ; i < this.expItems.length ; i++){
        if(this.expItems[i].getId() == id){
            return this.expItems[i];
        }
    }
    return null;
};

/**
 * 費目を返す
 * @param {string} itemCode
 * @returns {teasp.Tsf.ExpItem|null}
 */
teasp.Tsf.InfoBase.prototype.getExpItemByItemCode = function(itemCode){
    for(var i = 0 ; i < this.expItems.length ; i++){
        if(this.expItems[i].getItemCode() == itemCode){
            return this.expItems[i];
        }
    }
    return null;
};

/**
 * 精算用費目を返す
 *
 * @param {string} id
 * @returns {teasp.Tsf.ExpItem|null}
 */
teasp.Tsf.InfoBase.prototype.getPayItemById = function(id){
    for(var i = 0 ; i < this.payItems.length ; i++){
        if(this.payItems[i].getId() == id){
            return this.payItems[i];
        }
    }
    return null;
};

/**
 * 外貨を返す
 *
 * @param {string} id
 * @returns {teasp.Tsf.ForeignCurrency|null}
 */
teasp.Tsf.InfoBase.prototype.getForeignById = function(id){
    var f = null;
    for(var i = 0 ; i < this.foreigns.length ; i++){
        if(!f && !this.foreigns[i].getId()){
            f = this.foreigns[i];
        }
        if(this.foreigns[i].getId() == id){
            return this.foreigns[i];
        }
    }
    return f;
};

teasp.Tsf.InfoBase.prototype.getForeignByName = function(name){
    for(var i = 0 ; i < this.foreigns.length ; i++){
        if(this.foreigns[i].getName() == name){
            return this.foreigns[i];
        }
    }
    return null;
};

teasp.Tsf.InfoBase.prototype.isLoadError = function(){
    return (this.loadRes.result == 'NG');
};

teasp.Tsf.InfoBase.prototype.getLoadError = function(){
    return this.loadRes.error;
};

teasp.Tsf.InfoBase.prototype.getLoadRes            = function(){ return this.loadRes; };

teasp.Tsf.InfoBase.prototype.getSessionUser               = function(){ return this.sessionUser; };
teasp.Tsf.InfoBase.prototype.getSessionEmp                = function(){ return this.sessionEmp; };
teasp.Tsf.InfoBase.prototype.getSessionFullPhotoUrl       = function(){ return this.sessionEmp.getFullPhotoUrl(); };
teasp.Tsf.InfoBase.prototype.getSessionSmallPhotoUrl      = function(){ return this.sessionEmp.getSmallPhotoUrl(); };
teasp.Tsf.InfoBase.prototype.getSessionEmpId              = function(){ return this.sessionEmp.getEmpId(); };
teasp.Tsf.InfoBase.prototype.getSessionEmpCode            = function(){ return this.sessionEmp.getEmpCode(); };
teasp.Tsf.InfoBase.prototype.getSessionEmpName            = function(){ return this.sessionEmp.getEmpName(); };
teasp.Tsf.InfoBase.prototype.getSessionDeptId             = function(){ return this.sessionEmp.getDeptId(); };
teasp.Tsf.InfoBase.prototype.getSessionDeptCode           = function(){ return this.sessionEmp.getDeptCode(); };
teasp.Tsf.InfoBase.prototype.getSessionDeptName           = function(){ return this.sessionEmp.getDeptName(); };
teasp.Tsf.InfoBase.prototype.getSessionEmpTypeName        = function(){ return this.sessionEmp.getEmpTypeName(); };

teasp.Tsf.InfoBase.prototype.getTargetEmp          = function(){ return this.targetEmp; };
teasp.Tsf.InfoBase.prototype.getFullPhotoUrl       = function(){ return this.targetEmp.getFullPhotoUrl(); };
teasp.Tsf.InfoBase.prototype.getSmallPhotoUrl      = function(){ return this.targetEmp.getSmallPhotoUrl(); };
teasp.Tsf.InfoBase.prototype.getEmpId              = function(){ return this.targetEmp.getEmpId(); };
teasp.Tsf.InfoBase.prototype.getEmpCode            = function(){ return this.targetEmp.getEmpCode(); };
teasp.Tsf.InfoBase.prototype.getEmpName            = function(){ return this.targetEmp.getEmpName(); };
teasp.Tsf.InfoBase.prototype.getDeptId             = function(){ return this.targetEmp.getDeptId(); };
teasp.Tsf.InfoBase.prototype.getDept               = function(){ return this.targetEmp.getDept(); };
teasp.Tsf.InfoBase.prototype.getDeptCode           = function(){ return this.targetEmp.getDeptCode(); };
teasp.Tsf.InfoBase.prototype.getDeptName           = function(){ return this.targetEmp.getDeptName(); };
teasp.Tsf.InfoBase.prototype.getEmpTypeName        = function(){ return this.targetEmp.getEmpTypeName(); };
teasp.Tsf.InfoBase.prototype.getStationFromHist    = function(){ return this.targetEmp.getStationHist(); };
teasp.Tsf.InfoBase.prototype.getStationToHist      = function(){ return this.targetEmp.getStationHist(); };
teasp.Tsf.InfoBase.prototype.getEmpExpHistory      = function(){ return this.targetEmp.getExpHistory(); };
teasp.Tsf.InfoBase.prototype.getEmpExpConfig       = function(dt){ return this.targetEmp.getExpConfigEx(dt); };
teasp.Tsf.InfoBase.prototype.getEmpCommuterPasses  = function(){ return this.targetEmp.getCommuterPasses(); };
teasp.Tsf.InfoBase.prototype.getEmpExpItemClass    = function(){ return this.targetEmp.getExpItemClass(); };
teasp.Tsf.InfoBase.prototype.getEmpJobAssigns      = function(){ return this.targetEmp.getJobAssigns(); };
teasp.Tsf.InfoBase.prototype.getEmpUserId          = function(){ return this.targetEmp.getUserId(); };
teasp.Tsf.InfoBase.prototype.getPayExpItemId       = function(){ return this.targetEmp.getPayExpItemId(); };
teasp.Tsf.InfoBase.prototype.getEmpJobSearchCondition = function(){ return this.targetEmp.getEmpJobSearchCondition(); };

teasp.Tsf.InfoBase.prototype.getDepts              = function(){ return this.depts; }; // 部署リストを返す
teasp.Tsf.InfoBase.prototype.getForeigns           = function(){ return this.foreigns; }; // 外貨リストを返す
teasp.Tsf.InfoBase.prototype.getZgAccounts         = function(){ return this.zgAccounts; }; // 全銀口座マスターリストを返す
teasp.Tsf.InfoBase.prototype.getObjects            = function(){ return this.objects; }; // 経費事前申請リストを返す
teasp.Tsf.InfoBase.prototype.getObjectById         = function(id){ return this.getObjById(this.objects, id); };
teasp.Tsf.InfoBase.prototype.getCommon             = function(){ return this.common; };
teasp.Tsf.InfoBase.prototype.getExpCouponList      = function(){ return this.common.getExpCouponList(); };
teasp.Tsf.InfoBase.prototype.getExpPreApplyConfigs = function(){ return this.common.getExpPreApplyConfigs(); };
teasp.Tsf.InfoBase.prototype.getHelpLink           = function(){ return this.common.getHelpLink(); };
teasp.Tsf.InfoBase.prototype.isAllowEditExpAdmin   = function(){ return this.common.isAllowEditExpAdmin(); };
teasp.Tsf.InfoBase.prototype.isAllowEditManager    = function(){ return this.common.isAllowEditManager(); };
teasp.Tsf.InfoBase.prototype.isRequireChargeJob    = function(){ return this.common.isRequireChargeJob(); };
teasp.Tsf.InfoBase.prototype.isRequireChargeDept   = function(){ return this.common.isRequireChargeDept(); };
teasp.Tsf.InfoBase.prototype.getExpCountLimit      = function(){ return this.common.getExpCountLimit(); };
teasp.Tsf.InfoBase.prototype.isExpLinkDocument     = function(){ return this.common.isExpLinkDocument(); };
teasp.Tsf.InfoBase.prototype.isAllowMinusApply     = function(){ return this.common.isAllowMinusApply(); };
teasp.Tsf.InfoBase.prototype.getExpStartDate       = function(){ return this.common.getExpStartDate(); };
teasp.Tsf.InfoBase.prototype.isUseExpApproverSet   = function(){ return this.common.isUseExpApproverSet(); };
teasp.Tsf.InfoBase.prototype.getSocialExpenseItemId= function(){ return this.common.getSocialExpenseItemId(); };
teasp.Tsf.InfoBase.prototype.isRequireNote         = function(key){ return this.common.isRequireNote(key); };
teasp.Tsf.InfoBase.prototype.isDisabledTimeReport  = function(){ return this.common.isDisabledTimeReport(); };
teasp.Tsf.InfoBase.prototype.getExtraItemOutputDataName1  = function(){ return this.common.getExtraItemOutputDataName1(); };
teasp.Tsf.InfoBase.prototype.getExtraItemOutputDataName2  = function(){ return this.common.getExtraItemOutputDataName2(); };
teasp.Tsf.InfoBase.prototype.isUseExpCancelApply   = function(){ return this.common.isUseExpCancelApply(); };
teasp.Tsf.InfoBase.prototype.getJtbExpItems        = function(){ return this.common.getJtbExpItems(); };
teasp.Tsf.InfoBase.prototype.isUseJsNaviDummy      = function(){ return this.common.isUseJsNaviDummy(); }; // JsNAVIダミーを使用

teasp.Tsf.InfoBase.prototype.getAtkApplyTypeList   = function(){ return this.atkApplyTypeList; }; // 稟議の「種別」選択肢

teasp.Tsf.InfoBase.prototype.setEmpExpConfig = function(config){
    return this.targetEmp.setExpConfig(config);
};

/**
 * 領収書入力システムを使用するか
 * @returns
 */
teasp.Tsf.InfoBase.prototype.isUsingReceiptSystem = function(){
    return (this.common.isUsingReceiptSystem() && this.targetEmp.isUsingReceiptSystem());
};

/**
 * J'sNAVI Jrを使用するか
 * @returns
 */
teasp.Tsf.InfoBase.prototype.isUsingJsNaviSystem = function(){
    return (this.usingJsNaviFlag && this.targetEmp.isUsingJsNaviSystem());
};

/**
 * IC連携機能の経費登録機能を使用する
 * @returns
 */
teasp.Tsf.InfoBase.prototype.isUseConnectICExpense = function(){
	// 以下すべてオンの時、使用可とする
	// AtkPrivateOptions__c.UsingConnectICforPitTouch__c
	// AtkPrivateOptions__c.UsingConnectICforPitTouchExpense__c
	// AtkEmp__c.UsingConnectIC__c
	// AtkCommon__c.UseConnectICExpense__c
	return (this.usingConnectICforPitTouchExpense && this.targetEmp.isUsingConnectIC() && this.common.isUseConnectICExpense());
};

/**
 * 電子帳簿保存法スキャナ保存対応機能を使用する
 * @returns
 */
teasp.Tsf.InfoBase.prototype.isUseScannerStorage = function(){
    return this.common.isUseScannerStorage();
};

/**
 * 自分はシステム管理者か
 *
 * @returns {boolean}
 */
teasp.Tsf.InfoBase.prototype.isSysAdmin = function(){
    return this.sessionUser.isSysAdmin();
};

/**
 * 自分はターゲット社員のマネージャか
 *
 * @returns {Boolean}
 */
teasp.Tsf.InfoBase.prototype.isManager = function(){
    return this.sessionUser.getId() == this.getTargetEmp().getManagerId();
};

/**
 * 自分は経費管理者または管理者か
 *
 * @returns {boolean}
 */
teasp.Tsf.InfoBase.prototype.isExpAdmin = function(){
    return this.sessionEmp.isExpAdmin() || this.sessionEmp.isAdmin() || this.isSysAdmin();
};

/**
 * 費目リストを返す
 *
 * @param {Object} expItemFilter 経費費目表示区分（社員、部署）、精算区分の要素を持つ
 * @param {boolean=} flag trueの場合、無効の費目を含める
 * @returns {Array.<teasp.Tsf.ExpItem>}
 */
teasp.Tsf.InfoBase.prototype.getExpItems = function(expItemFilter, flag){
    var lst = [];
    for(var i = 0 ; i < this.expItems.length ; i++){
        var expItem = this.expItems[i];
        if((expItem.isSelectable(expItemFilter.empExpItemClass) || expItem.isSelectable(expItemFilter.deptExpItemClass))
        && expItem.checkExpenseType(expItemFilter.expenseType)
        && (flag || !expItem.isRemoved())){
            lst.push(expItem);
        }
    }
    return lst;
};

/**
 * 精算費目リストを返す
 *
 * @param {Object=} expItemFilter 経費費目表示区分（社員、部署）、精算区分の要素を持つ
 * @returns {Array.<teasp.Tsf.ExpItem>}
 */
teasp.Tsf.InfoBase.prototype.getPayItems = function(expItemFilter){
    var lst = [];
    dojo.forEach(this.payItems, function(item){
        if((!expItemFilter
        || ((item.isSelectable(expItemFilter.empExpItemClass) || item.isSelectable(expItemFilter.deptExpItemClass))
          && item.checkExpenseType(expItemFilter.expenseType))) && !item.isRemoved()){
            lst.push(item);
        }
    });
    return lst;
};

teasp.Tsf.InfoBase.prototype.getTaxRoundFlag = function(){
    return this.common.getTaxRoundFlag();
};

teasp.Tsf.InfoBase.prototype.getTicketPeriod = function(){
    return this.common.getTicketPeriod();
};

teasp.Tsf.InfoBase.prototype.isExpWorkflow = function(){
    return this.common.isExpWorkflow();
};

teasp.Tsf.InfoBase.prototype.isCommuterPassWorkflow = function(){
    return this.common.isCommuterPassWorkflow();
};

teasp.Tsf.InfoBase.prototype.getUseEkitan = function(){
    return this.common.getUseEkitan();
};

teasp.Tsf.InfoBase.prototype.isOutputJournal = function(){
    return this.common.isOutputJournal();
};

teasp.Tsf.InfoBase.prototype.getSessionEmp = function(){
    return this.sessionEmp;
};

teasp.Tsf.InfoBase.prototype.getExpPreApplyConfigByName = function(name){
    return this.common.getExpPreApplyConfigByName(name);
};

teasp.Tsf.InfoBase.prototype.getExpPreApplyConfigByView = function(view){
    return this.common.getExpPreApplyConfigByView(view);
};

teasp.Tsf.InfoBase.prototype.setExpHistory = function(sh, route){
    this.targetEmp.setExpHistory(sh, route);
};

teasp.Tsf.InfoBase.prototype.isOldRevi = function(){
    if(!this.borderRevNo){
        return false;
    }
    return (this.common.getRevision() < this.borderRevNo ? true : false);
};

teasp.Tsf.InfoBase.margeExpRelation = function(records, exps){
    if(records && records.length > 0){
        records[0].EmpExp__r = (exps || []);
    }
};

/**
 * J'sNAVI Jrの明細をセットする
 */
teasp.Tsf.InfoBase.mergeExpJsNaviRelation = function(records, exps){
    if(records && records.length > 0){
        records[0].ExpJsNavi__r = (exps || []);
    }
};

teasp.Tsf.InfoBase.prototype.getDefaultChargeDept = function(){
    var emp = this.targetEmp;
    return {
        ChargeDeptId__c : (emp ? emp.getDeptId() : null),
        ChargeDeptId__r : (emp ? emp.getDept()   : null)
    };
};

teasp.Tsf.InfoBase.prototype.getStartView = function(argId, hasArgId){
    return null;
};

/**
 * 未申請明細画面の承認申請ボタンを非表示にする
 * @returns {boolean}
 */
teasp.Tsf.InfoBase.prototype.isHiddenApplyBtn = function(){
    return false;
};

/**
 * 未申請明細に精算開始ボタンを配置
 * @returns {boolean}
 */
teasp.Tsf.InfoBase.prototype.isApplyByDetails = function(){
    return false;
};

/**
 * 精算区分の選択肢を返す
 * @param {Array.<string>=} 優先する選択肢
 * @param {boolean=} flag trueなら最初に空欄をセット
 * @returns {Array.<Object>}
 */
teasp.Tsf.InfoBase.prototype.getExpenseTypes = function(expenseTypes, flag){
    var ets = expenseTypes || [];
    if(!ets.length){
        var config = this.common.getExpPreApplyConfigs();
        ets = config.expenseTypes || [];
    }
    if(flag && !ets.contains('')){
        return [''].concat(ets);
    }
    return ets;
};

/**
 * フォーム別の使える項目の判別
 * @param {string} typeName
 * @param {string} apiKey
 * @returns {boolean}
 */
teasp.Tsf.InfoBase.prototype.isPossibleAtFormByApiKey = function(typeName, apiKey){
    if(typeName == teasp.constant.EXP_PRE_FORM1){ // 出張・交通費
        return !['ChargeJobId__c', 'ExpectedPayDate__c'].contains(apiKey);
    }else if(typeName == teasp.constant.EXP_PRE_FORM2){ // 会議・交際費
        return !['ChargeJobId__c', 'ExpectedPayDate__c'].contains(apiKey);
    }else if(typeName == teasp.constant.EXP_PRE_FORM3){ // 一般経費
        return !['ChargeJobId__c', 'ExpectedPayDate__c'].contains(apiKey);
    }else if(typeName == teasp.constant.EXP_PRE_FORM4){ // 仮払申請
        return !['ChargeJobId__c', 'ApplyDate__c', 'ExpectedPayDate__c'].contains(apiKey);
    }else{ // 経費精算
        return true;
    }
};

/**
 * 件名を入力する
 * @param {string} typeName 事前申請の場合はレコードタイプ名("出張・交通費","会議・交際費","一般経費","仮払申請"), 経費精算の場合は"expApply"
 * @param {Object=} o
 * @returns {number} 0:入力しない 1:入力する 2:必須(申請時)
 */
teasp.Tsf.InfoBase.prototype.getUseTitle = function(typeName, o){
    if(typeName != teasp.constant.EXP_FORM0){ // 事前申請はしない
        return 0;
    }
    var n = (this.common.getExpPreApplyConfigByName(typeName).useTitle  || 0);
    var key = 'Title__c';
    if(!n && o && o[key]){
        return 1; // 入力する
    }
    return n;
};

/**
 * 経費申請時に指定する項目
 * @param {string} typeName 事前申請の場合はレコードタイプ名("出張・交通費","会議・交際費","一般経費","仮払申請"), 経費精算の場合は"expApply"
 * @param {Object=} o
 * @returns {boolean}
 */
teasp.Tsf.InfoBase.prototype.isUseExpenseType = function(typeName, o){ // 精算区分
    var key = 'ExpenseType__c';
    if(o && o[key] && this.isPossibleAtFormByApiKey(typeName, key)){
        return true;
    }
    return (this.common.getExpPreApplyConfigByName(typeName).useExpenseType  || false);
};

teasp.Tsf.InfoBase.prototype.isUsePayMethod   = function(typeName, o){ // 精算方法
    var key = 'PayExpItemId__c';
    if(o && o[key] && this.isPossibleAtFormByApiKey(typeName, key)){
        return true;
    }
    return (this.common.getExpPreApplyConfigByName(typeName).usePayMethod    || false);
};

teasp.Tsf.InfoBase.prototype.isUseApplyDate   = function(typeName, o){ // 申請日
    var key = 'ApplyDate__c';
    if(o && o[key] && this.isPossibleAtFormByApiKey(typeName, key)){
        return true;
    }
    return (this.common.getExpPreApplyConfigByName(typeName).useApplyDate    || false);
};

teasp.Tsf.InfoBase.prototype.isUsePayDate     = function(typeName, o){ // 支払予定日
    var key = 'ExpectedPayDate__c';
    if(o && o[key] && this.isPossibleAtFormByApiKey(typeName, key)){
        return true;
    }
    return (this.common.getExpPreApplyConfigByName(typeName).usePayDate      || false);
};

teasp.Tsf.InfoBase.prototype.isUseProvisional = function(typeName, o){ // 仮払い申請
    var key = 'ProvisionalPaymentId__c';
    if(o && o[key] && this.isPossibleAtFormByApiKey(typeName, key)){
        return true;
    }
    if(o && o.ExpPreApplyId__r && o.ExpPreApplyId__r.ProvisionalPaymentAmount__c){ // 事前申請で仮払申請がある
        return false;
    }
    return (this.common.getExpPreApplyConfigByName(typeName).useProvisional  || false);
};

teasp.Tsf.InfoBase.prototype.isUseChargeJob   = function(typeName, o){ // ジョブ
    var key = 'ChargeJobId__c';
    if(o && o[key] && this.isPossibleAtFormByApiKey(typeName, key)){
        return true;
    }
    return (this.common.getExpPreApplyConfigByName(typeName).useChargeJob    || false);
};

teasp.Tsf.InfoBase.prototype.isUseChargeDept  = function(typeName, o){ // 負担部署
    var key = 'ChargeDeptId__c';
    if(o && o[key] && this.isPossibleAtFormByApiKey(typeName, key)){
        return true;
    }
    return (this.common.getExpPreApplyConfigByName(typeName).useChargeDept   || false);
};

teasp.Tsf.InfoBase.prototype.isUseExtraItem1  = function(typeName, o){ // 拡張項目1
    var key = 'ExtraItem1__c';
    if(o && o[key] && this.isPossibleAtFormByApiKey(typeName, key)){
        return true;
    }
    return (this.common.getExpPreApplyConfigByName(typeName).useExtraItem1   || false);
};

teasp.Tsf.InfoBase.prototype.isUseExtraItem2  = function(typeName, o){ // 拡張項目2
    var key = 'ExtraItem2__c';
    if(o && o[key] && this.isPossibleAtFormByApiKey(typeName, key)){
        return true;
    }
    return (this.common.getExpPreApplyConfigByName(typeName).useExtraItem2   || false);
};

/**
 * 事前申請オプション
 * @param {string} key 事前申請の場合はレコードタイプ名("出張・交通費","会議・交際費","一般経費","仮払申請"), 経費精算の場合は"expApply"
 * @returns {Array.<Object>}
 */
teasp.Tsf.InfoBase.prototype.isDptArvFlagsOptional  = function(key){ return (this.common.getExpPreApplyConfigByName(key).dptArvFlagsOptional  || false); }; // 出発区分を必須としない
teasp.Tsf.InfoBase.prototype.isUseOverseaTravel     = function(key){ return (this.common.getExpPreApplyConfigByName(key).useOverseaTravel     || false); }; // 海外出張を使う
teasp.Tsf.InfoBase.prototype.isUseOneDayTrip        = function(key){ return (this.common.getExpPreApplyConfigByName(key).useOneDayTrip        || false); }; // 日帰り出張を使う
teasp.Tsf.InfoBase.prototype.isUseJtbSect           = function(key){ return (this.common.getExpPreApplyConfigByName(key).useJtbSect           || false); }; // J'sNAVI明細セクションを使う
teasp.Tsf.InfoBase.prototype.isUseAllowanceSect     = function(key){ return (this.common.getExpPreApplyConfigByName(key).useAllowanceSect     || false); }; // 出張手当・宿泊手当セクションを使う
teasp.Tsf.InfoBase.prototype.isUseCouponTicketSect  = function(key){ return (this.common.getExpPreApplyConfigByName(key).useCouponTicketSect  || false); }; // 手配回数券セクションを使う
teasp.Tsf.InfoBase.prototype.isUseTicketArrangeSect = function(key){ return (this.common.getExpPreApplyConfigByName(key).useTicketArrangeSect || false); }; // 手配チケットセクションを使う
teasp.Tsf.InfoBase.prototype.isUseProvisionalSect   = function(key){ return (this.common.getExpPreApplyConfigByName(key).useProvisionalSect   || false); }; // 仮払申請セクションを使う
teasp.Tsf.InfoBase.prototype.isUseFreeInputSect     = function(key){ return (this.common.getExpPreApplyConfigByName(key).useFreeInputSect     || false); }; // 社員立替交通費セクションを使う
teasp.Tsf.InfoBase.prototype.isUseAttachment        = function(key){ return (this.common.getExpPreApplyConfigByName(key).useAttachment        || false); }; // 添付ファイルを使う

// 経費精算のCSV読込機能の使用可否
teasp.Tsf.InfoBase.prototype.isUseCsvImport = function(key){
    var flag = this.common.getExpPreApplyConfigByName(key).useCsvImport;
    if(flag == undefined && key == 'expApply'){
        return (this.common.getLocalKey().substring(20, 21) == '1');
    }
    return flag;
};

// 経費精算のCSV読込機能の使用可否
teasp.Tsf.InfoBase.prototype.isExpItemRevise = function(){
    var flag = this.common.getExpPreApplyConfigs().expItemRevise;
    if(typeof(flag) == 'boolean'){
        return flag;
    }
    return (this.common.getLocalKey().substring(20, 21) == '1');
};

/**
 * 部署情報をキャッシュ
 *
 * @param {string|Object} vk {string}の場合はid, {Object}の場合は下記の構造。
 *                        {
 *                            ChargeDeptId__c: {string}
 *                            ChargeDeptId__r: {
 *                                DeptCode__c: {string},
 *                                Name: {string},
 *                                ExpItemClass__c: {string}
 *                            }
 *                        }
 * @param {Object=} obj 下記の構造。vk が{Object}の場合は無視。
 *                         {
 *                             DeptCode__c: {string},
 *                             Name: {string},
 *                             ExpItemClass__c: {string}
 *                         }
 */
teasp.Tsf.InfoBase.prototype.setCacheDept = function(vk, obj){
    if(!this.cacheDept){
        this.cacheDept = {};
    }
    if(vk){
        if(typeof(vk) == 'string'){
            this.cacheDept[vk] = obj || null;
        }else if(typeof(vk) == 'object' && vk.ChargeDeptId__c && vk.ChargeDeptId__r){
            this.cacheDept[vk.ChargeDeptId__c] = vk.ChargeDeptId__r;
            this.cacheDept[vk.ChargeDeptId__c].Id = vk.ChargeDeptId__c;
        }
    }
};

teasp.Tsf.InfoBase.prototype.setCacheDeptByRecords = function(records){
    dojo.forEach(records || [], function(obj){
        if(obj.CacheDeptId__c && obj.CacheDeptId__r){
            this.setCacheDept(obj.CacheDeptId__c, obj.CacheDeptId__r);
        }
    }, this);
};

teasp.Tsf.InfoBase.prototype.createCacheDept = function(){
    if(!this.cacheDept){
        this.cacheDept = {};
    }
    dojo.forEach(this.depts, function(dept){
        this.cacheDept[dept.getId()] = dept.getObj();
        this.cacheDept[dept.getId()].Id = dept.getId();
    }, this);
};

/**
 * 部署情報をキャッシュから取得
 *
 * @param {string} id
 * @return {Object|null}
 */
teasp.Tsf.InfoBase.prototype.getCacheDept = function(id){
    return (id && this.cacheDept && this.cacheDept[id]) || null;
};

/**
 * ジョブ情報をキャッシュ
 *
 * @param {string|Object} vk {string}の場合はid, {Object}の場合は下記の構造。
 *                        {
 *                            ChargeJobId__c (or JobId__c): {string}
 *                            ChargeJobId__r (or JobId__r): {
 *                                JobCode__c: {string},
 *                                Name: {string}
 *                            }
 *                        }
 * @param {Object=} obj 下記の構造。vk が{Object}の場合は無視。
 *                         {
 *                             JobCode__c: {string},
 *                             Name: {string}
 *                         }
 */
teasp.Tsf.InfoBase.prototype.setCacheJob = function(vk, obj){
    if(!this.cacheJob){
        this.cacheJob = {};
    }
    if(vk){
        if(typeof(vk) == 'string'){
            this.cacheJob[vk] = obj || null;
        }else if(typeof(vk) == 'object'){
            if(vk.ChargeJobId__c && vk.ChargeJobId__r){
                this.cacheJob[vk.ChargeJobId__c] = vk.ChargeJobId__r;
            }else if(vk.JobId__c && vk.JobId__r){
                this.cacheJob[vk.JobId__c] = vk.JobId__r;
            }
        }
    }
};

/**
 * ジョブ情報をキャッシュから取得
 *
 * @param {string} id
 * @return {Object|null}
 */
teasp.Tsf.InfoBase.prototype.getCacheJob = function(id){
    return (id && this.cacheJob && this.cacheJob[id]) || null;
};

/**
 * 仮払申請情報をキャッシュ
 *
 * @param {string|Object} vk {string}の場合はid, {Object}の場合は下記の構造。
 *                        {
 *                            ProvisionalPaymentId__c: {string}
 *                            ProvisionalPaymentId__r: {
 *                                Title__c: {string},
 *                                ProvisionalPaymentAmount__c: {number}
 *                            }
 *                        }
 * @param {Object=} obj 下記の構造。vk が{Object}の場合は無視。
 *                         {
 *                             Title__c: {string},
 *                             ProvisionalPaymentAmount__c: {number}
 *                         }
 */
teasp.Tsf.InfoBase.prototype.setCacheProvis = function(vk, obj){
    if(!this.cacheProvis){
        this.cacheProvis = {};
    }
    if(vk){
        if(typeof(vk) == 'string'){
            this.cacheProvis[vk] = obj || null;
        }else if(typeof(vk) == 'object' && vk.ProvisionalPaymentId__c && vk.ProvisionalPaymentId__r){
            this.cacheProvis[vk.ProvisionalPaymentId__c] = vk.ProvisionalPaymentId__r;
            this.cacheProvis[vk.ProvisionalPaymentId__c].Id = vk.ProvisionalPaymentId__c;
        }
    }
};

teasp.Tsf.InfoBase.prototype.setCacheProvisByRecords = function(records){
    dojo.forEach(records || [], function(obj){
        if(obj.ProvisionalPaymentId__c && obj.ProvisionalPaymentId__r){
            this.setCacheProvis(obj.ProvisionalPaymentId__c, obj.ProvisionalPaymentId__r);
        }
    }, this);
};

/**
 * 仮払申請情報をキャッシュから取得
 *
 * @param {string} id
 * @return {Object|null}
 */
teasp.Tsf.InfoBase.prototype.getCacheProvis = function(id){
    return (id && this.cacheProvis && this.cacheProvis[id]) || null;
};

teasp.Tsf.InfoBase.prototype.getStartEndByYearMonth = function(month){
    if(this.sessionEmp){
        return this.sessionEmp.getStartEndByYearMonth(month);
    }
    var y = Math.floor(month / 100);
    var m = month % 100;
    var sd = new Date(y, m - 1, 1);
    var ed = teasp.util.date.addDays(teasp.util.date.addMonths(sd, 1), -1);
    return {
        yearMonth : month,
        startDate : teasp.util.date.formatDate(sd),
        endDate   : teasp.util.date.formatDate(ed)
    };
};

/**
 * 部署リストを入れ替える
 * @param {Array.<Object>} records
 */
teasp.Tsf.InfoBase.prototype.replaceDeptList = function(records){
    this.depts = teasp.Tsf.Dept.createList(records || []);
};

/**
 * 拡張経費精算機能を使用する
 * @returns {Boolean}
 */
teasp.Tsf.InfoBase.prototype.isExtendedExpenseFunction = function(){
    return this.privateOption.EnableExtendedExpenseFunction__c || false;
};

/**
 * 領収書読込業者組織との通信をする
 * @returns {Boolean}
 */
teasp.Tsf.InfoBase.prototype.isReceiptReaderConnect = function(){
    return (this.privateOption.ReceiptReaderAuthUserName__c ? true : false);
};

/**
 * 検索条件の申請状態の選択肢を返す
 * @param {Array.<Object>} records
 */
teasp.Tsf.InfoBase.prototype.getStatusPickList = function(){
    var lst = [];
    lst.push({v:'',n:''});
    if(this.isExtendedExpenseFunction()){ // 拡張経費精算機能を使用する
        lst.push({ v:'仕訳済み以外' ,msgId:'tf10001951'          });
        lst.push({ v:'仕訳済み'     ,msgId:'tf10006220'          });
    }else{
        lst.push({ v:'精算済み以外' ,msgId:'tf10001950'          });
        lst.push({ v:'精算済み'     ,msgId:'reimbursement_label' });
    }
    if(this.isExpWorkflow()){ // 承認ワークフローを使う
        lst.push({ v:'承認済み'     ,msgId:'tm10003480'          });
        lst.push({ v:'承認待ち'     ,msgId:'waitApproval_label'  });
        lst.push({ v:'申請取消'     ,msgId:'tm10003500'          });
        lst.push({ v:'却下'         ,msgId:'tm10003490'          });
    }else{
        lst.push({ v:'確定済み'     ,msgId:'fixed_label'         });
        lst.push({ v:'確定取消'     ,msgId:'cancelFix_btn_title' });
    }
    if(this.isUseExpCancelApply()){ // 経費申請の承認取消で赤伝票を申請する
        lst.push({ v:'取消伝票承認済み' ,msgId:'tf10006210'      });
        lst.push({ v:'取消伝票承認待ち' ,msgId:'tf10006200'      });
    }
    lst.push({ v:'未申請'       ,msgId:'tm10003560'          });
    return lst;
};

/**
 * 権限情報を返す
 * @returns {number}
 */
teasp.Tsf.InfoBase.prototype.getRights = function(){
    return this.rights;
};

/**
 * 定義情報の変更
 */
teasp.Tsf.InfoBase.prototype.patchDef = function(){
    if(this.isExpItemRevise()){
        var expItems = teasp.Tsf.formParams.expItems || {};
        // 費目コードを追加、ラベル変更（「表示名」→「費目名」、「コード」→「科目コード」、「費目名」→「科目名」）
        expItems.fields = [
           { check: true, domId: 'ExpItem{0}_Check', domType: 'checkbox', width: 24 },
           { label: 'Id'                                         , apiKey: 'Id'                       , domId: 'ExpItem{0}Id'                    , domType: 'text'    , hidden: true },
           { label: '費目種別'                                   , apiKey: 'TransportType__c'         , domId: 'ExpItem{0}TransportType'         , domType: 'text'    , notUse: true },
           { label: '手当種別'                                   , apiKey: 'AllowanceFlag__c'         , domId: 'ExpItem{0}AllowanceFlag'         , domType: 'text'    , notUse: true },
           { label: '精算区分'                                   , apiKey: 'ExpenseType__c'           , domId: 'ExpItem{0}ExpenseType'           , domType: 'text'    , notUse: true },
           { label: '使用制限あり'                               , apiKey: 'RestrictTargetEmployee__c', domId: 'ExpItem{0}RestrictTargetEmployee', domType: 'text'    , notUse: true },
           { label: '使用可能社員'                               , apiKey: 'TargetEmployee__c'        , domId: 'ExpItem{0}TargetEmployee'        , domType: 'text'    , notUse: true },
           { label: '費目コード'     , msgId: 'tf10007840'       , apiKey: 'ItemCode__c'              , domId: 'ExpItem{0}ItemCode'              , domType: 'text'    , width: 110  , sortable:true },
           { label: '費目名'         , msgId: 'tf10007850'       , apiKey: 'Name'                     , domId: 'ExpItem{0}Name'                  , domType: 'text'    , width: 150  , sortable:true },
           { label: '科目コード'     , msgId: 'tf10007860'       , apiKey: 'Code__c'                  , domId: 'ExpItem{0}Code'                  , domType: 'text'    , width: 110  , sortable:true },
           { label: '科目名'         , msgId: 'tf10007870'       , apiKey: 'ItemName__c'              , domId: 'ExpItem{0}ItemName'              , domType: 'text'    , width: 150  , sortable:true },
           { label: '補助科目コード' , msgId: 'tk10000707'       , apiKey: 'AuxCode__c'               , domId: 'ExpItem{0}AuxCode'               , domType: 'text'    , width: 110  , sortable:true },
           { label: '補助科目名'     , msgId: 'tm20004575'       , apiKey: 'AuxTitle__c'              , domId: 'ExpItem{0}AuxTitle'              , domType: 'text'    , width: 150  , sortable:true }
        ];
        // ソートキーを「費目コード」に変える
        expItems.sortKeys = [{
            apiKey: 'ItemCode__c'
        }];
        // 検索キーに「費目コード」を追加、順番を変更
        expItems.searchFields = [
            { label: '費目コード'  , msgId: 'tf10007840'  , apiKey: 'ItemCode__c'     , domId: 'ExpItemSearchItemCode'      , domType: 'text'  , width: 100, lw: 'auto', wr: true, matchType:3, noNL: true },
            { label: '費目名'      , msgId: 'tf10007850'  , apiKey: 'Name'            , domId: 'ExpItemSearchName'          , domType: 'text'  , width: 110, lw: 'auto', wr: true, matchType:3, noNL: true },
            { label: '科目コード'  , msgId: 'tf10007860'  , apiKey: 'Code__c'         , domId: 'ExpItemSearchCode'          , domType: 'text'  , width: 100, lw: 'auto', wr: true, matchType:3, noNL: true },
            { label: '科目名'      , msgId: 'tf10007870'  , apiKey: 'ItemName__c'     , domId: 'ExpItemSearchItemName'      , domType: 'text'  , width: 110, lw: 'auto', wr: true, matchType:3, noNL: true },
            { label: '費目ID'                             , apiKey: 'Id'              , domId: 'ExpItemSearchId'            , domType: 'array' , hidden: true }
        ];
    }
};

teasp.Tsf.InfoBase.prototype.setExpFilter = function(filter){
    this.expFilter = filter;
};

teasp.Tsf.InfoBase.prototype.getExpFilter = function(){
    return this.expFilter || {};
};

// 下位部署すべての部署IDを返す（自身も含める）
teasp.Tsf.InfoBase.prototype.getUnderDeptIds = function(deptId){
	return teasp.Tsf.Dept.getUnderDeptIds(this.depts, deptId);
};

// 経費明細入力時に基本情報の拡張項目をコピーしない
teasp.Tsf.InfoBase.prototype.isDoNotCopyExtraItem = function(){
	var config = this.common.getExpPreApplyConfigs();
	return config.expApply.doNotCopyExtraItem || false;
};
