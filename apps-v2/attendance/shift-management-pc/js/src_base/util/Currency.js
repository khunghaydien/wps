teasp.provide('teasp.util.currency');

/**
 * 金額関連ユーティリティ.<br/>
 * 金額絡みの処理を行うクラスです。<br/>
 *
 * @constructor
 * @author DCI小島
 */
teasp.util.currency = function(){
};

/**
 * 数値の小数点ｎ位で四捨五入し返す
 *
 * @param {number} _num 四捨五入したい数字
 * @param {number} decimalPoint 四捨五入したい小数点位
 * @return {number} 指定位置で四捨五入した数字が返る
 *
 * @author cmpArai
 */
teasp.util.currency.calcRoundDecimal = function(_num,decimalPoint){
    var num = _num * Math.pow(10, 7);
    num = Math.round(num);
    if(!num){
        return 0;
    }
//    return num = num/Math.pow(10,decimalPoint);
    return teasp.util.currency.formatDecimal(_num, decimalPoint).num;
};

teasp.util.currency.complexNumber = '0123456789０１２３４５６７８９.．';
teasp.util.currency.complexMinus  = '-－';

/**
 * 金額入力欄から数値だけ取り出す
 *
 * @param {string} val 入力文字列
 * @param {boolean=} minus true:マイナスを許容する。
 * @return {number}
 */
teasp.util.currency.money2number = function(val, minus){
    if(!val){
        return 0;
    }
    var n = null;
    var isMinus = false;
    for(var i = 0 ; i < val.length ; i++){
        var c = val.substring(i, i+1);
        var x = teasp.util.currency.complexNumber.indexOf(c);
        if(x < 0 && minus && n === null && teasp.util.currency.complexMinus.indexOf(c) >= 0){
            isMinus = true;
            continue;
        }
        if((x >= 0) && (x < 20)){
            n = (n !== null ? n * 10 : 0) + (x >= 10 ? x - 10 : x);
        }else if(x > 0){
            break;
        }
    }
    return n * (isMinus ? (-1) : 1);
};

/**
 * 金額入力欄から数値だけ取り出す(小数点対応)
 *
 * @param {string} val 入力文字列
 * @param {boolean=} minus マイナス許容フラグ
 * @return {string} 数値の文字列 !! money2number と違ってこちらは文字列を返すことに注意 !!
 */
teasp.util.currency.string2number = function(val, minus){
    var o = {
        minus : false,
        num   : 0,
        str   : '',
        sn1   : '',
        sn2   : ''
    };
    if(!val){
        return o;
    }
    var n1 = null, n2 = null;
    for(var i = 0 ; i < val.length ; i++){
        var c = val.substring(i, i+1);
        var x = teasp.util.currency.complexNumber.indexOf(c);
        if(x < 0 && minus && n1 === null && teasp.util.currency.complexMinus.indexOf(c) >= 0){
            o.minus = true;
            continue;
        }
        if((x >= 0) && (x < 20)){
            if(n2 === null){
                n1 = (n1 !== null ? n1 : '') + (x >= 10 ? x - 10 : x);
            }else{
                n2 = n2 + (x >= 10 ? x - 10 : x);
            }
        }else if(x > 0){
            if(n2 !== null){
                break;
            }
            if(n1 === null){
                n1 = '0';
            }
            n2 = '';
        }
    }
    if(!n1){
        n1 = '0';
    }
    o.str = n1 + (n2 ? ('.' + n2) : '');
    o.sn1 = n1;
    o.sn2 = n2;
    if(!n2 || /^0+$/.test(n2)){
        o.num = parseInt(o.sn1, 10);
    }else{
        o.num = parseFloat(o.str);
    }
    if(o.minus){
        o.num *= (-1);
    }
    return o;
};

/**
 * 金額入力欄の文字列の書式変換
 *
 * @param {Object} node テキストボックスノード
 * @param {boolean=} enc true:'\'をコードに置き換える
 * @param {boolean=} flag true:値が0の時に''を返す
 * @param {boolean=} minus true:マイナス数値を許容する
 * @return 変換後の文字列
 */
teasp.util.currency.inputSupportMoney = function(node, enc, flag, minus) {
    var m = teasp.util.currency.money2number(node.value,minus);
    node.value = teasp.util.currency.addFigure(m, true, enc, flag);
    return m;
};

/**
 * 金額入力欄からフォーカスが離れた時の処理
 *
 * @param {Object} e
 */
teasp.util.currency.onblurMoney = function(e){
    teasp.util.currency.inputSupportMoney(e.target);
};

/**
 * 金額入力欄でキーボード入力された時の処理
 *
 * @param {Object} e
 */
teasp.util.currency.onkeypressMoney = function(e){
    if (e.keyChar === "" && e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
        teasp.util.currency.inputSupportMoney(e.target);
        e.preventDefault();
        e.stopPropagation();
    }
};

/**
 * 数値を通貨(円)の書式 \#,### に変換
 *
 * @param {string} str 変換元の値
 * @param {boolean=} yen trueの場合、先頭に'\'をつける
 * @param {boolean=} enc trueの場合、'\'をコードに置き換える
 * @param {boolean=} flag trueの場合、値が 0 なら '' を返す
 * @return {string} 変換後の文字列
 */
teasp.util.currency.addFigure = function(str, yen, enc, flag) {
    if(typeof(str) === 'number'){
        str = '' + str;
    }else if(!str){
        return '';
    }
    var num = str.replace(/,/g, "");
    while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2"))){;}
    if(flag && num == '0'){
        return '';
    }
    return (yen ? teasp.message.getLabel(enc ? 'cunit_html' : 'cunit_text') : '') + num;  // (enc ? '&#165;' : '\\')
};

/**
 * 金額を表示
 * @param {string|number} val 値
 * @param {string=} frm 次のうちのどれか。
 *     <table style="border-collapse:collapse;border:1px solid gray;margin:4px;" border="1">
 *     <tr><th>frmの値       </th><th>書式                           </th></tr>
 *     <tr><td>'#,##0'       </td><td>カンマ区切り                   </td></tr>
 *     <tr><td>'\#,##0'      </td><td>カンマ区切り、先頭に\          </td></tr>
 *     <tr><td>'&#165;#,##0' </td><td>カンマ区切り、先頭に\のコード  </td></tr>
 *     <tr><td>'#,##0円'     </td><td>カンマ区切り、末尾に'円'       </td></tr>
 *     <tr><td>上記以外      </td><td>'#,##0'と同じ                  </td></tr>
 *     </table>
 * @param {boolean=} flag  true: 値が 0 の場合に''を返す
 * @return {string} 変換後の文字列
 */
teasp.util.currency.formatMoney = function(val, frm, flag){
    if(typeof(val) == 'number'){
        val = '' + val;
    }else if(!val){
        return '';
    }
    var num = val.replace(/,/g, "");
    while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2"))){;}
    if(flag && num == '0'){
        return '';
    }
    if(frm == '\#,##0'){
        return teasp.message.getLabel('cunit_text') + num; // '\\'

    }else if(frm == '\&#165;#,##0'){
        return teasp.message.getLabel('cunit_html') + num; // '\&#165;'

    }else if(frm == '#,##0円'){
        return num + teasp.message.getLabel('cunit_jps'); // '円'

    }else{
        return num;
    }
};

/**
 * 換算レートを表示
 * @param {string|number} val 値
 * @param {number=} fn 小数点以下の桁数の下限
 * @param {number=} fx 小数点以下の桁数の上限
 * @param {boolean=} minus true ならマイナス符号を無視する
 * @return {Object}
 */
teasp.util.currency.formatDecimal = function(val, fn, fx, minus){
    var num = null;
    var f  = (fn == undefined ? 2 : fn);
    var mx = (fx == undefined ? 6 : fx);
    if(val === ''){
        return {
            num   : 0,
            n     : 0,
            absn  : 0,
            str   : '',
            org   : '',
            sn1   : '',
            sn2   : '',
            empty : true
        };
    }
    var o = teasp.util.currency.string2number((typeof(val) == 'number' ? '' + val : val), minus);
    num = (o.minus ? '-' : '') + o.str;
    var s = teasp.util.currency.addFigure((o.minus ? '-' : '') + o.sn1);
    var s1 = o.sn1;
    var s2 = (o.sn2 || '0');
    var m = /^(\d+?)0*$/.exec(s2);
    var z = m[1];
    s2 = (z == '0' ? '' : z);
    while(s2.length < f){
        s2 += '0';
    }
    if(z.length > mx){
        if(mx <= 0){
            z = '';
        }else{
            z = z.substring(0, mx);
        }
        s2 = z;
    }
    var n = parseFloat(s1 + '.' + (s2 || '0')) * (o.minus ? (-1) : 1);
    if(n == 0){
        o.minus = false;
        num     = '0';
        s1      = '0';
        s       = '0';
    }
    return {
        minus : o.minus,
        num   : num,
        n     : n,
        absn  : Math.abs(n),
        str   : s  + (s2.length > 0 ? '.' + s2 : ''),
        org   : (o.minus ? '-' : '') + s1 + (s2.length > 0 ? '.' + s2 : ''),
        sn1   : s1,
        sn2   : s2
    };
};
