//------------------------------------------------------------------------------
//
//------------------------------------------------------------------------------
// グローバル変数
if(!ATK){
    var ATK = {};
}
if(!ATK.dialog){
    ATK.dialog = {};
}
if(!ATK.obj){
    ATK.obj = {};
}
//------------------------------------------------------------------------------

// logic: 休暇のツールチップのラベル
var getHolidayTip = function(h){
    var content = '<table class="tip_table">';
    content += '<tr><td>' + teasp.message.getLabel('tk10000582') + '</td><td class="tip_right">' + h.name + '</td></tr>'; // 休暇名
    content += '<tr><td>' + teasp.message.getLabel('tk10001027') + '</td><td class="tip_right">' // 種類
    switch(h.type){
    case '1': content += teasp.message.getLabel('holidayYuq_label'); break; // 有給
    case '2': content += teasp.message.getLabel('tm10010540');       break; // 無給
    case '3': content += teasp.message.getLabel('tm10010550');       break; // 代休
    }
    content += '</td></tr>';
    content += '<tr><td>' + teasp.message.getLabel('tk10001028') + '</td><td class="tip_right">'; // 範囲
    switch(h.range){
    case '1': content += teasp.message.getLabel('holidayDay_label'); break; // 終日休
    case '2': content += teasp.message.getLabel('tk10001029');       break; // 午前休
    case '3': content += teasp.message.getLabel('tk10001030');       break; // 午後休
    case '4': content += teasp.message.getLabel('tm10010560');       break; // 時間単位休
    }
    content += '</td></tr>';
    content += '<tr><td>' + teasp.message.getLabel('holidayYuqSpend_label') + '</td><td class="tip_right">' + teasp.message.getLabel(h.yuqSpend              ? 'tm10010590' : 'tm10010600') + '</td></tr>'; // 有休消化 する or しない
    content += '<tr><td>' + teasp.message.getLabel('tk10001031')            + '</td><td class="tip_right">' + teasp.message.getLabel(h.isWorking             ? 'tm10010610' : 'tm10010620') + '</td></tr>'; // 出勤率判定 加味する or 加味しない
    content += '<tr><td>' + teasp.message.getLabel('tk10003720')            + '</td><td class="tip_right">' + teasp.message.getLabel(h.displayDaysOnCalendar ? 'tm10010590' : 'tm10010600') + '</td></tr>'; // 暦日表示 する or しない
    content += '<tr><td>' + teasp.message.getLabel('tk10001085')            + '</td><td class="tip_right">' + teasp.message.getLabel(h.managed               ? 'tm10010590' : 'tm10010600') + '</td></tr>'; // 日数管理 する or しない
    content += '<tr><td>' + teasp.message.getLabel('tk10001104')            + '</td><td class="tip_right">' + (h.managed   ? h.manageName : '-') + '</td></tr>'; // 管理名
    content += '<tr><td style="vertical-align:top;">' + teasp.message.getLabel('tm20004650') + '</td><td class="tip_right"><pre>' + (h.description || '-') + '</pre></td></tr>'; // 説明
    content += '</table>';
    return content;
};

// logic: 勤務パターンのツールチップのラベル
var getPatternTip = function(p){
    var content = '<table class="tip_table">';
    content += '<tr><td>' + teasp.message.getLabel('tk10001032')     + '</td><td class="tip_right">' + p.name + '</td></tr>'; // 勤務パターン名
    content += '<tr><td>' + teasp.message.getLabel('tm10010170')     + '</td><td class="tip_right">' + ATK.util.timeValue(p.stdStartTime) + '-' + ATK.util.timeValue(p.stdEndTime) + '</td></tr>'; // 始業終業の時刻
    content += '<tr><td>' + teasp.message.getLabel('restTime_label') + '</td><td class="tip_right">'; // 休憩時間
    if(typeof(p.restTimes) == 'string'){
        var l = p.restTimes.split(',');
        var tmp = [];
        for(var i = 0 ; i < l.length ; i++){
            if(/(\d+)-(\d+)/.test(l[i])){
                tmp.push({ from : parseInt(RegExp.$1, 10), to : parseInt(RegExp.$2, 10) });
            }
        }
        p.restTimes = tmp;
    }
    if(p.restTimes){
        for(var i = 0 ; i < p.restTimes.length ; i++){
            content += (i > 0 ? ',' : '') + ATK.util.timeValue(p.restTimes[i].from) + '-' + ATK.util.timeValue(p.restTimes[i].to);
        }
    }
    content += '</td></tr>';
    content += '<tr><td>' + teasp.message.getLabel('fixTimeOfDay_label') + '</td><td class="tip_right">' + ATK.util.timeValue(p.standardFixTime) + '</td></tr>'; // 所定労働時間
    content += '<tr><td>' + teasp.message.getLabel('tk10000532')         + '</td><td class="tip_right">' + teasp.message.getLabel(p.useHalfHoliday ? 'tm10010200' : 'tm10010210') + '</td></tr>'; // 半日休暇設定 取得可 or 取得不可
    if(p.useHalfHoliday){
        content += '<tr><td style="padding-left:10px;">' + teasp.message.getLabel('tk10000534') + '</td><td class="tip_right">' + ATK.util.timeValue(p.amHolidayStartTime) + '-' + ATK.util.timeValue(p.amHolidayEndTime) + '</td></tr>'; // 午前半休適用時間
        content += '<tr><td style="padding-left:10px;">' + teasp.message.getLabel('tk10000535') + '</td><td class="tip_right">' + ATK.util.timeValue(p.pmHolidayStartTime) + '-' + ATK.util.timeValue(p.pmHolidayEndTime) + '</td></tr>'; // 午後半休適用時間
    }
    content += '<tr><td>' + teasp.message.getLabel('nightWorkEx_label') + '</td><td class="tip_right">' + teasp.message.getLabel(p.ignoreNightWork ? 'tm10010150' : 'tm10010140') + '</td></tr>'; // 深夜労働割増 なし or あり
    content += '<tr><td>' + teasp.message.getLabel('tm10010240') + '</td><td class="tip_right">' + teasp.message.getLabel(p.useDiscretionary ? 'tm10010250' : 'tm10010260') + '</td></tr>'; // 裁量労働 採用する or 採用しない
    content += '<tr><td>' + teasp.message.getLabel('tk10001035') + '</td><td class="tip_right">' + teasp.message.getLabel(p.range=='1' ? 'tk10001036' : 'tk10001037') + '</td></tr>'; // 対象期間 短期 or 長期
    content += '</table>';
    return content;
};

var setDialogPosition = function(dialog, posX, posY){
    if(!/Android/.test(navigator.userAgent)){
        return;
    }
    // 表示位置をセット
    var bodyDiv = dojo.byId("bodyCell");
    var x = bodyDiv.offsetLeft + posX;
    var y = bodyDiv.offsetTop  + posY;
    dialog._position = dojo.hitch(dialog, function(){
        var style = this.domNode.style;
        style.left = x + "px";
        style.top  = y + "px";
    });
};

ATK.dialog.searchDeptDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10001038'), // 部署検索
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:480px;">'
            + '  <table class="ts_a_frame">'
            + '  <tr>'
            + '    <td class="edgelt"></td>'
            + '    <td class="edgeht"></td>'
            + '    <td class="edgert"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgevl"></td>'
            + '    <td>'
            + '      <div class="edge_div">'
            + '        <table class="stand_table">'
            + '        <tr>'
            + '          <td class="left_s">'
            + teasp.message.getLabel('tk10000337') // 上位部署名
            + '          </td>'
            + '          <td class="right">'
            + '            <select class="inputran" id="searchDeptParent" style="width:260px;">'
            + '            </select>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left_s">'
            + teasp.message.getLabel('tk10000069') // 部署コード
            + '          </td>'
            + '          <td class="right">'
            + '            <input type="text" id="searchDeptCode" value="" maxlength="20" class="inputran inputtex" style="width:100px;"/>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left_s">'
            + teasp.message.getLabel('tk10000335') // 部署名
            + '          </td>'
            + '          <td class="right">'
            + '            <input type="text" id="searchDeptName" value="" maxlength="80" class="inputran inputtex" style="width:140px;"/>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '            <td class="left_s">' + teasp.message.getLabel('date_head') + '</td>' // 日付
            + '            <td class="right">'
            + '                <input type="text" id="searchDeptDate" value="" maxlength="12" class="inputran inputtex" style="width:90px;text-align:center;"/>'
            + '                &nbsp;'
            + '                <input type="button" class="pp_base pp_btn_cal" id="searchDeptDateCal"  />'
            + '                &nbsp;&nbsp;'
            + '                <select class="inputran" style="vertical-align:middle;" id="searchDeptDateThan">'
            + '                    <option value="0">' + teasp.message.getLabel('tk10000350') + '</option>' // 以降
            + '                    <option value="1">' + teasp.message.getLabel('tk10000349') + '</option>' // 以前
            + '                </select>'
            + '            </td>'
            + '        </tr>'
            + '        </table>'
            + '      </div>'
            + '    </td>'
            + '    <td class="edgevr"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgelb"></td>'
            + '    <td class="edgehb"></td>'
            + '    <td class="edgerb"></td>'
            + '  </tr>'
            + '  </table>'
            + '  <table border="0" cellpadding="0" cellspacing="0" style="width:100%;">'
            + '  <tr id="searchDeptErrorRow" style="display:none;">'
            + '    <td style="text-align:center;">'
            + '      <div id="searchDeptError" style="color:red;margin:4px;"></div>'
            + '    </td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td style="padding:16px 0px 4px 0px;text-align:center;">'
            + '      <input type="button" class="pb_base pb_btn_search" id="searchDeptOk">'
            + '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '      <input type="button" class="pb_base pb_btn_cancel" id="searchDeptCancel">'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '</div>');

        dojo.byId('searchDeptDateCal').onclick = changeDate;
        dojo.byId('searchDeptOk').onclick = search;
        dojo.byId('searchDeptCancel').onclick = close;

        dialog.startup();
    };

    // カレンダーで日付選択
    var changeDate = function(){
        var d = dojo.date.locale.parse(dojo.byId('searchDeptDate').value, DATE_FORM_S);
        ATK.dialog.Calendar.open({
            date : (d || null),
            isDisabledDateFunc: function(d) { return false; }
        }, function(ro){
            dojo.byId('searchDeptDate').value = dojo.date.locale.format(ro, DATE_FORM_S);
        });
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        setDialogPosition(dialog, 240, 260);

        showError(null);

        var sp = data.searchParam;

        // 上位部署選択リスト
        var select = dojo.byId('searchDeptParent');
        if(select.options.length <= 0){
            dojo.create('option', { value: ''  , innerHTML: teasp.message.getLabel('tk10000344') }, select); // （すべて）
            dojo.create('option', { value: '-1', innerHTML: teasp.message.getLabel('tk10000345') }, select); // （上位部署のない部署）
            for(var i = 0 ; i < data.allDepts.length ; i++){
                var dept = data.allDepts[i];
                if(dept.parentFlag){
                    dojo.create('option', { value: dept.id, innerHTML: dept.displayName }, select);
                }
            }
        }
        select.value = (sp.parentId ? sp.parentId : '');

        // 部署コード
        dojo.byId('searchDeptCode').value = (sp.deptCode || '');

        // 部署名
        dojo.byId('searchDeptName').value = (sp.deptName || '');

        // 日付
        dojo.byId('searchDeptDate').value = (sp.dateVal ? teasp.util.date.formatDate(sp.dateVal, 'SLA') : '');

        // 以降・以前
        dojo.byId('searchDeptDateThan').value = (sp.dateThan || '0');

        dialog.show();
    };

    var close = function(){
        dialog.hide();
    };

    // event: 検索
    var search = function(){
        var sp = dojo.clone(data.searchParam);

        sp.parentId   = dojo.byId('searchDeptParent').value;        // 上位部署
        sp.deptCode   = dojo.byId('searchDeptCode').value.trim();   // 部署コード
        sp.deptName   = dojo.byId('searchDeptName').value.trim();   // 部署名
        sp.dateVal    = null;

        var dd = ATK.util.strToDate(dojo.byId('searchDeptDate').value);
        if(dd.failed > 1){
            showError(dojo.replace(dd.tmpl, [teasp.message.getLabel('date_head')])); // 日付
            return;
        }else if(dd.failed == 0){
            sp.dateVal = dd.datef;
        }
        sp.dateThan = dojo.byId('searchDeptDateThan').value;

        showError(null);

        // サーバへ送信
        ATK.dialog.BusyWait.open();
        ATK.ajax.requestSend({
            action      : "loadDeptList",
            searchParam : sp
        }, null, funcAction, recieveLoadList2, recieveError);
    };

    // event: サーバから正常値受信
    function recieveLoadList2(o){
        ATK.dialog.BusyWait.close();
        onfinishfunc(o);
        close();
    }

    // event: サーバから異常値受信
    var recieveError = function(o){
        ATK.dialog.BusyWait.close();
        teasp.tsAlert(teasp.message.getLabel('tm00000010', o.error.message));
    };

    // logic: エラー表示
    var showError = function(msg){
        dojo.style('searchDeptErrorRow', 'display', (msg ? '' : 'none'));
        dojo.byId('searchDeptError').innerHTML = (msg ? msg : '');
    };

    return {
        open  : open
    };
};  // ATK.dialog.searchDeptDialog

/*
 * 部署変更ダイアログ
 */
ATK.dialog.changeDeptDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10000391'), // 部署変更
            id       : "changeDeptDialog",
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:450px;">'
            + '    <table class="ts_a_frame">'
            + '    <tr>'
            + '      <td class="edgelt"></td>'
            + '      <td class="edgeht"></td>'
            + '      <td class="edgert"></td>'
            + '    </tr>'
            + '    <tr>'
            + '      <td class="edgevl"></td>'
            + '      <td>'
            + '        <div class="edge_div">'
            + '          <table class="stand_table">'
            + '          <tr>'
            + '            <td class="left_s">'
            + teasp.message.getLabel('tk10000335') // 部署名
            + '            </td>'
            + '            <td  class="right">'
            + '                <select id="changeDeptSelect" class="inputran" style="width:240px;">'
            + '                </select>'
            + '            </td>'
            + '          </tr>'
            + '          <tr>'
            + '            <td class="left_s">'
            + teasp.message.getLabel('tk10001039') // 変更開始日
            + '            </td>'
            + '            <td  class="right">'
            + '              <input type="text" value="" id="changeDeptDate" maxlength="12" class="inputran inputtex" style="width:90px;text-align:center;"/>'
            + '              &nbsp;<input type="button" class="pp_base pp_btn_cal" id="changeDeptCal" />'
            + '            </td>'
            + '          </tr>'
            + '          </table>'
            + '        </div>'
            + '      </td>'
            + '      <td class="edgevr"></td>'
            + '    </tr>'
            + '    <tr>'
            + '      <td class="edgelb"></td>'
            + '      <td class="edgehb"></td>'
            + '      <td class="edgerb"></td>'
            + '    </tr>'
            + '    </table>'
            + '    <table class="pane_table" style="width:100%;">'
            + '    <tr id="changeDeptErrorRow" style="display:none;">'
            + '      <td style="text-align:center;">'
            + '        <div id="changeDeptError" style="color:red;margin:4px;"></div>'
            + '      </td>'
            + '    </tr>'
            + '    <tr>'
            + '      <td style="padding:16px 0px 4px 0px;text-align:center;">'
            + '        <input type="button" class="pb_base pb_btn_regist" id="changeDeptOk">'
            + '        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '        <input type="button" class="pb_base pb_btn_cancel" id="changeDeptCancel">'
            + '      </td>'
            + '    </tr>'
            + '    </table>'
            + '</div>');

        dojo.byId('changeDeptOk').onclick = saveAndClose;
        dojo.byId('changeDeptCancel').onclick = close;
        dojo.byId('changeDeptCal').onclick = changeDate;

        dialog.startup();
    };

    // カレンダーで変更日付選択
    var changeDate = function(){
        var d = dojo.date.locale.parse(dojo.byId('changeDeptDate').value, DATE_FORM_S);
        ATK.dialog.Calendar.open({
            date : (d || null),
            isDisabledDateFunc: function(d) { return false; }
        }, function(ro){
            dojo.byId('changeDeptDate').value = dojo.date.locale.format(ro, DATE_FORM_S);
        });
    };

    // logic: エラーメッセージを表示
    var showError = function(msg){
        dojo.style('changeDeptErrorRow', 'display', (msg ? '' : 'none'));
        dojo.byId('changeDeptError').innerHTML = (msg ? msg : '');
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        setDialogPosition(dialog, 200, 280);

        showError(null);

        var depts = inobj.depts;
        var select = dojo.byId('changeDeptSelect');
        while(select.options.length > 0){
            dojo.destroy(select.options[0]);
        }
        for(var i = 0 ; i < depts.length ; i++){
            var dept = depts[i];
            var spc = ATK.util.createListBoxIndent(dept.level);
            dojo.create('option', { value: dept.id, innerHTML: spc + dept.code + '-' + dept.name }, select);
        }
        var deptId = null;
        for(i = 0 ; i < inobj.emps.length ; i++){
            if(deptId == null){
                deptId = inobj.emps[i].deptId;
            }else if(deptId != inobj.emps[i].deptId){
                deptId = '';
            }
        }
        select.value = (deptId || '');
        dojo.byId('changeDeptDate').value = '';
        dojo.byId('changeDeptDialog_title').innerHTML = teasp.message.getLabel(inobj.emps.length > 1 ? 'tk10001040' : 'tk10000391'); // まとめて部署変更 or 部署変更

        dialog.show();
    };

    // event: キャンセル
    var close = function(){
        dialog.hide();
    };

    // event: 登録
    var saveAndClose = function(){
        var select = dojo.byId('changeDeptSelect');
        var deptId = select.value;

        var deptHistory = (inobj.emps.length == 1 ? (inobj.emps[0].deptHistory || []) : []);

        var lastDept = (deptHistory.length > 0 ? deptHistory[0] : null);
        if(lastDept && lastDept.deptId == deptId){
            var errmsg = teasp.message.getLabel('tk10001041'); // 変更前と同じ部署です
            if(inobj.deptId != deptId){
                errmsg += teasp.message.getLabel('tk10001042'); // （変更履歴で確認してください）
            }
            showError(errmsg);
            return;
        }

        showError(null);

        var cdd = ATK.util.strToDate(dojo.byId('changeDeptDate').value);
        if(cdd.failed == 1){
            // 変更開始日の指定がない場合、変更履歴に残さないで変更を上書きします。よろしいですか？
            teasp.tsConfirm(teasp.message.getLabel('tk10001043'), null, function(confirmOk){
                if(confirmOk){
                    saveAndClose2(deptId, cdd);
                }
            });
        }else if(cdd.failed > 0){
            showError(dojo.replace(cdd.tmpl, [teasp.message.getLabel('tk10001039')])); // 変更開始日
            return;
        }else if(cdd.failed == 0 && lastDept && lastDept.startDate){
            var d = teasp.util.date.parseDate(lastDept.startDate);
            if(dojo.date.compare(cdd.date, d, 'date') < 0){
                showError(teasp.message.getLabel('tk10001044')); // 変更開始日が前回変更時の変更開始日より古い日付になっています。
                return;
            }
            saveAndClose2(deptId, cdd);
        }else{
            saveAndClose2(deptId, cdd);
        }
    };

    var saveAndClose2 = function(deptId, cdd){
        var empIdList = [];
        for(var i = 0 ; i < inobj.emps.length ; i++){
            empIdList.push(inobj.emps[i].id);
        }

        ATK.dialog.BusyWait.open();
        ATK.ajax.requestSend({
            action      : "changeDept",
            empIdList   : empIdList,
            deptId      : deptId,
            startDate   : cdd.datef,
            searchParam : (inobj.searchParam || null),
            lot         : (inobj.searchParam ? true : false)
        }, null, funcAction, recieveFunction, recieveError);
    };

    // event: サーバから正常値受信
    function recieveFunction(o){
        ATK.dialog.BusyWait.close();
        onfinishfunc(o);
        close();
    }

    // event: サーバから異常値受信
    var recieveError = function(o){
        ATK.dialog.BusyWait.close();
        teasp.tsAlert(teasp.message.getLabel('tm00000010', o.error.message));
    };

    return {
        open  : open
    };
};  // ATK.dialog.changeDeptDialog

/*
 * 部署変更履歴ダイアログ
 */
ATK.dialog.historyDeptDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10001045'), // 部署変更履歴
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:498px;">'
            + '  <table class="stone_area" style="width:498px;">'
            + '  <tr>'
            + '    <td>'
            + '      <table class="stone_table">'
            + '      <tr>'
            + '        <td class="head" style="width:38px;"></td>'
            + '        <td class="head" style="width:280px;"><div>' + teasp.message.getLabel('tk10000335')  + '</div></td>' // 部署名
            + '        <td class="head" style="width:180px;"><div>' + teasp.message.getLabel('range_label') + '</div></td>' // 期間
            + '      </tr>'
            + '      </table>'
            + '      <div class="stone_div" style="height:88px;">'
            + '        <table class="stone_table" id="historyTable">'
            + '        <tbody>'
            + '        </tbody>'
            + '        </table>'
            + '      </div>'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '  <table class="pane_table" style="width:100%;">'
            + '  <tr>'
            + '    <td style="padding:8px 0px 4px 0px;text-align:center;">'
            + '      <input type="button" class="pb_base pb_btn_close" id="historyDeptClose">'
            + '    </td>'
            + '  </tr>'
            + '</table>'
            + '</div>');

        dojo.byId('historyDeptClose').onclick = function(){ close(); };

        dialog.startup();
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        setDialogPosition(dialog, 200, 280);

        var deptHistory = inobj.deptHistory;
        var tbody, row, cell, a, r;
        tbody = dojo.byId('historyTable').getElementsByTagName('tbody')[0];
        while(tbody.firstChild){
            dojo.destroy(tbody.firstChild);
        }
        var rowCount = (deptHistory.length < 4 ? 4 : deptHistory.length);
        for(r = 0 ; r < rowCount ; r++){
            var dh = (r < deptHistory.length ? deptHistory[r] : null);
            row = dojo.create('tr', { id: "deptHistory" + (dh ? dh.id : ''), className: ((r%2)==0 ? 'even' : 'odd'), height: '22px' }, tbody);
            cell = dojo.create('td', { width: '38px' }, row);
            cell.style.borderLeft = 'none';
            if(r == 0 && dh && deptHistory.length > 0){
                var div = dojo.create('div', {
                    className: 'pp_base pp_btn_del',
                    title: teasp.message.getLabel('tk10000195'), // 取消
                    onclick: function(){ clickDelHistory(this); }
                }, cell);
                div.style.marginTop    = '1px';
                div.style.marginBottom = '1px';
                div.style.marginLeft   = '2px';
                div.style.marginRight  = '2px';
            }
            var span = '';
            if(dh && (dh.startDate || dh.endDate)){
                if(dh.startDate){ span += teasp.util.date.formatDate(dh.startDate, 'SLA'); }
                span += teasp.message.getLabel('wave_label'); // ～
                if(dh.endDate  ){ span += teasp.util.date.formatDate(dh.endDate, 'SLA'); }
            }else if(dh){
                span = teasp.message.getLabel('tm00000107'); // －
            }
            cell = dojo.create('td', { width: '280px' }, row);
            cell.style.textAlign = 'left';
            dojo.create('div', { innerHTML: (dh ? (dh.deptCode || '') + '-' + (dh.deptName || '') : ''), style: { wordBreak:"break-all" } }, cell);
            cell = dojo.create('td', { width: '163px' }, row);
            cell.style.textAlign = 'left';
            cell.style.borderRight = 'none';
            dojo.create('div', { innerHTML: span }, cell);
        }

        dialog.show();
    };

    var close = function(){
        dialog.hide();
    };

    // event: 削除
    var clickDelHistory = function(node){
        // 部署変更を取り消しますが、よろしいですか？\n（元に戻せません）
        teasp.tsConfirm(teasp.message.getLabel('tk10003730'), null, function(confirmOk){
            if(confirmOk){
                ATK.dialog.BusyWait.open();
                ATK.ajax.requestSend({
                    action     : "cancelDept",
                    empId      : inobj.empId
                }, null, funcAction, recieveFunction, recieveError);
            }
        });
    };

    // event: サーバから正常値受信
    function recieveFunction(o){
        ATK.dialog.BusyWait.close();
        onfinishfunc(o);
        close();
    }

    // event: サーバから異常値受信
    var recieveError = function(o){
        ATK.dialog.BusyWait.close();
        teasp.tsAlert(teasp.message.getLabel('tm00000010', o.error.message));
    };

    return {
        open  : open
    };
};  // ATK.dialog.historyDeptDialog

/*
 * 有休履歴ダイアログ
 */
ATK.dialog.historyYuqDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10003740'), // 過去2年の有休付与・取得状況と今後2年の有休付与計画
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:813px;">'
            + '  <table class="stone_area" style="width:813px;">'
            + '  <tr>'
            + '    <td>'
            + '      <table class="stone_table">'
            + '      <thead>'
            + '      <tr>'
            + '        <td class="head" style="width:84px;" ><div>' + teasp.message.getLabel('date_head')     + '</div></td>' // 日付
            + '        <td class="head" style="width:200px;"><div>' + teasp.message.getLabel('subject_head')  + '</div></td>' // 事柄
            + '        <td class="head" style="width:80px;" ><div>' + teasp.message.getLabel('tm10011040')    + '</div></td>' // 付与
            + '        <td class="head" style="width:99px;" ><div>' + teasp.message.getLabel('yuqSpend_head') + '</div></td>' // 消化
            + '        <td class="head" style="width:350px;"><div>' + teasp.message.getLabel('note_head')     + '</div></td>' // 備考
            + '      </tr>'
            + '      </thead>'
            + '      </table>'
            + '      <div class="stone_div" style="height:352px;">'
            + '        <table class="stone_table" id="historyYuqTable">'
            + '        <tbody>'
            + '        </tbody>'
            + '        </table>'
            + '      </div>'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '  <table class="pane_table" style="width:100%;">'
            + '  <tr>'
            + '    <td colspan="2" style="padding:8px 0px 4px 0px;text-align:center;">'
            + '      <input type="button" class="pb_base pb_btn_close" id="historyYuqClose">'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '</div>');

        dojo.byId('historyYuqClose').onclick = function(){ close(); };

        dialog.startup();
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        setDialogPosition(dialog, 100, 280);

        var tbody = dojo.byId('historyYuqTable').getElementsByTagName('tbody')[0];
        while(tbody.firstChild){
            dojo.destroy(tbody.firstChild);
        }
        var yhs = inobj.yuqHistory.getRecords();
        var rowCount = (yhs.length < 16 ? 16 : yhs.length);
        for(var r = 0 ; r < rowCount ; r++){
            var yh = (r < yhs.length ? yhs[r] : null);
            var row = dojo.create('tr', { id : "historyYuqIndex" + (r + 1), height: '22px', className: ((r%2)==0 ? 'even' : 'odd') }, tbody);
            var cell = dojo.create('td', { width: '84px' }, row);
            cell.style.borderLeft = 'none';
            dojo.create('div', { innerHTML: (yh ? teasp.util.date.formatDate(yh.date, 'SLA') : '') }, cell);
            var cell = dojo.create('td', { width: '200px' }, row);
            cell.style.textAlign = 'left';
            dojo.create('div', { innerHTML: (yh ? yh.subject : '')     }, cell);
            dojo.create('div', { innerHTML: (yh ? yh.provideDays : '') }, dojo.create('td', { width: '80px' }, row));
            dojo.create('div', { innerHTML: (yh ? yh.spendDays : '')   }, dojo.create('td', { width: '82px' }, row));
            cell = dojo.create('td', { width: '350px' }, row);
            cell.style.textAlign = 'left';
            cell.style.borderRight = 'none';
            dojo.create('div', { innerHTML: (yh ? yh.note : '') }, cell);
        }
        dialog.show();
    };

    var close = function(){
        dialog.hide();
    };

    return {
        open  : open
    };
};  // ATK.dialog.historyYuqDialog

/*
 * 有休付与ダイアログ
 */
ATK.dialog.yuqFuyoDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10000047'), // 有休付与
            id       : 'yuqFuyoDialog',
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:450px;">'
            + '    <table class="ts_a_frame">'
            + '    <tr>'
            + '      <td class="edgelt"></td>'
            + '      <td class="edgeht"></td>'
            + '      <td class="edgert"></td>'
            + '    </tr>'
            + '    <tr>'
            + '      <td class="edgevl"></td>'
            + '      <td>'
            + '        <div class="edge_div">'
            + '          <table class="stand_table">'
            + '          <tr>'
            + '            <td class="left_s" style="width:120px;">'
            + teasp.message.getLabel('yuqProvide_head') // 付与日数
            + '            </td>'
            + '            <td  class="right" colSpan="2">'
            + '              <table border="0" cellpadding="0" cellspacing="0">'
            + '              <tr>'
            + '                <td style="padding:4px 0px;text-align:left;">'
            + '                    <select class="inputran" id="yuqFuyoOption">'
            + '                      <option value="0">' + teasp.message.getLabel('tk10001051') + '</option>' // プラス
            + '                      <option value="1">' + teasp.message.getLabel('tk10001052') + '</option>' // マイナス
            + '                    </select>'
            + '                </td>'
            + '                <td style="padding:4px 2px 4px 12px;text-align:left;">'
            + '                  <input type="text" value="" id="yuqFuyoDays" maxlength="4" class="inputran inputtex" style="width:48px;text-align:center;"/>'
            + '                </td>'
            + '                <td style="padding:6px 2px 2px 2px;text-align:left;">'
            + teasp.message.getLabel('days_label') // 日
            + '                </td>'
            + '                <td style="padding:4px;text-align:left;">'
            + '                    <select class="inputran" id="yuqFuyoHours" style="width:40px;">'
            + '                      <option value="0">0</option>'
            + '                      <option value="1">1</option>'
            + '                      <option value="2">2</option>'
            + '                      <option value="3">3</option>'
            + '                      <option value="4">4</option>'
            + '                      <option value="5">5</option>'
            + '                      <option value="6">6</option>'
            + '                      <option value="7">7</option>'
            + '                      <option value="8">8</option>'
            + '                    </select>'
            + '                </td>'
            + '                <td style="padding:6px 2px 2px 2px;text-align:left;">'
            + teasp.message.getLabel('time_label') // 時間
            + '                </td>'
            + '              </tr>'
            + '              </table>'
            + '            </td>'
            + '          </tr>'
            + '          <tr>'
            + '            <td class="left_s">'
            + teasp.message.getLabel('tm20004650') // 説明
            + '            </td>'
            + '            <td class="right" colSpan="2">'
            + '              <input type="text" value="" id="yuqFuyoSubject" maxlength="255" class="inputran inputtex" style="width:270px;"/>'
            + '            </td>'
            + '          </tr>'
            + '          <tr class="yuq_fuyo_plus">'
            + '            <td class="left_s">'
            + teasp.message.getLabel('yuqStartDate_head') // 有効開始日
            + '            </td>'
            + '            <td class="right" colSpan="2">'
            + '              <input type="text" value="" id="yuqFuyoStartDate" maxlength="12" class="inputran" style="width:90px;padding:2px;text-align:center;"/>'
            + '              &nbsp;<input type="button" class="pp_base pp_btn_cal" id="yuqFuyoStartDateCal" />'
            + '            </td>'
            + '          </tr>'
            + '          <tr class="yuq_fuyo_plus">'
            + '            <td class="left_s">'
            + teasp.message.getLabel('yuqLimitDate_head') // 失効日
            + '            </td>'
            + '            <td class="right" style="width:130px;">'
            + '              <input type="text" value="" id="yuqFuyoLimitDate" maxlength="12" class="inputran" style="width:90px;padding:2px;text-align:center;"/>'
            + '              &nbsp;<input type="button" class="pp_base pp_btn_cal" id="yuqFuyoLimitDateCal" />'
            + '            </td>'
            + '            <td>'
            + '              <div style="font-size:0.9em;">' + teasp.message.getLabel('tk10001053') + '</div>' // ※失効日は期限最終日の翌日の日付をセットしてください
            + '            </td>'
            + '          </tr>'
            + '          <tr class="yuq_fuyo_plus">'
            + '            <td class="left_s" >'
            + teasp.message.getLabel('tk10001054') // 付与形態
            + '            </td>'
            + '            <td class="right" colSpan="2">'
            + '              <label><input type="radio" name="provideType" id="provideType1" /> ' + teasp.message.getLabel('tk10001055') + '</label><br/>' // 臨時付与
            + '            </td>'
            + '          </tr>'
            + '          <tr class="yuq_fuyo_plus">'
            + '            <td class="left_s" >'
            + '            </td>'
            + '            <td class="right" colSpan="2">'
            + '              <label><input type="radio" name="provideType" id="provideType2" /> ' + teasp.message.getLabel('tk10001056') + '</label><br/>' // 定期付与
            + '            </td>'
            + '          </tr>'
            + '          <tr class="yuq_fuyo_next" style="display:none;">'
            + '            <td class="left_s" style="white-space:normal;">'
            + teasp.message.getLabel('tk10001057') // 次回付与予定日
            + '            </td>'
            + '            <td class="right" colSpan="2">'
            + '              <input type="text" value="" id="nextYuqProvideDate" maxlength="12" class="inputran" style="width:90px;padding:2px;text-align:center;"/>'
            + '              &nbsp;<input type="button" class="pp_base pp_btn_cal" id="nextYuqProvideDateCal" />'
            + '            </td>'
            + '          </tr>'
            + '          <tr class="yuq_fuyo_minus" style="display:none;">'
            + '            <td class="left_s">'
            + teasp.message.getLabel('tk10001058') // マイナス対象
            + '            </td>'
            + '            <td class="right" style="white-space:nowrap;" colSpan="2">'
            + '              <select id="yuqFuyoTargets" style="width:220px;"></select>'
            + '            </td>'
            + '          </tr>'
            + '          <tr class="yuq_fuyo_plus">'
            + '            <td class="left_s" style="white-space:normal;">'
            + '                <div style="display:inline-block;vertical-align:middle;width:100px;">'
            + teasp.message.getLabel('tk10007140') // 取得義務判定対象
            + '                </div>'
            + '                <div id="yuqFuyoNotObligatoryHelp" style="display:inline-block;vertical-align:middle;" class="pp_base pp_icon_help"></div>'
            + '            </td>'
            + '            <td class="right" colSpan="2">'
            + '              <label><input type="checkbox" id="yuqFuyoNotObligatoryFlag" /> <span>'
            + teasp.message.getLabel('tk10007150') // 対象外とする
            + '              </span></label>'
            + '            </td>'
            + '          </tr>'
            + '          </table>'
            + '        </div>'
            + '      </td>'
            + '      <td class="edgevr"></td>'
            + '    </tr>'
            + '    <tr>'
            + '      <td class="edgelb"></td>'
            + '      <td class="edgehb"></td>'
            + '      <td class="edgerb"></td>'
            + '    </tr>'
            + '    </table>'
            + '    <table class="pane_table" style="width:100%;">'
            + '    <tr id="yuqFuyoErrorRow" style="display:none;">'
            + '      <td style="text-align:center;">'
            + '        <div id="yuqFuyoError" style="color:red;margin:4px;"></div>'
            + '      </td>'
            + '    </tr>'
            + '    <tr>'
            + '      <td style="padding:16px 0px 4px 0px;text-align:center;">'
            + '        <input type="button" class="pb_base pb_btn_regist" id="yuqFuyoOk">'
            + '        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '        <input type="button" class="pb_base pb_btn_cancel" id="yuqFuyoCancel">'
            + '      </td>'
            + '    </tr>'
            + '    </table>'
            + '</div>');


        dojo.byId('yuqFuyoOk').onclick = saveAndClose;
        dojo.byId('yuqFuyoCancel').onclick = close;
        dojo.byId('yuqFuyoOption').onchange = changeOption;
        dojo.connect(dojo.byId('provideType1'), 'onclick', changeOption2);
        dojo.connect(dojo.byId('provideType2'), 'onclick', changeOption2);
        dojo.byId('yuqFuyoStartDateCal').onclick = function(){ changeDate('yuqFuyoStartDate'); };
        dojo.byId('yuqFuyoLimitDateCal').onclick = function(){ changeDate('yuqFuyoLimitDate'); };
        dojo.byId('nextYuqProvideDateCal').onclick = function(){ changeDate('nextYuqProvideDate'); };

        // 取得義務判定対象のツールチップ
        new dijit.Tooltip({
            connectId : 'yuqFuyoNotObligatoryHelp',
            label     : teasp.message.getLabel('tk10007160'),
            position  : ['below'],
            id        : 'yuqFuyoNotObligatoryTooltip'
        });

        dialog.startup();
    };

    // event: カレンダーで変更日付選択
    var changeDate = function(textboxId){
        var fo = DATE_FORM_S;
        var d = dojo.date.locale.parse(dojo.byId(textboxId).value, fo);
        ATK.dialog.Calendar.open({
            date : (d || null),
            isDisabledDateFunc: function(d) { return false; }
        }, function(ro){
            dojo.byId(textboxId).value = dojo.date.locale.format(ro, fo);
            // 反対側が空の場合、デフォルトで２年後・前の日付を自動入力
            if(textboxId == 'yuqFuyoStartDate' && dojo.byId('yuqFuyoLimitDate').value == ''){
                var ld = dojo.date.add(ro, 'year', 2);
                dojo.byId('yuqFuyoLimitDate').value = dojo.date.locale.format(ld, fo);
            }else if(textboxId == 'yuqFuyoLimitDate' && dojo.byId('yuqFuyoStartDate').value == ''){
                var sd = dojo.date.add(ro, 'year', -2);
                dojo.byId('yuqFuyoStartDate').value = dojo.date.locale.format(sd, fo);
            }

            // 有効開始日を選択時、次回付与予定日はデフォルトで1年後の日付を自動入力
            if (textboxId == 'yuqFuyoStartDate' && dojo.byId('nextYuqProvideDate').value == '') {
                var nextd = dojo.date.add(ro, 'year', 1);
                dojo.byId('nextYuqProvideDate').value = dojo.date.locale.format(nextd, fo);
            }
        });
        showError(null);
    };

    var changeOption = function(){
        var option = dojo.byId('yuqFuyoOption').value;
        dojo.query('.yuq_fuyo_plus' ).forEach(function(e){ dojo.style(e, 'display', (option == '0' ? '' : 'none')); });
        dojo.query('.yuq_fuyo_minus').forEach(function(e){ dojo.style(e, 'display', (option == '0' ? 'none' : '')); });
        changeOption2();
    };

    var changeOption2 = function(){
        var option = dojo.byId('yuqFuyoOption').value;
        var provideType2 = dojo.byId('provideType2').checked;
        dojo.query('.yuq_fuyo_next' ).forEach(function(e){ dojo.style(e, 'display', ((option == '0' && provideType2) ? '' : 'none')); });
        showError(null);
    }

    // logic: エラー表示
    var showError = function(msg){
        dojo.style('yuqFuyoErrorRow', 'display', (msg ? '' : 'none'));
        dojo.byId('yuqFuyoError').innerHTML = (msg ? msg : '');
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        setDialogPosition(dialog, 200, 280);

        showError(null);

        dojo.byId('yuqFuyoDays').value = '';
        dojo.byId('yuqFuyoHours').value = '0';
        dojo.byId('yuqFuyoSubject').value = '';
        dojo.byId('yuqFuyoStartDate').value = '';
        dojo.byId('yuqFuyoLimitDate').value = '';
        dojo.byId('provideType1').checked = true;
        dojo.byId('provideType2').checked = false;
        dojo.byId('nextYuqProvideDate').value = '';
//      dojo.byId('yuqFuyoProvideAuto').checked = false;
        dojo.byId('yuqFuyoNotObligatoryFlag').checked = false; // 取得義務判定対象外とする

        var select = dojo.byId('yuqFuyoTargets');
        while(select.options.length > 0){
            select.remove(0);
        }
        var yuqList = inobj.yuqList;
        if(!yuqList && inobj.emps.length == 1){
            yuqList = ATK.view.YuqList(inobj.emps[0].yuqRemains || []);
        }
        if(yuqList){
            for(var i = 0 ; i < yuqList.size() ; i++){
                var yuqInfo = yuqList.getByIndex(i);
                if(!yuqInfo.isRemain()){
                    continue;
                }
                dojo.create('option', {
                    value     : yuqInfo.getId(),
                    innerHTML : teasp.message.getLabel('tk10003750', yuqInfo.getDate(DATE_FORM_SLASH), yuqInfo.getRemain()) // {0} 付与分({1})
                }, select);
            }
        }

        dojo.byId('yuqFuyoOption').value = '0';
        dojo.byId('yuqFuyoOption').disabled = (select.options.length > 0 ? false : true);
        dojo.byId('yuqFuyoDialog_title').innerHTML = teasp.message.getLabel(inobj.emps.length > 1 ? 'tk10001060' : 'tk10000047'); // まとめて有休付与 or 有休付与
        changeOption();
        changeOption2();

        dialog.show();
    };

    // event: キャンセル
    var close = function(){
        dialog.hide();
    };

    // event: 登録
    var saveAndClose = function(){
        var req = {
            action      : "provideYuq2",
            empIdList   : [],
            plus        : true,
            days        : 0,
            hours       : 0,
            subject     : '',
            startDate   : null,
            limitDate   : null,
            autoFlag    : false,
            targetId    : null,
            searchParam : (inobj.searchParam || null),
            lot         : (inobj.searchParam ? true : false)
        };
        showError(null);
        var isEntryDateNul = false; // 入社日なしの社員が存在
        for(var i = 0 ; i < inobj.emps.length ; i++){
            req.empIdList.push(inobj.emps[i].id);

            if (inobj.emps[i].entryDate == null) {
                isEntryDateNul = true;
            }
        }

        // プラス・マイナス
        req.plus = (dojo.byId('yuqFuyoOption').value == '0');

        // 付与日数を取得
        var d = dojo.byId('yuqFuyoDays').value.trim();
        if(d != ''){
            if(!/^(\d+)\.?\d*$/.test(d)){
                showError(teasp.message.getLabel(req.plus ? 'tm10011040' : 'tk10001061') // 付与 or マイナスする
                        + teasp.message.getLabel('tk10001062')); // 日数は半角数字で入力してください
                return;
            }
            if(/^\d+\.(\d+?)0*$/.test(d)){
                var n = RegExp.$1;
                if(n != '0' && n != '5'){
                    showError(teasp.message.getLabel('tk10001078')); // 日数は 0.5 刻みで入力してください
                    return;
                }
            }
            req.days = parseFloat(d);
            if(req.days >= 100){
                showError(teasp.message.getLabel('tk10001079')); // 日数の整数部分は2桁以内で入力してください
                return;
            }
        }
        req.hours = parseInt(dojo.byId('yuqFuyoHours').value, 10);
        if(!req.days && !req.hours){
            showError(teasp.message.getLabel(req.plus ? 'tm10011040' : 'tk10001061') // 付与 or マイナスする
                    + teasp.message.getLabel('tk10001067')); // 日数または時間を入力してください
            return;
        }

        // 説明を取得
        req.subject = dojo.byId('yuqFuyoSubject').value.trim();
        if(req.subject == ''){
            showError(teasp.message.getLabel('tk10001068')); // 説明を入力してください
            return;
        }
        if(req.subject.length > dojo.byId('yuqFuyoSubject').maxLength){
            showError(teasp.message.getLabel('tk10001080', dojo.byId('yuqFuyoSubject').maxLength)); // '説明の長さが制限（{0}桁以内）を超えています'
            return;
        }

        if(req.plus){ // プラスの場合
            // 有効開始日・失効日を取得
            var sd = ATK.util.strToDate(dojo.byId('yuqFuyoStartDate').value);
            if(sd.failed != 0){
                showError(dojo.replace(sd.tmpl, [teasp.message.getLabel('yuqStartDate_head')])); // 有効開始日
                return;
            }
            var ld = ATK.util.strToDate(dojo.byId('yuqFuyoLimitDate').value);
            if(ld.failed != 0){
                showError(dojo.replace(ld.tmpl, [teasp.message.getLabel('yuqLimitDate_head')])); // 失効日
                return;
            }
            if(dojo.date.compare(ld.date, sd.date, 'date') <= 0){
                showError(teasp.message.getLabel('tk10003760')); // 有効開始日 >= 失効日になっています
                return;
            }
            req.startDate = sd.datef;
            req.limitDate = ld.datef;

            // 自動付与せず、上記で設定した付与日数を付与する
//          req.autoFlag = dojo.byId('yuqFuyoProvideAuto').checked;
            req.autoFlag = dojo.byId('provideType2').checked;
            req.notObligatoryFlag = dojo.byId('yuqFuyoNotObligatoryFlag').checked; // 取得義務判定対象外とする

            // 定期付与
            if (req.autoFlag) {
                var nextd = ATK.util.strToDate(dojo.byId('nextYuqProvideDate').value);
                if(nextd.failed != 0){
                    showError(dojo.replace(nextd.tmpl, [teasp.message.getLabel('tk10001072')])); // 次回有休付与日
                    return;
                }
                req.nextYuqProvideDate = nextd.datef;

                // 入社日なしの社員が存在する場合はエラー
                if (isEntryDateNul) {
                    showError(teasp.message.getLabel('tk10001073')); // 社員の入社日が未入力のため実行できません
                    return;
                }

                // 複数選択されている場合、実行確認
                if(inobj.emps.length > 1){
                    // 選択された複数の社員に同じ設定で有給休暇が付与されますが\nよろしいですか
                    teasp.tsConfirm(teasp.message.getLabel('tk10003770'), null, function(confirmOk){
                        if(confirmOk){
                            saveAndClose2(req);
                        }
                    });
                }else{
                    saveAndClose2(req);
                }
            }else{
                saveAndClose2(req);
            }
        }else{ // マイナスの場合
            // マイナスの対象とする付与単位を選択
            if(!req.plus){
                req.targetId = dojo.byId('yuqFuyoTargets').value;
            }
            if(!req.targetId){
                showError(teasp.message.getLabel('tk10001075')); // マイナス対象を選択してください
                return;
            }
            saveAndClose2(req);
        }
    };

    var saveAndClose2 = function(req){
        var func = function(flag){
            return function(){
                if(!flag){
                    ATK.ajax.requestSend(req, null, funcAction, recieveFunction, recieveError);
                }else{
                    // 勤務確定済みの勤怠データに対して{0}のデータは反映されません。反映させるには勤務確定をいったん取り消して再度確定を行う必要があります。\n\nこのまま付与を実行してよろしければＯＫをクリックしてください。
                    teasp.tsConfirm(teasp.message.getLabel('tk10005270', teasp.message.getLabel('tk10000047')), null, function(confirmOk){
                        if(confirmOk){
                            ATK.dialog.BusyWait.open();
                            ATK.ajax.requestSend(req, null, funcAction, recieveFunction, recieveError);
                        }
                    });
                }
            };
        };
        var req2 = dojo.clone(req);
        req2.action = 'checkEmpMonthFixed';

        ATK.dialog.BusyWait.open();
        ATK.ajax.requestSend(req2, null, funcAction, function(o){
            var flag = (o.length > 0); // 有効期間内に確定済みの勤務表があった
            if(flag){
                ATK.dialog.BusyWait.close();
            }
            setTimeout(func(flag), 100);
        }, recieveError);
    };

    // event: サーバから正常値受信
    function recieveFunction(o){
        ATK.dialog.BusyWait.close();
        onfinishfunc(o);
        close();
    }

    // event: サーバから異常値受信
    var recieveError = function(o){
        ATK.dialog.BusyWait.close();
        teasp.tsAlert(teasp.message.getLabel('tm00000010', o.error.message));
    };

    return {
        open  : open
    };
};  // ATK.dialog.yuqFuyoDialog

/*
 * 取得義務判定対象の変更ダイアログ
 */
ATK.dialog.updateYuqFuyoDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10007190'), // 取得義務判定対象の変更
            id       : 'updateYuqFuyoDialog',
            duration : 300
        });
        dialog.attr('content',
              '<div class="dlg_content">'
            + '    <div class="blue-div">'
            + '          <table class="stand_table" style="width:380px;">'
            + '          <tr class="yuq_fuyo_plus">'
            + '            <td class="left_s" style="white-space:normal;">'
            + '                <div style="display:inline-block;vertical-align:middle;width:100px;">'
            + teasp.message.getLabel('tk10007140') // 取得義務判定対象
            + '                </div>'
            + '                <div id="notObligatoryHelp" style="display:inline-block;vertical-align:middle;" class="pp_base pp_icon_help"></div>'
            + '            </td>'
            + '            <td class="right" colSpan="2">'
            + '              <label><input type="checkbox" id="notObligatoryFlag" /> <span>'
            + teasp.message.getLabel('tk10007150') // 対象外とする
            + '              </span></label>'
            + '            </td>'
            + '          </tr>'
            + '          </table>'
            + '    </div>'
            + '    <table class="pane_table" style="width:100%;">'
            + '    <tr>'
            + '      <td style="padding:16px 0px 4px 0px;text-align:center;">'
            + '        <input type="button" class="pb_base pb_btn_regist" id="updateYuqFuyoOk">'
            + '        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '        <input type="button" class="pb_base pb_btn_cancel" id="updateYuqFuyoCancel">'
            + '      </td>'
            + '    </tr>'
            + '    </table>'
            + '</div>');

        dojo.byId('updateYuqFuyoOk').onclick = saveAndClose;
        dojo.byId('updateYuqFuyoCancel').onclick = close;

        // 取得義務判定対象のツールチップ
        new dijit.Tooltip({
            connectId : 'notObligatoryHelp',
            label     : teasp.message.getLabel('tk10007160'),
            position  : ['below'],
            id        : 'notObligatoryTooltip'
        });

        dialog.startup();
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();
        dojo.byId('notObligatoryFlag').checked = inobj.notObligatoryFlag;

        showError(null);

        dialog.show();
    };

    // 登録
    var saveAndClose = function(){
        var req = {
            action: "updateEmpYuq",
            yuqId: inobj.yuqId,
            notObligatoryFlag: dojo.byId('notObligatoryFlag').checked
        };
        showError(null);

        ATK.dialog.BusyWait.open();
        ATK.ajax.requestSend(req, null, funcAction, function(o){
            ATK.dialog.BusyWait.close();
            onfinishfunc(o);
            close();
        }, recieveError);
    };

    // キャンセル
    var close = function(){
        dialog.hide();
    };

    return {
        open  : open
    };
};  // ATK.dialog.updateYuqFuyoDialog

/*
 * 日数管理休暇付与ダイアログ
 */
ATK.dialog.stockFuyoDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;
    var eventHandles = [];
//    var enableTimeMap = {};

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10001076'), // 代休・日数管理休暇付与
            id       : 'stockFuyoDialog',
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:450px;">'
            + '    <table class="ts_a_frame">'
            + '    <tr>'
            + '      <td class="edgelt"></td>'
            + '      <td class="edgeht"></td>'
            + '      <td class="edgert"></td>'
            + '    </tr>'
            + '    <tr>'
            + '      <td class="edgevl"></td>'
            + '      <td>'
            + '        <div class="edge_div">'
            + '          <table class="stand_table">'
            + '          <tr>'
            + '            <td class="left_s">'
            + teasp.message.getLabel('tk10000582') // 休暇名
            + '            </td>'
            + '            <td class="right" id="stockFuyoTarget" colSpan="2">'
            + '            </td>'
            + '          </tr>'
            + '          <tr>'
            + '            <td class="left_s">'
            + teasp.message.getLabel('yuqProvide_head') // 付与日数
            + '            </td>'
            + '            <td  class="right" colSpan="2">'
            + '              <table border="0" cellpadding="0" cellspacing="0">'
            + '              <tr>'
            + '                <td style="padding:4px 0px;text-align:left;">'
            + '                    <select class="inputran" id="stockFuyoOption">'
            + '                      <option value="0">' + teasp.message.getLabel('tk10001051') + '</option>' // プラス
            + '                      <option value="1">' + teasp.message.getLabel('tk10001052') + '</option>' // マイナス
            + '                    </select>'
            + '                </td>'
            + '                <td style="padding:4px 2px 4px 12px;text-align:left;">'
            + '                  <input type="text" value="" id="stockFuyoDays" maxlength="5" class="inputran inputtex" style="width:48px;text-align:center;"/>'
            + '                </td>'
            + '                <td style="padding:6px 2px 2px 2px;text-align:left;">'
            + teasp.message.getLabel('days_label') // 日
            + '                <span class="fuyo_hours">'
            + teasp.message.getLabel('tf10010850') // ＋
            + '                </span>'
            + '                </td>'
            + '                <td style="padding:4px;text-align:left;vertical-align:bottom;" class="fuyo_hours">'
            + '                    <input type="text" class="inputran inputime roundBegin" id="stockFuyoHours" maxlength="5" style="padding:2px;">'
            + '                </td>'
            + '              </tr>'
            + '              </table>'
            + '            </td>'
            + '          </tr>'
            + '          <tr>'
            + '            <td colSpan="3">'
            + '            </td>'
            + '          </tr>'
            + '          <tr>'
            + '            <td class="left_s">'
            + teasp.message.getLabel('tm20004650') // 説明
            + '            </td>'
            + '            <td class="right" colSpan="2">'
            + '              <input type="text" value="" id="stockFuyoSubject" maxlength="255" class="inputran inputtex" style="width:270px;"/>'
            + '            </td>'
            + '          </tr>'
            + '          <tr class="stock_fuyo_plus">'
            + '            <td class="left_s">'
            + teasp.message.getLabel('yuqStartDate_head') // 有効開始日
            + '            </td>'
            + '            <td class="right" colSpan="2">'
            + '              <input type="text" value="" id="stockFuyoStartDate" maxlength="12" class="inputran" style="width:90px;padding:2px;text-align:center;"/>'
            + '              &nbsp;<input type="button" class="pp_base pp_btn_cal" id="stockFuyoStartDateCal" />'
            + '            </td>'
            + '          </tr>'
            + '          <tr class="stock_fuyo_plus">'
            + '            <td class="left_s">'
            + teasp.message.getLabel('yuqLimitDate_head') // 失効日
            + '            </td>'
            + '            <td class="right" style="width:130px;">'
            + '              <input type="text" value="" id="stockFuyoLimitDate" maxlength="12" class="inputran" style="width:90px;padding:2px;text-align:center;"/>'
            + '              &nbsp;<input type="button" class="pp_base pp_btn_cal" id="stockFuyoLimitDateCal" />'
            + '            </td>'
            + '            <td>'
            + '              <div style="font-size:0.9em;">' + teasp.message.getLabel('tk10001053') + '</div>' // ※失効日は期限最終日の翌日の日付をセットしてください
            + '            </td>'
            + '          </tr>'
            + '          <tr class="stock_fuyo_minus">'
            + '            <td class="left_s">'
            + teasp.message.getLabel('tk10001058') // マイナス対象
            + '            </td>'
            + '            <td class="right" colSpan="2">'
            + '              <select id="stockFuyoFuyos" class="inputran inputtex" style="width:270px;">'
            + '              </select>'
            + '            </td>'
            + '          </tr>'
            + '          </table>'
            + '        </div>'
            + '      </td>'
            + '      <td class="edgevr"></td>'
            + '    </tr>'
            + '    <tr>'
            + '      <td class="edgelb"></td>'
            + '      <td class="edgehb"></td>'
            + '      <td class="edgerb"></td>'
            + '    </tr>'
            + '    </table>'
            + '    <table class="pane_table" style="width:100%;">'
            + '    <tr id="stockFuyoErrorRow" style="display:none;">'
            + '      <td style="text-align:center;">'
            + '        <div id="stockFuyoError" style="color:red;margin:4px;"></div>'
            + '      </td>'
            + '    </tr>'
            + '    <tr>'
            + '      <td style="padding:16px 0px 4px 0px;text-align:center;">'
            + '        <input type="button" class="pb_base pb_btn_regist" id="stockFuyoOk">'
            + '        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '        <input type="button" class="pb_base pb_btn_cancel" id="stockFuyoCancel">'
            + '      </td>'
            + '    </tr>'
            + '    </table>'
            + '</div>');


        dojo.byId('stockFuyoOk').onclick = saveAndClose;
        dojo.byId('stockFuyoCancel').onclick = close;
        dojo.byId('stockFuyoOption').onchange = changeOption;
        dojo.byId('stockFuyoStartDateCal').onclick = function(){ changeDate('stockFuyoStartDate'); };
        dojo.byId('stockFuyoLimitDateCal').onclick = function(){ changeDate('stockFuyoLimitDate'); };
        teasp.util.time.setTimeFormat({form:'h:mm', round:30});
        dojo.query('.inputime').forEach(function(elem) {
            dojo.connect(elem, 'blur'      , teasp.util.time.onblurTime);
            dojo.connect(elem, 'onkeypress', teasp.util.time.onkeypressTime);
        });

        dialog.startup();
    };

    // event: カレンダーで変更日付選択
    var changeDate = function(textboxId){
        var fo = DATE_FORM_S;
        var d = dojo.date.locale.parse(dojo.byId(textboxId).value, fo);
        ATK.dialog.Calendar.open({
            date : (d || null),
            isDisabledDateFunc: function(d) { return false; }
        }, function(ro){
            dojo.byId(textboxId).value = dojo.date.locale.format(ro, fo);
        });
        showError(null);
    };

    var changeOption = function(){
        var option = dojo.byId('stockFuyoOption').value;
        dojo.query('.stock_fuyo_plus' ).forEach(function(e){ dojo.style(e, 'display', (option == '0' ? '' : 'none')); });
        dojo.query('.stock_fuyo_minus').forEach(function(e){ dojo.style(e, 'display', (option == '0' ? 'none' : '')); });
    };

    // logic: エラー表示
    var showError = function(msg){
        dojo.style('stockFuyoErrorRow', 'display', (msg ? '' : 'none'));
        dojo.byId('stockFuyoError').innerHTML = (msg ? msg : '');
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
//        enableTimeMap = {};
        attach();

        setDialogPosition(dialog, 200, 280);
        for(var i = 0 ; i < eventHandles.length ; i++){
            dojo.disconnect(eventHandles[i]);
        }

        showError(null);

        dojo.byId('stockFuyoDays').value = '';
        dojo.byId('stockFuyoHours').value = '0:00';
        dojo.byId('stockFuyoSubject').value = '';
        dojo.byId('stockFuyoStartDate').value = '';
        dojo.byId('stockFuyoLimitDate').value = '';

        dojo.byId('stockFuyoOption').value = '0';
        dojo.byId('stockFuyoOption').disabled = (inobj.emps.length > 1 ? true : false);

        var stockList = (inobj.stockList || []);
        showFuyoTime(inobj.stockInfo && inobj.stockInfo.enableTime);
        var d = dojo.byId('stockFuyoTarget');
        dojo.empty(d);
        if(stockList.length > 0){
            var select = dojo.create('select', { id: 'stockFuyoHolidayName' }, d);
            for(var i = 0 ; i < stockList.length ; i++){
                dojo.create('option', { innerHTML: stockList[i].manageName, value: stockList[i].manageName }, select);
//                enableTimeMap[stockList[i].manageName] = stockList[i].enableTime;
            }
            dojo.byId('stockFuyoOption').value = '0';
            dojo.byId('stockFuyoOption').disabled = true;
            // 社員一覧からの日数管理休暇の時間単位の付与はできないのを仕様とする。
            // そのため下記5行と"enableTimeMap"で検索してヒットする行はコメントアウト
//            eventHandles.push(dojo.connect(select, 'change', function(){
//                var select = dojo.byId('stockFuyoHolidayName');
//                console.log(select.value);
//                showFuyoTime(select.value != '代休' && enableTimeMap[select.value]);
//            }));
        }else{
            dojo.byId('stockFuyoDialog_title').innerHTML = teasp.message.getLabel(inobj.stockInfo ? 'tk10001077' : 'tm10010550') // 日数管理休暇 or 代休
                                                        + teasp.message.getLabel('tm10011040'); // 付与
            var type = (inobj.stockInfo ? inobj.stockInfo.manageName : '代休'); // 代休
            dojo.create('div', { innerHTML: type }, d);
            var select = dojo.byId('stockFuyoFuyos');
            dojo.empty(select);
            var days = 0;
            var _stocks = [];
            for(var i = 0 ; i < inobj.stocks.length ; i++){
                var stock = inobj.stocks[i];
                if(stock.type == type && stock.remainDays > 0){
                    _stocks.push(stock);
                    days += stock.remainDays;
                }
            }
            // 対象の付与データの配列を付与・取得情報表に合わせた並び順にしてプルダウンにセット
            _stocks = teasp.data.Pouch.sortProvideStocks(_stocks);
            for(var i = 0 ; i < _stocks.length ; i++){
                var stock = _stocks[i];
                dojo.create('option', {
                    innerHTML : teasp.data.Pouch.getProvideStockForMinus(stock), // {0} 付与分({1}日)
                    value     : stock.id
                }, select);
            }
            if(days <= 0){
                dojo.byId('stockFuyoOption').disabled = true;
            }
        }

        changeOption();

        dialog.show();
    };

    var showFuyoTime = function(flag){
        dojo.query('.fuyo_hours', dialog.domNode).forEach(function(el){
            dojo.style(el, 'display', (flag ? '' : 'none'));
        });
    };

    // event: キャンセル
    var close = function(){
        dialog.hide();
    };

    // event: 登録
    var saveAndClose = function(){
        var req = {
            action      : "provideStock",
            stockType   : null,
            empIdList   : [],
            plus        : true,
            days        : 0,
            hours       : 0,
            subject     : '',
            startDate   : null,
            limitDate   : null,
            minusDate   : null,
            baseTimes   : null,
            searchParam : (inobj.searchParam || null),
            lot         : (inobj.searchParam ? true : false),
            targetId    : null
        };
        for(var i = 0 ; i < inobj.emps.length ; i++){
            req.empIdList.push(inobj.emps[i].id);
        }

        var d = dojo.byId('stockFuyoHolidayName');
        if(d){
            req.stockType = d.value;
        }else{
            req.stockType = (inobj.stockInfo ? inobj.stockInfo.manageName : '代休');
        }

        // プラス・マイナス
        req.plus = (dojo.byId('stockFuyoOption').value == '0');

        // 付与日数を取得
        var d = dojo.byId('stockFuyoDays').value.trim();
        if(d != ''){
            if(!/^(\d+)\.?\d*$/.test(d)){
                showError(teasp.message.getLabel(req.plus ? 'tm10011040' : 'tk10001061') // 付与 or マイナスする
                        + teasp.message.getLabel('tk10001062')); // 日数は半角数字で入力してください
                return;
            }
            if(/^\d+\.(\d+?)0*$/.test(d)){
                var n = RegExp.$1;
                if(n != '0' && n != '5'){
                    showError(teasp.message.getLabel('tk10001078')); // 日数は 0.5 刻みで入力してください
                    return;
                }
            }
            req.days = parseFloat(d);
            if(req.days >= 1000){
                showError(teasp.message.getLabel('tk10001200')); // 日数の整数部分は3桁以内で入力してください
                return;
            }
        }
        req.hours = teasp.util.time.clock2minutes(dojo.byId('stockFuyoHours').value) || 0; // 付与時間（分）
        if(!req.days && !req.hours){
            showError(teasp.message.getLabel(req.plus ? 'tm10011040' : 'tk10001061') // 付与 or マイナスする
                    + teasp.message.getLabel(inobj.stockInfo ? 'tk10001067' : 'tf10010840')); // 日数または時間を入力してください
            return;
        }

        // 説明を取得
        req.subject = dojo.byId('stockFuyoSubject').value.trim();
        if(req.subject == ''){
            showError(teasp.message.getLabel('tk10001068')); // 説明を入力してください
            return;
        }
        if(req.subject.length > dojo.byId('stockFuyoSubject').maxLength){
            showError(teasp.message.getLabel('tk10001080', dojo.byId('stockFuyoSubject').maxLength)); // 説明の長さが制限（{0}桁以内）を超えています
            return;
        }

        if(req.plus){ // プラスの場合
            // 有効開始日・失効日を取得
            var sd = ATK.util.strToDate(dojo.byId('stockFuyoStartDate').value);
            if(sd.failed != 0){
                showError(dojo.replace(sd.tmpl, [teasp.message.getLabel('yuqStartDate_head')])); // 有効開始日
                return;
            }
            var ld = ATK.util.strToDate(dojo.byId('stockFuyoLimitDate').value);
            if(ld.failed > 1){
                showError(dojo.replace(ld.tmpl, [teasp.message.getLabel('yuqLimitDate_head')])); // 失効日
                return;
            }
            if(ld.failed == 0 && dojo.date.compare(ld.date, sd.date, 'date') <= 0){
                showError(teasp.message.getLabel('tk10003760')); // 有効開始日 >= 失効日になっています
                return;
            }
            req.startDate = sd.datef;
            req.limitDate = (ld.failed == 0 ? ld.datef : '2999-12-31');
            if(req.hours){
                for(var i = 0 ; i < inobj.emps.length ; i++){
                    var emp = inobj.emps[i];
                    var config = teasp.util.getConfigByDate(emp.configHistory, req.startDate);
                    if(config){
                        if(config.baseTimeForStock == null){
                            showError(teasp.message.getLabel('tm10011100')); // 勤務体系の「時間単位休の基準時間（日数管理休暇用）」が設定されてないため時間単位の付与は行えません
                            return;
                        }
                        if(!req.baseTimes){
                            req.baseTimes = {};
                        }
                        req.baseTimes[emp.id] = config.baseTimeForStock;
                    }
                }
            }
        }else{
            req.targetId = dojo.byId('stockFuyoFuyos').value;
            /**
             * マイナスの日数が残日数を超えるかどうかのチェックは行わないようにするため
             * 下記をコメントアウトする（#9085）
             * 端数の値を入力できないようにしているため、端数ありの残日数を全部マイナスしたい場合に
             * 困らないように大きな値の入力を許容する（大きな値を入れても残日数分のマイナスしか行われない）
             * @see AtkEmpCtl.provideStock()
             */
//            for(var i = 0 ; i < inobj.stocks.length ; i++){
//                var stock = inobj.stocks[i];
//                if(stock.id != req.targetId){
//                    continue;
//                }
//                if(stock.remainDays < Math.abs(req.days)){
//                    showError(teasp.message.getLabel('tk10000052')); // マイナスの日数が残日数を超えています
//                    return;
//                }
//            }
        }
        showError(null);

        var func = function(flag){
            return function(){
                if(!flag){
                    ATK.ajax.requestSend(req, null, funcAction, recieveFunction, recieveError);
                }else{
                    // 勤務確定済みの勤怠データに対して{0}のデータは反映されません。反映させるには勤務確定をいったん取り消して再度確定を行う必要があります。\n\nこのまま付与を実行してよろしければＯＫをクリックしてください。
                    teasp.tsConfirm(teasp.message.getLabel('tk10005270', teasp.message.getLabel(inobj.stockInfo ? 'tk10001077' : 'tm10010550')), null, function(confirmOk){
                        if(confirmOk){
                            ATK.dialog.BusyWait.open();
                            ATK.ajax.requestSend(req, null, funcAction, recieveFunction, recieveError);
                        }
                    });
                }
            };
        };
        var req2 = dojo.clone(req);
        req2.action = 'checkEmpMonthFixed';

        ATK.dialog.BusyWait.open();
        ATK.ajax.requestSend(req2, null, funcAction, function(o){
            var flag = (o.length > 0); // 有効期間内に確定済みの勤務表があった
            if(flag){
                ATK.dialog.BusyWait.close();
            }
            setTimeout(func(flag), 100);
        }, recieveError);
    };

    // event: サーバから正常値受信
    function recieveFunction(o){
        ATK.dialog.BusyWait.close();
        onfinishfunc(o);
        close();
    }

    // event: サーバから異常値受信
    var recieveError = function(o){
        ATK.dialog.BusyWait.close();
        teasp.tsAlert(teasp.message.getLabel('tm00000010', o.error.message));
    };

    return {
        open  : open
    };
};  // ATK.dialog.stockFuyoDialog

//------------------------------------------------------------------------------
/*
 * 勤務パターン一覧ダイアログ
 */
ATK.dialog.patternListDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10001081'), // 勤務パターン一覧
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:498px;">'
            + '  <table class="pane_table">'
            + '  <tr>'
            + '    <td style="padding:0px 4px 8px 8px;text-align:left;">'
            + '      <input type="button" class="pb_base pb_btn_new" id="patternListInsert" />'
            + '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '      <input type="button" class="pb_base pb_btn_order" title="' + teasp.message.getLabel('tk10000689') + '" id="patternListOrder" />' // 並び順変更
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '  <table class="stone_area" style="width:498px;">'
            + '  <tr>'
            + '    <td>'
            + '      <table class="stone_table">'
            + '      <tr>'
            + '        <td class="head" style="width:38px;" ></td>'
            + '        <td class="head" style="width:38px;" ></td>'
            + '        <td class="head" style="width:200px;"><div>' + teasp.message.getLabel('patterns_label') + '</div></td>' // 勤務パターン
            + '        <td class="head" style="width:135px;"><div>' + teasp.message.getLabel('tk10001082')     + '</div></td>' // 就業時間
            + '        <td class="head" style="width: 87px;"><div>' + teasp.message.getLabel('tk10001035')     + '</div></td>' // 対象期間
            + '      </tr>'
            + '      </table>'
            + '      <div class="stone_div" style="height:400px;">'
            + '        <table class="stone_table" id="patternListTable">'
            + '        <tbody></tbody>'
            + '        </table>'
            + '      </div>'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '  <table class="pane_table" style="width:100%;">'
            + '  <tr>'
            + '    <td style="padding:4px;text-align:center;">'
            + '      <input type="button" class="pb_base pb_btn_close" id="patternListClose" />'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '</div>');

        dojo.byId('patternListInsert').onclick = function(){ insertPattern(); };
        dojo.byId('patternListOrder').onclick = function(){ clickedPatternListOrder(); };//2012/07/27
        dojo.byId('patternListClose').onclick = function(){ close(); };

        dialog.startup();
    };

    var insertPattern = function(){
        var empTypes = inobj.empTypes;
        patternEditDialog.open({
            empTypes           : empTypes,
            selectedEmpTypeIds : [],
            pattern            : null
        }, function(ro){
            inobj.patterns = ro.allPatterns;
            createPatternList();
        });
    };

    var editPattern = function(node){
        var row = node.parentNode.parentNode;
        if(!/patternListRow(.+)/.test(row.id)){
            return;
        }
        var id = RegExp.$1;
        ATK.dialog.BusyWait.open();
        ATK.ajax.requestSend({
            action     : "getEmpTypeIdsByPatternId",
            patternId  : id
        }, null, funcAction, receiveAndPatternEdit, recieveError);
    };

    var clickedPatternListOrder = function() {
        patternListOrderDialog.open({
            patterns : inobj.patterns
        }, function(ro) {
            inobj.patterns = ro;
            createPatternList();
        });
    };

    // 勤務パターンを編集
    var editPatternOpen = function(patternId, selectedEmpTypeIds){
        var empTypes = inobj.empTypes;
        var patterns = inobj.patterns;
        var pattern;
        for(var i = 0 ; i < patterns.length ; i++){
            if(patterns[i].id == patternId){
                pattern = patterns[i];
                break;
            }
        }
        patternEditDialog.open({
            empTypes           : empTypes,
            selectedEmpTypeIds : selectedEmpTypeIds,
            pattern            : pattern
        }, function(ro){
            inobj.patterns = ro.allPatterns;
            createPatternList();
        });
    };

    // 勤務パターンを削除
    var deletePattern = function(node){
        var row = node.parentNode.parentNode;
        if(!/patternListRow(.+)/.test(row.id)){
            return;
        }
        var id = RegExp.$1;
        // 勤務パターン\n「{0}」を削除してよろしいですか？
        teasp.tsConfirm(teasp.message.getLabel('tk10003780', (row.cells[2].textContent || row.cells[2].innerText)), null, function(confirmOk){
            if(confirmOk){
                // 【最終確認】\n削除すると元に戻すことはできません。本当に削除してよろしいですか？
                teasp.tsConfirm(teasp.message.getLabel('tk10003790'), null, function(confirmOk){
                    if(confirmOk){
                        ATK.dialog.BusyWait.open();
                        ATK.ajax.requestSend({
                            action     : "deletePatternConfig",
                            patternId  : id
                        }, null, funcAction, receivePatternDeleted, recieveError);
                    }
                });
            }
        });
    };

    // AJAX正常戻り値処理
    function receiveAndPatternEdit(o){
        ATK.dialog.BusyWait.close();
        editPatternOpen(o.patternId, o.empTypeIds);
    }

    // AJAX正常戻り値処理
    function receivePatternDeleted(o){
        ATK.dialog.BusyWait.close();
        inobj.patterns = o.allPatterns;
        createPatternList();
    }

    // AJAX異常戻り値処理
    var recieveError = function(o){
        ATK.dialog.BusyWait.close();
        teasp.tsAlert(teasp.message.getLabel('tm00000010', o.error.message));
    };

    var getFixTime = function(p){
        return (p ? teasp.message.getLabel('tm10003590', ATK.util.timeValue(p.stdStartTime), ATK.util.timeValue(p.stdEndTime)) : '') // {0} ～ {1}
    };

    var createPatternList = function(){
        var tbody, row, cell, div, r;
        var patterns = inobj.patterns;

        tbody = dojo.byId('patternListTable').getElementsByTagName('tbody')[0];
        while(tbody.firstChild){
            dojo.destroy(tbody.firstChild);
        }
        var rowMax = 18;
        var rowCount = (rowMax < patterns.length ? patterns.length : rowMax);
        for(r = 0 ; r < rowCount ; r++){
            var p = (r < patterns.length) ? patterns[r] : null;
            row  = dojo.create('tr', { style: { height:"22px" }, className: ((r%2)==0 ? 'even' : 'odd') }, tbody);
            if(p){
                row.id = 'patternListRow' + p.id;
            }
            cell = dojo.create('td', { width: '38px' }, row);
            cell.style.borderLeft = 'none';
            if(p){
                div = dojo.create('div', { className: 'pp_base pp_btn_edit', title: teasp.message.getLabel('tk10000240'), onclick: function(){ editPattern(this); } }, cell);
                div.style.marginTop    = '1px';
                div.style.marginBottom = '1px';
                div.style.marginLeft   = '2px';
                div.style.marginRight  = '2px';
            }
            cell = dojo.create('td', { width: '38px' }, row);
            if(p){
                div = dojo.create('div', { className: 'pp_base pp_btn_del', title: teasp.message.getLabel('delete_btn_title'), onclick: function(){ deletePattern(this); } }, cell);
                div.style.marginTop    = '1px';
                div.style.marginBottom = '1px';
                div.style.marginLeft   = '2px';
                div.style.marginRight  = '2px';
            }
            cell = dojo.create('td', { width: '200px' }, row); cell.style.textAlign   = 'left'; dojo.create('div', { innerHTML: (p ? p.name : ''), style:'word-break:break-all;' }, cell);
            cell = dojo.create('td', { width: '135px' }, row); cell.style.borderRight = 'none'; dojo.create('div', { innerHTML: getFixTime(p)     }, cell);
            cell = dojo.create('td', { width: '70px'  }, row); cell.style.borderRight = 'none'; dojo.create('div', { innerHTML: (p ? teasp.message.getLabel(p.range == '1' ? 'tk10001036' : 'tk10001037') : '') }, cell); // 短期 or 長期
        }
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        setDialogPosition(dialog, 190, 200);

        createPatternList();
        dialog.show();
    };

    var close = function(){
        // ※ 「閉じる」ボタンでクローズした場合も親画面のリストを更新する
        onfinishfunc({ patterns: inobj.patterns });
        dialog.hide();
    };

    return {
        open  : open
    };
};  // ATK.dialog.patternListDialog

/*
 * 休暇一覧ダイアログ
 */
ATK.dialog.holidayListDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;
	var holidayGroupsDialog = null; // 休暇グループ一覧

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10001084'), // 休暇一覧
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:666px;">'
            + '  <table class="pane_table" style="width:100%;">'
            + '  <tr>'
            + '    <td style="padding:0px 4px 8px 8px;text-align:left;">'
            + '      <input type="button" class="pb_base pb_btn_new" id="holidayListInsert" />'
            + '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '      <input type="button" class="pb_base pb_btn_order" title="' + teasp.message.getLabel('tk10000689') + '" id="holidayOrder" />' // 並び順変更
            + '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '      <input type="button" class="pb_base pb_btn_holiday_group" id="holidayGroupOpen" />' // 休暇グループ一覧
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '  <table class="stone_area" style="width:666px;">'
            + '  <tr>'
            + '    <td>'
            + '      <table class="stone_table">'
            + '      <tr>'
            + '        <td class="head" style="width:38px;" ></td>'
            + '        <td class="head" style="width:38px;" ></td>'
            + '        <td class="head" style="width:200px;"><div>' + teasp.message.getLabel('tk10000582') + '</div></td>' // 休暇名
            + '        <td class="head" style="width:46px;" ><div>' + teasp.message.getLabel('tk10001027') + '</div></td>' // 種類
            + '        <td class="head" style="width:74px;" ><div>' + teasp.message.getLabel('tk10001028') + '</div></td>' // 範囲
            + '        <td class="head" style="width:35px;" ><div style="margin:0px;">' + teasp.message.getLabel('tk10003800') + '</div></td>' // 有休<br/>消化
            + '        <td class="head" style="width:35px;" ><div style="margin:0px;">' + teasp.message.getLabel('tk10003810') + '</div></td>' // 日数<br/>管理
            + '        <td class="head" style="width:200px;"><div>' + getSummaryColName() + '</div></td>' // 大分類
            + '      </tr>'
            + '      </table>'
            + '      <div class="stone_div" style="height:400px;">'
            + '        <table class="stone_table" id="holidayListTable">'
            + '        <tbody></tbody>'
            + '        </table>'
            + '      </div>'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '  <table class="pane_table" style="width:100%;">'
            + '  <tr>'
            + '    <td style="padding:4px;text-align:center;">'
            + '      <input type="button" class="pb_base pb_btn_close" style="margin-top:8px;" id="holidayListClose" />'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '</div>');

        dojo.byId('holidayListInsert').onclick = function(){ insertHoliday(); };
        dojo.byId('holidayOrder').onclick = function(){ clickedHolidayOrder(); };
        dojo.byId('holidayListClose').onclick = function(){ close(); };
        dojo.byId('holidayGroupOpen').onclick = function(){ openHolidayGroupList(); };
        dojo.style('holidayGroupOpen', 'display', (inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 ? '' : 'none')); // 休暇グループ一覧ボタンの表示/非表示

        dialog.startup();
    };

    var insertHoliday = function(){
        var empTypes = inobj.empTypes;

        fetchHolidayGroups(
            function (){
                ATK.dialog.BusyWait.close();
                holidayEditDialog.open({
                    empTypes           : empTypes,
                    selectedEmpTypeIds : [],
                    holiday            : null,
                    holidays           : inobj.holidays,
                    holidayGroups      : inobj.holidayGroups,
                    referenced         : false,
                    leaveManagementVersion : inobj.leaveManagementVersion,
                    configAction       : inobj.configAction,
                    commonConfig       : inobj.commonConfig
                }, function(ro){
                    inobj.holidays = ro.allHolidays;
                    createHolidayList();
                });
            }
        );
    };

    var clickedHolidayOrder = function() {
        holidayOrderDialog.open({
            holidays : inobj.holidays
        }, function(ro) {
            inobj.holidays = ro;
            createHolidayList();
        });
    };

    var editHoliday = function(node){
        var row = node.parentNode.parentNode;
        if(!/holidayListRow(.+)/.test(row.id)){
            return;
        }
        var id = RegExp.$1;
        ATK.dialog.BusyWait.open();
        ATK.ajax.requestSend({
            action     : "getEmpTypeIdsByHolidayId",
            holidayId  : id
        }, null, funcAction, receiveAndHolidayEdit, recieveError);
    };

    // 休暇を編集
    var editHolidayOpen = function(holidayId, selectedEmpTypeIds){
        var empTypes = inobj.empTypes;
        var holidays = inobj.holidays;
        var holiday;
        for(var i = 0 ; i < holidays.length ; i++){
            if(holidays[i].id == holidayId){
                holiday = holidays[i];
                break;
            }
        }

        // 開く対象の勤怠休暇について、休暇申請が紐づいているか？そのステータスがどうなっているか？を確認する。その後休暇グループ一覧を再取得してopenする。
        checkHolidayGroupApplyAssigned(
            holiday,
            function (){
                fetchHolidayGroups(
                    function (){
                        ATK.dialog.BusyWait.close();
                        holidayEditDialog.open({
                        empTypes           : empTypes,
                        selectedEmpTypeIds : selectedEmpTypeIds,
                        holiday            : holiday,
                        holidays           : inobj.holidays,
                        holidayGroups      : inobj.holidayGroups,
                        referenced         : inobj.referenced,
                        leaveManagementVersion : inobj.leaveManagementVersion,
                        configAction       : inobj.configAction,
                        commonConfig       : inobj.commonConfig
                        }, function(ro){
                            inobj.holidays = ro.allHolidays;
                            createHolidayList();
                        });
                    }
                )
            }
        );
    };

    /**
     * 休暇申請からの参照状態を取得する
     * @param holiday 編集対象の勤怠休暇
     * @param _result 休暇申請の参照状態を格納
     */
    var checkHolidayGroupApplyAssigned = function(holiday, _callback){
        var req = {
            action:'checkHoliday',
            targetIds: [holiday.id]
        };
        Visualforce.remoting.Manager.invokeAction(inobj.configAction, dojo.toJson(req),
            dojo.hitch(this, function(result, event){
                if(event.status && result.result != 'NG'){
                    teasp.util.excludeNameSpace(result);
                    inobj.referenced = result.referenced;   // inobjにreferencedを追加
                    _callback();
                }else{
                    ATK.dialog.BusyWait.close();
                    teasp.tsAlert(teasp.message.getErrorMessage(event.status ? result : event));
                }
            }),
            { escape : false }
        );
    }

    /**
	 * 休暇グループ一覧を取得
	 */
	var fetchHolidayGroups = function(_callback){
		const req = {
				action:'fetchHolidayGroups'
		};
		Visualforce.remoting.Manager.invokeAction(inobj.configAction, dojo.toJson(req),
            dojo.hitch(this,function(result, event){
				if(event.status && result.result != 'NG'){
					teasp.util.excludeNameSpace(result);
					var holidayGroups = [];
					dojo.forEach(result.holidayGroups || [], function(record){
							holidayGroups.push(new ATK.obj.HolidayGroup(record));
					});
                    inobj.holidayGroups = holidayGroups;
					_callback();
				}else{
                    ATK.dialog.BusyWait.close();
                    teasp.tsAlert(teasp.message.getErrorMessage(event.status ? result : event));
				}
			}),
			{ escape : false }
		);
	}

    // 休暇を削除
    var deleteHoliday = function(node){
        var row = node.parentNode.parentNode;
        if(!/holidayListRow(.+)/.test(row.id)){
            return;
        }
        var id = RegExp.$1;
        // 休暇\n「{0}」を削除してよろしいですか？
        teasp.tsConfirm(teasp.message.getLabel('tk10003830', (row.cells[2].textContent || row.cells[2].innerText)), null, function(confirmOk){
            if(confirmOk){
                // 【最終確認】\n削除すると元に戻すことはできません。本当に削除してよろしいですか？
                teasp.tsConfirm(teasp.message.getLabel('tk10003790'), null, function(confirmOk){
                    if(confirmOk){
                        ATK.dialog.BusyWait.open();
                        ATK.ajax.requestSend({
                            action     : "deleteHolidayConfig",
                            holidayId  : id
                        }, null, funcAction, receiveHolidayDeleted, recieveError);
                    }
                });
            }
        });
    };

    // AJAX正常戻り値処理
    function receiveAndHolidayEdit(o){
        editHolidayOpen(o.holidayId, o.empTypeIds);
    }

    // AJAX正常戻り値処理
    function receiveHolidayDeleted(o){
        ATK.dialog.BusyWait.close();
        inobj.holidays = o.allHolidays;
        createHolidayList();
    }

    // AJAX異常戻り値処理
    var recieveError = function(o){
        ATK.dialog.BusyWait.close();
        teasp.tsAlert(teasp.message.getLabel('tm00000010', o.error.message));
    };

    var getHolidayType = function(h){
        if(!h){
            return '';
        }
        if(h.type == '1'){
            return teasp.message.getLabel('holidayYuq_label'); // 有給
        }else if(h.type == '2'){
            return teasp.message.getLabel('tm10010540'); // 無給
        }else{
            return teasp.message.getLabel('tm10010550'); // 代休
        }
    };

    var getHolidayRange = function(h){
        if(!h){
            return '';
        }
        if(h.range == '4'){
            return teasp.message.getLabel('tm10010560'); // 時間単位休
        }else if(h.range == '3'){
            return teasp.message.getLabel('holidayPm_label'); // 午後半休
        }else if(h.range == '2'){
            return teasp.message.getLabel('holidayAm_label'); // 午前半休
        }else{
            return teasp.message.getLabel('holidayDay_label'); // 終日休
        }
    };

    var getHolidayYuqs = function(h){
        if(!h){
            return '';
        }
        if(inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2){
            return teasp.message.getLabel(isThisHolidayGroupTypeA(h.manageGroupId) ? 'tm10009100' : 'tk10000618'); // ○ or ×
        }else{
            return teasp.message.getLabel(h.yuqSpend ? 'tm10009100' : 'tk10000618'); // ○ or ×
        }
    };

    var getHolidayRate = function(h){
        if(!h){
            return '';
        }
        return teasp.message.getLabel(h.isWorking ? 'tm10009100' : 'tk10000618'); // ○ or ×
    };

    var getHolidayManaged = function(h) {
        if (!h) {
            return '';
        }
        if(inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2){
            return teasp.message.getLabel(h.manageGroupId ? 'tm10009100' : 'tk10000618'); // ○ or ×
        }else{
            return teasp.message.getLabel(h.managed ? 'tm10009100' : 'tk10000618'); // ○ or ×
        }
    }

    var getSummaryName = function(h){
        if(inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2){
            if(!h) return '';
            for(i=0; i<inobj.holidayGroups.length; i++ ){
                if(inobj.holidayGroups[i].getId() == h.summaryGroupId){
                    return inobj.holidayGroups[i].getName();
                }
            }
            return '';
        }else{
            return h ? (h.summaryName || h.name) : '';
        }
    }

    /**
     * 休暇一覧ヘッダーの集計列名を休暇管理バージョンによって切り替える
     */
     var getSummaryColName = function(){
        if(inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2){
            return teasp.message.getLabel('hg00000090'); // 集計グループ
        }else{
            return teasp.message.getLabel('tk10003820'); // 大分類
        }
    }

    /**
     * 検査対象の休暇グループが、年次有給休暇グループかどうかを返す。
     * @param {string} holidayGroupId 検査対象の休暇グループID
     * @returns {boolean} true:年次有給休暇グループ、false年次有給休暇グループ以外の休暇グループ
     */
     var isThisHolidayGroupTypeA = function(holidayGroupId){
        var ret = false;
        for(i=0; i<inobj.holidayGroups.length; i++ ){
            if(  inobj.holidayGroups[i].getId() == holidayGroupId
            && inobj.holidayGroups[i].getType() == ATK.obj.HolidayGroup.A_TYPE){
                return true;
            }
        }
        return ret;
    }

    //休暇一覧テーブル作成2012/07/25
    var createHolidayTable = function(){
        var lst = inobj.holidays;
        var tbody = dojo.byId('orderChange').getElementsByTagName('tbody')[0];
        while(tbody.firstChild){
            dojo.destroy(tbody.firstChild);
        }
        for(var r = 0 ; r < lst.length ; r++){
            addExpItemRow(tbody, lst[r], r);
        }
        if(lst.length <= 0){
            dojo.create('div', { style: { margin:"2px 4px" }, innerHTML: teasp.message.getLabel('tk10001087') } // 休暇名は設定されていません
                , dojo.create('td', { colSpan: 13, style: { textAlign:"left" } }
                , dojo.create('tr', { className: 'even' }, tbody)));
        }
    };

    // 休暇リスト作成
    var createHolidayList = function(){
        var tbody, row, cell, div, r;
        var holidays = inobj.holidays;

        tbody = dojo.byId('holidayListTable').getElementsByTagName('tbody')[0];
        while(tbody.firstChild){
            dojo.destroy(tbody.firstChild);
        }
        var rowMax = 18;
        var rowCount = (rowMax < holidays.length ? holidays.length : rowMax);
        for(r = 0 ; r < rowCount ; r++){
            var p = (r < holidays.length) ? holidays[r] : null;
            row  = dojo.create('tr', { height: '22px', className: ((r%2)==0 ? 'even' : 'odd') }, tbody);
            if(p){
                row.id = 'holidayListRow' + p.id;
            }
            cell = dojo.create('td', { width: '38px' }, row);
            cell.style.borderLeft = 'none';
            if(p){
                div = dojo.create('div', { className: 'pp_base pp_btn_edit', title: teasp.message.getLabel('tk10000240'), onclick: function(){ editHoliday(this); } }, cell); // 編集
                div.style.marginTop    = '1px';
                div.style.marginBottom = '1px';
                div.style.marginLeft   = '2px';
                div.style.marginRight  = '2px';
            }
            cell = dojo.create('td', { width: '38px' }, row);
            if(p){
                div = dojo.create('div', { className: 'pp_base pp_btn_del', title: teasp.message.getLabel('delete_btn_title'), onclick: function(){ deleteHoliday(this); } }, cell); // 削除
                div.style.marginTop    = '1px';
                div.style.marginBottom = '1px';
                div.style.marginLeft   = '2px';
                div.style.marginRight  = '2px';
            }
            cell = dojo.create('td', { width: '200px' }, row); cell.style.textAlign = 'left';   dojo.create('div', { innerHTML: (p ? p.name : '')   , style: { wordBreak:"break-all" } }, cell);
            cell = dojo.create('td', { width: '46px'  }, row);                                  dojo.create('div', { innerHTML: getHolidayType(p)    }, cell);
            cell = dojo.create('td', { width: '74px' }, row); dojo.create('div', { innerHTML: getHolidayRange(p)  }, cell);
            cell = dojo.create('td', { width: '35px' }, row); dojo.create('div', { innerHTML: getHolidayYuqs(p)   , style: { fontFamily:"sans-serif" } }, cell);
            cell = dojo.create('td', { width: '35px' }, row); dojo.create('div', { innerHTML: getHolidayManaged(p), style: { fontFamily:"sans-serif" } }, cell);
            cell = dojo.create('td', { width:'181px', style: { borderRight:"none" } }, row);
            cell.style.textAlign = 'left';
            dojo.create('div', { innerHTML: getSummaryName(p), style: { wordBreak:"break-all" } }, cell);
        }
    };

    // 休暇グループ一覧ダイアログを開く
    var openHolidayGroupList = function(){
		if(!holidayGroupsDialog){
			holidayGroupsDialog = new ATK.dialog.HolidayGroupsDialog(inobj.configAction);
		}
		holidayGroupsDialog.open().then(
            dojo.hitch(this, function(newHolidayGroups){
                inobj.holidayGroups = newHolidayGroups;
                createHolidayList();
            })
        );
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;

        attach();

        setDialogPosition(dialog, 160, 200);

        createHolidayList();
        dialog.show();
    };

    var close = function(){
        // ※ 「閉じる」ボタンでクローズした場合も親画面のリストを更新する
        onfinishfunc({ holidays: inobj.holidays });
        dialog.hide();
    };

    return {
        open  : open
    };
};  // ATK.dialog.holidayListDialog

/*
 * 勤務パターン編集ダイアログ
 */
ATK.dialog.patternEditDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;
    var tc;
    var restRowNo = 1;
    var eventHandleMap = {};
    var eventHandleGroupNo = 1;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10001088'), // 勤務パターン編集
            duration : 300
        });

        dialog.attr('content',
              '<div style="width:660px;height:572px;padding-right:10px;" id="patternEditDialogBase">'
            + '  <div id="patternEditContainer"></div>'
            + '  <table border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-top:8px;">'
            + '  <tr>'
            + '    <td style="width:100%;text-align:center;">'
            + '      <input type="button" class="pb_base pb_btn_regist" id="patternEditOk">'
            + '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '      <input type="button" class="pb_base pb_btn_cancel" id="patternEditCancel">'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '</div>');

        tc = new dijit.layout.TabContainer({
            style: { height:"530px", width:"100%" }
        },
        "patternEditContainer");

        var cp1 = new dijit.layout.ContentPane({
            id   : 'patternEditPane1',
            title: teasp.message.getLabel('tf10007820'), // 設定１
            content: '<div style="padding:4px;">'
            + '  <table class="ts_a_frame" style="width:100%;">'
            + '  <tr>'
            + '    <td class="edgelt"></td>'
            + '    <td class="edgeht"></td>'
            + '    <td class="edgert"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgevl"></td>'
            + '    <td>'
            + '      <div class="edge_div">'
            + '        <table class="stand_table">'
            + '        <tr>'
            + '          <td class="left csize2">'
            + teasp.message.getLabel('tk10001032') // 勤務パターン名
            + '          </td>'
            + '          <td class="right">'
            + '            <input type="text" id="patternEditName" value="" maxlength="80" class="inputran inputtex" style="width:180px;"/>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left csize2 top_line">'
            + teasp.message.getLabel('tm10010170') // 始業終業の時刻
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <table class="pane_table">'
            + '            <tr>'
            + '              <td>'
            + '                <input type="text" id="patternEditStdStartTime" maxlength="5" class="inputran inputime" value="" />'
            + '              </td>'
            + '              <td style="padding:0px;text-align:center;width:20px;">' + teasp.message.getLabel('wave_label') + '</td>' // ～
            + '              <td>'
            + '                <input type="text" id="patternEditStdEndTime" maxlength="5" class="inputran inputime" value="" />'
            + '              </td>'
            + '              <td>'
            + '                <div id="patternEditCalcWorkTime" style="margin-left:24px;font-family:verdana;"></div>'
            + '              </td>'
            + '            </tr>'
            + '            </table>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left csize2 top_line">'
            + teasp.message.getLabel('restTime_label') // 休憩時間
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <table class="pane_table" id="patternEditFullRests">'
            + '            <tr>'
            + '              <td>'
            + '                <div style="width:200px;padding:0px;margin:0px;border:1px solid #FFFFFF;overflow-y:scroll;overflow-x:hidden;" class="rest_div">'
            + '                  <table class="pane_table rest_table" style="width:100%;">'
            + '                  <tbody>'
            + '                  </tbody>'
            + '                  </table>'
            + '                </div>'
            + '              </td>'
            + '              <td style="padding-left:8px;vertical-align:bottom;">'
            + '                <input type="button" class="pb_base pb_btn_plus" />'
            + '              </td>'
            + '            </tr>'
            + '            </table>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left csize2 top_line">'
            + teasp.message.getLabel('fixTimeOfDay_label') // 所定労働時間
            + '          </td>'
            + '          <td class="right top_line">'
            + '                <input type="text" id="patternEditStandardFixTime" maxlength="5" class="inputran inputime" value="" />'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="top_line" style="padding:3px 0px;font-weight:bold;color:#4A4A56;text-align:left;white-space:nowrap;">'
            + '            <div class="expand_section_title expa_close" id="patternEditSectionHalf">' + teasp.message.getLabel('tk10000532') + '</div>' // 半日休暇設定
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <label><input type="checkbox" id="patternEditUseHalfHoliday" /> ' + teasp.message.getLabel('tk10000533') + '</label>' // 半日休暇取得可
            + '          </td>'
            + '        </tr>'
            + '        <tr id="patternEditSectionHalfRow" style="display:none;">'
            + '          <td colspan="3" style="padding-left:12px;padding-right:10px;padding-bottom:4px;">'
            + '            <table class="ts_a_frame">'
            + '            <tr>'
            + '              <td class="edgelt"></td>'
            + '              <td class="edgeht"></td>'
            + '              <td class="edgert"></td>'
            + '            </tr>'
            + '            <tr>'
            + '              <td class="edgevl"></td>'
            + '              <td>'
            + '                <div class="edge_div" style="background-color:#E7F3FB;padding:1px 4px;">'
            + '                  <table class="stand_table">'
            + '                  <tr>'
            + '                    <td class="left csize2">'
            + teasp.message.getLabel('tk10000534') // 午前半休適用時間
            + '                    </td>'
            + '                    <td class="right" style="padding:3px 8px;width:150px;">'
            + '                      <input type="text" id="patternEditAmHolidayStartTime" maxlength="5" class="inputran inputime" value=""/>'
            + '                      &nbsp;' + teasp.message.getLabel('wave_label') + '&nbsp;' // ～
            + '                      <input type="text" id="patternEditAmHolidayEndTime" maxlength="5" class="inputran inputime" value=""/>'
            + '                    </td>'
            + '                    <td style="padding:3px;text-align:left;">'
            + '                      <div id="patternEditCalcAmHalf" style="margin-left:2px;font-family:verdana;"></div>'
            + '                    </td>'
            + '                  </tr>'
            + '                  <tr>'
            + '                    <td class="left csize2">'
            + teasp.message.getLabel('tk10000535') // 午後半休適用時間
            + '                    </td>'
            + '                    <td class="right" style="padding:3px 8px;width:150px;">'
            + '                      <input type="text" id="patternEditPmHolidayStartTime" maxlength="5" class="inputran inputime" value=""/>'
            + '                      &nbsp;' + teasp.message.getLabel('wave_label') + '&nbsp;' // ～
            + '                      <input type="text" id="patternEditPmHolidayEndTime" maxlength="5" class="inputran inputime" value=""/>'
            + '                    </td>'
            + '                    <td style="padding:3px;text-align:left;">'
            + '                      <div id="patternEditCalcPmHalf" style="margin-left:2px;font-family:verdana;"></div>'
            + '                    </td>'
            + '                  </tr>'
            + '                  <tr id="patternEditUseHalfHolidayRestTime">'
            + '                    <td class="left csize2 top_line">'
            + teasp.message.getLabel('tf10009700') // 半休取得時の休憩時間
            + '                    </td>'
            + '                    <td class="right top_line" style="padding:3px 8px;" colSpan="2">'
            + '                      <label><input type="checkbox" /> <span>' + teasp.message.getLabel('tf10009710') + '</span></label>' // 適用する
            + '                    </td>'
            + '                  </tr>'
            + '                  <tr id="patternEditAmHalfRests">'
            + '                    <td class="left csize2">'
            + teasp.message.getLabel('tf10009720') // 午前半休時休憩時間
            + '                    </td>'
            + '                    <td class="right" colSpan="2">'
            + '                      <table class="pane_table">'
            + '                      <tr>'
            + '                        <td>'
            + '                          <div style="width:200px;padding:0px;margin:0px;overflow-y:scroll;overflow-x:hidden;" class="rest_div">'
            + '                            <table class="pane_table rest_table" style="width:100%;">'
            + '                            <tbody>'
            + '                            </tbody>'
            + '                            </table>'
            + '                          </div>'
            + '                        </td>'
            + '                        <td style="padding-left:8px;vertical-align:bottom;">'
            + '                          <input type="button" class="pb_base pb_btn_plus" />'
            + '                        </td>'
            + '                      </tr>'
            + '                      </table>'
            + '                    </td>'
            + '                  </tr>'
            + '                  <tr id="patternEditPmHalfRests">'
            + '                    <td class="left csize2">'
            + teasp.message.getLabel('tf10009730') // 午後半休時休憩時間
            + '                    </td>'
            + '                    <td class="right" colSpan="2">'
            + '                      <table class="pane_table">'
            + '                      <tr>'
            + '                        <td>'
            + '                          <div style="width:200px;padding:0px;margin:0px;overflow-y:scroll;overflow-x:hidden;" class="rest_div">'
            + '                            <table class="pane_table rest_table" style="width:100%;">'
            + '                            <tbody>'
            + '                            </tbody>'
            + '                            </table>'
            + '                          </div>'
            + '                        </td>'
            + '                        <td style="padding-left:8px;vertical-align:bottom;">'
            + '                          <input type="button" class="pb_base pb_btn_plus" />'
            + '                        </td>'
            + '                      </tr>'
            + '                      </table>'
            + '                    </td>'
            + '                  </tr>'
            + '                  </table>'
            + '                </div>'
            + '              </td>'
            + '              <td class="edgevr"></td>'
            + '            </tr>'
            + '            <tr>'
            + '              <td class="edgelb"></td>'
            + '              <td class="edgehb"></td>'
            + '              <td class="edgerb"></td>'
            + '            </tr>'
            + '            </table>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left csize2 top_line">'
            + teasp.message.getLabel('nightWorkEx_label') // 深夜労働割増
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <label><input type="checkbox" id="patternEditIgonreNightWork" /> ' + teasp.message.getLabel('tm10010140') + '</label>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left csize2 top_line">'
            + teasp.message.getLabel('tm10010240') // 裁量労働
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <label><input type="checkbox" id="patternEditUseDiscretionary" /> ' + teasp.message.getLabel('tm10010250') + '</label>' // 採用する
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left csize2 top_line">'
            + '            <div id="patternRangeLabel">' + teasp.message.getLabel('tk10001035') + '</div>' // 対象期間
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <table class="pane_table">'
            + '            <tr>'
            + '              <td>'
            + '                <label><input type="radio" name="patternRange" id="patternEditPatternRange1" /> ' + teasp.message.getLabel('tk10001036') + '</label>' // 短期
            + '              </td>'
            + '              <td style="padding-left:20px;">'
            + '                <label><input type="radio" name="patternRange" id="patternEditPatternRange2" /> ' + teasp.message.getLabel('tk10001037') + '</label>' // 長期
            + '              </td>'
            + '            </tr>'
            + '            </table>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left csize2 top_line">'
            + teasp.message.getLabel('tk10001089') // 略称
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <input type="text" id="abbreviatedName" value="" maxlength="3" class="inputran inputtex" style="width:45px;"/>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left csize2 top_line">'
            + teasp.message.getLabel('tk10003840') // 所定時間の変更を禁止
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <div style="float:left;margin-right:30px;">'
            + '                 <label><input type="checkbox" id="prohibitChangeWorkTime"         /> ' + teasp.message.getLabel('tk10003850') + '</label></div>' // 平日勤務
            + '            <div><label><input type="checkbox" id="prohibitChangeHolidayWorkTime"  /> ' + teasp.message.getLabel('tk10003860') + '</label></div>' // 休日出勤日
            + '            <div><label><input type="checkbox" id="prohibitChangeExchangedWorkTime"/> ' + teasp.message.getLabel('tk10003870') + '</label></div>' // 休日の振替勤務日
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left csize2 top_line" id="workTimeChangesWithShiftLabel">'
            + teasp.message.getLabel('tf10004710') // シフト時刻と所定勤務時間を連動させる
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <label><input type="checkbox" id="workTimeChangesWithShift" /></label>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left csize2 top_line">'
            + teasp.message.getLabel('tf10004700') // シフト始業時刻と所定休・半休を連動させる
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <label><input type="checkbox" id="enableRestTimeShift" /></label>'
            + '          </td>'
            + '        </tr>'
            + '        </table>'
            + '      </div>'
            + '    </td>'
            + '    <td class="edgevr"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgelb"></td>'
            + '    <td class="edgehb"></td>'
            + '    <td class="edgerb"></td>'
            + '  </tr>'
            + '  <tr id="patternEditErrorRow" style="display:none;">'
            + '    <td colspan="3" style="text-align:center;padding:0px;">'
            + '      <div id="patternEditError" style="color:red;margin-top:4px;margin-bottom:0px;"></div>'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '</div>'
        });
        tc.addChild(cp1);

        var cp2 = new dijit.layout.ContentPane({
            id   : 'patternEditPane2',
            title: teasp.message.getLabel('tf10007830'), // 設定２
            content: '<div style="padding:4px;">'
            + '  <table class="ts_a_frame" style="width:100%;">'
            + '  <tr>'
            + '    <td class="edgelt"></td>'
            + '    <td class="edgeht"></td>'
            + '    <td class="edgert"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgevl"></td>'
            + '    <td>'
            + '      <div class="edge_div">'
            + '        <table class="stand_table">'
            + '        <tr>'
            + '          <td class="left csize2">'
            + teasp.message.getLabel('tf10007800') // コア時間帯を使用しない
            + '          </td>'
            + '          <td class="right">'
            + '            <label><input type="checkbox" id="patternEditDisableCoreTime" /></label>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td colSpan="2">'
            + '              <div style="margin:4px 20px;">'
            + teasp.message.getLabel('tf10007810') // このオプションは労働時間制がフレックスタイム制の場合だけ有効に働きます。その際、設定１の内容は無効になります。
            + '              </div>'
            + '          </td>'
            + '        </tr>'
            + '        </table>'
            + '      </div>'
            + '    </td>'
            + '    <td class="edgevr"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgelb"></td>'
            + '    <td class="edgehb"></td>'
            + '    <td class="edgerb"></td>'
            + '  </tr>'
            + '  </table>'
            + '</div>'
        });
        tc.addChild(cp2);

        var cp3 = new dijit.layout.ContentPane({
            id   : 'patternEditPane3',
            title: teasp.message.getLabel('tk10001090'), // 割り当て
            content: '<div style="padding:10px;">'
            + '<table class="pane_table" style="width:100%;">'
            + '<tr>'
            + '  <td style="text-align:center;padding:4px 20px 10px 20px;">'
            + teasp.message.getLabel('tk10001091') // この勤務パターンを選択することができる勤務体系をチェックしてください。
            + '  </td>'
            + '</tr>'
            + '<tr>'
            + '  <td style="text-align:center;padding-left:15px;padding-right:15px;">'
            + '    <table class="stone_area" style="width:574px;">'
            + '    <tr>'
            + '      <td>'
            + '        <table class="stone_table">'
            + '        <tr>'
            + '          <td class="head" style="width:24px;"><input type="checkbox" id="patternEditEmpTypeCheck0" /></td>'
            + '          <td class="head" style="width:550px;"><div>' + teasp.message.getLabel('tk10001092') + '</div></td>' // 勤務体系名
            + '        </tr>'
            + '        </table>'
            + '        <div class="stone_div" style="height:250px;">'
            + '        <table class="stone_table" id="patternEditEmpTypes">'
            + '        <tbody>'
            + '        </tbody>'
            + '        </table>'
            + '        </div>'
            + '      </td>'
            + '    </tr>'
            + '    </table>'
            + '  </td>'
            + '</tr>'
            + '</table>'
            + '</div>'
        });
        tc.addChild(cp3);

        dojo.byId('patternEditOk').onclick = function(){ saveAndClose(); };
        dojo.byId('patternEditCancel').onclick = function(){ close(); };

        dojo.byId('patternEditSectionHalf').onclick = function(){ clickSectionHalf(); };

        dojo.byId('patternEditEmpTypeCheck0').onclick = function(){ checkAllEmpType(); };

        dojo.byId('patternEditUseHalfHoliday').onchange = clickHalfHoliday;
        dojo.byId('patternEditUseHalfHolidayRestTime').onclick = checkUseHalfHolidayRestTime; // 半休取得時の休憩時間

        // 休憩時間の追加ボタン
        dojo.query('#patternEditFullRests   input[type="button"]').forEach(function(el){
            dojo.connect(el, 'onclick', function(e){ clickRestPlus('patternEditFullRests'  ); });
        });
        // 午前半休時休憩時間
        dojo.query('#patternEditAmHalfRests input[type="button"]').forEach(function(el){
            dojo.connect(el, 'onclick', function(e){ clickRestPlus('patternEditAmHalfRests'); });
        });
        // 午後半休時休憩時間
        dojo.query('#patternEditPmHalfRests input[type="button"]').forEach(function(el){
            dojo.connect(el, 'onclick', function(e){ clickRestPlus('patternEditPmHalfRests'); });
        });

        // シフト時に勤務時間の延長・短縮を禁止 チェック時イベント
        dojo.byId('prohibitChangeWorkTime'         ).onclick = checkedProhibitChangeX;
        dojo.byId('prohibitChangeHolidayWorkTime'  ).onclick = checkedProhibitChangeX;
        dojo.byId('prohibitChangeExchangedWorkTime').onclick = checkedProhibitChangeX;

        dojo.byId('patternEditUseDiscretionary').onclick = checkedUseDiscretionary; // 裁量労働＝採用する チェック時イベント

        dojo.query('.inputime').forEach(
            function(elem) {
                dojo.connect(elem, 'blur', function(e) {
                    ATK.util.onblurTime(e);
                    if(elem.id == 'patternEditStdStartTime' || elem.id == 'patternEditStdEndTime'){
                        updateStandardFixTime();
                    }else if(elem.id == 'patternEditAmHolidayStartTime'
                    || elem.id == 'patternEditAmHolidayEndTime'
                    || elem.id == 'patternEditPmHolidayStartTime'
                    || elem.id == 'patternEditPmHolidayEndTime'){
                        updateHalfTime();
                    }
                });
                dojo.connect(elem, 'onkeypress', function(e) {
                    ATK.util.onkeypressTime(e);
                    if(elem.id == 'patternEditStdStartTime' || elem.id == 'patternEditStdEndTime'){
                        updateStandardFixTime();
                    }else if(elem.id == 'patternEditAmHolidayStartTime'
                    || elem.id == 'patternEditAmHolidayEndTime'
                    || elem.id == 'patternEditPmHolidayStartTime'
                    || elem.id == 'patternEditPmHolidayEndTime'){
                        updateHalfTime();
                    }
                });
            }
        );
        teasp.util.insertHelpIcon('patternRange');      // 対象期間
        dialog.startup();
    };
    // イベントハンドルを記憶
    var setEventHandle = function(groupKey, ev){
        if(!eventHandleMap[groupKey]){
            eventHandleMap[groupKey] = [];
        }
        eventHandleMap[groupKey].push(ev);
    }
    // イベントハンドルを解放
    var removeEventHandle = function(groupKey){
        if(!groupKey){
            return;
        }
        var events = eventHandleMap[groupKey] || [];
        for(var i = 0 ; i < events.length ; i++){
            dojo.disconnect(events[i]);
        }
        delete eventHandleMap[groupKey];
    }
    // 指定のタグが見つかるまで上位タグをたどる
    var getAncestorByTagName = function(el, tagName){
        var pel = null;
        var p = el;
        while(p != null && p.tagName != 'BODY'){
            if(p.tagName == tagName){
                pel = p;
                break;
            }
            p = p.parentNode;
        }
        return pel;
    }

    // 休憩時間の文字列をオブジェクト化
    function convertRestTime(str){
        var lst = [];
        if(str){
            if(typeof(str) == 'string'){
                var l = str.split(',');
                if(l && l.length > 0){
                    for(i = 0 ; i < l.length ; i++){
                        if(/\s*(\d+)\s*-\s*(\d+)\s*/.test(l[i])){
                            lst.push({ from: parseInt(RegExp.$1, 10), to: parseInt(RegExp.$2, 10) });
                        }
                    }
                }
            }else if(str.length){
                return str;
            }
        }
        return lst;
    };

    // 休憩時間入力エリア作成
    function createRestArea(domId, restTimes, flag){
        var area = dojo.byId(domId);
        var tbody = dojo.query('table.rest_table tbody', area)[0];
        dojo.query('tr', tbody).forEach(function(tr){
            removeEventHandle(dojo.getAttr(tr, 'data'));
        });
        dojo.empty(tbody);
        var i = 1;
        do {
            createRestRow(domId, tbody);
        } while(i++ < restTimes.length);
        // 休憩時間をセット
        for(var i = 0 ; i < restTimes.length ; i++){
            var rt = restTimes[i];
            var row = tbody.rows[i];
            row.cells[0].firstChild.value = ATK.util.timeValue(rt.from);
            row.cells[2].firstChild.value = ATK.util.timeValue(rt.to);
        }
        var restAdd = dojo.query('input[type="button"]', area)[0];
        dojo.toggleClass(restAdd, 'pb_btn_plus'    , (tbody.rows.length <  10));
        dojo.toggleClass(restAdd, 'pb_btn_plus_dis', (tbody.rows.length >= 10));
        adjustRestDiv(domId);
    };

    // event: 休憩時間入力行を追加
    function createRestRow(domId, tbody){
        var groupKey = 'PATTERN_REST' + (eventHandleGroupNo++);
        var row = dojo.create('tr', { data:groupKey }, tbody);
        dojo.create('input', { type:'text', value:'', maxlength:'5', className:'inputran inputime', style:'margin:0px;' }, dojo.create('td', { style:'padding-top:2px;' }, row));
        dojo.create('td', { style:'width:20px;padding-top:1px;text-align:center;', innerHTML:teasp.message.getLabel('wave_label') }, row); // ～
        dojo.create('input', { type:'text', value:'', maxlength:'5', className:'inputran inputime', style:'margin:0px;' }, dojo.create('td', { style:'padding-top:2px;' }, row));

        dojo.query('input', tbody).forEach(function(el){
            setEventHandle(groupKey, dojo.connect(el, 'blur'      , function(e) { ATK.util.onblurTime(e);     updateStandardFixTime(e); }));
            setEventHandle(groupKey, dojo.connect(el, 'onkeypress', function(e) { ATK.util.onkeypressTime(e); updateStandardFixTime(e); }));
        });
        var cell = dojo.create('td', { width: '66px', style:'padding-top:1px;padding-left:12px;text-align:center;' }, row);
        if(tbody.rows.length > 0){
            var node = dojo.create('div', { className:'pp_base pp_btn_del', style:'cursor:pointer;', title:teasp.message.getLabel('delete_btn_title') }, cell); // 削除
            setEventHandle(groupKey, dojo.connect(node, 'onclick', function(e) { clickRestRemove(domId, e.target); }));
        }
    }

    // 休憩時間追加
    function clickRestPlus(domId, tbody){
        var area = dojo.byId(domId);
        var restAdd = dojo.query('input[type="button"]', area)[0];
        if(dojo.hasClass(restAdd, 'pb_btn_plus_dis')){
            return;
        }
        var tbody = dojo.query('table.rest_table tbody', area)[0];
        createRestRow(domId, tbody);
        dojo.toggleClass(restAdd, 'pb_btn_plus'    , (tbody.rows.length <  10));
        dojo.toggleClass(restAdd, 'pb_btn_plus_dis', (tbody.rows.length >= 10));
        adjustRestDiv(domId);
    }

    // 休憩エリアの高さを制御
    function adjustRestDiv(domId){
        var area = dojo.byId(domId);
        var tbody = dojo.query('table.rest_table tbody', area)[0];
        var restDiv = dojo.query('div.rest_div', area)[0];
        restDiv.style.height = ({1:22,2:44,3:66}[tbody.rows.length] || 80) + 'px';
    }

    // 休憩時間を削除
    function clickRestRemove(domId, node){
        var tr = getAncestorByTagName(node, 'TR');
        var t = getRestValue(tr);
        if(t.from != null || t.to != null){
            // 休憩時間を削除しますか？
            teasp.tsConfirm(teasp.message.getLabel('tm10003940'), null, function(confirmOk){
                if(confirmOk){
                    clickRestRemove2(domId, tr);
                }
            });
        }else{
            clickRestRemove2(domId, tr);
        }
    }

    function clickRestRemove2(domId, tr){
        var area = dojo.byId(domId);
        var tbody = dojo.query('table.rest_table tbody', area)[0];
        if(tbody.rows.length == 1){
            tr.cells[0].firstChild.value = '';
            tr.cells[2].firstChild.value = '';
        }else{
            removeEventHandle(dojo.getAttr(tr, 'data'));
            var restAdd = dojo.query('input[type="button"]', area)[0];
            dojo.toggleClass(restAdd, 'pb_btn_plus'    , true );
            dojo.toggleClass(restAdd, 'pb_btn_plus_dis', false);
            dojo.destroy(tr);
        }
        updateStandardFixTime();

        adjustRestDiv(domId);
    }

    // event: 半日休暇セクションをクリック
    function clickSectionHalf(){
        var n;
        n = dojo.byId('patternEditSectionHalfRow').style.display;
        dojo.style('patternEditSectionHalfRow', 'display', (n == '' ? 'none' : ''));
        dojo.toggleClass('patternEditSectionHalf', 'expa_open' , (n != ''));
        dojo.toggleClass('patternEditSectionHalf', 'expa_close', (n == ''));
    }

    // event: 半日休暇使用をチェック
    function clickHalfHoliday(){
        var checked = dojo.byId('patternEditUseHalfHoliday').checked;
        if(checked){
            dojo.style('patternEditSectionHalfRow', 'display', '');
            dojo.toggleClass('patternEditSectionHalf', 'expa_open' , true);
            dojo.toggleClass('patternEditSectionHalf', 'expa_close', false);
        }
        dojo.byId('patternEditAmHolidayStartTime').disabled = !checked;
        dojo.byId('patternEditAmHolidayEndTime'  ).disabled = !checked;
        dojo.byId('patternEditPmHolidayStartTime').disabled = !checked;
        dojo.byId('patternEditPmHolidayEndTime'  ).disabled = !checked;
        dojo.byId('patternEditCalcAmHalf').style.color = (checked ? '#222222' : '#797A91');
        dojo.byId('patternEditCalcPmHalf').style.color = (checked ? '#222222' : '#797A91');
        if(checked
        && dojo.byId('patternEditAmHolidayStartTime').value == ''
        && dojo.byId('patternEditAmHolidayEndTime'  ).value == ''
        && dojo.byId('patternEditPmHolidayStartTime').value == ''
        && dojo.byId('patternEditPmHolidayEndTime'  ).value == ''){
            var st = ATK.util.clock2minutes(dojo.byId('patternEditStdStartTime').value);
            var et = ATK.util.clock2minutes(dojo.byId('patternEditStdEndTime').value);
            if(typeof(st) == 'number' && typeof(et) == 'number' && st < et){
                var span = { from: st, to: et };
                var rests = collectRests('patternEditFullRests', false);
                rests = rests.sort(function(a, b){
                    return a.from - b.from;
                });
                var rsum = ATK.util.rangeTime(span, rests);
                var half = Math.round((et - st - rsum) / 2);
                var wt = [span];
                var i = 0;
                while(i < rests.length) {
                    wt = ATK.util.sliceTimes(wt, rests[i]);
                    i++;
                }
                var sum = 0;
                var mt = -1;
                for(i = 0 ; i < wt.length ; i++){
                    var t = wt[i].to - wt[i].from;
                    if((sum + t) >= half && mt < 0){
                        mt = wt[i].from + (half - sum);
                    }
                    sum += t;
                }
                if(mt > 0){
                    dojo.byId('patternEditAmHolidayStartTime').value = ATK.util.timeValue(st);
                    dojo.byId('patternEditAmHolidayEndTime'  ).value = ATK.util.timeValue(mt);
                    dojo.byId('patternEditPmHolidayStartTime').value = ATK.util.timeValue(mt);
                    dojo.byId('patternEditPmHolidayEndTime'  ).value = ATK.util.timeValue(et);
                    updateHalfTime();
                }
            }
        }
        var useHalfHolidayRestTime = dojo.query('#patternEditUseHalfHolidayRestTime input[type="checkbox"]')[0];
        useHalfHolidayRestTime.disabled = !checked;
        dojo.style(dojo.query('#patternEditUseHalfHolidayRestTime span')[0], 'color', (checked ? '#222222' : '#797A91'));
        checkUseHalfHolidayRestTime();
    }

    // 半休取得時の休憩時間をチェック
    function checkUseHalfHolidayRestTime(){
        var useHalfHolidayRestTime = dojo.query('#patternEditUseHalfHolidayRestTime input[type="checkbox"]')[0].checked;
        var flag = (dojo.byId('patternEditUseHalfHoliday').checked && useHalfHolidayRestTime);
        if(!flag){
            // 半休取得時の休憩時間を無効化する際に、無効な値と空欄を除去する
            var amRests = collectRests('patternEditAmHalfRests', false); // 入力欄の値を採取
            amRests = amRests.sort(function(a, b){
                return a.from - b.from;
            });
            var pmRests = collectRests('patternEditPmHalfRests', false); // 入力欄の値を採取
            pmRests = pmRests.sort(function(a, b){
                return a.from - b.from;
            });
            // 入力欄を再構築
            createRestArea('patternEditAmHalfRests', amRests, false);
            createRestArea('patternEditPmHalfRests', pmRests, false);
        }
        // 休憩入力欄の活性/非活性切替
        dojo.query('#patternEditAmHalfRests input[type="text"], #patternEditPmHalfRests input[type="text"]').forEach(function(el){
            el.disabled = !flag;
        });
        // 休憩追加ボタンの表示切替
        dojo.query('#patternEditAmHalfRests input[type="button"], #patternEditPmHalfRests input[type="button"]').forEach(function(el){
            dojo.style(el, 'display', (flag ? '' : 'none'));
        });
        // 休憩削除ボタンの表示切替
        dojo.query('#patternEditAmHalfRests div.pp_btn_del, #patternEditPmHalfRests div.pp_btn_del').forEach(function(el){
            dojo.style(el, 'display', (flag ? '' : 'none'));
        });
        // 午前/午後半休時休憩時間のエリアの表示切替
        dojo.style('patternEditAmHalfRests', 'display', (useHalfHolidayRestTime ? '' : 'none'));
        dojo.style('patternEditPmHalfRests', 'display', (useHalfHolidayRestTime ? '' : 'none'));

        // 半休適用時間の所要時間を更新
        updateHalfTime();
    }

    // event: 勤務体系リストを全選択／解除
    function checkAllEmpType(){
        var chk = dojo.byId('patternEditEmpTypeCheck0').checked;
        var tbody = dojo.byId('patternEditEmpTypes').getElementsByTagName('tbody')[0];
        for(var i = 0 ; i < tbody.rows.length ; i++){
            tbody.rows[i].cells[0].firstChild.checked = chk;
        }
    }

    // event: 勤務体系リスト行を選択
    var clickEmpTypeRow = function(node){
        var row = node.parentNode;
        row.cells[0].firstChild.checked = row.cells[0].firstChild.checked ? false : true;
    }

    // logic: 休憩時間の値を得る
    function getRestValue(row){
        var _st = row.cells[0].firstChild.value.trim(); // 開始時刻
        var _et = row.cells[2].firstChild.value.trim(); // 終了時刻
        return { from: (_st == '' ? null : ATK.util.clock2minutes(_st)), to: (_et == '' ? null : ATK.util.clock2minutes(_et)) };
    }

    // logic: 休憩時間が重複してないか確認する。
    function collectRests(domId, flag){
        var rests = [];
        var area = dojo.byId(domId);
        var tbody = dojo.query('table.rest_table tbody', area)[0];
        for(var r = 0 ; r < tbody.rows.length ; r++){
            var rest = getRestValue(tbody.rows[r]);
            if(rest.from == null && rest.to == null){
                continue;
            }
            if(rest.from == null || rest.to == null){
                if(flag){
                    return null;
                }
                continue;
            }
            if(rest.from >= rest.to){
                if(flag){
                    return null;
                }
                continue;
            }
            rests.push(rest);
        }
        return rests;
    }

    // 休憩時間のバリデーションチェック、文字列に変換
    function composeRests(domId, flag, name){
        var rests = collectRests(domId, flag); // 休憩時間を取得
        if(rests == null){
            return {error:true, errmsg: teasp.message.getLabel('tf10009740', name)};// {0}を正しく入力してください
        }
        if(!sortAndCheckDuplicate(rests)){
            return {error:true, errmsg: teasp.message.getLabel('tf10009750', name)};// {0]は時間帯が重複しないように入力してください
        }
        var restStr = '';
        for(r = 0 ; r < rests.length ; r++){
            if(r > 0){
                restStr += ',';
            }
            restStr += (rests[r].from + '-' + rests[r].to);
        }
        return {rests: restStr};
    }

    // logic: 休憩時間のソートと重複してないかチェック
    function sortAndCheckDuplicate(rests){
        rests.sort(function(a, b){
            return a.from - b.from;
        });
        for(var i = 0 ; i < rests.length ; i++){
            var r1 = rests[i];
            for(var j = 0 ; j < rests.length ; j++){
                if(i != j){
                    var r2 = rests[j];
                    if(r1.from <= r2.from && r2.from < r1.to){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // logic: 所定労働時間を更新
    var updateStandardFixTime = function(flag){
        var t = calculateFixTime();
        if(!flag){
            dojo.byId('patternEditStandardFixTime').value = ATK.util.timeValue(t);
        }
        dojo.byId('patternEditCalcWorkTime').innerHTML = teasp.message.getLabel('tk10001093' // （勤務時間 : {0}）
                , (!t || t <= 0 ? teasp.message.getLabel('tm00000107') : ATK.util.timeValue(t))); // －
        updateHalfTime();
    };

    var calculateFixTime = function(){
        var st = ATK.util.clock2minutes(dojo.byId('patternEditStdStartTime').value);
        var et = ATK.util.clock2minutes(dojo.byId('patternEditStdEndTime').value);
        var rsum = ATK.util.rangeTime({ from: st, to: et }, collectRests('patternEditFullRests', false));
        return (et - st - rsum);
    }

    // logic: 所定労働時間を更新
    var updateHalfTime = function(e){
        var ast = ATK.util.clock2minutes(dojo.byId('patternEditAmHolidayStartTime').value);
        var aet = ATK.util.clock2minutes(dojo.byId('patternEditAmHolidayEndTime').value);
        var pst = ATK.util.clock2minutes(dojo.byId('patternEditPmHolidayStartTime').value);
        var pet = ATK.util.clock2minutes(dojo.byId('patternEditPmHolidayEndTime').value);
        var useHalfHolidayRestTime = dojo.query('#patternEditUseHalfHolidayRestTime input[type="checkbox"]')[0].checked; // 半休取得時の休憩時間
        var rests = collectRests('patternEditFullRests', false);
        var ar = ATK.util.rangeTime({ from: ast, to: aet }, useHalfHolidayRestTime ? collectRests('patternEditAmHalfRests', false) : rests);
        var pr = ATK.util.rangeTime({ from: pst, to: pet }, useHalfHolidayRestTime ? collectRests('patternEditPmHalfRests', false) : rests);
        var at = aet - ast - ar;
        var pt = pet - pst - pr;
        dojo.byId('patternEditCalcAmHalf').innerHTML = '(' + (!at || at <= 0 ? teasp.message.getLabel('tm00000107') : ATK.util.timeValue(at)) + ')';
        dojo.byId('patternEditCalcPmHalf').innerHTML = '(' + (!pt || pt <= 0 ? teasp.message.getLabel('tm00000107') : ATK.util.timeValue(pt)) + ')';
    };

    // 「シフト時に勤務時間の延長・短縮を禁止」のチェックボックスをクリック
    function checkedProhibitChangeX(){
        var chk1 = dojo.byId('prohibitChangeWorkTime').checked;
        var chk2 = dojo.byId('prohibitChangeHolidayWorkTime').checked;
        var chk3 = dojo.byId('prohibitChangeExchangedWorkTime').checked;
        var noSync = (chk1 && chk2 && chk3);
        dojo.byId('workTimeChangesWithShift').disabled = noSync;
        dojo.style('workTimeChangesWithShiftLabel', 'color', (noSync ? '#C2BCBC' : '#4A4A56'));
    }

    // 「裁量労働＝採用する」のチェックボックスをクリック
    function checkedUseDiscretionary(){
        var chk = dojo.byId('patternEditUseDiscretionary').checked;
        // オフ・・・シフト時刻と所定勤務時間を連動させる
        // オン・・・シフトした勤務時間と所定勤務時間を連動させる（短縮のみ）
        dojo.byId('workTimeChangesWithShiftLabel').innerHTML = teasp.message.getLabel(chk ? 'tf10004711' : 'tf10004710');
    }

    // logic: エラーメッセージを表示
    var showError = function(msg){
        if(msg){
            tc.selectChild('patternEditPane1'); // 強制で１つめのパネルを選択状態にする
            var node = tc.getChildren()[0].domNode;
            node.scrollTop = node.scrollHeight; // エラーメッセージが見えるようにスクロールする
        }
        dojo.style('patternEditErrorRow', 'display', (msg ? '' : 'none'));
        dojo.byId('patternEditError').innerHTML = (msg ? msg : '');
    };

    // 初期表示
    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;

        attach();

        setDialogPosition(dialog, 190, 170);

        showError(null);

        var row, cell;
        var empTypes = inobj.empTypes;
        var selectedEmpTypeIds = inobj.selectedEmpTypeIds;
        var pattern = inobj.pattern;
        if(!pattern){
            pattern = {
                name                           : '',
                symbol                         : '',
                stdStartTime                   : 540,
                stdEndTime                     : 1080,
                restTimes                      : [{from:720, to:780}],
                useHalfHoliday                 : false,
                amHolidayStartTime             : 540,
                amHolidayEndTime               : 840,
                pmHolidayStartTime             : 840,
                pmHolidayEndTime               : 1080,
                ignoreNightWork                : false,
                useDiscretionary               : false,
                range                          : '1',
                prohibitChangeWorkTime         : false,
                prohibitChangeHolidayWorkTime  : false,
                prohibitChangeExchangedWorkTime: false,
                workTimeChangesWithShift       : false,
                enableRestTimeShift            : true,
                disableCoreTime                : false
            };
        }
        dojo.byId('patternEditName').value = pattern.name;
        dojo.byId('abbreviatedName').value = ((pattern.symbol==null) ? pattern.name.substr(0,1) : pattern.symbol);//2012/08/03/ #1655 勤務パターンに「略称」追加
        dojo.byId('patternEditStdStartTime').value = ATK.util.timeValue(pattern.stdStartTime);
        dojo.byId('patternEditStdEndTime').value   = ATK.util.timeValue(pattern.stdEndTime);

        dojo.query('#patternEditUseHalfHolidayRestTime input[type="checkbox"]')[0].checked = pattern.useHalfHolidayRestTime;
        createRestArea('patternEditFullRests'  , convertRestTime(pattern.restTimes), true);
        createRestArea('patternEditAmHalfRests', convertRestTime(pattern.amHolidayRestTimes), true);
        createRestArea('patternEditPmHalfRests', convertRestTime(pattern.pmHolidayRestTimes), true);

        dojo.byId('patternEditUseHalfHoliday' ).checked     = (pattern.useHalfHoliday || false);
        dojo.byId('patternEditAmHolidayStartTime').value    = ATK.util.timeValue(pattern.amHolidayStartTime);
        dojo.byId('patternEditAmHolidayEndTime'  ).value    = ATK.util.timeValue(pattern.amHolidayEndTime  );
        dojo.byId('patternEditPmHolidayStartTime').value    = ATK.util.timeValue(pattern.pmHolidayStartTime);
        dojo.byId('patternEditPmHolidayEndTime'  ).value    = ATK.util.timeValue(pattern.pmHolidayEndTime  );
        dojo.byId('patternEditIgonreNightWork' ).checked    = (!pattern.igonreNightWork);
        dojo.byId('patternEditUseDiscretionary').checked    = (pattern.useDiscretionary);
        dojo.byId('patternEditPatternRange1').checked       = (pattern.range == '1');
        dojo.byId('patternEditPatternRange2').checked       = (pattern.range == '2');
        dojo.byId('prohibitChangeWorkTime').checked         = (pattern.prohibitChangeWorkTime);
        dojo.byId('prohibitChangeHolidayWorkTime').checked  = (pattern.prohibitChangeHolidayWorkTime);
        dojo.byId('prohibitChangeExchangedWorkTime').checked= (pattern.prohibitChangeExchangedWorkTime);
        dojo.byId('workTimeChangesWithShift').checked       = (pattern.workTimeChangesWithShift);
        dojo.byId('enableRestTimeShift').checked            = (pattern.enableRestTimeShift);
        dojo.byId('patternEditDisableCoreTime').checked     = (pattern.disableCoreTime);

        var t = pattern.standardFixTime;
        if(typeof(t) != 'number'){
            t = calculateFixTime();
        }
        dojo.byId('patternEditStandardFixTime').value       = ATK.util.timeValue(t);

        // 勤務体系の紐づけリストを作成
        tbody = dojo.byId('patternEditEmpTypes').getElementsByTagName('tbody')[0];
        dojo.empty(tbody);
        var n = 0;
        for(var r = 0 ; r < empTypes.length ; r++){
            var et = empTypes[r];
            if(et.removed){
                continue;
            }
            row  = dojo.create('tr', {
                id        : 'patternEditEmpTypeRow' + et.id,
                className : 'sele ' + (((n++)%2)==0 ? 'even' : 'odd')
            }, tbody);
            cell = dojo.create('td', { width: '24px' }, row);
            cell.style.border = 'none';
            inp = dojo.create('input',  {
                type      : 'checkbox',
                id        : 'patternEditEmpTypeCheck' + et.id
            }, cell);
            for(var i = 0 ; i < selectedEmpTypeIds.length ; i++){
                if(selectedEmpTypeIds[i] == et.id){
                    inp.checked = true;
                    break;
                }
            }
            cell = dojo.create('td', {
                width     : '531px',
                onclick   : function(){ clickEmpTypeRow(this); }
            }, row);
            cell.style.textAlign = 'left';
            cell.style.border = 'none';
            div = dojo.create('div',  {
                innerHTML : et.name,
                style     : { wordBreak:"break-all" }
            }, cell);
        }
        dojo.byId('patternEditEmpTypeCheck0').checked = false;

        clickHalfHoliday();
        checkedProhibitChangeX();
        checkedUseDiscretionary();
        updateStandardFixTime(true);

        tc.selectChild('patternEditPane1');

        if(!dojo.byId('patternEditUseHalfHoliday').checked){ // 半日休暇取得可=OFFの時はセクションを閉じる
            dojo.style('patternEditSectionHalfRow', 'display', 'none');
            dojo.toggleClass('patternEditSectionHalf', 'expa_open' , false);
            dojo.toggleClass('patternEditSectionHalf', 'expa_close', true);
        }

        dialog.show();
    };

    // event: 保存
    var saveAndClose = function(){
        var tbody, row, r, t, restStr = '';
        var pattern = (inobj.pattern ? dojo.clone(inobj.pattern) : { id: null });
        pattern.name = dojo.byId('patternEditName').value.trim();
        pattern.symbol = dojo.byId('abbreviatedName').value.trim();//2012/08/03/ #1655 勤務パターンに「略称」追加
        if(pattern.name == ''){
            showError(teasp.message.getLabel('tk10001094')); // 勤務パターン名を入力してください
            return;
        }
        pattern.stdStartTime = ATK.util.clock2minutes(dojo.byId('patternEditStdStartTime').value);
        pattern.stdEndTime   = ATK.util.clock2minutes(dojo.byId('patternEditStdEndTime'  ).value);
        if(pattern.stdStartTime === undefined || pattern.stdEndTime === undefined){
            showError(teasp.message.getLabel('tk10000496')); // '始業終業時刻を入力してください'
            return;
        }
        if(pattern.stdStartTime >= pattern.stdEndTime){
            showError(teasp.message.getLabel('tk10000497')); // 始業終業時刻を正しく入力してください
            return;
        }
        // 休憩時間を取得
        var restF = composeRests('patternEditFullRests', true, teasp.message.getLabel('restTime_label')); // 休憩時間
        if(restF.errmsg){
            showError(restF.errmsg);
            return;
        }
        pattern.restTimes = restF.rests;

        pattern.standardFixTime    =  ATK.util.clock2minutes(dojo.byId('patternEditStandardFixTime'   ).value);
        pattern.useHalfHoliday = dojo.byId('patternEditUseHalfHoliday' ).checked;
        pattern.amHolidayStartTime = ATK.util.clock2minutes(dojo.byId('patternEditAmHolidayStartTime').value);
        pattern.amHolidayEndTime   = ATK.util.clock2minutes(dojo.byId('patternEditAmHolidayEndTime'  ).value);
        pattern.pmHolidayStartTime = ATK.util.clock2minutes(dojo.byId('patternEditPmHolidayStartTime').value);
        pattern.pmHolidayEndTime   = ATK.util.clock2minutes(dojo.byId('patternEditPmHolidayEndTime'  ).value);
        if(pattern.useHalfHoliday
        && (typeof(pattern.amHolidayStartTime) != 'number'
        || typeof(pattern.amHolidayEndTime) != 'number'
        || pattern.amHolidayStartTime >= pattern.amHolidayEndTime)){
            showError(teasp.message.getLabel('tk10001098')); // 午前半休適用時間が不正です
            return;
        }
        if(pattern.useHalfHoliday
        && (typeof(pattern.pmHolidayStartTime) != 'number'
        || typeof(pattern.pmHolidayEndTime) != 'number'
        || pattern.pmHolidayStartTime >= pattern.pmHolidayEndTime)){
            showError(teasp.message.getLabel('tk10001099')); // 午後半休適用時間が不正です
            return;
        }

        // 半休時の休憩時間を取得
        pattern.useHalfHolidayRestTime = dojo.query('#patternEditUseHalfHolidayRestTime input[type="checkbox"]')[0].checked;
        var useHalfRests = pattern.useHalfHoliday && pattern.useHalfHolidayRestTime;
        var restA = composeRests('patternEditAmHalfRests', useHalfRests, teasp.message.getLabel('tf10009720')); // 午前半休時休憩時間
        var restP = composeRests('patternEditPmHalfRests', useHalfRests, teasp.message.getLabel('tf10009730')); // 午後半休時休憩時間
        if(restA.error || restP.error){
            showError(restA.errmsg || restP.errmsg);
            return;
        }
        pattern.amHolidayRestTimes = restA.rests;
        pattern.pmHolidayRestTimes = restP.rests;

        pattern.igonreNightWork = !dojo.byId('patternEditIgonreNightWork' ).checked;
        pattern.useDiscretionary = dojo.byId('patternEditUseDiscretionary' ).checked;
        pattern.range = (dojo.byId('patternEditPatternRange1').checked ? '1' : '2');

        if(typeof(pattern.standardFixTime) != 'number'){
            showError(teasp.message.getLabel('tk10001100')); // 所定労働時間を入力してください
            return;
        }

        var empTypeIds = [];
        tbody = dojo.byId('patternEditEmpTypes').getElementsByTagName('tbody')[0];
        for(r = 0 ; r < tbody.rows.length ; r++){
            row = tbody.rows[r];
            if(/patternEditEmpTypeRow(.+)/.test(row.id)){
                if(row.cells[0].firstChild.checked){
                    empTypeIds.push(RegExp.$1);
                }
            }
        }
        pattern.prohibitChangeWorkTime          = dojo.byId('prohibitChangeWorkTime').checked;
        pattern.prohibitChangeHolidayWorkTime   = dojo.byId('prohibitChangeHolidayWorkTime').checked;
        pattern.prohibitChangeExchangedWorkTime = dojo.byId('prohibitChangeExchangedWorkTime').checked;
        pattern.workTimeChangesWithShift        = dojo.byId('workTimeChangesWithShift').checked;
        pattern.enableRestTimeShift             = dojo.byId('enableRestTimeShift').checked;
        pattern.disableCoreTime                 = dojo.byId('patternEditDisableCoreTime').checked;
        showError(null);

        ATK.dialog.BusyWait.open();
        ATK.ajax.requestSend({
            action     : "savePatternConfig",
            pattern    : pattern,
            empTypeIds : empTypeIds
        }, null, funcAction, recieveFunction, recieveError);
    };

    // event: サーバから正常値受信
    function recieveFunction(o){
        ATK.dialog.BusyWait.close();
        onfinishfunc(o);
        close();
    }

    // event: サーバから異常値受信
    var recieveError = function(o){
        ATK.dialog.BusyWait.close();
        teasp.tsAlert(teasp.message.getLabel('tm00000010', o.error.message));
    };

    // event: キャンセル
    var close = function(){
        dialog.hide();
    };

    return {
        open  : open
    };
};  // ATK.dialog.patternEditDialog

/*
 * 休暇編集ダイアログ
 */
ATK.dialog.holidayEditDialog = function(){
    var attached = false;

    /**
     * 【open()実行時のinobj内容の補足事項】
     * selectedEmpTypeIds は、[]あり。
     * holiday は、nullあり。
     * referenced は、false固定あり。
     * 
     * 【処理中で追加するinobjの項目】
     * argHolidayManageGroupIdは、HolidayGroupAssignDialogとのI/Oに使用。openHolidayGroupAssignDialog()で追加。
     * argHolidaySummaryGroupIdは、HolidayGroupAssignDialogとのI/Oに使用。openHolidayGroupAssignDialog()で追加。
     * @type {{
     *   empTypes           : empTypes,
     *   selectedEmpTypeIds : selectedEmpTypeIds,
     *   holiday            : holiday,
     *   holidays           : inobj.holidays,
     *   holidayGroups      : inobj.holidayGroups,
     *   referenced         : inobj.referenced,
     *   leaveManagementVersion : inobj.leaveManagementVersion,
     *   configAction       : inobj.configAction,
     *   commonConfig       : inobj.commonConfig,
     *   argHolidayManageGroupId  : string,
     *   argHolidaySummaryGroupId  : string
     * }}
     */
    var inobj;

    var onfinishfunc;
    var dialog;
    var tc;
    var orgHoliday;
    var savedHolidayYuqSpend;
    var holidayGroupAssignDialog = null; // 休暇グループ割当ダイアログ
    var holdHolidayEditType;  // 休暇種類設定のonChangeに伴う画面制御で、onChange前の値に戻すときに使用する
    var commonConfig;
    
    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10001101'), // 休暇編集
            duration : 300
        });

        dialog.attr('content',
              '<div style="width:580px;height:570px;" id="holidayEditDialogBase">'
            + '  <div id="holidayEditContainer"></div>'
            + '  <table border="0" cellpadding="0" cellspacing="0" style="width:100%;margin-top:8px;">'
            + '  <tr>'
            + '    <td style="width:100%;text-align:center;">'
            + '      <input type="button" class="pb_base pb_btn_regist" id="holidayEditOk">'
            + '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '      <input type="button" class="pb_base pb_btn_cancel" id="holidayEditCancel">'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '</div>');

        tc = new dijit.layout.TabContainer({
            style: { height:"530px", width:"100%" }
        },
        "holidayEditContainer");

        var cp1 = new dijit.layout.ContentPane({
            id   : 'holidayEditPane1',
            title: teasp.message.getLabel('setting_btn_title'), // 設定
            content: '<div style="padding:4px;">'
            + '  <table class="ts_a_frame" style="width:100%;">'
            + '  <tr>'
            + '    <td class="edgelt"></td>'
            + '    <td class="edgeht"></td>'
            + '    <td class="edgert"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgevl"></td>'
            + '    <td>'
            + '      <div class="edge_div">'
            + '        <table class="stand_table">'
            + '        <tr>'
            + '          <td class="left_m csize">'
            + '            <div id="holidayEditNameLabel">' + teasp.message.getLabel('tk10000582') + '</div>' // 休暇名
            + '          </td>'
            + '          <td class="right">'
            + '            <input type="text" id="holidayEditName" value="" maxlength="80" class="inputran inputtex" style="width:200px;"/>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left_m csize top_line">'
            + '            <div id="holidayEditTypeLabel">' + teasp.message.getLabel('tk10001027') + '</div>' // 種類
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <select id="holidayEditType">'
            + '              <option value="1">' + teasp.message.getLabel('holidayYuq_label') + '</option>' // 有給
            + '              <option value="2">' + teasp.message.getLabel('tm10010540')       + '</option>' // 無給
            + '              <option value="3">' + teasp.message.getLabel('tm10010550')       + '</option>' // 代休
            + '            </select>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left_m csize">'
            + '            <div id="holidayEditRangeLabel">' + teasp.message.getLabel('tk10001028') + '</div>' // 範囲
            + '          </td>'
            + '          <td class="right">'
            + '            <select id="holidayEditRange">'
            + '              <option value="1">' + teasp.message.getLabel('holidayDay_label') + '</option>' // 終日休
            + '              <option value="2">' + teasp.message.getLabel('holidayAm_label')  + '</option>' // 午前半休
            + '              <option value="3">' + teasp.message.getLabel('holidayPm_label')  + '</option>' // 午後半休
            + '              <option value="4">' + teasp.message.getLabel('tm10010560')       + '</option>' // 時間単位休
            + '            </select>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left_m csize top_line">'
            + '            <div id="holidayEditSymbolLabel">' + teasp.message.getLabel('tk10001089') + '</div>' // 略称
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <input type="text" id="holidayEditSymbol" value="" maxlength="3" class="inputran inputtex" style="width:45px;"/>'
            + '          </td>'
            + '        </tr>'
            + '        <tr id="holidayEditYuqSpendRow">'
            + '          <td class="left_m csize top_line">'
            + '            <div id="holidayEditYuqSpendLabel">' + teasp.message.getLabel('holidayYuqSpend_label') + '</div>' // 有休消化
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <label><input type="checkbox" id="holidayEditYuqSpend" /> ' + teasp.message.getLabel('tm10010590') + '</label>' // する
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left_m csize" id="holidayEditIsWorkingLabelTd">'
            + '            <div id="holidayEditIsWorkingLabel">' + teasp.message.getLabel('tk10001031') + '</div>' // 出勤率判定
            + '          </td>'
            + '          <td class="right" id="holidayEditIsWorkingTd">'
            + '            <label><input type="checkbox" id="holidayEditIsWorking" /> ' + teasp.message.getLabel('tm10010610') + '</label>' // 加味する
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left_m csize">'
            + '            <div id="holidayEditDaysOnCalLabel">' + teasp.message.getLabel('tk10003720') + '</div>' // 暦日表示
            + '          </td>'
            + '          <td class="right">'
            + '            <label><input type="checkbox" id="holidayEditDaysOnCal" /> ' + teasp.message.getLabel('tm10010590') + '</label>' // する
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left_m csize">'
            + '            <div id="holidayEditOverNightLabel">' + teasp.message.getLabel('tf10008320') + '</div>' // 前日の勤務
            + '          </td>'
            + '          <td class="right">'
            + '            <label><input type="checkbox" id="holidayEditOverNight" /> ' + teasp.message.getLabel('tf10008330') + '</label>' // 24時を超える勤務を禁止する
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left_m csize">'
            + '            <div id="holidayEditTimeUnitLabel">' + teasp.message.getLabel('th00000020') + '</div>' // 休憩時間の制限
            + '          </td>'
            + '          <td class="right">'
            + '            <label><input type="checkbox" id="holidayEditTimeUnitUse" /> ' + teasp.message.getLabel('th00000030') + '</label>' // 制限する
            + '            <span style="margin-left:8px;">' + teasp.message.getLabel('th00000070') + '</span>' // 単位の休暇時間のみ許可する(英文用)
            + '            <select id="holidayEditTimeUnit">'
//            + '              <option value="30">' + teasp.message.getLabel('th00000040') + '</option>' //【TODO】30分単位用
            + '              <option selected value="60">' + teasp.message.getLabel('th00000050') + '</option>' // 1時間
            + '            </select>'
            + '            <span style="margin-right:8px;">' + teasp.message.getLabel('th00000060') + '</span>' // 単位の休暇時間のみ許可する
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left_m csize top_line">'
            + '            <div id="holidayEditManagedLabel">' + teasp.message.getLabel('tk10001085') + '</div>' // 日数管理
            + '          </td>'
            + '          <td class="right top_line">'
            + '            <label><input type="checkbox" id="holidayEditManaged" /> ' + teasp.message.getLabel('tk10001103') + '</label>' // 管理をする
            + '          </td>'
            + '        </tr>'
            + '        <tr id="holidayManageGroupRow">'
            + '          <td class="left_m csize">'
            + '            <div id="holidayManageGroupLabel">' + teasp.message.getLabel('hg00000310') + '</div>' // 日数管理グループ
            + '          </td>'
            + '          <td class="right" style="position:relative;">'
            + '            <span id="holidayManageGroupId" style="display:none"></span>'  // 画面上の内容をsaveするため、画面上に紐づいた休暇グループを保持する。
            + '            <div id="holidayManageGroupDisp" style="width:300px"></div>'
            + '            <div style="position:absolute;right:8px;top:-4px;" class="ts-style">'
            + '              <button id="holidayManageGroupSelect">' + teasp.message.getLabel('hg00000320') + '</button>'      //選択　ボタン
            + '            </div>'
            + '          </td>'
            + '        </tr>'
            + '        <tr id="holidaySummaryGroupRow">'
            + '          <td class="left_m csize top_line" style="padding:6px 12px">'
            + '            <div id="holidaySummaryGroupLabel">' + teasp.message.getLabel('hg00000090') + '</div>' // 集計グループ
            + '          </td>'
            + '          <td class="right top_line" style="position:relative;">'
            + '            <span id="holidaySummaryGroupId" style="display:none"></span>'  // 画面上の内容をsaveするため、画面上に紐づいた休暇グループを保持する。
            + '            <div id="holidaySummaryGroupDisp" style="width:300px"></div>'
            + '            <div style="position:absolute;right:8px;top:1px;" class="ts-style">'
            + '              <button id="holidaySummaryGroupSelect">' + teasp.message.getLabel('hg00000320') + '</button>'      //選択　ボタン
            + '            </div>'
            + '          </td>'
            + '        </tr>'
            + '        <tr id="holidayEditManageNameRow">'
            + '          <td class="left_m csize">'
            + '            <div id="holidayEditManageNameAreaLabel">' + teasp.message.getLabel('tk10001104') + '</div>' // 管理名
            + '          </td>'
            + '          <td class="right" id="holidayEditManageNameArea">'
            + '          </td>'
            + '        </tr>'
            + '        <tr id="holidayEditSummaryDataRow">'
            + '          <td class="left_m csize top_line" id="holidayEditSummaryDataL">'
            + '            <div id="holidayEditSummaryNameLabel">' + teasp.message.getLabel('tk10003820') + '</div>' // 大分類
            + '          </td>'
            + '          <td class="right top_line" id="holidayEditSummaryDataR">'
            + '            <div id="holidayEditSummaryDiv" style="margin-bottom:4px;"><select id="holidayEditSummaryName"></select></div>'
            + '            <div id="holidayEditNumberDiv">'
            + '                <span style="margin-right:8px;">' + teasp.message.getLabel('tk10003880') + '</span>' // 連携時の休暇番号
            + '                <input type="text" value="" id="holidayEditNumber" maxLength="3" size="3" style="text-align:center;" class="inputran" />'
            + '            </div>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td colspan="2" class="top_line">'
            + '            <div id="holidayEditDescriptionLabel" style="margin-top:4px;float:left;font-weight:bold;padding:3px 12px;color:#4A4A56;">' + teasp.message.getLabel('tm20004650') + '</div>' // 説明
            + '            <div style="float:left;">'
            + '              <textarea id="holidayEditDescription" class="inputran" style="width:450px;height:60px;margin:8px 0px 4px 8px;font-family:\'ＭＳ ゴシック\',monospace;padding:2px;" onKeyUp="ATK.util.limitChars(this,32000,\''
            + teasp.message.getLabel('tm00000020', teasp.message.getLabel('tm20004650'), '32000')
            + '\');"></textarea>'
            + '            </div><div style="clear:both;"></div>'
            + '          </td>'
            + '        </tr>'
            + '        </table>'
            + '      </div>'
            + '    </td>'
            + '    <td class="edgevr"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgelb"></td>'
            + '    <td class="edgehb"></td>'
            + '    <td class="edgerb"></td>'
            + '  </tr>'
            + '  <tr id="holidayEditErrorRow" style="display:none;">'
            + '    <td colspan="3" style="text-align:center;padding:0px;">'
            + '      <div id="holidayEditError" style="color:red;margin-top:4px;margin-bottom:0px;"></div>'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '</div>'
        });
        tc.addChild(cp1);

        var cp2 = new dijit.layout.ContentPane({
            id   : 'holidayEditPane2',
            title: teasp.message.getLabel('tk10001090'), // 割り当て
            content: '<div style="padding:10px;">'
            + '<table class="pane_table" style="width:100%;">'
            + '<tr>'
            + '  <td style="text-align:center;padding:4px 20px 10px 20px;">'
            + teasp.message.getLabel('tk10001107') // この休暇を選択することができる勤務体系をチェックしてください。
            + '  </td>'
            + '</tr>'
            + '<tr>'
            + '  <td style="text-align:center;padding-left:15px;padding-right:15px;">'
            + '    <table class="stone_area" style="width:494px;">'
            + '    <tr>'
            + '      <td>'
            + '        <table class="stone_table">'
            + '        <tr>'
            + '          <td class="head" style="width:24px;"><input type="checkbox" id="holidayEditEmpTypeCheck0" /></td>'
            + '          <td class="head" style="width:470px;"><div>' + teasp.message.getLabel('tk10001092') + '</div></td>' // 勤務体系名
            + '        </tr>'
            + '        </table>'
            + '        <div class="stone_div" style="height:260px;">'
            + '        <table class="stone_table" id="holidayEditEmpTypes">'
            + '        <tbody>'
            + '        </tbody>'
            + '        </table>'
            + '        </div>'
            + '      </td>'
            + '    </tr>'
            + '    </table>'
            + '  </td>'
            + '</tr>'
            + '</table>'
            + '</div>'
        });
        tc.addChild(cp2);

        dojo.byId('holidayEditOk').onclick = saveAndClose;
        dojo.byId('holidayEditCancel').onclick = close;
        dojo.byId('holidayEditType').onchange = changedHolidayType;
        dojo.byId('holidayEditRange').onchange = changedHolidayRange;
        dojo.byId('holidayEditManaged').onclick = changedHolidayEditManaged;
        dojo.byId('holidayEditEmpTypeCheck0').onclick = checkAllEmpType;
        dojo.byId('holidayEditTimeUnitUse').onclick = changedTimeUnitUse;
        dojo.byId('holidayManageGroupSelect').onclick = openHolidayGroupAssignDialogForManageGroupId;
        dojo.byId('holidaySummaryGroupSelect').onclick = openHolidayGroupAssignDialogForSummaryGroupId;

        dojo.connect(dojo.byId('holidayEditName'), 'onblur', changedHolidayName);
        dojo.connect(dojo.byId('holidayEditName'), 'onkeypress', function(e){
            if (e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
                changedHolidayName();
                e.preventDefault();
                e.stopPropagation();
            }
        });

        dojo.connect(dojo.byId('holidayEditDaysOnCal'), 'onclick', changedOption);

        teasp.util.insertHelpIcon('holidayEditRange');      // 範囲
        teasp.util.insertHelpIcon('holidayEditDaysOnCal');  // 暦日表示
        teasp.util.insertHelpIcon('holidayEditManaged');    // 日数管理
        teasp.util.insertHelpIcon('holidayEditTimeUnit');   // 休暇時間の制限

        dialog.startup();
    };

    // event: 勤務体系リストを全選択／解除
    function checkAllEmpType(){
        var chk = dojo.byId('holidayEditEmpTypeCheck0').checked;
        var tbody = dojo.byId('holidayEditEmpTypes').getElementsByTagName('tbody')[0];
        for(var i = 0 ; i < tbody.rows.length ; i++){
            tbody.rows[i].cells[0].firstChild.checked = chk;
        }
    }

    // event: 勤務体系リスト行を選択
    var clickEmpTypeRow = function(node){
        var row = node.parentNode;
        row.cells[0].firstChild.checked = row.cells[0].firstChild.checked ? false : true;
    }

    // logic: エラーメッセージを表示
    var showError = function(msg){
        if(msg){
            tc.selectChild('holidayEditPane1'); // 強制で１つめのパネルを選択状態にする
        }
        dojo.style('holidayEditErrorRow', 'display', (msg ? '' : 'none'));
        dojo.byId('holidayEditError').innerHTML = (msg ? msg : '');
    };

    /**
     * 初期表示
     * @param {Object} _inobj オブジェクト。渡されるオブジェクトに含まれるプロパティは、holidayEditDialog.open()を呼び出している個所を参照。
     * @param {function} _onfinishfunc function。open()処理実行後に実行するコールバック関数。
     */
    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        savedHolidayYuqSpend = inobj.holiday && inobj.holiday.yuqSpend || null;
        commonConfig = (inobj.commonConfig && teasp.decode(inobj.commonConfig, 1)) || {};

        attach();

        setDialogPosition(dialog, 190, 170);

        showError(null);

        
        var empTypes = inobj.empTypes;
        var selectedEmpTypeIds = inobj.selectedEmpTypeIds;
        var holiday = inobj.holiday;
        if(!holiday){
            holiday = {
                name               : '',
                type               : '1',
                range              : '1',
                yuqSpend           : true,
                isWorking          : true,
                managed            : false,
                manageName         : null,
                description        : '',
                timeUnit           : null,
                manageGroupId      : '',
                summaryGroupId     : ''
            }
        }
        orgHoliday = dojo.clone(holiday);

        // 新方式用
        // 対象の勤怠休暇の日数管理グループを休暇グループ一覧と突き合せて、
        // 代休(Type__c='S'と紐づいているときは、「選択」ボタンを活性／非活性処理をする。
        var isAssignedTypeS = isThisHolidayGroupTypeS(holiday.manageGroupId);

        // 休暇名
        dojo.byId('holidayEditName').value = holiday.name;
        
        // 種類
        dojo.byId('holidayEditType').value = holiday.type;        
        
        // 範囲
        dojo.byId('holidayEditRange').value = holiday.range;

        // 略称
        dojo.byId('holidayEditSymbol').value = (holiday.symbol ? holiday.symbol : (holiday.name ? holiday.name.substr(0,1) : ''));

        // 有休消化ボタン
        dojo.byId('holidayEditYuqSpend').checked      = holiday.yuqSpend;
        dojo.style('holidayEditYuqSpendRow',  'display', (inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 ? 'none' : 'table-row') );    // 新方式に伴い活性／非活性を調整

        // 出勤率判定
        dojo.addClass('holidayEditIsWorkingLabelTd',(inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 ? 'top_line' : ''));   //新方式の場合は、top_lineを追加する
        dojo.addClass('holidayEditIsWorkingTd',(inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 ? 'top_line' : ''));   //新方式の場合は、top_lineを追加する
        dojo.byId('holidayEditIsWorking').checked     = holiday.isWorking;
        
        // 日数管理
        if( inobj.leaveManagementVersion != teasp.constant.LEAVEMANAGE_VER2 ){
            // 旧方式
            dojo.byId('holidayEditManaged').checked       = holiday.managed;
        }else{
            // 新方式
            if(holiday.manageGroupId){
                dojo.byId('holidayEditManaged').checked = true;
            }else{
                dojo.byId('holidayEditManaged').checked = false;
            }
        }

        // 暦日表示
        dojo.byId('holidayEditDaysOnCal').checked     = holiday.displayDaysOnCalendar;

        // 管理名
        if (holiday.manageName) {
            dojo.byId('holidayEditManageNameArea').innerHTML = '<label id="holidayEditManageNameLabel">' + (holiday.manageName || '') + '</label>';
        } else {
            dojo.byId('holidayEditManageNameArea').innerHTML = '<input type="text" id="holidayEditManageName" value="" maxlength="80" class="inputran inputtex" style="width:200px;"/>'
                + '<br/><div style="margin-top:2px;font-size:0.9em;">'
                + teasp.message.getLabel('tk10001108') // ※注：管理名は設定すると後で変更できません
                + '</div>';
            dojo.byId('holidayEditManageName').value = (holiday.manageName || '');
        }

        // 説明
        dojo.byId('holidayEditDescription').value = (holiday.description || '');

        // 管理名(行)
        dojo.style('holidayEditManageNameRow', 'display', (inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 ? 'none' : 'table-row'));

        // 大分類(行)
        dojo.style('holidayEditSummaryDataRow', 'display', (inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 ? 'none' : 'table-row'));


        // 連携時の休暇番号
        if( inobj.leaveManagementVersion != teasp.constant.LEAVEMANAGE_VER2 ){
            // 旧方式
            dojo.style('holidayEditNumberDiv','display', '' );
        }else{
            // 新方式
            if( commonConfig.showHolidayLinkNumber ){
                dojo.style('holidayEditNumberDiv','display', '' );
            }else{
                dojo.style('holidayEditNumberDiv','display', 'none' );
            }
        }
        dojo.byId('holidayEditNumber').value = (holiday.linkNumber || '');

        // 大分類
        var hlst = (inobj.holidays || []);
        var lst = [];
        for(var i = 0 ; i < hlst.length ; i++){
            var h = hlst[i];
            if(holiday.id == h.id){
                continue;
            }
            if(!lst.contains(h.name) && (h.isSummaryRoot || !h.summaryName)){
                lst.push(h.name);
            }
        }
        var select = dojo.byId('holidayEditSummaryName');
        while(select.firstChild){
            dojo.destroy(select.firstChild);
        }
        dojo.create('option', { value: '-1', innerHTML: teasp.message.getLabel('tk10003890') }, select); // (この休暇を大分類に設定する)
        dojo.create('option', { value: '-' , innerHTML: teasp.message.getLabel('tk10003900') }, select); // ----------------------------
        var v = '-1';
        for(i = 0 ; i < lst.length ; i++){
            dojo.create('option', { value: lst[i], innerHTML: lst[i] }, select);
            if(!holiday.isSummaryRoot && lst[i] == holiday.summaryName){
                v = lst[i];
            }
        }
        if(holiday.isSummaryRoot){
            select.value = '-1';
        }else{
            select.value = v;
        }
        // 新方式では、大分類を非表示にして、集計グループへの差し替える
        if( inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 ){
            dojo.style('holidayEditSummaryDiv', 'display', 'none');
            dojo.byId('holidayEditSummaryNameLabel').innerHTML = '';
            dojo.removeClass('holidayEditSummaryDataL', 'top_line');
            dojo.removeClass('holidayEditSummaryDataR', 'top_line');
        }

        // 前日の勤務　24時を超える勤務を禁止する
        holiday.config = (holiday.config && typeof(holiday.config) == 'string' ? dojo.fromJson(holiday.config) : holiday.config) || {};
        dojo.byId('holidayEditOverNight').checked = holiday.config.prohibitOverNightWork || false;

        // 休暇時間の制限
        if(!holiday.timeUnit){
            dojo.byId('holidayEditTimeUnitUse').checked = false;
        }else{
            dojo.byId('holidayEditTimeUnitUse').checked = true;
            dojo.byId('holidayEditTimeUnit').value = holiday.timeUnit;
        }

        // 日数管理グループ
        dojo.style('holidayManageGroupRow',  'display', (inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 ? 'table-row':'none') );    // 新方式に伴い活性／非活性を調整
        setHolidayManageGroup( holiday.manageGroupId );  // 集計グループ項目の表示を調整。ID部分と名称。        

        // 集計グループ
        dojo.style('holidaySummaryGroupRow',  'display', (inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 ? 'table-row':'none') );    // 新方式に伴い活性／非活性を調整
        dojo.attr('holidaySummaryGroupSelect', 'disabled', isAssignedTypeS ); // ボタンの活性/非活性
        setHolidaySummaryGroup( holiday.summaryGroupId );  // 集計グループ項目の表示を調整。ID部分と名称。        
        
        // 勤務体系の紐づけリストを作成
        tbody = dojo.byId('holidayEditEmpTypes').getElementsByTagName('tbody')[0];
        while(tbody.firstChild){
            dojo.destroy(tbody.firstChild);
        }
        var row, cell, n = 0;
        for(var r = 0 ; r < empTypes.length ; r++){
            var et = empTypes[r];
            if(et.removed){
                continue;
            }
            row  = dojo.create('tr', {
                id        : 'holidayEditEmpTypeRow' + et.id,
                className : 'sele ' + (((n++)%2)==0 ? 'even' : 'odd')
            }, tbody);
            cell = dojo.create('td', { width: '24px' }, row);
            cell.style.border = 'none';
            inp = dojo.create('input',  {
                type      : 'checkbox',
                id        : 'holidayEditEmpTypeCheck' + et.id
            }, cell);
            for(var i = 0 ; i < selectedEmpTypeIds.length ; i++){
                if(selectedEmpTypeIds[i] == et.id){
                    inp.checked = true;
                    break;
                }
            }
            cell = dojo.create('td', {
                width     : '451px',
                onclick   : function(){ clickEmpTypeRow(this); }
            }, row);
            cell.style.textAlign = 'left';
            cell.style.border = 'none';
            div = dojo.create('div',  {
                innerHTML : et.name,
                style     : { wordBreak:"break-all" }
            }, cell);
        }
        dojo.byId('holidayEditEmpTypeCheck0').checked = false;

        tc.selectChild('holidayEditPane1');

        changedOption();

        updateHoldHolidayEditType();

        dialog.show();
    };

    /**
     * ビューモデルと画面状態が一致しないときに、一致させる。
     */
    var changedOption = function(){

        var rang = dojo.byId('holidayEditRange').value;     // 範囲（終日休、午前半休、午後半休、時間単位休）
        var type = dojo.byId('holidayEditType').value;      // 種類（有給、無給、代休）
        var mand = dojo.byId('holidayEditManaged').checked; // 日数管理
        var isAssignedTypeS = (type == teasp.constant.HOLIDAY_TYPE_DAIQ);  // 新方式用 代休参照判定
        
        // 休暇種類
        // 日数管理
        // 暦日表示
        // 休暇当日は前日の延長勤務を許さない
        if(rang == teasp.constant.RANGE_TIME){ // 時間単位休
            dojo.byId('holidayEditType').value = type;          // 休暇種類は「有給」固定
            dojo.byId('holidayEditDaysOnCal').checked = false;  // 暦日表示はオフ固定
        }else if(type == teasp.constant.HOLIDAY_TYPE_DAIQ){ // 代休
            mand = false;
            dojo.byId('holidayEditManaged'  ).checked = false;  // 日数管理はオフ固定
            dojo.byId('holidayEditDaysOnCal').checked = false;  // 暦日表示はオフ固定
        }
        if(rang != teasp.constant.RANGE_ALL){ // 終日休以外
            dojo.byId('holidayEditOverNight').checked = false;  // 休暇当日は前日の延長勤務を許さないはオフ固定
        }
        dojo.byId('holidayEditType').disabled = (inobj.referenced && (inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2));          // 休暇種類
        dojo.byId('holidayEditManaged'  ).disabled = (type == teasp.constant.HOLIDAY_TYPE_DAIQ) || (inobj.referenced && (inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2));                 // 日数管理
        dojo.byId('holidayEditDaysOnCal').disabled = (rang != teasp.constant.RANGE_ALL || type == teasp.constant.HOLIDAY_TYPE_DAIQ) || (inobj.referenced && (inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2));  // 暦日表示
        dojo.byId('holidayEditOverNight').disabled = (rang != teasp.constant.RANGE_ALL);  // 休暇当日は前日の延長勤務を許さない

        if( inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 && isAssignedTypeS ){
            // 新方式で代休の時は、チェックボックスを見かけだけONにする。
            dojo.byId('holidayEditManaged').checked=true;
        }

        // 日数管理グループ
        if(isAssignedTypeS || inobj.referenced){
            // 代休と紐付いているときは、日数管理チェックボックス値に関わらず無効表示
            // また、休暇申請から参照されているときも無効表示
            dojo.attr('holidayManageGroupSelect', 'disabled', true ); // ボタンの活性/非活性
        }else{
            // 代休と紐づいていないときは、日数管理チェックボックス値に沿って、有効/無効表示
            if(mand){
                dojo.attr('holidayManageGroupSelect', 'disabled', false ); // ボタンの活性/非活性
            }else{
                dojo.attr('holidayManageGroupSelect', 'disabled', true ); // ボタンの活性/非活性
            }
        }
        dojo.style('holidayManageGroupRow',  'display', (inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 ? 'table-row':'none') );    // 新方式に伴い活性／非活性を調整
        setHolidayManageGroup( dojo.byId('holidayManageGroupId').innerHTML );  // 日数管理グループ項目の表示を調整。ID部分と名称。

        // 集計グループ
        if(isAssignedTypeS){
            dojo.attr('holidaySummaryGroupSelect', 'disabled', true ); // ボタンの活性/非活性
        }else{
            dojo.attr('holidaySummaryGroupSelect', 'disabled', false ); // ボタンの活性/非活性
        }
        dojo.style('holidaySummaryGroupRow',  'display', (inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 ? 'table-row':'none') );    // 新方式に伴い活性／非活性を調整
        setHolidaySummaryGroup( dojo.byId('holidaySummaryGroupId').innerHTML );  // 集計グループ項目の表示を調整。ID部分と名称。

        if (dojo.byId('holidayEditManageName')) {
            dojo.byId('holidayEditManageName').disabled = (type == teasp.constant.HOLIDAY_TYPE_DAIQ || !mand); // 管理名を非活性化
        }

        // 範囲
        if(dojo.byId('holidayEditDaysOnCal').checked){
            // 暦日表示がオンの時
            dojo.byId('holidayEditRange').value = teasp.constant.RANGE_ALL;          // 範囲を「終日休」固定
            dojo.byId('holidayEditRange').disabled = true;      // 範囲を非活性化
        }else{
            dojo.byId('holidayEditRange').disabled = false;     // 範囲を活性化
        }
        if( inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 && inobj.referenced){  // 休暇申請から申請あり時は編集不可
            dojo.byId('holidayEditRange').disabled = true;
        }

        // 有休消化
        if(type != teasp.constant.HOLIDAY_TYPE_PAID || mand || dojo.byId('holidayEditDaysOnCal').checked){
            dojo.byId('holidayEditYuqSpend').checked = false;   // 有休消化はオフ固定
            dojo.byId('holidayEditYuqSpend').disabled = true;   // 有休消化を非活性化
        }else{
            // 有休 かつ 日数管理OFF かつ 暦日表示OFF
            if(inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2){
                // 新方式
                dojo.byId('holidayEditYuqSpend').checked = true;   // 有休消化はオン固定
                dojo.byId('holidayEditYuqSpend').disabled = false;  // 有休消化を活性化
            }else{
                // 旧方式
                dojo.byId('holidayEditYuqSpend').disabled = false;  // 有休消化を活性化
            }
        }

        // 休暇時間の制限
        changedTimeUnitUse();
    };

    /**
     * 画面編集前の休暇種類を控えます。
     */
    var updateHoldHolidayEditType = function(){
        holdHolidayEditType = dojo.byId('holidayEditType').value;
    }
    /**
     * 現在控えている休暇種類を返します。
     * @returns {string} 休暇種類の選択項目の追番(1,2,3)
     */
    var getHoldHolidayEditType = function(){
        return holdHolidayEditType;
    }

    /**
     * 年次有給休暇グループ(Type=A)を取得する
     * @returns {ATK.obj.HolidayGroup} 代休の休暇グループまたはnull
     */
     var getHolidayGroupTypeA = function(){
        var ret = null;
        for(i=0; i<inobj.holidayGroups.length; i++ ){
            if(inobj.holidayGroups[i].getType() == ATK.obj.HolidayGroup.A_TYPE){
                return inobj.holidayGroups[i];
            }
        }
        return ret;
    }

    /**
     * 代休休暇グループ(Type=S)を取得する。
     * @returns {ATK.obj.HolidayGroup} 代休の休暇グループまたはnull
     */
    var getHolidayGroupTypeS = function(){
        var ret = null;
        for(i=0; i<inobj.holidayGroups.length; i++ ){
            if(inobj.holidayGroups[i].getType() == ATK.obj.HolidayGroup.S_TYPE){
                return inobj.holidayGroups[i];
            }
        }
        return ret;
    }

    /**
     * 休暇グループリストから、ID指定で取得する。
     * @param {string} holidayGroupId 休暇グループID
     * @returns {ATK.obj.HolidayGroup} 代休の休暇グループまたはnull
     */
    var getHolidayGroup = function(holidayGroupId){
        var ret = null;
        for(i=0; i<inobj.holidayGroups.length; i++ ){
            if(inobj.holidayGroups[i].getId() == holidayGroupId ){
                return inobj.holidayGroups[i];
            }
        }
        return ret;
    }
    

    /**
     * 検査対象の休暇グループが、代休休暇グループかどうかを返す。
     * @param {string} holidayGroupId 検査対象の休暇グループID
     * @returns {boolean} true:代休の休暇グループ、false:代休以外の休暇グループ
     */
    var isThisHolidayGroupTypeS = function(holidayGroupId){
        var ret = false;
        for(i=0; i<inobj.holidayGroups.length; i++ ){
            if(  inobj.holidayGroups[i].getId() == holidayGroupId
            && inobj.holidayGroups[i].getType() == ATK.obj.HolidayGroup.S_TYPE){
                return true;
            }
        }
        return ret;
    }

    /**
     * 日数管理グループ項目の表示を調整
     * 画面上の内容をsaveするため、画面上に紐づいた休暇グループを保持する。
     * @param {string} holidayManageGroupId 表示する日数管理グループID
     */
    var setHolidayManageGroup = function( holidayManageGroupId ){
        var isMissing = true;
        for(i = 0 ; i<inobj.holidayGroups.length ; i++){
            if(inobj.holidayGroups[i].getId() == holidayManageGroupId){
                dojo.byId('holidayManageGroupId').innerHTML = inobj.holidayGroups[i].getId();
                dojo.byId('holidayManageGroupDisp').innerHTML = inobj.holidayGroups[i].getName();
                isMissing=false;
                break;
            }
        }
        if(isMissing){
            dojo.byId('holidayManageGroupId').innerHTML = '';
            dojo.byId('holidayManageGroupDisp').innerHTML = teasp.message.getLabel('hg00000330');  // 未設定
        }
    }

    /**
     * 集計グループ項目の表示を調整
     * 画面上の内容をsaveするため、画面上に紐づいた休暇グループを保持する。
     * @param {string} holidaySummaryGroupId 表示する集計グループID
     */
    var setHolidaySummaryGroup = function( holidaySummaryGroupId ){
        var isMissing = true;
        for(i = 0 ; i<inobj.holidayGroups.length ; i++){
            if(inobj.holidayGroups[i].getId() == holidaySummaryGroupId){
                dojo.byId('holidaySummaryGroupId').innerHTML = inobj.holidayGroups[i].getId();
                dojo.byId('holidaySummaryGroupDisp').innerHTML = inobj.holidayGroups[i].getName();
                isMissing=false;
                break;
            }
        }
        if(isMissing){
            dojo.byId('holidaySummaryGroupId').innerHTML = '';
            dojo.byId('holidaySummaryGroupDisp').innerHTML = teasp.message.getLabel('hg00000330');  // 未設定
        }
    }

    // event: 休暇種類の選択を変更、「代休」選択の場合は強制的に日付範囲を「しない」固定にする
    var changedHolidayType = function(){
        changedOption();
        
        if(inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 && dojo.byId('holidayEditType').value == teasp.constant.HOLIDAY_TYPE_DAIQ){
            // 新方式で代休を選択しているときは、制御する。
            if( dojo.byId('holidayManageGroupId').innerHTML ==''
            &&dojo.byId('holidaySummaryGroupId').innerHTML == ''){
                // 日数管理グループ・集計グループ両方とも未設定の場合
                setHolidayManageGroup(getHolidayGroupTypeS().getId());
                setHolidaySummaryGroup(getHolidayGroupTypeS().getId());
            }else if( dojo.byId('holidayManageGroupId').innerHTML == getHolidayGroupTypeS().getId()
            &&dojo.byId('holidaySummaryGroupId').innerHTML == getHolidayGroupTypeS().getId() ){
                // 日数管理グループ・集計グループ両方とも代休の場合
                // 処理なし
            }else{
                var before = getHoldHolidayEditType();
                teasp.tsConfirmA(teasp.message.getLabel('hg00000370', getHolidayGroupTypeS().getName() ), this,  //種類が代休の休暇は、日数管理グループと集計グループは「{0}」に固定されます。変更してよろしいですか？
                dojo.hitch(this,function(){  // OK
                    setHolidayManageGroup(getHolidayGroupTypeS().getId());
                    setHolidaySummaryGroup(getHolidayGroupTypeS().getId());    
                    changedOption();
                }), 
                dojo.hitch(this,function(){  //キャンセル
                    dojo.byId('holidayEditType').value = before;  //キャンセルのときは、変更前の値にする。
                    changedOption();
                    updateHoldHolidayEditType();
                })
                );
            }
        }else if(getHoldHolidayEditType() == teasp.constant.HOLIDAY_TYPE_DAIQ){ 
            // 代休 → その他の種類の場合は未設定にする        
            setHolidayManageGroup(null);
            setHolidaySummaryGroup(null);
            changedOption();
        }

        // * → 無給の場合
        if(inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 && dojo.byId('holidayEditType').value == teasp.constant.HOLIDAY_TYPE_FREE){
            if( dojo.byId('holidayManageGroupId').innerHTML == getHolidayGroupTypeA().getId() ||
                dojo.byId('holidaySummaryGroupId').innerHTML == getHolidayGroupTypeA().getId() ){
                // 日数管理グループまたは集計グループが年次有給休暇の場合
                var before = getHoldHolidayEditType();
                teasp.tsConfirmA(teasp.message.getLabel('hg00000410'), this,  //種類が無給の休暇は、日数管理グループと集計グループに年次有給休暇を設定できません。未設定に変更してよろしいですか？
                    dojo.hitch(this,function(){  // OK
                        setHolidayManageGroup(null);
                        setHolidaySummaryGroup(null); 
                        changedOption();
                    }), 
                    dojo.hitch(this,function(){  //キャンセル
                        dojo.byId('holidayEditType').value = before;  //キャンセルのときは、変更前の値にする。
                        changedOption();
                        updateHoldHolidayEditType();
                    }
                ));
            }
        }
        updateHoldHolidayEditType();
    };

    // event: 休暇範囲の選択を変更、「時間単位休」選択の場合は強制的に種類を「有給」日付範囲を「しない」固定にする
    var changedHolidayRange = function(){
        changedOption();
    };

    var changedHolidayName = function(){
        var v = dojo.byId('holidayEditManaged').checked;

        if( inobj.leaveManagementVersion == teasp.constant.LEAVEMANAGE_VER2 && inobj.holiday && isThisHolidayGroupTypeS(inobj.holiday.manageGroupId) ){
            // 新方式で代休の時は、チェックボックスは見かけだけのONなので、false固定。
            v=false;
        }
        if (v && dojo.byId('holidayEditManageName')) {
            if (dojo.byId('holidayEditManageName').value.trim() == '') {
                dojo.byId('holidayEditManageName').value = dojo.byId('holidayEditName').value
            }
        }
    };

    // event: 日数管理のチェックを変更、「管理をする」がチェックされていない場合は管理名を入力不可にする
    var changedHolidayEditManaged = function() {

        changedOption();

        var v = dojo.byId('holidayEditManaged').checked;
        if(v){
            if (dojo.byId('holidayEditManageName')
            && dojo.byId('holidayEditManageName').value.trim() == '') {
                dojo.byId('holidayEditManageName').value = dojo.byId('holidayEditName').value
            }
        }
    };

    // event: 休暇時間の制限をON/OFFに伴い、選択肢の有効/無効を切り替え
    var changedTimeUnitUse = function(){
        if(dojo.byId('holidayEditTimeUnitUse').checked){
            dojo.byId('holidayEditTimeUnit').disabled=false;
        }else{
            dojo.byId('holidayEditTimeUnit').disabled=true;
        }
    }

    // event : 休暇グループ割当ダイアログを開く(日数管理グループ用)
    var openHolidayGroupAssignDialogForManageGroupId = function(){

        // 現在選択中のHolidayGroupのIDを取得。
        inobj.argHolidayManageGroupId = dojo.byId('holidayManageGroupId').innerHTML;  // inobjにargHolidayGroupIdを追加

        if(!holidayGroupAssignDialog){
            holidayGroupAssignDialog = new ATK.dialog.HolidayGroupAssignDialog(inobj.configAction);
        }
        holidayGroupAssignDialog.open({holidayGroupId:inobj.argHolidayManageGroupId, holidayGroups:inobj.holidayGroups, dialogType:'holidayManage', holidayEditType:getHoldHolidayEditType()}).then(function(result){ //resolve
            inobj.holidayGroups = result.holidayGroups;
            dojo.byId('holidayManageGroupId').innerHTML = result.holidayGroupId;
            changedOption();
        },
        function(result){   // reject
            // キャンセルの場合でも、「新規作成」→「キャンセル」を考慮して、最新のholidayGroupsで更新する。
            inobj.holidayGroups = result.holidayGroups;
            changedOption();
        }
        );
    }

    // event : 休暇グループ割当ダイアログを開く(集計グループ用)
    var openHolidayGroupAssignDialogForSummaryGroupId = function(){

        // 現在選択中のHolidayGroupのIDを取得。
        inobj.argHolidaySummaryGroupId = dojo.byId('holidaySummaryGroupId').innerHTML;  // inobjにargHolidayGroupIdを追加

        if(!holidayGroupAssignDialog){
            holidayGroupAssignDialog = new ATK.dialog.HolidayGroupAssignDialog(inobj.configAction);
        }
        holidayGroupAssignDialog.open({holidayGroupId:inobj.argHolidaySummaryGroupId, holidayGroups:inobj.holidayGroups, dialogType:'holidaySummary', holidayEditType:getHoldHolidayEditType()}).then(function(result){ //resolve
            inobj.holidayGroups = result.holidayGroups;
            dojo.byId('holidaySummaryGroupId').innerHTML = result.holidayGroupId;
            changedOption();
        },
        function(result){   // reject
            // キャンセルの場合でも、「新規作成」→「キャンセル」を考慮して、最新のholidayGroupsで更新する。
            inobj.holidayGroups = result.holidayGroups;
            changedOption();
        }
        );
    }

    // event: 保存
    var saveAndClose = function(){
        var tbody, row, r, t, restStr = '';
        var holiday = (inobj.holiday ? dojo.clone(inobj.holiday) : { id: null });
        var holidayManageGroup = null;
        var holidaySummaryGroup = null;
        var isAssignedTypeS = (dojo.byId('holidayEditType').value == teasp.constant.HOLIDAY_TYPE_DAIQ);  // 新方式用 代休参照判定

        // 日数管理グループを事前に準備
        holidayManageGroup = getHolidayGroup(dojo.byId('holidayManageGroupId').innerHTML);

        // 集計グループを事前に準備
        holidaySummaryGroup = getHolidayGroup(dojo.byId('holidaySummaryGroupId').innerHTML);

        // 休暇名
        holiday.name = dojo.byId('holidayEditName').value.trim();
        if(holiday.name == ''){
            showError(teasp.message.getLabel('tk10001109')); // 休暇名を入力してください
            return;
        }
        // 休暇名の入力に伴う、旧：管理名　新：管理グループ　のバリデーション
        if(inobj.leaveManagementVersion != teasp.constant.LEAVEMANAGE_VER2 ){
            // 旧方式
            if (dojo.byId('holidayEditManageName')) {
                if (dojo.byId('holidayEditManaged').checked) {
                    if (dojo.byId('holidayEditManageName').value.trim() == '') {
                        showError(teasp.message.getLabel('tk10001111')); // 日数管理をする場合は管理名を入力してください
                        return;
                    }else if (dojo.byId('holidayEditManageName').value.trim() == '代休') {
                        showError(teasp.message.getLabel('tk10005120', '代休')); // 「{0}」は管理名に使用できません。
                        return;
                    }
                }
            }
        }else{
            // 新方式
            if(dojo.byId('holidayEditManaged').checked && (!holidayManageGroup)){
                showError(teasp.message.getLabel('hg00000390')); // 日数管理グループを選択してください
                return;
            }
        }

        holiday.name        = dojo.byId('holidayEditName').value;   // 休暇名
        holiday.type        = dojo.byId('holidayEditType').value;   // 種類
        holiday.range       = dojo.byId('holidayEditRange').value;  // 範囲
        holiday.symbol      = dojo.byId('holidayEditSymbol').value.trim();  // 略称

        // 有休消化
        if(inobj.leaveManagementVersion != teasp.constant.LEAVEMANAGE_VER2 ){
            // 旧方式
            holiday.yuqSpend    = dojo.byId('holidayEditYuqSpend').checked;
        }else{
            //　新方式
            if(holidayManageGroup){
                if(holidayManageGroup.getType() == ATK.obj.HolidayGroup.A_TYPE){  //年次有給休暇の休暇グループ
                    holiday.yuqSpend    = true;
                }else{
                    holiday.yuqSpend    = false;
                }
            }else{
                holiday.yuqSpend    = false;
            }
        }
        holiday.isWorking   = dojo.byId('holidayEditIsWorking').checked;    // 出勤率判定

        // 日数管理　＆　旧：管理名　新：管理グループ
        if(inobj.leaveManagementVersion != teasp.constant.LEAVEMANAGE_VER2 ){
            // 旧方式
            holiday.managed     = dojo.byId('holidayEditManaged').checked;
            if(holiday.managed && dojo.byId('holidayEditManageName')){
                holiday.manageName  = dojo.byId('holidayEditManageName').value;
            }else{
                holiday.manageName  = orgHoliday.manageName;
            }
        }else{
            // 新方式
            if(isAssignedTypeS){
                // 代休のときは、「日数管理する」チェックボックス内容は見かけだけなので、false決め打ち
                if(holidayManageGroup){
                    holiday.managed = false;
                    holiday.manageGroupId = holidayManageGroup.getId();
                    holiday.manageName = '';
                }
            }else{
                if(holidayManageGroup){
                    if( holidayManageGroup.getType() == ATK.obj.HolidayGroup.A_TYPE ){
                        // 年次有給休暇のときは、false決め打ち
                        holiday.managed = false;
                        holiday.manageGroupId = holidayManageGroup.getId();
                        holiday.manageName = '';
                    }else{
                        // それ以外のときは、true決め打ち
                        holiday.managed = true;
                        holiday.manageGroupId = holidayManageGroup.getId();
                        if(holidayManageGroup.getType() == ATK.obj.HolidayGroup.U_TYPE){  //ユーザ定義の日数管理兼集計グループ
                            holiday.manageName = holidayManageGroup.getName();
                        }else{
                            holiday.manageName = '';
                        }
                    }
                }else{
                    // 空の場合は、日数管理グループ設定無しなので、格納値はfalse固定。
                    holiday.managed = false;
                    holiday.manageGroupId = null;
                    holiday.manageName = '';
                }
            }
            // 日数管理-管理をするにチェックが入っていない場合は格納値はfalse固定。
            if(!dojo.byId('holidayEditManaged').checked){
                holiday.managed = false;
                holiday.manageGroupId = null;
                holiday.manageName = '';
            }
        }
        holiday.displayDaysOnCalendar = dojo.byId('holidayEditDaysOnCal').checked;  // 暦日表示

        holiday.linkNumber            = teasp.util.parseNumText(dojo.byId('holidayEditNumber').value);  //連携時の休暇番号

        holiday.description           = dojo.byId('holidayEditDescription').value;  // 説明

        // 大分類　＆　集計グループ
        if(inobj.leaveManagementVersion != teasp.constant.LEAVEMANAGE_VER2 ){
            // 旧方式
            holiday.summaryName           = dojo.byId('holidayEditSummaryName').value;  // 大分類
            if(holiday.type == teasp.constant.HOLIDAY_TYPE_DAIQ && holiday.range == teasp.constant.RANGE_TIME){ // 代休で時間単位休
                showError(teasp.message.getLabel('tf10010830')); // 代休の時間単位休は設定できません
                return;
            }
            if(holiday.summaryName == '-'){
                showError(teasp.message.getLabel('tk10003910')); // 大分類を設定してください
                return;
            }
            holiday.isSummaryRoot = (holiday.summaryName == '-1');
            if(holiday.isSummaryRoot){
                holiday.summaryName = holiday.name;
            }
        }else{
            // 新方式
            if(holiday.type == teasp.constant.HOLIDAY_TYPE_DAIQ && holiday.range == teasp.constant.RANGE_TIME){ // 代休で時間単位休
                showError(teasp.message.getLabel('tf10010830')); // 代休の時間単位休は設定できません
                return;
            }
            if(holidaySummaryGroup){
                holiday.summaryName = holidaySummaryGroup.getName();
                // (isSummaryRootは変更しない。)
                holiday.summaryGroupId = holidaySummaryGroup.getId();
            }else{
                showError(teasp.message.getLabel('hg00000400')); // 集計グループを選択してください
                return;
            }
        }

        //休暇時間の制限
        if(dojo.byId('holidayEditTimeUnitUse').checked){
            if(holiday.range == teasp.constant.RANGE_TIME){
                if(holiday.type == teasp.constant.HOLIDAY_TYPE_DAIQ){    //時間単位休の年次有給休暇のとき
                    //【TODO】30分単位用ここから
                    // if(dojo.byId('holidayEditTimeUnit').value==30){
                    //     showError(teasp.message.getLabel('th00000090')); // 年次有給休暇では、「休暇時間の制限」は1時間のみ設定可能です。
                    //     return;
                    // }else{
                        holiday.timeUnit = teasp.util.parseNumText(dojo.byId('holidayEditTimeUnit').value);
                    // }
                    //【TODO】30分単位用ここまで
                }else{  //時間単位休でその他の休暇のとき
                    holiday.timeUnit = teasp.util.parseNumText(dojo.byId('holidayEditTimeUnit').value);
                }
            }else{  //時間単位休以外のとき
                showError(teasp.message.getLabel('th00000080')); // 「休暇時間の制限」は、時間単位休のみで設定可能です。
                return;
            }
        }else{
            holiday.timeUnit = null;
        }

        // 前日の勤務
        if(!holiday.config){
            holiday.config = {};
        }
        holiday.config.prohibitOverNightWork = dojo.byId('holidayEditOverNight').checked;
        holiday.config = dojo.toJson(holiday.config);

        // 割り当てタブ内容
        var empTypeIds = [];
        tbody = dojo.byId('holidayEditEmpTypes').getElementsByTagName('tbody')[0];
        for(r = 0 ; r < tbody.rows.length ; r++){
            row = tbody.rows[r];
            if(/holidayEditEmpTypeRow(.+)/.test(row.id)){
                if(row.cells[0].firstChild.checked){
                    empTypeIds.push(RegExp.$1);
                }
            }
        }
        
        showError(null);

        // 「有休消化:しない」に変更する場合は警告メッセージを表示する(休暇の新規作成時は対象外)
        if(savedHolidayYuqSpend && !holiday.yuqSpend && inobj.leaveManagementVersion != teasp.constant.LEAVEMANAGE_VER2) {
            // 「有休消化：する」のチェックが外れています。年次有給休暇の残日数から消化されない休暇となります。設定を変更してよろしいですか？
            teasp.tsConfirm(teasp.message.getLabel('tk10007400'), null, function(confirmOk){
                if(confirmOk){
                    saveAndClose2(holiday, empTypeIds);
                }
            });
        }else{
            saveAndClose2(holiday, empTypeIds);
        }
    };

    var saveAndClose2 = function(holiday, empTypeIds){
        ATK.dialog.BusyWait.open();
        if(holiday.managed && holiday.range == teasp.constant.RANGE_TIME){
            checkEmptyBaseTimeForStock(empTypeIds, function(o){
                ATK.dialog.BusyWait.close();
                var ebs = o.emptyBaseTimeForStock || [];
                console.log(o);
                if(ebs.length){
                    // 下記の勤務体系は『時間単位休の基準時間(日数管理休暇用)』が未設定です。休暇を利用する前に設定を行ってください。登録を続行しますか？\n\n{0}
                    teasp.tsConfirm(teasp.message.getLabel('tm10011080', getEmpTypeNames(ebs)), null, function(confirmOk){
                        if(confirmOk){
                            ATK.dialog.BusyWait.open();
                            saveHolidayConfig(holiday, empTypeIds);
                        }
                    });
                }else{
                    ATK.dialog.BusyWait.open();
                    saveHolidayConfig(holiday, empTypeIds);
                }
            });
        }else{
            saveHolidayConfig(holiday, empTypeIds);
        }
    };

    function checkEmptyBaseTimeForStock(empTypeIds, callback){
        ATK.ajax.requestSend({
            action     : "checkEmptyBaseTimeForStock",
            empTypeIds : empTypeIds
        }, null, funcAction,
        callback,
        recieveError);
    }

    function getEmpTypeNames(empTypeIds){
        var max = 10;
        var ets = inobj.empTypes;
        var names = [];
        // 割当表の表示順にソートする
        var tgts = empTypeIds.sort(function(a, b){
            var ax = getIndexEmpTypeOrder(a);
            var bx = getIndexEmpTypeOrder(b);
            return (ax >= 0 && bx >= 0) ? ax - bx : 0;
        });
        for(var i = 0 ; (i < tgts.length && i < max) ; i++){
            var et = getObjectById(ets, tgts[i]);
            names.push(et.name);
        }
        return names.join(teasp.message.getLabel('tm10001540'))
            + (tgts.length > max ? teasp.message.getLabel('tk10004140') + teasp.message.getLabel('tm20001100', tgts.length - max) : '');
    }

    // 引数のid が勤務体系割当リストの何番目か（0～）を返す
    function getIndexEmpTypeOrder(id){
        for(var i = 0 ; i < inobj.empTypes.length ; i++){
            var et = inobj.empTypes[i];
            if(et.id == id){
                return i;
            }
        }
        return -1; // here is impossible
    }

    function saveHolidayConfig(holiday, empTypeIds){
        ATK.ajax.requestSend({
            action     : "saveHolidayConfig",
            holiday    : holiday,
            empTypeIds : empTypeIds
        }, null, funcAction, recieveFunction, recieveError);
    }

    // event: サーバから正常値受信
    function recieveFunction(o){
        ATK.dialog.BusyWait.close();
        onfinishfunc(o);
        close();
    }

    // event: サーバから異常値受信
    var recieveError = function(o){
        ATK.dialog.BusyWait.close();
        teasp.tsAlert(teasp.message.getLabel('tm00000010', o.error.message));
    };

    // event: キャンセル
    var close = function(){
        dialog.hide();
    };

    return {
        open  : open
    };
};  // ATK.dialog.holidayEditDialog

/*
 * 休暇一覧並び順変更ダイアログ2012/07/25
 */
ATK.dialog.holidayOrderDialog = function(){
	var attached = false;
    var inobj;
    var onfinishfunc;
    //var dialogId = 'holidayOrderDialog';

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog2 = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10000689'), // 並び順変更
            duration : 300
        });

        dialog2.attr('content',
        	   '<div  duration="300" id="holidayOrderDialog" style="width:300px;" title="' + teasp.message.getLabel('tk10000689') + '">' // 並び順変更
        	+ '  <table class="ts_a_frame">'
        	+ '  <tr>'
        	+ '    <td class="edgelt"></td>'
        	+ '    <td class="edgeht"></td>'
        	+ '    <td class="edgert"></td>'
        	+ '  </tr>'
        	+ '  <tr>'
        	+ '    <td class="edgevl"></td>'
        	+ '    <td>'
        	+ '      <div class="edge_div">'
        	+ '        <table class="stand_table" style="margin:4px;">'
        	+ '        <tr>'
        	+ '          <td style="width:200px;">'
        	+ '            <div style="width:200px;height:160px;padding:0px;margin:0px;overflow-y:scroll;border:1px solid #539AC7;background-color:#FFFFFF;">'
        	+ '              <table class="stone_table" id="orderChange">'
        	+ '              <tbody>'
        	+ '              </tbody>'
        	+ '              </table>'
        	+ '            </div>'
        	+ '          </td>'
        	+ '          <td style="vertical-align:middle;padding-left:10px;">'
        	+ '            <table class="pane_table" style="width:38px;">'
        	+ '            <tr>'
        	+ '              <td style="padding-bottom:8px;">'
        	+ '                <input type="button" id="holidayOrderUp" class="pb_base pb_btn_upto" title="' + teasp.message.getLabel('up_btn_title') + '" />' // 上へ
        	+ '              </td>'
        	+ '            </tr>'
        	+ '            <tr>'
        	+ '              <td style="padding-top:8px;">'
        	+ '                <input type="button" id="holidayOrderDown" class="pb_base pb_btn_downto" title="' + teasp.message.getLabel('down_btn_title') + '" />' // 下へ
        	+ '              </td>'
        	+ '            </tr>'
        	+ '            </table>'
        	+ '          </td>'
        	+ '        </tr>'
        	+ '        </table>'
        	+ '      </div>'
        	+ '    </td>'
        	+ '    <td class="edgevr"></td>'
        	+ '  </tr>'
        	+ '  <tr>'
        	+ '    <td class="edgelb"></td>'
        	+ '    <td class="edgehb"></td>'
        	+ '    <td class="edgerb"></td>'
        	+ '  </tr>'
        	+ '  </table>'
        	+ '  <table border="0" cellpadding="0" cellspacing="0" style="width:100%;">'
        	+ '  <tr>'
        	+ '    <td colspan="2" style="padding:16px 0px 4px 0px;text-align:center;">'
        	+ '      <input type="button" class="pb_base pb_btn_regist" id="holidaysOk" />'
        	+ '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
        	+ '      <input type="button" class="pb_base pb_btn_cancel" id="holidayOrderCancel" />'
        	+ '    </td>'
        	+ '  </tr>'
        	+ '  </table>'
        	+ '</div>');
        dojo.byId('holidayOrderUp').onclick   = function(){ clickUpDown(0); };
        dojo.byId('holidayOrderDown').onclick = function(){ clickUpDown(1); };

        dojo.byId('holidaysOk').onclick = saveAndClose;
        dojo.byId('holidayOrderCancel').onclick = close;

        dialog2.startup();
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        //setDialogPosition(dijit.byId(dialogId), 240, 260);
        setDialogPosition(dialog2, 240, 260);

        var tbody = dojo.byId('orderChange').getElementsByTagName('tbody')[0];
        while(tbody.firstChild){
            dojo.destroy(tbody.firstChild);
        }
        var holidays = inobj.holidays;
        for(var i = 0 ; i < holidays.length ; i++){
            var ei = holidays[i];
            var row = dojo.create('tr', {id : 'reOrder' + ei.id,className : 'sele ' + ((i%2)==0 ? 'even' : 'odd') }, tbody);

            dojo.create('input', {type: 'checkbox'}, dojo.create('td', { style: { width:"24px", borderLeft:"none", borderRight:"none" } }, row));
            dojo.create('div', {
                innerHTML : ei.name,
                style     : { padding:"2px", wordBreak:"break-all" }
            }, dojo.create('td', {
                onclick : function(){ clickRow(this); },
                style   : { width:"159px", textAlign:"left", borderLeft:"none", borderRight:"none" }
            }, row));
        }
        //dijit.byId(dialogId).show();
        dialog2.show();
    };

    // 行のクリック
    var clickRow = function(node){
        var row = node.parentNode;
        if(/reOrder(.+)/.test(row.id)){
            row.cells[0].firstChild.checked = (row.cells[0].firstChild.checked ? false : true);
        }
    };

    // 右側リストで上下に移動
    var clickUpDown = function(face){
        var tbody, row, row2, r, node, select;
        tbody = dojo.byId('orderChange').getElementsByTagName('tbody')[0];
        if(!face){ // 上へ
            for(r = 0 ; r < tbody.rows.length ; r++){
                node = tbody.rows[r].cells[0].firstChild;
                if(node.checked && r > 0 && !tbody.rows[r - 1].cells[0].firstChild.checked){
                    row = tbody.removeChild(tbody.rows[r - 1]);
                    row2 = tbody.rows[r];
                    if(!row2){
                        tbody.appendChild(row);
                    }else{
                        tbody.insertBefore(row, row2);
                    }
                }
            }
        }else{
            for(r = tbody.rows.length - 1 ; r >= 0  ; r--){
                node = tbody.rows[r].cells[0].firstChild;
                if(node.checked && r < (tbody.rows.length - 1) && !tbody.rows[r + 1].cells[0].firstChild.checked){
                    tbody.insertBefore(tbody.removeChild(tbody.rows[r + 1]), tbody.rows[r]);
                }
            }
        }
        for(r = 0 ; r < tbody.rows.length ; r++){
            node = tbody.rows[r].cells[1].firstChild;
            node.nodeValue = '' + (r + 1);
            tbody.rows[r].className = 'sele ' + ((r%2)==0 ? 'even' : 'odd');
        }
    };

    // event: キャンセル
    var close = function(){
        //dijit.byId(dialogId).hide();
    	dialog2.hide();
    };

    // event: ＯＫ
    var saveAndClose = function(){
        var holidays = [];
        var idList = [];
        var tbody = dojo.byId('orderChange').getElementsByTagName('tbody')[0];
        for(var r = 0 ; r < tbody.rows.length ; r++){
            var row = tbody.rows[r];
            if(/reOrder(.+)/.test(row.id)){
            	holidays.push(getObjectById(inobj.holidays, RegExp.$1));
                idList.push(RegExp.$1);
            }
        }
        ATK.dialog.BusyWait.open();
        ATK.ajax.requestSend({
            action    : 'orderHoliday',
            orderList : idList
        }, null, funcAction, function(o){
            ATK.dialog.BusyWait.close();
            onfinishfunc(holidays);
            close();
        }, function(o){
            ATK.dialog.BusyWait.close();
            teasp.tsAlert(o.error.message);
        });
    };

    return {
        open  : open
    };
};

/*
 * 勤務パターン一覧並び順変更ダイアログ2012/07/27
 */
ATK.dialog.patternListOrderDialog = function(){
	var attached = false;
    var inobj;
    var onfinishfunc;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10000689'), // 並び順変更
            duration : 300
        });

        dialog.attr('content',
        	   '<div  duration="300" id="patternListOrderDialog" style="width:300px;" title="' + teasp.message.getLabel('tk10000689') + '">' // 並び順変更
        	+ '  <table class="ts_a_frame">'
        	+ '  <tr>'
        	+ '    <td class="edgelt"></td>'
        	+ '    <td class="edgeht"></td>'
        	+ '    <td class="edgert"></td>'
        	+ '  </tr>'
        	+ '  <tr>'
        	+ '    <td class="edgevl"></td>'
        	+ '    <td>'
        	+ '      <div class="edge_div">'
        	+ '        <table class="stand_table" style="margin:4px;">'
        	+ '        <tr>'
        	+ '          <td style="width:200px;">'
        	+ '            <div style="width:200px;height:160px;padding:0px;margin:0px;overflow-y:scroll;border:1px solid #539AC7;background-color:#FFFFFF;">'
        	+ '              <table class="stone_table" id="patternOrderChange">'
        	+ '              <tbody>'
        	+ '              </tbody>'
        	+ '              </table>'
        	+ '            </div>'
        	+ '          </td>'
        	+ '          <td style="vertical-align:middle;padding-left:10px;">'
        	+ '            <table class="pane_table" style="width:38px;">'
        	+ '            <tr>'
        	+ '              <td style="padding-bottom:8px;">'
        	+ '                <input type="button" id="patternListOrderUp" class="pb_base pb_btn_upto" title="' + teasp.message.getLabel('up_btn_title') + '" />' // 上へ
        	+ '              </td>'
        	+ '            </tr>'
        	+ '            <tr>'
        	+ '              <td style="padding-top:8px;">'
        	+ '                <input type="button" id="patternListOrderDown" class="pb_base pb_btn_downto" title="' + teasp.message.getLabel('down_btn_title') + '" />' // 下へ
        	+ '              </td>'
        	+ '            </tr>'
        	+ '            </table>'
        	+ '          </td>'
        	+ '        </tr>'
        	+ '        </table>'
        	+ '      </div>'
        	+ '    </td>'
        	+ '    <td class="edgevr"></td>'
        	+ '  </tr>'
        	+ '  <tr>'
        	+ '    <td class="edgelb"></td>'
        	+ '    <td class="edgehb"></td>'
        	+ '    <td class="edgerb"></td>'
        	+ '  </tr>'
        	+ '  </table>'
        	+ '  <table border="0" cellpadding="0" cellspacing="0" style="width:100%;">'
        	+ '  <tr>'
        	+ '    <td colspan="2" style="padding:16px 0px 4px 0px;text-align:center;">'
        	+ '      <input type="button" class="pb_base pb_btn_regist" id="patternListsOk" />'
        	+ '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
        	+ '      <input type="button" class="pb_base pb_btn_cancel" id="patternListOrderCancel" />'
        	+ '    </td>'
        	+ '  </tr>'
        	+ '  </table>'
        	+ '</div>');
        dojo.byId('patternListOrderUp').onclick   = function(){ clickUpDown(0); };
        dojo.byId('patternListOrderDown').onclick = function(){ clickUpDown(1); };

        dojo.byId('patternListsOk').onclick = saveAndClose;
        dojo.byId('patternListOrderCancel').onclick = close;

        dialog.startup();
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        setDialogPosition(dialog, 240, 260);

        var tbody = dojo.byId('patternOrderChange').getElementsByTagName('tbody')[0];
        while(tbody.firstChild){
            dojo.destroy(tbody.firstChild);
        }
        var patterns = inobj.patterns;
        for(var i = 0 ; i < patterns.length ; i++){
            var ei = patterns[i];
            var row = dojo.create('tr', {id : 'reOrder' + ei.id,className : 'sele ' + ((i%2)==0 ? 'even' : 'odd') }, tbody);

            dojo.create('input', {type: 'checkbox'}, dojo.create('td', { style: { width:"24px", borderLeft:"none", borderRight:"none" } }, row));
            dojo.create('div', {
                innerHTML : ei.name,
                style     : { padding:"2px", wordBreak:"break-all" }
            }, dojo.create('td', {
                onclick : function(){ clickRow(this); },
                style   : { width:"159px", textAlign:"left", borderLeft:"none", borderRight:"none" }
            }, row));
        }
        dialog.show();
    };

    // 行のクリック
    var clickRow = function(node){
        var row = node.parentNode;
        if(/reOrder(.+)/.test(row.id)){
            row.cells[0].firstChild.checked = (row.cells[0].firstChild.checked ? false : true);
        }
    };

    // 右側リストで上下に移動
    var clickUpDown = function(face){
        var tbody, row, row2, r, node, select;
        tbody = dojo.byId('patternOrderChange').getElementsByTagName('tbody')[0];
        if(!face){ // 上へ
            for(r = 0 ; r < tbody.rows.length ; r++){
                node = tbody.rows[r].cells[0].firstChild;
                if(node.checked && r > 0 && !tbody.rows[r - 1].cells[0].firstChild.checked){
                    row = tbody.removeChild(tbody.rows[r - 1]);
                    row2 = tbody.rows[r];
                    if(!row2){
                        tbody.appendChild(row);
                    }else{
                        tbody.insertBefore(row, row2);
                    }
                }
            }
        }else{
            for(r = tbody.rows.length - 1 ; r >= 0  ; r--){
                node = tbody.rows[r].cells[0].firstChild;
                if(node.checked && r < (tbody.rows.length - 1) && !tbody.rows[r + 1].cells[0].firstChild.checked){
                    tbody.insertBefore(tbody.removeChild(tbody.rows[r + 1]), tbody.rows[r]);
                }
            }
        }
        for(r = 0 ; r < tbody.rows.length ; r++){
            node = tbody.rows[r].cells[1].firstChild;
            node.nodeValue = '' + (r + 1);
            tbody.rows[r].className = 'sele ' + ((r%2)==0 ? 'even' : 'odd');
        }
    };

    // event: キャンセル
    var close = function(){
        //dijit.byId(dialogId).hide();
    	dialog.hide();
    };

    // event: ＯＫ
    var saveAndClose = function(){
        var patterns = [];
        var idList = [];
        var tbody = dojo.byId('patternOrderChange').getElementsByTagName('tbody')[0];
        for(var r = 0 ; r < tbody.rows.length ; r++){
            var row = tbody.rows[r];
            if(/reOrder(.+)/.test(row.id)){
            	patterns.push(getObjectById(inobj.patterns, RegExp.$1));
                idList.push(RegExp.$1);
            }
        }
        ATK.dialog.BusyWait.open();
        ATK.ajax.requestSend({
            action    : 'orderPattern',
            orderList : idList
        }, null, funcAction, function(o){
            ATK.dialog.BusyWait.close();
            onfinishfunc(patterns);
            close();
        }, function(o){
            ATK.dialog.BusyWait.close();
            teasp.tsAlert(o.error.message);
        });
    };

    return {
        open  : open
    };
};

//logic: 配列から id がマッチするオブジェクトを返す2012/07/26
function getObjectById(lst, id){
    for(var i = 0 ; i < lst.length ; i++){
        if(lst[i].id == id){
            return lst[i];
        }
    }
    return null;
}

//------------------------------------------------------------------------------
// 勤務パターン or 休暇選択ダイアログ
ATK.dialog.itemSelectDialog = function(_param){
    var param = _param;
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;
    var rowLseq = 1;
    var rowRseq = 1;
    var lefts = [];
    var rights = [];
    var toolTips = {};
    var toolTipSeq = 0;
    var eventHandles = {};
    var keyParam = {
        title     : param.key + 'SelTitle',
        descL     : param.key + 'SelDescL',
        descR     : param.key + 'SelDescR',
        checkL    : param.key + 'SelCheckL',
        checkR    : param.key + 'SelCheckR',
        headL     : param.key + 'SelHeadL',
        headR     : param.key + 'SelHeadR',
        tableL    : param.key + 'SelTableL',
        tableR    : param.key + 'SelTableR',
        rowL      : param.key + 'SelRowL',
        rowR      : param.key + 'SelRowR',
        link      : param.key + 'SelLink',
        btnAdd    : param.key + 'SelAdd',
        btnDel    : param.key + 'SelDel',
        btnUp     : param.key + 'SelUp',
        btnDown   : param.key + 'SelDown',
        btnOk     : param.key + 'SelOk',
        btnCancel : param.key + 'SelCancel',
        nameL     : param.key + 'NameL',
        nameR     : param.key + 'NameR'
    };

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : param.caption,
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:570px;">'
            + '  <table class="ts_a_frame">'
            + '  <tr>'
            + '    <td colspan="3" id="' + keyParam.title + '" style="padding:2px 8px 16px 8px;text-align:center;font-weight:bold;">'
            + '    </td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgelt"></td>'
            + '    <td class="edgeht"></td>'
            + '    <td class="edgert"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgevl"></td>'
            + '    <td>'
            + '      <div class="edge_div">'
            + '        <table class="pane_table" style="margin:8px 4px;">'
            + '        <tr>'
            + '          <td style="vertical-align:top;">'
            + '            <div id="' + keyParam.descL + '" style="padding-bottom:4px;text-align:center;">'
            + '            </div>'
            + '            <table class="stone_area" style="width:224px;">'
            + '            <tr>'
            + '              <td>'
            + '                    <table class="stone_table">'
            + '                    <tr>'
            + '                      <td class="head" style="width:24px;">'
            + '                        <input type="checkbox" id="' + keyParam.checkL + '" />'
            + '                      </td>'
            + '                      <td class="head" style="width:200px;" id="' + keyParam.headL + '"></td>'
            + '                    </tr>'
            + '                    </table>'
            + '                    <div class="stone_div" style="height:160px;background-color:#FAFAFA;">'
            + '                      <table class="stone_table" id="' + keyParam.tableL + '">'
            + '                        <tbody></tbody>'
            + '                      </table>'
            + '                    </div>'
            + '              </td>'
            + '            </tr>'
            + '            </table>'
            + '          </td>'
            + '          <td style="text-align:center;vertical-align:middle;">'
            + '            <table class="pane_table" style="width:48px;">'
            + '            <tr>'
            + '              <td style="padding-bottom:8px;">'
            + '                <input type="button" id="' + keyParam.btnAdd + '" class="pb_base pb_btn_right" title="' + teasp.message.getLabel('tk10000985') + '" />' // 追加
            + '              </td>'
            + '            </tr>'
            + '            <tr>'
            + '              <td style="padding-top:8px;">'
            + '                <input type="button" id="' + keyParam.btnDel + '" class="pb_base pb_btn_left" title="' + teasp.message.getLabel('delete_btn_title') + '" />' // 削除
            + '              </td>'
            + '            </tr>'
            + '            </table>'
            + '          </td>'
            + '          <td style="vertical-align:top;">'
            + '            <div id="' + keyParam.descR + '" style="padding-bottom:4px;text-align:center;">'
            + '            </div>'
            + '            <table class="stone_area" style="width:224px;">'
            + '            <tr>'
            + '              <td>'
            + '                    <table class="stone_table">'
            + '                    <tr>'
            + '                      <td class="head" style="width:24px;">'
            + '                        <input type="checkbox" id="' + keyParam.checkR + '" />'
            + '                      </td>'
            + '                      <td class="head" style="width:200px;" id="' + keyParam.headR + '"></td>'
            + '                    </tr>'
            + '                    </table>'
            + '                    <div class="stone_div" style="height:160px;background-color:#FAFAFA;">'
            + '                      <table class="stone_table" id="' + keyParam.tableR + '">'
            + '                        <tbody></tbody>'
            + '                      </table>'
            + '                    </div>'
            + '              </td>'
            + '            </tr>'
            + '            </table>'
            + '          </td>'
            + '          <td style="text-align:right;vertical-align:middle;">'
            + '            <table class="pane_table" style="width:41px;">'
            + '            <tr>'
            + '              <td style="padding-bottom:8px;">'
            + '                <input type="button" id="' + keyParam.btnUp + '" class="pb_base pb_btn_upto" title="' + teasp.message.getLabel('up_btn_title') + '" />' // 上へ
            + '              </td>'
            + '            </tr>'
            + '            <tr>'
            + '              <td style="padding-top:8px;">'
            + '                <input type="button" id="' + keyParam.btnDown + '" class="pb_base pb_btn_downto" title="' + teasp.message.getLabel('down_btn_title') + '" />' // 下へ
            + '              </td>'
            + '            </tr>'
            + '            </table>'
            + '          </td>'
            + '        </tr>'
            + '        </table>'
            + '      </div>'
            + '    </td>'
            + '    <td class="edgevr"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgelb"></td>'
            + '    <td class="edgehb"></td>'
            + '    <td class="edgerb"></td>'
            + '  </tr>'
            + '  </table>'
            + '<table class="pane_table" style="width:100%;margin-top:8px;">'
            + '<tr>'
/*
            + '  <td style="padding:4px 12px;text-align:left;">'
            + '    <a href="javascript:void(0);" id="' + keyParam.link + '">'
            + '    </a>'
            + '  </td>'
*/
            + '  <td style="padding:4px;text-align:center;">'
            + '    <input type="button" class="pb_base pb_btn_ok" id="' + keyParam.btnOk + '">'
            + '    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '    <input type="button" class="pb_base pb_btn_cancel" id="' + keyParam.btnCancel + '">'
            + '  </td>'
/*
            + '  <td><div style="width:160px;"></div>'
            + '  </td>'
*/
            + '</tr>'
            + '</table>'
            + '</div>');

        dojo.byId(keyParam.descL).innerHTML = param.descriptL;
        dojo.byId(keyParam.descR).innerHTML = param.descriptR;
        dojo.byId(keyParam.headL).innerHTML = '<div>' + param.headL + '</div>';
        dojo.byId(keyParam.headR).innerHTML = '<div>' + param.headR + '</div>';
//      dojo.byId(keyParam.link ).innerHTML = param.listLink;

        dojo.byId(keyParam.btnOk       ).onclick = function(){ saveAndClose(); };
        dojo.byId(keyParam.btnCancel   ).onclick = function(){ close(); };
        dojo.byId(keyParam.checkL      ).onclick = function(){ checkAll(this); };
        dojo.byId(keyParam.checkR      ).onclick = function(){ checkAll(this); };
        dojo.byId(keyParam.btnAdd      ).onclick = function(){ clickLR(0); };
        dojo.byId(keyParam.btnDel      ).onclick = function(){ clickLR(1); };
        dojo.byId(keyParam.btnUp       ).onclick = function(){ clickUpDown(0); };
        dojo.byId(keyParam.btnDown     ).onclick = function(){ clickUpDown(1); };

        dialog.startup();
    };

    var checkAll = function(node){
        var table, tbody, chk;
        if(/.+SelCheck([LR])/.test(node.id)){
            if(RegExp.$1 == 'L'){ // 左リスト
                chk = dojo.byId(keyParam.checkL).checked;
                table = dojo.byId(keyParam.tableL);
            }else{ // 右リスト
                chk = dojo.byId(keyParam.checkR).checked;
                table = dojo.byId(keyParam.tableR);
            }
            tbody = table.getElementsByTagName('tbody')[0];
            for(var i = 0 ; i < tbody.rows.length ; i++){
                tbody.rows[i].cells[0].firstChild.checked = chk;
            }
        }
    }

    // 左から右へ or 右から左へ
    var clickLR = function(face){
        // 移動元リスト
        var tbodyF = dojo.byId(keyParam['table' + (!face ? 'L' : 'R')]).getElementsByTagName('tbody')[0];
        // 移動先リスト
        var tbodyT = dojo.byId(keyParam['table' + (!face ? 'R' : 'L')]).getElementsByTagName('tbody')[0];
        // 移動元リストのチェックされた要素の id と index を取得
        var lst = [];
        var rxs = [];
        for(var r = 0 ; r < tbodyF.rows.length ; r++){
            if(tbodyF.rows[r].cells[0].firstChild.checked){
                if(/.+SelRow[LR]-(.+)/.test(tbodyF.rows[r].id)){
                    lst.push(RegExp.$1);
                    rxs.push(r);
                }
            }
        }
        if(lst.length > 0){
            moveLR(face, tbodyF, tbodyT, lst, rxs);
        }
    }

    // 要素移動
    var moveLR = function(face, tbodyF, tbodyT, lst, rxs){
        var row, chk, r, i;
        var map = {};
        var mems = [];
        if(!face){
            for(i = 0 ; i < lefts.length ; i++){
                for(r = 0 ; r < lst.length ; r++){
                    if(lefts[i].id == lst[r]){
                        map[lefts[i].id] = lefts[i];
                        mems.push(i);
                        var d = dijit.byId(toolTips[lefts[i].id]);
                        if(d){
                            d.destroy(true);
                            toolTips[lefts[i].id] = null;
                        }
                    }
                }
            }
            // 左側配列から削除
            for(i = mems.length - 1 ; i >= 0 ; i--){
                lefts.splice(mems[i], 1);
            }
        }else{
            for(i = 0 ; i < rights.length ; i++){
                for(r = 0 ; r < lst.length ; r++){
                    if(rights[i].id == lst[r]){
                        map[rights[i].id] = rights[i];
                        mems.push(i);
                        var d = dijit.byId(toolTips[rights[i].id]);
                        if(d){
                            d.destroy(true);
                            toolTips[rights[i].id] = null;
                        }
                    }
                }
            }
            // 右側配列から削除
            for(i = mems.length - 1 ; i >= 0 ; i--){
                rights.splice(mems[i], 1);
            }
        }
        // 移動先リストへ挿入
        r = tbodyT.rows.length;
        for(i = 0 ; i < lst.length ; i++){
            var o = map[lst[i]];
            if(!face){
                insertRightTable(tbodyT, o);
                rights.push(o); // 右側配列に追加
            }else{
                insertLeftTable(tbodyT, o);
                lefts.push(o); // 左側配列に追加
            }
            r++;
        }
        // 移動元リストから削除
        for(i = rxs.length - 1 ; i >= 0 ; i--){
            tbodyF.deleteRow(rxs[i]);
        }
        for(r = 0 ; r < tbodyF.rows.length ; r++){
            tbodyF.rows[r].className = ((r%2)==0 ? 'even' : 'odd');
        }
        // チェックボックスを移動した要素だけオンにして、他はクリア
        dojo.byId(keyParam.checkL).checked = false;
        dojo.byId(keyParam.checkR).checked = false;
        for(r = 0 ; r < tbodyF.rows.length ; r++){
            tbodyF.rows[r].cells[0].firstChild.checked = false;
        }
        for(r = 0 ; r < tbodyT.rows.length ; r++){
            row = tbodyT.rows[r];
            chk = false;
            if(/.+SelRow[LR]-(.+)/.test(row.id)){
                var id = RegExp.$1;
                for(i = 0 ; i < lst.length ; i++){
                    if(id == lst[i]){
                        chk = true;
                        break;
                    }
                }
            }
            row.cells[0].firstChild.checked = chk;
        }
    }

    // 右側リストで上下に移動
    var clickUpDown = function(face){
        var tbody, row, row2, r, node, select;
        tbody = dojo.byId(keyParam.tableR).getElementsByTagName('tbody')[0];
        if(!face){ // 上へ
            for(r = 0 ; r < tbody.rows.length ; r++){
                node = tbody.rows[r].cells[0].firstChild;
                if(node.checked && r > 0 && !tbody.rows[r - 1].cells[0].firstChild.checked){
                    row = tbody.removeChild(tbody.rows[r - 1]);
                    row2 = tbody.rows[r];
                    if(!row2){
                        tbody.appendChild(row);
                    }else{
                        tbody.insertBefore(row, row2);
                    }
                }
            }
        }else{
            for(r = tbody.rows.length - 1 ; r >= 0  ; r--){
                node = tbody.rows[r].cells[0].firstChild;
                if(node.checked && r < (tbody.rows.length - 1) && !tbody.rows[r + 1].cells[0].firstChild.checked){
                    tbody.insertBefore(tbody.removeChild(tbody.rows[r + 1]), tbody.rows[r]);
                }
            }
        }
        for(r = 0 ; r < tbody.rows.length ; r++){
            node = tbody.rows[r].cells[1].firstChild;
            node.nodeValue = '' + (r + 1);
            tbody.rows[r].className = ((r%2)==0 ? 'even' : 'odd');
        }
    }

    // 左側リストへ行挿入
    var insertLeftTable = function(tbody, o){
        var rowId = keyParam.rowL + '-' + o.id;
        var r = tbody.rows.length;
        var row  = dojo.create('tr', { id: rowId, className: 'sele ' + ((r%2)==0 ? 'even' : 'odd') }, tbody);
        var cell = dojo.create('td', { width: '24px' }, row);
        cell.style.border = 'none';
        dojo.create('input', { type: 'checkbox' }, cell);
        cell = dojo.create('td', { width: '181px' }, row);
        cell.style.textAlign = 'left';
        cell.style.border    = 'none';
        cell.style.cursor    = 'pointer';
        if(eventHandles[rowId + 's']){
            dojo.disconnect(eventHandles[rowId + 's']);
            dojo.disconnect(eventHandles[rowId + 'd']);
        }
        eventHandles[rowId + 's'] = dojo.connect(cell, 'onclick'   , clickRow);
        eventHandles[rowId + 'd'] = dojo.connect(cell, 'ondblclick', dblclickRow);
        dojo.create('div', {
            innerHTML : o.name,
            id        : keyParam.nameL + '-' + o.id,
            style     : { wordBreak:"break-all" }
        }, cell);
        new dijit.Tooltip({
            connectId : keyParam.nameL + '-' + o.id,
            label     : inobj.getTip(o),
            position  : ['below'],
            id        : keyParam.nameL + 'Tip' + (++toolTipSeq)
        });
        toolTips[o.id] = keyParam.nameL + 'Tip' + toolTipSeq;
    }

    // 右側リストへ行挿入
    var insertRightTable = function(tbody, o){
        var rowId = keyParam.rowR + '-' + o.id;
        var r = tbody.rows.length;
        var row = dojo.create('tr', { id: rowId, className: 'sele ' + ((r%2)==0 ? 'even' : 'odd') }, tbody);
        var cell = dojo.create('td', { width: '24px' }, row);
        cell.style.border = 'none';
        dojo.create('input', { type: 'checkbox' }, cell);
        cell = dojo.create('td', { width: '181px' }, row);
        cell.style.textAlign = 'left';
        cell.style.border    = 'none';
        cell.style.cursor    = 'pointer';
        if(eventHandles[rowId + 's']){
            dojo.disconnect(eventHandles[rowId + 's']);
            dojo.disconnect(eventHandles[rowId + 'd']);
        }
        eventHandles[rowId + 's'] = dojo.connect(cell, 'onclick'   , clickRow);
        eventHandles[rowId + 'd'] = dojo.connect(cell, 'ondblclick', dblclickRow);
        dojo.create('div', {
            innerHTML  : o.name,
            id         : keyParam.nameR + '-' + o.id,
            style      : { wordBreak:"break-all" }
        }, cell);
        new dijit.Tooltip({
            connectId : keyParam.nameR + '-' + o.id,
            label     : inobj.getTip(o),
            position  : ['below'],
            id        : keyParam.nameR + 'Tip' + (++toolTipSeq)
        });
        toolTips[o.id] = keyParam.nameR + 'Tip' + toolTipSeq;
    }

    var open = function(_inobj, _onfinishfunc){
        var table, tbody, row, cell, a, r, rowMax, rowCount;

        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        setDialogPosition(dialog, 200, 450 + inobj.plusY);

        dojo.byId(keyParam.checkL).checked = false;
        dojo.byId(keyParam.checkR).checked = false;
        dojo.byId(keyParam.title).innerHTML = inobj.title;

        // 全パターンリストを選択済み(rights)、非選択(lefts)に分ける
        lefts = [];
        rights = [];
        var map = {};
        for(var i = 0 ; i < inobj.items.length ; i++){
            var mp = inobj.items[i];
            var order = 0;
            for(var j = 0 ; j < inobj.selectItems.length ; j++){
                var p = inobj.selectItems[j];
                if(mp.id == p.id){
                    order = (j + 1);
                    break;
                }
            }
            if(!order){
                lefts.push(mp);
            }else{
                map[mp.id] = order;
                rights.push(mp);
            }
        }
        rights = rights.sort(function(a, b){
            return map[a.id] - map[b.id];
        });
        // 左側リスト
        tbody = dojo.byId(keyParam.tableL).getElementsByTagName('tbody')[0];
        while(tbody.firstChild){
            tbody.removeChild(tbody.firstChild);
        }
        for(r = 0 ; r < lefts.length ; r++){
            insertLeftTable(tbody, lefts[r]);
        }
        // 右側リスト
        tbody = dojo.byId(keyParam.tableR).getElementsByTagName('tbody')[0];
        while(tbody.firstChild){
            tbody.removeChild(tbody.firstChild);
        }
        for(r = 0 ; r < rights.length ; r++){
            insertRightTable(tbody, rights[r]);
        }

        dialog.show();
    };

    var clickRow = function(_e){
        var e = (_e ? _e : window.event);
        var node = e.target;
        var row = (node.tagName == 'DIV' ? node.parentNode.parentNode : node.parentNode);
        row.cells[0].firstChild.checked = (row.cells[0].firstChild.checked ? false : true);
        e.preventDefault();
        e.stopPropagation();
    };

    var dblclickRow = function(_e){
        var e = (_e ? _e : window.event);
        var node = e.target;
        var row = (node.tagName == 'DIV' ? node.parentNode.parentNode : node.parentNode);
        row.cells[0].firstChild.checked = (row.cells[0].firstChild.checked ? false : true);
        if(/.+SelRow([LR])-(.+)/.test(row.id)){
            var face = (RegExp.$1 == 'L' ? 0 : 1);
            var id = RegExp.$2;
            var tbodyF = dojo.byId(keyParam['table' + (!face ? 'L' : 'R')]).getElementsByTagName('tbody')[0]; // 移動元リスト
            var tbodyT = dojo.byId(keyParam['table' + (!face ? 'R' : 'L')]).getElementsByTagName('tbody')[0]; // 移動先リスト
            moveLR(face, tbodyF, tbodyT, [ id ], [ row.rowIndex ]);
        }
        e.preventDefault();
        e.stopPropagation();
    };

    var saveAndClose = function(){
        var tbody, r, map = {};
        // 右側リストのidを取得
        tbody = dojo.byId(keyParam.tableR).getElementsByTagName('tbody')[0];
        for(r = 0 ; r < tbody.rows.length ; r++){
            if(/.+SelRowR-(.+)/.test(tbody.rows[r].id)){
                map[RegExp.$1] = (r + 1);
            }
        }
        onfinishfunc(map);
        close();
    };

    var close = function(){
        dialog.hide();
    };

    return {
        open  : open
    };
}; // ATK.dialog.itemSelectDialog

ATK.dialog.patternSchedDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10001113'), // 適用日設定
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:400px;">'
            + '  <table class="ts_a_frame">'
            + '  <tr>'
            + '    <td colspan="3" id="schedTitle" style="padding:0px 0px 10px 8px;text-align:left;font-size:13px;color:#444444;font-weight:bold;word-break:break-all;">'
            + '    </td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgelt"></td>'
            + '    <td class="edgeht"></td>'
            + '    <td class="edgert"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgevl"></td>'
            + '    <td>'
            + '      <div class="edge_div">'
            + '        <table class="stand_table">'
            + '        <tr>'
            + '          <td style="padding-left:8px;">'
            + '            <div style="font-family:verdana;font-size:13px;font-weight:bold;color:#444444;margin-bottom:12px;">' + teasp.message.getLabel('tk10000595') + '</div>' // 適用日
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td style="padding-left:28px;">'
            + '            <table class="stand_table">'
            + '            <tr>'
            + '              <td>'
            + '                <table style="width:100px;">'
            + '                <tr><td style="padding-bottom:6px;"><label><input type="radio" name="schedOption" id="schedOption1" /> ' + teasp.message.getLabel('tk10000510') + '</label></td></tr>' // 毎週
            + '                <tr><td style="padding-bottom:6px;"><label><input type="radio" name="schedOption" id="schedOption2" /> ' + teasp.message.getLabel('tk10000513') + '</label></td></tr>' // 毎月
            + '                <tr><td style="padding-bottom:6px;"><label><input type="radio" name="schedOption" id="schedOption3" /> ' + teasp.message.getLabel('tk10000516') + '</label></td></tr>' // 任意日
            + '                </table>'
            + '              </td>'
            + '              <td>'
            + '                <div id="schedOptParam1" style="width:250px;height:60px;vertical-align:middle;">'
            + '                  <table class="pane_table">'
            + '                  <tr>'
            + '                    <td style="padding-right:4px;vertical-align:middle;"><label><input type="checkbox" id="schedW0" /> ' + teasp.message.getLabel('tm00000100') + '</label></td>' // 日
            + '                    <td style="padding-right:4px;vertical-align:middle;"><label><input type="checkbox" id="schedW1" /> ' + teasp.message.getLabel('tm00000101') + '</label></td>' // 月
            + '                    <td style="padding-right:4px;vertical-align:middle;"><label><input type="checkbox" id="schedW2" /> ' + teasp.message.getLabel('tm00000102') + '</label></td>' // 火
            + '                    <td style="padding-right:4px;vertical-align:middle;"><label><input type="checkbox" id="schedW3" /> ' + teasp.message.getLabel('tm00000103') + '</label></td>' // 水
            + '                    <td style="padding-right:4px;vertical-align:middle;"><label><input type="checkbox" id="schedW4" /> ' + teasp.message.getLabel('tm00000104') + '</label></td>' // 木
            + '                    <td style="padding-right:4px;vertical-align:middle;"><label><input type="checkbox" id="schedW5" /> ' + teasp.message.getLabel('tm00000105') + '</label></td>' // 金
            + '                    <td style="padding-right:4px;vertical-align:middle;"><label><input type="checkbox" id="schedW6" /> ' + teasp.message.getLabel('tm00000106') + '</label></td>' // 土
            + '                  </tr>'
            + '                  </table>'
            + '                </div>'
            + '                <div id="schedOptParam2" style="width:250px;height:60px;vertical-align:middle;display:none;">'
            + '                  <table class="pane_table">'
            + '                  <tr>'
            + '                    <td style="padding:2px;white-space:nowrap;"><label><input type="radio" name="schedMonth" id="schedMonth1" /> ' + teasp.message.getLabel('tk10000513') + '</label></td>' // 毎月
            + '                    <td style="padding:2px;">'
            + '                      <select id="schedMonthlyDate" style="width:60px;">'
            + '                        <option value="1">1</option>'
            + '                        <option value="2">2</option>'
            + '                        <option value="3">3</option>'
            + '                        <option value="4">4</option>'
            + '                        <option value="5">5</option>'
            + '                        <option value="6">6</option>'
            + '                        <option value="7">7</option>'
            + '                        <option value="8">8</option>'
            + '                        <option value="9">9</option>'
            + '                        <option value="10">10</option>'
            + '                        <option value="11">11</option>'
            + '                        <option value="12">12</option>'
            + '                        <option value="13">13</option>'
            + '                        <option value="14">14</option>'
            + '                        <option value="15">15</option>'
            + '                        <option value="16">16</option>'
            + '                        <option value="17">17</option>'
            + '                        <option value="18">18</option>'
            + '                        <option value="19">19</option>'
            + '                        <option value="20">20</option>'
            + '                        <option value="21">21</option>'
            + '                        <option value="22">22</option>'
            + '                        <option value="23">23</option>'
            + '                        <option value="24">24</option>'
            + '                        <option value="25">25</option>'
            + '                        <option value="26">26</option>'
            + '                        <option value="27">27</option>'
            + '                        <option value="28">28</option>'
            + '                        <option value="32">' + teasp.message.getLabel('tk10001114') + '</option>' // 最終
            + '                      </select>'
            + '                    </td>'
            + '                    <td style="padding:2px;" colspan="2">' + teasp.message.getLabel('day_label') + '</td>' // 日
            + '                  </tr>'
            + '                  <tr style="height:4px;">'
            + '                    <td colspan="4">'
            + '                    </td>'
            + '                  </tr>'
            + '                  <tr>'
            + '                    <td style="padding:2px;white-space:nowrap;"><label><input type="radio" name="schedMonth" id="schedMonth2" /> ' + teasp.message.getLabel('tk10000513') + '</label></td>' // 毎月
            + '                    <td style="padding:2px;">'
            + '                      <select id="schedMonthlyLine" style="width:60px;">'
            + '                        <option value="1">' + teasp.message.getLabel('tk10003920') + '</option>' // 第1
            + '                        <option value="2">' + teasp.message.getLabel('tk10003930') + '</option>' // 第2
            + '                        <option value="3">' + teasp.message.getLabel('tk10003940') + '</option>' // 第3
            + '                        <option value="4">' + teasp.message.getLabel('tk10003950') + '</option>' // 第4
            + '                        <option value="5">' + teasp.message.getLabel('tk10001114') + '</option>' // 最終
            + '                      </select>'
            + '                    </td>'
            + '                    <td style="padding:2px;width:50px;">'
            + '                      <select id="schedMonthlyWeek">'
            + '                        <option value="0">' + teasp.message.getLabel('tm00000100') + '</option>' // 日
            + '                        <option value="1">' + teasp.message.getLabel('tm00000101') + '</option>' // 月
            + '                        <option value="2">' + teasp.message.getLabel('tm00000102') + '</option>' // 火
            + '                        <option value="3">' + teasp.message.getLabel('tm00000103') + '</option>' // 水
            + '                        <option value="4">' + teasp.message.getLabel('tm00000104') + '</option>' // 木
            + '                        <option value="5">' + teasp.message.getLabel('tm00000105') + '</option>' // 金
            + '                        <option value="6">' + teasp.message.getLabel('tm00000106') + '</option>' // 土
            + '                      </select>'
            + '                    </td>'
            + '                    <td style="padding:2px;">' + teasp.message.getLabel('tk10000511') + '</td>' // 曜日
            + '                  </tr>'
            + '                  </table>'
            + '                </div>'
            + '              </td>'
            + '            </tr>'
            + '            </table>'
            + '          </td>'
            + '        </tr>'
            + '        </table>'
            + '      </div>'
            + '    </td>'
            + '    <td class="edgevr"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgelb"></td>'
            + '    <td class="edgehb"></td>'
            + '    <td class="edgerb"></td>'
            + '  </tr>'
            + '  </table>'
            + '  <table class="pane_table" style="width:100%;">'
            + '  <tr id="patternScheErrorRow" style="display:none;">'
            + '    <td style="text-align:center;">'
            + '      <div id="patternScheError" style="color:red;margin:4px;"></div>'
            + '    </td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td style="padding:16px 0px 4px 0px;text-align:center;">'
            + '      <input type="button" class="pb_base pb_btn_ok" id="patternScheOk">'
            + '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '      <input type="button" class="pb_base pb_btn_cancel" id="patternScheCancel">'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '</div>');

        dojo.byId('patternScheOk').onclick = saveAndClose;
        dojo.byId('patternScheCancel').onclick = close;
        dojo.byId('schedOption1').onclick = changedSchedOption;
        dojo.byId('schedOption2').onclick = changedSchedOption;
        dojo.byId('schedOption3').onclick = changedSchedOption;
        dojo.byId('schedMonth1').onclick  = changedSchedMonth;
        dojo.byId('schedMonth2').onclick  = changedSchedMonth;

        dialog.startup();
    };

    var changedSchedOption = function(){
        dojo.style('schedOptParam1', 'display', (dojo.byId('schedOption1').checked ? '' : 'none'));
        dojo.style('schedOptParam2', 'display', (dojo.byId('schedOption2').checked ? '' : 'none'));
    };

    var changedSchedMonth = function(){
        dojo.byId('schedMonthlyDate').disabled = (dojo.byId('schedMonth2').checked);
        dojo.byId('schedMonthlyLine').disabled = (dojo.byId('schedMonth1').checked);
        dojo.byId('schedMonthlyWeek').disabled = (dojo.byId('schedMonth1').checked);
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        setDialogPosition(dialog, 240, 480 + inobj.plusY);

        showError(null);

        for(var i = 0 ; i < 7 ; i++){
            dojo.byId('schedW' + i).checked = false;
        }
        dojo.byId('schedMonth1').checked = true;
        dojo.byId('schedMonth2').checked = false;
        dojo.byId('schedMonthlyDate').value = '1';
        dojo.byId('schedMonthlyLine').value = '1';
        dojo.byId('schedMonthlyWeek').value = '0';

        var o = inobj.obj;
        o.schedOption = (o.schedOption || '0');
        dojo.byId('schedTitle').innerHTML = teasp.message.getLabel('tk10001116', inobj.name); // '勤務パターン「{0}」の適用日を設定してください。
        dojo.byId('schedOption1').checked = (o.schedOption == '1');
        dojo.byId('schedOption2').checked = (o.schedOption == '2' || o.schedOption == '3');
        dojo.byId('schedOption3').checked = (o.schedOption == '0');
        if(o.schedOption == '1'){
            for(i = 0 ; i < 7 ; i++){
                dojo.byId('schedW' + i).checked = (o.schedWeekly.indexOf('' + i) >= 0);
            }
        }else if(o.schedOption == '2' || o.schedOption == '3'){
            dojo.byId('schedMonth1').checked = (o.schedOption == '2');
            dojo.byId('schedMonth2').checked = (o.schedOption != '2');
            if(o.schedOption == '2'){
                dojo.byId('schedMonthlyDate').value = '' + o.schedMonthlyDate;
            }else{
                dojo.byId('schedMonthlyLine').value = o.schedMonthlyLine;
                dojo.byId('schedMonthlyWeek').value = o.schedMonthlyWeek;
            }
        }
        changedSchedOption();
        changedSchedMonth();
        dialog.show();
    };

    var showError = function(msg){
        dojo.style('patternScheErrorRow', 'display', (msg ? '' : 'none'));
        dojo.byId('patternScheError').innerHTML = (msg ? msg : '');
    };

    var saveAndClose = function(){
        var resObj = dojo.clone(inobj);
        var o = resObj.obj;
        if(dojo.byId('schedOption1').checked){
            o.schedOption = '1';
            var buf = '';
            for(var i = 0 ; i < 7 ; i++){
                if(dojo.byId('schedW' + i).checked){
                    buf += ('' + i);
                }
            }
            if(buf == ''){
                showError(teasp.message.getLabel('tk10001117')); // 曜日を選択してください
                return;
            }
            o.schedWeekly = buf;
        }else if(dojo.byId('schedOption2').checked){
            if(dojo.byId('schedMonth1').checked){
                o.schedOption = '2';
                o.schedMonthlyDate = parseInt(dojo.byId('schedMonthlyDate').value, 10);
            }else{
                o.schedOption = '3';
                o.schedMonthlyLine = dojo.byId('schedMonthlyLine').value;
                o.schedMonthlyWeek = dojo.byId('schedMonthlyWeek').value;
            }
        }else{
            o.schedOption = '0';
        }
        onfinishfunc(resObj);
        close();
    };

    var close = function(){
        dialog.hide();
    };

    return {
        open  : open
    };
}; // ATK.dialog.patternSchedDialog

ATK.dialog.yuqProvideDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10001118'), // 付与日数設定
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:460px;">'
            + '  <table class="ts_a_frame">'
            + '  <tr>'
            + '    <td class="edgelt"></td>'
            + '    <td class="edgeht"></td>'
            + '    <td class="edgert"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgevl"></td>'
            + '    <td>'
            + '      <div class="edge_div">'
            + '        <table class="stand_table">'
            + '        <tr>'
            + '          <td class="left_s">'
            + teasp.message.getLabel('tk10000606') // 継続勤務日数
            + '          </td>'
            + '          <td class="right">'
            + '              <input type="text" value="" id="yuqProvideYear" maxlength="2" class="inputran inputtex" style="width:40px;text-align:center;padding:1px;font-family:verdana;"/>&nbsp;'
            + teasp.message.getLabel('tk10000062') // 年
            + '              &nbsp;'
            + '              <select id="yuqProvideMonth" style="vertical-align:middle;font-family:verdana;">'
            + '                <option value="0">0</option>'
            + '                <option value="1">1</option>'
            + '                <option value="2">2</option>'
            + '                <option value="3">3</option>'
            + '                <option value="4">4</option>'
            + '                <option value="5">5</option>'
            + '                <option value="6">6</option>'
            + '                <option value="7">7</option>'
            + '                <option value="8">8</option>'
            + '                <option value="9">9</option>'
            + '                <option value="10">10</option>'
            + '                <option value="11">11</option>'
            + '              </select>&nbsp;'
            + teasp.message.getLabel('tm10009040') // ヶ月
            + '              <span id="yuqProvideRange"></span>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left_s">'
            + teasp.message.getLabel('yuqProvide_head') // 付与日数
            + '          </td>'
            + '          <td class="right">'
            + '              <input type="text" value="" id="yuqProvideDays" maxlength="2" class="inputran inputtex" style="width:40px;text-align:center;padding:1px;font-family:verdana;"/>&nbsp;'
            + teasp.message.getLabel('days_label') // 日
            + '          </td>'
            + '        </tr>'
            + '        </table>'
            + '      </div>'
            + '    </td>'
            + '    <td class="edgevr"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgelb"></td>'
            + '    <td class="edgehb"></td>'
            + '    <td class="edgerb"></td>'
            + '  </tr>'
            + '  </table>'
            + '  <table class="pane_table" style="width:100%;">'
            + '  <tr id="yuqProvideErrorRow" style="display:none;">'
            + '    <td style="text-align:center;">'
            + '      <div id="yuqProvideError" style="color:red;margin:4px;"></div>'
            + '    </td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td style="padding:16px 0px 4px 0px;text-align:center;">'
            + '      <input type="button" class="pb_base pb_btn_ok" id="yuqProvideOk">'
            + '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '      <input type="button" class="pb_base pb_btn_cancel" id="yuqProvideCancel">'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '</div>');

        dojo.byId('yuqProvideOk').onclick = function(){ saveAndClose(); };
        dojo.byId('yuqProvideCancel').onclick = function(){ close(); };

        dojo.query('input[type="text"]', dialog.domNode).forEach(function(el){
            dojo.connect(el, 'onblur'    , blurNum);
            dojo.connect(el, 'onkeypress', keypressNum);
        });

        dialog.startup();
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        setDialogPosition(dialog, 240, 500 + inobj.plusY);

        showError(null);

        var o = (inobj.obj || {});
        dojo.byId('yuqProvideYear' ).value = '' + (o.year === 0 ? 0 : (o.year || ''));
        dojo.byId('yuqProvideMonth').value = '' + (o.month || 0);
        dojo.byId('yuqProvideDays' ).value = '' + (o.provide || '');

        dojo.byId('yuqProvideRange').innerHTML = ' ' + teasp.message.getLabel(inobj.lessThan ? 'tf10009610' : 'tf10009590');

        dialog.show();
    };

    var showError = function(msg){
        dojo.style('yuqProvideErrorRow', 'display', (msg ? '' : 'none'));
        dojo.byId('yuqProvideError').innerHTML = (msg ? msg : '');
    };

    var saveAndClose = function(){
        var o = (inobj.obj ? dojo.clone(inobj.obj) : { year: 0, month: 0, provide: 0, suffix: '0' });
        o.month  = parseInt(dojo.byId('yuqProvideMonth').value, 10);
        var y = dojo.byId('yuqProvideYear').value.trim();
        var p = dojo.byId('yuqProvideDays').value.trim();
        if(y != ''){
            if(!/^\d+$/.test(y)){
                showError(teasp.message.getLabel('tk10001119')); // 年の値が正しくありません
                return;
            }
            o.year = parseInt(y, 10);
        }else{
            o.year = 0;
        }
        if(p == ''){
            showError(teasp.message.getLabel('tk10001120')); // 付与日数を設定してください
            return;
        }else{
            if(!/^\d+$/.test(p)){
                showError(teasp.message.getLabel('tk10001121')); // 付与日数の値が正しくありません
                return;
            }
            o.provide = parseInt(p, 10);
        }
        o.days = inobj.lessThan ? -1 : 0;
        var m = (o.year * 12 + o.month);
        var error = onfinishfunc(o);
        if(error){
            showError(error);
            return;
        }
        close();
    };

    var blurNum = function(e){
        var zn = '０１２３４５６７８９';
        var v = e.target.value;
        var n = null;
        for(var i = 0 ; i < v.length ; i++){
            var ch = v.substring(i, i + 1);
            var x = zn.indexOf(ch);
            if(x >= 0){
                n = ((n || 0) * 10) + x;
            }else if(ch >= '0' && ch <= '9'){
                n = ((n || 0) * 10) + parseInt(ch, 10);
            }
        }
        e.target.value = (n === null ? '' : '' + n);
    };

    var keypressNum = function(e){
        if (e.keyCode === 13){
            blurNum(e);
        }
    };

    var close = function(){
        var scrollTop = document.body.scrollTop;
        dialog.hide();
        document.body.scrollTop = scrollTop;
    };

    return {
        open  : open
    };
}; // ATK.dialog.yuqProvideDialog

// 勤怠設定の改訂
ATK.dialog.configGenRevDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10001123'), // 勤怠設定の改定
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:380px;">'
            + '  <table class="ts_a_frame">'
            + '  <tr>'
            + '    <td colspan="3" style="padding:2px 8px 16px 8px;text-align:center;font-weight:bold;">'
            + teasp.message.getLabel('tk10001124') // 開始月度を設定してください
            + '    </td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgelt"></td>'
            + '    <td class="edgeht"></td>'
            + '    <td class="edgert"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgevl"></td>'
            + '    <td>'
            + '      <div class="edge_div">'
            + '        <table class="stand_table">'
            + '        <tr>'
            + '          <td class="left_s">'
            + teasp.message.getLabel('tk10001125') // 開始月度
            + '          </td>'
            + '          <td class="right">'
            + '              <input type="text" value="" id="configGenRevYear" maxlength="4" class="inputran inputtex" style="width:48px;text-align:center;padding:1px;font-family:verdana;"/> '
            + teasp.message.getLabel('tk10000062') // 年
            + '              &nbsp;'
            + '              <select id="configGenRevMonth" style="vertical-align:middle;font-family:verdana;">'
            + '                <option value="1">1</option>'
            + '                <option value="2">2</option>'
            + '                <option value="3">3</option>'
            + '                <option value="4">4</option>'
            + '                <option value="5">5</option>'
            + '                <option value="6">6</option>'
            + '                <option value="7">7</option>'
            + '                <option value="8">8</option>'
            + '                <option value="9">9</option>'
            + '                <option value="10">10</option>'
            + '                <option value="11">11</option>'
            + '                <option value="12">12</option>'
            + '              </select> '
            + teasp.message.getLabel('tk10000063') // 月度
            + '              &nbsp;'
            + '          </td>'
            + '        </tr>'
            + '        </table>'
            + '      </div>'
            + '    </td>'
            + '    <td class="edgevr"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgelb"></td>'
            + '    <td class="edgehb"></td>'
            + '    <td class="edgerb"></td>'
            + '  </tr>'
            + '  </table>'
            + '  <table class="pane_table" style="width:100%;">'
            + '  <tr id="configGenRevErrorRow" style="display:none;">'
            + '    <td style="text-align:center;">'
            + '      <div id="configGenRevError" style="color:red;margin:4px;"></div>'
            + '    </td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td style="padding:16px 0px 4px 0px;text-align:center;">'
            + '      <input type="button" class="pb_base pb_btn_ok" id="configGenRevOk">'
            + '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '      <input type="button" class="pb_base pb_btn_cancel" id="configGenRevCancel">'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '</div>');

        dojo.byId('configGenRevOk').onclick = function(){ saveAndClose(); };
        dojo.byId('configGenRevCancel').onclick = function(){ close(); };

        dialog.startup();
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        setDialogPosition(dialog, 240, 280);

        showError(null);

        var d = new Date();
        d = dojo.date.add(d, 'month', 1);
        dojo.byId('configGenRevYear').value = d.getFullYear();
        dojo.byId('configGenRevMonth').value = (d.getMonth() + 1);

        dialog.show();
    };

    var showError = function(msg){
        dojo.style('configGenRevErrorRow', 'display', (msg ? '' : 'none'));
        dojo.byId('configGenRevError').innerHTML = (msg ? msg : '');
    };

    var saveAndClose = function(){
        var _y = dojo.byId('configGenRevYear').value;
        var m = dojo.byId('configGenRevMonth').value;
        if(!/\d{4}/.test(_y)){
            showError(teasp.message.getLabel('tk10001126')); // 開始年は西暦で指定してください
            return;
        }
        var y = parseInt(_y, 10);
        if(y < 1900 || y > 2999){
            showError(teasp.message.getLabel('tk10001126')); // 開始年は西暦で指定してください
            return;
        }
        showError(null);
        ATK.dialog.BusyWait.open();
        ATK.ajax.requestSend({
            action     : "createRevisionConfig",
            empTypeId  : inobj.empTypeId,
            yearMonth  : y * 100 + parseInt(m, 10)
        }, null, funcAction, recieveFunction, recieveError);
    };

    // AJAX正常戻り値処理
    function recieveFunction(o){
        ATK.dialog.BusyWait.close();
        onfinishfunc(o);
        close();
    }

    // AJAX異常戻り値処理
    var recieveError = function(o){
        ATK.dialog.BusyWait.close();
        teasp.tsAlert(teasp.message.getLabel('tm00000010', o.error.message));
    };

    var close = function(){
        dialog.hide();
    };

    return {
        open  : open
    };
}; // ATK.dialog.configGenRevDialog

// 勤怠設定の期間変更（削除）
ATK.dialog.configRangeDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10001127'), // 期間変更
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:460px;">'
            + '  <table class="ts_a_frame">'
            + '  <tr>'
            + '    <td class="edgelt"></td>'
            + '    <td class="edgeht"></td>'
            + '    <td class="edgert"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgevl"></td>'
            + '    <td>'
            + '      <div class="edge_div">'
            + '        <table class="stand_table">'
            + '        <tr>'
            + '          <td class="left_s">'
            + '            <label><input type="radio" name="configRangeOption" id="configRangeOption1"/> ' + teasp.message.getLabel('tk10001125') + '</label>' // 開始月度
            + '          </td>'
            + '          <td class="right">'
            + '              <input type="text" value="" id="configRangeYear" maxlength="4" class="inputran inputtex" style="width:48px;text-align:center;padding:1px;font-family:verdana;"/> '
            + teasp.message.getLabel('tk10000062') // 年
            + '              &nbsp;'
            + '              <select id="configRangeMonth" style="vertical-align:middle;font-family:verdana;">'
            + '                <option value="1">1</option>'
            + '                <option value="2">2</option>'
            + '                <option value="3">3</option>'
            + '                <option value="4">4</option>'
            + '                <option value="5">5</option>'
            + '                <option value="6">6</option>'
            + '                <option value="7">7</option>'
            + '                <option value="8">8</option>'
            + '                <option value="9">9</option>'
            + '                <option value="10">10</option>'
            + '                <option value="11">11</option>'
            + '                <option value="12">12</option>'
            + '              </select> '
            + teasp.message.getLabel('tk10001128') // 月に変更
            + '              &nbsp;'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td class="left_s">'
            + '            <label><input type="radio" name="configRangeOption" id="configRangeOption2"/> ' + teasp.message.getLabel('tk10001129') + '</label>' // 削除する
            + '          </td>'
            + '          <td class="right">'
            + '          </td>'
            + '        </tr>'
            + '        </table>'
            + '      </div>'
            + '    </td>'
            + '    <td class="edgevr"></td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td class="edgelb"></td>'
            + '    <td class="edgehb"></td>'
            + '    <td class="edgerb"></td>'
            + '  </tr>'
            + '  </table>'
            + '  <table class="pane_table" style="width:100%;">'
            + '  <tr id="configRangeErrorRow" style="display:none;">'
            + '    <td style="text-align:center;">'
            + '      <div id="configRangeError" style="color:red;margin:4px;"></div>'
            + '    </td>'
            + '  </tr>'
            + '  <tr>'
            + '    <td style="padding:16px 0px 4px 0px;text-align:center;">'
            + '      <input type="button" class="pb_base pb_btn_ok" id="configRangeOk">'
            + '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '      <input type="button" class="pb_base pb_btn_cancel" id="configRangeCancel">'
            + '    </td>'
            + '  </tr>'
            + '  </table>'
            + '</div>');

        dojo.byId('configRangeOk').onclick = function(){ saveAndClose(); };
        dojo.byId('configRangeCancel').onclick = function(){ close(); };

        dialog.startup();
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        setDialogPosition(dialog, 230, 280);
        enableButton(true);

        showError(null);

        var config = inobj.config;
        var yy = Math.floor(config.validStartMonth / 100);
        var mm = config.validStartMonth % 100;
        dojo.byId('configRangeYear').value = yy;
        dojo.byId('configRangeMonth').value = mm;
        dojo.byId('configRangeOption1').checked = true;
        dojo.byId('configRangeOption2').checked = false;

        dialog.show();
    };

    var showError = function(msg){
        dojo.style('configRangeErrorRow', 'display', (msg ? '' : 'none'));
        dojo.byId('configRangeError').innerHTML = (msg ? msg : '');
    };

    var saveAndClose = function(){
        var config = inobj.config;
        var cmd = {};
        showError(null);
        if(dojo.byId('configRangeOption1').checked){
            var prevConfig = inobj.prevConfig;
            var _y = dojo.byId('configRangeYear').value;
            var _m = dojo.byId('configRangeMonth').value;
            if(!/\d{4}/.test(_y)){
                showError(teasp.message.getLabel('tk10001130')); // 開始月度は西暦で指定してください
                return;
            }
            var y = parseInt(_y, 10);
            if(y < 1900 || y > 2999){
                showError(teasp.message.getLabel('tk10001130')); // 開始月度は西暦で指定してください
                return;
            }
            var ym = y * 100 + parseInt(_m, 10);
            if(config.validEndMonth && ym > config.validEndMonth){
                showError(teasp.message.getLabel('tk10001131')); // 開始月度は期間の終了月度を超える月度を指定できません
                return;
            }
            if(prevConfig && prevConfig.validStartMonth && ym <= prevConfig.validStartMonth){
                showError(teasp.message.getLabel('tk10001132')); // 前世代の期間の開始月度より以前の月度を指定できません
                return;
            }
            if(config.validStartMonth == ym){
                showError(teasp.message.getLabel('tk10001133')); // 変更はありません
                return;
            }
            cmd = {
                action     : "changeRangeConfig",
                empTypeId  : inobj.empTypeId,
                configId   : config.id,
                yearMonth  : ym
            };
            enableButton(false);
            ATK.dialog.BusyWait.open();
            ATK.ajax.requestSend(cmd, null, funcAction, recieveFunction, recieveError);
        }else{
            // 削除すると元にもどせません。よろしいですか？
            teasp.tsConfirm(teasp.message.getLabel('tk10001134'), null, function(confirmOk){
                if(confirmOk){
                    cmd = {
                        action     : "deleteRangeConfig",
                        empTypeId  : inobj.empTypeId,
                        configId   : config.id
                    };
                    enableButton(false);
                    ATK.dialog.BusyWait.open();
                    ATK.ajax.requestSend(cmd, null, funcAction, recieveFunction, recieveError);
                }
            });
        }
    };

    // AJAX正常戻り値処理
    function recieveFunction(o){
        ATK.dialog.BusyWait.close();
        onfinishfunc(o);
        setTimeout(function(){ close(); }, 100);
    }

    // AJAX異常戻り値処理
    var recieveError = function(o){
        ATK.dialog.BusyWait.close();
        enableButton(true);
        teasp.tsAlert(teasp.message.getLabel('tm00000010', o.error.message));
    };

    var close = function(){
        dialog.hide();
    };

    var enableButton = function(flag){
        dojo.byId('configRangeOk').disabled = !flag;
        dojo.byId('configRangeCancel').disabled = !flag;
    };

    return {
        open  : open
    };
}; // ATK.dialog.configRangeDialog

/*
 * 削除オプションダイアログ
 */
ATK.dialog.invalidateDialog = function(common){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tk10001135'), // 削除または無効化
            id       : "invalidateDialog",
            duration : 300
        });

        dialog.attr('content',
              '<div class="dlg_content" style="width:370px;">'
            + '    <table class="ts_a_frame">'
            + '    <tr>'
            + '        <td class="edgelt"></td>'
            + '        <td class="edgeht"></td>'
            + '        <td class="edgert"></td>'
            + '    </tr>'
            + '    <tr>'
            + '        <td class="edgevl"></td>'
            + '        <td>'
            + '            <div class="edge_div"  style="padding:4px 4px 8px 4px;">'
            + '                <table class="stand_table">'
            + '                <tr>'
            + '                    <td colSpan="2" style="padding:4px 12px;font-family:verdana;font-size:12px;">'
            + '                        <div id="invalidateTarget" style="word-break:break-all;"></div>'
            + '                    </td>'
            + '                </tr>'
            + '                <tr id="invalidateWarnRow" style="display:none;">'
            + '                    <td colSpan="2" style="padding:0px 12px;font-family:verdana;font-size:12px;color:red;text-decoration:underline;">'
            + '                        <div id="invalidateWarn"></div>'
            + '                    </td>'
            + '                </tr>'
            + '                <tr>'
            + '                    <td colSpan="2" style="padding-top:12px;padding-left:28px;font-family:verdana;font-size:12px;">'
            + '                        <label><input type="radio" name="invalidateOption" id="invalidateOption1"/> ' + teasp.message.getLabel('tk10001136') + '</label>' // 完全に削除する
            + '                    </td>'
            + '                </tr>'
            + '                <tr>'
            + '                    <td style="padding-top:4px;padding-left:28px;font-family:verdana;font-size:12px;">'
            + '                        <label><input type="radio" name="invalidateOption" id="invalidateOption2"/> <span id="invalidateEndLabel"></span>' + '</label>' // を設定する
            + '                    </td>'
            + '                    <td  class="right">'
            + '                        <input type="text" value="" id="invalidateDate" maxlength="12" class="inputran inputtex" style="width:90px;text-align:center;"/>'
            + '                        &nbsp;'
            + '                        <input type="button" class="pp_base pp_btn_cal" id="invalidateDateCal" />'
            + '                    </td>'
            + '                </tr>'
            + '                </table>'
            + '            </div>'
            + '        </td>'
            + '        <td class="edgevr"></td>'
            + '    </tr>'
            + '    <tr>'
            + '        <td class="edgelb"></td>'
            + '        <td class="edgehb"></td>'
            + '        <td class="edgerb"></td>'
            + '    </tr>'
            + '    </table>'
            + '    <table class="pane_table" style="width:100%;">'
            + '    <tr id="invalidateErrorRow" style="display:none;">'
            + '        <td style="text-align:center;">'
            + '            <div id="invalidateError" style="color:red;margin:4px;">'
            + '            </div>'
            + '        </td>'
            + '    </tr>'
            + '    <tr>'
            + '        <td style="padding:16px 0px 4px 0px;text-align:center;">'
            + '            <input type="button" class="pb_base pb_btn_regist" id="invalidateOk">'
            + '            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            + '            <input type="button" class="pb_base pb_btn_cancel" id="invalidateCancel">'
            + '        </td>'
            + '    </tr>'
            + '    </table>'
            + '</div>');

        dojo.byId('invalidateOk').onclick = saveAndClose;
        dojo.byId('invalidateCancel').onclick = close;
        dojo.byId('invalidateDateCal').onclick = changeDate;

        dojo.connect(dojo.byId('invalidateDate'), 'onkeypress', function(e) { choiceOption(2); });

        dialog.startup();
    };

    // カレンダーで変更日付選択
    var changeDate = function(){
        choiceOption(2);
        var d = dojo.date.locale.parse(dojo.byId('invalidateDate').value, DATE_FORM_S);
        ATK.dialog.Calendar.open({
            date : (d || null),
            isDisabledDateFunc: function(d) { return false; }
        }, function(ro){
            dojo.byId('invalidateDate').value = dojo.date.locale.format(ro, DATE_FORM_S);
        });
    };

    // logic:
    var choiceOption = function(num){
        dojo.byId('invalidateOption1').checked = (num == 1);
        dojo.byId('invalidateOption2').checked = (num == 2);
    };

    // logic: エラーメッセージを表示
    var showError = function(msg){
        dojo.style('invalidateErrorRow', 'display', (msg ? '' : 'none'));
        dojo.byId('invalidateError').innerHTML = (msg ? msg : '');
    };

    // logic: 警告メッセージを表示
    var showWarn = function(msg){
        dojo.style('invalidateWarnRow', 'display', (msg ? '' : 'none'));
        dojo.byId('invalidateWarn').innerHTML = (msg ? msg : '');
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();
        enableButton(true);

        setDialogPosition(dialog, 180, 200 + (inobj.plusY ? inobj.plusY : 40));

        showError(null);
        showWarn(inobj.warning || null);

        dojo.byId('invalidateTarget').innerHTML = inobj.message;
        dojo.byId('invalidateOption1').checked = false;
        dojo.byId('invalidateOption2').checked = true;
        dojo.byId('invalidateEndLabel').innerHTML = teasp.message.getLabel('tk10001137', // {0}を設定する
                                                        (inobj.endLabel || teasp.message.getLabel('tk10001138'))); // 終了日
        dojo.byId('invalidateDate').value = (inobj.defaultEndDate ? teasp.util.date.formatDate(inobj.defaultEndDate, 'SLA') : '');

        dojo.byId('invalidateDialog_title').innerHTML = inobj.title;

        dialog.show();
    };

    // event: キャンセル
    var close = function(){
        dialog.hide();
    };

    var enableButton = function(flag){
        dojo.byId('invalidateOk').disabled = !flag;
        dojo.byId('invalidateCancel').disabled = !flag;
    };

    // event: 登録
    var saveAndClose = function(){
        enableButton(false);
        var flag = dojo.byId('invalidateOption1').checked;
        var ed = null;
        if(!flag){
            // 終了日の取得
            var dobj = ATK.util.strToDate(dojo.byId('invalidateDate').value);
            if(dobj.failed > 0){
                showError(dojo.replace(dobj.tmpl, [(inobj.endLabel || teasp.message.getLabel('tk10001138'))])); // 終了日
                enableButton(true);
                return;
            }
            dojo.byId('invalidateDate').value = dobj.dater;
            ed = dobj.datef;
            if(inobj.defaultStartDate){
                var sd = teasp.util.date.parseDate(inobj.defaultStartDate);
                if(sd && dojo.date.compare(sd, dobj.date, 'date') > 0){
                    showError(teasp.message.getLabel('tk10001139', inobj.startLabel, inobj.endLabel));
                    enableButton(true);
                    return;
                }
            }
            if (inobj.usingJsNaviSystem){
                //出張手配が「使用する」になっています。\n出張手配を使用しない場合、チェックを外してください。
                teasp.tsAlert(teasp.message.getLabel('jt11000060'), null, function(){
                    saveAndClose2(flag, ed);
                });
            }else{
                saveAndClose2(flag, ed);
            }
        }
        showError(null);
        if(flag){
            if (inobj.usingJsNaviSystem){
            	 showError(teasp.message.getLabel('jt11000070', inobj.startLabel, inobj.endLabel));//出張手配が「使用する」になっています。\nチェックを外すまで削除できません。
            	 enableButton(true);
            	 return;
            }
            // 【最終確認】\n完全に削除すると元に戻すことはできません。本当に削除してよろしいですか？
            teasp.tsConfirm(teasp.message.getLabel('tk10001140'), null, function(confirmOk){
                if(confirmOk){
                    saveAndClose2(flag, ed);
                }else{
                    enableButton(true);
                }
            });
        }
    };

    var saveAndClose2 = function(flag, ed){
        ATK.dialog.BusyWait.open();
        ATK.ajax.requestSend({
            action      : inobj.action,
            idList      : inobj.idList,
            erase       : flag,
            endDate     : ed,
            searchParam : inobj.searchParam
        }, null, funcAction, recieveDeleted, recieveError);
    };

    // event: サーバから正常値受信
    function recieveDeleted(o){
    	//ユーザーに手動で消させる為、ここでは消さない
    	// 社員削除の場合はJ'sNAVI Jrに削除通知を送信する
    	//if(o.action == 'deleteEmp' && common){
        //	if(common.usingJsNaviSystem && o.idList && o.idList.length > 0){
    	//        ATK.ajax.requestSend({
    	//            action : "deleteJsNaviUser",
    	//            empId  : o.idList[0]
    	//        }, null, funcAction, null, recieveError);
    	//    }
    	//}
    	afterReceiveDeleted(o);
    }
    function afterReceiveDeleted(o){
        ATK.dialog.BusyWait.close();
        onfinishfunc(o);
        close();
    }

    // event: サーバから異常値受信
    var recieveError = function(o){
        ATK.dialog.BusyWait.close();
        showError(o.error.message);
        enableButton(true);
    };

    return {
        open  : open
    };
};  // ATK.dialog.invalidateDialog

/*
 * 承認申請を承認／却下ダイアログ
 */
ATK.dialog.approvalDialog = function(){
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;

    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tm30004020'), /*承認申請を承認／却下*/
            id       : "approvalDialog",
            duration : 300
        });

        dialog.attr('content',
            '<table class="approval_table"><tbody><tr><td style="text-align:left;"><div id="approvalMessageCell" style="margin:4px;"></div></td></tr><tr><td style="text-align:left;"><div id="approvalCommentCellTitle" style="margin:4px;"></div></td></tr><tr><td style="vertical-align:top;text-align:center;"><textarea id="approvalComment" style="width:500px;height:80px;margin-left:6px;margin-right:6px;" class="inputran"></textarea></td></tr><tr><td style="text-align:center;padding-top:10px;"><table style="margin-left:auto;margin-right:auto;"><tbody><tr><td><input type="button" class="pb_base pb_btn_approve_ok" id="approvalOk" style="margin:2px 12px;"/></td><td><input type="button" class="pb_base pb_btn_approve_ng" id="approvalReject" style="margin:2px 12px;"/></td><td><input type="button" class="pb_base pb_btn_cancel" id="approvalCancel" style="margin:2px 12px;"/></td></tr></tbody></table></td></tr></tbody></table>'
            );

        dojo.byId('approvalOk').onclick = approvalOkFunc;
        dojo.byId('approvalReject').onclick = approvalRejectFunc;
        dojo.byId('approvalCancel').onclick = close;

        dialog.startup();
    };

    var open = function(_inobj, _onfinishfunc){
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        setDialogPosition(dialog, 230, 280);

        //メッセージ埋め込み
        //innerHTML
        teasp.message.setLabelHtml('approvalCommentCellTitle','comment_head'); // コメント

        //  TITLE
        teasp.message.setLabelTitle('approvalCancel','cancel_btn_title'); // キャンセル
        teasp.message.setLabelTitle('approvalOk','tm30004010'); // 承認
        teasp.message.setLabelTitle('approvalReject','tm10003490'); // 却下

        var tmpMessages = [teasp.message.getLabel('tm30004030'),  // 勤務確定の
                           teasp.message.getLabel('tm30004040'),  // 経費確定の
                           teasp.message.getLabel('tm30004050')   // 工数実績確定の
                           ];
        var tmpMessage ='';
        var message = '';
        switch(inobj.objKey){
        case 'empApply':
            tmpMessage = tmpMessages[0];
            break;
        case 'expApply':
            tmpMessage = tmpMessages[1];
            break;
        case 'jobApply':
            tmpMessage = tmpMessages[2];
            break;
        }
        if(inobj.apply.length>1){
            if (inobj.objKey == 'expApply') {
               message = teasp.message.getLabel('tm30004090',inobj.apply.length,tmpMessage); //「 {0}件の{1}承認／却下を一括で行います。」
            } else {
               message = teasp.message.getLabel('tm30004060',inobj.apply.length,tmpMessage); //「 {0}人の{1}承認／却下を一括で行います。」
            }
        }else{
            message = teasp.message.getLabel('tm30004070',tmpMessage); //「 {0}承認／却下を行います。」
        }
        dojo.byId('approvalComment').value = '';
        dojo.byId('approvalMessageCell').innerHTML = message;

        dialog.show();
    };

    // event: キャンセル
    var close = function(){
        dialog.hide();
    };

    function approvalOkFunc() {
        saveAndClose(true);
    }

    function approvalRejectFunc() {
        saveAndClose(false);
    }

    // event: 承認/却下
    function saveAndClose(approve){
        if(checkNumberOfLength()){
            teasp.tsAlert(teasp.message.getLabel('tm30004080')); // コメントの文字列は1000文字までです。
            return;
        }

        var message = dojo.byId('approvalComment').value;

        ATK.dialog.BusyWait.open();
        ATK.ajax.requestSend({
            action      : 'approval',
            comment     : message,
            apply       : inobj.apply,
            approve     : approve
        }, null, funcAction, recieveDeleted, recieveError);
    };

    // 文字列の文字数をチェックする
    function checkNumberOfLength(){
        var txtarea = dojo.byId('approvalComment');
        if(txtarea.value.length>1000){
            return true;
        }
        return false;
    };

    // event: サーバから正常値受信
    function recieveDeleted(o){
        onfinishfunc(o);
        close();
    }

    // event: サーバから異常値受信
    var recieveError = function(o){
        showError(o.error.message);
    };

    return {
        open  : open
    };
};  // ATK.dialog.invalidateDialog

/*
 * 勤務体系変更ダイアログ
 */
ATK.dialog.changeEmpTypeDialog = function(){
	var attached = false;
	var inobj;
	var onfinishfunc;
	var dialog;
	var busy = false;
	var changeable = null;
	var commonConfig;
	var constraintDate = null;

	var attach = function(){
		if(attached){
			return;
		}
		attached = true;

		dialog = new dijit.Dialog({
			title	 : teasp.message.getLabel('tf10009150'), // 勤務体系変更
			id		 : "changeEmpTypeDialog",
			duration : 300,
			closable : false
		});

		dialog.attr('content',
			  '<div class="dlg_content" style="width:450px;">'
			+ '    <table class="ts_a_frame">'
			+ '    <tr>'
			+ '      <td class="edgelt"></td>'
			+ '      <td class="edgeht"></td>'
			+ '      <td class="edgert"></td>'
			+ '    </tr>'
			+ '    <tr>'
			+ '      <td class="edgevl"></td>'
			+ '      <td>'
			+ '        <div class="edge_div">'
			+ '          <table class="stand_table">'
			+ '          <tr>'
			+ '            <td class="left_s">'
			+ teasp.message.getLabel('tk10001092') // 勤務体系名
			+ '            </td>'
			+ '            <td  class="right">'
			+ '                <select id="changeEmpTypeSelect" class="inputran" style="width:240px;">'
			+ '                </select>'
			+ '            </td>'
			+ '          </tr>'
			+ '          <tr>'
			+ '            <td class="left_s">'
			+ teasp.message.getLabel('tf10009250') // 切替日
			+ '            </td>'
			+ '            <td  class="right">'
			+ '              <input type="text" value="" id="changeEmpTypeDate" maxlength="12" class="inputran inputtex" style="width:90px;text-align:center;"/>'
			+ '              &nbsp;<input type="button" class="pp_base pp_btn_cal" id="changeEmpTypeCal" />'
			+ '            </td>'
			+ '          </tr>'
			+ '          <tr>'
			+ '            <td class="left_s">'
			+ '            </td>'
			+ '            <td  class="right">'
			+ '              <div id="changeEmpTypeRestrict" style="font-size:90%;">'
			+ '              </div>'
			+ '            </td>'
			+ '          </tr>'
			+ '          </table>'
			+ '        </div>'
			+ '      </td>'
			+ '      <td class="edgevr"></td>'
			+ '    </tr>'
			+ '    <tr>'
			+ '      <td class="edgelb"></td>'
			+ '      <td class="edgehb"></td>'
			+ '      <td class="edgerb"></td>'
			+ '    </tr>'
			+ '    </table>'
			+ '    <table class="pane_table" style="width:100%;margin-top:4px;">'
			+ '    <tr id="changeEmpTypeCautionRow" style="display:none;">'
			+ '      <td style="text-align:left;">'
			+ '        <div id="changeEmpTypeCaution" style="margin:0px 4px;color:red;"></div>'
			+ '      </td>'
			+ '    </tr>'
			+ '    <tr id="changeEmpTypeMessageRow" style="display:none;">'
			+ '      <td style="text-align:left;">'
			+ '        <div id="changeEmpTypeMessage" style="margin:0px 4px;"></div>'
			+ '      </td>'
			+ '    </tr>'
			+ '    <tr id="changeEmpTypeErrorRow" style="display:none;">'
			+ '      <td style="text-align:left;">'
			+ '        <div id="changeEmpTypeError" style="color:red;margin:0px 4px;"></div>'
			+ '      </td>'
			+ '    </tr>'
			+ '    <tr id="changeEmpTypeButtonsRow">'
			+ '      <td style="padding:4px 0px;text-align:center;">'
			+ '        <input type="button" class="pb_base pb_btn_storage_ok" id="changeEmpTypeOk">'
			+ '        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
			+ '        <input type="button" class="pb_base pb_btn_cancel" id="changeEmpTypeCancel">'
			+ '      </td>'
			+ '    </tr>'
			+ '    <tr id="changeEmpTypeCloseRow" style="display:none;">'
			+ '      <td style="padding:4px 0px;text-align:center;">'
			+ '        <input type="button" class="pb_base pb_btn_close" id="changeEmpTypeClose">'
			+ '      </td>'
			+ '    </tr>'
			+ '    </table>'
			+ '</div>');

		dojo.byId('changeEmpTypeOk').onclick = saveAndClose;
		dojo.byId('changeEmpTypeCancel').onclick = close;
		dojo.byId('changeEmpTypeCal').onclick = changeDate;
		dojo.connect(dialog, 'onCancel', function(){
			if(!busy){
				close();
			}
		});
		dojo.byId('changeEmpTypeClose').onclick = close;

		dialog.startup();
	};

	// カレンダーで変更日付選択
	var changeDate = function(){
		var d = dojo.date.locale.parse(dojo.byId('changeEmpTypeDate').value, DATE_FORM_S);
		ATK.dialog.Calendar.open({
			date : (d || (moment(changeable).isBefore() ? moment().toDate() : changeable) || null),
			isDisabledDateFunc: function(d) {
				return (moment(d).isBefore(changeable) || (constraintDate && d.getDate() != constraintDate));
			}
		}, function(ro){
			dojo.byId('changeEmpTypeDate').value = dojo.date.locale.format(ro, DATE_FORM_S);
		});
	};

	var open = function(_inobj, _onfinishfunc){
		inobj = _inobj;
		onfinishfunc = _onfinishfunc;
		attach();

//		setDialogPosition(dialog, 200, 280);

		showError(null);
		blockUI(false);
		dojo.style('changeEmpTypeCautionRow', 'display', 'none');
		dojo.style('changeEmpTypeMessageRow', 'display', 'none');
		dojo.style('changeEmpTypeCloseRow'  , 'display', 'none');
		dojo.style('changeEmpTypeButtonsRow', 'display', '');

		// 指定可能な最小日付を得る
		commonConfig = (inobj.commonConfig && teasp.decode(inobj.commonConfig, 1)) || {};
		var changeEmpTypeInterval = commonConfig.changeEmpTypeInterval;
		if(typeof(changeEmpTypeInterval) != 'number'){
			changeEmpTypeInterval = 28;
		}
		changeable = (inobj.changeableDate ? teasp.util.date.parseDate(inobj.changeableDate) : null);
		constraintDate = null;

		var historyMaxDate = (inobj.historyMaxDate ? moment(inobj.historyMaxDate) : null);
		if(historyMaxDate){
			historyMaxDate.add(changeEmpTypeInterval, 'days');
			if(moment(changeable).isBefore(historyMaxDate)){
				changeable = historyMaxDate.toDate();
			}
		}

		// 勤務体系プルダウンをセット
		var empTypes = inobj.empTypes;
		var select = dojo.byId('changeEmpTypeSelect');
		dojo.empty(select);
		for(var i = 0 ; i < empTypes.length ; i++){
			var empType = empTypes[i];
			if(!empType.Removed__c){
				dojo.create('option', { value: empType.Id, innerHTML: empType.Name }, select);
			}
		}
		select.value = (inobj.emps && inobj.emps[0].EmpTypeId__c) || '';
		dojo.connect(select, 'onchange', selectedEmpType);
		selectedEmpType();

		dojo.byId('changeEmpTypeDate').value = '';
		dojo.byId('changeEmpTypeDialog_title').innerHTML = teasp.message.getLabel('tf10009150'); // 勤務体系変更
		dojo.byId('changeEmpTypeCaution').innerHTML = teasp.message.getLabel('tf10007160'); // 実行中は画面を閉じないようにしてください。

		dojo.byId('changeEmpTypeRestrict').innerHTML = changeable
			? teasp.message.getLabel('tf10009260', teasp.util.date.formatDate(changeable, 'SLA')) // {0} 以降かつ変更先勤務体系の月度の起算日に一致する日付を指定してください
			: teasp.message.getLabel('tf10009261'); // 変更先勤務体系の月度の起算日に一致する日付を指定してください（当初からの変更にする場合は空欄のままにしてください）

		dialog.show();
	};

	// event: キャンセル
	var close = function(){
		dialog.hide();
	};

	// エラーメッセージを表示
	var showError = function(msg){
		dojo.style('changeEmpTypeErrorRow', 'display', (msg ? '' : 'none'));
		dojo.byId('changeEmpTypeError').innerHTML = (msg ? msg : '');
		dojo.style('changeEmpTypeCautionRow', 'display', 'none');
		if(busy){
			dojo.attr('changeEmpTypeClose', 'disabled', false);
			dojo.style('changeEmpTypeCloseRow'  , 'display', '');
			dojo.style('changeEmpTypeButtonsRow', 'display', 'none');
			busy = false;
		}
	};

	// 勤務体系プルダウン選択時の処理
	var selectedEmpType = function(){
		var select = dojo.byId('changeEmpTypeSelect');
		var empType = getEmpTypeById(select.value);
		if(!commonConfig.changeEmpTypeFreeDate){
			constraintDate = (empType && empType.ConfigBaseId__r.InitialDateOfMonth__c) || null;
		}
	};

	// 勤務体系IDから勤務体系を得る
	var getEmpTypeById = function(empTypeId){
		for(var i = 0 ; i < inobj.empTypes.length ; i++){
			if(inobj.empTypes[i].Id == empTypeId){
				return inobj.empTypes[i];
			}
		}
		return null;
	};

	// 切替日に接する勤怠設定を得る
	var getConfig = function(changeDate, empType){
		var configs = inobj.configs || [];
		var cd = moment(changeDate);
		for(var i = 0 ; i < configs.length ; i++){
			var c = configs[i];
			if(c.ConfigBaseId__c == empType.ConfigBaseId__c
			&& (!c.ValidStartDate__c || moment(c.ValidStartDate__c).isSameOrBefore(cd))
			&& (!c.ValidEndDate__c || moment(c.ValidEndDate__c).isSameOrAfter(cd))){
				return c;
			}
		}
		return null;
	};

	// 月度と期間の表示用の開始位置を得る
	var getRangeBegin = function(ranges, changeDate){
		var index = -1;
		var cd = moment(changeDate);
		for(var i = 0 ; i < ranges.length ; i++){
			var range = ranges[i];
			if(moment(range.startDate).isSameOrBefore(cd)
			&& moment(range.endDate).isSameOrAfter(cd)){
				index = i - 2; // 切替日の2ヵ月前の位置
				break;
			}
		}
		return (index < 0 ? 0 : index);
	};

	// 起算日の変更があるかどうかを返す
	var getChangeBit = function(oldEt, newEt){
		var flg = 0;
		if(oldEt.ConfigBaseId__r.MarkOfYear__c         != newEt.ConfigBaseId__r.MarkOfYear__c        ){ flg |= 0x10; }
		if(oldEt.ConfigBaseId__r.MarkOfMonth__c        != newEt.ConfigBaseId__r.MarkOfMonth__c       ){ flg |= 0x08; }
		if(oldEt.ConfigBaseId__r.InitialDateOfYear__c  != newEt.ConfigBaseId__r.InitialDateOfYear__c ){ flg |= 0x04; }
		if(oldEt.ConfigBaseId__r.InitialDateOfMonth__c != newEt.ConfigBaseId__r.InitialDateOfMonth__c){ flg |= 0x02; }
		if(oldEt.ConfigBaseId__r.InitialDayOfWeek__c   != newEt.ConfigBaseId__r.InitialDayOfWeek__c  ){ flg |= 0x01; }
		return flg;
	};

	/**
	 * 区切りの日付かどうかを返す
	 * @param {Object} et 勤務体系オブジェクト
	 * @param {number|string|Object} dt 日付
	 * @param {string} sp 'w':一週間, 'm':1ヵ月, 'q':3ヵ月, 'h':6ヵ月, 'y':1年
	 *
	 */
	var isSeparatableDate = function(et, dt, sp){
		var d = moment(dt);
		if(sp == 'w'){ // 一週間
			return (et.ConfigBaseId__r.InitialDayOfWeek__c == d.day());
		}else if(sp == 'm'){
			return (et.ConfigBaseId__r.InitialDateOfMonth__c == d.date());
		}
		var range = teasp.util.date.dateRangeOfYear(
			et.ConfigBaseId__r.InitialDateOfYear__c,
			et.ConfigBaseId__r.MarkOfYear__c,
			et.ConfigBaseId__r.InitialDateOfMonth__c,
			et.ConfigBaseId__r.MarkOfMonth__c,
			d.year()
		);
		var sd = moment(range.sd);
		var ed = moment(range.ed);
		while(sd.isBefore(ed)){
			if(d.month() == sd.month() && d.date() == sd.date()){
				return true;
			}
			if(sp == 'q'){
				sd.add(3, 'month');
			}else if(sp == 'h'){
				sd.add(6, 'month');
			}else{
				sd.add(12, 'month');
			}
		}
		return false;
	};

	var isSeparatableVariableRange = function(et, dt){
		var c = getConfig(dt, et);
		var sp;
		switch(c.VariablePeriod__c){
		case '1': sp = 'm'; break;
		case '3': sp = 'q'; break;
		case '6': sp = 'h'; break;
		case '12': sp = 'y'; break;
		default: sp = 'w';
		}
		return isSeparatableDate(et, dt, sp);
	};

	// UIブロックのオンオフ
	var blockUI = function(flag){
		busy = flag;
		dojo.query('input,select', dialog.domNode).forEach(function(el){
			dojo.attr(el, 'disabled', flag);
		});
		dojo.toggleClass('changeEmpTypeCal'   , 'pp_btn_cal'           , !flag);
		dojo.toggleClass('changeEmpTypeCal'   , 'pp_btn_cal_dis'       ,  flag);
		dojo.toggleClass('changeEmpTypeOk'    , 'pb_btn_storage_ok'    , !flag);
		dojo.toggleClass('changeEmpTypeOk'    , 'pb_btn_storage_ok_dis',  flag);
		dojo.toggleClass('changeEmpTypeCancel', 'pb_btn_cancel'        , !flag);
		dojo.toggleClass('changeEmpTypeCancel', 'pb_btn_cancel_dis'    ,  flag);
	};

	// event: 登録
	var saveAndClose = function(){
		showError(null);
		var newEmpTypeId = dojo.byId('changeEmpTypeSelect').value;
		var cdd = ATK.util.strToDate(dojo.byId('changeEmpTypeDate').value);

		if(inobj.changeableDate && cdd.failed == 1){
			showError(teasp.message.getLabel('tm00000050', teasp.message.getLabel('tf10009250'))); // 切替日を入力してください
			return;
		}else if(cdd.failed > 1){
			showError(dojo.replace(cdd.tmpl, [teasp.message.getLabel('tf10009250')])); // 切替日
			return;
		}else if(cdd.failed == 0 && changeable && moment(cdd.date).isBefore(changeable)){
			showError(teasp.message.getLabel('tf10009170', teasp.util.date.formatDate(changeable, 'SLA'))); // {0}以降の日付を指定してください。
			return;
		}

		var oldEmpTypeId = (inobj.emps && inobj.emps[0].EmpTypeId__c) || null;
		if(oldEmpTypeId == newEmpTypeId){
			showError(teasp.message.getLabel('tf10009160')); // 変更前と変わりません
			return;
		}
		var oldEmpType = getEmpTypeById(oldEmpTypeId);
		var newEmpType = getEmpTypeById(newEmpTypeId);
		if(cdd.failed == 0){
			if(cdd.date.getDate() != newEmpType.ConfigBaseId__r.InitialDateOfMonth__c){
				showError(teasp.message.getLabel('tf10009290')); // 切替日の日付を変更先の勤務体系の起算日に合わせてください。
				return;
			}
		}
		// 変換対象データ数制限のチェック
		var maxRangeDays = (commonConfig.changeEmpTypeMaxRangeDays || 750);
		var diffDays = moment(inobj.inputLastDate).diff(cdd.date || inobj.inputFirstDate, 'days');
		if(diffDays > maxRangeDays){
			showError(teasp.message.getLabel('tf10009490')); // 変更対象のデータ数が制限を超えるため変更できません
			return;
		}

		var changeBit = getChangeBit(oldEmpType, newEmpType); // 起算日変更かどうかを返す
		var changeDate = cdd.datef;
		var info = {
			oldEmpType: oldEmpType,
			newEmpType: newEmpType,
			changeBit:  changeBit,
			changeDate: changeDate,
			empIds: inobj.empIds
		};
		if(!changeBit){ // 起算日変更を伴わない勤務体系変更
            teasp.tsConfirm(
                teasp.message.getLabel('tf10009450') // 勤務体系を変更してよろしいですか？
				+ (changeDate ? '' : teasp.message.getLabel('tf10009460')), // （切替日を指定しない変更は履歴に残りません）
                null,
                function(confirmOk){
                    if(confirmOk){
                        exec(newEmpTypeId, changeDate);
                    }
                }
            );
		}else if(!changeDate){ // 切替日指定なし
			confirmEmpTypeDialog.open(info, function(){
				exec(newEmpTypeId, changeDate);
			});
		}else{
			simulateChangeEmpType(newEmpTypeId, changeDate, function(result){
				var oldC = getConfig(changeDate, oldEmpType);
				var newC = getConfig(changeDate, newEmpType);
				var rangeBegin = getRangeBegin(result.rangesNew, changeDate);
				info.rangesOrg = dojo.clone(result.rangesOrg).splice(rangeBegin, 4);
				info.rangesNew = dojo.clone(result.rangesNew).splice(rangeBegin, 4);
				info.caution1  = true;
				info.caution11 = true;
				info.caution12 = true;
				info.caution13 = true;
				info.caution14 = true;
				info.caution15 = true;
				info.caution2  = true;
				info.caution21 = true;
				info.caution22 = true;

				// 管理監督者である または 年度が成立
				if((oldC.WorkSystem__c == '3' || isSeparatableDate(oldEmpType, changeDate, 'y'))
				&& (newC.WorkSystem__c == '3' || isSeparatableDate(newEmpType, changeDate, 'y'))){
					info.caution11 = false;
				}
				// 「時間単位有休の起算日は、年次有給休暇の有効開始日を起算日とする」がオン
				if(commonConfig.paidRestTimeLimitSyncYuq){
					info.caution12 = false;
				}else if(isSeparatableDate(oldEmpType, changeDate, 'y')
					||   isSeparatableDate(newEmpType, changeDate, 'y')){
					info.caution12 = false;
				}
				// 変更前後で年度の期間が成立
				if(isSeparatableDate(oldEmpType, changeDate, 'y')
				|| isSeparatableDate(newEmpType, changeDate, 'y')){
					info.caution13 = false;
				}
				// 変形労働時間制でない または 変形期間が成立
				if((oldC.WorkSystem__c != '2' || isSeparatableVariableRange(oldEmpType, changeDate))
				&& (newC.WorkSystem__c != '2' || isSeparatableVariableRange(newEmpType, changeDate))){
					info.caution14 = false;
				}
				// フレックスタイム制でない または 清算期間が成立
				if((oldC.WorkSystem__c != '1' || isSeparatableDate(oldEmpType, changeDate, 'm'))
				&& (newC.WorkSystem__c != '1' || isSeparatableDate(newEmpType, changeDate, 'm'))){
					info.caution15 = false;
				}
				// 固定労働時間制でない または 週が成立
				if((oldC.WorkSystem__c != '0' || isSeparatableDate(oldEmpType, changeDate, 'w'))
				&& (newC.WorkSystem__c != '0' || isSeparatableDate(newEmpType, changeDate, 'w'))){
					info.caution21 = false;
				}
				// 法定休日自動判定でない または 週が成立
				if((!oldC.AutoLegalHoliday__c || isSeparatableDate(oldEmpType, changeDate, 'w'))
				&& (!newC.AutoLegalHoliday__c || isSeparatableDate(newEmpType, changeDate, 'w'))){
					info.caution22 = false;
				}
				if(!info.caution11
				&& !info.caution12
				&& !info.caution13
				&& !info.caution14
				&& !info.caution15){
					info.caution1 = false;
				}
				if(!info.caution21
				&& !info.caution22){
					info.caution2 = false;
				}
				confirmEmpTypeDialog.open(info, function(){
					exec(newEmpTypeId, changeDate);
				});
			});
		}
	};

	// 勤務体系変更後の月度と期間の情報を得る
	var simulateChangeEmpType = function(empTypeId, changeDate, callback){
		var req = {
			action: 'simulateChangeEmpType',
			empId: inobj.empIds[0],
			empTypeId: empTypeId,
			changeDate: changeDate
		};
		blockUI(true);
		Visualforce.remoting.Manager.invokeAction(
			inobj.remoteAction,
			dojo.toJson(req),
			function(result, event){
				blockUI(false);
				console.log(event);
				if(event.status && result.result == 'OK'){
					teasp.util.excludeNameSpace(result);
					callback(result);
				}else{
					teasp.tsAlert(teasp.message.getErrorMessage(result || event));
				}
			},
			{ escape : false }
		);
	};

	// 実行
	var exec = function(empTypeId, changeDate){
		dojo.style('changeEmpTypeCautionRow', 'display', '');
		dojo.style('changeEmpTypeMessageRow', 'display', '');
		blockUI(true);

		var processEmpType = new ATK.processEmpType({
			empIds: inobj.empIds,
			empTypeId: empTypeId,
			changeDate: changeDate,
			remoteAction: inobj.remoteAction,
			msgAreaId: 'changeEmpTypeMessage',
			onFailure: showError,
			onSuccess: onfinishfunc,
			onFinish: function(result){
				dojo.style('changeEmpTypeCautionRow', 'display', 'none');
				dojo.style('changeEmpTypeCloseRow'  , 'display', '');
				dojo.style('changeEmpTypeButtonsRow', 'display', 'none');
				dojo.attr('changeEmpTypeClose', 'disabled', false);
			}
		});
		processEmpType.changeEmpTypeLoop(0);
	};

	return {
		open  : open
	};
};	// ATK.dialog.changeEmpTypeDialog

/*
 * 勤務体系変更の確認ダイアログ
 */
ATK.dialog.confirmEmpTypeDialog = function(){
	var attached = false;
	var inobj;
	var onfinishfunc;
	var dialog;

	var attach = function(){
		if(attached){
			return;
		}
		attached = true;

		dialog = new dijit.Dialog({
			title	 : teasp.message.getLabel('tf10009310'), // 勤務体系変更の確認
			duration : 300
		});

		dialog.attr('content',
			  '<div class="confirm-change-emptype"">'
			+ '  <div>'
			+ '    <div class="info-emptype">'
			+ '      <div class="info-name-label-old"></div>'
			+ '      <div class="info-name-old"></div>'
			+ '      <table class="confirm-table">'
			+ '        <tbody>'
			+ '        </tbody>'
			+ '      </table>'
			+ '    </div>'
			+ '    <div class="info-spacer">'
			+ '    </div>'
			+ '    <div class="info-emptype">'
			+ '      <div class="info-name-label-new"></div>'
			+ '      <div class="info-name-new"></div>'
			+ '      <table class="confirm-table">'
			+ '        <tbody>'
			+ '        </tbody>'
			+ '      </table>'
			+ '    </div>'
			+ '  </div>'
			+ '  <div class="confirm-changeDate">'
			+ '    <div><div></div><div></div></div>'
			+ '    <div><div></div><div></div></div>'
			+ '  </div>'
			+ '  <div class="confirm-caution">'
			+ '  </div>'
			+ '  <div class="confirm-info">'
			+ '    <div class="confirm-info-msg""></div>'
			+ '    <table>'
			+ '      <thead>'
			+ '        <tr><th></th><th></th></tr>'
			+ '      </thead>'
			+ '      <tbody>'
			+ '      </tbody>'
			+ '    </table>'
			+ '  </div>'
			+ '  <div class="confirm-message">'
			+ '  </div>'
			+ '  <table class="pane_table" style="width:100%;margin-top:4px;">'
			+ '    <tr>'
			+ '      <td style="padding:4px 0px;text-align:center;">'
			+ '        <input type="button" class="pb_base pb_btn_storage_ok" id="confirmEmpTypeOk">'
			+ '        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
			+ '        <input type="button" class="pb_base pb_btn_cancel" id="confirmEmpTypeCancel">'
			+ '      </td>'
			+ '    </tr>'
			+ '  </table>'
			+ '</div>');

		dojo.byId('confirmEmpTypeOk').onclick = ok;
		dojo.byId('confirmEmpTypeCancel').onclick = close;

		dojo.query('div.info-name-label-old', dialog.domNode)[0].innerHTML = teasp.message.getLabel('tf10009320'); // 変更前
		dojo.query('div.info-name-label-new', dialog.domNode)[0].innerHTML = teasp.message.getLabel('tf10009330'); // 変更後

		dojo.query('div.confirm-changeDate > div > div:first-child' , dialog.domNode)[0].innerHTML = teasp.message.getLabel('tf10009250'); // 切替日

		dojo.query('div.confirm-info table th', dialog.domNode)[0].innerHTML = teasp.message.getLabel('tk10000063'); // 月度
		dojo.query('div.confirm-info table th', dialog.domNode)[1].innerHTML = teasp.message.getLabel('tk10000851'); // 期間
		dojo.query('div.confirm-info-msg', dialog.domNode)[0].innerHTML = teasp.message.getLabel('tf10009430'); // 切替日前後の各月の期間は下記のようになります。

		dojo.query('div.confirm-message' , dialog.domNode)[0].innerHTML = teasp.message.getLabel('tf10009440'); // 上記内容を確認して実行ボタンをクリックしてください。

		dialog.startup();
	};

	var open = function(_inobj, _onfinishfunc){
		inobj = _inobj;
		onfinishfunc = _onfinishfunc;
		attach();

		var oim = teasp.message.getLabel('tm10010470', inobj.oldEmpType.ConfigBaseId__r.InitialDateOfYear__c);
		var omm = teasp.message.getLabel(inobj.oldEmpType.ConfigBaseId__r.MarkOfYear__c  == '1' ? 'tm10010320' : 'tm10010330');
		var oid = teasp.message.getLabel('tm10010480', inobj.oldEmpType.ConfigBaseId__r.InitialDateOfMonth__c);
		var omd = teasp.message.getLabel(inobj.oldEmpType.ConfigBaseId__r.MarkOfMonth__c == '1' ? 'tm10010340' : 'tm10010350');
		var oiw = teasp.message.getLabel('tm10010490', teasp.util.date.getWeekJp(inobj.oldEmpType.ConfigBaseId__r.InitialDayOfWeek__c));

		var nim = teasp.message.getLabel('tm10010470', inobj.newEmpType.ConfigBaseId__r.InitialDateOfYear__c);
		var nmm = teasp.message.getLabel(inobj.newEmpType.ConfigBaseId__r.MarkOfYear__c  == '1' ? 'tm10010320' : 'tm10010330');
		var nid = teasp.message.getLabel('tm10010480', inobj.newEmpType.ConfigBaseId__r.InitialDateOfMonth__c);
		var nmd = teasp.message.getLabel(inobj.newEmpType.ConfigBaseId__r.MarkOfMonth__c == '1' ? 'tm10010340' : 'tm10010350');
		var niw = teasp.message.getLabel('tm10010490', teasp.util.date.getWeekJp(inobj.newEmpType.ConfigBaseId__r.InitialDayOfWeek__c));

		dojo.query('div.info-name-old', dialog.domNode)[0].innerHTML = inobj.oldEmpType.Name;
		dojo.query('div.info-name-new', dialog.domNode)[0].innerHTML = inobj.newEmpType.Name;

		dojo.query('div.confirm-changeDate > div > div:nth-child(2)', dialog.domNode)[0].innerHTML
			= (inobj.changeDate
			? teasp.util.date.formatDate(inobj.changeDate, 'SLA')
			: teasp.message.getLabel('tf10009470')); // 指定なし（履歴に記録されない変更となります）

		// 対象社員数は対象数が2以上の場合に表示する
		dojo.query('div.confirm-changeDate > div > div:first-child' , dialog.domNode)[1].innerHTML
			= (inobj.empIds.length > 1
			? teasp.message.getLabel('tf10009480') // 対象社員数
			: '');
		dojo.query('div.confirm-changeDate > div > div:nth-child(2)', dialog.domNode)[1].innerHTML
			= (inobj.empIds.length > 1
			? inobj.empIds.length // 対象社員数
			: '');

		// 起算日情報を表示
		var tbody1 = dojo.query('div.info-emptype table > tbody', dialog.domNode)[0];
		var tbody2 = dojo.query('div.info-emptype table > tbody', dialog.domNode)[1];
		dojo.empty(tbody1);
		dojo.empty(tbody2);
		var tr;
		tr = dojo.create('tr', null, tbody1); dojo.create('td', { innerHTML: teasp.message.getLabel('tk10000575') }, tr); dojo.create('td', { innerHTML: oim }, tr);
		tr = dojo.create('tr', null, tbody1); dojo.create('td', { innerHTML: teasp.message.getLabel('tk10000576') }, tr); dojo.create('td', { innerHTML: omm }, tr);
		tr = dojo.create('tr', null, tbody1); dojo.create('td', { innerHTML: teasp.message.getLabel('tk10000577') }, tr); dojo.create('td', { innerHTML: oid }, tr);
		tr = dojo.create('tr', null, tbody1); dojo.create('td', { innerHTML: teasp.message.getLabel('tk10000578') }, tr); dojo.create('td', { innerHTML: omd }, tr);
		tr = dojo.create('tr', null, tbody1); dojo.create('td', { innerHTML: teasp.message.getLabel('tm10010290') }, tr); dojo.create('td', { innerHTML: oiw }, tr);

		tr = dojo.create('tr', null, tbody2); dojo.create('td', { innerHTML: teasp.message.getLabel('tk10000575') }, tr); dojo.create('td', { innerHTML: nim }, tr);
		tr = dojo.create('tr', null, tbody2); dojo.create('td', { innerHTML: teasp.message.getLabel('tk10000576') }, tr); dojo.create('td', { innerHTML: nmm }, tr);
		tr = dojo.create('tr', null, tbody2); dojo.create('td', { innerHTML: teasp.message.getLabel('tk10000577') }, tr); dojo.create('td', { innerHTML: nid }, tr);
		tr = dojo.create('tr', null, tbody2); dojo.create('td', { innerHTML: teasp.message.getLabel('tk10000578') }, tr); dojo.create('td', { innerHTML: nmd }, tr);
		tr = dojo.create('tr', null, tbody2); dojo.create('td', { innerHTML: teasp.message.getLabel('tm10010290') }, tr); dojo.create('td', { innerHTML: niw }, tr);

		// 警告の表示
		var cautArea = dojo.query('div.confirm-caution', dialog.domNode)[0];
		dojo.style(cautArea, 'display', (inobj.caution1 || inobj.caution2) ? '' : 'none');
		dojo.empty(cautArea);
		dojo.create('div', { className:'pp_base pp_icon_caution' }, cautArea);
		dojo.create('div', {
			className: 'confirm-caution-msg',
			innerHTML: teasp.message.getLabel('tf10009340') // 起算日の異なる勤務体系へ変更する場合、下記の影響が発生します。
		}, cautArea);
		if(inobj.caution1){
			dojo.create('div', { className:'confirm-caution-top',innerHTML:teasp.message.getLabel('tf10009350') }, cautArea); // 年度の期間が変則になることによる影響
			if(inobj.caution11){
				dojo.create('div', { className:'confirm-caution-row',innerHTML:teasp.message.getLabel('tf10009360') }, cautArea); // ・36協定の累計値
			}
			if(inobj.caution12){
				dojo.create('div', { className:'confirm-caution-row',innerHTML:teasp.message.getLabel('tf10009370') }, cautArea); // ・時間単位有休の限度時間管理
			}
			if(inobj.caution13){
				dojo.create('div', { className:'confirm-caution-row',innerHTML:teasp.message.getLabel('tf10009380') }, cautArea); // ・休暇情報画面の表の対象期間
			}
			if(inobj.caution14){
				dojo.create('div', { className:'confirm-caution-row',innerHTML:teasp.message.getLabel('tf10009390') }, cautArea); // ・変形労働の変形対象期間
			}
			if(inobj.caution15){
				dojo.create('div', { className:'confirm-caution-row',innerHTML:teasp.message.getLabel('tf10009500') }, cautArea); // ・フレックスタイム制の清算期間
			}
		}
		if(inobj.caution2){
			dojo.create('div', { className:'confirm-caution-top',innerHTML:teasp.message.getLabel('tf10009400') }, cautArea); // 切替日をまたぐ週の勤怠集計への影響
			if(inobj.caution21){
				dojo.create('div', { className:'confirm-caution-row',innerHTML:teasp.message.getLabel('tf10009410') }, cautArea); // ・週40時間を超過した場合の法定時間外割増時間の計算
			}
			if(inobj.caution22){
				dojo.create('div', { className:'confirm-caution-row',innerHTML:teasp.message.getLabel('tf10009420') }, cautArea); // ・週7日連続勤務を行った場合の法定休日労働時間の計算
			}
		}

		// 月度と期間の表示
		var dispRange = (inobj.changeDate && (inobj.changeBit & 0x0A));
		dojo.style(dojo.query('div.confirm-info', dialog.domNode)[0], 'display', (dispRange ? '' : 'none'));

		var tbody = dojo.query('div.confirm-info > table > tbody', dialog.domNode)[0];
		dojo.empty(tbody);
		var ranges = inobj.rangesNew || [];
		for(var i = 0 ; i < ranges.length ; i++){
			var range = ranges[i];
			var tr = dojo.create('tr', null, tbody);
			var y = Math.floor(range.yearMonth / 100);
			var m = range.yearMonth % 100;
			var ym = teasp.util.date.formatMonth('zv00000021', y, m, range.subNo);
			dojo.create('td', { innerHTML: ym }, tr);
			dojo.create('td', {
				innerHTML: teasp.util.date.formatDate(range.startDate, 'SLA')
						+  ' ～ '
						+  teasp.util.date.formatDate(range.endDate  , 'SLA')
			}, tr);
		}

		dialog.show();
	};

	var close = function(){
		dialog.hide();
	};

	var ok = function(){
		onfinishfunc();
		dialog.hide();
	};

	return {
		open  : open
	};
};	// ATK.dialog.confirmEmpTypeDialog

var confirmEmpTypeDialog = ATK.dialog.confirmEmpTypeDialog();

/*
 * 勤務体系変更履歴ダイアログ
 */
ATK.dialog.historyEmpTypeDialog = function(){
	var attached = false;
	var inobj;
	var onfinishfunc;
	var dialog;
	var eventHandles = [];
	var busy = true;
	var commonConfig;

	var attach = function(){
		if(attached){
			return;
		}
		attached = true;

		dialog = new dijit.Dialog({
			title	 : teasp.message.getLabel('tf10009190'), // 勤務体系履歴
			duration : 300,
			closable : false
		});

		dialog.attr('content',
			  '<div class="dlg_content" style="width:498px;">'
			+ '  <table class="stone_area" style="width:498px;">'
			+ '  <tr>'
			+ '    <td>'
			+ '      <table class="stone_table">'
			+ '      <tr>'
			+ '        <td class="head" style="width:38px;"></td>'
			+ '        <td class="head" style="width:280px;"><div>' + teasp.message.getLabel('tk10001092')	+ '</div></td>' // 勤務体系名
			+ '        <td class="head" style="width:180px;"><div>' + teasp.message.getLabel('range_label') + '</div></td>' // 期間
			+ '      </tr>'
			+ '      </table>'
			+ '      <div class="stone_div" style="height:88px;">'
			+ '        <table class="stone_table" id="historyEmpTypeTable">'
			+ '        <tbody>'
			+ '        </tbody>'
			+ '        </table>'
			+ '      </div>'
			+ '    </td>'
			+ '  </tr>'
			+ '  </table>'
			+ '  <table class="pane_table" style="width:100%;margin-top:4px;">'
			+ '  <tr id="historyEmpTypeCautionRow" style="display:none;">'
			+ '    <td style="text-align:left;">'
			+ '      <div id="historyEmpTypeCaution" style="margin:0px 4px;color:red;"></div>'
			+ '    </td>'
			+ '  </tr>'
			+ '  <tr id="historyEmpTypeMessageRow" style="display:none;">'
			+ '    <td style="text-align:left;">'
			+ '      <div id="historyEmpTypeMessage" style="margin:0px 4px;"></div>'
			+ '    </td>'
			+ '  </tr>'
			+ '  <tr id="historyEmpTypeErrorRow" style="display:none;">'
			+ '    <td style="text-align:left;">'
			+ '      <div id="historyEmpTypeError" style="color:red;margin:0px 4px;"></div>'
			+ '    </td>'
			+ '  </tr>'
			+ '  <tr>'
			+ '    <td style="padding:4px 0px;text-align:center;">'
			+ '      <input type="button" class="pb_base pb_btn_close" id="historyEmpTypeClose">'
			+ '    </td>'
			+ '  </tr>'
			+ '</table>'
			+ '</div>');

		dojo.byId('historyEmpTypeClose').onclick = function(){ close(); };

		dialog.startup();
	};

	var open = function(_inobj, _onfinishfunc){
		inobj = _inobj;
		onfinishfunc = _onfinishfunc;
		attach();
		if(eventHandles.length){
			for(var i = 0 ; i < eventHandles.length ; i++){
				dojo.disconnect(eventHandles[i]);
			}
			eventHandles = [];
		}

		commonConfig = (inobj.commonConfig && teasp.decode(inobj.commonConfig, 1)) || {};

		var empTypeHistory = inobj.empTypeHistory;
		var tbody = dojo.byId('historyEmpTypeTable').getElementsByTagName('tbody')[0];
		dojo.empty(tbody);
		var rowCount = (empTypeHistory.length < 4 ? 4 : empTypeHistory.length);
		for(var r = 0 ; r < rowCount ; r++){
			var dh = (r < empTypeHistory.length ? empTypeHistory[r] : null);
			var row = dojo.create('tr', { id: "empTypeHistory" + (dh ? dh.id : ''), className: ((r%2)==0 ? 'even' : 'odd'), height: '22px' }, tbody);
			var cell = dojo.create('td', { width: '38px' }, row);
			cell.style.borderLeft = 'none';
			if(r == 0 && dh && empTypeHistory.length > 1){
				var deletable = (!inobj.fixedLastDate || inobj.fixedLastDate < dh.sd);
				var input = dojo.create('input', {
					type: 'button',
					className: 'pp_base pp_btn_del' + (deletable ? '' : '_dis'),
					style: 'margin:1px 2px;',
					title: (deletable ? teasp.message.getLabel('tk10000195') // 取消
							: teasp.message.getLabel('tf10009280', teasp.util.date.formatDate(inobj.fixedLastDate, 'SLA'))) // {0} まで勤務確定済みのため、削除不可
				}, cell);
				if(deletable){
					eventHandles.push(dojo.connect(input, 'onclick', removeChangeEmpType(dh)));
				}
			}
			var span = '';
			if(dh && (dh.sd || dh.ed)){
				if(dh.sd){ span += teasp.util.date.formatDate(dh.sd, 'SLA'); }
				span += teasp.message.getLabel('wave_label'); // ～
				if(dh.ed){ span += teasp.util.date.formatDate(dh.ed, 'SLA'); }
			}else if(dh){
				span = teasp.message.getLabel('tm00000107'); // －
			}
			cell = dojo.create('td', { style:'width:280px;text-align:left;' }, row);
			dojo.create('div', { innerHTML:(dh ? dh.empTypeName || '' : ''), style:'word-break:break-all;' }, cell);
			cell = dojo.create('td', { style:'width:163px;text-align:left;border-right:none;' }, row);
			dojo.create('div', { innerHTML:span }, cell);
		}

		dojo.style('historyEmpTypeMessageRow', 'display', 'none');
		dojo.style('historyEmpTypeCautionRow', 'display', 'none');
		dojo.byId('historyEmpTypeCaution').innerHTML = teasp.message.getLabel('tf10007160'); // 実行中は画面を閉じないようにしてください。
		showError();
		dialog.show();
	};

	// logic: エラーメッセージを表示
	var showError = function(msg){
		dojo.style('historyEmpTypeErrorRow', 'display', (msg ? '' : 'none'));
		dojo.byId('historyEmpTypeError').innerHTML = (msg ? msg : '');
		dojo.style('historyEmpTypeCautionRow', 'display', 'none');
		if(busy){
			dojo.attr('historyEmpTypeClose', 'disabled', false);
			dojo.toggleClass('historyEmpTypeClose', 'pb_btn_close'    , true );
			dojo.toggleClass('historyEmpTypeClose', 'pb_btn_close_dis', false);
			busy = false;
		}
	};

	var close = function(){
		dialog.hide();
	};

	// UIブロック切替
	var blockUI = function(flag){
		busy = flag;
		dojo.query('input', dialog.domNode).forEach(function(el){
			dojo.attr(el, 'disabled', flag);
		});
		dojo.query('input', dojo.byId('historyEmpTypeTable')).forEach(function(el){
			dojo.toggleClass(el, 'pp_btn_del'    , !flag);
			dojo.toggleClass(el, 'pp_btn_del_dis',  flag);
		});
		dojo.toggleClass('historyEmpTypeClose', 'pb_btn_close'    , !flag);
		dojo.toggleClass('historyEmpTypeClose', 'pb_btn_close_dis',  flag);
	};

	// 削除
	var removeChangeEmpType = function(dh){
		return function(e){
			showError();
			dojo.byId('historyEmpTypeMessage').innerHTML = '';

			// 変換対象データ数制限のチェック
			var maxRangeDays = (commonConfig.changeEmpTypeMaxRangeDays || 750);
			var diffDays = moment(inobj.inputLastDate).diff(dh.sd || inobj.inputFirstDate, 'days');
			if(diffDays > maxRangeDays){
				showError(teasp.message.getLabel('tf10009490')); // 変更対象のデータ数が制限を超えるため変更できません
				return;
			}

			if(inobj.historyPrevEmpTypeId){
				for(var i = 0 ; i < inobj.empTypes.length ; i++){
					if(inobj.empTypes[i].Id == inobj.historyPrevEmpTypeId){
						if(inobj.empTypes[i].Removed__c){
							teasp.tsAlert(teasp.message.getLabel('tf10009300', inobj.empTypes[i].Name)); // 勤務体系「{0}」を有効化してください。
							return;
						}
					}
				}
			}
            // 勤務体系変更を取り消しますが、よろしいですか？
            teasp.tsConfirm(teasp.message.getLabel('tf10009180'), null, function(confirmOk){
                if(confirmOk){
                    dojo.style('historyEmpTypeMessageRow', 'display', '');
                    dojo.style('historyEmpTypeCautionRow', 'display', '');
                    blockUI(true);
        
                    var processEmpType = new ATK.processEmpType({
                        empIds: [inobj.emp.Id],
                        empTypeId: dh.empTypeId,
                        changeDate: dh.sd,
                        remoteAction: inobj.remoteAction,
                        msgAreaId: 'historyEmpTypeMessage',
                        onFailure: showError,
                        onSuccess: onfinishfunc,
                        onFinish: function(result){
                            dojo.style('historyEmpTypeCautionRow', 'display', 'none');
                            dojo.toggleClass('historyEmpTypeClose', 'pb_btn_close'    , true);
                            dojo.toggleClass('historyEmpTypeClose', 'pb_btn_close_dis', false);
                            dojo.attr('historyEmpTypeClose', 'disabled', false);
                        }
                    });
                    processEmpType.removeEmpTypeLoop(0);
                }
            });
		};
	};

	return {
		open  : open
	};
};	// ATK.dialog.historyEmpTypeDialog

/*
 * 勤務体系変更処理クラス
 */
ATK.processEmpType = function(param){
	this.param = param;
};

ATK.processEmpType.prototype.showMessage = function(msg){
	dojo.byId(this.param.msgAreaId).innerHTML = msg;
};

ATK.processEmpType.prototype.showError = function(msg){
	this.param.onFailure(msg ? teasp.message.getLabel('tm00000010', msg) : null);
};

ATK.processEmpType.prototype.empNumber = function(index){
	if(this.empNumOff || this.param.empIds.length == 1){
		return '';
	}
	return teasp.message.getLabel('tf10009230', index + 1, this.param.empIds.length); // 社員{0}/{1}
};

// 勤務体系変更変更開始
ATK.processEmpType.prototype.changeEmpTypeLoop = function(index){
	if(index >= this.param.empIds.length){
		getConfigHistory(dojo.hitch(this, function(){
			this.showMessage(teasp.message.getLabel('tf10009220')); // 完了しました
			this.param.onFinish();
		}));
		return;
	}
	this.changeEmpType(index);
};

// 勤務体系変更変更の取消開始
ATK.processEmpType.prototype.removeEmpTypeLoop = function(index){
	this.empNumOff = true;
	if(index >= this.param.empIds.length){
		getConfigHistory(dojo.hitch(this, function(){
			this.showMessage(teasp.message.getLabel('tf10009220')); // 完了しました
			this.param.onFinish();
		}));
		return;
	}
	this.removeEmpType(index);
};

// 勤務体系変更履歴を取得開始
ATK.processEmpType.prototype.getEmpTypeHistoryLoop = function(index, callback){
	if(index >= this.param.empIds.length){
		callback(this.changeEmpTypeInfos);
		return;
	}
	this.getEmpTypeHistory(index, dojo.hitch(this, function(result){
		this.changeEmpTypeInfos.push(result);
	}));
};

// 勤務体系変更
ATK.processEmpType.prototype.changeEmpType = function(index){
	var empId = this.param.empIds[index];
	var req = {
		action: 'changeEmpType',
		empId: empId,
		empTypeId: this.param.empTypeId,
		changeDate: this.param.changeDate
	};
	this.showMessage(this.empNumber(index) + teasp.message.getLabel('tf10009200')); // 勤務体系変更中
	console.log(req);
	Visualforce.remoting.Manager.invokeAction(
		this.param.remoteAction,
		dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			console.log(event);
			if(event.status && result.result == 'OK'){
				console.log('verify=' + result.verify);
				teasp.util.excludeNameSpace(result);
				this.param.onSuccess({ empType: result.empType, empId: empId });
				this.getEmpTypeHistory(index, dojo.hitch(this, function(result){
					this.recalcStart(index, result, dojo.hitch(this, this.changeEmpTypeLoop));
				}));
			}else{
				this.showError(teasp.message.getErrorMessage(result || event));
			}
		}),
		{ escape : false }
	);
};

// 勤務体系変更の取消
ATK.processEmpType.prototype.removeEmpType = function(index){
	var req = {
		action: 'removeChangeEmpType',
		empId: this.param.empIds[index],
		empTypeId: this.param.empTypeId,
		changeDate: this.param.changeDate
	};
	this.showMessage(this.empNumber(index) + teasp.message.getLabel('tf10009200')); // 勤務体系変更中
	console.log(req);
	Visualforce.remoting.Manager.invokeAction(
		this.param.remoteAction,
		dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			console.log(event);
			if(event.status && result.result == 'OK'){
				teasp.util.excludeNameSpace(result);
				this.param.onSuccess({ empType: result.empType });
				this.getEmpTypeHistory(index, dojo.hitch(this, function(result){
					this.recalcStart(index, result, dojo.hitch(this, this.removeEmpTypeLoop));
				}));
			}else{
				this.showError(teasp.message.getErrorMessage(result || event));
			}
		}),
		{ escape : false }
	);
};

// 勤務体系履歴を取得
ATK.processEmpType.prototype.getEmpTypeHistory = function(index, callback){
	var req = {
		action: 'getEmpTypeHistory',
		empId: this.param.empIds[index]
	};
	this.showMessage(this.empNumber(index) + teasp.message.getLabel('tf10009200')); // 勤務体系変更中
	console.log(req);
	Visualforce.remoting.Manager.invokeAction(
		this.param.remoteAction,
		dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			console.log(event);
			if(event.status && result.result == 'OK'){
				teasp.util.excludeNameSpace(result);
				callback(result);
			}else{
				this.showError(teasp.message.getErrorMessage(result || event));
			}
		}),
		{ escape : false }
	);
};

// 勤怠再計算開始
ATK.processEmpType.prototype.recalcStart = function(index, result, callback){
	var targets = [];
	var d = (this.param.changeDate ? moment(this.param.changeDate, 'YYYY-MM-DD').add(-1, 'days').format('YYYY-MM-DD') : null);
	var monthList = result.monthList || [];
	for(var i = 0 ; i < monthList.length ; i++){
		var m = monthList[i];
		if(m.empMonthId && !m.fix && (!d || d <= m.endDate)){
			targets.push(m);
		}
	}
	this.recalcEmpMonth(index, targets, 0, callback);
};

// 勤怠再計算
ATK.processEmpType.prototype.recalcEmpMonth = function(index, targets, targetIndex, callback){
	if(targetIndex >= targets.length){
		setTimeout(function(){
			callback(index + 1);
		}, 100);
		return;
	}
	var req = {
		action: 'recalcEmpMonth',
		empId: this.param.empIds[index],
		targetDate: targets[targetIndex].startDate
	};
	this.showMessage(this.empNumber(index) + teasp.message.getLabel('tf10009210', targetIndex + 1, targets.length)); // 勤怠再計算中  ({0}/{1})
	console.log(req);
	Visualforce.remoting.Manager.invokeAction(
		this.param.remoteAction,
		dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			console.log(event);
			if(event.status && result.result == 'OK'){
				teasp.util.excludeNameSpace(result);
				setTimeout(dojo.hitch(this, function(){
					this.recalcEmpMonth(index, targets, targetIndex + 1, callback);
				}), 100);
			}else{
				this.showError(teasp.message.getErrorMessage(result || event));
			}
		}),
		{ escape : false }
	);
};
/*--------------------------------------------------------------------
 * 勤務場所クラス
 * @param {Object} obj WorkLocation__c
 */
ATK.obj.WorkLocation = function(obj){
    this.obj = obj;
    this.initFlag = false;
};
ATK.obj.WorkLocation.prototype.getObj = function(){ return this.obj; };
ATK.obj.WorkLocation.prototype.getId  = function(){ return this.obj.Id; };
ATK.obj.WorkLocation.prototype.getName = function(){ return this.obj.Name; };
ATK.obj.WorkLocation.prototype.isInitFlag = function(){ return this.initFlag; };
ATK.obj.WorkLocation.prototype.isValid = function(){ return (this.obj.Removed__c ? false : true); };
/**
 * カウント対象
 * @param {boolean} flag true:stringで返す  false:1～4を返す
 * @returns {string|number}
 */
ATK.obj.WorkLocation.prototype.getCountType = function(flag){
	var x = 4;
	if( 	  this.obj.OfficeDays__c && !this.obj.HomeDays__c){ x = 1;
	}else if(!this.obj.OfficeDays__c &&  this.obj.HomeDays__c){ x = 2;
	}else if( this.obj.OfficeDays__c &&  this.obj.HomeDays__c){ x = 3;
	}
	return (flag ? [
		teasp.message.getLabel('tw00000090'), // 出社
		teasp.message.getLabel('tw00000100'), // テレワーク
		teasp.message.getLabel('tw00000110'), // 出社・テレワーク
		teasp.message.getLabel('tw00000120')  // 対象外
	][x-1] : x);
};
/**
 * 初期値
 * @returns {string}
 */
ATK.obj.WorkLocation.prototype.getInitFlag = function(){
	return (this.initFlag ? '○' : '');
};
/**
 * 初期値をセット
 * @param {boolean}
 */
ATK.obj.WorkLocation.prototype.setInitFlag = function(flag){
	this.initFlag = flag;
};
/**
 * 有効
 * @returns {string}
 */
ATK.obj.WorkLocation.prototype.getValid = function(){
	return (this.obj.Removed__c ? '×' : '○');
};
/*--------------------------------------------------------------------
 * 勤務場所一覧ダイアログ
 * @param {string} configAction Javascript Remoting Action Function
 */
ATK.dialog.WorkLocationsDialog = function(configAction){
	this.configAction = configAction;
	this.dialog = null;
	this.workLocations = [];
	this.eventHandles = [];
	this.editDialog  = new ATK.dialog.WorkLocationEditDialog(configAction);  // 編集ダイアログ
	this.orderDialog = new ATK.dialog.WorkLocationOrderDialog(configAction); // 並び順変更ダイアログ
	this.cols = [ // 表の列
		{n:''								   , w: 38, s:'text-align:center;border-left:none;',cs:''		}, // 編集ボタン
		{n:''								   , w: 38, s:'text-align:center;' ,cs:''						}, // 削除ボタン
		{n:teasp.message.getLabel('tw00000040'), w:200, s:'text-align:left;'   ,cs:'wordBreak:break-all;'	}, // 表示名
		{n:teasp.message.getLabel('tw00000020'), w:170, s:'text-align:center;' ,cs:''						}, // カウント対象
		{n:teasp.message.getLabel('tw00000140'), w: 56, s:'text-align:center;' ,cs:'font-family:sans-serif;'}, // 初期値
		{n:teasp.message.getLabel('tw00000160'), w: 56, s:'text-align:center;' ,cs:'font-family:sans-serif;'}  // 有効
	];
};
ATK.dialog.WorkLocationsDialog.MAX_SIZE = 10;

/**
 * 開く
 */
ATK.dialog.WorkLocationsDialog.prototype.open = function(){
	var firstOpen = !this.dialog;
	if(!this.dialog){
		this.dialog = new dijit.Dialog({
			title	 : teasp.message.getLabel('tw00000030'), // 勤務場所一覧
			duration : 300
		});
		this.dialog.attr('content', this.getContent());
		this.initAtFirstOpen();
		this.dialog.startup();
	}
	this.initAtOpen();
	this.dialog.show();
	if(firstOpen){ // 最初に開いた時だけデータを読み込む
		this.fetch(dojo.hitch(this, function(flag, errmsg){
			if(flag){ // 成功
				this.createList();
			}else{ // エラー
				this.showError(errmsg);
			}
		}));
	}
};
/**
 * ダイアログ生成時のみ行う初期化
 */
ATK.dialog.WorkLocationsDialog.prototype.initAtFirstOpen = function(){
	// 表の構築
	dojo.byId('workLocationsDomOrder'	).title 	= teasp.message.getLabel('tk10000689'); // 並び順変更
	dojo.byId('workLocationsDomAllLabel').innerHTML = teasp.message.getLabel('tf10004830'); // 無効化分も含めて表示
	var sumWidth = 0;
	const row = dojo.byId('workLocationsDomHeadRow');
	for(var i = 0 ; i < this.cols.length ; i++){
		const col = this.cols[i];
		const w = col.w + (i == (this.cols.length - 1) ? 17 : 1);
		const td = dojo.create('td', { className:'head', style:'width:' + w + 'px;' }, row);
		if(col.n){
			dojo.create('div', { innerHTML:col.n }, td);
		}
		sumWidth += w;
	}
	dojo.style('workLocationsDomContent'  , 'width', sumWidth + 'px');
	dojo.style('workLocationsDomTableArea', 'width', sumWidth + 'px');
	// 各種イベント
	dojo.connect(dojo.byId('workLocationsDomInsert'), 'click', this, this.insert); // 新規追加
	dojo.connect(dojo.byId('workLocationsDomOrder' ), 'click', this, this.changeOrder); // 並び順変更
	dojo.connect(dojo.byId('workLocationsDomAll'   ), 'click', this, this.checkAll); // 無効化分も含めて表示
	dojo.connect(dojo.byId('workLocationsDomClose' ), 'click', this, this.close); // 閉じる
	dojo.connect(this.dialog, 'onCancel', this, this.close); // ×ボタン
};
/**
 * 開くたびに行う初期化
 */
ATK.dialog.WorkLocationsDialog.prototype.initAtOpen = function(){
	this.showError(null);
	dojo.byId('workLocationsDomAll').checked = false;
	this.createList();
};
/**
 * 閉じる
 */
ATK.dialog.WorkLocationsDialog.prototype.close = function(){
	this.dialog.hide();
};
/**
 * HTML
 */
ATK.dialog.WorkLocationsDialog.prototype.getContent = function(){
	return '<div class="dlg_content" id="workLocationsDomContent">'
	+ '  <table class="pane_table" style="width:100%;">'
	+ '  <tr>'
	+ '    <td style="padding:0px 4px 8px 8px;text-align:left;">'
	+ '      <input type="button" class="pb_base pb_btn_new" id="workLocationsDomInsert" />'
	+ '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	+ '      <input type="button" class="pb_base pb_btn_order" id="workLocationsDomOrder" />'
	+ '    </td>'
	+ '  </tr>'
	+ '  </table>'
	+ '  <div style="margin:4px;font-size:90%;vertical-align:bottom;">'
	+ '    <label>'
	+ '      <input type="checkbox" id="workLocationsDomAll" /> <span id="workLocationsDomAllLabel"></span>'
	+ '    </label>'
	+ '  </div>'
	+ '  <table class="stone_area" id="workLocationsDomTableArea">'
	+ '  <tr>'
	+ '    <td>'
	+ '      <table class="stone_table stone_font_12">'
	+ '      <tr id="workLocationsDomHeadRow">'
	+ '      </tr>'
	+ '      </table>'
	+ '      <div class="stone_div" style="min-height:110px;max-height:220px;" id="workLocationsDomTableDiv">'
	+ '        <table class="stone_table stone_font_12" id="workLocationsDomTable">'
	+ '        <tbody></tbody>'
	+ '        </table>'
	+ '      </div>'
	+ '    </td>'
	+ '  </tr>'
	+ '  </table>'
	+ '  <table class="pane_table" style="width:100%;">'
	+ '  <tr id="workLocationsDomErrorRow" style="display:none;">'
	+ '    <td style="text-align:center;">'
	+ '      <div id="workLocationsDomError" style="color:red;margin:4px;"></div>'
	+ '    </td>'
	+ '  </tr>'
	+ '  <tr>'
	+ '    <td style="padding:4px;text-align:center;">'
	+ '      <input type="button" class="pb_base pb_btn_close" style="margin-top:8px;" id="workLocationsDomClose" />'
	+ '    </td>'
	+ '  </tr>'
	+ '  </table>'
	+ '</div>';
};
/**
 * エラー表示
 * @param {string|null} msg
 */
ATK.dialog.WorkLocationsDialog.prototype.showError = function(msg){
	dojo.style('workLocationsDomErrorRow', 'display', (msg ? '' : 'none'));
	dojo.byId('workLocationsDomError').innerHTML = (msg ? msg : '');
};
/**
 * 勤務場所一覧を読み込み
 * @param {Function} callback
 */
ATK.dialog.WorkLocationsDialog.prototype.fetch = function(callback){
	ATK.dialog.BusyWait.open();
	const req = {
		action:'fetchWorkLocations'
	};
	Visualforce.remoting.Manager.invokeAction(this.configAction, dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			ATK.dialog.BusyWait.close();
			if(event.status && result.result != 'NG'){
				teasp.util.excludeNameSpace(result);
				this.acceptResult(result);
				callback(true);
			}else{
				callback(false, teasp.message.getErrorMessage(event.status ? result : event));
			}
		}),
		{ escape : false }
	);
};
/**
 * 読み込んだ勤務場所を変数に格納
 * @param {Object} result
 */
ATK.dialog.WorkLocationsDialog.prototype.acceptResult = function(result){
	this.workLocations = [];
	dojo.forEach(result.workLocations || [], function(record){
		this.workLocations.push(new ATK.obj.WorkLocation(record));
	}, this);
	const common = (result.commons.length ? result.commons[0] : {});
	if(common.DefaultWorkLocationId__c){
		for(var i = 0 ; i < this.workLocations.length ; i++){
			const workLocation = this.workLocations[i];
			if(workLocation.getId() == common.DefaultWorkLocationId__c){
				workLocation.setInitFlag(true);
			}
		}
	}
};
/**
 * 勤務場所一覧表作成
 * @param {Object=} arg
 */
ATK.dialog.WorkLocationsDialog.prototype.createList = function(arg){
	this.clearEventHandles();
	const tbody = dojo.query('#workLocationsDomTable tbody')[0];
	dojo.empty(tbody);
	const showAll = dojo.byId('workLocationsDomAll').checked;
	const focusId = (arg && arg.workLocation && arg.workLocation.Id) || null;
	var h = 0, cnt = 0;
	var chkPos = -1;
	for(var r = 0 ; r < this.workLocations.length ; r++){
		const workLocation = this.workLocations[r];
		const row = this.createRow(tbody, workLocation);
		if(workLocation.isValid()){
			cnt++;
		}
		if(showAll || workLocation.isValid()){
			h += row.clientHeight;
		}
		if(focusId && (workLocation.getId() == focusId)){
			chkPos = h;
		}
	}
	const rowMin = 6; // この行数になるまで空の行を挿入
	var emptyFix = (rowMin - this.workLocations.length);
	while(cnt++ < rowMin){
		this.createRow(tbody, null, (emptyFix-- <= 0));
	}
	// arg.workLocation が指定されていた場合、対象行が見える位置にスクロールする
	const area = dojo.byId('workLocationsDomTableDiv');
	if(chkPos > 0 && area.clientHeight + area.scrollTop < chkPos){
		area.scrollTop = chkPos - area.clientHeight;
	}
	this.checkAll();
};
/**
 * 勤務場所一覧の行作成
 * @param {DOM} tbody
 * @param {ATK.obj.WorkLocation} workLocation
 * @param {boolean=} emptyFold true:全表示時に非表示にする空行
 * @returns {DOM} 行
 */
ATK.dialog.WorkLocationsDialog.prototype.createRow = function(tbody, workLocation, emptyFold){
	const inValid = (workLocation ? !workLocation.isValid() : false);
	const row  = dojo.create('tr', { style:'height:22px;', className: (emptyFold ? 'row-fold' : (inValid ? 'row-invalid' : '')) }, tbody);
	const cols = this.cols;
	var cells = [];
	for(var i = 0 ; i < cols.length ; i++){
		cells.push(dojo.create('td', { style:'width:' + cols[i].w + 'px;'+ cols[i].s }, row));
	}
	if(workLocation){
		dojo.setAttr(row, 'workLocationId', workLocation.getId());
		const btn1 = dojo.create('div',{className:'pp_base pp_btn_edit',style:'margin:1px 2px 1px 2px;',title:teasp.message.getLabel('tk10000240'	   )}, cells[0]); // 編集
		const btn2 = dojo.create('div',{className:'pp_base pp_btn_del' ,style:'margin:1px 2px 1px 2px;',title:teasp.message.getLabel('delete_btn_title')}, cells[1]); // 削除
		dojo.create('div',{ innerHTML:workLocation.getName()		 , style:cols[2].cs }, cells[2]);
		dojo.create('div',{ innerHTML:workLocation.getCountType(true), style:cols[3].cs }, cells[3]);
		dojo.create('div',{ innerHTML:workLocation.getInitFlag()	 , style:cols[4].cs }, cells[4]);
		dojo.create('div',{ innerHTML:workLocation.getValid()		 , style:cols[5].cs }, cells[5]);
		this.eventHandles.push(dojo.connect(btn1, 'click', this, this.update));
		this.eventHandles.push(dojo.connect(btn2, 'click', this, this.deleteStep1));
	}
	return row;
};
/**
 * 「無効化分も含めて表示」切り替え時処理
 */
ATK.dialog.WorkLocationsDialog.prototype.checkAll = function(){
	const showAll = dojo.byId('workLocationsDomAll').checked;
	dojo.query('#workLocationsDomTable tr.row-invalid').forEach(function(el){
		dojo.style(el, 'display', (showAll ? '' : 'none'));
	});
	dojo.query('#workLocationsDomTable tr.row-fold').forEach(function(el){
		dojo.style(el, 'display', (showAll ? 'none' : ''));
	});
	var cnt = 0;
	dojo.query('#workLocationsDomTable tr').forEach(function(el){
		if(dojo.style(el, 'display') != 'none'){
			if(dojo.hasClass(el, 'row-invalid')){
				dojo.toggleClass(el, 'invalid-even', (cnt%2)==0);
				dojo.toggleClass(el, 'invalid-odd' , (cnt%2)!=0);
			}else{
				dojo.toggleClass(el, 'even', (cnt%2)==0);
				dojo.toggleClass(el, 'odd' , (cnt%2)!=0);
			}
			cnt++;
		}
	});
};
/**
 * リソース解放
 */
ATK.dialog.WorkLocationsDialog.prototype.clearEventHandles = function(){
	dojo.forEach(this.eventHandles, function(eventHandle){
		dojo.disconnect(eventHandle);
	});
	this.eventHandles = [];
};
/**
 * 選択した行の勤務場所を得る
 * @param {DOM} node 選択行内のDOM
 * @returns {ATK.obj.WorkLocation|null}
 */
ATK.dialog.WorkLocationsDialog.prototype.getWorkLocationByNode = function(node){
	const row = teasp.util.getAncestorByTagName(node, 'TR');
	if(row){
		const id = dojo.getAttr(row, 'workLocationId');
		for(var i = 0 ; i < this.workLocations.length ; i++){
			const workLocation = this.workLocations[i];
			if(workLocation.getId() == id){
				return workLocation;
			}
		}
	}
};
/**
 * 有効な勤務場所を数えて上限に達したかどうかを判断する
 * @returns {Object}
 */
ATK.dialog.WorkLocationsDialog.prototype.checkMaxValid = function(){
	var validCnt = 0;
	for(var i = 0 ; i < this.workLocations.length ; i++){
		const workLocation = this.workLocations[i];
		if(workLocation.isValid()){
			validCnt++;
		}
	}
	return {
		limit: ATK.dialog.WorkLocationsDialog.MAX_SIZE,
		validCnt: validCnt,
		ng: (validCnt >= ATK.dialog.WorkLocationsDialog.MAX_SIZE)
	};
};
/**
 * 新規追加
 */
ATK.dialog.WorkLocationsDialog.prototype.insert = function(){
	const resultMax = this.checkMaxValid();
	if(resultMax.ng){
		teasp.tsAlert(teasp.message.getLabel('tw00000240', resultMax.limit)); // 有効な勤務場所が上限{0}件に達しているため、追加できません。
		return;
	}
	// 空のWorkLocationクラスのインスタンス
	const emptyWl = new ATK.obj.WorkLocation({
		Id: null,
		Name: '',
		OfficeDays__c: 1,
		HomeDays__c: 0,
		Removed__c: false
	});
	this.openEditDialog({ workLocation: emptyWl });
};
/**
 * 編集
 * @param {Object} e
 */
ATK.dialog.WorkLocationsDialog.prototype.update = function(e){
	const workLocation = this.getWorkLocationByNode(e.target);
	if(!workLocation){
		return;
	}
	this.checkReferenced({ workLocation: workLocation }).then( // 参照の有無をチェック
		dojo.hitch(this, function(referenced){
			this.openEditDialog({ workLocation: workLocation, referenced: referenced });
		}),
		dojo.hitch(this, function(errmsg){
			this.showError(errmsg);
		})
	);
};
/**
 * 削除1
 * @param {Object} e
 */
ATK.dialog.WorkLocationsDialog.prototype.deleteStep1 = function(e){
	const workLocation = this.getWorkLocationByNode(e.target);
	if(workLocation.isValid()){
        // 勤務場所「{0}」を無効化してよろしいですか？
        teasp.tsConfirm(teasp.message.getLabel('tw00000180', workLocation.getName()), this, function(confirmOk){
            if(confirmOk){
                this.deleteStep2(workLocation, false);
            }
        });
	}else{
		this.checkReferenced({ workLocation: workLocation }).then( // 参照の有無をチェック
			dojo.hitch(this, function(referenced){
				// alert()やconfirm()をすぐ呼ぶとお待ちください表示が消えないため、setTimeout でタイミングをずらす
				if(referenced){ // 参照されている
					setTimeout(dojo.hitch(this, function(){
						teasp.tsAlert(teasp.message.getLabel('tw00000190', workLocation.getName())); // 勤務場所「{0}」は既に使用されており削除できません。
					}), 100);
				}else{
					setTimeout(dojo.hitch(this, function(){
                        // 勤務場所「{0}」を完全に削除してよろしいですか？
                        teasp.tsConfirm(teasp.message.getLabel('tw00000200', workLocation.getName()), this, function(confirmOk){
                            if(confirmOk){
                                this.deleteStep2(workLocation, true);
                            }
                        });
					}), 100);
				}
			}),
			dojo.hitch(this, function(errmsg){
				this.showError(errmsg);
			})
		);
	}
};
/**
 * 削除2
 * @param {ATK.obj.WorkLocation} workLocation
 * @param {boolean=} complete true:完全削除  false:論理削除
 */
ATK.dialog.WorkLocationsDialog.prototype.deleteStep2 = function(workLocation, complete){
	ATK.dialog.BusyWait.open();
	const req = {
		action:'deleteWorkLocation',
		targetIds: [workLocation.getId()],
		complete: complete
	};
	Visualforce.remoting.Manager.invokeAction(this.configAction, dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			ATK.dialog.BusyWait.close();
			if(event.status && result.result != 'NG'){
				teasp.util.excludeNameSpace(result);
				this.acceptResult(result);
				this.createList();
			}else{
				this.showError(teasp.message.getErrorMessage(event.status ? result : event));
			}
		}),
		{ escape : false }
	);
};
/**
 * 参照有無チェック
 * @param {{workLocation: {ATK.obj.WorkLocation}}} arg
 * @returns {Object}
 */
ATK.dialog.WorkLocationsDialog.prototype.checkReferenced = function(arg){
	const deferred = new dojo.Deferred();
	const workLocation = arg.workLocation;
	ATK.dialog.BusyWait.open();
	const req = {
		action:'checkWorkLocation',
		targetIds: [workLocation.getId()]
	};
	Visualforce.remoting.Manager.invokeAction(this.configAction, dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			ATK.dialog.BusyWait.close();
			if(event.status && result.result != 'NG'){
				teasp.util.excludeNameSpace(result);
				deferred.resolve(result.referenced);
			}else{
				deferred.reject(teasp.message.getErrorMessage(event.status ? result : event));
			}
		}),
		{ escape : false }
	);
	return deferred.promise;
};
/**
 * 編集ダイアログを開く
 * @param {Object} arg
 */
ATK.dialog.WorkLocationsDialog.prototype.openEditDialog = function(arg){
	this.editDialog.open(arg, dojo.hitch(this, this.checkMaxValid)).then(
		dojo.hitch(this, function(result){
			this.acceptResult(result);
			this.createList(result);
		})
	);
};
/**
 * 並び順変更ダイアログを開く
 */
ATK.dialog.WorkLocationsDialog.prototype.changeOrder = function(){
	this.orderDialog.open({ workLocations: this.workLocations }).then(
		dojo.hitch(this, function(result){
			this.acceptResult(result);
			this.createList();
		})
	);
};
/* -------------------------------------------------------------------
 * 勤務場所編集ダイアログ
 */
ATK.dialog.WorkLocationEditDialog = function(configAction){
	this.configAction = configAction;
	this.dialog = null;
};
/**
 * 開く
 * @param {{workLocation: {ATK.obj.WorkLocation},
 *			referenced: {boolean} }} arg
 * @returns {Object}
 */
ATK.dialog.WorkLocationEditDialog.prototype.open = function(arg, checkMaxValid){
	this.workLocation = arg.workLocation;
	this.deferred = new dojo.Deferred();
	if(!this.dialog){
		this.dialog = new dijit.Dialog({
			title	 : teasp.message.getLabel('tw00000050'), // 勤務場所編集
			id		 : 'workLocationEditDomDialog',
			duration : 200
		});
		this.dialog.attr('content', this.getContent());
		this.initAtFirstOpen();
		this.dialog.startup();
	}
	this.checkMaxValid = checkMaxValid;
	this.initAtOpen(arg);
	this.dialog.show();
	return this.deferred.promise;
};
/**
 * ダイアログ生成時のみ行う初期化
 */
ATK.dialog.WorkLocationEditDialog.prototype.initAtFirstOpen = function(){
	dojo.byId('workLocationEditDomNameLabel' ).innerHTML = teasp.message.getLabel('tw00000040'); // 表示名
	dojo.byId('workLocationEditDomCTLabel'	 ).innerHTML = teasp.message.getLabel('tw00000020'); // カウント対象
	dojo.byId('workLocationEditDomCT1Label'  ).innerHTML = teasp.message.getLabel('tw00000090'); // 出社
	dojo.byId('workLocationEditDomCT2Label'  ).innerHTML = teasp.message.getLabel('tw00000100'); // テレワーク
	dojo.byId('workLocationEditDomCT3Label'  ).innerHTML = teasp.message.getLabel('tw00000110'); // 出社・テレワーク
	dojo.byId('workLocationEditDomCT4Label'  ).innerHTML = teasp.message.getLabel('tw00000120'); // 対象外
	dojo.byId('workLocationEditDomInitLabel' ).innerHTML = teasp.message.getLabel('tw00000150'); // 初期値とする
	dojo.byId('workLocationEditDomValidLabel').innerHTML = teasp.message.getLabel('tw00000160'); // 有効
	dojo.connect(dojo.byId('workLocationEditDomOk'	  ), 'click', this, this.saveStep1);
	dojo.connect(dojo.byId('workLocationEditDomCancel'), 'click', this, this.close);
	dojo.connect(this.dialog, 'onCancel', this, this.close); // ×ボタン
};
/**
 * 開くたびに行う初期化
 * @param {{referenced: {boolean}}} arg
 */
ATK.dialog.WorkLocationEditDialog.prototype.initAtOpen = function(arg){
	this.showError(null);
	dojo.byId('workLocationEditDomName' ).value   = this.workLocation.getName(); // 表示名
	dojo.byId('workLocationEditDomInit' ).checked = this.workLocation.isInitFlag(); //　初期値
	dojo.byId('workLocationEditDomValid').checked = this.workLocation.isValid(); // 有効
	switch(this.workLocation.getCountType(false)){ // カウント対象
		case 2:  dojo.byId('workLocationEditDomCT2').checked = true; break;
		case 3:  dojo.byId('workLocationEditDomCT3').checked = true; break;
		case 4:  dojo.byId('workLocationEditDomCT4').checked = true; break;
		default: dojo.byId('workLocationEditDomCT1').checked = true; break;
	}
	// 参照されている場合、カウント対象を変更できないように非活性にする
	dojo.query('input[type="radio"]', dojo.byId('workLocationEditDomCTGroup')).forEach(function(el){
		dojo.setAttr(el, 'disabled', (arg && arg.referenced ? true : false));
	});
};
/**
 * 登録結果を返して閉じる
 * @param {Object} result
 */
ATK.dialog.WorkLocationEditDialog.prototype.done = function(result){
	this.dialog.hide();
	this.deferred.resolve(result);
};
/**
 * キャンセル
 */
ATK.dialog.WorkLocationEditDialog.prototype.close = function(){
	this.dialog.hide();
	this.deferred.reject();
};
/**
 * HTML
 */
 ATK.dialog.WorkLocationEditDialog.prototype.getContent = function(){
	return '<div class="dlg_content" style="width:350px;">'
	+ '    <table class="ts_a_frame">'
	+ '    <tr>'
	+ '      <td class="edgelt"></td>'
	+ '      <td class="edgeht"></td>'
	+ '      <td class="edgert"></td>'
	+ '    </tr>'
	+ '    <tr>'
	+ '      <td class="edgevl"></td>'
	+ '      <td>'
	+ '        <div class="edge_div">'
	+ '          <table class="stand_table">'
	+ '          <tr>'
	+ '            <td class="left_s" id="workLocationEditDomNameLabel">'
	+ '            </td>'
	+ '            <td class="right">'
	+ '                <input type="text" class="inputran" id="workLocationEditDomName" maxlength="20" style="width:200px;padding:2px;">'
	+ '            </td>'
	+ '          </tr>'
	+ '          </table>'
	+ '        </div>'
	+ '      </td>'
	+ '      <td class="edgevr"></td>'
	+ '    </tr>'
	+ '    <tr>'
	+ '      <td class="edgevl"></td>'
	+ '      <td>'
	+ '        <div class="edge_div">'
	+ '          <table class="stand_table">'
	+ '          <tr>'
	+ '            <td class="left_s" id="workLocationEditDomCTLabel">'
	+ '            </td>'
	+ '            <td class="right" id="workLocationEditDomCTGroup">'
	+ '              <label><input type="radio" name="workLocationCT" id="workLocationEditDomCT1" /> <span id="workLocationEditDomCT1Label"></span></label><br/>'
	+ '              <label><input type="radio" name="workLocationCT" id="workLocationEditDomCT2" /> <span id="workLocationEditDomCT2Label"></span></label><br/>'
	+ '              <label><input type="radio" name="workLocationCT" id="workLocationEditDomCT3" /> <span id="workLocationEditDomCT3Label"></span></label><br/>'
	+ '              <label><input type="radio" name="workLocationCT" id="workLocationEditDomCT4" /> <span id="workLocationEditDomCT4Label"></span></label>'
	+ '            </td>'
	+ '          </tr>'
	+ '          </table>'
	+ '        </div>'
	+ '      </td>'
	+ '      <td class="edgevr"></td>'
	+ '    </tr>'
	+ '    <tr>'
	+ '      <td class="edgevl"></td>'
	+ '      <td>'
	+ '        <div class="edge_div">'
	+ '          <label style="margin-left:20px;"><input type="checkbox" id="workLocationEditDomInit" > <span id="workLocationEditDomInitLabel"></span></label><br/>'
	+ '        </div>'
	+ '      </td>'
	+ '      <td class="edgevr"></td>'
	+ '    </tr>'
	+ '    <tr>'
	+ '      <td class="edgevl"></td>'
	+ '      <td>'
	+ '        <div class="edge_div">'
	+ '          <label style="margin-left:20px;"><input type="checkbox" id="workLocationEditDomValid" > <span id="workLocationEditDomValidLabel"></span></label><br/>'
	+ '        </div>'
	+ '      </td>'
	+ '      <td class="edgevr"></td>'
	+ '    </tr>'
	+ '    <tr>'
	+ '      <td class="edgelb"></td>'
	+ '      <td class="edgehb"></td>'
	+ '      <td class="edgerb"></td>'
	+ '    </tr>'
	+ '    </table>'
	+ '    <table class="pane_table" style="width:100%;">'
	+ '    <tr id="workLocationEditDomErrorRow" style="display:none;">'
	+ '      <td style="text-align:center;">'
	+ '        <div id="workLocationEditDomError" style="color:red;margin:4px;"></div>'
	+ '      </td>'
	+ '    </tr>'
	+ '    <tr>'
	+ '      <td style="padding:16px 0px 4px 0px;text-align:center;">'
	+ '        <input type="button" class="pb_base pb_btn_regist" id="workLocationEditDomOk">'
	+ '        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	+ '        <input type="button" class="pb_base pb_btn_cancel" id="workLocationEditDomCancel">'
	+ '      </td>'
	+ '    </tr>'
	+ '    </table>'
	+ '</div>';
};
/**
 * エラー表示
 * @param {string|null} msg
 */
ATK.dialog.WorkLocationEditDialog.prototype.showError = function(msg){
	dojo.style('workLocationEditDomErrorRow', 'display', (msg ? '' : 'none'));
	dojo.byId('workLocationEditDomError').innerHTML = (msg ? msg : '');
};
/**
 * 登録
 */
ATK.dialog.WorkLocationEditDialog.prototype.saveStep1 = function(){
	this.showError(null);
	const req = {
		action:'upsertWorkLocation',
		workLocation: dojo.clone(this.workLocation.getObj() || {}),
		initFlag: dojo.byId('workLocationEditDomInit').checked
	};
	req.workLocation.Name = dojo.byId('workLocationEditDomName').value.trim();
	if(!req.workLocation.Name){
		this.showError(teasp.message.getLabel('tw00000210')); // 表示名を入力してください
		return;
	}
	if(dojo.byId('workLocationEditDomCT1').checked){ // 出社
		req.workLocation.OfficeDays__c = 1;
		req.workLocation.HomeDays__c   = 0;
	}else if(dojo.byId('workLocationEditDomCT2').checked){ // テレワーク
		req.workLocation.OfficeDays__c = 0;
		req.workLocation.HomeDays__c   = 1;
	}else if(dojo.byId('workLocationEditDomCT3').checked){ // 出社・テレワーク
		req.workLocation.OfficeDays__c = 1;
		req.workLocation.HomeDays__c   = 1;
	}else{ // 対象外
		req.workLocation.OfficeDays__c = 0;
		req.workLocation.HomeDays__c   = 0;
	}
	req.workLocation.Removed__c = dojo.byId('workLocationEditDomValid').checked ? false : true; // 有効
	if(req.workLocation.Removed__c){
		req.initFlag = false; // 無効の場合、初期値は強制でオフ
	}
	if(this.workLocation.getId() && !this.workLocation.isValid() && !req.workLocation.Removed__c){ // 既存の勤務場所を無効から有効に変える
		const resultMax = this.checkMaxValid();
		if(resultMax.ng){
			teasp.tsAlert(teasp.message.getLabel('tw00000241', resultMax.limit)); // 有効な勤務場所が上限{0}件に達しているため、有効化できません。
			return;
		}
	}
	this.saveStep2(req);
};
/**
 * 登録実行
 * @param {Object} req
 */
ATK.dialog.WorkLocationEditDialog.prototype.saveStep2 = function(req){
	ATK.dialog.BusyWait.open();
	Visualforce.remoting.Manager.invokeAction(this.configAction, dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			ATK.dialog.BusyWait.close();
			if(event.status && result.result != 'NG'){
				teasp.util.excludeNameSpace(result);
				this.done(result);
			}else{
				this.showError(teasp.message.getErrorMessage(event.status ? result : event));
			}
		}),
		{ escape : false }
	);
};

/* -------------------------------------------------------------------
 * 勤務場所並び順変更ダイアログ
 */
ATK.dialog.WorkLocationOrderDialog = function(configAction){
	this.configAction = configAction;
	this.dialog = null;
	this.eventHandles = [];
};
/**
 * 開く
 * @param {{workLocations: {Array.<ATK.obj.WorkLocation>}}} arg
 * @returns {Object}
 */
ATK.dialog.WorkLocationOrderDialog.prototype.open = function(arg){
	this.workLocations = arg.workLocations;
	this.deferred = new dojo.Deferred();
	if(!this.dialog){
		this.dialog = new dijit.Dialog({
			title	 : teasp.message.getLabel('tk10000689'), // 並び順変更
			duration : 200
		});
		this.dialog.attr('content', this.getContent());
		this.initAtFirstOpen();
		this.dialog.startup();
	}
	this.initAtOpen();
	this.dialog.show();
	return this.deferred.promise;
};
/**
 * ダイアログ生成時のみ行う初期化
 */
ATK.dialog.WorkLocationOrderDialog.prototype.initAtFirstOpen = function(){
	dojo.byId('workLocationOrderDomUp'	).title = teasp.message.getLabel('up_btn_title');	// 上へ
	dojo.byId('workLocationOrderDomDown').title = teasp.message.getLabel('down_btn_title'); // 下へ
	dojo.connect(dojo.byId('workLocationOrderDomUp'    ), 'click', this, this.clickUp);
	dojo.connect(dojo.byId('workLocationOrderDomDown'  ), 'click', this, this.clickDown);
	dojo.connect(dojo.byId('workLocationOrderDomOk'    ), 'click', this, this.saveStep1);
	dojo.connect(dojo.byId('workLocationOrderDomCancel'), 'click', this, this.close);
	dojo.connect(this.dialog, 'onCancel', this, this.close); // ×ボタン
};
/**
 * 開くたびに行う初期化
 */
 ATK.dialog.WorkLocationOrderDialog.prototype.initAtOpen = function(){
	this.clearEventHandles();
	this.showError(null);
	const tbody = dojo.byId('workLocationOrderDomChange');
	dojo.empty(tbody);
	for(var i = 0 ; i < this.workLocations.length ; i++){
		const workLocation = this.workLocations[i];
		const cn = (workLocation.isValid() ? '' : 'row-invalid invalid-') + ((i%2)==0 ? 'even' : 'odd');
		const row = dojo.create('tr', {className : 'sele ' + cn}, tbody);
		dojo.setAttr(row, 'workLocationId', workLocation.getId());
		this.eventHandles.push(dojo.connect(row, 'click', this, this.clickRow));
		dojo.create('input', {type: 'checkbox'}, dojo.create('td', { style:"width:24px;border-left:none;border-right:none;" }, row));
		dojo.create('div', {
			innerHTML : workLocation.getName(),
			style	  : "margin:1px 2px;work-break:break-all;"
		}, dojo.create('td', {
			style	: "width:220px;text-align:left;border-left:none;border-right:1px solid #9FA0A6;"
		}, row));
		dojo.create('div', {
			innerHTML : workLocation.getValid(),
			style	  : "margin:1px 2px;font-family:sans-serif;"
		}, dojo.create('td', {
			style	: "width:40px;text-align:center;border-left:none;border-right:1px solid #9FA0A6;" // #e0e0e0
		}, row));
	}
};
/**
 * リソース解放
 */
ATK.dialog.WorkLocationOrderDialog.prototype.clearEventHandles = function(){
	dojo.forEach(this.eventHandles, function(eventHandle){
		dojo.disconnect(eventHandle);
	});
	this.eventHandles = [];
};
/**
 * 登録結果を返して閉じる
 * @param {Object} result
 */
ATK.dialog.WorkLocationOrderDialog.prototype.done = function(result){
	this.dialog.hide();
	this.deferred.resolve(result);
};
/**
 * キャンセル
 */
ATK.dialog.WorkLocationOrderDialog.prototype.close = function(){
	this.dialog.hide();
	this.deferred.reject();
};
/**
 * HTML
 */
 ATK.dialog.WorkLocationOrderDialog.prototype.getContent = function(){
	return '<div style="width:380px;">' // 並び順変更
	+ '  <table class="ts_a_frame">'
	+ '  <tr>'
	+ '    <td class="edgelt"></td>'
	+ '    <td class="edgeht"></td>'
	+ '    <td class="edgert"></td>'
	+ '  </tr>'
	+ '  <tr>'
	+ '    <td class="edgevl"></td>'
	+ '    <td>'
	+ '      <div class="edge_div">'
	+ '        <table class="stand_table" style="margin:4px;">'
	+ '        <tr>'
	+ '          <td style="width:300px;">'
	+ '            <div id="workLocationOrderDomArea" style="width:300px;max-height:276px;min-height:50px;padding:0px;margin:0px;overflow-y:scroll;border:1px solid #539AC7;background-color:#FFFFFF;">'
	+ '              <table class="stone_table">'
	+ '              <tbody id="workLocationOrderDomChange">'
	+ '              </tbody>'
	+ '              </table>'
	+ '            </div>'
	+ '          </td>'
	+ '          <td style="vertical-align:middle;padding-left:10px;">'
	+ '            <table class="pane_table" style="width:38px;">'
	+ '            <tr>'
	+ '              <td style="padding-bottom:8px;">'
	+ '                <input type="button" id="workLocationOrderDomUp" class="pb_base pb_btn_upto" />'
	+ '              </td>'
	+ '            </tr>'
	+ '            <tr>'
	+ '              <td style="padding-top:8px;">'
	+ '                <input type="button" id="workLocationOrderDomDown" class="pb_base pb_btn_downto" />'
	+ '              </td>'
	+ '            </tr>'
	+ '            </table>'
	+ '          </td>'
	+ '        </tr>'
	+ '        </table>'
	+ '      </div>'
	+ '    </td>'
	+ '    <td class="edgevr"></td>'
	+ '  </tr>'
	+ '  <tr>'
	+ '    <td class="edgelb"></td>'
	+ '    <td class="edgehb"></td>'
	+ '    <td class="edgerb"></td>'
	+ '  </tr>'
	+ '  </table>'
	+ '  <table border="0" cellpadding="0" cellspacing="0" style="width:100%;">'
	+ '  <tr id="workLocationOrderDomErrorRow" style="display:none;">'
	+ '    <td style="text-align:center;">'
	+ '      <div id="workLocationOrderDomError" style="color:red;margin:4px;"></div>'
	+ '    </td>'
	+ '  </tr>'
	+ '  <tr>'
	+ '    <td colspan="2" style="padding:16px 0px 4px 0px;text-align:center;">'
	+ '      <input type="button" class="pb_base pb_btn_regist" id="workLocationOrderDomOk" />'
	+ '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	+ '      <input type="button" class="pb_base pb_btn_cancel" id="workLocationOrderDomCancel" />'
	+ '    </td>'
	+ '  </tr>'
	+ '  </table>'
	+ '</div>';
};
/**
 * エラー表示
 * @param {string|null} msg
 */
 ATK.dialog.WorkLocationOrderDialog.prototype.showError = function(msg){
	dojo.style('workLocationOrderDomErrorRow', 'display', (msg ? '' : 'none'));
	dojo.byId('workLocationOrderDomError').innerHTML = (msg ? msg : '');
};
/**
 * 行クリック
 */
ATK.dialog.WorkLocationOrderDialog.prototype.clickRow = function(e){
	if(e.target.tagName == 'INPUT' && e.target.type == 'checkbox'){
		return;
	}
	const row = teasp.util.getAncestorByTagName(e.target, 'TR');
	dojo.query('input[type="checkbox"]', row).forEach(function(el){
		el.checked = !el.checked;
	});
};
/**
 * 上へ
 */
ATK.dialog.WorkLocationOrderDialog.prototype.clickUp = function(){
	const tbody = dojo.byId('workLocationOrderDomChange');
	for(var r = 0 ; r < tbody.rows.length ; r++){
		const node = tbody.rows[r].cells[0].firstChild;
		if(node.checked && r > 0 && !tbody.rows[r - 1].cells[0].firstChild.checked){
			const row = tbody.removeChild(tbody.rows[r - 1]);
			const row2 = tbody.rows[r];
			if(!row2){
				tbody.appendChild(row);
			}else{
				tbody.insertBefore(row, row2);
			}
		}
	}
	this.afterUpDown(tbody, false);
};
/**
 * 下へ
 */
ATK.dialog.WorkLocationOrderDialog.prototype.clickDown = function(){
	const tbody = dojo.byId('workLocationOrderDomChange');
    var changed = false;
	for(var r = tbody.rows.length - 1 ; r >= 0	; r--){
		const node = tbody.rows[r].cells[0].firstChild;
		if(node.checked && r < (tbody.rows.length - 1) && !tbody.rows[r + 1].cells[0].firstChild.checked){
			tbody.insertBefore(tbody.removeChild(tbody.rows[r + 1]), tbody.rows[r]);
            changed = true;
		}
	}
    if(changed){
        this.afterUpDown(tbody, true);
    }
};
/**
 * 移動後の表示修正
 * @param {DOM} tbody
 * @param {boolean} face
 */
ATK.dialog.WorkLocationOrderDialog.prototype.afterUpDown = function(tbody, face){
	var h = 0;
	var chkPos = -1;
	for(var r = 0 ; r < tbody.rows.length ; r++){
		const row = tbody.rows[r];
		if(dojo.hasClass(row, 'row-invalid')){
			dojo.toggleClass(row, 'invalid-even', (r%2)==0);
			dojo.toggleClass(row, 'invalid-odd' , (r%2)!=0);
		}else{
			dojo.toggleClass(row, 'even', (r%2)==0);
			dojo.toggleClass(row, 'odd' , (r%2)!=0);
		}
		h += row.clientHeight;
		if(dojo.query('input[type="checkbox"]:checked', row).length){
			chkPos = h;
		}
	}
	if(face && chkPos > 0){
		const area = dojo.byId('workLocationOrderDomArea');
		if(area.clientHeight + area.scrollTop < chkPos){
			area.scrollTop = chkPos - area.clientHeight;
		}
	}
};
/**
 * 登録
 */
ATK.dialog.WorkLocationOrderDialog.prototype.saveStep1 = function(){
	const tbody = dojo.byId('workLocationOrderDomChange');
	const req = {
		action:'sortWorkLocations',
		workLocations:[]
	};
	for(var r = 0 ; r < tbody.rows.length ; r++){
		const row = tbody.rows[r];
		const id = dojo.getAttr(row, 'workLocationId');
		if(id){
			req.workLocations.push({
				Id: id,
				Order__c: (r+1)
			});
		}
	}
	this.saveStep2(req);
};
/**
 * 登録実行
 * @param {Object} req
 */
ATK.dialog.WorkLocationOrderDialog.prototype.saveStep2 = function(req){
	ATK.dialog.BusyWait.open();
	Visualforce.remoting.Manager.invokeAction(this.configAction, dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			ATK.dialog.BusyWait.close();
			if(event.status && result.result != 'NG'){
				teasp.util.excludeNameSpace(result);
				this.done(result);
			}else{
				this.showError(teasp.message.getErrorMessage(event.status ? result : event));
			}
		}),
		{ escape : false }
	);
};
/*--------------------------------------------------------------------
 * 休暇グループクラス
 * @param {Object} obj HolidayGroup__c
 */
ATK.obj.HolidayGroup = function(obj){
    this.obj = obj;
};
ATK.obj.HolidayGroup.prototype.getObj = function(){ return this.obj; };
ATK.obj.HolidayGroup.prototype.getId  = function(){ return this.obj.Id; };
ATK.obj.HolidayGroup.prototype.getName = function(){ return this.obj.Name; };
ATK.obj.HolidayGroup.prototype.getType = function(){ return this.obj.Type__c; };
ATK.obj.HolidayGroup.prototype.getDispasInt = function(){ return this.obj.DispasInt__c; };

ATK.obj.HolidayGroup.GET_SHORT = 1;
ATK.obj.HolidayGroup.GET_NUM = 2;

ATK.obj.HolidayGroup.A_TYPE='A'  //:年次有給休暇
ATK.obj.HolidayGroup.S_TYPE='S'  //:代休
ATK.obj.HolidayGroup.H_TYPE='H'  //:時間単位有休制限
ATK.obj.HolidayGroup.U_TYPE='U'  //:ユーザ定義の日数管理兼集計グループ
ATK.obj.HolidayGroup.G_TYPE='G'  //:ユーザ定義の集計グループ（日数管理は行わない）

/**
 * 日数管理項目による、グループ種別文字列を取得する。
 * @param {number} getmode GET_SHORT:略記名称を返す、GET_NUM:1～2を返す
 * @returns {string|number}
 */
ATK.obj.HolidayGroup.prototype.getGroupName = function(getmode){
    
    //日数管理項目によって、取得対象のグループ種別文字列を選定
    var x = this.obj.DaysManage__c ? 1 : 2 ;

    if(getmode == ATK.obj.HolidayGroup.GET_NUM){
        return x;
    }else{
        // デフォルトは略記名称を返す
        return [
            teasp.message.getLabel('hg00000060'), // 日数管理+集計
            teasp.message.getLabel('hg00000070'), // 集計
        ][x-1];
    }
};

/*--------------------------------------------------------------------
 * 休暇グループ一覧ダイアログ
 * @param {string} configAction Javascript Remoting Action Function
 */
ATK.dialog.HolidayGroupsDialog = function(configAction){
	this.configAction = configAction;
	this.dialog = null;
	this.holidayGroups = [];
	this.eventHandles = [];
	this.editDialog  = new ATK.dialog.HolidayGroupEditDialog(configAction);  // 編集ダイアログ
	this.orderDialog = new ATK.dialog.HolidayGroupOrderDialog(configAction); // 並び順変更ダイアログ
	this.cols = [ // 表の列
		{n:''								   , w: 38, s:'text-align:center;border-left:none;',cs:''		}, // 編集ボタン
		{n:''								   , w: 38, s:'text-align:center;' ,cs:''						}, // 削除ボタン
        {n:teasp.message.getLabel('hg00000030'), w:250, s:'text-align:left;'   ,cs:'word-break:break-all;'    }, // 休暇グループ名
        {n:teasp.message.getLabel('hg00000050'), w:120, s:'text-align:center;' ,cs:''                        } // グループ種別
	];
};
/**
 * 開く
 */
ATK.dialog.HolidayGroupsDialog.prototype.open = function(){
    this.deferred = new dojo.Deferred();
	var firstOpen = !this.dialog;
	if(firstOpen){
		this.dialog = new dijit.Dialog({
			title	 : teasp.message.getLabel('hg00000010'), // 休暇グループ一覧
			duration : 300
		});
		this.dialog.attr('content', this.getContent());
		this.initAtFirstOpen();
		this.dialog.startup();
	}
	this.initAtOpen();
	this.dialog.show();
    this.fetch(dojo.hitch(this, function(flag, errmsg){
        if(flag){ // 成功
            this.createList();
        }else{ // エラー
            this.showError(errmsg);
        }
    }));
    return this.deferred.promise;
};
/**
 * ダイアログ生成時のみ行う初期化
 */
ATK.dialog.HolidayGroupsDialog.prototype.initAtFirstOpen = function(){
	// 表の構築
	dojo.byId('holidayGroupsDomOrder'	).title 	= teasp.message.getLabel('tk10000689'); // 並び順変更
	var sumWidth = 0;
	const row = dojo.byId('holidayGroupsDomHeadRow');
	for(var i = 0 ; i < this.cols.length ; i++){
		const col = this.cols[i];
		const w = col.w + (i == (this.cols.length - 1) ? 17 : 1);
		const td = dojo.create('td', { className:'head', style:'width:' + w + 'px;' }, row);
		if(col.n){
			dojo.create('div', { innerHTML:col.n }, td);
		}
		sumWidth += w;
	}
	dojo.style('holidayGroupsDomContent'  , 'width', sumWidth + 'px');
	dojo.style('holidayGroupsDomTableArea', 'width', sumWidth + 'px');
	// 各種イベント
	dojo.connect(dojo.byId('holidayGroupsDomInsert'), 'click', this, this.insert); // 新規追加
	dojo.connect(dojo.byId('holidayGroupsDomOrder' ), 'click', this, this.changeOrder); // 並び順変更
	dojo.connect(dojo.byId('holidayGroupsDomClose' ), 'click', this, this.close); // 閉じる
	dojo.connect(this.dialog, 'onCancel', this, this.close); // ×ボタン
};
/**
 * 開くたびに行う初期化
 */
ATK.dialog.HolidayGroupsDialog.prototype.initAtOpen = function(){
	this.showError(null);
	this.createList();
};
/**
 * 閉じる
 */
ATK.dialog.HolidayGroupsDialog.prototype.close = function(){
	this.dialog.hide();
    this.deferred.resolve(this.holidayGroups);
};
/**
 * HTML
 */
ATK.dialog.HolidayGroupsDialog.prototype.getContent = function(){
	return '<div class="dlg_content" id="holidayGroupsDomContent">'
	+ '  <table class="pane_table" style="width:100%;">'
	+ '  <tr>'
	+ '    <td style="padding:0px 4px 8px 8px;text-align:left;">'
	+ '      <input type="button" class="pb_base pb_btn_new" id="holidayGroupsDomInsert" />'
	+ '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	+ '      <input type="button" class="pb_base pb_btn_order" id="holidayGroupsDomOrder" />'
	+ '    </td>'
	+ '  </tr>'
	+ '  </table>'
	+ '  <table class="stone_area" id="holidayGroupsDomTableArea">'
	+ '  <tr>'
	+ '    <td>'
	+ '      <table class="stone_table stone_font_12">'
	+ '      <tr id="holidayGroupsDomHeadRow">'
	+ '      </tr>'
	+ '      </table>'
	+ '      <div class="stone_div" style="min-height:110px;max-height:220px;" id="holidayGroupsDomTableDiv">'
	+ '        <table class="stone_table stone_font_12" id="holidayGroupsDomTable">'
	+ '        <tbody></tbody>'
	+ '        </table>'
	+ '      </div>'
	+ '    </td>'
	+ '  </tr>'
	+ '  </table>'
	+ '  <table class="pane_table" style="width:100%;">'
	+ '  <tr id="holidayGroupsDomErrorRow" style="display:none;">'
	+ '    <td style="text-align:center;">'
	+ '      <div id="holidayGroupsDomError" style="color:red;margin:4px;"></div>'
	+ '    </td>'
	+ '  </tr>'
	+ '  <tr>'
	+ '    <td style="padding:4px;text-align:center;">'
	+ '      <input type="button" class="pb_base pb_btn_close" style="margin-top:8px;" id="holidayGroupsDomClose" />'
	+ '    </td>'
	+ '  </tr>'
	+ '  </table>'
	+ '</div>';
};
/**
 * エラー表示
 * @param {string|null} msg
 */
ATK.dialog.HolidayGroupsDialog.prototype.showError = function(msg){
	dojo.style('holidayGroupsDomErrorRow', 'display', (msg ? '' : 'none'));
	dojo.byId('holidayGroupsDomError').innerHTML = (msg ? msg : '');
};
/**
 * 休暇グループ一覧を読み込み
 * @param {Function} callback
 */
ATK.dialog.HolidayGroupsDialog.prototype.fetch = function(callback){
	ATK.dialog.BusyWait.open();
	const req = {
		action:'fetchHolidayGroups'
	};
	Visualforce.remoting.Manager.invokeAction(this.configAction, dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			ATK.dialog.BusyWait.close();
			if(event.status && result.result != 'NG'){
				teasp.util.excludeNameSpace(result);
				this.acceptResult(result);
				callback(true);
			}else{
                ATK.dialog.BusyWait.close();
				callback(false, teasp.message.getErrorMessage(event.status ? result : event));
			}
		}),
		{ escape : false }
	);
};
/**
 * 読み込んだ休暇グループを変数に格納
 * @param {Object} result
 */
ATK.dialog.HolidayGroupsDialog.prototype.acceptResult = function(result){
	this.holidayGroups = [];
	dojo.forEach(result.holidayGroups || [], function(record){
		this.holidayGroups.push(new ATK.obj.HolidayGroup(record));
	}, this);
};
/**
 * 休暇グループ一覧表作成
 * @param {Object=} arg
 */
ATK.dialog.HolidayGroupsDialog.prototype.createList = function(arg){
	this.clearEventHandles();
	const tbody = dojo.query('#holidayGroupsDomTable tbody')[0];
	dojo.empty(tbody);
	const focusId = (arg && arg.holidayGroup && arg.holidayGroup.Id) || null;
	var h = 0, cnt = 0;
	var chkPos = -1;
	for(var r = 0 ; r < this.holidayGroups.length ; r++){
		const holidayGroup = this.holidayGroups[r];
		const row = this.createRow(tbody, holidayGroup);
        cnt++;
        h += row.clientHeight;
		if(focusId && (holidayGroup.getId() == focusId)){
			chkPos = h;
		}
	}
	const rowMin = 6; // この行数になるまで空の行を挿入
	var emptyFix = (rowMin - this.holidayGroups.length);
	while(cnt++ < rowMin){
		this.createRow(tbody, null, (emptyFix-- <= 0));
	}
    //縞模様を設定
    dojo.query('#holidayGroupsDomTable tr').forEach(function(el, i){
        dojo.toggleClass(el, 'even', (i%2)==0);
        dojo.toggleClass(el, 'odd' , (i%2)!=0);
    });
	// arg.holidayGroup が指定されていた場合、対象行が見える位置にスクロールする
	const area = dojo.byId('holidayGroupsDomTableDiv');
	if(chkPos > 0 && area.clientHeight + area.scrollTop < chkPos){
		area.scrollTop = chkPos - area.clientHeight;
	}
};
/**
 * 休暇グループ一覧の行作成
 * @param {DOM} tbody
 * @param {ATK.obj.HolidayGroup} holidayGroup
 * @param {boolean=} emptyFold true:全表示時に非表示にする空行
 * @returns {DOM} 行
 */
ATK.dialog.HolidayGroupsDialog.prototype.createRow = function(tbody, holidayGroup, emptyFold){
	const row  = dojo.create('tr', { style:'height:22px;', className: (emptyFold ? 'row-fold' : '') }, tbody);
	const cols = this.cols;
	var cells = [];
	for(var i = 0 ; i < cols.length ; i++){
		cells.push(dojo.create('td', { style:'width:' + cols[i].w + 'px;'+ cols[i].s }, row));
	}
	if(holidayGroup){
		dojo.setAttr(row, 'holidayGroupId', holidayGroup.getId());
		const btn1 = dojo.create('div',{className:'pp_base pp_btn_edit',style:'margin:1px 2px 1px 2px;',title:teasp.message.getLabel('tk10000240'	   )}, cells[0]); // 編集
        dojo.create('div',{ innerHTML:holidayGroup.getName()		 , style:cols[2].cs }, cells[2]);
        dojo.create('div',{ innerHTML:holidayGroup.getGroupName(ATK.obj.HolidayGroup.GET_SHORT), style:cols[3].cs }, cells[3]);
        this.eventHandles.push(dojo.connect(btn1, 'click', this, this.update));
		if( !( holidayGroup.getType() == ATK.obj.HolidayGroup.A_TYPE
        || holidayGroup.getType() == ATK.obj.HolidayGroup.S_TYPE
        || holidayGroup.getType() == ATK.obj.HolidayGroup.H_TYPE)
        ){
            const btn2 = dojo.create('div',{className:'pp_base pp_btn_del' ,style:'margin:1px 2px 1px 2px;',title:teasp.message.getLabel('delete_btn_title')}, cells[1]); // 削除
            this.eventHandles.push(dojo.connect(btn2, 'click', this, this.deleteStep1));
        }
	}
	return row;
};
/**
 * リソース解放
 */
ATK.dialog.HolidayGroupsDialog.prototype.clearEventHandles = function(){
	dojo.forEach(this.eventHandles, function(eventHandle){
		dojo.disconnect(eventHandle);
	});
	this.eventHandles = [];
};
/**
 * 選択した行の休暇グループを得る
 * @param {DOM} node 選択行内のDOM
 * @returns {ATK.obj.HolidayGroup|null}
 */
ATK.dialog.HolidayGroupsDialog.prototype.getHolidayGroupByNode = function(node){
	const row = teasp.util.getAncestorByTagName(node, 'TR');
	if(row){
		const id = dojo.getAttr(row, 'holidayGroupId');
		for(var i = 0 ; i < this.holidayGroups.length ; i++){
			const holidayGroup = this.holidayGroups[i];
			if(holidayGroup.getId() == id){
				return holidayGroup;
			}
		}
	}
};

/**
 * 新規追加
 */
ATK.dialog.HolidayGroupsDialog.prototype.insert = function(){
	// 空のHolidayGroupクラスのインスタンス
	const emptyWl = new ATK.obj.HolidayGroup({
		Id: null,
		Name: '',
        Type__c : ATK.obj.HolidayGroup.U_TYPE,  //初期値は「ユーザ定義」(U)固定
		DaysManage__c : true, //初期値は「ユーザ定義」(U)固定のため、「日数管理 兼 集計グループ」となるため、true。
		DispasInt__c: false
	});
	this.openEditDialog({ holidayGroup: emptyWl, referenced:false, holidayGroups: this.holidayGroups, isEditing: false });
};
/**
 * 編集
 * @param {Object} e
 */
ATK.dialog.HolidayGroupsDialog.prototype.update = function(e){
	const holidayGroup = this.getHolidayGroupByNode(e.target);
	if(!holidayGroup){
		return;
	}
	this.checkReferenced({ holidayGroup: holidayGroup }).then( // 参照の有無をチェック
		dojo.hitch(this, function(referenced){
			this.openEditDialog({ holidayGroup: holidayGroup, referenced: referenced, holidayGroups: this.holidayGroups, isEditing: true });
		}),
		dojo.hitch(this, function(errmsg){
			this.showError(errmsg);
		})
	);
};
/**
 * 削除1
 * @param {Object} e
 */
ATK.dialog.HolidayGroupsDialog.prototype.deleteStep1 = function(e){
    const holidayGroup = this.getHolidayGroupByNode(e.target);
    this.checkReferenced({ holidayGroup: holidayGroup }).then( // 参照の有無をチェック
        dojo.hitch(this, function(referenced){
            if(referenced){ // 参照されている
                teasp.tsAlert(teasp.message.getLabel('hg00000120', holidayGroup.getName())); // 休暇グループ「{0}」は既に使用されており削除できません。
            }else{
                // 休暇グループ「{0}」を完全に削除してよろしいですか？
                teasp.tsConfirmA(teasp.message.getLabel('hg00000130', holidayGroup.getName()), this, function(){
                    this.deleteStep2(holidayGroup);
                });
            }
        }),
        dojo.hitch(this, function(errmsg){
            this.showError(errmsg);
        })
    );
};
/**
 * 削除2
 * @param {ATK.obj.HolidayGroup} holidayGroup
 */
ATK.dialog.HolidayGroupsDialog.prototype.deleteStep2 = function(holidayGroup){
	ATK.dialog.BusyWait.open();
	const req = {
		action:'deleteHolidayGroup',
		targetIds: [holidayGroup.getId()]
	};
	Visualforce.remoting.Manager.invokeAction(this.configAction, dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			ATK.dialog.BusyWait.close();
			if(event.status && result.result != 'NG'){
				teasp.util.excludeNameSpace(result);
				this.acceptResult(result);
				this.createList();
			}else{
				this.showError(teasp.message.getErrorMessage(event.status ? result : event));
			}
		}),
		{ escape : false }
	);
};
/**
 * 参照有無チェック
 * ※社員休暇管理から参照されているかチェックする
 * @param {{holidayGroup: {ATK.obj.HolidayGroup}}} arg
 * @returns {Object}
 */
ATK.dialog.HolidayGroupsDialog.prototype.checkReferenced = function(arg){
	const deferred = new dojo.Deferred();
	const holidayGroup = arg.holidayGroup;
	ATK.dialog.BusyWait.open();
	const req = {
		action:'checkHolidayGroup',
		targetIds: [holidayGroup.getId()]
	};
	Visualforce.remoting.Manager.invokeAction(this.configAction, dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			ATK.dialog.BusyWait.close();
			if(event.status && result.result != 'NG'){
				teasp.util.excludeNameSpace(result);
				deferred.resolve(result.referenced);
			}else{
				deferred.reject(teasp.message.getErrorMessage(event.status ? result : event));
			}
		}),
		{ escape : false }
	);
	return deferred.promise;
};
/**
 * 編集ダイアログを開く
 * @param {Object} arg
 */
ATK.dialog.HolidayGroupsDialog.prototype.openEditDialog = function(arg){
	this.editDialog.open(arg).then(
		dojo.hitch(this, function(result){
			this.acceptResult(result);
			this.createList(result);
		})
	);
};
/**
 * 並び順変更ダイアログを開く
 */
ATK.dialog.HolidayGroupsDialog.prototype.changeOrder = function(){
	this.orderDialog.open({ holidayGroups: this.holidayGroups }).then(
		dojo.hitch(this, function(result){
			this.acceptResult(result);
			this.createList();
		})
	);
};
/* -------------------------------------------------------------------
 * 休暇グループ編集ダイアログ
 */
ATK.dialog.HolidayGroupEditDialog = function(configAction){
	this.configAction = configAction;
	this.dialog = null;
    this.eventHandles = [];
};

/**
 * 開く
 * @param {{holidayGroup: {ATK.obj.HolidayGroup},  // 編集対象or新規作成の休暇グループ
 *          referenced: {boolean},  // 参照されているかどうか
 *         {holidayGroups: {Array.<ATK.obj.HolidayGroup>}, //一覧ダイアログ上の休暇グループのリスト
*          isEditing: {boolean}     // 編集モードor新規作成モード}
 *        }}
 * @returns {Object}
 */
ATK.dialog.HolidayGroupEditDialog.prototype.open = function(arg){
	this.holidayGroup = arg.holidayGroup;
    this.referenced = arg.referenced;
    this.holidayGroups = arg.holidayGroups;
    this.isEditing = arg.isEditing;
	this.deferred = new dojo.Deferred();

    this.dialog = new dijit.Dialog({
        title	 : teasp.message.getLabel('hg00000020'), // 休暇グループ編集
        id		 : 'holidayGroupEditDomDialog',
        duration : 200
    });
    this.dialog.attr('content', this.getContent());
    this.initAtFirstOpen();
    this.dialog.startup();

	this.initAtOpen(arg);
	this.dialog.show();
	return this.deferred.promise;
};
/**
 * ダイアログ生成時のみ行う初期化
 */
ATK.dialog.HolidayGroupEditDialog.prototype.initAtFirstOpen = function(){
	dojo.byId('holidayGroupEditDomNameLabel' ).innerHTML = teasp.message.getLabel('hg00000030'); // 休暇グループ名
	dojo.byId('holidayGroupEditDomTypeLabel'  ).innerHTML = teasp.message.getLabel('hg00000040'); // 休暇種別
	dojo.byId('holidayGroupEditDomManageLabel'  ).innerHTML = teasp.message.getLabel('hg00000050'); // グループ種別
	dojo.byId('holidayGroupEditDomManage1Label' ).innerHTML = teasp.message.getLabel('hg00000080'); // 日修管理 兼 集計グループ
	dojo.byId('holidayGroupEditDomManage2Label' ).innerHTML = teasp.message.getLabel('hg00000090'); // 集計グループ
	dojo.byId('holidayGroupEditDomDispasIntTitleLabel' ).innerHTML = teasp.message.getLabel('hg00000100'); // 表示オプション
	dojo.byId('holidayGroupEditDomDispasIntLabel' ).innerHTML = teasp.message.getLabel('hg00000110'); // 残日数を0.5日刻みで表示しない
	this.eventHandles.push(dojo.connect(dojo.byId('holidayGroupEditDomOk'	  ), 'click', this, this.saveStep1));
	this.eventHandles.push(dojo.connect(dojo.byId('holidayGroupEditDomCancel'), 'click', this, this.close));
	this.eventHandles.push(dojo.connect(this.dialog, 'onCancel', this, this.close)); // ×ボタン
};
/**
 * 開くたびに行う初期化
 * @param {{referenced: {boolean}}} arg
 */
ATK.dialog.HolidayGroupEditDialog.prototype.initAtOpen = function(arg){
	this.showError(null);
    var type = this.holidayGroup.getType();
    if(type==ATK.obj.HolidayGroup.A_TYPE){
        dojo.byId('holidayGroupEditDomTypeDisp'  ).innerHTML = teasp.message.getLabel('hg00000160'); // 年次有給休暇
    }else if(type==ATK.obj.HolidayGroup.S_TYPE){
        dojo.byId('holidayGroupEditDomTypeDisp'  ).innerHTML = teasp.message.getLabel('hg00000170'); // 代休
    }else if(type==ATK.obj.HolidayGroup.H_TYPE){
        dojo.byId('holidayGroupEditDomTypeDisp'  ).innerHTML = teasp.message.getLabel('hg00000180'); // 時間単位有休制限
    }else{ //　type==ATK.obj.HolidayGroup.U_TYPE||type==ATK.obj.HolidayGroup.G_TYPE　または、新規作成　
        dojo.byId('holidayGroupEditDomTypeDisp'  ).innerHTML = teasp.message.getLabel('hg00000190'); // ユーザ定義
    }
	dojo.byId('holidayGroupEditDomName' ).value   = this.holidayGroup.getName(); // 休暇グループ名
	dojo.byId('holidayGroupEditDomDispasInt' ).checked = this.holidayGroup.getDispasInt(); //　残日数を0.5刻みで表示しない
	switch(this.holidayGroup.getGroupName(ATK.obj.HolidayGroup.GET_NUM)){ // グループ種別
		case 2:  dojo.byId('holidayGroupEditDomManage2').checked = true; break;
		default: dojo.byId('holidayGroupEditDomManage1').checked = true; break;
	}
    // 休暇種別がA/S/Hの場合は、グループ種別を非活性にする。
    if( this.holidayGroup.getType() == ATK.obj.HolidayGroup.A_TYPE
        || this.holidayGroup.getType() == ATK.obj.HolidayGroup.S_TYPE
        || this.holidayGroup.getType() == ATK.obj.HolidayGroup.H_TYPE ){
        dojo.query('input[type="radio"]', dojo.byId('holidayGroupEditDomManageGroup')).forEach(function(el){
            dojo.setAttr(el, 'disabled', true);
        });
    }else{
        // 参照されている場合、表示オプションを変更できないように非活性にする
        dojo.query('input[type="radio"]', dojo.byId('holidayGroupEditDomManageGroup')).forEach(function(el){
            dojo.setAttr(el, 'disabled', (arg && arg.referenced ? true : false));
        });
    }
};
/**
 * 登録結果を返して閉じる
 * @param {Object} result
 */
ATK.dialog.HolidayGroupEditDialog.prototype.done = function(result){
    this.clearEventHandles()
	this.dialog.destroy();
    this.dialog = null;
	this.deferred.resolve(result);
};
/**
 * キャンセル
 */
ATK.dialog.HolidayGroupEditDialog.prototype.close = function(){
    this.clearEventHandles()
	this.dialog.destroy();
    this.dialog = null;
	this.deferred.reject();
};

ATK.dialog.HolidayGroupEditDialog.prototype.clearEventHandles = function(){
	dojo.forEach(this.eventHandles, function(eventHandle){
		dojo.disconnect(eventHandle);
	});
	this.eventHandles = [];
};
/**
 * HTML
 */
 ATK.dialog.HolidayGroupEditDialog.prototype.getContent = function(){
	return '<div class="dlg_content" style="width:500px;">'
    + '    <table class="ts_a_frame">'
    + '    <tr>'
    + '      <td class="edgelt"></td>'
    + '      <td class="edgeht"></td>'
    + '      <td class="edgert"></td>'
    + '    </tr>'
    + '    <tr>'
    + '      <td class="edgevl"></td>'
    + '      <td>'
    + '        <div class="edge_div">'
    + '          <table class="stand_table">'
    + '          <tr>'
    + '            <td class="left_m" id="holidayGroupEditDomNameLabel">'
    + '            </td>'
    + '            <td class="right">'
    + '                <input type="text" class="inputran" id="holidayGroupEditDomName" maxlength="80" style="width:200px;padding:2px;">'
    + '            </td>'
    + '          </tr>'
    + '          </table>'
    + '        </div>'
    + '      </td>'
    + '      <td class="edgevr"></td>'
    + '    </tr>'
    + '    <tr>'
    + '      <td class="edgevl"></td>'
    + '      <td>'
    + '        <div class="edge_div">'
    + '          <table class="stand_table">'
    + '          <tr>'
    + '            <td class="left_m" id="holidayGroupEditDomTypeLabel">'
    + '            </td>'
    + '            <td class="right" id="holidayGroupEditDomTypeDisp">'
    + '            </td>'
    + '          </tr>'
    + '          </table>'
    + '        </div>'
    + '      </td>'
    + '      <td class="edgevr"></td>'
    + '    </tr>'
    + '    <tr>'
    + '      <td class="edgevl"></td>'
    + '      <td>'
    + '        <div class="edge_div">'
    + '          <table class="stand_table">'
    + '          <tr>'
    + '            <td class="left_m" id="holidayGroupEditDomManageLabel">'
    + '            </td>'
    + '            <td class="right" id="holidayGroupEditDomManageGroup">'
    + '              <label><input type="radio" name="holidayGroupCT" id="holidayGroupEditDomManage1" /> <span id="holidayGroupEditDomManage1Label"></span></label><br/>'
    + '              <label><input type="radio" name="holidayGroupCT" id="holidayGroupEditDomManage2" /> <span id="holidayGroupEditDomManage2Label"></span></label>'
    + '            </td>'
    + '          </tr>'
    + '          </table>'
    + '        </div>'
    + '      </td>'
    + '      <td class="edgevr"></td>'
    + '    </tr>'
    + '    <tr>'
    + '      <td class="edgevl"></td>'
    + '      <td>'
    + '        <div class="edge_div">'
    + '          <table class="stand_table">'
    + '          <tr>'
    + '            <td class="left_m" id="holidayGroupEditDomDispasIntTitleLabel">'
    + '            </td>'
    + '            <td class="right">'
    + '              <label><input type="checkbox" id="holidayGroupEditDomDispasInt" > <span id="holidayGroupEditDomDispasIntLabel"></span></label><br/>'
    + '            </td>'
    + '          </tr>'
    + '          </table>'
    + '        </div>'
    + '      </td>'
    + '      <td class="edgevr"></td>'
    + '    </tr>'
    + '    <tr>'
    + '      <td class="edgelb"></td>'
    + '      <td class="edgehb"></td>'
    + '      <td class="edgerb"></td>'
    + '    </tr>'
    + '    </table>'
    + '    <table class="pane_table" style="width:100%;">'
    + '    <tr id="holidayGroupEditDomErrorRow" style="display:none;">'
    + '      <td style="text-align:center;">'
    + '        <div id="holidayGroupEditDomError" style="color:red;margin:4px;"></div>'
    + '      </td>'
    + '    </tr>'
    + '    <tr>'
    + '      <td style="padding:16px 0px 4px 0px;text-align:center;">'
    + '        <input type="button" class="pb_base pb_btn_regist" id="holidayGroupEditDomOk">'
    + '        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    + '        <input type="button" class="pb_base pb_btn_cancel" id="holidayGroupEditDomCancel">'
    + '      </td>'
    + '    </tr>'
    + '    </table>'
	+ '</div>';
};
/**
 * エラー表示
 * @param {string|null} msg
 */
ATK.dialog.HolidayGroupEditDialog.prototype.showError = function(msg){
	dojo.style('holidayGroupEditDomErrorRow', 'display', (msg ? '' : 'none'));
	dojo.byId('holidayGroupEditDomError').innerHTML = (msg ? msg : '');
};
/**
 * 登録
 */
ATK.dialog.HolidayGroupEditDialog.prototype.saveStep1 = function(){
	this.showError(null);
	const req = {
		action:'upsertHolidayGroup',
		holidayGroup: dojo.clone(this.holidayGroup.getObj() || {})
	};

    // 休暇グループ名重複バリデーション
	req.holidayGroup.Name = dojo.byId('holidayGroupEditDomName').value.trim();
    for(var i=0; i<this.holidayGroups.length; i++){
        if(this.holidayGroups[i].getName() === req.holidayGroup.Name){
            if(this.isEditing){
                // 編集モードのときは、重複していて当たり前
            }else{
                // 新規作成モードの時は、休暇グループ名重複はエラー
                this.showError(teasp.message.getLabel('hg00000150')); // 休暇グループの表示名が既存データと重複します。
                return;
            }
        }
    }

	if(!req.holidayGroup.Name){
		this.showError(teasp.message.getLabel('hg00000140')); // 表示名を入力してください
		return;
	}

	if( !( this.holidayGroup.getType() == ATK.obj.HolidayGroup.A_TYPE
        || this.holidayGroup.getType() == ATK.obj.HolidayGroup.S_TYPE
        || this.holidayGroup.getType() == ATK.obj.HolidayGroup.H_TYPE)
        
        && dojo.byId('holidayGroupEditDomManage1').checked
        && !this.referenced ){ // 日数管理 兼 集計グループ

        // 参照されていなければ格納
		req.holidayGroup.Type__c = ATK.obj.HolidayGroup.U_TYPE;
		req.holidayGroup.DaysManage__c = true;

	}else if(
        !( this.holidayGroup.getType() == ATK.obj.HolidayGroup.A_TYPE
        || this.holidayGroup.getType() == ATK.obj.HolidayGroup.S_TYPE
        || this.holidayGroup.getType() == ATK.obj.HolidayGroup.H_TYPE)
        
        && dojo.byId('holidayGroupEditDomManage2').checked
        && !this.referenced ){ // 集計グループ

        // 参照されていなければ格納
		req.holidayGroup.Type__c = ATK.obj.HolidayGroup.G_TYPE;
		req.holidayGroup.DaysManage__c = false;
	}else{ // 対象外
        //Type__c と DaysManage__cの更新無し。
	}
	//「残日数を0.5日刻みで表示しない」を更新
    req.holidayGroup.DispasInt__c = dojo.byId('holidayGroupEditDomDispasInt').checked; // 残日数を0.5日刻みで表示しない
	this.saveStep2(req);
};
/**
 * 登録実行
 * @param {Object} req
 */
ATK.dialog.HolidayGroupEditDialog.prototype.saveStep2 = function(req){
	ATK.dialog.BusyWait.open();
	Visualforce.remoting.Manager.invokeAction(this.configAction, dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			ATK.dialog.BusyWait.close();
			if(event.status && result.result != 'NG'){
				teasp.util.excludeNameSpace(result);
				this.done(result);
			}else{
				this.showError(teasp.message.getErrorMessage(event.status ? result : event));
			}
		}),
		{ escape : false }
	);
};

/* -------------------------------------------------------------------
 * 休暇グループ並び順変更ダイアログ
 */
ATK.dialog.HolidayGroupOrderDialog = function(configAction){
	this.configAction = configAction;
	this.dialog = null;
	this.eventHandles = [];
};
/**
 * 開く
 * @param {{holidayGroups: {Array.<ATK.obj.HolidayGroup>}}} arg
 * @returns {Object}
 */
ATK.dialog.HolidayGroupOrderDialog.prototype.open = function(arg){
	this.holidayGroups = arg.holidayGroups;
	this.deferred = new dojo.Deferred();
	if(!this.dialog){
		this.dialog = new dijit.Dialog({
			title	 : teasp.message.getLabel('tk10000689'), // 並び順変更
			duration : 200
		});
		this.dialog.attr('content', this.getContent());
		this.initAtFirstOpen();
		this.dialog.startup();
	}
	this.initAtOpen();
	this.dialog.show();
	return this.deferred.promise;
};
/**
 * ダイアログ生成時のみ行う初期化
 */
ATK.dialog.HolidayGroupOrderDialog.prototype.initAtFirstOpen = function(){
	dojo.byId('holidayGroupOrderDomUp'	).title = teasp.message.getLabel('up_btn_title');	// 上へ
	dojo.byId('holidayGroupOrderDomDown').title = teasp.message.getLabel('down_btn_title'); // 下へ
	dojo.connect(dojo.byId('holidayGroupOrderDomUp'    ), 'click', this, this.clickUp);
	dojo.connect(dojo.byId('holidayGroupOrderDomDown'  ), 'click', this, this.clickDown);
	dojo.connect(dojo.byId('holidayGroupOrderDomOk'    ), 'click', this, this.saveStep1);
	dojo.connect(dojo.byId('holidayGroupOrderDomCancel'), 'click', this, this.close);
	dojo.connect(this.dialog, 'onCancel', this, this.close); // ×ボタン
};
/**
 * 開くたびに行う初期化
 */
 ATK.dialog.HolidayGroupOrderDialog.prototype.initAtOpen = function(){
	this.clearEventHandles();
	this.showError(null);
	const tbody = dojo.byId('holidayGroupOrderDomChange');
	dojo.empty(tbody);
	for(var i = 0 ; i < this.holidayGroups.length ; i++){
		const holidayGroup = this.holidayGroups[i];
		const cn = ((i%2)==0 ? 'even' : 'odd');
		const row = dojo.create('tr', {className : 'sele ' + cn}, tbody);
		dojo.setAttr(row, 'holidayGroupId', holidayGroup.getId());
		this.eventHandles.push(dojo.connect(row, 'click', this, this.clickRow));
		dojo.create('input', {type: 'checkbox'}, dojo.create('td', { style:"width:24px;border-left:none;border-right:none;" }, row));
		dojo.create('div', {
			innerHTML : holidayGroup.getName(),
			style	  : "padding: 2px; word-break:break-all;"
		}, dojo.create('td', {
			style	: "width:258px;text-align:left;border-left:none;border-right:1px solid #9FA0A6;"
		}, row));
	}
};
/**
 * リソース解放
 */
ATK.dialog.HolidayGroupOrderDialog.prototype.clearEventHandles = function(){
	dojo.forEach(this.eventHandles, function(eventHandle){
		dojo.disconnect(eventHandle);
	});
	this.eventHandles = [];
};
/**
 * 登録結果を返して閉じる
 * @param {Object} result
 */
ATK.dialog.HolidayGroupOrderDialog.prototype.done = function(result){
	this.dialog.hide();
	this.deferred.resolve(result);
};
/**
 * キャンセル
 */
ATK.dialog.HolidayGroupOrderDialog.prototype.close = function(){
	this.dialog.hide();
	this.deferred.reject();
};
/**
 * HTML
 */
 ATK.dialog.HolidayGroupOrderDialog.prototype.getContent = function(){
	return '<div style="width:380px;">' // 並び順変更
	+ '  <table class="ts_a_frame">'
	+ '  <tr>'
	+ '    <td class="edgelt"></td>'
	+ '    <td class="edgeht"></td>'
	+ '    <td class="edgert"></td>'
	+ '  </tr>'
	+ '  <tr>'
	+ '    <td class="edgevl"></td>'
	+ '    <td>'
	+ '      <div class="edge_div">'
	+ '        <table class="stand_table" style="margin:4px;">'
	+ '        <tr>'
	+ '          <td style="width:300px;">'
	+ '            <div id="holidayGroupOrderDomArea" style="width:300px;max-height:276px;min-height:50px;padding:0px;margin:0px;overflow-y:scroll;border:1px solid #539AC7;background-color:#FFFFFF;">'
	+ '              <table class="stone_table">'
	+ '              <tbody id="holidayGroupOrderDomChange">'
	+ '              </tbody>'
	+ '              </table>'
	+ '            </div>'
	+ '          </td>'
	+ '          <td style="vertical-align:middle;padding-left:10px;">'
	+ '            <table class="pane_table" style="width:38px;">'
	+ '            <tr>'
	+ '              <td style="padding-bottom:8px;">'
	+ '                <input type="button" id="holidayGroupOrderDomUp" class="pb_base pb_btn_upto" />'
	+ '              </td>'
	+ '            </tr>'
	+ '            <tr>'
	+ '              <td style="padding-top:8px;">'
	+ '                <input type="button" id="holidayGroupOrderDomDown" class="pb_base pb_btn_downto" />'
	+ '              </td>'
	+ '            </tr>'
	+ '            </table>'
	+ '          </td>'
	+ '        </tr>'
	+ '        </table>'
	+ '      </div>'
	+ '    </td>'
	+ '    <td class="edgevr"></td>'
	+ '  </tr>'
	+ '  <tr>'
	+ '    <td class="edgelb"></td>'
	+ '    <td class="edgehb"></td>'
	+ '    <td class="edgerb"></td>'
	+ '  </tr>'
	+ '  </table>'
	+ '  <table border="0" cellpadding="0" cellspacing="0" style="width:100%;">'
	+ '  <tr id="holidayGroupOrderDomErrorRow" style="display:none;">'
	+ '    <td style="text-align:center;">'
	+ '      <div id="holidayGroupOrderDomError" style="color:red;margin:4px;"></div>'
	+ '    </td>'
	+ '  </tr>'
	+ '  <tr>'
	+ '    <td colspan="2" style="padding:16px 0px 4px 0px;text-align:center;">'
	+ '      <input type="button" class="pb_base pb_btn_regist" id="holidayGroupOrderDomOk" />'
	+ '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	+ '      <input type="button" class="pb_base pb_btn_cancel" id="holidayGroupOrderDomCancel" />'
	+ '    </td>'
	+ '  </tr>'
	+ '  </table>'
	+ '</div>';
};
/**
 * エラー表示
 * @param {string|null} msg
 */
 ATK.dialog.HolidayGroupOrderDialog.prototype.showError = function(msg){
	dojo.style('holidayGroupOrderDomErrorRow', 'display', (msg ? '' : 'none'));
	dojo.byId('holidayGroupOrderDomError').innerHTML = (msg ? msg : '');
};
/**
 * 行クリック
 */
ATK.dialog.HolidayGroupOrderDialog.prototype.clickRow = function(e){
	if(e.target.tagName == 'INPUT' && e.target.type == 'checkbox'){
		return;
	}
	const row = teasp.util.getAncestorByTagName(e.target, 'TR');
	dojo.query('input[type="checkbox"]', row).forEach(function(el){
		el.checked = !el.checked;
	});
};
/**
 * 上へ
 */
ATK.dialog.HolidayGroupOrderDialog.prototype.clickUp = function(){
	const tbody = dojo.byId('holidayGroupOrderDomChange');
	for(var r = 0 ; r < tbody.rows.length ; r++){
		const node = tbody.rows[r].cells[0].firstChild;
		if(node.checked && r > 0 && !tbody.rows[r - 1].cells[0].firstChild.checked){
			const row = tbody.removeChild(tbody.rows[r - 1]);
			const row2 = tbody.rows[r];
			if(!row2){
				tbody.appendChild(row);
			}else{
				tbody.insertBefore(row, row2);
			}
		}
	}
	this.afterUpDown(tbody, false);
};
/**
 * 下へ
 */
ATK.dialog.HolidayGroupOrderDialog.prototype.clickDown = function(){
	const tbody = dojo.byId('holidayGroupOrderDomChange');
    var changed = false;
	for(var r = tbody.rows.length - 1 ; r >= 0	; r--){
		const node = tbody.rows[r].cells[0].firstChild;
		if(node.checked && r < (tbody.rows.length - 1) && !tbody.rows[r + 1].cells[0].firstChild.checked){
			tbody.insertBefore(tbody.removeChild(tbody.rows[r + 1]), tbody.rows[r]);
            changed = true;
		}
	}
    if(changed){
        this.afterUpDown(tbody, true);
    }
};
/**
 * 移動後の表示修正
 * @param {DOM} tbody
 * @param {boolean} face
 */
ATK.dialog.HolidayGroupOrderDialog.prototype.afterUpDown = function(tbody, face){
	var h = 0;
	var chkPos = -1;
	for(var r = 0 ; r < tbody.rows.length ; r++){
		const row = tbody.rows[r];
        dojo.toggleClass(row, 'even', (r%2)==0);
        dojo.toggleClass(row, 'odd' , (r%2)!=0);
		h += row.clientHeight;
		if(dojo.query('input[type="checkbox"]:checked', row).length){
			chkPos = h;
		}
	}
	if(face && chkPos > 0){
		const area = dojo.byId('holidayGroupOrderDomArea');
		if(area.clientHeight + area.scrollTop < chkPos){
			area.scrollTop = chkPos - area.clientHeight;
		}
	}
};
/**
 * 登録
 */
ATK.dialog.HolidayGroupOrderDialog.prototype.saveStep1 = function(){
	const tbody = dojo.byId('holidayGroupOrderDomChange');
	const req = {
		action:'sortHolidayGroups',
		holidayGroups:[]
	};
	for(var r = 0 ; r < tbody.rows.length ; r++){
		const row = tbody.rows[r];
		const id = dojo.getAttr(row, 'holidayGroupId');
		if(id){
			req.holidayGroups.push({
				Id: id,
				Order__c: (r+1)
			});
		}
	}
	this.saveStep2(req);
};
/**
 * 登録実行
 * @param {Object} req
 */
ATK.dialog.HolidayGroupOrderDialog.prototype.saveStep2 = function(req){
	ATK.dialog.BusyWait.open();
	Visualforce.remoting.Manager.invokeAction(this.configAction, dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			ATK.dialog.BusyWait.close();
			if(event.status && result.result != 'NG'){
				teasp.util.excludeNameSpace(result);
				this.done(result);
			}else{
				this.showError(teasp.message.getErrorMessage(event.status ? result : event));
			}
		}),
		{ escape : false }
	);
};
/* -------------------------------------------------------------------
 * 休暇グループ選択ダイアログ
 */
ATK.dialog.HolidayGroupAssignDialog = function(configAction){
	this.configAction = configAction;
	this.dialog = null;
	this.eventHandles = [];
    this.editDialog  = new ATK.dialog.HolidayGroupEditDialog(configAction);  // 編集ダイアログ
    this.holidayGroups = null;
    this.holidayGroupId = null;
    this.dialogType = null; // 日数管理 or 集計
    this.targetGroup = null; // 表示する休暇グループ
};
/**
 * 開く
 * @param {{holidayGroups: {Array.<ATK.obj.HolidayGroup>}}} arg
 * @returns {Object}
 */
ATK.dialog.HolidayGroupAssignDialog.prototype.open = function(arg){
    this.dialogType = arg.dialogType;
	this.holidayGroups = arg.holidayGroups;
    this.holidayGroupId = arg.holidayGroupId;
	this.deferred = new dojo.Deferred();
    var dialogTitle = null;
    var holidayEditType = arg.holidayEditType;

    // 割当ダイアログのタイプ 日数管理 or 集計
    if(this.dialogType == 'holidayManage'){
        dialogTitle = teasp.message.getLabel('hg00000340');
        this.targetGroup = [ATK.obj.HolidayGroup.A_TYPE,ATK.obj.HolidayGroup.U_TYPE];
    }else if(this.dialogType == 'holidaySummary'){
        dialogTitle = teasp.message.getLabel('hg00000350');
        this.targetGroup = [ATK.obj.HolidayGroup.A_TYPE,ATK.obj.HolidayGroup.U_TYPE,ATK.obj.HolidayGroup.G_TYPE];
    }
    // 休暇種類が無給の場合はType__c=Aの休暇グループを表示しない
    if(holidayEditType == teasp.constant.HOLIDAY_TYPE_FREE){
        this.targetGroup.splice(0,1);
    }

    this.dialog = new dijit.Dialog({
        title	 : dialogTitle,
        duration : 200
    });
    this.dialog.attr('content', this.getContent());
    this.initAtFirstOpen();
    this.dialog.startup();

	this.initAtOpen();
	this.dialog.show();
	return this.deferred.promise;
};
/**
 * ダイアログ生成時のみ行う初期化
 */
ATK.dialog.HolidayGroupAssignDialog.prototype.initAtFirstOpen = function(){
    this.eventHandles.push(dojo.connect(dojo.byId('holidayGroupEditOpen'), 'click', this, this.openHolidayGroupEdit));
	this.eventHandles.push(dojo.connect(dojo.byId('holidayGroupAssignDomSelect'    ), 'click', this, this.save));
	this.eventHandles.push(dojo.connect(dojo.byId('holidayGroupAssignDomCancel'), 'click', this, this.close));
	this.eventHandles.push(dojo.connect(this.dialog, 'onCancel', this, this.close)); // ×ボタン
};
/**
 * 開くたびに行う初期化
 */
 ATK.dialog.HolidayGroupAssignDialog.prototype.initAtOpen = function(){
	this.createList(this.holidayGroupId);
};
/**
 * リソース解放
 */
ATK.dialog.HolidayGroupAssignDialog.prototype.clearEventHandles = function(){
	dojo.forEach(this.eventHandles, function(eventHandle){
		dojo.disconnect(eventHandle);
	});
	this.eventHandles = [];
};
/**
 * 休暇グループリスト作成
 */
 ATK.dialog.HolidayGroupAssignDialog.prototype.createList = function(checkedHolidayGroupId){
    this.showError(null);
	const tbody = dojo.byId('holidayGroupAssignDomChange');
	dojo.empty(tbody);
    var pushCount = 0;
	for(var i = 0 ; i < this.holidayGroups.length ; i++){
		const holidayGroup = this.holidayGroups[i];
        if(!this.targetGroup.includes(holidayGroup.getType())) continue;
		const cn = ((pushCount%2)==0 ? 'even' : 'odd');
		const row = dojo.create('tr', {className : 'sele ' + cn}, tbody);
		dojo.setAttr(row, 'holidayGroupId', holidayGroup.getId());
		this.eventHandles.push(dojo.connect(row, 'click', this, this.clickRow));
		const radio = dojo.create('input', {type: 'radio', name: 'holidayGroup'}, dojo.create('td', { style:"width:24px;border-left:none;border-right:none;" }, row));
        radio.checked = (holidayGroup.getId() == checkedHolidayGroupId);
        //dojo.setAttr(radio, 'checked', holidayGroup.getId() == checkedHolidayGroupId ? 'checked':''); 
		dojo.create('div', {
			innerHTML : holidayGroup.getName(),
			style	  : "padding: 2px; word-break:break-all;"
		}, dojo.create('td', {
			style	: "width:320px;text-align:left;border-left:none;border-right:1px solid #9FA0A6;"
		}, row));
        pushCount++
	}
 }
/**
 * 登録結果を返して閉じる
 * @param {Object} result
 */
ATK.dialog.HolidayGroupAssignDialog.prototype.done = function(result){
    this.clearEventHandles();
	this.dialog.destroy();
	this.deferred.resolve(result);
    this.dialog = null;
};
/**
 * キャンセル
 */
ATK.dialog.HolidayGroupAssignDialog.prototype.close = function(){
    this.clearEventHandles();
	this.dialog.destroy();
    // キャンセルの場合でも、「新規作成」→「キャンセル」を考慮して、最新のholidayGroupsを返却する。
	this.deferred.reject({holidayGroupId:'', holidayGroups:this.holidayGroups});
    this.dialog = null;
};
/**
 * HTML
 */
 ATK.dialog.HolidayGroupAssignDialog.prototype.getContent = function(){
	return '<div style="width:380px;">' // 並び順変更
	+ '  <table class="ts_a_frame">'
	+ '  <tr>'
	+ '    <td class="edgelt"></td>'
	+ '    <td class="edgeht"></td>'
	+ '    <td class="edgert"></td>'
	+ '  </tr>'
	+ '  <tr>'
	+ '    <td class="edgevl"></td>'
	+ '    <td>'
	+ '      <div class="edge_div">'
	+ '        <table class="stand_table" style="margin:4px;">'
	+ '        <tr>'
	+ '          <td style="width:100%;">'
	+ '            <div id="holidayGroupOrderDomArea" style="width:100%;max-height:276px;min-height:50px;padding:0px;margin:0px;overflow-y:scroll;border:1px solid #539AC7;background-color:#FFFFFF;">'
	+ '              <table class="stone_table">'
	+ '              <tbody id="holidayGroupAssignDomChange">'
	+ '              </tbody>'
	+ '              </table>'
	+ '            </div>'
	+ '          </td>'
	+ '        </tr>'
	+ '        </table>'
	+ '      </div>'
	+ '    </td>'
	+ '    <td class="edgevr"></td>'
	+ '  </tr>'
	+ '  <tr>'
	+ '    <td class="edgelb"></td>'
	+ '    <td class="edgehb"></td>'
	+ '    <td class="edgerb"></td>'
	+ '  </tr>'
	+ '  </table>'
	+ '  <table border="0" cellpadding="0" cellspacing="0" style="width:100%;">'
	+ '  <tr id="holidayGroupAssignDomErrorRow" style="display:none;">'
	+ '    <td style="text-align:center;">'
	+ '      <div id="holidayGroupAssignDomError" style="color:red;margin:4px;"></div>'
	+ '    </td>'
	+ '  </tr>'
	+ '  <tr>'
	+ '    <td colspan="2" style="padding:16px 0px 4px 0px;text-align:center;">'
    + '      <input type="button" class="pb_base pb_btn_new" id="holidayGroupEditOpen" />'
    + '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	+ '      <input type="button" class="pb_base pb_btn_select" id="holidayGroupAssignDomSelect" />'
	+ '      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	+ '      <input type="button" class="pb_base pb_btn_cancel" id="holidayGroupAssignDomCancel" />'
	+ '    </td>'
	+ '  </tr>'
	+ '  </table>'
	+ '</div>';
};
/**
 * エラー表示
 * @param {string|null} msg
 */
 ATK.dialog.HolidayGroupAssignDialog.prototype.showError = function(msg){
	dojo.style('holidayGroupAssignDomErrorRow', 'display', (msg ? '' : 'none'));
	dojo.byId('holidayGroupAssignDomError').innerHTML = (msg ? msg : '');
};
/**
 * 行クリック
 */
ATK.dialog.HolidayGroupAssignDialog.prototype.clickRow = function(e){
	if(e.target.tagName == 'INPUT' && e.target.type == 'radio'){
		return;
	}
	const row = teasp.util.getAncestorByTagName(e.target, 'TR');
	dojo.query('input[type="radio"]', row).forEach(function(el){
		el.checked = !el.checked;
	});
};
// 休暇グループ編集ダイアログを開く
ATK.dialog.HolidayGroupAssignDialog.prototype.openHolidayGroupEdit = function(){
    // 空のHolidayGroupクラスのインスタンス
	const emptyWl = new ATK.obj.HolidayGroup({
		Id: null,
		Name: '',
        Type__c : ATK.obj.HolidayGroup.U_TYPE,  //初期値は「ユーザ定義」(U)固定
		DaysManage__c : true, //初期値は「ユーザ定義」(U)固定のため、「日数管理 兼 集計グループ」となるため、true。
		DispasInt__c: false
	});
	this.openEditDialog({ holidayGroup: emptyWl, referenced:false, holidayGroups: this.holidayGroups, isEditing: false });
};
/**
 * 編集ダイアログを開く
 * @param {Object} arg
 */
 ATK.dialog.HolidayGroupAssignDialog.prototype.openEditDialog = function(arg){
	this.editDialog.open(arg).then(
		dojo.hitch(this, function(result){
            this.fetch(dojo.hitch(this, function(flag, errmsg){
                if(flag){ // 成功
                    this.createList(result.holidayGroup.Id);
                    this.holidayGroupId = result.holidayGroup.Id;
                }else{ // エラー
                    this.showError(errmsg);
                }
            }));            
		})
	);
};
/**
 * 休暇グループ一覧を読み込み
 * @param {Function} callback
 */
 ATK.dialog.HolidayGroupAssignDialog.prototype.fetch = function(callback){
	ATK.dialog.BusyWait.open();
	const req = {
		action:'fetchHolidayGroups'
	};
	Visualforce.remoting.Manager.invokeAction(this.configAction, dojo.toJson(req),
		dojo.hitch(this, function(result, event){
			ATK.dialog.BusyWait.close();
			if(event.status && result.result != 'NG'){
				teasp.util.excludeNameSpace(result);
				this.acceptResult(result);
				callback(true);
			}else{
                ATK.dialog.BusyWait.close();
				callback(false, teasp.message.getErrorMessage(event.status ? result : event));
			}
		}),
		{ escape : false }
	);
};
/**
 * 読み込んだ休暇グループを変数に格納
 * @param {Object} result
 */
 ATK.dialog.HolidayGroupAssignDialog.prototype.acceptResult = function(result){
	this.holidayGroups = [];
	dojo.forEach(result.holidayGroups || [], function(record){
		this.holidayGroups.push(new ATK.obj.HolidayGroup(record));
	}, this);
};
/**
 * 登録
 */
ATK.dialog.HolidayGroupAssignDialog.prototype.save = function(){
	const tbody = dojo.byId('holidayGroupAssignDomChange');
    var id = null;
    dojo.query('input[type="radio"]', tbody).forEach(function(el){
		if(el.checked){
            const row = teasp.util.getAncestorByTagName(el, 'TR');
            id = dojo.getAttr(row, 'holidayGroupId');        
        }
	});

    // 何も選択していない場合はエラー
    if(id == null){
        this.showError(teasp.message.getLabel('hg00000380'));
        return;
    }

	this.done({holidayGroupId:id, holidayGroups:this.holidayGroups});
};
