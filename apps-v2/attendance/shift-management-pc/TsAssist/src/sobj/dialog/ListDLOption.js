import {BaseTooltipDialog} from "../../_common/BaseTooltipDialog.js?v=XVERSIONX";
/**
 * 
 */
export class ListDLOption extends BaseTooltipDialog {
    constructor(tsaMain){
        super(tsaMain);
    }
    getContent(){
        return `
            <div class="tsa-download-option">
                <div>
                    ${this.msgH.get('LabelSelectDLTarget')}
                </div>
                <div>
                    <div><button id="objListDLOption1">${this.msgH.get('LabelDLSObjectList')}</button></div>
                    <div class="tsa-hint" hintId="HintSObjectListDL"></div>
                </div>
                <div>
                    <div><button id="objListDLOption2">${this.msgH.get('LabelDLSObjectFieldV1')}</button></div>
                    <div class="tsa-hint" hintId="HintSObjectFieldDLV1"></div>
                </div>
                <div>
                    <div><button id="objListDLOption3">${this.msgH.get('LabelDLSObjectFieldV2')}</button></div>
                    <div class="tsa-hint" hintId="HintSObjectFieldDLV2"></div>
                </div>
            </div>
        `;
    }
    initListeners(){
        super.initListeners();
        this.setListenerKey(0, this.domH.addListener('objListDLOption1', 'click', () => {
            this.destroy();
            this.resolve(1);
        }));
        this.setListenerKey(0, this.domH.addListener('objListDLOption2', 'click', () => {
            this.destroy();
            this.resolve(2);
        }));
        this.setListenerKey(0, this.domH.addListener('objListDLOption3', 'click', () => {
            this.destroy();
            this.resolve(3);
        }));
    }
}