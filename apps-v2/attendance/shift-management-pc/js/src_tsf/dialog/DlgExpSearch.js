/**
 * 駅探検索ダイアログ
 *
 * @constructor
 * @extends {teasp.Tsf.dialog.Base}
 */
teasp.Tsf.dialog.ExpSearch = function(){
    this.widthHint = 770;
    this.heightHint = 428;
    this.id = 'dialogExpSearch';
    this.title = teasp.message.getLabel('ekitanResult_caption') /*交通費検索結果*/;
    this.duration = 1;
    this.content = '<table class="ekitan_search_frame" style="width:752px;"><tr><td><table class="cond" style="margin-left:auto;margin-right:auto;"><tr><td class="ekitan-search-date" style="width:128px;" id="ekSerch_date_label"></td><td class="from" style="width:160px;" id="ekSerch_stationFrom_label"></td><td class="arrow" style="width:24px;" ></td><td class="to" style="width:160px;" id="ekSerch_stationTo_label"></td><td class="route" style="width:190px;"><div class="horizon" style="display:table;margin:0px auto;"><div id="ekSerch_stationVia_label"></div><div id="expSearchViaHelp" class="pp_base pp_icon_help" style="margin:3px 0px 0px 3px;"></div></div></td><td class="search" style="width:90px;" ></td></tr><tr><td class="ekitan-search-date"><input type="text" value="" class="inputran" style="width:90px;text-align:center;" maxlength="10" id="expSearchDate" name="expSearchDate" /><input type="button" id="expSearchDateCal" class="ts-legacy-cal" /></td><td class="from"><input type="text" id="expSearchComboSt0" /></td><td class="arrow"><input type="button" id="expSearchResultArrow" class="pp_base pp_btn_oneway" style="margin-left:2px;" /></td><td class="to"><input type="text" id="expSearchComboSt1" /></td><td class="route"><input type="text" value="" class="inputran" style="width:180px;padding:1px 4px;" maxlength="20" id="expSearchResultRoute" /></td><td class="search"><button id="expSearchResultSearch"><div></div></button></td></tr><tr><td colspan="3"></td><td colspan="2" class="transfer" style="text-align:left;padding-left:20px;"><div class="horizon"><div><label><input type="checkbox" id="expSearchTransfer" /> <span id="expSearchTransferLabel"></span></label></div><div id="expSearchTransferHelp" class="pp_base pp_icon_help" style="margin:3px 0px 0px 3px;"></div></div></td></tr></table></td></tr><tr id="expSearchResultErrorRow" style="display:none;"><td style="padding-top:4px;text-align:center;"><span id="expSearchResultError" style="color: red;"></span></td></tr><tr><td style="padding-top:4px;"><table class="head" style="width:752px;"><thead><tr><th class="chk" ></th><th class="cost" id="expSearchColumn2"></th><th class="route" id="ekSerch_route_head"></th></tr></thead></table></td></tr><tr style="height:1px;"><td></td></tr><tr><td><div class="scroll_area" style="width:750px;" id="expSearchResultArea"><table class="data"><tbody id="expSearchResultTableBody"></tbody></table></div></td></tr><tr id="expSearchCtrl1Row" style="display:none;"><td style="padding-top:4px;"><table class="horiz" style="width:752px;"><tr><td style="width:234px;text-align:left"><div id="expSearchPeriodArea" style="display:none;"><span id="expSearchPeriodLabel"></span>&nbsp;<select id="expSearchPeriod"></select></div></td><td style="width:124px;text-align:center;"><button id="expSearchOk"><div></div></button></td><td style="width:124px;text-align:center;"><button id="expSearchCancel"><div></div></button></td><td style="width:154px;"></td><td style="width:116px;"><div class="pp_base pp_logo_ekitan" style="text-align:right;" ></div></td></tr></table></td></tr><tr id="expSearchCtrl2Row"><td style="padding-top:4px;"><table class="horiz" style="width:752px;"><tr><td style="width:234px;"></td><td style="width:248px;text-align:center;"><button id="expSearchClose"><div></div></button></td><td style="width:154px;"></td><td style="width:116px;"><div class="pp_base pp_logo_ekitan" style="text-align:right;" ></div></td></tr></table></td></tr><tr id="expSearchCtrlWarnRow" style="display:none;"><td style="text-align:left;"><div id="expSearchCtrlWarn" style="color:blue;font-size:0.9em;padding-top:4px;"></div></td></tr></table>';
    this.okLink = {
        id       : 'expSearchOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'expSearchCancel',
        callback : this.hide
    };
    this.closeLink = {
        id       : 'expSearchClose',
        callback : this.close
    };

    this.searchRoute = dojo.hitch(tsfManager, tsfManager.searchRoute);

    this.rowMin = 6;
    this.comboSt = [];
    this.expRoutes = null;
    this.searchKey = {};
    this.hkey = 'exp-search';
};

teasp.Tsf.dialog.ExpSearch.prototype = new teasp.Tsf.dialog.Base();

teasp.Tsf.dialog.ExpSearch.prototype.getStoreFrom = function(){
    if(!this.storeFrom){
        this.storeFrom = teasp.Tsf.Dom.createStoreMemory([]);
    }
    return this.storeFrom;
};

teasp.Tsf.dialog.ExpSearch.prototype.getStoreTo = function(){
    if(!this.storeTo){
        this.storeTo = teasp.Tsf.Dom.createStoreMemory([]);
    }
    return this.storeTo;
};

teasp.Tsf.dialog.ExpSearch.prototype.setStoreFrom = function(lst){
    teasp.Tsf.Dom.setStoreMemory(this.getStoreFrom(), lst);
};

teasp.Tsf.dialog.ExpSearch.prototype.setStoreTo = function(lst){
    teasp.Tsf.Dom.setStoreMemory(this.getStoreTo(), lst);
};

/**
 * 画面生成
 * @override
 */
teasp.Tsf.dialog.ExpSearch.prototype.preStart = function(){
    //メッセージ埋め込み
    //innerHTML
    teasp.message.setLabelHtml('ekSerch_date_label'        , 'tf10000180'        ); // 開始日
    teasp.message.setLabelHtml('ekSerch_stationFrom_label' , 'stationFrom_label' ); // 出発
    teasp.message.setLabelHtml('ekSerch_stationTo_label'   , 'stationTo_label'   ); // 到着
    teasp.message.setLabelHtml('ekSerch_stationVia_label'  , 'stationVia_label'  ); // 経由
    teasp.message.setLabelHtml('expSearchColumn2'          , 'expCost_head'      ); // 金額
    teasp.message.setLabelHtml('ekSerch_route_head'        , 'route_head'        ); // 経路
    teasp.message.setLabelHtml('expSearchTransferLabel'    , 'tf10008820'        ); // 経由駅で乗り換え

    teasp.message.setLabelEx('expSearchCtrlWarn'           , 'tk10005060'); // ※ 駅名の候補が出ない場合は、通常運賃の検索を行ってから定期期間を選択すると駅名の候補を選択できることがあります。

    dojo.byId('expSearchResultSearch').firstChild.innerHTML = teasp.message.getLabel('tf10000190'); // 検索
    dojo.byId('expSearchOk'    ).firstChild.innerHTML = teasp.message.getLabel('select_btn_title'); // 選択
    dojo.byId('expSearchCancel').firstChild.innerHTML = teasp.message.getLabel('cancel_btn_title'); // キャンセル
    dojo.byId('expSearchClose' ).firstChild.innerHTML = teasp.message.getLabel('close_btn_title' );  // 閉じる

    this.getDomHelper().connect('expSearchResultSearch', 'onclick', this, this.search);

    this.comboSt[0] = this.getDomHelper().createComboBox({
        id              : "expSearchComboStList0",
        name            : "comboSt0",
        value           : "",
        store           : this.getStoreFrom(),
        fetchProperties : {sort:[{attribute:'score',descending:false},{attribute:'name',descending:false}]},
        searchAttr      : "name",
        style: { width:"150px", border:"1px solid #539AC7" }
    },
    teasp.Tsf.Dom.byId("expSearchComboSt0"));

    this.comboSt[1] = this.getDomHelper().createComboBox({
        id              : "expSearchComboStList1",
        name            : "comboSt1",
        value           : "",
        store           : this.getStoreTo(),
        fetchProperties : {sort:[{attribute:'score',descending:false},{attribute:'name',descending:false}]},
        searchAttr      : "name",
        style: { width:"150px", border:"1px solid #539AC7" }
    },
    teasp.Tsf.Dom.byId("expSearchComboSt1"));

    var cal = teasp.Tsf.Dom.byId('expSearchDateCal');
    var n   = teasp.Tsf.Dom.byId('expSearchDate');
    if(cal && n){
        tsfManager.eventOpenCalendar(this.getDomHelper(), cal, n, { tagName: n.name, isDisabledDate: function(d){ return false; } });
    }
    if(dojo.isIE == 9){
        this.getDomHelper().connect(this.dialog, 'onKeyDown', this, function(e){ if(e.keyCode===13){ dojo.stopEvent(e); } return false; });
    }

    this.getDomHelper().createTooltip({
        connectId   : 'expSearchViaHelp',
        label       : teasp.message.getLabel('tf10008840'),
        position    : ['below'],
        showDelay   : 100
    });
    this.getDomHelper().createTooltip({
        connectId   : 'expSearchTransferHelp',
        label       : teasp.message.getLabel('tf10008830'),
        position    : ['below'],
        showDelay   : 100
    });
};

/**
 * 画面生成
 *
 * @override
 */
teasp.Tsf.dialog.ExpSearch.prototype.preShow = function(){
    this.getDomHelper().freeBy(this.hkey);

    this.showError(null);
    this.resobj = {routes:[]};

    // 定期期間の選択リスト
    dojo.style('expSearchPeriodArea', 'display', (this.args.commuter ? '' : 'none'));
    // 日付入力欄
    dojo.query('.ekitan-search-date').forEach(function(el){
//        dojo.style(el, 'display', (this.args.commuter ? '' : 'none'));
        dojo.style(el, 'display', 'none');
    }, this);

    if(!this.args.commuter){
        this.getDomHelper().connect('expSearchResultArrow', 'onclick', this, this.checkRoundTrip, this.hkey);
    }else{
        var today = teasp.util.date.formatDate(teasp.util.date.getToday(), 'SLA');
        dojo.byId('expSearchDate').value = today;

        teasp.Tsf.Dom.byId('expSearchPeriodLabel').innerHTML = teasp.message.getLabel('tk10005030'); //
        // 定期期間
        var select = teasp.Tsf.Dom.byId('expSearchPeriod');
        teasp.Tsf.Dom.empty(select);
        dojo.create('option', { value: '0', innerHTML: teasp.message.getLabel('tk10005010') }, select); // 通常運賃
        dojo.create('option', { value: '1', innerHTML: teasp.message.getLabel('tk10005040', 1) }, select); // 定期期間：{0}か月
        dojo.create('option', { value: '3', innerHTML: teasp.message.getLabel('tk10005040', 3) }, select); // 定期期間：{0}か月
        dojo.create('option', { value: '6', innerHTML: teasp.message.getLabel('tk10005040', 6) }, select); // 定期期間：{0}か月
        select.value = tsfManager.getTicketPeriod();
        this.getDomHelper().connect(select, 'onchange', this, this.changeTicketPeriod, this.hkey);
    }
    this.displayFareName();
    teasp.Tsf.Dom.byId('expSearchResultArrow').className = 'pp_base ' + (this.args.roundTrip ? 'pp_btn_round' : 'pp_btn_oneway');
    dojo.style('expSearchResultArrow', 'cursor', (this.args.commuter ? 'default' : 'pointer'));

    dojo.style('expSearchCtrl1Row', 'display', (this.args.readonly || this.args.fixed ? 'none' : ''));
    dojo.style('expSearchCtrl2Row', 'display', (this.args.readonly || this.args.fixed ? '' : 'none'));

    dojo.style('expSearchCtrlWarnRow', 'display', (this.args.commuter && !this.args.readonly && !this.args.fixed ? '' : 'none'));

    this.setStoreFrom(this.args.stationFromHist);
    this.setStoreTo(this.args.stationToHist);

    this.comboSt[0].setValue(this.args.startName || '');
    this.comboSt[1].setValue(this.args.endName   || '');
    var vias = [];
    if(this.args.stationVia){
        dojo.forEach(this.args.stationVia, function(v){
            vias.push(v.name);
        });
    }
    teasp.Tsf.Dom.byId('expSearchResultRoute').value = vias.join(',');
    teasp.Tsf.Dom.byId('expSearchTransfer').checked = this.args.transfer || false;
    this.createBody();
    this.show();
    if(this.args.startName && this.args.endName && !this.args.searchStop){
        setTimeout(dojo.hitch(this, this.search), 100);
    }
    return false;
};

/**
 * 登録
 *
 * @override
 */
teasp.Tsf.dialog.ExpSearch.prototype.ok = function(){
    var rowIndex = this.getSelectRowIndex();
    if(rowIndex < 0){
        return;
    }
    var period = dojo.byId('expSearchPeriod').value;
    if(this.args.commuter && period == '0'){
        this.showError(teasp.message.getLabel('tk10005020')); // 定期期間を選択してください
        return;
    }
    var route = (rowIndex >= 0 && rowIndex < this.expRoutes.getRouteCount()) ? this.expRoutes.getRoute(rowIndex) : null;
    if(route){
        if(this.args.commuter && !route.getCommuterCode()){ // 定期区間コードが空
            teasp.tsAlert(teasp.message.getLabel('tk10005050'), this, function(){
                this.onfinishfunc({
                    roundTrip   : (dojo.hasClass('expSearchResultArrow', 'pp_btn_round')),
                    searchKey   : this.searchKey,
                    date        : this.searchedDate,
                    period      : this.searchedPeriod,
                    ICCardMode  : this.ICCardMode,
                    route       : route.getRouteObj()
                });
                this.close();
            });
        }else{
            this.onfinishfunc({
                roundTrip   : (dojo.hasClass('expSearchResultArrow', 'pp_btn_round')),
                searchKey   : this.searchKey,
                date        : this.searchedDate,
                period      : this.searchedPeriod,
                ICCardMode  : this.ICCardMode,
                route       : route.getRouteObj()
            });
            this.close();
        }
    }
};

teasp.Tsf.dialog.ExpSearch.prototype.displayFareName = function(){
    dojo.byId('expSearchColumn2').innerHTML
        = (this.args.commuter && dojo.byId('expSearchPeriod').value != '0'
        ? teasp.message.getLabel('tm20005010', dojo.byId('expSearchPeriod').value) // 定期代<span style="font-size:0.9em;">({0}ヶ月分)</span>
        : teasp.message.getLabel('expCost_head')); // 金額
};

/**
 * 入力・該当リストエリア作成
 */
teasp.Tsf.dialog.ExpSearch.prototype.createBody = function(){
    var tbody, row, r, rowSize, i,  h, o;
    var st = [[], []];
    var vias = [];
    var stations    = [null, null];
    var stationList = [this.resobj.stationFromList, this.resobj.stationToList];
    var viaList     = [this.resobj.stationVia1List, this.resobj.stationVia2List, this.resobj.stationVia3List];

    if(this.expRoutes){
        this.expRoutes.destroy();
        this.expRoutes = null;
    }
    this.expRoutes = new teasp.helper.EkitanRoutes(this.resobj.routes);
    o = (dojo.hasClass('expSearchResultArrow', 'pp_btn_round'));

    tbody = dojo.byId('expSearchResultTableBody');
    teasp.Tsf.Dom.empty(tbody);

    this.displayFareName();

    var commuterMode = (this.args.commuter && dojo.byId('expSearchPeriod').value != '0');

    if(this.resobj.routes.length > 0){
        for(h = 0 ; h < 2 ; h++){
            if(stationList[h]){
                for(i = 0 ; i < stationList[h].length ; i++){
                    o = stationList[h][i];
                    if(this.expRoutes.getRouteCount() > 0 && i == 0){
                        this.comboSt[h].setValue(o.name);
                        stations[h] = o;
                    }
                    st[h].push({ name: o.name, code: o.code });
                }
            }
        }
        this.searchKey.stationFrom = stations[0];
        this.searchKey.stationTo   = stations[1];
        this.searchKey.stationVia = [];
        this.searchKey.transfer = this.resobj.transfer || false;

        for(h = 0 ; h < 3 ; h++){
            if(viaList[h]){
                for(i = 0 ; i < viaList[h].length ; i++){
                    o = viaList[h][i];
                    if(i == 0){
                        vias.push(o.name);
                        this.searchKey.stationVia.push(o);
                    }
                    st[0].push({ name: o.name, code: o.code });
                    st[1].push({ name: o.name, code: o.code });
                }
            }
        }
        var s0 = teasp.Tsf.util.clone(st[0]);
        var s1 = teasp.Tsf.util.clone(st[1]);
        st[0] = st[0].concat(st[1]);
        st[1] = s1.concat(s0);
        this.setStoreFrom(st[0]);
        this.setStoreTo(st[1]);

        dojo.byId('expSearchResultRoute').value = (vias.length > 0 ? vias.join(',') : '');
        dojo.byId('expSearchTransfer').checked = (this.searchKey.transfer || false);
    }

    rowSize = (this.rowMin < this.expRoutes.getRouteCount() ? this.expRoutes.getRouteCount() : this.rowMin);

    for(r = 0 ; r < rowSize ; r++){
        this.createRow(tbody, r, this.expRoutes.getRoute(r), commuterMode);
    }

    row = dojo.create('tr', null, tbody);
    dojo.create('div', { className: 'clear26x1',  width: '26px' , height: '1px' }, dojo.create('td', null, row));
    dojo.create('div', { className: 'clear110x1', width: '110px', height: '1px' }, dojo.create('td', null, row));
    dojo.create('td', null, row);
};

/**
 * 検索結果リストエリア作成
 *
 * @param {Object} tbody テーブルボディ
 * @param {number} r 行インデックス
 * @param {Object} routeItem 経路オブジェクト
 */
teasp.Tsf.dialog.ExpSearch.prototype.createRow = function(tbody, r, routeItem, commuterMode){
    var row, cell, radio;

    row = dojo.create('tr', { className : 'row ' + ((r%2)==0 ? 'even' : 'odd') }, tbody);

    // ラジオボタン
    cell = dojo.create('td', { className : 'cell chk' }, row);
    if(routeItem != null){
        radio = dojo.create('input', { type: 'radio', id: 'expResultSel' + r, name: 'expResultSel', style: { width:"26px" } }, cell);
        if(this.args.commuterCode){
            radio.checked = (routeItem.getCommuterCode() == this.args.commuterCode);
        }else{
            radio.checked = (r == 0);
        }
    }

    // 金額
    cell = dojo.create('td', { className : 'cell cost', style : { fontSize:"95%" } }, row);
    if(routeItem != null){
        cell.onclick = this.clickSearchResultRow(r);
        dojo.create('div', { id:'expResultCost' + r, style:'width:110px' }, cell);
    }

    // 一覧
    cell = dojo.create('td', { className : 'cell route' }, row);
    if(routeItem != null){
        cell.onclick = this.clickSearchResultRow(r);
        cell.appendChild(routeItem.createTable({
            tableId:('expResultTbl' + r),
            changedFare: dojo.hitch(this, function(){
                this.changedFare(r, commuterMode);
            })
        }));
    }
};

/**
 * 金額表示
 */
teasp.Tsf.dialog.ExpSearch.prototype.changedFare = function(rowIndex, commuterMode){
    var chk = dojo.hasClass('expSearchResultArrow', 'pp_btn_oneway');
    var route = this.expRoutes.getRoute(rowIndex);
    dojo.byId('expResultCost' + rowIndex).innerHTML = (commuterMode ? route.getCommuterFare('#,##0円') : route.getFareEx(!chk));
};

/**
 * 再検索ボタンクリック時の処理
 *
 */
teasp.Tsf.dialog.ExpSearch.prototype.search = function(){
    var i, name, from, to, via, vias;

    from = this.comboSt[0].getValue().trim();
    to   = this.comboSt[1].getValue().trim();
    via  = dojo.byId('expSearchResultRoute').value.trim();

    var date = this.args.date;
//    if(this.args.commuter){
//        var sd = teasp.util.strToDate(dojo.byId('expSearchDate').value);
//        if(sd.failed != 0){
//            this.showError(dojo.replace(sd.tmpl, [teasp.message.getLabel('tf10000180')]));
//            return;
//        }
//        dojo.byId('expSearchDate').value = sd.dater;
//        date = sd.datef;
//    }

    if(from == ''){
        this.showError(teasp.message.getLabel('tm20005030'));  // 出発を入力してください
        return;
    }
    if(to == ''){
        this.showError(teasp.message.getLabel('tm20005040'));  // 到着を入力してください
        return;
    }
    if(from == to){
        this.showError(teasp.message.getLabel('tm20005050')); // 出発と到着が同じです。検索できません。
        return;
    }
    this.showError(null);

    this.searchKey = {
        stationFrom : { name: from, code: null },
        stationTo   : { name: to  , code: null },
        stationVia  : [],
        transfer    : false
    };
    vias = (via != '' ? via.split(/[,、， 　]+/) : []);
    if(vias.length > 0){
        dojo.byId('expSearchResultRoute').value = vias.join(',');
        if(vias.length > 3){
            this.showError(teasp.message.getLabel('tm20005060') /*経由地は3か所まで入力可能です*/);
            return;
        }
    }
    for(i = 0 ; i < vias.length ; i++){
        name = vias[i];
        this.searchKey.stationVia.push({ name: name, code: null });
    }
    this.searchKey.transfer = (this.searchKey.stationVia.length && dojo.byId('expSearchTransfer').checked) || false; // 経由駅で乗り換え
    this.setStationCode(this.searchKey);

    var mode = (this.args.commuter ? parseInt(dojo.byId('expSearchPeriod').value, 10) : 0);

    this.searchRoute(mode, this.searchKey, date, this.args.config,
        dojo.hitch(this, function(succeed, result){
            if(succeed){
                this.searchedDate   = date;
                this.searchedPeriod = mode;
                this.ICCardMode = result.ICCardMode || null;
                this.resobj = result;
            }else{
                this.resobj.routes = [];
                this.showError(teasp.Tsf.Error.getMessage(result));
            }
            this.createBody();
        })
    );
};

teasp.Tsf.dialog.ExpSearch.prototype.setStationCode = function(sk){
    var ol = this.getStoreFrom().query({ name: sk.stationFrom.name });
    dojo.forEach(ol, function(o){
        if(o.code && o.name == sk.stationFrom.name){
            sk.stationFrom.code = o.code;
        }
    }, this);
    ol = this.getStoreTo().query({ name: sk.stationTo.name });
    dojo.forEach(ol, function(o){
        if(o.code && o.name == sk.stationTo.name){
            sk.stationTo.code = o.code;
        }
    }, this);
    for(var i = 0 ; i < sk.stationVia.length ; i++){
        ol = this.getStoreFrom().query({ name: sk.stationVia[i].name });
        dojo.forEach(ol, function(o){
            if(o.code && o.name == sk.stationVia[i].name){
                sk.stationVia[i].code = o.code;
            }
        }, this);
    }
    // 1つでも code == null があれば、全部 null にする（そうしないと何故かエラーになる）
    var nc = (!sk.stationFrom.code || !sk.stationTo.code);
    for(var i = 0 ; !nc && i < sk.stationVia.length ; i++){
        nc = (!sk.stationVia[i].code);
    }
    if(nc){
        sk.stationFrom.code = null;
        sk.stationTo.code   = null;
        for(var i = 0 ; i < sk.stationVia.length ; i++){
            sk.stationVia[i].code = null;
        }
    }
};

/**
 * 往復／片道切り替えボタンクリック時の処理
 *
 */
teasp.Tsf.dialog.ExpSearch.prototype.checkRoundTrip = function(){
    var chk = dojo.hasClass('expSearchResultArrow', 'pp_btn_oneway');
    dojo.byId('expSearchResultArrow').className = 'pp_base ' + (chk ? 'pp_btn_round' : 'pp_btn_oneway');
    var commuterMode = (this.args.commuter && dojo.byId('expSearchPeriod').value != '0');
    for(var r = 0 ; r < this.expRoutes.getRouteCount() ; r++){
        this.changedFare(r, commuterMode);
    }
};

/**
 * 定期期間変更
 *
 */
teasp.Tsf.dialog.ExpSearch.prototype.changeTicketPeriod = function(){
    var from = this.comboSt[0].getValue().trim();
    var to   = this.comboSt[1].getValue().trim();
    this.showError(null);
    if(from != '' && to != '' && from != to){
        this.search();
    }
};

/**
 * 検索結果リストの行選択時の処理（クロージャ）
 *
 * @param {number} _rowIndex 行インデックス
 * @return {Function}
 */
teasp.Tsf.dialog.ExpSearch.prototype.clickSearchResultRow = function(_rowIndex){
    var rowIndex = _rowIndex;
    return function() {
        var tbody = dojo.byId('expSearchResultTableBody');
        var node = tbody.rows[rowIndex].cells[0].firstChild;
        if(node){
            node.checked = true;
        }
    };
};

/**
 * 選択行のインデックス取得
 *
 * @return {number} 行インデックス（選択行がない時は -1）
 */
teasp.Tsf.dialog.ExpSearch.prototype.getSelectRowIndex = function(){
    var tbody, r;
    tbody = dojo.byId('expSearchResultTableBody');
    for(r = 0 ; r < tbody.rows.length ; r++){
        var node = tbody.rows[r].cells[0].firstChild;
        if(node && node.tagName && node.tagName.toLowerCase() == 'input' && node.type == 'radio' && node.checked){
            return r;
        }
    }
    return -1;
};

/**
 * エラー表示
 *
 * @param {?string} errmsg エラーメッセージ
 */
teasp.Tsf.dialog.ExpSearch.prototype.showError = function(errmsg){
    if(!errmsg){
        dojo.style('expSearchResultErrorRow', 'display', 'none');
    }else{
        dojo.style('expSearchResultErrorRow', 'display', '');
        dojo.byId('expSearchResultError').innerHTML = errmsg.entitize();
    }
};
