/**
 * 添付ファイル画面
 *
 * @constructor
 */
teasp.Tsf.MainAttach = function(){
    this.titleCss = 'exp-attach';
};

teasp.Tsf.MainAttach.prototype = new teasp.Tsf.MainBase();

teasp.Tsf.MainAttach.prototype.init = function(){
    this.domHelper = new teasp.Tsf.Dom();

    this.createBase();

    var attachments = tsfManager.getInfo().getAttachments();
    var attachment = (attachments && attachments.length > 0 ? attachments[0] : null);
    var pdiv = teasp.Tsf.Dom.byId('attachExpView');

    if(attachment && attachment.isImage()){
        this.domHelper.create('img', {
            src : '/servlet/servlet.FileDownload?file=' + attachment.getId()
        }, this.domHelper.create('div', { className: 'image-area' }, pdiv));
        this.angle = null;
        this.zoom = 100;

        this.domHelper.connect(teasp.Tsf.Dom.node('#attachExpCtrl .pb_btn_rotate_left' ), 'onclick', this, function(){ this.controlImage('L' ); });
        this.domHelper.connect(teasp.Tsf.Dom.node('#attachExpCtrl .pb_btn_rotate_right'), 'onclick', this, function(){ this.controlImage('R' ); });
        this.domHelper.connect(teasp.Tsf.Dom.node('#attachExpCtrl .pb_btn_zoom_out'    ), 'onclick', this, function(){ this.controlImage('Zo'); });
        this.domHelper.connect(teasp.Tsf.Dom.node('#attachExpCtrl .pb_btn_zoom_in'     ), 'onclick', this, function(){ this.controlImage('Zi'); });

        teasp.Tsf.Dom.node('#attachExpCtrl .pb_btn_rotate_left' ).title = teasp.message.getLabel('roleLeft_btn_title' ); // 左回転
        teasp.Tsf.Dom.node('#attachExpCtrl .pb_btn_rotate_right').title = teasp.message.getLabel('roleRight_btn_title'); // 右回転
        teasp.Tsf.Dom.node('#attachExpCtrl .pb_btn_zoom_out'    ).title = teasp.message.getLabel('zoomIn_btn_title'   ); // 拡大
        teasp.Tsf.Dom.node('#attachExpCtrl .pb_btn_zoom_in'     ).title = teasp.message.getLabel('zoomOut_btn_title'  ); // 縮小
    }else if(attachment){
        this.domHelper.create('a', {
            href      : '/servlet/servlet.FileDownload?file=' + attachment.getId(),
            innerHTML : attachment.getName()
        }, this.domHelper.create('div', { className: 'no-image-area' }, pdiv));
        teasp.Tsf.Dom.show('td.pb_btns,td.zoomDisp', teasp.Tsf.Dom.byId('attachExpCtrl'), false);
    }else{
        this.domHelper.create('div', { className: 'no-image-area', innerHTML: teasp.message.getLabel('tf10001580') }, pdiv); // データが存在しません
        teasp.Tsf.Dom.show('td.pb_btns,td.zoomDisp', teasp.Tsf.Dom.byId('attachExpCtrl'), false);
    }

    this.domHelper.connect(teasp.Tsf.Dom.node('#attachExpCtrl button.ts-close'), 'onclick', this, function(){ // 閉じる
        (window.open('','_top').opener=top).close();
        return false;
    });
    // タイトルをセット
    var heads = document.getElementsByTagName('head');
    if(heads && heads.length > 0){
        this.domHelper.create('title', { innerHTML: teasp.message.getLabel('tf10005070') }, heads[0]); // 領収書イメージ
    }

    // SF1で[プリンタへ出力][閉じる]ボタンを非表示にする
    teasp.Tsf.Dom.show('#attachExpCtrl td.ts-close', null, !teasp.isSforce1());

    teasp.Tsf.MainAttach.resize();
    // ウィンドウリサイズイベント
    window.onresize = teasp.Tsf.MainAttach.resize;
};

teasp.Tsf.MainAttach.prototype.controlImage = function(sig){
    var img = teasp.Tsf.Dom.node('#attachExpView img');
    if(this.angle === null){
        this.angle = 0;
        this.imageWidth  = img.width;
        this.imageHeight = img.height;
    }
    if(sig == 'L' || sig == 'R'){ // 回転
        if(sig == 'L'){ // 左回転
            this.angle -= 90;
            if(this.angle < 0){
                this.angle += 360;
            }
        }else{ // 右回転
            this.angle += 90;
            if(this.angle > 360){
                this.angle -= 360;
            }
        }
        this.rotateImage(img);
    }
    if(sig == 'Zi' || sig == 'Zo'){ // ズーム
        if(sig == 'Zo'){ // 縮小
            if(this.zoom <= 20){
                return;
            }
            this.zoom -= 20;
        }else{ // 拡大
            if(this.zoom >= 200){
                return;
            }
            this.zoom += 20;
        }
        img.width  = this.imageWidth  * (this.zoom / 100);
        img.height = this.imageHeight * (this.zoom / 100);
        teasp.Tsf.Dom.node('#attachExpCtrl input.zoomDisp').value = this.zoom + '%';
    }
};

/**
 * イメージ回転
 * @param {Object} img
 */
teasp.Tsf.MainAttach.prototype.rotateImage = function(img){
    var sufx = (dojo.isIE <= 8 ? '_ie8' : ''); // IE8以前

    dojo.toggleClass(img, 'rotate0'  + sufx, (this.angle == 0  ));
    dojo.toggleClass(img, 'rotate90' + sufx, (this.angle == 90 ));
    dojo.toggleClass(img, 'rotate180'+ sufx, (this.angle == 180));
    dojo.toggleClass(img, 'rotate270'+ sufx, (this.angle == 270));

    var x = (this.angle ==  90) ? 50 * (this.imageHeight / this.imageWidth) : 50;
    var y = (this.angle == 270) ? 50 * (this.imageWidth / this.imageHeight) : 50;
    var styleVal ='-webkit-transform-origin:' + x + '% ' + y + '%;'
                + '-moz-transform-origin:'    + x + '% ' + y + '%;'
                + '-ms-transform-origin:'     + x + '% ' + y + '%;'
                + '-o-transform-origin:'      + x + '% ' + y + '%;';
    dojo.attr(img, 'style', styleVal);
};

/**
 * 表示エリア作成
 *
 */
teasp.Tsf.MainAttach.prototype.createBase = function(){
    var area = teasp.Tsf.Dom.byId(teasp.Tsf.ROOT_AREA_ID);
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="tsfErrorArea" class="ts-error-area" style="display:none;"><div></div></div>'));
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('' // コントロール部
        + '<div id="attachExpCtrl">'
        + '    <table>'
        + '    <tr>'
        + '        <td class="ts-close">'
        + '            <button class="ts-close">閉じる</button>'
        + '        </td>'
        + '        <td>'
        + '        </td>'
        + '        <td class="pb_btns">'
        + '            <input type="button" class="pb_base pb_btn_rotate_left"  />'
        + '            <input type="button" class="pb_base pb_btn_rotate_right" />'
        + '            <input type="button" class="pb_base pb_btn_zoom_out"     />'
        + '            <input type="button" class="pb_base pb_btn_zoom_in"      />'
        + '        </td>'
        + '        <td class="zoomDisp">'
        + '            <div>'
        + '                <input type="text" value="100%" class="zoomDisp" readOnly="readOnly" />'
        + '            </div>'
        + '        </td>'
        + '    </tr>'
        + '    </table>'
        + '</div>'
    ));
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="attachExpView"></div>')); // イメージ表示部
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div class="ts-form-spacer"></div>'));
};

/**
 * ウィンドウリサイズ
 *
 */
teasp.Tsf.MainAttach.resize = function(){
    var box = teasp.Tsf.Dom.getBox();
    var div = teasp.Tsf.Dom.node('#attachExpView > div.image-area');
    if(div){
        div.style.width  = (box.w - 20) + 'px';
        div.style.height = (box.h - 55) + 'px';
    }
};
