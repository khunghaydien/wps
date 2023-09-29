/**
 * 添付ファイルの表示、ハンドリング
 *
 * @constructor
 */
teasp.Tsf.FormExpAttach = function(parent, fp, domHelper){
    this.parent = parent;
    this.fp = fp;
    this.domHelper = domHelper;
    this.IMAGE_EVENT_KEY = 'expAttach';
};

teasp.Tsf.FormExpAttach.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.FormExpAttach.prototype.isReadOnly = function(){
    return this.parent.isReadOnly();
};

teasp.Tsf.FormExpAttach.prototype.createTr = function(tbody){
    var tr = this.getDomHelper().create('tr', null, tbody);
    this.getDomHelper().create('td', { className: 'attach-table' }, tr);

    this.angle = null;
    this.zoom = 100;
    this.ZOOM_K = 10;
    var rL = teasp.Tsf.Dom.node('#attachExpCtrl .pb_btn_rotate_left' );
    var rR = teasp.Tsf.Dom.node('#attachExpCtrl .pb_btn_rotate_right');
    var zO = teasp.Tsf.Dom.node('#attachExpCtrl .pb_btn_zoom_out'    );
    var zI = teasp.Tsf.Dom.node('#attachExpCtrl .pb_btn_zoom_in'     );
    this.getDomHelper().connect(rL, 'onclick', this, function(){ this.controlImage('L' ); });
    this.getDomHelper().connect(rR, 'onclick', this, function(){ this.controlImage('R' ); });
    this.getDomHelper().connect(zO, 'onclick', this, function(){ this.controlImage('Zo'); });
    this.getDomHelper().connect(zI, 'onclick', this, function(){ this.controlImage('Zi'); });
    rL.title = teasp.message.getLabel('roleLeft_btn_title' ); // 左回転
    rR.title = teasp.message.getLabel('roleRight_btn_title'); // 右回転
    zO.title = teasp.message.getLabel('zoomIn_btn_title'   ); // 拡大
    zI.title = teasp.message.getLabel('zoomOut_btn_title'  ); // 縮小

    return tr;
};

/**
 * 添付ファイルエリアを更新
 */
teasp.Tsf.FormExpAttach.prototype.refreshAttach = function(objBase){
    this.objBase = objBase;
    var attachArea = teasp.Tsf.Dom.node('.attach-table', teasp.Tsf.Dom.byId('tsfArea'));

    this.getDomHelper().create('div', { innerHTML: this.getAttachTitle(this.objBase) }, attachArea);

    var tbody = this.getDomHelper().create('tbody', null, this.getDomHelper().create('table', null, attachArea));
    var attachs = this.objBase.getAttachments();
    var argAttachId = tsfManager.getArgAttachId();
    var argAttach = null;
    for(var i = 0 ; i < attachs.length ; i++){
        var attach = attachs[i];
        var tr = this.getDomHelper().create('tr', null, tbody);
        // ファイル名
        var td = this.getDomHelper().create('td', { className: 'attach-name' }, tr);
        var label = this.getDomHelper().create('label', null, td);
        var chk = this.getDomHelper().create('input', { type: 'radio', name: 'attachSelect' }, label);
        if(attach.Id == argAttachId){
            chk.checked = true;
            argAttach = attach;
        }
        this.getDomHelper().connect(chk, 'onclick', this, this.showAttach(attach));
        this.getDomHelper().create('span', { innerHTML: ' ' + attach.Name }, label);
        // 削除
        td = this.getDomHelper().create('td', null, tr);
        if(!this.isReadOnly()){
//          var btn = this.getDomHelper().create('button', { className: 'png-del' }, td);
            var btn = this.getDomHelper().create('a', { innerHTML: teasp.message.getLabel('tf10006390') }, td); // [削除]
            this.getDomHelper().connect(btn, 'onclick', this, this.deleteAttach(attach));
        }
    }
    if(argAttach){
        this.showAttach(argAttach).apply(this);
    }
    this.deletedAttachs = [];
    if(this.isReadOnly()){
        teasp.Tsf.Dom.show(teasp.Tsf.Dom.byId('attachToggle'), null, false);
    }else{
        this.sendToOpener();
    }
};

teasp.Tsf.FormExpAttach.prototype.getAttachTitle = function(objBase){
    var title;
    if(this.fp.getObjectName() == 'AtkExpApply__c'){
        title = teasp.message.getLabel('image_files_expenses', objBase.getApplyNo());
    }else{
        title = teasp.message.getLabel('image_files', objBase.getApplyNo());
    }
    return title;
};

/**
 * 親ウィンドウへ送信
 *
 */
teasp.Tsf.FormExpAttach.prototype.sendToOpener = function(){
    var win = window.opener;
    if (win != null) {
        win.tsfManager.appliedAttach({
            id      : this.objBase.getId(),
            attachs : this.objBase.getAttachments(),
            deleted : this.deletedAttachs
        });
    }
};

/**
 * イメージ表示部をクリアする
 * @returns {Object}
 */
teasp.Tsf.FormExpAttach.prototype.clearAttach = function(){
    var area = teasp.Tsf.Dom.byId('attachExpView');
    this.getDomHelper().freeBy(this.IMAGE_EVENT_KEY);
    teasp.Tsf.Dom.empty(area);
    this.imageDisped = false;
    return area;
};

/**
 * イメージ表示部を非表示にする
 */
teasp.Tsf.FormExpAttach.prototype.resetAttach = function(){
    this.clearAttach();
    teasp.Tsf.Dom.show(teasp.Tsf.Dom.byId('attachExpCtrl'), null, false);
    teasp.Tsf.Dom.show(teasp.Tsf.Dom.byId('attachExpView'), null, false);
};

/**
 * イメージをセット
 * @param {string} id
 * @returns {Function}
 */
teasp.Tsf.FormExpAttach.prototype.showAttach = function(attach){
    return function(e){
        cancelAttach(); // see AtkEmpExpPrintView.page
        var area = this.clearAttach();
        if(/^image/i.test(attach.ContentType)){ // イメージ
            teasp.Tsf.Dom.show(teasp.Tsf.Dom.byId('attachExpCtrl'), null, true);
            teasp.Tsf.Dom.show(teasp.Tsf.Dom.byId('attachExpView'), null, true);

            var img = this.getDomHelper().create('img', {
                        src: '/servlet/servlet.FileDownload?file=' + attach.Id
                      }, this.getDomHelper().create('div', { className: 'image-area' }, area));
            this.getDomHelper().connect(img, 'onload', this, this.onLoadImage, this.IMAGE_EVENT_KEY);
            teasp.Tsf.MainExpPrint.resize();
        }else{
            teasp.Tsf.Dom.show(teasp.Tsf.Dom.byId('attachExpCtrl'), null, false);
            teasp.Tsf.Dom.show(teasp.Tsf.Dom.byId('attachExpView'), null, true);

            this.getDomHelper().create('a', {
                href      : '/servlet/servlet.FileDownload?file=' + attach.Id,
                innerHTML : attach.Name,
                target    : '_blank'
            }, this.getDomHelper().create('div', { className: 'no-image-area' }, area));
        }
    };
};

/**
 * 添付ファイルを削除
 * @param {Object} attach
 * @returns {Function}
 */
teasp.Tsf.FormExpAttach.prototype.deleteAttach = function(attach){
    return function(e){
        var tr = teasp.Tsf.Dom.getAncestorByTagName(e.target, 'TR');
        teasp.tsConfirm(teasp.message.getLabel('tf10006380', attach.Name),this,function(result){// {0} を削除してよろしいですか？ 
            if(result){
                var req = {
                    method       : 'deleteAttach',
                    attachmentId : attach.Id
                };
                // 削除実行
                tsfManager.potalAction(req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
                    if(succeed){
                        var node = teasp.Tsf.Dom.node('input[type="radio"]', tr);
                        if(node.checked){
                            node.checked = false;
                            this.resetAttach();
                        }
                        teasp.Tsf.Dom.show(tr, null, false); // ファイル名の行を非表示にする
                        this.deletedAttachs.push(attach.Id);
                        this.sendToOpener();
                    }else{
                        teasp.Tsf.Error.showError(result);
                    }
                    teasp.Tsf.MainExpPrint.resize();
                }));
            }
        });
    };
};

/**
 * イメージ表示時処理
 * @param {Object} e
 */
teasp.Tsf.FormExpAttach.prototype.onLoadImage = function(e){
    var img = e.target;
    if(this.imageDisped || !img.width){
        return;
    }
    this.imageWidth  = img.width;
    this.imageHeight = img.height;
    var imgArea = teasp.Tsf.Dom.node('.image-area', teasp.Tsf.Dom.byId('attachExpView'));
    this.imageDisped = true;
    this.zoom = Math.ceil(((imgArea.offsetWidth - 20) / this.imageWidth) * 100);
    if(this.zoom > 100){
        this.zoom = 100;
    }
    this.setZoom(img);
};

/**
 * イメージの回転・ズーム
 * @param {string} sig
 */
teasp.Tsf.FormExpAttach.prototype.controlImage = function(sig){
    var img = teasp.Tsf.Dom.node('#attachExpView img');
    if(this.angle === null){
        this.angle = 0;
//        this.imageWidth  = img.width;
//        this.imageHeight = img.height;
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
            if(this.zoom > 10){
                if(this.zoom % this.ZOOM_K){ // ZOOM_K で割り切れない
                    this.zoom = Math.floor(this.zoom / this.ZOOM_K) * this.ZOOM_K;
                }else{
                    this.zoom -= this.ZOOM_K;
                }
            }
        }else{ // 拡大
            if(this.zoom < 200){
                if(this.zoom % this.ZOOM_K){ // ZOOM_K で割り切れない
                    this.zoom = Math.ceil(this.zoom / this.ZOOM_K) * this.ZOOM_K;
                }else{
                    this.zoom += this.ZOOM_K;
                }
            }
        }
        this.setZoom(img);
    }
};

/**
 * イメージズーム
 * @param {Object} img
 */
teasp.Tsf.FormExpAttach.prototype.setZoom = function(img){
    img.width  = this.imageWidth  * (this.zoom / 100);
    img.height = this.imageHeight * (this.zoom / 100);
    teasp.Tsf.Dom.node('#attachExpCtrl input.zoomDisp').value = this.zoom + '%';
};

/**
 * イメージ回転
 * @param {Object} img
 */
teasp.Tsf.FormExpAttach.prototype.rotateImage = function(img){
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
