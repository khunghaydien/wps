/**
 * 事前申請印刷画面
 *
 * @constructor
 */
teasp.Tsf.ListExpPrint = function(listType){
    this.listType = listType;
};

teasp.Tsf.ListExpPrint.prototype = new teasp.Tsf.ListBase();

/**
 * 初期化
 *
 */
teasp.Tsf.ListExpPrint.prototype.init = function(){
};

teasp.Tsf.ListExpPrint.prototype.refresh = function(){
    if(!this.fp){
        return;
    }
};

teasp.Tsf.ListExpPrint.prototype.getArea = function(){
    return teasp.Tsf.Dom.byId('printExpView');
};
