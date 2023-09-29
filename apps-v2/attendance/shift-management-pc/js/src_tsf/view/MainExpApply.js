/**
 * 経費申請メイン画面
 *
 * @constructor
 */
teasp.Tsf.MainExpApply = function(){
    this.titleCss = 'exp-apply';
};

teasp.Tsf.MainExpApply.prototype = new teasp.Tsf.MainBase();

teasp.Tsf.MainExpApply.prototype.init = function(){
    teasp.Tsf.MainBase.prototype.init.call(this);
};

/**
 * 新規作成選択時のポップアップメニュー情報
 *
 * @returns {Array.<Object>}
 */
teasp.Tsf.MainExpApply.prototype.getViewConfig = function(){
    return [];
};

teasp.Tsf.MainExpApply.prototype.initEnd = function(areaEl){
    teasp.Tsf.Dom.html('div.main-title', teasp.Tsf.Dom.byId('expTopView'), teasp.message.getLabel('empExp_caption')); // 経費精算
    teasp.Tsf.Dom.html('div.sub-title' , teasp.Tsf.Dom.byId('expTopView'), teasp.message.getLabel('tf10004580')); // 経費精算(英語)

    teasp.Tsf.Dom.html('.ts-form-back > button'     , null, teasp.message.getLabel('tf10006150'));          // ＜申請一覧へ
    teasp.Tsf.Dom.html('.ts-applyno-label'          , null, teasp.message.getLabel('tf10000550'));          // 精算申請番号
    teasp.Tsf.Dom.html('.ts-form-prev > button'     , null, teasp.message.getLabel('prev_btn_title'));      // 前へ
    teasp.Tsf.Dom.html('.ts-form-next > button'     , null, teasp.message.getLabel('next_btn_title'));      // 次へ
    teasp.Tsf.Dom.html('.ts-apply-list > button'    , null, teasp.message.getLabel('applyList_btn_title')); // 申請一覧
    teasp.Tsf.Dom.html('.ts-form-print > button'    , null, teasp.message.getLabel('print_btn_title'));     // 印刷

    teasp.Tsf.Dom.html('.ts-payValue-label > div'   , null, teasp.message.getLabel('tf10000520'));          // 精算金額
    teasp.Tsf.Dom.html('.ts-provis-label > div'     , null, teasp.message.getLabel('tf10000530'));          // 仮払金額
    teasp.Tsf.Dom.html('.ts-dueToPay-label > div'   , null, teasp.message.getLabel('tf10000540'));          // 本人立替分
    teasp.Tsf.Dom.html('.ts-credit-label > div'     , null, teasp.message.getLabel('tf10004930'));          // 法人カード払い分
    teasp.Tsf.Dom.html('.ts-invoice-label > div'    , null, teasp.message.getLabel('tf10004940'));          // 請求書払い分

    teasp.Tsf.Dom.html('.ts-form-status-label > div', null, teasp.message.getLabel('status_label'));        // ステータス
    teasp.Tsf.Dom.html('.ts-form-save > button'     , null, teasp.message.getLabel('tk10000289'));          // 保存
    teasp.Tsf.Dom.html('.ts-form-cancel > button'   , null, teasp.message.getLabel('cancel_btn_title'));    // キャンセル
    teasp.Tsf.Dom.html('.ts-approve-button > button', null, teasp.message.getLabel('tf10000270'));          // 承認／却下
    teasp.Tsf.Dom.html('.ts-edit-button > button'   , null, teasp.message.getLabel('tk10000240'));          // 編集

    // 一覧へ
    this.domHelper.connect(teasp.Tsf.Dom.node('.ts-form-control .ts-form-back > button'), 'onclick', this, function(){
        if(tsfManager.checkDiff()){
            teasp.tsConfirm(teasp.message.getLabel('tf10001600'),this,function(result){// 編集中のデータを破棄して一覧へ戻ります。よろしいですか？
                if(result){
                    tsfManager.backToList(teasp.Tsf.Manager.EXP_LIST_VIEW);
                }
            })
        }else{
            tsfManager.backToList(teasp.Tsf.Manager.EXP_LIST_VIEW);
        }
    });

    // 削除
    this.domHelper.connect(teasp.Tsf.Dom.query('.ts-form-control .ts-form-delete > button'), 'onclick', this, function(e){
        teasp.tsConfirm(teasp.message.getLabel('tf10001910'),this,function(result){ // 申請を削除します。よろしいですか？
            if(result){
                tsfManager.deleteExpApply(teasp.Tsf.Dom.hitch(this, function(succeed, result){
                    if(succeed){
                        console.log(result);
                        tsfManager.backToList(teasp.Tsf.Manager.EXP_LIST_VIEW);
                    }else{
                        teasp.Tsf.Error.showError(result);
                    }
                }));
            }
        })
    });
};

teasp.Tsf.MainExpApply.prototype.openEmpTable = function(){
    var url = teasp.getPageUrl('deptRefView') + '?type=Exp&empId=' + tsfManager.getSessionEmpId() + '&deptId=' + tsfManager.getSessionDeptId();
    if(teasp.isSforce1()){
        sforce.one.navigateToURL(url);
    }else{
        var wh = window.open(url, 'empTable', 'width=690,height=340,resizable=yes,scrollbars=yes');
        if(wh){
            wh.focus();
        }
    }
};

/**
 * フォーム共通ヘッダ
 *
 * @returns {Object}
 */
teasp.Tsf.MainExpApply.prototype.createFormHeader = function(){
    return teasp.Tsf.Dom.toDom(''
        + '<div class="ts-form-header">'
        + '    <div class="ts-form-edge-left">'
        + '        <table class="ts-form-control">'
        + '            <tbody>'
        + '                <tr>'
        + '                    <td class="ts-form-back ts-std-button"    ><button><!--＜一覧へ--></button></td>'
        + '                    <td class="ts-form-label"><div class="ts-applyno-label"><!--精算申請番号--></div></td>'
        + '                    <td class="ts-form-pulldown"><select><option>--------------</option></select></td>'
        + '                    <td class="ts-form-prev ts-std-button"    ><button><!--前へ--></button></td>'
        + '                    <td class="ts-form-next ts-std-button"    ><button><!--次へ--></button></td>'
        + '                </tr>'
        + '            </tbody>'
        + '        </table>'
        + '    </div>'
        + '    <div class="ts-form-edge-right">'
        + '        <table class="ts-form-control">'
        + '            <tbody>'
        + '                <tr>'
//        + '                    <td class="ts-apply-list ts-std-button"      ><button><!--申請一覧  --></button></td>'
        + '                    <td class="ts-form-print ts-std-button"      ><button><!--印刷      --></button></td>'
        + '                    <td class="ts-payValue-label"                ><div><!--精算金額     --></div></td>'
        + '                    <td class="ts-payValue-value"                ><div>&nbsp;              </div></td>'
        + '                    <td class="ts-form-status-label"             ><div><!--ステータス   --></div></td>'
        + '                    <td class="ts-form-status"                   ><button></button></td>'
        + '                    <td class="ts-form-delete ts-std-button"     ><button><!--削除      --></button></td>'
        + '                    <td class="ts-form-copy ts-std-button"       ><button><!--コピー    --></button></td>'
        + '                    <td class="ts-form-save ts-std-button"       ><button><!--保存      --></button></td>'
        + '                    <td class="ts-form-cancel ts-std-button"     ><button><!--キャンセル--></button></td>'
        + '                    <td class="ts-apply-button"                  ><button></button></td>'
        + '                    <td class="ts-apply-start"                   ><button></button></td>'
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
teasp.Tsf.MainExpApply.prototype.createFormFooter = function(){
    return teasp.Tsf.Dom.toDom(''
        + '<div class="ts-form-tail">'
        + '</div>'
        + '<div class="ts-form-footer">'
        + '    <div class="ts-form-edge-right">'
        + '        <table class="ts-form-control">'
        + '            <tbody>'
        + '                <tr>'
        + '                   <td class="ts-payValue-label"            ><div><!--精算金額        --></div></td>'
        + '                   <td class="ts-payValue-value"            ><div>&nbsp;                 </div></td>'
        + '                   <td class="ts-provis-label"              ><div><!--仮払金額        --></div></td>'
        + '                   <td class="ts-provis-value"              ><div >&nbsp;                </div></td>'
        + '                   <td class="ts-dueToPay-label"            ><div><!--本人立替分      --></div></td>'
        + '                   <td class="ts-dueToPay-value"            ><div >&nbsp;                </div></td>'
        + '                   <td class="ts-credit-label"              ><div><!--法人カード払い分--></div></td>'
        + '                   <td class="ts-credit-value"              ><div >&nbsp;                </div></td>'
        + '                   <td class="ts-invoice-label"             ><div><!--請求書払い分    --></div></td>'
        + '                   <td class="ts-invoice-value"             ><div >&nbsp;                </div></td>'
        + '                   <td class="ts-form-save ts-std-button"   ><button><!--保存      --></button></td>'
        + '                    <td class="ts-form-cancel ts-std-button"><button><!--キャンセル--></button></td>'
        + '                   <td class="ts-apply-button"              ><button></button></td>'
        + '                   <td class="ts-apply-start"               ><button></button></td>'
        + '                </tr>'
        + '            </tbody>'
        + '        </table>'
        + '    </div>'
        + '</div>'
        + '<div class="ts-form-bottom">'
        + '</div>');
};
