teasp.provide('teasp.dialog.AccessControlLog');
/**
 * 入退館ログ明細ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.AccessControlLog = function(){
	this.widthHint = 410;
	this.heightHint = 225;
	this.id = 'dialogAccessControlLog';
	this.title = teasp.message.getLabel('ac00000300'); // ログ明細
	this.duration = 1;
	this.content = '<table class="acclog-view"><tr><td class="acclog-head"><table><tr><td class="acclog-date"><span></span></td><td class="acclog-event"><span></span></td></tr></table></td></tr><tr><td><table><tr><td><button class="std-button2 acclog-prevd"><div></div></button></td><td><button class="std-button2 acclog-nextd"><div></div></button></td></tr></table></td></tr><tr><td><div class="acclog-logs"></div></td></tr><tr class="acclog-ctrl"><td><div><button class="std-button2"><div></div></button></div></td></tr></table>';
	this.eventHandles = [];
	var logType = {
		'0':teasp.message.getLabel('ac00000330'),     // 方向なし
		'1':teasp.message.getLabel('ac00000250'),     // 入館
		'2':teasp.message.getLabel('ac00000260'),     // 退館
		'9':teasp.message.getLabel('ac00000340')      // バッチ起動
	};
	this.cols = [
		{ label: teasp.message.getLabel('dateTime_head'), apiKey:'LogDate__c'      , width: 150, align:'center', type:'dateTime' }, // 日時
		{ label: teasp.message.getLabel('tk10000262')   , apiKey:'LogType__c'      , width:  80, align:'center', type:'select', pickMap:logType }, // 種別
		{ label: teasp.message.getLabel('ac00000310')   , apiKey:'LogKey__c'       , width: 130, align:'center', type:'string'   }, // ログキー
		{ label: teasp.message.getLabel('ac00000320')   , apiKey:'ProcessedFlag__c', width:  90, align:'center', type:'boolean'  }, // 処理対象
		{ label: teasp.message.getLabel('note_head')    , apiKey:'Note__c'         , width: 180, align:'left'  , type:'string'   }  // 備考
	];
};

teasp.dialog.AccessControlLog.prototype = new teasp.dialog.Base();

teasp.dialog.AccessControlLog.prototype.ready = function(){
//	this.nohack = true;
};

teasp.dialog.AccessControlLog.prototype.preStart = function(){
	var area = dojo.byId(this.dialog.id);

	var b = dojo.query('.acclog-ctrl .std-button2', area)[0];
	dojo.query('div', b)[0].innerHTML = teasp.message.getLabel('close_btn_title' );

	dojo.connect(b, "onclick", this, this.hide);
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.AccessControlLog.prototype.preShow = function(){
	// 前回のイベントハンドルをクリアする
	for(var i = 0 ; i < this.eventHandles.length ; i++){
		dojo.disconnect(this.eventHandles[i]);
		delete this.eventHandles[i];
	}
	this.eventHandles = [];

	// ソートキーは日時昇順
	this.sortKeys = [{ apiKey:'LogDate__c' }];

	this.date = this.args.date;
	this.showDate();

	var area = dojo.byId(this.dialog.id);
	dojo.query('.acclog-prevd > div', area)[0].innerHTML = teasp.message.getLabel('ac00000350'); // <<前日
	dojo.query('.acclog-nextd > div', area)[0].innerHTML = teasp.message.getLabel('ac00000360'); // 翌日>>
	this.eventHandles.push(dojo.connect(dojo.query('.acclog-prevd', area)[0], 'onclick', this, this.moveDate(-1)));
	this.eventHandles.push(dojo.connect(dojo.query('.acclog-nextd', area)[0], 'onclick', this, this.moveDate(1)));

	var logs = dojo.query('.acclog-logs', area)[0];
	dojo.empty(logs);

	var table = dojo.create('table', null, logs);
	var thead = dojo.create('thead', null, table);
	var tr = dojo.create('tr', null, thead);
	for(var i = 0 ; i < this.cols.length ; i++){
		var th = dojo.create('th', {
			data : this.cols[i].apiKey,
			style: 'width:' + (this.cols[i].width + (i == (this.cols.length - 1) ? 17 : 0)) + 'px;'
		}, tr);
		this.eventHandles.push(dojo.connect(th, 'onclick', this, this.clickHead));
		var div = dojo.create('div', null, th);
		dojo.create('div', { innerHTML: this.cols[i].label }, div);
		dojo.create('div', { className: 'pp_base' }, div);
	}

	var div = dojo.create('div', null, logs);
	dojo.create('tbody', null, dojo.create('table', null, div));

	this.drawData([]);

	setTimeout(dojo.hitch(this, function(){
		this.search(this.date);
	}), 100);

	return true;
};

teasp.dialog.AccessControlLog.prototype.showDate = function(){
	var dayWrap = this.pouch.getEmpDay(this.date);
	var area = dojo.byId(this.dialog.id);
	dojo.query('.acclog-date' , area)[0].innerHTML = teasp.util.date.formatDate(this.date, 'JP1');
	dojo.query('.acclog-event', area)[0].innerHTML = dayWrap.getCalendarEvent();
};

/**
 *
 */
teasp.dialog.AccessControlLog.prototype.drawData = function(records){
	var area = dojo.byId(this.dialog.id);
	var logs = dojo.query('.acclog-logs', area)[0];
	var tbody = dojo.query('table tbody', logs)[0];
	dojo.empty(tbody);
	var siz = Math.max(records.length, 10);
	for(var i = 0 ; i < siz ; i++){
		var o = (i < records.length ? records[i] : null);
		tr = dojo.create('tr', { className:((i%2)==0 ? 'ts-row-even' : 'ts-row-odd') }, tbody);
		for(var c = 0 ; c < this.cols.length ; c++){
			var col = this.cols[c];
			var v = (o ? (o[col.apiKey] || '') : '');
			if(o){
				if(col.type == 'dateTime'){
					v = teasp.util.date.formatDateTime(v, 'SLA-HM');
				}else if(col.type == 'boolean'){
					v = (v ? '○' : '');
				}else if(col.type == 'select'){
					v = col.pickMap[v] || '';
				}
			}
			dojo.create('div', {
				innerHTML: v
			}, dojo.create('td', {
				style: 'width:' + col.width + 'px;text-align:' + col.align + ';'
			}, tr));
		}
	}
	var sortKey = (this.sortKeys.length > 0 ? this.sortKeys[0] : null);
	var tr = dojo.query('table thead tr', logs)[0];
	for(var i = 0 ; i < tr.cells.length ; i++){
		var cell = tr.cells[i];
		var a = (sortKey && dojo.attr(cell, 'data') == sortKey.apiKey);
		var b = (sortKey && sortKey.desc) ? 1 : 0;
		dojo.query('div.pp_base', cell).forEach(function(el){
			dojo.toggleClass(el, 'pp_ico_sort_asc' , (a && !b));
			dojo.toggleClass(el, 'pp_ico_sort_desc', (a &&  b));
		});
	}
	this.showDate();
};

/**
 *
 */
teasp.dialog.AccessControlLog.prototype.search = function(dt){
	var soql = "select Id, LogDate__c, LogKey__c, LogType__c, Note__c, ProcessedFlag__c"
		+ " from AtkAccessControlLog__c"
		+ " where EmpId__c = '" + this.pouch.getEmpId() + "'"
		+ " and LogDate__c >= " +  teasp.util.date.convDateTimeZone(dt)
		+ " and LogDate__c < " +  teasp.util.date.convDateTimeZone(teasp.util.date.addDays(dt, 1));
	var sorts = [];
	dojo.forEach(this.sortKeys, function(sortKey){
		sorts.push(sortKey.apiKey + (sortKey.desc ? ' desc nulls last' : ''));
	});
	if(sorts.length){
		soql += ' order by ' + sorts.join(', ');
	}
	console.log(soql);
	teasp.action.contact.remoteMethods(
		[{
			funcName: 'getExtResult',
			params  : {
				soql   : soql,
				limit  : 1000,
				offset : 0
			}
		}],
		{
			errorAreaId : null,
			nowait      : false
		},
		function(result){
			console.log(result);
			this.date = dt;
			this.drawData(result.records);
		},
		null,
		this
	);
};

/**
 *
 */
teasp.dialog.AccessControlLog.prototype.clickHead = function(e){
	var n = e.target;
	n = teasp.util.getAncestorByTagName(n, 'TH');
	var v = dojo.attr(n, 'data');
	var keys = this.sortKeys;
	if(keys.length && keys[0].apiKey == v){
		keys[0].desc = !keys[0].desc;
	}else{
		for(var i = keys.length - 1 ; i >= 0 ; i--){
			if(keys[i].apiKey == v){
				keys.splice(i, 1);
			}
		}
		keys.unshift({ apiKey: v });
		if(keys.length > 3){
			keys.splice(3, keys.length - 3);
		}
	}
	this.search(this.date);
};

/**
 *
 */
teasp.dialog.AccessControlLog.prototype.moveDate = function(amount){
	return function(e){
		var d = teasp.util.date.addDays(this.date, amount);
		this.search(d);
	};
};
