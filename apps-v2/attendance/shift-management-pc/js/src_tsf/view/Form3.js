/**
 * 一般経費申請フォーム
 *
 * @constructor
 */
teasp.Tsf.Form3 = function(){
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.form3);
    this.sections = [
        new teasp.Tsf.SectionProvisional(this), // 仮払い申請セクション
        new teasp.Tsf.SectionDetail(this),      // 経費明細セクション
        new teasp.Tsf.SectionExpAttach(this)    // 添付ファイルセクション
    ];
};

teasp.Tsf.Form3.prototype = new teasp.Tsf.FormBase();

teasp.Tsf.Form3.prototype.getFormStyle = function(){ return 3; };

/**
 * 初期化
 *
 */
teasp.Tsf.Form3.prototype.init = function(){
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
teasp.Tsf.Form3.prototype.refresh = function(objBase, mode){
    // ★★ 親クラスの refresh を呼び出す ★★
    teasp.Tsf.FormBase.prototype.refresh.call(this, objBase, mode);

    // 金額
    teasp.Tsf.Dom.html('.ts-total-amount', null, this.objBase.getTotalAmount() || '&nbsp;');
};

/**
 * 金額が変更された
 *
 * @param {Object} e
 */
teasp.Tsf.Form3.prototype.changedCurrency = function(e){
    var data = this.getDomValues();
    var cost = 0;

    // 社員立替交通費の金額を合計する
    dojo.forEach(data.EmpExp__r.values, function(v){
        cost += teasp.Tsf.util.parseInt(v.Cost__c) || 0;
    });

    teasp.Tsf.Dom.html('.ts-total-amount', null, teasp.Tsf.Currency.formatMoney(cost, teasp.Tsf.Currency.V_YEN, false, true));
    teasp.Tsf.Dom.byId('Form3TotalAmount').value = '' + cost;

    teasp.Tsf.FormBase.prototype.changedCurrency.call(this);
};
