teasp.provide('teasp.dialog.EmpShiftList');
/**
 * シフト設定リストダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.EmpShiftList = function(){
    this.id = 'dialogEmpShiftList';
    this.title = '社員毎の設定リスト';
    this.duration = 1;
    this.content = '<div class="dlg_content"><table class="pane_table" width="724px" style="margin:0px;"><tbody><tr><td><table class="atk_r_table"><tbody><tr><td class="head" width="22px"><input type="checkbox" id="empShiftListChk" /></td><td class="head" width="38px"></td><td class="head" width="38px"></td><td class="head" width="120px"><div>曜日</div></td><td class="head" width="70px"><div>種別</div></td><td class="head" width="160px"><div>勤務パターン</div></td><td class="head" width="100px"><div>始業終業時刻</div></td><td class="head" width="176px"><div>主管部署</div></td></tr></tbody></table></td></tr><tr height="1px"><td></td></tr><tr><td><div id="empShiftListTargetDiv" class="atk_r_record_area" width="714px" style="height:202px;overflow-y:scroll;background-color:white;"><table class="atk_r_record_table"><tbody id="empShiftListTbody"><tr><td></td></tr></tbody></table></div></td></tr></tbody></table><div style="margin:4px 8px 8px 8px;text-align:left;width:100%;"><div class="inputarea">※ 同一社員・同一曜日に設定が重複する場合は、表示順で上位の設定が優先されます。</div></div><table class="pane_table" style="margin:4px;width:100%;"><tr><td style="text-align:center;" colSpan="4"><div id="empShiftListErrorRow"></div></td></tr><tr><td style="text-align:left;width:25%;"><input type="button" class="pb_base pb_btn_plus" style="margin:0px;" id="empShiftListNew" /></td><td style="text-align:right;width:25%;"><input type="button" class="normalbtn" value="上記設定を適用する" style="margin-right:32px;" id="empShiftListOk" /></td><td style="text-align:left;width:25%;"><input type="button" class="cancelbtn" value="閉じる" style="margin-left:48px;" id="empShiftListClose" /></td><td style="width:25%;"></td></tr></table></div>';
    this.okLink = {
        id       : 'empShiftListOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'empShiftListClose',
        callback : this.hide
    };
    this.emps = null;
    this.seqNo = 1;
    this.eventHandles = [];
};

teasp.dialog.EmpShiftList.prototype = new teasp.dialog.Base();

teasp.dialog.EmpShiftList.prototype.contact = function(req, onSuccess){
    teasp.action.contact.remoteMethods(
        (is_array(req) ? req : [req]),
        { errorAreaId : (req.errorAreaId ? req.errorAreaId : 'empShiftListErrorRow') },
        onSuccess,
        null,
        this
    );
};
/**
 *
 * @override
 */
teasp.dialog.EmpShiftList.prototype.ready = function(){
    this.emps = [];
    for(var i = 0 ; i < this.args.empIds.length ; i++){
        var emp = this.getEmpById(this.args.empIds[i]);
        this.emps.push(emp);
    }
};

/**
 * 初期化処理
 *
 * @override
 */
teasp.dialog.EmpShiftList.prototype.preStart = function(){
    dojo.connect(dojo.byId('empShiftListNew'), 'onclick', this, function(){ this.openWeeklyShift(null); });
    dojo.connect(dojo.byId('empShiftListChk'), 'onclick', this, function(){
        var chk = dojo.byId('empShiftListChk').checked;
        var tbody = dojo.byId('empShiftListTbody');
        for(var i = 0 ; i < tbody.rows.length ; i++){
            var inp = tbody.rows[i].cells[0].firstChild;
            if(inp.tagName == 'INPUT'){
                inp.checked = chk;
            }
        }
        this.ruleScanning();
    });
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.EmpShiftList.prototype.preShow = function(){
    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    this.showError(null);

    this.createList();

    return true;
};

/**
 * 設定リスト表作成
 *
 */
teasp.dialog.EmpShiftList.prototype.createList = function(){
    var cell;
    this.showError(null);

    var tbody = dojo.byId('empShiftListTbody');
    dojo.empty(tbody);

    for(var i = 0 ; i < this.emps.length ; i++){
        var emp = this.emps[i];
        emp.rules = ((typeof(emp.DefaultRule__c) == 'string' ? dojo.fromJson(emp.DefaultRule__c) : emp.DefaultRule__c) || []);
    }

    var rx = 0;
    for(var h = 0 ; h < this.emps.length ; h++){
        var emp = this.emps[h];
        var row = dojo.create('tr', { className: (((rx++)%2)==0 ? 'even' : 'odd') }, tbody);

        // 社員名
        dojo.create('div', {
            innerHTML: emp.Name,
            style    : 'margin:3px 8px;font-size:13px;word-break:break-all;'
        }, dojo.create('td', { colSpan: 8, style: { textAlign:"left" } }, row));

        for(i = 0 ; i < emp.rules.length ; i++){
            var sh = emp.rules[i];
            sh.seqNo = (this.seqNo++);
            var week = teasp.util.date.getWeekJpByNumArray(teasp.util.parseNumsText(sh.week));
            var pattern = this.getPatternById(sh.patternId);
            var workPlace = this.getWorkPlaceById(sh.workPlaceId);

            row  = dojo.create('tr', { className: (((rx++)%2)==0 ? 'even' : 'odd') }, tbody);
            cell = dojo.create('td', { style: { height:"20px", width:"22px", fontSize:"12px" } }, row);
            var inp = dojo.create('input', {
                type     : 'checkbox',
                style    : { margin:"2px 4px" }
            }, cell);
            this.eventHandles.push(dojo.connect(inp, 'onclick', this, this.ruleScanning));
            inp.checked = true;
            dojo.create('input', {
                type     : 'hidden',
                value    : '' + sh.seqNo
            }, cell);

            inp = dojo.create('input', {
                type      : 'div',
                className : 'pp_base pp_btn_edit',
                title     : '編集',
                style     : { margin:"1px 2px" }
            }, dojo.create('td', { style: { height:"20px", width:"38px", fontSize:"12px" } }, row));
            this.eventHandles.push(dojo.connect(inp, 'onclick', this, function(){
                var seq = sh.seqNo;
                return function(){
                    this.openWeeklyShift(seq);
                };
            }()));

            inp = dojo.create('input', {
                type      : 'div',
                className : 'pp_base pp_btn_del',
                title     : '削除',
                style     : { margin:"1px 2px" }
            }, dojo.create('td', { style: { height:"20px", width:"38px", fontSize:"12px" } }, row));
            this.eventHandles.push(dojo.connect(inp, 'onclick', this, function(){
                var seq = sh.seqNo;
                return function(){
                    this.deleteEmpShift(seq);
                };
            }()));

            // 曜日
            cell = dojo.create('td' , { style: { height:"20px", width:"120px", fontSize:"12px", textAlign:"center" } }, row);
            var div = dojo.create('div', {
                style    : { marginLeft:"auto", marginRight:"auto", display:"table" }
            }, cell);
            dojo.create('div', {
                className: 'pp_base pp_shift_set_warn',
                style    : { "float":"left", marginRight:"4px", marginTop:"2px", display:"none" }
            }, div);
            dojo.create('div', {
                innerHTML: week,
                style    : { margin:"2px", whiteSpace:"nowrap" }
            }, div);

            // 種別
            dojo.create('div', {
                innerHTML: (sh.dayType == '0' ? '勤務日' : (sh.dayType == '2' ? '法定休日' : '所定休日')),
                style    : { margin:"2px 4px" }
            }, dojo.create('td', { style: { height:"20px", width:"70px", fontSize:"12px", textAlign:"center" } }, row));

            // 勤務パターン
            cell = dojo.create('td', { style: { height:"20px", width:"160px", fontSize:"12px" } }, row);
            if(pattern){
                var ch = (pattern.Symbol__c || pattern.Name.substring(0, 1));
                dojo.create('div', { className: 'pattern dayDiv', style: { "float":"left", marginRight:"2px" }, innerHTML: ch }, cell);
            }
            dojo.create('div', {
                innerHTML: (pattern ? pattern.Name : ''),
                style    : { margin:"2px 4px", wordBreak:"break-all", "float":"left" }
            }, cell);
            dojo.create('div', { style: { clear:"both" } }, cell);

            // 始業終業時刻
            dojo.create('div', {
                innerHTML: teasp.util.time.timeValue(sh.st) + ' - ' + teasp.util.time.timeValue(sh.et),
                style    : { margin:"2px 4px" }
            }, dojo.create('td', { style: { height:"20px", width:"100px", fontSize:"12px", textAlign:"center" } }, row));

            // 主管部署
            cell = dojo.create('td', { style: { height:"20px", width:"160px", fontSize:"12px" } }, row);
            if(workPlace){
                var ch = (workPlace.Symbol__c || workPlace.Name.substring(0, 1));
                dojo.create('div', { className: 'workPlace dayDiv', style: { "float":"left", marginRight:"2px" }, innerHTML: ch }, cell);
            }
            dojo.create('div', {
                innerHTML: (workPlace ? workPlace.Name : ''),
                style    : 'margin:2px 4px;word-break:break-all;'
            }, cell);
        }
    }
    dojo.style('empShiftListChk', 'display', (rx > 0 ? '' : 'none'));
    dojo.byId('empShiftListChk').checked = (rx > 0);
    while(rx < 10){
        var row = dojo.create('tr', { className: ((rx%2)==0 ? 'even' : 'odd') }, tbody);
        dojo.create('div', null, dojo.create('td', { style: { height:"20px", width:"22px"  } }, row));
        dojo.create('div', null, dojo.create('td', { style: { height:"20px", width:"38px"  } }, row));
        dojo.create('div', null, dojo.create('td', { style: { height:"20px", width:"38px"  } }, row));
        dojo.create('div', null, dojo.create('td', { style: { height:"20px", width:"120px" } }, row));
        dojo.create('div', null, dojo.create('td', { style: { height:"20px", width:"70px"  } }, row));
        dojo.create('div', null, dojo.create('td', { style: { height:"20px", width:"160px" } }, row));
        dojo.create('div', null, dojo.create('td', { style: { height:"20px", width:"100px" } }, row));
        dojo.create('div', null, dojo.create('td', { style: { height:"20px", width:"160px" } }, row));
        rx++;
    }
    this.ruleScanning();
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.EmpShiftList.prototype.ok = function(){
    this.showError(null);
    var ladle = this.ruleScanning();
    var target = {};
    var dateList = this.pouch.dateList;
    for(var empId in ladle){
        if(!ladle.hasOwnProperty(empId)){
            continue;
        }
        var emp = this.getEmpById(empId);
        target[emp.Id] = [];
        for(var i = 0 ; i < emp.rules.length ; i++){
            var sh = emp.rules[i];
            if(!sh.checked){
                continue;
            }
            var dkeys = this.getDateListByWeek(dateList, sh.week, sh.ngweek);
            if(dkeys.length <= 0){
                continue;
            }
            target[emp.Id].push({
                dateList    : dkeys,
                dayType     : sh.dayType,
                workPlaceId : sh.workPlaceId,
                patternId   : sh.patternId,
                st          : sh.st,
                et          : sh.et,
                note        : sh.note
            });
        }
    }
    this.onfinishfunc(
        { target: target },
        'empShiftListErrorRow',
        function(res){
            this.hide();
        },
        this
    );
};

teasp.dialog.EmpShiftList.prototype.getDateListByWeek = function(dateList, week, ngweek){
    var dkeys = [];
    if(!week){
        return dkeys;
    }

    var nums1 = teasp.util.parseNumsText(week);
    var nums2 = teasp.util.parseNumsText(ngweek);
    nums1 = teasp.util.date.excludeNums(nums1, nums2);

    for(var i = 0 ; i < dateList.length ; i++){
        var dt = teasp.util.date.parseDate(dateList[i]);
        if(nums1.contains(dt.getDay())){
            dkeys.push(dateList[i]);
        }
    }
    return dkeys;
};

/**
 * エラー表示
 * @param {string|null=} msg エラーメッセージ。null（または省略）の場合は非表示にする。
 */
teasp.dialog.EmpShiftList.prototype.showError = function(msg){
    teasp.util.showErrorArea(msg, 'empShiftListErrorRow');
};

/**
 * 社員IDから社員オブジェクトを返す
 *
 * @param {string|null} id 社員ID
 * @return {Object|null}
 */
teasp.dialog.EmpShiftList.prototype.getEmpById = function(id){
    var emps = this.pouch.emps;
    for(var i = 0 ; i < emps.length ; i++){
        if(emps[i].Id == id){
            return emps[i];
        }
    }
    return null;
};

/**
 * 勤務パターンIDから勤務パターンオブジェクトを返す
 *
 * @param {string|null} id 勤務パターンID
 * @return {Object|null}
 */
teasp.dialog.EmpShiftList.prototype.getPatternById = function(id){
    var patterns = this.pouch.allPatterns;
    for(var i = 0 ; i < patterns.length ; i++){
        if(patterns[i].Id == id){
            return patterns[i];
        }
    }
    return null;
};

/**
 * 部署IDから部署オブジェクトを返す
 *
 * @param {string|null} id 部署ID
 * @return {Object|null}
 */
teasp.dialog.EmpShiftList.prototype.getWorkPlaceById = function(id){
    var depts = this.pouch.depts;
    for(var i = 0 ; i < depts.length ; i++){
        if(depts[i].Id == id){
            return depts[i];
        }
    }
    return null;
};

/**
 * シフト設定オブジェクトを返す
 *
 * @param {number} seq シーケンス番号
 * @return {Object|null}
 */
teasp.dialog.EmpShiftList.prototype.getShiftBySeqNo = function(seq){
    for(var h = 0 ; h < this.emps.length ; h++){
        var emp = this.emps[h];
        for(var i = 0 ; i < emp.rules.length ; i++){
            var sh = emp.rules[i];
            if(sh.seqNo == seq){
                return { obj: sh, index: i, emp: emp };
            }
        }
    }
    return null;
};

/**
 * 部署が共通ならその部署IDを返す
 *
 * @return {string|null}
 */
teasp.dialog.EmpShiftList.prototype.getCommonDeptId = function(){
    var map = {};
    for(var i = 0 ; i < this.emps.length ; i++){
        map[this.emps[i].DeptId__c] = 1;
    }
    var lst = [];
    for(var key in map){
        if(map.hasOwnProperty(key)){
            lst.push(key);
        }
    }
    return (lst.length == 1 ? lst[0] : null);
};

/**
 * 複数社員でルール数の最大数を返す
 *
 * @return {number}
 */
teasp.dialog.EmpShiftList.prototype.getMaxRuleCount = function(){
    var cnt = 0;
    for(var i = 0 ; i < this.emps.length ; i++){
        if(cnt < (this.emps[i].rules || []).length){
            cnt = this.emps[i].rules.length;
        }
    }
    return cnt;
};

teasp.dialog.EmpShiftList.prototype.ruleScanning = function(){
    var tbody = dojo.byId('empShiftListTbody');
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var inp = tbody.rows[i].cells[0].firstChild;
        if(inp && inp.tagName == 'INPUT' && inp.nextSibling){
            var seq = parseInt(inp.nextSibling.value, 10);
            var o = this.getShiftBySeqNo(seq);
            o.obj.checked = inp.checked;
        }
    }
    return this.ruleScan();
};

teasp.dialog.EmpShiftList.prototype.ruleScan = function(){
    var ladle = {};
    for(var h = 0 ; h < this.emps.length ; h++){
        var emp = this.emps[h];
        var week = {};
        for(var i = 0 ; i < emp.rules.length ; i++){
            var sh = emp.rules[i];
            if(!sh.checked || !sh.week){
                continue;
            }
            var ws = sh.week.split(/,/);
            var nw = [];
            var cnt = 0;
            for(var j = 0 ; j < ws.length ; j++){
                var w = ws[j];
                if(!week[w]){
                    week[w] = sh;
                    cnt++;
                }else{
                    nw.push(w);
                }
            }
            if(cnt == 0){
                sh.valid = -1;
                sh.ngweek = nw.join(',');
            }else if(cnt < ws.length){
                sh.valid = 0;
                sh.ngweek = nw.join(',');
            }else{
                sh.valid = 1;
            }
        }
        ladle[emp.Id] = week;
    }
    this.ruleWarn();
    return ladle;
};

teasp.dialog.EmpShiftList.prototype.ruleWarn = function(){
    var tbody = dojo.byId('empShiftListTbody');
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var inp = tbody.rows[i].cells[0].firstChild;
        if(inp && inp.tagName == 'INPUT' && inp.nextSibling){
            var div = tbody.rows[i].cells[3].firstChild.firstChild;
            var seq = parseInt(inp.nextSibling.value, 10);
            var o = this.getShiftBySeqNo(seq);
            var sh = o.obj;
            if(sh.valid > 0 || !inp.checked){
                div.style.display = 'none';
                div.title = '';
                continue;
            }
            div.className = 'pp_base pp_shift_set_' + (sh.valid < 0 ? 'ng' : 'warn');
            div.title = teasp.util.date.getWeekJpByNumArray(teasp.util.parseNumsText(sh.ngweek)) + '曜日の設定が重複しています';
            div.style.display = '';
        }
    }
};

/**
 * シフト設定ダイアログを開く
 *
 * @param {number} seq シーケンス番号
 */
teasp.dialog.EmpShiftList.prototype.openWeeklyShift = function(seq){
    var o = this.getShiftBySeqNo(seq);
    var emp = (o ? o.emp : (this.emps.length == 1 ? this.emps[0] : null));

    teasp.manager.dialogOpen(
        'EmpShift',
        {
            emps           : this.emps,
            emp            : emp,
            index          : (o && typeof(o.index) == 'number' ? o.index : -1)
        },
        this.pouch,
        this,
        this.updateEmpShift
    );
};

/**
 * シフト設定を削除する
 *
 * @param {number} seq シーケンス番号
 */
teasp.dialog.EmpShiftList.prototype.deleteEmpShift = function(seq){
    var o = this.getShiftBySeqNo(seq);
    if(!o){
        return;
    }
    var emp = o.emp;
    teasp.tsConfirmA('設定を削除してもよろしいですか？', this, function(){
        emp.rules.splice(o.index, 1);

        var req = {
            empId       : emp.Id,
            defaultRule : dojo.toJson(emp.rules)
        };
    
        this.contact({
            funcName: 'updateDefaultRule',
            params  : req
        }, function(result){
            emp.DefaultRule__c = emp.rules;
            this.createList();
        });
    });
};

/**
 * シフト設定を更新する
 *
 * @param {Object} para パラメータ
 * @param {string} errorAreaId
 * @param {Function} callback コールバック
 * @param {Object} thisObject 呼び出し元 this
 */
teasp.dialog.EmpShiftList.prototype.updateEmpShift = function(para, errorAreaId, callback, thisObject){
    var ns = {
        week        : para.week,
        dayType     : para.dayType,
        patternId   : para.patternId,
        st          : para.st,
        et          : para.et,
        workPlaceId : para.workPlaceId
    };
    var o = this.getShiftBySeqNo(para.seqNo);
    var emp = null;
    if(o){
        emp = o.emp;
        emp.rules.splice(o.index, 1);
    }else{
        emp = this.getEmpById(para.empId);
    }
    var x = para.priority;
    if(emp.rules.length < x){
        emp.rules.push(ns);
    }else{
        emp.rules.splice(x - 1, 0, ns);
    }

    var req = {
        empId       : emp.Id,
        defaultRule : dojo.toJson(emp.rules)
    };

    this.contact({
        funcName    : 'updateDefaultRule',
        params      : req,
        errorAreaId : errorAreaId
    }, function(result){
        emp.DefaultRule__c = emp.rules;
        this.createList();
        callback.apply(thisObject);
    });
};
