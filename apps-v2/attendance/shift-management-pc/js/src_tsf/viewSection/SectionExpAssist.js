/**
 * 経費情報セクション
 *
 * @constructor
 */
teasp.Tsf.SectionExpAssist = function(parent){
    this.parent = parent;
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionExpAssist);
    this.dataObj = null;
    this.active = false;
};

teasp.Tsf.SectionExpAssist.prototype = new teasp.Tsf.SectionBase();

teasp.Tsf.SectionExpAssist.isUse = function(objBase){
    var typeName = objBase.getTypeName();
    var obj = (objBase.getId() ? objBase.getDataObj() : null);
    var info = tsfManager.getInfo();
    return (info.getUseTitle(typeName, obj)
         || info.isUseExpenseType(typeName, obj)
         || info.isUsePayMethod(typeName, obj)
         || info.isUseApplyDate(typeName, obj)
         || info.isUsePayDate(typeName, obj)
         || info.isUseProvisional(typeName, obj)
         || info.isUseChargeJob(typeName, obj)
         || info.isUseChargeDept(typeName, obj)
         || info.isUseExtraItem1(typeName, obj)
         || info.isUseExtraItem2(typeName, obj)
        );
};

teasp.Tsf.SectionExpAssist.prototype.createArea = function(){
    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form ' + this.getFormCss() });
    if(this.parent.getFormStyle() == 0){
        this.getDomHelper().create('div', { className: 'ts-section-z0' }, formEl);
    }
    var zp = this.getDomHelper().create('div', { className: 'ts-section-zp' }, formEl);
    this.getDomHelper().create('div', { className: 'ts-section-z1' }, zp);
    var fz2 = null;
    if(this.parent.getFormStyle() == 0){
        fz2 = this.getDomHelper().create('div', { className: 'ts-section-z2' }, zp);
    }

    var bar = null;
    if(this.parent.getFormStyle() == 0){
        bar = this.createSectionBar(this.getDomHelper(), teasp.message.getLabel('tf10002150'), false, 'ts-section-bar2 margin-top-10'); // 基本情報
    }

    var expApplyId = this.getObjBase().getId();
    var typeName   = this.getObjBase().getTypeName();

    var fcExpenseType = this.fp.getFcByApiKey('ExpenseType__c');
    if(this.getObjBase().isEditableStatus()){
        fcExpenseType.setWeak(true);
    }

    this.dataObj = teasp.Tsf.Dom.clone(this.getValuesByRowIndex(0));
    tsfManager.getInfo().setCacheDept(this.dataObj);
    tsfManager.getInfo().setCacheJob(this.dataObj);

    if(!expApplyId && !this.getObjBase().isCreateFlag()){
        this.active = false;
        teasp.Tsf.Dom.show(formEl, null, false);
        if(bar){
            teasp.Tsf.Dom.show(bar   , null, false);
        }
    }else{
        this.active = true;
        var fcs = this.getUsingFcs(typeName, (expApplyId ? this.dataObj : null));
        var n = 1;
        dojo.forEach(fcs, function(fc){
            var fzk = fc.getAreaKey();
            var fz = teasp.Tsf.Dom.node('.ts-section-' + (fzk ? fzk : (fz2 && (n%2)==0 ? 'z2' : 'z1')), formEl);
            if(fc.isHidden()){
                this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, fz);
            }else{
                var row = this.getDomHelper().create('div', { className: 'ts-form-row'  }, fz);
                var label = this.getDomHelper().create('div', { className: 'ts-form-label'  }, row);
                this.getDomHelper().create('div', { innerHTML: fc.getLabel()  }, label);
                if(fc.isRequired()){
                    this.getDomHelper().create('div', { className: 'ts-require' }, label);
                }
                fc.appendFieldDiv(this.getDomHelper(), row); // 入力欄作成
            }
            if(!fzk){
                n++;
            }
        }, this);

        if(!this.isReadOnly()){
            var chargeDept = tsfManager.getInfo().getCacheDept(this.dataObj.ChargeDeptId__c);
            var deptExpItemClass = chargeDept && chargeDept.ExpItemClass__c || null;
            if(!expApplyId){ // 新規のレコード
                // 精算区分＝使用の場合、デフォルトの精算区分をセット
                if(tsfManager.getInfo().isUseExpenseType(typeName)
                && !this.dataObj.ExpenseType__c){
                    var ets = tsfManager.getInfo().getExpenseTypes(tsfManager.getTargetEmp().getExpenseTypes());
                    if(ets.length > 0){
                        this.dataObj.ExpenseType__c = ets[0];
                    }
                }
                // 精算方法＝使用の場合、デフォルトの精算方法をセット
                if(tsfManager.getInfo().isUsePayMethod(typeName)){
                    var payItems = tsfManager.getInfo().getPayItems(this.getExpItemFilter(this.dataObj.ExpenseType__c, deptExpItemClass));
                    var payItemId = (payItems.length > 0 ? payItems[0].getId() : null);
                    if(this.dataObj.PayExpItemId__c){
                        for(var i = 0 ; i < payItems.length ; i++){
                            if(this.dataObj.PayExpItemId__c == payItems[i].getId()){
                                payItemId = this.dataObj.PayExpItemId__c;
                                break;
                            }
                        }
                    }
                    this.dataObj.PayExpItemId__c = payItemId;
                }
            }

            this.loadPayMethods(formEl, this.dataObj.ExpenseType__c, deptExpItemClass, true);
            this.loadChargeDepts(formEl);         // 負担部署の選択肢をセット
            this.loadJobs(formEl);                // ジョブの選択肢をセット
            this.loadProvisionalPayments(formEl); // 仮払申請の選択肢をセット
            this.setEventHandler(formEl);         // イベントハンドラをセット
        }

        // 値を入力欄にセット
        this.fp.fcLoop(function(fc){
            fc.drawText(this.getDomHelper(), this.dataObj, null, formEl);
        }, this);
    }
    this.showExpMatching(formEl);

    var areas = [formEl];
    if(bar){
        areas.unshift(bar);
    }
    return areas;
};

teasp.Tsf.SectionExpAssist.prototype.getUsingFcs = function(typeName, obj){
    var fcs = [];
    var info = tsfManager.getInfo();
    // 件名入力
    var fc = this.fp.getFcByApiKey('Title__c');
    var n = info.getUseTitle(typeName, obj);
    if(n){
        fc.setNotUse(false);
        if(n == 2){ // 必須
            fc.setRequired(1);
        }
        fcs.push(fc);
    }else{
        fc.setNotUse(true);
    }
    // 精算区分
    fc = this.fp.getFcByApiKey('ExpenseType__c');
    fc.setPickList(info.getExpenseTypes(tsfManager.getTargetEmp().getExpenseTypes(), true));
    if(info.isUseExpenseType(typeName, obj)){
        fc.setNotUse(false);
        fcs.push(fc);
    }else{
        fc.setNotUse(true);
    }
    // 精算方法
    fc = this.fp.getFcByApiKey('PayExpItemId__c');
    if(info.isUsePayMethod(typeName, obj)){
        fc.setNotUse(false);
        fcs.push(fc);
    }else{
        fc.setNotUse(true);
    }
    // 申請日
    fc = this.fp.getFcByApiKey('ApplyDate__c');
    if(info.isUseApplyDate(typeName, obj)){
        fc.setNotUse(false);
        fcs.push(fc);
    }else{
        fc.setNotUse(true);
    }
    // 支払予定日
    fc = this.fp.getFcByApiKey('ExpectedPayDate__c');
    if(info.isUsePayDate(typeName, obj)){
        fc.setNotUse(false);
        fcs.push(fc);
    }else{
        fc.setNotUse(true);
    }
    // 仮払い申請
    fc = this.fp.getFcByApiKey('ProvisionalPaymentId__c');
    if(info.isUseProvisional(typeName, obj)){
        fc.setNotUse(false);
        fcs.push(fc);
    }else{
        fc.setNotUse(true);
    }
    // ジョブ
    fc = this.fp.getFcByApiKey('ChargeJobId__c');
    if(info.isUseChargeJob(typeName, obj)){
        fc.setNotUse(false);
        fcs.push(fc);
    }else{
        fc.setNotUse(true);
    }
    // 負担部署
    fc = this.fp.getFcByApiKey('ChargeDeptId__c');
    if(info.isUseChargeDept(typeName, obj)){
        fc.setNotUse(false);
        fcs.push(fc);
    }else{
        fc.setNotUse(true);
    }
    // 拡張項目1
    fc = this.fp.getFcByApiKey('ExtraItem1__c');
    fc.setLabel(info.getExtraItemOutputDataName1());
    if(info.isUseExtraItem1(typeName, obj)){
        fc.setNotUse(false);
        fcs.push(fc);
    }else{
        fc.setNotUse(true);
    }
    // 拡張項目2
    fc = this.fp.getFcByApiKey('ExtraItem2__c');
    fc.setLabel(info.getExtraItemOutputDataName2());
    if(info.isUseExtraItem2(typeName, obj)){
        fc.setNotUse(false);
        fcs.push(fc);
    }else{
        fc.setNotUse(true);
    }
    // 仮払金額
    fc = this.fp.getFcByApiKey('ProvisionalPaymentId__r.ProvisionalPaymentAmount__c');
    if(fc){
        fcs.push(fc);
    }
    return fcs;
};

teasp.Tsf.SectionExpAssist.prototype.setEventHandler = function(formEl){
    // 日付選択ボタンクリックのイベントハンドラ作成
    teasp.Tsf.Dom.query('.ts-form-cal', formEl).forEach(function(cal){
        var n = teasp.Tsf.Dom.node('div.ts-form-date > input[type="text"]', cal.parentNode.parentNode);
        if(n){
            tsfManager.eventOpenCalendar(this.getDomHelper(), cal, n, { tagName: n.name, isDisabledDate: function(d){ return false; } });
        }
    }, this);

    var select;
    // 精算区分変更イベント
    select = this.fp.getElementByApiKey('ExpenseType__c', null, formEl);
    if(select){
        this.getDomHelper().connect(select, 'onchange', this, this.changedExpenseType);
    }

    // 精算方法変更イベント
    select = this.fp.getElementByApiKey('PayExpItemId__c', null, formEl);
    if(select){
        this.getDomHelper().connect(select, 'onchange', this, function(){
            this.showExpMatching(formEl);
        });
    }

    // 負担部署変更
    select = this.fp.getElementByApiKey('ChargeDeptId__c', null, formEl);
    if(select){
        this.getDomHelper().connect(select, 'onchange', this, this.changedExpenseType);
    }

    // 仮払申請変更
    select = this.fp.getElementByApiKey('ProvisionalPaymentId__c', null, formEl);
    if(select){
        this.getDomHelper().connect(select, 'onchange', this, this.changedProvisionalPayment);
    }

    this.setEventDept(formEl); // 負担部署検索
    this.setEventJob(formEl);  // ジョブ検索
    this.setEventProvisionalPayment(formEl); // 仮払い申請検索
};

/**
 * 精算区分変更
 * @param e
 */
teasp.Tsf.SectionExpAssist.prototype.changedExpenseType = function(e){
    var expenseType = this.getCurrentExpenseType();
    this.loadPayMethods(this.getFormEl(), expenseType, null, true);
    this.showExpMatching();
    if(this.parent){
        this.parent.changedAssist();
    }
};

teasp.Tsf.SectionExpAssist.prototype.getCurrentExpenseType = function(formEl){
    var el = this.fp.getElementByApiKey('ExpenseType__c', null, formEl || this.getFormEl()); // 精算区分選択プルダウン
    return (el ? (el.tagName == 'DIV'? this.dataObj.ExpenseType__c : el.value) : null);
};

/**
 * 精算方法の選択肢をセット
 *
 * @param {Object} formEl
 * @param {string=} expenseType
 * @param {string=} deptExpItemClass
 * @param {boolean=} flag true の場合、デフォルト値がなければ先頭の候補を選択状態にする
 */
teasp.Tsf.SectionExpAssist.prototype.loadPayMethods = function(formEl, expenseType, deptExpItemClass, flag){
    var el = this.fp.getElementByApiKey('PayExpItemId__c', null, formEl); // 精算方法選択プルダウン
    if(el){
        var sel = el.value;
        var payExpItemId = tsfManager.getInfo().getPayExpItemId();
        var fid = null;
        var mp = {};
        teasp.Tsf.Dom.empty(el);
        this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
        var filter = this.getExpItemFilter(expenseType, deptExpItemClass);
        dojo.forEach(tsfManager.getInfo().getPayItems(filter), function(item){
            this.getDomHelper().create('option', { value: item.getId(), innerHTML: item.getName() }, el);
            mp[item.getId()] = 1;
            if(!fid){
                fid = item.getId();
            }
        }, this);
        if(sel && mp[sel]){
            el.value = sel;
        }else if(sel && !mp[sel]){
            var payExpItem = tsfManager.getInfo().getPayItemById(sel);
            if(payExpItem){
                this.getDomHelper().create('option', { value: payExpItem.getId(), innerHTML: payExpItem.getName() }, el);
            }
            el.value = payExpItem.getId();
        }else if(payExpItemId && mp[payExpItemId]){
            el.value = payExpItemId;
        }else if(fid && filter.expenseType && flag){
            el.value = fid;
        }else{
            el.value = '';
        }
    }
};

/**
 * 負担部署選択肢をセット
 *
 * @param {Object} formEl
 */
teasp.Tsf.SectionExpAssist.prototype.loadChargeDepts = function(formEl){
    var el = this.fp.getElementByApiKey('ChargeDeptId__c', null, formEl); // 負担部署選択プルダウン
    if(el){
        teasp.Tsf.Dom.empty(el);
        var o = tsfManager.getDefaultChargeDept(); // デフォルトの負担部署
        this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
        if(o.ChargeDeptId__c){
            this.getDomHelper().create('option', {
                value     : o.ChargeDeptId__c,
                innerHTML : o.ChargeDeptId__r.DeptCode__c + ' ' + o.ChargeDeptId__r.Name
            }, el);
            tsfManager.getInfo().setCacheDept(o);
        }
    }
};

/**
 * 負担部署イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.SectionExpAssist.prototype.setEventDept = function(formEl){
    var deptId = this.fp.getElementByApiKey('ChargeDeptId__c', null, formEl);
    if(deptId){
        var el = teasp.Tsf.Dom.getAncestorByCssName(deptId, 'ts-form-row');
        if(el){
            var btn = teasp.Tsf.Dom.node('button.ts-form-find', el);
            if(btn){
                this.getDomHelper().connect(btn, 'onclick', this, function(e){
                    var d = teasp.util.date.formatDate(teasp.util.date.getToday());
                    tsfManager.showSearchListDialog({ discernment : 'depts', delay: true, values: { _date: [d] } }, null, teasp.Tsf.Dom.hitch(this, function(lst){
                        var src = lst[0];
                        tsfManager.getInfo().setCacheDept(src.Id, src);
                        var fc = this.fp.getFcByApiKey('ChargeDeptId__c');
                        fc.drawText(this.getDomHelper(), { ChargeDeptId__c: src.Id, ChargeDeptId__r: src }, null, formEl);
                        this.changedExpenseType();
                    }));
                });
            }
        }
    }
};

/**
 * 選択中の負担部署を返す
 *
 * @returns {string}
 */
teasp.Tsf.SectionExpAssist.prototype.getCurrentChargeDept = function(formEl){
    var el = this.fp.getElementByApiKey('ChargeDeptId__c', null, formEl || this.getFormEl()); // 負担部署選択プルダウン
    return tsfManager.getInfo().getCacheDept(el ? (el.tagName == 'DIV'? this.dataObj.ChargeDeptId__c : el.value) : null);
};

/**
 * ジョブ選択肢をセット
 *
 * @param {string} d
 */
teasp.Tsf.SectionExpAssist.prototype.loadJobs = function(formEl){
    var el = this.fp.getElementByApiKey('ChargeJobId__c', null, formEl); // ジョブ選択プルダウン
    if(el){
        var sel = el.value;
        var jobs = this.getJobChoices(); // ジョブ選択肢
        var date = teasp.util.date.formatDate(teasp.util.date.getToday());
        var mp = {};
        teasp.Tsf.Dom.empty(el);
        this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
        dojo.forEach(jobs, function(job){
            var jobId = job.getId();
            if((job.activeOnDate(date) || jobId == sel) && !mp[jobId]){
                this.getDomHelper().create('option', { value: jobId, innerHTML: job.getDisplayName() }, el);
                tsfManager.getInfo().setCacheJob(job.getId(), { JobCode__c: job.getCode(), Name: job.getName() });
                mp[jobId] = 1;
            }
        }, this);
        if(mp[sel]){
            el.value = sel;
        }
    }
};

/**
 * ジョブ選択肢＝アサイン済みジョブと一時記憶のジョブの配列を返す
 *
 * @returns {Array.<Object>}
 */
teasp.Tsf.SectionExpAssist.prototype.getJobChoices = function(){
    var jobs = tsfManager.getEmpJobAssigns(); // アサイン済みのジョブ
    return (this.impJobs ? jobs.concat(this.impJobs) : jobs);
};

/**
 * ジョブ検索イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.SectionExpAssist.prototype.setEventJob = function(formEl){
    var jobSelect = this.fp.getElementByApiKey('ChargeJobId__c', null, formEl);
    if(jobSelect){
        var el = teasp.Tsf.Dom.getAncestorByCssName(jobSelect, 'ts-form-row');
        if(el){
            var btn = teasp.Tsf.Dom.node('button.ts-form-find', el);
            if(btn){
                this.getDomHelper().connect(btn, 'onclick', this, function(e){
                    var d = teasp.util.date.formatDate(teasp.util.date.getToday());
                    var assist = this.getValues();
                    var deptId = (assist && assist.ChargeDeptId__c || this.getObjBase().getDeptId(true));
                    tsfManager.showSearchListDialog({
                            discernment : 'jobs',
                            dialog      : 'JobList',
                            delay       : true,
                            values      : {
                                _date          : [d],
                                DeptId__c      : deptId,
                                _jobAssignClass: tsfManager.getEmpJobSearchCondition()
                            }
                        }, null, teasp.Tsf.Dom.hitch(this, function(lst){
                        var src = lst[0];
                        tsfManager.getInfo().setCacheJob(src.Id, src);
                        var fc = this.fp.getFcByApiKey('ChargeJobId__c');
                        fc.drawText(this.getDomHelper(), { ChargeJobId__c: src.Id, ChargeJobId__r: src }, null, formEl);
                    }));
                    this.showExpMatching();
                });
            }
        }
    }
};

/**
 * 仮払申請選択肢をセット
 *
 * @param {string} d
 */
teasp.Tsf.SectionExpAssist.prototype.loadProvisionalPayments = function(formEl){
    var el = this.fp.getElementByApiKey('ProvisionalPaymentId__c', null, formEl); // 仮払申請選択プルダウン
    if(el){
        teasp.Tsf.Dom.empty(el);
        this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
    }
};

/**
 * 仮払い申請イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.SectionExpAssist.prototype.setEventProvisionalPayment = function(formEl){
    var ppId = this.fp.getElementByApiKey('ProvisionalPaymentId__c', null, formEl);
    if(ppId){
        var el = teasp.Tsf.Dom.getAncestorByCssName(ppId, 'ts-form-row');
        if(el){
            var btn = teasp.Tsf.Dom.node('button.ts-form-find', el);
            if(btn){
                this.getDomHelper().connect(btn, 'onclick', this, function(e){
                    tsfManager.showSearchListDialog({ discernment : 'provisionalPayments', delay: true, values: {} }, {
                        dataProcessingExt : teasp.Tsf.Dom.hitch(this, this.processProvisionalPayment)
                    }, teasp.Tsf.Dom.hitch(this, function(lst){
                        var src = lst[0];
                        var obj = {
                            ProvisionalPaymentId__c : src.Id,
                            ProvisionalPaymentId__r : src
                        };
                        tsfManager.getInfo().setCacheProvis(src.Id, src);
                        var fc = this.fp.getFcByApiKey('ProvisionalPaymentId__c');
                        fc.drawText(this.getDomHelper(), obj, null, formEl);
                        this.changedProvisionalPayment();
                    }));
                });
            }
        }
    }
};

teasp.Tsf.SectionExpAssist.prototype.changedProvisionalPayment = function(){
    if(this.parent){
        this.parent.changedCurrency();
    }
};

teasp.Tsf.SectionExpAssist.prototype.processProvisionalPayment = function(records){
    dojo.forEach(records, function(record){
        if((record.AdjustmentExpApply__r && record.AdjustmentExpApply__r.length > 0)
        || (record.ExpApplications__r && record.ExpApplications__r.length > 0)){
            record.noChoose = true;
        }
    }, this);
};

teasp.Tsf.SectionExpAssist.prototype.getValues = function(chklev, ngList){
    var v = {
        ExpenseType__c  : null,
        ChargeDeptId__c : null,
        ChargeDeptId__r : null
    };
    if(this.active){
        var targets = {};
        // 入力欄から値を取得
        this.fp.fcLoop(function(fc){
            if(fc.isApiField(true) && !fc.isNotUse()){
                var k = fc.getApiKey();
                targets[k] = 1;
                teasp.Tsf.Fc.setObjSimpleValue(v, k, fc.fetchValue().value);
                fc.checkValid(v[k], chklev, ngList);
            }
        }, this);
        if(targets['ChargeDeptId__c']){
            v.ChargeDeptId__r = tsfManager.getInfo().getCacheDept(v.ChargeDeptId__c);
        }
        if(targets['ChargeJobId__c']){
            v.ChargeJobId__r = tsfManager.getInfo().getCacheJob(v.ChargeJobId__c);
        }
        if(targets['ProvisionalPaymentId__c']){
            v.ProvisionalPaymentId__r = tsfManager.getInfo().getCacheProvis(v.ProvisionalPaymentId__c);
        }
    }
    if(!v.ChargeDeptId__r){
        v.ChargeDeptId__r = {
            ExpItemClass__c : tsfManager.getTargetEmp().getDeptExpItemClass()
        };
    }
    return v;
};

teasp.Tsf.SectionExpAssist.prototype.getDomValues = function(flag, chklev){
    var ngList = [];
    var v = this.getValues(chklev, ngList);
    return {
        objectName  : this.parent.fp.getObjectName(),
        values      : [v],
        types       : {},
        fixes       : {},
        removes     : [],
        ngList      : ngList
    };
};

/**
 * 費目使用制限のフィルタ用パラメータを返す
 * @param {string=} expenseType
 * @param {string=} deptExpItemClass
 * @returns {Object}
 */
teasp.Tsf.SectionExpAssist.prototype.getExpItemFilter = function(expenseType, deptExpItemClass){
    var v = this.getValues();
    return {
        empExpItemClass  : tsfManager.getTargetEmp().getExpItemClass(),
        deptExpItemClass : deptExpItemClass || (v.ChargeDeptId__r && v.ChargeDeptId__r.ExpItemClass__c) || null,
        expenseType      : expenseType || v.ExpenseType__c || null
    };
};

/**
 * 不整合を探す
 * @returns {number}
 */
teasp.Tsf.SectionExpAssist.prototype.getExpMatching = function(formEl){
    var select = this.fp.getElementByApiKey('PayExpItemId__c', null, (formEl || this.getFormEl())); // 精算方法
    var expItemId = (select ? (select.tagName == 'DIV'? this.dataObj.PayExpItemId__c : select.value) : null);
    var expItem = tsfManager.getInfo().getPayItemById(expItemId);
    var flag = 0;
    var chargeDept = this.getCurrentChargeDept(formEl || this.getFormEl());
    var deptExpItemClass = chargeDept && chargeDept.ExpItemClass__c || null;
    var expItemFilter = this.getExpItemFilter(this.getCurrentExpenseType(formEl || this.getFormEl()), deptExpItemClass);
    if(expItem){
        if(!expItem.checkExpenseType(expItemFilter.expenseType)){
            flag = teasp.Tsf.EmpExp.MISMATCH_EXPENSE_TYPE;
        }
        if(!expItem.isSelectable(expItemFilter.empExpItemClass)
        && !expItem.isSelectable(expItemFilter.deptExpItemClass)){
            flag |= teasp.Tsf.EmpExp.MISMATCH_EXPITEM_CLASS;
        }
    }
    return flag;
};

/**
 * 不整合を表示する
 */
teasp.Tsf.SectionExpAssist.prototype.showExpMatching = function(formEl){
    if(!this.parent.isShowMisMatch()){
        return;
    }
    var flag = this.getExpMatching(formEl);
    var select = this.fp.getElementByApiKey('PayExpItemId__c', null, (formEl || this.getFormEl())); // 精算方法
    var div = teasp.Tsf.Dom.node('div.ts-form-label', teasp.Tsf.Dom.getAncestorByCssName(select, 'ts-form-row'));
    if(div){
        var p = teasp.Tsf.Dom.node('div.ts-mismatch', div);
        if(p){
            teasp.Tsf.Dom.destroy(p);
        }
        var t = [];
        if(flag & (teasp.Tsf.EmpExp.MISMATCH_EXPENSE_TYPE)){
            t.push(teasp.message.getLabel('tf10006860')); // 精算区分不整合
        }
        if(flag & teasp.Tsf.EmpExp.MISMATCH_EXPITEM_CLASS){
            t.push(teasp.message.getLabel('tf10006870')); // 費目表示区分不整合
        }
        if(t.length){
            this.getDomHelper().create('div', { className: 'pp_ico_ng' }
                , this.getDomHelper().create('div', { className: 'ts-mismatch' }, div));
        }
        div.title = (t.length ? t.join('\r\n') : '');
    }
};

/**
 * 不整合フラグを返す
 * @returns {number}
 */
teasp.Tsf.SectionExpAssist.prototype.getMisMatchFlag = function(){
    return this.getExpMatching();
};
