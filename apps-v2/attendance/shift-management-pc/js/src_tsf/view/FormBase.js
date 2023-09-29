/**
 * フォーム基底クラス
 *
 * @constructor
 */
teasp.Tsf.FormBase = function(){
    this.parentId = 'tsfFormArea';
    this.sectionExpAssist = null;
    this.sectionExpFilter = null;
};

/**
 * フォームインスタンス生成
 *
 * @static
 * @param {string} view
 * @returns {Object}
 */
teasp.Tsf.FormBase.factory = function(view){
    return new teasp.Tsf[view]();
};

/**
 * フォームインスタンス破棄
 *
 * @param {Object} inst
 * @returns {null}
 */
teasp.Tsf.FormBase.erase = function(inst){
    if(inst){
        inst.destroy();
        delete inst;
    }
    return null;
};

teasp.Tsf.FormBase.prototype.getFormStyle = function(){ return 0; };

teasp.Tsf.FormBase.prototype.getArea = function(){
    return teasp.Tsf.Dom.byId(this.fp.getAreaId());
};

teasp.Tsf.FormBase.prototype.getTailArea = function(){
    return teasp.Tsf.Dom.node('div.ts-form-tail', this.getArea());
};

teasp.Tsf.FormBase.prototype.getObjBase = function(){
    return this.objBase;
};

teasp.Tsf.FormBase.prototype.isReadOnly = function(){
    return (this.objBase ? this.objBase.isReadOnly() : false);
};

teasp.Tsf.FormBase.prototype.isChangableEditMode = function(){
    return (this.objBase ? this.objBase.isChangableEditMode() : false);
};

teasp.Tsf.FormBase.prototype.setReadOnly = function(ro){
    this.fp.setReadOnly(ro);
    for(var i = 0 ; i < this.sections.length ; i++){
        this.sections[i].setReadOnly(ro);
    }
};

teasp.Tsf.FormBase.prototype.getDeptId = function(){
    return (this.objBase && this.objBase.getDeptId() || null);
};

teasp.Tsf.FormBase.prototype.getDept = function(){
    return (this.objBase && this.objBase.getDept() || null);
};

/**
 * フォームを破棄（リソース解放、DOMを削除）
 */
teasp.Tsf.FormBase.prototype.destroy = function(){
    if(this.domHelper){
        this.domHelper.free();
        teasp.Tsf.Dom.empty(this.parentId);
        teasp.Tsf.Dom.empty(this.getTailArea());
        delete this.domHelper;
    }
    this.domHelper = null;
};

teasp.Tsf.FormBase.prototype.savePoint = function(){
    this.saveData = teasp.Tsf.util.toJson(this.getDomValues(true));
};

teasp.Tsf.FormBase.prototype.checkDiff = function(){
    var data = teasp.Tsf.util.toJson(this.getDomValues(true));
    return (this.saveData != data);
};

/**
 * イベントハンドラの設定を仲介
 * 後で解放できるように、connect の戻り値をメンバ配列にセットする。
 *
 * @param {Object|string} target
 * @param {string} event
 * @param {Object|null} context
 * @param {Function} method
 * @param {boolean} dontFix
 */
teasp.Tsf.FormBase.prototype.connect = function(target, event, context, method, dontFix){
    this.domHelper.connect(target, event, context, method, dontFix);
};

/**
 * 非表示にする
 */
teasp.Tsf.FormBase.prototype.hide = function(){
    teasp.Tsf.Dom.show(this.fp.getAreaId(), teasp.Tsf.Dom.byId(teasp.Tsf.ROOT_AREA_ID), false);
};

/**
 * 表示する
 */
teasp.Tsf.FormBase.prototype.show = function(){
    var area = teasp.Tsf.Dom.byId(teasp.Tsf.ROOT_AREA_ID);
    teasp.Tsf.Dom.show(this.fp.getAreaId(), area, true);
};

/**
 * 表示する
 *
 * @param {Object} objBase
 */
teasp.Tsf.FormBase.prototype.refresh = function(objBase, mode){
    this.objBase = objBase;
    this.objBase.setMode(mode);
    var area = tsfManager.getArea();

    this.setReadOnly(this.isReadOnly());

    this.init();

    var hiddenApply = (!this.objBase.getId() && !this.objBase.isCreateFlag() && tsfManager.getInfo().isHiddenApplyBtn()); // 未申請明細画面で、承認申請ボタンを非表示にする

    // 申請番号
    teasp.Tsf.Dom.query('.ts-apply-no', area).forEach(function(el){
        el.innerHTML = this.objBase.getApplyNo() || teasp.message.getLabel('tf10001940'); // (新規)
    }, this);

    // ステータス
    teasp.Tsf.Dom.query('.ts-form-control .ts-form-status button', area).forEach(function(el){
        teasp.Tsf.Dom.empty(el);
        this.getDomHelper().create('div', { className: 'png-' + this.objBase.getStatusInfo().icon }, el);
        this.getDomHelper().create('div', { innerHTML: this.objBase.getStatusInfo().text          }, el);
    }, this);

    if(this.objBase.isRemoved()){ // 論理削除されている
        this.getDomHelper().create('div', {
            innerHTML : teasp.message.getLabel('tf10007760'), // この申請は削除されています。
            className : 'ts-form-removed'
        }, dojo.byId('tsfFormArea').firstChild, 'before');
    }

    // ジョブ選択肢をセット
    this.loadJobs(this.objBase.getStartDate(), this.objBase.getEndDate());
    this.checkImportJobs(this.objBase.getDataObj());

    this.fp.fcLoop(function(fc){
        fc.drawText(this.getDomHelper(), this.objBase.getDataObj());
    }, this);

    this.beforeRefreshSections();

    dojo.forEach(this.sections, function(section){
        section.refresh();
        section.open(section.existValue());
    }, this);

    // ステータス欄の表示/非表示
    teasp.Tsf.Dom.show('.ts-form-control .ts-form-status-label', null, !hiddenApply);
    teasp.Tsf.Dom.show('.ts-form-control .ts-form-status'      , null, !hiddenApply);
    if(!hiddenApply){
        teasp.Tsf.Dom.setAttr2('.ts-form-control .ts-form-status button', area, 'disabled', (this.objBase.getId() ? false : true));
        this.getDomHelper().connect(teasp.Tsf.Dom.query('.ts-form-control .ts-form-status > button', area), 'onclick', this, this.statusHistory);
    }

    // 承認申請ボタン
    var applyButtonLabel = (hiddenApply ? null : this.getApplyButtonLabel());

    teasp.Tsf.Dom.show('.ts-form-control .ts-form-delete'   , area, this.objBase.isDeletable());    // 削除ボタンの表示/非表示
    teasp.Tsf.Dom.show('.ts-form-control .ts-form-copy'     , area, this.objBase.isCopyable());     // コピーボタンの表示/非表示
    teasp.Tsf.Dom.show('.ts-form-control .ts-form-save'     , area, this.objBase.isEditable(true)); // 一時保存ボタンの表示/非表示
    teasp.Tsf.Dom.show('.ts-form-control .ts-form-cancel'   , area, this.objBase.isEditable(true) && this.objBase.isManifestEditMode()); // キャンセルボタンの表示/非表示
    teasp.Tsf.Dom.show('.ts-form-control .ts-apply-button'  , area, applyButtonLabel);              // 承認申請ボタンの表示/非表示

    if(applyButtonLabel){
        // ラベル
        teasp.Tsf.Dom.query('.ts-form-control .ts-apply-button > button', area).forEach(function(el){
            el.innerHTML = this.getApplyButtonLabel();
        }, this);
        // クリック時処理
        this.domHelper.connect(teasp.Tsf.Dom.query('.ts-form-control .ts-apply-button > button', area), 'onclick', this, this.submitApply);
    }

    teasp.Tsf.Dom.show('.ts-form-control .ts-approve-button', area, this.objBase.isPiwk()); // 承認/却下ボタンの表示/非表示
    // 承認/却下ボタンクリック時処理
    if(this.objBase.isPiwk()){
        var btn = teasp.Tsf.Dom.query('.ts-form-control .ts-approve-button > button', area);
        if(this.objBase.isCancelApplyWait()){ // 取消伝票の承認待ちの場合は、表示名を変える
            teasp.Tsf.Dom.html('.ts-approve-button > button', null, teasp.message.getLabel('tf10006250')); // 取消伝票の承認／却下
            this.domHelper.connect(btn, 'onclick', this, this.approveCancelApply);
        }else{
            teasp.Tsf.Dom.html('.ts-approve-button > button', null, teasp.message.getLabel('tf10000270')); // 承認／却下
            this.domHelper.connect(btn, 'onclick', this, this.approveApply);
        }
    }
    // 精算開始ボタン
    var stbtn = teasp.Tsf.Dom.query('.ts-form-control .ts-apply-start > button', area);
    if(!this.objBase.getId() && !this.objBase.isCreateFlag() && tsfManager.getInfo().isApplyByDetails()){
        teasp.Tsf.Dom.html('.ts-apply-start > button', null, teasp.message.getLabel('tf10009570')); // 精算開始
        teasp.Tsf.Dom.show('.ts-form-control .ts-apply-start', area, true);
        this.domHelper.connect(stbtn, 'onclick', this, this.createExpApplyCheck);
    }else{
        teasp.Tsf.Dom.show('.ts-form-control .ts-apply-start', area, false);
    }

    // 印刷
    var prn = teasp.Tsf.Dom.node('.ts-form-control .ts-form-print > button');
    if(prn){
        this.domHelper.connect(prn, 'onclick', this, function(){
            this.openPrintCheck();
        });
    }

    // 編集ボタン
    var changableEditMode = this.isChangableEditMode();
    var n = teasp.Tsf.Dom.node('.ts-form-control .ts-edit-button', area);
    if(n){
        teasp.Tsf.Dom.show(n, null, changableEditMode); // 可視/不可視
        if(changableEditMode){
            this.domHelper.connect(teasp.Tsf.Dom.query('button', n), 'onclick', this, this.changeEditMode);
        }
    }

    // コピー
    var copy = teasp.Tsf.Dom.node('.ts-form-control .ts-form-copy > button', area);
    if(copy){
        this.getDomHelper().connect(copy, 'onclick', this, this.doCopy);
    }

    // 履歴から読込
    var hist = teasp.Tsf.Dom.node('.ts-form-control .ts-form-histexp > button', area);
    if(hist){
        this.getDomHelper().connect(hist, 'onclick', this, function(){
            this.selectHistory();
        });
    }

    // CSVから読込
    var hist = teasp.Tsf.Dom.node('.ts-form-control .ts-form-csvup > button', area);
    if(hist){
        this.getDomHelper().connect(hist, 'onclick', this, this.openCsvImport);
    }

    // 一時保存
    this.domHelper.connect(teasp.Tsf.Dom.query('.ts-form-control .ts-form-save > button', tsfManager.getArea()), 'onclick', this, this.temporarySave);

    // キャンセル
    this.domHelper.connect(teasp.Tsf.Dom.query('.ts-form-control .ts-form-cancel > button', tsfManager.getArea()), 'onclick', this, function(e){
        tsfManager.changeView(null, this.objBase.getId());
    });

    this.show();

    this.adjustTopMargin();
};

/**
 * 一時保存
 * ※経費申請の一時保存は、オーバーライドした方のメソッドを呼ぶ
 *
 * @param e
 */
teasp.Tsf.FormBase.prototype.temporarySave = function(e){
    // 事前申請の一時保存
    tsfManager.saveExpPreApply(!this.objBase.getId() ? true : false, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            tsfManager.changeView(null, result); // ※ result には Id がセットされている。
        }else{
            teasp.Tsf.Error.showError(result);
        }
    }));
};

teasp.Tsf.FormBase.prototype.adjustTopMargin = function(){
    // 一番上のセクションバーだけ margin-top を 0 にする
    var bars = teasp.Tsf.Dom.query('div.ts-section-bar2');
    for(var i = 0 ; i < bars.length ; i++){
        var bar = bars[i];
        if(teasp.Tsf.Dom.isVisible(bar)){
            div = teasp.Tsf.Dom.style(bar, 'margin-top', '0px');
            break;
        }
    };
};

/**
 * 初期化
 *
 */
teasp.Tsf.FormBase.prototype.init = function(){
    this.domHelper = new teasp.Tsf.Dom();

    this.createBase();

    teasp.Tsf.Dom.html('.ts-form-header .ts-form-title > div', null, this.fp.getTitle());

    // セクションバー内のチェックボックスがクリックされた時の処理
    this.domHelper.connect(teasp.Tsf.Dom.query('.ts-section-check input[type="checkbox"]'), 'onclick', this, function(e){
        var bar = teasp.Tsf.Dom.getAncestorByCssName(e.target, 'ts-section-bar2');
        this.toggleSection(bar, e.target.checked);
    });
};

teasp.Tsf.FormBase.prototype.createBase = function(){
    var areaEl = this.getDomHelper().create('div', { id: this.fp.getAreaId() });

    this.sectionEmp = new teasp.Tsf.SectionEmp(this);
    teasp.Tsf.Dom.append(areaEl, this.sectionEmp.createArea());

    if(this.getSectionTitle()){
        teasp.Tsf.Dom.append(areaEl, teasp.Tsf.SectionBase.createSectionBar(this.getDomHelper(), this.getSectionTitle(), false));
    }
    if(this.isUseExpFilter(true)){
        this.sectionExpFilter = new teasp.Tsf.SectionExpFilter(this);   // 経費明細フィルタセクション
        teasp.Tsf.Dom.append(areaEl, this.sectionExpFilter.createArea());
    }
    var formEl = this.getDomHelper().create('div', { className: 'ts-main-form ts-section-form ts-zone-type1' }, areaEl);
    var fz1 = null, fz2 = null;

    if(teasp.Tsf.SectionExpAssist.isUse(this.objBase)){
        this.sectionExpAssist = new teasp.Tsf.SectionExpAssist(this);
        this.sectionExpAssist.setReadOnly(this.isReadOnly());

        if(this.getFormStyle() == 0){
            teasp.Tsf.Dom.append(areaEl, this.sectionExpAssist.createArea());
            fz1 = formEl;
        }else{
            fz1 = this.getDomHelper().create('div', { className: 'ts-section-z1' }, formEl);
            fz2 = this.getDomHelper().create('div', { className: 'ts-section-z2' }, formEl);
            teasp.Tsf.Dom.append(fz2, this.sectionExpAssist.createArea());
        }
    }else{
        fz1 = formEl;
    }

    var row = null;
    var pfc = null;
    var cnt = 0;
    this.fp.fcLoop(function(fc){
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, fz1);
        }else{
            if(!pfc || !pfc.isNoNL()){
                row = this.getDomHelper().create('div', { className: 'ts-form-row' }, fz1);
            }
            var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row); // ラベル部作成
            if(fc.getTooltipMsgId()){
                teasp.Tsf.Dom.addClass(label, 'ts-tooltip');
            }
            if(fc.getLw()){
                teasp.Tsf.Dom.style(label, 'width', fc.getLw());
            }
            this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
            if(fc.isRequired()){
                this.getDomHelper().create('div', { className: 'ts-require' }, label);
            }
            if(fc.getTooltipMsgId()){
                var icon = this.getDomHelper().create('div', { className:'pp_base pp_icon_help' }, label);
                this.getDomHelper().createTooltip({
                    connectId   : icon,
                    label       : teasp.message.getLabel(fc.getTooltipMsgId()),
                    position    : ['below'],
                    showDelay   : 200
                });
            }
            fc.appendFieldDiv(this.getDomHelper(), row); // 入力欄作成
            pfc = fc;
            cnt++;
        }
    }, this);

    teasp.Tsf.Dom.show(formEl, null, cnt > 0);

    this.createSections(areaEl);           // セクションエリア作成

    teasp.Tsf.Dom.append(teasp.Tsf.Dom.byId(this.parentId), areaEl);

    // 読み取り専用の場合、セクションバーのチェックボックスを非表示にする。
    if(this.isReadOnly()){
        teasp.Tsf.Dom.query('div.ts-section-bar2 .ts-section-check > input[type="checkbox"]').forEach(function(el){
            teasp.Tsf.Dom.show(el, null, false);
        });
    }

    this.showTotalValue(); // 合計金額欄の表示切替

    this.fillDeptField(areaEl);            // 部署選択プルダウンに選択肢をセット
    this.setEventDateField(areaEl);        // 日付選択のイベント処理
    this.setEventTimeField(areaEl);        // 時刻入力欄のイベント処理
    this.setEventCurrencyField(areaEl);    // 金額入力欄のイベント処理

    teasp.Tsf.Dom.setlimitChars(this.getDomHelper()
        , teasp.Tsf.Dom.query('textarea', areaEl)
        , this.fp); // テキストエリアの文字数制限（IE8以下）

    // ジョブ選択
    var jobSelect = this.fp.getElementByApiKey('ChargeJobId__c', null, areaEl);
    if(jobSelect){
        // ジョブ検索ボタンクリック
        var btn = teasp.Tsf.Dom.node('button.ts-form-find', teasp.Tsf.Dom.getAncestorByCssName(jobSelect, 'ts-form-row'));
        if(btn){
            this.getDomHelper().connect(btn, 'onclick', this, function(e){
                var fc = this.fp.getFcByApiKey('StartDate__c');
                var d = fc.fetchValue().value || teasp.util.date.formatDate(teasp.util.date.getToday());
                var assist = this.getAssist();
                var deptId = (assist && assist.ChargeDeptId__c || this.objBase.getDeptId(true));
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
                        { n: 'ChargeJobId__r.JobCode__c'  , v: 'JobCode__c'              },
                        { n: 'ChargeJobId__r.StartDate__c', v: 'StartDate__c'            },
                        { n: 'ChargeJobId__r.EndDate__c'  , v: 'EndDate__c'              },
                        { n: 'ChargeJobId__r.Active__c'   , v: 'Active__c'               },
                        { n: 'ChargeJobId__c'             , v: 'Id'          , d: 'Name' }
                    ];
                    var obj = {};
                    var src = lst[0];
                    this.setImportJobs(src);
                    dojo.forEach(fs, function(f){
                        var fc = this.fp.getFcByApiKey(f.n);
                        fc.fillValue(obj, { value: src[f.v], nameValue: (f.d ? src[f.d] : null) });
                        fc.drawText(this.getDomHelper(), obj, null, areaEl);
                    }, this);
                }));
            });
        }
        this.getDomHelper().connect(jobSelect, 'onchange', this, this.changedJob);
    }

    // 取引先選択
    var oppSelect = this.fp.getElementByApiKey('AccountName__c', null, areaEl);
    if(oppSelect){
        // 商談検索ボタンクリック
        var btn = teasp.Tsf.Dom.node('button.ts-form-find', teasp.Tsf.Dom.getAncestorByCssName(oppSelect, 'ts-form-row'));
        if(btn){
            this.getDomHelper().connect(btn, 'onclick', this, function(e){
                tsfManager.showSearchListDialog({ discernment : 'accounts' }, null, teasp.Tsf.Dom.hitch(this, function(lst){
                    var fc1 = this.fp.getFcByApiKey('AccountName__c');
                    var fc2 = this.fp.getFcByApiKey('AccountId__c');
                    var o1 = { value: lst[0].dispValue };
                    var o2 = { value: lst[0].value     };
                    var obj = {};
                    fc1.fillValue(obj, o1);
                    fc2.fillValue(obj, o2);
                    fc1.drawText(this.getDomHelper(), obj, null, areaEl);
                    fc2.drawText(this.getDomHelper(), obj, null, areaEl);
                }));
            });
        }
    }

    return areaEl;
};

/**
 * ジョブ選択肢をセット
 *
 * @param {string|null} _sd
 * @param {string|null} _ed
 */
teasp.Tsf.FormBase.prototype.loadJobs = function(_sd, _ed){
    var el = this.fp.getElementByApiKey('ChargeJobId__c', null, this.getArea()); // ジョブ選択プルダウン
    if(el && el.tagName == 'SELECT'){
        var sel = el.value;
        var jobs = this.getJobChoices(); // ジョブ選択肢
        var sd = (_sd || this.getStartDate());
        var ed = (_ed || this.getEndDate());
        var mp = {};
        teasp.Tsf.Dom.empty(el);
        this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
        dojo.forEach(jobs, function(job){
            var jobId = job.getId();
            if((job.activeOnDate(sd, ed) || jobId == sel) && !mp[jobId]){
                this.getDomHelper().create('option', { value: jobId, innerHTML: job.getDisplayName() }, el);
                mp[jobId] = 1;
            }
        }, this);
        if(mp[sel]){
            el.value = sel;
        }
    }
};

/**
 * 選択中のジョブを返す
 *
 * @returns {string}
 */
teasp.Tsf.FormBase.prototype.getCurrentJob = function(){
    var el = this.fp.getElementByApiKey('ChargeJobId__c', null, this.getArea()); // ジョブ選択プルダウン
    if(el){
        var jobId = el.value || null;
        if(jobId){
            var jobs = this.getJobChoices();
            for(var i = 0 ; i < jobs.length ; i++){
                if(jobs[i].getId() == jobId){
                    return jobs[i];
                }
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
teasp.Tsf.FormBase.prototype.getJobChoices = function(){
    var jobs = tsfManager.getEmpJobAssigns(); // アサイン済みのジョブ
    return (this.impJobs ? jobs.concat(this.impJobs) : jobs);
};

/**
 * ジョブ検索画面で選択したジョブを一時記憶する
 * @param {Object} o
 */
teasp.Tsf.FormBase.prototype.setImportJobs = function(o){
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

teasp.Tsf.FormBase.prototype.checkImportJobs = function(p){
    if(p.ChargeJobId__c && p.ChargeJobId__r){
        this.setImportJobs({
            Id              : p.ChargeJobId__c,
            JobCode__c      : p.ChargeJobId__r.JobCode__c || '',
            Name            : p.ChargeJobId__r.Name || '',
            IsAssigned__c   : false,
            JobAssignId     : null,
            StartDate__c    : p.ChargeJobId__r.StartDate__c || null,
            EndDate__c      : p.ChargeJobId__r.EndDate__c   || null,
            Active__c       : (p.ChargeJobId__r.Active__c === undefined ? true : p.ChargeJobId__r.Active__c)
        });
    }
};

/**
 * ジョブ変更
 * @param e
 */
teasp.Tsf.FormBase.prototype.changedJob = function(e){
    var job = this.getCurrentJob();
    var el = this.fp.getElementByApiKey('ChargeJobId__c', null, this.getArea()); // ジョブ選択プルダウン
    var d = teasp.Tsf.Dom.nextSibling(el);
    if(d && d.tagName == 'INPUT'){ d.value = (job && job.getName() || ''); }
    el = this.fp.getElementByApiKey('ChargeJobId__r.JobCode__c'  , null, this.getArea());
    if(el){ el.value = (job && job.getCode()      || ''); }
    el = this.fp.getElementByApiKey('ChargeJobId__r.StartDate__c', null, this.getArea());
    if(el){ el.value = (job && job.getStartDate() || ''); }
    el = this.fp.getElementByApiKey('ChargeJobId__r.EndDate__c'  , null, this.getArea());
    if(el){ el.value = (job && job.getEndDate()   || ''); }
};

teasp.Tsf.FormBase.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.FormBase.prototype.getCurrentObjectId = function(){
    return (this.objBase ? this.objBase.getId() : null);
};

teasp.Tsf.FormBase.prototype.getCurrentObjectIdSet = function(){
    return {
        id                : (this.objBase ? this.objBase.getId() : null),
        cancelApplyId     : (this.objBase ? this.objBase.getCancelApplyId() : null),
        isCancelApplyWait : (this.objBase ? this.objBase.isCancelApplyWait() : false)
    };
};

teasp.Tsf.FormBase.prototype.getStartDate = function(){
    return this.getDate('StartDate__c');
};

teasp.Tsf.FormBase.prototype.getEndDate = function(){
    return this.getDate('EndDate__c');
};

teasp.Tsf.FormBase.prototype.getDate = function(key){
    var fc = this.fp.getFcByApiKey(key);
    var od = teasp.util.strToDate(fc.fetchValue().value);
    if(od.failed){
        return null;
    }
    return od.datef;
};

teasp.Tsf.FormBase.prototype.getSectionTitle = function(discernment){
    return this.fp.getSectionTitle(discernment);
};

teasp.Tsf.FormBase.prototype.getStoreFrom = function(){
    if(!this.storeFrom){
        this.storeFrom = teasp.Tsf.Dom.createStoreMemory(tsfManager.getStationFromHist()); // 発駅名候補
    }
    return this.storeFrom;
};

teasp.Tsf.FormBase.prototype.getStoreTo = function(){
    if(!this.storeTo){
        this.storeTo = teasp.Tsf.Dom.createStoreMemory(tsfManager.getStationToHist()); // 着駅名候補
    }
    return this.storeTo;
};

teasp.Tsf.FormBase.prototype.getSectionValues = function(discernment){
    return (this.objBase ? this.objBase.getSectionValues(discernment) : []);
};

teasp.Tsf.FormBase.prototype.getSectionValuesByRowIndex = function(discernment, index){
    return (this.objBase ? this.objBase.getSectionValuesByRowIndex(discernment, index) : []);
};

teasp.Tsf.FormBase.prototype.getSectionValuesByUniqKey = function(discernment, key){
    return (this.objBase ? this.objBase.getSectionValuesByUniqKey(discernment, key) : null);
};

teasp.Tsf.FormBase.prototype.setSectionValuesByUniqKey = function(discernment, key, obj){
    if(this.objBase){
        this.objBase.setSectionValueByUniqKey(discernment, key, obj);
    }
};

teasp.Tsf.FormBase.prototype.deleteSectionValueByUniqKey = function(discernment, key){
    if(this.objBase){
        this.objBase.deleteSectionValueByUniqKey(discernment, key);
    }
};

teasp.Tsf.FormBase.prototype.getRemoveIdList = function(discernment){
    return this.objBase ? this.objBase.getRemoveIdList(discernment) : null;
};

/**
 * セクションの開閉
 *
 * @param {Object} node
 * @param {boolean=} flag
 */
teasp.Tsf.FormBase.prototype.toggleSection = function(node, flag){
    var o = this.getSectionVisible(node);
    if(o.area){
        if(flag || (flag === undefined && !o.visible)){
            teasp.Tsf.Dom.show(o.area, null, true);
        }else{
            teasp.Tsf.Dom.show(o.area, null, false);
        }
    }
};

/**
 * セクションの開閉状態を返す
 *
 * @param {Object} node
 * @returns {Object}
 */
teasp.Tsf.FormBase.prototype.getSectionVisible = function(node){
    var p = (!teasp.Tsf.Dom.hasClass(node, 'ts-section-bar2') ? node.parentNode : node);
    var n = teasp.Tsf.Dom.nextSibling(p);
    return {
        bar     : p,
        area    : n,
        visible : (n && teasp.Tsf.Dom.hasClass(n, 'ts-section-form') && teasp.Tsf.Dom.isVisible(n))
    };
};

/**
 * セクションエリア作成
 *
 * @param {Object} areaEl
 */
teasp.Tsf.FormBase.prototype.createSections = function(areaEl){
    for(var i = 0 ; i < this.sections.length ; i++){
        var section = this.sections[i];
        var el = (section.getDock() ? this.getTailArea() : areaEl);
        if(el){
            teasp.Tsf.Dom.append(el, section.createArea());
        }
    }
};

teasp.Tsf.FormBase.prototype.getSectionByDiscernment = function(discernment){
    for(var i = 0 ; i < this.sections.length ; i++){
        if(this.sections[i].getDiscernment() == discernment){
            return this.sections[i];
        }
    }
    return null;
};

/**
 *
 * @param {string} discernment セクションを示すキー
 * @param {boolean} flag =true:表示 =false:非表示
 */
teasp.Tsf.FormBase.prototype.showSection = function(discernment, flag){
    var section = this.getSectionByDiscernment(discernment);
    if(section){
        section.show(flag);
    }
};

/**
 * 値が入力されているか
 *
 * @param {string} discernment セクションを示すキー
 * @returns {boolean}
 */
teasp.Tsf.FormBase.prototype.existSectionValue = function(discernment){
    var section = this.getSectionByDiscernment(discernment);
    return (section ? section.existValue() : false);
};

/**
 * 部署選択プルダウンに選択肢をセット
 *
 * @param {Object} areaEl
 */
teasp.Tsf.FormBase.prototype.fillDeptField = function(areaEl){
    teasp.Tsf.Dom.query('div.ts-form-dept > select', areaEl).forEach(function(el){
        var depts = tsfManager.getDepts();
        teasp.Tsf.Dom.empty(el);
        this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
        for(var i = 0 ; i < depts.length ; i++){
            this.getDomHelper().create('option', { value: (depts[i].getId() || ''), innerHTML: depts[i].getDisplayName() }, el);
        }
    }, this);
};

/**
 * 日付選択のイベント処理
 *
 * @param {Object} areaEl
 */
teasp.Tsf.FormBase.prototype.setEventDateField = function(areaEl){
    teasp.Tsf.Dom.query('button.ts-form-cal', areaEl).forEach(function(el){
        var n = teasp.Tsf.Dom.node('input[type="text"]', el.parentNode.parentNode); // 日付入力テキスト欄を取得
        if(n && n.name){ // name 属性がある場合限定でイベントハンドラをセットする
            tsfManager.eventOpenCalendar(this.getDomHelper(), el, n, {
                tagName         : n.name,
                isDisabledDate  : function(d){
                    return false;
                },
                selectedDate    : dojo.hitch(this, this.selectedDate)
            });
        }
    }, this);
};

/**
 * 日付選択時のイベントを受け取る
 *
 * @param {Object} areaEl
 */
teasp.Tsf.FormBase.prototype.selectedDate = function(inp, value){
    this.loadJobs();
};

teasp.Tsf.FormBase.prototype.changedCurrency = function(e){
    teasp.Tsf.Error.showError();
};

/**
 * 時刻入力欄のイベント処理
 *
 * @param {Object} areaEl
 */
teasp.Tsf.FormBase.prototype.setEventTimeField = function(areaEl){
    teasp.Tsf.Dom.query('.ts-form-time input', areaEl).forEach(function(el){
        teasp.Tsf.Time.eventInput(this.getDomHelper(), el);
    }, this);
};

/**
 * 金額入力欄のイベント処理
 *
 * @param {Object} areaEl
 */
teasp.Tsf.FormBase.prototype.setEventCurrencyField = function(areaEl){
    teasp.Tsf.Dom.query('.ts-form-currency input', areaEl).forEach(function(el){
        teasp.Tsf.Currency.eventInput(this.getDomHelper(), el, teasp.Tsf.Dom.hitch(this, this.changedCurrency));
    }, this);
};

/**
 * 承認申請 or (事前申請から)精算開始
 *
 * @param e
 */
teasp.Tsf.FormBase.prototype.submitApply = function(callback){
    var expApplyId = this.objBase.getPayId();
    if(expApplyId){ // 精算開始済み
        tsfManager.jumpExpApplyView(expApplyId);
        return;
    }
    var approved = this.objBase.isApproved();
    if(approved || this.objBase.isInstant()){ // 承認済み or 直接精算開始できる
        this.generateExpFromPreApply(approved);
    }else{
        var data = this.getDomValues(false, 1);
        if(data.ngList.length > 0){
            teasp.Tsf.Error.showError(teasp.Tsf.Error.messageFromNgList(data.ngList));
            return;
        }
        if((data.misMatch & teasp.Tsf.EmpExp.MISMATCH_MASK) != 0){
            teasp.Tsf.Error.showError(teasp.message.getLabel('tf10006880' // 精算区分、費目表示区分と経費明細が不整合の状態のため、{0}。
                                    , teasp.message.getLabel(tsfManager.isExpWorkflow() ? 'tf10006890' : 'tf10006900'))); // 申請できません or 確定できません
            return;
        }
        var emptyBit = (data.misMatch & teasp.Tsf.EmpExp.EMPTY_MASK);
        if(emptyBit != 0){
            var fls = [];
            if(emptyBit & teasp.Tsf.EmpExp.EMPTY_JOB){
                fls.push(teasp.message.getLabel('job_label')); // ジョブ
            }
            if(emptyBit & teasp.Tsf.EmpExp.EMPTY_CHARGE_DEPT){
                fls.push(teasp.message.getLabel('tf10006000')); // 負担部署
            }
            if(emptyBit & teasp.Tsf.EmpExp.EMPTY_ROUTE){
                fls.push(teasp.message.getLabel('tk10000616')); // 拡張項目
            }
            if(emptyBit & (teasp.Tsf.EmpExp.EMPTY_EXTRA1|teasp.Tsf.EmpExp.EMPTY_EXTRA2)){
                fls.push(teasp.message.getLabel('tk10000616')); // 拡張項目
            }
            teasp.Tsf.Error.showError(teasp.message.getLabel('tf10007120', fls.join(teasp.message.getLabel('tm10001560')))); // 必須入力の{0}が未入力の経費があります。
            return;
        }
        var totalAmount = teasp.Tsf.util.parseInt(data.values[0].TotalAmount__c);
        if(totalAmount < 0){ // 合計金額がマイナスの経費申請を許可しないで、合計金額がマイナス
            teasp.tsAlert(teasp.message.getLabel('tm30001145'
                    , teasp.util.currency.addFigure(totalAmount)
                    , teasp.message.getLabel('cunit_jps')
                    , teasp.util.currency.addFigure(teasp.constant.CU_TOTAL_LOWER_LIMIT)
                    , teasp.message.getLabel('cunit_jps')
                    ));
            /*
             * ＊＊＊＊＊＊ 申請できません ＊＊＊＊＊＊
             * 申請対象の明細の合計金額が {0} {1}になっています。1申請あたりの明細の合計金額が {2} {3}以上となるように、申請を行ってください。
             */
            return;
        }
        tsfManager.showDialog('ApplyCommentExpPre', {
            key     : 'submitApply',
            title   : this.getApplyButtonLabel(),
            formCss : 'ts-dialog-comment',
            buttons : [{ key:'submitApply', label:this.getApplyButtonLabel() }, { key:'cancel', label:teasp.message.getLabel('cancel_btn_title') }] // キャンセル
        }, teasp.Tsf.Dom.hitch(this, function(result){
            tsfManager.changeView(null, result.id);
        }));
    }
};

/**
 * 精算開始
 *
 * @param {boolean} approved 承認済みか
 */
teasp.Tsf.FormBase.prototype.generateExpFromPreApply = function(approved){
    if(approved){ // 承認済み
        tsfManager.generateExpFromPreApply(); // 精算開始
    }else{
        var data = this.getDomValues(false, 1);
        if(data.ngList.length > 0){
            teasp.Tsf.Error.showError(teasp.Tsf.Error.messageFromNgList(data.ngList));
            return;
        }
        if(!this.objBase.getId() || tsfManager.checkDiff()){ // 編集内容を保存してから精算開始へ
            tsfManager.saveExpPreApply(true, teasp.Tsf.Dom.hitch(this, function(succeed, result){
                if(succeed){
                    tsfManager.changeView(null, result, function(){
                        // "お待ちください" が消えてからメッセージボックスが出るように setTimeout を使う
                        setTimeout(
                            function(){ tsfManager.generateExpFromPreApply(true); } // 精算開始
                          , 100);
                    });
                }else{
                    teasp.Tsf.Error.showError(result);
                }
            }));
        }else{
            tsfManager.generateExpFromPreApply(true); // 精算開始
        }
    }
};

/**
 * 承認申請を取り消す
 *
 * @param e
 */
teasp.Tsf.FormBase.prototype.cancelApply = function(data, callback){

	// JTB連携を使用している場合
	// 予約一覧に予約情報が表示されている場合は承認取消できないようにする
	if(tsfManager.isUsingJsNaviSystem() && tsfManager.getInfo().objects){
		for(var i = 0; i < tsfManager.getInfo().objects.length; i++){
			var expPreApply = tsfManager.getInfo().objects[i];
			if(expPreApply.obj.ExpJsNavi__r != null &&
					expPreApply.obj.ExpJsNavi__r.length > 0){
                teasp.tsAlert(teasp.message.getLabel('jt12000150'));
                return;
			}
		}
	}

    var cancelLabel = this.objBase.getCancelLabel();
    var status    = this.objBase.getStatus();
    var noComment = (status == '承認済み' || status == '確定済み') ? true : false;
    var message   = (noComment ? teasp.message.getLabel(status == '承認済み' ? 'tf10007740' : 'tf10007750') : '');

    tsfManager.showDialog('ApplyCommentCancel', {
        key         : 'cancelApply',
        title       : cancelLabel,
        formCss     : 'ts-dialog-comment',
        buttons     : [{ key:'cancelApply', label:cancelLabel, css:'ts-cancel-apply' }, { key:'cancel', label:teasp.message.getLabel('cancel_btn_title') }], // キャンセル
        solve       : this.objBase.isSolve(),
        parentHide  : callback,
        noComment   : noComment,
        warning     : message
    }, teasp.Tsf.Dom.hitch(this, function(id){
        tsfManager.changeView(null, id);
    }));
};

/**
 * 承認/却下
 *
 * @param e
 */
teasp.Tsf.FormBase.prototype.approveApply = function(){
    tsfManager.showDialog('ApplyCommentApprove', {
        key         : 'approveApply',
        title       : teasp.message.getLabel(this.objBase.isCancelApplyWait() ? 'tf10006250' : 'tf10000270'), // 取消伝票の承認／却下 or 承認／却下
        formCss     : 'ts-dialog-comment',
        buttons     : [{ key:'approveApply', label:teasp.message.getLabel(this.objBase.isCancelApplyWait() ? 'tf10006260' : 'tm30004010') }, // 取消の承認 or 承認
                       { key:'rejectApply' , label:teasp.message.getLabel(this.objBase.isCancelApplyWait() ? 'tf10006270' : 'tm10003490'), css:'ts-cancel-apply' }, // 取消の却下 or 却下
                       { key:'cancel'      , label:teasp.message.getLabel('cancel_btn_title') }] // キャンセル
    }, teasp.Tsf.Dom.hitch(this, function(id){
        tsfManager.changeView(null, id);
    }));
};

/**
 * 取消伝票の承認/却下
 *
 * @param e
 */
teasp.Tsf.FormBase.prototype.approveCancelApply = function(){
    tsfManager.showDialog('ApplyCommentApprove', {
        key         : 'approveApply',
        title       : teasp.message.getLabel('tf10006250'), // 取消伝票の承認／却下
        formCss     : 'ts-dialog-comment',
        buttons     : [{ key:'approveApply', label:teasp.message.getLabel('tf10006260') }, // 取消の承認
                       { key:'rejectApply' , label:teasp.message.getLabel('tf10006270'), css:'ts-cancel-apply' }, // 取消の却下
                       { key:'cancel'      , label:teasp.message.getLabel('cancel_btn_title') }] // キャンセル
    }, teasp.Tsf.Dom.hitch(this, function(id){
        tsfManager.changeView(null, id);
    }));
};

/**
 * 承認履歴を表示
 *
 * @param {Object} e
 */
teasp.Tsf.FormBase.prototype.statusHistory = function(e){
    var obj = tsfManager.getCurrentObjectIdSet();
    if(!obj.id){
        return;
    }
    tsfManager.showProcessInstanceSteps({
        id                  : obj.id, // 対象レコードのID
        cancelApplyId       : obj.cancelApplyId,
        cancelable          : this.objBase.isCancelable(), // 取消できるか
        cancelLabel         : this.objBase.getCancelLabel(),
        expApply            : this.objBase,
        cancelCallback      : teasp.Tsf.Dom.hitch(this, this.cancelApply) // 取消で呼ぶメソッド
    });
};

/**
 * 標準画面で開く
 *
 * @param {Object} e
 */
teasp.Tsf.FormBase.prototype.openStandardView = function(e){
    var id = tsfManager.getCurrentObjectId();
    if(id){
        if(teasp.isSforce1()){
            sforce.one.navigateToURL('/' + id);
        }else{
            window.open('/' + id);
        }
    }
};

/**
 * 取消伝票を標準画面で開く
 *
 * @param {Object} e
 */
teasp.Tsf.FormBase.prototype.openCancelApplyStandardView = function(e){
    var o = tsfManager.getCurrentObjectIdSet();
    if(o.cancelApplyId){
        if(teasp.isSforce1()){
            sforce.one.navigateToURL('/' + o.cancelApplyId);
        }else{
            window.open('/' + o.cancelApplyId);
        }
    }
};

/**
 * 入力値を取得
 *
 * @param {boolean=} flag true:check状態の値は不用
 * @param {number=} chklev 1:申請時用エラーチェック、2:一時保存用エラーチェック
 * @param {boolean=} chkSep true:経費明細のチェック行限定の整合チェック・必須チェックをする
 * @returns {Object}
 */
teasp.Tsf.FormBase.prototype.getDomValues = function(flag, chklev, chkSep){
    var data = {
        objectName  : this.fp.getObjectName(),
        values      : [],
        types       : {},
        fixes       : {}
    };
    var v = this.objBase.getDataObj();
    var ngList = [];
    this.fp.fcLoop(function(fc){
        if(fc.isApiField()){
            var k = fc.getApiKey();
            v[k] = fc.fetchValue().value;
            data.types[k] = fc.getSObjType();
            if(fc.getFix()){
                data.fixes[k] = fc.getFix();
            }
            fc.checkValid(v[k], chklev, ngList);
        }
    }, this);
    if(this.objBase.getTypeName() == teasp.constant.EXP_PRE_FORM4){ // 仮払申請
        var adFc = this.fp.getFcByApiKey('ApplyDate__c');
        if(adFc){
            if(v.ApplyDate__c){
                v.EndDate__c = v.StartDate__c = v.ApplyDate__c;
            }
        }
    }else{
        var sdFc = this.fp.getFcByApiKey('StartDate__c');
        var edFc = this.fp.getFcByApiKey('EndDate__c');
        if(sdFc && edFc){
            if((!v.EndDate__c && v.StartDate__c) || edFc.isHidden()){
                v.EndDate__c = v.StartDate__c;
            }
            if(v.StartDate__c > v.EndDate__c){
                ngList.push({ ngType: 4, fc: edFc, message: teasp.message.getLabel('tf10001850', sdFc.getLabel(), edFc.getLabel()) }); // {0}≦{1}となるように入力してください。
            }else if(v.StartDate__c == v.EndDate__c){
                var st = v.DepartureTime__c;
                var et = v.ReturnTime__c;
                if(typeof(st) == 'number' && typeof(et) == 'number' && st > et){
                    var stFc = this.fp.getFcByApiKey('DepartureTime__c');
                    var etFc = this.fp.getFcByApiKey('ReturnTime__c');
                    ngList.push({ ngType: 4, fc: etFc, message: teasp.message.getLabel('tf10001850', stFc.getLabel(), etFc.getLabel()) }); // {0}と{1}が逆転しています。
                }
            }
        }
    }
    this.getObjBase().addElement(v);

    // ジョブの有効期間と予定日の整合をチェック
    var job = this.getCurrentJob();
    if(job && !job.activeOnDate(v.StartDate__c, v.EndDate__c)){
        ngList.push({ ngType: 4, fc: this.fp.getFcByApiKey('ChargeJobId__c'), message: teasp.message.getLabel('tf10001820') }); // 予定日とジョブの有効期間が整合しません。
    }

    data.values.push(v);

    var misMatch = this.getMisMatchFlag();
    var misCheckOnly = 0;
    dojo.forEach(this.sections, function(section){
        var o = section.getDomValues(flag, chklev);
        if(section.isChild()){
            data[section.getRelationshipName()] = o;
        }else{
            for(var i = 0 ; i < o.values.length ; i++){
                teasp.Tsf.util.mixin(data.values[0], o.values[i]);
            }
            teasp.Tsf.util.mixin(data.types, o.types);
        }
        ngList = ngList.concat(o.ngList || []);
        misMatch |= section.getMisMatchFlag();
        if(chkSep){
            misCheckOnly |= section.getMisMatchFlagCheckedOnly();
        }
    }, this);

    if(this.sectionExpAssist){
        var o = this.sectionExpAssist.getDomValues(flag, chklev);
        for(var i = 0 ; i < o.values.length ; i++){
            teasp.Tsf.util.mixin(data.values[0], o.values[i]);
        }
        teasp.Tsf.util.mixin(data.types, o.types);
        ngList = ngList.concat(o.ngList || []);
        misMatch |= this.sectionExpAssist.getMisMatchFlag();
    }

    // 明細の数チェック
    var expCountLimit = tsfManager.getExpCountLimit();
    if(data.objectName == 'AtkExpPreApply__c' && this.objBase.getEmpExps().length > expCountLimit){
        ngList.push({ ngType: 4, fc: this.fp.getFcByApiKey('Id'), message: teasp.message.getLabel('tf10007700',this.objBase.getEmpExps().length+'/'+expCountLimit) });
    }

    if(chklev){
        data.ngList = ngList;
        data.misMatch = misMatch;
        data.misCheckOnly = misCheckOnly;
    }

    return data;
};

/**
 * 編集モードに移行
 *
 */
teasp.Tsf.FormBase.prototype.changeEditMode = function(){
    tsfManager.showForm(this.getObjBase(), null, (this.getObjBase().getMode() == 'edit' ? 'read' : 'edit'));
};

/**
 * 差異を表示可能か
 * @returns {boolean}
 */
teasp.Tsf.FormBase.prototype.canDiffView = function(){
    var objBase = this.getObjBase();
    return (objBase ? objBase.canDiffView() : false);
};

/**
 * 承認申請or確定ボタンの名前
 *
 * @returns {string}
 */
teasp.Tsf.FormBase.prototype.getApplyButtonLabel = function(){
    return this.objBase.getApplyButtonLabel();
};

/**
 * 添付ファイルの有無をセット
 *
 * @param {string} expLogId 経費明細ID
 * @param {boolean} flag
 */
teasp.Tsf.FormBase.prototype.setAttachmentExist = function(expLogId, flag){
    dojo.forEach(this.sections, function(section){
        if(section.setAttachmentExist){
            section.setAttachmentExist(expLogId, flag);
        }
    }, this);
};

/**
 * 申請ヘッダ情報の入力値を返す
 * @returns
 */
teasp.Tsf.FormBase.prototype.getAssist = function(expenseType){
    if(!this.sectionExpAssist){
        var data = {
            ChargeDeptId__r  : {
                ExpItemClass__c : tsfManager.getTargetEmp().getDeptExpItemClass()
            },
            ExpenseType__c   : expenseType || null
        };
        // 事前申請で「指定する項目」がすべてオフなら、ここで基本情報のJOB取得を行う（#8277）
        var job = this.getCurrentJob();
        if(job){
            data.ChargeJobId__c = job.getId();
            data.ChargeJobId__r = job.getObj();
        }
        return data;
    }
    var data = this.sectionExpAssist.getValues();
    if(data && !data.ExpenseType__c && expenseType){
        data.ExpenseType__c = expenseType;
    }
    if(data && !data.ChargeJobId__c){
        // 事前申請で「指定する項目」のいずれかがオンなら、this.sectionExpAssist に参照がセットされるが、
        // this.sectionExpAssist.getValues() で JOB はセットされないため、ここで基本情報のJOB取得を行う（#8277）
        var job = this.getCurrentJob();
        if(job){
            data.ChargeJobId__c = job.getId();
            data.ChargeJobId__r = job.getObj();
        }
    }
    return (data || null);
};

/**
 * 印刷ボタンクリック時の処理
 *
 */
teasp.Tsf.FormBase.prototype.openPrintCheck = function(){
    // 編集中なら保存する
    if(!this.getCurrentObjectId() || tsfManager.checkDiff()){
        teasp.tsConfirm(teasp.message.getLabel('tf10006580'),this,function(result){// 印刷する前に編集内容を保存してよろしいですか？
            if(result){
                tsfManager.saveExpPreApply(true, teasp.Tsf.Dom.hitch(this, function(succeed, result){
                    if(succeed){
                        tsfManager.changeView(null, result, function(){
                            tsfManager.openPrintView();
                        });
                    }else{
                        teasp.Tsf.Error.showError(result);
                    }
                }));
            }
        });
    }else{
        this.openPrintView();
    }
};

/**
 * 印刷ボタンクリック時の処理
 *
 */
teasp.Tsf.FormBase.prototype.openPrintView = function(){
    var h = (screen.availHeight || 800);
    if(h > 800){
        h = 800;
    }
    var expPreApplyId = this.getCurrentObjectId();
    var href = teasp.getPageUrl('expPrintView')
        + '?target=ExpPreApply'
        + (expPreApplyId ? '&id=' + expPreApplyId : '') + '&mode=read';
    if(teasp.isSforce1()){
        sforce.one.navigateToURL(href);
    }else{
        var wh = window.open(href,
            'preprint', 'width=800,height=' + h + ',resizable=yes,scrollbars=yes');
        setTimeout(function(){ wh.resizeTo(810, h); wh.focus(); }, 100);
    }
};

/**
 * 子ウィンドウから受信した情報で添付ファイル情報を更新
 *
 * @param attachObj
 */
teasp.Tsf.FormBase.prototype.setAttachmentInfo = function(attachObj){
    dojo.forEach(this.sections, function(section){
        section.setAttachmentInfo(attachObj);
    }, this);
};

/**
 * 経費明細をインポート
 * @param {Array.<Object>} empExps
 */
teasp.Tsf.FormBase.prototype.importEmpExps = function(COL, data){
    dojo.forEach(this.sections, function(section){
        section.importEmpExps(COL, data);
    }, this);
};

teasp.Tsf.FormBase.prototype.showTotalValue = function(){
    // 仮払申請の場合は合計金額欄を非表示にする
    teasp.Tsf.Dom.show('td.ts-total-label, td.ts-total-value', teasp.Tsf.Dom.byId(teasp.Tsf.ROOT_AREA_ID), (this.getFormStyle() == 4 ? false : true));
};

/**
 * 引数の情報で明細行を選択状態にする
 *
 * @params {Array.<Object>} exps
 */
teasp.Tsf.FormBase.prototype.restoreCheck = function(exps){
    dojo.forEach(this.sections, function(section){
        section.restoreCheck(exps);
    }, this);
};

/**
 * 明細行の移動
 */
teasp.Tsf.FormBase.prototype.moveStart = function(){
    var section = this.getSectionByDiscernment(teasp.Tsf.formParams.sectionDetail.discernment);
    if(section){
        section.moveStart();
    }
};

/**
 * 履歴から読込
 *
 */
teasp.Tsf.FormBase.prototype.selectHistory = function(){
    var section = this.getSectionByDiscernment(teasp.Tsf.formParams.sectionDetail.discernment);
    if(section){
        section.selectHistory();
    }
};

/**
 * コピー
 *
 */
teasp.Tsf.FormBase.prototype.doCopy = function(){
    // 編集中なら保存する
    if(!this.getCurrentObjectId() || tsfManager.checkDiff()){
        teasp.tsConfirm(teasp.message.getLabel('tf10006840'),this,function(result){// 編集内容を保存してからコピーを作成します。よろしいですか？
            if(result){
                tsfManager.saveExpPreApply(true, teasp.Tsf.Dom.hitch(this, function(succeed, result){
                    if(succeed){
                        tsfManager.changeView(null, result,
                            teasp.Tsf.Dom.hitch(this, function(){
                                tsfManager.copyExpApply();
                            })
                        );
                    }else{
                        teasp.Tsf.Error.showError(result);
                    }
                }));
            }
        });
    }else{
        tsfManager.copyExpApply();
    }
};

/**
 * 画面をリフレッシュ（精算区分、費目表示区分を変更した時）
 *
 */
teasp.Tsf.FormBase.prototype.changedAssist = function(){
    dojo.forEach(this.sections, function(section){
        section.refreshView();
    }, this);
    this.changedCurrency();
};

teasp.Tsf.FormBase.prototype.getMisMatchFlag = function(){
    return 0;
};

/**
 * 精算区分・費目表示区分の不整合を表示するか
 * @returns {boolean}
 */
teasp.Tsf.FormBase.prototype.isShowMisMatch = function(){
    return this.getObjBase().isShowMisMatch();
};

/**
 * CSV読込ウィンドウを開く
 */
teasp.Tsf.FormBase.prototype.openCsvImport = function(){
};

/**
 * （主にCSV読込ウィンドウ向けに）基本情報の設定値を返す
 */
teasp.Tsf.FormBase.prototype.getAssistParam = function(){
    return null;
};

/**
 * CSV読込ウィンドウ向けにトークンを返す
 * @param {boolean=} flag trueならトークンを作成
 */
teasp.Tsf.FormBase.prototype.getToken = function(){
    return null;
};

/**
 * 絞り込みセクションを使用するか
 */
teasp.Tsf.FormBase.prototype.isUseExpFilter = function(flag){
    return false;
};

/**
 * 絞り込み条件を変更した
 */
teasp.Tsf.FormBase.prototype.changedFilter = function(filter){
};

/**
 * セクションのリフレッシュをする前に行う処理（オーバーライド用）
 */
teasp.Tsf.FormBase.prototype.beforeRefreshSections = function(){
};

/**
 * 出張手配の予約反映処理を行う
 */
teasp.Tsf.FormBase.prototype.jtbSynchro = function(){
    var section = this.getSectionByDiscernment(teasp.Tsf.formParams.sectionJtb.discernment);
    if(section){
        return section.jtbSynchro();
    }
    return null;
};
