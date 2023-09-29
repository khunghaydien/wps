import {BaseView}   from "./BaseView.js?v=XVERSIONX";
/**
 * 共通ダイアログクラス
 * ※このクラスを継承したダイアログが複数同時にインスタンス化される可能性を考慮して
 * 起点のノード以外は DOM に ID をつけないようにする
 */
export class BaseDialog extends BaseView {
    constructor(tsaMain, viewParam){
        super(tsaMain, viewParam);
        this.dialogId = tsaMain.getNewDialogId();
        this.ignoreKeydownEvent = false;
    }
    /**
     * BaseDialog.open() は基本的に継承クラス側で上書きしない。buildContent や afterBuild を上書きすること。
     * @returns 
     */
    open(){
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.buildContent();
            this.afterBuild();
            this.show();
        });
    }
    buildContent(){
        const baseArea = this.domH.byId(this.baseId);
        const dialogArea = this.domH.create('div', { id:this.dialogId, className:'tsa-modal tsa-dialog-p' }, baseArea);
        this.domH.create('div', null, dialogArea).innerHTML = this.getBaseContent();
        this.divContent.innerHTML = this.getContent();
        const buttons = this.getNodeByClassName('.tsa-buttons');
        if(this.viewParam.readOnly){
            const closeLabel = this.viewParam.closeLabel || this.msgH.get('LabelClose');
            this.domH.create('button', {className:"tsa-dialog-close tsa-cancel", innerHTML:closeLabel}, this.domH.create('div', null, buttons));
        }else{
            const okLabel = this.viewParam.okLabel || this.msgH.get('LabelOk');
            this.domH.create('button', {className:"tsa-dialog-ok", innerHTML:okLabel}, this.domH.create('div', null, buttons));
            if(!this.viewParam.okOnly){
                const cancelLabel = this.viewParam.cancelLabel || this.msgH.get('LabelCancel');
                this.domH.create('button', {className:"tsa-dialog-cancel tsa-cancel", innerHTML:cancelLabel}, this.domH.create('div', null, buttons));
            }
        }
        if(this.viewParam.caption){
            dialogArea.querySelector('div.tsa-caption').innerHTML = this.viewParam.caption;
        }
    }
    afterBuild(){
        this.setTabIndex();
        this.initListeners();
        this.windowResize();
    }
    getBaseContent(){
        return `
            <div class="tsa-caption">
                &nbsp;
            </div>
            <div class="tsa-quit">
                <button class="tsa-dialog-quit tsa-cancel">×</button>
            </div>
            <div style="margin:8px 0px;">
                <div>
                    <div class="tsa-dialog-content" style="margin:0px 16px;">
                    </div>
                    <div class="tsa-buttons" style="margin:8px auto;">
                    </div>
                </div>
            </div>
        `;
    }
    getContent(){
        return '';
    }

    get divContent()  { return this.getNodeByClassName('.tsa-dialog-content'); }
    get buttonQuit()  { return this.getNodeByClassName('.tsa-dialog-quit'   ); }
    get buttonOk()    { return this.getNodeByClassName('.tsa-dialog-ok'     ); }
    get buttonCancel(){ return this.getNodeByClassName('.tsa-dialog-cancel' ); }
    get buttonClose() { return this.getNodeByClassName('.tsa-dialog-close'  ); }

    getNodeByClassName(cn){
        return this.domH.byId(this.dialogId).querySelector(cn);
    }
    getAllControl(){
        return this.domH.byId(this.dialogId).querySelectorAll('button,input,select,textarea');
    }
    setTabIndex(){
        let tabIndex = 0;
        const els = this.getAllControl();
        els.forEach((el) => {
            this.domH.setAttr(el, 'tabindex', ++tabIndex);
        });
        if(els.length){
            els[els.length > 1 ? 1 : 0].focus();
        }
    }
    assistTabMove(event, activeElement, shiftKey){
        const els = this.getAllControl();
        if(els.length){
            const el0 = els[0];
            const el9 = els[els.length - 1];
            if(!shiftKey && activeElement == el9){
                event.preventDefault();
                el0.focus();
            }else if(shiftKey && activeElement == el0){
                event.preventDefault();
                el9.focus();
            }
        }
    }
    destroy(){
        super.destroy();
        const baseArea = this.domH.byId(this.baseId);
        if(baseArea){
            baseArea.removeChild(this.domH.byId(this.dialogId));
        }
    }
    close(){
        this.reject();
        this.destroy();
    }
    ok(){
        this.resolve();
        this.destroy();
    }
    getTopNode(){
        return this.domH.byId(this.dialogId);
    }
    initListeners(){
        super.initListeners();
        // ダイアログ強制終了イベントリスナー（@see TsaMain.closeDialogAll）
        this.setListenerKey(0, this.domH.addListener(this.dialogId, 'close', () => { this.destroy(); }));
        if(!this.viewParam.strict){
            // グレー領域のクリックで閉じる
            this.setListenerKey(0, this.domH.addListener(this.dialogId, 'click', (e) => {
                if(e.target.id == this.dialogId){
                    e.stopPropagation();
                    this.close();
                }
            }));
        }
        this.setListenerKey(0, this.domH.addListener(document, 'keydown', (e) => {
            if(this.ignoreKeydownEvent){
                return;
            }
            if(e.keyCode == 27){
                e.stopPropagation();
                e.preventDefault();
                this.close(); // ESCキー押下で閉じる
            }
            if(e.keyCode == 9){ // タブキー
                this.assistTabMove(e, document.activeElement, e.shiftKey);
            }
        }));
        // Windowリサイズでダイアログ位置を中央に調整
        this.setListenerKey(0, this.domH.addListener(window, 'resize', () => { this.windowResize(); }));
        this.setListenerKey(0, this.domH.addListener(this.buttonOk    , 'click', () => { this.ok(); }));    // OK押下
        this.setListenerKey(0, this.domH.addListener(this.buttonCancel, 'click', () => { this.close(); })); // キャンセル押下
        this.setListenerKey(0, this.domH.addListener(this.buttonClose , 'click', () => { this.close(); })); // 閉じる押下
        this.setListenerKey(0, this.domH.addListener(this.buttonQuit  , 'click', () => { this.close(); })); // ×押下
    }
    setIgnoreKeydownEvent(flag){
        this.ignoreKeydownEvent = flag;
    }
    windowResize(){
        const div = this.domH.byId(this.dialogId).firstChild;
        const y = Math.max((window.innerHeight - div.getBoundingClientRect().height) / 2, 0);
        div.style.marginTop = y + 'px';
    }
    switchDisplay(flag){
        const node = this.domH.byId(this.tsaMain.modalId);
        if(node){
            node.style.display = (flag ? 'block' : 'none');
        }
    }
}