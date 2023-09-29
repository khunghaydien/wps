/**
 * カード明細取り込み
 *
 * @constructor
 */
teasp.Tsf.ExpImport = function(){
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.dialogExpImport);
    this.expImportRemarks = tsfManager.getInfo().getExpPreApplyConfigs().expImportRemarks || false;
    this.EXPITEM_INTERNALPARTICIPANT_TOOLTIP_HKEY = 'expItem_internalParticipanttoolTip';
};

teasp.Tsf.ExpImport.prototype.show = function(obj, callback){
    teasp.Tsf.Error.showError();
    this.fp.setReadOnly(obj.ro);
    if(!this.dialog){
        // オプション項目の表示／非表示切替
        this.fp.fcLoop(function(fc){
            if(fc.getApiKey() == 'ChargeDeptId__c'   // 負担部署
            && !tsfManager.isRequireChargeDept()){   // 経費の負担部署を入力＝しない
                fc.setNotUse(true);
            }
        }, this);

        this.domHelper = new teasp.Tsf.Dom();
        this.dialog = new dijit.Dialog({
            title       : (obj.dialogTitle || ''), // タイトル
            className   : 'ts-dialog-exp-item'
        });
        this.dialog.attr('content', this.getContent());
        this.dialog.startup();
        this.domHelper.connect(this.dialog, 'onCancel', this, function(){ this.hide(); });
        if(dojo.isIE == 9){
            this.domHelper.connect(this.dialog, 'onKeyDown', this, function(e){ if(e.keyCode===13){ dojo.stopEvent(e); } return false; });
        }
    }
    this.entryExpItem = callback;
    this.createInternalParticipantsNumberTooltip();
    this.showData(obj);
};

teasp.Tsf.ExpImport.prototype.showData = function(obj){
    var formEl = this.getFormEl();
    this.orgData = obj;
    var vobj = this.orgData.values;

    this.expItemFilter = {
        empExpItemClass  : this.orgData.expItemClass,
        deptExpItemClass : (vobj.ChargeDeptId__r && vobj.ChargeDeptId__r.ExpItemClass__c)
                        || (this.orgData.assist && this.orgData.assist.ChargeDeptId__r && this.orgData.assist.ChargeDeptId__r.ExpItemClass__c)
                        || null,
        expenseType      : (this.orgData.assist && this.orgData.assist.ExpenseType__c) || null
    };

    var select = this.fp.getElementByApiKey('ExpItemId__c', null, formEl);
    vobj.ExpItemId__c = this.loadExpItems(select);
    this.getDomHelper().connect(select, 'onchange', this, this.changedExpItem);

    // ジョブ選択肢をセット
    var jobSelect = this.fp.getElementByApiKey('JobId__c', null, formEl);
    if(jobSelect){
        var empId = this.getValueByApiKey('EmpId__c', vobj, null);
        this.loadJobs(jobSelect, empId);
        this.getDomHelper().connect(jobSelect, 'onchange', this, this.changedJob);
    }

    // 負担部署選択肢をセット
    var deptSelect = this.fp.getElementByApiKey('ChargeDeptId__c', null, formEl);
    if(deptSelect){
        this.loadChargeDepts(deptSelect);
        this.getDomHelper().connect(deptSelect, 'onchange', this, this.changedChargeDept);
    }

    this.remarksAddMax = 0;
    if(this.expImportRemarks && this.orgData.data.records.length > 1 && !this.orgData.isExternalExpense){ // インポート対象が複数
        // 備考欄にチェックボックスを追加
        var div   = teasp.Tsf.Dom.node('.ts-row-detail div.ts-form-value', formEl);
        var label = this.getDomHelper().create('label', null, div);
        var chk   = this.getDomHelper().create('input', { type:'checkbox' }, label);
        this.getDomHelper().create('span', { innerHTML: ' ' + teasp.message.getLabel('ci00000230') }, label); // デフォルトの備考に追加
        chk.checked = true;
        this.getDomHelper().connect(chk, 'onclick', this, function(){
            this.checkedAddToRemarks();
        });
        var noteLen = 0;
        var records = this.orgData.data.records;
        for(var i = 0 ; i < records.length ; i++){
            var record = records[i];
            var v = (record.Note__c || '') + ' ';
            if(noteLen < v.length){
                noteLen = v.length;
            }
        }
        this.remarksAddMax = Math.max(255 - noteLen, 0); // デフォルトの備考に追加＝オン時の最大文字数
        this.checkedAddToRemarks(formEl);
    }

    this.fp.fcLoop(function(fc){
        if(fc.isApiField(true)){
            fc.drawText(this.getDomHelper(), vobj);
        }
    }, this);
    this.showExtraItem(formEl);

    this.dialog.show();
};

teasp.Tsf.ExpImport.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.ExpImport.prototype.getFormEl = function(){
    return teasp.Tsf.Dom.node('.ts-section-form', teasp.Tsf.Dom.byId(this.dialog.id));
};

teasp.Tsf.ExpImport.prototype.getValueByApiKey = function(apiKey, obj, defaultValue){
    var fc = this.fp.getFcByApiKey(apiKey);
    if(!fc){
        return defaultValue;
    }
    var fv = fc.parseValue(obj);
    if(fv.value === undefined || fv.value === null){
        return defaultValue;
    }
    return fv.value;
};

teasp.Tsf.ExpImport.prototype.hide = function(){
    if(this.dialog){
        this.dialog.hide();
        this.domHelper.free();
        this.dialog.destroy();
        tsfManager.removeDialog('ExpImport');
    }
};

teasp.Tsf.ExpImport.prototype.getContent = function(){
    var areaEl = this.getDomHelper().create('div', { className: 'ts-dialog ts-exp-detail', style: 'width:530px;' });
    this.getDomHelper().create('div', null
            , this.getDomHelper().create('div', { className: 'ts-error-area', style: 'width:530px;display:none;' }, areaEl));

    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form' }, areaEl);
    var pfc = null;
    var row = null;

    // 負担部署が必須なら必須表示する
    var fc = this.fp.getFcByApiKey('ChargeDeptId__c');
    fc.setRequired(tsfManager.isRequireChargeDept() == 2 ? 1 : 0);

    this.fp.fcLoop(function(fc){
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, formEl);
        }else{
            if(!pfc || !pfc.isNoNL()){
                var cssName = 'ts-form-row';
                if(fc.getApiKey() == 'ExtraItem1__c'){
                    cssName += ' ts-row-extra1';
                }else if(fc.getApiKey() == 'ExtraItem2__c'){
                    cssName += ' ts-row-extra2';
                }else if(fc.getApiKey() == 'JobId__c'){
                    cssName += ' ts-row-job';
                }else if(fc.getApiKey() == 'Detail__c'){
                    cssName += ' ts-row-detail';
                }else if(fc.getApiKey() == 'InternalParticipantsNumber__c' || fc.getApiKey() == 'InternalParticipants__c'){ // 社内参加者
                    cssName += ' ts-row-intpart';
                    if(fc.getApiKey() == 'InternalParticipantsNumber__c'){
                        cssName += ' ts-row-intpart-number';
                    }else if(fc.getApiKey() == 'InternalParticipants__c'){
                        cssName += ' ts-row-intpart-name';
                        fc.fc.height = '90px';
                    }
                }else if(fc.getApiKey() == 'ExternalParticipantsNumber__c' || fc.getApiKey() == 'ExternalParticipants__c'){ // 社外参加者
                    cssName += ' ts-row-extpart';
                    if(fc.getApiKey() == 'ExternalParticipantsNumber__c'){
                        cssName += ' ts-row-extpart-number';
                    }else if(fc.getApiKey() == 'ExternalParticipants__c'){
                        cssName += ' ts-row-extpart-name';
                        fc.fc.height = '90px';
                    }
                }else if(fc.getApiKey() == 'PlaceName__c' || fc.getApiKey() == 'PlaceAddress__c'){ // 店舗
                    cssName += ' ts-row-place';
                    if(fc.getApiKey() == 'PlaceName__c'){
                        cssName += ' ts-row-place-name';
                    }else if(fc.getApiKey() == 'PlaceAddress__c'){
                        cssName += ' ts-row-place-address';
                    }
                }
                row = this.getDomHelper().create('div', { className: cssName }, formEl);
            }
            // ラベル部作成
            var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
            if(fc.getLw()){
                teasp.Tsf.Dom.style(label, 'width', fc.getLw());
            }
            this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
            if(fc.isRequired() || /ExtraItem.__c/.test(fc.getApiKey())){ // ※ 拡張項目も必須入力にする（暫定：後で切り替え）
                this.getDomHelper().create('div', { className: 'ts-require' }, label);
            }
            // 入力欄作成
            fc.appendFieldDiv(this.getDomHelper(), row);

            pfc = fc;
        }
    }, this);

    this.setEventExpItem(formEl);   // 費目検索
    this.setEventJob(formEl);       // ジョブ
    this.setEventDept(formEl);      // 負担部署
    this.showExtraItem(formEl);     // 拡張項目
    this.setEventParticipant(formEl);// 社内・社外参加者 

    teasp.Tsf.Dom.show('.ts-row-detail', formEl, this.expImportRemarks);  // 備考欄

    this.createButtons(areaEl);

    return areaEl;
};

teasp.Tsf.ExpImport.prototype.createButtons = function(areaEl){
    var area = this.getDomHelper().create('div', { className: 'ts-dialog-buttons' }, areaEl);
    var div  = this.getDomHelper().create('div', null, area);
    var okbtn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('tf10001510')      , 'ts-dialog-ok'    , div); // 読み込み実行
    var canbtn = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('cancel_btn_title'), 'ts-dialog-cancel', div); // キャンセル

    this.getDomHelper().connect(okbtn , 'onclick', this, this.ok);
    this.getDomHelper().connect(canbtn, 'onclick', this, this.hide);
};

/**
 * 費目検索イベント
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpImport.prototype.setEventExpItem = function(formEl){
    var select = this.fp.getElementByApiKey('ExpItemId__c', null, formEl);
    if(select){
        var el = teasp.Tsf.Dom.getAncestorByCssName(select, 'ts-form-row');
        if(el){
            var btn = teasp.Tsf.Dom.node('button.ts-form-find', el);
            if(btn){
                this.getDomHelper().connect(btn, 'onclick', this, function(e){
                    var expItemIds = [];
                    var expItems = tsfManager.getExpItems(this.expItemFilter, true);
                    var receiptType = (this.orgData.recordType == '領収書');
                    var foreignJPY = tsfManager.getForeignByName(teasp.Tsf.JPY);
                    dojo.forEach(expItems, function(expItem){
                        if(!expItem.isFixAmount()  // 金額固定ではない
                        && (!receiptType || expItem.isReceipt())      // レコードタイプ!=領収書 or 領収書＝要
                        && (!receiptType || !expItem.isForeignFlag()) // レコードタイプ!=領収書 or 外貨入力ありではない
                        && (!this.orgData.isExternalExpense || !expItem.isForeignFlag() || foreignJPY) // 経費連携は外貨入力ありの費目はJPYが外貨登録されている場合のみ可
                        && (!this.orgData.isExternalExpense || !expItem.isHideWhenReadingICExpenses()) // 経費連携の場合は「IC交通費読込で表示しない」＝オンの費目を除く
                        ){
                            expItemIds.push("'" + expItem.getId() + "'");
                        }
                    }, this);
                    if(!expItemIds.length){
                        expItemIds.push("''"); // 選択可能な費目がない場合、該当なしを承知で、強制で '' をセット
                    }
                    tsfManager.showSearchListDialog({ discernment: 'expItems', delay: true, values: { Id: expItemIds.join(',') } }, null, teasp.Tsf.Dom.hitch(this, function(lst){
                        var src = lst[0];
                        var obj = {
                            ExpItemId__c : src.Id,
                            ExpItemId__r : src
                        };
                        var fc = this.fp.getFcByApiKey('ExpItemId__c');
                        fc.drawText(this.getDomHelper(), obj, null, formEl);
                        this.showExtraItem();
                    }));
                });
            }
        }
    }
};

/**
 * ジョブ関連イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpImport.prototype.setEventJob = function(formEl){
    var jobSelect = this.fp.getElementByApiKey('JobId__c', null, formEl);
    if(jobSelect){
        var el = teasp.Tsf.Dom.getAncestorByCssName(jobSelect, 'ts-form-row');
        if(el){
            var btn = teasp.Tsf.Dom.node('button.ts-form-find', el);
            if(btn){
                this.getDomHelper().connect(btn, 'onclick', this, function(e){
                    var d = teasp.util.date.formatDate(teasp.util.date.getToday());
                    var chargeDept = this.getCurrentChargeDept();
                    var deptId = (chargeDept && chargeDept.Id
                            || (this.orgData.assist && this.orgData.assist.ChargeDeptId__c)
                            || this.orgData.defaultDeptId);
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
                        var fs = [
                            { n: 'JobId__r.JobCode__c'  , v: 'JobCode__c'              },
                            { n: 'JobId__r.StartDate__c', v: 'StartDate__c'            },
                            { n: 'JobId__r.EndDate__c'  , v: 'EndDate__c'              },
                            { n: 'JobId__r.Active__c'   , v: 'Active__c'               },
                            { n: 'JobId__c'             , v: 'Id'          , d: 'Name' }
                        ];
                        var obj = {};
                        var src = lst[0];
                        this.setImportJobs(src);
                        dojo.forEach(fs, function(f){
                            var fc = this.fp.getFcByApiKey(f.n);
                            fc.fillValue(obj, { value: src[f.v], nameValue: (f.d ? src[f.d] : null) });
                            fc.drawText(this.getDomHelper(), obj, null, formEl);
                        }, this);
                    }));
                });
            }
        }
    }
};

/**
 * 負担部署イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpImport.prototype.setEventDept = function(formEl){
    var deptName = this.fp.getElementByApiKey('ChargeDeptId__c', null, formEl);
    if(deptName){
        var el = teasp.Tsf.Dom.getAncestorByCssName(deptName, 'ts-form-row');
        if(el){
            var btn = teasp.Tsf.Dom.node('button.ts-form-find', el);
            if(btn){
                this.getDomHelper().connect(btn, 'onclick', this, function(e){
                    var d = teasp.util.date.formatDate(teasp.util.date.getToday());
                    tsfManager.showSearchListDialog({ discernment : 'depts', delay: true, values: { _date: [d] } }, null, teasp.Tsf.Dom.hitch(this, function(lst){
                        var src = lst[0];
                        var obj = {
                            ChargeDeptId__c : src.Id,
                            ChargeDeptId__r : {
                                DeptCode__c     : src.DeptCode__c,
                                ExpItemClass__c : src.ExpItemClass__c,
                                Name            : src.Name
                            }
                        };
                        tsfManager.getInfo().setCacheDept(obj);
                        var fc = this.fp.getFcByApiKey('ChargeDeptId__c');
                        fc.drawText(this.getDomHelper(), obj, null, formEl);
                        // 費目選択リストを更新
                        this.expItemFilter.deptExpItemClass = obj.ChargeDeptId__r.ExpItemClass__c || null;
                        this.refreshExpItems();
                    }));
                });
            }
        }
    }
};

/**
 * 社内・社外参加者項目イベントハンドラ
 *
 * @param {Object} formEl
 */
teasp.Tsf.ExpImport.prototype.setEventParticipant = function(formEl){
    // 拡張項目
    dojo.forEach([
        this.fp.getElementByApiKey('InternalParticipantsNumber__c', null, formEl),
        this.fp.getElementByApiKey('ExternalParticipantsNumber__c', null, formEl)
    ], function(el){
        this.getDomHelper().connect(el, 'blur'      , this, this.changedparticipants);
        this.getDomHelper().connect(el, 'onkeypress', this, function(e){
            if (e.keyChar === "" && e.keyCode === 13){ // keyCharが空の場合は特殊なキー＆コードがENTERキー
                e.preventDefault();
                e.stopPropagation();
                this.changedparticipants(e);
            }
        });
    }, this);
};

/**
 * 費目プルダウンに選択肢をセット
 * （駅探検索をする費目は含めない）
 *
 * @param {Object} el
 * @returns {string}
 */
teasp.Tsf.ExpImport.prototype.loadExpItems = function(el){
    var orgv = el.value || '';
    var vmap = {};
    teasp.Tsf.Dom.empty(el);
    var receiptType     = (this.orgData.recordType == '領収書');
    this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
    var foreignJPY = tsfManager.getForeignByName(teasp.Tsf.JPY);
    var expItems = tsfManager.getExpItems(this.expItemFilter);
    var firstId = null;
    dojo.forEach(expItems, function(expItem){
        if(!expItem.isFixAmount()  // 金額固定ではない
        && (!receiptType || expItem.isReceipt())      // レコードタイプ!=領収書 or 領収書＝要
        && (!receiptType || !expItem.isForeignFlag()) // レコードタイプ!=領収書 or 外貨入力ありではない
        && (!this.orgData.isExternalExpense || !expItem.isForeignFlag() || foreignJPY) // 経費連携は外貨入力ありの費目はJPYが外貨登録されている場合のみ可
        && (!this.orgData.isExternalExpense || !expItem.isHideWhenReadingICExpenses()) // 経費連携の場合は「IC交通費読込で表示しない」＝オンの費目を除く
        ){
            this.getDomHelper().create('option', { value: expItem.getId(), innerHTML: expItem.getName() }, el);
            vmap[expItem.getId()] = 1;
            if(!firstId){
                firstId = expItem.getId();
            }
        }
    }, this);
    el.value = (orgv && vmap[orgv]) ? orgv : '';
    return el.value || firstId;
};

teasp.Tsf.ExpImport.prototype.refreshExpItems = function(){
    var select = this.fp.getElementByApiKey('ExpItemId__c', null, this.getFormEl());
    if(select){
        this.loadExpItems(select);
    }
};

/**
 * ジョブ選択肢をセット
 *
 * @param {Object} el
 */
teasp.Tsf.ExpImport.prototype.loadJobs = function(el, empId){
    var jobs = tsfManager.getEmpJobAssigns();
    teasp.Tsf.Dom.empty(el);
    this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
    dojo.forEach(jobs, function(job){
        this.getDomHelper().create('option', { value: job.getId(), innerHTML: job.getDisplayName() }, el);
    }, this);
};

/**
 * 負担部署選択肢をセット
 *
 * @param {string} d
 */
teasp.Tsf.ExpImport.prototype.loadChargeDepts = function(el){
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
 * 選択中の費目を取得
 *
 * @returns {teasp.Tsf.ExpItem}
 */
teasp.Tsf.ExpImport.prototype.getCurrentExpItem = function(){
    return tsfManager.getExpItemById(this.fp.getFcByApiKey('ExpItemId__c').fetchValue().value);
};

/**
 * 費目の選択変更
 * @param e
 */
teasp.Tsf.ExpImport.prototype.changedExpItem = function(e){
    this.showExtraItem();
};

/**
 * 費目選択変更時の処理
 * @param fe
 */
teasp.Tsf.ExpImport.prototype.showExtraItem = function(fe){
    var expItem = this.getCurrentExpItem(); // 費目
    var formEl = (fe || this.getFormEl());

    var reqChargeJob  = (expItem && expItem.isRequireChargeJob()) || 0;
    var Intparticipants = (expItem && expItem.isInternalParticipants()) || false;
    var Extparticipants = (expItem && expItem.isExternalParticipants()) || false;
    var Place = (expItem && expItem.isPlace()) || false;

    teasp.Tsf.Dom.show('.ts-row-job', formEl, reqChargeJob  > 0);  // ジョブ
    teasp.Tsf.Dom.show('.ts-row-job .ts-require', formEl, reqChargeJob == 2);  // ジョブの必須切替
    teasp.Tsf.Dom.show('.ts-row-intpart'    , formEl, Intparticipants);    // 社内参加者
    teasp.Tsf.Dom.show('.ts-row-extpart'    , formEl, Extparticipants);    // 社外参加者
    teasp.Tsf.Dom.show('.ts-row-place'      , formEl, Place);           // 店舗

    if(Intparticipants){    //社内参加者入力あり
        this.setInternalParticipants(expItem, expItem.getInternalParticipantsTemplateText());
        this.setInternalParticipantsNumber(0);
    }else{
        this.setInternalParticipants(expItem, '');
        this.setInternalParticipantsNumber(null);
    }
    if(Extparticipants){    //社外参加者入力あり
        this.setExternalParticipants(expItem, expItem.getExternalParticipantsTemplateText());
        this.setExternalParticipantsNumber(0);
    }else{
        this.setExternalParticipants(expItem, '');
        this.setExternalParticipantsNumber(null);
    }
    this.setPlaceName('');  //店舗名
    this.setPlaceAddress('');   //店舗所在地

    for(var x = 1 ; x <= 2 ; x++){
        var ex = (expItem ? expItem.getExtraItem(x) : null); // 拡張項目の情報
        teasp.Tsf.Dom.show('.ts-row-extra' + x, formEl, (ex ? true : false));
        if(ex){
            var row = teasp.Tsf.Dom.node('.ts-row-extra' + x, formEl);
            var n = teasp.Tsf.Dom.node('div.ts-form-label > div', row);
            if(n){
                n.innerHTML = (ex.name || '&nbsp;');
            }
            teasp.Tsf.Dom.show('.ts-require', row, ex.require);
            n = teasp.Tsf.Dom.node('div.ts-form-value > input', row);
            if(n){
                n.style.width = Math.min(ex.widthN, 346) + 'px';
                n.maxLength = ex.maxLength;
            }
        }
    }
};

/**
 * ジョブ変更
 * @param e
 */
teasp.Tsf.ExpImport.prototype.changedJob = function(e){
    var job = this.getCurrentJob();
    var el = this.fp.getElementByApiKey('JobId__c', null, this.getFormEl()); // ジョブ選択プルダウン
    var d = teasp.Tsf.Dom.nextSibling(el);
    if(d && d.tagName == 'INPUT'){
        d.value = (job && job.getName() || '');
    }
    el = this.fp.getElementByApiKey('JobId__r.JobCode__c'  , null, this.getFormEl());
    if(el){
        el.value = (job && job.getCode() || '');
    }
};

/**
 * 選択中のジョブを返す
 *
 * @returns {string}
 */
teasp.Tsf.ExpImport.prototype.getCurrentJob = function(){
    var el = this.fp.getElementByApiKey('JobId__c', null, this.getFormEl()); // ジョブ選択プルダウン
    var jobId = el.value || null;
    if(jobId){
        var jobs = this.getJobChoices();
        for(var i = 0 ; i < jobs.length ; i++){
            if(jobs[i].getId() == jobId){
                return jobs[i];
            }
        }
    }
    return null;
};

/**
 * ジョブ選択肢＝アサイン済みジョブと一時記憶のジョブの配列を返す
 *
 * @returns {Array.<Object>}
 */
teasp.Tsf.ExpImport.prototype.getJobChoices = function(){
    var jobs = tsfManager.getEmpJobAssigns(); // アサイン済みのジョブ
    return (this.impJobs ? jobs.concat(this.impJobs) : jobs);
};

/**
 * ジョブ検索画面で選択したジョブを一時記憶する
 * @param {Object} o
 */
teasp.Tsf.ExpImport.prototype.setImportJobs = function(o){
    var jobs = this.getJobChoices();
    var f = false;
    for(var i = 0 ; i < jobs.length ; i++){
        if(jobs[i].getId() == o.Id){
            f = true;
            break;
        }
    }
    if(!f){
        this.impJobs = [new teasp.Tsf.Job(o)];
    }
};

/**
 * 負担部署変更
 * @param e
 */
teasp.Tsf.ExpImport.prototype.changedChargeDept = function(e){
    var chargeDept = this.getCurrentChargeDept();
    var el = this.fp.getElementByApiKey('ChargeDeptId__c', null, this.getFormEl()); // 負担部署選択プルダウン
    var d = teasp.Tsf.Dom.nextSibling(el);
    if(d && d.tagName == 'INPUT'){ d.value = (chargeDept && chargeDept.Name || ''); }
    el = this.fp.getElementByApiKey('ChargeDeptId__r.DeptCode__c', null, this.getFormEl());
    if(el){ el.value = (chargeDept && chargeDept.DeptCode__c || ''); }
    // 費目選択リストを更新
    this.expItemFilter.deptExpItemClass = (chargeDept && chargeDept.ExpItemClass__c || null);
    this.refreshExpItems();
};

/**
 * 選択中の負担部署を返す
 *
 * @returns {string}
 */
teasp.Tsf.ExpImport.prototype.getCurrentChargeDept = function(){
    var el = this.fp.getElementByApiKey('ChargeDeptId__c', null, this.getFormEl()); // 負担部署選択プルダウン
    return (el && tsfManager.getInfo().getCacheDept(el.value || null) || null);
};

teasp.Tsf.ExpImport.prototype.showError = function(result){
    var er = teasp.Tsf.Dom.node('.ts-error-area', teasp.Tsf.Dom.byId(this.dialog.id));
    teasp.Tsf.Error.showError(result, er);
};

teasp.Tsf.ExpImport.prototype.ok = function(e){
    if(this.entryExpItem){
        var expItem = this.getCurrentExpItem(); // 費目
        if(!expItem){
            this.showError(teasp.message.getLabel('tf10001680')); // 費目を選択してください
            return;
        }
        var vobj = {};
        this.fp.fcLoop(function(fc){
            if(fc.isApiField(true)){
                fc.fillValue(vobj, fc.fetchValue());
            }
        }, this);

        // 会議・交際費のバリデーション
        if(expItem.isInternalParticipants() && expItem.isExternalParticipants()){
                // 費目種別が会議交際費かつ[社内参加者]＝入力する, [社外参加者]＝入力する
            if((vobj.InternalParticipantsNumber__c - 0) == 0 && (vobj.ExternalParticipantsNumber__c - 0) == 0){
                this.showError(teasp.message.getLabel('tf10001851')); // 合計人数が1人以上になるように社内参加人数と社外参加人数を入力してください。
                return null;
            }else if((vobj.InternalParticipantsNumber__c - 0) < 0 || (vobj.ExternalParticipantsNumber__c - 0) < 0){
                this.showError(teasp.message.getLabel('tf10001852')); // 0以上を入力してください。
                return null;
            }
        } else if(expItem.isInternalParticipants() && !expItem.isExternalParticipants()){
                // 費目種別が会議交際費かつ[社内参加者]＝入力する
                if((vobj.InternalParticipantsNumber__c - 0) <= 0){
                    this.showError(teasp.message.getLabel('tf10001854')); // 社内参加者
                    return null;
                }
        }else if(!expItem.isInternalParticipants() && expItem.isExternalParticipants()){
                // 費目種別が会議交際費かつ[社外参加者]＝入力する
                if((vobj.ExternalParticipantsNumber__c - 0) <= 0){
                    this.showError(teasp.message.getLabel('tf10001855')); // 社外参加者
                    return null;
                }
        }

        // 会議・交際費の項目に値を設定（設定値＝入力しないの項目は値を空に設定する）
        if(!expItem.isInternalParticipants()){
            vobj.InternalParticipantsNumber__c = null;
            vobj.InternalParticipants__c = null;
        }
        if(!expItem.isExternalParticipants()){
            vobj.ExternalParticipantsNumber__c = null;
            vobj.ExternalParticipants__c = null;
        }
        if(!expItem.isPlace()){
            vobj.PlaceName__c = null;
            vobj.PlaceAddress__c = null;
        }

        // ジョブ
        var reqChargeJob = expItem.isRequireChargeJob();
        if(reqChargeJob == 2 && !vobj.JobId__c){
            this.showError(teasp.message.getLabel('tf10001710')); // ジョブを入力してください
            return;
        }
        // 負担部署
        var reqChargeDept = tsfManager.isRequireChargeDept();
        if(reqChargeDept == 2 && !vobj.ChargeDeptId__c){
            this.showError(teasp.message.getLabel('tf10006030')); // 負担部署を入力してください
            return;
        }
        var chargeDept = {};
        if(reqChargeDept > 0){ // 負担部署を入力する
            chargeDept.Id = vobj.ChargeDeptId__c || null;
            if(vobj.ChargeDeptId__r){
                chargeDept.DeptCode__c  = vobj.ChargeDeptId__r.DeptCode__c || null;
                chargeDept.Name         = vobj.ChargeDeptId__r.Name || null;
            }
        }
        // 拡張項目1
        var ex1 = expItem.getExtraItem(1);
        if(!ex1){
            vobj.ExtraItem1__c = null;
        }else if(ex1.require){
            if(!vobj.ExtraItem1__c){
                this.showError(teasp.message.getLabel('tf10001840', ex1.name)); // {0}を入力してください。
                return null;
            }
        }
        if(ex1 && vobj.ExtraItem1__c && ex1.maxLength < vobj.ExtraItem1__c.length){
            this.showError(teasp.message.getLabel('tm00000020', ex1.name, ex1.maxLength)); // {0}の最大文字数は{1}文字です
            return;
        }
        // 拡張項目2
        var ex2 = expItem.getExtraItem(2);
        if(!ex2){
            vobj.ExtraItem2__c = null;
        }else if(ex2.require){
            if(!vobj.ExtraItem2__c){
                this.showError(teasp.message.getLabel('tf10001840', ex2.name)); // {0}を入力してください。
                return null;
            }
        }
        if(ex2 && vobj.ExtraItem2__c && ex2.maxLength < vobj.ExtraItem2__c.length){
            this.showError(teasp.message.getLabel('tm00000020', ex2.name, ex2.maxLength)); // {0}の最大文字数は{1}文字です
            return;
        }
        // デフォルトの備考の後に追加チェックボックス
        var addRemarks = false;
        var chk = teasp.Tsf.Dom.node('.ts-row-detail div.ts-form-value input[type="checkbox"]', this.getFormEl());
        if(chk){
            addRemarks = chk.checked;
        }
        var note = null;
        if(this.expImportRemarks){ // 備考入力オン
            // 備考の文字数制限チェック
            note = (vobj.Detail__c || '').replace(/\r?\n/g, ' ');
            if((addRemarks && note.length > this.remarksAddMax) || note.length > 255){
                this.showError(teasp.message.getLabel('ci00000240' // {0}の文字数が制限({1})を超えています。
                        , teasp.message.getLabel('note_caption')
                        , (addRemarks ? this.remarksAddMax : 255)));
                return null;
            }
        }

        var job = (reqChargeJob > 0 ? this.getCurrentJob() : null);

        var data = this.orgData.data;
        var expApply = this.orgData.expApply;

        var exps = [];
        var ng = {};
        if(this.orgData.isExternalExpense){ // 経費連携のレコード
            data.records = data.records.sort(function(a, b){
                if(a.UsageDate__c == b.UsageDate__c){
                    return (a.RegistrationDate__c < b.RegistrationDate__c ? -1 : 1);
                }
                return (a.UsageDate__c < b.UsageDate__c ? -1 : 1);
            });
        }
        for(var i = 0 ; i < data.records.length ; i++){
            var record = data.records[i];
            if(this.expImportRemarks){
                if(addRemarks){
                    record.Note__c = (record.Note__c || '') + (note.length ? (' ' + note) : '');
                }else{
                    record.Note__c = note;
                }
            }
            // 会議・交際費情報
            record.InternalParticipantsNumber__c = vobj.InternalParticipantsNumber__c
            record.InternalParticipants__c = vobj.InternalParticipants__c;
            record.ExternalParticipantsNumber__c = vobj.ExternalParticipantsNumber__c;
            record.ExternalParticipants__c = vobj.ExternalParticipants__c;
            record.PlaceName__c = vobj.PlaceName__c;
            record.PlaceAddress__c = vobj.PlaceAddress__c;

            if(this.orgData.isExternalExpense){ // 経費連携のレコード
                exps.push(expApply.createEmpExpFromExternalExpense(expItem, job, chargeDept, vobj.ExtraItem1__c, vobj.ExtraItem2__c, record, (this.orgData.expenseType || null), ng));
            }else{
                exps.push(expApply.createEmpExpFromCard(expItem, job, chargeDept, vobj.ExtraItem1__c, vobj.ExtraItem2__c, record, (this.orgData.expenseType || null), ng));
            }
        }
        if(ng.f){
            this.showError(ng.f.message); // 指定の費目とデータがアンマッチ
            return;
        }

        expApply.addEmpExps(exps);

        this.entryExpItem();
    }
    this.hide();
};

/**
 * デフォルトの備考に追加チェックボックス変更
 * @param {Object=} fe
 */
teasp.Tsf.ExpImport.prototype.checkedAddToRemarks = function(fe){
    var formEl = (fe || this.getFormEl());
    var div = teasp.Tsf.Dom.node('.ts-row-detail div.ts-form-value', formEl);
    var chk = teasp.Tsf.Dom.node('input[type="checkbox"]', div); // デフォルトの備考に追加
    var textArea = teasp.Tsf.Dom.node('textarea', div);
    // オンなら追加時の最大文字数、オフなら255文字をテキストエリアのmaxLengthにセット
    teasp.Tsf.Dom.setAttr(textArea, 'maxLength', (chk.checked ? this.remarksAddMax : 255));
};

/**
 * 参加人数を変更
 * @param {Object} e
 */
teasp.Tsf.ExpImport.prototype.changedparticipants = function(e){
    var expItem = this.getCurrentExpItem();

    //マイナス符号チェック
    this.setInternalParticipantsNumber(this.getInternalParticipantsNumber(expItem))
    this.setExternalParticipantsNumber(this.getExternalParticipantsNumber(expItem))
};

/**
 * 社内参加人数を取得
 * 
 * @param {teasp.Tsf.ExpItem} expItem
 * @param {boolean=} flag =trueの場合、空欄ならnullを返す。falseまたは省略の場合、空欄なら 0 を返す。
 * @returns {number|null}
 */
teasp.Tsf.ExpImport.prototype.getInternalParticipantsNumber = function(expItem, flag){
    var v = this.fp.getFcByApiKey('InternalParticipantsNumber__c').fetchValue().value;
    if(flag && (v === null || v == '')){
        return null;
    }
    var participants  = teasp.util.currency.string2number('' + v); // 社内参加人数
    return parseInt(participants.sn1);
};

/**
 * 社内参加人数をセット
 * 
 * @param {teasp.Tsf.ExpItem} expItem
 * @param {Number} val
 */
teasp.Tsf.ExpImport.prototype.setInternalParticipantsNumber = function(val){
    var participants = this.fp.getElementByApiKey('InternalParticipantsNumber__c', this.getFormEl());
    if(participants){
        participants.value = val;
    }
};

/**
 * 社内参加者を取得
 * 
 * @returns {String|null}
 */
teasp.Tsf.ExpImport.prototype.getInternalParticipants = function(){
    var participants = this.fp.getFcByApiKey('InternalParticipants__c').fetchValue().value;
    return participants || null;
};

/**
 * 社内参加者をセット
 * 
 * @param {String} val
 */
teasp.Tsf.ExpImport.prototype.setInternalParticipants = function(expItem, val){
    var participants = this.fp.getElementByApiKey('InternalParticipants__c', this.getFormEl());
    if(participants){
        participants.value = val;
    }
};

/**
 * 社外参加人数を取得
 * 
 * @param {teasp.Tsf.ExpItem} expItem
 * @param {boolean=} flag =trueの場合、空欄ならnullを返す。falseまたは省略の場合、空欄なら 0 を返す。
 * @returns {number|null}
 */

teasp.Tsf.ExpImport.prototype.getExternalParticipantsNumber = function(expItem, flag){
    var v = this.fp.getFcByApiKey('ExternalParticipantsNumber__c').fetchValue().value;
    if(flag && (v === null || v == '')){
        return null;
    }
    var participants  = teasp.util.currency.string2number('' + v); // 社外参加人数
    return parseInt(participants.sn1);
};

/**
 * 社外参加人数をセット
 * 
 * @param {Number} val
 */
teasp.Tsf.ExpImport.prototype.setExternalParticipantsNumber = function(val){
    var participants = this.fp.getElementByApiKey('ExternalParticipantsNumber__c', this.getFormEl());
    if(participants){
        participants.value = val;
    }
};

/**
 * 社外参加者を取得
 * 
 * @param {teasp.Tsf.ExpItem} expItem
 * @returns {String|null}
 */
teasp.Tsf.ExpImport.prototype.getExternalParticipants = function(expItem){
    var participants = this.fp.getFcByApiKey('ExternalParticipants__c').fetchValue().value;
    return participants || null;
};

/**
 * 社外参加者をセット
 * 
 * @param {teasp.Tsf.ExpItem} expItem
 * @param {String} val
 */
teasp.Tsf.ExpImport.prototype.setExternalParticipants = function(expItem, val){
    var participants = this.fp.getElementByApiKey('ExternalParticipants__c', this.getFormEl());
    if(participants){
        participants.value = val;
    }
};

/**
 * 店舗名をセット
 * 
 * @param {Number} val
 */
teasp.Tsf.ExpImport.prototype.setPlaceName = function(val){
    var Place = this.fp.getElementByApiKey('PlaceName__c', this.getFormEl());
    if(Place){
        Place.value = val;
    }
};

/**
 * 店舗所在地をセット
 * 
 * @param {Number} val
 */
teasp.Tsf.ExpImport.prototype.setPlaceAddress = function(val){
    var Place = this.fp.getElementByApiKey('PlaceAddress__c', this.getFormEl());
    if(Place){
        Place.value = val;
    }
};

/**
 * 社内参加者人数項目にツールチップを設定する
 */
teasp.Tsf.ExpImport.prototype.createInternalParticipantsNumberTooltip = function(){
    this.getDomHelper().freeBy(this.EXPITEM_INTERNALPARTICIPANT_TOOLTIP_HKEY);
    var select = this.fp.getElementByApiKey('InternalParticipantsNumber__c', null, this.getFormEl());
    if(select){
        this.getDomHelper().createTooltip({
            connectId   : select.parentNode,
            label       : teasp.message.getLabel('tf10001853'),
            position    : ['before'],
            showDelay   : 100
        }, this.EXPITEM_INTERNALPARTICIPANT_TOOLTIP_HKEY);
    }
};