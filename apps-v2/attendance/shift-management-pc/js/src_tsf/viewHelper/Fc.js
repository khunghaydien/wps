/**
 * 項目情報
 *
 * @constructor
 */
teasp.Tsf.Fc = function(field, parent, last){
    this.fc = field;
    this.parent = parent;
    this.last = last;
    this.notUse = (this.fc.notUse || false);
    this.label = null;
    if(this.fc.dispField){
        this.dispFc = new teasp.Tsf.Fc(this.fc.dispField, parent);
    }
    if(this.fc.suffix){
        this.suffixFc = new teasp.Tsf.Fc(this.fc.suffix, parent);
    }
    if(this.fc.premix){
        this.premixFc = new teasp.Tsf.Fc(this.fc.premix, parent);
    }
};

/**
 * teasp.Tsf.Fc クラスのインスタンスの配列を作って返す
 *
 * @static
 * @param {Array.<Object>} fields
 * @returns {Array.<teasp.Tsf.Fc>}
 */
teasp.Tsf.Fc.createList = function(fields, parent){
    var lst = [];
    var fieldCount = fields.length;
    dojo.forEach(fields, function(field, index){
        lst.push(new teasp.Tsf.Fc(field, parent, (index == (fieldCount - 1))));
    });
    return lst;
};

/**
 * オブジェクトをコピー
 *
 * (例)
 *   var dstObj = {};
 *   var srcObj = { EmpId__r : { Name: '山田 太郎', EmpTypeId__r: { Name: '固定' } } };
 *   teasp.Tsf.Fc.setValue(dstObj, srcObj, 'EmpId__r.EmpTypeId__r.Name');
 * → dstObj.EmpId__r.EmpTypeId__r.Name に値がセットされる
 *
 * @param {Object} dstObj
 * @param {Object} srcObj
 * @param {string} dkey
 * @param {string=} skey
 * @returns {Object}
 */
teasp.Tsf.Fc.setObjValue = function(dstObj, srcObj, dkey, skey){
    var dkeys = dkey.split('.');
    var skeys = (skey ? skey.split('.') : dkeys);
    var os = srcObj;
    var od = dstObj;
    for(var i = 0 ; i < skeys.length ; i++){
        if(i >= dkeys.length){
            break;
        }
        var sk = skeys[i];
        var dk = dkeys[i];
        if(os && typeof(os[sk]) !== 'undefined'){
            if(typeof(os[sk]) == 'object'){
                os = os[sk];
                if(!od[dk]){
                    od[dk] = {};
                }
                od = od[dk];
            }else{
                od[dk] = os[sk];
            }
        }else{
            break;
        }
    }
    return dstObj;
};

teasp.Tsf.Fc.setObjSimpleValue = function(obj, key, val){
    var keys = key.split('.');
    var o = obj;
    for(var i = 0 ; i < keys.length ; i++){
        var k = keys[i];
        if(i == (keys.length - 1)){
            o[k] = val;
            break;
        }
        if(!o[k]){
            o[k] = {};
        }
        o = o[k];
    }
    return obj;
};

/**
 * Dom Id を返す
 *
 * @param {string=} key 文字列中に '{0}' があれば置き換える
 * @returns {string|null}
 */
teasp.Tsf.Fc.prototype.getDomId = function(key){
    return teasp.Tsf.util.formatString(this.fc.domId, key);
};

teasp.Tsf.Fc.prototype.getName = function(key){
    return teasp.Tsf.util.formatString(this.fc.name, key);
};

/**
 * このオブジェクトに紐づくノードを返す
 *
 * @param {string=} key
 * @returns {Object}
 */
teasp.Tsf.Fc.prototype.getElement = function(key, context, flag){
    var id = this.getDomId(key);
    if(!id){
        return null;
    }
    if(flag && this.isHiddenPlus()){
        id += 'Hidden';
    }
    if(context){
        return teasp.Tsf.Dom.node('[id="' + id + '"]', context);
    }else{
        return teasp.Tsf.Dom.byId(id);
    }
};

teasp.Tsf.Fc.prototype.getSuffixElement = function(key, context){
    var suffix = this.getSuffix();
    if(!suffix){
        return null;
    }
    var id = this.getDomId(key);
    if(!id){
        return null;
    }
    id += 'Suffix';
    if(context){
        return teasp.Tsf.Dom.node('[id="' + id + '"]', context);
    }else{
        return teasp.Tsf.Dom.byId(id);
    }
};

/**
 * width
 *
 * @param {number=} plus 加算値
 * @returns {string|null}
 */
teasp.Tsf.Fc.prototype.getWidth = function(plus){
    if(typeof(this.fc.width) == 'number'){
        return '' + (this.fc.width + (plus || 0)) + 'px';
    }else{
        return this.fc.width;
    }
};

/**
 * width
 *
 * @returns {string|null}
 */
teasp.Tsf.Fc.prototype.getLw = function(){
    if(typeof(this.fc.lw) == 'number'){
        return '' + this.fc.lw + 'px';
    }else{
        return this.fc.lw;
    }
};

/**
 * テーブルのヘッダの最後の項目の場合、項目幅に縦スクロールバーの幅をプラスする。
 *
 * @returns {number}
 */
teasp.Tsf.Fc.prototype.getWplus = function(){
    return (this.isLast() ? 16 : 0);
};

/**
 * width
 *
 * @param {number=} plus 加算値
 * @returns {number}
 */
teasp.Tsf.Fc.prototype.getWidthNum = function(plus){
    if(typeof(this.fc.width) == 'number'){
        return this.fc.width + this.getWplus();
    }else{
        return 0;
    }
};

/**
 * colSpan に指定する値を返す
 *
 * @returns {number}
 */
teasp.Tsf.Fc.prototype.getHeadSpan = function(){
    return (typeof(this.fc.headSpan) == 'number' ? this.fc.headSpan : 1);
};

/**
 * Apiの項目キー
 *
 * @param {string|number=} n
 * @param {boolean=} flag true なら、domType='children'のときnullを返す
 * @returns {string}
 */
teasp.Tsf.Fc.prototype.getApiKey = function(n, flag){
    if(flag && (this.fc.domType == 'children' || !this.fc.apiKey || this.fc.apiKey.substring(0, 1) == '_')){
        return null;
    }
    if(n !== undefined && n !== null && this.fc.apiName){
        return teasp.Tsf.util.formatString(this.fc.apiName, n);
    }
    return this.fc.apiKey;
};

/**
 * API用の項目か
 *
 * @param {boolean} flag trueならリードオンリーの項目も含める
 * @returns {Boolean}
 */
teasp.Tsf.Fc.prototype.isApiField = function(flag){
    if(this.fc.domType == 'children'){
        return false;
    }
    return (this.fc.apiKey && this.fc.apiKey.substring(0, 1) != '_' && (flag || !this.fc.ro));
};

teasp.Tsf.Fc.setBackground = function(el, o){
    if(!tsfManager.isDiffView()){
        return;
    }
    teasp.Tsf.Dom.toggleClass(el, 'ts-diff-yes', o.difference && !o._removed);
    teasp.Tsf.Dom.toggleClass(el, 'ts-diff-del', !o.difference && o._removed);
    if(o._diffJsNavi){
        teasp.Tsf.Dom.toggleClass(el, 'ts-diff-jsnavi', !o.difference && o._diffJsNavi);
    }
    teasp.Tsf.Dom.toggleClass(el, 'ts-diff-no' , !o.difference && !o._removed);

};

/**
 * 値をDOM要素にセットする
 *
 * @param {teasp.Tsf.Dom} domHelper
 * @param {Object} dataObj
 * @param {string=} key
 * @param {string|Object=} context
 * @param {boolean=} flag
 */
teasp.Tsf.Fc.prototype.drawText = function(domHelper, dataObj, key, context, flag){
    var el = this.getElement(key, context);
    if(!el){
        return;
    }
    var domType = this.getDomType();
    var fv = this.parseValue(dataObj);
    if(fv.premix){
        fv.dispValue = fv.premix + ' ' + fv.dispValue;
    }
    if(dataObj._removed){
        fv._removed = true;
        if(dataObj._diffJsNavi){
        	// J'sNavi用差分フラグ
        	fv._diffJsNavi = true;
        }
    }else if(dataObj.preObj){
        if(this.getApiKey()){
            var p = this.parseValue(dataObj.preObj);
            if(fv.value != p.value){
                fv.difference = true;
            }
        }
    }else if(dataObj._addJsNavi){ // J'sNavi追加明細
        fv.difference = false;
    }else if(dataObj.ExpApplyId__r && dataObj.ExpApplyId__r.ExpPreApplyId__c){ // 追加明細
        fv.difference = true;
    }
    if(domType == 'photo'){
        if(fv.value){
            domHelper.create('img', { src: fv.value }, el);
        }
    }else if(domType == 'route'){
        if(dataObj._route){
            teasp.Tsf.Dom.empty(el);
            if(this.parent.getType() != 'table'){
                teasp.Tsf.Fc.setBackground(el, fv);
            }
            teasp.Tsf.Dom.append(el, dataObj._route.getExpContent(domHelper, key, dataObj.preObj));
        }
    }else if(domType == 'status'){
        el.title = teasp.constant.getDisplayStatus(fv.value || '');
        if(/^(承認|確定)済み$/.test(fv.value)){
            el.className = 'ts-status-img ts-s-approve';
        }else if(fv.value == '精算済み'){
            el.className = 'ts-status-img ts-s-paid';
        }else if(fv.value == '承認待ち'){
            el.className = 'ts-status-img ts-s-wait';
        }else if(fv.value == '却下'){
            el.className = 'ts-status-img ts-s-reject';
        }else if(/^(申請|確定)取消$/.test(fv.value)){
            el.className = 'ts-status-img ts-s-remove';
        }else if(fv.value == '取消伝票承認待ち'){
            el.className = 'ts-status-img ts-s-cancel-wait';
        }else if(fv.value == '取消伝票承認済み'){
            el.className = 'ts-status-img ts-s-cancel-approve';
        }else if(fv.value == '仕訳済み'){
            el.className = 'ts-status-img ts-s-journal';
        }else if(fv.spec){
            el.className = 'ts-status-img ts-s-none';
        }
    }else if(domType == 'radio'){
        teasp.Tsf.Dom.query('input[type="radio"]', el).forEach(function(inp){
            if(inp.value == fv.value){
                inp.checked = true;
            }
            inp.disabled = this.isReadOnly();
        }, this);
    }else if(domType == 'children'){ // 添付ファイルで !hidden
        if(fv.value){
            if(el.tagName == 'INPUT'){
                el.value = fv.value;
            }else{
                domHelper.create('div', { className: 'pp_ico_receipt_r' }, el); // 添付アイコン
                var d = teasp.Tsf.Dom.nextSibling(el);
                if(d){
                    d.value = fv.value;
                }
            }
        }
    }else if(this.isReadOnly() && el.tagName != 'INPUT' && el.tagName != 'SELECT'){
        if(this.isCheck() && this.isTable() && dataObj.Id){
            if(el.firstChild){
                teasp.Tsf.Dom.destroy(el.firstChild);
            }
            if(!dataObj._removed){
                if(this.isRadio()){
                    if(!dataObj.noChoose){
                        domHelper.create('input', { type: 'radio', name: this.getRadioName(), className: 'ts-check' }, el);
                    }
                }else if(fv.checky){
                    domHelper.create('input', { type: 'checkbox', className: 'ts-check' }, el);
                }
                if(dataObj.noChoosePlus){
                    domHelper.create('div', {
                        className: dataObj.noChoosePlus.className || '',
                        title    : dataObj.noChoosePlus.title || ''
                    }, el);
                }
            }
        }else{
            teasp.Tsf.Dom.empty(el);
            if(this.getApiKey() == '_stepStatus'){
                fv.dispValue = teasp.message.getLabel('approvalHistory_label'); // 承認履歴
            }
            if(dataObj.uncertain && dataObj.uncertain[this.getApiKey()]){ // 不確実項目に含まれていたら、何も表示しない
                el.innerHTML = '';
            }else if(this.isLink() && fv.dispValue && !dataObj._removed){
                domHelper.create('a', { href:'javascript:void(0);', innerHTML: teasp.Tsf.util.entitizg(fv.dispValue) }, el);
            }else if(typeof(fv.dispValue) == 'boolean'){
                el.innerHTML = (fv.dispValue ? '○' : '');
            }else if(this.getApiKey() == 'PaymentDay__c' && typeof(fv.dispValue) == 'number'){
                el.innerHTML = (fv.dispValue == '31' ? teasp.message.getLabel('tf10001550') : fv.dispValue + teasp.message.getLabel('day_label')); // 月末 or 日
            }else{
                el.innerHTML = teasp.Tsf.util.entitizg(fv.dispValue, (domType == 'textarea'));
            }
            if(this.parent.getType() != 'table'){
                teasp.Tsf.Fc.setBackground(el, fv);
            }
            if(domType == 'select'){
                var d = teasp.Tsf.Dom.nextSibling(el);
                if(d){
                    d.value = (fv.value || '');
                    var c = teasp.Tsf.Dom.nextSibling(d);
                    if(c){
                        c.value = (fv.nameValue || '');
                    }
                }
            }
        }
    }else if(domType == 'dateRange' || domType == 'dateFrom' || domType == 'currencyRange'){
        var n = 0;
        teasp.Tsf.Dom.query('input', el).forEach(function(inp){
            inp.value = (fv.dispValue[n++] || '');
        });
    }else{
        switch(domType){
        case 'select': // プルダウン
            if(fv.value){
                for(var i = 0 ; i < el.options.length ; i++){
                    if(el.options[i].value == fv.value){
                        break;
                    }
                }
                if(i >= el.options.length && !this.isWeak()){
                    domHelper.create('option', {
                        value       : (fv.value || ''),
                        innerHTML   : teasp.Tsf.util.entitizf(fv.dispValue)
                    }, el);
                }
                if(i < el.options.length || this.isWeak()){
                    el.value = fv.value;
                }
            }else{
                el.value = '';
            }
            var d = teasp.Tsf.Dom.nextSibling(el);
            if(d){
                d.value = (fv.nameValue || '');
            }
            break;
        case 'children':
            el.value = (fv.value || '');
            break;
        default:    // text, textarea, date, time, currency, count
            var v = (flag ? fv.value : fv.dispValue);
            el.value = (typeof(v) == 'number' ? '' + v : (v || ''));
            break;
        }
    }
    if(this.isHiddenPlus()){
        el = this.getElement(key, context, true);
        if(el){
            el.value = fv.value;
        }
    }
    if(fv.suffix){
        el = this.getSuffixElement(key, context);
        if(el){
            el.innerHTML = teasp.Tsf.util.entitizf(fv.suffix);
        }
    }
    if(domType == 'depta'){
        var chk = teasp.Tsf.Dom.node('input[type="checkbox"]', el.parentNode);
        chk.checked = fv.checked;
    }else if(domType == 'deptb'){
        var chk1 = teasp.Tsf.Dom.node('input[type="checkbox"].dept-apply', el.parentNode); // 申請時の部署で検索
        var chk2 = teasp.Tsf.Dom.node('input[type="checkbox"].dept-layer', el.parentNode); // 下位部署も含める
        if(chk1){
            chk1.checked = fv.checkDeptApply;
        }
        if(chk2){
            chk2.checked = fv.checkDeptLayer;
        }
    }
};

/**
 *
 * @param {teasp.Tsf.Dom} domHelper
 * @param {string=} key
 * @param {string} value
 */
teasp.Tsf.Fc.prototype.textOut = function(domHelper, key, value){
    var d = this.getElement(key);
    if(!d){
        return;
    }
    if(d.tagName == 'INPUT' || d.tagName == 'SELECT' || d.tagName == 'TEXTAREA'){
        if(d.type == 'checkbox'){
            d.checked = value;
        }else{
            d.value = value;
        }
    }else{
        d.innerHTML = teasp.Tsf.util.entitizf(value);
    }
};

/**
 * オブジェクトからAPIキーの値を取得
 *
 * @param {Object} dataObj
 * @param {string=} optKey
 * @param {string=} codeKey
 * @returns {*}
 */
teasp.Tsf.Fc.prototype.parseSimple = function(dataObj, optKey, codeKey){
    var v = null;
    var spec = false;
    var apiKey = (codeKey || optKey || this.getApiKey());
    if(apiKey){
        var keys = apiKey.split('.');
        v = dataObj;
        for(var i = 0 ; i < keys.length ; i++){
            var k = keys[i];
            if(v && typeof(v[k]) !== 'undefined'){
                if(i == (keys.length - 1)){
                    spec = true;
                }
                v = v[k];
            }else{
                v = null;
                break;
            }
        }
    }
    if(!v && !optKey && this.getOptKey()){
        var o = this.parseSimple(dataObj, this.getOptKey());
        o.checked = true;
        return o;
    }
    if(this.getDomType() == 'deptb'){
        var compo = (dataObj.composite && dataObj.composite[this.getApiKey()]) || {};
        if(dojo.isArray(compo)){
        	compo = compo[0];
        }
        return {
            value   : v,
            spec    : spec,
            checkDeptApply: this.getCompositeCheck('checkDeptApply', compo.checkDeptApply), // 申請時の部署で検索
            checkDeptLayer: this.getCompositeCheck('checkDeptLayer', compo.checkDeptLayer)  // 下位部署も含める
        };
    }
    if(!codeKey && this.getCodeKey()){
        var o = this.parseSimple(dataObj, null, this.getCodeKey());
        return {
            value     : (o.value || '') + (o.value ? this.getDivStr() : '') + (v || ''),
            nameValue : (v || ''),
            spec      : spec
        };
    }
    return {
        value   : v,
        spec    : spec
    };
};

/**
 * オブジェクトからAPIキーの値を取得して表示形式を変換して返す
 *
 * @param {Object} dataObj
 * @returns {Object}
 */
teasp.Tsf.Fc.prototype.parseValue = function(dataObj){
    var o = this.parseSimple(dataObj);
    var v = o.value;
    var res = {};
    var domType = this.getDomType();
    if(this.getSuffixFc()){
        var fv = this.getSuffixFc().parseValue(dataObj);
        res.suffix = fv.dispValue;
    }
    if(this.getPremixFc()){
        var fv = this.getPremixFc().parseValue(dataObj);
        res.premix = fv.dispValue;
    }
    if(domType == 'depta'){
        res.checked = o.checked;
    }else if(domType == 'deptb'){
        res.checkDeptApply = o.checkDeptApply; // 申請時の部署で検索
        res.checkDeptLayer = o.checkDeptLayer; // 下位部署も含める
    }
    if(domType == 'select'){
        if(this.getDispFc()){
            var fv = this.getDispFc().parseValue(dataObj);
            res.value     = (v || this.getDefaultValue() || '');
            res.pickList  = this.getPickList();
            res.dispValue = fv.dispValue;
            if(fv.nameValue){
                res.nameValue = fv.nameValue;
            }
        }else{
            res.value     = (v || this.getDefaultValue() || '');
            res.pickList  = this.getPickList();
            res.dispValue = res.value;
            dojo.forEach(res.pickList, function(pick){
                var t = typeof(pick);
                if(t == 'string' && res.value == pick){
                    res.dispValue = pick || '';
                }else if(res.value == pick.v){
                    res.dispValue = pick.n || '';
                }
            });
        }
        return res;
    }else if(domType == 'date' || domType == 'dateRange' || domType == 'dateFrom'){
        if(teasp.Tsf.util.isArray(v)){
            res.value       = v;
            res.dispValue   = [];
            for(var i = 0 ; i < v.length ; i++){
                var w = v[i];
                if(typeof(w) == 'number'){
                    w = teasp.util.date.formatDate(w);
                }
                res.dispValue.push(teasp.util.date.formatDate(w, (this.getFormat() || 'SLA')));
            }
        }else{
            if(typeof(v) == 'number'){
                v = teasp.util.date.formatDate(v);
            }
            res.value       = v;
            res.dispValue   = teasp.util.date.formatDate(v, (this.getFormat() || 'SLA'));
        }
        return res;
    }else if(domType == 'datetime'){
        if(typeof(v) == 'number'){
            v = teasp.util.date.formatDateTime(v);
        }
        res.value       = v;
        if(this.getDspType() == 'date'){
            res.dispValue   = teasp.util.date.formatDate(v, (this.getFormat() || 'SLA'));
        }else{
            res.dispValue   = (v ? teasp.util.date.formatDateTime(v, (this.getFormat() || 'SLA-HM')) : '');
        }
        return res;
    }else if(domType == 'time'){
        res.value       = v;
        res.dispValue   = (typeof(v) == 'number' ? teasp.util.time.timeValue(v) : v) || '';
        return res;
    }else if(domType == 'currency' || domType == 'currencyRange'){
        if(teasp.Tsf.util.isArray(v)){
            res.value       = v;
            res.dispValue   = [];
            var dec = this.getDecimal();
            for(var i = 0 ; i < v.length ; i++){
                var w = v[i];
                if(dec){
                    res.dispValue.push((w || w === 0) && o.spec ? teasp.util.currency.formatDecimal(w , dec[1], dec[0], true).str : '');
                }else{
                    res.dispValue.push(o.spec ? teasp.Tsf.Currency.formatMoney(w, teasp.Tsf.Currency.V_YEN, false, true) : '');
                }
            }
        }else{
            res.value = v;
            var dec = this.getDecimal();
            if(dec){
                res.dispValue = ((v || v === 0) && o.spec ? teasp.util.currency.formatDecimal(v , dec[1], dec[0], true).str : '');
            }else{
                res.dispValue = (o.spec ? teasp.Tsf.Currency.formatMoney(v, teasp.Tsf.Currency.V_YEN, false, true) : '');
            }
        }
        return res;
    }else if(domType == 'checkbox'){
        res.value       = v;
        res.dispValue   = (v || this.getDefaultValue() || '');
        if((!this.isPiw() && !this.isPaychk() && !dataObj.noChoose)
        || (this.isPiw() && dataObj.piwk)
        || (this.isPaychk() && dataObj.approved)){
            res.checky = true;
        }
        return res;
    }else if(domType == 'status'){
        res.value       = v;
        res.dispValue   = (v || this.getDefaultValue() || '');
        res.spec        = o.spec;
        return res;
    }else if(domType == 'children'){
        res.value       = (v ? teasp.Tsf.util.toJson(v) : null);
        res.dispValue   = 'JSON';
        return res;
    }else if(this.getApiKey() == 'StepStatus'){
        res.value       = v;
        res.dispValue   = teasp.constant.getStepStatus(v) || v;
        if(dataObj.isCancelApply){
            res.dispValue = teasp.message.getLabel('tf10006190', res.dispValue);
        }
        return res;
    }
    res.value       = v;
    if(o.nameValue){
        res.nameValue = o.nameValue;
    }
    if(domType == 'number'){
        res.dispValue   = teasp.util.currency.formatDecimal(v , 0, 0, false).str;
        return res;
    }
    if(typeof(v) == 'number'){
        res.dispValue = v;
    }else{
        res.dispValue   = (v || this.getDefaultValue() || '');
    }
    return res;
};

/**
 * オブジェクトに値をセットする
 *
 * @param {Object} dataObj
 * @param {Object} fv
 * @param {boolean=} flag
 * @returns {*}
 */
teasp.Tsf.Fc.prototype.fillValue = function(dataObj, fv, flag){
    var apiKey = this.getApiKey();
    if(!apiKey){
        if(this.isCheck()){
            dataObj.checked = teasp.Tsf.Fc.combiVal(fv, 'value');
        }
        return dataObj.checked || false;
    }
    if(this.getDomType() == 'depta' && fv[0].checked){
        apiKey = this.getOptKey();
    }
    var keys = apiKey.split('.');
    var o = dataObj;
    var val = null;
    var vv = teasp.Tsf.Fc.combiVal(fv, 'value');
    for(var i = 0 ; i < keys.length ; i++){
        var k = keys[i];
        if(!vv && flag && i == (keys.length - 2)){
            // ChargeDeptId__r.Name に null をセットするとき、
            //   ChargeDeptId__r.Name = null とやるのではなく、
            //   ChargeDeptId__r = null とやりたい場合、ここにくる
            val = o[k] = null;
            break;
        }
        if(i == (keys.length - 1)){
            val = o[k] = vv;
            if(val && this.getDomType() == 'children'){
                val = o[k] = teasp.Tsf.util.fromJson(val);
            }
            break;
        }
        if(!o[k]){
            o[k] = {};
        }
        o = o[k];
    }
    if(this.getDispFc()){
        this.getDispFc().fillValue(dataObj, { value: teasp.Tsf.Fc.combiVal(fv, (this.getDispFc().getCodeKey() ? 'nameValue' : 'dispValue')) }, true);
    }
    return val;
};

/**
 * 第１引数のオブジェクトのキー値を返す.<br/>
 * オブジェクトが配列だったら、配列内の各オブジェクトのキー値を返す
 *
 * @param {Object|Array.<Object>} obj
 * @param {string} key
 * @returns {*}
 */
teasp.Tsf.Fc.combiVal = function(obj, key){
    if(teasp.Tsf.util.isArray(obj)){
        var lst = [];
        for(var i = 0 ; i < obj.length ; i++){
            lst.push(obj[i][key]);
        }
        return (lst.length > 1 ? lst : (!lst.length ? null : lst[0]));
    }else{
        return obj[key];
    }
};

/**
 * DOM要素から値を取得
 *
 * @param {string} key
 * @returns {Object}
 */
teasp.Tsf.Fc.prototype.fetchValue = function(key, flag){
    var lst = this.fetchValues(key, flag);
    return lst[0];
};

teasp.Tsf.Fc.prototype.fetchValues = function(key, flag){
    var el = this.getElement(key, null, true);
    var domType = this.getDomType();
    var lz = [{
        dispValue   : null,
        value       : null
    }];
    if(el){
        if(el.tagName == 'INPUT'){
            lz[0].value = (el.type == 'checkbox' ? el.checked : el.value);
        }else if(el.tagName == 'TEXTAREA'){
            lz[0].value = el.value;
        }else if(el.tagName == 'SELECT'){
            if(el.selectedIndex >= 0){
                lz[0].dispValue = el.options[el.selectedIndex].text;
                lz[0].value     = el.options[el.selectedIndex].value;
                var d = teasp.Tsf.Dom.nextSibling(el);
                if(d && d.tagName == 'INPUT'){
                    lz[0].nameValue = (d.value || '');
                }
                if(this.isOptall() && !lz[0].value){
                    lz[0].array = [];
                    for(var i = 0 ; i < el.options.length ; i++){
                        if(el.options[i].value){
                            lz[0].array.push("'" + el.options[i].value + "'");
                        }
                    }
                }
            }
        }else if(domType == 'dateRange' || domType == 'dateFrom' || domType == 'currencyRange'){
            var x = 0;
            teasp.Tsf.Dom.query('input', el).forEach(function(inp){
                lz[x] = {
                    dispValue   : null,
                    value       : null
                };
                lz[x].value = inp.value;
                lz[x].name = inp.name;
                x++;
            });
            domType = (domType == 'dateRange' || domType == 'dateFrom' ? 'date' : 'currency');

        }else if(domType == 'radio'){
            lz[0] = {
                dispValue   : null,
                value       : null
            };
            teasp.Tsf.Dom.query('input', el).forEach(function(inp){
                if(inp.checked){
                    lz[0].dispValue = lz[0].value = inp.value;
                }
            });

        }else if(el.tagName == 'DIV'){
            var a = teasp.Tsf.Dom.node('a', el);
            var ev = (a ? a : el);
            lz[0].value = teasp.Tsf.util.revetize(ev.innerHTML, '');
            lz[0].value = lz[0].value.replace(/&nbsp;/g, '');
            var d = teasp.Tsf.Dom.nextSibling(el);
            if(d && d.tagName == 'INPUT'){
                lz[0].dispValue = lz[0].value;
                lz[0].value = (d.value || '');
                var c = teasp.Tsf.Dom.nextSibling(d);
                if(c && c.tagName == 'INPUT'){
                    lz[0].nameValue = (c.value || '');
                }
            }
        }
    }
    if(domType == 'depta'){
        var chk = teasp.Tsf.Dom.node('input[type="checkbox"]', el.parentNode);
        if(chk){
            lz[0].checked = chk.checked;
        }
    }else if(domType == 'deptb'){
        var chk1 = teasp.Tsf.Dom.node('input[type="checkbox"].dept-apply', el.parentNode); // 申請時の部署で検索
        if(chk1){
            lz[0].checkDeptApply = chk1.checked;
        }
        var chk2 = teasp.Tsf.Dom.node('input[type="checkbox"].dept-layer', el.parentNode); // 下位部署も含める
        if(chk2){
            lz[0].checkDeptLayer = chk2.checked;
        }
    }
    for(var i = 0 ; i < lz.length ; i++){
        var o = lz[i];
        if(o.value){
            if(domType == 'date' || domType == 'dateFrom'){
                o.dispValue = o.value;
                o.value = teasp.util.date.formatDate(o.value) || null;

            }else if(domType == 'datetime'){
                o.dispValue = o.value;
                o.value = teasp.util.date.formatDateTime(o.value) || null;

            }else if(domType == 'time'){
                var t = teasp.util.time.clock2minutes(o.value);
                o.dispValue = o.value;
                o.value = (typeof(t) == 'number' ? t : null);

            }else if(domType == 'number'){
                o.dispValue = o.value;
                var m = teasp.util.currency.string2number(o.value);
                o.value = (m.str ? m.num : null);

            }else if(domType == 'checkbox'){
                if(typeof(o.value) == 'string'){
                    o.value = (o.value.toLowerCase() == 'true' || o.value == '1');
                }

            }else if(domType == 'currency'){
                o.dispValue = o.value;
                var m = teasp.util.currency.string2number(o.value, !this.isPlusOnly());
                o.value = (m.str ? '' + m.num : null);

            }
        }
        if(domType == 'checkbox'){
            o.dispValue = (o.dispValue || false);
            o.value     = (o.value     || false);
        }else if(flag && domType == 'currency'){
            o.dispValue = (!o.dispValue && o.dispValue !== 0 ? null : o.dispValue);
            o.value     = (!o.value && o.value !== 0 ? '0' : o.value);
        }else if(flag && domType == 'number'){
            o.dispValue = (!o.dispValue && o.dispValue !== 0 ? null : o.dispValue);
            o.value     = (!o.value && o.value !== 0 ? 0 : o.value);
        }else{
            o.dispValue = (!o.dispValue && o.dispValue !== 0 ? null : o.dispValue);
            o.value     = (!o.value && o.value !== 0 ? null : o.value);
        }
    }
    return lz;
};

/**
 * 入力欄作成
 *
 * @param {Object} domHelper
 * @param {string|number=} key
 * @param {Object=} parent
 * @returns {Object}
 */
teasp.Tsf.Fc.prototype.createFieldDiv = function(domHelper, key, parent){
    var areaTags = [];
    if(this.getDomType() == 'route'){
    }else if(this.getDomType() == 'tax'){
    }else if(this.getDomType() == 'photo'){
        var area = domHelper.create('div', { className: 'ts-form-photo' });
        var id = this.getDomId(key);
        if(id){
            area.id = id;
        }
        return {
            areaTags    : [area]
        };
    }else if(this.getDomType() == 'dateRange'){
        var area = domHelper.create('div', { className: 'ts-form-date-range', id: this.getDomId(key) });
        var div1 = domHelper.create('div', { className: 'ts-form-date', style: { width: this.getWidth() } }, area);
        var div2 = domHelper.create('div', { className: 'ts-form-icon' }, area);
        var div3 = domHelper.create('div', { className: 'ts-form-wave' }, area);
        var div4 = domHelper.create('div', { className: 'ts-form-date', style: { width: this.getWidth() } }, area);
        var div5 = domHelper.create('div', { className: 'ts-form-icon' }, area);
        var name1 = this.getName() + '1';
        var name2 = this.getName() + '2';
        domHelper.create('input' , { type: 'text', name: name1, maxLength: 10 }, div1);
        domHelper.create('button', { className: 'ts-form-cal', name: name1 }, div2);
        div3.innerHTML = teasp.message.getLabel('wave_label'); // ～
        domHelper.create('input' , { type: 'text', name: name2, maxLength: 10 }, div4);
        domHelper.create('button', { className: 'ts-form-cal', name: name2 }, div5);
        return {
            areaTags    : [area]
        };
    }else if(this.getDomType() == 'dateFrom'){
        var area = domHelper.create('div', { className: 'ts-form-date-range', id: this.getDomId(key) });
        var div1 = domHelper.create('div', { className: 'ts-form-date', style: { width: this.getWidth() } }, area);
        var div2 = domHelper.create('div', { className: 'ts-form-icon' }, area);
        var div3 = domHelper.create('div', { style: { marginTop: '2px', marginLeft: '4px' } }, area);
        var name1 = this.getName() + '1';
        domHelper.create('input' , { type: 'text', name: name1, maxLength: 10 }, div1);
        domHelper.create('button', { className: 'ts-form-cal', name: name1 }, div2);
        div3.innerHTML = teasp.message.getLabel('tk10000350'); //  以降
        return {
            areaTags    : [area]
        };
    }else if(this.getDomType() == 'currencyRange'){
        var area = domHelper.create('div', { className: 'ts-form-currency-range', id: this.getDomId(key) });
        var div1 = domHelper.create('div', { className: 'ts-form-currency', style: { width: this.getWidth() } }, area);
        var div2 = domHelper.create('div', { className: 'ts-form-wave' }, area);
        var div3 = domHelper.create('div', { className: 'ts-form-currency', style: { width: this.getWidth() } }, area);
        domHelper.create('input' , { type: 'text', maxLength: 17 }, div1);
        div2.innerHTML = teasp.message.getLabel('wave_label'); // ～
        domHelper.create('input' , { type: 'text', maxLength: 17 }, div3);
        if(this.isMinus()){
            teasp.Tsf.Dom.query('input', area).forEach(function(el){ teasp.Tsf.Dom.addClass(el, 'ts-minus-ok'); });
        }
        return {
            areaTags    : [area]
        };
    }
    var width = null;
    if(parent && parent.tagName == 'TD'){
        width = '100%';
    }else if(this.fc.width){
        width = this.getWidth();
    }

    var div = domHelper.create('div', {
        className   : 'ts-form-value ts-form-' + this.getDomType(),
        style       : { width: width }
    });
    areaTags.push(div);
    var inp = null;
    if(this.getDomType() == 'radio'){
        inp = div;
        if(this.getPickList()){
            dojo.forEach(this.getPickList(), function(p){
                var label = domHelper.create('label', null, div);
                domHelper.create('input', { type: 'radio', name: this.getName(key), value: p.v }, label);
                label.appendChild(document.createTextNode(' ' + p.n));
            }, this);
        }
    }else if(this.isReadOnly()){
        inp = domHelper.create('div', null, div);
        if(this.getDomType() == 'select'){
            domHelper.create('input', { type: 'hidden' }, div);
            if(this.getDispFc() && this.getDispFc().getCodeKey()){
                domHelper.create('input', { type: 'hidden' }, div);
            }
        }else if(this.getDomType() == 'children'){
            domHelper.create('input', { type: 'hidden' }, div);
        }
    }else{
        switch(this.getDomType()){
        case 'select':  // プルダウン
            inp = domHelper.create('select', null, div);
            this.loadPickList(domHelper, inp);
            if(this.getDispFc() && this.getDispFc().getCodeKey()){
                domHelper.create('input', { type: 'hidden' }, div);
            }
            break;
        case 'checkbox':// チェックボックス
            inp = domHelper.create('input', { type: 'checkbox', style: { marginTop:'4px' } }, div);
            break;
        case 'textarea':// テキストエリア
            inp = domHelper.create('textarea', { style: { height: (this.getHeight() || '40px') } }, div);
            if(this.getMaxLength()){
                inp.maxLength = this.getMaxLength();
            }
            break;
        default:        // text, textarea, date, time, currency, count
            inp = domHelper.create('input', { type: 'text' }, div);
            if(this.getMaxLength()){
                inp.maxLength = this.getMaxLength();
            }
            if(this.isMinus()){
                teasp.Tsf.Dom.addClass(inp, 'ts-minus-ok');
            }
//            if(this.getSelectIn()){
//                dojo.style(inp, 'background-color', '#E9FFFF');
//            }
            break;
        }
    }
    if(inp){
        inp.className = 'ts-form-' + this.getDomType();
        var id = this.getDomId(key);
        if(id){
            inp.id = id;
        }
        var name = this.getName(key);
        if(name){
            inp.name = name;
        }
        if(this.isHiddenPlus()){
            var hidden = domHelper.create('input', { type: 'hidden' });
            if(inp.id){
                hidden.id = inp.id + 'Hidden';
            }
            areaTags.push(hidden);
        }
        if(this.getSuffix()){
            var suffix = domHelper.create('div', { className: 'ts-suffix' });
            if(inp.id){
                suffix.id = inp.id + 'Suffix';
            }
            areaTags.push(suffix);
        }
        if(this.getPlaceholder()){
            teasp.Tsf.Dom.setAttr(inp, 'placeholder', this.getPlaceholder());
        }
        if(this.getSelectIn()){
            teasp.Tsf.Dom.setAttr(inp, 'readOnly', true);
        }
        if(this.getAlign()){
            teasp.Tsf.Dom.style(inp, 'text-align', this.getAlign());
        }
        if(this.getDomType() == 'depta'){
            var label = domHelper.create('label', null, div);
            var chk = domHelper.create('input', { type: 'checkbox' }, label);
            chk.checked = this.isDefaultChk();
            domHelper.create('span' , { innerHTML: ' ' + teasp.message.getLabel('tk10005090') }, label); // 申請時の部署で検索
        }else if(this.getDomType() == 'deptb'){
            var label = domHelper.create('label', null, div);
            var chk = domHelper.create('input', { type:'checkbox', className:'dept-apply' }, label);
            chk.checked = this.getCompositeCheck('checkDeptApply');
            domHelper.create('span' , { innerHTML: ' ' + teasp.message.getLabel('tk10005090') }, label); // 申請時の部署で検索
            domHelper.create('br', null, div);
            label = domHelper.create('label', null, div);
            chk = domHelper.create('input', { type:'checkbox', className:'dept-layer' }, label);
            chk.checked = this.getCompositeCheck('checkDeptLayer');
            domHelper.create('span' , { innerHTML: ' ' + teasp.message.getLabel('tf10010800') }, label); // 下位部署も含める
        }
    }
    return {
        areaTags    : areaTags
    };
};

/**
 * 入力欄作成
 *
 * @param {Object} domHelper
 * @param {Object} div
 * @param {string|number=} key
 * @returns {Object}
 */
teasp.Tsf.Fc.prototype.appendFieldDiv = function(domHelper, div, key){
    if(this.isSkip()){
        return;
    }
    teasp.Tsf.Dom.append(div, this.createFieldDiv(domHelper, key, div).areaTags);
    if(this.getBrowse() && !this.isReadOnly()){
        var p = domHelper.create('button', { className: 'ts-form-' + this.getBrowse() }
            , domHelper.create('div', { className: 'ts-form-icon' }, div)
        );
        if(this.isNoNL()){
            teasp.Tsf.Dom.style(p, 'margin-right', '4px');
        }
    }
};

/**
 * テーブルリストのヘッダセル作成
 *
 * @param {Object} domHelper
 * @param {Object} tr
 * @returns {number} セル数
 */
teasp.Tsf.Fc.prototype.appendFieldHead = function(domHelper, tr){
    if(this.isSkip()){
        return;
    }
    var headSpan = this.getHeadSpan();
    var browse = (this.getBrowse() && !this.isReadOnly());
    if(headSpan && browse){
        headSpan++;
    }
    if(headSpan){
        var wp = (browse ? 24 : 0) + this.getWplus();
        var th = domHelper.create('th', {
            className   : 'ts-form-' + this.getDomType(),
            colSpan     : headSpan,
            style       : { width: this.getWidth(wp) }
        }, tr);
        var div = domHelper.create('div', {
            innerHTML   : this.getLabel()
        }, th);
        if(this.isRequired()){
            domHelper.create('div', { className: 'ts-require' }, div);
        }
        if(this.isCheck() && !this.isRadio()){
            domHelper.create('input', { type: 'checkbox' }, div);
        }
    }
    return headSpan;
};

/**
 * 空行を作成
 *
 * @param {Object} domHelper
 * @param {Object} tr
 */
teasp.Tsf.Fc.prototype.appendFieldEmptyCell = function(domHelper, tr){
    if(this.isSkip()){
        return;
    }
    var style = (this.getWidth() ? { width: this.getWidth() } : null);
    var td = domHelper.create('td', { className: 'ts-form-' + this.getDomType(), style: style }, tr);
    teasp.Tsf.Dom.append(td, this.getFieldEmptyDiv(domHelper, td).areaTags);
    if(this.getBrowse() && !this.isReadOnly()){
        domHelper.create('div', { className: 'ts-form-icon' }
            , domHelper.create('td', { className: 'ts-form-' + this.getBrowse() }, tr)
        );
    }
};

/**
 * 空セル作成
 *
 * @param {Object} domHelper
 * @param {Object} parent
 * @returns {Object}
 */
teasp.Tsf.Fc.prototype.getFieldEmptyDiv = function(domHelper, parent){
    if(this.isSkip()){
        return;
    }
    if(this.getDomType() == 'route'){
        return { areaTags: domHelper.create('div', null) };
    }
    var width = this.getWidth();
    var style = (parent.tagName == 'TD' ? { width: '100%' } : (width ? { width: width } : null));
    return { areaTags: domHelper.create('div', { className: 'ts-form-value ts-form-' + this.getDomType(), style: style }) };
};

/**
 * テーブルリストのボディセル作成
 *
 * @param {Object} domHelper
 * @param {Object} tr
 * @param {string|number=} key
 */
teasp.Tsf.Fc.prototype.appendFieldCell = function(domHelper, tr, key){
    if(this.isSkip()){
        return;
    }
    var style = (this.getWidth() ? { width: this.getWidth() } : null);
    var td = domHelper.create('td', {
        className   : 'ts-form-' + this.getDomType() + (this.isLast() ? ' last' : ''),
        style       : style
    }, tr);
    teasp.Tsf.Dom.append(td, this.createFieldDiv(domHelper, key, td).areaTags);
    if(this.getBrowse() && !this.isReadOnly()){
        domHelper.create('button', { className: 'ts-form-' + this.getBrowse() }
            , domHelper.create('div', { className: 'ts-form-icon' }
                , domHelper.create('td', { className: 'ts-form-' + this.getBrowse() }, tr)
            )
        );
    }
};

teasp.Tsf.Fc.SOBJTYP = {
    'select'    :   'PICKLIST',
    'date'      :   'DATE',
    'datetime'  :   'DATETIME',
    'time'      :   'DOUBLE',
    'text'      :   'STRING',
    'textarea'  :   'STRING',
    'currency'  :   'CURRENCY',
    'number'    :   'DOUBLE',
    'checkbox'  :   'BOOLEAN'
};

/**
 * domType から SObject の型を得る
 *
 * @returns {string}
 */
teasp.Tsf.Fc.prototype.getSObjType = function(){
    return teasp.Tsf.Fc.SOBJTYP[this.getDomType()];
};

teasp.Tsf.Fc.prototype.isSkip = function(){
    if(this.isCheck() && this.parent.isReadOnly()){
        return true;
    }
    return false;
};

teasp.Tsf.Fc.prototype.isReadOnly = function(){
    if(!this.fc.wr && this.isTable()){
        return true;
    }
    return this.fc.ro;
};

teasp.Tsf.Fc.prototype.setReadOnly = function(flag){
    this.fc.ro = flag;
};

teasp.Tsf.Fc.prototype.isTable = function(){
    return (this.parent && (this.parent.getType() == 'table' || this.parent.isReadOnly()));
};

teasp.Tsf.Fc.prototype.isSearchCondition = function(){
    return (this.parent && this.parent.isSearchCondition());
};

teasp.Tsf.Fc.prototype.getDispFc = function(){
    return this.dispFc;
};

teasp.Tsf.Fc.prototype.getSuffixFc = function(){
    return this.suffixFc;
};

teasp.Tsf.Fc.prototype.getPremixFc = function(){
    return this.premixFc;
};

teasp.Tsf.Fc.prototype.isLast = function(){
    return this.last;
};

teasp.Tsf.Fc.prototype.isCheck = function(){
    return this.fc.check;
};

teasp.Tsf.Fc.prototype.isRadio = function(){
    if(!this.fc.check){
        return false;
    }
    return (this.parent && this.parent.getSelType() == 'radio');
};

teasp.Tsf.Fc.prototype.getRadioName = function(){
    return (this.parent && this.parent.getDiscernment()) || 'radio';
};

/**
 *
 * @returns {number}
 */
teasp.Tsf.Fc.prototype.getMatchType = function(){
    return (this.fc.matchType || 0);
};

teasp.Tsf.Fc.prototype.getDataType = function(){
    return (this.fc.dataType || null);
};

/**
 *
 * @returns {string}
 */
teasp.Tsf.Fc.prototype.getLabel = function(){
    if(this.label !== null){
        return this.label;
    }
    if(this.fc.msgId){
        var msg = teasp.message.getLabel(this.fc.msgId);
        if(msg){
            return msg;
        }
    }
    return this.fc.label || '';
};

/**
 * ラベルをセット
 * @param {string|null} label
 */
teasp.Tsf.Fc.prototype.setLabel = function(label){
    if(label !== null){
        this.label = label || '';
    }
};

teasp.Tsf.Fc.prototype.getApiName      = function(){ return this.fc.apiName;      };
teasp.Tsf.Fc.prototype.getDomType      = function(){ return this.fc.domType;      };
teasp.Tsf.Fc.prototype.getDspType      = function(){ return this.fc.dspType;      };
teasp.Tsf.Fc.prototype.getSubType      = function(){ return this.fc.subType;      };
teasp.Tsf.Fc.prototype.isHidden        = function(){ return this.fc.hidden;       };
teasp.Tsf.Fc.prototype.isHiddenPlus    = function(){ return this.fc.hiddenPlus;   };
teasp.Tsf.Fc.prototype.getFix          = function(){ return this.fc.fix;          };
teasp.Tsf.Fc.prototype.getBrowse       = function(){ return this.fc.browse;       };
teasp.Tsf.Fc.prototype.isNoNL          = function(){ return this.fc.noNL;         };
teasp.Tsf.Fc.prototype.getFormat       = function(){ return this.fc.format;       };
teasp.Tsf.Fc.prototype.getAreaKey      = function(){ return this.fc.areaKey;      };
teasp.Tsf.Fc.prototype.getDefaultValue = function(){ return this.fc.defaultValue; };
teasp.Tsf.Fc.prototype.getHeight       = function(){ return this.fc.height;       };
teasp.Tsf.Fc.prototype.isLink          = function(){ return this.fc.link;         };
teasp.Tsf.Fc.prototype.isSortable      = function(){ return this.fc.sortable;     };
teasp.Tsf.Fc.prototype.isPiw           = function(){ return this.fc.piw || false; };
teasp.Tsf.Fc.prototype.isPaychk        = function(){ return this.fc.paychk || false;   };
teasp.Tsf.Fc.prototype.getSelectIn     = function(){ return this.fc.selectIn || 0; };
teasp.Tsf.Fc.prototype.getMaxLength    = function(){ return this.fc.maxLen;         };
teasp.Tsf.Fc.prototype.getColNames     = function(){ return this.fc.colNames || []; };
teasp.Tsf.Fc.prototype.getAlign        = function(){ return this.fc.align || null;  };
teasp.Tsf.Fc.prototype.getSuffix       = function(){ return this.fc.suffix || null; };
teasp.Tsf.Fc.prototype.isNoLf          = function(){ return this.fc.noLf;           };
teasp.Tsf.Fc.prototype.isPlusOnly      = function(){ return this.fc.plusOnly || false; };
teasp.Tsf.Fc.prototype.getOptKey       = function(){ return this.fc.optKey || null; };
teasp.Tsf.Fc.prototype.getOptKeys      = function(){ return this.fc.optKeys || null; };
teasp.Tsf.Fc.prototype.getCodeKey      = function(){ return this.fc.codeKey || null; };
teasp.Tsf.Fc.prototype.getDivStr       = function(){ return this.fc.divStr || teasp.Tsf.JOB_CODE_NAME_DIV; };
teasp.Tsf.Fc.prototype.isDefaultChk    = function(){ return this.fc.defaultChk || false; };
teasp.Tsf.Fc.prototype.isMinus         = function(){ return this.fc.minus || false; };
teasp.Tsf.Fc.prototype.getHeadCss      = function(){ return this.fc.headCss || null; };
teasp.Tsf.Fc.prototype.isNotUse        = function(){ return this.notUse || false; };
teasp.Tsf.Fc.prototype.setNotUse       = function(flag){ this.notUse = flag; };
teasp.Tsf.Fc.prototype.isMinusIsNull   = function(){ return this.fc.minusIsNull || false; };
teasp.Tsf.Fc.prototype.isNullSpec      = function(){ return this.fc.nullspec || false; };
teasp.Tsf.Fc.prototype.isNullPlus      = function(){ return this.fc.nullplus || false; };
teasp.Tsf.Fc.prototype.isDefaultIsTop  = function(){ return this.fc.defaultIsTop || false; };
teasp.Tsf.Fc.prototype.isFindMid       = function(){ return this.fc.findmid || null; };
teasp.Tsf.Fc.prototype.isTargetMask       = function(targetMask){ return !this.fc.mask || this.fc.mask == targetMask; };

/**
 * 部署検索の[申請時の部署で検索]と[下位部署も含める]複合型タイプである
 * @returns {boolean}
 */
teasp.Tsf.Fc.prototype.isComposite = function(){
	return (this.getDomType() == 'deptb');
};

/**
 * 複合型検索条件のキー値を返す。値がなければデフォルト値を返す。
 * @params {string} key キー
 * @params {boolean=} v 値。省略時はデフォルト値を返す。
 * @returns {boolean}
 */
teasp.Tsf.Fc.prototype.getCompositeCheck = function(key, v){
	if(typeof(v) == 'boolean'){
		return v;
	}
	return (key && this.fc.defaultChks && this.fc.defaultChks[key]) || false;
};

/**
 * 選択リストに強制挿入しない
 *
 * @returns
 */
teasp.Tsf.Fc.prototype.isWeak = function(){
    return (this.weak === undefined ? (this.fc.weak || false) : this.weak);
};

teasp.Tsf.Fc.prototype.setWeak = function(flag){
    this.weak = flag;
};

/**
 * 検索条件で「(すべて)」が選択されたとき、全<option> の value（カンマ区切り）を
 * 検索条件とする
 * @returns {boolean}
 */
teasp.Tsf.Fc.prototype.isOptall = function(){
    return this.fc.optall || false;
};

teasp.Tsf.Fc.prototype.getPickList = function(flag){
    if(this._pickList && !flag){
        return this._pickList;
    }
    this._pickList = [];
    var l = this.fc.pickList || [];
    for(var i = 0 ; i < l.length ; i++){
        var o = l[i];
        if(o.msgId){
            o.n = teasp.message.getLabel(o.msgId);
        }
        this._pickList.push(o);
    }
    return this._pickList;
};

teasp.Tsf.Fc.prototype.getPlaceholder = function(){
    if(this.fc.placeholder && typeof(this.fc.placeholder) == 'object' && this.fc.placeholder.msgId){
        this.fc.placeholder = teasp.message.getLabel(this.fc.placeholder.msgId);
    }
    return this.fc.placeholder;
};

teasp.Tsf.Fc.prototype.setPlusOnly = function(flag){
    this.fc.plusOnly = flag;
};

/**
 *
 * @param {Array.<Object>} plst フィルタの配列
 * @param {Array.<Object>} vals value要素を持つオブジェクトの配列
 * @param {string=} optKey OR検索するキー（メソッド内から再帰的に呼ぶ時だけセットする）
 */
teasp.Tsf.Fc.prototype.setFilts = function(plst, vals, optKey){
    var lst = [];
    var domType = this.getDomType();
    var apiKey  = optKey || this.getApiKey();
    if(domType == 'text'
    || domType == 'select'
    || domType == 'depta'
    || domType == 'deptb'
    || domType == 'status'){
        var v = vals[0].value;
        if(this.getSubType() == 'status'){
            var m = /^(.+)以外$/.exec(v);
            var nega = false;
            if(m){
                v = m[1];
                nega = true;
            }
            lst.push({ filtVal: apiKey + (nega ? " != '" : " = '") + v + "'" });
        }else if(this.getSubType() == 'noope'){
            lst.push({ filtVal: apiKey + v });
        }else if(apiKey == '_station'){
            lst.push({ filtVal: "(startName__c like '%" + v + "%' or endName__c like '%" + v + "%')" });
        }else{
            if(domType == 'deptb' &&  (vals[0].checkDeptApply || vals[0].checkDeptLayer)){
                var optKeys = this.getOptKeys();
                if(vals[0].checkDeptApply && !vals[0].checkDeptLayer){ // 申請時の部署で検索
                    lst.push({ filtVal: teasp.message.format(optKeys[0], v) });
                }else if(!vals[0].checkDeptApply && vals[0].checkDeptLayer){ // 下位部署も含める
                    lst.push({ filtVal: teasp.message.format(optKeys[1], v) });
                }else{ // 申請時の部署で検索 ＋ 下位部署も含める
                    lst.push({ filtVal: teasp.message.format(optKeys[2], v) });
                }
            }else{
                if(domType == 'depta' && vals[0].checked){
                    apiKey = this.getOptKey();
                }
                switch(this.getMatchType()){
                case 1:
                    lst.push({ filtVal: apiKey + " like '" + v + "%'" });
                    break;
                case 2:
                    lst.push({ filtVal: apiKey + " like '%" + v + "'" });
                    break;
                case 3:
                    lst.push({ filtVal: apiKey + " like '%" + v + "%'" });
                    break;
                default:
                    if(vals[0].array){
                        lst.push({ filtVal: apiKey + " in (" + vals[0].array.join(',') + ")" });
                    }else if(v == '-1' && this.isMinusIsNull()){
                        lst.push({ filtVal: apiKey + " = null" });
                    }else if(v && this.isNullPlus()){
                        lst.push({ filtVal: "(" + apiKey + " = '" + v + "' or " + apiKey + " = null)" });
                    }else if(v && this.isFindMid()){
                        var sep = this.isFindMid();
                        lst.push({ filtVal: "(" + apiKey + " = '" + v + "' or " + apiKey + " = null or " + apiKey + " like '%" + sep + v + sep + "%')" });
                    }else if(v){
                        lst.push({ filtVal: apiKey + " = '" + v + "'" });
                    }else{
                        lst.push({ filtVal: apiKey + " = null" });
                    }
                }
            }
        }
    }else if(domType == 'dateRange'){
        if(this.getDataType() == 'dateTime'){
            if(vals[0].value){
                lst.push({ filtVal: apiKey + " >= " + teasp.util.date.formatDateTimeTz(vals[0].value, 0) });
            }
            if(vals[1].value){
                lst.push({ filtVal: apiKey + " < " + teasp.util.date.formatDateTimeTz(teasp.util.date.addDays(vals[1].value, 1), 0) });
            }
        }else{
            var fn = [apiKey, apiKey];
            if(apiKey == '_startEnd'){
                fn = this.getColNames();
                if(!vals[1].value){
                    lst.push({ filtVal: fn[1] + " >= " + vals[0].value });
                }else if(!vals[0].value){
                    lst.push({ filtVal: fn[0] + " <= " + vals[1].value });
                }else{
                    var ors = [];
                    for(var i = 0 ; i < 2 ; i++){
                        var ands = [];
                        if(vals[0].value){
                            ands.push(fn[i] + " >= " + vals[0].value);
                        }
                        if(vals[1].value){
                            ands.push(fn[i] + " <= " + vals[1].value);
                        }
                        ors.push('(' + ands.join(' and ') + ')');
                    }
                    lst.push({ filtVal: '(' + ors.join(' or ') + ')' });
                }
            }else{
                if(vals[0].value){
                    lst.push({ filtVal: apiKey + " >= " + vals[0].value });
                }
                if(vals[1].value){
                    lst.push({ filtVal: apiKey + " <= " + vals[1].value });
                }
            }
        }
    }else if(domType == 'dateFrom'){
        if(vals[0].value){
            if(this.getDataType() == 'dateTime'){
                lst.push({ filtVal: apiKey + " >= " + teasp.util.date.formatDateTimeTz(vals[0].value, 0) });
            }else{
                lst.push({ filtVal: apiKey + " >= " + vals[0].value });
            }
        }
    }else if(domType == 'date'){
        if(vals[0].value){
            var d = vals[0].value;
            if(apiKey == '_date'){
                fn = this.getColNames();
                lst.push({ filtVal: '(' + fn[0] + " = null or " + fn[0] + " <= " + d
                 + ') and (' + fn[1] + " = null or " + fn[1] + " >= " + d + ')' });
            }
        }
    }else if(domType == 'filt'){
        lst.push({ filtVal: vals[0].value });
    }else if(domType == 'currencyRange'){
        if(vals[0].value){
            lst.push({ filtVal: apiKey + " >= " + vals[0].value });
        }
        if(vals[1].value){
            lst.push({ filtVal: apiKey + " <= " + vals[1].value });
        }
    }else if(domType == 'array'){
        if(vals[0].value){
            lst.push({ filtVal: apiKey + " in (" + vals[0].value + ")" });
        }
    }
    for(var i = 0 ; i < lst.length ; i++){
        plst.push(lst[i]);
    }
};

/**
 *
 * @param {number=} lev 1 or 2
 * @returns
 */
teasp.Tsf.Fc.prototype.isRequired = function(lev){
    if(this.isReadOnly()){
        return false;
    }
    if(lev && !(lev & 1)){
        return (this.fc.required & lev);
    }
    return this.fc.required;
};

teasp.Tsf.Fc.prototype.setRequired = function(v){
    this.fc.required = v;
};

teasp.Tsf.Fc.prototype.setPickList = function(pickList){
    this.fc.pickList = pickList;
};

/**
 *
 * @param {string|number} val 値
 * @param {number|null|undefined} chklev 1 or 2
 * @param {Array.<Object>} ngList NG情報の格納先
 */
teasp.Tsf.Fc.prototype.checkValid = function(val, chklev, ngList){
    if(!chklev){
        return;
    }
    if(!val){
        if(this.isRequired(chklev)){
            ngList.push({
                ngType  : 1,
                fc      : this
            });
        }
    }else if(this.getDomType() == 'date'){
        var d = teasp.util.strToDate(val);
        if(d.failed > 1){ // 書式が無効、または値が無効
            ngList.push({
                failed  : d.failed,
                ngType  : (d.failed == 2 ? 2 : 3),
                fc      : this,
                tmpl    : d.tmpl
            });
        }
    }
};

teasp.Tsf.Fc.prototype.getDecimal = function(){
    if(!this.fc.decimal){
        return null;
    }
    return [6, 2];
};

teasp.Tsf.Fc.prototype.isLinkAttachments = function(){
    if(this.getDomType() == 'children' && !this.isHidden()){
        return true;
    }
    return false;
};

teasp.Tsf.Fc.prototype.loadPickList = function(domHelper, select, value){
    teasp.Tsf.Dom.empty(select);
    var pickList = this.getPickList(true);
    if(pickList){
        var topv = null;
        dojo.forEach(pickList, function(p){
            if(typeof(p) == 'string'){
                domHelper.create('option', { value: p, innerHTML: teasp.Tsf.util.entitizf(p || (this.isSearchCondition() && teasp.message.getLabel('tk10004480'))) }, select); // (すべて)
                if(topv === null){
                    topv = p;
                }
            }else{
                domHelper.create('option', { value: p.v, innerHTML: teasp.Tsf.util.entitizf(p.n) }, select);
                if(topv === null){
                    topv = p.v;
                }
            }
        }, this);
        if(value !== undefined){
            select.value = value;
        }else{
            select.value = (this.isDefaultIsTop() && topv) || '';
        }
    }
};

/**
 * ツールチップ情報をDef.jsから取得する
 */
teasp.Tsf.Fc.prototype.getTooltipMsgId = function(){
    return this.fc.tooltipMsgId;
};
