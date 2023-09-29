teasp.provide('teasp.util');

/**
 * ユーティリティクラス
 *
 * @constructor
 * @author DCI小島
 */
teasp.util = function(){};

teasp.util.FIVE_RATE_LAST_DATE = '2014-03-31';
teasp.util.EIGHT_RATE = 8;

/**
 * 値が 0, null, undefined のどれかの場合、デフォルト値に置き換える
 *
 * @param {*} value 値
 * @param {*} defau デフォルト値
 * @return {*} valueそのままか、defau または ''
 */
teasp.util.filtValue = function(value, defau){
    if(!value){
        return (defau || '');
    }
    return value;
};

/**
 * 字数がテキストボックスの制限数を超えていたら警告を表示して超過分を削る。
 *
 * @param {Object} node テキストボックスのノード
 * @param {number} maxlength 制限数
 * @param {string} msg メッセージ
 */
teasp.util.limitChars = function(node, maxlength, msg) {
    if(node.value.length > maxlength){
        if(msg){
            alert(msg);
        }
        node.value = node.value.substr(0,maxlength);
    }
    node.focus();
};

/**
 * 文字列をDateオブジェクトに変換する
 *
 * @param {string} _str 文字列（/^(\d{4})[\D](\d{1,2})[\D](\d{1,2})$/ にマッチすること）
 * @return {Object} 変換情報<br/>
 *     以下の要素を格納したオブジェクトを返す
 *     <table style="border-collapse:collapse;border:1px solid gray;margin:4px;" border="1">
 *     <tr><td>date   </td><td>{Object} </td><td>日付オブジェクト   </td></tr>
 *     <tr><td>datef  </td><td>{string} </td><td>日付('yyyy-MM-dd') </td></tr>
 *     <tr><td>dater  </td><td>{string} </td><td>日付('yyyy/MM/dd') </td></tr>
 *     <tr><td>failed </td><td>{number} </td><td>
 *         <table>
 *         <tr><td>0</td><td>成功     </td></tr>
 *         <tr><td>1</td><td>引数が空 </td></tr>
 *         <tr><td>2</td><td>書式無効 </td></tr>
 *         <tr><td>3</td><td>日付無効 </td></tr>
 *         </table>
 *     </td></tr>
 *     <tr><td>tmpl   </td><td>{string} </td><td>メッセージ（テンプレート）
 *     <br/>（呼び出し側で dojo.replace を使ってメッセージ作成）
 *     </td></tr>
 *     </table>
 */
teasp.util.strToDate = function(_str){
    var str = (_str || '').trim(), match;
    if(str == ''){
        return {
            date   : null,
            dater  : null,
            datef  : null,
            failed : 1,
            tmpl   : teasp.message.getLabel('tm00000050') // {0}を入力してください
        };
    }
    if((match = /^(\d{4})[\D](\d{1,2})[\D](\d{1,2})$/.exec(str))){
        var y = parseInt(match[1], 10);
        var m = parseInt(match[2], 10);
        var d = parseInt(match[3], 10);
        var dt = teasp.util.date.parseDate(y + '-' + m + '-' + d);
        if(dt && y >= 1900 && y < 3000){
            return {
                date   : dt,
                dater  : teasp.util.date.formatDate(dt, 'SLA'),
                datef  : teasp.util.date.formatDate(dt),
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
        var dt = teasp.util.date.parseDate(str);
        if(dt){
            return {
                date   : dt,
                dater  : teasp.util.date.formatDate(dt, 'SLA'),
                datef  : teasp.util.date.formatDate(dt),
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
};

/**
 * 年月度と年月度の開始日・終了日を求める
 *
 * @param {number|string} sd 月度の起算日（1-28）
 * @param {number|string} mom 月度の表記（1|2）
 * @param {number|null} yearMonth 年月度（yyyyMM）。省略(null)時は dt から判断
 * @param {Object|string} dt 日付。yearMonth の値がセットされている場合は無視される。
 * @return {Object} yearMonth, startDate, endDate の要素を持つオブジェクト
 */
teasp.util.searchYearMonthDate = function(sd, mom, yearMonth, dt){
    if(typeof(sd)  === 'string'){ sd  = parseInt(sd , 10); }
    if(typeof(mom) === 'string'){ mom = parseInt(mom, 10); }
    if(typeof(dt)  === 'string'){ dt = teasp.util.date.parseDate(dt); }
    var y, m;
    if(yearMonth){
        y = Math.floor(yearMonth / 100);
        m = yearMonth % 100;
        if(mom == 2 && sd > 1){
            m--;
            if(m == 0){
                m = 12;
                y--;
            }
        }
        var d1 = new Date(y, m - 1, sd);
        var d2 = teasp.util.date.addDays(teasp.util.date.addMonths(d1, 1), -1);
        return {
            yearMonth : yearMonth,
            startDate : teasp.util.date.formatDate(d1),
            endDate   : teasp.util.date.formatDate(d2)
        };
    }else{
        y = dt.getFullYear();
        m = dt.getMonth() + 1;
        if(mom != 2 && dt.getDate() < sd){
            m--;
            if(m == 0){
                m = 12;
                y--;
            }
        }else if(mom == 2 && sd > 1 && sd <= dt.getDate()){
            m++;
            if(m > 12){
                m = 1;
                y++;
            }
        }
        var ym = (y * 100 + m);
        y = dt.getFullYear();
        m = dt.getMonth() + 1;
        if(dt.getDate() < sd){
            m--;
            if(m == 0){
                m = 12;
                y--;
            }
        }
        var d1 = new Date(y, m - 1, sd);
        var d2 = teasp.util.date.addDays(teasp.util.date.addMonths(d1, 1), -1);
        return {
            yearMonth : ym,
            startDate : teasp.util.date.formatDate(d1),
            endDate   : teasp.util.date.formatDate(d2)
        };
    }
};

/**
 * 時間帯文字列をオブジェクト化
 *
 * @param {string} _o 文字列<br/>
 *     以下のどちらかの書式をサポート
 *     <table style="border-collapse:collapse;border:1px solid gray;margin:4px;" border="1">
 *     <tr><td>サンプル１</td><td>0780-0840,0900-0960    </td></tr>
 *     <tr><td>サンプル２</td><td>0600066021:0780----30: </td></tr>
 *     </table>
 * @return {Array.<Object>}
 */
teasp.util.extractTimes = function(_o){
    var o = (_o || []);
    if(typeof(o) == 'string'){
        var ts = (o.indexOf(':') > 0 ? o.split(':') : o.split(','));
        var lst = [], match;
        var mp = {};
        for(var i = 0 ; i < ts.length ; i++){
            if((match = /(\d{4}|\-\-\-\-)(\d{4}|\-\-\-\-)(\d{2})/.exec(ts[i]))){
                var t = {
                    from : match[1],
                    to   : match[2],
                    type : parseInt(match[3], 10)
                };
                t.from = (t.from != '----' ? parseInt(t.from, 10) : null);
                t.to   = (t.to   != '----' ? parseInt(t.to  , 10) : null);
                if(t.from > t.to){
                    t.to = null;
                }
                if(t.from == t.to){
                    t.from = null;
                }
                // 開始・終了時刻が同一の休憩時間が複数存在する可能性があるので、取り除く（#3949）
                var s = (t.type == 21 || t.type == 22) ? ('' + (t.from || '') + ':' + (t.to || '')) : null;
                if(!s || !mp[s]){
                    lst.push(t);
                }
                if(s){
                    mp[s] = 1;
                }
            }else if((match = /(\d+)-(\d+)/.exec(ts[i]))){
                lst.push({
                    from : parseInt(match[1], 10),
                    to   : parseInt(match[2], 10),
                    type : teasp.constant.REST_FIX // (\d+)-(\d+) の形式の場合、type は固定で21（所定休憩）
                });
            }
        }
        return lst;
    }
    return o;
};

/**
 * 指定日の週の起算曜日の日付を得る
 *
 * @param {string|number} initialDayOfWeek 週の起算曜日
 * @param {string|Object} dt 日付
 * @return {Object|string} 日付
 */
teasp.util.getStartDayOfWeek = function(initialDayOfWeek, dt){
    var sw = (typeof(initialDayOfWeek) == 'string' ? parseInt(initialDayOfWeek, 10) : initialDayOfWeek); // 週の起算曜日
    var d  = (typeof(dt) == 'string' ? teasp.util.date.parseDate(dt) : dt);
    var dw = d.getDay();
    var n  = (sw == dw ? -1 : (sw - dw - (dw < sw ? 7 : 0))); // 対象月度の開始日と週の起算曜日の差分
    return teasp.util.date.addDays(d, n);
};

/**
 * 指定月度の期間の起算月度を得る
 *
 * @param {string|number} initialDateOfYear 年度の起算月
 * @param {string|number} markOfYear 月度の起算日
 * @param {number} range 変形期間
 * @param {number} ym 月度
 * @return {number} 起算月度
 */
teasp.util.getStartMonthOfPeriod = function(initialDateOfYear, markOfYear, range, ym){
    var sm  = (typeof(initialDateOfYear)  == 'string' ? parseInt(initialDateOfYear, 10) : initialDateOfYear);
    var y = Math.floor(ym / 100);
    var m = (ym % 100);
    if(m < sm){
        y--;
    }
    var eym = ((y + 1) * 100 + sm);
    var ym1 = y * 100 + sm;
    var ym2 = ym1;
    m = sm;
    while(ym1 < eym){
        m += range;
        if(m > 12){
            y++;
            m = (m % 12);
        }
        ym2 = y * 100 + m;
        if(ym1 <= ym && ym < ym2){
            break;
        }
        ym1 = ym2;
    }
    return ym1;
};


/**
 * オブジェクトの配列から指定のキーと値が一致するオブジェクトを得る
 *
 * @param {Object} lst オブジェクトの配列
 * @param {string} key キー
 * @param {string|number} val 値
 * @return {Object} オブジェクト
 */
teasp.util.getObjectByValue = function(lst, key, val){
    for(var i = 0 ; i < lst.length ; i++){
        var o = lst[i];
        if(o[key] == val){
            return o;
        }
    }
    return null;
};

/**
 * ダイアログの座標を調整
 *
 * @param {Object} dialog ダイアログノード
 * @param {number} dw ダイアログ幅
 * @param {number} dh ダイアログ高さ
 */
teasp.util.setDialogPosition = function(dialog, dw, dh){
    var c = document.body.getBoundingClientRect();
    var iw = window.getWindowWidth();
    var ih = window.getWindowHeight();
    if(iw > 1100){ iw = 1100; }
    if(ih > 1250){ ih = 1250; }
    if(window.devicePixelRatio){
        iw /= window.devicePixelRatio;
        ih /= window.devicePixelRatio;
    }
    var scrX = (c.left * (-1));
    var scrY = (c.top  * (-1));
    // iPad は c.top が常に 0 ?
    if(!scrY && window.getScrollY() > 0){
        scrY = window.getScrollY();
    }
    var _x = scrX + (((iw - dw) || 1) / 2);
    var _y = scrY + (((ih - dh) || 1) / 2);
    var x = (_x < 0 ? 0 : _x);
    var y = (_y < 0 ? 0 : _y);
    dialog._position = dojo.hitch(dialog, function(){
        var style = this.domNode.style;
        style.left = x + "px";
        style.top  = y + "px";
    });
};

/**
 * IDが一致するか.<br/>
 * 同一のIDを示す場合でも15桁の場合と18桁の場合があるので、最初の15桁だけ比較する。
 *
 * @param {string} a ID
 * @param {string} b ID
 * @return {boolean} true:一致する
 */
teasp.util.equalId = function(a, b){
    if(a && b && typeof(a) == 'string' && typeof(b) == 'string' && a.length >= 15 && b.length >= 15){
        return a.substring(0, 15) == b.substring(0, 15);
    }
    return (a == b);
};

/**
 * 定期区間を表示用の文字列にする
 *
 * @param {Object} searchKey 定期区間
 * @return {Object} 表示用の定期区間
 */
teasp.util.createCommuterSimpleRoute = function(searchKey){
    var o = { value:'', name:'' };
    if(!searchKey){
        o.name = teasp.message.getLabel('tm00000080'); // 未登録
        return o;
    }
    var ms = teasp.message.getLabel('tm10001520', searchKey.stationFrom.name, searchKey.stationTo.name); // {0} ⇔ {1}
    var ss = '';
    var vias = (searchKey.stationVia || []);
    for(var i = 0 ; i < vias.length ; i++){
        if(ss != ''){
            ss += teasp.message.getLabel('tm10001540'); // 、
        }
        ss += vias[i].name;
    }
    if(ss != ''){
        ms += teasp.message.getLabel('tm10001530', ss); // ［{0}経由］
    }
    o.value = o.name = ms;
    return o;
};

/**
 * 重複ジョブを配列から除く
 * @param {Array.<Object>} lst ジョブオブジェクトの配列１（※メソッド内で更新）
 * @param {boolean=} opt_argument  true:IDとprocess両方を評価するか
 * @return {Array.<Object>} lst 重複jobIDがあったら削除された配列
 */
teasp.util.deleteHasSameJobId = function(lst,opt_argument ){
    if(lst.length==0){
        return lst;
    }
    var i=lst.length-1;
    while(i>0){
        for(var j = i-1; j>=0; j--){
            var isSameProcess = true;
            if(opt_argument ){
                if(lst[i].process == lst[j].process){
                    isSameProcess = true;
                }else{
                    isSameProcess = false;
                }
            }

            if((lst[i].jobId == lst[j].jobId)&&isSameProcess){
                lst.splice(i,1);
                break;
            }
        }
        i--;
    }
    return lst;
};

/**
 * 文字列を指定サイズに分割
 *
 * @param {string} org
 * @param {number} max
 * @returns {Array.<string>}
 */
teasp.util.splitByLength = function(org, max) {
    var values = [];
    var v = org;
    while(v.length > 0){
        var m = max;
        var s = v.substring(0, m);
        var nx = (m < v.length ? v.substring(m, m + 2) : null);
        while(/\r\n$/.test(s) || / $/.test(s) || /\r$/.test(s) || (nx && (/^\r/.test(nx) || /^ /.test(nx)))){ // 文字列の最後が \r\n または' '(スペース) または次の文字の先頭が改行コードではじまる
            var ss = v.substring(0, ++m); // １文字追加
            if(s == ss){ // １文字追加する前と後で変わらなければ抜ける
                break;
            }
            nx = (m < v.length ? v.substring(m, m + 2) : null);
            s = ss;
        }
        values.push(v.substring(0, m));
        v = v.substring(m);
    }
    return values;
};

/**
 * エラー表示
 *
 * @param {Object|string=} res メッセージ
 * @param {(string|null)=} areaId メッセージエリアＩＤ
 * @param {boolean=} flag trueの場合、areaId のノードに直接メッセージをセット
 */
teasp.util.showErrorArea = function(res, areaId, flag){
    var msg;
    if(res){
        if (typeof(res) == 'string') {
            msg = res;
        }else{
            msg = teasp.message.getErrorMessage(res);
        }
    }else{
        msg = null;
    }
    var area = (areaId ? dojo.byId(areaId) : null);
    if(area && !flag){
        while(area.firstChild){
            dojo.destroy(area.firstChild);
        }
        dojo.style(area, {
            "padding" : "4px 16px",
            "margin"  : "2px",
            "width"   : "100%"
        });
        dojo.toggleClass(area, 'disp_table', true);
        dojo.toggleClass(area, 'disp_none' , false);
    }
    if(!msg){
        if(area){
            dojo.toggleClass(area, 'disp_table', false);
            dojo.toggleClass(area, 'disp_none' , true );
        }
        return;
    }
    if(area){
        if(flag){
            area.innerHTML = msg;
        }else{
            dojo.create('div', { style: { color:"red" }, innerHTML: msg }, area);
        }
        dojo.toggleClass(area, 'disp_table', true);
        dojo.toggleClass(area, 'disp_none' , false);
    }else{
        teasp.tsAlert(msg);
    }
};

/**
 * oをベースに、第2引数以降のオブジェクトが持つ属性やプロパティをミックスしたオブジェクトを返す。o自体も変更される。
 *
 * @param {...Object} o
 */
teasp.util.extend = function(o){
    var d = (o || {});
    for(var b = 0, a = 0, c = arguments.length ; b < c ; b++){
        for(a in arguments[b]){
            d[a] = arguments[b][a];
        }
    }
    return d;
};

/**
 * オブジェクトの要素名から名前空間プレフィックスを取り除く
 *
 * @param {Object} obj オブジェクト※メソッドで更新。
 */
teasp.util.excludeNameSpace = function(obj){
    if(!teasp.prefixBar){
        return;
    }
    if(is_array(obj)){
        for(var i = 0 ; i < obj.length ; i++){
            teasp.util.excludeNameSpace(obj[i]);
        }
    }else{
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                if(key.substring(0, teasp.prefixBar.length) == teasp.prefixBar){
                    var name = key.substring(teasp.prefixBar.length);
                    obj[name] = dojo.clone(obj[key]);
                    delete obj[key];
                    if(typeof(obj[name]) == 'object'){
                        teasp.util.excludeNameSpace(obj[name]);
                    }
                }else if(typeof(obj[key]) == 'object'){
                    teasp.util.excludeNameSpace(obj[key]);
                }
            }
        }
    }
};

/**
 * 数字のカンマ区切りテキストを数値の配列にして返す
 *
 * @static
 * @public
 * @param {string} numsText 数字のカンマ区切りテキスト
 * @return {Array.<number>}
 */
teasp.util.parseNumsText = function(numsText){
    var nums = [];
    if(!numsText){
        return nums;
    }
    var l = numsText.split(/,/);
    for(var i = 0 ; i < l.length ; i++){
        if(/\d+/.test(l[i])){
            nums.push(parseInt(l[i], 10));
        }
    }
    return nums;
};

/**
 * 数字文字列を数値タイプにして返す
 *
 * @static
 * @public
 * @param {string} numText 数字文字列
 * @param {number|null} defaultVal numText が数字文字列ではない場合の代替値
 * @return {number|null}
 */
teasp.util.parseNumText = function(numText, defaultVal){
    if(/^\d+$/.test(numText)){
        return parseInt(numText, 10);
    }
    return defaultVal;
};

/**
 * 部署リストに階層情報を追加
 *
 * @static
 * @public
 * @param {Array.<Object>} depts
 * @param {string=} date
 */
teasp.util.levelingDepts = function(depts, date){
    var demap = {};
    for(var i = (depts.length - 1) ; i >= 0 ; i--){
        var dept = depts[i];
        if(date
        && (
              (dept.startDate && date < dept.startDate)
           || (dept.endDate   && dept.endDate < date  )
           )
        ){
            dept.hidden = true;
            dept.past   = (dept.endDate   && dept.endDate < date  );
            dept.future = (dept.startDate && date < dept.startDate);
        }
        demap[dept.id] = dept;
        dept.deptCode = (dept.deptCode || dept.code || '');
    }
    for(i = 0 ; i < depts.length ; i++){
        var dept = depts[i];
        if(!dept.parentId){
            continue;
        }
        var parent = demap[dept.parentId];
        if(!parent || parent.hidden){
            dept.hidden = true;
            if(parent){
                dept.past   = parent.past;
                dept.future = parent.future;
            }else{
                dept.past = true; // 期限切れはサーバ側で削った可能性がある
            }
        }
    }
    depts = depts.sort(function(a, b){
        return (a.deptCode < b.deptCode ? -1 : (a.deptCode > b.deptCode ? 1 : 0));
    });
    var setDeptLevel = function(depts, parent, oo, date){
        var parentId = (parent ? parent.id : null);
        for(var i = 0 ; i < depts.length ; i++){
            var dept = depts[i];
            if(dept.parentId === parentId){
                if(parent){
                    parent.parentFlag = true;
                    dept.parentMap = (parent.parentMap ? dojo.clone(parent.parentMap) : {});
                    dept.parentMap[parent.id] = parent.level;
                    if(parent.hidden){
                        dept.hidden = true;
                        dept.past   = parent.past;
                        dept.future = parent.future;
                    }
                }
                dept.level = (parent ? parent.level + 1 : 1);
                var spc = '';
                for(var j = 1 ; j < dept.level ; j++){
                    spc += '&nbsp;&nbsp;';
                }
                dept.displayName = spc + dept.deptCode + '-' + dept.name;
                dept.order = oo.order++;
                setDeptLevel(depts, dept, oo, date);
            }
        }
    };
    setDeptLevel(depts, null, { order: 1 }, date);
//    for(i = depts.length - 1 ; i >= 0 ; i--){
//        if(depts[i].hidden){
//            depts.splice(i, 1);
//        }
//    }
    return depts.sort(function(a, b){
        return (a.order || 0) - (b.order || 0);
    });
};

/**
 * ヘルプアイコン、ツールチップを追加
 *
 * 例: keyに渡された値が"test"の場合…
 * - "testLabel"というIDのLabel要素の中にヘルプアイコンを追加する。
 * - "testHelp"というラベルIDの文字列を、ツールチップのメッセージにする。
 * @static
 * @public
 * @param {string} key 
 * @param {string} opt 追加したいクラス名(任意)
 * @return {Object}
 */
teasp.util.insertHelpIcon = function(key, opt){
    var helpText = teasp.message.getLabel(key + 'Help');
    var res = { key: key };
    if(helpText){
        var d = dojo.byId(key + 'Label');
        if(d && d.nodeName == 'DIV'){
            dojo.style(d, 'float', 'left');
            var div = dojo.create('div', {
                id        : key + 'Help',
                className : 'pp_base pp_icon_help ' + ((opt && opt.className) || ''),
                style     : { "float":"left", marginLeft:"4px", marginTop:"2px" }
            }, d, "after");
            dojo.create('div', { style: { clear:"both" }, className: ((opt && opt.className) || '') }, div, "after");
            res.handle1 = dojo.connect(d, 'onmouseover', function(){
                dojo.toggleClass(div, 'pp_icon_help_on', true);
                dojo.toggleClass(div, 'pp_icon_help'   , false);
            });
            res.handle2 = dojo.connect(d, 'onmouseout', function(){
                dojo.toggleClass(div, 'pp_icon_help_on', false);
                dojo.toggleClass(div, 'pp_icon_help'   , true);
            });
            try{
                res.tooltip = new dijit.Tooltip({connectId:[key + 'Label', key + 'Help'], label:helpText, position:['below']});
            }catch(e){
                console.log(e.message);
            }
        }
    }
    return res;
};

/**
 * ヘルプアイコンクラス
 * 
 *     id: 必須。ヘルプアイコンのID。
 *     message: 必須。ツールチップに表示するメッセージ。
 *     className: 任意。ヘルプアイコンに付与するクラス。
 *     eventTarget: マウスを重ねたときツールチップを出すNode。
 *     省略した場合、ヘルプアイコンにマウスを重ねた時のみツールチップが表示される。
 * @param {{ id: string, message: string, className: string, eventTarget: DomNode}} option - 
 */
teasp.util.HelpIcon = function(option){
    const helpIconId = option.id;
    const helpText = option.message;
    const className = option.className || '';
    const eventTargetNode = option.eventTarget || [];

    const helpIconNode = dojo.create('div', {
        id        : helpIconId,
        className : 'pp_base pp_icon_help ' + className
    });
    this.node = helpIconNode;
    
    eventTargetNode.forEach(function(node){
        dojo.connect(node, 'onmouseover', function(){
            dojo.toggleClass(helpIconNode, 'pp_icon_help_on', true);
            dojo.toggleClass(helpIconNode, 'pp_icon_help'   , false);
        });
        dojo.connect(node, 'onmouseout', function(){
            dojo.toggleClass(helpIconNode, 'pp_icon_help_on', false);
            dojo.toggleClass(helpIconNode, 'pp_icon_help'   , true);
        });    
    })
    try{
        const eventTargetIds = eventTargetNode.map(function(node){
            return node.id;
        })
        if(eventTargetIds){
            new dijit.Tooltip({connectId:eventTargetIds, label:helpText, position:['below']});
        }
    }catch(e){
        console.log(e.message);
    }
}

/**
 * ヘルプアイコン、ツールチップを破棄
 *
 * @static
 * @public
 * @param {Object} res teasp.util.insertHelpIcon の戻り値
 */
teasp.util.destroyHelpIcon = function(res){
    if(!res){
        return;
    }
    if(res.handle1){
        dojo.disconnect(res.handle1);
        res.handle1 = null;
    }
    if(res.handle2){
        dojo.disconnect(res.handle2);
        res.handle2 = null;
    }
    if(res.tooltip){
        res.tooltip.destroy(true);
        res.tooltip = null;
    }
    if(res.key){
        var d = dojo.byId(res.key + 'Label');
        if(d && d.nodeName == 'DIV'){
            dojo.style(d, 'float', null);
            dojo.query('#' + res.key + 'Label ~ div').forEach(function(el){
                dojo.destroy(el);
            });
        }
    }
};

teasp.util.init = function(){
    //Backspaceキーを無効化する
    dojo.connect(dojo.doc, 'onkeypress', function(event) {
        if(event.target.size === undefined &&
           event.target.rows === undefined &&
           event.keyCode == dojo.keys.BACKSPACE) {
            event.preventDefault();
        }
    });
    // １回だけ行えば良いので、２回目以降の呼び出しでは無効にする。
    teasp.util.init = function(){};
};

/**
 * ウィンドウタイトルをセット
 *
 * @param {string} title
 */
teasp.util.setWindowTitle = function(title){
    if(!title){
        return;
    }
    try{
        var tn = document.getElementsByTagName('title');
        if(tn && tn.length > 0){
            tn[0].innerHTML = title;
        }
    }catch(e){}
};

/**
 * ページングの番号割りふり
 *
 * @param {number} pgCnt
 * @param {number} pgNo
 * @param {number} boxL
 * @param {number} boxC
 * @param {number} boxR
 * @return {Array.<number>}
 */
teasp.util.getPageBox = function(pgCnt, pgNo, boxL, boxC, boxR){
    var boxs = [];
    var n = 1;
    var boxMax = (boxL + boxC + boxR);

    if(pgCnt <= (boxMax + 2)){
        while(n <= pgCnt){
            boxs.push(n++);
        }
    }else{
        while(n <= boxL){
            boxs.push(n++);
        }
        if((pgCnt == (boxMax + 3) || (boxL - 1) < pgNo) && pgNo < (boxL + boxC + 1)){
            while(n <= (boxL + boxC + 1)){
                boxs.push(n++);
            }
        }else{
            boxs.push(null);
            if((pgCnt == (boxMax + 3) || pgNo <= (pgCnt - (boxR - 2))) && pgNo >  (pgCnt - (boxC + boxR))){
                n = pgCnt - (boxC + boxR);
                while(n <= pgCnt){
                    boxs.push(n++);
                }
            }else{
                var mn = pgNo;
                if(pgNo <= (boxL - 1)
                || pgNo >  (pgCnt - (boxL - 1))){
                    mn = Math.ceil(pgCnt / 2);
                }
                var ml = Math.floor(boxC / 2);
                n = mn - ml;
                var mr = n + boxC - 1;
                while(n <= mr){
                    boxs.push(n++);
                }
            }
        }
        if(n < pgCnt){
            boxs.push(null);
            n = pgCnt - (boxR - 1);
            while(n <= pgCnt){
                boxs.push(n++);
            }
        }
    }
    return boxs;
};

/**
 * 'yyyyMM' を 'yyyy年MM月' に変換
 *
 * @param {string|number} yyyyMM の値
 * @return {string}
 */
teasp.util.getYearMonthJp = function(ym){
    var s = '' + ym;
    return teasp.util.date.formatMonth('zv00000021', s.substring(0, 4), s.substring(4)); // y年 m月
};

teasp.util.monthlyPulldown = {};

/**
 * <select>タグに選択肢をセットする。
 *
 * @param {Object} select プルダウンのDOMオブジェクト
 * @param {Array.<string>} list 選択肢のリスト（'yyyyMM' の配列）
 * @param {string|null} defaultValue デフォルト値
 * @param {boolean} ins  オンの場合は defaultValue が list に含まれないとき、挿入する
 * @param {boolean} free オンの場合は「月度指定」を選択肢に含める
 */
teasp.util.monthlyPulldown.create = function(select, list, defaultValue, ins, free){
    var dv = '' + defaultValue;
    while(select.firstChild){
        dojo.destroy(select.firstChild);
    }
    var l = dojo.clone(list);
    if(ins && dv !== null){
        if(!l.contains(dv)){
            l.push(dv);
        }
        l = l.sort(function(a, b){
            if(a == ''){
                return -1;
            }else if(b == ''){
                return 1;
            }
            return (a < b ? 1 : -1);
        });
    }
    for(var i = 0 ; i < l.length ; i++){
        var ym = l[i];
        if(ym == ''){
            dojo.create('option', { value: '', innerHTML: '----------' }, select);
        }else{
            dojo.create('option', { value: '' + ym, innerHTML: teasp.util.getYearMonthJp(ym) }, select);
        }
    }
    if(free){
        dojo.create('option', { value: '*', innerHTML: teasp.message.getLabel('tk10005450') }, select); // 月度指定
    }
    select.value = dv;
};

/**
 * 月度プルダウンの選択変更イベントの処理
 * 任意の月度の値を入力できるようにする。
 *
 * @param {Object} select プルダウンのDOMオブジェクト
 * @param {string} oldValue 選択が無効な場合、戻す値
 * @param {Function} callback 選択が有効な場合、呼ぶメソッド
 */
teasp.util.monthlyPulldown.changed = function(select, oldValue, callback){
    try{
        if(select.value == '*'){
            select.value = oldValue;
            teasp.manager.dialogOpen(
                'MonthInput',
                {
                    yearMonth : oldValue
                },
                null,
                this,
                function(o){
                    callback(o.yearMonth);
                }
            );
        }else if(select.value == ''){
            return;
        }else{
            callback(parseInt(select.value, 10));
        }
    }catch(e){
        select.value = oldValue;
        return;
    }
};

/**
 * 日付で下記のどちらかの条件に該当すれば、古いデータと判定する
 * ・本日日付の１年前以前である。
 * ・指定日の月度が直近の確定済みの月度以前である。
 * ※ クロージャ関数を返す
 * @params {Array.<String>} lfms 直近の確定済みの月度のリスト（降順ソート済み）
 * @params {string|number} initM 月度の起算日
 * @params {string|number} markM 月度の表記
 * @returns {Function}
 */
teasp.util.isOldDate = function(lfms, initM, markM) {
    var lastFm = teasp.util.getLastFixMonth(lfms, initM, markM);
    var lastYd = teasp.util.date.formatDate(teasp.util.date.addMonths(teasp.util.date.getToday(), -12)); // 1年前の日付
    return function(dkey){
        if(dkey <= lastYd){ // 本日日付の１年前以前である
            return true;
        }
        // 指定日の月度を得る
        var ym = teasp.util.searchYearMonthDate(initM, markM, null, dkey).yearMonth;
        // 指定日の月度が直近の確定済みの月度以前である
        return (ym <= lastFm);
    };
};

/**
 * 今月度より前の直近の確定済みの月度を得る
 * @params {Array.<String>} lfms 直近の確定済みの月度のリスト（降順ソート済み）
 * @params {string|number} initM 月度の起算日
 * @params {string|number} markM 月度の表記
 * @returns {number|null} 直近の確定済みの月度
 */
teasp.util.getLastFixMonth = function(lfms, initM, markM){
    var ym = teasp.util.searchYearMonthDate(initM, markM, null, teasp.util.date.getToday()).yearMonth; // 本日日付の月度
    // lfms を降順ソート（保険）
    lfms = lfms.sort(function(a, b){ return b - a; });
    // 直近の確定済み月度を探す
    var lastFixMonth = null;
    for(var i = 0 ; i < lfms.length ; i++){
        var m = lfms[i];
        if(m < ym){ // 確定済みである
            lastFixMonth = m;
            break;
        }
    }
    return lastFixMonth;
};

/**
 * HTML記号をコードに変換
 * @param {string|null} v
 * @param {*} d デフォルト値
 * @return {string} 変換後文字列
 */
teasp.util.entitize = function(v, d) {
    if(typeof(v) == 'string'){
        v = v.replace(/&/g , "&amp;" );
        v = v.replace(/</g , "&lt;"  );
        v = v.replace(/>/g , "&gt;"  );
        v = v.replace(/\"/g, "&quot;");
        v = v.replace(/{/g , "&#123;");
        v = v.replace(/}/g , "&#125;");
        v = v.replace(/\'/g, "&#039;");
    }
    return (v || d);
};
teasp.util.entitizf = function(v) {
    return teasp.util.entitize(v, '');
};
teasp.util.entitizg = function(v) {
    return teasp.util.entitize(v, '&nbsp;');
};
/**
 * コードをHTML記号に変換
 * @param {string|null} v
 * @param {*} d デフォルト値
 * @return {string} 変換後文字列
 */
teasp.util.revetize = function(v, d) {
    if(typeof(v) == 'string'){
        v = v.replace(/&amp;/g , "&" );
        v = v.replace(/&lt;/g  , "<" );
        v = v.replace(/&gt;/g  , ">" );
        v = v.replace(/&quot;/g, "\"");
        v = v.replace(/&#123;/g, "{" );
        v = v.replace(/&#125;/g, "}" );
        v = v.replace(/&#039;/g, "\'");
    }
    return (v || d);
};


/**
 * IE11 では、dojo.isIE は undefined を返すので、
 * 自分で userAgent を調べる
 */
teasp.util.isIE = function(){
    if(!dojo.isIE){
        var m = /(msie\s|trident.*rv:)([\w.]+)/.exec(navigator.userAgent.toLowerCase());
        if(m){
            dojo.isIE = m[2] - 0;
        }
    }
    return dojo.isIE;
};

teasp.util.getAncestorByTagName = function(el, tagName){
    var pel = null;
    var p = el;
    while(p != null && p.tagName != 'BODY'){
        if(p.tagName == tagName){
            pel = p;
            break;
        }
        p = p.parentNode;
    }
    return pel;
};

teasp.util.fadeInOut = function(flag, args){
	require(["dojo/_base/fx"], dojo.hitch(this, function(fx) {
		if(flag){
			fx.fadeIn(args).play();
		}else{
			fx.fadeOut(args).play();
		}
	}));
};

/**
 * 2つの時間帯の配列が同じかどうかを判定する
 * @param {[{from:{number},to:{number}},..]} as
 * @param {[{from:{number},to:{number}},..]} bs
 * @return {boolean} true:差異あり false:同一
 */
teasp.util.compareSpans = function(as, bs){
	var _bs = dojo.clone(bs || []);
	for(var i = 0 ; i < as.length ; i++){
		var a = as[i];
		var f = false;
		for(var x = 0 ; x < _bs.length ; x++){
			var b = _bs[x];
			if(a.from == b.from && a.to == b.to){
				_bs.splice(x, 1);
				f = true;
				break;
			}
		}
		if(!f){
			return true;
		}
	}
	return (_bs.length > 0);
};
/**
 * 配列をソートする
 * @param {[{from:{number},to:{number}},..]} lst
 * @return {Array.<Object>} ソート後の配列
 */
teasp.util.sortSpans = function(lst){
	return lst.sort(function(a, b){
		var na = (typeof(a.from) == 'number' ? a.from : a.to);
		var nb = (typeof(b.from) == 'number' ? b.from : b.to);
		if(typeof(na) == 'number' && typeof(nb) == 'number'){
			return na - nb;
		}else if(typeof(na) == 'number'){
			return -1;
		}else if(typeof(nb) == 'number'){
			return 1;
		}
		return 0;
	});
};
/**
 * {from:{number},to:{number}}の配列を "h:mm-h:mm" の文字列の配列に変換
 * @param {[{from:{number},to:{number}},..]} lst
 * @return {Array.<string>}
 */
teasp.util.convertSpanStrings = function(lst){
	var strs = [];
	for(var i = 0 ; i < lst.length ; i++){
		var o = lst[i];
		strs.push([
			typeof(o.from) == 'number' ? teasp.util.time.timeValue(o.from) : '',
			typeof(o.to)   == 'number' ? teasp.util.time.timeValue(o.to)   : ''
		].join('-'));
	}
	return strs;
};
teasp.util.dspVal = function(v, defVal){
	if(typeof(v) == 'number'){
		return '' + v;
	}
	return v || (defVal === undefined ? null : defVal);
};
// 検索窓用に 全角→半角 ＋ 小文字→大文字 変換
// （英数記号の全角半角、大小文字の区別をしないで検索できるように）
teasp.util.convertStr = function(strVal){
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
	.replace(/　/g, " ")  // U+3000 → U+0020
	.toUpperCase(); // 小文字→大文字へ変換
	var v = halfVal.replace(/^\s+|\s+$/g,""); // 前後の空白を除去
	return (v ? v : halfVal); // 空白のみの入力ならそのまま返す
};
/**
 * 任意日の時点の期間単位休の基準時間を得る
 *
 * @param {Array.<object>} configHistory
 * @param {string} d 日付（yyyy-MM-dd)
 * @return {object} 基準時間（baseTime, baseTimeForStock を含むオブジェクト）
 */
teasp.util.getConfigByDate = function(configHistory, d){
	var chs = configHistory || [];
	for(var i = 0 ; i < chs.length ; i++){
		var ch = chs[i];
		if((!ch.startDate || ch.startDate <= d) && (!ch.endDate || d <= ch.endDate)){
			return ch;
		}
	}
	return null;
};

teasp.util.getBaseTimeForStock = function(ch){
	if(ch){
		if(ch.config){
			return ch.config.BaseTimeForStock__c || null;
		}else{
			return ch.baseTimeForStock || null;
		}
	}
	return null;
};

teasp.util.getFutureConfigs = function(configHistory, d){
	var chs = configHistory || [];
	var lst = [];
	for(var i = 0 ; i < chs.length ; i++){
		var ch = chs[i];
		if(ch.startDate && d < ch.startDate){
			lst.push(ch);
		}
	}
	return lst;
};
