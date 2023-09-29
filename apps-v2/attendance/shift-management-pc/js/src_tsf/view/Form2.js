/**
 * 会議・交際費申請フォーム
 *
 * @constructor
 */
teasp.Tsf.Form2 = function(){
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.form2);
    this.sections = [
        new teasp.Tsf.SectionProvisional(this),  // 仮払い申請セクション
        new teasp.Tsf.SectionExpAttach(this)     // 添付ファイルセクション
    ];
};

teasp.Tsf.Form2.prototype = new teasp.Tsf.FormBase();

teasp.Tsf.Form2.prototype.getFormStyle = function(){ return 2; };

/**
 * 初期化
 *
 */
teasp.Tsf.Form2.prototype.init = function(){
    // 事前申請のオプション適用
    var typeName = this.objBase.getTypeName();
    this.useProvisionalSect  = tsfManager.getInfo().isUseProvisionalSect(typeName);     // 仮払申請セクションを使う

    // ★★ 親クラスの init を呼び出す ★★
    teasp.Tsf.FormBase.prototype.init.call(this);

    if(this.objBase.getProvisionalPaymentId()){ // 仮払申請のリンクがセットされている
        this.useProvisionalSect = false;        // 仮払申請セクションは非表示にする
    }
    // セクションの表示／非表示。値が入力済みの場合は設定に関わらず表示
    if(!this.useProvisionalSect   && this.existSectionValue('provisional')){ this.useProvisionalSect   = true; } // 仮払い申請セクションを使う
    this.showSection('provisional', this.useProvisionalSect); // 仮払い申請セクションを使う
};

/**
 * 画面更新
 *
 * @override
 * @param {Object} objBase
 */
teasp.Tsf.Form2.prototype.refresh = function(objBase, mode){

    // refresh後にsavePointを取得するので、ここでの入力項目欄の内容編集は慎重にすること

    // ★★ 親クラスの refresh を呼び出す ★★ //ここでレコードから読み込んだ値を各項目へセットしている。
    teasp.Tsf.FormBase.prototype.refresh.call(this, objBase, mode);

    var select = this.fp.getElementByApiKey('SocialExpItemId__c', null, this.getArea()); // 費目
    if(!this.getObjBase().getId() && !select.value && tsfManager.getSocialExpenseItemId()){
        select.value = tsfManager.getSocialExpenseItemId();
    }

    if( this.isReadOnly() ){    //参照
        var expItem = tsfManager.getExpItemById(this.getObjBase().getDataObj().SocialExpItemId__c);
        this.initShowNumberItem();
        this.changedSocialExpItemOnReadOnly(expItem);
        this.willShowNumberIfItIsValidAndSet(expItem);
        this.willShowNumberIfItIsValidAndUnset(expItem);
    }else{
        //idがあるときは、編集。ないときは新規登録
        //編集モードクリック時もここへ入る。
        if(!this.getObjBase().getId()){
            //新規登録
            this.initShowNumberItem();
            this.changedSocialExpItem(select);
            this.rewriteParticipantsByTemplate(select);
            this.rewriteParticipantsNumber(select);
            this.rewritePlace(select);
        }else{
            //編集
            this.initShowNumberItem();
            this.changedSocialExpItem(select);
            this.willShowNumberIfItIsValidAndSet(this.getSocialExpItem(select));
            this.willShowNumberIfItIsValidAndUnset(this.getSocialExpItem(select));
        }
    }

    // 合計人数
    this.changedNumber();

    // 金額
    teasp.Tsf.Dom.html('.ts-total-amount', null, this.objBase.getTotalAmount() || '&nbsp;');

    //高さ調整
    var interTextRow = teasp.Tsf.Dom.getAncestorByCssName(this.fp.getElementByApiKey('InternalParticipants__c', null, this.getArea()), 'ts-form-row');
    dojo.query('textarea', interTextRow ).style('height', '90px');
    var exterTextRow = teasp.Tsf.Dom.getAncestorByCssName(this.fp.getElementByApiKey('ExternalParticipants__c', null, this.getArea()), 'ts-form-row');
    dojo.query('textarea', exterTextRow ).style('height', '90px');
};

/**
 * 参照時の費目選択による表示処理
 * @param {Object} expItem
 */
teasp.Tsf.Form2.prototype.changedSocialExpItemOnReadOnly = function(expItem){

    this.willShowParticipantsIfItIsSet(expItem);
    
    this.changedNumber();

    this.showExpMatching();
};

teasp.Tsf.Form2.prototype.createBase = function(){
    // ★★ 親クラスの createBase を呼び出す ★★
    var areaEl = teasp.Tsf.FormBase.prototype.createBase.call(this);

    this.loadSocialExpItem(); // 費目の選択肢をセット
    var select = this.fp.getElementByApiKey('SocialExpItemId__c', null, areaEl); // 費目
    this.getDomHelper().connect(select, 'onchange', this, this.selectedSocialExpItem);

    var startDateEl = this.fp.getElementByApiKey('StartDate__c'  , null, areaEl); //予定日
    this.getDomHelper().connect(startDateEl, 'onblur', this, this.changedNumber);
    this.getDomHelper().connect(startDateEl, 'onkeypress', this, this.pressedNumber);

    var ourEl = this.fp.getElementByApiKey('OurNumber__c'  , null, areaEl); // 社内参加者
    var theEl = this.fp.getElementByApiKey('TheirNumber__c', null, areaEl); // 社外参加者

    this.getDomHelper().connect(ourEl, 'onblur', this, this.retreatOurNumber);
    this.getDomHelper().connect(theEl, 'onblur', this, this.retreatTheirNumber);

    this.getDomHelper().connect(ourEl, 'onkeypress', this, this.pressedOurNumber);
    this.getDomHelper().connect(theEl, 'onkeypress', this, this.pressedTheirNumber);

    var amount = this.fp.getElementByApiKey('TotalAmount__c', null, areaEl);   //合計金額
    this.getDomHelper().connect(amount, 'onblur', this, this.changedNumber);
    this.getDomHelper().connect(amount, 'onblur', this, this.pressedNumber);

    this.createAmountPerParticipants();  // 人数割金額

    return areaEl;
};

teasp.Tsf.Form2.prototype.loadSocialExpItem = function(areaEl){
    this.loadExpItemFilter();
    // 費目の選択肢をセット
    var select = this.fp.getElementByApiKey('SocialExpItemId__c', null, areaEl); // 費目
    var v = select.value || '';
    var sel = null;
    teasp.Tsf.Dom.empty(select);
    this.getDomHelper().create('option', { value: '', innerHTML: '' }, select);
    dojo.forEach(tsfManager.getExpItems(this.expItemFilter), function(expItem){
        if(expItem.isSocial()){ // 選択肢は、費目種別＝会議・交際費の費目に限定
            this.getDomHelper().create('option', { value: expItem.getId(), innerHTML: expItem.getName() }, select);
            if(v == expItem.getId()){
                sel = expItem.getId();
            }
        }
    }, this);
    if(sel){
        select.value = sel;
    }else if(v){
        var expItem = tsfManager.getExpItemById(v); // 費目
        if(expItem){
            this.getDomHelper().create('option', { value: expItem.getId(), innerHTML: expItem.getName() }, select);
            select.value = v;
        }
    }
};

/**
 * 人数割金額を取得
 * @returns {String} 人数割金額
 */
teasp.Tsf.Form2.prototype.getPricePerTotalPart = function(){

    var expItem = this.getSocialExpItem();

    var totalAmountWithoutTax;
    if(expItem){
        var startDate =  this.fp.getFcByApiKey('StartDate__c', null, this.getArea()).fetchValue().value; 

        if(expItem.isTaxFlag()){ // 税入力＝オンの費目
            var taxType      = expItem.getTaxType();                // 税タイプ
            var allowMinus   = expItem.isAllowMinus();              // マイナス可
            var taxRoundFlag = tsfManager.getTaxRoundFlag();        // 端数処理
            var taxRate      = expItem.getTaxRate(startDate);       // 税率
            var taxAuto      = true;
            var o = teasp.Tsf.ExpDetail.calcTax(this.fp.getFcByApiKey('TotalAmount__c').fetchValue().value || 0, 0, 0, 0, taxType, taxRate, taxAuto, taxRoundFlag, allowMinus);
            totalAmountWithoutTax = o.withoutTax;
        }else{
            var taxType      = 1;                                   // 税タイプは内税で固定
            var allowMinus   = expItem.isAllowMinus();              // マイナス可
            var taxRoundFlag = tsfManager.getTaxRoundFlag();        // 端数処理(common設定を取得)
            var taxRate      = expItem.getTaxRate(startDate);       // 税率(自動の設定)
            var taxAuto      = true;
            var o = teasp.Tsf.ExpDetail.calcTax(this.fp.getFcByApiKey('TotalAmount__c').fetchValue().value || 0, 0, 0, 0, taxType, taxRate, taxAuto, taxRoundFlag, allowMinus);
            totalAmountWithoutTax = o.withoutTax;
        }
    }
    var totalNumber = this.fp.getFcByApiKey('_totalNumber').fetchValue().value;
    
    if( totalNumber && totalAmountWithoutTax 
     && totalNumber !== '' && totalAmountWithoutTax !== ''
     && totalNumber !== 0 ){
        return teasp.message.getLabel('tf10011000') + teasp.message.getLabel('tm10001590') + teasp.Tsf.Currency.formatMoney(teasp.Tsf.Currency.roundSameAsSalesforce( totalAmountWithoutTax / totalNumber ), teasp.Tsf.Currency.V_YEN, false, true);
    }else{
        return teasp.message.getLabel('tf10011000') + teasp.message.getLabel('tm10001590') + teasp.message.getLabel('cunit_text')+'-';
    }
};

/**
 * 費目を変更した時のイベント処理
 */
teasp.Tsf.Form2.prototype.selectedSocialExpItem = function(e){
    //費目の変更に伴い、入力値はいったんリセット
    var select = this.fp.getElementByApiKey('SocialExpItemId__c', null, this.getArea()); // 費目
    this.initShowNumberItem();
    this.changedSocialExpItem(select);
    this.switchToZeroParticipantsNumberByInvalidSetting(select);
    this.rewriteParticipantsByTemplate(select);
    this.rewriteParticipantsNumber(select);
    this.rewritePlace(select);

    this.clearParticipantsIfExpItemNull();
    this.clearParticipantsNumberIfExpItemNull();
    this.clearPlaceIfExpItemNull();
};

/**
 * 費目を変更した時の処理
 * @param {Object} select
 */
teasp.Tsf.Form2.prototype.changedSocialExpItem = function(select){
    teasp.Tsf.Error.showError();
    var expItemId = select.value || null;
    if(expItemId){
        var expItem = tsfManager.getExpItemById(expItemId);
        var amount = this.fp.getElementByApiKey('TotalAmount__c', null, this.getArea()); // 金額
        if(amount && expItem){ // 費目に標準金額が設定されている
            if(expItem.getCost()){
                amount.value = teasp.Tsf.Currency.formatMoney(expItem.getCost(), teasp.Tsf.Currency.V_YEN, false, true); // 標準金額をセット
                this.changedCurrency();
            }
            // 金額固定ならリードオンリーにする
            var fix = (expItem.isFixAmount() && expItem.getCost());
            teasp.Tsf.Dom.setAttr(amount, 'readOnly', fix);
            teasp.Tsf.Dom.toggleClass(amount, 'read-only', fix);
        }
    }

    this.willShowParticipantsIfItIsSet(expItem);

    this.changedNumber();

    this.showExpMatching();
};

/**
 * 人数割金額項目を生成する。
 */
teasp.Tsf.Form2.prototype.createAmountPerParticipants = function(){
    var priceRow = teasp.Tsf.Dom.getAncestorByCssName(
        this.fp.getElementByApiKey('TotalAmount__c', null, this.getArea()), //金額
        'ts-form-row'
        );
    var pricePerTotalPart = this.getDomHelper().create(
        'div',
        {
            innerHTML: this.getPricePerTotalPart(),
            id:'pricePerTotalPartDisp'
        },
        priceRow,
        'last'
    );
    teasp.Tsf.Dom.style(pricePerTotalPart,'padding-left','20px');
};

teasp.Tsf.Form2.prototype.changedNumber = function(e){
    this.recalcTotalNumber(e);
}


/**
 * 社内参加者入力項目の更新処理
 */
teasp.Tsf.Form2.prototype.retreatOurNumber = function(e){
    var our = this.treatNumber('OurNumber__c');
    var fc = this.fp.getFcByApiKey('OurNumber__c');

    var o= {
        OurNumber__c    : our
    };

    fc.drawText(this.getDomHelper(), o); // 社内参加者
    this.recalcTotalNumber(e);
}

/**
 * 社外参加者入力項目の更新処理
 */
teasp.Tsf.Form2.prototype.retreatTheirNumber = function(e){
    var the = this.treatNumber('TheirNumber__c');
    var fc = this.fp.getFcByApiKey('TheirNumber__c');

    var o= {
        TheirNumber__c    : the
    };

    fc.drawText(this.getDomHelper(), o); // 社外参加者
    this.recalcTotalNumber(e);
}

/**
 * 表示されている項目で、合計人数を算出する
 */
teasp.Tsf.Form2.prototype.recalcTotalNumber = function(e){

    var ourN = null;
    var theN = null;
    var expItem = this.getSocialExpItem();

    var interNumber = this.fp.getElementByApiKey('OurNumber__c', null, this.getArea()); 
    var interNumberRow = teasp.Tsf.Dom.getAncestorByCssName(interNumber, 'ts-form-row');
    var isInterVisible = teasp.Tsf.Dom.isVisible(interNumberRow , this.getArea(), false);
    
    var exterNumber = this.fp.getElementByApiKey('TheirNumber__c', null, this.getArea()); 
    var exterNumberRow = teasp.Tsf.Dom.getAncestorByCssName(exterNumber, 'ts-form-row');
    var isExterVisible = teasp.Tsf.Dom.isVisible(exterNumberRow , this.getArea(), false);

    if(isInterVisible){
        ourN = this.treatNumber('OurNumber__c');
    }else{
        ourN = null;
    }
    if(isExterVisible){
        theN = this.treatNumber('TheirNumber__c');
    }else{
        theN = null;
    }

    this.fp.getFcByApiKey('_totalNumber').drawText(this.getDomHelper(), {_totalNumber : (ourN===null?'':ourN) + (theN===null?'':theN)} ); // 合計人数

    this.recalcPricePerTotalPart(expItem);
}

/**
 * 人数割り金額を算出する
 * @param expItem 現在選択中の費目
 */
teasp.Tsf.Form2.prototype.recalcPricePerTotalPart = function(expItem){
    if(expItem){
        if(expItem.isInternalParticipants() || expItem.isExternalParticipants()){
            teasp.Tsf.Dom.setAttr2('#pricePerTotalPartDisp',this.getArea(), 'innerHTML', this.getPricePerTotalPart() );
        }else{
            teasp.Tsf.Dom.setAttr2('#pricePerTotalPartDisp',this.getArea(), 'innerHTML', '' );
        }
    }else{
        teasp.Tsf.Dom.setAttr2('#pricePerTotalPartDisp',this.getArea(), 'innerHTML', '' );
    }
}

/**
 * 人数入力項目の取得・整形処理
 * @param apiname 取得したいapiname(社内参加者か、社外参加者のみ)
 * @retunrs 数値化した人数項目。空の時または、対象外の呼び出しのときはnull(費目取得失敗時やAPI名が間違っているとき)。
 */
teasp.Tsf.Form2.prototype.treatNumber = function(apiname){
    var fc = this.fp.getFcByApiKey(apiname);
    var s = fc.fetchValue().value;
    var n = teasp.Tsf.util.parseInt(s);

    if( s>=0 ){
        return n;
    }else{
        return null;
    }
}

teasp.Tsf.Form2.prototype.pressedNumber = function(e){
    if (e.keyChar === "" && e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
        e.preventDefault();
        e.stopPropagation();
        this.changedNumber(e);
    }
};

teasp.Tsf.Form2.prototype.pressedOurNumber = function(e){
    if (e.keyChar === "" && e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
        e.preventDefault();
        e.stopPropagation();
        this.retreatOurNumber(e);
    }
};

teasp.Tsf.Form2.prototype.pressedTheirNumber = function(e){
    if (e.keyChar === "" && e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
        e.preventDefault();
        e.stopPropagation();
        this.retreatTheirNumber(e);
    }
};


/**
 * 金額が変更された
 *
 * @param {Object} e
 */
teasp.Tsf.Form2.prototype.changedCurrency = function(e){
    var fc = this.fp.getFcByApiKey('TotalAmount__c');
    var cost = fc.fetchValue().value || 0;
    teasp.Tsf.Dom.html('.ts-total-amount', null, teasp.Tsf.Currency.formatMoney(cost, teasp.Tsf.Currency.V_YEN, false, true));

    teasp.Tsf.FormBase.prototype.changedCurrency.call(this);
};

/**
 * 精算区分、費目表示区分の情報をセット
 */
teasp.Tsf.Form2.prototype.loadExpItemFilter = function(){
    var assist = this.getAssist();
    this.expItemFilter = {
        empExpItemClass  : tsfManager.getTargetEmp().getExpItemClass(),
        deptExpItemClass : (assist && assist.ChargeDeptId__r && assist.ChargeDeptId__r.ExpItemClass__c) || null,
        expenseType      : (assist && assist.ExpenseType__c) || null
    };
};

/**
 * 不整合を探す
 * @returns {number}
 */
teasp.Tsf.Form2.prototype.getExpMatching = function(){
    var fc = this.fp.getFcByApiKey('SocialExpItemId__c');
    var expItemId = fc.fetchValue().value || null;
    var expItem = (expItemId ? tsfManager.getExpItemById(expItemId) : null);
    var flag = 0;
    if(expItem){
        if(!expItem.checkExpenseType(this.expItemFilter.expenseType)){
            flag = teasp.Tsf.EmpExp.MISMATCH_EXPENSE_TYPE;
        }
        if(!expItem.isSelectable(this.expItemFilter.empExpItemClass)
        && !expItem.isSelectable(this.expItemFilter.deptExpItemClass)){
            flag |= teasp.Tsf.EmpExp.MISMATCH_EXPITEM_CLASS;
        }
    }
    return flag;
};

/**
 * 精算区分、負担部署が変更された
 */
teasp.Tsf.Form2.prototype.changedAssist = function(){
    this.loadSocialExpItem(this.getArea());
    this.showExpMatching();
};

/**
 * 不整合を表示する
 */
teasp.Tsf.Form2.prototype.showExpMatching = function(){
    if(!this.isShowMisMatch()){
        return;
    }
    var flag = this.getExpMatching();
    var select = this.fp.getElementByApiKey('SocialExpItemId__c', null, this.getArea()); // 費目
    var div = teasp.Tsf.Dom.node('div.ts-form-label', teasp.Tsf.Dom.getAncestorByCssName(select, 'ts-form-row'));
    if(div){
        var p = teasp.Tsf.Dom.node('div.ts-mismatch', div);
        if(p){
            teasp.Tsf.Dom.destroy(p);
        }
        var t = [];
        if(flag & (teasp.Tsf.EmpExp.MISMATCH_EXPENSE_TYPE)){
            t.push(teasp.message.getLabel('tf10006860')); // 精算区分不整合
        }
        if(flag & teasp.Tsf.EmpExp.MISMATCH_EXPITEM_CLASS){
            t.push(teasp.message.getLabel('tf10006870')); // 費目表示区分不整合
        }
        if(t.length){
            this.getDomHelper().create('div', { className: 'pp_ico_ng' }
                , this.getDomHelper().create('div', { className: 'ts-mismatch' }, div));
        }
        div.title = (t.length ? t.join('\r\n') : '');
    }
};

/**
 * 不整合フラグを返す
 * @returns {number}
 */
teasp.Tsf.Form2.prototype.getMisMatchFlag = function(){
    return this.getExpMatching();
};


/**
 * 入力値の取得および、
 * 合計人数チェックバリデーション
 *
 * @override
 * @param {Object} objBase
 */
teasp.Tsf.Form2.prototype.getDomValues = function(flag, chklev, chkSep){

    // 自前で必須入力判定処理を行いたいため、一時的に必須入力項目設定を解除する。
    this.fp.getFcByApiKey('OurNumber__c', null, this.getArea()).setRequired(0);
    this.fp.getFcByApiKey('TheirNumber__c', null, this.getArea()).setRequired(0);

    // ★★ 親クラスの getDomValues を呼び出す ★★
    var data = teasp.Tsf.FormBase.prototype.getDomValues.call(this, flag,chklev, chkSep);

    //必須入力項目設定を復元。
    this.fp.getFcByApiKey('OurNumber__c', null, this.getArea()).setRequired(1);
    this.fp.getFcByApiKey('TheirNumber__c', null, this.getArea()).setRequired(1);

    if( data && data.ngList ){
        var totalNumberFc = this.fp.getFcByApiKey('_totalNumber', null, this.getArea());
        var totalNumberV = totalNumberFc.fetchValue().value;

        var expItem = this.getSocialExpItem();
        if(expItem){

            if(expItem.isInternalParticipants()){
                var interNumberFc = this.fp.getFcByApiKey('OurNumber__c', null, this.getArea());
                var interNumberV = interNumberFc.fetchValue().value;
                if( interNumberV !== null && interNumberV < 0 ){    //空のときはnullになる。
                    data.ngList.push({ ngType:4, fc:interNumberFc, message:teasp.message.getLabel('tf10001852') }); //0以上を入力してください。
                }
            }

            if(expItem.isExternalParticipants()){
                var exterNumberFc = this.fp.getFcByApiKey('TheirNumber__c', null, this.getArea());
                var exterNumberV = exterNumberFc.fetchValue().value;
                if( exterNumberV !== null && exterNumberV < 0 ){    //空のときはnullになる。
                    data.ngList.push({ ngType:4, fc:exterNumberFc, message:teasp.message.getLabel('tf10001852') }); //0以上を入力してください。
                }
            }

            if( (expItem.isInternalParticipants()===true) && (expItem.isExternalParticipants()===false) ){
                if( totalNumberV !== null && totalNumberV === 0 ){  //空のときはnullになる。
                    data.ngList.push({ ngType:4, fc:totalNumberFc, message:teasp.message.getLabel('tf10001854') }); //合計人数が1人以上になるように社内参加者人数と社外参加者人数を入力してください。
                }
            }else if( (expItem.isInternalParticipants()===false) && (expItem.isExternalParticipants()===true) ){
                if( totalNumberV !== null && totalNumberV === 0 ){  //空のときはnullになる。
                    data.ngList.push({ ngType:4, fc:totalNumberFc, message:teasp.message.getLabel('tf10001855') }); //合計人数が1人以上になるように社内参加者人数と社外参加者人数を入力してください。
                }
            }else if( (expItem.isInternalParticipants()===true) && (expItem.isExternalParticipants()===true) ){
                if( totalNumberV !== null && totalNumberV === 0 ){  //空のときはnullになる。
                    data.ngList.push({ ngType:4, fc:totalNumberFc, message:teasp.message.getLabel('tf10001851') }); //合計人数が1人以上になるように社内参加者人数と社外参加者人数を入力してください。
                }
            }
        }
    }
    return data;
};

/**
 * 社内参加者と社外参加者の情報を設定する。
 * 社内・社外参加者人数の設定があるときは、社内参加者テンプレートと社外参加者テンプレートで上書きする。
 * @param {Object} select : 選択中の費目
 */
teasp.Tsf.Form2.prototype.rewriteParticipantsByTemplate = function(select){
    var expItem = this.getSocialExpItem(select);
    if(expItem){
        if(expItem.isInternalParticipants()){
            var v = expItem.expItem.InternalParticipantsTemplateText__c || '';//テンプレートが空の時(null)はundefinedになる。
            this.fp.getFcByApiKey('InternalParticipants__c').drawText( this.getDomHelper(), {InternalParticipants__c : v} );
        }else{
            this.fp.getFcByApiKey('InternalParticipants__c').drawText( this.getDomHelper(), {InternalParticipants__c : ''} );
        }
        if(expItem.isExternalParticipants()){
            var v = expItem.expItem.ExternalParticipantsTemplateText__c || '';//テンプレートが空の時(null)はundefinedになる。
            this.fp.getFcByApiKey('ExternalParticipants__c').drawText( this.getDomHelper(), {ExternalParticipants__c : v} );
        }else{
            this.fp.getFcByApiKey('ExternalParticipants__c').drawText( this.getDomHelper(), {ExternalParticipants__c : ''} );
        }
        if(expItem.isInternalParticipants() || expItem.isExternalParticipants()){   //合計人数を計算させる
            this.changedNumber();
        }
    }
};

/**
 * 費目がnullのとき、社内参加者と社外参加者の情報を空にする。
 * @param {Object} select : 選択中の費目
 */
teasp.Tsf.Form2.prototype.clearParticipantsIfExpItemNull = function(){
    var expItem = this.getSocialExpItem();
    if(expItem){
        //nullの時を処理したいため、ここは処理なし
    }else{
        this.fp.getFcByApiKey('InternalParticipants__c').drawText( this.getDomHelper(), {InternalParticipants__c : ''} );
        this.fp.getFcByApiKey('ExternalParticipants__c').drawText( this.getDomHelper(), {ExternalParticipants__c : ''} );
    }
};

/**
 * 店舗情報値を設定する。
 * @param {Object} select : 選択中の費目
 */
teasp.Tsf.Form2.prototype.rewritePlace = function(select){
    var expItem = this.getSocialExpItem(select);
    if(expItem){
        if(expItem.isPlace()){
            //処理なし
        }else{
            this.fp.getFcByApiKey('PlaceName__c').drawText( this.getDomHelper(), {PlaceName__c : ''} );
            this.fp.getFcByApiKey('PlaceAddress__c').drawText( this.getDomHelper(), {PlaceAddress__c : ''} );
        }
    }
}

/**
 * 費目がnullのとき、店舗情報値を空にする。
 * @param {Object} select : 選択中の費目
 */
teasp.Tsf.Form2.prototype.clearPlaceIfExpItemNull = function(){
    var expItem = this.getSocialExpItem();
    if(expItem){
        //nullの時を処理したいため、ここは処理なし
    }else{
        this.fp.getFcByApiKey('PlaceName__c').drawText( this.getDomHelper(), {PlaceName__c : ''} );
        this.fp.getFcByApiKey('PlaceAddress__c').drawText( this.getDomHelper(), {PlaceAddress__c : ''} );
    }
}

/**
 * 費目に伴う値のnull化処理。
 * 社内・社外参加者人数の設定があり「入力しない」のときは、nullで上書きする。
 */
teasp.Tsf.Form2.prototype.switchToNullParticipantsNumber = function(){

    var expItem = this.getSocialExpItem();
    if(expItem){
        if(expItem.isValidInternalParticipants()){
            if(expItem.isInternalParticipants()){
                // 設定があって、「入力する」の時は、値の編集は行わずそのまま
            }else{
                this.fp.getFcByApiKey('OurNumber__c').drawText( this.getDomHelper(), {OurNumber__c : ''})
            }
        }else{
            // 設定が無い時は、値の編集は行わずそのまま
        }
        
        if(expItem.isValidExternalParticipants()){
            if(expItem.isExternalParticipants()){
                // 設定があって、「入力する」の時は、値の編集は行わずそのまま
            }else{
                this.fp.getFcByApiKey('TheirNumber__c').drawText( this.getDomHelper(), {TheirNumber__c : ''})
            }
        }else{
            // 設定が無い時は、値の編集は行わずそのまま
        }

        this.changedNumber();
    }
};



/**
 * 費目に伴う値の0化処理。
 * 社内・社外参加者人数の設定がないとき、0で上書きする。
 */
teasp.Tsf.Form2.prototype.switchToZeroParticipantsNumberByInvalidSetting = function(){

    var expItem = this.getSocialExpItem();
    if(expItem){
        if(expItem.isValidInternalParticipants()){
            //設定があるときは、値の編集は行わずそのまま
        }else{
            this.fp.getFcByApiKey('OurNumber__c').drawText( this.getDomHelper(), {OurNumber__c : 0})
        }
        
        if(expItem.isValidExternalParticipants()){
            //設定があるときは、値の編集は行わずそのまま
        }else{
            this.fp.getFcByApiKey('TheirNumber__c').drawText( this.getDomHelper(), {TheirNumber__c : 0})
        }

        this.changedNumber();
    }
};

/**
 * 費目に伴う値のリセット処理。
 * 社内・社外参加者人数の設定があるときは、0またはnullで上書きする。
 */
teasp.Tsf.Form2.prototype.rewriteParticipantsNumber = function(){
    var expItem = this.getSocialExpItem();
    if(expItem){
        if(expItem.isValidInternalParticipants()){
            if(expItem.isInternalParticipants()){
                this.fp.getFcByApiKey('OurNumber__c').drawText( this.getDomHelper(), {OurNumber__c : 0});
            }else{
                this.fp.getFcByApiKey('OurNumber__c').drawText( this.getDomHelper(), {OurNumber__c : ''});
            }
        }else{
            // 設定が無い時は、値の編集は行わずそのまま
        }

        if(expItem.isValidExternalParticipants()){
            if(expItem.isExternalParticipants()){
                this.fp.getFcByApiKey('TheirNumber__c').drawText( this.getDomHelper(), {TheirNumber__c : 0});
            }else{
                this.fp.getFcByApiKey('TheirNumber__c').drawText( this.getDomHelper(), {TheirNumber__c : ''});
            }
        }else{
            // 設定が無い時は、値の編集は行わずそのまま
        }

        this.changedNumber();
    }
};

/**
 * 費目がnullのとき、社内・社外参加者人数を空にする。
 */
teasp.Tsf.Form2.prototype.clearParticipantsNumberIfExpItemNull = function(){
    var expItem = this.getSocialExpItem();
    if(expItem){
        //nullの時を処理したいため、ここは処理なし
    }else{
        this.fp.getFcByApiKey('OurNumber__c').drawText( this.getDomHelper(), {OurNumber__c : ''});
        this.fp.getFcByApiKey('TheirNumber__c').drawText( this.getDomHelper(), {TheirNumber__c : ''});
        this.changedNumber();
    }
};


/**
 * 費目情報を取得し、会議・交際費の費目か判定する。
 * 会議・交際費のときは、費目情報を返す。
 * @param {Object} select 省略可能。取得した費目の入力項目のElement。
 * @return 取得した会議・交際費の費目。null:対象となる会議・交際費費目以外の時。
 */
teasp.Tsf.Form2.prototype.getSocialExpItem = function(select){
    var expItemId;
    if( !select ){
        if(this.isReadOnly()){
            expItemId = this.getObjBase().getDataObj().SocialExpItemId__c;
        }else{
            expItemId = this.fp.getElementByApiKey('SocialExpItemId__c', null, this.getArea()).value || null;
        }
    }else{
        expItemId = select.value || null;
    }
    if(expItemId){
        var expItem = tsfManager.getExpItemById(expItemId);
        if(expItem){
            return expItem;
        }else{
            return null;
        }
    }else{
        return null;
    }
}

teasp.Tsf.Form2.prototype.savePoint = function(){

    //idがあるときは、編集。ないときは新規登録
    if(!this.getObjBase().getId()){
        //新規作成では処理なし
    }else{
        //編集
        //save前に、自動で0にされてしまう、人数nullをnullに戻す。
        this.combackNullNumber();
    }

    // ★★ 親クラスの savePoint を呼び出す ★★
    teasp.Tsf.FormBase.prototype.savePoint.call(this);


    // savepoint取得後、費目が空のときの入力欄の調整を行う。
    if( this.isReadOnly() ){    //参照
        //参照モードでは編集なし
    }else{
        if(!this.getObjBase().getId()){
            //新規作成
            this.clearParticipantsIfExpItemNull();
            this.clearParticipantsNumberIfExpItemNull();
            this.clearPlaceIfExpItemNull();
        }else{
            //編集
            this.clearParticipantsIfExpItemNull();
            this.clearParticipantsNumberIfExpItemNull();
            this.clearPlaceIfExpItemNull();
        }
    }
};


/**
 * 社内・社外参加者人数の設定があり、「入力しない」のときは表示しないが、人数が有効な値であれば人数を入力項目を表示する。
 * 参照モードのときは、表示項目として表示される。
 * @param {Object} expItem 会議・交際費の費目。
 */
teasp.Tsf.Form2.prototype.willShowNumberIfItIsValidAndSet = function(expItem){

    var totalFlg = false;

    if(expItem){
        if(expItem.isValidInternalParticipants()){
            if(expItem.isInternalParticipants()){
                //処理なし
            }else{
                var ourN = this.treatNumber('OurNumber__c');
                if( ourN!==null && ourN >= 1 ){
                    var interNumber = this.fp.getElementByApiKey('OurNumber__c', null, this.getArea());
                    var interNumberRow = teasp.Tsf.Dom.getAncestorByCssName(interNumber, 'ts-form-row');
                    teasp.Tsf.Dom.show(interNumberRow , this.getArea(), true);
                    totalFlg=true;
                }
            }
        }else{
            //設定がない時は対象外
        }
        
        if(expItem.isValidExternalParticipants()){
            if(expItem.isExternalParticipants()){
                //処理なし
            }else{
                var theN = this.treatNumber('TheirNumber__c');
                if( theN!==null && theN >= 1 ){  
                    var exterNumber = this.fp.getElementByApiKey('TheirNumber__c', null, this.getArea()); 
                    var exterNumberRow = teasp.Tsf.Dom.getAncestorByCssName(exterNumber, 'ts-form-row');
                    teasp.Tsf.Dom.show(exterNumberRow , this.getArea(), true);
                    totalFlg=true;
                }
            }
        }else{
            //設定がない時は対象外
        }
    }

    if( totalFlg ){
        var totalNumber = this.fp.getElementByApiKey('_totalNumber', null, this.getArea());   //合計人数
        var totalNumberRow = teasp.Tsf.Dom.getAncestorByCssName(totalNumber, 'ts-form-row');
        teasp.Tsf.Dom.show(totalNumberRow   , this.getArea(), true);
    }
}

/**
 * 社内・社外参加者人数の設定がないとき、人数が有効な値であれば人数を入力項目を表示する。
 * 参照モードのときは、表示項目として表示される。
 * @param {Object} expItem 会議・交際費の費目。
 */
teasp.Tsf.Form2.prototype.willShowNumberIfItIsValidAndUnset = function(expItem){

    var totalFlg = false;
    if(expItem){
        if(expItem.isValidInternalParticipants()){
            //設定がない時に考慮したいので、設定があるときは処理対象外
        }else{
            var ourN = this.treatNumber('OurNumber__c');
            if( ourN!==null && ourN >= 1 ){  
                var interNumber = this.fp.getElementByApiKey('OurNumber__c', null, this.getArea()); 
                var interNumberRow = teasp.Tsf.Dom.getAncestorByCssName(interNumber, 'ts-form-row');
                teasp.Tsf.Dom.show(interNumberRow , this.getArea(), true);
                totalFlg=true;
            }
        }
        
        if(expItem.isValidExternalParticipants()){
            //設定がない時に考慮したいので、設定があるときは処理対象外
        }else{
            var theN = this.treatNumber('TheirNumber__c');
            if( theN!==null && theN >= 1 ){  
                var exterNumber = this.fp.getElementByApiKey('TheirNumber__c', null, this.getArea()); 
                var exterNumberRow = teasp.Tsf.Dom.getAncestorByCssName(exterNumber, 'ts-form-row');
                teasp.Tsf.Dom.show(exterNumberRow , this.getArea(), true);
                totalFlg=true;
            }
        }
    }

    if( totalFlg ){
        var totalNumber = this.fp.getElementByApiKey('_totalNumber', null, this.getArea());   //合計人数
        var totalNumberRow = teasp.Tsf.Dom.getAncestorByCssName(totalNumber, 'ts-form-row');
        teasp.Tsf.Dom.show(totalNumberRow   , this.getArea(), true);
    }

}


/**
 * 社内・社外参加者人数の設定があるときは、社内参加者人数・情報の入力項目を表示する。設定が無い時は処理なし。
 * 参照モードのときは、表示項目として表示される。
 * @param {Object} expItem 処理対象の費目情報
 */
teasp.Tsf.Form2.prototype.willShowParticipantsIfItIsSet = function(expItem){

    var totalFlg = false;

    if(expItem){
        if(expItem.isValidInternalParticipants()){
            if(expItem.isInternalParticipants()){
                var interText = this.fp.getElementByApiKey('InternalParticipants__c', null, this.getArea()); //事前申請の社員参加者テキスト情報
                var interNumber = this.fp.getElementByApiKey('OurNumber__c', null, this.getArea()); 
                var interTextRow = teasp.Tsf.Dom.getAncestorByCssName(interText, 'ts-form-row');
                var interNumberRow = teasp.Tsf.Dom.getAncestorByCssName(interNumber, 'ts-form-row');
                teasp.Tsf.Dom.show(interTextRow   , this.getArea(), true);
                teasp.Tsf.Dom.show(interNumberRow , this.getArea(), true);
                totalFlg = true;
            }else{
                var interText = this.fp.getElementByApiKey('InternalParticipants__c', null, this.getArea()); //事前申請の社員参加者テキスト情報
                var interNumber = this.fp.getElementByApiKey('OurNumber__c', null, this.getArea()); 
                var interTextRow = teasp.Tsf.Dom.getAncestorByCssName(interText, 'ts-form-row');
                var interNumberRow = teasp.Tsf.Dom.getAncestorByCssName(interNumber, 'ts-form-row');
                teasp.Tsf.Dom.show(interTextRow   , this.getArea(), false);
                teasp.Tsf.Dom.show(interNumberRow , this.getArea(), false);
            }
        }
        if(expItem.isValidExternalParticipants()){
            if(expItem.isExternalParticipants()){
                var exterText = this.fp.getElementByApiKey('ExternalParticipants__c', null, this.getArea()); //事前申請の社員参加者テキスト情報
                var exterNumber = this.fp.getElementByApiKey('TheirNumber__c', null, this.getArea()); 
                var exterTextRow = teasp.Tsf.Dom.getAncestorByCssName(exterText, 'ts-form-row');
                var exterNumberRow = teasp.Tsf.Dom.getAncestorByCssName(exterNumber, 'ts-form-row');
                teasp.Tsf.Dom.show(exterTextRow   , this.getArea(), true);
                teasp.Tsf.Dom.show(exterNumberRow , this.getArea(), true);
                totalFlg = true;
            }else{
                var exterText = this.fp.getElementByApiKey('ExternalParticipants__c', null, this.getArea()); //事前申請の社員参加者テキスト情報
                var exterNumber = this.fp.getElementByApiKey('TheirNumber__c', null, this.getArea()); 
                var exterTextRow = teasp.Tsf.Dom.getAncestorByCssName(exterText, 'ts-form-row');
                var exterNumberRow = teasp.Tsf.Dom.getAncestorByCssName(exterNumber, 'ts-form-row');
                teasp.Tsf.Dom.show(exterTextRow   , this.getArea(), false);
                teasp.Tsf.Dom.show(exterNumberRow , this.getArea(), false);
            }
        }
        if(expItem.isPlace()){
            var placeName = this.fp.getElementByApiKey('PlaceName__c', null, this.getArea()); //事前申請の店舗情報
            var placeAddress = this.fp.getElementByApiKey('PlaceAddress__c', null, this.getArea());
            var placeNameRow = teasp.Tsf.Dom.getAncestorByCssName(placeName, 'ts-form-row');
            var placeAddressRow = teasp.Tsf.Dom.getAncestorByCssName(placeAddress, 'ts-form-row');
            teasp.Tsf.Dom.show(placeNameRow   , this.getArea(), true);
            teasp.Tsf.Dom.show(placeAddressRow , this.getArea(), true);
        }else{
            var placeName = this.fp.getElementByApiKey('PlaceName__c', null, this.getArea()); //事前申請の店舗情報
            var placeAddress = this.fp.getElementByApiKey('PlaceAddress__c', null, this.getArea());
            var placeNameRow = teasp.Tsf.Dom.getAncestorByCssName(placeName, 'ts-form-row');
            var placeAddressRow = teasp.Tsf.Dom.getAncestorByCssName(placeAddress, 'ts-form-row');
            teasp.Tsf.Dom.show(placeNameRow   , this.getArea(), false);
            teasp.Tsf.Dom.show(placeAddressRow , this.getArea(), false);
        }
    }

    if(totalFlg){
        var totalNumber = this.fp.getElementByApiKey('_totalNumber', null, this.getArea());   //合計人数
        var totalNumberRow = teasp.Tsf.Dom.getAncestorByCssName(totalNumber, 'ts-form-row');
        teasp.Tsf.Dom.show(totalNumberRow   , this.getArea(), true);
    }else{
        var totalNumber = this.fp.getElementByApiKey('_totalNumber', null, this.getArea());   //合計人数
        var totalNumberRow = teasp.Tsf.Dom.getAncestorByCssName(totalNumber, 'ts-form-row');
        teasp.Tsf.Dom.show(totalNumberRow   , this.getArea(), false);
    }

    //人数割り金額を表示する
    this.willShowPricePerTotalPartIfItIsSet(expItem);
}

/**
 * 社内・社外参加者人数の設定があるときは、人数割り金額の表示項目を表示する。(参照モードのときも同様)
 * @param {Object} expItem 処理対象の費目情報
 */
teasp.Tsf.Form2.prototype.willShowPricePerTotalPartIfItIsSet = function(expItem){
    if(expItem){
        if(expItem.isInternalParticipants() || expItem.isExternalParticipants()){
            teasp.Tsf.Dom.show('#pricePerTotalPartDisp', this.getArea(), true);
        }else{
            teasp.Tsf.Dom.show('#pricePerTotalPartDisp', this.getArea(), false);
        }
    }else{
        teasp.Tsf.Dom.show('#pricePerTotalPartDisp', this.getArea(), false);
    }
}


/**
 * 人数の入力項目の表示を初期化する。
 * @param {Object} expItem 処理対象の費目情報
 */
teasp.Tsf.Form2.prototype.initShowNumberItem = function(){

    var exterText = this.fp.getElementByApiKey('ExternalParticipants__c', null, this.getArea()); //事前申請の社員参加者テキスト情報
    var exterNumber = this.fp.getElementByApiKey('TheirNumber__c', null, this.getArea()); 
    var exterTextRow = teasp.Tsf.Dom.getAncestorByCssName(exterText, 'ts-form-row');
    var exterNumberRow = teasp.Tsf.Dom.getAncestorByCssName(exterNumber, 'ts-form-row');
    teasp.Tsf.Dom.show(exterTextRow   , this.getArea(), false);
    teasp.Tsf.Dom.show(exterNumberRow , this.getArea(), false);

    var interText = this.fp.getElementByApiKey('InternalParticipants__c', null, this.getArea()); //事前申請の社員参加者テキスト情報
    var interNumber = this.fp.getElementByApiKey('OurNumber__c', null, this.getArea()); 
    var interTextRow = teasp.Tsf.Dom.getAncestorByCssName(interText, 'ts-form-row');
    var interNumberRow = teasp.Tsf.Dom.getAncestorByCssName(interNumber, 'ts-form-row');
    teasp.Tsf.Dom.show(interTextRow   , this.getArea(), false);
    teasp.Tsf.Dom.show(interNumberRow , this.getArea(), false);

    var placeName = this.fp.getElementByApiKey('PlaceName__c', null, this.getArea()); //事前申請の店舗情報
    var placeAddress = this.fp.getElementByApiKey('PlaceAddress__c', null, this.getArea());
    var placeNameRow = teasp.Tsf.Dom.getAncestorByCssName(placeName, 'ts-form-row');
    var placeAddressRow = teasp.Tsf.Dom.getAncestorByCssName(placeAddress, 'ts-form-row');
    teasp.Tsf.Dom.show(placeNameRow   , this.getArea(), false);
    teasp.Tsf.Dom.show(placeAddressRow , this.getArea(), false);

    var totalNumber = this.fp.getElementByApiKey('_totalNumber', null, this.getArea());   //合計人数
    var totalNumberRow = teasp.Tsf.Dom.getAncestorByCssName(totalNumber, 'ts-form-row');
    teasp.Tsf.Dom.show(totalNumberRow   , this.getArea(), false);
}

/**
 * 自動で0にされてしまう、人数nullをnullに戻す。
 */
teasp.Tsf.Form2.prototype.combackNullNumber = function(){
    var ourS = this.fp.getFcByApiKey('OurNumber__c').parseSimple(this.getObjBase().getDataObj());
    var theS = this.fp.getFcByApiKey('TheirNumber__c').parseSimple(this.getObjBase().getDataObj());

    //サーバーから受信している値がnullならnullに戻す
    if(ourS.value === null){
        this.fp.getFcByApiKey('OurNumber__c').drawText( this.getDomHelper(), {OurNumber__c : ''});
    }
    if(theS.value === null){
        this.fp.getFcByApiKey('TheirNumber__c').drawText( this.getDomHelper(), {TheirNumber__c : ''});
    }
}
