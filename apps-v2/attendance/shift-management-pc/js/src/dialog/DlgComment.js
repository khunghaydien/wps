teasp.provide('teasp.dialog.Comment');
/**
 * コメント入力ダイアログ
 *
 * @constructor
 * @extends teasp.dialog.Base
 */
teasp.dialog.Comment = function(){
    this.width = 400;
    this.height = 210;
    this.title = teasp.message.getLabel('applyx_btn_title'); // 承認申請
    this.id = 'commentDialog';
    this.duration = 1;
    this.content = '<table class="pane_table" style="width:400px;"><tr><td style="vertical-align:top;text-align:left;"><div id="commentDescript" style="margin:0px 2px 8px 4px;display:none;"></div></td></tr><tr id="commentWarningRow" style="display:none;"><td style="vertical-align:top;text-align:left;"><div id="commentWarning" style="margin:0px 8px 8px 4px;color:red;"></div></td></tr><tr><td style="vertical-align:top;text-align:left;"><div id="commentLabel" style="margin:0px 4px;font-weight:bold;"></div></td></tr><tr><td style="vertical-align:top;text-align:center;"><textarea id="commentText" style="width:390px;height:80px;margin-left:6px;margin-right:6px" class="inputran" maxLength="4000"></textarea></td></tr><tr id="commentErrorRow" style="display:none;"><td style="vertical-align:top;text-align:center;color:red;"><div id="commentError"></div></td></tr><tr class="ts-buttons-row"><td style="text-align:center;padding-top:10px;"><div><button class="std-button1" style="margin-right:10px;" id="commentOk" ><div></div></button><button class="std-button2" style="margin-left:10px;" id="commentCancel" ><div></div></button></div></td></tr></table>';
    this.okLink = {
        id       : 'commentOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'commentCancel',
        callback : this.hide
    };
};

teasp.dialog.Comment.prototype = new teasp.dialog.Base();

/**
 * @override
 */
teasp.dialog.Comment.prototype.preStart = function(){
    dojo.byId('commentOk'     ).firstChild.innerHTML = teasp.message.getLabel('apply_btn_title');  // 申請
    dojo.byId('commentCancel' ).firstChild.innerHTML = teasp.message.getLabel('cancel_btn_title'); // 閉じる
};

/**
 * @override
 */
teasp.dialog.Comment.prototype.preShow = function(){
    dojo.byId('commentDialog_title').innerHTML = this.args.dialogTitle || '';
    dojo.byId('commentText').value = '';
    dojo.byId('commentLabel').innerHTML = teasp.message.getLabel('comment_head');   // コメント

    if(this.args.okButtonTitle){ // OKボタンの表記名
        dojo.byId('commentOk').firstChild.innerHTML = this.args.okButtonTitle;
    }
    if(this.args.okButtonCss){ // OKボタンのスタイル
        dojo.byId('commentOk').className = this.args.okButtonCss;
    }

    this.showError(null);

    return true;
};

/**
 * 登録
 * @override
 */
teasp.dialog.Comment.prototype.ok = function(){
    this.hide();
    this.onfinishfunc({
        comment  : (dojo.byId('commentText').value || null)
    });
};

/**
 * エラー表示
 * @param {string|null=} msg エラーメッセージ。null（または省略）の場合は非表示にする。
 */
teasp.dialog.Comment.prototype.showError = function(msg){
    dojo.style('commentErrorRow', 'display', (msg ? '' : 'none'));
    dojo.byId('commentError').innerHTML = (msg ? msg.entitize() : '');
};
