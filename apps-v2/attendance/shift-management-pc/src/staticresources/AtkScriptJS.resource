//******************************************************************************
// アッと＠勤務 Enterprise 共通
// AtkScript.resource
//******************************************************************************
// 定数（グローバル変数）
var NORMAL_HOLIDAY_COLOR  = '#DEEFFF'; // 水色
var LEGAL_HOLIDAY_COLOR   = '#EFCFBD'; // うすい赤
var PRIVATE_HOLIDAY_COLOR = '#FFCFA5'; // オレンジ
var NO_DATA_FOUND = '該当のレコードはありません';
var globalEventHandles = {};
//******************************************************************************
// Stringの拡張
String.prototype.trim = function() {
    return this.replace(/^[\s　]+|[\s　]+$/g, '');
};
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
// Arrayの拡張
if(!Array.prototype.contains){
    Array.prototype.contains = function(value){
        for(var i in this){
            if(this.hasOwnProperty(i) && this[i] === value){
                return true;
            }
        }
        return false;
    }
}

//******************************************************************************
// グローバル変数
if(!ATK){
    var ATK = {};
}
if(!ATK.dialog){
    ATK.dialog = {};
}
//******************************************************************************
/*---------------
 クロージャひな形
ATK.template = function(){
    //--------------------------------------------------------------------------
    // メンバ変数宣言
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    // 関数
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    // 初期化（必要があれば）
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    // 公開メソッド
    //--------------------------------------------------------------------------
    return {
    };
}(); <- 最後に'()'をつけた場合、宣言と同時にインスタンス化される。
'()'をつけない場合は以下のようにしてインスタンスを作成。
var t = ATK.template();
---------------*/
//******************************************************************************
// AJAX クロージャ
//******************************************************************************
ATK.ajax = function(){
    //--------------------------------------------------------------------------
    // メンバ変数宣言
    //--------------------------------------------------------------------------
    var busy = false;
    var okListener;
    var ngListener;
    var debugLevel = 2;

    //--------------------------------------------------------------------------
    // 関数
    //--------------------------------------------------------------------------
    // エラー表示
    var showError = function(obj){
        teasp.tsAlert('エラー：' + obj.error.message);
    };

    // デバッグレベルのセット
    var setDebugLevel = function(v){
        debugLevel = v;
    };

    var getDebugLevel = function(){
        return debugLevel;
    };

    // リクエスト送信
    var requestSend = function(obj, subp, sendFunc, okL, ngL){
        if(busy){
            return false;
        }
        busy = true;
        okListener = okL;
        ngListener = ngL;
/*
        obj = ATK.etc.scanElements(obj);
*/
        if(debugLevel >= 2){
            console.debug(dojo.toJson(obj));
        }
        document.body.style.cursor = 'wait';
        try{
            sendFunc(dojo.toJson(obj), (subp ? subp : ''));
        }catch(e){
            console.debug(e.message);
        }
        return true;
    };

    // レスポンス受信
    var responseRecv = function(jsonText, subText){
        busy = false;
        var o;
        if(debugLevel >= 1){
            console.debug(jsonText);
        }
        try{
            o = dojo.fromJson(jsonText);
            if(o.error){
                if (o.error.messageId != null) {
                    o.error.message = teasp.message.getErrorMessage(o.error);
                }

                if(!ngListener){
                    showError(o);
                }else{
                    ngListener(o, subText);
                }
            }else{
                okListener(o, subText);
            }
            document.body.style.cursor = 'default';
        }catch(e){
            console.debug(e.message);
        }
    };

    // レスポンス受信
    var responseRecv2 = function(jsonText, subText){
        busy = false;
        var o = jsonText;
        if(debugLevel >= 1){
            console.debug(dojo.toJson(jsonText));
        }
        if(o.error){
            if (o.error.messageId != null) {
                o.error.message = teasp.message.getErrorMessage(o.error);
            }

            if(!ngListener){
                showError(o);
            }else{
                ngListener(o, subText);
            }
        }else{
            okListener(o, subText);
        }
        document.body.style.cursor = 'default';
    };

    //--------------------------------------------------------------------------
    // 初期化（必要があれば）
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    // 公開メソッド
    //--------------------------------------------------------------------------
    return {
        requestSend : requestSend,
        responseRecv : responseRecv,
        responseRecv2 : responseRecv2,
        getDebugLevel : getDebugLevel,
        setDebugLevel : setDebugLevel
    };
}();
//******************************************************************************
// ユーティリティ・クロージャ
//******************************************************************************
ATK.util = function(){
    //--------------------------------------------------------------------------
    // メンバ変数宣言
    //--------------------------------------------------------------------------
    var zenkakuNumber = '０１２３４５６７８９';
    var complexNumber = '0123456789０１２３４５６７８９.';
    var weekJp = ['日','月','火','水','木','金','土'];
    var timeform = {form:'h:mm', round:1};

    //--------------------------------------------------------------------------
    // 関数
    //--------------------------------------------------------------------------
    // 時刻表示形式のセット
    var setTimeFormat = function(frm){
        timeform = frm;
    };
    // 全角数字と「：」「．」を半角に変換
    var zenNum2han = function(value){
        var i, s, x, result = '';
        if(value){
            for(i = 0 ; i < value.length ; i++){
                s = value.substring(i, i+1);
                if(s.match(/\d/)){
                    result += s;
                }else if(s == '.' || s == '．'){
                    result += '.';
                }else if(s == ':' || s == '：'){
                    result += ':';
                }else{
                    x = zenkakuNumber.indexOf(s);
                    if(x >= 0){
                        result += ('' + x);
                    }
                }
            }
        }
        return result;
    };
    // 手入力された値を時間の書式に変換して返す
    var supportTime = function(value, f, wt) {
        var m, t, h, t1, t2, t3, n1, n3, result = '';
        var frm = f ? f : timeform;
        var v = zenNum2han(value);
        if(/^\d{5,}$/.test(v)){ // 5桁以上の数字
            v = v.substring(0, 4);
        }
        if(/^(\d{3,4})$/.test(v)){ // 3桁～4桁の数字
            t = parseInt(RegExp.$1, 10);
            h = Math.floor(t / 100);
            m = (t % 100);
            if(frm.form == 'h:mm') {
                if(m > 60){
                    h++;
                    m %= 60;
                }
                v = '' + h + ':' + (m < 10 ? '0' + m : m);
            }else{
                v = '' + h + '.' + m;
            }
        }
        if(v.match(/^(\d*)(:|\.)?(\d*)$/)){
            t1 = RegExp.$1;
            t2 = RegExp.$2;
            t3 = RegExp.$3;
            n1 = (t1 ? parseInt(t1, 10) : 0);
            n3 = (t3 ? parseInt(t3, 10) : 0);
            if(!t1 || n1 > 48){
                result = '';
            }else{
                if(t2 == '.'){
                    n3 = Math.round(parseFloat('0.'+ (t3 ? t3 : n3)) * 60);
                }
                if(frm.round > 1 && wt) {
                    var has = frm[wt];
                    if(has == 1){ // 切り捨て
                        n3 = frm.round * Math.floor(n3 / frm.round);
                    }else if(has == 2){ // 切り上げ
                        n3 = frm.round * Math.ceil(n3 / frm.round);
                    }else{
                        n3 = frm.round * Math.round(n3 / frm.round);
                    }
                }
                if(n3 >= 60) {
                    m = Math.floor(n3 / 60);
                    n3 -= (m * 60);
                    n1 += m;
                    if(n1 > 48){
                        return '';
                    }
                }
                if(n1 == 48){
                    n3 = 0;
                }
                if(frm.form == 'h:mm') {
                    result = '' + n1 + ':' + (n3 < 10 ? '0' + n3 : n3);
                } else {
                    n3 = Math.round(n3 * 100 / 60);
                    result = '' + n1 + '.' + (n3 < 10 ? '0' + n3 : n3);
                }
            }
        }
        return result;
    };
    var supportTimeL = function(value, f, wt) {
        var m, t, h, t1, t2, t3, n1, n3, result = '';
        var frm = f ? f : timeform;
        var v = zenNum2han(value);
        if(/^\d{6,}$/.test(v)){ // 5桁以上の数字
            v = v.substring(0, 5);
        }
        if(/^(\d{4,5})$/.test(v)){ // 4桁～5桁の数字
            t = parseInt(RegExp.$1, 10);
            h = Math.floor(t / 100);
            m = (t % 100);
            if(frm.form == 'h:mm') {
                if(m > 60){
                    h++;
                    m %= 60;
                }
                v = '' + h + ':' + (m < 10 ? '0' + m : m);
            }else{
                v = '' + h + '.' + m;
            }
        }
        if(v.match(/^(\d*)(:|\.)?(\d*)$/)){
            t1 = RegExp.$1;
            t2 = RegExp.$2;
            t3 = RegExp.$3;
            n1 = (t1 ? parseInt(t1, 10) : 0);
            n3 = (t3 ? parseInt(t3, 10) : 0);
            if(!t1){
                result = '';
            }else{
                if(t2 == '.'){
                    n3 = Math.round(parseFloat('0.'+ (t3 ? t3 : n3)) * 60);
                }
                if(n3 >= 60) {
                    m = Math.floor(n3 / 60);
                    n3 -= (m * 60);
                    n1 += m;
                }
                if(frm.form == 'h:mm') {
                    result = '' + n1 + ':' + (n3 < 10 ? '0' + n3 : n3);
                } else {
                    n3 = Math.round(n3 * 100 / 60);
                    result = '' + n1 + '.' + (n3 < 10 ? '0' + n3 : n3);
                }
            }
        }
        return result;
    };
    // 時間入力補助
    var inputSupportTime = function(node) {
        if(node.maxLength == 6){
            node.value = supportTimeL(node.value);
        }else{
            var wt = null;
            if(dojo.hasClass(node, 'roundBegin')){
                wt = 'roundBegin';
            }else if(dojo.hasClass(node, 'roundEnd')){
                wt = 'roundEnd';
            }
            node.value = supportTime(node.value, null, wt);
        }
    };

    // 金額入力欄から数値だけ取り出す
    var money2number = function(val){
        var i, x, n = 0;
        if(val == ''){
            return '';
        }
        if(!val){
            return 0;
        }
        for(i = 0 ; i < val.length ; i++){
            x = complexNumber.indexOf(val.substring(i, i+1));
            if(x >= 20){
                break;
            }
            if(x >= 0){
                n = (n * 10 + (x >= 10 ? x - 10 : x));
            }
        }
        return n;
    };

    // 半角文字かどうかを判別する
    var isSingleByteChar = function(str, maxlen) {
       var re = new RegExp('^[0-9A-Zｱ-ﾝﾞﾟｰ\\\\,\\.｢｣()\\/\\- ]{0,' + maxlen + '}$');
       if (re.test(str)) {
           return true;
       } else {
           return false;
       }
    }

    // 数字かどうかを判別する
    var isNumberChar = function(str, maxlen) {
       var re = new RegExp('^[0-9]{0,' + maxlen + '}$');
       if (re.test(str)) {
           return true;
       } else {
           return false;
       }
    }

    /**
     * 金額入力欄から数値だけ取り出す
     *
     * @param {string} val 入力文字列
     * @return 数値
     */
    var money2numberF = function(val){
        if(val == ''){
            return '';
        }
        if(!val){
            return 0;
        }

        var i, x = 0;
        var str = '';
        for(i = 0 ; i < val.length ; i++){
            x = complexNumber.indexOf(val.substring(i, i+1));
            if(x == 20) {
                str += '.';
            } else if(x >= 10) {
                str += ('' + (x - 10));
            } else if(x >= 0){
                str += ('' + x);
            }
        }

        var cnvVal = parseFloat(str);
        if(isNaN(cnvVal)){
            return 0;
        }

        return cnvVal;
    };

    var inputSupportMoney = function(node, enc, flag) {
        var m = money2number(node.value);
        node.value = addFigure(m, true, enc, flag);
        return m;
    };

    /**
     * 金額入力欄の文字列の書式変換
     *
     * @param {Object} node テキストボックスノード
     * @param {Boolean} yen trueの場合、先頭に'\'をつける
     * @param {Boolean} enc true:'\'をコードに置き換える
     * @param {Boolean} flag true:値が0の時に''を返す
     * @param {Integer} scale 小数点以下桁数
     * @returns 変換後の文字列
     */
    var inputSupportMoneyF = function(node, yen, enc, flag, scale) {
        var m = money2numberF(node.value);
        node.value = (m == '' ? m : addFigure(m.toFixed(scale), yen, enc, flag));
        return m;
    };

    // 時刻入力欄からフォーカスが離れた
    var onblurTime = function(e){
        inputSupportTime(e.target);
    };
    // 時刻入力欄でキーボード入力された
    var onkeypressTime = function(e){
        if (e.keyChar == "" && e.keyCode == 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
            inputSupportTime(e.target);
            e.preventDefault();
            e.stopPropagation();
        }
    };

    // 金額入力欄からフォーカスが離れた
    var onblurMoney = function(e){
        inputSupportMoney(e.target);
    };
    // 金額入力欄でキーボード入力された
    var onkeypressMoney = function(e){
        if (e.keyChar == "" && e.keyCode == 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
            inputSupportMoney(e.target);
            e.preventDefault();
            e.stopPropagation();
        }
    };

    var filtValue = function(value, defau){
        if(!value){
            return (defau ? defau : '');
        }
        return value;
    };


    // 分をそのまま、または hh:mm に変換して返す。
    // f: 'hh:mm' なら hh:mm に変換。
    // n: v が 0 の時、n の引数がないか 0 なら '0:00' を返す。
    var timeValue = function(v, f, n){
        var frm = (f ? f : 'hh:mm');
        if(v === 0){
            return (n ? '' : (frm == 'hh:mm' ? '0:00' : '0.00'));
        }
        if(!v){
            return '';
        }
        var minus = (v < 0);
        if(minus){
            v = Math.abs(v);
        }
        var h = Math.floor(v / 60);
        var m = (Math.round(v) % 60);
        if(frm != 'hh:mm'){
            m = Math.round(m * 100 / 60);
            return (minus ? '-' : '') + h + '.' + (m < 10 ? '0' : '') + m;
        }
        return (minus ? '-' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    };

    // 時間（hh:mm OR hh.mm）を分に変換
    var clock2minutes = function(value){
        if(/(\d+)(:|\.)(\d+)/.test(value)){
            if(RegExp.$2 == ':'){
                return parseInt(RegExp.$1, 10) * 60 + parseInt(RegExp.$3, 10);
            }else{
                return Math.round(parseFloat(value) * 60);
            }
        }
        return undefined;
    };

    // 適用日の文字列を取得
    var getSchedString = function(o){
        if(o.schedOption === undefined){
            return '';
        }
        if(!o.schedOption){
            return ('毎週 ' + o.schedWeekly + ' 曜日');
        }else if(o.schedOption == 1){
            var buf = '毎月';
            if(o.schedMonthlyDate){
                buf += o.schedMonthlyDate + ' 日';
            }else{
                buf += ('第' + o.schedMonthlyLine + ' ' + schedMonthlyWeek + ' 曜日');
            }
            return buf;
        }else{
            return 'カレンダーで設定';
        }
    };

    var getWeekIndexByJp = function(s){
        for(var i = 0 ; i < weekJp.length ; i++){
            if(weekJp[i] == s){
                return i;
            }
        }
        return -1;
    };

    var getWeekJpByIndex = function(index){
        return weekJp[index];
    };

    /**
     * 数値を \#,### に変換
     *
     * @param str 変換元の値
     * @param yen trueの場合、先頭に'\'をつける
     * @param enc trueの場合、'\'をコードに置き換える
     * @param flag trueの場合、値が 0 なら '' を返す
     */
    var addFigure = function(str, yen, enc, flag) {
        if(typeof(str) == 'number'){
            str = '' + str;
        }else if(!str){
            return '';
        }
        var num = new String(str).replace(/,/g, "");
        while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
        if(flag && parseFloat(num) == 0){
            return '0';
        }
        return (yen ? teasp.message.getLabel(enc ? 'cunit_html' : 'cunit_text') : '') + num; // (enc ? '&#165;' : '\\')
    };

    var sliceTime = function(o, p) {
        if(o.from < p.from  && o.to > p.to){
            return [
                {from:o.from, to:p.from, id:o.id},
                {from:p.to  , to:o.to  , id:o.id}
            ];
        }else if((o.from < p.from  && o.to == p.to) ||
                 (o.from < p.from  && o.to < p.to  && o.to > p.from)){
            return [
                {from:o.from, to:p.from, id:o.id}
            ];
        }else if((o.from == p.from && o.to > p.to) ||
                 (o.from > p.from  && o.from < p.to  && o.to > p.to)){
            return [
                {from:p.to  , to:o.to  , id:o.id}
            ];
        }else if((o.from < p.from  && o.to < p.to  && o.to == p.from)||
                 (o.from < p.from  && o.to < p.to  && o.to < p.from)){
            return [
                {from:o.from, to:o.to  , id:o.id}
            ];
        }else if((o.from > p.from  && o.from == p.to && o.to > p.to) ||
                 (o.from > p.from  && o.from > p.to)){
            return [
                {from:o.from, to:o.to  , id:o.id}
            ];
        }
        return [];
    };

    // 時間範囲(a)リストを時間範囲(b)で分割
    var sliceTimes = function(ol, p) {
        var nl = [];
        for(var i = 0 ; i < ol.length ; i++) {
            var o = sliceTime(ol[i], p);
            if(nl.length <= 0){
                nl = o;
            }else{
                for(var ii = 0 ; ii < o.length ; ii++){
                    nl.push(o[ii]);
                }
            }
        }
        return nl;
    };

    /**
     * 重複時間の取得
     *
     * @param {object} o {from:x, to:x} 時間の範囲を示す(a)
     * @param {array} lst [{from:x, to:x},..] 時間の範囲の配列(b)
     * @return {number} (a) の時間の範囲と (b) の時間の範囲の重なる部分の時間の合計を返す。値の単位は分。
     */
    var rangeTime = function(o, lst){
        var i, p, t = 0;
        for(i = 0 ; i < lst.length ; i++){
            p = lst[i];
            if(o.from < p.from && p.to < o.to){
                t += (p.to - p.from);
            }else if(o.from > p.from && o.to < p.to){
                t += (o.to - o.from);
            }else if((o.from <= p.from && o.to <= p.to) && p.from < o.to){
                t += (o.to - p.from);
            }else if((o.from >= p.from && o.to >= p.to) && o.from < p.to){
                t += (p.to - o.from);
            }
        }
        return t;
    };

    // 日付オブジェクトまたは yyyy-M-d 形式の文字列を yyyyMMdd の数値に変換
    var dateToYmdNumeric = function(dt){
        var d;
        if(typeof(dt) == 'string' && /(\d+)\D(\d+)\D(\d+)/.test(dt)){
            return parseInt(RegExp.$1, 10) * 10000 + parseInt(RegExp.$2, 10) * 100 + parseInt(RegExp.$3, 10);
        }else if(typeof(dt) == 'object'){
            d = dt;
            return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
        }
        return dt;
    };

    function limitChars(node, maxlength, msg) {
        if(node.value.length > maxlength){
            if(msg){
                teasp.tsAlert(msg);
            }
            node.value = node.value.substr(0,maxlength);
        }
        node.focus();
    }

    /*
     * 文字列をDateオブジェクトに変換する
     *
     * @param 文字列
     * @return {date:<object>, datef:<string>, failed:<number>, tmpl:<string>}
     * datef・・変換成功の場合、Dateを yyyy-MM-dd に変換してセット
     * failed・・成功：0、引数が空：1、書式無効：2、日付無効：3
     * tmpl・・ failed!=0のときにセットする。メッセージ出力用のテンプレート
     * （呼び出し側で dojo.replace メソッドでテンプレートからメッセージ作成）
     */
    var strToDate = function(_str, _hos){
        var str = (_str || '').trim();
        if(str == ''){
            return {
                date   : null,
                dater  : null,
                datef  : null,
                failed : 1,
                tmpl   : teasp.message.getLabel('tm00000050') // {0}を入力してください
            };
        }
        var hos = (_hos ? _hos : 'yyyy/MM/dd');
        if(/^(\d{4})[\D](\d{1,2})[\D](\d{1,2})$/.test(str)){
            var y = parseInt(RegExp.$1, 10);
            var m = parseInt(RegExp.$2, 10);
            var d = parseInt(RegExp.$3, 10);
            var dt = dojo.date.locale.parse(y + '/' + m + '/' + d, {datePattern:'yyyy/M/d', selector:'date'});
            if(dt && y >= 1900 && y < 3000){
                return {
                    date   : dt,
                    dater  : dojo.date.locale.format(dt, {datePattern:hos, selector:'date'}),
                    datef  : dt.getFullYear() + '-' + (dt.getMonth() < 9 ? '0' : '') + (dt.getMonth() + 1) + '-' + (dt.getDate() < 10 ? '0' : '') + dt.getDate(),
                    failed : 0,
                    tmpl   : null
                };
            }else{
                return {
                    date   : null,
                    dater  : null,
                    datef  : null,
                    failed : 3,
                    tmpl   : teasp.message.getLabel('tm00000060') // {0}の値は無効です
                };
            }
        }else{
            var dt = dojo.date.locale.parse(str, DATE_FORM_S);
            if(dt){
                return {
                    date   : dt,
                    dater  : dojo.date.locale.format(dt, DATE_FORM_S),
                    datef  : dt.getFullYear() + '-' + (dt.getMonth() < 9 ? '0' : '') + (dt.getMonth() + 1) + '-' + (dt.getDate() < 10 ? '0' : '') + dt.getDate(),
                    failed : 0,
                    tmpl   : null
                };
            }
            return {
                date   : null,
                dater  : null,
                datef  : null,
                failed : 2,
                tmpl   : teasp.message.getLabel('tm00000071') // {0}の書式は無効です。
            };
        }
        return {
            date   : null,
            dater  : null,
            datef  : null,
            failed : 2,
            tmpl   : teasp.message.getLabel('tm00000070') // {0}の書式は無効です。yyyy/m/d 形式で入力してください。
        };
    };

    var directDateHandler = function(node, value, func, _errFunc){
        var blurAction = function(v, ef){
            var oldValue = v;
            var errFunc = ef;
            return function(e){
                e.target.value = oldValue;
                if(errFunc){
                    errFunc(null);
                }
                e.preventDefault();
                e.stopPropagation();
            };
        }(value, _errFunc);
        var keypressAction = function(v, func, ef){
            var oldValue = v;
            var callback = func;
            var errFunc = ef;
            return function(e){
                if((e.keyChar == "" || e.keyChar == "\r") && e.keyCode == 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
                    e.preventDefault();
                    e.stopPropagation();
                    var f = ATK.util.strToDate(e.target.value);
                    if(f.failed > 1){
                        if(errFunc){
                            errFunc(dojo.replace(f.tmpl, ['日付']));
                        }
                    }else{
                        e.target.value = (f.date ? f.dater : '');
                        if(errFunc){
                            errFunc(null);
                        }
                        if((f.date && f.datef != oldValue) || (!f.date && oldValue != '')) {
                            callback();
                        }
                    }
                }
            };
        }(value, func, _errFunc);
        if(node.id){
            if(globalEventHandles[node.id + '_blur']){
                dojo.disconnect(globalEventHandles[node.id + '_blur']);
                delete globalEventHandles[node.id + '_blur'];
            }
            if(globalEventHandles[node.id + '_onkeypress']){
                dojo.disconnect(globalEventHandles[node.id + '_onkeypress']);
                delete globalEventHandles[node.id + '_onkeypress'];
            }
        }
        var h1 = dojo.connect(node, 'blur'      , blurAction);
        var h2 = dojo.connect(node, 'onkeypress', keypressAction);
        if(node.id){
            globalEventHandles[node.id + '_blur'      ] = h1;
            globalEventHandles[node.id + '_onkeypress'] = h2;
        }
    };

    var lookupConstraint = function(){
        dojo.query('.lookupInput').forEach(function(elem){
            var n = elem.firstChild;
            while(n){
                if(/input/i.test(n.tagName) && /text/i.test(n.type)){
                    dojo.addClass(n, 'inputran');
                    dojo.style(n, { 'height': '16px', 'padding-left': '2px', 'background-color': '#E9FFFF' });
                    dojo.connect(n, 'onkeypress', function(e) {
                        if(e.keyCode != 8
                        && e.keyCode != 46
                        && e.keyCode != 35
                        && e.keyCode != 36
                        && e.keyCode != 37
                        && e.keyCode != 39
                        && !(e.ctrlKey && e.keyCode == 67)){
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    });
                }else if(/a/i.test(n.tagName)){
                    dojo.style(n.firstChild, 'vertical-align', 'middle');
                }
                n = n.nextSibling;
            }
        });
    };

    /**
     * リストボックスのインデントを生成する
     *
     * @param {string} level 階層
     * @return {string} インデント
     */
    var createListBoxIndent = function(level){
        var spc = '';
        for (var i = 0; i < level; i++) {
            spc += '&nbsp;&nbsp;'
        }
        return spc;
    };

    var transferPage = function(url, flag){
        if(flag){
            parent.location.href = url;
        }else{
            window.open(url);
        }
    };

    //--------------------------------------------------------------------------
    // 初期化（必要があれば）
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    // 公開メソッド
    //--------------------------------------------------------------------------
    return {
        setTimeFormat     : setTimeFormat,
        onblurTime        : onblurTime,
        onkeypressTime    : onkeypressTime,
        onblurMoney       : onblurMoney,
        onkeypressMoney   : onkeypressMoney,
        inputSupportTime  : inputSupportTime,
        inputSupportMoney : inputSupportMoney,
        inputSupportMoneyF: inputSupportMoneyF,
        filtValue         : filtValue,
        timeValue         : timeValue,
        clock2minutes     : clock2minutes,
        money2number      : money2number,
        money2numberF     : money2numberF,
        getWeekIndexByJp  : getWeekIndexByJp,
        getWeekJpByIndex  : getWeekJpByIndex,
        addFigure         : addFigure,
        sliceTime         : sliceTime,
        sliceTimes        : sliceTimes,
        rangeTime         : rangeTime,
        dateToYmdNumeric  : dateToYmdNumeric,
        limitChars        : limitChars,
        strToDate         : strToDate,
        directDateHandler : directDateHandler,
        lookupConstraint  : lookupConstraint,
        createListBoxIndent: createListBoxIndent,
        transferPage      : transferPage,
        isSingleByteChar  : isSingleByteChar,
        isNumberChar      : isNumberChar
    };
}();

//**************************************************************************
// 日付選択ダイアログ
//**************************************************************************
ATK.dialog.Calendar = function(){
    //--------------------------------------------------------------------------
    // メンバ変数宣言
    //--------------------------------------------------------------------------
    var attached = false;
    var inobj;
    var onfinishfunc;
    var dialog;
    var calendar;
    var busy;

    //--------------------------------------------------------------------------
    // 関数
    //--------------------------------------------------------------------------
    var attach = function(){
        if(attached){
            return;
        }
        attached = true;

        dialog = new dijit.Dialog({
            title    : teasp.message.getLabel('tm60001010'), // 日付選択
            id       : 'dialogCalendar',
            duration : 1
        });
        dialog.attr("content",
            '<table border="0" cellpadding="0" cellspacing="0" style="font-size:12px;">'
            + '<tr><td style="padding-left:4px;padding-right:4px;"><div id="_atk_cal"></div></td></tr>'
            + '<tr><td style="text-align:center;padding-top:0px;">'
            + '<input type="button" title="キャンセル" class="pb_base pb_btn_cancel" id="_atk_cal_cancel" style="font-size:13px;padding:6px 16px;"/>'
            + '</td></tr>'
            + '</table>'
        );

        dojo.byId('_atk_cal_cancel').onclick = function(){ close(); };
    };

    var open = function(_inobj, _onfinishfunc){
        busy = true;
        inobj = _inobj;
        onfinishfunc = _onfinishfunc;
        attach();

        if(calendar){
            calendar.destroy('_atk_cal');
        }
        calendar = new dijit.Calendar({
            isDisabledDate  : inobj.isDisabledDateFunc,
            onValueSelected : function(){ selected(arguments[0]); },
            onClick         : function(e){
                console.debug('onclick ');
                console.debug(e);
            }
        }, "_atk_cal");

        if(inobj.date){
            calendar.setValue(inobj.date);
        }

        calendar.startup();
        dialog.startup();

        busy = false;
        dialog.show();
    };

    var close = function(){
        dialog.hide();
    };

    var saveAndClose = function(){
        var o = {};
        dialog.hide();
        onfinishfunc(o);
    };

    var selected = function(arg){
        if(busy){
            return;
        }
        dialog.hide();
        onfinishfunc(arg);
    };

    //--------------------------------------------------------------------------
    // 初期化（必要があれば）
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    // 公開メソッド
    //--------------------------------------------------------------------------
    return {
        open   : open
    };
}(); // ATK.dialog.Calendar
