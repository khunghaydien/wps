import {BaseView}            from "../_common/BaseView.js?v=XVERSIONX";

/**
 * メニュー画面
 */
export class MenuView extends BaseView {
    constructor(tsaMain){
        super(tsaMain, null);
        this.prefixHash = '#!menu';
        this.topNodeId = 'MenuView';
    }

    open(hash){
        if(hash == '#!menu'){
            super.open(hash);
            this.buildContent();
        }else{
            this.tsaMain.setDefaultHash();
        }
    }
    buildContent(){
        this.domH.empty(this.baseId);
        document.getElementById(this.baseId).innerHTML = this.getContent();
        this.domH.byId('LangModeJp').checked = this.tsaMain.isLangModeJp();
        this.domH.byId('LangModeEn').checked = !this.tsaMain.isLangModeJp();
        this.initListeners();
        this.setLabels();
        this.blockingUI(false);
    }
    getContent(){
        return `
            <div id="${this.topNodeId}">
                <div style="margin:10px;vertical-align:middle;display:none;">
                    <label><input type="radio" name="LangMode" value="0" id="LangModeJp" /><span id="LabelLangJp"></span></label>
                    <label><input type="radio" name="LangMode" value="1" id="LangModeEn" /><span id="LabelLangEn"></span></label>
                </div>
                <div class="tsa-top-menu">
                    <div>
                        <div><a href="#!extend"   id="MenuExteOption"></a></div>
                        <div><a href="#!sobjs"    id="MenuSObjViewer"></a></div>
                        <div><a href="#!cleaning" id="MenuCleaning"></a></div>
                        <div class="separate-bar" style="width:500px;"><hr/></div>
                        <div><a href="${tsCONST.extView}?view=2" id="MenuOldView2"></a></div>
                        <div><a href="${tsCONST.extView}?debug=1" id="MenuOutputPlus"></a></div>
                        <div><a href="${tsCONST.configEditView}?support=full" id="MenuSupportFull"></a></div>
                    </div>
                </div>
            </div>
        `;
    }
    setLabels(){
        this.tsaMain.setLangMode(this.domH.byId('LangModeJp').checked ? 0 : 1);
        this.msgH.setLabelById('LabelLangJp');
        this.msgH.setLabelById('LabelLangEn');
        this.msgH.setLabelById('MenuExteOption');
        this.msgH.setLabelById('MenuCleaning');
        this.msgH.setLabelById('MenuSObjViewer');
        this.msgH.setLabelById('MenuSupportFull');
        this.msgH.setLabelById('MenuOldView2');
        this.msgH.setLabelById('MenuOutputPlus');
        this.tsaMain.showOrganization();
    }
    initListeners(){
        super.initListeners();
        this.getTopNode().querySelectorAll('input[type="radio"]').forEach((el) => {
            this.setListenerKey(0, this.domH.addListener(el, 'click', () => { this.setLabels(); }));
        });
    }
}