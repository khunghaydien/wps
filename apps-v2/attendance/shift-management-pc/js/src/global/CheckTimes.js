/**
 * 休憩・公用外出の値チェック.<br/><br/>
 * 勤怠情報入力と休憩・公用外出情報編集ダイアログから呼ばれる
 *
 * @param {Array.<Object>} rests 休憩時間リスト
 * @param {Array.<Object>} aways 公用外出時間リスト
 * @param {number} st 出社時刻
 * @param {number} et 退社時刻
 * @param {boolean} keepExterior 勤務時間外の休憩を記録するか
 * @return {Object} resp 休憩・公用外出をセットし直したオブジェクト。エラーの場合はエラーメッセージを格納。
 */
var checkTimes = function(_rests, _aways, fixRests, st, et, keepExterior){
    var rests = dojo.clone(_rests);
    var aways = dojo.clone(_aways);
    st = (typeof(st) == 'number' ? st : -1);
    et = (typeof(et) == 'number' ? et : -1);
    var resp = {
        message   : '',
        startTime : (st < 0 ? null : st),
        endTime   : (et < 0 ? null : et),
        timeTable : [],
        over      : false
    };
    var i, j;
    var noPaids = [];
    for(i = 0 ; i < rests.length ; i++){
        var a = rests[i];
        if(a.type == teasp.constant.REST_FREE
        && typeof(a.from) == 'number'
        && typeof(a.to)   == 'number'
        && a.from < a.to){
            for(j = 0 ; j < fixRests.length ; j++){
                var b = fixRests[j];
                if(b.from <= a.from && a.to <= b.to){
                    a.type = teasp.constant.REST_FIX;
                    break;
                }
            }
        }
    }
    for(i = 0 ; i < rests.length ; i++){
        var a = rests[i];
        if(typeof(a.from) != 'number' || typeof(a.to) != 'number'){
            continue;
        }
        if(a.type != teasp.constant.REST_PAY){
            noPaids.push(a);
        }
        for(j = 0 ; j < rests.length ; j++){
            var b = rests[j];
            if(i == j || typeof(b.from) != 'number' || typeof(b.to) != 'number'){
                continue;
            }
            var fa = (a.type == teasp.constant.REST_FIX ? 1 : (a.type == teasp.constant.REST_FREE ? 2 : 4));
            var fb = (b.type == teasp.constant.REST_FIX ? 1 : (b.type == teasp.constant.REST_FREE ? 2 : 4));
            if((fa|fb) == 5){  // 時間単位休と所定休憩は重複しても良い
                continue;
            }
            if((a.from <= b.from && b.from <  a.to)
            || (a.from < b.to    && b.to   <= a.to)
            || (b.from < a.from  && a.to   <  b.to)){
                resp.message = teasp.message.getLabel((fa|fb) >= 4 ? 'tm10001481' : 'tm10001480');
                // 時間単位休と所定外の休憩時間が重複しないように入力してください
                // 休憩時間同士が重複しないように入力してください
                return resp;
            }
        }
    }
    if(st < 0 && et < 0){
        for(i = 0 ; i < rests.length ; i++){
            var a = rests[i];
            if(a.type == teasp.constant.REST_PAY){
                var wt1 = teasp.util.time.rangeTime(a, noPaids);
                var wt2 = teasp.util.time.rangeTime(a, fixRests);
                if(wt1 < wt2){
                    var rs = [];
                    for(j = 0 ; j < fixRests.length ; j++){
                        var b = fixRests[j];
                        if((a.from < b.from && b.from < a.to)
                        || (a.from < b.to   && b.to   < a.to)
                        || (b.from < a.from && a.to   < b.to)){
                            rs.push({
                                from : (a.from < b.from ? b.from : a.from),
                                to   : (a.to   < b.to   ? a.to   : b.to  ),
                                type : teasp.constant.REST_FIX
                            });
                        }
                    }
                    if(rs.length > 0){
                        rests = rests.concat(rs);
                    }
                }
            }
        }
    }
    var o = null;
    for(i = 0 ; i < aways.length ; i++){
        if(o){
            if(typeof(aways[i].from) == 'number'
            && typeof(o.to) == 'number'
            && aways[i].from < o.to){
                resp.message = teasp.message.getLabel('tm10001500'); // 公用外出時間同士が重複しないように入力してください
                return resp;
            }
        }
        o = aways[i];
    }

    var rest21s = [];
    var rest22s = [];
    for(i = 0 ; i < rests.length ; i++){
        if(rests[i].type == teasp.constant.REST_FIX){
            rest21s.push(rests[i]);
        }else if(rests[i].type == teasp.constant.REST_FREE){
            o = rests[i];
            if(typeof(o.from) == 'number' && typeof(o.to) == 'number' && o.from >= o.to){
                resp.message = teasp.message.getLabel('tm10001490'); // 休憩時刻が正しくありません
                return resp;
            }
            rest22s.push(rests[i]);
        }
    }

    for(i = 0 ; i < aways.length ; i++){
        o = aways[i];
        if(typeof(o.from) == 'number' && typeof(o.to) == 'number' && o.from >= o.to){
            resp.message = teasp.message.getLabel('tm10001510'); // 公用外出時刻が正しくありません
            return resp;
        }
    }

    var rest22v = [];
    for(i = 0 ; i < rest22s.length ; i++){
        o = rest22s[i];
        if(typeof(o.from) == 'number' && st >= 0 && o.from < st){
            resp.over = true;
            if(!keepExterior){
                o.from = st;
            }
        }
        if(typeof(o.to) == 'number' && et >= 0 && et < o.to){
            resp.over = true;
            if(!keepExterior){
                o.to = et;
            }
        }
        if(typeof(o.from) == 'number' && typeof(o.to) != 'number'){ // 開始時刻しか入力されてない
            o.to = null;
            rest22v.push(o);
        }else if(typeof(o.from) != 'number' && typeof(o.to) == 'number'){ // 終了時刻しか入力されてない
            o.from = null;
            rest22v.push(o);
        }else if(typeof(o.from) == 'number' && typeof(o.to) == 'number' && o.from < o.to){ // 開始・終了とも入力されている
            rest22v.push(o);
        }
    }
    var awayv = [];
    for(i = 0 ; i < aways.length ; i++){
        o = aways[i];
        if(typeof(o.from) == 'number' && st >= 0 && o.from < st){
            resp.over = true;
            if(!keepExterior){
                o.from = st;
            }
        }
        if(typeof(o.to) == 'number' && et >= 0 && et < o.to){
            resp.over = true;
            if(!keepExterior){
                o.to = et;
            }
        }
        if(typeof(o.from) == 'number' && typeof(o.to) != 'number'){ // 開始時刻しか入力されてない
            o.to = null;
            awayv.push(o);
        }else if(typeof(o.from) != 'number' && typeof(o.to) == 'number'){ // 終了時刻しか入力されてない
            o.from = null;
            awayv.push(o);
        }else if(typeof(o.from) == 'number' && typeof(o.to) == 'number' && o.from < o.to){ // 開始・終了とも入力されている
            awayv.push(o);
        }
    }
    resp.timeTable = resp.timeTable.concat(rest21s);
    if(rest22v.length > 0){
        resp.timeTable = resp.timeTable.concat(rest22v);
    }
    if(awayv.length > 0){
        resp.timeTable = resp.timeTable.concat(awayv);
    }
    resp.rests = rest21s.concat(rest22v);
    return resp;
};
