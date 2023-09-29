/*
 * #9423 のスクリプト（/AtkExtView?debug=1 画面のプルダウン[*]選択→スクリプトを貼り付け→実行→チェック開始）
 * 下記の条件に該当するデータを抽出してCSVに出力する
 * 　1. フレックスタイム制である
 * 　2. 所定休憩をはさんで時間単位有休を取得している
 * 　3. 2の休暇申請を月の実労働時間が法定労働時間に達した後の日付で行っている
 * 　4. 出社時刻～退社時刻の間に2の申請を行っている。
 *
 * ① フレックスタイム制かつ法定時間外残業＞0 の月度を抽出
 * ② ①の該当社員の時間単位休の休暇申請を抽出
 *     ｛開始時刻～終了時刻の時間｝＞休憩時間（時間単位有休の開始～終了の間に所定休憩がある）の申請に絞り込む
 * ③ ②の申請がある月度に対して画面側計算ロジックを実行して下記を得る
 *      (1) 画面側の法定時間外残業
 *      (2) 法定時間外残業のカウント開始日
 * ④ ③の(2)以降に②の申請がある月度をCSV出力する（該当0なら「該当ありませんでした」と出力）
 *      ③の(1)の差異があれば「差異」列に0以外を出力する（0は不具合の影響はないデータである）
 * 
 * ※ ④で[チェック開始]ボタンの下に「影響リスト」というリンクが表示される（クリックでダウンロード）。
 * ※ CSVファイルのファイル名は "9423_{組織ID}_List.csv"
 */
tsq.QueryObj.prototype.buildForm = function(){
	require(["dojo/string"]);

	this.destroy();
	var qform = dojo.byId('queryForm');

	tsq.today = teasp.util.date.formatDate(new Date()); // 本日日付

	dojo.create('div', { id: 'queryDisplay1', style: { marginTop:"0px" } }, qform);

	var inp = dojo.create('input', { type: 'button', value: 'チェック開始', id: 'querySubmit' }
		, dojo.create('div', { style: 'margin-top:8px;' }, qform));

	dojo.create('a', { innerHTML: '影響リスト', target:'_blank' }, dojo.create('div', { id: 'queryDownload1', style: 'margin-top:8px;display:none;' }, qform));
	dojo.create('div', { id: 'queryResult', style: 'color:red;margin-top:8px;display:none;' }, qform);

	dojo.connect(inp, 'onclick', this, function(){
		this.folder = {result:{}};
		this.empMan = new tsq.EmpManager();
		dojo.byId('queryDisplay1').innerHTML = '';
		dojo.style('queryDownload1', 'display', 'none');
		dojo.style('queryResult', 'display', 'none');
		this.step();
		this.fetchOrg();
	});
};

tsq.QueryObj.prototype.fetchOrg = function(){
	teasp.manager.dialogOpen('BusyWait');
	this.stepNo = 1;
	var soql = "select Id"
		+ ", Name"
		+ " from Organization"
		;
	this.search(soql, true);
};

tsq.QueryObj.prototype.buildData = function(records){
	if(this.stepNo == 1){
		this.folder.organization = records[0];
		this.folder.prefix = this.folder.organization.Id.substring(0, 15);
		var soql = "select Id"
			+ ",Name"
			+ ",EmpCode__c"
			+ ",EmpTypeId__c"
			+ ",EmpTypeId__r.Name"
			+ ",EmpTypeHistory__c"
			+ ",DeptId__c"
			+ ",DeptId__r.Name"
			+ ",DeptId__r.DeptCode__c"
			+ ",EntryDate__c"
			+ ",EndDate__c"
			+ " from AtkEmp__c"
			;
		this.dispout('① 勤怠社員を取得', true);
		this.stepNo = 2;
		this.search(soql, true);
	}else if(this.stepNo == 2){
		this.empMan.addEmps(records);
		var soql = "select Id"
			+ ",Name"
			+ ",EmpId__c"
			+ ",EmpTypeId__c"
			+ ",EmpTypeId__r.Name"
			+ ",EmpTypeId__r.ConfigBaseId__r.InitialDateOfMonth__c"
			+ ",EmpTypeId__r.ConfigBaseId__r.InitialDateOfYear__c"
			+ ",EmpTypeId__r.ConfigBaseId__r.InitialDayOfWeek__c"
			+ ",EmpTypeId__r.ConfigBaseId__r.MarkOfMonth__c"
			+ ",EmpTypeId__r.ConfigBaseId__r.MarkOfYear__c"
			+ ",InitialDate__c"
			+ ",YearMonth__c"
			+ ",SubNo__c"
			+ ",StartDate__c"
			+ ",EndDate__c"
			+ ",EmpApplyId__r.Status__c"
			+ ",WorkLegalOutOverTime__c"
			+ ",ConfigId__r.WorkSystem__c"
			+ " from AtkEmpMonth__c"
			+ " where ConfigId__r.WorkSystem__c = '1'" // フレックスタイム制
			+ " and WorkLegalOutOverTime__c > 0" // 法定時間外残業＞0
			;
		this.dispout('② フレックスタイム制かつ法定時間外残業＞０の勤怠月次を取得');
		this.stepNo = 3;
		this.search(soql, true);
	}else if(this.stepNo == 3){
		this.empMan.addEmpMonths(records);
		var soql = "select Id"
			+ ",Name"
			+ ",EmpId__c"
			+ ",ApplyType__c"
			+ ",HolidayId__c"
			+ ",HolidayId__r.Name"
			+ ",HolidayId__r.Range__c"
			+ ",YearMonth__c"
			+ ",StartDate__c"
			+ ",EndDate__c"
			+ ",StartTime__c"
			+ ",EndTime__c"
			+ ",Status__c"
			+ ",HolidayTime__c"
			+ " from AtkEmpApply__c"
			+ " where EmpId__c in ('" + this.empMan.getTargetEmpIds().join("','") + "')"
			+ " and ApplyType__c = '休暇申請'"
			+ " and HolidayId__r.Range__c = '4'" // 時間単位休
			+ " and Status__c in ('承認待ち','承認済み','確定済み')" // 時間単位休
			;
		this.dispout('③ 時間単位休の休暇申請を取得');
		this.stepNo = 4;
		this.search(soql, true);
	}else if(this.stepNo == 4){
		this.empMan.addEmpApplys(records);
		var months = this.empMan.getTargetMonths();
		this.empMan.checkFailure(months, 0, dojo.hitch(this, this.finish));
	}
};

tsq.QueryObj.prototype.dispout = function(msg, flag){
	if(!this.folder.message || flag){
		this.folder.message = '';
		this.folder.report = '';
	}
	this.folder.message += (flag ? '' : '<br/>') + msg;
	this.folder.report += msg + '\n';
	dojo.byId('queryDisplay1').innerHTML = this.folder.message;
};

tsq.QueryObj.prototype.download = function(nodeId, fname, heads, value){
	var node = dojo.byId(nodeId);
	if((dojo.isChrome || dojo.isFF) && typeof(Blob) !== "undefined"){
		var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
		var blob = new Blob([bom, (heads ? (heads + '\r\n') : '') + value], { "type" : "text/csv" });
		var url = (window.URL || window.webkitURL).createObjectURL(blob);

		var a = dojo.query('a', node)[0];
		dojo.setAttr(a, 'href', url);
		dojo.setAttr(a, 'download', fname);
		dojo.style(node, 'display', '');
	}
};

var mystr = function(v){
	if(!v && typeof(v) != 'number' && typeof(v) != 'boolean'){
		v = '';
	}
	return ('' + v).replace(/"/g, '""').replace(/\r?\n/g, '\n');
};

var mydate = function(d){
	return '' + d.getFullYear()
		+ dojo.string.pad((d.getMonth() + 1), 2, '0')
		+ dojo.string.pad(d.getDate(), 2, '0');
};

tsq.QueryObj.prototype.search = function(soql, nowait){
	var max = 100;
	var counter = 0;
	var beginTm = (new Date()).getTime();
	var pool = [];
	var offset = 0;
	var nextId = null;
	var innerSearch = function(){};
	innerSearch = dojo.hitch(this, function(){
		var _soql;
		if(nextId){
			if(soql.indexOf(' where ') > 0){
				_soql = soql + " and ";
			}else{
				_soql = soql + " where ";
			}
			_soql += "Id > '" + nextId + "' order by Id";
		}else{
			_soql = soql + " order by Id";
		}
		console.log('(' + ++counter + ') limit=' + max + ', time=' + Math.round(((new Date()).getTime() - beginTm) / 1000));
		this.contact(
			{
				funcName: 'getExtResult',
				params	: {
					soql   : _soql,
					limit  : max,
					offset : offset
				}
			},
			function(result){
				var record = (result.records.length > 0 ? result.records[result.records.length - 1] : null);
				pool = pool.concat(result.records);
				if(result.records.length >= max){
					nextId = record.Id;
					setTimeout(innerSearch, 100);
				}else{
					this.buildData(pool);
				}
			},
			true
		);
	});
	innerSearch();
};

tsq.QueryObj.prototype.output1 = function(nodeId, suffix){
	var values = this.empMan.getValues();
	if(values){
		this.download(
			nodeId || 'queryDownload1',
			'9423_' + this.folder.prefix + '_List.csv',
			this.empMan.getHeads(),
			this.empMan.getValues()
		);
	}else{
		this.showResult('該当ありませんでした');
	}
};

tsq.QueryObj.prototype.showResult = function(msg){
	dojo.byId('queryResult').innerHTML = msg;
	dojo.style('queryResult', 'display', '');
};

tsq.QueryObj.prototype.finish = function(flag, errmsg){
	teasp.manager.dialogClose('BusyWait');
	if(flag){
		this.output1('queryDownload1');
	}else{
		this.showResult('エラー：' + errmsg);
	}
};

//====================================================================
tsq.EmpManager = function(){
	this.emps = [];
};
tsq.EmpManager.prototype.addEmps = function(records){
	dojo.forEach(records, function(record){
		this.emps.push(new tsq.Emp(this, record));
	}, this);
};
tsq.EmpManager.prototype.addEmpMonths = function(records){
	dojo.forEach(this.emps, function(emp){
		emp.addMonths(records);
	}, this);
};
tsq.EmpManager.prototype.addEmpApplys = function(records){
	dojo.forEach(this.emps, function(emp){
		emp.addApplys(records);
	}, this);
};
tsq.EmpManager.prototype.getTargetEmpIds = function(){
	var empIds = [];
	dojo.forEach(this.emps, function(emp){
		if(emp.getMonthSize() > 0){
			empIds.push(emp.getId());
		}
	}, this);
	return empIds;
};
tsq.EmpManager.prototype.getTargetMonths = function(){
	var targetMonths = [];
	dojo.forEach(this.emps, function(emp){
		targetMonths = targetMonths.concat(emp.getTargetMonths());
	}, this);
	return targetMonths;
};
tsq.EmpManager.prototype.checkFailure = function(months, index, callback){
	console.log('checkFailure');
	if(index >= months.length){
		callback(true);
		return;
	}
	var month = months[index];
	var pouch = new teasp.data.Pouch();
	teasp.manager.request(
		'loadEmpMonthPrint',
		{ target:"empMonth", noDelay:true, empId:month.getEmpId(), month:month.getYearMonth(), subNo:month.getSubNo(true) },
		pouch,
		{ hideBusy : true },
		this,
		dojo.hitch(this, function(){
			month.setViewerData(pouch.dataObj);
			setTimeout(dojo.hitch(this, function(){
				this.checkFailure(months, index + 1, callback);
			}), 100);
		}),
		function(event){
			callback(false, teasp.message.getErrorMessage(event));
		}
	);
};
tsq.EmpManager.prototype.getHeads = function(){
	return '"' + [
		"社員ID",
		"社員コード",
		"社員名",
		"部署コード",
		"部署名",
		"勤務体系名",
		"月度",
		"ステータス",
		"開始日",
		"終了日",
		"法定時間外残業",
		"差異",
		"休暇日"
/*
		"休暇日",
		"休暇名",
		"開始時刻",
		"終了時刻",
*/
	].join('","') + '"';
};
tsq.EmpManager.prototype.getValues = function(){
	var value = '';
	dojo.forEach(this.emps, function(emp){
		var v = emp.getValue();
		if(v){
			value += (v + '\n');
		}
	}, this);
	return value;
};
//--------------------------------------------------------------------
// 勤怠社員
tsq.Emp = function(manager, o){
	this.manager = manager;
	this.obj = o;
	this.obj.EntryDate__c	= teasp.util.date.formatDate(this.obj.EntryDate__c);
	this.obj.EndDate__c		= teasp.util.date.formatDate(this.obj.EndDate__c);
	this.months = [];
	this.applys = [];
};
tsq.Emp.prototype.getId          = function(){ return this.obj.Id; };
tsq.Emp.prototype.getName        = function(){ return this.obj.Name; };
tsq.Emp.prototype.getEmpCode     = function(){ return this.obj.EmpCode__c; };
tsq.Emp.prototype.getEmpTypeId   = function(){ return this.obj.EmpTypeId__c; };
tsq.Emp.prototype.getEmpTypeName = function(){ return this.obj.EmpTypeId__r.Name; };
tsq.Emp.prototype.getEmpTypeHistory = function(){ return this.obj.EmpTypeHistory__c; };
tsq.Emp.prototype.getDeptCode    = function(){ return (this.obj.DeptId__r && this.obj.DeptId__r.DeptCode__c) || ''; };
tsq.Emp.prototype.getDeptName    = function(){ return (this.obj.DeptId__r && this.obj.DeptId__r.Name) || ''; };
tsq.Emp.prototype.getMonthSize   = function(){ return this.months.length ; }
tsq.Emp.prototype.addMonths = function(records){
	this.months = [];
	for(var i = 0 ; i < records.length ; i++){
		var m = records[i];
		if(m.EmpId__c == this.getId()){
			var month = new tsq.EmpMonth(m);
			if(!month.isFlexTime()){
				continue;
			}
			this.months.push(month);
		}
	}
	this.months = this.months.sort(function(a, b){
		if(a.getYearMonth() == b.getYearMonth()){
			return a.getSubNo() - b.getSubNo();
		}
		return a.getYearMonth() - b.getYearMonth();
	});
};
tsq.Emp.prototype.addApplys = function(records){
	this.applys = [];
	for(var i = 0 ; i < records.length ; i++){
		var m = records[i];
		if(m.EmpId__c == this.getId()){
			this.applys.push(new tsq.EmpApply(m));
		}
	}
	this.applys = this.applys.sort(function(a, b){
		if(a.getStartDate() == b.getStartDate()){
			return a.getStartTime() - b.getStartTime();
		}
		return (a.getStartDate() < b.getStartDate() ? -1 : 1);
	});
	for(var i = 0 ; i < this.applys.length ; i++){
		var apply = this.applys[i];
		if(!apply.isTimeHolidayBetweenBreaks()){
			continue;
		}
		for(var j = 0 ; j < this.months.length ; j++){
			var month = this.months[j];
			if(month.getStartDate() <= apply.getStartDate()
			&& apply.getStartDate() <= month.getEndDate()){
				month.addApply(apply);
			}
		}
	}
};
tsq.Emp.prototype.getTargetMonths = function(records){
	this.targetMonths = [];
	for(var i = 0 ; i < this.months.length ; i++){
		var month = this.months[i];
		if(month.getApplySize() > 0){
			this.targetMonths.push(month);
		}
	}
	return this.targetMonths
};
tsq.Emp.prototype.getOutputMonths = function(){
	var outputMonths = [];
	for(var i = 0 ; i < this.months.length ; i++){
		var month = this.months[i];
		if(month.isOutput()){
			outputMonths.push(month);
		}
	}
	return outputMonths;
};
tsq.Emp.prototype.getValue = function(){
	var lines = [];
	var line1 = [];
	line1.push('"' + mystr(this.getId())          + '"');
	line1.push('"' + mystr(this.getEmpCode())     + '"');
	line1.push('"' + mystr(this.getName())        + '"');
	line1.push('"' + mystr(this.getDeptCode())    + '"');
	line1.push('"' + mystr(this.getDeptName())    + '"');
	line1.push('"' + mystr(this.getEmpTypeName()) + '"');
	var months = this.getOutputMonths();
	for(var i = 0 ; i < months.length ; i++){
		var m = months[i];
		var line2 = dojo.clone(line1);
		line2.push('"' + m.getYearMonthEx()       + '"');
		line2.push('"' + m.getStatus()            + '"');
		line2.push('"' + m.getStartDate()         + '"');
		line2.push('"' + m.getEndDate()           + '"');
		line2.push('"' + m.getWorkLegalOutOverTime(true) + '"');
		line2.push('"' + m.getDiffWorkLegalOutOverTime() + '"');
		line2.push('"' + m.getHolidayDates()      + '"');
		lines.push(line2.join(','));
	}
	return lines.join('\n');
};
//--------------------------------------------------------------------
// 勤怠月次
tsq.EmpMonth = function(o){
	o.StartDate__c     = teasp.util.date.formatDate(o.StartDate__c);
	o.EndDate__c       = teasp.util.date.formatDate(o.EndDate__c);
	this.obj = o;
	this.applys = [];
	this.viewObj = {};
	this.ngDates = [];
};
tsq.EmpMonth.prototype.getId           = function(){ return this.obj.Id; };
tsq.EmpMonth.prototype.getEmpId        = function(){ return this.obj.EmpId__c; };
tsq.EmpMonth.prototype.getEmpTypeId    = function(){ return this.obj.EmpTypeId__c; };
tsq.EmpMonth.prototype.getStartDate    = function(){ return this.obj.StartDate__c; };
tsq.EmpMonth.prototype.getEndDate      = function(){ return this.obj.EndDate__c; };
tsq.EmpMonth.prototype.getYearMonth    = function(){ return this.obj.YearMonth__c; };
tsq.EmpMonth.prototype.getSubNo        = function(flag){ return this.obj.SubNo__c || (flag ? null : 0); };
tsq.EmpMonth.prototype.getStatus       = function(){ return (this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.Status__c) || '未確定'; };
tsq.EmpMonth.prototype.getWorkSystem   = function(){ return this.obj.ConfigId__r.WorkSystem__c; };
tsq.EmpMonth.prototype.isFlexTime      = function(){ return (this.obj.ConfigId__r.WorkSystem__c == '1'); };
tsq.EmpMonth.prototype.isFixed = function(){
	var st = (this.obj.EmpApplyId__r && this.obj.EmpApplyId__r.Status__c) || '';
	return (['確定済み','承認待ち','承認済み'].indexOf(st) >= 0);
};
tsq.EmpMonth.prototype.getYearMonthEx = function(){
	return this.obj.YearMonth__c + (this.obj.SubNo__c ? '(' + (this.obj.SubNo__c + 1) + ')' : '');
};
tsq.EmpMonth.prototype.addApply = function(apply){
	this.applys.push(apply);
};
tsq.EmpMonth.prototype.getApplySize = function(){
	return this.applys.length;
};
tsq.EmpMonth.prototype.getApplys = function(){
	return this.applys;
};
tsq.EmpMonth.prototype.getWorkLegalOutOverTime = function(flag){
	if(flag){
		return teasp.util.time.timeValue(this.obj.WorkLegalOutOverTime__c);
	}else{
		return this.obj.WorkLegalOutOverTime__c;
	}
};
tsq.EmpMonth.prototype.getDiffWorkLegalOutOverTime = function(){
	var n = ((this.viewObj && this.viewObj.workLegalOutOverTime) || 0) - (this.obj.WorkLegalOutOverTime__c || 0);
	return (n ? (n < 0 ? '-' : '') + teasp.util.time.timeValue(Math.abs(n)) : 0);
};
tsq.EmpMonth.prototype.setViewerData = function(dataObj){
	this.viewObj.workLegalOutOverTime = (dataObj && dataObj.month && dataObj.month.disc && dataObj.month.disc.workLegalOutOverTime) || 0;

	var d = this.getStartDate();
	var ed = this.getEndDate();
	var borderDate = null;
	this.ngDates = [];
	while(d <= ed){
		var day = dataObj.days[d];
		if(day && day.disc && (day.disc.workLegalOutOverTime > 0 || borderDate)){
			if(!borderDate){
				borderDate = d;
			}
			if(this.isNgDate(day)){
				this.ngDates.push(d);
			}
		}
		d = teasp.util.date.addDays(d, 1);
	}
};
tsq.EmpMonth.prototype.isNgDate = function(day){
	var st = day.disc.startTime;
	var et = day.disc.endTime;
	if(typeof(st) != 'number' || typeof(et) != 'number'){ // 出退社時刻未入力
		return false;
	}
	var rests = teasp.util.time.margeTimeSpans((day.rack.fixRests || []).concat(day.rack.freeRests || []));
	if(!rests.length){ // 休憩を取ってない
		return false;
	}
	var holidayTimes = (day.rack && day.rack.validApplys && day.rack.validApplys.holidayTime) || [];
	if(!holidayTimes.length){ // 時間単位休を取ってない
		return false;
	}
	for(var i = 0 ; i < holidayTimes.length ; i++){
		var h = holidayTimes[i];
		if(h.startTime <= st || et <= h.endTime){ // 時間単位休の開始or終了が出退社時刻に接している
			continue;
		}
		// 時間単位休の範囲に休憩が含まれているか
		var t = teasp.logic.EmpTime.getSpanTime(teasp.util.time.includeRanges([{from:h.startTime, to:h.endTime}], rests));
		if(t > 0){
			return true;
		}
	}
	return false;
};
tsq.EmpMonth.prototype.getHolidayDates = function(){
	return this.ngDates.join(',');
};
tsq.EmpMonth.prototype.isOutput = function(){
	var dates = this.getHolidayDates();
	return (!dates ? false : true);
};
//--------------------------------------------------------------------
// 勤怠申請
tsq.EmpApply = function(o){
	o.StartDate__c     = teasp.util.date.formatDate(o.StartDate__c);
	o.EndDate__c       = teasp.util.date.formatDate(o.EndDate__c);
	this.obj = o;
};
tsq.EmpApply.prototype.getId           = function(){ return this.obj.Id; };
tsq.EmpApply.prototype.getEmpId        = function(){ return this.obj.EmpId__c; };
tsq.EmpApply.prototype.getEmpTypeId    = function(){ return this.obj.EmpTypeId__c; };
tsq.EmpApply.prototype.getStartDate    = function(){ return this.obj.StartDate__c; };
tsq.EmpApply.prototype.getEndDate      = function(){ return this.obj.EndDate__c; };
tsq.EmpApply.prototype.getHolidayTime  = function(){ return this.obj.HolidayTime__c || 0; };
tsq.EmpApply.prototype.getHolidayName  = function(){ return this.obj.HolidayId__r.Name; };
tsq.EmpApply.prototype.getStartTime = function(flag){
	if(flag){
		return teasp.util.time.timeValue(this.obj.StartTime__c);
	}else{
		return this.obj.StartTime__c;
	}
};
tsq.EmpApply.prototype.getEndTime = function(flag){
	if(flag){
		return teasp.util.time.timeValue(this.obj.EndTime__c);
	}else{
		return this.obj.EndTime__c;
	}
};
tsq.EmpApply.prototype.isFixed = function(){
	var st = (this.obj.Status__c) || '';
	return (['確定済み','承認待ち','承認済み'].indexOf(st) >= 0);
};
tsq.EmpApply.prototype.isTimeHolidayBetweenBreaks = function(){
	var st = this.getStartTime();
	var et = this.getEndTime();
	return (et - st) > this.getHolidayTime();
};
//-----------------------------------------------------
// その他データ出力画面では deimal.js を読み込んでない
// 動的に読み込むこともできないため（原因わからず）、ダミー関数を定義
// decimal.js は休暇計算に使用し勤怠計算では関係ないためこのスクリプト内ではこれで良い
var Decimal = function(n){ this.n = n; };
Decimal.prototype.toNumber				= function(){ return this.n; };
Decimal.prototype.plus					= function(m){ this.n += m; return this; };
Decimal.prototype.minus					= function(m){ this.n -= m; return this; };
Decimal.prototype.times					= function(m){ this.n *= m; return this; };
Decimal.prototype.div					= function(m){ this.n /= m; return this; };
Decimal.prototype.mod					= function(m){ this.n = Math.mod(n / m); return this; };
Decimal.prototype.equals				= function(m){ return (this.n == m); };
Decimal.prototype.floor					= function(){ this.n = Math.floor(this.n); return this; };
Decimal.prototype.ceil					= function(){ this.n = Math.ceil(this.n); return this; };
Decimal.prototype.round					= function(){ this.n = Math.round(this.n); return this; };
Decimal.prototype.abs					= function(){ this.n = Math.abs(this.n); return this; };
Decimal.prototype.isPositive			= function(){ return (this.n >= 0); };
Decimal.prototype.isZero				= function(){ return (this.n == 0); };
Decimal.prototype.toDecimalPlaces		= function(p){ return this; };
Decimal.prototype.lessThan				= function(m){ return (this.n < m); };
Decimal.prototype.lessThanOrEqualTo		= function(m){ return (this.n <= m); };
Decimal.prototype.greaterThan			= function(m){ return (this.n > m); };
Decimal.prototype.greaterThanOrEqualTo	= function(m){ return (this.n >= m); };
