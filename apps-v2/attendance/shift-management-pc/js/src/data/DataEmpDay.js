teasp.provide('teasp.data.EmpDay');
/**
 * 勤怠日次データクラス
 *
 * @constructor
 * @param {teasp.data.Pouch} parent 親データクラス
 * @param {string|Object} dkey 日付（Stringの場合'yyyy-MM-dd'、オブジェクトの場合は日次オブジェクト）
 */
teasp.data.EmpDay = function(parent, dkey){
	/** @private */
	this.parent = parent;
	/** @private */
	this.dataObj = this.parent.getObj();
	/** @private */
	this.day = (typeof(dkey) == 'string' ? (this.dataObj.days.hasOwnProperty(dkey) ? this.dataObj.days[dkey] : this.parent.getMonthDay(dkey)) : dkey);
};

/**
 * 有効か
 * @public
 * @return {boolean} true:有効
 */
teasp.data.EmpDay.prototype.isValid = function(){
	return (this.day && this.day.rack ? true : false);
};

/**
 * 日次オブジェクトを返す
 * @public
 * @return {Object} 日次オブジェクト
 */
teasp.data.EmpDay.prototype.getObj = function(){
	return this.day;
};

/**
 * 日次キーを返す
 * @public
 * @return {string} キー('yyyy-MM-dd')
 */
teasp.data.EmpDay.prototype.getKey = function(){
	return this.day.rack.key;
};

/**
 * 月次
 * @returns {teasp.data.Pouch}
 */
teasp.data.EmpDay.prototype.getMonth = function(){
	return this.parent;
};

/**
 * 日タイプを返す
 * @public
 * @return {number} 日タイプ
 *     <ul>
 *     <li>0・・平日</li>
 *     <li>1・・所定休日</li>
 *     <li>2・・法定休日</li>
 *     <li>3・・祝日</li>
 *     </ul>
 */
teasp.data.EmpDay.prototype.getDayType = function(){
	return this.day.dayType;
};

/**
 * 法定休日の自動判定が行われる前の日タイプを返す
 * @returns {string}
 */
teasp.data.EmpDay.prototype.getExplicDayType = function(){
	var tgtday = this.day;
	if(tgtday.exchangeDate && this.dataObj.days[tgtday.exchangeDate]){
		tgtday = this.dataObj.days[tgtday.exchangeDate];
	}
	// 勤務時間変更申請で日タイプを指定している場合は、その日タイプを返す。
	var va = (tgtday.rack && tgtday.rack.validApplys) || null;
	if(va && va.patternD){
		return va.patternD.dayType;
	}
	return tgtday.explicDayType;
};

/**
 * 日次の備考を返す
 * @public
 * @return {string} 備考
 */
teasp.data.EmpDay.prototype.getDayNote = function(flag){
	var note = (this.day.note || '');
	var travel = '';
	var dr = (this.getEmpApplyByKey(teasp.constant.APPLY_KEY_DIRECT) // 直行・直帰申請
		|| this.getEmpApplyByKey(teasp.constant.APPLY_KEY_KYUSHTU)); // 休日出勤申請
	if(dr && dr.travelTime && this.day.date == dr.startDate){
		travel = teasp.message.getLabel('tk10004711', teasp.util.time.timeValue(dr.travelTime));
	}
	if(flag){
		return (note ? (note + '\r\n' + travel) : travel);
	}
	var an = (this.day.rack.applyNotes || null);
	an = (an ? (an + '\r\n' + travel) : travel);
	if(an){
		var x = note.indexOf(an);
		if(x >= 0){
			note = note.substring(0, x) + note.substring(x + an.length);
		}
	}
	var match = /^(?:\r?\n)(.+)$/.exec(note);
	if(match){
		note = match[1];
	}
	return (an ? an + '\r\n' : '') + (note || '');
};

/**
 * 日次の備考をセット
 * @public
 * @param {string} note 備考
 */
teasp.data.EmpDay.prototype.setDayNote = function(note){
	this.day.note = note;
};

/**
 * 【工数】 作業報告を返す
 * @public
 * @return {string} 作業報告
 */
teasp.data.EmpDay.prototype.getWorkNote = function(){
	return (this.day.workNote  || '');
};

/**
 * 【工数】 作業報告をセット
 * @public
 * @param {string} note 作業報告
 */
teasp.data.EmpDay.prototype.setWorkNote = function(note){
	this.day.workNote = note;
};

/**
 * 打刻なし、打刻相違の情報を返す。
 * 打刻がなかったとき、打刻と入力が労働者有利に異なるときに打刻なしや打刻時刻を出力
 * @public
 * @return {string} 文字列
 */
teasp.data.EmpDay.prototype.getTimeCaution = function(){
	return (this.day.deco.ct.note || '');
};

/**
 * 勤務表の勤務状況欄にツールチップ表示する文字列を返す
 * @public
 * @return {string} 文字列
 */
teasp.data.EmpDay.prototype.getDayTitle = function(){
	return (this.day.deco.title || '');
};

/**
 * 勤務表の勤務状況欄のスタイルシートのセレクタを返す
 * @public
 * @return {string} スタイルシートのセレクタ
 */
teasp.data.EmpDay.prototype.getDayIconClass = function(){
	return (this.day.deco.iconClass || '');
};

/**
 * 申請オブジェクト（その日に複数申請があればアルゴリズムで１つ選ぶ）を返す
 * @public
 * @return {Object} 申請オブジェクト
 */
teasp.data.EmpDay.prototype.getTypicalEmpApply = function(){
	return this.day.rack.validApplys.showApply;
};

/**
 * タイムテーブルを返す
 * @public
 * @param {boolean} flag true:blankSpanと全部重なっている休憩は除く
 * @return {Array.<Object>} タイムテーブル
 */
teasp.data.EmpDay.prototype.getTimeTable = function(flag){
	var tt = (this.day.timeTable || []);
	if(!flag || !tt.length){
		return tt;
	}
	var bs = this.day.real ? (this.day.real.blankSpan || []) : [];
	if(!bs.length){
		return tt;
	}
	var l = dojo.clone(tt);
	for(var i = l.length - 1 ; i >= 0 ; i--){
		var o = l[i];
		if(o.type == teasp.constant.REST_FIX){
			var t = teasp.util.time.rangeTime(o, bs);
			if(t > 0){
				if(t == (o.to - o.from)){
					l.splice(i, 1);
				}else{
					var nl = teasp.util.time.excludeRanges([o], bs);
					if(nl && nl.length > 0){
						o.from = nl[0].from;
						o.to   = nl[0].to;
					}
				}
			}
		}
	}
	return l;
};

/**
 * 勤務パターンを返す
 * @public
 * @return {Object} 勤務パターン
 */
teasp.data.EmpDay.prototype.getPattern = function(){
	return this.day.pattern;
};

/**
 * 出退時刻（どちらか）入力済みか
 * @public
 * @return {boolean} true:入力済み
 */
teasp.data.EmpDay.prototype.isInputTime = function(){
	return (this.day.deco ? (this.day.deco.ct.st || this.day.deco.ct.et) : (this.day.startTime || this.day.endTime));
};

/**
 * 有休計画付与日か
 * @public
 * @return {boolean} true:有休計画付与日である
 */
teasp.data.EmpDay.prototype.isPlannedHoliday = function(){
	return (this.day.plannedHoliday || false);
};

/**
 * 本日か
 * @public
 * @return {boolean} true:本日である
 */
teasp.data.EmpDay.prototype.isToday = function(){
	return (this.day.rack.todayDiff == 0);
};

/**
 * 出退時刻入力済みか
 * @public
 * @return {boolean} true:済み
 */
teasp.data.EmpDay.prototype.isWorked = function(){
	return this.day.rack.worked;
};

/**
 * 休暇フラグを返す
 * @public
 * @return {number} 休暇フラグ
 *     <ul>
 *     <li>0・・休暇ではない</li>
 *     <li>1・・午前休</li>
 *     <li>2・・午後休</li>
 *     <li>3・・終日休</li>
 *     </ul>
 */
teasp.data.EmpDay.prototype.getHolidayFlag = function(){
	return (this.day.rack.holidayJoin ? this.day.rack.holidayJoin.flag : 0);
};

teasp.data.EmpDay.prototype.isHolidayAll = function(){
	return (this.getHolidayFlag() == 3);
};

/**
 * 設定または申請の勤務パターンまたはシフトを反映した始業時刻を返す
 * @public
 * @param {boolean=} flag=true:時間単位有休を考慮した境界時刻を返す
 * @return {number} 始業時刻
 */
teasp.data.EmpDay.prototype.getFixStartTime = function(flag){
	if(flag && typeof(this.day.rack.bdrStartTime) == 'number'){
		return this.day.rack.bdrStartTime;
	}
	return this.day.rack.fixStartTime;
};

/**
 * 設定または申請の勤務パターンまたはシフトを反映した終業時刻を返す
 * @public
 * @param {boolean=} flag=true:時間単位有休を考慮した境界時刻を返す
 * @return {number} 終業時刻
 */
teasp.data.EmpDay.prototype.getFixEndTime = function(flag){
	if(flag && typeof(this.day.rack.bdrEndTime) == 'number'){
		return this.day.rack.bdrEndTime;
	}
	return this.day.rack.fixEndTime;
};

/**
 * 出社時刻の適正レベルを返す
 * @public
 * @param {boolean=} flag ※使用不可
 * @return {number} 適正レベル
 *     <ul>
 *     <li>0・・未入力</li>
 *     <li>-1・・打刻なし</li>
 *     <li>-2・・入力時刻 < 打刻</li>
 *     <li>-3・・入力時刻 != 打刻（「打刻なしは備考必須にする」がオンの場合のみ発生）</li>
 *     <li>1・・適正である</li>
 *     </ul>
 */
teasp.data.EmpDay.prototype.getStartTimeJudge = function(flag){
	return (flag ? this.day.deco.ct.stan : this.day.deco.ct.st);
};

/**
 * 退社時刻の適正レベルを返す
 * @public
 * @param {boolean=} flag ※使用不可
 * @return {number} 適正レベル
 *     <ul>
 *     <li>0・・未入力</li>
 *     <li>-1・・打刻なし</li>
 *     <li>-2・・入力時刻 > 打刻</li>
 *     <li>-3・・入力時刻 != 打刻（「打刻なしは備考必須にする」がオンの場合のみ発生）</li>
 *     <li>1・・適正である</li>
 *     </ul>
 */
teasp.data.EmpDay.prototype.getEndTimeJudge = function(flag){
	return (flag ? this.day.deco.ct.etan : this.day.deco.ct.et);
};

/**
 * 出社時刻が不適正な場合の表示文字列を返す。
 * (例) "打刻なし" "出社打刻 10:15"等（勤怠情報入力ダイアログで表示）
 * @public
 * @return {string} 文字列
 */
teasp.data.EmpDay.prototype.getStartTimeEmboss = function(){
	return (this.day.deco.ct.stan || '');
};

/**
 * 退社時刻が不適正な場合の表示文字列を返す。
 * (例) "打刻なし" "退社打刻 17:40"等（勤怠情報入力ダイアログで表示）
 * @public
 * @return {string} 文字列
 */
teasp.data.EmpDay.prototype.getEndTimeEmboss = function(){
	return (this.day.deco.ct.etan || '');
};

/**
 * 所定休憩時間の配列を返す
 * @public
 * @return {Array.<Object>} 所定休憩時間の配列
 */
teasp.data.EmpDay.prototype.getFixRests = function(){
	return (this.day.rack.fixRests  || []);
};

/**
 * 私用休憩時間の配列を返す
 * @public
 * @return {Array.<Object>} 私用休憩時間の配列
 */
teasp.data.EmpDay.prototype.getFreeRests = function(){
	return (this.day.rack.freeRests || []);
};

/**
 * 時間単位休(有給/無給)の配列を返す
 * @public
 * @return {Array.<Object>} 時間単位休の配列
 */
teasp.data.EmpDay.prototype.getHourRests = function(){
	return (this.day.rack.hourRests || []);
};

/**
 * 時間単位休(有給)の配列を返す
 * @public
 * @return {Array.<Object>} 時間単位休の配列
 */
teasp.data.EmpDay.prototype.getPaidRests = function(){
	return (this.day.rack.paidRests || []);
};

/**
 * 時間単位休(無給)の配列を返す
 * @public
 * @return {Array.<Object>} 時間単位休の配列
 */
teasp.data.EmpDay.prototype.getUnpaidRests = function(){
	return (this.day.rack.unpaidRests || []);
};

/**
 * 所定労働時間を返す
 * @returns {Number}
 */
teasp.data.EmpDay.prototype.getFixTime = function(){
	return (this.day.rack.fixTime  || 0);
};

/**
 * 日次情報の属性情報を返す
 * @public
 * @param {string} key キー
 * @return {*} 情報
 */
teasp.data.EmpDay.prototype.getDayValueByKey = function(key){
	return this.day[key];
};

/**
 * 日次情報の時間情報を返す
 * @public
 * @param {string} key キー
 * @param {boolean} flag 表示形式 true:分のまま false:設定に従い h:mm か #.00
 * @param {string|number} defaultVal t の値が null の場合の代替値
 * @return {string|number} 時間情報
 */
teasp.data.EmpDay.prototype.getDayTimeByKey = function(key, flag, defaultVal){
	return this.parent.getDisplayTime(this.day.real[key], flag, defaultVal);
};

/**
 * 月度の起算日から当日までの日数を返す
 * @public
 * @return {number} 月度の起算日から当日までの日数
 */
teasp.data.EmpDay.prototype.getDayIndexOfMonth = function(){
	return teasp.util.date.daysInRange(this.dataObj.month.startDate, this.day.date) - 1;
};

/**
 * 勤怠グラフのツールチップを返す
 * @public
 * @return {string} ツールチップ
 */
teasp.data.EmpDay.prototype.getTip = function(){
	return this.tip;
};

/**
 * 勤怠グラフのツールチップをセット
 * @public
 * @param {string} tip ツールチップ
 */
teasp.data.EmpDay.prototype.setTip = function(tip){
	this.tip = tip;
};

/**
 * 申請があるか
 * @public
 * @param {string} key
 * @param {boolean} flag trueの場合、申請取消のレコードを含めて探す
 * @return {Object|Array.<Object>|null} 申請オブジェクト
 */
teasp.data.EmpDay.prototype.getEmpApplyByKey = function(key, flag){
	if(!this.day.rack.validApplys){
		return null;
	}
	var o = this.day.rack.validApplys[key];
	if(is_array(o)){
		return (o.length > 0 ? o[0] : null);
	}
	if(!o && key == teasp.constant.APPLY_KEY_DAILY && flag){
		return (this.day.rack.validApplys.oldDailyFix || null);
	}
	return (o || null);
};

/**
 * 申請があるか
 * @public
 * @param {string} key
 * @return {boolean} true:ある
 */
teasp.data.EmpDay.prototype.isExistApply = function(key){
	if(!this.day.rack){
		return false;
	}
	if(is_array(this.day.rack.validApplys[key])){
		return (this.day.rack.validApplys[key].length > 0);
	}
	return (this.day.rack.validApplys[key] ? true : false);
};

/**
 * 勤怠月次確定済みか
 * @public
 * @return {boolean} true:済み
 */
teasp.data.EmpDay.prototype.isMonthFix = function(){
	var m = this.parent.getEmpMonthByDate(this.getKey());
	return (m && m.apply && teasp.constant.STATUS_FIX.contains(m.apply.status));
};

/**
 * 勤怠日次確定済みか
 * @public
 * @return {boolean} true:済み
 */
teasp.data.EmpDay.prototype.isDailyFix = function(){
	return (this.isMonthFix() || this.isExistApply(teasp.constant.APPLY_KEY_DAILY));
};

/**
 * 申請のステータスを得る
 * @public
 * @param {string} key
 * @return {string|null} ステータス
 */
teasp.data.EmpDay.prototype.getApplyStatus = function(key){
	if(!this.day.rack){
		return '';
	}
	if(is_array(this.day.rack.validApplys[key])){
		var l = this.day.rack.validApplys[key];
		return (l.length > 0 ? l[0].status : '');
	}
	return (this.day.rack.validApplys[key] ? this.day.rack.validApplys[key].status : '');
};

/**
 * 時間単位休の申請リストを返す
 * @public
 * @return {Array.<Object>} 時間単位休の申請リスト
 */
teasp.data.EmpDay.prototype.getTimeHolidayApply = function(){
	return this.day.rack.validApplys.holidayTime;
};

/**
 * 申請リストを返す
 *
 * @param {string=} fltstr
 *     <table>
 *     <tr><td>'ALL'</td><td>全部（無効も含む）</td></tr>
 *     <tr><td>'ALL_WAIT'</td><td>未確定の（その状態だと勤務確定できない）申請リスト</td></tr>
 *     <tr><td>'REJECT_WAIT'</td><td>却下申請リスト</td></tr>
 *     <tr><td>それ以外</td><td>有効な申請リスト</td></tr>
 *     </table>
 * @return {Array.<Object>} 申請リスト
 */
teasp.data.EmpDay.prototype.getEmpApplyList = function(fltstr){
	if(fltstr == 'ALL'){
		return (this.day.rack.allApplys || []);
	}else if(fltstr == 'ALL_WAIT'){
		return (this.day.rack.validApplys.waiting || []);
	}else if(fltstr == 'REJECT_WAIT'){
		var waits = this.day.rack.validApplys.waiting;
		var lst = [];
		for(var i = 0 ; i < waits.length ; i++){
			var a = waits[i];
			if(teasp.constant.STATUS_REJECTS.contains(a.status)){
				lst.push(a);
			}
		}
		return lst;
	}else{
		var va = this.day.rack.validApplys;
		var lst = [];
		for(var key in va){
			if(va.hasOwnProperty(key) && va[key] && (key != 'showApply') && (key != 'waiting') && (key != 'rejects')){
				if(is_array(va[key])){
					lst = lst.concat(va[key]);
				}else if(va[key]){
					lst.push(va[key]);
				}
			}
		}
		return lst;
	}
};
/**
 * 休暇期間中にある休日の場合、その休暇申請を返す
 * @returns {Array.<Object>}
 */
teasp.data.EmpDay.prototype.getHolidayExcludes = function(){
	return this.day.rack.holidayExcludes;
};

teasp.data.EmpDay.prototype.isShowApply = function(apply){
/*
	if(teasp.constant.STATUS_FIX.contains(apply.status)
	|| (teasp.constant.STATUS_REJECTS.contains(apply.status) && !apply.close)){
		return true;
	}
	for(var key in this.day.applyId){
		if(this.day.applyId[key] == apply.id){
			return true;
		}
	}
	return false;
*/
//    if(teasp.constant.STATUS_CANCELS.contains(apply.status) && apply.close){
//    	return false;
//    }
	return true;
};

/**
 * 承認履歴をセット
 *
 * @param {Array.<Object>} steps 承認履歴のリスト
 * @param {Array.<Object>} items_ 承認申請オブジェクトのリスト
 */
teasp.data.EmpDay.prototype.setEmpApplySteps = function(steps, items_){
	for(var i = 0 ; i < this.day.rack.allApplys.length ; i++){
		var a = this.day.rack.allApplys[i];
		a.steps = [];
		for(var j = 0 ; j < steps.length ; j++){
			if(teasp.util.equalId(a.id, steps[j].applyId)){
				a.steps.push(steps[j]);
			}
		}
		var items = (items_ || []);
		for(var j = 0 ; j < items.length ; j++){
			if(items[j].ProcessInstance.TargetObjectId == a.id){
				a.processInstanceWorkItemId = items[j].Id;
				break;
			}
		}
	}
};

/**
 * 勤怠情報の入力可否。いずれかに該当すれば可。
 * <ul>
 * <li>平日、かつ終日休申請なし、かつ有休計画付与日ではない</li>
 * <li>出退社時刻どちらか入力済み</li>
 * <li>休日出勤申請済み</li>
 * </ul>
 * @param {boolean=} flag trueなら既入力済みを入力可としない
 * @return {boolean} true:できる
 */
teasp.data.EmpDay.prototype.isInputable = function(flag){
	if(((this.day.dayType == teasp.constant.DAY_TYPE_NORMAL || this.day.autoLH)
	&& (!this.day.rack || !this.day.rack.holidayJoin || this.day.rack.holidayJoin.flag != 3)
	&& !this.day.plannedHoliday)
	|| (!flag && (this.day.deco.ct.st || this.day.deco.ct.et))
	|| (flag && this.day.workFlag)
	|| (this.day.rack && this.day.rack.validApplys && this.day.rack.validApplys.kyushtu && this.day.rack.validApplys.kyushtu.length > 0
	&& (!this.parent.isProhibitInputTimeUntilApproved()
	|| teasp.constant.STATUS_APPROVES.contains(this.day.rack.validApplys.kyushtu[0].status)))
	){
		return true;
	}
	return false;
};


/**
 * 平日または休日出勤申請が「承認済み」の場合だけ true を返す
 *
 * @return {Object}
 */
teasp.data.EmpDay.prototype.isInputableEx = function(){
	var exchangeS = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_EXCHANGES);
	var exchangeE = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_EXCHANGEE);
	var exchange = (exchangeS || exchangeE);
	if(!exchange && !this.isHoliday() && !this.day.plannedHoliday){ // 平日かつ有休計画付与日ではない
		return {
			applyName  : null,
			inputable : true
		};
	}
	var holidayWork = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_KYUSHTU);
	if((exchangeS && !teasp.constant.STATUS_APPROVES.contains(exchangeS.status))
	|| (exchangeE && !teasp.constant.STATUS_APPROVES.contains(exchangeE.status))){
		return {
			applyName  : exchange.applyType,
			inputable : false
		};
	}
	if(holidayWork && !teasp.constant.STATUS_APPROVES.contains(holidayWork.status)){
		return {
			applyName  : holidayWork.applyType,
			inputable : false
		};
	}
	return {
		applyName : null,
		inputable : true
	};
};

/**
 * 休日（非勤務日）か
 *
 * @returns {Boolean}
 */
teasp.data.EmpDay.prototype.isHoliday = function(){
	if((this.day.dayType != teasp.constant.DAY_TYPE_NORMAL && !this.day.autoLH) || this.day.rack.isOrgHoliday){
		return true;
	}
	return false;
};

/**
 * 休暇申請を追加できるか
 *
 * @param {boolean} flag trueなら非勤務日かどうかは関係ない
 * @return {boolean} true:できる
 */
teasp.data.EmpDay.prototype.canSelectHoliday = function(flag){
	if(this.day.interim){ //「承認されるまで時間入力を禁止」の設定で、振替申請の承認待ちなので、申請不可
		return false;
	}
	if(!flag && (this.isHoliday() || this.day.plannedHoliday)){ // 平日ではない
		return false;
	}
	var holidayWork = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_KYUSHTU);
	if(holidayWork){ // 休日出勤申請あり
		return false;
	}
	if(!this.isHoliday() && this.day.plannedHoliday){ // 有休計画付与日
		return false;
	}
	var h = (this.day.rack.holidayJoin ? this.day.rack.holidayJoin.flag : 0);
	return (h == 3 ? false : true);

};

/**
 * 残業申請／早朝勤務申請を追加できるか
 *
 * @param {boolean} flag  false:残業申請 true:早朝勤務申請
 * @return {boolean} true:できる
 */
teasp.data.EmpDay.prototype.canSelectZangyo = function(flag){
	if(this.day.interim){ //「承認されるまで時間入力を禁止」の設定で、振替申請の承認待ちなので、申請不可
		return false;
	}
	var h = (this.day.rack.holidayJoin ? this.day.rack.holidayJoin.flag : 0);
	if(h == 3){
		return false;
	}
	if(!flag && !(this.parent.getUseOverTimeFlag() & 4) && this.isExistApply(teasp.constant.APPLY_KEY_ZANGYO)){ // 複数申請可かつすでに残業申請済み
		return false;
	}
	if(flag && !(this.parent.getUseEarlyWorkFlag() & 4) && this.isExistApply(teasp.constant.APPLY_KEY_EARLYSTART)){ // 複数申請可かつすでに早朝勤務申請済み
		return false;
	}
	if(!this.isHoliday() && !this.day.plannedHoliday){ // 平日である
		return true;
	}else{
		return (this.day.rack.validApplys.kyushtu.length > 0);
	}
};

/**
 * 振替申請がないか、振替申請が成立しているか
 *
 * @return {boolean} true:ない or 成立
 */
teasp.data.EmpDay.prototype.isReliableDate = function(){
	if(this.parent.isProhibitInputTimeUntilApproved()){ // 「承認されるまで時間入力を禁止」
		var exchangeS = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_EXCHANGES);
		var exchangeE = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_EXCHANGEE);
		if((exchangeS && !teasp.constant.STATUS_APPROVES.contains(exchangeS.status))
		|| (exchangeE && !teasp.constant.STATUS_APPROVES.contains(exchangeE.status))){
			return false;
		}
	}
	return true;
};

/**
 * 休日出勤申請を追加できるか
 *
 * @return {boolean} true:できる
 */
teasp.data.EmpDay.prototype.canSelectKyushtu = function(){
	if(this.day.interim){ //「承認されるまで時間入力を禁止」の設定で、振替申請の承認待ちなので、申請不可
		return false;
	}
	if(!this.isHoliday() && !this.day.plannedHoliday){ // 平日である
		return false;
	}
	if(!(this.parent.getUseHolidayWorkFlag() & 4) && this.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)){ // 複数申請不可かつすでに申請済み
		return false;
	}
	var h = (this.day.rack.holidayJoin ? this.day.rack.holidayJoin.flag : 0);
	if(h == 3){
		return false;
	}
	return this.isReliableDate();
};

/**
 * 振替申請を追加できるか
 *
 * @return {boolean} true:できる
 */
teasp.data.EmpDay.prototype.canSelectExchange = function(){
	if(this.day.interim){ //「承認されるまで時間入力を禁止」の設定で、振替申請の承認待ちなので、申請不可
		return false;
	}
	if(this.day.plannedHoliday){ // 有給計画付与日は振替不可
		return false;
	}
	if(this.day.rack.validApplys.exchangeS // 振替元として振替を申請済み
	|| this.day.rack.validApplys.direct) { // 直行・直帰申請を申請済み
		return false;
	}
	var exchangeE = this.day.rack.validApplys.exchangeE;
	if(exchangeE && !teasp.constant.STATUS_APPROVES.contains(exchangeE.status)) { // 振替を申請済み(振替先)かつ承認済みでない
		return false;
	}
	var holy = (this.day.rack.holidayJoin ? this.day.rack.holidayJoin.flag : 0);
	var holyTimes = this.day.rack.validApplys.holidayTime;
	if(!this.isHoliday()){ // 平日かつ休暇を申請済み
		if(holy || (holyTimes && holyTimes.length > 0)){
			return false;
		}
	}else if(holy && this.day.rack.holidayJoin.displayDaysOnCalendar){ // 休日かつ暦日休暇を申請済み
		return false;
	}
	if(this.isHoliday() && this.getEmpApplyByKey(teasp.constant.APPLY_KEY_KYUSHTU)){ // 休日かつ休日出勤申請あり
		return false;
	}
	return this.isReliableDate();
};

/**
 * 勤務時間変更(長期)申請を追加できるか
 *
 * @return {boolean} true:できる
 */
teasp.data.EmpDay.prototype.canSelectPatternL = function(){
	if(this.isHoliday()){ // 平日ではない
		return false;
	}
	if(this.day.plannedHoliday && !this.day.rack.validApplys.kyushtu.length){
		return false;
	}
	var h = (this.day.rack.holidayJoin ? this.day.rack.holidayJoin.flag : 0);
	if(h != 0){ // 休暇を申請済み
		return false;
	}
	return true;
};

/**
 * 勤務時間変更(短期)申請を追加できるか
 *
 * @return {boolean} true:できる
 */
teasp.data.EmpDay.prototype.canSelectPatternS = function(){
//    if(this.day.dayType != teasp.constant.DAY_TYPE_NORMAL){ // 平日ではない
//        return false;
//    }
	if(this.day.plannedHoliday && !this.day.rack.validApplys.kyushtu.length){
		return false;
	}
	var h = (this.day.rack.holidayJoin ? this.day.rack.holidayJoin.flag : 0);
	if(h != 0){ // 休暇を申請済み
		return false;
	}
	return true;
};

/**
 * 遅刻申請を追加できるか
 *
 * @return {boolean} true:できる
 */
teasp.data.EmpDay.prototype.canSelectLateStart = function(){
	if(this.day.interim){ //「承認されるまで時間入力を禁止」の設定で、振替申請の承認待ちなので、申請不可
		return false;
	}
	var h = (this.day.rack.holidayJoin ? this.day.rack.holidayJoin.flag : 0);
	if(h == 3){
		return false;
	}
	if(this.getBorderTime().st < 0){ // 遅刻の境界値がないので遅刻申請不要
		return false;
	}
	if(this.isExistApply(teasp.constant.APPLY_KEY_LATESTART)){ // すでに遅刻申請済み
		return false;
	}
	if(!this.isHoliday() && !this.day.plannedHoliday){ // 平日である
		return true;
	}else if(this.day.plannedHoliday && this.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)){ // 有休計画付与日かつ休日出勤申請あり
		return true;
	}else if(this.parent.isRegulateHoliday(this.day.date)){
		return true;
	}else{
		return false;
	}
};

/**
 * 早退申請を追加できるか
 *
 * @return {boolean} true:できる
 */
teasp.data.EmpDay.prototype.canSelectEarlyEnd = function(){
	if(this.day.interim){ //「承認されるまで時間入力を禁止」の設定で、振替申請の承認待ちなので、申請不可
		return false;
	}
	var h = (this.day.rack.holidayJoin ? this.day.rack.holidayJoin.flag : 0);
	if(h == 3){
		return false;
	}
	if(this.getBorderTime().et < 0){ // 早退の境界値がないので早退申請不要
		return false;
	}
	if(this.isExistApply(teasp.constant.APPLY_KEY_EARLYEND)){ // すでに早退申請済み
		return false;
	}
	if(!this.isHoliday() && !this.day.plannedHoliday){ // 平日である
		return true;
	}else if(this.day.plannedHoliday && this.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)){ // 有休計画付与日かつ休日出勤申請あり
		return true;
	}else if(this.parent.isRegulateHoliday(this.day.date)){
		return true;
	}else{
		return false;
	}
};

/**
 * 日次確定申請を追加できるか
 *
 * @param {number} level 1:承認待ちか却下申請があれば false を返す。2:退社時刻未入力は可とする。 3:出退社時刻未入力は可とする。
 * @param {Object} timeIn null:休日出勤申請ありかつ出退社未入力はエラーにする。
 * @return {Object} flagとreason要素を持つオブジェクト（flagは可否、reasonは否の理由）
 */
teasp.data.EmpDay.prototype.canSelectDailyEx = function(level, timeIn, reasonSet){
	if(this.day.interim){ //「承認されるまで時間入力を禁止」の設定で、振替申請の承認待ちなので、申請不可
		return false;
	}
	if(this.parent.isInputAccessControl()){ // 入退館管理機能対象である
		if(this.isDivergeBeforeJudge()){
			return { flag: false, reason: teasp.message.getLabel('ac00000480'), pending:true }; // 乖離判定前のため日次確定できません。
		}
		if(this.isDivergeNoReason(reasonSet)){
			return { flag: false, reason: teasp.message.getLabel('ac00000470') }; // 乖離が発生しているため日次確定ができません。乖離理由を入力してください。
		}
	}
	if(level != 3){
		var deficit = this.getDeficit(level);
		if(deficit.ng){
			return { flag: false, reason: teasp.message.getLabel('ci00001030' // {0}が不正です。
					, teasp.message.getLabel('startEndTime_label')) }; // 出退社時刻
		}
		if(deficit.empty){
			return { flag: false, reason: teasp.message.getLabel('tk10005430'  // {0}が未入力のため、日次確定できません。
					, teasp.message.getLabel(deficit.empty == 1 ? 'startTime_label' : (deficit.empty == 2 ? 'endTime_label' : 'startEndTime_label'))) };
		}
		if(deficit.entered && !this.day.workLocationId && this.parent.isRequireWorkLocation()){
			return { flag: false, reason: teasp.message.getLabel('tk10005430'  // {0}が未入力のため、日次確定できません。
					, teasp.message.getLabel('tw00000010')) }; // 勤務場所
		}
		if(level == 1 && !deficit.entered && this.day.workLocationId){ // 出退社未入力かつ勤務場所入力済み
			return { flag: false, reason: teasp.message.getLabel('tw00000310') }; // 出退社時刻未入力のまま日次確定する場合は勤務場所をクリアしてください。
		}
	}

	if(this.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU) && !timeIn && !this.isWorked() && this.parent.isUseDaiqManage()){
		return { flag: false, reason: teasp.message.getLabel('tm10003830') }; // 出退時刻未入力のため、日次確定できません。
	}
	var dayType = this.day.dayType;
	if(dayType != teasp.constant.DAY_TYPE_NORMAL
	&& this.isInputTime()
	&& !this.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)
	&& !this.day.workFlag
	&& !this.day.autoLH){
		return { flag: false, reason: teasp.message.getLabel('tm10003620') }; // 休日の労働時間は休日出勤申請がなければ無効です。
	}
	if(this.isExistNotEnterReviseTime()){
		return { flag: false, reason: teasp.message.getLabel('tf10007930') }; // 勤怠時刻修正申請が反映されてないため、日次確定できません。
	}
	if(level){
		var lst = this.getEmpApplyList('ALL_WAIT');
		var cnt = 0;
		for(var i = 0 ; i < lst.length ; i++){
			if(lst[i].applyType != teasp.constant.APPLY_TYPE_DAILY){
				cnt++;
			}
		}
		if(cnt > 0){
			return { flag: false, reason: teasp.message.getLabel('tm10001080') }; // \n承認待ちの申請あるいは却下を承諾していない申請があります。
		}
	}
	if(this.day.rack && this.day.rack.holidayJoin && this.day.rack.holidayJoin.flag == 3){ // 終日休暇
		return { flag: false, hidden: true, reason: teasp.message.getLabel('tk10005340') };
	}
	if(!this.isInputable()){
		return { flag: false, hidden: true, reason: '' };
	}

	if(level != 3 && level != 2){
		var reasons = [];
		// 残業申請・早朝勤務申請必須チェック
		var disc = this.getDiscretionaryLevel();
		var otrt = this.parent.getOverTimeRequireTime(disc);  // 無申請残業時間の境界時間
		var ewrt = this.parent.getEarlyWorkRequireTime(disc); // 無申請早朝勤務時間の境界時間
		var svz = this.getMissingOverTime(otrt);
		var sve = this.getMissingEarlyWork(ewrt);
		var ecnt = 0;
		if(svz > 0){
			reasons.push(teasp.message.getLabel('tf10008740', teasp.message.getLabel('tm10001293'))); // 残業申請してください
			if(this.isExistApply(teasp.constant.APPLY_KEY_ZANGYO)){ // 残業申請はある
				ecnt++;
			}
		}
		if(sve > 0){
			reasons.push(teasp.message.getLabel('tf10008740', teasp.message.getLabel('tm10001294'))); // 早朝勤務申請してください
			if(this.isExistApply(teasp.constant.APPLY_KEY_EARLYSTART)){ // 早朝勤務申請はある
				ecnt++;
			}
		}
		if(ecnt > 0){
			reasons.push(teasp.message.getLabel('tf10008760')); // （申請なしで勤務した時間がないようにしてください）
		}
		// 遅刻申請・早退申請必須チェック
		if(this.parent.isRequiredLateStartApply() && this.isMissingLateStartApply()){
			reasons.push(teasp.message.getLabel('tf10008740', teasp.message.getLabel('applyLateStart_label'))); // 遅刻申請してください
		}
		if(this.parent.isRequiredEarlyEndApply() && this.isMissingEarlyEndApply()){
			reasons.push(teasp.message.getLabel('tf10008740', teasp.message.getLabel('applyEarlyEnd_label'))); // 早退申請してください
		}
		if(reasons.length){
			reasons.unshift(teasp.message.getLabel('tf10008750')); // 日次確定できません
			return { flag:false, active:true, reason:reasons.join('\n') };
		}
	}

	var iv = this.parent.getInvalidApplysOfDay(this.day.date, true, timeIn);
	if(iv.length > 0){
		var l = [];
		var lmax = 2;
		for(var i = 0 ; i < iv.length ; i++){
			if(i >= lmax){
				continue;
			}
			l.push(iv[i].text);
		}
		if(iv.length > lmax){
			l[l.length - 1] += '..';
		}
		return { flag: false, reason: l.join('<br/>') };
	}
	// 「控除のある日は備考必須にする」「打刻なしは備考必須にする」で引っかかる場合
	var warn = this.getDayNoteWarning(timeIn);
	if(warn){
		return { flag: false, reason: warn };
	}
	return { flag: true };
};

/**
 * 勤怠時刻修正申請できるか
 *
 * @return {boolean} true:できる
 */
teasp.data.EmpDay.prototype.canSelectReviseTime = function(){
	var as = this.getApplyStatus(teasp.constant.APPLY_KEY_REVISETIME);
	if(as == teasp.constant.STATUS_WAIT){ // 別の勤怠時刻修正申請が承認待ち
		return false;
	}
	if(this.isInputTime()){ // 出退時刻どちらか入力済みの場合は常にできる
		return true;
	}
	if(this.day.interim){ //「承認されるまで時間入力を禁止」の設定で、振替申請の承認待ちなので、申請不可
		return false;
	}
	var h = (this.day.rack.holidayJoin ? this.day.rack.holidayJoin.flag : 0);
	if(h == 3){
		return false;
	}
	if(!this.isHoliday() && !this.day.plannedHoliday){ // 平日である
		return this.isReliableDate();
	}else if(this.day.rack.validApplys.kyushtu.length > 0){
		return this.isReliableDate();
	}else{
		return false;
	}
};

/**
 * 直行・直帰申請を追加できるか
 *
 * @return {boolean} true:できる
 */
teasp.data.EmpDay.prototype.canSelectDirect = function(){
	if(this.day.interim){ //「承認されるまで時間入力を禁止」の設定で、振替申請の承認待ちなので、申請不可
		return false;
	}
	if(typeof(this.day[teasp.constant.C_REAL].startTime) == 'number'
	&& typeof(this.day[teasp.constant.C_REAL].endTime  ) == 'number'){
		return false; // 出退社時刻とも入力済みの場合は申請不可
	}
	var robj = this.existWaitReviseTime();
	if(robj && typeof(robj.from) == 'number' && typeof(robj.to) == 'number'){ // 承認待ちの勤怠時刻修正申請があり、出社時刻・退社時刻とも更新される可能性がある
		return false;
	}
	var h = (this.day.rack.holidayJoin ? this.day.rack.holidayJoin.flag : 0);
	if(h == 3){
		return false;
	}
	if(this.isExistApply(teasp.constant.APPLY_KEY_DIRECT)){ // 直行・直帰申請が既に申請されている
		return false;
	}
	if(!this.isHoliday() && !this.day.plannedHoliday){ // 平日である
		return true;
	}else{
		return false;
	}
};

/**
 * 【勤怠】取消できるか
 *
 * @return {number} 0:不可  1:可（ステータス≠承認済み）  2:可（ステータス＝承認済み）  3:可（ステータス＝確定済み） -1:可（ステータス＝却下）
 */
teasp.data.EmpDay.prototype.canCancelDayApply  = function(applyObj){
	if(applyObj.applyType == teasp.constant.APPLY_TYPE_REVISETIME){
		var l = this.day.rack.validApplys.reviseTime;
		if(l.length > 0 && l[0].id != applyObj.id && !teasp.constant.STATUS_NEGATIVE.contains(applyObj.status)){
			return 0;
		}
	}
	if(!teasp.constant.STATUS_APPROVES.contains(applyObj.status)){
		if(teasp.constant.STATUS_REJECTS.contains(applyObj.status)){
			return -1;
		}else{
			return 1;
		}
	}
	if(this.parent.canCancelDayApply()){
		return (applyObj.status == teasp.constant.STATUS_ADMIT ? 3 : 2);
	}
	return 0;
};

/**
 * 残業申請または休日出勤申請する際のデフォルトの開始・終了時刻を得る
 *
 * @param {boolean=} flag trueなら休日出勤申請
 * @param {number=} overTimeBorderTime >0の場合、残業申請を必要とする時刻
 * @param {number=} useOverTimeFlag 0x8 の bit がオンの場合、所定勤務時間に達するまでは申請なしでも認める
 * @return {Object} 開始・終了時刻を格納したオブジェクト
 */
teasp.data.EmpDay.prototype.getDefaultZangyoRange = function(flag, overTimeBorderTime, useOverTimeFlag){
	var o = {
		from    : null, // デフォルトの開始時刻
		to      : null, // デフォルトの終了時刻
		bdrTime : null, // 残業申請を必要とする境界時刻
		bdrFlag : (useOverTimeFlag !== undefined && (useOverTimeFlag & 8) ? true : false) // trueなら所定勤務時間に達するまでは申請なしでも認める
	};
	if(flag){ // 休日出勤申請
		o.from = (this.day.rack.shiftStartTime || this.day.pattern.stdStartTime);
		o.to   = (this.day.rack.shiftEndTime   || this.day.pattern.stdEndTime);
		return o;
	}
	if(this.day.rack.validApplys.kyushtu.length > 0 && !this.day.plannedHoliday){ // 休日出勤申請済み
		o.from = (this.day.rack.shiftEndTime || this.day.pattern.stdEndTime);
		o.to = o.from + 120;
		o.bdrTime = o.from;
	}else if(!this.isHoliday()){
		if(this.day.notify){
			o.from = this.day.notify.endTime;
			o.to   = o.from + 120;
		}else{
			o.from = (this.day.rack.shiftEndTime || this.day.pattern.stdEndTime);
			o.to   = o.from + 120;
		}
		if(typeof(overTimeBorderTime) == 'number' && overTimeBorderTime > 0 && o.from < overTimeBorderTime){
			o.bdrTime = overTimeBorderTime;
			if(this.parent.isDefaultIsBorderTime(1) // 残業申請・早朝勤務申請の開始・終了時刻のデフォルト値をフレックス時間帯の境界とする＝オン
			&& this.day.rack.flexFlag              // フレックスタイム制
			&& (useOverTimeFlag & 2)               // 申請の時間帯以外の勤務は認めない＝オン
			&& o.from < o.bdrTime                  // 開始時刻が境界時刻より前
			){
				o.from = o.bdrTime; // 開始時刻のデフォルト値を境界時刻にする
				o.to   = o.from + 120;
			}
		}else{
			o.bdrTime = o.from;
		}
	}
	if(o.to > 2880){
		o.to = 2880;
	}
	return o;
};

/**
 * 早朝勤務申請のデフォルトの開始・終了時刻を得る
 *
 * @param {number=} earlyWorkBorderTime >0の場合、早朝勤務申請を必要とする時刻
 * @param {number=} useEarlyWorkFlag 0x8 の bit がオンの場合、所定勤務時間に達するまでは申請なしでも認める
 * @return {Object} 開始・終了時刻を格納したオブジェクト
 */
teasp.data.EmpDay.prototype.getDefaultEarlyStartRange = function(earlyWorkBorderTime, useEarlyWorkFlag){
	var o = {
		from    : null,
		to      : null,
		bdrTime : null,
		bdrFlag : (useEarlyWorkFlag !== undefined && (useEarlyWorkFlag & 8) ? true : false) // trueなら所定勤務時間に達するまでは申請なしでも認める
	};
	if(this.day.rack.validApplys.kyushtu.length > 0 && !this.day.plannedHoliday){ // 休日出勤申請済み
		o.to = (this.day.rack.shiftStartTime || this.day.pattern.stdStartTime);
		o.bdrTime = o.to;
	}else if(!this.isHoliday()){
		if(this.day.notify){
			o.to   = this.day.notify.startTime;
		}else{
			o.to = (this.day.rack.shiftStartTime || this.day.pattern.stdStartTime);
		}
		if(typeof(earlyWorkBorderTime) == 'number' && earlyWorkBorderTime >= 0 && earlyWorkBorderTime < o.to){
			o.bdrTime = earlyWorkBorderTime;
			if(this.parent.isDefaultIsBorderTime(2) // 残業申請・早朝勤務申請の開始・終了時刻のデフォルト値をフレックス時間帯の境界とする＝オン
			&& this.day.rack.flexFlag              // フレックスタイム制
			&& (useEarlyWorkFlag & 2)              // 申請の時間帯以外の勤務は認めない＝オン
			&& o.bdrTime < o.to                    // 終了時刻が境界時刻より後
			){
				o.to = o.bdrTime; // 終了時刻のデフォルト値を境界時刻にする
			}
		}else{
			o.bdrTime = o.to;
		}
	}
	o.from = o.to - 60;
	if(o.from < 0){
		o.from = 0;
	}
	return o;
};

/**
 * みなし労働表示レベル
 *
 * @return {number} レベル
 *     <ul>
 *     <li>0・・勤務パターンが裁量労働ではない</li>
 *     <li>1・・勤務パターンが裁量労働かつ平日</li>
 *     <li>2・・勤務パターンが裁量労働かつ休日</li>
 *     <li>-1・・勤務パターンが裁量労働かつ平日かつシステム設定で「裁量労働で実労働時間表示」に設定</li>
 *     <li>-2・・勤務パターンが裁量労働かつ休日かつシステム設定で「裁量労働で実労働時間表示」に設定</li>
 *     </ul>
 */
teasp.data.EmpDay.prototype.getDiscretionaryLevel = function(){
	var flg = this.dataObj.common.discretionaryOption;
	if(this.day.pattern.useDiscretionary){
		if(this.isHoliday() || this.day.plannedHoliday){
			return 2 * (flg ? (-1) : 1);
		}else{
			return 1 * (flg ? (-1) : 1);
		}
	}
	return 0;
};

/**
 * 出退社時刻入力可能な範囲を返す。
 *     <ul>
 *     <li>午前半休申請済みなら午前半休適用終了時刻～４８時</li>
 *     <li>午後半休申請済みなら０時～午後半休適用開始時刻</li>
 *     <li>終日休申請済みならNULL</li>
 *     <li>それ以外は０時～４８時</li>
 *     </ul>
 * @param {Array.<Object>=} rests 休憩時間
 * @return {?Object} 開始・終了時刻を格納したオブジェクト。nullの場合は終日休申請済み
 */
teasp.data.EmpDay.prototype.getInputTimeRange = function(rests){
	var flag = (this.day.rack.holidayJoin ? this.day.rack.holidayJoin.flag : 0);
	if(flag == 3){
		return null;
	}
	var o = { from: 0, to: 2880 };
	if(!flag || this.isFlexHalfDayTimeDay()){
		return o;
	}
	if(flag == 1){
		o.from = this.day.pattern.amHolidayEndTime;
	}else{
		o.to = this.day.pattern.pmHolidayStartTime;
	}
	if(this.parent.isProhibitBorderRestTime()){ // 出社・退社時刻を含む休憩＝入力不可
		o.rests = (rests ? rests : this.day.pattern.restTimes) || [];
		return teasp.logic.EmpTime.adjustInputTime(o, (flag == 1 ? 1 : 2));
	}
	return o;
};

teasp.data.EmpDay.prototype.getTimeHolidaySpans = function(){
	var hs = [];
	var tt = this.day.timeTable || [];
	for(var i = 0 ; i < tt.length ; i++){
		var t = tt[i];
		if(t.type == teasp.constant.REST_PAY){
			hs.push(t);
		}
	}
	return hs;
};

/**
 * 休憩を所定休憩、任意休憩、時間単位有休に分けて返す
 * @param {Object=} pattern 勤務パターン
 * @returns {Object}
 */
teasp.data.EmpDay.prototype.getSeparatedRests = function(pattern){
	var rests = { fix:[], free:[], paid:[], unpaid:[] };
	var p = pattern || this.day.pattern;
	var tt = this.day.timeTable || [];
	for(var i = 0 ; i < tt.length ; i++){
		var t = tt[i];
		if(t.type != teasp.constant.REST_FIX
		&& t.type != teasp.constant.REST_FREE
		&& t.type != teasp.constant.REST_PAY
		&& t.type != teasp.constant.REST_UNPAY){
			continue;
		}
		if(t.type == teasp.constant.REST_PAY){
			rests.paid.push(t);
		}else if(t.type == teasp.constant.REST_UNPAY){
			rests.unpaid.push(t);
		}else if(teasp.logic.EmpTime.isFixRest(t, p.restTimes)){
			rests.fix.push(t);
		}else{
			rests.free.push(t);
		}
	}
	if(!this.isInputTime()){
		// 出退社時刻＝未入力の場合、timeTable には時間単位有休以外の情報は
		// セットされてない仕様なので、所定休憩と任意休憩の値をリセットする
		rests.fix = p.restTimes || [];
		rests.free = [];
	}
	return rests;
};

/**
 * 出退社時刻と休暇申請の休暇範囲との矛盾をチェック
 *
 * @return {number}
 *     <table>
 *     <tr><td>-1</td><td>エラー        </td></tr>
 *     <tr><td> 0</td><td>重複なし      </td></tr>
 *     <tr><td> 1</td><td>出社時刻が重複</td></tr>
 *     <tr><td> 2</td><td>退社時刻が重複</td></tr>
 *     </table>
 */
teasp.data.EmpDay.prototype.checkInconsistent = function(range, pattern, diff){
	var calcType = teasp.constant.C_REAL;
	var st = (typeof(this.day[calcType].startTime) == 'number' ? this.day[calcType].startTime : -1);
	var et = (typeof(this.day[calcType].endTime  ) == 'number' ? this.day[calcType].endTime   : -1);
	var hs = this.getTimeHolidaySpans();
	if(((st < 0 && et < 0) || (et >= 0 && st > et)) && !hs.length){
		return 0; // 重複なし
	}
	var p = pattern || this.day.pattern;
	var n = diff || 0;
	var am = { from: p.amHolidayStartTime + n, to: p.amHolidayEndTime + n };
	var pm = { from: p.pmHolidayStartTime + n, to: p.pmHolidayEndTime + n };
	var fm = { from: p.stdStartTime + n      , to: p.stdEndTime + n       };
	if(range == teasp.constant.RANGE_AM){ // 午前半休
		if(et >= 0 && et <= am.to){ // 午前半休の終了時間以前に退社
			return -1; // エラー
		}
		if(st >= 0){ // 出社時刻入力済み
			if(st >= am.to){ // 午前半休の終了時刻以降に出社
				return 0; // 重複なし
			}
			// 午前半休の終了時刻より前に出社
			return 1; // 出社時刻が重複
		}
		if(hs.length){
			if(teasp.util.time.rangeTime(am, hs) > 0){ // 時間単位有休と午前半休が重なる
				return -2;
			}
		}
	}else if(range == teasp.constant.RANGE_PM) { // 午後半休
		if(st >= 0 && st >= pm.from){ // 午後半休の開始時間以降に出社
			return -1; // エラー
		}
		if(et >= 0){ // 退社時刻入力済み
			if(et <= pm.from){ // 午後半休の開始時刻以前に退社
				return 0; // 重複なし
			}
			// 午後半休の開始時刻より後に退社
			return 2; // 退社時刻が重複
		}
		if(hs.length){
			if(teasp.util.time.rangeTime(pm, hs) > 0){ // 時間単位有休と午後半休が重なる
				return -2;
			}
		}
	}else if(range == teasp.constant.RANGE_ALL){
		return -1; // 終日休のため打刻無効
	}
	if(hs.length){
		var xhs = teasp.util.time.excludeRanges(hs, [fm]);
		if(xhs.length){ // 時間単位有休が所定勤務時間外にある
			return -3;
		}
		var rests = this.getSeparatedRests(p); // 分類済みの休憩リスト
		for(var i = 0 ; i < hs.length ; i++){
			if(teasp.util.time.rangeTime(hs[0], rests.free) > 0){ // 時間単位有休と任意休憩が重なる
				return -4;
			}
		}
	}
	return 0; // 重複なし
};

/**
 * 労働時間範囲と休憩時間の配列を返す
 *
 * @return {?Object}
 *     <ul>
 *     <li>出退時刻入力済み・・出退時刻と入力された休憩時間を格納したオブジェクト</li>
 *     <li>出退時刻未入力・・所定の始業終業時刻、休憩時間を格納したオブジェクト</li>
 *     </ul>※半休申請済みの場合は半休適用範囲外の時刻に調整される。
 */
teasp.data.EmpDay.prototype.getValidTimeList = function(){
	var o = {
		from  : this.day.rack.startTimeEx,
		to    : this.day.rack.endTimeEx,
		rests : [],
		workable: {
			from: 0,
			to  : 2880
		},
		border: {
			from: Math.max((this.getFixStartTime() || 0) - (4 * 60) , 0),
			to  : Math.max((this.getFixStartTime() || 0) + (20 * 60), 1440)
		}
	};
	if(o.from === null && o.to === null){
		var holidayTimes = [];
		dojo.forEach(this.day.rack.validApplys.holidayTime || [], function(ht){
			holidayTimes.push({ from: ht.startTime, to: ht.endTime });
		});
		o.rests = teasp.util.time.margeTimeSpans(holidayTimes.concat(this.day.pattern.restTimes));
	}else{
		var timeTable = (this.day.timeTable || []);
		for(var i = 0 ; i < timeTable.length ; i++){
			var t = timeTable[i];
			if(t.type == teasp.constant.REST_FIX
			|| t.type == teasp.constant.REST_FREE
			|| t.type == teasp.constant.REST_PAY
			|| t.type == teasp.constant.REST_UNPAY){
				o.rests.push(t);
			}
		}
	}
	if(this.day.rack.validApplys.holidayAm){
		o.workable.from = this.day.pattern.amHolidayEndTime;
	}else if(this.day.rack.validApplys.holidayPm){
		o.workable.to = this.day.pattern.pmHolidayStartTime;
	}
	return o;
};

/**
 * 休憩時間をマージする
 *
 * @param {Array.<Object>} rests マージ元の休憩時間の配列
 * @param {Object} rest マージする休憩時間
 */
teasp.data.EmpDay.prototype.mergeRests = function(rests, rest){
	var timeTable = (this.day.timeTable || []);
	rest.type = null;
	for(var i = 0 ; i < timeTable.length ; i++){
		var t = timeTable[i];
		if((t.type == teasp.constant.REST_FIX || t.type == teasp.constant.REST_FREE || t.type == teasp.constant.REST_PAY || t.type == teasp.constant.REST_UNPAY)
		&& rest.from == t.from && rest.to == t.to){
			rest.type = t.type;
			break;
		}
	}
	if(!rest.type){
		for(var i = 0 ; i < this.day.pattern.restTimes.length ; i++){
			var rt = this.day.pattern.restTimes[i];
			if(rest.from == rt.from && rest.to == rt.to){
				rest.type = teasp.constant.REST_FIX;
				break;
			}
		}
		if(!rest.type){
			rest.type = teasp.constant.REST_FREE;
		}
	}
	rests.push(rest);
};

/**
 * 日次の警告メッセージを返す。
 * システム設定の「控除のある日は備考必須にする」「打刻なしは備考必須にする」がオンの場合に
 * あてはまることがあればメッセージを作成する。
 *
 * @param {Object=} timeIn ありなら 退社時刻24時超えのチェックを行わない
 * @return {string|null} メッセージ
 */
teasp.data.EmpDay.prototype.getDayNoteWarning = function(timeIn){
	var calcType = (this.day.pattern.useDiscretionary ? teasp.constant.C_DISC : teasp.constant.C_REAL);
	var warn1 = null, warn2 = null;
	var note = this.getDayNote(!this.parent.isSeparateDailyNote());
	if(this.dataObj.common.commentIfNoPushTime
	&& !note
	&& (this.day.deco.ct.st < 0 || this.day.deco.ct.et < 0)){
		if(this.day.deco.ct.st >= -1 && this.day.deco.ct.et >= -1){
			warn1 = teasp.message.getLabel('tm10001400'); // 打刻できなかった理由
		}else{
			warn1 = teasp.message.getLabel('tm10001410'); // 打刻時刻と入力時刻が異なる理由
		}
	}
	if(this.dataObj.common.commentIfAbsence
	&& !note
	&& this.day[calcType]
	&& (this.day[calcType].lateLostTime > 0 || this.day[calcType].earlyLostTime > 0 || this.day[calcType].privateInnerLostTime > 0)){
		warn2 = '';
		if(this.day[calcType].lateLostTime > 0){
			warn2 += teasp.message.getLabel('tm10001420'); // 遅刻
		}
		if(this.day[calcType].earlyLostTime > 0){
			warn2 += (warn2 != '' ? teasp.message.getLabel('tm10001570') : '') + teasp.message.getLabel('tm10001430'); // 早退
		}
		if(this.day[calcType].privateInnerLostTime > 0){
			warn2 += (warn2 != '' ? teasp.message.getLabel('tm10001570') : '') + teasp.message.getLabel('tm10001440'); // 私用外出
		}
		warn2 += teasp.message.getLabel('tm10001450'); // 理由
	}
	var msgs = [];
	if(warn1 || warn2){
		msgs.push(teasp.message.getLabel('tm10001600', teasp.util.date.formatDate(this.day.rack.key, 'M/d'), (warn2 || warn1))); // {0}の備考欄へ{1}を入力してください。
	}
	if(!timeIn && this.day.deco.prohibitOverNightWork){
		msgs.push(this.day.deco.prohibitOverNightWork);
	}
	return (msgs.length ? msgs.join('\n') : null);
};
/**
 * @return {string}
 */
teasp.data.EmpDay.prototype.getCalendarEvent = function(){
	var s = (this.day.event  || '');
	var yqk = teasp.message.getLabel('tm10001360'); // 有休計画付与日
	if(this.day.plannedHoliday && s.indexOf(yqk) < 0){
		s = (s ? s + teasp.message.getLabel('tm10001540') : '') + yqk; // 、
	}
	return s;
};

/**
 * 月次サマリーのイベント／勤務状況欄に出力する文字列を返す
 *     <ul>
 *     <li>振替</li>
 *     <li>イベント名（祝日名を含む）</li>
 *     <li>有休計画付与日</li>
 *     <li>休暇の場合、休暇名</li>
 *     <li>休日出勤（出退未入力の時は語尾に"予定"と追加）</li>
 *     <li>時間有休(Nh)</li>
 *     </ul>
 * @return {string} 文字列
 */
teasp.data.EmpDay.prototype.getDayEvent = function(){
	var yqk = teasp.message.getLabel('tm10001360'); // 有休計画付与日
	var bufs = [];
	var va = this.day.rack.validApplys;
	// 振替申請
	var ep = (va.exchangeS || va.exchangeE);
	if(ep){
		bufs.push(teasp.message.getLabel(((va.exchangeS && va.exchangeE) ? 'tk10004390' : 'tm10001610')
				, teasp.util.date.formatDate((va.exchangeS ? va.exchangeS.exchangeDate : ep.originalStartDate), 'M/d'))); // 振替
	}
	var buf = (this.day.event || '');
	if(buf.length > 0){
		bufs.push(buf);
	}
	if(this.day.plannedHoliday && (!this.day.event || this.day.event != yqk)){
		bufs.push(yqk);
	}
	// 申請情報を表示
	// 勤務時間変更申請
	var p = (va.patternS || va.patternL);
	if(p){
		bufs.push(teasp.message.getLabel('tm10001292', ((p.pattern && p.pattern.name) || '')));
	}
	if(va.patternD){
		bufs.push(teasp.message.getLabel('tm10001292', this.parent.getDisplayDayType(va.patternD.dayType))); // 勤務時間変更({0})
	}
	// 休暇申請
	if(va.holidayAll){ // 終日休
		bufs.push(teasp.message.getLabel('tm10001291', ((va.holidayAll && va.holidayAll.holiday.name) || '')));
	}
	if(va.holidayAm){ // 午前半休
		bufs.push(teasp.message.getLabel('tm10001291', ((va.holidayAm && va.holidayAm.holiday.name) || '')));
	}
	if(va.holidayPm && (!va.holidayAm || va.holidayAm.holiday.name != va.holidayPm.holiday.name)){ // 午後半休
		bufs.push(teasp.message.getLabel('tm10001291', ((va.holidayPm && va.holidayPm.holiday.name) || '')));
	}
	var shl = this.getSummaryOfHourlyLeave();
	if(shl){
		bufs.push(shl);
	}
	// 休日出勤申請
	if(va.kyushtu.length > 0){
		bufs.push(teasp.message.getLabel('tm10001390') // 休日出勤
					+ ((this.day.deco.ct.st || this.day.deco.ct.et) ? '' : teasp.message.getLabel('tm10001620'))); // 予定
	}
	// 残業申請
	if(va.zangyo.length > 0){
		bufs.push(teasp.message.getLabel('tm10001293'));
	}
	// 早朝勤務申請
	if(va.earlyStart.length > 0){
		bufs.push(teasp.message.getLabel('tm10001294'));
	}
	// 遅刻申請
	if(va.lateStart){
		bufs.push(teasp.message.getLabel('tk10001181', (!va.lateStart.treatDeduct ? '' : teasp.message.getLabel(va.lateStart.ownReason ? 'tk10001183' : 'tk10001184'))));
		if(this.day.real && this.day.real.latePlus){ // 遅刻
			bufs.push(teasp.message.getLabel('tm10001420'));
		}
	}else if(this.day.real && this.day.real.lateTime > 0){ // 遅刻カウントあり
		bufs.push(teasp.message.getLabel('tm10001420'));
	}
	// 早退申請
	if(va.earlyEnd){
		bufs.push(teasp.message.getLabel('tk10001182', (!va.earlyEnd.treatDeduct ? '' : teasp.message.getLabel(va.earlyEnd.ownReason ? 'tk10001183' : 'tk10001184'))));
		if(this.day.real && this.day.real.earlyPlus){ // 早退
			bufs.push(teasp.message.getLabel('tm10001430'));
		}
	}else if(this.day.real && this.day.real.earlyTime > 0){ // 早退カウントあり
		bufs.push(teasp.message.getLabel('tm10001430'));
	}
	// 日次確定申請
	if(va.dailyFix){
		bufs.push(teasp.message.getLabel('tm10001297'));
	}
	// 勤怠修正申請
	if(va.reviseTime.length > 0){
		bufs.push(teasp.message.getLabel('tm10001298'));
	}
	// 直行・直帰申請
	if(va.direct){
		var name = teasp.message.getLabel('tk10004650');
		if(va.direct.directFlag == 1){
			name = teasp.message.getLabel('tk10004760', teasp.message.getLabel('tk10004680'));
		}else if(va.direct.directFlag == 2){
			name = teasp.message.getLabel('tk10004760', teasp.message.getLabel('tk10004690'));
		}
		bufs.push(name);
	}
	// 勤務場所
	if(this.parent.isUseWorkLocation() && this.getWorkLocationName()
	&& this.parent.isAlive(this.getKey())
	&& (this.isInputTime() || this.isInputable())){
		bufs.push(this.getWorkLocationName());
	}
	return bufs.join(',');
};

/**
 * 出社時刻
 *
 * @param {boolean} flag 表示形式 =true:分のまま =false:設定に従い h:mm か #.00
 * @param {(string|number|null)=} defaultVal t の値が null の場合の代替値
 * @param {string=} calcType 'real'(実時刻) or 'disc'（裁量時刻）省略の場合は当日の勤務パターンの「裁量労働」の設定による
 * @param {boolean=} adjust =true:調整済みの時刻を返す
 * @return {string|number|null} 時間
 */
teasp.data.EmpDay.prototype.getStartTime = function(flag, defaultVal, calcType, adjust){
	if(!calcType){
		calcType = (this.day.pattern.useDiscretionary ? teasp.constant.C_DISC : teasp.constant.C_REAL);
	}
	if(!this.day[calcType]){
		return (defaultVal || null);
	}
	return this.parent.getDisplayTime((adjust ? this.day[calcType].calcStartTime : this.day[calcType].startTime), flag, defaultVal);
};

/**
 * 退社時刻
 *
 * @param {boolean} flag 表示形式 =true:分のまま =false:設定に従い h:mm か #.00
 * @param {(string|number|null)=} defaultVal t の値が null の場合の代替値
 * @param {string=} calcType 'real'(実時刻) or 'disc'（裁量時刻）省略の場合は当日の勤務パターンが裁量労働なら'disc'
 * @param {boolean=} adjust =true:調整済みの時刻を返す
 * @return {string|number|null} 時間
 */
teasp.data.EmpDay.prototype.getEndTime = function(flag, defaultVal, calcType, adjust){
	if(!calcType){
		calcType = (this.day.pattern.useDiscretionary ? teasp.constant.C_DISC : teasp.constant.C_REAL);
	}
	if(!this.day[calcType]){
		return (defaultVal || null);
	}
	return this.parent.getDisplayTime((adjust ? this.day[calcType].calcEndTime : this.day[calcType].endTime), flag, defaultVal);
};

teasp.data.EmpDay.prototype.getRealStartTime = function(){
	return (this.day[teasp.constant.C_REAL] && this.day[teasp.constant.C_REAL].startTime) || null;
};

teasp.data.EmpDay.prototype.getRealEndTime = function(){
	return (this.day[teasp.constant.C_REAL] && this.day[teasp.constant.C_REAL].endTime) || null;
};

/**
 * 指定キーの値を得る
 *
 * @param {string} key キー
 * @param {boolean} flag 表示形式 true:分のまま false:設定に従い h:mm か #.00
 * @param {(string|number)=} defaultVal t の値が null の場合の代替値
 * @param {(string|number|null)=} zeroVal t の値が 0 の場合の代替値（''が良いなら''を指定する）
 * @param {(string|null)=} calcType 'real'(実時刻) or 'disc'（裁量時刻）省略の場合は当日の勤務パターンが裁量労働なら'disc'
 * @return {string|number} 時間
 */
teasp.data.EmpDay.prototype.getDaySubTimeByKey = function(key, flag, defaultVal, zeroVal, calcType){
	if(!calcType){
		calcType = (this.day.pattern.useDiscretionary ? teasp.constant.C_DISC : teasp.constant.C_REAL);
	}
	if(!this.day[calcType]){
		return 0;
	}
	return this.parent.getDisplayTime(this.day[calcType][key], flag, defaultVal, zeroVal);
};

/**
 * 勤怠時刻リセット
 * 出退時刻をクリアして所定の休憩時間をセット
 *
 */
teasp.data.EmpDay.prototype.resetTime = function(){
	this.day.startTime = null;
	this.day.endTime   = null;
	this.day.timeTable = [];
	if(this.day.pattern){
		for(var i = 0 ; i < this.day.pattern.restTimes.length ; i++){
			var o = this.day.pattern.restTimes[i];
			this.day.timeTable.push({
				from : o.from,
				to   : o.to,
				type : teasp.constant.REST_FIX
			});
		}
	}
};

/**
 * 必要に応じて出退時刻を調整
 *
 * @param {string} range 終日休なら勤怠時刻リセット、
 *     半休の場合、半休適用時間にかかる時刻は適用開始時刻または終了時刻に合わせ調整。
 */
teasp.data.EmpDay.prototype.adjustTime = function(range){
	if(range == teasp.constant.RANGE_ALL){
		this.resetTime();
	}else{
		var p = this.day.pattern;
		if(range == teasp.constant.RANGE_AM){
			if(typeof(this.day.startTime) == 'number'
			&& typeof(p.amHolidayEndTime) == 'number'
			&& this.day.startTime < p.amHolidayEndTime){
				this.day.startTime = p.amHolidayEndTime;
				if(typeof(this.day.endTime) == 'number'
				&& this.day.startTime >= this.day.endTime){
					this.resetTime();
				}
			}
		}else if(range == teasp.constant.RANGE_PM){
			if(typeof(this.day.endTime) == 'number'
			&& typeof(p.pmHolidayStartTime) == 'number'
			&& this.day.endTime > p.pmHolidayStartTime){
				this.day.endTime = p.pmHolidayStartTime;
				if(typeof(this.day.startTime) == 'number'
				&& this.day.startTime >= this.day.endTime){
					this.resetTime();
				}
			}
		}
	}
};

/**
 * 休憩時間を得る<br/>
 * オプションにより、勤務時間外の休憩時間もカウントに加える。
 *
 * @param {boolean} flag 表示形式 true:分のまま false:設定に従い h:mm か #.00
 * @param {string|number} defaultVal t の値が null の場合の代替値
 * @param {string} zeroVal t の値が 0 の場合の代替値（''が良いなら''を指定する）
 * @param {string} calcType 'real'(実時刻) or 'disc'（裁量時刻）省略の場合は当日の勤務パターンが裁量労働なら'disc'
 * @return {string|number} 時間
 */
teasp.data.EmpDay.prototype.getRestTime = function(flag, defaultVal, zeroVal, calcType){
	if(!calcType){
		calcType = (this.day.pattern.useDiscretionary ? teasp.constant.C_DISC : teasp.constant.C_REAL);
	}
	var n = this.day[calcType].restTime;
	if(this.parent.isKeepExteriorTime()
	&& this.day.rack.worked
	&& this.day.rack.freeRests
	&& this.day.rack.freeRests.length > 0){
		var wrng = {
			from : (this.day[calcType].calcStartTime || this.day.startTime),
			to   : (this.day[calcType].calcEndTime || this.day.endTime)
		};
		var l = teasp.util.time.sliceTimes(this.day.rack.freeRests, wrng);
		if(l.length > 0){
			for(var i = 0 ; i < l.length ; i++){
				n += (l[i].to - l[i].from);
			}
		}
	}
	return this.parent.getDisplayTime(n, flag, defaultVal, zeroVal);
};

/**
 * 法定休憩時間のチェック
 *
 * @return {boolean}
 */
teasp.data.EmpDay.prototype.isRestLack = function(){
	return this.day.deco.restLack;
};

/**
 * 日次の情報
 *
 * @return {Object}
 */
teasp.data.EmpDay.prototype.getDaySummary = function(){
	var pattern = this.day.pattern;
	var o = {
	title          : ''
	, fixTimeTitle   : ''
	, fixTimeSpan    : ''
	, fixRestSpan    : null
	, holys          : []
	, st             : ''
	, et             : ''
	, rests          : ''
	, restSpan       : ''
	, aways          : ''
	, awaySpan       : ''
	, legalzan       : ''
	, legalout       : ''
	, legalext       : ''
	, hwrkTime       : ''
	, nightTime      : ''
	, restTime       : ''
	, awayTime       : ''
	, workFixTime    : ''
	, workWholeTime  : ''
	, workRealTime   : ''
	, discretionary : false
	};
	if(!this.isHoliday()){
		if(this.parent.getWorkSystem() == teasp.constant.WORK_SYSTEM_FIX || this.parent.getWorkSystem() == teasp.constant.WORK_SYSTEM_MUTATE){
			o.fixTimeTitle = teasp.message.getLabel('tm10001140'); // 所定勤務時間
		}else{
			o.fixTimeTitle = teasp.message.getLabel('tm10001150'); // 標準勤務時間
		}
		o.fixTimeSpan = teasp.util.time.timeValue(this.getFixStartTime()) + '-' + teasp.util.time.timeValue(this.getFixEndTime());

		if(this.parent.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX){
			if(pattern.id){ // 勤務パターン
				if(pattern.disableCoreTime){
					o.core = teasp.message.getLabel('tm10010150'); // なし
				}else{
					o.core = teasp.util.time.timeValue(this.getFixStartTime()) + '-' + teasp.util.time.timeValue(this.getFixEndTime());
					o.fixTimeSpan = teasp.util.time.timeValue(pattern.stdStartTime) + '-' + teasp.util.time.timeValue(pattern.stdEndTime);
				}
			}else{
				if(this.parent.getConfigObj().useCoreTime){
					o.core = teasp.util.time.timeValue(this.parent.getConfigObj().coreStartTime) + '-' + teasp.util.time.timeValue(this.parent.getConfigObj().coreEndTime);
				}else{
					o.core = null;
				}
			}
		}else{
			o.fixTimeSpan += ' ' + teasp.message.getLabel('tm10001680', teasp.util.time.timeValue(this.getFixTime()));
		}

		if(this.isPlannedHoliday()){
			o.title += teasp.message.getLabel('tm10001180'); // 有休計画付与日/
		}
		o.title += (pattern.name ? pattern.name.entitize() : teasp.message.getLabel('tm10001190')); // 標準の勤務時間
		if(pattern.useDiscretionary){
//            o.title += teasp.message.getLabel('tm10001160'); // （裁量労働）
			o.discretionary = true;
		}
	}else{
		o.fixTimeTitle = teasp.message.getLabel('tm10001200'); // 申請勤務時間
		if(this.day.rack.validApplys.kyushtu.length > 0){ // 休日出勤申請済み
			o.fixTimeSpan = teasp.util.time.timeValue(this.getFixStartTime()) + '-' + teasp.util.time.timeValue(this.getFixEndTime());
		}else{
			o.fixTimeSpan = '';
		}
		if(this.getDayType() == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){
			o.title += teasp.message.getLabel('legalHoliday_label');   // 法定休日
		}else if(this.getDayType() == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
			o.title += teasp.message.getLabel('publicHoliday_label');  // 祝日
		}else{
			o.title += teasp.message.getLabel('fixHoliday_label');     // 所定休日
		}
	}
	if(o.fixTimeSpan != '' && pattern.restTimes && pattern.restTimes.length > 0){
		o.fixRestSpan = '';
		for(var i = 0 ; i < pattern.restTimes.length ; i++){
			var t = pattern.restTimes[i];
			o.fixRestSpan += ((i > 0 ? ',' : '') + teasp.util.time.timeValue(t.from) + '-' + teasp.util.time.timeValue(t.to));
		}
	}
	o.st = this.getStartTime(false, null, teasp.constant.C_REAL);
	o.et = this.getEndTime(false, null, teasp.constant.C_REAL);
	var st = this.getStartTime(true, 0, teasp.constant.C_REAL);
	var et = this.getEndTime(true, 0, teasp.constant.C_REAL);
	var tt = this.getTimeTable(true);
	var hls = this.getArrayOfHourlyLeave();
	if(hls.length){
		o.holys = o.holys.concat(hls);
	}
	for(var i = 0 ; i < tt.length ; i++){
		var t = tt[i];
		if(t.type == teasp.constant.REST_FIX || t.type == teasp.constant.REST_FREE){
			if(t.from === null || t.to   === null){
				o.restSpan += ((o.restSpan != '' ? ',' : '')
						+ teasp.util.time.timeValue(t.from)
						+ '-'
						+ teasp.util.time.timeValue(t.to));
			}else if((!st || st < t.to) && (!et || t.from < et)){
				o.restSpan += ((o.restSpan != '' ? ',' : '')
						+ teasp.util.time.timeValue(st && t.from < st ? st : t.from)
						+ '-'
						+ teasp.util.time.timeValue(et && et < t.to ? et : t.to));
			}
		}else if(t.type == teasp.constant.AWAY){
			o.awaySpan += ((o.awaySpan != '' ? ',' : '')
					+ teasp.util.time.timeValue(t.from)
					+ '-'
					+ teasp.util.time.timeValue(t.to));
		}
	}
	if(this.dataObj.holiday1){ o.holys.push({name: this.dataObj.holiday1.name}); }
	if(this.dataObj.holiday2){ o.holys.push({name: this.dataObj.holiday2.name}); }
	var calcMode = this.parent.getCalcMode();
	if(calcMode == teasp.constant.C_FDISC){
		calcMode = teasp.constant.C_FREAL;
	}
	var calcType = (calcMode == teasp.constant.C_FREAL ? calcMode : null);
	if(this.parent.isDiscretionaryOption() && calcType == teasp.constant.C_DISC){ // 「裁量労働／管理監督者で実労働時間を表示する」がオン
		calcType = teasp.constant.C_REAL;
	}
	o.legalzan      = this.getDaySubTimeByKey('workLegalOverTime'    , true, 0, null, calcType);
	o.legalout      = this.getDaySubTimeByKey('workLegalOutOverTime' , true, 0, null, calcType);
	o.legalext      = this.getDaySubTimeByKey('workChargeTime'       , true, 0, null, calcType);
	o.hwrkTime      = this.getDaySubTimeByKey('workHolidayTime'      , true, 0, null, calcType);
	o.restTime      = this.getDaySubTimeByKey('restTime'             , true, 0, null, calcType);
	o.awayTime      = this.getDaySubTimeByKey('awayTime'             , true, 0, null, calcType);
	o.workFixTime   = this.getDaySubTimeByKey('workInFixedTime'      , true, 0, null, calcType);
	o.workWholeTime = this.getDaySubTimeByKey('workWholeTime'        , true, 0, null, calcType);
	o.workRealTime  = this.getDaySubTimeByKey('workRealTime'         , true, 0, null, calcType);
	o.workNetTime   = this.getDaySubTimeByKey('workRealTime'         , true, 0, null, teasp.constant.C_REAL);
	// 深夜労働時間は実際の労働時間をカウント
	o.nightTime     = this.getDaySubTimeByKey('workNightTime'        , true, 0, null, teasp.constant.C_REAL);

	return o;
};

/**
 * 配置部署の記号（or頭文字）を得る.<br/>
 * 配置部署指定なしか配置部署が所属部署と同じ場合は Null を返す
 *
 * @return {string|null}
 */
teasp.data.EmpDay.prototype.getWorkPlaceSymbol = function(){
	var ss = this.day.rack.validApplys.shiftSet;
	if(!ss || !ss.workPlace){
		return null;
	}
	if(ss.workPlace.id == this.parent.getDeptId()){
		return null;
	}
	return (ss.workPlace.symbol || ss.workPlace.name.substring(0, 1));
};


/**
 * 申請レコードから修正後のタイムテーブルを取り出し、現在値で補正して返す。
 *
 * @param {Object} applyObj
 * @return {Array.<Object>}
 */
teasp.data.EmpDay.prototype.getReviseTimeTable = function(applyObj){
	return this.getMergedReviseTime(applyObj.oldValue, applyObj.timeTable);
};

/**
 * 申請レコードから申請前のタイムテーブルを取り出し、現在値で補正して返す。
 *
 * @param {Object} applyObj
 * @return {Array.<Object>}
 */
teasp.data.EmpDay.prototype.getReviseOldValue = function(applyObj){
	return this.getMergedReviseTime(applyObj.timeTable, applyObj.oldValue);
};

teasp.data.EmpDay.fromJsonTT = function(tt){
	return (typeof(tt) == 'string' ? dojo.fromJson(tt.replace(/\\/g, '')) : tt);
};

/**
 * timeTable の tt1 から出社・退社・休憩時間を取り出し、それぞれの項目について
 * 現在の値と比較して、変わってない項目についてだけ tt2 の同項目の値を採用した
 * 新しい timeTable を作成する。
 *
 * @param {Array.<Object>|string} tt1
 * @param {Array.<Object>|string} tt2
 * @return {Array.<Object>}
 */
teasp.data.EmpDay.prototype.getMergedReviseTime = function(tt1, tt2){
	var ott = teasp.data.EmpDay.fromJsonTT(tt1);
	var ntt = teasp.data.EmpDay.fromJsonTT(tt2);
	var i, no = null, nres = [], nels = [], oo = null, ores = [], oels = [], co = null, cres = [], cels = [];
	for(i = 0 ; i < ntt.length ; i++){
		if(ntt[i].type == 1){
			no = ntt[i];
		}else if(ntt[i].type == teasp.constant.REST_FIX || ntt[i].type == teasp.constant.REST_FREE){
			nres.push(ntt[i]);
		}
	}
	// 公用外出は現在の値を使用する
	var ctt = this.getTimeTable();
	for(i = 0 ; i < ctt.length ; i++){
		if(ctt[i].type == teasp.constant.AWAY){
			nels.push(ctt[i]);
		}
	}
	for(i = 0 ; i < ott.length ; i++){
		if(ott[i].type == 1){
			oo = ott[i];
		}else if(ott[i].type == teasp.constant.REST_FIX || ott[i].type == teasp.constant.REST_FREE){
			ores.push(ott[i]);
		}else{
			oels.push(ott[i]);
		}
	}
	// 今の出社時刻、退社時刻、休憩時間を得る
	var st = this.getStartTime(true, null, teasp.constant.C_REAL);
	var et = this.getEndTime(true, null, teasp.constant.C_REAL);
	co = {
		from : (typeof(st) == 'number' ? st : null),
		to   : (typeof(et) == 'number' ? et : null)
	};
	if(typeof(co.from) == 'number' || typeof(co.to) == 'number'){
		var ctt = this.getTimeTable();
		for(i = 0 ; i < ctt.length ; i++){
			if(ctt[i].type == 1){
			}else if(ctt[i].type == teasp.constant.REST_FIX || ctt[i].type == teasp.constant.REST_FREE){
				cres.push(ctt[i]);
			}else{
				cels.push(ctt[i]);
			}
		}
		if(co.from != oo.from){ // 今の出社時刻が勤怠時刻修正申請時の値と異なるなら、今の出社時刻を正とする
			no.from = co.from;
		}
		if(co.to != oo.to){ // 今の退社時刻が勤怠時刻修正申請時の値と異なるなら、今の退社時刻を正とする
			no.to = co.to;
		}
		if(cres.length != ores.length){
			nres = cres; // 今の休憩時間が勤怠時刻修正申請時の値と異なるなら、今の休憩時間を正とする
		}else{
			ores = ores.sort(function(a, b){
				return (a.from == b.from) ? (a.to - b.to) : (a.from - b.from);
			});
			cres = cres.sort(function(a, b){
				return (a.from == b.from) ? (a.to - b.to) : (a.from - b.from);
			});
			for(i = 0 ; i < cres.length ; i++){
				if(cres[i].from != ores[i].from || cres[i].to != ores[i].to){
					nres = cres; // 今の休憩時間が勤怠時刻修正申請時の値と異なるなら、今の休憩時間を正とする
					break;
				}
			}
		}
	}
	return [no].concat(nres).concat(nels);
};

/**
 * 申請の備考を改行区切りで結合した文字列を返す
 *
 * @return {string}
 */
teasp.data.EmpDay.prototype.getApplyNotes = function(){
	return this.day.rack.applyNotes;
};

/**
 * 振替により日タイプが変わった日か
 *
 * @return {boolean}
 */
teasp.data.EmpDay.prototype.isExchangedEdge = function(){
	var es = this.isExistApply(teasp.constant.APPLY_KEY_EXCHANGES);
	var ee = this.isExistApply(teasp.constant.APPLY_KEY_EXCHANGEE);
	return ((es || ee) && !(es && ee));
};

/**
 *
 * @param {number} st
 * @param {number} et
 * @param {boolean} flag
 * @return {Array.<Object>}
 */
teasp.data.EmpDay.prototype.createTimeTable = function(st, et, flag){
	var pattern = this.getPattern();
	var fixRests = [];
	for(var i = 0 ; i < pattern.restTimes.length ; i++){
		fixRests.push({
			from : pattern.restTimes[i].from,
			to   : pattern.restTimes[i].to,
			type : teasp.constant.REST_FIX
		});
	}
	if(!st && !et){
		return [{ from: null, to: null, type: 1 }].concat(fixRests);
	}
	var pst = this.getStartTime(true, 0, teasp.constant.C_REAL); // 入力済みの出社時刻
	var pet = this.getEndTime  (true, 0, teasp.constant.C_REAL); // 入力済みの退社時刻
	var aways = [];
	var rests = [];
	var timeTable = dojo.clone(this.getTimeTable());
	if(!flag || typeof(pst) == 'number' || typeof(pet) == 'number'){
		for(i = 0 ; i < timeTable.length ; i++){
			var t = timeTable[i];
			if(t.type == teasp.constant.AWAY){
				aways.push(t);
			}else if(t.type == teasp.constant.REST_FIX || t.type == teasp.constant.REST_FREE){
				rests.push(t);
			}
		}
	}else{
		rests = fixRests;
	}
	return [{ from: st, to: et, type: 1 }].concat(rests).concat(aways);
};

/**
 *
 * @param {number} flag bit1がON:直行、bit2がON:直帰
 * @return {Array.<Object>}
 */
teasp.data.EmpDay.prototype.createTimeTableFix = function(flag){
	var pattern = this.getPattern();
	var fst = (this.day.rack.shiftStartTime || pattern.stdStartTime);  // 直行時刻
	var fet = (this.day.rack.shiftEndTime   || pattern.stdEndTime  );  // 直帰時刻
	var st = this.getStartTime(true, 0, teasp.constant.C_REAL); // 入力済みの出社時刻
	var et = this.getEndTime  (true, 0, teasp.constant.C_REAL); // 入力済みの退社時刻

	// 半休を取っている場合、直行・直帰時刻を変更
	var ir = this.getInputTimeRange();
	if(ir){
		if(fst < ir.from){ fst = ir.from; }
		if(fet > ir.to  ){ fet = ir.to  ; }
	}

	var za = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_ZANGYO);     // 残業申請
	var es = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_EARLYSTART); // 早朝勤務申請
	var hw = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_KYUSHTU);    // 休日出勤申請
	var ls = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_LATESTART);  // 遅刻申請
	var ee = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_EARLYEND);   // 早退申請

	if(za){ // 残業申請あり
		if(za.startTime < fst){ // 残業申請の開始時刻が直行時刻より早い
			fst = za.startTime;
		}
		if(za.endTime > fet){ // 残業申請の終了時刻が直帰時刻より早い
			fet = za.endTime;
		}
	}
	if(es){ // 早朝勤務申請あり
		if(es.startTime < fst){ // 早朝勤務申請の開始時刻が直行時刻より早い
			fst = es.startTime;
		}
		if(es.endTime > fet){ // 早朝勤務申請の終了時刻が直帰時刻より早い
			fet = es.endTime;
		}
	}
	if(hw && (this.isHoliday() || this.day.plannedHoliday)){ // 休日出勤申請ありかつ（休日または有休計画付与日）
		if(hw.startTime < fst){ // 休日出勤申請の開始時刻が直行時刻より早い
			fst = hw.startTime;
		}
		if(hw.endTime > fet){ // 休日出勤申請の終了時刻が直帰時刻より早い
			fet = hw.endTime;
		}
	}
	if(ls && ls.endTime > fst){ // 遅刻申請があり、直行時刻より遅い場合は出社時刻を遅刻申請の時刻に合わせる
		fst = ls.endTime;
	}
	if(ee && ee.startTime < fet){ // 早退申請があり、直帰時刻より早い場合は早退申請の時刻に合わせる
		fet = ee.startTime;
		if(fst > fet){
			fet = null; // 合わせた結果、出社時刻より早くなった場合は Null をセット
		}
	}
	return this.createTimeTable(((flag & 1) ? fst : st), ((flag & 2) ? fet : et), (!st && !et));
};

/**
 * 遅刻したか（申請の有無に関わらない）
 *
 * @return {number} 遅刻=1, 遅刻ではない=0, 出社時刻未入力=-1
 */
teasp.data.EmpDay.prototype.getLateFlag = function(){
	return (this.day.real.lateTime > 0);
//    return this.day[teasp.constant.C_REAL].lateFlag;
};

/**
 * 早退したか（申請の有無に関わらない）
 *
 * @return {number} 早退=1, 早退ではない=0, 退社時刻未入力=-1
 */
teasp.data.EmpDay.prototype.getEarlyFlag = function(){
	return (this.day.real.earlyTime > 0);
//    return this.day[teasp.constant.C_REAL].earlyFlag;
};

/**
 * 直行・直帰申請による入力制限を取得
 *
 * @return {Object} flag =0:制限なし  =1:出社時刻ロック  =2:退社時刻ロック  =3:出退時刻ともロック
 */
teasp.data.EmpDay.prototype.getInputLimit = function(){
	var st = this.getStartTime(true, null, teasp.constant.C_REAL); // 入力済みの出社時刻
	var et = this.getEndTime(true, null, teasp.constant.C_REAL);   // 入力済みの退社時刻
	var dr = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_DIRECT); // 直行・直帰申請
	var hw = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_KYUSHTU); // 休日出勤申請
	if(st === ''){ st = null; }
	if(et === ''){ et = null; }
	var flag = ((dr && dr.directFlag) || (hw && hw.directFlag) || 0);
	var o = {
		flag       : flag,
		directFlag : flag,
		st         : st,
		et         : et
	};
	if(!o.flag){
		return o;
	}
	if((o.flag & 1) && typeof(st) != 'number'){
		o.flag &= ~1;
	}
	if((o.flag & 2) && typeof(et) != 'number'){
		o.flag &= ~2;
	}
	return o;
};

/**
 * 承認待ちの勤怠時刻修正申請があるか
 *
 * @return {Object|null}
 */
teasp.data.EmpDay.prototype.existWaitReviseTime = function(){
	var rvs = (this.day.rack.validApplys.reviseTime || []);
	var robj = { from: null, to: null };
	for(var i = 0 ; i < rvs.length ; i++){
		var rv = rvs[i];
		if(rv.status == teasp.constant.STATUS_WAIT){
			var ovs = teasp.data.EmpDay.fromJsonTT(rv.oldValue);
			var tts = teasp.data.EmpDay.fromJsonTT(rv.timeTable);
			var ov = { from: null, to: null };
			var tt = { from: null, to: null };
			for(var i = 0 ; i < ovs.length ; i++){
				var o = ovs[i];
				if(o.type == 1){
					ov.from = o.from;
					ov.to   = o.to;
					break;
				}
			}
			for(var i = 0 ; i < tts.length ; i++){
				var o = tts[i];
				if(o.type == 1){
					tt.from = o.from;
					tt.to   = o.to;
					break;
				}
			}
			robj.from = (ov.from || tt.from || robj.from);
			robj.to   = (ov.to   || tt.to   || robj.to  );
		}
	}
	return (robj.from === null && robj.to === null) ? null : robj;
};

/**
 * 時間単位休の時間を返す
 *
 * @param {Array.<Object>} timeTable
 * @return {number}
 */
teasp.data.EmpDay.prototype.getTimeHolidayTime = function(timeTable){
	var hts = (this.day.rack.validApplys ? (this.day.rack.validApplys.holidayTime || []) : []);
	var tm = 0;
	var tts = (timeTable || []);
	for(var i = 0 ; i < hts.length ; i++){
		var ht = hts[i];
		var holiday = ht.holiday || {};
		var minUnit = 1;
		if(holiday.yuqSpend){
			minUnit = 60;
		}else if(holiday.managed){
			minUnit = 30;
		}
		var rests = [];
		for(var j = 0 ; j < tts.length ; j++){
			var tt = tts[j];
			if(tt.type == teasp.constant.REST_FIX){
				rests.push(tt);
			}
		}
		var st = ht.startTime;
		var et = ht.endTime;
		if(typeof(st) != 'number' || typeof(et) != 'number' || st >= et){
			continue;
		}
		var t = et - st;
		if(rests.length > 0){
			var rt = teasp.util.time.rangeTime({from: st, to: et }, rests);
			if(rt > 0){
				t -= rt;
			}
		}
		tm += (Math.ceil(t / minUnit) * minUnit);
	}
	return tm;
};

/**
 * 退社打刻できるとしたら、その時刻を返す
 *
 * @param {Object} now 現在日時 Dateオブジェクト
 * @param {string} td
 * @return {number|null} 退社打刻できる場合その時刻（分）、退社打刻できなければ null
 */
teasp.data.EmpDay.prototype.getPushableEndTime = function(now, td){
	var dkey = this.day.date;
	var d = now;
	var t = d.getHours() * 60 + d.getMinutes(); // 現在時刻
	var yday = teasp.util.date.compareDate(dkey, d);
	if(yday == 0 || yday == -1){
		var st = this.day.startTime;
		var et = this.day.endTime;
		var f = ((td || st) && !et) ? true : false;
		var p24 = this.parent.isPermitLeavingPush24hours();
		if(f && yday == -1){ // this.day は暦日で前日である
			var nd = this.parent.getNextMonthDay(dkey); // this.day の翌日
			var net = nd.endTime;
			// 以下のいずれかに該当すれば退社打刻不可
			// ・this.day の翌日の出社時刻入力済みかつ出社時刻が現在時刻より前
			// ・this.day の翌日の退社時刻入力済みかつ退社時刻が現在時刻より前
			// ・「退社打刻は出社時刻から24時間後までとする」がオンかつ現在時刻が前日の出社時刻より後
			// ・「退社打刻は出社時刻から24時間後までとする」がオフかつ現在時刻が 5:00 より後
			if(typeof(nst)  == 'number'
			|| (typeof(net) == 'number' && t > net)
			|| (typeof(st)  == 'number' && p24 && t > st)
			|| (!p24 && t > 300)){
				f = false;
			}
			if(f){
				return (t + (60 * 24));
			}
		}
		if(f && yday == 0){
			if(st){
				return t;
			}else if(
				(
					(   this.day.dayType == teasp.constant.DAY_TYPE_NORMAL //   平日
						&& !this.day.plannedHoliday                        //   かつ有休計画付与日ではない
					) || (                                                 // または
						this.day.rack.validApplys.kyushtu.length > 0       //   休日出勤申請がある
						&&                                                 //   かつ
						(   !this.parent.isProhibitInputTimeUntilApproved() //   「承認されるまで時間入力を禁止」がオフ
							|| teasp.constant.STATUS_APPROVES.contains(this.day.rack.validApplys.kyushtu[0].status) // または休日出勤申請が承認済み
						)
					)
				)
				&& (!this.day.rack.holidayJoin || this.day.rack.holidayJoin.flag != 3) // かつ終日の休暇申請がない
				&& !this.day.interim                                                   // かつ（「承認されるまで時間入力を禁止」の設定かつ振替申請の承認待ち）ではない
			){
				return t;
			}
		}
	}
	return null;
};

/**
 * 暫定の労働時間を返す
 *
 * @param {Object} now 現在日時 Dateオブジェクト
 * @return {number}
 */
teasp.data.EmpDay.prototype.getZanteiRealTime = function(now){
	var t = this.getPushableEndTime(now);
	if(t){
		var dayObj = dojo.clone(this.day);
		dayObj.endTime = t;
		teasp.action.contact.recalcOneDay(this.parent, dayObj);
		return dayObj.real.workRealTime;
	}
	return 0;
};

/**
 * 遅刻と早退の境界時刻を得る
 *
 * @returns {Object} st と et を要素に持つオブジェクト
 */
teasp.data.EmpDay.prototype.getBorderTime = function(flag){
	var flex = (this.parent.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX);
	if(!flex){ // フレックスタイム制でない、または id の値がある場合、勤務パターンの開始・終了時刻が境界時刻になる
		return {
			st : this.getFixStartTime(flag),
			et : this.getFixEndTime(flag)
		};
	}
	if(this.isUseCoreTime()){
		if(flag
		&& typeof(this.day.rack.bdrStartTime) == 'number'
		&& typeof(this.day.rack.bdrEndTime) == 'number'){
			return {
				st: this.day.rack.bdrStartTime,
				et: this.day.rack.bdrEndTime
			};
		}
		return this.getCoreTime();
	}else{
		return {
			st : -1,
			et : -1
		};
	}
};

/**
 * 出社・退社時刻の入力状況を返す
 * @param {number} mask  2:退社欠落を無視 それ以外:何もしない
 * @return {Object}
 */
teasp.data.EmpDay.prototype.getDeficit = function(mask){
	var result = {
		ng: false,
		empty: 0,
		entered: false,
		require : this.parent.isRequireDailyInput()
	};
	if(this.day.deco.invalidTime){
		result.ng = true;
	}else if(this.isInputable(true)){
		if(this.day.deco.ct.st === 0 && this.day.deco.ct.et === 0){
			result.empty = 3; // 出退社時刻とも未入力
		}else if(this.day.deco.ct.st === 0 && this.day.deco.ct.et !== 0){
			result.empty = 1; // 出社時刻未入力
		}else if(this.day.deco.ct.st !== 0 && this.day.deco.ct.et === 0){
			result.empty = 2; // 退社時刻未入力
		}else{
			result.entered = true; // 出退社時刻とも入力済み
		}
		if(result.empty == 3 && !result.require){
			result.empty = 0;
		}
		if(mask == 2){ // 退社時刻未入力を無視する
			result.empty &= 1;
		}
	}
	return result;
};

/**
 * 出退社時刻と半休適用時間のチェックをするか
 *
 * @public
 * @return {boolean} チェックする
 */
teasp.data.EmpDay.prototype.isCheckTimeOnHalfHoliday = function(){
	if(this.isFlexHalfDayTimeDay()){ // コア時間帯が設定されていないフレックスの半日休暇適用時間を使用しない（フレックスかつコアなし）
		return false;
	}
	if(this.getDiscretionaryLevel()){ // 裁量労働オン
		var pas = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNS); // 勤務時間変更申請（短期）
		var pal = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNL); // 勤務時間変更申請（長期）
		var pa = (pas || pal);
		if(pa                                      // 勤務時間変更申請済み
		&& pa.pattern
		&& !pa.pattern.enableRestTimeShift         // 「シフト開始時刻に合わせて、所定休憩と半休の時間帯をずらす」＝オフ
		&& (pa.startTime != pa.pattern.stdStartTime // 始業・終業時刻どちらかまたは両方を変更した
		|| pa.endTime   != pa.pattern.stdEndTime)
		){
			return false;
		}
	}
	return true;
};

/**
 * 所定休憩の開始・終了時刻をカンマ区切りの文字列で返す。
 *
 * @returns {string}
 */
teasp.data.EmpDay.prototype.getFixTimeNums = function(){
	var pattern = this.getPattern();
	var lst = [];
	for(var i = 0 ; i < pattern.restTimes.length ; i++){
		lst.push('' + pattern.restTimes[i].from);
		lst.push('' + pattern.restTimes[i].to  );
	}
	return lst.join(',');
};

/**
 * 「承認されるまで時間入力を禁止」の設定で、振替申請の承認待ちの場合、trueを返す
 * @returns
 */
teasp.data.EmpDay.prototype.isInterim = function(){
	return this.day.interim;
};

/**
 * コアタイムを使用するか
 * （フレックスタイム制でなければ false を返す）
 * @returns
 */
teasp.data.EmpDay.prototype.isUseCoreTime = function(){
	return this.day.rack.useCoreTime || false;
};

teasp.data.EmpDay.prototype.getCoreTime = function(){
	var pas = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNS); // 勤務時間変更申請（短期）
	var pal = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNL); // 勤務時間変更申請（長期）
	var pa = (pas || pal);
	if(pa){  // 勤務時間変更申請済み
		return {
			st : pa.startTime || pa.pattern.stdStartTime,
			et : pa.endTime   || pa.pattern.stdEndTime
		};
	}
	return {
		st : this.parent.getConfigObj().coreStartTime,
		et : this.parent.getConfigObj().coreEndTime
	};
};

/**
 * 平日か
 * @returns {boolean}
 */
teasp.data.EmpDay.prototype.isNormalDay = function(){
	return (this.day.dayType == teasp.constant.DAY_TYPE_NORMAL                  // 平日
		|| (this.day.autoLH && this.day.rack.validApplys.kyushtu.length <= 0)   // または自動判定で法定休日になった日
		|| this.parent.isRegulateHoliday(this.day.date));                       // または休日出勤の勤怠規則は平日に準拠する＝オン
};

/**
 * 勤怠時刻修正申請が承認済みで未反映のものがあれば true を返す
 * @returns {boolean}
 */
teasp.data.EmpDay.prototype.isExistNotEnterReviseTime = function(){
	var revises = this.day.rack.validApplys.reviseTime || [];
	for(var j = 0 ; j < revises.length ; j++){
		var rev = revises[j];
		if(teasp.constant.STATUS_APPROVES.contains(rev.status) && !rev.entered){ // 承認済みかつ未反映
			return true;
		}
	}
	return false;
};

/**
 * 出退社時刻入力済みか
 * @param {boolean=} flag 片方が入力済みならtrueを返す
 * @returns {boolean}
 */
teasp.data.EmpDay.prototype.isInputed = function(flag){
	var t1 = (typeof(this.getRealStartTime()) == 'number');
	var t2 = (typeof(this.getRealEndTime()  ) == 'number');
	return (t1 && t2) || (flag && (t1 || t2));
};

/**
 * 日単位乖離判定結果を返す
 *
 * @returns {Object}
 */
teasp.data.EmpDay.prototype.getDivergenceJudge = function(reasonSet){
	var diverge = new teasp.helper.Diverge({
		date                     : this.day.date,
		enterTime                : this.day.enterTime,
		enterDivergenceJudgement : this.day.enterDivergenceJudgement,
		enterDivergenceReason    : (reasonSet ? reasonSet.enterDivergenceReason : this.day.enterDivergenceReason),
		st                       : this.getRealStartTime(),
		exitTime                 : this.day.exitTime,
		exitDivergenceJudgement  : this.day.exitDivergenceJudgement,
		exitDivergenceReason     : (reasonSet ? reasonSet.exitDivergenceReason : this.day.exitDivergenceReason),
		et                       : this.getRealEndTime()
	});
	return diverge.getJudge();
};

/**
 * 乖離判定表示
 * @param {number|null} sd 出社時刻
 * @param {number|null} ed 退社時刻
 * @param {number|null} e1 入館時刻
 * @param {number|null} e2 退館時刻
 * @param {number} typ  =1:出社の乖離判定  =2:退社の乖離判定
 * @param {boolean=} flag trueならリセットした
 * @return {string}
 */
teasp.data.EmpDay.prototype.getDispDivergence = function(sd, ed, e1, e2, typ, flag){
	if(flag){
		return '';
	}
	var pt = this.parent.getPermitDivergenceTime(); // 乖離許容時間(分)
	var judge = this.getDivergenceJudge();
	if(judge.type <= 0 // 日単位乖離判定で乖離なしor未判定
	|| typeof(pt) != 'number'){
		return '';
	}
	var sa;
	if(typ == 1){ // 出社の乖離判定
		if(!judge.dIn.type || typeof(sd) != 'number' || typeof(e1) != 'number'){ // 出社・入館時刻とも入ってなければスルー
			return '';
		}
		sa = sd - e1; // 出社時刻 - 入館時刻
	}else{ // 退社の乖離判定
		if(!judge.dOut.type || typeof(ed) != 'number' || typeof(e2) != 'number'){ // 退社・退館時刻とも入ってなければスルー
			return '';
		}
		sa = ed - e2; // 退社時刻 - 退館時刻
	}
	sa = Math.abs(sa);
	return (sa > pt ? teasp.message.getLabel('ac00000240', pt) : ''); // {0}分超乖離
};

// 過去日か
teasp.data.EmpDay.prototype.isPast = function(){
	return (this.day.date < teasp.util.date.formatDate(new Date()));
};

// 入館時間
teasp.data.EmpDay.prototype.getEnterTime = function(){
	if(typeof(this.day.enterTime) != 'number' && (this.day.enterDivergenceJudgement == 2 || this.isPast())){
		return teasp.message.getLabel('ac00000440'); // ログなし
	}
	return this.parent.getDisplayTime(this.day.enterTime, false, '', null, true);
};

// 退館時間
teasp.data.EmpDay.prototype.getExitTime = function(){
	if(typeof(this.day.exitTime) != 'number' && (this.day.exitDivergenceJudgement == 2 || this.isPast())){
		return teasp.message.getLabel('ac00000440'); // ログなし
	}
	return this.parent.getDisplayTime(this.day.exitTime, false, '', null, true);
};

// 入館乖離理由
teasp.data.EmpDay.prototype.getEnterDivergenceReason = function(flag){
	var v = this.day.enterDivergenceReason || '';
	if(flag){
		v = v.replace(/\r?\n/g, '<br/>');
	}
	return v;
};

// 退館乖離理由
teasp.data.EmpDay.prototype.getExitDivergenceReason = function(flag){
	var v = this.day.exitDivergenceReason || '';
	if(flag){
		v = v.replace(/\r?\n/g, '<br/>');
	}
	return v;
};

/**
 * 入館の乖離判定表示
 * @param {boolean=} flag
 * @return {string}
 */
teasp.data.EmpDay.prototype.getEnterDivergence = function(flag){
	return this.getDispDivergence(this.day.startTime, this.day.endTime, this.day.enterTime, this.day.exitTime, 1, flag);
};

/**
 * 退館の乖離判定表示
 * @param {boolean=} flag
 * @return {string}
 */
teasp.data.EmpDay.prototype.getExitDivergence = function(flag){
	return this.getDispDivergence(this.day.startTime, this.day.endTime, this.day.enterTime, this.day.exitTime, 2, flag);
};

/**
 * 乖離判定前に日次確定できなければ true を返す
 * @return {boolean}
 */
teasp.data.EmpDay.prototype.isDivergeBeforeJudge = function(){
	return (this.getDivergenceJudge().type < 0  // 未判定
	&& !this.parent.isPermitDailyApply()); // 乖離判定前は日次確定申請不可
};

/**
 * 乖離ありで理由なしなら true を返す
 * @return {boolean}
 */
teasp.data.EmpDay.prototype.isDivergeNoReason = function(reasonSet){
	var o = this.getDivergenceJudge(reasonSet);
	return (o.type > 0 && !o.reason); // 乖離ありor理由入力済み
};

teasp.data.EmpDay.prototype.getDivergeNg = function(){
	var d = teasp.util.date.formatDate(this.day.rack.key, 'M/d');
	if(this.isDivergeBeforeJudge()){
		return d + ' ' + teasp.message.getLabel('ac00000490'); // ログとの乖離判定が行われていません。
	}else if(this.isDivergeNoReason()){
		return d + ' ' + teasp.message.getLabel('ac00000430'); // ログとの乖離があります。乖離理由を入力してください。
	}
	return null;
};

/**
 * 延長勤務禁止＝オンの休暇を取得したか
 * @returns {Object} 休暇オブジェクト
 */
teasp.data.EmpDay.prototype.getProhibitOverNightWorkHoliday = function(){
	if(this.day.holiday1 && this.day.holiday1.config && this.day.holiday1.config.prohibitOverNightWork){
		return this.day.holiday1;
	}
	if(this.day.holiday2 && this.day.holiday2.config && this.day.holiday2.config.prohibitOverNightWork){
		return this.day.holiday2;
	}
	return null;
};

/**
 * 残業申請が未申請の勤務時間を返す
 * @param {number|null} t
 * @returns
 */
teasp.data.EmpDay.prototype.getMissingOverTime = function(t){
	var sv = (this.day.disc && this.day.disc.svZan) || 0;
	return (t > 0 && sv >= t ? (sv - t + 1) : 0);
};

/**
 * 早朝勤務申請が未申請の勤務時間を返す
 * @param {number|null} t
 * @returns
 */
teasp.data.EmpDay.prototype.getMissingEarlyWork = function(t){
	var sv = (this.day.disc && this.day.disc.svEst) || 0;
	return (t > 0 && sv >= t ? (sv - t + 1) : 0);
};

/**
 * 遅刻申請がない
 * @returns {boolean}
 */
teasp.data.EmpDay.prototype.isMissingLateStartApply = function(){
	var border = this.getBorderTime(true);
	if(border.st < 0){ // 遅刻の境界値がないので遅刻申請不要
		return false;
	}
	var st = (this.day.disc ? this.day.disc.calcStartTime : null);
	if(typeof(st) != 'number'){ // 出社時刻未入力
		return false;
	}
	if(st <= border.st){ // 出社時刻≦遅刻の境界値
		return false;
	}
	// 休日出勤(かつ平日に準拠ではない)
	if(this.day.dayType != teasp.constant.DAY_TYPE_NORMAL
	&& this.day.rack
	&& this.day.rack.validApplys
	&& this.day.rack.validApplys.kyushtu
	&& this.day.rack.validApplys.kyushtu.length
	&& !this.day.rack.validApplys.kyushtu[0].useRegulateHoliday
	){
		return false;
	}
	var ls = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_LATESTART);  // 遅刻申請
	var t = (ls && ls.endTime < this.day.disc.startTime
			? teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges([{from:ls.endTime,to:this.day.disc.startTime}], this.day.rack.hourRests))
			: 0
			);
	if(!ls || (t > 0 && ls.endTime < border.et)){ // 遅刻申請がない or  遅刻申請の時刻より出社時刻が遅い
		return true;
	}
	return false;
};

/**
 * 早退申請がない
 * @returns {boolean}
 */
teasp.data.EmpDay.prototype.isMissingEarlyEndApply = function(){
	var border = this.getBorderTime(true);
	if(border.et < 0){ // 遅刻の境界値がないので遅刻申請不要
		return false;
	}
	var et = (this.day.disc ? this.day.disc.calcEndTime : null);
	if(typeof(et) != 'number'){ // 退社時刻未入力
		return false;
	}
	if(border.et <= et){ // 早退の境界値≦退社時刻
		return false;
	}
	// 休日出勤(かつ平日に準拠ではない)
	if(this.day.dayType != teasp.constant.DAY_TYPE_NORMAL
	&& this.day.rack
	&& this.day.rack.validApplys
	&& this.day.rack.validApplys.kyushtu
	&& this.day.rack.validApplys.kyushtu.length
	&& !this.day.rack.validApplys.kyushtu[0].useRegulateHoliday
	){
		return false;
	}
	var ee = this.getEmpApplyByKey(teasp.constant.APPLY_KEY_EARLYEND);   // 早退申請
	var t = (ee && this.day.disc.endTime < ee.startTime
			? teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges([{from:this.day.disc.endTime,to:ee.startTime}], this.day.rack.hourRests))
			: 0
			);
	if(!ee || (t > 0 && border.st < ee.startTime)){ // 早退申請がない or 早退申請の時刻より退社時刻が早い
		return true;
	}
	return false;
};

/**
 * 半休申請後の所定休憩と入力済みの休憩が違うかどうかを返す
 *
 * @param {holidayRange:{number}} 2:午前半休 3:午後半休
 * @return {boolean} true:差異あり false:差異なし
 */
teasp.data.EmpDay.prototype.compareRestsAfterApply = function(param){
	if(!this.isInputTime()){ // 出退社時刻が未入力なら判定不要
		return {diff:false};
	}
	// (1)半休申請後の所定休憩
	var p = this.day.pattern;
	var fixRests = p.restTimes;
	if(p.useHalfHolidayRestTime){ // 半休取得時の休憩時間を使用オン
		if(param.holidayRange == 2){ // 午前半休
			fixRests = p.amHolidayRestTimes;
		}else if(param.holidayRange == 3){ // 午後半休
			fixRests = p.pmHolidayRestTimes;
		}
	}
	// (2)入力済みの休憩
	var curRests = [];
	var tt = this.day.timeTable || [];
	for(var i = 0 ; i < tt.length ; i++){
		var t = tt[i];
		if(t.type == teasp.constant.REST_FIX
		|| t.type == teasp.constant.REST_FREE){
			curRests.push(t);
		}
	}
	var fixRestsStrs = teasp.util.convertSpanStrings(teasp.util.sortSpans(fixRests)).join(', ');
	var curRestsStrs = teasp.util.convertSpanStrings(teasp.util.sortSpans(curRests)).join(', ');
	// (1)と(2)を比較して差異があれば true を返す
	return {
		note: teasp.message.getLabel('tf10009800'
				, fixRestsStrs || teasp.message.getLabel('tf10009810')
				, curRestsStrs || teasp.message.getLabel('tf10009810')
			),
		diff: teasp.util.compareSpans(fixRests, curRests)
	};
};

/**
 * 月次サマリーのイベント／勤務状況列用の時間単位休情報
 *
 * @return {string}
 */
teasp.data.EmpDay.prototype.getSummaryOfHourlyLeave = function(){
	var holidayTimes = this.day.rack.validApplys.holidayTime || [];
	var map = {};
	for(var x = 0 ; x < holidayTimes.length ; x++){
		var ht = holidayTimes[x];
		var h = (ht && ht.holiday);
		if(h){
			var o = map[h.name];
			if(!o){
				o = map[h.name] = { name: h.name, time: 0, order: h.order };
			}
			var t = (ht._spendTime || 0);
			if(h.yuqSpend){
				o.time += Math.ceil(t / 60) * 60; // 年次有給休暇は1h単位に切上
			}else if(h.managed){
				o.time += Math.ceil(t / 30) * 30; // 日数管理休暇は30分単位に切上
			}else{
				o.time += t;
			}
		}
	}
	var l = [];
	for(var key in map){
		l.push(map[key]);
	}
	l = l.sort(function(a, b){
		return a.order - b.order;
	});
	var vals = [];
	for(var i = 0 ; i < l.length ; i++){
		var o = l[i];
		vals.push(o.name + teasp.message.getLabel('tm10001680', teasp.util.time.timeValue(o.time)));
	}
	return vals.join(',');
};

/**
 * 勤怠グラフのツールチップ用の時間単位休リスト
 *
 * @return {Array.<string>}
 */
teasp.data.EmpDay.prototype.getArrayOfHourlyLeave = function(){
	var holidayTimes = this.day.rack.validApplys.holidayTime || [];
	holidayTimes = holidayTimes.sort(function(a, b){
		return a.startTime - b.startTime;
	});
	var lst = [];
	for(var x = 0 ; x < holidayTimes.length ; x++){
		var ht = holidayTimes[x];
		var h = (ht && ht.holiday);
		if(h){
			if(h.yuqSpend){ // 年次有給休暇は内訳の対象外
				lst.push({
					name : teasp.message.getLabel('tm10001170'
							, teasp.util.time.timeValue(ht.startTime)
							+ '-'
							+ teasp.util.time.timeValue(ht.endTime)) // 時間単位有休({0})
				})
			}else{
				lst.push({
					name : h.name + teasp.message.getLabel('tm10001680'
							, teasp.util.time.timeValue(ht.startTime)
							+ '-'
							+ teasp.util.time.timeValue(ht.endTime)) // {休暇名}({0})
				})
			}
		}
	}
	return lst;
};

teasp.data.EmpDay.prototype.isConflictReviseTime = function(st, et, minUnit){
	var rvs = (this.day.rack.validApplys.reviseTime || []);
	var vts = [{ from: st, to: et }];
	var ot = 0, tt = 0;
	var orests = [];
	var trests = [];
	for(var i = 0 ; i < rvs.length ; i++){
		var rv = rvs[i];
		if(rv.status == teasp.constant.STATUS_WAIT){
			var ovs = teasp.data.EmpDay.fromJsonTT(rv.oldValue);
			var tts = teasp.data.EmpDay.fromJsonTT(rv.timeTable);
			for(var i = 0 ; i < ovs.length ; i++){
				var o = ovs[i];
				if(o.type == teasp.constant.REST_FIX || o.type == teasp.constant.REST_FREE){
					orests.push(o);
				}
			}
			for(var i = 0 ; i < tts.length ; i++){
				var o = tts[i];
				if(o.type == teasp.constant.REST_FIX || o.type == teasp.constant.REST_FREE){
					trests.push(o);
				}
			}
			ot = teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges(vts, orests));
			tt = teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges(vts, trests));
			ot = Math.ceil(ot / minUnit) * minUnit;
			tt = Math.ceil(tt / minUnit) * minUnit;
			if(ot != tt){
				return true;
			}
		}
	}
	if(rvs.length){
		// st～et の範囲の所定休憩時間と修正後の休憩時間を比較し増えていたらエラー
		var restTimes = this.getPattern().restTimes || [];
		var ft = teasp.logic.EmpTime.getSpanTime(teasp.util.time.includeRanges(vts, restTimes));
		var nt = teasp.logic.EmpTime.getSpanTime(teasp.util.time.includeRanges(vts, trests));
		if(nt > ft){
			return true;
		}
	}
	return false;
};

teasp.data.EmpDay.prototype.isConflictTimeHoliay = function(ovs, tts){
	var holidayTimes = this.day.rack.validApplys.holidayTime || [];
	holidayTimes = holidayTimes.sort(function(a, b){
		return a.startTime - b.startTime;
	});
	var orests = [];
	var trests = [];
	for(var i = 0 ; i < ovs.length ; i++){
		var o = ovs[i];
		if(o.type == teasp.constant.REST_FIX || o.type == teasp.constant.REST_FREE){
			orests.push(o);
		}
	}
	orests = orests.sort(function(a, b){
		if(a.from == b.from){
			return (a.to - b.to);
		}
		return a.from - b.from;
	});
	for(var i = 0 ; i < tts.length ; i++){
		var o = tts[i];
		if(o.type == teasp.constant.REST_FIX || o.type == teasp.constant.REST_FREE){
			trests.push(o);
		}
	}
	trests = trests.sort(function(a, b){
		if(a.from == b.from){
			return (a.to - b.to);
		}
		return a.from - b.from;
	});
	var diff = (orests.length != trests.length);
	if(!diff){
		for(var i = 0 ; i < orests.length ; i++){
			var o = orests[i];
			var t = trests[i];
			if(o.from != t.from || o.to != t.to){
				diff = true;
				break;
			}
		}
	}
	if(!diff){
		return false;
	}
	var lst = [];
	for(var x = 0 ; x < holidayTimes.length ; x++){
		var ht = holidayTimes[x];
		var holiday = ht.holiday || {};
		var minUnit = 1;
		if(holiday.yuqSpend){
			minUnit = 60;
		}else if(holiday.managed){
			minUnit = 30;
		}
		var vts = [{ from: ht.startTime, to: ht.endTime }];
		var ot = teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges(vts, orests));
		var tt = teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges(vts, trests));
		ot = Math.ceil(ot / minUnit) * minUnit;
		tt = Math.ceil(tt / minUnit) * minUnit;
		if(ot != tt){
			return true;
		}
	}
	return false;
};

/**
 * シフト振替申請を追加できるか
 * @param {string} d YYY-MM-DD
 * @returns {boolean}
 */
teasp.data.EmpDay.prototype.canSelectShiftChange = function(d){
	var candidates = this.parent.getShiftChangeableDates(d);
	var fine = false;
	for(var key in candidates){
		if(!candidates.hasOwnProperty(key)){
			continue;
		}
		if(candidates[key].changeable){
			fine = true;
		}
	}
	return fine;
};

/**
 * 有効な申請のマップオブジェクトを返す
 * @returns {Object}
 */
teasp.data.EmpDay.prototype.getValidApplys = function(){
	return (this.day.rack.validApplys || null);
};

/**
 * コア時間帯が設定されていないフレックスの半日休暇適用時間を使用しない
 * @returns {boolean}
 */
teasp.data.EmpDay.prototype.isFlexHalfDayTimeDay = function(){
	if(this.parent.isFlexibleHalfDayTime() // コア時間帯が設定されていないフレックスの半日休暇適用時間を使用しない
	&& this.day.rack.flexFlag // フレックスタイム制
	&& !this.isUseCoreTime() // コアタイムなし
	){
		return true;
	}
	return false;
};
/**
 * 勤務場所IDを返す
 * @returns {string|null}
 */
 teasp.data.EmpDay.prototype.getWorkLocationId = function(){
	return this.day.workLocationId || null;
};
/**
 * 勤務場所を返す
 * @returns {string}
 */
teasp.data.EmpDay.prototype.getWorkLocationName = function(){
	const workLocation = this.parent.getWorkLocationById(this.day.workLocationId);
	return (workLocation && workLocation.getName()) || '';
};
/**
 * 公用外出の配列を返す
 * @returns {Array.<{from:{number},to:{number],type:30}>}
 */
teasp.data.EmpDay.prototype.getAwayTimes = function(){
	const aways = [];
	dojo.forEach(this.getTimeTable(), function(t){
		if(t.type == teasp.constant.AWAY){
			aways.push(t);
		}
	});
	return aways;
};