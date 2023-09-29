/**
 * 一般経費申請フォーム
 *
 * @constructor
 */
teasp.Tsf.Form0 = function(){
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.form0);
    this.sections = [
        new teasp.Tsf.SectionDetail(this),      // 経費明細セクション
        new teasp.Tsf.SectionExpAttach(this),   // 添付ファイルセクション
        new teasp.Tsf.SectionExpRingi(this)     // 稟議セクション
    ];
    this.filter = null;
};

teasp.Tsf.Form0.prototype = new teasp.Tsf.FormBase();

teasp.Tsf.Form0.prototype.createBase = function(){
    // ★★ 親クラスの createBase を呼び出す ★★
    var areaEl = teasp.Tsf.FormBase.prototype.createBase.call(this);

    this.sectionExpHead    = new teasp.Tsf.SectionExpHead(this);

    var div = teasp.Tsf.Dom.node('div.ts-section-bar2', areaEl);
    dojo.forEach(this.sectionExpHead.createArea(), function(el){
        teasp.Tsf.Dom.place(el, div, 'before');
    });

    return areaEl;
};

/**
 * 画面更新
 * 経費明細画面表示時・編集ボタン押下時に画面を更新する。
 *
 * @override
 * @param {Object} objBase
 */
teasp.Tsf.Form0.prototype.refresh = function(objBase, mode){

    // ★★ 親クラスの refresh を呼び出す ★★
    teasp.Tsf.FormBase.prototype.refresh.call(this, objBase, mode);

    // 金額
    this.changedCurrency();

    // 備考に経費明細履歴へのリンクを表示する
    // 経費明細に履歴が存在しない場合は追加しない
    const empExpList = objBase.obj.EmpExp__r || [];         // 経費明細リスト
    empExpList.filter(function(exp){
        // 対象を履歴を持っているexpのみに絞り込む
        return exp.EmpExpHistories__r != null && exp.EmpExpHistories__r.length > 1;
    }).map(function(exp){
        // EmpExpNodeリストに変換
        return new teasp.Tsf.Form0.prototype.EmpExpNode(exp.Id);
    }).forEach(function(expNode){
        // リンクを挿入
        const detail = expNode.detailColumnNode

        const expHistoryLinkWrapper = dojo.create('div');   // 履歴リンクを囲むDIV要素
        const expHistoryLink = dojo.create('a', {"data-expid": expNode.id, innerHTML:teasp.message.getLabel('ex00000200'),"href": "javascript:void(0)"}, expHistoryLinkWrapper);
        expHistoryLink.onclick = function(e){
            tsfManager.openExpHistoryView(e.target.dataset.expid);
        }

        dojo.place(expHistoryLinkWrapper, detail, "before")
    });

    // 申請番号プルダウンの選択肢をセット
    var select = this.getApplyNoList();
    if(select){
        teasp.Tsf.Dom.empty(select);
        if(this.objBase.isCreateFlag()){
            this.getDomHelper().create('option', { innerHTML: teasp.message.getLabel('tf10006180'), value: '' }, select); // (新規)
        }
        this.getDomHelper().create('option', { innerHTML: teasp.message.getLabel('tm10003560'), value: '' }, select); // 未申請
        var lst = tsfManager.getExpApplyNoList();
        var current = { applyNo: this.objBase.getApplyNo(), id: this.objBase.getId() };
        var sel = null;
        dojo.forEach(lst, function(o){
            this.getDomHelper().create('option', { innerHTML: o.applyNo, value: o.id }, select);
            if(current.id && teasp.Tsf.util.equalId(o.id, current.id)){
                sel = o;
            }
        }, this);
        if(!sel && current.id){
            this.getDomHelper().create('option', { innerHTML: current.applyNo, value: current.id }, select);
        }
        select.value = current.id || '';
        this.getDomHelper().connect(select, 'onchange', this, this.selectApply);
    }

    // 前へ・次へボタン
    var prev = this.getPrevButton();
    var next = this.getNextButton();
    if(prev){
        this.getDomHelper().connect(prev, 'onclick', this, this.prevApply);
    }
    if(next){
        this.getDomHelper().connect(next, 'onclick', this, this.nextApply);
    }

    // 申請一覧
    this.domHelper.connect(teasp.Tsf.Dom.node('.ts-form-control .ts-apply-list > button'), 'onclick', this, function(){
        tsfManager.showSearchListDialog({ discernment : 'expApplyList' }, {
            dataProcessingExt   : teasp.Tsf.Dom.hitch(this, this.processApplyList)
        }, teasp.Tsf.Dom.hitch(this, this.changeTo));
    });
    this.changeApply(0, true);

    // 電帳法オプションONの場合、コピーボタンの非活性を制御する
    if (tsfManager.isUseScannerStorage()) {
        // カード連携明細をチェック
        const withCardExp = this.withCardExp(this.objBase);
        const btnCopy = teasp.Tsf.Dom.node('.ts-form-control .ts-form-copy > button');
        this.resetButtonDisable(btnCopy, withCardExp, 'ex00000230');
    }

    // 電帳法オプションONの場合、承認申請後の明細を操作できない
    const disableAddExp = tsfManager.isUseScannerStorage() && teasp.constant.STATUS_FIX.contains(this.objBase.getStatus());
    if (disableAddExp) {
        const bottom = teasp.Tsf.Dom.node('.ts-table-bottom');
        const btnAdd = teasp.Tsf.Dom.node('button.png-add', bottom); // 追加ボタン
        const btnDel = teasp.Tsf.Dom.node('button.png-del', bottom); // 削除ボタン
        const btnIdo = teasp.Tsf.Dom.node('button.png-ido', bottom); // 移動ボタン

        // 非活性対応
        // ・ボタンを非活性に切替
        // ・ボタンにメッセージ表示
        if(btnAdd) {
            btnAdd.setAttribute('disabled', 'disabled');
            btnAdd.title = teasp.message.getLabel('ex00000220');
        }
        if(btnDel) {
            btnDel.setAttribute('disabled', 'disabled');
            btnDel.title = teasp.message.getLabel('ex00000080');
        }
        if(btnIdo) {
            btnIdo.setAttribute('disabled', 'disabled');
            btnIdo.title = teasp.message.getLabel('ex00000180');
        }
    }

    // カード明細読込
    const btnCard = teasp.Tsf.Dom.node('.ts-form-control .ts-form-cardread > button');
    // 非活性制御
    if (btnCard && disableAddExp) {
        this.resetButtonDisable(btnCard, true, 'ex00000220');
    }
    // 通常処理
    else if(btnCard && !this.isReadOnly()){
        this.domHelper.connect(btnCard, 'onclick', this, function(){
            var today = teasp.util.date.formatDate(teasp.util.date.getToday());
            tsfManager.showSearchListDialog({ discernment: 'cardStatement', values: { PaymentDate__c: [today] } }, {
                expImport           : teasp.Tsf.Dom.hitch(this, this.openExpImport),
                dataProcessingExt   : teasp.Tsf.Dom.hitch(this, this.processCardStatement),
                filts               : [{ filtVal: 'PaymentDate__c >= ' + today }],
                dialogTitle         : teasp.message.getLabel('tf10001500') // カード明細読込
            });
        });
    }

    // 履歴から読込
    const btnFromHist = teasp.Tsf.Dom.node('.ts-form-control .ts-form-histexp > button');
    // 非活性制御
    if (btnFromHist && disableAddExp) {
        this.resetButtonDisable(btnFromHist, true, 'ex00000220');
    }

    // 領収書読込ボタン
    const btnFromReceipt = teasp.Tsf.Dom.node('.ts-form-control .ts-form-receipt > button');
    // 非活性制御
    if (btnFromReceipt && disableAddExp) {
        this.resetButtonDisable(btnFromReceipt, true, 'ex00000220');
    }
    // 通常処理
    else if(btnFromReceipt && !this.isReadOnly() && tsfManager.isUsingReceiptSystem()){
        this.domHelper.connect(btnFromReceipt, 'onclick', this, this.loadReceipt);
        teasp.Tsf.Dom.show(btnFromReceipt, null, !this.isReadOnly());
    }

    // IC交通費読込（ピットタッチ）
    const btnFromPitt = teasp.Tsf.Dom.node('.ts-form-control .ts-form-pitexp > button');
    // 非活性制御
    if (btnFromPitt && disableAddExp) {
        this.resetButtonDisable(btnFromPitt, true, 'ex00000220');
    }
    // 通常処理
    else if(btnFromPitt && !this.isReadOnly()){
        this.domHelper.connect(btnFromPitt, 'onclick', this, function(){
            tsfManager.showSearchListDialog({ discernment: 'externalExpense', dialog: 'ExternalExpense' }, {
                extExpImport        : teasp.Tsf.Dom.hitch(this, this.openExtExpImport),
                dataProcessingExt   : teasp.Tsf.Dom.hitch(this, this.processExternalExpense),
                dialogTitle         : teasp.message.getLabel('pit10001010') // IC交通費読込
            });
        });
    }

    // 出張手配実績読込ボタン
    const btnFromJtb = teasp.Tsf.Dom.node('.ts-form-control .ts-form-jtb > button');
    // 非活性制御
    if (btnFromJtb && disableAddExp) {
        this.resetButtonDisable(btnFromJtb, true, 'ex00000220');
    }
    // 通常処理
    else if(btnFromJtb && !this.isReadOnly() && tsfManager.isUsingJsNaviSystem()){
        this.domHelper.connect(btnFromJtb, 'onclick', this, this.loadJsNaviData);
        teasp.Tsf.Dom.show(btnFromJtb, null, !this.isReadOnly());

        // #7381、#7415
        // メッセージ表示可否・表示するメッセージの内容はサーバー側で判定する
        // メッセージをポップアップではなく画面に表示する
        if (this.objBase.obj.JsNaviData &&
            this.objBase.obj.JsNaviData.message &&
            this.objBase.obj.JsNaviData.message.length > 0) {
            var msg = '';

            for (var i = 0; i < this.objBase.obj.JsNaviData.message.length; i++) {
                msg += teasp.message.getLabel(this.objBase.obj.JsNaviData.message[i]) + '<br/>';
            }
            teasp.Tsf.Error.showMessage(msg);
        }
    }

    // csv読込ボタン
    const btnFromCsv = teasp.Tsf.Dom.node('.ts-form-control .ts-form-csvup > button');
    // 非活性制御
    if (btnFromCsv && disableAddExp) {
        this.resetButtonDisable(btnFromCsv, true, 'ex00000220');
    }

    if(btnFromJtb && tsfManager.isUsingJsNaviSystem()){
        if (this.objBase.obj.JsNaviData && this.objBase.obj.JsNaviData.isPossibilityNewActualDataDelivered) {
            // 承認待ちの経費申請に対して出張手配実績が新たに連携された可能性がある場合
            if (this.objBase.isPiwk()) {
                // ユーザが承認者の場合
                teasp.Tsf.Error.showMessage(teasp.message.getLabel('jt13000160'));
            } else {
                // ユーザが承認者以外の場合
                teasp.Tsf.Error.showMessage(teasp.message.getLabel('jt13000170'));
            }
        }
    }

    // 稟議情報セクションの表示/非表示
    this.showSection('expRingi', this.getObjBase().getRingiApplyId());

    // 「事前申請との差異を表示」チェックボックスの表示/非表示
    var opt = teasp.Tsf.Dom.node('div.ts-section-bar2 div.ts-section-option', this.getArea());
    if(opt){
        teasp.Tsf.Dom.show(opt, null, this.getObjBase().getExpPreApplyId());
    }

    if(tsfManager.isOpenReceipt()){
        setTimeout(teasp.Tsf.Dom.hitch(this, this.loadReceipt), 500);
    }
};

/**
 * 一時保存
 *
 * @param e
 */
teasp.Tsf.Form0.prototype.temporarySave = function(e){
    tsfManager.saveExpApply(this.objBase.isCreateFlag() && !this.objBase.getId() ? true : false, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            tsfManager.changeView(null, result.id); // ※ result には Id がセットされている。
        }else{
            teasp.Tsf.Error.showError(result);
        }
    }));
};

/**
 * カード明細読み込み／領収書読込実行画面を開く
 *
 * @param {Object} data
 * @param {Function} cbHide
 * @param {Function} cbError
 */
teasp.Tsf.Form0.prototype.openExpImport = function(data, cbHide, cbError){
    if(data.records.length <= 0){
        cbError(teasp.message.getLabel('tf10001760')); // 読み込み対象を選択してください
        return;
    }
    // 電帳法オプションがONの場合、カード明細の必須項目チェックを行う
    if (tsfManager.isUseScannerStorage()) {
        var isValid = 1;
        dojo.some(data.records, function(rec){
            if(rec.RecordType.Name == '領収書' && !rec.Publisher__c) {  //発行者（店名）なし
                cbError(teasp.message.getLabel('ex00000070')); // 発行者（店名）がない領収書は読込できません。
                isValid = 0;
                return true;
            }
        });
        if(!isValid){
            return;
        }
    }
    var rtype = (data.records[0].RecordType && data.records[0].RecordType.Name || null);
    var chargeDept = tsfManager.getDefaultChargeDept();
    var assist = this.getAssist(this.getFilterExpenseType());
    var obj = {
        expItemClass    : this.getObjBase().getEmpExpItemClass(),
        defaultDeptId   : this.getObjBase().getDeptId(true),
        values          : {
            EmpId__c        : this.getObjBase().getEmpId(),
            ChargeDeptId__c : chargeDept.ChargeDeptId__c,
            ChargeDeptId__r : chargeDept.ChargeDeptId__r
        },
        expApply        : this.getObjBase(),
        recordType      : rtype,
        dialogTitle     : data.dialogTitle || null,
        data            : data,
        assist          : assist,
        expenseType     : this.getFilterExpenseType()
    };
    if(assist){
        if(assist.ChargeDeptId__c){ // 負担部署の指定あり
            obj.values.ChargeDeptId__c = assist.ChargeDeptId__c;
            obj.values.ChargeDeptId__r = assist.ChargeDeptId__r;
        }
        if(assist.ChargeJobId__c){ // ジョブの指定あり
            obj.values.JobId__c = assist.ChargeJobId__c;
            obj.values.JobId__r = assist.ChargeJobId__r;
        }
        if(!tsfManager.isDoNotCopyExtraItem()){ // 経費明細入力時に基本情報の拡張項目をコピーする
            obj.values.ExtraItem1__c = assist.ExtraItem1__c; // 拡張項目１
            obj.values.ExtraItem2__c = assist.ExtraItem2__c; // 拡張項目２
        }
    }
    if(data.records.length == 1){
        obj.values.Detail__c = data.records[0].Note__c;
    }
    console.log(obj);
    tsfManager.showDialog('ExpImport', obj, teasp.Tsf.Dom.hitch(this, function(){
        cbHide();
        this.sections[0].empty(true);
        this.sections[0].refresh();
    }));
};

/**
 * IC交通費読み込み実行画面を開く
 *
 * @param {Object} data
 * @param {Function} cbHide
 * @param {Function} cbError
 */
teasp.Tsf.Form0.prototype.openExtExpImport = function(data, cbHide, cbError){
    if(data.records.length <= 0){
        cbError(teasp.message.getLabel('tf10001760')); // 読み込み対象を選択してください
        return;
    }
    // 選択したデータの経費種別を抽出する
    var usageTypes = [];
    dojo.forEach(data.records, function(record){
        if(!usageTypes.contains(record.UsageType__c)){
            usageTypes.push(record.UsageType__c);
        }
    }, this);
    if(usageTypes.length > 1){
        cbError(teasp.message.getLabel('pit10001070')); // 複数の経費種別を同時に読み込みできません。
        return;
    }
    var chargeDept = tsfManager.getDefaultChargeDept();
    var assist = this.getAssist(this.getFilterExpenseType());
    var obj = {
        isExternalExpense : true,
        expItemClass    : this.getObjBase().getEmpExpItemClass(),
        defaultDeptId   : this.getObjBase().getDeptId(true),
        values          : {
            EmpId__c        : this.getObjBase().getEmpId(),
            ChargeDeptId__c : chargeDept.ChargeDeptId__c,
            ChargeDeptId__r : chargeDept.ChargeDeptId__r
        },
        expApply        : this.getObjBase(),
        dialogTitle     : data.dialogTitle || null,
        data            : data,
        assist          : assist,
        expenseType     : this.getFilterExpenseType()
    };
    if(assist){
        if(assist.ChargeDeptId__c){ // 負担部署の指定あり
            obj.values.ChargeDeptId__c = assist.ChargeDeptId__c;
            obj.values.ChargeDeptId__r = assist.ChargeDeptId__r;
        }
        if(assist.ChargeJobId__c){ // ジョブの指定あり
            obj.values.JobId__c = assist.ChargeJobId__c;
            obj.values.JobId__r = assist.ChargeJobId__r;
        }
        if(!tsfManager.isDoNotCopyExtraItem()){ // 経費明細入力時に基本情報の拡張項目をコピーする
            obj.values.ExtraItem1__c = assist.ExtraItem1__c; // 拡張項目１
            obj.values.ExtraItem2__c = assist.ExtraItem2__c; // 拡張項目２
        }
    }
    console.log(obj);
    tsfManager.showDialog('ExpImport', obj, teasp.Tsf.Dom.hitch(this, function(){
        cbHide();
        this.sections[0].empty(true);
        this.sections[0].refresh();
    }));
};

teasp.Tsf.Form0.prototype.processApplyList = function(records){
    dojo.forEach(records, function(record){
        if(record.StatusC__c == '申請取消'
        && (!record.EmpExp__r || record.EmpExp__r.length <= 0)){
            record.noChoose = true;
        }
    }, this);
//    for(var i = records.length - 1 ; i >= 0 ; i--){
//        var record = records[i];
//        if(!record.EmpExp__r || record.EmpExp__r.length <= 0){
//            records.splice(i, 1);
//        }
//    }
};

teasp.Tsf.Form0.prototype.processCardStatement = function(records){
    var ids = this.collectCardStatementId();
    var assist = this.getAssist(this.getFilterExpenseType());
    var expenseType = (assist && assist.ExpenseType__c) || null;
    dojo.forEach(records, function(record){
        if((record.EmpExp__r && record.EmpExp__r.length > 0)
        || ids.contains(record.Id)){
            record.noChoose = true;
        }else{
            // カード明細の支払先の精算区分
            var et = (record.PayeeId__r && record.PayeeId__r.ExpenseType__c) || null;
            // 基本情報（または絞り込み）で指定の精算区分に合わない場合は選択不可にする
            if(et && (!expenseType || !et.split(',').contains(expenseType))){
                record.noChoose = true;
                record.noChoosePlus = {
                    className: 'pp_ico_ban',
                    title    : teasp.message.getLabel('tf10006860') // 精算区分不整合
                };
            }
        }
    }, this);
};

teasp.Tsf.Form0.prototype.collectCardStatementId = function(){
    var data = this.sections[0].getDomValues();
    var ids = [];
    dojo.forEach(data.values, function(o){
        if(o.CardStatementLineId__c){
            ids.push(o.CardStatementLineId__c);
        }
    }, this);
    return ids;
};

teasp.Tsf.Form0.prototype.processExternalExpense = function(records){
    var ids = this.collectExternalICExpenseId();
    dojo.forEach(records, function(record){
        if((record.EmpExps__r && record.EmpExps__r.length > 0)
        || ids.contains(record.Id)){
            record.noChoose = true;
        }
    }, this);
};

teasp.Tsf.Form0.prototype.collectExternalICExpenseId = function(){
    var data = this.sections[0].getDomValues();
    var ids = [];
    dojo.forEach(data.values, function(o){
        if(o.ExternalICExpenseId__c){
            ids.push(o.ExternalICExpenseId__c);
        }
    }, this);
    return ids;
};

teasp.Tsf.Form0.prototype.getApplyNoList = function(){
    return teasp.Tsf.Dom.node('.ts-form-control .ts-form-pulldown > select');
};

teasp.Tsf.Form0.prototype.getPrevButton = function(){
    return teasp.Tsf.Dom.node('.ts-form-control .ts-form-prev > button');
};

teasp.Tsf.Form0.prototype.getNextButton = function(){
    return teasp.Tsf.Dom.node('.ts-form-control .ts-form-next > button');
};

teasp.Tsf.Form0.prototype.setPrevDisabled = function(flag){
    var n = this.getPrevButton();
    teasp.Tsf.Dom.toggleClass(n, 'disabled', flag);
    n.disabled = flag;
};

teasp.Tsf.Form0.prototype.setNextDisabled = function(flag){
    var n = this.getNextButton();
    teasp.Tsf.Dom.toggleClass(n, 'disabled', flag);
    n.disabled = flag;
};

teasp.Tsf.Form0.prototype.changeApply = function(plus, flag){
    var select = this.getApplyNoList();
    if(!select){
        return null;
    }
    var x   = select.selectedIndex + (plus || 0);
    var las = select.options.length - 1;
    if(x < 0){
        x = 0;
    }
    if(x > las){
        x = las;
    }
    this.setNextDisabled(!x);
    this.setPrevDisabled(x == las);
    return select.options[x].value;
};

/**
 * 対象経費申請にカード連携の明細の有無を取得する
 * @param expApply 対象経費申請データ
 */
teasp.Tsf.Form0.prototype.withCardExp = function(expApply){
    // カード明細連携の経費明細を取得
    const exps = expApply.getEmpExps();
    for(var i = 0; i<= exps.length-1; i++) {
        const exp = exps[i];
        if (exp.CardStatementLineId__r
                && exp.CardStatementLineId__r.RecordType
                && exp.CardStatementLineId__r.RecordType.Name =='カード明細') {
            return true;
        }
    }
    return false;
}

/**
 * ボタンの非活性状態を設定する
 * @param btn 対象ボタン
 * @param disabled 非活性可
 * @param reasonMsgId 非活性の理由メッセージID
 */
teasp.Tsf.Form0.prototype.resetButtonDisable = function(btn, disabled, reasonMsgId){
    if (!btn) {
        return;
    }

    // 非活性
    if (disabled) {
    	btn.setAttribute('disabled', 'disabled');
        teasp.Tsf.Dom.toggleClass(btn, 'disabled', true);
        btn.setAttribute('title', teasp.message.getLabel(reasonMsgId));
    }
    // 非活性をクリア
    else {
        btn.removeAttribute('disabled');
        teasp.Tsf.Dom.toggleClass(btn, 'disabled', false);
        btn.removeAttribute('title');
    }
}

teasp.Tsf.Form0.prototype.changeView = function(plus){
    if(this.checkDiff()){
        teasp.tsConfirm(teasp.message.getLabel('tf10001610'),this,function(result){// 編集中のデータが保存されていませんが、移動してよろしいですか？
            if(result){
                tsfManager.changeView(null, this.changeApply(plus));
            }
            else{
                var select = this.getApplyNoList();
                select.value = this.objBase.getId() || '';
                return;
            }
        });
    }else{
        tsfManager.changeView(null, this.changeApply(plus));
    }
};

teasp.Tsf.Form0.prototype.changeTo = function(lst){
    var o = lst[0];
    if(this.checkDiff()){
        teasp.tsConfirm(teasp.message.getLabel('tf10001610'),this,function(result){// 編集中のデータが保存されていませんが、移動してよろしいですか？
            if(result){
                tsfManager.changeView(null, o.value);
            }
        }); 
    }else{
        tsfManager.changeView(null, o.value);
    }
};

teasp.Tsf.Form0.prototype.selectApply = function(e){
    this.changeView(0);
};

teasp.Tsf.Form0.prototype.prevApply = function(e){
    this.changeView(1);
};

teasp.Tsf.Form0.prototype.nextApply = function(e){
    this.changeView(-1);
};

/**
 * 印刷ボタンクリック時の処理
 *
 */
teasp.Tsf.Form0.prototype.openPrintCheck = function(){
    // 編集中なら保存する
    if((this.objBase.isCreateFlag() && !this.objBase.getId()) // 新規で未保存
    || tsfManager.checkDiff()){                               // または編集内容を保存してない
        teasp.tsConfirm(teasp.message.getLabel('tf10006580'),this,function(result){ // 印刷する前に編集内容を保存してよろしいですか？
            if(result){
                tsfManager.saveExpApply(true, teasp.Tsf.Dom.hitch(this, function(succeed, result){
                    if(succeed){
                        tsfManager.changeView(null, result.id, function(){
                            tsfManager.restoreCheck(result.exps);
                            tsfManager.openPrintView();
                        });
                    }else{
                        teasp.Tsf.Error.showError(result);
                    }
                }));
            }
        });
    }else{
        this.openPrintView();
    }
};

/**
 * 印刷ボタンクリック時の処理
 *
 */
teasp.Tsf.Form0.prototype.openPrintView = function(){
    var h = (screen.availHeight || 800);
    if(h > 800){
        h = 800;
    }
    var expApplyId = this.objBase.getId();
    var expenseType = this.getFilterExpenseType();
    var href = teasp.getPageUrl('expPrintView')
        + '?target=ExpApply&empId=' + tsfManager.getEmpId()
        + '&expApplyId=' + (expApplyId || '') + '&mode=read'
        + (expenseType ? ('&expenseType=' + encodeURIComponent(expenseType)) : '');
    if(teasp.isSforce1()){
        sforce.one.navigateToURL(href);
    }else{
        var wh = window.open(href,
            'print', 'width=800,height=' + h + ',resizable=yes,scrollbars=yes');
        setTimeout(function(){ wh.resizeTo(810, h); wh.focus(); }, 100);
    }
};

/**
 * 承認申請
 *
 * @param e
 */
teasp.Tsf.Form0.prototype.submitApply = function(callback){
    var data = this.getDomValues(false, 1, true);
    if(data.ngList.length > 0){
        teasp.Tsf.Error.showError(teasp.Tsf.Error.messageFromNgList(data.ngList));
        return;
    }
    data = teasp.Tsf.util.clone(data);
    var obj = data.values[0];
    obj.ExpApplyId__c = obj.Id;
    obj.exps = (data.EmpExp__r && data.EmpExp__r.values) || [];
    if(!obj.Id){ // removeExpIds をセットするのは未申請明細（ID がない時）だけ
        obj.removeExpIds = this.getObjBase().getRemoveExpIds(obj.exps);
    }
    var allList = [];
    var allDates = [];
    var checkedList = [];
    var checkedTotalCost = 0;
    var checkedDates = [];
    var checkExpItems = [];	// 費目チェック用

    dojo.forEach(obj.exps, function(exp){
        allList.push(exp.Id || exp._uniqKey);
        if(exp.checked){
            checkedList.push(exp.Id || exp._uniqKey);
            checkedTotalCost += (teasp.Tsf.util.parseInt(exp.Cost__c) || 0);
            checkedDates.push(exp.Date__c);
        }

        // 費目がnullの場合
        if (!exp.ExpItemId__c) {
        	checkExpItems.push(exp.ExpItemId__c);
        }
        allDates.push(exp.Date__c);
    });
    if(!allList.length && !obj.Id && !obj.createFlag){ // 未申請明細で明細がなければエラー
        teasp.Tsf.Error.showError(teasp.message.getLabel('tf10001650')); // 申請対象がありません
        return;
    }
    var misMatchWide = (data.misMatch     & (teasp.Tsf.EmpExp.MISMATCH_MASK|teasp.Tsf.EmpExp.EMPTY_MASK));
    var misCheckOnly = (data.misCheckOnly & (teasp.Tsf.EmpExp.MISMATCH_MASK|teasp.Tsf.EmpExp.EMPTY_MASK));
    var misMatch = (checkedList.length && !obj.Id && !obj.createFlag) // チェック行数>0 かつ未申請明細である
                ? misCheckOnly
                : misMatchWide;
    if((misMatch & teasp.Tsf.EmpExp.MISMATCH_MASK) != 0){
        teasp.Tsf.Error.showError(teasp.message.getLabel('tf10006880' // 精算区分、費目表示区分と経費明細が不整合の状態のため、{0}。
                                , teasp.message.getLabel(tsfManager.isExpWorkflow() ? 'tf10006890' : 'tf10006900'))); // 申請できません or 確定できません
        return;
    }

    // 費目がnullの明細が1件以上存在する場合はエラー
    if (checkExpItems.length > 0) {
        teasp.Tsf.Error.showError(teasp.message.getLabel('tf10007090' // 費目が選択されていない経費明細があるため、{0}。
                , teasp.message.getLabel(tsfManager.isExpWorkflow() ? 'tf10006890' : 'tf10006900'))); // 申請できません or 確定できません
        return;
    }

    var emptyBit = (misMatch & teasp.Tsf.EmpExp.EMPTY_MASK);
    if(emptyBit != 0){
        var fls = [];
        if(emptyBit & teasp.Tsf.EmpExp.EMPTY_JOB){
            fls.push(teasp.message.getLabel('job_label')); // ジョブ
        }
        if(emptyBit & teasp.Tsf.EmpExp.EMPTY_CHARGE_DEPT){
            fls.push(teasp.message.getLabel('tf10006000')); // 負担部署
        }
        if(emptyBit & teasp.Tsf.EmpExp.EMPTY_ROUTE){
            fls.push(teasp.message.getLabel('route_head')); // 経路
        }
        if(emptyBit & (teasp.Tsf.EmpExp.EMPTY_EXTRA1|teasp.Tsf.EmpExp.EMPTY_EXTRA2)){
            fls.push(teasp.message.getLabel('tk10000616')); // 拡張項目
        }
        teasp.Tsf.Error.showError(teasp.message.getLabel('tf10007120', fls.join(teasp.message.getLabel('tm10001560')))); // 必須入力の{0}が未入力の経費があります。
        return;
    }
    var oldJtb = (data.misMatch & teasp.Tsf.EmpExp.JTB_ACTUAL_OLD);
    if(oldJtb != 0){
        teasp.Tsf.Error.showError(teasp.message.getLabel('jt13000110')); // 更新前の出張手配実績が残っています。削除後に申請を行ってください。
        return;
    }
    var sa = teasp.Tsf.Dom.byId('Form0TotalAmount').value;
    var totalCost = teasp.Tsf.util.parseInt(sa);
    var minus = (obj.Id ? (totalCost < 0) : (checkedTotalCost <= 0 && totalCost <= 0 && (checkedTotalCost < 0 || totalCost < 0)));

    if(!tsfManager.isAllowMinusApply() && minus){ // 合計金額がマイナスの経費申請を許可しないで、合計金額がマイナス
        teasp.tsAlert(teasp.message.getLabel('tm30001145'
                , (obj.Id ? teasp.util.currency.addFigure(totalCost) : teasp.message.getLabel('tk10001052'))
                , (obj.Id ? teasp.message.getLabel('cunit_jps') : '')
                , teasp.util.currency.addFigure(teasp.constant.CU_TOTAL_LOWER_LIMIT)
                , teasp.message.getLabel('cunit_jps')
                ));
        /*
         * ＊＊＊＊＊＊ 申請できません ＊＊＊＊＊＊
         * 申請対象の明細の合計金額が {0} {1}になっています。1申請あたりの明細の合計金額が {2} {3}以上となるように、申請を行ってください。
         */
        return; 
    }else{

        var changed = this.checkDiff();

        tsfManager.showDialog('ApplyCommentExp', {
            key                 : 'submitApply',
            title               : this.getApplyButtonLabel(),
            formCss             : 'ts-dialog-comment',
            buttons             : [{ key:'submitApply', label:this.getApplyButtonLabel() }, { key:'cancel', label:teasp.message.getLabel('cancel_btn_title') }], // キャンセル
            targetChoice        : ((obj.Id || obj.createFlag) ? false : true),
            allList             : allList,
            allDates            : allDates,
            totalCost           : totalCost,
            checkedList         : checkedList,
            checkedTotalCost    : checkedTotalCost,
            checkedDates        : checkedDates,
            objBase             : this.getObjBase(),
            expApply            : (changed ? obj : null), // 変更がある場合、入力値をセット
            checkedOnly         : (checkedList.length && misMatchWide && !misCheckOnly)
        }, teasp.Tsf.Dom.hitch(this, function(result){
            tsfManager.changeView(null, result.id);
        }));
    }
};

/**
 * 未申請明細から精算開始
 *
 */
teasp.Tsf.Form0.prototype.createExpApplyCheck = function(){
    // 編集中なら保存する
    if(tsfManager.checkDiff()){ // 編集内容を保存してない
        teasp.tsConfirm(teasp.message.getLabel('tf10008880'),this,function(result){// 精算開始する前に編集内容を保存してよろしいですか？  
            if(result){
                tsfManager.saveExpApply(true, teasp.Tsf.Dom.hitch(this, function(succeed, result){
                    if(succeed){
                        tsfManager.changeView(null, result.id, function(){
                            tsfManager.restoreCheck(result.exps);
                            tsfManager.startCreateExpApply();
                        });
                    }else{
                        teasp.Tsf.Error.showError(result);
                    }
                }));
            }
        });
    }else{
        this.createExpApply();
    }
};

/**
 * 未申請明細から精算開始
 *
 */
teasp.Tsf.Form0.prototype.createExpApply = function(){
    var data = this.getDomValues(false, 2);
    data = teasp.Tsf.util.clone(data);
    var obj = data.values[0];
    obj.ExpApplyId__c = obj.Id;
    obj.exps = (data.EmpExp__r && data.EmpExp__r.values) || [];

    var allList = [];
    var allDates = [];
    var checkedList = [];
    var checkedDates = [];
    var checkExpItems = [];	// 費目チェック用
    var expenseType = null;

    dojo.forEach(obj.exps, function(exp){
        allList.push(exp.Id || exp._uniqKey);
        if(exp.checked){
            checkedList.push(exp.Id || exp._uniqKey);
            checkedDates.push(exp.Date__c);
        }

        // 費目がnullの場合
        if (!exp.ExpItemId__c) {
        	checkExpItems.push(exp.ExpItemId__c);
        }
        allDates.push(exp.Date__c);
    });

    // 費目がnullの明細が1件以上存在する場合はエラー
    if (checkExpItems.length > 0) {
        teasp.Tsf.Error.showError(teasp.message.getLabel('tf10007090' // 費目が選択されていない経費明細があるため、{0}。
                , teasp.message.getLabel(tsfManager.isExpWorkflow() ? 'tf10006890' : 'tf10006900'))); // 申請できません or 確定できません
        return;
    }
    if(this.isUseExpFilter()){ // 精算区分の絞り込みを使用する
        var assist = this.getAssist(this.getFilterExpenseType());
        expenseType = (assist && assist.ExpenseType__c) || null;
    }

    tsfManager.showDialog('ApplyCreateExp', {
        key                 : 'createExpApply',
        title               : teasp.message.getLabel('tf10009570'),
        formCss             : 'ts-dialog-comment',
        buttons             : [{ key:'createExpApply', label:teasp.message.getLabel('ok_btn_title') }, { key:'cancel', label:teasp.message.getLabel('cancel_btn_title') }], // キャンセル
        allList             : allList,
        allDates            : allDates,
        checkedList         : checkedList,
        checkedDates        : checkedDates,
        expenseType         : expenseType,
        expApply            : obj
    }, teasp.Tsf.Dom.hitch(this, function(result){
        tsfManager.changeView(null, result.id);
    }));
};

/**
 * 金額が変更された
 *
 * @param {Object} e
 */
teasp.Tsf.Form0.prototype.changedCurrency = function(e){
    var area = tsfManager.getArea();
    var m = this.getTotalAmount(true);
    teasp.Tsf.Dom.html('.ts-payValue-value > div', area, teasp.Tsf.Currency.formatMoney(m.payValue, teasp.Tsf.Currency.V_YEN, false, true));
    teasp.Tsf.Dom.html('.ts-provis-value > div'  , area, teasp.Tsf.Currency.formatMoney(m.provis  , teasp.Tsf.Currency.V_YEN, false, true));
    teasp.Tsf.Dom.html('.ts-dueToPay-value > div', area, teasp.Tsf.Currency.formatMoney(m.duetopay, teasp.Tsf.Currency.V_YEN, false, true));
    teasp.Tsf.Dom.html('.ts-credit-value > div'  , area, teasp.Tsf.Currency.formatMoney(m.credit  , teasp.Tsf.Currency.V_YEN, false, true));
    teasp.Tsf.Dom.html('.ts-invoice-value > div' , area, teasp.Tsf.Currency.formatMoney(m.invoice , teasp.Tsf.Currency.V_YEN, false, true));
    teasp.Tsf.Dom.html('div#JsNaviActualAmount'  , area, m.jtb == 0 ? '&nbsp;' : teasp.Tsf.Currency.formatMoney(m.jtb, teasp.Tsf.Currency.V_YEN, false, true));
    if(teasp.Tsf.Dom.byId('JsNaviActualAmount')) teasp.Tsf.Dom.byId('JsNaviActualAmount').style.backgroundColor = m.jtb > m.jtbPre ? '#ffccff' : null;
    teasp.Tsf.Dom.byId('Form0TotalAmount').value = '' + m.total;

    teasp.Tsf.Dom.show('td.ts-provis-label'   , area, m.provis);
    teasp.Tsf.Dom.show('td.ts-provis-value'   , area, m.provis);
    teasp.Tsf.Dom.show('td.ts-dueToPay-label' , area, m.duetopay);
    teasp.Tsf.Dom.show('td.ts-dueToPay-value' , area, m.duetopay);
    teasp.Tsf.Dom.show('td.ts-credit-label'   , area, m.credit);
    teasp.Tsf.Dom.show('td.ts-credit-value'   , area, m.credit);
    teasp.Tsf.Dom.show('td.ts-invoice-label'  , area, m.invoice);
    teasp.Tsf.Dom.show('td.ts-invoice-value'  , area, m.invoice);

    if(this.sectionExpFilter){
        this.sectionExpFilter.resetExpenseTypes();
    }
    teasp.Tsf.FormBase.prototype.changedCurrency.call(this);
};

teasp.Tsf.Form0.prototype.getTotalAmount = function(flag){
    var obj = this.objBase.getDataObj();
    var assist = this.getAssist(this.getFilterExpenseType());
    if(assist && obj.ProvisionalPaymentId__c != assist.ProvisionalPaymentId__c){
        obj.ProvisionalPaymentId__c = assist.ProvisionalPaymentId__c;
        obj.ProvisionalPaymentId__r = (assist.ProvisionalPaymentId__c ? assist.ProvisionalPaymentId__r : null);
    }
    var provis   = obj.ProvisionalPaymentAmount__c || 0;  // 仮払金額
    if(!this.objBase.getId() || flag){
        provis = (obj.ProvisionalPaymentId__r && teasp.Tsf.util.parseInt(obj.ProvisionalPaymentId__r.ProvisionalPaymentAmount__c) || 0)  // 仮払申請の仮払金額
               + (obj.ExpPreApplyId__r        && teasp.Tsf.util.parseInt(obj.ExpPreApplyId__r.ProvisionalPaymentAmount__c)        || 0); // 事前申請の仮払金額
    }

    var dueToPay = obj.AmountDueToPay__c || 0;            // 本人立替金額
    var payValue = dueToPay - provis;   // 精算金額
    var credit   = 0;
    var invoice  = 0;
    var jtbPre   = this.objBase.expPreApply ? (this.objBase.expPreApply.obj.PlannedAmount__c || 0) : 0; // J'sNAVI Jr手配予定金額
    var jtb      = 0; // J'sNAVI Jr手配実績金額
    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionDetail);
    var lines = this.objBase.getSectionValues(sp.getDiscernment());
    var _dueToPay = 0;
    var total     = 0;
    for(var i = 0 ; i < lines.length ; i++){
        var o = lines[i];
        if(o._removed){ // 削除済み
            continue;
        }
        var n = teasp.Tsf.util.parseInt(o.Cost__c) || 0;
        if(o.PayeeId__r){
            if(o.PayeeId__r.PayeeType__c == '2'){ // 請求書払い
                invoice += n;
            }else if(o.PayeeId__r.PayeeType__c == '3'){ // 法人カード払い
                credit += n;
            }else{
                _dueToPay += n;
            }
        }else{
            _dueToPay += n;
        }
        if(o.Item__c == 'JTB'){  // J'sNAVI Jr実績明細
            jtb += n;
        }
        total += n;
    }
    if(!this.objBase.getId() || flag){
        dueToPay = _dueToPay;
        payValue = dueToPay - provis;
    }
    return {
        payValue     : payValue, // 精算金額（本人立替金額－仮払金額）
        provis       : provis,   // 仮払金額
        duetopay     : dueToPay, // 本人立替金額
        credit       : credit,   // 法人カード払い分
        invoice      : invoice,  // 請求書払い分
        jtbPre       : jtbPre,   // J'sNAVI Jr手配予定金額
        jtb          : jtb,      // J'sNAVI Jr手配実績金額
        total        : total     // 合計
    };
};

/**
 * タイムレポートへ遷移するボタンを日付フィールド左に挿入
 * @param {Object} tr
 */
teasp.Tsf.Form0.prototype.injectTimeReportLink = function(tr){
    var dtlnk = teasp.Tsf.Dom.node('td.ts-form-date a', tr);
    if(dtlnk){
        // アイコンを挿入
        var jump = this.getDomHelper().create('div', { className: 'pp_ico_trepo', style: {'float':'left'} }, dtlnk, 'before');
        this.getDomHelper().create('div', { style: {clear:'both'} }, dtlnk, 'after');
        var d = teasp.util.date.parseDate(dtlnk.innerHTML);
        jump.title = teasp.message.getLabel('tf10004770', dtlnk.innerHTML); // {0} のタイムレポートへ
        // クリックでタイムレポートへ遷移
        this.getDomHelper().connect(jump, 'onclick', this, function(empId, dt){
            return function(e){
                teasp.locationHref(teasp.getPageUrl('timeReportView') + '?empId=' + empId
                            + '&date=' + dt
                            + (tsfManager.isReadMode() ? '&mode=read' : ''));
                e.preventDefault();
                e.stopPropagation();
            };
        }(tsfManager.getEmpId(), teasp.util.date.formatDate(d, 'yyyyMMdd')));
    }
};

/**
 * 領収書をロード
 */
teasp.Tsf.Form0.prototype.loadReceipt = function(){
    tsfManager.actionReceipt({
        action : 'load',
        empId  : tsfManager.getEmpId(),
        notapi : !tsfManager.getInfo().isReceiptReaderConnect() // 業者組織との通信しない場合 true をセット
    }, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(!succeed){
//            teasp.Tsf.Error.showError(result);
//            return;
            teasp.tsConfirm('エラー：' + teasp.Tsf.Error.getMessage(result)
                    + '\n\n続行するには OK をクリックしてください',this,function(confirmOK){
                if(confirmOK){
                    tsfManager.showSearchListDialog({ discernment: 'receipts', values: { Status__c: ['2'] }, dialog: 'ReceiptList', statusNums: result.statusNums }, {
                        expImport           : teasp.Tsf.Dom.hitch(this, this.openExpImport),
                        dataProcessingExt   : teasp.Tsf.Dom.hitch(this, this.processCardStatement),
                        filts               : [{ filtVal: "Status__c = '2'" }],
                        dialogTitle         : teasp.message.getLabel('tf10004950') // 領収書読込
                    });
                }
            });
        }else{
            tsfManager.showSearchListDialog({ discernment: 'receipts', values: { Status__c: ['2'] }, dialog: 'ReceiptList', statusNums: result.statusNums }, {
                expImport           : teasp.Tsf.Dom.hitch(this, this.openExpImport),
                dataProcessingExt   : teasp.Tsf.Dom.hitch(this, this.processCardStatement),
                filts               : [{ filtVal: "Status__c = '2'" }],
                dialogTitle         : teasp.message.getLabel('tf10004950') // 領収書読込
            });
        }
    }));
};

/**
 * コピー
 *
 */
teasp.Tsf.Form0.prototype.doCopy = function(){
    // 編集中なら保存する
    if(!this.getCurrentObjectId() || tsfManager.checkDiff()){
        teasp.tsConfirm(teasp.message.getLabel('tf10006840'),this,function(result){// 編集内容を保存してからコピーを作成します。よろしいですか？
            if(result){
                tsfManager.saveExpApply(true, teasp.Tsf.Dom.hitch(this, function(succeed, result){
                    if(succeed){
                        tsfManager.changeView(null, result.id,
                            teasp.Tsf.Dom.hitch(this, function(){
                                tsfManager.restoreCheck(result.exps);
                                tsfManager.copyExpApply();
                            })
                        );
                    }else{
                            teasp.Tsf.Error.showError(result);
                    }
                }));
            }
        });
    }else{
        tsfManager.copyExpApply();
    }
};

/**
 * CSV読込ウィンドウを開く
 * @param {Object} node
 */
teasp.Tsf.Form0.prototype.openCsvImport = function(){
    var rowCount = this.sections[0].getRowCount(); // 明細数を取得
    if(rowCount >= tsfManager.getExpCountLimit()){
        teasp.tsAlert(teasp.message.getLabel('ci00000190', tsfManager.getExpCountLimit()));// 明細数が上限（{0}）に達しているため、CSV読込はできません。
        return;   
    }else{
    // トークンを作成
    var d = new Date();
    this.csvImportToken = '' + d.getTime() + 'C' + Math.floor(Math.random() * 100);
    // ウィンドウを開く
    var wh = window.open(teasp.getPageUrl('csvUploadView'),
            'expCsvUpload', 'width=700,height=340,resizable=yes,scrollbars=yes');
    if(wh){
        tsfManager.setCsvImportFlag(true);
        setTimeout(function(){ wh.focus(); }, 100);
        // UIブロック＋実行中表示
        teasp.Tsf.Dom.setBusyPanel(true, {
            domHelper: this.getDomHelper(),
            method   : function(){
                if(this.csvImportToken){
                    this.csvImportToken = null;
                    teasp.Tsf.Dom.setBusyPanel(false);
                    var w = window.open('', 'expCsvUpload');
                    w.close();
                    tsfManager.setCsvImportFlag(false);
                }
            },
            hkey     : 'csvImport',
            context  : this,
            message  : teasp.message.getLabel('ci00000160'), // CSV読込実行中
            btnLabel : teasp.message.getLabel('ci00000170')  // 中止
        });
    }
  }
};

/**
 * （主にCSV読込ウィンドウ向けに）基本情報の設定値を返す
 */
teasp.Tsf.Form0.prototype.getAssistParam = function(){
    return this.getAssist(this.getFilterExpenseType());
};

/**
 * CSV読込ウィンドウ向けにトークンを返す
 * @param {boolean=} flag trueならトークンを作成
 */
teasp.Tsf.Form0.prototype.getToken = function(){
    var rowCount = this.sections[0].getRowCount(); // 明細数を取得
    return {
        csvImportToken: this.csvImportToken,
        rowCount      : rowCount
    };
};

/**
 * 絞り込みセクションを使用するか
 * @param {boolean=} flag true:未申請明細データでなければfalseを返す
 */
teasp.Tsf.Form0.prototype.isUseExpFilter = function(flag){
    if(flag && (this.getObjBase().isCreateFlag() || this.getObjBase().getId())){
        return false;
    }
    if(tsfManager.getInfo().getExpPreApplyConfigs().expenseTypeFirst){
        return true;
    }
    return false;
};

/**
 * 絞り込み条件を変更した
 */
teasp.Tsf.Form0.prototype.changedFilter = function(filter){
    this.filter = filter;
    tsfManager.getInfo().setExpFilter(this.filter);
    this.getObjBase().filterEmpExp(this.filter);
    this.getObjBase().clearTrashs(teasp.Tsf.formParams.sectionDetail.discernment);
    dojo.forEach(this.sections, function(section){
        section.changedFilter(filter);
        section.refreshView(true);
    }, this);
    this.changedCurrency();
    this.savePoint();
};

/**
 * セクションのリフレッシュをする前に行う処理
 */
teasp.Tsf.Form0.prototype.beforeRefreshSections = function(){
    this.filter = (this.sectionExpFilter && this.sectionExpFilter.getFilter()) || null;
    if(this.filter){
        this.getObjBase().filterEmpExp(this.filter);
        var section = this.getSectionByDiscernment(teasp.Tsf.formParams.sectionDetail.discernment);
        if(section){
            section.changedFilter(this.filter);
        }
    }
};

/**
 * 絞り込み条件の精算区分を返す
 */
teasp.Tsf.Form0.prototype.getFilterExpenseType = function(){
    return (this.filter && this.filter.expenseType);
};

/**
 * 絞り込み条件の精算区分候補を返す
 */
teasp.Tsf.Form0.prototype.getPullExpenseTypes = function(){
    return this.getObjBase().getPullExpenseTypes();
};

// 出張手配実績データ読み込み
teasp.Tsf.Form0.prototype.openJsNaviImport = function(data, cbHide, cbError){
    if(data.records.length <= 0){
        cbError(teasp.message.getLabel('tf10001760')); // 読み込み対象を選択してください
        return;
    }
    var rtype = (data.records[0].RecordType && data.records[0].RecordType.Name || null);
    var chargeDept = tsfManager.getDefaultChargeDept();
    var assist = this.getAssist();
    var obj = {
        expItemClass    : this.getObjBase().getEmpExpItemClass(),
        defaultDeptId   : this.getObjBase().getDeptId(true),
        values          : {
            EmpId__c        : this.getObjBase().getEmpId(),
            ChargeDeptId__c : chargeDept.ChargeDeptId__c,
            ChargeDeptId__r : chargeDept.ChargeDeptId__r
        },
        expApply        : this.getObjBase(),
        recordType      : rtype,
        dialogTitle     : data.dialogTitle || null,
        data            : data,
        assist          : assist
    };
    if(assist){
        if(assist.ChargeDeptId__c){ // 負担部署の指定あり
            obj.values.ChargeDeptId__c = assist.ChargeDeptId__c;
            obj.values.ChargeDeptId__r = assist.ChargeDeptId__r;
        }
        if(assist.ChargeJobId__c){ // ジョブの指定あり
            obj.values.JobId__c = assist.ChargeJobId__c;
            obj.values.JobId__r = assist.ChargeJobId__r;
        }
        obj.values.ExtraItem1__c = assist.ExtraItem1__c; // 拡張項目１
        obj.values.ExtraItem2__c = assist.ExtraItem2__c; // 拡張項目２
    }
    console.log(obj);
    tsfManager.showDialog('JsNaviImport', obj, teasp.Tsf.Dom.hitch(this, function(){
        cbHide();
        this.sections[0].empty(true);
        this.sections[0].refresh();
    }));
};

// 出張手配実績データインポートダイアログ
teasp.Tsf.Form0.prototype.processJsNaviStatement = function(records){
    console.log("records");
    console.log(records);
    var ids = this.collectJsNaviActualId();
    dojo.forEach(records, function(record){
        record.JsNaviActualId__c = record.Id;

        // アイコン表示をさせるにはstartName/endName固定なのでセット
        record.startName__c = record.Data03__c;		// 出発地
        record.endName__c = record.Data04__c;		// 到着地

        record.Note__c = record.Data01__c || '';	// サービス名称
        // 内容を追加で格納
        if(record.PayContent__c){
            record.Note__c += "(" + record.PayContent__c + ")";	// 内容
        }
        if(record.Note__c){
            record.Note__c = record.Note__c.substr(0, 255);	// 255文字で切る
        }

        if(ids.contains(record.Id)){
            record.noChoose = true;
        }
    }, this);
};

// 出張手配実績読込ダイアログで表示する実績データのIDを取得する。
teasp.Tsf.Form0.prototype.collectJsNaviActualId = function(){
    var data = this.sections[0].getDomValues();
    var ids = [];
    dojo.forEach(data.values, function(o){
        if(o.JsNaviActualId__c){
            ids.push(o.JsNaviActualId__c);
        }
    }, this);
    return ids;
};

teasp.Tsf.Form0.prototype.loadJsNaviData = function(){

    tsfManager.showSearchListDialog(
            {discernment: 'actualExpense', values: {}},
            {
                expImport           : teasp.Tsf.Dom.hitch(this, this.openJsNaviImport),
                dataProcessingExt   : teasp.Tsf.Dom.hitch(this, this.processJsNaviStatement),
                filts               : [{}],
                dialogTitle         : teasp.message.getLabel('jt13000010') // 出張手配実績読込
            }
        );
};

/**
 * 編集されたか否かをチェックする
 *
 * @returns {boolean}
 */
teasp.Tsf.Form0.prototype.checkDiff = function(){
    // 自動追加された出張手配実績データがあるかをチェック
    var jtbAdded = false;
    dojo.forEach(this.objBase.orgExpIds, function(expId){
        if(!expId){
            jtbAdded = true;
        }
    });

    // 画面が編集されたか自動追加された出張手配実績データがある場合はtrueを返す
    return teasp.Tsf.FormBase.prototype.checkDiff.call(this) || jtbAdded;
};

/**
 * 経費明細ノードのWrapperクラス
 * 引数の経費明細IDに一致する行やカラムのノードを取得して保持するクラス
 * @param {string} empExpId 経費明細ID
 */
teasp.Tsf.Form0.prototype.EmpExpNode = function(empExpId){
    // 経費明細ID
    this.id = empExpId;
    // 経費明細テーブルの行ノード
    this.rowNode = dojo.query('input[value=' + empExpId +']')[0].parentNode;
    // 行のシーケンス番号(例: R44など)
    this.rowSeq = dojo.query('input.ts-row-seq',this.rowNode)[0].value;
    // 備考ノード
    this.detailColumnNode = dojo.byId('SectDetail' + this.rowSeq + 'Detail');
}