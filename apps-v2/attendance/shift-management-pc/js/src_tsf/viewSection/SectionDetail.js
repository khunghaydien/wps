/**
 * 経費明細セクション
 *
 * @constructor
 */
teasp.Tsf.SectionDetail = function(parent, subkey){
    this.parent = parent;
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionDetail, subkey);
    this.checkable = false;
    this.lastDate = null;
    this.misMatch = 0;
    this.filter = null;
};

teasp.Tsf.SectionDetail.prototype = new teasp.Tsf.SectionBase();

teasp.Tsf.SectionDetail.prototype.createSectionBar = function(domHelper, title, check){
    var bar = teasp.Tsf.SectionBase.createSectionBar(domHelper, title, check);
    if(this.fp.getSubkey()){
        teasp.Tsf.Dom.style(bar, 'marginTop', '10px');
    }

    var rdiv  = this.getDomHelper().create('div', { className: 'ts-section-option' }, bar);
    var label = this.getDomHelper().create('label', null, rdiv);
    var chk   = this.getDomHelper().create('input', { type: 'checkbox' }, label);
    chk.checked = tsfManager.isDiffView();
    this.getDomHelper().create('span', { innerHTML: ' ' + teasp.message.getLabel('tf10001930') }, label); // 事前申請との差異を表示
    this.getDomHelper().connect(chk, 'onclick', this, function(e){
        tsfManager.setDiffView(chk.checked);
        this.refreshDiffView();
    });
    teasp.Tsf.Dom.show(rdiv, null, false);

    return bar;
};

teasp.Tsf.SectionDetail.prototype.createSectionApron = function(){
    var apron  = this.getDomHelper().create('div', { className: 'ts-form-apron' + this.getAreaCss() });
    var tr = this.getDomHelper().create('tr', null
        , this.getDomHelper().create('tbody', null
            , this.getDomHelper().create('table', { className: 'ts-form-control' }
                , this.getDomHelper().create('div', { className: 'ts-form-edge-left' }, apron))));

    if(this.parent.getFormStyle() == 0){
        // カード明細読込
        this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('tf10001500') }
            , this.getDomHelper().create('td', { className: 'ts-form-cardread ts-std-button' }, tr));
    }

    // 履歴から入力
    this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('tf10003570') }
        , this.getDomHelper().create('td', { className: 'ts-form-histexp ts-std-button' }, tr));

    if(this.parent.getFormStyle() == 0 && tsfManager.isUsingReceiptSystem()){
        // 領収書読込
        this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('tf10004950') }
            , this.getDomHelper().create('td', { className: 'ts-form-receipt ts-std-button' }, tr));
    }

    if(this.parent.getFormStyle() == 0 && tsfManager.isUsingJsNaviSystem()){
        // J'sNAVI実績読込
	    this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('jt13000010') }
	    	, this.getDomHelper().create('td', { className: 'ts-form-jtb ts-std-button' }, tr));
    }

    if(this.parent.getFormStyle() == 0 && tsfManager.isUseConnectICExpense()){
        // IC連携機能の経費登録機能を使用する
	    this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('pit10001010') } // IC交通費読込
	    	, this.getDomHelper().create('td', { className: 'ts-form-pitexp ts-std-button' }, tr));
    }

    if(tsfManager.getInfo().isUseCsvImport(this.parent.getObjBase().getTypeName())
    && !teasp.Tsf.util.isSforceOne()){
        // CSV読込
        this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('ci00000010') } // CSV読込
            , this.getDomHelper().create('td', { className: 'ts-form-csvup ts-std-button' }, tr));
    }

    if(this.parent.getFormStyle() == 0){
        teasp.Tsf.Dom.style(apron, 'width', '100%');
    }
    return apron;
};

teasp.Tsf.SectionDetail.prototype.refresh = function(obj){
    this.misMatch = 0;
    teasp.Tsf.SectionBase.prototype.refresh.call(this, obj);

    // getTbody() の指す DOM の下に 'div.ts-form-apron'がある前提
    var apron = teasp.Tsf.Dom.nextSibling(teasp.Tsf.Dom.getAncestorByTagName(this.getTbody(), 'DIV'));
    if(apron){
        if(this.source){ // この値がある場合は、タイムレポートである
            teasp.Tsf.Dom.show(apron, null, false);
        }else{
            var show = this.isVisible() && !this.parent.isReadOnly();
            teasp.Tsf.Dom.show(apron, null, show);
            if(show && teasp.Tsf.Dom.hasClass(apron, 'ts-main-form')){
                var n = teasp.Tsf.Dom.node('div.ts-section-detail');
                if(n){
                    teasp.Tsf.Dom.style(n, 'margin-bottom', '0px');
                }
            }
        }
    }

    // 経費精算の画面だけ移動ボタンを表示（事前申請とタイムレポートでは非表示）
    if(!this.isPre() && !this.source){
        teasp.Tsf.Dom.show('button.png-ido', this.getFormEl(), true);
    }
};

teasp.Tsf.SectionDetail.prototype.refreshView = function(flag){
    this.refreshDiffView(null, flag);
};

teasp.Tsf.SectionDetail.prototype.refreshDiffView = function(addExps, flag){
    var data = this.getDomValues();
    if(this.source){
        this.source.values = data.values;
        dojo.forEach(this.source.values, function(exp){
            exp._route = new teasp.Tsf.EmpExp(exp);
        });
    }else{
        if(!flag){
            this.parent.getObjBase().obj.EmpExp__r = data.values;
        }
        if(addExps){
            this.parent.getObjBase().obj.EmpExp__r = this.parent.getObjBase().obj.EmpExp__r.concat(addExps);
        }
        this.parent.getObjBase().linkPreApplyAll();
    }
    this.empty(true, true);
    this.refresh(this.source);
};

teasp.Tsf.SectionDetail.prototype.pushInsert = function(e){
    var n = e.target;
    if(n.className.indexOf('ts-content-invoiceURL') >= 0){ return false; } // 請求書URLの場合はダイアログを表示しない
    if(n.tagName == 'A'){
        var tr = teasp.Tsf.Dom.getAncestorByTagName(n, 'TR');
        var hkey = tr ? teasp.Tsf.Fp.getHkey(tr) : null;
        if(hkey){
            this.openDetail(hkey);
        }
    }else if(n.tagName == 'BUTTON'){
        this.openDetail();
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
};

teasp.Tsf.SectionDetail.prototype.clickRow = function(e){
    if(e.target.tagName == 'INPUT' && e.target.type == 'checkbox'){
        return;
    }
    var tr = teasp.Tsf.Dom.getAncestorByCssName(e.target, 'ts-table-row');
    if(tr){
        var chk = teasp.Tsf.Dom.node('div.ts-form-checkbox input[type="checkbox"]', tr);
        if(chk){
            chk.checked = !chk.checked;
        }
    }
};

teasp.Tsf.SectionDetail.prototype.getLastOrderOfSource = function(){
    var lastOrder = 0;
    if(this.source){
        dojo.forEach(this.source.values, function(exp){
            if(lastOrder < exp.Order__c){
                lastOrder = exp.Order__c;
            }
        });
    }
    return lastOrder;
};

teasp.Tsf.SectionDetail.prototype.openDetail = function(hkey){
    // ダイアログを開く
    var assist = (this.source ? this.source.assist : this.parent.getAssist(this.getFilterExpenseType()));
    var obj = {
        hkey            : hkey || teasp.Tsf.Fp.createHkey(),
        ro              : this.isReadOnly(),
        pre             : this.isPre(),
        expItemClass    : this.getObjBase().getEmpExpItemClass(),
        defaultDeptId   : this.getObjBase().getDeptId(true),
        values          : (hkey ? this.getChildValues(hkey, this.getTbody()) : this.getObjBase().createEmpExp(assist)),
        targetDate      : (this.source && this.source.targetDate) || null,
        defaultDate     : this.lastDate,
        nextOrder       : this.getLastOrderOfSource() + 1,
        assist          : assist,
        isShowMisMatch  : this.parent.isShowMisMatch(),
        expenseType     : this.getFilterExpenseType()
    };
    tsfManager.showDialog('ExpDetail', obj, teasp.Tsf.Dom.hitch(this, this.entryDetail));
};

/**
 * 経費明細の行追加
 *
 * @param {string=} _hkey
 */
teasp.Tsf.SectionDetail.prototype.insertRow = function(_hkey){
    var tr = this.insertTableRow(_hkey);
    var hkey = teasp.Tsf.Fp.getHkey(tr);

    // タイムレポートへ遷移するボタンを日付フィールド左に挿入
    if(this.parent.injectTimeReportLink && !tsfManager.isDisabledTimeReport()){
        this.parent.injectTimeReportLink(tr);
    }

    var removed = this.getValueByApiKey('_removed', hkey);

    if(!this.isReadOnly() && !removed){
        teasp.Tsf.Dom.style(tr, 'cursor', 'pointer');
    }
    // 行をクリック
    this.getDomHelper().connect(tr, 'onclick', this, this.clickRow, hkey);

    // 行内のリンクをクリック
    this.getDomHelper().connect(teasp.Tsf.Dom.query('a', tr), 'onclick', this, this.pushInsert, hkey);

    // 整合チェックの結果を表示
    this.misMatch |= this.checkExpMatching(tr, this.getChildValues(hkey, this.getTbody()));

    return tr;
};

teasp.Tsf.SectionDetail.prototype.insertTableRowEx = function(tr, hkey){
    return tr;
};

teasp.Tsf.SectionDetail.prototype.entryDetail = function(obj){
    if(this.source){
        tsfManager.showFormT(obj.empExps, obj.targetDate);
    }else{
        var hkey = obj.hkey;

        this.getDomHelper().freeBy(hkey); // イベントハンドラを設定し直すので、解放

        var tr = teasp.Tsf.Fp.getRowByHkey(this.getTbody(), hkey);
        var newTr = !tr;
        if(newTr){
            tr = this.insertRow(hkey);
        }else{
            this.getDomHelper().connect(tr, 'onclick', this, this.clickRow, hkey); // 行をクリック
        }
        var dataObj = this.objMap[hkey] = obj.values;
        dataObj._route = new teasp.Tsf.EmpExp(dataObj, this.isPre());
        this.fp.fcLoop(function(fc){
            fc.drawText(this.getDomHelper(), dataObj, hkey);
        }, this);

        // 行をクリック
        this.getDomHelper().connect(teasp.Tsf.Dom.query('a', tr), 'onclick', this, this.pushInsert, hkey);

        // 表示を更新
        this.refreshDiffView();

        // 金額を更新
        this.changedCurrency();
    }
};

teasp.Tsf.SectionDetail.prototype.createArea = function(){
    return this.createTableArea(true);
};

teasp.Tsf.SectionDetail.prototype.isPre = function(){
    return !(tsfManager.getTarget() == teasp.Tsf.Manager.EXP_APPLY);
};

teasp.Tsf.SectionDetail.prototype.getAreaCss = function(){
    if(!this.isPre()){
        return '';
    }else{
        return teasp.Tsf.SectionBase.prototype.getAreaCss.call(this);
    }
};

teasp.Tsf.SectionDetail.prototype.getDomValues = function(flag){
    var data = teasp.Tsf.SectionBase.prototype.getDomValues.call(this, flag);

    var mp = {};
    var ld = null;  
    dojo.forEach(data.values, function(v){
        v.CurrencyRate__c  = teasp.Tsf.util.getNumStr(v.CurrencyRate__c);
        v.ForeignAmount__c = teasp.Tsf.util.getNumStr(v.ForeignAmount__c);
        v.Tax__c           = teasp.Tsf.util.getNumStr(v.Tax__c);
        v.WithoutTax__c    = teasp.Tsf.util.getNumStr(v.WithoutTax__c);
        v.UnitPrice__c     = teasp.Tsf.util.getNumStr(v.UnitPrice__c);
        v.Cost__c          = teasp.Tsf.util.getNumStr(v.Cost__c);
        v.TaxType__c       = teasp.Tsf.util.getNumStr(v.TaxType__c);
        var d = teasp.util.date.formatDate(v.Date__c);
        if(d){
            var l = mp[d];
            if(!l){
                l = mp[d] = [];
            }
            l.push(v);
            v.Order__c = l.length;
            if(!ld || ld < d){
                ld = d;
            }
        }
    }, this);
    this.lastDate = ld;
    return data;
};

/**
 * 全削除
 *
 * @param {boolean=} viewOnly true ならデータを残して画面だけクリアする
 * @param {boolean=} calcOnly true ならデータ更新ではない
 */
teasp.Tsf.SectionDetail.prototype.empty = function(viewOnly, calcOnly){
    teasp.Tsf.SectionBase.prototype.empty.call(this, viewOnly, calcOnly);
    // 金額を更新
    this.changedCurrency();
};

teasp.Tsf.SectionDetail.prototype.setAttachmentExist = function(expLogId, flag){
    var tbody = this.getTbody();
    if(tbody){
        for(var i = 0 ; i < tbody.rows.length ; i++){
            var tr = tbody.rows[i];
            var hkey = teasp.Tsf.Fp.getHkey(tr);
            var id = this.getValueByApiKey('Id', hkey);
            if(id == expLogId){
                teasp.Tsf.EmpExp.setAttachmentExist2(this.getDomHelper(), tr, this.objMap[hkey], flag);
                break;
            }
        }
    }
};

teasp.Tsf.SectionDetail.prototype.deleteRows = function(indexes){
    if(this.source){
        teasp.tsConfirm(teasp.message.getLabel('tm20004550', indexes.length),this,function(result){// {0}件のデータを削除します。よろしいですか？
            if(result){
                var idset = [];
                var tbody = this.getTbody();
                for(var i = indexes.length - 1 ; i >= 0 ; i--){
                    var x = indexes[i];
                    var tr = tbody.rows[x];
                    var hkey = teasp.Tsf.Fp.getHkey(tr);
                    var id = this.getValueByApiKey('Id', hkey);
                    idset.push(id);
                }
                var obj = {
                    EmpId__c    : tsfManager.getEmpId(),
                    date        : this.source.targetDate,
                    idset       : idset
                };
                tsfManager.deleteEmpExp(obj, teasp.Tsf.Dom.hitch(this, function(succeed, result){
                    if(succeed){
                        tsfManager.showFormT(result.empExps, result.targetDate);
                        // 金額を更新
                        this.changedCurrency();
                    }else{
                        teasp.Tsf.Error.showError(result);
                    }
                }));
            }
        });
    }else{
        teasp.Tsf.SectionBase.prototype.deleteRows.call(this, indexes, false);
    }
};

teasp.Tsf.SectionDetail.prototype.saveOrder = function(e){
    var obj = this.getDomValues();
    var data = {
        EmpId__c            : tsfManager.getEmpId(),
        ExpApplyId__c       : null,
        ExpPreApplyId__c    : null,
        date                : (this.source && this.source.targetDate) || null,
        exps                : obj.values
    };

    tsfManager.saveEmpExp(data, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            this.refreshDiffView();
        }else{
            teasp.Tsf.Error.showError(result);
        }
    }));
};

teasp.Tsf.SectionDetail.prototype.setRowBgColor = function(){
    teasp.Tsf.SectionBase.prototype.setRowBgColor.call(this);
    if(this.source){
        var origins = [];
        var values = this.source.values || [];
        for(var i = 0 ; i < values.length ; i++){
            origins.push(values[i].Id);
        }
        var currents = [];
        var tbody = this.getTbody();
        for(var i = 0 ; i < tbody.rows.length ; i++){
            var tr = tbody.rows[i];
            var hkey = teasp.Tsf.Fp.getHkey(tr);
            currents.push(this.getValueByApiKey('Id', hkey));
        }
        var orderChanged = (origins.join(':') != currents.join(':'));
        teasp.Tsf.Dom.show('button.ts-save-order', null, orderChanged);
    }
};

teasp.Tsf.SectionDetail.prototype.selectHistory = function(){
    var fp = teasp.Tsf.formParams.expHistory;
    var expItemIds = [];
    // 検索条件の種別の選択リストをセット
    var fs = fp.searchFields || [];
    for(var i = 0 ; i < fs.length ; i++){
        if(fs[i].apiKey == 'ExpItemId__c'){
            var assist = this.parent.getAssist(this.getFilterExpenseType());
            var expItemFilter = {
                empExpItemClass  : tsfManager.getTargetEmp().getExpItemClass(),
                deptExpItemClass : (assist && assist.ChargeDeptId__r && assist.ChargeDeptId__r.ExpItemClass__c) || null,
                expenseType      : (assist && assist.ExpenseType__c) || null
            };
            var expItems = tsfManager.getExpItems(expItemFilter, true);
            fs[i].pickList = [{ n:teasp.message.getLabel('tk10004480'), v:'' }]; // (すべて)
            dojo.forEach(expItems, function(expItem){
                fs[i].pickList.push({ n:expItem.getName(), v:expItem.getId() });
                expItemIds.push("'" + expItem.getId() + "'");
            });
        }
    }
    if(!expItemIds.length){
        teasp.tsAlert(teasp.message.getLabel('tf10006780'));// 選択可能な費目がありません
        return;
    }
    var k = (this.isPre() ? "!=null" : "=null");
    tsfManager.showSearchListDialog({ discernment: 'expHistory', values: { ExpPreApplyId__c: k } }, {
        histImport : teasp.Tsf.Dom.hitch(this, this.openHistImport),
        filts      : [
            { filtVal: 'ExpPreApplyId__c' + k },
            { filtVal: "ExpItemId__c in (" + expItemIds.join(',') + ")" }
        ]
    });
};

/**
 * 経費履歴から読み込み
 *
 * @param {Object} data
 * @param {Function} cbHide
 * @param {Function} cbError
 */
teasp.Tsf.SectionDetail.prototype.openHistImport = function(data, cbHide, cbError){
    if(data.records.length <= 0){
        cbError(teasp.message.getLabel('tf10001760')); // 読み込み対象を選択してください
        return;
    }

    // ダイアログを開く
    var values = this.getObjBase().createEmpExpFromExp(data.records[0]);
    
    // 事前申請の場合は発行者(店名)を除外
    if(this.isPre()) {
        delete values['Publisher__c']
    }
    var obj = {
        hkey            : teasp.Tsf.Fp.createHkey(),
        ro              : this.isReadOnly(),
        pre             : this.isPre(),
        expItemClass    : this.getObjBase().getEmpExpItemClass(),
        defaultDeptId   : this.getObjBase().getDeptId(true),
        values          : values,
        fromHist        : true,
        targetDate      : null,
        nextOrder       : 1,
        assist          : this.parent.getAssist(this.getFilterExpenseType()),
        parentHide      : cbHide,
        isShowMisMatch  : this.parent.isShowMisMatch(),
        expenseType     : this.getFilterExpenseType()
    };
    tsfManager.showDialog('ExpDetail', obj, teasp.Tsf.Dom.hitch(this, this.entryDetail));
};

/**
 * 明細の移動の準備
 */
teasp.Tsf.SectionDetail.prototype.moveCheck = function(indexes){

	// 出張手配の明細が含まれた場合、エラーにする
	var tbody = this.getTbody();
    for(var i = 0 ; i < indexes.length ; i++){
        var x = indexes[i];

        var expApply = this.getChildValues(teasp.Tsf.Fp.getHkey(tbody.rows[x]));

		//出張手配か確認する
		if (expApply.Item__c == 'JTB'){
			teasp.tsAlert(teasp.message.getLabel('tf10008130')); // 出張手配を含む場合、移動はできません。
            return;
		}
    }


    // 編集中なら保存する
    if(tsfManager.checkDiff()){
        teasp.tsConfirm(teasp.message.getLabel('tf10006350'),this,function(result){// 明細を移動する前に編集内容を保存してよろしいですか？ 
            if(result){
                tsfManager.saveExpApply(true, teasp.Tsf.Dom.hitch(this, function(succeed, result){
                    if(succeed){
                        tsfManager.changeView(null, result.id,  // ※ result には Id がセットされている。
                            teasp.Tsf.Dom.hitch(this, function(){
                                tsfManager.restoreCheck(result.exps);
                                tsfManager.moveStart();
                            })
                        );
                    }else{
                        teasp.Tsf.Error.showError(result);
                    }
                }));
            }   
        }); 
    }else{
        this.moveLine(indexes);
    }
};

/**
 * 明細の移動先を選択
 */
teasp.Tsf.SectionDetail.prototype.moveLine = function(indexes){
    // 移動する明細の情報を取得
    var lines = [];
    var tbody = this.getTbody();
    for(var i = 0 ; i < indexes.length ; i++){
        var x = indexes[i];
        lines.push(this.getChildValues(teasp.Tsf.Fp.getHkey(tbody.rows[x]), tbody));
    }
    if(!lines.length){ // ここにくる時点で該当することはない（保険）
        return;
    }
    // 移動先の選択候補の検索条件
    var srcApplyId = this.getObjBase().getId(); // 移動元の申請ID
    var opt = {
        filts : [
            { filtVal: teasp.Tsf.util.formatString("EmpId__c = '{0}'", tsfManager.getEmpId()) },
            { filtVal: "StatusD__c in ('未申請','却下','申請取消','確定取消')" }
        ]
    };
    if(srcApplyId){
        opt.filts.push({ filtVal: teasp.Tsf.util.formatString("Id != '{0}'", srcApplyId)  });
    }
    var expenseType = null;
    if(this.parent.isUseExpFilter()){ // 精算区分の絞り込みを使用する
        var assist = this.parent.getAssist(this.getFilterExpenseType());
        expenseType = (assist && assist.ExpenseType__c) || null;
    }
    // 選択用ダイアログを表示
    tsfManager.showSearchListDialog({
        discernment : 'expApplyList',
        values      : lines,
        dialog      : 'ExpApplyList',
        title       : teasp.message.getLabel('tf10006330'), // 明細の移動先を選択してください
        sourceId    : srcApplyId,
        moveDone    : teasp.Tsf.Dom.hitch(this, function(tgtId){
            tsfManager.changeView(null, tgtId);
        }),
        expenseType : expenseType
    }, opt);
};

/**
 * 引数の情報で明細行を選択状態にする
 *
 * @params {Array.<Object>} exps
 */
teasp.Tsf.SectionDetail.prototype.restoreCheck = function(exps){
    var map = {};
    dojo.forEach(exps || [], function(exp){
        map[exp.Id] = exp.checked;
    });
    var tbody = this.getTbody();
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var tr = tbody.rows[i];
        var hkey = teasp.Tsf.Fp.getHkey(tr);
        var id = this.getValueByApiKey('Id', hkey);
        if(map[id]){
            var chk = teasp.Tsf.Dom.node('div.ts-form-checkbox input[type="checkbox"]', tr);
            if(chk){
                chk.checked = true;
            }
        }
    }
};

/**
 * 不整合を探す
 * @param {Object} vobj
 * @returns {number}
 */
teasp.Tsf.SectionDetail.prototype.getExpMatching = function(vobj){
    var assist = (this.source ? this.source.assist : this.parent.getAssist(this.getFilterExpenseType()));
    var flag = 0;
    var extra1Name = null, extra2Name = null;
    var expItem = tsfManager.getExpItemById(vobj.ExpItemId__c); // 費目
    if(expItem){
        var expItemFilter = {
            empExpItemClass  : tsfManager.getTargetEmp().getExpItemClass(),
            deptExpItemClass : (vobj.ChargeDeptId__r && vobj.ChargeDeptId__r.ExpItemClass__c) || (assist && assist.ChargeDeptId__r && assist.ChargeDeptId__r.ExpItemClass__c) || null,
            expenseType      : (assist && assist.ExpenseType__c) || null
        };
        if(!expItem.checkExpenseType(expItemFilter.expenseType)){
            flag = teasp.Tsf.EmpExp.MISMATCH_EXPENSE_TYPE;
        }
        if(!expItem.isSelectable(expItemFilter.empExpItemClass)
        && !expItem.isSelectable(expItemFilter.deptExpItemClass)){
            flag |= teasp.Tsf.EmpExp.MISMATCH_EXPITEM_CLASS;
        }
        var payTypeNums = tsfManager.getPayeeTypeNums(expItemFilter.expenseType);
        var payeeType = (vobj.PayeeId__r ? (vobj.PayeeId__r.PayeeType__c   || null) : null);
        var payeeEt   = (vobj.PayeeId__r ? (vobj.PayeeId__r.ExpenseType__c || null) : null);
        if(!payTypeNums[payeeType || 1] && (expItemFilter.expenseType || (payeeType || 1) != 1)){
            flag |= teasp.Tsf.EmpExp.MISMATCH_PAY_TYPE;
        }
        if(payeeEt && (!expItemFilter.expenseType || !payeeEt.split(/,/).contains(expItemFilter.expenseType))){
            flag |= teasp.Tsf.EmpExp.MISMATCH_PAY_EXPENSE_TYPE;
        }
        // ジョブ入力必須チェック
        if(expItem.isRequireChargeJob() == 2){ // ジョブ入力必須
            if(!vobj.JobId__c){
                flag |= teasp.Tsf.EmpExp.EMPTY_JOB;
            }
        }
        // 負担部署入力必須チェック
        if(tsfManager.isRequireChargeDept() == 2){ // 負担部署入力必須
            if(!vobj.ChargeDeptId__c){
                flag |= teasp.Tsf.EmpExp.EMPTY_CHARGE_DEPT;
            }
        }
        // 経路入力チェック
        if((vobj.TransportType__c == '1' || vobj.TransportType__c == '2') // 駅探検索する交通費、手入力する交通費
        && (!vobj.startName__c || !vobj.endName__c)){
            flag |= teasp.Tsf.EmpExp.EMPTY_ROUTE;
        }
        // 拡張項目チェック
        var extra1 = expItem.getExtraItem(1);
        if(extra1 && extra1.require && !vobj.ExtraItem1__c){ // 拡張項目１が必須で入力値が空
            flag |= teasp.Tsf.EmpExp.EMPTY_EXTRA1;
            extra1Name = extra1.name;
        }
        var extra2 = expItem.getExtraItem(2);
        if(extra2 && extra2.require && !vobj.ExtraItem2__c){ // 拡張項目２が必須で入力値が空
            flag |= teasp.Tsf.EmpExp.EMPTY_EXTRA2;
            extra2Name = extra2.name;
        }
        // JTB実績データが更新されている場合、旧データに紐付いていた明細を不整合とみなす
        if(vobj.Item__c == 'JTB' && !vobj.JsNaviActualId__c) {
            flag |= teasp.Tsf.EmpExp.JTB_ACTUAL_OLD;
        }
    }
    var result = { flag: flag };
    if(extra1Name){
        result.extra1Name = extra1Name;
    }
    if(extra2Name){
        result.extra2Name = extra2Name;
    }
    return result;
};

/**
 * 不整合を探して表示する
 * @param {Object} tr
 * @param {Object} dataObj
 * @returns
 */
teasp.Tsf.SectionDetail.prototype.checkExpMatching = function(tr, dataObj){
    if(!dataObj){
        return 0;
    }
    var result = this.getExpMatching(dataObj);
    this.showExpMatching(tr, result);
    return result.flag;
};

/**
 * 不整合を表示する
 * @param {Object} tr
 * @param {Object} result
 */
teasp.Tsf.SectionDetail.prototype.showExpMatching = function(tr, result){
    if(!this.parent.isShowMisMatch()){
        return;
    }
    // 費目の精算区分不整合、費目表示区分不整合表示
    // 費目セルを探す
    var index = -1;
    var n = 0;
    this.fp.fcLoop(function(fc){
        if(!fc.isHidden() && !fc.isSkip()){
            if(fc.getApiKey() == 'ExpItemId__c' && index < 0){
                index = n;
            }
            n++;
        }
    }, this);
    var td = (index >= 0 ? tr.cells[index] : null);
    if(td){
        var t = [];
        if(result.flag & teasp.Tsf.EmpExp.MISMATCH_EXPENSE_TYPE){
            t.push(teasp.message.getLabel('tf10006860')); // 精算区分不整合
        }
        if(result.flag & teasp.Tsf.EmpExp.MISMATCH_EXPITEM_CLASS){
            t.push(teasp.message.getLabel('tf10006870')); // 費目表示区分不整合
        }
        td.title = (t.length > 0 ? t.join('\r\n') : '');
        var a = teasp.Tsf.Dom.node('div.ts-form-select a', td); // 費目名ノード
        if(a){
            teasp.Tsf.Dom.toggleClass(a.parentNode, 'ts-mismatch', (t.length ? true : false)); // 上位タグのクラス名に ts-right-icon をセット
            var div = teasp.Tsf.Dom.nextSibling(a); // 費目名ノードと同じ層の次のノード
            if(t.length){
                if(!div){
                    div = this.getDomHelper().create('div', null, a, 'after');
                }
                var icon = div.firstChild;
                if(!icon){
                    this.getDomHelper().create('div', { className: 'pp_ico_ng' }, div);
                }
            }else if(div){
                teasp.Tsf.Dom.destroy(div);
            }
        }
    }
    // 支払先の精算区分不整合表示
    var pr = teasp.Tsf.Dom.node('div.ts-route-icons', tr); // 支払先アイコンのエリア
    if(pr){
        var t = [];
        if(result.flag & (teasp.Tsf.EmpExp.MISMATCH_PAY_TYPE|teasp.Tsf.EmpExp.MISMATCH_PAY_EXPENSE_TYPE)){
            t.push(teasp.message.getLabel('tf10006860')); // 精算区分不整合
        }
        if(result.flag & teasp.Tsf.EmpExp.JTB_ACTUAL_OLD){
            t.push(teasp.message.getLabel('jt13000100')); // 出張手配実績が更新されています
        }
        pr.title = (t.length > 0 ? t.join('\r\n') : '');
        var div = teasp.Tsf.Dom.node('div', pr); // 支払先アイコン
        if(div){
            var icon = teasp.Tsf.Dom.node('div', div); // NGアイコン
            if(t.length){
                if(!icon){
                    this.getDomHelper().create('div', { className: 'pp_ico_ng' }, div);
                }
            }else if(icon){
                teasp.Tsf.Dom.destroy(icon);
            }
        }else{
            if(t.length){
                div = this.getDomHelper().create('div', null, pr);
                this.getDomHelper().create('div', { className: 'pp_ico_ng' }, div);
            }
        }
        t = [];
        if(result.flag & teasp.Tsf.EmpExp.EMPTY_ROUTE){
            t.push(teasp.message.getLabel('tm20004260')); // 出発と到着を入力してください
        }
        if(result.flag & teasp.Tsf.EmpExp.EMPTY_EXTRA1){
            var name = result.extra1Name || teasp.message.getLabel('tk10000715'); // 拡張項目1
            t.push(teasp.message.getLabel('tk10000495', name)); // {0} を入力してください
        }
        if(result.flag & teasp.Tsf.EmpExp.EMPTY_EXTRA2){
            var name = result.extra2Name || teasp.message.getLabel('tk10000721'); // 拡張項目2
            t.push(teasp.message.getLabel('tk10000495', name)); // {0} を入力してください
        }
        var icon = teasp.Tsf.Dom.node('div.ts-route-icons > .pp_ico_ng', tr);
        if(icon){
            if(!t.length){
                teasp.Tsf.Dom.destroy(icon);
            }
        }else{
            if(t.length){
                this.getDomHelper().create('div', { className: 'pp_ico_ng', title: t.join('\r\n') }, pr);
            }
        }
    }
    // 負担部署未入力のアイコン表示
    var cr = teasp.Tsf.Dom.node('div.ts-form-route > div.ts-form-route', tr); // 内容のエリア
    if(cr){
        var icon = teasp.Tsf.Dom.node('div.ng-charge-dept', cr); // 警告アイコン
        if(result.flag & teasp.Tsf.EmpExp.EMPTY_CHARGE_DEPT){
            if(!icon){
                icon = this.getDomHelper().create('div', { className: 'pp_ico_ng ng-charge-dept' }, cr);
            }
            icon.title = teasp.message.getLabel('tf10007910'); // 負担部署未入力
            var div = icon.previousSibling;
            if(div && div.innerHTML == '&nbsp;'){
                div.innerHTML = '';
            }
        }else if(icon){
            teasp.Tsf.Dom.destroy(icon);
        }
    }
    // ジョブ未入力のアイコン表示
    var fc = this.fp.getFcByApiKey('JobId__c');
    if(fc){
        var div = teasp.Tsf.Dom.byId(fc.getDomId(teasp.Tsf.Fp.getHkey(tr)));
        if(div && (result.flag & teasp.Tsf.EmpExp.EMPTY_JOB)){
            teasp.Tsf.Dom.empty(div);
            this.getDomHelper().create('div', {
                className: 'pp_ico_ng',
                title    : teasp.message.getLabel('tf10007920') // ジョブ未入力
            }, div);
        }
    }
};

/**
 * 不整合フラグを返す
 * @return {number}
 */
teasp.Tsf.SectionDetail.prototype.getMisMatchFlag = function(){
    return this.misMatch;
};

teasp.Tsf.SectionDetail.prototype.getMisMatchFlagCheckedOnly = function(){
    var misMatch = 0;
    var tbody = this.getTbody();
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var tr = tbody.rows[i];
        var hkey = teasp.Tsf.Fp.getHkey(tr);
        var v = this.getChildValues(hkey, tbody);
        if(v.checked){
            misMatch |= this.checkExpMatching(tr, v);
        }
    }
    return misMatch;
};

/**
 * 経費明細をインポート
 * @param {Array.<Object>} empExps
 */
teasp.Tsf.SectionDetail.prototype.importEmpExps = function(COL, data){
    var expApply = this.getObjBase();
    var exps = [];
    dojo.forEach(data.valids, function(obj){
        exps.push(expApply.createEmpExpFromCsv(COL, obj, this.getFilterExpenseType()));
    }, this);
    this.refreshDiffView(exps);
    // 金額を更新
    this.changedCurrency();
};

/**
 * 絞り込み条件を変更した
 */
teasp.Tsf.SectionDetail.prototype.changedFilter = function(filter){
    this.filter = filter;
};

/**
 * 絞り込み条件の精算区分を返す
 */
teasp.Tsf.SectionDetail.prototype.getFilterExpenseType = function(){
    return (this.filter && this.filter.expenseType);
};
