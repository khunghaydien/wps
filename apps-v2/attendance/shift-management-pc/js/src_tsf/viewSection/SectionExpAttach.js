/**
 * 添付ファイルセクション
 *
 * @constructor
 */
teasp.Tsf.SectionExpAttach = function(parent){
    this.parent = parent;
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionExpAttach);
    this.checkable = false;
    this.ATTACH_TABLE_KEY = 'attach_table_key';
};

teasp.Tsf.SectionExpAttach.prototype = new teasp.Tsf.SectionBase();

teasp.Tsf.SectionExpAttach.prototype.createArea = function(){
    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form ' + this.getFormCss() });

    var bar = this.createSectionBar(this.getDomHelper(), this.fp.getTitle(), false, 'ts-section-bar2 margin-top-10');

    return [bar, formEl];
};

teasp.Tsf.SectionExpAttach.prototype.refresh = function(obj){
    teasp.Tsf.SectionBase.prototype.refresh.call(this, obj);

    var attachs = this.getObjBase().getAttachments();
    var useAttach = tsfManager.getInfo().isUseAttachment(this.getObjBase().getTypeName());

    var formEl = this.getFormEl();
    this.getDomHelper().freeBy(this.ATTACH_TABLE_KEY);
    teasp.Tsf.Dom.empty(formEl);
    if(attachs.length > 0){
        var tbody = this.getDomHelper().create('tbody', null, this.getDomHelper().create('table', null, formEl));
        for(var i = 0 ; i < attachs.length ; i++){
            var attach = attachs[i];
            var tr = this.getDomHelper().create('tr', { data: attach.Id }, tbody);
            var a = this.getDomHelper().create('a', { innerHTML: attach.Name }
                , this.getDomHelper().create('div', null
                        , this.getDomHelper().create('td', null, tr)));
            this.getDomHelper().connect(a, 'onclick', this, function(id){
                return function(e){
                    this.openAttachment(id);
                };
            }(attach.Id), this.ATTACH_TABLE_KEY);
        }
    }
    if(!this.isReadOnly()){
        var btn = this.getDomHelper().create('button', { className: 'png-add' } // 追加
            , this.getDomHelper().create('div', { className: 'ts-attach-button' }, formEl));
        if(!this.getObjBase().getId()){ // IDがない場合は、ツールチップを表示
            this.getDomHelper().createTooltip({
                connectId   : btn,
                label       : teasp.message.getLabel('tf10001660'), // 保存後、画像ファイルをアップロード<br/>できるようになります。
                position    : ['below'],
                showDelay   : 200
            });
        }else{
            this.getDomHelper().connect(btn, 'onclick', this, function(){ this.openAttachment(null); }, this.ATTACH_TABLE_KEY);
        }
    }
    if((!this.getObjBase().getId() && !this.getObjBase().isCreateFlag())  // 未申請明細では表示しない
    || (!useAttach && !attachs.length)){ // 添付ファイルを使用しないかつ添付ファイルなし
        this.show(false);
    }else{
        this.show(true);
    }
};

/**
 * 添付ファイルクリック時の処理
 *
 */
teasp.Tsf.SectionExpAttach.prototype.openAttachment = function(attachId){
    var h = (screen.availHeight || 540);
    if(h > 540){
        h = 540;
    }
    var readOnly = this.getObjBase().isReadOnly();
    var href = teasp.getPageUrl('expPrintView') + '?action=attach'
        + '&id='       + this.getObjBase().getId()
        + '&attachId=' + (attachId || '')
        + '&mode='     + (readOnly ? 'read' : 'edit');
    if(teasp.isSforce1()){
        sforce.one.navigateToURL(href);
    }else{
        var wh = window.open(href,
            'expAttach', 'width=700,height=' + h + ',resizable=yes,scrollbars=yes');
        setTimeout(function(){ wh.resizeTo(710, h); wh.focus(); }, 100);
    }
};

/**
 * 子ウィンドウから受信した情報で添付ファイル情報を更新
 *
 * @param attachObj
 * @see teasp.Tsf.FormExpPrint.prototype.sendToOpener
 */
teasp.Tsf.SectionExpAttach.prototype.setAttachmentInfo = function(attachObj){
    if(this.getObjBase().getId() != attachObj.id){
        return;
    }
    var attachs = [];
    var deleted = attachObj.deleted || [];
    for(var i = 0 ; i < attachObj.attachs.length ; i++){
        var a = attachObj.attachs[i];
        if(!deleted.contains(a.Id)){
            attachs.push(a);
        }
    }
    this.getObjBase().setAttachments(attachs);
    this.refresh();
};
