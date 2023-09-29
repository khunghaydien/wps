teasp.Tsf.util = {
    toJson : function(o){
        return dojo.toJson(o);
    },
    fromJson : function(s){
        if(typeof(s) == 'string'){
            return dojo.fromJson(s);
        }else{
            return s;
        }
    },
    isArray : function(o){
        return dojo.isArray(o);
    },
    mixin : function(a, b){
        return dojo.mixin(a, b);
    },
    clone : function(o){
        return dojo.clone(o);
    },
    /**
     * 文字列を数値に変換する
     *
     * @param {string|number} v
     * @returns {number|null}
     */
    parseInt : function(v){
        if(typeof(v) == 'number'){
            return v;
        }
        if(v){
            v = v.trim();
            if(/^\-?\d+$/.test(v)){
                return parseInt(v, 10);
            }
        }
        return null;
    },
    getNumStr : function(v, defVal){
        if(typeof(v) == 'number'){
            return '' + v;
        }
        return v || (defVal === undefined ? null : defVal);
    },
    /**
     * 文字列中の {0},{1}.. を引数の値に置き換える.<br/>
     * 第1引数は変換対象の文字列、第2引数以降は置き換える値
     *
     * @returns {string}
     */
    formatString : function() {
        var b = "", a = arguments;
        if (a[0])
            b = (a[0] || '');
        for (var i = 1; i < a.length; i++){
            b = b.replace(RegExp("\\{" + (i - 1) + "\\}", "g"), a[i]);
        }
        return b;
    },
    equalId : function(id1, id2){
        var _id1 = (id1 && id1.length >= 15 ? id1.substring(0, 15) : null);
        var _id2 = (id2 && id2.length >= 15 ? id2.substring(0, 15) : null);
        return _id1 == _id2;
    },
    /**
     * HTML記号をコードに変換
     * @param {string|null} v
     * @param {*} d デフォルト値
     * @return {string} 変換後文字列
     */
    entitize : function(v, d) {
        if(typeof(v) == 'string'){
            v = v.replace(/&/g , "&amp;" );
            v = v.replace(/</g , "&lt;"  );
            v = v.replace(/>/g , "&gt;"  );
            v = v.replace(/\"/g, "&quot;");
            v = v.replace(/{/g , "&#123;");
            v = v.replace(/}/g , "&#125;");
            v = v.replace(/\'/g, "&#039;");
        }
        if(typeof(v) == 'number'){
            return v;
        }
        return (v || d);
    },
    entitizf : function(v) {
        return teasp.Tsf.util.entitize(v, '');
    },
    /**
     * コードをHTML記号に変換
     * @param {string|null} v
     * @param {boolean=} flag trueなら改行を'<br/>'に変換
     * @return {string} 変換後文字列
     */
    entitizg : function(v, flag) {
    	var s = teasp.Tsf.util.entitize(v, '&nbsp;');
        return (flag ? s.replace(/\r?\n/g, '<br/>') : s);
    },
    /**
     * HTML記号をテキストに変換
     * @param {string|null} v
     * @param {*} d デフォルト値
     * @return {string} 変換後文字列
     */
    revetize : function(v, d) {
        if(typeof(v) == 'string'){
            v = v.replace(/<br\/?>/ig, "\n");
            v = v.replace(/&amp;/g , "&" );
            v = v.replace(/&lt;/g  , "<" );
            v = v.replace(/&gt;/g  , ">" );
            v = v.replace(/&quot;/g, "\"");
            v = v.replace(/&#123;/g, "{" );
            v = v.replace(/&#125;/g, "}" );
            v = v.replace(/&#039;/g, "\'");
        }
        return (v || d);
    },
    escapeCsv : function(v) {
        if(typeof(v) == 'string'){
            return '"' + v.replace(/"/g, '""') + '"';
        }else{
            return v;
        }
    },
    isSforceOne: function(){
        return ((typeof(sforce) != 'undefined') && sforce != null && (navigator.userAgent.indexOf('Salesforce') >= 0));
    },
    console : function(msg){
        if(typeof(console) == 'object' && console.log){
            console.log(msg);
        }
    }
};
