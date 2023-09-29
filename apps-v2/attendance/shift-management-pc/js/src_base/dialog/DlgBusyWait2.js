teasp.provide('teasp.dialog.BusyWait2');
/**
 * 処理中ダイアログ（２）
 *
 * @constructor
 * @extends teasp.dialog.Base
 */
teasp.dialog.BusyWait2 = function(){
    this.title = "";
    this.duration = 0;
    this.content = '<table border="0" cellpadding="0" cellspacing="0" id="busyWaitTable"><tr><td><div class="busywait2"></div></td><td style="text-align:center;font-size:17px;color:#3B40FF;"><div id="busyWaitMessage" style="background-color:#ffffff;"></div></td></tr></table>';
    this.nohack = true;
};

teasp.dialog.BusyWait2.prototype = new teasp.dialog.Base();

/**
 *
 * @override
 */
teasp.dialog.BusyWait2.prototype.preStart = function(){
    dojo.query(".dijitDialogTitleBar", this.dialog.id)[0].style.display = 'none';

    dojo.style('busyWaitTable', 'background-color', 'transparent');
//    dojo.style('busyWaitTable', 'background-color', '#ffffff');
    var table = dojo.byId('busyWaitTable');
    dojo.style(table.parentNode, 'background-color', 'transparent');
//    dojo.style(table.parentNode, 'background-color', '#ffffff');
    dojo.style(table.parentNode, 'border', 'none');
    dojo.style(table.parentNode.parentNode, 'border', 'none');
    dojo.style(table.parentNode.parentNode, 'opacity', '0');

    dojo.addClass(table, 'messageArea');
    dojo.addClass(this.dialog.domNode, 'messageArea');
};

/**
 *
 * @override
 */
teasp.dialog.BusyWait2.prototype.preShow = function(){
    if(!this.args.nomove){
        this.dialog._position = dojo.hitch(this.dialog, function(){
            var style = this.domNode.style;
            style.left = "180px";
            style.top  = "50px";
        });
    }
    dojo.byId('busyWaitMessage').innerHTML = (this.args.message || 'www');
    return true;
};
