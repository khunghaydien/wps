import {BaseDialog}     from "../../_common/BaseDialog.js?v=XVERSIONX";
import {Util}           from "../../_common/Util.js?v=XVERSIONX";
/**
 * 消化データ編集ダイアログ
 */
export class EditConsume extends BaseDialog {
    constructor(tsaMain, leaveManager, viewParam){
        super(tsaMain, viewParam);
        this.leaveManager = leaveManager;
        this.empId = viewParam.empId;
        this.holidayGroupId = viewParam.holidayGroupId;
        this.empLeaveManage = viewParam.empLeaveManage;
    }
    /**
     * 画面生成
     */
    buildContent(){
        super.buildContent();
        this.buildHolidayGroups();
        this.setInitValue();
        this.changeHolidayGroup();
        this.checkSpecifyPeriod();
        this.domH.setAttr('LeaveEditConsumeHolidayGroup', 'disabled', (this.empLeaveManage ? true : false));
    }
    /**
     * 画面DOM
     * @returns {string}
     */
    getContent(){
        return `
            <div>
                <div class="tsa-leave-manage-edit">
                    <table>
                    <tbody>
                        <tr>
                            <td class="tsa-leave-field-name" style="min-width:108px;">${this.msgH.get('hg00001180'/*休暇グループ*/)}</td>
                            <td>
                                <select id="LeaveEditConsumeHolidayGroup" style="max-width:270px;"></select>
                                <label style="margin-left:8px;">
                                    <input type="checkbox" id="LeaveEditConsumePeriod" style="vertical-align:middle;" />
                                    ${this.msgH.get('hg00001330'/*期間で指定*/)}
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td class="tsa-leave-field-name" id="LeaveEditConsumeDateLabel">${this.msgH.get('hg00001340'/*消化開始日*/)}</td>
                            <td>
                                <input type="date" id="LeaveEditConsumeStartDate"  style="text-align:center;" />
                                <div style="display:inline-block;margin:0px;vertical-align:middle;">
                                    <span class="tsa-leave-field-name tsa-leave-consume-period" style="margin:0px 8px;">${this.msgH.get('hg00001350'/*消化終了日*/)}</span>
                                    <input type="date" id="LeaveEditConsumeEndDate" class="tsa-leave-consume-period" style="text-align:center;" />
                                </div>
                            </td>
                        </tr>
                        <tr class="tsa-leave-consume-period">
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001840'/*除外日*/)}</td>
                            <td>
                                <!-- button id="LeaveEditConsumeExcludeDate" >${this.msgH.get('hg00001470'/*除外日を入力*/)}</button -->
                                <input type="text" id="LeaveEditConsumeExcludeDate" maxLength="400" style="width:360px;" />
                            </td>
                        </tr>
                        <tr class="tsa-leave-consume-period">
                            <td colSpan="2" style="text-align:right;">
                                <span style="font-size:90%;">
                                ${this.msgH.get('hg00001480'/*除外日はYYYYMMDDで複数ある場合は':'(コロン)区切りで日付を指定します*/)}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td class="tsa-leave-field-name" id="LeaveEditConsumeConsumeLabel">${this.msgH.get('hg00001040'/*消化日数*/)}</td>
                            <td>
                                <input type="text" value="" id="LeaveEditConsumeConsumeDays" maxLength="4" style="width:30px;text-align:right;" />
                                <input type="text" value="" id="LeaveEditConsumeConsumeTime" maxLength="5" style="width:40px;text-align:right;display:none;" />
                                <label style="margin-left:8px;">
                                    <input type="checkbox" id="LeaveEditConsumeHourly" style="vertical-align:middle;" />
                                    ${this.msgH.get('hg00001890'/*時間単位休*/)}
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001080'/*説明*/)}</td>
                            <td>
                                <input type="text" value="" id="LeaveEditConsumeDescription" style="width:360px;text-align:left;" maxLength="255" />
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div style="margin-left:6px;margin-top:6px;display:none;">
                    <label><input type="checkbox" id="LeaveEditConsumeAllowMinus" style="vertical-align:middle;" /> ${this.msgH.get('hg00001440'/*過消化を許容する*/)}</label>
                </div>
                <div style="margin-top:6px;" id="LeaveEditConsumeError">
                    <div style="color:red;max-width:500px;">
                    </div>
                </div>
            </div>
        `;
    }
    /**
     * イベントリスナーセット
     */
    initListeners(){
        super.initListeners();
        this.setListenerKey(0, this.domH.addListener('LeaveEditConsumeHolidayGroup', 'change', () => { this.changeHolidayGroup(); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditConsumeConsumeDays', 'change', (e) => { this.changeDays(e); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditConsumeConsumeTime', 'change', (e) => { this.changeTime(e); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditConsumePeriod', 'click', () => { this.checkSpecifyPeriod(); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditConsumeHourly', 'click', () => { this.checkConsumeHourly(); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditConsumeStartDate', 'input', () => { this.changeStartDate(); }));
    }
    /**
     * 休暇グループの選択リストをセット
     */
    buildHolidayGroups(){
        const select = this.domH.byId('LeaveEditConsumeHolidayGroup');
        this.domH.empty(select);
        // 日数管理かつ時間単位有休制限以外の休暇グループをプルダウンにセット
        this.leaveManager.getManageGroups(true).forEach((hg) => {
            this.domH.create('option', { textContent:hg.getName(), value:hg.getId() }, select);
        });
    }
    /**
     * 初期値セット
     */
    setInitValue(){
        if(this.empLeaveManage){
            this.domH.byId('LeaveEditConsumeHolidayGroup').value = this.empLeaveManage.getHolidayGroupId();
            this.domH.byId('LeaveEditConsumeStartDate'  ).value = this.empLeaveManage.getStartDate(); // 消化開始日
            this.domH.byId('LeaveEditConsumeEndDate'    ).value = this.empLeaveManage.getEndDate();   // 消化終了日
            this.domH.byId('LeaveEditConsumeConsumeDays').value = this.empLeaveManage.getConsumeDays(); // 付与日数
            this.domH.byId('LeaveEditConsumeConsumeTime').value = this.empLeaveManage.getConsumeTime(true); // 付与時間
            this.domH.byId('LeaveEditConsumeExcludeDate').value = this.empLeaveManage.getExcludeDate(); // 除外日
            this.domH.byId('LeaveEditConsumeDescription').value = this.empLeaveManage.getDescription(); // 説明
            this.domH.byId('LeaveEditConsumePeriod').checked = (this.empLeaveManage.getStartDate() != this.empLeaveManage.getEndDate());
            this.domH.byId('LeaveEditConsumeHourly').checked = this.empLeaveManage.isHourlyPaidLeave();
        }else{
            if(this.holidayGroupId){
                this.domH.byId('LeaveEditConsumeHolidayGroup').value = this.holidayGroupId;
            }
            this.domH.byId('LeaveEditConsumeConsumeLabel').innerHTML = this.msgH.get('hg00001040'/*消化日数*/);
            this.domH.byId('LeaveEditConsumeConsumeDays').value = '0';
            this.domH.byId('LeaveEditConsumeConsumeTime').value = '0:00';
        }
    }
    /**
     * 休暇グループ変更
     */
    changeHolidayGroup(){
        this.showError(null);
    }
    /**
     * 消化日変更
     */
     changeStartDate(){
        this.showError(null);
    }
    /**
     * 期間で指定
     */
    checkSpecifyPeriod(){
        this.showError(null);
        const checkPeriod = this.domH.byId('LeaveEditConsumePeriod').checked;
        this.domH.byId('LeaveEditConsumeDateLabel').innerHTML = this.msgH.get(checkPeriod ? 'hg00001340' : 'hg00001360'/*消化開始日 : 消化日*/);
        this.getTopNode().querySelectorAll('.tsa-leave-consume-period').forEach((el) => {
            this.domH.setStyle(el, 'display', (checkPeriod ? '' : 'none'));
        });
        this.domH.setAttr('LeaveEditConsumeHourly', 'disabled', checkPeriod);
        if(checkPeriod){
            this.domH.byId('LeaveEditConsumeHourly').checked = false;
        }
        this.checkConsumeHourly();
    }
    /**
     * 時間単位休
     */
    checkConsumeHourly(){
        this.showError(null);
        const checkHourly = this.domH.byId('LeaveEditConsumeHourly').checked;
        this.domH.byId('LeaveEditConsumeConsumeLabel').innerHTML = this.msgH.get(checkHourly ? 'hg00001380' : 'hg00001040'/*消化時間 : 消化日数*/);
        this.domH.setStyle('LeaveEditConsumeConsumeDays', 'display', (checkHourly ? 'none' : ''));
        this.domH.setStyle('LeaveEditConsumeConsumeTime', 'display', (checkHourly ? '' : 'none'));
    }
    /**
     * 日数入力
     * @param {Event}} e 
     */
    changeDays(e){
        this.showError(null);
        e.target.value = Util.formatDays(e.target.value, true) || '';
    }
    /**
     * 時間入力
     * @param {Event} e 
     */
    changeTime(e){
        this.showError(null);
        e.target.value = Util.formatHour(e.target.value) || '';
    }
    /**
     * エラー表示
     * @param {string|null} message nullの場合はクリア
     */
    showError(message){
        super.showError({
            message: message,
            nodeId: 'LeaveEditConsumeError'
        });
    }
    /**
     * 期間、除外日から消化日数を得る
     * 同時に除外日の書式と値をチェックする
     * @param {object} obj 
     * @returns {object}
     */
    getConsumeDaysByDateRange(obj){
        const res = {
            days: 0,
            message: null
        };
        const excludes = {};
        const correctVals = [];
        const vs = (obj.ExcludeDate__c || '').split(/:/);
        for(let i = 0 ; i < vs.length ; i++){
            const v = vs[i].trim();
            if(!v){
                continue;
            }
            const m = /^(\d{4})(\d{2})(\d{2})$/.exec(v);
            if(!m){
                res.message = this.msgH.get('hg00001490'/*除外日の書式が正しくありません*/);
            }else{
                correctVals.push(v);
                const d = `${m[1]}-${m[2]}-${m[3]}`;
                excludes[d] = 1;
            }
        }
        const sd = obj.StartDate__c;
        const ed = obj.EndDate__c;
        let d = sd;
        let cnt = 0;
        while(d <= ed){
            if(excludes[d]){
                excludes[d] = 0;
            }else{
                cnt++;
            }
            d = Util.addDays(d, 1);
        }
        res.days = cnt;
        for(d in excludes){
            if(excludes[d]){
                res.message = this.msgH.get('hg00001500'/*期間に存在しない日付が除外日に指定されています*/);
            }
        }
        return res;
    }
    /**
     * 登録
     */
    ok(){
        this.showError(null);
        const obj = (this.empLeaveManage ? this.empLeaveManage.clone() : {});
        delete obj.CreatedDate;
        delete obj.LastModifiedDate;
        obj.AdjustYear__c      = null;
        obj.AdjustYearSubNo__c = null;
        obj.AdjustTargetId__c  = null;
        obj.Periodic__c        = false;
        obj.RealProvideDays__c = null;
        obj.DayType__c         = null;

        // 休暇グループ
        const select = this.domH.byId('LeaveEditConsumeHolidayGroup');
        const holidayGroup = this.leaveManager.getHolidayGroupById(select.value);
        if(!holidayGroup){
            this.showError(this.msgH.get('hg00001600'/*{0}を選択してください*/, this.msgH.get('hg00001180')/*休暇グループ*/));
            return;
        }
        obj.HolidayGroupId__c = holidayGroup.getId();
        // 期間
        if(this.domH.byId('LeaveEditConsumePeriod').checked){ // 期間で指定
            if(document.querySelector('#LeaveEditConsumeStartDate:invalid')){
                this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001340'/*消化開始日*/)));
                return;
            }
            if(document.querySelector('#LeaveEditConsumeEndDate:invalid')){
                this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001350'/*消化終了日*/)));
                return;
            }
            obj.StartDate__c = this.domH.byId('LeaveEditConsumeStartDate').value;
            obj.EndDate__c   = this.domH.byId('LeaveEditConsumeEndDate').value;
            if(!obj.StartDate__c){
                this.showError(this.msgH.get('hg00001610'/*{0}を入力してください*/, this.msgH.get('hg00001340'/*消化開始日*/)));
                return;
            }
            if(!obj.EndDate__c){
                this.showError(this.msgH.get('hg00001610'/*{0}を入力してください*/, this.msgH.get('hg00001350'/*消化終了日*/)));
                return;
            }
            if(obj.StartDate__c > obj.EndDate__c){
                this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001850'/*消化期間*/)));
                return;
            }
            obj.ExcludeDate__c = this.domH.byId('LeaveEditConsumeExcludeDate').value.trim() || null;
        }else{
            if(document.querySelector('#LeaveEditConsumeStartDate:invalid')){
                this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001360'/*消化日*/)));
                return;
            }
            obj.StartDate__c = this.domH.byId('LeaveEditConsumeStartDate').value;
            if(!obj.StartDate__c){
                this.showError(this.msgH.get('hg00001610'/*{0}を入力してください*/, this.msgH.get('hg00001360'/*消化日*/)));
                return;
            }
            obj.EndDate__c = obj.StartDate__c;
            obj.ExcludeDate__c = null;
        }
        if(!Util.checkDateRange(obj.StartDate__c, 'S')){
            this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001360'/*消化日*/)));
            return;
        }
        // 消化日数・時間
        const checkHourly = this.domH.byId('LeaveEditConsumeHourly').checked;
        if(checkHourly){
            obj.ConsumeDays__c    = 0;
            obj.ConsumeTime__c    = Util.parseHmm(this.domH.byId('LeaveEditConsumeConsumeTime').value) || 0;
            if(!obj.ConsumeTime__c){
                this.showError(this.msgH.get('hg00001610'/*{0}を入力してください*/, this.msgH.get('hg00001380'/*消化時間*/)));
                return;
            }
            obj.HourlyPaidLeaveFlag__c = true;
        }else{
            const consumeDays = this.domH.byId('LeaveEditConsumeConsumeDays').value;
            obj.ConsumeDays__c    = parseFloat(consumeDays || '0');
            obj.ConsumeTime__c    = 0;
            if(!obj.ConsumeDays__c){
                this.showError(this.msgH.get('hg00001610'/*{0}を入力してください*/, this.msgH.get('hg00001040'/*消化日数*/)));
                return;
            }
            obj.HourlyPaidLeaveFlag__c = false;
        }
        if(obj.ConsumeDays__c >= 100){
            this.showError(this.msgH.get('hg00002020'/*日数の整数部分は2桁以内で入力してください*/));
            return;
        }
        // 説明
        obj.Description__c    = this.domH.byId('LeaveEditConsumeDescription').value;

        // 期間と日数の整合性をチェックする
        const daysByRange = this.getConsumeDaysByDateRange(obj);
        if(daysByRange.message){
            this.showError(daysByRange.message);
            return;
        }
        if((obj.StartDate__c < obj.EndDate__c && (obj.ConsumeTime__c || daysByRange.days != obj.ConsumeDays__c))
        || (obj.StartDate__c == obj.EndDate__c && obj.ConsumeDays__c > 1)){
            this.showError(this.msgH.get('hg00001510'/*期間と消化日数が整合しません*/));
            return;
        }
        // 代休の場合
        if(holidayGroup.isTypeS()){ // 代休
            if(obj.ConsumeTime__c || obj.ConsumeDays__c > 1){
                this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001040'/*消化日数*/)));
                return;
            }
        }
        // 時間単位休
        if(checkHourly){
            const t = (holidayGroup.isTypeA() ? obj.ConsumeTime__c : (obj.ConsumeTime__c * 2));
            const decimal = new Decimal(t / 60);
            if(!decimal.isInteger()){
                this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001380'/*消化時間*/)));
                return;
            }
        }
        // 登録
        const req = {
            action: 'operateEmpLeaveManage',
            operateType: 'consume',
            empId: this.empId,
            empLeaveManageId: (this.empLeaveManage && this.empLeaveManage.getId()) || null,
            allowMinus: this.domH.byId('LeaveEditConsumeAllowMinus').checked,
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