teasp.provide('teasp.util.date');

/**
 * 日付関連ユーティリティ.<br/>
 * 日付絡みの処理を行うクラスです。<br/>
 *
 * @constructor
 * @author DCI小島
 */
teasp.util.date = function(){
};

/**
 * 曜日(日本語)配列
 * @static
 * @private
 */
teasp.util.date.weekJp = [];

/**
 * タイムゾーン時差.<br/>
 * Visualforce画面でサーバから受け取ったUTCとの時差（分）をセットする。<br/>
 * デフォルトは日本(-540)
 *
 * @static
 * @public
 */
teasp.util.date.sfTimeZoneOffset = -540;

/**
 * 今日の Date オブジェクトを返す
 *
 * @static
 * @public
 * @param {number=} flag 0:Salesforce設定のタイムゾーンの時刻に変換。1:UTC に変換。それ以外:変換しない。
 * @return {Object} 日付オブジェクト
 */
teasp.util.date.getToday = function(flag){
    var d = new Date();
    if(!flag || flag == 1){
        d.setMinutes(d.getMinutes() + d.getTimezoneOffset() - (flag ? 0 : teasp.util.date.sfTimeZoneOffset));
    }
    return d;
};

teasp.util.date.getCurrentTime = function(dt){
    var d = (dt || new Date());
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
      + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds();
};

/**
 * UTC時刻を示す LONG値を Date オブジェクトに変換する.<br/>
 * サーバから渡されるLONG値は UTCでは、基本的に内部では UTC のまま保持して、出力する時だけ
 * タイムゾーン時刻に変換するため、たいていは引数の flag は 1 で呼ばれるはず。
 *
 * @static
 * @public
 * @param {number} l 日時のロング値（UTCであることが前提）
 * @param {number=} flag 0:Salesforce設定のタイムゾーンの時刻に変換。1:UTC に変換。それ以外:変換しない。
 * @return {Object} 日付オブジェクト
 */
teasp.util.date.longToDate = function(l, flag){
    var d = new Date();
    d.setTime(l);
    if(!flag || flag == 1){
        d.setMinutes(d.getMinutes() + d.getTimezoneOffset() - (flag ? 0 : teasp.util.date.sfTimeZoneOffset));
    }
    return d;
};

/**
 * 曜日を示す番号を漢字に変換
 *
 * @static
 * @public
 * @param {number} index 曜日インデックス(0-6)
 * @return {string} オブジェクト
 */
teasp.util.date.getWeekJp = function(index){
    if(!teasp.util.date.weekJp || teasp.util.date.weekJp.length <= 0){
        teasp.util.date.weekJp = [
              teasp.message.getLabel('tm00000100') // 日
            , teasp.message.getLabel('tm00000101') // 月
            , teasp.message.getLabel('tm00000102') // 火
            , teasp.message.getLabel('tm00000103') // 水
            , teasp.message.getLabel('tm00000104') // 木
            , teasp.message.getLabel('tm00000105') // 金
            , teasp.message.getLabel('tm00000106') // 土
        ];
    }
    return teasp.util.date.weekJp[index];
};

/**
 * 日付文字列を日付オブジェクトに変換
 *
 * @static
 * @public
 * @param {string} s 日付（'yyyy-MM-dd' or 'yyyy/MM/dd' or 'yyyyMMdd'）
 * @return {Object|string} 日付オブジェクト
 */
teasp.util.date.parseDate = function(s){
    var y, m, d, t, hh, mm, ss;
    var match;
    if((match = /\d{8}/.exec(s))){
        y = parseInt(s.substring(0, 4), 10);
        m = parseInt(s.substring(4, 6), 10);
        d = parseInt(s.substring(6), 10);
        return new Date(y, m - 1, d);
    }else if((match = /^(\d+)[\-](\d+)[\-](\d+)\s*(.*)$/.exec(s))){
        y = parseInt(match[1], 10);
        m = parseInt(match[2], 10);
        d = parseInt(match[3], 10);
        t = match[4];
        if(t && ((match = /^(\d+):(\d+):?(\d*)$/.exec(t)))){
            hh = parseInt(match[1], 10);
            mm = parseInt(match[2], 10);
            ss = parseInt(match[3], 10);
            var f = false;
            if(hh >= 24){
                hh -= 24;
                f = true;
            }
            var rd = new Date(y, m - 1, d, hh, mm, (ss || 0));
            if(f){
                rd = teasp.util.date.addDays(rd, 1, true);
            }
            return rd;
        }
        return new Date(y, m - 1, d);
    }else if(s){
        var hm = false;
        if((match = /(.+) (\d{2}):(\d{2})$/.exec(s))){
            s = match[1];
            hm = true;
            hh = parseInt(match[2], 10);
            mm = parseInt(match[3], 10);
        }
        var d = dojo.date.locale.parse(s, DATE_FORM_S);
        if(d){
            if(hm){
                d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh, mm, 0);
            }
            return d;
        }
        return null;
    }
    return null;
};

/**
 * 日付文字列＋分を日時オブジェクトに変換
 * 分が24時以降の場合、日付を変える。
 * （例：引数が s='2012-02-21', m=1505 の場合、戻り値は「2012/02/22 1:05:00」
 *
 * @static
 * @public
 * @param {string} s 日付（'yyyy-MM-dd' or 'yyyy/MM/dd' or 'yyyyMMdd'）
 * @param {number} m 時間（分）
 * @return {Object} 日時オブジェクト
 */
teasp.util.date.parseDate2 = function(s, m){
    var d = teasp.util.date.parseDate(s);
    var dx = Math.floor(m / 1440);
    if(dx > 0){
        d = teasp.util.date.addDays(d, dx);
        m -= (1440 * dx);
    }
    return new Date(d.getFullYear(), d.getMonth() - 1, d.getDate(), Math.floor(m / 60), (m % 60), 0);
};

/**
 * 日付を文字列に変換
 *
 * @static
 * @public
 * @param {Object|string|number} dt 日付
 * @param {string=} frm 以下の対応する書式に変換する
 *     <table style="border-collapse:collapse;border:1px solid gray;margin:4px;" border="1">
 *     <tr><th>frmの値    </th><th>書式                   </th></tr>
 *     <tr><td>'M/d'      </td><td>'M/d'                  </td></tr>
 *     <tr><td>'M/d+'     </td><td>'M/d (aaa)'            </td></tr>
 *     <tr><td>'yyyyMMdd' </td><td>'yyyyMMdd'             </td></tr>
 *     <tr><td>'SLA'      </td><td>'yyyy/MM/dd'           </td></tr>
 *     <tr><td>'JP1'      </td><td>'yyyy年M月d日（aaa）'  </td></tr>
 *     <tr><td>'JP2'      </td><td>'M月d日（aaa）'        </td></tr>
 *     <tr><td>'JPW'      </td><td>曜日 ('日'～'土')      </td></tr>
 *     <tr><td>上記以外   </td><td>'yyyy-MM-dd'           </td></tr>
 *     </table>
 * @param {boolean=} flag dtがDateTime型項目のLONG値の場合、0をセットする(SFのタイムゾーンに補正する。#8664)。それ以外では指定不要
 * @return {string} 変換後の日付
 */
teasp.util.date.formatDate = function(dt, frm, flag){
    if(!dt){
        return '';
    }
    try{
        var d = dt;
        if(typeof(dt) === 'string') {
            d = teasp.util.date.parseDate(dt);
        }else if(typeof(dt) === 'number') {
            d = teasp.util.date.longToDate(dt, (flag === undefined ? 1 : flag));
        }
        if(frm === 'M/d'){
            return (d.getMonth() + 1) + '/' + d.getDate();
        }else if(frm === '+M/d'){
            if(dojo.locale == 'ja'){
                if(d.getFullYear() == teasp.util.date.getToday().getFullYear()){
                    return (d.getMonth() + 1) + '/' + d.getDate();
                }else{
                    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
                }
            }else{
                if(d.getFullYear() == teasp.util.date.getToday().getFullYear()){
                    return dojo.date.locale.format(d, { selector:'date', datePattern:'MMM d' }); // Jun 1
                }else{
                    return dojo.date.locale.format(d, { selector:'date', datePattern:'MMM d, y' }); // Jun 1,2014
                }
            }
        }else if(frm === 'M/d+'){
            if(dojo.locale == 'ja'){
                return dojo.date.locale.format(d, { selector:'date', datePattern:'M/d (EEE)' });
            }else{
                return dojo.date.locale.format(d, { selector:'date', datePattern:'MMM d (EEE)' });
            }
        }else if(frm === 'yyyyMMdd'){
            return d.getFullYear() + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1) + (d.getDate() < 10 ? '0' : '') + d.getDate();
        }else if(frm === 'SLA'){ // 'yyyy/MM/dd'
            if(dojo.locale == 'ja'){
                return d.getFullYear() + '/' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1) + '/' + (d.getDate() < 10 ? '0' : '') + d.getDate();
            }else{
                return dojo.date.locale.format(d, DATE_FORM_S);
            }
        }else if(frm === 'JP1'){
            return dojo.date.locale.format(d, { selector:'date', formatLength:'full' });
        }else if(frm === 'JP2'){
            return dojo.date.locale.format(d, { selector:'date', datePattern: teasp.message.getLabel('tm10001550') }); // M月d日（EEE）
        }else if(frm === 'JPW'){
            var s = dojo.date.locale.format(d, { selector:'date', datePattern:'EEE' });
            return (s.length > 1 ? s.substring(0, 1) : s);
        }
        return d.getFullYear() + '-' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? '0' : '') + d.getDate();
    }catch(e){
    }
    return '???';
};

/**
 * 日時を文字列に変換
 *
 * @static
 * @public
 * @param {Object|string} dt 日付
 * @param {string=} frm 以下の対応する書式に変換する
 *     <table style="border-collapse:collapse;border:1px solid gray;margin:4px;" border="1">
 *     <tr><th>frmの値    </th><th>書式                   </th></tr>
 *     <tr><td>'SLA-HM'   </td><td>'yyyy/MM/dd HH:mm'     </td></tr>
 *     <tr><td>'SLA-HMS'  </td><td>'yyyy/MM/dd HH:mm:ss'  </td></tr>
 *     <tr><td>'HM'       </td><td>'HH:mm'                </td></tr>
 *     <tr><td>'N14'      </td><td>'yyyyMMddHHmmss'       </td></tr>
 *     <tr><td>上記以外   </td><td>'yyyy-MM-dd HH:mm:ss'  </td></tr>
 *     </table>
 * @param {boolean=} flag true の場合、タイムゾーンの補正はしない
 * @return {string} 変換後の日付
 */
teasp.util.date.formatDateTime = function(dt, frm, flag){
    var _dt = dt;
    if(typeof(_dt) === 'string'){
        _dt = teasp.util.date.parseDate(_dt);
    }else if(typeof(_dt) === 'number'){
        _dt = teasp.util.date.longToDate(_dt);
    }else if(!flag){
        _dt = new Date(_dt);
        _dt.setMinutes(_dt.getMinutes() - teasp.util.date.sfTimeZoneOffset);
    }
    var m  = _dt.getMonth() + 1;
    var d  = _dt.getDate();
    var h  = _dt.getHours();
    var mm = _dt.getMinutes();
    var ss = _dt.getSeconds();
    if(frm === 'SLA-HM' || frm === 'SLA-HMS'){
        return teasp.util.date.formatDate(_dt, 'SLA')
            + ' ' + (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm
            + (frm === 'SLA-HMS' ? ':' + ((ss < 10 ? '0' : '') + ss) : '');
    }else if(frm === 'SLA-HMK'){
        return teasp.util.date.formatDate(_dt, 'SLA')
            + '(' + (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm + ')';
    }else if(frm === 'HM'){
        return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm;
    }else if(frm === 'N14'){
        return (_dt.getFullYear() + (m < 10 ? '0' : '') + m + (d < 10 ? '0' : '') + d
            + (h < 10 ? '0' : '') + h + (mm < 10 ? '0' : '') + mm + (ss < 10 ? '0' : '') + ss);
    }
    return (_dt.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d
            + ' ' + (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss);
};

/**
 * UTCの日時をSFのタイムゾーンの日時に変換
 *
 * @static
 * @public
 * @param {Object} dt 日時
 * @return {Object} 変換後の日時
 */
teasp.util.date.getTzDateTime = function(dt){
    var _dt = dt;
    _dt = new Date(_dt);
    _dt.setMinutes(_dt.getMinutes() - teasp.util.date.sfTimeZoneOffset);
    return _dt;
};

/**
 * 日付＆時刻を SF の DateTime 型項目の検索条件に指定できる書式に変換する.<br/>
 * ユーザのタイムゾーンを反映させる。<br/>
 * （例） "2014-10-01T00:00:00.000+9:00"
 * @static
 * @public
 * @param {Object|string|number} d 日付
 * @param {number=} mt 時刻（ミリ秒）
 * @return {string}
 */
teasp.util.date.formatDateTimeTz = function(d, mt){
    var t = (mt || 0);
    var h = Math.floor(t / (60 * 60 * 1000));
    var m = Math.floor(t / (60 * 1000));
    var s = Math.floor(t / 1000);
    var ss = t % 1000;
    var z = teasp.util.date.sfTimeZoneOffset;
    var p = teasp.util.date.formatDate(d)
        + 'T' + (h < 10 ? '0' : '') + h
        + ':' + (m < 10 ? '0' : '') + m
        + ':' + (s < 10 ? '0' : '') + s
        + '.' + (ss < 100 ? (ss < 10 ? '00' : '0') : '') + ss
        + (!z ? 'Z' : (z < 0 ? '+' : '-'));
    if(z){
        z = Math.abs(z);
        var zh = Math.floor(z / 60);
        var zm = z % 60;
        p += ((zh < 10 ? '0' : '') + zh + ':' + (zm < 10 ? '0' : '') + zm);
    }
    return p;
};

/**
 * 時間を文字列に変換
 *
 * @static
 * @public
 * @param {Object} dt 時間の値を持つDateオブジェクト
 * @return {string} 変換後の時間
 */
teasp.util.date.formatTime = function(dt){
    var h = dt.getHours();
    var m = dt.getMinutes();
    var s = dt.getSeconds();
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s + '.' + dt.getMilliseconds();

};

/**
 * 期間表示文字列を返す
 *
 * @static
 * @public
 * @param {Object|string} d1 日付１
 * @param {Object|string} d2 日付２
 * @param {string=} frm 書式（see formatDate）
 * @return {string} 変換後の期間
 */
teasp.util.date.formatDateRange = function(d1, d2, frm){
    var _d1 = (typeof(d1) === 'string' ? teasp.util.date.parseDate(d1) : new Date(d1));
    var _d2 = (typeof(d2) === 'string' ? teasp.util.date.parseDate(d2) : new Date(d2));
    if(!_d2 || teasp.util.date.compareDate(_d1, _d2) === 0){
        return teasp.util.date.formatDate(_d1, frm);
    }else{
        return teasp.message.getLabel('tm10003590', teasp.util.date.formatDate(_d1, frm), teasp.util.date.formatDate(_d2, frm));
    }
};

/**
 * 日付の比較
 *
 * @static
 * @public
 * @param {Object|string} d1 日付
 * @param {Object|string} d2 日付
 * @return {number} d1<d2ならマイナス、d1>d2ならプラス、d1==d2なら0
 */
teasp.util.date.compareDate = function(d1, d2){
    var _d1 = (typeof(d1) === 'string' ? teasp.util.date.parseDate(d1) : new Date(d1));
    var _d2 = (typeof(d2) === 'string' ? teasp.util.date.parseDate(d2) : new Date(d2));
    var t1 = (_d1.getFullYear() * 10000) + ((_d1.getMonth() + 1) * 100) + _d1.getDate();
    var t2 = (_d2.getFullYear() * 10000) + ((_d2.getMonth() + 1) * 100) + _d2.getDate();
    return (t1 - t2);
};

/**
 * 指定日の N 日後（前）の日付を求める
 *
 * @static
 * @public
 * @param {Object|string} dt 日付
 * @param {number} amount 加算日数
 * @param {boolean=} nosup =true:夏時間対策をしない
 * @return {Object|string} 日付。引数の dt の型に合わせた型で返す
 */
teasp.util.date.addDays = function(dt, amount, nosup){
    var _dt = dt;
    var flg = (typeof(dt) === 'string');
    if(typeof(dt) === 'string'){
        _dt = teasp.util.date.parseDate(dt);
    }
    if(!nosup){
        _dt.setHours(10); // 夏時間調整の対策として、0:00→10:00 を基準にする
    }
    var d = new Date();
    d.setTime(_dt.getTime() + (86400000 * amount));
    return (flg ? teasp.util.date.formatDate(d) : d);
};

/**
 * 指定日の N か月後（前）の日付を求める
 *
 * @static
 * @public
 * @param {Object|string} dt 日付
 * @param {number} amount 加算月数
 * @return {Object|string} 日付。引数の dt の型に合わせた型で返す
 */
teasp.util.date.addMonths = function(dt, amount){
    var _dt = dt;
    var flg = (typeof(dt) === 'string');
    if(typeof(dt) === 'string'){
        _dt = teasp.util.date.parseDate(dt);
    }
    var d = teasp.util.date.computeMonth(_dt.getFullYear(), _dt.getMonth() + 1, _dt.getDate(), amount);
    return (flg ? teasp.util.date.formatDate(d) : d);
};

/**
 * 年月を指定して月末日を求める関数
 *
 * @static
 * @public
 * @param {number} year 年
 * @param {number} month 月
 * @return {number} 月末日
 */
teasp.util.date.getMonthEndDay = function(year, month) {
    //日付を0にすると前月の末日を指定したことになります
    //指定月の翌月の0日を取得して末日を求めます
    //そのため、ここでは month - 1 は行いません
    var dt = new Date(year, month, 0);
    return dt.getDate();
};

/**
 * 年月日と加算月からnヶ月後、nヶ月前の日付を求める
 *
 * @static
 * @public
 * @param {number} year 年
 * @param {number} month 月
 * @param {number} day 日
 * @param {number} addMonths 加算月数。マイナス指定でnヶ月前も設定可能
 * @return {Object} 日付
 */
teasp.util.date.computeMonth = function(year, month, day, addMonths) {
    var _month = month + addMonths;
    var endDay = teasp.util.date.getMonthEndDay(year, _month);
    var _day = (day > endDay ? endDay : day);
    return new Date(year, _month - 1, _day);
};

/**
 * 開始日付～終了日付の日数を得る。
 *
 * @static
 * @public
 * @param {string|Object} d1 開始日付
 * @param {string|Object} d2 終了日付
 * @return {number} 日数（開始・終了日含む）
 */
teasp.util.date.daysInRange = function(d1, d2){
    var _d1 = (typeof(d1) === 'string' ? teasp.util.date.parseDate(d1) : new Date(d1));
    var _d2 = (typeof(d2) === 'string' ? teasp.util.date.parseDate(d2) : new Date(d2));
    var diff = _d2 - _d1;
    return Math.round(diff / 86400000 + (diff < 0 ? (-1) : 1));
};

/**
 * 日付リスト作成
 *
 * @static
 * @public
 * @param {Object|string} sd 開始日 (Stringの場合、'yyyy-MM-dd')
 * @param {Object|string} ed 終了日 (Stringの場合、'yyyy-MM-dd')
 * @return {Array.<string>} 開始～終了の'yyyy-MM-dd'配列
 */
teasp.util.date.getDateList = function(sd, ed){
    var _sd = (typeof(sd) === 'string' ? teasp.util.date.parseDate(sd) : new Date(sd));
    var _ed = (typeof(ed) === 'string' ? teasp.util.date.parseDate(ed) : new Date(ed));
    var lst = [];
    var d = _sd;
    while(teasp.util.date.compareDate(d, _ed) <= 0){
        lst.push(teasp.util.date.formatDate(d));
        d = teasp.util.date.addDays(d, 1);
    }
    return lst;
};

/**
 * 日付を比較して大きい方を返す
 * @static
 * @param {Object|string|null} d1
 * @param {Object|string|null} d2
 * @return {Object|string|null} 大きい方
 * 同じ値ならd1を返す。どちらかがnullならnullではない方を返す。
 */
teasp.util.date.maxDate = function(d1, d2){
	if(!d1 && d2){
		return d2;
	}else if(d1 && d2 && teasp.util.date.compareDate(d1, d2) < 0){
		return d2;
	}
	return d1;
};

/**
 * 日付を比較して小さい方を返す
 * @static
 * @param {Object|string|null} d1
 * @param {Object|string|null} d2
 * @return {Object|string|null} 小さい方
 * 同じ値ならd1を返す。どちらかがnullならnullではない方を返す。
 */
teasp.util.date.minDate = function(d1, d2){
	if(!d1 && d2){
		return d2;
	}else if(d1 && d2 && teasp.util.date.compareDate(d2, d1) < 0){
		return d2;
	}
	return d1;
};

/**
 * 指定年月の N ヶ月後（前）を求める
 *
 * @static
 * @public
 * @param {number} ym 年月（yyyyMM）
 * @param {number} amount 加算月数
 * @return {number} 加算後の年月（yyyyMM）
 */
teasp.util.date.addYearMonth = function(ym, amount){
    var y = Math.floor(ym / 100);
    var m = ym % 100;
    m += amount;
    if(m > 12){
        y += Math.floor(m / 12);
        m = (m % 12);
    }else if(m < 1){
        var t = m * (-1);
        y -= (Math.floor(t / 12) + 1);
        m = 12 - (t % 12);
    }
    if(m == 0){
        y--;
        m = 12;
    }
    return (y * 100 + m);
};

/**
 * 0-6数値の配列を曜日のカンマ区切りテキストにして返す
 *
 * @static
 * @public
 * @param {Array.<number>} nums 0-6数値の配列
 * @return {string}
 */
teasp.util.date.getWeekJpByNumArray = function(nums){
    var ss = [];
    for(var i = 0 ; i < nums.length ; i++){
        ss.push(teasp.util.date.getWeekJp(nums[i]));
    }
    return ss.join(',');
};

/**
 * 数値の配列から別の数値の配列に含まれている数値を削除する
 *
 * @static
 * @public
 * @param {Array.<number>} nums1
 * @param {Array.<number>} nums2
 * @return {Array.<number>}
 */
teasp.util.date.excludeNums = function(nums1, nums2){
    if(!nums2 || nums2.length <= 0){
        return nums1;
    }
    for(var i = nums1.length - 1 ; i >= 0 ; i--){
        var n = nums1[i];
        if(nums2.contains(n)){
            nums1.splice(i, 1);
        }
    }
    return nums1;
};

teasp.util.date.getWeekByDate = function(d, begw){
    if(typeof(d) == 'string'){
        d = teasp.util.date.parseDate(d);
    }
    if(begw < 0 || begw > 6){
        return [];
    }
    var pd = teasp.util.date.addDays(d, -6);
    var w = [];
    while(w.length < 7){
        if(pd.getDay() == begw || w.length > 0){
            w.push(teasp.util.date.formatDate(pd));
        }
        pd = teasp.util.date.addDays(pd, 1);
    }
    return w;
};

/**
 * 日付リストを起算(曜)日で分割する
 *
 * @static
 * @public
 * @param {Array.<string>} dateList
 * @param {number} sdFlag  100 以上の場合 100 を引いた数（0～6）で曜日を起算日を示す。それ以外は日付（月毎）
 * @return {Array.<Object>}
 */
teasp.util.date.divideDateList = function(dateList, sdFlag){
    if(!dateList || !dateList.length){
        return [];
    }
    var weekOfDay = null, startDx = null;
    if(sdFlag >= 100){
        weekOfDay = sdFlag - 100;
    }else{
        startDx = sdFlag;
    }
    dateList = dateList.sort(function(a, b){
        return (a < b ? -1 : (a == b ? 0 : 1));
    });
    var sd    = teasp.util.date.parseDate(dateList[0]);
    var lastd = teasp.util.date.parseDate(dateList[dateList.length - 1]);
    var l = [];
    var getEndDate = null;
    if(weekOfDay !== null){
        var x = sd.getDay();
        sd = teasp.util.date.addDays(sd, weekOfDay - x - (x < weekOfDay ? 7 : 0), true);
        getEndDate = function(xd){ return teasp.util.date.addDays(xd, 7, true); };
    }else{
        var x = sd.getDate();
        if(startDx < x){
            sd = teasp.util.date.addDays(sd, startDx - x, true);
        }else if(x < startDx){
            sd = teasp.util.date.addMonths(teasp.util.date.addDays(sd, startDx - x, true), -1);
        }
        getEndDate = function(xd){ return teasp.util.date.addMonths(xd, 1); };
    }
    while(sd <= lastd){
        var ed = getEndDate(sd);
        var o = {
            mind: teasp.util.date.formatDate(sd),
            maxd: teasp.util.date.formatDate(ed),
            lst: []
        };
        for(var i = 0 ; i < dateList.length ; i++){
            var d = dateList[i];
            if(o.mind <= d && d < o.maxd){
                o.lst.push(dateList[i]);
            }
        }
        if(o.lst.length > 0){
            o.sd = o.lst[0];
            o.ed = o.lst[o.lst.length - 1];
            l.push(o);
        }
        sd = ed;
    }
    return l;
};

teasp.util.date.formatMonth = function(msgId, y, m, sn){
    if(typeof(y) == 'string'){
        y = parseInt(y, 10);
    }
    if(typeof(m) == 'string'){
        m = parseInt(m, 10);
    }
    var d = new Date(y, m - 1, 1);
    return dojo.date.locale.format(d, { datePattern: teasp.message.getLabel(msgId || 'zv00000021'), selector: 'date' }) + teasp.util.date.dispSubNo(sn);
};

teasp.util.date.dispSubNo = function(sn){
    if(sn){
        return '(' + (sn + 1) + ')';
    }
    return '';
};

teasp.util.date.dateRangeOfYear = function(initialDateOfYear, markOfYear, initialDateOfMonth, markOfMonth, year){
    var m   = (typeof(initialDateOfYear)  == 'string' ? parseInt(initialDateOfYear , 10) : initialDateOfYear );
    var d   = (typeof(initialDateOfMonth) == 'string' ? parseInt(initialDateOfMonth, 10) : initialDateOfMonth);
    var moy = (typeof(markOfYear)  == 'string' ? parseInt(markOfYear , 10) : markOfYear );
    var mom = (typeof(markOfMonth) == 'string' ? parseInt(markOfMonth, 10) : markOfMonth);
    var y   = (typeof(year)        == 'string' ? parseInt(year       , 10) : year       );
    if(mom == 2){
        m = (m > 1) ? m - 1 : 12;
    }
    if(moy == 2){
        y = (y > 1) ? y - 1 : 12;
    }
    var sd = new Date(y, m - 1, d); // 年度の開始日
    var ed = teasp.util.date.addDays(teasp.util.date.addMonths(sd, 12), -1, true);
    return {
        sd : teasp.util.date.formatDate(sd),
        ed : teasp.util.date.formatDate(ed)
    };
};

teasp.util.date.convDateTimeZone = function(d){
	var u = teasp.util.date.sfTimeZoneOffset * (-1);
	var h = Math.floor(u / 60);
	var m = u % 60;
	var hm = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
	return moment(d).format('YYYY-MM-DD') + 'T00:00:00' + (u ==  0 ? 'Z' : (u > 0 ? '+' : '-') + hm);
};

/**
 * 日付の配列を連結する
 * 連続する日付はまとめ、はじめの日付と終わりの日付を'-'でつなぐ
 * @param {Array.<string>} 'yyyy-MM-dd'の配列
 * @param {string=} div 区切り文字、省略時は', '
 * @returns {string}
 */
teasp.util.date.joinEx = function(lst, div){
	if(!lst || !lst.length){
		return '';
	}
	lst = lst.sort(function(a, b){
		return (a < b ? -1 : 1);
	});
	var ds = [];
	var pd = null;
	var F = 'YYYY-MM-DD';
	for(var i = 0 ; i < lst.length ; i++){
		var d = lst[i];
		if(pd && moment(pd, F).add(1, 'd').format(F) == d){
			var s = ds[ds.length - 1];
			var n = s.indexOf(':');
			ds[ds.length - 1] = (n < 0 ? s : s.substring(0, n)) + ':' + d;
		}else{
			ds.push(d);
		}
		pd = d;
	}
	for(var i = 0 ; i < ds.length ; i++){
		var d = ds[i];
		var n = d.indexOf(':');
		if(n < 0){
			ds[i] = moment(d, F).format('M/D');
		}else{
			var d1 = moment(d.substring(0, n), F);
			var d2 = moment(d.substring(n + 1), F);
			if(d1.month() == d2.month()){
				ds[i] = d1.format('M/D') + '-' + d2.format('D');
			}else{
				ds[i] = d1.format('M/D') + '-' + d2.format('M/D');
			}
		}
	}
	return ds.join(div || ', ');
};
