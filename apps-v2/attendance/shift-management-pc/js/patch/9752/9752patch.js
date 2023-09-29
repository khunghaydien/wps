if(typeof(teasp) == 'object' && !teasp.resolved['DISCO'] && teasp.Tsf && teasp.Tsf.InfoExpPay){
// 経費精算の消込画面で承認日と精算日による検索を行えるようにする
// 対象支払種別：本人立替
teasp.Tsf.InfoExpPay.prototype.init = function(res){
    teasp.Tsf.InfoBase.prototype.init.call(this, res);
    // 検索項目の拡張（支払種別毎の検索項目セットの最後行に追加）
    teasp.Tsf.formParams.searchExpPay1.fields.push({label:'承認日',msgId:'tk10000739'   ,apiKey:'ApproveTime__c',domType:'dateRange',width:108,domId:'SearchExpPay1AD',name:'approveDate'});
    teasp.Tsf.formParams.searchExpPay1.fields.push({label:'精算日',msgId:'payDate_label',apiKey:'payDate__c'    ,domType:'dateRange',width:108,domId:'SearchExpPay1PD',name:'payDate'});

for(var i = 0 ; i < teasp.Tsf.formParams.searchExpPay1.fields.length ; i++){
    var f = teasp.Tsf.formParams.searchExpPay1.fields[i];
    if(f.domId == 'SearchExpDeptName'){
        f.optKeys = ["DeptId__r.Name like '%{0}%'"
                    ,"(EmpId__r.DeptId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.ParentId__r.Name like '%{0}%' or EmpId__r.DeptId__r.ParentId__r.ParentId__r.ParentId__r.Name like '%{0}%')"
                    ,"(DeptId__r.Name like '%{0}%' or DeptId__r.ParentId__r.Name like '%{0}%' or DeptId__r.ParentId__r.ParentId__r.Name like '%{0}%' or DeptId__r.ParentId__r.ParentId__r.ParentId__r.Name like '%{0}%' or DeptId__r.ParentId__r.ParentId__r.ParentId__r.ParentId__r.Name like '%{0}%')"
                    ];
        break;
    }
}

    // 一覧の表示項目拡張（最後列に追加）
    teasp.Tsf.formParams.ListExpPay1.fields.push({label:'承認日',msgId:'tk10000739'   ,apiKey:'ApproveTime__c'  ,domType:'date',width:72,sortable:true,domId:'DispExpPay1AD'});
    teasp.Tsf.formParams.ListExpPay1.fields.push({label:'精算日',msgId:'payDate_label',apiKey:'payDate__c'      ,domType:'date',width:72,sortable:true,domId:'DispExpPay1PD'});
};
// 
teasp.Tsf.ListExpPay.prototype.showData = function(){
    if(this.fp.getDiscernment() == 'expPayList1' // 本人立替
    ){
        var freeFilts = this.freeFilts || []; // 任意の検索条件
        for(var i = freeFilts.length - 1 ; i >= 0 ; i--){
            if(!freeFilts[i].filtVal){
                continue;
            }
            if(freeFilts[i].filtVal.indexOf('ApproveTime__c') >= 0){
                var tm = (freeFilts[i].filtVal.indexOf('>=') > 0 ? 'T00:00:00+0900' : 'T23:59:59+0900');
                freeFilts[i].filtVal = freeFilts[i].filtVal.replace(/(\d{4}\-\d{2}\-\d{2}).*/, '$1' + tm);
                console.log(freeFilts[i].filtVal);
            }
        }
    }
    teasp.Tsf.ListBase.prototype.showData.call(this);
};
// 消込画面の検索条件入力ダイアログオープン
teasp.Tsf.ListExpPay.prototype.search = function(){
    var key = 'searchExpPay' + this.listType;
    this.searchDialog = new teasp.Tsf.SearchCondition(teasp.Tsf.formParams[key]);
    //========(差し込み開始)========
    // 消込画面の本人立替の場合、this.mask の値を searchObj に含ませる
    var searchObj = (this.searchObj || {});
    if(this.fp.getDiscernment() == 'expPayList1'){ // 本人立替
        searchObj.mask = this.mask;
    }
    this.searchDialog.show(searchObj, teasp.Tsf.Dom.hitch(this, function(obj){
        this.setFreeFilts(obj.filts);
        this.searchObj = obj;
        this.refresh();
    }));
    //========(差し込み終了)========
};
// 検索条件入力ダイアログ
teasp.Tsf.SearchCondition.prototype.showData = function(obj){
    this.orgData = obj || {};
    var vobj = this.orgData.values || {};
    this.fp.fcLoop(function(fc){
        if(fc.getApiKey()){
            fc.drawText(this.getDomHelper(), vobj);
        }
    }, this);
    //========(差し込み開始)========
    // 消込画面の本人立替の場合、obj.mask==1（精算状況=「精算対象」である） なら「精算日」を非活性にする
    if(this.fp.getFormCss() == 'ts-dialog-search-expPay1' && obj.mask == 1){
        var pd = dojo.byId('SearchExpPay1PD');
        dojo.query('input,button', pd).forEach(function(el){
            dojo.setAttr(el, 'disabled', true);
            if(el.tagName == 'INPUT'){
                el.value = '';
            }
        }, this);
        var els = dojo.query('input.dept-apply', this.dialog.domNode);
        if(els.length){
            this.domHelper.connect(els[0], 'click', this, this.checkedDeptOption);
            this.checkedDeptOption();
        }
    }
    //========(差し込み終了)========
    this.dialog.show();
};
// 差し込みで追加
teasp.Tsf.SearchCondition.prototype.checkedDeptOption = function(){
    var els = dojo.query('input.dept-apply', this.dialog.domNode);
    if(els.length){
        this.showDeptLayerSize(els[0].checked);
    }
};
// 差し込みで追加
teasp.Tsf.SearchCondition.prototype.showDeptLayerSize = function(flag){
    dojo.query('input.dept-layer ~ span', this.dialog.domNode).forEach(function(el){
        el.innerHTML = ' ' + teasp.message.getLabel('tf10010800') + (flag ? '(4階層下まで)' : '(3階層下まで)');
    }, this);

};
// 精算実行ダイアログで全銀データ出力と仕訳データCSV出力の初期値をオンにする
teasp.Tsf.PayOption.prototype.showData = function(obj){
    var formEl = this.getFormEl();
    this.orgData = obj;
    var vobj = this.orgData.values || {};
    vobj.payDate = teasp.util.date.formatDate(teasp.util.date.getToday());

    // 精算費目
    var select = this.fp.getElementByApiKey('expItemId', null, formEl);
    this.loadPayItems(select);
    if(select){
        this.getDomHelper().connect(select, 'onchange', this, this.changedPayItem);
    }

    // 振込元
    select = this.fp.getElementByApiKey('sourceAccountId', null, formEl);
    this.loadZgAccounts(select);

    this.fp.fcLoop(function(fc){
        if(fc.isApiField(true)){
            fc.drawText(this.getDomHelper(), vobj);
        }
    }, this);

    // 備考(精算時)入力欄の表示／非表示
    var fc = this.fp.getFcByApiKey('payMethod');
    var el = fc.getElement(null, formEl);
    if(el){
        // 表示範囲＝「本人立替分」または仕訳データ出力ありの場合のみ、表示
        var row = teasp.Tsf.Dom.getAncestorByCssName(el, 'ts-form-row');
        teasp.Tsf.Dom.show(row, null, (this.orgData.listType == '1' || this.isOutputJournal()));
    }

    // 仕訳データCSV出力の表示／非表示
    fc = this.fp.getFcByApiKey('outputJournal');
    el = fc.getElement(null, formEl);
    if(el){
        var row = teasp.Tsf.Dom.getAncestorByCssName(el, 'ts-form-row');
        var useEntryData = tsfManager.getInfo().getCommon().isUseExpEntryData();
        var entryDataUrl = tsfManager.getInfo().getCommon().getExpEntryDataUrl();
        teasp.Tsf.Dom.show(row, null, (useEntryData && entryDataUrl));
    }
    //========(差し込み開始)========
    // 全銀データ出力をオンにする
    fc = this.fp.getFcByApiKey('zgDataCheck');
    var chk = fc.getElement(null, formEl);
    chk.checked = true;
    // 仕訳データCSV出力をオンにする
    fc = this.fp.getFcByApiKey('outputJournal');
    el = fc.getElement(null, formEl);
    el.checked = true;
    //========(差し込み終了)========

    this.showSourceAccount();
    this.changedPayItem();

    this.dialog.show();
};
}