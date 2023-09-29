/**
 * 仮払い申請セクション
 *
 * @constructor
 */
teasp.Tsf.SectionProvisional = function(parent, checkable, type){
    this.parent = parent;
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionProvisional);
    this.checkable = (typeof(checkable) == 'boolean' ? checkable : true);
    this.type = type || 0;
    var fc = this.fp.getFcByApiKey('ProvisionalPaymentApplication__c'); // 仮払申請内容
    fc.setNotUse(this.type ? true : false);
};

teasp.Tsf.SectionProvisional.prototype = new teasp.Tsf.SectionBase();

teasp.Tsf.SectionProvisional.TYPE1 = 1;

teasp.Tsf.SectionProvisional.prototype.createArea = function(){
    var formDiv = this.getDomHelper().create('div', { className: 'ts-main-form ts-section-form ' + this.getFormCss() });
    teasp.Tsf.Dom.show(formDiv, null, !this.checkable);
    var formZ1 = this.getDomHelper().create('div', { className: 'ts-section-z1' }, formDiv);
    var formZ2 = this.getDomHelper().create('div', { className: 'ts-section-z2' }, formDiv);

    this.fp.fcLoop(function(fc){
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, formDiv);
        }else{
            var row   = this.getDomHelper().create('div', { className: 'ts-form-row'  }, (fc.getAreaKey() == 'z2' ? formZ2 : formZ1));
            var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
            this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
            if(fc.isRequired()){
                this.getDomHelper().create('div', { className: 'ts-require' }, label);
            }
            fc.appendFieldDiv(this.getDomHelper(), row);
        }
    }, this);

    // テキストエリアの文字数制限（IE8以下）
    teasp.Tsf.Dom.setlimitChars(this.getDomHelper()
            , teasp.Tsf.Dom.query('textarea', formDiv)
            , this.fp);

    return [this.createSectionBar(this.getDomHelper(), this.fp.getTitle(), this.checkable), formDiv];
};

teasp.Tsf.SectionProvisional.prototype.insertRow = function(){
    var formDiv = teasp.Tsf.Dom.node('.' + this.getFormCss());
    var dataObj = this.getValuesByRowIndex(0);
    // 値を入力欄にセット
    this.fp.fcLoop(function(fc){
        fc.drawText(this.getDomHelper(), dataObj, null, formDiv);
    }, this);
    return null;
};
