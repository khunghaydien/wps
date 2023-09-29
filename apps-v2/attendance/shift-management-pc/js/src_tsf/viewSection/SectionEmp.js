/**
 * 社員情報セクション
 *
 * @constructor
 */
teasp.Tsf.SectionEmp = function(parent){
    this.parent = parent;
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionEmp);
};

teasp.Tsf.SectionEmp.prototype = new teasp.Tsf.SectionBase();

teasp.Tsf.SectionEmp.prototype.createArea = function(){
    var formEl  = this.getDomHelper().create('div', { className: 'ts-section-form ' + this.getFormCss() });
    var formZ1 = this.getDomHelper().create('div', { className: 'ts-section-z1' }, formEl);
    var formZ2 = this.getDomHelper().create('div', { className: 'ts-section-z2' }, formEl);
    var formZ3 = this.getDomHelper().create('div', { className: 'ts-section-z3' }, formEl);

    this.fp.fcLoop(function(fc){
        var fz = (fc.getAreaKey() == 'z3' ? formZ3 : (fc.getAreaKey() == 'z2' ? formZ2 : formZ1));
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, formEl);
        }else if(fc.getDomType() == 'photo'){
            var row = this.getDomHelper().create('div', { className: 'ts-form-row'  }, fz);
            teasp.Tsf.Dom.append(row, fc.createFieldDiv(this.getDomHelper()).areaTags);
        }else{
            var row = this.getDomHelper().create('div', { className: 'ts-form-row'  }, fz);
            this.getDomHelper().create('div', { innerHTML: fc.getLabel()  }
                , this.getDomHelper().create('div', { className: 'ts-form-label'  }, row));
            teasp.Tsf.Dom.append(row, fc.createFieldDiv(this.getDomHelper()).areaTags);
        }
    }, this);

    var dataObj = dojo.clone(tsfManager.getTargetEmp().getEmp());
    dataObj.DeptId__c = this.parent.getDeptId();
    dataObj.DeptId__r = this.parent.getDept();
    // 値を入力欄にセット
    this.fp.fcLoop(function(fc){
        fc.drawText(this.getDomHelper(), dataObj, null, formEl);
    }, this);

    teasp.Tsf.Dom.show(formEl, null, tsfManager.isOthers()); // 社員情報セクションは自分のデータではない時だけ表示する

    return formEl;
};
