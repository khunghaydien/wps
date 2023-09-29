teasp.provide('teasp.dialog.EmpWorkOption');
/**
 * 工数入力設定ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.EmpWorkOption = function(){
    this.widthHint = 475;
    this.heightHint = 155;
    this.id = 'dialogEmpWorkOption';
    this.title = teasp.message.getLabel('tm20002010'); // 工数入力設定
    this.duration = 1;
    this.content = '<div class="dlg_content" style="width:500px;"><table class="ts_a_frame"><tr><td class="edgelt"></td><td class="edgeht"></td><td class="edgert"></td></tr><tr><td class="edgevl"></td><td><div class="edge_div"><table class="stand_table"><tr><td class="left_s" id="workOpt_defaultInput_label" style="width:156px;"></td><td class="right"><select id="empWorkInputType"><option value="0" id="tm20010010"></option><option value="1" id="tm20010020"></option></select></td></tr><tr><td class="left_s" id="workOpt_workReport_label"></td><td class="right"><label><input type="checkbox" id="empWorkNoteOption" /><span style="margin: 0 0 0 5px;"id="workOpt_input"></span></label></td></tr><tr><td class="left_s" id="workOpt_taskReport_label"></td><td class="right"><label><input type="checkbox" id="empTaskNoteOption" /><span style="margin: 0 0 0 5px;"id="taskOpt_input"></span></label></td></tr><tr class="workOptLeftoverJobArea"><td class="left_s" id="workOpt_LeftoverJob_label" style="white-space:normal;"></td><td class="right"><select id="workOptLeftoverJobName" style="width:280px;"></select></td></tr><tr class="workOptLeftoverJobArea"><td colSpan="2"><div id="workOptCommentLeftoverJob" style="word-break:break-all;margin: 1px 4px 1px 40px;"></div></td></tr></table></div></td><td class="edgevr"></td></tr><tr><td class="edgelb"></td><td class="edgehb"></td><td class="edgerb"></td></tr></table><table border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr class="ts-buttons-row"><td style="padding:16px 0px 4px 0px;text-align:center;"><div><button class="std-button1" id="empWorkOptionOk" ><div></div></button><button class="std-button2" id="empWorkOptionCancel" ><div></div></button></div></td></tr></table></div>';
    this.okLink = {
        id       : 'empWorkOptionOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'empWorkOptionCancel',
        callback : this.hide
    };
};

teasp.dialog.EmpWorkOption.prototype = new teasp.dialog.Base();
/**
 * 画面生成
 * @override
 */
teasp.dialog.EmpWorkOption.prototype.preStart = function(){
    //メッセージ埋め込み
    //innerHTML
    teasp.message.setLabelHtml('workOpt_defaultInput_label','defaultInput_label'); // デフォルトの入力方式
    teasp.message.setLabelHtml('tm20010010'); // ボリュームで入力
    teasp.message.setLabelHtml('tm20010020'); // 時間で入力
    teasp.message.setLabelHtml('workOpt_workReport_label','workNote_label'); // 作業報告
    teasp.message.setLabelHtml('workOpt_taskReport_label','taskReport_label'); // タスク毎の作業報告
    teasp.message.setLabelHtml('workOpt_input','tm20010030'); // 入力する
    teasp.message.setLabelHtml('taskOpt_input','tm20010030'); // 入力する
    teasp.message.setLabelHtml('workOpt_LeftoverJob_label','tk10003280'); // 残工数を登録するジョブ

    teasp.message.setLabelHtml('workOptCommentLeftoverJob','tk10003291'); // ※残工数を登録するジョブを設定すると、<br/>工数登録で入力した工数と勤務時間の差が<br/>このジョブの工数として登録されるようになります。<br/>残工数を登録するジョブ以外の工数の入力方式は時間入力固定になります。

    dojo.byId('empWorkOptionOk'    ).firstChild.innerHTML = teasp.message.getLabel('save_btn_title');   // 登録
    dojo.byId('empWorkOptionCancel').firstChild.innerHTML = teasp.message.getLabel('cancel_btn_title'); // キャンセル
};


/**
 * 画面生成
 * @override
 */
teasp.dialog.EmpWorkOption.prototype.preShow = function(){
    dojo.byId('empWorkInputType').value = '' + this.pouch.getWorkInputType(); // 入力方式
    dojo.byId('empWorkInputType').disabled = this.pouch.isWorkInputTimeFix(true); // 時間入力固定の場合は非活性にする
    dojo.byId('empWorkNoteOption').checked = this.pouch.getWorkNoteOption(); // 作業報告
    dojo.byId('empTaskNoteOption').checked = this.pouch.getTaskNoteOption(); // タスク毎の作業報告

    var pm = this.pouch.isPermitChangeLeftoverJob();
    dojo.query('.workOptLeftoverJobArea').forEach(function(elem){
        dojo.style(elem, 'display', (pm ? '' : 'none'));
    });

    var select = dojo.byId('workOptLeftoverJobName');
    while(select.firstChild){
        dojo.destroy(select.firstChild);
    }
    dojo.create('option', {
        value     : '',
        innerHTML : teasp.message.getLabel('tm10001680', teasp.message.getLabel(this.args.comLoJobId ? 'tk10005310' : 'tm10010150')) // (共通設定を使用する) or (なし)
    }, select);
    var lst = (this.args.jobs || []);
    for(var i = 0 ; i < lst.length ; i++){
        var o = lst[i];
        dojo.create('option', { value : o.jobId, innerHTML : o.jobName }, select);
    }
    this.orgLeftoverJobId = (this.args.empLoJobId || this.args.comLoJobId);
    select.value = (this.orgLeftoverJobId || '');

    return true;
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.EmpWorkOption.prototype.ok = function(){
    var req = {
        empId              : this.pouch.getEmpId(),
        workInputType      : parseInt(dojo.byId('empWorkInputType').value, 10),
        workNoteOption     : dojo.byId('empWorkNoteOption').checked,
        taskNoteOption     : dojo.byId('empTaskNoteOption').checked,
        orgLeftoverJobId   : this.orgLeftoverJobId,
        leftoverJobId      : null,
        changeLeftoverJob  : false
    };
    var checkConfirm = false;
    if(this.pouch.isPermitChangeLeftoverJob()){
        req.leftoverJobId = (dojo.byId('workOptLeftoverJobName').value || null);
        if(this.orgLeftoverJobId != req.leftoverJobId){
            checkConfirm = true;
            // 工数実績入力の内容をいったん登録します。よろしいですか？
            teasp.tsConfirmA(teasp.message.getLabel('tk10005320'), this, function(){
                req.changeLeftoverJob = true;
                this.ok2(req);
            });
        }
    }
    if(!checkConfirm){
        this.ok2(req);
    }
};

teasp.dialog.EmpWorkOption.prototype.ok2 = function(req){
    teasp.manager.request(
        'saveEmpWorkOption',
        req,
        this.pouch,
        { hideBusy : false },
        this,
        function(obj, res){
            this.onfinishfunc(obj, res);
            this.close();
        },
        function(event){
            teasp.message.alertError(event);
        }
    );
};
