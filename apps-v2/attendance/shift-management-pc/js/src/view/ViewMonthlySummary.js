teasp.provide('teasp.view.MonthlySummary');
/**
 * 月次サマリー画面
 *
 * @constructor
 * @extends {teasp.view.Base}
 * @author DCI小島
 */
teasp.view.MonthlySummary = function(){
};

teasp.view.MonthlySummary.prototype = new teasp.view.Base();

/**
 * 画面初期化
 *
 * @param {Object} messageMap メッセージテーブル
 * @param {Function} onSuccess 正常受信時の処理
 * @param {Function} onFailure 異常受信時の処理
 */
teasp.view.MonthlySummary.prototype.init = function(messageMap, onSuccess, onFailure){

    teasp.message.mergeLabels(globalMessages || {});
    teasp.message.mergeLabels(messageMap ? (messageMap[teasp.message.getLanguageLocaleKey()] || {}) : {});

    this.readParams({ target: 'empMonth' });

    dojo.byId('areaBody').innerHTML = '<table class="colla_table" style="width:100%;"><tr class="buttons"><td style="padding-bottom:4px;" colspan="2"><table class="colla_table" style="margin-bottom:4px;"><tr><td style="width:110px;"><button class="std-button1" id="monthlyPrint" ><div></div></button></td><td style="width:80px;display:none;" id="monsumApprove"><button class="std-button3" id="monthlyApprove" ><div></div></button></td><td style="width:80px;"><button class="std-button2" id="monthlyClose" ><div></div></button></td><td></td></tr></table></td></tr><tr><td style="padding-bottom:4px;" colspan="2"><table id="headTable" class="colla_table" style="width:100%;"><tr><td style="width:140px;border-top:1px solid #222222;border-left:1px solid #222222;border-bottom:1px solid #222222;"><table class="colla_table" style="width:100%;"><tr><td style="white-space:nowrap;text-align:left;"><div style="margin:0px 4px 0px 8px;" id="monsumTitle"></div></td><td style="white-space:nowrap;text-align:left;"><div style="margin:0px 4px;" id="yearMonth"></div></td></tr><tr><td style="white-space:nowrap;text-align:left;vertical-align:middle;font-size:0.9em;"><div style="margin:0px 4px 0px 8px;" id="monsumStatus"></div></td><td style="white-space:nowrap;text-align:left;vertical-align:middle;font-size:0.9em;"><div style="margin:0px 4px;" id="monthlyStatus"></div></td></tr></table></td><td style="width:auto;border:1px solid #222222;"><table class="colla_table" style="width:100%;"><tr><td style="width:30%;white-space:nowrap;text-align:center;border-bottom:1px solid #222222;border-right:1px solid #222222;font-size:0.9em;"><div style="margin:0px;" id="monsumDept"></div></td><td style="width:25%;white-space:nowrap;text-align:center;border-bottom:1px solid #222222;border-right:1px solid #222222;font-size:0.9em;"><div style="margin:0px;" id="monsumEmpType"></div></td><td style="width:20%;white-space:nowrap;text-align:center;border-bottom:1px solid #222222;border-right:1px solid #222222;font-size:0.9em;"><div style="margin:0px;" id="monsumEmpCode"></div></td><td style="width:25%;white-space:nowrap;text-align:center;border-bottom:1px solid #222222;font-size:0.9em;"><div style="margin:0px;" id="monsumName"></div></td></tr><tr><td style="text-align:left;vertical-align:middle;border-right:1px solid #222222;"><div style="margin:0px 7px;word-break:break-all;" id="department">&nbsp;</div></td><td style="text-align:left;vertical-align:middle;border-right:1px solid #222222;"><div style="margin:0px 7px;word-break:break-all;" id="empTypeName">&nbsp;</div></td><td style="text-align:left;vertical-align:middle;border-right:1px solid #222222;"><div style="margin:0px 7px;word-break:break-all;" id="empCode">&nbsp;</div></td><td style="text-align:left;vertical-align:middle;"><div style="margin:0px 7px;word-break:break-all;" id="empName">&nbsp;</div></td></tr></table></td></tr></table></td></tr><tr><td style="padding-bottom:4px;" colspan="2"><table class="prtv_table" style="width:100%;" id="workTable"><tbody class="prtv_body" id="workTableBody"></tbody></table></td></tr><tr><td style="text-align:left;" colspan="2"><div id="monsumMean"></div><hr id="summaryTitleBorder" size="1" color="#888888" style="border-style:dashed;" /></td></tr><tr id="summaryTitleRow"><td style="text-align:left; width:175px"><a name="summary"></a><span id="yearMonth2"></span><span id="monsumSummary"></span></td><td style="text-align:left;" class="buttons"><button class="std-button2" id="helpURL" ><div></div></button></td></tr><tr><td id="summaryBottom" style="padding:0px;" colspan="2"></td></tr><tr><td colspan="2"><div style="width:780px;"></div></td></tr></table>';

    if(this.viewParams['narrow'] || teasp.isMobile()){
        dojo.query('tr.buttons').forEach(function(el){
            dojo.style(el, 'display', 'none');
        });
    }
    if(teasp.isAndroid()){
        dojo.style('areaBody', 'padding-right' ,  '70px');
        dojo.style('areaBody', 'padding-bottom', '100px');
    }

    var tbody = dojo.byId('workTableBody');
    dojo.empty(tbody);
    var row = dojo.create('tr', { id: 'workTableHeadRow' }, tbody);
    dojo.create('td', { id: 'monsumHead1' , className: 'prtv_head prtv_head_date', colSpan: 3 }, row);
    dojo.create('td', { id: 'monsumHead2' , className: 'prtv_head prtv_head_info' }, row);
    dojo.create('td', { id: 'monsumHead11', className: 'prtv_head prtv_head_entr', style:'display:none;' }, row); // 入館
    dojo.create('td', { id: 'monsumHead3' , className: 'prtv_head prtv_head_begt' }, row);
    dojo.create('td', { id: 'monsumHead4' , className: 'prtv_head prtv_head_endt' }, row);
    dojo.create('td', { id: 'monsumHead12', className: 'prtv_head prtv_head_exit', style:'display:none;' }, row); // 退館
    dojo.create('td', { id: 'monsumHead13', className: 'prtv_head prtv_head_dive', style:'display:none;' }, row); // 乖離状況
    dojo.create('td', { id: 'monsumHead5' , className: 'prtv_head prtv_head_rest' }, row);
    dojo.create('td', { id: 'monsumHead6' , className: 'prtv_head prtv_head_work' }, row);
    dojo.create('td', { id: 'monsumHead7' , className: 'prtv_head prtv_head_over' }, row);
    dojo.create('td', { id: 'monsumHead8' , className: 'prtv_head prtv_head_holy' }, row);
    dojo.create('td', { id: 'monsumHead9' , className: 'prtv_head prtv_head_nigh' }, row);
    dojo.create('td', { id: 'monsumHead10', className: 'prtv_head prtv_head_note' }, row);
    for(var i = 0 ; i < 31 ; i++){
        var row = dojo.create('tr', { className: ((i%2) == 0 ? 'prtv_row_even' : 'prtv_row_odd') }, tbody);
        dojo.create('td', { className: 'prtv prtv_date' }, row);
        dojo.create('td', { className: 'prtv prtv_week' }, row);
        dojo.create('td', { className: 'prtv prtv_sign' }, row);
        dojo.create('td', { className: 'prtv prtv_info' }, row);
        dojo.create('td', { className: 'prtv prtv_entr', style:'display:none;' }, row); // 入館
        dojo.create('td', { className: 'prtv prtv_begt' }, row);
        dojo.create('td', { className: 'prtv prtv_endt' }, row);
        dojo.create('td', { className: 'prtv prtv_exit', style:'display:none;' }, row); // 退館
        dojo.create('td', { className: 'prtv prtv_dive', style:'display:none;' }, row); // 乖離状況
        dojo.create('td', { className: 'prtv prtv_rest' }, row);
        dojo.create('td', { className: 'prtv prtv_work' }, row);
        dojo.create('td', { className: 'prtv prtv_over' }, row);
        dojo.create('td', { className: 'prtv prtv_holy' }, row);
        dojo.create('td', { className: 'prtv prtv_nigh' }, row);
        dojo.create('td', { className: 'prtv prtv_note' }, row);
    }
    var row = dojo.create('tr', { id: 'workTableFootRow', style: { height:"26px" } }, tbody);
    dojo.create('td', { className: 'prtv_foot prtv_foot_goke', colSpan: 6, innerHTML: teasp.message.getLabel('total_label') }, row); // 合計
    dojo.create('td', { className: 'prtv_foot prtv_foot_rest' }, row);
    dojo.create('td', { className: 'prtv_foot prtv_foot_work' }, row);
    dojo.create('td', { className: 'prtv_foot prtv_foot_over' }, row);
    dojo.create('td', { className: 'prtv_foot prtv_foot_holy' }, row);
    dojo.create('td', { className: 'prtv_foot prtv_foot_nigh' }, row);
    dojo.create('td', { className: 'prtv_foot prtv_foot_note' }, row);

    // サーバへリクエスト送信
    teasp.manager.request(
        'loadEmpMonthPrint',
        this.viewParams,
        this.pouch,
        { hideBusy : true },
        this,
        function(){
            this.pouch.checkEmpMonthHook(dojo.hitch(this, function(succeed, event){
                if(succeed){
                    this.show();
                    onSuccess();
                }else{
                    onFailure(event);
                }
            }));
        },
        function(event){
            onFailure(event);
        }
    );
};

teasp.view.MonthlySummary.prototype.showMessage = function(id, msg){
    var d = dojo.byId(id);
    if(d){
        d.innerHTML = msg;
    }
};

teasp.view.MonthlySummary.prototype.styleDisplay = function(id, flag){
    var d = dojo.byId(id);
    if(d){
        dojo.style(d, 'display', flag ? '' : 'none');
    }
};

/**
 * 月次サマリー表示
 */
teasp.view.MonthlySummary.prototype.show = function(){
    this.helperSummary = new teasp.helper.Summary(this.pouch);

    // 入館管理情報の表示/非表示
    var msac = this.pouch.isMsAccessInfo(); // 月次サマリに入退館情報を表示する
    var table = dojo.byId('workTable');
    dojo.query('td.prtv_head_entr,td.prtv_head_exit,td.prtv_head_dive,td.prtv_entr,td.prtv_exit,td.prtv_dive', table).forEach(function(el){
        dojo.style(el, 'display', (msac ? '' : 'none'));
    });
    dojo.attr(dojo.query('td.prtv_foot_goke', table)[0], 'colSpan', (msac ? 9 : 6));

    this.showMain();
};

teasp.view.MonthlySummary.prototype.showMain = function(){
	this.showControl();
    this.showLabel();
    this.showHead();
    this.showDayBody();
    this.showDayFoot();
    this.showSummaryBottom();
};

/**
 * ボタン配置
 */
teasp.view.MonthlySummary.prototype.showControl = function(){
    // 印刷を実行
    dojo.byId('monthlyPrint').firstChild.innerHTML = teasp.message.getLabel('printOut_btn_title'); // プリンタへ出力
    dojo.connect(dojo.byId('monthlyPrint'), 'onclick', function(){
        window.print();
        return false;
    });
    // ウィンドウを閉じる
    dojo.byId('monthlyClose').firstChild.innerHTML = teasp.message.getLabel('close_btn_title'); // 閉じる
    dojo.connect(dojo.byId('monthlyClose'), 'onclick', function(){
        (window.open('','_top').opener=top).close();
        return false;
    });
    // 承認／却下
    if(this.pouch.isEmpMonthApprover()){
        this.styleDisplay('monsumApprove', true);
        var that = this;
        dojo.byId('monthlyApprove').firstChild.innerHTML = teasp.message.getLabel('tf10000270'); // 承認／却下
        dojo.connect(dojo.byId('monthlyApprove'), 'onclick', function(){
            teasp.manager.dialogOpen(
                'Approval',
                {
                    apply   : { id: that.pouch.getEmpMonthApplyId() }
                },
                that.pouch,
                that,
                function(){
                    location.reload();
                }
            );
        });
    }
    // ヘルプページを表示する
    if(!this.pouch.isHideMonthlySummaryHelpURL()){
        dojo.byId('helpURL').firstChild.innerHTML = teasp.message.getLabel('tk10007426'); // 月次サマリーのヘルプを開く
        var typeHelpURL = this.pouch.getHelpURL();
        dojo.connect(dojo.byId('helpURL'), 'onclick', function(){
            window.open(typeHelpURL);
            return false;
        });
    }
};

/**
 * 文言をセット
 */
teasp.view.MonthlySummary.prototype.showLabel = function(){
    this.showMessage('monsumTitle'  , teasp.message.getLabel('workTable_label'));            // 勤務表
    this.showMessage('monsumStatus' , teasp.message.getLabel('status_label'));               // ステータス
    this.showMessage('monsumDept'   , teasp.message.getLabel('dept_label'));                 // 部門
    this.showMessage('monsumEmpType', teasp.message.getLabel('empType_label'));              // 勤務体系
    this.showMessage('monsumEmpCode', teasp.message.getLabel('tk10000068'));                 // 社員コード
    this.showMessage('monsumName'   , teasp.message.getLabel('empName_label'));              // 社員名
    this.showMessage('monsumHead1'  , teasp.message.getLabel('date_head'));                  // 日付
    this.showMessage('monsumHead2'  , teasp.message.getLabel(this.pouch.isUseWorkLocation() ? 'tw00000170' : 'tm10009190')); // イベント／<br/>勤務状況
    this.showMessage('monsumHead11' , teasp.message.getLabel('ac00000250'));                 // 入館
    this.showMessage('monsumHead3'  , teasp.message.getLabel('startTime_head'));             // 出社
    this.showMessage('monsumHead4'  , teasp.message.getLabel('endTime_head'));               // 退社
    this.showMessage('monsumHead12' , teasp.message.getLabel('ac00000260'));                 // 退館
    this.showMessage('monsumHead13' , teasp.message.getLabel('ac00000270'));                 // 乖離<br/>状況
    this.showMessage('monsumHead5'  , teasp.message.getLabel('rest_head'));                  // 休憩
    this.showMessage('monsumHead6'  , teasp.message.getLabel(this.pouch.isMsDailyWorkTimeIsReal() ? 'tm10009201' : 'tm10009200')); // 労働<br/>時間
    this.showMessage('monsumHead7'  , teasp.message.getLabel('overTime_head'));              // 残業
    this.showMessage('monsumHead8'  , teasp.message.getLabel('holidayWorkTime_head'));       // 休日
    this.showMessage('monsumHead9'  , teasp.message.getLabel('nightWorkTime_head'));         // 深夜
    this.showMessage('monsumHead10' , teasp.message.getLabel('note_head'));                  // 備考
    this.showMessage('monsumMean'   , teasp.message.getLabel('tm10009090'));                 // &nbsp;記号の説明  ○＝所定休日、◎＝法定休日、△＝有休計画付与日
    this.showMessage('monsumSummary', teasp.message.getLabel('monthSummary_label'));         // 月次サマリー
};

/**
 * 月度・ステータス
 */
teasp.view.MonthlySummary.prototype.showHead = function(){
    var ym = this.pouch.getYearMonth();
    var ymjp = teasp.util.date.formatMonth('zv00000021', Math.floor(ym / 100), (ym % 100), this.pouch.getSubNo()); // {0}年{1}月
    teasp.util.setWindowTitle(teasp.message.getLabel('tm10009010', ymjp, this.pouch.getName())); // 月次サマリー{0} {1}さん

    var status = this.pouch.getEmpMonthApplyStatus();
    if(!status
    || teasp.constant.STATUS_CANCELS.contains(status)
    || teasp.constant.STATUS_REJECTS.contains(status)){
        status = teasp.constant.STATUS_NOTADMIT;
    }

    dojo.byId('yearMonth').innerHTML        = ymjp;
    dojo.byId('monthlyStatus').innerHTML    = teasp.constant.getDisplayStatus(status);
    dojo.byId('department').innerHTML       = this.pouch.getDeptName();
    dojo.byId('empTypeName').innerHTML      = this.pouch.getEmpTypeName();
    dojo.byId('empCode').innerHTML          = (this.pouch.getTargetEmpObj().code || '');
    dojo.byId('empName').innerHTML          = this.pouch.getName();

    dojo.byId('yearMonth2').innerHTML       = ymjp;
};

/**
 * 日次テーブルのボディ部
 */
teasp.view.MonthlySummary.prototype.showDayBody = function(){
    var tbody = dojo.byId('workTableBody');
    var dayList = this.pouch.getMonthDateList();
    for(var i = 0 ; i < dayList.length ; i++){
        var dayWrap = this.pouch.getEmpDay(dayList[i]);
        var d = teasp.util.date.parseDate(dayList[i]);

        var row = tbody.rows[i + 1];
        row.className = ((i%2) == 0 ? 'prtv_row_even' : 'prtv_row_odd');
        // 日付
        var cell = row.cells[0];
        if(i == 0 || d.getDate() == 1){
            cell.innerHTML = (d.getMonth() + 1) + '/' + d.getDate();
        }else{
            cell.innerHTML = d.getDate();
        }
        // 曜日
        row.cells[1].innerHTML = teasp.util.date.formatDate(d, 'JPW');
        // 日タイプ
        cell = row.cells[2];

        if(dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY || dayWrap.getDayType() == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
            cell.innerHTML = teasp.message.getLabel('tm10009100'); // ○
        }else if(dayWrap.getDayType() == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){
            cell.innerHTML = teasp.message.getLabel('tm10009110'); // ◎
        }else if(dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL && dayWrap.isPlannedHoliday()){
            cell.innerHTML = teasp.message.getLabel('tm10009120'); // △
        }
        dojo.create('div', { innerHTML: dayWrap.getDayEvent(), style: { fontSize:"0.9em", margin:"0px", padding:"0px" } }, row.cells[3]);
//        row.cells[3].innerHTML  = dayWrap.getDayEvent();
        if(this.pouch.isAlive(dayList[i])){
            if(this.pouch.isIndicateNoPushTime() && dayWrap.getStartTimeJudge() < 0){
                row.cells[5].style.textDecoration = 'underline';
            }
            if(this.pouch.isIndicateNoPushTime() && dayWrap.getEndTimeJudge() < 0){
                row.cells[6].style.textDecoration = 'underline';
            }
            var calcMode = this.pouch.getCalcMode();
            row.cells[4].innerHTML  = dayWrap.getEnterTime();                       // 入館
            row.cells[5].innerHTML  = dayWrap.getStartTime(false, null, calcMode);  // 出社時刻
            row.cells[6].innerHTML  = dayWrap.getEndTime(false, null, calcMode);    // 退社時刻
            row.cells[7].innerHTML  = dayWrap.getExitTime();                        // 退館
            row.cells[8].innerHTML  = dayWrap.getDivergenceJudge().summ || '';     // 乖離状況
            row.cells[9].innerHTML  = dayWrap.getRestTime(false, '', '', calcMode); // 休憩時間
            if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER && calcMode == teasp.constant.C_DISC){ // 労働時間制が管理監督者
                row.cells[10].innerHTML = dayWrap.getDaySubTimeByKey('minasiWorkWholeTime', false, '', '', calcMode); // 労働時間
            }else{
                row.cells[10].innerHTML = dayWrap.getDaySubTimeByKey((this.pouch.isMsDailyWorkTimeIsReal() ? 'workRealTime' : 'workWholeTime'), false, '', '', calcMode); // 労働時間
            }
            if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER){ // 労働時間制が管理監督者
                row.cells[11].innerHTML  = ''; // 残業時間
                row.cells[12].innerHTML  = ''; // 休日労働時間
            }else{
                if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX
                && this.pouch.getVariablePeriod() > 1){
                    row.cells[11].innerHTML  = '';
                }else{
                    row.cells[11].innerHTML  = dayWrap.getDaySubTimeByKey('workOverTime'   , false, '', ''); // 残業時間
                }
                row.cells[12].innerHTML  = dayWrap.getDaySubTimeByKey('workHolidayTime', false, '', ''); // 休日労働時間
            }
            row.cells[13].innerHTML = dayWrap.getDaySubTimeByKey('workNightTime'  , false, '', '', teasp.constant.C_REAL); // 深夜労働時間
        }
        // 備考
        if(this.pouch.isIndicateNoPushTime() && (s = dayWrap.getTimeCaution()).length > 0){
            s = '<span style="color:#3333CC;font-size:0.95em;">(' + s + ')</span> '
                + teasp.util.entitize(dayWrap.getDayNote(!this.pouch.isSeparateDailyNote()), '');   // 元の打刻時間＋備考
        }else{
            s = teasp.util.entitize(dayWrap.getDayNote(!this.pouch.isSeparateDailyNote()), '');
        }
        row.cells[14].innerHTML = s;
        row.cells[14].style.borderRight = 'none';
    }
    while(i < tbody.rows.length - 2){
        tbody.rows[i + 1].style.display = 'none';
        i++;
    }
};

/**
 * 日次テーブルのフッタ部
 */
teasp.view.MonthlySummary.prototype.showDayFoot = function(){
    if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX){
        this.styleDisplay('monthlyWeekWholeTimeRow' , true);
        this.styleDisplay('amountTime'              , true);
        this.styleDisplay('monthlyLegalMax'         , true);
        this.styleDisplay('monthlyWeekRealTimeRow'  , true);
        this.styleDisplay('monthlyRealTimeRow'      , false);
    }else{
        this.styleDisplay('monthlyWeekWholeTimeRow' , false);
        this.styleDisplay('amountTime'              , false);
        this.styleDisplay('monthlyLegalMax'         , false);
        this.styleDisplay('monthlyWeekRealTimeRow'  , false);
        this.styleDisplay('monthlyRealTimeRow'      , true);
    }

    var row = document.getElementById('workTableFootRow');
    var calcMode = this.pouch.getCalcMode(true);
    row.cells[1].innerHTML = this.pouch.getMonthSubTimeByKey('restTime', false, null, calcMode);         // 休憩時間合計
    if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER && calcMode == teasp.constant.C_DISC){ // 労働時間制が管理監督者
        row.cells[2].innerHTML = this.pouch.getMonthSubTimeByKey('minasiWorkWholeTime', false, '', '', calcMode);    // 労働時間合計
    }else{
        row.cells[2].innerHTML = this.pouch.getMonthSubTimeByKey(this.pouch.isMsDailyWorkTimeIsReal() ? 'workRealTime' : 'workWholeTime', false, null, calcMode);    // 労働時間合計
    }
    if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER){ // 労働時間制が管理監督者
        row.cells[3].innerHTML = '';     // 残業時間合計
        row.cells[4].innerHTML = '';  // 休日労働時間合計
    }else{
        if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX
        && this.pouch.getVariablePeriod() > 1){
            row.cells[3].innerHTML = '';
        }else{
            row.cells[3].innerHTML = this.pouch.getMonthSubTimeByKey('workOverTime');     // 残業時間合計
        }
        row.cells[4].innerHTML = this.pouch.getMonthSubTimeByKey('workHolidayTime');  // 休日労働時間合計
    }
    row.cells[5].innerHTML = this.pouch.getMonthSubTimeByKey('workNightTime', false, null, teasp.constant.C_REAL);  // 深夜労働時間合計

    dojo.query('.total_table').forEach(function(elem){
        var cnt = 0;
        for(var i = 0 ; i < elem.rows.length ; i++){
            var row = elem.rows[i];
            if(row.style.display != 'none'){
                dojo.toggleClass(row, 'even', (cnt%2)===0);
                dojo.toggleClass(row, 'odd' , (cnt%2)!==0);
                cnt++;
            }
        }
    });
};

/**
 * サマリー項目名セット
 */
teasp.view.MonthlySummary.prototype.showSummaryBottom = function(){
	var targetContents = this.helperSummary.getSummaryBottomContents();
	var area = dojo.byId('summaryBottom');
	var numberOfColumns = targetContents.numberOfColumns || 0;
	if(!numberOfColumns){
		dojo.style('summaryTitleRow'   , 'display', 'none');
		dojo.style('summaryTitleBorder', 'display', 'none');
		return;
	}
	// テーブル作成
	var tbody = dojo.create('tbody', null, dojo.create('table', { className:'colla_table', style:'width:100%;' }, area));
	var tr = dojo.create('tr', { style:'vertical-align:top;' }, tbody);
	// 指定列数分のセルを作成
	var tbodys = [];
	var cells = [];
	for(var i = 0 ; i < numberOfColumns ; i++){
		var td = dojo.create('td', { style:'width:' + (100 / numberOfColumns) + '%;' }, tr);
		dojo.style(td, 'paddingRight', (i < (numberOfColumns - 1) ? '8px' : '2px'));
		cells.push(td);
		tbodys.push(dojo.create('tbody', null, dojo.create('table', { className:'total_table' }, td)));
	}
	// 各列に項目を配置
	var cx = 1;
	while(cx <= numberOfColumns){
		var tbody = tbodys[cx - 1];
		var fields = targetContents['column' + cx] || [];
		var n = 0;
		var separated = false;
		for(var i = 0 ; i < fields.length ; i++){
			var field = fields[i];
			if(field.skip){
				continue;
			}
			// セパレータの場合はTABLEを分け、間にDIVを挟む
			if(field.separator){
				if(field.label){
					dojo.create('div', { style:'padding:1px 4px;text-align:left;', innerHTML:field.label }, cells[cx - 1]);
				}else{
					dojo.create('div', { style:'height:4px;' }, cells[cx - 1]);
				}
				n = 0;
				separated = true;
				continue;
			}
			if(!n && separated){
				tbody = tbodys[cx - 1] = dojo.create('tbody', null, dojo.create('table', { className:'total_table' }, cells[cx- 1]));
			}
			// 行作成して出力
			var tr = dojo.create('tr', { className:(((n++)%2)==0 ? 'even' : 'odd') }, tbody);
			if(field.labelOnly){
				dojo.create('div', { innerHTML: field.label || '&nbsp;' }, dojo.create('td', { className:'column', colSpan:'2' }, tr));
			}else{
				dojo.create('div', { innerHTML: field.label || '&nbsp;' }, dojo.create('td', { className:'column' }, tr));
				dojo.create('div', { innerHTML: teasp.util.dspVal(field.value, '&nbsp;') }, dojo.create('td', { className:'value'  }, tr));
			}
			if(field.lines && !field.noDetail){ // 休暇の明細
				var td = dojo.create('td', {
					colSpan:'2',
					className:'detail_area'
				}, dojo.create('tr', { className:(((n++)%2)==0 ? 'even' : 'odd') }, tbody));
				this.displayHolidayItems(td, field.lines);
			}
		}
		cx++;
	}
};

/**
 * 明細の内訳を出力
 *
 * @param {Array.<Object>} lines head,label,value 要素を持つオブジェクトの配列
 */
teasp.view.MonthlySummary.prototype.displayHolidayItems = function(area, lines){
	var tbody = dojo.create('tbody', null, dojo.create('table', { className:'holy_item_table', style:'border-collapse:collapse;' }, area));
    for(var i = 0 ; i < lines.length ; i++){
        var o = lines[i];
        var tr = dojo.create('tr', null, tbody);
        dojo.create('td', { className:'holy_item_col1', innerHTML: o.head  }, tr); // [内訳]
        dojo.create('td', { className:'holy_item_col2', innerHTML: o.label }, tr);
        dojo.create('td', { className:'holy_item_col3', innerHTML: o.value }, tr); // 日
    }
};

teasp.view.MonthlySummary.prototype.convertPdfWorkFields = function(_fields){
	var fields = _fields || [];
	var lst = [];
	for(var i = 0 ; i < fields.length ; i++){
		var field = fields[i];
		var o = {};
		if(field.skip){
			continue;
		}
		if(field.separator){
			o.separator = true;
			o.label = field.label || '';
		}else{
			o.label = field.label || '';
			o.value = teasp.util.dspVal(field.value, '');
			if(field.labelOnly){
				o.labelOnly = true;
			}
			if(field.hasOwnProperty('lines') && !field.noDetail){
				o.lines = field.lines;
			}
		}
		lst.push(o);
	}
	return lst;
};

teasp.view.MonthlySummary.prototype.getPdfWorkData = function(pouch, steps, stepShow){
    this.pouch = pouch;
    var pdfwork = {head:{},daysHead:{},days:[],daysFoot:{},bottomL:[],bottomC:[],bottomR:[],stepHead:{},steps:[]};

    var ym = this.pouch.getYearMonth();
    var sn = this.pouch.getSubNo();
    var status = this.pouch.getEmpMonthApplyStatus();
    if(!status
    || teasp.constant.STATUS_CANCELS.contains(status)
    || teasp.constant.STATUS_REJECTS.contains(status)){
        status = teasp.constant.STATUS_NOTADMIT;
    }

    //-----------------------------------------------------------------------------------------
    // ページヘッダ部
    pdfwork.head.titleLabel       = teasp.message.getLabel('workTable_label');          // '勤務表'
    pdfwork.head.statusLabel      = teasp.message.getLabel('status_label');             // 'ステータス'
    pdfwork.head.deptLabel        = teasp.message.getLabel('dept_label');               // '部署'
    pdfwork.head.empTypeLabel     = teasp.message.getLabel('empType_label');            // '勤務体系'
    pdfwork.head.empCodeLabel     = teasp.message.getLabel('tk10000068');               // '社員コード'
    pdfwork.head.empLabel         = teasp.message.getLabel('empName_label');            // '社員名'
    pdfwork.head.month            = teasp.util.date.formatMonth('zv00000021', Math.floor(ym / 100), (ym % 100), sn); // {0}年{1}月
    pdfwork.head.status           = teasp.constant.getDisplayStatus(status);            // ステータス
    pdfwork.head.deptName         = this.pouch.getDeptName();                           // 部署名
    pdfwork.head.empTypeName      = this.pouch.getEmpTypeName();                        // 勤務体系
    pdfwork.head.empCode          = (this.pouch.getTargetEmpObj().code || '');          // 社員コード
    pdfwork.head.empName          = this.pouch.getName();                               // 社員名

    //-----------------------------------------------------------------------------------------
    // 日次テーブルヘッダ部
    pdfwork.daysHead.date         = teasp.message.getLabel('date_head');                  // 日付
    pdfwork.daysHead.event        = teasp.message.getLabel(this.pouch.isUseWorkLocation() ? 'tw00000171' : 'tm10009190'); // イベント／<br/>勤務状況
    pdfwork.daysHead.st           = teasp.message.getLabel('startTime_head');             // 出社
    pdfwork.daysHead.et           = teasp.message.getLabel('endTime_head');               // 退社
    pdfwork.daysHead.rest         = teasp.message.getLabel('rest_head');                  // 休憩
    pdfwork.daysHead.work         = teasp.message.getLabel(this.pouch.isMsDailyWorkTimeIsReal() ? 'tm10009201' : 'tm10009200'); // 労働<br/>時間
    pdfwork.daysHead.over         = teasp.message.getLabel('overTime_head');              // 残業
    pdfwork.daysHead.holiday      = teasp.message.getLabel('holidayWorkTime_head');       // 休日
    pdfwork.daysHead.night        = teasp.message.getLabel('nightWorkTime_head');         // 深夜
    pdfwork.daysHead.note         = teasp.message.getLabel('note_head');                  // 備考

    pdfwork.explain               = teasp.message.getLabel('tm10009090');                 // &nbsp;記号の説明  ○＝所定休日、◎＝法定休日、△＝有休計画付与日
    pdfwork.summaryTitle          = teasp.message.getLabel('monthSummary_label');         // 月次サマリー

    //-----------------------------------------------------------------------------------------
    // 日次テーブル
    var dayList = this.pouch.getMonthDateList();
    for(var i = 0 ; i < dayList.length ; i++){
        var dayWrap = this.pouch.getEmpDay(dayList[i]);
        var d = teasp.util.date.parseDate(dayList[i]);
        var dobj = {};
        dobj.date = '' + ((i == 0 || d.getDate() == 1) ? (d.getMonth() + 1) + '/' + d.getDate() : d.getDate()); // 日付
        dobj.week = teasp.util.date.formatDate(d, 'JPW'); // 曜日
        if(dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY || dayWrap.getDayType() == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
            dobj.mark = teasp.message.getLabel('tm10009100'); // ○
        }else if(dayWrap.getDayType() == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){
            dobj.mark = teasp.message.getLabel('tm10009110'); // ◎
        }else if(dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL && dayWrap.isPlannedHoliday()){
            dobj.mark = teasp.message.getLabel('tm10009120'); // △
        }
        dobj.event = dayWrap.getDayEvent();
        if(this.pouch.isAlive(dayList[i])){
            dobj.st_unsco = false;
            dobj.et_unsco = false;
            if(this.pouch.isIndicateNoPushTime() && dayWrap.getStartTimeJudge() < 0){
                dobj.st_unsco = true;
            }
            if(this.pouch.isIndicateNoPushTime() && dayWrap.getEndTimeJudge() < 0){
                dobj.et_unsco = true;
            }
            var calcMode = this.pouch.getCalcMode();
            dobj.st   = dayWrap.getStartTime(false, null, calcMode);         // 出社時刻
            dobj.et   = dayWrap.getEndTime(false, null, calcMode);           // 退社時刻
            dobj.rest = dayWrap.getRestTime(false, '', '', calcMode); // 休憩時間
            if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER && calcMode == teasp.constant.C_DISC){ // 労働時間制が管理監督者
                dobj.work = dayWrap.getDaySubTimeByKey('minasiWorkWholeTime', false, '', '', calcMode); // 労働時間
            }else{
                dobj.work = dayWrap.getDaySubTimeByKey((this.pouch.isMsDailyWorkTimeIsReal() ? 'workRealTime' : 'workWholeTime'), false, '', '', calcMode); // 労働時間
            }
            if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER){ // 労働時間制が管理監督者
                dobj.over    = ''; // 残業時間
                dobj.holiday = ''; // 休日労働時間
            }else{
                if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX
                && this.pouch.getVariablePeriod() > 1){
                    dobj.over = '';
                }else{
                    dobj.over = dayWrap.getDaySubTimeByKey('workOverTime'   , false, '', ''); // 残業時間
                }
                dobj.holiday = dayWrap.getDaySubTimeByKey('workHolidayTime', false, '', ''); // 休日労働時間
            }
            dobj.night = dayWrap.getDaySubTimeByKey('workNightTime'  , false, '', '', teasp.constant.C_REAL); // 深夜労働時間
        }
        // 備考
        if(this.pouch.isIndicateNoPushTime() && (s = dayWrap.getTimeCaution()).length > 0){
            dobj.note = '(' + s + ') ' + dayWrap.getDayNote(!this.pouch.isSeparateDailyNote());   // 元の打刻時間＋備考
        }else{
            dobj.note = dayWrap.getDayNote(!this.pouch.isSeparateDailyNote());
        }
        pdfwork.days.push(dobj);
    }
    //-----------------------------------------------------------------------------------------
    // 日次テーブルフッタ部
    var calcMode = this.pouch.getCalcMode(true);
    pdfwork.daysFoot.title = teasp.message.getLabel('total_label'); // 合計
    pdfwork.daysFoot.rest = this.pouch.getMonthSubTimeByKey('restTime', false, null, calcMode);         // 休憩時間合計
    if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER && calcMode == teasp.constant.C_DISC){ // 労働時間制が管理監督者
        pdfwork.daysFoot.work = this.pouch.getMonthSubTimeByKey('minasiWorkWholeTime', false, '', '', calcMode);    // 労働時間合計
    }else{
        pdfwork.daysFoot.work = this.pouch.getMonthSubTimeByKey(this.pouch.isMsDailyWorkTimeIsReal() ? 'workRealTime' : 'workWholeTime', false, null, calcMode);    // 労働時間合計
    }
    if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER){ // 労働時間制が管理監督者
        pdfwork.daysFoot.over    = '';     // 残業時間合計
        pdfwork.daysFoot.holiday = '';  // 休日労働時間合計
    }else{
        if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX
        && this.pouch.getVariablePeriod() > 1){
            pdfwork.daysFoot.over = '';
        }else{
            pdfwork.daysFoot.over = this.pouch.getMonthSubTimeByKey('workOverTime');     // 残業時間合計
        }
        pdfwork.daysFoot.holiday = this.pouch.getMonthSubTimeByKey('workHolidayTime');  // 休日労働時間合計
    }
    pdfwork.daysFoot.night = this.pouch.getMonthSubTimeByKey('workNightTime', false, null, teasp.constant.C_REAL);  // 深夜労働時間合計

    var flex = (this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX); // フレックスタイム制

    //-----------------------------------------------------------------------------------------
    // 集計エリア
    this.helperSummary = new teasp.helper.Summary(this.pouch);
	var targetContents = this.helperSummary.getSummaryBottomContents();
    pdfwork.bottomL = this.convertPdfWorkFields(targetContents.column1);
    pdfwork.bottomC = this.convertPdfWorkFields(targetContents.column2);
    pdfwork.bottomR = this.convertPdfWorkFields(targetContents.column3);
    pdfwork.bottomLShow = (targetContents.numberOfColumns > 0);
    pdfwork.bottomCShow = (targetContents.numberOfColumns > 1);
    pdfwork.bottomRShow = (targetContents.numberOfColumns > 2);

    //-----------------------------------------------------------------------------------------
    // 承認履歴
    pdfwork.stepShow = stepShow || false; // 承認履歴を出力する場合 true
    pdfwork.stepTitle            = teasp.message.getLabel('approvalHistory_label');      // 承認履歴
    pdfwork.stepHead.date        = teasp.message.getLabel('tf10006980');                 // 対象日付
    pdfwork.stepHead.applyType   = teasp.message.getLabel('tf10006990');                 // 申請種類
    pdfwork.stepHead.number      = teasp.message.getLabel('number_head');                // #
    pdfwork.stepHead.createdDate = teasp.message.getLabel('dateTime_head');              // 日時
    pdfwork.stepHead.status      = teasp.message.getLabel('statusj_head');               // 状況
    pdfwork.stepHead.actor       = teasp.message.getLabel('actor_head');                 // 実行者
    pdfwork.stepHead.comment     = teasp.message.getLabel('comment_head');               // コメント

    var applys = this.convertSteps(steps, pouch);
    for(var i = 0 ; i < applys.length ; i++){
        var apply = applys[i];
        for(var j = 0 ; j < apply.steps.length ; j++){
            var step = apply.steps[j];
            var bobit = (j == 0 ? 1 : 0);
            if(j == (apply.steps.length - 1)){
                bobit |= 2;
            }
            pdfwork.steps.push({
                date        : (j == 0 ? apply.dispDate  : ''),
                applyType   : (j == 0 ? apply.applyType : ''),
                createdDate : step.createdDate,
                status      : step.stepStatus,
                actor       : step.actorName,
                comment     : step.comments,
                bobit       : bobit
            });
        }
    }
    if(!pdfwork.steps.length){
        pdfwork.steps.push({
            date        : '',
            applyType   : '',
            createdDate : '',
            status      : '',
            actor       : '',
            comment     : '',
            bobit       : 3
        });
    }

    return { summary: pdfwork };
};

teasp.view.MonthlySummary.prototype.getApplyMap = function(pouch){
    var amap = {};
    var applys = pouch.dataObj.applys || [];
    for(var i = 0 ; i < applys.length ; i++){
        var apply = applys[i];
        amap[apply.id] = apply;
    }
    return amap;
};

teasp.view.MonthlySummary.prototype.convertSteps = function(orgs, pouch){
    var amap = this.getApplyMap(pouch);
    var sd = pouch.dataObj.month.startDate;
    var ed = pouch.dataObj.month.endDate;
    var ym = pouch.dataObj.month.yearMonth;
    var map = {};
    for(var i = 0 ; i < orgs.length ; i++){
        var step = orgs[i];
        if(step.StepStatus && step.StepStatus.toLowerCase() == 'noresponse'){
            continue;
        }
        var apply = amap[step.ProcessInstance.TargetObjectId];
        if(!apply){
            continue;
        }
        var o = map[apply.id];
        if(!o){
            o = map[apply.id] = apply;
            apply.steps = [];
            var targetDate = this.getTargetDate(apply, sd, ed, ym);
            apply.sortDate  = targetDate.date;
            apply.dispDate  = targetDate.disp;
            apply.isTarget  = (targetDate.range && teasp.constant.STATUS_FIX.contains(apply.status)); // 対象月度内で申請済みである
        }
        apply.steps.push({
            actorName    : (step.OriginalActor && step.OriginalActor.Name) || (step.Actor && step.Actor.Name) || '',
            createdDate  : teasp.util.date.formatDateTime(step.CreatedDate),
            createdDateN : step.CreatedDate,
            stepStatus   : teasp.constant.getStepStatus(step.StepStatus),
            comments     : (step.Comments ? step.Comments : (step.Note__c || ''))
        });
    }
    var applys = [];
    for(var key in map){
        if(map.hasOwnProperty(key)){
            var apply = map[key];
            if(apply.isTarget){ // 対象月度内で申請済みである
                apply.steps = apply.steps.sort(function(a, b){
                    var s = teasp.constant.STATUS_REQUESTED;
                    if(a.createdDateN == b.createdDateN){
                        if(a.stepStatus == s){
                            return -1;
                        }else if(b.stepStatus == s){
                            return 1;
                        }
                    }
                    return a.createdDateN - b.createdDateN;
                });
                applys.push(apply);
            }
        }
    }
    var z = teasp.constant.APPLY_TYPE_MONTHLY;
    applys = applys.sort(function(a, b){
        if(a.applyType != b.applyType){
            if(a.applyType == z){
                return 1;
            }else if(b.applyType == z){
                return -1;
            }
        }
        if(a.sortDate == b.sortDate){
            return a.steps[0].createdDateN - b.steps[0].createdDateN;
        }
        return (a.sortDate < b.sortDate ? -1 : 1);
    });
    return applys;
};

teasp.view.MonthlySummary.prototype.getTargetDate = function(apply, msd, med, ym){
    var sd = apply.startDate;
    var ed = apply.endDate;
    var ex = apply.exchangeDate;
    if(apply.applyType == teasp.constant.APPLY_TYPE_MONTHLY){ // 勤務確定
        return {
            date  : med,
            disp  : teasp.message.getLabel('tm10010461', teasp.util.date.formatDate(msd, 'M/d'), teasp.util.date.formatDate(med, 'M/d')),
            range : (apply.yearMonth == ym)
        };
    }else if(apply.applyType == teasp.constant.APPLY_TYPE_MONTHLYOVERTIME){ // 月次残業申請
        return {
            date  : sd,
            disp  : teasp.message.getLabel('tm10010461', teasp.util.date.formatDate(sd, 'M/d'), teasp.util.date.formatDate(ed, 'M/d')),
            range : (msd <= sd && sd <= med)
        };
    }else if(apply.applyType == teasp.constant.APPLY_TYPE_EXCHANGE){ // 振替申請
        if(msd <= sd && sd <= med){
            return {
                date  : sd,
                disp  : teasp.util.date.formatDate(sd, 'M/d') + '->' + teasp.util.date.formatDate(ex, 'M/d'),
                range : true
            };
        }else{
            return {
                date  : ex,
                disp  : teasp.util.date.formatDate(ex, 'M/d') + '<-' + teasp.util.date.formatDate(sd, 'M/d'),
                range : (msd <= ex && ex <= med)
            };
        }
    }else if(sd != ed){
        return {
            date  : sd,
            disp  : teasp.message.getLabel('tm10010461', teasp.util.date.formatDate(sd, 'M/d'), teasp.util.date.formatDate(ed, 'M/d')),
            range : ((msd <= sd && sd <= med) || (msd <= ed && ed <= med))
        };
    }else{
        return {
            date  : sd,
            disp  : teasp.util.date.formatDate(sd, 'M/d'),
            range : (msd <= sd && sd <= med)
        };
    }
};
