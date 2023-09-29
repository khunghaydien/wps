/**
 * 稟議情報セクション
 *
 * @constructor
 */
teasp.Tsf.SectionExpRingi = function(parent){
    this.parent = parent;
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionExpRingi);
};

teasp.Tsf.SectionExpRingi.prototype = new teasp.Tsf.SectionBase();

teasp.Tsf.SectionExpRingi.prototype.createArea = function(){
    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form ' + this.getFormCss() });
    this.getDomHelper().create('div', { className: 'ts-section-z1' }, formEl);
    this.getDomHelper().create('div', { className: 'ts-section-z2' }, formEl);
    this.getDomHelper().create('div', { className: 'ts-section-z3' }, formEl);

    this.fp.setReadOnly(true);

    this.fp.fcLoop(function(fc){
        var fz = teasp.Tsf.Dom.node('.ts-section-' + fc.getAreaKey(), formEl);
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, formEl);
        }else if(fz){
            var row = this.getDomHelper().create('div', { className: 'ts-form-row'  }, fz);
            var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
            if(fc.getLw()){
                teasp.Tsf.Dom.style(label, 'width', fc.getLw());
            }
            this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
            teasp.Tsf.Dom.append(row, fc.createFieldDiv(this.getDomHelper()).areaTags);
        }
    }, this);

    var dataObj = this.getValuesByRowIndex(0);
    // 値を入力欄にセット
    this.fp.fcLoop(function(fc){
        fc.drawText(this.getDomHelper(), dataObj, null, formEl);
    }, this);

    var applyId = this.getObjBase().getRingiApplyId();
    if(applyId){
        if(teasp.isSforce1()){
            this.getDomHelper().connect(teasp.Tsf.Dom.query('a', formEl), 'onclick', this, function(){
                sforce.one.navigateToURL('/' + applyId);
            });
        }else{
            teasp.Tsf.Dom.query('a', formEl).forEach(function(el){
                el.href = '/' + applyId;
                el.target = '_blank';
            });
        }
    }

    return [this.createSectionBar(this.getDomHelper(), this.fp.getTitle(), false, 'ts-section-bar2 margin-top-10'), formEl];
};
