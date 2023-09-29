teasp.provide('teasp.dialog.EmpDay');
/**
 * 社員＋日ツールチップダイアログ
 *
 * @constructor
 */
teasp.dialog.EmpDay = function(localObj){
    this.inited = false;
    this.opend = false;
    this.dialog = null;
    this.id = 'tooltipEmpDay';
    this.content = '<div class="dlg_content"><table class="tooltip" style="width:300px;"><tbody id="EmpDayTbody"></tbody></table><table class="tooltip" style="margin-top:8px;width:100%;"><tr><td style="padding:2px 0px;text-align:center;"><input type="button" value="閉じる" id="EmpDayCancel" /></td></tr></table></div>';
    this.targetEmps = {};
    this.clickRowEvent = null;
    this.eventHandles = {};
    this.localObj = localObj;
};

teasp.dialog.EmpDay.prototype.getDialog = function(){
    return this.dialog;
};

/**
 *
 */
teasp.dialog.EmpDay.prototype._init = function(){
    if(this.inited){
        return;
    }
    this.inited = true;
    var that = this;
    var o = {
        id       : this.id,
        content  : this.content,
        onMouseLeave: function(){
            dijit.popup.close(that.dialog);
        }
    };
    this.dialog = new dijit.TooltipDialog(o);
    this.dialog.startup();
    dojo.connect(this.dialog, 'onOpen', this, function(){
        if(!this.opened){
            dojo.connect(dojo.byId('EmpDayCancel'), 'onclick', this, function(){
                dijit.popup.close(that.dialog);
            });
        }
        this.opened = true;
        that.createContent();
    });
};

/**
 *
 */
teasp.dialog.EmpDay.prototype.ready = function(emp){
    this._init();
};

teasp.dialog.EmpDay.prototype.setEmpDay = function(emp, dkey, normalPatternSymbol){
    this.emp = emp;
    this.dkey = dkey;
    this.normalPatternSymbol = normalPatternSymbol;
};

teasp.dialog.EmpDay.prototype.getDisplayDayType = function(dayType){
	switch(dayType){
	case '0': return '勤務日';
	case '1': return '非勤務日(所定休日)';
	case '2': return '非勤務日(法定休日)';
	default: return '';
	}
};

/**
*
*/
teasp.dialog.EmpDay.prototype.createContent = function(){
    var tbody, row, cell;
    tbody = dojo.byId('EmpDayTbody');
    while(tbody.firstChild){
        dojo.destroy(tbody.firstChild);
    }
    var day = this.emp.days[this.dkey];
    var deptName = (this.emp.DeptId__r ? this.emp.DeptId__r.DeptCode__c + '-' + this.emp.DeptId__r.Name : null);
    if(deptName){
        row  = dojo.create('tr', null, tbody);
        dojo.create('div', { innerHTML: deptName }, dojo.create('td', null, row));
    }
    row  = dojo.create('tr', null, tbody);
    dojo.create('div', { innerHTML: (this.emp.EmpCode__c || '') + '  ' + this.emp.Name }, dojo.create('td', null, row));
    row  = dojo.create('tr', null, tbody);
    dojo.create('div', { innerHTML: teasp.util.date.formatDate(this.dkey, 'JP1') }, dojo.create('td', null, row));
    var l = [];
    var p = null, f = false;
    if(day.dayType == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY){
        l.push('所定休日');
    }else if(day.dayType == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
        l.push('祝日');
    }else if(day.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){
        l.push('法定休日');
    }else{
        if(day.plannedHoliday && (!day.applys.kyushtu || !day.applys.kyushtu.length)){ // 有休計画付与日
            l.push('有休計画付与日');
        }else{
            if(day.applys.holidayAll){
                l.push(day.applys.holidayAll.HolidayId__r.Name + ' (終日)');
            }else{
                l.push('勤務日');
                f = true;
                p = day.pattern;
                if(day.applys.holidayAm){
                    l.push(day.applys.holidayAm.HolidayId__r.Name + ' (午前休)');
                }
                if(day.applys.holidayPm){
                    l.push(day.applys.holidayPm.HolidayId__r.Name + ' (午後休)');
                }
            }
        }
    }
    row  = dojo.create('tr', null, tbody);
    dojo.create('div', { innerHTML : l.join(', ')  }, dojo.create('td', null, row));
    if(f){
        if(!p){
            p = this.emp.empType.days[this.dkey].config;
            p.Name = ' 通常勤務';
            p.Symbol__c = this.normalPatternSymbol;
        }
    }
    if(p){
        row  = dojo.create('tr', null, tbody);
        cell = dojo.create('td', null, row);
        if(day.pattern){
            var ch = (p.Symbol__c || p.Name.substring(0, 1));
            dojo.create('div', { className: 'pattern dayDiv', style: { "float":"left" }, innerHTML: ch }, cell);
        }
        dojo.create('div', { innerHTML : p.Name }, cell);

        row  = dojo.create('tr', null, tbody);
        var buf = teasp.util.time.timeValue(p.StdStartTime__c) + '～' + teasp.util.time.timeValue(p.StdEndTime__c);
        dojo.create('div', { innerHTML: buf }, dojo.create('td', null, row));

        row  = dojo.create('tr', null, tbody);
        var rt = (p.RestTimes__c && p.RestTimes__c.length > 0 ? p.RestTimes__c.split(/,/) : []);
        if(day.applys.holidayAm && !day.applys.holidayPm && p.UseHalfHolidayRestTime__c){
        	rt = (p.AmHolidayRestTimes__c && p.AmHolidayRestTimes__c.length > 0 ? p.AmHolidayRestTimes__c.split(/,/) : []);
        }else if(!day.applys.holidayAm && day.applys.holidayPm && p.UseHalfHolidayRestTime__c){
        	rt = (p.PmHolidayRestTimes__c && p.PmHolidayRestTimes__c.length > 0 ? p.PmHolidayRestTimes__c.split(/,/) : []);
        }
        var tmps = [];
        for(var j = 0 ; j < rt.length ; j++){
            var match = /(\d+)\-(\d+)/.exec(rt[j]);
            if(match){
                tmps.push(teasp.util.time.timeValue(match[1]) + '～' + teasp.util.time.timeValue(match[2]));
            }
        }
        dojo.create('div', { innerHTML: '(休憩：' + (tmps.length > 0 ? tmps.join(', ') : 'なし') + ')' }, dojo.create('td', null, row));

        if(p.UseDiscretionary__c){ // 裁量
            row  = dojo.create('tr', null, tbody);
            dojo.create('div', { innerHTML: '裁量' }, dojo.create('td', null, row));
        }
    }
    // 部署アイコンを表示
    if(day.workPlace && day.workPlace.Id != this.emp.DeptId__c){ // 勤務場所の指定があり、所属部署と異なる場合
        var ch = (day.workPlace.Symbol__c || day.workPlace.Name.substring(0, 1));
        row  = dojo.create('tr', null, tbody);
        cell = dojo.create('td', null, row);
        dojo.create('div', { innerHTML: '主管部署：',  style: { "float":"left" } }, cell);
        dojo.create('div', { className: 'workPlace dayDiv', style: { "float":"left", marginRight:"2px" }, innerHTML: ch }, cell);
        dojo.create('div', { innerHTML: ' ' + day.workPlace.Name }, cell);
    }
    // 申請アイコンを表示
    for(var key in day.applys){
        if(!day.applys.hasOwnProperty(key)) {
            continue;
        }
        var alst = is_array(day.applys[key]) ? day.applys[key] : [day.applys[key]];
        for(var i = 0 ; i < alst.length ; i++){
            var a = alst[i];
            row  = dojo.create('tr', null, tbody);
            cell = dojo.create('td', null, row);
            dojo.create('div', {
                className: 'pp_base pp_ap_' + teasp.view.Shift.getApplyStyleKey(key) + teasp.constant.getStatusStyleSuffix(a.Status__c),
                style: { "float":"left", marginTop:"2px", marginRight:"2px" }
            }, cell);
            var buf = a.ApplyType__c;
            if(a.ApplyType__c == teasp.constant.APPLY_TYPE_HOLIDAY){ // 休暇申請
                if(a.HolidayId__r.Range__c == teasp.constant.RANGE_TIME){
                    buf += '(' + a.HolidayId__r.Name
                         + '/' + teasp.util.time.timeValue(a.StartTime__c) + '-' + teasp.util.time.timeValue(a.EndTime__c) + ')';
                }else{
                    buf += '(' + a.HolidayId__r.Name + ')';
                }
            }else if(a.ApplyType__c == teasp.constant.APPLY_TYPE_PATTERNS || a.ApplyType__c == teasp.constant.APPLY_TYPE_PATTERNL){ // 勤務時間変更申請 or 長期時間変更申請
                buf += '(' + (a.PatternId__r ? a.PatternId__r.Name : this.getDisplayDayType(a.DayType__c)) + ')';
            }else if(a.ApplyType__c == teasp.constant.APPLY_TYPE_EXCHANGE){
                buf += '('
                    + teasp.util.date.formatDate(a.StartDate__c, 'M/d')
                    + '⇔'
                    + teasp.util.date.formatDate(a.ExchangeDate__c, 'M/d')
                    + ')';
            }
            buf += '(' + a.Status__c + ')';
            dojo.create('div', { innerHTML: buf }, cell);
        }
    }
    // メモを表示
    if(day.memo){
        row  = dojo.create('tr', null, tbody);
        dojo.create('div', { innerHTML: teasp.util.entitize(day.memo).replace(/\n/g, '<br/>') }, dojo.create('td', null, row));
    }
};
