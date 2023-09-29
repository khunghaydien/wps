teasp.provide('teasp.util.Test');
/**
 * 自動テスト用のクラス
 *
 * @constructor
 */
teasp.util.Test = function(){
    this.seeds = [];
    this.processList = [];
    this.processIndex = 0;
    this.que1 = [];
    this.que2 = [];
    this.active = false;
    this.doneCnt = 0;
    this.allCnt = 0;
    this.infinity = false;
    this.signalObj = null;
    this.map = {
        'click'           : this.click,
        'input'           : this.input,
        'cancelAllDayFix' : this.cancelAllDayFix,
        'empApplyMenu'    : this.empApplyMenu
    };
    this.contents = {
        'T' : '勤怠入力',
        'A' : '申請開閉',
        'D' : '日次確定',
        'M' : '月めくり'
    };
};

/**
 * コントロール部表示エリア初期化
 *
 * @param {string} area
 */
teasp.util.Test.prototype.init = function(areaId){
    var area = dojo.create('div', { style: { position:"absolute", left:"960px", top:"0px", backgroundColor:"#1e50a2", zIndex:"3000" } }, dojo.byId(areaId));
    // テストタイプ
    var select = dojo.create('select', {
        id    : 'ttvTestType',
        style : { margin:"2px", "float":"left" }
    }, area);
    for(var key in this.contents){
        dojo.create('option', { innerHTML: this.contents[key], value: key }, select);
    }
    select = null;

    // スタートボタン
    dojo.connect(dojo.create('input', {
        type  : 'button',
        value : 'Start',
        id    : 'ttvTestStartButton',
        style : { padding:"2px 4px", margin:"2px" }
    }, dojo.create('div', { style: { "float":"left" } }, area)), 'onclick', this, function(){
        this.start(dojo.byId('ttvTestType').value);
    });

    // ストップボタン
    dojo.connect(dojo.create('input', {
        type  : 'button',
        value : 'Stop',
        id    : 'ttvTestStopButton',
        style : { padding:"2px 4px", margin:"2px" }
    }, dojo.create('div', { style: { "float":"left" } }, area)), 'onclick', this, function(){
        this.stop();
    });
    dojo.create('div', { style: { clear:"both" } }, area);

    dojo.create('span', {
        innerHTML : ' Repeat',
        style     : { color: "white" }
    }, dojo.create('input', {
        type    : 'checkbox',
        id      : 'ttvTestRepeat',
        style   : { margin:"2px" }
    }, dojo.create('label', null, dojo.create('div', { style: null }, area))), 'after');
    dojo.byId('ttvTestRepeat').checked = true;

    // 経過表示
    var panel = dojo.create('div', {
        id    : 'ttvTestPanel',
        style : { margin:"4px", display:"none" }
    }, area);

    dojo.create('div', {
        id    : 'ttvTestCnt',
        style : { color:"white", textAlign:"center" }
    }, dojo.create('div', {
        innerHTML : 'All',
        style     : { color:"white", textAlign:"center" }
    }, dojo.create('div', {
        style     : { "float":"left", marginRight:"12px", textAlign:"center" }
    }, panel)), 'after');

    dojo.create('div', {
        id    : 'ttvTestDone',
        style : { color:"white", textAlign:"center" }
    }, dojo.create('div', {
        innerHTML : 'End',
        style     : { color:"white", textAlign:"center" }
    }, dojo.create('div', {
        style     : { "float":"left", marginRight:"16px", textAlign:"center" }
    }, panel)), 'after');

    dojo.create('div', {
        id    : 'ttvTestQ1',
        style : { color:"white", textAlign:"center" }
    }, dojo.create('div', {
        innerHTML : 'Q1',
        style     : { color:"white", textAlign:"center" }
    }, dojo.create('div', {
        style     : { "float":"left", marginRight:"12px", textAlign:"center" }
    }, panel)));

    dojo.create('div', {
        id    : 'ttvTestQ2',
        style : { color:"white", textAlign:"center" }
    }, dojo.create('div', {
        innerHTML : 'Q2',
        style     : { color:"white", textAlign:"center" }
    }, dojo.create('div', {
        style     : { "float":"left", marginRight:"2px", textAlign:"center" }
    }, panel)));

    dojo.create('div', { style: { clear:"both" } }, panel);

    dojo.create('div', {
        id    : 'ttvTestStatus',
        style : { color:"white", marginTop:"4px", marginBottom:"2px", border:"1px solid white", display:"table", padding:"0px" }
    }, panel);

    this.extent();
};

/**
 * コントロール部表示エリアの差込拡張用
 *
 */
teasp.util.Test.prototype.extent = function(){
};

/**
 * イベントを発生させる
 *
 * @param {string} id
 * @param {string} key
 */
teasp.util.Test.pushEvent = function(id, key){
    // 強制的にイベントを呼び出す
    var elm = document.getElementById(id);
    if(elm.fireEvent && dojo.isIE <= 8){ // for IE
        elm.fireEvent(key);
    }else{ // for Firefox, Chrome, Safari
        var v = ({
            "onclick" : "click"
        }[key] || key);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent(v, false, true);
        elm.dispatchEvent(evt);
    }
    elm = null;
};

/**
 * テスト要素配列リセット
 *
 */
teasp.util.Test.prototype.reset = function(){
    this.seeds = [];
};

/**
 * テスト要素を追加
 *
 */
teasp.util.Test.prototype.addSeed = function(seed){
    this.seeds.push(seed);
};

/**
 * テスト手順を作成
 *
 */
teasp.util.Test.prototype.createProcessList = function(key){
    var pool = [];
    if(key == 'T'){ // 勤怠入力
        var st = 9 * 60;
        var et = 18 * 60;
        for(var h = 0 ; h < 10 ; h++){
            for(var i = 0 ; i < this.seeds.length ; i++){
                var o = this.seeds[i];
                if(!o.inputable){
                    continue;
                }
                // 勤怠入力
                var cmdLst = [];
                cmdLst.push({ methodKey: 'click', evt:'onclick', wait: 2000, id: 'ttvTimeSt' + o.dkey });
                var l = [];
                l.push({ id: 'startTime', value: teasp.util.time.timeValue(st) });
                l.push({ id: 'endTime'  , value: teasp.util.time.timeValue(et) });
                cmdLst.push({ methodKey: 'input', wait: 700, lst: l });
                cmdLst.push({ methodKey: 'click', evt:'onclick', wait:700, id: 'dlgInpTimeOk' });
                pool.push(cmdLst);

                // 工数入力
                cmdLst = [];
                cmdLst.push({ methodKey: 'click', evt:'onclick', wait:1500, id: 'dailyWorkCell' + o.dkey });
                l = [];
                l.push({ id: 'empWorkSlider0', value:12*6, type: 'dijit' });
                l.push({ id: 'empWorkSlider1', value:12*2, type: 'dijit' });
                cmdLst.push({ methodKey: 'input', wait: 700, lst: l });
                cmdLst.push({ methodKey: 'click', evt:'onclick', wait:700, id: 'empWorkOk' });
                pool.push(cmdLst);
                st++;
                et++;
            }
            if(!dojo.byId('ttvTestRepeat').checked){
                break;
            }
        }
    }else if(key == 'A'){ // 申請開閉
        for(var i = 0 ; i < this.seeds.length ; i++){
            var o = this.seeds[i];
            if(!o.applyable){
                continue;
            }
            var cmdLst = [];
            cmdLst.push({ methodKey: 'click'       , evt:'onclick', wait: 1000, id: 'ttvApply' + o.dkey });
            cmdLst.push({ methodKey: 'empApplyMenu', evt:'onclick', wait: 1000, type: 'apply'          , key: 'patternS'  });
//            var l = [];
//            l.push({ id: 'dialogApplyDirectIn', checked: true, contOn: true });
//            cmdLst.push({ methodKey: 'input', wait: 700, lst: l });
            cmdLst.push({ methodKey: 'click'       , evt:'onclick', wait: 1500, id: 'dialogApplyClose'  });
            pool.push(cmdLst);
        }
    }else if(key == 'D'){ // 日次確定
        for(var i = 0 ; i < this.seeds.length ; i++){
            var o = this.seeds[i];
            if(!o.dayFixable){
                continue;
            }
            var cmdLst = [];
            cmdLst.push({ methodKey: 'click', evt:'onclick', wait: 1000, id: 'ttvDayFix' + o.dkey });
            pool.push(cmdLst);
        }
        if(dojo.byId('ttvTestRepeat').checked){
            pool.push([{ methodKey: 'cancelAllDayFix' }]);
        }
    }else if(key == 'M'){ // 月めくり
        var cmdLst = [];
        for(var m = 0 ; m < 1 ; m++){
            for(var i = 0 ; i < 12 ; i++){
                cmdLst.push({ methodKey: 'click', evt:'onclick', wait: 5000, id: 'prevMonthButton' });
            }
            for(var i = 0 ; i < 12 ; i++){
                cmdLst.push({ methodKey: 'click', evt:'onclick', wait: 5000, id: 'nextMonthButton' });
            }
        }
        pool.push(cmdLst);
    }
    return pool;
};

/**
 * テスト手順を取得
 *
 */
teasp.util.Test.prototype.getProcessList = function(key){
    return this.createProcessList(key);
};

/**
 * テスト実行
 *
 */
teasp.util.Test.prototype.start = function(key){
    this.key = key;
//    dojo.byId('ttvTestTitle').innerHTML = this.contents[key];
    dojo.style('ttvTestPanel', 'display', 'table');
    this.processList[this.key] = this.getProcessList(this.key);
    this.processIndex = 0;
    this.que1 = [];
    this.que2 = [];
    this.doneCnt = 0;
    this.allCnt = 0;
    var pl = this.processList[key];
    for(var i = 0 ; i < pl.length ; i++){
        var l = pl[i];
        this.allCnt += l.length;
    }
    dojo.byId('ttvTestDone').innerHTML = this.doneCnt;
    dojo.byId('ttvTestCnt').innerHTML  = this.allCnt;
    this.showStatus('実行中');
    this.showQueCnt();
    this.active = true;
    this.signal();
};

/**
 * テスト中止
 */
teasp.util.Test.prototype.stop = function(){
    this.active = false;
    this.showStatus('中止しています');
};

/**
 * テスト中止後の処理
 */
teasp.util.Test.prototype.stopDone = function(){
    this.showStatus('中止しました');
};

/**
 * 終了後の処理
 */
teasp.util.Test.prototype.end = function(){
    this.showStatus('終了');
};

/**
 * 状況表示
 * @param {string} status
 */
teasp.util.Test.prototype.showStatus = function(status){
    dojo.byId('ttvTestStatus').innerHTML = status;
};

/**
 * キュー数表示
 */
teasp.util.Test.prototype.showQueCnt = function(){
    dojo.byId('ttvTestQ1').innerHTML = this.que1.length;
    dojo.byId('ttvTestQ2').innerHTML = this.que2.length;
};

/**
 * 実行数表示
 */
teasp.util.Test.prototype.showDoneCnt = function(){
    dojo.byId('ttvTestDone').innerHTML = (++this.doneCnt);
};

/**
 * 次の手順を取得
 *
 * @return {Array.<Object>|null} 次の手順セット。nullの場合はなし（中止か終了）
 */
teasp.util.Test.prototype.nextProcess = function(){
    if(!this.active || !this.key){
        return null;
    }
    var l = this.processList[this.key];
    if(l.length <= 0 || this.processIndex >= l.length){
        if(this.infinity){
            this.processIndex = 0;
        }else{
            return null;
        }
    }
    var p = l[this.processIndex];
    this.processIndex++;
    return p;
};

/**
 * シグナル受信。手順を起こす
 *
 * @param {Object} o
 */
teasp.util.Test.prototype.signal = function(o){
    this.signalObj = o;
    if(!this.active){
        this.stopDone(); // 中止
        return;
    }
    var l = this.nextProcess();
    if(!l){
        this.end(); // 終了
        return;
    }
    for(var i = 0 ; i < l.length ; i++){
        this.que1.push(l[i]);
    }
    this.showQueCnt();
    this.raise();
};

/**
 * 手順の１コマンドずつタイマーで実行
 *
 * @param {Object} o
 */
teasp.util.Test.prototype.raise = function(){
    if(!this.active){
        this.stopDone(); // 中止
        return;
    }
    if(this.que2.length <= 0 && this.que1.length > 0){
        var cmd = this.que1.shift();
        this.que2.push(cmd);
        this.showQueCnt();
        setTimeout(dojo.hitch(this, this.map[cmd.methodKey]), (cmd.wait || 1000));
    }
    if(!this.infinity && this.doneCnt >= this.allCnt){
        this.end(); // 終了
    }
};

/**
 * [コマンド] クリックイベント発行
 *
 */
teasp.util.Test.prototype.click = function(){
    var cmd = this.que2.shift();
    if(!cmd){
        return;
    }
    this.showQueCnt();
    teasp.util.Test.pushEvent(cmd.id, cmd.evt);
    this.showDoneCnt();
    this.raise();
};

/**
 * [コマンド] 値をセット
 *
 */
teasp.util.Test.prototype.input = function(){
    var cmd = this.que2.shift();
    if(!cmd){
        return;
    }
    this.showQueCnt();
    var l = cmd.lst;
    for(var i = 0 ; i < l.length ; i++){
        var o = l[i];
        if(o.type == 'dijit'){
            dijit.byId(o.id).setValue(o.value);
        }else{
            dojo.byId(o.id).value = o.value;
        }
    }
    this.showDoneCnt();
    this.raise();
};

/**
 * 日次確定を全部取り消す
 *
 */
teasp.util.Test.prototype.cancelAllDayFix = function(){
    this.infinity = (dojo.byId('ttvTestRepeat').checked);
    var cmd = this.que2.shift();
    if(!cmd){
        return;
    }
    this.showQueCnt();
    var pouch = teasp.viewPoint.pouch;
    var dateList = pouch.getMonthDateList();
    var reqs = [];
    for(var r = 0 ; r < dateList.length ; r++){
        var dkey = dateList[r];
        var dayWrap = pouch.getEmpDay(dkey);
        var da = dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_DAILY);
        if(da){
            reqs.push({
                funcName: 'cancelApplyEmpDay',
                params  : {
                    empId            : pouch.getEmpId(),
                    month            : pouch.getYearMonth(),
                    lastModifiedDate : pouch.getLastModifiedDate(),
                    appId            : da.id,
                    date             : dkey,
                    clearTime        : false,
                    client           : "monthly",
                    noDelay          : true,
                    remove           : false
                }
            });
        }
    }
    if(reqs.length <= 0){
        this.raise();
        return;
    }
    var f = dojo.hitch(this, function(){
        teasp.manager.request(
            'transEmpMonth',
            {
                empId : pouch.getEmpId(),
                month : pouch.getYearMonth()
            },
            pouch,
            { hideBusy : true },
            this,
            function(obj){
                teasp.manager.dialogClose('BusyWait');
                teasp.viewPoint.refreshMonthly2();
                this.showDoneCnt();
                this.raise();
            },
            function(event){
                teasp.manager.dialogClose('BusyWait');
                teasp.util.showErrorArea(event, null);
                teasp.viewPoint.refreshMonthly2();
                this.showDoneCnt();
            }
        );
    });
    teasp.manager.dialogOpen('BusyWait');
    teasp.action.contact.remoteMethods(
        reqs,
        { nowait: true, errorAreaId: null },
        function(result, index){
            pouch.setLastModifiedDate(result.lastModifiedDate);
            if(index < (reqs.length - 1)){
                reqs[index + 1].params.lastModifiedDate = pouch.getLastModifiedDate();
            }else{
                f();
            }
        },
        function(result, index){
            teasp.manager.dialogClose('BusyWait');
            teasp.util.showErrorArea(result, null);
            this.showDoneCnt();
        },
        this
    );
};

teasp.util.Test.prototype.empApplyMenu = function(){
    this.infinity = (dojo.byId('ttvTestRepeat').checked);
    var cmd = this.que2.shift();
    if(!cmd){
        return;
    }
    this.showQueCnt();

    dijit.byId('empApplyTab').selectChild(dijit.byId('empApplyContent0'));

    if(cmd.type == 'apply'){
        teasp.util.Test.pushEvent('applyNew_' + cmd.key, cmd.evt);
        this.showDoneCnt();
    }else{
        this.showDoneCnt();
        this.raise();
    }
};
