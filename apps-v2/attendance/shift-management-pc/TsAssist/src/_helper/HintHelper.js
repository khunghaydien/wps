import {MessageResource} from "./MessageResource.js?v=XVERSIONX";
/**
 * ツールチップのヒントを表示
 */
export class HintHelper {
    constructor(domHelper, baseId){
        this.domH = domHelper;
        this.baseId = baseId;
        this.hints = {};
    }
    setLangMode(v){
        this.langMode = v;
    }
    getHintMessage(hintId){
        const hintObj = MessageResource.getHintAll()[hintId];
        if(hintObj){
            return (!this.langMode ? (hintObj.jp || hintObj.en) : (hintObj.en || hintObj.jp));
        }
        return null;
    }
    getPosition(parent, baseArea){
        const rectParent = parent.getBoundingClientRect();
        const rectBase = baseArea.getBoundingClientRect();
        return {
            x: rectParent.x - rectBase.x + (rectParent.width / 2),
            y: rectParent.y - rectBase.y,
            baseY: rectBase.y
        };
    }
    open(parent){
        const hintId = (parent ? parent.getAttribute('hintId') : null);
        const hintMsg = this.getHintMessage(hintId);
        if(!hintMsg){
            return;
        }
        const baseArea = this.domH.byId(this.baseId);
        this.removeHintNode(baseArea, hintId);
        const pos = this.getPosition(parent, baseArea); // 表示位置を取得
        const el = this.domH.create('div', {
            className: 'tsa-tool-hint',
            hintId: hintId
        }, baseArea);
        this.domH.create('p', { innerHTML: hintMsg }, el);
        if((pos.baseY + pos.y + el.clientHeight + 30) > window.innerHeight){
            el.classList.add('tsa-tool-hint-b');
            el.style.top = (pos.y - el.clientHeight - 20) + 'px';
        }else{
            el.classList.add('tsa-tool-hint-t');
            el.style.top = (pos.y + 10) + 'px';
        }
        el.style.left = (pos.x - (el.clientWidth / 5)) + 'px';

        this.hints[hintId] = { events:[] };
        this.hints[hintId].events.push(this.domH.addListener(el, 'mouseleave', () => {
            baseArea.removeChild(el);
            this.removeHints(hintId);
        }));
    }
    removeHintNode(baseArea, hintId){
        const el = baseArea.querySelector(`div.tsa-tool-hint[hintId="${hintId}"]`);
        if(el){
            baseArea.removeChild(el);
        }
        this.removeHints(hintId);
    }
    removeHints(hintId){
        if(this.hints[hintId]){
            this.hints[hintId].events.forEach((key) => {
                this.domH.removeListener(key);
            });
            delete this.hints[hintId];
        }
    }
    removeHintAll(){
        const baseArea = this.domH.byId(this.baseId);
        baseArea.querySelectorAll(`div.tsa-tool-hint`).forEach((el) => {
            const hintId = el.id;
            baseArea.removeChild(el);
            this.removeHints(hintId);
        });
    }
}