/**
 * 経費事前申請用コメント入力ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ApplyCommentExp = function(){
    this.params = null;
};

teasp.Tsf.ApplyCommentExp.prototype = new teasp.Tsf.ApplyComment();

teasp.Tsf.ApplyCommentExp.prototype.show = function(obj, callback){
    this.orgData = obj;
    this.applyKey = teasp.constant.APPLY_KEY_EXPAPPLY;
    teasp.Tsf.ApplyComment.prototype.show.call(this, obj, callback);

    teasp.Tsf.Dom.show('div.ts-apply-target-choice', this.getArea(), this.orgData.targetChoice);

    var objBase = this.orgData.objBase;
    var ringi = objBase.getRingiApplyObj();

    if(tsfManager.isExpLinkDocument() || ringi.Id){
        this.showRingiInfo(ringi);
    }else{
        teasp.Tsf.Dom.show('div.ts-apply-link-ringi', this.getArea(), false);
        teasp.Tsf.Dom.show('div.ts-section-ringi'   , this.getArea(), false);
    }
};

teasp.Tsf.ApplyCommentExp.prototype.getContent = function(){
    var areaEl = this.getDomHelper().create('div', { className: 'ts-dialog' });
    this.getDomHelper().create('div', null
            , this.getDomHelper().create('div', { className: 'ts-error-area', style: 'width:390px;display:none;' }, areaEl));

    //---------------------
    // 申請対象選択
    var radioEl = this.getDomHelper().create('div', { className: 'ts-apply-target-choice' }, areaEl);

    this.getDomHelper().create('div', { className: 'ts-apply-target', innerHTML: teasp.message.getLabel('tf10001300') }, radioEl); // 申請対象

    var lb1 = this.getDomHelper().create('label', null, this.getDomHelper().create('div', null, radioEl));
    var chk = this.getDomHelper().create('input', { type: 'radio', name: 'ApplyCommentTarget' }, lb1);
    chk.disabled = this.orgData.checkedOnly;
    chk.checked  = !this.orgData.checkedOnly;
    lb1.appendChild(document.createTextNode(' ' + teasp.message.getLabel('all_label'))); // すべて

    var lb2 = this.getDomHelper().create('label', null, this.getDomHelper().create('div', null, radioEl));
    chk = this.getDomHelper().create('input', { type: 'radio', name: 'ApplyCommentTarget' }, lb2);
    chk.disabled = (this.orgData.checkedList.length <= 0);
    chk.checked  = this.orgData.checkedOnly;
    lb2.appendChild(document.createTextNode(' ' + teasp.message.getLabel('tf10001630'))); // 選択した明細のみ

    dojo.query('input[type="radio"]', radioEl).forEach(function(el){
        this.getDomHelper().connect(el, 'onclick', this, teasp.Tsf.Dom.hitch(this, function(){ this.showClosingWarn(); }));     // 起算日またぎチェック・警告
    }, this);

    //---------------------
    // 起算日またぎ警告エリア作成
    this.getDomHelper().create('div', null, this.getDomHelper().create('div', { className: 'ts-apply-warn-closing', style: 'display:none;' }, areaEl));

    //---------------------
    // 明細数オーバー警告エリア作成
    this.getDomHelper().create('div', null, this.getDomHelper().create('div', { className: 'ts-apply-warn-over', style: 'display:none;' }, areaEl));

    //---------------------
    // 承認者
    var approEl = this.getDomHelper().create('div', { className: 'ts-apply-approver-area', style: 'width:390px;' }, areaEl);

    this.getDomHelper().create('div', { className: 'ts-apply-approver-a', innerHTML: teasp.message.getLabel('tk10000071') }, approEl); // 承認者
    var nm = this.getDomHelper().create('div', { className: 'ts-apply-approver-b' }, approEl);
    var lk = this.getDomHelper().create('div', { className: 'ts-apply-approver-c' }, approEl);
    var a1 = this.getDomHelper().create('a', { className: 'ts-apply-approver-a1' }, lk);
    var a2 = this.getDomHelper().create('a', { className: 'ts-apply-approver-a2' }, lk);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tk10004000') }, a1); // 再読み込み
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tk10004010') }, a2); // 承認者設定画面を開く
    nm.innerHTML = tsfManager.getTargetEmp().getApproverNames(teasp.constant.APPROVER_TYPE_EXP);
    teasp.Tsf.Dom.show(approEl, null, tsfManager.isUseExpApproverSet());
    this.getDomHelper().connect(a1, 'onclick', this, this.reloadApproverSet);   // 再読み込み
    this.getDomHelper().connect(a2, 'onclick', this, this.openApproverSet);     // 承認者設定画面を開く

    //---------------------
    // 稟議選択ボタン
    var ringiEl  = this.getDomHelper().create('div', { className: 'ts-apply-link-ringi' }, areaEl);
    var ringiBtn = this.getDomHelper().create('button', { className: 'std-button1', innerHTML: teasp.message.getLabel('tf10001640') }, ringiEl); // 稟議を関連付ける
    this.getDomHelper().connect(ringiBtn, 'onclick', this, this.openRingiList);
    var ringiClr = this.getDomHelper().create('button', { className: 'std-button2', innerHTML: teasp.message.getLabel('clearLabel') }, ringiEl); // クリア
    this.getDomHelper().connect(ringiClr, 'onclick', this, this.clearRingi);
    //---------------------
    // 稟議内容表示
    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form ts-section-ringi' }, areaEl);
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.ringiInfo);
    var row = null;
    this.fp.fcLoop(function(fc){
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, formEl);
        }else{
            var cssName = 'ts-form-row';
            row = this.getDomHelper().create('div', { className: cssName }, formEl);
            // ラベル部作成
            var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
            if(fc.getLw()){
                teasp.Tsf.Dom.style(label, 'width', fc.getLw());
            }
            this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
            // 入力欄作成
            fc.appendFieldDiv(this.getDomHelper(), row);
        }
    }, this);
    //---------------------
    // コメントエリア
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('comment_head'), className: 'ts-dialog-title' }, areaEl); // コメント
    var textArea = this.getDomHelper().create('textarea', { maxLength: 4000, style: 'width:390px;' }
                    , this.getDomHelper().create('div', { className: 'ts-dialog-comment' }, areaEl));
    teasp.Tsf.Dom.setlimitChars(this.getDomHelper(), [textArea], null, 4000);

    this.createButtons(areaEl);

    if(this.orgData.targetChoice){
        this.showClosingWarn(areaEl);
    }

    return areaEl;
};

/**
 * 起算日またぎのチェック・警告
 * @param {Object=} areaEl
 */
teasp.Tsf.ApplyCommentExp.prototype.showClosingWarn = function(areaEl){
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
teasp.Tsf.ApplyCommentExp.prototype.showOverWarn = function(areaEl){
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
teasp.Tsf.ApplyCommentExp.prototype.getTargetRange = function(areaEl){
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
teasp.Tsf.ApplyCommentExp.prototype.enableSubmit = function(areaEl){
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
teasp.Tsf.ApplyCommentExp.prototype.getDivideDateList = function(areaEl){
    var area = areaEl || this.getArea();
    var sd = tsfManager.getExpStartDate();
    if(this.orgData.targetChoice && sd > 0){
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
teasp.Tsf.ApplyCommentExp.prototype.createRangeList = function(lst, index){
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
teasp.Tsf.ApplyCommentExp.prototype.getExpList = function(exps){
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

/**
 * 稟議検索画面を開く
 * @param {Object} e
 */
teasp.Tsf.ApplyCommentExp.prototype.openRingiList = function(e){
    var fp = teasp.Tsf.formParams.ringiList;
    // 検索条件の種別の選択リストをセット
    var fs = fp.searchFields || [];
    for(var i = 0 ; i < fs.length ; i++){
        if(fs[i].apiKey == 'Type__c'){
            fs[i].pickList = tsfManager.getAtkApplyTypeList();
        }
    }
    tsfManager.showSearchListDialog({ discernment: 'ringiList' }, null, teasp.Tsf.Dom.hitch(this, this.selectedRingi));
};

/**
 * 稟議を選択した
 *
 * @param {Array.<Object>} lst
 */
teasp.Tsf.ApplyCommentExp.prototype.selectedRingi = function(lst){
    this.showRingiInfo(lst[0]);
};

/**
 * 稟議をクリア
 *
 */
teasp.Tsf.ApplyCommentExp.prototype.clearRingi = function(lst){
    this.showRingiInfo({});
};

/**
 * 稟議内容を表示
 *
 * @param {Array.<Object>} lst
 */
teasp.Tsf.ApplyCommentExp.prototype.showRingiInfo = function(vobj){
    this.fp.fcLoop(function(fc){
        if(fc.isApiField(true)){
            fc.drawText(this.getDomHelper(), vobj);
        }
    }, this);

    var area = teasp.Tsf.Dom.node('div.ts-section-ringi', this.getArea());
    teasp.Tsf.Dom.show(area, null, vobj.Id);
    teasp.Tsf.Dom.show('div.ts-apply-link-ringi button.std-button2', this.getArea(), vobj.Id);

    if(vobj.Id){
        this.getDomHelper().connect(teasp.Tsf.Dom.query('a', area), 'onclick', this, function(e){
            if(teasp.isSforce1()){
                sforce.one.navigateToURL('/' + vobj.Id);
            }else{
                window.open('/' + vobj.Id);
            }
        });
    }
};

teasp.Tsf.ApplyCommentExp.prototype.submitApply = function(comment){
    var req = { comment: comment };
    var cost = this.orgData.totalCost;
    var allApply = true;
    var uks = [];
    var expApply = this.orgData.expApply;
    if(this.orgData.targetChoice){
        var obj = this.getExpList((expApply && expApply.exps) || this.orgData.objBase.obj.EmpExp__r || []);
        if(obj.ids.length <= 0){
            teasp.tsAlert(teasp.message.getLabel('tf10001650')); // 申請対象がありません
            return;
        }
        req.ids  = obj.ids;
        cost     = obj.cost;
        uks      = obj.uks;
        allApply = obj.allApply;
    }else{
        var dates = this.orgData.allDates;
        var sd = tsfManager.getExpStartDate(); // 経費の起算日を取得
        if(sd > 0){
            var lst = teasp.util.date.divideDateList(dates, sd);
            if(lst.length > 1){
                if(sd >= 100){
                    sd = teasp.message.getLabel('tm10010490', teasp.util.date.getWeekJp(sd - 100)); // {0}曜日
                }else{
                    sd = teasp.message.getLabel('tm10010480', sd); // {0}日
                }
                teasp.tsAlert(teasp.message.getLabel('tf10000460', sd));// 経費申請の起算日（{0}）をまたいでしまうため、分割して申請してください。
                return;
            }
        }
        var expCountLimit = tsfManager.getExpCountLimit();
        if(dates.length > expCountLimit){
            teasp.tsAlert(teasp.message.getLabel('tm30001140', dates.length, expCountLimit));// ＊＊＊＊＊＊ 申請できません ＊＊＊＊＊＊\n申請対象の明細の数が合計 {0} 件あります。1申請あたりの明細の合計数が {1} 件以内となるように、分割して申請を行ってください。 
            return;
        }
    }

    // 費目入力チェック
    if(this.orgData.objBase.obj.EmpExp__r){
    	for(var i = 0; i < this.orgData.objBase.obj.EmpExp__r.length; i++){
    		var exp = this.orgData.objBase.obj.EmpExp__r[i];
    		if(!exp.ExpItemId__c || exp.ExpItemId__c.length == 0){
    			teasp.tsAlert(teasp.message.getLabel('jt13000060'));// 費目が未登録の明細があります。
                return;	
    		}
    	}
    }

    if(!tsfManager.isAllowMinusApply() && cost < 0){ // 合計金額がマイナスの経費申請を許可しないで、合計金額がマイナス
        teasp.tsAlert(teasp.message.getLabel('tm30001145'
                , teasp.util.currency.addFigure(cost)
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
    req.ringiId = this.fp.getFcByApiKey('Id').fetchValue().value;

    if(expApply){
        // 変更があり、承認申請の前に保存する必要がある場合、ここにくる
        for(var i = 0 ; i < expApply.exps.length ; i++){
            var exp = expApply.exps[i];
            if(allApply
            || (exp.Id && req.ids.contains(exp.Id))
            || uks.contains(exp._tempId)){
                exp.isApply = true; // この明細は申請対象であることを示す
            }
        }
        req.expApply = expApply;
    }

    tsfManager.submitApply(req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            this.hide();
            this.callback(result);
        }else{
            this.showError(result);
        }
    }));
};

teasp.Tsf.ApplyCommentExp.prototype.cancelApply = function(comment){
    var req = {
        solve   : this.orgData.solve,
        comment : comment
    };
    tsfManager.cancelApply(req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            this.hide();
            if(this.params.parentHide){
                this.params.parentHide();
            }
            this.callback(result);
        }else{
            this.showError(result);
        }
    }));
};
