/**
 * 経費事前申請の検索ダイアログ
 *
 * @constructor
 */
teasp.Tsf.SearchCondition = function(formParam, mask){
    this.fp = teasp.Tsf.Fp.createFp(formParam);
    this.mask = mask;
};

teasp.Tsf.SearchCondition.prototype.show = function(obj, callback){
    teasp.Tsf.Error.showError();
    if(!this.dialog){
        this.domHelper = new teasp.Tsf.Dom();
        this.dialog = new dijit.Dialog({
            title       : this.fp.getTitle(),
            className   : this.fp.getFormCss()
        });
        this.dialog.attr('content', this.getContent());
        this.dialog.startup();
        this.domHelper.connect(this.dialog, 'onCancel', this, function(){ this.hide(); });
        if(dojo.isIE == 9){
            // Enterキー押下時、イベント伝播させない。これをしないと、IE9 でダイアログ内のテキスト入力欄へEnterキー押下で
            // ダイアログがもう一つ表示されたり、カレンダーが表示されるなど、おかしな動作をする
            this.domHelper.connect(this.dialog, 'onKeyDown', this, function(e){ if(e.keyCode===13){ dojo.stopEvent(e); } return false; });
        }
    }
    this.callback = callback;
    this.showData(obj);
};

teasp.Tsf.SearchCondition.prototype.showData = function(obj){
    this.orgData = obj || {};
    var vobj = this.orgData.values || {};
    this.fp.fcLoop(function(fc){
        if(fc.getApiKey()){
            fc.drawText(this.getDomHelper(), vobj);
        }
    }, this);
    this.dialog.show();
};

teasp.Tsf.SearchCondition.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.SearchCondition.prototype.getFormEl = function(){
    return teasp.Tsf.Dom.node('.ts-section-form', teasp.Tsf.Dom.byId(this.dialog.id));
};

teasp.Tsf.SearchCondition.prototype.hide = function(){
    if(this.dialog){
        this.dialog.hide();
        this.domHelper.free();
        this.dialog.destroy();
    }
};

teasp.Tsf.SearchCondition.prototype.getContent = function(){
    var areaEl = this.getDomHelper().create('div', { className: 'ts-dialog ts-search-expPreApply', style:'min-width:448px;' });
    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form' }, areaEl);
    var pfc = null;
    var row = null;
    this.fp.fcLoop(function(fc){
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, formEl);
        }else{
            if(!pfc || !pfc.isNoNL()){
                row = this.getDomHelper().create('div', { className: 'ts-form-row' }, formEl);
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

    this.setEventHandler(formEl);
    this.createButtons(areaEl);

    return areaEl;
};

teasp.Tsf.SearchCondition.prototype.createButtons = function(areaEl){
    var area = this.getDomHelper().create('div', { className: 'ts-dialog-buttons' }, areaEl);
    var div  = this.getDomHelper().create('div', null, area);
    var okbtn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('ok_btn_title')    , 'ts-dialog-ok'    , div); // ＯＫ
    var canbtn = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('cancel_btn_title'), 'ts-dialog-cancel', div); // キャンセル

    this.getDomHelper().connect(okbtn , 'onclick', this, this.ok);
    this.getDomHelper().connect(canbtn, 'onclick', this, this.hide);
};

teasp.Tsf.SearchCondition.prototype.setEventHandler = function(formEl){
    // 日付選択ボタンクリックのイベントハンドラ作成
    teasp.Tsf.Dom.query('.ts-form-cal', formEl).forEach(function(cal){
        teasp.Tsf.Dom.query('input[type="text"]', cal.parentNode.parentNode).forEach(function(n){
            if(n.name == cal.name){
                tsfManager.eventOpenCalendar(
                    this.getDomHelper(),
                    cal,
                    n,
                    {
                        tagName: n.name,
                        isDisabledDate: function(d){ return false; }
                    }
                );
            }
        }, this);
    }, this);

    // 金額入力欄のイベントハンドラをセット
    teasp.Tsf.Dom.query('.ts-form-currency input', formEl).forEach(function(n){
        teasp.Tsf.Currency.eventInput(this.getDomHelper(), n, teasp.Tsf.Dom.hitch(this, this.changedCurrency));
    }, this);
};

teasp.Tsf.SearchCondition.prototype.changedCurrency = function(e){
};

teasp.Tsf.SearchCondition.prototype.ok = function(e){
    if(this.callback){
        var vobj = {composite:{}};
        var filts = [];
        var childFilts = [];
        filts.push({});     // ダミーを１件入れる（検索ダイアログ経由の検索かどうかの判別用）
        this.fp.fcLoop(function(fc){
            if(fc.getApiKey()){
                var vals = fc.fetchValues();
                fc.fillValue(vobj, vals);
                if(fc.getApiKey() == '_childStatus'){
                    var v = vals[0].value;
                    var o = {
                        filtVal : null,
                        nega    : false,
                        orgVal  : null
                    };
                    if(v){
                        o.orgVal = v;
                        var m = /^(.+)以外$/.exec(v);
                        if(m){
                            v = m[1];
                            o.nega = true;
                        }
                        o.filtVal = "StatusD__c = '" + v + "'";
                    }
                    childFilts.push(o);
                }else if(vals[0].value || (vals.length > 1 && vals[1].value)){
                    fc.setFilts(filts, vals);
                }
                if(fc.isComposite()){ // 複合型の検索条件をセット（部署検索の[申請時の部署で検索],[下位部署も含める]チェックボックスの入力値）
                    vobj.composite[fc.getApiKey()] = vals;
                }
            }
        }, this);
        this.callback({
            hkey        : this.orgData.hkey,
            filts       : filts,
            childFilts  : childFilts,
            values      : vobj
        });
    }
    this.hide();
};
