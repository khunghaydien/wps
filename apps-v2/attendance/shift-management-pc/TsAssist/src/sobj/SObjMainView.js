import {BaseView}            from "../_common/BaseView.js?v=XVERSIONX";
import {SObjManager}         from "./SObjManager.js?v=XVERSIONX";
import {SObjListView}        from "./view/SObjListView.js?v=XVERSIONX";
import {SObjDataListView}    from "./view/SObjDataListView.js?v=XVERSIONX";
import {SObjDataView}        from "./view/SObjDataView.js?v=XVERSIONX";
import {SObjFieldView}       from "./view/SObjFieldView.js?v=XVERSIONX";

/**
 * SObjectメイン画面
 */
export class SObjMainView extends BaseView {
    constructor(tsaMain){
        super(tsaMain, null);
        this.parentId = tsaMain.baseId;
        this._sObjManager = new SObjManager();
        this.layers = [null, null, null];
        this.prefixHash = '#!sobj';
    }
    get sObjManager(){ return this._sObjManager; }

    open(hash){
        if(hash == '#!sobjs'){
            this.openLayer1(hash);
        }else{
            const m1 = /^#!sobj-search:([^:]+):?(.*)$/.exec(hash);
            if(m1){
                this.openLayer2(hash, m1[1], m1[2]);
            }else{
                const m2 = /^#!sobj-field:(.+)$/.exec(hash);
                if(m2){
                    this.openLayer3(hash, 1, m2[1]);
                }else{
                    const m3 = /^#!sobj-new:([^:]+):?(.*)$/.exec(hash);
                    if(m3){
                        this.openLayer3(hash, 2, m3[1], m3[2]);
                    }else{
                        const m4 = /^#!sobj:(.+)$/.exec(hash);
                        if(m4){
                            this.openLayer3(hash, 3, m4[1]);
                        }else{
                            this.tsaMain.setDefaultHash();
                        }
                    }
                }
            }
        }
    }
    buildArea(){
        if(!this.domH.byId('sObjLayer1')){
            this.domH.empty(this.baseId);
            document.getElementById(this.baseId).innerHTML = this.getContent();
        }
    }
    getContent(){
        return `
            <div>
                <div class="tsa-error" style="display:none;"><div></div></div>
                <div id="sObjLayer1"></div>
                <div id="sObjLayer2"></div>
                <div id="sObjLayer3"></div>
            </div>
        `;
    }
    dataHasBeenUpdated(){
        if(this.layers[1]){
            this.layers[1].dataHasBeenUpdated();
        }
        if(this.layers[2]){
            this.layers[2].dataHasBeenUpdated();
        }
    }
    destroy(){
        for(let x = this.layers.length - 1 ; x >= 0 ; x--){
            if(this.layers[x]){
                this.layers[x].destroy();
                this.layers[x] = null;
            }
        }
        super.destroy();
    }
    /**
     * 画面切替
     * @param {number} layerNo 0～2
     * @param {string} hash 
     * @returns {boolean} true:既存のViewに切替を行った false:既存Viewなしか既存Viewを破棄を行った
     */
    changeLayer(layerNo, hash){
        // 各レイヤーにViewインスタンスがあればいったん非表示にする
        for(let x = this.layers.length - 1 ; x >= 0 ; x--){
            if(this.layers[x]){
                this.layers[x].hide();
            }
        }
        // 引数のlayerNoにViewインスタンスがある場合、
        // ハッシュ値が同じなら再表示してtrueを返す。異なるなら破棄してfalseを返す。
        if(this.layers[layerNo]){
            if(this.layers[layerNo].getHash() == hash){
                this.layers[layerNo].show();
                this.blockingUI(false);
                return true;
            }
            this.layers[layerNo].destroy();
            this.layers[layerNo] = null;
        }
        return false;
    }
    /**
     * SObject一覧
     * @param {string} hash 
     */
    openLayer1(hash){
        this.buildArea();
        if(this.changeLayer(0, hash)){
            return;
        }
        this.sObjManager.ready().then(() => {
            this.layers[0] = new SObjListView(this, {parentId:'sObjLayer1'});
            this.layers[0].open(hash);
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
        }).then(() => {
            this.blockingUI(false);
        });
    }
    /**
     * SObjectデータ検索
     * @param {string} hash 
     * @param {string} key SObject名
     * @param {string=} where 検索条件
     * @returns 
     */
    openLayer2(hash, key, where){
        this.buildArea();
        if(this.changeLayer(1, hash)){
            return;
        }
        this.sObjManager.ready().then(() => {
            const so = this.sObjManager.getByName(key);
            this.layers[1] = new SObjDataListView(this, {parentId:'sObjLayer2', sObject:so, where:decodeURIComponent(where)});
            this.layers[1].open(hash);
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
            this.blockingUI(false);
        });
    }
    /**
     * SObjectデータ表示 OR 新規/複製 OR 項目定義
     * @param {string} hash 
     * @param {number} type 1:項目定義  2:新規/複製  3:データ表示
     * @param {string} key1 type==3の場合はId、それ以外はSObject名
     * @param {string} key2 type==2かつ複製の場合は複製元のId
     * @returns 
     */
    openLayer3(hash, type, key1, key2){
        this.buildArea();
        if(this.changeLayer(2, hash)){
            return;
        }
        this.sObjManager.ready().then(() => {
            const so = (type == 1 || type == 2) ? this.sObjManager.getByName(key1) : this.sObjManager.getByPrefix(key1);
            const viewParam = {
                parentId : 'sObjLayer3',
                sObject  : so,
                id       : (type == 3 ? key1 : null),
                sourceId : (type == 2 && key2) || null
            };
            if(type == 1){
                this.layers[2] = new SObjFieldView(this, viewParam);
            }else{
                this.layers[2] = new SObjDataView(this, viewParam);
            }
            this.layers[2].open(type == 2 ? '' : hash);
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
            this.blockingUI(false);
        });
    }
}