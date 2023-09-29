/**
 * 明細移動先選択ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ExpApplyList = function(){
};

teasp.Tsf.ExpApplyList.prototype = new teasp.Tsf.SearchList();

teasp.Tsf.ExpApplyList.prototype.showDataEnd = function(){
    // 移動元の申請書の ID==null の場合は、「未申請明細へ移動」選択UIを非表示にする
    if(!this.orgData.sourceId){
        teasp.Tsf.Dom.show('table.ts-moveto-null', this.getArea(), false);
    }else{
        teasp.Tsf.Dom.style(teasp.Tsf.Dom.node('div.ts-dialog-buttons', this.getArea()), 'margin-top', '6px');
    }
    teasp.Tsf.SearchList.prototype.showDataEnd.call(this);
};

/**
 * ボタンエリア作成
 * @param {Object} areaEl
 */
teasp.Tsf.ExpApplyList.prototype.createButtons = function(areaEl){
    this.createMoveToNull(areaEl);

    var area = this.getDomHelper().create('div', { className: 'ts-dialog-buttons' }, areaEl);

    // 移動後に移動先を開くオプション
    var div  = this.getDomHelper().create('div', { className: 'ts-edge-left' }, area);
    var label  = this.getDomHelper().create('label', null, div);
    this.getDomHelper().create('input', { type: 'checkbox' }, label);
    this.getDomHelper().create('span', { innerHTML: ' ' + teasp.message.getLabel('tf10006340') }, label); // 移動後、移動先の申請書を開く

    // ボタンの配置
    div  = this.getDomHelper().create('div', null, area);
    var b1  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('tf10006320'), 'ts-dialog-ok', div); // 移動する
    this.getDomHelper().connect(b1 , 'onclick', this, teasp.Tsf.Dom.hitch(this, this.move));
    var b2 = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('cancel_btn_title'), 'ts-dialog-cancel', div); // キャンセル
    this.getDomHelper().connect(b2, 'onclick', this, this.hide);
};

/**
 * 「未申請明細へ移動する」選択UI作成
 * @param {Object} areaEl
 */
teasp.Tsf.ExpApplyList.prototype.createMoveToNull = function(areaEl){
    var noap = this.getDomHelper().create('div', null, areaEl);
    var td = this.getDomHelper().create('td', null
                , this.getDomHelper().create('tr', null
                    , this.getDomHelper().create('tbody', null
                        , this.getDomHelper().create('table', { className: 'ts-moveto-null' }, noap))));
    var label  = this.getDomHelper().create('label', null, td);
    this.getDomHelper().create('input', { type: 'radio', name: this.fp.getDiscernment() }, label);
    this.getDomHelper().create('span', { innerHTML: ' ' + teasp.message.getLabel('tf10006360') }, label); // 未申請明細へ移動する
};

teasp.Tsf.ExpApplyList.prototype.dataProcessing = function(){
    if(!this.records){
        return;
    }
    // 件数を数え直す
    dojo.forEach(this.records, function(record){
        var lst = (record.EmpExp__r || []);
        record.Count__c = lst.length;
    }, this);
};

/**
 * 移動実行
 *
 */
teasp.Tsf.ExpApplyList.prototype.move = function(){
    // 移動先の申請IDを得る
    var req = {
        method  : 'moveDetails',
        dstId   : undefined,
        details : [],
        expenseType : null
    };
    var lst = this.collectData();
    if(lst.length > 0){
        req.dstId = lst[0].Id;
    }else if(this.orgData.sourceId && teasp.Tsf.Dom.node('table.ts-moveto-null input[type="radio"]', this.getArea()).checked){
        req.dstId = null;
        req.expenseType = this.orgData.expenseType;
    }
    if(req.dstId === undefined){
        this.showError(teasp.message.getLabel('tf10006370')); // 移動先を選択してください
        return;
    }
    // 移動対象の明細
    dojo.forEach(this.orgData.values, function(o){
        req.details.push(o.Id);
    });
    // 移動後に開く申請
    var afterId = teasp.Tsf.Dom.node('.ts-edge-left input[type="checkbox"]', this.getArea()).checked ? req.dstId : this.orgData.sourceId;
    // 移動実行
    tsfManager.potalAction(req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            if(this.orgData.moveDone){
                this.orgData.moveDone(afterId);
            }
            this.hide();
        }else{
            this.showError(result);
        }
    }));
};
