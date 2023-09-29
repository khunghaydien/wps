teasp.provide('teasp.view.Daily');
/**
 * タイムレポート画面
 *
 * @constructor
 * @extends {teasp.view.Base}
 * @author DCI小島
 */
teasp.view.Daily = function(){
    /** @private */
    this.workRealTime = 0;
    /** @private */
    this.toolTips = [];
    /** @private */
    this.toolTipSeq = 0;
    /** @private */
    this.eventHandles = {};
    /** @private */
    this.dateList = null;
    /** @private */
    this.jobWorks = null;
    this.helperTxsLog = new teasp.helper.ScheduleTxsLog();
    this.helperSche = new teasp.helper.Schedule();
    /**
     * @const
     * @private
     */
    this.COMMENT_QUEST = null;
    /**
     * @const
     * @private
     */
    this.COMMENT_QUEST_COLOR = '#999999';
    this.graph = null;
};

teasp.view.Daily.prototype = new teasp.view.Base();

/**
 * 画面初期化
 *
 * @param {Function} onSuccess レスポンス正常受信時の処理
 * @param {Function} onFailure レスポンス異常受信時の処理
 * @this {teasp.view.Monthly}
 */
teasp.view.Daily.prototype.init = function(onSuccess, onFailure){
    this.COMMENT_QUEST = teasp.message.getLabel('tm20001050'); // 今日何をしましたか？

    this.readParams({ target: 'empDay' });

    if(!this.viewParams.date){

        this.viewParams.date = teasp.util.date.formatDate(teasp.util.date.getToday());
    }else{
        this.viewParams.date = teasp.util.date.formatDate(this.viewParams.date); // yyyyMMdd -> yyyy-MM-dd に変換
    }

    // サーバへリクエスト送信
    teasp.manager.request(
        'loadEmpDay',
        this.viewParams,
        this.pouch,
        { hideBusy : true },
        this,
        function(){
            if(this.pouch.isOldRevision()){
                teasp.locationHref(teasp.getPageUrl('convertView') + '?forwardURL=' + encodeURIComponent(teasp.getPageUrl('workTimeView')));
            }else if(!this.pouch.getEmpId()){
                teasp.locationHref(teasp.getPageUrl('empRegistView') + '?forwardURL=' + encodeURIComponent(teasp.getPageUrl('workTimeView')));
            }else{
                this.initDaily();
            }
            onSuccess();
        },
        function(event){
            onFailure(event);
        }
    );
};

/**
 * 初期化
 *
 */
teasp.view.Daily.prototype.initDaily = function(){
    //innerHTML label
    teasp.message.setLabelHtml('section_label'); //部門
    teasp.message.setLabelHtml('empName_label'); //社員名
    teasp.message.setLabelHtml('chatter_Info_1'); //コメントをChatterへ投稿するとともに<br/><span style="color:red;font-weight:bold;">退社打刻</span>をします。
    teasp.message.setLabelHtml('chatter_Info_2'); //コメントをChatterへ投稿するとともに<br/><span style="color:red;font-weight:bold;">定時退社打刻</span>をします。
    teasp.message.setLabelHtml('schedule_label','schedule_label'); //スケジュール
    teasp.message.setLabelHtml('empWork_label','empWork_label'); //工数実績
    teasp.message.setLabelHtml('importFromSchedule_Info'); //<span style="color:#333333;">スケジュールから取込</span><br/>スケジュール（行動）が登録されている場合、<br/>件名のどこかに<span style="font-weight:bold;">"[]"（半角の角括弧）</span>で<br/>囲まれた<span style="color:red;font-weight:bold;">ジョブコード</span>が入力されていれば、<br/>工数実績の入力値として取り込むことができます。
    teasp.message.setLabelHtml('workReport_label','workReport_label'); //作業報告
    teasp.message.setLabelHtml('atkWorlInfo_label','empTime_label'); //勤怠情報
    teasp.message.setLabelHtml('expAdjustment_label','empExp_caption'); //経費精算
    teasp.message.setLabelHtml('tr_type_head','expItem_head'); //費目
    teasp.message.setLabelHtml('tr_route_head','expRoute_head'); //経路等
    teasp.message.setLabelHtml('tr_cost_head','expCost_head'); //金額
    teasp.message.setLabelHtml('tr_detail_head','expNote_head'); //備考
    teasp.message.setLabelHtml('totalCost_foot_2','total_label'); //合計

    teasp.message.setLabelTitle('buttonDateSelect','calendar_btn_title'); // 日付選択
    teasp.message.setLabelTitle('clearComment'); // 入力欄クリア
    teasp.message.setLabelTitle('empWorkEdit'      , 'empWorkEdit_btn_title'); // 工数実績入力
    teasp.message.setLabelTitle('jumpToEmpJob'     , 'empWorkView_btn_title'); // 月次工数実績画面へ
    teasp.message.setLabelTitle('jumpToEmpWorkTime', 'empTimeView_btn_title'); // 勤務表へ
    teasp.message.setLabelTitle('empExpInsert'     , 'empExpNew_btn_title'); // 経費入力
    teasp.message.setLabelTitle('tr_btn_tomon'     , 'empExpView_btn_title'); // 経費精算画面へ

    // タイトル
    dojo.query('td.ts-top-title > div.main-title').forEach(function(elem){
        elem.innerHTML = teasp.message.getLabel('tk10000238'); // タイムレポート
    }, this);
    dojo.query('td.ts-top-title > div.sub-title').forEach(function(elem){
        elem.innerHTML = teasp.message.getLabel('tf10004560'); // タイムレポート(英語)
    }, this);

    dojo.byId('buttonPrevDate').firstChild.innerHTML = teasp.message.getLabel('tf10000320');        // <<前日
    dojo.byId('buttonCurrDate').firstChild.innerHTML = teasp.message.getLabel('nextDay_btn_title'); // 今日
    dojo.byId('buttonNextDate').firstChild.innerHTML = teasp.message.getLabel('tf10000330');        // 翌日>>

    dojo.byId('toggleWorkEnd').firstChild.innerHTML = teasp.message.getLabel('endTime_head'); // 退社
    dojo.byId('clearComment').firstChild.innerHTML  = teasp.message.getLabel('clearLabel');   // クリア

    dojo.query('#endAndDayFixLabel > span').forEach(function(el){
        el.innerHTML = teasp.message.getLabel('tk10004050');   // 日次確定する
    });

    if(teasp.permitPushTime){
        teasp.message.setLabelTitle('toggleWorkEnd'    , 'pushEnd_btn_title'); // 退社打刻
    }else{
        teasp.message.setLabelTitle('toggleWorkEnd'    , 'tk10005330'); // 利用しているネットワークからの打刻はできません
    }
	dojo.byId('buttonWorkEnd').value = teasp.message.getLabel('tw00000280'); // 退勤
	dojo.byId('buttonFixEnd' ).value = teasp.message.getLabel('tw00000300'); // 定時 退勤
	dojo.toggleClass('buttonFixEnd', 'pw_btn_english', teasp.isEnglish());

    dojo.byId('empTypeTitle').innerHTML  = teasp.message.getLabel('empType_label'); // 勤務体系

    dojo.connect(dojo.byId('empWorkEdit')    , 'onclick', this, this.openEmpWork   ); // 工数実績入力
    dojo.connect(dojo.byId('empWorkFromSche'), 'onclick', this, this.openEmpWorkImp); // スケジュールから取り込み
    dojo.connect(dojo.byId('buttonPrevDate') , 'onclick', this, this.changePrevDate); // 前日
    dojo.connect(dojo.byId('buttonCurrDate') , 'onclick', this, this.changeCurrDate); // 今日
    dojo.connect(dojo.byId('buttonNextDate') , 'onclick', this, this.changeNextDate); // 翌日

    var helpLinks = dojo.query('td.ts-top-button3 > a', dojo.byId('expTopView'));
    if(helpLinks.length > 0){
        helpLinks[0].href = this.pouch.getHelpLink();
    }
    dojo.query('.emp_work_note_area').forEach(function(elem){
        dojo.style(elem, 'display', (this.pouch.getWorkNoteOption() ? '' : 'none'));
    }, this);
    if(this.pouch.isTimeReportDedicatedToJob()){ // タイムレポートの勤怠情報と経費精算を非表示にする
        dojo.style('empWorkDiv', 'height', (this.pouch.getWorkNoteOption() ? '275px' : '392px'));
    }else{
        dojo.style('empWorkDiv', 'height', (this.pouch.getWorkNoteOption() ? '183px' : '300px'));
        if(dojo.byId('tsfFormArea')){
            dojo.style('tsfFormArea', 'display', '');
        }
        dojo.query('#timeAreaR > table > tbody > tr:nth-child(2)').forEach(function(el){
            dojo.style(el, 'display', '');
        });
    }

    var pDiv = dojo.query('#expTopView td.ts-top-photo > div')[0];
    var photoUrl = this.pouch.getSmallPhotoUrl();
    var photoDiv = null;
    if(photoUrl){
        photoDiv = dojo.create('img', {
            src       : photoUrl,
            className : 'smallPhoto'
        }, pDiv);
    }else{
        photoDiv = dojo.create('img', {
            className : 'pp_base pp_default_photo'
        }, pDiv);
    }
    if(!this.pouch.isTimeReportDedicatedToJob()){ // タイムレポートの勤怠情報と経費精算を非表示にしない
        dojo.connect(photoDiv, 'onclick', this, this.openEmpView);
        photoDiv.title  = teasp.message.getLabel('personal_link_title'); // 個人設定
        dojo.style(photoDiv, 'cursor', 'pointer');
    }

    // 日付選択リスト作成
    this.dateList = new dijit.form.Select({
        id: "dateList",
        maxHeight : 480,
        name: "selectdate",
        style: { fontSize:"12px", width:"108px" },
        className: 'dojo_date_list'
    },
    "dateListArea");
    dojo.connect(this.dateList, 'onChange', this, this.changedDateSelect);

    // スケジュールエリア作成
    this.createSfcalTable();

    dojo.style('endAndDayFixLabel', 'display', this.pouch.isUseDailyApply() ? '' : 'none');

    // 退社打刻エリアの勤務場所UI構築
    this.createWorkLocationArea();

    // タイムレポートデータをセット
    this.refreshDaily(true);

    dojo.connect(dojo.byId('clearComment') , 'onclick', this, this.clearComment);
    var comment = dojo.byId('endComment');
    comment.value = this.COMMENT_QUEST;
    dojo.style(comment, 'color', this.COMMENT_QUEST_COLOR);
    dojo.connect(comment, 'onfocus', this, function(e){
        if(comment.value == this.COMMENT_QUEST){
            comment.value = '';
        }
        dojo.style(comment, 'color', '#222222');
    });
    dojo.connect(comment, 'onblur', this, function(e){
        if(comment.value == ''){
            comment.value = this.COMMENT_QUEST;
            dojo.style(comment, 'color', this.COMMENT_QUEST_COLOR);
        }
    });
    // 参照モードの場合、モードを表示
    this.viewPlus();
    if(!this.pouch.isTimeReportDedicatedToJob()){ // タイムレポートの勤怠情報と経費精算を非表示にしない
        // 時計表示
        this.clock();
    }
};

/**
 * 個人設定を別ウィンドウで表示
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Daily.prototype.openEmpView = function(){
    var h = (screen.availHeight || 800);
    if(h > 800){
        h = 800;
    }
    var wh = window.open((teasp.getPageUrl('workEmpView') + '?empId=' + this.pouch.getEmpId() + '&mode=read'), 'empInfo', 'width=700,height=' + h + ',resizable=yes,scrollbars=yes');
    setTimeout(function(){ wh.resizeTo(710, h); }, 100);
};

/**
 * 休暇情報を別ウィンドウで表示
 *
 * @this {teasp.view.Monthly}
 */
teasp.view.Daily.prototype.openHolidayView = function(){
    var h = (screen.availHeight || 800);
    if(h > 800){
        h = 800;
    }
    var wh = window.open((teasp.getPageUrl('holidayView') + '?empId=' + this.pouch.getEmpId() + '&mode=read'), 'empInfo', 'width=800,height=' + h + ',resizable=yes,scrollbars=yes');
    setTimeout(function(){ wh.resizeTo(810, h); }, 100);
};

/**
 * スケジュールエリア作成
 *
 */
teasp.view.Daily.prototype.createSfcalTable = function(){
    var tbody = dojo.byId('timeGridBody');
    while(tbody.firstChild){
        dojo.destroy(tbody.firstChild);
    }
    for(var t = 0 ; t < 48 ; t++){
        var row = dojo.create('tr', { style: { height:"35px"} }, tbody);
//        if(dojo.isFF){
//            row.style.height = '35px';
//        }
        dojo.create('td', { className:'time' , innerHTML: t }, row);
        dojo.create('td', { className:'event' }, row);
    }

};

/**
 * タイムレポートデータをセット
 *
 */
teasp.view.Daily.prototype.refreshDaily = function(flag){
    this.showError(null);
    this.showCalendarError(null);

    var dkey    = this.pouch.getParamDate();
    var dayWrap = this.pouch.getEmpDay(dkey);
    var classifyJobWorks = this.pouch.getClassifyJobWorks(dkey);
    this.reflectTsfJobAssign(classifyJobWorks);
    this.jobWorks  = this.pouch.getJobWorks(classifyJobWorks);
    this.rangeYear = this.pouch.getDateRangeOfMonth(teasp.util.date.getToday(), 13, -12);

    dijit.byId('calendarSelect').setValue(dkey);

    for(var key in this.eventHandles){
        if(this.eventHandles.hasOwnProperty(key)){
            dojo.disconnect(this.eventHandles[key]);
            delete this.eventHandles[key];
        }
    }

    if(this.pouch.isAlive(dkey)){
        dojo.style('empWorkEdit'     , 'display', '');
        dojo.style('empWorkFromSche' , 'display', '');
        dojo.style('empWorkTime'     , 'display', '');
        dojo.style('empExpInsert'    , 'display', '');
        dojo.style('openEmpApply'    , 'display', '');

        dojo.byId('empWorkFromSche').disabled = this.pouch.isJobMonthReadOnly();
        dojo.toggleClass('empWorkFromSche', 'pb_btn_schejob'    , !this.pouch.isJobMonthReadOnly());
        dojo.toggleClass('empWorkFromSche', 'pb_btn_schejob_dis',  this.pouch.isJobMonthReadOnly());
        dojo.style('empWorkFromSche', 'cursor', this.pouch.isJobMonthReadOnly() ? 'default' : 'pointer');

        // 勤怠情報入力ダイアログ
        var inputable = true;
        var ititle = '';
        if(this.pouch.isProhibitInputTimeUntilApproved()){  // 承認されるまで時間入力を禁止
            var aex = dayWrap.isInputableEx();
            if(!aex.inputable){
                inputable = false;
                ititle = teasp.message.getLabel('tk10001152', aex.applyName); // {0} が未承認のため入力できません
            }
        }
        if(inputable){
            if(dayWrap.isInputable()){
                ititle = teasp.message.getLabel('empTimeEdit_btn_title'); // 勤怠情報入力
                this.eventHandles['empWorkTime'] = dojo.connect(dojo.byId('empWorkTime'), 'onclick', this, this.openInputTime);
            }else{
                inputable = false;
                if(dayWrap.getDayType() != 0
                && !dayWrap.getObj().workFlag
                && !dayWrap.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)){
                    ititle = teasp.message.getLabel('tm20001060', // {0}は{1}と設定されています。\n休日出勤の申請がないと勤怠情報を入力できません。\n休日出勤申請を行ってください。
                                teasp.util.date.formatDate(dkey, 'JP1'),
                                (dayWrap.isPlannedHoliday() ? teasp.message.getLabel('tm20001070') :teasp.message.getLabel('tm20001080')));
                }else{
                    var a = dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_HOLIDAY_ALL);
                    if(a){
                        ititle = (a.holiday && a.holiday.name) || '';
                    }else{
                        ititle = teasp.message.getLabel('empTimeEdit_btn_title'); // 勤怠情報入力
                    }
                }
            }
        }
        this.setWorkLocation(dayWrap, true);
        dojo.byId('empWorkTime').disable = (inputable ? false : true);
        dojo.byId('empWorkTime').title = ititle;
        dojo.toggleClass('empWorkTime', 'pb_btn_pen2'     , inputable);
        dojo.toggleClass('empWorkTime', 'pb_btn_pen2a_dis', !inputable);
        dojo.style('empWorkTime', 'cursor', (inputable ? 'pointer' : 'default'));

        if((teasp.util.date.compareDate(this.rangeYear.from, dkey) <= 0 && teasp.util.date.compareDate(this.rangeYear.to, dkey) >= 0)
        || this.pouch.isApplyLimitOff()){
            this.eventHandles['openEmpApply'] = dojo.connect(dojo.byId('openEmpApply'), 'onclick', this, this.openEmpApply(dkey)); // 勤怠関連申請
        }else{
            this.eventHandles['openEmpApply'] = dojo.connect(dojo.byId('openEmpApply'), 'onclick', this, function(){ teasp.tsAlert(teasp.message.getLabel('tm10001050'), this); }); // 申請を行うことができるのは現在月の前後１２ヶ月度以内です
        }
        dojo.byId('openEmpApply').title = teasp.message.getLabel('dayApply_caption'); // 勤怠関連申請
        // 交通費入力ダイアログ
        if(this.pouch.isReadOnly(teasp.constant.TARGET_EXP)){
            dojo.style('empExpInsert', 'display', 'none');
        }else{
            dojo.style('empExpInsert', 'display', '');
            this.eventHandles['empExpInsert'] = dojo.connect(dojo.byId('empExpInsert'), 'onclick', this, function(){ this.openDialogEmpExp(null); });
        }
    }else{
        dojo.style('empWorkEdit'     , 'display', 'none');
        dojo.style('empWorkFromSche' , 'display', 'none');
        dojo.style('empWorkTime'     , 'display', 'none');
        dojo.style('empExpInsert'    , 'display', 'none');
        dojo.style('openEmpApply'    , 'display', 'none');
        this.setWorkLocation(dayWrap, false);
    }

    // 日付選択リスト
    this.createDateList();

    dojo.byId('jumpToEmpWorkTime').href = (teasp.getPageUrl('workTimeView') + '?empId=' + this.pouch.getEmpId() + '&month=' + this.pouch.getYearMonth() + '&subNo=' + (this.pouch.getSubNo() || '') + '&mode=' + this.pouch.getMode());
    dojo.byId('jumpToEmpJob').href = (teasp.getPageUrl('empJobView') + '?empId=' + this.pouch.getEmpId() + '&month=' + this.pouch.getJobYearMonth() + '&subNo=' + (this.pouch.getJobSubNo() || '') + '&mode=' + this.pouch.getMode());
    dojo.byId('jumpToEmpExp').href = (teasp.getPageUrl('empExpView') + '?empId=' + this.pouch.getEmpId() + '&mode=' + this.pouch.getMode());

    dojo.byId('department').innerHTML  = this.pouch.getDeptName();
    dojo.byId('empTypeName').innerHTML = this.pouch.getEmpTypeName();
    dojo.byId('empName').innerHTML     = this.pouch.getName();
    dojo.byId('empWorkNote').value     = dayWrap.getWorkNote();

    var ruler = dojo.byId('ruler1');
    ruler.style.width = '170px';
    var ce = dayWrap.getCalendarEvent();
    var o = ce.getExtent(ruler);
    var h = (o.height > 46 ? 46 : o.height);
    dojo.byId('dispEvent').style.height = h + 'px';
    dojo.byId('dispEvent').innerHTML = ce;
    dojo.byId('dispEvent').title = ce;

    this.showDayFixButton(dayWrap); // 日次確定ボタン
    this.controlDayFix(dayWrap); // 日次確定ボタン、日次確定するの表示切り替え

    this.showCalendarService(); // スケジュールに使用カレンダーサービスを表示
    this.showCalendarStatus(); // 外部カレンダーサービスのエラー文言を表示

    this.setPushButton();    // 退社打刻ボタンの有効化／無効化
    if(this.pouch.isAlive(dkey)){
        this.showWorkBalance();  // 工数実績を表示
    }
    this.createExpTable();   // 経費データを表示
    this.createTimeGraph();  // 勤怠グラフを表示
    this.helperTxsLog.draw(this.pouch, 'timeGridView'); // 行動ログのマーカーを表示
    this.helperSche.draw(this.pouch, 'timeGridView'); // 行動ログのマーカーを表示

    if(flag){
        this.disposeInit(function(){
            teasp.manager.dialogClose('BusyWait');
        });
    }
};

/**
 * 画面初期表示直後に行う処理
 *
 * @param {Function} onFinish
 */
teasp.view.Daily.prototype.disposeInit = function(onFinish){
    var methods = [];
    var mIndex = 0;
    var reloadFlag = false;
    var disposeLoop = dojo.hitch(this, function(){
        if(mIndex >= methods.length){
            if(mIndex > 0){
                if(reloadFlag){
                    this.changeDate(this.pouch.getParamDate(), true);
                }else{
                    this.refreshDaily();
                    setTimeout(function(){
                        teasp.manager.dialogClose('BusyWait');
                    }, 500);
                }
            }
            onFinish(true);
        }else{
            if(mIndex == 0){
                teasp.manager.dialogOpen('BusyWait', null, null);
            }
            methods[mIndex++]();
        }
    });
    var spendReject = this.pouch.getDirtyApplys();
    reloadFlag = spendReject.reload;
    if(spendReject.directs.length > 0){  // 直行・直帰申請の却下or取消がある
        methods.push(dojo.hitch(this, function(){
            var lst = spendReject.directs;
            return dojo.hitch(this, function(){
                this.cleanupDirectApply(lst, function(){
                    setTimeout(dojo.hitch(this, disposeLoop), 100);
                }, function(event){
                    teasp.message.alertError(event);
                    onFinish(false);
                });
            });
        })());
    }
    if(spendReject.lst.length > 0){  // 有休消化する休暇申請の却下または勤務確定の却下がある
        methods.push(dojo.hitch(this, function(){
            var sr = spendReject;
            return dojo.hitch(this, function(){
                this.cleanupEmpReject(sr, function(){
                    setTimeout(dojo.hitch(this, disposeLoop), 100);
                }, function(event){
                    teasp.message.alertError(event);
                    onFinish(false);
                });
            });
        })());
    }
    var reviseApplys = this.pouch.getReviseTimeApplys();
    for(var i = 0 ; i < reviseApplys.length ; i++){
        methods.push(dojo.hitch(this, function(){
            var ra = reviseApplys[i];
            return dojo.hitch(this, function(){
                this.reviseApplyEnter(ra, function(){
                    setTimeout(dojo.hitch(this, disposeLoop), 100);
                }, function(event){
                    teasp.message.alertError(event);
                    onFinish(false);
                });
            });
        })());
    }
    disposeLoop();
};

/**
 * 有休消化する休暇申請の却下または勤務確定の却下のクリーンアップ実行
 *
 * @param {Object} spendReject
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
teasp.view.Daily.prototype.cleanupEmpReject = function(spendReject, onSuccess, onFailure){
    teasp.manager.request(
        'cleanupEmpReject',
        {
            empId     : this.pouch.getEmpId(),
            month     : spendReject.month,
            currMonth : this.pouch.getYearMonth(),
            currSubNo : this.pouch.getSubNo(),
            accLog    : this.pouch.isInputAccessControl()
        },
        this.pouch,
        { hideBusy : true },
        this,
        onSuccess,
        onFailure
    );
};

/**
 * 直行･直帰申請の却下または取消のクリーンアップ
 *
 * @param {Array.<Object>} applyList
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
teasp.view.Daily.prototype.cleanupDirectApply = function(applyList, onSuccess, onFailure){
    var lst = [];
    var dm = {};
    for(var i = 0 ; i < applyList.length ; i++){
        var a = applyList[i];
        if(!a.directFlag || a.entered){ // a.entered==true は、クリーンアップ済み
            continue;
        }
        var dlst = teasp.util.date.getDateList(a.startDate, a.endDate);
        var directFlag = a.directFlag;
        for(var j = 0 ; j < dlst.length ; j++){
            var dkey = dlst[j];
            var dw = this.pouch.getEmpDay(dkey);
            if(!dw.isValid()){
                continue;
            }
            var orgSt = dw.getStartTime(true, null, teasp.constant.C_REAL); // 入力済みの出社時刻
            var orgEt = dw.getEndTime(true, null, teasp.constant.C_REAL);   // 入力済みの退社時刻
            if(orgSt === ''){ orgSt = null; }
            if(orgEt === ''){ orgEt = null; }
            var newSt = ((directFlag & 1) ? null : orgSt);
            var newEt = ((directFlag & 2) ? null : orgEt);
            if(orgSt != newSt || orgEt != newEt){
                var tt = dw.createTimeTable(newSt, newEt);
                lst.push({
                    date       : dkey,
                    timeTable  : tt,
                    empApplyId : a.id, // Entered__cをオンにするためにこれをセットする
                    clearWorkLocation: (a.applyType == teasp.constant.APPLY_TYPE_KYUSHTU && dw.getWorkLocationId() && !newSt && !newEt ? true : false) // 出退社クリアなら勤務場所クリア
                });
                dm[dkey] = 1;
            }
        }
    }
    for(i = 0 ; i < applyList.length ; i++){
        var a = applyList[i];
        if(a.directFlag || dm[a.startDate]){
            continue;
        }
        var dw = this.pouch.getEmpDay(a.startDate);
        if(!dw.isValid()){
            continue;
        }
        var orgSt = dw.getStartTime(true, null, teasp.constant.C_REAL); // 入力済みの出社時刻
        var orgEt = dw.getEndTime(true, null, teasp.constant.C_REAL);   // 入力済みの退社時刻
        if(orgSt === ''){ orgSt = null; }
        if(orgEt === ''){ orgEt = null; }
        var directFlag = dw.getInputLimit().flag;
        var tt = dw.createTimeTableFix(directFlag);
        var newSt = null, newEt = null;
        for(var j = 0 ; j < tt.length ; j++){
            if(tt[j].type == 1){
                newSt = tt[j].from;
                newEt = tt[j].to;
                break;
            }
        }
        if(orgSt != newSt || orgEt != newEt){
            lst.push({
                date       : a.startDate,
                timeTable  : tt,
				clearWorkLocation: (a.applyType == teasp.constant.APPLY_TYPE_KYUSHTU && dw.getWorkLocationId() && !newSt && !newEt ? true : false) // 出退社クリアなら勤務場所クリア
            });
            dm[a.startDate] = 1;
        }
    }
    if(lst.length <= 0){
        onSuccess.apply(this);
        return;
    }
    var index = 0;
    var f = null;
    f = dojo.hitch(this, function(){
        var req = {
            empId             : this.pouch.getEmpId(),
            month             : this.pouch.getYearMonth(),
            lastModifiedDate  : this.pouch.getLastModifiedDate(),
            mode              : this.pouch.getMode(),
            date              : lst[index].date,
            dayFix            : false,
            client            : teasp.constant.APPLY_CLIENT_MONTHLY,
            timeTable         : lst[index].timeTable,
            refreshWork       : true,
            clearWork         : false,
            empApplyId        : lst[index].empApplyId || null,
            useInputAccessControl : this.pouch.isInputAccessControl()
        };
		if(lst[index].clearWorkLocation){ // 勤務場所クリア
			req.workLocationId = null;
		}
        teasp.manager.request(
            'inputTimeTable',
            req,
            this.pouch,
            { hideBusy : true },
            this,
            function(){
                index++;
                if(index < lst.length){
                    setTimeout(f, 100);
                }else{
                    onSuccess.apply(this);
                }
            },
            onFailure
        );
    });
    f();
};

/**
 * 勤怠時刻修正申請の承認済みかつ未反映のものを反映させる処理
 *
 * @param {Object} reviseApply
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
teasp.view.Daily.prototype.reviseApplyEnter = function(reviseApply, onSuccess, onFailure){
    var empDay = this.pouch.getEmpDay(reviseApply.startDate);
    var tt = empDay.getReviseTimeTable(reviseApply);

    teasp.manager.request(
        'inputTimeTable',
        {
            empId            : this.pouch.getEmpId(),
            month            : this.pouch.getYearMonth(),
            lastModifiedDate : this.pouch.getLastModifiedDate(),
            mode             : this.pouch.getMode(),
            date             : reviseApply.startDate,
            dayFix           : false,
            client           : teasp.constant.APPLY_CLIENT_MONTHLY,
            timeTable        : tt,
            empApplyId       : reviseApply.id,
            refreshWork      : this.pouch.isInputWorkingTimeOnWorkTImeView(),
            useInputAccessControl : this.pouch.isInputAccessControl()
        },
        this.pouch,
        { hideBusy : true },
        this,
        onSuccess,
        onFailure
    );
};

/**
 * 日付選択リスト作成
 *
 */
teasp.view.Daily.prototype.createDateList = function(){
    var dates = [];
    var dlst = this.pouch.getMonthDateList();
    for(var i = 0 ; i < dlst.length ; i++){
        var clr;
        var dayWrap = this.pouch.getEmpDay(dlst[i]);
        if(dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY
        || dayWrap.getDayType() == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
            clr = teasp.constant.NORMAL_HOLIDAY_COLOR;
        }else if(dayWrap.getDayType() == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){
            clr = teasp.constant.LEGAL_HOLIDAY_COLOR;
        }else{
            clr = (dayWrap.isPlannedHoliday() ? teasp.constant.PRIVATE_HOLIDAY_COLOR : '#FFFFFF');
        }
        dates.push({
            value : dlst[i],
            name : '<span style="background-color:' + clr + ';">&nbsp;' + teasp.util.date.formatDate(dlst[i], 'JP2') + '&nbsp;</span>'
        });
    }
    var storeDt = new dojo.data.ItemFileWriteStore({
        data:{
            identifier: 'value',
            label     : 'name',
            items     : dates
        }
    });
    this.dateList.setStore(storeDt, this.pouch.getParamDate(), {sort:[{attribute:'value',descending:false}]});
};

/**
 * スケジュールに使用カレンダーサービスを表示
 *
 */
teasp.view.Daily.prototype.showCalendarService = function(){
    var accessService = this.pouch.getCalAccessService();

    var accessServiceMsgId = '';
    switch(accessService){
        case 'GSUITE':
            accessServiceMsgId = 'ca10002020';
            break;
        case 'OFFICE365':
            accessServiceMsgId = 'ca10002030';
            break;
        default:
            accessServiceMsgId = 'ca10002010';
    }

    var serviceName = teasp.message.getLabel(accessServiceMsgId);
    var calendarTitle = teasp.message.getLabel('schedule_label') + ' ' + serviceName;

    dojo.byId('schedule_label').innerHTML = calendarTitle;
};

/**
 * 外部カレンダーサービスのエラー文言を表示
 *
 */
teasp.view.Daily.prototype.showCalendarStatus = function(){
    var authResult = this.pouch.getCalAuthResult();

    var calendarErrorMsg = '';
    switch(authResult.status){
        case 'NO_AUTH_SETTING':
            calendarErrorMsg = teasp.message.getLabel('ca10002101');
            break;
        case 'FIELD_SETTING_INVALID':
            calendarErrorMsg = teasp.message.getLabel('ca10002102');
            break;
        case 'EMAIL_ADDRESS_EMPTY':
            calendarErrorMsg = teasp.message.getLabel('ca10002103');
            break;
        case 'REMOTE_SITE_SETTINGS_INACTIVE':
            calendarErrorMsg = teasp.message.getLabel('ca10002104');
            break;
        case 'API_CONNECTION_FAILED': // エラー詳細を表示する
            calendarErrorMsg = teasp.message.getLabel('ca10002105', (authResult.statusDetail || ''));
            break;
        case 'ACCOUNT_NOT_FOUND':
            calendarErrorMsg = teasp.message.getLabel('ca10002106');
            break;
        case 'UNAUTHORIZED':
            calendarErrorMsg = teasp.message.getLabel('ca10002107');
            break;
    }

    if(calendarErrorMsg){
        var calendarErrorMsg = 'Error: ' + calendarErrorMsg;
        this.showCalendarError(calendarErrorMsg);
    }
};

teasp.view.Daily.prototype.getTimeInfo = function(){
    var now         = teasp.util.date.getToday();       // 現在時刻
    var nowKey      = teasp.util.date.formatDate(now);
    var date        = this.pouch.getParamDate();

    if(nowKey != date && teasp.util.date.addDays(nowKey, -1) != date){ // 対象のタイムレポート画面は今日でも昨日でもない
        return null;
    }

    var todayKey    = nowKey;
    var yestaKey    = teasp.util.date.addDays(todayKey, -1);
    var todayWrap   = this.pouch.getEmpDay(todayKey);
    var yestaWrap   = this.pouch.getEmpDay(yestaKey);
    var todayObj    = todayWrap.getObj();
    var yestaObj    = yestaWrap.getObj();

    var t   = now.getHours() * 60 + now.getMinutes();   // 現在時刻を分単位の数字に変換

    var st      = (todayObj && typeof(todayObj.startTime)         == 'number') ? todayObj.startTime         : -1; // 当日の出社時刻
    var et      = (todayObj && typeof(todayObj.endTime)           == 'number') ? todayObj.endTime           : -1; // 当日の退社時刻
    var bst     = (yestaObj && typeof(yestaObj.startTime)         == 'number') ? yestaObj.startTime         : -1; // 前日の出社時刻
    var bet     = (yestaObj && typeof(yestaObj.endTime)           == 'number') ? yestaObj.endTime           : -1; // 前日の退社時刻

    var todaySt = (todayObj && typeof(todayObj.rack.fixStartTime) == 'number') ? todayObj.rack.fixStartTime : -1; // 当日の始業時刻
    var todayEt = (todayObj && typeof(todayObj.rack.fixEndTime)   == 'number') ? todayObj.rack.fixEndTime   : -1; // 当日の終業時刻
    var yestaSt = (todayObj && typeof(yestaObj.rack.fixStartTime) == 'number') ? yestaObj.rack.fixStartTime : -1; // 前日の始業時刻
    var yestaEt = (yestaObj && typeof(yestaObj.rack.fixEndTime)   == 'number') ? yestaObj.rack.fixEndTime   : -1; // 前日の終業時刻

    if(et === 0){
        st = -1;
        et = -1;
    }
    if(bet === 0){
        bst = -1;
        bet = -1;
    }

    var todayMonth  = this.pouch.getEmpMonthByDate(todayKey);                                    // 当日の月度
    var yestaMonth  = this.pouch.getEmpMonthByDate(yestaKey);                                    // 前日の月度
    var todayFixed  = (this.pouch.isEmpMonthFixed(todayMonth, true) || todayWrap.isDailyFix());  // 当日が月次確定済みまたは日次確定済みか
    var yestaFixed  = (this.pouch.isEmpMonthFixed(yestaMonth, true) || yestaWrap.isDailyFix());  // 前日が月次確定済みまたは日次確定済みか
    var ua          = this.pouch.isProhibitInputTimeUntilApproved();
    var tdw         = (teasp.view.Widget.isWorkDay(todayObj, ua) && todayObj && !todayFixed);    // 当日は出勤日かつ確定済みでない ＝ 打刻できる日
    var ydw         = (teasp.view.Widget.isWorkDay(yestaObj, ua) && yestaObj && !yestaFixed);    // 前日は出勤日かつ確定済みでない ＝ 打刻できる日

    if(tdw && !this.pouch.isAlive(todayKey)){
        tdw = false;
    }
    if(ydw && !this.pouch.isAlive(yestaKey)){
        ydw = false;
    }

    var pstFlag              = this.pouch.isPermitStartBtnDateChange();                  // 退社時刻未入力でも日付が変われば出社打刻可
    var directFlag           = todayWrap.getInputLimit().flag;                           // 直行・直帰
    var restartable          = (this.pouch.isUseRestartable() && !(directFlag & 2));     // 再出社ボタンは設定がオンかつ直帰申請がないときだけ有効
    var leavingAcrossNextDay = this.pouch.isLeavingAcrossNextDay();                      // 2暦日で勤務日種別が異なる24:00以降の入力不可
    var limitedTimeDistance  = this.pouch.getLimitedTimeDistance();                      // 出社時刻から退社時刻の制限

    var diffDayType = false;
    if(leavingAcrossNextDay
    && todayObj
    && yestaObj
    ){
        var ydt = (yestaObj.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY && (yestaObj.workFlag || yestaObj.autoLH) ? teasp.constant.DAY_TYPE_NORMAL : yestaObj.dayType);
        var tdt = (todayObj.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY && (todayObj.workFlag || todayObj.autoLH) ? teasp.constant.DAY_TYPE_NORMAL : todayObj.dayType);
        if(ydt == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
            ydt = teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
        }
        if(tdt == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
            tdt = teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
        }
        if(ydt != tdt){
            diffDayType = true; // 2暦日で勤務日種別が異なる
        }
    }

    return teasp.view.Widget.judgePushTime(
                  todayKey
                , yestaKey
                , tdw
                , ydw
                , t
                , bst
                , bet
                , st
                , et
                , todaySt
                , todayEt
                , yestaSt
                , yestaEt
                , this.pouch.isPermitLeavingPush24hours()
                , pstFlag
                , restartable
                , limitedTimeDistance
                , diffDayType
                );
};

/**
 * 退社打刻ボタンの有効化／無効化
 *
 */
teasp.view.Daily.prototype.setPushButton = function(){
    if(!this.pouch.isOwner() // 自分ではない社員
    || this.pouch.isTimeReportDedicatedToJob()){ // タイムレポートの勤怠情報と経費精算を非表示にしない
        return;
    }
    var date = this.pouch.getParamDate();
    var tinfo = this.getTimeInfo();
    var etFlag  = false;
    var tetFlag = false;
    if(tinfo && !this.pouch.isEmpMonthReadOnly()){
        if(date == tinfo.tkey){
            etFlag  = tinfo.etFlag;
            tetFlag = tinfo.tetFlag;
        }else if(date == tinfo.pkey){
            etFlag  = tinfo.petFlag;
            tetFlag = tinfo.ptetFlag;
        }
    }

    // 退社エリア開閉ボタン
    dojo.style("toggleWorkEnd", "display", "block");
    if(etFlag && teasp.permitPushTime){
        dojo.byId('toggleWorkEnd').className = 'std-button1 pp_btn_end';
        if(!this.eventHandles['toggleWorkEnd']){
            this.eventHandles['toggleWorkEnd'] = dojo.connect(dojo.byId('toggleWorkEnd'), 'onclick', this, this.toggleWorkEndArea);
        }
    }else{
        dojo.byId('toggleWorkEnd').className = 'std-button1-disabled pp_btn_end';
        if (this.eventHandles['toggleWorkEnd']) {
            dojo.disconnect(this.eventHandles['toggleWorkEnd']);
            this.eventHandles['toggleWorkEnd'] = null;
        }
    }
    // 退社打刻ボタン
    dojo.setAttr('buttonWorkEnd', 'disabled', !etFlag);
    if(etFlag){
        if(!this.eventHandles['buttonWorkEnd']){
            this.eventHandles['buttonWorkEnd'] = dojo.connect(dojo.byId('buttonWorkEnd'), 'onclick', this, this.clickEndCurrentTime);
        }
    }else{
        if(this.eventHandles['buttonWorkEnd']){
            dojo.disconnect(this.eventHandles['buttonWorkEnd']);
            this.eventHandles['buttonWorkEnd'] = null;
        }
    }
    // 定時退社打刻ボタン
    if(this.pouch.isUseFixedButton()){
        dojo.style('endFixedTimeRow', 'display', '');
        dojo.setAttr('buttonFixEnd', 'disabled', !tetFlag);
        if(tetFlag){
            if(!this.eventHandles['buttonFixEnd']){
                this.eventHandles['buttonFixEnd'] = dojo.connect(dojo.byId('buttonFixEnd'), 'onclick', this, this.clickEndFixedTime);
            }
        }else{
            if(this.eventHandles['buttonFixEnd']){
                dojo.disconnect(this.eventHandles['buttonFixEnd']);
                this.eventHandles['buttonFixEnd'] = null;
            }
        }
    }else{
        dojo.style('endFixedTimeRow', 'display', 'none');
    }
};

/**
 * 工数実績データを表示
 *
 * @param {number} wrt 実労働時間
 * @param {number} sumt 工数実績の合計時間
 */
teasp.view.Daily.prototype.createEmpWorkTable = function(wrt, sumt, worked){
    // 工数入力時間の合計が実労働時間と合致するようにボリューム入力の時間換算値を調整する
    this.pouch.adjustJobWorkTimes(this.jobWorks, wrt);

    // ヘッダ部
    var thead = dojo.query('#empWorkHead tbody')[0];
    dojo.empty(thead);
    var row = dojo.create('tr', null, thead);
    dojo.create('div', { style: { margin:"2px" }, innerHTML: '#' }, dojo.create('td', { className: 'sharp' }, row));
    dojo.create('div', { style: { margin:"2px" }, innerHTML: teasp.message.getLabel('task_head')  }, dojo.create('td', { className: 'name' + (this.pouch.getProgressList().length > 0 ? '' : 'w') }, row)); // タスク
    dojo.create('div', { style: { margin:"2px" }, innerHTML: teasp.message.getLabel('tm20001130') }, dojo.create('td', { className: 'time' }, row)); // 時間
    if(this.pouch.getProgressList().length > 0){
        dojo.create('div', { style: { margin:"2px" }, innerHTML: teasp.message.getLabel('tm20001140') }, dojo.create('td', { className: 'progress' }, row)); // 進捗
    }
    dojo.create('td', { className: 'spcr' + (this.pouch.getProgressList().length > 0 ? '' : 'w') }, row);

    // フッタ部
    var tfoot = dojo.query('#empWorkArea .emp_work_foot tbody')[0];
    dojo.empty(tfoot);
    var row = dojo.create('tr', null, tfoot);

    dojo.create('div', {
        innerHTML:teasp.message.getLabel('total_label'), // 合計
        style:"margin-right:12px;"
    }, dojo.create('td', { style:"text-align:right;width:50%;" }, row));

    dojo.create('div', null, dojo.create('div', {
        id:"empWorkSumTime",
        className:'time',
        style:"margin-left:12px;width:56px;text-align:center;"
    }, dojo.create('td', { style:"text-align:left;width:50%;" }, row)));

    for(var i = 0 ; i < this.toolTips.length ; i++){
        dijit.byId(this.toolTips[i]).destroy(true);
    }
    this.toolTips = [];

    var tbody = dojo.byId('empWorkTable').getElementsByTagName('tbody')[0];
    while(tbody.firstChild){
        dojo.destroy(tbody.firstChild);
    }
    var jwNo = 1;
    var prgOn = null;
    var complex = false;
    for(var r = 0 ; r < this.jobWorks.length ; r++){
        var jobWork = this.jobWorks[r];
        if(jobWork.time && jobWork.timeFix){
            complex = true;
            break;
        }
    }
    for(var r = 0 ; r < this.jobWorks.length ; r++){
        var jobWork = this.jobWorks[r];
        prgOn = (this.pouch.getProgressList().length > 0);
        row = dojo.create('tr', { id: 'work' + jobWork.jobId, className: ((r%2)==0 ? 'even' : 'odd') }, tbody);
        var extraItems = this.pouch.getExtraItems(jobWork);
        dojo.create('div', { className: 'sharp', innerHTML: jwNo++ }, dojo.create('td', { className: 'sharp', rowSpan: (extraItems.length > 0 ? 3 : 2) }, row));

        var jobNameText = jobWork.jobName + (jobWork.process ? teasp.message.getLabel('tm10001470') + jobWork.process : ''); // ／
        dojo.create('div', { className: 'name', innerHTML: jobNameText }, dojo.create('td', { className: 'name' + (prgOn ? '' : 'w'), id: 'workJob' + jobWork.jobId + jobWork.process }, row));
        var valObj = this.convTime(jobWork, worked, sumt, complex);
        dojo.create('div', { className:valObj.className, innerHTML:valObj.value }, dojo.create('td', { className: 'time' }, row));
        var cols = 3;
        if(prgOn){
            dojo.create('div', { className: 'progress', innerHTML: (jobWork.progress || '') }, dojo.create('td', { className: 'progress' }, row));
            cols++;
        }
        dojo.create('td', { className: 'spcr' + (prgOn ? '' : 'w') }, row);
        this.setJobToolTip(jobWork, 'workJob' + jobWork.jobId + jobWork.process);
        if(extraItems.length > 0){
            row = dojo.create('tr', { className: ((r%2)==0 ? 'even' : 'odd') }, tbody);
            var cell = dojo.create('td', { className: 'extraItem', colSpan: cols }, row);
            for(var i = 0 ; i < extraItems.length ; i++){
                var item = extraItems[i];
                if(!item){
                    continue;
                }
                dojo.create('div', {
                    className : 'extraItem',
                    style : { "float":"left" },
                    innerHTML : item.name + ' : '
                }, cell);
                var div = dojo.create('div', {
                    className : 'extraItem',
                    style : { "float":"left", "textAlign":"left" },
                    innerHTML : teasp.util.entitize(item.value, '&nbsp;')
                }, cell);
                if(i == 0 && extraItems[1]){
                    div.style.marginRight = '10px';
                }
            }
            dojo.create('div', { style: { clear:"both" } }, cell);
        }
        row = dojo.create('tr', { className: ((r%2)==0 ? 'even' : 'odd') }, tbody);
        dojo.create('div', { className: 'tasknote', innerHTML: this.pouch.convNoteString(teasp.util.entitize(jobWork.taskNote, '')) }, dojo.create('td', { className: 'tasknote', colSpan: cols }, row));
    }
    this.showStrip();
};

/**
 * 工数実績エリアいっぱいストライプ表示する
 *
 */
teasp.view.Daily.prototype.showStrip = function(){
    var tbody = dojo.query('#empWorkTable tbody')[0];
    var maxH = dojo.byId('empWorkDiv').clientHeight;
    var prgOn = (this.pouch.getProgressList().length > 0);
    var y = 0;
    var dels = [];
    dojo.query('tr', tbody).forEach(function(tr){
        if(dojo.hasClass(tr, 'empty')){
            dels.push(tr.rowIndex);
        }else{
            y += tr.offsetHeight;
        }
    });
    for(var i = (dels.length - 1) ; i >= 0 ; i--){
        tbody.removeChild(tbody.rows[dels[i]]);
    }
    var r = this.jobWorks.length;
    while(y < maxH){
        var h = Math.min(25, maxH - y);
        var row = dojo.create('tr', { className: ((r%2)==0 ? 'even' : 'odd') + ' empty', style:'height:' + h + 'px;' }, tbody);
        dojo.create('div', { innerHTML: '' }, dojo.create('td', { className: 'sharp' }, row));
        dojo.create('div', { innerHTML: '' }, dojo.create('td', { className: 'name' + (prgOn ? '' : 'w') }, row));
        dojo.create('div', { innerHTML: '' }, dojo.create('td', { className: 'time'  }, row));
        if(prgOn){
            dojo.create('div', { style: { margin:"1px 2px" }, innerHTML: '' }, dojo.create('td', { className: 'progress' }, row));
        }
        dojo.create('td', { className: 'spcr' + (prgOn ? '' : 'w') }, row);
        y += h;
        r++;
    }
};

/**
 * 工数実績データのタスク名にツールチップをセット
 *
 * @param {Object} jobWork 工数実績オブジェクト
 * @param {string} connectId ツールチップをセットするノードのID
 */
teasp.view.Daily.prototype.setJobToolTip = function(jobWork, connectId){
    var label = '<table class="pane_table" style="font-size:12px;">';
    label += '<tr><td style="padding-right:8px;">'+teasp.message.getLabel('tm20001020')+'</td><td>';
    label += (jobWork.jobCode || '');
    label += '</td></tr><tr><td style="padding-right:8px;">'+teasp.message.getLabel('tm20001030')+'</td><td>';
    label += jobWork.jobName;
    if((jobWork.process)?jobWork.process.length:0>0){
        label += '</td></tr><tr><td style="padding-right:8px;">'+teasp.message.getLabel('tm20001040')+'</td><td>';
        label += jobWork.process;
    }
    label += '</td></tr><tr><td style="padding-right:8px;">'+teasp.message.getLabel('tm20001031')+'</td><td>';
    label += (jobWork.jobLeader || '');
    label += '</td></tr></table>';
    new dijit.Tooltip({
        connectId : connectId,
        label     : label,
        position  : ['above'],
        id        : 'empWorkToolTip' + (++this.toolTipSeq)
    });
    this.toolTips.push('empWorkToolTip' + this.toolTipSeq);
};

/**
 * 工数実績データを表示
 *
 */
teasp.view.Daily.prototype.showWorkBalance = function(){
    // 実労働時間を得る
    var dayObj = dojo.clone(this.pouch.getDayObj(this.pouch.getParamDate()));
    this.workRealTime = 0;
    var worked = dayObj.rack.worked;
    if(worked){
        this.workRealTime = dayObj.real.workRealTime;
    }else if(typeof(dayObj.startTime) == 'number'){
        var dayWrap = this.pouch.getEmpDay(dayObj.date);
        this.workRealTime = dayWrap.getZanteiRealTime(teasp.util.date.getToday()) || 0;
        if(this.workRealTime > 0){
            worked = true;
        }
    }
    var sumt = 0;
    for(var i = 0 ; i < this.jobWorks.length ; i++){
        if(this.jobWorks[i].timeFix){
            sumt += this.jobWorks[i].time;
        }
    }
    this.createEmpWorkTable(this.workRealTime, sumt, worked);

    // this.createEmpWorkTable() の中で pouch.adjustJobWorkTimes() を呼んでいるので、jobWork.time には換算された時間が表示される
    var t = 0;
    for(var i = 0 ; i < this.jobWorks.length ; i++){
        var jobWork = this.jobWorks[i];
        t += jobWork.time;
    }
    dojo.query('#empWorkSumTime > div')[0].innerHTML = teasp.util.time.timeValue(t);
    this.showDiffMarker(dayObj, this.workRealTime, t);
};

teasp.view.Daily.prototype.showDiffMarker = function(dayObj, workRealTime, jobTime){
    if(this.pouch.isCheckInputWorkHours()){
        // 勤怠と工数が合わない場合、合計時間の背景色をピンクにする
        var diff = (workRealTime != jobTime);
        dojo.style('empWorkSumTime', 'background-color', (diff ? '#ffc0cb' : 'transparent'));
        dojo.byId('empWorkSumTime').title = (diff ? teasp.message.getLabel('tf10008580') : ''); // 実労働時間と作業時間の合計を合わせてください

    }
};

/**
 * 経費データを表示
 *
 */
teasp.view.Daily.prototype.createExpTable = function(){
    var table = dojo.byId('expTable');
    var tbody = table.getElementsByTagName('tbody')[0];
    while(tbody.firstChild){
        dojo.destroy(tbody.firstChild);
    }
    var expLogs = this.pouch.getExpLogs();
    var jobLink = {};
    var jobObjs = {};
    var tagKeys = [];
    var expUnits = {};
    for(var i = 0 ; i < expLogs.length ; i++){
        var expLog = expLogs[i];
        var tagKey = expLog.date + ':' + (expLog.expApplyId || '') + ':' + (expLog.jobId || '');
        var l = jobLink[tagKey];
        if(!l){
            l = jobLink[tagKey] = [];
        }
        l.push(expLog);
        if(!tagKeys.contains(tagKey)){
            tagKeys.push(tagKey);
        }
        if(!jobObjs.hasOwnProperty(tagKey)){
            jobObjs[tagKey] = (expLog.job ? { name: expLog.job.name, code: expLog.job.code } : '');
        }
        if(!expUnits.hasOwnProperty(tagKey)){
            expUnits[tagKey] = (expLog.expApply || {});
            if(expLog.expApply){
                expUnits[tagKey].iconClass = this.pouch.getExpStatusIconClass(expLog.expApply.status);
            }
        }
    }
    var cnt = 0;
    var totalCost = 0;
    for(i = 0 ; i < tagKeys.length ; i++){
        var tagKey = tagKeys[i];
        expLogs = jobLink[tagKey];
        var jobObj  = jobObjs[tagKey];
        var row = dojo.create('tr', { className: ((cnt%2)==0 ? 'even' : 'odd') }, tbody);
        var cell = dojo.create('td', {
            className : 'job',
            style     : { width:"759px", height:"22px" },
            colSpan   : '5'
        }, row); // タスク

        var btbl = dojo.create('table', { className: 'contents_area d_job_table' }, cell);
        var brow   = dojo.create('tr', null, btbl);
        var bcell  = dojo.create('td', { style: { width:"655px", paddingLeft:"4px", wordBreak:"break-all" } }, brow);
        dojo.create('span', { innerHTML: (jobObj ? (jobObj.code || '') : '') + '  ' + (jobObj ? (jobObj.name || '') : '') }, bcell);
        bcell  = dojo.create('td', { style: { width:"69px", paddingLeft:"4px" } }, brow);
        if(expUnits[tagKey].iconClass){
            var bbtn  = dojo.create('input', { type: 'button', className: 'pb_base ' + expUnits[tagKey].iconClass, id: 'empExpLotStatus' + tagKey, title: teasp.message.getLabel('tm20001150') }, bcell);
            this.eventHandles['empExpLotStatus' + tagKey] = dojo.connect(bbtn, 'onclick', this, this.clickedExpStatus(tagKey));
        }
        bcell  = dojo.create('td', { style: { width:"34px", paddingLeft:"4px" } }, brow);
        var bbtn  = dojo.create('input', { type: 'button', className: 'pb_base pb_btn_pen', id: 'empExpLotEdit' + tagKey, title:teasp.message.getLabel('tm20001160')}, bcell);
        this.eventHandles['empExpLotEdit' + tagKey] = dojo.connect(bbtn, 'onclick', this, this.clickedExpLot(tagKey));

        var receiptMode = this.getStatusSimply(expUnits[tagKey].iconClass);

        for(var j = 0 ; j < expLogs.length ; j++){
            var expLog = expLogs[j];
            row = dojo.create('tr', { className: ((cnt%2)==0 ? 'even' : 'odd') }, tbody);
            // #
            dojo.create('div', {
                innerHTML : expLog.no
            }, dojo.create('td', { className: 'sharp', style: { width:"25px", height:"22px" } }, row));
            // 費目
            dojo.create('div', {
                innerHTML : expLog.expItem.name,
                style     : { marginLeft:"4px" }
            }, dojo.create('td', { className: 'type', style: { width:"99px", height:"22px" } }, row));
            // 経路等
            var route = (expLog.transportType == 0 ? '' :
                teasp.message.getLabel((expLog.roundTrip ? 'tm20009040' : 'tm20009060'), (expLog.startName || ''), (expLog.endName || ''))); // {0}⇔{1} or {0}⇒{1}
//                (expLog.startName || '') + teasp.message.getLabel(expLog.roundTrip ? 'tm20009070' : 'tm20009080') + (expLog.endName || ''));
            cell = dojo.create('td', { className: 'route', style: { width:"279px", height:"22px" } }, row);
            btbl = dojo.create('table', { className: 'contents_area', style: { width:"272px", marginLeft:"4px", tableLayout:"fixed" } }, cell);
            brow = dojo.create('tr', null, btbl);

            var currencyText='';
            var taxText     ='';
            if(expLog.foreignFlag){
                var rate = teasp.util.currency.formatDecimal(expLog.currencyRate || 0
                        , teasp.constant.CU_DEC_POINT_MIN
                        , teasp.constant.CU_DEC_POINT_MAX);
                var amount = teasp.util.currency.formatDecimal(expLog.foreignAmount || 0
                        , 0
                        , teasp.constant.CU_DEC_POINT_MAX
                        , true);
                currencyText = teasp.message.getLabel('tm20001170'
                        , expLog.currencyName
                        ,rate.str
                        ,amount.str);// 通貨[{0}] 換算レート{1} 現地金額{2}
            }
            if(expLog.taxFlag){
                var handInTax = '';
                var taxType = '';
                if(!expLog.taxAuto){
                    handInTax = teasp.message.getLabel('tm20001200');//"(手入力)"
                }
                switch(expLog.taxType){
                case '1':
                    taxType=teasp.message.getLabel('tm20001210');//"内税"
                    break;
                case '2':
                    taxType=teasp.message.getLabel('tm20001220');//"外税"
                    break;
                case '0':
                    taxType=teasp.message.getLabel('tm20001230');//"無税"
                    break;
                }
                taxText = taxType + ' : ' + teasp.util.currency.formatMoney(expLog.tax, '&#165;#,##0') + handInTax;
            }
            var extraItem = '';

            if(expLog.useExtraItem1){
                extraItem+='<span style="white-space: nowrap;">'+expLog.expItem.extraItem1Name+':</span>';
                extraItem+=expLog.extraItem1+'<br />';
            }
            if(expLog.useExtraItem2){
                extraItem+='<span style="white-space: nowrap;">'+expLog.expItem.extraItem2Name+':</span>';
                extraItem+=expLog.extraItem2;
            }

            var infoTextArray = new Array();
            if(route.length > 0){
                infoTextArray.push(route);
            }
            if(currencyText.length>0){
                infoTextArray.push('<span style="font-size:90%;">' + currencyText + '</span>');
            }
            if(taxText.length>0){
                infoTextArray.push('<span style="font-size:90%;">' + taxText + '</span>');
            }
            if(extraItem.length>0){
                infoTextArray.push(extraItem);
            }

            for(var ii=0; ii<infoTextArray.length||ii==0; ii++){
                var infoHTML = '';
                if(infoTextArray.length>0){
                    infoHTML = infoTextArray[ii];
                }
                if(ii==0){
                    bcell  = dojo.create('td', { style: { width:"228px", wordWrap:"break-word" }, innerHTML: infoHTML }, brow);
                    bcell  = dojo.create('td', { style: { width:"44px", textAlign:"right" } }, brow);
                    if(expLog.icInfo){
                        dojo.create('div', { className: 'pp_base pp_ico_ic', style: { "float":(expLog.receipt ? 'left' : 'right') } }, bcell);
                    }else if(expLog.transportType == 1){ //駅探アイコン
                        var div  = dojo.create('div', { className: 'pp_base pp_ico_ekitan',title: teasp.message.getLabel('showEkitanRoute_title'), style: { "float":(expLog.receipt ? 'left' : 'right') } }, bcell);
                        this.eventHandles['empExpRoute' + i + '-' + j] = dojo.connect(div, 'onclick', this, this.clickedExpRoute(expLog.route));
                    }
                    //領収アイコン
                    if(expLog.receipt){
                        var div  = dojo.create('div', { className: (expLog.attachments?'pp_base pp_btn_receipt_i':'pp_base pp_btn_receipt'), style: { marginLeft:"2px", "float":"right", cursor:(receiptMode||expLog.attachments)?'pointer':'' }, title:(expLog.attachments?teasp.message.getLabel('attachedReceipt'):teasp.message.getLabel('nonReceipt'))}, bcell);
                        if(receiptMode){//編集モード
                                this.eventHandles['empExpReceipt' + i + '-' + j] = dojo.connect(div, 'onclick', this,  function(){
                                    var e = expLog;
                                    return function(){
                                        this.openEmpAttachReceipt(true,e);
                                      };
                                  }());
                        }else{//参照モード
                            if(expLog.attachments){
                            this.eventHandles['empExpReceipt' + i + '-' + j] = dojo.connect(div, 'onclick', this,  function(){
                                var e = expLog;
                                return function(){
                                    this.openEmpAttachReceipt(false,e);
                                  };
                              }());
                            }
                        }
                    }
                    continue;
                }

                //2順目　２段構えで必要な場合
                brow   = dojo.create('tr', null, btbl);
                dojo.create('td', {colspan:2, style: { width:"272px", wordWrap:"break-word" }, innerHTML: infoTextArray[ii]}, brow);
            }


            // 金額
            dojo.create('div', {
                innerHTML : teasp.util.currency.formatMoney(expLog.cost, '&#165;#,##0'),
                style     : { marginRight:"4px" }
            }, dojo.create('td', { className: 'cost', style: { width:"89px", height:"22px" } }, row));
            // 備考
            dojo.create('div', {
                innerHTML : (expLog.detail || ''),
                style     : { marginLeft:"4px", wordBreak:"break-all" }
            }, dojo.create('td', { className: 'detail', style: { width:"262px", height:"22px" } }, row));
            totalCost += expLog.cost;
            cnt++;
        }
    }
    while(tbody.offsetHeight < 150 && cnt < 6){
        row = dojo.create('tr', { className : (cnt%2)==0 ? 'even' : 'odd' }, tbody);
        dojo.create('td', { className : 'sharp' , style: { width:"25px",  height:"22px" } }, row); // #
        dojo.create('td', { className : 'type'  , style: { width:"99px",  height:"22px" } }, row); // 費目
        dojo.create('td', { className : 'route' , style: { width:"279px", height:"22px" } }, row); // 経路等
        dojo.create('td', { className : 'cost'  , style: { width:"89px",  height:"22px" } }, row); // 金額
        dojo.create('td', { className : 'detail', style: { width:"262px", height:"22px" } }, row); // 備考
        cnt++;
    }
    dojo.byId('expFootCost').innerHTML = teasp.util.currency.formatMoney(totalCost, '&#165;#,##0', true);

};

/**
 * 勤怠グラフを表示
 *
 */
teasp.view.Daily.prototype.createTimeGraph = function(){
    if(!this.graph){
        this.graph = new teasp.helper.Graph({
              areaWidth          : dojo.byId('empWorkGraph').offsetWidth
            , widthPerH          : 24
            , startY             : 24
            , sizeType           : 'middle'
            , edgeMark           : true
            , movable            : false
            , clickedApply       : this.openEmpApply
            , hideTimeGraphPopup : this.pouch.isHideTimeGraphPopup()
            , that               : this
//            , clickedEvent       : this.openEditTime()
        });
    }
    this.graph.clear();
    this.graph.draw(this.pouch, 'empWorkGraph', [this.pouch.getEmpDay(this.pouch.getParamDate()).getObj()]);
    this.setCurrentTimeBar();
};

/**
 * 退社打刻ボタンをクリック
 *
 */
teasp.view.Daily.prototype.toggleWorkEndArea = function(){
    var ca = dojo.byId('commentArea');
    var flag = (ca.clientHeight == 0);
    if(flag){
        var comment = dojo.byId('endComment');
        if(comment.value == this.COMMENT_QUEST){
            // 作業報告の内容をコメント欄に入れる
            var workNote = dojo.byId('empWorkNote').value.trim();
            if(workNote.length > 0){
                comment.value = (workNote.length > 990 ? workNote.substring(0, 990) : workNote);
                dojo.style(comment, 'color', '#222222');
            }
        }
    }
    this.openCommentArea(flag);
};

/**
 * 退社コメント入力エリアを開閉
 *
 * @param {boolean} flag true:開く false:閉じる
 */
teasp.view.Daily.prototype.openCommentArea = function(flag){
    this.showError(null);
    var h = (this.pouch.isUseWorkLocation() ? 98 : 90);
    dojo.animateProperty({
        node:"commentArea",
        properties: {
            height: (flag ? { end: h, start:0 } : { end: 0, start:h })
        },
        duration: 1000
    }).play();
};

/**
 * 退社コメント入力エリアをクリア
 *
 */
teasp.view.Daily.prototype.clearComment = function(){
    var comment = dojo.byId('endComment');
    comment.value = this.COMMENT_QUEST;
    dojo.style(comment, 'color', this.COMMENT_QUEST_COLOR);
};

/**
 * 前日ボタンクリック時の処理
 *
 * @return {boolean} false固定
 */
teasp.view.Daily.prototype.changePrevDate = function(){
    return this.changeDate(teasp.util.date.addDays(this.pouch.getParamDate(), -1));
};

/**
 * 今日ボタンクリック時の処理
 *
 * @return {boolean} false固定
 */
teasp.view.Daily.prototype.changeCurrDate = function(){

    return this.changeDate(teasp.util.date.getToday());
};

/**
 * 翌日ボタンクリック時の処理
 *
 * @return {boolean} false固定
 */
teasp.view.Daily.prototype.changeNextDate = function(){
    return this.changeDate(teasp.util.date.addDays(this.pouch.getParamDate(), 1));
};

/**
 * 日付選択リストによる日付変更
 *
 * @return {boolean} false固定
 */
teasp.view.Daily.prototype.changedDateSelect = function(){
    var s = this.dateList.getValue();
    if(s == this.pouch.getParamDate()){
        return false;
    }
    return this.changeDate(teasp.util.date.parseDate(s));
};

/**
 * カレンダーによる日付変更
 *
 */
teasp.view.Daily.prototype.changeByCalendar = function(){
    var s = this.dateList.getValue();
    teasp.manager.dialogOpen(
        'Calendar',
        {
            date : teasp.util.date.parseDate(s),
            isDisabledDateFunc: function(d) {
                return false;
            }
        },
        null,
        this,
        function(ro){
            this.changeDate(ro);
        }
    );
};

/**
 * 日付変更
 *
 * @param {Object|string} d
 * @param {boolean=} flag
 * @return {boolean} false固定
 */
teasp.view.Daily.prototype.changeDate = function(d, flag){
    var dkey = this.pouch.getParamDate();
    if(!flag && teasp.util.date.compareDate(d, dkey) == 0){
        return false;
    }
    dojo.style('commentArea', 'height', '0px');
    dojo.style('timeReportContents', 'margin-top', '0px');

    document.body.style.cursor = 'wait';

    teasp.manager.request(
        'transEmpDay',
        {
            empId  : this.pouch.getEmpId(),
            date   : teasp.util.date.formatDate(d)
        },
        this.pouch,
        { hideBusy : false },
        this,
        function(){
            this.refreshDaily(true);
            document.body.style.cursor = 'default';
        },
        function(event){
            document.body.style.cursor = 'default';
            teasp.message.alertError(event);
        }
    );
    return false;
};

/**
 * 勤怠時刻入力ダイアログオープン
 *
 */
teasp.view.Daily.prototype.openInputTime = function(){
    var req = { date: this.pouch.getParamDate(), client: teasp.constant.APPLY_CLIENT_DAILY };

    this.pouch.checkEmpMonthHook(dojo.hitch(this, function(succeed, event){
        if(!succeed){
            teasp.tsAlert(teasp.message.getErrorMessage(event), this);
            return;
        }
        teasp.manager.dialogOpen(
            'InputTime',
            req,
            this.pouch,
            this,
            this.refreshDaily
        );
    }));
};

/**
 * 休憩・公用外出入力ダイアログオープン
 *
 */
teasp.view.Daily.prototype.openEditTime = function(){
    var req = { date: this.pouch.getParamDate() };
    teasp.manager.dialogOpen(
        'EditTime',
        req,
        this.pouch,
        this,
        this.refreshDaily
    );
};


/**
 * 申請ダイアログを開く（クロージャ）
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @param {string=} applyId 申請ID
 * @return {Function}
 * @this {teasp.view.Daily}
 */
teasp.view.Daily.prototype.openEmpApply = function(dkey, applyId){
    var req = {
        date     : dkey,
        applyId  : (applyId || null),
        client   : teasp.constant.APPLY_CLIENT_DAILY
    };
    return dojo.hitch(this, function(e){
        e.preventDefault();
        e.stopPropagation();
        this.pouch.checkEmpMonthHook(dojo.hitch(this, function(succeed, event){
            if(!succeed){
                teasp.tsAlert(teasp.message.getErrorMessage(event), this);
                return;
            }
            var f = dojo.hitch(this, function(){
                teasp.manager.dialogOpen(
                    'EmpApply',
                    req,
                    this.pouch,
                    this,
                    this.refreshDaily
                );
            });
            var day = this.pouch.getEmpDay(dkey);
            if(!this.pouch.getObj().dayMap){ // 申請用の情報がない
                teasp.manager.request(
                    'loadEmpMonthDelay',
                    {
                        empId : this.pouch.getEmpId(),
                        date  : dkey
                    },
                    this.pouch,
                    { hideBusy : false },
                    this,
                    function(obj){
                        day.setEmpApplySteps(obj.steps, obj.items);
                        f();
                    },
                    function(event){
                        teasp.message.alertError(event);
                    }
                );
            }else{
                if(day.getEmpApplyList('ALL').length > 0){ // 申請がある
                    teasp.manager.request( // 承認履歴を取得
                        'getEmpDayApplySteps',
                        {
                            empId : this.pouch.getEmpId(),
                            date  : dkey
                        },
                        this.pouch,
                        { hideBusy : false },
                        this,
                        function(obj){
                            day.setEmpApplySteps(obj.steps, obj.items);
                            f();
                        },
                        function(event){
                            teasp.message.alertError(event);
                        }
                    );
                }else{
                    f();
                }
            }
        }));
    });
};

/**
 * スケジュール取込
 *
 */
teasp.view.Daily.prototype.openEmpWorkImp = function(){
	this.helperSche.import(dojo.hitch(this, this.openEmpWorkDialog), this.helperTxsLog);
};

/**
 * 工数実績入力ボタンクリック時の処理
 *
 */
teasp.view.Daily.prototype.openEmpWork = function(){
    this.openEmpWorkDialog(dojo.clone(this.pouch.getClassifyJobWorks(this.pouch.getParamDate())));
};

/**
 * 工数実績入力ダイアログを開く
 *
 * @param {Array.<Object>} classifyJobWorks
 */
teasp.view.Daily.prototype.openEmpWorkDialog = function(classifyJobWorks, scheduleImport){
    var date = this.pouch.getParamDate();
    var dayWrap = this.pouch.getEmpDay(date);
    var workRealTime = dayWrap.getDaySubTimeByKey('workRealTime', true, 0, 0, teasp.constant.C_REAL);
    var workNote = dayWrap.getWorkNote();
    var zanteiFlag = false;
    if(!workRealTime){
        var t = dayWrap.getZanteiRealTime(teasp.util.date.getToday());
        if(t){
            zanteiFlag = true;
            workRealTime = t;
        }
    }
    teasp.manager.dialogOpen(
        'WorkBalance',
        {
            date              : date,
            jobMonth          : this.pouch.getJobYearMonth(),
            classifyJobWorks  : dojo.clone(classifyJobWorks),
            workRealTime      : workRealTime,
            worked            : dayWrap.isWorked(),
            workNote          : workNote,
            zanteiFlag        : zanteiFlag,
            reflectWorkOption : this.reflectWorkOption,
            thisObject        : this,
            monthFix          : dayWrap.isMonthFix(),
            dayFix            : dayWrap.isDailyFix(),
            client            : teasp.constant.APPLY_CLIENT_DAILY,
            scheduleImport    : scheduleImport || false,
            reflectJobAssign  : dojo.hitch(this, this.reflectTsfJobAssign)
        },
        this.pouch,
        this,
        function(newClassifyJobWorks, workNote, flag){
            var classifyJobWorks = this.pouch.getClassifyJobWorks(date);
            this.reflectTsfJobAssign(classifyJobWorks);
            this.jobWorks = this.pouch.getJobWorks(classifyJobWorks);
            if(!flag){
                dojo.byId('empWorkNote').value = workNote;
            }
            this.showWorkBalance();
        }
    );
};

// 経費精算のジョブアサイン情報に追加ジョブをセット
teasp.view.Daily.prototype.reflectTsfJobAssign = function(classifyJobWorks){
	if(tsfManager && tsfManager.info && tsfManager.info.targetEmp){
		var lst = tsfManager.info.targetEmp.jobAssigns;
		if(!lst){
			lst = tsfManager.info.targetEmp.jobAssigns = [];
		}
		lst.splice(0, lst.length);
		var jobs = (classifyJobWorks.assignWorks || [])
			.concat(classifyJobWorks.recordWorks || [])
			.concat(classifyJobWorks.assignJobs || []);
		var jobIdMap = {};
		for(var i = 0 ; i < jobs.length ; i++){
			var job = jobs[i];
			if(!jobIdMap[job.jobId]){
				lst.push(new teasp.Tsf.Job({
					Id				: job.jobId,
					JobCode__c		: job.jobCode,
					Name			: job.jobName,
					IsAssigned__c	: job.isAssigned,
					JobAssignId 	: (job.jobAssign && job.jobAssign.id) || null,
					StartDate__c	: job.startDate,
					EndDate__c		: job.endDate,
					Active__c		: true
				}));
				jobIdMap[job.jobId] = 1;
			}
		}
	}
};

/**
 * 作業報告入力エリアのオンオフ
 *
 */
teasp.view.Daily.prototype.reflectWorkOption = function(){
    dojo.query('.emp_work_note_area').forEach(function(elem){
        dojo.style(elem, 'display', (this.pouch.getWorkNoteOption() ? '' : 'none'));
    }, this);
    if(this.pouch.isTimeReportDedicatedToJob()){ // タイムレポートの勤怠情報と経費精算を非表示にする
        dojo.style('empWorkDiv', 'height', (this.pouch.getWorkNoteOption() ? '275px' : '392px'));
    }else{
        var h = (this.pouch.getWorkNoteOption() ? 183 : 300) - (this.pouch.isUseWorkLocation() ? 27 : 0) ;
        dojo.style('empWorkDiv', 'height', h + 'px');
    }
    this.showStrip();
};

/**
 * 経費データの編集ボタンクリック時の処理
 *
 * @param {Array.<string>} _tagKey
 */
teasp.view.Daily.prototype.clickedExpLot = function(_tagKey){
    var tagKey = _tagKey;
    return function(){
        this.openDialogEmpExp(tagKey);
    };
};

/**
 * 経費データのステータスボタンクリック時の処理
 *
 * @param {string} _tagKey
 */
teasp.view.Daily.prototype.clickedExpStatus = function(_tagKey){
    var tagKey = _tagKey;
    return function(){
        var tagKeys = tagKey.split(':');
        teasp.locationHref(teasp.getPageUrl('empExpView') + '?empId=' + this.pouch.getEmpId() + '&expApplyId=' + tagKeys[1] + '&mode=' + this.pouch.getMode());
    };
};

/**
 * 経費データの経路情報ボタンクリック時の処理
 *
 * @param {Object} _route
 * @return {Function}
 */
teasp.view.Daily.prototype.clickedExpRoute = function(_route){
    var route = _route;
    return function(){
        if(route == ''){
            teasp.tsAlert(teasp.message.getLabel('tm20001260'), this);
            return;
        }
        teasp.manager.dialogOpen(
            'ExpRoute',
            {
                routeInfo : route
            },
            this.pouch,
            this,
            function(o){
            }
        );
    };
};

/**
 * 経費データの領収書ボタンクリック時の処理、領収書画像添付、別ウィンドウで表示
 *
 * @param {boolean} mode  true 添付モード false 参照モード
 * @param {Object} expLog 対象情報のexpLog情報
 * @author cmpArai
 */
teasp.view.Daily.prototype.openEmpAttachReceipt = function(mode,expLog){

    var id = expLog.id;
    var uriText = '';
        if(mode){
            uriText = (teasp.getPageUrl('expImageView') + '?expLogId='+id+'&mode=edit&openerObj=view');
        }else{
            uriText = (teasp.getPageUrl('expImageView') + '?expLogId='+id+'&mode=view&openerObj=view');
        }
    var h = (screen.availHeight || 800);
    if(h > 800){
        h = 800;
    }
   var wh = window.open(uriText, 'attachments', 'width=800,height=' + h + ',resizable=yes,scrollbars=yes');
   setTimeout(function(){ wh.resizeTo(810, h); }, 100);
};

/**
 * 経費入力ボタンクリック時の処理
 *
 * @param {Array.<string>} tagKey
 */
teasp.view.Daily.prototype.openDialogEmpExp = function(tagKey){
    var that = this;
    teasp.manager.completeCheck(function(){
        teasp.manager.dialogOpen(
            'EmpExp',
            {
                tagKey        : tagKey,
                date          : that.pouch.getParamDate(),
                openerClass   : 'Daily'
            },
            that.pouch,
            that,
            that.refreshDaily
        );
    });
};

/**
 * 退社ボタンクリック時の処理
 *
 */
teasp.view.Daily.prototype.clickEndCurrentTime = function(){
    this.pushTimeStep1(false);
};

/**
 * 定時退社ボタンクリック時の処理
 *
 */
teasp.view.Daily.prototype.clickEndFixedTime = function(){
    this.pushTimeStep1(true);
};
/**
 * 打刻していますダイアログ
 */
teasp.view.Daily.prototype.showBusyWait = function(){
    teasp.manager.dialogOpen(
        'BusyWait2',
        {
            message:teasp.message.getLabel('tm20001310'),
            nomove:true
        },
        this.pouch
    );
};

/**
 * 退社打刻Step1
 *
 * @param {boolean} flag false:退社打刻 true:定時退社打刻
 */
teasp.view.Daily.prototype.pushTimeStep1 = function(flag){
    var para = {
        flag        : flag,  // false:退社打刻 true:定時退社打刻
        prevFlag    : false, // 昨日の退社打刻
        et          : null,  // 退社時刻（PCの時刻を暫定でセット）
        stdStartTime: -1,    //
        stdEndTime  : -1,    //
        dayFix      : false, // true:日次確定
        comment     : dojo.byId('endComment').value.trim()
    };
    if(para.comment == this.COMMENT_QUEST){
    	para.comment = '';
    }
    if(para.comment.length > 990){
        this.showError(teasp.message.getLabel('tm20001270'));
        return;
    }
    var date = this.pouch.getParamDate();
    var tinfo = this.getTimeInfo();
    if(tinfo && !this.pouch.isEmpMonthReadOnly()){
        if(date == tinfo.tkey){
        	para.et = (para.flag ? tinfo.stdEndTime : tinfo.tTime);
            para.stdStartTime = tinfo.stdStartTime;
            para.stdEndTime   = tinfo.stdEndTime;
        }else if(date == tinfo.pkey){
        	para.et = (para.flag ? tinfo.pstdEndTime : tinfo.pTime);
            para.prevFlag = true;
            para.stdStartTime = tinfo.pstdStartTime;
            para.stdEndTime   = tinfo.pstdEndTime;
        }
    }
    if(para.et === null){
        return;
    }

    var dayWrap = this.pouch.getEmpDay(date);
    var st = dayWrap.getStartTime(true, null, teasp.constant.C_REAL);
    var inprng = dayWrap.getInputTimeRange();
    var confirmMsg = null;
    if(inprng && para.et > inprng.to){
        confirmMsg = teasp.message.getLabel('tm20001280');
        para.et = inprng.to;
    }
    if(para.et > 1440){ // 24時を超えている
//        if(this.pouch.isProhibitAcrossNextDayOfHolidayWork() // 休日出勤時には24:00を超えた勤務を許さない
//        && dayWrap.isHoliday()
//        && dayWrap.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)
//        ){
//            alert(teasp.message.getLabel('tf10008430')); // 休日出勤時には24:00以降の退社時刻を入力できません。
//            return;
//        }
        var nd = this.pouch.getEmpDay(teasp.util.date.addDays(date, 1));
        var h = nd.getProhibitOverNightWorkHoliday(); // 翌日に延長勤務禁止の休暇申請があるか
        if(h){
            teasp.tsAlert(teasp.message.getLabel('tf10008360', h.name), this); // {0}の前日は24:00を超える勤務はできません。
            return;
        }
    }
    para.dayFix = (this.pouch.isUseDailyApply() && st !== null && dojo.byId('endAndDayFix').checked);

	if(para.dayFix
	&& (this.pouch.isOverTimeRequireTime()
	||  this.pouch.isEarlyWorkRequireTime()
	||  this.pouch.isRequiredLateStartApply()
	||  this.pouch.isRequiredEarlyEndApply()
	)){
		var o = teasp.logic.EmpTime.getWorkAndRestTime(this.pouch.getObj(), date, st, para.et, dayWrap.getObj().timeTable);
		var errs = [];
		if(o.missingOverTimeApply){
			errs.push(teasp.message.getLabel('tf10008740', teasp.message.getLabel('tm10001293'))); // 残業申請してください
		}
		if(o.missingEarlyWorkApply){
			errs.push(teasp.message.getLabel('tf10008740', teasp.message.getLabel('tm10001294'))); // 早朝勤務申請してください
		}
		if(o.missingOverTimeApplyExist || o.missingEarlyWorkApplyExist){
			errs.push(teasp.message.getLabel('tf10008760')); // （申請なしで勤務した時間がないようにしてください）
		}
		if(o.missingLateStartApply){
			errs.push(teasp.message.getLabel('tf10008740', teasp.message.getLabel('applyLateStart_label'))); // 遅刻申請してください
		}
		if(o.missingEarlyEndApply){
			errs.push(teasp.message.getLabel('tf10008740', teasp.message.getLabel('applyEarlyEnd_label'))); // 早退申請してください
		}
		if(errs.length){
			errs.unshift(teasp.message.getLabel('tf10008750')); // 日次確定できません
			teasp.tsAlert(errs.join('\n'), this);
			return;
		}
    }

    this.showError(null);
    para.comment = (para.flag ? teasp.message.getLabel('tm20001290') : teasp.message.getLabel('tm20001300')) + para.comment;

    if(confirmMsg){
        teasp.tsConfirmA(confirmMsg, this, function(){
            this.showBusyWait();
            this.pushTimeStep2(para);
        });
    }else{
        this.showBusyWait();
        this.pushTimeStep2(para);
    }
};

/**
 * 退社打刻Step2
 *
 * @param {{
 *   flag        : boolean, false:退社打刻 true:定時退社打刻
 *   prevFlag    : true,    昨日の退社打刻
 *   et          : number,
 *   stdStartTime: number,
 *   stdEndTime  : number,
 *   dayFix      : boolean,
 *   comment     : string
 * }} para
 */
teasp.view.Daily.prototype.pushTimeStep2 = function(para){
	var currentToken = this.token;
	if(this.pouch.isPushTimeWithLocationWeb() && navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			dojo.hitch(this, function(position){
				if(currentToken == this.token){
					this.token++;
					this.pushTimeStep3(para, position.coords);
				}
			}),
			dojo.hitch(this, function(err){
				if(currentToken == this.token){
					this.token++;
					this.pushTimeStep3(para, null, err);
				}
			}),
			{
				enableHighAccuracy: true,
				timeout: 30000,
				maximumAge: 0
			}
		);
	}else{
		this.pushTimeStep3(para);
	}
};

/**
 * 退社打刻Step3
 *
 * @param {{
 *   flag        : boolean, false:退社打刻 true:定時退社打刻
 *   prevFlag    : true,    昨日の退社打刻
 *   et          : number,
 *   stdStartTime: number,
 *   stdEndTime  : number,
 *   dayFix      : boolean,
 *   comment     : string
 * }} para
 * @param {Object=} coords 位置情報
 * @param {Object=} geoerr 位置情報取得エラー
 */
teasp.view.Daily.prototype.pushTimeStep3 = function(para, coords, geoerr){
    var req = {
        empId            : this.pouch.getEmpId(),
        month            : this.pouch.getYearMonth(),
        lastModifiedDate : this.pouch.getLastModifiedDate(),
        mode             : this.pouch.getMode(),
        date             : this.pouch.getParamDate(),
        dayFix           : para.dayFix,
        client           : teasp.constant.APPLY_CLIENT_DAILY,
        prevFlag         : para.prevFlag,
        stdStartTime     : para.stdStartTime,
        stdEndTime       : para.stdEndTime,
        input  : {
            time      : para.et,
            face      : 1,
            type      : 10,
            fix       : para.flag,
            comment   : para.comment
        },
        device           : 'TSW',
        latitude         : (coords ? coords.latitude  : null),
        longitude        : (coords ? coords.longitude : null)
    };
	if(this.pouch.isUseWorkLocation()){ // 勤務場所
		req.input.workLocationId = this.getSelectedWorkLocationId();
	}
    teasp.manager.request(
        'inputTime',
        req,
        this.pouch,
        { hideBusy : true },
        this,
        function(){
            teasp.manager.dialogClose('BusyWait2');
            this.pushTimeStep4(geoerr, dojo.hitch(this, function(){
                this.openCommentArea(false);
                var comment = dojo.byId('endComment');
                comment.value = this.COMMENT_QUEST;
                dojo.style(comment, 'color', this.COMMENT_QUEST_COLOR);
                this.refreshDaily();
            }));
        },
        function(event){
            teasp.manager.dialogClose('BusyWait2');
            teasp.message.alertError(event);
        }
    );
};

/**
 * 退社打刻Step4
 */
teasp.view.Daily.prototype.pushTimeStep4 = function(geoerr, callback){
	if(geoerr){
		var err = teasp.view.Widget.getGetLocationError(geoerr);
		this.showMessage(err, callback);
	}else{
		callback();
	}
};

//位置情報取得エラー表示
teasp.view.Daily.prototype.showMessage = function(err, callback){
	if(!err.msg){
		return;
	}
	teasp.manager.dialogOpen(
		'MessageBox',
		{
			title        : err.msg,
			message      : err.sub1 + '<br/>' + err.sub2,
			defaultTitleColor : true,
			closeOnly    : true,
			closeFunc    : callback
		},
		this.pouch,
		this,
		callback
	);
};

/**
 * 時計表示
 *
 */
teasp.view.Daily.prototype.clock = function() {
    var that = this;
    var clockIn = function(){

        var dt = teasp.util.date.getToday();
        if(dojo.byId('clock')){
            dojo.byId('clock').innerHTML = ('' + dt.getHours() + ':' + (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes());
        }
        if(dt.getSeconds() == 0){
            that.setPushButton();
//              this.setCurrentTimeBar(); 1分ごとに現在時刻バーを更新するならこのコメントを外す。
        }
    };
    setInterval(clockIn, 1000);
};

/**
 * 工数実績の比率を取得
 *
 * @param {Object} record 工数実績オブジェクト
 * @return {string} パーセント
 */
teasp.view.Daily.prototype.convPercent = function(record){
    return '' + ((record.percent > 0) ? Math.round(record.percent / 10) : 0);
};

/**
 * 工数実績の時間を取得
 *
 * @param {Object} jobWork 工数実績オブジェクト
 * @param {boolean} worked 出社したか
 * @param {number} sumt 工数時間の合計値
 * @param {boolean} complex =true:時間入力が混在している
 * @return {string} 時間
 */
teasp.view.Daily.prototype.convTime = function(jobWork, worked, sumt, complex){
    var valObj = {className:'time', value: null};
    var mode = 0; // 0:time, 1:volume, 2:percent
    if(!jobWork.timeFix && !worked){
        mode = (!complex ? 2 : 1);
    }
    // 残工数を登録するジョブで、percent==0の場合は工数未入力である。
    // 勤怠入力済みの場合、時間に換算してしまって工数入力済みと誤認識されてしまうことを
    // 考慮し、時間に換算せず「* *」を表示する。
    if(jobWork.leftover && !jobWork.percent){
        mode = 1;
    }
    if(mode == 0){
        valObj.value = (jobWork.volume ? teasp.util.time.timeValue(jobWork.time || 0) : '-');
    }else if(!jobWork.time && !jobWork.volume){
        valObj.value = '-';
    }else if(mode == 1){
        valObj.value = '* *';
    }else{
        valObj.value = Math.round(jobWork.percent / 10) + '%';
        valObj.className = 'percent';
    }
    return valObj;
};

/**
 * 経費データの金額を取得
 *
 * @param {Object} record 経費明細オブジェクト
 * @return {string} 金額
 */
teasp.view.Daily.prototype.convExpCost = function(record){
    if(record.cost == undefined){
        return teasp.message.getLabel('tm00000107'); // －
    }
    var c = teasp.util.currency.formatMoney(record.cost);
    return (c.length > 0 ? '&yen;' + c : '');
};

/**
 * 経費データの合計金額を取得
 *
 * @param {Array.<Object>} records 経費明細オブジェクトの配列
 * @return {string} 合計金額
 */
teasp.view.Daily.prototype.summaryExpCost = function(records){
    var cost = 0;
    for(var i = 0 ; i < records.length ; i++){
        if(records[i].cost != undefined){
            cost += records[i].cost;
        }
    }
    var c = teasp.util.currency.formatMoney(cost);
    return (c.length > 0 ? '&yen;' + c : '');
};

/**
 * （勤怠グラフ用）現在時刻をグラフ上に表示
 *
 */
teasp.view.Daily.prototype.setCurrentTimeBar = function(){
    var marginLeft = 10;            // 起点
    var widthPerH = 24;             // ピクセル数/時
    var mk, absPos, currd, currDate, div, n, ct, x;
    currd = teasp.util.date.getToday();
    currDate = teasp.util.date.formatDate(currd);
    if(currDate == this.pouch.getParamDate()){
        div = dojo.byId('empWorkGraph');
        var match = /\-?(\d+)px\s+\-?\d+px/.exec(div.style.backgroundPosition);
        if(match){
            n = parseInt(match[1], 10);
            absPos = {
                x      : n,
                leftX  : (n - marginLeft),
                rightX : (n - marginLeft + teasp.constant.GRAPH_AREA_WIDTH)
            };
            ct = currd.getHours() * 60 + currd.getMinutes();
            x = ct * widthPerH / 60;
            if(absPos.leftX <= x && x < absPos.rightX){
                mk = dojo.query('.pp_v_dashbar')[0];
                if(mk){
                    mk.style.left = (x + marginLeft - absPos.x) + 'px';
                }else{
                    dojo.create('div', { className: 'pp_base pp_v_dashbar', style: { left: (Math.round(x + marginLeft - absPos.x) + "px"), top:"15px" } }, div);
                }
            }
        }
    }else{
        var bars = dojo.query('.pp_v_dashbar');
        if(bars.length > 0){
            dojo.destroy(bars[0]);
        }
    }
};


/**
 * エラー表示(退社打刻フォーム下部)
 *
 * @param {string|null} msg メッセージ
 */
teasp.view.Daily.prototype.showError = function(msg){
    dojo.style('timeReportErrorRow', 'display', (msg ? '' : 'none'));
    dojo.byId('timeReportError').innerHTML = (msg || '');
};

/**
 * エラー表示(カレンダー上部)
 *
 * @param {string|null} msg メッセージ
 */
teasp.view.Daily.prototype.showCalendarError = function(msg){
    dojo.style('timeAreaErrorRow', 'display', (msg ? '' : 'none'));
    dojo.byId('calenderErrorMsg').innerHTML = (msg || '');
};


/**
 * 領収書登録windowから登録・削除の状態を得る
 *
 * @param {string} id 該当expLog.id
 * @param {boolean} mode true 書き込み false 削除
 * @param {string} openerObj 添付子windowをopenしたクラスの名前
 * @author nekonekon
 */
teasp.view.Daily.prototype.appliedReceipt = function(id,mode,openerObj){
    var expLog = this.getObjectById(this.pouch.getExpLogs(),id);
    if(!expLog){
        return;
    }
    var at = {
        id : id
    };

    if(mode){
        expLog.attachments = [];
        expLog.attachments.push(at);
    }else{
        expLog.attachments = null;
    }

    if(openerObj=='EmpExp'){
        window.teasp.manager.dialogs[openerObj].createBody();
    }
    this.refreshDaily();
};

/**
 * 配列から id がマッチするオブジェクトを返す
 *
 * @param {Object} lst オブジェクト（id要素を持つ）配列
 * @param {string} id ID
 * @return {Object} マッチしたオブジェクト
 */
teasp.view.Daily.prototype.getObjectById = function(lst, id){
    for(var i = 0 ; i < lst.length ; i++){
        if(lst[i].id == id){
            return lst[i];
        }
    }
    return null;
};

/**
 * 登録状態スイッチのアイコンクラス名からステータス状態の確認
 *
 * @param {string} className アイコンにセットされるクラスネーム
 * @returns {boolean} true 領収証画面編集可能モード false 参照モード
 */
teasp.view.Daily.prototype.getStatusSimply = function(className){
    switch(className){
    case 'pb_status_noapp_dis':
        return true;
        break;
    case 'pb_status_rejct':
        return true;
        break;
    case 'pb_status_aprv':
        return false;
    case 'pb_status_wait':
      return false;
        break;
        default:
            return true;
        break;
    }
};

teasp.view.Daily.prototype.resizeArea = function(){
	try{
		if(this.helperSche){
			this.helperSche.onresize();
		}
	}catch(e){
	}
};
/**
 * 退社打刻エリアの勤務場所UI構築
 */
 teasp.view.Daily.prototype.createWorkLocationArea = function(){
	// ラベル
	dojo.byId('endWorkLocationLabel').innerHTML = teasp.message.getLabel('tw00000010');
	dojo.byId('empWorkLocation').innerHTML = teasp.message.getLabel('tw00000010');
};
/**
 * 勤務場所プルダウンのセット
 */
teasp.view.Daily.prototype.setWorkLocationSelect = function(dayWrap){
	const handleKey = 'workLocationSelect';
	if(this.eventHandles.hasOwnProperty(handleKey)){
		dojo.disconnect(this.eventHandles[handleKey]);
		delete this.eventHandles[handleKey];
	}
	const select = dojo.byId('endWorkLocationSelect');
	dojo.empty(select);
	if(this.pouch.isUseWorkLocation()){
		var id = dayWrap.getWorkLocationId();
		var exist = false;
		dojo.create('option', { value:'', innerHTML:'' }, select);
		dojo.forEach(this.pouch.getWorkLocations(), function(workLocation){
			dojo.create('option', {
				value: workLocation.getId(),
				innerHTML: workLocation.getName()
			}, select);
			if(id && id == workLocation.getId()){
				exist = true;
			}
		}, this);
		if(exist){
			select.value = id;
		}else{
			const defaultWorkLocation = this.pouch.getDefaultWorkLocation();
			if(defaultWorkLocation){
				select.value = defaultWorkLocation.getId();
			}
		}
        this.eventHandles[handleKey] = dojo.connect(select, 'change', this, function(e){
            this.controlDayFix(dayWrap);
        });
	}
};
/**
 * 勤務場所エリアの表示/非表示切り替え
 */
teasp.view.Daily.prototype.setWorkLocationOnOff = function(){
	if(this.pouch.isTimeReportDedicatedToJob()){ // タイムレポートの勤怠情報と経費精算を非表示にする
		dojo.style('empWorkDiv', 'height', (this.pouch.getWorkNoteOption() ? '275px' : '392px'));
	}else{
		const useWorkLocation = this.pouch.isUseWorkLocation();
		// 勤務場所エリア
		dojo.style('endWorkLocationArea', 'display', (useWorkLocation ? '' : 'none'));
		dojo.style('empWorkLocationArea', 'display', (useWorkLocation ? '' : 'none'));
		// 退社打刻エリアの切り替え
		dojo.toggleClass('endCommentArea', 'comment-area' , !useWorkLocation);
		dojo.toggleClass('endCommentArea', 'comment-area2',  useWorkLocation);
		dojo.toggleClass('endAndDayFixRow', 'plus_top2'   ,  useWorkLocation);
		dojo.toggleClass('endWorkLocationSelect', 'english', teasp.isEnglish());
		// 工数実績エリアの高さ調整
		var h = (this.pouch.getWorkNoteOption() ? 183 : 300) - (useWorkLocation ? 27 : 0) ;
		dojo.style('empWorkDiv', 'height', h + 'px');
	}
};
/**
 * 選択中の勤務場所をセット
 * @param {teasp.data.EmpDay} dayWrap
 * @param {boolean}
 */
teasp.view.Daily.prototype.setWorkLocation = function(dayWrap, alive){
	this.setWorkLocationOnOff();
	// プルダウン
	this.setWorkLocationSelect(dayWrap);
    // ラベル
	if(alive && (dayWrap.isInputTime() || dayWrap.isInputable())){
		dojo.byId('workLocationValue').innerHTML = dayWrap.getWorkLocationName();
	}else{
		dojo.byId('workLocationValue').innerHTML = '';
	}
};
/**
 * 選択した勤務場所IDを返す
 * @returns {string|null}
 */
teasp.view.Daily.prototype.getSelectedWorkLocationId = function(){
	return dojo.byId('endWorkLocationSelect').value || null;
};
/**
 * 日次確定ボタンの表示切り替え
 * @param {teasp.data.EmpDay} dayWrap
 */
 teasp.view.Daily.prototype.showDayFixButton = function(dayWrap){
	const handleKey = 'dayLock';
	if(this.eventHandles.hasOwnProperty(handleKey)){
		dojo.disconnect(this.eventHandles[handleKey]);
		delete this.eventHandles[handleKey];
	}
	if(this.pouch.isAlive(dayWrap.getKey())){
		var dayLock = dojo.byId('dayLock');
		var dayApply = dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_DAILY);
		if(dayApply){
			dayLock.className = 'ts-status-img ts-ap_day' + teasp.constant.getStatusStyleSuffix(dayWrap.getApplyStatus(teasp.constant.APPLY_KEY_DAILY));
			dayLock.style.cursor = 'pointer';
			dayLock.title = teasp.message.getLabel('tm10001690') // 日次確定
							+ teasp.message.getLabel('tm10001680', teasp.constant.getDisplayStatus(dayWrap.getApplyStatus(teasp.constant.APPLY_KEY_DAILY))); // ステータス
			this.eventHandles[handleKey] = dojo.connect(dayLock, 'onclick', this, this.openEmpApply(dayWrap.getKey(), dayApply.id));
		}else{
			dayLock.className = '';
			dayLock.title = '';
		}
	}
};
/**
 * 日次確定ボタン、日次確定するの表示切り替え
 */
teasp.view.Daily.prototype.controlDayFix = function(dayWrap){
	var dayObj = dayWrap.getObj();
	var dayfixable = false;
	this.workRealTime = 0;
	if(this.pouch.isAlive(dayWrap.getKey())){
		if(dayObj.rack.worked){
			this.workRealTime = dayObj.real.workRealTime;
		}else if(typeof(dayObj.startTime) == 'number'){
			dayObj = dojo.clone(dayObj);
			var d = teasp.util.date.getToday();
			dayObj.endTime = d.getHours() * 60 + d.getMinutes();
			teasp.action.contact.recalcOneDay(this.pouch, dayObj);
			this.workRealTime = dayObj.real.workRealTime;
            if(this.pouch.isRequireWorkLocation()){ // 勤務場所入力必須
                dayfixable = (dojo.byId('endWorkLocationSelect').value ? true : false);
            }else{
                dayfixable = true;
            }
		}
	}
	const canfx = dayWrap.canSelectDailyEx(2);
	if(dayfixable && !canfx.flag){
		dayfixable = false;
	}
	if(this.pouch.isCheckDefaultDailyFix() && dayfixable){
		dojo.byId('endAndDayFix').checked = true;
	}else if(!dayfixable){
		dojo.byId('endAndDayFix').checked = false;
    }
	dojo.byId('endAndDayFix').disabled = (dayfixable ? false : true);
	dojo.style('endAndDayFixLabel', 'color', (dayfixable ? '#222222' : '#cccccc'));
};
