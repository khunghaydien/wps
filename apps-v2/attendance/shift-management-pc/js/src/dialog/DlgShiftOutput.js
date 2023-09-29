teasp.provide('teasp.dialog.ShiftOutput');
/**
 * シフト設定のCSV出力設定ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.ShiftOutput = function(){
    this.widthHint = 410;
    this.heightHint = 225;
    this.id = 'dialogShiftOutput';
    this.title = 'CSV出力';
    this.duration = 1;
    this.content = '<div class="dlg_content" style="width:340px;"><div style="width:100%;"><div id="shiftOutputTitle" class="inputarea" style="margin-bottom:8px;">出力形式を選択してください</div></div><table class="ts_a_frame"><tr><td class="edgelt"></td><td class="edgeht"></td><td class="edgert"></td></tr><tr><td class="edgevl"></td><td><div class="edge_div"><div style="margin:4px 8px 2px 8px;"><label><input type="radio" name="shiftOutputOption" id="shiftOutputOption1" />社員・日付のマトリックス形式</label></div></div><div class="edge_div"><div style="margin:2px 8px 4px 8px;"><label><input type="radio" name="shiftOutputOption" id="shiftOutputOption2" />社員・日付毎のリスト形式</label></div></div></td><td class="edgevr"></td></tr><tr><td class="edgelb"></td><td class="edgehb"></td><td class="edgerb"></td></tr></table><div style="padding: 8px 0px 0px 18px;"><label><input type="checkbox" id="shiftOutputTimeIn" />&nbsp;始業・終業時刻を出力する</label></div><div style="padding: 8px 0px 0px 18px;"><label><input type="checkbox" id="shiftOutputPattern" />&nbsp;勤務パターン名をフルネームで出力する</label></div><div style="padding: 8px 0px 0px 18px;"><label><input type="checkbox" id="shiftOutputHoliday" />&nbsp;休暇名をフルネームで出力する</label></div><table border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td id="shiftOutputErrorRow" style="text-align:center;"></td></tr><tr><td style="padding:16px 0px 4px 0px;text-align:center;"><input type="button" class="normalbtn" value="OK" id="shiftOutputOk" />&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" class="cancelbtn" value="キャンセル" id="shiftOutputCancel" /></td></tr></table></div>';
    this.okLink = {
        id       : 'shiftOutputOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'shiftOutputCancel',
        callback : this.hide
    };
};

teasp.dialog.ShiftOutput.prototype = new teasp.dialog.Base();

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.ShiftOutput.prototype.preShow = function(){
    dojo.byId('shiftOutputOption1').checked = true;
    return true;
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.ShiftOutput.prototype.ok = function(){
    this.onfinishfunc({
            type        : (dojo.byId('shiftOutputOption1').checked ? 0 : 1),
            timeIn      : dojo.byId('shiftOutputTimeIn').checked,
            patternFull : dojo.byId('shiftOutputPattern').checked,
            holidayFull : dojo.byId('shiftOutputHoliday').checked
        },
        'shiftOutputErrorRow',
        function(res){
            this.hide();
        },
        this
    );
};
