/**
 * 領収書入力ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ReceiptList = function(){
    this.notOpenLink = true;
};

teasp.Tsf.ReceiptList.prototype = new teasp.Tsf.SearchList();

teasp.Tsf.ReceiptList.prototype.init = function(param){
    if(!tsfManager.getInfo().isReceiptReaderConnect()){ // 領収書リーダー接続ユーザ名が設定されてない
        for(var i = 0 ; i < param.fields.length ; i++){ // 連絡欄を非表示にする
            var f = param.fields[i];
            if(f.apiKey == 'Message__c'){
                param.fields.splice(i, 1);
                break;
            }
        }
    }
    teasp.Tsf.SearchList.prototype.init.call(this, param);
};

teasp.Tsf.ReceiptList.prototype.show = function(obj, callback){
    this.option['cancelReceipt'] = teasp.Tsf.Dom.hitch(this, this.cancelReceipt);

    teasp.Tsf.SearchList.prototype.show.call(this, obj, callback);

    this.setButtonDisplay(); // ボタンの表示／非表示切り替え
};

teasp.Tsf.ReceiptList.prototype.clickRecordCount = function(e){
    console.log(e);
    console.log(e.target.className);
    var select = teasp.Tsf.Dom.byId('ReceiptStatus');
    if(select){
        if(teasp.Tsf.Dom.hasClass(e.target, 'proc-count')){
            select.value = '0';
        }else if(teasp.Tsf.Dom.hasClass(e.target, 'erro-count')){
            select.value = '9';
        }else if(teasp.Tsf.Dom.hasClass(e.target, 'comp-count')){
            select.value = '2';
        }
        this.search();
    }
};

teasp.Tsf.ReceiptList.prototype.getButtons = function(e){
    return [
        { key:'expImport'     , label:teasp.message.getLabel('tf10002260') , css:'ts-dialog-ok'    }, // 読み込み
        { key:'cancelReceipt' , label:teasp.message.getLabel('tf10005040') , css:'ts-cancel-apply' }, // 削 除
        { key:'close'         , label:teasp.message.getLabel('cancel_btn_title') } // キャンセル
    ];
};

teasp.Tsf.ReceiptList.prototype.drawData = function(tb){
    teasp.Tsf.SearchList.prototype.drawData.call(this, tb);
};

teasp.Tsf.ReceiptList.prototype.setSearchContent = function(areaEl){
    // 検索条件入力エリア作成
    if(this.fp.getSearchFields().length > 0){
        var searchEl = this.getDomHelper().create('div', { className: 'ts-section-form' }, areaEl);
        if(!tsfManager.getInfo().isReceiptReaderConnect()){ // 領収書リーダー接続ユーザ名が設定されてない
            teasp.Tsf.Dom.style(searchEl, 'display', 'none'); // エリアを非表示にする
        }
        var pfc = null;
        var row = null;
        this.fp.searchFcLoop(function(fc){
            if(fc.isHidden()){
                this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, searchEl);
            }else{
                if(!pfc || !pfc.isNoNL()){
                    row = this.getDomHelper().create('div', { className: 'ts-form-row' }, searchEl);
                }
                // ラベル部作成
                var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
                if(fc.getLw()){
                    teasp.Tsf.Dom.style(label, 'width', fc.getLw());
                }
                this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
                // 入力欄作成
                fc.appendFieldDiv(this.getDomHelper(), row);
                pfc = fc;
            }
        }, this);
        row = teasp.Tsf.Dom.node('div.ts-form-row', searchEl);
        if(row){
            this.getDomHelper().create('div', { className: 'ts-form-value ts-receipt-sum' }, row);
        }
        // 選択リストが選択されたら、検索実行するようにする。
        var select = teasp.Tsf.Dom.node('select', searchEl);
        select.value = (select.options && select.options[0].value);
        this.getDomHelper().connect(select, 'onchange', this, this.search);
        this.setEventHandler(searchEl);
    }
};

teasp.Tsf.ReceiptList.prototype.search = function(e){
    teasp.Tsf.SearchList.prototype.search.call(this, e);
    this.setButtonDisplay(); // ボタンの表示／非表示切り替え
};

/**
 * ボタンの表示／非表示切り替え
 *
 */
teasp.Tsf.ReceiptList.prototype.setButtonDisplay = function(){
    var areaEl = this.getArea();
    var select = teasp.Tsf.Dom.node('div.ts-section-form select', areaEl);
    var v = (select && select.value || null);
    teasp.Tsf.Dom.show('div.ts-dialog-buttons .ts-dialog-ok'   , areaEl, (v == '2'));
//  teasp.Tsf.Dom.show('div.ts-dialog-buttons .ts-cancel-apply', areaEl, (v == '9')); // 入力代行サービスの場合（#6788に従い残す）
    teasp.Tsf.Dom.show('div.ts-dialog-buttons .ts-cancel-apply', areaEl, (v == '2'));

};

teasp.Tsf.ReceiptList.prototype.showDataEnd = function(){
    teasp.Tsf.SearchList.prototype.showDataEnd.call(this);

    var div = teasp.Tsf.Dom.node('div.ts-section-form .ts-receipt-sum', this.getArea());
    var statusNums = this.orgData.statusNums;
    if(statusNums && div){
        var proc = statusNums['0'] || 0; // 処理中
        var comp = statusNums['2'] || 0; // 完了
        var erro = statusNums['9'] || 0; // エラー
        var all = proc + comp + erro;
        teasp.Tsf.Dom.empty(div);
        div.innerHTML = teasp.message.getLabel('tf10005050', all, proc, erro, comp); // 進行状況：  {0}件中     処理中 {1}件     エラー {2}件     完了 {3}件
        var n = 0;
        teasp.Tsf.Dom.query('a', div).forEach(function(el){
            this.getDomHelper().connect(el, 'onclick', this, this.clickRecordCount);
            teasp.Tsf.Dom.addClass(el, (!n ? 'proc-count' : (n == 1 ? 'erro-count' : 'comp-count')));
            n++;
        }, this);
    }
    this.showListCheckbox();
};

teasp.Tsf.ReceiptList.prototype.showListCheckbox = function(){
    var areaEl = this.getArea();
    var select = teasp.Tsf.Dom.node('div.ts-section-form select', areaEl);
    var v = (select && select.value || null);
    teasp.Tsf.Dom.query('table.ts-list-head, table.ts-list-body', areaEl).forEach(function(el){
        teasp.Tsf.Dom.query('input[type="checkbox"]', el).forEach(function(c){
            teasp.Tsf.Dom.style(c, 'display', (v == '0' ? 'none' : ''));
        });
    });
};

/**
 * 領収書データの削除
 *
 */
teasp.Tsf.ReceiptList.prototype.cancelReceipt = function(){
    var records = this.collectRecords();
    if(records.length <= 0){
        this.showError(teasp.message.getLabel('tf10005060')); // 削除対象を選択してください
        return;
    }
    console.log(records);
    var foreignIds = [];
    var recordIds = [];
    if(tsfManager.getInfo().isReceiptReaderConnect()){ // 入力代行サービス=オン（#6788に従い残す）
        dojo.forEach(records, function(record){
            if(record.ForeignId__c){
                foreignIds.push(record.ForeignId__c);
            }
        });
        if(!foreignIds.length){
            return;
        }
    }else{
        dojo.forEach(records, function(record){
            if(record.Id){
                recordIds.push(record.Id);
            }
        });
        if(!recordIds.length){
            return;
        }
        teasp.tsConfirm(teasp.message.getLabel('tf10008860', recordIds.length),this,function(result){// {0}件の領収書を削除します。よろしいですか？
            if(result){
                tsfManager.actionReceipt({
                    action     : 'remove',
                    empId      : tsfManager.getEmpId(),
                    recordIds  : recordIds.join(','),
                    foreignIds : foreignIds.join(','),
                    notapi     : !tsfManager.getInfo().isReceiptReaderConnect() // 業者組織との通信しない場合 true をセット
                }, teasp.Tsf.Dom.hitch(this, function(succeed, result){
                    if(succeed){
                        this.orgData.statusNums = result.statusNums;
                        this.search(); // 再検索
                    }else{
                        this.showError(result);
                    }
                }));
            }
        });
    }
};
