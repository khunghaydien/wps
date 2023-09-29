/**
 * ジョブクラス
 *
 * @constructor
 */
teasp.Tsf.Job = function(job){
    this.job = job;
};

/**
 * ジョブクラスのインスタンスの配列を作成
 * AtkJobAssign__c から持ってきたデータは要素名を形式を変える
 *
 * @param {Array.<Object>} jobs
 * @returns {Array.<teasp.Tsf.Job>}
 */
teasp.Tsf.Job.createListFromJobAssign = function(jobs){
    var lst = [];
    if(!jobs || jobs.length <= 0){
        return lst;
    }
    var mp = {};
    dojo.forEach(jobs, function(job){
        // ※ アサイン済みのものだけ
        if(job.JobId__c && job.JobId__r && !mp[job.JobId__c] && job.IsAssigned__c){
            lst.push(new teasp.Tsf.Job({
                Id              : job.JobId__c,
                JobCode__c      : job.JobId__r.JobCode__c || '',
                Name            : job.JobId__r.Name || '',
                IsAssigned__c   : job.IsAssigned__c,
                JobAssignId     : job.Id,
                StartDate__c    : job.JobId__r.StartDate__c || null,
                EndDate__c      : job.JobId__r.EndDate__c   || null,
                Active__c       : (job.JobId__r.Active__c === undefined ? true : job.JobId__r.Active__c)
            }));
            mp[job.JobId__c] = 1;
        }
    });
    return lst;
};

/**
 * ジョブIDを返す
 *
 * @returns {string}
 */
teasp.Tsf.Job.prototype.getId = function(){
    return this.job.Id || null;
};

/**
 * ジョブ名を返す
 *
 * @returns {string}
 */
teasp.Tsf.Job.prototype.getName = function(){
    return /** @type {string} */this.job.Name || '';
};

/**
 * ジョブコードを返す
 *
 * @returns {string}
 */
teasp.Tsf.Job.prototype.getCode = function(){
    return /** @type {string} */this.job.JobCode__c || '';
};

/**
 * 階層でインデントしたジョブ名を返す
 *
 * @returns {string}
 */
teasp.Tsf.Job.prototype.getDisplayName = function(){
    return /** @type {string} */(this.job.JobCode__c || '') + teasp.Tsf.JOB_CODE_NAME_DIV + (this.job.Name || '');
};

teasp.Tsf.Job.prototype.getStartDate = function(){
    if(this.job.StartDate__c && typeof(this.job.StartDate__c) == 'number'){
        this.job.StartDate__c = teasp.util.date.formatDate(this.job.StartDate__c);
    }
    return this.job.StartDate__c;
};

teasp.Tsf.Job.prototype.getEndDate = function(){
    if(this.job.EndDate__c && typeof(this.job.EndDate__c) == 'number'){
        this.job.EndDate__c = teasp.util.date.formatDate(this.job.EndDate__c);
    }
    return this.job.EndDate__c;
};

/**
 * ジョブの有効期間チェック
 * @param {string|null} fd 期間開始日
 * @param {string|null} td 期間終了日
 * @returns {Boolean}
 */
teasp.Tsf.Job.prototype.activeOnDate = function(fd, td){
    if(!fd && !td){
        return true;
    }
    var sd = this.getStartDate(); // ジョブの有効開始日
    var ed = this.getEndDate();   // ジョブの有効終了日
    if(!fd || !td){
        var d = fd || td;
        return ((!sd || sd <= d) && (!ed || d <= ed));
    }else{
        return ((!sd || sd <= td) && (!ed || fd <= ed));
    }
};

/**
 * オブジェクトを返す
 */
teasp.Tsf.Job.prototype.getObj = function(){
    return this.job;
};
