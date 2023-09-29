teasp.provide('teasp.dialog.ApplySelect');

/**
 * 稟議選択ダイアログ
 *
 * @constructor
 * @extends teasp.dialog.Base
 *
 * @author cmpArai
 */
teasp.dialog.ApplySelect = function(){
    this.title = teasp.message.getLabel('tk10004330'); // 稟議を選択
    this.inited = false;
    this.opend = false;
    this.dialog = null;
    this.id = 'dialogApplySelect';
    this.content = '<div id="applySelectBody"><div style="width:712px;"><div style="float:left;margin-left:4px;margin-right:4px;"><div style="float:left;margin-left:4px;margin-right:4px;padding-top:2px;" id="columnApplySelectApplyNo"></div><div style="float:left;padding-top:1px;margin-right:4px;"><input type="text" id="applySelectApplyNo" value="" class="inputran" style="width:70px;padding:1px 2px;" /></div><div style="clear:both;"></div></div><div style="float:left;margin-left:4px;margin-right:4px;padding-top:2px;"><div style="float:left;margin-left:4px;margin-right:4px;padding-top:2px;" id="columnApplySelectType"></div><div style="float:left;padding-top:1px;margin-right:4px;"><select id="applySelectType" /></select></div><div style="clear:both;"></div></div><div style="float:left;margin-left:4px;margin-right:4px;padding-top:2px;"><div style="float:left;margin-left:4px;margin-right:4px;padding-top:2px;" id="columnApplySelectName"></div><div style="float:left;padding-top:1px;margin-right:4px;"><input type="text" id="applySelectName" value="" class="inputran" style="width:70px;padding:1px 2px;" /></div><div style="clear:both;"></div></div><div style="float:left;margin-left:4px;margin-right:4px;padding-top:2px;"><div style="float:left;margin-left:4px;margin-right:4px;padding-top:2px;" id="columnApplySelectOwner"></div><div style="float:left;padding-top:1px;margin-right:4px;"><input type="text" id="applySelectOwner" value="" class="inputran" style="width:70px;padding:1px 2px;" /></div><div style="clear:both;"></div></div><div style="float:left;"><input type="button" id="applySelectSearch" value="" style="padding:1px 8px;" /></div><div style="clear:both;"></div><div id="applySelectPageArea" style="margin-top:6px;"><div id="applySelectPage" style="margin-left:10px;"></div></div><table class="stone_table" style="margin-top:4px;"><tr><td class="head" style="width:20px;"></td><td class="head" id="applySelectThead1" style="width:100px;"><div style="display:table;margin:auto;"><div style="margin:2px;" id="applySelectHead1"></div></div></td><td class="head" id="applySelectThead2" style="width:110px;"><div style="display:table;margin:auto;"><div style="margin:2px;" id="applySelectHead2"></div></div></td><td class="head" id="applySelectThead3" style="width:170px;"><div style="display:table;margin:auto;"><div style="margin:2px;" id="applySelectHead3"></div></div></td><td class="head" id="applySelectThead4" style="width:90px;"><div style="display:table;margin:auto;"><div style="margin:2px;" id="applySelectHead4"></div></div></td><td class="head" id="applySelectThead5" style="width:120px;"><div style="display:table;margin:auto;"><div style="margin:2px;" id="applySelectHead5"></div></div></td><td class="head" id="applySelectThead6" style="width:100px;"><div style="display:table;margin:auto;"><div style="margin:2px;" id="applySelectHead6"></div></div></td></tr></table><div class="stone_div" id="applySelectDiv" style="width:710px;border:1px solid #cccccc;display:table;"><table class="stone_table"><tbody id="applySelectTbody"></tbody></table></div></div><div id="applySelectErrorArea"></div><table border="0" cellpadding="0" cellspacing="0" style="width:696px;margin-top:8px;margin-bottom:4px;"><tr><td style="text-align:right;"><input type="button" id="applySelectOk" value="" style="width:74px;margin-right:24px;padding:2px 4px;" /></td><td style="text-align:left;"><input type="button" id="applySelectCancel" value="" style="width:74px;margin-left:24px;padding:2px 4px;" /></td></tr></table></div>';
    this.eventHandles = {};
    this.onSearch = null;
    this.onSelect = null;
    this.searchObj = null;
    this.targets = null;
    this.searchResult = null;
    this.maxDivH = 216;
    this.rowMax = 20;
    this.sortMap = {
        1 : "ApplicationNo__c",
        2 : "Type__c",
        3 : "Name",
        4 : "Owner.Name",
        5 : "CreatedDate",
        6 : "ApplicationDate__c"
    };
};


teasp.dialog.ApplySelect.prototype = new teasp.dialog.Base();

teasp.dialog.ApplySelect.prototype.ready = function(){
    this.param = this.args.param;
    this.onSearch = this.args.onSearch;
    this.onSelect = this.args.onSelect;
};

/**
 * 画面生成
 * @override
 */
teasp.dialog.ApplySelect.prototype.preStart = function(){
    dojo.byId('applySelectOk').disabled = true;

    var select = dojo.byId('applySelectType');
    var types = this.param.types;
    dojo.create('option', { value: '', innerHTML: teasp.message.getLabel('tk10004480') }, select);
    for(var i = 0 ; i < types.length ; i++){
        dojo.create('option', { value: types[i][0], innerHTML: types[i][1] }, select);
    }

    dojo.byId('applySelectSearch').value = teasp.message.getLabel('search_btn_title'); // 検索
    dojo.byId('applySelectOk').value     = teasp.message.getLabel('select_btn_title'); // 選択
    dojo.byId('applySelectCancel').value = teasp.message.getLabel('cancel_btn_title'); // キャンセル

    teasp.message.setLabelEx('columnApplySelectApplyNo'  , 'tk10004310');    // 申請No
    teasp.message.setLabelEx('columnApplySelectType'     , 'tk10000262');    // 種別
    teasp.message.setLabelEx('columnApplySelectName'     , 'tk10004320');    // 件名
    teasp.message.setLabelEx('columnApplySelectOwner'    , 'tk10000067');    // 申請者

    teasp.message.setLabelEx('applySelectHead1'          , 'tk10004310');      // 申請No
    teasp.message.setLabelEx('applySelectHead2'          , 'tk10000262');      // 種別
    teasp.message.setLabelEx('applySelectHead3'          , 'tk10004320');      // 件名
    teasp.message.setLabelEx('applySelectHead4'          , 'tk10000067');      // 申請者
    teasp.message.setLabelEx('applySelectHead5'          , 'applyTime_label'); // 申請日時
    teasp.message.setLabelEx('applySelectHead6'          , 'tk10004340');      // 決済日

    dojo.connect(dojo.byId('applySelectSearch'), 'onclick', this, function(){
        teasp.util.showErrorArea(null, 'applySelectErrorArea');
        this.searchObj = {
            action      : "searchApplySimple",
            applyNo     : (dojo.byId('applySelectApplyNo').value || null), // 申請No
            type        : (dojo.byId('applySelectType').value    || null), // 種別
            name        : (dojo.byId('applySelectName').value    || null), // 件名
            owner       : (dojo.byId('applySelectOwner').value   || null), // 申請者
            pageNo      : 1,
            rowMax      : this.rowMax,
            errorAreaId : 'applySelectErrorArea'
        };
        this.onSearch(this.searchObj, this.searchRes(), this.searchError());
    });
    dojo.connect(dojo.byId('applySelectOk'), 'onclick', this, this.ok);
    dojo.connect(dojo.byId('applySelectCancel'), 'onclick', this, function(){
        this.close();
    });
    dojo.connect(dojo.byId('applySelectThead1'), 'onclick', this, this.clickHead(1));
    dojo.connect(dojo.byId('applySelectThead2'), 'onclick', this, this.clickHead(2));
    dojo.connect(dojo.byId('applySelectThead3'), 'onclick', this, this.clickHead(3));
    dojo.connect(dojo.byId('applySelectThead4'), 'onclick', this, this.clickHead(4));
    dojo.connect(dojo.byId('applySelectThead5'), 'onclick', this, this.clickHead(5));
    dojo.connect(dojo.byId('applySelectThead6'), 'onclick', this, this.clickHead(6));
};

/**
 *
 * @override
 */
teasp.dialog.ApplySelect.prototype.preShow = function(){
    teasp.util.showErrorArea(null, 'applySelectErrorArea');
    this.refresh(this.searchResult);
    return true;
};

/**
 *
 * @override
 */
teasp.dialog.ApplySelect.prototype.postShow = function(){
    this.adjustHeight();
    var div = dojo.byId('applySelectDiv');
    if(div.scrollTop){
        div.scrollTop = 0;
    }
};

/**
 * 稟議選択
 *
 * @override
 */
teasp.dialog.ApplySelect.prototype.ok = function(){
    var tbody = dojo.byId('applySelectTbody');
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var row = tbody.rows[i];
        var node = row.cells[0].firstChild;
        if(node.checked){
            var info = {
                targets  : this.targets,
                id       : node.nextSibling.value,
                applyNo  : node.nextSibling.nextSibling.value,
                type     : node.nextSibling.nextSibling.nextSibling.value,
                name     : node.nextSibling.nextSibling.nextSibling.nextSibling.value
            };
            this.onSelect(info);
            this.close();
            break;
        }
    }
};

teasp.dialog.ApplySelect.prototype.searchRes = function(){
    return dojo.hitch(this, function(res){
        this.refresh.apply(this, [res]);
    });
};

teasp.dialog.ApplySelect.prototype.searchError = function(){
    return dojo.hitch(this, function(res){
        this.receiveError.apply(this, [res]);
    });
};

teasp.dialog.ApplySelect.prototype.refresh = function(res){
    this.searchResult = res;
    var applys = ((res && res.applyList) || []);
    teasp.logic.convert.excludeNameSpace(applys);

    dojo.byId('applySelectOk').disabled = true;
    dojo.byId('applySelectApplyNo').value = ((res && res.applyNo) || '');
    dojo.byId('applySelectType').value    = ((res && res.type)    || '');
    dojo.byId('applySelectName').value    = ((res && res.name)    || '');
    dojo.byId('applySelectOwner').value   = ((res && res.owner)   || '');

    if(res){
        this.setPaging(dojo.byId('applySelectPage'), res);
        this.displaySort(res);
    }
    var rowMax = (res ? res.rowMax : this.rowMax);
    var rowCnt = (applys.length < rowMax ? applys.length : rowMax);
    if(rowCnt < 12){
        rowCnt = 12;
    }

    var tbody = dojo.byId('applySelectTbody');
    while(tbody.firstChild){
        dojo.destroy(tbody.firstChild);
    }
    for(var i = 0 ; i < rowCnt ; i++){
        var a = (i < applys.length ? applys[i] : null);
        var row = dojo.create('tr', { className: 'sele ' + ((i%2)==0? 'even' : 'odd') }, tbody);
        dojo.connect(row, 'ondblclick', this, this.ok);
        var cell = dojo.create('td', { style: { width:"22px", textAlign:"center", border:"none" } }, row);
        if(a){
            var radio = dojo.create('input', { type:'radio', name: 'applySelectRadio' }, cell);
            dojo.connect(radio, 'onclick', this, function(e){
                dojo.byId('applySelectOk').disabled = false;
            });
            dojo.create('input', { type:'hidden', value: a.Id               }, cell);
            dojo.create('input', { type:'hidden', value: a.ApplicationNo__c }, cell);
            dojo.create('input', { type:'hidden', value: a.Type__c          }, cell);
            dojo.create('input', { type:'hidden', value: a.Name             }, cell);
        }else{
            dojo.create('div', { innerHTML: '&nbsp;' }, cell);
        }

        cell = dojo.create('td', { width:'102px', style: { border:"none" } }, row); // 申請No
        cell.style.textAlign = 'left';
        dojo.create('div', { innerHTML: ((a && a.ApplicationNo__c) || ''), style: { wordBreak:"break-all" } }, cell);


        cell = dojo.create('td', { width:'112px', style: { border:"none" } }, row); // 種別
        cell.style.textAlign = 'left';
        dojo.create('div', { innerHTML: ((a && a.Type__c) || ''), style: { wordBreak:"break-all" } }, cell);

        cell = dojo.create('td', { width:'172px', style: { border:"none" } }, row); // 件名
        cell.style.textAlign = 'left';
        dojo.create('div', { innerHTML: ((a && a.Name) || ''), style: { wordBreak:"break-all" } }, cell);

        cell = dojo.create('td', { width:'92px', style: { border:"none" } }, row); // 申請者
        cell.style.textAlign = 'left';
        dojo.create('div', { innerHTML: ((a && a.Owner.Name) || ''), style: { wordBreak:"break-all" } }, cell);

        cell = dojo.create('td', { width:'122px', style: { border:"none" } }, row); // 申請日時
        cell.style.textAlign = 'left';
        dojo.create('div', {
            innerHTML : (a ? teasp.util.date.formatDateTime(teasp.logic.convert.valDateTime(a.CreatedDate), 'SLA-HM') : ''),
            style : { wordBreak:"break-all" }
        }, cell);

        cell = dojo.create('td', { width:'86px', style: { border:"none" } }, row); // 決済日
        cell.style.textAlign = 'left';
        dojo.create('div', {
            innerHTML : (a ? teasp.util.date.formatDate(teasp.logic.convert.valDate(a.ApplicationDate__c), 'SLA') : ''),
            style : { wordBreak:"break-all" }
        }, cell);

        dojo.connect(row, 'onclick', this, function(e){
            var n = e.target;
            while(n && n.nodeName != 'TR'){
                n = n.parentNode;
            }
            if(n && n.nodeName == 'TR' && n.cells[0].firstChild.tagName == 'INPUT'){
                n.cells[0].firstChild.checked = true;
                dojo.byId('applySelectOk').disabled = false;
            }
        });
    }
    this.adjustHeight();
    dojo.byId('applySelectDiv').scrollTop = 0;
};

teasp.dialog.ApplySelect.prototype.adjustHeight = function(){
    var tbody = dojo.byId('applySelectTbody');
    var h = 0;
    if(dojo.isIE){
        for(var r = 0 ; r < tbody.rows.length ; r++){
            var rh = 0;
            for(var c = 0 ; c < tbody.rows[r].cells.length ; c++){
                var ch = tbody.rows[r].cells[c].clientHeight;
                if(rh < ch){
                    rh = ch;
                }
            }
            h += rh;
        }
    }else{
        for(var r = 0 ; r < tbody.rows.length ; r++){
            h += (tbody.rows[r].clientHeight);
        }
    }
    var div = dojo.byId('applySelectDiv');
    dojo.style(div, 'display', 'block');
    dojo.style(div, 'height', this.maxDivH + 'px');
};

teasp.dialog.ApplySelect.prototype.search = function(pg_){
    var pg = pg_;
    return dojo.hitch(this, function(){
        this.searchObj.pageNo = pg;
        this.onSearch(this.searchObj, this.searchRes(), this.searchError());
    });
};

teasp.dialog.ApplySelect.prototype.clickHead = function(sortIndex_){
    var sortIndex = sortIndex_;
    return dojo.hitch(this, function(){
        if(this.searchObj){
            var sortKey = this.sortMap[sortIndex];
            if(this.searchObj.sortKey == sortKey){
                this.searchObj.sortOrder = (this.searchObj.sortOrder == 'desc' ? null : 'desc');
            }else{
                this.searchObj.sortOrder = null;
            }
            this.searchObj.pageNo = 1;
            this.searchObj.sortKey = sortKey;
            this.onSearch(this.searchObj, this.searchRes(), this.searchError());
        }
    });
};

teasp.dialog.ApplySelect.prototype.setPaging = function(div, sp){
    while(div.firstChild){
        dojo.destroy(div.firstChild);
    }
    var pgcnt = Math.ceil(sp.cntAll / sp.rowMax);
    var pp = dojo.create('div', { className:'pageDiv', innerHTML: '&lt;' }, div);
    if(sp.pageNo > 1){
        dojo.style(pp, 'color' , 'blue');
        dojo.style(pp, 'cursor', 'pointer');
        dojo.connect(pp, 'onclick', this, this.search(sp.pageNo - 1));
    }else{
        dojo.style(pp, 'color' , 'gray');
    }
    for(var n = 1 ; n <= pgcnt ; n++){
        var p = dojo.create('div', { className:'pageDiv', innerHTML: n }, div);
        if(sp.pageNo == n){
            dojo.style(p, 'color' , 'gray');
        }else{
            dojo.style(p, 'color' , 'blue');
            dojo.style(p, 'cursor', 'pointer');
            dojo.connect(p, 'onclick', this, this.search(n));
        }
    }
    var pn = dojo.create('div', { className:'pageDiv', innerHTML: '&gt;' }, div);
    if(sp.pageNo < pgcnt){
        dojo.style(pn, 'color' , 'blue');
        dojo.style(pn, 'cursor', 'pointer');
        dojo.connect(pn, 'onclick', this, this.search(sp.pageNo + 1));
    }else{
        dojo.style(pn, 'color' , 'gray');
    }

    var beg = ((sp.pageNo - 1) * sp.rowMax) + 1;
    var end = beg + sp.rowMax - 1;
    if(end > sp.cntAll){
        end = sp.cntAll;
    }
    var msg = '';
    if(sp.cntAll > 0){
        if(sp.cntAll <= sp.rowMax){
            msg = teasp.message.getLabel('tk10003230', sp.cntAll); // {0} 件を表示
        }else{
            msg = teasp.message.getLabel('tk10003240', sp.cntAll, (beg || 1), (end || 1)); // {0} 件中 {1}～{2} 件を表示
        }
    }
    dojo.create('div', { className:'pageDiv', style: { width:"10px", height:"2px" } }, div);
    dojo.create('div', { innerHTML: msg, style: { whiteSpace:"nowrap", display:"table", "float":"left" } }, div);
    dojo.create('div', { style: { clear:"both" } }, div);
};

teasp.dialog.ApplySelect.prototype.displaySort = function(sp){
    dojo.query('.head', 'applySelectBody').forEach(function(elem){
        if(elem.nodeName == 'TD' && elem.firstChild){
            var div = elem.firstChild.firstChild;
            if(div){
                var icon = div.nextSibling;
                if(this.sortMap[elem.cellIndex] == sp.sortKey){
                    if(icon){
                        icon.className = 'pp_base pp_ico_sort_' + (sp.sortOrder ? 'desc' : 'asc');
                    }else{
                        dojo.style(div, 'float', 'left');
                        icon = dojo.create('div', {
                            className : 'pp_base pp_ico_sort_' + (sp.sortOrder ? 'desc' : 'asc'),
                            style     : { "float":"left", marginRight:"auto", marginTop:"4px" }
                        }, elem.firstChild);
                        dojo.create('div', { style: { clear:"both" } }, elem.firstChild);
                    }
                }else if(icon){
                    if(icon.nextSibling){
                        dojo.destroy(icon.nextSibling);
                    }
                    dojo.destroy(icon);
                    dojo.style(div, 'float', 'none');
                }
            }
        }
    }, this);
};

teasp.dialog.ApplySelect.prototype.receiveError = function(res){
    teasp.util.showErrorArea(res, 'applySelectErrorArea');
};
