/**
 * 社員選択画面
 *
 * @constructor
 */
teasp.Tsf.ListEmpTable = function(){
	var type = tsfManager.getType();
	var p = (type == 'Time' || type == 'Job') ? teasp.Tsf.formParams.ListEmpTable2 : teasp.Tsf.formParams.ListEmpTable;
	this.fp = teasp.Tsf.Fp.createFp(p);
	if(type == 'Time'){
		this.fp.setChildren({
			EmpR1__r: {
				fields: [
					{ apiKey: 'EmpApplyId__r.Status__c' }, // @see this.dataProcessing
					{ apiKey: 'Id' },
					{ apiKey: 'YearMonth__c' },
					{ apiKey: 'SubNo__c' },
					{ apiKey: 'EmpTypeId__r.Name' }
				]
			}
		});
	}else if(type == 'Job'){
		this.fp.setChildren({
			AtkJobApplyR2__r: {
				fields: [
					{ apiKey: 'Status__c' }, // @see this.dataProcessing
					{ apiKey: 'Id' },
					{ apiKey: 'YearMonth__c' },
					{ apiKey: 'SubNo__c' }
				]
			}
		});
	}
	this.listAreaHeight = 100;
};

teasp.Tsf.ListEmpTable.prototype = new teasp.Tsf.ListBase();

teasp.Tsf.ListEmpTable.prototype.init = function(){
	teasp.Tsf.ListBase.prototype.init.call(this);
	teasp.Tsf.MainEmpTable.resize();
};

/**
 * テーブル作成
 *
 */
teasp.Tsf.ListEmpTable.prototype.createBase = function(){
	var area = this.getDomHelper().create('div', { className: 'ts-emp-table'   });
	var el   = this.getDomHelper().create('div', { className: 'ts-search-list' }, area);
	this.createScrollTable(el);

	teasp.Tsf.Dom.show('div.ts-search-list-box', area, false);

	return area;
};

teasp.Tsf.ListEmpTable.prototype.setSearchContent = function(areaEl){
    var div = this.getDomHelper().create('div', { className: 'ts-tool-top', style: 'position:relative;' }, areaEl);
	// 月度
	this.getDomHelper().create('span', { innerHTML: teasp.message.getLabel('tk10000063') }, this.getDomHelper().create('div', { className:'ts-tool-label' }, div)); // 月度
	var select = this.getDomHelper().create('select', { className: 'ts-month-select' }, this.getDomHelper().create('div', { className:'ts-tool-value' }, div));
	// 月度の選択肢をセット
	var monthLst = tsfManager.getInfo().getMonthList();
	dojo.forEach(monthLst, function(o){
		this.getDomHelper().create('option', { value: o.value, innerHTML: o.label }, select);
	}, this);
	select.value = tsfManager.getInfo().getMonth();
	this.domHelper.connect(select, 'onchange', this, this.changedMonth);

	// 部署名
	this.getDomHelper().create('span', { innerHTML: teasp.message.getLabel('tk10000335')  }, this.getDomHelper().create('div', { className:'ts-tool-label' }, div)); // 部署名
	select = this.getDomHelper().create('select', { style: 'width:300px;', className:'ts-dept-select' }, this.getDomHelper().create('div', { className:'ts-tool-value' }, div));
	this.loadDeptSelect(select);
    this.domHelper.connect(select, 'onchange', this, this.changedDept);

	// 検索ボタン
	var btn = this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('search_btn_title'), className: 'ts-search' }, this.getDomHelper().create('div', null, div)); // 検索
	this.domHelper.connect(btn, 'onclick', this, this.search);

	// 閉じるボタン
	if(!teasp.isSforce1()){ // SF1で「閉じる」ボタンを非表示にする
		btn = this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('close_btn_title'), className: 'ts-close' }, this.getDomHelper().create('div', null, div)); // 閉じる
		this.domHelper.connect(btn, 'onclick', this, function(){
			(window.open('','_top').opener=top).close();
			return false;
		});
	}

    // 下位部署の社員も表示
    var box = this.getDomHelper().create('div', { style: 'position:absolute;left:190px;top:29px;z-index:1;display:none !important;', className: 'ts-dept-recur' }, div);
    var label = this.getDomHelper().create('label', null, box);
    this.getDomHelper().create('input', { type: 'checkbox' }, label);
    this.getDomHelper().create('span', { innerHTML: ' ' + teasp.message.getLabel('tf10008150') }, label); // 下位部署の社員も表示

	this.collectFilts(areaEl);
    this.initUnderDept(areaEl);
};

teasp.Tsf.ListEmpTable.prototype.drawData = function(tb){
	var tbody = (tb || this.getCheckboxBody());
	this.getDomHelper().freeBy(this.reskey);
	teasp.Tsf.Dom.empty(tbody);

	for(var i = 0 ; i < this.records.length ; i++){
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
		var record = this.records[i];
		this.fp.fcLoop(function(fc){
			fc.drawText(this.getDomHelper(), record, hkey, tr);
		}, this);
		this.getDomHelper().connect(teasp.Tsf.Dom.query('a', tr), 'onclick', this, this.clickEmp(i));
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
    if(!this.recordCount){
        var pm = teasp.Tsf.Dom.node('.ts-list-paging .ts-page-message', this.getArea());
        pm.innerHTML = '<br/>';
    }

	teasp.Tsf.Dom.show('div.ts-search-list-box', this.getArea(), true);
	this.tableHeight = (tbody.offsetHeight + 2);

	teasp.Tsf.Dom.show('div.ts-dept-recur', this.getArea(), true);
	var pgw = teasp.Tsf.Dom.node('div.ts-list-paging', this.getArea()).offsetWidth;
	teasp.Tsf.Dom.style(teasp.Tsf.Dom.node('div.ts-section-form', this.getArea()), 'margin-top', (pgw > 180 ? '20px' : '4px'));

	teasp.Tsf.MainEmpTable.resize();
};

teasp.Tsf.ListEmpTable.prototype.clickEmp = function(index){
	return teasp.Tsf.Dom.hitch(this, function(){
		console.log(this.records[index]);
		var emp = this.records[index];
		var url = null;
		var type = tsfManager.getType();
		var mode = this.getOpenMode(emp, (type == 'ExpPre' || type == 'Exp'));
		var modeArg = (mode ? '&mode=' + mode : '');
		if(type == 'ExpPre'){
			url = teasp.getPageUrl('expPreApplyView') + '?empId=' + emp.Id + modeArg;
		}else if(type == 'Exp'){
			url = teasp.getPageUrl('empExpView') + '?empId=' + emp.Id + modeArg;
		}else if(type == 'Time'){
			var o = this.getMonth();
			url = teasp.getPageUrl('workTimeView') + '?empId=' + emp.Id + '&month=' + o.ym + '&subNo=' + (o.sn || '') + modeArg;
		}else if(type == 'Job'){
			var o = this.getMonth();
			url = teasp.getPageUrl('empJobView') + '?empId=' + emp.Id + '&month=' + o.ym + '&subNo=' + (o.sn || '') + modeArg;
		}else{
			return;
		}
		if(teasp.isSforce1()){
			sforce.one.navigateToURL(url, true);
		}else{
			if(!opener){
				window.open('','_top').opener=top;
			}
			if(opener){
				opener.teasp.locationHref(url);
				opener.focus();
			}
		}
	});
};

/**
 * 検索条件をセット
 * @param {Object} e
 */
teasp.Tsf.ListEmpTable.prototype.collectFilts = function(areaEl){
	var lst = [];
	// 部署
	var select  = teasp.Tsf.Dom.node('select.ts-dept-select' , areaEl);
	if(select.value){
        var deptId = select.value;
        if(deptId == '-1'){
            lst.push({ filtVal: "DeptId__c = null" });
        }else{
            // 下位部署の社員も表示
            var chk  = teasp.Tsf.Dom.node('input[type="checkbox"]' , areaEl);
            if(chk.checked){
                var deptIds = tsfManager.getUnderDeptIds(deptId);
                lst.push({ filtVal: "DeptId__c in ('" + deptIds.join("','") + "')" });
            }else{
                lst.push({ filtVal: "DeptId__c = '" + deptId + "'" });
            }
        }
	}
	// 月度
	select = teasp.Tsf.Dom.node('select.ts-month-select', areaEl);
	var o = tsfManager.getInfo().getStartEndByYearMonth(select.value);
	lst.push({ filtVal: "(EntryDate__c = null or EntryDate__c <= " + o.endDate + ") and (EndDate__c = null or EndDate__c >= " + o.startDate + ")" });

	this.setFreeFilts(lst);
};

/**
 * 選択月度を取得
 * @returns {string}
 */
teasp.Tsf.ListEmpTable.prototype.getMonth = function(){
	// 月度
	select = teasp.Tsf.Dom.node('select.ts-month-select', this.getArea());
	var ms = select.value.split('.');
	return {
		ym : ms[0],
		sn : (ms.length > 1 && ms[1]) || null,
		key: select.value
	};
};

/**
 * 子リレーションの検索条件
 * @returns {string}
 */
teasp.Tsf.ListEmpTable.prototype.getChildFilt = function(){
	var o = this.getMonth();
	return ' where YearMonth__c = ' + o.ym + ' and SubNo__c = ' + (o.sn || 'null');
};

/**
 * 部署選択リストの候補をセット
 * @param {Object} select
 */
teasp.Tsf.ListEmpTable.prototype.loadDeptSelect = function(select){
	var depts = tsfManager.getDepts();
	var deptVal = tsfManager.getInfo().getSelectDeptId();
	teasp.Tsf.Dom.empty(select);
	this.getDomHelper().create('option', { value: ''  , innerHTML: teasp.message.getLabel('tk10000344') }, select); // （すべて）
	this.getDomHelper().create('option', { value: '-1', innerHTML: teasp.message.getLabel('tk10000436') }, select); // （部署未設定の社員）
	var f = false;
	for(var i = 0 ; i < depts.length ; i++){
		this.getDomHelper().create('option', { value: (depts[i].getId() || ''), innerHTML: depts[i].getDisplayName() }, select);
		if(depts[i].getId() == deptVal){
			f = true;
		}
	}
	select.value = ((f || deptVal == '-1') ? deptVal : '');
};

/**
 * 月度選択リストの選択変更
 * @param {Object} e
 */
teasp.Tsf.ListEmpTable.prototype.changedMonth = function(e){
	var select = teasp.Tsf.Dom.node('select.ts-dept-select', this.getArea());
	tsfManager.getInfo().setSelectDeptId(select.value);

	teasp.Tsf.Dom.setAttr(select, 'disabled', true);

	var req = tsfManager.getInfo().getStartEndByYearMonth(e.target.value);
	req.method = 'getDeptList';

	tsfManager.getDeptList(req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
		teasp.Tsf.Dom.setAttr(select, 'disabled', false);
		if(succeed){
			tsfManager.getInfo().replaceDeptList(result.depts);
			this.loadDeptSelect(select);
		}
	}));
};

/**
 * 部署選択リストの選択変更
 * @param {Object} e
 */
teasp.Tsf.ListEmpTable.prototype.changedDept = function(e){
    this.initUnderDept(this.getArea());
};

teasp.Tsf.ListEmpTable.prototype.initUnderDept = function(areaEl){
    var select = teasp.Tsf.Dom.node('select.ts-dept-select', areaEl);
    var v = select.value;
    var chk = teasp.Tsf.Dom.node('input[type="checkbox"]', areaEl);
    chk.disabled = (!v || v == '-1');
};

/**
 * 検索
 * @param {Object} e
 */
teasp.Tsf.ListEmpTable.prototype.search = function(e){
	this.collectFilts(this.getArea());
	this.refresh();
};

teasp.Tsf.ListEmpTable.prototype.resizedArea = function(box){
	var div = teasp.Tsf.Dom.node('div.ts-search-list-box', this.getArea());
	if(div){
		// 表エリアの高さをウィンドウサイズに合わせて調整
		var h = teasp.Tsf.Dom.top(div) + 20;
		this.listAreaHeight = (box.h - h);
		var h = Math.min(this.tableHeight, this.listAreaHeight);
		if(h < 0){
			h = 0;
		}
		teasp.Tsf.Dom.style(div, 'height', '' + h + 'px');
		teasp.Tsf.Dom.style(teasp.Tsf.Dom.node('.ts-popup-win > div > table'), 'width', '' + div.offsetWidth + 'px');
	}
};

teasp.Tsf.ListEmpTable.prototype.dataProcessing = function(){
	// 子リレーションキーを取得
	var c = this.fp.getChildren() || {};
	var ckey = null;
	for(var key in c){
		if(c.hasOwnProperty(key)){
			ckey = key;
		}
	}
	var fields = (ckey && c[ckey] && c[ckey].fields) || [];
	var f1 = null, f2 = null;
	dojo.forEach(fields, function(field){
		if(field.apiKey == 'EmpApplyId__r.Status__c' || field.apiKey == 'Status__c'){
			f1 = field;
		}else if(field.apiKey == 'EmpTypeId__r.Name'){ // 工数の場合は該当しない
			f2 = field;
		}
	});
	var fc1 = new teasp.Tsf.Fc(f1 || {}); // ステータスの要素名
	var fc2 = (f2 ? new teasp.Tsf.Fc(f2) : this.fp.getFcByApiKey('EmpTypeId__r.Name')); // 勤務体系の要素名

	var records = this.records || [];
	for(var i = 0 ; i < records.length ; i++){
		var record = records[i];
		var cs = record[ckey] || [];
		var o = (cs.length ? cs[0] : null);
		if(o && o.YearMonth__c){
			var v1 = fc1.parseSimple(o);
			record._status = teasp.constant.getDisplayStatus(v1.value || '未確定');
			var v2 = fc2.parseSimple(o);
			if(!v2.value){
				v2 = fc2.parseSimple(record);
			}
			record._empTypeName = v2.value || '';
		}else{
			record._status = '－';
			var v2 = fc2.parseSimple(record);
			record._empTypeName = v2.value || '';
		}
	}
};

/**
 * URL引数の mode が 'read' 以外の場合、対象社員に対する編集権限を
 * 調べて、編集権限があるなら、mode そのままを返し、編集権限がなければ、
 * 'read' を返す。mode が 'read' ならそのまま 'read' を返す
 *
 * @param {Object} emp
 * @param {boolean} flag trueなら経費の権限を調べる
 * @returns {String|null}
 */
teasp.Tsf.ListEmpTable.prototype.getOpenMode = function(emp, flag){
	var mode = tsfManager.getParamByKey('mode') || '';
	if(mode != 'read'){
		var sessionEmp = tsfManager.getSessionEmp();
		var userId     = tsfManager.getInfo().getSessionUser().getId();
		if(tsfManager.isSysAdmin()
		|| sessionEmp.isAdmin()
		|| sessionEmp.isAllEditor()
		|| (flag && sessionEmp.isExpAdmin())
		|| emp.UserId__c  == userId
		|| emp.Manager__c == userId
		){
			return mode;
		}
		var d0 = emp.DeptId__r || null;
		var d1 = (d0 && d0.ParentId__r) || null;
		var d2 = (d1 && d1.ParentId__r) || null;
		var d3 = (d2 && d2.ParentId__r) || null;
		if((d0 && (d0.ManagerId__c  == userId || d0.Manager1Id__c == userId || d0.Manager2Id__c == userId))
		|| (d1 && (d1.ManagerId__c  == userId || d1.Manager1Id__c == userId || d1.Manager2Id__c == userId))
		|| (d2 && (d2.ManagerId__c  == userId || d2.Manager1Id__c == userId || d2.Manager2Id__c == userId))
		|| (d3 && (d3.ManagerId__c  == userId || d3.Manager1Id__c == userId || d3.Manager2Id__c == userId))
		){
			return mode;
		}
	}
	return 'read';
};

teasp.Tsf.ListEmpTable.prototype.getOrgTarget = function(){
	return tsfManager.getType();
};
