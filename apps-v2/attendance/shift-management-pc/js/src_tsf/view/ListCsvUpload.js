/**
 * CSVインポート画面
 *
 * @constructor
 */
teasp.Tsf.ListCsvUpload = function(listType){
    this.listType = listType;
};

teasp.Tsf.ListCsvUpload.prototype = new teasp.Tsf.ListBase();

/**
 * 初期化
 *
 */
teasp.Tsf.ListCsvUpload.prototype.init = function(){
};

teasp.Tsf.ListCsvUpload.prototype.refresh = function(){
    if(!this.fp){
        return;
    }
};

teasp.Tsf.ListCsvUpload.prototype.getArea = function(){
    return teasp.Tsf.Dom.byId('printExpView');
};
