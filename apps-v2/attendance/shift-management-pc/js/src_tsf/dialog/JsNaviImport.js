/**
 * J'sNAVI明細取り込み
 *
 * @constructor
 */
teasp.Tsf.JsNaviImport = function(){
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.dialogJsNaviImport);
    this.expImportRemarks = tsfManager.getInfo().getExpPreApplyConfigs().expImportRemarks || false;
};

teasp.Tsf.JsNaviImport.prototype.show = function(obj, callback){
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
    this.showData(obj);
    this.ok();
};

teasp.Tsf.JsNaviImport.prototype.showData = function(obj){
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
    this.loadExpItems(select);
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
    if(this.expImportRemarks && this.orgData.data.records.length > 1){ // インポート対象が複数
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

    this.dialog.show();
};

teasp.Tsf.JsNaviImport.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.JsNaviImport.prototype.getFormEl = function(){
    return teasp.Tsf.Dom.node('.ts-section-form', teasp.Tsf.Dom.byId(this.dialog.id));
};

teasp.Tsf.JsNaviImport.prototype.getValueByApiKey = function(apiKey, obj, defaultValue){
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

teasp.Tsf.JsNaviImport.prototype.hide = function(){
    if(this.dialog){
        this.dialog.hide();
        this.domHelper.free();
        this.dialog.destroy();
        tsfManager.removeDialog('JsNaviImport');
    }
};

teasp.Tsf.JsNaviImport.prototype.getContent = function(){
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

    teasp.Tsf.Dom.show('.ts-row-detail', formEl, this.expImportRemarks);  // 備考欄

    this.createButtons(areaEl);

    return areaEl;
};

teasp.Tsf.JsNaviImport.prototype.createButtons = function(areaEl){
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
teasp.Tsf.JsNaviImport.prototype.setEventExpItem = function(formEl){
    var select = this.fp.getElementByApiKey('ExpItemId__c', null, formEl);
    if(select){
        var el = teasp.Tsf.Dom.getAncestorByCssName(select, 'ts-form-row');
        if(el){
            var btn = teasp.Tsf.Dom.node('button.ts-form-find', el);
            if(btn){
                this.getDomHelper().connect(btn, 'onclick', this, function(e){
                    var expItemIds = [];
                    var expItems = tsfManager.getExpItems(this.expItemFilter, true);
                    dojo.forEach(expItems, function(expItem){
                        expItemIds.push("'" + expItem.getId() + "'");
                    });
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
teasp.Tsf.JsNaviImport.prototype.setEventJob = function(formEl){
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
teasp.Tsf.JsNaviImport.prototype.setEventDept = function(formEl){
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
 * 費目プルダウンに選択肢をセット
 * （駅探検索をする費目は含めない）
 *
 * @param {Object} el
 */
teasp.Tsf.JsNaviImport.prototype.loadExpItems = function(el){
    var orgv = el.value || '';
    var vmap = {};
    teasp.Tsf.Dom.empty(el);
    this.getDomHelper().create('option', { value: '', innerHTML: '' }, el);
    dojo.forEach(tsfManager.getExpItems(this.expItemFilter), function(expItem){
        if(!expItem.isEkitanType() 		// 駅探検索する費目ではない
        && !expItem.isFixAmount()  		// 金額固定ではない
        && !expItem.isEnableQuantity()	// 数量ではない
        && !expItem.isForeignFlag()	// 外貨ではない
        ){
            this.getDomHelper().create('option', { value: expItem.getId(), innerHTML: expItem.getName() }, el);
            vmap[expItem.getId()] = 1;
        }
    }, this);
    el.value = (vmap[orgv] && orgv) || '';
};

teasp.Tsf.JsNaviImport.prototype.refreshExpItems = function(){
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
teasp.Tsf.JsNaviImport.prototype.loadJobs = function(el, empId){
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
teasp.Tsf.JsNaviImport.prototype.loadChargeDepts = function(el){
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
teasp.Tsf.JsNaviImport.prototype.getCurrentExpItem = function(){
    return tsfManager.getExpItemById(this.fp.getFcByApiKey('ExpItemId__c').fetchValue().value);
};

/**
 * 費目の選択変更
 * @param e
 */
teasp.Tsf.JsNaviImport.prototype.changedExpItem = function(e){
    this.showExtraItem();
};

/**
 * 費目選択変更時の処理
 * @param fe
 */
teasp.Tsf.JsNaviImport.prototype.showExtraItem = function(fe){
    var expItem = this.getCurrentExpItem(); // 費目
    var formEl = (fe || this.getFormEl());

    var reqChargeJob  = (expItem && expItem.isRequireChargeJob()) || 0;
    teasp.Tsf.Dom.show('.ts-row-job', formEl, reqChargeJob  > 0);  // ジョブ
    teasp.Tsf.Dom.show('.ts-row-job .ts-require', formEl, reqChargeJob == 2);  // ジョブの必須切替

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
teasp.Tsf.JsNaviImport.prototype.changedJob = function(e){
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
teasp.Tsf.JsNaviImport.prototype.getCurrentJob = function(){
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
teasp.Tsf.JsNaviImport.prototype.getJobChoices = function(){
    var jobs = tsfManager.getEmpJobAssigns(); // アサイン済みのジョブ
    return (this.impJobs ? jobs.concat(this.impJobs) : jobs);
};

/**
 * ジョブ検索画面で選択したジョブを一時記憶する
 * @param {Object} o
 */
teasp.Tsf.JsNaviImport.prototype.setImportJobs = function(o){
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
teasp.Tsf.JsNaviImport.prototype.changedChargeDept = function(e){
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
teasp.Tsf.JsNaviImport.prototype.getCurrentChargeDept = function(){
    var el = this.fp.getElementByApiKey('ChargeDeptId__c', null, this.getFormEl()); // 負担部署選択プルダウン
    return (el && tsfManager.getInfo().getCacheDept(el.value || null) || null);
};

teasp.Tsf.JsNaviImport.prototype.showError = function(result){
    var er = teasp.Tsf.Dom.node('.ts-error-area', teasp.Tsf.Dom.byId(this.dialog.id));
    teasp.Tsf.Error.showError(result, er);
};

teasp.Tsf.JsNaviImport.prototype.ok = function(e){
	if(this.entryExpItem){
		var trans = ["JL","NH","JE","SF","JN","HD","JW","交通","航空","新幹線"];
		var stays = ["BH","RT","GT","HR","宿泊"];
		var cars = ["レンタカー"];
		var etcs = ["その他","金額","共通"];
		
		var vobj = {};
		var chargeDept = {};
	    var exps = [];
	    var ng = {};
		
		// 出張手配で使用する費目を取得
		var items = tsfManager.getJtbExpItems() || {};
	
	    // 出張手配実績読込で選択された実績データ分処理を行う
		var data = this.orgData.data;
		
	    for(var i = 0 ; i < data.records.length ; i++){
	    	var expItem = null;							// 設定する費目
	        var record = data.records[i];				// J'sNavi実績データ
	        var systemType = record.SystemType__c;		// システム区分
	        var functionCode = record.FunctionCode__c;	// 発注機能コード
	        var data01 = record.Data01__c;				// サービス名称
	
	        // 費目の判定を行う
	        // その他：その他の費目を取得
	        if ((items.e4 || []).length > 0) {
	        	expItem = tsfManager.getExpItemById(items.e4[0]);
	        }
	        
	        // data01の処理
	        // 発注機能コードで識別できない（例：DT、DP）場合、個別項目01の括弧内の値に指定の文字が入っているかで費目判定を行う
	        // 例） 個別項目01の値:　ダイナミックパッケージ（宿泊）
	        data01 = data01.replace("(", "（");
	        var start = data01.indexOf("（");
	        var end = data01.indexOf("）");
	        var s = data01.substring(start+1, end);
	        
	        // システム区分 = J：国内 の場合
	        if (record.SystemType__c != null && record.SystemType__c == 'J') {
	        	
	        	// JL,NH,JE,交通,航空,新幹線
	        	// 交通機関を利用した場合は、交通機関用費目の1つ目のデータを設定
	        	if (trans.indexOf(functionCode) > -1 || 
	        			(s != null && trans.indexOf(s) > -1)) {
	        		if ((items.j1 || []).length > 0) {
	        			expItem = tsfManager.getExpItemById(items.j1[0]);
	        		}
	        		
	        	// BH,RT,GT,宿泊
	        	// 宿泊を利用した場合は、宿泊用費目の1つ目のデータを設定
	        	} else if (stays.indexOf(functionCode) > -1 || 
	        			(s != null && stays.indexOf(s) > -1)) {
	        		if ((items.j2 || []).length > 0) {
	        			expItem = tsfManager.getExpItemById(items.j2[0]);
	        		}
	        		
	        	// レンタカー
	        	// レンタカーを利用した場合は、レンタカー用費目の1つ目のデータを設定
	        	} else if (s != null && cars.indexOf(s) > -1) {
	        		if ((items.j3 || []).length > 0) {
	        			expItem = tsfManager.getExpItemById(items.j3[0]);
	        		}
	        		
	        	// その他,金額,共通
	        	// 上記以外を利用した場合は、その他費目の1つ目のデータを設定
	        	} else if (s != null && etcs.indexOf(s) > -1) {
	        		if ((items.j4 || []).length > 0) {
	        			expItem = tsfManager.getExpItemById(items.j4[0]);
	        		}
	        	}
	        	
	        // システム区分 = F：海外 の場合
	        } else if (record.SystemType__c != null && record.SystemType__c == 'F') {
	        	if (trans.indexOf(functionCode) > -1 || 
	        			(s != null && trans.indexOf(s) > -1)) {
	        		if ((items.f1 || []).length > 0) {
	        			expItem = tsfManager.getExpItemById(items.f1[0]);
	        		}
	        	} else if (stays.indexOf(functionCode) > -1 || 
	        			(s != null && stays.indexOf(s) > -1)) {
	        		if ((items.f2 || []).length > 0) {
	        			expItem = tsfManager.getExpItemById(items.f2[0]);
	        		}
	        	} else if (s != null && cars.indexOf(s) > -1) {
	        		if ((items.f3 || []).length > 0) {
	        			expItem = tsfManager.getExpItemById(items.f3[0]);
	        		}
	        	} else if (s != null && etcs.indexOf(s) > -1) {
	        		if ((items.f4 || []).length > 0) {
	        			expItem = tsfManager.getExpItemById(items.f4[0]);
	        		}
	        	}
	        	
	        // システム区分 = Z：その他 の場合
	        // システム区分 = null の場合
	        } else {
	        	if (trans.indexOf(functionCode) > -1 || 
	        			(s != null && trans.indexOf(s) > -1)) {
	        		if ((items.e1 || []).length > 0) {
	        			expItem = tsfManager.getExpItemById(items.e1[0]);
	        		}
	        	} else if (stays.indexOf(functionCode) > -1 || 
	        			(s != null && stays.indexOf(s) > -1)) {
	        		if ((items.e2 || []).length > 0) {
	        			expItem = tsfManager.getExpItemById(items.e2[0]);
	        		}
	        	} else if (s != null && cars.indexOf(s) > -1) {
	        		if ((items.e3 || []).length > 0) {
	        			expItem = tsfManager.getExpItemById(items.e3[0]);
	        		}
	        	}
	        }
	        
	        this.fp.fcLoop(function(fc){
	            if(fc.isApiField(true)){
	                fc.fillValue(vobj, fc.fetchValue());
	            }
	        }, this);
	        
	        var reqChargeJob = 0;
	        var job = null;
	        vobj.ExtraItem1__c = null;
	        vobj.ExtraItem2__c = null;
	        
	        // 設定費目が取得できた場合
	        if (expItem != null) {
	
	        	// ジョブ
	            reqChargeJob = expItem.isRequireChargeJob();
	            job = (reqChargeJob > 0 ? this.getCurrentJob() : null);
	            
	            // 拡張項目1
	            var ex1 = expItem.getExtraItem(1);
	            if(!ex1){
	                vobj.ExtraItem1__c = null;
	            }
	            
	            // 拡張項目2
	            var ex2 = expItem.getExtraItem(2);
	            if(!ex2){
	                vobj.ExtraItem2__c = null;
	            }
	        }
	        
	        // 負担部署
	        var reqChargeDept = tsfManager.isRequireChargeDept();
	        
	        if (reqChargeDept > 0) { 
	            chargeDept.Id = vobj.ChargeDeptId__c || null;
	            if(vobj.ChargeDeptId__r){
	                chargeDept.DeptCode__c  = vobj.ChargeDeptId__r.DeptCode__c || null;
	                chargeDept.Name         = vobj.ChargeDeptId__r.Name || null;
	            }
	        }
	        
	        // 経費情報
	        var expApply = this.orgData.expApply;
	        
	        // 明細を追加
	        exps.push(expApply.createEmpExpFromCard(expItem, job, chargeDept, vobj.ExtraItem1__c, vobj.ExtraItem2__c, record, (this.orgData.expenseType || null), ng));
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
teasp.Tsf.JsNaviImport.prototype.checkedAddToRemarks = function(fe){
    var formEl = (fe || this.getFormEl());
    var div = teasp.Tsf.Dom.node('.ts-row-detail div.ts-form-value', formEl);
    var chk = teasp.Tsf.Dom.node('input[type="checkbox"]', div); // デフォルトの備考に追加
    var textArea = teasp.Tsf.Dom.node('textarea', div);
    // オンなら追加時の最大文字数、オフなら255文字をテキストエリアのmaxLengthにセット
    teasp.Tsf.Dom.setAttr(textArea, 'maxLength', (chk.checked ? this.remarksAddMax : 255));
};
