/**
 * 事前申請リスト画面
 *
 * @constructor
 */
teasp.Tsf.ListExpPay = function(listType){
    this.listType = listType;
    var listKey = 'ListExpPay' + (this.listType || '');
    var formParam = teasp.Tsf.formParams[listKey];
    if(!formParam){
        this.listType = '1';
        formParam = teasp.Tsf.formParams.ListExpPay1;
    }
    this.fp = teasp.Tsf.Fp.createFp(formParam);
    this.searchObj = {
        values: (this.fp.getDefaultFilts() || {})
    };
    this.mask = 1;
};

teasp.Tsf.ListExpPay.prototype = new teasp.Tsf.ListBase();
teasp.Tsf.ListExpPay.SELECTION_LIMIT = 2000;
teasp.Tsf.ListExpPay.LOOP_SIZE = 200;

/**
 * テーブル作成
 *
 */
teasp.Tsf.ListExpPay.prototype.createBase = function(){
    var listTop = this.getDomHelper().create('div', { className: 'ts-list-top' });

    //-----------------
    // 左側のDIV
    var tr = this.getDomHelper().create('tr', null
                , this.getDomHelper().create('tbody', null
                    , this.getDomHelper().create('table', null
                        , this.getDomHelper().create('div', { className: 'ts-form-edge-left' }, listTop))));

    //-----------------
    // 支払種別のプルダウン
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10001430') } // 支払種別
            , this.getDomHelper().create('td', { className: 'ts-list-top-label' }, tr));
    var select = this.getDomHelper().create('select', { className: 'ts-list-top-range' }
                    , this.getDomHelper().create('div', null
                        , this.getDomHelper().create('td', { className: 'ts-list-top-select' }, tr)));
    this.getDomHelper().create('option', { value:'1', innerHTML:teasp.message.getLabel('tf10001360') }, select); // 本人立替分
    this.getDomHelper().create('option', { value:'2', innerHTML:teasp.message.getLabel('tf10001370') }, select); // 請求書
    this.getDomHelper().create('option', { value:'3', innerHTML:teasp.message.getLabel('tf10001380') }, select); // クレジットカード
    this.getDomHelper().create('option', { value:'4', innerHTML:teasp.message.getLabel('tf10001450') }, select); // 仮払い
    select.value = this.listType;
    this.getDomHelper().connect(select, 'onchange', this, this.changeList);

    //-----------------
    // 精算状況のプルダウン
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10004981') } // 精算状況
            , this.getDomHelper().create('td', { className: 'ts-list-top-label' }, tr));
    select = this.getDomHelper().create('select', { className: 'ts-list-top-status' }
                    , this.getDomHelper().create('div', null
                        , this.getDomHelper().create('td', { className: 'ts-list-top-status' }, tr)));
    this.getDomHelper().create('option', { value:'0', innerHTML:teasp.message.getLabel('tk10000078')          }, select); // 精算対象
    this.getDomHelper().create('option', { value:'1', innerHTML:teasp.message.getLabel('reimbursement_label') }, select); // 精算済み
    this.getDomHelper().connect(select, 'onchange', this, this.changeStatus);

    //-----------------
    this.getDomHelper().create('div', { className: 'ts-list-paging' }, this.getDomHelper().create('td', { className: 'ts-space' }, tr));

    //-----------------
    // 右側のDIV
    tr = this.getDomHelper().create('tr', null
            , this.getDomHelper().create('tbody', null
                , this.getDomHelper().create('table', null
                    , this.getDomHelper().create('div', { className: 'ts-form-edge-right' }, listTop))));

    if(tsfManager.getInfo().getCommon().isUseExpPayPrint()){ // 印刷機能を使用（裏オプション:ディスコ様限定）
        this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('print_btn_title') }, this.getDomHelper().create('td', { className: 'ts-form-print ts-std-button' }, tr)); // 印刷
    }
    this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('tk10000755') }, this.getDomHelper().create('td', { className: 'ts-form-csv ts-std-button' }, tr)); // CSV出力
    this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('tk10000779') }, this.getDomHelper().create('td', { className: 'ts-output-zengin-button' }, tr)); // 全銀データ出力
    this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('tf10001460') }, this.getDomHelper().create('td', { className: 'ts-search-button' }, tr)); // 検 索
    this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('tk10000762') }, this.getDomHelper().create('td', { className: 'ts-pay-button'    }, tr)); // 精算実行
    this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('tk10000763') }, this.getDomHelper().create('td', { className: 'ts-reset-button'  }, tr)); // 精算取消

    // 精算取消は初期表示で非表示
    teasp.Tsf.Dom.show(teasp.Tsf.Dom.node('td.ts-reset-button', tr), false);

    // 全銀データ出力ダイアログを表示
    var d = teasp.Tsf.Dom.node('.ts-output-zengin-button button', tr);
    if(d){
        this.getDomHelper().connect(d, 'onclick', this, function(e){
            this.openZengin();
        });
    }

    // 検索
    var d = teasp.Tsf.Dom.node('.ts-search-button button', tr);
    if(d){
        this.getDomHelper().connect(d, 'onclick', this, function(e){
            this.search();
        });
    }

    // 印刷
    var d = teasp.Tsf.Dom.node('.ts-form-print button', tr);
    if(d){
        this.getDomHelper().connect(d, 'onclick', this, function(e){
            this.openPrint();
        });
    }

    // CSV出力
    var d = teasp.Tsf.Dom.node('.ts-form-csv button', tr);
    if(d){
        this.getDomHelper().connect(d, 'onclick', this, function(e){
            this.csvOut();
        });
    }

    // 精算実行
    var d = teasp.Tsf.Dom.node('.ts-pay-button button', tr);
    if(d){
        this.getDomHelper().connect(d, 'onclick', this, function(e){
            var lst = this.getCheckedIds();
            if(lst.length <= 0){
                teasp.tsAlert(teasp.message.getLabel('tf10001870'));// 精算対象を選択してください
                return;
            }else if(lst.length > teasp.Tsf.ListExpPay.SELECTION_LIMIT){
                teasp.tsAlert(teasp.message.getLabel('tf10004840', teasp.Tsf.ListExpPay.SELECTION_LIMIT));// 1度に精算実行可能な数量を超えています。{0}件以下となるように選択を絞り込んでください。
                return; 
            }
            tsfManager.showDialog('PayOption', { listType: this.listType, ids: lst }, teasp.Tsf.Dom.hitch(this, this.setPaid));
        });
    }

    // 精算取消
    var d = teasp.Tsf.Dom.node('.ts-reset-button button', tr);
    if(d){
        this.getDomHelper().connect(d, 'onclick', this, this.resetPaid);
    }

    var countDiv = this.getDomHelper().create('div', { className: 'ts-list-countDiv' });
    this.getDomHelper().create('div', { className: 'ts-list-countMsg' }, countDiv);
    this.getDomHelper().create('div', { className: 'ts-list-caution', style:'color:red;'  }, countDiv);

    var table = this.createExpPayBase();

    // 該当件数が表示できる最大件数を超えた時にツールチップで表示するメッセージをセット
    var cntMax = this.fp.getRowLimit() * this.fp.getPageLimit();
    this.cntOverMessage = teasp.message.getLabel('tk10000343', cntMax, cntMax); // 該当件数が {0} 件を超えました。上位 {1} 件のみ表示します。

    return [listTop, countDiv, table];
};

teasp.Tsf.ListExpPay.prototype.changeList = function(){
    var select = teasp.Tsf.Dom.node('.ts-list-top select.ts-list-top-range', this.getArea());
    tsfManager.refreshList(select.value);
};

teasp.Tsf.ListExpPay.prototype.changeStatus = function(){
    var select = teasp.Tsf.Dom.node('.ts-list-top select.ts-list-top-status', this.getArea());
    var payMode = (select.value == '0');
    teasp.Tsf.Dom.show('td.ts-pay-button'  , this.getArea(),  payMode);
    teasp.Tsf.Dom.show('td.ts-reset-button', this.getArea(), !payMode);
    // 支払種別は仮払いであるか
    var selectPayType = teasp.Tsf.Dom.node('.ts-list-top select.ts-list-top-range', this.getArea());
    var isExpPreApply = selectPayType.value == '4';
    // 仮払以外の場合、電帳法がONなら精算取消ボタンを非活性にする。
    // (取消期限日以前であれば取消可)
    if(!payMode && tsfManager.getInfo().getCommon().isUseScannerStorage() && !isExpPreApply
            && !tsfManager.getInfo().getCommon().isExpCancelable()){
        teasp.Tsf.Dom.setAttr('td.ts-reset-button > button', 'disabled', 'disabled');
        teasp.Tsf.Dom.setAttr('td.ts-reset-button > button', 'title', teasp.message.getLabel('ex00001170'));
    }
    this.mask = (payMode ? 1 : 2);
    // 既存検索条件初期化
    this.searchObj = {
        values: (this.fp.getDefaultFilts() || {})
    };
    this.setFreeFilts([]); // 入力検索条件クリア
    this.refresh();
};

teasp.Tsf.ListExpPay.prototype.getListMode = function(){
    return 3;
};

teasp.Tsf.ListExpPay.prototype.dataProcessing = function(){
    if(!this.records){
        return;
    }
    dojo.forEach(this.records, function(record){
        var statFvs = this.fp.parseValueByDomType(record, 'status');
        record.approved = (statFvs.length > 0 && ['承認済み','確定済み','精算済み'].contains(statFvs[0].value)) || false;
    }, this);
};

teasp.Tsf.ListExpPay.prototype.setAnchor = function(tr){
    var a = teasp.Tsf.Dom.node('a', tr);
    if(a){
        var hkey = teasp.Tsf.Fp.getHkey(tr);
        var target = this.getTargetObj();
        var id = this.fp.getFcByApiKey(target == 'EmpExp' ? 'ExpApplyId__c' : 'Id').fetchValue(hkey).value;
        if(id){
            if(target == 'EmpExp' || target == 'ExpApply'){
                a.href = teasp.getPageUrl('empExpView') + '?expApplyId=' + id;
            }else{
                a.href = teasp.getPageUrl('expPreApplyView') + '?id=' + id;
            }
            a.target = '_blank';
        }
    }
};

/**
 * 全銀データ出力ダイアログ表示
 */
teasp.Tsf.ListExpPay.prototype.openZengin = function(){
    // 支払種別
    const selectedPayeeType = teasp.Tsf.Dom.node('.ts-list-top select.ts-list-top-range', this.getArea()).value;
    // 検索基準日
    const baseDate = moment().add('month', -1).startOf('month').format("YYYY-MM-DD");

    tsfManager.potalAction({
        'method': 'getExpPayHistory',
        'baseDate': baseDate,
        'payeeType': selectedPayeeType
    }, teasp.Tsf.Dom.hitch(this, function(succeed, response){
        if(!succeed){
            console.log("error: ");
            console.log(response);
        }
        const searchResult = response.records;
        this.outputZenginDialog = new teasp.Tsf.OutputZengin({
            searchParams: {
                baseDate: baseDate,
                payeeType: selectedPayeeType
            },
            expPayHistories: searchResult
        });
        this.outputZenginDialog.show();
    }));
};

teasp.Tsf.ListExpPay.prototype.search = function(){
    var key = 'searchExpPay' + this.listType;
    this.searchDialog = new teasp.Tsf.SearchCondition(teasp.Tsf.formParams[key], this.mask);
    this.searchDialog.show((this.searchObj || {}), teasp.Tsf.Dom.hitch(this, function(obj){
        this.setFreeFilts(obj.filts);
        this.searchObj = obj;
        this.refresh();
    }));
};

teasp.Tsf.ListExpPay.prototype.disableCheckBox = function(){
    var select = teasp.Tsf.Dom.node('.ts-list-top select.ts-list-top-status', this.getArea());
    // 初期表示時、精算対象を取得できないため。
    if (!select) {
        return;
    }
    var selectPayType = teasp.Tsf.Dom.node('.ts-list-top select.ts-list-top-range', this.getArea());
    if (!selectPayType) {
        return;
    }
    var isExpPreApply = selectPayType.value == '4'; // 支払種別は仮払いか
    var payMode = (select.value == '0');
    // 電帳法がONなら一覧のチェックボックスを非活性にする。
    // (取消期限日以前であれば取消可)
    if(!payMode && tsfManager.getInfo().getCommon().isUseScannerStorage() && !isExpPreApply
            && !tsfManager.getInfo().getCommon().isExpCancelable()){
        // 全選択チェックボックスを非活性
        var head = this.getCheckboxHead();
        if(head){
            teasp.Tsf.Dom.setAttr2('input[type="checkbox"]', head, 'disabled', 'disabled');
        }
        var tbody = this.getCheckboxBody();
        for(var i = 0 ; i < tbody.rows.length ; i++){
            var tr = tbody.rows[i];
            var hkey = teasp.Tsf.Fp.getHkey(tr);
            var id = this.fp.getFcByApiKey('Id').fetchValue(hkey).value;
            if(id){
                teasp.Tsf.Dom.setAttr2('input.ts-check[type="checkbox"]', tr, 'disabled', 'disabled');
            }
        }
    }
}
teasp.Tsf.ListExpPay.prototype.refresh = function(){
    teasp.Tsf.ListBase.prototype.refresh.call(this);

    // 選択数上限設定
    // ※精算状況=精算対象の場合は 200件制限、精算済みの場合は無制限。
    this.setSelectedCountMax(this.mask == 1 ? tsfManager.getInfo().getCommon().getExpPayCountMax() : 0);
};

teasp.Tsf.ListExpPay.prototype.getTargetObj = function(){
    var target;
    switch(this.listType){
    case '1': target = 'ExpApply';       break;
    case '2': target = 'EmpExp';         break;
    case '3': target = 'EmpExp';         break;
    default : target = 'ExpPreApply';    break;
    }
    return target;
};

/**
 * 精算実行
 *
 * @param {Object} obj
 */
teasp.Tsf.ListExpPay.prototype.setPaid = function(obj){
    console.log(obj);
    this.setPaidLoop(obj, 0, teasp.util.date.getToday(1)); // UTC時刻
};
/**
 * 精算実行を200件毎に実施する
 */
teasp.Tsf.ListExpPay.prototype.setPaidLoop = function(obj, index, actionTime){
    var v = obj.values;
    var target = this.getTargetObj();
    if(index >= obj.ids.length){
        console.log('setPaidLoop finish');
        this.setPaidLoopEnd(obj);
        return;
    }
    console.log('setPaidLoop of ' + index);
    // 次の200件を取得する
    var loopSize = teasp.Tsf.ListExpPay.LOOP_SIZE;
    if (target != 'ExpApply') {
        loopSize = 2000;
    }
    var ids = obj.ids.slice(index, index + loopSize);
    index += ids.length;
    var req = {
        method : 'setPaid' + target,
        idset  : ids,
        param  : {
            actionTime : teasp.util.date.formatDateTime(actionTime), // 現地時刻
            expItemId       : v.expItemId, // 画面上：精算方法
            payDate         : v.payDate, // 画面上：精算日
            payMethod       : v.payMethod, // 画面上：備考(精算時)
            sourceAccountId : (v.zgDataCheck ? v.sourceAccountId : null),
            outputJournal   : v.outputJournal
        }
    };
    tsfManager.setPaid(req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            console.log('succeed ');
            this.setPaidLoop(obj, index, actionTime);
        }else{
            teasp.Tsf.Error.showError(result);
        }
    }));
}
/**
 * 精算実行全件終了後処理(画面更新と全銀データ出力)実施する
 */
teasp.Tsf.ListExpPay.prototype.setPaidLoopEnd = function(obj){
    var v = obj.values;
    var target = this.getTargetObj();
    var req = {
        idset  : obj.ids,
        param  : {
            expItemId       : v.expItemId,
            payDate         : v.payDate,
            payMethod       : v.payMethod,
            sourceAccountId : (v.zgDataCheck ? v.sourceAccountId : null),
            outputJournal   : v.outputJournal
        }
    };
    if(req.param.outputJournal){
        var url = tsfManager.getInfo().getCommon().getExpEntryDataUrl();
        this.openOutputPage(target, req, url, true)();
    }
    if(req.param.sourceAccountId){
        setTimeout(this.openOutputPage(target, req, teasp.getPageUrl('ebDataView')), 1000);
    }
    this.refresh();
}
/**
 * Visualforceページをキック
 * 全銀データ出力、仕訳データCSV出力（ディスコ様向け）用
 * @param {string} target 支払種別
 * @param {Object} req パラメータ
 * @returns {Function}
 */
teasp.Tsf.ListExpPay.prototype.openOutputPage = function(target, req, url, targetBlank){
    return teasp.Tsf.Dom.hitch(this, function(){
        dojo.byId('payFormTarget').value          = target; // 支払種別 (ExpApply|EmpExp|ExpPreApply)
        dojo.byId('payFormExpApplyId').value      = req.idset.join(','); // 精算対象のID（カンマ区切り）
        dojo.byId('payFormAdjustExpItem').value   = req.param.expItemId || ''; // 精算方法
        dojo.byId('payFormPayDate').value         = req.param.payDate || ''; // 精算日
        dojo.byId('payFormRemarks').value         = req.param.payMethod || ''; // 備考(精算時）
        dojo.byId('payFormSourceAccountId').value = req.param.sourceAccountId || ''; // 振込元（全銀口座マスター）のID
        dojo.attr('expPayForm', 'target', (targetBlank ? '_blank' : '_top'));
        dojo.attr('expPayForm', 'action', url); // EBデータ出力のVisualforceページパス
        dojo.byId('expPayForm').submit();
    });
};

/**
 * 精算取消
 *
 */
teasp.Tsf.ListExpPay.prototype.resetPaid = function(e){
    var target = this.getTargetObj();
    var ids = this.getCheckedIds();

    if(ids.length <= 0){
        teasp.tsAlert(teasp.message.getLabel('tf10001880'));// 精算取消対象を選択してください。
        return;
    }
    console.log('checkIds is ' + ids.length);
    teasp.tsConfirm(teasp.message.getLabel('tf10001900', ids.length),this,function(result){// 選択された {0} 件に対して精算取消を行います。よろしいですか？
        if(result){
           this.resetPaidLoop(0);
        }
    });
};

/**
 * 精算取消
 *
 */
teasp.Tsf.ListExpPay.prototype.resetPaidLoop = function(index){
    console.log('resetPaidLoop of index ' + index);
    var target = this.getTargetObj();
    var checkedIds = this.getCheckedIds();
    if(index >= checkedIds.length){
        console.log('resetPaidLoop finish');
        this.refresh();
        return;
    }
    // 次の200件を取得する
    var loopSize = 200;
    if (target != 'ExpApply') {
        loopSize = 2000;
    }
    var ids = checkedIds.slice(index, index + loopSize);
    index += ids.length;
    var req = {
        method : 'resetPaid' + target,
        idset  : ids
    };
    tsfManager.resetPaid(req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            this.resetPaidLoop(index);
        }else{
            teasp.Tsf.Error.showError(result);
        }
    }));
};

// 印刷
teasp.Tsf.ListExpPay.prototype.openPrint = function(){
	var filt = this.getFilt(); // 検索条件
	var url = teasp.getPageUrl('expPrintView') + '?target=ExpPay&listType=' + this.listType;
	url += '&filt=' + encodeURIComponent(filt);

	var wh = window.open(url, 'print-pay', 'width=800,height=800,resizable=yes,scrollbars=yes');
    setTimeout(function(){ wh.resizeTo(810, 800); }, 100);
};

teasp.Tsf.ListExpPay.prototype.csvOut = function(){
    var k = '';
    switch(this.listType){
    case '1': k = 'p';  break;
    case '2': k = 'i';  break;
    case '3': k = 'c';  break;
    default : k = 't';  break;
    }
    var fname = (this.mask == 1 ? 'pay' : 'paid')
            + '_' + k
            + '_' + teasp.util.date.formatDate(new Date(), 'yyyyMMdd') + '.csv';
    this.csvDataRead(teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            this.csvOutput(fname, result);
        }else{
            teasp.Tsf.Error.showError(result);
        }
    }));
};

teasp.Tsf.ListExpPay.prototype.csvDataRead = function(callback){
    var pno = 1;
    var limit = 100;
    var countUp = true;
    var recordCount = 0;
    var records = [];
    var searchFunc = teasp.Tsf.Dom.hitch(this, function(){
        this.searchData(pno++, limit, countUp, false, function(succeed, result){
            if(succeed){
                if(countUp){
                    recordCount = result.recordsCount;
                    if(recordCount > teasp.constant.QUERY_MAX){ // Max2000件
                        teasp.tsConfirmA(teasp.message.getLabel('tf10007240' // 該当レコードが{0}件を超えますが、出力できるのは最大{0}件です。続行してよろしいですか？
                            , teasp.constant.QUERY_MAX), this,
                            function(){ // OK
                                countUp = false; // 件数チェック=オフ
                                pno = 1; // ページ番号（オフセット）を初期化
                                searchFunc(); // データ読み込みを再開
                            },
                            function(){ // キャンセル
                                callback(false, teasp.message.getLabel('tf10007250' // {0}を中止しました。
                                , teasp.message.getLabel('tk10000755')));   // CSV出力
                            }
                        );
                        recordCount = teasp.constant.QUERY_MAX; // 出力件数を最大件数にセット
                        return; // ダイアログ表示していったん抜ける
                    }
                    records = result.records || [];
                    countUp = false;
                }else{
                    records = records.concat(result.records || []);
                }
                if(records.length < recordCount){
                    searchFunc();
                }else{
                    callback(true, records);
                }
            }else{
                callback(false, result);
            }
        });
    });
    searchFunc();
};

teasp.Tsf.ListExpPay.prototype.csvOutput = function(fname, records){
    if(!records.length){
        teasp.tsAlert(teasp.message.getLabel('tm20003020'));// 該当するデータはありません 
        return;  
    }
    var heads = [];
    this.fp.fcLoop(function(fc){
        if(!fc.isHidden() && !fc.isCheck()){
            heads.push(teasp.Tsf.util.escapeCsv(fc.getLabel()));
        }
    }, this);
    var rows = '';
    for(var i = 0 ; i < records.length ; i++){
        var record = records[i];
        var vals = [];
        this.fp.fcLoop(function(fc){
            if(!fc.isHidden() && !fc.isCheck()){
                var fv = fc.parseValue(record);
                if(fc.getDomType() == 'status'){
                    vals.push(teasp.Tsf.util.escapeCsv(teasp.constant.getDisplayStatus(fv.dispValue)));
                }else{
                    vals.push(teasp.Tsf.util.escapeCsv(fv.dispValue));
                }
            }
        }, this);
        rows += vals.join(',');
        rows += '\r\n';
    }
    this.csvDownload(fname, heads.join(','), rows);
};

teasp.Tsf.ListExpPay.prototype.csvDownload = function(fname, head, value){
    if((window.navigator.msSaveBlob || dojo.isChrome || dojo.isFF) && !teasp.isSforce()){
        // IE10以降、Chrome, Firefox はブラウザの File APIを使用
        var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        var blob = new Blob([bom, head + '\r\n' + value], {"type": "text/csv"});
        // IEか他ブラウザかの判定
        if(window.navigator.msSaveBlob){
            // IEなら独自関数を使います。
            window.navigator.msSaveBlob(blob, fname);
        } else {
            // それ以外はaタグを利用してイベントを発火させます
            var a = dojo.byId('expTsfCsvDL');
            a.href = URL.createObjectURL(blob);
            a.download = fname;
            a.click();
            setTimeout(function(){
                URL.revokeObjectURL(a.href);
            }, 3000);
        }
    }else{
        // 勤怠拡張ワークにデータを一時保存して、ダウンロードする
        tsfManager.loading.show(); // お待ちくださいオン
        var key = '' + (new Date()).getTime();
        var values = teasp.util.splitByLength(value, 30000);
        var valot = [];
        var cnt = Math.ceil(values.length / 9);
        var x = 0;
        for(var i = 0 ; i < cnt ; i++){
            valot[i] = [];
            for(var j = 0 ; j < 9 ; j++){
                var k = (x * 9) + j;
                if(k < values.length){
                    valot[i].push(values[k]);
                }
            }
            x++;
        }
        var reqs = [];
        i = 0;
        do{
            reqs.push({
                method   : 'inputData',
                key      : key,
                head     : (i == 0 ? head : null),
                values   : valot[i],
                order    : (i + 1),
                hideBusy : true
            });
            i++;
        }while(i < valot.length);

        var index = 0;
        var fmeth = null;
        fmeth = teasp.Tsf.Dom.hitch(this, function(){
            tsfManager.potalAction(reqs[index], teasp.Tsf.Dom.hitch(this, function(succeed, result){
                if(succeed){
                    if(reqs.length <= (index + 1)){
                        tsfManager.loading.hide();
                        teasp.downloadHref(teasp.getPageUrl('extCsvView') + '?key=' + key + (fname ? '&fname=' + fname : ''));
                    }else{
                        index++;
                        setTimeout(fmeth, 100);
                    }
                }else{
                    tsfManager.loading.hide();
                    teasp.Tsf.Error.showError(result);
                }
            }));
        });
        fmeth();
    }
};

/**
 * テーブル作成
 *
 */
teasp.Tsf.ListExpPay.prototype.createExpPayBase = function(){
    // 表本体
    var table = this.getCheckboxTable();
    if(table){
        teasp.Tsf.Dom.empty(table);
    }
    else {
        table = this.getDomHelper().create('table', { className: 'ts-list-body ts-list-head' });
    }
    // ヘッダ部
    var colCnt = this.drawHead(table);

    var tbody = this.getDomHelper().create('tbody', null, table);

    this.records = [];
    this.recordCount = 0;
    this.drawData(tbody); // 空行を作成する

    // フッタ部
    tr = this.getDomHelper().create('tr', null, this.getDomHelper().create('tfoot', null, table));
    tr.style.height = '0px';
    this.getDomHelper().create('td', { colSpan: colCnt }, tr);

    return table;
};

/**
 * 精算対象や精算済み切替時のヘッダー作成
 *
 */
teasp.Tsf.ListExpPay.prototype.drawHead = function(table){
    // 表本体
    if (!table) {
        table = this.getCheckboxTable();
    }
    // ヘッダ部
    var thead = this.getCheckboxHead();
    if(thead){
        teasp.Tsf.Dom.empty(thead);
    }
    else {
        thead = this.getDomHelper().create('thead', null, table);
    }
    var tr = this.getDomHelper().create('tr', null, thead);
    var hkey = teasp.Tsf.Fp.setHkey(this.getDomHelper(), tr);
    var colCnt = 0;
    this.fp.fcLoop(function(fc){
        if(!fc.isHidden()){
            var th = this.getDomHelper().create('th', { id: fc.getDomId(hkey), style: { width: fc.getWidth() } }, tr);
            colCnt++;
            if(fc.isSortable()){
                teasp.Tsf.Dom.style(th, 'cursor', 'pointer');
                this.getDomHelper().connect(th, 'onclick', this, this.sortBy); // ヘッダ項目クリック
            }
            if(fc.isCheck()){
                this.getDomHelper().create('input', { type:'checkbox' }, th);
            }else{
                var div = this.getDomHelper().create('div', null, th);
                this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, div);
            }
        }
    }, this);

    // 全選択/解除
    var chk = teasp.Tsf.Dom.node('input[type="checkbox"]', tr);
    if(chk){
        this.getDomHelper().connect(chk, 'onclick', this, this.checkAll);
    }
    return colCnt;
};

teasp.Tsf.ListExpPay.prototype.drawData = function(tb){
    var colCnt = this.drawHead();
    this.setSortMarker();
    teasp.Tsf.ListBase.prototype.drawData.call(this, tb);
    this.disableCheckBox();
    this.drawFoot(colCnt);
}
/**
 * 精算対象や精算済み切替時のフッタ作成
 *
 */
teasp.Tsf.ListExpPay.prototype.drawFoot = function(colCnt){
    // 表本体
   var table = this.getCheckboxTable();
    // フッタ部
    var tfoot = this.getCheckboxFoot();
    if(tfoot){
        teasp.Tsf.Dom.empty(tfoot);
    }
    else {
        tfoot = this.getDomHelper().create('tfoot', null, table)
    }
    var tr = this.getDomHelper().create('tr', null, tfoot);
    tr.style.height = '0px';
    this.getDomHelper().create('td', { colSpan: colCnt }, tr);
}

teasp.Tsf.ListExpPay.prototype.getCheckboxTable = function(e){
    return this.getListArea();
};
teasp.Tsf.ListExpPay.prototype.getCheckboxFoot = function(e){
    return teasp.Tsf.Dom.node('tfoot', this.getListArea());
};
