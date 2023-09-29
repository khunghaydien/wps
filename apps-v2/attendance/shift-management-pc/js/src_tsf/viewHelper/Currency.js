/**
 * 金額入力補助
 *
 * @constructor
 */
teasp.Tsf.Currency = function(){
};

teasp.Tsf.Currency.V_YEN = '\\';
teasp.Tsf.Currency.S_YEN = '\&#165;';   // ¥マーク
teasp.Tsf.Currency.J_YEN = '円';

/**
 * 金額入力欄でEnterキーが押された or フォーカスが離れた際に通貨記号を付与する
 *
 * @param {teasp.Tsf.Dom | dojo} domHelper
 * @param {Object} inp 通貨入力するInputタグのNode
 * @param {Function=} callback
 * @param {string=} hkey
 */
teasp.Tsf.Currency.eventInput = function(domHelper, inp, callback, hkey){
    domHelper.connect(inp, 'blur', null, function(e){
        e.target.value = teasp.Tsf.Currency.formatMoneyN(e.target);
        if(callback){
            callback(e);
        }
    }, hkey);
    domHelper.connect(inp, 'onkeypress', null, function(e){
        if (e.keyChar === "" && e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
            e.target.value = teasp.Tsf.Currency.formatMoneyN(e.target);
            e.preventDefault();
            e.stopPropagation();
            if(callback){
                callback(e);
            }
        }
    }, hkey);
};

/**
 * nodeのvalueを通貨フォーマットに変換
 * 引数のnodeが持つ値を通貨フォーマットに変換する。
 * @param {*} node 
 */
teasp.Tsf.Currency.formatMoneyN = function(node){
    var allowMinus = teasp.Tsf.Dom.hasClass(node, 'ts-minus-ok');
    return teasp.Tsf.Currency.formatMoney(node.value, teasp.Tsf.Currency.V_YEN, false, allowMinus);
};

/**
 * 通貨フォーマットに変換
 * number・stringに対応
 * @param {any} val 変換前のnumber / string
 * @param {string} frm 変換フォーマット(例: teasp.Tsf.Currency.V_YEN)
 * @param {boolean} flag trueのとき、数値が0の場合空文字を返すようになる。
 * @param {boolean} allowMinus マイナスを許可するかどうか。falseの場合は、マイナスの数値も強制的にプラスの数値になる。(=絶対値になる)
 */
teasp.Tsf.Currency.formatMoney = function(val, frm, flag, allowMinus){
    var n;
    if(val === null){
        return '';
    }else if(typeof(val) == 'string'){
        n = '' + (val ? teasp.util.currency.money2number(val, allowMinus) : '');
    }else{
        n = '' + (val || 0);
    }
    if(!n){
        return '';
    }
    var num = n.replace(/,/g, "");
    while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2"))){;}
    if(flag && num == '0'){
        return '';
    }
    if(frm == teasp.Tsf.Currency.V_YEN){
        return teasp.message.getLabel('cunit_text') + num; // '\\'

    }else if(frm == teasp.Tsf.Currency.S_YEN){
        return teasp.message.getLabel('cunit_html') + num; // '\&#165;'

    }else if(frm == teasp.Tsf.Currency.J_YEN){
        return num + teasp.message.getLabel('cunit_jps'); // '円'

    }else{
        return num;
    }
};

/**
 * Salesforceの仕様に合わせた四捨五入
 * (ROUND( _num, 0)と一致するようにしています。)
 * @param {number} _num 正数または負数の実数
 * @returns {number} 四捨五入
 */
teasp.Tsf.Currency.roundSameAsSalesforce = function(_num){
    if( _num >= 0){
        return Math.floor( _num + 0.5 )  ;
    }else{
        return Math.floor( Math.abs( _num ) + 0.5 ) * -1 ;
    }
}
