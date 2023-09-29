teasp.provide('teasp.dialog.JobSelect');
/**
 * 日付選択ダイアログ
 *
 * @constructor
 * @extends teasp.dialog.Base
 */
teasp.dialog.JobSelect = function(){
    this.id = 'dialogJobSelect';
    this.title = teasp.message.getLabel('tm20004810') /*タスク選択*/;
    this.duration = 1;
    this.widthHint = 600;
    this.heightHint = 300;
    this.content = '<table border="0" cellpadding="0" cellspacing="0" style="font-size:12px;"><tr><td style="padding: 1em 1em 2em 1em"><div id="_jobListCell"></div></td></tr><tr><td style="text-align:center;padding-top:0px;"><input type="button" class="pb_base pb_btn_cancel" id="_job_cancel" style="font-size:13px;padding:6px 16px;"/></td></tr></table>';
    this.cancelLink = {
        id       : '_job_cancel',
        callback : this.close
    };

    this.eventHandles = [];
    this.busy = false;
};

teasp.dialog.JobSelect.prototype = new teasp.dialog.Base();

/**
 * 画面生成
 * @override
 */
teasp.dialog.JobSelect.prototype.preShow = function(){
    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    this.busy = true;

    if(dojo.byId('_jobListCell').firstChild){
        dojo.destroy(dojo.byId('_jobListCell').firstChild);
    }
    var select = dojo.create('select', {
        style   : { width:"588px" },
        id      : '_JobList'
    }, dojo.byId('_jobListCell'));
    if(!this.pouch.isRequireExpLinkJob()){
        dojo.create('option', { value : 'none', innerHTML : teasp.message.getLabel('tm20004010') /*（割当なし）*/ }, select);
    }
    var jobWorks = this.pouch.getJobWorks(this.pouch.getClassifyJobWorks(this.args.date), true);
    jobWorks = teasp.util.deleteHasSameJobId(jobWorks);
    var expJobs = this.pouch.getExpLogsJobs(this.args.date, jobWorks);
    if(expJobs.length > 0){
        jobWorks = jobWorks.concat(expJobs);
    }
    jobWorks = jobWorks.sort(function(a, b){
        return (a.jobCode < b.jobCode ? -1 : (a.jobCode > b.jobCode ? 1 : 0));
    });
    for(var i = 0 ; i < jobWorks.length ; i++){
        var jobWork = jobWorks[i];
        dojo.create('option', { value : jobWork.jobId, innerHTML : jobWork.jobCode + '  ' + jobWork.jobName }, select);
    }
    select.value = this.args.jobId;//初期選択を呼び出しダイアログと同じに
    this.eventHandles.push(dojo.connect(select, 'onchange', this, this.changedJob));

    teasp.message.setLabelTitle('_job_cancel','cancel_btn_title'); /*キャンセル*/

    this.dialog.startup();
    this.busy = false;

    return true;
};

/**
 * タスクを選択
 *
 */
teasp.dialog.JobSelect.prototype.changedJob = function(e){
    if(this.busy){
        return;
    }
    var select = e.target;
    var selectedOpt = select[select.selectedIndex];
    if(selectedOpt.value==this.args.jobId){
        alert(teasp.message.getLabel('tm20004820') /*変更先のタスクを選択してください。*/);
        return;
    }
    if(!confirm(teasp.message.getLabel('tm20004830',this.args.targetNumbers,selectedOpt.innerHTML) /*{0}件のデータを[{1}] で処理します。\nよろしいですか？*/)){
        //this.dialog.hide();
        return;
    }
    this.dialog.hide();
    this.onfinishfunc(selectedOpt.value);
};
