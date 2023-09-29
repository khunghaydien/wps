import {BaseView} from "../_common/BaseView.js?v=XVERSIONX";
import {Remoting} from "../_common/Remoting.js?v=XVERSIONX";

/**
 * データ削除
 */
export class ClearMainView extends BaseView {
    constructor(tsaMain){
        super(tsaMain, null);
        this.parentId = tsaMain.baseId;
        this.prefixHash = '#!clean';
        this.topNodeId = 'CleaningMainView';
        this.common = {};
        this.targetObjs = [
            { type:'勤怠', name:'AtkEmpMonth__c'            },
            { type:'勤怠', name:'AtkEmpApply__c'            },
            { type:'勤怠', name:'AtkEmpYuq__c'              },
            { type:'勤怠', name:'AtkEmpStock__c'            },
            { type:'勤怠', name:'AtkDeptMonth__c'           },
            { type:'勤怠', name:'AtkInfo__c'                },
            { type:'勤怠', name:'AtkYuqManagementPeriod__c' },
            { type:'勤怠', name:'ExternalAttendance__c'     },
            { type:'勤怠', name:'AtkAccessControlLog__c'    },
            { type:'工数', name:'AtkJobApply__c'            },
            { type:'工数', name:'AtkEmpWork__c'             },
            { type:'経費', name:'AtkExpApply__c'            },
            { type:'経費', name:'AtkExpPreApply__c'         },
            { type:'経費', name:'AtkEmpExp__c'              },
            { type:'経費', name:'AtkJournal__c'             },
            { type:'経費', name:'AtkCardStatementLine__c'   },
            { type:'経費', name:'AtkJsNaviReserve__c'       },
            { type:'経費', name:'AtkJsNaviActual__c'        },
            { type:'経費', name:'AtkJsNaviInvoice__c'       },
            { type:'稟議', name:'AtkApply__c'               }
        ];
    }

    open(hash){
        if(hash == '#!cleaning'){
            super.open(hash);
            this.buildContent();
        }else{
            this.tsaMain.setDefaultHash();
        }
    }
    buildContent(){
        this.domH.empty(this.baseId);
        document.getElementById(this.baseId).innerHTML = this.getContent();
        this.initListeners();
        this.setLabels();
        this.fetchCommon();
    }
    getContent(){
        return `
            <div id="${this.topNodeId}">
                <div class="tsa-panel1">
                    <div class="tsa-menu-cleaning"></div>
                </div>
                <div class="tsa-error-main" style="display:none;"><div></div></div>
                <div class="tsa-cleaning-area">
                    <div style="margin:0px 0px 8px 8px;">
                        本番運用開始前に、検証で作成したトランザクションデータを削除する場合に利用します。
                    </div>
                    <div style="margin:16px 8px 8px 8px;">
                        1. 電帳法対応について確認を行います（経費データの削除が不要の場合は2へ進む）
                    </div>
                    <div class="tsa-ebma-block">
                        <div id="CleanScanStorageOn" style="display:none;">
                            <div>
                                <span style="color:red;">「電子帳簿保存法対応機能を使用する」がONとなっています。</span><br/>
                                OFFに変更しなければ、経費（事前申請含む）が削除実行できません。<br/>
                                お客様の許諾を得て、OFFにしてください。
                            </div>
                            <div style="margin-top:16px;">
                                <button id="CleanScanStorageChangeOff">OFFにする</button>
                            </div>
                        </div>
                        <div id="CleanScanStorageOff" style="display:none;">
                            <div>
                                「電子帳簿保存法対応機能を使用する」はOFF
                            </div>
                        </div>
                    </div>
                    <div style="margin:16px 8px 8px 8px;">
                        2. 削除対象を選択してください
                    </div>
                    <div id="CleanTarget" style="margin-left:32px;">
                        <div>
                            <label><input type="checkbox" id="CleanAttendMH" /><span>勤怠・工数</span><span id="CleanAttendMHCount"></span></label>
                        </div>
                        <div>
                            <label><input type="checkbox" id="CleanExpenses" /><span>経費（事前申請含む）</span><span id="CleanExpensesCount"></span></label>
                        </div>
                        <div>
                            <label><input type="checkbox" id="CleanApproval" /><span>稟議</span><span id="CleanApprovalCount"></span></label>
                        </div>
                    </div>
                    <div style="margin:16px 8px 8px 8px;">
                        3. 削除実行してください
                    </div>
                    <div style="margin-left:32px;">
                        <button id="CleanExecute" disabled>削除実行</button>
                    </div>
                </div>
            </div>
        `;
    }
    initListeners(){
        super.initListeners();
        this.domH.byId('CleanTarget').querySelectorAll('input[type="checkbox"]').forEach((el) => {
            this.setListenerKey(0, this.domH.addListener(el, 'click', () => { this.checkedTarget(); }));
        });
        this.setListenerKey(0, this.domH.addListener('CleanScanStorageChangeOff', 'click', () => { this.scanStorageChangeOff(); }));
        this.setListenerKey(0, this.domH.addListener('CleanExecute', 'click', () => { this.executeClean(); }));
    }
    setLabels(){
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-menu-cleaning'), 'MenuCleaning');
    }
    checkedTarget(){
        if(this.common.UseScannerStorage__c && this.domH.byId('CleanExpenses').checked){
            this.domH.setAttr('CleanExecute', 'disabled', true);
            return;
        }
        let cnt = 0;
        this.getTopNode().querySelectorAll('input[type="checkbox"]:checked').forEach(() => {
            cnt++;
        });
        this.domH.setAttr('CleanExecute', 'disabled', !cnt);
    }
    /**
     * 設定値を読み込み
     */
     fetchCommon(callback){
        const req = {
            soql: "select Id,UseScannerStorage__c from AtkCommon__c",
            limit: 1,
            offset: 0,
            allRows: false
        };
        if(tsCONST.prefixBar){
            req.soql = req.soql.replace(/([A-Za-z0-9_]+__[cr])/g, `${tsCONST.prefixBar}$1`);
        }
        this.blockingUI(true, this.msgH.get('msg2000020')); // データを読み込んでいます
        Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
            (result) => {
                if(result.records.length){
                    this.initSettings(result.records[0]);
                    this.fetchCount(callback);
                }else{
                    this.showError('勤怠共通設定にデータがありません');
                    this.getTopNode().querySelectorAll('button').forEach((el) => {
                        this.domH.setAttr(el, 'disabled', true);
                    });
                    this.blockingUI(false);
                }
            },
            (event) => {
                this.showError({message: this.msgH.parseErrorMessage(event)});
                this.blockingUI(false);
            }
        );
    }
    fetchCount(callback){
        this.domH.byId('CleanAttendMHCount').innerHTML = '';
        this.domH.byId('CleanExpensesCount').innerHTML = '';
        this.domH.byId('CleanApprovalCount').innerHTML = '';
        this.fetchCountLoop(this.targetObjs, 0, () => {
            this.showDataCount();
            if(callback){
                callback();
            }else{
                this.blockingUI(false);
            }
        });
    }
    fetchCountLoop(objs, index, callback){
        if(index >= objs.length){
            callback(true);
            return;
        }
        const obj = objs[index];
        Remoting.request(tsCONST.API_REMOTE_ACTION, { action:'getCountQuery', soql:`select Count() from ${obj.name}` }).then(
            (result) => {
                obj.count = result.count;
                this.fetchCountLoop(objs, index + 1, callback);
            },
            (errobj) => {
                this.showError({message: this.msgH.parseErrorMessage(errobj)});
                callback(false);
            }
        );
    }
    scanStorageChangeOff(){
        const viewParam = {
            messages: ['「電子帳簿保存法対応機能を使用する」をOFFに変更します。よろしいですか？',
                    '【最終確認】<br/>本当に「電子帳簿保存法対応機能を使用する」をOFFに変更して良いですね？'],
            caption: '確認'
        };
        this.messageBox(viewParam).then(
            () => {
                this.blockingUI(true, this.msgH.get('msg2000030')); // データを更新しています
                const req = {
                    action: 'updateSObject',
                    objName: 'AtkCommon__c',
                    typeMap: {
                        UseScannerStorage__c: 'BOOLEAN'
                    },
                    idList: [this.common.Id],
                    values: {}
                };
                req.values[this.common.Id] = { UseScannerStorage__c: false };
                Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                    (result) => {
                        console.log(result);
                        this.initSettings(result.records[0]);
                        this.checkedTarget();
                        this.blockingUI(false);
                    },
                    (errobj) => {
                        this.showError({message: this.msgH.parseErrorMessage(errobj)});
                        this.blockingUI(false);
                    }
                );
            },
            () => {}
        );
    }
    initSettings(common){
        this.common = common;
        this.domH.setStyle('CleanScanStorageOn' , 'display', (common.UseScannerStorage__c ? '' : 'none'));
        this.domH.setStyle('CleanScanStorageOff', 'display', (common.UseScannerStorage__c ? 'none' : ''));
    }
    showDataCount(){
        let cnt1 = 0;
        let cnt2 = 0;
        let cnt3 = 0;
        const me1 = [];
        const me2 = [];
        const me3 = [];
        this.targetObjs.forEach((obj) => {
            if(obj.type == '勤怠' || obj.type == '工数'){
                cnt1 += obj.count;
                me1.push(`${obj.name} = ${obj.count}`);
            }else if(obj.type == '経費'){
                cnt2 += obj.count;
                me2.push(`${obj.name} = ${obj.count}`);
            }else if(obj.type == '稟議'){
                cnt3 += obj.count;
                me3.push(`${obj.name} = ${obj.count}`);
            }
        });
        this.domH.byId('CleanAttendMHCount').innerHTML = `（${cnt1}件）`;
        this.domH.byId('CleanAttendMHCount').title = me1.join('\n');
        this.domH.byId('CleanExpensesCount').innerHTML = `（${cnt2}件）`;
        this.domH.byId('CleanExpensesCount').title = me2.join('\n');
        this.domH.byId('CleanApprovalCount').innerHTML = `（${cnt3}件）`;
        this.domH.byId('CleanApprovalCount').title = me3.join('\n');
    }
    executeClean(){
        const c1 = this.domH.byId('CleanAttendMH').checked; // 勤怠・工数
        const c2 = this.domH.byId('CleanExpenses').checked; // 経費（事前申請含む）
        const c3 = this.domH.byId('CleanApproval').checked; // 稟議
        const objNames = [];
        this.targetObjs.forEach((obj) => {
            if(((obj.type == '勤怠' || obj.type == '工数') && c1)
            || (obj.type == '経費' && c2)
            || (obj.type == '稟議' && c3)){
                objNames.push(obj.name);
            }
        });
        const viewParam = {
            messages: ['トランザクションデータを削除します。よろしいですか？','【最終確認】<br/><br/>削除実行して本当に良いですか？<br/><br/>'],
            caption: '確認'
        };
        this.messageBox(viewParam).then(
            () => {
                this.blockingUI(true, this.msgH.get('msg2000035')); // データを削除しています
                const req = {
                    action: 'deleteAll',
                    objNames: objNames
                };
                Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                    () => {
                        this.fetchCommon(() => {
                            this.blockingUI(false);
                            this.simpleAlert('削除完了しました。', '削除');
                        });
                    },
                    (errobj) => {
                        this.showError({message: this.msgH.parseErrorMessage(errobj)});
                        this.blockingUI(false);
                    }
                );
            },
            () => {}
        );
    }
}