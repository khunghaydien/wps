/**
 * CSVインポート画面
 *
 * @constructor
 */
teasp.Tsf.MainCsvUpload = function(){
    this.titleCss = 'exp-attach';
};

teasp.Tsf.MainCsvUpload.prototype = new teasp.Tsf.MainBase();

teasp.Tsf.MainCsvUpload.prototype.init = function(){
    teasp.Tsf.MainBase.prototype.init.call(this);
};

teasp.Tsf.MainCsvUpload.prototype.beforeUnload = function(e){
    tsfManager.closeCsvImport();
};

teasp.Tsf.MainCsvUpload.prototype.setResizeEvent = function(){
    window.onresize = teasp.Tsf.MainCsvUpload.resize;
};

teasp.Tsf.MainCsvUpload.prototype.initEnd = function(areaEl){
};

/**
 * 表示エリア作成
 *
 */
teasp.Tsf.MainCsvUpload.prototype.createBase = function(){
    var area = teasp.Tsf.Dom.byId(teasp.Tsf.ROOT_AREA_ID);
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="tsfErrorArea" class="ts-error-area"><div></div></div>'));
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="printExpView"></div>')); // メインリスト
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="tsfFormArea"></div>')); // フォーム
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div class="ts-form-spacer"></div>'));

    teasp.Tsf.Dom.node('#attachToggle > div').innerHTML = teasp.message.getLabel('upload_btn_title'); // アップロード
    teasp.Tsf.Dom.node('#attachSave   > div').innerHTML = teasp.message.getLabel('ci00000020');       // 読込
    teasp.Tsf.Dom.node('#attachCancel > div').innerHTML = teasp.message.getLabel('cancel_btn_title'); // キャンセル
    teasp.Tsf.Dom.byId('attachLabel').innerHTML = teasp.message.getLabel('tk10000761');       // ファイルのアップロード
    teasp.Tsf.Dom.node('#csvImport > button > div').innerHTML = teasp.message.getLabel('ci00000030'); // インポート実行
};

teasp.Tsf.MainCsvUpload.prototype.initViewEnd = function(){
    tsfManager.setImageSrc();
    if(tsfManager.getAction() == 'attach'){
        teasp.Tsf.Dom.show(teasp.Tsf.Dom.byId('tsfUploadArea'), null, true);
    }
    teasp.Tsf.MainCsvUpload.resize();
};

teasp.Tsf.MainCsvUpload.toggleUpload = function(){
    var el = teasp.Tsf.Dom.byId('tsfUploadArea');
    teasp.Tsf.Dom.style(teasp.Tsf.Dom.node('.upload-toggle', el), 'display', 'none');
    teasp.Tsf.Dom.style(teasp.Tsf.Dom.node('.upload-file'  , el), 'display', 'table');
    teasp.Tsf.MainCsvUpload.resize();
    return false;
};

teasp.Tsf.MainCsvUpload.cancelAttach = function(){
    var el = teasp.Tsf.Dom.byId('tsfUploadArea');
    teasp.Tsf.Dom.style(teasp.Tsf.Dom.node('.upload-toggle', el), 'display', 'table');
    teasp.Tsf.Dom.style(teasp.Tsf.Dom.node('.upload-file'  , el), 'display', 'none');
    teasp.Tsf.MainCsvUpload.resize();
    return false;
};

teasp.Tsf.MainCsvUpload.resize = function(){
    var box = teasp.Tsf.Dom.getBox();
    // UIブロック用要素
    var n = teasp.Tsf.Dom.node('.ts-uiblock');
    if(n){
        dojo.style(n, 'width' , box.w + 'px');
        dojo.style(n, 'height', box.h + 'px');
    }
    if(box.w < 200){ // 最低幅
        box.w = 200;
    }
    if(tsfManager.getAction() == 'attach'){
        teasp.Tsf.Dom.style(teasp.Tsf.ROOT_AREA_ID, 'width', '' + box.w + 'px');

        var textArea = teasp.Tsf.Dom.node('#attachExpView > textarea');
        if(textArea){
            var y = teasp.Tsf.Dom.top(textArea);
            var h = Math.max(box.h - (y + 120), 100);
            textArea.style.width  = (box.w - 30) + 'px';
            textArea.style.height = h + 'px';
        }
    }
    teasp.Tsf.MainBase.adjustArea();
};
