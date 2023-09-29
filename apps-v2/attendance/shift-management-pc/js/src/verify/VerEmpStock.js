teasp.provide('teasp.verify.VerEmpStock');
/**
 *
 */
teasp.verify.VerEmpStock = function(){
    this.stocks = null;
    this.stockDetails = null;
    this.stockMap = null;
    this.errorId = null;
};

teasp.verify.VerEmpStock.prototype.setErrorId = function(errorId){
    this.errorId = errorId;
};

teasp.verify.VerEmpStock.getStockRequest = function(param){
    if(!param.empId){
        return null;
    }
    var soql = teasp.message.format(
            "select Id, Name, Type__c, Days__c, Date__c, StartDate__c, LimitDate__c, EmpApplyId__c, EmpApplyId__r.Name"
            + ", DayType__c, WorkRealTime__c, DaiqAllBorderTime__c, DaiqHalfBorderTime__c, BatchKey__c, LostFlag__c"
            + " from AtkEmpStock__c where EmpId__c = '{0}'"
            , param.empId);
    return { funcName: 'getExtResult', params: { soql: soql, limit: null, offset: 0 } };
};

teasp.verify.VerEmpStock.getStockDetailRequest = function(param){
    if(!param.empId){
        return null;
    }
    var soql = teasp.message.format(
            "select Id, Name, Days__c, ConsumesStockId__c, ConsumesStockId__r.StartDate__c, ConsumesStockId__r.Days__c, ConsumedByStockId__c"
            + " from AtkEmpStockDetail__c where ConsumesStockId__r.EmpId__c = '{0}'"
            , param.empId);
    return { funcName: 'getExtResult', params: { soql: soql, limit: null, offset: 0 } };
};

/**
 * 積休マップを作成して返す
 * @returns {Object}
 */
teasp.verify.VerEmpStock.prototype.getStockMap = function(){
    if(this.stockMap){
        return this.stockMap; // 作成済みがあればそのまま返す
    }
    // 積休詳細テーブルから紐づけ情報を得る
    var lnks = {};
    for(var i = 0 ; i < this.stockDetails.length ; i++){
        var d = this.stockDetails[i];
        var l = lnks[d.ConsumedByStockId__c];
        if(!l){
            l = lnks[d.ConsumedByStockId__c] = [];
        }
        l.push({
            pId:       d.ConsumesStockId__c,
            days:      (d.ConsumesStockId__r && typeof(d.ConsumesStockId__r.Days__c) == 'number' && d.ConsumesStockId__r.Days__c < d.Days__c ? d.ConsumesStockId__r.Days__c : d.Days__c),
            startDate: (d.ConsumesStockId__r && d.ConsumesStockId__r.StartDate__c ? teasp.util.date.formatDate(d.ConsumesStockId__r.StartDate__c) : null)
        });
    }
    // 日数管理休暇の管理名毎に種類（付与・消化・混合）別の配列を作成
    var sm = {};
    var limitNo = 0; // 失効レコードのID生成用
    var tagM = {};   // 付与レコードのマップ
    // 付与レコードの処理
    for(var i = 0 ; i < this.stocks.length ; i++){
        var stock = this.stocks[i];
        var o = sm[stock.Type__c];
        if(!o){
            o = sm[stock.Type__c] = {plus:[],minus:[],mix:[]};
        }
        stock.Date__c = teasp.util.date.formatDate(stock.Date__c);
        stock.StartDate__c = teasp.util.date.formatDate(stock.StartDate__c);
        stock.LimitDate__c = teasp.util.date.formatDate(stock.LimitDate__c);
        stock.WorkRealTime__c       = (typeof(stock.WorkRealTime__c)       == 'number' ? teasp.util.time.timeValue(stock.WorkRealTime__c      ) : '');
        stock.DaiqAllBorderTime__c  = (typeof(stock.DaiqAllBorderTime__c)  == 'number' ? teasp.util.time.timeValue(stock.DaiqAllBorderTime__c ) : '');
        stock.DaiqHalfBorderTime__c = (typeof(stock.DaiqHalfBorderTime__c) == 'number' ? teasp.util.time.timeValue(stock.DaiqHalfBorderTime__c) : '');
        stock._empApplyName = (stock.EmpApplyId__r ? stock.EmpApplyId__r.Name : '');
        if(stock.Days__c >= 0){ // 付与データ
            stock._date = stock.StartDate__c;
            stock._days = stock.Days__c;
            if(!stock.EmpApplyId__r){
                stock.Name += '(付与日：' + stock.Date__c + ')';
            }
            o.plus.push(stock);
            o.mix.push(stock);
            // 失効レコードを作成
            var s = {
                Id                    : '' + (++limitNo),
                Name                  : '(失効)',
                Days__c               : -1, // (暫定)
                Type__c               : stock.Type__c,
                Date__c               : stock.LimitDate__c,
                WorkRealTime__c       : '',
                DaiqAllBorderTime__c  : '',
                DaiqHalfBorderTime__c : '',
                _date                 : stock.LimitDate__c,
                _empApplyName         : '',
                _limit                : true
            };
            s._days = s.Days__c;
            s._index = 0;
            lnks[s.Id] = [{ pId: stock.Id, days: s.Days__c }];
            o.minus.push(s);
            o.mix.push(s);
        }
    }
    for(var key in sm){
        if(!sm.hasOwnProperty(key)){
            continue;
        }
        var o = sm[key];
        // 付与分をソート：失効日＞有効開始日＞付与日の昇順
        o.plus = o.plus.sort(function(a, b){
            if(a.LimitDate__c == b.LimitDate__c){
                if(a.StartDate__c == b.StartDate__c){
                    return (a.Date__c < b.Date__c ? -1 : 1);
                }
                return (a.StartDate__c < b.StartDate__c ? -1 : 1);
            }
            return (a.LimitDate__c < b.LimitDate__c ? -1 : 1);
        });
        // 付与レコードにタグ振り、付与マップ作成
        for(var i = 0 ; i < o.plus.length ; i++){
            o.plus[i]._tag = '#' + (i + 1);
            o.plus[i]._no  = (i + 1);
            tagM[o.plus[i].Id] = o.plus[i];
        }
    }
    // 消化レコードの処理
    for(i = 0 ; i < this.stocks.length ; i++){
        var stock = this.stocks[i];
        if(stock.Days__c < 0){ // 消化データ
            var o = sm[stock.Type__c];
            var l = lnks[stock.Id];
            if(!l){
                l = lnks[stock.Id] = [{ pId: null, days: stock.Days__c, startDate: null }];
            }
            var psd = (stock.LostFlag__c ? l[0].startDate : null); // 剥奪フラグ＝オンの場合は、Date__c の代わりに付与レコードの有効開始日を参照する
            for(var k = 0 ; k < l.length ; k++){
                var z = l[k];
                var s = (k == 0 ? stock : dojo.clone(stock));
                s._date = psd || s.Date__c;
                if(stock.LostFlag__c){
                    s._days = Math.min(l[0].days, Math.abs(z.days));
                }else{
                    s._days = Math.abs(z.days);
                }
                s._index = k;
                var p = (z.pId ? tagM[z.pId] : null);
                if(p){ // 付与レコードの開始日・失効日・付与日の情報をセット（ソート用）
                    s.parent = {
                        LimitDate__c : p.LimitDate__c,
                        StartDate__c : p.StartDate__c,
                        Date__c      : p.Date__c
                    };
                }
                o.minus.push(s);
                o.mix.push(s);
            }
        }
    }
    for(var key in sm){
        if(!sm.hasOwnProperty(key)){
            continue;
        }
        var o = sm[key];
        // 消化分をソート
        o.minus = o.minus.sort(function(a, b){
            if(a.Date__c == b.Date__c){ // 消化日が同じ場合、付与の：失効日＞有効開始日＞付与日の昇順でソート
                if(a.parent && b.parent){
                    if(a.parent.LimitDate__c == b.parent.LimitDate__c){
                        if(a.parent.StartDate__c == b.parent.StartDate__c){
                            return (a.parent.Date__c < b.parent.Date__c ? -1 : 1);
                        }
                        return (a.parent.StartDate__c < b.parent.StartDate__c ? -1 : 1);
                    }
                    return (a.parent.LimitDate__c < b.parent.LimitDate__c ? -1 : 1);
                }else if(a.parent){
                    return -1;
                }else if(b.parent){
                    return 1;
                }else{
                    return -1;
                }
            }
            return (a.Date__c < b.Date__c ? -1 : 1);
        });
        // 消化レコードに紐づく付与レコードのタグをセット
        for(var i = 0 ; i < o.minus.length ; i++){
            if(o.minus[i]._index >= 0){
                var l = lnks[o.minus[i].Id];
                var k = o.minus[i]._index;
                var p = (l[k].pId ? tagM[l[k].pId] : null);
                o.minus[i]._tag  = (p ? p._tag : null);
                o.minus[i]._no   = (i + 1) * 10;
                o.minus[i]._folk = (l.length > 1);
            }
        }
        // 混合配列をソート
        o.mix = o.mix.sort(function(a, b){
            if(a._date == b._date){
                return (a._no - b._no);
            }
            return (a._date < b._date ? -1 : 1);
        });
        // 残日数計算の前準備
        for(var i = 0 ; i < o.mix.length ; i++){
            var ox = o.mix[i];
            if(ox.Days__c >= 0){
                ox._plus = ox.Days__c;
                if(ox.Days__c == 0){
                    ox._ng = true;
                }
            }
        }
        // 残日数計算
        var zan = 0;
        for(var i = 0 ; i < o.mix.length ; i++){
            var ox = o.mix[i];
            ox._name = ox.Name;
            if(ox.Days__c < 0){
                var l = lnks[ox.Id];
                var lnk = ((l && ox._index < l.length) ? l[ox._index] : null);
                var p = (lnk && lnk.pId ? tagM[lnk.pId] : null);
                if(p){
                    if(ox._limit){ // 失効レコード
                        if(p._plus <= 0){
                            ox._none = true; // すべて消化したので失効レコードは不要
                        }else{
                            ox._days = p._plus; // 付与レコードの残日数＝失効
                        }
                    }
                    if(!ox._none){
                        if(ox.LostFlag__c){
                            p._plus -= Math.min(p._plus, ox._days);
                        }else{
                            p._plus -= ox._days;
                        }
                        if(p._plus < 0){
                            ox._ng = true; // 付与数＜消化数→NGフラグをセット
                        }
                    }
                }
                if(ox.LostFlag__c){
                    ox._name += '(' + (ox.Days__c) + '日)';
                }
            }
            if(!ox._none){
                if(ox.Days__c < 0){
                    zan -= ox._days;
                }else{
                    zan += ox._days;
                }
                ox._zan = zan; // 残日数セット
            }
        }
        // 失効レコードが不要の場合、配列から削除
        for(var i = o.mix.length - 1 ; i >= 0 ; i--){
            if(o.mix[i]._none){
                o.mix.splice(i, 1);
            }
        }
    }
    this.stockMap = sm;
    return this.stockMap;
};

/**
 *
 */
teasp.verify.VerEmpStock.prototype.getEmpStock = function(param, onSuccess, onFailure){
    if(this.stocks){
        onSuccess();
    }else{
        teasp.action.contact.remoteMethods(
            [
                teasp.verify.VerEmpStock.getStockRequest(param),
                teasp.verify.VerEmpStock.getStockDetailRequest(param)
            ],
            { errorAreaId: this.errorId, nowait: true },
            function(result, index){
                if(result.result == 'NG'){
                    onFailure(result);
                }else{
                    if(index == 0){
                        this.stocks = result.records;
                    }else if(index == 1){
                        this.stockDetails = result.records;
                        onSuccess();
                    }
                }
            },
            null,
            this
        );
    }
};
