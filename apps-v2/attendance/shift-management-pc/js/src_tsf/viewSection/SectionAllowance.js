/**
 * 日当・宿泊費セクション
 *
 * @constructor
 */
teasp.Tsf.SectionAllowance = function(parent){
    this.parent = parent;
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionAllowance);
    this.checkable = false;
    this.reskey = 'A';
    this.pageNo = 1;
    this.rowMax = 7;
};

teasp.Tsf.SectionAllowance.prototype = new teasp.Tsf.SectionBase();

/**
 * 日当・宿泊費の行追加
 *
 * @override
 * @param {string=} hkey
 * @return {Object}
 */
teasp.Tsf.SectionAllowance.prototype.insertRow = function(hkey){
    return this.insertTableRow(hkey);
};

teasp.Tsf.SectionAllowance.prototype.insertTableRowEx = function(tr, hkey){
    // 出張・宿泊手当の選択肢をセット
    teasp.Tsf.Dom.query('select.ts-form-select', tr).forEach(function(el){
        if(/^SecAllow.+Allow$/.test(el.id)){
            this.setAllowanceItem(el);
        }else if(/^SecAllow.+Hotel$/.test(el.id)){
            this.setHotelItem(el);
        }
        this.getDomHelper().connect(el, 'onchange', this, this.changedSelect, hkey);
    }, this);
};

teasp.Tsf.SectionAllowance.prototype.setAllowanceItem = function(el){
    teasp.Tsf.Dom.empty(el);
    this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
    var expItems = tsfManager.getExpItems(this.expItemFilter);
    dojo.forEach(expItems, function(expItem){
        if(expItem.isAllowance()){
            this.getDomHelper().create('option', { value: expItem.getId(), innerHTML: expItem.getName() }, el);
        }
    }, this);
};

teasp.Tsf.SectionAllowance.prototype.setHotelItem = function(el){
    teasp.Tsf.Dom.empty(el);
    this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
    var expItems = tsfManager.getExpItems(this.expItemFilter);
    dojo.forEach(expItems, function(expItem){
        if(expItem.isHotel()){
            this.getDomHelper().create('option', { value: expItem.getId(), innerHTML: expItem.getName() }, el);
        }
    }, this);
};

teasp.Tsf.SectionAllowance.prototype.loadExpItemFilter = function(){
    var assist = this.parent.getAssist();
    this.expItemFilter = {
        empExpItemClass  : tsfManager.getTargetEmp().getExpItemClass(),
        deptExpItemClass : (assist && assist.ChargeDeptId__r && assist.ChargeDeptId__r.ExpItemClass__c) || null,
        expenseType      : (assist && assist.ExpenseType__c) || null
    };
};

/**
 * セクションのDOMを返す
 *
 * @override
 * @returns {Array.<Object>}
 */
teasp.Tsf.SectionAllowance.prototype.createArea = function(){
    this.loadExpItemFilter();
    return this.createTableArea();
};

teasp.Tsf.SectionAllowance.prototype.createTableArea = function(plus){
    var els = teasp.Tsf.SectionBase.prototype.createTableArea.call(this, plus);
    var div = this.getDomHelper().create('div', { className: 'allowance-mismatch', style: 'display:none;' }, els[els.length - 1]);
    this.getDomHelper().create('div', { className: 'pp_ico_ng' }, div);
    this.getDomHelper().create('div', { className: 'ng-message' }, div);
    return els;
};

teasp.Tsf.SectionAllowance.prototype.createSectionTop = function(){
    return this.getDomHelper().create('div', { className: 'ts-list-paging' });
};

teasp.Tsf.SectionAllowance.prototype.rebuild = function(param){
    this.startDate = param.startDate;
    this.endDate   = param.endDate;
    this.tryChangePage(1);
    this.changedCurrency();
};

teasp.Tsf.SectionAllowance.prototype.getValuesByRowIndex = function(index){
    var idx = (this.rowMax * (this.pageNo - 1)) + index;
    return teasp.Tsf.SectionBase.prototype.getValuesByRowIndex.call(this, idx);
};

teasp.Tsf.SectionAllowance.prototype.deleteRow = function(tr, viewOnly, calcOnly){
    this.getDomHelper().freeBy(teasp.Tsf.Fp.getHkey(tr));
    teasp.Tsf.Dom.destroy(tr);
};

teasp.Tsf.SectionAllowance.prototype.tryChangePage = function(n){
    var data = teasp.Tsf.SectionBase.prototype.getDomValues.call(this);
    var lst = this.parent.rebuildExpPreApplyDay(this.startDate, this.endDate, data);

    this.loadExpItemFilter();

    this.empty();

    this.pageNo = n;
    this.recordCount = lst.length;
    var zn = this.recordCount - (this.rowMax * (this.pageNo - 1));
    var size = (zn < this.rowMax ? zn : this.rowMax);
    for(var i = 0 ; i < size ; i++){
        this.insertRow();
    }
    var pagingEl = teasp.Tsf.Dom.node('.ts-list-paging', teasp.Tsf.Dom.node('div.' + this.getFormCss()));
    teasp.Tsf.ListBase.setPaging({
            pageNo   : this.pageNo,
            cntAll   : this.recordCount,
            rowLimit : this.rowMax
        },
        pagingEl,
        this.getDomHelper(),
        'paging',
        this
    );
    this.checkExpMatching();
};

teasp.Tsf.SectionAllowance.prototype.changePage = function(n){
    var pg = n;
    var that = this;
    return function(){
        that.tryChangePage(pg);
    };
};

teasp.Tsf.SectionAllowance.prototype.getDomValues = function(flag){
    var data = teasp.Tsf.SectionBase.prototype.getDomValues.call(this, flag);
    data.values = this.parent.rebuildExpPreApplyDay(this.startDate, this.endDate, data);
    return data;
};

teasp.Tsf.SectionAllowance.prototype.refreshView = function(){
    this.tryChangePage(this.pageNo);
};

/**
 * 不整合を探して表示する
 */
teasp.Tsf.SectionAllowance.prototype.checkExpMatching = function(){
    this.loadExpItemFilter();
    var data = this.getDomValues();
    this.misMatchObj = {};
    for(var i = 0 ; i < data.values.length ; i++){
        var dataObj = data.values[i];
        var o = this.getExpMatching(dataObj);
        this.misMatchObj[dataObj.Date__c] = o;
    }
    this.showExpMatching();
};

/**
 * 不整合の数を返す
 * @returns {number}
 */
teasp.Tsf.SectionAllowance.prototype.getMisMatchCount = function(){
    var cnt = 0;
    for(var key in (this.misMatchObj || {})){
        if(this.misMatchObj.hasOwnProperty(key)){
            var o = this.misMatchObj[key];
            if(o){
                if(o.aflag){
                    cnt++;
                }
                if(o.hflag){
                    cnt++;
                }
            }
        }
    }
    return cnt;
};

/**
 * 不整合を探す
 * @param {Object} dataObj
 * @returns {Object}
 */
teasp.Tsf.SectionAllowance.prototype.getExpMatching = function(dataObj){
    var allowanceItem = (dataObj.AllowanceItemId__c ? tsfManager.getExpItemById(dataObj.AllowanceItemId__c) : null);
    var hotelItem     = (dataObj.HotelItemId__c     ? tsfManager.getExpItemById(dataObj.HotelItemId__c)     : null);
    var aflag = 0;
    var hflag = 0;
    if(allowanceItem){
        if(!allowanceItem.checkExpenseType(this.expItemFilter.expenseType)){
            aflag = teasp.Tsf.EmpExp.MISMATCH_EXPENSE_TYPE;
        }
        if(!allowanceItem.isSelectable(this.expItemFilter.empExpItemClass)
        && !allowanceItem.isSelectable(this.expItemFilter.deptExpItemClass)){
            aflag |= teasp.Tsf.EmpExp.MISMATCH_EXPITEM_CLASS;
        }
    }
    if(hotelItem){
        if(!hotelItem.checkExpenseType(this.expItemFilter.expenseType)){
            hflag = teasp.Tsf.EmpExp.MISMATCH_EXPENSE_TYPE;
        }
        if(!hotelItem.isSelectable(this.expItemFilter.empExpItemClass)
        && !hotelItem.isSelectable(this.expItemFilter.deptExpItemClass)){
            hflag |= teasp.Tsf.EmpExp.MISMATCH_EXPITEM_CLASS;
        }
    }
    if(aflag || hflag){
        return {
            aflag : aflag,
            hflag : hflag
        };
    }
    return null;
};

/**
 * 不整合を表示する
 */
teasp.Tsf.SectionAllowance.prototype.showExpMatching = function(){
    if(!this.parent.isShowMisMatch()){
        return;
    }
    var tbody = this.getTbody();
    var hkeys = teasp.Tsf.Fp.getHkeys(tbody);
    for(var i = 0 ; i < hkeys.length ; i++){
        var row = teasp.Tsf.Fp.getRowByHkey(tbody, hkeys[i]);
        var td = teasp.Tsf.Dom.node('td.ts-form-date', row);
        if(!td){
            continue;
        }
        var div = teasp.Tsf.Dom.node('div', td);
        var hid = teasp.Tsf.Dom.node('input[type="hidden"]', td);
        var o = this.misMatchObj[hid.value];
        var t = [];
        var flag = (o && (o.aflag | o.hflag)) || 0;
        if(flag & teasp.Tsf.EmpExp.MISMATCH_EXPENSE_TYPE){
            t.push(teasp.message.getLabel('tf10006860')); // 精算区分不整合
        }
        if(flag & teasp.Tsf.EmpExp.MISMATCH_EXPITEM_CLASS){
            t.push(teasp.message.getLabel('tf10006870')); // 費目表示区分不整合
        }
        teasp.Tsf.Dom.toggleClass(div, 'ts-mismatch2', (t.length ? true : false));
        var icon = teasp.Tsf.Dom.node('div.pp_ico_ng', div);
        if(t.length){
            if(!icon){
                this.getDomHelper().create('div', { className: 'pp_ico_ng' }, div);
            }
        }else if(icon){
            teasp.Tsf.Dom.destroy(icon);
        }
        div.title = (t.length ? t.join('\r\n') : '');
        teasp.Tsf.Dom.query('select.ts-form-select', row).forEach(function(el){
            if(/^SecAllow.+Allow$/.test(el.id)){
                teasp.Tsf.Dom.style(el, 'backgroundColor', (o && o.aflag ? '#FFDEE4' : 'white'));
            }else if(/^SecAllow.+Hotel$/.test(el.id)){
                teasp.Tsf.Dom.style(el, 'backgroundColor', (o && o.hflag ? '#FFDEE4' : 'white'));
            }
        }, this);
    }
    var foot = teasp.Tsf.Dom.node('div.allowance-mismatch', this.getFormEl());
    if(foot){
        var cnt = this.getMisMatchCount();
        teasp.Tsf.Dom.show(foot, null, (cnt ? true : false));
        teasp.Tsf.Dom.node('div.ng-message', foot).innerHTML = (cnt ? teasp.message.getLabel('tf10006910', cnt) : '');
    }
};

/**
 * 出張手当または宿泊手当の選択を変更した
 * @param {Object} e
 */
teasp.Tsf.SectionAllowance.prototype.changedSelect = function(e){
    if(this.misMatchObj){
        var row = teasp.Tsf.Dom.getAncestorByTagName(e.target, 'TR');
        var dobj = {};
        teasp.Tsf.Dom.query('select.ts-form-select', row).forEach(function(el){
            if(/^SecAllow.+Allow$/.test(el.id)){
                dobj.AllowanceItemId__c = el.value || null;
            }else if(/^SecAllow.+Hotel$/.test(el.id)){
                dobj.HotelItemId__c = el.value || null;
            }
        }, this);
        var hid = teasp.Tsf.Dom.node('td.ts-form-date input[type="hidden"]', row);
        if(hid){
            dobj.Date__c = hid.value;
            this.misMatchObj[dobj.Date__c] = this.getExpMatching(dobj);
        }
        this.showExpMatching();
    }
    this.changedCurrency();
};

/**
 * 不整合フラグを集約して返す
 * @returns {number}
 */
teasp.Tsf.SectionAllowance.prototype.getMisMatchFlag = function(){
    var flag = 0;
    for(var key in (this.misMatchObj || {})){
        if(this.misMatchObj.hasOwnProperty(key)){
            var o = this.misMatchObj[key];
            if(o){
                flag |= (o.aflag|o.hflag);
            }
        }
    }
    return flag;
};
