/**
 * オブジェクト・セクションクラス
 *
 * @constructor
 */
teasp.Tsf.Emp = function(emp){
    var o = (emp || {});
    this.org = o;
    this.emp = o.emp || {};
    this.setCommuterPasses(o.commuterPasses || []);
    this.jobAssigns  = teasp.Tsf.Job.createListFromJobAssign(o.jobAssigns || []);
    this.approverSet = o.approverSet || [];
};

teasp.Tsf.Emp.prototype.getJobAssigns = function(){
    return this.jobAssigns;
};

teasp.Tsf.Emp.prototype.getEmp = function(){
    return this.emp;
};

teasp.Tsf.Emp.prototype.clone = function(){
    return new teasp.Tsf.Emp(this.org);
};

/**
 * 社員IDを返す
 *
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getEmpId = function(){
    return this.emp.Id || '';
};

/**
 * 社員名を返す
 *
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getEmpName = function(){
    return this.emp.Name || '';
};

/**
 *
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getEmpCode = function(){
    return this.emp.EmpCode__c || '';
};

/**
 * ユーザIDを返す
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getUserId = function(){
    return (this.emp.UserId__c || null);
};

/**
 * 写真(大)URLを返す
 *
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getFullPhotoUrl = function(){
    return (this.emp.UserId__r ? this.emp.UserId__r.FullPhotoUrl : null) || '';
};

/**
 * 写真(小)URLを返す
 *
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getSmallPhotoUrl = function(){
    return (this.emp.UserId__r ? this.emp.UserId__r.SmallPhotoUrl : null) || '';
};

/**
 *
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getDeptId = function(){
    return this.emp.DeptId__c || null;
};

/**
 *
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getDept = function(){
    return this.emp.DeptId__r || null;
};

/**
 * 部署名を返す
 *
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getDeptName = function(){
    return (this.emp.DeptId__r && this.emp.DeptId__r.Name) || null;
};

/**
 *
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getDeptCode = function(){
    return (this.emp.DeptId__r && this.emp.DeptId__r.DeptCode__c) || null;
};

/**
 *
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getDeptExpItemClass = function(){
    return (this.emp.DeptId__r && this.emp.DeptId__r.ExpItemClass__c) || null;
};

/**
 * 勤務体系名を返す
 *
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getEmpTypeName = function(){
    return (this.emp.EmpTypeId__r ? this.emp.EmpTypeId__r.Name : null) || '';
};

teasp.Tsf.Emp.prototype.getManagerId    = function(){ return this.emp.Manager__c     || null;  }; // 上長ユーザID
teasp.Tsf.Emp.prototype.isExpAdmin      = function(){ return this.emp.IsExpAdmin__c  || false; }; // 経費管理者
teasp.Tsf.Emp.prototype.isAdmin         = function(){ return this.emp.IsAdmin__c     || false; }; // 管理者
teasp.Tsf.Emp.prototype.isAllEditor     = function(){ return this.emp.IsAllEditor__c || false; }; // スーパー編集権限
teasp.Tsf.Emp.prototype.isAllReader     = function(){ return this.emp.IsAllReader__c || false; }; // スーパー閲覧権限
teasp.Tsf.Emp.prototype.isDeptAdmin     = function(){ return this.emp.IsDeptAdmin__c || false; }; // 部署管理権限
teasp.Tsf.Emp.prototype.isJobAdmin      = function(){ return this.emp.IsJobAdmin__c  || false; }; // ジョブ管理者権限

teasp.Tsf.Emp.prototype.getExpHistory = function(){
    if(!this.emp.ExpHistory__c){
        this.emp.ExpHistory__c = {};
        return this.emp.ExpHistory__c;
    }
    if(typeof(this.emp.ExpHistory__c) == 'string'){
        this.emp.ExpHistory__c = teasp.Tsf.util.fromJson(this.emp.ExpHistory__c);
    }
    return this.emp.ExpHistory__c;
};

/**
 * 定期区間ロック
 * @returns {Boolean}
 */
teasp.Tsf.Emp.prototype.isCommuterRouteLock = function(){
    return this.emp.CommuterRouteLock__c || false;
};

/**
 * 領収書入力システムを使用する
 * @returns {Boolean}
 */
teasp.Tsf.Emp.prototype.isUsingReceiptSystem = function(){
    return this.emp.UsingReceiptSystem__c || false;
};

/**
 * J'sNAVI Jrを使用する
 * @returns {Boolean}
 */
teasp.Tsf.Emp.prototype.isUsingJsNaviSystem = function(){
    return this.emp.UsingJsNaviSystem__c || false;
};

/**
 * IC連携機能利用可
 * @returns {Boolean}
 */
teasp.Tsf.Emp.prototype.isUsingConnectIC = function(){
    return this.emp.UsingConnectIC__c || false;
};

/**
 * 駅探設定を返す
 * @returns {Object}
 */
teasp.Tsf.Emp.prototype.getExpConfigEx = function(dt){
    var expConfig = teasp.Tsf.Dom.clone(this.getExpConfig());
    var pass = this.getCommuterPass(dt);

    // 定期区間履歴が１件も登録されてないときのみ、ExpConfig__c に含まれる定期区間コードを使う
    var passEmpty = !this.getCommuterPasses().length;
    var configCommuterRouteCode = (passEmpty && expConfig.commuterRouteCode) || null;
    var configCommuterRouteNote = (passEmpty && expConfig.commuterRouteNote) || null;

    expConfig.commuterRouteCode  = (pass ? pass.getRouteCode()        : configCommuterRouteCode);
    expConfig.commuterRouteNote  = (pass ? pass.getRouteDescription() : configCommuterRouteNote);
    expConfig.commuterRouteRoute = (pass ? pass.getRoute() : null);
    expConfig.commuterRouteTransfer = (pass && pass.getTransfer()) || false;
    return expConfig;
};

teasp.Tsf.Emp.prototype.getExpConfig = function(){
    if(!this.emp.ExpConfig__c){
        this.emp.ExpConfig__c = {
            ekitanArea              : -1,       // 地域
            usePaidExpress          : true,     // 特急/新幹線
            useReservedSheet        : false,    // 特急料金
            preferredAirLine        : 0,        // 優先する航空会社
            routePreference         : 0,        // 検索結果のソート
            excludeCommuterRoute    : true,     // 定期区間の取扱
            commuterRouteCode       : null,     // 定期区間コード
            commuterRouteNote       : null      // 定期区間
        };
        return this.emp.ExpConfig__c;
    }
    if(typeof(this.emp.ExpConfig__c) == 'string'){
        this.emp.ExpConfig__c = teasp.Tsf.util.fromJson(this.emp.ExpConfig__c);
    }
    return this.emp.ExpConfig__c;
};

teasp.Tsf.Emp.prototype.setExpConfig = function(config){
    this.emp.ExpConfig__c = config;
};

teasp.Tsf.Emp.prototype.getCommuterPass = function(dt){
    var passes = this.getCommuterPasses();
    for(var i = 0 ; i < passes.length ; i++){
        var pass = passes[i];
        if(!pass.isValid()){
            continue;
        }
        if(!dt || !pass.getStartDate() || (pass.getStartDate() <= dt)){
            return pass;
        }
    }
    return null;
};

teasp.Tsf.Emp.prototype.getCommuterPasses = function(){
    return this.commuterPasses;
};

teasp.Tsf.Emp.prototype.setCommuterPasses = function(commuterPasses){
    this.commuterPasses = teasp.Tsf.CommuterPass.createList(commuterPasses || []);
};

/**
 * 定期区間履歴のステータスを最新にする
 *
 * @param {Array.<Object>} records
 */
teasp.Tsf.Emp.prototype.mergeCommuterPassStatus = function(records){
    dojo.forEach(this.commuterPasses, function(pass){
        for(var i = 0 ; i < records.length ; i++){
            var record = records[i];
            if(pass.getId() == record.Id && pass.getStatus() != record.Status__c){
                pass.setStatus(record.Status__c);
            }
        }
    });
};

teasp.Tsf.Emp.prototype.getStationHist = function(){
    var eh = this.getExpHistory();
    return eh.stationHist || [];
};

teasp.Tsf.Emp.prototype.setExpHistory = function(sh, route){
    var eh = this.getExpHistory();
    if(!eh.stationHist){
        eh.stationHist = [];
    }
    if(!eh.routeHist){
        eh.routeHist = [];
    }

    for(var i = eh.stationHist.length - 1 ; i >= 0 ; i--){
        var h = eh.stationHist[i];
        for(var j = 0 ; j < sh.length ; j++){
            if(sh[j].name == h.name){
                eh.stationHist.splice(i, 1);
                break;
            }
        }
    }
    eh.stationHist = sh.concat(eh.stationHist);

    for(var i = eh.routeHist.length - 1 ; i >= 0 ; i--){
        var h = eh.routeHist[i];
        if(route == h){
            eh.routeHist.splice(i, 1);
            break;
        }
    }
    eh.routeHist.unshift(route);

    if(eh.stationHist.length > 20){
        eh.stationHist.splice(20, eh.stationHist.length);
    }
    if(eh.routeHist.length > 10){
        eh.routeHist.splice(10, eh.routeHist.length);
    }
};

/**
 * 経費費目表示区分
 *
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getExpItemClass = function(){
    return this.emp.ExpItemClass__c || '';
};

/**
 * 精算方法
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getPayExpItemId = function(){
    return this.emp.PayExpItemId__c || '';
};

/**
 * 承認者設定ID
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getApproverId = function(type){
    var id = null;
    for(var i = 0 ; i < this.approverSet.length ; i++){
        var a = this.approverSet[i];
        if(a && a.Type__c == type){
            id = a.Id;
            break;
        }
    }
    return id;
};

/**
 * 承認者名
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getApproverNames = function(type){
    if(!this.approvers){
        this.approvers = {};
    }
    var approvers = this.approvers[type];
    if(!approvers){
        for(var i = 0 ; i < this.approverSet.length ; i++){
            var a = this.approverSet[i];
            if(a && a.Type__c == type){
                approvers = [
                  (a.Approver1__r  ? { id : a.Approver1__r.Id , name : a.Approver1__r.Name  } : null)
                , (a.Approver2__r  ? { id : a.Approver2__r.Id , name : a.Approver2__r.Name  } : null)
                , (a.Approver3__r  ? { id : a.Approver3__r.Id , name : a.Approver3__r.Name  } : null)
                , (a.Approver4__r  ? { id : a.Approver4__r.Id , name : a.Approver4__r.Name  } : null)
                , (a.Approver5__r  ? { id : a.Approver5__r.Id , name : a.Approver5__r.Name  } : null)
                , (a.Approver6__r  ? { id : a.Approver6__r.Id , name : a.Approver6__r.Name  } : null)
                , (a.Approver7__r  ? { id : a.Approver7__r.Id , name : a.Approver7__r.Name  } : null)
                , (a.Approver8__r  ? { id : a.Approver8__r.Id , name : a.Approver8__r.Name  } : null)
                , (a.Approver9__r  ? { id : a.Approver9__r.Id , name : a.Approver9__r.Name  } : null)
                , (a.Approver10__r ? { id : a.Approver10__r.Id, name : a.Approver10__r.Name } : null)
                ];
                break;
            }
        }
        if(!approvers){
            this.approvers[type] = approvers = [];
        }else{
            this.approvers[type] = approvers;
        }
    }
    var names = [];
    var fn = null;
    for(var i = 0 ; i < approvers.length ; i++){
        var o = approvers[i];
        if(!o){
            continue;
        }
        if(!fn || fn != o.id){
            names.push(o.name);
            if(!fn){
                fn = o.id;
            }
        }
    }
    return names.join(', ');
};

/**
 * 承認者設定情報を更新
 *
 * @param {Array.<Object>} approverSet
 */
teasp.Tsf.Emp.prototype.setApproverSet = function(approverSet){
    this.approverSet = approverSet || [];
    this.approvers = {};
};

teasp.Tsf.Emp.prototype.getStartEndByYearMonth = function(month){
    return teasp.util.searchYearMonthDate(
            (this.emp.EmpTypeId__r ? this.emp.EmpTypeId__r.ConfigBaseId__r.InitialDateOfMonth__c : 1),
            (this.emp.EmpTypeId__r ? this.emp.EmpTypeId__r.ConfigBaseId__r.MarkOfMonth__c : 1),
            month);
};

/**
 * 勤怠社員のJSON設定値を取得
 * @returns {Object|null}
 */
teasp.Tsf.Emp.prototype.getConfig = function(){
    if(this.emp.Config__c && typeof(this.emp.Config__c) == 'string'){
        this.emp.Config__c = teasp.Tsf.util.fromJson(this.emp.Config__c);
    }
    return (this.emp.Config__c || null);
};

teasp.Tsf.Emp.prototype.getExpenseTypes = function(){
    var config = this.getConfig();
    return (config && config.expenseTypes) || [];
};

/**
 * ジョブ割当区分を指定するジョブ検索条件を返す
 * @returns {string}
 */
teasp.Tsf.Emp.prototype.getEmpJobSearchCondition = function(){
    if(this.emp.JobAssignClass__c){
        return "(JobAssignClass__c like '%:" + this.emp.JobAssignClass__c + ":%' or JobAssignClass__c = null)";
    }
    return "JobAssignClass__c = null";
};

teasp.Tsf.Emp.prototype.isMatchEmpJobAssignClass = function(assignClass){
    if(!assignClass){
        return true;
    }
    var l = assignClass.split(/:/);
    for(var i = l.length - 1 ; i >= 0 ; i--){
        var s = l[i].trim();
        if(!s){
            l.splice(i, 1);
        }
    }
    return l.contains(this.emp.JobAssignClass__c);
};
