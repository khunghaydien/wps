/**
 * 【工数】工数実績明細クラスを返す
 * @param {Object} work 工数実績明細オブジェクト
 * @return {teasp.data.EmpWork}
 */
teasp.data.Pouch.prototype.getEmpWork = function(work){
    return new teasp.data.EmpWork(work, this.getExtraItems(work));
};

/**
 * 【工数】進捗の選択肢を返す
 * @return {Array.<string>} 進捗の選択肢
 */
teasp.data.Pouch.prototype.getProgressList = function(){
    return (this.dataObj.common.progressList || []);
};

/**
 * 【工数】工程の選択肢を返す
 * @return {Array.<string>} 工程の選択肢
 */
teasp.data.Pouch.prototype.getProcessList = function(job){
    if(job && job.processList){
        return (job.processList.split(/\r?\n/) || []);
    }
    return (this.dataObj.common.processList || []);
};

/**
 * 【工数】工数入力方式を返す
 * @return {number} 0:ボリュームで入力、1:時間で入力
 */
teasp.data.Pouch.prototype.getWorkInputType = function(){
    return this.dataObj.targetEmp.workInputType;
};

/**
 * 【工数】工数入力方式をセット
 * @param {number} val 0:ボリュームで入力、1:時間で入力
 */
teasp.data.Pouch.prototype.setWorkInputType = function(val){
    this.dataObj.targetEmp.workInputType = val;
};

/**
 * 【工数】デフォルトの工数入力は時間入力か
 *
 * @param {boolean=} flag =Trueなら時間入力固定かどうかを返す
 * @return {boolean} =True:時間入力, =False:ボリューム入力
 */
teasp.data.Pouch.prototype.isWorkInputTimeFix = function(flag){
    if(flag){
        return (this.dataObj.targetEmp.leftoverJobId || this.dataObj.common.leftoverJobId);
    }
    return (this.dataObj.targetEmp.workInputType == 1 || this.dataObj.targetEmp.leftoverJobId || this.dataObj.common.leftoverJobId);
};

/**
 * 【工数】残工数を登録するジョブのIDを返す
 *
 * @param {boolean} flag 共通設定のジョブIDのみ返す
 * @return {?string} 残工数を登録するジョブID
 */
teasp.data.Pouch.prototype.getLeftoverJobId = function(flag){
    if(flag){
        return this.dataObj.common.leftoverJobId;
    }
    return (this.dataObj.targetEmp.leftoverJobId || this.dataObj.common.leftoverJobId);
};

/**
 * 【工数】残工数を登録するジョブをセット
 *
 * @param {Object} o
 */
teasp.data.Pouch.prototype.setLeftoverJob = function(o){
    this.dataObj.targetEmp.leftoverJobId        = o.leftoverJobId;
    this.dataObj.targetEmp.leftoverJobCode      = o.leftoverJobCode;
    this.dataObj.targetEmp.leftoverJobName      = o.leftoverJobName;
    this.dataObj.targetEmp.leftoverJobStartDate = o.leftoverJobStartDate;
    this.dataObj.targetEmp.leftoverJobEndDate   = o.leftoverJobEndDate;
    this.dataObj.targetEmp.leftoverJobActive    = o.leftoverJobActive;
    this.dataObj.targetEmp.leftoverJobAssignClass = o.leftoverJobAssignClass;
};

/**
 * 【工数】社員による残工数を登録するジョブの変更を許可するか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isPermitChangeLeftoverJob = function(){
    return this.dataObj.common.permitChangeLeftoverJob;
};

/**
 * 【工数】作業報告を入力するか
 * @return {boolean} true:入力する
 */
teasp.data.Pouch.prototype.getWorkNoteOption = function(){
    return this.dataObj.targetEmp.workNoteOption;
};

/**
 * 【工数】作業報告を入力するかどうかをセット
 * @param {boolean} val true:する false:しない
 */
teasp.data.Pouch.prototype.setWorkNoteOption = function(val){
    this.dataObj.targetEmp.workNoteOption = val;
};

/**
 * 【工数】日報テンプレート
 * @return {string}
 */
teasp.data.Pouch.prototype.getWorkNoteTemplate = function(){
    return this.dataObj.common.workNoteTemplate;
};

/**
 * 【工数】タスク毎の作業報告を入力するか
 * @return {boolean} true:入力する
 */
teasp.data.Pouch.prototype.getTaskNoteOption = function(){
    return this.dataObj.targetEmp.taskNoteOption;
};

/**
 * 【工数】タスク毎の作業報告を入力するかどうかをセット
 * @param {boolean} val true:する false:しない
 */
teasp.data.Pouch.prototype.setTaskNoteOption = function(val){
    this.dataObj.targetEmp.taskNoteOption = val;
};

/**
 * 【工数】工数実績確定済みか
 *
 * @return {boolean} true:済み
 */
teasp.data.Pouch.prototype.isJobMonthFixed = function(){
    return (this.dataObj.jobApply && teasp.constant.STATUS_FIX.contains(this.dataObj.jobApply.status));
};

teasp.data.Pouch.prototype.isJobMonthFixedByDate = function(dt){
    var ja = null;
    if(this.dataObj.jobApplys){
        for(var i = 0 ; i < this.dataObj.jobApplys.length ; i++){
            var o = this.dataObj.jobApplys[i];
            if(o.startDate <= dt && dt <= o.endDate){
                ja = o;
                break;
            }
        }
    }
    if(!ja){
        ja = this.dataObj.jobApply;
    }
    return (ja && teasp.constant.STATUS_FIX.contains(ja.status));
};

/**
 * 【工数】月次工数実績はリードオンリー（参照モードで開いているor確定済み）か
 * @return {boolean} 月次工数実績はリードオンリー（参照モードで開いているor確定済み）
 */
teasp.data.Pouch.prototype.isJobMonthReadOnly = function(){
    return (this.isJobMonthFixed() || this.isReadOnly());
};

/**
 * 【工数】月次工数実績を承認申請（確定）できるか
 * @return {boolean} 月次工数実績を承認申請（確定）できる
 */
teasp.data.Pouch.prototype.isJobApplyable = function(){
    return (!this.dataObj.jobApply || !teasp.constant.STATUS_FIX.contains(this.dataObj.jobApply.status));
};

/**
 * 【工数】月次工数実績の承認ワークフローを使用するか
 * @return {boolean} 月次工数実績の承認ワークフローを使用する
 */
teasp.data.Pouch.prototype.isUseJobWorkFlow = function(){
    return this.dataObj.common.jobWorkflow;
};

/**
 * 【工数】月次工数実績の確定をするか
 * @return {boolean} する
 */
teasp.data.Pouch.prototype.isDontFixJobMonthly = function(){
    return this.dataObj.common.dontFixJobMonthly;
};

/**
 * 【工数】工数入力時間をチェックする場合、許容範囲を分で返す
 * @return {Object} 工数入力時間をチェックする
 */
teasp.data.Pouch.prototype.getCheckWorkingOkTime = function(){
    return { minus: -60, plus: 0 };
};

/**
 * 【工数】月次工数実績の月度を返す
 * @return {number} 月次工数実績の月度(yyyyMM)
 */
teasp.data.Pouch.prototype.getJobYearMonth = function(){
    return this.dataObj.jobApply.yearMonth;
};

/**
 * 当月の月度を "YYYY年MM月度" 形式で返す
 * flag=true なら "YYYY年MM月" 形式で返す
 * @return {string}
 */
teasp.data.Pouch.prototype.getJobYearMonthJp = function(flag){
    var ym = this.getObj().jobApply.yearMonth;
    var sn = this.getObj().jobApply.subNo;
    return teasp.util.date.formatMonth((flag ? 'zv00000021' : 'zv00000020'), Math.floor(ym / 100), (ym % 100), sn);
};

/**
 * 月次工数実績の開始日を返す
 * @return {string}
 */
teasp.data.Pouch.prototype.getJobStartDate = function(){
    return this.dataObj.jobApply.startDate;
};

/**
 * 月次工数実績のサブナンバーを返す
 * @return {number} 月次工数実績のサブナンバー
 */
teasp.data.Pouch.prototype.getJobSubNo = function(){
    return this.dataObj.jobApply.subNo || null;
};

/**
 * 【工数】月次工数実績の申請オブジェクトを返す
 * @return {Object} 月次工数実績の申請オブジェクト
 */
teasp.data.Pouch.prototype.getJobApply = function(){
    return this.dataObj.jobApply;
};

/**
 * 【工数】月次工数実績の申請IDを返す
 * @return {string} 月次工数実績の申請ID
 */
teasp.data.Pouch.prototype.getJobApplyId = function(){
    return (this.dataObj.jobApply ? (this.dataObj.jobApply.id || null) : null);
};

/**
 * 【工数】月次工数実績の申請のステータスを返す
 * @param {boolean=} flag trueのとき、'ＸＸ取消'なら'未確定'と返す
 * @return {?String} 月次工数実績の申請のステータス
 */
teasp.data.Pouch.prototype.getJobApplyStatus = function(flag){
    var status = (this.dataObj.jobApply ? (this.dataObj.jobApply.status  || null) : null);
    if(flag && teasp.constant.STATUS_CANCELS.contains(status)){ // ＸＸ取消
        return teasp.constant.STATUS_NOTADMIT; // 未確定
    }
    return status || teasp.constant.STATUS_NOTADMIT;
};

/**
 * 【工数】月次工数実績のステータス表示用のスタイルシートのセレクタを返す
 * @return {string} 月次工数実績のステータス表示用のスタイルシートのセレクタ
 */
teasp.data.Pouch.prototype.getJobApplyStatusIconClass = function(){
    return this.getStatusIconClass(this.getJobApplyStatus(true), false);
};

/**
 * 【工数】経費精算申請の承認者が自分かどうか
 *
 * @return {boolean} 承認者である場合、true
 */
teasp.data.Pouch.prototype.isEmpJobApprover = function(){
    return (this.dataObj.jobApply ? this.isApprover(this.dataObj.jobApply) : false);
};

/**
 * 【工数】工数実績の月度の起算日を返す
 * @return {number} 工数実績の月度の起算日
 */
teasp.data.Pouch.prototype.getJobInitialDayOfMonth = function(){
    return this.dataObj.common.jobInitialDayOfMonth;
};

/**
 * 【工数】工数実績の月度の表記を返す
 * @return {number} 工数実績の月度の表記<ul><li>1・・起算日に合わせる</li><li>2・・締め日に合わせる</li></ul>
 */
teasp.data.Pouch.prototype.getJobMarkOfMonth = function(){
    return this.dataObj.common.jobMarkOfMonth;
};

/**
 * 【工数】日付から工数実績の月度を得る
 * @param {string} dkey 日付(yyyy-MM-dd)
 * @return {Object} yearMonth, startDate, endDate の要素を持つオブジェクト
 */
teasp.data.Pouch.prototype.getJobMonthByDate = function(dkey){
    return teasp.util.searchYearMonthDate(this.dataObj.common.jobInitialDayOfMonth, this.dataObj.common.jobMarkOfMonth, null, dkey);
};

/**
 * 【工数】工数実績データを返す
 * @return {Array.<Object>} 工数実績データ
 */
teasp.data.Pouch.prototype.getWorks = function(){
    return this.dataObj.works;
};

/**
 * 【工数】指定日の作業報告を返す
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @param {boolean} flag trueなら変換しないで返す
 * @return {string} 作業報告
 */
teasp.data.Pouch.prototype.getJobWorkNote = function(dkey, flag){
    if(!this.dataObj.workNotes[dkey]){
        return '';
    }
    if(flag){
        return (this.dataObj.workNotes[dkey].workNote || '');
    }
    return this.convNoteString(teasp.util.entitize(this.dataObj.workNotes[dkey].workNote));
};

/**
 * 【工数】指定日の実労働時間を返す.<br/>
 * 裁量労働の場合は裁量ではなく実際の労働時間、
 * 残業申請制で認められない残業時間は含まない
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {number} 実労働時間（分）
 */
teasp.data.Pouch.prototype.getJobWorkRealTime = function(dkey){
    return (this.dataObj.workNotes[dkey] ? (this.dataObj.workNotes[dkey].workNetTime || 0) : 0);
};

/**
 * 【工数】指定日の出社・退社時刻が入力されていれば、暫定フラグ false を返す
 *
 * @return {boolean} 暫定フラグ
 */
teasp.data.Pouch.prototype.getZanteiFlag = function(dkey){
    var o = this.dataObj.workNotes[dkey];
    return (o && o.startTime && o.endTime) ? false : true;
};

/**
 * 出社したか（出社・退社両方入っていればtrue）
 * @param {string} dkey
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isWorked = function(dkey){
    var o = this.dataObj.workNotes[dkey];
    return (o && teasp.util.time.isValidRange(o.startTime, o.endTime)) || false;
};

/**
 * 【工数】指定日が月次確定済みかどうかを返す.<br/>
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {boolean} =true:日次確定済み
 */
teasp.data.Pouch.prototype.isMonthFixByDate = function(dkey){
    if(!this.dataObj.workNotes[dkey]){
        return false;
    }
    return (teasp.constant.STATUS_FIX.contains(this.dataObj.workNotes[dkey].monthApplyStatus));
};

/**
 * 【工数】指定日が日次確定済みかどうかを返す.<br/>
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {boolean} =true:日次確定済み
 */
teasp.data.Pouch.prototype.isDailyFixByDate = function(dkey){
    if(this.isMonthFixByDate(dkey)){
        return true;
    }
    return (this.dataObj.workNotes[dkey] ? teasp.constant.STATUS_FIX.contains(this.dataObj.workNotes[dkey].dailyApplyStatus) : false);
};

/**
 * 【工数】工数実績情報をマージして返す
 *
 * @param {Object} classifyJobWorks 仕分けした工数実績オブジェクト
 * @param {Boolean=} flag true:ソートしない false:並び順設定どおりにソートする
 * @return {Array.<Object>} 工数実績情報
 */
teasp.data.Pouch.prototype.getJobWorks = function(classifyJobWorks, flag){
    var lst = classifyJobWorks.assignWorks
        .concat(classifyJobWorks.recordWorks);
    var mp = {
        'recordWorks'   : 0,
        'assignWorks'   : 1,
        'scheduleWorks' : 2
    };
    if(!flag){
        lst.sort(function(a, b){
            var n = (a.key ? mp[a.key] : -1) - (b.key ? mp[b.key] : -1);
            if(n){
                return n;
            }
            return (a.order - b.order);
        });
        // 残工数ジョブがあれば並び順の最後にくるように修正する
        for(var i = 0 ; i < (lst.length - 1) ; i++){
            if(lst[i].leftover){
                lst.push(lst.splice(i, 1)[0]);
                break;
            }
        }
    }
    var dp = {};
    for(var i = 0 ; i < lst.length ; i++){
        var j = lst[i];
        var k = [j.jobId + ':' + (j.process || '')];
        j.copied = (dp[k] ? true : false);
        dp[k] = j;
    }
    return lst;
};

/**
 * 【工数】アサイン済みの工数実績情報を返す。
 *
 * @param {Object} classifyJobWorks 仕分けした工数実績オブジェクト
 * @return {Array.<Object>} 工数実績情報
 */
teasp.data.Pouch.prototype.getAssignWorks = function(classifyJobWorks){
    return classifyJobWorks.assignWorks.sort(function(a, b){
        return (a.order - b.order);
    });
};

/**
 * 【工数】アサインしてないかつ実績未入力だがメンバーに登録されている工数実績情報を返す。
 *
 * @param {Object} classifyJobWorks 仕分けした工数実績オブジェクト
 * @return {Array.<Object>} 工数実績情報
 */
teasp.data.Pouch.prototype.getMemberJobs = function(classifyJobWorks){
    // ジョブコード順でソートして返す（#7583）
    return classifyJobWorks.members.sort(function(a, b){
        return (a.jobCode < b.jobCode ? -1 : 1);
    });
};

/**
 * 【工数】ジョブアサインされたオブジェクト構造の作成
 *
 * @param {Object} classifyJobWorks 仕分けした工数実績オブジェクト
 * @param {Object} job ジョブオブジェクト
 * @param {number} order 並び順
 *
 * @return {Array.<Object>} 登録用に整形されたジョブオブジェクトのクローン
 */
teasp.data.Pouch.prototype.absorbAssignJob = function(classifyJobWorks, job, order){
    var l = [];
    for(var key in classifyJobWorks){
        if(classifyJobWorks.hasOwnProperty(key)){
            var lst = classifyJobWorks[key];
            for(var i = 0 ; i < lst.length ; i++){
                if((teasp.util.equalId(lst[i].jobId, job.jobId))&&(lst[i].process == job.process)){
                    if(key == 'assignJobs'){ // すでに割り当てられている
                        var jw = dojo.clone(lst[i]);
                        jw.order = order;
                        l.push(jw);
                    }else{
                        var jw = classifyJobWorks[key].splice(i, 1)[0];
                        jw.key = 'assignJobs';
                        jw.order = order;
                        jw.process = job.process;
                        l.push(jw);
                    }
                }
            }
        }
    }
    if(l.length <= 0){
        l.push({
            jobAssign      : null,
            jobId          : job.jobId,
            jobCode        : job.jobCode,
            jobName        : job.jobName,
            isAssigned     : true,
            jobLeader      : (job.jobLeader ? job.jobLeader    : null),
            work           : null,
            workId         : null,
            time           : 0,
            volume         : 0,
            percent        : 0,
            timeFix        : this.isWorkInputTimeFix(),
            progress       : null,
            taskNote       : null,
            process        : job.process,
            extraItem1     : null,
            extraItem2     : null,
            extraItem1Name : null,
            extraItem2Name : null,
            order          : order,
            seq            : teasp.sequence.jobWork++
        });
    }
    return l;
};
/**
 * 【工数】ジョブのアサイン
 * 【工数】ジョブ構造の作成
 *
 * @param {Object} classifyJobWorks 仕分けした工数実績オブジェクト
 * @param {Object} job ジョブオブジェクト
 * @param {number} order 並び順
 */
teasp.data.Pouch.prototype.assignJob = function(classifyJobWorks, job, order){
    for(var key in classifyJobWorks){
        if(classifyJobWorks.hasOwnProperty(key)){
            var lst = classifyJobWorks[key];
            for(var i = 0 ; i < lst.length ; i++){
                if(teasp.util.equalId(lst[i].jobId, job.jobId)){
                    if(lst[i].process == job.process){
                        if(key == 'assignWorks'){ // すでに割り当てられている
                            lst[i].order = order;
                            return;
                        }
                        var jw = classifyJobWorks[key].splice(i, 1)[0];
                        jw.key = 'assignWorks';
                        jw.order = order;
                        jw.process = job.process;
                        classifyJobWorks.assignWorks.push(jw);
                        return;
                    }
                }
            }
        }
    }
    var jw = {
        jobAssign      : null,
        jobId          : job.jobId,
        jobCode        : job.jobCode,
        jobName        : job.jobName,
        isAssigned     : true,
        jobLeader      : (job.jobLeader ? job.jobLeader    : null),
        work           : null,
        workId         : null,
        time           : 0,
        volume         : 0,
        percent        : 0,
        timeFix        : this.isWorkInputTimeFix(),
        progress       : null,
        taskNote       : null,
        extraItem1     : null,
        extraItem2     : null,
        extraItem1Name : null,
        extraItem2Name : null,
        process        : job.process,
        order          : order,
        seq            : teasp.sequence.jobWork++
    };
    classifyJobWorks.assignWorks.push(jw);
    return;
};

/**
 * 【工数】ジョブのアサイン解除
 *
 * @param {Object} classifyJobWorks 仕分けした工数実績オブジェクト
 * @param {Object} job ジョブオブジェクト
 */
teasp.data.Pouch.prototype.releaseJob = function(classifyJobWorks, job){
    for(var key in classifyJobWorks){
        if(classifyJobWorks.hasOwnProperty(key)){
            var lst = classifyJobWorks[key];
            for(var i = 0 ; i < lst.length ; i++){
                if(teasp.util.equalId(lst[i].jobId, job.jobId)){
                    if(key != 'assignJobs'){ // すでに割当解除されている
                        return;
                    }
                    var jw = classifyJobWorks[key].splice(i, 1)[0];
                    if(job.assignLimit){
                        jw.key = 'members';
                        classifyJobWorks.members.push(jw);
                    }
                    return;
                }
            }
        }
    }
};

/**
 * 【工数】ジョブコードから工数実績の取り込み。
 *
 * @param {Object} classifyJobWorks 仕分けした工数実績オブジェクト
 * @param {{
 *            code: {string}, // ジョブコード
 *            minutes: {number}, // 工数
 *            inner: {boolean} // 取込範囲内ならtrue
 *        }} timeInfo
 * @param {Array.<Object>} jobs ジョブオブジェクトの配列
 * @param {string} dkey 日付
 * @return {?Object} 工数実績オブジェクト
 */
teasp.data.Pouch.prototype.entryScheduledJob = function(classifyJobWorks, timeInfo, jobs, dkey){
    var orderMax = 0;
    var actJob = null;
    var lst = (classifyJobWorks.recordWorks || []).concat(classifyJobWorks.assignWorks || []);
    for(var i = 0 ; i < lst.length ; i++){
        var jw = lst[i];
        if(jw.jobCode == timeInfo.code){
            if(!jw.process){
                return lst[i];
            }else if(!actJob){
                actJob = jw;
            }
        }
        if(orderMax < jw.order){
            orderMax = jw.order;
        }
    }
    if(actJob){
        return actJob;
    }
    if(!timeInfo.minutes && !timeInfo.inner){
        return null;
    }
    lst = (classifyJobWorks.assignJobs || []).concat(classifyJobWorks.members || []);
    for(var i = 0 ; i < lst.length ; i++){
        if(lst[i].jobCode == timeInfo.code){
            var jw = lst[i];
            if((jw.startDate && dkey < jw.startDate)
            || (jw.endDate && jw.endDate < dkey)){
                jw.ngFact = teasp.data.Pouch.NG_JOB_OUT_OF_TERM;
            }else{
                jw.seq = teasp.sequence.jobWork++;
                jw.key = 'scheduleWorks';
                if(!classifyJobWorks.recordWorks || !classifyJobWorks.recordWorks.length){
                    classifyJobWorks.recordWorks = [];
                }
                if(!classifyJobWorks.assignTmps || !classifyJobWorks.assignTmps.length){
                    classifyJobWorks.assignTmps = [];
                }
                classifyJobWorks.recordWorks.push(jw);
                classifyJobWorks.assignTmps.push(jw);
            }
            return jw;
        }
    }
    var ngFact = 0;
    actJob = null;
    for(var i = 0 ; i < jobs.length ; i++){
        var job =jobs[i];
        if(job.jobCode == timeInfo.code){
            actJob = job;
            if(job.assignLimit && !job.assignSelf){ // 直接社員割当
                ngFact = teasp.data.Pouch.NG_JOB_ASSIGN_EMP;

            }else if(job.jobAssignClass
            && job.jobAssignClass.indexOf(':' + (this.dataObj.targetEmp.jobAssignClass || '') + ':') < 0){ // ジョブ割当区分で制限
                ngFact = teasp.data.Pouch.NG_JOB_ASSIGN_CLASS;

            }else if((job.startDate && dkey < job.startDate)
            || (job.endDate && job.endDate < dkey)){
                ngFact = teasp.data.Pouch.NG_JOB_OUT_OF_TERM;

            }
            break;
        }
    }
    if(actJob){
        var jw = {
            jobAssign      : null,
            jobId          : actJob.jobId,
            jobCode        : actJob.jobCode,
            jobName        : actJob.jobName,
            isAssigned     : false,
            work           : null,
            workId         : null,
            time           : 0,
            volume         : 0,
            percent        : 0,
            timeFix        : this.isWorkInputTimeFix(),
            progress       : null,
            taskNote       : null,
            extraItem1     : null,
            extraItem2     : null,
            extraItem1Name : null,
            extraItem2Name : null,
            process        : null,
            seq            : teasp.sequence.jobWork++,
            ngFact         : ngFact,
            key            : 'scheduleWorks',
            processList    : actJob.processList
        };
        if(!ngFact){
            jw.order = orderMax + 1;
            if(!classifyJobWorks.recordWorks || !classifyJobWorks.recordWorks.length){
                classifyJobWorks.recordWorks = [];
            }
            if(!classifyJobWorks.assignTmps || !classifyJobWorks.assignTmps.length){
                classifyJobWorks.assignTmps = [];
            }
            classifyJobWorks.recordWorks.push(jw);
            classifyJobWorks.assignTmps.push(jw);
        }
        return jw;
    }
    return null;
};

/**
 * 【工数】日付をキーとして工数実績情報を差し替える
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @param {Array.<Object>} works 工数実績情報
 */
teasp.data.Pouch.prototype.replaceWorks = function(dkey, works){
    delete this.dataObj.classifyJobWorks;
    var allWorks   = this.dataObj.works;
    for(var i = allWorks.length - 1 ; i >= 0 ; i--){
        var work = allWorks[i];
        if(work.date == dkey){
            allWorks.splice(i, 1);
        }
    }
    allWorks = allWorks.concat(works);
    this.dataObj.works = allWorks.sort(function(a, b){
        var n = teasp.util.date.compareDate(a.date, b.date);
        if(n == 0){
            return (a.order - b.order);
        }
        return n;
    });
};

/**
 * 指定日に工数が入力されているか
 * @param dkey
 * @returns {Boolean}
 */
teasp.data.Pouch.prototype.isExistWorksByDate = function(dkey){
    var works = this.dataObj.works || [];
    for(var i = 0 ; i < works.length ; i++){
        if(works[i].date == dkey){
            return true;
        }
    }
    return false;
};

/**
 * 【工数】日付をキーとして作業報告を差し替える
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @param {string} workNote 作業報告
 */
teasp.data.Pouch.prototype.replaceWorkNote = function(dkey, workNote){
    if(this.dataObj.days){
        this.getEmpDay(dkey).setWorkNote(workNote);
    }
    if(!this.dataObj.workNotes){
        return;
    }
    if(!this.dataObj.workNotes[dkey]){
        this.dataObj.workNotes[dkey] = { workRealTime : 0 };
    }
    this.dataObj.workNotes[dkey].workNote = workNote;
};

/**
 * 【工数】ジョブが有効期間内かつジョブ割当区分にマッチするか
 *
 * @param {Object} job ジョブオブジェクト
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @returns {number} =1:有効期間内で割当制限内 =0:割当制限内で有効期間外 =-1:割当制限外 =-2:無効
 */
teasp.data.Pouch.prototype.getAssignableJob = function(job, dkey){
    if(!job.active){
        return -2;
    }
    if(job.jobAssignClass){ // ジョブ割当区分あり
        var js = job.jobAssignClass.split(/:/);
        for(var i = js.length - 1 ; i >= 0 ; i--){
            if(!js[i]){
                js.splice(i, 1);
            }
        }
        if(!js.contains(this.getJobAssignClass())){ // 社員のジョブ割当区分にマッチしない
            return -1;
        }
    }
    if((!job.startDate || teasp.util.date.compareDate(job.startDate, dkey) <= 0)
    && (!job.endDate   || teasp.util.date.compareDate(dkey, job.endDate) <= 0)){
        return 1;
    }
    return 0;
};

/**
 * 【工数】仕訳済みの工数実績情報を返す.
 * ジョブアサイン情報と入力済みの工数実績情報をマージして以下のように仕分けたリストを格納したオブジェクト返す。
 *     <ol>
 *     <li>アサイン済み・かつ・（実績入力済み・または・ジョブが有効期間内）</li>
 *     <li>1に該当しない・かつ・メンバー登録・かつ・実績入力済み</li>
 *     <li>未アサイン・かつ・メンバー登録・かつ・ジョブが有効期間内</li>
 *     <li>未アサイン・かつ・メンバー未登録・かつ・実績入力済み</li>
 *     </ol>
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {Object} 仕訳済みの工数実績情報オブジェクト
 */
teasp.data.Pouch.prototype.getClassifyJobWorks = function(dkey, flag){
    if(this.dataObj.classifyJobWorks && dkey && this.dataObj.classifyJobWorks[dkey]){
        return this.dataObj.classifyJobWorks[dkey];
    }
    var allWorks   = (this.dataObj.works || []);
    var jobAssigns = (this.dataObj.jobAssigns || []);
    var lo = (this.dataObj.targetEmp.leftoverJobId ? this.dataObj.targetEmp : this.dataObj.common);
    if(lo.leftoverJobId && lo.leftoverJobActive && !this.isJobMonthFixed()){
        var ix = -1;
        for(var i = 0 ; i < jobAssigns.length ; i++){
            if(teasp.util.equalId(jobAssigns[i].jobId, lo.leftoverJobId)
            && !jobAssigns[i].process){
                ix = i;
                break;
            }
        }
        if(ix < 0){
            jobAssigns.push({
                id    : null,
                jobId : lo.leftoverJobId,
                job   : {
                    code        : lo.leftoverJobCode,
                    name        : lo.leftoverJobName,
                    deptId      : null,
                    startDate   : lo.leftoverJobStartDate,
                    endDate     : lo.leftoverJobEndDate,
                    assignLimit : false,
                    accountId   : null,
                    jobLeaderId : null,
                    jobLeader   : '',
                    explain     : '',
                    active      : true,
                    jobAssignClass: lo.leftoverJobAssignClass
                },
                isAssigned : true,
                order      : Number.MAX_VALUE,
                process    : null,
                leftover   : true
            });
        }else{
            jobAssigns[ix].order = Number.MAX_VALUE;
            jobAssigns[ix].leftover = true;
            jobAssigns[ix].isAssigned = true;
        }
        jobAssigns = jobAssigns.sort(function(a, b){
            return a.order - b.order;
        });
    }
    var workLink = {};
    var works = [];
    for(var i = 0 ; i < allWorks.length ; i++){
        var work = allWorks[i];
        if(dkey && work.date != dkey){
            continue;
        }
        works.push(work);
        work.assign = false;
        var ja = null;
        for(var j = 0 ; j < jobAssigns.length ; j++){
            var jobAssign = jobAssigns[j];
            if(teasp.util.equalId(jobAssign.jobId, work.jobId) && (jobAssign.process == work.process)){
                ja = jobAssign;
                break;
            }else if(flag && !ja && teasp.util.equalId(jobAssign.jobId, work.jobId)){
                ja = jobAssign;
            }
        }
        if(ja){
            var l = workLink[ja.id];
            if(!l){
                l = workLink[ja.id] = [];
            }
            l.push(work);
            work.process = ja.process;
            work.assign = true;
            if(ja.leftover){
                work.timeFix = false;
                if(work.volume){
                    work.volume = 100;
                }
            }
        }
    }
    var assignWorks   = [];
    var members       = [];
    var recordWorks   = [];
    var assignJobs    = [];
    for(var j = 0 ; j < jobAssigns.length ; j++){
        var jobAssign = jobAssigns[j];
        var l = (workLink[jobAssign.id] || []);
        var assignable = this.getAssignableJob(jobAssign.job, dkey);
        var acty = (dkey && assignable > 0); // 期限内かどうか
        if(jobAssign.isAssigned && assignable >= 0){
            assignJobs.push({
                jobAssign      : jobAssign,
                jobId          : jobAssign.jobId,
                jobCode        : jobAssign.job.code,
                jobName        : jobAssign.job.name,
                deptId         : jobAssign.job.deptId,
                deptCode       : jobAssign.job.deptCode,
                deptName       : jobAssign.job.deptName,
                isAssigned     : true,
                jobLeader      : (jobAssign.job.jobLeader || null),
                work           : null,
                workId         : null,
                time           : null,
                volume         : (jobAssign.leftover ? 100 : null),
                percent        : 0,
                timeFix        : (jobAssign.leftover ? false : this.isWorkInputTimeFix()),
                progress       : null,
                taskNote       : null,
                process        : jobAssign.process,
                extraItem1     : null,
                extraItem2     : null,
                extraItem1Name : null,
                extraItem2Name : null,
                startDate      : jobAssign.job.startDate,
                endDate        : jobAssign.job.endDate,
                order          : jobAssign.order,
                key            : 'assignJobs',
                leftover       : jobAssign.leftover || false
            });
        }
        if(jobAssign.isAssigned && assignable >= 0 && (acty || l.length > 0)){
            if(l.length <= 0){
                assignWorks.push({
                    jobAssign      : jobAssign,
                    jobId          : jobAssign.jobId,
                    jobCode        : jobAssign.job.code,
                    jobName        : jobAssign.job.name,
                    deptId         : jobAssign.job.deptId,
                    deptCode       : jobAssign.job.deptCode,
                    deptName       : jobAssign.job.deptName,
                    isAssigned     : true,
                    jobLeader      : (jobAssign.job.jobLeader || null),
                    work           : null,
                    workId         : null,
                    time           : null,
                    volume         : (jobAssign.leftover ? 100 : null),
                    percent        : 0,
                    timeFix        : (jobAssign.leftover ? false : this.isWorkInputTimeFix()),
                    progress       : null,
                    taskNote       : null,
                    process        : jobAssign.process,
                    extraItem1     : null,
                    extraItem2     : null,
                    extraItem1Name : null,
                    extraItem2Name : null,
                    startDate      : jobAssign.job.startDate,
                    endDate        : jobAssign.job.endDate,
                    order          : jobAssign.order,
                    seq            : teasp.sequence.jobWork++,
                    key            : 'assignWorks',
                    leftover       : jobAssign.leftover || false
                });
            }else{
                for(var k = 0 ; k < l.length ; k++){
                    var work = l[k];
                    if(!acty && work.time <= 0 && work.volume <= 0 && !work.progress && !work.taskNote && !work.extraItem1 && !work.extraItem2){ // 期限切れかつ入力値なし
                        continue;
                    }
                    assignWorks.push({
                        jobAssign      : jobAssign,
                        jobId          : jobAssign.jobId,
                        jobCode        : jobAssign.job.code,
                        jobName        : jobAssign.job.name,
                        deptId         : jobAssign.job.deptId,
                        deptCode       : jobAssign.job.deptCode,
                        deptName       : jobAssign.job.deptName,
                        isAssigned     : true,
                        jobLeader      : (jobAssign.job.jobLeader || null),
                        work           : work,
                        workId         : work.id,
                        time           : work.time,
                        volume         : work.volume,
                        percent        : work.percent,
                        timeFix        : work.timeFix,
                        progress       : work.progress,
                        taskNote       : work.taskNote,
                        process        : work.process,
                        extraItem1     : work.extraItem1,
                        extraItem2     : work.extraItem2,
                        extraItem1Name : work.extraItem1Name,
                        extraItem2Name : work.extraItem2Name,
                        startDate      : jobAssign.job.startDate,
                        endDate        : jobAssign.job.endDate,
                        order          : jobAssign.order,
                        seq            : teasp.sequence.jobWork++,
                        key            : 'assignWorks',
                        leftover       : jobAssign.leftover || false
                    });
                }
            }
        }else if(l.length > 0){
            for(var k = 0 ; k < l.length ; k++){
                var work = l[k];
                work.assign = false;
            }
        }else if(dkey && this.getAssignableJob(jobAssign.job, dkey) > 0){
            members.push({
                jobAssign      : jobAssign,
                jobId          : jobAssign.jobId,
                jobCode        : jobAssign.job.code,
                jobName        : jobAssign.job.name,
                deptId         : jobAssign.job.deptId,
                deptCode       : jobAssign.job.deptCode,
                deptName       : jobAssign.job.deptName,
                isAssigned     : false,
                work           : null,
                workId         : null,
                jobLeader      : (jobAssign.job.jobLeader || null),
                time           : null,
                volume         : null,
                percent        : 0,
                timeFix        : this.isWorkInputTimeFix(),
                progress       : null,
                taskNote       : null,
                process        : null,
                extraItem1     : null,
                extraItem2     : null,
                extraItem1Name : null,
                extraItem2Name : null,
                startDate      : jobAssign.job.startDate,
                endDate        : jobAssign.job.endDate,
                order          : jobAssign.order,
                seq            : teasp.sequence.jobWork++,
                key            : 'members',
                leftover       : jobAssign.leftover || false
            });
        }
    }
    //------------------------------------------------------------------------
    //membersの整形

    if(members.length>0){
        members = members.sort(function(a, b){
            return (a.jobId < b.jobId ? -1 : 1);
        });
        //アサインされたワークスの中に同じジョブＩＤが存在してたらmembersから削除
        for(i = 0 ; i < members.length ; i++){
            for(var j = 0;j<assignWorks.length;j++){
                if(assignWorks[j].jobId == members[i].jobId){
                    members.splice(i,1);
                    i--;
                    break;
                }
            }
        }
        // 重複ジョブを配列から除く
        for(i = 0 ; i < members.length-1 ; i++){
            if(members[i].jobId == members[i+1].jobId){
                members.splice(i,1);
                i--;
            }
        }
    }
    //------------------------------------------------------------------------

    var sumTime = 0;
    var sumVolume = 0;
    for(i = 0 ; i < works.length ; i++){
        var work = works[i];
        sumTime   += work.time;
        sumVolume += work.volume;
        if(!work.assign){
            recordWorks.push({
                jobAssign      : null,
                jobId          : work.jobId,
                jobCode        : work.job.code,
                jobName        : work.job.name,
                deptId         : work.job.deptId,
                deptCode       : work.job.deptCode,
                deptName       : work.job.deptName,
                isAssigned     : false,
                jobLeader      : (work.job.jobLeader?work.job.jobLeader:    null),
                work           : work,
                workId         : work.id,
                time           : work.time,
                volume         : work.volume,
                percent        : work.percent,
                timeFix        : work.timeFix,
                progress       : work.progress,
                taskNote       : work.taskNote,
                process        : work.process,
                extraItem1     : work.extraItem1,
                extraItem2     : work.extraItem2,
                extraItem1Name : work.extraItem1Name,
                extraItem2Name : work.extraItem2Name,
                startDate      : work.job.startDate,
                endDate        : work.job.endDate,
                order          : work.order,
                seq            : teasp.sequence.jobWork++,
                key            : 'recordWorks'
            });
        }
    }
    if(!this.dataObj.classifyJobWorks){
        this.dataObj.classifyJobWorks = {};
    }
    var o = {
        assignJobs         : assignJobs,
        assignWorks        : assignWorks,
        members            : members,
        recordWorks        : recordWorks,
        sumTime            : sumTime,
        sumVolume          : sumVolume
    };
    if(dkey){
        this.dataObj.classifyJobWorks[dkey] = o;
        return this.dataObj.classifyJobWorks[dkey];
    }
    return o;
};

/**
 * 【工数】仕訳済みの工数実績情報オブジェクトをセット
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @param {Object} classifyJobWorks 仕訳済みの工数実績情報オブジェクト
 */
teasp.data.Pouch.prototype.setClassifyJobWorks = function(dkey, classifyJobWorks){
    if(!this.dataObj.classifyJobWorks){
        this.dataObj.classifyJobWorks = {};
    }
    this.dataObj.classifyJobWorks[dkey] = classifyJobWorks;
};

/**
 * 【工数】仕訳済みの工数実績情報オブジェクトをクリア
 *
 */
teasp.data.Pouch.prototype.clearClassifyJobWorks = function(){
    delete this.dataObj.classifyJobWorks;
    var l = (this.dataObj.jobAssigns || []);
    for(var i = l.length - 1 ; i >= 0 ; i--){
        var j = this.dataObj.jobAssigns[i];
        if(j.leftover){
            this.dataObj.jobAssigns.splice(i, 1);
        }
    }
};

/**
 * 【工数】ジョブコードからジョブ情報（ID、コード、名称）を返す
 *
 * @param {string} code ジョブコード
 * @return {?Object} ジョブ情報（ID、コード、名称）
 */
teasp.data.Pouch.prototype.getJobByCode = function(code){
    for(var i = 0 ; i < this.dataObj.jobAssigns.length ; i++){
        var jobAssign = this.dataObj.jobAssigns[i];
        if(jobAssign.job.code == code){
            return {
                jobId      : jobAssign.jobId,
                jobCode    : jobAssign.job.code,
                jobName    : jobAssign.job.name,
                startDate  : jobAssign.job.startDate,
                endDate    : jobAssign.job.endDate
            };
        }
    }
    for(var i = 0 ; i < this.dataObj.works.length ; i++){
        var work = this.dataObj.works[i];
        if(work.job.code == code){
            return {
                jobId      : work.jobId,
                jobCode    : work.job.code,
                jobName    : work.job.name,
                startDate  : work.job.startDate,
                endDate    : work.job.endDate
            };
        }
    }
    return null;
};

/**
 * 【工数】 ジョブIDからジョブ情報（ID、コード、名称）を返す
 *
 * @param {string} id ジョブID
 * @param {boolean=} flag true なら jobAssign だけでマッチング
 * @return {?Object} ジョブ情報（ID、コード、名称）
 */
teasp.data.Pouch.prototype.getJobById = function(id, flag){
    for(var i = 0 ; i < this.dataObj.jobAssigns.length ; i++){
        var jobAssign = this.dataObj.jobAssigns[i];
        if(jobAssign.jobId == id){
            return {
                jobId      : jobAssign.jobId,
                jobCode    : jobAssign.job.code,
                jobName    : jobAssign.job.name,
                startDate  : jobAssign.job.startDate,
                endDate    : jobAssign.job.endDate
            };
        }
    }
    if(!flag){
        for(var i = 0 ; i < this.dataObj.works.length ; i++){
            var work = this.dataObj.works[i];
            if(work.jobId == id){
                return {
                    jobId      : work.jobId,
                    jobCode    : work.job.code,
                    jobName    : work.job.name,
                    startDate  : work.job.startDate,
                    endDate    : work.job.endDate
                };
            }
        }
    }
    return null;
};

/**
 * 【工数】 工数入力時間の合計が実労働時間と合致するようにボリューム入力の時間換算値を調整する
 *
 * @param {Array.<Object>} jobWorks 工数情報の配列
 * @param {number} workNetTime 実労働時間
 * @param {boolean=} convedTime ボリューム入力は時間に換算済み
 */
teasp.data.Pouch.prototype.adjustJobWorkTimes = function(jobWorks, workNetTime, convedTime){
    var maxPerIndex = -1;
    var maxPercent = 0;
    var perIndexes = [];
    var sumTime = 0;
    for(var i = 0 ; i < jobWorks.length ; i++){
        if(jobWorks[i].timeFix){
            sumTime += jobWorks[i].time;
        }
    }
    var zanTime = Math.max(workNetTime - sumTime, 0);
    for(var i = 0 ; i < jobWorks.length ; i++){
        var jobWork = jobWorks[i];
        if(jobWork.timeFix){
            continue;
        }
        if(!convedTime){
            if(jobWork.percent > 0 && zanTime > 0){
                jobWork.time = Math.round(zanTime * jobWork.percent / 1000);
            }else{
                jobWork.time = null;
            }
        }
        if(jobWork.time !== null){
            perIndexes.push(i);
            if(jobWork.percent > maxPercent){
                maxPercent = jobWork.percent;
                maxPerIndex = i;
            }
        }
    }
    if(maxPerIndex >= 0){
        for(i = 0 ; i < perIndexes.length ; i++){
            var x = perIndexes[i];
            if(x != maxPerIndex){
                var jobWork = jobWorks[x];
                if(jobWork.time > zanTime){
                    jobWork.time = zanTime;
                }
                zanTime -= jobWork.time;
            }
        }
        var jobWork = jobWorks[maxPerIndex];
        jobWork.time = zanTime;
    }
};

/**
 * 【工数】拡張項目の情報
 *
 * @param {Object} obj
 * @param {boolean=} flag
 * @return {Array.<Object>}
 */
teasp.data.Pouch.prototype.getExtraItems = function(obj){
    var common = (this.dataObj.common || {});
    var e1 = null, e2 = null;
    if((obj && obj.extraItem1) || common.useJobExtraItem1){
        e1 = {
            name   : ((obj && obj.extraItem1Name) || common.jobExtraItem1Name),
            length : common.jobExtraItem1Length,
            width  : common.jobExtraItem1Width,
            value  : (obj ? obj.extraItem1 : '')
        };
    }
    if((obj && obj.extraItem2) || common.useJobExtraItem2){
        e2 = {
            name   : ((obj && obj.extraItem2Name) || common.jobExtraItem2Name),
            length : common.jobExtraItem2Length,
            width  : common.jobExtraItem2Width,
            value  : (obj ? obj.extraItem2 : '')
        };
    }
    return (e1 || e2) ? [e1, e2] : [];
};

/**
 * 【工数】 重複したジョブと工程の組み合わせを許すか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isPermitDuplicateJobProcess = function(){
    return this.dataObj.common.permitDuplicateJobProcess;
};

/**
 * 工数実績入力ダイアログに検索窓を設置
 * @returns {Boolean}
 */
teasp.data.Pouch.prototype.isDeployJobSearchBox = function(){
    return this.dataObj.common.config.deployJobSearchBox || false;
};
