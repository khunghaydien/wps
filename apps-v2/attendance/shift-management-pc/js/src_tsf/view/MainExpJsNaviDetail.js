/**
 * J'sNAVI請求データメイン画面
 *
 * @constructor
 */
teasp.Tsf.MainExpJsNaviDetail = function(){
    this.titleCss = 'exp-jsnavi';
};

teasp.Tsf.MainExpJsNaviDetail.prototype = new teasp.Tsf.MainBase();

teasp.Tsf.MainExpJsNaviDetail.prototype.init = function(){
    teasp.Tsf.MainBase.prototype.init.call(this);
};

teasp.Tsf.MainExpJsNaviDetail.prototype.initEnd = function(areaEl){
};

/**
 * 共通ヘッダ
 *
 * @returns {Object}
 */
teasp.Tsf.MainExpJsNaviDetail.prototype.createCommonHeader = function(){
	return '';
};
