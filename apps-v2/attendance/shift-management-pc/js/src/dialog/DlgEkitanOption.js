teasp.provide('teasp.dialog.EkitanOption');
/**
 * 駅探設定ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.EkitanOption = function(){
    this.widthHint = 680;
    this.heightHint = 290;
    this.id = 'dialogEkitanSetting';
    this.title = teasp.message.getLabel('ekitanSetting_btn_title') /*駅探設定*/;
    this.duration = 1;
    this.content = '<div class="dlg_content" style="width:650px;"><table class="ts_a_frame"><tr><td class="edgelt"></td><td class="edgeht"></td><td class="edgert"></td></tr><tr><td class="edgevl"></td><td><div class="edge_div"><table class="stand_table"><tr><td class="left_m" id="area_label"></td><td class="right"><select class="inputran" id="ekitanOptionArea"></select></td></tr><tr><td class="left_m top_line" id="ekitanOpt_paidExpress_label"></td><td class="right top_line"><table class="ekitan_option_tbl"><tr><td><label><input type="radio" name="ekitanOptionPE" value="1" id="ekitanOptionPE1" /><span id="ekitanOpt_yes"></span></label></td><td style="padding-left:12px;"><label><input type="radio" name="ekitanOptionPE" value="0" id="ekitanOptionPE0" /><span id="ekitanOpt_no"></span></label></td></tr></table></td></tr><tr><td class="left_m top_line" id="ekitanOpt_reservedSheet_label"></td><td class="right top_line"><table class="ekitan_option_tbl"><tr><td><label><input type="radio" name="ekitanOptionRS" value="0" id="ekitanOptionRS0" /><span id="ekitanOpt_reservedSheetNo_label"></span></label></td><td style="padding-left:12px;"><label><input type="radio" name="ekitanOptionRS" value="1" id="ekitanOptionRS1" /><span id="ekitanOpt_reservedSheetYes_label"></span></label></td></tr></table></td></tr><tr><td class="left_m top_line" id="ekitanOpt_preferredAirLine_label"></td><td class="right top_line"><table class="ekitan_option_tbl"><tr><td><label><input type="radio" name="ekitanOptionAL" value="0" id="ekitanOptionAL0" /><span id="ekitanOpt_preferredAirLineNo_label"></span></label></td><td style="padding-left:12px;"><label><input type="radio" name="ekitanOptionAL" value="1" id="ekitanOptionAL1" />JAL</label></td><td style="padding-left:12px;"><label><input type="radio" name="ekitanOptionAL" value="2" id="ekitanOptionAL2" />ANA</label></td><td style="padding-left:12px;"><label><input type="radio" name="ekitanOptionAL" value="4" id="ekitanOptionAL4" />SKY/ADO</label></td></tr></table></td></tr><tr><td class="left_m top_line" id="ekitanOpt_routePreference_label"></td><td class="right top_line"><select class="inputran" id="ekitanOptionSort"><option value="0" id="routeSortTime_opt"></option><option value="1" id="routeSortCost_opt"></option><option value="2" id="routeSortChange_opt"></option><option value="3" id="routeSortCommuter_opt"></option></select></td></tr><tr><td class="left_m top_line" id="ekitanOpt_excludeCommuter_label"></td><td class="right top_line"><table class="ekitan_option_tbl"><tr><td><label><input type="radio" name="ekitanOptionTT" value="0" id="ekitanOptionTT0" /><span id="ekitanOpt_excludeCommuterNo_label"></span></label></td><td style="padding-left:12px;"><label><input type="radio" name="ekitanOptionTT" value="1" id="ekitanOptionTT1" /><span id="ekitanOpt_excludeCommuterYes_label"></span></label></td></tr></table></td></tr><tr><td class="left_m" id="ekitanOpt_commuterRoute_label"></td><td class="right"><table class="ekitan_option_tbl"><tr><td style="white-space:normal;"><div style="width:200px;" id="ekitanOptionCommuterNote"></div><input type="hidden" name="" value="" id="ekitanOptionCommuterCode" /><input type="hidden" name="" value="" id="ekitanOptionCommuterText" /></td></td><td><input type="button" class="pb_base pb_btn_change commuter_route" id="ekitanOptionRouteChange" /><input type="button" class="pb_base pb_btn_clear"  id="ekitanOptionRouteClear" style="margin-left:10px;" /></td></tr><tr id="ekitanOptionCommuterWarnRow" style="display:none;"><td colSpan="2" style="text-align:left;"><div style="color:red;font-size:0.9em;margin-top:4px;white-space:normal;" id="ekitanOptionCommuterWarn"></div></td></tr></table></td></tr></table></div></td><td class="edgevr"></td></tr><tr><td class="edgelb"></td><td class="edgehb"></td><td class="edgerb"></td></tr></table><table border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td colspan="2" style="padding:16px 0px 4px 0px;text-align:center;"><input type="button" class="pb_base  pb_btn_regist"  id="ekitanOptionOk" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button"  class="pb_base pb_btn_cancel" id="ekitanOptionCancel" /></td></tr></table></div>';
    this.okLink = {
        id       : 'ekitanOptionOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'ekitanOptionCancel',
        callback : this.hide
    };
};

teasp.dialog.EkitanOption.prototype = new teasp.dialog.Base();

/**
 * 画面生成
 * @override
 */
teasp.dialog.EkitanOption.prototype.preStart = function(){
    //メッセージ埋め込み
    //innerHTML
    teasp.message.setLabelHtml('area_label'); /*地域*/
    teasp.message.setLabelHtml('ekitanOpt_paidExpress_label','paidExpress_label'); /*特急/新幹線を使う*/
    teasp.message.setLabelHtml('ekitanOpt_yes','paidExpressYes_label'); /*使う*/
    teasp.message.setLabelHtml('ekitanOpt_no','paidExpressNo_label'); /*使わない*/
    teasp.message.setLabelHtml('ekitanOpt_reservedSheet_label','reservedSheet_label'); /*特急料金*/
    teasp.message.setLabelHtml('ekitanOpt_reservedSheetNo_label','reservedSheetNo_label'); /*自由席*/
    teasp.message.setLabelHtml('ekitanOpt_reservedSheetYes_label','reservedSheetYes_label'); /*指定席*/
    teasp.message.setLabelHtml('ekitanOpt_preferredAirLine_label','preferredAirLine_label'); /*優先する航空会社*/
    teasp.message.setLabelHtml('ekitanOpt_preferredAirLineNo_label','preferredAirLineNo_label'); /*なし*/
    teasp.message.setLabelHtml('ekitanOpt_routePreference_label','routePreference_label'); /*検索結果のソート*/
    teasp.message.setLabelHtml('routeSortTime_opt','routeSortTime_label'); /*時間優先*/
    teasp.message.setLabelHtml('routeSortCost_opt','routeSortCost_label'); /*料金優先*/
    teasp.message.setLabelHtml('routeSortChange_opt','routeSortChange_label'); /*乗換回数優先*/
    teasp.message.setLabelHtml('routeSortCommuter_opt','routeSortCommuter_label'); /*定期料金優先*/
    teasp.message.setLabelHtml('ekitanOpt_excludeCommuter_label','excludeCommuter_label'); /*定期区間の取扱*/
    teasp.message.setLabelHtml('ekitanOpt_excludeCommuterNo_label','excludeCommuterNo_label'); /*考慮しない*/
    teasp.message.setLabelHtml('ekitanOpt_excludeCommuterYes_label','excludeCommuterYes_label'); /*除いた交通費を計算*/
    teasp.message.setLabelHtml('ekitanOpt_commuterRoute_label','commuterRoute_label'); /*登録定期区間*/

    //TITLE
    teasp.message.setLabelTitle('ekitanOptionRouteChange','change_btn_title'); /*変更*/
    teasp.message.setLabelTitle('ekitanOptionOk','save_btn_title'); /*登録*/
    teasp.message.setLabelTitle('ekitanOptionCancel','cancel_btn_title'); /*キャンセル*/

    var select = dojo.byId('ekitanOptionArea');
    var lst = teasp.constant.getEkitanAreas();
    for(var i = 0 ; i < lst.length ; i++){
        dojo.create('option', { value: '' + lst[i].areaNo, innerHTML: lst[i].name }, select);
    }
    dojo.connect(dojo.byId('ekitanOptionRouteChange'), 'onclick', this, this.clickRouteChange);
    dojo.connect(dojo.byId('ekitanOptionRouteClear') , 'onclick', this, this.clickRouteClear);
};
/**
 * @override
 */
teasp.dialog.EkitanOption.prototype.preShow = function(){
    var expConfig = this.pouch.getExpConfig();
    if(!expConfig){
        expConfig = {
            preferredAirLine     : 0,
            routePreference      : 0,
            ekitanArea           : this.pouch.getEkitanArea(),
            commuterRouteCode    : "",
            useReservedSheet     : false,
            usePaidExpress       : false,
            commuterRouteNote    : "",
            excludeCommuterRoute : false,
            walkLimit            : 0
        };
    }

    // 地域
    dojo.byId('ekitanOptionArea').value = '' + (typeof(expConfig.ekitanArea) == 'number' ? expConfig.ekitanArea : this.pouch.getEkitanArea());

    // 特急/新幹線を使う
    dojo.byId('ekitanOptionPE1').checked =  (expConfig.usePaidExpress || false);
    dojo.byId('ekitanOptionPE0').checked = !(expConfig.usePaidExpress || false);

    // 特急料金
    dojo.byId('ekitanOptionRS0').checked = !(expConfig.useReservedSheet || false);
    dojo.byId('ekitanOptionRS1').checked =  (expConfig.useReservedSheet || false);

    // 優先する航空会社
    dojo.byId('ekitanOptionAL0').checked = ((expConfig.preferredAirLine || 0) == 0);
    dojo.byId('ekitanOptionAL1').checked = (expConfig.preferredAirLine == 1);
    dojo.byId('ekitanOptionAL2').checked = (expConfig.preferredAirLine == 2);
    dojo.byId('ekitanOptionAL4').checked = (expConfig.preferredAirLine == 4);

    // ソート
    dojo.byId('ekitanOptionSort').value = '' + (expConfig.routePreference || 0);

    // 登録定期区間
    var commuterRouteNote = (expConfig.commuterRouteNote || '');
    var commuterRouteCode = (expConfig.commuterRouteCode || '');
    dojo.byId('ekitanOptionCommuterNote').innerHTML = this.pouch.getCommuterRouteNote();
    dojo.byId('ekitanOptionCommuterText').value     = commuterRouteNote;
    dojo.byId('ekitanOptionCommuterCode').value     = commuterRouteCode;
    dojo.style('ekitanOptionRouteClear', 'display', (this.pouch.isCommuterRouteLock() || !commuterRouteNote) ? 'none' : '');

    // 定期区間の取扱
    dojo.byId('ekitanOptionTT0').checked = !(expConfig.excludeCommuterRoute || false);
    dojo.byId('ekitanOptionTT1').checked =  (expConfig.excludeCommuterRoute || false);

    // 定期区間ロック
    dojo.byId('ekitanOptionTT0').disabled = this.pouch.isCommuterRouteLock();
    dojo.byId('ekitanOptionTT1').disabled = (this.pouch.isCommuterRouteLock() || (commuterRouteNote != '' && !commuterRouteCode)); // ロック状態 or 定期区間は登録されているが、定期区間コードがない
    dojo.query('.commuter_route').forEach(function(elem){
        dojo.style(elem, 'display', (this.pouch.isCommuterRouteLock() ? 'none' : ''));
    }, this);

    dojo.byId('ekitanOptionCommuterWarn').innerHTML = teasp.message.getLabel('tk10005050'); // ※ この区間にかかる定期運賃を差し引いた運賃の計算はサポート対象外となります。ご了承ください。
    dojo.style('ekitanOptionCommuterWarnRow', 'display', (commuterRouteNote != '' && !commuterRouteCode ? '' : 'none')); // 定期区間は登録されているが、定期区間コードがない

    return true;
};

/**
 * 定期区間変更ボタンクリック時の処理
 */
teasp.dialog.EkitanOption.prototype.clickRouteChange = function(){
    var from = null, to = null, via = null;
    var s = dojo.byId('ekitanOptionCommuterText').value;
    var h = dojo.byId('ekitanOptionCommuterCode').value;
    var match = /^(.+) ⇔ (.+?)(?:(?:［)(.+)(?:経由］))?$/.exec(s);
    if(match){
        from = match[1];
        to   = match[2];
        via  = match[3];
    }
    var req = {
        empId        : this.pouch.getEmpId(),
        date         : this.pouch.getToday(),
        storeSt      : this.args.storeSt,
        storeStFunc  : null,
        roundTrip    : true,
        readonly     : false,
        fixed        : false,
        commuter     : true,
        from         : from,
        to           : to,
        via          : via,
        commuterCode : h
    };
    teasp.manager.dialogOpen(
        'ExpSearch',
        req,
        this.pouch,
        this,
        function(o){
            var cd = o.route.commuterCode;
            var cdNote = teasp.util.createCommuterSimpleRoute(o.searchKey);
            dojo.byId('ekitanOptionCommuterCode').value = cd;
            dojo.byId('ekitanOptionCommuterText').value = cdNote.value;
            dojo.byId('ekitanOptionCommuterNote').innerHTML = cdNote.name;
            if(cd == ''){
                dojo.byId('ekitanOptionTT0').checked = true;
                dojo.byId('ekitanOptionTT1').disabled = true;
                dojo.style('ekitanOptionCommuterWarnRow', 'display', '');
            }else{
                dojo.byId('ekitanOptionTT1').disabled = false;
                dojo.byId('ekitanOptionTT1').checked = true;
                dojo.style('ekitanOptionCommuterWarnRow', 'display', 'none');
            }
            dojo.style('ekitanOptionRouteClear', 'display', '');
        }
    );
};

/**
 * 定期区間クリア
 */
teasp.dialog.EkitanOption.prototype.clickRouteClear = function(){
    if(!confirm(teasp.message.getLabel('tk10003380'))){ // 登録定期区間をクリアします。よろしいですか？
        return;
    }
    dojo.byId('ekitanOptionCommuterNote').innerHTML = teasp.message.getLabel('tm10003580'); // （未登録）
    dojo.byId('ekitanOptionCommuterText').value = '';
    dojo.byId('ekitanOptionCommuterCode').value = '';
    dojo.byId('ekitanOptionTT1').disabled = false;
    dojo.byId('ekitanOptionTT0').checked = true;
    dojo.style('ekitanOptionRouteClear'     , 'display', 'none');
    dojo.style('ekitanOptionCommuterWarnRow', 'display', 'none');
};

/**
 * 登録
 * @override
 */
teasp.dialog.EkitanOption.prototype.ok = function(){
    var ec = {};
    ec.ekitanArea       = parseInt(dojo.byId('ekitanOptionArea').value, 10);
    ec.usePaidExpress   = dojo.byId('ekitanOptionPE1').checked;
    ec.useReservedSheet = dojo.byId('ekitanOptionRS1').checked;
    dojo.query('input[name="ekitanOptionAL"]').forEach(function(elem){
        if(elem.checked){
            ec.preferredAirLine = parseInt(elem.value, 10);
        }
    });
    ec.routePreference = parseInt(dojo.byId('ekitanOptionSort').value, 10);
    ec.commuterRouteCode = (dojo.byId('ekitanOptionCommuterCode').value || '');
    ec.commuterRouteNote = (dojo.byId('ekitanOptionCommuterText').value || '');

    if(ec.commuterRouteCode == ''){ // 定期区間コードはない
        dojo.byId('ekitanOptionTT0').checked = true;
        ec.excludeCommuterRoute = false;
    }else{
        ec.excludeCommuterRoute = dojo.byId('ekitanOptionTT1').checked;
    }

    teasp.manager.request(
        'saveEmpExpConfig',
        {
            empId   : this.pouch.getEmpId(),
            expConfig: ec
        },
        this.pouch,
        { hideBusy : false },
        this,
        function(obj){
            this.pouch.setExpConfig(obj.expConfig);
            this.pouch.setCommuterRouteNote(obj.expConfig.commuterRouteNote || null);
            this.close();
        },
        function(event){
            teasp.message.alertError(event);
        }
    );
    return false;
};
