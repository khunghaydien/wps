/**
 * 外貨情報
 *
 * @constructor
 */
teasp.Tsf.ForeignCurrency = function(foreign){
    this.obj = foreign;
};

teasp.Tsf.ForeignCurrency.NONE = '---';

/**
 * 部署情報に階層情報を付与してから
 * 部署クラスインスタンスの配列を作成して返す
 *
 * @param {Array.<Object>} ForeignCurrencys
 * @returns {Array.<Object>}
 */
teasp.Tsf.ForeignCurrency.createList = function(foreigns){
    var map = {};
    dojo.forEach(foreigns, function(foreign){
        if(foreign.Name){
            var key = foreign.Name.toLowerCase();
            var o = map[key];
            if(!o){
                o = map[key] = new teasp.Tsf.ForeignCurrency(foreign);
            }
            o.addChild(foreign);
        }
    });
    var keys = [];
    for(var key in map){
        keys.push(key);
    }
    keys = keys.sort(function(a, b){
        return (a < b ? -1 : 1);
    });
    var lst = [];
    lst.unshift(new teasp.Tsf.ForeignCurrency({}));
    for(var i = 0 ; i < keys.length ; i++){
        var key = keys[i];
        var o = map[key];
        o.sortChildren();
        lst.push(o);
    }
    return lst;
};
/**
*
* @returns {string}
*/
teasp.Tsf.ForeignCurrency.prototype.getId = function(){
   return this.obj.Id || '';
};

/**
*
* @returns {string}
*/
teasp.Tsf.ForeignCurrency.prototype.getName = function(){
   return (this.obj.Name || teasp.Tsf.ForeignCurrency.NONE);
};

teasp.Tsf.ForeignCurrency.prototype.addChild = function(foreign){
    if(!this.rates){
        this.rates = [];
    }
    this.rates.push(new teasp.Tsf.ForeignCurrency(foreign));
};

teasp.Tsf.ForeignCurrency.prototype.sortChildren = function(){
    if(!this.rates){
        return;
    }
    this.rates = this.rates.sort(function(a, b){
        return a.compareDate(b.getStartDate());
    });
};

/**
 * 換算レート
 *
 * @returns {number}
 */
teasp.Tsf.ForeignCurrency.prototype.getRateByDate = function(date){
    if(!this.rates){
        return 1;
    }
    var p = null;
    for(var i = 0 ; i < this.rates.length ; i++){
        var rate = this.rates[i];
        if(!rate.getStartDate()
        || rate.compareDate(date) >= 0){
            p = rate;
            break;
        }
    }
    return (p ? p.getRate() : 1);
};

/**
 * 換算レート
 *
 * @returns {string}
 */
teasp.Tsf.ForeignCurrency.prototype.getRate = function(){
    return this.obj.Rate__c || 1;
};

/**
 * よみ
 *
 * @returns {string}
 */
teasp.Tsf.ForeignCurrency.prototype.getYomi = function(){
    return this.obj.Yomi__c || '';
};

/**
 * 日付を比較
 *
 * @returns {number}
 */
teasp.Tsf.ForeignCurrency.prototype.compareDate = function(d){
    var td = this.getStartDate();
    if(!td && d){
        return 1;
    }else if(td && !d){
        return -1;
    }else if(td == d){
        return 0;
    }else{
        return (td < d ? 1 : -1);
    }
};

/**
 * 開始日
 *
 * @returns {string}
 */
teasp.Tsf.ForeignCurrency.prototype.getStartDate = function(){
    if(typeof(this.obj.StartDate__c) == 'number'){
        this.obj.StartDate__c = teasp.util.date.formatDate(this.obj.StartDate__c);
    }
    return this.obj.StartDate__c;
};
