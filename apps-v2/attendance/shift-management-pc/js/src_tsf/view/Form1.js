/**
 * 出張・交通費申請フォーム
 *
 * @constructor
 */
teasp.Tsf.Form1 = function(){
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.form1);
    this.sections = [
        new teasp.Tsf.SectionJtb(this),            // J'sNAVI明細
        new teasp.Tsf.SectionAllowance(this),      // 日当・宿泊費セクション
        new teasp.Tsf.SectionCoupon(this),         // 手配回数券セクション
        new teasp.Tsf.SectionTicket(this),         // 手配チケットセクション
        new teasp.Tsf.SectionForeign(this),        // 海外出張セクション
        new teasp.Tsf.SectionProvisional(this),    // 仮払い申請セクション
        new teasp.Tsf.SectionDetail(this),         // 社員立替交通費セクション
        new teasp.Tsf.SectionExpAttach(this)       // 添付ファイルセクション
    ];
};

teasp.Tsf.Form1.prototype = new teasp.Tsf.FormBase();

teasp.Tsf.Form1.prototype.getFormStyle = function(){ return 1; };

/**
 * 初期化
 *
 */
teasp.Tsf.Form1.prototype.init = function(){
    // 事前申請のオプション適用
    var typeName = this.objBase.getTypeName();
    this.dptArvFlagsOptional = tsfManager.getInfo().isDptArvFlagsOptional (typeName);   // 出発区分を必須としない
    this.useOverseaTravel    = tsfManager.getInfo().isUseOverseaTravel(typeName);       // 海外出張を使う
    this.useOneDayTrip       = tsfManager.getInfo().isUseOneDayTrip(typeName);          // 日帰り出張を使う
    this.useJtbSect          = tsfManager.getInfo().isUseJtbSect(typeName) && tsfManager.isUsingJsNaviSystem();             // J'sNAVI明細セクションを使う
    this.useAllowanceSect    = tsfManager.getInfo().isUseAllowanceSect(typeName);       // 出張手当・宿泊手当セクションを使う
    this.useCouponTicketSect = tsfManager.getInfo().isUseCouponTicketSect(typeName);    // 手配回数券セクションを使う
    this.useTicketArrangeSect= tsfManager.getInfo().isUseTicketArrangeSect(typeName);   // 手配チケットセクションを使う
    this.useProvisionalSect  = tsfManager.getInfo().isUseProvisionalSect(typeName);     // 仮払申請セクションを使う
    this.useFreeInputSect    = tsfManager.getInfo().isUseFreeInputSect(typeName);       // 社員立替交通費セクションを使う

    // 出発区分を必須としない
    if(this.dptArvFlagsOptional){
        var fc1 = this.fp.getFcByApiKey('DepartureType__c'); // 出発区分
        var fc2 = this.fp.getFcByApiKey('ReturnType__c');    // 帰着区分
        if(fc1){ fc1.setRequired(0); }
        if(fc2){ fc2.setRequired(0); }
    }
    // 出張種別の選択リスト制限
    if(!this.useOverseaTravel || !this.useOneDayTrip){
        // 既に値がセットされている場合は、選択できるようにする
        var type = this.objBase.getDestinationType();
        if(!this.useOverseaTravel && type == teasp.Tsf.ExpPreApply.DESTINATION_TYPE_OVERSEA){ // 海外出張
            this.useOverseaTravel = true;
        }else if(!this.useOneDayTrip && type == teasp.Tsf.ExpPreApply.DESTINATION_TYPE_DAYTRIP){ // 日帰り交通費
            this.useOneDayTrip = true;
        }
        // 国内出張しか選択肢がない場合は国内出張をセット
        if(!this.useOverseaTravel && !this.useOneDayTrip){
            this.objBase.setDestinationType(teasp.Tsf.ExpPreApply.DESTINATION_TYPE_DOMESTIC); // 国内出張
        }
        var fc = this.fp.getFcByApiKey('DestinationType__c'); // 出張種別
        var lst = fc.getPickList();
        for(var i = lst.length - 1 ; i >= 0 ; i--){
            var o = lst[i];
            if((!this.useOverseaTravel && o.v == teasp.Tsf.ExpPreApply.DESTINATION_TYPE_OVERSEA)
            || (!this.useOneDayTrip    && o.v == teasp.Tsf.ExpPreApply.DESTINATION_TYPE_DAYTRIP)
            ){
                lst.splice(i, 1);
            }
        }
        fc.setPickList(lst);
    }

    // ★★ 親クラスの init を呼び出す ★★
    teasp.Tsf.FormBase.prototype.init.call(this);

    if(this.objBase.getProvisionalPaymentId()){ // 仮払申請のリンクがセットされている
        this.useProvisionalSect = false;        // 仮払申請セクションは非表示にする
    }
    // セクションの表示／非表示。値が入力済みの場合は設定に関わらず表示
    if(!this.useJtbSect           && this.existSectionValue('jtbDetail'  )){ this.useJtbSect           = true; } // J'sNAVI明細セクションを使う
    if(!this.useAllowanceSect     && this.existSectionValue('allowance'  )){ this.useAllowanceSect     = true; } // 出張手当・宿泊手当セクションを使う
    if(!this.useCouponTicketSect  && this.existSectionValue('coupon'     )){ this.useCouponTicketSect  = true; } // 手配回数券セクションを使う
    if(!this.useTicketArrangeSect && this.existSectionValue('ticket'     )){ this.useTicketArrangeSect = true; } // 手配チケットセクションを使う
    if(!this.useProvisionalSect   && this.existSectionValue('provisional')){ this.useProvisionalSect   = true; } // 仮払い申請セクションを使う
    if(!this.useFreeInputSect     && this.existSectionValue('detail'     )){ this.useFreeInputSect     = true; } // 社員立替交通費セクションを使う

    this.showSection('jtbDetail'  , this.useJtbSect    );       // J'sNAVI明細セクションを使う
    this.showSection('allowance'  , this.useAllowanceSect    ); // 出張手当・宿泊手当セクションを使う
    this.showSection('coupon'     , this.useCouponTicketSect ); // 手配回数券セクションを使う
    this.showSection('ticket'     , this.useTicketArrangeSect); // 手配チケットセクションを使う
    this.showSection('provisional', this.useProvisionalSect  ); // 仮払い申請セクションを使う
    this.showSection('detail'     , this.useFreeInputSect    ); // 社員立替交通費セクションを使う

    // 海外出張エリアは初期値で非表示、出張種別に海外出張が選択された時に表示。
    this.showSection('foreign'    , false);
    var destype = this.fp.getElementByApiKey('DestinationType__c', null, areaDiv); // 出張種別
    if(destype){
        this.getDomHelper().connect(destype, 'onchange', this, function(e){
            if(e.target.value == teasp.Tsf.ExpPreApply.DESTINATION_TYPE_OVERSEA){ // 海外出張
                this.showSection('foreign', true);
            }else{ // 海外出張以外
                this.showSection('foreign', false);
            }
        });
    }

    if(this.useAllowanceSect){ // 出張手当・宿泊手当セクションを使う
        // 出発予定日、帰着予定日の変更イベントを受信
        var areaDiv = teasp.Tsf.Dom.byId(this.fp.getAreaId());
        teasp.Tsf.Dom.query('input[name="form1StartDate"], input[name="form1EndDate"]', areaDiv).forEach(function(el){
            this.getDomHelper().connect(el, 'onblur', this, function(e){
                this.selectedDate(e.target);
            });
        }, this);
    }
};

/**
 * 画面更新
 *
 * @override
 * @param {Object} objBase
 */
teasp.Tsf.Form1.prototype.refresh = function(objBase, mode){
    // ★★ 親クラスの refresh を呼び出す ★★
    teasp.Tsf.FormBase.prototype.refresh.call(this, objBase, mode);

    // 金額
    teasp.Tsf.Dom.html('.ts-total-amount', null, this.objBase.getTotalAmount() || '&nbsp;');

    // 手配予定金額
    if (this.objBase.obj.PlannedAmount__c == null || this.objBase.obj.PlannedAmount__c == 0) {
        dojo.byId('plannedAmountInput').value = '';
    } else {
        dojo.byId('plannedAmountInput').value = teasp.Tsf.Currency.formatMoney(this.objBase.obj.PlannedAmount__c, teasp.Tsf.Currency.V_YEN, false, true);
    }
    
    // 海外出張セクションの開閉
    this.showSection('foreign', (this.objBase.getDestinationType() == teasp.Tsf.ExpPreApply.DESTINATION_TYPE_OVERSEA));

    if(this.useAllowanceSect){ // 出張手当・宿泊手当セクションを使う
        this.selectedDate();
    }
};

teasp.Tsf.Form1.prototype.createBase = function(){
    // ★★ 親クラスの createBase を呼び出す ★★
    var areaEl = teasp.Tsf.FormBase.prototype.createBase.call(this);

    // JsNAVI を使用する
    if(this.useJtbSect){
        var formEl = teasp.Tsf.Dom.node('div.ts-zone-type1', areaEl);
        var jtbEl   = this.getDomHelper().create('div', { className: 'ts-jtb-zone' }, formEl);
    }

    return areaEl;
};

/**
 * 金額が変更された
 *
 * @param {Object} e
 */
teasp.Tsf.Form1.prototype.changedCurrency = function(e){
    var data = this.getDomValues();
    var cost = 0;

    // 日当・宿泊費の金額を合計する
    dojo.forEach(data.ExpPreApplyDay__r.values, function(v){
        var aid = v.AllowanceItemId__c;
        var hid = v.HotelItemId__c;
        var a = (aid ? tsfManager.getExpItemById(aid) : null);
        var h = (hid ? tsfManager.getExpItemById(hid) : null);
        if(a){
            var n = a.getCost(v.Date__c);
            cost += n;
        }
        if(h){
            var n = h.getCost(v.Date__c);
            cost += n;
        }
    });

    // 社員立替交通費の金額を合計する
    dojo.forEach(data.EmpExp__r.values, function(v){
        cost += teasp.Tsf.util.parseInt(v.Cost__c) || 0;
    });
    
    // J'sNAVI Jr使用時
    if(this.useJtbSect){
    	var tmp = teasp.Tsf.Dom.byId('Form1PlannedAmount').value;
    	var pa = tmp.replace(/\\/g, "").split(",").join("");
    	cost += teasp.Tsf.util.parseInt(pa);
    }
    
    teasp.Tsf.Dom.html('.ts-total-amount', null, teasp.Tsf.Currency.formatMoney(cost, teasp.Tsf.Currency.V_YEN, false, true));
    teasp.Tsf.Dom.byId('Form1TotalAmount').value = '' + cost;

    teasp.Tsf.FormBase.prototype.changedCurrency.call(this);
};

teasp.Tsf.Form1.prototype.selectedDate = function(){
    var sd = this.fp.getFcByApiKey('StartDate__c').fetchValue().value;
    var ed = this.fp.getFcByApiKey('EndDate__c'  ).fetchValue().value;

    var osd = teasp.util.strToDate(sd);
    var oed = teasp.util.strToDate(ed);

    sd = osd.failed ? null : osd.datef;
    ed = oed.failed ? null : oed.datef;

    if(!osd.failed){
        this.fp.getFcByApiKey('StartDate__c').drawText(this.getDomHelper(), { StartDate__c:osd.datef });
    }
    if(!oed.failed){
        this.fp.getFcByApiKey('EndDate__c').drawText(this.getDomHelper(), { EndDate__c:oed.datef });
    }

    var section = this.getSectionByDiscernment(teasp.Tsf.formParams.sectionAllowance.discernment);
    if(section){
        section.rebuild({
            startDate   : teasp.util.date.formatDate(sd),
            endDate     : teasp.util.date.formatDate(ed)
        });
    }
    teasp.Tsf.FormBase.prototype.selectedDate.call(this);
};

teasp.Tsf.Form1.prototype.rebuildExpPreApplyDay = function(sd, ed, data){
    if(this.useAllowanceSect){ // 出張手当・宿泊手当セクションを使う
        return this.objBase.rebuildExpPreApplyDay(sd, ed, data);
    }else{
        return [];
    }
};

teasp.Tsf.Form1.prototype.checkDiff = function(){
    var data = teasp.Tsf.util.toJson(this.getDomValues(true));
    // dataは文字列なのでJSONオブジェクトに変換し、J'sNAVI Jr部分を削除してから比較する
    // ※J'sNAVI Jr部分は同期時にデータ保存済み
    var saveDataObj = JSON.parse(this.saveData);
    var dataObj = JSON.parse(data);
    delete saveDataObj.ExpJsNavi__r
    delete saveDataObj.values[0].ExpJsNavi__r
    delete dataObj.ExpJsNavi__r;
    delete dataObj.values[0].ExpJsNavi__r;
    delete dataObj.values[0].ssoMode;
    return (JSON.stringify(saveDataObj) != JSON.stringify(dataObj));
};

/**
 * 手配予定金額に値を設定する
 *
 * @override
 * @param {Object} objBase
 */
teasp.Tsf.Form1.prototype.getDomValues = function(flag, chklev, chkSep){
    var yotei = this.fp.getElementByApiKey('PlannedAmount__c', null, this.getArea());
    yotei.value = dojo.byId('plannedAmountInput').value;
    // セクションのチェックがOFFだったら値をクリアする
    var section = this.getSectionByDiscernment(teasp.Tsf.formParams.sectionJtb.discernment);
    if(section && !section.isOpen()) {
        yotei.value = null;
    }
    
    var plannedCost = teasp.Tsf.util.parseInt((yotei.value ? yotei.value : "").replace(/\\/g, "").split(",").join(""));
    var actualCost = 0;
    
    if (dojo.byId('ActualAmount') != null) {
    	actualCost = teasp.Tsf.util.parseInt(dojo.byId('ActualAmount').innerHTML.replace(/\\/g, "").split(",").join(""));
    }

	// 手配予定金額 < 手配金額の場合はメッセージを
	if (plannedCost < actualCost) {
		dojo.byId('tsfWarningArea').style.display = '';
	} else {
		dojo.byId('tsfWarningArea').style.display = 'none';
	}
    
    return teasp.Tsf.FormBase.prototype.getDomValues.call(this, flag,chklev, chkSep);
};
