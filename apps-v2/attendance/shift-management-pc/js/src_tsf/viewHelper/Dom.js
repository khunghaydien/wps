/**
 * Dom 関連
 * dojo をラップする
 *
 * @constructor
 */
teasp.Tsf.Dom = function(){
    this.eventHandles = {};
    this.comboBoxes   = {};
    this.menus        = {};
    this.tooltips     = {};
};

teasp.Tsf.Dom.init = function(){
    require([
         "dojo/date/locale",
         "dojo/window",
         "dojo/store/Memory",
         "dijit/Tooltip",
         "dijit/TooltipDialog",
         "dijit/Menu",
         "dijit/Calendar",
         "dijit/Dialog",
         "dijit/form/ComboBox"
    ]);

    dojo.addClass(document.body, "claro");
    dojo.style(dojo.body(),{ fontSize:'13px' });
};

teasp.Tsf.Dom.byId = function(id){
    return dojo.byId(teasp.Tsf.Dom.cleanId(id));
};

teasp.Tsf.Dom.query = function(selector, context){
    return dojo.query(selector, context);
};

teasp.Tsf.Dom.node = function(selector, context){
    var el = dojo.query(selector, context);
    return (el && el.length ? el[0] : null);
};

teasp.Tsf.Dom.append = function(parent, child){
    if(!child){
        return;
    }
    if(dojo.isArray(child)){
        dojo.forEach(child, function(c){
            this.appendChild(c);
        }, parent);
    }else{
        parent.appendChild(child);
    }
};

teasp.Tsf.Dom.hitch = function(thisObj, method){
    return dojo.hitch(thisObj, method);
};

teasp.Tsf.Dom.style = function(selector, name, value){
    dojo.query(selector).style(name, value);
};

teasp.Tsf.Dom.setAttr = function(selector, name, value){
    dojo.query(selector).forEach(function(el){
        dojo.setAttr(el, name, value);
    });
};

teasp.Tsf.Dom.setAttr2 = function(selector, context, name, value){
    dojo.query(selector, context).forEach(function(el){
        dojo.setAttr(el, name, value);
    });
};

teasp.Tsf.Dom.getAttr = function(el, name){
    return dojo.getAttr(el, name);
};

teasp.Tsf.Dom.html = function(selector, context, value){
    dojo.query(selector, context).forEach(function(el){
        el.innerHTML = value || '';
    });
};

teasp.Tsf.Dom.empty = function(node){
    if(!node){
        return;
    }
    if(typeof(node) == 'string'){
        node = teasp.Tsf.Dom.cleanId(node);
    }
    return dojo.empty(node);
};

teasp.Tsf.Dom.destroy = function(node){
    if(typeof(node) == 'string'){
        node = teasp.Tsf.Dom.cleanId(node);
    }
    return dojo.destroy(node);
};

teasp.Tsf.Dom.nextSibling = function(el){
    if(el.nextElementSibling){
        return el.nextElementSibling;
    }
    do {
        el = el.nextSibling;
    } while (el && el.nodeType !== 1);
    return el;
};

teasp.Tsf.Dom.previousSibling = function(el){
    if(el.previousElementSibling){
        return el.previousElementSibling;
    }
    do {
        el = el.previousSibling;
    } while (el && el.nodeType !== 1);
    return el;
};

teasp.Tsf.Dom.isVisible = function(node){
    return (dojo.style(node, 'display') != 'none');
};

teasp.Tsf.Dom.show = function(selector, context, flag){
    if(selector){
        dojo.query(selector, context).forEach(function(el){
            dojo.style(el, 'display', (flag ? "" : "none"));
        });
    }
};

teasp.Tsf.Dom.style = function(node, name, value){
    dojo.style(node, name, value);
};

teasp.Tsf.Dom.hasClass = function(node, classStr){
    return dojo.hasClass(node, classStr);
};

teasp.Tsf.Dom.toggleClass = function(node, classStr, condition){
    return dojo.toggleClass(node, classStr, condition);
};

teasp.Tsf.Dom.addClass = function(node, classStr){
    return (node ? dojo.addClass(node, classStr) : null);
};

teasp.Tsf.Dom.place = function(node, refNode, position){
    return dojo.place(node, refNode, position);
};

teasp.Tsf.Dom.disconnect = function(handle){
    dojo.disconnect(handle);
};

teasp.Tsf.Dom.toDom = function(frag){
    return dojo.toDom(frag);
};

teasp.Tsf.Dom.cleanId = function(id){
    return (id.substring(0, 1) == '#' ? id.substring(1) : id);
};

teasp.Tsf.Dom.getAncestorByTagName = function(el, tagName){
    var pel = null;
    var p = el;
    while(p != null && p.tagName != 'BODY'){
        if(p.tagName == tagName){
            pel = p;
            break;
        }
        p = p.parentNode;
    }
    return pel;
};

teasp.Tsf.Dom.getAncestorByCssName = function(el, cssName){
    var pel = null;
    var p = el;
    while(p != null && p.tagName != 'BODY'){
        if(dojo.hasClass(p, cssName)){
            pel = p;
            break;
        }
        p = p.parentNode;
    }
    return pel;
};

teasp.Tsf.Dom.setDigitValue = function(id, value){
    var d = dijit.byId(id);
    if(d){
        d.setValue(value);
    }
};

/**
 * @param {Array.<Object>} data
 * @returns {dojo.store.Memory}
 */
teasp.Tsf.Dom.createStoreMemory = function(data){
    var n = 0;
    dojo.forEach(data, function(o){
        o.score = ++n;
    });
    return new dojo.store.Memory({ data: data, idProperty: 'name' });
};

/**
 *
 * @param {dojo.store.Memory} memory
 * @param {Array.<Object>} data
 */
teasp.Tsf.Dom.setStoreMemory = function(memory, data){
    if(data && data.length > 0){
        var n = 0;
        var mp = {};
        dojo.forEach(data, function(o){
            if(!mp[o.code]){
                o.score = ++n;
                mp[o.code] = 1;
            }
        });
        for(var i = data.length - 1 ; i >= 0 ; i--){
            if(!data[i].score){
                data.splice(i, 1);
            }
        }
        memory.data = data;
    }
};

//--------------------------------------------------------------------
/**
 *
 * @param {string=} hkey
 * @returns {string}
 */
teasp.Tsf.Dom.prototype._mem = function(hmap, hkey, ph){
    var hk = (hkey || '_DEFAULT');
    if(!hmap[hk]){
        hmap[hk] = [];
    }
    if(teasp.Tsf.util.isArray(ph)){
        hmap[hk] = hmap[hk].concat(ph);
    }else{
        hmap[hk].push(ph);
    }
    return ph;
};

teasp.Tsf.Dom.prototype._disconnect = function(hmap, hkey){
    if(hmap[hkey]){
        dojo.forEach(hmap[hkey], function(h){
            dojo.disconnect(h);
        });
        delete hmap[hkey];
    }
};

teasp.Tsf.Dom.prototype._destroy = function(hmap, hkey){
    if(hmap[hkey]){
        dojo.forEach(hmap[hkey], function(h){
            h.destroy(true);
        });
        delete hmap[hkey];
    }
};

teasp.Tsf.Dom.prototype.freeBy = function(hkey){
    this._disconnect(this.eventHandles, hkey);
    this._destroy(this.comboBoxes, hkey);
    this._destroy(this.menus     , hkey);
    this._destroy(this.tooltips  , hkey);
};

teasp.Tsf.Dom.prototype.free = function(){
    var hkey = null;
    for(hkey in this.eventHandles){
        this._disconnect(this.eventHandles, hkey);
    }
    for(hkey in this.comboBoxes){
        this._destroy(this.comboBoxes, hkey);
    }
    for(hkey in this.menus){
        this._destroy(this.menus, hkey);
    }
    for(hkey in this.tooltips){
        this._destroy(this.tooltips, hkey);
    }
    this.eventHandles = {};
    this.comboBoxes   = {};
    this.menus        = {};
    this.tooltips     = {};
};

teasp.Tsf.Dom.prototype.connect = function(target, event, context, method, hkey){
    var obj = target;
    if(typeof(obj) == 'string'){
        obj = dojo.byId(obj);
    }
    if(dojo.isArray(obj)){
        var lst = [];
        dojo.forEach(obj, function(el){
            lst.push(dojo.connect(el, event, context, method));
        }, this);
        return (lst.length > 0 ? this._mem(this.eventHandles, hkey, lst) : []);
    }else if(obj){
        return this._mem(this.eventHandles, hkey, dojo.connect(obj, event, context, method));
    }
};

teasp.Tsf.Dom.prototype.create = function(tag, attrs, refNode, pos){
    return dojo.create(tag, attrs, refNode, pos);
};

teasp.Tsf.Dom.prototype.createMenu = function(targets, menus, hkey){
    var p = new dijit.Menu({
        targetNodeIds   : targets,
        leftClickToOpen : true,
        refocus         : false
    });
    dojo.forEach(menus, function(item){
        if(item.separator){
            p.addChild(new dijit.MenuSeparator());
        }else{
            p.addChild(new dijit.MenuItem({
                label     : item.name,
                onClick   : item.method,
                disabled  : (item.disabled || false)
            }));
        }
    });
    p.startup();
    return this._mem(this.menus, hkey, p);
};

/**
 * コンボボックス作成
 *
 * @param {Object} obj
 * @param {string} id
 * @returns {dijit.form.ComboBox}
 */
teasp.Tsf.Dom.prototype.createComboBox = function(obj, id, hkey){
    var cb = new dijit.form.ComboBox(obj, id);
    cb.startup();
    return this._mem(this.comboBoxes, hkey, cb);
};

teasp.Tsf.Dom.prototype.createTooltip = function(obj, hkey){
    var p = new dijit.Tooltip(obj);
    p.startup();
    return this._mem(this.tooltips, hkey, p);
};

//--------------------------------------------------------------------
/**
 * イベントを発生させる
 *
 * @param {Object} el
 * @param {string} key
 */
teasp.Tsf.Dom.pushEvent = function(el, key){
    // 強制的にイベントを呼び出す
    if(el.fireEvent && dojo.isIE <= 8){ // for IE
        el.fireEvent(key);
    }else{ // for Firefox, Chrome, Safari
        var v = ({
            "onclick" : "click"
        }[key] || key);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent(v, false, true);
        el.dispatchEvent(evt);
    }
};

//--------------------------------------------------------------------
/**
 * テキストエリアの文字数制限（IE8以下のみ有効）
 *
 * @param {Object} domHelper
 * @param {Array.<Object>} elements
 * @param {Object} fp
 * @param {number} maxLength
 */
teasp.Tsf.Dom.setlimitChars = function(domHelper, elements, fp, maxLength) {
    if(!dojo.isIE || dojo.isIE >= 9){
        return;
    }
    dojo.forEach(elements, function(el){
        if(fp){
            var fc = fp.getFcById(el.id);
            if(fc){
                domHelper.connect(el, 'onkeyup', null, function(e){
                    teasp.Tsf.Dom.limitChars(e.target, fc.getMaxLength());
                });
            }
        }else{
            domHelper.connect(el, 'onkeyup', null, function(e){
                teasp.Tsf.Dom.limitChars(e.target, maxLength);
            });
        }
    });
};

/**
 * テキストエリア内で改行禁止する
 *
 * @param {Object} domHelper
 * @param {Array.<Object>} elements
 * @param {Object} fp
 */
teasp.Tsf.Dom.setLineFeed = function(domHelper, elements, fp) {
    dojo.forEach(elements, function(el){
        var fc = fp.getFcById(el.id);
        if(fc && fc.isNoLf()){ // 改行禁止である
            domHelper.connect(el, 'onkeydown', null, function(e){
                if(e.which == 13){ // 改行文字なら無視する
                    event.preventDefault();
                    return false;
                }
            });
            domHelper.connect(el, 'onblur', null, function(e){
                e.target.value = e.target.value.replace(/\r?\n/g, '');
            });
        }
    });
};

teasp.Tsf.Dom.limitChars = function(node, maxLength) {
    if(node.value.length > maxLength){
        node.value = node.value.substr(0, maxLength);
    }
    node.focus();
};

//--------------------------------------------------------------------
teasp.Tsf.Dom.stringRep = function(str, num){
    return dojo.string.rep(str, num);
};

teasp.Tsf.Dom.getBox = function(){
    return dojo.window.getBox();
};

teasp.Tsf.Dom.clone = function(obj){
    return dojo.clone(obj);
};

/**
 * ウィンドウ内での Y座標を得る
 */
teasp.Tsf.Dom.top = function(el){
    var pos = 0;
    if(el){
        pos = el.offsetTop;
        if(el.offsetParent){
            pos += teasp.Tsf.Dom.top(el.offsetParent);
        }
    }
    return pos;
};

/**
 * UIブロックを表示（要素がなければ作成）
 */
teasp.Tsf.Dom.setUIBlock = function(flag){
    var ubs = dojo.query('.ts-uiblock');
    var ub = (ubs.length ? ubs[0] : null);
    if(!ub){
        ub = dojo.create('div', { className: 'ts-uiblock' }, document.body);
    }
    var box = teasp.Tsf.Dom.getBox();
    var area = dojo.byId('contentWrapper');
    var w = Math.max(box.w, Math.max((area && area.clientWidth)  || 0, document.body.offsetWidth));
    var h = Math.max(box.h, Math.max((area && area.clientHeight) || 0, document.body.offsetHeight));
    dojo.style(ub, 'width'  , w + 'px');
    dojo.style(ub, 'height' , h + 'px');
    dojo.style(ub, 'display', (flag ? '' : 'none'));
};

/**
 * UIブロック＋メッセージ表示パネル表示
 * @param {boolean=} flag
 * @param {{domHelper: Object,
 *          method   : Function,
 *          hkey     : string,
 *          context  : Object,
 *          message  : string,
 *          btnLabel : string}} param
 */
teasp.Tsf.Dom.setBusyPanel = function(flag, param){
    var bps = dojo.query('.ts-busy-panel');
    var bp = (bps.length ? bps[0] : null);
    if(flag){
        var box = teasp.Tsf.Dom.getBox();
        var l = Math.max((box.w - 240) / 2, 0);
        var t = Math.max((box.h -  80) / 2, 0);
        l += (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft || 0;
        t += (document.documentElement && document.documentElement.scrollTop)  || document.body.scrollTop || 0;
        if(!bp){
            bp = dojo.create('div', {
                className: 'ts-busy-panel',
                style    : 'left:' + l + 'px;top:' + t + 'px;'
            }, document.body);
            dojo.create('div', { innerHTML: param.message || '', className: 'busy-message' }, bp); // メッセージ
            dojo.create('div', { innerHTML: param.btnLabel || '' }
                , dojo.create('button', { className: 'std-button1' }, bp));
        }else{
            dojo.style(bp, 'left', l + 'px');
            dojo.style(bp, 'top' , t + 'px');
            var m = teasp.Tsf.Dom.node('button', bp);
            if(m){
                teasp.Tsf.Dom.style(m, 'display', '');
            }
        }
        if(param && param.domHelper && param.method && param.hkey){
            param.domHelper.freeBy(param.hkey);
            dojo.query('button', bp).forEach(function(el){
                param.domHelper.connect(el, 'onclick', param.context, param.method, param.hkey);
            }, this);
        }
    }
    teasp.Tsf.Dom.setUIBlock(flag);
    if(bp){
        dojo.style(bp, 'display', (flag ? '' : 'none'));
    }
};
