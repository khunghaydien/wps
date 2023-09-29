/**
 * メイン画面の基底クラス
 *
 * @constructor
 */
teasp.Tsf.MainBase = function(){
};

teasp.Tsf.MainBase.prototype.init = function(){
    this.domHelper = new teasp.Tsf.Dom();

    this.createBase();
    this.show(false);

    // ウィンドウリサイズイベント
    this.setResizeEvent();

    window.onbeforeunload = teasp.Tsf.Dom.hitch(this, this.beforeUnload);

    // サイドバーの開閉（Salesforce領域のボタン）に反応する
    var sideBarButton = teasp.Tsf.Dom.byId(teasp.Tsf.HANDLEBAR_CONTAINER);
    if(sideBarButton){
        this.domHelper.connect(sideBarButton, 'onclick', null, function(){
            setTimeout(teasp.Tsf.MainBase.resize, 50);
        });
    }

    // ヘッダエリアに値をセット
    teasp.Tsf.Dom.addClass(teasp.Tsf.Dom.node('.ts-top-logo > div'), this.titleCss);

    teasp.Tsf.Dom.setAttr(teasp.Tsf.Dom.node('.ts-top-photo img'), 'src', tsfManager.getSessionSmallPhotoUrl()); // 写真
    teasp.Tsf.Dom.html('#expHeadDeptNameLabel'      , null, teasp.message.getLabel('dept_label'));          // 部署
    teasp.Tsf.Dom.html('#expHeadEmpTypeNameLabel'   , null, teasp.message.getLabel('empType_label'));       // 勤務体系
    teasp.Tsf.Dom.html('#expHeadEmpNameLabel'       , null, teasp.message.getLabel('empName_label'));       // 社員名
    teasp.Tsf.Dom.html('#expHeadDeptName'           , null, tsfManager.getSessionDeptName());               // 部署名
    teasp.Tsf.Dom.html('#expHeadEmpTypeName'        , null, tsfManager.getSessionEmpTypeName());            // 勤務体系名
    teasp.Tsf.Dom.html('#expHeadEmpName'            , null, tsfManager.getSessionEmpName());                // 社員名
    teasp.Tsf.Dom.html('.ts-form-back > button'     , null, teasp.message.getLabel('tf10001540'));          // ＜一覧へ戻る
    teasp.Tsf.Dom.html('.ts-form-print > button'    , null, teasp.message.getLabel('print_btn_title'));     // 印刷
    teasp.Tsf.Dom.html('.ts-total-label > div'      , null, teasp.message.getLabel('total_label'));         // 合計
    teasp.Tsf.Dom.html('.ts-form-save > button'     , null, teasp.message.getLabel('tk10000289'));          // 保存
    teasp.Tsf.Dom.html('.ts-form-cancel > button'   , null, teasp.message.getLabel('cancel_btn_title'));    // キャンセル
    teasp.Tsf.Dom.html('.ts-form-delete > button'   , null, teasp.message.getLabel('delete_btn_title'));    // 削除
    teasp.Tsf.Dom.html('.ts-form-copy > button'     , null, teasp.message.getLabel('tk10000297'));          // コピー
    teasp.Tsf.Dom.html('.ts-edit-button > button'   , null, teasp.message.getLabel('tk10000240'));          // 編集
    teasp.Tsf.Dom.html('.ts-approve-button > button', null, teasp.message.getLabel('tf10000270'));          // 承認／却下
    teasp.Tsf.Dom.html('.ts-applyno-label'          , null, teasp.message.getLabel('expApplyNo_label'));    // 申請番号
    teasp.Tsf.Dom.html('.ts-status-label'           , null, teasp.message.getLabel('status_label'));        // ステータス

    teasp.Tsf.Dom.setAttr(teasp.Tsf.Dom.node('.ts-top-button3 > a'), 'href', tsfManager.getHelpLink());

    this.domHelper.connect(teasp.Tsf.Dom.byId('empListButton'), 'onclick', null, dojo.hitch(this, this.openEmpTable));

    // 日付選択ダイアログを用意
    this.calendarDialog = new teasp.Tsf.Calendar();
    this.calendarDialog.eventCloseCalendar(this.domHelper, teasp.Tsf.ROOT_AREA_ID, 'ts-form-cal');

    this.viewPlus();
    this.initEnd(tsfManager.getArea());
    this.checkMinWidth();

    // Enterキー押下時、イベント伝播させない。これをしないと、IE9 で勝手に画面遷移するなど、おかしな動作をする。
    if(dojo.isIE == 9){
        this.domHelper.connect(tsfManager.getArea(), 'onkeydown', this, function(e){
            if(e.keyCode===13 && (!e.target || e.target.nodeName != 'TEXTAREA')){
                dojo.stopEvent(e);
            }
            return false;
        });
    }
};

teasp.Tsf.MainBase.prototype.setResizeEvent = function(){
    window.onresize = teasp.Tsf.MainBase.resize;
};

// （モバイルのみ）表示領域幅＜基準幅（default=768）の場合、画面崩れを防ぐため
// 最小幅（default=1024）をセットする（#8642）
teasp.Tsf.MainBase.prototype.checkMinWidth = function(){
    if(teasp.isMobile()
    && window.innerWidth < tsfManager.getInfo().getCommon().getExpenseAreaReferWidth()){
        var w = tsfManager.getInfo().getCommon().getExpenseAreaMinWidth();
        if(typeof(w) == 'number'){
            dojo.style('tsfArea', 'min-width', w + 'px');
        }
    }
};

teasp.Tsf.MainBase.prototype.initEnd = function(e){
};

// 参照モードの場合、モードを表示
teasp.Tsf.MainBase.prototype.viewPlus = function(e){
    if(tsfManager.getTarget() != teasp.Tsf.Manager.EXP_PRE_APPLY
    && tsfManager.getTarget() != teasp.Tsf.Manager.EXP_APPLY){
        return;
    }
    if(!this.isArgRead()){
        return;
    }
    var div = dojo.create('div', {
        className : 'reference-mark',
        innerHTML : teasp.message.getLabel('tf10007320'), // 参照モードで開いています
        title     : teasp.message.getLabel('tf10007330')  // 編集モードへ切り替えるにはクリックしてください。\n確定済みもしくは編集権限がない場合は、編集できません。
    }, dojo.byId('tsfArea'));
    dojo.connect(div, 'onclick', function(){
        var href = location.href;
        href = href.replace(/mode=read/, 'mode=edit');
        teasp.locationHref(href);
        document.body.style.cursor = 'wait';
    });
};

//明示的に参照モードである
teasp.Tsf.MainBase.prototype.isArgRead = function(){
    return (/mode=read/.test(location.href));
};

teasp.Tsf.MainBase.prototype.show = function(flag){
    var area = tsfManager.getArea();
    teasp.Tsf.Dom.show('.ts-form-header', area, flag);
    teasp.Tsf.Dom.show('.ts-form-footer', area, flag);
};

teasp.Tsf.MainBase.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.MainBase.prototype.getViewConfig = function(){
    return [];
};

/**
 * ウィンドウを閉じるか他ページへ画面遷移する
 *
 * @param {Object} e
 * @returns {string|undefined}
 */
teasp.Tsf.MainBase.prototype.beforeUnload = function(e){
    return tsfManager.beforeUnload(e);
};

teasp.Tsf.MainBase.prototype.eventOpenCalendar = function(dom, node, around, param, hkey){
    this.calendarDialog.eventOpenCalendar(dom, node, around, param, hkey);
};

teasp.Tsf.MainBase.prototype.eventOpenExpRoute = function(dom, node, around, param, hkey){
    this.expRouteDialog.eventOpenExpRoute(dom, node, around, param, hkey);
};

teasp.Tsf.MainBase.prototype.initViewEnd = function(){};

/**
 * テーブル作成
 *
 */
teasp.Tsf.MainBase.prototype.createBase = function(){
    var area = teasp.Tsf.Dom.byId(teasp.Tsf.ROOT_AREA_ID);
    teasp.Tsf.Dom.append(area, this.createCommonHeader()); // 共通ヘッダ
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="tsfErrorArea" class="ts-error-area"><div></div></div>'));
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="expListView"></div>')); // メインリスト
    teasp.Tsf.Dom.append(area, this.createFormHeader()); // フォーム共通ヘッダ
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="tsfFormArea"></div>')); // フォーム
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div class="ts-form-spacer"></div>'));
    teasp.Tsf.Dom.append(area, this.createFormFooter()); // フォーム共通フッタ
};

/**
 * 共通ヘッダ
 *
 * @returns {Object}
 */
teasp.Tsf.MainBase.prototype.createCommonHeader = function(){
    return teasp.Tsf.Dom.toDom(''
        + '<div id="expTopView">'
        + '    <table>'
        + '        <tbody>'
        + '            <tr>'
        + '                <td class="ts-top-logo">'
        + '                    <div></div>'
        + '                </td>'
        + '                <td class="ts-top-title">'
        + '                    <div class="main-title"></div>'
        + '                    <div class="sub-title"></div>'
        + '                </td>'
        + '                <td class="ts-top-empinfo">'
        + '                    <table>'
        + '                        <tbody>'
        + '                        <tr>'
        + '                            <td class="ts-top-info-l"><div id="expHeadDeptNameLabel"><!--部署名：--></div></td><td class="ts-top-info-r"><div id="expHeadDeptName"   ></div></td>'
        + '                            <td class="ts-top-info-l"><div></div></td><td class="ts-top-info-r"><div></div></td>'
        + '                        </tr>'
        + '                        <tr>'
        + '                            <td class="ts-top-info-l"><div id="expHeadEmpTypeNameLabel"><!--勤務体系名：--></div></td><td class="ts-top-info-r"><div id="expHeadEmpTypeName"></div></td>'
        + '                            <td class="ts-top-info-l"><div id="expHeadEmpNameLabel"    ><!--社員名：    --></div></td><td class="ts-top-info-r"><div id="expHeadEmpName"    ></div></td>'
        + '                        </tr>'
        + '                        </tbody>'
        + '                    </table>'
        + '                </td>'
        + '                <td class="ts-top-emplist">'
        + '                    <div class="pp_base pp_btn_elopen" id="empListButton"></div>'
        + '                </td>'
        + '                <td class="ts-top-photo" ><div><img /></div></td>'
        + '                <td class="ts-top-button1"><a><div><!-- ボタン１   --></div></a></td>'
        + '                <td class="ts-top-button2"><a><div><!-- ボタン３   --></div></a></td>'
        + '                <td class="ts-top-button3"><a target="_blank"><div><!-- ボタン２   --></div></a></td>'
        + '                <td class="ts-top-last"></td>'
        + '            </tr>'
        + '        </tbody>'
        + '    </table>'
        + '</div>');
};

/**
 * フォーム共通ヘッダ
 *
 * @returns {Object}
 */
teasp.Tsf.MainBase.prototype.createFormHeader = function(){
    return teasp.Tsf.Dom.toDom(''
        + '<div class="ts-form-header">'
        + '    <div class="ts-form-edge-left">'
        + '        <table class="ts-form-control">'
        + '            <tbody>'
        + '                <tr>'
        + '                    <td class="ts-form-back ts-std-button"       ><button><!--＜一覧へ戻る--></button></td>'
        + '                    <td class="ts-form-title-vbar"               ><div></div></td>'
        + '                    <td class="ts-form-title"                    ><div></div></td>'
        + '                    <td class="ts-form-change"                   ><div></div></td>'
        + '                </tr>'
        + '            </tbody>'
        + '        </table>'
        + '    </div>'
        + '    <div class="ts-form-edge-right">'
        + '        <table class="ts-form-control">'
        + '            <tbody>'
        + '                <tr>'
        + '                    <td class="ts-form-label"                    ><div class="ts-applyno-label"><!--申請番号  --></div></td>'
        + '                    <td class="ts-form-value"                    ><div class="ts-apply-no"     >&nbsp;</div></td>'
        + '                    <td class="ts-form-print ts-std-button"      ><button><!--印刷      --></button></td>'
        + '                    <td class="ts-total-label"                   ><div><!--合計--></div></td>'
        + '                    <td class="ts-total-value"                   ><div class="ts-total-amount" >&nbsp;</div></td>'
        + '                    <td class="ts-form-status-label"             ><div class="ts-status-label" ><!--ステータス--></div></td>'
        + '                    <td class="ts-form-status"                   ><button></button></td>'
        + '                    <td class="ts-form-delete ts-std-button"     ><button><!--削除      --></button></td>'
        + '                    <td class="ts-form-copy ts-std-button"       ><button><!--コピー    --></button></td>'
        + '                    <td class="ts-form-save ts-std-button"       ><button><!--保存      --></button></td>'
        + '                    <td class="ts-form-cancel ts-std-button"     ><button><!--キャンセル--></button></td>'
        + '                    <td class="ts-apply-button"                  ><button></button></td>'
        + '                    <td class="ts-approve-button"                ><button><!--承認／却下--></button></td>'
        + '                    <td class="ts-edit-button"                   ><button><!--編集      --></button></td>'
        + '                </tr>'
        + '            </tbody>'
        + '        </table>'
        + '    </div>'
        + '</div>');
};

/**
 * フォーム共通フッタ
 * @returns {Object}
 */
teasp.Tsf.MainBase.prototype.createFormFooter = function(){
    return teasp.Tsf.Dom.toDom(''
        + '<div class="ts-form-tail">'
        + '</div>'
        + '<div class="ts-form-footer">'
        + '    <div class="ts-form-edge-right">'
        + '        <table class="ts-form-control">'
        + '            <tbody>'
        + '                <tr>'
        + '                   <td class="ts-total-label"              ><div><!--合計--></div></td>'
        + '                   <td class="ts-total-value"              ><div class="ts-total-amount">&nbsp;  </div></td>'
        + '                   <td class="ts-form-save ts-std-button"  ><button><!-- 保存     --></button></td>'
        + '                   <td class="ts-form-cancel ts-std-button"><button><!--キャンセル--></button></td>'
        + '                   <td class="ts-apply-button"             ><button></button></td>'
        + '                </tr>'
        + '            </tbody>'
        + '        </table>'
        + '    </div>'
        + '</div>'
        + '<div style="display:none;"><a id="expTsfCsvDL">download</a>'
        + '</div>'
        + '<div class="ts-form-bottom">'
        + '</div>');
};

/**
 * ウィンドウリサイズ時の処理
 * @static
 */
teasp.Tsf.MainBase.resize = function(){
    var box = teasp.Tsf.Dom.getBox();
    var ub = teasp.Tsf.Dom.node('.ts-uiblock');
    if(ub){
        var area = dojo.byId('contentWrapper');
        var w = Math.max(box.w, Math.max((area && area.clientWidth)  || 0, document.body.offsetWidth));
        var h = Math.max(box.h, Math.max((area && area.clientHeight) || 0, document.body.offsetHeight));
        dojo.style(ub, 'width' , w + 'px');
        dojo.style(ub, 'height', h + 'px');
    }
    var bp = teasp.Tsf.Dom.node('.ts-busy-panel');
    if(bp){
        var l = Math.max((box.w - 240) / 2, 0);
        var t = Math.max((box.h -  80) / 2, 0);
        l += (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft || 0;
        t += (document.documentElement && document.documentElement.scrollTop)  || document.body.scrollTop || 0;
        dojo.style(bp, 'left', l + 'px');
        dojo.style(bp, 'top' , t + 'px');
    }
    var w = box.w; // ウィンドウ幅を得る
    var bodyCell = teasp.Tsf.Dom.byId(teasp.Tsf.BODY_CELL); // Salesforce領域の idが 'bodyCell' のDivタグ
    if(bodyCell){
        w -= bodyCell.offsetLeft; // （サイドバー幅を引く）
    }
    if(w < 800){ // 最低幅
        w = 800;
    }
    if(Math.abs(teasp.Tsf.Dom.byId(teasp.Tsf.ROOT_AREA_ID).offsetWidth - w) > 80){
        teasp.Tsf.MainBase.adjustArea();
    }
};

teasp.Tsf.MainBase.adjustArea = function(){
    // Salesforce1 の場合、表示エリアの高さを一定以上確保する
    if(navigator.userAgent.indexOf('Salesforce') > 0){
        dojo.byId('tsfArea').style.height = '1000px';
    }
};
