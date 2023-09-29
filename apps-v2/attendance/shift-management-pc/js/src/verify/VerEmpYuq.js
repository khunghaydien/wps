teasp.provide('teasp.verify.VerEmpYuq');
/**
 *
 */
teasp.verify.VerEmpYuq = function(){
    this.yuqs = null;
    this.yuqDetails = null;
    this.yuqMap = null;
    this.errorId = null;
};

teasp.verify.VerEmpYuq.prototype.setErrorId = function(errorId){
    this.errorId = errorId;
};

teasp.verify.VerEmpYuq.getYuqRequest = function(param){
    if(!param.empId){
        return null;
    }
    var soql = teasp.message.format(
            "select Id, Name, EmpId__c, Date__c, StartDate__c, LimitDate__c, EmpApplyId__c, EmpApplyId__r.Name"
            + ", BaseTime__c, TotalTime__c, Subject__c, TimeUnit__c, LostFlag__c, AutoFlag__c, BatchId__c"
            + ", TempFlag__c, StockProvideBatchId__c, oldNextYuqProvideDate__c"
            + " from AtkEmpYuq__c where EmpId__c = '{0}'"
            , param.empId);
    return { funcName: 'getExtResult', params: { soql: soql, limit: null, offset: 0 } };
};

teasp.verify.VerEmpYuq.getYuqDetailRequest = function(param){
    if(!param.empId){
        return null;
    }
    var soql = teasp.message.format(
            "select Id, Name, EmpYuqId__c, GroupId__c, Time__c"
            + " from AtkEmpYuqDetail__c where EmpYuqId__r.EmpId__c = '{0}'"
            , param.empId);
    return { funcName: 'getExtResult', params: { soql: soql, limit: null, offset: 0 } };
};

/**
 * 有休マップを作成して返す
 * @returns {Object}
 */
teasp.verify.VerEmpYuq.prototype.getYuqMap = function(){
    if(this.yuqMap){
        return this.yuqMap; // 作成済みがあればそのまま返す
    }
    // 有休詳細テーブルから紐づけ情報を得る
    var lnks = {};
    for(var i = 0 ; i < this.yuqDetails.length ; i++){
        var d = this.yuqDetails[i];
        var l = lnks[d.EmpYuqId__c];
        if(!l){
            l = lnks[d.EmpYuqId__c] = [];
        }
        l.push({ pId: d.GroupId__c, time: d.Time__c });
    }
    // 種類（付与・消化・混合）別の配列を作成
    var ym = {plus:[],minus:[],mix:[]};
    var limitNo = 0; // 失効レコードのID生成用
    var tagM = {};   // 付与レコードのマップ
    // 付与レコードの処理
    for(var i = 0 ; i < this.yuqs.length ; i++){
        var yuq = this.yuqs[i];
        yuq.Date__c = teasp.util.date.formatDate(yuq.Date__c);
        yuq.StartDate__c = teasp.util.date.formatDate(yuq.StartDate__c);
        yuq.LimitDate__c = teasp.util.date.formatDate(yuq.LimitDate__c);
        yuq._empApplyName = (yuq.EmpApplyId__r ? yuq.EmpApplyId__r.Name : '');
        yuq._bt = teasp.util.time.timeValue(yuq.BaseTime__c);
        if(yuq.TotalTime__c >= 0){ // 付与データ
            yuq._obj = new teasp.logic.YuqDays(yuq.BaseTime__c, yuq.TotalTime__c);
            yuq._date = yuq.StartDate__c;
            if(!yuq.EmpApplyId__r){
                yuq.Name += '(付与日：' + yuq.Date__c + ')';
            }
            ym.plus.push(yuq);
            ym.mix.push(yuq);
            // 失効レコードを作成
            var y = {
                Id             : '' + (++limitNo),
                Name           : '(失効)',
                TotalTime__c   : yuq.BaseTime__c * (-1), // (暫定)
                Date__c        : yuq.LimitDate__c,
                BaseTime__c    : yuq.BaseTime__c,
                _date          : yuq.LimitDate__c,
                _empApplyName  : '',
                _bt            : teasp.util.time.timeValue(yuq.BaseTime__c),
                _limit         : true
            };
            y._obj = new teasp.logic.YuqDays(y.BaseTime__c, y.TotalTime__c);
            y._index = 0;
            lnks[y.Id] = [{ pId: yuq.Id, time: y.TotalTime__c }];
            ym.minus.push(y);
            ym.mix.push(y);
        }
    }
    // 付与分をソート：失効日＞有効開始日＞付与日の昇順
    ym.plus = ym.plus.sort(function(a, b){
        if(a.LimitDate__c == b.LimitDate__c){
            if(a.StartDate__c == b.StartDate__c){
                return (a.Date__c < b.Date__c ? -1 : 1);
            }
            return (a.StartDate__c < b.StartDate__c ? -1 : 1);
        }
        return (a.LimitDate__c < b.LimitDate__c ? -1 : 1);
    });
    // 付与レコードにタグ振り、付与マップ作成
    for(var i = 0 ; i < ym.plus.length ; i++){
        ym.plus[i]._tag = '#' + (i + 1);
        ym.plus[i]._no  = (i + 1);
        tagM[ym.plus[i].Id] = ym.plus[i];
    }
    // 消化レコードの処理
    for(i = 0 ; i < this.yuqs.length ; i++){
        var yuq = this.yuqs[i];
        if(yuq.TotalTime__c < 0){ // 消化データ
            var l = lnks[yuq.Id];
            if(!l){
                l = lnks[yuq.Id] = [{ pId: null, time: yuq.TotalTime__c }];
            }
            for(var k = 0 ; k < l.length ; k++){
                var z = l[k];
                var y = (k == 0 ? yuq : dojo.clone(yuq));
                y._obj = new teasp.logic.YuqDays(y.BaseTime__c, Math.abs(z.time));
                y._date = y.Date__c;
                y._index = k;
                var p = (z.pId ? tagM[z.pId] : null);
                if(p){ // 付与レコードの開始日・失効日・付与日の情報をセット（ソート用）
                    y.parent = {
                        LimitDate__c : p.LimitDate__c,
                        StartDate__c : p.StartDate__c,
                        Date__c      : p.Date__c
                    };
                }
                ym.minus.push(y);
                ym.mix.push(y);
            }
        }
    }
    // 消化分をソート
    ym.minus = ym.minus.sort(function(a, b){
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
    for(var i = 0 ; i < ym.minus.length ; i++){
        if(ym.minus[i]._index >= 0){
            var l = lnks[ym.minus[i].Id];
            var k = ym.minus[i]._index;
            var p = (l[k].pId ? tagM[l[k].pId] : null);
            ym.minus[i]._tag  = (p ? p._tag : null);
            ym.minus[i]._no   = (i + 1) * 10;
            ym.minus[i]._folk = (l.length > 1);
        }
    }
    // 混合配列をソート
    ym.mix = ym.mix.sort(function(a, b){
        if(a._date == b._date){
            return (a._no - b._no);
        }
        return (a._date < b._date ? -1 : 1);
    });
    // 残日数計算の前準備
    for(var i = 0 ; i < ym.mix.length ; i++){
        var ox = ym.mix[i];
        if(ox.TotalTime__c >= 0){
            ox._plus = new teasp.logic.YuqDays(ox.BaseTime__c, ox.TotalTime__c);
        }
    }
    // 残日数計算
    var zan = null;
    for(var i = 0 ; i < ym.mix.length ; i++){
        var ox = ym.mix[i];
        if(ox.TotalTime__c < 0){
            var l = lnks[ox.Id];
            var lnk = ((l && ox._index < l.length) ? l[ox._index] : null);
            var p = (lnk && lnk.pId ? tagM[lnk.pId] : null);
            if(p){
                if(ox._limit){ // 失効レコード
                    if(p._plus.getAllMinutes() <= 0){
                        ox._none = true; // すべて消化したので失効レコードは不要
                    }else{
                        ox._obj = new teasp.logic.YuqDays(ox.BaseTime__c, p._plus.getAllMinutes()); // 付与レコードの残日数＝失効
                    }
                }
                if(!ox._none){
                    p._plus.subtract(ox._obj);
                    if(p._plus.getAllMinutes() < 0){
                        ox._ng = true; // 消化しすぎ→NGフラグをセット
                    }
                }
            }
        }
        if(!ox._none){
            if(!zan){
                zan = new teasp.logic.YuqDays(ox.BaseTime__c, ox._obj.getAllMinutes());
            }else if(ox.TotalTime__c >= 0){
                zan.append(ox._obj);
            }else{
                zan.subtract(ox._obj);
            }
            ox._zan = new teasp.logic.YuqDays(zan.getBaseTime(), zan.getAllMinutes()); // 残日数セット
        }
    }
    // 失効レコードが不要の場合、配列から削除
    for(var i = ym.mix.length - 1 ; i >= 0 ; i--){
        if(ym.mix[i]._none){
            ym.mix.splice(i, 1);
        }
    }
    this.yuqMap = ym;
    return this.yuqMap;
};

/**
 *
 */
teasp.verify.VerEmpYuq.prototype.getEmpYuq = function(param, onSuccess, onFailure){
    if(this.yuqs){
        onSuccess();
    }else{
        teasp.action.contact.remoteMethods(
            [
                teasp.verify.VerEmpYuq.getYuqRequest(param),
                teasp.verify.VerEmpYuq.getYuqDetailRequest(param)
            ],
            { errorAreaId: this.errorId, nowait: true },
            function(result, index){
                if(result.result == 'NG'){
                    onFailure(result);
                }else{
                    if(index == 0){
                        this.yuqs = result.records;
                    }else if(index == 1){
                        this.yuqDetails = result.records;
                        onSuccess();
                    }
                }
            },
            null,
            this
        );
    }
};
