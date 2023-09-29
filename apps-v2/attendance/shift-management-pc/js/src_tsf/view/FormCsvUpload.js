/**
 * CSVインポート用
 *
 * @constructor
 */
teasp.Tsf.FormCsvUpload = function(){
    this.sections = [];
    this.IMAGE_EVENT_KEY = 'expPrint';
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.csvUpload);
};

teasp.Tsf.FormCsvUpload.prototype = new teasp.Tsf.FormBase();

teasp.Tsf.FormCsvUpload.prototype.initFp = function(objBase){
};

teasp.Tsf.FormCsvUpload.prototype.isReadOnly = function(){
    return tsfManager.isReadMode();
};

teasp.Tsf.FormCsvUpload.prototype.isAttach = function(){
    return (tsfManager.getAction() == 'attach');
};

teasp.Tsf.FormCsvUpload.prototype.getOpenerToken = function(){
    var token = null;
    try{
        token = window.opener.tsfManager.getToken();
    }catch(e){}
    return token;
};

/**
 * 呼び出し元との同期を確認する
 * @returns {boolean}
 */
teasp.Tsf.FormCsvUpload.prototype.checkOpenerToken = function(){
    var token = this.getOpenerToken();
    if(!this.token || !token || this.token.csvImportToken != token.csvImportToken){ // トークンが変わっている
        teasp.tsAlert(teasp.message.getLabel('ci00000120')); // 呼び出し元と同期が取れません。この操作は無効です。
        return false;
    }
    this.token = token;
    return true;
};

teasp.Tsf.FormCsvUpload.prototype.initOpenerAssist = function(){
    this.assist = null;
    this.expenseType = null;
    try{
        this.assist = window.opener.tsfManager.getAssistParam();
        if(this.assist){
            this.expenseType = this.assist.ExpenseType__c || null;
        }
    }catch(e){}
};

/**
 * 画面更新
 *
 * @override
 * @param {Object} objBase
 */
teasp.Tsf.FormCsvUpload.prototype.refresh = function(){
    teasp.Tsf.Dom.show(teasp.Tsf.Dom.byId('attachExpView'), null, false);
    this.token = this.getOpenerToken();
    this.init();
    this.show();
    setTimeout(teasp.Tsf.Dom.hitch(this, function(){
        if(!this.token || !this.token.csvImportToken){ // トークンが取れてない
            teasp.tsAlert(teasp.message.getLabel('ci00000120'),this,function(){// 呼び出し元と同期が取れません。この操作は無効です。
                this.close();
            }); 
        }
    }), 100);
};

teasp.Tsf.FormCsvUpload.prototype.createBase = function(){
    var table = this.getDomHelper().create('table', { style: 'width:100%;' });
    var tbody = this.getDomHelper().create('tbody', null, table);
    // 申請番号、ステータス、押印欄
    this.createTop1(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));

    teasp.Tsf.Dom.append(teasp.Tsf.Dom.byId(this.parentId), table);

    return table;
};

/**
 * 上１：左右
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormCsvUpload.prototype.createTop1 = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-top1' }, area);
    var tr = this.getDomHelper().create('tr', null, this.getDomHelper().create('tbody', null, table));
    this.createTop1L(this.getDomHelper().create('td', { style: 'padding-right:4px;' }, tr));

    return table;
};

/**
 * 上１左：上下
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormCsvUpload.prototype.createTop1L = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-top1L' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);
    var tr = this.getDomHelper().create('tr', null, tbody);
    var td = this.getDomHelper().create('td', null, tr);
    this.createTop1LU(td);

    return table;
};

/**
 * 上1左上：プリンタへ出力、閉じるボタン、捺印枠
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormCsvUpload.prototype.createTop1LU = function(area){
    var table = this.getDomHelper().create('table', null, area);
    var tbody = this.getDomHelper().create('tbody', null, table);
    var tr = this.getDomHelper().create('tr', null, tbody);

    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('ci00000010'), style: 'margin-right:50px;' } // CSV読込
        , this.getDomHelper().create('td', { style: 'text-align:left;padding-left:15px;' }, tr));

    this.getDomHelper().create('div', { style: 'margin-right:50px;' } // 精算区分
        , this.getDomHelper().create('td', { className: 'csv-expense-type', style: 'text-align:left;display:none;' }, tr));

    // 「閉じる」ボタン
    var btn3 = this.getDomHelper().create('button', { className: 'std-button2' }
        , this.getDomHelper().create('td', { className: 'buttons' }, tr));
    this.getDomHelper().connect(btn3, 'onclick', this, this.close);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('close_btn_title') }, btn3);

    return table;
};

teasp.Tsf.FormCsvUpload.prototype.close = function(){
    tsfManager.closeCsvImport();
    (window.open('','_top').opener=top).close();
    return false;
};

teasp.Tsf.FormCsvUpload.prototype.refExpenseType = function(){
    this.initOpenerAssist();
    var eta = teasp.Tsf.Dom.node('.csv-expense-type', dojo.byId('tsfFormArea'));
    teasp.Tsf.Dom.show(eta , null, (this.expenseType ? true : false));
    var n = teasp.Tsf.Dom.node('div', eta);
    if(n){
        n.innerHTML = teasp.message.getLabel('ci00000040', (this.expenseType || '')); // 精算区分：{0}
    }
};

/**
 * CSV読込のヘッダ、データ情報をセット
 * @param {Array.<Object>} csvHeader
 * @param {Array.<Object>} csvData
 * @param {Array.<Object>} csvPayees
 * @param {Array.<Object>} csvDepts
 * @param {Array.<Object>} csvJobs
 * @param {string} fname
 */
teasp.Tsf.FormCsvUpload.prototype.setCsvData = function(csvHeaders, csvDatas, csvPayees, csvDepts, csvJobs, fname){
    this.refExpenseType();
    var details = teasp.Tsf.Dom.byId('attachExpView');
    var results = teasp.Tsf.Dom.byId('csvResultList');
    var csvImp  = teasp.Tsf.Dom.byId('csvImport');
    var csvMsg  = teasp.Tsf.Dom.byId('csvImportMsg');
    teasp.Tsf.Dom.show(details , null, false);
    teasp.Tsf.Dom.show(results , null, false);
    teasp.Tsf.Dom.show(csvImp  , null, false);
    teasp.Tsf.Dom.show(csvMsg  , null, false);
    if(!csvHeaders.length && !csvDatas.length){
        return;
    }
    var csvImportLogic = new teasp.Tsf.CsvImportLogic();
    csvImportLogic.convertCsvData({
        headers : csvHeaders,
        datas   : csvDatas,
        payees  : csvPayees,
        depts   : csvDepts,
        jobs    : csvJobs,
        fname   : fname,
        expenseType : this.expenseType,
        targetEmp   : window.opener.tsfManager.getTargetEmp()
    });

    teasp.Tsf.Dom.node('textarea', details).value = csvImportLogic.getDetails();
    var data = csvImportLogic.getImportData();
    if(data.recordCnt){
        if(data.valids.length){ // 有効データあり
            // インポート実行ボタンを可視化、イベントハンドラセット
            teasp.Tsf.Dom.show(csvImp, null, true);
            this.getDomHelper().freeBy('csvImport');
            var n = teasp.Tsf.Dom.node('button', csvImp);
            if(n){
                this.getDomHelper().connect(n, 'onclick', this, function(){
                    if(!window.opener || window.opener.closed){
                        teasp.tsAlert(teasp.message.getLabel('ci00000140'),this,function(){// インポートできません。\n呼び出し元が閉じられています。
                            this.close();
                        }); 
                    	return;
                    }
                    var orgCount = this.token.rowCount || 0;
                    if((orgCount + data.valids.length) > tsfManager.getExpCountLimit()){
                        teasp.tsAlert(teasp.message.getLabel('ci00000180', tsfManager.getExpCountLimit()));// 明細数が上限（{0}）を超えるため、インポートできません。
                        return;
                    }
                    window.opener.tsfManager.startCsvImport();
                    teasp.Tsf.Dom.setUIBlock(true);
                    setTimeout(this.doCsvImport(csvImportLogic.getCOL(), data), 100);
                }, 'csvImport');
            }
        }else{
            csvMsg.innerHTML = teasp.message.getLabel('ci00000080'); // インポート可能なデータはありません。
            teasp.Tsf.Dom.show(csvMsg, null, true);
        }
        teasp.Tsf.Dom.node('.csv-result-all'  , results).innerHTML = teasp.message.getLabel('ci00000090', data.recordCnt);     // 全データ件数：{0}
        teasp.Tsf.Dom.node('.csv-result-valid', results).innerHTML = teasp.message.getLabel('ci00000100', data.valids.length); // 有効データ件数：{0}
        teasp.Tsf.Dom.node('.csv-result-error', results).innerHTML = teasp.message.getLabel('ci00000110', data.errorCnt);      // エラー件数：{0}
        teasp.Tsf.Dom.show(results, null, true);
    }
    teasp.Tsf.Dom.show(details, null, true);
    teasp.Tsf.MainCsvUpload.resize();
};

/**
 * インポート実行
 * @param {Object} COL
 * @param {Object} data
 * @returns {Function}
 */
teasp.Tsf.FormCsvUpload.prototype.doCsvImport = function(COL, data){
    return teasp.Tsf.Dom.hitch(this, function(){
        if(!this.checkOpenerToken()){
            teasp.Tsf.Dom.setUIBlock(false);
            this.close();
            return;
        }
        try{
            window.opener.tsfManager.appliedEmpExp(COL, data);
            this.close();
        }catch(e){
            teasp.Tsf.Dom.setUIBlock(false);
            teasp.tsAlert(teasp.message.getLabel('ci00000130') + '\n' + e.message); // インポートで例外が発生しました。
        }
    });
};
