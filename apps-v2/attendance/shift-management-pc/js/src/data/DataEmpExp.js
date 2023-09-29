teasp.provide('teasp.data.EmpExp');
/**
 * 経費明細データクラス
 *
 * @constructor
 */
teasp.data.EmpExp = function(expLog){
    /** @private */
    this.expLog = expLog;
};

/**
 * 経費明細IDを返す
 * @return {string} 経費明細ID
 */
teasp.data.EmpExp.prototype.getId = function(){
    return this.expLog.id;
};

/**
 * 明細連番を返す
 * @return {number} 明細連番
 */
teasp.data.EmpExp.prototype.getNo = function(){
    return (this.expLog.order || '');
};

/**
 * 費目名を返す
 * @return {string} 費目名
 */
teasp.data.EmpExp.prototype.getItemName = function(){
    return this.expLog.expItem.name;
};

/**
 * 経路オブジェクトを返す
 * @return {string} 経路オブジェクト（JSONシリアライズ）
 */
teasp.data.EmpExp.prototype.getRoute = function(){
    return this.expLog.route;
};

/**
 * 駅探検索交通費か
 * @return {boolean} 駅探検索交通費
 */
teasp.data.EmpExp.prototype.isEkitan = function(){
    return (this.expLog.transportType == 1);
};

/**
 * 領収書要か
 * @return {boolean} 領収書要
 */
teasp.data.EmpExp.prototype.isReceipt = function(){
    return this.expLog.receipt;
};

/**
 * 外貨計算か
 * @return {boolean} 領収書要
 *
 * @author nekonekon
 */
teasp.data.EmpExp.prototype.isCurrency = function(){
    if(this.expLog.expItem){
        return this.expLog.expItem.foreignFlag;
    }
    return this.expLog.foreignFlag;
};

/**
 * 税金入力か
 * @return {boolean} 領収書要
 *
 * @author nekonekon
 */
teasp.data.EmpExp.prototype.isTax = function(){
    return this.expLog.taxFlag;
};

/**
 * 拡張項目有りか
 * @return {boolean} true 拡張項目有り
 *
 * @author nekonekon
 */
teasp.data.EmpExp.prototype.isExtraItem = function(){
    var isHas=(this.expLog.useExtraItem1||this.expLog.useExtraItem2)?true:false;
    return isHas;
};

/**
 * Spice等からの入力
 * @return {boolean}
 */
teasp.data.EmpExp.prototype.isIc = function(){
    return teasp.constant.IC_INPUTS.contains(this.expLog.item || '');
};

teasp.data.EmpExp.prototype.isUber = function(){
    return (this.expLog.item && this.expLog.item == 'uber');
};

/**
 * 数量ありか
 * @return {boolean} 数量あり
 */
teasp.data.EmpExp.prototype.isQuantity = function(){
    if(this.expLog.expItem){
        return this.expLog.expItem.enableQuantity;
    }
    return false;
};

/**
 * 支払先ありか
 * @return {boolean} 支払先あり
 */
teasp.data.EmpExp.prototype.isPayment = function(){
    return (this.expLog.payee || this.expLog.paymentDate);
};

/**
 * 負担部署
 * @return {Object|null}
 */
teasp.data.EmpExp.prototype.getChargeDept = function(){
    return (this.expLog.chargeDept || null);
};

/**
 * 金額を返す
 * @return {number} 金額
 */
teasp.data.EmpExp.prototype.getCost = function(){
    return this.expLog.cost;
};

/**
 * 経費明細の備考を返す
 * @return {string} 経費明細の備考
 */
teasp.data.EmpExp.prototype.getDetail = function(){
    return (this.expLog.detail || '');
};

/**
 * 経路表示
 *
 * @param {Object} routeObj 経路情報のオブジェクト
 * @return {string} {発駅}⇒{着駅}（往復の場合⇔）
 */
teasp.data.EmpExp.prototype.getRouteName = function(routeObj){
    if(this.expLog.transportType == 0){
        return '';
    }else{
        var str = teasp.message.getLabel((this.expLog.roundTrip ? 'tm20009040' : 'tm20009060'),
                teasp.util.entitizf(this.expLog.startName), teasp.util.entitizf(this.expLog.endName)); // {0}⇔{1} or {0}⇒{1}
        if(routeObj && routeObj.ICCardMode && routeObj.ICCardMode == '1'){
            str += ('  ' + teasp.message.getLabel('tk10005550')); // (IC運賃)
        }
        return str;
    }
};
/**
 * 外貨情報表示
 * @return {string} 通貨名:現地金額 レート/通貨名
 */
teasp.data.EmpExp.prototype.getCurrencyInfo = function(){
    if(!this.expLog.foreignFlag){
        return '';
    }else{
        var rate = teasp.util.currency.formatDecimal(this.expLog.currencyRate
                        , teasp.constant.CU_DEC_POINT_MIN
                        , teasp.constant.CU_DEC_POINT_MAX);
        var amount = teasp.util.currency.formatDecimal(this.expLog.foreignAmount
                        , 0
                        , teasp.constant.CU_DEC_POINT_MAX
                        , true);
        return teasp.message.getLabel('tm20001170'  // 通貨[{0}] 換算ﾚｰﾄ {1} 現地金額{2}
                , teasp.util.entitizf(this.expLog.currencyName)
                , rate.str
                , amount.str);
    }
};
/**
 * 税金情報表示
 * @return {string} (税種) 外税:金額 税:金額
 */
teasp.data.EmpExp.prototype.getTaxInfo = function(){

    if(!this.expLog.taxFlag){
        return '';
    }else{
        var handInTax = '';
        var taxType = '';
        if(!this.expLog.taxAuto){
            handInTax = teasp.message.getLabel('tm20001200') /*(手入力)*/;
        }
        switch(this.expLog.taxType){
        case '1':
            taxType=teasp.message.getLabel('tm20001210') /*内税*/;
            break;
        case '2':
            taxType=teasp.message.getLabel('tm20001220') /*外税*/;
            break;
        case '0':
            taxType=teasp.message.getLabel('tm20001230') /*無税*/;
            return taxType;
        }
        return taxType + ' : ' + teasp.util.currency.formatMoney(this.expLog.tax, '&#165;#,##0') + handInTax;
    }
};

teasp.data.EmpExp.prototype.getQuantityInfo = function(){
    var str = teasp.message.getLabel('tm10001070'       // {0}：{1}
            , teasp.message.getLabel('tm20004720')      // 単価
            , teasp.util.currency.formatMoney(this.expLog.unitPrice, '&#165;#,##0'));
    str += '&nbsp;&nbsp;';
    str += teasp.message.getLabel('tm10001070'          // {0}：{1}
            , teasp.message.getLabel('tm20004730')      // 数量
            , this.expLog.quantity || '-');
    if(this.expLog.expItem && this.expLog.expItem.unitName){
        str += ' ' + teasp.util.entitizf(this.expLog.expItem.unitName);
    }
    return str;
};

/**
 * 支払種別を返す。
 *
 * @returns {string}
 */
teasp.data.EmpExp.prototype.getPayeeType = function(){
    return (this.expLog.payee && this.expLog.payee.payeeType) || null;
};

teasp.data.EmpExp.prototype.getCardStatementLineId = function(){
    return this.expLog.cardStatementLineId || null;
};

/**
 * カード明細読込で入力したか
 * @returns
 */
teasp.data.EmpExp.prototype.isCardStatementLine = function(){
    return (this.expLog.cardStatementLineId && !this.isReceiptInput()) ? true : false;
};

/**
 * 領収書読込で入力したか
 * @returns
 */
teasp.data.EmpExp.prototype.isReceiptInput = function(){
    return (this.expLog.cardStatementLine && this.expLog.cardStatementLine.recordTypeName == '領収書');
};

teasp.data.EmpExp.prototype.getPayeeInfo = function(){
    var strs = [];
    if(this.expLog.payee && this.expLog.payee.name){
        strs.push(teasp.message.getLabel('tm10001070'       // {0}：{1}
                , teasp.message.getLabel('tf10000580')      // 支払先
                , teasp.util.entitizf(this.expLog.payee.name)));
    }
    if(this.expLog.paymentDate){
        strs.push(teasp.message.getLabel('tm10001070'       // {0}：{1}
                , teasp.message.getLabel('tf10000590')      // 支払日
                , teasp.util.date.formatDate(this.expLog.paymentDate, 'SLA')));
    }
    return (strs.length > 0 ? strs.join('<br/>') : '');
};

/**
 * 拡張項目情報表示
 * @return {string} 項目名１[...] 項目名２[...]
 */
teasp.data.EmpExp.prototype.getExtraItemInfo = function(){
    var isHas=(this.expLog.useExtraItem1||this.expLog.useExtraItem2)?true:false;
    if(!isHas){
        return '';
    }else{
        var extraItem='';
        extraItem+=(this.expLog.useExtraItem1)?'<span style="white-space:nowrap">'+teasp.util.entitizf(this.expLog.expItem.extraItem1Name)+':</span>'+teasp.util.entitizf(this.expLog.extraItem1)+'<br />':'';
        extraItem+=(this.expLog.useExtraItem2)?'<span style="white-space:nowrap">'+teasp.util.entitizf(this.expLog.expItem.extraItem2Name)+':</span>'+teasp.util.entitizf(this.expLog.extraItem2):'';
        return extraItem;
    }
};
/**
 * 領収書ファイルの有無チェック
 * @return {boolean} true:領収書ファイル添付済み
 */
teasp.data.EmpExp.prototype.hasAttachments = function(){
	return (this.expLog.attachments)?true:false;
};