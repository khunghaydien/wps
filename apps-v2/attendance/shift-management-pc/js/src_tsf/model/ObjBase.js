/**
 * オブジェクト基底クラス
 *
 * @constructor
 */
teasp.Tsf.ObjBase = function(){
};

/**
 * 経費事前申請のインスタンスの配列を作成して返す
 *
 * @param {Array.<Object>} applys
 * @returns {Array.<Object>}
 */
teasp.Tsf.ObjBase.createList = function(target, o, rights, piwks, steps){
    var orgs = [];
    if(teasp.Tsf.util.isArray(o)){
        orgs = o;
    }else{
        orgs.push(o);
    }
    var lst = [];
    dojo.forEach(orgs, function(apply){
        this.push(new teasp.Tsf[tsfManager.getTarget(target)](apply, rights, piwks, steps));
    }, lst);
    return lst;
};

teasp.Tsf.ObjBase.merge = function(lst1, lst2){
    var lst = lst1;
    var merged = {};
    dojo.forEach(lst2, function(o){
        for(var i = this.length - 1 ; i >= 0 ; i--){
            if(this[i].equalId(o.getId())){
                this.splice(i, 1, o);
                merged[o.getId()] = 1;
                break;
            }
        }
    }, lst);
    dojo.forEach(lst2, function(o){
        if(!merged[o.getId()]){
            this.push(o);
        }
    }, lst);
    return lst;
};

teasp.Tsf.ObjBase.getCancelApplyLabel = function(status){
    if(status == teasp.constant.STATUS_APPROVE){                // 承認済み
        return teasp.message.getLabel('tk10000741');            // 承認取消
    }
    if(status == teasp.constant.STATUS_ADMIT){                  // 確定済み
        return teasp.message.getLabel('cancelFix_btn_title'); // 確定取消
    }
    return teasp.message.getLabel('cancelApply_btn_title');     // 申請取消
};

/**
 * ステータス読み替え
 * 承認ワークフロー＝使用しないの設定の場合、「未申請」→「未確定」に変換
 *
 * @param {string} status
 * @returns {string}
 */
teasp.Tsf.ObjBase.RepStatus = function(status){
    var stat = (status || teasp.constant.STATUS_NOTREQUEST);
    if(stat == teasp.constant.STATUS_NOTREQUEST && !tsfManager.isExpWorkflow()){ // 未申請かつ承認ワークフロー＝使わない
        return teasp.constant.STATUS_NOTADMIT; // 未確定
    }
    return status;
};

/**
 * ProcessInstanceWorkitem の情報から自分が承認者かどうかを調べる
 * （※ 取消伝票も含む）
 * @param {Array.<Object>} piwks
 */
teasp.Tsf.ObjBase.prototype.mergePiwks = function(piwks){
    var tgtId = (this.isCancelApplyWait() ? this.getCancelApplyId() : this.obj.Id);
    for(var i = 0 ; i < piwks.length ; i++){
        if(tgtId == piwks[i].ProcessInstance.TargetObjectId){
            this.obj._piwk = true;
        }
    }
};

teasp.Tsf.ObjBase.prototype.getRights = function(){
    return this.rights;
};

teasp.Tsf.ObjBase.prototype.setRights = function(rights){
    this.rights = rights;
};

teasp.Tsf.ObjBase.prototype.isRightOn = function(mask){
    return ((this.rights & mask) != 0);
};

teasp.Tsf.ObjBase.prototype.getDataObj = function(){
    return this.obj || {};
};

teasp.Tsf.ObjBase.prototype.getValue = function(field){
    return teasp.Tsf.ObjBase.getValue(this.obj, field);
};

/**
 * ID
 *
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.getId = function(){
    return this.obj.Id || null;
};

teasp.Tsf.ObjBase.prototype.equalId = function(id){
    return teasp.Tsf.util.equalId(this.obj.Id, id);
};

teasp.Tsf.ObjBase.prototype.getEmpId = function(){
    return this.obj.EmpId__c || null;
};

teasp.Tsf.ObjBase.prototype.getCancelApplyId = function(){
    return this.obj.ExpCancelApplyId__c || null;
};

teasp.Tsf.ObjBase.prototype.createNewObj = function(data){
    return null;
};
/**
 * 社員名
 *
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.getEmpName = function(){
    return this.obj.EmpId__r.Name || '';
};

teasp.Tsf.ObjBase.prototype.getEmpExpItemClass = function(){
    return this.obj.EmpId__r.ExpItemClass__c || '';
};

/**
 * 部署ID
 * @param {boolean=} flag
 * @returns {string|null}
 */
teasp.Tsf.ObjBase.prototype.getDeptId = function(flag){
    return this.obj.DeptId__c || (!flag && tsfManager.getTargetEmp().getDeptId()) || null;
};

/**
 * 部署
 * @param {boolean=} flag
 * @returns {Object|null}
 */
teasp.Tsf.ObjBase.prototype.getDept = function(flag){
    return this.obj.DeptId__r || (!flag && tsfManager.getTargetEmp().getDept()) || null;
};

/**
 * 部署名
 * @param {boolean=} flag
 * @returns {string|null}
 */
teasp.Tsf.ObjBase.prototype.getDeptName = function(flag){
    return (this.obj.DeptId__r && this.obj.DeptId__r.Name) || (!flag && tsfManager.getTargetEmp().getDeptName()) || null;
};

/**
 * 部署の費目表示区分
 * @param {boolean=} flag
 * @returns {string|null}
 */
teasp.Tsf.ObjBase.prototype.getDeptExpItemClass = function(flag){
    return (this.obj.DeptId__r && this.obj.DeptId__r.ExpItemClass__c) || (!flag && tsfManager.getTargetEmp().getDeptExpItemClass()) || null;
};

teasp.Tsf.ObjBase.prototype.getLastModifiedDate = function(){
    return this.obj.LastModifiedDate;
};

teasp.Tsf.ObjBase.prototype.getLastModifiedBy = function(){
    return (this.obj.LastModifiedBy && this.obj.LastModifiedBy.Name) || null;
};

teasp.Tsf.ObjBase.prototype.getStartDate = function(){
    if(this.obj.StartDate__c && typeof(this.obj.StartDate__c) == 'number'){
        this.obj.StartDate__c = teasp.util.date.formatDate(this.obj.StartDate__c);
    }
    return this.obj.StartDate__c;
};

teasp.Tsf.ObjBase.prototype.getEndDate = function(){
    if(this.obj.EndDate__c && typeof(this.obj.EndDate__c) == 'number'){
        this.obj.EndDate__c = teasp.util.date.formatDate(this.obj.EndDate__c);
    }
    return this.obj.EndDate__c;
};

/**
 * ステータスの読み替え
 *
 * @param {string} status
 * @param {boolean=} flag trueなら読み替えをする
 * @returns {string}
 */
teasp.Tsf.ObjBase.changeStatus = function(status, flag){
    var stat = (status || teasp.constant.STATUS_NOTREQUEST);
    if(stat == teasp.constant.STATUS_NOTREQUEST && !tsfManager.isExpWorkflow()){ // 未申請かつ承認ワークフロー＝使わない
        return teasp.constant.STATUS_NOTADMIT; // 未確定
    }
    return stat;
};

/**
 * ステータス（制御用）
 *
 * @param {boolean=} flag trueなら読み替えをする
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.getStatus = function(flag){
    return teasp.Tsf.ObjBase.changeStatus(this.obj.StatusC__c, flag);
};

/**
 * 表示用のステータス
 *
 * @param {boolean=} flag trueなら読み替えをする
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.getStatusD = function(flag){
    return teasp.Tsf.ObjBase.changeStatus(this.obj.StatusD__c, flag);
};

/**
 * 論理削除済み
 * @returns {Boolean}
 */
teasp.Tsf.ObjBase.prototype.isRemoved = function(){
    return false;
};

/**
 * 取消伝票のステータス
 *
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.getCancelApplyStatus = function(){
    return (this.obj.ExpCancelApplyId__r && this.obj.ExpCancelApplyId__r.Status__c || null);
};

/**
 * 取消伝票の承認待ち
 *
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.isCancelApplyWait = function(){
    return (teasp.constant.STATUS_WAIT == this.getCancelApplyStatus());
};

/**
 * 種別
 *
 * @returns {String}
 */
teasp.Tsf.ObjBase.prototype.getTypeName = function(){
    return teasp.constant.EXP_FORM0; // デフォルトは'expApply'。事前申請（ExpPreApply）はオーバーライドする
};

teasp.Tsf.ObjBase.STATUS_ICON_MAP = {
    '未申請'   : 'sts004',
    '承認待ち' : 'sts008',
    '承認済み' : 'sts005',
    '確定済み' : 'sts005',
    '申請済み' : 'sts005',
    '精算済み' : 'sts003',
    '却下'     : 'sts006',
    '申請取消' : 'sts004',
    '仕訳済み' : 'sts010',
    '取消伝票承認済み' : 'sts011',
    '取消伝票承認待ち' : 'sts012'
};

/**
 * ステータスアイコン
 *
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.getStatusIcon = function(){
    return teasp.Tsf.ObjBase.STATUS_ICON_MAP[this.getStatusD(true)];
};

/**
 * 申請ボタンのラベル
 *
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.getApplyButtonLabel = function(){
    if(this.isManifestEditMode()){ // 編集モードに移行した状態
        return null;
    }
    if(this.isEditable(false, true)){
        return teasp.message.getLabel(tsfManager.isExpWorkflow() ? 'applyx_btn_title' : 'fix_btn_title'); // 承認申請 : 確定
    }
    return null;
};

/**
 * 承認済み（確定済み）か
 *
 * @returns {boolean}
 */
teasp.Tsf.ObjBase.prototype.isApproved = function(){
    return teasp.constant.STATUS_APPROVES.contains(this.getStatus()) || this.isPaid();
};

teasp.Tsf.ObjBase.prototype.isWait = function(){
    return (teasp.constant.STATUS_WAIT == this.getStatus());
};

teasp.Tsf.ObjBase.prototype.isReject = function(){
    return teasp.constant.STATUS_REJECTS.contains(this.getStatus());
};

teasp.Tsf.ObjBase.prototype.isCancel = function(){
    return teasp.constant.STATUS_CANCELS.contains(this.getStatus());
};

/**
 * 精算済みか
 *
 * @returns {Boolean}
 */
teasp.Tsf.ObjBase.prototype.isPaid = function(){
    return (teasp.constant.STATUS_PAYD == this.getStatus());
};

teasp.Tsf.ObjBase.prototype.isEditableStatus = function(){
    return teasp.constant.STATUS_EDITABLE.contains(this.getStatus());
};

/**
 * 取消伝票が承認待ちまたは承認済み
 * @returns {Boolean}
 */
teasp.Tsf.ObjBase.prototype.isValidCancelApply = function(){
    return (
        this.obj.StatusD__c == teasp.constant.STATUS_CANCEL_WAIT
     || this.obj.StatusD__c == teasp.constant.STATUS_CANCEL_APPROVE
    );
};

teasp.Tsf.ObjBase.prototype.setMode = function(mode){
    this.mode = mode;
};

teasp.Tsf.ObjBase.prototype.getMode = function(){
    return this.mode;
};

/**
 * 編集ボタンが押されたか.<br/>
 * 参照モードまたはステータスが承認待ち、承認済みの場合、普通は参照モードで開くが、
 * 編集ボタンが押されていれば、先の条件をはねのけて編集可能な状態である。
 * 編集ボタンはユーザに編集権限があること、ステータスが精算済みでない場合にしか表示されない。
 * → this.isChangableEditMode で制御
 *
 * @returns {Boolean} true なら明示的に編集オンの状態を示す。
 */
teasp.Tsf.ObjBase.prototype.isManifestEditMode = function(){
    return (this.mode && !teasp.Tsf.Manager.isReadMode(this.getMode()));
};

/**
 * 取消伝票があるかつ承認済み
 * @returns
 */
teasp.Tsf.ObjBase.prototype.isStrongCancel = function(){
    return (this.obj.ExpCancelApplyId__c
            && teasp.constant.STATUS_APPROVES.contains(this.obj.ExpCancelApplyId__r.Status__c));
};

/**
 * 参照モードかどうか
 *
 * @param {boolean=} ignoreArgMode true なら引数の mode=read を無視
 * @returns {boolean} trueなら参照モード、falseなら編集モード
 */
teasp.Tsf.ObjBase.prototype.isReadMode = function(ignoreArgMode){
    // 編集権限がない場合は、強制的に参照モード
    if(!this.isRightOn(teasp.constant.P_E|teasp.constant.P_AX)){
        return true;
    }
    // 取消伝票があるかつ承認済みなら強制的に参照モード
    if(this.isStrongCancel()){
        return true;
    }
    // 明示的に編集オンの状態なら、編集モード
    if(this.isManifestEditMode()){
        return false;
    }
    // それ以外ならmodeの指定は無視するので、編集モードとして返す
    if(ignoreArgMode){
        return false;
    }
    // それ以外ならmodeの指定があるかどうかによって決まる
    return tsfManager.isReadMode();
};

/**
 * リードオンリー
 *
 * @returns {boolean} trueならリードオンリー、falseなら編集可
 */
teasp.Tsf.ObjBase.prototype.isReadOnly = function(){
    // 明示的に編集オンの状態なら、編集可
    if(this.isManifestEditMode()){
        return false;
    }
    // 参照モードならリードオンリー
    if(this.isReadMode()){
        return true;
    }
    // それ以外なら編集可能かどうかで決まる
    return !this.isEditable();
};

/**
 * 編集可能か
 *
 * @param {boolean=} flag false なら明示的な編集オン状態を無視
 * @param {boolean=} ignoreArgMode true なら引数の mode=read を無視
 * @returns {boolean} trueなら編集可 falseなら編集不可
 */
teasp.Tsf.ObjBase.prototype.isEditable = function(flag, ignoreArgMode){
    // 参照モードなら編集不可
    if(this.isReadMode(ignoreArgMode)){
        return false;
    }
    // flag ==trueの指定があれば、明示的に編集オン状態なら編集可とする
    if(flag && this.isManifestEditMode()){
        return true;
    }
    // それ以外ならステータスによって決まる
    return this.isEditableStatus();
};

/**
 * 申請取消または承認取消ボタン名
 *
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.getCancelLabel = function(){
    if(this.isCancelApplyWait()){
        return teasp.message.getLabel('tf10006230'); // 取消伝票の申請取消
    }
    return teasp.Tsf.ObjBase.getCancelApplyLabel(this.getStatus());
};

/**
 * 申請取消できるか
 *
 * @returns {boolean}
 */
teasp.Tsf.ObjBase.prototype.isCancelable = function(){
    // 閲覧モードの場合は常に不可
    if(this.isReadMode()){
        return false;
    }
    // 精算済みの場合は「経費申請の承認取消で赤伝票を申請する」＝オンの場合のみ、取り消し可
    if(this.isPaid()){
        if(tsfManager.isUseExpCancelApply()){
            return true;
        }
        return false;
    }
    // 承認済み(確定済み)なら、経費(SYS)管理者または「経費申請の承認取消で赤伝票を申請する」＝オンの場合、取り消し可
    if(this.isApproved()){
        return (tsfManager.isUseExpCancelApply() || tsfManager.isExpAdmin());
    }
    return !this.isEditable();
};

/**
 * 申請取下（明細をばらす）できるか
 *
 * @returns {boolean}
 */
teasp.Tsf.ObjBase.prototype.isUnknotable = function(){
    return false;
};

/**
 * 申請取下選択時の確認用メッセージ
 * @returns
 */
teasp.Tsf.ObjBase.prototype.getUnknotWarning = function(){
    return null;
};

/**
 * 編集ボタンを表示するか（編集モードに移行できるか）
 *
 * @returns {boolean}
 */
teasp.Tsf.ObjBase.prototype.isChangableEditMode = function(){
    // 精算済みは常に不可
    if(this.isPaid()){
        return false;
    }
    // 取消伝票が承認待ちor承認済みの場合、不可
    if(teasp.constant.STATUS_FIX.contains(this.getCancelApplyStatus())){
        return false;
    }
    // すでに明示的に編集オンの状態である
    if(this.isManifestEditMode()){
        return false;
    }
    // 編集可能なステータスかつ参照モードかつ編集権限があるなら移行可
    if(this.isEditableStatus() && this.isRightOn(teasp.constant.P_E|teasp.constant.P_AX) && tsfManager.isReadMode()){
        return true;
    }
    // 「承認済みでも経費管理者は経費明細の修正ができる」がオンの場合、経費(SYS)管理者は編集可
    if(!this.isEditableStatus() && tsfManager.isAllowEditExpAdmin() && tsfManager.isExpAdmin()){
        return true;
    }
    // 「承認中でも上長が経費明細の修正ができる」がオンの場合、
    // 経費(SYS)管理者、上長、全データ編集者、管理者、部署の管理者は編集可
    if(this.isWait() && tsfManager.isAllowEditManager()){
        var mask = teasp.constant.P_MA  // 対象社員の上長
                |teasp.constant.P_DM    // 対象社員の部署の管理者
                |teasp.constant.P_D1    // 対象社員の部署の補助管理者１
                |teasp.constant.P_D2    // 対象社員の部署の補助管理者２
                |teasp.constant.P_SS    // システム管理者
                |teasp.constant.P_AD    // 管理機能の使用
                |teasp.constant.P_AE    // 全社員のデータ編集
                |teasp.constant.P_AX    // 経費管理機能の使用
                ;
        mask &= ~teasp.constant.P_ME;   // 本人を除く
        return  this.isRightOn(mask);
    }
    return false;
};

/**
 * 削除できるか
 *
 * @returns {boolean}
 */
teasp.Tsf.ObjBase.prototype.isDeletable = function(){
    if(!this.getId()
    || tsfManager.isReadMode()      // 参照モードなら不可
    || !this.isEditableStatus()){   // 編集不可のステータスなら不可
        return false;
    }
    if(this.isValidCancelApply()){ // 取消伝票が承認待ちまたは承認済みの場合は不可
        return false;
    }
    var mask = teasp.constant.P_E   // 編集権限がある
    |teasp.constant.P_MA    // 対象社員の上長
    |teasp.constant.P_DM    // 対象社員の部署の管理者
    |teasp.constant.P_D1    // 対象社員の部署の補助管理者１
    |teasp.constant.P_D2    // 対象社員の部署の補助管理者２
    |teasp.constant.P_SS    // システム管理者
    |teasp.constant.P_AD    // 管理機能の使用
    |teasp.constant.P_AE    // 全社員のデータ編集
    |teasp.constant.P_AX    // 経費管理機能の使用
    ;
    return  this.isRightOn(mask);
};

/**
 * コピーできるか
 *
 * @returns {boolean}
 */
teasp.Tsf.ObjBase.prototype.isCopyable = function(){
    if(!this.getId()){
        return false;
    }
    var mask = teasp.constant.P_E   // 編集権限がある
    |teasp.constant.P_MA    // 対象社員の上長
    |teasp.constant.P_DM    // 対象社員の部署の管理者
    |teasp.constant.P_D1    // 対象社員の部署の補助管理者１
    |teasp.constant.P_D2    // 対象社員の部署の補助管理者２
    |teasp.constant.P_SS    // システム管理者
    |teasp.constant.P_AD    // 管理機能の使用
    |teasp.constant.P_AE    // 全社員のデータ編集
    |teasp.constant.P_AX    // 経費管理機能の使用
    ;
    return  this.isRightOn(mask);
};

/**
 * 申請できるか
 *
 * @returns {boolean}
 */
teasp.Tsf.ObjBase.prototype.isApplyable = function(){
    return this.isEditable();
};

teasp.Tsf.ObjBase.prototype.getStatusInfo = function(){
    return {
        text    : teasp.constant.getDisplayStatus(this.getStatusD(true)),
        icon    : this.getStatusIcon()
    };
};

/**
 * 自分が承認者か（※ 取消伝票も含む）
 * @returns {Boolean}
 */
teasp.Tsf.ObjBase.prototype.isPiwk = function(){
    // 既に編集モードに移行した状態
    if(this.isManifestEditMode()){
        return false;
    }
    return this.obj._piwk || false;
};

/**
 * ゴミ箱へ格納
 *
 * @param {string} discernment
 * @param {Array.<Object>} lst
 */
teasp.Tsf.ObjBase.prototype.setTrashBox = function(discernment, lst){
    if(!this.trashs){
        this.trashs = {};
    }
    if(!this.trashs[discernment]){
        this.trashs[discernment] = {};
    }
    dojo.forEach(lst, function(o){
        if(o.Id){ // Id があるものだけ入れる
            this.trashs[discernment][o.Id] = o;
        }
    }, this);
};

teasp.Tsf.ObjBase.prototype.getRemoveIdList = function(discernment){
    var lst = [];
    var o = (this.trashs && this.trashs[discernment]) || {};
    for(var key in o){
        if(o.hasOwnProperty(key)){
            lst.push(key);
        }
    }
    return lst;
};

teasp.Tsf.ObjBase.prototype.clearTrashs = function(discernment){
    if(this.trashs){
        this.trashs[discernment] = {};
    }
};

teasp.Tsf.ObjBase.prototype.isRemovedExp = function(id){
    var m = (this.trashs && this.trashs[teasp.Tsf.formParams.sectionDetail.discernment]) || {};
    return (m[id] ? true : false);
};

teasp.Tsf.ObjBase.prototype.getSectionValuesByUniqKey = function(discernment, key){
    var lst = this.getSectionValues(discernment);
    for(var i = lst.length - 1 ; i >= 0 ; i--){
        var o = lst[i];
        if(o._uniqKey == key){
            return o;
        }
    }
    return null;
};

teasp.Tsf.ObjBase.prototype.setSectionValueByUniqKey = function(discernment, key, obj){
    var lst = this.getSectionValues(discernment);
    for(var i = lst.length - 1 ; i >= 0 ; i--){
        var o = lst[i];
        if(o._uniqKey == key){
            lst.splice(i, 1, obj);
            break;
        }
    }
};

teasp.Tsf.ObjBase.prototype.deleteSectionValueByUniqKey = function(discernment, key){
    var lst = this.getSectionValues(discernment);
    for(var i = lst.length - 1 ; i >= 0 ; i--){
        var o = lst[i];
        if(o._uniqKey == key){
            this.setTrashBox(discernment, lst.splice(i, 1));
            break;
        }
    }
};

teasp.Tsf.ObjBase.prototype.isSolve = function(){
    return false;
};

teasp.Tsf.ObjBase.prototype.linkPreApplyAll = function(){
};

teasp.Tsf.ObjBase.prototype.linkPreApply = function(exp){
};

/**
 * 経費明細保存を返す
 *
 * @returns {Object}
 */
teasp.Tsf.ObjBase.prototype.getSavedDetails = function(){
    var v = this.obj.SavedDetails__c;
    if(v && typeof(v) == 'string'){
        v = this.obj.SavedDetails__c = teasp.Tsf.util.fromJson(v);
    }
    return (v || {});
};

/**
 * 自前保存の承認履歴を返す
 *
 * @returns {Array.<Object>}
 */
teasp.Tsf.ObjBase.prototype.getSavedSteps = function(){
    var v = this.getSavedDetails();
    return (v.savedStepsV5 || []);
};

/**
 * 承認履歴とSavedDetails__c に保存された履歴をマージ
 * ※ 精算済み、精算取消の履歴は表示しないことにした（#4294 comment8）ので、
 * このメソッドは呼ばれない（代案ができるまでとりあえず消さないでおく）。
 * @param records
 * @returns
 */
teasp.Tsf.ObjBase.prototype.mergeSteps = function(records){
    var savedSteps = this.getSavedSteps();
    var convedSteps = [];
    dojo.forEach(savedSteps, function(s){
        convedSteps.push({
            CreatedDate     : s.createdDate,
            StepStatus      : s.stepStatus,
            OriginalActor   : null,
            Actor           : { Name : s.actorName },
            Comments        : s.comments
        });
    });
    // マージ
    var mergedSteps = records.concat(convedSteps);
    // 日付の値を文字列に変換しておく
    dojo.forEach(mergedSteps, function(step){
        step.CreatedDate = teasp.util.date.formatDateTime(step.CreatedDate);
    });
    // 日付降順でソート
    mergedSteps = mergedSteps.sort(function(a, b){
        return (a.CreatedDate < b.CreatedDate ? 1 : -1);
    });
    return mergedSteps;
};

teasp.Tsf.ObjBase.prototype.getSectionDetailCount = function(){
    return 1;
};

/**
 * 差異を表示可能か
 * @returns {Boolean}
 */
teasp.Tsf.ObjBase.prototype.canDiffView = function(){
    return false;
};

/**
 * 経費事前申請ID
 *
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.getExpPreApplyId = function(){
    return null;
};

teasp.Tsf.ObjBase.covertEmpExp = function(exp){
    if(exp.Date__c && typeof(exp.Date__c) == 'number'){
        exp.Date__c = teasp.util.date.formatDate(exp.Date__c);
    }
    if(exp.PaymentDate__c && typeof(exp.PaymentDate__c) == 'number'){
        exp.PaymentDate__c = teasp.util.date.formatDate(exp.PaymentDate__c);
    }
};

/**
 * 経費履歴から経費明細データを作成
 *
 * @param {Object} exp 経費明細レコード
 * @returns {Object}
 */
teasp.Tsf.ObjBase.prototype.createEmpExpFromExp = function(exp){
    var expItem = tsfManager.getExpItemById(exp.ExpItemId__c);
    var date = teasp.util.date.formatDate(new Date());
    var res = {
        _uniqKey                : teasp.Tsf.ExpApply.createUniqKey(),
        Id                      : null,
        EmpId__c                : this.getEmpId(),              // 社員ID
        ExpApplyId__c           : this.getId(),                 // 交通費申請
        ExpApplyId__r           : {
            ExpPreApplyId__c    : this.getExpPreApplyId()       // 経費事前申請ID
        },
        ExpItemId__c            : expItem.getId(),              // 費目
        ExpItemId__r            : {
            Name                : expItem.getName()
        },
        Date__c                 : date,                         // 日付（★本日日付）
        CardStatementLineId__c  : null,                         // カード明細ID（★強制null）
        Cost__c                 : exp.Cost__c,                  // 金額（★外貨の場合、後で再計算した値をセット）
        // 外貨（★後で計算する）
        CurrencyName__c         : null,                         // 通貨名
        CurrencyRate__c         : null,                         // 換算レート
        ForeignAmount__c        : null,                         // 現地金額
        // 支払先（★後でセットする）
        PayeeId__c              : null,                         // 支払先ID
        PayeeId__r              : null,
        // 支払日
        PaymentDate__c          : null,                         // 支払日（★強制null）
        // 単価、数量
        UnitPrice__c            : exp.UnitPrice__c || null,     // 単価
        Quantity__c             : exp.Quantity__c || null,      // 数量
        //
        Detail__c               : exp.Detail__c,                // 詳細
        IsPaid__c               : false,                        // 支払い済み（★強制false）
        JobId__c                : exp.JobId__c || null,         // 勤怠ジョブマスタ
        JobId__r                : (exp.JobId__r ? {
            JobCode__c          : exp.JobId__r.JobCode__c   || null,
            Name                : exp.JobId__r.Name         || null,
            StartDate__c        : exp.JobId__r.StartDate__c || null,
            EndDate__c          : exp.JobId__r.EndDate__c   || null
        } : null),
        ChargeDeptId__c         : exp.ChargeDeptId__c || null,  // 負担部署
        ChargeDeptId__r         : exp.ChargeDeptId__r,
        Order__c                : 1,                            // 並び順（★暫定）
        Receipt__c              : expItem.isReceipt(),          // 領収書あり
        Item__c                 : null,                         // 外部入力元（★強制null）
        // 税（★後で計算する）
        TaxAuto__c              : exp.TaxAuto__c,               // 消費税自動計算
        TaxType__c              : null,                         // 消費税タイプ
        TaxRate__c              : null,                         // 消費税率
        Tax__c                  : null,                         // 消費税額
        WithoutTax__c           : null,                         // 税抜金額
        // 交通費（★条件で再セット）
        TransportType__c        : exp.TransportType__c,         // 交通費種別
        startCode__c            : exp.startCode__c,             // 発駅コード
        startName__c            : exp.startName__c,             // 発駅名
        endCode__c              : exp.endCode__c,               // 着駅コード
        endName__c              : exp.endName__c,               // 着駅名
        roundTrip__c            : exp.roundTrip__c,             // 往復フラグ
        Route__c                : exp.Route__c,                 // 経路
        // 発行者店名
        Publisher__c            : exp.Publisher__c,
        //交際費
        InternalParticipantsNumber__c   :   exp.InternalParticipantsNumber__c,  //社内参加者人数
        InternalParticipants__c         :   exp.InternalParticipants__c,        //社内参加者
        ExternalParticipantsNumber__c   :   exp.ExternalParticipantsNumber__c,  //社外参加者人数
        ExternalParticipants__c         :   exp.ExternalParticipants__c,        //社外参加者
        PlaceName__c                    :   exp.PlaceName__c,                   //店舗名
        PlaceAddress__c                 :   exp.PlaceAddress__c,                //店舗所在地
        // 拡張
        ExtraItem1__c           : exp.ExtraItem1__c,            // 拡張項目1
        ExtraItem2__c           : exp.ExtraItem2__c             // 拡張項目2
    };
    if(res.TransportType__c == '1' // 駅探検索の交通費
    && res.Date__c != teasp.util.date.formatDate(exp.Date__c)){
        res.TransportType__c = '2'; // 交通費
        res.startCode__c     = null;
        res.endCode__c       = null;
//        res.Route__c         = null;
        // res.Route__c には経由駅の情報があるためコピー元の値をそのまま持っておき、後で削除
    }
    if(exp.PayeeId__c){ // 支払先
        res.PayeeId__c  = exp.PayeeId__c;   // 支払先ID
        res.PayeeId__r  = (exp.PayeeId__r ? {
            Name         : exp.PayeeId__r.Name         || null,
            PayeeType__c : exp.PayeeId__r.PayeeType__c || '1',
            ExpenseType__c: exp.PayeeId__r.ExpenseType__c || null
        } : null);
    }
    if(expItem.isForeignFlag()){    // 外貨入力する費目
        res.CurrencyName__c   = exp.CurrencyName__c || null;            // 通貨名
        res.ForeignAmount__c  = exp.ForeignAmount__c || null;           // 現地金額
        var foreign = tsfManager.getForeignByName(res.CurrencyName__c);
        if(foreign && res.ForeignAmount__c){
            var rateV = foreign.getRateByDate(res.Date__c); // 換算レートを取得
            var rate = teasp.util.currency.formatDecimal(rateV , teasp.constant.CU_DEC_POINT_MIN, teasp.constant.CU_DEC_POINT_MAX); // 換算レート
            res.CurrencyRate__c   = rate.n;
            // 日付時点の換算レートで再計算する
            var fixc = expItem.getRecalcTarget(); // 金額と現地金額どちらを固定するか判定
            var o = teasp.Tsf.ExpDetail.calcForeign(res.Cost__c, rate.n, res.ForeignAmount__c, fixc, (rate.sn1 != '0' ? 1 : 0), expItem.isAllowMinus());
            if(!fixc){ // 金額固定
                res.ForeignAmount__c = o.amount;
            }else{ // 現地金額固定
                res.Cost__c = o.cost;
            }
        }
    }
    if(expItem.isTaxFlag()){ // 税入力する費目
        if(res.TaxAuto__c){
            var taxType      = expItem.getTaxType() || '0';                 // 税タイプ
            var allowMinus   = expItem.isAllowMinus();                      // マイナス可
            var taxRoundFlag = tsfManager.getTaxRoundFlag();                // 端数処理
            var taxRate      = expItem.getTaxRate(res.Date__c);             // 税率
            var cost         = res.Cost__c;                                 // 金額

            var o = teasp.Tsf.ExpDetail.calcTax(
                    cost,       // 金額
                    0,          // withoutTax
                    0,          // tax
                    0,          // flag
                    taxType,
                    taxRate,
                    exp.TaxAuto__c,
                    taxRoundFlag,
                    allowMinus
                    );

            res.TaxType__c      = taxType;
            res.TaxRate__c      = taxRate;
            res.Tax__c          = o.tax;
            res.WithoutTax__c   = o.withoutTax;
        }else{
            res.TaxType__c      = exp.TaxType__c;
            res.TaxRate__c      = exp.TaxRate__c;
            res.Tax__c          = exp.Tax__c;
            res.WithoutTax__c   = exp.WithoutTax__c;
        }
    }

    return res;
};

/**
 * 引数のオブジェクトに要素を追加
 */
teasp.Tsf.ObjBase.prototype.addElement = function(obj){
    return;
};

/**
 * createFlag
 * 経費申請の申請書作成の有無だけに関係するフラグなのでデフォルトはtrue
 *
 * @returns {boolean}
 */
teasp.Tsf.ObjBase.prototype.isCreateFlag = function(){
    return true;
};

/**
 * 添付ファイルのリストを返す
 *
 * @returns {Array.<Object>}
 */
teasp.Tsf.ObjBase.prototype.getAttachments = function(){
    return (this.obj.Attachments || []);
};

/**
 * 添付ファイルを更新
 *
 * @param {Array.<Object>} attachs
 */
teasp.Tsf.ObjBase.prototype.setAttachments = function(attachs){
    this.obj.Attachments = attachs;
};

/**
 * 申請日時
 *
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.getApplyTime = function(){
    var dt = this.obj.ApplyTime__c;
    return (dt ? teasp.util.date.formatDateTime(this.obj.ApplyTime__c, 'SLA-HM') : '');
};

/**
 * 最終承認日時
 *
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.getLastApprovedTime = function(){
    if(this.obj.ExpCancelApplyId__r && teasp.constant.STATUS_APPROVES.contains(this.obj.ExpCancelApplyId__r.Status__c)){
        // 取消伝票ありかつ承認済みの場合、取消伝票の最終承認日時を返す
        return teasp.util.date.formatDateTime(this.obj.ExpCancelApplyId__r.ApproveTime__c, 'SLA-HM');
    }
    if(!['承認済み','精算済み'].contains(this.obj.StatusC__c)){
        return '';
    }
    var steps = this.steps || [];
    return (steps.length > 0 ? teasp.util.date.formatDateTime(steps[0].CreatedDate, 'SLA-HM') : '');
};

/**
 * 最終承認者
 *
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.getLastApprover = function(){
    if(this.obj.ExpCancelApplyId__r && teasp.constant.STATUS_APPROVES.contains(this.obj.ExpCancelApplyId__r.Status__c)){
        // 取消伝票ありかつ承認済みの場合、取消伝票の最終承認者を返す
        return (this.obj.ExpCancelApplyId__r.ApproverId__r && this.obj.ExpCancelApplyId__r.ApproverId__r.Name || '');
    }
    if(!['承認済み','精算済み'].contains(this.obj.StatusC__c)){
        return '';
    }
    var steps = this.steps || [];
    return (steps.length > 0 && steps[0].Actor ? steps[0].Actor.Name : '');
};

/**
 * 仮払申請のリンクあり
 *
 * @returns {string}
 */
teasp.Tsf.ObjBase.prototype.getProvisionalPaymentId = function(){
    return this.obj.ProvisionalPaymentId__c || null;
};

/**
 * コメント
 *
 * @returns {string|null}
 */
teasp.Tsf.ObjBase.prototype.getComment = function(){
    return (this.obj.Comment__c || null);
};

/**
 * 添付ファイル数を返す（申請レベルと明細レベルを合計）
 * @returns {number}
 */
teasp.Tsf.ObjBase.prototype.getAttachmentAllCount = function(){
    return 0;
};

/**
 * 精算区分・費目表示区分の不整合を表示するか
 * @returns {boolean}
 */
teasp.Tsf.ObjBase.prototype.isShowMisMatch = function(){
    if(this.isManifestEditMode()){ // 編集モードに移行した状態
        return true;
    }
    return (![
        teasp.constant.STATUS_ADMIT,               // 確定済み
        teasp.constant.STATUS_APPROVE,             // 承認済み
        teasp.constant.STATUS_PAYD,                // 精算済み
        teasp.constant.STATUS_CANCEL_WAIT,         // 取消伝票承認待ち
        teasp.constant.STATUS_CANCEL_APPROVE,      // 取消伝票承認済み
        teasp.constant.STATUS_JOURNAL              // 仕訳済み
    ].contains(this.obj.StatusD__c));
};

teasp.Tsf.ObjBase.prototype.createOrgExpIds = function(exps){
    this.orgExpIds = [];
    dojo.forEach(exps || [], function(exp){
        this.orgExpIds.push(exp.Id);
    }, this);
};

teasp.Tsf.ObjBase.prototype.getRemoveExpIds = function(exps){
    if(this.getId()){ // Id があるので、未申請明細ではない
        return [];
    }
    return this.getRemoveIdList(teasp.Tsf.formParams.sectionDetail.discernment);
};
