/**
 * 共通ビュークラス
 */
export class BaseView {
    constructor(tsaMain, viewParam){
        this.tsaMain = tsaMain;
        this.viewParam = viewParam || {};
        this.listenerKeys = [];
        this.viewHash = null;
        this.topNodeId = null;
    }
    get domH(){ return this.tsaMain.domH; }
    get msgH(){ return this.tsaMain.msgH; }
    get baseId(){ return this.tsaMain.baseId; }
    get hintH(){ return this.tsaMain.hintH; }
    get parentId(){ return this.viewParam.parentId; }
    set parentId(id){ this.viewParam.parentId = id; }

    open(hash){
        this.viewHash = hash;
    }
    getHash(){
        return this.viewHash;
    }
    setNewWindowLink(domId){
        const hash = this.getHash();
        this.domH.setStyle(domId, 'display', (hash ? '' : 'none'));
        this.domH.setAttr(domId, 'href', hash);
    }
    isSameFlow(hash){
        return (this.prefixHash ? hash.startsWith(this.prefixHash) : false);
    }
    showError(err){
        this.tsaMain.showError(err);
    }
    hideError(){
        this.tsaMain.hideError();
    }
    blockingUI(flag, message){
        this.tsaMain.blockingUI(flag, message);
    }
    hide(){
        this.switchDisplay(false);
    }
    show(){
        this.switchDisplay(true);
        this.windowResize();
    }
    getParentNode(){
        return this.domH.byId(this.parentId);
    }
    getTopNode(){
        return this.domH.byId(this.topNodeId ? this.topNodeId : this.parentId);
    }
    initListeners(){
        this.getTopNode().querySelectorAll('.tsa-hint').forEach((el) => {
            this.setListenerKey(0, this.domH.addListener(el, 'mouseover' , (e) => { this.hintH.open(e.target); }));
        });
    }
    /**
     * メッセージボックス表示
     * @param {object} viewParam 
     * @returns {Promise}
     */
    messageBox(viewParam){
        return this.tsaMain.messageBox(viewParam);
    }
    /**
     * アラート表示
     * @param {string} message メッセージ
     * @param {string} caption キャプション
     */
    simpleAlert(message, caption){
        this.tsaMain.simpleAlert(message, caption);
    }
    /**
     * ウィンドウリサイズのイベントハンドラ
     */
    windowResize(){
    }
    /**
     * 表示/非表示切替
     * @param {boolean} flag true:表示 false:非表示
     */
    switchDisplay(flag){
        const node = this.domH.byId(this.parentId);
        if(node){
            node.style.display = (flag ? 'block' : 'none');
        }
    }
    /**
     * イベントリスナーをセット
     * @param {number} level
     * @param {string} key 
     */
    setListenerKey(level, key){
        if(!key){
            return;
        }
        const x = level || 0;
        let keys = this.listenerKeys[x];
        if(!keys){
            keys = this.listenerKeys[x] = [];
        }
        keys.push(key);
    }
    /**
     * イベントリスナーを解除
     * @param {number|null} level 
     */
    clearListenerKeys(level){
        for(let x = 0 ; x < this.listenerKeys.length ; x++){
            if(this.listenerKeys[x] && (!level || level == x)){
                this.listenerKeys[x].forEach((key) => {
                    this.domH.removeListener(key);
                });
                this.listenerKeys[x] = [];
            }
        }
    }
    /**
     * イベントリスナーとDOMを破棄
     */
    destroy(){
        this.clearListenerKeys();
        this.domH.empty(this.parentId);
    }
    /**
     * ファイルダウンロード
     * @param {string} fname 
     * @param {string} csvData 
     */
    download(fname, csvData){
        // ダウンロード用のエリアをクリア
        const area = this.domH.byId('TsaDownloadArea');
        this.domH.empty(area);
        // ダウンロード用のエリアにアンカータグを作り、CSVデータを貼り付け
        const a = this.domH.create('a', { target:'_blank' }, area);
        this.domH.setDownloadLink(a, true, fname, csvData, true);
    }
}