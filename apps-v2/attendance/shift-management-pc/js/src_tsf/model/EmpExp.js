/**
 * 経費明細クラス
 *
 * @constructor
 */
teasp.Tsf.EmpExp = function(obj, pre, hist){
    this.obj = teasp.Tsf.Dom.clone(obj || {});
    this.pre = pre || false;
    this.hist = hist || false;
};

teasp.Tsf.EmpExp.prototype = new teasp.Tsf.ObjBase();

teasp.Tsf.EmpExp.MISMATCH_EXPENSE_TYPE      = 0x0001;  // 精算区分不整合（費目）
teasp.Tsf.EmpExp.MISMATCH_EXPITEM_CLASS     = 0x0002;  // 費目表示区分不整合（費目）
teasp.Tsf.EmpExp.MISMATCH_PAY_TYPE          = 0x0004;  // 精算区分不整合（支払種別）
teasp.Tsf.EmpExp.MISMATCH_PAY_EXPENSE_TYPE  = 0x0008;  // 精算区分不整合（支払先）
teasp.Tsf.EmpExp.MISMATCH_MASK              = 0x000F;  // 不整合関連マスク
teasp.Tsf.EmpExp.EMPTY_JOB                  = 0x0010; // ジョブ未入力（必須設定時）
teasp.Tsf.EmpExp.EMPTY_CHARGE_DEPT          = 0x0020; // 負担部署未入力（必須設定時）
teasp.Tsf.EmpExp.EMPTY_ROUTE                = 0x0040; // 経路未入力（必須設定時）
teasp.Tsf.EmpExp.EMPTY_EXTRA1               = 0x0080; // 拡張項目１入力（必須設定時）
teasp.Tsf.EmpExp.EMPTY_EXTRA2               = 0x0100; // 拡張項目２入力（必須設定時）
teasp.Tsf.EmpExp.EMPTY_MASK                 = 0x01F0; // ジョブ、負担部署、経路未入力マスク
teasp.Tsf.EmpExp.JTB_ACTUAL_OLD             = 0x0200; // JTB実績データが古い

/**
 * 外部入力＝spice
 *
 * @param {stinrg} item
 * @returns {Boolean}
 */
teasp.Tsf.EmpExp.isSpice = function(item){
    return (item && item == 'spice');
};

teasp.Tsf.EmpExp.isExternalExpense = function(item){
    return (item && item == teasp.Tsf.ITEM_EXTERNAL);
};

teasp.Tsf.EmpExp.isUber = function(item){
    return (item && item == 'uber');
};

teasp.Tsf.EmpExp.isJtb = function(item){
    return (item && item == 'JTB');
};

/**
 * Uber の経費明細があれば、経路情報から発駅と着駅をセットする
 * @param {Array.<Object>} exps
 */
teasp.Tsf.EmpExp.convertExps = function(exps){
    dojo.forEach(exps || [], function(exp){
        if(teasp.Tsf.EmpExp.isUber(exp.Item__c)   // Item__c に 'uber' がセットされている
        && exp.Route__c                           // Route__c に値がセットされている
        && (!exp.startName__c || !exp.endName__c) // 発駅名または着駅名が空
        ){
            var route = exp.Route__c;
            try{
                if(typeof(route) == 'string'){
                    route = dojo.fromJson(route); // Route__c をオブジェクト化
                }
                if(!exp.startName__c){
                    exp.startName__c = route.fromAddress || ''; // 発駅名セット
                }
                if(!exp.endName__c){
                    exp.endName__c = route.toAddress || ''; // 着駅名セット
                }
            }catch(e){}
        }
        var d = (exp.ExternalICExpenseId__r && exp.ExternalICExpenseId__r.UsageDate__c) || null;
        if(d && typeof(d) == 'number'){
            exp.ExternalICExpenseId__r.UsageDate__c = teasp.util.date.formatDate(d);
        }
    });
};

teasp.Tsf.EmpExp.prototype.isRemoved = function(){
    return (this.obj && this.obj._removed) || false;
};


teasp.Tsf.EmpExp.prototype.isFix = function(){
    if(this.obj && this.obj.ExpApplyId__r && this.obj.ExpApplyId__r.StatusC__c){
        return (/^(承認待ち|承認済み|確定済み)$/.test(this.obj.ExpApplyId__r.StatusC__c));
    }
    return false;
};

/**
 * 経費明細が経費申請があるかをを取得する
 * タイムレポートからからイメージ表示画面を表示する際のみ有効
 */
teasp.Tsf.EmpExp.prototype.isInExpApply = function(){
    return this.obj && this.obj.ExpApplyId__r;
};

/**
 * Attatchmentの配列を取得する
 */
teasp.Tsf.EmpExp.prototype.getAttachments = function(){
    var o = (this.obj || {});
    return (o.Attachments || []);
};

/**
 * Contentdocumentlinksの配列を取得する
 */
teasp.Tsf.EmpExp.prototype.getContentDocumentLinks = function(){
    var o = (this.obj || {});
    return (o.ContentDocumentLinks || []);
};

teasp.Tsf.EmpExp.setAttachmentExist = function(domHelper, el, fc, hkey, flag){
    teasp.Tsf.EmpExp.toggleReceiptIcon(el, flag); // アイコン切替
    if(flag){
        var s = fc.fetchValue(hkey).value;
        var attachments = (s ? teasp.Tsf.util.fromJson(s) : []);
        if(!attachments || !teasp.Tsf.util.isArray(attachments)){
            attachments = [];
        }
        attachments.push({ Id: 'DUMMY' });
        fc.drawText(domHelper, { Attachments: teasp.Tsf.util.toJson(attachments) }, hkey);
    }else{
        fc.drawText(domHelper, { Attachments: null }, hkey);
    }
};

teasp.Tsf.EmpExp.setAttachmentExist2 = function(domHelper, el, obj, flag){
    teasp.Tsf.EmpExp.toggleReceiptIcon(el, flag); // アイコン切替
    if(flag){
        var attachments = obj.Attachments;
        if(!attachments || !teasp.Tsf.util.isArray(attachments)){
            attachments = obj.Attachments = [];
        }
        attachments.push({ Id: 'DUMMY' });
    }else{
        delete obj.Attachments;
    }
};

teasp.Tsf.EmpExp.toggleReceiptIcon = function(el, flag){
    var n = teasp.Tsf.Dom.node('input[type="button"].pp_ico_receipt' + (flag ? '' : '_a'), el);
    if(!n){
        return;
    }
    teasp.Tsf.Dom.toggleClass(n, 'pp_ico_receipt_a',  flag);
    teasp.Tsf.Dom.toggleClass(n, 'pp_ico_receipt'  , !flag);
    n.title = teasp.message.getLabel(flag ? 'attachedReceipt' : 'nonReceipt'); // 領収書添付済み or 領収書未添付
};

teasp.Tsf.EmpExp.diffRoute1 = function(o1, o2){
    if(!o2){ return { difference: false }; }
    return { difference: !(o1
            && o1.startName__c == o2.startName__c
            && o1.endName__c   == o2.endName__c
            && o1.roundTrip__c == o2.roundTrip__c) };
};

teasp.Tsf.EmpExp.diffRoute2 = function(o1, o2){
    if(!o2){ return { difference: false }; }
    var r1 = (o1 ? o1.Route__c : null);
    var r2 = o2.Route__c;
    if(typeof(r1) != 'string'){ r1 = teasp.Tsf.util.toJson(r1); }
    if(typeof(r2) != 'string'){ r2 = teasp.Tsf.util.toJson(r2); }
    return { difference: !(r1 == r2) };
};

teasp.Tsf.EmpExp.diffQuantity = function(o1, o2){
    if(!o2){ return { difference: false }; }
    return { difference: !(o1
            && o1.UnitPrice__c == o2.UnitPrice__c
            && o1.Quantity__c == o2.Quantity__c) };
};

teasp.Tsf.EmpExp.diffTax = function(o1, o2){
    if(!o2){ return { difference: false }; }
    return { difference: !(o1
            && o1.Tax__c == o2.Tax__c
            && o1.WithoutTax__c == o2.WithoutTax__c) };
};

teasp.Tsf.EmpExp.diffForeign = function(o1, o2){
    if(!o2){ return { difference: false }; }
    return { difference: !(o1
            && o1.CurrencyName__c == o2.CurrencyName__c
            && o1.CurrencyRate__c == o2.CurrencyRate__c
            && o1.ForeignAmount__c == o2.ForeignAmount__c) };
};

teasp.Tsf.EmpExp.diffPublisher = function(o1, o2){
    if(!o2){ return { difference: false }; }
    return { difference: !(o1 && o1.Publisher__c == o2.Publisher__c ) };
};

teasp.Tsf.EmpExp.diffAmountPerParticipant = function(o1, o2){
    if(!o2){ return { difference: false }; }
    return { difference: !(o1
            && o1.WithoutTax__c == o2.WithoutTax__c
            && o1.InternalParticipantsNumber__c == o2.InternalParticipantsNumber__c
            && o1.ExternalParticipantsNumber__c == o2.ExternalParticipantsNumber__c
            ) };
};

teasp.Tsf.EmpExp.diffInternalParticipants = function(o1, o2){
    if(!o2){ return { difference: false }; }
    return { difference: !(o1
            && o1.InternalParticipants__c == o2.InternalParticipants__c
            && o1.InternalParticipantsNumber__c == o2.InternalParticipantsNumber__c
            ) };
};

teasp.Tsf.EmpExp.diffExternalParticipants = function(o1, o2){
    if(!o2){ return { difference: false }; }
    return { difference: !(o1
            && o1.ExternalParticipants__c == o2.ExternalParticipants__c
            && o1.ExternalParticipantsNumber__c == o2.ExternalParticipantsNumber__c
            ) };
};

teasp.Tsf.EmpExp.diffPlace = function(o1, o2){
    if(!o2){ return { difference: false }; }
    return { difference: !(o1
            && o1.PlaceName__c == o2.PlaceName__c
            && o1.PlaceAddress__c == o2.PlaceAddress__c
            ) };
};

teasp.Tsf.EmpExp.diffExtraItem1 = function(o1, o2){
    if(!o2){ return { difference: false }; }
    return { difference: !(o1 && o1.ExtraItem1__c == o2.ExtraItem1__c) };
};

teasp.Tsf.EmpExp.diffExtraItem2 = function(o1, o2){
    if(!o2){ return { difference: false }; }
    return { difference: !(o1 && o1.ExtraItem2__c == o2.ExtraItem2__c) };
};

teasp.Tsf.EmpExp.diffPayment = function(o1, o2){
    if(!o2){ return { difference: false }; }
    if(typeof(o1.PaymentDate__c) != 'string'){ o1.PaymentDate__c = teasp.util.date.formatDate(o1.PaymentDate__c); }
    if(typeof(o2.PaymentDate__c) != 'string'){ o2.PaymentDate__c = teasp.util.date.formatDate(o2.PaymentDate__c); }
    return { difference: !(o1
            && o1.PayeeId__c == o2.PayeeId__c
            && o1.PaymentDate__c == o2.PaymentDate__c) };
};

teasp.Tsf.EmpExp.diffChargeDept = function(o1, o2){
    if(!o2){ return { difference: false }; }
    return { difference: !(o1 && o1.ChargeDeptId__c == o2.ChargeDeptId__c) };
};

teasp.Tsf.EmpExp.diffInvoiceURL = function(o1, o2){
    if(!o2){ return { difference: false }; }
    return { difference: !(o1 && o1.InvoiceURL__c == o2.InvoiceURL__c) };
};

/**
 * 領収書アイコンのクリック可否
 * （削除済み、事前申請、履歴表示の場合、不可）
 * @returns {Boolean}
 */
teasp.Tsf.EmpExp.prototype.isClickableReceipt = function(){
    return (this.isRemoved() || this.pre || this.hist) ? false : true;
};

/**
 * 駅探アイコンのクリック可否
 * （削除済み、履歴表示の場合、不可）
 * @returns {Boolean}
 */
teasp.Tsf.EmpExp.prototype.isClickableEkitan = function(){
    return (this.isRemoved() || this.hist) ? false : true;
};

/**
 *
 * @param {teasp.Tsf.Dom} domHelper
 * @param {string} key
 * @param {Object=} preObj
 * @param {boolean=} flag =trueの場合、印刷用
 * @returns {Array.<Object>}
 */
teasp.Tsf.EmpExp.prototype.getExpContent = function(domHelper, key, preObj, flag){
    var str = '';
    var o = this.obj;
    var els = [];

    var expItem = tsfManager.getExpItemById(o.ExpItemId__c);
    if(!expItem){
        return els;
    }
    if(o.TransportType__c == '1' || o.TransportType__c == '2'){ // 交通費の費目
        var st = (o.startName__c || '');
        var et = (o.endName__c   || '');
        var route = null;
        if(o.Route__c){
            route = o.Route__c;
            if(typeof(route) == 'string'){
                route = dojo.fromJson(route);
            }
        }
        if(st || et){
            str += teasp.message.getLabel(
                    (o.roundTrip__c ? 'tm20009040' : 'tm20009060')  // {0}⇔{1} or {0}⇒{1}
                  , teasp.Tsf.util.entitizf(st)
                  , teasp.Tsf.util.entitizf(et)
                  );
            if(route && route.ICCardMode == '1'){
                str += ('  ' + teasp.message.getLabel('tk10005550')); // (IC運賃)
            }
            var el = domHelper.create('div', {
                className   : 'ts-route-str',
                innerHTML   : str
            });
            teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffRoute1(o, preObj));
            els.push(el);
        }
        if(route && route.route){ // 経路詳細がある
            var routeText = (new teasp.helper.EkitanRoute(route.route)).createSimpleText();
            var el = domHelper.create('div', {
                className   : 'ts-content-detail',
                innerHTML   : teasp.message.getLabel('tm30001045', teasp.Tsf.util.entitizf(routeText))
            });
            teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffRoute2(o, preObj));
            els.push(el);
        }
    }
    if(expItem.isEnableQuantity()){ // 数量あり
        var el = domHelper.create('div', {
            className   : 'ts-content-detail',
            innerHTML   : teasp.message.getLabel('tm20004720') // 単価
                        + teasp.message.getLabel('tm10001590') // ：
                        + '<span class="ts-currency2">'
                        + teasp.Tsf.Currency.formatMoney(o.UnitPrice__c, teasp.Tsf.Currency.V_YEN, false, true)
                        + '</span>&nbsp;&nbsp;&nbsp;'
                        + teasp.message.getLabel('tm20004730') // 数量
                        + teasp.message.getLabel('tm10001590') // ：
                        + '<span class="ts-currency2">'
                        + teasp.util.currency.formatDecimal(o.Quantity__c, 0, 0, false).str
                        + '</span>'
                        + '<span class="ts-currency2">'
                        + teasp.Tsf.util.entitizf(expItem.getUnitName())
                        + '</span>'
        });
        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffQuantity(o, preObj));
        els.push(el);
    }
    if(expItem.isTaxFlag()){ // 税入力あり
        var html = teasp.Tsf.ExpDetail.getTaxTypeName(o.TaxType__c);
        if(o.TaxType__c != '0' || !o.TaxAuto__c){
            html += (teasp.message.getLabel('tm10001590') // ：
                + '<span class="ts-currency2">'
                + teasp.Tsf.Currency.formatMoney(o.Tax__c, teasp.Tsf.Currency.V_YEN, false, true)
                + '</span> '
                + (o.TaxAuto__c ? '' : teasp.message.getLabel('tm20001200'))) // (手入力)
                + '<span class="ts-currency2">'
                + (typeof(o.TaxRate__c) == 'number' ? ' ' + teasp.message.getLabel('tm10001680', (o.TaxRate__c + '%')) : '')
                + '</span> '
        }
        var el = domHelper.create('div', { className: 'ts-content-detail', innerHTML: html });
        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffTax(o, preObj));
        els.push(el);
    }
    if(expItem.isForeignFlag()){ // 外貨入力あり
        var el = domHelper.create('div', {
            className   : 'ts-content-detail',
            innerHTML   : teasp.message.getLabel('tm20001172', // 通貨 [{0}] 換算レート <span class="ts-currency2">{1}</span> 現地金額 <span class="ts-currency2">{2}</span>
                            teasp.Tsf.util.entitize(o.CurrencyName__c, teasp.Tsf.ForeignCurrency.NONE),
                            teasp.util.currency.formatDecimal(o.CurrencyRate__c , teasp.constant.CU_DEC_POINT_MIN, teasp.constant.CU_DEC_POINT_MAX).str,
                            teasp.util.currency.formatDecimal(o.ForeignAmount__c, teasp.constant.CU_DEC_POINT_MIN, teasp.constant.CU_DEC_POINT_MAX, true).str
                        )
        });
        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffForeign(o, preObj));
        els.push(el);
    }
    if(o.Publisher__c){ // 発行者（店名）
        var el = domHelper.create('div', {
            className   : 'ts-content-detail',
            innerHTML   : teasp.message.getLabel('tm10001070' // {0}：{1}
                            , teasp.message.getLabel('tf10004960')
                            , teasp.Tsf.util.entitizf(o.Publisher__c)
            )
        });
        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffPublisher(o, preObj));
        els.push(el);
    }
    if(expItem.isInternalParticipants() || expItem.isExternalParticipants()){ // 人数割金額

        var el = domHelper.create('div', {
            className   : 'ts-content-detail',
            innerHTML :    teasp.message.getLabel('tf10011000')
                            + teasp.message.getLabel('tm10001590')
                            + '<span class="ts-currency2">'
                            + teasp.Tsf.Currency.formatMoney(o.AmountPerParticipant__c, teasp.Tsf.Currency.V_YEN, false, true)
                            + '</span>'
        });

        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffAmountPerParticipant(o, preObj));
        els.push(el);
    }
    if(expItem.isInternalParticipants()){ // 社内参加者
        var el = domHelper.create('div', {
            className   : 'ts-content-detail',
            innerHTML   : teasp.message.getLabel('tf10011050', // 社内参加者 （{0}） 名 
                            teasp.Tsf.util.entitize(o.InternalParticipantsNumber__c || 0))
                        
        });
        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffInternalParticipants(o, preObj));
        els.push(el);
        if(o.InternalParticipants__c){
            var cnt = 0;
            var indent = 1;

            dojo.some(o.InternalParticipants__c.trim().split(/\r?\n/), function(e){  //社内参加者一覧
                var el = domHelper.create('div', {
                    className   : 'ts-content-detail',
                    style:'margin-left:' + indent + 'em',  //インデントを設定
                    innerHTML   : teasp.Tsf.util.entitizg(e)
                });
                teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffInternalParticipants(o, preObj));
                cnt += el.innerHTML.length;
                if(!flag && cnt > 100){
                    var len = 100 - (cnt - el.innerHTML.length) ;
                    el.innerHTML = el.innerHTML.substring(0, len) + '...';
                    els.push(el);
                    return true;
                }
                els.push(el);
                cnt++;
            });
        }
    }
    if(expItem.isExternalParticipants()){ // 社外参加者
        var el = domHelper.create('div', {
            className   : 'ts-content-detail',
            innerHTML   : teasp.message.getLabel('tf10011060',  // 社外参加者 （{0}） 名 
                            + teasp.Tsf.util.entitize(o.ExternalParticipantsNumber__c || 0))
                        
        });
        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffExternalParticipants(o, preObj));
        els.push(el);
        if(o.ExternalParticipants__c){
            var cnt = 0;
            var indent = 1;

            dojo.some(o.ExternalParticipants__c.trim().split(/\r?\n/), function(e){  //社内参加者一覧
                var el = domHelper.create('div', {
                    className   : 'ts-content-detail',
                    style:'margin-left:' + indent + 'em',   //インデントを設定
                    innerHTML   : teasp.Tsf.util.entitizg(e)
                });
                teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffExternalParticipants(o, preObj));
                cnt += el.innerHTML.length;
                if(!flag && cnt > 100){
                    var len = 100 - (cnt - el.innerHTML.length) ;
                    el.innerHTML = el.innerHTML.substring(0, len) + '...';
                    els.push(el);
                    return true;
                }
                els.push(el);
                cnt++;
            });
        }
        
    }
    if(expItem.isPlace()){ // 店舗情報
        var ex = expItem.getExtraItem(1);
        var el = domHelper.create('div', {
                    className: 'ts-content-detail',
                    innerHTML: teasp.message.getLabel('tm10001070' // {0}：{1}
                            , teasp.message.getLabel('tf10011010')
                            , teasp.Tsf.util.entitizf(o.PlaceName__c))
                    });
        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffPlace(o, preObj));
        els.push(el);

        el = domHelper.create('div', {  //店舗所在地
            className: 'ts-content-detail',
            innerHTML: teasp.message.getLabel('tf10011020') //表題
        });
        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffPlace(o, preObj));
        cnt += el.innerHTML.length;
        els.push(el);
        var cnt = 0;
        var indent = 1;
        if(o.PlaceAddress__c){
            var PlaceAddress = o.PlaceAddress__c.trim().split(/\r?\n/);
            dojo.some(PlaceAddress, function(e){    //2行目以降に内容を表示(インデント付)
                el = domHelper.create('div', {
                    className   : 'ts-content-detail',
                    style:'margin-left:' + indent + 'em',
                    innerHTML   :teasp.Tsf.util.entitizg(e)
                });
                
                teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffPlace(o, preObj));
                cnt += el.innerHTML.length;
                els.push(el);
            });
        }
    }
    if(expItem.isUseExtraItem1()){ // 拡張項目１
        var ex = expItem.getExtraItem(1);
        var el = domHelper.create('div', {
                    className: 'ts-content-detail',
                    innerHTML: teasp.message.getLabel('tm10001070' // {0}：{1}
                            , teasp.Tsf.util.entitizg(ex.name)
                            , teasp.Tsf.util.entitizf(o.ExtraItem1__c))
                    });
        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffExtraItem1(o, preObj));
        els.push(el);
    }
    if(expItem.isUseExtraItem2()){ // 拡張項目２
        var ex = expItem.getExtraItem(2);
        var el = domHelper.create('div', {
                    className: 'ts-content-detail',
                    innerHTML: teasp.message.getLabel('tm10001070' // {0}：{1}
                            , teasp.Tsf.util.entitizg(ex.name)
                            , teasp.Tsf.util.entitizf(o.ExtraItem2__c))
                    });
        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffExtraItem2(o, preObj));
        els.push(el);
    }
    if(!teasp.Tsf.EmpExp.isJtb(o.Item__c) && (o.PaymentDate__c || o.PayeeName__c || o.PayeeId__c)){ // 支払先・支払日
        var payName = teasp.Tsf.util.entitizf(o.PayeeName__c || (o.PayeeId__r && o.PayeeId__r.Name));
        var payDate = (new teasp.Tsf.Fc({ apiKey:'PaymentDate__c', domType: 'date' })).parseValue(o).dispValue;
        var el = domHelper.create('div', {
            className   : 'ts-content-detail',
            innerHTML   : (payName ? teasp.message.getLabel('tm10001070', teasp.message.getLabel('tf10000580'), payName) + '&nbsp;&nbsp;&nbsp;' : '') // 支払先：{1}
                        + (payDate ? teasp.message.getLabel('tm10001070', teasp.message.getLabel('tf10000590'), payDate) : '')  // 支払日：{1}
        });
        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffPayment(o, preObj));
        els.push(el);
    }
    if(!flag && o.InvoiceURL__c){ // 請求書URL
        var el = domHelper.create('a', {
                className   : 'ts-content-detail ts-content-invoiceURL',
                href        : o.InvoiceURL__c,
                target      : '_blank',
                innerHTML   : teasp.message.getLabel('ex00001241')
            });
        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffInvoiceURL(o, preObj));
        els.push(el);
    }
    if(o.ChargeDeptId__c){
        var el = domHelper.create('div', {
            className: 'ts-content-detail',
            innerHTML: teasp.message.getLabel('tm10001070' // {0}：{1}
                    , teasp.message.getLabel('tf10006000') // 負担部署
                    , (o.ChargeDeptId__r.Name || ''))
            });
        teasp.Tsf.Fc.setBackground(el, teasp.Tsf.EmpExp.diffChargeDept(o, preObj));
        els.push(el);
    }

    // #7352　実績ステータスを表示
    if(teasp.Tsf.EmpExp.isJtb(o.Item__c)){
        var status = (o.Text__c || '');
        if (status) {
            var el = domHelper.create('div', {
                className   : 'ts-content-detail',
                innerHTML   : teasp.message.getLabel('jt13000140') + status
            });
            els.push(el);
        }
    }

    if(els.length <= 0){
        els.push(domHelper.create('div', { innerHTML: '&nbsp;' }));
    }

    // アイコンエリア
    var icons = domHelper.create('div', { className: 'ts-route-icons' });
    els.unshift(icons);

    // 領収書入力経由の明細
    var receiptIn = (o.CardStatementLineId__r && o.CardStatementLineId__r.RecordType && o.CardStatementLineId__r.RecordType.Name == '領収書');

    var iconTag = (flag ? 'img' : 'div');
    if(o.PayeeId__r && !teasp.Tsf.EmpExp.isJtb(o.Item__c)){
        if(o.CardStatementLineId__c && !receiptIn){ // 法人カード（カード明細読込）
            domHelper.create(iconTag, { className: (flag ? 'pic_card2' : 'pp_ico_card2') }, icons);
        }else if(o.PayeeId__r.PayeeType__c == '3'){ // 法人カード（カード明細読込ではない）
            domHelper.create(iconTag, { className: (flag ? 'pic_card1' : 'pp_ico_card1') }, icons);
        }else if(o.PayeeId__r.PayeeType__c == '2'){ // 請求書
            domHelper.create(iconTag, { className: (flag ? 'pic_bill'  : 'pp_ico_bill' ) }, icons);
        }
    }
    if(teasp.Tsf.EmpExp.isSpice(o.Item__c)){ // ICアイコン
        domHelper.create(iconTag, { className: (flag ? 'pic_ic'  : 'ts-spice' ) }, icons);
    }else if(teasp.Tsf.EmpExp.isJtb(o.Item__c)){	// J'sNAVI
    	//domHelper.create(iconTag, { className: (flag ? 'pic_jtb'  : 'pp_base pp_ico_jtb_ticket' ) }, icons);
    	domHelper.create(iconTag, { className: (flag ? 'pic_jtb'  : 'pp_ico_jtb_ticket' ) }, icons);
    }else if(o.TransportType__c == '1'){ // 駅探検索の費目
        if(flag){
            domHelper.create('img', { className: 'pic_ekitan' }, icons);
        }else{
            var button = domHelper.create('input', { type: 'button', className: 'pp_base pp_ico_ekitan' }, icons); // 駅探検索アイコン
            if(!this.isClickableEkitan()){ // 削除済み表現のときは、駅探アイコンをクリックしても無反応にする
                teasp.Tsf.Dom.style(button, 'cursor', 'default');
            }else{
                // 駅探アイコンクリックで経路情報ダイアログを開く
                domHelper.connect(button, 'onclick', this, function(e){
                    tsfManager.showDialog('ExpRoute', this.obj.Route__c);
                }, key);
            }
        }
    }
    if(teasp.Tsf.EmpExp.isExternalExpense(o.Item__c)){ // ICアイコン
        domHelper.create(iconTag, { className: (flag ? 'pic_pit' : 'ts-external' ) }, icons);
    }
    if(o.Receipt__c){ // 領収書
        // 添付ファイル(AttachmentかContentDocumentLink)がある、もしくは領収書読込を行ったかどうか
        var hasAttachedFile = (this.getAttachments().length > 0 || this.getContentDocumentLinks().length > 0 || (!this.obj.Id && this.obj._temp_attach));
        if(flag){
            var picn = 'pic_receipt';
            if(teasp.Tsf.EmpExp.isUber(o.Item__c)){ // uber
                picn += '_u';
            }else if(hasAttachedFile){
                picn += (receiptIn ? '_r' : '_i');
            }
            domHelper.create('img', { className: picn }, icons);
        }else{
            var sfx = '';
            if(teasp.Tsf.EmpExp.isUber(o.Item__c)){ // uber
                sfx = '_u';
            }else if(hasAttachedFile){
                sfx = (receiptIn ? '_r' : '_a');
            }
            var button = domHelper.create('input', {
                type        : 'button',
                className   : 'pp_ico_receipt' + sfx, // 領収書アイコン
                title       : teasp.message.getLabel(this.pre ? 'tf10004690' : (hasAttachedFile ? 'attachedReceipt' : 'nonReceipt')) // 領収書要 or 領収書添付済み or 領収書未添付
            }, icons);
            if(!this.isClickableReceipt()){
                // 削除済みまたは事前申請の明細なら、領収書アイコンをクリックしても無反応にする
                teasp.Tsf.Dom.style(button, 'cursor', 'default');
            }else{
                if(!this.obj.Id){ // 明細が未保存
                    if(this.obj._temp_attach){
                        try{
                            var ta = teasp.Tsf.util.fromJson(this.obj._temp_attach);
                            domHelper.connect(button, 'onclick', this, function(e){
                                tsfManager.openReceiptImageView(ta.Id, ta.ParentId);
                            }, key);
                        }catch(e){}
                    }else{
                        domHelper.createTooltip({
                            connectId   : button,
                            label       : teasp.message.getLabel('tf10001660'), // 保存後、画像ファイルをアップロード<br/>できるようになります。
                            position    : ['below'],
                            showDelay   : 200
                        });
                    }
                }else{
                    domHelper.connect(button, 'onclick', this, function(e){
                        tsfManager.openExpImageView(this.obj.Id, this.isInExpApply());
                    }, key);
                }
            }
        }
    }
    return els;
};
