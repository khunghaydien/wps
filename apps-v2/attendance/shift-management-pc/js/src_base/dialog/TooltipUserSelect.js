teasp.provide('teasp.dialog.UserSelect');
/**
 * 社員選択ツールチップダイアログ
 *
 * @constructor
 */
teasp.dialog.UserSelect = function(thisObject, onSearch, onSelect){
    this.thisObject = thisObject;
    this.inited = false;
    this.opend = false;
    this.dialog = null;
    this.id = 'tooltipUserSelect';
    this.content = '<div id="userSelectBody"><div style="width:482px;"><div style="margin:0px 0px 4px 0px;"><table class="pane_table" style="width:100%;background-color:#eaf4fc;"><tr><td style="text-align:left;padding:2px 4px;" ><div id="userSelectTitle"></div></td><td style="text-align:right;padding:2px 4px;"><div id="userSelectClose"></div></td></tr></table></div><div style="float:left;margin-left:4px;margin-right:10px;padding-top:2px;" id="columnUserSelectName"></div><div style="float:left;padding-top:1px;margin-right:4px;"><input type="text" id="userSelectName" value="" class="inputran" style="width:100px;padding:1px 2px;" /></div><div style="float:left;"><input type="button" id="userSelectSearch" value="" style="padding:1px 8px;" /></div><div style="clear:both;"></div><div id="userSelectPageArea"><div id="userSelectPage" style="margin-left:10px;"></div></div><table class="stone_table" style="margin-top:4px;"><tr><td class="head" style="width:20px;"></td><td class="head" id="userSelectHeadUserName" style="width:100px;"><div style="margin:auto;" class="disp_table"><div style="margin:2px;" id="userSelectHead1"></div></div></td><td class="head" id="userSelectHeadProfile" style="width:120px;"><div style="margin:auto;" class="disp_table"><div style="margin:2px;" id="userSelectHead2"></div></div></td><td class="head" id="userSelectHeadTitle" style="width:100px;"><div style="margin:auto;" class="disp_table"><div style="margin:2px;" id="userSelectHead3"></div></div></td><td class="head" id="userSelectHeadManager" style="width:140px;"><div style="margin:auto;" class="disp_table"><div style="margin:2px;" id="userSelectHead4"></div></div></td></tr></table><div class="stone_div" id="userSelectDiv" style="width:480px;border:1px solid #cccccc;"></div></div><div id="userSelectErrorArea"></div><table border="0" cellpadding="0" cellspacing="0" style="width:466px;margin-top:4px;margin-bottom:2px;"><tr><td style="text-align:right;"><input type="button" id="userSelectOk" value="" style="width:74px;margin-right:24px;padding:2px 4px;" /></td><td style="text-align:left;"><input type="button" id="userSelectCancel" value="" style="width:74px;margin-left:24px;padding:2px 4px;" /></td></tr></table></div>';
    this.eventHandles = [];
    this.onSearch = onSearch;
    this.onSelect = onSelect;
    this.searchObj = null;
    this.targets = null;
    this.maxDivH = 120;
    this.sortMap = {
        1 : "Name",
        2 : "Profile.Name",
        3 : "Title",
        4 : "Manager.Name"
    };
    this._init();
};

teasp.dialog.UserSelect.prototype.getDialog = function(targets){
    if(targets){
        this.targets = targets;
    }
    return this.dialog;
};

/**
 *
 */
teasp.dialog.UserSelect.prototype._init = function(){
    if(this.inited){
        return;
    }
    this.inited = true;
    var o = {
        id       : this.id,
        content  : this.content,
        onKeyPress : dojo.hitch(this, function(e){
            if(e.keyCode === 27){
                dijit.popup.close(this.dialog);
            }
        })/*,
        onMouseLeave: function(e){
            dijit.popup.close(that.dialog);
        }*/
    };
    this.dialog = new dijit.TooltipDialog(o);
    this.dialog.startup();
    dojo.connect(this.dialog, 'onOpen', this, function(){
        console.log('dialog-onOpen');
        if(!this.opened){
            dojo.style('userSelectTitle', 'color', '#555555');
            dojo.style('userSelectTitle', 'font-weight', 'bold');
            dojo.byId('userSelectTitle').innerHTML = teasp.message.getLabel('tk10000444'); // ユーザを選択してください
            var xdiv = dojo.byId('userSelectClose');
            xdiv.style.color = '#A0A0A0';
            xdiv.style.cursor = 'pointer';
            xdiv.innerHTML = 'X';
            dojo.connect(xdiv, 'onclick', this, function(){
                dijit.popup.close(this.dialog);
            });
            dojo.byId('userSelectOk').disabled = true;

            dojo.byId('userSelectSearch').value = teasp.message.getLabel('search_btn_title'); // 検索
            dojo.byId('userSelectOk').value     = teasp.message.getLabel('select_btn_title'); // 選択
            dojo.byId('userSelectCancel').value = teasp.message.getLabel('cancel_btn_title'); // キャンセル

            teasp.message.setLabelEx('columnUserSelectName'     , 'tk10000390');    // ユーザ名
            teasp.message.setLabelEx('userSelectHead1'          , 'tk10000390');    // ユーザ名
            teasp.message.setLabelEx('userSelectHead2'          , 'tk10000456');    // プロファイル
            teasp.message.setLabelEx('userSelectHead3'          , 'title_label');   // 役職
            teasp.message.setLabelEx('userSelectHead4'          , 'tk10000458');    // マネージャ

            dojo.connect(dojo.byId('userSelectSearch'), 'onclick', this, function(){
                teasp.util.showErrorArea(null, 'userSelectErrorArea');
                this.searchObj = { action: "searchUserSimple", userName: dojo.byId('userSelectName').value, pageNo: 1, rowMax: 20 };
                this.onSearch(this.searchObj, this.searchRes(), this.searchError());
            });
            dojo.connect(dojo.byId('userSelectOk'), 'onclick', this, function(){
                var tbody = dojo.byId('userSelectTbody');
                for(var i = 0 ; i < tbody.rows.length ; i++){
                    var row = tbody.rows[i];
                    var node = row.cells[0].firstChild;
                    if(node.checked){
                        var info = {
                            targets  : this.targets,
                            userId   : node.nextSibling.value,
                            userName : node.nextSibling.nextSibling.value
                        };
                        this.onSelect(info);
                        dijit.popup.close(this.dialog);
                    }
                }
            });
            dojo.connect(dojo.byId('userSelectCancel'), 'onclick', this, function(){
                dijit.popup.close(this.dialog);
            });
            dojo.connect(dojo.byId('userSelectHeadUserName'), 'onclick', this, this.clickHead(1));
            dojo.connect(dojo.byId('userSelectHeadProfile') , 'onclick', this, this.clickHead(2));
            dojo.connect(dojo.byId('userSelectHeadTitle')   , 'onclick', this, this.clickHead(3));
            dojo.connect(dojo.byId('userSelectHeadManager') , 'onclick', this, this.clickHead(4));
        }
        teasp.util.showErrorArea(null, 'userSelectErrorArea');
        var div = dojo.byId('userSelectDiv');
        if(div.clientHeight > this.maxDivH){
            dojo.toggleClass(div, 'disp_block', true );
            dojo.toggleClass(div, 'disp_table', false);
            dojo.style(div, 'height', this.maxDivH + 'px');
        }
        this.opened = true;
    });
};

teasp.dialog.UserSelect.prototype.searchRes = function(){
    var that = this;
    return function(res){
        that.refresh.apply(that, [res]);
    };
};

teasp.dialog.UserSelect.prototype.searchError = function(){
    var that = this;
    return function(res){
        that.receiveError.apply(that, [res]);
    };
};

teasp.dialog.UserSelect.prototype.refresh = function(res){
    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    var users = ((res && res.users) || []);

    dojo.byId('userSelectOk').disabled = true;
    dojo.byId('userSelectName').value = (res.userName || '');
    this.setPaging(dojo.byId('userSelectPage'), res);
    this.displaySort(res);

    var div = dojo.byId('userSelectDiv');
    while(div.firstChild){
        dojo.destroy(div.firstChild);
    }
    var table = dojo.create('table', { className: 'stone_table' });
    var tbody = dojo.create('tbody', { id: 'userSelectTbody'}, table);

    for(var i = 0 ; i < users.length ; i++){
        var u = users[i];
        var row = dojo.create('tr', { className: 'sele ' + ((i%2)==0? 'even' : 'odd') }, tbody);
        var cell = dojo.create('td', { style: { width:"22px", textAlign:"center", border:"none" } }, row);
        var radio = dojo.create('input', { type:'radio', name: 'userSelectRadio', id: 'userSelectRadio' + (i + 1) }, cell);
        this.eventHandles.push(dojo.connect(radio, 'onclick', this, function(e){
            dojo.byId('userSelectOk').disabled = false;
            if(dojo.isIE <= 7){
                e = (e || window.event);
                var n = (e.target || e.srcElement);
                this.checkSelectRadio(n.id);
            }
        }));
        dojo.create('input', { type:'hidden', value: u.Id   }, cell);
        dojo.create('input', { type:'hidden', value: u.Name }, cell);

        cell = dojo.create('td', { width:'102px', style: { border:"none", textAlign:"left" } }, row);
        dojo.create('div', { innerHTML: u.Name         , style: { wordBreak:"break-all" } }, cell);

        cell = dojo.create('td', { width:'122px', style: { border:"none", textAlign:"left" } }, row);
        dojo.create('div', { innerHTML: u.Profile.Name , style: { wordBreak:"break-all" } }, cell);

        cell = dojo.create('td', { width:'102px', style: { border:"none", textAlign:"left" } }, row);
        dojo.create('div', { innerHTML: (u.Title || ''), style: { wordBreak:"break-all" } }, cell);

        cell = dojo.create('td', { width:'126px', style: { border:"none", textAlign:"left" } }, row);
        dojo.create('div', { innerHTML: ((u.Manager && u.Manager.Name) || ''), style: { wordBreak:"break-all" } }, cell);

        this.eventHandles.push(dojo.connect(row, 'onclick', this, function(e){
            e = (e || window.event);
            var n = (e.target || e.srcElement);
            while(n && n.nodeName != 'TR'){
                n = n.parentNode;
            }
            if(n && n.nodeName == 'TR'){
                n.cells[0].firstChild.checked = true;
                dojo.byId('userSelectOk').disabled = false;
                if(dojo.isIE <= 7){
                    this.checkSelectRadio(n.cells[0].firstChild.id);
                }
            }
        }));
    }
    div.appendChild(table);
    this.adjustHeight();
};

teasp.dialog.UserSelect.prototype.checkSelectRadio = function(tid){
    if(!tid){
        return;
    }
    var n = dojo.byId('userSelectTbody');
    if(n && n.nodeName == 'TBODY'){
        var rcnt = n.rows.length;
        for(var i = 1 ; i <= rcnt ; i++){
            var id = 'userSelectRadio' + i;
            dojo.byId(id).checked = (id == tid);
        }
    }
};

teasp.dialog.UserSelect.prototype.adjustHeight = function(){
    var tbody = dojo.byId('userSelectTbody');
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
    var div = dojo.byId('userSelectDiv');
    dojo.toggleClass(div, 'disp_table', h < this.maxDivH);
    dojo.toggleClass(div, 'disp_block', h >= this.maxDivH);
    dojo.style(div, 'height', (h < this.maxDivH ? h : this.maxDivH) + 'px');
};

teasp.dialog.UserSelect.prototype.search = function(pg_){
    var pg = pg_;
    var that = this;
    return function(){
        that.searchObj.pageNo = pg;
        that.onSearch(that.searchObj, that.searchRes(), that.searchError());
    };
};

teasp.dialog.UserSelect.prototype.clickHead = function(sortIndex_){
    var sortIndex = sortIndex_;
    var that = this;
    return function(){
        if(that.searchObj){
            var sortKey = that.sortMap[sortIndex];
            if(that.searchObj.sortKey == sortKey){
                that.searchObj.sortOrder = (that.searchObj.sortOrder == 'desc' ? null : 'desc');
            }else{
                that.searchObj.sortOrder = null;
            }
            that.searchObj.pageNo = 1;
            that.searchObj.sortKey = sortKey;
            that.onSearch(that.searchObj, that.searchRes(), that.searchError());
        }
    };
};

teasp.dialog.UserSelect.prototype.setPaging = function(div, sp){
    while(div.firstChild){
        dojo.destroy(div.firstChild);
    }
    var pgcnt = Math.ceil(sp.cntAll / sp.rowMax);
    var pp = dojo.create('div', { className:'pageDiv', innerHTML: '&lt;' }, div);
    if(sp.pageNo > 1){
        dojo.style(pp, 'color' , 'blue');
        dojo.style(pp, 'cursor', 'pointer');
        this.eventHandles.push(dojo.connect(pp, 'onclick', this, this.search(sp.pageNo - 1)));
    }else{
        dojo.style(pp, 'color' , 'gray');
    }
    var boxs = teasp.util.getPageBox(pgcnt, sp.pageNo, 4, 5, 4);
    for(var i = 0 ; i < boxs.length ; i++){
        var n = boxs[i];
        if(n === null){
            dojo.create('div', { className:'pageDiv', innerHTML: '･･', style: { color:"gray" } }, div);
            continue;
        }
        var p = dojo.create('div', { className:'pageDiv', innerHTML: n }, div);
        if(sp.pageNo == n){
            dojo.style(p, 'color' , 'gray');
        }else{
            dojo.style(p, 'color' , 'blue');
            dojo.style(p, 'cursor', 'pointer');
            this.eventHandles.push(dojo.connect(p, 'onclick', this, this.search(n)));
        }
    }
    var pn = dojo.create('div', { className:'pageDiv', innerHTML: '&gt;' }, div);
    if(sp.pageNo < pgcnt){
        dojo.style(pn, 'color' , 'blue');
        dojo.style(pn, 'cursor', 'pointer');
        this.eventHandles.push(dojo.connect(pn, 'onclick', this, this.search(sp.pageNo + 1)));
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
            msg = teasp.message.getLabel((sp.cntAll==teasp.constant.COUNT_LIMIT ? 'tk10003241' : 'tk10003240'), sp.cntAll, (beg || 1), (end || 1)); // {0} 件中 {1}～{2} 件を表示
        }
    }
    dojo.create('div', { className:'pageDiv', style: { width:"10px", height:"2px" } }, div);
    dojo.create('div', { innerHTML: msg, style: { whiteSpace:"nowrap", "float":"left" }, className:'disp_table' }, div);
    dojo.create('div', { style: { clear:"both" } }, div);
};

teasp.dialog.UserSelect.prototype.displaySort = function(sp){
    var that = this;
    dojo.query('.head', 'userSelectBody').forEach(function(elem){
        if(elem.nodeName == 'TD' && elem.firstChild){
            var div = elem.firstChild.firstChild;
            if(div){
                var icon = div.nextSibling;
                if(that.sortMap[elem.cellIndex] == sp.sortKey){
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
    });
};

teasp.dialog.UserSelect.prototype.receiveError = function(res){
    teasp.util.showErrorArea(res, 'userSelectErrorArea');
};
