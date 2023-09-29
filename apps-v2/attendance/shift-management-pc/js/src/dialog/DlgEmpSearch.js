teasp.provide('teasp.dialog.EmpSearch');
/**
 * 社員検索ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.EmpSearch = function(){
    this.heightHint = 225;
    this.id = 'dialogEmpSearch';
    this.title = teasp.message.getLabel('tk10000450'); // '社員検索'
    this.duration = 1;
    this.content = '<div class="dlg_content" style="width:476px;"><table class="ts_a_frame"><tr><td class="edgelt"></td><td class="edgeht"></td><td class="edgert"></td></tr><tr><td class="edgevl"></td><td><div class="edge_div"><table class="stand_table" style="margin:4px;"><tr><td style="text-align:left;white-space:nowrap;"><div style="margin:6px 4px;font-weight:bold;color: #4A4A56;" id="columnEmpSearchDepts"></div></td><td class="right"><select class="inputran" style="width:380px;" id="empSearchDepts"></select></td></tr><tr id="empSearchWarnRow" style="display:none;"><td colspan="2"><div id="empSearchWarn" style="color:red;margin:4px;"></div></td></tr><tr><td colspan="2"><table class="stone_area" style="width:444px;margin-top:4px;"><tr><td><table class="stone_table"><tr><td class="head" style="width:22px;" ><input type="checkbox" id="empSearchCheck" /></td><td class="head" style="width:180px;"><div id="empSearchHead1"></div></td><td class="head" style="width:100px;"><div id="empSearchHead2"></div></td><td class="head" style="width:140px;"><div id="empSearchHead3"></div></td></tr></table><div class="stone_div" style="height:176px;"><table class="stone_table"><tbody id="empListTbody"></tbody></table></div></td></tr></table></td></tr></table></div></td><td class="edgevr"></td></tr><tr><td class="edgelb"></td><td class="edgehb"></td><td class="edgerb"></td></tr></table><table border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr id="empSearchErrorRow" style="display:none;"><td style="text-align:center;"><div id="empSearchError" style="color:red;margin:4px;"></div></td></tr><tr><td colspan="2" style="padding:16px 0px 4px 0px;text-align:center;"><input type="button" class="pb_base pb_btn_select" id="empSearchOk" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" class="pb_base pb_btn_cancel" id="empSearchCancel" /></td></tr></table></div>';
    this.okLink = {
        id       : 'empSearchOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'empSearchCancel',
        callback : this.hide
    };
    this.emps = [];
    this.eventHandles = [];
};

teasp.dialog.EmpSearch.prototype = new teasp.dialog.Base();

/**
 *
 * @override
 */
teasp.dialog.EmpSearch.prototype.ready = function(){
};

/**
 * @override
 */
teasp.dialog.EmpSearch.prototype.preStart = function(){
    teasp.message.setLabelEx('columnEmpSearchDepts'  , 'dept_label');     // 部署
    teasp.message.setLabelEx('empSearchHead1'        , 'tk10000335');     // 部署名
    teasp.message.setLabelEx('empSearchHead2'        , 'empCode_label');  // 社員コード
    teasp.message.setLabelEx('empSearchHead3'        , 'empName_label');  // 社員名
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.EmpSearch.prototype.preShow = function(){
    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    this.showError(null);
    // 部署の選択リストをセット
    var select = dojo.byId('empSearchDepts');
    while(select.firstChild){
        dojo.destroy(select.firstChild);
    }
    var depts = this.args.depts;
    dojo.create('option', { innerHTML: teasp.message.getLabel('tk10000344'), value: '-'  }, select); // （すべて）
    dojo.create('option', { innerHTML: teasp.message.getLabel('tk10000436'), value: '-1' }, select); // （部署未設定の社員）
    for(var i = 0 ; i < depts.length ; i++){
        var dept = depts[i];
        dojo.create('option', { innerHTML: dept.displayName, value: dept.Id }, select);
    }
    select.value = '-';
    this.eventHandles.push(dojo.connect(select, 'onclick', this, this.search));
    this.eventHandles.push(dojo.connect(dojo.byId('empSearchCheck'), 'onclick', this, this.checkedAll));
    return true;
};

teasp.dialog.EmpSearch.prototype.postShow = function(){
    this.search();
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.EmpSearch.prototype.ok = function(){
    var tbody = dojo.byId('empListTbody');
    var emps = [];
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var row = tbody.rows[i];
        var match = /empSearchRow(.+)/.exec(row.id);
        if(match && row.cells[0].firstChild.checked){
            var emp = this.getEmpById(match[1]);
            if(emp){
                emps.push(emp);
            }
        }
    }
    this.onfinishfunc(emps);
    this.hide();
};

teasp.dialog.EmpSearch.prototype.getEmpById = function(id){
    for(var i = 0 ; i < this.emps.length ; i++){
        if(this.emps[i].Id == id){
            return this.emps[i];
        }
    }
    return null;
};

/**
 * エラー表示
 * @param {string|null=} msg エラーメッセージ。null（または省略）の場合は非表示にする。
 */
teasp.dialog.EmpSearch.prototype.showError = function(msg){
    dojo.style('empSearchErrorRow', 'display', (msg ? '' : 'none'));
    dojo.byId('empSearchError').innerHTML = (msg ? msg.entitize() : '');
};

teasp.dialog.EmpSearch.prototype.showWarn = function(msg){
    dojo.style('empSearchWarnRow', 'display', (msg ? '' : 'none'));
    dojo.byId('empSearchWarn').innerHTML = (msg ? msg.entitize() : '');
};

// event: 部署選択で検索
teasp.dialog.EmpSearch.prototype.search = function(){
    this.showWarn(null);
    this.showError(null);
    var deptId = dojo.byId('empSearchDepts').value;
    this.args.searchFunction({
        deptId        : (deptId == '-' ? null : deptId),
        deptOption    : true,
        startDate     : this.args.startDate,
        endDate       : this.args.endDate,
        excludeIdList : this.args.excludeIdList
    }, function(result){
        this.createEmpList(result.emps);
    }, this);
};

teasp.dialog.EmpSearch.prototype.createEmpList = function(emps){
    var tbody, row, cell, r;

    this.emps = emps;
    dojo.byId('empSearchCheck').checked = false;
    tbody = dojo.byId('empListTbody');
    while(tbody.firstChild){
        dojo.destroy(tbody.firstChild);
    }
    var rowMax = 100;
    var rowMin = 8;
    var rowCount = (rowMin < emps.length ? emps.length : rowMin);
    if(rowCount > rowMax){
        if(emps.length > rowMax){
            this.showWarn(teasp.message.getLabel('tk10000343', rowMax, rowMax)); // '該当件数が {0} 件を超えました。上位 {1} 件のみ表示します。'
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
            row.id = 'empSearchRow' + p.Id;
        }
        cell = dojo.create('td', { style: { width:"22px", borderLeft:"none" } }, row);
        if(p){
            div = dojo.create('input', { type: 'checkbox' }, cell);
        }
        var deptName = (p && p.DeptId__c ? (p.DeptId__r.DeptCode__c || '') + '-' + (p.DeptId__r.Name || '') : '');
        div = dojo.create('div', { innerHTML : deptName                        }, dojo.create('td', { style: { width:"179px", textAlign:"left" }                    , onclick: function(){ teasp.dialog.EmpSearch.clickRow(this); } }, row));
        div = dojo.create('div', { innerHTML : (p ? (p.EmpCode__c || '') : '') }, dojo.create('td', { style: { width:"99px" , textAlign:"left" }                    , onclick: function(){ teasp.dialog.EmpSearch.clickRow(this); } }, row));
        div = dojo.create('div', { innerHTML : (p ? p.Name : '')               }, dojo.create('td', { style: { width:"122px", textAlign:"left", borderRight:"none" }, onclick: function(){ teasp.dialog.EmpSearch.clickRow(this); } }, row));
    }
};

teasp.dialog.EmpSearch.prototype.checkedAll = function(){
    var chk = dojo.byId('empSearchCheck').checked;
    var tbody = dojo.byId('empListTbody');
    for(var i = 0 ; i < tbody.rows.length ; i++){
        if(/empSearchRow(.+)/.test(tbody.rows[i].id)){
            tbody.rows[i].cells[0].firstChild.checked = chk;
        }
    }
};

teasp.dialog.EmpSearch.clickRow = function(node){
    if(node.parentNode.id && /empSearchRow(.+)/.test(node.parentNode.id)){
        var row = node.parentNode;
        row.cells[0].firstChild.checked = row.cells[0].firstChild.checked ? false : true;
    }
};
