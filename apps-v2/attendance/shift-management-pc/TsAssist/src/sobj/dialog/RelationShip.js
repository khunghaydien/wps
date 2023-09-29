import {BaseDialog} from "../../_common/BaseDialog.js?v=XVERSIONX";
import {Util}       from "../../_common/Util.js?v=XVERSIONX";
/**
 * 関連データ
 */
export class RelationShip extends BaseDialog {
    constructor(tsaMain, sObjManager, viewParam){
        super(tsaMain, viewParam);
        this.sObjManager = sObjManager;
        this.sObject = viewParam.sObject;
        this.id = viewParam.id;
        this.relationInfo = viewParam.relationInfo || {};
    }
    getContent(){
        return `
            <div class="tsa-panel1">
                <div>
                    <label><input type="checkbox" id="objRelationShipCustomOnly" checked />${this.msgH.get('LabelCustomOnly')}</label>
                </div>
                <div><label><input type="checkbox" id="objRelationShipQueryableOnly" checked />${this.msgH.get('LabelQueryableOnly')}</label></div>
            </div>
            <table id="objRelationShip" class="tsa-sobjs">
                <thead>
                </thead>
                <tbody>
                </tbody>
            </table>
            <div class="tsa-panel1">
                <div style="display:${(this.id?'':'none')};">
                    <button id="objRelationShipCount" style="padding:2px 16px;">${this.msgH.get('LabelCountTheNumber')}</button>
                    <div class="tsa-hint" hintId="HintSObjectRelationShipCount"></div>
                </div>
                <div>
                    <button id="objRelationShipCopy" style="padding:2px 16px;">${this.msgH.get('LabelCopyToClipboard')}</button>
                    <div class="tsa-hint" hintId="HintSObjectRelationShipCopy"></div>
                </div>
            </div>
        `;
    }
    buildContent(){
        super.buildContent();
        const thead = document.querySelector('#objRelationShip thead');
        this.domH.empty(thead);
        const tr = this.domH.create('tr', null, thead);
        this.domH.create('div', { innerHTML:this.msgH.get('LabelLabel')       , style:'width:180px;' }, this.domH.create('th', null, tr));
        this.domH.create('div', { innerHTML:this.msgH.get('LabelAPIName')     , style:'width:180px;' }, this.domH.create('th', null, tr));
        this.domH.create('div', { innerHTML:this.msgH.get('LabelFieldName')   , style:'width:160px;' }, this.domH.create('th', null, tr));
        this.domH.create('div', { innerHTML:this.msgH.get('LabelChildRelName'), style:'width:180px;' }, this.domH.create('th', null, tr));
        const th1 = this.domH.create('div', { style:'width:36px;' }, this.domH.create('th', null, tr));
        const th2 = this.domH.create('div', { style:'width:36px;' }, this.domH.create('th', null, tr));
        const th3 = this.domH.create('div', { style:'width:68px;' }, this.domH.create('th', null, tr));
        this.domH.create('div', { innerHTML:'C'    }, th1);
        this.domH.create('div', {  className:'tsa-hint', hintId:'HintSObjectCascadeDel'  , style:'margin-left:0px;' }, th1);
        this.domH.create('div', { innerHTML:'R'    }, th2);
        this.domH.create('div', { className:'tsa-hint', hintId:'HintSObjectRestictedDel', style:'margin-left:0px;' }, th2);
        this.domH.create('div', { innerHTML:this.msgH.get('LabelNumber') }, th3);
        this.domH.create('div', { className:'tsa-hint', hintId:'HintSObjectRelationCount', style:'margin-left:0px;' }, th3);
        this.buildTableBody();
    }
    buildTableBody(){
        this.clearListenerKeys(1);
        const tbody = document.querySelector('#objRelationShip tbody');
        const customOnly    = document.getElementById('objRelationShipCustomOnly').checked;
        const queryableOnly = document.getElementById('objRelationShipQueryableOnly').checked;
        this.domH.empty(tbody);
        this.sObject.define.childRelationships.forEach((child) => {
            const so = this.sObjManager.getByName(child.objectName);
            if((!customOnly || so.isCustom) && (!queryableOnly || so.isQueryable)){
                const key = `${child.objectName}:${child.fieldName}`;
                const tr = this.domH.create('tr', { data:key }, tbody);
                const where = (this.id ? `${child.fieldName}='${this.id}'` : '');
                const hash = (where ? (so.hash + ':' + encodeURIComponent(where)) : so.hash);
                this.domH.create('a', { oh2:(so && so.label || ''), href:hash }, this.domH.create('div', null, this.domH.create('div', { style:'width:180px;' }, this.domH.create('td', null, tr))));
                this.domH.create('a', { oh2:child.objectName      , href:hash }, this.domH.create('div', null, this.domH.create('div', { style:'width:180px;' }, this.domH.create('td', null, tr))));
                this.domH.create('div', { oh2:child.fieldName                        }, this.domH.create('div', { style:'width:160px;' }, this.domH.create('td', null, tr)));
                this.domH.create('div', { oh2:child.relationshipName || ''           }, this.domH.create('div', { style:'width:180px;' }, this.domH.create('td', null, tr)));
                this.domH.create('div', { oh2:(child.isCascadeDelete    ? '○' : '') }, this.domH.create('div', { style:'width:36px;'  }, this.domH.create('td', { style:'text-align:center;' }, tr)));
                this.domH.create('div', { oh2:(child.isRestrictedDelete ? '○' : '') }, this.domH.create('div', { style:'width:36px;'  }, this.domH.create('td', { style:'text-align:center;' }, tr)));
                this.setDataCountLink(key, this.domH.create('div', null, this.domH.create('div', { style:'width:50px;' }, this.domH.create('td', { style:'text-align:right;' }, tr))));
            }
        });
        tbody.querySelectorAll('a.tsa-count-check').forEach((el) => {
            this.setListenerKey(1, this.domH.addListener(el, 'click' , (e) => { this.countReference(e); }));
        });
    }
    setDataCountLink(key, el){
        const p = this.relationInfo[key];
        if(!this.id){
            el.innerHTML = '-';
        }else if(!p){
            this.domH.create('a', { innerHTML:'(click)', className:'tsa-count-check' }, el);
        }else if(Util.isNum(p.cnt)){
            const data = key.split(/:/);
            const so = this.sObjManager.getByName(data[0]);
            const hash = so.hash + ':' + encodeURIComponent(`${data[1]}='${this.id}'`);
            this.domH.create('a', { innerHTML:p.cnt, href:hash }, el);
        }else if(p.errmsg){
            el.innerHTML = 'err';
            el.title = p.errmsg;
        }else{
            el.innerHTML = '-';
            el.title = this.msgH.get('msg2000220');
        }
    }
    windowResize(){
        const tbody = document.querySelector('#objRelationShip tbody');
        tbody.style.maxHeight = Math.max(window.innerHeight - 170, 80) + 'px';
        super.windowResize();
    }
    initListeners(){
        super.initListeners();
        this.setListenerKey(0, this.domH.addListener('objRelationShipCount', 'click', () => {
            this.blockingUI(true, this.msgH.get('msg2000040')); // データを数えています
            this.countReferenceLoop(0);
        }));
        this.setListenerKey(0, this.domH.addListener('objRelationShipCopy', 'click', () => {
            this.copyToClipboard();
        }));
        this.setListenerKey(0, this.domH.addListener('objRelationShipCustomOnly', 'click', () => {
            this.buildTableBody();
            this.windowResize();
        }));
        this.setListenerKey(0, this.domH.addListener('objRelationShipQueryableOnly', 'click', () => {
            this.buildTableBody();
            this.windowResize();
        }));
    }
    copyToClipboard(){
        const data = [];
        data.push([
            this.msgH.get('LabelLabel'),
            this.msgH.get('LabelAPIName'),
            this.msgH.get('LabelFieldName'),
            this.msgH.get('LabelChildRelName'),
            'isCascadeDelete',
            'isRestrictedDelete',
            this.msgH.get('LabelNumber')
        ].join('\t'));
        const customOnly    = document.getElementById('objRelationShipCustomOnly').checked;
        const queryableOnly = document.getElementById('objRelationShipQueryableOnly').checked;
        this.sObject.define.childRelationships.forEach((child) => {
            const so = this.sObjManager.getByName(child.objectName);
            const key = `${child.objectName}:${child.fieldName}`;
            const p = this.relationInfo[key];
            const vals = [];
            if((!customOnly || so.isCustom) && (!queryableOnly || so.isQueryable)){
                vals.push((so && so.label || ''));
                vals.push(child.objectName);
                vals.push(child.fieldName);
                vals.push(child.relationshipName || '');
                vals.push((child.isCascadeDelete    ? '○' : ''));
                vals.push((child.isRestrictedDelete ? '○' : ''));
                if(!p){
                    vals.push('');
                }else if(Util.isNum(p.cnt)){
                    vals.push(p.cnt);
                }else if(p.errmsg){
                    vals.push('err');
                }else{
                    vals.push('-');
                }
                data.push(vals.join('\t'));
            }
        });
        navigator.clipboard.writeText(data.join('\n')).catch(()=>{});
    }
    countReference(e){
        const tr = this.domH.getAncestorByTagName(e.target, 'TR');
        if(tr){
            this.countReferenceLoop(tr.rowIndex - 1, true);
        }
    }
    countReferenceLoop(index, flag){
        const tbody = document.querySelector('#objRelationShip tbody');
        if(index < tbody.rows.length){
            this.blockingUI(true, this.msgH.get('msg2000040') // データを数えています
                    + (flag ? '' : `<br/>${(index+1)}/${(tbody.rows.length)}`));
            const tr = tbody.rows[index];
            if((tbody.scrollTop + tbody.clientHeight) < tr.offsetTop){
                tbody.scrollTop = (tr.offsetTop + 30 - tbody.clientHeight);
            }else if((tr.offsetTop - 22) < tbody.scrollTop){
                tbody.scrollTop = (tr.offsetTop - 22);
            }
            const key = tr.getAttribute('data') || '';
            const data = key.split(/:/);
            if(data.length == 2){
                const el = tr.querySelector('td:last-child > div > div');
                this.domH.empty(el);
                const so = this.sObjManager.getByName(data[0]);
                if(so && so.isQueryable){
                    const where = `${data[1]}='${this.id}'`;
                    this.sObjManager.fetchRecordCount({ sObject:so, where:where }).then(
                        (cnt) => {
                            this.relationInfo[key] = {cnt:cnt};
                            this.setDataCountLink(key, el);
                            if(!flag){
                                this.countReferenceLoop(index + 1);
                            }else{
                                this.blockingUI(false);
                            }
                        },
                        (errobj) => {
                            this.relationInfo[key] = {errmsg:this.msgH.parseErrorMessage(errobj)};
                            this.setDataCountLink(key, el);
                            if(!flag){
                                this.countReferenceLoop(index + 1);
                            }else{
                                this.blockingUI(false);
                            }
                        }
                    );
                }else{
                    this.relationInfo[key] = {};
                    this.setDataCountLink(key, el);
                    if(!flag){
                        this.countReferenceLoop(index + 1);
                    }else{
                        this.blockingUI(false);
                    }
                }
            }
        }else{
            this.blockingUI(false);
        }
    }
}