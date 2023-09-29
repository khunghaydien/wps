/**
 * 経費精算印刷画面
 *
 * @constructor
 */
teasp.Tsf.MainPrintExpPay = function(){
    this.titleCss = 'exp-print';
};

teasp.Tsf.MainPrintExpPay.prototype = new teasp.Tsf.MainBase();

teasp.Tsf.MainPrintExpPay.prototype.init = function(){
    teasp.Tsf.MainBase.prototype.init.call(this);
};

teasp.Tsf.MainPrintExpPay.prototype.initEnd = function(areaEl){
};

/**
 * テーブル作成
 *
 */
teasp.Tsf.MainPrintExpPay.prototype.createBase = function(){
    var area = teasp.Tsf.Dom.byId(teasp.Tsf.ROOT_AREA_ID);
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="tsfErrorArea" class="ts-error-area"><div></div></div>'));
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="printExpView" style="padding:0px 4px;"></div>')); // メインリスト
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div class="ts-form-spacer"></div>'));
};
