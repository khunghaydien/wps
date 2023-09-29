/**
 * J'sNAVI請求データメイン画面
 *
 * @constructor
 */
teasp.Tsf.MainExpJsNavi = function(){
    this.titleCss = 'exp-jsnavi';
};

teasp.Tsf.MainExpJsNavi.prototype = new teasp.Tsf.MainBase();

teasp.Tsf.MainExpJsNavi.prototype.init = function(){
    teasp.Tsf.MainBase.prototype.init.call(this);
};

teasp.Tsf.MainExpJsNavi.prototype.initEnd = function(areaEl){
    teasp.message.setLabelEx('headManageMenu'	, 'tk10000281');	// 管理メニュー
    teasp.message.setLabelEx('headGreaterThan'	, 'tk10000282');	// ＞
    teasp.message.setLabelEx('headSimpleTitle'	, 'jt18000020');	// J'sNAVI Jr 請求データ参照
    teasp.message.setLabelEx('headConfigName'	, 'jt18000010');	// J'sNAVI Jrの請求データを参照する

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
teasp.Tsf.MainExpJsNavi.prototype.createCommonHeader = function(){
    return teasp.Tsf.Dom.toDom(''
        + '<div>'
        + '    <table class="ts_config" style="width:96%;margin-left:auto;margin:4px auto;">'
        + '    <tr>'
        + '        <td class="pankz" style="text-align:left;">'
        + '            <a href="/apex/AtkManageView" id="headManageMenu"><!--管理メニュー--></a>'
        + '            <span class="pankz_div" id="headGreaterThan"><!--＞--></span>'
        + '            <span class="pankz_str" id="headSimpleTitle"><!--J\'sNAVI Jr 請求データ参照--></span>'
        + '        </td>'
        + '    </tr>'
        + '    <!-- タイトルエリア -->'
        + '    <tr>'
        + '        <td class="horiz_title">'
        + '            <div id="headConfigName" style="float:left;font-size:20px;"><!--J\'sNAVI Jrの請求データの読込を参照する--></div>'
        + '            <div class="pb_base pb_btn_t_return" style="margin-left:640px;" onclick="clickReturn();"></div>'
        + '        </td>'
        + '    </tr>'
        + '    </table>'
        + '</div>');
};
