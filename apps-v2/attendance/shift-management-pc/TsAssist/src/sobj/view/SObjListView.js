import {BaseView} from "../../_common/BaseView.js?v=XVERSIONX";
import {Util} from "../../_common/Util.js?v=XVERSIONX";
import {ListDLOption} from "../dialog/ListDLOption.js?v=XVERSIONX";
import {FieldUtil}  from "../util/FieldUtil.js?v=XVERSIONX";
/**
 * SObject一覧
 */
export class SObjListView extends BaseView {
    constructor(sobjMain, viewParam){
        super(sobjMain.tsaMain, viewParam);
        this.sobjMain = sobjMain;
    }

    get sObjManager(){ return this.sobjMain.sObjManager; }

    getList(){
        return this.sObjManager.getAll();
    }
    open(hash){
        super.open(hash);
        this.getParentNode().innerHTML = this.getContent();
        this.initListeners();
        this.setLabels();
        this.setNewWindowLink('SObjectNewWindow');
        this.buildTableHead();
        this.buildTableBody();
        this.show();
        this.domH.byId('SObjectListFilter').focus();
    }
    getContent(){
        return `
            <div id="SObjectList">
                <div class="tsa-panel1">
                    <div class="tsa-menu-sobjs">オブジェクト一覧</div>
                    <div style="margin-left:280px;"><a href="" id="SObjectNewWindow" target="_blank"></a></div>
                </div>
                <div class="tsa-error-main" style="display:none;"><div></div></div>
                <div class="tsa-panel1" style="margin:4px 0px;">
                    <div class="tsa-filter-label">フィルタ</div>
                    <div><label><input type="checkbox" id="SObjectNameTS" /><span class="tsa-name-ts">teamspirit__</span></label></div>
                    <div><label><input type="checkbox" id="SObjectNameTSL" /><span class="tsa-name-tsl">tsl__</span></label></div>
                    <div><label><input type="checkbox" id="SObjectListCustom" checked /><span class="tsa-custom-only">カスタムオブジェクトのみ</span></label></div>
                    <div><label><input type="checkbox" id="SObjectListQueryable" checked /><span class="tsa-queryable-only">照会可のみ</span></label></div>
                </div>
                <div class="tsa-panel1" style="margin:4px 0px;">
                    <div class="tsa-quick-find">絞り込み</div>
                    <div class="tsa-filter-input">
                        <div class="tsa-loupe"></div>
                        <div>
                            <input type="text" style="width:200px;" id="SObjectListFilter" autocomplete="off" />
                        </div>
                        <div style="margin:0px;width:15px;">
                            <div class="tsa-clear" id="SObjectListFilterClear" style="display:none;"></div>
                        </div>
                    </div>
                </div>
                <div class="tsa-panel1" style="margin:4px 0px;">
                    <div>
                        <button id="SObjectListDL">ダウンロード</button>
                        <div class="tsa-hint" hintId="HintSObjectDL"></div>
                    </div>
                </div>
                <table class="tsa-sobjs">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
    }
    initListeners(){
        super.initListeners();
        this.setListenerKey(0, this.domH.addListener(window, 'resize', () => { this.windowResize(); }));
        this.setListenerKey(0, this.domH.addListener('SObjectNameTS', 'click', () => { this.buildTableBody(); }));
        this.setListenerKey(0, this.domH.addListener('SObjectNameTSL', 'click', () => { this.buildTableBody(); }));
        this.setListenerKey(0, this.domH.addListener('SObjectListCustom', 'click', () => { this.buildTableBody(); }));
        this.setListenerKey(0, this.domH.addListener('SObjectListQueryable', 'click', () => { this.buildTableBody(); }));
        this.setListenerKey(0, this.domH.addListener('SObjectListFilter', 'input', () => { this.filterByName(); }));
        this.setListenerKey(0, this.domH.addListener('SObjectListFilterClear', 'click', () => { this.filterClear(); }));
        this.setListenerKey(0, this.domH.addListener('SObjectListDL', 'click' , (e) => { this.downloadOption(e); }));
    }
    getTopNode(){
        return this.getParentNode();
    }
    setLabels(){
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-menu-sobjs'), 'LabelSObjectList');
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-filter-label'), 'LabelFilter');
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-quick-find'), 'LabelQuickFind');
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-custom-only'), 'LabelCustomOnly');
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-queryable-only'), 'LabelQueryableOnly');
        this.msgH.setLabelById('SObjectListDL', 'LabelDownload');
        this.msgH.setLabelById('SObjectNewWindow', 'LabelOpenNewWindow');
    }
    windowResize(){
        const tbody = this.getTopNode().querySelector('tbody');
        if(tbody){
            const h = Math.max(window.innerHeight - tbody.getBoundingClientRect().y - 20, 100);
            tbody.style.maxHeight = h + 'px';
        }
    }
    buildTableHead(){
        const thead = this.getTopNode().querySelector('thead');
        this.domH.empty(thead);
        const tr = this.domH.create('tr', null, thead);
        this.domH.create('input', { type: 'checkbox', id: 'SObjectListCheckAll' }, this.domH.create('div', null, this.domH.create('th', null, tr)));
        this.domH.create('div', { innerHTML:this.msgH.get('LabelLabel')  , style:'width:240px;' }, this.domH.create('th', null, tr));
        this.domH.create('div', { innerHTML:this.msgH.get('LabelAPIName'), style:'width:258px;' }, this.domH.create('th', null, tr));
    }
    filterSObjs(so, nameTS, nameTSL, customOnly, queryableOnly){
        if((customOnly && !so.isCustom) || (queryableOnly && !so.isQueryable)){
            return false;
        }
        if(nameTS || nameTSL){
            if(nameTS && so.name.startsWith('teamspirit__')){
                return true;
            }
            if(nameTSL && so.name.startsWith('tsl__')){
                return true;
            }
            return false;
        }
        return true;
    }
    buildTableBody(){
        this.clearListenerKeys(1);
        const tbody = this.getTopNode().querySelector('tbody');
        const nameTS        = document.getElementById('SObjectNameTS').checked;
        const nameTSL       = document.getElementById('SObjectNameTSL').checked;
        const customOnly    = document.getElementById('SObjectListCustom').checked;
        const queryableOnly = document.getElementById('SObjectListQueryable').checked;
        this.domH.empty(tbody);
        this.getList().filter(so => this.filterSObjs(so, nameTS, nameTSL, customOnly, queryableOnly)).forEach((so) => {
            const tr = this.domH.create('tr', { objName:so.name }, tbody);
            this.domH.create('input', { type: 'checkbox' }, this.domH.create('div', null, this.domH.create('td', null, tr)));
            this.domH.create('a', { innerHTML: so.label, title: so.label, href: so.hash }, this.domH.create('div', null, this.domH.create('div', { style: 'width:240px;' }, this.domH.create('td', null, tr))));
            this.domH.create('a', { innerHTML: so.name , title: so.name , href: so.hash }, this.domH.create('div', null, this.domH.create('div', { style: 'width:240px;' }, this.domH.create('td', null, tr))));
            this.domH.create('input', { type:'hidden', value:Util.convertStr(so.label) }, tr);
            this.domH.create('input', { type:'hidden', value:Util.convertStr(so.name)  }, tr);
        });
        this.setListenerKey(1, this.domH.addListener('SObjectListCheckAll', 'click' , () => { this.selectAll(); }));
        this.filterByName();
    }
    selectAll(){
        const tbody = this.getTopNode().querySelector('tbody');
        const checked = this.domH.byId('SObjectListCheckAll').checked;
        tbody.querySelectorAll('input[type="checkbox"').forEach((el) => {
            if(!checked){
                el.checked = false;
            }else{
                // 非表示の行はONにしない
                const tr = this.domH.getAncestorByTagName(el, 'TR');
                if(tr.style.display != 'none'){
                    el.checked = true;
                }
            }
        });
    }
    filterClear(){
        this.domH.byId('SObjectListFilter').value = '';
        this.filterByName();
        this.domH.byId('SObjectListFilter').focus();
    }
    filterByName(){
        const value = Util.convertStr(this.domH.byId('SObjectListFilter').value);
        this.domH.byId('SObjectListFilterClear').style.display = (value ? '' : 'none');
        const tbody = this.getTopNode().querySelector('tbody');
        tbody.querySelectorAll('tr').forEach((tr) => {
            let b = false;
            tr.querySelectorAll('input[type="hidden"]').forEach((el) => {
                if(!value || el.value.indexOf(value) >= 0){
                    b = true;
                }
            });
            tr.style.display = (b ? '' : 'none');
            // 非表示にした行は選択解除する
            const chkbox = tr.querySelector('input[type="checkbox"]');
            if(chkbox && chkbox.checked && !b){
                chkbox.checked = false;
            }
        });
    }
    downloadOption(e){
        (new ListDLOption(this.tsaMain)).open(e.target, 'objListDLOption').then((result) => {
            if(result == 1){
                this.downloadObjList();
            }else if(result == 2){
                this.downloadObjDefine1();
            }else if(result == 3){
                this.downloadObjDefine2();
            }
        }).catch(() => {});
    }
    downloadObjList(){
        // CSVデータ作成
        const datas = [];
        const nameTS        = document.getElementById('SObjectNameTS').checked;
        const nameTSL       = document.getElementById('SObjectNameTSL').checked;
        const customOnly    = document.getElementById('SObjectListCustom').checked;
        const queryableOnly = document.getElementById('SObjectListQueryable').checked;
        this.getList().filter(so => this.filterSObjs(so, nameTS, nameTSL, customOnly, queryableOnly)).forEach((so) => {
            datas.push(so.obj);
        });
        const config = {
            columns: [
                'label','name','keyPrefix','isAccessible','isCreateable','isCustom','isCustomSetting','isDeletable',
                'isDeprecatedAndHidden','isFeedEnabled','isMergeable','isQueryable','isSearchable','isUndeletable','isUpdateable'
            ]
        };
        this.download(`objects${moment().format('YYYYMMDD')}.csv`, Papa.unparse(datas, config));
    }
    getSelectedObjectKeys(){
        const keys = [];
        const tbody = this.getTopNode().querySelector('tbody');
        tbody.querySelectorAll('input[type="checkbox"]:checked').forEach((el) => {
            const tr = this.domH.getAncestorByTagName(el, 'TR');
            const name = tr.getAttribute('objName');
            if(name){
                keys.push(name);
            }
        });
        if(!keys.length){
            this.simpleAlert('対象のオブジェクトをチェックしてください');
            return [];
        }
        return keys;
    }
    downloadObjDefine1(){
        const keys = this.getSelectedObjectKeys();
        if(!keys.length){
            return;
        }
        this.blockingUI(true, this.msgH.get('msg2000020')); // データを読み込んでいます
        this.sObjManager.fetchDefineLoopStart(keys).then(() => {
            const datas = [];
            keys.forEach((key) => {
                const so = this.sObjManager.getByName(key);
                if(so){
                    so.define.fields.forEach((field) => {
                        const f = Object.assign({}, field);
                        f.objectLabel = so.label;
                        f.objectName  = so.name;
                        f.picklistValues = FieldUtil.getPickList(f, true).join('\n');
                        datas.push(f);
                    });
                }
            });
            const config = {
                columns: [
                    'objectLabel','objectName','label','name','localName','typeName','length','precision','scale','referenceTo','picklistValues','getByteLength','getDigits',
                    'isAccessible','isAutoNumber','isCalculated','isCascadeDelete','isCaseSensitive','isCreateable','isCustom','isDefaultedOnCreate','isDependentPicklist',
                    'isDeprecatedAndHidden','isExternalID','isFilterable','isGroupable','isHtmlFormatted','isIdLookup','isNameField','isNamePointing','isNillable',
                    'isPermissionable','isRestrictedDelete','isRestrictedPicklist','isSortable','isUnique','isUpdateable','isWriteRequiresMasterRead'
                ]
            };
            this.download(`fields${moment().format('YYYYMMDD')}.csv`, Papa.unparse(datas, config));
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
        }).then(() => {
            this.blockingUI(false);
        });
    }
    downloadObjDefine2(){
        const keys = this.getSelectedObjectKeys();
        if(!keys.length){
            return;
        }
        this.blockingUI(true, this.msgH.get('msg2000020')); // データを読み込んでいます
        this.sObjManager.fetchDefineLoopStart(keys).then(() => {
            // CSVデータ作成
            const datas = [];
            datas.push(Util.arrayToCsvString([
                    'objectLabel','objectName','label','name','type','length','precision','scale','referenceTo','pickList','helpText','calculatedFormula',
                    'isAutoNumber','isIdLookup','isCalculated','isCustom','isNilable','isUnique','isExternalID','isGroupable','isHtmlFormatted','isRestrictedDelete'
                ]));
            keys.forEach((key) => {
                const so = this.sObjManager.getByName(key);
                if(so){
                    so.fields.filter(field => ['LastReferencedDate','LastViewedDate'].indexOf(field.name) < 0).forEach((field) => {
                        const vals = [];
                        vals.push(so.label);
                        vals.push(so.name);
                        vals.push(field.label);
                        vals.push(field.name);
                        vals.push(field.typeName);
                        vals.push(field.length);
                        vals.push(field.precision);
                        vals.push(field.scale);
                        vals.push((field.referenceTo || []).join(','));
                        vals.push(FieldUtil.getPickList(field, true).join('\n'));
                        vals.push(field.inlineHelpText);
                        vals.push(field.calculatedFormula);
                        vals.push(field.isAutoNumber       ? '○' : '');
                        vals.push(field.isIdLookup         ? '○' : '');
                        vals.push(field.isCalculated       ? '○' : '');
                        vals.push(field.isCustom           ? '○' : '');
                        vals.push(field.isNillable         ? '○' : '');
                        vals.push(field.isUnique           ? '○' : '');
                        vals.push(field.isExternalID       ? '○' : '');
                        vals.push(field.isGroupable        ? '○' : '');
                        vals.push(field.isHtmlFormatted    ? '○' : '');
                        vals.push(field.isRestrictedDelete ? '○' : '');
                        datas.push(Util.arrayToCsvString(vals));
                    });
                }
            });
            this.download(`fields${moment().format('YYYYMMDD')}.csv`, datas.join('\n'));
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
        }).then(() => {
            this.blockingUI(false);
        });
    }
}