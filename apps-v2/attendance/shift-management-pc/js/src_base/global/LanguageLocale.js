teasp.provide('teasp.logic.Message');

/**
 * メッセージ変換
 *
 * @param {Object=} langLabels メッセージテーブル１
 * @param {Object=} customLabels メッセージテーブル２
 * @constructor
 */
teasp.logic.Message = function(langLabels, customLabels){
    this.labels = {};
    this.languageLocaleKey = 'ja';
    this.mergeLabels(langLabels  );
    this.mergeLabels(customLabels);
};

teasp.logic.Message.prototype.getLanguageLocaleKey = function() {
    return this.languageLocaleKey;
};

teasp.logic.Message.prototype.setLanguageLocaleKey = function(key) {
    //-----------------------------------------------------
    // [注意]
    // このメソッドの呼び出しは全画面で行っているので、
    // 全画面で共通で行いたい処理をここでしています。
    teasp.util.init();
    //-----------------------------------------------------
    this.languageLocaleKey = key;
};

teasp.logic.Message.prototype.isJp = function(){
    return (this.languageLocaleKey == 'ja');
};

/**
 * メッセージテーブルのマージ
 *
 * @param {Object=} labels メッセージテーブル
 * @param {Object=} branch
 */
teasp.logic.Message.prototype.mergeLabels = function(labels, branch) {
    if(!labels){
        return;
    }
    for(var key in labels){
        if(!labels.hasOwnProperty(key)){
            continue;
        }
        if(typeof(labels[key]) == 'object'){
            if(!this.labels[key]){
                this.labels[key] = {};
            }
            this.mergeLabels(labels[key], this.labels[key]);
        }else{
            if(!branch){
                this.labels[key] = labels[key];
            }else{
                branch[key] = labels[key];
            }
        }
    }
    var dp = this.getLabel('zv00000010');
    if(dp){
        DATE_FORM_S = { datePattern: dp, selector: 'date' };
    }
};

/**
 * メッセージを返す
 *
 * @return {string}
 */
teasp.logic.Message.prototype.getLabel = function() {
    var b = "", a = arguments;
    if (a[0])
        b = (this.labels[a[0]] || '');
    for (var i = 1; i < a.length; i++)
        b = b.replace(RegExp("\\{" + (i - 1) + "\\}", "g"), a[i]);
    return b;
};

teasp.logic.Message.prototype.mixLabel = function(args) {
    var b = "";
    if (args.length > 0)
        b = (this.labels[args[0]] || '');
    for (var i = 1; i < args.length; i++)
        b = b.replace(RegExp("\\{" + (i - 1) + "\\}", "g"), (this.labels[args[i]] || ''));
    return b;
};

/**
 * メッセージを返す
 *
 * @return {string}
 */
teasp.logic.Message.prototype.getLabel2 = function(mid, args) {
    var b = (this.labels[mid] || '');
    for (var i = 0; i < args.length; i++)
        b = b.replace(RegExp("\\{" + i + "\\}", "g"), args[i]);
    return b;
};

teasp.logic.Message.prototype.format = function() {
    var a = arguments;
    var b = "";
    if (a.length > 0){
        b = (a[0] || '');
    }
    for (var i = 1; i < a.length; i++)
        b = b.replace(RegExp("\\{" + (i - 1) + "\\}", "g"), (a[i] || ''));
    return b;
};

/**
 * メッセージ(HTML)を設定する
 *
 * @param {string} id DOMオブジェクトID
 * @param {string} mid メッセージID
 */
teasp.logic.Message.prototype.setLabelHtml = function(id, mid) {
    var obj = dojo.byId(id);
    if (obj == null) {
        return;
    }
    if (mid == undefined) {
        mid = id;
    }
    obj.innerHTML = teasp.message.getLabel(mid);
    obj = null;
};

/**
 * メッセージ(タイトル)を設定する
 *
 * @param {string} id DOMオブジェクトID
 * @param {string} mid メッセージID
 */
teasp.logic.Message.prototype.setLabelTitle = function(id, mid) {
    var obj = dojo.byId(id);
    if (obj == null) {
        return;
    }
    if (mid == undefined) {
        mid = id;
    }

    obj.title = teasp.message.getLabel(mid);
    obj = null;
};

/**
 * メッセージ(HTML)を設定する
 *
 * @param {string} id DOMオブジェクトID
 * @param {string} mid メッセージID
 */
teasp.logic.Message.prototype.setLabelEx = function() {
    var a = arguments;
    var d = dojo.byId(a[0]);
    if(!d){
        return;
    }
    if(typeof(a[1]) == 'string'){
        d.innerHTML = teasp.message.getLabel(a[1]);
    }else{
        var x = (typeof(a[1]) == 'number') ? 2 : 1;
        if(x == 1 || !a[1]){
            d.innerHTML = (is_array(a[x]) ? teasp.message.getLabel.apply(this, a[x]) : teasp.message.getLabel(a[x]));
        }else{
            d.title     = (is_array(a[x]) ? teasp.message.getLabel.apply(this, a[x]) : teasp.message.getLabel(a[x]));
        }
    }
    d = null;
};

teasp.logic.Message.convertArgs = function(args){
    if(!args || typeof(args) != 'object'){
        return [];
    }
    if(dojo.isArray(args)){
        return args;
    }
    var res = [];
    for(var key in args){
        if(args.hasOwnProperty(key)){
            res[parseInt(key, 10)] = args[key];
        }
    }
    return res;
};

teasp.logic.Message.prototype.getErrorMessage = function(errobj){
    var ep = errobj;
    if(typeof(ep) == 'object'){
        if(ep.error && typeof(ep.error) == 'object'){
            ep = ep.error;
        }
        if(ep.messageId){
            return teasp.message.getLabel2(ep.messageId, teasp.logic.Message.convertArgs(ep.args));
        }else{
            return (ep.message || ep.name || 'Error');
        }
    }else{
        return (ep || 'Error');
    }
};

teasp.logic.Message.prototype.alertError = function(errobj){
    teasp.tsAlert(this.getErrorMessage(errobj));
};

teasp.message = new teasp.logic.Message();

