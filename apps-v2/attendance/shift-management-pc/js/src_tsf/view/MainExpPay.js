/**
 * 経費精算メイン画面
 *
 * @constructor
 */
teasp.Tsf.MainExpPay = function(){
    this.titleCss = 'exp-pay';
};

teasp.Tsf.MainExpPay.prototype = new teasp.Tsf.MainBase();

teasp.Tsf.MainExpPay.prototype.init = function(){
    teasp.Tsf.MainBase.prototype.init.call(this);
};

teasp.Tsf.MainExpPay.prototype.initEnd = function(areaEl){
    teasp.message.setLabelEx('headManageMenu'             , 'tk10000281');         // 管理メニュー
    teasp.message.setLabelEx('headGreaterThan'            , 'tk10000282');         // ＞
    teasp.message.setLabelEx('headSimpleTitle'            , 'tk10000766');         // 経費精算の消込
    teasp.message.setLabelEx('headConfigName'             , 'tk10000778');         // 経費精算の消込を行う

    teasp.Tsf.Dom.setAttr('#headManageMenu', 'href', teasp.getPageUrl('manageView')); // 管理メニューのリンクを貼りなおす

    // 一覧へ戻る
    this.domHelper.connect(teasp.Tsf.Dom.node('.ts-form-control .ts-form-back > button'), 'onclick', this, function(){
        tsfManager.backToList();
    });
};

/**
 * 共通ヘッダ
 *
 * @returns {Object}
 */
teasp.Tsf.MainExpPay.prototype.createCommonHeader = function(){
    return teasp.Tsf.Dom.toDom(''
        + '<div>'
        + '    <table class="ts_config" style="width:96%;margin-left:auto;margin:4px auto;">'
        + '    <tr>'
        + '        <td class="pankz" style="text-align:left;">'
        + '            <a href="/apex/AtkManageView" id="headManageMenu"><!--管理メニュー--></a>'
        + '            <span class="pankz_div" id="headGreaterThan"><!--＞--></span>'
        + '            <span class="pankz_str" id="headSimpleTitle"><!--経費精算の消込--></span>'
        + '        </td>'
        + '    </tr>'
        + '    <!-- タイトルエリア -->'
        + '    <tr>'
        + '        <td class="horiz_title">'
        + '            <div id="headConfigName" style="float:left;font-size:20px;"><!--経費精算の消込を行う--></div>'
        + '            <div class="pb_base pb_btn_t_return" style="margin-left:640px;" onclick="clickReturn();"></div>'
        + '        </td>'
        + '    </tr>'
        + '    </table>'
        + '</div>');
};
