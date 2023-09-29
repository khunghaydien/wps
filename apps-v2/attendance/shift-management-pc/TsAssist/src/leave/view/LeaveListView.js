import {BaseView}              from "../../_common/BaseView.js?v=XVERSIONX";
import {Util}                  from "../../_common/Util.js?v=XVERSIONX";
import {EditProvide}           from "../dialog/EditProvide.js?v=XVERSIONX";
import {EditConsume}           from "../dialog/EditConsume.js?v=XVERSIONX";
import {EditMinus}             from "../dialog/EditMinus.js?v=XVERSIONX";
import {ChangePeriod}          from "../dialog/ChangePeriod.js?v=XVERSIONX";
import {ChangeNextProvideDate} from "../dialog/ChangeNextProvideDate.js?v=XVERSIONX";
import {DeleteEmpLeaveManage}  from "../dialog/DeleteEmpLeaveManage.js?v=XVERSIONX";
import {AdjustHourlyPaidLeave} from "../dialog/AdjustHourlyPaidLeave.js?v=XVERSIONX";
import {EmpLeaveManages}       from "../obj/EmpLeaveManages.js?v=XVERSIONX";
import {MonthlyLeaveBalances}  from "../obj/MonthlyLeaveBalances.js?v=XVERSIONX";
import {HourlyLeavePeriods}    from "../obj/HourlyLeavePeriods.js?v=XVERSIONX";

/**
 * 休暇管理画面
 */
export class LeaveListView extends BaseView {
    constructor(leaveMain, viewParam){
        super(leaveMain.tsaMain, viewParam);
        this.leaveMain = leaveMain;
        this.viewMode = 0;
        this.empId = viewParam.empId;
        this.holidayGroupId = viewParam.holidayGroupId;
        this.empLeaveManages = new EmpLeaveManages(); // 社員休暇管理データを保持するクラス
        this.monthlyLeaveBalances = new MonthlyLeaveBalances(); // 月次休暇残高データを保持するクラス
        this.hourlyLeavePeriods = new HourlyLeavePeriods(this.tsaMain, this.leaveManager, this.empId); // 時間単位有休の年度の期間
        this.pcTypeDisp = {
            'P':this.msgH.get('hg00001000'/*付与*/),
            'C':this.msgH.get('hg00001010'/*消化*/)
        };
        this.holidayRangeDisp = {
            '1':this.msgH.get('hg00001860'/*終日休*/),
            '2':this.msgH.get('hg00001870'/*午前半休*/),
            '3':this.msgH.get('hg00001880'/*午後半休*/),
            '4':this.msgH.get('hg00001890'/*時間単位休*/)
        };
        // 休暇履歴表（社員休暇管理）のフィールド情報
        this.leaveFields = [
            { label:''                 , width: 34, align:'center', editBtn:true },
            { label:''                 , width: 34, align:'center', deleteBtn:true },
            { label:this.msgH.get('hg00001180'/*休暇グループ*/)     , width:150, align:'left'  , title:true },
            { label:this.msgH.get('hg00001620'/*入払<br/>区分*/)    , width: 30, align:'center' },
            { label:this.msgH.get('hg00001060'/*有効開始日*/)       , width: 76, align:'center' },
            { label:this.msgH.get('hg00001070'/*有効終了日*/)       , width: 76, align:'center' },
            { label:this.msgH.get('hg00001630'/*付与<br/>日数*/)    , width: 40, widthe: 60, align:'right'  },
            { label:this.msgH.get('hg00001640'/*付与<br/>時間*/)    , width: 40, widthe: 60, align:'right'  },
            { label:this.msgH.get('hg00001650'/*消化<br/>日数*/)    , width: 40, widthe: 60, align:'right'  },
            { label:this.msgH.get('hg00001660'/*消化<br/>時間*/)    , width: 40, widthe: 60, align:'right'  },
            { label:this.msgH.get('hg00001800'/*説明等*/)           , width:300, align:'left'  , title:true },
            { label:this.msgH.get('hg00001810'/*休暇型*/)           , width: 80, align:'left'   },
            { label:this.msgH.get('hg00001760'/*定期<br/>付与*/)    , width: 50, align:'center' },
            { label:this.msgH.get('hg00001770'/*取得<br/>義務外*/)  , width: 50, align:'center' },
            { label:this.msgH.get('hg00001780'/*実付与<br/>日数*/)  , width: 50, align:'center' },
            { label:this.msgH.get('hg00001740'/*計画<br/>有休*/)    , width: 50, align:'center' },
            { label:this.msgH.get('hg00001390'/*対象年度*/)         , width: 60, align:'center', last:true }
        ];
        // 月次休暇残高表のフィールド情報
        this.monthlyFields = [
            { label:this.msgH.get('tk10000063'/*月度*/)             , width: 64, align:'left'  , link:true },
            { label:this.msgH.get('status_head'/*ステータス*/)      , width: 60, align:'center' },
            { label:this.msgH.get('hg00001790'/*基準<br/>時間*/)    , width: 40, align:'right'  },
            { label:this.msgH.get('hg00001180'/*休暇グループ*/)     , width:150, align:'left'  , title:true },
            { label:this.msgH.get('hg00001620'/*入払<br/>区分*/)    , width: 30, align:'center' },
            { label:this.msgH.get('hg00001060'/*有効開始日*/)       , width: 76, align:'center' },
            { label:this.msgH.get('hg00001070'/*有効終了日*/)       , width: 76, align:'center' },
            { label:this.msgH.get('hg00001670'/*月初残<br/>日数*/)  , width: 48, widthe: 60, align:'right'  },
            { label:this.msgH.get('hg00001680'/*月初残<br/>時間*/)  , width: 48, widthe: 60, align:'right'  },
            { label:this.msgH.get('hg00001650'/*消化<br/>日数*/)    , width: 40, widthe: 60, align:'right'  },
            { label:this.msgH.get('hg00001660'/*消化<br/>時間*/)    , width: 40, widthe: 60, align:'right'  },
            { label:this.msgH.get('hg00001690'/*月末残<br/>日数*/)  , width: 48, widthe: 60, align:'right'  },
            { label:this.msgH.get('hg00001700'/*月末残<br/>時間*/)  , width: 48, widthe: 60, align:'right'  },
            { label:this.msgH.get('hg00001150'/*失効*/)             , width: 40, widthe: 46, align:'center' },
            { label:this.msgH.get('hg00001710'/*過消化<br/>日数*/)  , width: 48, widthe: 60, align:'right'  },
            { label:this.msgH.get('hg00001720'/*過消化<br/>時間*/)  , width: 48, widthe: 60, align:'right'  },
            { label:this.msgH.get('hg00001730'/*制限外<br/>時間*/)  , width: 48, widthe: 60, align:'right'  },
            { label:this.msgH.get('hg00001800'/*説明等*/)           , width:300, align:'left'  , title:true },
            { label:this.msgH.get('hg00001810'/*休暇型*/)           , width: 80, align:'left'  , last:true }
        ];
    }
    // 休暇管理マネージャクラスインスタンスの参照
    get leaveManager(){ return this.leaveMain.leaveManager; }

    /**
     * 初期表示
     * @param {string} hash 
     */
    open(hash){
        super.open(hash);
        this.getParentNode().innerHTML = this.getContent(); // DOMを構築
        this.initListeners(); // イベントリスナセット
        this.setLabels(); // ラベルをセット
        this.setInitValue(); // 初期値セット
        this.changeViewMode(true); // 休暇履歴表を表示
    }
    /**
     * DOM
     * @returns {string}
     */
    getContent(){
        return `
            <div id="LeaveList">
                <div class="tsa-pankz" id="LeaveListPankz">
                </div>
                <div class="tsa-leave-list-title">
                    <div>${this.msgH.get('hg00001170'/*休暇管理*/)}</div>
                </div>
                <div class="tsa-error-main" style="display:none;"><div></div></div>
                <div class="tsa-panel1" style="margin:0px 8px;">
                    <table class="tsa-leave-emp-panel">
                        <tbody>
                            <tr>
                                <td class="tsa-leave-info-item">${this.msgH.get('empCode_label'/*社員コード*/)} </td><td class="tsa-leave-info-value" id="LeaveListEmpCode"></td>
                                <td class="tsa-leave-info-item">${this.msgH.get('empName_label'/*社員名*/)}     </td><td class="tsa-leave-info-value" id="LeaveListEmpName"></td>
                                <td class="tsa-leave-info-item">${this.msgH.get('empEntryDate_label'/*入社日*/)}</td><td class="tsa-leave-info-value" id="LeaveListEmpEntryDate"></td>
                            </tr>
                            <tr>
                                <td class="tsa-leave-info-item" colSpan="2" style="max-width:180px;">${this.msgH.get('hg00001260'/*年次有給休暇の次回付与予定日*/)}</td>
                                <td colSpan="2">
                                    <div id="LeaveListDisplayNextProvideDate" style="display:inline-block;min-width:90px;"></div>
                                    <input type="hidden" id="LeaveListNextProvideDate" />
                                    <div style="display:inline-block;">
                                        <button id="LeaveListChangeNextProvideDate" style="padding:1px 12px;">${this.msgH.get('LabelChange'/*変更*/)}</button>
                                    </div>
                                    <div style="display:inline-block;margin-left:16px;">
                                        <a style="text-decoration:underline;cursor:pointer;color:#0022cc;">${this.msgH.get('hg00002060'/*自動付与予定*/)}</a>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="margin-top:4px;">
                    <div class="tsa-panel1">
                        <div>
                            <button id="LeaveListProvide">${this.msgH.get('hg00001000'/*付与*/)}</button>
                        </div>
                        <div style="display:none;">
                            <button id="LeaveListMinus">${this.msgH.get('hg00001300'/*マイナス調整*/)}</button>
                        </div>
                        <div>
                            <button id="LeaveListHourlyLimit">${this.msgH.get('hg00001920'/*時間単位有休調整*/)}</button>
                        </div>
                        <div style="display:none;">
                            <button id="LeaveListConsume">${this.msgH.get('hg00001010'/*消化*/)}</button>
                        </div>
                        <div style="display:none;">
                            <button id="LeaveListInspect">${this.msgH.get('hg00001970'/*データチェック*/)}</button>
                        </div>
                    </div>
                </div>
                <div class="tsa-leave-contents">
                    <div class="tsa-panel1">
                        <div class="tsa-leave-item-name" style="width:100px;">
                            ${this.msgH.get('hg00001200'/*絞り込み*/)}
                        </div>
                        <div style="margin-right:20px;">
                            <span style="margin:0px 4px;" class="tsa-leave-item-name">${this.msgH.get('range_label'/*期間*/)}</span>
                            <div style="display:inline-block;margin:0px;min-width:160px;padding:0px 4px;border:1px solid gray;" id="LeaveListPeriod"></div>
                            <input type="hidden" id="LeaveListPeriodStart" />
                            <input type="hidden" id="LeaveListPeriodEnd" />
                            <button id="LeaveListChangePeriod">${this.msgH.get('hg00001160'/*期間変更*/)}</button>
                        </div>
                        <div style="margin-right:20px;">
                            <span style="margin:0px 4px;" class="tsa-leave-item-name">${this.msgH.get('hg00001180'/*休暇グループ*/)}</span>
                            <select id="LeaveListHolidayGroup" style="min-width:120px;max-width:270px;"></select>
                        </div>
                        <div style="margin-right:20px;">
                            <span style="margin:0px 4px;" class="tsa-leave-item-name">${this.msgH.get('hg00001190'/*入払区分*/)}</span>
                            <select id="LeaveListPcType" style="min-width:40px;" ></select>
                        </div>
                    </div>
                    <div class="tsa-panel1">
                        <div class="tsa-leave-item-name" style="width:100px;">
                            ${this.msgH.get('hg00001210'/*表示種類*/)}
                        </div>
                        <div style="margin-right:20px;">
                            <label><input type="radio" name="viewType" id="LeaveListNormal"  />${this.msgH.get('hg00001240'/*休暇履歴*/)}</label>
                        </div>
                        <div>
                            <label><input type="radio" name="viewType" id="LeaveListMonthly" />${this.msgH.get('hg00001250'/*月次休暇残高*/)}</label>
                        </div>
                        <div style="margin-left:100px;">
                            <button id="LeaveListCsvDL">${this.msgH.get('hg00002050'/*CSVダウンロード*/)}</button>
                        </div>
                    </div>
                </div>
                <div id="LeaveListTable" style="display:none;margin-top:4px;">
                    <table class="tsa-leave-table" style="margin-top:4px;">
                        <thead></thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `;
    }
    /**
     * イベントリスナーをセット
     */
    initListeners(){
        super.initListeners();
        this.setListenerKey(0, this.domH.addListener(window, 'resize', () => { this.windowResize(); }));
        this.setListenerKey(0, this.domH.addListener('LeaveListChangePeriod' , 'click', () => { this.changePeriod(); })); // 期間変更
        this.setListenerKey(0, this.domH.addListener('LeaveListHolidayGroup' , 'change', () => { this.rebuildTableBody(); })); // 休暇グループ変更
        this.setListenerKey(0, this.domH.addListener('LeaveListPcType' , 'change', () => { this.rebuildTableBody(); })); // 入払区分変更
        this.setListenerKey(0, this.domH.addListener('LeaveListNormal' , 'click', () => { this.changeViewMode(); })); // 休暇履歴
        this.setListenerKey(0, this.domH.addListener('LeaveListMonthly', 'click', () => { this.changeViewMode(); })); // 月次休暇履歴
        this.setListenerKey(0, this.domH.addListener('LeaveListProvide', 'click', () => { this.addProvide(); })); // 付与
        this.setListenerKey(0, this.domH.addListener('LeaveListConsume', 'click', () => { this.addConsume(); })); // 消化
        this.setListenerKey(0, this.domH.addListener('LeaveListMinus'  , 'click', () => { this.addMinus(); })); // マイナス付与
        this.setListenerKey(0, this.domH.addListener('LeaveListHourlyLimit', 'click', () => { this.adjustHourlyLimit(); })); // 時間単位有休調整
        this.setListenerKey(0, this.domH.addListener('LeaveListChangeNextProvideDate' , 'click', () => { this.changeNextProvideDate(); })); // 次回付与予定日の変更
        this.setListenerKey(0, this.domH.addListener('LeaveListInspect', 'click', () => { this.inspectData(); })); // データチェック
    }
    /**
     * 画面のルートのDOMを返す
     * @returns {DOM}
     */
    getTopNode(){
        return this.getParentNode();
    }
    /**
     * ラベルをセット
     */
    setLabels(){
        const emp = this.leaveManager.getEmpById(this.empId);
        this.domH.byId('LeaveListEmpCode').textContent = emp.getCode(); // 社員コード
        this.domH.byId('LeaveListEmpName').textContent = emp.getName(); // 社員名
        this.domH.byId('LeaveListEmpEntryDate').textContent = (emp.getEntryDate('YYYY/MM/DD') || '')
            + (emp.getEndDate() ? this.msgH.get('hg00001930'/*（退社日: {0}）*/, emp.getEndDate('YYYY/MM/DD')) : '');
    }
    /**
     * ウィンドウリサイズ
     */
    windowResize(){
        const tbody = this.getTableBody();
        if(tbody){
            const h = Math.max(window.innerHeight - tbody.getBoundingClientRect().y - 20, 100);
            tbody.style.maxHeight = h + 'px';
        }
    }
    /**
     * 初期値セット
     */
    setInitValue(){
        this.setPankz(); // パンくず作成
        this.buildHolidayGroups(this.holidayGroupId); // 休暇グループのプルダウンをセット
        this.buildPcType(); // 入払区分のプルダウンをセット
        this.domH.byId('LeaveListNormal').checked = true;

        const smd = moment().add(-1, 'y'); // 初期表示の期間の開始日を本日日付の1年前にセット
        this.domH.byId('LeaveListPeriodStart').value = smd.format('YYYY-MM-DD');
        this.domH.byId('LeaveListPeriodEnd').value = '';
        this.displayPeriod(); // 期間を表示

        const emp = this.leaveManager.getEmpById(this.empId);
        this.domH.byId('LeaveListNextProvideDate').value = emp.getNextYuqProvideDate() || '';
        this.displayNextProvideDate(); // 次回付与予定日を表示
    }
    /**
     * パンくずを作成
     */
    setPankz(){
        // アドレス欄の retURL を解析する。入れ子の3つの'retURL'引数が取れるはず。
        // 取れない（社員設定画面から遷移してない）場合はパンくずを表示しない。
        const retURLs = this.leaveManager.parseRetURLs();
        if(retURLs.length == 3){
            const area = this.domH.byId('LeaveListPankz');
            const names = [
                this.msgH.get('hg00000900'/*管理メニュー*/),
                this.msgH.get('hg00000910'/*社員一覧*/),
                this.msgH.get('tk10000357'/*社員設定*/),
                this.msgH.get('hg00001170'/*休暇管理*/)
            ];
            for(let i = 0 ; i < retURLs.length ; i++){
                this.domH.create('a', { href: retURLs[i], textContent: names[i] }, area);
                this.domH.create('span', { textContent: ' > ' }, area);
            }
            this.domH.create('span', { textContent: names[names.length - 1] }, area);
        }
    }
    /**
     * 次回付与予定日を表示
     */
    displayNextProvideDate(){
        const d = this.domH.byId('LeaveListNextProvideDate').value;
        this.domH.byId('LeaveListDisplayNextProvideDate').textContent = (d ? Util.formatDate(d, 'YYYY/MM/DD') : '');
    }
    /**
     * 期間を表示
     */
    displayPeriod(){
        const sd = this.domH.byId('LeaveListPeriodStart').value;
        const ed = this.domH.byId('LeaveListPeriodEnd').value;
        this.domH.byId('LeaveListPeriod').textContent = (!sd && !ed ? this.msgH.get('hg00001230'/*全期間*/)
            : `${Util.formatDate(sd, 'YYYY/MM/DD')||''} ${this.msgH.get('wave_label'/*～*/)} ${Util.formatDate(ed, 'YYYY/MM/DD')||''}`);
    }
    /**
     * 休暇グループのプルダウンをセット
     * @param {string|null} holidayGroupId 初期値
     */
    buildHolidayGroups(holidayGroupId){
        const select = this.domH.byId('LeaveListHolidayGroup');
        this.domH.empty(select);
        this.domH.create('option', { textContent:this.msgH.get('all_label'/*すべて*/), value:'' }, select);
        this.leaveManager.getManageGroups().forEach((hg) => {
            this.domH.create('option', { textContent:hg.getName(), value:hg.getId() }, select);
        });
        select.value = holidayGroupId || '';
    }
    /**
     * 入払区分のプルダウンをセット
     */
    buildPcType(){
        const select = this.domH.byId('LeaveListPcType');
        this.domH.empty(select);
        this.domH.create('option', { textContent:this.msgH.get('all_label'/*すべて*/), value:''  }, select);
        this.domH.create('option', { textContent:this.msgH.get('hg00001000'/*付与*/) , value:'P' }, select);
        this.domH.create('option', { textContent:this.msgH.get('hg00001010'/*消化*/) , value:'C' }, select);
    }
    /**
     * 入払区分
     * @param {string} pcType 
     * @returns {string}
     */
    displayPcType(pcType){
        return this.pcTypeDisp[pcType] || '';
    }
    /**
     * 休暇型
     * @param {string|null} holidayRange 
     * @returns {string}
     */
    displayHolidayRange(holidayRange){
        return this.holidayRangeDisp[holidayRange] || '';
    }
    /**
     * テーブルボディ部を再表示する
     */
    rebuildTableBody(){
        if(this.isNormalViewMode()){
            this.buildLeaveTableBody();
        }else{
            this.buildMonthlyTableBody();
        }
    }
    /**
     * 表示種類＝休暇履歴
     * @returns {boolean}
     */
    isNormalViewMode(){
        return (this.viewMode == 0);
    }
    /**
     * 表示履歴＝月次休暇残高
     * @returns {boolean}
     */
    isMonthlyViewMode(){
        return (this.viewMode == 1);
    }
    /**
     * 表示種類が変更されたらtrueを返す。変更なければfalseを返す
     * @param {boolean=} flag true:変更してもしてなくてもtrueを返す
     * @returns {boolean}
     */
    isChangedViewMode(flag){
        const selectedMode = this.domH.byId('LeaveListNormal').checked ? 0 : (this.domH.byId('LeaveListMonthly').checked ? 1 : 2);
        if(!flag && this.viewMode == selectedMode){
            return false;
        }
        this.viewMode = selectedMode;
        return true;
    }
    /**
     * 表示種類を変更
     * @param {boolean=} flag true:変更してなくても変更した時の処理を行う
     * @returns 
     */
    changeViewMode(flag){
        if(!this.isChangedViewMode(flag)){
            return;
        }
        const sd = this.domH.byId('LeaveListPeriodStart').value || null;
        const ed = this.domH.byId('LeaveListPeriodEnd').value || null;
        this.clearTable();

        if(!this.empLeaveManages.isEmpty()){
            if(this.isNormalViewMode()){ // 表示種類＝休暇履歴
                this.buildLeaveTable();
            }else{
                this.buildMonthlyTable();
            }
        }else{
            this.blockingUI(true);
            this.fetchEmpLeaveManage(sd, ed);
        }
    }
    /**
     * 社員休暇管理データを読み込む
     * @param {string} sd 期間開始日（YYYY-MM-DD）
     * @param {string} ed 期間終了日（YYYY-MM-DD）
     */
    fetchEmpLeaveManage(sd, ed){
        this.leaveManager.fetchEmpLeaveManage(this.empId, sd, ed).then((records) => {
            this.empLeaveManages.setRecords(records);
            this.fetchMonthlyLeaveBalances(sd, ed);
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
        }).then(() => {
        });
    }
    /**
     * 月次休暇残高データを読み込む
     * @param {string} sd 期間開始日（YYYY-MM-DD）
     * @param {string} ed 期間終了日（YYYY-MM-DD）
     */
     fetchMonthlyLeaveBalances(sd, ed){
        this.leaveManager.fetchMonthlyLeaveBalances(this.empId, sd, ed).then((records) => {
            this.monthlyLeaveBalances.setRecords(records);
            // 表作成
            if(this.isNormalViewMode()){ // 表示種類＝休暇履歴
                this.buildLeaveTable();
            }else{
                this.buildMonthlyTable();
            }
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
        }).then(() => {
            this.blockingUI(false);
        });
    }
    /**
     * データ再表示
     */
    refreshTable(){
        this.empLeaveManages.setEmpty();
        this.monthlyLeaveBalances.setEmpty();
        this.changeViewMode(true);
    }
    /**
     * 表ヘッダ部のDOMを返す
     * @returns {DOM}
     */
    getTableHead(){
        return this.getTopNode().querySelector('table.tsa-leave-table thead');
    }
    /**
     * 表ボディ部のDOMを返す
     * @returns {DOM}
     */
    getTableBody(){
        return this.getTopNode().querySelector('table.tsa-leave-table tbody');
    }
    /**
     * 表ボディ部と関連するリスナイベントをクリアし、表部を非表示にする
     */
    clearTable(){
        this.clearListenerKeys(1);
        this.domH.setStyle('LeaveListTable', 'display', 'none');
        this.domH.empty(this.getTableBody());
        this.domH.empty(this.getTableHead());
    }
    /**
     * 表部を表示
     */
    showTable(){
        this.domH.setStyle('LeaveListTable', 'display', 'table');
        this.windowResize();
    }
    /**
     * 休暇履歴表を作成
     */
    buildLeaveTable(){
        const tr = this.domH.create('tr', null, this.getTableHead());
        this.leaveFields.forEach((f) => {
            const width = f.width + (f.last ? 18 : 0);
            this.domH.create('div', { innerHTML:f.label, title:f.label } 
            , this.domH.create('div', { style:`width:${width}px;` }, this.domH.create('th', null, tr)));
        });
        this.buildLeaveTableBody();
    }
    /**
     * 休暇履歴表ボディ部を作成
     */
    buildLeaveTableBody(){
        const holidayGroupId = this.domH.byId('LeaveListHolidayGroup').value;
        const holidayGroup = this.leaveManager.getHolidayGroupById(holidayGroupId);
        const pcType = this.domH.byId('LeaveListPcType').value;
        const tbody = this.getTableBody();
        this.domH.empty(tbody);
        this.domH.toggleClass(tbody, 'monthly-body', false);
        this.empLeaveManages.getByHolidyGroupAndPcType(holidayGroup, pcType).forEach((elm) => {
            const fields = Object.assign([], this.leaveFields);
            let x = 2;
            fields[x++].value = elm.getHolidayGroupName(); // 休暇グループ
            fields[x++].value = this.displayPcType(elm.getPcType()); // 入払区分
            fields[x++].value = elm.getStartDate('YYYY/MM/DD'); // 有効開始日
            fields[x++].value = elm.getEndDate('YYYY/MM/DD'); // 有効終了日
            fields[x++].value = elm.getProvideDays(); // 付与日数
            fields[x++].value = elm.getProvideTime(true); // 付与時間
            fields[x++].value = elm.getConsumeDays(); // 消化日数
            fields[x++].value = elm.getConsumeTime(true); // 消化時間
            fields[x++].value = (elm.isMinus() ? this.msgH.get('hg00002010'/*（マイナス付与）*/): '') + elm.getDescription(); // 説明等
            fields[x++].value = this.displayHolidayRange(elm.getHolidayRange()); // 休暇型
            fields[x++].value = elm.isPeriodic(true); // 定期付与
            fields[x++].value = elm.isNotObligatoryFlag(true); // 取得義務外
            fields[x++].value = elm.getRealProvideDays(); // 実付与日数
            fields[x++].value = elm.isPlannedHoliday(true); // 計画有休
            fields[x++].value = elm.getAdjustYear(); // 対象年度
            const tr = this.domH.create('tr', { dataId:elm.getId() }, tbody);
            fields.forEach((f) => {
                const cell = this.domH.create('div', { style:`width:${f.width}px;text-align:${f.align};` }, this.domH.create('td', null, tr));
                if(f.editBtn){
                    if(elm.isEditable()){
                        const a = this.domH.create('a', { textContent:this.msgH.get('LabelEdit') }, cell);
                        this.setListenerKey(1, this.domH.addListener(a, 'click' , (e) => { this.editEmpLeaveManage(e); }));
                    }
                }else if(f.deleteBtn){
                    if(elm.isDeletable()){
                        const a = this.domH.create('a', { textContent:this.msgH.get('LabelDelete') }, cell);
                        this.setListenerKey(1, this.domH.addListener(a, 'click' , (e) => { this.deleteEmpLeaveManage(e); }));
                    }
                }else{
                    const div = this.domH.create('div', { textContent:f.value }, cell);
                    if(f.title){
                        div.setAttribute('title', f.value);
                    }
                }
            });
        });
        this.showTable();
    }
    /**
     * 月次休暇残高表を作成
     */
    buildMonthlyTable(){
        const tr = this.domH.create('tr', null, this.getTableHead());
        this.monthlyFields.forEach((f) => {
            const width = f.width + (f.last ? 18 : 0);
            this.domH.create('div', { innerHTML:f.label, title:f.label } 
            , this.domH.create('div', { style:`width:${width}px;` }, this.domH.create('th', null, tr)));
        });
        this.buildMonthlyTableBody();
    }
    /**
     * 月次休暇残高表ボディ部を作成
     */
    buildMonthlyTableBody(){
        const holidayGroupId = this.domH.byId('LeaveListHolidayGroup').value;
        const holidayGroup = this.leaveManager.getHolidayGroupById(holidayGroupId);
        const pcType = this.domH.byId('LeaveListPcType').value;
        const tbody = this.getTableBody();
        this.domH.empty(tbody);
        this.domH.toggleClass(tbody, 'monthly-body', true);
        let prevYm = null;
        this.monthlyLeaveBalances.getByHolidyGroupAndPcType(holidayGroup, pcType).forEach((mlb) => {
            const fields = Object.assign([], this.monthlyFields);
            let x = 0;
            if(!prevYm || prevYm != mlb.getYearMonthS()){
                fields[x++].value = mlb.getYearMonthS(); // 月度
                fields[x++].value = this.msgH.getStatus(mlb.getMonthStatus()); // ステータス
            }else{
                fields[x++].value = '';
                fields[x++].value = '';
            }
            fields[x++].value = mlb.getBaseTime(); // 基準時間
            fields[x++].value = mlb.getHolidayGroupName(); // 休暇グループ
            fields[x++].value = this.displayPcType(mlb.getPcType()); // 入払区分
            fields[x++].value = mlb.getStartDate('YYYY/MM/DD'); // 有効開始日
            fields[x++].value = mlb.getEndDate('YYYY/MM/DD'); // 有効終了日
            fields[x++].value = mlb.getProvideDays(); // 月初残日数
            fields[x++].value = mlb.getProvideTime(true); // 月初残時間
            fields[x++].value = mlb.getConsumeDays(); // 消化日数
            fields[x++].value = mlb.getConsumeTime(true); // 消化時間
            fields[x++].value = mlb.getRemainDays(); // 月末残日数
            fields[x++].value = mlb.getRemainTime(true); // 月末残時間
            fields[x++].value = mlb.getExpired(); // 失効
            fields[x++].value = mlb.getOvertakeDays(); // 過消化日数
            fields[x++].value = mlb.getOvertakeTime(true); // 過消化時間
            fields[x++].value = mlb.getViolateTime(true); // 制限外時間
            fields[x++].value = mlb.getDescription(); // 説明等
            fields[x++].value = this.displayHolidayRange(mlb.getHolidayRange()); // 休暇型
            const tr = this.domH.create('tr', { dataId:mlb.getId() }, tbody);
            this.domH.toggleClass(tr, 'change-ym', (prevYm && prevYm != mlb.getYearMonthS()));
            fields.forEach((f) => {
                const td = this.domH.create('td', null, tr);
                const cell = this.domH.create('div', { style:`width:${f.width}px;text-align:${f.align};` }, td);
                if(f.link){
                    this.domH.create('a', {
                        textContent: f.value,
                        href: `${tsCONST.workTimeView}?empId=${mlb.getEmpId()}&month=${mlb.getYearMonth()}&subNo=${mlb.getSubNo(true)}`,
                        target: '_blank'
                    }, cell);
                }else{
                    const div = this.domH.create('div', { textContent:f.value }, cell);
                    if(f.title){
                        div.setAttribute('title', f.value);
                    }
                }
            });
            prevYm = mlb.getYearMonthS();
        });
        this.showTable();
    }
    /**
     * 次回付与予定日の変更
     */
    changeNextProvideDate(){
        const viewParam = {
            strict: true,
            caption: this.msgH.get('hg00001270'/*次回付与予定日の変更*/),
            okLabel: this.msgH.get('LabelSave'),
            empId: this.empId,
            nextProvideDate: this.domH.byId('LeaveListNextProvideDate').value
        };
        (new ChangeNextProvideDate(this.tsaMain, this.leaveManager, viewParam)).open().then((res) => {
            this.hourlyLeavePeriods.clear();
            this.domH.byId('LeaveListNextProvideDate').value = res.nextProvideDate || '';
            this.displayNextProvideDate();
            this.refreshTable();
        },() => {
        });
    }
    /**
     * 期間変更
     */
    changePeriod(){
        const osd = this.domH.byId('LeaveListPeriodStart').value;
        const oed = this.domH.byId('LeaveListPeriodEnd').value;
        const viewParam = {
            sd: osd,
            ed: oed,
            caption: this.msgH.get('hg00001160'/*期間変更*/)
        };
        (new ChangePeriod(this.tsaMain, viewParam)).open().then((res) => {
            this.domH.byId('LeaveListPeriodStart').value = res.sd || '';
            this.domH.byId('LeaveListPeriodEnd').value = res.ed || '';
            this.displayPeriod();
            this.refreshTable();
        },() => {
        });
    }
    /**
     * 付与データの登録
     */
    addProvide(){
        const viewParam = {
            strict: true,
            caption: this.msgH.get('hg00001280'/*付与データの登録*/),
            empId: this.empId,
            okLabel: this.msgH.get('LabelSave'),
            holidayGroupId: this.getCurrentHolidayGroupId()
        };
        (new EditProvide(this.tsaMain, this.leaveManager, viewParam)).open().then(() => {
            this.refreshTable();
        },() => {
        });
    }
    /**
     * 消化データの登録
     */
    addConsume(){
        const viewParam = {
            strict: true,
            caption: this.msgH.get('hg00001290'/*消化データの登録*/),
            empId: this.empId,
            okLabel: this.msgH.get('LabelSave'),
            holidayGroupId: this.getCurrentHolidayGroupId(true)
        };
        (new EditConsume(this.tsaMain, this.leaveManager, viewParam)).open().then(() => {
            this.refreshTable();
        },() => {
        });
    }
    /**
     * 選択中の休暇グループのIDを返す
     * flag=false・・プルダウンの選択肢そのまま返す。
     * flag=true ・・選択中の休暇グループが type=H の場合、typeA の休暇グループのIDを返す
     * @param {boolean} flag 
     * @returns {string}
     */
    getCurrentHolidayGroupId(flag){
        const holidayGroupId = this.domH.byId('LeaveListHolidayGroup').value;
        if(!flag){
            return holidayGroupId;
        }
        // 選択中の休暇グループが type=H の場合、typeA の休暇グループのIDを返す
        let holidayGroup = this.leaveManager.getHolidayGroupById(holidayGroupId);
        if(holidayGroup && holidayGroup.isTypeH()){
            const typeA = this.leaveManager.getManageGroups().filter((hg) => { return hg.isTypeA(); });
            if(typeA.length){
                holidayGroup = typeA[0];
            }
        }
        return (holidayGroup && holidayGroup.getId()) || null;
    }
    /**
     * マイナス付与データの登録
     */
    addMinus(){
        // 残日数情報を読み込む
        this.blockingUI(true);
        this.leaveManager.getMonthlyLeaveValues(this.empId, Util.formatDate(new Date())).then((remains) => {
            const viewParam = {
                strict: true,
                caption: this.msgH.get('hg00001310'/*マイナス付与データの登録*/),
                empId: this.empId,
                okLabel: this.msgH.get('LabelSave'),
                remains: remains,
                holidayGroupId: this.getCurrentHolidayGroupId()
            };
            (new EditMinus(this.tsaMain, this.leaveManager, viewParam)).open().then(() => {
                this.refreshTable();
            },() => {
            });
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
        }).then(() => {
            this.blockingUI(false);
        });
    }
    /**
     * 時間単位有休調整の前準備
     */
    adjustHourlyLimit(){
        if(this.hourlyLeavePeriods.isStandby()){
            this.showAdjustHourlyLimit();
        }else{
            this.blockingUI(true);
            this.leaveManager.getHourlyPaidLeavePeriods(this.empId).then((ranges) => {
                this.hourlyLeavePeriods.setRecords(ranges);
                this.showAdjustHourlyLimit();
            }).catch((errobj) => {
                this.showError({message: this.msgH.parseErrorMessage(errobj)});
            }).then(() => {
                this.blockingUI(false);
            });
        }
    }
    /**
     * 時間単位有休調整
     */
    showAdjustHourlyLimit(){
        const viewParam = {
            strict: true,
            caption: this.msgH.get('hg00001920'/*時間単位有休調整*/),
            empId: this.empId,
            okLabel: this.msgH.get('LabelSave'),
            holidayGroup: this.leaveManager.getHolidayGroupTypeH(),
            hourlyLeavePeriods: this.hourlyLeavePeriods
        };
        (new AdjustHourlyPaidLeave(this.tsaMain, this.leaveManager, viewParam)).open().then(() => {
            this.refreshTable();
        },() => {
        });
    }
    /**
     * データの編集
     * @param {Event} e 
     */
    editEmpLeaveManage(e){
        const tr = this.domH.getAncestorByTagName(e.target, 'TR');
        const elm = this.empLeaveManages.getById(tr && tr.getAttribute('dataId'));
        if(elm){
            const viewParam = {
                strict: true,
                caption: this.msgH.get('hg00001530'/*{0}データの編集*/, this.displayPcType(elm.getPcType())),
                empId: this.empId,
                empLeaveManage: elm,
                empLeaveManages: this.empLeaveManages,
                okLabel: this.msgH.get('LabelSave')
            };
            if(elm.isTypeH()){ // 時間単位有休調整データ
                viewParam.caption = this.msgH.get('hg00001920'/*時間単位有休調整*/);
                viewParam.holidayGroup = this.leaveManager.getHolidayGroupTypeH();
                viewParam.hourlyLeavePeriods = this.hourlyLeavePeriods;
                (new AdjustHourlyPaidLeave(this.tsaMain, this.leaveManager, viewParam)).open().then(() => {
                    this.refreshTable();
                },() => {
                });
            }else if(elm.isProvide()){ // 付与データ
                (new EditProvide(this.tsaMain, this.leaveManager, viewParam)).open().then(() => {
                    this.refreshTable();
                },() => {
                });
            }else if(elm.isMinus()){ // マイナス付与データ
                viewParam.caption = this.msgH.get('hg00001530'/*{0}データの編集*/, this.msgH.get('hg00001300'/*マイナス付与*/));
                (new EditMinus(this.tsaMain, this.leaveManager, viewParam)).open().then(() => {
                    this.refreshTable();
                },() => {
                });
            }else{ // 消化データ
                (new EditConsume(this.tsaMain, this.leaveManager, viewParam)).open().then(() => {
                    this.refreshTable();
                },() => {
                });
            }
        }
    }
    /**
     * データの削除
     * @param {Event} e 
     */
    deleteEmpLeaveManage(e){
        const tr = this.domH.getAncestorByTagName(e.target, 'TR');
        const elm = this.empLeaveManages.getById(tr && tr.getAttribute('dataId'));
        const viewParam = {
            strict: true,
            caption: this.msgH.get('hg00001540'/*{0}データの削除*/, this.displayPcType(elm.getPcType())),
            empLeaveManage: elm,
            okLabel: this.msgH.get('LabelDelete'),
            message: this.msgH.get('hg00001550'/*{0}データを削除します*/, this.displayPcType(elm.getPcType()))
        };
        (new DeleteEmpLeaveManage(this.tsaMain, this.leaveManager, viewParam)).open().then(() => {
            this.refreshTable();
        },() => {
        });
    }
    /**
     * データが最新の状態かどうかをチェックする
     */
    inspectData(){
        this.blockingUI(true);
        this.leaveManager.inspectMonthlyLeaveBalance(this.empId).then((result) => {
            if(!result.fault){
                this.simpleAlert(this.msgH.get('hg00001980'/*データは最新の状態です*/));
                return;
            }
            let message = '';
            if(result.fromDate){
                result.fromDate = Util.formatDate(result.fromDate);
                message = this.msgH.get('hg00002000'/*{0} 以降*/, result.fromDate) + '<br/>';
            }
            message += this.msgH.get('hg00001990'/*データは最新ではありません。更新しますか？*/);
            const viewParam = {
                message: message,
                caption: this.msgH.get('LabelConfirmation'/*確認*/)
            };
            this.messageBox(viewParam).then(
                () => { this.updateData(result.fromDate); },
                () => {}
            );
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
        }).then(() => {
            this.blockingUI(false);
        });
    }
    /**
     * データを更新
     * @param {string|null} fromDate 更新開始日
    */
    updateData(fromDate){
        this.blockingUI(true);
        this.leaveManager.buildMonthlyLeaveBalance(this.empId, fromDate).then((result) => {
            console.log(result);
            this.refreshTable();
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
        }).then(() => {
            this.blockingUI(false);
        });
    }
}