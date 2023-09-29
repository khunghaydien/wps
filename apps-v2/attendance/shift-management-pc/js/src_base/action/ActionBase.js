teasp.provide('teasp.action.contact');
/**
 * データ入出力クラス
 *
 * @constructor
 * @author DCI小島
 */
teasp.action.contact = function(){};

/**
 * コントロールクラスのメソッド呼び出し.
 *
 * @protected
 * @param {string} funcName メソッド名
 * @param {*} arg パラメータ
 * @param {Function} onSuccess 成功時のコールバック
 * @param {Function} onFailure 失敗時のコールバック
 */
teasp.action.contact.remoteMethod = function(funcName, arg, onSuccess, onFailure){
    var queryString;
    if(typeof(arg) == 'string'){
        queryString = arg;
    }else if(arg.length){
        queryString = arg.join(',');
    }else{
        queryString = dojo.toJson(arg);
    }
    teasp.timestamp(funcName + ' queryString = ' + queryString);

    try{
        // ★ コントロールクラスのメソッドを呼ぶ ★
        RtkPotalCtl[funcName](queryString, function(result, event){
            teasp.timestamp('recv-response');
            if (event.status) {
                if (result.result == 'NG') {
                    console.log(result);
                    result.error.message = teasp.message.getErrorMessage(result.error);
                }
                // console.log(dojo.toJson(result));
                onSuccess(result);
            } else {
                console.log(event);
                if(teasp.constant.TIMEOUT_CAUSE.test(event.message)){
                    event.message = teasp.message.getLabel('tm00000011', event.message);
                }
                onFailure(event);
            }
        }, {escape:false});
    }catch(e){
        console.log(e.message);
        console.log(e);
        onFailure(e);
    }
};

/**
 * コントロールクラスのメソッド呼び出し.
 *
 * @public
 * @param {string} funcName メソッド名
 * @param {*} arg パラメータ
 * @param {string|null} areaId エラー時の出力先ＩＤ
 * @param {Function} onSuccess 成功時のコールバック
 * @param {Function=} onFailure エラー時のコールバック
 */
teasp.action.contact.remoteMethod2 = function(funcName, arg, areaId, onSuccess, onFailure){
    var queryString;
    var keepNs = false;
    if(typeof(arg) == 'string'){
        queryString = arg;
    }else if(is_array(arg) && arg.length > 0 && typeof(arg[0]) == 'string'){
        queryString = arg.join(',');
    }else{
        keepNs = arg.keepNs;
        queryString = dojo.toJson(arg);
    }
    console.log(funcName + ' queryString = ' + queryString);

    try{
        // ★ コントロールクラスのメソッドを呼ぶ ★
        teasp.controlClass[funcName](queryString, function(result, event){
            try{
                if(event.status){
                    if(result.result != 'NG') {
                        if(!keepNs){
                            teasp.util.excludeNameSpace(result);
                        }
                        onSuccess(result);
                    }else{
                        console.log(event);
                        if(onFailure){
                            onFailure(result);
                        }else{
                            teasp.util.showErrorArea(result.error, areaId);
                        }
                    }
                }else{
                    if(teasp.constant.TIMEOUT_CAUSE.test(event.message)){
                        event.message = teasp.message.getLabel('tm00000011', event.message);
                    }
                    console.log(event);
                    if(onFailure){
                        onFailure(event);
                    }else{
                        teasp.util.showErrorArea(event, areaId);
                    }
                }
            }catch(e){
                console.log(e);
                if(onFailure){
                    onFailure(e);
                }else{
                    teasp.util.showErrorArea(e, areaId);
                }
            }
        }, {escape:false});
    }catch(e){
        console.log(e);
        if(onFailure){
            onFailure(e);
        }else{
            teasp.util.showErrorArea(e, areaId);
        }
    }
};

/**
 * コントロールクラスのメソッド呼び出し.
 *
 * @public
 * @param {Array.<Object>} reqs パラメータ
 * @param {Object|null} option オプション
 * @param {Function} onSuccess 成功時のコールバック
 * @param {Function=} onFailure エラー時のコールバック
 * @param {Object=} thisObject
 */
teasp.action.contact.remoteMethods = function(reqs, option, onSuccess, onFailure, thisObject){
    var areaId = (option && option.errorAreaId || null);  // エラー出力エリアID
    var nowait = (option && option.nowait || false); // お待ち下さいダイアログの有無
    var contIfErr = (option && option.contIfErr || false); // エラーでも継続するか

    if(!nowait){
        teasp.manager.dialogOpen('BusyWait');
    }

    teasp.util.showErrorArea(null, areaId); // エラー表示をクリア

    var index = 0;
    var f = function(){};
    f = function(){
        teasp.action.contact.remoteMethod2(reqs[index].funcName, reqs[index].params, areaId,
        function(result){
            if((index + 1) < reqs.length){
                onSuccess.apply(thisObject, [result, index]);
                index++;
                setTimeout(f, 100);
            }else{
                onSuccess.apply(thisObject, [result, index]);
                if(!nowait){
                    teasp.manager.dialogClose('BusyWait');
                }
            }
        },
        function(result){
            if(!contIfErr){
                teasp.manager.dialogClose('BusyWait');
            }
            if(onFailure){
                onFailure.apply(thisObject, [result, index]);
                if(contIfErr){
                    if((index + 1) < reqs.length){
                        index++;
                        setTimeout(f, 100);
                    }else{
                        teasp.manager.dialogClose('BusyWait');
                    }
                }
            }else{
                teasp.util.showErrorArea(result, areaId);
            }
        });
    };
    f();
};
