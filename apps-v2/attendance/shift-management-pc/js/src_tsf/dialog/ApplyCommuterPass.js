/**
 * 定期区間申請ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ApplyCommuterPass = function(){
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.commuterPass);
    this.cache = {};
};

teasp.Tsf.ApplyCommuterPass.prototype.show = function(obj, callback){
    teasp.Tsf.Error.showError();

    this.domHelper = new teasp.Tsf.Dom();
    this.dialog = new dijit.Dialog({
        title       : teasp.message.getLabel('tf10000200'), // 定期区間申請
        className   : 'ts-dialog-commuter-pass'
    });
    this.dialog.attr('content', this.getContent());
    this.dialog.startup();
    this.domHelper.connect(this.dialog, 'onCancel', this, function(){ this.hide(); });
    if(dojo.isIE == 9){
        this.domHelper.connect(this.dialog, 'onKeyDown', this, function(e){ if(e.keyCode===13){ dojo.stopEvent(e); } return false; });
    }

    this.submitApply = callback;
    this.showData(obj);
};

teasp.Tsf.ApplyCommuterPass.prototype.showData = function(obj){
    this.orgData = obj;
    var vobj = this.orgData.values || {};

    this.fp.fcLoop(function(fc){
        if(fc.isApiField(true)){
            fc.drawText(this.getDomHelper(), vobj);
        }
    }, this);

    if(vobj.startDate && vobj.routeCode){
        this.cache[vobj.startDate] = (vobj.routeCode || '*'); // 開始日と経路コードの紐づけを覚えておく。
    }

    this.changePurpose(); // 種別による表示/非表示制御

    this.dialog.show();
};

teasp.Tsf.ApplyCommuterPass.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.ApplyCommuterPass.prototype.getFormEl = function(){
    return teasp.Tsf.Dom.node('.ts-section-form', teasp.Tsf.Dom.byId(this.dialog.id));
};

teasp.Tsf.ApplyCommuterPass.prototype.fetchValueByApiKey = function(apiKey){
    var fc = this.fp.getFcByApiKey(apiKey);
    return fc.fetchValue().value;
};

teasp.Tsf.ApplyCommuterPass.prototype.hide = function(){
    if(this.dialog){
        this.dialog.hide();
        this.domHelper.free();
        this.dialog.destroy();
        tsfManager.removeDialog('ApplyCommuterPass');
    }
};

/**
 * 画面作成
 *
 * @returns {Object}
 */
teasp.Tsf.ApplyCommuterPass.prototype.getContent = function(){
    var areaEl = this.getDomHelper().create('div', { className: 'ts-dialog ts-exp-detail', style: 'width:500px;' });
    this.getDomHelper().create('div', null
            , this.getDomHelper().create('div', { className: 'ts-error-area', style: 'width:500px;display:none;' }, areaEl));

    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form' }, areaEl);
    var row = null;
    this.fp.fcLoop(function(fc){
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, formEl);
        }else{
            var cssName = 'ts-form-row';
            row = this.getDomHelper().create('div', { className: cssName }, formEl);
            // ラベル部作成
            var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
            if(fc.getLw()){
                teasp.Tsf.Dom.style(label, 'width', fc.getLw());
            }
            this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
            // 入力欄作成
            fc.appendFieldDiv(this.getDomHelper(), row);
            if(fc.getApiKey() == 'routeDescription'){ // 定期区間
                var btn1 = this.getDomHelper().create('input', { type: 'button', className: 'pp_base pp_btn_ektsrch' }, row);
                var btn2 = this.getDomHelper().create('input', { type: 'button', className: 'pp_base pp_ico_ekitan'  }, row);
                this.getDomHelper().connect(btn1, 'onclick', this, this.commuterSearch);
                teasp.Tsf.Dom.show(btn2, null, false); // 駅探アイコン
            }
        }
    }, this);

    this.setEventHandler(formEl);

    this.createButtons(areaEl);

    return areaEl;
};

teasp.Tsf.ApplyCommuterPass.prototype.createButtons = function(areaEl){
    var area = this.getDomHelper().create('div', { className: 'ts-dialog-buttons' }, areaEl);
    var div  = this.getDomHelper().create('div', null, area);

    var submitName = teasp.message.getLabel(tsfManager.isCommuterPassWorkflow() ? 'applyx_btn_title' : 'fix_btn_title'); // 承認申請 : 確定

    var okbtn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), submitName  , 'ts-dialog-ok'    , div);
    var canbtn = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('cancel_btn_title'), 'ts-dialog-cancel', div); // キャンセル

    this.getDomHelper().connect(okbtn , 'onclick', this, this.submitApply);
    this.getDomHelper().connect(canbtn, 'onclick', this, this.hide);
};

/**
 * 定期区間検索
 *
 */
teasp.Tsf.ApplyCommuterPass.prototype.commuterSearch = function(){
    var fc1 = this.fp.getFcByApiKey('startDate');
    var fc2 = this.fp.getFcByApiKey('routeDescription');
    var fc3 = this.fp.getFcByApiKey('routeCode');
    var fc4 = this.fp.getFcByApiKey('transfer');
    var date = fc1.fetchValue().value;
    var s    = fc2.fetchValue().value;
    var h    = fc3.fetchValue().value;
    var t    = fc4.fetchValue().value;

    var sd = teasp.util.strToDate(date);
    if(sd.failed != 0){
        this.showError(dojo.replace(sd.tmpl, [teasp.message.getLabel('tf10000180')]));
        return false;
    }
    this.showError();

    var req = {
        readonly        : false,
        fixed           : false,
        stationFromHist : tsfManager.getStationFromHist(),
        stationToHist   : tsfManager.getStationToHist(),
        commuter        : true,
        startName       : null,
        endName         : null,
        stationVia      : null,
        roundTrip       : true,
        commuterCode    : h,
        date            : sd.datef,
        config          : this.orgData.config || null
    };
    if(/^(.+) ⇔ (.+?)(?:(?:［)(.+)(?:経由］))?$/.test(s)){
        req.startName   = RegExp.$1;
        req.endName     = RegExp.$2;
        var via         = RegExp.$3;
        req.stationVia  = [];
        var vias = (via != '' ? via.split(/[,、， 　]+/) : []);
        for(var i = 0 ; i < vias.length ; i++){
            req.stationVia.push({ name: vias[i] });
        }
        if(req.stationVia.length && t){
            req.transfer = true;
        }
    }
    // 駅探検索ダイアログ
    tsfManager.dialogOpen('ExpSearch', req, null, this, function(res) {
        var note = teasp.util.createCommuterSimpleRoute(res.searchKey);
        var obj = {
            routeDescription    : note.name,
            routeCode           : res.route.commuterCode,
            startDate           : res.date,
            passPeriod          : res.period,
            passFare            : res.route.commuterFare,
            route               : (new teasp.helper.EkitanRoute(res.route)).createSimpleText2(),
            transfer            : res.searchKey.transfer || false
        };

        this.cache[obj.startDate] = (obj.routeCode || '*'); // 開始日と経路コードの紐づけを覚えておく。

        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                var fc = this.fp.getFcByApiKey(key);
                fc.drawText(this.getDomHelper(), obj);
            }
        }
    });
};

teasp.Tsf.ApplyCommuterPass.prototype.setEventHandler = function(formEl){
    // 日付選択ボタンクリックのイベントハンドラ作成
    teasp.Tsf.Dom.query('.ts-form-cal', formEl).forEach(function(cal){
        var n = teasp.Tsf.Dom.node('input[type="text"]', cal.parentNode.parentNode);
        if(n){
            tsfManager.eventOpenCalendar(this.getDomHelper(), cal, n, { tagName: n.name, isDisabledDate: function(d){ return false; } });
        }
    }, this);

    // 種別クリック
    var fc = this.fp.getFcByApiKey('purpose');
    var area = fc.getElement(null, formEl);
    this.getDomHelper().connect(teasp.Tsf.Dom.query('input[type="radio"]', area), 'onclick', this, this.changePurpose);

    // テキストエリアの文字数制限（IE8以下）
    teasp.Tsf.Dom.setlimitChars(this.getDomHelper()
        , teasp.Tsf.Dom.query('textarea', formEl)
        , this.fp);
};

/**
 * 種別変更
 *
 * @param {Object} e
 */
teasp.Tsf.ApplyCommuterPass.prototype.changePurpose = function(e){
    var purpose = this.fetchValueByApiKey('purpose');
    dojo.forEach(['route', 'routeDescription'], function(key){
        var fc = this.fp.getFcByApiKey(key);
        var el = fc.getElement(null, this.getFormEl());
        if(el){
            var row = teasp.Tsf.Dom.getAncestorByCssName(el, 'ts-form-row');
            teasp.Tsf.Dom.show(row, null, (purpose == '1'));
        }
    }, this);
};

teasp.Tsf.ApplyCommuterPass.prototype.showError = function(result){
    var er = teasp.Tsf.Dom.node('.ts-error-area', teasp.Tsf.Dom.byId(this.dialog.id));
    teasp.Tsf.Error.showError(result, er);
};

/**
 * 承認申請
 *
 * @param e
 */
teasp.Tsf.ApplyCommuterPass.prototype.submitApply = function(e){
    var vobj = {};
    this.fp.fcLoop(function(fc){
        if(fc.isApiField(true)){
            fc.fillValue(vobj, fc.fetchValue());
        }
    }, this);

    vobj.method = 'submitCommuterPass';
    if(vobj.purpose == '0'){ // 種別が「停止」なら経路コードなどをクリアする
        vobj.routeCode = null;
        vobj.routeDescription = null;
        vobj.route = null;
        vobj.passFare = null;
        vobj.passPeriod = null;
    }else{
        if(!this.cache[vobj.startDate] || this.cache[vobj.startDate] != (vobj.routeCode || '*')){ // 開始日と経路コードが紐づかない
            this.showError(teasp.message.getLabel('tf10000400')); // 日付を変更しているので、定期区間の再検索を行ってください。
            return;
        }
    }

    var sd = teasp.util.strToDate(vobj.startDate);
    if(sd.failed){
        this.showError(dojo.replace(sd.tmpl, [teasp.message.getLabel('tf10000180')])); // 開始日
        return;
    }
    var pass = tsfManager.getTargetEmp().getCommuterPass();
    if(pass && pass.getStartDate() && sd.datef <= pass.getStartDate()){
        var d = teasp.util.date.formatDate(teasp.util.date.addDays(pass.getStartDate(), 1), 'SLA');
        this.showError(teasp.message.getLabel('tf10000410', d)); // 開始日付が無効です（{0}以降の日付を指定してください）。
        return;
    }
    if(!vobj.note && tsfManager.isRequireNote(teasp.constant.APPLY_KEY_COMMUTERPASS)){
        this.showError(teasp.message.getLabel('tm10003820')); // コメントを入力してください
        return;
    }

    // 承認申請実行
    tsfManager.submitCommuterPass(vobj, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            // 成功なら再取得した定期区間履歴リストに入れ替える
            tsfManager.getTargetEmp().setCommuterPasses(result.commuterPasses);
            this.submitApply(vobj); // 元の画面を更新
            this.hide();
        }else{
            this.showError(result);
        }
    }));
};
