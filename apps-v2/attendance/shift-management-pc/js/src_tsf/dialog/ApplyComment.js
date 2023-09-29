/**
 * コメント入力ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ApplyComment = function(){
    this.params = null;
    this.applyKey = null;
};

teasp.Tsf.ApplyComment.prototype.getArea = function(){
    return teasp.Tsf.Dom.byId(this.dialog.id);
};

teasp.Tsf.ApplyComment.prototype.show = function(obj, callback){
    teasp.Tsf.Error.showError();

    this.params = obj || {};
    this.domHelper = new teasp.Tsf.Dom();
    this.dialog = new dijit.Dialog({
        title       : (this.params.title   || ''),
        className   : (this.params.formCss || '')
    });
    this.dialog.attr('content', this.getContent());
    this.dialog.startup();
    this.domHelper.connect(this.dialog, 'onCancel', this, function(){ this.hide(); });

    this.callback = callback;

    this.orgData = obj;

    this.dialog.show();
};

teasp.Tsf.ApplyComment.prototype.hide = function(){
    if(this.dialog){
        this.dialog.hide();
        this.domHelper.free();
        this.dialog.destroy();
        tsfManager.removeDialog('ApplyComment');
    }
};

teasp.Tsf.ApplyComment.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.ApplyComment.prototype.getContent = function(){
    var areaEl = this.getDomHelper().create('div', { className: 'ts-dialog' });
    this.getDomHelper().create('div', null
            , this.getDomHelper().create('div', { className: 'ts-error-area', style: 'width:360px;display:none;' }, areaEl));

    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('comment_head') // コメント
                                    , className: 'ts-dialog-title' }, areaEl);
    var textArea = this.getDomHelper().create('textarea', { maxLength: 4000 }
                    , this.getDomHelper().create('div', { className: 'ts-dialog-comment' }, areaEl));
    teasp.Tsf.Dom.setlimitChars(this.getDomHelper(), [textArea], null, 4000);

    this.createButtons(areaEl);

    return areaEl;
};

teasp.Tsf.ApplyComment.prototype.createButtons = function(areaEl){
    var area = this.getDomHelper().create('div', { className: 'ts-dialog-buttons' }, areaEl);
    var div  = this.getDomHelper().create('div', null, area);
    var buttons = this.params.buttons || [];
    if(buttons.length <= 0){
        var close = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('close_btn_title'), 'ts-dialog-cancel', div); // 閉じる
        this.getDomHelper().connect(close, 'onclick', this, this.hide);
    }
    dojo.forEach(buttons, function(b){
        if(b.key == 'cancel'){
            var button = teasp.Tsf.Dialog.createButton(this.getDomHelper(), b.label, (b.css || 'ts-dialog-cancel'), div);
            this.getDomHelper().connect(button, 'onclick', this, this.hide);
        }else if(typeof(this[b.key]) == 'function'){
            var button = teasp.Tsf.Dialog.createButton(this.getDomHelper(), b.label, (b.css || 'ts-dialog-ok'), div);
            this.getDomHelper().connect(button, 'onclick', this, function(e){
                this.submit(b.key);
            });
        }else{
            var button = teasp.Tsf.Dialog.createButton(this.getDomHelper(), b.label, (b.css || 'ts-dialog-ok'), div);
            this.getDomHelper().connect(button, 'onclick', this, function(e){
                this.showError();
                this.callback(b.key, this.fetchComment(), teasp.Tsf.Dom.hitch(this, this.hide), teasp.Tsf.Dom.hitch(this, this.showError));
            });
        }
    }, this);
};

teasp.Tsf.ApplyComment.prototype.showError = function(result){
    var er = teasp.Tsf.Dom.node('.ts-error-area', this.getArea());
    teasp.Tsf.Error.showError(result, er);
};

/**
 * 入力されたコメントを取得
 *
 * @returns {string}
 */
teasp.Tsf.ApplyComment.prototype.fetchComment = function(){
    var el = teasp.Tsf.Dom.node('.ts-dialog-comment textarea', this.getArea());
    return el.value || null;
};

teasp.Tsf.ApplyComment.prototype.submit = function(key){
    this.showError();
    var comment = this.fetchComment();
    if(!comment && tsfManager.isRequireNote(this.applyKey)){
        this.showError(teasp.message.getLabel('tm10003820')); // コメントを入力してください
        return;
    }
    this[key](comment);
};

teasp.Tsf.ApplyComment.prototype.submitApply = function(comment){
};

teasp.Tsf.ApplyComment.prototype.cancelApply = function(comment){
};

teasp.Tsf.ApplyComment.prototype.approveApply = function(comment){
};

teasp.Tsf.ApplyComment.prototype.rejectApply = function(comment){
};

/**
 * 承認者設定画面を開く
 * @param {Object} e
 */
teasp.Tsf.ApplyComment.prototype.openApproverSet = function(e){
    var id = tsfManager.getTargetEmp().getApproverId(teasp.constant.APPROVER_TYPE_EXP);
    if(id){
        window.open('/' + id + '/e', '_blank');
        return false;
    }
    tsfManager.getApproverSet({
        empId       : tsfManager.getEmpId(),
        type        : teasp.constant.APPROVER_TYPE_EXP
    }, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            tsfManager.getTargetEmp().setApproverSet(result.approverSet);
            var id = tsfManager.getTargetEmp().getApproverId(teasp.constant.APPROVER_TYPE_EXP);
            if(id){
                window.open('/' + id + '/e', '_blank');
                return false;
            }
        }else{
            this.showError(result);
        }
    }));
};

/**
 * 再読み込み
 * @param {Object} e
 */
teasp.Tsf.ApplyComment.prototype.reloadApproverSet = function(e){
    tsfManager.getApproverSet({
        empId       : tsfManager.getEmpId(),
        type        : teasp.constant.APPROVER_TYPE_EXP
    }, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            tsfManager.getTargetEmp().setApproverSet(result.approverSet);
            var n = teasp.Tsf.Dom.node('div.ts-apply-approver-area div.ts-apply-approver-b', this.getArea());
            if(n){
                n.innerHTML = tsfManager.getTargetEmp().getApproverNames(teasp.constant.APPROVER_TYPE_EXP);
            }
        }else{
            this.showError(result);
        }
    }));
};
