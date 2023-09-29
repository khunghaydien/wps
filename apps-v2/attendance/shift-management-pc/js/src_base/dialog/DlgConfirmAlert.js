teasp.provide('teasp.dialog.ConfirmAlert');
/**
 * Confirm/Alert ダイアログ（confirm, alert の代替）
 * 下記の関数の中で呼ばれる
 *   teasp.tsAlert(message, thisObject, callback)
 *   teasp.tsConfirm(message, thisObject, callback)
 * ※ message はstringまたはobject。object の場合は下記の要素を指定する。
 * {
 *   message:{string} ダイアログに表示する文言（省略時は""）
 *   title:{string} タイトルに表示する文言（省略時は"確認"）
 *   okLabel:{string} OKボタンのラベル（省略時は"OK"）
 *   cancelLabel:{string} キャンセルボタンのラベル（省略時は"キャンセル"）
 * }
 * @see teasp.action.Manager (js/src_base/action/ActionManager.js)
 * @constructor
 * @extends teasp.dialog.Base
 */
teasp.dialog.ConfirmAlert = function(){
    this.id = 'confirmAlertDialog';
    this.duration = 1;
    this.content = '<table id="confirmAlertTable" class="ts-style">'
		+ '<tr><td class="message_area" style="padding-bottom:8px;">'
		+ '<div id="confirmAlertMessage" style="min-width:340px;max-width:800px;"></div>'
		+ '</td></tr>'
		+ '<tr class="ts-style-buttons"><td style="text-align:right;"><div>'
		+ '<button id="confirmAlertOk">OK</button>'
		+ '<button class="clarity" id="confirmAlertCancel">Cancel</button>'
		+ '</div></td></tr></table>';
    this.okLink = {
        id       : 'confirmAlertOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'confirmAlertCancel',
        callback : this.cancel
    };
};
teasp.dialog.ConfirmAlert.prototype = new teasp.dialog.Base();

teasp.dialog.ConfirmAlert.prototype.preStart = function(){
	// キャンセルボタン押下時の処理とダイアログの×ボタンの処理を共通化
	dojo.connect(this.dialog, 'onCancel', this, this.cancel);
};
teasp.dialog.ConfirmAlert.prototype.preShow = function(){
	this.dialog.maxRatio = 1.0;
	dojo.byId('confirmAlertDialog_title').innerHTML = this.args.title || teasp.message.getLabel('em10002080');

	dojo.byId('confirmAlertMessage').innerHTML = (this.args.message || '').replace(/\r?\n/g, '<br/>'); // メッセージ

	dojo.style('confirmAlertCancel', 'display', (!this.args.type ? 'none' : '')); // キャンセルボタン表示/非表示
	dojo.byId('confirmAlertOk'    ).innerHTML = this.args.okLabel || teasp.message.getLabel('ok_btn_title');     // OK
    dojo.byId('confirmAlertCancel').innerHTML = this.args.cancelLabel || teasp.message.getLabel('cancel_btn_title'); // キャンセル

	if(teasp.isNarrow()){
		dojo.style('confirmAlertTable', 'width', '100%');
		dojo.style('confirmAlertTable', 'border', '1px solid #ccc');
	}
    return true;
};
teasp.dialog.ConfirmAlert.prototype.cancel = function(){
	this.hide();
	this.onfinishfunc(false);
};
teasp.dialog.ConfirmAlert.prototype.ok = function(){
    this.hide();
	this.onfinishfunc(true);
};
