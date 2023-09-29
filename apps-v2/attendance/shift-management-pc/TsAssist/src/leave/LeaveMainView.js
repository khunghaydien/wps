import {BaseView}            from "../_common/BaseView.js?v=XVERSIONX";
import {LeaveManager}        from "./LeaveManager.js?v=XVERSIONX";
import {LeaveListView}       from "./view/LeaveListView.js?v=XVERSIONX";

/**
 * 休暇管理メイン画面
 */
export class LeaveMainView extends BaseView {
    constructor(tsaMain){
        super(tsaMain, null);
        this.parentId = tsaMain.baseId;
        this._leaveManager = new LeaveManager();
        this.layers = [null, null, null];
        this.prefixHash = '#!leave';
    }
    get leaveManager(){ return this._leaveManager; }

    /**
     * 初期表示
     * @param {string} hash 
     */
    open(hash){
        // hash が空の場合、クエリパラメータのempIdとholidayGroupIdを採用する
        // （LEXでリンクを別タブで開いた時、ハッシュフラグメントが認識されないことがあり、その対策）
        if(!hash){
            const args = this.tsaMain.getArgs();
            if(args.empId){
                this.openLayer1(hash, args.empId, args.holidayGroupId);
            }
        }else{
            const m1 = /^#!leave:?([^:]*):?(.*)$/.exec(hash);
            if(m1 && m1[1]){
                this.openLayer1(hash, m1[1], m1[2]);
            }else{
                this.tsaMain.setDefaultHash();
            }
        }
    }
    /**
     * ベース画面作成
     */
    buildArea(){
        if(!this.domH.byId('leaveLayer1')){
            this.domH.empty(this.baseId);
            document.getElementById(this.baseId).innerHTML = this.getContent();
        }
    }
    /**
     * ベース画面DOM
     * @returns {string}
     */
    getContent(){
        return `
            <div>
                <div class="tsa-error" style="display:none;"><div></div></div>
                <div id="leaveLayer1"></div>
                <div id="leaveLayer2"></div>
            </div>
        `;
    }
    /**
     * 画面を破棄
     */
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
     * 休暇管理画面
     * @param {string} hash 
     * @param {string} empId
     * @param {string} holidayGroupId
     * @param {string} period
     */
    openLayer1(hash, empId, holidayGroupId){
        this.buildArea();
        if(this.changeLayer(0, hash)){
            return;
        }
        this.blockingUI(true);
        this.leaveManager.ready(empId).then(() => {
            this.layers[0] = new LeaveListView(this, {parentId:'leaveLayer1', empId:empId, holidayGroupId:holidayGroupId});
            this.layers[0].open(hash);
        }).catch((errobj) => {
            this.showError({message: this.msgH.parseErrorMessage(errobj)});
        }).then(() => {
            this.blockingUI(false);
        });
    }
}