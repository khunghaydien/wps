teasp.provide('teasp.dialog.BulkOverTime');
/**
 * 経費申請コメント入力ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.BulkOverTime = function(){
    this.id = 'dialogBulkZangyo';
    this.title = '';
    this.duration = 1;
    this.content = '<table id="dialogBulkZangyoTable" class="empApply2Table"><tr><td class="bulkZangyoTop"></td></tr><tr><td class="bulkZangyoBody"><div><div class="empApply2Div"><div class="empApply2CL" id="dialogBulkZangyoLabel1"></div><div class="empApply2VL"><table><tbody><tr><td><input type="text" class="inputab inpudate" id="dialogBulkZangyoDate1"></td><td><input type="button" id="dialogBulkZangyoCal1" class="pp_base pp_btn_cal"></td><td style="vertical-align: middle;"><div id="dialogBulkZangyoLabel2"></div></td><td><input type="text" class="inputab inpudate" id="dialogBulkZangyoDate2"></td><td><input type="button" id="dialogBulkZangyoCal2" class="pp_base pp_btn_cal"></td></tr></tbody></table></div></div><div class="empApply2Div"><div class="empApply2CL" id="dialogBulkZangyoLabel3"></div><div class="empApply2VL"><table><tbody><tr><td><input type="text" id="dialogBulkZangyoTime" class="inputime inputab" maxlength="5"></td><td id="dialogBulkZangyoLabel4"></td></tr></tbody></table></div></div><div class="empApply2Div"><div class="empApply2CL" id="dialogBulkZangyoLabel5"></div><div class="empApply2VL" id="dialogBulkZangyoNote"><textarea class="noteArea inputab"></textarea></div></div></div></td></tr><tr id="dialogBulkZangyoError" style="display:none;"><td><div></div></td></tr><tr id="dialogBulkZangyoCtrl1" class="ts-buttons-row"><td><div><button class="std-button1" id="dialogBulkZangyoOk"><div></div></button><button class="std-button2" id="dialogBulkZangyoCancel"><div></div></button></div></td></tr></table>';
    this.okLink = {
        id       : 'dialogBulkZangyoOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'dialogBulkZangyoCancel',
        callback : this.hide
    };
    this.eventHandles = [];
};

teasp.dialog.BulkOverTime.prototype = new teasp.dialog.Base();

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.BulkOverTime.prototype.preShow = function(){
    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    this.showError();
	this.valueWidth = '' + Math.min((window.innerWidth - 50), 370) + 'px';

    dojo.byId('dialogBulkZangyo_title').innerHTML = teasp.message.format(teasp.message.getLabel('tf10005130',
                                                        this.args.applyType == teasp.constant.APPLY_TYPE_ZANGYO
                                                        ? teasp.message.getLabel('overTime_head')  // 残業
                                                        : teasp.message.getLabel('tf10005140')));  // 早朝勤務

    dojo.byId('dialogBulkZangyoLabel1').innerHTML = teasp.message.getLabel('range_label'); // 期間
    dojo.byId('dialogBulkZangyoLabel2').innerHTML = teasp.message.getLabel('wave_label'); // ～
    dojo.byId('dialogBulkZangyoLabel3').innerHTML = this.args.applyType == teasp.constant.APPLY_TYPE_ZANGYO
                                                        ? teasp.message.getLabel('tf10005160')   // 残業時間
                                                        : teasp.message.getLabel('tf10005170');  // 早朝勤務時間
    dojo.byId('dialogBulkZangyoLabel4').innerHTML = teasp.message.getLabel('tf10008780'); // （所定休憩は含みません）
    dojo.byId('dialogBulkZangyoLabel5').innerHTML = teasp.message.getLabel('note_head'); // 備考

    var range = this.range = this.pouch.getDateRangeOfMonth(this.args.date, 1, 0); // １ヶ月前～１ヶ月後の日付を得る

    // カレンダーボタンが押された時の処理
    dojo.query('input[type="button"].pp_base').forEach(function(el){
        this.eventHandles.push(dojo.connect(el, 'onclick', this, function(e){
            var cal = e.target;
            var n = cal.id.substring(cal.id.length - 1);
            var ind = teasp.util.date.parseDate(dojo.byId('dialogBulkZangyoDate' + n).value); // 期間終了日の入力値を取得
            teasp.manager.dialogOpen(
                'Calendar',
                {
                    date: ind,
                    isDisabledDateFunc: function(d) {
                        // 選択可能なのは今月度内の日付として、それ以外は無効化する
                        return (teasp.util.date.compareDate(range.from, d) > 0 || teasp.util.date.compareDate(range.to, d) < 0);
                    }
                },
                null,
                this,
                function(o){
                    // 選択された日付を期間終了日にセット
                    dojo.byId('dialogBulkZangyoDate' + n).value = teasp.util.date.formatDate(o, 'SLA');
                }
            );
        }));
    }, this);

    // 期間の日付
    dojo.byId('dialogBulkZangyoDate1').value = teasp.util.date.formatDate(this.args.date, 'SLA');
    dojo.byId('dialogBulkZangyoDate2').value = teasp.util.date.formatDate(this.args.date, 'SLA');

    // 残業時間（早朝勤務時間）
    var inpt = dojo.byId('dialogBulkZangyoTime');
    inpt.value = '';
    this.eventHandles.push(dojo.connect(inpt, 'blur'      , this, teasp.util.time.onblurTime    ));
    this.eventHandles.push(dojo.connect(inpt, 'onkeypress', this, teasp.util.time.onkeypressTime));

    // 備考
    dojo.query('#dialogBulkZangyoNote textarea')[0].value = '';

    // ボタン
    dojo.byId('dialogBulkZangyoOk'    ).firstChild.innerHTML = teasp.message.getLabel(this.pouch.isUseWorkFlow() ? 'applyx_btn_title' : 'fix_btn_title');
    dojo.byId('dialogBulkZangyoCancel').firstChild.innerHTML = teasp.message.getLabel('cancel_btn_title');

	if(!teasp.isNarrow()){
		dojo.style('dialogBulkZangyoTable', 'width', '530px');
	}else{
		dojo.style('dialogBulkZangyoTable', 'width', '100%');
		dojo.style('dialogBulkZangyoTable', 'border', '1px solid #ccc');
	}
	dojo.style('dialogBulkZangyoNote', 'width', this.valueWidth);

	return true;
};

/**
 * エラー表示
 */
teasp.dialog.BulkOverTime.prototype.showError = function(msg){
    dojo.style('dialogBulkZangyoError', 'display', (msg ? '' : 'none'));
    dojo.query('#dialogBulkZangyoError div')[0].innerHTML = msg;
};

/**
 * 申請の対象日を抽出
 * @param {string} sd 開始日
 * @param {string} ed 終了日
 * @returns {Array.<Object>} 日次情報の配列
 */
teasp.dialog.BulkOverTime.prototype.getTargets = function(sd, ed){
    var lst = [];
    var d = sd;
    var zType = this.args.applyType == teasp.constant.APPLY_TYPE_ZANGYO ? 0 : 1;
    while(d <= (ed || sd)){
        var o = this.pouch.getObj().days[d];
        var hj = (o.rack && o.rack.holidayJoin && o.rack.holidayJoin.flag) || 0;
        var va = (o.rack && o.rack.validApplys) || null;
        if(((o.dayType != 0 || o.plannedHoliday) && (!va || !va.kyushtu.length))  // (平日でないまたは有休計画付与日)かつ 休日出勤申請済みでない
        || (!zType && (hj & 2))                  // 残業申請かつ（終日休or午後半休）
        || (!zType && va && va.zangyo.length)    // 残業申請かつ残業申請済み
        || (!zType && va && va.earlyEnd)         // 残業申請かつ早退申請済み
        || (!zType && o.rack && typeof(o.rack.fixEndTime) == 'number' && o.rack.fixEndTime >= (48*60)) // 残業申請かつ終業時刻が48:00
        || (zType && (hj & 1))                   // 早朝勤務申請かつ（終日休or午前半休）
        || (zType && va && va.earlyStart.length) // 早朝勤務申請かつ早朝勤務申請済み
        || (zType && va && va.lateStart)         // 早朝勤務申請かつ遅刻申請済み
        || (zType && o.rack && typeof(o.rack.fixStartTime) == 'number' && o.rack.fixStartTime <= 0)   // 早朝勤務申請かつ始業時刻が0:00
        || (va && va.dailyFix)                   // 日次確定済み
        || (o.interim)                           // 承認されるまで勤務時間の入力不可＝オンで、未承認の休日出勤申請または振替申請がある
        ){
        }else{
            lst.push(o);
        }
        d = teasp.util.date.addDays(d, 1);
    }
    return lst;
};

/**
 * 承認申請
 *
 * @override
 */
teasp.dialog.BulkOverTime.prototype.ok = function(){
    this.showError();

    // 期間の取得とチェック
    var sd = teasp.util.strToDate(dojo.byId('dialogBulkZangyoDate1').value);
    var ed = teasp.util.strToDate(dojo.byId('dialogBulkZangyoDate2').value);
    if(sd.failed != 0){ // 空または書式が無効
        this.showError(dojo.replace(sd.tmpl, [teasp.message.getLabel('rangeStartDate_label')])); // 期間の開始日
        return;
    }
    if(ed.failed != 0){ // 空または書式が無効
        this.showError(dojo.replace(ed.tmpl, [teasp.message.getLabel('rangeEndDate_label')])); // 期間の終了日
        return;
    }
    dojo.byId('dialogBulkZangyoDate1').value = sd.dater;
    dojo.byId('dialogBulkZangyoDate2').value = ed.dater;
    if(sd.datef > ed.datef){ // 指定が逆
        this.showError(teasp.message.getLabel('tm10003300')); // 期間の設定が無効です
        return;
    }
    // 期間が月度をまたいでいる
    if(teasp.util.date.compareDate(sd.date, this.range.from) < 0
    || teasp.util.date.compareDate(ed.date, this.range.to  ) > 0){
        this.showError(teasp.message.getLabel('tk10001185')); // 月度をまたぐ期間は指定できません
        return;
    }
    // 残業時間を取得
    var time = teasp.util.time.clock2minutes(dojo.byId('dialogBulkZangyoTime').value);
    if(time === undefined || time <= 0){
        this.showError(teasp.message.getLabel('tf10005150' // {0}を設定してください
                , teasp.message.getLabel(this.args.applyType == teasp.constant.APPLY_TYPE_ZANGYO
                ? 'tf10005160'     // 残業時間
                : 'tf10005170'))); // 早朝勤務時間
        return;
    }
    // 備考
    var note  = dojo.query('#dialogBulkZangyoNote textarea')[0].value;
    if(this.pouch.isRequireNote(teasp.constant.APPLY_TYPE_ZANGYO)
    &&(!note || !note.replace(/[\s　]+$/g,''))){
        this.showError(teasp.message.getLabel('tm10003680')); // 備考を入力してください
        return;
    }

    // 対象日のリストを取得
    var lst = this.getTargets(sd.datef, ed.datef);
    if(!lst.length){
        this.showError(teasp.message.getLabel('tf10005180' // {0}の対象日がありません
                , teasp.message.getLabel(this.args.applyType == teasp.constant.APPLY_TYPE_ZANGYO
                ? 'tm10001293'     // 残業申請
                : 'tm10001294'))); // 早朝勤務申請
        return;
    }
    // 申請実行
    teasp.manager.dialogOpen('BusyWait');
    this.applyBulkZangyo(time, note, lst, dojo.hitch(this, function(succeed, result){
        var errmsg = (succeed ? null : result);
        if(errmsg){
            this.showError(errmsg);
        }
        this.finish(errmsg);
    }));
};

/**
 * 申請を行った後で月次情報を再取得する
 * @param {string|null} errmsg
 */
teasp.dialog.BulkOverTime.prototype.finish = function(errmsg){
    teasp.action.contact.transEmpMonth({
        empId : this.pouch.getEmpId(),
        month : this.pouch.getYearMonth()
    },
    this.pouch,
    this,
    function(result){
        teasp.manager.dialogClose('BusyWait');
        this.onfinishfunc();
        if(!errmsg){
            this.close();
        }
    },
    function(result){
        teasp.manager.dialogClose('BusyWait');
        if(!errmsg){
            this.showError(teasp.message.getErrorMessage(result));
        }
    });
};

/**
 * 古い申請があれば、再利用のため、最新の申請のIDを得る
 * @param {Object} o
 * @param {string} applyType
 * @returns {string|null}
 */
teasp.dialog.BulkOverTime.prototype.getLastApplyId = function(o, applyType){
    var lst = [];
    var applys = (o.rack && o.rack.allApplys) || [];
    for(var i = 0 ; i < applys.length ; i++){
        var a = applys[i];
        if(a.applyType == applyType){
            lst.push(a);
        }
    }
    if(lst.length > 1){
        lst = lst.sort(function(a, b){
            return (a.applyTime < b.applyTime ? 1 : -1);
        });
    }
    return (lst.length > 0 ? lst[0].id : null);
};

/**
 * 事前申請か事後申請かの判別
 * @param {string} date
 * @param {number} t
 * @returns {boolean}
 */
teasp.dialog.BulkOverTime.prototype.getAfterFlag = function(date, t){
    var td = teasp.util.date.getToday();
    var est = teasp.util.date.parseDate(teasp.util.date.formatDate(date) + ' ' + teasp.util.time.timeValue(t));
    return (est.getTime() <= td.getTime());
};

/**
 * 一括で申請を実行
 * @param {number} time
 * @param {string|null} note
 * @param {Array.<Object>} lst
 * @param {Function} callback
 */
teasp.dialog.BulkOverTime.prototype.applyBulkZangyo = function(time, note, lst, callback){
    this.applyEmpDay({
        time        : time,
        note        : note,
        lst         : lst,
        callback    : callback
    }, 0);
};

/**
 * 残業申請または早朝勤務申請を実行
 *
 * @param {Object} info
 * @param {number} index
 */
teasp.dialog.BulkOverTime.prototype.applyEmpDay = function(info, index){
    if(index >= info.lst.length){
        info.callback(true);
        return;
    }
    var o = info.lst[index];
    var st = (this.args.applyType == teasp.constant.APPLY_TYPE_ZANGYO ? o.rack.fixEndTime : o.rack.fixStartTime);
    var et = st;
    if(this.args.applyType == teasp.constant.APPLY_TYPE_ZANGYO){
        et = teasp.logic.EmpTime.getReachTime(st, o.pattern.restTimes || [], info.time);
    }else{
        st = teasp.logic.EmpTime.getReachTimeReverse(et, o.pattern.restTimes || [], info.time);
    }
    if(et > (48 * 60) || et < 0){ // 終了時刻が48:00を超える場合は、48:00に変更
        et = (48 * 60);
    }
    if(st < 0){
        st = 0;
    }
    var t = (this.args.applyType == teasp.constant.APPLY_TYPE_ZANGYO ? et : st);
    var req = {
        empId            : this.pouch.getEmpId(),
        month            : this.pouch.getYearMonth(),
        lastModifiedDate : this.pouch.getLastModifiedDate(),
        date             : o.date,
        apply            : {
            id           : this.getLastApplyId(o, this.args.applyType),
            applyType    : this.args.applyType,
            patternId    : null,
            holidayId    : null,
            status       : null,
            startDate    : o.date,
            endDate      : o.date,
            exchangeDate : null,
            startTime    : st,
            endTime      : et,
            note         : info.note,
            contact      : null,
            afterFlag    : this.getAfterFlag(o.date, st)
        }
    };
    console.log(req);
    teasp.action.contact.remoteMethod('applyEmpDay', req,
        dojo.hitch(this, function(result){
            if(result.result == 'OK'){
                this.pouch.setLastModifiedDate(result.lastModifiedDate);
                this.checkDirect(info, t, index);
            }else{
                info.callback(false, teasp.message.getErrorMessage(result));
            }
        }),
        dojo.hitch(this, function(event){
            info.callback(false, teasp.message.getErrorMessage(event));
        })
    );
};

/**
 * 直行直帰申請があれば時間を調整する
 *
 * @param {Object} info
 * @param {number} t 残業申請なら終了時刻、早朝勤務申請なら開始時刻
 * @param {number} index
 */
teasp.dialog.BulkOverTime.prototype.checkDirect = function(info, t, index){
    var o = info.lst[index];
    var dw = this.pouch.getEmpDay(o.date);
    var dr = dw.getEmpApplyByKey(teasp.constant.APPLY_KEY_DIRECT); // 直行・直帰申請
    var hw = dw.getEmpApplyByKey(teasp.constant.APPLY_KEY_KYUSHTU); // 休日出勤申請
    var directFlag = ((dr && dr.directFlag) || (hw && hw.directFlag) || 0);
    var flag = (this.args.applyType == teasp.constant.APPLY_TYPE_ZANGYO ? 2 : 1);
    if(!(directFlag & flag)){ // 直行直帰申請がない、または影響ない
        this.applyEmpDay(info, index + 1);
        return;
    }
    var orgSt = dw.getStartTime(true, null, teasp.constant.C_REAL) || null; // 入力済みの出社時刻
    var orgEt = dw.getEndTime  (true, null, teasp.constant.C_REAL) || null; // 入力済みの退社時刻
    var tt = dw.createTimeTable(((flag & 1) ? t : orgSt), ((flag & 2) ? t : orgEt));

    var req = {
        empId            : this.pouch.getEmpId(),
        month            : this.pouch.getYearMonth(),
        lastModifiedDate : this.pouch.getLastModifiedDate(),
        mode             : this.pouch.getMode(),
        date             : o.date,
        dayFix           : false,
        timeTable        : tt,
        refreshWork      : true,
        clearWork        : false
    };
    console.log(req);
    teasp.action.contact.remoteMethod('inputTimeTable', req,
        dojo.hitch(this, function(result){
            if(result.result == 'OK'){
                this.pouch.setLastModifiedDate(result.lastModifiedDate);
                this.applyEmpDay(info, index + 1);
            }else{
                info.callback(false, teasp.message.getErrorMessage(result));
            }
        }),
        dojo.hitch(this, function(event){
            info.callback(false, teasp.message.getErrorMessage(event));
        })
    );
};
