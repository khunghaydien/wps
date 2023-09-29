/**
 * 経費精算の消込 印刷画面
 *
 * @constructor
 */
teasp.Tsf.ListPrintExpPay = function(listType){
	this.listType = listType;
};

teasp.Tsf.ListPrintExpPay.prototype = new teasp.Tsf.ListBase();

/**
 * 初期化
 *
 */
teasp.Tsf.ListPrintExpPay.prototype.init = function(){
	var params = tsfManager.getParams();
	var printTarget = (params.target || '');
	this.filt = ' ' + decodeURIComponent(params.filt);

	var listKey = 'Print' + printTarget + (this.listType || '1');
	var formParam = teasp.Tsf.formParams[listKey];

	if(!formParam){
		throw new Error(teasp.message.getLabel('tf10001670')); // 引数が正しくありません
	}

	this.fp = teasp.Tsf.Fp.createFp(formParam);

	teasp.Tsf.ListBase.prototype.init.call(this);
};

teasp.Tsf.ListPrintExpPay.prototype.refresh = function(){
	if(!this.fp){
		return;
	}

	teasp.Tsf.ListBase.prototype.refresh.call(this);
};

teasp.Tsf.ListPrintExpPay.prototype.getFilt = function(flag){
	return (flag ? " where " : "") + this.filt;
};

teasp.Tsf.ListPrintExpPay.prototype.getArea = function(){
	return teasp.Tsf.Dom.byId('printExpView');
};

/**
 * テーブル作成
 *
 */
teasp.Tsf.ListPrintExpPay.prototype.createBase = function(){
	var buttons = this.getDomHelper().create('div', { className: 'ts-print-buttons', style:'padding:6px 2px;' });
	var print = this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('printOut_btn_title'), className: 'ts-print-out' }, buttons); // プリンタへ出力
	var close = this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('close_btn_title')   , className: 'ts-close'	  }, buttons); // 閉じる

	// プリンタへ出力
	this.getDomHelper().connect(print, 'onclick', this, function(){
		window.print();
		return false;
	});
	// 閉じる
	this.getDomHelper().connect(close, 'onclick', this, function(){
		(window.open('','_top').opener=top).close();
		return false;
	});

	var infoArea = this.getDomHelper().create('div', { className:'ts-list-info', style:'text-align:left;' });
	var countArea = this.getDomHelper().create('div', { className:'ts-list-count', style:'text-align:left;' });
	this.getDomHelper().create('span', { innerHTML:teasp.message.getLabel('tf10010790') }, countArea); // 読み込んでいます。お待ちください。

	// 表本体
	var table = this.getDomHelper().create('table', { className:'ts-list-body ts-list-head', style:'display:none;' });
	// ヘッダ部
	var tr = this.getDomHelper().create('tr', null, this.getDomHelper().create('thead', null, table));
	var hkey = teasp.Tsf.Fp.setHkey(this.getDomHelper(), tr);
	var colCnt = 0;
	this.fp.fcLoop(function(fc){
		if(!fc.isHidden()){
			var th = this.getDomHelper().create('th', { id: fc.getDomId(hkey), style:'width:' + fc.getWidth() + ';white-space:nowrap;' }, tr);
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

	this.getDomHelper().create('tbody', null, table);

	return [buttons, infoArea, countArea, table];
};

teasp.Tsf.ListPrintExpPay.prototype.searchData = function(pno, limit, countUp, piw, callback){
	this.showInfo();
	if(this.listType == 1){
		teasp.Tsf.ListBase.prototype.searchData.call(this, pno, limit, countUp, piw, callback);
	}else{
		var req = {
			limit		: limit,
			offset		: (limit * (pno - 1)),
			countUp 	: countUp,
			piw 		: piw
		};
		req.soql		= this.fp.createSoql(this.getFilt(true), this.getChildFilt());
		req.soqlForCnt	= (countUp ? this.fp.createSoqlForCnt(this.getFilt(true)) : null);
		req.irregularType = this.fp.getIrregularType();
		req.countUp 	= true;
		tsfManager.searchData(req,
			teasp.Tsf.Dom.hitch(this, function(succeed, result){
				if(succeed){
					callback(true,	result);
				}else{
					callback(false, result);
				}
			})
		);
	}
};

teasp.Tsf.ListPrintExpPay.prototype.showInfo = function(){
	var area = teasp.Tsf.Dom.node('.ts-list-info', this.getArea());
    this.getDomHelper().create('span', { innerHTML:teasp.message.getLabel('tf10001430') + ': ' }, area); // 支払種別
    switch(this.listType){
    case '1': this.getDomHelper().create('span', { innerHTML:teasp.message.getLabel('tf10001360') }, area); break; // 本人立替
    case '2': this.getDomHelper().create('span', { innerHTML:teasp.message.getLabel('tf10001370') }, area); break; // 請求書
    case '3': this.getDomHelper().create('span', { innerHTML:teasp.message.getLabel('tf10001380') }, area); break; // 法人カード
    case '4': this.getDomHelper().create('span', { innerHTML:teasp.message.getLabel('tf10001450') }, area); break; // 仮払い
    }
};

teasp.Tsf.ListPrintExpPay.prototype.showRecordCount = function(){
	var area = teasp.Tsf.Dom.node('.ts-list-count', this.getArea());
	teasp.Tsf.Dom.empty(area);
	var msg = '';
	if(this.recordCount > this.fp.getRowLimit()){
		msg = teasp.message.getLabel('tk10000343', this.fp.getRowLimit(), this.fp.getRowLimit()); // 該当件数が {0} 件を超えました。上位 {1} 件のみ表示します。
	}else{
		msg = teasp.message.getLabel('tf10010780', this.recordCount); // 出力件数: {0}
	}
	this.getDomHelper().create('span', { innerHTML:msg }, area);
};

teasp.Tsf.ListPrintExpPay.prototype.showData = function(callback){
	this.showError();
	this.pageNo = 1;
	this.setSortMarker();
	this.searchData(1, this.fp.getRowLimit(), true, this.fp.isPiw(),
		teasp.Tsf.Dom.hitch(this, function(succeed, result){
			if(succeed){
				this.recordCount = result.recordsCount;
				this.records = result.records || [];
				this.dataProcessing();
				this.fetchJournal();
			}else{
				this.showError(result);
			}
		}
	));
};

teasp.Tsf.ListPrintExpPay.prototype.dataProcessing = function(){
	if(!this.records){
		return;
	}
	for(var i = (this.records.length - 1) ; i >= 0 ; i--){
		var record = this.records[i];
		if(this.listType == 1){ // 本人立替
			if(!record.EmpExp__r || !record.EmpExp__r.length){
				this.records.splice(i, 1);
				this.recordCount--;
			}else{
				record.cost = record.AmountDueToPay__c;
				record.paid = (record.StatusC__c == '精算済み');
				if(!record.paid){
					record.payDate__c = null;
					record.payMethod__c = null;
				}
			}
			record._status = teasp.constant.getDisplayStatus(record.StatusD__c);
		}else if(this.listType == 2 || this.listType == 3){ // 請求書 or 法人カード
			record.cost = record.Cost__c;
			record.paid = record.IsPaid__c;
			record._status = (record.IsPaid__c ? teasp.constant.getDisplayStatus('精算済み') : teasp.constant.getDisplayStatus('承認済み'));
		}else{ // 仮払
			record.cost = record.ProvisionalPaymentAmount__c;
			record.paid = (record.StatusC__c == '精算済み');
			record._status = teasp.constant.getDisplayStatus(record.StatusD__c);
		}
	}
};

teasp.Tsf.ListPrintExpPay.prototype.fetchJournal = function(){
	if(this.listType == 1){ // 本人立替
		this.drawData();
		this.showDataEnd();
	}else{
		// 精算仕訳レコードの精算日、精算コメントを取得する
		var ids = [];
		for(var i = 0 ; i < this.records.length ; i++){
			var record = this.records[i];
			if(record.paid){
				ids.push(record.Id);
			}
		}
		if(!ids.length){ // 精算済みのレコードはない
			this.drawData();
			this.showDataEnd();
		}else{
			var soql = "select Id,JournalId__r.Date__c,JournalId__r.Note__c,CreatedDate,EmpExpId__c,EmpExpId__r.ExpApplyId__c,ExpPreApplyId__c"
				+ " from AtkJournalDetail__c"
				+ " where Removed__c = false";
			if(this.listType == 2 || this.listType == 3){ // 請求書 or 法人カード
				soql += " and EmpExpId__c in ('" + ids.join("','") + "')";
			}else{ // 仮払申請
				soql += " and ExpPreApplyId__c in ('" + ids.join("','") + "')";
			}
			var req = {
				soql		 : soql,
				limit		 : 10000,
				offset		 : 0,
				countUp 	 : false,
				piw 		 : false,
				soqlForCnt	 : null,
				irregularType: null
			};
			tsfManager.searchData(req,
				teasp.Tsf.Dom.hitch(this, function(succeed, result){
					if(succeed){
						console.log(result);
						this.mergeJournal(result.records);
						this.drawData();
						this.showDataEnd();
					}else{
						this.showError(result);
					}
				})
			);
		}
	}
};

teasp.Tsf.ListPrintExpPay.prototype.mergeJournal = function(jds){
	dojo.forEach(this.records, function(record){
		if(record.paid){
			for(var i = 0 ; i < jds.length ; i++){
				var jd = jds[i];
				if((this.listType == 4 && record.Id == jd.ExpPreApplyId__c) || record.Id == jd.EmpExpId__c){
					record._payDate = jd.JournalId__r.Date__c;
					record._payNote = jd.JournalId__r.Note__c;
				}
			}
		}
	}, this);
};

teasp.Tsf.ListPrintExpPay.prototype.drawData = function(tb){
	var tbody = (tb || this.getCheckboxBody());
	this.getDomHelper().freeBy(this.reskey);
	teasp.Tsf.Dom.empty(tbody);

	this.showRecordCount(); // 件数を表示

	var rowSize = this.fp.getRowLimit();
	var pEmp = null;
	var totalCost = 0;
	var tr, td;
	for(var i = 0 ; i < this.records.length ; i++){
		var record = this.records[i];
		var emp = this.getEmpInfo(record);
		if(!pEmp || pEmp.empId != emp.empId){
			if(pEmp){
				this.addSmallSum(tbody, pEmp);
			}
			tr = this.getDomHelper().create('tr', null, tbody);
			td = this.getDomHelper().create('td', { colSpan: 7, className: 'ts-print-emp-row' }, tr);
			this.getDomHelper().create('div', { className: 'ts-print-emp-c', innerHTML: teasp.message.getLabel('empCode_label') + ':' }, td); // 社員コード
			this.getDomHelper().create('div', { className: 'ts-print-emp-v', innerHTML: emp.empCode   }, td);
			this.getDomHelper().create('div', { className: 'ts-print-emp-c', innerHTML: teasp.message.getLabel('empName_label') + ':' }, td); // 社員名
			this.getDomHelper().create('div', { className: 'ts-print-emp-v', innerHTML: emp.empName   }, td);
			this.getDomHelper().create('div', { className: 'ts-print-emp-c', innerHTML: teasp.message.getLabel('dept_label') + ':'	}, td); // 部署
			this.getDomHelper().create('div', { className: 'ts-print-emp-v', innerHTML: (emp.deptName ? (emp.deptCode + '-' + emp.deptName) : '') }, td);
			pEmp = emp;
		}
		var cost = record.cost;
		pEmp.cost += cost;
		totalCost += cost;
		tr = this.getDomHelper().create('tr', null, tbody);
		var hkey = teasp.Tsf.Fp.setHkey(this.getDomHelper(), tr);
		// セルと入力欄を作成
		this.fp.fcLoop(function(fc){
			if(fc.isHidden()){
				this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId(hkey) }, tr);
			}else{
				fc.appendFieldCell(this.getDomHelper(), tr, hkey);
			}
		}, this);
		this.fp.fcLoop(function(fc){
			fc.drawText(this.getDomHelper(), record, hkey, tr);
		}, this);
	}
	if(pEmp){
		this.addSmallSum(tbody, pEmp);
	}
	this.addEmptyRow(tbody);
	this.addLargeSum(tbody, totalCost);
	teasp.Tsf.Dom.show('table.ts-list-body', this.getArea(), true);
};

teasp.Tsf.ListPrintExpPay.prototype.addEmptyRow = function(tbody){
	var tr = this.getDomHelper().create('tr', { className: 'ts-print-empty-row' }, tbody);
	this.getDomHelper().create('td', { colSpan: 7 }, tr);
};

teasp.Tsf.ListPrintExpPay.prototype.addSmallSum = function(tbody, emp){
	var tr, td;
	var cost = teasp.Tsf.Currency.formatMoney(emp.cost, teasp.Tsf.Currency.V_YEN, false, true);
	tr = this.getDomHelper().create('tr', null, tbody);
	td = this.getDomHelper().create('td', { className: 'ts-print-emp-sum1' }, tr);
	this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('tm30001050') }, td); // 小計
	td = this.getDomHelper().create('td', { className: 'ts-print-emp-sum2 ts-form-currency' }, tr);
	this.getDomHelper().create('div', { innerHTML: cost   }, td);
	this.getDomHelper().create('td', { colSpan: 5, className: 'ts-print-emp-sum3' }, tr);
};

teasp.Tsf.ListPrintExpPay.prototype.addLargeSum = function(tbody, totalCost){
	var tr, td;
	var cost = teasp.Tsf.Currency.formatMoney(totalCost, teasp.Tsf.Currency.V_YEN, false, true);
	tr = this.getDomHelper().create('tr', null, tbody);
	td = this.getDomHelper().create('td', { className: 'ts-print-emp-sum1' }, tr);
	this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('total_label') }, td); // 合計
	td = this.getDomHelper().create('td', { className: 'ts-print-emp-sum2 ts-form-currency' }, tr);
	this.getDomHelper().create('div', { innerHTML: cost   }, td);
	this.getDomHelper().create('td', { colSpan: 5, className: 'ts-print-emp-sum3' }, tr);
};

teasp.Tsf.ListPrintExpPay.prototype.getEmpInfo = function(obj){
	return {
		empId	 : this.getValueByApiKey('EmpId__c' 					 , obj, ''),
		empCode  : this.getValueByApiKey('EmpId__r.EmpCode__c'			 , obj, ''),
		empName  : this.getValueByApiKey('EmpId__r.Name'				 , obj, ''),
		deptCode : this.getValueByApiKey('EmpId__r.DeptId__r.DeptCode__c', obj, ''),
		deptName : this.getValueByApiKey('EmpId__r.DeptId__r.Name'		 , obj, ''),
		cost	 : 0
	};
};

teasp.Tsf.ListPrintExpPay.prototype.getValueByApiKey = function(apiKey, obj, defaultValue){
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
