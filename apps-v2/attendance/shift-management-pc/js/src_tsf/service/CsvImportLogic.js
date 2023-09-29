/**
 * CSVインポートデータ作成
 *
 * @constructor
 */
teasp.Tsf.CsvImportLogic = function(){
    /**
     * インポートデータ
     * @type {{valids:Array.<Object>,
     *         errors:Array.<string>,
     *         errorCnt:number,
     *         recordCnt:number
     *       }}
     */
    this.importData = '';
    /**
     * 詳細情報
     * @type {string}
     */
    this.details    = '';
    /**
     * メッセージ
     * @type {string}
     */
    this.message    = '';
    /**
     * フィールド情報
     * @type {Object}
     */
    this.COL = null;
};

teasp.Tsf.CsvImportLogic.prototype.getImportData = function(){
    return this.importData;
};

teasp.Tsf.CsvImportLogic.prototype.setImportData = function(data){
    this.importData = data;
};

teasp.Tsf.CsvImportLogic.prototype.getDetails = function(){
    return this.details;
};

teasp.Tsf.CsvImportLogic.prototype.initDetails = function(){
    this.details = '';
};

teasp.Tsf.CsvImportLogic.prototype.addDetails = function(msg){
    this.details += (msg + '\n');
};

teasp.Tsf.CsvImportLogic.prototype.getMessage = function(){
    return this.message;
};

teasp.Tsf.CsvImportLogic.prototype.setMessage = function(msg){
    this.message = msg;
};

teasp.Tsf.CsvImportLogic.prototype.getCOL = function(){
    return this.COL;
};

/**
 * CSV読込のヘッダ、データ情報をセット
 * @param {{headers:string,
 *          datas:string,
 *          fname:string,
 *          payees:Array.<Object>,
 *          depts:Array.<Object>,
 *          jobs:Array.<Object>
 *        }} csvData
 */
teasp.Tsf.CsvImportLogic.prototype.convertCsvData = function(csvData){
    this.payees  = csvData.payees;
    this.depts   = csvData.depts;
    this.jobs    = csvData.jobs;
    this.expenseType = csvData.expenseType;
    this.targetEmp = csvData.targetEmp;
    var records = csvData.datas;

    var headm = {};
    dojo.forEach(csvData.headers, function(p){ headm[p.name] = p.label; });
    var COL = {
        DATE           : {key:'Date'          ,name:headm.Date           || teasp.message.getLabel('tf10000940')       }, // 利用日
        ITEM_CODE      : {key:'ItemCode'      ,name:headm.ItemCode       || teasp.message.getLabel('tk10000074')       }, // 費目コード
        COST           : {key:'Cost'          ,name:headm.COST           || teasp.message.getLabel('tf10000950')       }, // 金額
        DETAIL         : {key:'Detail'        ,name:headm.Detail         || teasp.message.getLabel('note_caption')     }, // 備考
        UNIT_PRICE     : {key:'UnitPrice'     ,name:headm.UnitPrice      || teasp.message.getLabel('tm20004720')       }, // 単価
        QUANTITY       : {key:'Quantity'      ,name:headm.Quantity       || teasp.message.getLabel('tm20004730')       }, // 数量
        START_NAME     : {key:'StartName'     ,name:headm.StartName      || teasp.message.getLabel('stationFrom_label')}, // 出発
        END_NAME       : {key:'EndName'       ,name:headm.EndName        || teasp.message.getLabel('stationTo_label')  }, // 到着
        ROUND_TRIP     : {key:'RoundTrip'     ,name:headm.RoundTrip      || teasp.message.getLabel('tk10000075')       }, // 往復
        CURRENCY_NAME  : {key:'CurrencyName'  ,name:headm.CurrencyName   || teasp.message.getLabel('tk10000699')       }, // 通貨記号
        CURRENCY_RATE  : {key:'CurrencyRate'  ,name:headm.CurrencyRate   || teasp.message.getLabel('tm20004190')       }, // 換算レート
        FOREIGN_AMOUNT : {key:'ForeignAmount' ,name:headm.ForeignAmount  || teasp.message.getLabel('tm20004200')       }, // 現地金額
        WITHOUT_TAX    : {key:'WithoutTax'    ,name:headm.WithoutTax     || teasp.message.getLabel('tm20004110')       }, // 税抜金額
        TAX            : {key:'Tax'           ,name:headm.Tax            || teasp.message.getLabel('tm20004120')       }, // 消費税額
        TAX_RATE       : {key:'TaxRate'       ,name:headm.TaxRate        || teasp.message.getLabel('tm20004100')       }, // 税率
        JOB_CODE       : {key:'JobCode'       ,name:headm.JobCode        || teasp.message.getLabel('tm20001020')       }, // ジョブコード
        PAYEE_CODE     : {key:'PayeeCode'     ,name:headm.PayeeCode      || teasp.message.getLabel('ci00000150')       }, // 支払先コード
        PAYMENT_DATE   : {key:'PaymentDate'   ,name:headm.PaymentDate    || teasp.message.getLabel('tf10000590')       }, // 支払日
        DEPT_CODE      : {key:'ChargeDeptCode',name:headm.ChargeDeptCode || teasp.message.getLabel('tf10006001')       }, // 負担部署コード
        EXTRA_ITEM_1   : {key:'ExtraItem1'    ,name:headm.ExtraItem1     || teasp.message.getLabel('tm20004576')       }, // 拡張項目1
        EXTRA_ITEM_2   : {key:'ExtraItem2'    ,name:headm.ExtraItem2     || teasp.message.getLabel('tm20004577')       }, // 拡張項目2
        PAYEE_INFO     : {key:'PayeeInfo'     }, // (CSV項目ではない)
        DEPT_INFO      : {key:'ChargeDeptInfo'}, // (CSV項目ではない)
        JOB_INFO       : {key:'JobInfo'       }, // (CSV項目ではない)
        TAX_AUTO       : {key:'TaxAuto'       }, // (CSV項目ではない)
        TAX_TYPE       : {key:'TaxType'       }, // (CSV項目ではない)
        TRANSPORT_TYPE : {key:'TransportType' }, // (CSV項目ではない)
        DUMMY: null
    };
    this.COL = COL;

    this.initDetails();
    if(csvData.fname){ // ファイル名あり
        this.addDetails(teasp.message.getLabel('ci00000050', csvData.fname)); // ファイル名：{0}
    }
    var data = this.parseCsvData(COL, records);
    if(!records.length){
        this.addDetails(teasp.message.getLabel('ci00000060')); // データがありません。
    }else{
        if(data.errors.length){ // エラーあり
            this.addDetails(teasp.message.getLabel('ci00000070')); // 下記のエラーがあります。
            this.addDetails(data.errors.join('\n'));
        }
        this.setImportData(data);
        if(!data.valids.length){ // 有効データあり
            this.setMessage(teasp.message.getLabel('ci00000080')); // インポート可能なデータはありません。
        }
    }
};

/**
 * CSVデータ解析
 * @param {Object} COL
 * @param {Array.<Object>} records
 * @returns {Object}
 */
teasp.Tsf.CsvImportLogic.prototype.parseCsvData = function(COL, records){
    var errors = [];
    var valids = [];
    var lineNo = 0;
    var errorCnt = 0;
    for(var i = 0 ; i < records.length ; i++){
        var record = records[i];
        // 初期値をセット
        record[COL.TAX_AUTO.key]       = true;
        record[COL.TAX_TYPE.key]       = null;
        record[COL.TRANSPORT_TYPE.key] = '0';
        lineNo++;
        var car = {
            er:[],
            addError : function(msg){ this.er.push(msg); },
            getErrors: function(){ return this.er; },
            hasError : function(){ return this.er.length; }
        };
        this.checkRequire1(COL, lineNo, record, car);   // 必須項目のチェック
        this.checkLength  (COL, lineNo, record, car);   // サイズのチェック
        this.checkDate    (COL, lineNo, record, car);   // 利用日のチェック
        this.checkNumeric (COL, lineNo, record, car);   // 数値（金額）のチェック
        if(!car.hasError()){
            var expItem = this.getExpItemByItemCode(COL, lineNo, record, car);
            this.checkByExpItem(expItem, COL, lineNo, record, car); // 費目毎のチェック
            this.checkPayeeInfo(COL, lineNo, record, car); // 支払先のチェック
            this.checkDeptInfo (COL, lineNo, record, car); // 負担部署のチェック
            this.checkJobInfo  (COL, lineNo, record, car); // ジョブのチェック
            this.checkExpItemClass(expItem, COL, lineNo, record, car); // 費目表示区分のチェック
            this.checkRequire2(expItem, COL, lineNo, record, car);     // 必須項目のチェック２
        }
        if(!car.hasError()){
            valids.push(record);
        }else{
            errorCnt++;
            errors = errors.concat(car.getErrors());
        }
    }
    return {
        valids    : valids,
        errors    : errors,
        errorCnt  : errorCnt,
        recordCnt : records.length
    };
};

/**
 * エラーメッセージ作成A
 * @param {number|string} lineNo
 * @param {string} msgId
 * @param {string} v
 * @returns {string}
 */
teasp.Tsf.CsvImportLogic.prototype.createMessageA = function(lineNo, msgId, v){
    return teasp.message.getLabel('ci00001010', lineNo) // {0}件目エラー：
        + teasp.message.getLabel(msgId, v);
};

/**
 * エラーメッセージ作成B
 */
teasp.Tsf.CsvImportLogic.prototype.createMessageB = function(lineNo, msgId, v1, v2){
    return teasp.message.getLabel('ci00001010', lineNo) // {0}件目エラー：
        + teasp.message.getLabel(msgId, v1, v2);
};

/**
 * エラーメッセージ作成C
 */
teasp.Tsf.CsvImportLogic.prototype.createMessageC = function(lineNo, msgId, v1, v2, v3){
    return teasp.message.getLabel('ci00001010', lineNo) // {0}件目エラー：
        + teasp.message.getLabel(msgId, v1, v2, v3);
};

/**
 * 必須項目チェック１
 * @param {Object} COL
 * @param {number|string} lineNo
 * @param {Object} record
 * @param {Object} car
 */
teasp.Tsf.CsvImportLogic.prototype.checkRequire1 = function(COL, lineNo, record, car){
    var miss = [];
    if(!record[COL.DATE.key]){
        miss.push(COL.DATE.name);
    }
    if(!record[COL.ITEM_CODE.key]){
        miss.push(COL.ITEM_CODE.name);
    }
    if(miss.length){
        car.addError(this.createMessageA(lineNo, 'ci00001020', miss.join(','))); // {0}が入力されていません。
    }
};

/**
 * 必須項目チェック２
 *
 */
teasp.Tsf.CsvImportLogic.prototype.checkRequire2 = function(expItem, COL, lineNo, record, car){
    var miss = [];
    var excs = [];

    if(tsfManager.isRequireChargeDept() == 2 && !record[COL.DEPT_CODE.key]){ miss.push(COL.DEPT_CODE.name); } // 負担部署入力必須
    if(tsfManager.isRequireChargeDept() == 0 &&  record[COL.DEPT_CODE.key]){ excs.push(COL.DEPT_CODE.name); } // 負担部署入力しない
    if(expItem){
        if(expItem.isRequireChargeJob() == 2 && !record[COL.JOB_CODE.key]){ miss.push(COL.JOB_CODE.name); } // ジョブ入力必須
        if(expItem.isRequireChargeJob() == 0 &&  record[COL.JOB_CODE.key]){ excs.push(COL.JOB_CODE.name); } // ジョブ入力しない
        var extraItem1 = expItem.getExtraItem(1);
        var extraItem2 = expItem.getExtraItem(2);
        if( extraItem1 && extraItem1.require && !record[COL.EXTRA_ITEM_1.key]){ miss.push(COL.EXTRA_ITEM_1.name); } // 拡張項目１入力必須
        if( extraItem2 && extraItem2.require && !record[COL.EXTRA_ITEM_2.key]){ miss.push(COL.EXTRA_ITEM_2.name); } // 拡張項目２入力必須
        if(!extraItem1                       &&  record[COL.EXTRA_ITEM_1.key]){ excs.push(COL.EXTRA_ITEM_1.name); } // 拡張項目１入力なし
        if(!extraItem2                       &&  record[COL.EXTRA_ITEM_2.key]){ excs.push(COL.EXTRA_ITEM_2.name); } // 拡張項目２入力なし
    }
    if(miss.length){
        car.addError(this.createMessageA(lineNo, 'ci00001020', miss.join(','))); // {0}が入力されていません。
    }
    if(excs.length){
        car.addError(this.createMessageB(lineNo, 'ci00001140', excs.join(','))); // {0}の値はインポートされません。
    }
};

/**
 * サイズをチェック
 */
teasp.Tsf.CsvImportLogic.prototype.checkLength = function(COL, lineNo, record, car){
    this.checkLengthInner1(COL.DETAIL        , lineNo, record, car, 255); // 備考
    this.checkLengthInner1(COL.EXTRA_ITEM_1  , lineNo, record, car, 255); // 拡張項目1
    this.checkLengthInner1(COL.EXTRA_ITEM_2  , lineNo, record, car, 255); // 拡張項目2
    this.checkLengthInner1(COL.START_NAME    , lineNo, record, car,  80); // 出発
    this.checkLengthInner1(COL.END_NAME      , lineNo, record, car,  80); // 到着
    this.checkLengthInner1(COL.CURRENCY_NAME , lineNo, record, car,  20); // 通貨記号
    this.checkLengthInner1(COL.ITEM_CODE     , lineNo, record, car,  20); // 費目コード
    this.checkLengthInner1(COL.JOB_CODE      , lineNo, record, car,  20); // ジョブコード
    this.checkLengthInner1(COL.PAYEE_CODE    , lineNo, record, car,  20); // 支払先コード
    this.checkLengthInner1(COL.DEPT_CODE     , lineNo, record, car,  20); // 負担部署コード
    this.checkLengthInner1(COL.DATE          , lineNo, record, car,  10); // 利用日
    this.checkLengthInner1(COL.PAYMENT_DATE  , lineNo, record, car,  10); // 支払日
    this.checkLengthInner1(COL.ROUND_TRIP    , lineNo, record, car,   5); // 往復
};

/**
 * サイズをチェック
 */
teasp.Tsf.CsvImportLogic.prototype.checkLengthInner1 = function(col, lineNo, record, car, maxLen){
    if(record[col.key] && typeof(record[col.key]) == 'string'){
        record[col.key] = record[col.key].trim();
        record[col.key] = record[col.key].replace(/\r?\n/g, ' ');
        if(record[col.key].length > maxLen){
            car.addError(this.createMessageA(lineNo, 'ci00001050', col.name)); // {0}の値がサイズオーバーです。
        }
    }
};

/**
 * 利用日をチェック
 */
teasp.Tsf.CsvImportLogic.prototype.checkDate = function(COL, lineNo, record, car){
    this.checkDateInner1(COL.DATE        , lineNo, record, car); // 利用日
    this.checkDateInner1(COL.PAYMENT_DATE, lineNo, record, car); // 支払日
};

/**
 * 利用日をチェック
 */
teasp.Tsf.CsvImportLogic.prototype.checkDateInner1 = function(col, lineNo, record, car){
    if(record[col.key]){
        var d = teasp.Tsf.CsvImportLogic.parseDate(record[col.key]);
        if(!d.isValid()){
            car.addError(this.createMessageA(lineNo, 'ci00001030', col.name)); // {0}が不正です。
        }else{
            record[col.key] = d.format('YYYY-MM-DD'); // 整形して再格納
        }
    }
};

teasp.Tsf.CsvImportLogic.parseDate = function(val){
    var d = moment(val, 'YYYY/M/D', true);
    if(d.isValid()){
        return d;
    }
    d = moment(val, 'YYYY-M-D', true);
    if(d.isValid()){
        return d;
    }
    d = moment(val, 'YYYY.M.D', true);
    return d;
};

/**
 * 数値（金額）をチェック
 */
teasp.Tsf.CsvImportLogic.prototype.checkNumeric = function(COL, lineNo, record, car){
    this.checkNumericInner1(COL.COST          , lineNo, record, car, 0, 12); // 金額
    this.checkNumericInner1(COL.UNIT_PRICE    , lineNo, record, car, 0, 12); // 単価
    this.checkNumericInner1(COL.QUANTITY      , lineNo, record, car, 0, 12); // 数量

    this.checkNumericInner1(COL.CURRENCY_RATE , lineNo, record, car, 6, 12); // 換算レート
    this.checkNumericInner1(COL.FOREIGN_AMOUNT, lineNo, record, car, 6, 12); // 現地金額

    this.checkNumericInner1(COL.WITHOUT_TAX   , lineNo, record, car, 0, 12); // 税抜金額
    this.checkNumericInner1(COL.TAX           , lineNo, record, car, 0, 12); // 消費税額
    this.checkNumericInner1(COL.TAX_RATE      , lineNo, record, car, 0,  3); // 税率

    // マイナスがありえない項目をチェック
    this.checkNumericInner2(COL.QUANTITY     , lineNo, record, car); // 数量
    this.checkNumericInner2(COL.CURRENCY_RATE, lineNo, record, car); // 換算レート
    this.checkNumericInner2(COL.TAX_RATE     , lineNo, record, car); // 税率
};

/**
 * 数値型の値の書式チェック、数値型に変換して再格納
 * ※値がセットされている場合だけ行う（undefined, "" はスルー）
 *
 * @param {Object} col
 * @param {number} lineNo
 * @param {Object} record
 * @param {Object} car
 * @param {number} fn 小数点以下桁数
 * @param {number} ds 整数部桁数
 */
teasp.Tsf.CsvImportLogic.prototype.checkNumericInner1 = function(col, lineNo, record, car, fn, ds){
    var n = record[col.key];
    if(n && typeof(n) == 'string'){
        n = n.trim();
        if(!/^\-?[\d,\.]+$/.test(n)){ // 数字、カンマ、マイナス記号、ピリオド以外の文字がある
            car.addError(this.createMessageA(lineNo, 'ci00001030', col.name)); // {0}が不正です。
            return;
        }
        var s = n.replace(/[\-,]+/g, ''); // カンマ、マイナス記号を除去（数字とピリオドだけにする）
        var z = s.split('.'); // ピリオドで分ける
        if(z.length > 2 || (!fn && z.length > 1)){ // 3つ以上に分割されるか、fn==0で2つ以上に分割されたらエラー
            car.addError(this.createMessageA(lineNo, 'ci00001030', col.name)); // {0}が不正です。
            return;
        }
        if(z[0].length > ds || (z.length > 1 && z[1].length > fn)){
            car.addError(this.createMessageA(lineNo, 'ci00001050', col.name)); // {0}の値がサイズオーバーです。
            return;
        }
    }
    if(n || typeof(n) == 'number'){
        var o = teasp.util.currency.formatDecimal(n, fn, 6, true);
        record[col.key] = o.n;
    }
};

/**
 * マイナスの値をチェック
 */
teasp.Tsf.CsvImportLogic.prototype.checkNumericInner2 = function(col, lineNo, record, car){
    if(record[col.key] && record[col.key] < 0){
        car.addError(this.createMessageA(lineNo, 'ci00001060', col.name)); // {0}の値がマイナスです。
    }
};

/**
 * 費目を取得
 * @param {Object} COL
 * @param {number|string} lineNo
 * @param {Object} record
 * @param {Object} car
 */
teasp.Tsf.CsvImportLogic.prototype.getExpItemByItemCode = function(COL, lineNo, record, car){
    var itemCode = record[COL.ITEM_CODE.key];
    var expItem = tsfManager.getExpItemByItemCode(itemCode);
    if(!expItem){
        car.addError(this.createMessageB(lineNo, 'ci00001040', COL.ITEM_CODE.name, itemCode)); // {0}:'{1}'の該当はありません。
    }else if(expItem.isRemoved()){
        car.addError(this.createMessageB(lineNo, 'ci00001130', COL.ITEM_CODE.name, itemCode)); // {0}:'{1}'は無効です。
    }
    return expItem;
};

/**
 * 費目の設定別入力チェック
 * ※ checkNumeric() の実行後に呼ばれること
 * @param {teasp.Tsf.ExpItem} expItem
 * @param {Object} COL
 * @param {number|string} lineNo
 * @param {Object} record
 * @param {Object} car
 */
teasp.Tsf.CsvImportLogic.prototype.checkByExpItem = function(expItem, COL, lineNo, record, car){
    if(!expItem){
        return;
    }
    // 費目が精算区分に整合するか
    if(!expItem.checkExpenseType(this.expenseType)){
        car.addError(this.createMessageB(lineNo, 'ci00001110', COL.ITEM_CODE.name, expItem.getItemCode())); // {0}:'{1}'と精算区分が整合しません。
        return;
    }
    if(!expItem.isAllowMinus()){ // マイナスを許可しない
        this.checkNumericInner2(COL.COST          , lineNo, record, car); // 金額
        this.checkNumericInner2(COL.UNIT_PRICE    , lineNo, record, car); // 単価
        this.checkNumericInner2(COL.FOREIGN_AMOUNT, lineNo, record, car); // 現地金額
        this.checkNumericInner2(COL.WITHOUT_TAX   , lineNo, record, car); // 税抜金額
        this.checkNumericInner2(COL.TAX           , lineNo, record, car); // 消費税額
    }
    if(expItem.isTaxFlag() && expItem.getTaxType() != '0'){ // 消費税入力ありかつ消費税タイプ＝無税以外
        if(typeof(record[COL.COST.key]) != 'number' && typeof(record[COL.WITHOUT_TAX.key]) != 'number'){ // 金額と税抜金額ともに値なし
            var miss = [];
            miss.push(COL.COST.name);
            miss.push(COL.WITHOUT_TAX.name);
            car.addError(this.createMessageA(lineNo, 'ci00001020', miss.join(','))); // {0}が入力されていません。
        }
    }else if(typeof(record[COL.COST.key]) != 'number'){ // 金額と税抜金額ともに空
        car.addError(this.createMessageA(lineNo, 'ci00001020', COL.COST.name)); // {0}が入力されていません。
    }
    // 金額の値がない可能性があるので、まず消費税入力の費目をチェックする
    this.checkByExpItemTax      (expItem, COL, lineNo, record, car); // 消費税入力の費目
    this.checkByExpItemQuantity (expItem, COL, lineNo, record, car); // 数量ありの費目
    this.checkByExpItemTransport(expItem, COL, lineNo, record, car); // 交通費の費目
    this.checkByExpItemFixAmount(expItem, COL, lineNo, record, car); // 金額固定の費目
    this.checkByExpItemForeign  (expItem, COL, lineNo, record, car); // 外貨入力の費目
};

/**
 * 数量ありの費目に関するチェック
 */
teasp.Tsf.CsvImportLogic.prototype.checkByExpItemQuantity = function(expItem, COL, lineNo, record, car){
    if(expItem.isEnableQuantity()){ // 数量あり
        // 単価、数量は必須
        var miss = [];
        if(!record[COL.UNIT_PRICE.key]){ miss.push(COL.UNIT_PRICE.name); }
        if(!record[COL.QUANTITY.key]  ){ miss.push(COL.QUANTITY.name);   }
        if(miss.length){
            car.addError(this.createMessageA(lineNo, 'ci00001020', miss.join(','))); // {0}が入力されていません。
        }else if(record[COL.COST.key]){
            // 単価×数量と金額の値をチェック
            var v = record[COL.UNIT_PRICE.key] * record[COL.QUANTITY.key];
            if(record[COL.COST.key] != v){
                car.addError(this.createMessageC(lineNo, 'ci00001070', COL.UNIT_PRICE.name, COL.QUANTITY.name, COL.COST.name)); // {0}、{1}、{2}の関係が正しくありません。
            }
        }
    }else{
        var excs = [];
        if(record[COL.UNIT_PRICE.key]){ excs.push(COL.UNIT_PRICE.name); }
        if(record[COL.QUANTITY.key]  ){ excs.push(COL.QUANTITY.name);   }
        if(excs.length){
            car.addError(this.createMessageA(lineNo, 'ci00001140', excs.join(','))); // {0}の値はインポートされません。
        }
        record[COL.UNIT_PRICE.key] = null;
        record[COL.QUANTITY.key]   = null;
    }
};

/**
 * 交通費の費目に関するチェック
 */
teasp.Tsf.CsvImportLogic.prototype.checkByExpItemTransport = function(expItem, COL, lineNo, record, car){
    if(expItem.getTransportType() != '0'){ // 交通費
        record[COL.TRANSPORT_TYPE.key] = '2'; // 強制で「手入力の交通費」とする
        // 出発・到着は必須
        var miss = [];
        if(!record[COL.START_NAME.key]){ miss.push(COL.START_NAME.name); }
        if(!record[COL.END_NAME.key]  ){ miss.push(COL.END_NAME.name);   }
        if(!record[COL.ROUND_TRIP.key]){
            record[COL.ROUND_TRIP.key] = false;
        }else{
            var s = record[COL.ROUND_TRIP.key].toLowerCase();
            if(s == 'true' || s == 'yes' || s == 'on'){
                record[COL.ROUND_TRIP.key] = true;
            }else if(s == 'false' || s == 'no' || s == 'off'){
                record[COL.ROUND_TRIP.key] = false;
            }else{
                car.addError(this.createMessageA(lineNo, 'ci00001030', COL.ROUND_TRIP.name)); // {0}が不正です。
            }
        }
        if(miss.length){
            car.addError(this.createMessageA(lineNo, 'ci00001020', miss.join(','))); // {0}が入力されていません。
        }
    }else{ // 交通費以外
        var excs = [];
        if(record[COL.START_NAME.key]){ excs.push(COL.START_NAME.name); }
        if(record[COL.END_NAME.key]  ){ excs.push(COL.END_NAME.name);   }
        if(record[COL.ROUND_TRIP.key]){ excs.push(COL.ROUND_TRIP.name); }
        if(excs.length){
            car.addError(this.createMessageA(lineNo, 'ci00001140', excs.join(','))); // {0}の値はインポートされません。
        }
        record[COL.START_NAME.key] = null;
        record[COL.END_NAME.key]   = null;
        record[COL.ROUND_TRIP.key] = false;
    }
};

/**
 * 金額固定の費目に関するチェック
 */
teasp.Tsf.CsvImportLogic.prototype.checkByExpItemFixAmount = function(expItem, COL, lineNo, record, car){
    if(record[COL.COST.key]
    && expItem.isFixAmount()
    && (!expItem.isForeignFlag() || !expItem.getCurrencyName())){ // 金額固定かつ（外貨入力しないまたは外貨指定なし）
        // 金額が費目の設定値と異なる場合はエラー（外貨入力＋外貨指定ありのケースは checkByExpItemForeign の中でチェック）
        var fixAmount = expItem.getCost();
        if(fixAmount != record[COL.COST.key]){
            car.addError(this.createMessageA(lineNo, 'ci00001080', expItem.getName())); // {0}は固定の金額と一致しません。
        }
    }
};

/**
 * 外貨入力する費目に関するチェック
 */
teasp.Tsf.CsvImportLogic.prototype.checkByExpItemForeign = function(expItem, COL, lineNo, record, car){
    if(expItem.isForeignFlag()){ // 外貨入力あり
        // 通貨記号、換算レート、現地金額は必須
        var miss = [];
        if(!record[COL.CURRENCY_NAME.key] ){ miss.push(COL.CURRENCY_NAME.name);  } // 通貨記号
        if(!record[COL.CURRENCY_RATE.key] ){ miss.push(COL.CURRENCY_RATE.name);  } // 換算レート
        if(!record[COL.FOREIGN_AMOUNT.key]){ miss.push(COL.FOREIGN_AMOUNT.name); } // 現地金額
        if(miss.length){
            car.addError(this.createMessageA(lineNo, 'ci00001020', miss.join(','))); // {0}が入力されていません。
        }else if(expItem.isFixAmount() && expItem.getCurrencyName()){ // 金額固定かつ外貨指定あり
            var fixAmount = expItem.getCost();
            if(fixAmount != record[COL.FOREIGN_AMOUNT.key]){
                car.addError(this.createMessageA(lineNo, 'ci00001080', expItem.getName())); // {0}は固定の金額と一致しません。
            }
        }else if(record[COL.COST.key]){
            var oc = record[COL.COST.key];           // 金額
            var nc = record[COL.FOREIGN_AMOUNT.key] * record[COL.CURRENCY_RATE.key]; // 現地金額×為替レート
            if(Math.abs(oc - nc) > 1){ // 現地金額×為替レートの値と金額の差がある
                car.addError(this.createMessageC(lineNo, 'ci00001070', COL.COST.name, COL.CURRENCY_RATE.name, COL.FOREIGN_AMOUNT.name)); // {0}、{1}、{2}の関係が正しくありません。
            }
        }
    }else{
        var excs = [];
        if(record[COL.CURRENCY_NAME.key] ){ excs.push(COL.CURRENCY_NAME.name);  } // 通貨記号
        if(record[COL.CURRENCY_RATE.key] ){ excs.push(COL.CURRENCY_RATE.name);  } // 換算レート
        if(record[COL.FOREIGN_AMOUNT.key]){ excs.push(COL.FOREIGN_AMOUNT.name); } // 現地金額
        if(excs.length){
            car.addError(this.createMessageA(lineNo, 'ci00001140', excs.join(','))); // {0}の値はインポートされません。
        }
        record[COL.CURRENCY_NAME.key]  = null;
        record[COL.CURRENCY_RATE.key]  = null;
        record[COL.FOREIGN_AMOUNT.key] = null;
    }
};

/**
 * 消費税入力する費目に関するチェック
 */
teasp.Tsf.CsvImportLogic.prototype.checkByExpItemTax = function(expItem, COL, lineNo, record, car){
    record[COL.TAX_TYPE.key] = expItem.getTaxType();
    // 金額、税抜金額とも入力なしならこれ以上チェックしない
    var cost       = record[COL.COST.key];        // 金額
    var withoutTax = record[COL.WITHOUT_TAX.key]; // 税抜金額
    if(typeof(cost) != 'number' && typeof(withoutTax) != 'number'){
        return;
    }
    var tax = record[COL.TAX.key]; // 消費税額
    if(expItem.getTaxType() != '0'){ // 消費税タイプが内税または外税
        // 消費税額、税率が入力されてなければ、補完する。
        var taxRate = record[COL.TAX_RATE.key];    // 税率
        if(typeof(taxRate) != 'number'){ // 税率が入力されてない場合、デフォルトの税率を取得
                taxRate = record[COL.TAX_RATE.key] = expItem.getTaxRate(record[COL.DATE.key]);
        }else{
            // 費目の選択可能な税率と比較して、該当しなければエラーにする
            var selectableTaxRates = expItem.getSelectableTaxRateEx();
            var matchRate = false;
            for(var i = 0 ; i < selectableTaxRates.length ; i++){
                if(taxRate == selectableTaxRates[i]){
                    matchRate = true;
                    break;
                }
            }
            if(!matchRate){
                car.addError(this.createMessageC(lineNo, 'ci00001160', COL.TAX_RATE.name, taxRate)); // {0}:'{1}'は費目の消費税率の設定と整合しません。
                return;
            }
        }
        var taxRoundFlag = tsfManager.getTaxRoundFlag(); // 端数処理
        var o = teasp.Tsf.ExpDetail.calcTax(cost, withoutTax, tax
                , (typeof(cost) == 'number' ? 0 : 1)
                , expItem.getTaxType(), taxRate, true, taxRoundFlag, expItem.isAllowMinus());
        if(typeof(cost) == 'number' && typeof(withoutTax) == 'number' && typeof(tax) == 'number'){
            if(cost != o.cost || withoutTax != o.withoutTax || tax != o.tax){
                if(cost != (withoutTax + tax)){
                    car.addError(this.createMessageC(lineNo, 'ci00001070', COL.COST.name, COL.WITHOUT_TAX.name, COL.TAX.name)); // {0}、{1}、{2}の関係が正しくありません。
                    return;
                }else{
                    record[COL.TAX_AUTO.key] = (o.cost == cost && o.withoutTax == withoutTax);
                }
            }
        }else if(typeof(cost) != 'number' && typeof(withoutTax) == 'number' && typeof(tax) != 'number'){
            cost       = record[COL.COST.key]        = o.cost;
            tax        = record[COL.TAX.key]         = o.tax;
            record[COL.TAX_AUTO.key] = true;
        }else if(typeof(cost) == 'number' && typeof(withoutTax) != 'number' && typeof(tax) != 'number'){
            withoutTax = record[COL.WITHOUT_TAX.key] = o.withoutTax;
            tax        = record[COL.TAX.key]         = o.tax;
            record[COL.TAX_AUTO.key] = true;
        }else{
            if(typeof(cost) == 'number' && typeof(tax) == 'number'){
                withoutTax = record[COL.WITHOUT_TAX.key] = Math.max(cost - tax, 0);
            }else if(typeof(cost) == 'number' && typeof(withoutTax) == 'number'){
                tax        = record[COL.TAX.key]         = Math.max(cost - withoutTax, 0);
            }else if(typeof(tax) == 'number' && typeof(withoutTax) == 'number'){
                cost       = record[COL.COST.key]        = tax + withoutTax;
            }
            if(cost != (withoutTax + tax)){
                car.addError(this.createMessageC(lineNo, 'ci00001070', COL.COST.name, COL.WITHOUT_TAX.name, COL.TAX.name)); // {0}、{1}、{2}の関係が正しくありません。
                return;
            }
            if(o.withoutTax != withoutTax || o.tax != tax){
                record[COL.TAX_AUTO.key] = false;
            }
        }
    }else{ // 消費税タイプ＝無税
        var taxRate    = record[COL.TAX_RATE.key];    // 税率
        if(typeof(taxRate) == 'number' && taxRate != 0){ // 税率が 0% 以外で入力されている
            car.addError(this.createMessageC(lineNo, 'ci00001160', COL.TAX_RATE.name, taxRate)); // {0}:'{1}'は費目の消費税率の設定と整合しません。
            return;
        }
        if(typeof(tax) != 'number'){
            tax = record[COL.TAX.key] = 0; // 消費税額が入力されてなければ、補完
        }
        if(typeof(cost) != 'number'){
            cost = record[COL.COST.key] = withoutTax; // 金額が入力されてなければ、税抜金額をセット
        }
        if(typeof(withoutTax) != 'number'){
            withoutTax = record[COL.WITHOUT_TAX.key] = cost; // 税抜金額が入力されてなければ、金額をセット
        }
        if(cost != withoutTax || tax != 0){
            car.addError(this.createMessageC(lineNo, 'ci00001070', COL.COST.name, COL.WITHOUT_TAX.name, COL.TAX.name)); // {0}、{1}、{2}の関係が正しくありません。
            return;
        }
    }
};

/**
 * 支払先情報をセット
 */
teasp.Tsf.CsvImportLogic.prototype.checkPayeeInfo = function(COL, lineNo, record, car){
    record[COL.PAYEE_INFO.key] = null;
    var code = record[COL.PAYEE_CODE.key];
    if(code){
        var lst1 = [];
        var lst2 = [];
        dojo.forEach(this.payees, function(o){
            if(code == o.PayeeCode){
                lst1.push(o);
            }
            // 支払先に精算区分がセットされていないか、精算区分が整合するものだけ取得
            if(code == o.PayeeCode
            && (!o.PayeeExpenseType || (this.expenseType && o.PayeeExpenseType.split(/,/).contains(this.expenseType)))){
                lst2.push(o);
            }
        }, this);
        if(!lst1.length){
            car.addError(this.createMessageB(lineNo, 'ci00001040', COL.PAYEE_CODE.name, code)); // {0}:'{1}'の該当はありません。
        }else if(!lst2.length){
            car.addError(this.createMessageB(lineNo, 'ci00001110', COL.PAYEE_CODE.name, code)); // {0}:'{1}'と精算区分が整合しません。
        }else if(lst2.length > 1){
            car.addError(this.createMessageB(lineNo, 'ci00001090', COL.PAYEE_CODE.name, code)); // {0}:'{1}'の該当が複数存在します。
        }else{
            record[COL.PAYEE_INFO.key] = lst2[0];
        }
    }else{
        var excs = [];
        if(record[COL.PAYMENT_DATE.key]){ excs.push(COL.PAYMENT_DATE.name); } // 支払日
        if(excs.length){
            car.addError(this.createMessageA(lineNo, 'ci00001140', excs.join(','))); // {0}の値はインポートされません。
        }
        record[COL.PAYMENT_DATE.key] = null;
    }
};

/**
 * 部署情報をセット
 */
teasp.Tsf.CsvImportLogic.prototype.checkDeptInfo = function(COL, lineNo, record, car){
    record[COL.DEPT_INFO.key] = null;
    var code = record[COL.DEPT_CODE.key];
    if(code){
        var dt = record[COL.DATE.key];
        var lst = [];
        var hit = [];
        dojo.forEach(this.depts, function(o){
            if(code == o.ChargeDeptCode){
                lst.push(o);
                if((!o.ChargeDeptStartDate || o.ChargeDeptStartDate <= dt)
                && (!o.ChargeDeptEndDate   || o.ChargeDeptEndDate   >= dt)){
                    hit.push(o);
                }
            }
        });
        if(!lst.length){
            car.addError(this.createMessageB(lineNo, 'ci00001040', COL.DEPT_CODE.name, code)); // {0}:'{1}'の該当はありません。
        }else if(hit.length > 1){
            car.addError(this.createMessageB(lineNo, 'ci00001090', COL.DEPT_CODE.name, code)); // {0}:'{1}'の該当が複数存在します。
        }else if(!hit.length){
            car.addError(this.createMessageB(lineNo, 'ci00001100', COL.DEPT_CODE.name, code)); // {0}:'{1}'は利用日と有効期間が整合しません。
        }else{
            record[COL.DEPT_INFO.key] = hit[0];
        }
    }
};

/**
 * ジョブ情報をセット
 */
teasp.Tsf.CsvImportLogic.prototype.checkJobInfo = function(COL, lineNo, record, car){
    record[COL.JOB_INFO.key] = null;
    var code = record[COL.JOB_CODE.key];
    if(code){
        var dt = record[COL.DATE.key];
        var lst = [];
        var hit = [];
        dojo.forEach(this.jobs, function(o){
            if(code == o.JobCode && o.JobActive){
                lst.push(o);
                if((!o.JobStartDate || o.JobStartDate <= dt)
                && (!o.JobEndDate   || o.JobEndDate   >= dt)){
                    hit.push(o);
                }
            }
        });
        var o = (hit.length ? hit[0] : null);
        if(!lst.length){
            car.addError(this.createMessageB(lineNo, 'ci00001040', COL.JOB_CODE.name, code)); // {0}:'{1}'の該当はありません。
        }else if(hit.length > 1){
            car.addError(this.createMessageB(lineNo, 'ci00001090', COL.JOB_CODE.name, code)); // {0}:'{1}'の該当が複数存在します。
        }else if(!o){
            car.addError(this.createMessageB(lineNo, 'ci00001100', COL.JOB_CODE.name, code)); // {0}:'{1}'は利用日と有効期間が整合しません。
        }else if(o.JobMember == -1 || (o.JobMember == 0 && !this.targetEmp.isMatchEmpJobAssignClass(o.JobAssignClass))){
            car.addError(this.createMessageB(lineNo, 'ci00001150', COL.JOB_CODE.name, code)); // {0}:'{1}'はジョブ割当制限されています。
        }else{
            record[COL.JOB_INFO.key] = o;
        }
    }
};

/**
 * 費目表示区分のチェック
 * ※ checkDeptInfo() の後で呼ばれる前提
 */
teasp.Tsf.CsvImportLogic.prototype.checkExpItemClass = function(expItem, COL, lineNo, record, car){
    if(!expItem){
        return;
    }
    var empExpItemClass = this.targetEmp.getExpItemClass(); // 社員の費目表示区分
    var deptExpItemClass = null; // 部署の費目表示区分
    var dept = record[COL.DEPT_INFO.key];
    if(dept){
        deptExpItemClass = dept.ExpItemClass || null;
    }
    if(!deptExpItemClass && this.assist && this.assist.ChargeDeptId__r){
        deptExpItemClass = this.assist.ChargeDeptId__r.ExpItemClass__c || null;
    }
    if(!deptExpItemClass){
        deptExpItemClass = this.targetEmp.getDeptExpItemClass();
    }
    console.log('empExpItemClass=' + empExpItemClass);
    console.log('deptExpItemClass=' + deptExpItemClass);
    if(!expItem.isSelectable(empExpItemClass)
    && !expItem.isSelectable(deptExpItemClass)){
        car.addError(this.createMessageB(lineNo, 'ci00001120', COL.ITEM_CODE.name, expItem.getItemCode())); // {0}:'{1}'と社員または負担部署の費目表示区分が整合しません。
    }
};
