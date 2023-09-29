/**
 * 経費精算実行オプションダイアログ
 *
 * @constructor
 */
teasp.Tsf.PayOption = function(){
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.payOption);
};

teasp.Tsf.PayOption.prototype.show = function(obj, callback){
    teasp.Tsf.Error.showError();
    this.domHelper = new teasp.Tsf.Dom();

    this.dialog = new dijit.Dialog({
        title       : teasp.message.getLabel('tk10000762'), // 精算実行
        className   : 'ts-dialog-pay-execute'
    });
    this.dialog.attr('content', this.getContent(obj));
    this.dialog.startup();
    this.domHelper.connect(this.dialog, 'onCancel', this, function(){ this.hide(); });

    this.setPaid = callback;
    this.showData(obj);
};

teasp.Tsf.PayOption.prototype.showData = function(obj){
    var formEl = this.getFormEl();
    this.orgData = obj;
    var vobj = this.orgData.values || {};
    vobj.payDate = teasp.util.date.formatDate(teasp.util.date.getToday());

    // 精算費目
    var select = this.fp.getElementByApiKey('expItemId', null, formEl);
    this.loadPayItems(select);
    if(select){
        this.getDomHelper().connect(select, 'onchange', this, this.changedPayItem);
    }

    // 振込元
    select = this.fp.getElementByApiKey('sourceAccountId', null, formEl);
    this.loadZgAccounts(select);

    this.fp.fcLoop(function(fc){
        if(fc.isApiField(true)){
            fc.drawText(this.getDomHelper(), vobj);
        }
    }, this);

    // 備考(精算時)入力欄の表示／非表示
    var fc = this.fp.getFcByApiKey('payMethod');
    var el = fc.getElement(null, formEl);
    if(el){
        // 表示範囲＝「本人立替分」または仕訳データ出力ありの場合のみ、表示
        var row = teasp.Tsf.Dom.getAncestorByCssName(el, 'ts-form-row');
        teasp.Tsf.Dom.show(row, null, (this.orgData.listType == '1' || this.isOutputJournal()));
    }

    // 仕訳データCSV出力の表示／非表示
    fc = this.fp.getFcByApiKey('outputJournal');
    el = fc.getElement(null, formEl);
    if(el){
        var row = teasp.Tsf.Dom.getAncestorByCssName(el, 'ts-form-row');
        var useEntryData = tsfManager.getInfo().getCommon().isUseExpEntryData();
        var entryDataUrl = tsfManager.getInfo().getCommon().getExpEntryDataUrl();
        teasp.Tsf.Dom.show(row, null, (useEntryData && entryDataUrl));
    }

    this.showSourceAccount();
    this.changedPayItem();

    this.dialog.show();
};

teasp.Tsf.PayOption.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.PayOption.prototype.getFormEl = function(){
    return teasp.Tsf.Dom.node('.ts-section-form', teasp.Tsf.Dom.byId(this.dialog.id));
};

teasp.Tsf.PayOption.prototype.getValueByApiKey = function(apiKey, obj, defaultValue){
    var fc = this.fp.getFcByApiKey(apiKey);
    if(!fc){
        return defaultValue;
    }
    var fv = fc.parseValue(obj);
    if(fv.value === undefined || fv.value === null){
        return defaultValue;
    }
    return fv.value;
};

teasp.Tsf.PayOption.prototype.fetchValueByApiKey = function(apiKey){
    var fc = this.fp.getFcByApiKey(apiKey);
    return fc.fetchValue().value;
};

teasp.Tsf.PayOption.prototype.setValueByApiKey = function(apiKey, val){
    var fc = this.fp.getFcByApiKey(apiKey);
    fc.textOut(this.getDomHelper(), null, val);
};

teasp.Tsf.PayOption.prototype.hide = function(){
    if(this.dialog){
        this.dialog.hide();
        this.domHelper.free();
        this.dialog.destroy();
        tsfManager.removeDialog('PayOption');
    }
};

teasp.Tsf.PayOption.prototype.getContent = function(orgData){
    var areaEl = this.getDomHelper().create('div', { className: 'ts-dialog ts-exp-detail', style: 'width:462px;' });
    this.getDomHelper().create('div', null
            , this.getDomHelper().create('div', { className: 'ts-error-area', style: 'width:462px;display:none;' }, areaEl));

    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form' }, areaEl);
    var row = null;
    this.fp.fcLoop(function(fc){
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, formEl);
        }else{
            var cssName = 'ts-form-row';
            row = this.getDomHelper().create('div', { className: cssName }, formEl);
            // ラベル部作成
            var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
            if(fc.getLw()){
                teasp.Tsf.Dom.style(label, 'width', fc.getLw());
            }
            this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
            if(fc.isRequired()){
                this.getDomHelper().create('div', { className: 'ts-require' }, label);
            }
            // 入力欄作成
            fc.appendFieldDiv(this.getDomHelper(), row);
        }
    }, this);

    this.showPayItemSelect(formEl);

    this.setEventHandler(formEl);

    // 電帳法オプションONの場合、精算取消不可の警告表示(精算種別は仮払いを除く)
    if(tsfManager.getInfo().getCommon().isUseScannerStorage()
            && orgData.listType != '4') {
        var area = this.getDomHelper().create('div', { className: 'ts-alert-output' , style: 'width:462px;' }, areaEl);
        area.innerHTML = teasp.message.getLabel('ex00001180');
    }

    this.createButtons(areaEl);

    return areaEl;
};

teasp.Tsf.PayOption.prototype.isOutputJournal = function(formEl){
    return (tsfManager.isOutputJournal() && tsfManager.getPayItems().length > 0);
};

/**
 * 精算方法の入力欄の表示／非表示
 *
 * @param {Object} e
 */
teasp.Tsf.PayOption.prototype.showPayItemSelect = function(formEl){
    var fc = this.fp.getFcByApiKey('expItemId');
    var el = fc.getElement(null, formEl);
    if(el){
        // 「仕訳データを作成する」がオンかつ精算用費目がある場合のみ、必須項目
        var row = teasp.Tsf.Dom.getAncestorByCssName(el, 'ts-form-row');
        teasp.Tsf.Dom.show(row, null, this.isOutputJournal());
    }
};

teasp.Tsf.PayOption.prototype.showSourceAccount = function(e){
    var fc = this.fp.getFcByApiKey('sourceAccountId');
    var el = fc.getElement(null, this.getFormEl());
    var checked = this.fetchValueByApiKey('zgDataCheck');
    if(el){
        // 「仕訳データを作成する」がオンかつ精算用費目がある場合のみ、必須項目
        var row = teasp.Tsf.Dom.getAncestorByCssName(el, 'ts-form-row');
        teasp.Tsf.Dom.show(row, null, checked);
    }
};

teasp.Tsf.PayOption.prototype.createButtons = function(areaEl){
    var area = this.getDomHelper().create('div', { className: 'ts-dialog-buttons' }, areaEl);
    var div  = this.getDomHelper().create('div', null, area);

    var okbtn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('ok_btn_title')    , 'ts-dialog-ok'    , div); // ＯＫ
    var canbtn = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('cancel_btn_title'), 'ts-dialog-cancel', div); // キャンセル

    this.getDomHelper().connect(okbtn , 'onclick', this, this.ok);
    this.getDomHelper().connect(canbtn, 'onclick', this, this.hide);
};

teasp.Tsf.PayOption.prototype.setEventHandler = function(formEl){
    // 日付選択ボタンクリックのイベントハンドラ作成
    teasp.Tsf.Dom.query('.ts-form-cal', formEl).forEach(function(cal){
        var n = teasp.Tsf.Dom.node('input[type="text"]', cal.parentNode.parentNode);
        if(n){
            tsfManager.eventOpenCalendar(this.getDomHelper(), cal, n, { tagName: n.name, isDisabledDate: function(d){ return false; } });
        }
    }, this);

    var fc = this.fp.getFcByApiKey('zgDataCheck');
    var chk = fc.getElement(null, formEl);
    if(chk.tagName == 'INPUT'){
        this.getDomHelper().connect(chk, 'onclick', this, this.showSourceAccount);
    }

    // テキストエリアの文字数制限（IE8以下）
    teasp.Tsf.Dom.setlimitChars(this.getDomHelper()
        , teasp.Tsf.Dom.query('textarea', formEl)
        , this.fp);
};

/**
 * 精算費目プルダウンに選択肢をセット
 *
 * @param {Object} el
 */
teasp.Tsf.PayOption.prototype.loadPayItems = function(el){
    teasp.Tsf.Dom.empty(el);
    this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
    dojo.forEach(tsfManager.getPayItems(), function(expItem){
        if(!expItem.isRemoved()){
            this.getDomHelper().create('option', { value: expItem.getId(), innerHTML: expItem.getName() }, el);
        }
    }, this);
};

teasp.Tsf.PayOption.prototype.changedPayItem = function(e){
    var select = this.fp.getElementByApiKey('expItemId', null, this.getFormEl());

    this.getDomHelper().freeBy(this.EXPITEM_TOOLTIP_HKEY);

    var expItem = this.getCurrentExpItem();
    var tip;
    if(expItem){
        tip = expItem.getToolTip(true); // 費目の情報
    }else{
        tip = teasp.message.getLabel('tf10001680'); // 費目を選択してください
    }
    this.getDomHelper().createTooltip({
        connectId   : select.parentNode,
        label       : tip,
        position    : ['after'],
        showDelay   : 100
    }, this.EXPITEM_TOOLTIP_HKEY);
};

teasp.Tsf.PayOption.prototype.getCurrentExpItem = function(){
    var select = this.fp.getElementByApiKey('expItemId', null, this.getFormEl());
    for(var i = 0 ; i < tsfManager.getPayItems().length ; i++){
        var expItem = tsfManager.getPayItems()[i];
        if(expItem.getId() == select.value){
            return expItem;
        }
    }
    return null;
};

/**
 * 振込元プルダウンに選択肢をセット
 *
 * @param {Object} el
 */
teasp.Tsf.PayOption.prototype.loadZgAccounts = function(el){
    teasp.Tsf.Dom.empty(el);
    this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
    dojo.forEach(tsfManager.getZgAccounts(), function(account){
        this.getDomHelper().create('option', { value: account.getId(), innerHTML: account.getName() }, el);
    }, this);
};

/**
 * カレンダー表示を呼び出す
 *
 * @param {boolean} flag
 */
teasp.Tsf.PayOption.prototype.showCalendar = function(){
    var inp = this.fp.getElementByApiKey('Date__c', null, this.getFormEl());
    var row = teasp.Tsf.Dom.getAncestorByCssName(inp, 'ts-form-row');
    var btn = teasp.Tsf.Dom.node('button.ts-form-cal', row);
    if(btn){
        teasp.Tsf.Dom.pushEvent(btn, 'onclick');
    }
};

teasp.Tsf.PayOption.prototype.showError = function(result){
    var er = teasp.Tsf.Dom.node('.ts-error-area', teasp.Tsf.Dom.byId(this.dialog.id));
    teasp.Tsf.Error.showError(result, er);
};

teasp.Tsf.PayOption.prototype.ok = function(e){
    if(this.setPaid){
        var payItemOn = this.isOutputJournal();
        if(payItemOn){
            var payItemId = this.fp.getFcByApiKey('expItemId').fetchValue().value;
            if(tsfManager.isOutputJournal() && !payItemId){ // 仕訳データを作成する場合、必須
                this.showError(teasp.message.getLabel('tf10001730')); // 精算方法を選択してください
                return;
            }
        }
        var vobj = {};
        this.fp.fcLoop(function(fc){
            if(fc.isApiField(true)){
                fc.fillValue(vobj, fc.fetchValue());
            }
        }, this);

        if(!payItemOn){ // 精算方法が必須でなければ null をセット
            vobj.expItemId = null;
        }

        if(!vobj.payDate){
            this.showError(teasp.message.getLabel('tf10001740')); // 精算日を入力してください。
            return;
        }
        if(vobj.zgDataCheck && !vobj.sourceAccountId){
            this.showError(teasp.message.getLabel('tf10001750')); // 振込元を選択してください。
            return;
        }

        this.setPaid({
            hkey    : this.orgData.hkey,
            ids     : this.orgData.ids,
            values  : vobj
        });
    }
    this.hide();
};
