/**
 * 定期区間履歴ダイアログ
 *
 * @constructor
 */
teasp.Tsf.CommuterPassList = function(){
    this.notOpenLink = true;
};

teasp.Tsf.CommuterPassList.prototype = new teasp.Tsf.SearchList();

teasp.Tsf.CommuterPassList.prototype.drawData = function(tb){
    teasp.Tsf.SearchList.prototype.drawData.call(this, tb);

    // メッセージあり
    if(this.orgData.message){
        var el = teasp.Tsf.Dom.node('.ts-error-area', this.getArea());
        var node = this.getDomHelper().create('div', { innerHTML: this.orgData.message, className: 'ts-commuter-pass-msg' });
        var box = teasp.Tsf.Dom.node('div.ts-search-list-box', this.getArea());
        node.style.width = box.style.width; // メッセージエリアのサイズを表幅に合わせる
        teasp.Tsf.Dom.place(node, el, 'after');
    }

    // ステータスのリンクのイベントハンドラ設定
    this.getDomHelper().connect(teasp.Tsf.Dom.query('table.ts-list-body a'), 'onclick', this, this.clickStatus);

    tsfManager.getTargetEmp().mergeCommuterPassStatus(this.records);
};

teasp.Tsf.CommuterPassList.prototype.getButtons = function(e){
    return [{ key:'close', label: teasp.message.getLabel('close_btn_title') }]; // 閉じる
};

teasp.Tsf.CommuterPassList.prototype.hide = function(){
    if(this.orgData.passChanged){
        this.orgData.passChanged();
    }
    teasp.Tsf.SearchList.prototype.hide.call(this);
};

teasp.Tsf.CommuterPassList.prototype.clickStatus = function(e){
    var tr   = teasp.Tsf.Dom.getAncestorByTagName(e.target, 'TR');
    var hkey = teasp.Tsf.Fp.getHkey(tr);
    var id   = this.fp.getFcByApiKey('Id').fetchValue(hkey).value;
    var status = this.fp.getFcByApiKey('Status__c').fetchValue(hkey).value;
    var cancelLabel = teasp.Tsf.ObjBase.getCancelApplyLabel(status);

    // このレコードが取消可能か調べる
    var cancelable = (
            tsfManager.isReadMode()
            ? false
            : teasp.Tsf.CommuterPass.isCancelable(tsfManager.getTargetEmp().getCommuterPasses(), id)
        );

    // 承認履歴ダイアログ表示
    tsfManager.showProcessInstanceSteps({
        id              : id, // 対象レコードのID
        cancelable      : cancelable, // 取消できるか
        cancelLabel     : cancelLabel,
        cancelCallback  : teasp.Tsf.Dom.hitch(this, this.cancelApply) // 取消で呼ぶメソッド
    });
    return false;
};

teasp.Tsf.CommuterPassList.prototype.cancelApply = function(data, callback){
    var cancelLabel = (data.cancelLabel || teasp.message.getLabel('tm10003500')); // 申請取消
    tsfManager.showDialog('ApplyCommentCommuterPass', {
        key         : 'cancelApply',
        title       : cancelLabel,
        formCss     : 'ts-dialog-comment',
        buttons     : [{ key:'cancelApply', label:cancelLabel, css:'ts-cancel-apply' }, { key:'cancel', label: teasp.message.getLabel('cancel_btn_title') }], // キャンセル
        id          : data.id,
        empId       : tsfManager.getEmpId(),
        solve       : false,
        noComment   : teasp.Tsf.CommuterPass.isValid(tsfManager.getTargetEmp().getCommuterPasses(), data.id),
        parentHide  : callback
    }, teasp.Tsf.Dom.hitch(this, function(result){
        // 再取得した定期区間履歴リストに入れ替え
        tsfManager.getTargetEmp().setCommuterPasses(result.commuterPasses);
        this.hide();
    }));
};
