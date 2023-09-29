teasp.provide('teasp.dialog.ShiftSetting');
/**
 * シフト設定ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.ShiftSetting = function(){
    this.widthHint = 410;
    this.heightHint = 225;
    this.id = 'dialogShiftSetting';
    this.title = 'シフト設定';
    this.duration = 1;
    this.content = '<div class="dlg_content" style="width:540px;"><table class="ts_a_frame"><tr><td class="edgelt"></td><td class="edgeht"></td><td class="edgert"></td></tr><tr><td class="edgevl"></td><td style="background-color:#F3F7FA;"><table class="pane_table" width="510px" style="margin:2px auto;"><tbody><tr><td class="left_s">対象社員・日付</td><td class="right"></td></tr><tr><td colSpan=2><table class="atk_r_table" style="margin-top:4px;"><tbody><tr><td class="head" width="220px"><div>所属部署</div></td><td class="head" width="110px"><div>社員名</div></td><td class="head" width="180px"><div>日付</div></td></tr></tbody></table></td></tr><tr height="1px"><td colSpan=2></td></tr><tr><td colSpan=2><div id="shiftSettingTargetDiv" class="atk_r_record_area" width="500px" style="height:102px;overflow-y:scroll;background-color:white;"><table class="atk_r_record_table"><tbody id="shiftSettingTbody"><tr><td></td></tr></tbody></table></div></td></tr></tbody></table></td><td class="edgevr"></td></tr><tr><td class="edgevl"></td><td><div class="edge_div"><table class="stand_table"><tr class="shift_day_type"><td class="left_s">種別</td><td class="right"><div style="margin:0px;"><select id="shiftSettingDayType"><option value="0">勤務日</option><option value="1">非勤務日</option></select></div><div id="shiftSettingDayTypeOption" style="display:none;margin:1px 0px 0px 12px;"><label style="margin-right:8px;"><input type="radio" name="shiftSettingDayTypeOption" style="margin:2px;" id="shiftSettingDayTypeRegularHoliday"><span>所定休日</span></label><label style="margin-right:8px;"><input type="radio" name="shiftSettingDayTypeOption" style="margin:2px;" id="shiftSettingDayTypeLegalHoliday"><span>法定休日</span></label></div></td></tr><tr class="shift_normal_day"><td class="left_s">勤務パターン</td><td class="right"><div><select id="shiftSettingPatterns" style="width:300px;max-width:320px;"></select></div><div id="shiftSettingPatternIcon" style="margin-left:4px;"></div></td></tr><tr class="shift_normal_day"><td class="left_s">始業終業時刻</td><td class="right"><input type="text" class="inputime inputran" value="" id="shiftSettingSt" />&nbsp;～&nbsp;<input type="text" class="inputime inputran" value="" id="shiftSettingEt" /></td></tr></table></div></td><td class="edgevr"></td></tr><tr><td class="edgelb"></td><td class="edgehb"></td><td class="edgerb"></td></tr></table><table border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td id="shiftSettingErrorRow" style="text-align:center;"></td></tr><tr><td style="padding:16px 0px 4px 0px;text-align:center;"><input type="button" class="normalbtn" value="登録" id="shiftSettingOk" />&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" class="cancelbtn" value="キャンセル" id="shiftSettingCancel" /></td></tr></table></div>';
    this.okLink = {
        id       : 'shiftSettingOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'shiftSettingCancel',
        callback : this.hide
    };
    this.defaultVals = null;
};

teasp.dialog.ShiftSetting.prototype = new teasp.dialog.Base();

/**
 *
 * @override
 */
teasp.dialog.ShiftSetting.prototype.ready = function(){
    // デフォルト値
    this.defaultVals = this.getDefaultValues(this.args.target, this.args.importResultFlag);
};

teasp.dialog.ShiftSetting.prototype.preStart = function(){
    dojo.connect(dojo.byId('shiftSettingDayType') , 'onchange', this, this.changedDayType);
    dojo.connect(dojo.byId('shiftSettingPatterns'), 'onchange', this, this.changedPattern);

    // 始業時刻・終業時刻
    dojo.query('.inputime').forEach(function(elem) {
        dojo.connect(elem, 'blur'      , this, teasp.util.time.onblurTime);
        dojo.connect(elem, 'onkeypress', this, teasp.util.time.onkeypressTime);
    }, this);
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.ShiftSetting.prototype.preShow = function(){
    teasp.util.showErrorArea(null, 'shiftSettingErrorRow'); // エラー表示クリア

    // 勤務日・非勤務日
    dojo.byId('shiftSettingDayType').value = (this.defaultVals.dayTypeSel == '2' ? '1' : this.defaultVals.dayTypeSel);
    dojo.byId('shiftSettingDayTypeRegularHoliday').checked = (this.defaultVals.dayTypeSel != '2');
    dojo.byId('shiftSettingDayTypeLegalHoliday'  ).checked = (this.defaultVals.dayTypeSel == '2');

    // 対象の社員・日付
    var allEmps = this.pouch.emps;
    var emps = [];
    var firstKey;
    for(var key in this.args.target){
        if (!firstKey){
            firstKey = key;
        }
        if(this.args.target.hasOwnProperty(key)){
            for(var i = 0 ; i < allEmps.length ; i++){
                if(allEmps[i].Id == key){
                    emps.push(allEmps[i]);
                    break;
                }
            }
        }
    }
    // 日付
    var selectedMinDate;
    var selectedMaxDate;
    if (firstKey) {
        var tempDateList = this.args.target[firstKey].dateList;
        tempDateList.sort(function(a, b){
            return (a > b ? 1 : -1);
        });
        var timeZoneOffsetMilliSec = new Date().getTimezoneOffset() * 60 * 1000 * -1;
        // Local Time
        selectedMinDate = teasp.util.date.parseDate(tempDateList[0]).getTime();
        selectedMaxDate = teasp.util.date.parseDate(tempDateList[tempDateList.length - 1]).getTime();
        // JST + 9h
        selectedMinDate = selectedMinDate + timeZoneOffsetMilliSec;
        selectedMaxDate = selectedMaxDate + timeZoneOffsetMilliSec;
    }

    // 社員ごとの勤務パターンを収集
    var patterns = [];
    var usep = {};
    for(var i = 0 ; i < emps.length ; i++){
        var ps = emps[i].empType.patterns || [];
        for(var k = 0 ; k < ps.length ; k++){
            var p = ps[k].pattern;
            var isValidInPeriod = true;
            if (selectedMinDate && selectedMaxDate) {
                // ValidFrom__c:UTC
                isValidInPeriod = p.ValidFrom__c <= selectedMinDate && selectedMinDate < p.ValidTo__c;
            }
            if(p && p.Id){
                var n = (usep[p.Id] || 0);
                if(!n && isValidInPeriod){
                    patterns.push(p);
                }
                usep[p.Id] = n + 1;
            }
        }
    }

    // 勤務パターンの配列を全社員に割り当て済みのものだけにする。
    this.filterPattern(patterns, usep, emps.length);

    // 勤務パターンの選択リストをセット
    select = dojo.byId('shiftSettingPatterns');
    dojo.empty(select);
    dojo.create('option', { innerHTML: '（通常勤務）', value: '-' }, select);
    var patternId = (this.defaultVals.patternIdList.length == 1 ? this.defaultVals.patternIdList[0] : null);
    for(var i = 0 ; i < patterns.length ; i++){
        var p = patterns[i];
        if(p && (!p.Removed__c || patternId && patternId == p.Id)){
            dojo.create('option', { innerHTML: p.Name, value: p.Id }, select);
        }
    }
    select.value = (patternId || '*');
    // セレクトボックスに値が設定できなかった場合
    if (select.value === '') {
        select.value = '-';
    }

    // 始業・終業時刻はリードオンリーにする
    dojo.byId('shiftSettingSt').readOnly = "readOnly";
    dojo.byId('shiftSettingEt').readOnly = "readOnly";

    var empIdIndex = this.pouch.empIdIndex;
    emps = emps.sort(function(a, b){
        return empIdIndex[a.Id] - empIdIndex[b.Id];
    });
    var tbody = dojo.byId('shiftSettingTbody');
    dojo.empty(tbody);
    for(var i = 0 ; i < emps.length ; i++){
        var emp = emps[i];
        var row = dojo.create('tr', { className: ((i%2)==0 ? 'even' : 'odd') }, tbody);
        dojo.create('div', {
            innerHTML: (emp.DeptId__r ? (emp.DeptId__r.DeptCode__c + '-' + emp.DeptId__r.Name) : ''),
            style    : 'margin:2px 4px;word-break:break-all;'
        }, dojo.create('td', { style: { height:"20px", width:"220px", fontSize:"12px" } }, row));
        dojo.create('div', {
            innerHTML: emp.Name,
            style    : 'margin:2px 4px;word-break:break-all;'
        }, dojo.create('td', { style: { height:"20px", width:"110px", fontSize:"12px" } }, row));
        dojo.create('div', {
            innerHTML: teasp.dialog.ShiftSetting.getDisplayDays(this.args.target[emp.Id].dateList),
            style    : { margin:"2px 4px" }
        }, dojo.create('td', { style: { height:"20px", width:"164px", fontSize:"12px" } }, row));
    }
    while(i < 5){
        var row = dojo.create('tr', { className: ((i%2)==0 ? 'even' : 'odd') }, tbody);
        dojo.create('div', null, dojo.create('td', { style: { height:"20px", width:"220px" } }, row));
        dojo.create('div', null, dojo.create('td', { style: { height:"20px", width:"110px" } }, row));
        dojo.create('div', null, dojo.create('td', { style: { height:"20px", width:"164px" } }, row));
        i++;
    }

    this.changedDayType();
    this.changedPattern();

    return true;
};

/**
 * 勤務パターン配列を絞る（または補完する）
 * useCount!=0 なら usep の使用数が useCount より少ないものを配列から除く。
 * useCount==0 なら 除去は行わず、配列になくて defaultVals に存在するものを補完する。
 *
 * @param {Array.<Object>} patterns 勤務パターンの配列（更新する）
 * @param {Object} usep 勤務パターンID と使用数のペアのマップ
 * @param {number=} useCount 選択社員数
 */
teasp.dialog.ShiftSetting.prototype.filterPattern = function(patterns, usep, useCount){
    if(useCount){
        for(var i = patterns.length - 1 ; i >= 0 ; i--){
            var p = patterns[i];
            if(usep[p.Id] < useCount){
                patterns.splice(i, 1);
            }
        }
    }else{
        // 互換性を考慮して、今は割り当てから除外されている勤務パターンが設定済みの場合、
        // その勤務パターンを選択肢に含める
        var ps = this.pouch.allPatterns;
        var allp = {};
        for(var i = 0 ; i < ps.length ; i++){
            var p = ps[i];
            allp[p.Id] = p;
        }
        var pIds = (this.defaultVals.patternIdList || []);
        for(var i = 0 ; i < pIds.length ; i++){
            var pId = pIds[i];
            if(!usep[pId] && allp[pId]){
                patterns.push(allp[pId]);
            }
        }
    }
};

teasp.dialog.ShiftSetting.prototype.changedPattern = function(){
    var patternId   = dojo.byId('shiftSettingPatterns').value;
    var patterns = this.pouch.allPatterns;
    var p = null;
    for(var i = 0 ; i < patterns.length ; i++){
        if(patterns[i].Id == patternId){
            p = patterns[i];
            break;
        }
    }
    var area = dojo.byId('shiftSettingPatternIcon');
    while(area.firstChild){
        dojo.destroy(area.firstChild);
    }
    if(patternId != '-' && patternId != '*'){
        if(p){
            var ch = (p.Symbol__c || p.Name.substring(0, 1));
            dojo.create('div', { className: 'pattern dayDiv', style: { marginLeft:"auto", marginRight:"auto" }, innerHTML: ch }, area);
            dojo.byId('shiftSettingSt').value = teasp.util.time.timeValue(p.StdStartTime__c);
            dojo.byId('shiftSettingEt').value = teasp.util.time.timeValue(p.StdEndTime__c);
        }else{
            dojo.byId('shiftSettingSt').value = '';
            dojo.byId('shiftSettingEt').value = '';
        }
    }else{
        var l = (patternId == '-' ? this.defaultVals.normalSEList : this.defaultVals.currentSEList);
        if(l.length == 1){
            var o = l[0];
            dojo.byId('shiftSettingSt').value = teasp.util.time.timeValue(o.st);
            dojo.byId('shiftSettingEt').value = teasp.util.time.timeValue(o.et);
        }else{
            dojo.byId('shiftSettingSt').value = '';
            dojo.byId('shiftSettingEt').value = '';
        }
    }
};

teasp.dialog.ShiftSetting.prototype.changedDayType = function(){
    var dt = dojo.byId('shiftSettingDayType').value;
    dojo.query('.shift_normal_day').forEach(function(elem) {
        dojo.style(elem, 'display', (dt == '0' ? '' : 'none'));
    });
    dojo.style('shiftSettingDayTypeOption', 'display', (dt == '1' ? '' : 'none'));
    dojo.query('.shift_both_daytype').forEach(function (elem) {
        dojo.style(elem, 'display', (dt == '0' || dt == '1' ? '' : 'none'));
    });
};

teasp.dialog.ShiftSetting.prototype.getDefaultValues = function(target, importResultFlag){
    var emps = this.pouch.emps;
    var key = null, pmap = {}, dtmap = {}, plst = [], dayTypeSel = '',
      cumap = {}, culst = [], nomap = {}, nolst = [];
    for(var empId in target){
        if(!target.hasOwnProperty(empId)){
            continue;
        }
        var dkeys = target[empId].dateList;
        var emp = null;
        for(var i = 0 ; i < emps.length ; i++){
            if(emps[i].Id == empId){
                emp = emps[i];
            }
        }
        if(!emp || !dkeys || !dkeys.length){
            continue;
        }
        for(var i = 0 ; i < dkeys.length ; i++){
            var dkey = dkeys[i];
            var d = emp.days[dkey];
            var p = d.pattern;
            pmap[p ? p.Id : '-'] = 1;
            var np = emp.empType.days[dkey].config;
            if(!p){
                p = np;
            }
            var no = (teasp.util.time.timeValue(np.StdStartTime__c) + '-' + teasp.util.time.timeValue(np.StdEndTime__c));
            nomap[no] = { st: np.StdStartTime__c, et: np.StdEndTime__c };
            if(d.dayType == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY
            || d.dayType == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
                dtmap['1'] = 1;
            }else if(d.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){
                dtmap['2'] = 1;
            }else{
                dtmap['0'] = 1;
                var cu = (teasp.util.time.timeValue(p.StdStartTime__c) + '-' + teasp.util.time.timeValue(p.StdEndTime__c));
                cumap[cu] = { st: p.StdStartTime__c, et: p.StdEndTime__c };
            }
        }
    }
    for(key in pmap){
        if(pmap.hasOwnProperty(key)){
            plst.push(key);
        }
    }

    // dayTypeSel
    // 対象日がすべて勤務日なら 0
    // 対象日がすべて非勤務日なら 1 か 2
    // それ以外は *
    if(dtmap['0'] && !dtmap['1'] && !dtmap['2']){
        dayTypeSel = '0';
    }else if(!dtmap['0'] && (dtmap['1'] || dtmap['2'])){
        dayTypeSel = (!dtmap['1'] ? '2' : '1');
    }else{
        dayTypeSel = '*';
    }

    for(key in cumap){
        if(cumap.hasOwnProperty(key)){
            culst.push(cumap[key]);
        }
    }
    for(key in nomap){
        if(nomap.hasOwnProperty(key)){
            nolst.push(nomap[key]);
        }
    }
    return {
        dayTypeSel      : dayTypeSel,
        patternIdList   : plst,
        currentSEList   : culst,
        normalSEList    : nolst,
    };
};

teasp.dialog.ShiftSetting.getDisplayDays = function(dkeys){
    if(!dkeys){
        return '';
    }
    dkeys = dkeys.sort(function(a, b){
        return (a < b ? -1 : (a > b ? 1 : 0));
    });
    var hifn = '～';
    var l = [];
    var pd = null;
    for(var i = 0 ; i < dkeys.length ; i++){
        var d = teasp.util.date.parseDate(dkeys[i]);
        if(!pd || teasp.util.date.daysInRange(pd, d) > 2){
            l.push({ sd: d });
        }else{
            l[l.length - 1].ed = d;
        }
        pd = d;
    }
    pd = null;
    var dl = [];
    for(i = 0 ; i < l.length ; i++){
        if(!l[i].ed){
            var sd = l[i].sd;
            dl.push((!pd || pd.getMonth() != sd.getMonth()) ? (sd.getMonth() + 1) + '/' + sd.getDate() : '' + sd.getDate());
            pd = sd;
        }else{
            var sd = l[i].sd;
            var ed = l[i].ed;
            var s = ((!pd || pd.getMonth() != sd.getMonth()) ? (sd.getMonth() + 1) + '/' + sd.getDate() : sd.getDate())
                + hifn + ((sd.getMonth() != ed.getMonth()) ? (ed.getMonth() + 1) + '/' + ed.getDate() : ed.getDate());
            console.log(s);
            dl.push(s);
            pd = ed;
        }
    }
    return dl.join(', ');
};

teasp.dialog.ShiftSetting.prototype.getDeptIdByEmpId = function(empId){
    var emps = this.pouch.emps;
    for(var i = 0 ; i < emps.length ; i++){
        var emp = emps[i];
        if(emp.Id == empId){
            return emp.DeptId__c;
        }
    }
    return null;
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.ShiftSetting.prototype.ok = function(){
    var patternId   = dojo.byId('shiftSettingPatterns').value; // -:(通常業務), *:(変更なし)、それ以外:勤務パターンID
    var dayType     = (dojo.byId('shiftSettingDayType').value == '*' ? null : dojo.byId('shiftSettingDayType').value);

    if(dayType == '1' && dojo.byId('shiftSettingDayTypeLegalHoliday').checked){ // 法定休日が選択されている
        dayType = '2';
    }

    var st = teasp.util.time.clock2minutes(dojo.byId('shiftSettingSt').value);
    var et = teasp.util.time.clock2minutes(dojo.byId('shiftSettingEt').value);
    st = (typeof(st) == 'number' ? st : null);
    et = (typeof(et) == 'number' ? et : null);

    var target = this.args.target;
    for(var empId in target){
        if(target.hasOwnProperty(empId)){
            var o = {};
            for(var i = 0 ; i < target[empId].dateList.length ; i++){
                var dkey = target[empId].dateList[i];
                o[dkey] = {
                    dayType     : dayType,
                    deptId      : this.getDeptIdByEmpId(empId),
                    patternId   : (dayType == '1' || dayType == '2') ? null : patternId,
                    startTime   : null,
                    endTime     : null
                };
            }
            target[empId] = o;
        }
    }

    this.onfinishfunc(
        { target : target },
        'shiftSettingErrorRow',
        function(res){
            this.hide();
        },
        this
    );
};

