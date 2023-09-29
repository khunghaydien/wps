/**
 * J'sNAVI請求書リスト画面
 *
 * @constructor
 */
teasp.Tsf.ListExpJsNavi = function(listType){
	this.listType = listType;
	var listKey = 'ListExpJsNavi';
	var formParam = teasp.Tsf.formParams.ListExpJsNavi;
	this.fp = teasp.Tsf.Fp.createFp(formParam);
	this.searchObj = {
		values: (this.fp.getDefaultFilts() || {})
	};

	var dt = teasp.util.date.getToday();
	dt.setMonth(dt.getMonth() - 1);
    this.targetYM = dt.getFullYear() + ("0" + (dt.getMonth() + 1)).slice(-2);

    this.targetStatus = 0;			// 表示対象
    this.payStatus = 1;				// #7401 ステータス
    this.totalUseAmount = 0;		// 利用金額合計
    this.totalInvoiceAmount = 0;	// 請求額合計
};

teasp.Tsf.ListExpJsNavi.prototype = new teasp.Tsf.ListBase();
teasp.Tsf.ListExpJsNavi.SELECTION_LIMIT = 200;

/**
 * テーブル作成
 *
 */
teasp.Tsf.ListExpJsNavi.prototype.createBase = function(){
	var listTop = this.getDomHelper().create('div', { className: 'ts-list-top' });

	//-----------------
	// 左側のDIV
	var tr = this.getDomHelper().create('tr', null
	            , this.getDomHelper().create('tbody', null
	                , this.getDomHelper().create('table', null
	                    , this.getDomHelper().create('div', { className: 'ts-form-edge-left' }, listTop))));

	//-----------------
	// 月度のプルダウン
	this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tk10000063') } // 月度
	        , this.getDomHelper().create('td', { className: 'ts-list-top-label' }, tr));
	var select = this.getDomHelper().create('select', { className: 'ts-list-top-range', id:'ymSelect' }
	                , this.getDomHelper().create('div', null
	                    , this.getDomHelper().create('td', { className: 'ts-list-top-select' }, tr)));

	var ymList = [];
	var dt = teasp.util.date.getToday();

	// #6866　リストは当月を含む7か月表示
	dt.setMonth(dt.getMonth());
	var initDt = dt.getFullYear() + ("0" + (dt.getMonth() + 1)).slice(-2);
	for(var i = 0; i < 7; i++){
		var ym = dt.getFullYear() + ("0" + (dt.getMonth() + 1)).slice(-2);
		ymList.push(ym);
		dt.setMonth(dt.getMonth() - 1);
	}

	// #6866　月度指定を表示する
	teasp.util.monthlyPulldown.create(select, ymList, initDt, true, true);
	select.value = this.targetYM;
	this.getDomHelper().connect(select, 'onchange', this, this.changeList);

	//-----------------
	// ステータスプルダウン
	this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('status_label') }
	        , this.getDomHelper().create('td', { className: 'ts-list-top-label' }, tr));
	select = this.getDomHelper().create('select', { className: 'ts-list-top-status', id:'statusSelect' }
	                , this.getDomHelper().create('div', null
	                    , this.getDomHelper().create('td', { className: 'ts-list-top-status' }, tr)));
	this.getDomHelper().create('option', { value:'0', innerHTML:teasp.message.getLabel('all_label')  }, select); // すべて
	this.getDomHelper().create('option', { value:'1', innerHTML:teasp.message.getLabel('jt18000180') }, select); // 承認済み
	this.getDomHelper().create('option', { value:'2', innerHTML:teasp.message.getLabel('jt18000100') }, select); // 金額差異あり
	this.getDomHelper().create('option', { value:'3', innerHTML:teasp.message.getLabel('jt18000190') }, select); // 未承認
	this.getDomHelper().connect(select, 'onchange', this, this.changeStatus);

	//-----------------
	// #7401 精算状況のプルダウン
	this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tf10004981') },
			this.getDomHelper().create('td', { className: 'ts-list-top-label' }, tr));

	// 選択リスト
	select = this.getDomHelper().create('select', { className: 'ts-list-top-status', id:'payStatus' },
				this.getDomHelper().create('div', null,
					this.getDomHelper().create('td', { className: 'ts-list-top-status' }, tr)));

	// 選択リストアイテムの設定
	//this.getDomHelper().create('option', { value:'0', innerHTML:teasp.message.getLabel('all_label')  }, select); 			// すべて
	this.getDomHelper().create('option', { value:'1', innerHTML:teasp.message.getLabel('tk10000078') }, select); 			// 精算対象
	this.getDomHelper().create('option', { value:'2', innerHTML:teasp.message.getLabel('reimbursement_label') }, select);	// 精算済み
	this.getDomHelper().connect(select, 'onchange', this, this.changePayStatus);

	//-----------------
	//this.getDomHelper().create('div', { className: 'ts-list-paging' }, this.getDomHelper().create('td', { className: 'ts-space' }, tr));


	//-----------------
	// 右側のDIV
	tr = this.getDomHelper().create('tr', null
			, this.getDomHelper().create('tbody', null
				, this.getDomHelper().create('table', { className: 'ts-form-control' }
						, this.getDomHelper().create('div', { className: 'ts-form-edge-right' }, listTop))));

	// 利用金額合計
	this.getDomHelper().create('div', { className:'', innerHTML: teasp.message.getLabel('jt18000130') }, this.getDomHelper().create('td', { className: 'ts-payValue-label' }, tr));
	this.getDomHelper().create('div', { id:'totalUseAmount', className:'', innerHTML: '' }, this.getDomHelper().create('td', { className: 'ts-payValue-value ts-form-currency' }, tr));
	this.getDomHelper().create('div', { innerHTML: '&nbsp;' }, this.getDomHelper().create('td', { className: '' }, tr));
	// 請求金額合計
	this.getDomHelper().create('div', { className:'', innerHTML: teasp.message.getLabel('jt18000140') }, this.getDomHelper().create('td', { className: 'ts-payValue-label' }, tr));
	this.getDomHelper().create('div', { id:'totalInvoiceAmount', className:'', innerHTML: '' }, this.getDomHelper().create('td', { className: 'ts-payValue-value ts-form-currency' }, tr));
	this.getDomHelper().create('div', { innerHTML: '&nbsp;' }, this.getDomHelper().create('td', { className: '' }, tr));
	// 差額
	this.getDomHelper().create('div', { className:'', innerHTML: teasp.message.getLabel('jt18000150') }, this.getDomHelper().create('td', { className: 'ts-payValue-label' }, tr));
	this.getDomHelper().create('div', { id:'diffAmount', className:'', innerHTML: '' }, this.getDomHelper().create('td', { className: 'ts-dueToPay-value ts-form-currency' }, tr));
	this.getDomHelper().create('div', { innerHTML: '&nbsp;' }, this.getDomHelper().create('td', { className: '' }, tr));

	// CSV出力が必要になる予感
//	this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('tk10000755') }, this.getDomHelper().create('td', { className: 'ts-form-csv ts-std-button' }, tr)); // CSV出力
	this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('tf10001460') }, this.getDomHelper().create('td', { className: 'ts-search-button' }, tr)); // 検 索

	// 検索
	var d = teasp.Tsf.Dom.node('.ts-search-button button', tr);
	if(d){
	    this.getDomHelper().connect(d, 'onclick', this, function(e){
	        this.search();
	    });
	}

	// CSV出力
/*
	var d = teasp.Tsf.Dom.node('.ts-form-csv button', tr);
	if(d){
	    this.getDomHelper().connect(d, 'onclick', this, function(e){
	        this.csvOut();
	    });
	}
*/

	// #7401 ページングを下段に移動
	var paging = this.getDomHelper().create('div', { className: 'ts-list-paging', style: 'margin-left:21px; margin-bottom:5px;' });
//	var countMsg = this.getDomHelper().create('div', { className: 'ts-list-countMsg' });

	var table = teasp.Tsf.ListBase.prototype.createBase.call(this);

	// #7401
	return [listTop, paging, table];
//	return [listTop, /*countMsg,*/ table];
};

teasp.Tsf.ListExpJsNavi.prototype.changeList = function(){
    var ym = teasp.Tsf.Dom.node('#ymSelect', this.getArea());

    // #6866 月度指定が選択された場合
    if (ym.value == '*') {
    	var ymList = [];

        // 月度選択リスト値を取得
    	var dt = teasp.util.date.getToday();
    	dt.setMonth(dt.getMonth());

    	for(var i = 0; i < 7; i++){
    		var dateStr = dt.getFullYear() + ("0" + (dt.getMonth() + 1)).slice(-2);
    		ymList.push(dateStr);
    		dt.setMonth(dt.getMonth() - 1);
    	}

        // 月度指定で月度選択リストにない値が指定された場合は値を追加し一覧を更新する
    	teasp.util.monthlyPulldown.changed(ym, this.targetYM, teasp.Tsf.Dom.hitch(this,function(ymVal){
			if (ymList.indexOf('' + ymVal) < 0) {
				teasp.util.monthlyPulldown.create(ym, ymList, ymVal, true, true);
				this.targetYM = ym.value;
			} else {
				ym.value = '' + ymVal;
				this.targetYM = ym.value;
			}
	        this.clear();
	        this.refresh();
		}));

    } else {
        this.targetYM = ym.value;
        this.clear();
        this.refresh();
    }
};

// #7401 ステータス選択時の処理
teasp.Tsf.ListExpJsNavi.prototype.changePayStatus = function(){
    var status = teasp.Tsf.Dom.node('#payStatus', this.getArea());
    this.payStatus = status.value;
    this.clear();
    this.refresh();
};

teasp.Tsf.ListExpJsNavi.prototype.changeStatus = function(){
    var status = teasp.Tsf.Dom.node('#statusSelect', this.getArea());
    this.targetStatus = status.value;
    this.clear();
    this.refresh();
};

teasp.Tsf.ListExpJsNavi.prototype.getFilt = function(flag){
    var freeFilts = this.freeFilts || [];
    var lst = [];
	var ymSrch = true;

    if(freeFilts.length > 0){
    	dojo.forEach(freeFilts, function(f){
    		var cond = f.filtVal;
    		if(cond && cond.indexOf('Date__c') != -1){
    			ymSrch = false;
    			return;
    		}
    	});
    }

    // 月度
    // 利用日付範囲が指定されていない場合は検索条件に月度を追加する
    if (ymSrch) {
    	lst.push('YearMonth__c = ' + this.targetYM);
    }

    // 表示対象(0:すべて、1:承認済み、2:金額差異あり、3:未承認)
	if(this.targetStatus == "1" || this.targetStatus == "2"){
		lst.push("(ExpApplyId__r.Status__c = '承認済み' or ExpApplyId__r.Status__c = '精算済み' or ExpApplyId__r.Status__c = '確定済み' or ExpApplyId__r.Status__c = '仕訳済み')");

	} else if(this.targetStatus == "3"){
		lst.push("(ExpApplyId__r.Status__c != '承認済み' and ExpApplyId__r.Status__c != '精算済み' and ExpApplyId__r.Status__c != '確定済み' and ExpApplyId__r.Status__c != '仕訳済み')");
	}

	// 請求データの検索ダイアログの検索条件項目
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


teasp.Tsf.ListExpJsNavi.prototype.getListMode = function(){
    return 3;
};

teasp.Tsf.ListExpJsNavi.prototype.dataProcessing = function(){
	console.log("dataProcessing");
    if(!this.records){
        return;
    }
    dojo.forEach(this.records, function(record){
    	console.log(record);
    }, this);
};

teasp.Tsf.ListExpJsNavi.prototype.drawData = function(tb){
    var tbody = (tb || this.getCheckboxBody());
    this.getDomHelper().freeBy(this.reskey);
    teasp.Tsf.Dom.empty(tbody);

    this.firstEmptyRowKey = null;

    // #7526
	// 請求データ検索条件を取得
	var filtStr = this.getFilt();
	var filts = filtStr.split(" and ");
	var params = {};

	for (var i = 0 ; i < filts.length; i++) {
		var val = filts[i].replace(/\s+/g, "");

		// フィルタが取得できない場合は処理しない
		if (!val) {
			continue;
		}

		// 利用日付(From/To)
		if (val.indexOf("Date__c") != -1) {
			var pos1 = val.indexOf(">=");
			var pos2 = val.indexOf("<=");

			if (pos1 != -1) {
				params['dateFrom'] = val.substr(pos1 + 2, 10);

			} else if (pos2 != -1) {
				params['dateTo'] = val.substr(pos2 + 2, 10);
			}
			continue;

		} else {
			params['yearMonth'] = this.targetYM;
		}
	}

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

        // 請求明細へのリンク
        // 0円の請求については明細リンクを表示する
        if(record.totalInvoiceAmount != null){
        	record._DetailLink = teasp.message.getLabel('jt18000120');	// 明細
        }

        // 経費申請番号へのリンク（経費申請番号優先）
        if(record.ExpApplyId__c && record.ExpApplyId__c.length > 0){
        	record._ApplyNo = record.ExpApplyNo__c;

        // #7535 事前申請リンクを別列で表示するのでこの処理は削除
        //} else if(record.ExpPreApplyId__c && record.ExpPreApplyId__c.length > 0){
        //	record._ApplyNo = record.ExpPreApplyNo__c;
        }

        // #7535 事前申請番号へのリンクを追加
        if(record.ExpPreApplyId__c && record.ExpPreApplyId__c.length > 0){
        	record._PreApplyNo = record.ExpPreApplyNo__c;
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

        // #7526
        this.setInvoiceDetailAnchor(tr, record, params);
        this.setExpAnchor(tr, record);
    }
    this.setCheckedIds();

    var totalUse = teasp.Tsf.Dom.byId('totalUseAmount');
    if(totalUse){
    	totalUse.textContent = teasp.Tsf.Currency.formatMoney(this.totalUseAmount, teasp.Tsf.Currency.V_YEN, false, true);
    }
    var totalInvoice = teasp.Tsf.Dom.byId('totalInvoiceAmount');
    if(totalInvoice){
    	totalInvoice.textContent = teasp.Tsf.Currency.formatMoney(this.totalInvoiceAmount, teasp.Tsf.Currency.V_YEN, false, true);
    }
    var diff = teasp.Tsf.Dom.byId('diffAmount');
    if(diff){
    	diff.textContent = teasp.Tsf.Currency.formatMoney(this.totalInvoiceAmount - this.totalUseAmount, teasp.Tsf.Currency.V_YEN, false, true);
    }

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
 * 事前申請・経費申請へのリンクを張る
 * #7535 事前申請Idが存在する場合は事前申請リンクを表示するよう修正
 */
teasp.Tsf.ListExpJsNavi.prototype.setExpAnchor = function(tr, record){
	var el = dojo.query('a', tr);

	if(el && el.length && el.length > 1){
		var expApply = el[1];	// 経費申請番号へのリンクは2番目
		var preApply = el[2]	// 事前申請番号へのリンクは3番目
        var hkey = teasp.Tsf.Fp.getHkey(tr);

		// 経費申請Id、事前申請Idを取得
		var expApplyId = this.fp.getFcByApiKey('ExpApplyId__c').fetchValue(hkey).value;
		var preApplyId = this.fp.getFcByApiKey('ExpPreApplyId__c').fetchValue(hkey).value;

		// 経費申請Idを取得できた場合はリンクを設定
		if (expApplyId && expApply) {
			expApply.href = teasp.getPageUrl('empExpView') + '?expApplyId=' + expApplyId;
			expApply.target = '_blank';
		}

		// 事前申請Idを取得できた場合はリンクを設定
		if (preApplyId && preApply) {
			preApply.href = teasp.getPageUrl('expPreApplyView') + '?id=' + preApplyId;
			preApply.target = '_blank';
		}
    }
};

/**
 * 請求データの明細リストへのリンクを張る
 */
teasp.Tsf.ListExpJsNavi.prototype.setInvoiceDetailAnchor = function(tr, record, params){

	// #7526 請求データ明細画面に渡すパラメータ生成
	// 表示対象
	var urlParam = '?targetStatus=' + this.targetStatus;

	// ステータス
	urlParam += '&payStatus=' + this.payStatus;

	// 月度
	if (params['yearMonth']) {
		urlParam += '&targetYM=' + params['yearMonth'];
	}

	// 利用日付範囲
	if (params['dateFrom']) {
		urlParam += '&dFrom=' + params['dateFrom'];
	}
	if (params['dateTo']) {
		urlParam += '&dTo=' + params['dateTo'];
	}

	var el = dojo.query('a', tr);
	if(el && el.length){
		var a = el[0];

		// #7526
		//var url = teasp.getPageUrl('jtbDetailView') + '?targetYM=' + this.targetYM;
		var url = teasp.getPageUrl('jtbDetailView') + urlParam;

		if(record.EmpId__c){
			url += '&targetEmpId=' + record.EmpId__c;
		}
		if(record.ExpApplyId__c){
			url += '&expApplyId=' + record.ExpApplyId__c;
		}
		if(record.ExpPreApplyId__c){
			url += '&expPreApplyId=' + record.ExpPreApplyId__c;
		}
		url = encodeURI(url);
		var h = (screen.availHeight || 800);
		if(h > 800){
			h = 800;
		}
		var op = 'width=1024,height=' + h + ',resizable=yes,scrollbars=yes';
		this.getDomHelper().connect(a, 'onclick', this, function(){window.open(url, 'detail', op);}, this.reskey);
    }
};

teasp.Tsf.ListExpJsNavi.prototype.search = function(){
    var key = 'searchExpJsNavi';
    this.searchDialog = new teasp.Tsf.SearchCondition(teasp.Tsf.formParams[key]);
    this.searchDialog.show((this.searchObj || {}), teasp.Tsf.Dom.hitch(this, function(obj){
        this.setFreeFilts(obj.filts);
        this.searchObj = obj;
        this.refresh();
    }));
};

teasp.Tsf.ListExpJsNavi.prototype.searchData = function(pno, limit, countUp, piw, callback){
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
    req.targetEmpId = null;
    req.orderBy     = this.fp.createOrderBy();
    req.filt        = this.getFilt();
    req.childFilt   = this.getChildFilt();
    req.childNega   = this.getChildNega();
    req.payManage   = this.fp.getPayManage();
    req.irregularType = this.fp.getIrregularType();
    req.targetStatus = this.targetStatus;
    req.payStatus = this.payStatus;	// #7401
    req.targetYM	= this.targetYM;
    method          = 'getList';

    tsfManager[method](req,
        teasp.Tsf.Dom.hitch(this, function(succeed, result){
            if(succeed){
                this.totalUseAmount = result.totalUseAmount;			// 利用金額合計
                this.totalInvoiceAmount = result.totalInvoiceAmount;	// 請求額合計
                callback(true,  result);
            }else{
                callback(false, result);
            }
        })
    );
};

teasp.Tsf.ListExpJsNavi.prototype.clear = function(){
    this.totalUseAmount = 0;
    this.totalInvoiceAmount = 0;
}