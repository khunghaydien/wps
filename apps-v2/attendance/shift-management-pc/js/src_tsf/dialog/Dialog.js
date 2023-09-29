/**
 * ダイアログ
 *
 * @constructor
 */
teasp.Tsf.Dialog = function(){
};

teasp.Tsf.Dialog.createButton = function(domHelper, label, css, el){
    var button = domHelper.create('button', { className: css }, el);
    teasp.Tsf.Dom.append(button, domHelper.create('div', { innerHTML: label }));
    return button;
};
