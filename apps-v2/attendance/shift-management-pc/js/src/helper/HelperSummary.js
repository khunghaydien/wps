teasp.provide('teasp.helper.Summary');
/**
 * 集計エリア出力用クラス
 *
 * @constructor
 */
teasp.helper.Summary = function(pouch){
	this.pouch = pouch;
	this.monSum = this.pouch.getMonthSummary();
	this.categoryL = this.monSum.o.categoryL; // 大分類（労働時間制）例:fix
	this.categoryS = this.monSum.o.categoryS; // 小分類（労働時間制＋オプション）例:fixd
};

/**
 * 集計エリアカスタマイズ情報
 * Config の summaryBottom 下の分類記号にマッチするオブジェクトを返す
 * @params {string} key 'summaryBottom' or 'timeViewBottom'
 * @params {string} categoryL 大分類（例: fix）
 * @params {string} categoryS 小分類（例: fixd）
 * @return {Object}
 */
teasp.helper.Summary.prototype.getSummaryContentsByCategory = function(key, categoryL, categoryS){
	var ss = this.pouch.getSummarySettings();
	if(!ss){
		return null;
	}
	var bottom = ss[key] || null;
	if(!bottom){
		return null;
	}
	// bottom 下にある "local" または "L_" で始まる要素を集める
	var locals = [];
	for(var k in bottom){
		if(this.isLocalCondition(ss, k)){
			locals.push(k);
		}
	}
	var lorder = (ss.orderLocalCondition || '').split(',');
	var m = {};
	for(var i = 0 ; i < lorder.length ; i++){
		var v = lorder[i];
		if(v){
			m[v] = i;
		}
	}
	// 始まる要素キーをソートする
	locals = locals.sort(function(a, b){
		if(m[a] !== undefined && m[b] === undefined){
			return -1;
		}else if(m[a] === undefined && m[b] !== undefined){
			return 1;
		}else if(m[a] !== undefined && m[b] !== undefined){
			return m[a] - m[b];
		}
		return (a < b ? -1 : 1);
	});
	// LOCAL条件にマッチする場合、このオブジェクトを返す
	for(var i = 0 ; i < locals.length ; i++){
		var lkey = locals[i];
		if(this.matchLocalCondition(ss[lkey])){
			return bottom[lkey];
		}
	}
	// 小分類記号→大分類記号にマッチするオブジェクト、もしくは default のオブジェクトを返す
	return bottom[categoryS] || bottom[categoryL] || bottom['default'];
};

/**
 * ユーザ定義の表示条件か判定する
 * @params {Object} ss summarySettings オブジェクト
 * @params {string} key
 * @return {boolean}
 */
teasp.helper.Summary.prototype.isLocalCondition = function(ss, key){
	return (ss && key && (/^local.+$/.test(key) || /^L_.+$/.test(key)) && ss.hasOwnProperty(key));
};

/**
 * ユーザ定義の表示条件にマッチするか判定する
 * @params {string} key
 * @return {boolean}
 */
teasp.helper.Summary.prototype.matchLocalConditionByKey = function(key){
	var ss = this.pouch.getSummarySettings();
	if(this.isLocalCondition(ss, key)){
		return this.matchLocalCondition(ss[key]);
	}
	return false;
};

/**
 * ユーザ定義の表示条件にマッチするか判定する
 * @params {{
 *   target {string} "EmpType" or "Dept"
 *   name   {string} 名前
 *   matchType {number} 0:完全一致、1:前方一致、2:後方一致、3:中間一致
 * }} c
 * @return {boolean}
 */
teasp.helper.Summary.prototype.matchLocalCondition = function(c){
	if(!c){
		return false;
	}
	if(c.workSystem && this.isMatchStrict(c.workSystem)){
		return true;
	}
	var emp = this.pouch.getTargetEmpObj();
	var v = null;
	if(c.target == 'EmpType'){ // 当月の勤務体系名
		v = emp.empTypeName || '';
	}else if(c.target == 'Dept'){ // 当月の部署名
		v = emp.deptName || '';
	}
	if(v === null){
		return false;
	}
	if(c.names && c.names.length > 0){
		var ret = false;
		for(var i = 0 ; (i < c.names.length && !ret) ; i++){
			var name = c.names[i];
			if(!c.matchType){ // 完全一致
				ret = (v == c.name);
			}else{
				var x = v.indexOf(name);
				if(x < 0){
					ret = false;
				}else if(c.matchType == 1){ // 前方一致
					ret = (x == 0);
				}else if(c.matchType == 2){ // 後方一致
					ret = (x == (v.length - name.length));
				}else{ // 中間一致
					ret = true;
				}
			}
		}
		return ret;
	}
	if(!c.matchType){ // 完全一致
		return (v == c.name);
	}else{
		var x = v.indexOf(c.name);
		if(x < 0){
			return false;
		}else if(c.matchType == 1){ // 前方一致
			return (x == 0);
		}else if(c.matchType == 2){ // 後方一致
			return (x == (v.length - c.name.length));
		}else{ // 中間一致
			return true;
		}
	}
	return false;
};

/**
 * サマリー集計エリア表示内容を取得
 */
teasp.helper.Summary.prototype.getSummaryBottomContents = function(){
	var defaults = this.getDefaultSummaryBottomContents(this.monSum.o);
	var contents = this.getSummaryContentsByCategory('summaryBottom', this.categoryL, this.categoryS);
	if(!contents || contents.useOriginal){
		contents = defaults;
	}else{
		contents = this.mergeFields(defaults, contents);
	}
	contents = this.buildFields(this.setDefaultSummaryValues(contents));
	contents.numberOfColumns = contents.numberOfColumns || 0;
	return contents;
};

teasp.helper.Summary.prototype.getTimeViewBottomContents = function(){
	var defaults = this.getDefaultTimeViewBottomContents(this.monSum.o);
	var contents = this.getSummaryContentsByCategory('timeViewBottom', this.categoryL, this.categoryS);
	if(!contents || contents.useOriginal){
		contents = defaults;
	}else{
		contents = this.mergeFields(defaults, contents);
	}
	contents = this.buildFields(this.setDefaultSummaryValues(contents));
	contents.numberOfColumns = contents.numberOfColumns || 0;
	return contents;
};

/**
 * サマリー集計エリア組み込み情報初期化
 */
teasp.helper.Summary.prototype.getDefaultSummaryBottomContents = function(sum){
	return {
		numberOfColumns: 3,
		column1:[
			{	// 所定出勤日数
				key: "fixdays",
				label: sum.fixdays.col
			},
			{	// 実出勤日数
				key: "realdays",
				label: sum.realdays.col
			},
			{	// 法定休日出勤日数
				key: "workLegalHolidays",
				label: sum.workLegalHolidays.col
			},
			{	// 所定休日出勤日数
				key: "workHolidays",
				label: sum.workHolidays.col
			},
			{
				separator: true
			},
			{	// 所定労働時間
				key: "workFixedTime",
				label: sum.workFixedTime.col
			},
			{	// 総労働時間
				key: "workWholeTime",
				filter: "fix,flex,flexp,var",
				label: sum.workWholeTime.col + '<span style="font-size:85%;">' + teasp.message.getLabel('tm10009240') + '</span>'
			},
			{	// 総労働時間－法定休日労働
				key: "workWholeOmitHolidayTime",
				filter: "flex,flexp",
				label: sum.workWholeOmitHolidayTime.col + '<br/><span style="font-size:85%;">' + teasp.message.getLabel('tm10009240') + '</span>'
			},
			{	// 実労働時間－法定休日労働（有休を含めない）
				key: "workRealOmitHolidayTime",
				filter: "flexp",
				label: sum.workRealOmitHolidayTime.col + '<br/><span style="font-size:85%;">' + teasp.message.getLabel('tm10009250') + '</span>'
			},
			{	// 実労働時間
				key: "workRealTime",
				filter: "fix,var",
				label: sum.workRealTime.col + '<span style="font-size:85%;">' + teasp.message.getLabel('tm10009250') + '</span>',
				label2: teasp.message.getLabel('tm10009231') + '<span style="font-size:85%;">' + teasp.message.getLabel('tm10009250') + '</span>',
				label2Shift: "fixd"
			},
			{	// 実際の労働時間
				key: "workRealTimeNoDiscretion",
				filter: "fixd,man",
				label: sum.workRealTime.col + '<span style="font-size:85%;">' + teasp.message.getLabel('tm10009250') + '</span>'
			},
			{	// 過不足時間
				key: "amountTime",
				filter: "flex",
				label: sum.amountTime.col
			},
			{	// 当月過不足時間
				key: "amountTime",
				filter: "flexp",
				label: teasp.message.getLabel('tf10010290')
			},
			{
				separator: true,
				filter: "var1,var3,var6,var12"
			},
			{	// 変形期間における法定労働時間
				key: "periodWorkLegalMax",
				filter: "var1,var3,var6,var12",
				label: teasp.message.getLabel('tm10009050') + '<span style="font-size:0.9em;"> (' + sum.periodJp + ':' + sum.periodSpan + ')</span><br/>' + teasp.message.getLabel('tm10009060')
			},
			{	// 期間内法定時間内労働合計
				key: "periodWorkLegalTime",
				filter: "var1,var3,var6,var12",
				label: teasp.message.getLabel('tm10009070') + '<span style="font-size:0.9em;"> (' + sum.currentSpan + ')</span><br/>' + teasp.message.getLabel('tm10009080')
			},
			{	// 週40時間超過時間
				key: "overTimeInWeek",
				filter: "reserve",
				label: teasp.message.getLabel('tf10010430')
			},
			{	// 超過分
				key: "overTimeInPeriod",
				filter: "var1,var3,var6,var12",
				label: teasp.message.getLabel('tm10009420')
			},
			{
				separator: true
			},
			{	// 当月度の超過時間
				key: "workOverTime36",
				label: sum.workOverTime36.col
			},
			{	// 当四半期の超過時間
				key: "quartWorkOverTime36",
				label: sum.quartWorkOverTime36.col
			},
			{	// 当年度の超過時間
				key: "totalWorkOverTime36",
				label: sum.totalWorkOverTime36.col
			},
			{	// 当年度の超過回数
				key: "totalWorkOverCount36",
				label: sum.totalWorkOverCount36.col
			},
			{	// 安全配慮上の超過時間
				key: "workOver40perWeek",
				label: sum.workOver40perWeek.col
			}
		],
		column2:[
			{	// 清算期間({0}:{1})の{2}
				key: "settlementPeriod",
				filter: "flexp",
				labelOnly: true,
				label: sum.periodLabel
			},
			{	// 法定労働時間
				key: "legalTime",
				filter: "flex",
				label: sum.legalTime.col
			},
			{	// 清算期間の法定労働時間
				key: "periodLegalTime",
				filter: "flexp",
				label: sum.periodLegalTime.col
			},
			{	// 清算期間の所定労働時間
				key: "periodFixTime",
				filter: "reserve",
				label: sum.periodFixTime.col
			},
			{	// 当月週平均50時間基準時間
				key: "weeklyAvg50",
				filter: "reserve",
				label: sum.weeklyAvg50.col
			},
			{	// 前月からの繰越時間
				key: "carryforwardFromPrev",
				filter: "flexp",
				label: sum.carryforwardFromPrev.col
			},
			{	// 来月への繰越時間
				key: "carryforwardToNext",
				filter: "flexf,flexm",
				label: sum.carryforwardToNext.col
			},
			{	// 清算期間の過不足時間
				key: "periodAmountTime",
				filter: "flexe",
				label: sum.periodAmountTime.col
			},
			{	// 実労働時間－法定休日労働（有休を含めない）
				key: "workRealOmitHolidayTime",
				filter: "flex",
				label: sum.workRealOmitHolidayTime.col + '<br/><span style="font-size:85%;">' + teasp.message.getLabel('tm10009250') + '</span>'
			},
			{	// 法定時間内残業
				key: "legalOverTime",
				label: sum.legalOverTime.col
			},
			{	// 法定時間外残業
				key: "legalOutOverTime",
				label: sum.legalOutOverTime.col
			},
			{	// 法定休日労働時間
				key: "workHolidayTime",
				label: sum.workHolidayTime.col
			},
			{	// 週平均50時間超過時間
				key: "settlementTime",
				filter: "flexp",
				label: sum.weeklyAvg50Label
			},
			{
				separator: true
			},
			{	// 深夜労働時間
				key: "workNightTime",
				label: sum.workNightTime.col
			},
			{	// 法定時間外割増
				key: "workChargeTime",
				label: sum.workChargeTime.col
			},
			{	// 45時間を超える時間外労働
				key: "workOver45Time",
				label: sum.workOver45Time.col
			},
			{	// 60時間を超える時間外労働
				key: "workOver60Time",
				label: sum.workOver60Time.col
			},
			{
				separator: true
			},
			{	// 遅刻回数・時間（控除対象）
				key: "lateCount",
				label: sum.lateCount.col
			},
			{	// 早退回数・時間（控除対象）
				key: "earlyCount",
				label: sum.earlyCount.col
			},
			{	// 勤務時間内の私用外出回数・時間（控除対象）
				key: "privateInnerCount",
				label: sum.privateInnerCount.col
			}
		],
		column3:[
			{	// 有休取得日数
				key: "holidayPaid",
				label: teasp.message.getLabel('tm10009350')
			},
			{	// 時間単位有休取得時間
				key: "paidRestTime",
				label: teasp.message.getLabel('tm10009360')
			},
			{
				separator: true
			},
			{	// 代休取得日数
				key: "holidayDaiq",
				label: teasp.message.getLabel('tm10009370')
			},
			{
				separator: true
			},
			{	// 無給休暇日数
				key: "holidayFree",
				label: teasp.message.getLabel('tm10009380')
			},
			{
				separator: true
			},
			{	// 有休残日数
				key: "yuqRemain",
				label: teasp.message.getLabel('tm10009390') + '<span style="font-size:85%;">' + teasp.message.getLabel('tm10009140', teasp.util.date.formatDate(this.pouch.getEmpMonthLastDate(), 'M/d')) + '</span>'
			},
			{	// y年m月度以降の計画付与予定日
				key: "plannedRemain",
				label: sum.plannedRemain.col
			}
		]
	};
};

/**
 * 集計エリア組み込み情報初期化
 */
teasp.helper.Summary.prototype.getDefaultTimeViewBottomContents = function(sum){
	return {
		numberOfColumns: 2,
		column1:[
			{	// 所定出勤日数
				key: "fixdays",
				label: sum.fixdays.col
			},
			{	// 実出勤日数
				key: "realdays",
				label: sum.realdays.col
			},
			{	// 所定労働時間
				key: "workFixedTime",
				label: sum.workFixedTime.col
			},
			{	// 総労働時間
				key: "workWholeTime",
				label: sum.workWholeTime.col,
				filter: "fix,flex,flexp,var"
			},
			{	// 法定休日労働時間
				key: "workHolidayTime",
				filter: "flexp",
				label: teasp.message.getLabel('legalHolidayWorkTime_label')
			},
		],
		column2:[
			{	// 清算期間({0}:{1})の{2}
				key: "settlementPeriod",
				filter: "flexp",
				labelOnly: true,
				label: sum.periodLabel
			},
			{	// 過不足時間
				key: "curAmountTime",
				label: sum.curAmountTime.col,
				filter: "flex",
				atTheMoment: sum.curAmountTime.atTheMoment
			},
			{	// 前月からの繰越時間
				key: "carryforwardFromPrev",
				filter: "flexp",
				label: sum.carryforwardFromPrev.col
			},
			{	// 来月への繰越時間
				key: "carryforwardToNext",
				filter: "flexf,flexm",
				label: sum.carryforwardToNext.col
			},
			{	// 清算期間の過不足時間
				key: "periodAmountTime",
				label: sum.periodAmountTime.col,
				filter: "flexe",
			},
			{	// 法定休日労働時間
				key: "workHolidayTime",
				exclude: "flexp",
				label: teasp.message.getLabel('legalHolidayWorkTime_label')
			},
			{	// 法定時間内残業
				key: "legalOverTime",
				label: sum.legalOverTime.col
			},
			{	// 法定時間外残業
				key: "legalOutOverTime",
				label: sum.legalOutOverTime.col
			},
			{	// 週平均50時間超過時間
				key: "settlementTime",
				filter: "flexp",
				label: sum.weeklyAvg50Label
			},
			{	// ダミー
				fixValue: '',
				filter: "fix,var"
			}
		]
	};
};

teasp.helper.Summary.prototype.getDefaultLabel = function(){
	var sum = this.monSum.o;
	return {
		fixdays                  : sum.fixdays.col,                      // 所定出勤日数
		realdays                 : sum.realdays.col,                     // 実出勤日数
		workLegalHolidays        : sum.workLegalHolidays.col,            // 法定休日出勤日数
		workHolidays             : sum.workHolidays.col,                 // 所定休日出勤日数
		workFixedTime            : sum.workFixedTime.col,                // 所定労働時間
		workWholeTime            : sum.workWholeTime.col,                // 総労働時間
		workWholeOmitHolidayTime : sum.workWholeOmitHolidayTime.col,     // 総労働時間－法定休日労働
		workRealTime             : sum.workRealTime.col,                 // 実労働時間
		workRealTimeNoDiscretion : sum.workRealTime.col,                 // 実際の労働時間
		amountTime               : sum.amountTime.col,                   // 過不足時間
		curAmountTime            : sum.curAmountTime.col,                // 過不足時間
		curAmountTime_atTheMoment: sum.curAmountTime.atTheMoment,        // 過不足時間のラベル末尾に付加する文字列
		periodAmountTime         : sum.periodAmountTime.col,             // 清算期間の過不足時間
		curPeriodAmountTime      : sum.curPeriodAmountTime.col,          // 清算期間の過不足時間
		curPeriodAmountTime_atTheMoment: sum.curPeriodAmountTime.atTheMoment, // 清算期間の過不足時間のラベル末尾に付加する文字列
		periodLegalTime          : sum.periodLegalTime.col,              // 清算期間の法定労働時間
		periodFixTime            : sum.periodFixTime.col,                // 清算期間の所定労働時間
		weeklyAvg50              : sum.weeklyAvg50.col,                  // 週平均50時間基準時間
		carryforwardFromPrev     : sum.carryforwardFromPrev.col,         // 前月からの繰越時間
		carryforwardToNext       : sum.carryforwardToNext.col,           // 来月への繰越時間
		settlementTime           : sum.settlementTime.col,               // 当月清算時間
		periodWorkLegalMax       : teasp.message.getLabel('tm10009050') + teasp.message.getLabel('tm10009060'), // 変形期間における法定労働時間
		periodWorkLegalTime      : teasp.message.getLabel('tm10009070') + teasp.message.getLabel('tm10009080'), // 期間内法定時間内労働合計
		overTimeInPeriod         : teasp.message.getLabel('tm10009420'), // 超過分
		overTimeInWeek           : teasp.message.getLabel('tf10010430'), // 週40時間超過時間
		workOverTime36           : sum.workOverTime36.col,               // 当月度の超過時間
		quartWorkOverTime36      : sum.quartWorkOverTime36.col,          // 当四半期の超過時間
		totalWorkOverTime36      : sum.totalWorkOverTime36.col,          // 当年度の超過時間
		totalWorkOverCount36     : sum.totalWorkOverCount36.col,         // 当年度の超過回数
		workOver40perWeek        : sum.workOver40perWeek.col,            // 安全配慮上の超過時間
		legalTime                : sum.legalTime.col,                    // 法定労働時間
		workRealOmitHolidayTime  : sum.workRealOmitHolidayTime.col,      // 実労働時間－法定休日労働（有休を含めない）
		legalOverTime            : sum.legalOverTime.col,                // 法定時間内残業
		legalOutOverTime         : sum.legalOutOverTime.col,             // 法定時間外残業
		workHolidayTime          : sum.workHolidayTime.col,              // 法定休日労働時間
		workNightTime            : sum.workNightTime.col,                // 深夜労働時間
		workChargeTime           : sum.workChargeTime.col,               // 法定時間外割増
		workOver45Time           : sum.workOver45Time.col,               // 45時間を超える時間外労働
		workOver60Time           : sum.workOver60Time.col,               // 60時間を超える時間外労働
		lateCount                : sum.lateCount.col,                    // 遅刻回数・時間（控除対象）
		earlyCount               : sum.earlyCount.col,                   // 早退回数・時間（控除対象）
		privateInnerCount        : sum.privateInnerCount.col,            // 勤務時間内の私用外出回数・時間（控除対象）
		holidayPaid              : teasp.message.getLabel('tm10009350'), // 有休取得日数
		paidRestTime             : teasp.message.getLabel('tm10009360'), // 時間単位有休取得時間
		holidayDaiq              : teasp.message.getLabel('tm10009370'), // 代休取得日数
		holidayFree              : teasp.message.getLabel('tm10009380'), // 無給休暇日数
		yuqRemain                : teasp.message.getLabel('tm10009390'), // 有休残日数
		plannedRemain            : sum.plannedRemain.col                 // y年m月度以降の計画付与予定日
	};
};

teasp.helper.Summary.prototype.setDefaultSummaryValues = function(obj){
	var sum = this.monSum.o;
	var hd = sum.holidaySummary;

	this.setSummaryValue(obj, "fixdays" 				 , sum.fixdays.val);
	this.setSummaryValue(obj, "realdays"				 , sum.realdays.val);
	this.setSummaryValue(obj, "workLegalHolidays"		 , sum.workLegalHolidays.val);
	this.setSummaryValue(obj, "workHolidays"			 , sum.workHolidays.val);
	this.setSummaryValue(obj, "workFixedTime"			 , sum.workFixedTime.val);
	this.setSummaryValue(obj, "workWholeTime"			 , sum.workWholeTime.val);
	this.setSummaryValue(obj, "workWholeOmitHolidayTime" , sum.workWholeOmitHolidayTime.val);
	this.setSummaryValue(obj, "workRealTime"			 , sum.workRealTime.val);
	this.setSummaryValue(obj, "workRealTimeNoDiscretion" , sum.workRealTimeNoDiscretion.val);
	this.setSummaryValue(obj, "amountTime"				 , sum.amountTime.val);
	this.setSummaryValue(obj, "curAmountTime"			 , sum.curAmountTime.val);
	this.setSummaryValue(obj, "periodAmountTime"		 , sum.periodAmountTime.val);
	this.setSummaryValue(obj, "curPeriodAmountTime"		 , sum.curPeriodAmountTime.val);
	this.setSummaryValue(obj, "periodLegalTime"			 , sum.periodLegalTime.val);
	this.setSummaryValue(obj, "periodFixTime"			 , sum.periodFixTime.val);
	this.setSummaryValue(obj, "weeklyAvg50"				 , sum.weeklyAvg50.val);
	this.setSummaryValue(obj, "carryforwardFromPrev"	 , sum.carryforwardFromPrev.val);
	this.setSummaryValue(obj, "carryforwardToNext"		 , sum.carryforwardToNext.val);
	this.setSummaryValue(obj, "settlementTime"			 , sum.settlementTime.val);
	this.setSummaryValue(obj, "periodWorkLegalMax"		 , sum.periodWorkLegalMax.val);
	this.setSummaryValue(obj, "periodWorkLegalTime" 	 , sum.periodWorkLegalTime.val);
	this.setSummaryValue(obj, "overTimeInPeriod"		 , sum.overTimeInPeriod.val);
	this.setSummaryValue(obj, "overTimeInWeek"			 , sum.overTimeInWeek.val);
	this.setSummaryValue(obj, "workOverTime36"			 , sum.workOverTime36.val);
	this.setSummaryValue(obj, "quartWorkOverTime36" 	 , sum.quartWorkOverTime36.val);
	this.setSummaryValue(obj, "totalWorkOverTime36" 	 , sum.totalWorkOverTime36.val);
	this.setSummaryValue(obj, "totalWorkOverCount36"	 , sum.totalWorkOverCount36.val);
	this.setSummaryValue(obj, "workOver40perWeek"		 , sum.workOver40perWeek.val);
	this.setSummaryValue(obj, "legalTime"				 , sum.legalTime.val);
	this.setSummaryValue(obj, "workRealOmitHolidayTime"  , sum.workRealOmitHolidayTime.val);
	this.setSummaryValue(obj, "legalOverTime"			 , sum.legalOverTime.val);
	this.setSummaryValue(obj, "legalOutOverTime"		 , sum.legalOutOverTime.val);
	this.setSummaryValue(obj, "workHolidayTime" 		 , sum.workHolidayTime.val);
	this.setSummaryValue(obj, "workNightTime"			 , sum.workNightTime.val);
	this.setSummaryValue(obj, "workChargeTime"			 , sum.workChargeTime.val);
	this.setSummaryValue(obj, "workOver45Time"			 , sum.workOver45Time.val);
	this.setSummaryValue(obj, "workOver60Time"			 , sum.workOver60Time.val);
	this.setSummaryValue(obj, "lateCount"				 , sum.lateCount.val  + ' ' + sum.lateTime.val  + (sum.flex ? '' : '<br/>' + sum.lateLostTime.val));
	this.setSummaryValue(obj, "earlyCount"				 , sum.earlyCount.val + ' ' + sum.earlyTime.val + (sum.flex ? '' : '<br/>' + sum.earlyLostTime.val));
	this.setSummaryValue(obj, "privateInnerCount"		 , sum.privateInnerCount.val + ' ' + sum.privateInnerTime.val + (sum.flex ? '' : '<br/>' + sum.privateInnerLostTime.val));
	this.setSummaryValue(obj, "holidayPaid" 			 , this.getHolidayDaysAndHours(hd.sums[teasp.constant.HOLIDAY_TYPE_PAID], hd.sumh[teasp.constant.HOLIDAY_TYPE_PAID]));
	this.setSummaryValue(obj, "paidRestTime"			 , this.pouch.getMonthSubTimeByKey('paidRestTime'));
	this.setSummaryValue(obj, "holidayDaiq" 			 , this.getHolidayDaysAndHours(hd.sums[teasp.constant.HOLIDAY_TYPE_DAIQ], hd.sumh[teasp.constant.HOLIDAY_TYPE_DAIQ]));
	this.setSummaryValue(obj, "holidayFree" 			 , this.getHolidayDaysAndHours(hd.sums[teasp.constant.HOLIDAY_TYPE_FREE], hd.sumh[teasp.constant.HOLIDAY_TYPE_FREE]));
	this.setSummaryValue(obj, "yuqRemain"				 , sum.yuqRemain.val);
	this.setSummaryValue(obj, "plannedRemain"			 , sum.plannedRemain.val);

	this.setSummaryElement(obj, "holidayPaid", "lines", this.getHolidayItems(hd.items[teasp.constant.HOLIDAY_TYPE_PAID]));
	this.setSummaryElement(obj, "holidayDaiq", "lines", this.getHolidayItems(hd.items[teasp.constant.HOLIDAY_TYPE_DAIQ]));
	this.setSummaryElement(obj, "holidayFree", "lines", this.getHolidayItems(hd.items[teasp.constant.HOLIDAY_TYPE_FREE]));
	return obj;
};

teasp.helper.Summary.prototype.getHolidayDaysAndHours = function(days, hours){
	if(!hours){
		return teasp.message.getLabel('tm10001010', days);
	}
	return teasp.message.getLabel('tf10007630', days, teasp.util.time.timeValue(hours));
};
/**
 * 休暇の明細データを取得
 */
teasp.helper.Summary.prototype.getHolidayItems = function(map){
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
	var items = [];
	var cnt = 0;
	for(var i = 0 ; i < l.length ; i++){
		var o = l[i];
		items.push({
			head	: (cnt++ == 0 ? teasp.message.getLabel('tm10009160') : ''),
			label	: o.name,
			value	: (o.time ? teasp.util.time.timeValue(o.time) : teasp.message.getLabel('tm10001010', o.cnt))
		});
	}
	if(!cnt){
		items.push({
			head	: teasp.message.getLabel('tm10009160'),
			label	: teasp.message.getLabel('tm10009170'),
			value	: teasp.message.getLabel('tm10009180')
		});
	}
	return items;
};

/**
 * フィールド情報を解析
 */
teasp.helper.Summary.prototype.buildFields = function(obj){
	var numberOfColumns = obj.numberOfColumns || 0;
	// 各列に項目を配置
	var cx = 1;
	while(cx <= numberOfColumns){
		var fields = obj['column' + cx] || [];
		for(var i = 0 ; i < fields.length ; i++){
			var field = fields[i];
			// フィルタにマッチしないか、key, apiKey, fixValue 指定なしの場合はフラグをセットしてスキップ
			if((field.filter && field.filter != 'default' && !this.isMatchLoosely(field.filter))
			|| (!field.key && !field.apiKey && field.fixValue === undefined && !field.separator)
			|| field.removed
			|| this.isMatchStrict(field.exclude)
			){
				field.skip = true;
				continue;
			}
			// ラベルを決める
			var L2 = this.isMatchStrict(field.label2Shift);
			var msgId = (L2 ? field.label2MsgId : field.labelMsgId);
			var label = (msgId ? teasp.message.getLabel(msgId) : null);
			if(!label){
				if(L2){
					label = (this.isEngMode() ? field.label2En : field.label2);
				}else{
					label = (this.isEngMode() ? field.labelEn : field.label);
				}
			}
			if(!field.label || label){
				field.label = label || '';
			}
			if(field.label && field.atTheMoment && !field.omitAtTheMoment){
				field.label += field.atTheMoment;
			}
			// 値を決める
			var values = [];
			if(field.fixValue !== undefined){ // 固定値が指定されている
				values.push(field.fixValue);
			}else if(field.apiKey){ // API参照名が指定されている
				var ks = field.apiKey.split(',');
				var vs = [];
				for(var j = 0 ; j < ks.length ; j++){
					var k = ks[j];
					vs.push(this.pouch.getEmpMonthValueByKey(k));
				}
				if(ks.length == 1){
					values.push(vs[0]);
				}else if(field.operator){
					var tmp = 0;
					var x = 0;
					var ops = field.operator.split(',');
					var op = ops[x++] || '+';
					for(var j = 0 ; j < vs.length ; j++){
						var v = vs[j] || 0;
						if(!j){
							tmp = v;
						}else{
							switch(op){
							case '+': tmp += v; break;
							case '-': tmp -= v; break;
							case '*': tmp *= v; break;
							case '/': tmp /= v; break;
							}
						}
						if(x < ops.length){
							op = ops[x++] || '+';
						}
					}
					values.push(tmp);
				}else{
					values = vs;
				}
			}else{
				values.push(field.value);
			}
			var units	= (field.unit	&& field.unit.split(','))	|| [];
			var formats = (field.format && field.format.split(',')) || [];
			var m = Math.min(units.length, formats.length);
			for(var j = 0 ; j < m ; j++){
				if(j < values.length){
					var u = units[j];
					var f = formats[j];
					var v = values[j];
					if(u == 'd'){
						values[j] = (v ? moment(v).format(f) : '');
					}else if(f == 'hmm'){
						if(u == 'm'){
							values[j] = teasp.util.time.timeValue(v);
						}else if(u == 'h'){
							values[j] = teasp.util.time.timeValue(v * 60);
						}
					}
				}
			}
			var noph = false;
			if((!values.length || (values.length == 1 && teasp.util.dspVal(values[0]) === null))  // 値がないまたは1つだけの値で空
			&& (field.nullValueFix !== undefined || field.nullValue !== undefined) // かつ nullValueFix または nullValue が指定されている
			){
				values = [field.nullValueFix || field.nullValue];
				if(field.nullValueFix){
					noph = true;
				}
			}
			var ph = null;
			if(field.placeholderMsgId){
				ph = teasp.message.getLabel(field.placeholderMsgId);
			}else{
				ph = (this.isEngMode() ? field.placeholderEn : field.placeholder);
			}
			if(ph && !noph){
				field.value = this.format(ph, values);
			}else{
				field.value = (typeof(values[0]) == 'number' ? values[0] : (values[0] || ''));
			}
		}
		cx++;
	}
	return obj;
};

/**
 * フィールド情報をマージ
 */
teasp.helper.Summary.prototype.mergeFields = function(defaultObj, targetObj){
	var numberOfColumns = targetObj.numberOfColumns;
	// 各列に項目を配置
	var cx = 1;
	while(cx <= numberOfColumns){
		var fields = targetObj['column' + cx] || [];
		for(var i = 0 ; i < fields.length ; i++){
			var field = fields[i];
			if(!field.key){
				continue;
			}
			var defaultFields = this.getSummaryFieldsByKey(defaultObj, field.key, cx);
			if(defaultFields.length){
				field = dojo.mixin(dojo.clone(defaultFields[0]), field);
				fields.splice(i, 1, field);
			}
			if(field.key && !field.hasOwnProperty('label')){
				field.label = this.getDefaultLabel()[field.key] || '';
			}
			if(this.getDefaultLabel()[field.key + '_atTheMoment']){
				field.atTheMoment = this.getDefaultLabel()[field.key + '_atTheMoment'];
			}
		}
		cx++;
	}
	return targetObj;
};

teasp.helper.Summary.prototype.setSummaryValue = function(obj, key, val){
	this.setSummaryElement(obj, key, 'value', val);
};

teasp.helper.Summary.prototype.setSummaryElement = function(obj, key, ekey, val){
	var fields = this.getSummaryFieldsByKey(obj, key);
	for(var i = 0 ; i < fields.length ; i++){
		fields[i][ekey] = val;
	}
};

teasp.helper.Summary.prototype.getSummaryFieldsByKey = function(obj, key, tx){
	var fs = [];
	if(tx !== undefined){
		var fields = obj['column' + tx] || [];
		for(var i = 0 ; i < fields.length ; i++){
			var field = fields[i];
			if(field.key == key && this.isMatchLoosely(field.filter)){
				fs.push(field);
			}
		}
	}
	var cx = 1;
	while(cx <= 5){
		if(tx !== undefined && cx == tx){
			cx++;
			continue;
		}
		var fields = obj['column' + (cx++)] || [];
		for(var i = 0 ; i < fields.length ; i++){
			var field = fields[i];
			if(field.key == key){
				fs.push(field);
			}
		}
	}
	return fs;
};

teasp.helper.Summary.prototype.isMatchFilter = function(filter, flag){
	if(!filter){ // 条件なし
		return flag;
	}
	var ss = filter.split(',');
	for(var i = 0 ; i < ss.length ; i++){
		var s = ss[i];
		if(this.matchLocalConditionByKey(s)){
			return true;
		}
		if(s == this.categoryS || s == this.categoryL){
			return true;
		}
	}
	return false;
};

teasp.helper.Summary.prototype.isMatchLoosely = function(filter){
	return this.isMatchFilter(filter, true);
};

teasp.helper.Summary.prototype.isMatchStrict = function(filter){
	return this.isMatchFilter(filter, false);
};

teasp.helper.Summary.prototype.isEngMode = function(){
	return (teasp.message.languageLocaleKey != 'ja');
};

teasp.helper.Summary.prototype.format = function(ph, args) {
	var b = (ph || '');
	for (var i = 0; i < args.length; i++){
		var v = args[i];
		if(v === undefined || v === null){
			v = '';
		}
		b = b.replace(RegExp("\\{" + i + "\\}", "g"), v);
	}
	return b;
};

