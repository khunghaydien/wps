/**
 * 経費情報セクション
 *
 * @constructor
 */
teasp.Tsf.SectionExpFilter = function(parent){
    this.parent = parent;
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionExpFilter);
    this.currentExpenseType = null;
};

teasp.Tsf.SectionExpFilter.prototype = new teasp.Tsf.SectionBase();

teasp.Tsf.SectionExpFilter.prototype.createArea = function(){
    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form ' + this.getFormCss() });

    var zp = this.getDomHelper().create('div', { className: 'ts-section-zp', style: 'margin-bottom:10px;' }, formEl);
    this.getDomHelper().create('div', { className: 'ts-section-z1' }, zp);

    var fc = this.fp.getFcByApiKey('ExpenseType__c');
    var expenseTypes = this.parent.getPullExpenseTypes();
    fc.setPickList(expenseTypes);

    this.fp.fcLoop(function(fc){
        var fz = teasp.Tsf.Dom.node('.ts-section-z1', formEl);
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

    var filter = tsfManager.getInfo().getExpFilter();
    if(!filter || !filter.expenseType){
        this.currentExpenseType = this.getCurrentExpenseType(formEl);
        tsfManager.getInfo().setExpFilter({ expenseType: this.currentExpenseType });
    }else{
        this.currentExpenseType = (filter && filter.expenseType);
        this.setCurrentExpenseType(this.currentExpenseType, formEl);
    }

    this.setEventHandler(formEl);
    teasp.Tsf.Dom.show(formEl, null, true);
    var bar = this.createSectionBar(this.getDomHelper(), this.fp.getTitle(), false, 'ts-section-bar2 ts-section-bar-filter margin-top-10');
    var areas = [bar, formEl];
    return areas;
};

teasp.Tsf.SectionExpFilter.prototype.setEventHandler = function(formEl){
    // 精算区分変更イベント
    var select = this.fp.getElementByApiKey('ExpenseType__c', null, formEl);
    if(select){
        this.getDomHelper().connect(select, 'onchange', this, this.changedExpenseType);
    }
};

/**
 * エリアを表示
 */
teasp.Tsf.SectionExpFilter.prototype.existValue = function(){
    return true;
};

/**
 * 精算区分変更
 * @param e
 */
teasp.Tsf.SectionExpFilter.prototype.changedExpenseType = function(e){
    var n = e.target;
    if(tsfManager.checkDiff()){
        teasp.tsConfirm(teasp.message.getLabel('tf10001611'),this,function(result){// 編集中のデータが保存されていませんが、絞り込み条件を変更してよろしいですか？ 
            if(result){
                this.currentExpenseType = n.value;
                this.parent.changedFilter(this.getFilter());
            }else{
                n.value = this.currentExpenseType;
            }
        }) 
    }else{
        this.currentExpenseType = n.value;
        this.parent.changedFilter(this.getFilter());
    }
};

teasp.Tsf.SectionExpFilter.prototype.getExpenseTypeNode = function(formEl){
    return this.fp.getElementByApiKey('ExpenseType__c', null, formEl || this.getFormEl()); // 精算区分選択プルダウン
};

/**
 * 選択中の精算区分を取得
 * @param {Object=} formEl
 * @returns {string|null}
 */
teasp.Tsf.SectionExpFilter.prototype.getCurrentExpenseType = function(formEl){
    var el = this.getExpenseTypeNode(formEl);
    return (el ? el.value : null);
};

/**
 * 精算区分を選択
 * @param {string|null} value
 * @param {Object=} formEl
 * @returns {string|null}
 */
teasp.Tsf.SectionExpFilter.prototype.setCurrentExpenseType = function(value, formEl){
    var el = this.getExpenseTypeNode(formEl);
    if(el){
        el.value = value || '';
    }
};

/**
 * 精算区分プルダウンをリセット
 */
teasp.Tsf.SectionExpFilter.prototype.resetExpenseTypes = function(){
    var fc = this.fp.getFcByApiKey('ExpenseType__c');
    fc.setPickList(this.parent.getPullExpenseTypes());
    var el = this.getExpenseTypeNode();
    if(el){
        fc.loadPickList(this.getDomHelper(), el, el.value);
    }
};

/**
 * フィルタ情報を返す
 * @returns {Object}
 */
teasp.Tsf.SectionExpFilter.prototype.getFilter = function(){
    var expenseType = this.getCurrentExpenseType();
    return {"expenseType": expenseType};
};
