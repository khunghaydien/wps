/**
 * タイムレポート経費精算エリアs
 *
 * @constructor
 */
teasp.Tsf.FormT = function(targetDate){
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.formT);
    this.sections = [];
    this.targetDate = targetDate;
};

teasp.Tsf.FormT.prototype = new teasp.Tsf.FormBase();

teasp.Tsf.FormT.prototype.createBase = function(){
    var areaEl = this.getDomHelper().create('div', { id: this.fp.getAreaId() });

    var cnt = this.objBase.getSectionDetailCount();
    for(var i = 0 ; i < cnt ; i++){
        var section = new teasp.Tsf.SectionDetail(this, '_sect' + (i + 1));
        section.setReadOnly(this.isReadOnly() || i > 0);
        this.sections.push(section);    // 経費明細セクション
    }

    this.createSections(areaEl);        // セクションエリア作成

    teasp.Tsf.Dom.append(teasp.Tsf.Dom.byId(this.parentId), areaEl);

    teasp.Tsf.Dom.query('table.ts-section-content', areaEl).forEach(function(el){
        teasp.Tsf.Dom.style(el, 'width', '100%');
    }, this);

    return areaEl;
};

/**
 * 画面更新
 *
 * @override
 * @param {Object} objBase
 */
teasp.Tsf.FormT.prototype.refresh = function(objBase, mode){
    this.objBase = objBase;
    this.objBase.setMode(mode);

    this.setReadOnly(this.isReadOnly());

    this.init();

    var objs = this.objBase.getSectionDetailObjs();
    var n = 0;
    dojo.forEach(this.sections, function(section){
        var o = objs[n++];
        o.targetDate = this.targetDate;
        section.refresh(o);
    }, this);
};
