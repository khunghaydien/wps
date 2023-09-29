/**
 * 定期区間履歴
 *
 * @constructor
 */
teasp.Tsf.CommuterPass = function(commuterPass){
    this.obj = commuterPass;
};

teasp.Tsf.CommuterPass.prototype = new teasp.Tsf.ObjBase();

/**
 * 定期区間履歴の配列作成
 *
 * @param {Array.<Object>} commuterPasses
 * @returns {Array.<Object>}
 */
teasp.Tsf.CommuterPass.createList = function(commuterPasses){
    var lst = [];
    dojo.forEach(commuterPasses, function(commuterPass){
        this.push(new teasp.Tsf.CommuterPass(commuterPass));
    }, lst);
    return lst;
};

/**
 * キャンセルできるか
 *
 * @param {Array.<teasp.Tsf.CommuterPass>} passList 開始日の降順でソートされた定期区間履歴の配列
 * @param {string} id
 * @returns {boolean}
 */
teasp.Tsf.CommuterPass.isCancelable = function(passList, id){
    for(var i = 0 ; i < passList.length ; i++){
        var pass = passList[i];
        if(pass.getId() == id){
            return pass.isFix(); // キャンセル可
        }
        if(pass.isFix()){ // 先に確定済みの申請があるならキャンセル不可
            return false;
        }
    }
    return false;
};

/**
 * (承認済み|確定済み)かどうかを返す
 *
 * @param {Array.<teasp.Tsf.CommuterPass>}
 * @param {string} id
 * @returns {boolean}
 */
teasp.Tsf.CommuterPass.isValid = function(passList, id){
    for(var i = 0 ; i < passList.length ; i++){
        var pass = passList[i];
        if(pass.getId() == id){
            return pass.isValid();
        }
    }
    return false;
};

/**
 * 開始日の降順で一番上の有効な申請のすぐ後の無効な申請を返す。該当なしなら Null
 *
 * @param {Array.<teasp.Tsf.CommuterPass>} passList 開始日の降順でソートされた定期区間履歴の配列
 * @returns {teasp.Tsf.CommuterPass}
 */
teasp.Tsf.CommuterPass.getReuseApply = function(passList){
    var p = null;
    for(var i = 0 ; i < passList.length ; i++){
        var pass = passList[i];
        if(pass.isValid()){ // 有効な申請
            return p;
        }else{
            p = pass;
        }
    }
    return p;
};

teasp.Tsf.CommuterPass.getWaitApply = function(passList){
    for(var i = 0 ; i < passList.length ; i++){
        var pass = passList[i];
        if(pass.isWait()){ // 有効な申請
            return pass;
        }
    }
    return null;
};

teasp.Tsf.CommuterPass.prototype.getStartDate = function(){
    if(typeof(this.obj.StartDate__c) == 'number'){
        this.obj.StartDate__c = teasp.util.date.formatDate(this.obj.StartDate__c);
    }
    return this.obj.StartDate__c;
};

teasp.Tsf.CommuterPass.prototype.isValid = function(){
    return (/^(承認済み|確定済み)$/.test(this.obj.Status__c));
};

teasp.Tsf.CommuterPass.prototype.isWait = function(){
    return (/^承認待ち$/.test(this.obj.Status__c));
};

teasp.Tsf.CommuterPass.prototype.isFix = function(){
    return (/^(承認済み|確定済み|承認待ち)$/.test(this.obj.Status__c));
};

teasp.Tsf.CommuterPass.prototype.setStatus = function(status){
    this.obj.Status__c = status;
};

/**
 *
 * @returns {number}
 */
teasp.Tsf.CommuterPass.prototype.getPassFare = function(){
    return this.obj.PassFare__c || 0;
};

teasp.Tsf.CommuterPass.prototype.getRouteDescription = function(){
    if(!this.obj.RouteDescription__c){
        return teasp.message.getLabel(this.obj.StartDate__c ? 'tf10000340' : 'tm10003580'); // （停止） : （未登録）
    }
    return this.obj.RouteDescription__c;
};

teasp.Tsf.CommuterPass.prototype.getRouteCode        = function(){ return this.obj.RouteCode__c        || null; };
teasp.Tsf.CommuterPass.prototype.getPassPeriod       = function(){ return this.obj.PassPeriod__c       || null; };
teasp.Tsf.CommuterPass.prototype.getNote             = function(){ return this.obj.Note__c             || null; };
teasp.Tsf.CommuterPass.prototype.getStatus           = function(){ return this.obj.Status__c           || null; };
teasp.Tsf.CommuterPass.prototype.getRoute            = function(){ return this.obj.Route__c            || null; };
teasp.Tsf.CommuterPass.prototype.getTransfer         = function(){ return this.obj.Transfer__c         || false; };
