teasp.provide('teasp.view.Base');
/**
 * ビューの基底クラス
 *
 * @constructor
 * @author DCI小島
 */
teasp.view.Base = function(){
    /** @protected */
    this.localObj = {};
    /** @protected */
    if(teasp.data.Pouch){
        this.pouch = new teasp.data.Pouch();
    }
    /** @protected */
    this.viewParams = null;
    /** @protected */
    this.errorAreaId = 'error_area';
};

/**
 * ブラウザの引数を読み取ってメンバ変数にセット
 *
 * @param {Object=} obj 固定の引数を持つオブジェクト
 */
teasp.view.Base.prototype.readParams = function(obj){
    this.viewParams = (obj || {});
    var _args = location.search;
    var args = _args.split('&');
    for(var i = 0 ; i < args.length ; i++){
        var v = args[i];
        if(i == 0){
            v = v.substring(1);
        }
        var p = v.split('=');
        if(p.length > 1){
            this.viewParams[p[0]] = p[1];
        }
    }
};

/**
 * 画面初期化
 *
 * @param {Function=} onFailure エラー時の処理
 * @return {boolean} false:エラー  true:正常
 */
teasp.view.Base.prototype._init = function(onFailure){
    if(globalLoadRes && globalLoadRes.result == 'NG'){
        if(onFailure){
            onFailure(globalLoadRes);
        }else{
            teasp.util.showErrorArea(globalLoadRes.error, this.errorAreaId);
        }
        return false;
    }
    return true;
};

// 明示的に参照モードである
teasp.view.Base.prototype.isArgRead = function(){
    return (this.viewParams['mode'] == 'read');
};

// 参照モードの場合、モードを表示
teasp.view.Base.prototype.viewPlus = function(){
    if(!this.isArgRead()){
        return;
    }
    var div = dojo.create('div', {
        className : 'reference-mark' + (teasp.isNarrow() ? '-mobile' : ''),
        innerHTML : teasp.message.getLabel(teasp.isNarrow() ? 'tf10007321' : 'tf10007320'), // 参照モードor参照モードで開いています
        title     : teasp.message.getLabel('tf10007330')  // 編集モードへ切り替えるにはクリックしてください。\n確定済みもしくは編集権限がない場合は、編集できません。
    }, dojo.byId('tsfArea'));
    dojo.connect(div, 'onclick', function(){
        var href = location.href;
        href = href.replace(/mode=read/, 'mode=edit');
        teasp.locationHref(href);
        document.body.style.cursor = 'wait';
    });
};

//
teasp.view.Base.prototype.viewPostProcess = function(){
};
