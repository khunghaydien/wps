teasp.provide('teasp.dialog.ExpSearch');
/**
 * 駅探検索ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.ExpSearch = function(){
    this.widthHint = 770;
    this.heightHint = 428;
    this.id = 'dialogExpSearch';
    this.title = teasp.message.getLabel('ekitanResult_caption') /*交通費検索結果*/;
    this.duration = 1;
    this.content = '<table class="ekitan_search_frame" style="width:752px;"><tr><td><table class="cond" style="width:644px;"><tr><td class="from" style="width:170px;" id="ekSerch_stationFrom_label"></td><td class="arrow" style="width:24px;" ></td><td class="to" style="width:170px;" id="ekSerch_stationTo_label"></td><td class="route" style="width:190px;"><div class="horizon" style="display:table;margin:0px auto;"><div id="ekSerch_stationVia_label"></div><div id="expSearchViaHelp" class="pp_base pp_icon_help" style="margin:3px 0px 0px 3px;"></div></div></td><td class="search" style="width:90px;" ></td></tr><tr><td class="from"><input type="text" id="expSearchComboSt0" /></td><td class="arrow"><div id="expSearchResultArrow" class="pp_base pp_btn_oneway" style="margin-left:2px;"></div></td><td class="to"><input type="text" id="expSearchComboSt1" /></td><td class="route"><input type="text" value="" class="inputran" style="width:180px;height:17px;" maxlength="20" id="expSearchResultRoute" /></td><td class="search"><input type="button" class="pb_base pb_btn_research" id="expSearchResultSearch" /></td></tr><tr><td colspan="3"></td><td colspan="2" class="transfer" style="text-align:left;padding-left:20px;"><div class="horizon"><div><label><input type="checkbox" id="expSearchTransfer" /> <span id="expSearchTransferLabel"></span></label></div><div id="expSearchTransferHelp" class="pp_base pp_icon_help" style="margin:3px 0px 0px 3px;"></div></div></td></tr></table></td></tr><tr id="expSearchResultErrorRow" style="display:none;"><td style="padding-top:4px;text-align:center;"><span id="expSearchResultError" style="color: red;"></span></td></tr><tr><td style="padding-top:4px;"><table class="head" style="width:752px;"><thead><tr><th class="chk" ></th><th class="cost" id="expSearchColumn2"></th><th class="route" id="ekSerch_route_head"></th></tr></thead></table></td></tr><tr style="height:1px;"><td></td></tr><tr><td><div class="scroll_area" style="width:750px;" id="expSearchResultArea"><table class="data"><tbody id="expSearchResultTableBody"></tbody></table></div></td></tr><tr id="expSearchCtrl1Row" style="display:none;"><td style="padding-top:4px;"><table class="horiz" style="width:752px;"><tr><td style="width:234px;text-align:left"><div id="expSearchPeriodArea" style="display:none;"><span id="expSearchPeriodLabel"></span>&nbsp;<select id="expSearchPeriod"></select></div></td><td style="width:124px;text-align:center;"><input type="button" class="pb_base pb_btn_select" id="expSearchOk" /></td><td style="width:124px;text-align:center;"><input type="button" class="pb_base pb_btn_cancel" id="expSearchCancel" /></td><td style="width:154px;"></td><td style="width:116px;"><div class="pp_base pp_logo_ekitan" style="text-align:right;" ></div></td></tr></table></td></tr><tr id="expSearchCtrl2Row"><td style="padding-top:4px;"><table class="horiz" style="width:752px;"><tr><td style="width:234px;"></td><td style="width:248px;text-align:center;"><input type="button" class="pb_base pb_btn_close" id="expSearchClose" /></td><td style="width:154px;"></td><td style="width:116px;"><div class="pp_base pp_logo_ekitan" style="text-align:right;" ></div></td></tr></table></td></tr><tr id="expSearchCtrlWarnRow" style="display:none;"><td style="text-align:left;"><div id="expSearchCtrlWarn" style="color:blue;font-size:0.9em;padding-top:4px;"></div></td></tr></table>';
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

    this.rowMin = 6;
    this.comboSt = [];
    this.expRoutes = null;
    this.searchKey = {};
    this.eventHandles = [];
//    this.resobj;
//    this.storeSt;
};

teasp.dialog.ExpSearch.prototype = new teasp.dialog.Base();

/**
 * 画面生成
 * @override
 */
teasp.dialog.ExpSearch.prototype.preStart = function(){
    //メッセージ埋め込み
    //innerHTML
    teasp.message.setLabelHtml('ekSerch_stationFrom_label' , 'stationFrom_label' ); // 出発
    teasp.message.setLabelHtml('ekSerch_stationTo_label'   , 'stationTo_label'   ); // 到着
    teasp.message.setLabelHtml('ekSerch_stationVia_label'  , 'stationVia_label'  ); // 経由
    teasp.message.setLabelHtml('expSearchColumn2'          , 'expCost_head'      ); // 金額
    teasp.message.setLabelHtml('ekSerch_route_head'        , 'route_head'        ); // 経路
    teasp.message.setLabelHtml('expSearchTransferLabel'    , 'tf10008820'        ); // 経由駅で乗り換え
    //title
    teasp.message.setLabelTitle('expSearchResultSearch'    , 'research_btn_title'); // 再検索
    teasp.message.setLabelTitle('expSearchOk'              , 'select_btn_title'  ); // 選択
    teasp.message.setLabelTitle('expSearchCancel'          , 'cancel_btn_title'  ); // キャンセル
    teasp.message.setLabelTitle('expSearchClose'           , 'close_btn_title'   ); // 閉じる

    teasp.message.setLabelEx('expSearchCtrlWarn'           , 'tk10005060'); // ※ 駅名の候補が出ない場合は、通常運賃の検索を行ってから定期期間を選択すると駅名の候補を選択できることがあります。

    dojo.connect(dojo.byId('expSearchResultSearch'), 'onclick', this, this.search);

    this.comboSt[0] = new dijit.form.ComboBox({
        id: "expSearchComboStList0",
        name: "comboSt0",
        value: "",
        store: this.args.storeSt,
        fetchProperties: {sort:[{attribute:'score',descending:true},{attribute:'name',descending:false}]},
        searchAttr: "name",
        style: { width:"160px", border:"1px solid #539AC7" }
    },
    "expSearchComboSt0");

    this.comboSt[1] = new dijit.form.ComboBox({
        id: "expSearchComboStList1",
        name: "comboSt1",
        value: "",
        store: this.args.storeSt,
        fetchProperties: {sort:[{attribute:'score',descending:true},{attribute:'name',descending:false}]},
        searchAttr: "name",
        style: { width:"160px", border:"1px solid #539AC7" }
    },
    "expSearchComboSt1");

    // dijit.form.ComboBox の入力欄に謎の枠があり入力エリアが狭まるので非可視にする
    dojo.query('.dijitValidationIcon').forEach(function(elem) {
        dojo.style(elem, 'display', 'none');
    });

    this.createTooltip({
        connectId   : 'expSearchViaHelp',
        label       : teasp.message.getLabel('tf10008840'),
        position    : ['below'],
        showDelay   : 100
    });
    this.createTooltip({
        connectId   : 'expSearchTransferHelp',
        label       : teasp.message.getLabel('tf10008830'),
        position    : ['below'],
        showDelay   : 100
    });
};

teasp.dialog.ExpSearch.prototype.createTooltip = function(obj){
    var p = new dijit.Tooltip(obj);
    p.startup();
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.ExpSearch.prototype.preShow = function(){
    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    this.showError(null);
    this.resobj = {routes:[]};

    // 定期期間の選択リスト
    dojo.style('expSearchPeriodArea', 'display', (this.args.commuter ? '' : 'none'));

    if(!this.args.commuter){
        this.eventHandles.push(dojo.connect(dojo.byId('expSearchResultArrow'), 'onclick', this, this.checkRoundTrip));
    }else{
        dojo.byId('expSearchPeriodLabel').innerHTML = teasp.message.getLabel('tk10005030'); //
        // 定期期間
        var select = dojo.byId('expSearchPeriod');
        while(select.firstChild){
            dojo.destroy(select.firstChild);
        }
        dojo.create('option', { value: '0', innerHTML: teasp.message.getLabel('tk10005010') }, select); // 通常運賃
        dojo.create('option', { value: '1', innerHTML: teasp.message.getLabel('tk10005040', 1) }, select); // 定期期間：{0}か月
        dojo.create('option', { value: '3', innerHTML: teasp.message.getLabel('tk10005040', 3) }, select); // 定期期間：{0}か月
        dojo.create('option', { value: '6', innerHTML: teasp.message.getLabel('tk10005040', 6) }, select); // 定期期間：{0}か月
        select.value = this.pouch.getTicketPeriod();
        this.eventHandles.push(dojo.connect(select, 'onchange', this, this.changeTicketPeriod));
    }
    this.displayFareName();
    dojo.byId('expSearchResultArrow').className = 'pp_base ' + (this.args.roundTrip ? 'pp_btn_round' : 'pp_btn_oneway');
    dojo.style('expSearchResultArrow', 'cursor', (this.args.commuter ? 'default' : 'pointer'));

    dojo.style('expSearchCtrl1Row', 'display', (this.args.readonly || this.args.fixed ? 'none' : ''));
    dojo.style('expSearchCtrl2Row', 'display', (this.args.readonly || this.args.fixed ? '' : 'none'));

    dojo.style('expSearchCtrlWarnRow', 'display', (this.args.commuter && !this.args.readonly && !this.args.fixed ? '' : 'none'));

    this.comboSt[0].store = this.args.storeSt;
    this.comboSt[1].store = this.args.storeSt;

    var stObj = [
        { name: (this.args.from || ''), code: null },
        { name: (this.args.to   || ''), code: null }
    ];

    var transfer = false;
    if(this.args.via){
        dojo.byId('expSearchResultRoute').value = this.args.via;
        var vias = (this.args.via != '' ? this.args.via.split(/[,、， 　]+/) : []);
        for(var i = 0 ; i < vias.length ; i++){
            stObj.push({name : vias[i], code: null});
        }
        transfer = this.args.transfer || false;
    }else{
        dojo.byId('expSearchResultRoute').value = '';
    }

    var _searchKey = null;
    if(this.args.searchKey){
        _searchKey = this.args.searchKey;
    }else if(stObj[0].name != '' && stObj[1].name != ''){
        var map = {};
        for(var h = 0 ; h < stObj.length ; h++){
            map[stObj[h].name] = null;
        }
        var storeSt = this.args.storeSt;
        for(var key in map){
            storeSt.fetch({
                query: { name: key },
                onItem: function(item){
                    var v = storeSt.getValue(item, "code");
                    if(v != ''){
                        map[key] = v;
                    }
                }
            });
        }
        this.comboSt[0].setValue(stObj[0].name);
        this.comboSt[1].setValue(stObj[1].name);
        // コードがとれないものがあったら、全部コードをつけない
//        var all = true;
        var all = false;
        for(var key in map){
            if(!map[key]){
                all = false;
            }
        }
        _searchKey = {
            stationFrom : { name: stObj[0].name, code: (all ? map[stObj[0].name] : null) },
            stationTo   : { name: stObj[1].name, code: (all ? map[stObj[1].name] : null) },
            stationVia  : [],
            transfer    : transfer
        };
        for(h = 2 ; h < stObj.length ; h++){
            _searchKey.stationVia.push({ name: stObj[h].name, code: (all ? map[stObj[h].name] : null) });
        }
    }
    if(_searchKey){
        var mode = (this.args.commuter ? parseInt(this.pouch.getTicketPeriod(), 10) : 0);
        var config = (this.args.config ? dojo.toJson(this.args.config) : null);
        if(this.args.searchRoute){
            var that = this;
            this.args.searchRoute(
                dojo.mixin({
                    action  : 'searchRoute',
                    empId   : this.args.empId,
                    expDate : this.args.date,
                    mode    : mode,
                    config  : config
                }, _searchKey),
                function(obj){
                    that.resobj = obj;
                    that.createBody();
                    that.show();
                },
                function(event){
                    that.resobj.routes = [];
                    that.showError(teasp.message.getErrorMessage(event));
                    that.createBody();
                    that.show();
                }
            );
        }else{
            this.searchKey = dojo.clone(_searchKey);
            this.searchKey.stationFrom.code = null;
            this.searchKey.stationTo.code   = null;
            for(var i = 0 ; i < this.searchKey.stationVia.length ; i++){
                this.searchKey.stationVia[i].code = null;
            }
            teasp.manager.request(
                'searchRoute',
                dojo.mixin({
                    empId   : this.pouch.getEmpId(),
                    expDate : this.args.date,
                    mode    : mode,
                    config  : config
                }, this.searchKey),
                this.pouch,
                { hideBusy : false },
                this,
                function(obj){
                    this.resobj = obj;
                    this.createBody();
                    this.show();
                },
                function(event){
                    this.resobj.routes = [];
                    this.showError(teasp.message.getErrorMessage(event));
                    this.createBody();
                    this.show();
                }
            );
        }
    }else{
        this.comboSt[0].setValue(stObj[0].name);
        this.comboSt[1].setValue(stObj[1].name);
        this.createBody();
        this.show();
    }
    return false;
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.ExpSearch.prototype.ok = function(){
    var rowIndex = this.getSelectRowIndex();
    if(rowIndex < 0){
        return;
    }
    var searchPeriod = '0';
    if(this.args.commuter){
        searchPeriod = dojo.byId('expSearchPeriod').value;
    }
    if(this.args.commuter && searchPeriod == '0'){
        this.showError(teasp.message.getLabel('tk10005020')); // 定期期間を選択してください
        return;
    }
    var route = (rowIndex >= 0 && rowIndex < this.expRoutes.getRouteCount()) ? this.expRoutes.getRoute(rowIndex) : null;
    if(route){
        if(this.args.commuter && !route.getCommuterCode()){ // 定期区間コードが空
            alert(teasp.message.getLabel('tk10005050'));
        }
        this.onfinishfunc({
            roundTrip       : (dojo.hasClass('expSearchResultArrow', 'pp_btn_round')),
            searchKey       : this.searchKey,
            searchPeriod    : searchPeriod,
            route           : route.getRouteObj()
        });
    }
    this.close();
};

teasp.dialog.ExpSearch.prototype.displayFareName = function(){
    dojo.byId('expSearchColumn2').innerHTML
        = (this.args.commuter && dojo.byId('expSearchPeriod').value != '0'
        ? teasp.message.getLabel('tm20005010', dojo.byId('expSearchPeriod').value) // 定期代<span style="font-size:0.9em;">({0}ヶ月分)</span>
        : teasp.message.getLabel('expCost_head')); // 金額
};

/**
 * 入力・該当リストエリア作成
 */
teasp.dialog.ExpSearch.prototype.createBody = function(){
    var tbody, row, r, rowSize, i,  h, o;
    var st = [];
    var vias = [];
    var stations = [null, null];
    var stationList = [this.resobj.stationFromList, this.resobj.stationToList];
    var viaList = [this.resobj.stationVia1List, this.resobj.stationVia2List, this.resobj.stationVia3List];

    if(this.expRoutes){
        this.expRoutes.destroy();
        this.expRoutes = null;
    }
    this.expRoutes = new teasp.helper.EkitanRoutes(this.resobj.routes);
    o = (dojo.hasClass('expSearchResultArrow', 'pp_btn_round'));

    tbody = dojo.byId('expSearchResultTableBody');
    dojo.empty(tbody);

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
                    st.push(o);
                }
            }
        }
        this.searchKey.stationFrom = stations[0];
        this.searchKey.stationTo   = stations[1];
        this.searchKey.stationVia = [];
        this.searchKey.transfer = this.resobj.transfer;

        for(h = 0 ; h < 3 ; h++){
            if(viaList[h]){
                for(i = 0 ; i < viaList[h].length ; i++){
                    o = viaList[h][i];
                    if(i == 0){
                        vias.push(o.name);
                        this.searchKey.stationVia.push(o);
                    }
                    st.push(o);
                }
            }
        }

        dojo.byId('expSearchResultRoute').value = (vias.length > 0 ? vias.join(',') : '');
        dojo.byId('expSearchTransfer').checked = this.searchKey.transfer || false;

        var lst = [];
        for(i = 0 ; i < st.length ; i++){
            lst.push(st[i]);
        }
        var ss = new dojo.store.Memory({
             data: lst
         });
        this.comboSt[0].store = ss;
        this.comboSt[1].store = ss;
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
teasp.dialog.ExpSearch.prototype.createRow = function(tbody, r, routeItem, commuterMode){
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
            changedFare: function(fare){
                var chk = dojo.hasClass('expSearchResultArrow', 'pp_btn_oneway');
                dojo.byId('expResultCost' + r).innerHTML = (commuterMode ? routeItem.getCommuterFare('#,##0円') : routeItem.getFareEx(!chk));
            }
        }));
    }
};

/**
 * 再検索ボタンクリック時の処理
 *
 */
teasp.dialog.ExpSearch.prototype.search = function(){
    var i, name, names, map, all, from, to, via, vias;

    from = this.comboSt[0].getValue().trim();
    to   = this.comboSt[1].getValue().trim();
    via  = dojo.byId('expSearchResultRoute').value.trim();

    if(from == ''){
        this.showError(teasp.message.getLabel('tm20005030') /*出発を入力してください*/);
        return;
    }
    if(to == ''){
        this.showError(teasp.message.getLabel('tm20005040') /*到着を入力してください*/);
        return;
    }
    if(from == to){
        this.showError(teasp.message.getLabel('tm20005050') /*出発と到着が同じです。検索できません。*/);
        return;
    }
    this.showError(null);

    vias = (via != '' ? via.split(/[,、， 　]+/) : []);
    if(vias.length > 0){
        dojo.byId('expSearchResultRoute').value = vias.join(',');
        if(vias.length > 3){
            this.showError(teasp.message.getLabel('tm20005060') /*経由地は3か所まで入力可能です*/);
            return;
        }
    }
    names = [from, to].concat(vias);
    map = this.codeMapping(names);
    // コードがとれないものがあったら、全部コードをつけない
//        all = (vias.length > 0 ? false : true);
//    all = true;
    all = false;
    if(all){
        for(i = 0 ; i < names.length ; i++){
            name = names[i];
            if(!map[name]){
                all = false;
                break;
            }
        }
    }

    this.searchKey = {
        stationFrom : { name: from, code: (all ? map[from] : null) },
        stationTo   : { name: to  , code: (all ? map[to]   : null) },
        stationVia  : [],
        transfer    : false
    };
    for(i = 0 ; i < vias.length ; i++){
        name = vias[i];
        this.searchKey.stationVia.push({ name: name, code: (all ? map[name] : null) });
    }
    this.searchKey.transfer = (this.searchKey.stationVia.length && dojo.byId('expSearchTransfer').checked) || false;

    var mode = (this.args.commuter ? parseInt(dojo.byId('expSearchPeriod').value, 10) : 0);
    var config = (this.args.config ? dojo.toJson(this.args.config) : null);

    var that = this;
    if(this.args.searchRoute){
        this.args.searchRoute(
            dojo.mixin({
                action  : 'searchRoute',
                empId   : this.args.empId,
                expDate : this.args.date,
                mode    : mode,
                config  : config
            }, this.searchKey),
            function(obj){
                that.resobj = obj;
                that.createBody();
            },
            function(event){
                that.resobj.routes = [];
                that.showError(teasp.message.getErrorMessage(event));
                that.createBody();
            }
        );
    }else{
        teasp.manager.request(
            'searchRoute',
            dojo.mixin({
                empId   : this.pouch.getEmpId(),
                expDate : this.args.date,
                mode    : mode,
                config  : config
            }, this.searchKey),
            this.pouch,
            { hideBusy : false },
            this,
            function(obj){
                that.resobj = obj;
                that.createBody();
            },
            function(event){
                that.resobj.routes = [];
                that.showError(teasp.message.getErrorMessage(event));
                that.createBody();
            }
        );
    }
};

/**
 * 往復／片道切り替えボタンクリック時の処理
 *
 */
teasp.dialog.ExpSearch.prototype.checkRoundTrip = function(){
    var chk = dojo.hasClass('expSearchResultArrow', 'pp_btn_oneway');
    dojo.byId('expSearchResultArrow').className = 'pp_base ' + (chk ? 'pp_btn_round' : 'pp_btn_oneway');
};

/**
 * 定期期間変更
 *
 */
teasp.dialog.ExpSearch.prototype.changeTicketPeriod = function(){
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
teasp.dialog.ExpSearch.prototype.clickSearchResultRow = function(_rowIndex){
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
teasp.dialog.ExpSearch.prototype.getSelectRowIndex = function(){
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
 * 経由地の駅名からコードがわかるものについて駅名とコードを紐づけるマップを作成
 *
 * @param {Array.<string>} names 駅名の配列
 * @return {Object} 駅名とコードをマッピングしたオブジェクト
 */
teasp.dialog.ExpSearch.prototype.codeMapping = function(names){
    var map = {};
    var storeSt = this.args.storeSt;
    for(var i = 0 ; i < names.length ; i++){
        var name = names[i];
        storeSt.fetch({
            query: { name: name },
            onItem: function(item){
                var v = storeSt.getValue(item, "code");
                if(v && v != ''){
                    map[name] = v;
                }
            }
        });
    }
    return map;
};

/**
 * エラー表示
 *
 * @param {?string} errmsg エラーメッセージ
 */
teasp.dialog.ExpSearch.prototype.showError = function(errmsg){
    if(!errmsg){
        dojo.style('expSearchResultErrorRow', 'display', 'none');
    }else{
        dojo.style('expSearchResultErrorRow', 'display', '');
        dojo.byId('expSearchResultError').innerHTML = errmsg.entitize();
    }
};
