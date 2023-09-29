import {BaseView}   from "../../_common/BaseView.js?v=XVERSIONX";
import {Util}       from "../../_common/Util.js?v=XVERSIONX";
import {FieldInfo}  from "../dialog/FieldInfo.js?v=XVERSIONX";
import {FieldUtil}  from "../util/FieldUtil.js?v=XVERSIONX";
/**
 * SObject定義情報
 */
export class SObjFieldView extends BaseView {
    constructor(sobjMain, viewParam){
        super(sobjMain.tsaMain, viewParam);
        this.sobjMain = sobjMain;
        this.sObject = viewParam.sObject;
    }

    get sObjManager(){ return this.sobjMain.sObjManager; }
    /**
     * 初期表示
     */
    open(hash){
        super.open(hash);
        this.getParentNode().innerHTML = this.getContent();
        this.domH.byId('SObjFieldName').innerHTML = this.sObject.label + '  ' + this.sObject.name;
        this.domH.setAttr('SObjFieldName', 'href', this.sObject.hash);
        this.initListeners();
        this.setLabels();
        this.setNewWindowLink('SObjFieldNewWindow');
        this.show();
        this.fetchDefine();
        this.domH.byId('SObjFieldFilter').focus();
    }
    getContent(){
        return `
            <div class="tsa-panel1">
                <div><a href="#!sobjs" class="tsa-menu-sobjs">オブジェクト一覧</a></div>
                <div><a id="SObjFieldName"></a></div>
                <div class="tsa-item-define">項目定義情報</div>
                <div style="margin-left:200px;"><a href="" id="SObjFieldNewWindow" target="_blank"></a></div>
            </div>
            <div class="tsa-panel1" style="margin:4px 0px;">
                <div class="tsa-quick-find">絞り込み</div>
                <div class="tsa-filter-input">
                    <div class="tsa-loupe"></div>
                    <div>
                        <input type="text" style="width:200px;" id="SObjFieldFilter" autocomplete="off" />
                    </div>
                    <div style="margin:0px;width:15px;">
                        <div class="tsa-clear" id="SObjFieldFilterClear" style="display:none;"></div>
                    </div>
                </div>
            </div>
            <div>
                <table id="SObjFieldTable" class="tsa-sobjs" style="display:none;">
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
        this.setListenerKey(0, this.domH.addListener('SObjFieldFilter', 'input', () => { this.filterByName(); }));
        this.setListenerKey(0, this.domH.addListener('SObjFieldFilterClear', 'click', () => { this.filterClear(); }));
    }
    getTopNode(){
        return this.getParentNode();
    }
    setLabels(){
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-menu-sobjs'), 'LabelSObjectList');
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-quick-find'), 'LabelQuickFind');
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-item-define'), 'LabelItemDefine');
        this.msgH.setLabelById('SObjFieldNewWindow', 'LabelOpenNewWindow');
    }
    windowResize(){
        const tbody = document.querySelector('#SObjFieldTable tbody');
        if(tbody){
            const h = Math.max(window.innerHeight - tbody.getBoundingClientRect().y - 20, 100);
            tbody.style.maxHeight = h + 'px';
        }
    }
    fetchDefine(){
        if(this.sObject.define){
            this.showResult();
        }else{
            this.sObjManager.fetchSObjectDefine(this.sObject.key).then((obj) => {
                this.sObject.define = obj;
                this.showResult();
            }).catch((errobj) => {
                this.showError({message: this.msgH.parseErrorMessage(errobj)});
            });
        }
    }
    /**
     * 検索結果を表示
     */
    showResult(){
        this.clearListenerKeys(1);
        const thead = document.querySelector('#SObjFieldTable > thead');
        this.domH.empty(thead);
        const thr = this.domH.create('tr', null, thead);
        this.domH.create('div', { textContent:this.msgH.get('LabelLabel')    , style:'width:200px;' }, this.domH.create('th', null, thr));
        this.domH.create('div', { textContent:this.msgH.get('LabelAPIName')  , style:'width:200px;' }, this.domH.create('th', null, thr));
        this.domH.create('div', { textContent:this.msgH.get('LabelDataType') , style:'width:156px;' }, this.domH.create('th', null, thr));
        this.domH.create('div', { textContent:this.msgH.get('LabelHelpText') , style:'width:280px;' }, this.domH.create('th', null, thr));
        this.domH.create('div', { textContent:this.msgH.get('LabelFormula')  , style:'width:298px;' }, this.domH.create('th', null, thr));

        const tbody = document.querySelector('#SObjFieldTable > tbody');
        this.domH.empty(tbody);
        this.sObject.fields.forEach((field) => {
            const typeName = FieldUtil.getFieldTypeName(this.sObjManager, this.msgH, field, true);
            const tr = this.domH.create('tr', { className:'tsa-popval' }, tbody);
            const f = field;
            this.domH.create('div', { textContent:f.label            , title:f.label             }, this.domH.create('div', { style:'width:200px;' }, this.domH.create('td', null, tr)));
            this.domH.create('div', { textContent:f.name             , title:f.name              }, this.domH.create('div', { style:'width:200px;' }, this.domH.create('td', null, tr)));
            this.domH.create('div', { textContent:typeName           , title:typeName            }, this.domH.create('div', { style:'width:156px;' }, this.domH.create('td', null, tr)));
            this.domH.create('div', { textContent:f.inlineHelpText   , title:f.inlineHelpText    }, this.domH.create('div', { style:'width:280px;' }, this.domH.create('td', null, tr)));
            this.domH.create('div', { textContent:f.calculatedFormula, title:f.calculatedFormula }, this.domH.create('div', { style:'width:280px;' }, this.domH.create('td', null, tr)));
            this.domH.create('input', { type:'hidden', value:Util.convertStr(f.label) }, tr);
            this.domH.create('input', { type:'hidden', value:Util.convertStr(f.name)  }, tr);
            this.domH.create('input', { type:'hidden', value:Util.convertStr(typeName) + ' ' + f.typeName }, tr);
            this.setListenerKey(1, this.domH.addListener(tr, 'click' , () => {
                this.showFieldInfo(field);
            }));
        });
        this.domH.byId('SObjFieldTable').style.display = '';
        this.blockingUI(false);
        this.windowResize();
    }
    filterClear(){
        this.domH.byId('SObjFieldFilter').value = '';
        this.filterByName();
        this.domH.byId('SObjFieldFilter').focus();
    }
    filterByName(){
        const value = Util.convertStr(this.domH.byId('SObjFieldFilter').value);
        this.domH.byId('SObjFieldFilterClear').style.display = (value ? '' : 'none');
        const tbody = document.querySelector('#SObjFieldTable > tbody');
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
    showFieldInfo(field){
        const dialog = new FieldInfo(this.tsaMain, this.sObjManager, { field:field, define:true, readOnly:true, caption:'項目情報' });
        dialog.open().then(() => {},() => {});
    }
}