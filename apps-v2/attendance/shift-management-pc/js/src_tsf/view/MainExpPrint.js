/**
 * 経費精算印刷画面
 *
 * @constructor
 */
teasp.Tsf.MainExpPrint = function(){
    this.titleCss = 'exp-print';
};

teasp.Tsf.MainExpPrint.prototype = new teasp.Tsf.MainBase();

teasp.Tsf.MainExpPrint.prototype.init = function(){
    teasp.Tsf.MainBase.prototype.init.call(this);
};

teasp.Tsf.MainExpPrint.prototype.beforeUnload = function(e){
};

teasp.Tsf.MainExpPrint.prototype.setResizeEvent = function(){
    window.onresize = teasp.Tsf.MainExpPrint.resize;
};

teasp.Tsf.MainExpPrint.prototype.initEnd = function(areaEl){
};

/**
 * テーブル作成
 *
 */
teasp.Tsf.MainExpPrint.prototype.createBase = function(){
    var area = teasp.Tsf.Dom.byId(teasp.Tsf.ROOT_AREA_ID);
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="tsfErrorArea" class="ts-error-area"><div></div></div>'));
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="printExpView"></div>')); // メインリスト
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="tsfFormArea"></div>')); // フォーム
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div class="ts-form-spacer"></div>'));

    teasp.Tsf.Dom.node('#attachToggle > div').innerHTML = teasp.message.getLabel('upload_btn_title'); // アップロード
    teasp.Tsf.Dom.node('#attachSave   > div').innerHTML = teasp.message.getLabel('save_btn_title');   // 登録
    teasp.Tsf.Dom.node('#attachCancel > div').innerHTML = teasp.message.getLabel('cancel_btn_title'); // キャンセル
    teasp.Tsf.Dom.byId('attachLabel').innerHTML = teasp.message.getLabel('tk10000761');       // ファイルのアップロード
};

teasp.Tsf.MainExpPrint.prototype.initViewEnd = function(){
    tsfManager.setImageSrc();
    if(tsfManager.getAction() == 'attach'){
        teasp.Tsf.Dom.show(teasp.Tsf.Dom.byId('tsfUploadArea'), null, true);
    }
    teasp.Tsf.MainExpPrint.resize();
};

teasp.Tsf.MainExpPrint.toggleUpload = function(){
    var el = teasp.Tsf.Dom.byId('tsfUploadArea');
    teasp.Tsf.Dom.style(teasp.Tsf.Dom.node('.upload-toggle', el), 'display', 'none');
    teasp.Tsf.Dom.style(teasp.Tsf.Dom.node('.upload-file'  , el), 'display', 'table');
    teasp.Tsf.MainExpPrint.resize();
    return false;
};

teasp.Tsf.MainExpPrint.cancelAttach = function(){
    var el = teasp.Tsf.Dom.byId('tsfUploadArea');
    teasp.Tsf.Dom.style(teasp.Tsf.Dom.node('.upload-toggle', el), 'display', 'table');
    teasp.Tsf.Dom.style(teasp.Tsf.Dom.node('.upload-file'  , el), 'display', 'none');
    teasp.Tsf.MainExpPrint.resize();
    return false;
};

teasp.Tsf.MainExpPrint.resize = function(){
    var box = teasp.Tsf.Dom.getBox();
    if(box.w < 200){ // 最低幅
        box.w = 200;
    }
    if(tsfManager.getAction() == 'attach'){
        console.log('box.w=' + box.w);
        console.log('box.h=' + box.h);
        teasp.Tsf.Dom.style(teasp.Tsf.ROOT_AREA_ID, 'width', '' + box.w + 'px');

        var div = teasp.Tsf.Dom.node('#attachExpView > div.image-area');
        if(div){
            var y = teasp.Tsf.Dom.top(div);
            var h = Math.max(box.h - (y + 10), 100);
            div.style.width  = (box.w - 20) + 'px';
            div.style.height = h + 'px';
        }
    }
    teasp.Tsf.MainBase.adjustArea();
};
