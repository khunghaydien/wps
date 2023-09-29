import {BaseDialog}     from "../../_common/BaseDialog.js?v=XVERSIONX";
import {Util}           from "../../_common/Util.js?v=XVERSIONX";
/**
 * 時間単位有休の調整ダイアログ
 */
export class AdjustHourlyPaidLeave extends BaseDialog {
    constructor(tsaMain, leaveManager, viewParam){
        super(tsaMain, viewParam);
        this.leaveManager = leaveManager;
        this.empId = viewParam.empId;
        this.holidayGroup = viewParam.holidayGroup;
        this.empLeaveManage = viewParam.empLeaveManage;
        this.hourlyLeavePeriods = viewParam.hourlyLeavePeriods;
    }
    buildContent(){
        super.buildContent();
        this.setInitValue();
        this.changePlusMinus();
        this.buildYearPeriods();
    }
    getContent(){
        return `
            <div>
                <div class="tsa-leave-manage-edit">
                    <table>
                    <tbody>
                        <tr>
                            <td class="tsa-leave-field-name" style="min-width:108px;">${this.msgH.get('hg00001390'/*対象年度*/)}</td>
                            <td>
                                <select id="AdjustHourlyPaidLeaveTargetPeriod">
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td class="tsa-leave-field-name"></td>
                            <td>
                                <label><input type="radio" name="adjustType" id="AdjustHourlyPaidLeaveMinus" /> ${this.msgH.get('hg00002030'/*マイナス*/)}</label>
                                <label><input type="radio" name="adjustType" id="AdjustHourlyPaidLeavePlus"  /> ${this.msgH.get('hg00002040'/*プラス*/)}</label>
                            </td>
                        </tr>
                        <tr>
                            <td class="tsa-leave-field-name" id="AdjustHourlyPaidLeaveDaysLabel">${this.msgH.get('hg00001040'/*消化日数*/)}</td>
                            <td>
                                <input type="text" value="" id="AdjustHourlyPaidLeaveDays"	maxLength="4" style="width:30px;text-align:right;" />
                                <div class="tsa-leave-field-name" style="display:inline-block;margin:0px 8px;" id="AdjustHourlyPaidLeaveTimeLabel">${this.msgH.get('hg00001380'/*消化時間*/)}</div>
                                <input type="text" value="" id="AdjustHourlyPaidLeaveTime"	maxLength="5" style="width:40px;text-align:right;" />
                            </td>
                        </tr>
                        <tr>
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001080'/*説明*/)}</td>
                            <td>
                                <input type="text" value="" id="AdjustHourlyPaidLeaveDescription" style="width:360px;text-align:left;" maxLength="255" />
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div style="margin-left:6px;margin-top:6px;display:none;">
                    <label><input type="checkbox" id="AdjustHourlyPaidLeaveAllowMinus" style="vertical-align:middle;" /> ${this.msgH.get('hg00001440'/*過消化を許容する*/)}</label>
                </div>
                <div style="margin-top:6px;" id="AdjustHourlyPaidLeaveError">
                    <div style="color:red;max-width:500px;">
                    </div>
                </div>
            </div>
        `;
    }
    initListeners(){
        super.initListeners();
        this.setListenerKey(0, this.domH.addListener('AdjustHourlyPaidLeaveDays', 'change', (e) => { this.changeDays(e); }));
        this.setListenerKey(0, this.domH.addListener('AdjustHourlyPaidLeaveTime', 'change', (e) => { this.changeTime(e); }));
        this.setListenerKey(0, this.domH.addListener('AdjustHourlyPaidLeaveMinus', 'click', (e) => { this.changePlusMinus(e); }));
        this.setListenerKey(0, this.domH.addListener('AdjustHourlyPaidLeavePlus', 'click', (e) => { this.changePlusMinus(e); }));
    }
    /**
     * 初期値セット
     */
     setInitValue(){
        if(this.empLeaveManage){
            const days = this.empLeaveManage.isConsume() ? this.empLeaveManage.getConsumeDays() : this.empLeaveManage.getProvideDays();
            const time = this.empLeaveManage.isConsume() ? this.empLeaveManage.getConsumeTime(true) : this.empLeaveManage.getProvideTime(true);
            this.domH.byId('AdjustHourlyPaidLeaveDays').value = days; // 日数
            this.domH.byId('AdjustHourlyPaidLeaveTime').value = time; // 時間
            this.domH.byId('AdjustHourlyPaidLeaveDescription').value = this.empLeaveManage.getDescription(); // 説明
            this.domH.byId('AdjustHourlyPaidLeaveMinus').checked = this.empLeaveManage.isConsume(); // マイナス
            this.domH.byId('AdjustHourlyPaidLeavePlus' ).checked = this.empLeaveManage.isProvide(); // プラス
            // 対象年度とマイナス・プラスは非活性
            this.domH.setAttr('AdjustHourlyPaidLeaveTargetPeriod', 'disabled', true); // 対象年度
            this.domH.setAttr('AdjustHourlyPaidLeaveMinus', 'disabled', true); // マイナス
            this.domH.setAttr('AdjustHourlyPaidLeavePlus' , 'disabled', true); // プラス
        }else{
            this.domH.byId('AdjustHourlyPaidLeaveDays').value = '0';
            this.domH.byId('AdjustHourlyPaidLeaveTime').value = '0:00';
            this.domH.byId('AdjustHourlyPaidLeaveMinus').checked = true;
        }
    }
    /**
     * 年度・期間の選択リストをセット
     */
     buildYearPeriods(){
        if(!this.periodLoaded){
            this.hourlyLeavePeriods.fillPulldown(
                this.domH.byId('AdjustHourlyPaidLeaveTargetPeriod'),
                (this.empLeaveManage ? this.empLeaveManage.getHourlyLeavePeriod() : null),
                (flag, errmsg) => {
                    if(flag){
                        this.periodLoaded = true;
                    }else{
                        this.showError(errmsg);
                    }
                }
            );
        }
    }
    /**
     * 年度・期間の選択リストをセット
     */
    changePlusMinus(){
        const minus = this.domH.byId('AdjustHourlyPaidLeaveMinus').checked;
        this.domH.byId('AdjustHourlyPaidLeaveDaysLabel').innerHTML = this.msgH.get(minus ? 'hg00001040' : 'hg00001030'/*消化日数 : 付与日数*/);
        this.domH.byId('AdjustHourlyPaidLeaveTimeLabel').innerHTML = this.msgH.get(minus ? 'hg00001380' : 'hg00001370'/*消化時間 : 付与時間*/);
    }
    /**
     * 日数を入力
     * @param {Event} e 
     */
     changeDays(e){
        this.showError(null);
        e.target.value = Util.formatDays(e.target.value, true) || '';
    }
    /**
     * 時間を入力
     * @param {Event} e 
     */
    changeTime(e){
        this.showError(null);
        e.target.value = Util.formatHour(e.target.value) || '';
    }
    showError(message){
        super.showError({
            message: message,
            nodeId: 'AdjustHourlyPaidLeaveError'
        });
    }
    ok(){
        this.showError(null);
        const obj = { HolidayGroupId__c: this.holidayGroup.getId() };

        const minus = this.domH.byId('AdjustHourlyPaidLeaveMinus').checked;
        const period = this.hourlyLeavePeriods.getPeriodByYearValue(this.domH.byId('AdjustHourlyPaidLeaveTargetPeriod').value);
        if(!period){
            this.showError(this.msgH.get('hg00001600'/*{0}を選択してください*/, this.msgH.get('hg00001390')/*対象年度*/));
            return;
        }
        obj.AdjustYear__c = period.getYear();
        obj.AdjustYearSubNo__c = period.getSubNo();
        obj.StartDate__c = period.getStartDate();
        obj.EndDate__c = (minus ? obj.StartDate__c : period.getEndDate()); // マイナス=有効終了日と有効開始日は同じ、プラス=対象期間と同じ
        // 日数・時間のチェック
        const days = parseFloat(this.domH.byId('AdjustHourlyPaidLeaveDays').value || '0');
        const time = Util.parseHmm(this.domH.byId('AdjustHourlyPaidLeaveTime').value) || 0;
        if(!days && !time){
            this.showError(this.msgH.get(minus ? 'hg00001460' : 'hg00001450'/*XX日数またはXX時間を入力してください*/));
            return;
        }
        if(minus){
            obj.ConsumeDays__c = days;
            obj.ConsumeTime__c = time;
        }else{
            obj.ProvideDays__c = days;
            obj.ProvideTime__c = time;
        }
        obj.Description__c    = this.domH.byId('AdjustHourlyPaidLeaveDescription').value || null;
        // 時間単位有休調整実行
        const req = {
            action: 'operateEmpLeaveManage',
            operateType: (minus ? 'consume' : 'provide'),
            empId: this.empId,
            empLeaveManageId: (this.empLeaveManage && this.empLeaveManage.getId()) || null,
            allowMinus: this.domH.byId('AdjustHourlyPaidLeaveAllowMinus').checked,
            param: obj
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