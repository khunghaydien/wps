import {BaseView}     from "../../_common/BaseView.js?v=XVERSIONX";
import {Util}         from "../../_common/Util.js?v=XVERSIONX";
import {FieldInfo}    from "../dialog/FieldInfo.js?v=XVERSIONX";
import {RelationShip} from "../dialog/RelationShip.js?v=XVERSIONX";
import {FieldUtil}    from "../util/FieldUtil.js?v=XVERSIONX";
import {Remoting}     from "../../_common/Remoting.js?v=XVERSIONX";
/**
 * SObjectレコード表示/編集
 */
export class SObjDataView extends BaseView {
    constructor(sobjMain, viewParam){
        super(sobjMain.tsaMain, viewParam);
        this.sobjMain = sobjMain;
        this.sObject = viewParam.sObject;
        this.id = viewParam.id;
        this.sourceId = viewParam.sourceId;
        this.record = null;
        this.orgRecord = null;
        this.editMode = 0; // 0:参照モード  1:メンテナンスモード(実際は参照モード)  2:編集モード
        this.refresh = false;
        this.relationInfo = {};
    }

    get sObjManager(){ return this.sobjMain.sObjManager; }
    /**
     * 初期表示
     */
    open(hash){
        super.open(hash);
        this.getParentNode().innerHTML = this.getContent();
        this.domH.byId('SObjDataName').innerHTML = this.sObject.label + '  ' + this.sObject.name;
        this.domH.setAttr('SObjDataName', 'href', this.sObject.hash);
        this.initListeners();
        this.setLabels();
        this.setNewWindowLink('SObjDataNewWindow');
        this.show();
        this.fetchRecord();
        this.domH.byId('SObjDataFilter').focus();
    }
    getContent(){
        return `
            <div class="tsa-panel1">
                <div><a href="#!sobjs" class="tsa-menu-sobjs">オブジェクト一覧</a></div>
                <div><a id="SObjDataName"></a></div>
                <div id="SObjDataId"></div>
                <div style="margin-left:100px;"><a href="" id="SObjDataNewWindow" target="_blank"></a></div>
            </div>
            <div class="tsa-error-main" style="display:none;"><div></div></div>
            <div class="tsa-panel1" style="margin:4px 0px;">
                <div class="tsa-quick-find">絞り込み</div>
                <div class="tsa-filter-input">
                    <div class="tsa-loupe"></div>
                    <div>
                        <input type="text" style="width:200px;" id="SObjDataFilter" autocomplete="off" />
                    </div>
                    <div style="margin:0px;width:15px;">
                        <div class="tsa-clear" id="SObjDataFilterClear" style="display:none;"></div>
                    </div>
                </div>
                <div style="margin-left:10px;">
                    <a href="#!sobj-field:${this.sObject.key}" class="tsa-item-define">項目定義情報</a>
                </div>
            </div>
            <div class="tsa-panel1" style="margin-bottom:8px;">
                <div>
                    <button id="SObjDataRelation">関連データ</button>
                </div>
                <div>
                    <button id="SObjDataMainte" class="tsa-mainte">メンテナンスモードへ</button>
                </div>
                <div class="tsa-edit-mode" style="display:none;width:120px;">
                    <div></div>
                </div>
                <div class="tsa-editable" style="display:none;">
                    <button id="SObjDataEdit">編集</button>
                    <div class="tsa-hint" hintId="HintSObjectDataEdit"></div>
                </div>
                <div class="tsa-deletable" style="display:none;">
                    <button id="SObjDataDelete">削除</button>
                    <div class="tsa-hint" hintId="HintSObjectDataDelete"></div>
                </div>
                <div class="tsa-restorable" style="display:none;">
                    <button id="SObjDataRestore">復元</button>
                    <div class="tsa-hint" hintId="HintSObjectDataRestore"></div>
                </div>
                <div class="tsa-cloneable" style="display:none;">
                    <button id="SObjDataClone">複製</button>
                    <div class="tsa-hint" hintId="HintSObjectDataClone"></div>
                </div>
                <div class="tsa-savable" style="display:none;">
                    <button id="SObjDataSave">登録</button>
                </div>
                <div class="tsa-cancelable" style="display:none;">
                    <button id="SObjDataCancel" class="tsa-cancel">キャンセル</button>
                </div>
            </div>
            <div>
                <table id="SObjDataTable" class="tsa-sobjs" style="display:none;">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
    }
    /**
     * イベントリスナーをセット
     */
     initListeners(){
        super.initListeners();
        this.setListenerKey(0, this.domH.addListener(window, 'resize', () => { this.windowResize(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataFilter'      , 'input', () => { this.filterByName(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataFilterClear' , 'click', () => { this.filterClear(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataMainte'      , 'click', () => { this.toggleEditMode(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataEdit'        , 'click', () => { this.setEditMode(2); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataCancel'      , 'click', () => { this.cancelEdit(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataSave'        , 'click', () => { this.save(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataDelete'      , 'click', () => { this.delete(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataRestore'     , 'click', () => { this.restore(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataClone'       , 'click', () => { this.cloneRecord(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataRelation'    , 'click', () => { this.showRelationShip(); }));
    }
    getTopNode(){
        return this.getParentNode();
    }
    setLabels(){
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-menu-sobjs'), 'LabelSObjectList');
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-quick-find'), 'LabelQuickFind');
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-item-define'), 'LabelItemDefine');
        this.msgH.setLabelById('SObjDataRelation', 'LabelRelatedData');
        this.msgH.setLabelById('SObjDataEdit', 'LabelEdit');
        this.msgH.setLabelById('SObjDataDelete', 'LabelDelete');
        this.msgH.setLabelById('SObjDataRestore', 'LabelRestore');
        this.msgH.setLabelById('SObjDataClone', 'LabelClone');
        this.msgH.setLabelById('SObjDataSave', 'LabelSave');
        this.msgH.setLabelById('SObjDataCancel', 'LabelCancel');
        this.msgH.setLabelById('SObjDataMainte', 'LabelMainteOn');
        this.msgH.setLabelById('SObjDataNewWindow', 'LabelOpenNewWindow');
    }
    windowResize(){
        const tbody = document.querySelector('#SObjDataTable tbody');
        if(tbody){
            const h = Math.max(window.innerHeight - tbody.getBoundingClientRect().y - 20, 100);
            tbody.style.maxHeight = h + 'px';
        }
    }
    fetchRecord(){
        this.domH.byId('SObjDataId').innerHTML = this.id || this.msgH.get(this.sourceId ? 'LabelCloneDsp' : 'LabelNewDsp');
        const readId = (this.id || this.sourceId);
        if(readId){
            this.sObjManager.fetchRecordById(this.sObject, readId).then((records) => {
                if(!this.id){
                    this.orgRecord = {};
                    this.record = records[0];
                    this.setEditMode(2);
                }else{
                    this.orgRecord = records[0];
                    this.record = Object.assign({}, this.orgRecord);
                    this.showResult();
                }
            }).catch((errobj) => {
                this.showError({message: this.msgH.parseErrorMessage(errobj)});
            });
        }else{
            this.orgRecord = {};
            this.record = {};
            if(this.sObject.define){
                this.setEditMode(2);
            }else{
                this.sObjManager.fetchSObjectDefine(this.sObject.key).then((obj) => {
                    this.sObject.define = obj;
                    this.setEditMode(2);
                }).catch((errobj) => {
                    this.showError({message: this.msgH.parseErrorMessage(errobj)});
                });
            }
        }
    }
    /**
     * 検索結果を表示
     */
    showResult(){
        this.clearListenerKeys(1);
        const thead = document.querySelector('#SObjDataTable > thead');
        this.domH.empty(thead);
        const thr = this.domH.create('tr', null, thead);
        this.domH.create('div', { textContent:this.msgH.get('LabelLabel')    , style:'width:200px;' }, this.domH.create('th', null, thr));
        this.domH.create('div', { textContent:this.msgH.get('LabelAPIName')  , style:'width:200px;' }, this.domH.create('th', null, thr));
        this.domH.create('div', { textContent:this.msgH.get('LabelDataType') , style:'width:156px;' }, this.domH.create('th', null, thr));
        this.domH.create('div', { textContent:this.msgH.get('LabelDataValue'), style:'width:398px;' }, this.domH.create('th', null, thr));

        const record = this.record;
        const tbody = document.querySelector('#SObjDataTable > tbody');
        this.domH.empty(tbody);
        const names = this.sObject.getSoqlFieldNames(this.id ? false : true);
        names.forEach((name) => {
            const field = this.sObject.getFieldByName(name);
            const typeName = (field ? FieldUtil.getFieldTypeName(this.sObjManager, this.msgH, field, true) : '');
            const v = Util.parseValue(record, name);
            const tr = this.domH.create('tr', null, tbody);
            if(field){
                this.domH.setAttr(tr, 'fieldName', field.name);
            }
            this.domH.toggleClass(tr, 'tsa-deleted', record.IsDeleted);
            const f = (field ? field : { label:'', typeName:'' });
            this.domH.create('div', { textContent:f.label   , title:f.label   }, this.domH.create('div', { style:'width:200px;' }, this.domH.create('td', null, tr)));
            this.domH.create('div', { textContent:name      , title:name      }, this.domH.create('div', { style:'width:200px;' }, this.domH.create('td', null, tr)));
            this.domH.create('div', { textContent:typeName  , title:typeName  }, this.domH.create('div', { style:'width:156px;' }, this.domH.create('td', null, tr)));
            const td = this.domH.create('td', null, tr);
            if(field){
                const v1 = this.record[field.name];
                const v2 = this.orgRecord[field.name];
                this.domH.setAttr(td, 'className', (Util.equal(v1, v2) ? 'tsa-popval' : 'tsa-edited'));
            }
            const div = this.domH.create('div', { style:'width:380px;' }, td);
            let els = null;
            if(this.editMode == 2 && field && ((this.id && field.isUpdateable) || (!this.id && field.isCreateable))){
                els = FieldUtil.createFieldDom(this.domH, div, field, v, false, 360);
            }else if(this.sObject.isReferenceField(name)){
                const a = this.domH.create('a', { textContent:v }, this.domH.create('div', null, div));
                this.setListenerKey(1, this.domH.addListener(a, 'click' , (e) => {
                    location.href = '#!sobj:'+v;
                    e.stopPropagation();
                }));
            }else{
                this.domH.create('div', { textContent:v, title:v }, div);
            }
            if(field){
                if(els){
                    els.forEach((el) => {
                        this.setListenerKey(1, this.domH.addListener(el, 'blur' , () => {
                            this.checkEdited(td, els, field);
                        }));
                    });
                }
                this.setListenerKey(1, this.domH.addListener(td, 'click' , (e) => {
                    if(['INPUT','SELECT','TEXTAREA'].indexOf(e.target.tagName) >= 0){
                        e.stopPropagation();
                    }else{
                        const curv = (els ? FieldUtil.getNodeValue(els, field) : v);
                        const viewParam = {
                            field: field,
                            record: record,
                            value: curv,
                            readOnly: (this.editMode != 2),
                            caption: this.msgH.get('LabelFieldInfo')
                        };
                        const dialog = new FieldInfo(this.tsaMain, this.sObjManager, viewParam);
                        dialog.open().then((newv) => {
                            if(els){
                                FieldUtil.setNodeValue(els, field, newv);
                                this.checkEdited(td, els, field);
                            }
                            this.setEditMode(2);
                        },() => {
                        });
                    }
                }));
            }
            this.domH.create('input', { type:'hidden', value:Util.convertStr(f.label) }, tr);
            this.domH.create('input', { type:'hidden', value:Util.convertStr(f.name)  }, tr);
            this.domH.create('input', { type:'hidden', value:Util.convertStr(typeName) + ' ' + f.typeName }, tr);
        });

        this.domH.byId('SObjDataTable').style.display = '';
        this.windowResize();
        this.filterByName();
        this.blockingUI(false);
    }
    checkEdited(td, els, field){
        const orgv = Util.parseValue(this.orgRecord, field.name);
        const newv = FieldUtil.getNodeValue(els, field);
        this.domH.setAttr(td, 'className', (Util.equal(orgv, newv) ? 'tsa-popval' : 'tsa-edited'));
    }
    show(){
        // 編集モードを解除
        if(this.editMode > 0){
            this.setEditMode(0);
        }
        if(this.refresh || !this.id){
            this.fetchRecord();
        }
        super.show();
    }
    dataHasBeenUpdated(){
        this.refresh = true;
    }
    cancelEdit(){
        if(!this.id){
            if(this.sourceId){
                location.href = `#!sobj:${this.sourceId}`;
            }else{
                location.href = `#!sobj-search:${this.sObject.name.toLowerCase()}`;
            }
        }else{
            this.setEditMode(0);            
        }
    }
    toggleEditMode(){
        if(this.editMode == 2){
            this.setEditMode(0);
        }else{
            this.editMode = (this.editMode ? 0 : 1);
            this.setButtons();
        }
    }
    setEditMode(mode, flag){
        if(this.editMode == mode){
            return;
        }
        this.hideError();
        const rebuild = (mode == 2 || this.editMode == 2);
        this.editMode = mode;
        this.setButtons();
        if(flag){
            this.fetchRecord();
        }else if(rebuild){
            this.showResult();
        }
    }
    setButtons(){
        const area = this.domH.byId(this.parentId);
        const mode = this.editMode;
        // メンテナンスモードボタン
        this.msgH.setLabelById('SObjDataMainte', (mode > 0 ? 'LabelMainteOff' : 'LabelMainteOn'));
        this.domH.setAttr('SObjDataMainte', 'disabled', (mode == 2));
        // 編集ボタン
        area.querySelectorAll('.tsa-editable').forEach((el) => {
            el.style.display = (mode == 1 && !this.record.IsDeleted ? '' : 'none');
        });
        // 削除ボタン
        area.querySelectorAll('.tsa-deletable').forEach((el) => {
            el.style.display = (mode == 1 && this.id && !this.record.IsDeleted ? '' : 'none');
        });
        // 復元ボタン
        area.querySelectorAll('.tsa-restorable').forEach((el) => {
            el.style.display = (mode == 1 && this.id && this.record.IsDeleted ? '' : 'none');
        });
        // 複製ボタン
        area.querySelectorAll('.tsa-cloneable').forEach((el) => {
            el.style.display = (mode == 1 && this.id ? '' : 'none');
        });
        // 編集モード
        area.querySelectorAll('.tsa-edit-mode').forEach((el) => {
            el.style.display = (mode == 2 ? '' : 'none');
        });
        // 登録、キャンセルボタン
        area.querySelectorAll('.tsa-savable,.tsa-cancelable').forEach((el) => {
            el.style.display = (mode == 2 ? '' : 'none');
        });
    }
    filterClear(){
        this.domH.byId('SObjDataFilter').value = '';
        this.filterByName();
        this.domH.byId('SObjDataFilter').focus();
    }
    filterByName(){
        const value = Util.convertStr(this.domH.byId('SObjDataFilter').value);
        this.domH.byId('SObjDataFilterClear').style.display = (value ? '' : 'none');
        const tbody = document.querySelector('#SObjDataTable > tbody');
        tbody.querySelectorAll('tr').forEach((tr) => {
            let b = false;
            tr.querySelectorAll('input[type="hidden"]').forEach((el) => {
                if(!value || el.value.indexOf(value) >= 0){
                    b = true;
                }
            });
            tr.style.display = (b ? '' : 'none');
        });
    }
    checkValid(){
        let valid = true;
        const tbody = document.querySelector('#SObjDataTable > tbody');
        tbody.querySelectorAll('input:invalid').forEach((el) => {
            el.focus();
            const tr = this.domH.getAncestorByTagName(el, 'TR');
            if(tr){
                const fieldName = tr.getAttribute('fieldName');
                const field = (fieldName ? this.sObject.getFieldByName(fieldName) : null);
                if(field){
                    this.showError(this.msgH.get('msg2000210', field.label));
                    valid = false;
                }
            }
        });
        return valid;
    }
    getInputContents(){
        const tbody = document.querySelector('#SObjDataTable > tbody');
        const typeMap = {};
        const valueMap = {};
        tbody.querySelectorAll('td.tsa-edited').forEach((td) => {
            const tr = this.domH.getAncestorByTagName(td, 'TR');
            const fieldName = tr.getAttribute('fieldName');
            const field = (fieldName ? this.sObject.getFieldByName(fieldName) : null);
            if(field){
                const els = [];
                tr.querySelectorAll('input,select,textarea').forEach((el) => {
                    if(el.type != 'hidden'){
                        els.push(el);
                    }
                });
                if(els.length){
                    const orgv = Util.parseValue(this.orgRecord, field.name);
                    const newv = FieldUtil.getNodeValue(els, field);
                    if(!Util.equal(orgv, newv)){
                        typeMap[field.name] = field.typeName;
                        valueMap[field.name] = newv;
                    }
                }
            }
        });
        // 新規登録の場合、Nameに値がなければ強制で入れる
        if(!this.id && !typeMap['Name']){
            typeMap['Name'] = 'STRING';
            valueMap['Name'] = '';
        }
        return {
            typeMap: typeMap,
            valueMap: valueMap
        };
    }
    save(){
        this.hideError();
        if(!this.checkValid()){
            return;
        }
        const inputParam = this.getInputContents();
        if(!Object.keys(inputParam.valueMap).length){
            this.simpleAlert(this.msgH.get('msg2000200'));
            return;
        }
        const viewParam = {
            message: this.msgH.get(this.id ? 'msg2000180' : 'msg2000190'),
            caption: this.msgH.get('LabelSaveConfirm')
        };
        this.messageBox(viewParam).then(
            () => {
                this.blockingUI(true, this.msgH.get('msg2000030')); // データを更新しています
                const req = {
                    typeMap: inputParam.typeMap
                };
                if(this.id){
                    req.action = 'updateSObject';
                    req.objName = this.sObject.name;
                    req.idList = [this.record.Id];
                    req.values = {};
                    req.values[this.record.Id] = inputParam.valueMap;
                }else{
                    req.action = 'insertSObject';
                    req.key = this.sObject.name;
                    req.values = [inputParam.valueMap];
                }
                Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                    (result) => {
                        if(!this.id){
                            this.id = result.records[0].Id;
                        }
                        this.sobjMain.dataHasBeenUpdated();
                        this.setEditMode(0, true);
                    },
                    (errobj) => {
                        this.showError({message: this.msgH.parseErrorMessage(errobj)});
                        this.blockingUI(false);
                    }
                );
            }
        );
    }
    cloneRecord(){
        location.href = `#!sobj-new:${this.sObject.key}:${this.id}`;
    }
    delete(){
        const viewParam = {
            messages: [this.msgH.get('msg2000160', this.id), this.msgH.get('msg2000130')],
            caption:this.msgH.get('LabelDelete')
        };
        this.messageBox(viewParam).then(
            () => {
                this.blockingUI(true, this.msgH.get('msg2000030')); // データを更新しています
                const req = {
                    action: 'deleteById',
                    key: this.sObject.name,
                    id: this.record.Id
                };
                Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                    () => {
                        this.sobjMain.dataHasBeenUpdated();
                        this.setEditMode(0, true);
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
    restore(){
        const viewParam = {
            message: this.msgH.get('msg2000170', this.id),
            caption: this.msgH.get('LabelRestore')
        };
        this.messageBox(viewParam).then(
            () => {
                this.blockingUI(true, this.msgH.get('msg2000030')); // データを更新しています
                const req = {
                    action: 'undeleteByIds',
                    key: this.sObject.name,
                    ids: [this.record.Id]
                };
                Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                    () => {
                        this.sobjMain.dataHasBeenUpdated();
                        this.setEditMode(0, true);
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
    showRelationShip(){
        const viewParam = {
            sObject: this.sObject,
            id: this.id,
            readOnly: true,
            caption: (this.id ? this.msgH.get('LabelThatReference', this.id) : this.msgH.get('LabelRelatedData')),
            relationInfo: this.relationInfo
        };
        (new RelationShip(this.tsaMain, this.sObjManager, viewParam)).open().catch(()=>{});
    }
}