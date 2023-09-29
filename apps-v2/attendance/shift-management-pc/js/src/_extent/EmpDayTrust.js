/**
 *
 */
tsq.QueryObj.prototype.buildForm = function(){
    require(["dojo/string"]);
    this.destroy();
    this.userId = globalLoadRes.user[0].Id;
    this.ready = false;
    var today = teasp.util.date.formatDate(new Date());
    teasp.manager.dialogOpen('BusyWait');
    this.contact(
        {
            funcName: 'getExtResult',
            params  : {
                soql   : 'select Id, DeptCode__c, Name, ParentId__c, ManagerId__c, Manager1Id__c, Manager2Id__c from AtkDept__c where OriginalId__c = null and DeptCode__c <> null and (EndDate__c = null or EndDate__c >= ' + today + ')',
                limit  : 1000,
                offset : 0
            }
        },
        dojo.hitch(this, function(result){
            this.depts = (result.records || []);
            tsq.QueryObj.levelingDepts(this.depts);
            this.step();
            this.fetchUserEmp();
        }),
        true
    );
};

tsq.QueryObj.prototype.fetchUserEmp = function(){
    var soql = "select Id, Name, EmpCode__c, DeptId__c, UserId__c, IsAdmin__c, IsAllEditor__c, IsAllReader__c, IsDeptAdmin__c"
        + " from AtkEmp__c where UserId__c = '"
        + this.userId
        + "'";
    this.search(soql, true);
};

tsq.QueryObj.prototype.buildData = function(records){
    if(!this.ready){
        this.userEmp = (records.length > 0 ? records[0] : null);
        this.refAll = (globalLoadRes.user[0].Profile.PermissionsModifyAllData
                        || (this.userEmp && (this.userEmp.IsAdmin__c || this.userEmp.IsAllEditor__c || this.userEmp.IsAllReader__c)));
        this.ready = true;
        this.buildForm3();
        teasp.manager.dialogClose('BusyWait');
        return;
    }

    //**************************************************************************
    // クリニカルトラスト様向け
    // 休暇申請がある場合、勤務状況に休暇名だけ表示する
    teasp.message.labels['tm10001291'] = '{0}';
    teasp.message.labels['tm10001293'] = '残業';
    teasp.message.labels['tm10001294'] = '早朝勤務';
    teasp.message.labels['tm10001295'] = '遅刻';
    teasp.message.labels['tm10001296'] = '早退';
    teasp.message.labels['tk10001181'] = '遅刻{0}';
    teasp.message.labels['tk10001182'] = '早退{0}';
    teasp.message.labels['tm10001298'] = '勤怠修正';
    teasp.message.labels['tk10004650'] = '直行・直帰';
    teasp.message.labels['tk10004760'] = '{0}';
    teasp.message.labels['applyPatternS_label']   = '勤務時間変更';
    teasp.message.labels['applyReviseTime_label'] = '勤怠時刻修正';
    //**************************************************************************

    if(!this.folder.empMonths){
        this.folder.empMonths = records;
        // 最終承認者を得るため、承認履歴を検索
        this.folder.applyMap   = {};
        this.folder.steps      = null;
        this.folder.empCodeMap = null;
        var applyIds = [];
        for(var i = 0 ; i < this.folder.empMonths.length ; i++){
            var em = this.folder.empMonths[i];
            if(em.EmpApplyId__c && em.EmpApplyId__r.Status__c == '承認済み'){
                applyIds.push(em.EmpApplyId__c);
                this.folder.applyMap[em.EmpApplyId__c] = {};
            }
        }
        if(applyIds.length > 0){
            var soql = "select Id, CreatedDate, StepStatus, Comments, ActorId, Actor.Name, OriginalActorId, OriginalActor.Name"
                + ", ProcessInstance.TargetObjectId, ProcessInstance.TargetObject.Name"
                + " from ProcessInstanceStep"
                + " where ProcessInstance.TargetObjectId in ('" + applyIds.join("','")
                + "')";
            this.search(soql, true);
            return;
        }else{
            this.folder.steps = [];
        }
    }else if(!this.folder.steps){
        this.folder.steps = records;
        this.extractActors();
        // 最終承認者の社員コードを検索
        var userIds = this.getLastActorIdList();
        if(userIds.length > 0){
            var soql = "select Id, EmpCode__c, UserId__c"
                + " from AtkEmp__c"
                + " where UserId__c in ('" + userIds.join("','")
                + "')";
            this.search(soql, true);
            return;
        }
    }else{
        var emps = records;
        var m = {};
        for(var i = 0 ; i < emps.length ; i++){
            var emp = emps[i];
            m[emp.UserId__c] = emp.EmpCode__c;
        }
        this.folder.empCodeMap = m;
    }

    this.folder.index = 0;
    this.collectEmpMonth();
};

tsq.QueryObj.prototype.extractActors = function(){
    for(var i = 0 ; i < this.folder.steps.length ; i++){
        var step = this.folder.steps[i];
        step.CreatedDate = teasp.util.date.formatDateTime(step.CreatedDate);
    }
    for(var id in this.folder.applyMap){
        var o = this.folder.applyMap[id];
        var l = [];
        for(var i = 0 ; i < this.folder.steps.length ; i++){
            var step = this.folder.steps[i];
            if(step.ProcessInstance.TargetObjectId == id){
                l.push(step);
            }
        }
        if(l.length > 0){
            l = l.sort(function(a, b){
                return (a.CreatedDate < b.CreatedDate ? -1 : 1);
            });
            var p = l[l.length - 1];
            o.id    = p.ActorId;
            o.name  = p.Actor.Name;
            o.steps = l;
            o.comments = p.Comments;
        }
    }
};

tsq.QueryObj.prototype.getLastActorIdList = function(){
    var l = [];
    for(var key in this.folder.applyMap){
        var o = this.folder.applyMap[key];
        if(!l.contains(o.id)){
            l.push(o.id);
        }
    }
    return l;
};

/**
 *
 * @param {string} applyId
 * @returns {string}
 */
tsq.QueryObj.prototype.getLastActor = function(applyId){
    return (this.folder.applyMap[applyId] || {});
};

/**
 *
 * @param {string} userId
 * @returns {string}
 */
tsq.QueryObj.prototype.getLastActorEmpCode = function(userId){
    var code = (this.folder.empCodeMap && userId ? this.folder.empCodeMap[userId] : null);
    return (code || '');
};

tsq.QueryObj.prototype.buildForm3 = function(){
    var qform = dojo.byId('queryForm');

    var tbody = dojo.create('tbody', null, dojo.create('table', { className: 'pane_table' }, qform));
    var row = dojo.create('tr', null, tbody);
    dojo.create('div', { innerHTML: '月度' }, dojo.create('td', { style: { width:"96px", marginRight:"20px" } }, row));
    var today = new Date();
    new dijit.form.NumberSpinner({ value:today.getFullYear() , constraints:{ min:1900,max:2100, pattern:'####' }, id:"queryStartYear" , style:{ width:"60px", marginRight:"2px" } }, dojo.create('div', null, dojo.create('td', null, row)));
    new dijit.form.NumberSpinner({ value:today.getMonth() + 1, constraints:{ min:1   ,max:12  , pattern:'00'   }, id:"queryStartMonth", style:{ width:"42px", marginRight:"2px" } }, dojo.create('div', null, dojo.create('td', null, row)));
    this.dijitParts['queryStartYear' ] = 1;
    this.dijitParts['queryStartMonth'] = 1;

    row = dojo.create('tr', null, tbody);
    var label = dojo.create('label', null, dojo.create('td', { colSpan:"3", style:{ paddingTop:"8px" } }, row));
    var ownOnly = dojo.create('input', { type: 'checkbox', id: 'queryOwnOnly' }, label);
    dojo.create('span', { innerHTML: ' 自分の勤怠データのみ' }, label);
    ownOnly.checked = true;
    dojo.connect(ownOnly, 'onclick', this, this.disableKeys);

    tbody = dojo.create('tbody', null, dojo.create('table', { className: 'pane_table', style: { marginTop:"10px" } }, qform));
    row = dojo.create('tr', null, tbody);
    dojo.create('div', { innerHTML: '部署', className: 'search_key' }, dojo.create('td', { style: { width:"96px", marginRight:"20px" } }, row));
    var select = dojo.create('select', { id: 'queryDept' }, dojo.create('td', null, row));
    dojo.create('option', { innerHTML: '(すべて)'          , value: '*' }, select);
    dojo.create('option', { innerHTML: '(部署未設定の社員)', value: '-' }, select);
    for(var i = 0 ; i < this.depts.length ; i++){
        var dept = this.depts[i];
        dojo.create('option', { innerHTML: dept.displayName, value: dept.Id }, select);
    }
    row = dojo.create('tr', null, tbody);
    dojo.create('td', null, row);
    var label = dojo.create('label', null, dojo.create('td', { style:{ paddingTop:"4px" } }, row));
    dojo.create('input', { type: 'checkbox', id: 'queryDeptBelow' }, label);
    dojo.create('span', { innerHTML: ' 下位層を含める（3階層分まで）', className: 'search_key' }, label);

    tbody = dojo.create('tbody', null, dojo.create('table', { className: 'pane_table', style: { marginTop:"8px" } }, qform));
    row = dojo.create('tr', null, tbody);
    dojo.create('div', { innerHTML: '社員番号', className: 'search_key' }, dojo.create('td', { style: { width:"96px", marginRight:"20px" } }, row));
    dojo.create('input', { type:'text', id: 'queryEmpCode', value:'', style:{ width:"240px" }, className: 'inputran' }, dojo.create('td', null, row));
    row = dojo.create('tr', null, tbody);
    dojo.create('td', null, row);
    dojo.create('span', { innerHTML: '（カンマ区切りで複数指定可）', className: 'search_key' }, dojo.create('td', { style:{ paddingTop:"2px" } }, row));

/*
    row = dojo.create('tr', null, tbody);
    label = dojo.create('label', null, dojo.create('td', { colSpan:"2", style:{ paddingTop:"8px" } }, row));
    dojo.create('input', { type: 'checkbox', id: 'queryHeadRow' }, label);
    dojo.create('span', { innerHTML: ' 1行に全項目（月度、社員番号、氏名、部署名、勤務体系、ステータス他）を出力する' }, label);
*/

    this.disableKeys();

    var inp = dojo.create('input', { type: 'button', value: 'ダウンロード', style: { marginTop:"10px" } }, dojo.create('div', null, qform));
    dojo.connect(inp, 'onclick', this, function(){
        this.folder = {};
        var _y = dijit.byId('queryStartYear').value;
        var _m = dijit.byId('queryStartMonth').value;
        var y = (_y != '' && _m != '' ? parseInt(_y, 10) : 0);
        var m = (_y != '' && _m != '' ? parseInt(_m, 10) : 0);
        var ecl = dojo.byId('queryEmpCode').value.trim().split(/,/);
        var ec = [];
        for(var i = 0 ; i < ecl.length ; i++){
            var c = ecl[i].trim();
            if(c != ''){
                ec.push("'" + c + "'");
            }
        }
        var qd = dojo.byId('queryDept').value;
        this.folder.param = {
            month       : (y * 100 + m),
            ownOnly     : dojo.byId('queryOwnOnly').checked,
            deptId      : (qd == '*' ? null : (qd == '-' ? '' : qd)),
            deep        : dojo.byId('queryDeptBelow').checked,
            empCode     : (ec.length > 0 ? ec.join(',') : null)
        };
        this.fetchEmps();
    });
};

tsq.QueryObj.prototype.disableKeys = function(){
    this.step();
    var chk = dojo.byId('queryOwnOnly').checked;
    dojo.byId('queryDept').disabled      = chk;
    dojo.byId('queryDeptBelow').disabled = chk;
    dojo.byId('queryEmpCode').disabled   = chk;
//    dojo.byId('queryHeadRow').disabled   = chk;
    dojo.query('.search_key', dojo.byId('queryForm')).forEach(function(elem){
        elem.style.color = (chk ? 'gray' : 'black');
    });
};

tsq.QueryObj.prototype.fetchEmps = function(){
    teasp.manager.dialogOpen('BusyWait');
    this.folder.empMonths = null;

    var soql = "select Id"
        + ", EmpId__r.Id"
        + ", EmpId__r.EmpCode__c"
        + ", EmpId__r.Name"
        + ", EmpId__r.DeptId__c"
        + ", EmpId__r.DeptId__r.DeptCode__c"
        + ", EmpId__r.DeptId__r.Name"
        + ", EmpId__r.EmpTypeId__r.Name"
        + ", EmpId__r.EmpTypeId__r.ConfigBaseId__r.InitialDateOfYear__c"
        + ", EmpId__r.EmpTypeId__r.ConfigBaseId__r.MarkOfYear__c"
        + ", EmpId__r.EmpTypeId__r.ConfigBaseId__r.InitialDateOfMonth__c"
        + ", EmpId__r.EmpTypeId__r.ConfigBaseId__r.MarkOfMonth__c"
        + ", EmpId__r.EmpTypeId__r.ConfigBaseId__r.InitialDayOfWeek__c"
        + ", YearMonth__c"
        + ", EmpApplyId__c"
        + ", EmpApplyId__r.Status__c"
        + " from AtkEmpMonth__c"
        + " where Id != null";
    if(this.folder.param.month){
        soql += " and YearMonth__c = {1}";
    }
    if(this.folder.param.ownOnly){
        soql += " and EmpId__r.UserId__c = '{0}'";
    }else{
        if(!this.refAll){
            soql += " and (EmpId__r.UserId__c = '{0}'";
            soql += " or EmpId__r.Manager__c = '{0}'";
            soql += " or EmpId__r.DeptId__r.ManagerId__c = '{0}'";
            soql += " or EmpId__r.DeptId__r.Manager1Id__c = '{0}'";
            soql += " or EmpId__r.DeptId__r.Manager2Id__c = '{0}'";
            soql += " or EmpId__r.DeptId__r.ParentId__r.ManagerId__c = '{0}'";
            soql += " or EmpId__r.DeptId__r.ParentId__r.Manager1Id__c = '{0}'";
            soql += " or EmpId__r.DeptId__r.ParentId__r.Manager2Id__c = '{0}'";
            soql += " or EmpId__r.DeptId__r.ParentId__r.ParentId__r.ManagerId__c = '{0}'";
            soql += " or EmpId__r.DeptId__r.ParentId__r.ParentId__r.Manager1Id__c = '{0}'";
            soql += " or EmpId__r.DeptId__r.ParentId__r.ParentId__r.Manager2Id__c = '{0}'";
            soql += ")";
        }
        if(this.folder.param.deptId){
            soql += " and (EmpId__r.DeptId__c = '{2}'";
            if(this.folder.param.deep){
                soql += " or EmpId__r.DeptId__r.ParentId__c = '{2}'";
                soql += " or EmpId__r.DeptId__r.ParentId__r.ParentId__c = '{2}'";
                soql += " or EmpId__r.DeptId__r.ParentId__r.ParentId__r.ParentId__c = '{2}'";
            }
            soql += ')';
        }else if(this.folder.param.deptId == ''){
            soql += " and EmpId__r.DeptId__c = null";
        }
        if(this.folder.param.empCode){
            soql += " and EmpId__r.EmpCode__c in ({3})";
        }
    }
    soql += " order by YearMonth__c, EmpId__r.EmpCode__c";
    soql = tsq.getString(soql, this.userId, this.folder.param.month, this.folder.param.deptId, this.folder.param.empCode);
    this.search(soql, true);
};

tsq.QueryObj.prototype.collectEmpMonth = function(){
    if(this.folder.index >= this.folder.empMonths.length){
        if(this.folder.empMonths.length == 0){
            teasp.manager.dialogClose('BusyWait');
            alert('該当するデータはありません。');
            return;
        }else if(this.folder.empMonths.length > 400){
            teasp.manager.dialogClose('BusyWait');
            alert('該当データが多すぎます。条件を絞り込んでください。');
            return;
        }
//        if(!dojo.byId('queryOwnOnly').checked && dojo.byId('queryHeadRow').checked){
/*
        if(dojo.byId('queryHeadRow').checked){
            this.outputSummary2();
        }else{
            this.outputSummary();
        }
*/
        this.outputSummary();
        return;
    }
    var empMonth = this.folder.empMonths[this.folder.index++];
    console.log(this.folder.index + ') ' + empMonth.EmpId__r.Name);
    empMonth.pouch = new teasp.data.Pouch();
    teasp.manager.request(
        'loadEmpMonthPrint',
        { target: "empMonth", noDelay: true, empId: empMonth.EmpId__r.Id, month: empMonth.YearMonth__c },
        empMonth.pouch,
        { hideBusy : true },
        this,
        function(){
            setTimeout(dojo.hitch(this, this.collectEmpMonth));
        },
        function(event){
        }
    );
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

tsq.QueryObj.prototype.timeValue = function(v){
    return teasp.util.time.timeValue(v, null, false);
};

/**
 *
 * @param {number} v  時刻(分)
 * @param {number} dfn =1:直行 =2:直帰
 * @param {boolean} flag
 * @returns {String}
 */
tsq.QueryObj.prototype.timeValueEx = function(v, dfn, flag){
    var empty = ',,';
    if(typeof(v) != 'number'){
        return empty;
    }
    var s = teasp.util.time.timeValue(v, null, flag);
    var match = /(\d+):(\d+)/.exec(s);
    if(match){
//        if(dfn == 1){
//            return '"直",":","行"';
//        }else if(dfn == 2){
//            return '"直",":","帰"';
//        }
        return '"' + match[1] + '",":","' + match[2] + '"';
    }else{
        return empty;
    }
};

tsq.QueryObj.prototype.getDayNote = function(empDay, sep){
    var s = (empDay ? empDay.getDayNote(!sep) : '');
    var match;
    while((match = /^(.+)\r?\n$/.exec(s))){
        s = match[1];
    }
//    s = s.replace(/(\r?\n)+/g, '\r\n');
    return s;
};

tsq.QueryObj.prototype.getAwayTimeList = function(timeTable){
    var tt = (timeTable || []);
    var l = [];
    for(var i = 0 ; i < tt.length ; i++){
        var t = tt[i];
        if(t.type != 30){
            continue;
        }
        l.push(t);
    }
    l = l.sort(function(a, b){
        return a.to - b.to;
    });
    return l;
};

tsq.QueryObj.prototype.getAwayTimeDetail = function(tt){
    var l = [];
    for(var i = 0 ; i < tt.length ; i++){
        var t = tt[i];
        l.push('(' + (l.length + 1) + ')' + teasp.util.time.timeValue(t.from) + '-' + teasp.util.time.timeValue(t.to));
    }
    return l.join('\r\n');
};

tsq.QueryObj.prototype.getAwayStartEnd = function(tt, at){
    if(tt.length > 0){
        return { from: tt[0].from, to: ((at || 0) >= 180 ? tt[tt.length - 1].to : null) };
    }
    return null;
};

tsq.QueryObj.prototype.getTotalAwayTime = function(lst){
    var t = 0;
    for(var i = 0 ; i < lst.length ; i++){
        var o = lst[i];
        if(o.from < o.to){
            t += (o.to - o.from);
        }
    }
    return t;
};

tsq.QueryObj.prototype.dspDayType = function(day){
    var dayType = day.dayType;
    var plan = day.plannedHoliday;
    switch(dayType){
    case 0:
        if(plan){
            return '有休計画付与日';
        }
        return '平日';
    case 1: return '所定休日';
    case 2: return '法定休日';
    case 3: return '祝日';
    }
    return '';
};

tsq.QueryObj.prototype.getEventAndApplyStatus = function(empDay, note){
    var al = empDay.getEmpApplyList('ALL');
    var o = {
        status : '',
        event  : empDay.getDayEvent()
    };
    var done = [];
    var wait = [];
    var reje = [];
    var rejns = [];
    var mp = {};
    for(var i = 0 ; i < al.length ; i++){
        var a = al[i];
        if(teasp.constant.STATUS_APPROVES.contains(a.status)){
            done.push(a);
            mp[a.applyType] = 1;
        }else if(teasp.constant.STATUS_FIX.contains(a.status)){
            wait.push(a);
            mp[a.applyType] = 1;
        }else if(teasp.constant.STATUS_REJECTS.contains(a.status) && !a.close){
            reje.push(a);
            var name = '';
            switch(a.applyType){
            case teasp.constant.APPLY_TYPE_HOLIDAY:              // 休暇申請
                name = a.holiday.name;
                break;
            case teasp.constant.APPLY_TYPE_KYUSHTU:
                name = teasp.message.getLabel('tm10001390');     // 休日出勤
                break;
            case teasp.constant.APPLY_TYPE_LATESTART:
                name = teasp.message.getLabel('tm10001420');     // 遅刻
                break;
            case teasp.constant.APPLY_TYPE_EARLYEND:
                name = teasp.message.getLabel('tm10001430');     // 早退
                break;
            case teasp.constant.APPLY_TYPE_DIRECT:
                if(a.directFlag == 1){
                    name = teasp.message.getLabel('tk10004680'); // 直行
                }else if(a.directFlag == 2){
                    name = teasp.message.getLabel('tk10004690'); // 直帰
                }else{
                    name = teasp.message.getLabel('tk10004670'); // 直行・直帰
                }
                break;
            case teasp.constant.APPLY_TYPE_ZANGYO:
                name = teasp.message.getLabel('tm10001293');     // 残業
                break;
            case teasp.constant.APPLY_TYPE_EARLYSTART:
                name = teasp.message.getLabel('tm10001294');     // 早朝勤務
                break;
            case teasp.constant.APPLY_TYPE_EXCHANGE:
                name = teasp.message.getLabel('tm10001610', ''); // 振替
                break;
            case teasp.constant.APPLY_TYPE_PATTERNS:
            case teasp.constant.APPLY_TYPE_PATTERNL:
                name = teasp.message.getLabel('applyPatternS_label'); // 勤務時間変更
                break;
            case teasp.constant.APPLY_TYPE_REVISETIME:
                name = teasp.message.getLabel('applyReviseTime_label'); // 勤怠時刻修正
                break;
            case teasp.constant.APPLY_TYPE_DAILY:
                name = teasp.message.getLabel('tm10001297');     // 日次確定
                break;
            }
            if(!rejns.contains(name)){
                rejns.push(name);
            }
        }
    }
    if(!mp[teasp.constant.APPLY_TYPE_KYUSHTU]){
        if(/\+直行.?直帰/.test(note)){
            var name = teasp.message.getLabel('tk10004670'); // 直行・直帰
            if(!rejns.contains(name)){
                rejns.push(name);
            }
        }else{
            if(/\+直行/.test(note)){
                var name = teasp.message.getLabel('tk10004680'); // 直行
                if(!rejns.contains(name)){
                    rejns.push(name);
                }
            }
            if(/\+直帰/.test(note)){
                var name = teasp.message.getLabel('tk10004690'); // 直帰
                if(!rejns.contains(name)){
                    rejns.push(name);
                }
            }
        }
    }
    if(reje.length > 0){
        o.status = '却下';
    }else if(wait.length > 0){
        o.status = '承認待ち';
    }else if(done.length > 0){
        o.status = '承認済み';
    }
    if(rejns.length > 0){
        if(o.event){
            o.event += ',';
        }
        o.event += rejns.join(',');
    }
    return o;
};

tsq.QueryObj.prototype.outputSummary = function(){
    this.step();
    var value = '';
    var headMonth = '';
    for(var i = 0 ; i < this.folder.empMonths.length ; i++){
        var e = this.folder.empMonths[i];
        var month = e.pouch.getObj().month;
        var emp = e.pouch.getObj().targetEmp;
        var dlst = teasp.util.date.getDateList(month.startDate, month.endDate);
        if(i > 0){
            value += ',,' + (month.yearMonth || '') + '\r\n'; // 月度
        }else{
            headMonth = ',,' + (month.yearMonth || '');
        }
        var actor = this.getLastActor(month.apply.id);
        value += ',,"' + (emp.code || '')                                      // 社員番号
          + '"\r\n,,"' + (emp.name || '')                                      // 氏名
          + '"\r\n,,"' + (emp.deptName || '')                                  // 部署
          + '"\r\n,,"' + (emp.empTypeName || '')                               // 勤務体系
          + '"\r\n,,"' + this.getLastActorEmpCode(actor.id)                    // 最終承認者社員番号
          + '"\r\n,,"' + (actor.name || '') + '","' + (actor.comments || '')   // 最終承認者氏名
          + '"\r\n,,"' + (month.apply.status || '')                            // ステータス
          + '"\r\n';
        value += '"日付"'
            + ',"曜日"'
            + ',"種別"'
            + ',"イベント／勤務状況"'
            + ',"出社",,'
            + ',"外出時刻",,'
            + ',"帰社時刻",,'
            + ',"休憩時間(通常)"'
            + ',"休憩時間(深夜)"'
            + ',"退社",,'
            + ',"公用外出時間",,'
            + ',"公用外出時間明細"'
            + ',"備考"'
            + ',"承認"'
            + '\r\n';
        for(var n = 0 ; n < dlst.length ; n++){
            value += this.outputTimes(dlst[n], e.pouch) + '\r\n';
        }
    }

    var heads = headMonth;
    this.inputDownload(heads, value, 'DailySummary.csv');
    teasp.manager.dialogClose('BusyWait');
};

tsq.QueryObj.prototype.outputSummary2 = function(){
    this.step();
    var value = '';
    for(var i = 0 ; i < this.folder.empMonths.length ; i++){
        var e = this.folder.empMonths[i];
        var month = e.pouch.getObj().month;
        var actor = this.getLastActor(month.apply.id);
        var emp = e.pouch.getObj().targetEmp;
        var dlst = teasp.util.date.getDateList(month.startDate, month.endDate);
        for(var n = 0 ; n < dlst.length ; n++){
            value += '"' + (month.yearMonth || '')                               // 月度
                + '","' + (emp.code || '')                                       // 社員番号
                + '","' + (emp.name || '')                                       // 氏名
                + '","' + (emp.deptName || '')                                   // 部署
                + '","' + (emp.empTypeName || '')                                // 勤務体系
                + '","' + this.getLastActorEmpCode(actor.id)                     // 最終承認者社員番号
                + '","' + (actor.name || '')                                     // 最終承認者氏名
                + '","' + (month.apply.status || '')                             // ステータス
                + '",' + this.outputTimes(dlst[n], e.pouch)
                + '\r\n';
        }
    }

    var heads = '"月度"'
        + ',"社員番号"'
        + ',"氏名"'
        + ',"部署"'
        + ',"勤務体系"'
        + ',"最終承認者社員番号"'
        + ',"最終承認者氏名"'
        + ',"ステータス"'
        + ',"日付"'
        + ',"曜日"'
        + ',"種別"'
        + ',"イベント／勤務状況"'
        + ',"出社",,'
        + ',"外出時刻",,'
        + ',"帰社時刻",,'
        + ',"休憩時間(通常)"'
        + ',"休憩時間(深夜)"'
        + ',"退社",,'
        + ',"公用外出時間",,'
        + ',"公用外出時間明細"'
        + ',"備考"'
        + ',"承認"'
        ;
    this.inputDownload(heads, value, 'DailySummary.csv');
    teasp.manager.dialogClose('BusyWait');
};

tsq.QueryObj.prototype.outputTimes = function(dkey, pouch){
    pouch.getObj().days[dkey].event = null; // 祝日名等のイベント情報は不要なのでNullをセット
    var disc      = (pouch.isDefaultUseDiscretionary() && !pouch.isDiscretionaryOption()); // 裁量労働／管理監督者で実労働時間を表示しない
    var day       = pouch.getObj().days[dkey];
    var empDay    = pouch.getEmpDay(dkey);
    var note      = this.getDayNote(empDay, pouch.isSeparateDailyNote());
    var tobj      = ((disc ? day.disc : day.real) || {});
    var awayTimes = this.getAwayTimeList(day.timeTable);
    var o         = this.getNoteTime(note, day, tobj, awayTimes);
    var at        = this.getTotalAwayTime(o.away);
    var away      = this.getAwayStartEnd(o.away, at);           // 外出時刻・帰社時刻
    var oeas      = this.getEventAndApplyStatus(empDay, note);
    if(at > 0){
        var t = (at / 60).toFixed(2);
        note = (note ? (note + '\n') : '') + '総外勤時間=' + t + '時間';
    }
    if(/^\+/.test(note)){ // 備考の最初の文字が"+"だとExcelで開いたときおかしくなるので先頭に" "(スペース)を追加
        note = ' ' + note;
    }
    var value = teasp.util.date.formatDate(dkey, 'M/d')                  // 日付
            + ','   + teasp.util.date.formatDate(dkey, 'JPW')            // 曜日
            + ','   + this.dspDayType(day)                               // 種別
            + ',"'  + oeas.event                                         // イベント/勤務状況
            + '",'  + this.timeValueEx(o.st, 0)                          // 出社
            + ','   + this.timeValueEx(away ? away.from : null)          // 外出時刻
            + ','   + this.timeValueEx(away ? away.to   : null)          // 帰社時刻
            + ',"'  + o.rest1                                            // 休憩時間(通常)
            + '","' + o.rest2                                            // 休憩時間(深夜)
            + '",'  + this.timeValueEx(o.et, 0)                          // 退社
            + ','   + this.timeValueEx(at, 0, true)                      // 公用外出時間
            + ',"'  + this.getAwayTimeDetail(o.away)                     // 公用外出時間明細
            + '","' + note                                               // 備考
            + '","' + oeas.status                                        // 承認
            + '"';
    return value;
};

tsq.QueryObj.prototype.getNoteTime = function(note, day, obj, awayTimes){
    var st = obj.startTime, et = obj.endTime, away = (awayTimes || []), m, r1 = 0, r2 = 0;
    if(day.rack
    && day.rack.holidayJoin
    && day.rack.holidayJoin.flag
    && day.rack.holidayJoin.flag != 3){ // 半休を取得した
        m = /\+始業\/(\d+):(\d+)/.exec(note);
        if(m){
            st = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
        }
        m = /\+終業\/(\d+):(\d+)/.exec(note);
        if(m){
            et = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
        }
        m = /\+外勤\/(\d+):(\d+)-(\d+):(\d+)/.exec(note);
        if(m){
            var from = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
            var to   = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
            if(from < to){
                away.push({ from: from, to: to });
            }
        }
    }
    // 休憩時間の合計を得る
    if(typeof(st) == 'number' && typeof(et) == 'number' && st < et){
        var tt = (day.timeTable || []);
        // 通常
        var z1 = [
            {from:  300, to: 1320}, //  5:00-22:00
            {from: 1740, to: 2760}  // 29:00-46:00
        ];
        // 深夜
        var z2 = [
            {from:    0, to:  300}, //  0:00- 5:00
            {from: 1320, to: 1740}, // 22:00-29:00
            {from: 2760, to: 2880}  // 46:00-48:00
        ];
        for(var i = 0 ; i < tt.length ; i++){
            var o = tt[i];
            if(typeof(o.from) != 'number' || typeof(o.to) != 'number'){
                continue;
            }
            if(o.type == teasp.constant.REST_FIX
            || o.type == teasp.constant.REST_FREE){
                var r = { from: Math.max(o.from, st), to: Math.min(o.to, et) };
                if(r.from < r.to){
                    r1 += teasp.util.time.rangeTime(r, z1); // 休憩時間(通常)
                    r2 += teasp.util.time.rangeTime(r, z2); // 休憩時間(深夜)
                }
            }
        }
    }

    return {
        st      : st,
        et      : et,
        away    : teasp.util.time.margeTimeSpans(away),
        rest1   : '' + (r1 > 0 ? (r1 / 60).toFixed(2) : ''),
        rest2   : '' + (r2 > 0 ? (r2 / 60).toFixed(2) : '')
    };
};

teasp.data.EmpDay.prototype.getDayNote = function(flag){
    var note = (this.day.note || '');
    var travel = '';
    var dr = (this.getEmpApplyByKey(teasp.constant.APPLY_KEY_DIRECT) // 直行・直帰申請
           || this.getEmpApplyByKey(teasp.constant.APPLY_KEY_KYUSHTU)); // 休日出勤申請
    if(dr && dr.travelTime && this.day.date == dr.startDate){
        travel = teasp.message.getLabel('tk10004711', teasp.util.time.timeValue(dr.travelTime));
        if(note.indexOf(travel) >= 0){
            travel = '';
        }
    }
    if(flag){
        return (note ? (note + (travel ? ('\r\n' + travel) : '')) : travel);
    }
    var an = (this.day.rack.applyNotes || null);
    an = (an ? (an + (travel ? ('\r\n' + travel) : '')) : travel);
    if(an){
        var x = note.indexOf(an);
        if(x >= 0){
            note = note.substring(0, x) + note.substring(x + an.length);
        }
    }
    var match = /^(?:\r?\n)(.+)$/.exec(note);
    if(match){
        note = match[1];
    }
    return (an ? an + '\r\n' : '') + (note || '');
};
