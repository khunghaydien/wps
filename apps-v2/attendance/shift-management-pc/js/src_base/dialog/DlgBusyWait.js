teasp.provide('teasp.dialog.BusyWait');
/**
 * 処理中ダイアログ（１）
 *
 * @constructor
 * @extends teasp.dialog.Base
 */
teasp.dialog.BusyWait = function(){
    this.widthHint = 140;
    this.heightHint = 80;
    this.title = teasp.message.getLabel('tm00000040'); // お待ちください
    this.duration = 1;
    this.content = '<table border="0" cellpadding="0" cellspacing="0"><tr><td style="text-align:center;"><div class="busywait"></div></td></tr></table>';
    this.nohack = true;
    this.id = 'BusyWait';
};

teasp.dialog.BusyWait.prototype = new teasp.dialog.Base();

/**
 *
 * @override
 */
teasp.dialog.BusyWait.prototype.preShow = function(){
    // タイトルバー右の「×」ボタンを非表示にする
    dojo.query('.dijitDialogCloseIcon', this.dialog.id).forEach(function(elem){
        elem.style.display = 'none';
    });
    return true;
};
