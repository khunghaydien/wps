/**
 * 駅探設定
 *
 * @constructor
 */
teasp.Tsf.EkitanSetting = function(){
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.dialogEkitanSetting);
};

teasp.Tsf.EkitanSetting.prototype.show = function(obj){
    teasp.Tsf.Error.showError();
    obj.values = tsfManager.getEmpExpConfig();
    this.fp.setReadOnly(obj.ro);

    this.domHelper = new teasp.Tsf.Dom();
    this.dialog = new dijit.Dialog({
        title       : teasp.message.getLabel('ekitanSetting_caption'), // 駅探設定
        className   : 'ts-dialog-ekitan-setting'
    });
    this.dialog.attr('content', this.getContent());
    this.dialog.startup();
    this.domHelper.connect(this.dialog, 'onCancel', this, function(){ this.hide(); });
    this.showData(obj);
};

teasp.Tsf.EkitanSetting.prototype.showData = function(obj){
    this.drawData(obj);
    this.dialog.show();
};

teasp.Tsf.EkitanSetting.prototype.drawData = function(obj){
    this.orgData = obj;
    var vobj = this.orgData.values;
    // 値の型を変える
    vobj.ekitanArea             = '' + vobj.ekitanArea;                         // 地域
    vobj.usePaidExpress         = '' + (vobj.usePaidExpress   ? 1 : 0);         // 特急/新幹線
    vobj.useReservedSheet       = '' + (vobj.useReservedSheet ? 1 : 0);         // 特急料金
    vobj.preferredAirLine       = '' + vobj.preferredAirLine;                   // 優先する航空会社
    vobj.routePreference        = '' + vobj.routePreference;                    // 検索結果のソート
    vobj.excludeCommuterRoute   = '' + (vobj.excludeCommuterRoute ? 1 : 0);     // 定期区間の取扱

    this.showCommuterRouteWarn(vobj);

    this.fp.fcLoop(function(fc){
        if(fc.isApiField(true)){
            fc.drawText(this.getDomHelper(), vobj);
        }
    }, this);

    this.enableExcludeCommuterRoute();
};

teasp.Tsf.EkitanSetting.prototype.drawRoute = function(o){
    var expConfig = tsfManager.getEmpExpConfig();
    var fc1 = this.fp.getFcByApiKey('commuterRouteCode');       // 登録定期区間コード
    var fc2 = this.fp.getFcByApiKey('commuterRouteNote');       // 登録定期区間
    var fc3 = this.fp.getFcByApiKey('commuterRouteRoute');      // 登録定期区間経路
    var fc4 = this.fp.getFcByApiKey('commuterRouteTransfer');   // 経由駅で乗り換え
    var obj = {
        commuterRouteCode   : expConfig.commuterRouteCode,
        commuterRouteNote   : expConfig.commuterRouteNote,
        commuterRouteRoute  : expConfig.commuterRouteRoute,
        commuterRouteTransfer: expConfig.commuterRouteTransfer
    };
    fc1.drawText(this.getDomHelper(), obj);
    fc2.drawText(this.getDomHelper(), obj);
    fc3.drawText(this.getDomHelper(), obj);
    fc4.drawText(this.getDomHelper(), obj);

    this.showCommuterRouteWarn(obj);

    if(o && o.excludeCommuterRoute){
        var fc = this.fp.getFcByApiKey('excludeCommuterRoute');    // 定期区間の取扱
        fc.drawText(this.getDomHelper(), o);
    }
};

/**
 * 定期区間コードなし（＝サポート外）かどうかを判別、サポート外なら
 * 警告メッセージを表示する。
 *
 * @param {Object} obj commuterRouteCode, commuterRouteNote, excludeCommuterRoute 要素のあるオブジェクト
 * @returns {Boolean} true:=サポート外
 */
teasp.Tsf.EkitanSetting.prototype.showCommuterRouteWarn = function(obj){
    var flag = 0;
    if(!obj.commuterRouteCode){ // 定期区間コードなし
    	if(obj.commuterRouteNote  // 定期区間設定値あり
        && ![teasp.message.getLabel('tf10000340'),teasp.message.getLabel('tm10003580')].contains(obj.commuterRouteNote)){ // 定期区間文字列が"（停止）"or"（未登録）"でない
            flag = 2; // サポート外の区間
        }else{
        	flag = 1; // 停止
        }
    }
    teasp.Tsf.Dom.show('.commuter-route-warn', this.getFormEl(), (flag == 2)); // 警告の表示切替
    // 停止以外は、「経路」を表示
    var el = this.fp.getElementByApiKey('commuterRouteRoute', null, this.getFormEl());
    if(el){
        var row = teasp.Tsf.Dom.getAncestorByCssName(el, 'ts-form-row');
        teasp.Tsf.Dom.show(row, null, (flag != 1));
    }
    return (flag == 2);
};

/**
 * 定期区間の取扱の活性/非活性
 * 定期区間ロック＝オンなら非活性にする
 *
 */
teasp.Tsf.EkitanSetting.prototype.enableExcludeCommuterRoute = function(){
    var lock = tsfManager.getTargetEmp().isCommuterRouteLock();
    var n = this.fp.getElementByApiKey('excludeCommuterRoute', null, this.getFormEl());
    if(n){
        var row = teasp.Tsf.Dom.getAncestorByCssName(n, 'ts-form-row');
        if(row){
            teasp.Tsf.Dom.query('input', row).forEach(function(el){
                el.disabled = lock;
            });
        }
    }
};

teasp.Tsf.EkitanSetting.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.EkitanSetting.prototype.getFormEl = function(){
    return teasp.Tsf.Dom.node('.ts-section-form', teasp.Tsf.Dom.byId(this.dialog.id));
};

teasp.Tsf.EkitanSetting.prototype.getValueByApiKey = function(apiKey, obj, defaultValue){
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

teasp.Tsf.EkitanSetting.prototype.hide = function(){
    if(this.dialog){
        this.dialog.hide();
        this.domHelper.free();
        this.dialog.destroy();
        tsfManager.removeDialog('EkitanSetting');
    }
};

teasp.Tsf.EkitanSetting.prototype.getContent = function(){
    var areaEl = this.getDomHelper().create('div', { className: 'ts-dialog ts-ekitan-setting', style: 'width:560px;' });
    this.getDomHelper().create('div', null
            , this.getDomHelper().create('div', { className: 'ts-error-area', style: 'width:560px;display:none;' }, areaEl));

    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form' }, areaEl);
    var row = null;
    this.fp.fcLoop(function(fc){
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, formEl);
        }else{
            row = this.getDomHelper().create('div', { className: 'ts-form-row' }, formEl);
            // ラベル部作成
            var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
            this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
            // 入力欄作成
            fc.appendFieldDiv(this.getDomHelper(), row);
            if(fc.getApiKey() == 'commuterRouteNote'){
                if(!tsfManager.getTargetEmp().isCommuterRouteLock()){
                    if(!this.fp.isReadOnly()){
                        var change = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('change_btn_title'), 'ts-button-thin', row); // 変更
                        this.getDomHelper().connect(change, 'onclick', this, this.commuterSearch);
                    }
                    var history = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('history_head'), 'ts-button-thin', row); // 履歴
                    this.getDomHelper().connect(history, 'onclick', this, this.commuterHistory);
                }
                // 定期区間がサポート外の場合のメッセージ
                this.getDomHelper().create('div', {
                    innerHTML: teasp.message.getLabel('tk10005050'), // ※ この区間にかかる定期運賃を差し引いた運賃の計算はサポート対象外となります。ご了承ください。
                    style    : { 'float': 'right', fontSize: '0.9em', color: 'red', display: 'none' },
                    className: 'commuter-route-warn'
                }, row);
            }
        }
    }, this);

    this.createButtons(areaEl);

    return areaEl;
};

teasp.Tsf.EkitanSetting.prototype.createButtons = function(areaEl){
    var area = this.getDomHelper().create('div', { className: 'ts-dialog-buttons' }, areaEl);
    var div  = this.getDomHelper().create('div', null, area);
    if(this.fp.isReadOnly()){
        var canbtn = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('close_btn_title') , 'ts-dialog-cancel', div); // 閉じる
        this.getDomHelper().connect(canbtn, 'onclick', this, this.hide);
    }else{
        var okbtn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('save_btn_title')  , 'ts-dialog-ok'    , div); // 登録
        var canbtn = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('cancel_btn_title'), 'ts-dialog-cancel', div); // キャンセル
        this.getDomHelper().connect(okbtn , 'onclick', this, this.ok);
        this.getDomHelper().connect(canbtn, 'onclick', this, this.hide);
    }
};

teasp.Tsf.EkitanSetting.prototype.commuterSearch = function(){
    var fc1 = this.fp.getFcByApiKey('commuterRouteCode');       // 登録定期区間コード
    var fc2 = this.fp.getFcByApiKey('commuterRouteNote');       // 登録定期区間
    var fc3 = this.fp.getFcByApiKey('commuterRouteRoute');      // 登録定期区間経路
    var fc4 = this.fp.getFcByApiKey('excludeCommuterRoute');    // 定期区間の取扱
    var fc5 = this.fp.getFcByApiKey('commuterRouteTransfer');   // 経由駅で乗り換え

    var o = {
        empId                : tsfManager.getEmpId(),    // 社員ID
        routeCode            : fc1.fetchValue().value,   // 経路コード
        routeDescription     : fc2.fetchValue().value,   // 経路表示
        route                : fc3.fetchValue().value,   // 経路
        excludeCommuterRoute : fc4.fetchValue().value,   // 定期区間の取扱
        transfer             : fc5.fetchValue().value,   // 経由駅で乗り換え
        purpose              : 1                         // 種別（1:変更または新規、2:停止）
    };
    if(!o.routeCode){
        o.routeDescription = null;
        o.route = null;
    }

    var commuterPasses = tsfManager.getTargetEmp().getCommuterPasses();
    if(commuterPasses.length > 0){
        var pw = teasp.Tsf.CommuterPass.getWaitApply(commuterPasses);
        if(pw){ // 承認待ちの申請がある間は変更できない
            this.showHistory({
                message: teasp.message.getLabel('tf10000390', teasp.constant.getDisplayStatus(pw.getStatus())) // 前回の定期区間変更が{0}の状態です。<br/>（前回の申請内容を変更する場合は、申請を取り消してください）
            });
            return;
        }
        // 有効な申請のすぐ後にある無効な（取り消し、却下された）申請を探す。
        // その内容を申請画面の初期値とする。
        var p = teasp.Tsf.CommuterPass.getReuseApply(commuterPasses);
        if(p){
            o.routeDescription  = p.getRouteDescription();
            o.routeCode         = p.getRouteCode();
            o.route             = p.getRoute();
            o.purpose           = (p.getRouteCode() ? 1 : 0);
            o.note              = p.getNote();
            o.status            = p.getStatus();
            o.startDate         = p.getStartDate();
            o.passFare          = p.getPassFare();
            o.passPeriod        = p.getPassPeriod();
            o.id                = p.getId();
            o.transfer          = p.getTransfer();
            if(!o.routeCode){
                o.routeDescription = null; // 定期申請画面では"(未登録)"とか"(停止)"は表示しないようにする。
            }
        }
    }
    // 申請画面を表示
    tsfManager.showDialog('ApplyCommuterPass', {
        values : o,
        config : this.getEkitanConfig()
    }, teasp.Tsf.Dom.hitch(this, function(res){
        this.drawRoute(res);
    }));
};

teasp.Tsf.EkitanSetting.prototype.showHistory = function(option){
    var o = {
        passChanged : teasp.Tsf.Dom.hitch(this, function(){
            this.drawRoute();
        })
    };
    var passList = new teasp.Tsf.CommuterPassList();
    passList.init(teasp.Tsf.formParams.commuterPassList);
    passList.show(teasp.Tsf.util.mixin(o, option));
};

teasp.Tsf.EkitanSetting.prototype.commuterHistory = function(){
    this.showHistory();
};

teasp.Tsf.EkitanSetting.prototype.showError = function(result){
    var er = teasp.Tsf.Dom.node('.ts-error-area', teasp.Tsf.Dom.byId(this.dialog.id));
    teasp.Tsf.Error.showError(result, er);
};

/**
 * 駅探設定を返す
 * @param {boolean} flag trueなら定期区間の取り扱い、定期区間、定期区間コードも含める
 * @returns {Object}
 */
teasp.Tsf.EkitanSetting.prototype.getEkitanConfig = function(){
    var vobj = {};
    this.fp.fcLoop(function(fc){
        if(fc.isApiField(true)){
            fc.fillValue(vobj, fc.fetchValue());
        }
    }, this);

    return {
        ekitanArea           : parseInt(vobj.ekitanArea      , 10),  // 地域
        preferredAirLine     : parseInt(vobj.preferredAirLine, 10),  // 優先する航空会社
        routePreference      : parseInt(vobj.routePreference , 10),  // 検索結果のソート
        usePaidExpress       : (vobj.usePaidExpress   == '1'),       // 特急/新幹線
        useReservedSheet     : (vobj.useReservedSheet == '1'),       // 特急料金
        excludeCommuterRoute : (vobj.excludeCommuterRoute == '1')
    };
};

teasp.Tsf.EkitanSetting.prototype.ok = function(e){
    var newc   = this.getEkitanConfig();
    var config = tsfManager.getTargetEmp().getExpConfig();
    config.ekitanArea           = newc.ekitanArea;
    config.preferredAirLine     = newc.preferredAirLine;
    config.routePreference      = newc.routePreference;
    config.usePaidExpress       = newc.usePaidExpress;
    config.useReservedSheet     = newc.useReservedSheet;
    config.excludeCommuterRoute = newc.excludeCommuterRoute;
    // 定期区間履歴にレコードがある場合は、定期区間に関する要素は削除する（#6573）
    var passHist = tsfManager.getTargetEmp().getCommuterPasses().length;
    if(passHist){
        delete config.commuterRouteCode;
        delete config.commuterRouteNote;
        delete config.commuterRouteRoute;
    }
    console.log(config);
    tsfManager.setExpConfig(config, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            this.hide();
        }else{
            this.showError(result);
        }
    }));
};
