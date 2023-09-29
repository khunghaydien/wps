import {BaseDialog}     from "../../_common/BaseDialog.js?v=XVERSIONX";
import {Util}           from "../../_common/Util.js?v=XVERSIONX";
/**
 * マイナス付与編集ダイアログ
 */
export class EditMinus extends BaseDialog {
    constructor(tsaMain, leaveManager, viewParam){
        super(tsaMain, viewParam);
        this.leaveManager = leaveManager;
        this.empId = viewParam.empId;
        this.holidayGroupId = viewParam.holidayGroupId;
        this.empLeaveManage = viewParam.empLeaveManage;
        this.remains = viewParam.remains;
        this.empLeaveManages = [];
    }
    /**
     * 画面生成
     */
    buildContent(){
        super.buildContent();
        this.buildHolidayGroups(this.holidayGroupId);
        this.changeHolidayGroup();
        this.setInitValue();
        this.domH.setAttr('LeaveEditMinusHolidayGroup', 'disabled', (this.empLeaveManage ? true : false));
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
                                <select id="LeaveEditMinusHolidayGroup" style="max-width:270px;"></select>
                            </td>
                        </tr>
                        <tr>
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001050'/*マイナス対象*/)}</td>
                            <td>
                                <select id="LeaveEditMinusMinusSelect" style="min-width:100px;max-width:270px;"></select>
                                <span id="LeaveEditMinusMinusNone" style="display:none;">${this.msgH.get('hg00001940'/*マイナス対象となるデータはありません*/)}</span>
                            </td>
                        </tr>
                        <tr style="display:none;" id="LeaveEditMinusRemainRow">
                            <td></td>
                            <td id="LeaveEditMinusRemain">
                            </td>
                        </tr>
                        <tr>
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001360'/*消化日*/)}</td>
                            <td>
                                <input type="date" value="" id="LeaveEditMinusStartDate"  style="text-align:center;" />
                            </td>
                        </tr>
                        <tr>
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001040'/*消化日数*/)}</td>
                            <td>
                                <input type="text" value="" id="LeaveEditMinusConsumeDays"	maxLength="4" style="width:30px;text-align:right;" />
                                <div class="tsa-leave-field-name" style="display:inline-block;margin:0px 8px;">${this.msgH.get('hg00001380'/*消化時間*/)}</div>
                                <input type="text" value="" id="LeaveEditMinusConsumeTime"	maxLength="5" style="width:40px;text-align:right;" />
                            </td>
                        </tr>
                        <tr>
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001080'/*説明*/)}</td>
                            <td>
                                <input type="text" value="" id="LeaveEditMinusDescription" style="width:360px;text-align:left;" maxLength="255" />
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div style="margin-left:6px;margin-top:6px;display:none;">
                    <label><input type="checkbox" id="LeaveEditMinusAllowMinus" style="vertical-align:middle;" /> ${this.msgH.get('hg00001440'/*過消化を許容する*/)}</label>
                </div>
                <div style="margin-top:6px;" id="LeaveEditMinusError">
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
        this.setListenerKey(0, this.domH.addListener('LeaveEditMinusHolidayGroup', 'change', () => { this.changeHolidayGroup(); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditMinusConsumeDays', 'change', (e) => { this.changeDays(e); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditMinusConsumeTime', 'change', (e) => { this.changeTime(e); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditMinusMinusSelect', 'change', (e) => { this.changeMinusTarget(e); }));
    }
    /**
     * 休暇グループの選択リストをセット
     */
    buildHolidayGroups(defaultId){
        const select = this.domH.byId('LeaveEditMinusHolidayGroup');
        this.domH.empty(select);
        let exist = false;
        // 日数管理かつ時間単位有休制限以外の休暇グループをプルダウンにセット
        this.leaveManager.getManageGroups(true).forEach((hg) => {
            this.domH.create('option', { textContent:hg.getName(), value:hg.getId() }, select);
            if(hg.getId() == defaultId){
                exist = true;
            }
        });
        if(exist){
            select.value = defaultId;
        }
    }
    /**
     * 初期値セット
     */
    setInitValue(){
        if(this.empLeaveManage){
            this.domH.byId('LeaveEditMinusHolidayGroup').value = this.empLeaveManage.getHolidayGroupId(); // 休暇グループ
            this.domH.byId('LeaveEditMinusStartDate'  ).value = this.empLeaveManage.getStartDate(); // 消化日
            this.domH.byId('LeaveEditMinusConsumeDays').value = this.empLeaveManage.getConsumeDays(); // 消化日数
            this.domH.byId('LeaveEditMinusConsumeTime').value = this.empLeaveManage.getConsumeTime(true); // 消化時間
            this.domH.byId('LeaveEditMinusDescription').value = this.empLeaveManage.getDescription(); // 説明
        }else{
            this.domH.byId('LeaveEditMinusStartDate'  ).value = '';
            this.domH.byId('LeaveEditMinusConsumeDays').value = '0';
            this.domH.byId('LeaveEditMinusConsumeTime').value = '0:00';
        }
    }
    /**
     * マイナス対象の選択リストをセット
     */
    loadMinusTarget(){
        this.showError(null);
        this.empLeaveManages = [];
        const holidayGroupId = this.domH.byId('LeaveEditMinusHolidayGroup').value;
        const remainParam = (this.remains && this.remains[holidayGroupId]) || null;
        if(remainParam){
            const remainOverallDetail = remainParam.remainOverallDetail || {};
            Object.keys(remainOverallDetail).forEach((key) => {
                (remainParam.empLeaveManages || []).forEach((elm) => {
                    if(elm.Id == key){
                        elm.selectName = Util.formatDaysAndHours(elm.ProvideDays__c || 0, elm.ProvideTime__c || 0)
                        + `（${Util.formatDate(elm.StartDate__c, 'YYYY/MM/DD')}～${Util.formatDate(elm.EndDate__c, 'YYYY/MM/DD')}）`;
                        this.empLeaveManages.push(elm);
                    }
                });
            });
        }
        const select = this.domH.byId('LeaveEditMinusMinusSelect');
        this.domH.empty(select);
        this.domH.create('option', { textContent:'', value:'' }, select);
        let cnt = 0;
        this.empLeaveManages.forEach((elm) => {
            this.domH.create('option', { textContent:elm.selectName, value:elm.Id }, select);
            cnt++;
        });
        // 編集モードの場合、選択リストにマイナス対象が存在するかチェックし、なければ作って選択リストにセットする
        if(this.empLeaveManage && this.empLeaveManage.getAdjustTargetId()){
            this.domH.setStyle('LeaveEditMinusMinusSelect', 'display', '');
            const atId = this.empLeaveManage.getAdjustTargetId();
            if(!this.findEmpLeaveManagesById(this.empLeaveManages, atId)){
                this.empLeaveManages.push({
                    Id: atId,
                    StartDate__c: this.empLeaveManage.getAdjustTargetStartDate('YYYY-MM-DD'),
                    EndDate__c: this.empLeaveManage.getAdjustTargetEndDate('YYYY-MM-DD')
                });
                this.domH.create('option', { textContent:this.empLeaveManage.getAdjustTargetName(), value:atId }, select);
            }
            select.value = atId;
            // 編集モードではマイナス対象は非活性にする
            this.domH.setAttr(select, 'disabled', (remainParam ? false : true));
        }else{
            this.domH.setStyle('LeaveEditMinusMinusSelect', 'display', (cnt > 0 ? '' : 'none'));
            this.domH.setStyle('LeaveEditMinusMinusNone'  , 'display', (cnt > 0 ? 'none' : ''));
        }
        this.changeMinusTarget();
    }
    /**
     * 付与データリストの中にマイナス対象が存在したら返す
     * @param {Array.<Object>} empLeaveManages 
     * @param {string} id 
     * @returns {object|null}
     */
    findEmpLeaveManagesById(empLeaveManages, id){
        const elms = empLeaveManages.filter((elm) => { return elm.Id == id; });
        return elms.length ? elms[0] : null;
    }
    /**
     * マイナス対象の有効期間内に日付が入るかを返す
     * @param {string} targetId マイナス対象ID
     * @param {string} d  YYYY-MM-DD
     * @returns 
     */
    checkConsumedDate(targetId, d){
        const elm = this.findEmpLeaveManagesById(this.empLeaveManages, targetId);
        if(elm){
            if(d < elm.StartDate__c || elm.EndDate__c < d){
                return false;
            }
        }
        return true;
    }
    /**
     * 休暇グループを変更
     */
    changeHolidayGroup(){
        this.showError(null);
        this.loadMinusTarget();
    }
    /**
     * マイナス対象を変更
     */
    changeMinusTarget(){
        this.showError(null);
        const targetId = this.domH.byId('LeaveEditMinusMinusSelect').value;
        const elm = (targetId ? this.findEmpLeaveManagesById(this.empLeaveManages, targetId) : null);
        this.domH.byId('LeaveEditMinusStartDate').value = (elm ? elm.StartDate__c : '');
        this.showRemain();
    }
    /**
     * 選択されたマイナス対象の残日数を表示
     * ※編集モードでは表示しない
     */
    showRemain(){
        if(this.empLeaveManage){
            return;
        }
        let remainDisplay = null;
        const targetId = this.domH.byId('LeaveEditMinusMinusSelect').value;
        const holidayGroupId = this.domH.byId('LeaveEditMinusHolidayGroup').value;
        const remainParam = (this.remains && this.remains[holidayGroupId]) || null;
        if(remainParam){
            const remainOverallDetail = remainParam.remainOverallDetail || {};
            const remainValue = remainOverallDetail[targetId];
            if(remainValue){
                remainDisplay = Util.formatDaysAndHours(remainValue.days, remainValue.minutes);
            }
        }
        this.domH.byId('LeaveEditMinusRemain').textContent = (remainDisplay ? this.msgH.get('hg00001960'/*残日数 {0}*/, remainDisplay) : '');
        this.domH.setStyle('LeaveEditMinusRemainRow', 'display', (remainDisplay ? '' : 'none'));
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
    /**
     * エラー表示
     * @param {string|null} message nullの場合はクリア
     */
    showError(message){
        super.showError({
            message: message,
            nodeId: 'LeaveEditMinusError'
        });
    }
    /**
     * 登録
     */
    ok(){
        this.showError(null);
        const obj = (this.empLeaveManage ? this.empLeaveManage.clone() : {});
        delete obj.CreatedDate;
        delete obj.LastModifiedDate;

        if(!this.empLeaveManage){ // 新規登録
            // 休暇グループのチェック
            const select = this.domH.byId('LeaveEditMinusHolidayGroup');
            const holidayGroup = this.leaveManager.getHolidayGroupById(select.value);
            if(!holidayGroup){
                this.showError(this.msgH.get('hg00001600'/*{0}を選択してください*/, this.msgH.get('hg00001180')/*休暇グループ*/));
                return;
            }
            obj.HolidayGroupId__c = holidayGroup.getId();
            // マイナス対象のチェック
            obj.AdjustTargetId__c = this.domH.byId('LeaveEditMinusMinusSelect').value;
            if(!obj.AdjustTargetId__c){
                this.showError(this.msgH.get('hg00001600'/*{0}を選択してください*/, this.msgH.get('hg00001050'/*マイナス対象*/)));
                return;
            }
        }
        // 消化日のチェック
        if(document.querySelector('#LeaveEditMinusStartDate:invalid')){
            this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001360'/*消化日*/)));
            return;
        }
        obj.StartDate__c = this.domH.byId('LeaveEditMinusStartDate').value;
        if(!obj.StartDate__c){
            this.showError(this.msgH.get('hg00001610'/*{0}を入力してください*/, this.msgH.get('hg00001360'/*消化日*/)));
            return;
        }
        if(!this.checkConsumedDate(obj.AdjustTargetId__c, obj.StartDate__c)){
            this.showError(this.msgH.get('hg00001910'/*消化日にはマイナス対象の有効期間内の日付を入力してください*/));
            return;
        }
        // if(!Util.checkDateRange(obj.StartDate__c, 'S')){
        //     this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001360'/*消化日*/)));
        //     return;
        // }
        obj.EndDate__c = obj.StartDate__c; // マイナス付与では有効終了日と有効開始日は同じ
        // 消化日数・消化時間のチェック
        const consumeDays = this.domH.byId('LeaveEditMinusConsumeDays').value;
        obj.ConsumeDays__c    = parseFloat(consumeDays || '0');
        obj.ConsumeTime__c    = Util.parseHmm(this.domH.byId('LeaveEditMinusConsumeTime').value) || 0;
        if(!obj.ConsumeDays__c && !obj.ConsumeTime__c){
            this.showError(this.msgH.get('hg00001460'/*消化日数または消化時間を入力してください*/));
            return;
        }
        if(obj.ConsumeDays__c >= 100){
            this.showError(this.msgH.get('hg00002020'/*日数の整数部分は2桁以内で入力してください*/));
            return;
        }
        obj.Description__c    = this.domH.byId('LeaveEditMinusDescription').value || null;
        // マイナス付与実行
        const req = {
            action: 'operateEmpLeaveManage',
            operateType: 'consume',
            empId: this.empId,
            empLeaveManageId: (this.empLeaveManage && this.empLeaveManage.getId()) || null,
            allowMinus: this.domH.byId('LeaveEditMinusAllowMinus').checked,
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