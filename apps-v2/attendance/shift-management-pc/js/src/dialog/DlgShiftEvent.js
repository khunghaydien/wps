teasp.provide('teasp.dialog.ShiftEvent');
/**
 * イベント設定ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.ShiftEvent = function(){
    this.widthHint = 410;
    this.heightHint = 225;
    this.id = 'dialogShiftEvent';
    this.title = 'イベントの設定';
    this.duration = 1;
    this.content = '<div class="dlg_content" style="width:490px;"><div style="width:100%;"><div id="shiftEventTitle" class="inputarea" style="margin-bottom:8px;"></div></div><table class="ts_a_frame"><tr><td class="edgelt"></td><td class="edgeht"></td><td class="edgert"></td></tr><tr><td class="edgevl"></td><td><div class="edge_div"><table class="stand_table"><tr><td class="left_sx">共通のイベント</td><td class="right"><input type="text" id="shiftEventCommon" class="inputran" maxLength="255" style="padding:2px;width:300px;font-size:12px;" /></td></tr><tr class="dept_row"><td class="left_sx"><div id="shiftEventDeptColumn" style="word-break:break-all;">イベント</div></td><td class="right"><input type="text" id="shiftEventDept" class="inputran" maxLength="255" style="padding:2px;width:300px;font-size:12px;" /></td></tr><tr class="dept_row"><td class="left_sx">備考</td><td class="right"><textarea id="shiftEventNote" class="inputran" maxLength="255" style="padding:2px;width:300px;height:32px;"></textarea></td></tr></table></div></td><td class="edgevr"></td></tr><tr><td class="edgelb"></td><td class="edgehb"></td><td class="edgerb"></td></tr></table><table border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td id="shiftEventErrorRow" style="text-align:center;"></td></tr><tr><td style="padding:16px 0px 4px 0px;text-align:center;"><input type="button" class="normalbtn" value="登録" id="shiftEventOk" />&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" class="cancelbtn" value="キャンセル" id="shiftEventCancel" /></td></tr></table></div>';
    this.okLink = {
        id       : 'shiftEventOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'shiftEventCancel',
        callback : this.hide
    };
};

teasp.dialog.ShiftEvent.prototype = new teasp.dialog.Base();

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.ShiftEvent.prototype.preShow = function(){
    teasp.util.showErrorArea(null, 'shiftEventErrorRow'); // エラー表示クリア

    // 部署未設定の社員が選択された場合は、部署向けの項目を非表示にする
    var deptName = this.pouch.param.deptName;
    dojo.byId('shiftEventDeptColumn').innerHTML = (deptName ? deptName + ' のイベント' : '');
    dojo.query('.dept_row').forEach(function(elem){
        dojo.style(elem, 'display', (deptName ? '' : 'none'));
    });

    var pubEvents = [];
    var commonEvents = [];
    var deptEvents = [];
    var deptNotes = [];
    for(var i = 0 ; i < this.args.dateList.length ; i++){
        var d = this.args.dateList[i];
        if(!pubEvents.contains(d.pubEvent)){
            pubEvents.push(d.pubEvent);
        }
        if(!commonEvents.contains(d.commonEvent)){
            commonEvents.push(d.commonEvent);
        }
        if(!deptEvents.contains(d.deptEvent)){
            deptEvents.push(d.deptEvent);
        }
        if(!deptNotes.contains(d.deptNote)){
            deptNotes.push(d.deptNote);
        }
    }
    var sd = teasp.util.date.formatDate(this.args.dateList[0].dkey, 'JP1');
    var ed = teasp.util.date.formatDate(this.args.dateList[this.args.dateList.length - 1].dkey, 'JP1');
    dojo.byId('shiftEventTitle').innerHTML = (sd != ed ? sd + ' ～ ' + ed : sd + (pubEvents.length > 0 ? ' ' + (pubEvents[0] || '') : ''));
    dojo.byId('shiftEventCommon').value = (commonEvents.length == 1 ? (commonEvents[0] || '') : '');
    dojo.byId('shiftEventDept').value   = (deptEvents.length   == 1 ? (deptEvents[0]   || '') : '');
    dojo.byId('shiftEventNote').value   = (deptNotes.length    == 1 ? (deptNotes[0]    || '') : '');

    return true;
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.ShiftEvent.prototype.ok = function(){
    var dkeys = [];
    for(var i = 0 ; i < this.args.dateList.length ; i++){
        dkeys.push(this.args.dateList[i].dkey);
    }
    var deptId = this.pouch.param.deptId;
    this.onfinishfunc(
        {
            dkeys       : dkeys,
            deptId      : ((!deptId || deptId == '-1') ? null : deptId),
            commonEvent : dojo.byId('shiftEventCommon').value,
            deptEvent   : dojo.byId('shiftEventDept').value,
            deptNote    : dojo.byId('shiftEventNote').value
        },
        'shiftEventErrorRow',
        function(res){
            this.hide();
        },
        this
    );
};
