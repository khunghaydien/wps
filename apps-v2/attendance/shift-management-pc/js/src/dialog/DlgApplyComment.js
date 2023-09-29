teasp.provide('teasp.dialog.ApplyComment');
/**
 * コメント入力ダイアログ
 *
 * @constructor
 * @extends teasp.dialog.Base
 */
teasp.dialog.ApplyComment = function(){
    this.title = teasp.message.getLabel('applyx_btn_title'); // 承認申請
    this.id = 'applyCommentDialog';
    this.duration = 1;
    this.content = '<table class="pane_table" id="applyCommentTable"><tr><td style="vertical-align:top;text-align:left;"><div id="applyCommentDescript" style="margin:0px 2px 8px 4px;"></div></td></tr><tr id="applyCommentWarningRow" style="display:none;"><td style="vertical-align:top;text-align:left;"><div id="applyCommentWarning" style="margin:0px 8px 8px 4px;color:red;"></div></td></tr><tr id="applyApproverRow"><td style="vertical-align:top;text-align:left;"><div id="applyApproverLabel" style="margin:2px 16px 2px 4px;float:left;font-weight:bold;"></div><div id="applyApproverName" style="margin:2px;float:left;width:240px;"></div><div style="margin:2px;float:left;"><a id="applyApproverReload" style="margin-left:8px;vertical-align:bottom;color:#000080;text-decoration:underline;cursor:pointer;"></a></div><div id="applyApproverSetLinkArea" style="margin:2px;float:left;" class="normal-width"><a id="applyApproverSetLink" style="margin-left:8px;vertical-align:bottom;color:#000080;text-decoration:underline;cursor:pointer;"></a></div><div style="clear:both;"></div></td></tr><tr><td style="vertical-align:top;text-align:left;"><div id="applyCommentLabel" style="margin:4px;font-weight:bold;"></div></td></tr><tr><td style="vertical-align:top;text-align:center;"><textarea name="applyCommentText" id="applyCommentText" style="width:97%;height:80px;" class="inputran" maxLength="255"></textarea></td></tr><tr id="applyCommentErrorRow" style="display:none;"><td style="vertical-align:top;text-align:center;color:red;"><div id="applyCommentError"></div></td></tr><tr class="ts-buttons-row"><td style="text-align:center;padding-top:10px;"><div><button class="std-button1" style="margin-right:10px;" id="applyCommentOk" ><div></div></button><button class="std-button2" style="margin-left:10px;" id="applyCommentCancel" ><div></div></button></div></td></tr></table>';
    this.approverType = null;
    this.okLink = {
        id       : 'applyCommentOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'applyCommentCancel',
        callback : this.hide
    };
};

teasp.dialog.ApplyComment.prototype = new teasp.dialog.Base();

/**
 * @override
 */
teasp.dialog.ApplyComment.prototype.preStart = function(){
    dojo.byId('applyCommentOk'     ).firstChild.innerHTML = teasp.message.getLabel('apply_btn_title');  // 申請
    dojo.byId('applyCommentCancel' ).firstChild.innerHTML = teasp.message.getLabel('cancel_btn_title'); // 閉じる

    dojo.connect(dojo.byId('applyApproverReload') , 'onclick', this, this.reloadApproverSet);
    dojo.connect(dojo.byId('applyApproverSetLink'), 'onclick', this, this.openApproverSet);
};

/**
 * @override
 */
teasp.dialog.ApplyComment.prototype.ready = function(){
    if(this.args.applyKey == teasp.constant.APPLY_KEY_JOBAPPLY){        this.approverType = teasp.constant.APPROVER_TYPE_JOB;
    }else if(this.args.applyKey == teasp.constant.APPLY_KEY_EXPAPPLY){  this.approverType = teasp.constant.APPROVER_TYPE_EXP;
    }else{                                                              this.approverType = teasp.constant.APPROVER_TYPE_MONTH;
    }
};

/**
 * @override
 */
teasp.dialog.ApplyComment.prototype.preShow = function(){
    dojo.style('applyCommentTable', 'width', (teasp.isNarrow() ? '100%' : '520px'));

    dojo.byId('applyCommentDialog_title').innerHTML = this.args.title;
    dojo.byId('applyCommentDescript').innerHTML = this.args.descript;
    dojo.byId('applyCommentText').value = '';

    if(!this.args.deptFixMode && this.pouch.isUseApproverSet(this.args.applyKey)){
        dojo.style('applyApproverRow', 'display', '');
        dojo.byId('applyApproverLabel').innerHTML   = teasp.message.getLabel('tk10000071');             // 承認者
        dojo.byId('applyApproverName').innerHTML    = this.pouch.getApproverSetName(this.approverType);
        dojo.byId('applyApproverReload').innerHTML  = teasp.message.getLabel('tk10004000');             // 再読み込み
        dojo.byId('applyApproverSetLink').innerHTML = teasp.message.getLabel('tk10004010');             // 承認者設定画面を開く
    }else{
        dojo.style('applyApproverRow', 'display', 'none');
    }
    if(teasp.isMobile()){ // モバイルでは「承認者設定画面を開く」を非表示にする
        dojo.style('applyApproverSetLinkArea', 'display', 'none');
    }

    var applyBtnMsgId = (this.args.applyKey == teasp.constant.APPLY_KEY_EXPAPPLY ? 'apply_btn_title' : 'applyx_btn_title'); // 申請 or 承認申請

    dojo.byId('applyCommentOk').firstChild.innerHTML = teasp.message.getLabel(this.args.buttonType ? 'fix_btn_title' : applyBtnMsgId);  // 確定 or (申請 or 承認申請)

    dojo.byId('applyCommentLabel').innerHTML = teasp.message.getLabel('comment_head');   // コメント

    this.showError(null);

    dojo.byId('applyCommentWarning').innerHTML = (this.args.warning || '');
    dojo.style('applyCommentWarningRow', 'display', (this.args.warning ? '' : 'none'));

    if(teasp.isSforce1()){ // SF1では「承認者設定画面を開く」を非表示にする
        dojo.query('.normal-width', this.dialog.domNode).forEach(function(el){
            dojo.style(el, 'display', 'none');
        });
    }

    return true;
};

/**
 * 承認者設定の再読み込み
 *
 */
teasp.dialog.ApplyComment.prototype.reloadApproverSet = function(){
    teasp.manager.request(
        'getAtkApproverSet',
        {
            action : 'getAtkApproverSet',
            empId  : this.pouch.getEmpId(),
            type   : this.approverType
        },
        this.pouch,
        { hideBusy : false },
        this,
        function(){
            dojo.byId('applyApproverName').innerHTML = this.pouch.getApproverSetName(this.approverType);
        },
        function(event){
            teasp.message.alertError(event);
        }
    );
};

/**
 * 承認者設定の画面を開く
 *
 */
teasp.dialog.ApplyComment.prototype.openApproverSet = function(){
    var id = this.pouch.getApproverSetId(this.approverType);
    if(id){
        window.open('/' + id + '/e', '_blank');
        return false;
    }
    teasp.manager.request(
        'getAtkApproverSet',
        {
            action : 'getAtkApproverSet',
            empId  : this.pouch.getEmpId(),
            type   : this.approverType
        },
        this.pouch,
        { hideBusy : false },
        this,
        function(){
            id = this.pouch.getApproverSetId(this.approverType);
            window.open('/' + id + '/e', '_blank');
            return false;
        },
        function(event){
            teasp.message.alertError(event);
        }
    );
};

/**
 * 登録
 * @override
 */
teasp.dialog.ApplyComment.prototype.ok = function(){
    var comment = (dojo.byId('applyCommentText').value || null);
    if(this.pouch.isRequireNote(this.args.applyKey)
    && !comment){
        this.showError(teasp.message.getLabel('tm10003820')); // コメントを入力してください
        return;
    }
    this.hide();
    this.onfinishfunc({
        comment  : comment,
        targets  : this.args.targets,
        ringiId  : null
    });
};

/**
 * エラー表示
 * @param {string|null=} msg エラーメッセージ。null（または省略）の場合は非表示にする。
 */
teasp.dialog.ApplyComment.prototype.showError = function(msg){
    dojo.style('applyCommentErrorRow', 'display', (msg ? '' : 'none'));
    dojo.byId('applyCommentError').innerHTML = (msg ? msg.entitize() : '');
};
