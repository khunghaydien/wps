/**
 * 海外出張セクション
 *
 * @constructor
 */
teasp.Tsf.SectionForeign = function(parent){
    this.parent = parent;
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionForeign);
    this.checkable = false;
};

teasp.Tsf.SectionForeign.prototype = new teasp.Tsf.SectionBase();

teasp.Tsf.SectionForeign.prototype.createArea = function(){
    var formEl = this.getDomHelper().create('div', { className: 'ts-main-form ts-section-form ' + this.getFormCss() });
    var formZ1 = this.getDomHelper().create('div', { className: 'ts-section-z1' }, formEl);
    var formZ2 = this.getDomHelper().create('div', { className: 'ts-section-z2' }, formEl);
    this.fp.fcLoop(function(fc){
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, formEl);
        }else{
            var row   = this.getDomHelper().create('div', { className: 'ts-form-row'  }, (fc.getAreaKey() == 'z2' ? formZ2 : formZ1));
            var label = this.getDomHelper().create('div', { className: 'ts-form-label'  }, row);
            this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
            if(fc.isRequired()){
                this.getDomHelper().create('div', { className: 'ts-require' }, label);
            }
            teasp.Tsf.Dom.append(row, fc.createFieldDiv(this.getDomHelper()).areaTags);
        }
    }, this);
    return [this.createSectionBar(this.getDomHelper(), this.fp.getTitle(), this.checkable), formEl];
};

teasp.Tsf.SectionForeign.prototype.insertRow = function(){
    var formEl = teasp.Tsf.Dom.node('.' + this.getFormCss());
    var dataObj = this.getValuesByRowIndex(0);
    // 値を入力欄にセット
    this.fp.fcLoop(function(fc){
        fc.drawText(this.getDomHelper(), dataObj, null, formEl);
    }, this);
    return null;
};
