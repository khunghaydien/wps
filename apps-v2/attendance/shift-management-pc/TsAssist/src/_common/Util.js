export class Util {
    static isNum(v){
        return (typeof(v) == 'number');
    }
    static text(v){
        if(typeof(v) == 'number' || typeof(v) == 'boolean'){
            return '' + v;
        }
        return (v || '');
    }
    static equal(v1, v2){
        const s1 = (typeof(v1) == 'number' ? v1 : (v1 || null));
        const s2 = (typeof(v2) == 'number' ? v2 : (v2 || null));
        return (s1 == s2);
    }
    static isEmpty(v){
        if(typeof(v) == 'number' || typeof(v) == 'boolean'){
            return false;
        }
        return (v ? false : true);
    }
    static parseValue(record, keyChain){
        let val = record;
        const keys = keyChain.split(/\./);
        let i = 0;
        while(i < keys.length){
            const key = keys[i++];
            val = val[key];
            if(typeof(val) != 'object'){
                break;
            }
        }
        const v = (i < keys.length ? null : val);
        if(typeof(v) == 'number' || typeof(v) == 'boolean'){
            return v;
        }else if(v && typeof(v) == 'object'){
            try {
                return JSON.stringify(v);
            }catch(e){
                return v;
            }
        }else{
            return v || '';
        }
    }
    static excludeNameSpace(obj){
        if(!tsCONST.prefixBar){
            return;
        }
        if(Array.isArray(obj)){
            for(var i = 0 ; i < obj.length ; i++){
                this.excludeNameSpace(obj[i]);
            }
        }else{
            for(var key in obj){
                if(key.substring(0, tsCONST.prefixBar.length) == tsCONST.prefixBar){
                    var name = key.substring(tsCONST.prefixBar.length);
                    obj[name] = obj[key];
                    delete obj[key];
                    if(typeof(obj[name]) == 'object'){
                        this.excludeNameSpace(obj[name]);
                    }
                }else if(typeof(obj[key]) == 'object'){
                    this.excludeNameSpace(obj[key]);
                }
            }
        }
    }
    static formatDateTime(v){
        if(v === undefined || v === null){
            return null;
        }
        if(typeof(v) == 'number' || typeof(v) == 'object'){
            return moment(v).format('YYYY-MM-DD HH:mm:ss');
        }else if(typeof(v) == 'string'){
            return v;
        }
        return null;
    }
    static formatDate(v, fmt){
        if(v === undefined || v === null || v == ''){
            return null;
        }
        fmt = fmt || 'YYYY-MM-DD';
        if(typeof(v) == 'number' || typeof(v) == 'object'){
            return moment(v).format(fmt);
        }else if(typeof(v) == 'string'){
            if(/^(\d{8})$/.test(v)){
                const md = moment(v, 'YYYYMMDD');
                return (md.isValid() ? md.format(fmt) : null);
            }else{
                const md = moment(v, 'YYYY-MM-DD');
                return (md.isValid() ? md.format(fmt) : null);
            }
        }
        return null;
    }
    static addDays(d, n){
        const md = moment(d, 'YYYY-MM-DD');
        return (md.isValid() ? md.add(n, 'days').format('YYYY-MM-DD') : null);
    }
    static formatTime(v){
        if(v === undefined || v === null){
            return '0:00';
        }
        if(typeof(v) == 'number'){
            const h = Math.floor(v / 60);
            const m = v % 60;
            return h + ':' + (m < 10 ? '0' : '') + m;
        }else if(typeof(v) == 'string'){
            return v;
        }
        return '0:00';
    }
    static parseHmm(s){
        var hm = s.split(/:/);
        if(hm.length > 1){
            var h = parseInt(hm[0], 10);
            var m = parseInt(hm[1], 10);
            return h * 60 + m;
        }
        return null;
    }
    static zen2han(v){
        var N = '０１２３４５６７８９．：';
        var s = '';
        for(var i = 0 ; i < v.length ; i++){
            var c = v.substring(i, i+1);
            var x = N.indexOf(c);
            if(x >= 0 && x < 10){
                s += x;
            }else if(x == 10){
                s += '.';
            }else if(x == 11){
                s += ':';
            }else{
                s += c;
            }
        }
        return s;
    }
    static formatDays(s, flag){
        s = this.zen2han(s);
        if(!s){
            return '';
        }
        const n = parseFloat('0' + s);
        if(flag){
            return '' + (Math.floor(n * 2) / 2); // 0.5刻みに変換
        }else{
            return '' + n;
        }
    }
    static formatHour(s){
        s = this.zen2han(s);
        var match = /(\d+)(.)?(\d+)?$/.exec(s);
        if(match){
            var h = match[1] || null;
            var c = match[2];
            var m = match[3] || 0;
            if(c == '.' && m){
                if(m.length < 2){ m += '0'; }
                m = Math.round(60 * parseInt(m, 10) / 100);
                if(!h){
                    h = '0';
                }
            }else if(m){
                m = parseInt(m, 10);
            }
            if(h !== null){
                var sh = h.replace(/^0+/, '') || '0';
                if(sh.length <= 2){
                    h = parseInt(sh, 10);
                }else{
                    if(c){
                        return '';
                    }
                    if(sh.length > 4){
                        sh = sh.substring(0, 4);
                    }
                    h = parseInt(sh.substring(0, sh.length - 2), 10);
                    m = parseInt(sh.substring(sh.length - 2), 10);
                }
                if(h > 99){
                    return '';
                }
                if(m >= 60){
                    m = 0;
                }
                return '' + h + ':' + (m < 10 ? '0' : '') + m;
            }
        }
        return '';
    }
    static convertStr(strVal){
        if(!strVal){
            return '';
        }
        // 半角変換
        var halfVal = strVal.replace(/[！-～]/g, // U+FF01～U+FF5E → U+0021～U+007E
            function( tmpStr ) {
                return String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0);
            }
        );
        // 文字コードシフトで対応できない文字の変換
        // （全角のダブルクォート、シングルクォート、バッククォート、円マーク、スペース、波ダッシュ）
        halfVal = halfVal.replace(/”/g, "\"") // U+201D → U+0022
        .replace(/’/g, "'")  // U+2019 → U+0027
        .replace(/‘/g, "`")  // U+2018 → U+0060
        .replace(/￥/g, "\\") // U+FFE5 → U+005C
        .replace(/¥/g,	"\\") // U+00A5 → U+005C
        .replace(/〜/g, "~")  // U+301C → U+007E
        .replace(/\s+/g, " ")  // スペース → U+0020
        .toUpperCase(); // 小文字→大文字へ変換
        var v = halfVal.replace(/^\s+|\s+$/g,""); // 前後の空白を除去
        return (v ? v : halfVal); // 空白のみの入力ならそのまま返す
    }
    /**
     * 配列をCSV形式の文字列に変換
     * Papa parse を利用
     * @see https://www.papaparse.com/docs#strings
     * @param {Array.<string|number|boolean|null>} items 
     * @returns {string}
     */
    static arrayToCsvString(items){
        return Papa.unparse([items], {
            quotes: false,
            quoteChar: '"',
            escapeChar: '"',
            delimiter: ",",
            header: true,
            newline: "\n",
            skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
            columns: null //or array of strings
        });
    }
    static shapeStr(str){
        return str.replace(/\n/g, '').replace(/ +/g, ' ');
    }
    static formatDaysAndHours(days, minutes){
		const hours = (minutes ? this.formatTime(minutes) : '');
		if(!days){
			return (hours ? hours : '0日');
		}
		return `${days}日${(hours ? '+' + hours : '')}`;
    }
    /**
     * 日付の設定
     * @param {string} d 日付（YYYY-MM-DD）
     * @param {string} level 'S','M','L'のいずれか
     * @returns true=範囲内、false=範囲外
     */
    static checkDateRange(d, level){
        if(!d){
            return true;
        }
        switch(level){
        case 'S': // 付与や消化の有効期間など想定
            return ('2010-01-01' <= d && d < '2040-01-01');
        case 'M': // 表示期間など想定
            return ('2000-01-01' <= d && d < '2050-01-01');
        case 'L': // 入社日・退社日など想定
            return ('1920-01-01' <= d && d < '2100-01-01');
        }
        return true;
    }
}