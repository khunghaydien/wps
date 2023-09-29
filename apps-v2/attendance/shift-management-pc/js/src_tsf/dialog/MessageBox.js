/**
 * メッセージボックスダイアログ
 *
 * @constructor
 */
teasp.Tsf.MessageBox = function(){
};

teasp.Tsf.MessageBox.prototype.show = function(obj, callback){
    teasp.Tsf.Error.showError();
    this.domHelper = new teasp.Tsf.Dom();

    this.dialog = new dijit.Dialog({
        title       : obj.title || '',
        className   : 'ts-dialog-message-box'
    });
    this.dialog.attr('content', this.getContent(obj));
    this.dialog.startup();
    this.domHelper.connect(this.dialog, 'onCancel', this, function(){ this.hide(); });

    this.callback = callback;
    this.showData(obj);
};

teasp.Tsf.MessageBox.prototype.showData = function(obj){
    this.dialog.show();
};

teasp.Tsf.MessageBox.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.MessageBox.prototype.getFormEl = function(){
    return teasp.Tsf.Dom.node('.ts-section-form', teasp.Tsf.Dom.byId(this.dialog.id));
};

teasp.Tsf.MessageBox.prototype.hide = function(){
    if(this.dialog){
        this.dialog.hide();
        this.domHelper.free();
        this.dialog.destroy();
        tsfManager.removeDialog('MessageBox');
    }
};

teasp.Tsf.MessageBox.prototype.getContent = function(obj){
    var areaEl = this.getDomHelper().create('div', { className: 'ts-dialog ts-message-box' });
    this.getDomHelper().create('div', null
            , this.getDomHelper().create('div', { className: 'ts-error-area', style: 'display:none;' }, areaEl));

    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form' }, areaEl);
    this.getDomHelper().create('div', { innerHTML: obj.message, className: 'ts-message' }, formEl);

    var opdiv = this.getDomHelper().create('div', { className: 'ts-option' }, formEl);

    var op = obj.option;
    if(op && op.type == 'check'){
        var label = this.getDomHelper().create('label', null, opdiv);
        var check = this.getDomHelper().create('input', { type: 'checkbox' }, label);
        check.checked = op.checked || false;
        this.getDomHelper().create('span', { innerHTML: ' ' + (op.name || '') }, label);
    }

    this.createButtons(areaEl);

    return areaEl;
};

teasp.Tsf.MessageBox.prototype.createButtons = function(areaEl){
    var area = this.getDomHelper().create('div', { className: 'ts-dialog-buttons' }, areaEl);
    var div  = this.getDomHelper().create('div', null, area);

    var okbtn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('ok_btn_title')    , 'ts-dialog-ok'    , div); // ＯＫ
    var canbtn = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('cancel_btn_title'), 'ts-dialog-cancel', div); // キャンセル

    this.getDomHelper().connect(okbtn , 'onclick', this, this.ok);
    this.getDomHelper().connect(canbtn, 'onclick', this, this.hide);
};

teasp.Tsf.MessageBox.prototype.showError = function(result){
    var er = teasp.Tsf.Dom.node('.ts-error-area', teasp.Tsf.Dom.byId(this.dialog.id));
    teasp.Tsf.Error.showError(result, er);
};

teasp.Tsf.MessageBox.prototype.ok = function(e){
    var node = teasp.Tsf.Dom.node('input[type="checkbox"]', this.getFormEl());
    var checked = (node && node.checked || false);
    this.callback(checked);
    this.hide();
};
