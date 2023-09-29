/**
 * 経費コメントセクション
 *
 * @constructor
 */
teasp.Tsf.SectionExpComment = function(parent){
    this.parent = parent;
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionExpComment);
};

teasp.Tsf.SectionExpComment.prototype = new teasp.Tsf.SectionBase();

teasp.Tsf.SectionExpComment.prototype.createArea = function(){
    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form ' + this.getFormCss() });
    this.getDomHelper().create('div', { className: 'ts-section-z1' }, formEl);

    this.fp.fcLoop(function(fc){
        var fz = teasp.Tsf.Dom.node('.ts-section-' + fc.getAreaKey(), formEl);
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, formEl);
        }else if(fz){
            var row = this.getDomHelper().create('div', { className: 'ts-form-row'  }, fz);
            this.getDomHelper().create('div', { innerHTML: fc.getLabel()  }
                , this.getDomHelper().create('div', { className: 'ts-form-label'  }, row));
            teasp.Tsf.Dom.append(row, fc.createFieldDiv(this.getDomHelper()).areaTags);
        }
    }, this);

    var dataObj = this.getValuesByRowIndex(0);
    // 値を入力欄にセット
    this.fp.fcLoop(function(fc){
        fc.drawText(this.getDomHelper(), dataObj, null, formEl);
    }, this);

    return formEl;
};
