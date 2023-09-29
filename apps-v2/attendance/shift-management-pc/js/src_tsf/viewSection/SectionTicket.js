/**
 * 手配チケットセクション
 *
 * @constructor
 */
teasp.Tsf.SectionTicket = function(parent){
    this.parent = parent;
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionTicket);
    this.rowMax = 5; // 最大行数
};

teasp.Tsf.SectionTicket.prototype = new teasp.Tsf.SectionBase();

/**
 * 手配チケットの行追加
 *
 * @param {string=} hkey
 */
teasp.Tsf.SectionTicket.prototype.insertRow = function(hkey){
    return this.insertTableRow(hkey);
};

teasp.Tsf.SectionTicket.prototype.createArea = function(){
    return this.createTableArea(true);
};
