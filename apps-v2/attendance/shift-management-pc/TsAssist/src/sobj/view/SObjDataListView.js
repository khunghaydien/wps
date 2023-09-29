import {BaseView}   from "../../_common/BaseView.js?v=XVERSIONX";
import {Util}       from "../../_common/Util.js?v=XVERSIONX";
import {Remoting}   from "../../_common/Remoting.js?v=XVERSIONX";
/**
 * SObjectデータ検索画面
 */
export class SObjDataListView extends BaseView {
    constructor(sobjMain, viewParam){
        super(sobjMain.tsaMain, viewParam);
        this.sobjMain = sobjMain;
        this.sObject = viewParam.sObject;
        this.where = viewParam.where;
        this.searchParam = {
            sObject: this.sObject,
            offset: 0,
            limit: 40
        };
        this.tableListeners = [];
        this.records = null;
        this.refresh = false;
        this.editMode = 0;
    }

    get sObjManager(){ return this.sobjMain.sObjManager; }
    /**
     * 初期表示
     */
    open(hash){
        super.open(hash);
        this.getParentNode().innerHTML = this.getContent();
        document.getElementById('SObjDataListName').innerHTML = this.sObject.label + '  ' + this.sObject.name;
        this.initListeners();
        this.setLabels();
        this.setCntPerPage();
        this.setNewWindowLink('SObjDataListNewWindow');
        this.show();
        if(!this.sObject.define){
            this.fetchSObjectDefine();
        }else{
            this.afterBuild();
        }
    }
    getContent(){
        return `
            <div class="tsa-panel1">
                <div><a href="#!sobjs" class="tsa-menu-sobjs">オブジェクト一覧</a></div>
                <div id="SObjDataListName"></div>
                <div style="margin-left:200px;"><a href="#!sobjs" id="SObjDataListNewWindow" target="_blank"></a></div>
            </div>
            <div class="tsa-error-main" style="display:none;"><div></div></div>
            <div>
                <div class="tsa-panel1">
                    <div style="width:50px;">where   </div><div><input type="text" id="SObjDataListWhere" style="width:800px;" /></div>
                </div>
                <div class="tsa-panel1">
                    <div style="width:50px;">order by</div><div><input type="text" id="SObjDataListOrder" style="width:800px;" /></div>
                </div>
            </div>
            <div class="tsa-panel1">
                <div>
                    <label><input type="checkbox" id="SObjDataListAllRows" /> <span class="tsa-include-trash">ゴミ箱のレコードも含める</span></label>
                </div>
                <div>
                    <div class="tsa-hint" hintId="HintSObjectListAllRows"></div>
                </div>
                <div style="margin-left:10px;">
                    <a href="#!sobj-field:${this.sObject.key}" class="tsa-item-define">項目定義情報</a>
                </div>
            </div>
            <div class="tsa-panel1">
                <div><button id="SObjDataListSearch"  >検索</button></div>
                <div>
                    <button id="SObjDataListDL">ダウンロード</button>
                    <div class="tsa-hint" hintId="HintSObjectDataDL"></div>
                </div>
                <div>
                    <button id="SObjDataListMainte" class="tsa-mainte">メンテナンスモードへ</button>
                </div>
                <div class="tsa-deletable" style="display:none;">
                    <button id="SObjDataListDelete">削除</button>
                    <div class="tsa-hint" hintId="HintSObjectDelete"></div>
                </div>
                <div class="tsa-restorable" style="display:none;">
                    <button id="SObjDataListRestore">復元</button>
                    <div class="tsa-hint" hintId="HintSObjectRestore"></div>
                </div>
                <div class="tsa-creatable" style="display:none;">
                    <button id="SObjDataListCreate">新規</button>
                    <div class="tsa-hint" hintId="HintSObjectListNew"></div>
                </div>
            </div>
            <div id="SObjDataListPager" class="tsa-pager1" style="display:none;">
                <div><button id="SObjDataListPrev">＜</button></div>
                <div><select id="SObjDataListPageNo"></select></div>
                <div><span id="SObjDataListPageSize"></span></div>
                <div><button id="SObjDataListNext">＞</button></div>
                <div><div id="SObjDataListPage"></div></div>
                <div class="tsa-hint" hintId="HintSObjectListPage"></div>
                <div style="margin-left:30px;"><div id="SObjDataListRowsPerPageLabel"></div></div>
                <div><select id="SObjDataListRowsPerPage"></select></div>
            </div>
            <div>
                <table id="SObjDataListTable" class="tsa-sobj" style="display:none;">
                    <thead></thead>
                    <tbody></tbody>
                </table>
                <span id="SObjDataListText"></span>
            </div>
        `;
    }
    /**
     * イベントリスナーをセット
     */
     initListeners(){
        super.initListeners();
        this.setListenerKey(0, this.domH.addListener('SObjDataListSearch'     , 'click' , () => { this.search(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataListDL'         , 'click' , () => { this.downloadDataList(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataListPageNo'     , 'change', () => { this.search(this.domH.byId('SObjDataListPageNo').value); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataListPrev'       , 'click' , () => { this.search(0, -1); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataListNext'       , 'click' , () => { this.search(0, 1); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataListMainte'     , 'click' , () => { this.toggleEditMode(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataListDelete'     , 'click', () => { this.delete(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataListRestore'    , 'click', () => { this.restore(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataListCreate'     , 'click', () => { this.newData(); }));
        this.setListenerKey(0, this.domH.addListener('SObjDataListRowsPerPage', 'change', () => { this.changeCntPerPage(); }));
    }
    getTopNode(){
        return this.getParentNode();
    }
    setLabels(){
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-menu-sobjs'), 'LabelSObjectList');
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-include-trash'), 'LabelIncludeTrash');
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-item-define'), 'LabelItemDefine');
        this.msgH.setLabelById('SObjDataListDL', 'LabelDownload');
        this.msgH.setLabelById('SObjDataListSearch', 'LabelSearch');
        this.msgH.setLabelById('SObjDataListDelete', 'LabelDelete');
        this.msgH.setLabelById('SObjDataListRestore', 'LabelRestore');
        this.msgH.setLabelById('SObjDataListCreate', 'LabelNew');
        this.msgH.setLabelById('SObjDataListMainte', 'LabelMainteOn');
        this.msgH.setLabelById('SObjDataListRowsPerPageLabel', 'LabelRowsPerPage');
        this.msgH.setLabelById('SObjDataListNewWindow', 'LabelOpenNewWindow');
    }
    setCntPerPage(){
        const select = this.domH.byId('SObjDataListRowsPerPage');
        this.domH.empty(select);
        [40,50,100,150,200].forEach((n) => {
            this.domH.create('option', { value:''+n, innerHTML:''+n }, select);
        });
        select.value = ''+(this.searchParam.limit);
    }
    changeCntPerPage(){
        const select = this.domH.byId('SObjDataListRowsPerPage');
        this.searchParam.limit = parseInt(select.value, 10);
        this.search();
    }
    /**
     * 定義情報を読み込み
     */
    fetchSObjectDefine(){
        this.blockingUI(true, this.msgH.get('msg2000020')); // データを読み込んでいます
        this.sObjManager.fetchSObjectDefine(this.sObject.key).then((obj) => {
            this.sObject.define = obj;
            this.afterBuild();
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
            this.blockingUI(false);
        });
    }
    afterBuild(){
        if(this.where){
            this.domH.byId('SObjDataListWhere').value = this.where;
            this.search();
        }else{
            this.blockingUI(false);
        }
    }
    dataHasBeenUpdated(){
        this.refresh = (this.records && this.records.length);
    }
    /**
     * 検索
     */
    search(pageNo, increment){
        if(typeof(this.searchParam.dataSize) != 'number' && pageNo !== undefined){
            return;
        }
        const searchParam = Object.assign({}, this.searchParam);
        const pn = (typeof(pageNo) == 'string' ? parseInt(pageNo, 10) : (pageNo || 0));
        if(pn > 0){
            searchParam.offset = searchParam.limit * (pn - 1);
        }else if(typeof(increment) == 'number'){
            searchParam.offset += (searchParam.limit * increment);
        }else{
            searchParam.offset = 0;
        }
        if(searchParam.offset < 0){
            searchParam.offset = 0;
        }else if(searchParam.offset > 0){
            const offsetMax = (Math.ceil(searchParam.dataSize / searchParam.limit) - 1) * searchParam.limit;
            if(searchParam.offset > offsetMax){
                searchParam.offset = offsetMax;
            }
        }
        searchParam.where   = document.getElementById('SObjDataListWhere').value.trim();
        searchParam.orderBy = document.getElementById('SObjDataListOrder').value.trim();
        searchParam.allRows = document.getElementById('SObjDataListAllRows').checked;

        if(pageNo !== undefined
        && typeof(this.searchParam.dataSize) == 'number'
        && searchParam.offset  == this.searchParam.offset
        && searchParam.limit   == this.searchParam.limit
        && searchParam.where   == this.searchParam.where
        && searchParam.orderBy == this.searchParam.orderBy
        && searchParam.allRows == this.searchParam.allRows
        ){
            return;
        }
        if(searchParam.offset > 0){
            if(searchParam.where != this.searchParam.where
            || searchParam.orderBy != this.searchParam.orderBy
            || searchParam.allRows != this.searchParam.allRows
            ){
                searchParam.offset = 0;
            }
        }
        this.searchParam = searchParam;
        this.hideError();
        this.blockingUI(true, this.msgH.get('msg2000050')); // データを検索しています

        this.sObjManager.fetchRecordBySoqlStart(this.searchParam).then((records) => {
            this.records = records || [];
            this.showResult(records || []);
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
            this.blockingUI(false);
        });
    }
    /**
     * 
     * @searchParam {number} pageSize 
     * @searchParam {number} pageNo 
     */
    setPager(pageSize, pageNo){
        const select = this.domH.byId('SObjDataListPageNo');
        this.domH.empty(select);
        const pageMax = Math.min(pageSize, Math.ceil(2000 / this.searchParam.limit));
        for(let n = 1 ; n <= pageMax ; n++){
            this.domH.create('option', { value:''+n, innerHTML:''+n }, select);
        }
        select.value = ''+pageNo;
        this.domH.byId('SObjDataListPageSize').innerHTML = '/ ' + pageSize;
        this.domH.setAttr('SObjDataListPrev', 'disabled', !(pageNo > 1));
        this.domH.setAttr('SObjDataListNext', 'disabled', !(pageNo < pageMax));
        this.domH.byId('SObjDataListPager').style.display = '';
    }
    adjustHead(name){
        const m = /^(([^.]+)__)([^.]+)__[cr]/.exec(name);
        if(m){
            const p1 = m[1];
            const p2 = name.substring(p1.length);
            return `<span style="font-size:80%;">${p1}</span><br/>${p2}`;
        }
        return name;
    }
    /**
     * 検索結果を表示
     */
    showResult(records){
        const searchParam = this.searchParam;
        const pageSize = (searchParam.dataSize > 0 ? Math.ceil(searchParam.dataSize / searchParam.limit) : 1);
        const pageNo   = (searchParam.offset   > 0 ? Math.floor(searchParam.offset  / searchParam.limit) + 1 : 1);
        this.setPager(pageSize, pageNo);
        this.domH.byId('SObjDataListPage').innerHTML = (searchParam.limit < searchParam.dataSize
            ? this.msgH.get('LabelDispNumRange', searchParam.dataSize, searchParam.offset+1, searchParam.offset+records.length)
            : this.msgH.get('LabelDispNum', searchParam.dataSize)
        );
        this.clearListenerKeys(1);
        const names = this.sObject.getSoqlFieldNames();
        {
            const thead = document.querySelector('#SObjDataListTable > thead');
            this.domH.empty(thead);
            {
                const tr = this.domH.create('tr', null, thead);
                this.domH.create('div', null, this.domH.create('th', null, tr));
                names.forEach((name) => {
                    const field = this.sObject.getFieldByName(name);
                    this.domH.create('div', { textContent:(field ? field.label : ''), style:'font-size:80%;' }, this.domH.create('th', null, tr));
                });
            }
            {
                const tr = this.domH.create('tr', null, thead);
                this.domH.create('input', { type: 'checkbox', id: 'objViewCheckAll' }, this.domH.create('div', null, this.domH.create('th', null, tr)));
                names.forEach((name) => {
                    this.domH.create('div', { innerHTML:this.adjustHead(name), style:'line-height:13px;' }, this.domH.create('th', null, tr));
                });
            }
            this.domH.toggleClass(thead, 'body-empty', (!records.length));
        }
        {
            const tbody = document.querySelector('#SObjDataListTable > tbody');
            this.domH.empty(tbody);
            records.forEach((record) => {
                const tr = this.domH.create('tr', { dataId:record.Id }, tbody);
                this.domH.toggleClass(tr, 'tsa-deleted', record.IsDeleted);
                this.domH.create('input', { type: 'checkbox' }, this.domH.create('div', null, this.domH.create('td', null, tr)));
                names.forEach((name) => {
                    const v = Util.parseValue(record, name);
                    const align = this.getAlignByFieldName(this.sObject.getFieldByName(name));
                    const div = this.domH.create('div', null, this.domH.create('td', { style:`text-align:${align};` }, tr));
                    if(this.sObject.isReferenceField(name)){
                        this.domH.create('a', { textContent:v, href:'#!sobj:'+v }, this.domH.create('div', null, div));
                    }else{
                        this.domH.create('div', { textContent:v, title:v }, div);
                    }
                });
            });
            this.setListenerKey(1, this.domH.addListener('objViewCheckAll', 'click' , () => {
                const checked = this.domH.byId('objViewCheckAll').checked;
                tbody.querySelectorAll('input[type="checkbox"').forEach((el) => {
                    el.checked = checked;
                });
            }));
        }
        this.editMode = 0;
        this.setButtons();
        this.domH.byId('SObjDataListTable').style.display = '';
        this.blockingUI(false);
    }
    getAlignByFieldName(field){
        if(field && field.typeName == 'DOUBLE'){
            return 'right';
        }
        return 'left';
    }
    show(){
        this.editMode = 0;
        this.setButtons();
        if(this.refresh){
            this.search();
        }
        super.show();
    }
    toggleEditMode(){
        this.editMode = (this.editMode ? 0 : 1);
        this.setButtons();
    }
    setButtons(){
        const area = this.domH.byId(this.parentId);
        const mode = this.editMode;
        // データ修正ボタン
        this.msgH.setLabelById('SObjDataListMainte', (mode > 0 ? 'LabelMainteOff' : 'LabelMainteOn'));
        // 削除、復元ボタン
        area.querySelectorAll('.tsa-deletable,.tsa-restorable,.tsa-creatable').forEach((el) => {
            el.style.display = (mode == 1 ? '' : 'none');
        });
    }
    downloadDataList(){
        this.blockingUI(true, this.msgH.get('msg2000050')); // データを検索しています
        // 検索条件に該当するデータを読み込み
        const searchParam = Object.assign({}, this.searchParam);
        searchParam.offset = 0;
        searchParam.where   = document.getElementById('SObjDataListWhere').value.trim();
        searchParam.orderBy = 'ID'; // 全件読み込みの場合、並び順はID固定
        searchParam.allRows = document.getElementById('SObjDataListAllRows').checked;
        this.sObjManager.fetchRecordLoopStart(searchParam).then((records) => {
            // CSVデータ作成
            const datas = [];
            const labNames = this.sObject.getSoqlFieldLabelNames(true);
            datas.push(Util.arrayToCsvString(labNames.labels));
            datas.push(Util.arrayToCsvString(labNames.names));
            records.forEach((record) => {
                const vals = [];
                labNames.names.forEach((name) => {
                    vals.push(Util.parseValue(record, name));
                });
                datas.push(Util.arrayToCsvString(vals));
            });
            this.download(this.sObject.name + '.csv', datas.join('\n'));
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
        }).then(() => {
            this.blockingUI(false);
        });
    }
    /**
     * 選択行のIDの配列を返す
     * @param {boolean} flag false:削除済みでないレコード  true:削除済みのレコード
     * @returns {Array.<string>}
     */
    getSelectedIds(flag){
        const ids = [];
        const tbody = document.querySelector('#SObjDataListTable > tbody');
        tbody.querySelectorAll('input[type="checkbox"]:checked').forEach((el) => {
            const tr = this.domH.getAncestorByTagName(el, 'TR');
            const dataId = tr.getAttribute('dataId');
            const c = tr.classList.contains('tsa-deleted');
            if((!flag && !c) || (flag && c)){
                ids.push(dataId);
            }
        });
        return ids;
    }
    newData(){
        location.href = `#!sobj-new:${this.sObject.key}`;
    }
    delete(){
        const ids = this.getSelectedIds(false);
        if(!ids.length){
            this.simpleAlert(this.msgH.get('msg2000110'), this.msgH.get('LabelDelete'));
            return;
        }
        const viewParam = {
            messages: [this.msgH.get('msg2000120', ids.length), this.msgH.get('msg2000130')],
            caption:this.msgH.get('LabelDelete')
        };
        this.messageBox(viewParam).then(
            () => {
                this.blockingUI(true, this.msgH.get('msg2000030')); // データを更新しています
                const req = {
                    action: 'deleteByIds',
                    key: this.sObject.name,
                    ids: ids
                };
                Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                    () => {
                        this.sobjMain.dataHasBeenUpdated();
                        this.search();
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
        const ids = this.getSelectedIds(true);
        if(!ids.length){
            this.simpleAlert(this.msgH.get('msg2000140'), this.msgH.get('LabelRestore'));
            return;
        }
        const viewParam = {
            message: this.msgH.get('msg2000150', ids.length),
            caption: this.msgH.get('LabelRestore')
        };
        this.messageBox(viewParam).then(
            () => {
                this.blockingUI(true, this.msgH.get('msg2000030')); // データを更新しています
                const req = {
                    action: 'undeleteByIds',
                    key: this.sObject.name,
                    ids: ids
                };
                Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
                    () => {
                        this.sobjMain.dataHasBeenUpdated();
                        this.search();
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