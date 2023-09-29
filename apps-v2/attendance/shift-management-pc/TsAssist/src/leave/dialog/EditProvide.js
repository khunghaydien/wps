import {BaseDialog}     from "../../_common/BaseDialog.js?v=XVERSIONX";
import {Util}           from "../../_common/Util.js?v=XVERSIONX";
/**
 * 付与データ編集ダイアログ
 */
export class EditProvide extends BaseDialog {
    constructor(tsaMain, leaveManager, viewParam){
        super(tsaMain, viewParam);
        this.leaveManager = leaveManager;
        this.empId = viewParam.empId;
        this.empLeaveManage = viewParam.empLeaveManage;
        this.holidayGroupId = viewParam.holidayGroupId;
        this.periodLoaded = false;
    }
    /**
     * 画面生成
     */
    buildContent(){
        super.buildContent();
        this.buildHolidayGroups(this.holidayGroupId);
        this.setInitValue();
        this.changeHolidayGroup();
        this.domH.setAttr('LeaveEditProvideHolidayGroup', 'disabled', (this.empLeaveManage ? true : false));
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
                                <select id="LeaveEditProvideHolidayGroup" style="max-width:270px;"></select>
                            </td>
                        </tr>
                        <tr>
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001060'/*有効開始日*/)}</td>
                            <td>
                                <input type="date" value="" id="LeaveEditProvideStartDate"  style="text-align:center;" />
                                <div class="tsa-leave-end-option">
                                    <select id="LeaveEditProvideEndOption">
                                        <option value="0">${this.msgH.get('hg00001320'/*有効期間*/)}</option>
                                        <option value="1">${this.msgH.get('hg00001070'/*有効終了日*/)}</option>
                                    </select>
                                </div>
                                <select id="LeaveEditProvideTerm">
                                    <option value="y2">${this.msgH.get('hg00001560'/*{0}年*/, 2)}</option>
                                    <option value="y1">${this.msgH.get('hg00001560'/*{0}年*/, 1)}</option>
                                    <option value="M6">${this.msgH.get('hg00001570'/*{0}年*/, 6)}</option>
                                    <option value="M3">${this.msgH.get('hg00001570'/*{0}年*/, 3)}</option>
                                    <option value="M2">${this.msgH.get('hg00001570'/*{0}年*/, 2)}</option>
                                    <option value="M1">${this.msgH.get('hg00001570'/*{0}年*/, 1)}</option>
                                </select>
                                <input type="date" value="" id="LeaveEditProvideEndDate"    style="text-align:center;" />
                            </td>
                        </tr>
                        <tr>
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001030'/*付与日数*/)}</td>
                            <td>
                                <input type="text" value="" id="LeaveEditProvideProvideDays"	maxLength="4" style="width:30px;text-align:right;" />
                                <div class="tsa-leave-field-name" style="display:inline-block;margin:0px 8px;">${this.msgH.get('hg00001370'/*付与時間*/)}</div>
                                <input type="text" value="" id="LeaveEditProvideProvideTime"	maxLength="5" style="width:40px;text-align:right;" />
                            </td>
                        </tr>
                        <tr>
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001080'/*説明*/)}</td>
                            <td>
                                <input type="text" value="" id="LeaveEditProvideDescription" style="width:360px;text-align:left;" maxLength="255" />
                            </td>
                        </tr>
                        <tr class="tsa-group-type-a">
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001090'/*付与形態*/)}</td>
                            <td style="vertical-align:middle;">
                                <div>
                                    <label><input type="radio" name="ProvidePeriodic" id="LeaveEditProvidePeriodicOff" />${this.msgH.get('hg00001100'/*臨時付与*/)}</label>
                                    <label><input type="radio" name="ProvidePeriodic" id="LeaveEditProvidePeriodicOn"  />${this.msgH.get('hg00001110'/*定期付与*/)}</label>
                                </div>
                            </td>
                        </tr>
                        <tr class="tsa-group-type-a">
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001120'/*実付与日数*/)}</td>
                            <td>
                                <input type="text" value="" id="LeaveEditProvideRealProvideDays" style="width:30px;text-align:right;" maxLength="4" />
                            </td>
                        </tr>
                        <tr class="tsa-group-type-a">
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001130'/*取得義務判定対象*/)}</td>
                            <td>
                                <label><input type="checkbox" id="LeaveEditProvideNotObligatory" />${this.msgH.get('hg00001140'/*対象外とする*/)}</label>
                            </td>
                        </tr>
                        <tr class="tsa-group-type-s" style="display:none;">
                            <td class="tsa-leave-field-name">${this.msgH.get('hg00001400'/*日タイプ*/)}</td>
                            <td style="vertical-align:middle;">
                                <select id="LeaveEditProvideDayType">
                                    <option value="1"> ${this.msgH.get('hg00001410'/*1（所定休日）*/)}</option>
                                    <option value="2"> ${this.msgH.get('hg00001420'/*2（法定休日）*/)}</option>
                                    <option value="3"> ${this.msgH.get('hg00001430'/*3（祝日）*/)}</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div style="margin-left:6px;margin-top:6px;display:none;" id="LeaveEditProvideAllowMinusRow">
                    <label><input type="checkbox" id="LeaveEditProvideAllowMinus" style="vertical-align:middle;" /> ${this.msgH.get('hg00001440'/*過消化を許容する*/)}</label>
                </div>
                <div style="margin-top:6px;" id="LeaveEditProvideError">
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
        this.setListenerKey(0, this.domH.addListener('LeaveEditProvideHolidayGroup', 'change', () => { this.changeHolidayGroup(); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditProvideProvideDays', 'change', (e) => { this.changeDays(e); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditProvideRealProvideDays', 'change', (e) => { this.changeDays(e); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditProvideProvideTime', 'change', (e) => { this.changeTime(e); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditProvideEndOption', 'change', (e) => { this.changeEndOption(e); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditProvideTerm', 'change', (e) => { this.changeTerm(e); }));
        this.setListenerKey(0, this.domH.addListener('LeaveEditProvideStartDate', 'input', (e) => { this.changeTerm(e); }));
    }
    /**
     * 休暇グループの選択リストをセット
     * @param defaultId 初期値の休暇グループID
     */
    buildHolidayGroups(defaultId){
        const select = this.domH.byId('LeaveEditProvideHolidayGroup');
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
            this.domH.byId('LeaveEditProvideHolidayGroup').value = this.empLeaveManage.getHolidayGroupId();
            this.domH.byId('LeaveEditProvideStartDate'  ).value = this.empLeaveManage.getStartDate(); // 有効開始日
            this.domH.byId('LeaveEditProvideEndDate'    ).value = this.empLeaveManage.getEndDate();   // 有効終了日
            this.domH.byId('LeaveEditProvideProvideDays').value = this.empLeaveManage.getProvideDays(); // 付与日数
            this.domH.byId('LeaveEditProvideProvideTime').value = this.empLeaveManage.getProvideTime(true); // 付与時間
            this.domH.byId('LeaveEditProvideDescription').value = this.empLeaveManage.getDescription(); // 説明
            this.domH.byId('LeaveEditProvidePeriodicOff').checked = !this.empLeaveManage.isPeriodic(); // 付与形態
            this.domH.byId('LeaveEditProvidePeriodicOn' ).checked = this.empLeaveManage.isPeriodic(); // 付与形態
            this.domH.byId('LeaveEditProvideRealProvideDays').value = this.empLeaveManage.getRealProvideDays(); // 実付与日数
            this.domH.byId('LeaveEditProvideNotObligatory').checked = this.empLeaveManage.isNotObligatoryFlag(); // 取得義務判定対象の対象外とする
            this.domH.byId('LeaveEditProvideDayType').value = this.empLeaveManage.getDayType();
            this.domH.byId('LeaveEditProvideEndOption').value = '1';
            this.domH.setStyle('LeaveEditProvideTerm'   , 'display', 'none');
        }else{
            this.domH.byId('LeaveEditProvideProvideDays').value = '0';
            this.domH.byId('LeaveEditProvideProvideTime').value = '0:00';
            this.domH.byId('LeaveEditProvidePeriodicOff').checked = true;
            this.domH.byId('LeaveEditProvideEndOption').value = '0';
            this.domH.setStyle('LeaveEditProvideEndDate', 'display', 'none');
            this.domH.setStyle('LeaveEditProvideAllowMinusRow', 'display', 'none');
        }
    }
    /**
     * 休暇グループ変更
     */
    changeHolidayGroup(){
        this.showError(null);
        const select = this.domH.byId('LeaveEditProvideHolidayGroup');
        const holidayGroup = this.leaveManager.getHolidayGroupById(select.value);
        this.getTopNode().querySelectorAll('.tsa-group-type-a').forEach((el) => {
            this.domH.setStyle(el, 'display', (holidayGroup && holidayGroup.isTypeA() ? '' : 'none'));
        });
        // this.getTopNode().querySelectorAll('.tsa-group-type-s').forEach((el) => {
        //     this.domH.setStyle(el, 'display', (holidayGroup && holidayGroup.isTypeS() ? '' : 'none'));
        // });
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
     * 有効期間・有効終了日・失効日の切り替え
     */
    changeEndOption(){
        this.showError(null);
        const endOption = this.domH.byId('LeaveEditProvideEndOption').value;
        this.domH.setStyle('LeaveEditProvideTerm'   , 'display', (endOption == '0' ? '' : 'none'));
        this.domH.setStyle('LeaveEditProvideEndDate', 'display', (endOption == '0' ? 'none' : ''));
    }
    /**
     * 有効期間の変更
     */
    changeTerm(){
        this.showError(null);
        if(this.domH.byId('LeaveEditProvideEndOption').value != '0'){ // 「有効期間」選択中ではない
            return;
        }
        const sd = this.domH.byId('LeaveEditProvideStartDate').value;
        if(!sd || document.querySelector('#LeaveEditProvideStartDate:invalid')){ // 有効開始日が未入力か不正なら終了
            return;
        }
        this.domH.byId('LeaveEditProvideEndDate').value = this.getAddTermDate(sd);
    }
    getAddTermDate(sd){
        // 有効開始日に有効期間を加算した日付を有効終了日にセット
        const m = /^(.)(\d+)$/.exec(this.domH.byId('LeaveEditProvideTerm').value);
        if(m){
            // 有効開始日
            const key = m[1];
            const term = parseInt(m[2], 10);
            return moment(sd, 'YYYY-MM-DD').add(term, key).add(-1, 'd').format('YYYY-MM-DD');
        }
        return '';
    }
    /**
     * エラー表示
     * @param {string|null} message nullの場合はクリア
     */
    showError(message){
        super.showError({
            message: message,
            nodeId: 'LeaveEditProvideError'
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
        obj.AdjustYear__c      = null;
        obj.AdjustYearSubNo__c = null;
        obj.Periodic__c        = false;
        obj.RealProvideDays__c = null;
        obj.DayType__c         = null;
        // 休暇グループ
        const select = this.domH.byId('LeaveEditProvideHolidayGroup');
        const holidayGroup = this.leaveManager.getHolidayGroupById(select.value);
        if(!holidayGroup){
            this.showError(this.msgH.get('hg00001600'/*{0}を選択してください*/, this.msgH.get('hg00001180')/*休暇グループ*/));
            return;
        }
        obj.HolidayGroupId__c = holidayGroup.getId();
        // 期間
        if(document.querySelector('#LeaveEditProvideStartDate:invalid')){
            this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001060'/*有効開始日*/)));
            return;
        }
        obj.StartDate__c = this.domH.byId('LeaveEditProvideStartDate').value;
        if(!obj.StartDate__c){
            this.showError(this.msgH.get('hg00001610'/*{0}を入力してください*/, this.msgH.get('hg00001060'/*有効開始日*/)));
            return;
        }
        const endOption = this.domH.byId('LeaveEditProvideEndOption').value;
        if(endOption == '0'){ // 有効期間
            obj.EndDate__c = this.getAddTermDate(obj.StartDate__c);
        }else{ // 有効終了日または失効日
            if(document.querySelector('#LeaveEditProvideEndDate:invalid')){
                this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get(endOption == '2' ? 'hg00001020' : 'hg00001070'/*失効日 : 有効終了日*/)));
                return;
            }
            obj.EndDate__c   = this.domH.byId('LeaveEditProvideEndDate').value;
            if(!obj.EndDate__c){
                this.showError(this.msgH.get('hg00001610'/*{0}を入力してください*/, this.msgH.get(endOption == '2' ? 'hg00001020' : 'hg00001070'/*失効日 : 有効終了日*/)));
                return;
            }
            if(endOption == '2'){ // 失効日
                obj.EndDate__c = moment(obj.EndDate__c, 'YYYY-MM-DD').add(-1, 'd').format('YYYY-MM-DD');
            }
            if(obj.StartDate__c > obj.EndDate__c){
                this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001320'/*有効期間*/)));
                return;
            }
        }
        // 有効開始日をチェック
        if(!Util.checkDateRange(obj.StartDate__c, 'S')){
            this.showError(this.msgH.get('hg00001590'/*{0}が不正です*/, this.msgH.get('hg00001060'/*有効開始日*/)));
            return;
        }
        // 付与日数・時間
        const provideDays = this.domH.byId('LeaveEditProvideProvideDays').value;
        obj.ProvideDays__c    = parseFloat(provideDays || '0');
        obj.ProvideTime__c    = Util.parseHmm(this.domH.byId('LeaveEditProvideProvideTime').value) || 0;
        if(!obj.ProvideDays__c && !obj.ProvideTime__c){
            this.showError(this.msgH.get('hg00001450'/*付与日数または付与時間を入力してください*/));
            return;
        }
        if(obj.ProvideDays__c >= 100){
            this.showError(this.msgH.get('hg00002020'/*日数の整数部分は2桁以内で入力してください*/));
            return;
        }
        // 説明
        obj.Description__c    = this.domH.byId('LeaveEditProvideDescription').value || null;
        if(holidayGroup.isTypeA()){ // 年次有給休暇
            obj.Periodic__c       = this.domH.byId('LeaveEditProvidePeriodicOn').checked; // 定期付与
            const realProvideDays = this.domH.byId('LeaveEditProvideRealProvideDays').value; // 実付与日数
            obj.RealProvideDays__c = (realProvideDays ? parseFloat(realProvideDays) : null);
            obj.NotObligatoryFlag__c = this.domH.byId('LeaveEditProvideNotObligatory').checked; // 取得義務判定対象外フラグ
            if(obj.RealProvideDays__c !== null && obj.RealProvideDays__c >= 100){
                this.showError(this.msgH.get('hg00002020'/*日数の整数部分は2桁以内で入力してください*/));
                return;
            }
        }
        if(holidayGroup.isTypeS()){ // 代休
            obj.DayType__c = this.domH.byId('LeaveEditProvideDayType').value; // 日タイプ
        }
        // 登録
        const req = {
            action: 'operateEmpLeaveManage',
            operateType: 'provide',
            empId: this.empId,
            empLeaveManageId: (this.empLeaveManage && this.empLeaveManage.getId()) || null,
            allowMinus: this.domH.byId('LeaveEditProvideAllowMinus').checked,
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