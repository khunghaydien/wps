teasp.provide('teasp.dialog.EmpShift');
/**
 * シフト設定ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.EmpShift = function(){
    this.widthHint = 410;
    this.heightHint = 225;
    this.id = 'dialogEmpShift';
    this.title = '曜日毎の設定';
    this.duration = 1;
    this.content = '<div class="dlg_content" style="width:540px;"><table class="ts_a_frame"><tr><td class="edgelt"></td><td class="edgeht"></td><td class="edgert"></td></tr><tr><td class="edgevl"></td><td><div class="edge_div"><table class="stand_table"><tr class="shift_setting_list"><td class="left_s">社員名</td><td class="right"><select id="empShiftEmps" style="display:none;max-width:380px;"></select><div id="empShiftEmpName" style="display:none;word-break:break-all;"></div></td></tr><tr><td class="left_s">曜日</td><td class="right"><table class="pane_table" style="margin:8px 0px;"><tbody><tr><td style="padding-right:6px;vertical-align:middle;"><label><input type="checkbox" id="schedW0">&nbsp;日</label></td><td style="padding-right:6px;vertical-align:middle;"><label><input type="checkbox" id="schedW1">&nbsp;月</label></td><td style="padding-right:6px;vertical-align:middle;"><label><input type="checkbox" id="schedW2">&nbsp;火</label></td><td style="padding-right:6px;vertical-align:middle;"><label><input type="checkbox" id="schedW3">&nbsp;水</label></td><td style="padding-right:6px;vertical-align:middle;"><label><input type="checkbox" id="schedW4">&nbsp;木</label></td><td style="padding-right:6px;vertical-align:middle;"><label><input type="checkbox" id="schedW5">&nbsp;金</label></td><td style="padding-right:6px;vertical-align:middle;"><label><input type="checkbox" id="schedW6">&nbsp;土</label></td></tr></tbody></table></td></tr><tr class="shift_day_type"><td class="left_s">種別</td><td class="right"><div style="margin:0px;"><select id="empShiftDayType"><option value="*">(変更なし)</option><option value="0">勤務日</option><option value="1">非勤務日</option></select></div><div id="empShiftDayTypeOption" style="display:none;margin:1px 0px 0px 12px;"><label style="margin-right:8px;"><input type="radio" name="empShiftDayTypeOption" style="margin:2px;" id="empShiftDayTypeRegularHoliday"><span>所定休日</span></label><label style="margin-right:8px;"><input type="radio" name="empShiftDayTypeOption" style="margin:2px;" id="empShiftDayTypeLegalHoliday"><span>法定休日</span></label></div></td></tr><tr class="shift_normal_day"><td class="left_s">勤務パターン</td><td class="right"><div><select id="empShiftPatterns" style="width:300px;"></select></div><div id="empShiftPatternIcon" style="margin-left:4px;"></div></td></tr><tr class="shift_normal_day"><td class="left_s">始業終業時刻</td><td class="right"><input type="text" class="inputime inputran" value="" id="empShiftSt" />&nbsp;～&nbsp;<input type="text" class="inputime inputran" value="" id="empShiftEt" /></td></tr><tr class="shift_normal_day"><td class="left_s">主管部署</td><td class="right"><div><select id="empShiftDepts" style="max-width:300px;"></select></div><div id="empShiftDeptIcon" style="margin-left:4px;"></div><div><input type="button" id="empShiftBrowseDept" class="loupe" /></div></td></tr><tr><td class="left_s">備考</td><td class="right"><textarea id="empShiftNote" class="inputran" style="padding:2px;width:380px;height:32px;"></textarea></td></tr><tr class="shift_setting_list"><td class="left_s">優先度</td><td class="right"><select id="empShiftPriority"></select></td></tr></table></div></td><td class="edgevr"></td></tr><tr><td class="edgelb"></td><td class="edgehb"></td><td class="edgerb"></td></tr></table><table border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td id="empShiftErrorRow" style="text-align:center;"></td></tr><tr><td style="padding:16px 0px 4px 0px;text-align:center;"><input type="button" class="normalbtn" value="登録" id="empShiftOk" />&nbsp;&nbsp;&nbsp;&nbsp;<input   type="button"   class="cancelbtn" value="キャンセル" id="empShiftCancel" /></td></tr></table></div>';
    this.okLink = {
        id       : 'empShiftOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'empShiftCancel',
        callback : this.hide
    };
    this.shiftObj = null;
};

teasp.dialog.EmpShift.prototype = new teasp.dialog.Base();

/**
 *
 * @override
 */
teasp.dialog.EmpShift.prototype.ready = function(){
    if(this.args.emp && typeof(this.args.index) == 'number' && this.args.index >= 0){
        this.shiftObj = this.args.emp.rules[this.args.index];
    }else if(this.args.emps){
        this.shiftObj = { workPlaceId: null };
    }else{
        this.shiftObj = null;
    }
};

teasp.dialog.EmpShift.prototype.preStart = function(){
    dojo.connect(dojo.byId('empShiftDayType') , 'onchange', this, this.changedDayType);
    dojo.connect(dojo.byId('empShiftDepts')   , 'onchange', this, this.changedDept);
    dojo.connect(dojo.byId('empShiftPatterns'), 'onchange', this, this.changedPattern);

    dojo.connect(dojo.byId('empShiftBrowseDept'), 'click', this, this.openSelectDept);

    // 始業時刻・終業時刻
    dojo.query('.inputime').forEach(function(elem) {
        dojo.connect(elem, 'blur'      , this, teasp.util.time.onblurTime);
        dojo.connect(elem, 'onkeypress', this, teasp.util.time.onkeypressTime);
    }, this);

    // 社員を変更（「社員毎の設定リスト」ダイアログの「＋」でこのダイアログを開いた場合しか呼ばれない）
    dojo.connect(dojo.byId('empShiftEmps'), 'onchange', this, function(){
        var empId = dojo.byId('empShiftEmps').value;
        var emp = this.getEmpById(empId);
        this.setPriorityList(emp);
        this.setupPatternList(this.getEmps(), emp, dojo.byId('empShiftPatterns').value);
    });
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.EmpShift.prototype.preShow = function(){
    var select;
    this.showError(null);

    var shiftObj = this.shiftObj;

    // 曜日
    for(var i = 0 ; i < 7 ; i++){
        dojo.byId('schedW' + i).checked = false;
    }
    var week = (shiftObj ? (shiftObj.week || '') : '');
    var wno = week.split(/,/);
    for(var i = 0 ; i < wno.length ; i++){
        var d = dojo.byId('schedW' + wno[i]);
        if(d){
            d.checked = true;
        }
    }

    // 社員名
    select = dojo.byId('empShiftEmps');
    dojo.empty(select);
    var emps = this.getEmps();
    var emp = this.args.emp;
    if(emps.length > 1 && this.args.index < 0){
        for(var i = 0 ; i < emps.length ; i++){
            dojo.create('option', { innerHTML: emps[i].Name, value: emps[i].Id }, select);
        }
        if(emp){
            select.value = emp.Id;
        }
        dojo.style(select, 'display', '');
        dojo.style('empShiftEmpName', 'display', 'none');
        this.setPriorityList(this.getEmpById(select.value)); // 優先度
    }else if(emp){
        dojo.byId('empShiftEmpName').innerHTML = emp.Name;
        this.setPriorityList(emp); // 優先度
        dojo.style(select, 'display', 'none');
        dojo.style('empShiftEmpName', 'display', '');
    }else{
        dojo.style(select, 'display', 'none');
        dojo.style('empShiftEmpName', 'display', 'none');
    }

    var dt = (shiftObj && shiftObj.dayType ? shiftObj.dayType : '*');
    // 勤務日・非勤務日
    dojo.byId('empShiftDayType').value = (dt == '2' ? '1' : dt);
    dojo.byId('empShiftDayTypeRegularHoliday').checked = (dt != '2');
    dojo.byId('empShiftDayTypeLegalHoliday'  ).checked = (dt == '2');

    // 部署の選択リストをセット
    select = dojo.byId('empShiftDepts');
    dojo.empty(select);
    dojo.create('option', { innerHTML: '（変更なし）', value: '*' }, select);
    var depts = this.pouch.depts;
    for(var i = 0 ; i < depts.length ; i++){
        var dept = depts[i];
        dojo.create('option', { innerHTML: dept.displayName, value: dept.Id }, select);
    }
    select.value = (shiftObj && shiftObj.workPlaceId ? shiftObj.workPlaceId : '*');

    // 勤務パターン選択リストを作成
    var selEmp = (emps.length > 1 && this.args.index < 0) ? emps[0] : emp;
    this.setupPatternList(emps, selEmp, (shiftObj && shiftObj.patternId));

    // 始業・終業時刻はリードオンリーにする
    dojo.byId('empShiftSt').readOnly = "readOnly";
    dojo.byId('empShiftEt').readOnly = "readOnly";

    dojo.query('.shift_setting_list').forEach(function(elem){
        dojo.style(elem, 'display', shiftObj ? '' : 'none');
    });

    this.changedDayType();
    this.changedPattern();
    this.changedDept();

    return true;
};

/**
 * 勤務パターン選択リストを作成
 *
 * @param {Array.<Object>} emps 社員リスト
 * @param {Object|null} emp 対象社員
 * @param {string|null} patternId 初期値
 */
teasp.dialog.EmpShift.prototype.setupPatternList = function(emps, emp, patternId){
    var patterns = [];
    if(emp){
        var ps = emp.empType.patterns || [];
        for(var k = 0 ; k < ps.length ; k++){
            var p = ps[k].pattern;
            if(p && p.Id){
                patterns.push(p);
            }
        }
    }else{
        // 社員ごとの勤務パターンを収集
        var usep = {};
        for(var i = 0 ; i < emps.length ; i++){
            var ps = emps[i].empType.patterns || [];
            for(var k = 0 ; k < ps.length ; k++){
                var p = ps[k].pattern;
                if(p && p.Id){
                    var n = (usep[p.Id] || 0);
                    if(!n){
                        patterns.push(p);
                    }
                    usep[p.Id] = n + 1;
                }
            }
        }
        for(i = patterns.length - 1 ; i >= 0 ; i--){
            var p = patterns[i];
            if(usep[p.Id] < emps.length){
                patterns.splice(i, 1); // 共通でない勤務パターンを除去
            }
        }
    }
    var select = dojo.byId('empShiftPatterns');
    dojo.empty(select);
    dojo.create('option', { innerHTML: '（変更なし）', value: '*' }, select);
    dojo.create('option', { innerHTML: '（通常勤務）', value: '-' }, select);
    var vid = null;
    for(var i = 0 ; i < patterns.length ; i++){
        var p = patterns[i];
        if(p && !p.Removed__c){
            dojo.create('option', { innerHTML: p.Name, value: p.Id }, select);
            if(p.Id == patternId){
                vid = p.Id;
            }
        }
    }
    select.value = (vid || '*');
};

teasp.dialog.EmpShift.prototype.setPriorityList = function(emp){
    var select = dojo.byId('empShiftPriority');
    dojo.empty(select);
    if(this.shiftObj && emp){
        var size = (emp.rules ? emp.rules.length : 0) + (this.args.index < 0 ? 1 : 0);
        for(var i = 0 ; i < size ; i++){
            var n = '' + (i + 1);
            dojo.create('option', { innerHTML: n, value: n }, select);
        }
        if(this.args.index < 0){
            select.value = '' + size;
        }else{
            select.value = '' + (this.args.index + 1);
        }
    }
};

/**
 * 勤務パターン変更
 *
 */
teasp.dialog.EmpShift.prototype.changedPattern = function(){
    var patternId   = dojo.byId('empShiftPatterns').value;
    var patterns = this.pouch.allPatterns;
    var p = null;
    for(var i = 0 ; i < patterns.length ; i++){
        if(patterns[i].Id == patternId){
            p = patterns[i];
            break;
        }
    }
    var area = dojo.byId('empShiftPatternIcon');
    dojo.empty(area);
    if(patternId != '-' && patternId != '*'){
        if(p){
            var ch = (p.Symbol__c || p.Name.substring(0, 1));
            dojo.create('div', { className: 'pattern dayDiv', style: { marginLeft:"auto", marginRight:"auto" }, innerHTML: ch }, area);
            dojo.byId('empShiftSt').value = teasp.util.time.timeValue(p.StdStartTime__c);
            dojo.byId('empShiftEt').value = teasp.util.time.timeValue(p.StdEndTime__c);
        }else{
            dojo.byId('empShiftSt').value = '';
            dojo.byId('empShiftEt').value = '';
        }
    }else{
        dojo.byId('empShiftSt').value = '';
        dojo.byId('empShiftEt').value = '';
    }
};

/**
 * 店舗変更
 *
 */
teasp.dialog.EmpShift.prototype.changedDept = function(){
    var deptId = dojo.byId('empShiftDepts').value;
    var depts = this.pouch.depts;
    var w = null;
    for(var i = 0 ; i < depts.length ; i++){
        if(depts[i].Id == deptId){
            w = depts[i];
            break;
        }
    }
    var area = dojo.byId('empShiftDeptIcon');
    dojo.empty(area);
    if(deptId != '-' && deptId != '*'){
        if(w){
            var ch = (w.Symbol__c || w.Name.substring(0, 1));
            dojo.create('div', { className: 'workPlace dayDiv', style: { marginLeft:"auto", marginRight:"auto" }, innerHTML: ch }, area);
        }
    }
};

/**
 * 種別変更
 *
 */
teasp.dialog.EmpShift.prototype.changedDayType = function(){
    var dt = dojo.byId('empShiftDayType').value;
    dojo.query('.shift_normal_day').forEach(function(elem) {
        dojo.style(elem, 'display', (dt == '1' ? 'none' : ''));
    });
    dojo.style('empShiftDayTypeOption', 'display', (dt == '1' ? '' : 'none'));
};

/**
 * 社員IDから社員オブジェクトを返す
 *
 * @param {string|null} id 社員ID
 * @return {Object|null}
 */
teasp.dialog.EmpShift.prototype.getEmpById = function(id){
    var emps = this.args.emps;
    for(var i = 0 ; i < emps.length ; i++){
        if(emps[i].Id == id){
            return emps[i];
        }
    }
    return null;
};

teasp.dialog.EmpShift.prototype.getEmps = function(){
    if(this.args.emps){
        return this.args.emps;
    }
    var emps = [];
    if(this.args.empIds){
        var lst = this.pouch.emps || [];
        for(var i = 0 ; i < lst.length ; i++){
            if(this.args.empIds.contains(lst[i].Id)){
                emps.push(lst[i]);
            }
        }
    }
    return emps;
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.EmpShift.prototype.ok = function(){
    var workPlaceId = dojo.byId('empShiftDepts').value;
    var patternId   = dojo.byId('empShiftPatterns').value;
    var empId       = null;
    var week = [];
    for(var i = 0 ; i < 7 ; i++){
        if(dojo.byId('schedW' + i).checked){
            week.push('' + i);
        }
    }
    if(week.length <= 0){
        this.showError('曜日を選択してください');
        return;
    }
    var dayType = (dojo.byId('empShiftDayType').value == '*' ? null : dojo.byId('empShiftDayType').value);
    if(dayType == null){
        this.showError('種別を選択してください');
        return;
    }
    if(dayType == '1' && dojo.byId('empShiftDayTypeLegalHoliday').checked){ // 法定休日が選択されている
        dayType = '2';
    }

    var st = teasp.util.time.clock2minutes(dojo.byId('empShiftSt').value);
    var et = teasp.util.time.clock2minutes(dojo.byId('empShiftEt').value);
    var note = dojo.byId('empShiftNote').value;

    var priority = parseInt(dojo.byId('empShiftPriority').value, 10);

    workPlaceId = ((workPlaceId  == '*' || dayType == '1' || dayType == '2') ? null : workPlaceId);
    patternId   = ((patternId == '-' || patternId == '*' || dayType == '1' || dayType == '2') ? null : patternId);
    st          = (typeof(st) == 'number' ? st : null);
    et          = (typeof(et) == 'number' ? et : null);

    var target = {};
    if(this.args.empIds){
        var dateList = this.pouch.dateList;
        var dkeys = [];
        for(i = 0 ; i < dateList.length ; i++){
            var dt = teasp.util.date.parseDate(dateList[i]);
            if(week.contains('' + dt.getDay())){
                dkeys.push(dateList[i]);
            }
        }
        for(i = 0 ; i < this.args.empIds.length ; i++){
            var id = this.args.empIds[i];
            target[id] = [{
                dateList    : dkeys,
                dayType     : dayType,
                workPlaceId : workPlaceId,
                patternId   : patternId,
                startTime   : null,
                endTime     : null,
                note        : note
            }];
        }
        if(this.args.empIds.length == 1){
            empId = this.args.empIds[0];
        }
    }
    if(!empId){
        if(this.args.emp){
            empId = this.args.emp.Id;
        }else if(this.args.emps && this.args.emps.length > 0){
            empId = (this.args.emps.length == 1 ? this.args.emps[0].Id : dojo.byId('empShiftEmps').value);
        }
    }

    var req = {
        empId       : empId,
        target      : target,
        week        : week.join(','),
        dayType     : dayType,
        workPlaceId : workPlaceId,
        patternId   : patternId,
        startTime   : null,
        endTime     : null,
        note        : note,
        seqNo       : (this.shiftObj && this.shiftObj.seqNo || 0),
        priority    : priority
    };
    this.onfinishfunc(
        req,
        'empShiftErrorRow',
        function(res){
            this.hide();
        },
        this
    );
};

/**
 * エラー表示
 * @param {string|null=} msg エラーメッセージ。null（または省略）の場合は非表示にする。
 */
teasp.dialog.EmpShift.prototype.showError = function(msg){
    teasp.util.showErrorArea(msg, 'empShiftErrorRow');
};

teasp.dialog.EmpShift.prototype.openSelectDept = function(){
	teasp.manager.dialogOpen(
		'SelectDept',
		null,
		{
			depts: this.pouch.depts
		},
		this,
		function(req, errorAreaId, callback, thisObject){
			if(req.targetId){
				dojo.byId('empShiftDepts').value = req.targetId;
				this.changedDept();
			}
			if(callback){
				callback.apply(thisObject);
			}
		}
	);
};
