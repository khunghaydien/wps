/**
 * 承認履歴ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ProcessInstanceSteps = function(){
};

teasp.Tsf.ProcessInstanceSteps.prototype = new teasp.Tsf.SearchList();

teasp.Tsf.ProcessInstanceSteps.prototype.show = function(obj, callback){
    this.cancelLabel = obj.cancelLabel;

    teasp.Tsf.SearchList.prototype.show.call(this, obj, callback);
};

teasp.Tsf.ProcessInstanceSteps.prototype.getButtons = function(e){
    return [
        { key:'cancelCallback', label:(this.cancelLabel || teasp.message.getLabel('cancelApply_btn_title')), css:'ts-cancel-apply' }, // 申請取消
        { key:'close'         , label:teasp.message.getLabel('close_btn_title') } // 閉じる
    ];
};

teasp.Tsf.ProcessInstanceSteps.prototype.createButtons = function(areaEl){
    teasp.Tsf.SearchList.prototype.createButtons.call(this, areaEl);

    if(teasp.isAndroid() && teasp.isOnlyNarrow()){ // Anroidモバイルではダイアログ幅が狭められるため、[標準画面で開く]は[閉じる]ボタンの右横に単純に配置する
        var div = teasp.Tsf.Dom.node('div.ts-dialog-buttons > div', areaEl);
        var btn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('tf10001560'), 'ts-dialog-cancel', div); // 標準画面で開く
        this.getDomHelper().connect(btn , 'onclick', this, this.openStandardView);
    }else{ // Androidモバイルでなければ、[標準画面で開く]ボタンは右端に配置する
        var area = teasp.Tsf.Dom.node('div.ts-dialog-buttons', areaEl);
        var div = this.getDomHelper().create('div', { className: 'ts-edge-right' }, area);
        div = this.getDomHelper().create('div', null, div);
        var btn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('tf10001560'), null, div); // 標準画面で開く
        this.getDomHelper().connect(btn , 'onclick', this, this.openStandardView);
    }
};

teasp.Tsf.ProcessInstanceSteps.prototype.drawData = function(tb){
    if(this.orgData && this.orgData.expApply && this.orgData.expApply.mergeSteps){
        // 精算済み、精算取消の履歴は表示しないことにする（#4294 comment8）
//        this.records = this.orgData.expApply.mergeSteps(this.records);
        this.recordCount = this.records.length;
    }

    teasp.Tsf.SearchList.prototype.drawData.call(this, tb);
};

teasp.Tsf.ProcessInstanceSteps.prototype.showDataEnd = function(){
    teasp.Tsf.SearchList.prototype.showDataEnd.call(this);

    var buttonArea = teasp.Tsf.Dom.node('div.ts-dialog-buttons', this.getArea());
    var div = teasp.Tsf.Dom.node('button.ts-cancel-apply > div'         , buttonArea)
           || teasp.Tsf.Dom.node('button.ts-cancel-apply-disabled > div', buttonArea);
    if(div){
        div.innerHTML = (this.orgData.cancelLabel || teasp.message.getLabel('cancelApply_btn_title')); // 申請取消
    }
    // 取消伝票がある場合、取消伝票を標準画面で開くリンクを追加
    if(this.orgData.cancelApplyId){
        var rightArea = teasp.Tsf.Dom.node('div.ts-edge-right', buttonArea);
        if(rightArea){ // (真の場合はAndroidモバイルではない）右端の[標準画面で開く]の下に[取消伝票を標準画面で開く]を配置
            teasp.Tsf.Dom.style(buttonArea, 'margin-bottom', '28px');
            div = this.getDomHelper().create('div', null, rightArea);
            var btn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('tf10006240'), null, div); // 取消伝票を標準画面で開く
            this.getDomHelper().connect(btn , 'onclick', this, this.openCancelApplyStandardView);
        }else{ // Anroidモバイルではダイアログ幅が狭められるため、既存ボタンの右横に単純に配置する
            var div = teasp.Tsf.Dom.node('div', buttonArea);
            var btn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('tf10006240'), 'ts-dialog-cancel', div); // 取消伝票を標準画面で開く
            this.getDomHelper().connect(btn , 'onclick', this, this.openCancelApplyStandardView);
        }
    }
};

/**
 * 標準画面で開く
 *
 * @param {Object} e
 */
teasp.Tsf.ProcessInstanceSteps.prototype.openStandardView = function(e){
    if(this.orgData.id){
        if(teasp.isSforce1()){
            sforce.one.navigateToURL('/' + this.orgData.id);
        }else{
            window.open('/' + this.orgData.id);
        }
    }
};

/**
 * 取消伝票を標準画面で開く
 *
 * @param {Object} e
 */
teasp.Tsf.ProcessInstanceSteps.prototype.openCancelApplyStandardView = function(e){
    if(this.orgData.cancelApplyId){
        if(teasp.isSforce1()){
            sforce.one.navigateToURL('/' + this.orgData.cancelApplyId);
        }else{
            window.open('/' + this.orgData.cancelApplyId);
        }
    }
};
