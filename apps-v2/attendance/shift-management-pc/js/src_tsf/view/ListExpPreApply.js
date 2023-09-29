/**
 * 事前申請リスト画面
 *
 * @constructor
 */
teasp.Tsf.ListExpPreApply = function(){
    var p = teasp.Tsf.formParams.ListExpPreApply;
    if(tsfManager.getInfo().isExtendedExpenseFunction()){
        if(p.filts && p.filts.length > 0 && p.filts[0].value == '精算済み以外'){
            p.filts[0].value = '仕訳済み以外';
        }
        if(p.childFilts && p.childFilts.length > 0 && p.childFilts[0].filtVal == "StatusD__c = '精算済み'"){
            p.childFilts[0].filtVal = "StatusD__c = '仕訳済み'";
        }
    }
    this.fp = teasp.Tsf.Fp.createFp(p);
    this.searchObj = {
        values: (this.fp.getDefaultFilts() || {})
    };
    this.listMode = 1;
};

teasp.Tsf.ListExpPreApply.prototype = new teasp.Tsf.ListBase();

/**
 * テーブル作成
 *
 */
teasp.Tsf.ListExpPreApply.prototype.createBase = function(){
	var headEmp = null;
    if(tsfManager.isEmpTargetMode()){
        this.sectionEmp = new teasp.Tsf.SectionEmp(this);
        headEmp = this.sectionEmp.createArea();
    }

    var listTop = this.getDomHelper().create('div', { className: 'ts-list-top' });
    var tr = this.getDomHelper().create('tr', null
                , this.getDomHelper().create('tbody', null
                    , this.getDomHelper().create('table', null
                        , this.getDomHelper().create('div', { className: 'ts-form-edge-left' }, listTop))));
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006161'), className: 'ts-exp-apply-title' } // 事前申請一覧
            , this.getDomHelper().create('td', { className: 'ts-exp-apply-head', style: 'display:none;' }, tr));
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10001440') } // 表示範囲
            , this.getDomHelper().create('td', { className: 'ts-list-top-label ts-exp-disp-range' }, tr));
    var select = this.getDomHelper().create('select', { className: 'ts-list-top-range' }
                    , this.getDomHelper().create('div', null
                        , this.getDomHelper().create('td', { className: 'ts-list-top-select ts-exp-disp-range' }, tr)));
    this.getDomHelper().create('option', { value:'1', innerHTML:teasp.message.getLabel('tf10001310') }, select); // 自分の申請
    this.getDomHelper().create('option', { value:'2', innerHTML:teasp.message.getLabel('tf10001320') }, select); // 部下の申請
    this.getDomHelper().create('option', { value:'3', innerHTML:teasp.message.getLabel('tf10001330') }, select); // 混在
    this.getDomHelper().create('div', { className: 'ts-list-paging' }, this.getDomHelper().create('td', { className: 'ts-space' }, tr));
    select.value = '' + (this.listMode || 1);

    this.getDomHelper().connect(select, 'onchange', this, this.refresh);

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

    var empModeFlag = tsfManager.isEmpTargetMode();
    teasp.Tsf.Dom.show('td.ts-exp-disp-range', listTop, !empModeFlag); // 引数で empId が指定されているときは、表示範囲を非表示にする
    teasp.Tsf.Dom.show('td.ts-exp-apply-head', listTop,  empModeFlag); // 引数で empId が指定されているときは、「事前申請一覧」を表示

    var table = teasp.Tsf.ListBase.prototype.createBase.call(this);

    var areas = [];
    if(headEmp){
        areas.push(headEmp);
    }
    areas.push(listTop);
    areas.push(table);
    return areas;
};

teasp.Tsf.ListExpPreApply.prototype.getListMode = function(){
    var select = teasp.Tsf.Dom.node('.ts-list-top select.ts-list-top-range', this.getArea());
    return parseInt(select.value, 10);
};

teasp.Tsf.ListExpPreApply.prototype.dataProcessing = function(){
    if(!this.records){
        return;
    }
    dojo.forEach(this.records, function(record){
        var lst = (record.ExpApplications__r || []);
        if(lst.length > 0){
            record._payId     = lst[0].Id;
            record._payStatus = lst[0].StatusD__c;
        }
    }, this);
};

teasp.Tsf.ListExpPreApply.prototype.search = function(){
    var fields = teasp.Tsf.formParams.searchExpPreApply.fields;
    for(var i = 0 ; i < fields.length ; i++){
        var field = fields[i];
        if(field.apiKey == 'StatusD__c'){
            field.pickList = tsfManager.getInfo().getStatusPickList();
        }else if(field.apiKey == '_childStatus'){
            field.pickList = tsfManager.getInfo().getStatusPickList();
        }
    }
    this.searchDialog = new teasp.Tsf.SearchCondition(teasp.Tsf.formParams.searchExpPreApply);
    this.searchDialog.show((this.searchObj || {}), teasp.Tsf.Dom.hitch(this, function(obj){
        this.setFreeFilts(obj.filts);
        this.setChildFilts(obj.childFilts);
        this.searchObj = obj;
        this.refresh();
    }));
};

teasp.Tsf.ListExpPreApply.prototype.refresh = function(){
    this.listMode = this.getListMode();
    teasp.Tsf.ListBase.prototype.refresh.call(this);
};

teasp.Tsf.ListExpPreApply.prototype.drawData = function(tbody){
    teasp.Tsf.ListBase.prototype.drawData.call(this, tbody);

    if(this.firstEmptyRowKey
    && !tsfManager.isReadMode()
    && (tsfManager.isEmpTargetMode() || (tsfManager.getSessionEmpId() && this.listMode == 1))
    && tsfManager.isEditable()
    ){
        var el = this.fp.getElementByApiKey('ApplyTime__c', this.firstEmptyRowKey, tbody);
        el.innerHTML = '';
        var mbtn = this.getDomHelper().create('div', { className: 'png-add' }, el);

        // ポップアップメニュー作成
        var menus = [];
        dojo.forEach(tsfManager.getViewConfig(), function(c){
            menus.push({
                name    : c.name,
                method  : function(e){ tsfManager.changeView(c.view); }
            });
        }, this);
        this.getDomHelper().createMenu([mbtn], menus, this.reskey);
    }
};

teasp.Tsf.ListExpPreApply.prototype.getTargetEmpId = function(){
    return (tsfManager.isEmpTargetMode() ? tsfManager.getArgEmpId() : null);
};
