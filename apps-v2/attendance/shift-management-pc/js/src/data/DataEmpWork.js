teasp.provide('teasp.data.EmpWork');
/**
 * 工数実績明細データクラス
 *
 * @constructor
 */
teasp.data.EmpWork = function(workObj, extraItems){
    /** @private */
    this.workObj = workObj;
    this.extraItems = extraItems;
};

/**
 * 日付を返す
 * @return {string} 日付('yyyy-MM-dd')
 */
teasp.data.EmpWork.prototype.getDate = function(){
    return this.workObj.date;
};

/**
 * 工数実績連番を返す
 * @return {number} 工数実績連番
 */
teasp.data.EmpWork.prototype.getNo = function(){
    return this.workObj.order;
};
/**
 * 工程名を返す
 * @returns {string} 工程名文字列
 */
teasp.data.EmpWork.prototype.getProcess = function(){
	return this.workObj.process;
};

/**
 * ジョブIDを返す
 * @return {string} ジョブID
 */
teasp.data.EmpWork.prototype.getJobId = function(){
    return this.workObj.jobId;
};

/**
 * ジョブ名を返す
 * @return {string} ジョブ名
 */
teasp.data.EmpWork.prototype.getJobName = function(){
    return this.workObj.job.name;
};

/**
 * ジョブリーダーのIDを返す
 * @return {string} ジョブリーダーID
 */
teasp.data.EmpWork.prototype.getJobLeaderId = function(){
    return this.workObj.job.jobLeaderId;
};

/**
 * ジョブに充てた工程名を返す
 * @return {string} 工程名
 */
teasp.data.EmpWork.prototype.getProcessName = function(){
    return (!this.workObj.process)?'':this.workObj.process;
};

/**
 * 入力時間を返す
 * @return {number} 時間（分）
 */
teasp.data.EmpWork.prototype.getTime = function(){
    return (this.workObj.time || 0);
};

/**
 * パーセントを返す
 * @return {number} パーセント
 */
teasp.data.EmpWork.prototype.getPercent = function(time){
    if(time > 0){
        return Math.round(this.workObj.time * 1000 / time);
    }else{
        return this.workObj.percent;
    }
};

/**
 * ボリュームを返す
 * @return {number} ボリューム
 */
teasp.data.EmpWork.prototype.getVolume = function(){
    return (this.workObj.volume || 0);
};

/**
 * 進捗を返す
 * @returns {string} 進捗
 */
teasp.data.EmpWork.prototype.getProgress = function(){
    return (this.workObj.progress || '');
};

/**
 * タスク別作業報告を返す
 * @returns {string} タスク別作業報告文字列
 */
teasp.data.EmpWork.prototype.getTaskNote = function(){
    return (this.workObj.taskNote || '');
};

/**
 * 拡張項目１、２を返す
 * @returns {Array.<Object>} 拡張項目１、２
 */
teasp.data.EmpWork.prototype.getExtraItems = function(){
    return this.extraItems;
};
