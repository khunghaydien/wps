/**
 * UIブロック
 */
export class BlockingUI {
    /**
     * 表示/非表示切替
     * @param {boolean} flag 
     * @param {string} message
     */
    static show(flag, message){
        const bui = document.getElementById('TsaBlockingUI');
        bui.querySelector('.tsa-blocking-ui-msg').innerHTML = message;
        if(!bui.hasAttribute('centering')){
            // 画面リサイズでセンタリングするイベントリスナ
            bui.setAttribute('centering', true);
            this.centering();
            window.addEventListener('resize', this.centering);
        }
        bui.style.display = (flag ? 'block' : 'none');
    }
    /**
     * 画面中央になるようにY座標調整
     */
    static centering(){
        const d = document.querySelector('#TsaBlockingUI > div > div');
        const y = Math.max((window.innerHeight - d.getBoundingClientRect().height) / 2, 0);
        d.style.marginTop = y + 'px';
    }
}