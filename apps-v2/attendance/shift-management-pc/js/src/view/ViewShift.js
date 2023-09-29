teasp.provide('teasp.view.Shift');

/**
 * シフト管理画面
 *
 * @constructor
 * @extends {teasp.view.Base}
 * @author DCI小島
 */
teasp.view.Shift = function(){
    this.startCell = null;
    this.localObj = {};
    this.pMenu = null;
    this.empSelectDialog = null;
    this.empDayDialog = null;
    this.cacheEmps = {};
    this.printFlag = false;
    this.eventDayCells = {};
    this.temporaryShiftId = [];
    this.deptKeys = [];
    this.importResultFlag = false;
    this.currentRangeType = 0;
    // 社員別集計項目
    this.sumColumnsFix = [
       { name: '勤務日' 		, headId: 'workDays', headClassName: 'sumHoriz1Cell' },
       { name: '休日'			, headId: 'holiDays', headClassName: 'sumHoriz1Cell' },
       { name: '有休計画付与日' , headId: 'offDays' , headClassName: 'sumHoriz1Cell' }
    ];
    this.sumColumns = [];
    this.shiftImport = null;
};

teasp.view.Shift.prototype = new teasp.view.Base();

teasp.view.Shift.prototype.contact = function(req, onSuccess, nowait){
    teasp.action.contact.remoteMethods(
        (is_array(req) ? req : [req]),
        {
            errorAreaId : (req.errorAreaId ? req.errorAreaId : this.errorAreaId),
            nowait		: (nowait || false)
        },
        onSuccess,
        null,
        this
    );
};

teasp.view.Shift.prototype.contactForUpdate = function(req, onSuccess, onFailure, nowait){
    teasp.action.contact.remoteMethods(
        (is_array(req) ? req : [req]),
        {
            errorAreaId : (req.errorAreaId ? req.errorAreaId : this.errorAreaId),
            nowait		: (nowait || false)
        },
        onSuccess,
        onFailure,
        this
    );
};

teasp.view.Shift.prototype.getPermission = function(){
    var user = globalLoadRes.user;
    var emp = (globalLoadRes.emp || null);
    var flag = 0;
    if(user.Profile.PermissionsModifyAllData){
        flag |= teasp.constant.P_SS;
    }
    if(emp){
        if(emp.IsAdmin__c)		   flag |= teasp.constant.P_AD;
        if(emp.IsAllEditor__c)	   flag |= teasp.constant.P_AE;
        if(emp.IsAllReader__c)	   flag |= teasp.constant.P_AR;
        if(emp.IsExpAdmin__c)	   flag |= teasp.constant.P_AX;
    }
    var allReader = 0;
    allReader |= (flag & teasp.constant.P_SS);
    allReader |= (flag & teasp.constant.P_AD);
    allReader |= (flag & teasp.constant.P_AE);
    allReader |= (flag & teasp.constant.P_AR);
    allReader &= ~teasp.constant.P_E;

    var allEditor = 0;
    allEditor |= (flag & teasp.constant.P_SS);
    allEditor |= (flag & teasp.constant.P_AD);
    allEditor |= (flag & teasp.constant.P_AE);

    return {
        user	  : user,
        emp 	  : emp,
        flag	  : flag,
        allReader : allReader,
        allEditor : allEditor
    };
};

/**
 * 画面初期化
 *
 * @param {Function=} onSuccess レスポンス正常受信時の処理
 * @param {Function=} onFailure レスポンス異常受信時の処理
 */
teasp.view.Shift.prototype.init = function(onSuccess, onFailure){
    if(teasp.isSforce()){
        dojo.style('big_area', 'margin', '0px');
    }

    dojo.style('shiftDummy', 'display', '');
    var tbody = dojo.query('#shiftDummy tbody')[0];
    this.scrollW = tbody.offsetWidth - tbody.clientWidth;
    dojo.style('shiftDummy', 'display', 'none');

    dojo.style('shiftCsvImport1', 'display', (globalLoadRes.enableShiftCsvImport ? '' : 'none'));
    dojo.style('shiftCsvImport2', 'display', (globalLoadRes.enableShiftCsvImport ? '' : 'none'));
    dojo.style('shiftImportToolDL', 'display', (globalLoadRes.enableShiftImportToolDownload ? '' : 'none'));

    // シフト登録ツールはダウンロードリンクを差し替え状態により文言を変更
    if (globalLoadRes.enableShiftImportToolDownload) {
        // ダウンロードリンクを差し替えあり
        if (globalLoadRes.shiftImportToolCustomURL) {
            dojo.byId('shiftImportToolDL').value = 'シフト登録ツールをダウンロードする';
        }
        // ダウンロードリンクを差し替えなし
        else {
            dojo.byId('shiftImportToolDL').value = '最新のシフト登録ツール(v' + globalLoadRes.shiftImportToolVersion + ')をダウンロードする';
        }
    }

    this.localObj.depts = globalLoadRes.depts;
    this.localObj.titles = [];
    for(var i = 0 ; i < globalLoadRes.titles.length ; i++){
        var t = globalLoadRes.titles[i];
        this.localObj.titles.push(t.Title__c);
    }
    this.localObj.titles = this.localObj.titles.sort(function(a, b){
        if(a == b){
            return 0;
        }
        return (a < b ? -1 : 1);
    });
    var emp = globalLoadRes.emp;
    var d = new Date();
    dijit.byId('monYear' ).setValue(d.getFullYear());
    dijit.byId('monMonth').setValue(d.getMonth() + 1);
    var ym = d.getFullYear() * 100 + (d.getMonth() + 1);
    var sd, ed;
    if(emp){
        var od = teasp.util.searchYearMonthDate(emp.EmpTypeId__r.ConfigBaseId__r.InitialDateOfMonth__c
                , emp.EmpTypeId__r.ConfigBaseId__r.MarkOfMonth__c
                , ym);
        sd = teasp.util.date.parseDate(od.startDate);
        ed = teasp.util.date.parseDate(od.endDate);
    }else{
        sd = new Date(d.getFullYear(), d.getMonth(), 1);
        ed = new Date(d.getFullYear(), d.getMonth(), teasp.util.date.getMonthEndDay(d.getFullYear(), d.getMonth() + 1));
    }
    dijit.byId('startYear' ).setValue(sd.getFullYear());
    dijit.byId('startMonth').setValue(sd.getMonth() + 1);
    dijit.byId('startDate' ).setValue(sd.getDate());
    dijit.byId('endYear'   ).setValue(ed.getFullYear());
    dijit.byId('endMonth'  ).setValue(ed.getMonth() + 1);
    dijit.byId('endDate'   ).setValue(ed.getDate());
    this.showRangeOfYearMonth();

//	dojo.query('#shiftTopView .ts-top-button3 > a')[0].href = globalLoadRes.helpLink || '';

    dojo.connect(dijit.byId('startYear') , 'onChange', this, this.setDeptPulldown);
    dojo.connect(dijit.byId('startMonth'), 'onChange', this, this.setDeptPulldown);
    dojo.connect(dijit.byId('startDate') , 'onChange', this, this.setDeptPulldown);
    dojo.connect(dijit.byId('endYear')	 , 'onChange', this, this.setDeptPulldown);
    dojo.connect(dijit.byId('endMonth')  , 'onChange', this, this.setDeptPulldown);
    dojo.connect(dijit.byId('endDate')	 , 'onChange', this, this.setDeptPulldown);

    // 「期間で指定する」ボタン
    dojo.connect(dojo.byId('changeRangeType1'), 'onclick', this, function(){
        if(!this.getRangeValue()){
            return;
        }
        dojo.style('inputRangeType1', 'display', 'none');
        dojo.style('inputRangeType2', 'display', '');
        this.currentRangeType = 1;
    });
    // 「月度で指定する」ボタン
    dojo.connect(dojo.byId('changeRangeType2'), 'onclick', this, function(){
        dojo.style('inputRangeType1', 'display', '');
        dojo.style('inputRangeType2', 'display', 'none');
        this.currentRangeType = 0;
        this.showRangeOfYearMonth();
    });
    dojo.connect(dijit.byId('monYear') , 'onChange', this, this.showRangeOfYearMonth);
    dojo.connect(dijit.byId('monMonth'), 'onChange', this, this.showRangeOfYearMonth);

    // 検索条件入力エリアの「この条件で表示」ボタン
    dojo.connect(dojo.byId('searchDo'), 'onclick', this, this.search);
    // 検索条件入力エリアの「キャンセル」ボタン
    dojo.connect(dojo.byId('searchCancel'), 'onclick', this, function(){
        this.showError(null);
        dojo.style('inputCondition' , 'display', 'none');
        dojo.style('searchCondition', 'display', '');
    });
    // 「表示範囲変更」ボタン
    dojo.connect(dojo.byId('changeSearch'), 'onclick', this, function(){
        if(this.localObj.param){
            dojo.style('inputRangeType1', 'display', (!this.currentRangeType ? '' : 'none'));
            dojo.style('inputRangeType2', 'display', (!this.currentRangeType ? 'none' : ''));

            if(!this.currentRangeType){
                dijit.byId('monYear' ).setValue(Math.floor(this.localObj.param.month / 100));
                dijit.byId('monMonth').setValue(this.localObj.param.month % 100);
            }else{
                var d = new Date();
                dijit.byId('monYear' ).setValue(d.getFullYear());
                dijit.byId('monMonth').setValue(d.getMonth() + 1);
            }
            var sd = teasp.util.date.parseDate(this.localObj.param.startDate);
            var ed = teasp.util.date.parseDate(this.localObj.param.endDate);
            dijit.byId('startYear' ).setValue(sd.getFullYear());
            dijit.byId('startMonth').setValue(sd.getMonth() + 1);
            dijit.byId('startDate' ).setValue(sd.getDate());
            dijit.byId('endYear'   ).setValue(ed.getFullYear());
            dijit.byId('endMonth'  ).setValue(ed.getMonth() + 1);
            dijit.byId('endDate'   ).setValue(ed.getDate());
            dojo.byId('selectDepts').value = this.localObj.param.deptId;
        }

        var searchEmp = (this.localObj.param.empIdList || []);

        dojo.style('inputCondition' , 'display', '');
        dojo.style('searchCondition', 'display', 'none');
    });
    // 社員選択ツールチップダイアログ
    this.empSelectDialog = new teasp.dialog.EmpSelect(this, this.localObj.depts, this.localObj.titles, this.getRangeValue, this.searchEmp, this.setCahceEmps(), this.getEmpSelected());
    var that = this;
    this.empSelectDialog.ready([]
    , function(empId, checked){ // 社員を選択/解除したときの処理
        var o = that.cacheEmps;
        if(!o.select){
            o.select = {};
        }
        o.select[empId] = (checked ? 1 : 0);
        dojo.byId('entriedEmp').value = that.getSearchEmpName();
    }, function(empIds, checked){ // 社員を全選択/解除したときの処理
        var o = that.cacheEmps;
        if(!o.select){
            o.select = {};
        }
        var v = (checked ? 1 : 0);
        for(var i = 0 ; i < empIds.length ; i++){
            o.select[empIds[i]] = v;
        }
        dojo.byId('entriedEmp').value = that.getSearchEmpName();
    }, function(){ // 全クリア
        var o = that.cacheEmps;
        if(o.select){
            o.select = {};
        }
        dojo.byId('entriedEmp').value = '';
    });
    // 社員＋日ツールチップダイアログ
    this.empDayDialog = new teasp.dialog.EmpDay(this.localObj);
    this.empDayDialog.ready();

    // 社員入力欄にマウスカーソルが入ったときに社員選択ツールチップダイアログを表示する
    dojo.connect(dojo.byId('entriedEmp'), 'onmouseenter', this, function(){
        dijit.popup.open({
            popup: this.empSelectDialog.getDialog(),
            around: dojo.byId('entriedEmp')
        });
    });
    // 画面内をクリックすると社員選択ツールチップダイアログが閉じるようにする
    dojo.connect(dojo.byId('big_area'), 'onclick', this, function(){
        dijit.popup.close(this.empSelectDialog.getDialog());
    });

    // 部署選択
    dojo.connect(dojo.byId('browseDept'), 'onclick', this, this.openSelectDept);

    // CSV出力ボタンをクリックした
    dojo.connect(dojo.byId('shiftCsvOut'), 'onclick', this, this.openShiftOutput);

    dojo.connect(dojo.byId('shiftCsvImport1'), 'onclick', this, this.openShiftCsvImport);
    dojo.connect(dojo.byId('shiftCsvImport2'), 'onclick', this, this.openShiftCsvImport);

    // 「時間を表示する」をクリックした
    dojo.connect(dojo.byId('displayTime'), 'onclick', this, function(){
        var chk = dojo.byId('displayTime').checked;
        dojo.query('.dayTime').forEach(function(elem){
            dojo.style(elem, 'display', (chk ? '' : 'none'));
        });
        this.resizeArea();
    });

    // 「イベントを表示する」をクリックした
    dojo.byId('displayEvent').checked = true; // 「イベントを表示する」はデフォルトでオン
    dojo.connect(dojo.byId('displayEvent'), 'onclick', this, this.createTable);
    dojo.style(dojo.byId('displayEvent').parentNode, 'display', '');

    dojo.connect(dojo.byId('displayLegend'), 'onclick', this, this.checkedLegend);

    // 「仮登録を本登録に変える」をクリックした
    dojo.connect(dojo.byId('changeRealSave'), 'onclick', this, this.saveToReal);

    this.createMenu();
};

/**
 * 印刷プレビュー画面の初期化
 *
 * @param {Function=} onSuccess レスポンス正常受信時の処理
 * @param {Function=} onFailure レスポンス異常受信時の処理
 */
teasp.view.Shift.prototype.initForPrint = function(onSuccess, onFailure){
    this.printFlag = true;
    this.readParams({});
    this.localObj.depts = teasp.view.Shift.processingDepts(globalLoadRes.depts, this.viewParams.startDate, this.viewParams.endDate);
    var req = {
        month	   : (this.viewParams.month.length > 0 ? parseInt(this.viewParams.month, 10) : null),
        startDate  : this.viewParams.startDate,
        endDate    : this.viewParams.endDate,
        rangeType  : (this.viewParams.month.length > 0 ? 0 : 1),
        deptId	   : this.viewParams.deptId,
        deptOpt    : 3,
        empIdList  : (this.viewParams.empIdList.length > 0 ? this.viewParams.empIdList.split(/,/) : [])
    };
    this.currentRangeType = req.rangeType;
    this.changeImportResultMode(this.viewParams.importResult ? true : false);
    // 「時間を表示する」をクリックした
    dojo.connect(dojo.byId('displayTime'), 'onclick', this, function(){
        var chk = dojo.byId('displayTime').checked;
        dojo.query('.dayTime').forEach(function(elem){
            dojo.style(elem, 'display', (chk ? '' : 'none'));
        });
        this.resizeArea();
    });
    dojo.connect(dojo.byId('displayLegend'), 'onclick', this, this.checkedLegend);
    // 「イベントを表示する」は印刷プレビューでは不可視にする
    dojo.byId('displayEvent').checked = true;
    dojo.style(dojo.byId('displayEvent').parentNode, 'display', 'none');
    this.searchShiftData(req);
};

/**
 * 社員IDリストから社員名のリストを得る
 *
 * @param {Array.<string>} empIdList 社員IDリスト
 * @param {boolean} flag true なら引数の empIdList を社員名のリストに変換
 * @returns {string} 社員名（カンマ区切り）
 */
teasp.view.Shift.prototype.getSearchEmpName = function(empIdList, flag){
    if(flag && empIdList){
        var names = [];
        for(var i = 0 ; i < empIdList.length ; i++){
            var emp = this.getEmpById(empIdList[i]);
            if(emp){
                names.push(emp.Name);
            }
        }
        return names.join(', ');
    }
    var o = this.cacheEmps;
    if(!o.select){
        o.select = {};
    }
    if(empIdList){
        for(var key in o.select){
            if(o.select.hasOwnProperty(key)){
                o.select[key] = (empIdList.contains(key) ? 1 : 0);
            }
        }
    }
    var map = (o.map || {});
    var names = [];
    for(var key in map){
        if(o.select[key] && map.hasOwnProperty(key)){
            names.push(map[key].Name);
        }
    }
    return names.join(', ');
};

/**
 * キャッシュの社員IDのリストを返す
 *
 * @returns {Array.<string>} empIdList 社員IDリスト
 */
teasp.view.Shift.prototype.getSearchEmpId = function(){
    var o = this.cacheEmps;
    if(!o.select){
        o.select = {};
    }
    var empIds = [];
    for(var key in o.select){
        if(o.select.hasOwnProperty(key) && o.select[key]){
            empIds.push(key);
        }
    }
    return empIds;
};

/**
 * 印刷ボタンクリック時の処理
 *
 */
teasp.view.Shift.prototype.openPrintView = function(){
    var h = (screen.availHeight || 800);
    if(h > 800){
        h = 800;
    }
    var param = this.localObj.param;
    var buf = '?startDate=' + param.startDate;
    buf += '&endDate=' + param.endDate;
    buf += '&month=' + (param.month || '');
    buf += '&deptId=' + (param.deptId || '');
    buf += '&empIdList=' + param.empIdList.join(',');
    if(this.importResultFlag){
        buf += '&importResult=1';
    }
    var wh = window.open(teasp.getPageUrl('shiftPrintView') + buf,
        'print', 'width=900,height=' + h + ',resizable=yes,scrollbars=yes');
    setTimeout(function(){ wh.resizeTo(910, h); }, 100);
};

/**
 * 月度から期間を求めて表示、期間入力欄にセット
 *
 */
teasp.view.Shift.prototype.showRangeOfYearMonth = function(){
    if(!dijit.byId('monYear' ).isValid()
    || !dijit.byId('monMonth').isValid()){
        return;
    }
    var emp = globalLoadRes.emp;
    var ym = parseInt(dojo.byId('monYear').value, 10) * 100 + parseInt(dojo.byId('monMonth').value, 10);
    var od = (emp ? teasp.util.searchYearMonthDate(emp.EmpTypeId__r.ConfigBaseId__r.InitialDateOfMonth__c
            , emp.EmpTypeId__r.ConfigBaseId__r.MarkOfMonth__c
            , ym) : null);
    if(!od){
        var d1 = new Date(Math.floor(ym / 100), (ym % 100), 1);
        var d2 = teasp.util.date.addDays(teasp.util.date.addMonths(d1, 1), -1);
        return {
            yearMonth : ym,
            startDate : teasp.util.date.formatDate(d1),
            endDate   : teasp.util.date.formatDate(d2)
        };
    }
    var sd = teasp.util.date.parseDate(od.startDate);
    var ed = teasp.util.date.parseDate(od.endDate);
    dojo.byId('monYearMonth').innerHTML = '（ ' + teasp.util.date.formatDate(sd, 'SLA') + '～' + teasp.util.date.formatDate(ed, 'SLA') + ' ）';
    dijit.byId('startYear' ).setValue(sd.getFullYear());
    dijit.byId('startMonth').setValue(sd.getMonth() + 1);
    dijit.byId('startDate' ).setValue(sd.getDate());
    dijit.byId('endYear'   ).setValue(ed.getFullYear());
    dijit.byId('endMonth'  ).setValue(ed.getMonth() + 1);
    dijit.byId('endDate'   ).setValue(ed.getDate());

    this.setDeptPulldown(); // 部署プルダウンを再作成
};


/**
 * エラー表示
 *
 * @param {string=} msg メッセージ
 */
teasp.view.Shift.prototype.showError = function(msg){
    teasp.util.showErrorArea(msg, 'error_area');
};

/**
 * メッセージ表示
 *
 * @param {string=} msg メッセージ
 */
teasp.view.Shift.prototype.showMessage = function(msg){
    dojo.byId('message').innerHTML = (msg || '');
};

/**
 * 検索実行
 *
 */
teasp.view.Shift.prototype.search = function(){
    // 期間
    var req = this.getRangeValue();
    if(!req){
        return;
    }
    if(req.startDate > req.endDate){
        this.showError('期間の設定が正しくありません');
        return;
    }
    var n = teasp.util.date.daysInRange(req.startDate, req.endDate);
    if(n > 32){
        this.showError('期間の日数が最大32日間を超えないように範囲を指定してください');
        return;
    }
    // 部署
    req.deptId = dojo.byId('selectDepts').value;
    if(req.deptId == '-'){
        req.deptId = null;
    }
    req.deptOpt = 3; // 固定（将来撤去予定）
    req.empIdList = this.getSearchEmpId();
    if(!req.deptId && req.empIdList.length <= 0){
        this.showError('部署を指定してください');
        return;
    }
    this.resetScrollTop(); // スクロール位置の情報をリセット
    this.changeImportResultMode(false);
    this.searchShiftData(req);
};

teasp.view.Shift.prototype.getRangeValue = function(){
    var valid0 = (dijit.byId('monYear'  ).isValid() && dijit.byId('monMonth'  ).isValid());
    var valid1 = (dijit.byId('startYear').isValid() && dijit.byId('startMonth').isValid() && dijit.byId('startDate').isValid()
               && dijit.byId('endYear'  ).isValid() && dijit.byId('endMonth'  ).isValid() && dijit.byId('endDate'  ).isValid());
    if(!this.currentRangeType){
        if(!valid0){
            return null;
        }
    }else{
        if(!valid1){
            return null;
        }
    }
    var month = (valid0 ? parseInt(dojo.byId('monYear').value, 10) * 100 + parseInt(dojo.byId('monMonth').value, 10) : null);
    var sd = teasp.util.date.formatDate(new Date(parseInt(dojo.byId('startYear').value, 10),parseInt(dojo.byId('startMonth').value, 10) - 1,parseInt(dojo.byId('startDate').value, 10)));
    var ed = teasp.util.date.formatDate(new Date(parseInt(dojo.byId('endYear'  ).value, 10),parseInt(dojo.byId('endMonth'  ).value, 10) - 1,parseInt(dojo.byId('endDate'  ).value, 10)));
    return {
        month	   : (!this.currentRangeType ? month : null),
        _month	   : month,
        startDate  : sd,
        endDate    : ed,
        rangeType  : this.currentRangeType
    };
};

teasp.view.Shift.prototype.setDeptPulldown = function(){
    var rg = this.getRangeValue();
    if(!rg){
        return;
    }
    dojo.style(document.body, 'cursor', 'wait');
    var select = dojo.byId('selectDepts');
    dojo.attr(select, 'disabled', true);
    this.levelDepts = teasp.view.Shift.processingDepts(globalLoadRes.depts, rg.startDate, rg.endDate);
    var preValue = select.value;
    if(!preValue && globalLoadRes.emp){
        preValue = globalLoadRes.emp.DeptId__c;
    }
    dojo.empty(select);
    dojo.create('option', { innerHTML: '（選択してください）'		 , value: '-'  }, select);
    for(var i = 0 ; i < this.levelDepts.length ; i++){
        var dept = this.levelDepts[i];
        if(dept.past || dept.future){
            continue;
        }
        dojo.create('option', { innerHTML: dept.displayName, value: dept.Id }, select);
    }
    select.value = (preValue || '-');
    if(this.empSelectDialog){
        this.empSelectDialog.setDeptPulldown();
    }
    setTimeout(function(){
        dojo.attr('selectDepts', 'disabled', false);
        dojo.style(document.body, 'cursor', 'default');
    }, 1000);
};

/**
 * 検索条件をサーバに送信
 *
 * @param {Object} req パラメータ
 */
teasp.view.Shift.prototype.searchShiftData = function(req){
    this.contact(
        {
            funcName: 'collectShift',
            params	: req
        }, function(result){
            this.collectData(result);
            this.createTable();
        }
    );
};

/**
 * サーバから受信したデータを解析
 *
 * @param {Object} obj 受信データ
 */
teasp.view.Shift.prototype.collectData = function(obj){
    this.localObj.param  = obj.param;
    this.localObj.emps		 = [];
    this.localObj.dateList	 = [];
    this.localObj.patterns	 = [];
    this.localObj.holidays	 = [];
    this.localObj.allPatterns= [];
    this.localObj.empIdIndex = {};
    this.localObj.deptMap	 = {};
    this.localObj.events	 = {};
    this.localObj.pubEvents  = {};
    this.localObj.deptEvents = {};
    this.localObj.notes 	 = {};
    this.localObj.countDays  = {};
    this.localObj.attSummary = {};
    this.startCell = null;
    this.temporaryShiftId = [];
    this.sumColumns = dojo.clone(this.sumColumnsFix);
    var i, j, k;
    var dkeys = teasp.util.date.getDateList(obj.param.startDate, obj.param.endDate);
    var tempCbmap = {};
    var tempPmap  = {};
    var tempHmap  = {};
    var tempEpmap = {};
    var tempCalmap = { common: {} };
    var deptCalmap = {};
    var tempEtmap = {};
    var tempEamap = {};
    var tempEmmap = {};
    var tempDkeys = {};
    // 勤怠関連申請
    for(i = 0 ; i < obj.empApplys.length ; i++){
        var empApply = obj.empApplys[i];
        empApply.startDate		   = teasp.logic.convert.valDate(empApply.StartDate__c);
        empApply.endDate		   = teasp.logic.convert.valDate(empApply.EndDate__c);
        empApply.exchangeDate	   = teasp.logic.convert.valDate(empApply.ExchangeDate__c);
        empApply.originalStartDate = teasp.logic.convert.valDate(empApply.OriginalStartDate__c);
        if(!tempEamap[empApply.EmpId__c]){
            tempEamap[empApply.EmpId__c] = [];
        }
        tempEamap[empApply.EmpId__c].push(empApply);
        if(!dkeys.contains(empApply.startDate)){
            tempDkeys[empApply.startDate] = 1;
        }
        if(!dkeys.contains(empApply.endDate)){
            tempDkeys[empApply.endDate] = 1;
        }
        if(empApply.exchangeDate && !dkeys.contains(empApply.exchangeDate)){
            tempDkeys[empApply.exchangeDate] = 1;
        }
        if(empApply.originalStartDate && !dkeys.contains(empApply.originalStartDate)){
            tempDkeys[empApply.originalStartDate] = 1;
        }
        if(empApply.HolidayId__r){
            tempHmap[empApply.HolidayId__r.Id] = empApply.HolidayId__r;
        }
    }
    var allDkeys = [].concat(dkeys);
    for(var key in tempDkeys){
        if(!tempDkeys.hasOwnProperty(key)){
            continue;
        }
        allDkeys.push(key);
    }
    allDkeys = allDkeys.sort(function(a, b){
        return (a < b ? -1 : (a > b ? 1 : 0));
    });
    var sd = allDkeys[0];
    var ed = allDkeys[allDkeys.length - 1];
    var permit = this.getPermission();
    // 勤怠設定
    for(i = 0 ; i < obj.configs.length ; i++){
        var c = obj.configs[i];
        if(!tempCbmap[c.ConfigBaseId__c]){
            tempCbmap[c.ConfigBaseId__c] = [];
        }
        c.validStartDate = (c.ValidStartDate__c ? teasp.logic.convert.valDate(c.ValidStartDate__c) : null);
        c.validEndDate	 = (c.ValidEndDate__c	? teasp.logic.convert.valDate(c.ValidEndDate__c  ) : null);
        // 期間内の週休と祝日を得る
        var holidays = (c.Holidays__c || '0000000');
        var weekHolys = [];
        var legalHolys = [];
        for(j = 0 ; j < holidays.length ; j++){
            var h = holidays.substring(j, j + 1);
            if(h != '0'){
                weekHolys.push(j);
            }
            if(h == '2'){
                legalHolys.push(j);
            }
        }
        c.fixHolys = getHolidays(
                    teasp.util.date.parseDate(c.validStartDate ? (c.validStartDate <= sd ? sd : c.validStartDate) : sd),
                    teasp.util.date.parseDate(c.validEndDate   ? (c.validEndDate   >= ed ? ed : c.validEndDate	) : ed),
                    weekHolys,
                    false);
        for(var dkey in c.fixHolys){
            if(c.fixHolys.hasOwnProperty(dkey)){
                var fh = c.fixHolys[dkey];
                if(legalHolys.contains(fh.dayOfWeek)){
                    fh.dayType = teasp.constant.DAY_TYPE_LEGAL_HOLIDAY;
                }else if(weekHolys.contains(fh.dayOfWeek)){
                    fh.dayType = teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
                }else{
                    if(c.NonPublicHoliday__c){
                        fh.dayType = teasp.constant.DAY_TYPE_NORMAL;
                    }else{
                        fh.dayType = teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY;
                    }
                }
            }
        }
        tempCbmap[c.ConfigBaseId__c].push(c);
    }
    // カレンダー
    for(i = 0 ; i < obj.calendars.length ; i++){
        var cal = obj.calendars[i];
        var dkey = teasp.logic.convert.valDate(cal.Date__c);
        if(!cal.DeptId__c){
            var key = (cal.EmpTypeId__c ? cal.EmpTypeId__c : 'common');
            if(!tempCalmap[key]){
                tempCalmap[key] = {};
            }
            tempCalmap[key][dkey] = cal;
        }else{
            var key = cal.DeptId__c;
            if(!deptCalmap[key]){
                deptCalmap[key] = {};
            }
            deptCalmap[key][dkey] = cal;
        }
    }
    // 勤務パターン
    for(i = 0 ; i < obj.patterns.length ; i++){
        var p = obj.patterns[i];
        tempPmap[p.Id] = p;
    }
    // 勤務体系別パターン
    for(i = 0 ; i < obj.empTypePatterns.length ; i++){
        var ep = obj.empTypePatterns[i];
        ep.pattern = tempPmap[ep.PatternId__c];
        if(!tempEpmap[ep.EmpTypeId__c]){
            tempEpmap[ep.EmpTypeId__c] = [];
        }
        tempEpmap[ep.EmpTypeId__c].push(ep);
    }
    // 勤怠月次情報
    for(i = 0 ; i < obj.empMonths.length ; i++){
        var empMonth = obj.empMonths[i];
        empMonth.startDate = teasp.logic.convert.valDate(empMonth.StartDate__c);
        empMonth.endDate   = teasp.logic.convert.valDate(empMonth.EndDate__c);
        if(!tempEmmap[empMonth.EmpId__c]){
            tempEmmap[empMonth.EmpId__c] = [];
        }
        tempEmmap[empMonth.EmpId__c].push(empMonth);
    }
    // 勤務体系単位・日単位で集約
    for(i = 0 ; i < obj.empTypes.length ; i++){
        var empType = obj.empTypes[i];
        tempEtmap[empType.Id] = empType;
        empType.patterns = (tempEpmap[empType.Id] || []).sort(function(a, b){ return a.Order__c - b.Order__c; });
        empType.days = {};
        var configs = tempCbmap[empType.ConfigBaseId__c];
        for(j = 0 ; j < allDkeys.length ; j++){
            var dkey = allDkeys[j];
            var d = empType.days[dkey] = {
                date : teasp.util.date.parseDate(dkey)
            };
            if(configs.length == 1){
                d.config = configs[0];
            }else{
                for(k = 0 ; k < configs.length ; k++){
                    var c = configs[k];
                    if((!c.validStartDate || c.validStartDate <= dkey)
                    && (!c.validEndDate   || c.validEndDate   >= dkey)){
                        d.config = c;
                        break;
                    }
                }
            }
            // 設定から dayType を決定
            d.layer1 = function(){
                var o = {};
                var fh = d.config.fixHolys[dkey];
                o.dayType = (fh ? fh.dayType : teasp.constant.DAY_TYPE_NORMAL);
                o.event = (fh && fh.title || null);
                var ep = teasp.view.Shift.getPatternByDate(empType.patterns, d.date);
                o.pattern = (ep && ep.pattern || null);
                return o;
            }();
            // カレンダーから dayType, pattern を決定
            d.layer2 = function(co, et){
                if(!co && !et){
                    return {};
                }
                var o = {};
                var type2DayType = function(type){
                    switch(type){
                    case '1': return teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
                    case '2': return teasp.constant.DAY_TYPE_LEGAL_HOLIDAY;
                    case '3': return teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY;
                    default : return teasp.constant.DAY_TYPE_NORMAL;
                    }
                };
                // 共通の設定
                if(co){
                    if(co.Type__c){
                        o.dayType = type2DayType(co.Type__c);
                        o.plannedHoliday = (co.PlannedHoliday__c || false);
                        o.commonPriority = (co.Priority__c == '1');
                    }
                    if(co.Event__c && co.Event__c.length > 0){
                        o.commonEvent = co.Event__c;
                    }
                    if(co.Note__c && co.Note__c.length > 0){
                        o.commonNote = co.Note__c;
                    }
                }
                // 勤務体系別の設定
                if(et){
                    if(et.Type__c && !o.commonPriority){
                        o.dayType = type2DayType(et.Type__c);
                        o.plannedHoliday = (et.PlannedHoliday__c || false);
                    }
                    if(et.Event__c && et.Event__c.length > 0){
                        o.event = et.Event__c;
                    }
                    if(et.Note__c && et.Note__c.length > 0){
                        o.note = et.Note__c;
                    }
                    o.pattern = (et.PatternId__r || null);
                }
                return o;
            }(tempCalmap['common'][dkey] || null, (tempCalmap[empType.Id] || {})[dkey] || null);
            // 日タイプ、勤務パターン、イベントを決定
            d.dayType		 = (typeof(d.layer2.dayType) == 'number' ? d.layer2.dayType : d.layer1.dayType);
            d.plannedHoliday = (d.dayType == teasp.constant.DAY_TYPE_NORMAL && d.layer2.plannedHoliday || false);
            d.pattern		 = (d.layer2.pattern ? d.layer2.pattern : d.layer1.pattern);
            var evts = [];
            if(d.layer1.event){
                evts.push(d.layer1.event);
            }
            if(d.layer2.commonEvent){
                evts.push(d.layer2.commonEvent);
            }
            if(d.layer2.event){
                evts.push(d.layer2.event);
            }
            d.event = (evts.length > 0 ? evts.join(teasp.message.getLabel('tm10001470')) : null);
            d.note = d.layer2.note;
            this.localObj.pubEvents[dkey] = d.layer1.event;
            this.localObj.events[dkey]	  = d.layer2.commonEvent;
        }
    }
    // 部署
    for(i = 0 ; i < this.localObj.depts.length ; i++){
        var dept = this.localObj.depts[i];
        this.localObj.deptEvents[dept.Id] = { days: {} };
        for(j = 0 ; j < allDkeys.length ; j++){
            var dkey = allDkeys[j];
            var d = this.localObj.deptEvents[dept.Id].days[dkey] = {};
            var et = (deptCalmap[dept.Id] || {})[dkey];
            if(et){
                d.event = et.Event__c;
                d.note	= et.Note__c;
            }
        }
    }
    tempPmap = {};
    tempHmap = {};
    var plannedHolidays = 0;
    obj.emps = obj.emps.sort(function(a, b){
        if(a.Title__c == b.Title__c){
            if(a.EmpCode__c == b.EmpCode__c){
                return (a.Name < b.Name ? -1 : 1);
            }
            if(!a.EmpCode__c && b.EmpCode__c){
                return 1;
            }else if(a.EmpCode__c && !b.EmpCode__c){
                return -1;
            }
            return (a.EmpCode__c < b.EmpCode__c ? -1 : 1);
        }
        if(!a.Title__c && b.Title__c){
            return 1;
        }else if(a.Title__c && !b.Title__c){
            return -1;
        }
        return (a.Title__c < b.Title__c ? -1 : 1);
    });
    // 社員単位・日単位で集約
    for(i = 0 ; i < obj.emps.length ; i++){
        var emp = obj.emps[i];
        emp.empType = tempEtmap[emp.EmpTypeId__c];
        var deptKey = (emp.DeptId__c || '(null)');
        if(!this.localObj.deptMap[deptKey]){
            this.localObj.deptMap[deptKey] = [];
        }
        this.localObj.deptMap[deptKey].push(emp);
        emp.days = {};
        emp.countDays = {
            workDays: 0,  // 勤務日数
            holiDays: 0,  // 休日数
            offDays : 0   // 休暇数
        };
        var editable = this.isEditable(emp, permit);
        for(j = 0 ; j < dkeys.length ; j++){
            var dkey = dkeys[j];
            var d = emp.days[dkey] = {};
            // 月次確定済みか
            if(tempEmmap[emp.Id]){
                var l = tempEmmap[emp.Id];
                for(k = 0 ; k < l.length ; k++){
                    var m = l[k];
                    if(m.startDate <= dkey && dkey <= m.endDate){
                        d.monthStatus = (m.EmpApplyId__r ? m.EmpApplyId__r.Status__c : null);
                        break;
                    }
                }
            }
            // 勤怠関連申請
            var applys = [];
            if(tempEamap[emp.Id]){
                var l = tempEamap[emp.Id];
                for(k = 0 ; k < l.length ; k++){
                    var a = l[k];
                    if((a.startDate <= dkey && dkey <= a.endDate)
                    || (a.ApplyType__c == teasp.constant.APPLY_TYPE_EXCHANGE && dkey == a.exchangeDate)){
                        applys.push(a);
                    }
                }
            }
            var amap = {};
            var dmap = {};
            for(k = 0 ; k < applys.length ; k++){
                var a = applys[k];
                teasp.view.Shift.setApplyToDayObj(((a.Decree__c && a.ApplyType__c != teasp.constant.APPLY_TYPE_HOLIDAY)? dmap : amap), teasp.view.Shift.getApplyKey(a, dkey), a);
            }
            d.applys  = teasp.view.Shift.getValidApplys(amap);
            d.decrees = teasp.view.Shift.getValidApplys(dmap);
            // 日タイプをセット
            d.dayType		 = emp.empType.days[dkey].dayType;
            d.plannedHoliday = emp.empType.days[dkey].plannedHoliday;
            d.pattern		 = emp.empType.days[dkey].pattern;
            d.orgDayType = d.dayType;
            var dp = (d.decrees.patternS || d.decrees.patternL); // シフト設定がある
            if(dp){
                if(!dp.Removed__c){
                    if(typeof(dp.DayType__c) == 'string'){
                        d.dayType = parseInt(dp.DayType__c, 10);
                    }
                    d.pattern	= (dp.PatternId__r || null);
                    d.workPlace = (dp.WorkPlaceId__r || null);
                    if(!d.workPlace){
                        d.workPlaceNoChange = true;
                    }
                }
                d.temporary = dp.TempFlag__c;
                d.memo = (dp.Content__c || null); // メモ欄の値
                if(d.temporary){
                    this.temporaryShiftId.push(dp.Id);
                    if(d.decrees.patternS.orgs && d.decrees.patternS.orgs.length > 0){
                        for(k = 0 ; k < d.decrees.patternS.orgs.length ; k++){
                            this.temporaryShiftId.push(d.decrees.patternS.orgs[k].Id);
                        }
                    }
                }
            }
            var ap = (d.applys.patternS || d.applys.patternL); // 勤務時間変更申請がある
            if(ap){
                if(typeof(ap.DayType__c) == 'string'){
                    d.dayType = parseInt(ap.DayType__c, 10);
                }
                d.pattern	= (ap.PatternId__r || null);
            }
            if(d.applys.exchangeS){ // 振替申請がある（振替元）
                d.dayType = emp.empType.days[d.applys.exchangeS.exchangeDate].dayType;
            }else if(!d.applys.exchangeS && d.applys.exchangeE){ // 振替申請がある（振替先）
                d.dayType = emp.empType.days[d.applys.exchangeE.originalStartDate].dayType;
            }
            if(d.pattern){
                var po = tempPmap[d.pattern.Id];
                if(po){
                    po.cnt++;
                }else{
                    tempPmap[d.pattern.Id] = { cnt: 1, pattern: d.pattern };
                }
            }
            if(d.applys.holidayAll){
                var ho = tempHmap[d.applys.holidayAll.HolidayId__r.Id];
                if(ho){
                    ho.cnt++;
                }else{
                    tempHmap[d.applys.holidayAll.HolidayId__r.Id] = { cnt: 1, holiday: d.applys.holidayAll.HolidayId__r };
                }
            }
            if(d.applys.holidayAm){
                var ho = tempHmap[d.applys.holidayAm.HolidayId__r.Id];
                if(ho){
                    ho.cnt++;
                }else{
                    tempHmap[d.applys.holidayAm.HolidayId__r.Id] = { cnt: 1, holiday: d.applys.holidayAm.HolidayId__r };
                }
            }
            if(d.applys.holidayPm){
                var ho = tempHmap[d.applys.holidayPm.HolidayId__r.Id];
                if(ho){
                    ho.cnt++;
                }else{
                    tempHmap[d.applys.holidayPm.HolidayId__r.Id] = { cnt: 1, holiday: d.applys.holidayPm.HolidayId__r };
                }
            }
            d.fix = (teasp.constant.STATUS_FIX.contains(d.monthStatus) || d.applys.dailyFix);
            d.editable = editable;
            if(d.dayType == teasp.constant.DAY_TYPE_NORMAL){
                if(d.plannedHoliday && !d.applys.kyushtu){
                    emp.countDays.offDays++; // 休暇日である
                    plannedHolidays++;
                }
//				  }else if(d.applys.holidayAll || (d.applys.holidayAm && d.applys.holidayPm)){ // 終日の休暇申請した
//					  emp.countDays.offDays++;
                if(d.applys.holidayAll){
                    if(!emp.countDays[d.applys.holidayAll.HolidayId__r.Id]){
                        emp.countDays[d.applys.holidayAll.HolidayId__r.Id] = 1;
                    }else{
                        emp.countDays[d.applys.holidayAll.HolidayId__r.Id]++;
                    }
                }
                if(d.applys.holidayAm){
                    if(!emp.countDays[d.applys.holidayAm.HolidayId__r.Id]){
                        emp.countDays[d.applys.holidayAm.HolidayId__r.Id] = 1;
                    }else{
                        emp.countDays[d.applys.holidayAm.HolidayId__r.Id]++;
                    }
                }
                if(d.applys.holidayPm){
                    if(!emp.countDays[d.applys.holidayPm.HolidayId__r.Id]){
                        emp.countDays[d.applys.holidayPm.HolidayId__r.Id] = 1;
                    }else{
                        emp.countDays[d.applys.holidayPm.HolidayId__r.Id]++;
                    }
                }
                if(!d.applys.holidayAll && !(d.applys.holidayAm && d.applys.holidayPm)){ // 終日の休暇申請をしてない
                    emp.countDays.workDays++; // 勤務日である
                    var pkey = d.pattern ? d.pattern.Id : '(null)';
                    var wkey = d.workPlace ? d.workPlace.Id : (emp.DeptId__c ? emp.DeptId__c : '(null)'); // 勤務場所、nullなら所属部署
                    if(!emp.countDays[pkey]){
                        emp.countDays[pkey] = 1;
                    }else{
                        emp.countDays[pkey]++;
                    }
                    if(!this.localObj.countDays[wkey]){
                        this.localObj.countDays[wkey] = {};
                    }
                    if(!this.localObj.countDays[wkey][dkey]){
                        this.localObj.countDays[wkey][dkey] = {};
                    }
                    if(!this.localObj.countDays[wkey][dkey][pkey]){
                        this.localObj.countDays[wkey][dkey][pkey] = 1;
                    }else{
                        this.localObj.countDays[wkey][dkey][pkey]++;
                    }
                }
            }else{
                emp.countDays.holiDays++;
            }
        }
    }
    this.localObj.emps = obj.emps;
    this.localObj.dateList = dkeys;
    for(var key in tempPmap){
        if(tempPmap.hasOwnProperty(key)){
            this.localObj.patterns.push(tempPmap[key]);
        }
    }
    this.localObj.patterns = this.localObj.patterns.sort(function(a, b){
        return b.cnt - a.cnt;
    });
    this.localObj.patterns.unshift({}); // 先頭に「通常勤務」を意味するオブジェクトを挿入
    this.localObj.allPatterns = obj.patterns;

    for(var key in tempHmap){
        if(tempHmap.hasOwnProperty(key)){
            this.localObj.holidays.push(tempHmap[key]);
        }
    }
    this.localObj.holidays = this.localObj.holidays.sort(function(a, b){
        return b.cnt - a.cnt;
    });
    if(plannedHolidays <= 0){
        this.sumColumns.splice(2, 1);
    }
    for(i = 0 ; i < this.localObj.holidays.length ; i++){
        var h = this.localObj.holidays[i].holiday;
        this.sumColumns.push({
            name		  : h.Name,
            headId		  : h.Id,
            headClassName : 'sumHoriz1Cell',
            holiday 	  : h
        });
    }

    // 部署まとめ用のマップを作る。検索条件に指定した部署は最上位にくるようにする
    this.deptKeys = [];
    for(var key in this.localObj.deptMap){
        if(this.localObj.deptMap.hasOwnProperty(key)){
            this.deptKeys.push(key);
        }
    }
    var workPlaceId = this.localObj.param.deptId; // 検索対象の部署
    this.deptKeys = this.deptKeys.sort(function(a, b){
        if(workPlaceId == '-1'){
            if(a == '(null)'){
                return -1;
            }else if(b == '(null)'){
                return 1;
            }
            return 0;
        }
        return (a == workPlaceId ? -1 : (b == workPlaceId ? 1 : 0));
    });

    // 勤怠サマリ
    for(i = 0 ; i < obj.attSummaries.length ; i++){
        var attSummary = obj.attSummaries[i];
        if (!this.localObj.attSummary[attSummary.EmployeeHistoryId__r.BaseId__c]) {
            this.localObj.attSummary[attSummary.EmployeeHistoryId__r.BaseId__c] = [];
        }
        this.localObj.attSummary[attSummary.EmployeeHistoryId__r.BaseId__c].push(
            {
                Id : attSummary.Id,
                startDate : teasp.logic.convert.valDate(attSummary.StartDate__c),
                endDate : teasp.logic.convert.valDate(attSummary.EndDate__c)
            }
        );
    }
};

teasp.view.Shift.prototype.isEditable = function(emp, permit){
    if(permit.allEditor // 全編集権限がある
    || emp.UserId__c == permit.user.Id // 本人である
    || emp.Manager__c == permit.user.Id){ // 上長である
        return true;
    }
    if(!emp.DeptId__r){
        return false;
    }
    if(emp.DeptId__r.ManagerId__c  == permit.user.Id
    || emp.DeptId__r.Manager1Id__c == permit.user.Id
    || emp.DeptId__r.Manager2Id__c == permit.user.Id){
        return true;
    }
    if(!emp.DeptId__r.ParentId__r){
        return false;
    }
    if(emp.DeptId__r.ParentId__r.ManagerId__c  == permit.user.Id
    || emp.DeptId__r.ParentId__r.Manager1Id__c == permit.user.Id
    || emp.DeptId__r.ParentId__r.Manager2Id__c == permit.user.Id){
        return true;
    }
    if(!emp.DeptId__r.ParentId__r.ParentId__r){
        return false;
    }
    if(emp.DeptId__r.ParentId__r.ParentId__r.ManagerId__c  == permit.user.Id
    || emp.DeptId__r.ParentId__r.ParentId__r.Manager1Id__c == permit.user.Id
    || emp.DeptId__r.ParentId__r.ParentId__r.Manager2Id__c == permit.user.Id){
        return true;
    }
    if(!emp.DeptId__r.ParentId__r.ParentId__r.ParentId__r){
        return false;
    }
    if(emp.DeptId__r.ParentId__r.ParentId__r.ParentId__r.ManagerId__c  == permit.user.Id
    || emp.DeptId__r.ParentId__r.ParentId__r.ParentId__r.Manager1Id__c == permit.user.Id
    || emp.DeptId__r.ParentId__r.ParentId__r.ParentId__r.Manager2Id__c == permit.user.Id){
        return true;
    }
    return false;
};

/**
 * シフト表を作成
 *
 */
teasp.view.Shift.prototype.createTable = function(){
    var row, cell, i, s, n, places = {};
    var that = this;
    this.normalPatternSymbol = null;
    var displayTimeOn = (dojo.byId('displayTime') ? dojo.byId('displayTime').checked : false);

    if(this.scrollHandle){
        dojo.disconnect(this.scrollHandle);
        this.scrollHandle = null;
    }

    // 検索条件入力・表示エリア
    if(!this.currentRangeType){
        dojo.byId('searchCondRangeLabel').innerHTML = '月度';
        dojo.byId('searchCondRange').innerHTML = Math.floor(this.localObj.param.month / 100) + '年'
                            + (this.localObj.param.month % 100) + '月度'
                            + ' （ ' + teasp.util.date.formatDate(this.localObj.param.startDate, 'SLA')
                            + '～' + teasp.util.date.formatDate(this.localObj.param.endDate, 'SLA')
                            + ' ）';
    }else{
        dojo.byId('searchCondRangeLabel').innerHTML = '期間';
        dojo.byId('searchCondRange').innerHTML = teasp.util.date.formatDate(this.localObj.param.startDate, 'SLA')
        + '～' + teasp.util.date.formatDate(this.localObj.param.endDate, 'SLA');
    }
    var mainDeptName = '';
    if(this.localObj.param.deptId == '-1'){
        dojo.byId('searchCondDept').innerHTML = mainDeptName = '（部署未設定）';
    }else{
        dojo.byId('searchCondDept').innerHTML = mainDeptName = (this.localObj.param.deptName || '');
    }
    if(this.localObj.param.empIdList.length > 0){
        dojo.style('searchCondEmpRow', 'display', '');
        dojo.byId('searchCondEmp').innerHTML = this.getSearchEmpName(this.localObj.param.empIdList, this.printFlag).truncateTailInWidth(300, dojo.byId('ruler1'));
    }else{
        dojo.style('searchCondEmpRow', 'display', 'none');
    }
    if(!this.printFlag){
        dojo.style('searchCancel', 'display', ''); // 検索条件入力エリアの「キャンセル」ボタンを可視化
        dojo.style('shiftCsvImport2', 'display', 'none'); // CSVインポートボタンを非表示に
        dojo.style('inputCondition' , 'display', 'none'); // 検索条件入力エリアを非表示に
        dojo.style('searchCondition', 'display', '');
        dojo.style('shiftImportToolDL', 'display', 'none'); // Excelダウンロードを非表示に
    }

    for(var key in this.eventDayCells){
        if(!this.eventDayCells.hasOwnProperty(key)){
            continue;
        }
        dojo.disconnect(this.eventDayCells[key]);
        delete this.eventDayCells[key];
    }
    var baseDiv = dojo.byId('baseDiv');
    dojo.empty(baseDiv);
    var deptKey = (this.deptKeys.length > 0 ? this.deptKeys[0] : null);
    var emp = (deptKey && this.localObj.deptMap[deptKey].length > 0 ? this.localObj.deptMap[deptKey][0] : null);
    var deptId	= this.localObj.param.deptId || '(null)';

    var empCnt = 0;
    var topDeptId = this.localObj.param.deptId;
    if(!topDeptId || topDeptId == '-' || topDeptId == '-1'){
        topDeptId = this.deptKeys[0];
    }

    var table = dojo.create('table', { className: 'shiftTable', id: 'shiftTable', style:'width:100%;' }, baseDiv);
    var thead = dojo.create('thead', null, table);
    var tbody = dojo.create('tbody', null, table);
    if(!this.printFlag){
        dojo.style(thead, 'display', 'block');
        dojo.style(tbody, 'display', 'block');
        dojo.style(tbody, 'overflow-y', 'scroll');
        dojo.style(tbody, 'overflow-x', 'hidden');
    }
    // ボディ部がスクロールして最上部の部署が非可視になったら、ヘッダ部左端の部署名を非表示にする
    this.scrollHandle = dojo.connect(tbody, 'onscroll', this, function(e){
        dojo.style(dojo.query('#shiftTable span.first-dept-name')[0], 'display', (this.firstDeptHeight && e.target.scrollTop > this.firstDeptHeight) ? 'none' : '');
    });
    row = dojo.create('tr', null, thead);
    // 左端のセル（日付・曜日・イベント行をまたがる）に表示範囲の部署を表示
    // ただし１人目の社員の部署が表示範囲の部署と異なるときは表示しない
    var firstDeptName = ((emp && emp.DeptId__r && emp.DeptId__r.Name || '') == mainDeptName ? mainDeptName : '');
    if((!this.localObj.param.deptId || this.localObj.param.deptId == '-1') && emp && emp.DeptId__r){
        firstDeptName = emp.DeptId__r.Name;
    }
    dojo.create('span', { innerHTML: firstDeptName, className:'first-dept-name' },
        dojo.create('div', {
            style	 : { width:"100px", fontSize:"0.9em" }
        }, dojo.create('td', { rowSpan:3, className:'whiteCell', style:'vertical-align:bottom;text-align:left;border-bottom:1px solid #6393B7;word-break:break-all;' }, row))
    );
    // 日付行を作成
    var pd = null;
    for(n = 0 ; n < this.localObj.dateList.length ; n++){
        var dkey = this.localObj.dateList[n];
        var d = teasp.util.date.parseDate(dkey);
        if(!pd || pd.getMonth() != d.getMonth()){
            s = (d.getMonth() + 1) + '/' + d.getDate();
        }else{
            s = d.getDate();
        }
        pd = d;
        cell = dojo.create('td', {
            id		 : 'dd' + dkey,
            className:'dayCell ' + ((n%2)==0 ? 'even' : 'odd'),
            style	 : { height:"15px" }
        }, row);
        dojo.create('div', { innerHTML: s }, cell);
    }
    // 社員別集計項目（勤務日、休日、休暇）を作成
    for(n = 0 ; n < this.sumColumns.length ; n++){
        var sc = this.sumColumns[n];
        cell = dojo.create('td', {
            id		 : sc.headId,
            rowSpan  : 3,
            className: sc.headClassName + ' sumCell',
            style	 : 'text-align:center;vertical-align:top;min-width:30px;'
        }, row);
        if(sc.holiday){
            var ch = (sc.holiday.Symbol__c || sc.holiday.Name.substring(0, 1));
            dojo.create('div', { className: 'holyIcon dayDiv', style: { marginLeft:"auto", marginRight:"auto" }, innerHTML: ch }, cell);
        }
        dojo.create('div', {
            innerHTML: sc.name,
            style	 : 'width:20px;margin:2px auto;word-break:break-all;max-height:160px;overflow:hidden;'
        }, cell);
    }
    // 社員別集計項目（勤務パターン）を作成
    for(n = 0 ; n < this.localObj.patterns.length ; n++){
        var p = this.localObj.patterns[n].pattern;
        if(p){
            cell = dojo.create('td', { rowSpan: 3, className: 'sumHoriz2Cell sumCell', style:'text-align:center;vertical-align:top;min-width:30px;' }, row);
            var ch = (p.Symbol__c || p.Name.substring(0, 1));
            dojo.create('div', { className: 'pattern dayDiv', style: { marginLeft:"auto", marginRight:"auto" }, innerHTML: ch }, cell);
            dojo.create('div', { innerHTML: p.Name, style: 'width:20px;margin:2px auto;word-break:break-all;max-height:160px;overflow:hidden;' }, cell);
        }else{
            cell = dojo.create('td', { rowSpan: 3, className: 'sumHoriz2Cell sumCell', style: { textAlign:"center", verticalAlign:"top" } }, row);
            if(this.normalPatternSymbol){
                dojo.create('div', { className: 'pattern dayDiv', style: { marginLeft:"auto", marginRight:"auto" }, innerHTML: this.normalPatternSymbol }, cell);
            }
            dojo.create('div', { innerHTML: '通常勤務', style: { width:"20px", margin:"2px auto" } }, cell);
        }
    }
    dojo.create('div', { style:'width:' + this.scrollW + 'px' }, dojo.create('td', { rowSpan:3, style:'width:' + this.scrollW + 'px' }, row));
    // 曜日行を作成
    row = dojo.create('tr', null, thead);
    for(n = 0 ; n < this.localObj.dateList.length ; n++){
        var dkey = this.localObj.dateList[n];
        cell = dojo.create('td', {
            id		 : 'wd' + dkey,
            className:'dayCell ' + ((n%2)==0 ? 'even' : 'odd'),
            style	 : { height:"15px" }
        }, row);
        var dt = teasp.util.date.parseDate(dkey);
        var st = {};
        if(dt.getDay() == 0){
            st.color = "red";
        }else if(dt.getDay() == 6){
            st.color = "blue";
        }
        dojo.create('div', {
            innerHTML: teasp.util.date.formatDate(dkey, 'JPW'),
            style	 : st
        }, cell);
    }
    // イベント行を作成
    row = dojo.create('tr', null, thead);
    for(n = 0 ; n < this.localObj.dateList.length ; n++){
        var dkey = this.localObj.dateList[n];
        var el = [];
        var ez = [];
        if(this.localObj.events[dkey]){
            el.push('<span style="color:#8b0000;">' + this.localObj.events[dkey] + '</span>');
            ez.push(this.localObj.events[dkey]);
        }
        if(this.localObj.deptEvents[deptId]
        && this.localObj.deptEvents[deptId].days[dkey]
        && this.localObj.deptEvents[deptId].days[dkey].event){
            el.push('<span style="color:#2e8b57;">' + this.localObj.deptEvents[deptId].days[dkey].event + '</span>');
            ez.push(this.localObj.deptEvents[deptId].days[dkey].event);
        }
        if(this.localObj.deptEvents[deptId]
        && this.localObj.deptEvents[deptId].days[dkey]
        && this.localObj.deptEvents[deptId].days[dkey].note){
            el.push('<span style="color:#00008b;">' + this.localObj.deptEvents[deptId].days[dkey].note + '</span>');
            ez.push(this.localObj.deptEvents[deptId].days[dkey].note);
        }

        cell = dojo.create('td', {
            id		 : 'vd' + dkey,
            className: 'dayCell ' + ((n%2)==0 ? 'even' : 'odd'),
            style	 : 'font-size:0.9em;vertical-align:top;padding:0px;'
        }, row);
        if(dojo.byId('displayEvent').checked){
            if(this.localObj.pubEvents[dkey]){
                el.unshift(this.localObj.pubEvents[dkey]);
            }
            var emsg = el.join(teasp.message.getLabel('tm10001470'));
            var emsz = ez.join(teasp.message.getLabel('tm10001470') + '\n');
            dojo.create('div', {
                style	 : 'min-height:10px;max-height:150px;vertical-align:top;display:block;word-break:break-all;overflow:hidden;',
                className: 'event-text',
                innerHTML: emsg,
                title	 : emsz
            }, cell);
        }else{
            var emsg = el.join(teasp.message.getLabel('tm10001470'));
            var emsz = ez.join(teasp.message.getLabel('tm10001470') + '\n');
            if(this.localObj.pubEvents[dkey]){
                dojo.create('div', {
                    className: 'pp_base pp_btn_naholy',
                    style	 : { margin:"1px auto" },
                    title	 : this.localObj.pubEvents[dkey]
                }, cell);
            }
            if(emsg){
                dojo.create('div', {
                    className: 'pp_base pp_shift_event',
                    style	 : { margin:"1px auto" },
                    title	 : emsz
                }, cell);
            }
        }
    }
    // 部署単位で社員・日別の表を作成
    for(var m = 0 ; m < this.deptKeys.length ; m++){
        deptKey = this.deptKeys[m];
        var emps = this.localObj.deptMap[deptKey];
        if(deptKey != topDeptId){
            // 部署と部署の間にブランク行を作成
            row = dojo.create('tr', null, tbody);
            dojo.create('div', {
                innerHTML: (emps[0].DeptId__r && emps[0].DeptId__r.Name || ''), // 所属部署名
                style	 :'width:100px;font-size:0.9em;word-break:break-all;'
            }, dojo.create('td', { style:'vertical-align:bottom;text-align:left;', className:'whiteCell' }, row));
            // 日付列
            for(n = 0 ; n < this.localObj.dateList.length ; n++){
                var dkey = this.localObj.dateList[n];
                cell = dojo.create('td', {
                    id		 : 'xd' + dkey,
                    className: 'dayCell ' + ((n%2)==0 ? 'even' : 'odd'),
                    style	 : { borderLeft:"1px dashed #6393B7", borderRight:"1px dashed #6393B7" }
                }, row);
                dojo.create('div', {
                    style	 : { width:"24px", height:"40px" }
                }, cell);
            }
            // 社員別集計列（勤務日、休日、休暇）
            for(n = 0 ; n < this.sumColumns.length ; n++){
                dojo.create('div', {
                    style	 : { width:"24px", height:"40px" }
                }, dojo.create('td', {
                    className: 'cell sumCell',
                    style	 : { borderLeft:"1px dashed #6393B7", borderRight:"1px dashed #6393B7" }
                }, row));
            }
            // 社員別集計列（勤務パターン）
            for(n = 0 ; n < this.localObj.patterns.length ; n++){
                dojo.create('div', {
                    style: { width:"24px", height:"40px" }
                }, dojo.create('td', {
                    className: 'cell sumCell',
                    style	 : { borderLeft:"1px dashed #6393B7", borderRight:"1px dashed #6393B7" }
                }, row));
            }
        }
//		  row = dojo.create('tr', null, thead);
//		  dojo.create('td', {
//		  	colSpan:(this.localObj.dateList.length + this.sumColumns.length + this.localObj.patterns.length + 2),
//		  	style:'height:1px;border-bottom:1px solid #6393B7;'
//		  }, row);
        // 社員行を作成
        for(i = 0 ; i < emps.length ; i++){
            emp = emps[i];
            this.localObj.empIdIndex[emp.Id] = empCnt++;
            row = dojo.create('tr', null, tbody);
            cell = dojo.create('td', {
                id		 : 'emp' + emp.Id,
                className: 'name empCell'
            }, row);
            // 写真
            if(emp.UserId__r && emp.UserId__r.SmallPhotoUrl){
                dojo.create('img', {
                    src 	  : emp.UserId__r.SmallPhotoUrl,
                    style	  : { "float":"left", margin:"1px" },
                    className : 'dayDiv',
                    width	  : '30px',
                    height	  : '30px'
                }, cell);
            }
            // 社員名
            dojo.create('div', { innerHTML: (emp.Title__c || '')  , className: 'dayDiv empTitle', style:'margin:1px;font-size:0.8em;white-space:normal;word-break:break-all;' }, cell);
            dojo.create('div', { innerHTML: (emp.EmpCode__c || ''), className: 'dayDiv' 		, style:'margin:1px;font-size:0.8em;white-space:normal;word-break:break-all;' }, cell);
            dojo.create('div', { innerHTML: emp.Name, className: 'dayDiv', style:'margin:2px 4px;word-break:break-all;' }, cell);
            // 日付毎
            for(n = 0 ; n < this.localObj.dateList.length ; n++){
                var dkey = this.localObj.dateList[n];
                var d = emp.days[dkey];
                var p = null;
                // セル作成
                cell = dojo.create('td', {
                    id		 : ((d.fix || !d.editable) ? 'xd' : 'ed') + dkey + emp.Id,
                    className: 'dayCell ' + ((d.fix || !d.editable) && !this.printFlag ? 'disableCell ' : '') + ((n%2)==0 ? 'even' : 'odd'),
                    style	 : 'min-width:30px;height:30px;vertical-align:top;'
                }, row);
                // セルをダブルクリックするとツールチップダイアログ表示するイベントハンドラをセット
                this.eventDayCells[dkey + emp.Id] = dojo.connect(cell, 'ondblclick', this, function(){
                    var c = cell;
                    var emp_ = emp;
                    var dkey_  = dkey;
                    return function(){
                        that.empDayDialog.setEmpDay(emp_, dkey_, this.normalPatternSymbol);
                        dijit.popup.open({
                            popup: that.empDayDialog.getDialog(),
                            around: c
                        });
                    };
                }());
                // シフト設定済みのサインを表示
                if(d.decrees.patternS && !this.printFlag){
                    cell.style.textAlign = 'center';
                    var div = dojo.create('div', { style: { marginLeft:"auto", marginRight:"auto", display:"table" } }, cell);
                    if(!d.decrees.patternS.Removed__c){
                        dojo.create('div', {
                            className: 'pp_base pp_shift_done',
                            style: { margin:"1px auto", "float":(d.temporary ? 'left' : 'none') }
                        }, div);
                    }
                    if(d.temporary){
                        dojo.create('div', {
                            className: 'pp_base pp_shift_temp_pin',
                            style	 : { margin:"1px", "float":"left" },
                            title	 : (d.Removed__c ? '仮削除状態' : '仮登録状態')
                        }, div);
                    }
                }
                // 申請アイコンを表示（印刷時は非表示）
                if(!this.printFlag){
                    for(var key in d.applys){
                        if(!d.applys.hasOwnProperty(key)){
                            continue;
                        }
                        var aps = d.applys[key];
                        if(dojo.isArray(aps)){
                            for(var x = 0 ; x < aps.length ; x++){
                                dojo.create('div', {
                                    className: 'pp_base pp_ap_' + teasp.view.Shift.getApplyStyleKey(key) + teasp.constant.getStatusStyleSuffix(aps[x].Status__c),
                                    style: { "float":"left" }
                                }, cell);
                            }
                        }else if((!aps.Decree__c || aps.ApplyType__c == teasp.constant.APPLY_TYPE_HOLIDAY)){
                            dojo.create('div', {
                                className: 'pp_base pp_ap_' + teasp.view.Shift.getApplyStyleKey(key) + teasp.constant.getStatusStyleSuffix(aps.Status__c),
                                style: { "float":"left" }
                            }, cell);
                        }
                    }
                }
                // セルの背景色、説明
                if(d.dayType == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY	// 所定休日 or 祝日
                || d.dayType == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
                    cell.style.backgroundColor = teasp.constant.NORMAL_HOLIDAY_COLOR; // 背景色
                    if(this.printFlag){
                        dojo.create('div', {
                            className : 'printDayType',
                            style	  : { "float":"left", color:"blue" },
                            innerHTML : (d.dayType == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY ? '(祝日)' : '(所休)')
                        }, cell);
//					  }else{
//						  cell.style.verticalAlign = 'middle';
//						  dojo.create('div', { className: 'pp_base pp_fix_holy dayDiv', style: 'margin-left:auto;margin-right:auto;' }, cell);
                    }
                }else if(d.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){ // 法定休日
                    cell.style.backgroundColor = teasp.constant.LEGAL_HOLIDAY_COLOR; // 背景色
                    if(this.printFlag){
                        dojo.create('div', { className: 'printDayType', style: { "float":"left", color:"red" }, innerHTML: '(法休)' }, cell);
//					  }else{
//						  cell.style.verticalAlign = 'middle';
//						  dojo.create('div', { className: 'pp_base pp_fix_holy dayDiv', style: 'margin-left:auto;margin-right:auto;' }, cell);
                    }
                }else{ // 平日
                    var holidayAll = (d.applys.holidayAll || (d.applys.holidayAm && d.applys.holidayPm));
                    if(d.plannedHoliday && !d.applys.kyushtu){ // 有休計画付与日
                        cell.style.backgroundColor = teasp.constant.PRIVATE_HOLIDAY_COLOR; // 背景色
                        if(this.printFlag){
                            dojo.create('div', { className: 'printDayType', style: { "float":"left" }, innerHTML: '[休暇]' }, cell);
//						  }else{
//							  cell.style.verticalAlign = 'middle';
//							  dojo.create('div', { className: 'pp_base pp_private_holy dayDiv', style: 'margin-left:auto;margin-right:auto;' }, cell);
                        }
                    }else{
                        if(holidayAll){
                            cell.style.backgroundColor = teasp.constant.PRIVATE_HOLIDAY_COLOR;	// 背景色
                            if(this.printFlag){
                                dojo.create('div', { className: 'printDayType', style: { "float":"left" }, innerHTML: '[休暇]' }, cell);
                            }
                            if(d.applys.holidayAll){
                                var ch = (d.applys.holidayAll.HolidayId__r.Symbol__c || d.applys.holidayAll.HolidayId__r.Name.substring(0, 1));
                                dojo.create('div', { className: 'holyIcon dayDiv', style: { "float":"left" }, innerHTML: ch }, cell);
                            }else{
                                var ch = (d.applys.holidayAm.HolidayId__r.Symbol__c || d.applys.holidayAm.HolidayId__r.Name.substring(0, 1));
                                dojo.create('div', { className: 'holyIcon dayDiv', style: { "float":"left" }, innerHTML: ch }, cell);
                                ch = (d.applys.holidayPm.HolidayId__r.Symbol__c || d.applys.holidayPm.HolidayId__r.Name.substring(0, 1));
                                dojo.create('div', { className: 'holyIcon dayDiv', style: { "float":"left" }, innerHTML: ch }, cell);
                            }
                        }else{
                            if(this.printFlag){
                                if(d.applys.holidayAm){
                                    dojo.create('div', { className: 'printDayType', style: { "float":"left" }, innerHTML: '[午前休]' }, cell);
                                }else if(d.applys.holidayPm){
                                    dojo.create('div', { className: 'printDayType', style: { "float":"left" }, innerHTML: '[午後休]' }, cell);
                                }
                            }
                            if(d.applys.holidayAm){
                                var ch = (d.applys.holidayAm.HolidayId__r.Symbol__c || d.applys.holidayAm.HolidayId__r.Name.substring(0, 1));
                                dojo.create('div', { className: 'holyIcon dayDiv', style: { "float":"left" }, innerHTML: ch }, cell);
                            }else if(d.applys.holidayPm){
                                var ch = (d.applys.holidayPm.HolidayId__r.Symbol__c || d.applys.holidayPm.HolidayId__r.Name.substring(0, 1));
                                dojo.create('div', { className: 'holyIcon dayDiv', style: { "float":"left" }, innerHTML: ch }, cell);
                            }
                            // 勤務パターンアイコンを表示
                            if(d.pattern){
                                p = d.pattern;
                                var ch = (d.pattern.Symbol__c || d.pattern.Name.substring(0, 1));
                                dojo.create('div', { className: 'pattern dayDiv', style: { "float":"left" }, innerHTML: ch }, cell);
                            }else{
                                p = emp.empType.days[dkey].config;
                                if(this.normalPatternSymbol){
                                    dojo.create('div', { className: 'pattern dayDiv', style: { "float":"left" }, innerHTML: this.normalPatternSymbol }, cell);
                                }
                            }
                            // 部署アイコンを表示
                            if(d.workPlace && d.workPlace.Id != emp.DeptId__c){ // 勤務場所の指定があり、所属部署と異なる場合
                                var ch = (d.workPlace.Symbol__c || d.workPlace.Name.substring(0, 1));
                                dojo.create('div', { className: 'workPlace dayDiv', style: { "float":"left" }, innerHTML: ch }, cell);
                                places[d.workPlace.Id] = d.workPlace;
                            }
                        }
                    }
                }
                if(p){
                    dojo.create('div', { style: { clear:"left" } }, cell);
                    var buf = teasp.util.time.timeValue(p.StdStartTime__c) + ' -<br/>' + teasp.util.time.timeValue(p.StdEndTime__c);
                    var div = dojo.create('div', { innerHTML: buf, className: 'dayTime', style: { whiteSpace:"nowrap", fontSize:"10px", fontFamily:"sans-serif", margin:"0px" } }, cell);
                    dojo.style(div, 'display', (displayTimeOn ? '' : 'none'));
                }
            }
            // 社員別集計１（勤務日、休日、休暇）
            for(n = 0 ; n < this.sumColumns.length ; n++){
                var sc = this.sumColumns[n];
                dojo.create('div', {
                    innerHTML: (emp.countDays[sc.headId] || ''),
                    style	 : 'white-space:nowrap;margin-right:2px;word-break:break-all;'
                }, dojo.create('td', {
                    className: 'cell sumCell',
                    style: 'min-width:30px;text-align:center;vertical-align:middle'
                }, row));
            }
            // 社員別集計２（勤務パターン別）
            for(n = 0 ; n < this.localObj.patterns.length ; n++){
                var p = this.localObj.patterns[n].pattern;
                cell = dojo.create('td', {
                    className: 'cell sumCell',
                    style: 'min-width:30px;text-align:center;vertical-align:middle'
                }, row);
                var cnt = emp.countDays[p ? p.Id : '(null)'];
                dojo.create('div', {
                    innerHTML: '' + (cnt || ''),
                    style	 : 'white-space:nowrap;margin-right:2px;word-break:break-all;'
                }, cell);
            }
        }
    }
    // 日付別集計エリア作成
    if(this.localObj.param.deptId){
        // ブランク行を作成
        row = dojo.create('tr', null, tbody);
        dojo.create('div', {
            innerHTML: (this.localObj.param.deptId == '-1' ? '（部署未設定）' : (this.localObj.param.deptName || '')) + '集計',
            style	 :'width:100px;font-size:0.9em;word-break:break-all;'
        }, dojo.create('td', { style:'vertical-align:bottom;text-align:left;', className:'whiteCell' }, row));
        for(n = 0 ; n < this.localObj.dateList.length ; n++){
            cell = dojo.create('td', {
                style:'border-left:1px dashed #6393B7;border-right:1px dashed #6393B7;height:50px;',
                className:'dayCell'
            }, row);
        }
        for(n = 0 ; n < this.sumColumns.length ; n++){
            dojo.create('td', { className:'sumCell' }, row);
        }
        for(n = 0 ; n < this.localObj.patterns.length ; n++){
            dojo.create('td', { className:'sumCell' }, row);
        }
        // 日別集計行を作成
        for(i = 0 ; i < this.localObj.patterns.length ; i++){
            var p = this.localObj.patterns[i].pattern;
            row  = dojo.create('tr', null, tbody);
            cell = dojo.create('td', { className: 'sumHoriz2Cell whiteCell', style: { textAlign:"left", verticalAlign:"middle" } }, row);
            if(p){
                var ch = (p.Symbol__c || p.Name.substring(0, 1));
                dojo.create('div', { className: 'pattern', style: { "float":"left" }, innerHTML: ch }, cell);
                dojo.create('div', { innerHTML: p.Name, style:'float:left;margin:2px;word-break:break-all;' }, cell);
            }else{
                if(this.normalPatternSymbol){
                    dojo.create('div', { className: 'pattern', style: { "float":"left" }, innerHTML: this.normalPatternSymbol }, cell);
                }
                dojo.create('div', { innerHTML: '通常勤務', style: { "float":"left", margin:"2px" } }, cell);
            }
            var countDaysWp = (this.localObj.countDays[this.localObj.param.deptId || '(null)'] || {});
            for(n = 0 ; n < this.localObj.dateList.length ; n++){
                var dkey = this.localObj.dateList[n];
                cell = dojo.create('td', {
                    id			 : 'bd' + dkey,
                    className	 : 'dayCell ' + ((n%2)==0 ? 'even' : 'odd'),
                    style		 : 'border:1px solid #6393B7;min-width:30px;height:16px;text-align:center;vertical-align:middle;'
                }, row);
                var cnt = (countDaysWp[dkey] || {})[p ? p.Id : '(null)'];
                dojo.create('div', {
                    innerHTML: '' + (cnt || ''),
                    style	 : { whiteSpace:"nowrap", marginRight:"2px" }
                }, cell);
            }
            for(n = 0 ; n < this.sumColumns.length ; n++){
                dojo.create('td', { className:'sumCell', style:'min-width:30px;' }, row);
            }
            for(n = 0 ; n < this.localObj.patterns.length ; n++){
                dojo.create('td', { className:'sumCell', style:'min-width:30px;' }, row);
            }
        }
    }
//	  cell = dojo.create('td', {
//	  	colSpan:(this.localObj.dateList.length + this.sumColumns.length + this.localObj.patterns.length + 2)
//	  }, dojo.create('tr', null, tbody));

    // 凡例エリア作成
    this.createExplanation(baseDiv, places);
//	  this.createExplanation(cell, places);

    if(!this.printFlag){
        // セルにイベントを割り当て
        dojo.byId('shiftTable').onmouseup	= function(event){ that.mouseUp(this, event); return false; };
        dojo.query('.dayCell').forEach(function(elem){
            elem.onmousedown = function(event){ that.mouseDown(this, event); return false; };
            elem.onmousemove = function(event){ that.mouseMoveCell(this, event); return false; };
        });
        dojo.query('tbody .empCell').forEach(function(elem){
            elem.onmousedown = function(event){ that.mouseDown(this, event); return false; };
            elem.onmousemove = function(event){ that.mouseMoveCell(this, event); return false; };
        });
        dojo.query('.dayDiv').forEach(function(elem){
            elem.onmousedown = function(event){ that.mouseDown(this, event); return false; };
            elem.onmousemove = function(event){ that.mouseMoveCell(this, event); return false; };
        });
        dijit.popup.close(this.empSelectDialog.getDialog());
        dojo.style('changeRealSave', 'display', (this.temporaryShiftId.length > 0 ? '' : 'none'));
    }

    this.resizeArea();
    setTimeout(dojo.hitch(this, function(){
        this.resizeWidth();
    }), 100);
    this.returnScrollTop(); // 更新前のスクロール位置に戻す
    this.closeBusyWait();
    this.initMenuEnable();
};

/**
 * 凡例エリアを作成
 *
 */
teasp.view.Shift.prototype.createExplanation = function(baseDiv, places){
    this.largeSymbolFlag = false; // 3文字の略号があるか
    var shiftLegend = dojo.create('div', {
        id:'shiftLegend',
        style:'border:1px solid #6393B7;padding:5px 10px;margin-top:5px;text-align:left;vertical-align:top;display:none;'
    }, baseDiv);
    var tbody = dojo.create('tbody', null, dojo.create('table', { className: 'pane_table' }, shiftLegend));
    var lcell = dojo.create('td', null, dojo.create('tr', null, tbody));

    dojo.create('div', { innerHTML: '<<凡例>>',  style: { "float":"left", margin:"2px 12px 2px 0px" } }, lcell);

    // 背景色の説明
    tbody = dojo.create('tbody', null, dojo.create('table', { className: 'explana' }, lcell));
    var row   = dojo.create('tr', null, tbody);
    var div = dojo.create('div', { style: { height:"16px", border:"1px solid #6393B7" } }, dojo.create('td', null, row));
    div.style.backgroundColor = teasp.constant.NORMAL_HOLIDAY_COLOR;
    if(this.printFlag){
        dojo.create('div', { className: 'printDayType', style: { color:"blue" }, innerHTML: '(所休)' }, div);
    }else{
        div.style.width = '18px';
    }
    div = dojo.create('div', { innerHTML: '所定休日' }, dojo.create('td', null, row));
    if(!this.printFlag){
        div.innerHTML += '(含祝日)';
    }

    tbody = dojo.create('tbody', null, dojo.create('table', { className: 'explana' }, lcell));
    row = dojo.create('tr', null, tbody);
    div = dojo.create('div', { style: { height:"16px", border:"1px solid #6393B7" } }, dojo.create('td', null, row));
    div.style.backgroundColor = teasp.constant.LEGAL_HOLIDAY_COLOR;
    if(this.printFlag){
        dojo.create('div', { className: 'printDayType', style: { color:"red" }, innerHTML: '(法休)' }, div);
    }else{
        div.style.width = '18px';
    }
    div = dojo.create('div', { innerHTML: '法定休日' }, dojo.create('td', null, row));

    tbody = dojo.create('tbody', null, dojo.create('table', { className: 'explana' }, lcell));
    row = dojo.create('tr', null, tbody);
    div = dojo.create('div', { style: { height:"16px", border:"1px solid #6393B7" } }, dojo.create('td', null, row));
    div.style.backgroundColor = teasp.constant.PRIVATE_HOLIDAY_COLOR;
    if(this.printFlag){
        dojo.create('div', { className: 'printDayType', style: { color:"black" }, innerHTML: '[休暇]' }, div);
    }else{
        div.style.width = '18px';
    }
    div = dojo.create('div', { innerHTML: '終日の休暇' }, dojo.create('td', null, row));

    // シフト済み、勤務確定済みサインの説明（印刷時は非表示）
    if(!this.printFlag){
        tbody = dojo.create('tbody', null, dojo.create('table', { className: 'explana' }, lcell));
        row   = dojo.create('tr', null, tbody);
        dojo.create('div', { className: 'pp_base pp_shift_done', style: { margin:"1px" } }, dojo.create('td', null, row));
        dojo.create('div', { innerHTML: 'シフト設定済み' }, dojo.create('td', null, row));

        tbody = dojo.create('tbody', null, dojo.create('table', { className: 'explana' }, lcell));
        row   = dojo.create('tr', null, tbody);
        dojo.create('div', { className: 'pp_base pp_shift_temp_pin', style: { margin:"1px" } }, dojo.create('td', null, row));
        dojo.create('div', { innerHTML: '仮登録' }, dojo.create('td', null, row));

        tbody = dojo.create('tbody', null, dojo.create('table', { className: 'explana', style: { "float":"none" } }, lcell));
        row   = dojo.create('tr', null, tbody);
        dojo.create('div', { className: 'disableCell', style: { width:"20px", height:"16px", border:"1px solid #6393B7" } }, dojo.create('td', null, row));
        dojo.create('div', { innerHTML: '勤務確定済みまたは編集不可' }, dojo.create('td', null, row));
    }
    dojo.create('div', { style: { clear:"left" } }, lcell);

    // 勤務パターンアイコンの説明
    if(this.normalPatternSymbol){
        tbody = dojo.create('tbody', null, dojo.create('table', { className: 'explana' }, lcell));
        row = dojo.create('tr', null, tbody);
        dojo.create('div', { className: 'pattern', innerHTML: this.normalPatternSymbol }, dojo.create('td', null, row));
        dojo.create('div', { innerHTML: '通常勤務(始業・終業時刻は勤務体系毎に異なります)' }, dojo.create('td', null, row));
    }
    for(var i = 0 ; i < this.localObj.patterns.length ; i++){
        var p = this.localObj.patterns[i].pattern;
        if(!p){
            continue;
        }
        tbody = dojo.create('tbody', null, dojo.create('table', { className: 'explana' }, lcell));
        row = dojo.create('tr', null, tbody);
        var ch = (p.Symbol__c || p.Name.substring(0, 1));
        if(!this.largeSymbolFlag && ch.length > 2){
            this.largeSymbolFlag = true;
        }
        dojo.create('div', { className: 'pattern', innerHTML: ch }, dojo.create('td', null, row));
        dojo.create('div', { innerHTML: p.Name, style:'white-space:normal;word-break:break-all;' }, dojo.create('td', null, row));
        var buf = teasp.util.time.timeValue(p.StdStartTime__c) + '～' + teasp.util.time.timeValue(p.StdEndTime__c);
        dojo.create('div', { innerHTML: buf }, dojo.create('td', null, row));
        var rt = (p.RestTimes__c && p.RestTimes__c.length > 0 ? p.RestTimes__c.split(/,/) : []);
        var tmps = [];
        for(var j = 0 ; j < rt.length ; j++){
            var match = /(\d+)\-(\d+)/.exec(rt[j]);
            if(match){
                tmps.push(teasp.util.time.timeValue(match[1]) + '～' + teasp.util.time.timeValue(match[2]));
            }
        }
        dojo.create('div', { innerHTML: '(休憩：' + (tmps.length > 0 ? tmps.join(', ') : 'なし') + ')', style:'white-space:normal;' }, dojo.create('td', null, row));
        if(p.UseDiscretionary__c){ // 裁量
            dojo.create('div', { innerHTML: ' (裁量)' }, dojo.create('td', null, row));
        }
    }
    if(i > 0){
        dojo.create('div', { style: { clear:"left" } }, lcell);
    }
    // 休暇アイコンの説明
    for(i = 0 ; i < this.localObj.holidays.length ; i++){
        var h = this.localObj.holidays[i].holiday;
        if(!h){
            continue;
        }
        tbody = dojo.create('tbody', null, dojo.create('table', { className: 'explana' }, lcell));
        row = dojo.create('tr', null, tbody);
        var ch = (h.Symbol__c || h.Name.substring(0, 1));
        if(!this.largeSymbolFlag && ch.length > 2){
            this.largeSymbolFlag = true;
        }
        dojo.create('div', { className: 'holyIcon', innerHTML: ch }, dojo.create('td', null, row));
        dojo.create('div', { innerHTML: h.Name }, dojo.create('td', null, row));
    }
    if(i > 0){
        dojo.create('div', { style: { clear:"left" } }, lcell);
    }
    // 部署アイコンの説明
    i = 0;
    for(var key in places){
        if(!places.hasOwnProperty(key)){
            continue;
        }
        var wp = places[key];
        tbody = dojo.create('tbody', null, dojo.create('table', { className: 'explana' }, lcell));
        row   = dojo.create('tr', null, tbody);
        var ch = (wp.Symbol__c || wp.Name.substring(0, 1));
        if(!this.largeSymbolFlag && ch.length > 2){
            this.largeSymbolFlag = true;
        }
        dojo.create('div', { className: 'workPlace', innerHTML: ch }, dojo.create('td', null, row));
        dojo.create('div', { innerHTML: (wp.DeptCode__c ? wp.DeptCode__c + '-' : '') + wp.Name }, dojo.create('td', null, row));
        i++;
    }
    if(i > 0){
        dojo.create('div', { style: { clear:"left" } }, lcell);
    }
    // 申請アイコンの説明（印刷時は非表示）
    if(!this.printFlag){
        var applyIcons = [
                          { name: '休暇申請'			  , style: 'kyun' },
                          { name: '休暇申請(時間単位)'	  , style: 'kyut' },
                          { name: '勤務時間変更申請(短期)', style: 'pats' },
                          { name: '直行・直帰申請', style: 'patl' },
                          { name: '休日出勤申請'		  , style: 'hwrk' },
                          { name: '振替申請'			  , style: 'exch' }
                      ];

        for(i = 0 ; i < applyIcons.length ; i++){
            var ic = applyIcons[i];
            tbody = dojo.create('tbody', null, dojo.create('table', { className: 'explana' }, lcell));
            row   = dojo.create('tr', null, tbody);
            dojo.create('div', { className: 'pp_base pp_ap_' + ic.style + '_up', style: { marginTop:"2px" } }, dojo.create('td', { style: { padding:"1px" } }, row));
            dojo.create('div', { className: 'pp_base pp_ap_' + ic.style + '_ok', style: { marginTop:"2px" } }, dojo.create('td', { style: { padding:"1px" } }, row));
            dojo.create('div', { innerHTML: ic.name }, dojo.create('td', null, row));
        }
        tbody = dojo.create('tbody', null, dojo.create('table', { className: 'explana' }, lcell));
        row   = dojo.create('tr', null, tbody);
        dojo.create('div', { innerHTML: '(', style: { fontSize:"0.9em" } }, dojo.create('td', null, row));
        dojo.create('div', { className: 'pp_base pp_ap_revt_up', style: { marginTop:"2px" } }, dojo.create('td', { style: { padding:"0px" } }, row));
        dojo.create('div', { innerHTML: '=承認待ち ', style: { fontSize:"0.9em" } }, dojo.create('td', null, row));
        dojo.create('div', { className: 'pp_base pp_ap_revt_ok', style: { marginTop:"2px" } }, dojo.create('td', { style: { padding:"0px" } }, row));
        dojo.create('div', { innerHTML: '=承認済み )', style: { fontSize:"0.9em" } }, dojo.create('td', null, row));
        dojo.create('div', { style: { clear:"left" } }, lcell);
    }
    dojo.style(shiftLegend, 'display', (dojo.byId('displayLegend').checked ? '' : 'none'));
};

/**
 * マウスダウンイベント
 *
 * @param {Object} table
 * @param {Object} e
 */
teasp.view.Shift.prototype.mouseDown = function(table, e){
    if (!e) e = window.event;
    if(e.button == 2){
        return;
    }
    this.startCell = e.srcElement? e.srcElement: e.target;
    if(this.startCell.tagName == 'DIV' || this.startCell.tagName == 'IMG'){
        this.startCell = this.startCell.parentNode;
    }
    if(this.startCell.tagName != "TD"){
        this.startCell = null;
        return;
    }
    this.mouseMoveCell(table, e);
};

/**
 * マウスアップイベント
 *
 * @param {Object} table
 * @param {Object} e
 */
teasp.view.Shift.prototype.mouseUp = function(table, e){
    if (!e) e = window.event;

    var endCell = e.srcElement?e.srcElement:e.target;
    if(endCell.tagName == 'DIV' || endCell.tagName == 'IMG'){
        endCell = endCell.parentNode;
    }
    if(!(endCell.tagName=="TD" && this.startCell))
        return false;

    //mouseMoveで選択状態表示の更新をさせないようにする
    this.startCell = null;
};

/**
 * マウスドラッグイベント
 *
 * @param {Object} table
 * @param {Object} e
 */
teasp.view.Shift.prototype.mouseMoveCell = function(table, e){
    if (!e) e = window.event;
    if(!this.startCell){
        return;
    }
    var ctrlkey = (e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey);
    var endCell = e.srcElement?e.srcElement:e.target;
    if(endCell.tagName == 'DIV' || endCell.tagName == 'IMG'){
        endCell = endCell.parentNode;
    }
    if(!(endCell.tagName=="TD" && this.startCell))
        return false;
    var sh = this.startCell.id.substring(0, 3);
    var eh = endCell.id.substring(0, 3);
    if(sh == 'ed2' && eh == 'ed2'){
        var sd = this.startCell.id.substring(2, 12);
        var ed = endCell.id.substring(2, 12);
        var sei = this.localObj.empIdIndex[this.startCell.id.substring(12)];
        var eei = this.localObj.empIdIndex[endCell.id.substring(12)];
        if(sd > ed){
            var d = sd;
            sd = ed;
            ed = d;
        }
        if(sei > eei){
            var i = sei;
            sei = eei;
            eei = i;
        }
        dojo.query('.dayCell').forEach(function(elem){
            if(/^[dwveb]d2/.test(elem.id.substring(0, 3))){
                var d = elem.id.substring(2, 12);
                var i = this.localObj.empIdIndex[elem.id.substring(12)];
                if(sd <= d && d <= ed && sei <= i && i <= eei){
                    dojo.addClass(elem, 'selCell');
                }else if(!ctrlkey){
                    dojo.removeClass(elem, 'selCell');
                }
            }
        }, this);
        dojo.query('tbody .empCell').forEach(function(elem){ dojo.removeClass(elem, 'selCell'); }, this);
        this.setMenuEnable(0, true);
    }else if(/^[dwveb]d2/.test(sh) && /^[dwveb]d2/.test(eh)){
        var sd = this.startCell.id.substring(2, 12);
        var ed = endCell.id.substring(2, 12);
        if(sd > ed){
            var d = sd;
            sd = ed;
            ed = d;
        }
        dojo.query('.dayCell').forEach(function(elem){
            if(/^[dwveb]d2/.test(elem.id.substring(0, 3))){
                var d = elem.id.substring(2, 12);
                if(sd <= d && d <= ed){
                    dojo.addClass(elem, 'selCell');
                }else if(!ctrlkey){
                    dojo.removeClass(elem, 'selCell');
                }
            }
        }, this);
        dojo.query('tbody .empCell').forEach(function(elem){ dojo.removeClass(elem, 'selCell'); }, this);
        this.setMenuEnable(0, true);
    }else if(sh == 'emp' && eh == 'emp'){
        var dcnt = 0;
        if(ctrlkey){
            dojo.query('.dayCell').forEach(function(elem){
                if(dojo.hasClass(elem, 'selCell')){
                    dcnt++;
                }
            }, this);
            if(dcnt > 0){
                return;
            }
        }
        var ecnt = 0;
        var sx = this.localObj.empIdIndex[this.startCell.id.substring(3)];
        var ex = this.localObj.empIdIndex[endCell.id.substring(3)];
        dojo.query('tbody .empCell').forEach(function(elem){
            var x = this.localObj.empIdIndex[elem.id.substring(3)];
            if(sx <= x && x <= ex){
                dojo.addClass(elem, 'selCell');
                ecnt++;
            }else if(!ctrlkey){
                dojo.removeClass(elem, 'selCell');
            }
        }, this);
        dojo.query('.dayCell').forEach(function(elem){ dojo.removeClass(elem, 'selCell'); }, this);
        this.setMenuEnable(ecnt, false);
    }
};

/**
 * 右クリックメニューの非活性/活性状態を初期化する
 * 0: シフト 
 * 1: 罫線
 * 2: キャンセル
 */
teasp.view.Shift.prototype.initMenuEnable = function(){
    this.pMenu.getChildren()[0].setDisabled(true);
};

/**
 * 右クリックメニューの非活性/活性状態を変更する
 * @param ecnt 
 * @param dayf 日を右クリックしたか否か 日：true、社員名：false
 * 0: シフト 
 * 1: 罫線
 * 2: キャンセル
 */
teasp.view.Shift.prototype.setMenuEnable = function(ecnt, dayf){
    this.pMenu.getChildren()[0].setDisabled(dayf && (this.localObj.emps||[]).length > 0 ? false : true);
};

/**
 * シフト設定ダイアログを開く
 *
 */
teasp.view.Shift.prototype.openShiftSetting = function(){
    var target = {};
    dojo.query('.dayCell').forEach(function(elem){
        if(dojo.hasClass(elem, 'selCell')){
            var match = /^[dwve]d(\d{4}\-\d{2}\-\d{2})(.+)$/.exec(elem.id);
            if(match){
                var dkey = match[1];
                var empId = match[2];
                if(!target[empId]){
                    target[empId] = { dateList: [] };
                }
                target[empId].dateList.push(dkey);
            }
        }
    }, this);
    teasp.manager.dialogOpen(
        'ShiftSetting',
        { target : target, importResultFlag:(this.importResultFlag || false) },
        this.localObj,
        this,
        this.updateShift
    );
};

teasp.view.Shift.prototype.openSelectDept = function(){
    var deptId = dojo.byId('selectDepts').value;
    teasp.manager.dialogOpen(
        'SelectDept',
        null,
        {
            depts: this.levelDepts,
            localObj: this.localObj
        },
        this,
        function(req, errorAreaId, callback, thisObject){
            if(req.targetId){
                dojo.byId('selectDepts').value = req.targetId;
            }
            if(callback){
                callback.apply(thisObject);
            }
        }
    );
};
/**
 * CSV出力のダイアログを開く
 *
 */
teasp.view.Shift.prototype.openShiftOutput = function(){
    teasp.manager.dialogOpen(
        'ShiftOutput',
        null,
        this.localObj,
        this,
        this.outputShiftCsv
    );
};
/**
 * CSVインポートダイアログを開く
 *
 */
teasp.view.Shift.prototype.openShiftCsvImport = function(){
    var range = this.getRangeValue();
    if(!range){
        return;
    }
    if(!this.shiftImport){
        this.shiftImport = new teasp.dialog.ShiftCsvImport();
    }
    this.shiftImport.open(
        globalLoadRes.emp,
        range,
        dojo.hitch(this, this.showImportResult)
    );
};

teasp.view.Shift.prototype.changeImportResultMode = function(flag){
    this.importResultFlag = flag;
    var area = dojo.byId(this.printFlag ? 'shiftPrintMain' : 'searchCondition');
    dojo.query('.searchcond_normal', area).forEach(function(el){
        dojo.style(el, 'display', (this.importResultFlag ? 'none' : ''));
    }, this);
    dojo.query('.import_result_title', area).forEach(function(el){
        dojo.style(el, 'display', (this.importResultFlag ? '' : 'none'));
    }, this);
};

teasp.view.Shift.prototype.showImportResult = function(range, empIds){
    this.changeImportResultMode(true);
    var req = {
        month	  : range.month,
        startDate : range.startDate,
        endDate   : range.endDate,
        rangeType : range.rangeType,
        deptId	  : null,
        deptOpt   : 3,
        empIdList : empIds
    };
    this.reflectRange(req);
    this.resetScrollTop(); // スクロール位置の情報をリセット
    this.searchShiftData(req);
};

teasp.view.Shift.prototype.reflectRange = function(req){
    this.currentRangeType = req.rangeType;
    if(!this.currentRangeType){
        var y = Math.floor(req.month / 100);
        var m = req.month % 100;
        dijit.byId('monYear' ).setValue(y);
        dijit.byId('monMonth').setValue(m);
        this.showRangeOfYearMonth();
    }else{
        var d = new Date();
        dijit.byId('monYear' ).setValue(d.getFullYear());
        dijit.byId('monMonth').setValue(d.getMonth() + 1);
        var sd = teasp.util.date.parseDate(req.startDate);
        var ed = teasp.util.date.parseDate(req.endDate);
        dijit.byId('startYear' ).setValue(sd.getFullYear());
        dijit.byId('startMonth').setValue(sd.getMonth() + 1);
        dijit.byId('startDate' ).setValue(sd.getDate());
        dijit.byId('endYear'   ).setValue(ed.getFullYear());
        dijit.byId('endMonth'  ).setValue(ed.getMonth() + 1);
        dijit.byId('endDate'   ).setValue(ed.getDate());
    }
};

/**
 * シフト設定内容をサーバへ送信
 *
 * @param {Object} para パラメータ
 * @param {string} errorAreaId エラーエリアID
 * @param {Function} callback
 * @param {Object} thisObject
 *
 */
teasp.view.Shift.prototype.updateShift = function(para, errorAreaId, callback, thisObject){
    
    var SUMMARY_UNKNOWN = 'SUMMARY_UNKNOWN'; // サマリーが見つからない場合の定数値
    var targets = [];
    var target = {};
    var empIds = [];
    this.localObj.updateErrors = [];

    Object.keys(para.target).forEach(function(empId){
        empIds.push(empId);
        var obj = para.target[empId];

        // その社員に該当する勤怠サマリがあるかないかを検索する
        var attSummaries = [];
        if (this.localObj.attSummary[empId]) {
            attSummaries = this.localObj.attSummary[empId];
        }

        var targetPerSummary = {}; // サマリー毎に分割した 勤務パターン適用結果
        Object.keys(obj).forEach(function(targetDate){

            for (var i = 0; i < attSummaries.length; i++) {
                var attSummary = attSummaries[i];
                if (!targetPerSummary[attSummary.Id]) {
                    targetPerSummary[attSummary.Id] = {};
                }
                // 合致する勤怠サマリが存在する場合
                if (attSummary.startDate <= targetDate && targetDate <= attSummary.endDate) {
                    targetPerSummary[attSummary.Id][targetDate] = obj[targetDate];
                    return;
                }
            }

            // 勤怠サマリーが存在しない場合
            if (!targetPerSummary[SUMMARY_UNKNOWN]) {
                targetPerSummary[SUMMARY_UNKNOWN] = {};
            }
            targetPerSummary[SUMMARY_UNKNOWN][targetDate] = obj[targetDate];
        });

        Object.keys(targetPerSummary).forEach(function(summaryId){
            if (summaryId != SUMMARY_UNKNOWN) {
                target[empId] = targetPerSummary[summaryId];
                targets.push(target);
                target = {};
            } else {
                Object.keys(targetPerSummary[SUMMARY_UNKNOWN]).forEach(function(unknownTargetDate){
                    target[empId] = {[unknownTargetDate] : targetPerSummary[SUMMARY_UNKNOWN][unknownTargetDate]};
                    targets.push(target);
                    target = {};
                });
            }
        });
    }, this);
    if(Object.keys(target).length){
        targets.push(target);
    }
    teasp.manager.dialogOpen('BusyWait');
    this.remenberScrollTop(); // 更新前のスクロール位置を記憶する
    this.updateShiftLoop(targets, 0, errorAreaId, callback, thisObject);
};

teasp.view.Shift.prototype.updateShiftLoop = function(targets, index, errorAreaId, callback, thisObject){
    if(index >= targets.length){
        console.log('update finish');
        console.log(this.localObj.updateErrors);

        this.searchShiftData(this.localObj.param);

        if (this.localObj.updateErrors.length) {
            var errorMessage = this.buildUpdateErrorMessage(this.localObj.updateErrors);
            this.showError(errorMessage);
        }

        callback.apply(thisObject, []);
        // BusyWait は検索結果表示後に閉じられる
        return;
    }
    console.log('update shift ' + (index + 1) + '/' + targets.length);
    this.contactForUpdate(
        {
            funcName	: 'updateShift',
            params		: { target: targets[index] },
            errorAreaId : errorAreaId
        },
        function(result){
            this.updateShiftLoop(targets, ++index, errorAreaId, callback, thisObject);
        },
        function(result){
            this.localObj.updateErrors.push(result);
            this.updateShiftLoop(targets, ++index, errorAreaId, callback, thisObject);
        },
        this
    );
};

/**
 * シフト設定削除をサーバへ送信
 *
 */
teasp.view.Shift.prototype.deleteShift = function(){
    var SUMMARY_UNKNOWN = 'SUMMARY_UNKNOWN';
    var alltarget = {};
    var targets = [];
    var target = {};

    this.localObj.updateErrors = [];

    dojo.query('.dayCell').forEach(function(elem){
        if(dojo.hasClass(elem, 'selCell')){
            var match = /^[dwve]d(\d{4}\-\d{2}\-\d{2})(.+)$/.exec(elem.id);
            if(match){
                var dkey = match[1];
                var empId = match[2];

                if (!alltarget[empId]) {
                    alltarget[empId] = {};
                }
                alltarget[empId][dkey] = {
                        "patternId" : "-",
                        "dayType" : null
                    };
            }
        }
    }, this);

    Object.keys(alltarget).forEach(function(empId){
        var obj = alltarget[empId];

        // その社員に該当する勤怠サマリがあるかないかを検索する
        var attSummaries = [];
        if (this.localObj.attSummary[empId]) {
            attSummaries = this.localObj.attSummary[empId];
        }

        var targetPerSummary = {}; // サマリー毎に分割した 勤務パターン適用結果
        Object.keys(obj).forEach(function(targetDate){

            for (var i = 0; i < attSummaries.length; i++) {
                var attSummary = attSummaries[i];
                if (!targetPerSummary[attSummary.Id]) {
                    targetPerSummary[attSummary.Id] = {};
                }
                // 合致する勤怠サマリが存在する場合
                if (attSummary.startDate <= targetDate && targetDate <= attSummary.endDate) {
                    targetPerSummary[attSummary.Id][targetDate] = obj[targetDate];
                    return;
                }
            }

            // 勤怠サマリーが存在しない場合
            if (!targetPerSummary[SUMMARY_UNKNOWN]) {
                targetPerSummary[SUMMARY_UNKNOWN] = {};
            }
            targetPerSummary[SUMMARY_UNKNOWN][targetDate] = obj[targetDate];
        });

        Object.keys(targetPerSummary).forEach(function(summaryId){
            if (summaryId != SUMMARY_UNKNOWN) {
                target[empId] = targetPerSummary[summaryId];
                targets.push(target);
                target = {};
            } else {
                Object.keys(targetPerSummary[SUMMARY_UNKNOWN]).forEach(function(unknownTargetDate){
                    target[empId] = {[unknownTargetDate] : targetPerSummary[SUMMARY_UNKNOWN][unknownTargetDate]};
                    targets.push(target);
                    target = {};
                });
            }
        });
    }, this);
    if(Object.keys(target).length){
        targets.push(target);
    }
    teasp.tsConfirmA('シフト設定の削除をします。よろしいですか？', this, function(){
        this.remenberScrollTop();
        teasp.manager.dialogOpen('BusyWait');
        this.deleteShiftLoop(targets, 0);
    });
};

teasp.view.Shift.prototype.deleteShiftLoop = function(targets, index){
    if(index >= targets.length){
        console.log('delete finished')
        console.log(this.localObj.updateErrors);
        this.searchShiftData(this.localObj.param);

        if (this.localObj.updateErrors.length) {
            var errorMessage = this.buildUpdateErrorMessage(this.localObj.updateErrors);
            this.showError(errorMessage);
        }
        // BusyWait は検索結果表示後に閉じられる
        return;
    }
    // EX では勤務パターン適用(updateShift)に空パラメータを渡すことで削除する。
    this.contactForUpdate(
        {
            funcName	: 'updateShift',
            params		: { target: targets[index] }
        },
        function(result){
            this.deleteShiftLoop(targets, ++index);
        },
        function(result){
            this.localObj.updateErrors.push(result);
            this.deleteShiftLoop(targets, ++index);
        },
        true
    );
};

teasp.view.Shift.prototype.buildUpdateErrorMessage = function (updateErrors) {
    var errorMessages = [];
    for (let index = 0; index < updateErrors.length; index++) {
        var updateError = updateErrors[index];
        Array.prototype.push.apply(errorMessages, updateError.error.message.split('\r\n'));
    }
    return errorMessages.join('<br/>');
} 

/**
 * イベント設定をサーバへ送信
 *
 * @param {Object} req パラメータ
 * @param {string} errorAreaId エラーエリアID
 * @param {Function} callback
 * @param {Object} thisObject
 *
 */
teasp.view.Shift.prototype.updateShiftEvent = function(req, errorAreaId, callback, thisObject){
    this.contact(
        {
            funcName	: 'updateShiftEvent',
            params		: req,
            errorAreaId : errorAreaId
        },
        function(result){
            this.searchShiftData(this.localObj.param);
            callback.apply(thisObject, [result]);
        }
    );
};

/**
 * 仮登録を本登録に変える
 *
 */
teasp.view.Shift.prototype.saveToReal = function(){
    teasp.tsConfirmA('仮登録を本登録に変更します。よろしいですか？', this, function(){
        this.remenberScrollTop();
        var targets = [];
        var temps = dojo.clone(this.temporaryShiftId);
        while(temps.length){
            targets.push(temps.splice(0, 1000)); // 1000件ずつに分割
        }
        teasp.manager.dialogOpen('BusyWait');
        this.saveToRealLoop(targets, 0);
    });
};

teasp.view.Shift.prototype.saveToRealLoop = function(targets, index){
    if(index >= targets.length){
        this.searchShiftData(this.localObj.param);
        // BusyWait は検索結果表示後に閉じられる
        return;
    }
    this.contact(
        {
            funcName	: 'updateToReal',
            params		: { applyIds: targets[index] }
        },
        function(result){
            this.saveToRealLoop(targets, ++index);
        },
        true
    );
};

/**
 * メモリ上の社員IDリストを返す
 *
 */
teasp.view.Shift.prototype.getEmpIdList = function(){
    var empIdList = [];
    var emps = (this.localObj.emps || []);
    for(var i = 0 ; i < emps.length ; i++){
        empIdList.push(emps[i].Id);
    }
    return empIdList;
};

/**
 * 社員オブジェクトを返す
 *
 */
teasp.view.Shift.prototype.getEmpById = function(empId){
    var emps = (this.localObj.emps || []);
    for(var i = 0 ; i < emps.length ; i++){
        if(emps[i].Id == empId){
            return emps[i];
        }
    }
    return null;
};

/**
 * 部署オブジェクトを返す
 *
 */
teasp.view.Shift.prototype.getDeptById = function(deptId){
    var depts = (this.localObj.depts || []);
    for(var i = 0 ; i < depts.length ; i++){
        if(depts[i].Id == deptId){
            return depts[i];
        }
    }
    return null;
};

/**
 * 社員検索
 *
 * @param {Object} req パラメータ
 * @param {Function} callback
 * @param {Object} thisObject
 */
teasp.view.Shift.prototype.searchEmp = function(req, errorAreaId, callback, thisObject){
    this.contact(
        {
            funcName	: 'searchEmp',
            params		: req,
            errorAreaId : errorAreaId
        },
        function(result){
            callback.apply(thisObject, [result]);
        },
        true
    );
};

/**
 * キャッシュに社員オブジェクトをセット（クロージャ）
 *
 */
teasp.view.Shift.prototype.setCahceEmps = function(){
    var that = this;
    return function(emps){
        var o = that.cacheEmps;
        if(!o.map){
            o.map = {};
        }
        emps = (emps || []);
        for(var i = 0 ; i < emps.length ; i++){
            o.map[emps[i].Id] = emps[i];
        }
    };
};

/**
 * 社員が選択状態かどうかを返す（クロージャ）
 *
 */
teasp.view.Shift.prototype.getEmpSelected = function(){
    var that = this;
    return function(empId){
        var o = that.cacheEmps;
        if(!o.select){
            o.select = {};
        }
        return (o.select[empId] ? true : false);
    };
};

/**
 * ポップアップメニュー作成
 *
 */
teasp.view.Shift.prototype.createMenu = function(){
    var that = this;
    var pSubMenu;
    this.pMenu = new dijit.Menu({
        targetNodeIds : ["baseDiv"],
        style		  : { fontSize:"12px", zIndex:1000 },
        refocus 	  : false
    });
    //--------------------------------------------------------------------------
    // シフト
    //--------------------------------------------------------------------------
    pSubMenu = new dijit.Menu();
    pSubMenu.addChild(new dijit.MenuItem({
        label: "設定",
        onClick: function(_e) {
            that.openShiftSetting();
        }
    }));
    pSubMenu.addChild(new dijit.MenuItem({
        label: "設定の削除",
        onClick: function(_e) {
            that.deleteShift();
        }
    }));
    this.pMenu.addChild(new dijit.PopupMenuItem({
        label: "シフト",
        popup: pSubMenu
    }));

    //--------------------------------------------------------------------------
    // キャンセル
    //--------------------------------------------------------------------------
    this.pMenu.addChild(new dijit.MenuSeparator());
    this.pMenu.addChild(new dijit.MenuItem({
        label: "キャンセル",
        onClick: function(_e) {
        }
    }));
    this.pMenu.startup();
    this.initMenuEnable();
};

/**
 * 申請種類名をキー名に変換
 *
 * @param {Object} a 申請オブジェクト
 * @param {string} dkey 日付キー
 * @returns {string} キー名
 */
teasp.view.Shift.getApplyKey = function(a, dkey){
    if(a.ApplyType__c == teasp.constant.APPLY_TYPE_HOLIDAY){
        if(a.HolidayId__r.Range__c		 == teasp.constant.RANGE_ALL ){ return teasp.constant.APPLY_KEY_HOLIDAY_ALL;
        }else if(a.HolidayId__r.Range__c == teasp.constant.RANGE_AM  ){ return teasp.constant.APPLY_KEY_HOLIDAY_AM;
        }else if(a.HolidayId__r.Range__c == teasp.constant.RANGE_PM  ){ return teasp.constant.APPLY_KEY_HOLIDAY_PM;
        }else if(a.HolidayId__r.Range__c == teasp.constant.RANGE_TIME){ return teasp.constant.APPLY_KEY_HOLIDAY_TIME;
        }
    }else if(a.ApplyType__c == teasp.constant.APPLY_TYPE_ZANGYO    ){ return teasp.constant.APPLY_KEY_ZANGYO;
    }else if(a.ApplyType__c == teasp.constant.APPLY_TYPE_DIRECT    ){ return teasp.constant.APPLY_KEY_DIRECT;
    }else if(a.ApplyType__c == teasp.constant.APPLY_TYPE_EARLYSTART){ return teasp.constant.APPLY_KEY_EARLYSTART;
    }else if(a.ApplyType__c == teasp.constant.APPLY_TYPE_KYUSHTU   ){ return teasp.constant.APPLY_KEY_KYUSHTU;
    }else if(a.ApplyType__c == teasp.constant.APPLY_TYPE_PATTERNS  ){ return teasp.constant.APPLY_KEY_PATTERNS;
    }else if(a.ApplyType__c == teasp.constant.APPLY_TYPE_PATTERNL  ){ return teasp.constant.APPLY_KEY_PATTERNL;
    }else if(a.ApplyType__c == teasp.constant.APPLY_TYPE_LATESTART ){ return teasp.constant.APPLY_KEY_LATESTART;
    }else if(a.ApplyType__c == teasp.constant.APPLY_TYPE_EARLYEND  ){ return teasp.constant.APPLY_KEY_EARLYEND;
    }else if(a.ApplyType__c == teasp.constant.APPLY_TYPE_DAILY	   ){ return teasp.constant.APPLY_KEY_DAILY;
    }else if(a.ApplyType__c == teasp.constant.APPLY_TYPE_EXCHANGE  ){
        if(a.startDate == dkey){
            return teasp.constant.APPLY_KEY_EXCHANGES;
        }else{
            return teasp.constant.APPLY_KEY_EXCHANGEE;
        }
    }
};

/**
 * 申請レコードをオブジェクトにマップ
 *
 * @param {Object} obj マップオブジェクト
 * @param {string} key キー名
 * @param {Object} a 申請オブジェクト
 */
teasp.view.Shift.setApplyToDayObj = function(obj, key, a){
    // 申請種類によっては配列でセット、それ以外はオブジェクトをセット
    if(key == teasp.constant.APPLY_KEY_HOLIDAY		 // 休暇申請
    || key == teasp.constant.APPLY_KEY_HOLIDAY_TIME  // 休暇申請・時間単位休暇
    || key == teasp.constant.APPLY_KEY_ZANGYO		 // 残業申請
    || key == teasp.constant.APPLY_KEY_EARLYSTART	 // 早朝勤務申請
    || key == teasp.constant.APPLY_KEY_KYUSHTU){	 // 休日出勤申請
        if(!obj[key]){
            obj[key] = [];
        }
        obj[key].push(a);
        if(obj[key].length > 1){
            obj[key] = obj[key].sort(function(a, b){
                return (a.ApplyTime__c < b.ApplyTime__c ? 1 : (a.ApplyTime__c > b.ApplyTime__c ? -1 : 0));
            });
        }
    }else if(key == teasp.constant.APPLY_KEY_PATTERNS){
        if(obj[key]){
            var l = [];
            l.push(obj[key]);
            l = l.concat(obj[key].orgs || []);
            l.push(a);
            l = l.sort(function(a, b){
                if(a.TempFlag__c != b.TempFlag__c){
                    return ((a.TempFlag__c && !b.TempFlag__c) ? -1 : 1);
                }else if(a.Removed__c != b.Removed__c){
                    return ((!a.Removed__c && b.Removed__c) ? -1 : 1);
                }
                return 0;
            });
            obj[key] = l.shift();
            obj[key].orgs = l;
        }else{
            obj[key] = a;
        }
    }else{
        obj[key] = a;
    }
};

/**
 * 申請種類キー名に対応するスタイルシートセレクタ名を返す
 *
 * @param {string} key キー名
 * @returns {string} スタイルシートセレクタ名
 */
teasp.view.Shift.getApplyStyleKey = function(key){
    switch(key){
    case teasp.constant.APPLY_KEY_DIRECT	  : return 'patl'; // 直行・直帰申請
    case teasp.constant.APPLY_KEY_PATTERNS	  : return 'pats'; // 勤務時間変更申請
    case teasp.constant.APPLY_KEY_EXCHANGES   : return 'exch'; // 振替申請
    case teasp.constant.APPLY_KEY_EXCHANGEE   : return 'exch'; // 振替申請
    case teasp.constant.APPLY_KEY_HOLIDAY_ALL : return 'kyun'; // 休暇申請
    case teasp.constant.APPLY_KEY_HOLIDAY_AM  : return 'kyun'; // 休暇申請(午前半休)
    case teasp.constant.APPLY_KEY_HOLIDAY_PM  : return 'kyun'; // 休暇申請(午後半休)
    case teasp.constant.APPLY_KEY_HOLIDAY_TIME: return 'kyut'; // 休暇申請(時間単位)
    case teasp.constant.APPLY_KEY_KYUSHTU	  : return 'hwrk'; // 休日出勤申請
    case teasp.constant.APPLY_KEY_ZANGYO	  : return 'zanw'; // 残業申請
    case teasp.constant.APPLY_KEY_EARLYSTART  : return 'east'; // 早朝勤務申請
    case teasp.constant.APPLY_KEY_LATESTART   : return 'late'; // 遅刻申請
    case teasp.constant.APPLY_KEY_EARLYEND	  : return 'earl'; // 早退申請
    case teasp.constant.APPLY_KEY_DAILY 	  : return 'day' ; // 日次確定申請
    }
    return '';
};

/**
 * 申請キー名に対して申請が１件となるように再マッピング.<br/>
 * （時間単位休暇申請は例外）
 *
 * @param {Object} amap 元のマップオブジェクト
 * @returns {Object} マップオブジェクト
 */
teasp.view.Shift.getValidApplys = function(amap){
    var obj = {};
    for(var key in amap){
        if(!amap.hasOwnProperty(key)){
            continue;
        }
        var o = amap[key];
        if(is_array(o) && o.length > 0){
            if(key == teasp.constant.APPLY_KEY_HOLIDAY_TIME){
                obj[key] = o;
            }else{
                obj[key] = o[0];
            }
        }else if(o){
            obj[key] = o;
        }
    }
    return obj;
};

/**
 * 指定日付に適用される勤務パターンを返す.<br/>
 * （teasp.logic.EmpTime.getPatternByDate と同じ処理をするが、要素名が違うので作成）
 *
 * @param {Array.<Object>} patterns 勤務パターンリスト
 * @param {Object} dt 日付
 * @return {Object} 勤務パターンオブジェクト
 */
teasp.view.Shift.getPatternByDate = function(patterns, dt){
    for(var i = 0 ; i < patterns.length ; i++){
        var ep = patterns[i];
        if(ep.SchedOption__c == '1'){ // 毎週Ｘ曜日
            var dw = '' + dt.getDay();
            if(ep.SchedWeekly__c.indexOf(dw) >= 0){
                return ep;
            }
        }else if(ep.SchedOption__c == '2'){ // 毎月Ｘ日
            var dd = parseInt(ep.SchedMonthlyDate__c, 10);
            if(dd == 32){
                dd = teasp.util.date.getMonthEndDay(dt.getFullYear(), dt.getMonth() + 1); // その月の最終日
            }
            if(dd == dt.getDate()){
                return ep;
            }
        }else if(ep.SchedOption__c == '3'){ // 毎月第ＮＸ曜日
            var ll = parseInt(ep.SchedMonthlyLine__c, 10);
            var dl = Math.floor((dt.getDate() + 6) / 7); // 何週目か
            if(ll == 5){
                var lastd = teasp.util.date.getMonthEndDay(dt.getFullYear(), dt.getMonth() + 1); // その月の最終日
                ll = (lastd + 6) / 7; // 最終日の週は何週目か
            }
            var dw = '' + dt.getDay();
            if(dl == ll && ep.SchedMonthlyWeek__c == dw){
                return ep;
            }
        }
    }
    return null;
};

/**
 * 階層関係がわかるように部署名にインデントをつけた表示用文字列を作成
 *
 * @param {Array.<Object>} depts 部署オブジェクトの配列
 * @param {string} sd 期間開始日
 * @param {string} ed 期間終了日
 * @returns {Array.<Object>}
 */
teasp.view.Shift.processingDepts = function(depts, sd, ed){
    var demap = {};
    depts = depts.filter((dept) => dept.ParentChild_ValidFrom__c <= sd && sd < dept.ParentChild_ValidTo__c);
    for(var i = (depts.length - 1) ; i >= 0 ; i--){
        var dept = depts[i];
        dept.past	= (dept.EndDate__c	 && dept.EndDate__c <= sd  );
        dept.future = (dept.StartDate__c && ed < dept.StartDate__c);
        demap[dept.Id] = dept;
        dept.DeptCode__c = (dept.DeptCode__c || dept.Code__c || '');
    }
    for(i = 0 ; i < depts.length ; i++){
        var dept = depts[i];
        if(!dept.ParentId__c){
            continue;
        }
        var parent = demap[dept.ParentId__c];
        if(!parent || parent.past || parent.future){
            if(parent){
                dept.past	= parent.past;
                dept.future = parent.future;
            }else{
                dept.past = true; // 期限切れはサーバ側で削った可能性がある
            }
        }
    }
    depts = depts.sort(function(a, b){
        return (a.DeptCode__c < b.DeptCode__c ? -1 : (a.DeptCode__c > b.DeptCode__c ? 1 : 0));
    });
    teasp.view.Shift.setDeptLevel(depts, null, { order: 1 });
    return depts.sort(function(a, b){
        return a.order - b.order;
    });
};

/**
 * 階層関係がわかるように部署名にインデントをつけた表示用文字列を作成
 *
 * @param {Array.<Object>} depts 部署オブジェクトの配列
 * @param {Object} parent 親部署オブジェクト
 * @param {Object} oo 並び順の番号を持つオブジェクト
 */
teasp.view.Shift.setDeptLevel = function(depts, parent, oo){
    var parentId = (parent ? parent.Id : null);
    for(var i = 0 ; i < depts.length ; i++){
        var dept = depts[i];
        if(dept.ParentId__c == parentId){
            if(parent && (parent.past || parent.future)){
                dept.past	= parent.past;
                dept.future = parent.future;
            }
            dept.level = (parent ? parent.level + 1 : 0);
            var spc = '';
            for(var j = 0 ; j < dept.level ; j++){
                spc += '&nbsp;&nbsp;';
            }
            dept.displayName = spc + dept.DeptCode__c + '-' + dept.Name;
            dept.order = oo.order++;
            teasp.view.Shift.setDeptLevel(depts, dept, oo);
        }
    }
};

/**
 * CSV出力ボタンクリック時の処理
 *
 * @param {Object} req パラメータ
 * @param {Function} callback
 * @param {Object} thisObject
 */
teasp.view.Shift.prototype.outputShiftCsv = function(req, errorAreaId, callback, thisObject){
    var o = (!req.type ? this.getCsvValue1(req) : this.getCsvValue2(req));
    var key = '' + (new Date()).getTime();
    var values = teasp.util.splitByLength(o.value, 30000);
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
            params	  : {
                key   : key,
                head  : (i == 0 ? o.head : null),
                values: valot[i],
                order : (i + 1)
            }
        });
        i++;
    }while(i < valot.length);

    reqs.errorAreaId = errorAreaId;
    var fname = 'shift' + teasp.util.date.formatDateTime(new Date(), 'N14', true) + '.csv';

    this.contact(
        reqs,
        function(result, index){
            if(reqs.length <= (index + 1)){
                teasp.downloadHref(teasp.getPageUrl('extCsvView') + '?key=' + key + (fname ? '&fname=' + fname : ''));
                setTimeout(function(){ callback.apply(thisObject); }, 100);
            }
        },
        true
    );
};

teasp.view.Shift.prototype.downloadDone = function(){
};

teasp.view.Shift.prototype.getHolidayName = function(h, flag){
    if(!h){
        return '';
    }else if(flag){
        return h.Name;
    }
    return (h.Symbol__c || h.Name.substring(0, 1));
};

teasp.view.Shift.prototype.getCsvValue1 = function(req){
    var head = '"部署コード","部署名","役職","社員コード","社員名"';
    var dkeys = teasp.util.date.getDateList(this.localObj.param.startDate, this.localObj.param.endDate);
    var deptId = this.localObj.param.deptId || '(null)';
    for (var i = 0; i < dkeys.length; i++) {
        head += ',"' + teasp.util.date.formatDate(dkeys[i], 'SLA') + '"';
    }
    var value = '"","","","",""';
    for (var i = 0; i < dkeys.length; i++) {
        var dkey = dkeys[i];
        var ev = [];
        if (this.localObj.pubEvents[dkey]) {
            ev.push(this.localObj.pubEvents[dkey]);
        }
        if (this.localObj.events[dkey]) {
            ev.push(this.localObj.events[dkey]);
        }
        value += ',"' + ev.join(teasp.message.getLabel('tm10001470')) + '"';
    }
    // 部署単位で社員・日別の表を作成
    for (var m = 0; m < this.deptKeys.length; m++) {
        var deptKey = this.deptKeys[m];
        var emps = this.localObj.deptMap[deptKey];
        // 社員行を作成
        for (var n = 0; n < emps.length; n++) {
            var emp = emps[n];
            value += '\n"' + (emp.DeptId__r && emp.DeptId__r.DeptCode__c || '') +
            '","' +
            (emp.DeptId__r && emp.DeptId__r.Name || '') +
            '","' +
            (emp.Title__c || '') +
            '","' +
            (emp.EmpCode__c || '') +
            '","' +
            emp.Name +
            '"';
            for (var i = 0; i < dkeys.length; i++) {
                var dkey = dkeys[i];
                var d = emp.days[dkey];
                var p = null;
                var buf = '';
                if (d.dayType == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY) {
                    buf = '(所定休日)';
                } else if (d.dayType == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY) {
                    buf = '(祝日)';
                } else if (d.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY) {
                    buf = '(法定休日)';
                } else {
                    var holidayAll = (d.applys.holidayAll || (d.applys.holidayAm && d.applys.holidayPm));
                    if (d.plannedHoliday && !d.applys.kyushtu) { // 有休計画付与日
                        buf = '[休暇](計画)';
                    } else {
                        if (holidayAll) {
                            if(d.applys.holidayAll){
                                buf = '[休暇](' + this.getHolidayName(d.applys.holidayAll.HolidayId__r, req.holidayFull) + ')';
                            }else{
                                buf = '[休暇](' + this.getHolidayName(d.applys.holidayAm.HolidayId__r, req.holidayFull)
                                         + ',' +  this.getHolidayName(d.applys.holidayPm.HolidayId__r, req.holidayFull) + ')';
                            }
                        } else {
                            if (d.applys.holidayAm) {
                                buf = '[午前休](' + this.getHolidayName(d.applys.holidayAm.HolidayId__r, req.holidayFull) + ')';
                            } else if (d.applys.holidayPm) {
                                buf = '[午後休](' + this.getHolidayName(d.applys.holidayPm.HolidayId__r, req.holidayFull) + ')';
                            }
                            // 勤務パターンアイコンを表示
                            if (d.pattern) {
                                p = d.pattern;
                                if(req.patternFull){
                                    buf += (buf ? '\n' : '') + d.pattern.Name;
                                }else{
                                    var ch = (d.pattern.Symbol__c || d.pattern.Name.substring(0, 1));
                                    buf += (buf ? '\n' : '') + ch;
                                }
                            } else {
                                p = emp.empType.days[dkey].config;
                                if(req.patternFull){
                                    buf += (buf ? '\n' : '') + '(通常勤務)';
                                }
                            }
                            // 部署アイコンを表示
                            if (d.workPlace && d.workPlace.Id != emp.DeptId__c) { // 勤務場所の指定があり、所属部署と異なる場合
                                buf += (buf ? '\n' : '') + '主管部署:' + d.workPlace.Name;
                            }
                        }
                    }
                }
                if (p && req.timeIn) {
                    buf += ((buf ? '\n' : '') + teasp.util.time.timeValue(p.StdStartTime__c) + ' -' + teasp.util.time.timeValue(p.StdEndTime__c));
                }
                if(d.temporary){
                    buf += ((buf ? '\n' : '') + '(仮)');
                }
                value += ',"' + buf + '"';
            }
        }
    }
    return {
        head  : head,
        value : value
    };
};

teasp.view.Shift.prototype.getCsvValue2 = function(req){
    var head = '"部署コード","部署名","役職","社員コード","社員名","日付","曜日","設定","勤務パターン"';
    if(req.timeIn){
        head += ',"始業時刻","終業時刻"';
    }
    head += ',"共通のイベント"';
    var dkeys = teasp.util.date.getDateList(this.localObj.param.startDate, this.localObj.param.endDate);
    var deptId = this.localObj.param.deptId || '(null)';
    var value = '';
    var days = {};
    for (var i = 0; i < dkeys.length; i++) {
        var dkey = dkeys[i];
        days[dkey] = {};
        days[dkey].date = teasp.util.date.formatDate(dkey, 'SLA');
        days[dkey].week = teasp.util.date.formatDate(dkey, 'JPW');
        var ev = [];
        if (this.localObj.pubEvents[dkey]) {
            ev.push(this.localObj.pubEvents[dkey]);
        }
        if (this.localObj.events[dkey]) {
            ev.push(this.localObj.events[dkey]);
        }
        days[dkey].pubEvent = ev.join(teasp.message.getLabel('tm10001470'));
        days[dkey].event = ((this.localObj.deptEvents[deptId] &&
                            this.localObj.deptEvents[deptId].days[dkey] &&
                            this.localObj.deptEvents[deptId].days[dkey].event) || '');
        days[dkey].note = ((this.localObj.deptEvents[deptId] &&
                            this.localObj.deptEvents[deptId].days[dkey] &&
                            this.localObj.deptEvents[deptId].days[dkey].note) || '');
    }
    // 部署単位で社員・日別の表を作成
    for (var m = 0; m < this.deptKeys.length; m++) {
        var deptKey = this.deptKeys[m];
        var emps = this.localObj.deptMap[deptKey];
        // 社員行を作成
        for (var n = 0; n < emps.length; n++) {
            var emp = emps[n];
            for (var i = 0; i < dkeys.length; i++) {
                var dkey = dkeys[i];
                var day = days[dkey];
                var d = emp.days[dkey];
                var p = null;
                var kt = '';
                var pn = '';
                var tp = '';
                var st = '';
                var et = '';
                if (d.dayType == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY) {
                    kt = '(所定休日)';
                } else if (d.dayType == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY) {
                    kt = '(祝日)';
                } else if (d.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY) {
                    kt = '(法定休日)';
                } else {
                    var holidayAll = (d.applys.holidayAll || (d.applys.holidayAm && d.applys.holidayPm));
                    if (d.plannedHoliday && !d.applys.kyushtu) { // 有休計画付与日
                        kt = '[休暇](計画)';
                    } else {
                        if (holidayAll) {
                            if(d.applys.holidayAll){
                                kt = '[休暇](' + this.getHolidayName(d.applys.holidayAll.HolidayId__r, req.holidayFull) + ')';
                            }else{
                                kt = '[休暇](' + this.getHolidayName(d.applys.holidayAm.HolidayId__r, req.holidayFull)
                                         + ',' +  this.getHolidayName(d.applys.holidayPm.HolidayId__r, req.holidayFull) + ')';
                            }
                        } else {
                            if (d.applys.holidayAm) {
                                kt = '[午前休](' + this.getHolidayName(d.applys.holidayAm.HolidayId__r, req.holidayFull) + ')';
                            } else if (d.applys.holidayPm) {
                                kt = '[午後休](' + this.getHolidayName(d.applys.holidayPm.HolidayId__r, req.holidayFull) + ')';
                            }
                            // 勤務パターンアイコンを表示
                            if (d.pattern) {
                                p = d.pattern;
                                if(req.patternFull){
                                    pn = d.pattern.Name;
                                }else{
                                    pn = (d.pattern.Symbol__c || d.pattern.Name.substring(0, 1));
                                }
                            } else {
                                p = emp.empType.days[dkey].config;
                                if(req.patternFull){
                                    pn = '(通常勤務)';
                                }else{
                                    pn = '';
                                }
                            }
                            // 部署アイコンを表示
                            if (d.workPlace && d.workPlace.Id != emp.DeptId__c) { // 勤務場所の指定があり、所属部署と異なる場合
                                tp = d.workPlace.Name;
                            }
                        }
                    }
                }
                if (p) {
                    st = teasp.util.time.timeValue(p.StdStartTime__c);
                    et = teasp.util.time.timeValue(p.StdEndTime__c);
                }
                value += '"' + (emp.DeptId__r && emp.DeptId__r.DeptCode__c || '');
                value += '","' + (emp.DeptId__r && emp.DeptId__r.Name || '');
                value += '","' + (emp.Title__c || '');
                value += '","' + (emp.EmpCode__c || '');
                value += '","' + emp.Name;
                value += '","' + day.date;
                value += '","' + day.week;
                value += '","' + kt + (d.temporary ? '(仮)' : '');
                value += '","' + pn;
                if(req.timeIn){
                    value += '","' + st;
                    value += '","' + et;
                }
                value += '","' + day.pubEvent;
                value += '"\n';
            }
        }
    }
    return {
        head  : head,
        value : value
    };
};

// ウィンドウ幅変更時処理
teasp.view.Shift.prototype.resizeWidth = function(){
    var areaWidth = dojo.byId('workArea').parentNode.offsetWidth;
    var table = dojo.byId('shiftTable');
    var tr = dojo.query('tr', table)[0];
    var cnt = 0;
    dojo.query('td.dayCell,td.sumCell', tr).forEach(function(el){
        cnt++;
    });
    var empW = 150;
    var largeW = dojo.byId('displayTime').checked || this.largeSymbolFlag;
    var mw = (largeW ? 40 : 29);
    var w = Math.max((areaWidth - (empW+this.scrollW)) / cnt, mw);
    dojo.query('td.whiteCell,td.whiteCell > div', table).forEach(function(el){
        if(el.tagName != 'DIV' || !dojo.hasClass(el.parentNode, 'sumHoriz2Cell')){
            dojo.style(el, 'width', empW + 'px');
        }
    });
    dojo.query('td.empCell', table).forEach(function(el){
        dojo.style(el, 'width', empW + 'px');
    });
    dojo.query('td.empCell > div', table).forEach(function(el){
        dojo.style(el, 'width', (empW - 10) + 'px');
    });
    dojo.query('td.dayCell,td.sumCell', table).forEach(function(el){
        dojo.style(el, 'width', w + 'px');
        dojo.style(el, 'min-width', (largeW ? '40px' : '29px'));
    });
    dojo.query('thead td.dayCell > div.event-text', table).forEach(function(el){
        dojo.style(el, 'width', (w - 10) + 'px');
    });
};

// ウィンドウサイズ変更時処理
teasp.view.Shift.prototype.resizeArea = function(){
    this.resizeWidth(); // ウィンドウ幅変更時処理
    var shs = dojo.query('#shiftTable thead');
    if(!shs.length){
        return;
    }
    var shiftLegend = dojo.byId('shiftLegend');
    var showLegend = (shiftLegend && dojo.byId('displayLegend').checked);
    var sh = shs[0];
    var node = dojo.byId('baseDiv');
    var h = (teasp.isSforce() ? 5 : 10);
    while(node.tagName != 'BODY'){
        var d = dojo.style(node, 'display');
        if(!/^table-row/.test(d)){
            h += node.offsetTop;
        }
        node = node.parentNode;
    }
    // アプリ領域のX座標を得る
    node = dojo.byId('big_area');
    var areaH = 0;
    while(node.tagName != 'BODY'){
        var d = dojo.style(node, 'display');
        if(!/^table-row/.test(d)){
            areaH += node.offsetTop;
        }
        node = node.parentNode;
    }
    var bodyH = 0;
    dojo.query('#shiftTable tr').forEach(function(el){
        bodyH += el.offsetHeight;
    });
    // シフト管理表ボディ部の高さ調節
    var box = dojo.window.getBox();
    var height = Math.max((box.h - h - sh.offsetHeight - (showLegend ? shiftLegend.offsetHeight : 0)), 100);
    if(bodyH > height){
        dojo.query('#shiftTable tbody').forEach(function(el){
            dojo.style(el, 'height', (height + areaH) + 'px');
        });
        window.scrollTo(0, areaH);
    }
    var bys = dojo.query('#shiftTable tbody tr > td.whiteCell');
    this.firstDeptHeight = (bys.length ? bys[0].offsetTop - dojo.query('#shiftTable thead')[0].offsetHeight : 0);
};

// 凡例を表示する
teasp.view.Shift.prototype.checkedLegend = function(){
    var shiftLegend = dojo.byId('shiftLegend');
    if(!shiftLegend){
        return;
    }
    dojo.style(shiftLegend, 'display', (dojo.byId('displayLegend').checked ? '' : 'none'));
    this.resizeArea();
};

// スクロール位置の情報をリセット
teasp.view.Shift.prototype.resetScrollTop = function(){
    this.shiftTableScrollTop = 0;
};

// 更新前のスクロール位置を記憶する
teasp.view.Shift.prototype.remenberScrollTop = function(){
    this.shiftTableScrollTop = dojo.query('#shiftTable tbody')[0].scrollTop;
};

// 更新前のスクロール位置に戻す
teasp.view.Shift.prototype.returnScrollTop = function(){
    if(this.shiftTableScrollTop){
        var tbody = dojo.query('#shiftTable tbody')[0];
        if(tbody.scrollTo){
            tbody.scrollTo(0, this.shiftTableScrollTop);
        }else{ // for IE11, Edge
            tbody.scrollTop = this.shiftTableScrollTop;
        }
    }
};

teasp.view.Shift.prototype.closeBusyWait = function(){
    var busyWait = dijit.byId('BusyWait');
    if(busyWait && busyWait.open){
        busyWait.hide();
    }
};
