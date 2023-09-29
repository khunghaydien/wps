teasp.provide('teasp.dialog.MonthInput');
/**
 * 月度入力ダイアログ
 *
 * @constructor
 * @extends teasp.dialog.Base
 */
teasp.dialog.MonthInput = function(){
    this.width = 180;
    this.height = 180;
    this.title = teasp.message.getLabel('tk10005450'); // 月度指定
    this.id = 'MonthInputDialog';
    this.duration = 1;
    this.content = '<table class="pane_table" style="width:160px;"><tr><td style="vertical-align:middle;text-align:center;padding:4px 0px;"><input dojoType="dijit.form.NumberSpinner" value="" constraints="{min:1900,max:2100,pattern:\'####\'}" id="MonthInputY" style="width:60px;border:1px solid #539AC7;font-family:verdana;font-size:13px;" /><span style="padding:0px 8px;font-size:13px;">/</span><input dojoType="dijit.form.NumberSpinner" value="" constraints="{min:1,max:12,pattern:\'00\'}" id="MonthInputM" style="width:42px;border:1px solid #539AC7;font-family:verdana;font-size:13px;" /></td></tr><tr><td style="text-align:center;padding:12px 0px 4px 0px;"><input type="button" id="MonthInputOk" value="OK" style="width:60px;margin-right:8px;padding:2px 4px;" /><input type="button" id="MonthInputCancel" value="Cancel" style="width:60px;margin-left:8px;padding:2px 4px;" /></td></tr></table>';
    this.okLink = {
        id       : 'MonthInputOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'MonthInputCancel',
        callback : this.hide
    };
};

teasp.dialog.MonthInput.prototype = new teasp.dialog.Base();

/**
 * @override
 */
teasp.dialog.MonthInput.prototype.preShow = function(){
    if(/(\d{6})/.test(this.args.yearMonth)){
        var ym = '' + this.args.yearMonth;
        dojo.byId('MonthInputY').value = ym.substring(0, 4);
        dojo.byId('MonthInputM').value = ym.substring(4, 6);
    }else{
        var dt = new Date();
        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        dojo.byId('MonthInputY').value = '' + y;
        dojo.byId('MonthInputM').value = '' + m;
    }
    return true;
};

/**
 * 登録
 * @override
 */
teasp.dialog.MonthInput.prototype.ok = function(){
    if(!dijit.byId('MonthInputY').isValid() || !dijit.byId('MonthInputM').isValid()){
        return;
    }
    var ym = parseInt(dojo.byId('MonthInputY').value, 10) * 100 + parseInt(dojo.byId('MonthInputM').value, 10);
    this.hide();
    this.onfinishfunc({ yearMonth: ym });
};
