/*
 * 振替休日取得状況出力のソース
 *
 *
 */
tsq.QueryObj.prototype.buildForm = function(){
    this.destroy();
    var today = teasp.util.date.formatDate(new Date());
    var that = this;
    this.contact(
        {
            funcName: 'getExtResult',
            params  : { soql: 'select Id, DeptCode__c, Name, ParentId__c from AtkDept__c where OriginalId__c = null and DeptCode__c <> null and (EndDate__c = null or EndDate__c >= ' + today + ')', limit: 1000, offset: 0 }
        },
        function(result){
            that.depts = result.records;
            tsq.QueryObj.levelingDepts(that.depts);
            this.step();
            that.buildForm2();
        },
        true
    );
};

tsq.QueryObj.prototype.buildForm2 = function(){
//    var today = new Date();
//    var lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//    var fromDate = teasp.util.date.addMonths(teasp.util.date.addDays(lastDate, 1), -12);
    var qform = dojo.byId('queryForm');
    var tbody = dojo.create('tbody', null, dojo.create('table', { className: 'pane_table' }, qform));

    var row = dojo.create('tr', null, tbody);

    var table = dojo.create('table', { className: 'pane_table' }, qform);
    tbody = dojo.create('tbody', null, table);
    tbody.style.marginTop = '8px';
    row = dojo.create('tr', null, tbody);
    var div = dojo.create('div', { innerHTML: '初回振替日' }, dojo.create('td', { width: '96px' }, row));
    div.style.marginRight = '20px';

    var indt, btn;
    indt = dojo.create('input', { type: 'text', id: 'queryDateStart', style: 'width:80px;text-align:center;', maxLength:10, className: 'inputran' }, dojo.create('td', null, row));
//    indt.value = teasp.util.date.formatDate(fromDate, 'SLA');
    indt.value = '';
    dojo.connect(indt, 'onblur', this, function(){
        var d = teasp.util.strToDate(dojo.byId('queryDateStart').value);
        dojo.byId('queryDateStart').value = ((d.failed != 0) ? '' : d.dater);
    });
    btn = dojo.create('input', { type: 'button', id: 'buttonDateStart', className:'pp_base pp_btn_cal' }, indt, 'after');
    btn.style.marginLeft  = '4px';
    dojo.connect(btn, 'onclick', this, function(){
        var dt = teasp.util.date.parseDate(dojo.byId('queryDateStart').value);
        teasp.manager.dialogOpen(
            'Calendar',
            {
                date: (dt ? dt : new Date()),
                isDisabledDateFunc: function(d) { return false; }
            },
            null,
            this,
            function(o){
                dojo.byId('queryDateStart').value = teasp.util.date.formatDate(o, 'SLA');
            }
        );
    });

    div = dojo.create('div', { innerHTML: '～', style: 'margin-left:4px;margin-right:4px;' }, dojo.create('td', null, row));
    div.style.marginLeft  = '4px';
    div.style.marginRight = '4px';

    indt = dojo.create('input', { type: 'text', id: 'queryDateEnd', style: 'width:80px;text-align:center;', maxLength:10, className: 'inputran' }, dojo.create('td', null, row));
//    indt.value = teasp.util.date.formatDate(lastDate, 'SLA');
    indt.value = '';
    dojo.connect(indt, 'onblur', this, function(){
        var d = teasp.util.strToDate(dojo.byId('queryDateEnd').value);
        dojo.byId('queryDateEnd').value = ((d.failed != 0) ? '' : d.dater);
    });
    btn = dojo.create('input', { type: 'button', id: 'buttonDateEnd', className:'pp_base pp_btn_cal' }, indt, 'after');
    btn.style.marginLeft  = '4px';
    dojo.connect(btn, 'onclick', this, function(){
        var dt = teasp.util.date.parseDate(dojo.byId('queryDateEnd').value);
        teasp.manager.dialogOpen(
            'Calendar',
            {
                date: (dt ? dt : new Date()),
                isDisabledDateFunc: function(d) { return false; }
            },
            null,
            this,
            function(o){
                dojo.byId('queryDateEnd').value = teasp.util.date.formatDate(o, 'SLA');
            }
        );
    });

    table = dojo.create('table', { className: 'pane_table' }, qform);
    table.style.marginTop = '8px';
    tbody = dojo.create('tbody', null, table);
    row = dojo.create('tr', null, tbody);
    div = dojo.create('div', { innerHTML: '部署名' }, dojo.create('td', { width: '96px' }, row));
    div.style.marginRight = '20px';
    var select = dojo.create('select', { id: 'queryDept' }, dojo.create('td', null, row));
    dojo.create('option', { innerHTML: '(すべて)', value: '-' }, select);
    for(var i = 0 ; i < this.depts.length ; i++){
        var dept = this.depts[i];
        dojo.create('option', { innerHTML: dept.displayName, value: dept.Id }, select);
    }
    row = dojo.create('tr', null, tbody);
    dojo.create('td', null, row);
    var label = dojo.create('label', null, dojo.create('td', { style:'padding-top:4px;' }, row));
    label.style.paddingTop = '4px';
    var inp = dojo.create('input', { type: 'checkbox', id: 'queryDeptBelow' }, label);
    inp.checked = true;
    dojo.create('span', { innerHTML: ' 直属の社員のみ' }, label);

    table = dojo.create('table', { className: 'pane_table' }, qform);
    table.style.marginTop = '8px';
    tbody = dojo.create('tbody', null, table);
    row = dojo.create('tr', null, tbody);
    div = dojo.create('div', { innerHTML: '社員コード' }, dojo.create('td', { width: '96px', style: 'vertical-align:top;' }, row));
    dojo.create('input', { type: 'text', id: 'queryEmpCode1', style: 'width:90px;', maxLength:20, className: 'inputran' }, dojo.create('td', null, row));

    row = dojo.create('tr', null, tbody);
    div = dojo.create('div', { innerHTML: '社員名'     }, dojo.create('td', { width: '96px', style: 'vertical-align:top;' }, row));
    dojo.create('input', { type: 'text', id: 'queryEmpName1', style: 'width:90px;', maxLength:20, className: 'inputran' }, dojo.create('td', null, row));

    var div = dojo.create('div', {
        innerHTML: '検索条件を入力して［検索］→［ダウンロード］の順番でクリックしてください。',
        style: 'margin-top:20px;'
    }, dojo.byId('queryForm'));

    var inp1 = dojo.create('input', { type: 'button', value: '検索', id:'buttonCreateData', style: 'margin-top:20px;' }, qform);

    dojo.create('div', {
        innerHTML: '',
        id   : 'queryResultNote',
        style: 'margin-top:20px;'
    }, dojo.byId('queryForm'));

    div = dojo.create('div', { style: 'margin-top:20px;' }, dojo.byId('queryForm'));
    var inp2 = dojo.create('input', { type: 'button', value: 'ダウンロード', id:'buttonDownload' }, div);
    inp2.disabled = true;
    dojo.connect(inp2, 'onclick', this, this.inputDownloadReal);

    this.recordCount = 0;

    dojo.connect(inp1, 'onclick', this, function(){
        this.folder = {};
        this.recordCount = 0;
        dojo.byId('queryResultNote').innerHTML = '';
        var sd = teasp.util.strToDate(dojo.byId('queryDateStart').value);
        var ed = teasp.util.strToDate(dojo.byId('queryDateEnd').value);
        if(sd.failed || ed.failed){
            teasp.util.showErrorArea('初回振替日を指定してください', 'error_area');
            return;
        }
        if(sd.datef > ed.datef){
            teasp.util.showErrorArea('初回振替日が正しくありません', 'error_area');
            return;
        }
        this.folder.param = {
            sm          : sd.datef,
            em          : ed.datef,
            deptId      : (dojo.byId('queryDept').value == '-' ? null : dojo.byId('queryDept').value),
            deep        : !dojo.byId('queryDeptBelow').checked,
            empCode1    : dojo.byId('queryEmpCode1').value.trim(),
            empName1    : dojo.byId('queryEmpName1').value.trim()
        };
        teasp.manager.dialogOpen('BusyWait');

        // 条件に該当する振替申請レコードを取得
        var soql = "select Id"
            + ", Name"
            + ", ApplyType__c"
            + ", StartDate__c"
            + ", ExchangeDate__c"
            + ", DayType__c"
            + ", OriginalStartDate__c"
            + ", OriginalStartDayType__c"
            + ", EmpId__r.DeptId__c"
            + ", EmpId__r.DeptId__r.DeptCode__c"
            + ", EmpId__r.DeptId__r.Code__c"
            + ", EmpId__r.DeptId__r.Name"
            + ", EmpId__c"
            + ", EmpId__r.EmpCode__c"
            + ", EmpId__r.Name"
            + ", EmpTypeId__c"
            + ", EmpTypeId__r.EmpTypeCode__c"
            + ", EmpTypeId__r.Name"
            + ", Note__c"
            + ", Status__c"
            + ", ApplyTime__c"
            + ", YearMonth__c"
            + " from AtkEmpApply__c"
            + " where ApplyType__c = '振替申請'"
            + " and (OriginalStartDate__c >= {0} and OriginalStartDate__c <= {1})"
            + " and (Status__c = '承認待ち' or Status__c = '承認済み' or Status__c = '確定済み')"
            + " and Removed__c = false";
            if(this.folder.param.deptId){
                soql += " and (EmpId__r.DeptId__c = '{2}'";
                if(this.folder.param.deep){
                    soql += " or EmpId__r.DeptId__r.ParentId__c = '{2}'";
                    soql += " or EmpId__r.DeptId__r.ParentId__r.ParentId__c = '{2}'";
                    soql += " or EmpId__r.DeptId__r.ParentId__r.ParentId__r.ParentId__c = '{2}'";
                    soql += " or EmpId__r.DeptId__r.ParentId__r.ParentId__r.ParentId__r.ParentId__c = '{2}'";
                }
                soql += ')';
            }
            var emlst = [];
            if(this.folder.param.empCode1){
                emlst.push("EmpId__r.EmpCode__c like '{3}%'");
            }
            if(emlst.length > 0){
                soql += (" and (" + emlst.join(" or ") + ")");
            }
            var enlst = [];
            if(this.folder.param.empName1){
                enlst.push("EmpId__r.Name like '%{4}%'");
            }
            if(enlst.length > 0){
                soql += (" and (" + enlst.join(" or ") + ")");
            }
            soql += " order by EmpId__r.DeptId__r.DeptCode__c, EmpId__r.EmpCode__c, OriginalStartDate__c, ApplyTime__c";
        soql = tsq.getString(soql, this.folder.param.sm, this.folder.param.em, this.folder.param.deptId, this.folder.param.empCode1, this.folder.param.empName1);
        this.search(soql, true);
    });
};

tsq.QueryObj.levelingDepts = function(depts){
    depts = depts.sort(function(a, b){
        return (a.DeptCode__c < b.DeptCode__c ? -1 : (a.DeptCode__c > b.DeptCode__c ? 1 : 0));
    });
    var setDeptLevel = function(depts, parent, oo){
        var parentId = (parent ? parent.Id : null);
        for(var i = 0 ; i < depts.length ; i++){
            var dept = depts[i];
            if(dept.ParentId__c == parentId){
                if(parent){
                    parent.parentFlag = true;
                    dept.parentMap = (parent.parentMap ? dojo.clone(parent.parentMap) : {});
                    dept.parentMap[parent.id] = parent.level;
                }
                dept.level = (parent ? parent.level + 1 : 1);
                var spc = '';
                for(var j = 1 ; j < dept.level ; j++){
                    spc += '&nbsp;&nbsp;';
                }
                dept.displayName = spc + dept.DeptCode__c + '-' + dept.Name;
                dept.order = oo.order++;
                setDeptLevel(depts, dept, oo);
            }
        }
    };
    setDeptLevel(depts, null, { order: 1 });
    return depts.sort(function(a, b){
        return a.order - b.order;
    });
};

tsq.QueryObj.prototype.buildData = function(records){
    if(!this.folder.exchanges){
        this.folder.exchanges = records;

        // 条件に該当する休日出勤申請レコードを取得
        var soql = "select Id"
            + ", Name"
            + ", ApplyType__c"
            + ", StartDate__c"
            + ", EndDate__c"
            + ", EmpId__c"
            + ", Note__c"
            + ", Status__c"
            + ", YearMonth__c"
            + " from AtkEmpApply__c"
            + " where ApplyType__c = '休日出勤申請'"
            + " and StartDate__c >= {0}"
            + " and (Status__c = '承認待ち' or Status__c = '承認済み' or Status__c = '確定済み')"
            + " and Removed__c = false";
            if(this.folder.param.deptId){
                soql += " and (EmpId__r.DeptId__c = '{2}'";
                if(this.folder.param.deep){
                    soql += " or EmpId__r.DeptId__r.ParentId__c = '{2}'";
                    soql += " or EmpId__r.DeptId__r.ParentId__r.ParentId__c = '{2}'";
                    soql += " or EmpId__r.DeptId__r.ParentId__r.ParentId__r.ParentId__c = '{2}'";
                    soql += " or EmpId__r.DeptId__r.ParentId__r.ParentId__r.ParentId__r.ParentId__c = '{2}'";
                }
                soql += ')';
            }
            var emlst = [];
            if(this.folder.param.empCode1){
                emlst.push("EmpId__r.EmpCode__c like '{3}%'");
            }
            if(emlst.length > 0){
                soql += (" and (" + emlst.join(" or ") + ")");
            }
            var enlst = [];
            if(this.folder.param.empName1){
                enlst.push("EmpId__r.Name like '%{4}%'");
            }
            if(enlst.length > 0){
                soql += (" and (" + enlst.join(" or ") + ")");
            }
        soql = tsq.getString(soql, this.folder.param.sm, this.folder.param.em, this.folder.param.deptId, this.folder.param.empCode1, this.folder.param.empName1);
        this.search(soql, true);
        return;
    }

    this.folder.holyworks = records;

    var exchanges = (this.folder.exchanges || []);
    var holyworks = (this.folder.holyworks || []);
    // 振替申請のマップを作成
    var xmap = {};
    for(var i = 0 ; i < exchanges.length ; i++){
        var a = exchanges[i];
        if(a.OriginalStartDate__c != a.StartDate__c){
            var k = a.EmpId__c + ':' + a.OriginalStartDate__c;
            var o = xmap[k];
            if(!o){
                o = xmap[k] = {};
            }
            o[a.StartDate__c] = a;
        }
    }
    // 休日出勤申請のマップを作成
    var hmap = {};
    for(var i = 0 ; i < holyworks.length ; i++){
        var a = holyworks[i];
        hmap[a.EmpId__c + ':' + a.StartDate__c] = a;
    }
    // 振替申請のリストを出力
    var value = '';
    for(i = 0 ; i < exchanges.length ; i++){
        var a = exchanges[i];
        var o = xmap[a.EmpId__c + ':' + a.OriginalStartDate__c];
        var rf = (o && o[a.ExchangeDate__c]); // 再申請
        var hw = (hmap[a.EmpId__c + ':' + a.StartDate__c] || hmap[a.EmpId__c + ':' + a.ExchangeDate__c]); // 休日出勤申請

        value += '"' + (a.EmpId__r.DeptId__r ? (a.EmpId__r.DeptId__r.DeptCode__c || a.EmpId__r.DeptId__r.Code__c || '') : '') + '"' // 部署コード
              + ',"' + (a.EmpId__r.DeptId__r ? a.EmpId__r.DeptId__r.Name : '')        + '"' // 部署名
              + ',"' + (a.EmpId__r.EmpCode__c || '')                                  + '"' // 社員コード
              + ',"' + (a.EmpId__r.Name       || '')                                  + '"' // 社員名
              + ',"' + teasp.util.date.formatDate(a.OriginalStartDate__c)             + '"' // 初回振替日
              + ',"' + teasp.util.date.formatDate(a.StartDate__c)                     + '"' // 振替元日付
              + ',"' + teasp.util.date.formatDate(a.ExchangeDate__c)                  + '"' // 振替先日付
              + ',"' + (rf ? '○' : '')                                               + '"' // 再振替
              + ',"' + (hw ? '○' : '')                                               + '"' // 休日出勤
              + ',"' + (a.Status__c || '')                                            + '"' // 振替申請(先):ステータス
              + ',"' + (a.ApplyTime__c ? teasp.util.date.formatDateTime(a.ApplyTime__c, 'SLA-HM') : '') + '"' // 振替申請(先):申請日時
              + '\r\n';
        this.recordCount++;
    }
    if(this.recordCount > 0){
        var heads = '"部署コード"'
            + ',"部署名"'
            + ',"社員コード"'
            + ',"社員名"'
            + ',"初回振替日"'
            + ',"振替元日付"'
            + ',"振替先日付"'
            + ',"再振替"'
            + ',"休日出勤"'
            + ',"振替申請:ステータス"'
            + ',"振替申請:申請日時"';
        this.inputDownload2(heads, value, 'request.csv');
    }else{
        dojo.byId('queryResultNote').innerHTML = '該当はありません。';
        teasp.manager.dialogClose('BusyWait');
    }
};

tsq.QueryObj.prototype.inputDownload2 = function(head, value, fname){
    var key = '' + (new Date()).getTime();
    var values = teasp.util.splitByLength(value, 30000);
    var valot = [];
    var cnt = Math.ceil(values.length / 9);
    var x = 0;
    for(var i = 0 ; i < cnt ; i++){
        valot[i] = [];
        for(var j = 0 ; j < 9 ; j++){
            var k = (x * 9) + j;
            if(k < values.length){
                valot[i].push(values[k]);
            }
        }
        x++;
    }
    var reqs = [];
    i = 0;
    do{
        reqs.push({
            funcName  : 'inputData',
            params    : {
                key   : key,
                head  : (i == 0 ? head : null),
                values: valot[i],
                order : (i + 1)
            }
        });
        i++;
    }while(i < valot.length);

    this.contact(
        reqs,
        function(result, index){
            if(reqs.length <= (index + 1)){
                this.key = key;
                this.fname = fname;
                teasp.manager.dialogClose('BusyWait');
                dojo.byId('queryResultNote').innerHTML = this.recordCount + ' 件該当がありました。';
                dojo.byId('buttonCreateData').disabled = true;
                dojo.byId('buttonDownload').disabled = false;
            }
        },
        true
    );
};


tsq.QueryObj.prototype.inputDownloadReal = function(){
    location.href = '/apex/AtkExtCsvView?key=' + this.key + (this.fname ? '&fname=' + this.fname : '');
    dojo.byId('buttonCreateData').disabled = false;
    dojo.byId('buttonDownload').disabled = true;
    this.recordCount = 0;
    dojo.byId('queryResultNote').innerHTML = '';
};
