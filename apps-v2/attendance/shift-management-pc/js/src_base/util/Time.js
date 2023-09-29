teasp.provide('teasp.util.time');

/**
 * 時間関連ユーティリティ.<br/>
 * 時間絡みの処理を行うクラスです。<br/>
 *
 * @constructor
 * @author DCI小島
 */
teasp.util.time = function(){
};

teasp.util.time.zenkakuNumber = '０１２３４５６７８９';
teasp.util.time.timeform = {form:'h:mm', round:1};

/**
 * 時刻表示形式のセット
 *
 * @param {Object} frm 書式<br/>
 *     以下の要素を格納
 *     <table style="border-collapse:collapse;border:1px solid gray;margin:4px;" border="1">
 *     <tr><td>form      </td><td>{string} </td><td>'h:mm' or '10'    </td></tr>
 *     <tr><td>round     </td><td>{number} </td><td>1, 5, 10, 15, 30  </td></tr>
 *     <tr><td>roundBegin</td><td>{number} </td><td>1:切捨て, 2:切上げ</td></tr>
 *     <tr><td>roundEnd  </td><td>{number} </td><td>1:切捨て, 2:切上げ</td></tr>
 *     </table>
 */
teasp.util.time.setTimeFormat = function(frm){
    teasp.util.time.timeform = frm;
};
/**
 * 全角数字と「：」「．」を半角に変換
 *
 * @param {?string} value 文字列
 * @return {string} 変換後文字列
 */
teasp.util.time.zenNum2han = function(value){
    var i, s, x, result = '';
    if(value){
        for(i = 0 ; i < value.length ; i++){
            s = value.substring(i, i+1);
            if(s.match(/\d/)){
                result += s;
            }else if(s === '.' || s === '．'){
                result += '.';
            }else if(s === ':' || s === '：'){
                result += ':';
            }else{
                x = teasp.util.time.zenkakuNumber.indexOf(s);
                if(x >= 0){
                    result += x;
                }
            }
        }
    }
    return result;
};
/**
 * 手入力された値を時間の書式に変換して返す.<br/>
 * ※ 48時間を超える値は無効として '' を返す。48時間を超える値が
 * 想定される場合は supportTimeL を使うこと。<br/>
 * ※ 自動切り捨て／切り上げを行う。
 *
 * @param {string} value 文字列
 * @param {Object=} f 書式（※setTimeFormat の frm 参照）
 * @param {(string|null)=} wt ('roundBegin' or 'roundEnd' or それ以外)
 * @param {string=} fxtimes 丸め対象外の時刻のカンマ区切り文字列
 * @return 変換後の文字列
 */
teasp.util.time.supportTime = function(value, f, wt, fxtimes) {
    var m, t, h, t1, t2, t3, n1, n3, result = '', match;
    var frm = (f || teasp.util.time.timeform);
    var v = teasp.util.time.zenNum2han(value);
    if(/^\d{5,}$/.test(v)){ // 5桁以上の数字
        v = v.substring(0, 4);
    }
    if((match = /^(\d{3,4})$/.exec(v))){ // 3桁～4桁の数字
        t = parseInt(match[1], 10);
        h = Math.floor(t / 100);
        m = (t % 100);
        if(frm.form === 'h:mm') {
            if(m > 60){
                h++;
                m %= 60;
            }
            v = h + ':' + (m < 10 ? '0' + m : m);
        }else{
            v = h + '.' + m;
        }
    }
    if((match = /^(\d*)(:|\.)?(\d*)$/.exec(v))){
        t1 = match[1];
        t2 = match[2];
        t3 = match[3];
        n1 = (t1 ? parseInt(t1, 10) : 0);
        n3 = (t3 ? parseInt(t3, 10) : 0);
        if(!t1 || n1 > 48){
            result = '';
        }else{
            if(t2 === '.'){
                n3 = Math.round(parseFloat('0.'+ (t3 || n3)) * 60);
            }
            var nor = false;
            if(n3 < 60 && fxtimes){
                var fxt = fxtimes.split(',');
                if(fxt.contains('' + (n1 * 60 + n3))){
                    nor = true;
                }
            }
            if(!nor && frm.round > 1 && wt) {
                var has = frm[wt];
                if(has === 1){ // 切り捨て
                    n3 = frm.round * Math.floor(n3 / frm.round);
                }else if(has === 2){ // 切り上げ
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
            if(frm.form === 'h:mm') {
                result = n1 + ':' + (n3 < 10 ? '0' + n3 : n3);
            } else {
                n3 = Math.round(n3 * 100 / 60);
                result = n1 + '.' + (n3 < 10 ? '0' + n3 : n3);
            }
        }
    }
    return result;
};
/**
 * 手入力された値を時間の書式に変換して返す(48時間以上の場合）.<br/>
 * ※ 自動切り捨て／切り上げを行わない。
 *
 * @param {string} value 文字列
 * @param {Object=} f 書式（※setTimeFormat の frm 参照）
 * @param {string=} wt ('roundBegin' or 'roundEnd' or それ以外)
 * @return 変換後の文字列
 */
teasp.util.time.supportTimeL = function(value, f, wt) {
    var m, t, h, t1, t2, t3, n1, n3, result = '', match;
    var frm = (f || teasp.util.time.timeform);
    var v = teasp.util.time.zenNum2han(value);
    if(/^\d{6,}$/.test(v)){ // 5桁以上の数字
        v = v.substring(0, 5);
    }
    if((match = /^(\d{4,5})$/.exec(v))){ // 4桁～5桁の数字
        t = parseInt(match[1], 10);
        h = Math.floor(t / 100);
        m = (t % 100);
        if(frm.form === 'h:mm') {
            if(m > 60){
                h++;
                m %= 60;
            }
            v = h + ':' + (m < 10 ? '0' + m : m);
        }else{
            v = h + '.' + m;
        }
    }
    if((match = /^(\d*)(:|\.)?(\d*)$/.exec(v))){
        t1 = match[1];
        t2 = match[2];
        t3 = match[3];
        n1 = (t1 ? parseInt(t1, 10) : 0);
        n3 = (t3 ? parseInt(t3, 10) : 0);
        if(!t1){
            result = '';
        }else{
            if(t2 === '.'){
                n3 = Math.round(parseFloat('0.'+ (t3 || n3)) * 60);
            }
            if(n3 >= 60) {
                m = Math.floor(n3 / 60);
                n3 -= (m * 60);
                n1 += m;
            }
            if(frm.form === 'h:mm') {
                result = n1 + ':' + (n3 < 10 ? '0' + n3 : n3);
            } else {
                n3 = Math.round(n3 * 100 / 60);
                result = n1 + '.' + (n3 < 10 ? '0' + n3 : n3);
            }
        }
    }
    return result;
};
/**
 * 時間入力補助.<br/>
 * ノードにセットされた時間を設定に合わせて変換する。
 *
 * @param {Object} node テキストボックスノード
 */
teasp.util.time.inputSupportTime = function(node) {
    if(node.maxLength === 6){
        node.value = teasp.util.time.supportTimeL(node.value);
    }else{
        var wt = null;
        if(dojo.hasClass(node, 'roundBegin')){
            wt = 'roundBegin';
        }else if(dojo.hasClass(node, 'roundEnd')){
            wt = 'roundEnd';
        }
        node.value = teasp.util.time.supportTime(node.value, null, wt, dojo.attr(node, 'fxtimes'));
    }
};

/**
 * 時刻入力欄からフォーカスが離れた時の処理
 *
 * @param {Object} e
 * @return 変換後の文字列
 */
teasp.util.time.onblurTime = function(e){
    teasp.util.time.inputSupportTime(e.target);
};
/**
 * 時刻入力欄でキーボード入力された時の処理
 *
 * @param {Object} e
 */
teasp.util.time.onkeypressTime = function(e){
//    if (e.keyChar === "" && e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
    if (e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
        teasp.util.time.inputSupportTime(e.target);
        e.preventDefault();
        e.stopPropagation();
    }else if(e.target.size === undefined
    && e.target.rows === undefined
    && e.keyCode == dojo.keys.BACKSPACE){
         e.preventDefault();
         e.stopPropagation();
     }
};

/**
 * 分単位の値を書式変換（hh:mm か 10進数）して返す。
 *
 * @param {number} v 時間
 * @param {string=} f 'hh:mm'またはそれ以外
 * @param {boolean=} n v===0 の時、n が真なら''を、それ以外なら'0:00'または'0.00'を返す。
 * @return {string} 変換後の値
 */
teasp.util.time.timeValue = function(v, f, n){
    var frm = (f || 'hh:mm');
    if(v === 0){
        return (n ? '' : (frm === 'hh:mm' ? '0:00' : '0.00'));
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
    if(frm !== 'hh:mm'){
        m = Math.round(m * 100 / 60);
        return (minus ? '-' : '') + h + '.' + (m < 10 ? '0' : '') + m;
    }
    return (minus ? '-' : '') + h + ':' + (m < 10 ? '0' : '') + m;
};

/**
 * 時間（hh:mm または hh.mm）を分に変換
 *
 * @param {string} value 時間
 * @return {number|undefined} 分。変換できない場合は undefined を返す。
 */
teasp.util.time.clock2minutes = function(value){
    var match;
    if((match = /(\d+)(:|\.)(\d+)/.exec(value))){
        if(match[2] === ':'){
            return parseInt(match[1], 10) * 60 + parseInt(match[3], 10);
        }else{
            return Math.round(parseFloat(value) * 60);
        }
    }
    return undefined;
};

/**
 * 時間範囲が別の時間範囲にかぶらないように分割する
 *
 * @param {Object} o 時間範囲
 * @param {Object} p 時間範囲
 * @return {Array.<Object>} 分割された時間範囲の配列
 */
teasp.util.time.sliceTime = function(o, p) {
    if(typeof(p.from) != 'number' || typeof(p.to) != 'number'){
        return [
            {from:o.from, to:o.to  , id:o.id}
        ];
    }
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

/**
 * 時間範囲が別の時間範囲にかぶらないように分割する
 *
 * @param {Array.<Object>} ol 時間範囲
 * @param {Object} p 時間範囲
 * @return {Array.<Object>} 分割された時間範囲の配列
 */
teasp.util.time.sliceTimes = function(ol, p) {
    var nl = [], i, ii;
    for(i = 0 ; i < ol.length ; i++) {
        var o = teasp.util.time.sliceTime(ol[i], p);
        if(nl.length <= 0){
            nl = o;
        }else{
            for(ii = 0 ; ii < o.length ; ii++){
                nl.push(o[ii]);
            }
        }
    }
    return nl;
};

/**
 * 重複時間の取得
 *
 * @param {Object} o {from:x, to:x} 時間の範囲を示す(a)
 * @param {Array.<Object>} lst [{from:x, to:x},..] 時間の範囲の配列(b)
 * @return {number} (a) の時間の範囲と (b) の時間の範囲の重なる部分の時間の合計を返す。値の単位は分。
 */
teasp.util.time.rangeTime = function(o, lst){
    var i, p, t = 0;
    for(i = 0 ; i < lst.length ; i++){
        p = lst[i];
        if(typeof(p.from) != 'number' || typeof(p.to) != 'number'){
            continue;
        }
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

/**
 * 時間帯リストを時間帯同志が重ならないようにマージする
 *
 * @param {Array.<Object>} l 処理前の時間帯リスト
 * @return {Array.<Object>} マージ後の時間帯リスト
 */
teasp.util.time.margeTimeSpans = function(l){
    var lst = dojo.clone(l);
    lst = lst.sort(function(a, b){
        if(a.from != b.from){
            return a.from - b.from;
        }else if(a.to != b.to){
            return a.to - b.to;
        }
        return 0;
    });
    var nL = [];
    for(var i = 0 ; i < lst.length ; i++){
        var o = lst[i];
        if(nL.length <= 0){
            nL.push(o);
        }else if(nL[nL.length - 1].to < o.from){
            nL.push(o);
        }else if(nL[nL.length - 1].from > o.to){
            nL.push(o);
        }else if(nL[nL.length - 1].to < o.to){
            nL[nL.length - 1].to = o.to;
        }
    }
    return nL;
};

/**
 * 時間帯を排斥時間帯リストを含まない複数の時間帯に分解する
 *
 * @param {Array.<Object>} _ranges 時間帯
 * @param {Array.<Object>} excludes 排斥時間帯リスト
 * @return {Array.<Object>}
 */
teasp.util.time.excludeRanges = function(_ranges, excludes){
    var ranges = (_ranges ? dojo.clone(_ranges) : []);
    if(ranges.length > 0){
        for(var i = 0 ; i < excludes.length ; i++){
            ranges = teasp.util.time.sliceTimes(ranges, excludes[i]);
        }
    }
    return ranges;
};

/**
 * 開始・終了時刻が有効か
 *
 * @param {*} st 開始時刻
 * @param {*} et 終了時刻
 * @return {boolean} 開始・終了とも有効な時刻が入力されていれば True
 */
teasp.util.time.isValidRange = function(st, et){
    return (typeof(st) === 'number' && typeof(et) === 'number' && st < et);
};

/**
 * 開始・終了時刻の値が入力されているか
 *
 * @param {number} st 開始時刻
 * @param {number} et 終了時刻
 * @param {boolean=} flag =true: 両方(st<etで)入っていたら真を返す  =false:どちらかが入ってたら真を返す
 * @return {boolean} 開始・終了とも有効な時刻が入力されていれば True
 */
teasp.util.time.isInputTime = function(st, et, flag){
    if(flag){
        return teasp.util.time.isValidRange(st, et);
    }
    return (typeof(st) === 'number' || typeof(et) === 'number');
};

/**
 * 時間帯Ａのうち時間帯Ｂに含まれている時間帯だけを抽出
 *
 * @param {Array.<Object>} rangeA 時間帯Ａ
 * @param {Array.<Object>} rangeB  時間帯Ｂ
 * @param {number=} maxt 最大時間（省略時は 48*60）
 * @param {Object}
 * @return {Array.<Object>}
 */
teasp.util.time.includeRanges = function(rangeA, rangeB, maxt){
    var maxTm = (maxt || 48*60);
    // rangeB をソート
    rangeB = rangeB.sort(function(a, b){
        return a.from - b.from;
    });
    // rangeB に含まれない時間帯を得る
    var exs = [];
    var bt = 0;
    for(var i = 0 ; i < rangeB.length ; i++){
        var span = rangeB[i];
        if(bt < span.from){
            exs.push({ from: bt, to: span.from });
        }
        bt = span.to;
    }
    if(bt >= 0 && bt < maxTm){
        exs.push({ from: bt, to: maxTm });
    }
    // rangeA のうち exs に含まれない時間帯を得る
    return teasp.util.time.excludeRanges(rangeA, exs);
};
