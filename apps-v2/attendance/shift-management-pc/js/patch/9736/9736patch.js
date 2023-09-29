if(/AtkWorkTimePrintView/.test(location.pathname) && !/origin¥=1/.test(location.search)){
// スーパーストリーム様向け
teasp.controlClass = teamspirit.RtkPotalCtl;
teasp.prefixBar = 'teamspirit__';
var MONTH_FIELDS = [
 'EarlyWorkTime__c' 			  // 早朝時間
,'HolidayRealWorkTime__c'		  // 休日時間
,'HolidayWorkCount__c'			  // 休日出勤
,'NightWorkTime__c' 			  // 深夜時間
,'OutWorkTimeCompensationDays__c' // 時間外代休
,'Over60HourTime__c'			  // ６０Ｈ超時間外時間数
,'OverWorkTime__c'				  // 普通時間外
,'ShortWorkUnemployed__c'		  // 短時間不就業
,'TrobleLateStartTime__c'		  // 電故遅延時間
,'TroubleLateStartCount__c' 	  // 電故遅延回数
,'WorkOver45Time_N__c'			  // ４５時間超残業 (回数)
,'WorkOverTime36_SS__c' 		  // 36協定対象残業(SS)
,'ss130__c' 					  // 電故遅延時間控除
,'EarlyCount__c'				  // 早退回数
,'EarlyLostTime__c' 			  // 控除早退時間
,'EarlyTime__c' 				  // 早退時間
,'LateCount__c' 				  // 遅刻回数
,'LateLostTime__c'				  // 控除遅刻時間
,'LateTime__c'					  // 遅刻時間
,'PrivateInnerCount__c' 		  // 不就業回数
,'PrivateInnerLostTime__c'		  // 控除私用外出時間
,'PrivateInnerTime__c'			  // 勤務時間内私用外出時間
,'WorkFixedDay__c'				  // 所定就業日数
,'WorkFixedTime__c' 			  // 所定労働時間
,'WorkFixedTimeH__c'			  // 所定労働時間(H)
,'WorkHolidayCount__c'			  // 休日出勤日数
,'WorkLegalHolidayCount__c' 	  // 法定休日出勤日数
,'WorkNightTime__c' 			  // 深夜労働時間
,'WorkOver40perWeek__c' 		  // 週４０時間超労働時間
,'WorkPublicHolidayCount__c'	  // 祝日出勤日数
,'WorkRealDay__c'				  // 実出勤日数
,'WorkRealTime__c'				  // 実労働時間
,'WorkWholeTime__c' 			  // 総労働時間
,'WorkWholeTimeH__c'			  // 総労働時間(H)
,'WeekDayDayLegalOutTimeH__c'	  // 平日日中法外
,'WeekDayDayLegalExtTimeH__c'	  // 平日日中法内
,'WeekDayNightLegalOutTimeH__c'   // 平日深夜法外
,'WeekDayNightLegalExtTimeH__c'   // 平日深夜法内
,'DaiqHolidayCount__c'			  // 振替休日
];
/**
 * 月次サマリー表示
 * 元の teasp.view.MonthlySummary.prototype.show を上書き
 */
teasp.view.MonthlySummary.prototype.show = function(){
	dojo.style('areaBody', 'padding-bottom', '4px');

	if(!dojo.isIE || dojo.isIE > 8){
		// 印刷時の areaBody の幅を 950px 固定にする（印刷枚数を少なくするため）
		dojo.create('style', { type: 'text/css', media: 'print', innerHTML: '#areaBody{width:950px !important;}' }, document.body);
	}

	var monthId = this.pouch.dataObj.month.id;
	if(!monthId){
		this.month = {};
		this.showNext();
	}else{
		// 該当月の AtkEmpMonth__c を取得
		teasp.action.contact.remoteMethods(
			[{ funcName: 'getExtResult', params: { soql: "select " + MONTH_FIELDS.join(',') + " from AtkEmpMonth__c where Id = '" + monthId + "'", limit: 1, offset: 0 } }],
			{ errorAreaId: null, nowait: true },
			function(result){
				teasp.util.excludeNameSpace(result);
				this.month = (result.records && result.records.length > 0 ? result.records[0] : null);
				this.showNext();
			},
			null,
			this
		);
	}
};
/*
 * 年度内の各月の超過時間（WorkOverTime36_SS__c）を集める
 */
teasp.view.MonthlySummary.prototype.showNext = function(){
	// 年度の開始月を得る
	var sym = getStartMonthOfPeriod(
				this.pouch.dataObj.targetEmp.configBase.initialDateOfYear,
				this.pouch.dataObj.targetEmp.configBase.markOfYear,
				12,
				this.pouch.dataObj.month.yearMonth);
	var empId = this.pouch.dataObj.targetEmp.id;
	if(sym < this.pouch.dataObj.month.yearMonth){
		teasp.action.contact.remoteMethods(
			[{	funcName : 'getExtResult',
				params	 : {
					soql: "select Id, YearMonth__c, WorkOverTime36_SS__c from AtkEmpMonth__c where EmpId__c = '"
						+ empId
						+ "' and YearMonth__c >= "
						+ sym
						+ " and YearMonth__c <= "
						+ this.pouch.dataObj.month.yearMonth,
					limit : 12,
					offset: 0
				}
			}],
			{ errorAreaId: null, nowait: true },
			function(result){
				teasp.util.excludeNameSpace(result);
				this.months = result.records;
				this.rendering();
			},
			null,
			this
		);
	}else{
		this.months = [this.month];
		this.rendering();
	}
};
// 出力開始（元の teasp.view.MonthlySummary.prototype.show の内容を実行）
teasp.view.MonthlySummary.prototype.rendering = function(){
	this.monSum = this.pouch.getMonthSummary();

	// 入館管理情報の表示/非表示
	var msac = this.pouch.isMsAccessInfo(); // 月次サマリに入退館情報を表示する
	var table = dojo.byId('workTable');
	dojo.query('td.prtv_head_entr,td.prtv_head_exit,td.prtv_head_dive,td.prtv_entr,td.prtv_exit,td.prtv_dive', table).forEach(function(el){
		dojo.style(el, 'display', (msac ? '' : 'none'));
	});
	dojo.attr(dojo.query('td.prtv_foot_goke', table)[0], 'colSpan', (msac ? 9 : 6));

	this.showMain();
};
/*
 * 期間の開始月を得る
 * @param {string|number} initialDateOfYear 起算月
 * @param {string|number} markOfYear 年度の表記
 * @param {number} range 期間
 * @param {number} ym 月度(yyyyMM)
 */
var getStartMonthOfPeriod = function(initialDateOfYear, markOfYear, range, ym){
	var sm	= (typeof(initialDateOfYear)  == 'string' ? parseInt(initialDateOfYear, 10) : initialDateOfYear);
	var y = Math.floor(ym / 100);
	var m = (ym % 100);
	if(m < sm){
		y--;
	}
	var eym = ((y + 1) * 100 + sm);
	var ym1 = y * 100 + sm;
	var ym2 = ym1;
	m = sm;
	while(ym1 < eym){
		m += range;
		if(m > 12){
			y++;
			m = (m % 12);
			if(!m){
				m = 12;
			}
		}
		ym2 = y * 100 + m;
		if(ym1 <= ym && ym < ym2){
			break;
		}
		ym1 = ym2;
	}
	return ym1;
};
// DOM-Utility
var getNextSibling = function(el){
	if(el.nextElementSibling){
		return el.nextElementSibling;
	}
	do {
		el = el.nextSibling;
	} while (el && el.nodeType !== 1);
	return el;
};
// DOM-Utility
var getAncestorByTagName = function(el, tagName){
	var pel = null;
	var p = el;
	while(p != null && p.tagName != 'BODY'){
		if(p.tagName == tagName){
			pel = p;
			break;
		}
		p = p.parentNode;
	}
	return pel;
};
/*
 * fieldオブジェクトから名称を作って返す
 * @param {Object} field
 * @return {string}
 */
var getName = function(field){
	if(field.name){
		return field.name;
	}
	var name = (field.msgId ? teasp.message.getLabel(field.msgId) : '');
	if(field.subId){
		name += '<span style="font-size:85%;">' + teasp.message.getLabel(field.subId) + '</span>';
	}
	return name;
};
/*
 * fieldオブジェクトから値を作って返す
 * @param {Object} field
 * @return {string}
 */
var getValue = function(field){
	var v = '&nbsp;';
	var n = field.value || 0;
	if(field.dispValue){
		return field.dispValue;
	}else if(field.method){
		n = field.method.call(this.month);
	}else if(field.mk){
		n = this.month[field.mk];
		if(n === undefined){
			n = getLogicValue.call(this, field);
		}
	}else if(field.mp){
		 for(var x = 0 ; x < field.mp.length ; x++){
			 var k = field.mp[x];
			 n += (this.month[k] || 0);
		 }
	}else if(field.mm){ // n回 HH:mm<br/>(HH:mm)
		var m = field.mm;
		var t = (field.type || 0);
		return '<span>' 			+ teasp.message.getLabel('tm10001670', this.month[m[0]] || 0)
			+ '</span> <span>'		+ this.pouch.getDisplayTime((this.month[m[1]] || 0) * ((t & 2) != 0 ? 60 : 1))
			+ '</span><br/><span>(' + this.pouch.getDisplayTime((this.month[m[2]] || 0) * ((t & 1) != 0 ? 60 : 1))
			+ ')</span>';
	}
	if(field.type == 't'){
		v = this.pouch.getDisplayTime(n);
	}else if(field.type == 'h'){
		v = this.pouch.getDisplayTime(n * 60);
	}else if(field.type == 'd'){
		v = teasp.message.getLabel('tm10001010', n); // 日
	}else if(field.type == 'r'){
		v = teasp.message.getLabel('tm10001670', n); // 回
	}else{
		v = n;
	}
	return v;
};
/*
 * 項目の値がない場合（勤怠月度レコードが存在しない）、
 * 画面側ロジックで生成した値を返す
 * @param {Object} field
 * @return {number}
 */
var getLogicValue = function(field){
	var n = 0;
	if(field.mk){
		var key = null;
		switch(field.mk){
		case 'WorkFixedDay__c': // 所定出勤日数
			key = 'workFixedDay';
			break;
		case 'WorkFixedTime__c': // 所定労働時間
			key = 'workFixedTime';
			break;
		}
		if(key){
			n = this.pouch.getMonthSubValueByKey(key);
		}
	}
	return n;
};
/*
 * 休暇の内訳を返す
 * @param {Object} map
 * @return {string}
 */
var getHolidayItems = function(map){
	var l = [];
	for(var key in map){
		if(map.hasOwnProperty(key)){
			map[key].name = key;
			l.push(map[key]);
		}
	}
	l = l.sort(function(a, b){
		return a.order - b.order;
	});
	var buf = '<table class="holy_item_table" style="border-collapse:collapse;border-spacing:0px;margin:0px;font-size:90%;">';
	var paidCnt = 0;
	for(var i = 0 ; i < l.length ; i++){
		var o = l[i];
		buf += ('<tr style="border-top:none;"><td class="holy_item_col1">'
				+ (paidCnt++ === 0 ? teasp.message.getLabel('tm10009160') : '') // [内訳]
				+ '</td><td class="holy_item_col2">'
				+ o.name
				+ '</td><td class="holy_item_col3" style="padding-right:4px;">'
				+ teasp.message.getLabel('tm10001010', o.cnt) // 日
				+ '</td></tr>');
	}
	if(paidCnt === 0){
		buf += '<tr style="border-top:none;"><td class="holy_item_col1">' + teasp.message.getLabel('tm10009160') // [内訳]
			+ '</td><td class="holy_item_col2">' + teasp.message.getLabel('tm10009170') // −−−−
			+ '</td><td class="holy_item_col3">' + teasp.message.getLabel('tm10009180') // −−−
			+ '</td><td class="holy_item_col4"></td></tr>';
	}
	buf += '</table>';
	return buf;
};
/*
 * 当四半期の超過時間, 当年度の超過時間・回数を返す
 * @return {Object}
 */
var getOverTime36 = function(){
	var months = (this.months || []);
	// 月度順に並べる
	var ps = months.sort(function(a, b){
		return a.YearMonth__c - b.YearMonth__c;
	});
	// 当四半期の開始月を得る
	var sym = getStartMonthOfPeriod(
				this.pouch.dataObj.targetEmp.configBase.initialDateOfYear,
				this.pouch.dataObj.targetEmp.configBase.markOfYear,
				3,
				this.pouch.dataObj.month.yearMonth);
	// 当四半期の超過時間, 当年度の超過時間・回数を集計
	var yearTime = 0;
	var yearCnt  = 0;
	var qatrTime = 0;
	for(var i = 0 ; i < ps.length ; i++){
		var p = ps[i];
		var n = (p.WorkOverTime36_SS__c || 0);
		yearTime += n;
		if(n > (45 * 60)){ // 超過時間が 45H を超えた回数を数える
			yearCnt++;
		}
		if(sym <= p.YearMonth__c){
			qatrTime += (p.WorkOverTime36_SS__c || 0);
		}
	}
	return {
		yearTime : yearTime,
		yearCnt  : yearCnt,
		qatrTime : qatrTime
	};
};
/*
 * サマリー出力領域のDOMを返す
 * @return {Object}
 */
teasp.view.MonthlySummary.prototype.getSummaryArea = function(){
	var tr = getAncestorByTagName(dojo.byId('yearMonth2'), 'TR');
	tr = getNextSibling(tr);
	return tr.firstChild;
};
/*
 * サマリーのDOMを生成
 */
teasp.view.MonthlySummary.prototype.showSummaryDsp = function(){
	// エリアをクリアする
	var area = this.getSummaryArea();
	dojo.empty(area);
	// 大テーブルを作成
	var table = dojo.create('table', { className: 'colla_table', style: 'width:100%;' });
	var tbody = dojo.create('tbody', null, table);
	var tr	= dojo.create('tr', { style: 'vertical-align:top;' }, tbody);

	// 3セル作成
	var tds = [];
	tds.push(dojo.create('td', { style: 'width:33%;padding:0px 8px 0px 0px;' }, tr));
	tds.push(dojo.create('td', { style: 'width:33%;padding:0px 8px 0px 0px;' }, tr));
	tds.push(dojo.create('td', { style: 'width:34%;padding:0px 2px 0px 0px;' }, tr));

	// 各セルにテーブル作成
	var tbodys = [];
	tbodys.push(dojo.create('tbody', null, dojo.create('table', { className: 'total_table' }, tds[0])));
	tbodys.push(dojo.create('tbody', null, dojo.create('table', { className: 'total_table' }, tds[1])));
	tbodys.push(dojo.create('tbody', null, dojo.create('table', { className: 'total_table' }, tds[2])));

	// 当四半期の超過時間, 当年度の超過時間・回数
	var ot = getOverTime36.call(this);
	// 休暇内訳
	var hd = this.monSum.o.holidaySummary;
	// 有休残日数を出すための月度の最終日
	var emLastDate = this.pouch.getEmpMonthLastDate();

	// "{0}時間内の私用外出<br/>回数・時間（控除対象）" の文字列作成
	var privateInnerName = teasp.message.getLabel('tm10009340',
		this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX
			? teasp.message.getLabel('core_label')	 // コア
			: teasp.message.getLabel('work_label')); // 勤務

	//----------------------------------------------------------
	// 出力項目の情報
	// z:出力する列, msgId:項目名のメッセージID, name:項目名, type:出力形式(d,t,r,h), mk/mp/mm/value/dispValue/html/method:出力値
	var fields = [
		{ z:0, msgId: 'fixDays_label'			  , type: 'd', mk: 'WorkFixedDay__c'														  }, // 所定出勤日数
		{ z:0, msgId: 'realDays_label'			  , type: 'd', mk: 'WorkRealDay__c' 														  }, // 実出勤日数
		{ z:0, msgId: 'legalHolidayWorkDays_label', type: 'd', mk: 'WorkLegalHolidayCount__c'												  }, // 法定休日出勤日数
		{ z:0, msgId: 'holidayWorkDays_label'	  , type: 'd', mp: ['WorkHolidayCount__c', 'WorkPublicHolidayCount__c'] 					  }, // 所定休日出勤日数
		{ z:0, blank: true }, //-------------------
		{ z:0, msgId: 'fixTimeOfDay_label'		  , type: 't', mk: 'WorkFixedTime__c'														  }, // 所定労働時間
		{ z:0, msgId: 'wholeTime_label'   , subId:'tm10009240', type: 't', mk: 'WorkWholeTime__c'											  }, // 総労働時間
		{ z:0, msgId: 'workRealTime_label', subId:'tm10009250', type: 't', mk: 'WorkRealTime__c'											  }, // 実労働時間
		{ z:0, blank: true }, //-------------------
		{ z:0, msgId: 'overTimeOfMonth_label'	  , type: 't', mk: 'WorkOverTime36_SS__c'													  }, // 当月度の超過時間
		{ z:0, msgId: 'tk10001173'				  , type: 't', value: ot.qatrTime															  }, // 当四半期の超過時間
		{ z:0, msgId: 'overTimeOfYear_label'	  , type: 't', value: ot.yearTime															  }, // 当年度の超過時間
		{ z:0, msgId: 'overCountOfYear_label'	  , type: 'r', value: ot.yearCnt															  }, // 当年度の超過回数
		{ z:0, msgId: 'overTimeSafety_label'	  , type: 't', mk: 'WorkOver40perWeek__c'													  }, // 安全配慮上の超過時間
		//-----------------------------------------
		{ z:1, name: '普通時間外'				  , type: 'h',																					 // 普通時間外
			method: function(){
				return (this.WeekDayDayLegalOutTimeH__c   || 0)
					 + (this.WeekDayDayLegalExtTimeH__c   || 0)
					 + (this.WeekDayNightLegalOutTimeH__c || 0)
					 + (this.WeekDayNightLegalExtTimeH__c || 0);
			}
		},
		{ z:1, name: '休日時間' 				  , type: 'h', mk: 'HolidayRealWorkTime__c' 												  }, // 休日時間
		{ z:1, name: '早朝時間' 				  , type: 'h', mk: 'EarlyWorkTime__c'														  }, // 早朝時間
		{ z:1, blank: true }, //-------------------
		{ z:1, msgId: 'nightWorkTime_label' 	  , type: 't', mk: 'WorkNightTime__c'														  }, // 深夜労働時間
		{ z:1, name: '45時間を超える時間外労働'   , type: 't',																					 // 45時間を超える時間外労働
			method: function(){
				return Math.max((this.WorkOverTime36_SS__c - (45*60)), 0);
			}
		},
		{ z:1, name: '60時間を超える時間外労働'   , type: 't',																					 // 60時間を超える時間外労働
			method: function(){
				return Math.max((this.WorkOverTime36_SS__c - (60*60)), 0);
			}
		},
		{ z:1, blank: true }, //-------------------
		{ z:1, msgId: 'tm10009320'						   , type: 0	, mm: ['LateCount__c' , 'LateTime__c' , 'LateLostTime__c' ] 					 }, // 遅刻回数・時間<br/>（控除対象）
		{ z:1, name: '電車遅延回数・時間<br/>（控除対象）' , type: 1	, mm: ['TroubleLateStartCount__c','TrobleLateStartTime__c', 'ss130__c'] 		 }, // 電車遅延回数・時間<br/>（控除対象）
		{ z:1, msgId: 'tm10009330'						   , type: 0	, mm: ['EarlyCount__c', 'EarlyTime__c', 'EarlyLostTime__c'] 					 }, // 早退回数・時間<br/>（控除対象）
		{ z:1, name: '短時間不就業時間', empType:'時短勤務', type: 'h'	, mk: 'ShortWorkUnemployed__c'													 }, // 短時間不就業時間
		{ z:1, name: privateInnerName					   , type: 0	, mm: ['PrivateInnerCount__c', 'PrivateInnerTime__c', 'PrivateInnerLostTime__c'] }, // {0}時間内の私用外出<br/>回数・時間（控除対象）
		//-----------------------------------------
		{ z:2, msgId: 'tm10009350'			, bb:1, type: 'd', value: hd.sums[teasp.constant.HOLIDAY_TYPE_PAID] 							  }, // 有休取得日数
		{ z:2												 , html: getHolidayItems(hd.items[teasp.constant.HOLIDAY_TYPE_PAID])			  }, // 有休取得明細
		{ z:2, msgId: 'tm10009360'			, bt:1, type: 'd', dispValue: this.pouch.getMonthSubTimeByKey('paidRestTime')					  }, // 時間単位有休取得時間
		{ z:2, blank: true }, //-------------------
		{ z:2, msgId: 'tm10009370'			, bb:1, type: 'd', value: hd.sums[teasp.constant.HOLIDAY_TYPE_DAIQ] 							  }, // 代休取得日数
		{ z:2												 , html: getHolidayItems(hd.items[teasp.constant.HOLIDAY_TYPE_DAIQ])			  }, // 代休取得明細
		{ z:2, name: '時間外代休取得日数'	, bt:1, type: 'd', mk: 'SUMH_031__c'										   }, // 時間外代休取得日数
		{ z:2, blank: true }, //-------------------
		{ z:2, msgId: 'tm10009380'			, bb:1, type: 'd', value: hd.sums[teasp.constant.HOLIDAY_TYPE_FREE] 							  }, // 無給休暇日数
		{ z:2												 , html: getHolidayItems(hd.items[teasp.constant.HOLIDAY_TYPE_FREE])			  }, // 無給休暇明細
		{ z:2, blank: true }, //-------------------
		{ z:2, msgId: 'tm10009390'				  , type: 'd', dispValue: this.pouch.getDspYuqRemain(emLastDate, true).display				  }  // 有休残日数
	];
	//----------------------------------------------------------
	// 1項目ずつDOMを生成
	for(var i = 0 ; i < fields.length ; i++){
		var field = fields[i];
		if(field.empType && this.pouch.getEmpTypeName().indexOf(field.empType) < 0){
			continue;
		}
		if(field.blank){
			// 新たなテーブルを作成
			tbodys[field.z] = dojo.create('tbody', null, dojo.create('table', { className: 'total_table', style: 'margin-top:5px;' }, tds[field.z]));
			continue;
		}
		tr = dojo.create('tr', null, tbodys[field.z]);
		if(field.bb){ dojo.style(tr, 'border-bottom', '1px solid #000'); }
		if(field.bt){ dojo.style(tr, 'border-top'	, '1px solid #000'); }
		if(field.html){
			var td = dojo.create('td', { colSpan: 2, style: 'padding:0px;' }, tr);
			td.innerHTML = field.html;
			continue;
		}
		dojo.create('div', { innerHTML: getName(field)			   }, dojo.create('td', { className: 'column' }, tr));
		dojo.create('div', { innerHTML: getValue.call(this, field) }, dojo.create('td', { className: 'value'  }, tr));
	}
	// 行の色をセット
	var cnt = 0;
	dojo.query('tr', table).forEach(function(el){
		dojo.toggleClass(el, 'even', (cnt%2)!=0);
		dojo.toggleClass(el, 'odd' , (cnt%2)==0);
		cnt++;
	});
	// エリアに大テーブルを貼り付け
	area.appendChild(table);
};
/**
 * 日次テーブルのボディ部
 */
teasp.view.MonthlySummary.prototype.showDayBody = function(){
	var tbody = dojo.byId('workTableBody');
	var dayList = this.pouch.getMonthDateList();
	this.dayFoot = {
		workOverTime	: 0,
		workHolidayTime : 0,
	};
	for(var i = 0 ; i < dayList.length ; i++){
		var dayWrap = this.pouch.getEmpDay(dayList[i]);
		var d = teasp.util.date.parseDate(dayList[i]);

		var row = tbody.rows[i + 1];
		row.className = ((i%2) == 0 ? 'prtv_row_even' : 'prtv_row_odd');
		// 日付
		var cell = row.cells[0];
		if(i == 0 || d.getDate() == 1){
			cell.innerHTML = (d.getMonth() + 1) + '/' + d.getDate();
		}else{
			cell.innerHTML = d.getDate();
		}
		// 曜日
		row.cells[1].innerHTML = teasp.util.date.formatDate(d, 'JPW');
		// 日タイプ
		cell = row.cells[2];

		if(dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY || dayWrap.getDayType() == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
			cell.innerHTML = teasp.message.getLabel('tm10009100'); // ○
		}else if(dayWrap.getDayType() == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){
			cell.innerHTML = teasp.message.getLabel('tm10009110'); // ◎
		}else if(dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL && dayWrap.isPlannedHoliday()){
			cell.innerHTML = teasp.message.getLabel('tm10009120'); // △
		}
		dojo.create('div', { innerHTML: dayWrap.getDayEvent(), style: { fontSize:"0.9em", margin:"0px", padding:"0px" } }, row.cells[3]);
//		  row.cells[3].innerHTML  = dayWrap.getDayEvent();
		if(this.pouch.isAlive(dayList[i])){
			if(this.pouch.isIndicateNoPushTime() && dayWrap.getStartTimeJudge() < 0){
				row.cells[5].style.textDecoration = 'underline';
			}
			if(this.pouch.isIndicateNoPushTime() && dayWrap.getEndTimeJudge() < 0){
				row.cells[6].style.textDecoration = 'underline';
			}
			var calcMode = this.pouch.getCalcMode();
			row.cells[4].innerHTML	= dayWrap.getEnterTime();						// 入館
			row.cells[5].innerHTML	= dayWrap.getStartTime(false, null, calcMode);	// 出社時刻
			row.cells[6].innerHTML	= dayWrap.getEndTime(false, null, calcMode);	// 退社時刻
			row.cells[7].innerHTML	= dayWrap.getExitTime();						// 退館
			row.cells[8].innerHTML	= dayWrap.getDivergenceJudge().summ || '';	   // 乖離状況
			row.cells[9].innerHTML	= dayWrap.getRestTime(false, '', '', calcMode); // 休憩時間
			row.cells[10].innerHTML = dayWrap.getDaySubTimeByKey((this.pouch.isMsDailyWorkTimeIsReal() ? 'workRealTime' : 'workWholeTime'), false, '', '', calcMode); // 労働時間
			if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER){ // 労働時間制が管理監督者
				row.cells[11].innerHTML  = ''; // 残業時間
				row.cells[12].innerHTML  = ''; // 休日労働時間
			}else if(dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY || dayWrap.getDayType() == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
				row.cells[11].innerHTML  = ''; // 残業時間
				row.cells[12].innerHTML  = dayWrap.getDaySubTimeByKey('workWholeTime', false, '', ''); // 休日労働時間
				this.dayFoot.workOverTime	 += 0;
				this.dayFoot.workHolidayTime += dayWrap.getDaySubTimeByKey('workWholeTime', true, 0, 0);
			}else{
				row.cells[11].innerHTML  = dayWrap.getDaySubTimeByKey('workOverTime'   , false, '', ''); // 残業時間
				row.cells[12].innerHTML  = dayWrap.getDaySubTimeByKey('workHolidayTime', false, '', ''); // 休日労働時間
				this.dayFoot.workOverTime	 += dayWrap.getDaySubTimeByKey('workOverTime'	, true, 0, 0);
				this.dayFoot.workHolidayTime += dayWrap.getDaySubTimeByKey('workHolidayTime', true, 0, 0);
			}
			row.cells[13].innerHTML = dayWrap.getDaySubTimeByKey('workNightTime'  , false, '', '', teasp.constant.C_REAL); // 深夜労働時間
		}
		// 備考
		if(this.pouch.isIndicateNoPushTime() && (s = dayWrap.getTimeCaution()).length > 0){
			s = '<span style="color:#3333CC;font-size:0.95em;">(' + s + ')</span> '
				+ teasp.util.entitize(dayWrap.getDayNote(!this.pouch.isSeparateDailyNote()), '');	// 元の打刻時間＋備考
		}else{
			s = teasp.util.entitize(dayWrap.getDayNote(!this.pouch.isSeparateDailyNote()), '');
		}
		row.cells[14].innerHTML = s;
		row.cells[14].style.borderRight = 'none';
	}
	while(i < tbody.rows.length - 2){
		tbody.rows[i + 1].style.display = 'none';
		i++;
	}
};

/**
 * 日次テーブルのフッタ部
 */
teasp.view.MonthlySummary.prototype.showDayFoot = function(){
	if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX){
		this.styleDisplay('monthlyWeekWholeTimeRow' , true);
		this.styleDisplay('amountTime'				, true);
		this.styleDisplay('monthlyLegalMax' 		, true);
		this.styleDisplay('monthlyWeekRealTimeRow'	, true);
		this.styleDisplay('monthlyRealTimeRow'		, false);
	}else{
		this.styleDisplay('monthlyWeekWholeTimeRow' , false);
		this.styleDisplay('amountTime'				, false);
		this.styleDisplay('monthlyLegalMax' 		, false);
		this.styleDisplay('monthlyWeekRealTimeRow'	, false);
		this.styleDisplay('monthlyRealTimeRow'		, true);
	}

	var row = document.getElementById('workTableFootRow');
	var calcMode = this.pouch.getCalcMode(true);
	row.cells[1].innerHTML = this.pouch.getMonthSubTimeByKey('restTime', false, null, calcMode);		 // 休憩時間合計
	row.cells[2].innerHTML = this.pouch.getMonthSubTimeByKey(this.pouch.isMsDailyWorkTimeIsReal() ? 'workRealTime' : 'workWholeTime', false, null, calcMode);	 // 労働時間合計
	if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER){ // 労働時間制が管理監督者
		row.cells[3].innerHTML = '';	 // 残業時間合計
		row.cells[4].innerHTML = '';  // 休日労働時間合計
	}else{
		row.cells[3].innerHTML = this.pouch.getDisplayTime(this.dayFoot.workOverTime   , false);  // 残業時間合計
		row.cells[4].innerHTML = this.pouch.getDisplayTime(this.dayFoot.workHolidayTime, false);  // 休日労働時間合計
	}
	row.cells[5].innerHTML = this.pouch.getMonthSubTimeByKey('workNightTime', false, null, teasp.constant.C_REAL);	// 深夜労働時間合計

	dojo.query('.total_table').forEach(function(elem){
		var cnt = 0;
		for(var i = 0 ; i < elem.rows.length ; i++){
			var row = elem.rows[i];
			if(row.style.display != 'none'){
				dojo.toggleClass(row, 'even', (cnt%2)===0);
				dojo.toggleClass(row, 'odd' , (cnt%2)!==0);
				cnt++;
			}
		}
	});
};
// 以下はV5.220用に追加
teasp.view.MonthlySummary.prototype.init = function(messageMap, onSuccess, onFailure){

	teasp.message.mergeLabels(globalMessages || {});
	teasp.message.mergeLabels(messageMap ? (messageMap[teasp.message.getLanguageLocaleKey()] || {}) : {});

	this.readParams({ target: 'empMonth' });

	dojo.byId('areaBody').innerHTML = '<table class="colla_table" style="width:100%;"><tr class="buttons"><td style="padding-bottom:4px;"><table class="colla_table" style="margin-bottom:4px;"><tr><td style="width:110px;"><button class="std-button1" id="monthlyPrint" ><div></div></button></td><td style="width:80px;display:none;" id="monsumApprove"><button class="std-button3" id="monthlyApprove" ><div></div></button></td><td style="width:80px;"><button class="std-button2" id="monthlyClose" ><div></div></button></td><td></td></tr></table></td></tr><tr><td style="padding-bottom:4px;"><table id="headTable" class="colla_table" style="width:100%;"><tr><td style="width:140px;border-top:1px solid #222222;border-left:1px solid #222222;border-bottom:1px solid #222222;"><table class="colla_table" style="width:100%;"><tr><td style="white-space:nowrap;text-align:left;"><div style="margin:0px 4px 0px 8px;" id="monsumTitle"></div></td><td style="white-space:nowrap;text-align:left;"><div style="margin:0px 4px;" id="yearMonth"></div></td></tr><tr><td style="white-space:nowrap;text-align:left;vertical-align:middle;font-size:0.9em;"><div style="margin:0px 4px 0px 8px;" id="monsumStatus"></div></td><td style="white-space:nowrap;text-align:left;vertical-align:middle;font-size:0.9em;"><div style="margin:0px 4px;" id="monthlyStatus"></div></td></tr></table></td><td style="width:auto;border:1px solid #222222;"><table class="colla_table" style="width:100%;"><tr><td style="width:30%;white-space:nowrap;text-align:center;border-bottom:1px solid #222222;border-right:1px solid #222222;font-size:0.9em;"><div style="margin:0px;" id="monsumDept"></div></td><td style="width:25%;white-space:nowrap;text-align:center;border-bottom:1px solid #222222;border-right:1px solid #222222;font-size:0.9em;"><div style="margin:0px;" id="monsumEmpType"></div></td><td style="width:20%;white-space:nowrap;text-align:center;border-bottom:1px solid #222222;border-right:1px solid #222222;font-size:0.9em;"><div style="margin:0px;" id="monsumEmpCode"></div></td><td style="width:25%;white-space:nowrap;text-align:center;border-bottom:1px solid #222222;font-size:0.9em;"><div style="margin:0px;" id="monsumName"></div></td></tr><tr><td style="text-align:left;vertical-align:middle;border-right:1px solid #222222;"><div style="margin:0px 7px;word-break:break-all;" id="department">&nbsp;</div></td><td style="text-align:left;vertical-align:middle;border-right:1px solid #222222;"><div style="margin:0px 7px;word-break:break-all;" id="empTypeName">&nbsp;</div></td><td style="text-align:left;vertical-align:middle;border-right:1px solid #222222;"><div style="margin:0px 7px;word-break:break-all;" id="empCode">&nbsp;</div></td><td style="text-align:left;vertical-align:middle;"><div style="margin:0px 7px;word-break:break-all;" id="empName">&nbsp;</div></td></tr></table></td></tr></table></td></tr><tr><td style="padding-bottom:4px;"><table class="prtv_table" style="width:100%;" id="workTable"><tbody class="prtv_body" id="workTableBody"></tbody></table></td></tr><tr><td style="text-align:left;"><div id="monsumMean"></div><hr size="1" color="#888888" style="border-style:dashed;" /></td></tr><tr><td style="text-align:left;"><a name="summary"></a><span id="yearMonth2"></span><span id="monsumSummary"></span></td></tr><tr><td style="padding:0px;"><table class="colla_table" cellspacing="1" style="width:100%;"><tr style="vertical-align:top;"><td  style="width:33%;padding-right:8px;padding- left:0px;"><table     class="total_table"><tbody><tr class="even"><td class="column"><div id="monsumSum01"></div></td><td class="value"><div id="monthlyWorkFixedDay"></div></td></tr><tr class="odd" ><td class="column"><div id="monsumSum02"></div></td><td class="value"><div id="monthlyWorkRealDay"></div></td></tr><tr class="even"><td class="column"><div id="monsumSum03"></div></td><td class="value"><div id="monthlyWorkHolidayCount"></div></td></tr><tr class="odd" ><td class="column"><div id="monsumSum04"></div></td><td class="value"><div id="monthlyWorkNoLegalHolidayCount"></div></td></tr></tbody></table><div  style="height:4px;"></div><table  class="total_table"><tbody><tr class="even"><td class="column"><div    id="monsumSum05"></div></td><td    class="value"><div   id="monthlyWorkFixedTime"></div></td></tr><tr class="odd" id="monthlyWorkWholeTimeRow"><td class="column"><div id="monsumSum06"></div></td><td class="value"><div id="monthlyWorkWholeTime"></div></td></tr><tr class="even" id="monthlyWeekWholeTimeRow"><td class="column"><div id="monsumSum07"></div></td><td class="value"><div id="monthlyWorkWeekWholeTime"></div></td></tr><tr class="odd"  id="monthlyRealTimeRow"><td class="column"><div id="monsumSum08"></div></td><td class="value"><div id="monthlyWorkRealTime"></div></td></tr><tr id="realRealTimeRow" style="display:none;"><td class="column"><div id="monsumSum09"></div></td><td class="value"><div id="realWorkRealTime"></div></td></tr><tr class="even" id="amountTime"><td class="column"><div id="monsumSum10"></div></td><td class="value"><div id="monthlyAmountTime"></div></td></tr></tbody></table><div style="height:4px;"></div><table class="total_table" id="periodTable"><tbody><tr class="even"><td class="column" id="periodLegal"><div id="monsumSum11"></div></td><td class="value"><div id="periodWorkLegalMax"></div></td></tr><tr class="odd" ><td class="column" id="periodLegalWork"><div id="monsumSum12"></div></td><td class="value"><div id="periodWorkLegalTime"></div></td></tr><tr class="even"><td class="column" id="periodOver"><div id="monsumSum13"></div></td><td class="value"><div id="overTimeInPeriod"></div></td></tr><tr style="height:0px;"><td colspan="2"></td></tr></tbody></table><div style="height:4px;"></div><table class="total_table" id="over36Table"><tbody><tr class="even"><td class="column"><div id="monsumSum14"></div></td><td class="value"><div id="workOverTime36"></div></td></tr><tr class="odd"><td class="column"><div id="monsumSum35"></div></td><td class="value"><div id="quartWorkOverTime36"></div></td></tr><tr class="even" ><td class="column"><div id="monsumSum15"></div></td><td class="value"><div id="totalWorkOverTime36"></div></td></tr><tr class="odd"><td class="column"><div id="monsumSum16"></div></td><td class="value"><div id="totalWorkOverCount36"></div></td></tr><tr class="even" ><td class="column"><div id="monsumSum17"></div></td><td class="value"><div  id="workOver40perWeek"></div></td></tr><tr style="height:0px;"><td colspan="2"></td></tr></tbody></table></td><td style="width:33%;padding-right:8px;padding-left:0px;"><table class="total_table"><tbody><tr style="height:0px;"><td colspan="2"></td></tr><tr class="even" id="monthlyLegalMax"><td class="column"><div id="monsumSum18"></div></td><td class="value"><div id="monthlyWorkLegalMax"></div></td></tr><tr class="odd"  id="monthlyWeekRealTimeRow"><td class="column"><div id="monsumSum19"></div></td><td class="value"><div id="monthlyWorkWeekRealTime"></div></td></tr><tr class="even"><td class="column"><div id="monsumSum20"></div></td><td class="value"><div id="monthlyWorkLegalOverTime"></div></td></tr><tr class="odd" ><td class="column"><div id="monsumSum21"></div></td><td class="value"><div id="monthlyWorkLegalOutOverTime"></div></td></tr><tr class="even"><td class="column"><div id="monsumSum22"></div></td><td class="value"><div id="monthlyWorkLegalHolidayTime"></div></td></tr></tbody></table><div style="height:4px;"></div><table class="total_table"><tbody><tr class="even"><td class="column"><div   id="monsumSum23"></div></td><td    class="value"><div      id="monthlyWorkNightTime"></div></td></tr><tr    class="odd" ><td class="column"><div id="monsumSum24"></div></td><td  class="value"><div id="monthlyCharge25Time"></div></td></tr><tr   class="even"><td   class="column"><div id="monsumSum34"></div></td><td   class="value"><div id="monthlyWorkOver45Time"></div></td></tr><tr  class="odd"><td   class="column"><div id="monsumSum25"></div></td><td   class="value"><div id="monthlyWorkOver60Time"></div></td></tr></tbody></table><div style="height:4px;"></div><table class="total_table"><tbody><tr class="detail_lost even"><td  class="column"><div id="monsumSum26"></div></td><td class="value"><div><span id="monthlyLateCount"></span><span id="monsumSum26u"></span><span id="monthlyLateTime"></span><br/><span id="monthlyLateLostTime"></span></div></td></tr><tr class="detail_lost odd"><td class="column"><div id="monsumSum27"></div></td><td class="value"><div><span  id="monthlyEarlyCount"></span><span id="monsumSum27u"></span><span  id="monthlyEarlyTime"></span><br/><span     id="monthlyEarlyLostTime"></span></div></td></tr><tr class="detail_lost even"><td class="column"><div id="monsumSum28"></div></td><td class="value"><div><span id="monthlyPrivateInnerCount"></span><span id="monsumSum28u"></span><span id="monthlyPrivateInnerTime"></span><br/><span id="monthlyPrivateInnerLostTime"></span></div></td></tr></tbody></table></td><td style="width:34%;padding-left:0px;padding-right:2px;"><table class="total_table"><tbody><tr class="even"><td class="column"><div id="monsumSum29"></div></td><td class="value"><div id="monthlyPaidHolidayCount"></div></td></tr><tr class="odd"  id="paidSubInfoRow"><td colspan="2"  id="monthlyPaidItems" class="detail_area"></td></tr><tr class="even"><td class="column"><div id="monsumSum30"></div></td><td class="value"><div id="monthlyPaidRestTime"></div></td></tr></tbody></table><div style="height:4px;"></div><table class="total_table"><tbody><tr class="even"><td class="column"><div id="monsumSum31"></div></td><td class="value"><div id="monthlyCompensatoryHolidayCount"></div></td></tr><tr class="odd" id="daiqSubInfoRow"><td colspan="2"  id="monthlyDaiqItems" class="detail_area"></td></tr></tbody></table><div style="height:4px;"></div><table class="total_table"><tbody><tr class="even"><td class="column"><div id="monsumSum32"></div></td><td  class="value"><div id="monthlyAbsentCount"></div></td></tr><tr class="odd" id="absentSubInfoRow"><td colspan="2"  id="monthlyNonqItems" class="detail_area"></td></tr></tbody></table><div style="height:4px;"></div><table class="total_table"><tbody><tr class="even"><td class="column"><div id="monsumSum33"></div></td><td class="value"><div id="monthlyYuqRemain"></div></td></tr><tr class="odd"><td class="column"><div id="monthlyPlannedRemainTitle"></div></td><td class="value"><div id="monthlyPlannedRemain"></div></td></tr></tbody></table></td></tr></table></td></tr><tr><td><div style="width:780px;"></div></td></tr></table>';

	if(this.viewParams['narrow'] || teasp.isMobile()){
		dojo.query('tr.buttons').forEach(function(el){
			dojo.style(el, 'display', 'none');
		});
	}
	if(teasp.isAndroid()){
		dojo.style('areaBody', 'padding-right' ,  '70px');
		dojo.style('areaBody', 'padding-bottom', '100px');
	}

	var tbody = dojo.byId('workTableBody');
	dojo.empty(tbody);
	var row = dojo.create('tr', { id: 'workTableHeadRow' }, tbody);
	dojo.create('td', { id: 'monsumHead1' , className: 'prtv_head prtv_head_date', colSpan: 3 }, row);
	dojo.create('td', { id: 'monsumHead2' , className: 'prtv_head prtv_head_info' }, row);
	dojo.create('td', { id: 'monsumHead11', className: 'prtv_head prtv_head_entr', style:'display:none;' }, row); // 入館
	dojo.create('td', { id: 'monsumHead3' , className: 'prtv_head prtv_head_begt' }, row);
	dojo.create('td', { id: 'monsumHead4' , className: 'prtv_head prtv_head_endt' }, row);
	dojo.create('td', { id: 'monsumHead12', className: 'prtv_head prtv_head_exit', style:'display:none;' }, row); // 退館
	dojo.create('td', { id: 'monsumHead13', className: 'prtv_head prtv_head_dive', style:'display:none;' }, row); // 乖離状況
	dojo.create('td', { id: 'monsumHead5' , className: 'prtv_head prtv_head_rest' }, row);
	dojo.create('td', { id: 'monsumHead6' , className: 'prtv_head prtv_head_work' }, row);
	dojo.create('td', { id: 'monsumHead7' , className: 'prtv_head prtv_head_over' }, row);
	dojo.create('td', { id: 'monsumHead8' , className: 'prtv_head prtv_head_holy' }, row);
	dojo.create('td', { id: 'monsumHead9' , className: 'prtv_head prtv_head_nigh' }, row);
	dojo.create('td', { id: 'monsumHead10', className: 'prtv_head prtv_head_note' }, row);
	for(var i = 0 ; i < 31 ; i++){
		var row = dojo.create('tr', { className: ((i%2) == 0 ? 'prtv_row_even' : 'prtv_row_odd') }, tbody);
		dojo.create('td', { className: 'prtv prtv_date' }, row);
		dojo.create('td', { className: 'prtv prtv_week' }, row);
		dojo.create('td', { className: 'prtv prtv_sign' }, row);
		dojo.create('td', { className: 'prtv prtv_info' }, row);
		dojo.create('td', { className: 'prtv prtv_entr', style:'display:none;' }, row); // 入館
		dojo.create('td', { className: 'prtv prtv_begt' }, row);
		dojo.create('td', { className: 'prtv prtv_endt' }, row);
		dojo.create('td', { className: 'prtv prtv_exit', style:'display:none;' }, row); // 退館
		dojo.create('td', { className: 'prtv prtv_dive', style:'display:none;' }, row); // 乖離状況
		dojo.create('td', { className: 'prtv prtv_rest' }, row);
		dojo.create('td', { className: 'prtv prtv_work' }, row);
		dojo.create('td', { className: 'prtv prtv_over' }, row);
		dojo.create('td', { className: 'prtv prtv_holy' }, row);
		dojo.create('td', { className: 'prtv prtv_nigh' }, row);
		dojo.create('td', { className: 'prtv prtv_note' }, row);
	}
	var row = dojo.create('tr', { id: 'workTableFootRow', style: { height:"26px" } }, tbody);
	dojo.create('td', { className: 'prtv_foot prtv_foot_goke', colSpan: 6, innerHTML: teasp.message.getLabel('total_label') }, row); // 合計
	dojo.create('td', { className: 'prtv_foot prtv_foot_rest' }, row);
	dojo.create('td', { className: 'prtv_foot prtv_foot_work' }, row);
	dojo.create('td', { className: 'prtv_foot prtv_foot_over' }, row);
	dojo.create('td', { className: 'prtv_foot prtv_foot_holy' }, row);
	dojo.create('td', { className: 'prtv_foot prtv_foot_nigh' }, row);
	dojo.create('td', { className: 'prtv_foot prtv_foot_note' }, row);

	// サーバへリクエスト送信
	teasp.manager.request(
		'loadEmpMonthPrint',
		this.viewParams,
		this.pouch,
		{ hideBusy : true },
		this,
		function(){
			this.pouch.checkEmpMonthHook(dojo.hitch(this, function(succeed, event){
				if(succeed){
					this.show();
					onSuccess();
				}else{
					onFailure(event);
				}
			}));
		},
		function(event){
			onFailure(event);
		}
	);
};
teasp.view.MonthlySummary.prototype.showMain = function(){
	this.showControl();
	this.showLabel();
	this.showHead();
	this.showDayBody();
	this.showDayFoot();
	this.showSummaryDsp();
};
}