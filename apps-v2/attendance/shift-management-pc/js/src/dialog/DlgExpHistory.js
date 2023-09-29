teasp.provide('teasp.dialog.ExpHistory');
/**
 * 駅探検索履歴ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.ExpHistory = function(){
    this.widthHint = 780;
    this.heightHint = 440;
    this.id = 'dialogExpHistory';
    this.title = teasp.message.getLabel('ekitanHistory_caption') /*交通費経路履歴*/;
    this.duration = 1;
    this.content = '<table class="ekitan_his_frame"><tr><td style="padding-top:10px;"><table class="head" style="width:760px;"><thead><tr><th class="chk" style="width:24px" ></th><th class="from" style="width:60px" id="expHist_from" ></th><th class="arrow" style="width:16px" ></th><th class="to" style="width:60px" id="expHist_to"></th><th class="cost" style="width:82px" id="expHist_cost"></th><th class="route" style="width:515px" id="expHist_route"></th></tr></thead></table></td></tr><tr style="height:1px;"><td></td></tr><tr><td><div class="scroll_area" style="width:758px;" id="expHistoryArea"><table class="data" style="width:756px;"><tbody id="expHistoryTableBody"></tbody></table></div></td></tr><tr><td style="padding-top:4px;"><table class="horiz" style="width:760px;"><tr><td style="width:254px;"></td><td style="width:124px;text-align:center;"><input type="button" class="pb_base pb_btn_select" id="expHistoryOk" /></td><td style="width:124px;text-align:center;"><input type="button" class="pb_base pb_btn_cancel" id="expHistoryCancel" /></td><td style="width:142px;"></td><td style="width:116px;"><div class="pp_base pp_logo_ekitan" style="text-align:right;" ></div></td></tr></table></td></tr></table>';
    this.okLink = {
        id       : 'expHistoryOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'expHistoryCancel',
        callback : this.hide
    };
    this.rowMin = 8;
    this.eventHandles = [];
//    this.routeHist;
};

teasp.dialog.ExpHistory.prototype = new teasp.dialog.Base();
/**
 * 画面生成
 * @override
 */
teasp.dialog.ExpHistory.prototype.preStart = function(){
    //メッセージ埋め込み
    //innerHTML
    teasp.message.setLabelHtml('expHist_from','tm20006010'); /*発*/
    teasp.message.setLabelHtml('expHist_to','tm20006020'); /*着*/
    teasp.message.setLabelHtml('expHist_cost','expCost_head'); /*金額*/
    teasp.message.setLabelHtml('expHist_route','route_head'); /*経路*/
    //TITLE
    teasp.message.setLabelTitle('expHistoryOk','select_btn_title'); /*選択*/
    teasp.message.setLabelTitle('expHistoryCancel','cancel_btn_title'); /*キャンセル*/

};
/**
 * 画面生成
 * @override
 */
teasp.dialog.ExpHistory.prototype.preShow = function(){
    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    var hists = this.pouch.getRouteHist();
    this.routeHist = [];
    for(var i = 0 ; i < hists.length ; i++){
        if(hists[i] != ''){
            var o = dojo.fromJson(hists[i]);
            if(!o.route || !o.searchKey || !o.route.lines){
                continue;
            }
            this.routeHist.push({
                obj     : o,
                expRoute: teasp.manager.routeHelper(o.route, i, false, 'History', 'expHistoryCost')
            });
        }
    }
    this.createBody();

    return true;
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.ExpHistory.prototype.ok = function(){
    var rowIndex = this.getSelectRowIndex();
    var histItem = (rowIndex >= 0 && rowIndex < this.routeHist.length) ? this.routeHist[rowIndex] : null;
    if(!histItem){
        return;
    }
    this.onfinishfunc({
        roundTrip   : false,
        searchKey   : histItem.obj.searchKey,
        route       : histItem.expRoute.getRoute()
    });
    this.close();
};

/**
 * 履歴表示エリア作成
 */
teasp.dialog.ExpHistory.prototype.createBody = function(){
    var tbody = dojo.byId('expHistoryTableBody');
    while(tbody.firstChild){
        dojo.destroy(tbody.firstChild);
    }

    var rowSize = (this.rowMin < this.routeHist.length ? this.routeHist.length : this.rowMin);

    for(var r = 0 ; r < rowSize ; r++){
        var histItem = (r < this.routeHist.length ? this.routeHist[r] : null);
        this.createRow(tbody, r, histItem);
    }
    // 突っ張り棒
    var row = dojo.create('tr', null, tbody);
    dojo.create('div', { style : { width:"24px", height:"1px" } }, dojo.create('td', null, row));
    dojo.create('div', { style : { width:"60px", height:"1px" } }, dojo.create('td', null, row));
    dojo.create('div', { style : { width:"16px", height:"1px" } }, dojo.create('td', null, row));
    dojo.create('div', { style : { width:"60px", height:"1px" } }, dojo.create('td', null, row));
    dojo.create('div', { style : { width:"82px", height:"1px" } }, dojo.create('td', null, row));
    dojo.create('td', null, row);

    if(tbody.rows.length <= 10){
        dojo.style('expHistoryArea', 'height', '' + tbody.rows.length * 26 + 'px');
    }
};

/**
 * 履歴行作成
 *
 * @param {Object} tbody テーブルボディ
 * @param {number} r 行インデックス
 * @param {?Object} histItem 履歴データ
 */
teasp.dialog.ExpHistory.prototype.createRow = function(tbody, r, histItem){
    var row = dojo.create('tr', { className: 'row ' + ((r%2)==0 ? 'even' : 'odd') }, tbody);

    // ラジオボタン
    var cell = dojo.create('td', { className: 'cell', style: { width:"24px" } }, row);
    if(histItem){
        var radio = dojo.create('input', { type: 'radio', id: 'expHistorySel' + r, name: 'expHistorySel' }, cell);
        if(r == 0){
            radio.checked = true;
        }
    }

    // 発
    cell = dojo.create('td', { className: 'cell', style: { width:"60px", borderLeft:"1px dashed #ADA6AD" } }, row);
    if(histItem){
        cell.style.cursor = 'pointer';
        cell.innerHTML    = histItem.obj.searchKey.stationFrom.name;
        this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.clickHistoryRow(r)));
    }
    // 矢印
    cell = dojo.create('td', { className: 'cell', style: { width:"16px" } }, row);
    if(histItem){
        cell.style.cursor = 'pointer';
        cell.innerHTML    = teasp.message.getLabel('tm20009080'); // ⇒
        this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.clickHistoryRow(r)));
    }
    // 着
    cell = dojo.create('td', { className: 'cell', style: { width:"60px" } }, row);
    if(histItem){
        cell.style.cursor = 'pointer';
        cell.innerHTML    = histItem.obj.searchKey.stationTo.name;
        this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.clickHistoryRow(r)));
    }
    // 金額
    cell = dojo.create('td', { className: 'cell', style: { width:"82px", borderLeft:"1px dashed #ADA6AD" } }, row);
    if(histItem){
        cell.style.cursor = 'pointer';
        cell.id           = 'expHistoryCost' + r;
        cell.innerHTML = histItem.expRoute.getFare('#,##0円');
        this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.clickHistoryRow(r)));
    }
    // 経路
    cell = dojo.create('td', { className: 'cell', style: { width:"499px", textAlign:"left", borderLeft:"1px dashed #ADA6AD" } }, row);
    if(histItem){
        cell.style.cursor = 'pointer';
        cell.appendChild(histItem.expRoute.createRouteTable(true));
        this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.clickHistoryRow(r)));
    }
};

/**
 * 行選択時の処理
 *
 * @param {number} _rowIndex 行インデックス
 * @return {Function}
 */
teasp.dialog.ExpHistory.prototype.clickHistoryRow = function(_rowIndex){
    var rowIndex = _rowIndex;
    return function() {
        var tbody = dojo.byId('expHistoryTableBody');
        var node = tbody.rows[rowIndex].cells[0].firstChild;
        if(node){
            node.checked = true;
        }
    };
};

/**
 * 選択行のインデックス取得
 *
 * @return {number} 選択行のインデックス（選択行がない時は-1）
 */
teasp.dialog.ExpHistory.prototype.getSelectRowIndex = function(){
    var tbody = dojo.byId('expHistoryTableBody');
    for(var r = 0 ; r < tbody.rows.length ; r++){
        if(tbody.rows[r].cells[0].firstChild.checked){
            return r;
        }
    }
    return -1;
};
