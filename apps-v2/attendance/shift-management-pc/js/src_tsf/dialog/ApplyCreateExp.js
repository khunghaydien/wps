/**
 * 未申請明細から精算開始ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ApplyCreateExp = function(){
    this.params = null;
    this.applyKey = null;
};

teasp.Tsf.ApplyCreateExp.prototype.getArea = function(){
    return teasp.Tsf.Dom.byId(this.dialog.id);
};

teasp.Tsf.ApplyCreateExp.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.ApplyCreateExp.prototype.hide = function(){
    if(this.dialog){
        this.dialog.hide();
        this.domHelper.free();
        this.dialog.destroy();
        tsfManager.removeDialog('ApplyCreateExp');
    }
};

teasp.Tsf.ApplyCreateExp.prototype.createButtons = function(areaEl){
    var area = this.getDomHelper().create('div', { className: 'ts-dialog-buttons' }, areaEl);
    var div  = this.getDomHelper().create('div', null, area);
    var buttons = this.params.buttons || [];
    if(buttons.length <= 0){
        var close = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('close_btn_title'), 'ts-dialog-cancel', div); // 閉じる
        this.getDomHelper().connect(close, 'onclick', this, this.hide);
    }
    dojo.forEach(buttons, function(b){
        if(b.key == 'cancel'){
            var button = teasp.Tsf.Dialog.createButton(this.getDomHelper(), b.label, (b.css || 'ts-dialog-cancel'), div);
            this.getDomHelper().connect(button, 'onclick', this, this.hide);
        }else if(typeof(this[b.key]) == 'function'){
            var button = teasp.Tsf.Dialog.createButton(this.getDomHelper(), b.label, (b.css || 'ts-dialog-ok'), div);
            this.getDomHelper().connect(button, 'onclick', this, function(e){
                this.submit(b.key);
            });
        }else{
            var button = teasp.Tsf.Dialog.createButton(this.getDomHelper(), b.label, (b.css || 'ts-dialog-ok'), div);
            this.getDomHelper().connect(button, 'onclick', this, function(e){
                this.showError();
                this.callback(b.key, this.fetchComment(), teasp.Tsf.Dom.hitch(this, this.hide), teasp.Tsf.Dom.hitch(this, this.showError));
            });
        }
    }, this);
};

teasp.Tsf.ApplyCreateExp.prototype.showError = function(result){
    var er = teasp.Tsf.Dom.node('.ts-error-area', this.getArea());
    teasp.Tsf.Error.showError(result, er);
};

teasp.Tsf.ApplyCreateExp.prototype.submit = function(key){
    this.showError();
    this[key]();
};

teasp.Tsf.ApplyCreateExp.prototype.show = function(obj, callback){
    this.orgData = obj;
    this.applyKey = teasp.constant.APPLY_KEY_EXPAPPLY;

    teasp.Tsf.Error.showError();

    this.params = obj || {};
    this.domHelper = new teasp.Tsf.Dom();
    this.dialog = new dijit.Dialog({
        title       : (this.params.title   || ''),
        className   : (this.params.formCss || '')
    });
    this.dialog.attr('content', this.getContent());
    this.dialog.startup();
    this.domHelper.connect(this.dialog, 'onCancel', this, function(){ this.hide(); });

    this.callback = callback;
    this.dialog.show();
};

teasp.Tsf.ApplyCreateExp.prototype.getContent = function(){
    var areaEl = this.getDomHelper().create('div', { className: 'ts-dialog' });
    this.getDomHelper().create('div', null
            , this.getDomHelper().create('div', { className: 'ts-error-area', style: 'width:390px;display:none;' }, areaEl));

    //---------------------
    // 申請対象選択
    var radioEl = this.getDomHelper().create('div', { className: 'ts-apply-target-choice' }, areaEl);

    this.getDomHelper().create('div', { className: 'ts-apply-target', innerHTML: teasp.message.getLabel('tf10001300') }, radioEl); // 申請対象

    var lb1 = this.getDomHelper().create('label', null, this.getDomHelper().create('div', null, radioEl));
    var chk = this.getDomHelper().create('input', { type: 'radio', name: 'ApplyCommentTarget' }, lb1);
    chk.checked  = !this.orgData.checkedList.length;
    lb1.appendChild(document.createTextNode(' ' + teasp.message.getLabel('all_label'))); // すべて

    var lb2 = this.getDomHelper().create('label', null, this.getDomHelper().create('div', null, radioEl));
    chk = this.getDomHelper().create('input', { type: 'radio', name: 'ApplyCommentTarget' }, lb2);
    chk.disabled = !this.orgData.checkedList.length;
    chk.checked  = (this.orgData.checkedList.length > 0);
    lb2.appendChild(document.createTextNode(' ' + teasp.message.getLabel('tf10001630'))); // 選択した明細のみ

    dojo.query('input[type="radio"]', radioEl).forEach(function(el){
        this.getDomHelper().connect(el, 'onclick', this, teasp.Tsf.Dom.hitch(this, function(){ this.showClosingWarn(); }));     // 起算日またぎチェック・警告
    }, this);

    if(this.params && !this.params.allList.length){
        this.getDomHelper().create('div', { innerHTML:teasp.message.getLabel('tf10008890'), style:'text-align:center;' }, areaEl); // 新規の申請を作成します。
        teasp.Tsf.Dom.show(radioEl, this.getArea(), false);
    }else{
        teasp.Tsf.Dom.show(radioEl, this.getArea(), true);
    }

    //---------------------
    // 起算日またぎ警告エリア作成
    this.getDomHelper().create('div', null, this.getDomHelper().create('div', { className: 'ts-apply-warn-closing', style: 'display:none;' }, areaEl));

    //---------------------
    // 明細数オーバー警告エリア作成
    this.getDomHelper().create('div', null, this.getDomHelper().create('div', { className: 'ts-apply-warn-over', style: 'display:none;' }, areaEl));

    this.getDomHelper().create('div', {
    	innerHTML:teasp.message.getLabel('tf10008870') // 精算開始してよろしければOKをクリックしてください
    }, this.getDomHelper().create('div', { className: 'ts-apply-start-message' }, areaEl));

    this.createButtons(areaEl);

    this.showClosingWarn(areaEl);
    return areaEl;
};

/**
 * 起算日またぎのチェック・警告
 * @param {Object=} areaEl
 */
teasp.Tsf.ApplyCreateExp.prototype.showClosingWarn = function(areaEl){
    var area = areaEl || this.getArea();
    var pdiv = dojo.query('div.ts-apply-warn-closing', area)[0];
    var div = dojo.query('div', pdiv)[0];
    dojo.empty(div);
    var lst = this.getDivideDateList(areaEl);
    if(lst.length > 1){
        this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10007690') }, div); // 経費申請の起算日をまたいでしまうため、一度に申請できません。申請する範囲を選択してください。
        teasp.Tsf.Dom.append(div, this.createRangeList(lst));
    }
    dojo.style(pdiv, 'display', (lst.length > 1 ? '' : 'none'));

    this.showOverWarn(areaEl);
};

/**
 * 明細数オーバーのチェック・警告
 * @param {Object=} areaEl
 */
teasp.Tsf.ApplyCreateExp.prototype.showOverWarn = function(areaEl){
    var itemCount = 0;
    var expCountLimit = tsfManager.getExpCountLimit();
    var area = areaEl || this.getArea();
    var pdiv = dojo.query('div.ts-apply-warn-over', area)[0];
    var div = dojo.query('div', pdiv)[0];
    dojo.empty(div);
    var rs = this.getTargetRange(areaEl);
    var chk = teasp.Tsf.Dom.node('div.ts-apply-target-choice input[type="radio"]', area);
    if(rs.active){
        itemCount = rs.count || 0;
    }else{
        var lst = (chk.checked ? this.orgData.allList : this.orgData.checkedList);
        itemCount = lst.length;
    }
    if(itemCount > expCountLimit){ // 制限オーバー
        this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10007700', expCountLimit) }, div); // 申請対象の明細の数が制限数({0}件)をオーバーします。
        var label = this.getDomHelper().create('label', null, this.getDomHelper().create('div', { className: 'top-only' }, div));
        var chk = this.getDomHelper().create('input', { type: 'checkbox' }, label);
        this.getDomHelper().create('span', { innerHTML: ' ' + teasp.message.getLabel('tf10007710', expCountLimit) }, label); // 上位{0}件分のみ申請する
        this.getDomHelper().connect(chk, 'onclick', this, teasp.Tsf.Dom.hitch(this, function(){
            this.enableSubmit(areaEl);
        }));
    }
    dojo.style(pdiv, 'display', (itemCount > expCountLimit ? '' : 'none'));
    this.enableSubmit(areaEl);
};

/**
 * 選択した範囲を取得
 * @param {Object=} areaEl
 */
teasp.Tsf.ApplyCreateExp.prototype.getTargetRange = function(areaEl){
    var area = areaEl || this.getArea();
    var o = { active:false };
    dojo.query('.ts-range-list input[type="radio"]', area).forEach(function(el){
        o.active = true;
        if(el.checked){
            var n = teasp.Tsf.Dom.getAncestorByTagName(el, 'DIV');
            o.sd    = dojo.query('input[type="hidden"].range-sd', n)[0].value;
            o.ed    = dojo.query('input[type="hidden"].range-ed', n)[0].value;
            o.count = parseInt(dojo.query('input[type="hidden"].range-count', n)[0].value, 10);
        }
    });
    return o;
};

/**
 * 承認申請の可否チェック
 * @param {Object=} areaEl
 */
teasp.Tsf.ApplyCreateExp.prototype.enableSubmit = function(areaEl){
    var area = areaEl || this.getArea();
    var flag = true;
    var chk = teasp.Tsf.Dom.node('div.ts-apply-warn-over input[type="checkbox"]', area);
    if(chk && !chk.checked){
        flag = false;
    }else{
        var rs = this.getTargetRange(areaEl);
        if(rs.active && !rs.count){
            flag = false;
        }
    }
    var buttonArea = teasp.Tsf.Dom.node('div.ts-dialog-buttons', area);
    var button = teasp.Tsf.Dom.node('button.ts-dialog-ok'         , buttonArea)
              || teasp.Tsf.Dom.node('button.ts-dialog-ok-disabled', buttonArea);
    dojo.toggleClass(button, 'ts-dialog-ok'         ,  flag);
    dojo.toggleClass(button, 'ts-dialog-ok-disabled', !flag);
    button.disabled = !flag;
};

/**
 * 起算日をまたがないように範囲を分割する
 * @param {Object=} areaEl
 * @returns
 */
teasp.Tsf.ApplyCreateExp.prototype.getDivideDateList = function(areaEl){
    var area = areaEl || this.getArea();
    var sd = tsfManager.getExpStartDate();
    if(sd > 0){
        var chk = teasp.Tsf.Dom.node('div.ts-apply-target-choice input[type="radio"]', area);
        var dates = (chk.checked ? this.orgData.allDates : this.orgData.checkedDates);
        return teasp.util.date.divideDateList(dates, sd);
    }
    return [];
};

/**
 * 起算日またぎの範囲の選択テーブルを作成
 * @param {Array.<Object>} lst
 * @param {number=} index
 * @returns
 */
teasp.Tsf.ApplyCreateExp.prototype.createRangeList = function(lst, index){
    this.getDomHelper().freeBy('rangeList');
    var rangeEl = this.getDomHelper().create('div', { className: 'ts-range-list' });
    for(var i = 0 ; i < lst.length ; i++){
        var o = lst[i];
        var div = this.getDomHelper().create('div', null, rangeEl);
        var label = this.getDomHelper().create('label', null, div);
        var radio = this.getDomHelper().create('input', { type: 'radio', name: 'rangeSel' }, label);
        if(typeof(index) == 'number' && i == index){
            radio.checked = true;
        }
        this.getDomHelper().connect(radio, 'onclick', this, teasp.Tsf.Dom.hitch(this, function(){ this.showOverWarn(); }), 'rangeList');
        var str = teasp.message.getLabel((o.sd != o.ed ? 'tf10007720' : 'tf10007730'),
                        teasp.util.date.formatDate(o.sd, 'SLA'),
                        teasp.util.date.formatDate(o.ed, 'SLA'),
                        o.lst.length);
        this.getDomHelper().create('span', { innerHTML: ' ' + str }, label);
        this.getDomHelper().create('input', { type: 'hidden', value: o.sd             , className: 'range-sd'    }, div);
        this.getDomHelper().create('input', { type: 'hidden', value: o.ed             , className: 'range-ed'    }, div);
        this.getDomHelper().create('input', { type: 'hidden', value: '' + o.lst.length, className: 'range-count' }, div);
    }
    if(lst.length > 3){
        dojo.style(rangeEl, 'overflow-y', 'scroll');
        dojo.style(rangeEl, 'height'    , '60px' );
    }
    return rangeEl;
};

/**
 * 申請対象の明細IDのリストを返す
 * @returns {Object}
 */
teasp.Tsf.ApplyCreateExp.prototype.getExpList = function(exps){
    var area = this.getArea();
    var expCountLimit = tsfManager.getExpCountLimit();
    var chk = teasp.Tsf.Dom.node('div.ts-apply-target-choice input[type="radio"]', area);
    var ids = (chk.checked ? this.orgData.allList : this.orgData.checkedList);
    var rs = this.getTargetRange(area);
    var obj = {
        cost     : 0,
        ids      : [],
        uks      : [],
        allApply : (chk.checked && !rs.active && ids.length <= expCountLimit)
    };
    var tempId = 1;
    for(var i = 0 ; (i < exps.length && obj.ids.length < expCountLimit) ; i++){
        var exp = exps[i];
        exp._tempId = '_temp' + (tempId++);
        if(!ids.contains(exp.Id || exp._uniqKey)){
            continue;
        }
        if(!rs.active || (rs.sd <= exp.Date__c && exp.Date__c <= rs.ed)){
            obj.ids.push(exp.Id || exp._uniqKey);
            obj.uks.push(exp._tempId);
            obj.cost += (teasp.Tsf.util.parseInt(exp.Cost__c) || 0);
        }
    }
    return obj;
};

teasp.Tsf.ApplyCreateExp.prototype.createExpApply = function(){
    var expApply = this.orgData.expApply;

    var obj = this.getExpList(expApply.exps);
    var ids      = obj.ids;
    var uks      = obj.uks;
    var allApply = obj.allApply;

    var exps = [];
    for(var i = 0 ; i < expApply.exps.length ; i++){
        var exp = expApply.exps[i];
        if(allApply || ids.contains(exp.Id || exp._uniqKey) || uks.contains(exp._tempId)){
            exps.push(exp);
        }
    }
    expApply.exps = exps.sort(function(a, b){
        if(a.Date__c == b.Date__c){
            return 0;
        }
        return (a.Date__c < b.Date__c ? -1 : 1);
    });
    expApply.applyStart = true;
    expApply.ExpenseType__c = this.orgData.expenseType;

    tsfManager.createExpApply(expApply, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            this.hide();
            this.callback(result);
        }else{
            this.showError(result);
        }
    }));
};
