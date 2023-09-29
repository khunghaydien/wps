import {BaseDialog}     from "../../_common/BaseDialog.js?v=XVERSIONX";
import {Util}           from "../../_common/Util.js?v=XVERSIONX";
/**
 * 次回付与予定日変更ダイアログ
 */
export class ChangeNextProvideDate extends BaseDialog {
    constructor(tsaMain, leaveManager, viewParam){
        super(tsaMain, viewParam);
        this.leaveManager = leaveManager;
        this.empId = viewParam.empId;
        this.nextProvideDate = viewParam.nextProvideDate;
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
                    <input type="date" style="text-align:center;" id="ChangeNextProvideDate" />
                </div>
                <div style="margin-top:6px;" id="ChangeNextProvideDateError">
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
        this.domH.byId('ChangeNextProvideDate').value = this.nextProvideDate;
    }
    /**
     * エラー表示
     * @param {string|null} message nullの場合はクリア
     */
    showError(message){
        super.showError({
            message: message,
            nodeId: 'ChangeNextProvideDateError'
        });
    }
    /**
     * 登録
     */
    ok(){
        this.showError(null);
        if(document.querySelector('#ChangeNextProvideDate:invalid')){
            this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('TypeDate')));
            return;
        }
        const d = this.domH.byId('ChangeNextProvideDate').value || null;
        if(!Util.checkDateRange(d, 'S')){
            this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('TypeDate')));
            return;
        }
        const req = {
            action: 'operateEmpLeaveManage',
            operateType: 'changeNextYuqProvideDate',
            empId: this.empId,
            nextYuqProvideDate: d
        };
        this.blockingUI(true, this.msgH.get('msg2000030')); // データを更新しています
        this.leaveManager.saveEmpLeaveManage(req).then(() => {
            this.resolve({nextProvideDate: req.nextYuqProvideDate});
            this.destroy();
        }).catch((errobj) => {
            this.showError(this.msgH.parseErrorMessage(errobj));            
        }).then(() => {
            this.blockingUI(false);
        });
    }
}