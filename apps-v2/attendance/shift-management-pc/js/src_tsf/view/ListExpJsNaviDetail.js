/**
 * J'sNAVI請求書明細画面
 *
 * @constructor
 */
teasp.Tsf.ListExpJsNaviDetail = function(){
	var listKey = 'ListExpJsNaviDetail';
	var formParam = teasp.Tsf.formParams.ListExpJsNaviDetail;
	this.fp = teasp.Tsf.Fp.createFp(formParam);
	this.searchObj = null;

	if(tsfManager.params["targetym"] == null){
		var dt = teasp.util.date.getToday();
		dt.setMonth(dt.getMonth() - 1);
	    this.targetYM = dt.getFullYear() + ("0" + (dt.getMonth() + 1)).slice(-2);
	} else{
		this.targetYM = tsfManager.params["targetym"];
	}

    this.targetStatus = 0;
};

teasp.Tsf.ListExpJsNaviDetail.prototype = new teasp.Tsf.ListBase();
teasp.Tsf.ListExpJsNaviDetail.SELECTION_LIMIT = 200;

/**
 * テーブル作成
 *
 */
teasp.Tsf.ListExpJsNaviDetail.prototype.createBase = function(){
	var listTop = this.getDomHelper().create('div', { className: 'ts-list-top' });

	//-----------------
	// 左側のDIV
	var tr = this.getDomHelper().create('tr', null
	            , this.getDomHelper().create('tbody', null
	                , this.getDomHelper().create('table', null
	                    , this.getDomHelper().create('div', { className: 'ts-form-edge-left' }, listTop))));

	//-----------------
	this.getDomHelper().create('div', { className: 'ts-list-paging' }, this.getDomHelper().create('td', { className: 'ts-space' }, tr));


	//-----------------
	// 右側のDIV
	tr = this.getDomHelper().create('tr', null
			, this.getDomHelper().create('tbody', null
				, this.getDomHelper().create('table', null
						, this.getDomHelper().create('div', { className: 'ts-form-edge-right' }, listTop))));

	var table = teasp.Tsf.ListBase.prototype.createBase.call(this);

	return [listTop, table];
};

teasp.Tsf.ListExpJsNaviDetail.prototype.getFilt = function(flag){

	// #7526
	// 請求データ参照画面からのパラメータで検索条件を作成する
	var freeFilts = [];
	var lst = [];
	var targetstatus = tsfManager.params['targetstatus'];
	var targetym = tsfManager.params['targetym'];
	var dfrom = tsfManager.params['dfrom'];
	var dto = tsfManager.params['dto'];
	var appno = !tsfManager.params['appno'] ? null : decodeURI(tsfManager.params['appno']);
	var empdept = !tsfManager.params['empdept'] ? null : decodeURI(tsfManager.params['empdept']);
	var appdept = !tsfManager.params['appdept'] ? null : decodeURI(tsfManager.params['appdept']);
	var empcd = !tsfManager.params['empcd'] ? null : decodeURI(tsfManager.params['empcd']);
	var empnm = !tsfManager.params['empnm'] ? null : decodeURI(tsfManager.params['empnm']);

	// 表示対象
	if (targetstatus) {

	    // 表示対象(0:すべて、1:承認済み、2:金額差異あり、3:未承認)
		if(targetstatus == '1' || targetstatus == '2'){
			lst.push("(ExpApplyId__r.Status__c = '承認済み' or ExpApplyId__r.Status__c = '精算済み' or ExpApplyId__r.Status__c = '確定済み' or ExpApplyId__r.Status__c = '仕訳済み')");

		} else if(targetstatus == '3'){
			lst.push("(ExpApplyId__r.Status__c != '承認済み' and ExpApplyId__r.Status__c != '精算済み' and ExpApplyId__r.Status__c != '確定済み' and ExpApplyId__r.Status__c != '仕訳済み')");
		}
	}

	// 利用日付範囲
	if (dfrom || dto) {
		if (dfrom && dto) {
			lst.push("(Date__c >= " + dfrom + " and Date__c <= " + dto + ")");

		} else if (!dfrom && dto) {
			lst.push("Date__c <= " + dto);

		} else if (dfrom && !dto) {
			lst.push("Date__c >= " + dfrom);
		}

	// 利用日付範囲が入力されていない場合は月度を指定
	} else {
		lst.push("YearMonth__c = " + targetym);
	}

	// 申請番号
	if (appno) {
		lst.push("ExpApplyId__r.ExpApplyNo__c like '%" + appno + "'");
	}

	// 部署
	if (empdept || appdept) {
		if (empdept && appdept) {
			lst.push("(EmpId__r.DeptId__r.Name like '%" + empdept + "%' or ExpApplyId__r.DeptId__r.Name like '%" + appdept + "%')");

		} else if (!empdept && appdept) {
			lst.push("ExpApplyId__r.DeptId__r.Name like '%" + appdept + "%'");

		} else if (empdept && !appdept) {
			lst.push("EmpId__r.DeptId__r.Name like '%" + empdept + "%'");
		}
	}

	// 社員コード
	if (empcd) {
		lst.push("EmpId__r.EmpCode__c like '" + empcd + "%'");
	}

	// 社員名
	if (empnm) {
		lst.push("EmpId__r.Name like '%" + empnm + "%'");
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


teasp.Tsf.ListExpJsNaviDetail.prototype.getListMode = function(){
    return 3;
};

teasp.Tsf.ListExpJsNaviDetail.prototype.dataProcessing = function(){
    if(!this.records){
        return;
    }
    dojo.forEach(this.records, function(record){
    	console.log(record);
    }, this);
};

teasp.Tsf.ListExpJsNaviDetail.prototype.drawData = function(tb){
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

        // #7535 経費申請番号は表示しないので削除
        // 申請番号へのリンク（経費申請番号優先）
        //if(record.ExpApplyId__c && record.ExpApplyId__c.length > 0){
        //	record._ApplyNo = record.ExpApplyNo__c;
        //} else if(record.ExpPreApplyId__c && record.ExpPreApplyId__c.length > 0){
        //	record._ApplyNo = record.ExpPreApplyNo__c;
        //}

        // #7535 事前申請番号へのリンク
        if(record.ExpPreApplyId__c && record.ExpPreApplyId__c.length > 0){
        	record._PreApplyNo = record.ExpPreApplyId__r.ExpPreApplyNo__c;
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
        this.setExpAnchor(tr, record);
    }
    this.setCheckedIds();

    teasp.Tsf.ListBase.setPaging({
            pageNo   : this.pageNo,
            cntAll   : this.recordCount,
            rowLimit : this.fp.getRowLimit()
        },
        teasp.Tsf.Dom.node('.ts-list-paging', this.getArea()),
        this.getDomHelper(),
        'paging',
        this
    );
};

/**
 * 事前申請へのリンクを張る
 * #7535 請求明細には事前申請のリンクのみ表示のため、経費申請の処理を削除し事前申請リンクの処理を追加
 */
teasp.Tsf.ListExpJsNaviDetail.prototype.setExpAnchor = function(tr, record){
    var a = teasp.Tsf.Dom.node('a', tr);

    if(a){
    	// 事前申請Idを取得
        var hkey = teasp.Tsf.Fp.getHkey(tr);
        var preApplyId = this.fp.getFcByApiKey('ExpPreApplyId__c').fetchValue(hkey).value;

		// 事前申請Idを取得できた場合はリンクを設定
		if (preApplyId) {
			a.href = teasp.getPageUrl('expPreApplyView') + '?id=' + preApplyId;
			a.target = '_blank';
		}
    }
};

teasp.Tsf.ListExpJsNaviDetail.prototype.search = function(){
    var key = 'searchExpJsNavi';
    this.searchDialog = new teasp.Tsf.SearchCondition(teasp.Tsf.formParams[key]);
    this.searchDialog.show((this.searchObj || {}), teasp.Tsf.Dom.hitch(this, function(obj){
        this.setFreeFilts(obj.filts);
        this.searchObj = obj;
        this.refresh();
    }));
};

teasp.Tsf.ListExpJsNaviDetail.prototype.searchData = function(pno, limit, countUp, piw, callback){
    var req = {
        limit       : limit,
        offset      : (limit * (pno - 1)),
        countUp     : countUp,
        piw         : piw
    };
    var method;
    req.target      = this.fp.getObjectName();
    req.countUp     = true;
    req.mode        = this.getListMode();
    req.targetEmpId = tsfManager.params["targetempid"];
    req.orderBy     = this.fp.createOrderBy();
    req.filt        = this.getFilt();
    req.childFilt   = this.getChildFilt();
    req.childNega   = this.getChildNega();
    req.payManage   = this.fp.getPayManage();
    req.irregularType = this.fp.getIrregularType();
    req.targetStatus = this.targetStatus;
    req.targetYM	= tsfManager.params["targetym"];
    req.expPreApplyId = tsfManager.params["exppreapplyid"];
    req.expApplyId  = tsfManager.params["expapplyid"];
    method          = 'getList';

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

