teasp.provide('teasp.dialog.EmpSelect');
/**
 * 社員選択ツールチップダイアログ
 *
 * @constructor
 */
teasp.dialog.EmpSelect = function(thisObject, depts, titles, getRangeValue, searchEmp, setCahceEmps, getEmpSelected){
    this.thisObject = thisObject;
    this.depts = depts;
    this.titles = titles;
    this.getRangeValue = getRangeValue;
    this.searchEmp = searchEmp;
    this.setCahceEmps = setCahceEmps;
    this.getEmpSelected = getEmpSelected;
    this.inited = false;
    this.opend = false;
    this.dialog = null;
    this.id = 'tooltipEmpSelect';
    this.content = '<div class="dlg_content"><table class="ts_a_frame" id="empSelectArea" style="margin-bottom:12px;"><tr><td class="edgelt"></td><td class="edgeht"></td><td class="edgert"></td></tr><tr><td class="edgevl"></td><td><div class="edge_div"><table class="stand_table" style="width:594px;margin:4px;"><tr><td style="text-align:left;white-space:nowrap;"><div style="margin:6px 4px;font-weight:bold;color: #4A4A56;">部署</div></td><td class="right"><select class="inputran" style="width:340px;vertical-align:middle;" id="empSelectDepts"></select><input type="button" id="empSelectBrowseDept" class="loupe" style="vertical-align:middle;" /></td></tr><tr><td></td><td class="right"><label><input type="checkbox" id="empSelectDeptBelow" />下位部署を含める</label></td></tr><tr><td style="text-align:left;white-space:nowrap;"><div style="margin:6px 4px;font-weight:bold;color: #4A4A56;">役職</div></td><td class="right"><select class="inputran" id="empSelectTitle" style="max-width:400px;"></select></td></tr><tr id="empSelectWarnRow" style="display:none;"><td colspan="2"><div id="empSelectWarn" style="color:red;margin:4px;"></div></td></tr><tr><td colspan="2"><table class="stone_area" style="margin:4px;"><tr><td><table class="stone_table"><tr><td class="head" style="width:22px;" ><input type="checkbox" id="empSelectCheck" /></td><td class="head" style="width:180px;"><div>部署名</div></td><td class="head" style="width:150px;"><div>役職</div></td><td class="head" style="width:100px;"><div>社員コード</div></td><td class="head" style="width:140px;"><div>社員名</div></td></tr></table><div class="stone_div" style="height:176px;"><table class="stone_table"><tbody id="empSelectTbody"></tbody></table></div></td></tr></table></td></tr></table></div></td><td class="edgevr"></td></tr><tr><td class="edgelb"></td><td class="edgehb"></td><td class="edgerb"></td></tr></table><div id="empSelectErrorArea"></div><table border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td style="padding:4px 0px;text-align:right;"><input type="button" class="deletebtn" value="クリア" id="empSelectClear" style="margin-right:24px;" /></td><td style="padding:4px 0px;text-align:left;"><input type="button" class="cancelbtn" value="閉じる" id="empSelectCancel" style="margin-left:24px;" /></td></tr></table></div>';
    this.targetEmps = {};
    this.clickRowEvent = null;
    this.eventHandles = [];
};

teasp.dialog.EmpSelect.prototype.getDialog = function(){
    return this.dialog;
};

/**
 *
 */
teasp.dialog.EmpSelect.prototype._init = function(){
    if(this.inited){
        return;
    }
    this.inited = true;
    var that = this;
    var o = {
        id       : this.id,
        content  : this.content,
//        onMouseLeave: function(e){
        onBlur: function(e){
            dijit.popup.close(that.dialog);
        }
    };
    this.dialog = new dijit.TooltipDialog(o);
    this.dialog.startup();
    dojo.connect(this.dialog, 'onOpen', this, function(){
        console.log('dialog-onOpen');
        if(!this.opened){
            // 部署の選択リストをセット
            this.setDeptPulldown();
            var select = dojo.byId('empSelectDepts');
            select.value = 'x';
            dojo.connect(select, 'change', this, this.search);

            select = dojo.byId('empSelectTitle');
            dojo.empty(select);
            dojo.create('option', { innerHTML: '（すべて）'  , value: '-'  }, select);
            dojo.create('option', { innerHTML: '（役職なし）', value: '-1' }, select);
            for(var i = 0 ; i < this.titles.length ; i++){
                dojo.create('option', { innerHTML: this.titles[i], value: i }, select);
            }
            select.value = '-';
            dojo.connect(select, 'change', this, this.search);

            dojo.connect(dojo.byId('empSelectDeptBelow'), 'onclick', this, this.search);
            dojo.connect(dojo.byId('empSelectCancel'), 'onclick', this, function(){
                console.log('empSelectCancel-onclick');
                dijit.popup.close(that.dialog);
            });
            dojo.connect(dojo.byId('empSelectClear'), 'onclick', this, function(){
                dojo.byId('empSelectCheck').checked = false;
                var tbody = dojo.byId('empSelectTbody');
                for(var i = 0 ; i < tbody.rows.length ; i++){
                    var row = tbody.rows[i];
                    var match = /empSelectRow(.+)/.exec(row.id);
                    if (match) {
                        tbody.rows[i].cells[0].firstChild.checked = false;
                    }
                }
                this.clearAll();
            });
            dojo.connect(dojo.byId('empSelectCheck'), 'onclick', this, this.checkedAll);
            dojo.connect(dojo.byId('empSelectBrowseDept'), 'onclick', this, this.openSelectDept);
            for(var i = 0 ; i < this.eventList.length ; i++){
                var eh = this.eventList[i];
                dojo.connect(dojo.byId(eh.id), eh.event, this, function(){
                    dijit.popup.close(that.dialog);
                    eh.method.apply(eh.thisObject);
                });
            }
        }
        this.opened = true;
        dojo.byId('empSelectCheck').checked = false;
        this.createEmpTable();
    });
};

/**
 *
 */
teasp.dialog.EmpSelect.prototype.ready = function(eventList, clickRowEvent, clickAllRowEvent, clearAll){
    this.eventList = (eventList || []);
    this.clickRowEvent = clickRowEvent;
    this.clickAllRowEvent = clickAllRowEvent;
    this.clearAll = clearAll;
    this._init();
};

/**
 *
 */
teasp.dialog.EmpSelect.prototype.setEmps = function(targetEmps){
    this.targetEmps = (targetEmps || {});
};

teasp.dialog.EmpSelect.prototype.showWarn = function(msg){
    dojo.style('empSelectWarnRow', 'display', (msg ? '' : 'none'));
    dojo.byId('empSelectWarn').innerHTML = (msg ? msg.entitize() : '');
};

// event: 部署選択で検索
teasp.dialog.EmpSelect.prototype.search = function(){
    this.showWarn(null);
    var deptId = dojo.byId('empSelectDepts').value;
    if(deptId == 'x'){
        return;
    }
    var title = '-';
    var titleIndex = dojo.byId('empSelectTitle').value;
    if(titleIndex == '-1'){
        title = null;
    }else if(titleIndex != '-'){
        title = this.titles[titleIndex];
    }
    dojo.byId('empSelectDeptBelow').disabled = (deptId == '-' || deptId == '-1');
    var range = this.getRangeValue();
    this.searchEmp.apply(this.thisObject, [{
        deptId        : (deptId == '-' ? null : deptId),
        deptOption    : dojo.byId('empSelectDeptBelow').checked,
        title         : title,
        startDate     : range.startDate,
        endDate       : range.endDate,
        excludeIdList : []
    },
    'empSelectErrorArea',
    function(result){
        this.setCahceEmps(result.emps);
        this.targetEmps.list = result.emps;
        this.createEmpTable();
    }, this]);
};

/**
 *
 */
teasp.dialog.EmpSelect.prototype.createEmpTable = function(){
    var tbody, row, cell, r, inp;

    if(!dojo.byId('empSelectCheck')){
        return;
    }
    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    tbody = dojo.byId('empSelectTbody');
    dojo.empty(tbody);
    var emps = (this.targetEmps.list || []);
    dojo.style('empSelectArea', 'display', '');
    var rowMin = 8;
    var rowCount = (rowMin < emps.length ? emps.length : rowMin);
    var rowMax = 100;
    if(rowCount > rowMax){
        if(emps.length > rowMax){
            this.showWarn('該当件数が ' + rowMax + ' 件を超えました。上位 ' + rowMax + ' 件のみ表示します。');
        }else{
            this.showWarn(null);
        }
        rowCount = rowMax;
    }
    for(r = 0 ; r < rowCount ; r++){
        var p = (r < emps.length) ? emps[r] : null;
        row  = dojo.create('tr', {
            style       : { height:"22px", cursor:"pointer" },
            className   : 'sele ' + ((r%2)==0 ? 'even' : 'odd')
        }, tbody);
        if(p){
            row.id = 'empSelectRow' + p.Id;
        }
        cell = dojo.create('td', { style: { width:"22px", borderLeft:"none" } }, row);
        if(p){
            inp = dojo.create('input', { type: 'checkbox' }, cell);
            inp.checked = this.getEmpSelected(p.Id);
            this.eventHandles.push(dojo.connect(inp, 'onclick', this, function(e){
                if (!e) e = window.event;
                var node = e.target;
                var row = node.parentNode.parentNode;
                var match = /empSelectRow(.+)/.exec(row.id);
                if(match){
                    this.clickRowEvent(match[1], node.checked);
                }
            }));
        }
        var that = this;
        var deptName = (p && p.DeptId__c ? (p.DeptId__r.DeptCode__c || '') + '-' + (p.DeptId__r.Name || '') : '');
        dojo.create('div', { innerHTML : deptName                        }, dojo.create('td', { style: { width:"179px", textAlign:"left" }                    , onclick: function(){ that.clickRow(this); } }, row));
        dojo.create('div', { innerHTML : (p ? (p.Title__c || '') : '')   }, dojo.create('td', { style: { width:"149px", textAlign:"left" }                    , onclick: function(){ that.clickRow(this); } }, row));
        dojo.create('div', { innerHTML : (p ? (p.EmpCode__c || '') : '') }, dojo.create('td', { style: { width:"99px" , textAlign:"left" }                    , onclick: function(){ that.clickRow(this); } }, row));
        dojo.create('div', { innerHTML : (p ? p.Name : '')               }, dojo.create('td', { style: { width:"122px", textAlign:"left", borderRight:"none" }, onclick: function(){ that.clickRow(this); } }, row));
    }
};

teasp.dialog.EmpSelect.prototype.checkedAll = function(){
    var chk = dojo.byId('empSelectCheck').checked;
    var tbody = dojo.byId('empSelectTbody');
    var empIds = [];
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var row = tbody.rows[i];
        var match = /empSelectRow(.+)/.exec(row.id);
        if (match) {
            tbody.rows[i].cells[0].firstChild.checked = chk;
            empIds.push(match[1]);
        }
    }
    this.clickAllRowEvent(empIds, chk);
};

teasp.dialog.EmpSelect.prototype.clickRow = function(node){
    var row = node.parentNode;
    if(!row.id){
        return;
    }
    var match = /empSelectRow(.+)/.exec(row.id);
    if(match){
        var chk = row.cells[0].firstChild;
        chk.checked = (chk.checked ? false : true);
        this.clickRowEvent(match[1], chk.checked);
    }
};

teasp.dialog.EmpSelect.prototype.setDeptPulldown = function(){
    var rg = this.getRangeValue();
    if(!rg){
        return;
    }
    var select = dojo.byId('empSelectDepts');
    if(select){
        dojo.attr(select, 'disabled', true);
        this.levelDepts = teasp.view.Shift.processingDepts(this.depts, rg.startDate, rg.endDate);
        var preValue = select.value;
        dojo.empty(select);
        dojo.create('option', { innerHTML: '※※※選択してください※※※', value: 'x'  }, select);
        dojo.create('option', { innerHTML: '（すべて）'                  , value: '-'  }, select);
        dojo.create('option', { innerHTML: '（部署未設定の社員）'        , value: '-1' }, select);
        for(var i = 0 ; i < this.levelDepts.length ; i++){
            var dept = this.levelDepts[i];
            if(dept.past || dept.future){
                continue;
            }
            dojo.create('option', { innerHTML: dept.displayName, value: dept.Id }, select);
        }
        select.value = (preValue || '-');
        setTimeout(function(){
            dojo.attr('empSelectDepts', 'disabled', false);
        }, 1000);
    }
};
teasp.dialog.EmpSelect.prototype.openSelectDept = function(){
    teasp.manager.dialogOpen(
        'SelectDept',
        null,
        {
            depts: this.levelDepts
        },
        this,
        function(req, errorAreaId, callback, thisObject){
            if(req.targetId){
                dojo.byId('empSelectDepts').value = req.targetId;
                this.search();
            }
            if(callback){
                callback.apply(thisObject);
            }
            dijit.popup.open({
                popup: this.dialog,
                around: dojo.byId('entriedEmp')
            });
        }
    );
};
