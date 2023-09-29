/**
 * 経費事前申請用コメント入力ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ApplyCommentExpPre = function(){
    this.params = null;
};

teasp.Tsf.ApplyCommentExpPre.prototype = new teasp.Tsf.ApplyComment();

teasp.Tsf.ApplyCommentExpPre.prototype.getContent = function(){
    this.applyKey = teasp.constant.APPLY_KEY_EXPPREAPPLY;
    var areaEl = this.getDomHelper().create('div', { className: 'ts-dialog' });
    this.getDomHelper().create('div', null
            , this.getDomHelper().create('div', { className: 'ts-error-area', style: 'width:390px;display:none;' }, areaEl));

    //---------------------
    // 承認者
    var approEl = this.getDomHelper().create('div', { className: 'ts-apply-approver-area', style: 'width:390px;' }, areaEl);

    this.getDomHelper().create('div', { className: 'ts-apply-approver-a', innerHTML: teasp.message.getLabel('tk10000071') }, approEl); // 承認者
    var nm = this.getDomHelper().create('div', { className: 'ts-apply-approver-b' }, approEl);
    var lk = this.getDomHelper().create('div', { className: 'ts-apply-approver-c' }, approEl);
    var a1 = this.getDomHelper().create('a', { className: 'ts-apply-approver-a1' }, lk);
    var a2 = this.getDomHelper().create('a', { className: 'ts-apply-approver-a2' }, lk);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tk10004000') }, a1); // 再読み込み
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tk10004010') }, a2); // 承認者設定画面を開く
    nm.innerHTML = tsfManager.getTargetEmp().getApproverNames(teasp.constant.APPROVER_TYPE_EXP);
    teasp.Tsf.Dom.show(approEl, null, tsfManager.isUseExpApproverSet());
    this.getDomHelper().connect(a1, 'onclick', this, this.reloadApproverSet);   // 再読み込み
    this.getDomHelper().connect(a2, 'onclick', this, this.openApproverSet);     // 承認者設定画面を開く

    //---------------------
    // コメントエリア
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('comment_head'), className: 'ts-dialog-title' }, areaEl); // コメント
    var textArea = this.getDomHelper().create('textarea', { maxLength: 4000, style: 'width:390px;' }
                    , this.getDomHelper().create('div', { className: 'ts-dialog-comment' }, areaEl));
    teasp.Tsf.Dom.setlimitChars(this.getDomHelper(), [textArea], null, 4000);

    this.createButtons(areaEl);

    return areaEl;
};

teasp.Tsf.ApplyCommentExpPre.prototype.submitApply = function(comment){
    var req = { comment: comment };
    tsfManager.submitApply(req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            this.hide();
            this.callback(result);
        }else{
            this.showError(result);
        }
    }));
};

teasp.Tsf.ApplyCommentExpPre.prototype.cancelApply = function(comment){
    var req = {
        solve   : this.orgData.solve,
        comment : comment
    };
    tsfManager.cancelApply(req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            this.hide();
            if(this.params.parentHide){
                this.params.parentHide();
            }
            this.callback(result);
        }else{
            this.showError(result);
        }
    }));
};
