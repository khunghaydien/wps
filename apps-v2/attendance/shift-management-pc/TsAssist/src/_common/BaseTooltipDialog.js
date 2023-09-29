import {BaseView}   from "./BaseView.js?v=XVERSIONX";
/**
 * 
 */
export class BaseTooltipDialog extends BaseView {
    constructor(tsaMain, viewParam){
        super(tsaMain);
        this.viewParam = viewParam || {};
        this.nodeId = null;
    }
    open(parent, nodeId){
        this.nodeId = nodeId;
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            const rectParent = parent.getBoundingClientRect();
            const baseArea = this.domH.byId(this.baseId);
            const rectBase = baseArea.getBoundingClientRect();
            const x = rectParent.x - rectBase.x;
            const y = rectParent.y - rectBase.y - 4;
            const node = this.domH.create('div', {
                id: nodeId,
                className: 'tsa-tooltip-dialog',
                style: `left:${x}px;top:${y}px;`
            }, baseArea);
            this.domH.create('div', { innerHTML:this.getContent() }, node);
            if(this.viewParam.fragile){
                this.setListenerKey(0, this.domH.addListener(node, 'mouseleave', () => {
                    if(!this.tsaMain.popupStay){
                        this.cancel();
                    }
                }));
            }
            this.setListenerKey(0, this.domH.addListener(document, 'keydown', (e) => {
                if(e.keyCode == 27){
                    this.cancel();
                }
            }));
            this.setListenerKey(0, this.domH.addListener(this.baseId, 'click', (e) => {
                if(!this.domH.getAncestorByElements(e.target, [nodeId, parent])){
                    e.stopPropagation();
                    this.cancel();
                }
            }));
            this.initListeners();
        });
    }
    getContent(){
        return '';
    }
    initListeners(){
        super.initListeners();
    }
    getTopNode(){
        return this.domH.byId(this.nodeId);
    }
    cancel(){
        this.destroy();
        this.reject();
    }
    destroy(){
        super.destroy();
        this.domH.byId(this.baseId).removeChild(this.domH.byId(this.nodeId));
    }
}