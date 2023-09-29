/**
 * 経費明細入力ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ExpDetail = function(){
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.dialogDetail);
    this.EXPITEM_TOOLTIP_HKEY = 'expItem_toolTip';
    this.EXPITEM_TOOLTIP_HKEY_EX = 'expItem_toolTip_ex';
    this.EXPITEM_INTERNALPARTICIPANT_TOOLTIP_HKEY = 'expItem_internalParticipanttoolTip';
    this.EXPITEM_RECEIPT_TOOLTIP_HKEY = 'expItem_receipt_toolTip';
    this.jobPool = {};
};

teasp.Tsf.ExpDetail.prototype.show = function(obj, callback){
    this.orgData = teasp.Tsf.Dom.clone(obj);
    teasp.Tsf.Error.showError();
    this.fp.setReadOnly(obj.ro);
    this.receiptIn = (this.orgData.values.CardStatementLineId__r
                   && this.orgData.values.CardStatementLineId__r.RecordType
                   && this.orgData.values.CardStatementLineId__r.RecordType.Name == '領収書');
    this.cardConst = (this.orgData.values.CardStatementLineId__c && !this.receiptIn);
    this.fromHist = this.orgData.fromHist;

    // オプション項目の表示／非表示切替
    this.fp.fcLoop(function(fc){
        if(fc.getApiKey() == 'ChargeDeptId__c' // 負担部署
        && !tsfManager.isRequireChargeDept()){     // 経費の負担部署を入力＝しない
            fc.setNotUse(true);
        }
        else if (this.orgData.pre && fc.getApiKey() == 'Publisher__c') {
        	fc.setNotUse(true);
        }
    }, this);

    this.domHelper = new teasp.Tsf.Dom();
    this.dialog = new dijit.Dialog({
        title       : teasp.message.getLabel('tf10001340'), // 経費明細
        className   : 'ts-dialog-exp-detail'
    });
    this.dialog.attr('content', this.getContent());
    this.dialog.startup();
    this.domHelper.connect(this.dialog, 'onCancel', this, function(){ this.hide(); });

    this.entryDetail = callback;
    this.showData(obj);
};

teasp.Tsf.ExpDetail.prototype.showData = function(obj){
    var formEl = this.getFormEl();
    var vobj = this.orgData.values;

    this.expItemFilter = {
        empExpItemClass  : this.orgData.expItemClass,
        deptExpItemClass : (vobj.ChargeDeptId__r && vobj.ChargeDeptId__r.ExpItemClass__c)
                        || (this.orgData.assist && this.orgData.assist.ChargeDeptId__r && this.orgData.assist.ChargeDeptId__r.ExpItemClass__c)
                        || null,
        expenseType      : (this.orgData.assist && this.orgData.assist.ExpenseType__c) || null
    };

    var select = this.fp.getElementByApiKey('ExpItemId__c', null, formEl);
    if(select){
        this.loadExpItems(select);
    }

    // 利用日の値を取得
    var date = vobj.Date__c;

    // 明細ID（空なら新規）
    var id = vobj.Id;
    if(!id && this.orgData.nextOrder){ // IDが空で次のオーダー番号がセットされている場合
        vobj.Order__c = this.orgData.nextOrder; // オーダー番号をセット（同一日付内での並び順。タイムレポート用）
    }
    // 金額を取得
    var cost = vobj.Cost__c;
    // 利用日控、金額控をセットする（駅探検索値またはspice入力と日付・金額の整合チェックに利用する）
    vobj._date = date;
    vobj._cost = cost;
    this.memoryDate = date;
    this.memoryCost = cost;

    tsfManager.getInfo().setCacheDept(vobj);
    tsfManager.getInfo().setCacheJob(vobj);

    if(!date){ // 日付
        if(this.orgData.targetDate){ // 固定日付（リードオンリー）
            vobj.Date__c = this.orgData.targetDate;
        }else if(this.orgData.assist && this.orgData.assist.ApplyDate__c){ // 申請情報の申請日
            vobj.Date__c = this.orgData.assist.ApplyDate__c;
        }else if(this.orgData.defaultDate){ // デフォルト日付
            vobj.Date__c = this.orgData.defaultDate;
        }else{ // 固定日付、デフォルト日付ともない場合、本日日付をセット
            vobj.Date__c = teasp.util.date.formatDate(teasp.util.date.getToday());
        }
    }

    // ジョブ選択肢をセット
    this.loadJobs(vobj.Date__c);
    this.checkImportJobs(vobj);

    // 負担部署選択肢をセット
    this.loadChargeDepts();

    this.fp.fcLoop(function(fc){
        if(fc.getApiKey() == '_route'){   // 経路エリア
            var sn = (vobj.startName__c || ''   );
            var en = (vobj.endName__c   || ''   );
            var rt = (vobj.roundTrip__c || false);
            if(this.isReadOnly() || fc.isReadOnly()){
                var n = teasp.Tsf.Dom.node('div.ts-form-route > div', formEl);
                n.innerHTML = teasp.Tsf.util.entitizf(teasp.message.getLabel((rt ? 'tm20009040' : 'tm20009060'), sn, en)); // {0} ⇔ {1} / {0} ⇒ {1}
            }else{
                dijit.byId("DlgExpDetailStFrom").setValue(sn);
                dijit.byId("DlgExpDetailStTo"  ).setValue(en);

                // J'sNAVIの明細の場合は無効化する
                if(vobj.Item__c == "JTB"){
                    dijit.byId("DlgExpDetailStFrom").setDisabled(true);
                    dijit.byId("DlgExpDetailStTo"  ).setDisabled(true);
                }

                this.setRoundTripIcon(rt);
            }
        }else if(fc.getApiKey() == '_tax'){     // 消費税エリア
            if(this.isReadOnly() || fc.isReadOnly()){
                this.setStaticTax(vobj);
            }else{
                this.setTaxAuto(typeof(vobj.TaxAuto__c) == 'boolean' ? vobj.TaxAuto__c : true);
                var expItem = this.getCurrentExpItem();
                this.setTaxRate(expItem, typeof(vobj.TaxRate__c) == 'number' ? vobj.TaxRate__c : null);
                this.setTaxValue(vobj.Tax__c || 0);
                this.setWithoutTaxValue(vobj.WithoutTax__c || 0);
                this.setTaxType(vobj.TaxType__c || 0);
            }
        }else if(fc.getApiKey() == '_foreign'){  // 外貨エリア
            if(this.isReadOnly() || fc.isReadOnly()){
                this.setStaticForeign(vobj);
            }else{
                this.setForeignNameValue(vobj.CurrencyName__c || '');
                this.setForeignRateValue(vobj.CurrencyRate__c || '');
                this.setForeignAmountValue(vobj.ForeignAmount__c || '');
            }
        }else if(fc.isApiField(true) || fc.getApiKey() == '_date' || fc.getApiKey() == '_cost' || fc.getApiKey() == '_temp_attach'){
            fc.drawText(this.getDomHelper(), vobj);
        }
    }, this);

    this.changedExpItem();

    var item = vobj.Item__c || null;
    if(teasp.Tsf.EmpExp.isSpice(item)){
        teasp.Tsf.Dom.show('.ts-spice', formEl, true); // ICアイコン
    }else{
        var transportType = (vobj.TransportType__c || '0');
        teasp.Tsf.Dom.show('.pp_ico_ekitan'  , formEl, (transportType == '1')); // 駅探アイコン
    }
    teasp.Tsf.Dom.show('.ts-external', formEl, teasp.Tsf.EmpExp.isExternalExpense(item)); // ICアイコン
    if(!this.isReadOnly()){
        var expItem = this.getCurrentExpItem();
        if(expItem && expItem.isTaxFlag()){
            this.setTaxType(this.getTaxType(true));
            this.setTaxArea(this.getTaxType());
        }
    }
    // 支払種別
    var expenseType = this.expItemFilter.expenseType;
    var payTypeNums = tsfManager.getPayeeTypeNums(expenseType);
    var fcPay = this.fp.getFcByApiKey('_payment');
    var payeeType = (vobj.PayeeId__r ? (vobj.PayeeId__r.PayeeType__c || null) : null);
    if(payeeType || vobj.Id){
        payTypeNums[payeeType || '1'] = 1;
    }
    var paySelect = null;
    if(this.isReadOnly() || fcPay.isReadOnly()){
        var n = teasp.Tsf.Dom.node('div.ts-row-payment div.ts-payment-div', formEl);
        payMap = {
            '1': teasp.message.getLabel('tf10001350'), // 本人立替
            '2': teasp.message.getLabel('tf10001370'), // 請求書
            '3': teasp.message.getLabel('tf10001380')  // クレジットカード
        };
        n.innerHTML = (payMap[payeeType] || teasp.message.getLabel('tf10001350')); // 本人立替
    }else{
        paySelect = teasp.Tsf.Dom.node('select.ts-payment-select', formEl);
    }
    var advanceOnly = false;
    if(paySelect){
        // 支払先マスターにない支払種別は候補から削除する
        var px = [];
        for(var i = 0 ; i < paySelect.options.length ; i++){
            if(!expenseType && paySelect.options[i].value == '1'){ // 精算区分が指定なしなら、社員立替は消さない
                continue;
            }
            if(!payTypeNums[paySelect.options[i].value]){
                px.push(i);
            }
        }
        for(var i = px.length - 1 ; i >= 0 ; i--){
            paySelect.remove(px[i]);
        }
        // 候補が１つならデフォルトで選択状態にする
        if(paySelect.options.length == 1){
            if(!payeeType){
                payeeType = paySelect.options[0].value;
            }
            if(payeeType == '1'){
                advanceOnly = true;
            }
        }
        if(!payeeType){
            // デフォルトをセット、候補がないときは支払先・支払日入力欄は非表示にしないようにする
            payeeType = paySelect.options.length > 0 ? paySelect.options[0].value : '1';
        }
        if(paySelect.options.length > 0){
            paySelect.value = payeeType;
        }
    }else if(!expenseType && !payTypeNums['2'] && !payTypeNums['3']){
        advanceOnly = true;
    }
    if(advanceOnly){
        // 支払種別の候補が本人立替だけなら、
        // 支払種別、支払先、支払日、請求書URL入力欄は非表示にする
        teasp.Tsf.Dom.show('.ts-row-payment, .ts-row-payee, .ts-row-invoiceURL', formEl, false);
    }else{
        // 支払種別の選択が「本人立替」なら、支払先・支払日入力欄を非表示にする（ただし、値が入ってたら表示）
        var showPayee = ((payeeType || '1') != '1');
        if(showPayee){
            teasp.Tsf.Dom.show('.ts-row-payee', formEl, true);
            teasp.Tsf.Dom.show('.ts-row-invoiceURL', formEl, true);
        }else{
            teasp.Tsf.Dom.show('.ts-row-payee-name', formEl, (vobj.PayeeId__r ? true : false));
            teasp.Tsf.Dom.show('.ts-row-payee-date', formEl, (vobj.PaymentDate__c ? true : false));
            teasp.Tsf.Dom.show('.ts-row-invoiceURL', formEl, (vobj.invoiceURL__c ? true : false));
        }
    }
    var icon = teasp.Tsf.Dom.node('.ts-payment-icon', formEl);
    if(icon){
        teasp.Tsf.Dom.toggleClass(icon, 'pp_ico_card2', (this.cardConst ? true : false));
        teasp.Tsf.Dom.toggleClass(icon, 'pp_ico_card1', (!this.cardConst && payeeType == '3'));
        teasp.Tsf.Dom.toggleClass(icon, 'pp_ico_bill' , (!this.cardConst && payeeType == '2'));
    }

    // 標準画面で開くリンク
    var tip = teasp.Tsf.Dom.node('div.ts-dialog-tips', teasp.Tsf.Dom.byId(this.dialog.id));
    if(id){
        teasp.Tsf.Dom.show(tip, null, true);
        teasp.Tsf.Dom.node('a', tip).href = '/' + id;
    }else{
        teasp.Tsf.Dom.show(tip, null, false);
    }

    var button = teasp.Tsf.Dom.node('input[type="button"].ts-receipt', formEl);
    if(button){
        const hasAttachment = (vobj.Attachments || []).length > 0 || (!id && vobj._temp_attach)
        const hasSFFile = (vobj.ContentDocumentLinks || []).length > 0
        const hasReceiptFile = hasAttachment || hasSFFile;
        var uber = (vobj.Receipt__c && teasp.Tsf.EmpExp.isUber(item)) || false;
        teasp.Tsf.Dom.toggleClass(button, 'pp_ico_receipt'  , !hasReceiptFile && !uber);
        teasp.Tsf.Dom.toggleClass(button, 'pp_ico_receipt_a', (hasReceiptFile && !this.receiptIn && !uber));
        teasp.Tsf.Dom.toggleClass(button, 'pp_ico_receipt_r', (hasReceiptFile && this.receiptIn && !uber) || false);
        teasp.Tsf.Dom.toggleClass(button, 'pp_ico_receipt_u', uber);

        // 事前申請の明細または id がなければ領収書アイコンはクリック不可
        if(this.orgData.pre){
            teasp.Tsf.Dom.style(button, 'cursor', 'default');
            button.title = teasp.message.getLabel('tf10004690'); // 領収書要
        }else if(!id){
            if(vobj._temp_attach){
                button.title = teasp.message.getLabel('attachedReceipt'); // 領収書添付済み
                try{
                    var ta = teasp.Tsf.util.fromJson(vobj._temp_attach);
                    this.getDomHelper().connect(button, 'onclick', this, function(e){
                        tsfManager.openReceiptImageView(ta.Id, ta.ParentId);
                    }, this.EXPITEM_RECEIPT_TOOLTIP_HKEY);
                }catch(e){}
            }else{
                this.getDomHelper().createTooltip({
                    connectId   : button,
                    label       : teasp.message.getLabel('tf10001660'), // 保存後、画像ファイルをアップロード<br/>できるようになります。
                    position    : ['below'],
                    showDelay   : 200
                }, this.EXPITEM_RECEIPT_TOOLTIP_HKEY);
            }
        }else{
            button.title = teasp.message.getLabel(hasReceiptFile ? 'attachedReceipt' : 'nonReceipt'); // 領収書添付済み or 領収書未添付
            this.getDomHelper().connect(button, 'onclick', this, function(e){
                tsfManager.openExpImageView(id, this.isReadOnly());
            }, this.EXPITEM_RECEIPT_TOOLTIP_HKEY);
        }
    }

    this.checkExpMatching(vobj);

    this.dialog.show();
    if(this.orgData.defaultDate){
        setTimeout(teasp.Tsf.Dom.hitch(this, function(){
            var el = this.fp.getElementByApiKey('ExpItemId__c', this.getFormEl());
            if(el){
                el.focus();
            }
        }), 200);
    }
};

teasp.Tsf.ExpDetail.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.ExpDetail.prototype.getFormEl = function(){
    return teasp.Tsf.Dom.node('.ts-section-form', teasp.Tsf.Dom.byId(this.dialog.id));
};

//teasp.Tsf.ExpDetail.prototype.getValueByApiKey = function(apiKey, obj, defaultValue){
//    var fc = this.fp.getFcByApiKey(apiKey);
//    if(!fc){
//        return defaultValue;
//    }
//    var fv = fc.parseValue(obj);
//    if(fv.value === undefined || fv.value === null){
//        return defaultValue;
//    }
//    return fv.value;
//};

teasp.Tsf.ExpDetail.prototype.fetchValueByApiKey = function(apiKey){
    var fc = this.fp.getFcByApiKey(apiKey);
    return fc.fetchValue().value;
};

teasp.Tsf.ExpDetail.prototype.setValueByApiKey = function(apiKey, val){
    var fc = this.fp.getFcByApiKey(apiKey);
    fc.textOut(this.getDomHelper(), null, val);
};

teasp.Tsf.ExpDetail.prototype.isReadOnly = function(){
    return this.fp.isReadOnly();
};

/**
 * 新規ならtrueを返す
 */
teasp.Tsf.ExpDetail.prototype.isNew = function(){
    return !this.orgData.values.Id;
};

teasp.Tsf.ExpDetail.prototype.hide = function(){
    if(this.dialog){
        this.dialog.hide();
        this.domHelper.free();
        this.dialog.destroy();
        tsfManager.removeDialog('ExpDetail');
    }
};

teasp.Tsf.ExpDetail.prototype.getContent = function(){
    var areaEl = this.getDomHelper().create('div', { className: 'ts-dialog ts-exp-detail', style: 'width:750px;' });
    this.getDomHelper().create('div', null
            , this.getDomHelper().create('div', { className: 'ts-error-area', style: 'width:750px;display:none;' }, areaEl));

    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form' }, areaEl);
    var pfc = null;
    var row = null;

    // 負担部署が必須なら必須表示する
    var fc = this.fp.getFcByApiKey('ChargeDeptId__c');
    fc.setRequired(tsfManager.isRequireChargeDept() == 2 ? 1 : 0);

    // 対象日付が指定されている場合は、リードオンリーにする
    if(this.orgData.targetDate){
        var fc = this.fp.getFcByApiKey('Date__c');
        fc.setReadOnly(true);
    }
    if(this.cardConst){
        dojo.forEach([
            'Date__c',
            'Cost__c',
            '_foreign',
            'Publisher__c',
            '_payment',
            'PayeeId__r.Name',
            'PaymentDate__c'
        ], function(cs){
            var fc = this.fp.getFcByApiKey(cs);
            fc.setReadOnly(true);
        }, this);
    }

    // J'sNAVI Jr明細の場合
    if(this.orgData.values.Item__c == 'JTB'){
        dojo.forEach([
            'Date__c',
            'Cost__c',
            '_foreign',
            '_payment',
            'PayeeId__r.Name',
            'PaymentDate__c'
        ], function(cs){
            var fc = this.fp.getFcByApiKey(cs);
            fc.setReadOnly(true);
        }, this);
    }


    this.fp.fcLoop(function(fc){
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, formEl);
        }else if(fc.getDomType() == 'route'){   // 経路入力エリア
            row = this.createRouteRow(fc, formEl);
        }else if(fc.getDomType() == 'tax'){     // 税入力エリア
            row = this.createTaxRow(fc, formEl);
        }else if(fc.getDomType() == 'foreign'){ // 外貨入力エリア
            row = this.createForeignRow(fc, formEl);
        }else if(fc.getDomType() == 'payment'){ // 支払いエリア
            row = this.createPaymentRow(fc, formEl);
        }else{
            if(!pfc || !pfc.isNoNL()){
                var cssName = 'ts-form-row';
                if(fc.getApiKey() == 'ExtraItem1__c'){
                    cssName += ' ts-row-extra1';
                }else if(fc.getApiKey() == 'ExtraItem2__c'){
                    cssName += ' ts-row-extra2';
                }else if(fc.getApiKey() == 'UnitPrice__c' || fc.getApiKey() == 'Quantity__c'){ // 単価、数量
                    cssName += ' ts-row-quantity';
                }else if(fc.getApiKey() == 'PaymentDate__c' || fc.getApiKey() == 'PayeeId__r.Name'){ // 支払日、支払先名
                    cssName += ' ts-row-payee';
                    if(fc.getApiKey() == 'PaymentDate__c'){
                        cssName += ' ts-row-payee-date';
                    }else if(fc.getApiKey() == 'PayeeId__r.Name'){
                        cssName += ' ts-row-payee-name';
                    }
                }else if(fc.getApiKey() == 'InvoiceURL__c'){ // 請求書URL
                    cssName += ' ts-row-invoiceURL'
                }else if(fc.getApiKey() == 'JobId__c'){ // ジョブ
                    cssName += ' ts-row-job';
                }else if(fc.getApiKey() == 'ChargeDeptId__c'){ // 負担部署
                    cssName += ' ts-row-dept';
                }else if(fc.getApiKey() == 'InternalParticipantsNumber__c' || fc.getApiKey() == 'InternalParticipants__c'){ // 社内参加者
                    cssName += ' ts-row-intpart';
                    if(fc.getApiKey() == 'InternalParticipantsNumber__c'){
                        cssName += ' ts-row-intpart-number';
                    }else if(fc.getApiKey() == 'InternalParticipants__c'){
                        cssName += ' ts-row-intpart-name';
                        fc.fc.height = '90px';
                    }
                }else if(fc.getApiKey() == 'ExternalParticipantsNumber__c' || fc.getApiKey() == 'ExternalParticipants__c'){ // 社外参加者
                    cssName += ' ts-row-extpart';
                    if(fc.getApiKey() == 'ExternalParticipantsNumber__c'){
                        cssName += ' ts-row-extpart-number';
                    }else if(fc.getApiKey() == 'ExternalParticipants__c'){
                        cssName += ' ts-row-extpart-name';
                        fc.fc.height = '90px';
                    }
                }else if(fc.getApiKey() == 'PlaceName__c' || fc.getApiKey() == 'PlaceAddress__c'){ // 店舗
                    cssName += ' ts-row-place';
                    if(fc.getApiKey() == 'PlaceName__c'){
                        cssName += ' ts-row-place-name';
                    }else if(fc.getApiKey() == 'PlaceAddress__c'){
                        cssName += ' ts-row-place-address';
                    }
                }else if(fc.getApiKey() == 'Publisher__c'){
                    cssName += ' ts-row-publisher'
                }
                row = this.getDomHelper().create('div', { className: cssName}, formEl);
            }
            // ラベル部作成
            var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
            if(fc.getLw()){
                teasp.Tsf.Dom.style(label, 'width', fc.getLw());
            }
            this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
            if(fc.isRequired() || /ExtraItem.__c/.test(fc.getApiKey())){ // ※ 拡張項目も必須入力にする（暫定：後で切り替え）
                this.getDomHelper().create('div', { className: 'ts-require' }, label);
            }
            // 入力欄作成
            fc.appendFieldDiv(this.getDomHelper(), row);

            if(fc.getApiKey() == 'Cost__c'){ // 金額
                this.getDomHelper().create('div', { className: 'ts-form-value ts-PerParticipant' , style: 'padding-left: 20px;'  }, row);
                this.getDomHelper().create('input', { type: 'button', className: 'ts-external' }, row);
                this.getDomHelper().create('input', { type: 'button', className: 'ts-receipt pp_ico_receipt' }, row);
            }
            pfc = fc;
        }
    }, this);

    teasp.Tsf.Dom.show('.ts-row-payee', formEl, false); // 支払先・支払日の入力欄は初期値で非表示
    teasp.Tsf.Dom.show('.ts-row-invoiceURL', formEl, false); // 請求書の入力欄は初期値で非表示

    this.setEventHandler(formEl);

    this.createButtons(areaEl);

    if(tsfManager.getDebug()){
        var tips = this.getDomHelper().create('div', { className: 'ts-dialog-tips' }, formEl);
        this.getDomHelper().create('a', { href:"", innerHTML: teasp.message.getLabel('tf10001560'), target:"_blank" }, tips); // 標準画面で開く
    }

    return areaEl;
};

teasp.Tsf.ExpDetail.prototype.createRouteRow = function(fc, formEl){
    var row = this.getDomHelper().create('div', { className: 'ts-form-row ts-row-route' }, formEl);
    // ラベル部作成
    var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
    this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
    if(fc.isRequired()){
        this.getDomHelper().create('div', { className: 'ts-require' }, label);
    }
    if(fc.isReadOnly() || fc.isReadOnly()){
        this.getDomHelper().create('div', {
            className   : 'ts-form-text',
            style       : 'width:100%;'
        }, this.getDomHelper().create('div', {
            className   : 'ts-form-value ts-form-route',
            style       : { width: fc.getWidth() }
        }, row));
        this.getDomHelper().create('input', { type: 'button', className: 'pp_base pp_btn_ektsrch' }, row);
        this.getDomHelper().create('input', { type: 'button', className: 'pp_base pp_ico_ekitan'  }, row);
        this.getDomHelper().create('div', { className: 'ts-spice' }, row);
    }else{
        var area = this.getDomHelper().create('div', { className: 'ts-dialog-route' }, row);
        var div1 = this.getDomHelper().create('div', { className: 'ts-station-area' }, area);
        this.getDomHelper().create('input', { className: 'ts-form-st-from' }, this.getDomHelper().create('div', { className: 'ts-station-text' }, div1));
        this.getDomHelper().create('input', { type: 'button', className: 'pp_base pp_btn_oneway ts-form-roundtrip' }, div1);
        this.getDomHelper().create('input', { className: 'ts-form-st-to'   }, this.getDomHelper().create('div', { className: 'ts-station-text' }, div1));
        this.getDomHelper().create('input', { type: 'button', className: 'pp_base pp_btn_ektsrch' }, div1);
        this.getDomHelper().create('input', { type: 'button', className: 'pp_base pp_ico_ekitan'  }, div1);
        this.getDomHelper().create('div', { className: 'ts-spice' }, div1);
    }
    this.getDomHelper().connect(teasp.Tsf.Dom.node('input.pp_ico_ekitan', row), 'onclick', this, function(e){
        var vobj = this.orgData.values;
        var route = vobj.Route__c;
        if(!route){
            teasp.tsAlert(teasp.message.getLabel('tf10001770')); // 経路情報がありません
            return;    
        }
        tsfManager.showDialog('ExpRoute', route);
    });
    return row;
};

teasp.Tsf.ExpDetail.prototype.createTaxRow = function(fc, formEl){
    var row = this.getDomHelper().create('div', { className: 'ts-form-row ts-row-tax' }, formEl);
    // ラベル部作成
    var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
    this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
    if(fc.isRequired()){
        this.getDomHelper().create('div', { className: 'ts-require' }, label);
    }

    var area = this.getDomHelper().create('div', {
        className: 'ts-form-value ts-form-' + fc.getDomType()
    }, row);

    if(this.isReadOnly() || fc.isReadOnly()){
        this.getDomHelper().create('div', { className: 'ts-tax-div' }, area);
    }else{
        var table = this.getDomHelper().create('table', { className: 'ts-tax-table' }, area);
        var tr = this.getDomHelper().create('tr', null, this.getDomHelper().create('tbody', null, table));

        this.getDomHelper().create('div', { className: 'ts-tax-type' }, this.getDomHelper().create('td', null, tr));

        this.getDomHelper().create('div', { className: 'ts-tax-label', innerHTML: teasp.message.getLabel('tm20004110') } // 税抜金額
            , this.getDomHelper().create('td', null, tr));
        this.getDomHelper().create('td', { className: 'ts-tax-without-tax ts-form-currency' }, tr);

        this.getDomHelper().create('div', { className: 'ts-tax-label', innerHTML: teasp.message.getLabel('tf10001390') } // 消費税額
            , this.getDomHelper().create('td', null, tr));
        this.getDomHelper().create('td', { className: 'ts-tax-auto'                 }, tr);
        this.getDomHelper().create('td', { className: 'ts-tax-tax ts-form-currency' }, tr);

        this.getDomHelper().create('div', { className: 'ts-tax-label', innerHTML: teasp.message.getLabel('tm20004100') } // 税率
            , this.getDomHelper().create('td', null, tr));
        this.getDomHelper().create('td', { className: 'ts-tax-rate' }, tr);

        var td1 = teasp.Tsf.Dom.node('td.ts-tax-without-tax', table);
        var td2 = teasp.Tsf.Dom.node('td.ts-tax-auto'       , table);
        var td3 = teasp.Tsf.Dom.node('td.ts-tax-tax'        , table);
        var td4 = teasp.Tsf.Dom.node('td.ts-tax-rate'       , table);

        this.getDomHelper().create('input' , { type: 'text', className: 'ts-tax-without-tax'  }, td1);

        this.getDomHelper().create('button', { className: 'ts-tax-auto enabled' }, td2);

        var inp = this.getDomHelper().create('input', { type: 'text', className: 'ts-tax-tax' }, td3);
        inp.disabled = true;

        var select = this.getDomHelper().create('select', { className: 'ts-tax-rate' }, td4);
        this.getDomHelper().create('option', { value:'10', innerHTML:'10%' }, select);
        this.getDomHelper().create('option', { value: '8', innerHTML: '8%' }, select);
        this.getDomHelper().create('option', { value: '5', innerHTML: '5%' }, select);
        this.getDomHelper().create('option', { value: '0', innerHTML: '0%' }, select);
        select.value = '' + teasp.Tsf.ExpDetail.getTaxRate(this.getDate());
    }

    return row;
};

teasp.Tsf.ExpDetail.prototype.createForeignRow = function(fc, formEl){
    var row = this.getDomHelper().create('div', { className: 'ts-form-row ts-row-foreign' }, formEl);
    // ラベル部作成
    var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
    this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
    if(fc.isRequired()){
        this.getDomHelper().create('div', { className: 'ts-require' }, label);
    }
    var area = this.getDomHelper().create('div', {
        className: 'ts-form-value ts-form-' + fc.getDomType()
    }, row);

    if(this.isReadOnly() || fc.isReadOnly()){
        this.getDomHelper().create('div', { className: 'ts-foreign-div' }, area);
    }else{
        var table = this.getDomHelper().create('table', { className: 'ts-foreign-table' }, area);
        var tr = this.getDomHelper().create('tr', null, this.getDomHelper().create('tbody', null, table));

        this.getDomHelper().create('div', { className: 'ts-foreign-label', innerHTML: teasp.message.getLabel('tm20004180') }, this.getDomHelper().create('td', null, tr)); // 通貨名
        this.getDomHelper().create('td' , { className: 'ts-foreign-name' }, tr);

        this.getDomHelper().create('div', { className: 'ts-foreign-label', innerHTML: teasp.message.getLabel('tm20004190') }, this.getDomHelper().create('td', null, tr)); // 換算レート
        this.getDomHelper().create('td' , { className: 'ts-foreign-rate' }, tr);

        this.getDomHelper().create('div', { className: 'ts-foreign-label', innerHTML: teasp.message.getLabel('tm20004200') }, this.getDomHelper().create('td', null, tr)); // 現地金額
        this.getDomHelper().create('td' , { className: 'ts-foreign-cost' }, tr);

        var td1 = teasp.Tsf.Dom.node('td.ts-foreign-name', table);
        var td2 = teasp.Tsf.Dom.node('td.ts-foreign-rate', table);
        var td3 = teasp.Tsf.Dom.node('td.ts-foreign-cost', table);

        this.getDomHelper().create('select', { className: 'ts-foreign-name' }, td1);
        var rate = this.getDomHelper().create('input' , { type: 'text', className: 'ts-foreign-rate' }, td2);
        var cost = this.getDomHelper().create('input' , { type: 'text', className: 'ts-foreign-cost' }, td3);

        rate.value = '1.00';
        cost.value = '0';

    }
    return row;
};

teasp.Tsf.ExpDetail.prototype.loadCurrency = function(expItem, cname){
    var currencyName = cname || expItem.getCurrencyName();
    var cn = currencyName;
    if(cn){ // 外貨指定あり
        cn = cn.toLowerCase();
    }
    var select = this.getForeignNameNode();
    var v = null;
    if(select){
        dojo.empty(select);
        dojo.forEach(tsfManager.getForeigns(), function(foreign){
            this.getDomHelper().create('option', { value: foreign.getId(), innerHTML: foreign.getName() }, select);
            if(cn && foreign.getName().toLowerCase() == cn){
                v = foreign.getId();
            }
        }, this);
        if(cn && v === null){
            this.getDomHelper().create('option', { value: currencyName, innerHTML: currencyName }, select);
            v = currencyName;
        }
        // 外貨指定ありなら通貨名を選択状態にする
        select.value = v || '';
    }

    var pfamount = this.getForeignCostNode(); // 現地金額入力欄
    if(pfamount){
        pfamount.disabled = expItem.isAmountReadOnly(); // 金額固定なら、現地金額入力欄を非活性にする
    }

    return { name: currencyName, value: v || '' };
};

/**
 * 外貨入力エリアの初期化
 *
 * @param {teasp.Tsf.ExpItem} expItem 費目オブジェクト
 * @param {boolean=} flag trueの場合、表示を更新しない
 * @param {string=} cname 通貨記号の初期値
 */
teasp.Tsf.ExpDetail.prototype.initForeignCurrency = function(expItem, flag, cname){
    var o = this.loadCurrency(expItem, cname);
    if(o.value){
        // 外貨指定ありなので、換算レートをセット
        var foreign = tsfManager.getForeignById(o.value);
        var d = this.fetchValueByApiKey('Date__c') || teasp.util.date.formatDate(teasp.util.date.getToday());
        var rateV = foreign.getRateByDate(d); // 換算レートを取得
        var rate = teasp.util.currency.formatDecimal(rateV, teasp.constant.CU_DEC_POINT_MIN, teasp.constant.CU_DEC_POINT_MAX); // 換算レート
        var rateNode = this.getForeignRateNode();
        if(rateNode){
            if(!flag){
                rateNode.value = rate.str;
                this.setForeignRateTitle(rateNode);
            }else{
                var rv = parseFloat(rateNode.value || '0');
                this.setForeignRateTitle(rateNode, (rv != rate.n ? teasp.message.getLabel('tm20004050') : null));
            }
        }
        if(!flag){
            var currentCost = this.getCostValue(expItem);
            if(!currentCost || expItem.isFixAmount()){
                var cost = expItem.getCost(); // 標準金額（現地金額）
                var fixc = expItem.getRecalcTarget(); // 金額と現地金額どちらを固定するか判定
                this.recalcForeign(fixc, expItem, cost, true);
            }else{
                this.recalcForeign(0, expItem, currentCost, true);
            }
        }
    }else if(!flag){
        var rateNode = this.getForeignRateNode();
        if(rateNode){
            rateNode.value = '1.00';
            this.setForeignRateTitle(rateNode);
            this.recalcForeign(0, expItem);
        }
    }
};

teasp.Tsf.ExpDetail.prototype.createPaymentRow = function(fc, formEl){
    var row = this.getDomHelper().create('div', { className: 'ts-form-row ts-row-payment' }, formEl);
    // ラベル部作成
    var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
    this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
    if(fc.isRequired()){
        this.getDomHelper().create('div', { className: 'ts-require' }, label);
    }
    var area = this.getDomHelper().create('div', {
        className: 'ts-form-value ts-form-' + fc.getDomType()
    }, row);

    if(this.isReadOnly() || fc.isReadOnly()){
        this.getDomHelper().create('div', { className: 'ts-payment-div' }, area);
    }else{
        var select = this.getDomHelper().create('select', { className: 'ts-payment-select' }, area);
        var pickList = [
            {v:'1',n:teasp.message.getLabel('tf10001350') }, // 本人立替
            {v:'2',n:teasp.message.getLabel('tf10001370') }, // 請求書
            {v:'3',n:teasp.message.getLabel('tf10001380') }  // クレジットカード
        ];
        dojo.forEach(pickList, function(p){
            this.getDomHelper().create('option', { value: p.v, innerHTML: p.n }, select);
        }, this);
        this.getDomHelper().connect(select, 'onchange', this, this.changedPayType);
    }
    this.getDomHelper().create('div', { className: 'ts-payment-icon' }, row);
    return row;
};

teasp.Tsf.ExpDetail.prototype.createButtons = function(areaEl){
    var area = this.getDomHelper().create('div', { className: 'ts-dialog-buttons' }, areaEl);
    var div  = this.getDomHelper().create('div', { className: 'ts-edge-continue' }, area);

	//「履歴から読込」以外かつ「カード明細読込」で生成したレコード以外かつJTB関連レコード以外
    if(!this.isReadOnly() && !this.fromHist && !this.cardConst && this.orgData.values.Item__c != 'JTB'){
        var btn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('tf10006310'), null, div); // 続けて入力
        this.getDomHelper().connect(btn , 'onclick', this, this.inputAndContinue);
    }

    div  = this.getDomHelper().create('div', null, area);
    if(this.isReadOnly()){
        var canbtn = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('close_btn_title'), 'ts-dialog-cancel', div); // 閉じる
        this.getDomHelper().connect(canbtn, 'onclick', this, this.hide);
    }else{
        if(this.orgData.targetDate){ // この値が入っている＝即時登録モード
            var okbtn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('save_btn_title'), 'ts-dialog-ok', div); // 登録
            this.getDomHelper().connect(okbtn , 'onclick', this, this.regist);
        }else{
            var okbtn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('ok_btn_title'), 'ts-dialog-ok', div); // ＯＫ
            this.getDomHelper().connect(okbtn , 'onclick', this, this.ok);
        }
        var canbtn = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('cancel_btn_title'), 'ts-dialog-cancel', div); // キャンセル
        this.getDomHelper().connect(canbtn, 'onclick', this, this.hide);
    }
    div = this.getDomHelper().create('div', { className: 'ts-edge-right' }, area);
    var btn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('ekitanSetting_btn_title'), null, div); // 駅探設定
    this.getDomHelper().connect(btn , 'onclick', this, this.ekitanSetting);
};

teasp.Tsf.ExpDetail.prototype.setEventHandler = function(formEl){
    // 駅探検索ボタンクリック
    this.getDomHelper().connect(teasp.Tsf.Dom.query('.pp_btn_ektsrch', formEl), 'onclick', this, this.searchRoute);

    if(this.isReadOnly()){
        return;
    }
    // 日付選択ボタンクリックのイベントハンドラ作成
    teasp.Tsf.Dom.query('.ts-form-cal', formEl).forEach(function(cal){
        var n = teasp.Tsf.Dom.node('input[type="text"]', cal.parentNode.parentNode);
        if(n){
            tsfManager.eventOpenCalendar(this.getDomHelper(),
                cal,
                n,
                {
                    tagName         : n.name,
                    isDisabledDate  : function(d){ return false; },
                    selectedDate    : dojo.hitch(this, this.selectedDate)
                }
            );
        }
    }, this);

    // 金額、単価入力欄のイベントハンドラをセット
    teasp.Tsf.Dom.query('.ts-form-currency input', formEl).forEach(function(n){
        teasp.Tsf.Currency.eventInput(this.getDomHelper(), n, teasp.Tsf.Dom.hitch(this, this.changedCurrency));
    }, this);

    this.getDomHelper().connect(teasp.Tsf.Dom.node('button.ts-tax-auto', formEl), 'onclick', this, this.clickTaxAuto);

    // 費目の選択肢セット、費目選択イベント
    var select = this.fp.getElementByApiKey('ExpItemId__c', null, formEl);
    if(select){
        this.getDomHelper().connect(select, 'onchange', this, this.changedExpItem);
    }

    // ジョブ変更イベント
    select = this.fp.getElementByApiKey('JobId__c', null, formEl);
    if(select){
        this.getDomHelper().connect(select, 'onchange', this, this.changedJob);
    }
    // 負担部署変更イベント
    select = this.fp.getElementByApiKey('ChargeDeptId__c', null, formEl);
    if(select){
        this.getDomHelper().connect(select, 'onchange', this, this.changedChargeDept);
    }

    this.setEventExpItem(formEl);   // 費目
    this.setEventTax(formEl);       // 税
    this.setEventForeign(formEl);   // 外貨
    this.setEventQuantity(formEl);  // 数量
    this.setEventRoute(formEl);     // 経路
    this.setEventJob(formEl);       // ジョブ
    this.setEventDept(formEl);      // 負担部署
    this.setEventPayee(formEl);     // 支払先
    this.setEventDate(formEl);      // 利用日
    this.setEventExtra(formEl);     // 拡張項目
    this.setEventParticipant(formEl);// 社内・社外参加者
};

/**
 * 利用日イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpDetail.prototype.setEventDate = function(formEl){
    // 日付変更
    var inp = this.fp.getElementByApiKey('Date__c', null, formEl);
    if(inp){
        this.getDomHelper().connect(inp, 'blur'      , this, this.changedDate);
        this.getDomHelper().connect(inp, 'onkeypress', this, function(e){
            if (e.keyChar === "" && e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
                e.preventDefault();
                e.stopPropagation();
                this.changedDate(e);
            }
        });
    }
};

/**
 * 費目検索イベント
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpDetail.prototype.setEventExpItem = function(formEl){
    var select = this.fp.getElementByApiKey('ExpItemId__c', null, formEl);
    if(select){
        var el = teasp.Tsf.Dom.getAncestorByCssName(select, 'ts-form-row');
        if(el){
            var btn = teasp.Tsf.Dom.node('button.ts-form-find', el);
            if(btn){
                this.getDomHelper().connect(btn, 'onclick', this, function(e){
                    var expItemIds = [];
                    var expItems = tsfManager.getExpItems(this.expItemFilter, true);
                    dojo.forEach(expItems, function(expItem){
                        if(this.isSelectableExpItem(expItem)){ // 選択可能な費目のみ選択肢にする
                            expItemIds.push("'" + expItem.getId() + "'");
                        }
                    }, this);
                    if(!expItemIds.length){
                        expItemIds.push("''"); // 選択可能な費目がない場合、該当なしを承知で、強制で '' をセット
                    }
                    tsfManager.showSearchListDialog({ discernment: 'expItems', delay: true, values: { Id: expItemIds.join(',') } }, null, teasp.Tsf.Dom.hitch(this, function(lst){
                        var src = lst[0];
                        var obj = {
                            ExpItemId__c : src.Id,
                            ExpItemId__r : src
                        };
                        var fc = this.fp.getFcByApiKey('ExpItemId__c');
                        fc.drawText(this.getDomHelper(), obj, null, formEl);
                        this.changedExpItem(e);
                    }));
                });
            }
        }
    }
};

/**
 * 消費税関連イベント
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpDetail.prototype.setEventTax = function(formEl){
    // 税率を変更
    var taxRate = teasp.Tsf.Dom.node('div.ts-row-tax select.ts-tax-rate', formEl);
    if(taxRate){
        this.getDomHelper().connect(taxRate, 'onchange', this, this.changedTaxRate);
    }
};

/**
 * 外貨関連イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpDetail.prototype.setEventForeign = function(formEl){
    var area = teasp.Tsf.Dom.node('div.ts-row-foreign', formEl);
    // 通貨を変更
    var foreign = teasp.Tsf.Dom.node('select.ts-foreign-name', area);
    if(foreign){
        this.getDomHelper().connect(foreign, 'onchange', this, this.changedForeign);
    }
    var inps = teasp.Tsf.Dom.query('input', area);
    this.getDomHelper().connect(inps, 'blur'      , this, this.changedCurrency);
    this.getDomHelper().connect(inps, 'onkeypress', this, function(e){
        if (e.keyChar === "" && e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
            e.preventDefault();
            e.stopPropagation();
            this.changedCurrency(e);
        }
    });
};

/**
 * 数量イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpDetail.prototype.setEventQuantity = function(formEl){
    // 数量変更
    var inp = this.fp.getElementByApiKey('Quantity__c', null, formEl);
    if(inp){
        this.getDomHelper().connect(inp, 'blur'      , this, this.changedCurrency);
        this.getDomHelper().connect(inp, 'onkeypress', this, function(e){
            if (e.keyChar === "" && e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
                e.preventDefault();
                e.stopPropagation();
                this.changedCurrency(e);
            }
        });
    }
};

/**
 * 社内・社外参加者項目イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpDetail.prototype.setEventParticipant = function(formEl){
    // 拡張項目
    dojo.forEach([
        this.fp.getElementByApiKey('InternalParticipantsNumber__c', null, formEl),
        this.fp.getElementByApiKey('ExternalParticipantsNumber__c', null, formEl)
    ], function(el){
        this.getDomHelper().connect(el, 'blur'      , this, this.changedparticipants);
        this.getDomHelper().connect(el, 'onkeypress', this, function(e){
            if (e.keyChar === "" && e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
                e.preventDefault();
                e.stopPropagation();
                this.changedparticipants(e);
            }
        });
    }, this);
};

/**
 * 拡張項目イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpDetail.prototype.setEventExtra = function(formEl){
    // 拡張項目
    dojo.forEach([
        this.fp.getElementByApiKey('ExtraItem1__c', null, formEl),
        this.fp.getElementByApiKey('ExtraItem2__c', null, formEl)
    ], function(el){
        this.getDomHelper().connect(el, 'blur'      , this, this.checkMatching);
        this.getDomHelper().connect(el, 'onkeypress', this, function(e){
            if (e.keyChar === "" && e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
                e.preventDefault();
                e.stopPropagation();
                this.checkMatching();
            }
        });
    }, this);
};

/**
 * 経路関連イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpDetail.prototype.setEventRoute = function(formEl){
    // 発着駅のコンボボックス生成
    var cbSt = this.getDomHelper().createComboBox({
        id              : "DlgExpDetailStFrom",
        name            : "DlgExpDetailStFrom",
        value           : "",
        store           : this.getStoreFrom(),
        fetchProperties : {sort:[{attribute:'score',descending:false},{attribute:'name',descending:false}]},
        searchAttr      : "name"
    }, teasp.Tsf.Dom.node('.ts-form-st-from', formEl));

    var cbEt = this.getDomHelper().createComboBox({
        id              : "DlgExpDetailStTo",
        name            : "DlgExpDetailStTo",
        value           : "",
        store           : this.getStoreTo(),
        fetchProperties : {sort:[{attribute:'score',descending:false},{attribute:'name',descending:false}]},
        searchAttr      : "name"
    }, teasp.Tsf.Dom.node('.ts-form-st-to', formEl));

    // 発駅名変更
    this.getDomHelper().connect(cbSt, 'onChange', this, this.changeEkitanElements);
    // 着駅名変更
    this.getDomHelper().connect(cbEt, 'onChange', this, this.changeEkitanElements);
    // 片道/往復ボタンクリック
    this.getDomHelper().connect(teasp.Tsf.Dom.node('.ts-form-roundtrip', formEl), 'onclick', this, this.clickRoundTrip);
};

/**
 * ジョブ関連イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpDetail.prototype.setEventJob = function(formEl){
    var jobSelect = this.fp.getElementByApiKey('JobId__c', null, formEl);
    if(jobSelect){
        var el = teasp.Tsf.Dom.getAncestorByCssName(jobSelect, 'ts-form-row');
        if(el){
            var btn = teasp.Tsf.Dom.node('button.ts-form-find', el);
            if(btn){
                this.getDomHelper().connect(btn, 'onclick', this, function(e){
                    var d = this.fetchValueByApiKey('Date__c') || teasp.util.date.formatDate(teasp.util.date.getToday());
                    var chargeDept = this.getCurrentChargeDept();
                    var deptId = (chargeDept && chargeDept.Id
                            || (this.orgData.assist && this.orgData.assist.ChargeDeptId__c)
                            || this.orgData.defaultDeptId);
                    tsfManager.showSearchListDialog({
                            discernment : 'jobs',
                            dialog      : 'JobList',
                            delay       : true,
                            values      : {
                                _date          : [d],
                                DeptId__c      : deptId,
                                _jobAssignClass: tsfManager.getEmpJobSearchCondition()
                            }
                        }, null, teasp.Tsf.Dom.hitch(this, function(lst){
                        var src = lst[0];
                        this.setImportJobs(src);
                        var obj = {};
                        obj.JobId__r = {};
                        obj.JobId__r.JobCode__c   = src.JobCode__c;
                        obj.JobId__r.StartDate__c = src.StartDate__c;
                        obj.JobId__r.EndDate__c   = src.EndDate__c;
                        obj.JobId__r.Active__c    = src.Active__c;
                        obj.JobId__r.Name         = src.Name;
                        obj.JobId__c              = src.Id;
                        var fc = this.fp.getFcByApiKey('JobId__c');
                        fc.drawText(this.getDomHelper(), obj, null, formEl);
                        teasp.Tsf.util.mixin(this.orgData.values, obj);
                        this.checkMatching();
                    }));
                });
            }
        }
    }
};

/**
 * 負担部署イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpDetail.prototype.setEventDept = function(formEl){
    var deptId = this.fp.getElementByApiKey('ChargeDeptId__c', null, formEl);
    if(deptId){
        var el = teasp.Tsf.Dom.getAncestorByCssName(deptId, 'ts-form-row');
        if(el){
            var btn = teasp.Tsf.Dom.node('button.ts-form-find', el);
            if(btn){
                this.getDomHelper().connect(btn, 'onclick', this, function(e){
                    var d = this.fetchValueByApiKey('Date__c') || teasp.util.date.formatDate(teasp.util.date.getToday());
                    tsfManager.showSearchListDialog({ discernment : 'depts', delay: true, values: { _date: [d] } }, null, teasp.Tsf.Dom.hitch(this, function(lst){
                        var src = lst[0];
                        var obj = {
                            ChargeDeptId__c : src.Id,
                            ChargeDeptId__r : {
                                DeptCode__c     : src.DeptCode__c,
                                ExpItemClass__c : src.ExpItemClass__c,
                                Name            : src.Name
                            }
                        };
                        tsfManager.getInfo().setCacheDept(obj);
                        var fc = this.fp.getFcByApiKey('ChargeDeptId__c');
                        fc.drawText(this.getDomHelper(), obj, null, formEl);
                        // 費目選択リストを更新
                        this.expItemFilter.deptExpItemClass = obj.ChargeDeptId__r.ExpItemClass__c || null;
                        this.refreshExpItems();
                    }));
                });
            }
        }
    }
};

/**
 * 支払関連イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpDetail.prototype.setEventPayee = function(formEl){
    var payee = this.fp.getElementByApiKey('PayeeId__r.Name', null, formEl);
    if(payee){
        var el = teasp.Tsf.Dom.getAncestorByCssName(payee, 'ts-form-row');
        if(el){
            var btn = teasp.Tsf.Dom.node('button.ts-form-find', el);
            if(btn){
                this.getDomHelper().connect(btn, 'onclick', this, function(e){
                    var select = teasp.Tsf.Dom.node('select.ts-payment-select', this.getFormEl());
                    var payType = select.value;
                    var values = {
                        PayeeType__c   : payType,
                        ExpenseType__c : (this.orgData.assist && this.orgData.assist.ExpenseType__c || null)
                    };
                    tsfManager.showSearchListDialog({ discernment: 'payeeList', delay: true, values: values }, null, teasp.Tsf.Dom.hitch(this, function(lst){
                        var obj = {};
                        obj.PayeeId__r = {};
                        obj.PayeeId__r.Name           = lst[0].dispValue;
                        obj.PayeeId__c                = lst[0].value;
                        obj.PayeeId__r.PayeeType__c   = lst[0].PayeeType__c;
                        obj.PayeeId__r.ExpenseType__c = lst[0].ExpenseType__c;
                        var fc1 = this.fp.getFcByApiKey('PayeeId__r.Name');
                        var fc2 = this.fp.getFcByApiKey('PayeeId__c');
                        var fc3 = this.fp.getFcByApiKey('PayeeId__r.PayeeType__c');
                        var fc4 = this.fp.getFcByApiKey('PayeeId__r.ExpenseType__c');
                        fc1.drawText(this.getDomHelper(), obj, null, formEl);
                        fc2.drawText(this.getDomHelper(), obj, null, formEl);
                        fc3.drawText(this.getDomHelper(), obj, null, formEl);
                        fc4.drawText(this.getDomHelper(), obj, null, formEl);
                        if(lst[0].PayeeType__c){
                            var select = teasp.Tsf.Dom.node('select.ts-payment-select', this.getFormEl());
                            select.value = lst[0].PayeeType__c;
                        }
                        teasp.Tsf.util.mixin(this.orgData.values, obj);
                        this.checkMatching();
                    }));
                });
            }
        }
    }
};

teasp.Tsf.ExpDetail.prototype.getWithoutTaxNode  = function(){ return teasp.Tsf.Dom.node('div.ts-row-tax input.ts-tax-without-tax'  , this.getFormEl()); }; // 税抜金額入力欄
teasp.Tsf.ExpDetail.prototype.getTaxNode         = function(){ return teasp.Tsf.Dom.node('div.ts-row-tax input.ts-tax-tax'          , this.getFormEl()); }; // 税入力欄
teasp.Tsf.ExpDetail.prototype.getForeignRateNode = function(){ return teasp.Tsf.Dom.node('div.ts-row-foreign input.ts-foreign-rate' , this.getFormEl()); }; // 換算レート入力欄
teasp.Tsf.ExpDetail.prototype.getForeignCostNode = function(){ return teasp.Tsf.Dom.node('div.ts-row-foreign input.ts-foreign-cost' , this.getFormEl()); }; // 現地金額入力欄
teasp.Tsf.ExpDetail.prototype.getForeignNameNode = function(){ return teasp.Tsf.Dom.node('div.ts-row-foreign select.ts-foreign-name', this.getFormEl()); }; // 通貨名プルダウン
teasp.Tsf.ExpDetail.prototype.getRoundTripNode   = function(){ return teasp.Tsf.Dom.node('.ts-form-roundtrip', this.getFormEl()); }; // 片道/往復ボタン

/**
 * 費目プルダウンに選択肢をセット
 *
 * @param {Object} el
 */
teasp.Tsf.ExpDetail.prototype.loadExpItems = function(el){
    var sel = el.value;
    var mp = {};
    teasp.Tsf.Dom.empty(el);
    this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
    dojo.forEach(tsfManager.getExpItems(this.expItemFilter), function(expItem){
        if(this.isSelectableExpItem(expItem)){ // 選択可能な費目のみ選択肢にする
            this.getDomHelper().create('option', { value: expItem.getId(), innerHTML: expItem.getName() }, el);
            mp[expItem.getId()] = 1;
        }
    }, this);
    if(mp[sel]){
        el.value = sel;
    }
};

teasp.Tsf.ExpDetail.prototype.refreshExpItems = function(){
    var select = this.fp.getElementByApiKey('ExpItemId__c', null, this.getFormEl());
    if(select){
        this.loadExpItems(select);
    }
    this.checkMatching();
};

teasp.Tsf.ExpDetail.prototype.isMinusCost = function(vobj){
	var v = (vobj && vobj.Cost__c) || null;
	var n = (v && typeof(v) == 'string' ? parseInt(v, 10) : v);
	if(typeof(n) == 'number' && !isNaN(n)){
		return (n < 0);
	}
	return false;
};

/**
 * 選択可能な費目か
 *
 * @param {teasp.Tsf.ExpItem} expItem 費目クラスのインスタンス
 * @returns {Boolean}
 */
teasp.Tsf.ExpDetail.prototype.isSelectableExpItem = function(expItem){
    var vobj = this.orgData.values;
    if(this.cardConst){ // カード読込した明細の場合
        if(expItem.isFixAmount()){ // 金額固定の費目は選択不可
            return false;
        }
        if(this.isMinusCost(vobj) && !expItem.isAllowMinus()){ // 金額がマイナスの場合、マイナス不可の費目は選択不可
        	return false;
        }
        if(!vobj.CurrencyName__c && expItem.isForeignFlag()){ // データに通貨名が入ってない場合、外貨入力する費目は選択不可
            // ※ 読込元のデータに通貨名は入っていても、レートと現地金額のどちらかが入ってなければ、ここにくる。
            // （teasp.Tsf.ExpApply.prototype.createEmpExpFromCard() の中でレートと現地金額のどちらかが空なら通貨名に null をセットしている）
            return false;
        }
    }
    return this.isSelectableJtbExpItem(expItem);
};

/**
 * J'sNAVI Jr明細で選択可能な費目か
 *
 * @param {teasp.Tsf.ExpItem} expItem 費目クラスのインスタンス
 * @returns {Boolean}
 */
teasp.Tsf.ExpDetail.prototype.isSelectableJtbExpItem = function(expItem){
    var vobj = this.orgData.values;
    if(vobj.Item__c == 'JTB') { // J'sNAVI Jr明細の場合
        if(!vobj.JsNaviActualId__r) return false;
        var items = tsfManager.getJtbExpItems(); // JTB連携用費目
        if(!items) return true;
        var jtbExpItemKey;
        var transportFunctionCodes = ['JL', 'NH', 'JE', 'SF', 'JN', 'HD', 'JW'];
        // 交通機関
        if(transportFunctionCodes.indexOf(vobj.JsNaviActualId__r.FunctionCode__c) >=0 ||
           (vobj.JsNaviActualId__r.Data01__c && (vobj.JsNaviActualId__r.Data01__c.indexOf('交通') >= 0 || vobj.JsNaviActualId__r.Data01__c.indexOf('航空') >= 0 || vobj.JsNaviActualId__r.Data01__c.indexOf('新幹線') >= 0)))
        {
            if(vobj.JsNaviActualId__r.SystemType__c == 'J') { // 国内
                if(items.j1.length > 0 && items.j1.indexOf(expItem.expItem.Id) < 0) return false;
            } else if(vobj.JsNaviActualId__r.SystemType__c == 'F') { // 海外
                if(items.f1.length > 0 && items.f1.indexOf(expItem.expItem.Id) < 0) return false;
            } else { // その他
                if(items.j1.length > 0 && items.j1.indexOf(expItem.expItem.Id) < 0 &&
                   items.f1.length > 0 && items.f1.indexOf(expItem.expItem.Id) < 0 &&
                   items.e1.length > 0 && items.e1.indexOf(expItem.expItem.Id) < 0) return false;
            }
        // 宿泊
        } else if(vobj.JsNaviActualId__r.FunctionCode__c == 'BH' || vobj.JsNaviActualId__r.FunctionCode__c == 'RT' || vobj.JsNaviActualId__r.FunctionCode__c == 'GT' ||
                vobj.JsNaviActualId__r.FunctionCode__c == 'HR' ||
                  (vobj.JsNaviActualId__r.Data01__c && vobj.JsNaviActualId__r.Data01__c.indexOf('宿泊') >= 0))
        {
            if(vobj.JsNaviActualId__r.SystemType__c == 'J') { // 国内
                if(items.j2.length > 0 && items.j2.indexOf(expItem.expItem.Id) < 0) return false;
            } else if(vobj.JsNaviActualId__r.SystemType__c == 'F') { // 海外
                if(items.f2.length > 0 && items.f2.indexOf(expItem.expItem.Id) < 0) return false;
            } else { // その他
                if(items.j2.length > 0 && items.j2.indexOf(expItem.expItem.Id) < 0 &&
                   items.f2.length > 0 && items.f2.indexOf(expItem.expItem.Id) < 0 &&
                   items.e2.length > 0 && items.e2.indexOf(expItem.expItem.Id) < 0) return false;
            }
        // レンタカー
        } else if(vobj.JsNaviActualId__r.Data01__c && vobj.JsNaviActualId__r.Data01__c.indexOf('レンタカー') >= 0){
            if(vobj.JsNaviActualId__r.SystemType__c == 'J') { // 国内
                if(items.j3.length > 0 && items.j3.indexOf(expItem.expItem.Id) < 0) return false;
            } else if(vobj.JsNaviActualId__r.SystemType__c == 'F') { // 海外
                if(items.f3.length > 0 && items.f3.indexOf(expItem.expItem.Id) < 0) return false;
            } else { // その他
                if(items.j3.length > 0 && items.j3.indexOf(expItem.expItem.Id) < 0 &&
                   items.f3.length > 0 && items.f3.indexOf(expItem.expItem.Id) < 0 &&
                   items.e3.length > 0 && items.e3.indexOf(expItem.expItem.Id) < 0) return false;
            }
        }
    }
    return true;
};

/**
 * ジョブ選択肢をセット
 *
 * @param {string} d
 */
teasp.Tsf.ExpDetail.prototype.loadJobs = function(d){
    var el = this.fp.getElementByApiKey('JobId__c', null, this.getFormEl()); // ジョブ選択プルダウン
    if(el){
        var sel = el.value;
        var jobs = this.getJobChoices(); // ジョブ選択肢
        for(var i = 0 ; i < jobs.length ; i++){
            this.jobPool[jobs[i].getId()] = jobs[i].getObj();
        }
        var date = (d || this.getDate());
        var mp = {};
        teasp.Tsf.Dom.empty(el);
        this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
        dojo.forEach(jobs, function(job){
            var jobId = job.getId();
            if((job.activeOnDate(date) || jobId == sel) && !mp[jobId]){
                this.getDomHelper().create('option', { value: jobId, innerHTML: job.getDisplayName() }, el);
                mp[jobId] = 1;
            }
        }, this);
        if(mp[sel]){
            el.value = sel;
        }
    }
};

/**
 * 選択中のジョブを返す
 *
 * @returns {string}
 */
teasp.Tsf.ExpDetail.prototype.getCurrentJob = function(){
    var el = this.fp.getElementByApiKey('JobId__c', null, this.getFormEl()); // ジョブ選択プルダウン
    var jobId = el.value || null;
    if(jobId){
        var jobs = this.getJobChoices();
        for(var i = 0 ; i < jobs.length ; i++){
            if(jobs[i].getId() == jobId){
                return jobs[i];
            }
        }
    }
    return null;
};

/**
 * ジョブ選択肢＝アサイン済みジョブと一時記憶のジョブの配列を返す
 *
 * @returns {Array.<Object>}
 */
teasp.Tsf.ExpDetail.prototype.getJobChoices = function(){
    var jobs = tsfManager.getEmpJobAssigns(); // アサイン済みのジョブ
    return (this.impJobs ? jobs.concat(this.impJobs) : jobs);
};

/**
 * ジョブ検索画面で選択したジョブを一時記憶する
 * @param {Object} o
 */
teasp.Tsf.ExpDetail.prototype.setImportJobs = function(o){
    var jobs = this.getJobChoices();
    var f = false;
    for(var i = 0 ; i < jobs.length ; i++){
        if(jobs[i].getId() == o.Id){
            f = true;
            break;
        }
    }
    if(!f){
        this.impJobs = [new teasp.Tsf.Job(o)];
    }
};

teasp.Tsf.ExpDetail.prototype.checkImportJobs = function(p){
    if(p.JobId__c && p.JobId__r){
        this.setImportJobs({
            Id              : p.JobId__c,
            JobCode__c      : p.JobId__r.JobCode__c || '',
            Name            : p.JobId__r.Name || '',
            IsAssigned__c   : false,
            JobAssignId     : null,
            StartDate__c    : p.JobId__r.StartDate__c || null,
            EndDate__c      : p.JobId__r.EndDate__c   || null,
            Active__c       : (p.JobId__r.Active__c === undefined ? true : p.JobId__r.Active__c)
        });
    }
};

/**
 * 負担部署選択肢をセット
 *
 * @param {string} d
 */
teasp.Tsf.ExpDetail.prototype.loadChargeDepts = function(d){
    var el = this.fp.getElementByApiKey('ChargeDeptId__c', null, this.getFormEl()); // 負担部署選択プルダウン
    if(el){
        teasp.Tsf.Dom.empty(el);
        var o = tsfManager.getDefaultChargeDept(); // デフォルトの負担部署
        this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
        if(o.ChargeDeptId__c){
            this.getDomHelper().create('option', {
                value     : o.ChargeDeptId__c,
                innerHTML : o.ChargeDeptId__r.DeptCode__c + ' ' + o.ChargeDeptId__r.Name
            }, el);
            tsfManager.getInfo().setCacheDept(o);
        }
    }
};

/**
 * 選択中の負担部署を返す
 *
 * @returns {string}
 */
teasp.Tsf.ExpDetail.prototype.getCurrentChargeDept = function(){
    var el = this.fp.getElementByApiKey('ChargeDeptId__c', null, this.getFormEl()); // 負担部署選択プルダウン
    return (el && tsfManager.getInfo().getCacheDept(el.value || null) || null);
};

/**
 * 選択中の費目を取得
 *
 * @returns {teasp.Tsf.ExpItem}
 */
teasp.Tsf.ExpDetail.prototype.getCurrentExpItem = function(){
    return tsfManager.getExpItemById(this.fp.getFcByApiKey('ExpItemId__c').fetchValue().value);
};

/**
 * 費目変更
 * 現在選択されている費目に応じてフォームを描画し直す
 * @param {Object} e
 */
teasp.Tsf.ExpDetail.prototype.changedExpItem = function(e){
    var formEl = this.getFormEl();
    var expItem = this.getCurrentExpItem();
    var transportType = (expItem ? expItem.getTransportType() : null);

    var stationArea  = (transportType == '1' || transportType == '2');
    var ekitanSearch = (transportType == '1');
    var isRequireReceipt  = (expItem && expItem.isReceipt()) || false;
    var taxFlag      = (expItem && expItem.isTaxFlag()) || false;
    var foreignFlag  = (expItem && expItem.isForeignFlag()) || false;
    var extra1       = (expItem && expItem.isUseExtraItem1()) || false;
    var extra2       = (expItem && expItem.isUseExtraItem2()) || false;
    var quantity     = (expItem && expItem.isEnableQuantity()) || false;
    var reqChargeJob = (expItem ? (expItem.isRequireChargeJob() || 0) : tsfManager.isRequireChargeJob());
    var Intparticipants = (expItem && expItem.isInternalParticipants()) || false;
    var Extparticipants = (expItem && expItem.isExternalParticipants()) || false;
    var Place = (expItem && expItem.isPlace()) || false;
    var AmountPerparticipants = (expItem && (expItem.isInternalParticipants() || expItem.isExternalParticipants())) || false;

    teasp.Tsf.Dom.show('.ts-row-route'      , formEl, stationArea);    // 交通費入力
    teasp.Tsf.Dom.show('.ts-row-tax'        , formEl, taxFlag);        // 税入力
    teasp.Tsf.Dom.show('.ts-row-foreign'    , formEl, foreignFlag);    // 外貨入力
    teasp.Tsf.Dom.show('.ts-row-quantity'   , formEl, quantity);       // 数量あり
    teasp.Tsf.Dom.show('.ts-row-extra1'     , formEl, extra1);         // 拡張項目１
    teasp.Tsf.Dom.show('.ts-row-extra2'     , formEl, extra2);         // 拡張項目２
    teasp.Tsf.Dom.show('.ts-row-job'        , formEl, reqChargeJob  > 0);  // ジョブ
    teasp.Tsf.Dom.show('.ts-row-intpart'    , formEl, Intparticipants);    // 社内参加者
    teasp.Tsf.Dom.show('.ts-row-extpart'    , formEl, Extparticipants);    // 社外参加者
    teasp.Tsf.Dom.show('.ts-row-place'      , formEl, Place);           // 店舗
    teasp.Tsf.Dom.show('.ts-PerParticipant' , formEl, AmountPerparticipants);    // 人数割金額
    teasp.Tsf.Dom.show('.pp_btn_ektsrch'    , formEl, !this.cardConst && ekitanSearch);   // 駅探検索ボタン
    teasp.Tsf.Dom.show('.pp_ico_ekitan'     , formEl, false);          // 駅探アイコン（デフォルトは非表示）
    teasp.Tsf.Dom.show('.ts-spice'          , formEl, false);          // IC(spice)アイコン（デフォルトは非表示）
    teasp.Tsf.Dom.show('.ts-external'       , formEl, false);          // 経費連携アイコン（デフォルトは非表示）
    teasp.Tsf.Dom.show('.ts-receipt'        , formEl, isRequireReceipt);    // 領収書アイコン


    teasp.Tsf.Dom.show('.ts-row-job  .ts-require', formEl, reqChargeJob  == 2);  // ジョブの必須マーク切替

    // 発行者(店名)が入力必須かどうか(領収書要の費目 & 事前申請ではない & スキャナ保存オプションがオン　のときは入力必須)
    const isRequirePublisher = isRequireReceipt && !this.orgData.pre && tsfManager.isUseScannerStorage()
    teasp.Tsf.Dom.show('.ts-row-publisher  .ts-require', formEl, isRequirePublisher);  // 発行者（店名）の必須マーク切替

    if(extra1 || extra2){ // 拡張項目がある
        for(var x = 1 ; x <= 2 ; x++){
            var ex = expItem.getExtraItem(x);
            if(!ex){
                continue;
            }
            var row = teasp.Tsf.Dom.node('.ts-row-extra' + x, formEl);
            var n = teasp.Tsf.Dom.node('div.ts-form-label > div', row);
            if(n){
                n.innerHTML = (ex.name || '&nbsp;');
            }
            teasp.Tsf.Dom.show('.ts-require', row, ex.require);
            n = teasp.Tsf.Dom.node('div.ts-form-value > input', row);
            if(n){
                n.style.width = ex.width;
                n.maxLength = ex.maxLength;
            }
            this.getDomHelper().freeBy(this.EXPITEM_TOOLTIP_HKEY_EX + x);
            if(ex.note){
                this.getDomHelper().createTooltip({
                    connectId   : teasp.Tsf.Dom.node('div.ts-form-value', row),
                    label       : ex.note,
                    position    : ['before'],
                    showDelay   : 100
                }, this.EXPITEM_TOOLTIP_HKEY_EX + x);
            }
        }
    }

    var suffix = teasp.Tsf.Dom.node('div.ts-row-quantity div.ts-suffix');
    if(suffix){
        suffix.innerHTML = (expItem && expItem.getUnitName()) || '';
    }

    // マイナスの可否をセット
    if(expItem){
        var allowMinus = expItem.isAllowMinus();
        dojo.forEach(['Cost__c', 'ForeignAmount__c', 'Tax__c', 'WithoutTax__c', 'UnitPrice__c','InternalParticipantsNumber__c','ExternalParticipantsNumber__c'], function(cs){
            var fc = this.fp.getFcByApiKey(cs);
            if(fc){
                fc.setReadOnly(!allowMinus); // マイナスの可否
                var el = fc.getElement(null, formEl);
                teasp.Tsf.Dom.toggleClass(el, 'ts-minus-ok',  allowMinus);
                teasp.Tsf.Dom.toggleClass(el, 'ts-minus-ng', !allowMinus);
                if(!allowMinus && el.value){ // マイナス不可なら、入力欄からマイナス記号を消す
                    el.value = el.value.replace(/-/, '');
                }
            }
        }, this);
        dojo.forEach([this.getTaxNode(), this.getWithoutTaxNode(), this.getForeignCostNode()], function(el){
            if(el){
                teasp.Tsf.Dom.toggleClass(el, 'ts-minus-ok',  allowMinus);
                teasp.Tsf.Dom.toggleClass(el, 'ts-minus-ng', !allowMinus);
                if(!allowMinus && el.value){ // マイナス不可なら、入力欄からマイナス記号を消す
                    el.value = el.value.replace(/-/, '');
                }
            }
        }, this);
    }

    if(e && expItem){   // 費目プルダウンの選択変更
        var d = this.getDate() || teasp.util.date.formatDate(teasp.util.date.getToday());
        var originalCost = this.getCostValue(expItem, true);
        var currentCost = originalCost;
        var defaultCost = expItem.getCost(d, true);
        var defaultOn = (typeof(defaultCost) == 'number');
        if(defaultOn ){// 標準金額あり
            if(expItem.isEnableQuantity()){ // 数量あり
                this.setUnitPriceValue(defaultCost); // 単価←標準金額
                var qn = this.getQuantityValue();
                if(!qn){
                    this.setQuantityValue(1);  // 数量＝1
                }
            }
            this.setCostValue(defaultCost);
            currentCost = defaultCost;
        }
        var pcost = this.fp.getElementByApiKey('Cost__c', formEl); // 金額入力欄
        if(pcost){
            pcost.disabled = expItem.isAmountReadOnly();
        }
        if(quantity){
            var up = this.getUnitPriceValue(expItem);
            var qn = this.getQuantityValue();
            if(!up && !qn){
                this.setUnitPriceValue(currentCost || 0);
                this.setQuantityValue(1);
            }
        }
        if(expItem.isEnableQuantity()){ // 数量あり
            this.recalcCost(true, expItem, defaultOn);
        }
        if(taxFlag || AmountPerparticipants){    // 税入力あり
            this.setTaxType(this.getTaxType(true));
            this.setTaxArea(this.getTaxType());
            var taxRate = this.getExpItemTaxRate(expItem);
            this.setSelectableTaxRate(taxRate, expItem);
            this.recalcTax(0, expItem, defaultOn);
        }
        if(foreignFlag){    // 外貨入力あり
            this.initForeignCurrency(expItem);
        }
        if(Intparticipants){    //社内参加者入力あり
            this.setInternalParticipants(expItem, expItem.getInternalParticipantsTemplateText());
            this.setInternalParticipantsNumber(0);
        }else{
            this.setInternalParticipants(expItem, '');
            this.setInternalParticipantsNumber(null);
        }
        if(Extparticipants){    //社外参加者入力あり
            this.setExternalParticipants(expItem, expItem.getExternalParticipantsTemplateText());
            this.setExternalParticipantsNumber(0);
        }else{
            this.setExternalParticipants(expItem, '');
            this.setExternalParticipantsNumber(null);
        }
        this.setPlaceName('');  //店舗名
        this.setPlaceAddress('');   //店舗所在地
        if(AmountPerparticipants){    // 参加者入力あり
            this.recalcAmountPerParticipants(expItem);
        }
        var o = this.getRouteData(expItem);
        if(teasp.Tsf.EmpExp.isSpice(o.item)){
            teasp.Tsf.Dom.show('.spice', this.getFormEl(), true); // ICアイコン
        }else if(expItem.getTransportType() == '1'){ // 駅探検索する費目
            teasp.Tsf.Dom.show('.pp_ico_ekitan', this.getFormEl(), (o.transportType == '1')); // 駅探アイコン
        }
        teasp.Tsf.Dom.show('.ts-external', this.getFormEl(), teasp.Tsf.EmpExp.isExternalExpense(o.item)); // ICアイコン
    }else if(expItem){
        var pcost = this.fp.getElementByApiKey('Cost__c', formEl); // 金額入力欄
        if(pcost){
            pcost.disabled = expItem.isAmountReadOnly();
        }
        if(foreignFlag){
            var select = this.getForeignNameNode();
            if(select){
                var name = (select.selectedIndex < 0 ? '' : select.options[select.selectedIndex].text);
                this.initForeignCurrency(expItem, true, name);
            }
        }
        if(AmountPerparticipants){    // 参加者入力あり
           if(!this.isReadOnly()){
                this.recalcTax((this.getTaxType() == 1 || this.cardConst) ? 0 : 1);
            }
            this.recalcAmountPerParticipants(expItem);
        }
    }
    this.createExpItemTooltip(); // 費目のツールチップ更新
    this.checkMatching();
};

// 費目のツールチップ更新
teasp.Tsf.ExpDetail.prototype.createExpItemTooltip = function(){
    this.getDomHelper().freeBy(this.EXPITEM_TOOLTIP_HKEY);
    var select = this.fp.getElementByApiKey('ExpItemId__c', null, this.getFormEl());
    var expItem = this.getCurrentExpItem();
    if(select){
        var tip;
        if(expItem){
            var d = this.getDate();
            tip = expItem.getToolTip(false, d, this.getCurrentTaxRate(d)); // 費目の情報
        }else{
            tip = teasp.message.getLabel('tf10001680'); // 費目を選択してください
        }
        this.getDomHelper().createTooltip({
            connectId   : select.parentNode,
            label       : tip,
            position    : ['before'],
            showDelay   : 100
        }, this.EXPITEM_TOOLTIP_HKEY);
    }
};


// 社内参加者のツールチップ更新
teasp.Tsf.ExpDetail.prototype.createInternalParticipantsNumberTooltip = function(){
    this.getDomHelper().freeBy(this.EXPITEM_INTERNALPARTICIPANT_TOOLTIP_HKEY);
    var select = this.fp.getElementByApiKey('InternalParticipantsNumber__c', null, this.getFormEl());
    if(select){
        this.getDomHelper().createTooltip({
            connectId   : select.parentNode,
            label       : teasp.message.getLabel('tf10001853'),
            position    : ['before'],
            showDelay   : 100
        }, this.EXPITEM_INTERNALPARTICIPANT_TOOLTIP_HKEY);
    }
};

teasp.Tsf.ExpDetail.prototype.setTaxArea = function(taxType){
    if(taxType == 0){ // 税タイプ＝無税
        this.displayTaxArea(false); // 税抜金額、消費税欄を非表示にする
    }else{
        this.displayTaxArea(true); // 税抜金額、消費税欄を表示
        var pwout = this.getWithoutTaxNode();  // 税抜金額入力欄
        if(pwout){
            pwout.disabled = (taxType == 1); // 税抜金額入力欄は外税の場合だけ有効
        }
    }
};

teasp.Tsf.ExpDetail.prototype.setSelectableTaxRate = function(taxRate, expItem){
    var selectableTaxRate = (expItem ? expItem.getSelectableTaxRateEx(taxRate) : [10,8,5,0]);
    var table = teasp.Tsf.Dom.node('table.ts-tax-table', this.getFormEl());
    var select = teasp.Tsf.Dom.node('select.ts-tax-rate', table);
    dojo.empty(select);
    for(var i = 0 ; i < selectableTaxRate.length ; i++){
        var rate = selectableTaxRate[i];
        this.getDomHelper().create('option', { value: '' + rate, innerHTML: rate + '%' }, select);
    }
    var rate = null;
    if(taxRate === null){
        rate = (expItem ? expItem.getTaxRate(this.getDate()) : teasp.Tsf.ExpDetail.getTaxRate(this.getDate()));
    }else{
        rate = taxRate;
    }
    this.setTaxRateIfNotContain(rate);
    select.value = '' + rate;
    dojo.setAttr(select, 'disabled', (expItem && expItem.getSelectableTaxRate().length <= 1 ? true : false));
    this.createExpItemTooltip(); // 費目のツールチップ更新
};

/**
 * 税タイプを取得
 *
 * @params {boolean=} flag true:設定値そのまま返す
 * @returns {number}
 */
teasp.Tsf.ExpDetail.prototype.getTaxType = function(flag){
    var expItem = this.getCurrentExpItem(); // 費目
    if(!flag && expItem.getTaxType() == 2                                // 消費税タイプ=外税かつ
    && (expItem.isEkitanType() || expItem.isEnableQuantity() || expItem.isFixAmount())){ // 駅探検索する交通費,数量あり,金額固定の場合、内税の挙動にする（金額を固定するため）
        return 1;
    }
    return expItem.getTaxType();
};

/**
 * 税タイプ名を取得
 *
 * @returns {number}
 */
teasp.Tsf.ExpDetail.getTaxTypeName = function(taxType){
    if(taxType == 1){
        return teasp.message.getLabel('tm20001210'); // 内税
    }else if(taxType == 2){
        return teasp.message.getLabel('tm20001220'); // 外税
    }else{
        return teasp.message.getLabel('tm20001230'); // 無税
    }
};

/**
 * 税タイプ名の表記を変える
 *
 * @param {Object} expItem
 */
teasp.Tsf.ExpDetail.prototype.setTaxType = function(taxType){
    var n = teasp.Tsf.Dom.node('div.ts-row-tax div.ts-tax-type', this.getFormEl());  // 税タイプ
    if(n){
        n.innerHTML = teasp.Tsf.ExpDetail.getTaxTypeName(taxType);
    }
};

/**
 * デフォルトの税率を返す
 *
 * @param {(Object|string)=} tdate
 * @returns {number}
 */
teasp.Tsf.ExpDetail.getTaxRate = function(tdate){
    var d = (tdate ? (typeof(tdate) == 'string' ? teasp.util.date.parseDate(tdate) : tdate) : new Date());
    if(d.getFullYear() > 2019 || (d.getFullYear() >= 2019 && (d.getMonth() + 1) >= 10)){
        return 10;
    }else if(d.getFullYear() > 2014 || (d.getFullYear() >= 2014 && (d.getMonth() + 1) >= 4)){
        return 8;
    }else{
        return 5;
    }
};

/**
 * 税率をセット
 *
 * @param {number|null} taxRate
 */
teasp.Tsf.ExpDetail.prototype.setTaxRate = function(expItem, taxRate){
    if(this.isReadOnly()){
        var n = teasp.Tsf.Dom.node('div.ts-row-tax div.ts-tax-rate');
        if(n){
//            n.innerHTML = '(' + taxRate || teasp.Tsf.ExpDetail.getTaxRate() + ')';
            n.innerHTML = '';
        }
        this.createExpItemTooltip(); // 費目のツールチップ更新
    }else{
        this.setSelectableTaxRate(taxRate, expItem);
    }
};

/**
 * 選択中の税率を返す
 * ・消費税入力する費目の場合、税率プルダウンの選択値を返す。
 * ・消費税入力しない費目の場合、設定値と日付から得た税率を返す。
 * @params {(Object|string)=} tdate 日付（消費税入力しない費目の場合のみ参照する）
 * @returns {number}
 */
teasp.Tsf.ExpDetail.prototype.getCurrentTaxRate = function(tdate){
    var expItem = this.getCurrentExpItem();
    if(expItem && !expItem.isTaxFlag()){ // 消費税入力しない
        return expItem.getTaxRate(tdate);
    }
    var n = teasp.Tsf.Dom.node('div.ts-row-tax select.ts-tax-rate');
    if(n){
        return parseInt(n.value, 10);
    }
};

/**
 * 引数の税率が税率プルダウンの候補に含まれてない場合、強制的に追加する
 * ※下記を措定している
 * ・費目の消費税率=自動で、選択できる消費税率が 10%,8% の時に利用日=2014-03-31以前を指定した時
 * ・利用日=2014-03-31以前で[続けて入力]をクリックした時
 * @param {number|string} rate 消費税率
 */
teasp.Tsf.ExpDetail.prototype.setTaxRateIfNotContain = function(rate){
    var select = teasp.Tsf.Dom.node('div.ts-row-tax select.ts-tax-rate');
    var hit = false;
    teasp.Tsf.Dom.query('option', select).forEach(function(el){
        if(el.value == rate){
            hit = true;
        }
    }, this);
    if(!hit){
        this.getDomHelper().create('option', { value: '' + rate, innerHTML: rate + '%' }, select);
    }
};

teasp.Tsf.ExpDetail.prototype.getExpItemTaxRate = function(expItem){
    var defaultTaxRate = expItem.getDefaultTaxRate();
    if(typeof(defaultTaxRate) == 'number'){
        return defaultTaxRate;
    }else{
        return teasp.Tsf.ExpDetail.getTaxRate(this.getDate());
    }
};

/**
 * 税率を変更
 * @param {Object} e
 */
teasp.Tsf.ExpDetail.prototype.changedTaxRate = function(e){
    this.recalcTax((this.getTaxType() == 1 || this.cardConst) ? 0 : 1);
    this.recalcAmountPerParticipants(); //人数割金額の再計算
    this.createExpItemTooltip(); // 費目のツールチップ更新
};

/**
 * 金額入力値を取得
 *
 * @param {teasp.Tsf.ExpItem} expItem
 * @param {boolean=} flag =trueの場合、空欄ならnullを返す。falseまたは省略の場合、空欄なら 0 を返す。
 * @returns {number|null}
 */
teasp.Tsf.ExpDetail.prototype.getCostValue = function(expItem, flag){
    var v = this.fp.getFcByApiKey('Cost__c').fetchValue().value;
    if(flag && (v === null || v == '')){
        return null;
    }
    var cost  = teasp.util.currency.string2number('' + v, expItem.isAllowMinus()); // 金額
    return cost.num;
};

/**
 * 金額を入力欄にセット
 *
 * @param {number} val
 * @param {boolean=} flag  val==0 の場合、入力欄をブランク（''）にする
 */
teasp.Tsf.ExpDetail.prototype.setCostValue = function(val, flag){
    var pcost = this.fp.getElementByApiKey('Cost__c', this.getFormEl()); // 金額入力欄
    if(pcost){
        if(!val && flag){
            pcost.value = '';
        }else{
            pcost.value = teasp.Tsf.Currency.formatMoney(val, teasp.Tsf.Currency.V_YEN, false, true);
        }
    }
};

/**
 * 社内参加人数を取得
 *
 * @param {teasp.Tsf.ExpItem} expItem
 * @param {boolean=} flag =trueの場合、空欄ならnullを返す。falseまたは省略の場合、空欄なら 0 を返す。
 * @returns {number|null}
 */
teasp.Tsf.ExpDetail.prototype.getInternalParticipantsNumber = function(expItem, flag){
    var v = this.fp.getFcByApiKey('InternalParticipantsNumber__c').fetchValue().value;
    if(flag && (v === null || v == '')){
        return null;
    }
    var participants  = teasp.util.currency.string2number('' + v); // 社内参加人数
    return parseInt(participants.sn1);
};

/**
 * 社内参加人数をセット
 *
 * @param {teasp.Tsf.ExpItem} expItem
 * @param {Number} val
 */
teasp.Tsf.ExpDetail.prototype.setInternalParticipantsNumber = function(val){
    var participants = this.fp.getElementByApiKey('InternalParticipantsNumber__c', this.getFormEl());
    if(participants){
        participants.value = val;
    }
};

/**
 * 社内参加者を取得
 *
 * @returns {String|null}
 */
teasp.Tsf.ExpDetail.prototype.getInternalParticipants = function(){
    var participants = this.fp.getFcByApiKey('InternalParticipants__c').fetchValue().value;
    return participants || null;
};

/**
 * 社内参加者をセット
 *
 * @param {String} val
 */
teasp.Tsf.ExpDetail.prototype.setInternalParticipants = function(expItem, val){
    var participants = this.fp.getElementByApiKey('InternalParticipants__c', this.getFormEl());
    if(participants){
        participants.value = val;
    }
};

/**
 * 社外参加人数を取得
 *
 * @param {teasp.Tsf.ExpItem} expItem
 * @param {boolean=} flag =trueの場合、空欄ならnullを返す。falseまたは省略の場合、空欄なら 0 を返す。
 * @returns {number|null}
 */

teasp.Tsf.ExpDetail.prototype.getExternalParticipantsNumber = function(expItem, flag){
    var v = this.fp.getFcByApiKey('ExternalParticipantsNumber__c').fetchValue().value;
    if(flag && (v === null || v == '')){
        return null;
    }
    var participants  = teasp.util.currency.string2number('' + v); // 社外参加人数
    return parseInt(participants.sn1);
};

/**
 * 社外参加人数をセット
 *
 * @param {Number} val
 */
teasp.Tsf.ExpDetail.prototype.setExternalParticipantsNumber = function(val){
    var participants = this.fp.getElementByApiKey('ExternalParticipantsNumber__c', this.getFormEl());
    if(participants){
        participants.value = val;
    }
};

/**
 * 社外参加者を取得
 *
 * @param {teasp.Tsf.ExpItem} expItem
 * @returns {String|null}
 */
teasp.Tsf.ExpDetail.prototype.getExternalParticipants = function(expItem){
    var participants = this.fp.getFcByApiKey('ExternalParticipants__c').fetchValue().value;
    return participants || null;
};

/**
 * 社外参加者をセット
 *
 * @param {teasp.Tsf.ExpItem} expItem
 * @param {String} val
 */
teasp.Tsf.ExpDetail.prototype.setExternalParticipants = function(expItem, val){
    var participants = this.fp.getElementByApiKey('ExternalParticipants__c', this.getFormEl());
    if(participants){
        participants.value = val;
    }
};

/**
 * 人数割金額をセット
 *
 * @param {teasp.Tsf.ExpItem} expItem
 * @param {number} val
 */
teasp.Tsf.ExpDetail.prototype.setAmountPerParticipantValue = function(expItem, val){

    var ppp = teasp.Tsf.Dom.node('div.ts-PerParticipant', this.getFormEl()); // 人数割金額表示欄
    if(ppp){
        ppp.innerHTML = teasp.message.getLabel('tf10011000')
        + teasp.message.getLabel('tm10001590');
    }

    if(!isNaN(val) && isFinite(val)){
        ppp.innerHTML += teasp.Tsf.Currency.formatMoney(val, teasp.Tsf.Currency.V_YEN, false, expItem.isAllowMinus());
    }else{
        ppp.innerHTML += teasp.Tsf.Currency.V_YEN + '-';
    }

    var ppp2 = this.fp.getElementByApiKey('AmountPerParticipant__c', this.getFormEl());
    if(ppp2){
        ppp2.value = val;
    }
};

/**
 * 店舗名をセット
 *
 * @param {Number} val
 */
teasp.Tsf.ExpDetail.prototype.setPlaceName = function(val){
    var Place = this.fp.getElementByApiKey('PlaceName__c', this.getFormEl());
    if(Place){
        Place.value = val;
    }
};

/**
 * 店舗所在地をセット
 *
 * @param {Number} val
 */
teasp.Tsf.ExpDetail.prototype.setPlaceAddress = function(val){
    var Place = this.fp.getElementByApiKey('PlaceAddress__c', this.getFormEl());
    if(Place){
        Place.value = val;
    }
};

/**
 * 参加人数を変更
 * @param {Object} e
 */
teasp.Tsf.ExpDetail.prototype.changedparticipants = function(e){
    var expItem = this.getCurrentExpItem();

    //マイナス符号チェック
    this.setInternalParticipantsNumber(this.getInternalParticipantsNumber(expItem))
    this.setExternalParticipantsNumber(this.getExternalParticipantsNumber(expItem))
    this.recalcTax(0, expItem);
    this.recalcAmountPerParticipants();
};

/**
 * 人数割金額を計算
 */
teasp.Tsf.ExpDetail.prototype.recalcAmountPerParticipants = function() {
    var expItem = this.getCurrentExpItem();
    if(!expItem){
        return;
    }

    var withoutTax = this.getWithoutTaxValue(expItem);   // 税抜金額
    var price = withoutTax  //金額
    var InternalParticipants = this.getInternalParticipantsNumber(expItem); //社内参加者
    if(!expItem.isInternalParticipants()){
        InternalParticipants = 0;
        this.setInternalParticipantsNumber(null);  //フォーム内容初期化
        this.setInternalParticipants(expItem, '');
    }
    var ExternalParticipants = this.getExternalParticipantsNumber(expItem); //社外参加者
    if(!expItem.isExternalParticipants()){
        ExternalParticipants = 0;
        this.setExternalParticipantsNumber(null);  //フォーム内容初期化
        this.setExternalParticipants(expItem, '');
    }
    if(!expItem.isPlace()){
        this.setPlaceName('');
        this.setPlaceAddress('');
    }

    var v = teasp.Tsf.Currency.roundSameAsSalesforce(price / (InternalParticipants + ExternalParticipants));
    this.setAmountPerParticipantValue(expItem, v);
    this.createInternalParticipantsNumberTooltip(); //社内参加者ツールチップ更新
};

/**
 * 単価入力値を取得
 *
 * @param {teasp.Tsf.ExpItem} expItem
 * @returns {number|null}
 */
teasp.Tsf.ExpDetail.prototype.getUnitPriceValue = function(expItem){
    var pup = this.fp.getElementByApiKey('UnitPrice__c', this.getFormEl()); // 単価入力欄
    if(pup){
        var up  = teasp.util.currency.string2number(pup.value, expItem.isAllowMinus()); // 単価
        return up.num;
    }
    return null;
};

/**
 * 単価を入力欄にセット
 *
 * @param {number} val
 */
teasp.Tsf.ExpDetail.prototype.setUnitPriceValue = function(val){
    var pup = this.fp.getElementByApiKey('UnitPrice__c', this.getFormEl()); // 金額入力欄
    if(pup){
        pup.value = teasp.Tsf.Currency.formatMoney(val, teasp.Tsf.Currency.V_YEN, false, true);
    }
};

/**
 * 数量入力値を取得
 *
 * @returns {number|null}
 */
teasp.Tsf.ExpDetail.prototype.getQuantityValue = function(){
    var pq = this.fp.getElementByApiKey('Quantity__c', this.getFormEl()); // 数量入力欄
    if(pq){
        var q = teasp.util.currency.formatDecimal(pq.value, 0, 0, false); // 数量
        return q.n;
    }
    return null;
};

/**
 * 数量を入力欄にセット
 *
 * @param {number} val
 */
teasp.Tsf.ExpDetail.prototype.setQuantityValue = function(val){
    var pq = this.fp.getElementByApiKey('Quantity__c', this.getFormEl()); // 数量入力欄
    if(pq){
        pq.value = teasp.util.currency.formatDecimal(val, 0, 0, false).str;
    }
};

teasp.Tsf.ExpDetail.prototype.setStaticTax = function(vobj){
    var n = teasp.Tsf.Dom.node('div.ts-row-tax div.ts-tax-div', this.getFormEl());

    var taxTypeName = teasp.Tsf.ExpDetail.getTaxTypeName(vobj.TaxType__c || 0);
    var tax         = (vobj.Tax__c || 0);
    var taxAuto     = (typeof(vobj.TaxAuto__c) == 'boolean' ? vobj.TaxAuto__c : true);
    n.innerHTML = taxTypeName
            + teasp.message.getLabel('tm10001590') // ：
            + '<span class="ts-currency">' + teasp.Tsf.Currency.formatMoney(tax, teasp.Tsf.Currency.V_YEN, false, true)
            + '</span> '
            + (taxAuto ? '' : teasp.message.getLabel('tm20001200')); // (手入力)
};

teasp.Tsf.ExpDetail.prototype.setStaticForeign = function(vobj){
    var n = teasp.Tsf.Dom.node('div.ts-row-foreign div.ts-foreign-div', this.getFormEl());
    if(n){
        var name   = (vobj.CurrencyName__c  || '');
        var rate   = (vobj.CurrencyRate__c  || '');
        var amount = (vobj.ForeignAmount__c || '');

        n.innerHTML = teasp.message.getLabel('tm20001171', // 通貨 [{0}]&nbsp;&nbsp;&nbsp;換算レート <span class="ts-currency">{1}</span>&nbsp;&nbsp;&nbsp;現地金額 <span class="ts-currency">{2}</span>
                name,
                teasp.util.currency.formatDecimal(rate  , teasp.constant.CU_DEC_POINT_MIN, teasp.constant.CU_DEC_POINT_MAX).str,
                teasp.util.currency.formatDecimal(amount, teasp.constant.CU_DEC_POINT_MIN, teasp.constant.CU_DEC_POINT_MAX, true).str
                );
    }
};

/**
 * 税抜金額入力値を取得
 *
 * @param {teasp.Tsf.ExpItem} expItem
 * @returns {number}
 */
teasp.Tsf.ExpDetail.prototype.getWithoutTaxValue = function(expItem){
    if(this.isReadOnly()){
        var withoutTax = this.orgData.values.WithoutTax__c;
        return withoutTax || null;
    }else{
        var pwout = this.getWithoutTaxNode();   // 税抜金額入力欄
        if(!pwout){
            return null;
        }
        var wout  = teasp.util.currency.string2number(pwout.value, expItem.isAllowMinus()); // 税抜金額
        return wout.num;
    }
};

/**
 * 税抜金額を入力欄にセット
 *
 * @param {number} val
 */
teasp.Tsf.ExpDetail.prototype.setWithoutTaxValue = function(val){
    var pwout = this.getWithoutTaxNode();   // 税抜金額入力欄
    pwout.value = teasp.Tsf.Currency.formatMoney(val, teasp.Tsf.Currency.V_YEN, false, true);
};

/**
 * 消費税入力値を取得
 *
 * @param {teasp.Tsf.ExpItem} expItem
 * @returns {number}
 */
teasp.Tsf.ExpDetail.prototype.getTaxValue = function(expItem){
    if(this.isReadOnly()){
        var tax = this.orgData.values.Tax__c;
        return tax || null;
    }else{
        var ptax = this.getTaxNode();          // 消費税入力欄
        var tax  = teasp.util.currency.string2number(ptax.value , expItem.isAllowMinus()); // 消費税
        return tax.num;
    }
};

/**
 * 消費税を入力欄にセット
 *
 * @param {number} val
 */
teasp.Tsf.ExpDetail.prototype.setTaxValue = function(val){
    var ptax = this.getTaxNode();          // 消費税入力欄
    ptax.value = teasp.Tsf.Currency.formatMoney(val, teasp.Tsf.Currency.V_YEN, false, true);
};

/**
 * 手入力ボタンの状態を返す
 *
 * @returns {boolean|null}
 */
teasp.Tsf.ExpDetail.prototype.isTaxAuto = function(){
    var n = teasp.Tsf.Dom.node('div.ts-row-tax button.ts-tax-auto');
    if(!n){
        return false;
    }else if(teasp.Tsf.Dom.hasClass(n, 'disabled')){
        return true;
    }
    var pushed = teasp.Tsf.Dom.hasClass(n, 'pushed');
    return !pushed;
};

/**
 * 手入力ボタンの状態をセット
 *
 * @param {boolean} taxAuto 消費税自動計算のオン/オフ
 * @param {boolean} flag =true:自動計算オンの場合、再計算する
 * @param {boolean=} focs =true:消費税手入力欄にフォーカスをセット
 * @returns {boolean|null}
 */
teasp.Tsf.ExpDetail.prototype.setTaxAuto = function(taxAuto, flag, focs){
    if(this.isReadOnly()){
        var n = teasp.Tsf.Dom.node('div.ts-row-tax div.ts-tax-auto');
        if(n){
            n.innerHTML = taxAuto ? '' : teasp.message.getLabel('tm20001200'); // (手入力)
        }
    }else{
        var n = teasp.Tsf.Dom.node('div.ts-row-tax button.ts-tax-auto');

        teasp.Tsf.Dom.toggleClass(n, 'pushed', !taxAuto);
        teasp.Tsf.Dom.toggleClass(n, 'enabled', taxAuto);

        var inp = teasp.Tsf.Dom.node('input.ts-tax-tax');
        if(inp){
            inp.disabled = taxAuto;
            if(!taxAuto && focs){
                inp.focus();
            }
        }
        if(taxAuto && flag){
            this.recalcTax((this.getTaxType() == 1 || this.cardConst) ? 0 : 1);
        }
    }
};

/**
 * 手入力ボタンクリック
 *
 * @param {Object} e
 */
teasp.Tsf.ExpDetail.prototype.clickTaxAuto = function(e){
    this.setTaxAuto(!this.isTaxAuto(), true, true);
    this.recalcAmountPerParticipants();
};

/**
 * 税入力エリアを表示
 *
 * @param flag
 */
teasp.Tsf.ExpDetail.prototype.displayTaxArea = function(flag){
    var table = teasp.Tsf.Dom.node('table.ts-tax-table', this.getFormEl());
    teasp.Tsf.Dom.query('div, input, button, select', table).forEach(function(el){
        if(!teasp.Tsf.Dom.hasClass(el, 'ts-tax-type')){
            teasp.Tsf.Dom.show(el, null, flag);
        }
    }, this);
};

teasp.Tsf.ExpDetail.prototype.changedForeignRate = function(el){
    if(el){
        var rate = this.getCurrentForeignRate();
        var rv = parseFloat(el.value || '0');
        this.setForeignRateTitle(el, (rv != rate.n ? teasp.message.getLabel('tm20004050') : null)); // この通貨の現在レートは表示レートと異なります
    }
};

teasp.Tsf.ExpDetail.prototype.setForeignRateTitle = function(el, msg){
    if(msg){
        dojo.setAttr(el, "title", msg);
        dojo.style(el, 'background-color', '#ffffe0');
    }else{
        dojo.removeAttr(el, "title");
        dojo.style(el, 'background-color', '#ffffff');
    }
};

/**
 * 金額入力欄（金額、税額、税抜金額、通貨名、換算レート、現地金額）変更時
 *
 * @param {Object} e
 */
teasp.Tsf.ExpDetail.prototype.changedCurrency = function(e){
    var expItem = this.getCurrentExpItem(); // 費目
    if(!expItem){
        return;
    }
    this.changedCurrencyAction(e.target, expItem);
};

/**
 * 金額入力欄（金額、税額、税抜金額、通貨名、換算レート、現地金額）変更時処理
 *
 * @param {Object} n 金額入力欄
 * @param {teasp.Tsf.ExpItem} expItem
 * @param {string=} val 入力欄にセットする値
 */
teasp.Tsf.ExpDetail.prototype.changedCurrencyAction = function(n, expItem, val){
    var taxFlag = null;
    var forFlag = null;
    var quaFlag = null;
    var parFlag = null;
    if(val !== undefined){
        n.value = val;
    }
    if(teasp.Tsf.Dom.hasClass(n, 'ts-tax-tax')){ // 消費税
        taxFlag = (this.cardConst || expItem.isEkitanType() ? 0 : 2); // カード読込の場合は、税抜金額が変わるようにする
        parFlag = 0;

    }else if(teasp.Tsf.Dom.hasClass(n, 'ts-tax-without-tax')){ // 税抜金額
        taxFlag = (this.cardConst ? 0 : 1); // カード読込の場合は、税抜金額は元の値にもどされるようにする
        parFlag = 0;

    }else if(teasp.Tsf.Dom.hasClass(n, 'ts-foreign-rate')){ // 換算レート
        forFlag = expItem.getRecalcTarget();
        this.changedForeignRate(n);

    }else if(teasp.Tsf.Dom.hasClass(n, 'ts-foreign-name')){ // 通貨名
        forFlag = (expItem.getCost() ? expItem.getRecalcTarget() : 0);

    }else if(teasp.Tsf.Dom.hasClass(n, 'ts-foreign-cost')){ // 現地金額
        forFlag = 2;

    }else if(teasp.Tsf.Dom.hasClass(n, 'ts-form-currency')
          || teasp.Tsf.Dom.hasClass(n, 'ts-form-number')){ // 金額、単価、数量
        if(expItem.isEnableQuantity()){
            quaFlag = 0;
        }
        if(expItem.isTaxFlag()){
            taxFlag = 0;
        }
        if(expItem.isForeignFlag()){
            forFlag = 0;
        }
        if(expItem.isInternalParticipants() || expItem.isExternalParticipants()){
            parFlag = 0;
        }
        var fc = this.fp.getFcById(n.id);
        if(fc.getApiKey() == 'UnitPrice__c'){ // 単価
            quaFlag = 1;
        }else if(fc.getApiKey() == 'Quantity__c'){ // 数量
            quaFlag = 2;
        }
    }
    if(quaFlag !== null){
        this.recalcCost(quaFlag, expItem);
    }
    if(taxFlag !== null || parFlag !== null){
        this.recalcTax(taxFlag, expItem, (val !== null));
    }
    if(forFlag !== null){
        this.recalcForeign(forFlag, expItem);
    }
    if(parFlag !== null){
        this.recalcAmountPerParticipants(expItem);
    }
    var o = this.getRouteData(expItem);
    if(teasp.Tsf.EmpExp.isSpice(o.item)){
        teasp.Tsf.Dom.show('.ts-spice', this.getFormEl(), true); // ICアイコン
        teasp.Tsf.Dom.show('.pp_ico_ekitan', this.getFormEl(), false); // 駅探アイコン
    }else{
        teasp.Tsf.Dom.show('.ts-spice', this.getFormEl(), false); // ICアイコン
        teasp.Tsf.Dom.show('.pp_ico_ekitan', this.getFormEl(), (o.transportType == '1')); // 駅探アイコン
    }
    teasp.Tsf.Dom.show('.ts-external', this.getFormEl(), teasp.Tsf.EmpExp.isExternalExpense(o.item)); // ICアイコン
    // 引数 val==='' の場合、入力欄の値が「\0」に変えられることがあるので、最後にセットし直す。
    if(val === ''){
        n.value = val;
    }
};

teasp.Tsf.ExpDetail.prototype.selectedDate = function(){
    this.changedDate();
};

teasp.Tsf.ExpDetail.prototype.getDate = function(){
    var date = this.fetchValueByApiKey('Date__c');
    var od = teasp.util.strToDate(date);
    if(od.failed){
        return null;
    }
    return od.datef;
};

/**
 * 日付を変更
 *
 * @param {Object} e
 */
teasp.Tsf.ExpDetail.prototype.changedDate = function(e){
    var date = this.getDate();
    if(this.memoryDate == date){
        return;
    }

    // ジョブ選択肢を再セット
    this.loadJobs(date);

    this.memoryDate = date;
    this.changeEkitanElements();
    if(!date){
        this.createExpItemTooltip(); // 費目のツールチップ更新
        return;
    }
    var expItem = this.getCurrentExpItem();
    if(!expItem){
        this.createExpItemTooltip(); // 費目のツールチップ更新
        return;
    }
    if(expItem.isForeignFlag()){ // 外貨入力オンの費目
        var n = this.getForeignRateNode();
        if(n){
            var rate = this.getCurrentForeignRate();
            n.value = rate.str;
            this.setForeignRateTitle(n);
            var fixc = expItem.getRecalcTarget(); // 金額と現地金額どちらを固定するか判定
            this.recalcForeign(fixc, expItem);
        }
    }
    if(expItem.isTaxFlag() || (expItem.isInternalParticipants() || expItem.isExternalParticipants() )){ // 税入力オンの費目
        var currentRate = this.getCurrentTaxRate();
        var rate = '' + expItem.getTaxRate(this.getDate(), currentRate);
        var n = teasp.Tsf.Dom.node('div.ts-row-tax select.ts-tax-rate');
        if(n && n.value != rate){
            this.setTaxRateIfNotContain(rate);
            n.value = rate;
           this.recalcTax(this.getTaxType() == 2 ? 1 : 0, expItem);
        }
    }
    this.recalcAmountPerParticipants(); //人数割再計算
    this.createExpItemTooltip(); // 費目のツールチップ更新
};

/**
 * 通貨名を変更
 *
 * @param {Object} e
 */
teasp.Tsf.ExpDetail.prototype.changedForeign = function(e){
    var n = this.getForeignRateNode();
    if(n){
        var rate = this.getCurrentForeignRate();
        n.value = rate.str;
        this.setForeignRateTitle(n);
        this.changedCurrency(e);
    }
};

/**
 * 選択中の通貨名を取得
 *
 */
teasp.Tsf.ExpDetail.prototype.getForeignNameValue = function(){
    var area = teasp.Tsf.Dom.node('div.ts-row-foreign', this.getFormEl());
    var select = teasp.Tsf.Dom.node('select.ts-foreign-name', area);
    if(select){
        return (select.selectedIndex >= 0 ? select.options[select.selectedIndex].text : null);
    }else{
        return (this.orgData.values.CurrencyName__c  || '');
    }
};

/**
 * 通貨名を入力欄にセット
 *
 */
teasp.Tsf.ExpDetail.prototype.setForeignNameValue = function(val){
    var area = teasp.Tsf.Dom.node('div.ts-row-foreign', this.getFormEl());
    var select = teasp.Tsf.Dom.node('select.ts-foreign-name', area);
    if(select){
        if(!val){
            select.value = '';
        }else{
            for(var i = 0 ; i < select.options.length ; i++){
                if(select.options[i].text == val){
                    select.selectedIndex = i;
                    break;
                }
            }
            if(i >= select.options.length){
                var option = this.getDomHelper().create('option', { value: val, innerHTML: val }, select);
                option.selected = true;
            }
        }
    }
};

/**
 * 換算レートを変更
 *
 * @param {Object} e
 */
teasp.Tsf.ExpDetail.prototype.getCurrentForeignRate = function(){
    var select = this.getForeignNameNode();
    var foreign = tsfManager.getForeignById(select ? select.value : '');
    var d = this.fetchValueByApiKey('Date__c') || teasp.util.date.formatDate(teasp.util.date.getToday());
    var rateV = foreign.getRateByDate(d); // 換算レートを取得
    var rate = teasp.util.currency.formatDecimal(rateV , teasp.constant.CU_DEC_POINT_MIN, teasp.constant.CU_DEC_POINT_MAX); // 換算レート
    return rate;
};

/**
 * 換算レート入力値を取得
 *
 * @param {boolean=} flag 空欄の場合にデフォルトを取らない
 */
teasp.Tsf.ExpDetail.prototype.getForeignRate = function(flag){
    var prate = this.getForeignRateNode();   // 換算レート入力欄
    var rate = teasp.util.currency.formatDecimal(prate ? prate.value : (this.orgData.values.CurrencyRate__c  || ''));
    if(!flag && rate.str == ''){ // 空欄の場合、デフォルトのレートを得る
        rate = this.getCurrentForeignRate();
    }
    return rate;
};

/**
 * 換算レートを入力欄にセット
 *
 */
teasp.Tsf.ExpDetail.prototype.setForeignRateValue = function(val){
    var prate = this.getForeignRateNode();   // 換算レート入力欄
    if(prate){
        prate.value = teasp.util.currency.formatDecimal(val, teasp.constant.CU_DEC_POINT_MIN, teasp.constant.CU_DEC_POINT_MAX).str;
    }
};

/**
 * 現地金額入力値を取得
 *
 * @param {teasp.Tsf.ExpItem} expItem
 * @returns {number}
 */
teasp.Tsf.ExpDetail.prototype.getForeignAmountValue = function(expItem){
    var pamount = this.getForeignCostNode();   // 現地金額入力欄
    var amount = teasp.util.currency.formatDecimal((pamount ? pamount.value : (this.orgData.values.ForeignAmount__c || '')), 0, teasp.constant.CU_DEC_POINT_MAX, expItem.isAllowMinus());
    return amount.n;
};

/**
 * 現地金額を入力欄にセット
 *
 * @param {number} val
 */
teasp.Tsf.ExpDetail.prototype.setForeignAmountValue = function(val){
    var pamount = this.getForeignCostNode();   // 現地金額入力欄
    if(pamount){
        pamount.value = teasp.util.currency.formatDecimal(val, teasp.constant.CU_DEC_POINT_MIN, teasp.constant.CU_DEC_POINT_MAX, true).str;
    }
};

/**
 * 消費税計算
 *
 * @param {number} flag  変更した項目 0:金額 1:税抜金額 2:消費税
 * @param {teasp.Tsf.ExpItem} _expItem 費目オブジェクト
 * @param {boolean=} costFlag trueなら、金額が0円のとき、空欄にしない。
 */
teasp.Tsf.ExpDetail.prototype.recalcTax = function(flag, _expItem, costFlag) {
    var expItem = _expItem || this.getCurrentExpItem();
    if(!expItem){
        return;
    }
    var taxType      = this.getTaxType();         // 税タイプ
    var allowMinus   = expItem.isAllowMinus();       // マイナス可
    var taxRoundFlag = tsfManager.getTaxRoundFlag(); // 端数処理
    var taxAuto      = this.isTaxAuto();             // 手入力ボタン
    var taxRate      = this.getCurrentTaxRate(this.getDate());     // 税率

    var cost       = this.getCostValue(expItem);        // 金額
    var withoutTax = this.getWithoutTaxValue(expItem);  // 税抜金額
    var tax        = this.getTaxValue(expItem);         // 税

    var o = teasp.Tsf.ExpDetail.calcTax(cost, withoutTax, tax, flag, taxType, taxRate, taxAuto, taxRoundFlag, allowMinus);

    this.setCostValue(o.cost, (costFlag ? false : true));
    this.setWithoutTaxValue(o.withoutTax);
    this.setTaxValue(o.tax);
};

/**
 * 消費税計算
 *
 * @param {number} cost 金額
 * @param {number} withoutTax 税抜金額
 * @param {number} tax 消費税
 * @param {number} flag 変更した項目 0:金額 1:税抜金額 2:消費税
 * @param {number} taxType 税タイプ 1:内税 2:外税 0:無税
 * @param {number} taxRate 税率
 * @param {boolean} taxAuto 税手入力
 * @param {number} taxRoundFlag 税計算端数処理
 * @param {boolean} allowMinus マイナス可
 * @returns {Object}
 */
teasp.Tsf.ExpDetail.calcTax = function(cost, withoutTax, tax, flag, taxType, taxRate, taxAuto, taxRoundFlag, allowMinus) {
    if(!taxType){
        return {
            cost        : cost,
            tax         : 0,
            withoutTax  : cost
        };
    }
    if(!flag){ // 金額が変更された
        var n = cost;
        var mflag = (n < 0) ? -1 : 1;
        n = Math.abs(n);
        if(taxAuto){
            if(taxType == '0'){ // 無税
                tax        = 0;
                withoutTax = cost;
            }else{
                tax = teasp.Tsf.ExpDetail.getTax(1, taxRate, taxRoundFlag, n);
                withoutTax = n - tax;
                tax        *= mflag;
                withoutTax *= mflag;
            }
        }else{ // 消費税手入力
            tax = Math.abs(tax);
            if(n < tax){ // 税額が金額より多い場合、税額を強制で金額と同値にする
                tax = n;
            }
            withoutTax = n - tax;
            tax        *= mflag;
            withoutTax *= mflag;
        }
    }else if(flag == 1){ // 税抜金額が変更された（税タイプ＝外税の時だけ）
        var mflag = (withoutTax < 0) ? -1 : 1;
        var n = Math.abs(withoutTax);
        if(taxAuto){
            var _cost = Math.abs(cost);
            var _tax = teasp.Tsf.ExpDetail.getTax(1, taxRate, taxRoundFlag, _cost); // 今の金額の内税を計算
            if(n == (_cost - _tax)){ // 今の税抜金額が内税計算による値と同じなら再計算は行わない
                tax = _tax;
            }else{
                tax = teasp.Tsf.ExpDetail.getTax(2, taxRate, taxRoundFlag, n); // 税額を計算
            }
        }
        cost = (n + Math.abs(tax)) * mflag;
        tax  = Math.abs(tax) * mflag;
    }else if(flag == 2){ // 税額が変更された
        var mflag = (tax < 0) ? -1 : 1;
        var n = Math.abs(tax);
        var m = Math.abs(cost);
        if(taxType == 1){ // 内税
            if(n > m){ // 金額より多い税額が入力されたら税額を強制で金額と同値にする
                n = m;
            }
            withoutTax = m - n;
        }else{ // 外税
            m = Math.abs(withoutTax) + n;
        }
        tax         = n * mflag;
        cost        = m * mflag;
        withoutTax  = Math.abs(withoutTax) * mflag;
    }
    return {
        cost        : cost,
        tax         : tax,
        withoutTax  : withoutTax
    };
};

/**
 * 内税・外税計算により消費税分を導き出す
 *
 * @param {number} taxType      税の種類 1.内税 2.外税 0.消費税無し
 * @param {number} taxRate      税率(5%＝5)
 * @param {number} fractionType 税率計算タイプ 0.四捨五入 1.切り捨て 2.切り上げ
 * @param {number} targetCalc   計算対象(数値化済みnumber)　内税:('empExpCost' + rowIndex)value　外税:('empExpWithoutTax' + rowIndex).value
 * @return {number} 計算された消費税分の数字が返る
 *
 * @author cmpArai
 */
teasp.Tsf.ExpDetail.getTax = function(taxType, taxRate, fractionType, targetCalc) {
    var resultTax = 0;
    switch (taxType) {
    case 1:// 内税;
        switch (fractionType) {
        case 2: resultTax = Math.ceil (targetCalc * taxRate / (100 + taxRate)); break; // 切り上げ
        case 1: resultTax = Math.floor(targetCalc * taxRate / (100 + taxRate)); break; // 切り捨て
        case 0: resultTax = Math.round(targetCalc * taxRate / (100 + taxRate)); break; // 四捨五入
        }
        break;
    case 2:// 外税
        switch (fractionType) {
        case 2: resultTax = Math.ceil (targetCalc * taxRate / 100); break; // 切り上げ
        case 1: resultTax = Math.floor(targetCalc * taxRate / 100); break; // 切り捨て
        case 0: resultTax = Math.round(targetCalc * taxRate / 100); break; // 四捨五入
        }
        break;
    case 0:
        resultTax = 0;
        break;
    }
    return resultTax;
};

/**
 * 外貨計算
 * @param {number} flag  変更した項目 0:金額 1:レート 2:現地金額
 * @param {teasp.Tsf.ExpItem} expItem 費目オブジェクト
 * @param {number=} famount 標準の現地金額
 */
teasp.Tsf.ExpDetail.prototype.recalcForeign = function(flag, expItem, famount, allup) {
    var allowMinus = expItem.isAllowMinus();       // マイナス可
    var rate   = this.getForeignRate();
    var amount = famount || this.getForeignAmountValue(expItem);
    var cost   = this.getCostValue(expItem);

    if(flag != 2 && expItem.getCurrencyName() && expItem.isFixAmount() && !expItem.isEkitanType()){
        flag = 2;
    }

    var o = teasp.Tsf.ExpDetail.calcForeign(cost, rate.n, amount, flag, ((rate.sn1 != '0' && rate.n != 1) ? 1 : 0), allowMinus);

    if(flag || allup){
        this.setCostValue(o.cost, true);
        if(expItem.isEnableQuantity()) {    // 数量が入力可能である場合
            //　単価を計算する
            var quantity  = this.getQuantityValue() || 1;
            var unitPrice = teasp.util.currency.formatDecimal(o.cost / quantity, 0, 0, allowMinus).n;
            this.setUnitPriceValue(unitPrice)
        }
    }
    if(flag != 2 || allup){
        this.setForeignAmountValue(o.amount);
    }
    if(flag != 1 || allup){
        this.setForeignRateValue(o.rate);
    }
};

/**
 * 外貨計算
 *
 * @param {number} cost 金額
 * @param {number} rate 換算レート
 * @param {number} amount 現地金額
 * @param {number} flag 変更した項目 0:金額 1:レート 2:現地金額
 * @param {number} pardon 誤差許容範囲
 * @param {boolean} allowMinus マイナス可
 * @returns {Object}
 */
teasp.Tsf.ExpDetail.calcForeign = function(cost, rate, amount, flag, pardon, allowMinus) {
    var tmpCost   = cost;
    var tmpAmount = amount;

    if(flag != 2){ // 現地金額以外が変更された
        tmpCost   = (new Decimal(rate).times(amount)).toNumber();
        tmpAmount = (!rate ? 0 : (new Decimal(cost).div(rate)).toNumber()); // 現地金額を計算で得る
    }

    var newCost = (new Decimal(rate).times(tmpAmount)).toNumber(); // 金額を再計算
    if(Math.abs(newCost) < teasp.constant.CU_DEC_MIN_VALUE){ // 扱える最小値より小さい場合は 0 にする。
        newCost = 0;
    }
    if(Math.abs(newCost) > teasp.constant.CU_TOTAL_UPPER_LIMIT){ // 扱える最大値より大きい場合は 0 にする。
        newCost = 0;
    }

    // 前の金額と再計算した金額の差が誤差許容範囲を超えた場合のみ値を更新
    if(Math.abs(newCost - tmpCost) > pardon || newCost == Math.floor(newCost)){
        cost   = teasp.util.currency.formatDecimal(newCost, 0, 0, allowMinus).n;
        amount = tmpAmount;
    }
    return {
        cost    : cost,     // 金額
        rate    : rate,     // 換算レート
        amount  : amount    // 現地金額
    };
};

/**
 * 金額計算（単価×数量）
 *
 * @param flag
 * @param expItem
 * @param {boolean=} costFlag trueなら、金額が0円でも、空欄にしない。
 */
teasp.Tsf.ExpDetail.prototype.recalcCost = function(flag, expItem, costFlag) {
    var allowMinus = expItem.isAllowMinus();       // マイナス可
    var unitPrice = this.getUnitPriceValue(expItem) || 0;
    var quantity  = this.getQuantityValue() || 0;

    if(flag){ // 単価または数量を変更した場合のみ
        var cost = teasp.util.currency.formatDecimal(unitPrice * quantity, 0, 0, allowMinus).n;
        this.setCostValue(cost, (costFlag ? false : true));
        this.setUnitPriceValue(unitPrice);
        this.setQuantityValue(quantity);
    }
};

/**
 * 発駅名変更
 *
 * @param {Object} e
 */
teasp.Tsf.ExpDetail.prototype.changeEkitanElements = function(e){
    var o = this.getRouteData(this.getCurrentExpItem());
    if(teasp.Tsf.EmpExp.isSpice(o.item)){
        teasp.Tsf.Dom.show('.ts-spice', this.getFormEl(), true); // ICアイコン
        teasp.Tsf.Dom.show('.pp_ico_ekitan', this.getFormEl(), false); // 駅探アイコン
    }else{
        teasp.Tsf.Dom.show('.ts-spice', this.getFormEl(), false); // ICアイコン
        teasp.Tsf.Dom.show('.pp_ico_ekitan', this.getFormEl(), (o.transportType == '1')); // 駅探アイコン
    }
    teasp.Tsf.Dom.show('.ts-external', this.getFormEl(), teasp.Tsf.EmpExp.isExternalExpense(o.item)); // ICアイコン
};

teasp.Tsf.ExpDetail.prototype.getStoreFrom = function(){
    if(!this.storeFrom){
        this.storeFrom = teasp.Tsf.Dom.createStoreMemory(tsfManager.getStationFromHist()); // 発駅名候補
    }
    return this.storeFrom;
};

teasp.Tsf.ExpDetail.prototype.getStoreTo = function(){
    if(!this.storeTo){
        this.storeTo = teasp.Tsf.Dom.createStoreMemory(tsfManager.getStationToHist()); // 着駅名候補
    }
    return this.storeTo;
};

/**
 * 片道/往復を取得
 *
 */
teasp.Tsf.ExpDetail.prototype.isRoundTrip = function(){
    return teasp.Tsf.Dom.hasClass(this.getRoundTripNode(), 'pp_btn_round');
};

/**
 * 片道/往復ボタンをクリックした
 *
 */
teasp.Tsf.ExpDetail.prototype.clickRoundTrip = function(e){
    var roundTrip = !this.isRoundTrip();
    this.setRoundTripIcon(roundTrip);
    var expItem = this.getCurrentExpItem();

    if(expItem.isEnableQuantity()){ // 数量あり
        var up = this.getUnitPriceValue(expItem);
        up = Math.round(roundTrip ? (up * 2) : (up / 2));
        this.setUnitPriceValue(up); // 単価を変更
        var q = this.getQuantityValue() || 0;
        this.setCostValue(up * q); // 再計算した金額に変更
    }else{
        var cost = this.getCostValue(expItem);
        this.setCostValue(Math.round(roundTrip ? (cost * 2) : (cost / 2)));
    }

    this.changeEkitanElements();

    if(expItem.isTaxFlag()){
        this.recalcTax(0, expItem);
    }else if(expItem.isForeignFlag()){
        this.recalcForeign(0, expItem);
    }
};

/**
 * 片道/往復アイコンを切り替え
 *
 * @param {boolean} flag
 */
teasp.Tsf.ExpDetail.prototype.setRoundTripIcon = function(flag){
    var n = this.getRoundTripNode();
    teasp.Tsf.Dom.toggleClass(n, 'pp_btn_oneway', !flag);
    teasp.Tsf.Dom.toggleClass(n, 'pp_btn_round' ,  flag);
};

/**
 * カレンダー表示を呼び出す
 *
 * @param {boolean} flag
 */
teasp.Tsf.ExpDetail.prototype.showCalendar = function(){
    var inp = this.fp.getElementByApiKey('Date__c', null, this.getFormEl());
    var row = teasp.Tsf.Dom.getAncestorByCssName(inp, 'ts-form-row');
    var btn = teasp.Tsf.Dom.node('button.ts-form-cal', row);
    if(btn){
        teasp.Tsf.Dom.pushEvent(btn, 'onclick');
    }
};

/**
 * 駅探検索ボタンクリック
 *
 * @param {Object} e
 */
teasp.Tsf.ExpDetail.prototype.searchRoute = function(e){
    var expItem = this.getCurrentExpItem();
    var date = this.fetchValueByApiKey('Date__c');
    if(!date){
        this.showCalendar();
        return;
    }
    // 引数を作成
    var req = teasp.Tsf.util.mixin({
        date            : date,
        readonly        : this.isReadOnly(),
        fixed           : false,
        stationFromHist : tsfManager.getStationFromHist(),
        stationToHist   : tsfManager.getStationToHist(),
        config          : tsfManager.getEmpExpConfig(date)
    }, this.getRouteData(expItem));

    // 駅探検索ダイアログ
    tsfManager.dialogOpen('ExpSearch', req, null, this, function(res) {
        var vobj = this.orgData.values;
        var o = {
            startName   : res.searchKey.stationFrom.name,
            startCode   : res.searchKey.stationFrom.code,
            endName     : res.searchKey.stationTo.name,
            endCode     : res.searchKey.stationTo.code,
            cost        : res.route.fare * (res.roundTrip ? 2 : 1),
            roundTrip   : res.roundTrip,
            route       : dojo.toJson(res)
        };
        dijit.byId("DlgExpDetailStFrom").setValue(o.startName); // 発駅
        dijit.byId("DlgExpDetailStTo"  ).setValue(o.endName);   // 着駅
        this.setRoundTripIcon(o.roundTrip); // 片道/往復
        this.setValueByApiKey('Cost__c', teasp.Tsf.Currency.formatMoney(o.cost, teasp.Tsf.Currency.V_YEN, false, true)); // 金額
        vobj.startCode__c = o.startCode;
        vobj.startName__c = o.startName;
        vobj.endCode__c   = o.endCode;
        vobj.endName__c   = o.endName;
        vobj.Route__c     = o.route;
        vobj._date        = this.fetchValueByApiKey('Date__c'); // 利用日控
        vobj.Item__c = ((vobj.ExternalICExpenseId__r
            && vobj.ExternalICExpenseId__r.UsageDate__c == vobj._date
            && vobj.ExternalICExpenseId__r.Amount__c == o.cost) ? teasp.Tsf.ITEM_EXTERNAL : null); // IC経費連携の参照があり利用日・金額が変わってなければIC交通費、それ以外はクリア

        vobj.TransportType__c = '1'; // 交通費種別=駅探検索
        teasp.Tsf.Dom.show('.ts-spice', this.getFormEl(), false); // ICアイコン
        teasp.Tsf.Dom.show('.ts-external', this.getFormEl(), teasp.Tsf.EmpExp.isExternalExpense(vobj.Item__c)); // ICアイコン
        teasp.Tsf.Dom.show('.pp_ico_ekitan', this.getFormEl(), true); // 駅探アイコン

        var expItem = this.getCurrentExpItem();
        if(expItem.isTaxFlag()){
            this.recalcTax(0, expItem);
        }else if(expItem.isForeignFlag()){
            this.recalcForeign(0, expItem);
        }
        var sh = [];
        sh.unshift({ name: o.startName, code: o.startCode });
        sh.unshift({ name: o.endName  , code: o.endCode   });
        tsfManager.setExpHistory(sh, o.route);
    });
};

teasp.Tsf.ExpDetail.prototype.ekitanSetting = function(){
    this.escapeSf1();
    tsfManager.showDialog('EkitanSetting', { ro: this.isReadOnly() });
};

/**
 * 選択行の入力済みの情報を集める
 *
 * @returns {Object}
 */
teasp.Tsf.ExpDetail.prototype.getRouteData = function(expItem){
    var o = {
        startCode       : null,
        startName       : null,
        endCode         : null,
        endName         : null,
        roundTrip       : false,
        transportType   : (expItem ? expItem.getTransportType() : '0'),
        route           : null,
        item            : null
    };
    var vobj = this.orgData.values;
    if(o.transportType != '0'){
        o.startName       = vobj.startName__c;
        o.endName         = vobj.endName__c;
        o.roundTrip       = vobj.roundTrip__c;
        o.item            = vobj.Item__c;
        if(o.transportType == '1'){
            o.startCode   = vobj.startCode__c;
            o.endCode     = vobj.endCode__c;
            o.route       = vobj.Route__c;
        }else if(teasp.Tsf.EmpExp.isUber(o.item)){
            o.route       = this.fetchValueByApiKey('Route__c');
        }
    } else {
        // 出張手配明細またはIC交通費
        if(vobj.Item__c == 'JTB' || vobj.Item__c == teasp.Tsf.ITEM_EXTERNAL) {
            o.item = vobj.Item__c;
        }
    }
    var z = (o.route ? teasp.Tsf.util.fromJson(o.route) : null);
    o.stationVia = (z && z.searchKey && z.searchKey.stationVia) || [];
    o.transfer   = (z && z.searchKey && z.searchKey.transfer) || false;
    o.cost       = (z && z.route && z.route.fare) || 0;
    if(vobj.TransportType__c == '2'){
        o.route = null;
    }

    if(!this.isReadOnly()){
        var date  = this.fetchValueByApiKey('Date__c');
        var cost  = this.fetchValueByApiKey('Cost__c');
        var _date = vobj._date;
        var _cost = vobj._cost;

        if(vobj.ExternalICExpenseId__r){ // 経費連携の参照がある場合、参照先の利用日と金額に一致しない場合、ICアイコンを消す
            var usageDate = null, amount = null;
            if(typeof(vobj.ExternalICExpenseId__r.UsageDate__c) == 'string'){
                usageDate = vobj.ExternalICExpenseId__r.UsageDate__c;
            }
            if(typeof(vobj.ExternalICExpenseId__r.Amount__c) == 'number'){
                amount = '' + vobj.ExternalICExpenseId__r.Amount__c;
            }
            o.item = (date == usageDate && cost == amount) ? teasp.Tsf.ITEM_EXTERNAL : null;
        }else if(teasp.Tsf.EmpExp.isSpice(o.item) && (date != _date || cost != _cost)){
            // spice or 経費連携の入力で、日付または金額が変更された場合は、spice 無効化
            o.item = null;
        }
        if(o.transportType != '0'){
            var sn = dijit.byId("DlgExpDetailStFrom").getValue(); // 発駅
            var en = dijit.byId("DlgExpDetailStTo"  ).getValue(); // 着駅
            // spice 入力で、発駅または着駅が変更された場合は、spice 無効化
            if(teasp.Tsf.EmpExp.isSpice(o.item) && (o.startName != sn || o.endName != en)){
                o.item = null;
            }
            var changed = false;
            if(o.startName != sn){
                o.startCode = null;
                o.startName = sn;
                changed = true;
            }
            if(o.endName != en){
                o.endCode = null;
                o.endName = en;
                changed = true;
            }
            o.roundTrip = this.isRoundTrip();
            if(o.transportType == '1'){
                if(o.cost && o.roundTrip){
                    o.cost *= 2;
                }
                if(changed || !o.route || o.cost != this.getCostValue(expItem) || date != _date){
                    o.transportType = '2';    // 駅探検索した交通費ではない
                }
            }
        }
    }
    return o;
};

/**
 * 支払種別変更
 * @param {Object} e
 */
teasp.Tsf.ExpDetail.prototype.changedPayType = function(e){
    var payeeType = e.target.value;
    var payOn = (payeeType != '1'); // 本人立替以外
    var formEl = this.getFormEl();
    teasp.Tsf.Dom.show('.ts-row-payee', formEl, payOn);  // 支払日、支払先名入力欄の表示/非表示切り替え
    teasp.Tsf.Dom.show('.ts-row-invoiceURL', formEl, (payeeType == '2'));  // 請求書URL入力欄の表示/非表示切り替え
    // 支払先の情報をクリア
    var n1 = this.fp.getElementByApiKey('PayeeId__c'               , formEl); // 支払先ID
    var n2 = this.fp.getElementByApiKey('PayeeId__r.PayeeType__c'  , formEl); // 支払種別
    var n3 = this.fp.getElementByApiKey('PayeeId__r.Name'          , formEl); // 支払先名
    var n4 = this.fp.getElementByApiKey('PayeeId__r.ExpenseType__c', formEl); // 支払先精算区分
    if(n1){ n1.value = ''; };
    if(n2){ n2.value = ''; };
    if(n3){ n3.value = ''; };
    if(n4){ n4.value = ''; };
    var icon = teasp.Tsf.Dom.node('.ts-payment-icon', teasp.Tsf.Dom.byId(this.dialog.id));
    if(icon){
        teasp.Tsf.Dom.toggleClass(icon, 'pp_ico_bill' , (payeeType == '2'));
        teasp.Tsf.Dom.toggleClass(icon, 'pp_ico_card1', (payeeType == '3'));
    }
    this.checkMatching();
};

/**
 * ジョブ変更
 * @param e
 */
teasp.Tsf.ExpDetail.prototype.changedJob = function(e){
    var job = this.getCurrentJob();
    var el = this.fp.getElementByApiKey('JobId__c', null, this.getFormEl()); // ジョブ選択プルダウン
    var d = teasp.Tsf.Dom.nextSibling(el);
    if(d && d.tagName == 'INPUT'){ d.value = (job && job.getName() || ''); }
    el = this.fp.getElementByApiKey('JobId__r.JobCode__c'  , null, this.getFormEl());
    if(el){ el.value = (job && job.getCode()      || ''); }
    el = this.fp.getElementByApiKey('JobId__r.StartDate__c', null, this.getFormEl());
    if(el){ el.value = (job && job.getStartDate() || ''); }
    el = this.fp.getElementByApiKey('JobId__r.EndDate__c'  , null, this.getFormEl());
    if(el){ el.value = (job && job.getEndDate()   || ''); }
    this.checkMatching();
};

/**
 * 負担部署変更
 * @param e
 */
teasp.Tsf.ExpDetail.prototype.changedChargeDept = function(e){
    var chargeDept = this.getCurrentChargeDept();
    var el = this.fp.getElementByApiKey('ChargeDeptId__c', null, this.getFormEl()); // 負担部署選択プルダウン
    var d = teasp.Tsf.Dom.nextSibling(el);
    if(d && d.tagName == 'INPUT'){ d.value = (chargeDept && chargeDept.Name || ''); }
    // 費目選択リストを更新
    this.expItemFilter.deptExpItemClass = (chargeDept && chargeDept.ExpItemClass__c || null);
    this.refreshExpItems();
};

teasp.Tsf.ExpDetail.prototype.setAttachmentExist = function(expLogId, flag){
    var id = this.fp.getFcByApiKey('Id').fetchValue().value;
    if(id == expLogId){
        teasp.Tsf.EmpExp.setAttachmentExist2(this.getDomHelper(), this.getFormEl(), this.orgData.values, flag);
    }
};

teasp.Tsf.ExpDetail.prototype.showError = function(result){
    var er = teasp.Tsf.Dom.node('.ts-error-area', teasp.Tsf.Dom.byId(this.dialog.id));
    teasp.Tsf.Error.showError(result, er);
};

/**
 * 現在の入力項目を取得＆バリデーション（エラーメッセージ表示）
 */
teasp.Tsf.ExpDetail.prototype.getCurrentValue = function(){
    this.showError(); // エラー表示欄を非表示に

    var expItem = this.getCurrentExpItem(); // 費目
    if(!expItem){
        this.showError(teasp.message.getLabel('tf10001680')); // 費目を選択してください
        return null;
    }

    var vobj = this.orgData.values || {};
    this.fp.fcLoop(function(fc){
        if(fc.isApiField(true) || fc.getApiKey() == '_temp_attach'){
            fc.fillValue(vobj, fc.fetchValue());
        }else if(fc.getApiKey() == '_tax'){     // 消費税エリア
            vobj.TaxAuto__c    = this.isTaxAuto();                 // 税手入力
            vobj.TaxRate__c    = this.getCurrentTaxRate();         // 税率
            vobj.TaxType__c    = '' + (expItem.getTaxType() || '0');    // 税タイプ
            vobj.Tax__c        = '' + this.getTaxValue(expItem);        // 消費税
            vobj.WithoutTax__c = '' + this.getWithoutTaxValue(expItem); // 税抜金額
        }else if(fc.getApiKey() == '_foreign' && expItem.isForeignFlag()){     // 外貨関連項目は外貨利用する費目の場合のみ計算
            vobj.CurrencyName__c  = this.getForeignNameValue();          // 税手入力
            vobj.CurrencyRate__c  = '' + this.getForeignRate().n;             // 税率
            vobj.ForeignAmount__c = '' + this.getForeignAmountValue(expItem); // 税タイプ
        }
    }, this);
    if(vobj.JobId__c && this.jobPool[vobj.JobId__c]){
        vobj.JobId__r = this.jobPool[vobj.JobId__c];
    }

    // 支払い種別
    var payFc = this.fp.getFcByApiKey('_payment');
    var payType = '1';
    if(payFc.isReadOnly()){
        payType = (vobj.PayeeId__r && vobj.PayeeId__r.PayeeType__c) || '1';
    }else{
        var select = teasp.Tsf.Dom.node('select.ts-payment-select', this.getFormEl());
        if(!select.options.length){
            payType = null;
        }else{
            payType = select.value;
        }
    }

    if(vobj.Cost__c === null || vobj.Cost__c == ''){
        this.showError(teasp.message.getLabel('tm20004270')); // 金額を入力してください
        return null;
    }
    if(payType === null){
        this.showError(teasp.message.getLabel('tf10001840', payFc.getLabel())); // 支払種別を入力してください
        return null;
    }

    // 経路情報は入力欄の値をセット
    var route = this.getRouteData(expItem);
    vobj.startCode__c        = route.startCode;
    vobj.startName__c        = route.startName;
    vobj.endCode__c          = route.endCode;
    vobj.endName__c          = route.endName;
    vobj.roundTrip__c        = route.roundTrip;
    vobj.Route__c            = route.route;
    vobj.TransportType__c    = route.transportType;
    vobj.Item__c             = route.item;

    // 領収書有無は費目設定で固定
    vobj.Receipt__c = expItem.isReceipt();

    // 支払種別
    vobj.PayeeId__r = vobj.PayeeId__r || {};
    vobj.PayeeId__r.PayeeType__c = payType;

    // 日付
    var od = teasp.util.strToDate(vobj.Date__c);
    if(od.failed){
        this.showError(dojo.replace(od.tmpl, [teasp.message.getLabel('tf10000940')])); // 利用日
        return null;
    }
    var tt = vobj.TransportType__c;
    if(tt != '0' && (!vobj.startName__c || !vobj.endName__c)){
        this.showError(teasp.message.getLabel('tm20004260')); // 出発と到着を入力してください
        return null;
    }
    // 単価・数量
    if(expItem.isEnableQuantity()){
        var up   = this.getUnitPriceValue(expItem);
        var q    = this.getQuantityValue() || 0;
        var cost = this.getCostValue(expItem);
        var c = up * q;
        if(Math.abs(c) > teasp.constant.CU_TOTAL_UPPER_LIMIT){
            this.showError(teasp.message.getLabel('tf10001780')); // 単価×数量の値が大きすぎて扱えません。
            return null;
        }
        if(cost != (up * q)){
            this.showError(teasp.message.getLabel('tf10001790')); // 単価×数量が金額と合いません。
            return null;
        }
    }else{
        vobj.UnitPrice__c = null;
        vobj.Quantity__c = null;
    }
    // 税入力
    if(!expItem.isTaxFlag()){ // 税入力なし
        vobj.TaxAuto__c     = true;
        vobj.TaxRate__c     = null;
        vobj.TaxType__c     = null;
        vobj.Tax__c         = null;
        vobj.WithoutTax__c  = this.getWithoutTaxValue(expItem); //入力なしの場合でも、数式項目の計算用に保持
    }else if(expItem.getTaxType() == '0'){ // 税入力する＋無税
        vobj.TaxAuto__c     = true;
        vobj.TaxRate__c     = null;
        vobj.TaxType__c     = '0';
        vobj.Tax__c         = 0;            // 消費税額
        vobj.WithoutTax__c  = vobj.Cost__c; // 税抜金額
    }else{
        var cost       = this.getCostValue(expItem);        // 金額
        var withoutTax = this.getWithoutTaxValue(expItem);  // 税抜金額
        var tax        = this.getTaxValue(expItem);         // 税
        if(cost != (withoutTax + tax)){
            this.showError(teasp.message.getLabel('tf10008270')); // 税抜金額と消費税額の合計と金額が一致しません。
            return null;
        }
    }
    // 外貨入力
    if(expItem.isForeignFlag()){
        if(!vobj.CurrencyName__c || vobj.CurrencyName__c == teasp.Tsf.ForeignCurrency.NONE){
            this.showError(teasp.message.getLabel(!this.cardConst ? 'tm20004280' : 'tf10002060')); // 通貨名を指定してください or 通貨名が入力されていません。
            return null;
//        }else{
//            var foreign = tsfManager.getForeignByName(vobj.CurrencyName__c);
//            if(!foreign){
//                this.showError(teasp.message.getLabel('tf10003690', vobj.CurrencyName__c)); // 通貨記号 {0} は外貨一覧に登録されていません。
//                return null;
//            }
        }
        var rate   = this.getForeignRate();
        var amount = this.getForeignAmountValue(expItem);
        var c = amount * rate.n; // 金額を再計算
        if(Math.abs(c) > teasp.constant.CU_TOTAL_UPPER_LIMIT){
            this.showError(teasp.message.getLabel('tf10001800')); // 換算レート×現地金額の値が大きすぎて扱えません。
            return null;
        }
        var cost = this.getCostValue(expItem);        // 金額
        c -= cost;
        if(Math.abs(c) > 1){
            this.showError(teasp.message.getLabel('tf10008280')); // 換算レート×現地金額と金額に開きがあります。
            return null;
        }
    }
    // 外貨利用費目ではない場合、外貨項目をクリアする(カード読込データ除く)
    else if(!this.cardConst){
        vobj.CurrencyName__c  = null;
        vobj.CurrencyRate__c  = null;
        vobj.ForeignAmount__c = null;
    }

    // 発行者(店名)
    // 領収書必要な費目 & 発行者店名が入力されていない & 事前申請じゃない& スキャナ保存オプションがオンのときエラー
    const hasErrorPublisher = expItem.isReceipt() && !vobj.Publisher__c && !this.orgData.pre && tsfManager.isUseScannerStorage()
    if(hasErrorPublisher){
        this.showError(teasp.message.getLabel('ex00000130')); // 発行者（店名）を入力してください。
        return null;
    }
    // ジョブ
    var requireChargeJob = expItem.isRequireChargeJob();
    if(requireChargeJob == 2 && !vobj.JobId__c){
        this.showError(teasp.message.getLabel('tf10001710')); // ジョブを入力してください
        return null;
    }
    if(requireChargeJob > 0){
        var job = this.getCurrentJob();
        if(job && !job.activeOnDate(vobj.Date__c)){
            this.showError(teasp.message.getLabel('tf10001810')); // 利用日とジョブの有効期間が整合しません。
            return null;
        }
    }else{
        vobj.JobId__c = null;
        vobj.JobId__r = null;
    }
    // 負担部署
    var requireChargeDept = tsfManager.isRequireChargeDept();
    if(requireChargeDept == 2 && !vobj.ChargeDeptId__c){
        this.showError(teasp.message.getLabel('tf10006030')); // 負担部署を入力してください
        return null;
    }
    if(requireChargeDept > 0){
        vobj.ChargeDeptId__r = tsfManager.getInfo().getCacheDept(vobj.ChargeDeptId__c);
    }else{
        vobj.ChargeDeptId__c = null;
        vobj.ChargeDeptId__r = null;
    }
    // 支払先
    if(payType == '2' || payType == '3'){
        if(!vobj.PayeeId__r || !vobj.PayeeId__r.Name){
            this.showError(teasp.message.getLabel('tf10001720')); // 支払先名を入力してください。
            return null;
        }
    }else if(!this.cardConst){ // カード読込のデータではない
        vobj.PayeeId__c      = null;
        vobj.PayeeId__r      = null;
        vobj.PaymentDate__c  = null;
    }
     // 支払日
    if(vobj.PaymentDate__c){
        var objDate = teasp.util.strToDate(vobj.PaymentDate__c);
        if(objDate.failed){
            this.showError(dojo.replace(objDate.tmpl, [teasp.message.getLabel('tf10000590')])); // 支払日
            return null;
        }
    }
    // 請求書URL
    if(vobj.InvoiceURL__c){
        // 支払い種別が請求書以外の場合、請求書URLの値をクリアする
        var item = 'http://';
        var item2 = 'https://';
        var url = vobj.InvoiceURL__c.toLowerCase();
        if(payType != '2'){ 
            vobj.InvoiceURL__c = null;
        }else if(!(url.substr(0, item.length) == item || url.substr(0, item2.length) == item2)){
            this.showError(teasp.message.getLabel('ex00001240')); // http:// か https:// 始まりで入力してください。
            return null;
        }
    }
    // 社内・社外参加者
    if(expItem.isInternalParticipants() && expItem.isExternalParticipants()){
        if((vobj.InternalParticipantsNumber__c - 0) == 0 && (vobj.ExternalParticipantsNumber__c - 0) == 0){
            this.showError(teasp.message.getLabel('tf10001851')); // 合計人数が1人以上になるように社内参加人数と社外参加人数を入力してください。
            return null;
        }else if((vobj.InternalParticipantsNumber__c - 0) < 0 || (vobj.ExternalParticipantsNumber__c - 0) < 0){
            this.showError(teasp.message.getLabel('tf10001852')); // 0以上を入力してください。
            return null;
        }
    }else{
        //社内参加者・社外参加者のいずれか片方が表示されている場合
        if(expItem.isInternalParticipants() && !expItem.isExternalParticipants()){
            if((vobj.InternalParticipantsNumber__c - 0) <= 0){
                this.showError(teasp.message.getLabel('tf10001854')); // 社内参加者
                return null;
            }
        }else if(!expItem.isInternalParticipants() && expItem.isExternalParticipants()){
            if((vobj.ExternalParticipantsNumber__c - 0) <= 0){
                this.showError(teasp.message.getLabel('tf10001855')); // 社外参加者
                return null;
            }
        }
    }
    // 拡張項目1
    var ex1 = expItem.getExtraItem(1);
    if(!ex1){
        vobj.ExtraItem1__c = null;
    }else if(ex1.require){
        if(!vobj.ExtraItem1__c){
            this.showError(teasp.message.getLabel('tf10001840', ex1.name)); // {0}を入力してください。
            return null;
        }
    }
    // 拡張項目2
    var ex2 = expItem.getExtraItem(2);
    if(!ex2){
        vobj.ExtraItem2__c = null;
    }else if(ex2.require){
        if(!vobj.ExtraItem2__c){
            this.showError(teasp.message.getLabel('tf10001840', ex2.name)); // {0}を入力してください。
            return null;
        }
    }
    // 精算区分
    vobj.ExpenseType__c = this.orgData.expenseType || null;

    delete vobj._date;

    return vobj;
};

teasp.Tsf.ExpDetail.prototype.inputMemory = function(e){
    var vobj = this.getCurrentValue();
    if(!vobj){
        return false;
    }
    if(this.entryDetail){
        this.entryDetail({
            hkey    : this.orgData.hkey,
            values  : vobj
        });
        if(this.orgData.parentHide){
            this.orgData.parentHide();
        }
    }
    this.orgData.values = vobj;
    return true;
};

/**
 * SF1の環境で金額欄などにフォーカスがある状態からボタン類をクリックすると、
 * 通常なら金額欄に対して blur イベントが発火されるが、発火されない。
 * blur イベントハンドラで税額や外貨の現地金額などを再計算しているため、
 * それが行われないまま保存されてしまい、誤ったデータになってしまう。
 * これを回避するため、強制でフォーカスを費目選択に移して、blurイベントを発火させる
 * （#6535）
 */
teasp.Tsf.ExpDetail.prototype.escapeSf1 = function(){
    try{
        if(teasp.isSforce1()){
            var n = this.fp.getElementByApiKey('ExpItemId__c', null, this.getFormEl());
            if(n){
                n.focus();
            }
        }
    }catch(e){}
};

teasp.Tsf.ExpDetail.prototype.ok = function(e){
    this.escapeSf1();
    if(!this.inputMemory()){
        return;
    }
    this.hide();
};

teasp.Tsf.ExpDetail.prototype.inputAndContinue = function(e){
    this.escapeSf1();
    if(this.orgData.targetDate){ // この値が入っている＝即時登録モード
        this.doRegist(teasp.Tsf.Dom.hitch(this, function(){
            this.resetContent();
        }));
    }else{
        if(!this.inputMemory()){
            return;
        }
        this.resetContent();
    }
};

teasp.Tsf.ExpDetail.prototype.doRegist = function(callback){
    var vobj = this.getCurrentValue();
    if(!vobj){
        return;
    }
    var data = {
        EmpId__c            : tsfManager.getEmpId(),
        ExpApplyId__c       : null,
        ExpPreApplyId__c    : null,
        date                : (this.orgData.targetDate || null),
        exps                : [vobj]
    };
    tsfManager.saveEmpExp(data, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            if(this.entryDetail){
                this.entryDetail(result);
            }
            callback();
        }else{
            this.showError(teasp.Tsf.Error.getMessage(result));
        }
    }));
};

teasp.Tsf.ExpDetail.prototype.regist = function(e){
    this.doRegist(teasp.Tsf.Dom.hitch(this, function(){
        this.hide();
    }));
};

/**
 * 続けて入力時の初期値セット
 */
teasp.Tsf.ExpDetail.prototype.resetContent = function(){
    var formEl = this.getFormEl();

    this.orgData.hkey = teasp.Tsf.Fp.createHkey();
    this.orgData.values = teasp.Tsf.Dom.clone(this.orgData.values);
    this.orgData.values.Id = null;
    this.orgData.values._uniqKey = teasp.Tsf.ExpApply.createUniqKey();
    this.orgData.values.Attachments = [];
    this.orgData.values.Item__c = null;
    this.orgData.values.PreEmpExpId__c = null;
    this.orgData.values.PreExpItemId__c = null;
    this.orgData.values.CardStatementLineId__c = null;
    this.orgData.values.CardStatementLineId__r = null;
    this.orgData.values.ExternalICExpenseId__c = null;
    this.orgData.values.ExternalICExpenseId__r = null;
    this.orgData.values.Route__c = null;
    this.orgData.values.PlaceName__c = null;
    this.orgData.values.PlaceAddress__c = null;
    delete this.orgData.values._temp_attach;
    delete this.orgData.values.preObj;

    // 金額入力欄
    var expItem = tsfManager.getExpItemById(this.orgData.values.ExpItemId__c); // 費目
    var d = this.getDate() || teasp.util.date.formatDate(teasp.util.date.getToday());
    var defaultCost = expItem.getCost(d, true); // 標準金額
    this.orgData.values._cost = this.orgData.values.Cost__c = defaultCost || null;
    this.setCostValue(this.orgData.values.Cost__c);
    this.changedCurrencyAction(this.fp.getElementByApiKey('Cost__c', formEl), expItem, this.getCostValue(expItem, true)); // 金額入力欄

    if(expItem.isEnableQuantity()){ // 数量あり
        if(defaultCost){ // 標準金額あり
            this.setUnitPriceValue(defaultCost); // 単価←標準金額
        }else{
            this.setUnitPriceValue(''); // 単価＝空
        }
        this.setQuantityValue(1);  // 数量＝1
    }
    var transType = expItem.getTransportType();
    if(transType == '1' || transType == '2'){ // 経路入力欄クリア
        dijit.byId("DlgExpDetailStFrom").setValue('');
        dijit.byId("DlgExpDetailStTo"  ).setValue('');
    }
    if(expItem.isTaxFlag()){   // 消費税入力あり
        this.setTaxAuto(true); // 消費税手入力をオフにする
        this.setTaxRate(expItem, null); // 税率をデフォルト値にする
    }
    if(expItem.isForeignFlag()){ // 外貨入力あり
        this.initForeignCurrency(expItem);
    }
    if(expItem.isUseExtraItem1()){
        dojo.byId('DlgDetailExtraItem1').value = (!tsfManager.isDoNotCopyExtraItem() && this.orgData.assist && this.orgData.assist.ExtraItem1__c) || ''; // 拡張項目１クリア
    }
    if(expItem.isUseExtraItem2()){
        dojo.byId('DlgDetailExtraItem2').value = (!tsfManager.isDoNotCopyExtraItem() && this.orgData.assist && this.orgData.assist.ExtraItem2__c) || ''; // 拡張項目２クリア
    }
    if(expItem.isInternalParticipants()){   //社内参加者
        this.setInternalParticipants(expItem, expItem.getInternalParticipantsTemplateText());
        this.setInternalParticipantsNumber(0);
    }else{
        this.setInternalParticipants(expItem, '');
        this.setInternalParticipantsNumber(null);
    }
    if(expItem.isExternalParticipants()){   //社外参加者
        this.setExternalParticipants(expItem, expItem.getExternalParticipantsTemplateText());
        this.setExternalParticipantsNumber(0);
    }else{
        this.setExternalParticipants(expItem, '');
        this.setExternalParticipantsNumber(null);
    }

    this.setPlaceName('');    //店舗名クリア
    this.setPlaceAddress(''); //店舗所在地クリア

    if(expItem.isInternalParticipants() || expItem.isExternalParticipants()){
        this.setAmountPerParticipantValue(expItem, NaN); //人数割金額
    }

    dojo.byId('DlgDetailInvoiceURL').value = ''; // 請求書URLクリア
    dojo.byId('DlgDetailDetail').value = ''; // 備考欄クリア

    this.setValueByApiKey('Id', ''); // ID
    // ICアイコン
    teasp.Tsf.Dom.show('.ts-spice', formEl, false);
    teasp.Tsf.Dom.show('.ts-external', formEl, false);
    if(!this.orgData.pre){
        // 領収書アイコン
        var button = teasp.Tsf.Dom.node('input[type="button"].ts-receipt', formEl);
        teasp.Tsf.Dom.toggleClass(button, 'pp_ico_receipt'  , true);
        teasp.Tsf.Dom.toggleClass(button, 'pp_ico_receipt_a', false);
        teasp.Tsf.Dom.toggleClass(button, 'pp_ico_receipt_r', false);
        teasp.Tsf.Dom.toggleClass(button, 'pp_ico_receipt_u', false);

        button.title = null;
        this.getDomHelper().freeBy(this.EXPITEM_RECEIPT_TOOLTIP_HKEY);
        this.getDomHelper().createTooltip({
            connectId   : button,
            label       : teasp.message.getLabel('tf10001660'), // 保存後、画像ファイルをアップロード<br/>できるようになります。
            position    : ['below'],
            showDelay   : 200
        }, this.EXPITEM_RECEIPT_TOOLTIP_HKEY);
    }
    // 標準画面で開くリンク
    teasp.Tsf.Dom.show('div.ts-dialog-tips', teasp.Tsf.Dom.byId(this.dialog.id), false);
};

/**
 * 精算区分、費目表示区分と明細内容の整合をチェック
 * @param {Object} vobj
 * @returns {number}
 */
teasp.Tsf.ExpDetail.prototype.getExpMatching = function(vobj){
    var flag = 0;
    var expItem = tsfManager.getExpItemById(vobj.ExpItemId__c); // 費目
    if(expItem){
        if(!expItem.checkExpenseType(this.expItemFilter.expenseType)){
            flag = teasp.Tsf.EmpExp.MISMATCH_EXPENSE_TYPE;
        }
        if(!expItem.isSelectable(this.expItemFilter.empExpItemClass)
        && !expItem.isSelectable(this.expItemFilter.deptExpItemClass)){
            flag |= teasp.Tsf.EmpExp.MISMATCH_EXPITEM_CLASS;
        }
        var payTypeNums = tsfManager.getPayeeTypeNums(this.expItemFilter.expenseType);
        var payeeType = (vobj.PayeeId__r ? (vobj.PayeeId__r.PayeeType__c   || (vobj.payeeType || null)) : null);
        var payeeEt   = (vobj.PayeeId__r ? (vobj.PayeeId__r.ExpenseType__c || null) : null);
        if(!payTypeNums[payeeType || 1] && (this.expItemFilter.expenseType || (payeeType || 1) != 1)){
            flag |= teasp.Tsf.EmpExp.MISMATCH_PAY_TYPE;
        }
        if(payeeEt && (!this.expItemFilter.expenseType || !payeeEt.split(/,/).contains(this.expItemFilter.expenseType))){
            flag |= teasp.Tsf.EmpExp.MISMATCH_PAY_EXPENSE_TYPE;
        }
        var requireChargeJob = expItem.isRequireChargeJob();
        if(requireChargeJob == 2 && !vobj.JobId__c){
            flag |= teasp.Tsf.EmpExp.EMPTY_JOB;
        }
        // 拡張項目チェック
        var extra1 = expItem.getExtraItem(1);
        if(extra1 && extra1.require && !vobj.ExtraItem1__c){ // 拡張項目１が必須で入力値が空
            flag |= teasp.Tsf.EmpExp.EMPTY_EXTRA1;
        }
        var extra2 = expItem.getExtraItem(2);
        if(extra2 && extra2.require && !vobj.ExtraItem2__c){ // 拡張項目２が必須で入力値が空
            flag |= teasp.Tsf.EmpExp.EMPTY_EXTRA2;
        }
    }
    var requireChargeDept = tsfManager.isRequireChargeDept();
    if(requireChargeDept == 2 && !vobj.ChargeDeptId__c){
        flag |= teasp.Tsf.EmpExp.EMPTY_CHARGE_DEPT;
    }
    return flag;
};

/**
 * 不整合・整合状態を表示
 * @param {Object} node 入力欄
 * @param {number} flag 整合チェック結果のフラグ
 */
teasp.Tsf.ExpDetail.prototype.showMisMatch = function(node, flag){
    if(!node || !this.orgData.isShowMisMatch){
        return;
    }
    var div = teasp.Tsf.Dom.node('div.ts-form-label', teasp.Tsf.Dom.getAncestorByCssName(node, 'ts-form-row'));
    if(div){
        var p = teasp.Tsf.Dom.node('div.ts-mismatch', div);
        if(p){
            teasp.Tsf.Dom.destroy(p);
        }
        var t = [];
        if(flag & (teasp.Tsf.EmpExp.MISMATCH_EXPENSE_TYPE|teasp.Tsf.EmpExp.MISMATCH_PAY_TYPE|teasp.Tsf.EmpExp.MISMATCH_PAY_EXPENSE_TYPE)){
            t.push(teasp.message.getLabel('tf10006860')); // 精算区分不整合
        }
        if(flag & teasp.Tsf.EmpExp.MISMATCH_EXPITEM_CLASS){
            t.push(teasp.message.getLabel('tf10006870')); // 費目表示区分不整合
        }
        if(flag & teasp.Tsf.EmpExp.EMPTY_CHARGE_DEPT){
            t.push(teasp.message.getLabel('tf10007910')); // 負担部署未入力
        }
        if(flag & teasp.Tsf.EmpExp.EMPTY_JOB){
            t.push(teasp.message.getLabel('tf10007920')); // ジョブ未入力
        }
        if(flag & (teasp.Tsf.EmpExp.EMPTY_EXTRA1|teasp.Tsf.EmpExp.EMPTY_EXTRA2)){ // 拡張項目未入力
            var expItem = this.getCurrentExpItem();
            var ex1 = expItem.getExtraItem(1);
            var ex2 = expItem.getExtraItem(2);
            if(ex1 && (flag & teasp.Tsf.EmpExp.EMPTY_EXTRA1)){
                t.push(teasp.message.getLabel('tf10008260', ex1.name)); // {0}未入力
            }
            if(ex2 && (flag & teasp.Tsf.EmpExp.EMPTY_EXTRA2)){
                t.push(teasp.message.getLabel('tf10008260', ex2.name)); // {0}未入力
            }
        }
        if(t.length){
            this.getDomHelper().create('div', { className: 'pp_ico_ng' }
                , this.getDomHelper().create('div', { className: 'ts-mismatch' }, div));
        }
        div.title = (t.length ? t.join('\r\n') : '');
    }
};

/**
 * 精算区分、費目表示区分と明細内容の整合をチェック
 * @param {Object} vobj
 */
teasp.Tsf.ExpDetail.prototype.checkExpMatching = function(vobj){
    var flag = this.getExpMatching(vobj);
    var expItemNode    = this.fp.getElementByApiKey('ExpItemId__c'   , null, this.getFormEl());
    var paymentNode    = teasp.Tsf.Dom.node((this.isReadOnly() ? 'div.ts-payment-div' : 'select.ts-payment-select'), this.getFormEl());
    var payNameNode    = this.fp.getElementByApiKey('PayeeId__r.Name', null, this.getFormEl());
    var chargeDeptNode = this.fp.getElementByApiKey('ChargeDeptId__c', null, this.getFormEl());
    var jobNode        = this.fp.getElementByApiKey('JobId__c'       , null, this.getFormEl());
    var extra1Node     = this.fp.getElementByApiKey('ExtraItem1__c'  , null, this.getFormEl());
    var extra2Node     = this.fp.getElementByApiKey('ExtraItem2__c'  , null, this.getFormEl());
    this.showMisMatch(expItemNode   , (flag & (teasp.Tsf.EmpExp.MISMATCH_EXPENSE_TYPE|teasp.Tsf.EmpExp.MISMATCH_EXPITEM_CLASS)));
    this.showMisMatch(paymentNode   , (flag & teasp.Tsf.EmpExp.MISMATCH_PAY_TYPE));
    this.showMisMatch(payNameNode   , (flag & teasp.Tsf.EmpExp.MISMATCH_PAY_EXPENSE_TYPE));
    this.showMisMatch(chargeDeptNode, (flag & teasp.Tsf.EmpExp.EMPTY_CHARGE_DEPT));
    this.showMisMatch(jobNode       , (flag & teasp.Tsf.EmpExp.EMPTY_JOB));
    this.showMisMatch(extra1Node    , (flag & teasp.Tsf.EmpExp.EMPTY_EXTRA1));
    this.showMisMatch(extra2Node    , (flag & teasp.Tsf.EmpExp.EMPTY_EXTRA2));
};

/**
 * 精算区分、費目表示区分と明細内容の整合をチェック
 */
teasp.Tsf.ExpDetail.prototype.checkMatching = function(){
    if(this.isReadOnly()){
        return;
    }
    var paymentNode = teasp.Tsf.Dom.node('select.ts-payment-select', this.getFormEl());
    var vobj = {
        payeeType    : (paymentNode ? paymentNode.value : null)
    };
    var fcs = [];
    fcs.push(this.fp.getFcByApiKey('ExpItemId__c'));
    fcs.push(this.fp.getFcByApiKey('PayeeId__c'));
    fcs.push(this.fp.getFcByApiKey('PayeeId__r.Name'));
    fcs.push(this.fp.getFcByApiKey('PayeeId__r.PayeeType__c'));
    fcs.push(this.fp.getFcByApiKey('PayeeId__r.ExpenseType__c'));
    fcs.push(this.fp.getFcByApiKey('ChargeDeptId__c'));
    fcs.push(this.fp.getFcByApiKey('JobId__c'));
    fcs.push(this.fp.getFcByApiKey('ExtraItem1__c'));
    fcs.push(this.fp.getFcByApiKey('ExtraItem2__c'));
    dojo.forEach(fcs, function(fc){
        if(fc){
            fc.fillValue(vobj, fc.fetchValue());
        }
    });
    this.checkExpMatching(vobj);
};
