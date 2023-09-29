/**
 * お待ちくださいダイアログ
 *
 * @constructor
 */
teasp.Tsf.Loading = function(){
    this.off = false;
};

teasp.Tsf.Loading.prototype.show = function(){
    teasp.Tsf.Error.showError();
    if(this.off){
        return;
    }
    if(!this.dialog){
        this.dialog = new dijit.Dialog({
                            title       : teasp.message.getLabel('tm00000040'), // お待ちください
                            content     : '<div class="busywait"></div>',
                            className   : 'ts-dialog-loading'
                        });
        dojo.query('.dijitDialogCloseIcon', this.dialog.titleBar).forEach(function(el){
            el.style.display = 'none';
        });
//        this.dialog.placeAt(teasp.Tsf.ROOT_AREA_ID);
        this.dialog.startup();
    }
    this.dialog.show();
};

teasp.Tsf.Loading.prototype.hide = function(){
    if(this.dialog){
        this.dialog.hide();
    }
};

teasp.Tsf.Loading.prototype.setOff = function(flag){
    this.off = flag;
};
