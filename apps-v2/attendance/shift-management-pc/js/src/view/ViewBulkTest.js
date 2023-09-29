teasp.provide('teasp.view.BulkTest');
/**
 * テストデータ作成画面用
 *
 * @constructor
 * @extends {teasp.view.Base}
 * @author DCI小島
 */
teasp.view.BulkTest = function(){
    /** @private */
    this.rangeYear = null;
    /** @private */
    this.viewPos = null;
    /** @private */
    this.eventHandles = {};
    this.busy = false;
    this.stopped = false;
    this.currentMenuNo = null;
    this.dayWorks = null;
    this.jobMap = null;
    this.itemMap = null;
    this.execInit = false;
    this.masterEmps = []; // サーバから取得の社員リスト
    this.masterExpItem = {}; // サーバから取得の費目マップ
    this.nameSpacePrefix = '';
};

teasp.view.BulkTest.prototype = new teasp.view.Base();

/**
 * 画面初期化
 *
 * @param {Object} messageMap メッセージテーブル
 * @param {Function} onSuccess レスポンス正常受信時の処理
 * @param {Function} onFailure レスポンス異常受信時の処理
 * @this {teasp.view.BulkTest}
 */
teasp.view.BulkTest.prototype.init = function(messageMap, onSuccess, onFailure){

    teasp.message.mergeLabels(globalMessages || {});
    teasp.message.mergeLabels(messageMap ? (messageMap[teasp.message.getLanguageLocaleKey()] || {}) : {});

    this.nameSpacePrefix = this.getNameSpacePrefix();

    this.readParams({
        target  : 'empMonth',
        noDelay : true
    });

    // サーバへリクエスト送信
    teasp.manager.request(
        'loadEmpMonth',
        this.viewParams,
        this.pouch,
        {
            hideBusy : true
        },
        this,
        function(){
            this.setBusy(false);
            this.initView();
            onSuccess();
        },
        function(event){
            this.setBusy(false);
            onFailure(event);
        }
    );
};

/**
 * 画面初期化
 *
 * @this {teasp.view.BulkTest}
 */
teasp.view.BulkTest.prototype.initView = function(){
    dojo.connect(dojo.byId('testMenu1'), 'onclick', this, function(){
        this.changeMenu(1);
    });
    dojo.connect(dojo.byId('testMenu2'), 'onclick', this, function(){
        this.changeMenu(2);
    });
    dojo.connect(dojo.byId('testMenu3'), 'onclick', this, function(){
        this.changeMenu(3);
    });
    dojo.connect(dojo.byId('doExecTest1')  , 'onclick', this, this.goImport);
    dojo.connect(dojo.byId('doExecTest2')  , 'onclick', this, this.execVacuum);
    dojo.connect(dojo.byId('doExecTest3')  , 'onclick', this, this.yuqInfoTest);
    dojo.connect(dojo.byId('stopExecTest1'), 'onclick', this, this.stopTest);

    if((this.pouch.isSysAdmin() || this.pouch.isAdmin()) && this.pouch.isBulkTestOn()){
        j$('#testCaution').html('★テスト・デモデータ作成ツール★<span style="font-size:0.9em;">取り扱い注意</span>★');
        this.changeMenu(1);
        if(this.pouch.getEmpId()){
            j$('#testYm1').val('' + this.pouch.getYearMonth());
            j$('#testYm2').val('' + this.pouch.getYearMonth());
        }
        this.fetchEmp();
    }else{
        j$('#testCaution').text('利用できません');
    }
};

teasp.view.BulkTest.prototype.getNameSpacePrefix = function(){
    var ns = null;
    var actions = (Visualforce ? Visualforce.remoting.RemotingProvider.actions : {});
    for(key in actions){
        if(actions.hasOwnProperty(key)){
            if(/((.+)\.)?RtkPotalCtl/.test(key)){
                ns = RegExp.$2;
                break;
            }
        }
    }
    return (ns ? ns + '__' : '');
};

/**
 * 処理中状態の切り替え
 *
 * @param {Boolean} flag =true:処理中状態にする =false:処理中を解除する
 * @returns なし
 */
teasp.view.BulkTest.prototype.setBusy = function(flag){
    this.busy = flag;
    if(this.busy){
        j$('#doExecTest1').attr('disabled', 'disabled');
        j$('#doExecTest2').attr('disabled', 'disabled');
        j$('#testValueArea1').attr('disabled', 'disabled');
        j$('#checkNoup').attr('disabled', 'disabled');
        j$('#testEmpName').attr('disabled', 'disabled');
        j$('#testYm1').attr('disabled', 'disabled');
        j$('#testYm2').attr('disabled', 'disabled');
        j$('#stopExecTest1').removeAttr('disabled');
        j$('#testMessage1').text('実行中..');
        j$('#testMessage2').text('実行中..');
    }else{
        j$('#doExecTest1').removeAttr('disabled');
        j$('#doExecTest2').removeAttr('disabled');
        j$('#testValueArea1').removeAttr('disabled');
        j$('#checkNoup').removeAttr('disabled');
        j$('#testEmpName').removeAttr('disabled');
        j$('#testYm1').removeAttr('disabled');
        j$('#testYm2').removeAttr('disabled');
        j$('#stopExecTest1').attr('disabled', 'disabled');
        j$('#testMessage1').text('');
        j$('#testMessage2').text('');
    }
};

/**
 * メニュークリックイベント
 *
 * @returns なし
 */
teasp.view.BulkTest.prototype.changeMenu = function(x){
    if(this.isBusy()){
        return;
    }
    this.currentMenuNo = x;
    for( var n = 1 ; n <= 3 ; n++){
        j$('#testMenu' + n).toggleClass('noactive', (n != x)).toggleClass('active', (n == x));
        j$('#testMenu' + n + 'Area').css('display', (n == x ? '' : 'none'));
    }
};

/**
 * 処理中かどうか
 *
 * @returns {Boolean} =true:処理中である =false:処理中ではない
 */
teasp.view.BulkTest.prototype.isBusy = function(){
    return this.busy;
};

// 社員一覧を取得
teasp.view.BulkTest.prototype.fetchEmp = function(){
    var soql = 'select Id, Name from ' + this.nameSpacePrefix + 'AtkEmp__c order by Name, Id limit 101';
    var that = this;
    sforce.connection.query(soql, {
        onSuccess : function(result, source){
            var emps = result.getArray('records');
            teasp.logic.convert.excludeNameSpace(emps);
            for( var i = 0 ; i < emps.length ; i++){
                that.masterEmps.push({
                    id : emps[i].Id,
                    name : emps[i].Name
                });
            }
            for(i = 0 ; i < that.masterEmps.length ; i++){
                var o = that.masterEmps[i];
                j$('#testEmpName' ).append(j$('<option/>').val(o.id).text(o.name));
                j$('#testEmpName2').append(j$('<option/>').val(o.id).text(o.name));
            }
            if(that.pouch.getEmpId()){
                j$('#testEmpName' ).val(that.pouch.getEmpId());
                j$('#testEmpName2').val(that.pouch.getEmpId());
            }
            that.fetchExpItem();
        },
        onFailure : function(error, source){
            alert(error);
        },
        source : {
            startTime : new Date().getTime()
        }
    });
};

// 費目一覧を取得
teasp.view.BulkTest.prototype.fetchExpItem = function(){
    var soql = 'select Id, Name from ' + this.nameSpacePrefix + 'AtkExpItem__c';
    var that = this;
    sforce.connection.query(soql, {
        onSuccess : function(result, source){
            var items = result.getArray('records');
            teasp.logic.convert.excludeNameSpace(items);
            for( var i = 0 ; i < items.length ; i++){
                that.masterExpItem[items[i].Name] = items[i].Id;
            }
        },
        onFailure : function(error, source){
            alert(error);
        },
        source : {
            startTime : new Date().getTime()
        }
    });
};

teasp.view.BulkTest.prototype.getEmpIdByName = function(name){
    for( var m = 0 ; m < this.masterEmps.length ; m++){
        if(this.masterEmps[m].name == name){
            return this.masterEmps[m].id;
        }
    }
    return null;
};

/**
 * ログ
 *
 * @param {String} msg 出力文字列
 * @param {Boolean} flag =true:直前に改行を入れる
 * @returns なし
 */
teasp.view.BulkTest.prototype.putLog = function(msg, flag){
    var s = j$('#testLog' + this.currentMenuNo).html();
    j$('#testLog' + this.currentMenuNo).html(s + (flag ? '' : '<br/>') + msg);
};

/**
 * エラーログ
 *
 * @param {String} msg 出力文字列
 * @returns なし
 */
teasp.view.BulkTest.prototype.showError = function(msg){
    var s = j$('#testLog' + this.currentMenuNo).html();
    j$('#testLog' + this.currentMenuNo).html(s + '<br/><span style="color:red;">エラー：' + msg + '</span>');
};

/**
 * スキップログ
 *
 * @param {String} msg 出力文字列
 * @param {Boolean} flag =true:直前に改行を入れる
 * @returns なし
 */
teasp.view.BulkTest.prototype.putSkipLog = function(msg, flag){
    var s = j$('#testLog' + this.currentMenuNo).html();
    j$('#testLog' + this.currentMenuNo).html(s + (flag ? '' : '<br/>') + '<span style="color:blue;">' + msg + '</span>');
};

/**
 * 中止要求イベント
 *
 * @returns なし
 */
teasp.view.BulkTest.prototype.stopTest = function(){
    this.stopped = true;
    j$('#stopExecTest1').attr('disabled', 'disabled');
};

/**
 * 日付から勤怠の月度を得る
 *
 * @param {String or Object} date 日付 'yyyy-MM-dd' または Dateオブジェクト
 * @returns {Number} 月度（yyyyMM）
 */
teasp.view.BulkTest.prototype.getYearMonthByDate = function(date){
    var ymInfo = teasp.util.searchYearMonthDate(this.pouch.getInitialDateOfMonth(), this.pouch.getMarkOfMonth(), null, date);
    return ymInfo.yearMonth;
};

/**
 * 日付から工数実績の月度を得る
 *
 * @param {String or Object} date 日付 'yyyy-MM-dd' または Dateオブジェクト
 * @returns {Number} 月度（yyyyMM）
 */
teasp.view.BulkTest.prototype.getJobYearMonthByDate = function(date){
    var ymInfo = teasp.util.searchYearMonthDate(this.pouch.getJobInitialDayOfMonth(), this.pouch.getJobMarkOfMonth(), null, date);
    return ymInfo.yearMonth;
};

/**
 * 入力データのテキストをオブジェクト化
 *
 * @param {String} areaId テキストエリアのＩＤ
 * @returns {Object} 勤怠、経費、工数の各オブジェクト配列を持つオブジェクト
 */
teasp.view.BulkTest.prototype.getCsvFromTextArea = function(areaId){
    var buf = j$.trim(j$(areaId).val());
    if(buf == ''){
        this.showError('値がセットされていません');
        return null;
    }
    var rows = buf.split(/\r?\n/);
    var kts = [];
    var eps = [];
    var jbs = [];
    for( var r = 0 ; r < rows.length ; r++){
        var cols = rows[r].split(/\t/);
        if(cols[0] == '勤怠'){
            var o = this.parseKintai(r, cols);
            kts.push(o);
        }else if(cols[0] == '経費'){
            var o = this.parseExp(r, cols);
            eps.push(o);
        }else if(cols[0] == '工数'){
            var o = this.parseJob(r, cols);
            jbs.push(o);
        }
    }
    if(kts.length > 0){ // 勤怠データ
        var enList = [];
        var en = null, d = null;
        for( var i = 0 ; i < kts.length ; i++){
            var o = kts[i];
            if(en && (!o.en || o.en.length <= 0)){
                o.en = en;
            }
            if(d && (!o.d || o.d.length <= 0)){
                o.d = d;
            }
            en = o.en;
            d = o.d;
            if(!enList.contains(o.en)){
                enList.push(o.en);
            }
        }
        // 社員名＞日付＞行番号でソート
        kts = kts.sort(function(a, b){
            if(a.en == b.en){
                if(a.d == b.d){
                    return (a.r - b.r);
                }
                return (a.d < b.d ? -1 : 1);
            }
            return enList.indexOf(a.en) - enList.indexOf(b.en);
        });
        // 同じ社員、同じ日付のオブジェクトをマージ
        var lst = [];
        en = null, d = null;
        for( var i = 0 ; i < kts.length ; i++){
            var o = kts[i];
            if(en && d && o.en == en && o.d == d){
                var oo = lst[lst.length - 1];
                if(!oo.st && o.st){
                    oo.st = o.st;
                }
                if(!oo.et && o.et){
                    oo.et = o.et;
                }
                if(o.rt.length > 0){
                    oo.rt = oo.rt.concat(o.rt);
                }
                if(o.at.length > 0){
                    oo.at = oo.at.concat(o.at);
                }
                if(o.unrt.length > 0){
                    oo.unrt = oo.unrt.concat(o.unrt);
                }
                if(o.ap.length > 0){
                    oo.ap = oo.ap.concat(o.ap);
                }
            }else{
                lst.push(o);
                en = o.en;
                d = o.d;
            }
        }
        kts = lst;
    }
    if(eps.length > 0){ // 経費データ
        var enList = [];
        var en = null, d = null;
        for( var i = 0 ; i < eps.length ; i++){
            var o = eps[i];
            if(en && (!o.en || o.en.length <= 0)){
                o.en = en;
            }
            if(d && (!o.d || o.d.length <= 0)){
                o.d = d;
            }
            en = o.en;
            d = o.d;
            if(!enList.contains(o.en)){
                enList.push(o.en);
            }
        }
        // 社員名＞日付＞行番号でソート
        eps = eps.sort(function(a, b){
            if(a.en == b.en){
                if(a.d == b.d){
                    return (a.r - b.r);
                }
                return (a.d < b.d ? -1 : 1);
            }
            return enList.indexOf(a.en) - enList.indexOf(b.en);
        });
        // 社員名でまとめる
        var emps = [];
        var index = 0;
        for( var i = 0 ; i < eps.length ; i++){
            var o = eps[i];
            if(emps.length <= 0){
                if(o.en){
                    emps.push({
                        en : o.en,
                        eps : [ o ]
                    });
                }else{
                    emps.push({
                        eps : [ o ]
                    });
                }
                index = 0;
            }else{
                if(!o.en || (o.en && emps[index].en == o.en)){
                    emps[index].eps.push(o);
                }else{
                    var x = -1;
                    for( var m = 0 ; m < emps.length ; m++){
                        if(emps[m].en == o.en){
                            x = m;
                            break;
                        }
                    }
                    if(x >= 0){
                        index = x;
                        emps[index].eps.push(o);
                    }else{
                        emps.push({
                            en : o.en,
                            eps : [ o ]
                        });
                        index = emps.length - 1;
                    }
                }
            }
        }
        // 社員毎に日付でまとめる
        var lst = [];
        for( var i = 0 ; i < emps.length ; i++){
            var emp = emps[i];
            emp.eps = emp.eps.sort(function(a, b){
                if(!a.d || !b.d){
                    return (!a.d ? -1 : 1);
                }
                return (a.d < b.d ? -1 : (a.d > b.d ? 1 : 0));
            });
            var dlst = [];
            var dmap = {};
            for( var i = 0 ; i < emp.eps.length ; i++){
                var o = emp.eps[i];
                if(!o.d){
                    continue;
                }
                var l = dmap[o.d];
                if(!l){
                    dlst.push(o.d);
                    dmap[o.d] = [ o ];
                }else{
                    l.push(o);
                }
            }
            for(i = 0 ; i < dlst.length ; i++){
                var d = dlst[i];
                var o = {
                    d : d,
                    exps : dmap[d]
                };
                if(i == 0){
                    o.en = emp.en;
                }
                lst.push(o);
            }
        }
        eps = lst;
    }
    if(jbs.length > 0){ // 工数データ
        var enList = [];
        var en = null, d = null;
        for( var i = 0 ; i < jbs.length ; i++){
            var o = jbs[i];
            if(en && (!o.en || o.en.length <= 0)){
                o.en = en;
            }
            if(d && (!o.d || o.d.length <= 0)){
                o.d = d;
            }
            en = o.en;
            d = o.d;
            if(!enList.contains(o.en)){
                enList.push(o.en);
            }
        }
        // 社員名＞日付＞行番号でソート
        jbs = jbs.sort(function(a, b){
            if(a.en == b.en){
                if(a.d == b.d){
                    return (a.r - b.r);
                }
                return (a.d < b.d ? -1 : 1);
            }
            return enList.indexOf(a.en) - enList.indexOf(b.en);
        });
        // 社員名でまとめる
        var emps = [];
        var index = 0;
        for( var i = 0 ; i < jbs.length ; i++){
            var o = jbs[i];
            if(emps.length <= 0){
                if(o.en){
                    emps.push({
                        en : o.en,
                        jsons : [ o ]
                    });
                }else{
                    emps.push({
                        jsons : [ o ]
                    });
                }
                index = 0;
            }else{
                if(!o.en || (o.en && emps[index].en == o.en)){
                    emps[index].jsons.push(o);
                }else{
                    var x = -1;
                    for( var m = 0 ; m < emps.length ; m++){
                        if(emps[m].en == o.en){
                            x = m;
                            break;
                        }
                    }
                    if(x >= 0){
                        index = x;
                        emps[index].jsons.push(o);
                    }else{
                        emps.push({
                            en : o.en,
                            jsons : [ o ]
                        });
                        index = emps.length - 1;
                    }
                }
            }
        }
        // 社員毎に日付でまとめる
        var lst = [];
        var jobs = {};
        for( var i = 0 ; i < emps.length ; i++){
            var emp = emps[i];
            emp.jsons = emp.jsons.sort(function(a, b){
                if(!a.d || !b.d){
                    return (!a.d ? -1 : 1);
                }
                return (a.d < b.d ? -1 : (a.d > b.d ? 1 : 0));
            });
            var dlst = [];
            var dmap = {};
            for( var i = 0 ; i < emp.jsons.length ; i++){
                var o = emp.jsons[i];
                if(!o.d || !o.jn){
                    continue;
                }
                jobs[o.jn] = 1;
                var l = dmap[o.d];
                if(!l){
                    dlst.push(o.d);
                    dmap[o.d] = [ o ];
                }else{
                    l.push(o);
                }
            }
            for(i = 0 ; i < dlst.length ; i++){
                var o = {
                    d : dlst[i],
                    works : dmap[dlst[i]]
                };
                if(i == 0){
                    o.en = emp.en;
                }
                lst.push(o);
            }
        }
        jbs = lst;
    }
    return {
        kts : kts,
        eps : eps,
        jbs : jbs
    };
};

/**
 * 勤怠データを取得
 *
 * @param {Number} rowIndex 行インデックス
 * @param {String[]} cols データ
 * @returns {Object} 勤怠オブジェクト
 */
teasp.view.BulkTest.prototype.parseKintai = function(rowIndex, cols){
    var o = {
        r    : rowIndex,                            // 行インデックス(0-)
        en   : (cols[1] || null),                   // 社員名
        d    : teasp.util.date.formatDate(cols[2]), // 日付(yyyy-MM-dd)
        st   : (cols[3] || null),                   // 出社時刻(h:mm)
        et   : (cols[4] || null),                   // 退社時刻(h:mm)
        rt   : [],                                  // 休憩時間
        at   : [],                                  // 公用外出時間
        unrt : [],                                  // 取ってない所定休憩時間
        ap   : []                                   // 申請
    };
    var st = (cols[5] || null);
    var et = (cols[6] || null);
    if(st && et && st.length > 0 && et.length > 0){
        o.rt.push({
            st : st,
            et : et
        });
    }
    st = (cols[7] || null);
    et = (cols[8] || null);
    if(st && et && st.length > 0 && et.length > 0){
        o.at.push({
            st : st,
            et : et
        });
    }
    st = (cols[9] || null);
    et = (cols[10] || null);
    if(st && et && st.length > 0 && et.length > 0){
        o.unrt.push({
            st : st,
            et : et
        });
    }
    var sn = (cols[11] || null);
    if(sn && sn.length > 0){
        o.ap.push({
            sn : sn,                                   // 申請種類
            hn : (cols[12] || null),                   // 休暇名
            pn : (cols[13] || null),                   // 勤務パターン名
            ed : teasp.util.date.formatDate(cols[14]), // 期間終了日(yyyy-MM-dd)
            st : (cols[15] || null),                   // 開始時刻(h:mm)
            et : (cols[16] || null),                   // 終了時刻(h:mm)
            ex : teasp.util.date.formatDate(cols[17]), // 振替日(yyyy-MM-dd)
            nt : (cols[18] || null),                   // 備考
            ct : (cols[19] || null)                    // 連絡先
        });
    }
    return o;
};

/**
 * 経費データを取得
 *
 * @param {Number} rowIndex 行インデックス
 * @param {String[]} cols データ
 * @returns {Object} 経費オブジェクト
 */
teasp.view.BulkTest.prototype.parseExp = function(rowIndex, cols){
    var o = {
        r  : rowIndex,                            // 行インデックス(0-)
        en : (cols[1]  || null),                  // 社員名
        d  : teasp.util.date.formatDate(cols[2]), // 日付(yyyy-MM-dd)
        jn : (cols[3]  || null),                  // ジョブ名
        it : (cols[4]  || null),                  // 費目名
        ss : (cols[5]  || null),                  // 発駅
        es : (cols[6]  || null),                  // 着駅
        rd : (cols[7]  || false),                 // 往復(true/false)
        mn : (cols[8]  || '0'),                   // 金額
        nt : (cols[9]  || null),                  // 備考
        tt : (cols[10] || null),                  // 税タイプ
        wt : (cols[11] || '0'),                   // 税抜金額
        tx : (cols[12] || '0'),                   // 消費税
        ta : (cols[13] || false),                 // 消費税手入力
        cn : (cols[14] || null),                  // 通貨名
        rt : (cols[15] || '0'),                   // 換算レート
        fa : (cols[16] || '0')                    // 現地金額
    };
    o.rd = (typeof (o.rd) == 'string' ? o.rd.toLowerCase() == 'true' : false);
    o.ta = (typeof (o.ta) == 'string' ? o.ta.toLowerCase() == 'true' : false);
    return o;
};

/**
 * 工数実績データを取得
 *
 * @param {Number} rowIndex 行インデックス
 * @param {String[]} cols データ
 * @returns {Object} 工数オブジェクト
 */
teasp.view.BulkTest.prototype.parseJob = function(rowIndex, cols){
    var o = {
        r  : rowIndex,                            // 行インデックス(0-)
        en : (cols[1] || null),                   // 社員名
        d  : teasp.util.date.formatDate(cols[2]), // 日付(yyyy-MM-dd)
        jn : (cols[3] || null),                   // ジョブ名
        sb : (cols[4] || null),                   // 作業分類
        vl : (cols[5] || null),                   // ボリューム(0-1000)
        tm : (cols[6] || null),                   // 時間(h:mm)
        tx : (cols[7] || false),                  // 時間固定(true/false)
        tn : (cols[8] || null)                    // タスク別作業報告
    };
    o.vl = (o.vl && (/^(\d+)$/.test(o.vl)) ? parseInt(o.vl, 10) : null);
    o.tx = (typeof (o.tx) == 'string' ? o.tx.toLowerCase() == 'true' : false);
    return o;
};

/**
 * 簡易インポート実行
 *
 * @returns なし
 */
teasp.view.BulkTest.prototype.goImport = function(){
    if(this.isBusy()){
        return;
    }
    j$('#testLog1').text('');
    var jsons = this.getCsvFromTextArea('#testValueArea1');
    if(!jsons){
        return;
    }
    this.execInit = false;
    this.stopped = false;
    this.setBusy(true);
    this.putLog('オブジェクト数');
    this.putLog('勤怠 ... ' + jsons.kts.length);
    this.putLog('経費 ... ' + jsons.eps.length);
    this.putLog('工数 ... ' + jsons.jbs.length);
    if(jsons.eps.length > 0){
        var noits = {};
        for( var i = 0 ; i < jsons.eps.length ; i++){
            var o = jsons.eps[i];
            for( var j = 0 ; j < o.exps.length ; j++){
                var exp = o.exps[j];
                if(!this.masterExpItem[exp.it]){
                    noits[exp.it] = 1;
                }
            }
        }
        var buf = '';
        this.putLog('費目チェック');
        for( var key in noits){
            buf += '\n\t';
            buf += key;
            this.putLog('「' + key + '」は登録されていません');
        }
        if(buf){
            if(!confirm('以下の費目は登録されていないため、この費目の経費はインポートされませんが、よろしいですか？\n' + buf + '\n\nよろしければ［ＯＫ］をクリックして続行してください')){
                this.putSkipLog('******************** 中止しました');
                this.setBusy(false);
                return;
            }
        }else{
            this.putLog('...ok', true);
        }
    }
    this.importKintai(jsons, 0, 0);
};

/**
 * 勤怠データインポート
 *
 * @param {Object} jsons 入力データリスト
 * @param {Number} dataIndex 処理対象の入力データインデックス
 * @param {Number} applyIndex 処理対象の申請データ処理対象インデックス
 * @returns なし
 */
teasp.view.BulkTest.prototype.importKintai = function(jsons, dataIndex, applyIndex){
    if(jsons.kts.length <= dataIndex){
        this.putLog('**** 勤怠インポート終了 ****');
        this.importExpStep1(jsons); // 経費データインポートへ
        return;
    }
    if(this.stopped){
        this.putSkipLog('**** 中止しました ****');
        this.setBusy(false);
        return;
    }
    var obj = jsons.kts[dataIndex];
    if(!obj.d){
        this.putSkipLog('日付なし');
        this.importKintai(jsons, ++dataIndex);
        return;
    }
    obj.empId = this.getEmpIdByName(obj.en);
    if(!this.execInit || (obj.empId && this.pouch.getEmpId() && obj.empId != this.pouch.getEmpId())){
        this.execInit = true;
        var ym = (this.pouch.getEmpId() ? this.getYearMonthByDate(obj.d) : 0);
        this.putLog('勤怠 - ' + ym);
        teasp.manager.request(
            'loadEmpMonth',
            {
                empId : (obj.empId || ''),
                month : (ym || '')
            },
            this.pouch,
            {
                hideBusy : true
            },
            this,
            function(){
                this.putLog(' .. ok', true);
                if(!this.pouch.getEmpId()){
                    this.showError('ログインユーザに紐づく社員は設定されていません。社員名(en)をデータにセットしてください');
                    this.setBusy(false);
                    return;
                }
                obj.empId = this.pouch.getEmpId();
                var that = this;
                teasp.manager.completeCheck(function(){
                    that.importKintai(jsons, dataIndex, applyIndex);
                });
            },
            function(event){
                this.putLog(' .. failed', true);
                this.showError(event.message);
                this.setBusy(false);
            }
        );
        return;
    }
    var ym = this.getYearMonthByDate(obj.d);
    if(this.pouch.getYearMonth() != ym){
        // --------------------------------------------------
        // 月度変更
        this.putLog('勤怠 - ' + ym);
        teasp.manager.request(
            'transEmpMonth',
            {
                empId : this.pouch.getEmpId(),
                month : ym
            },
            this.pouch,
            {
                hideBusy : true
            },
            this,
            function(){
                if(this.pouch.getYearMonth() != ym){
                    this.showError('*** SYSTEM ERROR ***');
                    this.setBusy(false);
                }else{
                    this.putLog(' .. ok', true);
                    this.importKintai(jsons, dataIndex, applyIndex);
                }
            },
            function(event){
                this.putLog(' .. failed', true);
                this.showError(event.message);
                this.setBusy(false);
            }
        );
        return;
    }

    this.putLog('(' + dataIndex + ') ' + obj.en + ' ' + (obj.d || '') + ' 出社=' + (obj.st || '') + ' 退社=' + (obj.et || '') + ' 申請=' + (obj.ap ? obj.ap.length : 0));

    var dayWrap = this.pouch.getEmpDay(obj.d);
    var dayObj = dayWrap.getObj();
    if(j$('#checkNoup').is(':checked')){
        if(dayWrap.isInputTime() || (!applyIndex && dayWrap.getEmpApplyList().length > 0)){
            this.putSkipLog('スキップ (入力済み)');
            this.importKintai(jsons, ++dataIndex, 0);
            return;
        }
    }

    var patterns = this.pouch.getPatternObjs();
    var holidays = this.pouch.getHolidayObjs();

    // --------------------------------------------------
    // 勤怠関連申請
    if(obj.ap && obj.ap.length > 0 && applyIndex < obj.ap.length){
        var o = obj.ap[applyIndex];
        var req = {
            empId : this.pouch.getEmpId(),
            month : this.pouch.getYearMonth(),
            lastModifiedDate : this.pouch.getLastModifiedDate(),
            date : dayObj.date,
            apply : {
                id : null,
                applyType : null,
                holidayId : null,
                patternId : null,
                startDate : null,
                endDate : null,
                startTime : null,
                endTime : null,
                exchangeDate : null,
                note : (o.nt || null),
                contact : (o.ct || null)
            }
        };
        if(o.st && typeof (o.st) == 'string'){
            o.st = teasp.util.time.clock2minutes(o.st);
        }
        if(o.et && typeof (o.et) == 'string'){
            o.et = teasp.util.time.clock2minutes(o.et);
        }
        if(o.sn == teasp.constant.APPLY_TYPE_HOLIDAY){ // 休暇申請
            var holiday = null;
            for( var h = 0 ; h < holidays.length ; h++){
                if(holidays[h].name == o.hn){
                    holiday = holidays[h];
                    break;
                }
            }
            if(!holiday){
                this.putSkipLog('休暇名「' + (o.hn || '(null)') + '」は存在しないため、休暇申請は無効');
                this.importKintai(jsons, dataIndex, ++applyIndex);
                return;
            }
            req.apply.applyType = o.sn;
            req.apply.holidayId = holiday.id;
            req.apply.startDate = dayObj.date;
            req.apply.endDate = (o.ed || dayObj.date);
            req.apply.startTime = (o.st || null);
            req.apply.endTime = (o.et || null);
            this.putLog('(' + dataIndex + ') ' + o.sn + ' ' + holiday.name + ' ' + req.apply.startDate + ' - ' + req.apply.endDate);

        }else if(o.sn == teasp.constant.APPLY_TYPE_KYUSHTU){ // 休日出勤申請
            if(dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL && !dayWrap.isPlannedHoliday()){
                this.putSkipLog(dayObj.date + 'は平日のため、休日出勤申請は無効');
                this.importKintai(jsons, dataIndex, ++applyIndex);
                return;
            }
            var dr = dayWrap.getDefaultZangyoRange();
            req.apply.applyType = o.sn;
            req.apply.startDate = dayObj.date;
            req.apply.endDate = dayObj.date;
            req.apply.startTime = (o.st || dr.from);
            req.apply.endTime = (o.et || dr.to);
            req.apply.daiqReserve = this.pouch.isUseDaiqManage(); // 代休管理＝オンであれば、常に代休取得予定をオンにする
            this.putLog('(' + dataIndex + ') ' + o.sn + ' ' + req.apply.startDate + ' - ' + req.apply.endDate);

        }else if(o.sn == teasp.constant.APPLY_TYPE_ZANGYO){ // 残業申請
            var dr = dayWrap.getDefaultZangyoRange();
            req.apply.applyType = o.sn;
            req.apply.startDate = dayObj.date;
            req.apply.endDate = dayObj.date;
            req.apply.startTime = (o.st || dr.from);
            req.apply.endTime = (o.et || dr.to);
            this.putLog('(' + dataIndex + ') ' + o.sn + ' ' + teasp.util.time.timeValue(req.apply.startTime) + ' - ' + teasp.util.time.timeValue(req.apply.endTime));

        }else if(o.sn == teasp.constant.APPLY_TYPE_EARLYSTART){ // 早朝勤務申請
            var dr = dayWrap.getDefaultEarlyStartRange();
            req.apply.applyType = o.sn;
            req.apply.startDate = dayObj.date;
            req.apply.endDate = dayObj.date;
            req.apply.startTime = (o.st || dr.from);
            req.apply.endTime = (o.et || dr.to);
            this.putLog('(' + dataIndex + ') ' + o.sn + ' ' + teasp.util.time.timeValue(req.apply.startTime) + ' - ' + teasp.util.time.timeValue(req.apply.endTime));

        }else if(o.sn == teasp.constant.APPLY_TYPE_LATESTART){ // 遅刻申請
            req.apply.applyType = o.sn;
            req.apply.startDate = dayObj.date;
            req.apply.endDate = dayObj.date;
            req.apply.startTime = o.st;
            req.apply.endTime = o.et;
            this.putLog('(' + dataIndex + ') ' + o.sn + ' ' + teasp.util.time.timeValue(req.apply.startTime) + ' - ' + teasp.util.time.timeValue(req.apply.endTime));

        }else if(o.sn == teasp.constant.APPLY_TYPE_EARLYEND){ // 早退申請
            req.apply.applyType = o.sn;
            req.apply.startDate = dayObj.date;
            req.apply.endDate = dayObj.date;
            req.apply.startTime = o.st;
            req.apply.endTime = o.et;
            this.putLog('(' + dataIndex + ') ' + o.sn + ' ' + teasp.util.time.timeValue(req.apply.startTime) + ' - ' + teasp.util.time.timeValue(req.apply.endTime));

        }else if(o.sn == teasp.constant.APPLY_TYPE_EXCHANGE){ // 振替申請
            var enableMap = this.pouch.createExchangeEnableMap();
            var enable = (enableMap[dayObj.date] ? enableMap[dayObj.date][o.exd] : null);
            if(!enable){
                this.putSkipLog(dayObj.date + 'と' + o.exd + 'の振替申請は無効');
                this.importKintai(jsons, dataIndex, ++applyIndex);
                return;
            }
            req.apply.applyType = o.sn;
            req.apply.startDate = dayObj.date;
            req.apply.endDate = dayObj.date;
            req.apply.exchangeDate = o.exd;
            this.putLog('(' + dataIndex + ') ' + o.sn + ' ' + req.apply.startDate + ' - ' + req.apply.endDate);

        }else if(o.sn == teasp.constant.APPLY_TYPE_PATTERNS || o.sn == teasp.constant.APPLY_TYPE_PATTERNL){ // 勤務時間変更申請
                                                                                                            // or
                                                                                                            // 長期時間変更申請
            var pattern = null;
            for( var p = 0 ; p < patterns.length ; p++){
                if(patterns[p].name == o.pn && ((patterns[p].range == '1' && o.sn == teasp.constant.APPLY_TYPE_PATTERNS) || (patterns[p].range == '2' && o.sn == teasp.constant.APPLY_TYPE_PATTERNL))){
                    pattern = patterns[p];
                    break;
                }
            }
            if(!pattern){
                this.putSkipLog('勤務パターン名「' + (o.pn || '(null)') + '」は存在しないため、' + o.sn + 'は無効');
                this.importKintai(jsons, dataIndex, ++applyIndex);
                return;
            }
            req.apply.applyType = o.sn;
            req.apply.patternId = pattern.id;
            req.apply.startDate = dayObj.date;
            req.apply.endDate = (o.ed || dayObj.date);
            req.apply.startTime = (o.st || null);
            req.apply.endTime = (o.et || null);
            this.putLog('(' + dataIndex + ') ' + o.sn + ' ' + pattern.name + ' ' + req.apply.startDate + ' - ' + req.apply.endDate);

        }
        // サーバへリクエスト送信
        teasp.manager.request(
            'applyEmpDay',
            req,
            this.pouch,
            {
                hideBusy : true
            },
            this,
            function(){
                this.putLog(' .. ok', true);
                this.importKintai(jsons, dataIndex, ++applyIndex);
            },
            function(event){
                this.putLog(' .. failed', true);
                this.showError(event.message);
                this.importKintai(jsons, dataIndex, ++applyIndex);
            }
        );
        return;
    }

    // --------------------------------------------------
    // 出退社時刻、休憩時間入力
    var stet = {
        from : teasp.util.time.clock2minutes(obj.st),
        to : teasp.util.time.clock2minutes(obj.et),
        type : 1
    };
    if(typeof (stet.from) != 'number'){
        stet.from = null;
    }
    if(typeof (stet.to) != 'number'){
        stet.to = null;
    }
    if(stet.from === null && stet.to === null){
        this.putSkipLog('inputTimeTable スキップ (出退時刻なし)');
        this.importKintai(jsons, ++dataIndex, 0);
        return;
    }
    if((dayWrap.getDayType() != teasp.constant.DAY_TYPE_NORMAL || dayWrap.isPlannedHoliday()) && !dayWrap.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)){
        // 休日出勤申請
        if(!obj.ap){
            obj.ap = [];
        }
        obj.ap.push({
            sn : teasp.constant.APPLY_TYPE_KYUSHTU
        });
        this.putLog('(' + dataIndex + ') 休日出勤申請を追加');
        this.importKintai(jsons, dataIndex, obj.ap.length - 1);
        return;
    }
    var timeTable = [];
    timeTable.push(stet);
    // 所定休憩を取ってない情報
    var unrt = [];
    if(obj.unrt && obj.unrt.length > 0){
        for(var i = 0 ; i < obj.unrt.length ; i++){
            var o = obj.unrt[i];
            unrt.push({
                from : (typeof (o.st) == 'string' ? teasp.util.time.clock2minutes(o.st) : o.st),
                to : (typeof (o.et) == 'string' ? teasp.util.time.clock2minutes(o.et) : o.et)
            });
        }
    }
    var pattern = dayObj.pattern;
    // 所定の休憩のセット
    if(pattern && pattern.restTimes){
        for(i = 0 ; i < pattern.restTimes.length ; i++){
            var rest = pattern.restTimes[i];
            var n = teasp.util.time.rangeTime(rest, unrt);
            if(n > 0 && n < (rest.to - rest.from)){
                var wt = [ dojo.clone(rest) ];
                var m = 0;
                while(m < unrt.length){
                    wt = teasp.util.time.sliceTimes(wt, unrt[m]);
                    m++;
                }
                for( var r = 0 ; r < wt.length ; r++){
                    timeTable.push({
                        from : wt[r].from,
                        to : wt[r].to,
                        type : teasp.constant.REST_FREE
                    });
                }
            }else if(n <= 0){
                timeTable.push({
                    from : rest.from,
                    to : rest.to,
                    type : teasp.constant.REST_FIX
                });
            }
        }
    }
    // 私用の休憩のセット
    if(obj.rt && obj.rt.length > 0){
        var rests = [];
        for(i = 0 ; i < timeTable.length ; i++){
            var o = timeTable[i];
            if(o.type == teasp.constant.REST_FIX || o.type == teasp.constant.REST_FREE){
                rests.push(o);
            }
        }
        for(i = 0 ; i < obj.rt.length ; i++){
            var o = obj.rt[i];
            var rt = {
                from : (typeof (o.st) == 'string' ? teasp.util.time.clock2minutes(o.st) : o.st),
                to : (typeof (o.et) == 'string' ? teasp.util.time.clock2minutes(o.et) : o.et)
            };
            var n = teasp.util.time.rangeTime(rt, rests);
            if(n > 0 && n < (rt.to - rt.from)){
                var wt = [ dojo.clone(rt) ];
                var m = 0;
                while(m < rests.length){
                    wt = teasp.util.time.sliceTimes(wt, rests[m]);
                    m++;
                }
                for( var r = 0 ; r < wt.length ; r++){
                    timeTable.push({
                        from : wt[r].from,
                        to : wt[r].to,
                        type : teasp.constant.REST_FREE
                    });
                }
            }else{
                timeTable.push({
                    from : rt.from,
                    to : rt.to,
                    type : teasp.constant.REST_FREE
                });
            }
        }
    }
    // 公用外出のセット
    if(obj.at && obj.at.length > 0){
        for(i = 0 ; i < obj.at.length ; i++){
            var o = obj.at[i];
            if(typeof (o.st) == 'string'){
                o.st = teasp.util.time.clock2minutes(o.st);
            }
            if(typeof (o.et) == 'string'){
                o.et = teasp.util.time.clock2minutes(o.et);
            }
            timeTable.push({
                from : o.st,
                to : o.et,
                type : teasp.constant.AWAY
            });
        }
    }
    // サーバへリクエスト送信
    var req = {
        empId : this.pouch.getEmpId(),
        month : this.pouch.getYearMonth(),
        lastModifiedDate : this.pouch.getLastModifiedDate(),
        date : dayObj.date,
        timeTable : timeTable
    };
    this.putLog('(' + dataIndex + ') 勤怠登録');
    teasp.manager.request(
        'inputTimeTable',
        req,
        this.pouch,
        {
            hideBusy : true
        },
        this,
        function(){
            this.putLog(' .. ok', true);
            this.importKintai(jsons, ++dataIndex, 0);
        },
        function(event){
            this.putLog(' .. failed', true);
            this.showError(event.message);
            this.setBusy(false);
        }
    );
};

/**
 * 経費データインポート（１）
 *
 * @returns なし
 */
teasp.view.BulkTest.prototype.importExpStep1 = function(jsons){
    this.putLog('費目検索');
    teasp.manager.request(
        'getAtkExpItems',
        '',
        this.pouch,
        {
            hideBusy : true
        },
        this,
        function(){
            this.putLog(' .. ok', true);
            var expItems = this.pouch.getExpItems();
            this.itemMap = {};
            for(var i = 0 ; i < expItems.length ; i++){
                this.itemMap[expItems[i].name] = expItems[i];
            }
            this.importExpStep2(jsons);
        },
        function(event){
            this.putLog(' .. failed', true);
            this.showError(event.message);
            this.setBusy(false);
        }
    );
};

/**
 * 経費データインポート（２）
 *
 * @param {Object} jsons 入力データリスト
 * @param {Number} dataIndex 処理対象の入力データインデックス
 * @returns なし
 */
teasp.view.BulkTest.prototype.importExpStep2 = function(jsons){
    var jobs = {};
    for( var i = 0 ; i < jsons.eps.length ; i++){
        var o = jsons.eps[i];
        for( var j = 0 ; j < o.exps.length ; j++){
            var exp = o.exps[j];
            if(exp.jn){
                jobs[exp.jn] = 1;
            }
        }
    }
    var names = [];
    for( var key in jobs){
        if(jobs.hasOwnProperty(key)){
            names.push(key);
        }
    }
    if(names.length <= 0){
        this.importExpStep3(jsons, 0);
        return;
    }
    this.putLog('ジョブID検索 - ' + names.join(','));
    teasp.manager.request(
        'getJobIdByNames',
        names.join('\t'),
        this.pouch,
        {
            hideBusy : true
        },
        this,
        function(result){
            this.putLog(' .. ok', true);
            console.debug(dojo.toJson(result));
            this.jobMap = result;
            this.importExpStep3(jsons, 0);
        },
        function(event){
            this.putLog(' .. failed', true);
            this.showError(event.message);
            this.setBusy(false);
        }
    );
};

/**
 * 経費データインポート（３）
 *
 * @param {Object} jsons 入力データリスト
 * @param {Number} dataIndex 処理対象の入力データインデックス
 * @returns なし
 */
teasp.view.BulkTest.prototype.importExpStep3 = function(jsons, dataIndex){
    if(jsons.eps.length <= dataIndex){
        this.putLog('**** 経費インポート終了 ****');
        this.importJobStep1(jsons); // 工数データインポートへ
        return;
    }
    if(this.stopped){
        this.putSkipLog('**** 中止しました ****');
        this.setBusy(false);
        return;
    }
    var obj = jsons.eps[dataIndex];

    obj.empId = this.getEmpIdByName(obj.en);

    if(!this.execInit || (obj.empId && this.pouch.getEmpId() && obj.empId != this.pouch.getEmpId())){
        this.execInit = true;
        this.putLog('(' + dataIndex + ') 経費');
        teasp.manager.request(
            'loadEmpExp',
            {
                empId : obj.empId,
                expApplyId : null
            },
            this.pouch,
            {
                hideBusy : true
            },
            this,
            function(){
                this.putLog(' .. ok', true);
                if(!this.pouch.getEmpId()){
                    this.showError('ログインユーザに紐づく社員は設定されていません。社員名(en)をデータにセットしてください');
                    this.setBusy(false);
                    return;
                }
                obj.empId = this.pouch.getEmpId();
                var that = this;
                teasp.manager.completeCheck(function(){
                    that.importExpStep3(jsons, dataIndex);
                });
            },
            function(event){
                this.putLog(' .. failed', true);
                this.showError(event.message);
                this.setBusy(false);
            }
        );
        return;
    }

    var req = {
        empId : this.pouch.getEmpId(),
        expApplyId : null,
        date : obj.d,
        expLogs : [],
        expHistory : (obj.eh || null)
    };
    var expHist = (obj.eh ? dojo.fromJson(obj.eh) : {
        routeHist : this.pouch.getRouteHist(),
        stationHist : this.pouch.getStationHist()
    });
    for( var i = 0 ; i < obj.exps.length ; i++){
        var o = obj.exps[i];
        var expItem = this.itemMap[o.it];
        if(!expItem){
            this.putSkipLog('費目 ' + o.it + ' は登録されていません');
            this.importExpStep3(jsons, ++dataIndex);
            return;
        }
        if(expItem.transportType == 1 && !o.route && (!o.transportType || o.transportType == 1)){
            var sr = {
                empId : this.pouch.getEmpId(),
                expDate : obj.d,
                mode : 0,
                stationFrom : {
                    name : o.ss,
                    code : (o.sc || null)
                },
                stationTo : {
                    name : o.es,
                    code : (o.ec || null)
                },
                stationVia : []
            };
            this.putLog('(' + dataIndex + ') 経路検索 - ' + sr.stationFrom.name + '-' + sr.stationTo.name);
            teasp.manager.request(
                'searchRoute',
                sr,
                this.pouch,
                {
                    hideBusy : true
                },
                this,
                function(res){
                    this.putLog(' .. ok', true);
                    if(res.routes && res.routes.length > 0){
                        var so = res.stationFromList[0];
                        var eo = res.stationToList[0];
                        var routes = res.routes.sort(function(a, b){
                            return a.fare - b.fare;
                        });
                        var rx = 0;
                        if(o.mn && typeof (o.mn) == 'number'){
                            for( var j = 0 ; j < routes.length ; j++){
                                if(routes[j].fare == o.mn){
                                    rx = j;
                                    break;
                                }
                            }
                        }
                        o.route = dojo.toJson({
                            searchKey : {
                                stationFrom : so,
                                stationTo : eo,
                                stationVia : res.stationVia
                            },
                            route : routes[rx]
                        });
                        var so = res.stationFromList[0];
                        var eo = res.stationToList[0];
                        if(so){
                            o.ss = so.name;
                        }
                        if(eo){
                            o.es = eo.name;
                        }
                        o.sc = (so ? so.code : null);
                        o.ec = (eo ? eo.code : null);
                        o.mn = routes[rx].fare * (o.rd ? 2 : 1);

                        var b = false;
                        for( var j = 0 ; j < expHist.routeHist.length ; j++){
                            if(expHist.routeHist[j] == o.route){
                                b = true;
                                break;
                            }
                        }
                        if(!b){
                            expHist.routeHist.unshift(o.route);
                        }
                        b = false;
                        for( var j = 0 ; j < expHist.stationHist.length ; j++){
                            if(expHist.stationHist[j].name == so.name){
                                b = true;
                                break;
                            }
                        }
                        if(!b){
                            expHist.stationHist.unshift(so);
                        }
                        b = false;
                        for( var j = 0 ; j < expHist.stationHist.length ; j++){
                            if(expHist.stationHist[j].name == eo.name){
                                b = true;
                                break;
                            }
                        }
                        if(!b){
                            expHist.stationHist.unshift(eo);
                        }
                        obj.eh = dojo.toJson(expHist);
                    }else{
                        this.putSkipLog('searchRoute not-found. transportType <- 2');
                        o.transportType = 2;
                    }
                    this.importExpStep3(jsons, dataIndex);
                },
                function(event){
                    this.putSkipLog('searchRoute failed. transportType <- 2');
                    o.transportType = 2;
                    this.importExpStep3(jsons, dataIndex);
                }
            );
            return;
        }
        req.expLogs.push({
            expApplyId : null,
            id            : null,
            jobId         : (o.jn ? this.jobMap[o.jn].Id : null),
            expItemId     : expItem.id,
            cost          : (typeof (o.mn) == 'number' ? o.mn : (/^(\d+)/.test(o.mn) ? parseInt(RegExp.$1, 10) : 0)),
            detail        : (o.nt || null),
            startName     : (o.ss || null),
            startCode     : (o.sc || null),
            endName       : (o.es || null),
            endCode       : (o.ec || null),
            roundTrip     : (o.rd || false),
            route         : (o.route || null),
            receipt       : expItem.receipt,
            transportType : '' + (o.transportType || expItem.transportType),

            taxType       : ({'無税':'1', '内税':'1', '外税':'2'}[o.tt] || (o.tt || null)),                           // 税タイプ
            taxAuto       : o.ta,                                                                                     // 消費税手入力
            withoutTax    : (typeof (o.wt) == 'number' ? o.wt : (/^(\d+)/.test(o.wt) ? parseInt(RegExp.$1, 10) : 0)), // 税抜金額
            tax           : (typeof (o.tx) == 'number' ? o.tx : (/^(\d+)/.test(o.tx) ? parseInt(RegExp.$1, 10) : 0)), // 消費税
            currencyName  : o.cn,                                                                                     // 通貨名
            currencyRate  : (typeof (o.rt) == 'number' ? o.rt : (/^(\d+)/.test(o.rt) ? parseInt(RegExp.$1, 10) : 0)), // 換算レート
            foreignAmount : (typeof (o.fa) == 'number' ? o.fa : (/^(\d+)/.test(o.fa) ? parseInt(RegExp.$1, 10) : 0)), // 現地金額

            order         : (i + 1)
        });
    }

    this.putLog('(' + dataIndex + ') 経費登録 - 明細数=' + req.expLogs.length);
    teasp.manager.request(
        'saveEmpExp',
        req,
        this.pouch,
        {
            hideBusy : true
        },
        this,
        function(){
            this.putLog(' .. ok', true);
            var that = this;
            teasp.manager.completeCheck(function(){
                that.importExpStep3(jsons, ++dataIndex);
            });
        },
        function(event){
            this.putLog(' .. failed', true);
            this.showError(event.message);
            this.setBusy(false);
        }
    );
};

/**
 * 工数実績データインポート（１）
 *
 * @returns なし
 */
teasp.view.BulkTest.prototype.importJobStep1 = function(jsons){
    var jobs = {};
    for( var i = 0 ; i < jsons.jbs.length ; i++){
        var o = jsons.jbs[i];
        for( var j = 0 ; j < o.works.length ; j++){
            var work = o.works[j];
            if(work.jn){
                jobs[work.jn] = 1;
            }
        }
    }
    var names = [];
    for( var key in jobs){
        if(jobs.hasOwnProperty(key)){
            names.push(key);
        }
    }
    this.putLog('ジョブID検索 - ' + names.join(','));
    teasp.manager.request(
        'getJobIdByNames',
        names.join('\t'),
        this.pouch,
        {
            hideBusy : true
        },
        this,
        function(result){
            this.putLog(' .. ok', true);
            console.debug(dojo.toJson(result));
            this.jobMap = result;
            this.importJobStep2(jsons, 0);
        },
        function(event){
            this.putLog(' .. failed', true);
            this.showError(event.message);
            this.setBusy(false);
        }
    );
};

/**
 * 工数実績データインポート（２）
 *
 * @param {Object} jsons 入力データリスト
 * @param {Number} dataIndex 処理対象の入力データインデックス
 * @returns なし
 */
teasp.view.BulkTest.prototype.importJobStep2 = function(jsons, dataIndex){
    if(jsons.jbs.length <= dataIndex){
        this.putLog('**** 工数インポート終了 ****');
        this.setBusy(false); // インポート終了
        return;
    }
    if(this.stopped){
        this.putSkipLog('**** 中止しました ****');
        this.setBusy(false);
        return;
    }
    var obj = jsons.jbs[dataIndex];

    obj.empId = this.getEmpIdByName(obj.en);

    if(!this.dayWorks || (obj.empId && this.pouch.getEmpId() && obj.empId != this.pouch.getEmpId())){
        var ym = (this.dayWorks ? this.getJobYearMonthByDate(obj.d) : 0);
        this.putLog('(' + dataIndex + ') 工数 - ' + ym);
        teasp.manager.request(
            'loadJobMonth',
            {
                empId : (obj.empId || ''),
                month : (ym || '')
            },
            this.pouch,
            {
                hideBusy : true
            },
            this,
            function(){
                this.putLog(' .. ok', true);
                if(!this.pouch.getEmpId()){
                    this.showError('ログインユーザに紐づく社員は設定されていません。社員名(en)をデータにセットしてください');
                    this.setBusy(false);
                    return;
                }
                obj.empId = this.pouch.getEmpId();
                this.dayWorks = this.getWorkDays(this.pouch.getJobYearMonth());
                this.importJobStep2(jsons, dataIndex);
            },
            function(event){
                this.putLog(' .. failed', true);
                this.showError(event.message);
                this.setBusy(false);
            }
        );
        return;
    }
    var ym = this.getJobYearMonthByDate(obj.d);
    if(this.pouch.getJobYearMonth() != ym){
        // --------------------------------------------------
        // 月度変更
        this.putLog('(' + dataIndex + ') 工数 - ' + ym);
        teasp.manager.request(
            'transJobMonth',
            {
                empId : this.pouch.getEmpId(),
                month : ym
            },
            this.pouch,
            {
                hideBusy : true
            },
            this,
            function(){
                if(this.pouch.getJobYearMonth() != ym){
                    this.showError('*** SYSTEM ERROR ***');
                    this.setBusy(false);
                }else{
                    this.putLog(' .. ok', true);
                    this.dayWorks = this.getWorkDays(ym);
                    this.importJobStep2(jsons, dataIndex);
                }
            },
            function(event){
                this.putLog(' .. failed', true);
                this.showError(event.message);
                this.setBusy(false);
            }
        );
        return;
    }

    this.putLog('(' + dataIndex + ') ' + (obj.d || ''));

    var dayWork = this.dayWorks[obj.d];
    var orgs = (dayWork.works || []);
    var classifyJobWorks = this.pouch.getClassifyJobWorks(obj.d);

    var req = {
        empId : this.pouch.getEmpId(),
        month : ym,
        date : obj.d,
        jobs : [],
        works : []
    };
    var volume = 0;
    for( var i = 0 ; i < obj.works.length ; i++){
        var w = obj.works[i];
        var o = {
            id       : null, // 暫定
            jobId    : this.jobMap[w.jn].Id,
            process  : (w.sb || null),
            time     : (teasp.util.time.clock2minutes(w.tm) || 0),
            timeFix  : (w.tx || false),
            volume   : (w.vl || 0),
            percent  : 0, // 暫定
            progress : null,
            taskNote : (w.tn ? w.tn.replace(/\\n/g, '\n') : null),
            order    : (i + 1)
        };
        if(!o.timeFix){
            volume += o.volume;
        }
        req.works.push(o);
    }
    for(i = 0 ; i < req.works.length ; i++){
        var work = req.works[i];
        if(!work.timeFix){
            work.percent = Math.round(work.volume / volume * 1000);
        }else{
            work.volume = Math.round(work.time * 100 / 60);
        }
        for( var j = 0 ; j < orgs.length ; j++){
            if(work.jobId == orgs[j].jobId){
                work.id = orgs[j].id;
                break;
            }
        }
    }
    var assigns = this.pouch.getAssignWorks(classifyJobWorks);
    for(i = 0 ; i < assigns.length ; i++){
        var assign = assigns[i];
        if(assign.jobAssign){
            req.jobs.push({
                id : assign.jobAssign.id,
                jobId : assign.jobId
            });
        }
    }

    this.putLog('(' + dataIndex + ') 工数登録 - 明細数=' + req.works.length);
    teasp.manager.request(
        'saveEmpWork',
        req,
        this.pouch,
        {
            hideBusy : true
        },
        this,
        function(){
            this.putLog(' .. ok', true);
            this.importJobStep2(jsons, ++dataIndex);
        },
        function(event){
            this.putLog(' .. failed', true);
            this.showError(event.message);
            this.setBusy(false);
        }
    );
};

/**
 * 日付をキーとした工数実績情報のマッピングテーブル作成
 *
 * @returns {Object}
 */
teasp.view.BulkTest.prototype.getWorkDays = function(jobYm){
    var jobYmObj = teasp.util.searchYearMonthDate(this.pouch.getJobInitialDayOfMonth(), this.pouch.getJobMarkOfMonth(), jobYm, null);
    var dlst = teasp.util.date.getDateList(jobYmObj.startDate, jobYmObj.endDate);
    var allWorks = this.pouch.getWorks();

    var days = {};
    var map = {};
    for( var i = 0 ; i < dlst.length ; i++){
        var dkey = dlst[i];
        var dayWork = days[dkey] = {
            time : 0,
            works : []
        };
        for( var j = 0 ; j < allWorks.length ; j++){
            var work = allWorks[j];
            if(work.date == dkey && work.time > 0){
                dayWork.works.push(work);
                dayWork.time += work.time;
                var wt = map[work.jobId];
                if(!wt){
                    wt = map[work.jobId] = {
                        jobName : work.job.name,
                        time : 0
                    };
                }
                wt.time += work.time;
            }
        }
    }
    return days;
};

// --------------------------------------------------------------------------
/**
 * データエクスポート実行
 *
 * @returns なし
 */
teasp.view.BulkTest.prototype.execVacuum = function(){
    if(this.isBusy()){
        return;
    }
    j$('#testLog2').text('');
    j$('#empVacuumArea').val('');
    var empIds = j$('#testEmpName').val();
    var sm = j$('#testYm1').val();
    var em = j$('#testYm2').val();
    var pool = {
        kt : {},
        jb : {},
        ep : {},
        empIdMap : {},
        empIds : empIds
    };
    for( var i = 0 ; i < empIds.length ; i++){
        var empId = empIds[i];
        for( var m = 0 ; m < this.masterEmps.length ; m++){
            if(this.masterEmps[m].id == empId){
                pool.empIdMap[empId] = this.masterEmps[m].name;
                break;
            }
        }
    }
    this.setBusy(true);
    this.vacuum(pool, 0, sm, em, 0);
};

/**
 * データ取得処理
 *
 * @param {Object} pool データ格納オブジェクト
 * @param {String} empIndex 対象社員のインデックス
 * @param {String or Number} sm 開始月度
 * @param {String or Number} em 終了月度
 * @param {Number} mIndex 処理対象月度を示すインデックス
 * @returns なし
 */
teasp.view.BulkTest.prototype.vacuum = function(pool, empIndex, sm, em, mIndex){
    if(typeof (sm) == 'string'){
        sm = parseInt(sm, 10);
    }
    if(typeof (em) == 'string'){
        em = parseInt(em, 10);
    }
    var empId = pool.empIds[empIndex];
    var ym = teasp.util.date.addYearMonth(sm, mIndex);
    if(ym > em){
        if(++empIndex < pool.empIds.length){
            empId = pool.empIds[empIndex];
            mIndex = 0;
            ym = sm;
        }else{
            this.vacuumEnd(pool);
            this.setBusy(false);
            return;
        }
    }
    // --------------------------------------------------
    // 社員＋月度変更
    if(!pool.kt.hasOwnProperty(empId + ':' + ym)){
        pool.kt[empId + ':' + ym] = [];
        this.putLog('勤怠 - ' + pool.empIdMap[empId] + ' - ' + ym);
        teasp.manager.request(
            'loadEmpMonth',
            {
                empId : empId,
                month : ym
            },
            this.pouch,
            {
                hideBusy : true
            },
            this,
            function(){
                this.putLog(' .. ok', true);
                var that = this;
                teasp.manager.completeCheck(function(){
                    that.vacuumEmpMonth(pool, empIndex, sm, em, mIndex);
                });
            },
            function(event){
                this.putLog(' .. failed', true);
                this.showError(event.message);
                this.setBusy(false);
            }
        );
    }else if(!pool.ep.hasOwnProperty(empId + ':' + ym)){
        pool.ep[empId + ':' + ym] = [];
        this.putLog('経費 - ' + pool.empIdMap[empId] + ' - ' + ym);
        teasp.manager.request(
            'getExpByDate',
            {
                empId : empId,
                month : ym
            },
            this.pouch,
            {
                hideBusy : true
            },
            this,
            function(){
                this.putLog(' .. ok', true);
                this.vacuumExpMonth(pool, empIndex, sm, em, mIndex);
            },
            function(event){
                this.putLog(' .. failed', true);
                this.showError(event.message);
                this.setBusy(false);
            }
        );
    }else if(!pool.jb.hasOwnProperty(empId + ':' + ym)){
        pool.jb[empId + ':' + ym] = [];
        this.putLog('工数 - ' + pool.empIdMap[empId] + ' - ' + ym);
        teasp.manager.request(
            'loadJobMonth',
            {
                empId : empId,
                month : ym
            },
            this.pouch,
            {
                hideBusy : true
            },
            this,
            function(){
                this.putLog(' .. ok', true);
                var that = this;
                teasp.manager.completeCheck(function(){
                    that.vacuumJobMonth(pool, empIndex, sm, em, mIndex);
                });
            },
            function(event){
                this.putLog(' .. failed', true);
                this.showError(event.message);
                this.setBusy(false);
            }
        );
    }else{
        this.vacuum(pool, empIndex, sm, em, ++mIndex);
    }
};

/**
 * オブジェクトをテキスト化して出力
 *
 * @param {Object} pool データ格納オブジェクト
 * @returns なし
 */
teasp.view.BulkTest.prototype.vacuumEnd = function(pool){
    var kts = [];
    var eps = [];
    var jbs = [];
    for( var key in pool.kt){
        if(pool.kt.hasOwnProperty(key) && pool.kt[key].length > 0){
            var l = pool.kt[key];
            l[0].en = pool.empIdMap[key.substring(0, key.indexOf(':'))];
            kts = kts.concat(l);
        }
    }
    for( var key in pool.ep){
        if(pool.ep.hasOwnProperty(key) && pool.ep[key].length > 0){
            var l = pool.ep[key];
            l[0].en = pool.empIdMap[key.substring(0, key.indexOf(':'))];
            eps = eps.concat(l);
        }
    }
    for( var key in pool.jb){
        if(pool.jb.hasOwnProperty(key) && pool.jb[key].length > 0){
            var l = pool.jb[key];
            l[0].en = pool.empIdMap[key.substring(0, key.indexOf(':'))];
            jbs = jbs.concat(l);
        }
    }
    var buf = '';
    var prv = null;
    var keys = [ 'rt', 'at', 'unrt', 'ap' ];
    for( var i = 0 ; i < kts.length ; i++){
        var kt = kts[i];
        if(!kt.en){
            kt.en = prv.en;
        }
        buf += ('勤怠\t' + (kt.en || '') + '\t' + (kt.d || '') + '\t' + (kt.st || '') + '\t' + (kt.et || '') + '\t');
        var max = 0;
        for( var k = 0 ; k < keys.length ; k++){
            var key = keys[k];
            kt[key] = (kt[key] || []);
            if(max < kt[key].length){
                max = kt[key].length;
            }
        }
        for(var j = 0 ; j < max ; j++){
            if(j > 0){
                buf += ('\n勤怠\t' + (kt.en || '') + '\t' + (kt.d || '') + '\t\t\t');
            }
            for( var k = 0 ; k < keys.length ; k++){
                var key = keys[k];
                if(key != 'ap'){
                    if(j < kt[key].length){
                        var o = kt[key][j];
                        buf += ((o.st || '') + '\t' + (o.et || '') + '\t');
                    }else{
                        buf += '\t\t';
                    }
                }else{
                    if(j < kt[key].length){
                        var o = kt[key][j];
                        buf += ((o.sn || '') + '\t' + (o.hn || '') + '\t' + (o.pn || '') + '\t' + (o.ed || '') + '\t' + (o.st || '') + '\t' + (o.et || '') + '\t' + (o.ex || '') + '\t' + (o.nt || '')
                                + '\t' + (o.ct || ''));
                    }else{
                        buf += '\t\t\t\t\t\t\t\t';
                    }
                }
            }
        }
        buf += '\n';
        prv = kt;
    }
    // --------------------------------------------------------
    // 経費
    prv = null;
    for( var i = 0 ; i < eps.length ; i++){
        var ep = eps[i];
        if(!ep.en){
            ep.en = prv.en;
        }
        buf += ('経費\t' + (ep.en || '') + '\t' + (ep.d || '') + '\t' + (ep.jn || '') + '\t' + (ep.it || '') + '\t' + (ep.ss || '') + '\t' + (ep.es || '') + '\t' + (ep.rd || '') + '\t' + (ep.mn || '')
                + '\t' + (ep.nt || ''));
        buf += '\n';
        prv = ep;
    }
    // --------------------------------------------------------
    // 工数実績
    prv = null;
    for( var i = 0 ; i < jbs.length ; i++){
        var jb = jbs[i];
        if(!jb.en){
            jb.en = prv.en;
        }
        buf += ('工数\t' + (jb.en || '') + '\t' + (jb.d || '') + '\t' + (jb.jn || '') + '\t' + (jb.sb || '') + '\t' + (jb.vl || '') + '\t' + (jb.tm || '') + '\t' + (jb.tx || '') + '\t' + (jb.tn || ''));
        buf += '\n';
        prv = jb;
    }
    j$('#empVacuumArea').val(buf);
    // --------------------------------------------------------
    this.putLog('**** エクスポート終了 ****');
};

/**
 * 取得した勤怠データをエクスポート用JSONに格納
 *
 * @param {Object} pool データ格納オブジェクト
 * @param {String} empIndex 対象社員のインデックス
 * @param {String or Number} sm 開始月度
 * @param {String or Number} em 終了月度
 * @param {Number} mIndex 処理対象月度を示すインデックス
 * @returns なし
 */
teasp.view.BulkTest.prototype.vacuumEmpMonth = function(pool, empIndex, sm, em, mIndex){
    pool.empIdMap[this.pouch.getEmpId()] = this.pouch.getName();
    var key = this.pouch.getEmpId() + ':' + this.pouch.getYearMonth();
    var dlst = this.pouch.getMonthDateList();
    for( var i = 0 ; i < dlst.length ; i++){
        var dayWrap = this.pouch.getEmpDay(dlst[i]);
        var dayObj = dayWrap.getObj();
        var st = (typeof (dayObj.startTime) == 'number' ? dayObj.startTime : null);
        var et = (typeof (dayObj.endTime) == 'number' ? dayObj.endTime : null);
        if(dayWrap.getDayType() != teasp.constant.DAY_TYPE_NORMAL && st === null && et === null){
            continue;
        }
        var pattern = dayWrap.getPattern();
        var applyList = dayWrap.getEmpApplyList(); // 有効な申請リストを得る
        var applys = [];
        var rt = [];
        var at = [];
        var unrt = [];
        var fixRests = [];
        var timeTable = dayWrap.getTimeTable();
        for( var j = 0 ; j < applyList.length ; j++){
            var a = applyList[j];
            if(a.startDate == dlst[i]){
                var o = {
                    sn : a.applyType
                };
                if(a.applyType == teasp.constant.APPLY_TYPE_HOLIDAY){
                    o.hn = a.holiday.name;
                }
                if(a.applyType == teasp.constant.APPLY_TYPE_PATTERNS || a.applyType == teasp.constant.APPLY_TYPE_PATTERNL){
                    o.pn = a.pattern.name;
                }
                if(a.startDate != a.endDate){
                    o.ed = a.endDate;
                }
                if(typeof (a.startTime) == 'number'){
                    o.st = teasp.util.time.timeValue(a.startTime);
                }
                if(typeof (a.endTime) == 'number'){
                    o.et = teasp.util.time.timeValue(a.endTime);
                }
                if(a.exchangeDate){
                    o.ex = a.exchangeDate;
                }
                if(a.note){
                    o.nt = a.note;
                }
                if(a.contact){
                    o.ct = a.contact;
                }
                applys.push(o);
            }
        }
        // 所定休憩時間のリストを得る
        // （取ってない所定休憩時間の計算用なので出退時刻どちらかが入力済みの場合だけ）
        if(st !== null || et !== null){
            for( var j = 0 ; j < pattern.restTimes.length ; j++){
                var o = pattern.restTimes[j];
                if(teasp.util.time.rangeTime({
                    from : st,
                    to : et
                }, [ o ]) > 0){
                    fixRests.push(o);
                }
            }
        }
        for( var j = 0 ; j < timeTable.length ; j++){
            var tt = timeTable[j];
            if(tt.type == teasp.constant.REST_FREE){
                rt.push({
                    st : teasp.util.time.timeValue(tt.from),
                    et : teasp.util.time.timeValue(tt.to)
                });
            }else if(tt.type == teasp.constant.AWAY){
                at.push({
                    st : teasp.util.time.timeValue(tt.from),
                    et : teasp.util.time.timeValue(tt.to)
                });
            }else if(tt.type == teasp.constant.REST_FIX){
                for( var k = 0 ; k < fixRests.length ; k++){
                    var fr = fixRests[k];
                    if((tt.from == fr.from && tt.to == fr.to) || (et && tt.from == fr.from && et < fr.to) || (st && tt.to == fr.to && fr.from < st)){
                        fr.flag = 1;
                    }
                }
            }
        }
        for( var j = 0 ; j < fixRests.length ; j++){
            var fr = fixRests[j];
            if(!fr.flag){
                unrt.push({
                    st : teasp.util.time.timeValue(fr.from),
                    et : teasp.util.time.timeValue(fr.to)
                });
            }
        }
        var o = {
            d : dlst[i]
        };
        if(st !== null){
            o.st = teasp.util.time.timeValue(st);
        }
        if(et !== null){
            o.et = teasp.util.time.timeValue(et);
        }
        if(rt.length > 0){
            o.rt = rt;
        }
        if(at.length > 0){
            o.at = at;
        }
        if(unrt.length > 0){
            o.unrt = unrt;
        }
        if(applys.length > 0){
            o.ap = applys;
        }
        ;
        pool.kt[key].push(o);
    }
    this.vacuum(pool, empIndex, sm, em, mIndex);
};

/**
 * 取得した経費データをエクスポート用JSONに格納
 *
 * @param {Object} pool データ格納オブジェクト
 * @param {String} empIndex 対象社員のインデックス
 * @param {String or Number} sm 開始月度
 * @param {String or Number} em 終了月度
 * @param {Number} mIndex  処理対象月度を示すインデックス
 * @returns なし
 */
teasp.view.BulkTest.prototype.vacuumExpMonth = function(pool, empIndex, sm, em, mIndex){
    pool.empIdMap[this.pouch.getEmpId()] = this.pouch.getName();
    var key = this.pouch.getEmpId() + ':' + this.pouch.getJobYearMonth();
    var expLogs = this.pouch.getExpLogs();
    expLogs = expLogs.sort(function(a, b){
        if(a.date == b.date){
            if(a.expApplyId && !b.expApplyId){
                return -1;
            }else if(!a.expApplyId && b.expApplyId){
                return 1;
            }else{
                return a.order - b.order;
            }
        }
        return (a.date < b.date ? -1 : (a.date > b.date ? 1 : 0));
    });
    for( var i = 0 ; i < expLogs.length ; i++){
        var expLog = expLogs[i];
        var o = {
            d : expLog.date
        };
        o.jn = (expLog.job ? expLog.job.name : null);
        o.it = expLog.expItem.name;
        o.ss = (expLog.startName || null);
        o.sc = (expLog.startCode || null);
        o.es = (expLog.endName || null);
        o.ec = (expLog.endCode || null);
        o.rd = (expLog.roundTrip || false);
        o.mn = (expLog.cost || 0);
        o.nt = (expLog.detail || null);
        pool.ep[key].push(o);
    }
    this.vacuum(pool, empIndex, sm, em, mIndex);
};

/**
 * 取得した工数データをエクスポート用JSONに格納
 *
 * @param {Object} pool データ格納オブジェクト
 * @param {String} empIndex 対象社員のインデックス
 * @param {String or Number} sm 開始月度
 * @param {String or Number} em 終了月度
 * @param {Number} mIndex  処理対象月度を示すインデックス
 * @returns なし
 */
teasp.view.BulkTest.prototype.vacuumJobMonth = function(pool, empIndex, sm, em, mIndex){
    pool.empIdMap[this.pouch.getEmpId()] = this.pouch.getName();
    var ym = teasp.util.date.addYearMonth(sm, mIndex);
    var ymInfo = teasp.util.searchYearMonthDate(this.pouch.getJobInitialDayOfMonth(), this.pouch.getJobMarkOfMonth(), ym, null);
    var dlst = teasp.util.date.getDateList(ymInfo.startDate, ymInfo.endDate);
    var key = this.pouch.getEmpId() + ':' + this.pouch.getJobYearMonth();
    var dayWorks = this.getWorkDays(ym);
    for( var i = 0 ; i < dlst.length ; i++){
        var dayWork = dayWorks[dlst[i]];
        for( var j = 0 ; j < dayWork.works.length ; j++){
            var work = dayWork.works[j];
            var o = {
                d : dlst[i]
            };
            o.jn = (work.job ? work.job.name : null);
            o.sb = work.process;
            o.vl = (work.volume || 0);
            o.tm = teasp.util.time.timeValue(work.time || 0);
            o.tx = work.timeFix;
            o.tn = (work.taskNote ? work.taskNote.replace(/\n/g, '\\n') : '');
            pool.jb[key].push(o);
        }
    }
    this.vacuum(pool, empIndex, sm, em, mIndex);
};

teasp.view.BulkTest.prototype.yuqInfoTest = function(){
    var empId = j$('#testEmpName2').val();
    document.body.style.cursor = 'wait';
    teasp.manager.request(
        'getAllEmpYuqs',
        {
            empId  : empId
        },
        this.pouch,
        { hideBusy : true },
        this,
        function(obj){
            document.body.style.cursor = 'default';
            console.log(dojo.toJson(obj));
            this.showYuqInfo(obj);
        },
        function(event){
            document.body.style.cursor = 'default';
            console.log(teasp.message.getErrorMessage(event));
        }
    );
};

teasp.view.BulkTest.prototype.showYuqInfo = function(obj){
    var yqlst = [];
    for(var i = 0; i < obj.empYuqs.length; i++) {
        var yq = obj.empYuqs[i];
        if (yq.totalTime <= 0) {
            continue;
        }
        yq.children = [];
        yq.group = [];
        for (var j = 0; j < obj.empYuqDetails.length; j++) {
            var yd = obj.empYuqDetails[j];
            if(yq.id == yd.empYuqId){
                yq.children.push(yd);
            }
            if(yq.id == yd.groupId && yq.id != yd.empYuqId){
                yq.group.push(yd);
            }
        }
        yqlst.push(yq);
    }
    yqlst = yqlst.sort(function(a, b){
        if(a.limitDate == b.limitDate){
            return (a.startDate < b.startDate ? -1 : (a.startDate > b.startDate ? 1 : 0));
        }
        return (a.limitDate < b.limitDate ? -1 : 1);
    });
    for (var i = 0; i < yqlst.length; i++) {
        var yq = yqlst[i];
        yq.group = yq.group.sort(function(a, b){
            if(!a.parent && !b.parent){
                return 0;
            }else if(!a.parent || !b.parent){
                return (!a.parent ? -1 : 1);
            }
            if(a.parent.date == b.parent.date){
                return (a.parent.date < b.parent.date ? -1 : (a.parent.date > b.parent.date ? 1 : 0));
            }
            return (a.parent.date < b.parent.date ? -1 : 1);
        });
    }
    var thead = dojo.byId('yuqInfoHead');
    var tbody = dojo.byId('yuqInfoBody');
    while(thead.firstChild){
        dojo.destroy(thead.firstChild);
    }
    while(tbody.firstChild){
        dojo.destroy(tbody.firstChild);
    }
    var row;
    row = dojo.create('tr', null, thead);
    dojo.create('div', { innerHTML: 'subject'                }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'id'                     }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'date'                   }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'startDate'              }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'limitDate'              }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'baseTime'               }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'autoFlag'               }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'batchId'                }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'empApplyId'             }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'lostFlag'               }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'oldNextYuqProvideDate'  }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'provideDay'             }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'spendDay'               }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'totalTime'              }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'tempFlag'               }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'timeUnit'               }, dojo.create('th', null, row));
    for(var i = 0 ; i < yqlst.length ; i++){
        var yq = yqlst[i];
        row = dojo.create('tr', null, tbody);
        var c = 0;
        dojo.create('div', { innerHTML: yq.subject                }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.id                     }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.date                   }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.startDate              }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.limitDate              }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.baseTime               }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.autoFlag               }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.batchId                }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.empApplyId             }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.lostFlag               }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.oldNextYuqProvideDate  }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.provideDay             }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.spendDay               }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.totalTime              }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.tempFlag               }, dojo.create('td', null, row));   c++;
        dojo.create('div', { innerHTML: yq.timeUnit               }, dojo.create('td', null, row));   c++;

        if(yq.group.length > 0){
            row = dojo.create('tr', null, tbody);
            var cell = dojo.create('td', { colSpan: c }, row);
            var tbl = dojo.create('table', { className: 'yuqgrp', style: 'margin:2px 2px 2px 120px;'}, cell);
            var chead1 = dojo.create('thead', null, tbl);
            row = dojo.create('tr', null, chead1);
            dojo.create('div', { innerHTML: 'subject'      }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'id'           }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'empApplyId'   }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'date'         }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'startDate'    }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'limitDate'    }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'baseTime'     }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'lostFlag'     }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'id'           }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'empYuqId'     }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'groupId'      }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'time'         }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'days'         }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'provideDays'  }, dojo.create('th', null, row));
            dojo.create('div', { innerHTML: 'spendDays'    }, dojo.create('th', null, row));
            var cbody1 = dojo.create('tbody', null, tbl);
            for(var j = 0 ; j < yq.group.length ; j++){
                var yd = yq.group[j];
                var p = yd.parent;
                row = dojo.create('tr', null, cbody1);
                dojo.create('div', { innerHTML: p.subject       }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: p.id            }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: p.empApplyId    }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: p.date          }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: p.startDate     }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: p.limitDate     }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: p.baseTime      }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: p.lostFlag      }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: yd.id           }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: yd.empYuqId     }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: yd.groupId      }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: yd.time         }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: yd.days         }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: yd.provideDays  }, dojo.create('td', null, row));
                dojo.create('div', { innerHTML: yd.spendDays    }, dojo.create('td', null, row));
            }
            dojo.create('div', null, cell);
        }
    }
};
