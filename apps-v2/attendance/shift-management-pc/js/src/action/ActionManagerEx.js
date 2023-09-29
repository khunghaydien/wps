/**
 * 共通リクエスト・レスポンス送受信メソッド.<br/><br/>
 * サーバとデータのやり取りをするとき必ずこのメソッドを経由する。<br/>
 *
 * @param {string} fncName メソッド名
 * @param {Object} params パラメータ
 * @param {teasp.data.Pouch} pouch データ管理クラス
 * @param {Object} flagObj フラグオブジェクト
 * @param {Object} thisObject
 * @param {Function} onSuccess
 * @param {Function} onFailure
 * @return {*} メソッドによる（返り値がない場合あり）
 */
teasp.action.Manager.prototype.request = function(fncName, params, pouch, flagObj, thisObject, onSuccess, onFailure, onSuccess2){
    var cnt = 0;
    if(this.option.debugLev >= teasp.constant.LEVEL_WARN){
        console.log('----------------------------------------');
        console.log('request [' + fncName + ']');
        console.log(params ? dojo.toJson(params) : '** no params **');
        console.log('----------------------------------------');
    }
    this.uiBlock(true, flagObj);
    var that = this;
    teasp.action.contact[fncName](
        params,
        pouch,
        thisObject,
        function(){ // 成功
            var shift =  Array.prototype.shift;
            that.completeFlag = shift.apply(arguments);
            console.log('request [' + fncName + '] success!, completeFlag=' + that.completeFlag);
            that.uiBlock(false, flagObj);
            if(cnt++ === 0){
                if(thisObject){
                    onSuccess.apply(thisObject, arguments);
                }else{
                    onSuccess(arguments[0]);
                }
            }else if(onSuccess2){
                if(thisObject){
                    onSuccess2.apply(thisObject, arguments);
                }else{
                    onSuccess2(arguments[0]);
                }
            }
        },
        function(){ // 失敗
            that.completeFlag = true;
            console.log('request [' + fncName + '] failed!');
            that.uiBlock(false, flagObj);
            if(that.option.debugLev >= teasp.constant.LEVEL_ERROR){
                console.log(dojo.toJson(arguments[0]));
            }
            if(cnt++ === 0){
                if (thisObject){
                    onFailure.apply(thisObject, arguments);
                }else {
                    onFailure(arguments[0]);
                }
            }
        }
    );
};

/**
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} day 対象の日次オブジェクト（メソッド内で更新）
 */
teasp.action.Manager.prototype.recalcOneDay = function(pouch, day){
    return teasp.action.contact.recalcOneDay(pouch, day);
};

teasp.action.Manager.prototype.getApplySelect = function(param, onSearch, onSelect){
    if(!this.applySelect){
        this.applySelect = new teasp.dialog.ApplySelect();
    }
    this.applySelect.setEvent(param, onSearch, onSelect);
    return this.applySelect;
};

teasp.action.Manager.prototype.testInit = function(areaId){
    this.utilTest = new teasp.util.Test();
    this.utilTest.init(areaId);
};

teasp.action.Manager.prototype.testReset = function(){
	if(this.utilTest){
		this.utilTest.reset();
	}
};

teasp.action.Manager.prototype.testSeed = function(o){
    if(this.utilTest){
        this.utilTest.addSeed(o);
    }
};

teasp.action.Manager.prototype.testSignal = function(o){
	if(this.utilTest){
	    this.utilTest.signal(o);
	}
};
