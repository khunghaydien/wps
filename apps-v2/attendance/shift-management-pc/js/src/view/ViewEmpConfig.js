teasp.provide('teasp.view.EmpConfig');
/**
 * 個人設定画面
 *
 * @constructor
 * @extends {teasp.view.Base}
 * @author DCI小島
 */
teasp.view.EmpConfig = function(){
    this.today = teasp.util.date.getToday();
};

teasp.view.EmpConfig.prototype = new teasp.view.Base();

/**
 * 画面初期化
 *
 * @param {Object} messageMap メッセージテーブル
 * @param {Function} onSuccess 正常受信時の処理
 * @param {Function} onFailure 異常受信時の処理
 */
teasp.view.EmpConfig.prototype.init = function(messageMap, onSuccess, onFailure){

    teasp.message.mergeLabels(globalMessages || {});
    teasp.message.mergeLabels(messageMap ? (messageMap[teasp.message.getLanguageLocaleKey()] || {}) : {});

    this.readParams({ target: 'empMonth' });

    if(this.viewParams['narrow'] || teasp.isMobile()){
        dojo.query('td.buttons').forEach(function(el){
            dojo.style(el, 'display', 'none');
        });
    }
    if(teasp.isAndroid()){
        dojo.style('areaBody', 'padding-right' ,  '70px');
        dojo.style('areaBody', 'padding-bottom', '100px');
    }

    // サーバへリクエスト送信
    teasp.manager.request(
        'loadEmpConfig',
        this.viewParams,
        this.pouch,
        { hideBusy : true },
        this,
        function(){
            this.displayValue();
            onSuccess();
        },
        function(event){
            onFailure(event);
        }
    );
};

/**
 * 個人設定を出力
 */
teasp.view.EmpConfig.prototype.displayValue = function(){
    this.displayValue1();
    this.displayValue2();
    this.displayValue3();
    this.displayValue4();
    this.displayValue5();
//    this.displayValue6();
//    this.displayValue7();
//    this.displayValue8();
//    this.displayValue9();

    // 勤務パターン一覧
    this.createPatternTable(this.pouch.getPatternObjs(), 'patternArea');

    // 休暇一覧
    this.createHolidayTable(this.pouch.getHolidayObjs(), 'holidayArea');

    // 「月次確定なしで部署確定可能」＝オンのときだけ、対象者フラグ行を表示
    dojo.style('empViewInputFlagRow', 'display', (this.pouch.isPermitDeptFixWoMonthFix() ? '' : 'none'));

    // 「入退館管理機能を使用する」＝オンのときだけ、入退館管理行を表示
    dojo.style('empViewAccFlagRow', 'display', (this.pouch.isInputAccessControlValid() ? '' : 'none'));

    dojo.query('.empInfo_table').forEach(function(elem){
        if(elem.rows){
            var cnt = 0;
            for(var i = 0 ; i < elem.rows.length ; i++){
                var row = elem.rows[i];
                if(row.style.display != 'none'){
                    row.className = (((cnt++)%2)===0 ? 'even' : 'odd');
                }
            }
        }
    });
};

teasp.view.EmpConfig.prototype.displayValue1 = function(){
    dojo.byId('configPrint').firstChild.innerHTML = teasp.message.getLabel('printOut_btn_title'); // プリンタへ出力
    dojo.connect(dojo.byId('configPrint'), 'onclick', function(){
        window.print();
        return false;
    });

    dojo.byId('configClose').firstChild.innerHTML = teasp.message.getLabel('close_btn_title'); // 閉じる
    dojo.connect(dojo.byId('configClose'), 'onclick', function(){
        (window.open('','_top').opener=top).close();
        return false;
    });

    try{ // Safari では失敗する
        var winTitles = document.getElementsByTagName('title');
        if(winTitles && winTitles.length > 0){
            winTitles[0].innerHTML = teasp.message.getLabel('tm10010010', this.pouch.getName());
        }
    }catch(e){}
};

teasp.view.EmpConfig.prototype.displayValue2 = function(){
    // 社員情報
    dojo.byId('empViewEmpSect'         ).innerHTML = teasp.message.getLabel('tm10010640');          // ■ 社員情報
    dojo.byId('empViewEmpCodeH'        ).innerHTML = teasp.message.getLabel('tk10000068');          // 社員コード
    dojo.byId('empViewEmpNameH'        ).innerHTML = teasp.message.getLabel('empName_label');       // 社員名
    dojo.byId('empViewDeptCodeH'       ).innerHTML = teasp.message.getLabel('tk10000069');          // 社員コード
    dojo.byId('empViewDeptNameH'       ).innerHTML = teasp.message.getLabel('dept_label');          // 部署
    dojo.byId('empViewEmpTypeH'        ).innerHTML = teasp.message.getLabel('empType_label');       // 勤務体系
    dojo.byId('empViewAccFlagH'        ).innerHTML = teasp.message.getLabel('ac00000580');          // 入退館管理フラグ
    dojo.byId('empViewTitleH'          ).innerHTML = teasp.message.getLabel('title_label');         // 役職
    dojo.byId('empViewManagerH'        ).innerHTML = teasp.message.getLabel('empManager_label');    // 上長
    dojo.byId('empViewUserNameH'       ).innerHTML = teasp.message.getLabel('empUser_label');       // Salesforceユーザ名
    dojo.byId('empViewEntryDateH'      ).innerHTML = teasp.message.getLabel('empEntryDate_label');  // 入社日
    dojo.byId('empViewInputFlagH'      ).innerHTML = teasp.message.getLabel('empInputFlag_label');  // 対象者フラグ
    dojo.byId('empViewEndDateH'        ).innerHTML = teasp.message.getLabel('tk10000375');          // 退社日
    dojo.byId('empViewEkitanH'         ).innerHTML = teasp.message.getLabel('ekitanSetting_caption');// 駅探設定
//    // 有休残日数
//    dojo.byId('empViewYuqSect'         ).innerHTML = teasp.message.getLabel('tm10010650');          // ■ 有休残日数
//    dojo.byId('empViewYuqHead1'        ).innerHTML = teasp.message.getLabel('yuqStartDate_head');   // 有効開始日
//    dojo.byId('empViewYuqHead2'        ).innerHTML = teasp.message.getLabel('yuqLimitDate_head');   // 失効日
//    dojo.byId('empViewYuqHead3'        ).innerHTML = teasp.message.getLabel('yuqProvideDate_head'); // 付与日
//    dojo.byId('empViewYuqHead4'        ).innerHTML = teasp.message.getLabel('yuqProvide_head');     // 付与日数
//    dojo.byId('empViewYuqHead5'        ).innerHTML = teasp.message.getLabel('yuqSpend_head');       // 消化
//    dojo.byId('empViewYuqHead6'        ).innerHTML = teasp.message.getLabel('yuqRemain_head');      // 残日数
//    dojo.byId('empViewYuqHead7'        ).innerHTML = teasp.message.getLabel('note_head');           // 備考
//    // 代休管理
//    dojo.byId('empViewDaiqHead1'       ).innerHTML = teasp.message.getLabel('date_head');           // 日付
//    dojo.byId('empViewDaiqHead2'       ).innerHTML = teasp.message.getLabel('subject_head');        // 事柄
//    dojo.byId('empViewDaiqHead3'       ).innerHTML = teasp.message.getLabel('tm10010960');          // 休出
//    dojo.byId('empViewDaiqHead4'       ).innerHTML = teasp.message.getLabel('tm10010550');          // 代休
//    dojo.byId('empViewDaiqHead5'       ).innerHTML = teasp.message.getLabel('yuqLimitDate_head');   // 失効日
//    dojo.byId('empViewDaiqHead6'       ).innerHTML = teasp.message.getLabel('statusj_head');        // 状況
    // 勤怠設定
    dojo.byId('empViewConfSect'        ).innerHTML = teasp.message.getLabel('tm10010660');          // ■ 勤怠設定
    dojo.byId('empViewConfGeneH'       ).innerHTML = teasp.message.getLabel('confGene_label');      // 世代
    dojo.byId('empViewConfWorkSysH'    ).innerHTML = teasp.message.getLabel('confStyle_label');     // 労働時間制
    dojo.byId('empViewConfHolyH'       ).innerHTML = teasp.message.getLabel('confHoliday_label');   // 休日
    dojo.byId('empViewFlexTimeH'       ).innerHTML = teasp.message.getLabel('tm10010690');          // フレックスタイム設定
    dojo.byId('empViewConfStdPatternH' ).innerHTML = teasp.message.getLabel('confStartEnd_label');  // 標準の勤務時間
    dojo.byId('empViewConfStartH'      ).innerHTML = teasp.message.getLabel('confStartDate_label'); // 起算日・表記
    dojo.byId('empViewConfLegalH'      ).innerHTML = teasp.message.getLabel('confLegalTime_label'); // 法定労働時間
    dojo.byId('empViewConfLegalRestH'  ).innerHTML = teasp.message.getLabel('tm10010740');          // 法定休憩時間のチェック
    dojo.byId('empViewConfHolidayWorkH').innerHTML = teasp.message.getLabel('applyHolidayWork_label'); // 休日出勤申請
    dojo.byId('empViewConfZangyoH'     ).innerHTML = teasp.message.getLabel('applyZangyo_label');   // 残業申請
    dojo.byId('empViewConfEarlyWorkH'  ).innerHTML = teasp.message.getLabel('applyEarlyWork_label');// 早朝勤務申請
    dojo.byId('empViewConfLateStartH'  ).innerHTML = teasp.message.getLabel('applyLateStart_label');// 遅刻申請
    dojo.byId('empViewConfEarlyEndH'   ).innerHTML = teasp.message.getLabel('applyEarlyEnd_label'); // 早退申請
    dojo.byId('empViewConfExchangeH'   ).innerHTML = teasp.message.getLabel('applyExchange_label'); // 振替申請
    dojo.byId('empViewConfPatternH'    ).innerHTML = teasp.message.getLabel('applyPatternS_label'); // 勤務時間変更申請
    dojo.byId('empViewConfDirectH'     ).innerHTML = teasp.message.getLabel('tk10004650');          // 直行・直帰申請
    dojo.byId('empViewConfReviseH'     ).innerHTML = teasp.message.getLabel('applyReviseTime_label'); // 勤怠時刻修正申請
    dojo.byId('empViewConfDailyH'      ).innerHTML = teasp.message.getLabel('applyDailys_label');   // 日次確定申請
    dojo.byId('empViewConfWorkFlowH'   ).innerHTML = teasp.message.getLabel('confWorkFlow_label');  // 承認ワークフロー
    dojo.byId('empViewConfFormH'       ).innerHTML = teasp.message.getLabel('confAssistFormat_label'); // 入力補助・表示形式
    dojo.byId('empViewPermitUpdateH'   ).innerHTML = teasp.message.getLabel('tk10004420');             // 勤務時間を修正できる社員
    // 代休管理の設定
    dojo.byId('empViewConfDaiqSect'    ).innerHTML = teasp.message.getLabel('tm10010661');          // ■ 代休管理の設定
    dojo.byId('empViewConfDaiqManageH' ).innerHTML = teasp.message.getLabel('tm10010910');          // 代休管理
    dojo.byId('empViewConfDaiqHalfH'   ).innerHTML = teasp.message.getLabel('tm10010920');          // 半日代休
    dojo.byId('empViewConfDaiqableH'   ).innerHTML = teasp.message.getLabel('tm10010930');          // 代休取得可能な休日出勤労働時間
    dojo.byId('empViewConfDaiqLimitH'  ).innerHTML = teasp.message.getLabel('tm10010940');          // 代休の有効期限
    dojo.byId('empViewConfHolyWorkH'   ).innerHTML = teasp.message.getLabel('tm10010950');          // 休日出勤申請オプション
    // 勤務パターン
    dojo.byId('empViewPatternSect'     ).innerHTML = teasp.message.getLabel('tm10010670');          // ■ 勤務パターン
    // 休暇種類
    dojo.byId('empViewHolidaySect'     ).innerHTML = teasp.message.getLabel('tm10010680');          // ■ 休暇種類
};

teasp.view.EmpConfig.prototype.displayValue3 = function(){
    // 社員情報
    dojo.byId('empViewEmpCode').innerHTML   = this.pouch.getEmpCode();
    dojo.byId('empViewEmpName').innerHTML   = this.pouch.getName();
    dojo.byId('empViewDeptCode').innerHTML  = this.pouch.getDeptCode();
    dojo.byId('empViewDeptName').innerHTML  = this.pouch.getDeptName();
    dojo.byId('empViewEmpType').innerHTML   = this.pouch.getEmpTypeName();
    dojo.byId('empViewTitle').innerHTML     = this.pouch.getTitle();
    dojo.byId('empViewManager').innerHTML   = this.pouch.getManagerName();
    dojo.byId('empViewUserName').innerHTML  = this.pouch.getUserName();
    dojo.byId('empViewEntryDate').innerHTML = teasp.util.date.formatDate(this.pouch.getEntryDate(), 'SLA');
    dojo.byId('empViewInputFlag').innerHTML = teasp.constant.getInputFlagName(this.pouch.getInputFlag());
    dojo.byId('empViewAccFlag').innerHTML   = this.pouch.getInputAccessControlStr();
    // 退社日
    var endDate = this.pouch.getEndDate();
    dojo.byId('empViewEndDate').innerHTML = teasp.util.date.formatDate(endDate, 'SLA');
    dojo.query('.end_date').forEach(function(elem){
        dojo.style(elem, 'display', (endDate ? '' : 'none'));
    }, this);
    // 駅探設定
    dojo.query('.ekitan_setting').forEach(function(elem){
        dojo.style(elem, 'display', (!this.pouch.isDisabledEmpExp() && this.pouch.isUseEkitan() ? '' : 'none'));
    }, this);
    if(!this.pouch.isDisabledEmpExp() && this.pouch.isUseEkitan()){
        var expConfig = this.pouch.getExpConfig();
        dojo.byId('empViewEkitan').innerHTML = teasp.message.getLabel('tm10010970',
                teasp.message.getLabel('area_label'),
                teasp.constant.getEkitanAreas(this.pouch.getEkitanArea()).name, // 地域
                teasp.message.getLabel('paidExpress_label'),
                teasp.message.getLabel(expConfig && expConfig.usePaidExpress ? 'paidExpressYes_label' : 'paidExpressNo_label'), // 特急/新幹線
                teasp.message.getLabel('reservedSheet_label'),
                teasp.message.getLabel(expConfig && expConfig.useReservedSheet ? 'reservedSheetYes_label' : 'reservedSheetNo_label'), // 特急料金
                teasp.message.getLabel('preferredAirLine_label'),
                teasp.constant.getPreferredAirLine(expConfig && expConfig.preferredAirLine || 0).name, // 優先する航空会社
                teasp.message.getLabel('routePreference_label'),
                teasp.constant.getRoutePreference(expConfig && expConfig.routePreference || 0).name, // 検索結果のソート
                teasp.message.getLabel('excludeCommuter_label'),
                teasp.constant.getExcludeCommuterRoute(expConfig && expConfig.excludeCommuterRoute || false).name, // 定期区間の取扱
                teasp.message.getLabel('commuterRoute_label'   ),
                this.pouch.getCommuterRouteNote()); // 登録定期区間
    }
};

teasp.view.EmpConfig.prototype.displayValue4 = function(){
    var confObj = this.pouch.getConfigObj();
    var commonObj = this.pouch.getCommonObj();
    var buf;

    // 世代
    if(confObj.validStartMonth && confObj.validEndMonth){
        buf = teasp.message.getLabel('tm10010020', // {0}から{1}まで
                    teasp.util.date.formatMonth('zv00000020', Math.floor(confObj.validStartMonth / 100), (confObj.validStartMonth % 100)),
                    teasp.util.date.formatMonth('zv00000020', Math.floor(confObj.validEndMonth / 100), (confObj.validEndMonth % 100)));
    }else if(confObj.validStartMonth){
        buf = teasp.message.getLabel('tm10010030', // {0}から
                    teasp.util.date.formatMonth('zv00000020', Math.floor(confObj.validStartMonth / 100),(confObj.validStartMonth % 100)));
    }else if(confObj.validEndMonth){
        buf = teasp.message.getLabel('tm10010040', // {0}まで
                    teasp.util.date.formatMonth('zv00000020', Math.floor(confObj.validEndMonth / 100), (confObj.validEndMonth % 100)));
    }else{
        buf = teasp.message.getLabel('tm10010050'); // 期限なし
    }
    dojo.byId('empViewConfGene').innerHTML = confObj.generation + '(' + buf + ')';

    // 労働時間制
    if(confObj.workSystem == teasp.constant.WORK_SYSTEM_FLEX){
        buf = teasp.message.getLabel('tm10010061', // フレックスタイム制（清算期間：{0}）
                teasp.message.getLabel('tm10010100',
                    (confObj.variablePeriod > 1 ? confObj.variablePeriod : 1)));
    }else if(confObj.workSystem == teasp.constant.WORK_SYSTEM_MUTATE){
        var pd;
        if(confObj.variablePeriod == 0){
            pd = teasp.message.getLabel('tm10009020'); // 1週間
        }else if(confObj.variablePeriod == 12){
            pd = teasp.message.getLabel('tm10009030'); // 1年
        }else{
            pd = teasp.message.getLabel('tm10010100', confObj.variablePeriod); // {0}ヶ月
        }
        buf = teasp.message.getLabel('tm10010070', pd);
    }else if(confObj.workSystem == teasp.constant.WORK_SYSTEM_MANAGER){
        buf = teasp.message.getLabel('tm10010080'); // 管理監督者
    }else{
        buf = teasp.message.getLabel('tm10010090'); // 固定労働時間制
    }
    dojo.byId('empViewConfWorkSys').innerHTML = buf;

    // 休日
    var hs = (confObj.holidays || '') + '0000000';
    var weekHolys = [];
    var legalHolys = [];
    for(var i = 0 ; i < hs.length ; i++){
        var h = hs.substring(i, i + 1);
        if(h != '0'){
            weekHolys.push(i);
        }
        if(h == '2'){
            legalHolys.push(i);
        }
    }
    if(weekHolys.length > 0){
        hs = teasp.util.date.getWeekJpByNumArray(weekHolys);
        if(legalHolys.length > 0){
            hs += teasp.message.getLabel('tm10010631', teasp.util.date.getWeekJpByNumArray(legalHolys)); // ({0}は法定休日)
        }else if(typeof(confObj.defaultLegalHoliday) == 'number'){
            hs += teasp.message.getLabel('tk10004900', teasp.util.date.getWeekJpByNumArray([confObj.defaultLegalHoliday])); // ({0}は優先法定休日)
        }
    }else{
        hs = teasp.message.getLabel('tm10010150'); // No
    }
    // 休日の曜日
    dojo.byId('empViewConfHoly').innerHTML = hs;
    // 法定休日の自動判定日＝する、しない
    dojo.byId('empViewConfHoly2').innerHTML = teasp.message.getLabel('tm20009140'
            , teasp.message.getLabel('tk10000529')
            , teasp.message.getLabel(this.pouch.isAutoLegalHoliday() ? 'tm10010590' : 'tm10010600'));
    // 国民の祝日＝会社休日である、会社休日ではない
    dojo.byId('empViewConfHoly3').innerHTML = teasp.message.getLabel('tm20009140'
            , teasp.message.getLabel('tk10000265')
            , teasp.message.getLabel(this.pouch.isNonPublicHoliday() ? 'tk10001147' : 'tk10001146'));

    // フレックスタイム設定
    if(confObj.workSystem == teasp.constant.WORK_SYSTEM_FLEX){
        dojo.style('empInfoRowFlex', 'display', '');
        buf = '<table border="0" cellpadding="0" cellspacing="0">';
        buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10010120') + '</div></td>'; // フレックス時間帯
        buf += '<td><div>' + this.displayTimeRange(confObj.flexStartTime, confObj.flexEndTime) + '</div></td></tr>';
        buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10010130') + '</div></td>'; // コア時間帯
        if(confObj.useCoreTime){
            buf += '<td><div>' + this.displayTimeRange(confObj.coreStartTime, confObj.coreEndTime) + '</div></td></tr>';
        }else{
            buf += '<td><div>' + teasp.message.getLabel('tm10010150') + '</div></td></tr>'; // なし
        }
        buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10010160') + '</div></td>'; // 月の所定労働時間
        buf += '<td><div>' + this.pouch.getMonthSubTimeByKey('workFixedTime') + '</div></td></tr>';
        buf += '</table>';
        dojo.byId('empViewFlexTime').innerHTML = buf;
    }else{
        dojo.style('empInfoRowFlex', 'display', 'none');
    }

    // 標準の勤務時間
    var p = confObj.defaultPattern;
    buf = '<table border="0" cellpadding="0" cellspacing="0">';
    buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10010170') + '</div></td>'; // 始業終業の時刻
    buf += '<td><div>' + teasp.message.getLabel('tm10010460', teasp.util.time.timeValue(p.stdStartTime), teasp.util.time.timeValue(p.stdEndTime)) + '</div></td></tr>';
    buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('restTime_label') + '</div></td><td><div>'; // 休憩時間
    if(p.restTimes){
        buf += teasp.view.EmpConfig.getRestTimes(p.restTimes);
    }
    buf += '</div></td></tr>';
    buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('fixTimeOfDay_label')       + '</div></td>'; // 所定労働時間
    buf += '<td><div>'                           + teasp.util.time.timeValue(confObj.standardFixTime) + '</div></td></tr>';
    buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10010190')               + '</div></td>'; // 半日休暇
    buf += '<td><div>'                           + teasp.message.getLabel(p.useHalfHoliday ? 'tm10010200' : 'tm10010210') + '</div></td></tr>'; // 取得可 or 取得不可
    if(p.useHalfHoliday){
        buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10010220')               + '</div></td>'; // 半休適用時間
        buf += '<td><div>' + teasp.message.getLabel('tm10010230', // 午前：{0}～{1}、午後：{2}～{3}
                    teasp.util.time.timeValue(p.amHolidayStartTime),
                    teasp.util.time.timeValue(p.amHolidayEndTime),
                    teasp.util.time.timeValue(p.pmHolidayStartTime),
                    teasp.util.time.timeValue(p.pmHolidayEndTime));
        buf += '</div></td></tr>';
        buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tf10009700') + '</div></td>'; // 半休取得時の休憩時間
        buf += '<td><div>'                           + teasp.message.getLabel(p.useHalfHolidayRestTime ? 'tf10009710' : 'tf10009711') + '</div></td></tr>'; // 適用する or 適用しない
        if(p.useHalfHolidayRestTime){
            buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tf10009720') + '</div></td><td><div>'; // 午前半休時休憩時間
            if(p.amHolidayRestTimes){
                buf += teasp.view.EmpConfig.getRestTimes(p.amHolidayRestTimes);
            }
            buf += '</div></td></tr>';
            buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tf10009730') + '</div></td><td><div>'; // 午後半休時休憩時間
            if(p.pmHolidayRestTimes){
                buf += teasp.view.EmpConfig.getRestTimes(p.pmHolidayRestTimes);
            }
            buf += '</div></td></tr>';
        }
    }
    buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10011110')               + '</div></td>'; // 時間単位休の基準時間
    buf += '<td><div>'                           + teasp.util.time.timeValue(confObj.baseTime)        + '</div></td></tr>';
    buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10011120')               + '</div></td>'; // 時間単位休の基準時間
    buf += '<td><div>'                           + teasp.util.time.timeValue(confObj.baseTimeForStock) + '</div></td></tr>';
    buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('nightWorkEx_label')        + '</div></td>';           // 深夜労働割増
    buf += '<td><div>' + teasp.message.getLabel(p.igonreNightWork ? 'tm10010150' : 'tm10010140')      + '</div></td></tr>';      // なし or あり
    buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10011020')               + '</div></td>';           // 残業と控除の相殺
    buf += '<td><div>' + teasp.message.getLabel(confObj.deductWithFixedTime ? 'tm10010600' : 'tm10010590') + '</div></td></tr>'; // する or しない

    if(confObj.extendDayType || confObj.leavingAcrossNextDay != '0'){
        buf += '<tr><td class="empInfo_scol1"';
        var f = (confObj.extendDayType && confObj.leavingAcrossNextDay != '0');
        if(f){
            buf += ' rowSpan="2"';
        }
        buf += '><div>' + teasp.message.getLabel('tk10000539') + '</div></td>'; // 休日を含む２暦日にまたがる労働
        if(confObj.extendDayType){
            buf += '<td><div>' + teasp.message.getLabel('tk10000540') + '</div></td>'; // １暦日扱いとする
        }
        if(f){
            buf += '</tr><tr>';
        }
        if(confObj.leavingAcrossNextDay != '0'){
            buf += '<td><div>' + teasp.message.getLabel('tk10003520') + '</div></td>'; // 2暦日で勤務日種別が異なる24:00以降の入力不可
        }
        buf += '</tr>';
    }
    if(confObj.halfDaiqReckontoWorked){
        buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10010920')           + '</div></td>';           // 半日代休
        buf += '<td><div>' + teasp.message.getLabel('tk10001148')                                     + '</div></td></tr>';      // 勤務時間とみなして勤怠計算を行う
    }
    buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tk10000541')               + '</div></td>';           // 入力制限
    buf += '<td><div>' + teasp.message.getLabel(confObj.pastTimeOnly ? 'tk10000542' : 'tk10001149') + '</div></td></tr>';        // 未来の時刻は入力不可 or 未来の時刻を入力可

    if(confObj.highlightLateEarly){
        buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tk10004510')           + '</div></td>';           // 遅刻・早退を強調表示する
        buf += '<td><div>' + teasp.message.getLabel('tm10010590')                                     + '</div></td></tr>';      // する
    }
    if(confObj.prohibitInputTimeUntilApproved){
        buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tk10003490')           + '</div></td>';           // 休日出勤時の制限
        buf += '<td><div>' + teasp.message.getLabel('tk10003500')                                     + '</div></td></tr>';      // (休日出勤申請または振替申請が)承認されるまで勤務時間の入力不可
    }

    if(confObj.workSystem != teasp.constant.WORK_SYSTEM_MANAGER){
        buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10010240')               + '</div></td>';           // 裁量労働
        buf += '<td><div>' + teasp.message.getLabel(p.useDiscretionary ? 'tm10010250' : 'tm10010260')     + '</div></td></tr>';      // 採用する or 採用しない
    }
    buf += '</table>';
    dojo.byId('empViewConfStdPattern').innerHTML = buf;

    // １日の標準労働時間
//        dojo.byId('empViewConfStdWorkTime').innerHTML = config.getStandardFixTime();

    // 起算日・表記
    dojo.byId('empViewConfStart').innerHTML
        = '<table border="0" cellpadding="0" cellspacing="0">'
        + '<tr><td class="empInfo_scol1"><div>'                 + teasp.message.getLabel('tm10010270') + '</div></td>' // 年の起算月
        + '<td><div>' + teasp.message.getLabel('tm10010470', this.pouch.getInitialDateOfYear()) // {0}月
        + '</div></td><td><div>'                                + teasp.message.getLabel('tm10010300', // 年度表記：{0}
                                                                  teasp.message.getLabel(this.pouch.getMarkOfYear() == 1 ? 'tm10010320' : 'tm10010330')) // 起算月に合わせる or 締め月に合わせる
        + '</div></td></tr>'
        + '<tr><td class="empInfo_scol1"><div>'                 + teasp.message.getLabel('tm10010280') + '</td>' // 月の起算日
        + '<td><div>' + teasp.message.getLabel('tm10010480', this.pouch.getInitialDateOfMonth()) // {0}日
        + '</div></td><td><div>'                                + teasp.message.getLabel('tm10010310', // 月度表記：{0}
                                                                  teasp.message.getLabel(this.pouch.getMarkOfMonth() == 1 ? 'tm10010340' : 'tm10010350')) // 起算日に合わせる or 締め日に合わせる
        + '</div></td></tr>'
        + '<tr><td class="empInfo_scol1"><div>'                 + teasp.message.getLabel('tm10010290') + '</div></td>' // 週の起算日
        + '<td><div>' + teasp.message.getLabel('tm10010490', teasp.util.date.getWeekJp(this.pouch.getInitialDayOfWeek())) // {0}曜日
        + '</div></td><td><div></div></td></tr></table>';

    // 法定労働時間
    buf = '<table border="0" cellpadding="0" cellspacing="0">';
    buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10010360') + '</div></td>'; // 1日
    buf += '<td><div>' + teasp.util.time.timeValue(confObj.legalTimeOfDay) + '</div></td></tr>';
    if(confObj.workSystem == teasp.constant.WORK_SYSTEM_FIX){
        buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10010370') + '</div></td>'; // 週
        buf += '<td><div>' + teasp.util.time.timeValue(confObj.legalTimeOfWeek) + '</div></td></tr>';
    }else if(confObj.workSystem == teasp.constant.WORK_SYSTEM_FLEX){
        var o = teasp.util.searchYearMonthDate(this.pouch.getInitialDateOfMonth(), this.pouch.getMarkOfMonth(), null, this.today);
        var dayCnt = teasp.util.date.daysInRange(o.startDate, o.endDate);
        var legalTimeOfPeriod = (Math.floor((dayCnt / 7) * confObj.legalTimeOfWeek));
        buf += '<tr><td class="empInfo_scol1"><div>';
        buf += teasp.message.getLabel('tm10010380', teasp.util.date.formatDate(o.startDate, 'M/d'), teasp.util.date.formatDate(o.endDate, 'M/d')); // 1ヶ月（{0}～{1}）
        buf += '</div></td>';
        buf += '<td><div>' + teasp.util.time.timeValue(legalTimeOfPeriod) + '</div></td></tr>';
    }else if(confObj.workSystem == teasp.constant.WORK_SYSTEM_MUTATE){
        var o = teasp.util.searchYearMonthDate(this.pouch.getInitialDateOfMonth(), this.pouch.getMarkOfMonth(), null, this.today);
        if(confObj.variablePeriod > 0){
            var sym = teasp.util.getStartMonthOfPeriod(
                            this.pouch.getInitialDateOfYear(),
                            this.pouch.getMarkOfYear(),
                            confObj.variablePeriod, o.yearMonth);
            var eym = teasp.util.date.addYearMonth(sym, confObj.variablePeriod - 1);
            var so = teasp.util.searchYearMonthDate(this.pouch.getInitialDateOfMonth(), this.pouch.getMarkOfMonth(), sym, null);
            var eo = teasp.util.searchYearMonthDate(this.pouch.getInitialDateOfMonth(), this.pouch.getMarkOfMonth(), eym, null);
            var dayCnt = teasp.util.date.daysInRange(so.startDate, eo.endDate);
            var legalTimeOfPeriod = (Math.floor((dayCnt / 7) * (confObj.variablePeriod > 1 ? (40 * 60) : confObj.legalTimeOfWeek)));
            buf += '<tr><td class="empInfo_scol1"><div>';
            if(confObj.variablePeriod == 0){
                buf += teasp.message.getLabel('tm10009020'); // 1週間
            }else if(confObj.variablePeriod == 12){
                buf += teasp.message.getLabel('tm10009030'); // 1年
            }else{
                buf += teasp.message.getLabel('tm10010100', confObj.variablePeriod); // {0}ヶ月
            }
            buf += teasp.message.getLabel('tm10010390', teasp.util.date.formatDate(so.startDate, 'SLA'), teasp.util.date.formatDate(eo.endDate, 'M/d')); // （{0}～{1}の場合）
            buf += '</div></td>';
            buf += '<td><div>' + teasp.util.time.timeValue(legalTimeOfPeriod) + '</div></td></tr>';
        }else{
            buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10010370'); // 週
            buf += '</div></td>';
            buf += '<td><div>' + teasp.util.time.timeValue(confObj.legalTimeOfWeek) + '</div></td></tr>';
        }
    }
    buf += '<tr><td class="empInfo_scol1"><div>' + teasp.message.getLabel('tm10010400') + '</div></td>'; // 深夜時間
    buf += '<td><div>' + this.displayTimeRange(commonObj.nightStartTime, commonObj.nightEndTime) + '</div></td></tr>';
    buf += '</table>';
    dojo.byId('empViewConfLegal').innerHTML = buf;

    // 法定休憩時間のチェック
    dojo.byId('empViewConfLegalRest').innerHTML
        =   (function(rtc){
                var rs = [];
                if(rtc){
                    for(var i = 0 ; i < rtc.length ; i++){
                        if(rtc[i].check){
                            rs.push(teasp.message.getLabel('tm10010750', // 勤務時間 {0} 超の場合、休憩時間を {1} 以上とること
                                    teasp.util.time.timeValue(rtc[i].workTime), teasp.util.time.timeValue(rtc[i].restTime)));
                            if(rtc[i].push){
                                rs.push(teasp.message.getLabel('tm10010751', // 満たさない場合は、出社時刻から {0} 後に強制的に休憩を追加する
                                        teasp.util.time.timeValue(rtc[i].offset)));
                            }
                        }
                    }
                }
                return (rs.length <= 0 ? teasp.message.getLabel('tm10010600') : rs.join('<br/>'));
            }(confObj.restTimeCheck));

    // 休日出勤申請
    dojo.byId('empViewConfHolidayWork').innerHTML = (!confObj.useHolidayWorkFlag ? teasp.message.getLabel('tm10010500') // 使用しない
                                                    : teasp.message.getLabel('tm10010510')
                                                    + ((confObj.useHolidayWorkFlag & 4) ? teasp.message.getLabel('tm10010762') : '')); // （複数申請可（最新の申請が有効））
    // 残業申請
    dojo.byId('empViewConfZangyo').innerHTML    = (!confObj.useOverTimeFlag ? teasp.message.getLabel('tm10010500') // 使用しない
                                                            : teasp.message.getLabel('tm10010510')
                                                    + ((confObj.useOverTimeFlag & 2) ? teasp.message.getLabel('tm10010760') : '')   // 使用する +（申請の時間帯以外の勤務は認めない）
                                                    + ((confObj.useOverTimeFlag & 8) ? teasp.message.getLabel('tm10010761') : '')   // （所定勤務時間に達するまでは申請なしでも認める）
                                                    + (confObj.overTimeBorderTime > 0 ? teasp.message.getLabel('tk10004860'
                                                            , teasp.message.getLabel('tk10004400', teasp.util.time.timeValue(confObj.overTimeBorderTime))) : '') // 以前の勤務は申請なしでも認める
                                                    + ((confObj.useOverTimeFlag & 4) ? teasp.message.getLabel('tm10010762') : '')   // （複数申請可（最新の申請が有効））
                                                    );
    // 早朝勤務申請
    dojo.byId('empViewConfEarlyWork').innerHTML = (!confObj.useEarlyWorkFlag ? teasp.message.getLabel('tm10010500') // 使用しない
                                                    : teasp.message.getLabel('tm10010510')
                                                    + ((confObj.useEarlyWorkFlag & 2) ? teasp.message.getLabel('tm10010760') : '')   // 使用する +（申請の時間帯以外の勤務は認めない）
                                                    + ((confObj.useEarlyWorkFlag & 8) ? teasp.message.getLabel('tm10010761') : '')   // （所定勤務時間に達するまでは申請なしでも認める）
                                                    + (confObj.earlyWorkBorderTime > 0 ? teasp.message.getLabel('tk10004860'
                                                            , teasp.message.getLabel('tk10004410', teasp.util.time.timeValue(confObj.earlyWorkBorderTime))) : '') // 以降の勤務は申請なしでも認める
                                                    + ((confObj.useEarlyWorkFlag & 4) ? teasp.message.getLabel('tm10010762') : '')   // （複数申請可（最新の申請が有効））
                                                    );
    // 遅刻申請
    dojo.byId('empViewConfLateStart').innerHTML = teasp.message.getLabel(!confObj.useLateStartApply ? 'tm10010500' : 'tm10010510'); // 使用しない or 使用する
    // 早退申請
    dojo.byId('empViewConfEarlyEnd').innerHTML  = teasp.message.getLabel(!confObj.useEarlyEndApply  ? 'tm10010500' : 'tm10010510'); // 使用しない or 使用する
    // 振替申請
    dojo.byId('empViewConfExchange').innerHTML  = teasp.message.getLabel(!confObj.useMakeupHoliday  ? 'tm10010500' : 'tm10010510')  // 使用しない or 使用する
                                                    + (confObj.useMakeupHoliday ? (function(el, el2){ // 再振替の期間制限
                                                        if(el === null && el2 === null){
                                                            return '';
                                                        }
                                                        var ss = '', s1 = '', s2 = '';
                                                        ss += '&nbsp;&nbsp;';
                                                        s1 += teasp.message.getLabel('tk10003580'); // 振替休日を取得した日の振替勤務日を選択できる期間
                                                        s1 += teasp.message.getLabel('tk10004140');
                                                        if(el2 == 1){
                                                            s1 += teasp.message.getLabel('tm10010810'); // 翌月度内
                                                        }else if(el2 > 1){
                                                            s1 += teasp.message.getLabel('tm10010820', el2); // {0}ヶ月後の月度最終日まで
                                                        }else{
                                                            s1 += teasp.message.getLabel('tm10010800'); // 当月度内
                                                        }
                                                        ss += teasp.message.getLabel('tm10001680', s1);
                                                        ss += '&nbsp;&nbsp;';
                                                        s2 += teasp.message.getLabel('tk10003590'); // 休日に勤務した日の振替休日を選択できる期間
                                                        s2 += teasp.message.getLabel('tk10004140');
                                                        if(el == 1){
                                                            s2 += teasp.message.getLabel('tm10010810'); // 翌月度内
                                                        }else if(el > 1){
                                                            s2 += teasp.message.getLabel('tm10010820', el); // {0}ヶ月後の月度最終日まで
                                                        }else{
                                                            s2 += teasp.message.getLabel('tm10010800'); // 当月度内
                                                        }
                                                        ss += teasp.message.getLabel('tm10001680', s2);
                                                        return ss;
                                                    }(confObj.exchangeLimit, confObj.exchangeLimit2)) : '');
    // 勤務時間変更申請
    dojo.byId('empViewConfPattern').innerHTML   = (!confObj.changePattern ? teasp.message.getLabel('tm10010500')
                                                    : teasp.message.getLabel('tm10010510') // 使用しない
                                                    + (confObj.changeShift   ? teasp.message.getLabel('tm10010770') : '')   // 使用する +（シフト＝始業・終業時刻変更可）
                                                    + (confObj.changeDayType ? teasp.message.getLabel('tm10010771') : '')   // （平日・休日変更を許可）
                                                    + (confObj.config && confObj.config.empApply && confObj.config.empApply.allowSelectionOfLegalHoliday ? teasp.message.getLabel('tm10010772') : '')   // （法定休日を指定可）
                                                    + (confObj.config && confObj.config.empApply && confObj.config.empApply.prohibitWorkShiftChange      ? teasp.message.getLabel('tm10010773') : '')   // （勤務パターンの指定不可）
                                                    );
    // 直行・直帰申請
    dojo.byId('empViewConfDirect').innerHTML  = teasp.message.getLabel(!confObj.useDirectApply  ? 'tm10010500' : 'tm10010510'); // 使用しない or 使用する
    // 勤怠時刻修正申請
    dojo.byId('empViewConfRevise').innerHTML  = teasp.message.getLabel(!confObj.useReviseTimeApply  ? 'tm10010500' : 'tm10010510'); // 使用しない or 使用する
    // 日次確定申請
    dojo.byId('empViewConfDaily').innerHTML
    =   (function(ud, cw, da, uw, fl){
            var buf = (ud ? teasp.message.getLabel('tm10010510') : teasp.message.getLabel('tm10010500')); // 使用する or 使用しない
            var rs = [];
            if(ud){
                rs.push(teasp.message.getLabel('tm10010980', teasp.message.getLabel(cw ? 'tm10010590' : 'tm10010600'))); // 工数入力時間：チェック{0}
                if(uw){
                    rs.push(teasp.message.getLabel('tm10010990', teasp.message.getLabel(da == 0 ? 'tm10011000' : 'tm10011010'))); // 承認者：{1}、上長、ジョブリーダー
                }
                if(fl){
                    rs.push(teasp.message.getLabel('tk10001150')); // 月次確定の時に日次確定申請漏れのチェックする
                }
            }
            return buf + (rs.length > 0 ? ' ' + teasp.message.getLabel('tm10001680', rs.join(teasp.message.getLabel('tm10001540'))) : '');
        }(confObj.useDailyApply, confObj.checkWorkingTime, confObj.dailyApprover, confObj.useWorkFlow, confObj.checkDailyFixLeak));

    // 承認ワークフロー使用
    dojo.byId('empViewConfWorkFlow').innerHTML  = teasp.message.getLabel(!confObj.useWorkFlow ? 'tm10010500' : 'tm10010510'); // 使用しない or 使用する

    // 時刻表示、補正
    dojo.byId('empViewConfForm').innerHTML
        = '<table border="0" cellpadding="0" cellspacing="0"><tr><td><div>' + teasp.message.getLabel('tm10010410') // 表示形式：
        + '</div></td><td><div>' + confObj.timeFormat
        + '</div></td><td style="padding-left:20px;"><div>' + teasp.message.getLabel('tm10010420') // 丸め
        + '</div></td><td><div>' + teasp.message.getLabel('tm10010430', confObj.timeRound) // {0}分刻み
        + '</div></td></tr></table>';

    // 勤務時間を修正できる社員
    dojo.byId('empViewPermitUpdate').innerHTML  = (function(putl){
        switch(putl){
        case 1:  return teasp.message.getLabel('tk10004440'); // 本人以外（上司、管理者）
        case 2:  return teasp.message.getLabel('tk10004450'); // 管理者のみ
        default: return teasp.message.getLabel('tk10004430'); // 制限なし
        }
    }(confObj.permitUpdateTimeLevel));
};

teasp.view.EmpConfig.prototype.displayValue5 = function(){
    // 代休管理の設定
    var daiqManage = this.pouch.getTargetEmpObj().daiqManage;
    dojo.byId('empViewConfDaiqManage').innerHTML = teasp.message.getLabel(daiqManage.useDaiqManage ? 'tm10010890' : 'tm10010900'); // 行う or 行わない
    dojo.query('.daiq_manage_config').forEach(function(elem){
        dojo.style(elem, 'display', (daiqManage.useDaiqManage ? '' : 'none'));
    }, this);
    if(daiqManage.useDaiqManage){
        // 半日代休
        dojo.byId('empViewConfDaiqHalf').innerHTML = teasp.message.getLabel(daiqManage.useHalfDaiq ? 'tm10010440' : 'tm10010450'); // 許可する or 許可しない
        // 代休取得可能な休日出勤労働時間
        dojo.byId('empViewConfDaiqable').innerHTML
            = (function(dm){
                var rs = [];
                rs.push(teasp.message.getLabel('tm10010780', teasp.util.time.timeValue(dm.daiqAllBorderTime))); // {0} 以上…終日代休可
                if(dm.useHalfDaiq){
                    rs.push(teasp.message.getLabel('tm10010790', teasp.util.time.timeValue(dm.daiqHalfBorderTime))); // {0} 以上…半日代休可
                }
                return rs.join('<br/>');
            }(daiqManage));
        // 代休の有効期限
        dojo.byId('empViewConfDaiqLimit').innerHTML
            = (function(dm){
                if(dm.daiqLimit == 0){
                    return teasp.message.getLabel('tm10010800'); // 当月度内
                }else if(dm.daiqLimit == 1){
                    return teasp.message.getLabel('tm10010810'); // 翌月度内
                }else{
                    return teasp.message.getLabel('tm10010820', dm.daiqLimit); // {0}ヶ月後の月度最終日まで
                }
            }(daiqManage));
        // 休日出勤申請オプション
        dojo.byId('empViewConfHolyWork').innerHTML
            = (function(dm){
                var rs = [];
                rs.push(teasp.message.getLabel(dm.useDaiqReserve      ? 'tm10010830' : 'tm10010840'));
                rs.push(teasp.message.getLabel(dm.useDaiqLegalHoliday ? 'tm10010850' : 'tm10010860'));
                rs.push(teasp.message.getLabel(dm.useRegulateHoliday  ? 'tm10010870' : 'tm10010880'));
                if(dm.noDaiqExchanged){
                    rs.push(teasp.message.getLabel('tk10000592'));
                }
                return rs.join('<br/>');
            }(daiqManage));
    }
};

//teasp.view.EmpConfig.prototype.displayValue6 = function(){
//    // 有休残日数
//    var tbody = dojo.byId('yuqTable').getElementsByTagName('tbody')[0];
//    var yuqList = this.pouch.getYuqRemainObjs();
//
//    var provideDays = 0, provideTime = 0, spendDays = 0, spendTime = 0, remainDays = 0, remainTime = 0;
//
//    for(var i = 0 ; i < yuqList.length ; i++){
//        var yq = yuqList[i];
//        if(teasp.util.date.compareDate(this.today, yq.limitDate) >= 0
//        || teasp.util.date.compareDate(this.today, yq.startDate) < 0
//        || yq.remainMinutes <= 0){
//            continue;
//        }
//        var row = dojo.create('tr', { className: ((i%2)==0 ? 'even' : 'odd') }, tbody);
//        dojo.create('div', { innerHTML: teasp.util.date.formatDate(yq.startDate, 'SLA') }, dojo.create('td', { style: 'width: 82px;text-align:center;' }, row));
//        dojo.create('div', { innerHTML: teasp.util.date.formatDate(yq.limitDate, 'SLA') }, dojo.create('td', { style: 'width: 82px;text-align:center;' }, row));
//        dojo.create('div', { innerHTML: teasp.util.date.formatDate(yq.date, 'SLA')      }, dojo.create('td', { style: 'width: 82px;text-align:center;' }, row));
//        buf = teasp.message.getLabel('tm10010480', yq.provideDays) // {0}日
//                + (yq.provideTime > 0 ? '+' + teasp.util.time.timeValue(yq.provideTime) : '');
//        dojo.create('div', { innerHTML: buf }, dojo.create('td', { style: 'width: 74px;text-align:center;' }, row));
//        buf = teasp.message.getLabel('tm10010480', yq.spendDays) // {0}日
//                + (yq.spendTime > 0 ? '+' + teasp.util.time.timeValue(yq.spendTime) : '');
//        dojo.create('div', { innerHTML: buf }, dojo.create('td', { style: 'width: 74px;text-align:center;' }, row));
//        buf = teasp.message.getLabel('tm10010480', yq.remainDays) // {0}日
//                + (yq.remainTime > 0 ? '+' + teasp.util.time.timeValue(yq.remainTime) : '');
//        dojo.create('div', { innerHTML: buf }, dojo.create('td', { style: 'width: 74px;text-align:center;' }, row));
//        dojo.create('div', { innerHTML: yq.subject }, dojo.create('td', { style: 'width: auto;text-align:left;border-right:none;word-break:break-all;' }, row));
//
//        provideDays += yq.provideDays;
//        provideTime += yq.provideTime;
//        spendDays   += yq.spendDays;
//        spendTime   += yq.spendTime;
//        remainDays  += yq.remainDays;
//        remainTime  += yq.remainTime;
//    }
//    var row = dojo.create('tr', { height: '2px' }, tbody);
//    row.style.borderTop = '1px solid #8C8E8C';
//    dojo.create('td', { colspan: '7' }, row);
//    row = dojo.create('tr', null, tbody);
//    var cell = dojo.create('td', { colSpan: 3 }, row);
//    cell.style.textAlign = 'left';
//    var div = dojo.create('div', { innerHTML: teasp.message.getLabel('total_label') }, cell); // 合計
//    div.style.marginLeft = '8px';
//
//    buf = teasp.message.getLabel('tm10010480', provideDays) // {0}日
//            + (provideTime > 0 ? '+' + teasp.util.time.timeValue(provideTime) : '');
//    div = dojo.create('div', { innerHTML: buf  }, dojo.create('td', { width: '74px' }, row));
//    div.style.textAlign = 'center';
//
//    buf = teasp.message.getLabel('tm10010480', spendDays) // {0}日
//            + (spendTime > 0 ? '+' + teasp.util.time.timeValue(spendTime) : '');
//    div = dojo.create('div', { innerHTML: buf  }, dojo.create('td', { width: '74px' }, row));
//    div.style.textAlign = 'center';
//
//    buf = teasp.message.getLabel('tm10010480', remainDays) // {0}日
//            + (remainTime > 0 ? '+' + teasp.util.time.timeValue(remainTime) : '');
//    div = dojo.create('div', { innerHTML: buf  }, dojo.create('td', { width: '74px' }, row));
//    div.style.textAlign = 'center';
//
//    cell = dojo.create('td', { width: 'auto' }, row);
//    cell.style.textAlign = 'left';
//    cell.style.borderRight = 'none';
//};
//
//teasp.view.EmpConfig.prototype.displayValue7 = function(){
//    // 代休管理
//    dojo.query('.daiq_admin_area').forEach(function(elem){
//        dojo.style(elem, 'display', (this.pouch.isUseDaiqManage() ? '' : 'none'));
//    }, this);
//    if(this.pouch.isUseDaiqManage()){
//        // 代休関連情報
//        var daiqZan = teasp.data.Pouch.getDaiqZan(this.pouch.getStocks(), this.today); // 今月取得可能な代休の残日数を取得
//        dojo.byId('empViewDaiqSect').innerHTML = teasp.message.getLabel('tm10010651', daiqZan.zan, teasp.util.date.formatDate(this.today, 'SLA')); // ■ 代休取得可能日数 {0} 日（{1} 時点）
//        dojo.byId('empViewDaiqZan').innerHTML = teasp.message.getLabel('tm10010720', 10); // 休日出勤・代休取得状況（直近{0}件）
////        dojo.query('.daiq_history').forEach(function(elem){
////            dojo.style(elem, 'display', (daiqZan.history.length > 0 ? '' : 'none'));
////        }, this);
//        var tbody = dojo.byId('daiqTable').getElementsByTagName('tbody')[0];
//        if(daiqZan.history.length <= 0){
//            var row = dojo.create('tr', { className: 'even' }, tbody);
//            dojo.create('div', {
//                innerHTML: teasp.message.getLabel('tm10011030')
//            }, dojo.create('td', { colSpan: '6', style: 'text-align:left;' }, row));
//        }else{
//            var cnt = 0;
//            var beg = (daiqZan.history.length > 10 ? daiqZan.history.length - 10 : 0);
//            for(var i = beg ; i < daiqZan.history.length ; i++){
//                var h = daiqZan.history[i];
//                var row = dojo.create('tr', { className: (((cnt++)%2)==0 ? 'even' : 'odd') }, tbody);
//                dojo.create('div', { innerHTML: h.date       }, dojo.create('td', { style: 'width: 82px;text-align:center;' }, row));
//                var div = dojo.create('div', { innerHTML: h.subject }, dojo.create('td', { width:'112px' }, row));
//                div.style.textAlign = 'left';
//                div = dojo.create('div', { innerHTML: h.plus       }, dojo.create('td', { width: '74px' }, row));
//                div.style.textAlign = 'center';
//                div = dojo.create('div', { innerHTML: h.minus      }, dojo.create('td', { width: '74px' }, row));
//                div.style.textAlign = 'center';
//                div = dojo.create('div', { innerHTML: h.limitDate  }, dojo.create('td', { width: '82px' }, row));
//                div.style.textAlign = 'center';
//                var cell = dojo.create('td', { width:'auto'  }, row);
//                cell.style.borderRight = 'none';
//                div = dojo.create('div', { innerHTML: h.status     }, cell);
//                div.style.textAlign = 'left';
//                div.style.wordBreak = 'break-all';
//            }
//        }
//    }
//};
//
///**
// * 積休の残日数、明細エリア作成
// */
//teasp.view.EmpConfig.prototype.displayValue8 = function(){
//    var baseRow = dojo.byId('empViewConfArea');
//    var manageNames = this.pouch.getHolidayManageNames();
//    for(var x = 0 ; x < manageNames.length ; x++){
//        var manageName = manageNames[x];
//        var stockZan = teasp.data.Pouch.getStockZan(this.pouch.getStocks(), manageName, this.today); // 今月取得可能な代休の残日数を取得
//        if(stockZan.history.length <= 0){
//            continue;
//        }
//        var cell = dojo.create('td', {
//            innerHTML: teasp.message.getLabel('tm10010652', manageName, stockZan.zan, teasp.util.date.formatDate(this.today, 'SLA')) // ■ {0}取得可能日数 {1} 日（{2} 時点）
//        }, dojo.create('tr', null, baseRow, 'before'));
//        cell.style.paddingBottom = '2px';
//        cell.style.textAlign = 'left';
//        cell = dojo.create('td', null, dojo.create('tr', null, baseRow, 'before'));
//        cell.style.padding = '5px 2px 2px 4px';
//        cell.style.textAlign = 'left';
//        dojo.create('span', { innerHTML: teasp.message.getLabel('tm10010721', manageName, 10) }, cell);
//        cell = dojo.create('td', null, dojo.create('tr', null, baseRow, 'before'));
//        cell.style.paddingBottom = '8px';
//        var table = dojo.create('table', { className: 'atk_r_table' }, cell);
//        table.style.width = '100%';
//        var thead = dojo.create('thead', null, table);
//        var row = dojo.create('tr', null, thead);
//        dojo.create('td', { className: 'head', width: '82px', innerHTML: teasp.message.getLabel('date_head')    }, row); // 日付
//        dojo.create('td', { className: 'head', width:'102px', innerHTML: teasp.message.getLabel('subject_head') }, row); // 事柄
//        dojo.create('td', { className: 'head', width: '74px', innerHTML: teasp.message.getLabel('tm10011040')   }, row); // 付与
//        dojo.create('td', { className: 'head', width: '74px', innerHTML: teasp.message.getLabel('tm10011050')   }, row); // 消化
//        dojo.create('td', { className: 'head', width: '82px', innerHTML: teasp.message.getLabel('yuqLimitDate_head') }, row); // 失効日
//        cell = dojo.create('td', { className: 'head', width: 'auto', innerHTML: teasp.message.getLabel('statusj_head') }, row); // 状況
//        cell.style.borderRight = 'none';
//        row = dojo.create('tr', { height: '1px' }, thead);
//        row.style.borderBottom = '1px solid #8C8E8C';
//        cell = dojo.create('td', { colSpan: '6' }, row);
//        var tbody = dojo.create('tbody', null, table);
//        var cnt = 0;
//        var beg = (stockZan.history.length > 10 ? stockZan.history.length - 10 : 0);
//        for(var i = beg ; i < stockZan.history.length ; i++){
//            var h = stockZan.history[i];
//            row = dojo.create('tr', { className: (((cnt++)%2)==0 ? 'even' : 'odd') }, tbody);
//            dojo.create('div', { innerHTML: h.date       }, dojo.create('td', { width: '82px' }, row));
//            var div = dojo.create('div', { innerHTML: h.subject    }, dojo.create('td', { width: '102px'  }, row));
//            div.style.textAlign = 'left';
//            div = dojo.create('div', { innerHTML: h.plus       }, dojo.create('td', { width: '74px' }, row));
//            div.style.textAlign = 'center';
//            div = dojo.create('div', { innerHTML: h.minus      }, dojo.create('td', { width: '74px' }, row));
//            div.style.textAlign = 'center';
//            div = dojo.create('div', { innerHTML: h.limitDate  }, dojo.create('td', { width: '82px' }, row));
//            div.style.textAlign = 'center';
//            cell = dojo.create('td', { width: 'auto' }, row);
//            cell.style.borderRight = 'none';
//            div = dojo.create('div', { innerHTML: h.status }, cell);
//            div.style.textAlign = 'left';
//            div.style.wordBreak = 'break-all';
//        }
//    }
//};
//
///**
// * 休暇明細エリア作成
// */
//teasp.view.EmpConfig.prototype.displayValue9 = function(){
//    var hh = this.pouch.getHolidayHistory();
//    var baseRow = dojo.byId('empViewConfArea');
//    var cell = dojo.create('td', {
//        innerHTML: teasp.message.getLabel('tm10010681', teasp.util.date.formatDate(hh.startDate, 'SLA')) // ■ 休暇明細
//    }, dojo.create('tr', null, baseRow, 'before'));
//    cell.style.paddingBottom = '2px';
//    cell.style.textAlign = 'left';
//    cell = dojo.create('td', null, dojo.create('tr', null, baseRow, 'before'));
//    cell.style.paddingBottom = '8px';
//    var table = dojo.create('table', { className: 'atk_r_table' }, cell);
//    table.style.width = '100%';
//    var thead = dojo.create('thead', null, table);
//    var row = dojo.create('tr', null, thead);
//    dojo.create('td', { className: 'head', width: '96px', innerHTML: '日付'     }, row); // 日付
//    dojo.create('td', { className: 'head', width:'160px', innerHTML: '事柄'     }, row); // 事柄
//    dojo.create('td', { className: 'head', width: '74px', innerHTML: '取得日数' }, row); // 取得日数
//    cell = dojo.create('td', { className: 'head', width: 'auto', innerHTML: '備考' }, row); // 備考
//    cell.style.borderRight = 'none';
//    row = dojo.create('tr', { height: '1px' }, thead);
//    row.style.borderBottom = '1px solid #8C8E8C';
//    dojo.create('td', { colSpan: '4' }, row);
//
//    var tbody = dojo.create('tbody', null, table);
//    if(hh.list.length <= 0){
//        row = dojo.create('tr', { className: 'even' }, tbody);
//        dojo.create('div', {
//            innerHTML: teasp.message.getLabel('tm10011030')
//        }, dojo.create('td', { colSpan: '4', style: 'text-align:left;' }, row));
//    }else{
//        for(var i = 0 ; i < hh.list.length ; i++){
//            var h = hh.list[i];
//            row = dojo.create('tr', { className: ((i%2)==0 ? 'even' : 'odd') }, tbody);
//            dojo.create('div', {
//                innerHTML: (h.startDate != h.endDate ? teasp.util.date.formatDate(h.startDate, 'SLA')
//                                + '<br/> ' + teasp.message.getLabel('wave_label') + ' ' + teasp.util.date.formatDate(h.endDate, 'SLA')
//                                : teasp.util.date.formatDate(h.startDate, 'SLA'))
//            }, dojo.create('td', { width: '96px' }, row));
//            cell = dojo.create('td', { width: '160px' }, row);
//            cell.style.textAlign = 'left';
//            dojo.create('div', { innerHTML: h.subject }, cell);
//            var div = dojo.create('div', {
//                innerHTML: (h.days > 0 ? teasp.message.getLabel('tm10010480', h.days) : '') + ' '
//                            + (h.time > 0 ? teasp.util.time.timeValue(h.time) : '')
//            }, dojo.create('td', { width: '74px' }, row));
//            div.style.textAlign = 'center';
//            cell = dojo.create('td', { width: 'auto' }, row);
//            cell.style.textAlign = 'left';
//            cell.style.borderRight = 'none';
//            cell.style.wordBreak = 'break-all';
//            dojo.create('div', { innerHTML: h.note }, cell);
//        }
//    }
//};

/**
 * 変形労働時間制の表示文字列を返す
 *
 * @param {number} variablePeriod 期間
 * @return {string} 表示文字列
 */
teasp.view.EmpConfig.prototype.getVariablePeriodJp = function(variablePeriod){
    var pd;
    if(variablePeriod == 0){
        pd = teasp.message.getLabel('tm10009020'); // 1週間
    }else if(variablePeriod == 12){
        pd = teasp.message.getLabel('tm10009030'); // 1年
    }else{
        pd = teasp.message.getLabel('tm10010100', variablePeriod); // {0}ヶ月
    }
    return teasp.message.getLabel('tm10010070', pd);
};

/**
 * 時間範囲の表示文字列を返す
 *
 * @param {number} from 開始時刻
 * @param {number} to 終了時刻
 * @return {string} 表示文字列
 */
teasp.view.EmpConfig.prototype.displayTimeRange = function(from, to){
    if(typeof(from) == 'number' && typeof(to) == 'number'){
        return teasp.message.getLabel('tm10010460', teasp.util.time.timeValue(from), teasp.util.time.timeValue(to)); // {0}～{1}
    }
    return '';
};

/**
 * 勤務パターン情報の表を出力
 *
 * @param {Array.<Object>} patterns 勤務パターンオブジェクトの配列
 * @param {string} areaId 表を貼り付ける要素ID
 */
teasp.view.EmpConfig.prototype.createPatternTable = function(patterns, areaId){
    var table, tbody, row, cell, i, p, o;

    table = document.createElement('table');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('cellpadding', '0');
    table.setAttribute('border', '0');
    table.className = 'pattern_table';

    tbody = document.createElement('tbody');
    table.appendChild(tbody);

    var changeShift = (this.pouch.isUseChangePattern() && this.pouch.isUseChangeShift());

    for(i = 0 ; i < patterns.length ; i++){
        p = patterns[i];

        row = tbody.insertRow(-1);
        row.className = 'atk_r_row_' + ((i%2)===0 ? 'even' : 'odd') + (i > 0 ? ' pattern_border' : '');

        // 勤務時間の延長・短縮
        var prohibits = [];
        if(changeShift){
            if(p.prohibitChangeWorkTime){
                prohibits.push(teasp.message.getLabel('tk10003850')); // 平日勤務
            }
            if(p.prohibitChangeHolidayWorkTime){
                prohibits.push(teasp.message.getLabel('tk10003860')); // 休日出勤日
            }
            if(p.prohibitChangeExchangedWorkTime){
                prohibits.push(teasp.message.getLabel('tk10003870')); // 休日の振替勤務日
            }
        }

        // 勤務パターン名
        cell = row.insertCell(-1);
        cell.className = 'pattern_col1';
        cell.rowSpan = (p.useHalfHoliday ? (p.useHalfHolidayRestTime ? 10 : 8) : 6) + (changeShift ? (prohibits.length != 3 ? 3 : 2) : 0);
        cell.innerHTML = '<div>' + p.name + '</div>';

        // 始業・終業
        cell = row.insertCell(-1);
        cell.className = 'pattern_col2';
        cell.innerHTML = '<div>' + teasp.message.getLabel('tm10010170') + '</div>';
        cell = row.insertCell(-1);
        cell.className = 'pattern_col3';
        cell.innerHTML = '<div>' + teasp.message.getLabel('tm10010460', // {0}～{1}
                teasp.util.time.timeValue(p.stdStartTime), teasp.util.time.timeValue(p.stdEndTime)) + '</div>';

        var buf = '';
        if(p.restTimes){
            buf += teasp.view.EmpConfig.getRestTimes(p.restTimes);
        }
        // 休憩時間
        row = tbody.insertRow(-1);
        row.className = 'atk_r_row_' + ((i%2)===0 ? 'even' : 'odd');

        cell = row.insertCell(-1);
        cell.className = 'pattern_col2';
        cell.innerHTML = '<div>' + teasp.message.getLabel('restTime_label') + '</div>'; // 休憩時間
        cell = row.insertCell(-1);
        cell.className = 'pattern_col3';
        cell.innerHTML = '<div>' + (buf.length > 0 ? buf : teasp.message.getLabel('tm10010520')) + '</div>'; // 設定されていません

        // 1日の標準労働時間
        row = tbody.insertRow(-1);
        row.className = 'atk_r_row_' + ((i%2)===0 ? 'even' : 'odd');

        cell = row.insertCell(-1);
        cell.className = 'pattern_col2';
        cell.innerHTML = '<div>' + teasp.message.getLabel('fixTimeOfDay_label') + '</div>'; // 所定労働時間
        cell = row.insertCell(-1);
        cell.className = 'pattern_col3';
        cell.innerHTML = '<div>' + teasp.util.time.timeValue(p.standardFixTime) + '</div>'; // 所定労働時間

        // 半日休暇
        row = tbody.insertRow(-1);
        row.className = 'atk_r_row_' + ((i%2)===0 ? 'even' : 'odd');

        cell = row.insertCell(-1);
        cell.className = 'pattern_col2';
        cell.innerHTML = '<div>' + teasp.message.getLabel('tm10010190') + '</div>'; // 半日休暇
        cell = row.insertCell(-1);
        cell.className = 'pattern_col3';
        cell.innerHTML = '<div>' + teasp.message.getLabel(p.useHalfHoliday ? 'tm10010200' : 'tm10010210') + '</div>'; // 取得可 or 取得不可

        if(p.useHalfHoliday){
            buf = teasp.message.getLabel('tm10010230', // 午前：{0}～{1}、午後：{2}～{3}
                                teasp.util.time.timeValue(p.amHolidayStartTime),
                                teasp.util.time.timeValue(p.amHolidayEndTime),
                                teasp.util.time.timeValue(p.pmHolidayStartTime),
                                teasp.util.time.timeValue(p.pmHolidayEndTime));
            // 半休適用時間
            row = tbody.insertRow(-1);
            row.className = 'atk_r_row_' + ((i%2)===0 ? 'even' : 'odd');

            cell = row.insertCell(-1);
            cell.className = 'pattern_col2';
            cell.innerHTML = '<div>' + teasp.message.getLabel('tm10010220') + '</div>'; // 半休適用時間
            cell = row.insertCell(-1);
            cell.className = 'pattern_col3';
            cell.innerHTML = '<div>' + buf + '</div>'; // 半休適用時間

            row = tbody.insertRow(-1);
            row.className = 'atk_r_row_' + ((i%2)===0 ? 'even' : 'odd');
            cell = row.insertCell(-1);
            cell.className = 'pattern_col2';
            cell.innerHTML = '<div>' + teasp.message.getLabel('tf10009700') + '</div>'; // 半休取得時の休憩時間
            cell = row.insertCell(-1);
            cell.className = 'pattern_col3';
            cell.innerHTML = '<div>' + teasp.message.getLabel(p.useHalfHolidayRestTime ? 'tf10009710' : 'tf10009711') + '</div>'; // 適用する/しない

            if(p.useHalfHolidayRestTime){
                row = tbody.insertRow(-1);
                row.className = 'atk_r_row_' + ((i%2)===0 ? 'even' : 'odd');
                cell = row.insertCell(-1);
                cell.className = 'pattern_col2';
                cell.innerHTML = '<div>' + teasp.message.getLabel('tf10009720') + '</div>'; // 午前半休時休憩時間
                cell = row.insertCell(-1);
                cell.className = 'pattern_col3';
                cell.innerHTML = '<div>' + teasp.view.EmpConfig.getRestTimes(p.amHolidayRestTimes) + '</div>';

                row = tbody.insertRow(-1);
                row.className = 'atk_r_row_' + ((i%2)===0 ? 'even' : 'odd');
                cell = row.insertCell(-1);
                cell.className = 'pattern_col2';
                cell.innerHTML = '<div>' + teasp.message.getLabel('tf10009730') + '</div>'; // 午後半休時休憩時間
                cell = row.insertCell(-1);
                cell.className = 'pattern_col3';
                cell.innerHTML = '<div>' + teasp.view.EmpConfig.getRestTimes(p.pmHolidayRestTimes) + '</div>';
            }
        }

        // 裁量労働制
        row = tbody.insertRow(-1);
        row.className = 'atk_r_row_' + ((i%2)===0 ? 'even' : 'odd');

        cell = row.insertCell(-1);
        cell.className = 'pattern_col2';
        cell.innerHTML = '<div>' + teasp.message.getLabel('tm10010240') + '</div>'; // 裁量労働
        cell = row.insertCell(-1);
        cell.className = 'pattern_col3';
        cell.innerHTML = '<div>' + teasp.message.getLabel(p.useDiscretionary ? 'tm10010250' : 'tm10010260') + '</div>'; // 採用する or 採用しない

        // 深夜手当
        row = tbody.insertRow(-1);
        row.className = 'atk_r_row_' + ((i%2)===0 ? 'even' : 'odd');

        cell = row.insertCell(-1);
        cell.className = 'pattern_col2';
        cell.innerHTML = '<div>' + teasp.message.getLabel('nightWorkEx_label') + '</div>'; // 深夜労働割増
        cell = row.insertCell(-1);
        cell.className = 'pattern_col3';
        cell.innerHTML = '<div>' + teasp.message.getLabel(p.igonreNightWork ? 'tm10010150' : 'tm10010140') + '</div>'; // なし or あり

        if(changeShift){
            // 勤務時間の延長・短縮
            row = dojo.create('tr', { className : 'atk_r_row_' + ((i%2)===0 ? 'even' : 'odd') }, tbody);
            dojo.create('div', {
                innerHTML: teasp.message.getLabel('tk10004870')  // 勤務時間の延長・短縮
            }, dojo.create('td', { className: 'pattern_col2' }, row));
            cell = dojo.create('td', { className : 'pattern_col3' }, row);

            if(prohibits.length == 3){
                dojo.create('div', { innerHTML: teasp.message.getLabel('tk10004890') }, cell); // 禁止
            }else if(prohibits.length > 0){
                dojo.create('div', { innerHTML: teasp.message.getLabel('tk10004880', prohibits.join(teasp.message.getLabel('tm10001540'))) }, cell); // {0}は禁止
            }else{
                dojo.create('div', { innerHTML: teasp.message.getLabel('tm10010440') }, cell); // 許可する
            }
            if(prohibits.length != 3){ // 禁止以外
                // 所定勤務時間の変更
                row = dojo.create('tr', { className : 'atk_r_row_' + ((i%2)===0 ? 'even' : 'odd') }, tbody);
                dojo.create('div', {
                    innerHTML: teasp.message.getLabel(p.useDiscretionary ? 'tk10004877' : 'tk10004871')  // みなし労働時間の変更 or 所定勤務時間の変更
                }, dojo.create('td', { className: 'pattern_col2' }, row));
                dojo.create('div', {
                    innerHTML: teasp.message.getLabel(p.workTimeChangesWithShift ? (p.useDiscretionary ? 'tk10004878' : 'tk10004872') : 'tk10004873') // 勤務時間の変更に連動する or しない
                }, dojo.create('td', { className: 'pattern_col3' }, row));
            }
            // 所定休憩と半休の時間帯
            row = dojo.create('tr', { className : 'atk_r_row_' + ((i%2)===0 ? 'even' : 'odd') }, tbody);
            dojo.create('div', {
                innerHTML: teasp.message.getLabel('tk10004874')  // 所定休憩と半休の時間帯
            }, dojo.create('td', { className: 'pattern_col2' }, row));
            dojo.create('div', {
                innerHTML: teasp.message.getLabel(p.enableRestTimeShift ? 'tk10004875' : 'tk10004876') // 開始時刻変更に合わせてずらす or 開始時刻変更をしても固定
            }, dojo.create('td', { className: 'pattern_col3' }, row));
        }
    }
    dojo.byId(areaId).appendChild(table);
};

/**
 * 休暇情報の表を出力
 *
 * @param {Array.<Object>} holidays 勤務パターンオブジェクトの配列
 * @param {string} areaId 表を貼り付ける要素ID
 */
teasp.view.EmpConfig.prototype.createHolidayTable = function(holidays, areaId){
    var table, tbody, row, cell, i;

    table = document.createElement('table');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('cellpadding', '0');
    table.setAttribute('border', '0');
    table.className = 'holiday_table';

    tbody = document.createElement('tbody');
    table.appendChild(tbody);
    for(i = 0 ; i < holidays.length ; i++){
        var h = holidays[i];
        row = tbody.insertRow(-1);
        row.className = 'even' + (i > 0 ? ' holiday_border' : '');
        // 休暇名
        cell = row.insertCell(-1);
        cell.className = 'holiday_col1';
        cell.style.borderTop = '1px dashed #8F8F8F';
        cell.innerHTML = '<div>' + h.name + '</div>';
        var nameCell = cell;
        // 給与の有無
        cell = row.insertCell(-1);
        cell.className = 'holiday_col2';
        cell.style.borderTop = '1px dashed #8F8F8F';
        var htype = '';
        if(h.type == teasp.constant.HOLIDAY_TYPE_PAID){
            htype = teasp.message.getLabel('tm10010530'); // 有給
        }else if(h.type == teasp.constant.HOLIDAY_TYPE_FREE){
            htype = teasp.message.getLabel('tm10010540'); // 無給
        }else{
            htype = teasp.message.getLabel('tm10010550'); // 代休
        }
        cell.innerHTML = '<div>' + htype + '</div>';
        // 休暇範囲
        cell = row.insertCell(-1);
        cell.className = 'holiday_col2';
        cell.style.borderTop = '1px dashed #8F8F8F';
        var hrange = '';
        if(h.range == teasp.constant.RANGE_AM){
            hrange += teasp.message.getLabel('holidayAm_label');  // 午前半休
        }else if(h.range == teasp.constant.RANGE_PM){
            hrange += teasp.message.getLabel('holidayPm_label');  // 午後半休
        }else if(h.range == teasp.constant.RANGE_TIME){
            hrange += teasp.message.getLabel('tm10010560');       // 時間単位休
        }else{
            hrange += teasp.message.getLabel('holidayDay_label'); // 終日休
        }
        cell.innerHTML = '<div>' + hrange + '</div>';
        // 有給消化
        cell = row.insertCell(-1);
        cell.className = 'holiday_col2';
        cell.style.borderTop = '1px dashed #8F8F8F';
        cell.innerHTML = '<div>' + teasp.message.getLabel('tm10010570', teasp.message.getLabel(h.yuqSpend ? 'tm10010590' : 'tm10010600')) + '</div>'; // 有休消化：{0}
        // 出勤率算定
        cell = row.insertCell(-1);
        cell.className = 'holiday_col2';
        cell.style.borderTop = '1px dashed #8F8F8F';
        cell.innerHTML = '<div>' + teasp.message.getLabel('tm10010580', teasp.message.getLabel(h.isWorking ? 'tm10010610' : 'tm10010620')) + '</div>'; // 出勤率算定：{0}

//        row = tbody.insertRow(-1);
//        row.className = 'odd';
        // 日数管理
        cell = row.insertCell(-1);
        cell.className = 'holiday_col3';
        cell.style.borderTop = '1px dashed #8F8F8F';
        cell.innerHTML = '<div>' + teasp.message.getLabel('tm10010581', teasp.message.getLabel(h.managed ? 'tm10010590' : 'tm10010600'))
//                        + (h.managed ? teasp.message.getLabel('tm10010582', h.manageName) : '')
                        + '</div>'; // 日数管理：{0}

        if(h.description){
            nameCell.rowSpan = "2";
            row = tbody.insertRow(-1);
            row.className = 'even';
            cell = row.insertCell(-1);
            cell.colSpan = '5';
            cell.className = 'holiday_col4';
            cell.innerHTML = '<div>' + (h.description || '').replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;') + '</div>';
        }
    }
    dojo.byId(areaId).appendChild(table);
};

teasp.view.EmpConfig.getRestTimes = function(restTimes){
    var rests = [];
    dojo.forEach(restTimes || [], function(o){
        rests.push(teasp.message.getLabel('tm10010460', teasp.util.time.timeValue(o.from), teasp.util.time.timeValue(o.to)));
    });
    return (rests.length ? rests.join(', ') : teasp.message.getLabel('tm10010150')); // なし
};
