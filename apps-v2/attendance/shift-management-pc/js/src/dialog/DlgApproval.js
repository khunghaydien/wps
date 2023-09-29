teasp.provide('teasp.dialog.Approval');

/**
 * 承認申請を承認／却下ダイアログ
 *
 * <table border="1">
 *   <tr>
 *     <th scope="col">Args   Element  </th>
 *     <th scope="col">Data</th>
 *     <th scope="col"> Description </th>
 *   </tr>
 *   <tr>
 *    <td>apply</td>
 *    <td> [{id:id}, {id:id}, ...] </td>
 *     <td>id配列</td>
 *   </tr>
 *   <tr>
 *     <td>objKey</td>
 *     <td> empApply</td>
 *     <td>「(N人の)勤務確定の～」</td>
 *   </tr>
 *   <tr>
 *     <td>&nbsp;</td>
 *     <td>expApply</td>
 *     <td>「(N件の)経費確定の～</td>
 *   </tr>
 *   <tr>
 *     <td>&nbsp;</td>
 *     <td>jobApply</td>
 *     <td>「(N人の)工数実績確定の～」 </td>
 *   </tr>
 * </table>
 *
 * @constructor
 * @extends teasp.dialog.Base
 *
 * @author cmpArai
 */
teasp.dialog.Approval = function(){
    this.title = teasp.message.getLabel('tm30004020') /*承認申請を承認／却下*/;
    this.duration = 1;
    this.id = 'dialogApproval';
    this.content = '<table class="approval_table" id="approvalCommentTable"><tbody><tr><td style="vertical-align:top;text-align:left;"><div id="approvalCommentLabel" style="margin:4px;"></div></td></tr><tr><td style="vertical-align:top;text-align:center;"><textarea id="approvalComment" style="width:97%;height:80px;" maxlength="1000" class="inputran"></textarea></td></tr><tr><td style="text-align:center;padding-top:10px;"><table style="margin-left:auto;margin-right:auto;"><tbody><tr><td><button class="std-button1" id="approvalOk" style="margin:2px 12px;"><div></div></button></td><td><button class="red-button1" id="approvalReject" style="margin:2px 12px;"><div></div></button></td><td><button class="std-button2" id="approvalCancel" style="margin:2px 12px;"><div></div></button></td></tr></tbody></table></td></tr></tbody></table>';
    this.okLink = {
        id       : 'approvalOk',
        callback : function(){
        return function(){
            this.ok(true);
          };
      }()
    };
    this.cancelLink = {
        id       : 'approvalCancel',
        callback : this.hide
    };
    this.ids=[];
};


teasp.dialog.Approval.prototype = new teasp.dialog.Base();


/**
 * 画面生成
 * @override
 */
teasp.dialog.Approval.prototype.preStart = function(){
    //メッセージ埋め込み
    teasp.message.setLabelHtml('approvalCommentLabel','comment_head'); /*コメント*/

    dojo.byId('approvalOk'    ).firstChild.innerHTML = teasp.message.getLabel('tm30004010');    // 承認
    dojo.byId('approvalReject').firstChild.innerHTML = teasp.message.getLabel('tm10003490');    // 却下
    dojo.byId('approvalCancel').firstChild.innerHTML = teasp.message.getLabel('close_btn_title');   // キャンセル
    dojo.connect(dojo.byId('approvalReject'), 'onclick', this, function(){
        return function(){
            this.ok(false);
          };
      }());
};

/**
 * @override
 */
teasp.dialog.Approval.prototype.preShow = function(){
    this.ids = (this.args.apply)?this.args.apply:[{id:this.args.id}];
    dojo.byId('approvalComment').value = '';

    dojo.byId('approvalOk'    ).firstChild.innerHTML = teasp.message.getLabel(this.args.isCancelApply ? 'tf10006260' : 'tm30004010');    // 取消の承認 or 承認
    dojo.byId('approvalReject').firstChild.innerHTML = teasp.message.getLabel(this.args.isCancelApply ? 'tf10006270' : 'tm10003490');    // 取消の却下 or 却下

    // タイトルバーの色を変更
    dojo.query('.dijitDialogTitleBar', 'dialogApproval').forEach(function(elem){
        elem.style.backgroundColor = '#88CB7F';
    });

    dojo.style('approvalCommentTable', 'width', (teasp.isNarrow() ? '100%' : '500px'));

    return true;
};

/**
 * 承認・却下
 * @param {boolean} flg true:承認 false:却下
 * @override
 */
teasp.dialog.Approval.prototype.ok = function(flg){
    var message = (dojo.byId('approvalComment').value || null);

    var f = dojo.hitch(this, function(){
        this.close();
        this.onfinishfunc();
    });

    teasp.manager.dialogOpen('BusyWait');
    teasp.manager.request(
        'empExpApproval',
        {
            comment  :  message,
            apply    : [this.ids],
            approve  : flg,
            objKey   : this.args.objKey,
            refresh  : this.args.refresh
        },
        this.pouch,
        { hideBusy : true },
        this,
        function(){
            teasp.manager.dialogClose('BusyWait');
            setTimeout(f, 100);
        },
        function(event){
            teasp.manager.dialogClose('BusyWait');
            teasp.message.alertError(event);
        }
    );
};
