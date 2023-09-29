import {BaseDialog}     from "../../_common/BaseDialog.js?v=XVERSIONX";
import {Util}           from "../../_common/Util.js?v=XVERSIONX";
/**
 * 期間指定ダイアログ
 */
export class ChangePeriod extends BaseDialog {
    constructor(tsaMain, viewParam){
        super(tsaMain, viewParam);
        this.sd = viewParam.sd;
        this.ed = viewParam.ed;
    }
    /**
     * 画面生成
     */
    buildContent(){
        super.buildContent();
        this.setInitValue();
    }
    /**
     * 画面DOM
     * @returns {string}
     */
    getContent(){
        return `
            <div>
                <div class="tsa-leave-date-range">
                    <input type="date" style="text-align:center;" id="ChangePeriodStart" />
                    ～
                    <input type="date" style="text-align:center;" id="ChangePeriodEnd" />
                </div>
                <div style="margin-top:6px;" id="ChangePeriodError">
                    <div style="color:red;max-width:400px;">
                    </div>
                </div>
            </div>
        `;
    }
    /**
     * 初期値をセット
     */
    setInitValue(){
        this.domH.byId('ChangePeriodStart').value = this.sd;
        this.domH.byId('ChangePeriodEnd').value = this.ed;
    }
    /**
     * エラー表示
     * @param {string|null} message nullの場合はクリア
     */
    showError(message){
        super.showError({
            message: message,
            nodeId: 'ChangePeriodError'
        });
    }
    /**
     * 期間変更
     */
    ok(){
        this.showError(null);
        if(document.querySelector('#ChangePeriodStart:invalid')){
            this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001820'/*開始日*/)));
            return;
        }
        if(document.querySelector('#ChangePeriodEnd:invalid')){
            this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001830'/*終了日*/)));
            return;
        }
        const sd = this.domH.byId('ChangePeriodStart').value || null;
        const ed = this.domH.byId('ChangePeriodEnd').value || null;
        if(!Util.checkDateRange(sd, 'M')){
            this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001820'/*開始日*/)));
            return;
        }
        if(sd && ed && sd > ed){
            this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001900'/*期間*/)));
            return;
        }

        this.resolve({sd:sd, ed:ed});
        this.destroy();
    }
}