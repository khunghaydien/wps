/*
 *
 */
tsq.QueryObj.prototype.buildForm = function(){
    require(["dojo/string"]);

    this.destroy();
    var qform = dojo.byId('queryForm');

    var inp = dojo.create('input', { type: 'button', value: '抽出', style: 'margin-top:10px;' }
        , dojo.create('div', null, qform));
    var a = dojo.create('a', { innerHTML: 'ダウンロード' }
        , dojo.create('div', { id: 'queryDownload', style: 'margin-top:10px;display:none;' }, qform));
    dojo.connect(inp, 'onclick', this, function(){
        this.folder = {};
        this.fetchEmps();
    });
};

tsq.QueryObj.prototype.fetchEmps = function(){
    teasp.manager.dialogOpen('BusyWait');
    this.folder.emps = null;

    var soql = "select Id"
        + ", Name"
        + ", EmpCode__c"
        + ", DeptId__r.DeptCode__c"
        + ", DeptId__r.Name"
        + ", EmpTypeId__c"
        + ", EmpTypeId__r.Name"
        + ", EmpTypeId__r.ConfigBaseId__c"
        + ", EntryDate__c"
        + ", EndDate__c"
        + " from AtkEmp__c";
    this.search(soql, true);
};

tsq.QueryObj.prototype.buildData = function(records){
    if(!this.folder.emps){
        this.folder.emps = records;
        this.folder.index = 0;
        this.folder.phase = 1;
        this.folder.empYuq = {};
        this.folder.empYuqDetail = {};
        this.getEmpYuqs();
    }else{
        var emp = this.folder.emps[this.folder.index];
        if(this.folder.phase == 1){
            this.setYuqs(emp.Id, records);
            this.folder.phase = 2;
            this.getEmpYuqDetails();
        }else{
            this.setYuqDetails(emp.Id, records);
            this.folder.index++;
            this.folder.phase = 1;
            this.getEmpYuqs();
        }
    }
};

tsq.QueryObj.prototype.setYuqs = function(empId, records){
    this.folder.empYuq[empId] = records;
};

tsq.QueryObj.prototype.setYuqDetails = function(empId, records){
    this.folder.empYuqDetail[empId] = records;
};

tsq.QueryObj.prototype.getEmpYuqs = function(){
    if(this.folder.index >= this.folder.emps.length){
        this.outputSummary();
        return;
    }
    var emp = this.folder.emps[this.folder.index];
    console.log(this.folder.index + ') ' + emp.Name);
    this.step();
    var soql = "select Id, Name, EmpId__c, Date__c, StartDate__c, LimitDate__c, EmpApplyId__c, EmpApplyId__r.Name"
        + ", BaseTime__c, TotalTime__c, Subject__c, TimeUnit__c, LostFlag__c, AutoFlag__c, BatchId__c"
        + ", TempFlag__c, StockProvideBatchId__c, oldNextYuqProvideDate__c"
        + ", EmpApplyId__r.HolidayId__r.Range__c, EmpApplyId__r.StartDate__c, EmpApplyId__r.EndDate__c, EmpApplyId__r.ExcludeDate__c"
        + " from AtkEmpYuq__c where EmpId__c = '" + emp.Id + "'";
    this.search(soql, true);
};

tsq.QueryObj.prototype.getEmpYuqDetails = function(){
    var emp = this.folder.emps[this.folder.index];
    var soql = "select Id, Name, EmpYuqId__c, GroupId__c, Time__c"
        + " from AtkEmpYuqDetail__c where EmpYuqId__r.EmpId__c = '" + emp.Id + "'";
    this.search(soql, true);
};

tsq.QueryObj.prototype.outputSummary = function(){
    this.step();
    var heads = [
        '"部署コード"',
        '"部署名"',
        '"勤務体系"',
        '"入社日"',
        '"退社日"',
        '"社員コード"',
        '"社員名"',
        '"日付"',
        '"付与日数"',
        '"付与時間"',
        '"TAG"',
        '"消化日数"',
        '"消化時間"',
        '"TAG"',
        '"残日数"',
        '"残時間"',
        '"基準時間"',
        '"失効日"',
        '"事柄"',
        '"名前"',
        '"申請名"',
        '"消化数chk"',
        '"勤怠有休ID"'
    ];
    var value = '';
    for(var i = 0 ; i < this.folder.emps.length ; i++){
        var emp = this.folder.emps[i];
        var yp = this.folder.empYuq[emp.Id];
        var yc = this.folder.empYuqDetail[emp.Id];
        if(!yp || !yc){
            continue;
        }
        var v = new teasp.verify.VerEmpYuq(yp, yc);
        var ym = v.getYuqMap();
        if(!ym.mix){
            continue;
        }
        if(ym.mix.length > 0){
            var fx = '';
            fx += '"' + (emp.DeptId__r ? emp.DeptId__r.DeptCode__c : '') + '"';
            fx += ',"' + (emp.DeptId__r ? emp.DeptId__r.Name : '') + '"';
            fx += ',"' + emp.EmpTypeId__r.Name + '"';
            fx += ',"' + teasp.util.date.formatDate(emp.EntryDate__c) + '"';
            fx += ',"' + teasp.util.date.formatDate(emp.EndDate__c) + '"';
            fx += ',"' + (emp.EmpCode__c || '') + '"';
            fx += ',"' + (emp.Name || '') + '"';
            for(var j = 0 ; j < ym.mix.length ; j++){
                var val = fx;
                var o = ym.mix[j];
                if(o.TotalTime__c >= 0){
                    val += ',"' + o.StartDate__c + '"';
                    val += ',"' + o._obj.getDays() + '"';
                    val += ',"' + o._obj.getHoursF() + '"';
                    val += ',"' + o._tag + '"';
                    val += ',""';
                    val += ',""';
                    val += ',""';
                    val += ',"' + o._zan.getDays() + '"';
                    val += ',"' + o._zan.getHoursF() + '"';
                    val += ',"' + o._bt + '"';
                    val += ',"' + o.LimitDate__c + '"';
                }else{
                    val += ',"' + o.Date__c + '"';
                    val += ',""';
                    val += ',""';
                    val += ',""';
                    val += ',"' + o._obj.getDays() + '"';
                    val += ',"' + o._obj.getHoursF() + '"';
                    val += ',"' + o._tag + '"';
                    val += ',"' + o._zan.getDays() + '"';
                    val += ',"' + o._zan.getHoursF() + '"';
                    val += ',"' + o._bt + '"';
                    val += ',"-"';
                }
                val += ',"' + (o.Subject__c || '') + '"';
                val += ',"' + o.Name + '"';
                val += ',"' + o._empApplyName + '"';
                val += ',' + (o._spendCheck || '');
                val += ',"' + (o._limit ? '' : o.Id) + '"';
                value += val;
                value += '\r\n';
            }
        }
    }
    teasp.manager.dialogClose('BusyWait');
    var fname = 'emp-yuqhistory.csv';
    if((dojo.isChrome || dojo.isFF) && typeof(Blob) !== "undefined"){
        var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        var blob = new Blob([bom, heads.join(',') + '\r\n' + value], { "type" : "text/csv" });
        var url = (window.URL || window.webkitURL).createObjectURL(blob);

        var a = dojo.query('#queryDownload > a')[0];
        dojo.setAttr(a, 'href', url);
        dojo.setAttr(a, 'download', fname);
        dojo.style(dojo.byId('queryDownload'), 'display', '');
    }else{
        this.inputDownload(heads.join(','), value, fname);
    }
};

var getHolidayApplyDays = function(o){
    var yq = null;
    if(o.EmpApplyId__r && o.EmpApplyId__r.HolidayId__r){
        var rg = parseInt(o.EmpApplyId__r.HolidayId__r.Range__c, 10);
        if(rg == 1){
            var sd = teasp.logic.convert.valDate(o.EmpApplyId__r.StartDate__c);
            var ed = teasp.logic.convert.valDate(o.EmpApplyId__r.EndDate__c);
            var exd = (o.EmpApplyId__r.ExcludeDate__c || '').split(/:/);
            var ex = 0;
            for(var j = 0 ; j < exd.length ; j++){
                if(exd[j].length > 0){
                    ex++;
                }
            }
            var l = teasp.util.date.getDateList(sd, ed);
            var m = l.length - ex;
            yq = new teasp.logic.YuqDays(o.BaseTime__c, o.BaseTime__c * m);
        }else if(rg == 2 || rg == 3){
            yq = new teasp.logic.YuqDays(o.BaseTime__c, o.BaseTime__c * 0.5);
        }else{
            yq = new teasp.logic.YuqDays(o.BaseTime__c, o.TotalTime__c); // チェックしない
        }
    }
    return yq;
};

//-------------------------------------------------
// js/src/verify/VerEmpYuq.js から抜粋（一部変更）
//-------------------------------------------------
if(!teasp.verify){
    teasp.verify = {};
}
/**
 *
 */
teasp.verify.VerEmpYuq = function(yuqs, yuqDetails){
    this.yuqs = yuqs;
    this.yuqDetails = yuqDetails;
    this.yuqMap = null;
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
    var limitNo = 0;   // 失効レコードのID生成用
    var tagM = {};     // 付与レコードのマップ
    var minusSum = {}; // 消化レコードのマップ
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
                y._applyDays = getHolidayApplyDays(y);
                var o = minusSum[y.Id];
                if(o === undefined){
                    o = minusSum[y.Id] = new teasp.logic.YuqDays(y.BaseTime__c, Math.abs(z.time));
                }else{
                    o.append(y._obj);
                }
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
            var o = minusSum[ox.Id];
            if(o && ox._applyDays){
                ox._spendCheck = (o.getAllMinutes() == ox._applyDays.getAllMinutes() ? '○' : '×');
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

//-------------------------------------------------
// js/src/logic/YuqDays.js から抜粋（一部変更）
//-------------------------------------------------
teasp.logic.YuqDays = function(bt, mt){
    this.mix = true;
    this.setValue((bt || 0), (mt || 0));
};

teasp.logic.YuqDays.prototype.setValue = function(bt, mt){
    this.baseTime = bt;
    var hbt = (this.baseTime ? (this.baseTime / 2) : 0);
    this.days = ((hbt && mt >= hbt) ? Math.floor(mt / hbt) / 2 : 0);
    this.minutes = (hbt ? (mt % hbt) : 0);
    if(this.minutes && (this.minutes % 60) > 0 && this.days > 0 && (hbt % 60) > 0){
        this.days -= 0.5;
        this.minutes += hbt;
    }
};

teasp.logic.YuqDays.prototype.append = function(yq){
    if(this.baseTime == 0){
        this.baseTime = yq.getBaseTime();
    }
    if(!this.mix || this.baseTime != yq.getBaseTime()){
        this.mix = false;
        this.days += yq.getDays();
        this.minutes += yq.getMinutes();
    }else{
        this.setValue(this.baseTime, ((this.days + yq.getDays()) * this.baseTime + (this.minutes + yq.getMinutes())));
    }
};

teasp.logic.YuqDays.prototype.subtract = function(yq){
    if(!this.baseTime){
        return;
    }
    var z = this.getAllMinutes() - yq.calcMinutesByBaseTime(this.baseTime);
    if(z < 0){
        z = 0;
    }
    this.setValue(this.baseTime, z);
};

teasp.logic.YuqDays.prototype.calcMinutesByBaseTime = function(bt){
    return (bt * this.days) + this.minutes;
};

teasp.logic.YuqDays.prototype.format = function(){
    var d = this.days;
    var t = this.minutes;
    if(!d && !t){ return '0'; }
    if(!t){ return '' + d; }
    if(!d){ return teasp.util.time.timeValue(t); }
    return '' + d + '+' + teasp.util.time.timeValue(t);
};

teasp.logic.YuqDays.prototype.getDays       = function(){ return this.days; };
teasp.logic.YuqDays.prototype.getMinutes    = function(){ return this.minutes; };
teasp.logic.YuqDays.prototype.getHours      = function(){ return (this.minutes ? this.minutes / 60 : 0); };
teasp.logic.YuqDays.prototype.getBaseTime   = function(){ return this.baseTime; };
teasp.logic.YuqDays.prototype.getAllMinutes = function(){ return this.calcMinutesByBaseTime(this.baseTime); };
teasp.logic.YuqDays.prototype.getHoursF     = function(){ return teasp.util.time.timeValue(this.minutes || 0); };
