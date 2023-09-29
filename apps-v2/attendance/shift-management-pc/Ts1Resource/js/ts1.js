/**
 * TS1共通系
 */

/** スマホブラウザチェック */
;(function($){
	if (!$.browser) $.browser = {};
	$.browser.ua = navigator.userAgent.toLowerCase();
	$.browser.android = /android/.test($.browser.ua);
	$.browser.iphone = /iphone/.test($.browser.ua);
	$.browser.ipod = /ipod/.test($.browser.ua);
	$.browser.ipad = /ipad/.test($.browser.ua);
	$.browser.ios = /iphone|ipod|ipad/.test($.browser.ua);
	if ($.browser.android) {
		$.browser.tablet = !/mobile/.test($.browser.ua);
	} else {
		$.browser.tablet = /ipad/.test($.browser.ua);
	}
	if (!$.browser.version)
		$.browser.version = {};
	if ($.browser.android) {
		$.browser.version = parseFloat($.browser.ua.slice(
				$.browser.ua.indexOf("android") + 8))
	} else if ($.browser.ios) {
		$.browser.version = parseFloat($.browser.ua.slice(
				$.browser.ua.indexOf("os ") + 3,
				$.browser.ua.indexOf("os ") + 6).replace("_", "."))
	}
})(jQuery);

/**
 * IDを取得する。
 * #が付いていればそのまま、付いていなければ#をつけて返す。
 * @param id
 */
function getId(id){
	return (id.substring(0, 1) == '#' ? id : "#" + id);
}

/**
 * 例外オブジェクトからスタックトレースを出力する。
 * @param e 例外オブジェクト
 */
function printStackTrace(e){
	if(e.stack){
		console.log(e.stack);
	}else{
		console.log(e.message, e);
	}
}

/**
 * Deferred版スリープ
 * @param msec
 * @returns
 */
function deferredWait(msec) {
    var d = $.Deferred();
    setTimeout(function(){d.resolve();}, msec);
    return d.promise();
}

/* JavascriptオブジェクトからJSONオブジェクトに変換する。 */
jQuery.extend({
    stringify : function stringify(obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        } else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
 
            for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (obj.hasOwnProperty(n)) {
                    if (t == "string") v = '"' + v + '"'; else if (t == "object" && v !== null) v = jQuery.stringify(v);
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    }
});

