teasp.provide('teasp.dialog.TaskNote');
/**
 * 作業報告入力ダイアログ
 *
 * @constructor
 * @extends teasp.dialog.Base
 */
teasp.dialog.TaskNote = function(){
    this.width = 530;
    this.height = 210;
    this.title = teasp.message.getLabel('workReport_label'); // 作業報告
    this.id = 'TaskNoteDialog';
    this.duration = 1;
    this.content = '<table class="pane_table" style="width:460px;"><tr><td style="vertical-align:top;text-align:left;"><div id="TaskNoteLabel" style="margin:4px;"></div></td></tr><tr><td style="vertical-align:top;text-align:center;"><textarea name="TaskNoteText" id="TaskNoteText" style="width:500px;height:100px;" class="inputarea" maxLength="32000"></textarea></td></tr><tr id="TaskNoteCtlRow1" class="ts-buttons-row"><td style="text-align:center;padding-top:10px;"><div><button class="std-button1" id="TaskNoteOk" ><div></div></button><button class="std-button2" id="TaskNoteCancel" ><div></div></button></div></td></tr><tr id="TaskNoteCtlRow2" class="ts-buttons-row"><td style="text-align:center;padding-top:10px;"><div><button class="std-button2" id="TaskNoteClose" ><div></div></button></div></td></tr></table>';
    this.okLink = {
        id       : 'TaskNoteOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'TaskNoteCancel',
        callback : this.hide
    };
    this.closeLink = {
        id       : 'TaskNoteClose',
        callback : this.hide
    };
    this.eventHandles = [];
};

teasp.dialog.TaskNote.prototype = new teasp.dialog.Base();

/**
 * @override
 */
teasp.dialog.TaskNote.prototype.preShow = function(){
    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    dojo.byId('TaskNoteDialog_title').innerHTML = teasp.util.date.formatDate(this.args.date, 'M/d') + ' ' + teasp.message.getLabel('workReport_label');
    dojo.style('TaskNoteCtlRow1', 'display', (this.args.readOnly ? 'none' : ''));
    dojo.style('TaskNoteCtlRow2', 'display', (this.args.readOnly ? '' : 'none'));

    dojo.byId('TaskNoteLabel').innerHTML = this.args.title;
    dojo.byId('TaskNoteText').value = this.args.note;

    dojo.byId('TaskNoteOk'    ).firstChild.innerHTML = teasp.message.getLabel('ok_btn_title');
    dojo.byId('TaskNoteCancel').firstChild.innerHTML = teasp.message.getLabel('cancel_btn_title');
    dojo.byId('TaskNoteClose' ).firstChild.innerHTML = teasp.message.getLabel('close_btn_title');

    dojo.byId('TaskNoteText').readOnly = (this.args.readOnly ? 'readOnly' : '');
	dojo.toggleClass(dojo.byId('TaskNoteText'), 'inputro', this.args.readOnly);

    return true;
};

/**
 * 登録
 * @override
 */
teasp.dialog.TaskNote.prototype.ok = function(){
    this.hide();
    this.onfinishfunc({ note: dojo.byId('TaskNoteText').value });
};
