if(!Array.prototype.contains){
    /**
     * 【Array拡張】 配列の中に値が含まれているか
     *
     * @return {boolean} true なら含まれている
     *
     */
    Array.prototype.contains = function(value){
        for(var i in this){
            if(this.hasOwnProperty(i) && this[i] === value){
                return true;
            }
        }
        return false;
    };
}
/*
String.prototype.trim = function() {
    return this.replace(/^[\s　]+|[\s　]+$/g, '');
};
 */

/**
 * 【String拡張】 HTML記号をコードに変換
 *
 * @return {string} 変換後のコード
 *
 */
String.prototype.entitize = function() {
    var str = "" + this;
    str = str.replace(/&/g ,"&amp;");
    str = str.replace(/</g ,"&lt;");
    str = str.replace(/>/g ,"&gt;");
    str = str.replace(/\"/g,"&quot;");
    str = str.replace(/{/g ,"&#123;");
    str = str.replace(/}/g ,"&#125;");
    str = str.replace(/\'/g,"&#039;");
    return str;
};
/**
 * 【String拡張】 文字列をセットしたタグのサイズを返す
 *
 * @param {Object} ruler DOM要素
 * @return {Object} サイズを格納したオブジェクト
 */
String.prototype.getExtent = function(ruler) {
    var e = ruler;
/*
    while (e.firstChild){
        e.removeChild(e.firstChild);
    }
    var text = e.appendChild(document.createTextNode(this));
*/
    e.innerHTML = this;
    var w = e.offsetWidth;
    var h = e.offsetHeight;
    while (e.firstChild){
        e.removeChild(e.firstChild);
    }
    return {width: w, height: h};
};
/**
 * 【String拡張】 文字列を最大幅に収まるサイズでカット
 *
 * @param {number} maxWidth 最大幅
 * @param {Object} ruler DOM要素
 * @return {string|String|null} カット後の文字列
 */
String.prototype.truncateTailInWidth = function(maxWidth, ruler) {
    if (this.length === 0){
        return '';
    }
    if (this.getExtent(ruler).width <= maxWidth){
        return this;
    }
    for (var i=this.length-1; i>=1; --i) {
        var s = this.slice(0, i) + '...';
        if (s.getExtent(ruler).width <= maxWidth){
            return s;
        }
    }
    return '';
};

/**
 * 配列かどうかの判定
 *
 * @param {*} value 判定対象
 * @return {*} true なら配列
 */
var is_array = function(value){
    return value &&
        typeof(value) === 'object' &&
        typeof(value.length) === 'number' &&
        typeof(value.splice) === 'function' &&
        !(value.propertyIsEnumerable('length'));
};
/**
 * IE対策。IE9では console.debug の実装がないため、空の関数をセット
 */
var console = (console || { debug: function(){}, log: function(){} });
if(!console.debug){
    console.debug = function(){};
}
if(!console.log){
    /**
     *
     * @param {string} a
     */
    console.log = function(a){};
}
