import {BaseTooltipDialog} from "./BaseTooltipDialog.js?v=XVERSIONX";
/**
 * 
 */
export class CornerMenu extends BaseTooltipDialog {
    constructor(tsaMain){
        super(tsaMain, { fragile:true });
    }
    getContent(){
        return `
            <div class="tsa-popup-menu-items">
                <div><a href="#!menu"    >${this.msgH.get('MenuMainMenu')}  </a></div>
                <div><a href="#!extend"  >${this.msgH.get('MenuExteOption')}</a></div>
                <div><a href="#!sobjs"   >${this.msgH.get('MenuSObjViewer')}</a></div>
                <div><a href="#!cleaning">${this.msgH.get('MenuCleaning')}  </a></div>
                <div class="separate-bar"><hr/></div>
                <div><a href="${tsCONST.extView}?view=2">${this.msgH.get('MenuOldView2')}</a></div>
                <div><a href="${tsCONST.extView}?debug=1">${this.msgH.get('MenuOutputPlus')}</a></div>
                <div><a href="${tsCONST.configEditView}?support=full">${this.msgH.get('MenuSupportFull')}</a></div>
            </div>
        `;
    }
    initListeners(){
        super.initListeners();
        // リンクがクリックされたら自身をdestroyする
        const area = this.domH.byId(this.nodeId);
        area.querySelectorAll('a').forEach((el) => {
            this.setListenerKey(0, this.domH.addListener(el, 'click', () => {
                this.destroy();
            }));
        });
    }
}