import {BaseDialog} from "../../_common/BaseDialog.js?v=XVERSIONX";
/**
 * 休暇レコードの削除
 */
export class DeleteEmpLeaveManage extends BaseDialog {
    constructor(tsaMain, leaveManager, viewParam){
        super(tsaMain, viewParam);
        this.leaveManager = leaveManager;
        this.empLeaveManage = viewParam.empLeaveManage;
        this.message = viewParam.message;
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
                <div style="width:320px;">
                    ${this.message}
                </div>
                <div id="DeleteEmpLeaveManageAdjusted" style="width:320px;margin:8px 0px;display:none;">
                    ${this.msgH.get('hg00001950'/*関連するマイナス付与データも同時に削除します*/)}
                </div>
                <div style="margin-top:24px;margin-bottom:16px;display:none;">
                    <label><input type="checkbox" id="DeleteEmpLeaveManageAllowMinus" style="vertical-align:middle;" /> ${this.msgH.get('hg00001440'/*過消化を許容する*/)}</label>
                </div>
                <div style="margin-top:6px;" id="DeleteEmpLeaveManageError">
                    <div style="color:red;max-width:400px;">
                    </div>
                </div>
            </div>
        `;
    }
    /**
     * 初期値セット
     */
    setInitValue(){
        this.domH.setStyle('DeleteEmpLeaveManageAdjusted', 'display', this.empLeaveManage.isAdjusted() ? '' : 'none');
    }
    /**
     * エラー表示
     * @param {string|null} message nullの場合はクリア
     */
    showError(message){
        super.showError({
            message: message,
            nodeId: 'DeleteEmpLeaveManageError'
        });
    }
    /**
     * 削除実行
     */
    ok(){
        this.showError(null);
        const req = {
            action: 'operateEmpLeaveManage',
            operateType: 'delete',
            empId: this.empId,
            empLeaveManageId: this.empLeaveManage.getId(),
            allowMinus: this.domH.byId('DeleteEmpLeaveManageAllowMinus').checked
        };
        this.blockingUI(true, this.msgH.get('msg2000030')); // データを更新しています
        this.leaveManager.saveEmpLeaveManage(req).then(() => {
            super.ok();
        }).catch((errobj) => {
            this.showError(this.msgH.parseErrorMessage(errobj));            
        }).then(() => {
            this.blockingUI(false);
        });
    }
}