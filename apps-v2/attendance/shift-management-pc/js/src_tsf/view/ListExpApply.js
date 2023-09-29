/**
 * 経費申請リスト画面
 *
 * @constructor
 */
teasp.Tsf.ListExpApply = function(){
    var p = teasp.Tsf.formParams.ListExpApply;
    if(tsfManager.getInfo().isExtendedExpenseFunction()){
        var filts = p.filts || [];
        for(var i = 0 ; i < filts.length ; i++){
            if(filts[i].value == '精算済み以外'){
                filts[i].value = '仕訳済み以外';
            }
        }
    }
    this.fp = teasp.Tsf.Fp.createFp(p);
    this.searchObj = {
        values: (this.fp.getDefaultFilts() || {})
    };
};

teasp.Tsf.ListExpApply.prototype = new teasp.Tsf.ListBase();

/**
 * テーブル作成
 *
 */
teasp.Tsf.ListExpApply.prototype.createBase = function(){
    this.sectionEmp = new teasp.Tsf.SectionEmp(this);
    var headEmp = this.sectionEmp.createArea();

    var listTop = this.getDomHelper().create('div', { className: 'ts-list-top' });
    var tr = this.getDomHelper().create('tr', null
                , this.getDomHelper().create('tbody', null
                    , this.getDomHelper().create('table', { className: 'ts-list-control' }
                        , this.getDomHelper().create('div', { className: 'ts-form-edge-left' }, listTop))));
    var td = this.getDomHelper().create('td', { className: 'ts-space ts-exp-apply-head' }, tr);
    this.getDomHelper().create('div', { className: 'ts-exp-apply-title', innerHTML: teasp.message.getLabel('tf10006160') }, td); // 経費申請一覧
    this.getDomHelper().create('div', { className: 'ts-list-paging'     }, td);
    var btn = this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('tf10006170') } // 未申請明細へ
                , this.getDomHelper().create('div', { className: 'ts-exp-apply-not' }, td));

    this.getDomHelper().connect(btn, 'onclick', this, function(e){
        tsfManager.changeView();
    });

    tr = this.getDomHelper().create('tr', null
            , this.getDomHelper().create('tbody', null
                , this.getDomHelper().create('table', null
                    , this.getDomHelper().create('div', { className: 'ts-form-edge-right' }, listTop))));
    this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('tf10001460') }  // 検 索
            , this.getDomHelper().create('td', { className: 'ts-search-button' }, tr));

    // 検索ボタンクリック
    var d = teasp.Tsf.Dom.node('.ts-search-button button', tr);
    if(d){
        this.getDomHelper().connect(d, 'onclick', this, function(e){
            this.search();
        });
    }

    var table = teasp.Tsf.ListBase.prototype.createBase.call(this);

    return [headEmp, listTop, table];
};

teasp.Tsf.ListExpApply.prototype.drawData = function(tbody){
    teasp.Tsf.ListBase.prototype.drawData.call(this, tbody);

    if(this.firstEmptyRowKey && !tsfManager.isReadMode() && tsfManager.getSessionEmpId() && tsfManager.isEditable()){
        var el = this.fp.getElementByApiKey('ApplyTime__c', this.firstEmptyRowKey, tbody);
        el.innerHTML = '';
        var btn = this.getDomHelper().create('div', { className: 'png-add' }, el);
        this.getDomHelper().connect(btn, 'onclick', this, function(e){
            tsfManager.changeView(teasp.Tsf.Manager.EXP_APPLY_NEW);
        });
    }
};

teasp.Tsf.ListExpApply.prototype.getTargetEmpId = function(){
    return (tsfManager.isEmpTargetMode() ? tsfManager.getArgEmpId() : null);
};

teasp.Tsf.ListExpApply.prototype.search = function(){
    var fields = teasp.Tsf.formParams.searchExpApply.fields;
    for(var i = 0 ; i < fields.length ; i++){
        var field = fields[i];
        if(field.apiKey == 'StatusD__c'){
            field.pickList = tsfManager.getInfo().getStatusPickList();
            break;
        }
    }
    this.searchDialog = new teasp.Tsf.SearchCondition(teasp.Tsf.formParams.searchExpApply);
    this.searchDialog.show((this.searchObj || {}), teasp.Tsf.Dom.hitch(this, function(obj){
        this.setFreeFilts(obj.filts);
        this.setChildFilts(obj.childFilts);
        this.searchObj = obj;
        this.refresh();
    }));
};
