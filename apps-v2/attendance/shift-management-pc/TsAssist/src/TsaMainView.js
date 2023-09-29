import {TsaMain}         from "./TsaMain.js?v=XVERSIONX";
import {BaseView}        from "./_common/BaseView.js?v=XVERSIONX";
import {MenuView}        from "./menu/MenuView.js?v=XVERSIONX";
import {SObjMainView}    from "./sobj/SObjMainView.js?v=XVERSIONX";
import {ExtendMainView}  from "./extend/ExtendMainView.js?v=XVERSIONX";
import {ClearMainView}   from "./cleaning/ClearMainView.js?v=XVERSIONX";
import {LeaveMainView}   from "./leave/LeaveMainView.js?v=XVERSIONX";

/**
 * TsaMainViewクラス
 * ページ初期表示時に最初にインスタンス化されるクラス
 * コンストラクタで TsaMain クラスを生成する。
 * ハッシュを監視、ハッシュに応じてページ切り替えを行う。
 * その他共通のエラー表示等を実装。
 */
export class TsaMainView extends BaseView {
    constructor(initParam){
        super(new TsaMain(initParam), null);
        this.view = null;
        this.lastErr = null;
    }
    /**
     * 画面初期化
     */
    open(){
        if(!this.tsaMain.checkArgs()){
            return;
        }
		this.domH.byId('TsAssistView').innerHTML = this.getContent();
        this.buildContent();
    }
    /**
     * 画面初期化
     */
    buildContent(){
        this.domH.setStyle('TsaTopBar', 'display', this.tsaMain.isLeaveView() ? 'none' : '');
        this.tsaMain.setMainView(this);
        this.updateView();
        // ハッシュ変更
        this.domH.addListener(window, "hashchange", () => {
            this.updateView();
        });
        // ポップアップメニュー
        document.querySelectorAll('.tsa-menu-icon').forEach((el) => {
            this.domH.addListener(el, 'click', (e) => { this.showCornerMenu(e); });
        });
    }
    getContent(){
        return `
            <div id="TsaTopBar" style="display:none;">
                <div><a class="tsa-menu-icon"></a></div>
                <div>TeamSpirit Assistant</div>
                <div id="TsaOrganization"></div>
                <div id="TsaVersion"></div>
            </div>
            <div id="TsaBaseArea" class="tsa-top">
            </div>
            <div id="TsaBlockingUI" class="tsa-blocking-ui" style="display:none;">
                <div>
                    <div>
                        <div class="tsa-blocking-ui-msg"></div>
                    </div>
                </div>
            </div>
            <div id="TsaDownloadArea" style="display:none;">
            </div>
        `;
    }
    /**
     * ページ切り替えを行う
     */
    updateView(){
        this.tsaMain.closeDialogAll();
        this.tsaMain.removeHintAll();
        this.hideError();
        const h = window.location.hash;
        if(h){
            this.blockingUI(true);
        }
        if(this.view){
            if(this.view.isSameFlow(h)){
                this.view.open(h);
                return;
            }
            this.view.destroy();
            this.view = null;
        }
        if(h.startsWith('#!menu')){
            this.view = new MenuView(this.tsaMain);
            this.view.open(h);
        }else if(h.startsWith('#!exte')){
            this.view = new ExtendMainView(this.tsaMain);
            this.view.open(h);
        }else if(h.startsWith('#!clean')){
            this.view = new ClearMainView(this.tsaMain);
            this.view.open(h);
        }else if(h.startsWith('#!sobj')){
            this.view = new SObjMainView(this.tsaMain);
            this.view.open(h);
        }else if(h.startsWith('#!leave') || this.tsaMain.isLeaveView()){
            this.view = new LeaveMainView(this.tsaMain);
            this.view.open(h);
        }else{
            this.setDefaultHash();
        }
    }
    /**
     * ハッシュが指定されてない場合
     */
    setDefaultHash(){
        window.location.hash = '#!menu';
    }
    showCornerMenu(e){
        this.tsaMain.showCornerMenu(e);
    }
    /**
     * エラーを非表示にする
     */
    hideError(){
        this.showError(Object.assign(this.lastErr || {}, {message:null}));
        this.lastErr = null;
    }
    /**
     * エラー表示
     */
    showError(err){
        if(typeof(err) == 'string'){
            err = {message: err};
        }
        const area = this.domH.byId(this.baseId);
        const message = (err && err.message) || null;
        if(err && err.nodeId){
            this.showErrorMessage(this.domH.byId(err.nodeId), message);
        }else{
            const areas = area.querySelectorAll('.tsa-error-main');
            areas.forEach((el) => {
                this.showErrorMessage(el, message);
            });
            if(!areas.length){
                this.showErrorMessage(area.querySelector('.tsa-error'), message);
            }
        }
        if(err.message){
            this.lastErr = err;
        }
    }
    /**
     * エラー表示
     */
    showErrorMessage(node, message){
        if(node){
            const child = node.querySelector('div');
            if(child){
                if(message){
                    if(node.classList.contains('tsa-error-main')){
                        child.innerHTML = `<div class="tsa-error-close"></div>${message}`;
                        this.domH.once(child.querySelector('.tsa-error-close'), 'click', () => {
                            this.showErrorMessage(node, null);
                        });
                    }else{
                        child.innerHTML = message;
                    }
                }else{
                    child.innerHTML = '';
                }
            }
            node.style.display = (message ? '' : 'none');
            return true;
        }
        return false;
    }
}