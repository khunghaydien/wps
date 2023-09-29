/**
 * 経費情報セクション
 *
 * @constructor
 */
teasp.Tsf.SectionExpHead = function(parent){
    this.parent = parent;
    var formType = this.parent.objBase.expPreApply ? this.parent.objBase.expPreApply.obj.Type__c : null
    this.fp = teasp.Tsf.Fp.createFp((tsfManager.isUsingJsNaviSystem() && formType == teasp.constant.EXP_PRE_FORM1) ? teasp.Tsf.formParams.sectionExpHeadJtb : teasp.Tsf.formParams.sectionExpHead);
};

teasp.Tsf.SectionExpHead.prototype = new teasp.Tsf.SectionBase();

teasp.Tsf.SectionExpHead.prototype.createArea = function(){
    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form ' + this.getFormCss() });
    this.getDomHelper().create('div', { className: 'ts-section-z1' }, formEl);
    this.getDomHelper().create('div', { className: 'ts-section-z2' }, formEl);
    this.getDomHelper().create('div', { className: 'ts-section-z3' }, formEl);
    this.getDomHelper().create('div', { className: 'ts-section-z4' }, formEl);
    this.getDomHelper().create('div', { className: 'ts-section-z5' }, formEl);

    var bar = this.createSectionBar(this.getDomHelper(), teasp.message.getLabel('tf10006060'), false, 'ts-section-bar2 margin-top-10'); // 事前申請情報

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

    var expPreApplyId = this.getObjBase().getExpPreApplyId();
    if(expPreApplyId){
        var url = teasp.getPageUrl('expPreApplyView') + '?id=' + expPreApplyId + '&mode=' + tsfManager.getMode();
        if(teasp.isSforce1()){
            this.getDomHelper().connect(teasp.Tsf.Dom.query('a', formEl), 'onclick', this, function(){
                sforce.one.navigateToURL(url);
            });
        }else{
            teasp.Tsf.Dom.setAttr2('a', formEl, 'href', url);
            teasp.Tsf.Dom.setAttr2('a', formEl, 'target', '_blank');
        }
    }else{
        teasp.Tsf.Dom.show(formEl, null, false);
        teasp.Tsf.Dom.show(bar   , null, false);
    }

    return [bar, formEl];
};
