/**
 * オブジェクト・セクションクラス
 *
 * @constructor
 */
teasp.Tsf.ExpItem = function(expItem){
    this.expItem = expItem;
    this.config = (expItem.Config__c && teasp.Tsf.util.fromJson(expItem.Config__c)) || {};
    this.EXPITEM_TOOLTIP_HKEY = 'expItem_toolTip';
};

/**
 * 部署情報に階層情報を付与してから
 * 部署クラスインスタンスの配列を作成して返す
 *
 * @param {Array.<Object>} expItems
 * @param {boolean} forAdjust =true:精算費目
 * @param {boolean} forPayable =true:未払い費目
 * @returns {Array.<Object>}
 */
teasp.Tsf.ExpItem.createList = function(expItems, forAdjust, forPayable){
    var lst = [];
    dojo.forEach(expItems, function(expItem){
        if((expItem.ForAdjustment__c || false) == forAdjust
        && (expItem.ForPayable__c    || false) == forPayable){
            this.push(new teasp.Tsf.ExpItem(expItem));
        }
    }, lst);
    return lst;
};

teasp.Tsf.ExpItem.prototype.getId = function(){
    return this.expItem.Id || null;
};

/**
 * 費目表示名
 * @param {boolean=} flag trueの場合は後ろにコードを表示
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getName = function(flag){
    return (this.expItem.Name || '')
        + (flag && this.expItem.Code__c ? teasp.message.getLabel('tk10004860', this.expItem.Code__c) : '');
};

/**
 * 費目名
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getItemName = function(){
    return this.expItem.ItemName__c || '';
};

/**
 * 費目名（V5.24～）
 * @param {boolean=} flag trueの場合は後ろに費目コードを表示
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getItemNameIdeal = function(flag){
    return (this.expItem.Name || '')
        + (flag && this.expItem.ItemCode__c ? teasp.message.getLabel('tk10004860', this.expItem.ItemCode__c) : '');
};

/**
 * 科目名
 * @param {boolean=} flag trueの場合は後ろに科目コードを表示
 * @returns {String}
 */
teasp.Tsf.ExpItem.prototype.getAccountName = function(flag){
    return (this.expItem.ItemName__c || '')
        + (flag && this.expItem.Code__c ? teasp.message.getLabel('tk10004860', this.expItem.Code__c) : '');
};

/**
 * 費目コード
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getItemCode = function(){
    return this.expItem.ItemCode__c || '';
};

/**
 * 補助科目名
 * @param {boolean=} flag trueの場合は後ろにコードを表示
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getAuxTitle = function(flag){
    return (this.expItem.AuxTitle__c || '')
        + (flag && this.expItem.AuxCode__c ? teasp.message.getLabel('tk10004860', this.expItem.AuxCode__c) : '');
};

/**
 * 費目の有効／無効
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isRemoved = function(){
    return this.expItem.Removed__c || false;
};

/**
 * 費目の種別＝出張日当
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isAllowance = function(){
    return (this.expItem.AllowanceFlag__c == '1');
};

/**
 * 費目の種別＝宿泊手当
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isHotel = function(){
    return (this.expItem.AllowanceFlag__c == '2');
};

/**
 * 費目の種別＝会議・交際費
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isSocial = function(){
    return (this.expItem.AllowanceFlag__c == '3');
};

/**
 * 費目種別を返す 0:交通費でない, 1:駅探検索, 2:駅探検索以外
 *
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getTransportType = function(){
    return this.expItem.TransportType__c || '0';
};

/**
 * 駅探検索をする費目か
 *
 * @returns {boolean}
 */
teasp.Tsf.ExpItem.prototype.isEkitanType = function(){
    return (this.expItem.TransportType__c == '1');
};

/**
 * IC交通費読込で表示しない
 * @returns {boolean}
 */
teasp.Tsf.ExpItem.prototype.isHideWhenReadingICExpenses = function(){
    return (this.expItem.HideWhenReadingICExpenses__c || false);
};

/**
 * 費目種別の文言
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getItemTypeName = function(){
    switch(this.getTransportType()){
    case '1':  return teasp.message.getLabel('tm20004430'); // 交通費（駅探検索）
    case '2':  return teasp.message.getLabel('tm20004440'); // 交通費（手入力）
    default:
        if(this.isAllowance()){
            return teasp.message.getLabel('tf10000020'); // 出張日当
        }else if(this.isHotel()){
            return teasp.message.getLabel('tf10000030'); // 宿泊手当
        }else if(this.isSocial()){
            return teasp.message.getLabel('tf10000600'); // 会議・交際費
        }else{
            return teasp.message.getLabel('tm20004450'); // 交通費以外の経費
        }
    }
};

/**
 * 領収書要
 *
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isReceipt = function(){
    return this.expItem.Receipt__c || false;
};

/**
 * 消費税入力
 *
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isTaxFlag = function(){
    return this.expItem.TaxFlag__c || false;
};

/**
 * 税タイプ
 *
 * @returns {number|null} 1:内税, 2:外税, 0:無税
 */
teasp.Tsf.ExpItem.prototype.getTaxType = function(){
    if(typeof(this.expItem.TaxType__c) != 'string'){
        return null;
    }
    return parseInt(this.expItem.TaxType__c, 10);
};

/**
 * 消費税率
 * @params {boolean=} flag true:表示用文字列を返す
 * @returns {number|null} nullの場合は自動。それ以外は 0,5,8,10 を返す
 */
teasp.Tsf.ExpItem.prototype.getDefaultTaxRate = function(flag){
    if(!this.expItem.DefaultTaxRate__c){
        return (flag ? teasp.message.getLabel('tf10010610') : null); // 自動
    }
    var n = parseInt(this.expItem.DefaultTaxRate__c, 10);
    return (flag ? n + '%' : n);
};

/**
 * 消費税選択
 * @params {boolean=} flag true:表示用文字列を返す
 * @returns {Array.<number>}
 */
teasp.Tsf.ExpItem.prototype.getSelectableTaxRate = function(flag){
    if(!this.selectableTaxRate){
        var sels = (this.expItem.SelectableTaxRate__c || '').split(/;/);
        var nums = [];
        for(var i = 0 ; i < sels.length ; i++){
            var sel = sels[i];
            if(/^\d+$/.test(sel)){
                var n = parseInt(sel, 10);
                if(nums.indexOf(n) < 0){
                    nums.push(n);
                }
            }
        }
        nums = nums.sort(function(a, b){
            return b - a;
        });
        this.selectableTaxRate = nums;
    }
    var rates = this.selectableTaxRate;
    if(!flag){
        return rates;
    }else{
        srates = [];
        for(var i = 0 ; i < rates.length ; i++){
            srates.push(rates[i] + '%');
        }
        return srates.join(',');
    }
};

/**
 * 消費税選択
 * @param {number=} taxRate !=null:強制で含める消費税率
 * @returns {Array.<number>}
 */
teasp.Tsf.ExpItem.prototype.getSelectableTaxRateEx = function(taxRate){
    var nums = teasp.Tsf.Dom.clone(this.getSelectableTaxRate());
    var exs = [];
    if(this.getDefaultTaxRate() === null){ // 消費税率=自動の費目は強制で10,8を含める
        exs = [10,8];
    }else{
        exs.push(this.getDefaultTaxRate());
    }
    if(typeof(taxRate) == 'number'){ // 引数 taxRate の指定があれば強制で含める
    	exs.push(taxRate);
    }
    if(exs.length){
        for(var i = 0 ; i < exs.length ; i++){
            if(nums.indexOf(exs[i]) < 0){
                nums.push(exs[i]);
            }
        }
        nums = nums.sort(function(a, b){
            return b - a;
        });
    }
    return nums;
};

/**
 * デフォルトの税率を返す
 *
 * @param {(Object|string)=} tdate
 * @param {number=} currentRate  消費税率!=自動かつ消費税率選択の中に同値がある場合、同値を返す
 * @returns {number}
 */
teasp.Tsf.ExpItem.prototype.getTaxRate = function(tdate, currentRate){
    var rate = this.getDefaultTaxRate();
    if(rate !== null){ // 消費税率!=自動
        if(typeof(currentRate) == 'number' && this.getSelectableTaxRate().indexOf(currentRate) >= 0){
            return currentRate;
        }
        return rate;
    }
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
 * 税タイプの文言
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getTaxTypeName = function(){
    switch(this.getTaxType()){
    case 1:  return teasp.message.getLabel('tm20001210'); // 内税
    case 2:  return teasp.message.getLabel('tm20001220'); // 外税
    default: return teasp.message.getLabel('tm20001230'); // 無税
    }
};

/**
 * 端数処理の文言
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getTaxRoundName = function(){
    switch(tsfManager.getTaxRoundFlag()){
    case 1:  return teasp.message.getLabel('tm20004380'); // 切り捨て
    case 2:  return teasp.message.getLabel('tm20004390'); // 切り上げ
    default: return teasp.message.getLabel('tm20004400'); // 四捨五入
    }
};

/**
 * 税区分コード
 * @params {string=} dt 日付 YYYY-MM-DD
 * @@arams {number=} taxRate 消費税率
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getTaxCode = function(dt, taxRate){
    var v = null;
    if(dt && typeof(taxRate) == 'number'){
        if(dt < '2019-10-01'){
            switch(taxRate){
            case  0: v = this.expItem.TaxCode2014_00__c || ''; break;
            case  5: v = this.expItem.TaxCode2014_05__c || ''; break;
            case  8: v = this.expItem.TaxCode2014_08__c || ''; break;
            case 10: v = this.expItem.TaxCode2019_10__c || ''; break;
            }
        }else{
            switch(taxRate){
            case  0: v = this.expItem.TaxCode2019_00__c || ''; break;
            case  5: v = this.expItem.TaxCode2019_05__c || ''; break;
            case  8: v = this.expItem.TaxCode2019_08__c || ''; break;
            case 10: v = this.expItem.TaxCode2019_10__c || ''; break;
            }
        }
    }
    return v || this.expItem.TaxCode__c || '';
};

/**
 * マイナス可
 *
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isAllowMinus = function(){
    return this.expItem.AllowMinus__c || false;
};

/**
 * 金額を直接入力できるか
 *
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isAmountReadOnly = function(){
    return (this.isFixAmount() || this.isEnableQuantity());
};

/**
 * 金額固定
 *
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isFixAmount = function(){
    return this.expItem.FixAmount__c || false;
};

/**
 * 金額
 *
 * @param {string=} d 日付 : 日付指定ありかつ外貨入力＝するかつ外貨指定ありの場合、日本円に換算した値を返す。
 * @param {boolean=} flag =trueの場合、標準金額の値が数字以外(空欄)ならnullを返す。
 * @returns {number|null}
 */
teasp.Tsf.ExpItem.prototype.getCost = function(d, flag){
    if(flag && typeof(this.expItem.Cost__c) != 'number'){
        return null;
    }
    if(d && this.isForeignFlag() && this.getCurrencyName()){
        var foreign = tsfManager.getForeignByName(this.getCurrencyName());
        if(foreign){
            var rate    = foreign.getRateByDate(d);  // 換算レートを取得
            var amount  = this.expItem.Cost__c || 0; // 標準金額（現地金額）
            var o = teasp.Tsf.ExpDetail.calcForeign(0, rate, amount, 2, 0, this.isAllowMinus());
            return o.cost;
        }
        return 0;
    }
    return this.expItem.Cost__c || 0;
};

/**
 * 標準金額を返す
 * @param {boolean=} flag 固定の場合に"(金額固定)"を末尾につけない
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getCostFormat = function(flag){
    var n = this.expItem.Cost__c || 0;
    if(this.isForeignFlag() && this.getCurrencyName()){
        var foreign = tsfManager.getForeignByName(this.getCurrencyName());
        return teasp.util.currency.formatDecimal(n, teasp.constant.CU_DEC_POINT_MIN, teasp.constant.CU_DEC_POINT_MAX, true).str
            + (foreign && foreign.getYomi() || '');
    }
    return teasp.Tsf.Currency.formatMoney(n, teasp.Tsf.Currency.S_YEN, true, true)
            + (!flag && this.isFixAmount() ? teasp.message.getLabel('tk10004860', teasp.message.getLabel('tm20004585')) : ''); // 金額固定
};

/**
 * 外貨入力
 *
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isForeignFlag = function(){
    return this.expItem.ForeignFlag__c || false;
};

/**
 * 外貨指定
 *
 * @returns {string|null}
 */
teasp.Tsf.ExpItem.prototype.getCurrencyName = function(){
    return this.expItem.CurrencyName__c || null;
};

/**
 * 数量あり
 *
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isEnableQuantity = function(){
    return this.expItem.EnableQuantity__c || false;
};

/**
 * 数量単位
 *
 * @returns {string|null}
 */
teasp.Tsf.ExpItem.prototype.getUnitName = function(){
    return this.expItem.UnitName__c || null;
};

/**
 * 説明
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getNote = function(){
    return this.expItem.Note__c || '';
};

/**
 * 使用制限
 *
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isRestrictTargetEmployee = function(){
    return this.expItem.RestrictTargetEmployee__c || false;
};

/**
 * 使用できるか
 *
 * @param {string|null} expItemClass 経費費目表示区分
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isSelectable = function(expItemClass){
    if(!this.isRestrictTargetEmployee()){ // 使用制限なし＝使用可
        return true;
    }
    if(!expItemClass || !this.expItem.TargetEmployee__c){ // 経費費目表示区分が空、または使用可能社員が未設定＝使用不可
        return false;
    }
    if(!this.targetEmployees){
        this.targetEmployees = this.expItem.TargetEmployee__c.split(/,/);
    }
    // 使用可能社員リストに引数と合致する文字列があれば、使用可
    return this.targetEmployees.contains(expItemClass);
};

/**
 * 精算区分がマッチするか
 *
 * @param {string} expenseType 精算区分
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.checkExpenseType = function(expenseType){
    if(!this.expItem.ExpenseType__c){ // 精算区分の設定なしならマッチ
        return true;
    }
    if(!this.expenseTypes){
        this.expenseTypes = this.expItem.ExpenseType__c.split(/,/);
    }
    return this.expenseTypes.contains(expenseType);
};

/**
 * 使用可能社員
 *
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getTargetEmployee = function(){
    return this.expItem.TargetEmployee__c || '';
};

/**
 * 拡張項目１
 *
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isUseExtraItem1 = function(){
    return this.expItem.UseExtraItem1__c || false;
};

/**
 * 拡張項目２
 *
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isUseExtraItem2 = function(){
    return this.expItem.UseExtraItem2__c || false;
};

/**
 * 拡張項目
 *
 * @param {number} 1 or 2
 * @returns {Object|null}
 */
teasp.Tsf.ExpItem.prototype.getExtraItem = function(no){
    if(no == 1 && this.isUseExtraItem1()){
        return {
            name        : (this.expItem.ExtraItem1Name__c || ''),
            require     : (this.expItem.ExtraItem1Require__c || false),
            width       : '' + (this.expItem.ExtraItem1Width__c || 130) + 'px',
            widthN      : (this.expItem.ExtraItem1Width__c || 0),
            maxLength   : (this.expItem.ExtraItem1LimitLength__c || 255),
            note        : (this.expItem.ExtraItem1Note__c || '').replace(/\r?\n/g, '<br/>')
        };
    }else if(no == 2 && this.isUseExtraItem2()){
        return {
            name        : (this.expItem.ExtraItem2Name__c || ''),
            require     : (this.expItem.ExtraItem2Require__c || false),
            width       : '' + (this.expItem.ExtraItem2Width__c || 130) + 'px',
            widthN      : (this.expItem.ExtraItem2Width__c || 0),
            maxLength   : (this.expItem.ExtraItem2LimitLength__c || 255),
            note        : (this.expItem.ExtraItem2Note__c || '').replace(/\r?\n/g, '<br/>')
        };
    }else{
        return null;
    }
};

/**
 * 外貨の再計算時に金額と現地金額どちらを固定して再計算するか.<br/>
 *
 * 標準金額ありの費目かつ外貨指定なし または、費目種別が「駅探検索する交通費」・・金額固定<br/>
 * それ以外・・現地金額を固定<br/>
 * @returns {number} =0:金額 =2:現地金額
 */
teasp.Tsf.ExpItem.prototype.getRecalcTarget = function(){
    if((this.getCost() && !this.getCurrencyName()) || this.isEkitanType()){
        return 0;
    }else{
        return 2;
    }
};

/**
 * 未払金用
 *
 * @returns {Boolean}
 */
teasp.Tsf.ExpItem.prototype.isForPayable = function(){
    return this.expItem.ForPayable__c || false;
};

/**
 * ジョブ入力
 *
 * @returns {number} -1:入力しない 1:入力する 2:必須
 */
teasp.Tsf.ExpItem.prototype.isRequireChargeJob = function(){
    var v = this.config.requireChargeJob;
    return (v ? v : tsfManager.getInfo().isRequireChargeJob());
};

/**
 * 費目のツールチップ内容
 *
 * @param flag =trueなら精算費目用
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getToolTip = function(flag, dt, taxRate){
    // 費目名、費目表示名
    var vals = null;
    if(tsfManager.getInfo().isExpItemRevise()){
        vals = [
            { n: teasp.message.getLabel('tf10007850')       , v: this.getItemNameIdeal(true) }, // 費目名
            { n: teasp.message.getLabel('tf10007870')       , v: this.getAccountName(true)   }  // 科目名
        ];
    }else{
        vals = [
            { n: teasp.message.getLabel('tm20004560')       , v: this.getItemName()     }, // 費目名
            { n: teasp.message.getLabel('tm20004570')       , v: this.getName(true)     }  // 費目表示名＋コード
        ];
    }
    // 補助科目名＋コード
    var aux = this.getAuxTitle(true);
    if(aux){
        vals.push({ n: teasp.message.getLabel('tm20004575'), v: aux });
    }
    if(!flag){ // 経費入力用
        // 費目種別
        vals.push({ n: teasp.message.getLabel('tm20004640'), v: this.getItemTypeName() });
        // 標準金額
        var cost = this.getCostFormat();
        if(cost){
            vals.push({ n: teasp.message.getLabel('tm20004580'), v: cost });
        }
        // マイナス入力
        vals.push({ n: teasp.message.getLabel('tm20004586'), v: teasp.message.getLabel(this.isAllowMinus() ? 'tm20004360' : 'tm20004370') }); // 可 or 不可
        // 消費税入力
        vals.push({ n: teasp.message.getLabel('taxOn_btn_title'), v: teasp.message.getLabel(this.isTaxFlag() ? 'tm20004360' : 'tm20004370') }); // 可 or 不可
        if(this.isTaxFlag()){
            vals.push({ n: teasp.message.getLabel('tk10000076'), v: this.getTaxTypeName()  }); // 消費税タイプ
            vals.push({ n: teasp.message.getLabel('tf10010590'), v: this.getDefaultTaxRate(true) }); // 消費税率
            vals.push({ n: teasp.message.getLabel('tf10010600'), v: this.getSelectableTaxRate(true) || teasp.message.getLabel('tm10010150') }); // 選択できる消費税率
            vals.push({ n: teasp.message.getLabel('tm20004620'), v: this.getTaxRoundName() }); // 端数処理
        }
        vals.push({ n: teasp.message.getLabel('tk10005460'), v: this.getTaxCode(dt, taxRate) }); // 税区分コード
        // 外貨入力
        vals.push({ n: teasp.message.getLabel('tm20004630'), v: teasp.message.getLabel(this.isForeignFlag() ? 'tm20004360' : 'tm20004370') }); // 可 or 不可
        if(this.isForeignFlag()){
            vals.push({ n: teasp.message.getLabel('tf10000150'), v: this.getCurrencyName() || '' }); // 外貨指定
        }
        // 数量あり
        vals.push({ n: teasp.message.getLabel('tm20004730'), v: teasp.message.getLabel(this.isEnableQuantity() ? 'tm10010140' : 'tm10010150') }); // あり or なし
        if(this.isEnableQuantity()){
            vals.push({ n: teasp.message.getLabel('tf10000040'), v: this.getUnitName() || '' }); // 単位
        }
        // 使用制限
        vals.push({ n: teasp.message.getLabel('tf10000050'), v: teasp.message.getLabel(this.isRestrictTargetEmployee() ? 'tm10010140' : 'tm10010150') }); // あり or なし
//        if(this.isRestrictTargetEmployee()){
//            vals.push({ n: teasp.message.getLabel('tf10000070'), v: this.getTargetEmployee() }); // 使用可能社員
//        }
        // 領収書
        vals.push({ n: teasp.message.getLabel('receipt_btn_title'), v: teasp.message.getLabel(this.isReceipt() ? 'tm20004340' : 'tm20004350') }); // 要 or 不要
        if(this.isUseExtraItem1()){ // 拡張項目名１
            vals.push({ n: teasp.message.getLabel('tm20004576'), v: this.getExtraItem(1).name });
        }
        if(this.isUseExtraItem2()){ // 拡張項目名２
            vals.push({ n: teasp.message.getLabel('tm20004577'), v: this.getExtraItem(2).name });
        }
    }else{ // 精算仕訳用
        vals.push({ n: teasp.message.getLabel('tk10005460'), v: this.getTaxCode() }); // 税区分コード
    }
    // 説明
    vals.push({ n: teasp.message.getLabel('tm20004650'), v: this.getNote() });

    var buf = '';
    dojo.forEach(vals, function(val){
        if(val){
            buf += '<tr><td style="min-width:80px;">' + (val.n || '') + '</td><td>' + (val.v || '') + '</td></tr>';
        }
    });
    return '<div style="overflow:hidden;padding:0px;margin:0px;"><table class="ts-expItem-tip">' + buf + '</table></div>';
};


/**
 * 社内参加者テンプレート
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getInternalParticipantsTemplateText = function(){
    return this.expItem.InternalParticipantsTemplateText__c || '';
};

/**
 * 社外参加者テンプレート
 * @returns {string}
 */
teasp.Tsf.ExpItem.prototype.getExternalParticipantsTemplateText = function(){
    return this.expItem.ExternalParticipantsTemplateText__c || '';
};

/**
 * 社内参加者の設定が有効か確認
 * @returns {boolean} true:設定あり,false:設定なし(null値)
 */
teasp.Tsf.ExpItem.prototype.isValidInternalParticipants = function(){
    if(typeof(this.expItem.InternalParticipants__c) != 'string'){
        return false;
    }else{
        return true;
    }
};

/**
 * 社外参加者の設定が有効か確認
 * @returns {boolean} true:設定あり,false:設定なし(null値)
 */
teasp.Tsf.ExpItem.prototype.isValidExternalParticipants = function(){
    if(typeof(this.expItem.ExternalParticipants__c) != 'string'){
        return false;
    }else{
        return true;
    }
};

/**
 * 社内参加者
 * @returns {boolean} true:入力する,false:入力しない(または設定なし)
 */
teasp.Tsf.ExpItem.prototype.isInternalParticipants = function(){
    if(typeof(this.expItem.InternalParticipants__c) != 'string'){
        return false;
    }
    if(this.isSocial() && this.expItem.InternalParticipants__c==='1'){  //種別：交際費
        return true;
    }else{
        return false;
    }
};

/**
 * 社外参加者
 * @returns {boolean} true:入力する,false:入力しない(または設定なし)
 */
teasp.Tsf.ExpItem.prototype.isExternalParticipants = function(){
    if(typeof(this.expItem.ExternalParticipants__c) != 'string'){
        return false;
    }
    if(this.isSocial() && this.expItem.ExternalParticipants__c==='1'){  //種別：交際費
        return true;
    }else{
        return false;
    }
};

/**
 * 店舗情報
 * @returns {boolean} true:入力する,false:入力しない(または設定なし)
 */
teasp.Tsf.ExpItem.prototype.isPlace = function(){
    if(typeof(this.expItem.Place__c) != 'string'){
        return false;
    }
    if(this.isSocial() && this.expItem.Place__c==='1'){  //種別：交際費
        return true;
    }else{
        return false;
    }
};
