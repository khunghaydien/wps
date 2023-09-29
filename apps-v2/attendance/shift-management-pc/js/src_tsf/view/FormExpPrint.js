/**
 * 事前申請の印刷用
 *
 * @constructor
 */
teasp.Tsf.FormExpPrint = function(){
    this.sections = [];
    this.IMAGE_EVENT_KEY = 'expPrint';
};

teasp.Tsf.FormExpPrint.prototype = new teasp.Tsf.FormBase();

teasp.Tsf.FormExpPrint.prototype.initFp = function(objBase){
    var config = objBase.getConfig();
    var p = null;
    if(config.view == 'Form1'){
        p = teasp.Tsf.formParams.form1;
        this.formType = 1;
    }else if(config.view == 'Form2'){
        p = teasp.Tsf.formParams.form2;
        this.formType = 2;
    }else if(config.view == 'Form3'){
        p = teasp.Tsf.formParams.form3;
        this.formType = 3;
    }else if(config.view == 'Form4'){
        p = teasp.Tsf.formParams.form4;
        this.formType = 4;
    }else{
        p = teasp.Tsf.formParams.form0;
        this.formType = 0;
    }
    this.fp = teasp.Tsf.Fp.createFp(p);
};

teasp.Tsf.FormExpPrint.prototype.isReadOnly = function(){
    return tsfManager.isReadMode();
};

teasp.Tsf.FormExpPrint.prototype.isAttach = function(){
    return (tsfManager.getAction() == 'attach');
};

teasp.Tsf.FormExpPrint.prototype.getDispValue = function(apiKey, p, obj){
    var fp = p || this.fp;
    var v = fp.getDispValueByApiKey(obj || this.objBase.getDataObj(), apiKey);
    v = teasp.Tsf.util.entitizf(v);
    if(v && typeof(v) == 'string'){
        v = v.replace(/\r?\n/g, '<br/>');
    }
    return v;
};

teasp.Tsf.FormExpPrint.prototype.getExpContent = function(dataObj){
    return dataObj._route.getExpContent(this.getDomHelper(), teasp.Tsf.Fp.createHkey(), null, true);
};

teasp.Tsf.FormExpPrint.prototype.getBigTitle = function(){
    return this.fp.getTitle() || '';
};

teasp.Tsf.FormExpPrint.isImage = function(attach){
    if(/^image/i.test(attach.ContentType)){
        return true;
    }
    // 電帳法オプションON以降登録された領収書は拡張子で判定
    // ※AtkExpImageCtl.fileTypeToContentTypeと同期する必要がある
    if (attach.ContentDocument) {
        const imageTypes = ['JPG','JPEG','JPE','PNG','GIF'];
        if (imageTypes.indexOf(attach.ContentDocument.FileType) !== -1){
            return true;
        }
    }
    return false;
};

teasp.Tsf.FormExpPrint.prototype.getImageList = function(e){
    var lst = [];
    dojo.forEach(this.objBase.getAttachments(), function(attach){
        if(teasp.Tsf.FormExpPrint.isImage(attach)){
            lst.push(attach);
        }
    });
    return lst;
};

teasp.Tsf.FormExpPrint.prototype.getReceiptImageList = function(e){
    var lst = [];
    var attachs = this.getAllAttachs();
    dojo.forEach(attachs, function(attach){
        if(attach.receipt && (teasp.Tsf.FormExpPrint.isImage(attach.attach) || attach.uber)){
            lst.push(attach.attach);
        }
    });
    return lst;
};

// 出張手配セクションを使う
teasp.Tsf.FormExpPrint.prototype.useJtbSect = function(){
    return tsfManager.isUsingJsNaviSystem() && tsfManager.getInfo().isUseJtbSect(this.objBase.getTypeName());
};
// 出張手当・宿泊手当セクションを使う
teasp.Tsf.FormExpPrint.prototype.useAllowanceSect = function(){
    return tsfManager.getInfo().isUseAllowanceSect(this.objBase.getTypeName());
};
// 手配回数券セクションを使う
teasp.Tsf.FormExpPrint.prototype.useCouponTicketSect  = function(){
    return tsfManager.getInfo().isUseCouponTicketSect(this.objBase.getTypeName());
};
// 手配チケットセクションを使う
teasp.Tsf.FormExpPrint.prototype.useTicketArrangeSect = function(){
    return tsfManager.getInfo().isUseTicketArrangeSect(this.objBase.getTypeName());
};
// 仮払申請セクションを使う
teasp.Tsf.FormExpPrint.prototype.useProvisionalSect = function(){
    var useProvisionalSect = tsfManager.getInfo().isUseProvisionalSect(this.objBase.getTypeName());
    if(this.objBase.getProvisionalPaymentId()){ // 仮払申請のリンクがセットされている
        useProvisionalSect = false;        // 仮払申請セクションは非表示にする
    }
    return useProvisionalSect;
};
// 社員立替交通費セクションを使う
teasp.Tsf.FormExpPrint.prototype.useFreeInputSect = function(){
    return tsfManager.getInfo().isUseFreeInputSect(this.objBase.getTypeName());
};
// 海外出張セクションを使う
teasp.Tsf.FormExpPrint.prototype.useOverseaTravel = function(){
    return (this.objBase.getDestinationType() == '2');
};

/**
 * 画面更新
 *
 * @override
 * @param {Object} objBase
 */
teasp.Tsf.FormExpPrint.prototype.refresh = function(objBase, mode){
    this.objBase = objBase;
    this.objBase.setMode(mode);
    this.expenseType = tsfManager.getParamByKey('expenseType', true);
    if(this.expenseType){
        this.objBase.filterEmpExp({"expenseType":this.expenseType});
    }
    this.setReadOnly(this.isReadOnly());
    teasp.Tsf.Dom.show(teasp.Tsf.Dom.byId('attachExpView'), null, false);
    this.init();
    if(this.isAttach()){ // 添付ファイル
        this.expAttach.refreshAttach(objBase);
    }
    this.show();
};

teasp.Tsf.FormExpPrint.prototype.createBase = function(){
    var table = this.getDomHelper().create('table', { id: this.fp.getAreaId(), style: 'width:100%;' });
    var tbody = this.getDomHelper().create('tbody', null, table);

    // 申請番号、ステータス、押印欄
    this.createTop1(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));

    if(this.isAttach()){ // 添付ファイル
        this.expAttach = new teasp.Tsf.FormExpAttach(this, this.fp, this.getDomHelper());
        this.expAttach.createTr(tbody);
    }else{
        // 部署、社員コード、社員名
        this.createTop2 (this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));
        if(this.formType != 4){
            // 合計金額、仮払金額
            this.createTop3 (this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));
        }
        if(this.formType == 1){ // 出張・交通費申請
        	var jtbValues       = this.getJtbValues();
            var allowanceValues = this.getAllowanceValues();    // 出張手当・宿泊手当
            var couponValues    = this.getCouponValues();       // 手配回数券
            var ticketValues    = this.getTicketValues();       // 手配チケット
            var provisionValues = this.getProvisionValues();    // 仮払申請
            var detailValues    = this.getDetailValues();       // 社員立替交通費
            this.outputBase1(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));
            if(this.useJtbSect()           || jtbValues.length      ){ this.outputJtb      (this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)), jtbValues); }
            if(this.useAllowanceSect()     || allowanceValues.length){ this.outputAllowance(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody))); }
            if(this.useCouponTicketSect()  || couponValues.length   ){ this.outputCoupon   (this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody))); }
            if(this.useTicketArrangeSect() || ticketValues.length   ){ this.outputTicket   (this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody))); }
            if(this.useOverseaTravel()                              ){ this.outputOversea  (this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody))); }
            if(this.useProvisionalSect()   || provisionValues.valid ){ this.outputProvision(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody))); }
            if(this.useFreeInputSect()     || detailValues.length   ){ this.outputDetail2  (this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody))); }

        }else if(this.formType == 2){ // 会議・交際費申請
            var provisionValues = this.getProvisionValues();    // 仮払申請
            this.outputBase2(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));
            if(this.useProvisionalSect() || provisionValues.valid){ this.outputProvision(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody))); }

        }else if(this.formType == 3){ // 一般経費申請
            var provisionValues = this.getProvisionValues();    // 仮払申請
            this.outputBase3(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));
            if(this.useProvisionalSect() || provisionValues.valid){ this.outputProvision(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody))); }
            this.outputDetail2(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));

        }else if(this.formType == 4){ // 仮払申請
            this.outputBase4(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));
            this.outputProvision(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)), true);

        }else{
            if(this.objBase.getExpPreApplyId()){ // 事前申請がある
                this.outputExpPre(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));
            }
            if(this.objBase.getId()){
                this.outputBase0(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody))); // 基本情報
            }
            this.outputDetail2(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));
            if(this.objBase.getRingiApplyId()){ // 稟議
                this.outputRingi(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));
            }
        }
        // 添付ファイルリスト
        this.outputAttach(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));

        // コメント
        this.outputComment(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));
        // 最終承認日、最終承認者、申請日
        this.outputAttr(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));
        // 画像表示エリア
        this.outputImage(this.getDomHelper().create('td', null, this.getDomHelper().create('tr', null, tbody)));

        if(this.formType == 0){ // 経費精算
            this.outputReceiptArea();
        }
    }

    teasp.Tsf.Dom.append(teasp.Tsf.Dom.byId(this.parentId), table);
    return table;
};

/**
 * 上１：左右
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.createTop1 = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-top1' }, area);
    var tr = this.getDomHelper().create('tr', null, this.getDomHelper().create('tbody', null, table));
    this.createTop1L(this.getDomHelper().create('td', { style: 'padding-right:4px;' }, tr));

    if(!this.isAttach()){ // 添付ファイル以外
        this.createTop1R(this.getDomHelper().create('td', { style: 'width:240px;' }, tr));
    }

    return table;
};

/**
 * 上１左：上下
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.createTop1L = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-top1L' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);
    var tr = this.getDomHelper().create('tr', null, tbody);
    var td = this.getDomHelper().create('td', null, tr);
    this.createTop1LU(td);

    if(!this.isAttach()){ // 添付ファイル以外
        tr = this.getDomHelper().create('tr', null, tbody);
        td = this.getDomHelper().create('td', null, tr);
        this.createTop1LD(td);
    }

    return table;
};

/**
 * 上1左上：プリンタへ出力、閉じるボタン、捺印枠
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.createTop1LU = function(area){
    var table = this.getDomHelper().create('table', null, area);
    var tbody = this.getDomHelper().create('tbody', null, table);
    var tr = this.getDomHelper().create('tr', null, tbody);

    if(!this.isAttach()){
        // 「プリンタへ出力」ボタン
        var btn1 = this.getDomHelper().create('button', { className: 'std-button1' }
            , this.getDomHelper().create('td', { className: 'buttons' }, tr));
        this.getDomHelper().connect(btn1, 'onclick', function(){
            window.print();
            return false;
        });
        this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('printOut_btn_title') }, btn1);

        if(this.objBase.isPiwk()){
            // 「承認/却下」ボタン
            var btn2 = this.getDomHelper().create('button', { className: 'std-button3' }
                , this.getDomHelper().create('td', { className: 'buttons' }, tr));
            this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel(this.objBase.isCancelApplyWait() ? 'tf10006250' : 'tf10000270') }, btn2); // 取消伝票の承認／却下 or 承認／却下
            this.domHelper.connect(btn2, 'onclick', this, this.approveApply);
        }
    }

    // 「閉じる」ボタン
    var btn3 = this.getDomHelper().create('button', { className: 'std-button2' }
        , this.getDomHelper().create('td', { className: 'buttons' }, tr));
    this.getDomHelper().connect(btn3, 'onclick', function(){
        (window.open('','_top').opener=top).close();
        return false;
    });
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('close_btn_title') }, btn3);

    // 印刷時だけ表示するタイトル
    this.getDomHelper().create('div', { innerHTML: this.getBigTitle() }, this.getDomHelper().create('td', { className: 'big-title' }, tr));

    // SFアプリで[プリンタへ出力][閉じる]ボタンを非表示にする
    teasp.Tsf.Dom.show('.buttons', area, (!teasp.isSforce1()));

    return table;
};

teasp.Tsf.FormExpPrint.prototype.createCell = function(tbody, info){
    var td;
    var rows = info.rows || [];
    for(var r = 0 ; r < rows.length ; r++){
        var row = rows[r];
        var tr = this.getDomHelper().create('tr', null, tbody);
        var cells = row.cells || [];
        for(var c = 0 ; c < cells.length ; c++){
            var cell = cells[c];
            if(cell.valueOnly){
                // 値
                td = this.getDomHelper().create('td', { className: (cell.vStyle || ''), colSpan: (cell.vSpan || 1) }, tr);
                this.getDomHelper().create('div', { innerHTML: cell.value || '' }, td);
            }else{
                // 項目
                td = this.getDomHelper().create('td', { className: (cell.cStyle || ''), colSpan: (cell.cSpan || 1), rowSpan: (cell.rSpan || 1) }, tr);
                this.getDomHelper().create('div', { innerHTML: (cell.name ? cell.name : teasp.message.getLabel(cell.msgId)) }, td);
                // 値
                td = this.getDomHelper().create('td', { className: (cell.vStyle || ''), colSpan: (cell.vSpan || 1), rowSpan: (cell.rSpan || 1) }, tr);
                this.getDomHelper().create('div', { innerHTML: cell.value || '' }, td);
            }
        }
    }
};

teasp.Tsf.FormExpPrint.prototype.createDiv = function(area, info){
    var div = this.getDomHelper().create('div', { className: 'float-div' }, area);
    this.getDomHelper().create('div', { className: (info.cStyle || ''), innerHTML: (info.msgId ? teasp.message.getLabel(info.msgId) : (info.name || '')) }, div);
    this.getDomHelper().create('div', { className: (info.vStyle || '') }, div);
};

/**
 * 上１左下：申請番号、ステータス
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.createTop1LD = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-appno print-tops' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);
    if(this.formType == 0){ // 経費精算
        this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c'  , msgId: 'tf10000550'   , vStyle: 'print-apno', value: '' },        // 精算申請番号
                                                { cStyle: 'print-col-c'  , msgId: 'status_label' , vStyle: 'print-stat', value: '' },        // ステータス
                                                { cStyle: 'print-col-c'  , msgId: 'payDate_label', vStyle: 'print-payd', value: '' }         // 精算日
                                                ] }] });
        teasp.Tsf.Dom.html('td.print-apno   > div', table, this.objBase.getApplyNo()); // 申請番号
        teasp.Tsf.Dom.html('td.print-stat   > div', table, teasp.constant.getDisplayStatus(this.objBase.getStatusD(true))); // ステータス
        teasp.Tsf.Dom.html('td.print-payd   > div', table, this.objBase.getPayDate()); // 精算日
    }else{ // 事前申請
        this.createCell(tbody, { rows:[{ cells:[{ valueOnly: true, vStyle: 'print-aptype', value: '' },  // 申請種別
                                                { cStyle: 'print-col-c'  , msgId: 'tf10001100'  , vStyle: 'print-apno', value: '' },        // 事前申請番号
                                                { cStyle: 'print-col-c'  , msgId: 'status_label', vStyle: 'print-stat', value: '' }] }] }); // ステータス
        teasp.Tsf.Dom.html('td.print-aptype > div', table, this.fp.getTitle()); // 申請種別
        teasp.Tsf.Dom.html('td.print-apno   > div', table, this.objBase.getApplyNo()); // 申請番号
        teasp.Tsf.Dom.html('td.print-stat   > div', table, teasp.constant.getDisplayStatus(this.objBase.getStatusD(true))); // ステータス
    }
    if(this.objBase.isRemoved()){ // 論理削除済み
        this.getDomHelper().create('div', {
            className: 'print-removed',
            innerHTML: teasp.message.getLabel('tf10007760') // この申請は削除されています。
        }, table, 'before');
    }
    return table;
};

/**
 * 上１右：捺印枠
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.createTop1R = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-sign' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);
    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('td', null, tr);
    this.getDomHelper().create('td', null, tr);
    this.getDomHelper().create('td', null, tr);
    this.getDomHelper().create('td', null, tr);
    return table;
};

/**
 * 上２：部署、社員コード、社員名
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.createTop2 = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-who print-tops' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'section_label', vStyle: 'print-dept', value: '' },        // 部署
                                            { cStyle: 'print-col-c', msgId: 'empCode_label', vStyle: 'print-code', value: '' },        // 社員コード
                                            { cStyle: 'print-col-c', msgId: 'empName_label', vStyle: 'print-emp' , value: '' }] }] }); // 社員名
    teasp.Tsf.Dom.html('td.print-dept   > div', table, this.objBase.getDeptName(true));
    teasp.Tsf.Dom.html('td.print-code   > div', table, tsfManager.getTargetEmp().getEmpCode());
    teasp.Tsf.Dom.html('td.print-emp    > div', table, tsfManager.getEmpName());
    return table;
};

/**
 * 金額の集計値を返す
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.getTotalAmount = function(){
    var obj = this.objBase.getDataObj();
    var provis   = obj.ProvisionalPaymentAmount__c || 0;  // 仮払金額
    var dueToPay = obj.AmountDueToPay__c || 0;            // 本人立替金額
    var payValue = dueToPay - provis;   // 精算金額
    var credit   = 0;
    var invoice  = 0;
    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionDetail);
    var lines = this.objBase.getSectionValues(sp.getDiscernment());
    var _dueToPay = 0;
    for(var i = 0 ; i < lines.length ; i++){
        var o = lines[i];
        if(o.PayeeId__r){
            if(o.PayeeId__r.PayeeType__c == '2'){ // 請求書払い
                invoice += (o.Cost__c || 0);
            }else if(o.PayeeId__r.PayeeType__c == '3'){ // 法人カード払い
                credit += (o.Cost__c || 0);
            }else{
                _dueToPay += (o.Cost__c || 0);
            }
        }else{
            _dueToPay += (o.Cost__c || 0);
        }
    }
    if(!this.objBase.getId()){
        payValue = dueToPay = _dueToPay;
    }
    return {
        total    : teasp.Tsf.Currency.formatMoney(payValue, teasp.Tsf.Currency.V_YEN, false, true), // 精算金額
        provis   : teasp.Tsf.Currency.formatMoney(provis  , teasp.Tsf.Currency.V_YEN, false, true), // 仮払金額
        duetopay : teasp.Tsf.Currency.formatMoney(dueToPay, teasp.Tsf.Currency.V_YEN, false, true), // 本人立替金額
        credit   : teasp.Tsf.Currency.formatMoney(credit  , teasp.Tsf.Currency.V_YEN, false, true), // 法人カード払い分
        invoice  : teasp.Tsf.Currency.formatMoney(invoice , teasp.Tsf.Currency.V_YEN, false, true)  // 請求書払い分
    };
};

/**
 * 上３：合計金額、仮払金額等
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.createTop3 = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-sum print-tops' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);
    if(this.formType == 0){ // 経費精算
        var expenseType = this.getDispValue('ExpenseType__c', teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionExpAssist)); // 精算区分
        var payTypeNums = tsfManager.getPayeeTypeNums(expenseType); // 支払種別
        var lst = [];
        if(this.objBase.getId()){
            lst.push({ cStyle: 'print-col-c', msgId: 'tf10000530', vStyle: 'print-provis'  , value: '' });  // 仮払金額
        }else{
            lst.push({ cStyle: 'print-col-c', name: '', value: '' });  // 未申請明細では仮払金額は空欄
        }
        lst.push({ cStyle: 'print-col-c', msgId: 'tf10000540', vStyle: 'print-duetopay', value: '' });  // 本人立替分
        if(payTypeNums[3] > 0){ // 法人カードを使う
            lst.push({ cStyle: 'print-col-c', msgId: 'tf10004930', vStyle: 'print-credit'  , value: '' });  // 法人カード払い分
        }
        if(payTypeNums[2] > 0){ // 請求書を使う
            lst.push({ cStyle: 'print-col-c', msgId: 'tf10004940', vStyle: 'print-invoice' , value: '' });  // 請求書払い分
        }
        if(lst.length % 2){
            lst.push({ cStyle: 'print-col-c', name: '', value: '' });  // 空白セル
        }
        var n = 0;
        var y = 0;
        var o = { rows:[] };
        o.rows.push({ cells: [] });
        o.rows[y].cells.push({ cStyle: 'print-col-c', msgId: 'tf10000520', vStyle: 'print-total', value: '', rSpan: (lst.length >= 2 ? 2 : 1) });  // 精算金額
        while(n < lst.length){
            o.rows[y].cells.push(lst[n++]);
            if(n && (n % 2) == 0){
                o.rows.push({ cells: [] });
                y++;
            }
        }
        this.createCell(tbody, o);

        var m = this.getTotalAmount();
        var zero = teasp.Tsf.Currency.formatMoney(0, teasp.Tsf.Currency.V_YEN, false, true);
        teasp.Tsf.Dom.html('td.print-total    > div', table, m.total    || zero); // 精算金額
        teasp.Tsf.Dom.html('td.print-provis   > div', table, m.provis   || zero); // 仮払金額
        teasp.Tsf.Dom.html('td.print-duetopay > div', table, m.duetopay || zero); // 本人立替分
        teasp.Tsf.Dom.html('td.print-credit   > div', table, m.credit   || zero); // 法人カード払い分
        teasp.Tsf.Dom.html('td.print-invoice  > div', table, m.invoice  || zero); // 請求書払い分
    }else{ // 事前申請
        this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10001110', vStyle: 'print-total' , value: '' },        // 合計金額
                                                { cStyle: 'print-col-c', msgId: 'tf10000530', vStyle: 'print-provis', value: '' }] }] }); // 仮払金額

        var n1 = this.getDispValue('TotalAmount__c');               // 合計金額
        var n2 = this.getDispValue('ProvisionalPaymentAmount__c');  // 仮払金額
        var zero = teasp.Tsf.Currency.formatMoney(0, teasp.Tsf.Currency.V_YEN, false, true);
        teasp.Tsf.Dom.html('td.print-total  > div', table, n1 || zero);
        teasp.Tsf.Dom.html('td.print-provis > div', table, n2 || zero);
    }

    return table;
};

/**
 * 申請情報
 *
 * @param {Object} area
 * @param {number=} cols  =2の場合は2列で出力する。それ以外は1列（2以外の値は無視する）。
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.appendAssist = function(tbody, cols){
    var typeName = this.objBase.getTypeName();
    var obj = this.objBase.getDataObj();
    var ut = tsfManager.getInfo().getUseTitle(typeName, obj);      // 件名の入力（経費精算のみ）
    var et = tsfManager.getInfo().isUseExpenseType(typeName, obj); // 精算区分
    var pm = tsfManager.getInfo().isUsePayMethod(typeName, obj);   // 精算方法
    var ad = tsfManager.getInfo().isUseApplyDate(typeName, obj);   // 申請日
    var pd = tsfManager.getInfo().isUsePayDate(typeName, obj);     // 支払予定日
    var pp = tsfManager.getInfo().isUseProvisional(typeName, obj); // 仮払い申請
    var cj = tsfManager.getInfo().isUseChargeJob(typeName, obj);   // ジョブ
    var cd = tsfManager.getInfo().isUseChargeDept(typeName, obj);  // 負担部署
    var e1 = tsfManager.getInfo().isUseExtraItem1(typeName, obj);  // 拡張項目1
    var e2 = tsfManager.getInfo().isUseExtraItem2(typeName, obj);  // 拡張項目2

    if(!ut && !et && !pm && !ad && !pd && !pp && !cj && !cd && !e1 && !e2){
        return false;
    }

    var cells = [];
    var SPAN_TWO = 5;
    var SPAN_ONE = 11;
    var span = (cols == 2 ? SPAN_TWO : SPAN_ONE);
    var nn = 0;
    if(ut){ cells.push({ cStyle: 'print-col-c', msgId: 'tk10004320', vStyle: 'exp-title'     , vSpan: SPAN_ONE, value: '' }); } // 件名
    if(et){ cells.push({ cStyle: 'print-col-c', msgId: 'tf10006080', vStyle: 'expense-type'  , vSpan: span, value: '' }); nn++; } // 精算区分
    if(pm){ cells.push({ cStyle: 'print-col-c', msgId: 'tf10006090', vStyle: 'pay-expitem'   , vSpan: span, value: '' }); nn++; } // 精算方法
    if(ad){ cells.push({ cStyle: 'print-col-c', msgId: 'tf10006100', vStyle: 'apply-date'    , vSpan: span, value: '' }); nn++; } // 申請日
    if(pd){ cells.push({ cStyle: 'print-col-c', msgId: 'tf10006110', vStyle: 'pay-date'      , vSpan: span, value: '' }); nn++; } // 支払予定日
    if(pp){ cells.push({ cStyle: 'print-col-c', msgId: 'tf10006120', vStyle: 'provis-paym'   , vSpan: span, value: '' }); nn++; } // 仮払申請
    if(cj){ cells.push({ cStyle: 'print-col-c', msgId: 'job_label' , vStyle: 'job'           , vSpan: span, value: '' }); nn++; } // ジョブ
    if(cd){ cells.push({ cStyle: 'print-col-c', msgId: 'tf10006000', vStyle: 'charge-dept'   , vSpan: span, value: '' }); nn++; } // 負担部署
    if(e1){ cells.push({ cStyle: 'print-col-c', name: tsfManager.getInfo().getExtraItemOutputDataName1() || '&nbsp;', vStyle: 'extra-item1'   , vSpan: span, value: '' }); nn++; } // 拡張項目１
    if(e2){ cells.push({ cStyle: 'print-col-c', name: tsfManager.getInfo().getExtraItemOutputDataName2() || '&nbsp;', vStyle: 'extra-item2'   , vSpan: span, value: '' }); nn++; } // 拡張項目２

    if(cols == 2 && (nn % 2) != 0){
        cells.push({ cStyle: 'print-col-c', name: '', vStyle: null, vSpan: span, value: '' });
    }

    var i = 0;
    while(i < cells.length){
        var cell = cells[i++];
        var o = { rows:[{ cells:[] }] };
        o.rows[0].cells.push(cell);
        if(cell.vSpan == SPAN_TWO && i < cells.length){
            o.rows[0].cells.push(cells[i++]);
        }
        this.createCell(tbody, o);
    }

    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionExpAssist);

    if(ut){ teasp.Tsf.Dom.html('td.exp-title   > div', tbody, this.getDispValue('Title__c'               , sp)); } // 件名
    if(et){ teasp.Tsf.Dom.html('td.expense-type> div', tbody, this.getDispValue('ExpenseType__c'         , sp)); } // 精算区分
    if(pm){ teasp.Tsf.Dom.html('td.pay-expitem > div', tbody, this.getDispValue('PayExpItemId__c'        , sp)); } // 精算方法
    if(ad){ teasp.Tsf.Dom.html('td.apply-date  > div', tbody, this.getDispValue('ApplyDate__c'           , sp)); } // 申請日
    if(pd){ teasp.Tsf.Dom.html('td.pay-date    > div', tbody, this.getDispValue('ExpectedPayDate__c'     , sp)); } // 支払予定日
    if(pp){ teasp.Tsf.Dom.html('td.provis-paym > div', tbody, this.getDispValue('ProvisionalPaymentId__c', sp)); } // 仮払申請
    if(cj){ teasp.Tsf.Dom.html('td.job         > div', tbody, this.getDispValue('ChargeJobId__c'         , sp)); } // ジョブ
    if(cd){ teasp.Tsf.Dom.html('td.charge-dept > div', tbody, this.getDispValue('ChargeDeptId__c'        , sp)); } // 負担部署
    if(e1){ teasp.Tsf.Dom.html('td.extra-item1 > div', tbody, this.getDispValue('ExtraItem1__c'          , sp)); } // 拡張項目１
    if(e2){ teasp.Tsf.Dom.html('td.extra-item2 > div', tbody, this.getDispValue('ExtraItem2__c'          , sp)); } // 拡張項目２
    return true;
};

/**
 * 経費精算の基本情報
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputBase0 = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-base print-bodys' });
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('tf10002150')) } // 基本情報
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 12 }, tr));

    if(this.appendAssist(tbody, 2)){
        teasp.Tsf.Dom.append(area, table);
        return table;
    }else{
        return null;
    }
};

/**
 * 出張・交通費の基本情報
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputBase1 = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-base print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('tf10002150')) } // 基本情報
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 12 }, tr));

    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000760', vStyle: 'print-type'   , vSpan:11, value: '' }] }] }); // 出張種別
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tk10004320', vStyle: 'print-title'  , vSpan:11, value: '' }] }] }); // 件名
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tk10000814', vStyle: 'print-account', vSpan:11, value: '' }] }] }); // 取引先
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'job_label' , vStyle: 'print-job'    , vSpan:11, value: '' }] }] }); // ジョブ
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000770', vStyle: 'print-sd'     , vSpan: 3, value: '' },        // 出発予定日
                                            { cStyle: 'print-col-c', msgId: 'tf10000780', vStyle: 'print-st'     , vSpan: 3, value: '' },        // 出発予定時刻
                                            { cStyle: 'print-col-c', msgId: 'tf10000790', vStyle: 'print-dt'     , vSpan: 3, value: '' }] }] }); // 出発区分
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000800', vStyle: 'print-ed'     , vSpan: 3, value: '' },        // 帰着予定日
                                            { cStyle: 'print-col-c', msgId: 'tf10000810', vStyle: 'print-et'     , vSpan: 3, value: '' },        // 帰着予定時刻
                                            { cStyle: 'print-col-c', msgId: 'tf10000820', vStyle: 'print-rt'     , vSpan: 3, value: '' }] }] }); // 帰着区分
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000830', vStyle: 'print-destc'  , vSpan:11, value: '' }] }] }); // 出張先会社名
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000840', vStyle: 'print-desta'  , vSpan:11, value: '' }] }] }); // 出張先住所
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000850', vStyle: 'print-content', vSpan:11, value: '' }] }] }); // 内容

    teasp.Tsf.Dom.html('td.print-type    > div', table, this.getDispValue('DestinationType__c'));    // 出張種別
    teasp.Tsf.Dom.html('td.print-title   > div', table, this.getDispValue('Title__c'));              // 件名
    teasp.Tsf.Dom.html('td.print-account > div', table, this.getDispValue('AccountName__c'));        // 取引先
    teasp.Tsf.Dom.html('td.print-job     > div', table, this.getDispValue('ChargeJobId__c'));        // ジョブ
    teasp.Tsf.Dom.html('td.print-sd      > div', table, this.getDispValue('StartDate__c'));          // 出発予定日
    teasp.Tsf.Dom.html('td.print-st      > div', table, this.getDispValue('DepartureTime__c'));      // 出発予定時刻
    teasp.Tsf.Dom.html('td.print-dt      > div', table, this.getDispValue('DepartureType__c'));      // 出発区分
    teasp.Tsf.Dom.html('td.print-ed      > div', table, this.getDispValue('EndDate__c'));            // 帰着予定日
    teasp.Tsf.Dom.html('td.print-et      > div', table, this.getDispValue('ReturnTime__c'));         // 帰着予定時刻
    teasp.Tsf.Dom.html('td.print-rt      > div', table, this.getDispValue('ReturnType__c'));         // 帰着区分
    teasp.Tsf.Dom.html('td.print-destc   > div', table, this.getDispValue('DestinationName__c'));    // 出張先会社名
    teasp.Tsf.Dom.html('td.print-desta   > div', table, this.getDispValue('DestinationAddress__c')); // 出張先住所
    teasp.Tsf.Dom.html('td.print-content > div', table, this.getDispValue('Content__c'));            // 内容

    this.appendAssist(tbody, 2);

    return table;
};

/**
 * 会議・交際費の基本情報
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputBase2 = function(area){

    var socialExpItem = tsfManager.getExpItemById(this.getObjBase().getDataObj().SocialExpItemId__c);
    var isShowInterInfo = false;
    var isShowInterNumber = false;
    var isShowExterInfo = false;
    var isShowExterNumber = false;
    var isShowPlace = false;
    var isShowTotalNumber = false;

    var table = this.getDomHelper().create('table', { className: 'print-base print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('tf10002150')) } // 基本情報
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 12 }, tr));

    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tk10004320'  , vStyle: 'print-title'  , vSpan:11, value: '' }] }] }); // 件名
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tk10000814'  , vStyle: 'print-account', vSpan:11, value: '' }] }] }); // 取引先
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'job_label'   , vStyle: 'print-job'    , vSpan:11, value: '' }] }] }); // ジョブ
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'expItem_head', vStyle: 'print-expItem', vSpan:11, value: '' }] }] }); // 費目
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000620'  , vStyle: 'print-date'   , vSpan:11, value: '' }] }] }); // 予定日
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000850'  , vStyle: 'print-content', vSpan:11, value: '' }] }] }); // 内容
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000950'  , vStyle: 'print-amount' , vSpan:11, value: '' }] }] }); // 金額

    if(socialExpItem) {
        // 会議交際費の費目の場合

        //社内・社外参加者人数の設定があるときの、表示／非表示の設定
        if(socialExpItem.isValidInternalParticipants()){
            if(socialExpItem.isInternalParticipants()){
                isShowInterNumber = true;
            }else{
                //「入力しない」の設定だが、入力値があるときは表示する。
                var ourN = teasp.Tsf.util.parseInt(this.getDispValue('OurNumber__c')) || 0;
                if( ourN >= 1 ){
                    isShowInterNumber = true;
                }else{
                    isShowInterNumber = false;
                }
            }
        }
        if(socialExpItem.isValidExternalParticipants()){
            if(socialExpItem.isExternalParticipants()){
                isShowExterNumber = true;
            }else{
                //「入力しない」の設定だが、入力値があるときは表示する。
                var theN = teasp.Tsf.util.parseInt(this.getDispValue('TheirNumber__c')) || 0;
                if( theN >= 1 ){
                    isShowExterNumber = true;
                }else{
                    isShowExterNumber = false;
                }
            }
        }

        //社内・社外参加者人数の設定は無いが、入力値があるときは表示する。
        if(socialExpItem.isValidInternalParticipants()){
            //処理なし
        }else{
            var ourN = teasp.Tsf.util.parseInt(this.getDispValue('OurNumber__c')) || 0;
            if( ourN >= 1 ){
                isShowInterNumber = true;
            }
        }

        if(socialExpItem.isValidExternalParticipants()){
            //処理なし
        }else{
            var theN = teasp.Tsf.util.parseInt(this.getDispValue('TheirNumber__c')) || 0;
            if( theN >= 1 ){
                isShowExterNumber = true;
            }
        }

        isShowInterInfo = socialExpItem.isInternalParticipants();
        isShowExterInfo = socialExpItem.isExternalParticipants();
        isShowPlace = socialExpItem.isPlace();
        isShowTotalNumber = isShowInterNumber || isShowExterNumber;

    }else{
        // 費目が空(null)のときは処理なし。(何も表示しない想定)
    }

    if(isShowInterNumber) {
        this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000860'  , vStyle: 'print-pp1'    , vSpan: 11, value: '' }] }] }); // 社内参加者人数
    }
    if(isShowInterInfo) {
        this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10011030'  , vStyle: 'print-ppinfo1', vSpan: 11, value: '' }] }] }); // 社内参加者情報
    }
    if(isShowExterNumber) {
        this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000870'  , vStyle: 'print-pp2'    , vSpan: 11, value: '' }] }] }); // 社外参加者人数
    }
    if(isShowExterInfo) {
        this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10011040'  , vStyle: 'print-ppinfo2', vSpan: 11, value: '' }] }] }); // 社外参加者情報
    }
    if(isShowTotalNumber) {
        this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000880'  , vStyle: 'print-pp3'    , vSpan: 11, value: '' }] }] }); // 合計人数
    }
    if(isShowPlace) {
        this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10011010'  , vStyle: 'print-place'  , vSpan: 11, value: '' }] }] }); // 店舗名
        this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10011020'  , vStyle: 'print-placeAdr', vSpan: 11, value: '' }] }] }); // 店舗所在地
    }

    var pp1 = this.getDispValue('OurNumber__c');
    var pp2 = this.getDispValue('TheirNumber__c');
    var pp1N = teasp.util.parseNumText(pp1, 0);
    var pp2N = teasp.util.parseNumText(pp2, 0);
    var pp3 = ''+((pp1N===null?'':pp1N) + (pp2N===null?'':pp2N)); // 合計人数

    teasp.Tsf.Dom.html('td.print-title   > div', table, this.getDispValue('Title__c'));              // 件名
    teasp.Tsf.Dom.html('td.print-account > div', table, this.getDispValue('AccountName__c'));        // 取引先
    teasp.Tsf.Dom.html('td.print-job     > div', table, this.getDispValue('ChargeJobId__c'));        // ジョブ
    teasp.Tsf.Dom.html('td.print-expItem > div', table, this.getDispValue('SocialExpItemId__c'));    // 費目
    teasp.Tsf.Dom.html('td.print-date    > div', table, this.getDispValue('StartDate__c'));          // 予定日
    teasp.Tsf.Dom.html('td.print-content > div', table, this.getDispValue('Content__c'));            // 内容
    teasp.Tsf.Dom.html('td.print-amount  > div', table, this.getDispValue('TotalAmount__c'));        // 金額
    if(isShowInterNumber){teasp.Tsf.Dom.html('td.print-pp1     > div', table, pp1);}                                           // 社内参加者人数
    if(isShowExterNumber){teasp.Tsf.Dom.html('td.print-pp2     > div', table, pp2);}                                           // 社外参加者人数
    if(isShowTotalNumber){teasp.Tsf.Dom.html('td.print-pp3     > div', table, pp3);}                                     // 合計人数
    if(isShowInterInfo){teasp.Tsf.Dom.html('td.print-ppinfo1  > div', table, this.getDispValue('InternalParticipants__c'));} // 社内参加者
    if(isShowExterInfo){teasp.Tsf.Dom.html('td.print-ppinfo2  > div', table, this.getDispValue('ExternalParticipants__c'));} // 社外参加者
    if(isShowPlace){teasp.Tsf.Dom.html('td.print-place    > div', table, this.getDispValue('PlaceName__c'));}            // 店舗名
    if(isShowPlace){teasp.Tsf.Dom.html('td.print-placeAdr > div', table, this.getDispValue('PlaceAddress__c'));}         // 店舗所在地

    this.appendAssist(tbody, 2);

    return table;
};

/**
 * 一般経費の基本情報
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputBase3 = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-base print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('tf10002150')) } // 基本情報
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 12 }, tr));

    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tk10004320'  , vStyle: 'print-title'  , vSpan:11, value: '' }] }] }); // 件名
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tk10000814'  , vStyle: 'print-account', vSpan:11, value: '' }] }] }); // 取引先
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'job_label'   , vStyle: 'print-job'    , vSpan:11, value: '' }] }] }); // ジョブ
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000620'  , vStyle: 'print-date'   , vSpan:11, value: '' }] }] }); // 予定日
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000850'  , vStyle: 'print-content', vSpan:11, value: '' }] }] }); // 内容

    teasp.Tsf.Dom.html('td.print-title   > div', table, this.getDispValue('Title__c'));              // 件名
    teasp.Tsf.Dom.html('td.print-account > div', table, this.getDispValue('AccountName__c'));        // 取引先
    teasp.Tsf.Dom.html('td.print-job     > div', table, this.getDispValue('ChargeJobId__c'));        // ジョブ
    teasp.Tsf.Dom.html('td.print-date    > div', table, this.getDispValue('StartDate__c'));          // 予定日
    teasp.Tsf.Dom.html('td.print-content > div', table, this.getDispValue('Content__c'));            // 内容

    this.appendAssist(tbody, 2);

    return table;
};

/**
 * 仮払申請の基本情報
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputBase4 = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-base print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('tf10002150')) } // 基本情報
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 12 }, tr));

    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tk10004320'  , vStyle: 'print-title'  , vSpan:11, value: '' }] }] }); // 件名
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tk10000814'  , vStyle: 'print-account', vSpan:11, value: '' }] }] }); // 取引先
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'job_label'   , vStyle: 'print-job'    , vSpan:11, value: '' }] }] }); // ジョブ
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10006100'  , vStyle: 'print-date'   , vSpan:11, value: '' }] }] }); // 申請日
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000850'  , vStyle: 'print-content', vSpan:11, value: '' }] }] }); // 内容

    teasp.Tsf.Dom.html('td.print-title   > div', table, this.getDispValue('Title__c'));              // 件名
    teasp.Tsf.Dom.html('td.print-account > div', table, this.getDispValue('AccountName__c'));        // 取引先
    teasp.Tsf.Dom.html('td.print-job     > div', table, this.getDispValue('ChargeJobId__c'));        // ジョブ
    teasp.Tsf.Dom.html('td.print-date    > div', table, this.getDispValue('StartDate__c'));          // 申請日
    teasp.Tsf.Dom.html('td.print-content > div', table, this.getDispValue('Content__c'));            // 内容

    this.appendAssist(tbody, 2);

    return table;
};

/**
 * 出張手配の入力値
 */
teasp.Tsf.FormExpPrint.prototype.getJtbValues = function(){
	//return window.opener.tsfManager.form.objBase.obj.ExpJsNavi__r || [];
	return this.objBase.obj.ExpJsNavi__r || [];
};

/**
 * 出張手当・宿泊手当の入力値
 * @return {Array.<Object>}
 */
teasp.Tsf.FormExpPrint.prototype.getAllowanceValues = function(){
    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionAllowance);
    return this.objBase.getSectionValues(sp.getDiscernment());
};

/**
 * 手配回数券の入力値
 * @return {Array.<Object>}
 */
teasp.Tsf.FormExpPrint.prototype.getCouponValues = function(){
    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionCoupon);
    return this.objBase.getSectionValues(sp.getDiscernment());
};

/**
 * 手配チケットの入力値
 * @return {Array.<Object>}
 */
teasp.Tsf.FormExpPrint.prototype.getTicketValues = function(){
    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionTicket);
    return this.objBase.getSectionValues(sp.getDiscernment());
};

/**
 * 仮払申請の入力値
 * @return {Object}
 */
teasp.Tsf.FormExpPrint.prototype.getProvisionValues = function(flag){
    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionProvisional);
    var o = {
        payDate                          : this.getDispValue('ExpectedPayDate__c'              , sp), // 仮払希望日
        provisionalPaymentApplication    : this.getDispValue('ProvisionalPaymentApplication__c', sp), // 仮払申請内容
        provisionalPaymentAmount         : this.getDispValue('ProvisionalPaymentAmount__c'     , sp)  // 仮払支払額
    };
    o.valid = ((flag && o.payDate) || (!flag && o.provisionalPaymentApplication)) && o.provisionalPaymentAmount;
    return o;
};

/**
 * 社員立替交通費の入力値
 * @return {Array.<Object>}
 */
teasp.Tsf.FormExpPrint.prototype.getDetailValues = function(){
    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionDetail);
    return this.objBase.getSectionValues(sp.getDiscernment());
};

/**
 * 出張手配
 *
 * @param {Object} area
 * @param {Array.<ExpJsNavi__r>} values
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputJtb = function(area, values){
    var table = this.getDomHelper().create('table', { className: 'print-jtb print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('jt12000060')) } // 出張手配明細
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 4, style: 'border-bottom:0;' }, tr));

    // 手配予定金額、手配金額を表示
    var tr0 = this.getDomHelper().create('tr', null, tbody);
    var td0 = this.getDomHelper().create('td', { colSpan: 6, style: 'border:0;' }, tr0);
    var table1 = this.getDomHelper().create('table', { className: 'print-sum print-tops', style: 'margin-bottom:2px;' }, td0);
    var tbody1 = this.getDomHelper().create('tbody', null, table1);
    var tr1 = this.getDomHelper().create('tr', null, tbody1);

    //var sp1 = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionJtb);

    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('jt12000110') }, this.getDomHelper().create('td', { className: 'print-col-c', style: 'width:120px; text-align:right;' }, tr1));
    this.getDomHelper().create('div', { className: 'planned-amount', innerHTML: teasp.Tsf.Currency.formatMoney(this.objBase.obj.PlannedAmount__c, teasp.Tsf.Currency.V_YEN, false, true) }, this.getDomHelper().create('td', { className: 'print-content' }, tr1));
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('jt12000120') }, this.getDomHelper().create('td', { className: 'print-col-c', style: 'width:120px; text-align:right;' }, tr1));
    this.getDomHelper().create('div', { className: 'actual-amount', innerHTML: teasp.Tsf.Currency.formatMoney('0', teasp.Tsf.Currency.V_YEN, false, true) }, this.getDomHelper().create('td', { className: 'print-content' }, tr1));

    var tr = this.getDomHelper().create('tr', { className: 'print-head' }, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('date_head')}       , this.getDomHelper().create('td', { className: 'print-jtb-c1', style:'min-width:80px;' }, tr)); // 日付
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('jt12000090')}      , this.getDomHelper().create('td', { className: 'print-jtb-c2' }, tr)); // 交通機関名
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('status_btn_title')}, this.getDomHelper().create('td', { className: 'print-jtb-c3' }, tr)); // ステータス
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000950')}      , this.getDomHelper().create('td', { className: 'print-jtb-c4' }, tr)); // 金額
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000850')}      , this.getDomHelper().create('td', { className: 'print-jtb-c5' }, tr)); // 内容
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('expNote_head')}    , this.getDomHelper().create('td', { className: 'print-jtb-c6' }, tr)); // 備考

    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionJtb);
    var actualCost = 0;

    if(!values.length){
        var tr = this.getDomHelper().create('tr', null, tbody);
        for(var i = 0 ; i < 6 ; i++){
            var o = (!i ? { style:'min-width:80px;' } : null);
            this.getDomHelper().create('div', { innerHTML: '&nbsp;' }, this.getDomHelper().create('td', o, tr));
        }
    } else{
        for(var i = 0 ; i < values.length ; i++){
            var tr = this.getDomHelper().create('tr', null, tbody);
            var v = values[i];
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('Date__c'     , sp, v) }, this.getDomHelper().create('td', { className: 'print-date' }, tr)); // 日付
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('Transport__c', sp, v) }, this.getDomHelper().create('td', null, tr)); // 交通機関名
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('Status__c'   , sp, v) }, this.getDomHelper().create('td', null, tr)); // ステータス
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('Cost__c'     , sp, v) }, this.getDomHelper().create('td', { className: 'print-right'   }, tr)); // 金額
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('Content__c'  , sp, v) }, this.getDomHelper().create('td', null, tr)); // 内容
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('Note__c'     , sp, v) }, this.getDomHelper().create('td', null, tr)); // 備考
            actualCost += teasp.Tsf.util.parseInt(this.getDispValue('Cost__c'     , sp, v).replace(/\\/g, "").split(",").join(""));
        }
        var node = teasp.Tsf.Dom.node('div.actual-amount', area);
        node.innerHTML = teasp.Tsf.Currency.formatMoney(actualCost, teasp.Tsf.Currency.V_YEN, false, true);
    }

    return table;
};

/**
 * 出張手当・宿泊手当
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputAllowance = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-btpd print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('tf10002180')) } // 出張手当・宿泊手当
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 4 }, tr));

    var tr = this.getDomHelper().create('tr', { className: 'print-head' }, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('date_head')  }, this.getDomHelper().create('td', { className: 'print-btpd-c1' }, tr)); // 日付
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000890') }, this.getDomHelper().create('td', { className: 'print-btpd-c2' }, tr)); // 出張手当
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000900') }, this.getDomHelper().create('td', { className: 'print-btpd-c3' }, tr)); // 宿泊手当
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('expNote_head')  }, this.getDomHelper().create('td', { className: 'print-btpd-c4' }, tr)); // 備考

    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionAllowance);
    var values = this.objBase.getSectionValues(sp.getDiscernment());
    console.log(values);
    for(var i = 0 ; i < values.length ; i++){
        var tr = this.getDomHelper().create('tr', null, tbody);
        var v = values[i];
        this.getDomHelper().create('div', { innerHTML: this.getDispValue('Date__c'           , sp, v) }, this.getDomHelper().create('td', { className: 'print-date' }, tr)); // 日付
        this.getDomHelper().create('div', { innerHTML: this.getDispValue('AllowanceItemId__c', sp, v) }, this.getDomHelper().create('td', null, tr)); // 出張手当
        this.getDomHelper().create('div', { innerHTML: this.getDispValue('HotelItemId__c'    , sp, v) }, this.getDomHelper().create('td', null, tr)); // 宿泊手当
        this.getDomHelper().create('div', { innerHTML: this.getDispValue('Note__c'           , sp, v) }, this.getDomHelper().create('td', null, tr)); // 備考
    }

    return table;
};

/**
 * 手配回数券
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputCoupon = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-coupon print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('tf10002190')) } // 手配回数券
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 4 }, tr));

    var tr = this.getDomHelper().create('tr', { className: 'print-head' }, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000910') }, this.getDomHelper().create('td', { className: 'print-coupon-c1' }, tr)); // 乗車日
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000920') }, this.getDomHelper().create('td', { className: 'print-coupon-c2' }, tr)); // 回数券種別
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000930') }, this.getDomHelper().create('td', { className: 'print-coupon-c3' }, tr)); // 枚数
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('expNote_head')  }, this.getDomHelper().create('td', { className: 'print-coupon-c4' }, tr)); // 備考

    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionCoupon);
    var values = this.objBase.getSectionValues(sp.getDiscernment());
    if(!values.length){
        // 空行表示
        var tr = this.getDomHelper().create('tr', null, tbody);
        for(var i = 0 ; i < 4 ; i++){
            this.getDomHelper().create('div', { innerHTML: '&nbsp;' }, this.getDomHelper().create('td', null, tr));
        }
    }else{
        for(var i = 0 ; i < values.length ; i++){
            var tr = this.getDomHelper().create('tr', null, tbody);
            var v = values[i];
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('couponDate'    , sp, v) }, this.getDomHelper().create('td', { className: 'print-date' }, tr)); // 乗車日
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('couponName'    , sp, v) }, this.getDomHelper().create('td', null, tr)); // 回数券種別
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('couponQuantity', sp, v) }, this.getDomHelper().create('td', { className: 'print-right' }, tr)); // 枚数
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('couponNote'    , sp, v) }, this.getDomHelper().create('td', null, tr)); // 備考
        }
    }

    return table;
};

/**
 * 手配チケット
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputTicket = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-ticket print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('tf10002210')) } // 手配チケット
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 7 }, tr));

    var tr = this.getDomHelper().create('tr', { className: 'print-head' }, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000910') }, this.getDomHelper().create('td', { className: 'print-ticket-c1' }, tr)); // 乗車日
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10001060') }, this.getDomHelper().create('td', { className: 'print-ticket-c2' }, tr)); // 区間
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10001070') }, this.getDomHelper().create('td', { className: 'print-ticket-c3', colSpan: 3 }, tr)); // 希望列車名/便名
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10001080') }, this.getDomHelper().create('td', { className: 'print-ticket-c4' }, tr)); // 希望席
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('expNote_head')  }, this.getDomHelper().create('td', { className: 'print-ticket-c5' }, tr)); // 備考

    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionTicket);
    var values = this.objBase.getSectionValues(sp.getDiscernment());
    if(!values.length){
        var tr = this.getDomHelper().create('tr', null, tbody);
        for(var i = 0 ; i < 7 ; i++){
            this.getDomHelper().create('div', { innerHTML: '&nbsp;' }, this.getDomHelper().create('td', null, tr));
        }
    }else{
        for(var i = 0 ; i < values.length ; i++){
            var tr = this.getDomHelper().create('tr', null, tbody);
            var v = values[i];
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('ticketDate'    , sp, v) }, this.getDomHelper().create('td', { className: 'print-date' }, tr)); // 乗車日
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('ticketRoute'   , sp, v) }, this.getDomHelper().create('td', null, tr)); // 区間
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('ticketRequest1', sp, v) }, this.getDomHelper().create('td', { className: 'print-ticket-c31' }, tr)); // 第1希望
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('ticketRequest2', sp, v) }, this.getDomHelper().create('td', { className: 'print-ticket-c31' }, tr)); // 第2希望
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('ticketRequest3', sp, v) }, this.getDomHelper().create('td', { className: 'print-ticket-c31' }, tr)); // 第3希望
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('ticketSeat'    , sp, v) }, this.getDomHelper().create('td', null, tr)); // 希望席
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('ticketNote'    , sp, v) }, this.getDomHelper().create('td', null, tr)); // 備考
        }
    }

    return table;
};

/**
 * 海外出張
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputOversea = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-foreign print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('tf10001970')) } // 海外出張
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 4 }, tr));

    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000960', vStyle: 'print-foreign1' , vSpan: 1, value: '' },        // 現地受入部署
                                            { cStyle: 'print-col-c', msgId: 'tf10001010', vStyle: 'print-foreign6' , vSpan: 1, value: '' }] }] }); // 責任者名

    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000970', vStyle: 'print-foreign2' , vSpan: 1, value: '' },        // パスポート申請
                                            { cStyle: 'print-col-c', msgId: 'tf10001020', vStyle: 'print-foreign7' , vSpan: 1, value: '' }] }] }); // ビザ申請

    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000980', vStyle: 'print-foreign3' , vSpan: 1, value: '' },        // 健康診断実施
                                            { cStyle: 'print-col-c', msgId: 'tf10001030', vStyle: 'print-foreign8' , vSpan: 1, value: '' }] }] }); // 保険申請

    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10000990', vStyle: 'print-foreign4' , vSpan: 1, value: '' },        // 産業医への確認
                                            { cStyle: 'print-col-c', name : ''          , vStyle: null             , vSpan: 1, value: '' }] }] }); //

    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10001000', vStyle: 'print-foreign5' , vSpan: 1, value: '' },        // 渡航準備金申請
                                            { cStyle: 'print-col-c', name : ''          , vStyle: null             , vSpan: 1, value: '' }] }] }); //

    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionForeign);

    teasp.Tsf.Dom.html('td.print-foreign1 > div', table, this.getDispValue('OverseaOption1__c'   , sp)); // 現地受入部署
    teasp.Tsf.Dom.html('td.print-foreign2 > div', table, this.getDispValue('OverseaCheckList1__c', sp)); // パスポート申請
    teasp.Tsf.Dom.html('td.print-foreign3 > div', table, this.getDispValue('OverseaCheckList3__c', sp)); // 健康診断実施
    teasp.Tsf.Dom.html('td.print-foreign4 > div', table, this.getDispValue('OverseaCheckList4__c', sp)); // 産業医への確認
    teasp.Tsf.Dom.html('td.print-foreign5 > div', table, this.getDispValue('TravelAllowance__c'  , sp)); // 渡航準備金申請
    teasp.Tsf.Dom.html('td.print-foreign6 > div', table, this.getDispValue('OverseaOption2__c'   , sp)); // 責任者名
    teasp.Tsf.Dom.html('td.print-foreign7 > div', table, this.getDispValue('OverseaCheckList2__c', sp)); // ビザ申請
    teasp.Tsf.Dom.html('td.print-foreign8 > div', table, this.getDispValue('OverseaCheckList5__c', sp)); // 保険申請

    return table;
};

/**
 * 仮払い申請
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputProvision = function(area, flag){
    var table = this.getDomHelper().create('table', { className: 'print-provis print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('tf10002200')) } // 仮払い申請
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 4 }, tr));

    if(flag){
        this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10006130', vStyle: 'print-date'  , vSpan: 1, value: '' },        // 仮払希望日
                                                { cStyle: 'print-col-c', msgId: 'tf10001050', vStyle: 'print-amount', vSpan: 1, value: '' }] }] }); // 仮払支払額
    }else{
        this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10001040', vStyle: 'print-content', vSpan: 1, value: '', rSpan: 2 }, // 仮払申請内容
                                                { cStyle: 'print-col-c', msgId: 'tf10006130', vStyle: 'print-date'   , vSpan: 1, value: '' }] },        // 仮払希望日
                                       { cells:[{ cStyle: 'print-col-c', msgId: 'tf10001050', vStyle: 'print-amount' , vSpan: 1, value: '' }] } ]});    // 仮払支払額
    }

    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionProvisional);

    teasp.Tsf.Dom.html('td.print-date > div', table, this.getDispValue('ExpectedPayDate__c', sp)); // 仮払希望日
    if(!flag){
        teasp.Tsf.Dom.html('td.print-content > div', table, this.getDispValue('ProvisionalPaymentApplication__c', sp)); // 仮払申請内容
    }
    teasp.Tsf.Dom.html('td.print-amount  > div', table, this.getDispValue('ProvisionalPaymentAmount__c'     , sp)); // 仮払支払額

    return table;
};

/**
 * 社員立替交通費
 * ※ 現在は outputDetail2 の方を使っている。
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputDetail = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-detail print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    var t = teasp.message.getLabel('tf10006410', teasp.message.getLabel(!this.formType ? 'empExp_caption' : 'tf10002160')); // 経費精算 or 社員立替交通費
    if(this.expenseType){
        t += teasp.message.getLabel('ci00000210', this.expenseType); // （精算区分：{0}）
    }
    this.getDomHelper().create('div', { innerHTML: t }
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 6 }, tr));

    var tr = this.getDomHelper().create('tr', { className: 'print-head' }, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000940')  }, this.getDomHelper().create('td', { className: 'print-detail-c1' }, tr)); // 利用日
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('expItem_head')}, this.getDomHelper().create('td', { className: 'print-detail-c2' }, tr)); // 費目
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000850')  }, this.getDomHelper().create('td', { className: 'print-detail-c3' }, tr)); // 内容
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000950')  }, this.getDomHelper().create('td', { className: 'print-detail-c4' }, tr)); // 金額
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('job_label')   }, this.getDomHelper().create('td', { className: 'print-detail-c5' }, tr)); // ジョブ
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('expNote_head')   }, this.getDomHelper().create('td', { className: 'print-detail-c6' }, tr)); // 備考

    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionDetail);
    var values = this.objBase.getSectionValues(sp.getDiscernment());
    if(!values.length){
        var tr = this.getDomHelper().create('tr', null, tbody);
        for(var i = 0 ; i < 6 ; i++){
            this.getDomHelper().create('div', { innerHTML: '&nbsp;' }, this.getDomHelper().create('td', null, tr));
        }
    }else{
        for(var i = 0 ; i < values.length ; i++){
            var tr = this.getDomHelper().create('tr', null, tbody);
            var v = values[i];
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('Date__c'      , sp, v) }, this.getDomHelper().create('td', { className: 'print-date' }, tr)); // 利用日
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('ExpItemId__c' , sp, v) }, this.getDomHelper().create('td', null, tr)); // 費目
            var div = this.getDomHelper().create('div', { className: 'ts-form-route'                 }, this.getDomHelper().create('td', { className: 'ts-form-route' }, tr)); // 内容
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('Cost__c'      , sp, v) }, this.getDomHelper().create('td', { className: 'print-right'   }, tr)); // 金額
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('JobId__c'     , sp, v) }, this.getDomHelper().create('td', null, tr)); // ジョブ
            this.getDomHelper().create('div', { innerHTML: this.getDispValue('Detail__c'    , sp, v) }, this.getDomHelper().create('td', null, tr)); // 備考
            teasp.Tsf.Dom.append(div, this.getExpContent(v));
        }
    }

    return table;
};
/**
 * 日付＋ジョブでグルーピングした明細リストを作成
 * 下記構造のオブジェクトを返す
 * {
 *  dates <Array.<Object>>         日付の配列
 *      date <string>              'yyyy-MM-dd'
 *  dmap <Object>
 *     jobs <Array.<Object>>       jobId の配列（nullの場合、'(null)'をセット）
 *         DeptCode__c <string>    ジョブコード
 *         Name <string>           ジョブ名
 *     jobMap <Object>
 *         lines <Array.<Object>>  明細の配列
 *             明細情報
 *     vSpan <number>              1日分を表示するのに必要な行数
 * }
 * @param values
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.getGroupingDetails = function(values){
    var dates = [];
    var dmap = {};
    for(var i = 0 ; i < values.length ; i++){
        var o = values[i];
        if(!dmap[o.Date__c]){
            dmap[o.Date__c] = { jobs:[], jobMap:{} };
            dates.push({ date:o.Date__c });
        }
        var dm = dmap[o.Date__c];
        var jobId = o.JobId__c || '(null)';
        if(!dm.jobMap[jobId]){
            dm.jobMap[jobId] = { lines:[] };
            var job = o.JobId__r || {};
            job.jobId = jobId;
            dm.jobs.push(job);
        }
        var jm = dm.jobMap[jobId];
        jm.lines.push(o);
    }
    for(var i = 0 ; i < dates.length ; i++){
        var d = dates[i];
        var dm = dmap[d.date];
        var n = 0;
        for(var j = 0 ; j < dm.jobs.length ; j++){
            var jm = dm.jobMap[dm.jobs[j].jobId];
            n += jm.lines.length + 2;
        }
        dm.vSpan = n;
    }
    return {
        dates: dates,
        dmap : dmap
    };
};

/**
 * 申請関連のすべての添付ファイルのリスト
 * @returns {Array.<Object>}
 */
teasp.Tsf.FormExpPrint.prototype.getAllAttachs = function(){
    var attachs = [];
    var sn = 0;
    var p = this.objBase.getAttachments() || [];
    for(var h = 0 ; h < p.length ; h++){
        attachs.push({
            sn      : ++sn,
            target  : null,
            attach  : p[h]
        });
    }
    // 明細単位の添付ファイル
    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionDetail);
    var values = this.objBase.getSectionValues(sp.getDiscernment());
    var o = this.getGroupingDetails(values); // 日付＋ジョブでグルーピングした明細リスト
    for(var i = 0 ; i < o.dates.length ; i++){
        var d = o.dates[i];
        var dm = o.dmap[d.date];
        var n = 1;
        for(var j = 0 ; j < dm.jobs.length ; j++){
            var job = dm.jobs[j];
            var jm = dm.jobMap[job.jobId];
            for(var k = 0 ; k < jm.lines.length ; k++){
                var v = jm.lines[k];
                var p = v.Attachments || [];
                for(var h = 0 ; h < p.length ; h++){
                    attachs.push({
                        sn      : ++sn,
                        target  : teasp.util.date.formatDate(d.date, 'SLA') + '-' + n,
                        receipt : true,
                        attach  : p[h],
                        uber    : (v.Item__c == 'uber' && p[h].ContentType == 'text/html')
                    });
                }
                // 電帳法オプションON以降登録された領収書をSFFilesから取得
                const sfFiles = v.ContentDocumentLinks || [];
                for(var h = 0 ; h < sfFiles.length ; h++){
                    attachs.push({
                        sn      : ++sn,
                        target  : teasp.util.date.formatDate(d.date, 'SLA') + '-' + n,
                        receipt : true,
                        attach  : sfFiles[h]
                    });
                }
                n++;
            }
        }
    }
    return attachs;
};

/**
 * 経費精算の明細エリア
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputDetail2 = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-detail print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    var caption = ''; // 表題
    if(!this.formType){
        caption = teasp.message.getLabel('empExp_caption'); // 経費精算
    }else if(this.formType == 1){ // 出張・交通費申請
        caption = teasp.message.getLabel('tf10002160'); // 社員立替交通費
    }else{
        caption = teasp.message.getLabel('tf10002170'); // 経費内容
    }
    var t = teasp.message.getLabel('tf10006410', caption);
    if(this.expenseType){
        t += teasp.message.getLabel('ci00000210', this.expenseType); // （精算区分：{0}）
    }
    this.getDomHelper().create('div', { innerHTML: t }
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 7 }, tr));

    var tr = this.getDomHelper().create('tr', { className: 'print-head' }, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000940')  }, this.getDomHelper().create('td', { className: 'print-detail-c1' , colSpan: 2 }, tr)); // 利用日
    this.getDomHelper().create('div', { innerHTML: '#'                                   }, this.getDomHelper().create('td', { className: 'print-detail-c2s' }, tr)); // #
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('expItem_head')}, this.getDomHelper().create('td', { className: 'print-detail-c2'  }, tr)); // 費目
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000850')  }, this.getDomHelper().create('td', { className: 'print-detail-c3'  }, tr)); // 内容
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10000950')  }, this.getDomHelper().create('td', { className: 'print-detail-c4'  }, tr)); // 金額
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('expNote_head')   }, this.getDomHelper().create('td', { className: 'print-detail-c6'  }, tr)); // 備考

    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionDetail);
    var values = this.objBase.getSectionValues(sp.getDiscernment());
    if(!values.length){
        var tr = this.getDomHelper().create('tr', null, tbody);
        for(var i = 0 ; i < 7 ; i++){
            var o = (!i ? { style:'min-width:80px;' } : null);
            this.getDomHelper().create('div', { innerHTML: '&nbsp;' }, this.getDomHelper().create('td', o, tr));
        }
    }else{
        var o = this.getGroupingDetails(values); // 日付＋ジョブでグルーピングした明細リスト
        var total = 0;
        var isIE = (dojo.isIE || window.navigator.userAgent.toLowerCase().indexOf('trident') >= 0); // IEかどうかの判定
        for(var i = 0 ; i < o.dates.length ; i++){
            var d = o.dates[i];
            var dm = o.dmap[d.date];
            var n = 1;
            //------------------------------------------------------------------
            // IEで、印刷すると複数ページになる場合、2ページ目以降の罫線が消えることがある現象に対応
            // するため、処理を分岐して日付・曜日のセルに rowSpan 属性を使わない方法で出力する。
            // (#5243 の対応)
            //------------------------------------------------------------------
            if(isIE){ // ブラウザがIEである ------------------------------------
                var pd1 = teasp.util.date.formatDate(d.date, 'SLA');
                var pd2 = teasp.util.date.formatDate(d.date, 'JPW');
                for(var j = 0 ; j < dm.jobs.length ; j++){
                    var job = dm.jobs[j];
                    var jm = dm.jobMap[job.jobId];
                    var tr = this.getDomHelper().create('tr', null, tbody);
                    var jobName = ((job.JobCode__c || '') + ' ' + (job.Name || '')).trim();
                    var borderS = 'border-bottom:none;' + (j > 0 ? 'border-top:none;' : '');
                    this.getDomHelper().create('div', { innerHTML: jobName ? pd1 : '' }, this.getDomHelper().create('td', { style:'text-align:center;' + borderS }, tr)); // 利用日
                    this.getDomHelper().create('div', { innerHTML: jobName ? pd2 : '' }, this.getDomHelper().create('td', { style:'text-align:center;' + borderS }, tr)); // 利用日（曜日）
                    this.getDomHelper().create('div', { innerHTML: jobName }, this.getDomHelper().create('td', { colSpan: 5 }, tr)); // ジョブ名
                    if(jobName){
                        pd1 = pd2 = '';
                    }
                    var cost = 0; // 小計
                    for(var k = 0 ; k < jm.lines.length ; k++){
                        var v = jm.lines[k];
                        tr = this.getDomHelper().create('tr', null, tbody);
                        this.getDomHelper().create('div', { innerHTML: pd1 }, this.getDomHelper().create('td', { style:'text-align:center;border-bottom:none;border-top:none;' }, tr)); // 利用日
                        this.getDomHelper().create('div', { innerHTML: pd2 }, this.getDomHelper().create('td', { style:'text-align:center;border-bottom:none;border-top:none;' }, tr)); // 利用日（曜日）
                        pd1 = pd2 = '';
                        this.getDomHelper().create('div', { innerHTML: (n++) }, this.getDomHelper().create('td', { style: 'text-align:right;' }, tr)); // #
                        this.getDomHelper().create('div', { innerHTML: this.getDispValue('ExpItemId__c', sp, v) }, this.getDomHelper().create('td', null, tr)); // 費目
                        var div = this.getDomHelper().create('div', { className: 'ts-form-route' }, this.getDomHelper().create('td', { className: 'ts-form-route' }, tr)); // 内容
                        this.getDomHelper().create('div', { innerHTML: this.getDispValue('Cost__c'     , sp, v) }, this.getDomHelper().create('td', { className: 'print-right' }, tr)); // 金額
                        this.getDomHelper().create('div', { innerHTML: this.getDispValue('Detail__c'   , sp, v) }, this.getDomHelper().create('td', null, tr)); // 備考
                        teasp.Tsf.Dom.append(div, this.getExpContent(v));
                        cost  += (v.Cost__c || 0);
                        total += (v.Cost__c || 0);
                    }
                    tr = this.getDomHelper().create('tr', null, tbody);
                    borderS = 'border-top:none;' + (j < (dm.jobs.length - 1) ? 'border-bottom:none;' : '');
                    this.getDomHelper().create('td', { style:'text-align:center;' + borderS }, tr); // 利用日
                    this.getDomHelper().create('td', { style:'text-align:center;' + borderS }, tr); // 利用日（曜日）
                    this.getDomHelper().create('div', {
                        innerHTML: teasp.message.getLabel('tm30001050') // 小計
                    }, this.getDomHelper().create('td', { className: 'print-total', colSpan:3 }, tr));
                    this.getDomHelper().create('div', {
                        innerHTML: teasp.Tsf.Currency.formatMoney(cost, teasp.Tsf.Currency.V_YEN, false, true)  // 小計金額
                    }, this.getDomHelper().create('td', { className: 'print-right' }, tr));
                    this.getDomHelper().create('td', null, tr);
                }
            }else{ // ブラウザがIE以外 -------------------------------------
                var tr = this.getDomHelper().create('tr', null, tbody);
                this.getDomHelper().create('div', { innerHTML: teasp.util.date.formatDate(d.date, 'SLA') }
                    , this.getDomHelper().create('td', { rowSpan:dm.vSpan, style:'text-align:center;' }, tr)); // 利用日
                this.getDomHelper().create('div', { innerHTML: teasp.util.date.formatDate(d.date, 'JPW') }
                    , this.getDomHelper().create('td', { rowSpan:dm.vSpan, style:'text-align:center;' }, tr)); // 利用日（曜日）
                for(var j = 0 ; j < dm.jobs.length ; j++){
                    var job = dm.jobs[j];
                    var jm = dm.jobMap[job.jobId];
                    if(j > 0){
                        tr = this.getDomHelper().create('tr', null, tbody);
                    }
                    var jobName = (job.JobCode__c || '') + ' ' + (job.Name || '');
                    this.getDomHelper().create('div', { innerHTML: jobName }, this.getDomHelper().create('td', { colSpan: 5 }, tr)); // ジョブ名
                    var cost = 0; // 小計
                    for(var k = 0 ; k < jm.lines.length ; k++){
                        var v = jm.lines[k];
                        tr = this.getDomHelper().create('tr', null, tbody);
                        this.getDomHelper().create('div', { innerHTML: (n++) }, this.getDomHelper().create('td', { style: 'text-align:right;' }, tr)); // #
                        this.getDomHelper().create('div', { innerHTML: this.getDispValue('ExpItemId__c', sp, v) }, this.getDomHelper().create('td', null, tr)); // 費目
                        var div = this.getDomHelper().create('div', { className: 'ts-form-route' }, this.getDomHelper().create('td', { className: 'ts-form-route' }, tr)); // 内容
                        this.getDomHelper().create('div', { innerHTML: this.getDispValue('Cost__c'     , sp, v) }, this.getDomHelper().create('td', { className: 'print-right' }, tr)); // 金額
                        this.getDomHelper().create('div', { innerHTML: this.getDispValue('Detail__c'   , sp, v) }, this.getDomHelper().create('td', null, tr)); // 備考
                        teasp.Tsf.Dom.append(div, this.getExpContent(v));
                        cost  += (v.Cost__c || 0);
                        total += (v.Cost__c || 0);
                    }
                    tr = this.getDomHelper().create('tr', null, tbody);
                    this.getDomHelper().create('div', {
                        innerHTML: teasp.message.getLabel('tm30001050') // 小計
                    }, this.getDomHelper().create('td', { className: 'print-total', colSpan:3 }, tr));
                    this.getDomHelper().create('div', {
                        innerHTML: teasp.Tsf.Currency.formatMoney(cost, teasp.Tsf.Currency.V_YEN, false, true)  // 小計金額
                    }, this.getDomHelper().create('td', { className: 'print-right' }, tr));
                    this.getDomHelper().create('td', null, tr);
                }
            }
            //------------------------------------------------------------------
            // (#5243 の対応おわり)
            //------------------------------------------------------------------
        }
        var tr = this.getDomHelper().create('tr', null, tbody);
        this.getDomHelper().create('div', {
            innerHTML: teasp.message.getLabel('total_label') // 合計
        }, this.getDomHelper().create('td', { className: 'print-total', colSpan:5 }, tr));
        this.getDomHelper().create('div', {
            innerHTML: teasp.Tsf.Currency.formatMoney(total, teasp.Tsf.Currency.V_YEN, false, true)  // 合計金額
        }, this.getDomHelper().create('td', { className: 'print-right' }, tr));
        this.getDomHelper().create('td', null, tr);
    }
    return table;
};

/**
 * 事前申請情報
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputExpPre = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-base print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('tf10006060')) } // 事前申請情報
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 6 }, tr));

    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10001100'  , vStyle: 'print-applyNo'  , vSpan: 2, value: '' }         // 事前申請番号
                                          , { cStyle: 'print-col-c', msgId: 'tk10000262'  , vStyle: 'print-type'     , vSpan: 2, value: '' }] }] }); // 種別
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tk10004320'  , vStyle: 'print-title'    , vSpan: 5, value: '' }] }] }); // 件名
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tf10001110'  , vStyle: 'print-total'    , vSpan: 2, value: '' }         // 合計金額
                                          , { cStyle: 'print-col-c', msgId: 'tf10001050'  , vStyle: 'print-provis'   , vSpan: 2, value: '' }] }] }); // 仮払金額

    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionExpHead);
    teasp.Tsf.Dom.html('td.print-applyNo > div', table, this.getDispValue('ExpPreApplyId__r.ExpPreApplyNo__c'           , sp)); // 申請No
    teasp.Tsf.Dom.html('td.print-type    > div', table, this.getDispValue('ExpPreApplyId__r.Type__c'                    , sp)); // 種別
    teasp.Tsf.Dom.html('td.print-title   > div', table, this.getDispValue('ExpPreApplyId__r.Title__c'                   , sp)); // 件名
    teasp.Tsf.Dom.html('td.print-total   > div', table, this.getDispValue('ExpPreApplyId__r.TotalAmount__c'             , sp)); // 合計金額
    teasp.Tsf.Dom.html('td.print-provis  > div', table, this.getDispValue('ExpPreApplyId__r.ProvisionalPaymentAmount__c', sp)); // 仮払金額

    var formType = this.objBase.expPreApply ? this.objBase.expPreApply.obj.Type__c : null
    if(tsfManager.isUsingJsNaviSystem() && formType == teasp.constant.EXP_PRE_FORM1) {
        sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionExpHeadJtb);

        this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'jt13000080'  , vStyle: 'print-jtbpre'   , vSpan: 2, value: '' }         // 内 手配予定金額
                                              , { cStyle: 'print-col-c', msgId: 'jt13000090'  , vStyle: 'print-jtbact'   , vSpan: 2, value: '' }] }] }); // 手配実績金額

        teasp.Tsf.Dom.html('td.print-jtbpre  > div', table, this.getDispValue('ExpPreApplyId__r.PlannedAmount__c'           , sp));      // 内 手配予定金額

        // J'sNAVI Jr手配実績金額集計
        var jtb      = 0;
        var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionDetail);
        var lines = this.objBase.getSectionValues(sp.getDiscernment());
        for(var i = 0 ; i < lines.length ; i++){
            var o = lines[i];
            var n = teasp.Tsf.util.parseInt(o.Cost__c) || 0;
            if(o.Item__c == 'JTB'){  // J'sNAVI Jr実績明細
                jtb += n;
            }
        }

        teasp.Tsf.Dom.html('td.print-jtbact  > div', table, teasp.Tsf.Currency.formatMoney(jtb, teasp.Tsf.Currency.V_YEN, false, true)); // 手配実績金額
    }

    return table;
};

/**
 * 稟議情報
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputRingi = function(area){
    var table = this.getDomHelper().create('table', { className: 'print-base print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('tk10004350')) } // この経費に関連する稟議
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 6 }, tr));

    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tk10004310'  , vStyle: 'print-applyNo'  , vSpan: 2, value: '' }         // 申請No
                                          , { cStyle: 'print-col-c', msgId: 'tk10000262'  , vStyle: 'print-type'     , vSpan: 2, value: '' }] }] }); // 種別
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-c', msgId: 'tk10004320'  , vStyle: 'print-title'    , vSpan: 5, value: '' }] }] }); // 件名

    var sp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionExpRingi);
    teasp.Tsf.Dom.html('td.print-applyNo > div', table, this.getDispValue('ApplyId__r.ApplicationNo__c', sp)); // 申請No
    teasp.Tsf.Dom.html('td.print-type    > div', table, this.getDispValue('ApplyId__r.Type__c', sp));          // 種別
    teasp.Tsf.Dom.html('td.print-title   > div', table, this.getDispValue('ApplyId__r.Name', sp));             // 件名

    return table;
};

/**
 * 添付ファイル
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputAttach = function(area){
    var attachs = this.getAllAttachs(); // すべての添付ファイルのリスト
    if(!attachs.length){
        return null;
    }
    var table = this.getDomHelper().create('table', { className: 'print-attach print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('tk10000077')) } // 添付ファイル
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 3 }, tr));

    tr = this.getDomHelper().create('tr', { className: 'print-head' }, tbody);
    this.getDomHelper().create('div', { innerHTML: '#'                                  }, this.getDomHelper().create('td', { className: 'print-detail-c1' }, tr)); // #
    if(this.formType == 0){
        this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006700') }, this.getDomHelper().create('td', { className: 'print-detail-c2' }, tr)); // 添付先
    }
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006710') }, this.getDomHelper().create('td', { className: 'print-detail-c3' }, tr)); // ファイル名

    for(var i = 0 ; i < attachs.length ; i++){
        var a = attachs[i];
        tr = this.getDomHelper().create('tr', null, tbody);
        this.getDomHelper().create('div', { innerHTML: a.sn           }, this.getDomHelper().create('td', { className: 'print-no'     }, tr)); // #
        if(this.formType == 0){
            this.getDomHelper().create('div', { innerHTML: a.target || '-' }, this.getDomHelper().create('td', { className: 'print-target' }, tr)); // 添付先
        }
        var div = this.getDomHelper().create('div', null, this.getDomHelper().create('td', { className: 'print-fname' }, tr));
        if(teasp.Tsf.FormExpPrint.isImage(a.attach) || a.uber){
            // 電帳法オプションON以降登録された領収書
            if (a.attach.ContentDocumentId) {
                div.innerHTML = a.attach.ContentDocument.Title; // SFFiles名
            }
            else {
                div.innerHTML = a.attach.Name; // 添付ファイル名
            }
        }
        else{
            // 電帳法オプションON以降登録された領収書
            if (a.attach.ContentDocumentId) {
                this.getDomHelper().create('a', {
                    href      : '/sfc/servlet.shepherd/document/download/' + a.attach.ContentDocumentId,
                    innerHTML : a.attach.ContentDocument.Title,
                    target    : '_blank'
                }, div);
            }
            else {
                this.getDomHelper().create('a', {
                    href      : '/servlet/servlet.FileDownload?file=' + a.attach.Id,
                    innerHTML : a.attach.Name,
                    target    : '_blank'
                }, div);
            }
        }
    }
    return table;
};

/**
 * コメント
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputComment = function(area, flag){
    var table = this.getDomHelper().create('table', { className: 'print-comment print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10006410', teasp.message.getLabel('comment_head')) } // コメント
        , this.getDomHelper().create('td', { className: 'print-bar', colSpan: 1 }, tr));

    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('div', {
        innerHTML: teasp.Tsf.util.entitizg(this.objBase.getComment(), true)
    }, this.getDomHelper().create('td', null, tr)); // コメント

    return table;
};

/**
 * 最終更新日、最終更新者、申請日
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputAttr = function(area, flag){
    var table = this.getDomHelper().create('table', { className: 'print-attr print-bodys' }, area);
    var tbody = this.getDomHelper().create('tbody', null, table);

    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-a', msgId: 'lastApprovalDay_label', vStyle: 'print-lastd' , vSpan: 1, value: '' },        // 最終承認日：
                                            { cStyle: 'print-col-a', msgId: 'applicationDay_label' , vStyle: 'print-appld' , vSpan: 1, value: '' }] }] }); // 申請日：
    this.createCell(tbody, { rows:[{ cells:[{ cStyle: 'print-col-a', msgId: 'lastRecognizer_label' , vStyle: 'print-actor' , vSpan: 1, value: '' },        // 最終承認者：
                                            { cStyle: 'print-col-a', name:  ''                     , vStyle: null          , vSpan: 1, value: '' }] }] }); //

    teasp.Tsf.Dom.html('td.print-lastd > div', table, this.objBase.getLastApprovedTime());  // 最終承認日
    teasp.Tsf.Dom.html('td.print-appld > div', table, this.objBase.getApplyTime());         // 申請日
    teasp.Tsf.Dom.html('td.print-actor > div', table, this.objBase.getLastApprover());      // 最終承認者

    return table;
};

/**
 * 添付画像表示
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputImage = function(area, flag){
    if(!this.getImageList().length && !this.getReceiptImageList().length){
        return;
    }
    teasp.Tsf.Dom.style(area, 'textAlign', 'left');
    var div = this.getDomHelper().create('div', { className: 'print-image' }, area);
    var label = this.getDomHelper().create('label', null, div);
    var check = this.getDomHelper().create('input', { type: 'checkbox' }, label);
    this.getDomHelper().create('span' , { innerHTML: ' ' + teasp.message.getLabel('tf10000510') }, label); // 添付画像表示

    this.getDomHelper().connect(check, 'onclick', this, this.showImage);

    return div;
};

/**
 * 領収書貼付欄
 *
 * @param {Object} area
 * @returns {Object}
 */
teasp.Tsf.FormExpPrint.prototype.outputReceiptArea = function(){
    var area = teasp.Tsf.Dom.byId('attachExpView');
    var div = teasp.Tsf.Dom.nextSibling(area);
    if(!teasp.Tsf.Dom.hasClass(div, 'receipt-area')){
        div = this.getDomHelper().create('div', { className: 'upload-area receipt-area' }, area, 'after');
        var wak = this.getDomHelper().create('div', null, div); // 点線枠
        this.getDomHelper().create('div', { className: 'receipt-mark', innerHTML: teasp.message.getLabel('receiptPastingColumn') }, wak); // 領収書貼付欄
        this.getDomHelper().create('div', { id:'receiptsPlace' }, wak); // 領収書画像表示エリア
    }else{
        teasp.Tsf.Dom.empty(teasp.Tsf.Dom.byId('receiptsPlace'));
    }
    return div;
};

/**
 * 添付画像表示
 *
 * @param {Object} e
 */
teasp.Tsf.FormExpPrint.prototype.showImage = function(e){
    var check = teasp.Tsf.Dom.node('div.print-image input[type="checkbox"]', this.getArea());
    var area1 = teasp.Tsf.Dom.byId('attachExpView'); // 申請レベルの添付画像表示エリア
    var area2 = teasp.Tsf.Dom.byId('receiptsPlace'); // 明細の領収書画像表示エリア
    teasp.Tsf.Dom.show(area1, null, check.checked);
    this.getDomHelper().freeBy(this.IMAGE_EVENT_KEY);
    teasp.Tsf.Dom.empty(area2);
    if(!check.checked){
        return;
    }
    teasp.Tsf.Dom.empty(area1);

    // Uber領収書の添付ファイルのIdを集める
    var attachs = this.getReceiptImageList();
    var ubers = [];
    for(var i = 0 ; i < attachs.length ; i++){
        var attach = attachs[i];
        if(attach.ContentType == 'text/html' && !attach.body){ // Uber領収書ファイル
            ubers.push({
                Id  : attach.Id,
                pos : i
            });
        }
    }
    var index = 0;
    var aloop = null;
    aloop = teasp.Tsf.Dom.hitch(this, function(){
        // 添付ファイルの Id から Body を得る
        tsfManager.getAttachmentBody(ubers[index].Id, teasp.Tsf.Dom.hitch(this, function(succeed, result){
            if(succeed){
                var attach = attachs[ubers[index].pos];
                attach.body = result.body;
                if(++index < ubers.length){
                    aloop();
                }else{
                    this.showImage2();
                }
            }else{
                teasp.Tsf.Error.showError(result);
            }
        }));
    });
    if(ubers.length > 0){
        aloop();
    }else{
        this.showImage2();
    }
};

/**
 * 添付画像表示
 */
teasp.Tsf.FormExpPrint.prototype.showImage2 = function(){
    var area1 = teasp.Tsf.Dom.byId('attachExpView'); // 申請レベルの添付画像表示エリア
    var area2 = teasp.Tsf.Dom.byId('receiptsPlace'); // 明細の領収書画像表示エリア
    // 経費申請に添付される画像を表示
    var attachs = this.getImageList();
    for(var i = 0 ; i < attachs.length ; i++){
        var attach = attachs[i];
        this.getDomHelper().create('div', { innerHTML: attach.Name, className: 'image-name' }, area1);
        var img = this.getDomHelper().create('img', {
            src: '/servlet/servlet.FileDownload?file=' + attach.Id
          }, this.getDomHelper().create('div', { className: 'image-print' }, area1));
        this.getDomHelper().connect(img, 'onload', this, this.onLoadImage, this.IMAGE_EVENT_KEY);
    }
    // 経費明細に添付される領収書画像を表示
    attachs = this.getReceiptImageList();
    for(var i = 0 ; i < attachs.length ; i++){
        var attach = attachs[i];
        // 電帳法オプションON以降登録された領収書
        if (attach.ContentDocumentId) {
            this.getDomHelper().create('div', { innerHTML: attach.ContentDocument.Title, className: 'receipt-name' }, area2);

            const img = this.getDomHelper().create('img', {
                src: '/sfc/servlet.shepherd/document/download/' + attach.ContentDocumentId
              }, this.getDomHelper().create('div', { className: 'receipt-print' }, area2));
            this.getDomHelper().connect(img, 'onload', this, this.onLoadImage, this.IMAGE_EVENT_KEY);
        }
        else {
            this.getDomHelper().create('div', { innerHTML: attach.Name, className: 'receipt-name' }, area2);

            if(attach.body){
                var div = this.getDomHelper().create('div', { className: 'receipt-print' }, area2);
                div.appendChild(teasp.Tsf.Dom.toDom(attach.body));
            }else{
                var img = this.getDomHelper().create('img', {
                    src: '/servlet/servlet.FileDownload?file=' + attach.Id
                  }, this.getDomHelper().create('div', { className: 'receipt-print' }, area2));
                this.getDomHelper().connect(img, 'onload', this, this.onLoadImage, this.IMAGE_EVENT_KEY);
            }
        }
    }
};

/**
 * イメージ表示時処理
 * @param {Object} e
 */
teasp.Tsf.FormExpPrint.prototype.onLoadImage = function(e){
    var img = e.target;
    if(this.imageDisped || !img.width){
        return;
    }
    this.imageWidth  = img.width;
    this.imageHeight = img.height;
    var imgArea = e.target.parentNode;
    this.zoom = Math.floor((imgArea.offsetWidth / this.imageWidth) * 100);
    if(this.zoom > 100){
        this.zoom = 100;
    }
    if(this.isAttach() || this.imageWidth < 700){
        console.log('zoom=' + this.zoom);
        img.width  = this.imageWidth  * (this.zoom / 100);
        img.height = this.imageHeight * (this.zoom / 100);
    }else{
        img.style.width = '100%';
    }
};
