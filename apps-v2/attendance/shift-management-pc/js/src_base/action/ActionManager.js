teasp.provide('teasp.action.Manager');
/**
 * データ入出力管理クラス
 *
 * @constructor
 * @author DCI小島
 */
teasp.action.Manager = function(){
    /** @private */
    this.dialogs = {};
    /** @private */
    this.option = { debugLev : 0 };
    /** @private */
    this.completeFlag = true;
    this.shim = false;
};

teasp.manager = new teasp.action.Manager();

/**
 * ダイアログのオープン.
 *
 * @param {string} dialogName ダイアログ名 (ATK.dialog の要素名)
 * @param {Object=} params パラメータ
 * @param {Object=} pouch
 * @param {Object=} thisObject
 * @param {Object=} callback コールバック
 */
teasp.action.Manager.prototype.dialogOpen = function(dialogName, params, pouch, thisObject, callback){
	if(this.shim && dialogName == 'BusyWait'){
		dojo.style('shim', 'display', '');
		return;
	}
    if(!this.dialogs[dialogName]){
        this.dialogs[dialogName] = new teasp.dialog[dialogName]();
    }
    this.dialogs[dialogName].open(pouch, params, callback, thisObject);
};

/**
 * ダイアログのクローズ.
 *
 * @param {string} dialogName ダイアログ名
 */
teasp.action.Manager.prototype.dialogClose = function(dialogName){
    if(this.shim && dialogName == 'BusyWait'){
        dojo.style('shim', 'display', 'none');
        return;
    }
    if(this.dialogs[dialogName]){
        this.dialogs[dialogName].close();
    }
};

/**
 * ダイアログを廃棄
 *
 * @param {string} dialogName ダイアログ名
 */
teasp.action.Manager.prototype.dialogRemove = function(dialogName){
	delete this.dialogs[dialogName];
};

teasp.action.Manager.prototype.uiBlock = function(flag, op){
    if(!op.hideBusy){
        if(flag){
            this.dialogOpen('BusyWait');
        }else{
            this.dialogClose('BusyWait');
        }
    }else if(op.shim){
        dojo.style('shim', 'z-index', (flag ? 2001 : 48));
        dojo.style('shim', 'display', (flag ? '' : 'none'));
    }
};

/**
 * 遅延取得のレスポンスを待つ.<br/><br/>
 * 0.1秒ごとにフラグをチェックする。<br/>
 * フラグがオンになるか、300回(30秒)以上繰り返してフラグがオフのままの場合、ループを抜ける。
 *
 * @param {Object} o カウントを保持
 * @param {Function} callback コールバック
 */
teasp.action.Manager.prototype.completeCheckLoop = function(o, callback){
    if(this.completeFlag || o.cnt > 300){
        callback();
        return;
    }
    o.cnt++;
    var that = this;
    setTimeout(function(){
        that.completeCheckLoop(o, callback);
    }, 100);
};

/**
 * 遅延取得チェック.<br/>
 *
 * @param {Function} callback コールバック
 */
teasp.action.Manager.prototype.completeCheck = function(callback){
    if(this.completeFlag){
        callback();
        return;
    }
    console.log('wait!');
    this.completeCheckLoop({ cnt: 0 }, callback);
};

teasp.action.Manager.prototype.useShim = function(flag){
	this.shim = flag;
};

/**
 * confirm/alert ダイアログ代替関数
 * @param {number} type  0:alert  1:confirm
 * @param {string|object} message {{message:{string}, title:{string}, okLabel:{string}, cancelLabel:{string}}}
 * @param {object|null} thisObject
 * @param {Function|null} callback
 * @see teasp.dialog.ConfirmAlert (js/src_base/dialog/DlgConfirmAlert.js)
 */
teasp.action.Manager.prototype.tsConfirmAlert = function(type, message, thisObject, callback){
    if(!this.dialogs.ConfirmAlert){
        this.dialogs.ConfirmAlert = new teasp.dialog.ConfirmAlert();
    }
    var args = { type: type };
    if(typeof(message) == 'object'){
        dojo.mixin(args, message);
    }else{
        args.message = message;
    }
    this.dialogs.ConfirmAlert.open((thisObject && thisObject.pouch) || null, args, callback, thisObject);
};
/**
 * alert の代替
 * @param {string|object} message {{message:{string}, title:{string}, okLabel:{string}, cancelLabel:{string}}}
 * @param {object|null} thisObject 
 * @param {Function|null} callback 
 */
teasp.tsAlert = function(message, thisObject, callback){
    teasp.manager.tsConfirmAlert(0, message, thisObject, callback);
};
/**
 * confirm の代替
 * @param {string|object} message {{message:{string}, title:{string}, okLabel:{string}, cancelLabel:{string}}}
 * @param {object|null} thisObject 
 * @param {Function|null} callback
 */
teasp.tsConfirm = function(message, thisObject, callback){
    teasp.manager.tsConfirmAlert(1, message, thisObject, callback);
};
/**
 * confirm の代替の別バージョン。コールバック関数をOK用・キャンセル用の2つ指定
 * コールバック側でOKかキャンセルかを引数から判別する処理が不要になる。
 * それ以外はtsConfirmと変わらない（コーディングミスとコードが冗長になるのを避ける意図で追加）
 * @param {string|object} message tsConfirmのコメント参照
 * @param {object|null} thisObject
 * @param {Function} onOk
 * @param {Function=} onCancel
 */
teasp.tsConfirmA = function(message, thisObject, onOk, onCancel){
    teasp.manager.tsConfirmAlert(
        1,
        message,
        thisObject,
        function(result){
            if(onOk && result){
                onOk.apply(thisObject);
            }else if(onCancel && !result){
                onCancel.apply(thisObject);
            }
        }
    );
};

/**
 * <apex:commandLink>や<apex:commandButton>で確認メッセージを出す場合に使用する。
 * @param {string|object} message {{message:{string}, title:{string}, okLabel:{string}, cancelLabel:{string}}}
 * @param {string} targetId click()を呼ぶタグのID
 * @param {string=} buttonId 非表示にするタグのID（非表示が不要なら省略する）
 */
 teasp.tsConfirmClick = function(message, targetId, buttonId){
    teasp.tsConfirm(message, null, function(result){
        if(result){
            if(buttonId){ dojo.style(buttonId, 'display', 'none'); }
            if(targetId){ dojo.byId(targetId).click(); }
        }
    });
    return false;
};
