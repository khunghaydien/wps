/**
 * 時刻入力補助
 *
 * @constructor
 */
teasp.Tsf.Time = function(){
};

teasp.Tsf.Time.eventInput = function(dom, inp, hkey){
    dom.connect(inp, 'blur', null, function(e){
        teasp.util.time.onblurTime(e);
    }, hkey);
    dom.connect(inp, 'onkeypress', null, function(e){
        teasp.util.time.onkeypressTime(e);
    }, hkey);
};
