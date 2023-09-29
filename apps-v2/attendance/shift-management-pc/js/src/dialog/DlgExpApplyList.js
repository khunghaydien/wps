teasp.provide('teasp.dialog.ExpApplyList');
/**
 * 申請一覧ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.ExpApplyList = function(){
    this.widthHint = 760;
    this.heightHint = 250;
    this.id = 'dialogExpApplyList';
    this.title = teasp.message.getLabel('tm30003060') /*精算申請一覧*/;
    this.duration = 1;
    this.content = '<table border="0" cellpadding="0" cellspacing="0" style="width:738px;"><tr><td><table class="pane_table"><tbody><tr><td><table class="atk_r_table"><tr><td class="head" style="width: 28px;"><div></div></td><td class="head" style="width:100px;"><div id="expApply_expApplyNo_label"></div></td><td class="head" style="width:110px;"><div id="expApply_applyDate_label"></div></td><td class="head" style="width:200px;"><div id="expApply_applyDate_head"></div></td><td class="head" style="width: 80px;"><div id="expApply_rowCount_head"></div></td><td class="head" style="width:100px;"><div id="expApply_expCost_head"></div></td><td class="head" style="width:120px;"><div id="expApply_status_label"></div></td></tr></table></td></tr><tr style="height:1px;"><td></td></tr><tr><td><div class="atk_r_record_area" style="width:738px;height:140px;" id="expApplyListDiv"><table class="atk_r_record_table" id="expApplyListTable"><tbody></tbody></table></div></td></tr></tbody></table></td></tr><tr><td colspan="2" style="text-align:center;padding-top:16px;"><input type="button" class="pb_base pb_btn_ok" id="expApplyListOk" />&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" class="pb_base pb_btn_close" id="expApplyListCancel" /></td></tr></table>';
    this.cancelLink = {
        id       : 'expApplyListCancel',
        callback : this.hide
    };
    this.connectOk = null;
    this.eventHandles = [];
};

teasp.dialog.ExpApplyList.prototype = new teasp.dialog.Base();
/**
 * 画面生成
 * @override
 */
teasp.dialog.ExpApplyList.prototype.preStart = function(){
    //メッセージ埋め込み
    //innerHTML
    teasp.message.setLabelHtml('expApply_expApplyNo_label','expApplyNo_label'); /*申請番号*/
    teasp.message.setLabelHtml('expApply_applyDate_label','applyDate_label'); /*申請日*/
    teasp.message.setLabelHtml('expApply_applyDate_head','applyDate_head'); /*発生日*/
    teasp.message.setLabelHtml('expApply_rowCount_head','rowCount_head'); /*件数*/
    teasp.message.setLabelHtml('expApply_expCost_head','expCost_head'); /*金額*/
    teasp.message.setLabelHtml('expApply_status_label','status_label'); /*ステータス*/
    //title
    teasp.message.setLabelTitle('expApplyListCancel','close_btn_title'); /*閉じる*/
};


/**
 * 画面生成
 * @override
 */
teasp.dialog.ExpApplyList.prototype.preShow = function(){
    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    if(this.args.applyList.length > 0){
        this.eventHandles.push(dojo.connect(dojo.byId('expApplyListOk'), 'onclick', this, this.ok));
        dojo.byId('expApplyListOk').className   = 'pb_base pb_btn_ok';
    }else{
        dojo.byId('expApplyListOk').className   = 'pb_base pb_btn_ok_dis';
    }
    this.createTable(this.args.applyList, this.args.expApplyId);
    return true;
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.ExpApplyList.prototype.ok = function(){
    var id = null;
    var tbody = dojo.byId('expApplyListTable').getElementsByTagName('tbody')[0];
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var row = tbody.rows[i];
        var match = /expApply(.+)/.exec(row.id);
        if(row.cells[0].firstChild.checked && match){
            id = match[1];
            break;
        }
    }
    if(id){
        this.onfinishfunc(id);
        this.close();
    }
};

/**
 * 申請一覧を作成
 * @param {Array.<Object>} lst 申請オブジェクトの配列
 * @param {string} selectId 申請ID
 */
teasp.dialog.ExpApplyList.prototype.createTable = function(lst, selectId){
    var tbody = dojo.byId('expApplyListTable').getElementsByTagName('tbody')[0];
    while(tbody.firstChild){
        dojo.destroy(tbody.firstChild);
    }
    var ruler = dojo.byId('ruler1');
    ruler.style.fontSize = '13px';
    ruler.style.width = '661px';
    var divH = 0;
    var maxH = 140;
    var cnt = 0;
    var alst = [];
    for(var i = 0 ; i < lst.length ; i++){
        var o = lst[i];
        if(!teasp.constant.STATUS_CANCELS.contains(o.status) || o.expDetails.length > 0){
            alst.push(o);
        }
    }
    if(alst.length <= 0){
        var row = dojo.create('tr', null, tbody);
        var ss = teasp.message.getLabel('tm30003070') /*申請データはありません*/;
        dojo.create('div', { style: { margin:"4px" }, innerHTML: ss }, dojo.create('td', { style: { textAlign:"left", width:"738px" }, colspan: '7' }, row));
        divH += (ss.getExtent(ruler).height + 8);
    }else{
        for(var i = 0 ; i < alst.length ; i++){
            var o = alst[i];
            var row = dojo.create('tr', {
                id         : 'expApply' + o.id,
                className  : 'sele ' + (((cnt++) % 2) == 0 ? 'even' : 'odd'),
                style      : { cursor:"pointer" }
            }, tbody);
            this.eventHandles.push(dojo.connect(row, 'onclick'   , this, function(){ var _id = o.id; return function(){ this.clickRow(_id); }; }()));
            this.eventHandles.push(dojo.connect(row, 'ondblclick', this, function(){ this.dblclickRow(); }));
            var cell = dojo.create('td', { style: { width:"28px", textAlign:"center" } }, row);
            var inp = dojo.create('input', { type: 'radio', style: { margin:"4px" }, name: 'expApplyListRadio', id: 'expApplyListRadio' + (i + 1) }, cell);
            dojo.create('div', { innerHTML: o.expApplyNo    }, dojo.create('td', { style: { width:"100px", fontSize:"13px", textAlign:"center" } }, row));
            dojo.create('div', { innerHTML: teasp.util.date.formatDate(o.applyTime, 'SLA') }, dojo.create('td', { style: { width:"110px", fontSize:"13px", textAlign:"center" } }, row));
            dojo.create('div', { innerHTML: this.getSpanDate(o)  }, dojo.create('td', { style: { width:"200px", fontSize:"13px", textAlign:"center" } }, row));
            dojo.create('div', { innerHTML: teasp.message.getLabel('tm30003080',o.count) /*{0}件*/  }, dojo.create('td', { style: { width:"80px", fontSize:"13px", textAlign:"center" } }, row));
            dojo.create('div', { innerHTML: teasp.util.currency.formatMoney(o.totalCost, '&#165;#,##0') }, dojo.create('td', { style: { width:"100px", fontSize:"13px", textAlign:"center" } }, row));
            dojo.create('div', { innerHTML: o.status        }, dojo.create('td', { style: { width:"103px", fontSize:"13px", textAlign:"center" } }, row));
            divH += ('Z'.getExtent(ruler).height + 8);
            if(o.id == selectId){
                inp.checked = true;
            }
        }
    }
    var i = tbody.rows.length;
    while(i < 7 && divH < maxH){
        var row = dojo.create('tr', { className: (((cnt++) % 2) == 0 ? 'even' : 'odd') }, tbody);
        dojo.create('div', { style: { height:"20px" }, innerHTML: '' }, dojo.create('td', { colspan: '7' }, row));
        divH += 20;
    }
    if(divH > maxH){
        divH = maxH;
    }
    dojo.byId('expApplyListDiv').style.height = divH + 'px';
};

/**
 * 期間を表示用の文字列にする
 *
 * @param {Object} record 期間
 * @return {string} 文字列
 */
teasp.dialog.ExpApplyList.prototype.getSpanDate = function(record){
    if(teasp.util.date.compareDate(record.startDate, record.endDate) == 0){
        return teasp.util.date.formatDate(record.startDate, 'SLA');
    }
    return teasp.message.getLabel('tm10003590', teasp.util.date.formatDate(record.startDate, 'SLA'), teasp.util.date.formatDate(record.endDate, 'SLA')); // {0} ～ {1}
};

/**
 * 行選択時の処理
 *
 * @param {Object} id ノードID
 */
teasp.dialog.ExpApplyList.prototype.clickRow = function(id){
    dojo.byId('expApply' + id).cells[0].firstChild.checked = true;
};

/**
 * 行ダブルクリック時の処理
 *
 */
teasp.dialog.ExpApplyList.prototype.dblclickRow = function(){
    this.ok();
};
