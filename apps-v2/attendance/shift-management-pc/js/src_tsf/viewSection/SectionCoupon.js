/**
 * 手配回数券セクション
 *
 * @constructor
 */
teasp.Tsf.SectionCoupon = function(parent){
    this.parent = parent;
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionCoupon);
    this.rowMax = 2; // 最大行数
};

teasp.Tsf.SectionCoupon.prototype = new teasp.Tsf.SectionBase();

/**
 * 手配回数券の行追加
 *
 * @param {string=} hkey
 */
teasp.Tsf.SectionCoupon.prototype.insertRow = function(hkey){
    return this.insertTableRow(hkey);
};

teasp.Tsf.SectionCoupon.prototype.insertTableRowEx = function(tr, hkey){
    // 回数券候補をセット
    var select = this.fp.getElementByApiKey('couponName', hkey, tr);
    if(select){
        this.getDomHelper().create('option', { value: '', innerHTML: '' }, select);
        dojo.forEach(tsfManager.getExpCouponList(), function(c){
            this.getDomHelper().create('option', { value: c, innerHTML: c }, select);
        }, this);
    }
};

teasp.Tsf.SectionCoupon.prototype.createArea = function(){
    return this.createTableArea(true);
};
