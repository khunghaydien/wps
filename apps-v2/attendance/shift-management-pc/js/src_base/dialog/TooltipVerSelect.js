teasp.provide('teasp.dialog.VerSelect');
/**
 * 選択ツールチップダイアログ
 *
 * @constructor
 */
teasp.dialog.VerSelect = function(thisObject, hidObj, onSearch, onSelect){
    this.thisObject = thisObject;
    this.inited = false;
    this.opend = false;
    this.dialog = null;
    this.id = 'tooltipVerSelect';
    this.content = '<div id="verSelectBody"><div><div style="margin:0px 0px 4px 0px;"><table class="pane_table" style="width:100%;background-color:#eaf4fc;"><tr><td style="text-align:left;padding:2px 4px;" ><div id="verSelectTitle"></div></td><td style="text-align:right;padding:2px 4px;"><div id="verSelectClose"></div></td></tr></table></div><div id="verSelectInputArea"></div><div id="verSelectPageArea"><div id="verSelectPage" style="margin-left:10px;"></div></div><table class="stone_table" style="margin-top:4px;"><tbody id="verSelectHead"></tbody></table><div class="stone_div" id="verSelectDiv" style="border:1px solid #cccccc;" class="disp_table"></div></div><div id="verSelectErrorArea"></div><table border="0" cellpadding="0" cellspacing="0" style="margin-top:4px;margin-bottom:2px;" id="verSelectButtonArea"><tr><td style="text-align:right;"><input type="button" id="verSelectOk" value="" style="width:74px;margin-right:24px;padding:2px 4px;" /></td><td style="text-align:left;"><input type="button" id="verSelectCancel" value="" style="width:74px;margin-left:24px;padding:2px 4px;" /></td></tr></table></div>';
    this.eventHandles = [];
    this.hidObj    = hidObj;
    this.onSearch  = onSearch;
    this.onSelect  = onSelect;
    this.searchObj = null;
    this.result    = null;
    this.targets   = null;
    this.maxDivH   = 120;
    this.sortList  = [];
    this.HIDEKEYS = ['Id', 'Name'];
    teasp.prefixBar = 'teamspirit__';
    this.srchData = {
        title : teasp.message.getLabel('tm20001030'), // ジョブ名
        searchFields : [
            { name: teasp.message.getLabel('tm20001020'), key: 'jobCode'   , type: 'text', size: 70  }, // ジョブコード
            { name: teasp.message.getLabel('tm20001030'), key: 'jobName'   , type: 'text', size: 120 }  // ジョブ名
        ],
        columns : [
            { name: teasp.message.getLabel('tm20001020'), key: 'jobCode'   , apiKey: 'JobCode__c'    , align: 'left', size: 180 }, // ジョブコード
            { name: teasp.message.getLabel('tm20001030'), key: 'jobName'   , apiKey: 'Name'          , align: 'left', size: 340 }  // ジョブ名
        ],
        searchList: [
            {
                soqlFields : [
                      "Id"
                    , "JobCode__c"
                    , "Name"
                    , "JobAssignClass__c"
                    , "StartDate__c"
                    , "EndDate__c"
                ],
                soqlFrom   : "AtkJob__c",
                soqlWhere1 : "Active__c = true and AssignLimit__c = false",
                soqlWhere2 : "JobCode__c like '{0}%'",
                soqlWhere3 : "Name like '%{0}%'",
                soqlWhere4 : "(StartDate__c = null or StartDate__c <= {0}) and (EndDate__c = null or EndDate__c >= {0})",
                procSkip   : function(){
                    return false;
                },
                procWhere  : dojo.hitch(this, function(info){
                    var td = teasp.util.date.formatDate(teasp.util.date.getToday());
                    var wh = [];
                    wh.push(info.soqlWhere1);
                    var n = dojo.byId('verSelectInput_jobCode');
                    if(n && n.value){
                        wh.push(teasp.dialog.VerSelect.getString(info.soqlWhere2, n.value));
                    }
                    n = dojo.byId('verSelectInput_jobName');
                    if(n && n.value){
                        wh.push(teasp.dialog.VerSelect.getString(info.soqlWhere3, n.value));
                    }
                    wh.push(teasp.dialog.VerSelect.getString(info.soqlWhere4, td));
                    wh.push(this.jobAssignClass ? "(JobAssignClass__c like '%:" + this.jobAssignClass + ":%' or JobAssignClass__c = null)" : "JobAssignClass__c = null");
                    return wh.join(' and ');
                }),
                procList   : dojo.hitch(this, function(records){
                    teasp.util.excludeNameSpace(records);
                    this.HIDEKEYS = ['Id','Name','JobAssignClass__c','StartDate__c','EndDate__c'];
                    return records;
                })
            },
            {
                soqlFields : [
                      "JobId__c"
                    , "JobId__r.JobCode__c"
                    , "JobId__r.Name"
                    , "JobId__r.JobAssignClass__c"
                    , "JobId__r.StartDate__c"
                    , "JobId__r.EndDate__c"
                ],
                soqlFrom   : "AtkJobAssign__c",
                soqlWhere1 : "EmpId__c = '{0}' and JobId__r.Active__c = true and JobId__r.AssignLimit__c = true",
                soqlWhere2 : "JobId__r.JobCode__c like '{0}%'",
                soqlWhere3 : "JobId__r.Name like '%{0}%'",
                soqlWhere4 : "(JobId__r.StartDate__c = null or JobId__r.StartDate__c <= {0}) and (JobId__r.EndDate__c = null or JobId__r.EndDate__c >= {0})",
                procSkip   : function(){
                    var n = dojo.byId('verSelectInput_empId');
                    return (n && n.value ? false : true);
                },
                procWhere  : dojo.hitch(this, function(info){
                    var td = teasp.util.date.formatDate(teasp.util.date.getToday());
                    var wh = [];
                    var n = dojo.byId('verSelectInput_empId');
                    if(n && n.value){
                        wh.push(teasp.dialog.VerSelect.getString(info.soqlWhere1, n.value));
                    }
                    n = dojo.byId('verSelectInput_jobCode');
                    if(n && n.value){
                        wh.push(teasp.dialog.VerSelect.getString(info.soqlWhere2, n.value));
                    }
                    n = dojo.byId('verSelectInput_jobName');
                    if(n && n.value){
                        wh.push(teasp.dialog.VerSelect.getString(info.soqlWhere3, n.value));
                    }
                    wh.push(teasp.dialog.VerSelect.getString(info.soqlWhere4, td));
                    return wh.join(' and ');
                }),
                procList   : dojo.hitch(this, function(records){
                    teasp.util.excludeNameSpace(records);
                    var l = [];
                    for(var i = 0 ; i < records.length ; i++){
                        l.push({
                            Id                : records[i].JobId__c,
                            JobCode__c        : records[i].JobId__r.JobCode__c,
                            Name              : records[i].JobId__r.Name,
                            JobAssignClass__c : records[i].JobId__r.JobAssignClass__c,
                            StartDate__c      : records[i].JobId__r.StartDate__c,
                            EndDate__c        : records[i].JobId__r.EndDate__c
                        });
                    }
                    this.HIDEKEYS = ['Id','Name','JobAssignClass__c','StartDate__c','EndDate__c'];
                    return l;
                })
            }
        ],
        procList : function(records){
            var mp = {};
            var l = [];
            for(var i = 0 ; i < records.length ; i++){
                var o = records[i];
                if(!mp[o.Id]){
                    mp[o.Id] = 1;
                    l.push(o);
                }
            }
            return l;
        }
    };
    this._init();
};

teasp.dialog.VerSelect.prototype.setJobAssignClass = function(jobAssignClass){
    this.jobAssignClass = jobAssignClass;
};

teasp.dialog.VerSelect.prototype.getDialog = function(targets){
    if(targets){
        this.targets = targets;
    }
    return this.dialog;
};

/**
 *
 */
teasp.dialog.VerSelect.prototype._init = function(){
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
            dojo.style('verSelectTitle', 'color', '#555555');
            dojo.style('verSelectTitle', 'font-weight', 'bold');
            dojo.byId('verSelectTitle').innerHTML = teasp.message.getLabel('tk10004250', this.srchData.title); // を選択してください

            // 検索条件入力エリア作成
            var div = dojo.byId('verSelectInputArea');
            for(var c = 0 ; c < this.srchData.searchFields.length ; c++){
                var o = this.srchData.searchFields[c];
                var row = dojo.create('tr', null, dojo.create('tbody', null, dojo.create('table', { className: 'pane_table', style: { "float": "left" } }, div)));
                var cell = dojo.create('td', null, row);
                dojo.create('div', { innerHTML: o.name, style: { padding: '1px 8px' } }, cell);
                cell = dojo.create('td', null, row);
                dojo.create('input', {
                    type      :'text',
                    id        : 'verSelectInput_' + o.key,
                    className : 'inputran',
                    style     : { width:'' + o.size + 'px', padding: '1px 2px' }
                }, cell);
            }
            dojo.create('input', { type: 'button', id: 'verSelectSearch', style: { padding: '1px 8px', marginLeft:'8px' } }, dojo.create('div', { style: { "float": "left"} }, div));
            if(this.hidObj){
                for(var key in this.hidObj){
                    if(!this.hidObj.hasOwnProperty(key)){
                        continue;
                    }
                    dojo.create('input', {
                        type  : 'hidden',
                        id    : 'verSelectInput_' + key,
                        value : (this.hidObj[key] || '')
                    }, div);
                }
            }
            dojo.create('div', { style: { clear: "both" } }, div);

            // 表ヘッダ部作成
            var tbody = dojo.byId('verSelectHead');
            var row = dojo.create('tr', null, tbody);
            var cell = dojo.create('td', { style: { width:'22px' }, className: 'head' }, row);
            var w = 22;
            for(var c = 0 ; c < this.srchData.columns.length ; c++){
                var o = this.srchData.columns[c];
                var ow = o.size;
                if(c == (this.srchData.columns.length - 1)){
                    ow += 19;
                }
                w += ow;
                cell = dojo.create('td', {
                    style     : { width:'' + ow + 'px' },
                    className : 'head',
                    name      : o.key
                }, row);
                dojo.create('div', { innerHTML : o.name }, dojo.create('div', { className: 'disp_table', style: { margin: 'auto' } }, cell));
                dojo.connect(cell, 'onclick', this, this.clickHead(o.key));
            }
            tbody.parentNode.style.width = '' + w + 'px';
            dojo.byId('verSelectButtonArea').style.width = '' + w + 'px';

            var bdiv = dojo.byId('verSelectBody');
            bdiv.firstChild.style.width = '' + w + 'px';

            var xdiv = dojo.byId('verSelectClose');
            xdiv.style.color = '#A0A0A0';
            xdiv.style.cursor = 'pointer';
            xdiv.innerHTML = 'X';
            dojo.connect(xdiv, 'onclick', this, function(){
                dijit.popup.close(this.dialog);
            });

            dojo.byId('verSelectOk').disabled = true;

            dojo.byId('verSelectSearch').value = teasp.message.getLabel('search_btn_title'); // 検索
            dojo.byId('verSelectOk').value     = teasp.message.getLabel('select_btn_title'); // 選択
            dojo.byId('verSelectCancel').value = teasp.message.getLabel('cancel_btn_title'); // キャンセル

            dojo.connect(dojo.byId('verSelectSearch'), 'onclick', this, this.doSearch);

            dojo.connect(dojo.byId('verSelectOk'), 'onclick', this, function(){
                tbody = dojo.byId('verSelectTbody');
                for(var i = 0 ; i < tbody.rows.length ; i++){
                    var row = tbody.rows[i];
                    var node = row.cells[0].firstChild;
                    if(node.checked){
                        var p1 = node.nextSibling;
                        var p2 = p1.nextSibling;
                        var info = {
                            targets : this.targets,
                            id      : p1.value,
                            name    : p2.value,
                            values  : []
                        };
                        var p3 = p2.nextSibling;
                        while(p3){
                            info.values.push(p3.value);
                            p3 = p3.nextSibling;
                        }
                        this.onSelect(info);
                        dijit.popup.close(this.dialog);
                    }
                }
            });
            dojo.connect(dojo.byId('verSelectCancel'), 'onclick', this, function(){
                dijit.popup.close(this.dialog);
            });
        }
        teasp.util.showErrorArea(null, 'verSelectErrorArea');
        var div = dojo.byId('verSelectDiv');
        if(div.clientHeight > this.maxDivH){
            dojo.toggleClass(div, 'disp_block', true );
            dojo.toggleClass(div, 'disp_table', false);
            dojo.style(div, 'height', this.maxDivH + 'px');
        }
        this.opened = true;
    });
};

teasp.dialog.VerSelect.prototype.doSearch = function(){
    teasp.util.showErrorArea(null, 'verSelectErrorArea');
    var pool = [];
    var index = 0;
    var func = function(){};
    var onSuccess = function(){
        var l = this.srchData.procList(pool);
        this.result = {
            cntAll : l.length,
            rowMax : 20,
            pageNo : 1,
            objs   : l
        };
        this.sortList = [];
        this.result.objs = teasp.dialog.VerSelect.doSort(this.result.objs, this.sortList, 'JobCode__c');
        this.refresh(this.result);
    };
    func = dojo.hitch(this, function(){
        var that = this;
        if(that.srchData.searchList[index].procSkip()){
            if(++index < that.srchData.searchList.length){
                setTimeout(func, 100);
            }else{
                onSuccess.apply(that);
            }
            return;
        }
        this.search(this.srchData.searchList[index],
            function(records){
                pool = pool.concat(that.srchData.searchList[index].procList(records));
                if(++index < that.srchData.searchList.length){
                    setTimeout(func, 100);
                }else{
                    onSuccess.apply(that);
                }
            },
            function(result){
                console.log(teasp.message.getErrorMessage(result));
            }
        );
    });
    func();
};

teasp.dialog.VerSelect.prototype.search = function(srch, onSuccess, onFailure){
    var pool = [];
    var max    = 200;
    var offset = 0;
    var soql   = 'select '
                + srch.soqlFields.join(',')
                + ' from '
                + srch.soqlFrom;
    var wh = srch.procWhere(srch);
    if(wh){
        soql += ' where ';
        soql += wh;
    }
    soql += ' order by Id';
    var func = function(){};
    func = dojo.hitch(this, function(){
        this.onSearch(
            {
                action  : 'searchVerSimple',
                soql    : soql,
                limit   : max,
                offset  : offset
            },
            function(result){
                pool = pool.concat(result.objs);
                if(result.objs.length >= max && pool.length < teasp.constant.COUNT_LIMIT){
                    offset += max;
                    setTimeout(func, 100);
                }else{
                    onSuccess(pool);
                }
            },
            function(result){
                console.log(result);
                if(onFailure){
                    onFailure(result);
                }else{
                    console.log(teasp.message.getErrorMessage(result));
                }
            }
        );
    });
    func();
};

teasp.dialog.VerSelect.prototype.refresh = function(res){
    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    var objs = ((res && res.objs) || []);

    dojo.byId('verSelectOk').disabled = true;
//    dojo.byId('verSelectName').value = (res.name || '');
    this.setPaging(dojo.byId('verSelectPage'), res);
    this.displaySort();

    var div = dojo.byId('verSelectDiv');
    while(div.firstChild){
        dojo.destroy(div.firstChild);
    }
    div.scrollTop = 0;

    var w = 22 + 17;
    for(var c = 0 ; c < this.srchData.columns.length ; c++){
        var o = this.srchData.columns[c];
        w += o.size;
    }
    div.style.width = '' + w + 'px';

    var table = dojo.create('table', { className: 'stone_table' });
    var tbody = dojo.create('tbody', { id: 'verSelectTbody'}, table);

    var cnt = 0;
    var bx = (res.pageNo - 1) * res.rowMax;
    for(var i = bx ; i < objs.length ; i++){
        if(++cnt > res.rowMax){
            break;
        }
        var u = objs[i];
        var row = dojo.create('tr', { className: 'sele ' + ((i%2)==0? 'even' : 'odd') }, tbody);
        var cell = dojo.create('td', { style: { width:"22px", textAlign:"center", border:"none" } }, row);
        var radio = dojo.create('input', { type:'radio', name: 'verSelectRadio', id: 'verSelectRadio' + (i + 1) }, cell);
        this.eventHandles.push(dojo.connect(radio, 'onclick', this, function(e){
            dojo.byId('verSelectOk').disabled = false;
            if(dojo.isIE <= 7){
                e = (e || window.event);
                var n = (e.target || e.srcElement);
                this.checkSelectRadio(n.id);
            }
        }));
        for(var k = 0 ; k < this.HIDEKEYS.length ; k++){
            var hk = this.HIDEKEYS[k] || '';
            dojo.create('input', { type:'hidden', value: (u[hk] || '') }, cell);
        }
        for(c = 0 ; c < this.srchData.columns.length ; c++){
            var o = this.srchData.columns[c];
            cell = dojo.create('td', { style: { width:'' + o.size + 'px', borderLeft:'none', borderRight:'none', textAlign:o.align } }, row);
            var v = teasp.dialog.VerSelect.getValue(u, o);
            dojo.create('div', { innerHTML : v }, cell);
        }
        this.eventHandles.push(dojo.connect(row, 'onclick', this, function(e){
            e = (e || window.event);
            var n = (e.target || e.srcElement);
            while(n && n.nodeName != 'TR'){
                n = n.parentNode;
            }
            if(n && n.nodeName == 'TR'){
                n.cells[0].firstChild.checked = true;
                dojo.byId('verSelectOk').disabled = false;
                if(dojo.isIE <= 7){
                    this.checkSelectRadio(n.cells[0].firstChild.id);
                }
            }
        }));
    }
    div.appendChild(table);
    this.adjustHeight();
    div = dojo.byId('verSelectBody');
    div.firstChild.style.width = '' + w + 'px';
};

teasp.dialog.VerSelect.getValue = function(o, c) {
    var apiKeys = (c.apiKeys || c.apiKey.split('.'));
    if(!c.apiKeys){
        c.apiKeys = apiKeys;
    }
    for(var i = 0 ; i < apiKeys.length ; i++){
        var k = apiKeys[i];
        if(o[k]){
            o = o[k];
        }else{
            return null;
        }
    }
    if(o && c.type == 'date'){
        o = teasp.util.date.formatDate(teasp.logic.convert.valDate(o), 'SLA');
    }
    return o;
};

teasp.dialog.VerSelect.doSort = function(records, sortbl, apiKey) {
    var f = false;
    for(var i = 0 ; i < sortbl.length ; i++){
        var o = sortbl[i];
        if(o.apiKey == apiKey){
            f = true;
            if(i == 0){
                o.desc = o.desc ? false : true;
            }else{
                o = sortbl.splice(i, 1)[0];
                o.desc = false;
                sortbl.unshift(o);
            }
            break;
        }
    }
    if(!f){
        sortbl.unshift({ apiKey: apiKey, desc: false });
    }
    sortbl = sortbl.slice(0, 2);
    var l = records;
    l = l.sort(function(a, b){
        return teasp.dialog.VerSelect.compareValue(a, b, sortbl);
    });
    return l;
};

teasp.dialog.VerSelect.compareValue = function(o1, o2, sortbl) {
    var so = sortbl[0];
    var v1 = teasp.dialog.VerSelect.getValue(o1, so);
    var v2 = teasp.dialog.VerSelect.getValue(o2, so);
    if(v1 == v2){
        return 0;
    }
    if(typeof(v1) == 'number' && typeof(v2) == 'number'){
        return (v1 - v2) * (so.desc ? (-1) : 1);
    }
    if(typeof(v1) == 'string' && typeof(v2) == 'string'){
        return (v1 < v2 ? -1 : 1) * (so.desc ? (-1) : 1);
    }
    return 0;
};

teasp.dialog.VerSelect.getString = function() {
    var a = arguments;
    var b = dojo.clone(a[0]);
    for (var i = 1; i < a.length; i++)
        b = b.replace(RegExp("\\{" + (i - 1) + "\\}", "g"), a[i]);
    return b;
};

teasp.dialog.VerSelect.prototype.checkSelectRadio = function(tid){
    if(!tid){
        return;
    }
    var n = dojo.byId('verSelectTbody');
    if(n && n.nodeName == 'TBODY'){
        var rcnt = n.rows.length;
        for(var i = 1 ; i <= rcnt ; i++){
            var id = 'verSelectRadio' + i;
            dojo.byId(id).checked = (id == tid);
        }
    }
};

teasp.dialog.VerSelect.prototype.adjustHeight = function(){
    var tbody = dojo.byId('verSelectTbody');
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
    var div = dojo.byId('verSelectDiv');
    dojo.toggleClass(div, 'disp_table', h < this.maxDivH);
    dojo.toggleClass(div, 'disp_block', h >= this.maxDivH);
    dojo.style(div, 'height', (h < this.maxDivH ? h : this.maxDivH) + 'px');
};

teasp.dialog.VerSelect.prototype.changePage = function(pg_){
    var pg = pg_;
    var that = this;
    return function(){
        if(that.result){
            that.result.pageNo = pg;
            that.refresh(that.result);
        }
    };
};

teasp.dialog.VerSelect.prototype.clickHead = function(key){
    var that = this;
    return function(){
        if(that.result){
            var apiKey = null;
            for(var i = 0 ; i < that.srchData.columns.length ; i++){
                var o = that.srchData.columns[i];
                if(o.key == key){
                    apiKey = o.apiKey;
                    break;
                }
            }
            if(apiKey){
                that.result.objs = teasp.dialog.VerSelect.doSort(that.result.objs, that.sortList, apiKey);
                that.result.pageNo = 1;
                that.refresh(that.result);
            }
        }
    };
};

teasp.dialog.VerSelect.prototype.setPaging = function(div, sp){
    while(div.firstChild){
        dojo.destroy(div.firstChild);
    }
    var pgcnt = Math.ceil(sp.cntAll / sp.rowMax);
    var pp = dojo.create('div', { className:'pageDiv', innerHTML: '&lt;' }, div);
    if(sp.pageNo > 1){
        dojo.style(pp, 'color' , 'blue');
        dojo.style(pp, 'cursor', 'pointer');
        this.eventHandles.push(dojo.connect(pp, 'onclick', this, this.changePage(sp.pageNo - 1)));
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
            this.eventHandles.push(dojo.connect(p, 'onclick', this, this.changePage(n)));
        }
    }
    var pn = dojo.create('div', { className:'pageDiv', innerHTML: '&gt;' }, div);
    if(sp.pageNo < pgcnt){
        dojo.style(pn, 'color' , 'blue');
        dojo.style(pn, 'cursor', 'pointer');
        this.eventHandles.push(dojo.connect(pn, 'onclick', this, this.changePage(sp.pageNo + 1)));
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

teasp.dialog.VerSelect.prototype.displaySort = function(){
    var so = (this.sortList.length > 0 ? this.sortList[0] : null);
    var apiKey = (so ? so.apiKey : null);
    var desc   = (so ? so.desc   : null);
    var index = -1;
    for(var i = 0 ; i < this.srchData.columns.length ; i++){
        var o = this.srchData.columns[i];
        if(apiKey && o.apiKey == apiKey){
            index = i + 1;
            break;
        }
    }
    dojo.query('.head', 'verSelectHead').forEach(function(elem){
        if(elem.nodeName == 'TD' && elem.firstChild){
            var div = elem.firstChild.firstChild;
            if(div){
                var icon = div.nextSibling;
                if(elem.cellIndex == index){
                    if(icon){
                        icon.className = 'pp_base pp_ico_sort_' + (desc ? 'desc' : 'asc');
                    }else{
                        dojo.style(div, 'float', 'left');
                        icon = dojo.create('div', {
                            className : 'pp_base pp_ico_sort_' + (desc ? 'desc' : 'asc'),
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

teasp.dialog.VerSelect.prototype.receiveError = function(res){
    console.log(res);
    teasp.util.showErrorArea(res, 'verSelectErrorArea');
};
