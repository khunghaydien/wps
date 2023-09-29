import {BaseDialog} from "./BaseDialog.js?v=XVERSIONX";
/**
 * メッセージ表示
 */
export class MessageBox extends BaseDialog {
    constructor(tsaMain, viewParam){
        super(tsaMain, viewParam);
        this.messageIndex = 0;
    }
    getContent(){
        const message = this.viewParam.messages ? this.viewParam.messages[0] : this.viewParam.message;
        return `
            <div id="MessageBoxContent">
                ${message}
            </div>
        `;
    }
    ok(){
        if(this.viewParam.messages && ++this.messageIndex < this.viewParam.messages.length){
            const message = this.viewParam.messages[this.messageIndex];
            this.domH.byId('MessageBoxContent').innerHTML = message;
            return;
        }
        super.ok();
    }
}