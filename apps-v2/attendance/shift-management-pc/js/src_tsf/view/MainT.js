/**
 * タイムレポート経費精算エリア用
 *
 * @constructor
 */
teasp.Tsf.MainT = function(){
    this.titleCss = 'exp-apply';
};

teasp.Tsf.MainT.prototype = new teasp.Tsf.MainBase();

teasp.Tsf.MainT.prototype.init = function(){
    this.domHelper = new teasp.Tsf.Dom();

    // 日付選択ダイアログを用意
    this.calendarDialog = new teasp.Tsf.Calendar();
    this.calendarDialog.eventCloseCalendar(this.domHelper, teasp.Tsf.ROOT_AREA_ID, 'ts-form-cal');
};

/**
 * 新規作成選択時のポップアップメニュー情報
 *
 * @returns {Array.<Object>}
 */
teasp.Tsf.MainT.prototype.getViewConfig = function(){
    return [];
};

teasp.Tsf.MainT.prototype.beforeUnload = function(e){
};

/**
 * フォーム共通ヘッダ
 *
 * @returns {Object}
 */
teasp.Tsf.MainT.prototype.createFormHeader = function(){
    return null;
};

/**
 * フォーム共通フッタ
 * @returns {Object}
 */
teasp.Tsf.MainT.prototype.createFormFooter = function(){
    return null;
};
