/**
 * リスト画面の基底クラス
 *
 * @constructor
 */
teasp.Tsf.ListBase = function(targetList){
    this.reskey = 'L'; // リソース解放用の識別値なので文字なら何でもよい
    this.pageNo = 1;
    this.checkMap = {};
    this.selectedCount = 0;   // 選択数
    this.selectedCountMax = 0; // 選択数上限（0:上限なし）
    this.cntOverMessage = null; // 該当件数が表示最大件数を超えた時にツールチップで表示するメッセージ
};

teasp.Tsf.ListBase.prototype.setOption = function(option){
    this.option = option;
    this.freeFilts = (option ? option.filts : null);
    this.dataProcessingExt = (option ? option.dataProcessingExt : null);
};

/**
 * 選択数上限をセット
 * @param {number} n
 */
teasp.Tsf.ListBase.prototype.setSelectedCountMax = function(n){
	this.selectedCountMax = n;
};

teasp.Tsf.ListBase.prototype.setFreeFilts = function(filts){
    this.freeFilts = filts;
};

teasp.Tsf.ListBase.prototype.getFilt = function(flag){
    var freeFilts = this.freeFilts || [];
    var lst = [];
    if(freeFilts.length > 0){
        dojo.forEach(freeFilts, function(f){
            if(f.filtVal){
                lst.push(f.filtVal);
            }else if(f.ors){
                var lp = [];
                for(var i = 0 ; i < f.ors.length ; i++){
                    var o = f.ors[i] || [];
                    var lc = [];
                    for(var j = 0 ; j < o.length ; j++){
                        lc.push(o[j].filtVal);
                    }
                    lp.push('(' + lc.join(' and ') + ')');
                }
                lst.push('(' + lp.join(' or ') + ')');
            }
        });
    }
    var filts = this.fp.getFilts();
    dojo.forEach(filts, function(f){
        if(f.fix || freeFilts.length <= 0){
            if(f.filtVal){
                if(f.filtKey == 'empId'){
                    lst.push(teasp.Tsf.util.formatString(f.filtVal, tsfManager.getEmpId()));
                }else if(f.filtKey == 'userId'){
                    lst.push(teasp.Tsf.util.formatString(f.filtVal, tsfManager.getEmpUserId()));
                }else if(f.filtKey == 'today'){
                    lst.push(teasp.Tsf.util.formatString(f.filtVal, teasp.util.date.formatDate(teasp.util.date.getToday())));
                }else if(!f.mask || f.mask == this.mask){
                    lst.push(f.filtVal);
                }
            }else if(f.apiKey && f.value && !(/^_/.test(f.apiKey))){
                var fc = this.fp.getFcByApiKey(f.apiKey);
                if(fc){
                    var l = [];
                    fc.setFilts(l, [{ value: f.value }]);
                    for(var i = 0 ; i < l.length ; i++){
                        lst.push(l[i].filtVal);
                    }
                }
            }
        }
    }, this);
    if(lst.length <= 0){
        return '';
    }
    return (flag ? " where " : "") + lst.join(' and ');
};

teasp.Tsf.ListBase.prototype.setChildFilts = function(filts){
    this.childFilts = filts;
};

teasp.Tsf.ListBase.prototype.getChildFilt = function(){
    var filts = (this.childFilts || this.fp.getChildFilts());
    return (filts && filts.length > 0 ? filts[0].filtVal : null);
};

teasp.Tsf.ListBase.prototype.getChildNega = function(){
    var filts = (this.childFilts || this.fp.getChildFilts());
    return (filts && filts.length > 0 ? filts[0].nega : false);
};

/**
 * 初期化
 *
 */
teasp.Tsf.ListBase.prototype.init = function(){
    this.domHelper = new teasp.Tsf.Dom();
    this.show(false);
    teasp.Tsf.Dom.append(this.getArea(), this.createBase());
};

teasp.Tsf.ListBase.prototype.refresh = function(){
    // 選択情報をリセット
    this.checkMap = {};
    this.setCheckedIds();
    this.showCheckedCount(true);
    this.checkSelectableLimit(0);
    this.resetCheck();

    this.getDomHelper().freeBy(this.reskey);
    teasp.Tsf.Dom.show(this.getArea(), null, true);
    this.showData();
};

teasp.Tsf.ListBase.prototype.show = function(flag){
    teasp.Tsf.Dom.show(this.getArea(), null, flag);
};

teasp.Tsf.ListBase.prototype.getArea = function(){
    return teasp.Tsf.Dom.byId('expListView');
};

teasp.Tsf.ListBase.prototype.getListArea = function(){
    return teasp.Tsf.Dom.node('table.ts-list-body', this.getArea());
};

teasp.Tsf.ListBase.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.ListBase.prototype.getListMode = function(){
    return 1;
};

teasp.Tsf.ListBase.prototype.getTargetEmpId = function(){
    return null;
};

teasp.Tsf.ListBase.prototype.getDeptId = function(){
    return tsfManager.getTargetEmp().getDeptId();
};

teasp.Tsf.ListBase.prototype.getDept = function(){
    return tsfManager.getTargetEmp().getDept();
};

teasp.Tsf.ListBase.prototype.isShowInit = function(){
    return true;
};

/**
 * フォームを破棄（リソース解放、DOMを削除）
 */
teasp.Tsf.ListBase.prototype.destroy = function(){
    if(this.domHelper){
        this.domHelper.free();
        teasp.Tsf.Dom.empty(this.getArea());
        delete this.domHelper;
    }
    this.domHelper = null;
};

/**
 * テーブル作成
 *
 */
teasp.Tsf.ListBase.prototype.createBase = function(){
    // 表本体
    var table = this.getDomHelper().create('table', { className: 'ts-list-body ts-list-head' });
    // ヘッダ部
    var tr = this.getDomHelper().create('tr', null, this.getDomHelper().create('thead', null, table));
    var hkey = teasp.Tsf.Fp.setHkey(this.getDomHelper(), tr);
    var colCnt = 0;
    this.fp.fcLoop(function(fc){
        if(!fc.isHidden()){
            var th = this.getDomHelper().create('th', { id: fc.getDomId(hkey), style: { width: fc.getWidth() } }, tr);
            colCnt++;
            if(fc.isSortable()){
                teasp.Tsf.Dom.style(th, 'cursor', 'pointer');
                this.getDomHelper().connect(th, 'onclick', this, this.sortBy); // ヘッダ項目クリック
            }
            if(fc.isCheck()){
                this.getDomHelper().create('input', { type:'checkbox' }, th);
            }else{
                var div = this.getDomHelper().create('div', null, th);
                this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, div);
            }
        }
    }, this);

    // 全選択/解除
    var chk = teasp.Tsf.Dom.node('input[type="checkbox"]', tr);
    if(chk){
        this.getDomHelper().connect(chk, 'onclick', this, this.checkAll);
    }

    var tbody = this.getDomHelper().create('tbody', null, table);

    this.records = [];
    this.recordCount = 0;
    this.drawData(tbody); // 空行を作成する

    // フッタ部
    tr = this.getDomHelper().create('tr', null, this.getDomHelper().create('tfoot', null, table));
    tr.style.height = '0px';
    this.getDomHelper().create('td', { colSpan: colCnt }, tr);
//    dojo.forEach(this.fp.getFoots(), function(foot){
//        this.getDomHelper().create('div', {
//            innerHTML: (foot.name || '')
//        }, this.getDomHelper().create('td', {
//            colSpan : (foot.colSpan || 1),
//            style   : { textAlign: foot.align || 'left' }
//        }, tr));
//    }, this);

    return table;
};

/**
 * テーブル作成
 *
 */
teasp.Tsf.ListBase.prototype.createScrollTable = function(areaEl){
    var er = this.getDomHelper().create('div', { className: 'ts-error-area', style: 'display:none;' }, areaEl);
    this.getDomHelper().create('div', null, er);

    this.setSearchContent(areaEl);

    var formEl = this.getDomHelper().create('div', { className: 'ts-section-form' }, areaEl);
    this.getDomHelper().create('div', { className: 'ts-list-paging' }, formEl);

    var table1   = this.getDomHelper().create('table', { className: 'ts-list-head' }, formEl);
    // ヘッダ行作成
    var thead   = this.getDomHelper().create('thead', null, table1);
    var tr      = this.getDomHelper().create('tr'   , null, thead);

    var hkey = teasp.Tsf.Fp.setHkey(this.getDomHelper(), tr);
    this.fp.fcLoop(function(fc){
        if(!fc.isHidden()){
            var wp = fc.getWplus();
            var th = this.getDomHelper().create('th', { id: fc.getDomId(hkey), style: { width: fc.getWidth(wp) } }, tr);
            if(fc.getHeadCss()){
                teasp.Tsf.Dom.addClass(th, fc.getHeadCss());
            }
            if(fc.isSortable()){
                teasp.Tsf.Dom.style(th, 'cursor', 'pointer');
                this.getDomHelper().connect(th, 'onclick', this, this.sortBy);
            }
            if(fc.isCheck() && !fc.isRadio()){
                this.getDomHelper().create('input', { type:'checkbox' }, th);
            }else{
                var div = this.getDomHelper().create('div', null, th);
                this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, div);
            }
        }
    }, this);

    // 全選択/解除
    var chk = teasp.Tsf.Dom.node('input[type="checkbox"]', thead);
    if(chk){
        this.getDomHelper().connect(chk, 'onclick', this, this.checkAll);
    }

    var box    = this.getDomHelper().create('div'  , { className: 'ts-search-list-box' }, formEl);
    var table2 = this.getDomHelper().create('table', { className: 'ts-list-body' }, box);
    var tbody  = this.getDomHelper().create('tbody', null, table2);
    var rowSize = this.fp.getRowLimit();
    if(rowSize > this.fp.getRowDisp()){
        rowSize = this.fp.getRowDisp();
    }
    teasp.Tsf.Dom.style(box, 'height', '' + (rowSize * 20 + 2) + 'px'); // 表高さを決定

    for(var i = 0 ; i < rowSize ; i++){
        var tr = this.getDomHelper().create('tr', null, tbody);
        teasp.Tsf.Dom.toggleClass(tr, 'ts-row-even', !(i%2));
        teasp.Tsf.Dom.toggleClass(tr, 'ts-row-odd' ,  (i%2));
        var hkey = teasp.Tsf.Fp.setHkey(this.getDomHelper(), tr);
        // セルと入力欄を作成
        this.fp.fcLoop(function(fc){
            if(fc.isHidden()){
                this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId(hkey) }, tr);
            }else{
                fc.appendFieldCell(this.getDomHelper(), tr, hkey);
            }
        }, this);
        this.getDomHelper().create('td', { className: 'last', style: 'width:16px;display:none;' }, tr); // Macのブラウザでスクロールバーが非表示になる対策：ダミーのセルを挿入
   }
    table1.style.width = box.style.width = '' + (this.fp.getWidth() + 2) + 'px';
    er.style.width = table1.style.width;

    this.createButtons(areaEl);
};

teasp.Tsf.ListBase.prototype.setSearchContent = function(areaEl){
};

teasp.Tsf.ListBase.prototype.createButtons = function(areaEl){
};

teasp.Tsf.ListBase.prototype.showData = function(callback){
    this.showError();
    this.checkSelectableLimit(0);
    this.pageNo = 1;
    this.setSortMarker();
    this.searchData(1, this.fp.getRowLimit(), true, this.fp.isPiw(),
            teasp.Tsf.Dom.hitch(this, function(succeed, result){
                if(succeed){
                    this.recordCount = result.recordsCount;
                    this.records = result.records || [];
                    this.mergePiwks(this.records, result.piwks || []);
                    this.dataProcessing();
                    if(this.dataProcessingExt){
                      this.dataProcessingExt(this.records);
                    }
                    this.drawData();
                    this.showDataEnd();
                }else{
                    this.showError(result);
                }
            }
        ));
};

teasp.Tsf.ListBase.prototype.tryChangePage = function(n){
    this.showError();
    this.getCheckedIds();
    this.resetCheck();
    this.searchData(n, this.fp.getRowLimit(), false, this.fp.isPiw(),
        teasp.Tsf.Dom.hitch(this, function(succeed, result){
            if(succeed){
                this.pageNo = n;
                this.records = result.records || [];
                this.mergePiwks(this.records, result.piwks || []);
                this.dataProcessing();
                if(this.dataProcessingExt){
                  this.dataProcessingExt(this.records);
                }
                this.drawData();
            }else{
                this.showError(result);
            }
        }
    ));
};

teasp.Tsf.ListBase.prototype.searchData = function(pno, limit, countUp, piw, callback){
    var req = {
        limit       : limit,
        offset      : (limit * (pno - 1)),
        countUp     : countUp,
        piw         : piw
    };
    var method;
    if(this.fp.isStereoType()){
        req.target      = this.fp.getObjectName();
        req.countUp     = true;
        req.mode        = this.getListMode();
        if(tsfManager.isEmpTargetMode()){
            req.targetEmpId = tsfManager.getEmpId();
        }else{
            req.targetEmpId = null;
        }
        req.orderBy     = this.fp.createOrderBy();
        req.filt        = this.getFilt();
        req.childFilt   = this.getChildFilt();
        req.childNega   = this.getChildNega();
        req.payManage   = this.fp.getPayManage();
        req.irregularType = this.fp.getIrregularType();
        method          = 'getList';
    }else if(this.fp.isJobList()){
        req.countUp     = true;
        req.orderBy     = this.fp.createOrderBy();
        req.filt        = this.getFilt();
        req.targetEmpId = tsfManager.getEmpId();
        method          = 'getJobList';
    }else if(this.fp.isEmpList()){
        req.soql        = this.fp.createSoql(null, this.getChildFilt(), true);
        req.soqlForCnt  = this.fp.createSoqlForCnt(null, true);
        req.countUp     = true;
        req.orderBy     = this.fp.createOrderBy();
        req.filt        = this.getFilt();
        req.orgTarget   = this.getOrgTarget();
        method          = 'getEmpList';
    }else{
        req.soql        = this.fp.createSoql(this.getFilt(true));
        req.soqlForCnt  = (countUp ? this.fp.createSoqlForCnt(this.getFilt(true)) : null);
        req.irregularType = this.fp.getIrregularType();
        req.countUp     = true;
        method          = 'searchData';
    }
    tsfManager[method](req,
        teasp.Tsf.Dom.hitch(this, function(succeed, result){
            if(succeed){
                callback(true,  result);
            }else{
                callback(false, result);
            }
        })
    );
};

teasp.Tsf.ListBase.prototype.dataProcessing = function(){
};

teasp.Tsf.ListBase.prototype.showDataEnd = function(){
    // Macのブラウザでスクロールバーが非表示になる対策
    var box = teasp.Tsf.Dom.node('div.ts-search-list-box', this.getArea());
    if(box){
        var n = box.offsetWidth - box.clientWidth - 2; // スクロールバーの幅を得るための式
        if(n <= 0){
            // スクロールバーの幅がない＝スクロールバーが非表示になっているので、
            // スクロールバーの幅の分、右端が空白になる。
            // その空白を埋めるため、ダミーのセルを表示させる。
            teasp.Tsf.Dom.query('td:last-child', box).forEach(function(td){
                teasp.Tsf.Dom.style(td, 'display', '');
            });
        }
    }
};

teasp.Tsf.ListBase.prototype.showError = function(result){
    if(this.isShowInit()){
        var er = teasp.Tsf.Dom.node('.ts-error-area', this.getArea());
        teasp.Tsf.Error.showError(result, er);
    }else{
        teasp.Tsf.Error.showError(result);
    }
};

teasp.Tsf.ListBase.prototype.mergePiwks = function(records, piwks){
    dojo.forEach(records, function(rec){
        for(var i = 0 ; i < piwks.length ; i++){
            if(rec.Id == piwks[i].ProcessInstance.TargetObjectId){
                rec.piwk = true;
            }
        }
    }, this);
};

teasp.Tsf.ListBase.prototype.sortBy = function(e){
    var th = teasp.Tsf.Dom.getAncestorByTagName(e.target, 'TH');
    var key = teasp.Tsf.Fp.getHkey(teasp.Tsf.Dom.getAncestorByTagName(th, 'TR'));
    var fc = this.fp.getFcById(th.id, key);
    if(!fc){
        return;
    }
    this.fp.setSortKeys({ apiKey: fc.getApiKey() });
    this.showData();
};

teasp.Tsf.ListBase.prototype.changePage = function(n){
    var pg = n;
    var that = this;
    return function(){
        that.tryChangePage(pg);
    };
};

teasp.Tsf.ListBase.prototype.drawData = function(tb){
    var tbody = (tb || this.getCheckboxBody());
    this.getDomHelper().freeBy(this.reskey);
    teasp.Tsf.Dom.empty(tbody);

    this.firstEmptyRowKey = null;

    var rowSize = this.fp.getRowLimit() + 1;
    for(var i = 0 ; i < rowSize ; i++){
        var tr = this.getDomHelper().create('tr', null, tbody);
        var hkey = teasp.Tsf.Fp.setHkey(this.getDomHelper(), tr);
        // セルと入力欄を作成
        this.fp.fcLoop(function(fc){
            if(fc.isHidden()){
                this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId(hkey) }, tr);
            }else{
                fc.appendFieldCell(this.getDomHelper(), tr, hkey);
            }
        }, this);
        this.getDomHelper().create('td', { className: 'last', style: 'width:16px;display:none;' }, tr); // Macのブラウザでスクロールバーが非表示になる対策：ダミーのセルを挿入

        var record = (i < this.records.length ? this.records[i] : {});
        if(i == this.records.length){
            this.firstEmptyRowKey = hkey;
        }
        this.fp.fcLoop(function(fc){
            fc.drawText(this.getDomHelper(), record, hkey, tr);
        }, this);
        if(i < this.records.length){
            tr.style.cursor = 'pointer';
            this.getDomHelper().connect(tr, 'onclick', this, this.clickTr, this.reskey);
        }else{
            tr.style.cursor = 'default';
        }
        this.setAnchor(tr);
    }
    this.setCheckedIds();

    teasp.Tsf.ListBase.setPaging({
            pageNo   : this.pageNo,
            cntAll   : this.recordCount,
            rowLimit : this.fp.getRowLimit(),
            pageLimit: this.fp.getPageLimit(),
            cntOverMessage: this.cntOverMessage
        },
        teasp.Tsf.Dom.node('.ts-list-paging', this.getArea()),
        this.getDomHelper(),
        'paging',
        this
    );
};

teasp.Tsf.ListBase.prototype.setAnchor = function(tr){
    this.getDomHelper().connect(teasp.Tsf.Dom.query('a', tr), 'onclick', this, function(e){
        try{
            var hkey = teasp.Tsf.Fp.getHkey(teasp.Tsf.Dom.getAncestorByTagName(e.target, 'TR'));
            var id = this.fp.getFcByApiKey('Id').fetchValue(hkey).value;
            if(id){
                tsfManager.changeView(null, id, null, teasp.Tsf.Dom.hitch(this, function(succeed, result){
                    if(!succeed){
                        this.showError(result);
                    }
                }));
            }
        }catch(e){
            this.showError(e);
        }
    }, this.reskey);
};

teasp.Tsf.ListBase.prototype.setSortMarker = function(){
    var hkey = teasp.Tsf.Fp.getHkey(teasp.Tsf.Dom.node('.ts-list-head thead tr', this.getArea()));
    var l = this.fp.getSortKeys();
    var so = (l.length > 0 ? l[0] : null);
    this.fp.fcLoop(function(fc){
        if(!fc.isHidden()){
            var div = teasp.Tsf.Dom.node('div', teasp.Tsf.Dom.byId(fc.getDomId(hkey)));
            if(div){
                var mkr = teasp.Tsf.Dom.node('.pp_base', div);
                if(so && fc.getApiKey() == so.apiKey){
                    if(!mkr){
                        this.getDomHelper().create('div', {
                            className: 'pp_base pp_ico_sort_' + (so.desc ? 'desc' : 'asc')
                        }, div);
                    }else{
                        teasp.Tsf.Dom.toggleClass(mkr, 'pp_ico_sort_asc' , (so.desc ? false : true));
                        teasp.Tsf.Dom.toggleClass(mkr, 'pp_ico_sort_desc', (so.desc ? true : false));
                    }
                }else if(mkr){
                    teasp.Tsf.Dom.destroy(mkr);
                }
            }
        }
    }, this);
};

teasp.Tsf.ListBase.setPaging = function(sp, pagingEl, domHelper, pkey, thisObject){
    if(!pagingEl){
        return;
    }
    domHelper.freeBy(pkey);
    teasp.Tsf.Dom.empty(pagingEl);

    var pgcnt = (sp.cntAll > 0 ? Math.ceil(sp.cntAll / sp.rowLimit) : 1);
    if(sp.pageLimit && pgcnt > sp.pageLimit){
        pgcnt = sp.pageLimit;
    }

    var pp = domHelper.create('div', {
        className   : 'ts-page-no ts-page-' + (sp.pageNo > 1 ? 'on' : 'off'),
        innerHTML   : '&lt;'
    }, pagingEl);
    if(sp.pageNo > 1){
        domHelper.connect(pp, 'onclick', thisObject, thisObject.changePage(sp.pageNo - 1), pkey);
    }
    var boxs = teasp.util.getPageBox(pgcnt, sp.pageNo, 4, 5, 4);
    dojo.forEach(boxs, function(n){
        if(n === null){
            domHelper.create('div', {
                className   : 'ts-page-no ts-page-off',
                innerHTML   : '･･'
            }, pagingEl);
        }else{
            var p = domHelper.create('div', {
                className   : 'ts-page-no ts-page-' + (sp.pageNo != n ? 'on' : 'off'),
                innerHTML   : n
            }, pagingEl);
            if(sp.pageNo != n){
                domHelper.connect(p, 'onclick', thisObject, thisObject.changePage(n), pkey);
            }
        }
    });
    var pn = domHelper.create('div', {
        className   : 'ts-page-no ts-page-' + (sp.pageNo < pgcnt ? 'on' : 'off'),
        innerHTML   : '&gt;'
    }, pagingEl);
    if(sp.pageNo < pgcnt){
        domHelper.connect(pn, 'onclick', thisObject, thisObject.changePage(sp.pageNo + 1), pkey);
    }

    var beg = ((sp.pageNo - 1) * sp.rowLimit) + 1;
    var end = beg + sp.rowLimit - 1;
    if(end > sp.cntAll){
        end = sp.cntAll;
    }
    var msg = '';
    if(sp.cntAll > 0){
        if(sp.cntAll <= sp.rowLimit){
            msg = teasp.message.getLabel('tk10003230', sp.cntAll); // {0} 件を表示
        }else{
            msg = teasp.message.getLabel((sp.cntAll==teasp.constant.COUNT_LIMIT ? 'tk10003241' : 'tk10003240'), sp.cntAll, (beg || 1), (end || 1)); // {0} 件中 {1}～{2} 件を表示
        }
    }
    domHelper.create('div', { innerHTML: msg, className:'ts-page-message' }, pagingEl);

    // 該当件数が表示できる最大件数を超えた場合、[!]アイコンを表示してツールチップをセット
    if(sp.rowLimit && sp.pageLimit && sp.cntOverMessage && sp.cntAll > (sp.rowLimit * sp.pageLimit)){
        var icon = domHelper.create('div', null, pagingEl);
        domHelper.create('div', { className:'pp_base pp_icon_caut', style:'margin-left:4px;margin-top:4px;' }, icon);
        domHelper.createTooltip({
            connectId   : icon,
            label       : sp.cntOverMessage,
            position    : ['below'],
            showDelay   : 200
        });
    }

    if(pgcnt <= 1){
        teasp.Tsf.Dom.show('.ts-page-no', pagingEl, false);
    }
};

teasp.Tsf.ListBase.prototype.clickTr = function(e){
    if(e.target.tagName == 'INPUT' && e.target.type == 'checkbox'){
        if(this.checkSelectableLimit(this.selectedCount + (e.target.checked ? 1 : 0))){
            e.target.checked = false;
            return;
        }
        this.showCheckedCount();
        return;
    }
    var chk = teasp.Tsf.Dom.node('input.ts-check:not(:disabled)', teasp.Tsf.Dom.getAncestorByTagName(e.target, 'TR'));
    if(chk && (chk.type == 'checkbox' || !chk.checked)){
        if(this.checkSelectableLimit(this.selectedCount + (!chk.checked ? 1 : 0))){
            return;
        }
        chk.checked = !chk.checked;
        this.showCheckedCount();
    }
};

teasp.Tsf.ListBase.prototype.getCheckboxHead = function(e){
    return teasp.Tsf.Dom.node('thead', this.getListArea());
};

teasp.Tsf.ListBase.prototype.getCheckboxBody = function(e){
    var tbody = teasp.Tsf.Dom.node('tbody', this.getListArea());
    return tbody;
};

teasp.Tsf.ListBase.prototype.checkAll = function(e){
    var chk = teasp.Tsf.Dom.node('input[type="checkbox"]', this.getCheckboxHead());
    if(chk){
        var tbody = this.getCheckboxBody();
        if(tbody){
            var reqchk = this.selectedCount;
            teasp.Tsf.Dom.query('input[type="checkbox"]', tbody).forEach(function(el){
                if(!el.checked && chk.checked){
                    reqchk++;
                }
                if(!chk.checked || !this.selectedCountMax || this.selectedCount < this.selectedCountMax){
                    if(!el.checked && chk.checked){
                        this.selectedCount++;
                    }
                    el.checked = chk.checked;
                }
            }, this);
            this.showCheckedCount();
            this.checkSelectableLimit(reqchk);
        }
    }
};

teasp.Tsf.ListBase.prototype.resetCheck = function(){
    var head = this.getCheckboxHead();
    if(!head){
        return;
    }
    var chk = teasp.Tsf.Dom.node('input[type="checkbox"]', head);
    if(chk){
        chk.checked = false;
        this.showCheckedCount();
        this.checkSelectableLimit(0);
    }
};

teasp.Tsf.ListBase.prototype.showCheckedCount = function(flag){
    var n = (flag ? 0 : this.getCheckedIds().length);
    this.selectedCount = n;
    var div = teasp.Tsf.Dom.node('div.ts-list-countMsg', this.getArea());
    if(div){
        div.innerHTML = teasp.message.getLabel('tf10001830', n); // {0} 件を選択
    }
};

teasp.Tsf.ListBase.prototype.getCheckedIds = function(){
    var tbody = this.getCheckboxBody();
    var mp = {};
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var tr = tbody.rows[i];
        var hkey = teasp.Tsf.Fp.getHkey(tr);
        var id = this.fp.getFcByApiKey('Id').fetchValue(hkey).value;
        if(id){
            var chk = teasp.Tsf.Dom.node('input.ts-check', tr);
            if(chk && chk.type == 'checkbox'){
                mp[id] = chk.checked;
            }
        }
    }
    teasp.Tsf.util.mixin(this.checkMap, mp);
    var lst = [];
    for(var key in this.checkMap){
        if(this.checkMap.hasOwnProperty(key) && this.checkMap[key]){
            lst.push(key);
        }
    }
    return lst;
};

teasp.Tsf.ListBase.prototype.setCheckedIds = function(){
    var tbody = this.getCheckboxBody();
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var tr = tbody.rows[i];
        var hkey = teasp.Tsf.Fp.getHkey(tr);
        var id = this.fp.getFcByApiKey('Id').fetchValue(hkey).value;
        if(id){
            var chk = teasp.Tsf.Dom.node('input.ts-check', tr);
            if(chk && chk.type == 'checkbox'){
                chk.checked = this.checkMap[id];
            }
        }
    }
};

teasp.Tsf.ListBase.prototype.resizedArea = function(box){
};

teasp.Tsf.ListBase.prototype.getOrgTarget = function(){
    return null;
};

/**
 * 選択件数が上限を超えるかチェック
 * 超える場合はメッセージ表示、超えない場合はメッセージ消去
 *
 * @param {number} cnt 選択件数
 * @returns {boolean} true:上限超 false:上限以下
 */
teasp.Tsf.ListBase.prototype.checkSelectableLimit = function(cnt){
    var max = this.selectedCountMax; // 上限値
    if(!max){
        return false;
    }
    if(cnt <= max){
        teasp.Tsf.Dom.html('div.ts-list-caution', this.getArea(), '');
        return false;
    }else{
        teasp.Tsf.Dom.html('div.ts-list-caution', this.getArea(), teasp.message.getLabel('tf10010820', max)); // 選択可能な件数は{0}件です。
        return true;
    }
};
