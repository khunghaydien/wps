/**
 * エラー
 *
 * @constructor
 */
teasp.Tsf.Error = function(){
};

/**
 * エラー情報を解析してメッセージを含むオブジェクトを返す
 *
 * @param {Object|string} result
 * @returns {Object}
 */
teasp.Tsf.Error.parse = function(result){
    return {
        message: teasp.Tsf.Error.getMessage(result)
    };
};

/**
 * エラー情報を解析してメッセージを返す
 *
 * @param {Object|string} result
 * @returns {string}
 */
teasp.Tsf.Error.getMessage = function(result){
    var ep = result;
    if(ep && typeof(ep) == 'object'){
        if(ep.error && typeof(ep.error) == 'object'){
            ep = ep.error;
        }
        if(ep.messageId){
            return teasp.message.getLabel2(ep.messageId, (ep.args || []));
        }else{
            return (ep.message || result.message || ep.name || 'Error');
        }
    }else{
        return /** @type {string} */(ep || 'Error');
    }
};

teasp.Tsf.Error.showError = function(errobj, area){
    var el = (area ? (typeof(area) == 'string' ? teasp.Tsf.Dom.byId(area) : area) : teasp.Tsf.Dom.byId('tsfErrorArea'));
    if(errobj){
        if(!el){
            el = teasp.Tsf.Dom.node('.ts-error-el');
        }
        var msg = 'Error：' + teasp.Tsf.Error.getMessage(errobj);
        var div = el ? teasp.Tsf.Dom.node('div', el) : null;
        if(div){
            div.innerHTML = msg;
            teasp.Tsf.Dom.show(el, null, true);
        }else{
            teasp.tsAlert(msg);
        }
    }else if(el){
        teasp.Tsf.Dom.show(el, null, false);
    }
};

// 「Error：」の文字がないメッセージ
teasp.Tsf.Error.showMessage = function(errobj, area){
    var el = (area ? (typeof(area) == 'string' ? teasp.Tsf.Dom.byId(area) : area) : teasp.Tsf.Dom.byId('tsfErrorArea'));
    if(errobj){
        if(!el){
            el = teasp.Tsf.Dom.node('.ts-error-el');
        }
        var msg = teasp.Tsf.Error.getMessage(errobj);
        var div = el ? teasp.Tsf.Dom.node('div', el) : null;
        if(div){
            div.innerHTML = msg;
            teasp.Tsf.Dom.show(el, null, true);
        }else{
            teasp.tsAlert(msg);
        }
    }else if(el){
        teasp.Tsf.Dom.show(el, null, false);
    }
};

teasp.Tsf.Error.messageFromNgList = function(ngList){
    var nulls = [];
    var datef = [];
    var datev = [];
    var datefTmpl = null;
    var datevTmpl = null;
    var msg = '';
    dojo.forEach(ngList, function(ng){
        if(ng.fc){
            var label = ng.fc.getLabel();
            if(ng.ngType == 1){
                if(!nulls.contains(label)){
                    nulls.push(label);
                }
            }else if(ng.ngType == 2){
                if(!datef.contains(label)){
                    datef.push(label);
                }
                datefTmpl = ng.tmpl;
            }else if(ng.ngType == 3){
                if(!datev.contains(label)){
                    datev.push(label);
                }
                datevTmpl = ng.tmpl;
            }else if(ng.ngType == 4){
                msg += ng.message;
            }
        }
    });
    if(nulls.length > 0){
        msg += teasp.message.getLabel('tf10001840', nulls.join(',')); // {0}を入力してください。
    }
    if(datef.length > 0){
        msg += dojo.replace(datefTmpl, [datef.join(',')]);
    }
    if(datev.length > 0){
        msg += dojo.replace(datevTmpl, [datev.join(',')]);
    }
    return msg;
};
