/**
 * 【経費】経費明細クラスを返す
 * @param {Object} expLog 経費明細オブジェクト
 * @return {teasp.data.EmpExp}
 */
teasp.data.Pouch.prototype.getExpLog = function(expLog){
    return new teasp.data.EmpExp(expLog);
};

/**
 * 【経費】外貨テーブルを返す
 * @return {Object} data.foreignCurrency
 */
teasp.data.Pouch.prototype.getCurrencyTable = function(){
    return this.dataObj.foreignCurrency;
};

/**
 * 【経費】駅探を使用するか
 * @return {boolean} true:使用する
 */
teasp.data.Pouch.prototype.isUseEkitan = function(){
    return this.dataObj.common.useEkitan;
};

/**
 * 【経費】定期期間を返す
 * @return {string} 定期期間
 */
teasp.data.Pouch.prototype.getTicketPeriod = function(){
    return this.dataObj.common.ticketPeriod;
};

/**
 * 【経費】
 * @return {number}
 */
teasp.data.Pouch.prototype.getEkitanArea = function(){
    return (typeof(this.dataObj.common.ekitanArea) != 'number' ? -1 : this.dataObj.common.ekitanArea);
};

/**
 * 【経費】 定期区間ロック状態を返す
 * @return {boolean} true:定期区間ロックしている
 */
teasp.data.Pouch.prototype.isCommuterRouteLock = function(){
    return (this.dataObj.targetEmp.commuterRouteLock || false);
};

/**
 * 【経費】 定期区間の表示文字列を返す
 * @return {string} 定期区間の表示文字列
 */
teasp.data.Pouch.prototype.getCommuterRouteNote = function(){
    var cps = this.dataObj.commuterPasses || [];
    var des = null;
    for(var i = 0 ; i < cps.length ; i++){
        var cp = cps[i];
        if(teasp.constant.STATUS_APPROVES.contains(cp.status)){
            if(cp.routeDescription){
                des = cp.routeDescription;
            }else{
                des = teasp.message.getLabel(cp.startDate ? 'tf10000340' : 'tm10003580'); // （停止） : （未登録）
            }
            break;
        }
    }
    return (des || this.dataObj.targetEmp.commuterRouteNote || teasp.message.getLabel('tm10003580')); // （未登録）
};

/**
 * 【経費】 定期区間の表示文字列をセットする
 * @param {string} note 定期区間の表示文字列
 */
teasp.data.Pouch.prototype.setCommuterRouteNote = function(note){
    this.dataObj.targetEmp.commuterRouteNote = note;
};

/**
 * 【経費】駅探検索設定情報を返す
 * @return {Object} 駅探検索設定情報
 */
teasp.data.Pouch.prototype.getExpConfig = function(){
    if(typeof(this.dataObj.targetEmp.expConfig) == 'string'){
        this.dataObj.targetEmp.expConfig = dojo.fromJson(this.dataObj.targetEmp.expConfig);
    }
    return this.dataObj.targetEmp.expConfig;
};

/**
 * 【経費】駅探設定をセット
 * @param {Object} o 駅探設定情報オブジェクト
 */
teasp.data.Pouch.prototype.setExpConfig = function(o){
    this.dataObj.targetEmp.expConfig = o;
};

/**
 * 【経費】経費申請のステータスに応じたスタイルシートのセレクタを返す
 *
 * @param {string} status ステータス
 * @return {string} スタイルシートのセレクタ
 */
teasp.data.Pouch.prototype.getExpStatusIconClass = function(status){
    if(!status){
        return 'pb_status_noapp_dis';
    }
    if(status == teasp.constant.STATUS_PAYD){
        return 'pb_status_pay';
    }else if(teasp.constant.STATUS_CANCELS.contains(status)){
        return 'pb_status_cancel';
    }
    return this.getStatusIconClass(status, false);
};

/**
 * 【経費】経費申請のステータスに応じたスタイルシートのセレクタを返す
 *
 * @return {string} スタイルシートのセレクタ
 */
teasp.data.Pouch.prototype.getExpApplyStatusIconClass = function(){
    return this.getExpStatusIconClass(this.dataObj.expApply ? this.dataObj.expApply.status : null);
};

/**
 * 【経費】経費明細IDから経路オブジェクトを返す
 *
 * @param {string} id ID
 * @return {?Object} 経路オブジェクト
 */
teasp.data.Pouch.prototype.getExpLogRouteById = function(id){
    for(var i = 0 ; i < this.dataObj.expLogs.length ; i++){
        if(teasp.util.equalId(this.dataObj.expLogs[i].id, id)){
            return (this.dataObj.expLogs[i].route || null);
        }
    }
    return null;
};

/**
 * 【経費】経費精算の承認ワークフローを使用するか
 * @return {boolean} true:私用する
 */
teasp.data.Pouch.prototype.isUseExpWorkFlow = function(){
    return this.dataObj.common.expWorkflow;
};

/**
 * 【経費】経費精算の承認申請（申請）可能か
 * @return {boolean} true:経費精算の承認申請（申請）可能
 */
teasp.data.Pouch.prototype.isExpApplyable = function(){
    return ((!this.dataObj.expApply || !teasp.constant.STATUS_FIX.contains(this.dataObj.expApply.status)) && this.getExpLogs().length > 0);
};

/**
 * 【経費】経費精算は申請済みか
 * @return {boolean} true:申請済み
 */
teasp.data.Pouch.prototype.isExpApplyFixed = function(flag){
    return (this.dataObj.expApply ? (teasp.constant.STATUS_FIX.contains(this.dataObj.expApply.status) || (flag && teasp.constant.STATUS_REJECTS.contains(this.dataObj.expApply.status))) : false);
};

/**
 * 【経費】経費精算の申請オブジェクトを返す
 * @return {?Object} 経費精算の申請オブジェクト
 */
teasp.data.Pouch.prototype.getExpApply = function(){
    return (this.dataObj.expApply || null);
};

/**
 * 【経費】経費精算の申請IDを返す
 * @return {string} 経費精算の申請ID
 */
teasp.data.Pouch.prototype.getExpApplyId = function(){
    return (this.dataObj.expApply ? (this.dataObj.expApply.id || null) : null);
};

/**
 * 【経費】経費精算申請の承認者が自分かどうか
 *
 * @return {boolean} 承認者である場合、true
 */
teasp.data.Pouch.prototype.isEmpExpApprover = function(){
    if(this.isCancelApplyWait()){ // 取消伝票が承認待ち
        return (this.dataObj.approver && this.dataObj.approver[this.dataObj.expApply.expCancelApplyId]);
    }
    var isEmpExpApp = false;
    if(this.dataObj.expApply && this.dataObj.expApply.statusC == teasp.constant.STATUS_WAIT){
        isEmpExpApp = (this.dataObj.expApply ? this.isApprover(this.dataObj.expApply) : false);
        isEmpExpApp = (this.dataObj.isJobLeader ? true : isEmpExpApp);
    }
    return isEmpExpApp;
};

/**
 * 【経費】経費精算の申請ステータスを返す
 * @param {boolean=} true:表示用のステータス  false:制御用のステータス
 * @return {string} 経費精算の申請ステータス
 */
teasp.data.Pouch.prototype.getExpApplyStatus = function(flag){
    if(flag){
        return (this.dataObj.expApply && this.dataObj.expApply.statusD || null);
    }else{
        return (this.dataObj.expApply && this.dataObj.expApply.statusC || null);
    }
};

/**
 * 経費精算の取消伝票が承認待ちならtrueを返す
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isCancelApplyWait = function(){
    return (this.dataObj.expApply && this.dataObj.expApply.expCancelApplyStatus == teasp.constant.STATUS_WAIT);
};

/**
 * 経費精算の取消伝票が承認済みならtrueを返す
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isCancelApproved = function(){
    return (this.dataObj.expApply && teasp.constant.STATUS_APPROVES.contains(this.dataObj.expApply.expCancelApplyStatus));
};

/**
 * 経費精算の取消伝票の承認者を返す
 * @returns {string}
 */
teasp.data.Pouch.prototype.getCancelApproverName = function(){
    return (this.isCancelApproved() && this.dataObj.expApply.expCancelApproverName || '');
};

/**
 * 経費精算の取消伝票の承認日時を返す
 * @returns {string}
 */
teasp.data.Pouch.prototype.getCancelApproveTime = function(){
    return (this.isCancelApproved() && this.dataObj.expApply.expCancelApproveTime || '');
};

/**
 * 【経費】経費精算の申請番号を返す
 * @return {string} 経費精算の申請番号
 */
teasp.data.Pouch.prototype.getExpApplySeqNo = function(){
    return (this.dataObj.expApply ? (this.dataObj.expApply.expApplyNo || null) : null);
};

/**
 * 【経費】経費精算の申請コメントを返す
 * @return {string} 経費精算の申請コメント
 */
teasp.data.Pouch.prototype.getExpApplyComment = function(){
    return (this.dataObj.expApply ? (this.dataObj.expApply.comment || ''  ) : ''  );
};

/**
 * 【経費】経費精算の申請日時を返す
 * @return {string} 経費精算の申請日時('yyyy/MM/dd HH:mm')
 */
teasp.data.Pouch.prototype.getExpApplyTime = function(){
    return (this.dataObj.expApply && this.dataObj.expApply.applyTime ? teasp.util.date.formatDateTime(this.dataObj.expApply.applyTime,   'SLA-HM') : '');
};

/**
 * 【経費】経費精算の承認日時を返す
 * @return {string} 経費精算の承認日時('yyyy/MM/dd HH:mm')
 */
teasp.data.Pouch.prototype.getExpApproveTime = function(){
    var steps = (this.dataObj.expApplySteps || []);
    if(steps.length > 0){
        return teasp.util.date.formatDateTime(steps[steps.length - 1].createdDate, 'SLA-HM');
    }
    return (this.dataObj.expApply && this.dataObj.expApply.approveTime ? teasp.util.date.formatDateTime(this.dataObj.expApply.approveTime, 'SLA-HM') : '');
};

/**
 * 【経費】経費精算の精算日を返す
 * @return {string} 経費精算の精算日('yyyy/MM/dd')
 */
teasp.data.Pouch.prototype.getExpPayDate = function(){
    return (this.dataObj.expApply && this.dataObj.expApply.payDate ? teasp.util.date.formatDate(this.dataObj.expApply.payDate, 'SLA') : '');
};

/**
 * 【経費】経費精算の承認者名を返す
 * @return {string} 経費精算の承認者名
 */
teasp.data.Pouch.prototype.getExpApproverName = function(){
    var steps = (this.dataObj.expApplySteps || []);
    if(steps.length > 0){
        return steps[steps.length - 1].actorName;
    }
    return (this.dataObj.expApply ? (this.dataObj.expApply.approverName || ''  ) : ''  );
};

/**
 * 【経費】経費精算の明細リストを返す
 * @return {Array.<Object>} 経費精算の明細リスト
 */
teasp.data.Pouch.prototype.getExpLogs = function(){
    return (this.dataObj.expLogs     || []);
};

/**
 * 【経費】費目オブジェクトリストを返す
 * @return {Array.<Object>} 費目オブジェクトリスト
 */
teasp.data.Pouch.prototype.getExpItems = function(){
    return (this.dataObj.expItems    || []);
};

/**
 * 【経費】発着駅の履歴リストを返す
 * @return {Array.<Object>} 発着駅の履歴リスト
 */
teasp.data.Pouch.prototype.getStationHist = function(){
    return (this.dataObj.stationHist || []);
};

/**
 * 【経費】発着駅の履歴リストをセット
 * @param {Array.<Object>} lst 発着駅の履歴リスト
 */
teasp.data.Pouch.prototype.setStationHist = function(lst){
    this.dataObj.stationHist = lst;
};

/**
 * 【経費】経路の履歴リストを返す
 * @return {Array.<Object>} 経路の履歴リスト
 */
teasp.data.Pouch.prototype.getRouteHist = function(){
    return (this.dataObj.routeHist   || []);
};

/**
 * 【経費】経路の履歴リストをセット
 * @param {Array.<Object>} lst 経路の履歴リスト
 */
teasp.data.Pouch.prototype.setRouteHist = function(lst){
    this.dataObj.routeHist = lst;
};

/**
 * 【経費】申請リストを返す
 * @return {Array.<Object>} 申請リスト
 */
teasp.data.Pouch.prototype.getExpApplyHistory = function(){
    return (this.dataObj.expApplyHistory || []);
};

/**
 * 【経費】日付と申請IDをキーとして経費明細情報を差し替える
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @param {string} expApplyId 申請ID
 * @param {Array.<Object>} expLogs 経費明細情報
 */
teasp.data.Pouch.prototype.replaceExpLogs = function(dkey, expApplyId, expLogs){
    var allExpLogs   = (this.dataObj.expLogs || []);
    for(var i = allExpLogs.length - 1 ; i >= 0 ; i--){
        var expLog = allExpLogs[i];
        if(expLog.date == dkey
        && teasp.util.equalId(expLog.expApplyId, expApplyId)){
            allExpLogs.splice(i, 1);
        }
    }
    allExpLogs = allExpLogs.concat(expLogs);
    this.dataObj.expLogs = allExpLogs.sort(function(a, b){
        var n = teasp.util.date.compareDate(a.date, b.date);
        if(n == 0){
            return (a.order - b.order);
        }
        return n;
    });
    var n = 0;
    var d = null;
    for(i = 0 ; i < this.dataObj.expLogs.length ; i++){
        var expLog = this.dataObj.expLogs[i];
        if(expLog.date != d){
            d = expLog.date;
            n = 1;
        }
        expLog.no = (n++);
    }
};

/**
 * 【経費】上長が経費を変更出来るかどうか
 * @return {boolean} true:変更可能
 */
teasp.data.Pouch.prototype.isChangeableByManager = function(expApply){
    var isChangeAble = false;
    var ea = (expApply || this.dataObj.expApply);
    if(this.dataObj.common.allowEditManager
    && teasp.util.equalId(this.dataObj.sessionInfo.user.id, this.dataObj.targetEmp.managerId)
    && (ea.status == teasp.constant.STATUS_APPROVING || ea.status == teasp.constant.STATUS_WAIT)) {
        isChangeAble = true;
    }
    return isChangeAble;
};

/**
 * 【経費】経費管理者が経費を変更出来るかどうか
 * @return {boolean} true:変更可能
 */
teasp.data.Pouch.prototype.isChangeableByExpAdmin = function(expApply){
    var isChangeAble = false;
    var ea = (expApply || this.dataObj.expApply);
    if(this.isExpAdmin() && ea) {
        if(this.dataObj.common.allowEditExpAdmin) {
            if(this.dataObj.expApply.status == teasp.constant.STATUS_APPROVING
            || this.dataObj.expApply.status == teasp.constant.STATUS_APPROVE
            || this.dataObj.expApply.status == teasp.constant.STATUS_WAIT) {
                isChangeAble = true;
            }
        } else if(this.dataObj.common.allowEditManager){
            if(this.dataObj.expApply.status == teasp.constant.STATUS_APPROVING
            || this.dataObj.expApply.status == teasp.constant.STATUS_WAIT) {
                isChangeAble = true;
            }
        }
    }
    return isChangeAble;
};

/**
 * 【経費】指定日の全経費に紐づくジョブ情報（ID、コード、名称）のリストを返す
 *
 * @param {?string} dkey 日付('yyyy-MM-dd')
 * @param {Array.<Object>} excludes 工数実績に含まれているジョブオブジェクトのリスト（それらを除外して抽出する）
 * @return {Array.<Object>} ジョブ情報の配列
 */
teasp.data.Pouch.prototype.getExpLogsJobs = function(dkey, excludes){
    var expJobs = [];
    var allExpLogs = (this.dataObj.expLogs || []);
    var enmap = {};
    for(var i = 0 ; i < excludes.length ; i++){
        if(excludes[i].jobId){
            enmap[excludes[i].jobId] = 1;
        }
    }
    for(i = 0 ; i < allExpLogs.length ; i++){
        var expLog = allExpLogs[i];
        if((dkey && expLog.date != dkey) || !expLog.job){
            continue;
        }
        if(!enmap[expLog.jobId]){
            expJobs.push({
                jobId      : expLog.jobId,
                jobCode    : expLog.job.code,
                jobName    : expLog.job.name
            });
            enmap[expLog.jobId] = 1;
        }
    }
    return expJobs;
};

/**
 * 【経費】関連する稟議の情報を返す
 * @return {Object}
 */
teasp.data.Pouch.prototype.getRingiObj = function(){
    return (this.dataObj.expApply && (this.dataObj.expApply.ringi || {}));
};

/**
 * 【経費】申請時の部署名を返す。申請済みでない場合は、現在の所属部署を返す
 * @param {boolean} flag trueの場合、申請時の部署名が空なら現在の所属部署を返す
 * @return {string} 申請時の部署名
 */
teasp.data.Pouch.prototype.getExpApplyDeptName = function(flag){
    return ((this.dataObj.expApply ? this.dataObj.expApply.deptName : (flag ? this.getDeptName() : null)) || '');
};
/**
 * 申請レベルの添付ファイル
 * @returns {Array.<Object>}
 */
teasp.data.Pouch.prototype.getAttachments = function(){
    return (this.dataObj.expApply && this.dataObj.expApply.attachments || []);
};
/**
 * 精算区分
 * @returns {string}
 */
teasp.data.Pouch.prototype.getExpenseType = function(){
    return (this.dataObj.expApply && this.dataObj.expApply.expenseType || null);
};
/**
 * 精算方法
 * @returns {string}
 */
teasp.data.Pouch.prototype.getPayExpItemName = function(){
    return (this.dataObj.expApply && this.dataObj.expApply.payExpItemName || null);
};
/**
 * 申請日
 * @returns {string}
 */
teasp.data.Pouch.prototype.getApplyDate = function(){
    return (this.dataObj.expApply && this.dataObj.expApply.applyDate || null);
};
/**
 * 支払予定日
 * @returns {string}
 */
teasp.data.Pouch.prototype.getPayDate = function(){
    return (this.dataObj.expApply && this.dataObj.expApply.payDate || null);
};
/**
 * 仮払申請
 * @returns {string}
 */
teasp.data.Pouch.prototype.getProvisionalPaymentTitle = function(){
    return (this.dataObj.expApply && this.dataObj.expApply.provisionalPaymentTitle || null);
};
/**
 * 事前申請の仮払金額
 * @returns {string}
 */
teasp.data.Pouch.prototype.getExpPreApplyPpAmount = function(){
    return (this.dataObj.expApply && this.dataObj.expApply.expPreApplyPpAmount || 0);
};
/**
 * ジョブ
 * @returns {string}
 */
teasp.data.Pouch.prototype.getChargeJobName = function(){
    var code = (this.dataObj.expApply && this.dataObj.expApply.chargeJobCode || null);
    var name = (this.dataObj.expApply && this.dataObj.expApply.chargeJobName || null);
    return (!code && !name) ? null : (code || '') + ' ' + (name || '');
};
/**
 * 負担部署
 * @returns {string}
 */
teasp.data.Pouch.prototype.getChargeDeptName = function(){
    var code = (this.dataObj.expApply && this.dataObj.expApply.chargeDeptCode || null);
    var name = (this.dataObj.expApply && this.dataObj.expApply.chargeDeptName || null);
    return (!code && !name) ? null : (code || '') + ' ' + (name || '');
};
/**
 * 拡張項目１
 * @returns {string}
 */
teasp.data.Pouch.prototype.getExtraItem1 = function(){
    return (this.dataObj.expApply && this.dataObj.expApply.extraItem1 || null);
};
/**
 * 拡張項目２
 * @returns {string}
 */
teasp.data.Pouch.prototype.getExtraItem2 = function(){
    return (this.dataObj.expApply && this.dataObj.expApply.extraItem2 || null);
};
