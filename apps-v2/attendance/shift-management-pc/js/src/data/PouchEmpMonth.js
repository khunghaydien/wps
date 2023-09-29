	/**
 * 【勤怠】勤怠日次クラスを返す
 * @param {string|Object} dkey 日付キー
 * @return {teasp.data.EmpDay}
 */
teasp.data.Pouch.prototype.getEmpDay = function(dkey){
	return new teasp.data.EmpDay(this, dkey);
};

/**
 * 【勤怠】勤怠申請クラスを返す
 * @param {Object} apply 勤怠申請オブジェクト
 * @return {teasp.data.EmpApply}
 */
teasp.data.Pouch.prototype.getEmpApply = function(apply){
	return new teasp.data.EmpApply(apply);
};

/**
 * 【勤怠】日付が社員の入社日～退社日の期間に含まれるか
 * @public
 * @param {string|Object} dkey 日付('yyyy-MM-dd')
 * @return {boolean} true:含まれる
 */
teasp.data.Pouch.prototype.isAlive = function(dkey){
	if((this.getObj().targetEmp.entryDate && teasp.util.date.compareDate(dkey, this.getObj().targetEmp.entryDate) < 0)
	|| (this.getObj().targetEmp.endDate   && teasp.util.date.compareDate(this.getObj().targetEmp.endDate, dkey) < 0)){
		return false;
	}
	return true;
};


/**
 * 【勤怠】指定日の情報を返す
 * @public
 * @param {string} dt 日付('yyyy-MM-dd')
 * @return {Object}
 */
teasp.data.Pouch.prototype.getDayInfoByDate = function(dt){
	var info = {
		date           : dt,
		dayType        : teasp.constant.DAY_TYPE_NORMAL,
		plannedHoliday : false
	};
	var d = this.getObj().days[info.date];
	var dinf = teasp.logic.EmpTime.getDayInfo(dt, this.getEmpMonthByDate(dt), this.getObj().cals[dt], this.getObj().empTypePatterns);
	if(d){
		info.dayType        = dinf.dayType;
		info.plannedHoliday = d.plannedHoliday;
		info.startTime      = d.startTime;
		info.endTime        = d.endTime;
		info.validApplys    = d.validApplys;
		return info;
	}
	if(this.getObj().dayMap && this.getObj().dayMap[info.date]){
		return this.getObj().dayMap[info.date];
	}
	info.unconfirmed = true;
	return info;
};

/**
 * 【勤怠】週の最初の休日を返す
 * @public
 * @param {Array.<string>} week 'yyyy-MM-dd'の配列
 * @param {string=} orgd 振替の場合、振替元の日付('yyyy-MM-dd')
 * @param {string=} excd 振替の場合、振替先の日付('yyyy-MM-dd')
 * @return {string|null}
 */
teasp.data.Pouch.prototype.getFirstHolidayOfWeek = function(week, orgd, excd){
	for(var i = 0 ; i < week.length ; i++){
		var k = (orgd && excd && week[i] == orgd) ? excd : week[i];
		var d = this.getObj().days[k];
		if(!d){
			d = (this.getObj().dayMap[k] || { date: k, dayType: teasp.constant.DAY_TYPE_NORMAL });
		}
		var dtyp = d.interim ? d.interim.dayType : d.dayType;
		if(dtyp != teasp.constant.DAY_TYPE_NORMAL){
			return d.date;
		}
	}
	return null;
};

teasp.data.Pouch.prototype.clearDayMap = function(){
	this.getObj().dayMap = {};
};

/**
 * 【勤怠】翌月度のカレンダー情報をセット
 * @param {Object} calMap カレンダー情報
 * @param {Object} simpleEmpDays 勤怠日次情報
 * @param {Object} applys 申請情報
 * @param {Object|string} sd 開始日
 * @param {Object|string} ed 終了日
 */
teasp.data.Pouch.prototype.setNextMonth = function(calMap, simpleEmpDays, applys, sd, ed, configMins){
	var dayList = [];
	var dlst = teasp.util.date.getDateList(sd, ed);
	for(var i = 0 ; i < dlst.length ; i++){
		dayList.push({
			date : dlst[i]
		});
	}
	var dayMap = (this.getObj().dayMap || {});
	for(i = 0 ; i < dayList.length ; i++){
		var day = dayList[i];
		// 日付オブジェクトを得る
		// dayType、plannedHoliday、event は Config、カレンダーとマージして決定
		day.dayType = teasp.constant.DAY_TYPE_NORMAL;
		day.plannedHoliday = false;
		day.applys  = [];
		var sed = simpleEmpDays[day.date];
		day.startTime = (sed ? sed.startTime : null);
		day.endTime   = (sed ? sed.endTime   : null);
		// 勤怠設定の繰り返し休日と国民の祝日で dayType をセット
		var m = this.getEmpMonthByDate(day.date);
		var ho = (m && m.fixHolidays ? m.fixHolidays[day.date] : null);
		day.dayType = (ho ? ho.dayType : teasp.constant.DAY_TYPE_NORMAL);
		// 勤怠カレンダーとマージ
		var c = calMap[day.date];
		if(c){
			if(c.type){
				day.dayType = (typeof(c.type) == 'string' ? parseInt(c.type, 10) : c.type);
				day.plannedHoliday = c.plannedHoliday;
			}
		}
		day.applys = applys[day.date] || [];
		if(day.dayType != teasp.constant.DAY_TYPE_NORMAL
		|| day.plannedHoliday
		|| day.applys.length > 0
		|| day.startTime
		|| day.endTime){
			dayMap[day.date] = day;
		}

	}
	this.getObj().dayMap = dayMap;
};

/**
 * 【勤怠】深夜時間帯オブジェクトの配列を返す
 * 本日＋翌日の深夜時間帯に該当する時間帯を示す（例) 0:00-5:00、22:00-27:00、46:00-48:00
 * @return {Array.<Object>} 深夜時間帯オブジェクトの配列
 */
teasp.data.Pouch.prototype.getNightRanges = function(){
	return this.getObj().common.nightTimes;
};

/**
 * 【勤怠】打刻なしを表示するを表示するか
 * @return {boolean} true:表示する
 */
teasp.data.Pouch.prototype.isIndicateNoPushTime = function(){
	return this.getObj().common.indicateNoPushTime;
};

/**
 * 【勤怠】裁量労働で実労働時間を表示するか
 * @return {boolean} true:表示する
 */
teasp.data.Pouch.prototype.isDiscretionaryOption = function(){
	return this.getObj().common.discretionaryOption;
};

/**
 * 【勤怠】フレックスで日ごとの残業を表示するか
 * @return {boolean} true:表示する
 */
teasp.data.Pouch.prototype.isFlexGraph = function(){
	return this.getObj().common.flexGraph;
};

/**
 * 【勤怠】定時打刻ボタンを使用するか
 * @return {boolean} true:使用する
 */
teasp.data.Pouch.prototype.isUseFixedButton = function(){
	return this.getObj().common.useFixedButton;
};

/**
 * 【勤怠】退社後の再出社打刻が可能か
 * @return {boolean} true:使用する
 */
teasp.data.Pouch.prototype.isUseRestartable = function(){
	return this.getObj().common.useRestartable;
};

/**
 * 【勤怠】遅刻申請画面で自己都合選択オプションを使用するか
 * @return {boolean} true:使用する
 */
teasp.data.Pouch.prototype.isUseOwnReasonLateStart = function(){
	return (this.getObj().common.treatLateStart ? true : false);
};

/**
 * 【勤怠】早退申請画面で自己都合選択オプションを使用するか
 * @return {boolean} true:使用する
 */
teasp.data.Pouch.prototype.isUseOwnReasonEarlyEnd = function(){
	return (this.getObj().common.treatEarlyEnd ? true : false);
};

/**
 * 【勤怠】遅刻取扱設定値
 * @return {number} 0:遅刻申請ありなら控除せず（自己都合かどうかは関係なく）, 1:遅刻申請ありかつ自己都合でない場合は控除せず, 2:遅刻申請ありかつ自己都合でない場合は控除せず＆始業時刻から出勤とみなす。
 */
teasp.data.Pouch.prototype.getTreatLateStart = function(){
	return this.getObj().common.treatLateStart;
};

/**
 * 【勤怠】早退取扱設定値
 * @return {number} 0:早退申請ありなら控除せず（自己都合かどうかは関係なく）, 1:早退申請ありかつ自己都合でない場合は控除せず, 2:早退申請ありかつ自己都合でない場合は控除せず＆終業時刻まで出勤とみなす。
 */
teasp.data.Pouch.prototype.getTreatEarlyEnd = function(){
	return this.getObj().common.treatEarlyEnd;
};

/**
 * 【勤怠】設定の集計モードを返す
 * @param {boolean} flag trueなら C_REAL か C_DISC しか返さない（月次集計値を得る場合、月次集計は C_REAL か C_DISC しかないので）
 * @return {string} 集計モード
 */
teasp.data.Pouch.prototype.getCalcMode = function(flag){
	if(this.getObj().month.config.workSystem == teasp.constant.WORK_SYSTEM_FLEX
	&& this.getObj().common.flexGraph
	&& !flag){
		return (this.getObj().common.discretionaryOption ? teasp.constant.C_FREAL : teasp.constant.C_FDISC);
	}
	return (this.getObj().common.discretionaryOption ? teasp.constant.C_REAL : teasp.constant.C_DISC);
};

/**
 * 【勤怠】有休残日数情報を返す.
 * （申請入力画面向け）
 *
 * @param {string|Object} dt 基準日付
 * @param {boolean} flag true:基準日付より後の付与・消化分は含まない
 * @return {string} 有休残日数情報
 */
teasp.data.Pouch.prototype.getDspYuqRemain = function(dt, flag){
	return this.getYuqRemain(this.getObj().yuqRemains, dt, flag);
};

teasp.data.Pouch.prototype.getYuqRemain = function(yqs, dt, flag){
	var remain  = { days: 0, time: 0, bt: 0, mix:true, display: '' };
	if(!yqs){
		return remain;
	}
	var yd = new teasp.logic.YuqDays();
	var spendM = {}; // 申請-消化数のマップ
	for(var i = 0 ; i < yqs.length ; i++){
		var yq = yqs[i];
		if(teasp.util.date.compareDate(dt, yq.limitDate) >= 0 || teasp.util.date.compareDate(dt, yq.startDate) < 0){
			continue;
		}
		var pt = 0;
		var st = 0;
		for(var j = 0 ; j < yq.children.length ; j++){
			var child = yq.children[j];
			if(child.time > 0 || child.lostFlag){
				pt += child.time;
			}else if(!flag || teasp.util.date.compareDate(child.date, dt) <= 0){
				if(!flag){
					st += child.time;
				}else{
					var prev = spendM[child.empApplyId];
					var ty = this.getEncloseSpendTimes(child, dt, yq.baseTime, prev);
					st -= ty.getAllMinutes();
					if(!prev){
						prev = ty;
						spendM[child.empApplyId] = prev;
					}else{
						prev.append(ty);
					}
				}
			}
		}
		var rt = pt + st;
		if(rt > 0){
			yd.append(new teasp.logic.YuqDays(yq.baseTime, rt));
		}
	}
	remain.days += yd.getDays();
	remain.time += yd.getMinutes();
	remain.display = teasp.message.getLabel('tm10001010', remain.days); // {0} 日
	if(remain.time > 0){
		remain.display += ' +' + teasp.util.time.timeValue(remain.time); // 時間
	}
	return remain;
};

/**
 * 【勤怠】有休消化時間を返す
 *
 * @param {Object}        child 消化オブジェクト
 * @param {string|Object} dt     基準日付（通常は月度の末日）
 * @param {number}        bt     時間単位休の基準時間(分) (ex)8時間で1日分の有休を消化するなら 480
 * @param {Object|null}   prev   消化済みデータ
 * @return {Object}       消化時間の YuqDays オブジェクト
 */
teasp.data.Pouch.prototype.getEncloseSpendTimes = function(child, dt, bt, prev){
	var d  = child.startDate; // {string} 'yyyy-MM-dd'
	var ed = child.endDate;   // {string} 'yyyy-MM-dd'
	var ty = new teasp.logic.YuqDays(bt, Math.abs(child.time));
	if(d == ed || !this.isYuqZanFlag()){
		return ty;
	}
	var exd = (child.excludeDate || '').split(/:/); // {string} 'yyyyMMdd:yyyyMMdd:...'
	var exm = {};
	for(var i = 0 ; i < exd.length ; i++){
		var m = /(\d{4})(\d{2})(\d{2})/.exec(exd[i]);
		if(m){
			var k = m[1] + '-' + m[2] + '-' + m[3];
			exm[k] = 1;
		}
	}
	dt = (typeof(dt) == 'object') ? teasp.util.date.formatDate(dt) : dt;
	var spn = 0; // 今月末までの消化数
	while(d <= ed){
		if(!exm[d]){
			if(d <= dt){
				spn++;
			}
		}
		d = teasp.util.date.addDays(d, 1);
	}
	var yd = new teasp.logic.YuqDays(bt, (spn * bt)); // 今月末までの消化数
	// 消化済み数データが渡された場合、その分を減算する。
	if(prev){
		yd.subtract(prev);
	}
	return (ty.getAllMinutes() <= yd.getAllMinutes() ? ty : yd);
};

teasp.data.Pouch.prototype.simulateDspYuqRemain = function(dt, _sp){
	var remain  = { days: 0, time: 0, display: '' };
	var yqs = this.getObj().yuqRemains;
	if(!yqs){
		return { spends:0, remain:remain };
	}
	var begDt = this.getEntryDate(); // 入社日
	var endDt = this.getEndDate();   // 退職日
	var sps = [_sp];
	// 当月の有休計画付与日を取得
	var dlst = this.getMonthDateList();
	var ed = dlst[dlst.length - 1];
	for(var i = 0 ; i < dlst.length ; i++){
		var dkey = dlst[i];
		if((begDt && dkey < begDt) || (endDt && endDt < dkey)){ // 入社日より前、退職日より後の有休計画付与日は無視
			continue;
		}
		var empDay = this.getEmpDay(dkey);
		if(empDay.isPlannedHoliday() && !empDay.isWorked()){
			sps.push({
				dt      : empDay.getKey(),
				days    : 1,
				minutes : 0,
				planned : 1
			});
		}
	}
	var nd = this.getNextYuqProvideDate(); // 次回付与予定日（推測値）
	if(!nd){
		nd = begDt;
		nd = (nd ? teasp.util.date.addMonths(nd, 6) : null); // 入社日の半年後の日付を得る
	}
	// dt以降の付与予定日を取得
	while(nd && nd <= dt){
		nd = teasp.util.date.addMonths(nd, 12);
	}
	// 当月以降～次回付与予定日までの有休計画付与日を取得（有効なものだけ）
	var mp = this.getPlannedHoldays();
	var pdl = [];
	for(var dkey in mp){
		if(!mp.hasOwnProperty(dkey)
		|| dkey <= ed          // 月度最終日以前なら無視
		|| (nd && nd < dkey)   // 次回付与予定日より後は無視
		|| !mp[dkey]           // 休日出勤申請が存在するので無視
		|| (begDt && dkey < begDt) // 入社日より前、退職日より後の有休計画付与日は無視
		|| (endDt && endDt < dkey)
		){
			continue;
		}
		var m = this.getEmpMonthByDate(dkey);
		if(m && m.apply && teasp.constant.STATUS_FIX.contains(m.apply.status)){ // 対象日の月度は確定済み
			continue;
		}
		pdl.push(dkey);
	}
	pdl = pdl.sort(function(a, b){
		return (a < b ? -1 : (a > b ? 1 : 0));
	});
	for(i = 0 ; i < pdl.length ; i++){
		sps.push({
			dt      : pdl[i],
			days    : 1,
			minutes : 0,
			planned : 2
		});
	}
	// 仮の有休消化オブジェクトを日付順にソート（#5476）
	sps = sps.sort(function(a, b){
		return (a.dt == b.dt ? 0 : (a.dt < b.dt ? -1 : 1));
	});
	var dyqs = dojo.clone(yqs); // 有休付与リストのクローンを作成
	dyqs = dyqs.sort(function(a, b){
		if(a.limitDate == b.limitDate){
			return (a.createdDate < b.createdDate ? -1 : 1);
		}
		return (a.limitDate < b.limitDate ? -1 : 1);
	});
	// 仮の有休消化をする
	for(var h = 0 ; h < sps.length ; h++){
		var sp = sps[h];
		var ysp = null;
		for(i = 0 ; i < dyqs.length ; i++){
			var yq = dyqs[i];
			if(teasp.util.date.compareDate(sp.dt, yq.limitDate) >= 0
			|| teasp.util.date.compareDate(sp.dt, yq.startDate) < 0){
				continue;
			}
			if(!ysp){
				ysp = new teasp.logic.YuqDays(yq.baseTime, (yq.baseTime * sp.days) + sp.minutes); // 消化対象
			}
			var pt = 0;
			var st = 0;
			for(var j = 0 ; j < yq.children.length ; j++){
				var child = yq.children[j];
				if(child.time > 0 || child.lostFlag){
					pt += child.time;
				}else{
					st += child.time;
				}
			}
			var rt = pt + st;
			if(rt <= 0){ // 残数なし
				continue;
			}
			if(yq.baseTime != ysp.getBaseTime()){
				ysp = new teasp.logic.YuqDays(yq.baseTime, ysp.calcMinutesByBaseTime(yq.baseTime));
			}
			st = Math.min(ysp.getAllMinutes(), rt);
			var child = {
				date     : sp.dt,
				time     : st * (-1),
				lostFlag : false
			};
			yq.children.push(child);
			ysp.subtract(new teasp.logic.YuqDays(yq.baseTime, st));  // 消化対象から消化できる数を減算
			sp.days    = ysp.getDays();
			sp.minutes = ysp.getMinutes();
			if(ysp.getAllMinutes() <= 0){
				break;
			}
		}
		if(sp.days > 0 || sp.minutes > 0){ // 消化しきれず残った
			sp.ng = true;
		}
	}
	return {
		spends: sps,
		remain: this.getYuqRemain(dyqs, dt)
	};
};

/**
 * 【勤怠】有休残日数情報を返す
 * @return {Array.<Object>} 有休残日数情報オブジェクトの配列
 */
teasp.data.Pouch.prototype.getYuqRemainObjs = function(){
	return (this.getObj().yuqRemains || []);
};

/**
 * 【勤怠】勤務パターンリストを返す。
 *
 * @param {?number} flag
 *     <ul>
 *     <li>1・・短期</li>
 *     <li>2・・長期</li>
 *     <li>それ以外・・全部</li>
 *     </ul>
 * @return {Array.<Object>} 勤務パターンリスト
 */
teasp.data.Pouch.prototype.getPatternList = function(flag){
	var lst = [];
	for(var key in this.getObj().patterns){
		var o = this.getObj().patterns[key];
		if((flag == 1 && o.range != teasp.constant.RANGE_SHORT)
		|| (flag == 2 && o.range != teasp.constant.RANGE_LONG)){
			continue;
		}
		lst.push(o);
	}
	return lst.sort(function(a, b){
		return a.order - b.order;
	});
};

/**
 * 【勤怠】休暇リストを返す。
 * 半休が適用されない勤務パターンの日の場合、半休を含めない。
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {Array.<Object>} 休暇リスト
 */
teasp.data.Pouch.prototype.getHolidayList = function(dkey){
	var lst = [];
	var day = this.getObj().days[dkey];
	var uh = day.pattern.useHalfHoliday;
	for(var i = 0 ; i < this.getObj().holidays.length ; i++){
		var o = this.getObj().holidays[i];
		if(!uh && (o.range == teasp.constant.RANGE_AM || o.range == teasp.constant.RANGE_PM)){
			continue;
		}
		lst.push(o);
	}
	return lst;
};

/**
 * 【勤怠】日数管理を行う休暇リストを返す。
 *
 * @return {Array.<string>} 休暇リスト
 */
teasp.data.Pouch.prototype.getHolidayManageNames = function(){
	var names = [];
	for(var i = 0 ; i < this.getObj().holidays.length ; i++){
		var o = this.getObj().holidays[i];
		if(o.managed && !names.contains(o.manageName)){
			names.push(o.manageName);
		}
	}
	return names;
};

/**
 * 【勤怠】勤務パターンオブジェクトの配列を返す
 * @return {Array.<Object>} 勤務パターンオブジェクトの配列
 */
teasp.data.Pouch.prototype.getPatternObjs = function(){
	return (this.getObj().patterns || []);
};

/**
 * 【勤怠】休暇オブジェクトの配列を返す
 * @return {Array.<Object>} 休暇オブジェクトの配列
 */
teasp.data.Pouch.prototype.getHolidayObjs = function(){
	return (this.getObj().holidays || []);
};

/**
 * 【勤怠】年度の起算月を返す
 * @return {number} 年度の起算月
 */
teasp.data.Pouch.prototype.getInitialDateOfYear = function(){
	return this.getObj().targetEmp.configBase.initialDateOfYear;
};

/**
 * 【勤怠】月度の起算日を返す
 * @return {number} 年度の起算日
 */
teasp.data.Pouch.prototype.getInitialDateOfMonth = function(){
	return this.getObj().targetEmp.configBase.initialDateOfMonth;
};

/**
 * 【勤怠】週の起算日を返す
 * @return {number} 週の起算曜日（0～6）
 */
teasp.data.Pouch.prototype.getInitialDayOfWeek = function(){
	return this.getObj().targetEmp.configBase.initialDayOfWeek;
};

/**
 * 【勤怠】年度の表記を返す
 * @return {number} 年度の表記<ul><li>1・・起算月に合わせる</li><li>2・・締め月に合わせる</li></ul>
 */
teasp.data.Pouch.prototype.getMarkOfYear = function(){
	return this.getObj().targetEmp.configBase.markOfYear;
};

/**
 * 【勤怠】月度の表記を返す
 * @return {number} 月度の表記<ul><li>1・・起算日に合わせる</li><li>2・・締め日に合わせる</li></ul>
 */
teasp.data.Pouch.prototype.getMarkOfMonth = function(){
	return this.getObj().targetEmp.configBase.markOfMonth;
};

/**
 * 【勤怠】代休管理をするか
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isUseDaiqManage = function(){
	return this.getObj().targetEmp.daiqManage.useDaiqManage;
};

/**
 * 【勤怠】半日代休を許可するか
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isUseHalfDaiq = function(){
	return this.getObj().targetEmp.daiqManage.useHalfDaiq;
};

/**
 * 【勤怠】代休の有効期限
 * @return {Object}
 */
teasp.data.Pouch.prototype.getDaiqLimit = function(){
	return this.getObj().targetEmp.daiqManage.daiqLimit;
};

/**
 * 【勤怠】終日代休可能な休日労働時間
 * @return {number}
 */
teasp.data.Pouch.prototype.getDaiqAllBorderTime = function(){
	return this.getObj().targetEmp.daiqManage.daiqAllBorderTime;
};

/**
 * 【勤怠】半日代休可能な休日労働時間
 * @return {number}
 */
teasp.data.Pouch.prototype.getDaiqHalfBorderTime = function(){
	return this.getObj().targetEmp.daiqManage.daiqHalfBorderTime;
};

/**
 * 【勤怠】申請時に代休有無を指定するか
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isUseDaiqReserve = function(){
	return (this.getObj().targetEmp.daiqManage.useDaiqManage && this.getObj().targetEmp.daiqManage.useDaiqReserve);
};

/**
 * 【勤怠】法定休日の代休を許可するか
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isUseDaiqLegalHoliday = function(){
	return this.getObj().targetEmp.daiqManage.useDaiqLegalHoliday;
};

/**
 * 【勤怠】休日出勤の勤怠を平日扱いするか
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isUseRegulateHoliday = function(){
	return (this.getObj().targetEmp.daiqManage.useDaiqManage && this.getObj().targetEmp.daiqManage.useRegulateHoliday);
};

/**
 * 【勤怠】振替休日に出勤した場合は代休不可か
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isNoDaiqExchanged = function(){
	return (this.getObj().targetEmp.daiqManage.useDaiqManage && this.getObj().targetEmp.daiqManage.noDaiqExchanged);
};

/**
 * 【勤怠】指定日が勤怠規則平日準拠の休日出勤であるか.<br/>
 * 「休日出勤の勤怠規則は平日に準拠する」がオンかつ「代休予定あり」の休日出勤申請をしていることが条件
 *
 * @param {string} dkey 日付（'yyyy-MM-dd'）
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isRegulateHoliday = function(dkey){
	if(!dkey){
		return false;
	}
	var day = this.getDayObj(dkey);
	if(day.dayType == teasp.constant.DAY_TYPE_NORMAL){
		return false;
	}
	return (day.rack
	&& day.rack.validApplys
	&& day.rack.validApplys.kyushtu.length > 0
//    && day.rack.validApplys.kyushtu[0].daiqReserve
	&& day.rack.validApplys.kyushtu[0].useRegulateHoliday);
};

/**
 * 【勤怠】勤怠設定オブジェクトを返す
 *
 * @param {string=} dkey 日付('yyyy-MM-dd')、nullの場合、当月の勤怠設定を返す
 * @return {Object} 勤怠設定オブジェクト
 */
teasp.data.Pouch.prototype.getConfigObj = function(dkey){
	if(!dkey){
		return this.getObj().config;
	}
	var m = this.getEmpMonthByDate(dkey);
	return (m ? m.config : null);
};

/**
 * 【勤怠】時間表記オプションを返す
 *
 * @return {Object} 時間表記オプション
 */
teasp.data.Pouch.prototype.getTimeFormObj = function(){
	var tf = {
		form       : 'h:mm',
		round      : 1,
		roundBegin : 1,
		roundEnd   : 2
	};
	if(this.getObj().config.timeRound != '1'){
		tf.round      = parseInt(this.getObj().config.timeRound, 10);
		tf.roundBegin = parseInt((this.getObj().config.timeRoundBegin || '1'), 10);
		tf.roundEnd   = parseInt((this.getObj().config.timeRoundEnd   || '2'), 10);
	}
	if(this.getObj().config.timeFormat != 'hh:mm'){
		tf.form = this.getObj().config.timeFormat;
	}
	return tf;
};

/**
 * 【勤怠】労働時間制を返す
 * @return {string} 労働時間制
 *     <ul>
 *     <li>0・・固定労働時間制</li>
 *     <li>1・・フレックスタイム制</li>
 *     <li>2・・変形労働時間制</li>
 *     </ul>
 */
teasp.data.Pouch.prototype.getWorkSystem = function(){
	return this.getObj().config.workSystem;
};

/**
 * 時間単位休の基準時間
 * @returns {number}
 */
teasp.data.Pouch.prototype.getBaseTime = function(){
	return this.getObj().config.baseTime;
};

/**
 * 時間単位休の基準時間（日数管理用）
 * @returns {number}
 */
teasp.data.Pouch.prototype.getBaseTimeForStock = function(){
	return this.getObj().config.baseTimeForStock || null;
};

/**
 * 【勤怠】変形労働の期間を返す
 * @return {number} 変形労働の期間
 *     <ul>
 *     <li>0・・１週間</li>
 *     <li>1・・１ヶ月</li>
 *     <li>3・・３カ月</li>
 *     <li>6・・６カ月</li>
 *     <li>12・・１年</li>
 *     </ul>
 */
teasp.data.Pouch.prototype.getVariablePeriod = function(){
	return this.getObj().config.variablePeriod;
};

/**
 * 【勤怠】遅刻申請を使用するか
 * @return {boolean} true:使う
 */
teasp.data.Pouch.prototype.isUseLateStartApply = function(){
	return this.getObj().config.useLateStartApply;
};

/**
 * 遅刻申請必須
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isRequiredLateStartApply = function(){
	var c = this.getObj().config.config;
	return (this.getObj().config.useLateStartApply && c && c.empApply.requireLateApply) || false;
};

/**
 * 【勤怠】早退申請を使用するか
 * @return {boolean} true:使う
 */
teasp.data.Pouch.prototype.isUseEarlyEndApply = function(){
	return this.getObj().config.useEarlyEndApply;
};

/**
 * 早退申請必須
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isRequiredEarlyEndApply = function(){
	var c = this.getObj().config.config;
	return (this.getObj().config.useEarlyEndApply && c && c.empApply.requireEarlyEndApply) || false;
};

/**
 * 【勤怠】残業申請を使用するか
 * @return {number} 0:使用しない 1:使用する 2:使用するかつ申請時間帯以外の残業を認めない 4:使用するかつ再申請モードを使用 6:使用するかつ申請時間帯以外の残業を認めないかつ再申請モードを使用
 */
teasp.data.Pouch.prototype.getUseOverTimeFlag = function(){
	return this.getObj().config.useOverTimeFlag;
};

/**
 * 残業の期間申請を使用するか
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isUseBulkOverTime = function(){
	var c = this.getObj().config.config;
	return (c ? c.empApply.useBulkOverTime : false);
};

/**
 * 残業X分以上の申請なしの勤務はエラー
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isOverTimeRequireTime = function(){
	var c = this.getObj().config.config;
	var v = (c && c.empApply.overTimeRequireTime) || 0;
	return (v > 0);
};

/**
 * 残業X分以上の申請なしの勤務はエラー
 * @param {number} disc !=0:裁量労働
 * @returns {number} <=0:オフ >0:制限あり
 */
teasp.data.Pouch.prototype.getOverTimeRequireTime = function(disc){
	if(!(this.getObj().config.useOverTimeFlag & 2)){
		return 0;
	}
	if(this.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER || disc){
		return 0;
	}
	var c = this.getObj().config.config;
	var n = (c && c.empApply.overTimeRequireTime) || 0;
	return (n > 0 ? n : 0);
};

/**
 * 【勤怠】早朝勤務申請を使用するか
 * @return {number} 0:使用しない 1:使用する 2:使用するかつ申請時間帯以外の残業を認めない 4:使用するかつ再申請モードを使用 6:使用するかつ申請時間帯以外の残業を認めないかつ再申請モードを使用
 */
teasp.data.Pouch.prototype.getUseEarlyWorkFlag = function(){
	return this.getObj().config.useEarlyWorkFlag;
};

/**
 * 早朝勤務の期間申請を使用するか
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isUseBulkEarlyWork = function(){
	var c = this.getObj().config.config;
	return (c ? c.empApply.useBulkEarlyWork : false);
};

/**
 * 早朝勤務X分以上の申請なしの勤務はエラー
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isEarlyWorkRequireTime = function(){
	var c = this.getObj().config.config;
	var v = (c && c.empApply.earlyWorkRequireTime) || 0;
	return (v > 0);
};

/**
 * 早朝勤務X分以上の申請なしの勤務はエラー
 * @param {number} disc !=0:裁量労働
 * @returns {number} <=0:オフ >0:制限あり
 */
teasp.data.Pouch.prototype.getEarlyWorkRequireTime = function(disc){
	if(!(this.getObj().config.useEarlyWorkFlag & 2)){
		return 0;
	}
	if(this.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER || disc){
		return 0;
	}
	var c = this.getObj().config.config;
	var n = (c && c.empApply.earlyWorkRequireTime) || 0;
	return (n > 0 ? n : 0);
};

/**
 * 未入力日の扱い＝エラーとする
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isRequireDailyInput = function(){
	var c = this.getObj().config.config;
	return (c && c.requireDailyInput) || false;
};

/**
 * 【勤怠】日次確定を使用するか
 * @return {boolean} true:使用する
 */
teasp.data.Pouch.prototype.isUseDailyApply = function(){
	return this.getObj().config.useDailyApply;
};

/**
 * 【勤怠】直行・直帰申請を使用するか
 * @return {boolean} true:使用する
 */
teasp.data.Pouch.prototype.isUseDirectApply = function(){
	return this.getObj().config.useDirectApply;
};

/**
 * 【勤怠】（直行・直帰申請の）作業区分
 * @return {Array.<string>}
 */
teasp.data.Pouch.prototype.getWorkTypeList = function(){
	var s = (this.getObj().config.workTypeList || '');
	var l = s.split(/\r?\n/);
	for(var i = l.length - 1 ; i >= 0 ; i--){
		if(l[i] == ''){
			l.splice(i, 1);
		}
	}
	return l;
};

/**
 * 【勤怠】勤怠時刻修正申請を使用するか
 *
 * @since 201208
 * @return {boolean} true:使用する
 */
teasp.data.Pouch.prototype.isUseReviseTimeApply = function(){
	return this.getObj().config.useReviseTimeApply;
};

/**
 * 【勤怠】休日出勤申請を使用するか
 *
 * @since 201208
 * @return {number} 0:使用しない 1:使用する 2:使用するかつ申請時間帯以外の残業を認めない 4:使用するかつ再申請モードを使用 6:使用するかつ申請時間帯以外の残業を認めないかつ再申請モードを使用
 */
teasp.data.Pouch.prototype.getUseHolidayWorkFlag = function(){
	return this.getObj().config.useHolidayWorkFlag;
};

/**
 * 休日出勤申請の休憩時間の変更を許可
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isHolidayWorkRestChangeable = function(){
	if(this.isUseRegulateHoliday()){
		// 休日出勤の勤怠規則は平日に準拠する＝オンの場合は不可
		return false;
	}
	var c = this.getObj().config.config;
	return (c ? c.empApply.holidayWorkRestChangeable : false);
};

/**
 * 出社・退社時間を含む休憩は入力できないようにする
 * @returns {Boolean}
 */
teasp.data.Pouch.prototype.isProhibitBorderRestTime = function(){
	var c = this.getObj().config.config;
	return (c && c.prohibitBorderRestTime) || false;
};

/**
 * 【勤怠】未来の時刻は入力不可とするか
 *
 * @since 201208
 * @return {boolean} true:不可とする
 */
teasp.data.Pouch.prototype.isPastTimeOnly = function(){
	return this.getObj().config.pastTimeOnly;
};

/**
 * 【勤怠】個人単位で平日・休日を設定できるか
 *
 * @since 201208
 * @return {boolean} true:設定できる
 */
teasp.data.Pouch.prototype.isChangeDayType = function(){
	return this.getObj().config.changeDayType;
};

/**
 * 法定休日を指定可
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isAllowSelectionOfLegalHoliday = function(){
	var c = this.getObj().config.config;
	return (this.isChangeDayType() && c && c.empApply && c.empApply.allowSelectionOfLegalHoliday) || false;
};

/**
 * 勤務パターンの指定不可
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isProhibitWorkShiftChange = function(){
	var c = this.getObj().config.config;
	return (c && c.empApply && c.empApply.prohibitWorkShiftChange) || false;
};

/**
 * 勤務日/非勤務日の表示
 */
teasp.data.Pouch.prototype.getDisplayDayType = function(dayType, defaultVal){
	switch(dayType){
	case '0':
		return teasp.message.getLabel('normalDay_label'); // 勤務日
	case '1':
		return teasp.message.getLabel('tf10008800'); // 非勤務日(所定休日)
	case '2':
		return teasp.message.getLabel('tf10008810'); // 非勤務日(法定休日)
	default:
		return defaultVal || '';
	}
};

/**
 * 【勤怠】振替の期間制限を得る
 *
 * @since 201208
 * @return {number|null} 制限数
 */
teasp.data.Pouch.prototype.getExchangeLimit = function(){
	var e1 = this.getObj().config.exchangeLimit;
	// ExchangeLimit__c（振替の期間制限（休日→平日））が Null であれば
	// 「振替の期間制限あり」がオフと設定されている。その場合は 1（＝次月度内）とする。
	// （Ｖ３の仕様に合わせる）
	return (e1 === null ? 1 : e1);
};

/**
 * 【勤怠】振替の期間制限を得る
 *
 * @since 201211
 * @return {number|null} 制限数
 */
teasp.data.Pouch.prototype.getExchangeLimit2 = function(){
	var e2 = this.getObj().config.exchangeLimit2;
	if(e2 === null){
		// ExchangeLimit2__c（振替の期間制限（平日→休日））が Null ということは
		// 「振替の期間制限あり」がオフと設定されているか、またはＶ３以前からＶ４へアップグレードした後のどちらか。
		// どちらにせよ、その場合はまず ExchangeLimit__c と同値にして、
		// 1 を超える値なら 1（＝次月度内＝ExchangeLimit2__c の最大値）を返す
		e2 = this.getExchangeLimit();
		return (e2 > 1 ? 1 : e2);
	}
	return e2;
};

/**
 * 【勤怠】工数時間のチェックをするか
 * @return {boolean} true:する
 */
teasp.data.Pouch.prototype.isCheckWorkingTime = function(){
	return (this.isUseDailyApply() && this.getObj().config.checkWorkingTime);
};

/**
 * 【勤怠】日次確定申請漏れをチェックするか
 * @return {boolean} true:する
 */
teasp.data.Pouch.prototype.isCheckDailyFixLeak = function(){
	return (this.isUseDailyApply() && this.getObj().config.checkDailyFixLeak);
};

/**
 * 【勤怠】月次確定時に工数入力時間のチェックをする
 * @return {boolean} true:する
 */
teasp.data.Pouch.prototype.isCheckWorkingTimeMonthly = function(){
	return this.getObj().config.checkWorkingTimeMonthly;
};

/**
 * 【勤怠】月単位の端数処理
 * @return {number} 0:なし、15:15分単位、30:30分単位、60:60分単位（すべて四捨五入）
 */
teasp.data.Pouch.prototype.getRoundMonthlyTime = function(){
	return this.getObj().config.roundMonthlyTime;
};

/**
 * 【勤怠】法定休憩時間のチェック
 * @return {Object}
 */
teasp.data.Pouch.prototype.getRestTimeCheck = function(){
	return this.getObj().config.restTimeCheck;
};

/**
 * 【勤怠】法定休憩時間のチェックをするか
 * @return {Object}
 */
teasp.data.Pouch.prototype.isValidRestTimeCheck = function(){
	var rcs = this.getRestTimeCheck() || [];
	for(var i = 0 ; i < rcs.length ; i++){
		if(rcs[i].check){
			return true;
		}
	}
	return false;
};

/**
 * 【勤怠】勤怠グラフにコア時間を表示
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isCoreTimeGraph = function(){
	return this.getObj().config.coreTimeGraph;
};

/**
 * 【勤怠】フレックス開始時間を返す
 * @return {boolean}
 */
teasp.data.Pouch.prototype.getFlexStartTime = function(){
	return this.getObj().config.flexStartTime;
};

/**
 * 【勤怠】フレックス終了時間を返す
 * @return {boolean}
 */
teasp.data.Pouch.prototype.getFlexEndTime = function(){
	return this.getObj().config.flexEndTime;
};

/**
 * 【勤怠】勤怠関連の申請に承認ワークフローを使うか
 * @return {boolean} true:使う
 */
teasp.data.Pouch.prototype.isUseWorkFlow = function(){
	return this.getObj().config.useWorkFlow;
};

/**
 * 【勤怠】個人単位の振替許可するか
 * @return {boolean} true:個人単位の振替許可する
 */
teasp.data.Pouch.prototype.isUseExchangeDate = function(){
	return this.getObj().config.useMakeupHoliday;
};

/**
 * 【勤怠】勤務パターン変更を許可するか
 * @return {boolean} true:勤務パターン変更を許可する
 */
teasp.data.Pouch.prototype.isUseChangePattern = function(){
	return this.getObj().config.changePattern;
};

/**
 * 【勤怠】個人のシフト勤務設定を許可するか
 * @return {boolean} true:個人のシフト勤務設定を許可する
 */
teasp.data.Pouch.prototype.isUseChangeShift = function(){
	return this.getObj().config.changeShift;
};

/**
 * 【勤怠】休日１を法定休日とするか
 * @return {boolean} true:休日１を法定休日とする
 */
teasp.data.Pouch.prototype.isUseLegalHoliday = function(){
	return (this.getObj().config.holidays.indexOf('2') >= 0);
};

/**
 * 【勤怠】法定休日を自動判定するか
 * @return {boolean} true:自動判定する
 */
teasp.data.Pouch.prototype.isAutoLegalHoliday = function(){
	return this.getObj().config.autoLegalHoliday;
};

/**
 * 【共通】祝日は休日ではないか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isNonPublicHoliday = function(){
	return this.getObj().config.nonPublicHoliday;
};

/**
 * 【共通】半日代休を勤務時間とみなすか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isHalfDaiqReckontoWorked = function(){
	return this.getObj().config.halfDaiqReckontoWorked;
};

/**
 * 【勤怠】デフォルトの勤務パターンで裁量労働か
 * @return {boolean} true:デフォルトの勤務パターンで裁量労働か
 */
teasp.data.Pouch.prototype.isDefaultUseDiscretionary = function(){
	return this.getObj().config.defaultPattern.useDiscretionary;
};

/**
 * 【勤怠】勤務確定済みか
 *
 * @param {Object=} month 月次オブジェクト（省略可）
 * @param {boolean=} flag trueの場合、部署確定済みなら他の条件は無視して確定済みと判定
 * @return {boolean} true:済み
 */
teasp.data.Pouch.prototype.isEmpMonthFixed = function(month, flag){
	if(this.isDeptMonthFixed(month) && (flag || (month || this.getObj().month).empty)){
		return true;
	}
	return (teasp.constant.STATUS_FIX.contains(this.getEmpMonthApplyStatus(month)));
};

/**
 * 【勤怠】部署確定済みか
 *
 * @param {Object=} month 月次オブジェクト（省略可）
 * @return {boolean} true:済み
 */
teasp.data.Pouch.prototype.isDeptMonthFixed = function(month){
	var m = (month || this.getObj().month);
	if(!m || !m.deptMonth){
		return false;
	}
	return teasp.constant.STATUS_FIX.contains(m.deptMonth.status);
};

/**
 * 【勤怠】指定日が含まれる月は勤務確定済みか<br/>
 *  ※注) 引数の日付は持ってるデータの範囲内の日付であること。
 *
 * @param {string} dkey 日付(yyyy-MM-dd)
 * @return {boolean} true:済み
 */
teasp.data.Pouch.prototype.isEmpMonthFixedByDate = function(dkey){
	var m = this.getEmpMonthByDate(dkey);
	return (teasp.constant.STATUS_FIX.contains(m.apply.status));
};

/**
 * 【勤怠】勤務表はリードオンリー（参照モードで開いているor勤務確定済み）か
 * @return {boolean} true:勤務表はリードオンリー（参照モードで開いているor勤務確定済み）
 */
teasp.data.Pouch.prototype.isEmpMonthReadOnly = function(){
	return (this.isEmpMonthFixed() || this.isReadOnly());
};

/**
 * 【勤怠】当月の月度を返す
 * @return {number} 当月の月度
 */
teasp.data.Pouch.prototype.getYearMonth = function(){
	return this.getObj().month.yearMonth;
};

/**
 * 当月の月度を "YYYY年MM月度" 形式で返す
 * flag=true なら "YYYY年MM月" 形式で返す
 * @return {string}
 */
teasp.data.Pouch.prototype.getYearMonthJp = function(flag){
	var ym = this.getObj().month.yearMonth;
	var sn = this.getObj().month.subNo;
	return teasp.util.date.formatMonth((flag ? 'zv00000021' : 'zv00000020'), Math.floor(ym / 100), (ym % 100), sn);
};

/**
 * 当月の開始日を返す
 * @return {string|null}
 */
teasp.data.Pouch.prototype.getStartDate = function(){
	return this.getObj().month.startDate || null;
};

/**
 * 当月のサブナンバーを返す
 * @return {number|null} 当月のサブナンバー
 */
teasp.data.Pouch.prototype.getSubNo = function(){
	return this.getObj().month.subNo || null;
};

/**
 * 【勤怠】月度最終更新日を返す。※排他制御で使用
 * @return {string} 月度最終更新日（long値の文字列）
 */
teasp.data.Pouch.prototype.getLastModifiedDate = function(){
	return '' + (this.getObj().month.lastModifiedDate || '');
};

/**
 * 【勤怠】月度最終更新日をセット
 * @param {string} lmd 月度最終更新日（long値の文字列）
 */
teasp.data.Pouch.prototype.setLastModifiedDate = function(lmd){
	if(this.getObj().month){
		this.getObj().month.lastModifiedDate = lmd;
	}
};

/**
 * 【勤怠】先月度の月度最終更新日を返す。
 * @return {string} 月度最終更新日（long値の文字列）
 */
teasp.data.Pouch.prototype.getPrevMonthLastModifiedDate = function(){
	if(!this.getObj().month || !this.getObj().empMonthMap){
		return null;
	}
	var ym = this.getObj().month.yearMonth;
	var sd = this.getObj().month.startDate;
	var o = this.getEmpMonth(ym, sd, -1);
	var m = this.getObj().empMonthMap[o.startDate];
	return '' + ((m && m.lastModifiedDate) || '');
};

/**
 * 【勤怠】月度オブジェクトの要素を返す
 * @param {string} key キー
 * @return {*} 月度オブジェクトの要素
 */
teasp.data.Pouch.prototype.getMonthValueByKey = function(key){
	return this.getObj().month[key];
};

/**
 * 【勤怠】月度オブジェクトの要素の時間情報を返す
 * @param {string} key キー
 * @param {boolean=} flag 表示形式 true:分のまま false:設定に従い h:mm か #.00
 * @param {(string|number|null)=} defaultVal t の値が null の場合の代替値
 * @return {string|number} 時間情報
 */
teasp.data.Pouch.prototype.getMonthTimeByKey = function(key, flag, defaultVal){
	return this.getDisplayTime(this.getObj().month[key], flag, defaultVal);
};

/**
 * 【勤怠】勤務確定の申請IDを返す
 * @return {string} 勤務確定の申請ID
 */
teasp.data.Pouch.prototype.getEmpMonthApplyId = function(){
	return this.getObj().month.apply.id;
};

/**
 * 【勤怠】勤務確定の申請のステータスを返す
 *
 * @param {Object=} month 月次オブジェクト（省略可）
 * @param {boolean=} flag trueのとき、'ＸＸ取消'なら'未確定'と返す
 * @return {string} 勤務確定の申請のステータス
 */
teasp.data.Pouch.prototype.getEmpMonthApplyStatus = function(month, flag){
	var status = null;
	var m = (month || this.getObj().month);
	// 管理者以外は部署月次ステータスを返す
	var deptMonth = m.deptMonth;
	if(!this.isSysAdmin()
	&& !this.isAdmin()
	&& deptMonth
	&& deptMonth.status
	&& teasp.constant.STATUS_APPROVES.contains(deptMonth.status)){
		status = deptMonth.status;
	}else{
		status = (m.apply ? m.apply.status : null);
	}
	if(flag && teasp.constant.STATUS_CANCELS.contains(status)){ // ＸＸ取消
		return teasp.constant.STATUS_NOTADMIT; // 未確定
	}
	return status || teasp.constant.STATUS_NOTADMIT;
};

/**
 * 【勤怠】勤務確定の申請の承認履歴を返す
 * @return {Array.<Object>} 勤務確定の申請の承認履歴オブジェクトの配列
 */
teasp.data.Pouch.prototype.getEmpMonthApplySteps = function(){
	return (this.getObj().month.apply.steps || []);
};

/**
 * 【勤怠】勤務確定の申請の承認履歴をセット
 * @param {Array.<Object>} steps 承認履歴オブジェクトの配列
 */
teasp.data.Pouch.prototype.setEmpMonthApplySteps = function(steps){
	this.getObj().month.apply.steps = steps;
};

/**
 * 【勤怠】法定休憩時間のチェックリストを返す
 * @return {Array.<Object>} 法定休憩時間のチェックリスト
 */
teasp.data.Pouch.prototype.getRestTimeChecks = function(){
	return this.getObj().month.config.restTimeCheck;
};

/**
 * 【勤怠】当月の日付リストを返す
 *
 * @return {Array.<string>} 日付('yyyy-MM-dd')の配列
 */
teasp.data.Pouch.prototype.getMonthDateList = function(){
	return teasp.util.date.getDateList(this.getObj().month.startDate, this.getObj().month.endDate);
};

/**
 * 【勤怠】日付が当月度の期間内か
 * @param {string|Date} d 日付（Stringの場合は 'yyyy-MM-dd'）
 * @return {boolean} 日付が当月度の期間内である
 */
teasp.data.Pouch.prototype.isDayInMonth = function(d){
	return (teasp.util.date.compareDate(this.getObj().month.startDate, d) <= 0 && teasp.util.date.compareDate(d, this.getObj().month.endDate) <= 0);
};

/**
 * 【勤怠】当月の無効な申請情報（申請ID、理由、日付（'yyyy/MM/dd'）を格納）を返す。
 *
 * @param {boolean=} flag
 * @return {Array.<Object>} 無効な申請情報オブジェクトの配列
 */
teasp.data.Pouch.prototype.getInvalidApplys = function(flag){
	var dlst = this.getMonthDateList();
	var lst = [];
	for(var i = 0 ; i < dlst.length ; i++){
		lst = lst.concat(this.getInvalidApplysOfDay(dlst[i], flag));
	}
	return lst;
};

/**
 * 【勤怠】指定日の無効な申請情報（申請ID、理由、日付（'yyyy/MM/dd'）を格納）を返す。
 *
 * @param {string} dkey
 * @param {boolean=} flag
 * @param {Object=} timeIn
 * @return {Array.<Object>} 無効な申請情報オブジェクトの配列
 */
teasp.data.Pouch.prototype.getInvalidApplysOfDay = function(dkey, flag, timeIn){
	var lst = [];
	var day = this.getObj().days[dkey];
	var st = (timeIn && timeIn.startTime) || day.startTime;
	var et = (timeIn && timeIn.endTime  ) || day.endTime;
	var dayType = (day.interim ? day.interim.dayType : day.dayType);
	if(dayType == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
		dayType = teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
	}
	if(dayType != teasp.constant.DAY_TYPE_NORMAL
	&& teasp.util.time.isValidRange(st, et)
	&& !day.rack.validApplys.kyushtu.length
	&& ((!day.workFlag && !day.autoLH) || !day.rack.worked)){
		lst.push({
			id   : null,
			text : teasp.message.getLabel('tm10003620'), // 休日の労働時間は休日出勤申請がなければ無効です。
			date : teasp.util.date.formatDate(dkey, 'SLA')
		});
	}
	if(day.rack.holidayJoin && day.rack.holidayJoin.flag == 3
	&& teasp.util.time.isValidRange(st, et)){
		lst.push({
			id   : null,
			text : teasp.message.getLabel('tk10005340'), // 終日の休暇日に入力された労働時間は無効です。
			date : teasp.util.date.formatDate(dkey, 'SLA')
		});
	}
	if(dayType == teasp.constant.DAY_TYPE_NORMAL
	&& day.plannedHoliday
	&& teasp.util.time.isValidRange(st, et)
	&& !day.rack.validApplys.kyushtu.length
	&& !day.workFlag
	&& !day.autoLH){
		lst.push({
			id   : null,
			text : teasp.message.getLabel('tm10003654'), // 有休計画付与日の労働時間は休日出勤申請がなければ無効です。
			date : teasp.util.date.formatDate(dkey, 'SLA')
		});
	}
	if(this.isLeavingAcrossNextDay()  // 2暦日で勤務日種別が異なる24:00以降の入力不可
	&& typeof(et) == 'number'
	&& et > 1440){
		if(this.isProhibitAcrossNextDayOfHolidayWork() // 休日出勤時には24:00を超えた勤務を許さない
		&& dayType != teasp.constant.DAY_TYPE_NORMAL
		&& !day.autoLH
		&& day.rack.validApplys.kyushtu.length
		){
			lst.push({
				id   : null,
				text : teasp.message.getLabel('tf10008430'), // 休日出勤時に24:00以降の勤務入力はできません。
				date : teasp.util.date.formatDate(dkey, 'SLA')
			});
		}else{
			var nextDkey = teasp.util.date.addDays(dkey, 1);
			var nextDay = (this.getObj().days[nextDkey] || { dayType : teasp.constant.DAY_TYPE_NORMAL });
			var nextDayType = (nextDay.interim ? nextDay.interim.dayType : nextDay.dayType);
			if(nextDayType == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
				nextDayType = teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
			}
			if(dayType != nextDayType){
				lst.push({
					id   : null,
					text : teasp.message.getLabel('tk10001153',
							teasp.constant.getDayTypeWord(dayType),
							teasp.constant.getDayTypeWord(nextDayType)
							), // 日付をまたぎ{0}から{1}となるため、24:00以降の勤務入力はできません
					date : teasp.util.date.formatDate(dkey, 'SLA')
				});
			}
		}
	}
	for(var j = 0 ; j < (day.rack.invalidApplys || []).length ; j++){
		var ia = day.rack.invalidApplys[j];
		switch(ia.reason){
		case teasp.constant.REASON_RANGE_DUPL:
			lst.push({
				id   : ia.id,
				text : teasp.message.getLabel('tm10003630'), // 休暇申請が重複しています
				date : teasp.util.date.formatDate(dkey, 'SLA')
			});
			break;
		case teasp.constant.REASON_NOHALF:
			lst.push({
				id   : ia.id,
				text : teasp.message.getLabel('tm10003640'), // 半日休を取れない勤務パターンの日に半日休が申請されています
				date : teasp.util.date.formatDate(dkey, 'SLA')
			});
			break;
		case teasp.constant.REASON_NG_HOLIDAY:
			lst.push({
				id   : ia.id,
				text : teasp.message.getLabel('tm10003650'), // 休日に休暇申請が出ています。申請取消をしてください。
				date : teasp.util.date.formatDate(dkey, 'SLA')
			});
			break;
		case teasp.constant.REASON_NG_KYUSHTU:
			lst.push({
				id   : ia.id,
				text : teasp.message.getLabel('tm10003660'), // 平日に休日出勤申請が出ています。申請取消をしてください。
				date : teasp.util.date.formatDate(dkey, 'SLA')
			});
			break;
		case teasp.constant.REASON_NG_EXCHANGE:
			lst.push({
				id   : ia.id,
				text : teasp.message.getLabel('tm10003670'), // 振替申請の振替元と振替先の組合せが不正です。申請取消をしてください。
				date : teasp.util.date.formatDate(dkey, 'SLA')
			});
			break;
		case teasp.constant.REASON_NG_SHIFTCHANGE1:
			lst.push({
				id   : ia.id,
				text : teasp.message.getLabel('tf10011320'), // シフト振替申請の組合せが不正です。申請を取り消してください。
				date : teasp.util.date.formatDate(dkey, 'SLA')
			});
			break;
		default:
			break;
		}
	}
	if(flag){
		for(j = 0 ; j < (day.rack.warningApplys || []).length ; j++){
			var ia = day.rack.warningApplys[j];
			switch(ia.reason){
			case teasp.constant.REASON_NG_ZANGYO:
			case teasp.constant.REASON_NG_EARLYSTART:
			case teasp.constant.REASON_NG_LATESTART:
			case teasp.constant.REASON_NG_EARLYEND:
				lst.push({
					id   : ia.id,
					text : teasp.message.getLabel('tm10003651', ia.apply.applyType), // 休日に{0}が出ています。申請取消をしてください。
					date : teasp.util.date.formatDate(dkey, 'SLA')
				});
				break;
			case teasp.constant.REASON_NOT_EXCHANGE:
				lst.push({
					id   : ia.id,
					text : teasp.message.getLabel('tm10003652', ia.apply.applyType), // 有休計画付与日に{0}が出ています。申請取消をしてください。
					date : teasp.util.date.formatDate(dkey, 'SLA')
				});
				break;
			case teasp.constant.REASON_NG_DAYTYPE1:
				lst.push({
					id   : ia.id,
					text : teasp.message.getLabel('tm10003653'), // 有休計画付与日に勤務日の変更はできません。勤務時間変更申請を取り消してください。
					date : teasp.util.date.formatDate(dkey, 'SLA')
				});
				break;
			default:
				break;
			}
		}
	}
	return lst;
};

/**
 * 【勤怠】欠勤日（＝平日、かつ年休計画付与日でない、かつ終日休暇でない、かつ出退時刻のどちらか未入力）か
 *
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {boolean} true:欠勤日である
 */
teasp.data.Pouch.prototype.isEmptyDay = function(dkey){
	var day = this.getObj().days[dkey];
	if((day.dayType == teasp.constant.DAY_TYPE_NORMAL || day.workFlag || day.autoLH)
	&& (!day.rack.holidayJoin || day.rack.holidayJoin.flag != 3)
	&& !day.plannedHoliday
	&& (!day.deco.ct.st || !day.deco.ct.et)){
		return true;
	}
	return false;
};

/**
 * 【勤怠】当月の欠勤日の数を返す
 *
 * @return {number} 欠勤日数
 */
teasp.data.Pouch.prototype.getEmptyDayCount = function(){
	var dlst = this.getMonthDateList();
	var cnt = 0;
	for(var i = 0 ; i < dlst.length ; i++){
		var dkey = dlst[i];
		if(this.isAlive(dkey) && this.isEmptyDay(dkey)){
			cnt++;
		}
	}
	return cnt;
};

/**
 * 【勤怠】申請IDから申請オブジェクトを返す
 *
 * @return {?Object} 申請オブジェクト
 */
teasp.data.Pouch.prototype.getApplyObjById = function(id){
	for(var i = 0 ; i < this.getObj().applys.length ; i++){
		if(teasp.util.equalId(this.getObj().applys[i].id, id)){
			return this.getObj().applys[i];
		}
	}
	return null;
};

/**
 * 【勤怠】日付から勤怠月度オブジェクトを返す
 *
 * @param {string|Object} dkey 日付('yyyy-MM-dd')
 * @param {number=} amount 加算月数（マイナス可）
 * @return {?Object} 勤怠月度オブジェクト
 */
teasp.data.Pouch.prototype.getEmpMonthByDate = function(dkey, amount){
	for(var key in this.getObj().empMonthMap){
		if(this.getObj().empMonthMap.hasOwnProperty(key)){
			var m = this.getObj().empMonthMap[key];
			if(m.startDate <= dkey && dkey <= m.endDate){
				if(amount){
					var o = this.getEmpMonth(null, m.startDate, amount);
					m = this.getObj().empMonthMap[o.startDate];
				}
				return m;
			}
		}
	}
	return null;
};

/**
 * 【勤怠】月度から勤怠月度オブジェクトを返す
 *
 * @param {number} ym 月度(yyyyMM)
 * @return {?Object} 勤怠月度オブジェクト
 */
teasp.data.Pouch.prototype.getEmpMonthByYearMonth = function(ym){
	return (this.getObj().empMonthMap[ym] || null);
};

/**
 * 【勤怠】カレントの月度の開始日の日付を返す
 *
 * @return {string} 月度の開始日の日付
 */
teasp.data.Pouch.prototype.getEmpMonthStartDate = function(){
	return this.getObj().month.startDate;
};

/**
 * 【勤怠】カレントの月度の最終日の日付を返す
 *
 * @return {string} 月度の最終日の日付
 */
teasp.data.Pouch.prototype.getEmpMonthLastDate = function(){
	return this.getObj().month.endDate;
};

/**
 * 【勤怠】勤務確定の承認者が自分かどうか
 *
 * @return {boolean} 承認者である場合、true
 */
teasp.data.Pouch.prototype.isEmpMonthApprover = function(){
	return this.isApprover(this.getObj().month.apply);
};

/**
 * 【勤怠】勤務確定の承認者が自分かどうかの情報をクリアする
 *
 */
teasp.data.Pouch.prototype.clearEmpMonthApprover = function(){
	this.clearApprover(this.getObj().month.apply);
};

/**
 * 【勤怠】承認者が自分かどうかの情報をクリアする
 *
 * @param {Object} apply 申請オブジェクト（id と status の要素があること）
 */
teasp.data.Pouch.prototype.clearApprover = function(apply){
	if(this.getObj().approver){
		delete this.getObj().approver[apply.id];
	}
};

/**
 * 【勤怠】勤怠月度の申請オブジェクトを返す。
 * 存在しない場合は生成する
 *
 * @return {Object} 勤怠申請ブジェクト
 */
teasp.data.Pouch.prototype.getEmpMonthApplyObj    = function(){
	return (this.getObj().month.apply || {
		id        : null,
		applyType : teasp.constant.APPLY_TYPE_MONTHLY,
		status    : teasp.constant.STATUS_NOTADMIT,
		steps     : []
	});
};

/**
 * 【勤怠】勤怠月度の申請オブジェクトをセット
 *
 * @param {Object} apply 勤怠申請ブジェクト
 */
teasp.data.Pouch.prototype.setEmpMonthApplyObj    = function(apply){
	var month = this.getEmpMonthByYearMonth(apply.yearMonth);
	if(month){
		month.apply.id        = apply.id;
		month.apply.applyType = apply.applyType;
		month.apply.status    = apply.status;
		month.apply.close     = apply.close;
		month.apply.steps     = [];
	}
};

/**
 * 月次確定済みか
 * @param {Object=} month 月度情報（省略時はカレントの月度情報）
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isFixMonth = function(month){
	var m = month || this.getObj().month;
	return teasp.constant.STATUS_FIX.contains(m.apply.status);
}

/**
 * 月次確定済みなら確定情報の値、未確定なら引数または保持している値を返す
 * @param {string} key 要素名
 * @param {Object=} month 月度情報（省略時はカレントの月度情報）
 * @param {Any=} v
 * @return {Any}
 */
teasp.data.Pouch.prototype.getPeriodInfoValue = function(key, month, v){
	var m = month || this.getObj().month;
	var ac = m.attributeAtConfirm;
	if(this.isFixMonth(m) && ac && ac[key] !== undefined){
		return ac[key];
	}
	return (v !== undefined ? v : m.periodInfo[key]);
}

teasp.data.Pouch.prototype.getElapsedMonth            = function(month, v){ return this.getPeriodInfoValue('elapsedMonth'           , month, v); } // 適用期間内の経過月
teasp.data.Pouch.prototype.getNumberOfMonths          = function(month, v){ return this.getPeriodInfoValue('numberOfMonths'         , month, v); } // 適用期間月数
teasp.data.Pouch.prototype.getStartDateOfPeriod       = function(month, v){ return this.getPeriodInfoValue('startDateOfPeriod'      , month, v); } // 適用期間の開始日
teasp.data.Pouch.prototype.getEndDateOfPeriod         = function(month, v){ return this.getPeriodInfoValue('endDateOfPeriod'        , month, v); } // 適用期間の終了日
teasp.data.Pouch.prototype.getFixTimeOfPeriod         = function(month, v){ return this.getPeriodInfoValue('fixTimeOfPeriod'        , month, v); } // 適用期間の所定労働時間(分)
teasp.data.Pouch.prototype.getLegalTimeOfPeriod       = function(month, v){ return this.getPeriodInfoValue('legalTimeOfPeriod'      , month, v); } // 適用期間の法定労働時間(分)
teasp.data.Pouch.prototype.getRemainFixTimeOfPeriod   = function(month, v){ return this.getPeriodInfoValue('remainFixTimeOfPeriod'  , month, v); } // 残所定労働時間(分)
teasp.data.Pouch.prototype.getRemainLegalTimeOfPeriod = function(month, v){ return this.getPeriodInfoValue('remainLegalTimeOfPeriod', month, v); } // 残法定労働時間(分)
teasp.data.Pouch.prototype.getCarryforwardFromPrev    = function(month, v){ return this.getPeriodInfoValue('carryforwardFromPrev'   , month, v); } // 前月からの繰越時間(分)
teasp.data.Pouch.prototype.getRealWorkTimeWoLHPrev    = function(month, v){ return this.getPeriodInfoValue('realWorkTimeWoLHPrev'   , month, v); } // 前月までの実労働-法休(分)
teasp.data.Pouch.prototype.getSettlementTimePrev      = function(month, v){ return this.getPeriodInfoValue('settlementTimePrev'     , month, v); } // 前月までの当月清算時間(分)

/**
 * 清算月であるか
 * @param {Object=} month 月度情報（省略時はカレントの月度情報）
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isSettlementMonth = function(month){
	return (this.getElapsedMonth(month) == this.getNumberOfMonths(month));
}

/**
 * 確定時の適用期間に関する情報（JSONオブジェクト）
 * フレックス以外はnullを返す
 * @param {boolean} flag trueならテキストに変換する
 * @returns {string|Object}
 */
teasp.data.Pouch.prototype.getPeriodInfo = function(flag){
	if(this.getObj().month.config.workSystem != teasp.constant.WORK_SYSTEM_FLEX){
		return null;
	}
	var obj = this.getObj().month.periodInfo;
	return (flag ? (obj ? dojo.toJson(obj) : null) : obj);
}

/**
 * 適用期間法定労働時間
 * フレックス以外はnullを返す
 * @returns {number|null}
 */
teasp.data.Pouch.prototype.getLegalWorkTimeOfPeriod = function(){
	if(this.getObj().month.config.workSystem != teasp.constant.WORK_SYSTEM_FLEX){
		return null;
	}
	return (this.getObj().month.legalTimeOfPeriod || null);
}

/**
 * 複数月のフレックス用（4つ）
 * 指定月度の繰越時間、実労働－法休、過不足時間、当月清算時間を返す
 * @param {string} sd 月度の開始日(yyyy-MM-dd)
 * @returns {number}
 */
teasp.data.Pouch.prototype.getCarryforwardTime = function(sd){
	return (this.getObj().carryforwardMap && this.getObj().carryforwardMap[sd]) || 0;
};
teasp.data.Pouch.prototype.getRealWorkTimeWoLH = function(sd){
	return (this.getObj().realWorkTimeWoLHMap && this.getObj().realWorkTimeWoLHMap[sd]) || 0;
};
teasp.data.Pouch.prototype.getAmountTime = function(sd){
	return (this.getObj().amountTimeMap && this.getObj().amountTimeMap[sd]) || 0;
};
teasp.data.Pouch.prototype.getSettlementTime = function(sd){
	return (this.getObj().settlementTimeMap && this.getObj().settlementTimeMap[sd]) || 0;
};
/**
 * 過不足時間の値を取れるかを返す
 * （取れない＝勤怠月次レコードが存在しない。複数月のフレックスタイム制でのみ有効）
 * @param {string} sd 月度の開始日
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isEmptyAmountTime = function(sd){
	var v = (this.getObj().amountTimeMap && this.getObj().amountTimeMap[sd]);
	return (v === undefined);
};
/**
 * 期間内の前月度以前すべての勤怠月次レコードが存在するかを返す
 * （複数月のフレックスタイム制でのみ有効。ロジックは変数 "missFlexPeriod" をgrep検索せよ）
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isMissFlexPeriod = function(){
	return this.getObj().month.missFlexPeriod;
};

/**
 * 【勤怠】期間情報を返す
 *
 * @param {Object=} _mm 勤怠月度ブジェクト
 * @return {Object} 期間情報ブジェクト
 */
teasp.data.Pouch.prototype.getPeriodParam = function(_mm){
	var mm = (_mm || this.getObj().month);
	var month = mm;
	var config = month.config;
	var p = ((config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE || config.workSystem == teasp.constant.WORK_SYSTEM_FLEX) && config.variablePeriod) || 0;
	var pms = this.getEmpMonthListByPeriod(mm._em, p || 1);
	var range = {
		from: teasp.util.date.maxDate(pms[0].startDate           , this.getObj().targetEmp.entryDate),
		to  : teasp.util.date.minDate(pms[pms.length - 1].endDate, this.getObj().targetEmp.endDate  )
	};
	var fixDays = 0;
	var dlst = teasp.util.date.getDateList(range.from, range.to);
	for(var i = 0 ; i < dlst.length ; i++){
		var day = this.getObj().days[dlst[i]];
		if(day && day.dayType == teasp.constant.DAY_TYPE_NORMAL && this.isAlive(dlst[i])){
			fixDays++;
		}
	}
	var legalTime = Math.floor((dlst.length / 7) * (p > 1 ? (40 * 60) : config.legalTimeOfWeek)); // 法定労働時間

	month.legalTime = legalTime;
	if(p > 1){
		for(var i = 0 ; i < pms.length ; i++){
			var pm = pms[i];
			month.periodSd = pms[0].startDate;
			month.periodLen = p;
		}
		// 単月の法定労働時間、所定労働時間を計算してmonthにセットしておく
		var mr = {
			from: teasp.util.date.maxDate(month.startDate, this.getObj().targetEmp.entryDate),
			to  : teasp.util.date.minDate(month.endDate  , this.getObj().targetEmp.endDate  )
		};
		var dlst2 = teasp.util.date.getDateList(mr.from, mr.to);
		if(config.flexFixOption == '1'){
			month.fixTime = config.flexFixMonthTime; // 一律固定
		}else{
			month.fixTime = 0;
			for(var i = 0 ; i < dlst2.length ; i++){
				var day = this.getObj().days[dlst2[i]];
				if(day && teasp.logic.EmpTime.isFixDay(day) && this.isAlive(dlst2[i])){
					month.fixTime += (day.rack && day.rack.fixTime) || 0;
				}
			}
		}
		month.legalTime = Math.floor(dlst2.length * config.legalTimeOfWeek / 7); // 月の法定労働時間
		if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX){
			month.avg50week = Math.floor(dlst2.length * 50 * 60 / 7); // 週平均50H基準時間
		}else{
			month.avg50week = 0;
		}
	}

	if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX){ // フレックスタイム制
		if(month.fixTime > month.legalTime          // 所定労働時間＞法定労働時間
		&& config.flexLegalWorkTimeOption == '1'){  // 所定が法定を超える場合は所定→法定として扱う
			month.legalTime = month.fixTime;        // 所定労働時間→法定労働時間
		}
	}
	return {
		from              : range.from,
		to                : range.to,
		days              : dlst.length,
		fixDays           : fixDays,
		period            : p,
		currentSd         : month.startDate,
		currentEd         : month.endDate,
		legalTimeOfPeriod : legalTime
	};
};

/**
 * 【勤怠】｛基準日を含む月度開始日 - [pmon 月前]｝ ～ fmon 月後の月度締め日の期間を返す
 *
 * @param {Object|string} bd 基準日
 * @param {number} fmon 加算月数
 * @param {?number} pmon 減算月数
 * @return {Object} 期間の開始日・終了日を格納したオブジェクト
 */
teasp.data.Pouch.prototype.getDateRangeOfMonth = function(bd, fmon, pmon){
	var months = this.getEmpMonthList(bd, fmon, pmon);
	if(typeof(bd) == 'object'){ bd = teasp.util.date.formatDate(bd); }
	var x = -1;
	for(var i = 0 ; i < months.length ; i++){
		var month = months[i];
		if(month.startDate <= bd && bd <= month.endDate){
			x = i;
			break;
		}
	}
	var x1 = x + (pmon && pmon < 0 ? pmon : 0);
	var x2 = x + fmon;
	var m1 = (x1 >= 0 && x1 < months.length) ? months[x1] : null;
	var m2 = (x2 >= 0 && x2 < months.length) ? months[x2] : null;
	return {
		from : m1.startDate,
		to   : teasp.util.date.addDays(m2.startDate, -1)
	};
};

/**
 * 【勤怠】休暇明細を作成（月次サマリーで表示）
 *
 * @return {Object} 休暇明細オブジェクト
 */
teasp.data.Pouch.prototype.getHolidaySummary = function(){
	var items = [];
	items[teasp.constant.HOLIDAY_TYPE_PAID] = {};
	items[teasp.constant.HOLIDAY_TYPE_DAIQ] = {};
	items[teasp.constant.HOLIDAY_TYPE_FREE] = {};
	var constPlannedHoliday = teasp.message.getLabel('tm10003610'); // 計画付与有休
	var constNoInputHoliday = teasp.message.getLabel('tm10003570'); // 無記入
	var dlst = this.getMonthDateList();
	for(var i = 0 ; i < dlst.length ; i++){
		var dkey = dlst[i];
		if(!this.isAlive(dkey)){
			continue;
		}
		var day = this.getObj().days[dkey];
		if(day.rack.plannedHolidayReal){
			var map = items[teasp.constant.HOLIDAY_TYPE_PAID];
			var o = map[constPlannedHoliday];
			if(!o){
				map[constPlannedHoliday] = { cnt: 0, order: 0 };
			}
			map[constPlannedHoliday].cnt += 1;
		}else{
			var holys = [
			(day.rack.validApplys.holidayAll ? day.rack.validApplys.holidayAll.holiday : null),
			(day.rack.validApplys.holidayAm  ? day.rack.validApplys.holidayAm.holiday  : null),
			(day.rack.validApplys.holidayPm  ? day.rack.validApplys.holidayPm.holiday  : null)
			];
			var hcnt = 0;
			var htime = 0;
			for(var x = 0 ; x < holys.length ; x++){
				var h = holys[x];
				if(h){
					var map = items[h.type];
					o = map[h.name];
					if(!o){
						map[h.name] = { cnt: 0, time: 0, order: h.order };
					}
					map[h.name].cnt += (h.range == teasp.constant.RANGE_ALL ? 1 : 0.5);
					hcnt            += (h.range == teasp.constant.RANGE_ALL ? 1 : 0.5);
				}
			}
			var holidayTimes = day.rack.validApplys.holidayTime || [];
			for(var x = 0 ; x < holidayTimes.length ; x++){
				var ht = holidayTimes[x];
				var h = (ht && ht.holiday);
				if(h){
					var map = items[h.type];
					o = map[h.name];
					if(!o){
						o = map[h.name] = { cnt: 0, time: 0, order: h.order };
					}
					var t = (ht._spendTime || 0);
					if(h.yuqSpend){
						t = Math.ceil(t / 60) * 60; // 年次有給休暇は1h単位に切上
					}else if(h.managed){
						t = Math.ceil(t / 30) * 30; // 日数管理休暇は30分単位に切上
					}
					o.time += t;
					htime  += t;
				}
			}
			if(this.isEmpMonthFixed() && hcnt < 1){
				if(teasp.logic.EmpTime.isFixDay(day)
				&& !day.plannedHoliday
				&& !day.deco.ct.st
				&& !day.deco.ct.et){
					var map = items[teasp.constant.HOLIDAY_TYPE_FREE];
					o = map[constNoInputHoliday];
					if(!o){
						map[constNoInputHoliday] = { cnt: 0, order: Number.MAX_VALUE };
					}
					map[constNoInputHoliday].cnt += (1 - hcnt);
				}
			}
		}
	}
	var sums = [];
	var sumh = [];
	for(var htype in items){
		if(items.hasOwnProperty(htype)){
			var map = items[htype];
			sums[htype] = 0;
			sumh[htype] = 0;
			for(var key in map){
				if(map.hasOwnProperty(key)){
					sums[htype] += map[key].cnt;
					sumh[htype] += (map[key].time || 0);
				}
			}
		}
	}
	return { sums : sums, sumh: sumh, items: items };
};

/**
 * 【勤怠】今月度のすべての日の振替可能マップを作成
 *
 * @param {string} dkey ('yyyy-MM-dd')
 * @return {Object} 振替可能マップオブジェクト
 */
teasp.data.Pouch.prototype.createExchangeEnableMap = function(dkey){
	var enableMap = {};
	var day1 = this.getObj().days[dkey];
	var va = ((day1 && day1.rack && day1.rack.validApplys) || {});
	if(!day1 || day1.plannedHoliday || va.exchangeS){ // 有給計画付与日、振替の元日は振替不可
		return enableMap;
	}

	var dkey0 = (va.exchangeE ? va.exchangeE.originalStartDate : dkey);
	var dayInfo = this.getDayInfoByDate(dkey0);

	var el1 = this.getExchangeLimit();  // 休日に勤務した日の振替休日を選択できる期間
	var el2 = this.getExchangeLimit2(); // 振替休日を取得した日の振替勤務日を選択できる期間
	var n = (dayInfo.dayType == teasp.constant.DAY_TYPE_NORMAL ? el2 : el1);

	var startM = this.getEmpMonth(null, dkey0);
	var endM   = this.getEmpMonth(null, dkey0, n);
	var dlst = teasp.util.date.getDateList(startM.startDate, endM.endDate);

	for(var i = 0 ; i < dlst.length ; i++){
		var dk2 = dlst[i];
		var day2 = (this.getObj().days[dk2] || this.getObj().dayMap[dk2]);
		if(day2 && day2.plannedHoliday){ // 有給計画付与日は不可
			continue;
		}
		if(dkey == dk2){ // 振替元・先が同じ
			continue;
		}
		if(!this.isExchangeableDate(dk2)){
			continue; // 既に振替申請があるため、振替不可
		}
		var f2 = (day2 ? teasp.logic.EmpTime.isFixDay(day2) : true);
		if((dayInfo.dayType == teasp.constant.DAY_TYPE_NORMAL && !f2)
		|| (dayInfo.dayType != teasp.constant.DAY_TYPE_NORMAL && f2)){
			enableMap[dk2] = 1;
		}
	}
	return enableMap;
};

/**
 * 【勤怠】再申請の場合の振替可能かどうかのチェック
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.checkExchangable = function(d1, d2){
	var day1 = (this.getObj().dayMap[teasp.util.date.formatDate(d1)] || { dayType : teasp.constant.DAY_TYPE_NORMAL });
	var day2 = (this.getObj().dayMap[teasp.util.date.formatDate(d2)] || { dayType : teasp.constant.DAY_TYPE_NORMAL });
	var f1 = teasp.logic.EmpTime.isFixDay(day1);
	var f2 = teasp.logic.EmpTime.isFixDay(day2);
	if((f1 && !f2) || (!f1 && f2)){
		return true;
	}
	return false;
};

/**
 * 【勤怠】指定日の１月前～代休取得期限内のすべての日の代休予定日マップを作成
 *
 * @return {Object} 代休可能マップオブジェクト
 */
teasp.data.Pouch.prototype.createDaiqEnableMap = function(){
	var enableMap = {};
	var daiqLimit = (this.getObj().targetEmp.daiqManage.daiqLimit || 0);
	if(daiqLimit > 12){
		daiqLimit = 12;
	}
	// 前月から（前月度が確定状態なら今月から）代休取得期限日までの日付リストを得る
	var o = this.getDateRangeOfMonth(this.getObj().month.startDate, daiqLimit + 1, 0);
	var dlst = teasp.util.date.getDateList(o.from, o.to);
	for(var i = 0 ; i < dlst.length ; i++){
		var dk = dlst[i];
		var info = this.getDayInfoByDate(dk);
		var exdf = this.getExchangedAndDailyFixed(dk);
		if(info.plannedHoliday || exdf.dailyFixed){ // 有休計画付与日または日次確定済みの日は代休不可
			continue;
		}
		// 平日であれば代休可能日付とする
		if((info.dayType == teasp.constant.DAY_TYPE_NORMAL && !exdf.exchanged)
		|| (info.dayType != teasp.constant.DAY_TYPE_NORMAL &&  exdf.exchanged)){
			enableMap[dk] = 1;
		}
	}
	return enableMap;
};

/**
 * 【勤怠】指定日（今月度～翌月度）の有効な申請情報を取得
 *
 * @param {string} dkey 日付 ('yyyy-MM-dd')
 * @param {Array.<string>} excludes 除外する申請種類
 * @param {string=} exId 除外する申請ID
 * @return {Array.<string>} 有効な申請情報の配列。0件の時は[]を返す。
 */
teasp.data.Pouch.prototype.getApplyListByDate = function(dkey, excludes, exId){
	var empDay = this.getEmpDay(dkey);
	var lst = [];
	var b = ((!this.getObj().params.startLdate || this.getObj().params.startLdate <= dkey)
		&& (!this.getObj().params.endLdate   || this.getObj().params.endLdate   >= dkey));
	if(empDay.isValid() && b){
		var applys = empDay.getEmpApplyList();
		for(var i = 0 ; i < applys.length ; i++){
			var a = applys[i];
			if(!excludes.contains(a.applyType) && teasp.constant.STATUS_FIX.contains(a.status) && (!exId || a.id != exId)){
				lst.push(a);
			}
		}
	}else if(this.getObj().dayMap){
		var day = this.getObj().dayMap[dkey];
		if(day){
			for(var j = 0 ; j < day.applys.length ; j++){
				var a = day.applys[j];
				if(!excludes.contains(a.applyType) && teasp.constant.STATUS_FIX.contains(a.status) && (!exId || a.id != exId)){
					lst.push(a);
				}
			}
		}
	}
	return lst;
};

/**
 * 振替申請の振替先日付に指定できるか
 * @param {string} dkey 振替先候補の日付
 * @returns {boolean} true:可 false:不可
 */
teasp.data.Pouch.prototype.isExchangeableDate = function(dkey){
	var applys = this.getApplyListByDate(dkey, []);
	for(var i = 0 ; i < applys.length ; i++){
		var a = applys[i];
		if(a.applyType == teasp.constant.APPLY_TYPE_EXCHANGE // 振替申請
		|| a.applyType == teasp.constant.APPLY_TYPE_DAILY // 日次確定申請
		){
			return false;
		}
	}
	return true;
};

teasp.data.Pouch.prototype.getExchangedAndDailyFixed = function(dkey){
	var ret = {
		dailyFixed: false,
		exchanged: false
	};
	var applys = this.getApplyListByDate(dkey, []);
	var exchangeS = null;
	var exchangeE = null;
	for(var i = 0 ; i < applys.length ; i++){
		var a = applys[i];
		if(a.applyType == teasp.constant.APPLY_TYPE_EXCHANGE){ // 振替申請
			if(a.startDate == dkey){
				exchangeS = a;
			}else{
				exchangeE = a;
			}
		}else if(a.applyType == teasp.constant.APPLY_TYPE_DAILY){ // 日次確定申請
			ret.dailyFixed = true;
		}
	}
	if(exchangeS && exchangeE){
		return ret;
	}
	ret.exchanged = (exchangeS || exchangeE);
	return ret;
};

/**
 * 【勤怠】承認済みの勤務確定を取消できるか
 *
 * @return {boolean} true:できる
 */
teasp.data.Pouch.prototype.canCancelMonthApply  = function(){
	if(this.getObj().targetEmp.mode != 'edit'){ // 編集モードでなければ取消不可
		return false;
	}else if(this.getObj().common.cancelMonthApply || this.isAdmin(true)){ // 本人が取消可 or システム管理者 or 管理者なら取消可
		return true;
	}else if(teasp.util.equalId(this.getObj().targetEmp.userId, this.getObj().targetEmp.managerId)){ // 上長が自分なら取消可
		return true;
	}
	return (this.getObj().targetEmp.userId != this.getObj().sessionInfo.user.id); // 自分以外が編集モードで開いている場合、取消可
};

/**
 * 【勤怠】承認済みの日次の勤怠申請を取消できるか
 *
 * @return {boolean} true:できる
 */
teasp.data.Pouch.prototype.canCancelDayApply  = function(){
	if(this.getObj().targetEmp.mode != 'edit'){ // 編集モードでなければ取消不可
		return false;
	}else if(this.getObj().common.cancelDayApply || this.isAdmin(true)){ // 本人が取消可 or システム管理者 or 管理者なら取消可
		return true;
	}else if(teasp.util.equalId(this.getObj().targetEmp.userId, this.getObj().targetEmp.managerId)){ // 上長が自分なら取消可
		return true;
	}
	return (this.getObj().targetEmp.userId != this.getObj().sessionInfo.user.id); // 自分以外が編集モードで開いている場合、取消可
};

/**
 * 【勤怠】勤務確定のステータスに応じたスタイルシートのセレクタを返す
 *
 * @return {string} スタイルシートのセレクタ
 */
teasp.data.Pouch.prototype.getEmpMonthStatusIconClass = function(){
	return this.getStatusIconClass(this.getEmpMonthApplyStatus(0, true), this.getObj().month.apply.close);
};

/**
 * 【勤怠】日次オブジェクトを返す
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {Object} 日次オブジェクト
 */
teasp.data.Pouch.prototype.getDayObj = function(dkey){
	return this.getObj().days[dkey];
};

/**
 * 【勤怠】指定日の勤務パターンを返す
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {Object} 勤務パターンオブジェクト
 */
teasp.data.Pouch.prototype.getDayPattern = function(dkey){
	return this.getObj().days[dkey].pattern;
};

/**
 * 【勤怠】有休計画付与日のリスト（１年後までの）を返す
 * @return {Array.<string>} 有休計画付与日('yyyy-MM-dd')のリスト
 */
teasp.data.Pouch.prototype.getPlannedHoldays = function(){
	return this.getObj().plannedHolidays;
};

/**
 * 【勤怠】有休消化対象でまだ取消処理を行ってない却下申請オブジェクトを返す
 *
 * @return {Object} 月度単位の申請オブジェクトの配列を格納したオブジェクト
 */
teasp.data.Pouch.prototype.getDirtyApplys = function(){
	var obj = { month: null, lst: [], directs: [], reload:false };
	var rejects = (this.getObj().rejects || []);
	var cancels = (this.getObj().cancels || []);
	for(var i = 0 ; i < rejects.length ; i++){
		var reject = rejects[i];
		if(reject.objectType != 0 || reject._clearUp){
			continue;
		}
		if(reject.status != teasp.constant.STATUS_REJECTDONE
		&& (reject.applyType == teasp.constant.APPLY_TYPE_HOLIDAY
		|| reject.applyType == teasp.constant.APPLY_TYPE_EXCHANGE
		|| reject.applyType == teasp.constant.APPLY_TYPE_KYUSHTU
		|| reject.applyType == teasp.constant.APPLY_TYPE_SHIFTCHANGE)){
			obj.lst.push(reject);
			reject._clearUp = true;
			if(reject.applyType == teasp.constant.APPLY_TYPE_SHIFTCHANGE
			|| reject.applyType == teasp.constant.APPLY_TYPE_EXCHANGE){
				obj.reload = true;
			}
		}
		if(reject.applyType == teasp.constant.APPLY_TYPE_DIRECT
		|| (reject.applyType == teasp.constant.APPLY_TYPE_KYUSHTU && reject.directFlag)){
			obj.directs.push(reject);
		}else if(reject.applyType == teasp.constant.APPLY_TYPE_ZANGYO
		|| reject.applyType == teasp.constant.APPLY_TYPE_EARLYSTART
		|| reject.applyType == teasp.constant.APPLY_TYPE_LATESTART
		|| reject.applyType == teasp.constant.APPLY_TYPE_EARLYEND
		){
			var dw = this.getEmpDay(reject.startDate);
			if(dw.isValid() && dw.getInputLimit().flag){
				obj.directs.push(reject);
			}
		}else if(reject.status != teasp.constant.STATUS_REJECTDONE
		&& reject.applyType == teasp.constant.APPLY_TYPE_MONTHLY
		&& this.getObj().month.yearMonth == reject.yearMonth){
			obj.month = reject.yearMonth;
			obj.lst.push(reject);
			reject._clearUp = true;
		}
	}
	for(i = 0 ; i < cancels.length ; i++){
		var c = cancels[i];
		if(c.applyType == teasp.constant.APPLY_TYPE_MONTHLY){
			if(!obj.month){
				obj.month = c.yearMonth;
				obj.lst.push(c);
			}
			continue;
		}else if(c.applyType == teasp.constant.APPLY_TYPE_DIRECT
		|| (c.applyType == teasp.constant.APPLY_TYPE_KYUSHTU && c.directFlag)){
			obj.directs.push(c);
		}else if(c.applyType == teasp.constant.APPLY_TYPE_ZANGYO
		|| c.applyType == teasp.constant.APPLY_TYPE_EARLYSTART
		|| c.applyType == teasp.constant.APPLY_TYPE_LATESTART
		|| c.applyType == teasp.constant.APPLY_TYPE_EARLYEND
		){
			var dw = this.getEmpDay(c.startDate);
			if(dw.isValid() && dw.getInputLimit().flag){
				obj.directs.push(c);
			}
		}
		obj.lst.push(c);
	}
	return obj;
};

/**
 * 【勤怠】勤怠時刻修正申請の未反映のレコードのリストを返す
 *
 * @return {Array.<Object>}
 */
teasp.data.Pouch.prototype.getReviseTimeApplys = function(){
	var applys = [];
	var dlst = this.getMonthDateList();
	for (var i = 0; i < dlst.length; i++) {
		var dkey = dlst[i];
		var day = this.getObj().days[dkey];
		var revises = day.rack.validApplys.reviseTime;
		if(!revises || revises.length <= 0){
			continue;
		}
		var lst = [];
		for(var j = 0 ; j < revises.length ; j++){
			var rev = revises[j];
			if(teasp.constant.STATUS_APPROVES.contains(rev.status) && !rev.entered){ // 承認済みかつ未反映
				lst.push(rev);
			}
		}
		if(lst.length > 0){
			lst = lst.sort(function(a, b){
				return (a.applyTime < b.applyTime ? -1 : (a.applyTime > b.applyTime ? 1 : 0));
			});
			applys.push(lst[0]);
		}
	}
	return applys;
};

/**
 * 【勤怠】日次情報をデータストアで持っている日次情報にマージ
 *
 * @param {Object} days 日次情報のマップオブジェクト
 */
teasp.data.Pouch.prototype.replaceDays = function(days){
	if(this.getObj().days){
		for(var key in days){
			if(days.hasOwnProperty(key)){
				this.getObj().days[key] = days[key];
			}
		}
	}else{
		this.getObj().days = days;
	}
};

/**
 * 【勤怠】月度の各種集計値を返す
 *
 * @param {string} key キー
 * @param {string=} calcType 集計モード、省略時はみなし時間による集計値
 * @return {number} 集計値
 */
teasp.data.Pouch.prototype.getMonthSubValueByKey = function(key, calcType){
	if(!calcType){
		calcType = teasp.constant.C_DISC;
	}
	return this.getObj().month[calcType][key] || 0;
};

/**
 * 【勤怠】月度の各種集計時間を書式変換して返す
 *
 * @param {string} key キー
 * @param {boolean=} flag 表示形式 true:分のまま  false:設定に従い h:mm か #.00
 * @param {(string|number|null)=} defaultVal t の値が null の場合の代替値
 * @param {string=} calcType 集計モード、省略時はみなし時間による集計値
 * @return {string|number} 書式変換した集計時間
 */
teasp.data.Pouch.prototype.getMonthSubTimeByKey = function(key, flag, defaultVal, calcType){
	if(!calcType){
		calcType = teasp.constant.C_DISC;
	}
	return this.getDisplayTime(this.getObj().month[calcType][key], flag, defaultVal);
};

teasp.data.Pouch.prototype.getNextMonthDay = function(dkey){
	return this.getMonthDay(teasp.util.date.addDays(dkey, 1));
};

teasp.data.Pouch.prototype.getMonthDay = function(dk){
	var d = this.getObj().days[dk];
	if(!d && this.getObj().dayMap){
		d = this.getObj().dayMap[dk];
	}
	if(!d){
		d = {
		date            : dk
		, dayType         : teasp.constant.DAY_TYPE_NORMAL
		, plannedHoliday  : false
		, applys          : []
		, startTime       : null
		, endTime         : null
		};
	}
	return d;
};

/**
 * 【タイムレポート】 使用しているカレンダーサービスを返す
 * @return {String} カレンダーサービス名(CalAccessLogic.AccessServices)
 */
teasp.data.Pouch.prototype.getCalAccessService = function(){
	return (this.getObj().calAccessService || '');
};

/**
 * 【タイムレポート】 カレンダーサービスの認証結果を返す
 * @return {Object} カレンダー認証結果オブジェクト(CalAccessLogic.AuthResult)
 */
teasp.data.Pouch.prototype.getCalAuthResult = function(){
	return (this.getObj().calAuthResult    || {});
};

/**
 * 【タイムレポート】 行動リストを返す
 * @return {Array.<Object>} 行動リスト
 */
teasp.data.Pouch.prototype.getEvents = function(){
	return (this.getObj().events           || []);
};

/**
 * 【お知らせ】 全お知らせ情報の数を返す（注：高コスト）
 *
 * @return {number} 全お知らせ情報の数
 */
teasp.data.Pouch.prototype.getAllInfoCount = function(){
	var cnt = 0;
	for(var i = 0 ; i < this.getObj().infos.length ; i++){
		if(!this.getObj().infos[i].agree){
			cnt++;
		}
	}
	return cnt + this.getObj().rejects.length + this.getInvalidApplys().length + (this.isDaiqLack() ? 1 : 0) + this.setStockLackCount()
		+ this.getDiverges().length;
};

/**
 * 【お知らせ】 お知らせリストを返す
 * @return {Array.<Object>} お知らせリスト
 */
teasp.data.Pouch.prototype.getInfos = function(){
	return (this.getObj().infos       || []);
};

/**
 * 【申請】 却下申請リストを返す
 * @return {Array.<Object>} 却下申請リスト
 */
teasp.data.Pouch.prototype.getRejects = function(){
	return (this.getObj().rejects     || []);
};

/**
 * 【申請】 却下申請を削除
 *
 * @param {Object} apply 申請オブジェクト
 */
teasp.data.Pouch.prototype.removeReject = function(apply){
	var rejects = (this.getObj().rejects || []);
	for(var i = rejects.length - 1 ; i >= 0 ; i--){
		if(rejects[i].id == apply.id){
			rejects.splice(i, 1);
			break;
		}
	}
};

/**
 * 【代休管理】代休関連情報を返す
 * @return {Array.<Object>} 代休関連情報
 */
teasp.data.Pouch.prototype.getStocks = function(){
	return (this.getObj().stocks || []);
};

teasp.data.Pouch.getDaiqZan = function(stocks, td, sd, ed, isOldDate, histAll){
	return teasp.data.Pouch.getStockZan(stocks, teasp.constant.STOCK_DAIQ, td, sd, ed, isOldDate, histAll);
};

/**
 * 【代休管理】 積休残日数を取得.<br/>
 *
 * @static
 * @param {Array.<Object>} _stocks 代休関連情報
 * @param {string} stockType 積休の種類を示す文字列
 * @param {Object|string} td 日付（'yyyy-MM-dd'）この時点の残日数を得る
 * @param {Object|string} ed 日付（'yyyy-MM-dd'）月度最終日
 * @param {Function=} isOldDate 消化チェック判定を行うかを判定する関数
 * @param {boolean=} histAll =true: 履歴情報に労働時間不足の休日出勤申請を含める
 * @return {Object} 代休残日数と代休日と休日出勤日の紐づけの情報を持つオブジェクト
 */
teasp.data.Pouch.getStockZan = function(ss, stockType, td, sd, ed, isOldDate, histAll){
	// 代休or日数管理休暇情報の配列をソート
	// (!CAUTION!) 社員設定と休暇情報画面の付与・取得情報の並び順はここで行っているソートと
	// この関数内で行っているもう一か所（"!CAUTION!"で検索）のソートで決まる
	var _stocks = ss.sort(function(a, b){
		if(a.days >= 0 && b.days < 0){
			return -1;
		}else if(a.days < 0 && b.days >= 0){
			return 1;
		}else if(a.days >= 0 && b.days >= 0){ // 両方とも付与
			// ※付与・取得情報表では付与のソート順は有効開始日＞失効日＞付与日＞生成日時
			// ここでは失効日＞有効開始日＞付与日＞生成日時であることに注意
			if(a.limitDate == b.limitDate){
				if(a.startDate == b.startDate){
					if(a.date == b.date){
						return (a.createdDate < b.createdDate ? -1 : (a.createdDate > b.createdDate ? 1 : 0));
					}
					return (a.date < b.date ? -1 : 1);
				}
				return (a.startDate < b.startDate ? -1 : 1);
			}
			return (a.limitDate < b.limitDate ? -1 : 1);
		}else{
			if(a.date == b.date){
				return (a.createdDate < b.createdDate ? -1 : (a.createdDate > b.createdDate ? 1 : 0));
			}
			return (a.date < b.date ? -1 : 1);
		}
	});
	var stocks = [];
	var consumers = {};
	var rngZan = new Decimal(0); // 残日数
	var stockValid = false;
	var startDateMin = null;
	if(typeof(td) == 'object'){
		td = teasp.util.date.formatDate(td);
	}
	if(typeof(sd) == 'object'){
		sd = teasp.util.date.formatDate(sd);
	}
	if(typeof(ed) == 'object'){
		ed = teasp.util.date.formatDate(ed);
	}
	// 対象データだけ抽出、関連参照マップ作成、残日数計算（代休の残日数計算は後で行う）
	for(var i = 0 ; i < _stocks.length ; i++){
		if(_stocks[i].type == stockType){
			var stock = _stocks[i];
			stocks.push(stock);
			if(stock.days < 0){
				continue;
			}
			if(teasp.util.date.compareDate(stock.startDate, td) <= 0
			&& teasp.util.date.compareDate(stock.limitDate, td) > 0){
				rngZan = rngZan.plus(stock.remainDays || 0);
				stockValid = true;
				if(!startDateMin || stock.startDate < startDateMin){
					startDateMin = stock.startDate;
				}
			}
			stock.zans = (stock.days || 0); // 残数を別の変数にコピー
			for(var j = 0 ; j < stock.consumers.length ; j++){
				var consumer = stock.consumers[j];
				var o = consumers[consumer.consumedByStockId];
				// 作業用に、子オブジェクトに親オブジェクトの参照を保持させる
				if(!o){
					o = consumers[consumer.consumedByStockId] = consumer;
					o.parents = [];
					o.parentMap = {};
				}
				if(!o.parentMap[stock.id]){
					// 親オブジェクトの参照はそのままセットすること。
					// ※クローンを作りクローンの参照をセットするようなことをすると、
					//   １つの親に紐づく子供が多数いると、オブジェクトが肥大化して、
					//   クローン処理に膨大な時間がかかるようになる（らしい）。
					o.parents.push(stock);
					o.parentMap[stock.id] = { cdays: consumer.cdays };
				}
			}
		}
	}
	var overSpend = 0;
	var history = [];
	var applys = {};
	var x = 0;
	if(stockType == teasp.constant.STOCK_DAIQ){ // 代休の場合
		rngZan = new Decimal(0); // 残日数は代休用に数え直すのでリセット
		stockValid = false;
		// 消化相手の付与があるかどうかを調べる
		for(var i = 0 ; i < stocks.length ; i++){
			var stock = stocks[i];
			if((!ed || stock.lostFlag || stock.date <= ed)
			&& stock.days < 0){ // 消化レコード
				stock.digest = (stock.days || 0); // 消化数のコピーをとる
				stock.pare = [];
				var o = consumers[stock.id];
				if(o){ // 付与に紐づいている
					for(var j = 0 ; j < o.parents.length ; j++){
						var p = o.parents[j];
						var pm = o.parentMap[p.id];
						var n = Math.min(Math.abs(stock.digest), p.zans);
						if(pm && pm.cdays < n){
							n = pm.cdays;
						}
						stock.digest += n; // 消化数を付与数で相殺（0になるのが理想）
						if(stock.lostFlag){
							if(stock.digest < 0){
								stock.digest = 0;
							}
							if(n != Math.abs(stock.days)){
								o._days = stock._days = n * (-1);
							}
						}
						p.zans -= n;
						if(n >= 0){
							stock.pare.push(p);
							if(!p.children){
								p.children = [];
							}
							p.children.push(stock);
						}
					}
				}
			}
		}
		// 次のループでは消化レコードのうち、未消化分（主に紐づけされた付与レコードの
		// 残が足りないケースを想定）を、別の残が余っている付与レコードで相殺できるか
		// どうかを判定する（消化できない場合はエラー）
		for(var i = 0 ; i < stocks.length ; i++){
			var stock = stocks[i];
			if((!ed || stock.lostFlag || stock.date <= ed)
			&& stock.days < 0
			&& stock.digest < 0 // 未消化レコード
			&& (!isOldDate || !isOldDate(stock.date))){ // 古いデータは判定対象から除く
				var dz = Math.abs(stock.digest);
				for(var k = 0 ; (k < stocks.length && dz > 0) ; k++){
					var p = stocks[k];
					// 残数がある付与を探し、相殺する
					if(p.days > 0
					&& p.zans > 0
					&& p.startDate <= stock.date
					&& stock.date < p.limitDate
					){
						var n = Math.min(dz, p.zans);
						p.zans -= n;
						dz -= n;
						if(n > 0){
							stock.pare.push(p);
							if(!p.children){
								p.children = [];
							}
							p.children.push(stock);
						}
					}
				}
				stock.digest = (dz * (-1));
				if(stock.digest < 0){ // 相殺しきれなかった
					overSpend += stock.digest;
				}
			}
		}
		// 指定日の残日数を得る
		for(var i = 0 ; i < stocks.length ; i++){
			var stock = stocks[i];
			if(stock.days > 0 // 付与レコード
			&& teasp.util.date.compareDate(stock.startDate, td) <= 0
			&& teasp.util.date.compareDate(stock.limitDate, td) > 0){
				rngZan = rngZan.plus(stock.zans > 0 ? stock.zans : 0);
				stockValid = true;
			}
		}
		// 履歴情報作成ループ
		for(var i = 0 ; i < stocks.length ; i++){
			var stock = stocks[i];
			var stats = [];
			var pairIds = [];
			var subject = '';
			if(stock.days < 0){ // 代休の消化
				var consumer = consumers[stock.id];
				if(!consumer){
					consumer = {
						name           : stock.name,
						empApplyId     : (stock.apply && stock.apply.id || null),
						holidayName    : (stock.apply && stock.apply.holiday && stock.apply.holiday.name || ''),
						date           : stock.date,
						days           : (typeof(stock._days) == 'number' ? stock._days : stock.days),
						applyStartDate : (stock.apply && teasp.util.date.formatDate(stock.apply.startDate) || ''),
						applyEndDate   : (stock.apply && teasp.util.date.formatDate(stock.apply.endDate)   || ''),
						parents        : []
					};
				}
				if(stock.pare){ // 紐づけ先がいる
					for(var j = 0 ; j < stock.pare.length ; j++){
						var p = stock.pare[j];
						var d = teasp.message.getLabel((p.apply ? 'tm10003720' : 'tm10003723'), teasp.util.date.formatDate(p.date, '+M/d'), p.name); // "{0} の代休" or "{0} 付与分({1})を消化"
						if(!stats.contains(d)){
							stats.push(d);
						}
						if(p.id){
							pairIds.push(p.id)
						}
					}
					if(stock.digest < 0){ // すべて消化されない
						stats.push('???');
					}
				}else{
					var sumDays = 0;
					for(var j = 0 ; j < consumer.parents.length ; j++){
						var p = consumer.parents[j];
						var d = teasp.message.getLabel((p.apply ? 'tm10003720' : 'tm10003723'), teasp.util.date.formatDate(p.date, '+M/d'), p.name); // "{0} の代休" or "{0} 付与分({1})を消化"
						if(!stats.contains(d)){
							stats.push(d);
						}
						if(p.id){
							pairIds.push(p.id)
						}
						sumDays += p.days;
					}
					if(sumDays < Math.abs(consumer.days)) { // すべて消化されない
						stats.push('???');
					}
				}
				// 履歴情報セット
				var o = {
					date           : teasp.util.date.formatDate((consumer.date ? consumer.date : consumer.startDate), 'SLA'),
					rawDate        : (consumer.date ? consumer.date : consumer.startDate),
					subject        : (consumer.empApplyId ? consumer.holidayName : consumer.name),
					plus           : '-',
					minus          : teasp.message.getLabel('tk10005151', Math.abs(typeof(consumer._days) == 'number' ? consumer._days : consumer.days)), // {0}日
					startDate      : '-',
					limitDate      : '-',
					status         : stats.join(teasp.message.getLabel('tm10001540')),
					seq            : (++x),
					applyStartDate : consumer.applyStartDate, // 休暇期間開始日
					applyEndDate   : consumer.applyEndDate,   // 休暇期間終了日
					stockId        : stock.id, // ID
					pairIds        : pairIds   // 対のID
				};
				history.push(o);
				if(consumer.empApplyId){
					applys[consumer.empApplyId] = o;
				}
			}else{ // 代休の付与（休日出勤）
				var over = 0; // 失効数
				var zann = 0; // 残数
				if(!stock.apply){
					subject = stock.name;
				}else{
					subject = teasp.message.getLabel('tm10001390') + (typeof(stock.workRealTime) == 'number' && stock.workRealTime >= 0 ? ' (' + teasp.util.time.timeValue(stock.workRealTime) + ')' : '');
				}
				var rds = [];
				if(stock.days == 0) {
//                    stats.push(teasp.message.getLabel('tm10003752')); // 代休取得可能な労働時間未達
					if(!histAll){
						continue;
					}
				}else{
					var ds = [];
					if(stock.children){
						for(var k = 0 ; k < stock.children.length ; k++){
							var c = stock.children[k];
							var d = teasp.util.date.formatDate(c.date, '+M/d');
							if(!ds.contains(d)){
								ds.push(d);
								rds.push(teasp.util.date.formatDate(c.date));
							}
							if(c.id){
								pairIds.push(c.id);
							}
						}
					}
					if(ds.length > 0){
						stats.push(teasp.message.getLabel('tm10003730', ds.join(', '))); // 代休日 {0}
					}
					if(stock.zans > 0 && stock.limitDate <= td){
						over = stock.zans;
						stats.push(teasp.message.getLabel('tm10010710')); // 失効
					}else if(stock.zans > 0){
						zann = stock.zans;
					}
				}
				// 履歴情報セット
				var o = {};
				if(!stock.apply){
					stats.push(teasp.message.getLabel('tm10003722', teasp.util.date.formatDate(stock.date, 'SLA')));  // （{0} 付与）
					o.date = teasp.util.date.formatDate(stock.startDate, 'SLA');
					o.rawDate = stock.startDate;
				}else{
					o.date = teasp.util.date.formatDate(stock.date, 'SLA');
					o.rawDate = stock.date;
				}
				o.subject   = subject;
				o.plus      = teasp.message.getLabel('tk10005151', stock.days);
				o.minus     = '-';
				o.over      = (over ? teasp.message.getLabel('tk10005151', over) : '-');
				o.overNum   = (over || 0),
				o.zann      = (zann ? teasp.message.getLabel('tk10005151', zann) : '-');
				o.startDate = teasp.util.date.formatDate(stock.startDate, 'SLA');
				if(!stock.days){
					o.limitDate = '-';
				}else{
					o.limitDate = (stock.limitDate == '2999-12-31' ? teasp.message.getLabel('infinite_date') : teasp.util.date.formatDate(stock.limitDate, 'SLA'));
				}
				o.limitDatex = stock.limitDate;
				o.status    = stats.join(teasp.message.getLabel('tm10001540'));
				o.seq       = (++x);
				o.spendDates = rds;
				o.zanNum     = zann;
				o.stockId = stock.id; // ID
				o.pairIds = pairIds;  // 対のID
				history.push(o);
				if(stock.apply){
					applys[stock.apply.id] = o;
				}
			}
		}
	}else{ // 日数管理休暇
		// 付与ごとに消化日の配列を作成
		var pmap = {};
		for(var i = 0 ; i < stocks.length ; i++){
			var stock = stocks[i];
			if(stock.days < 0){ // 日数管理休暇の消化
				var consumer = consumers[stock.id];
				var parents = (consumer && consumer.parents) || [];
				for(var j = 0 ; j < parents.length ; j++){
					var p = parents[j];
					var rds = pmap[p.id];
					if(!rds){
						rds = pmap[p.id] = [];
					}
					rds.push(teasp.util.date.formatDate(stock.date));
				}
			}
		}
		// 履歴情報作成ループ
		for(var i = 0 ; i < stocks.length ; i++){
			var stock = stocks[i];
			var stats = [];
			if(stock.days < 0){ // 日数管理休暇の消化
				var consumer = consumers[stock.id];
				if(!consumer){
					consumer = {
						name           : stock.name,
						empApplyId     : (stock.apply && stock.apply.id || null),
						holidayName    : (stock.apply && stock.apply.holiday && stock.apply.holiday.name || ''),
						date           : stock.date,
						days           : stock.days,
						applyStartDate : (stock.apply && teasp.util.date.formatDate(stock.apply.startDate) || ''),
						applyEndDate   : (stock.apply && teasp.util.date.formatDate(stock.apply.endDate)   || ''),
						parents        : [],
						timeUnit       : stock.timeUnit,
						baseTime       : stock.baseTime
					};
				}
				var sumDays = new Decimal(0);
				for(var j = 0 ; j < consumer.parents.length ; j++){
					var p = consumer.parents[j];
					stats.push(teasp.message.getLabel('tm10003723', teasp.util.date.formatDate(p.date, '+M/d'), p.name));
					sumDays = sumDays.plus(p.days);
				}
				if(sumDays.toDecimalPlaces(5).lessThan((new Decimal(consumer.days)).abs().toDecimalPlaces(5))) { // すべて消化されない（日数管理休暇の場合、普通ありえない）
					stats.push('???');
				}
				var co = teasp.data.Pouch.formatDays(Math.abs(typeof(consumer.daysInPeriod) == 'number' ? consumer.daysInPeriod : consumer.days), {baseTime:consumer.baseTime,stepHalf:false});
				// 履歴情報セット
				var o = {
					date           : teasp.util.date.formatDate((consumer.date ? consumer.date : consumer.startDate), 'SLA'),
					rawDate        : (consumer.date ? consumer.date : consumer.startDate),
					subject        : (consumer.empApplyId ? consumer.holidayName : consumer.name),
					plus           : '-',
					minus          : co.disp,
					convDays       : co.raw5,
					startDate      : '-',
					limitDate      : '-',
					status         : stats.join(teasp.message.getLabel('tm10001540')),
					seq            : (++x),
					applyStartDate : consumer.applyStartDate, // 休暇期間開始日
					applyEndDate   : consumer.applyEndDate    // 休暇期間終了日
				};
				history.push(o);
				if(consumer.empApplyId){
					applys[consumer.empApplyId] = o;
				}
			}else{ // 日数管理休暇の付与
				var over = 0; // 失効数
				var zann = 0; // 残数
				stats.push(teasp.message.getLabel('tm10003722', teasp.util.date.formatDate(stock.date, 'SLA')));  // （{0} 付与）
				if(stock.remainDays > 0 && stock.limitDate <= td){
					over = stock.remainDays;
					stats.push(teasp.message.getLabel('tm10010710')); // 失効
				}else if(stock.remainDays > 0){
					zann = stock.remainDays;
				}
				// 履歴情報セット
				var o = {
					date      : teasp.util.date.formatDate(stock.startDate, 'SLA'),
					rawDate   : stock.startDate,
					subject   : stock.name,
					plus      : teasp.data.Pouch.formatDays(stock.days, {baseTime:stock.baseTime,stepHalf:false}).disp,
					minus     : '-',
					over      : (over ? teasp.message.getLabel('tk10005151', over) : '-'),
					overNum   : (over || 0),
					zann      : (zann ? teasp.message.getLabel('tk10005151', zann) : '-'),
					startDate : teasp.util.date.formatDate(stock.startDate, 'SLA'),
					limitDate : (stock.limitDate == '2999-12-31' ? teasp.message.getLabel('infinite_date') : teasp.util.date.formatDate(stock.limitDate, 'SLA')),
					status    : stats.join(teasp.message.getLabel('tm10001540')),
					seq       : (++x),
					spendDates : pmap[stock.id] || [],
					zanNum     : stock.remainDays,
					limitDatex : stock.limitDate
				};
				history.push(o);
				if(stock.apply){
					applys[stock.apply.id] = o;
				}
			}
		}
	}
	// (!CAUTION!) 社員設定と休暇情報画面の付与・取得情報の並び順はこの関数の冒頭で行っているソートと
	// ここで行っているソートで決まる
	// 英語モードを考慮して、rawDate の日付でソートする
	history = history.sort(function(a, b){
		if(a.rawDate == b.rawDate){
			return a.seq - b.seq;
		}
		return (a.rawDate < b.rawDate ? -1 : 1);
	});
	// 作業用の親オブジェクト参照用の変数は、循環参照の状態を避けるために削除する。
	// pouch.dataObj のクローンを作りたい時、循環参照があると、JSエラー「Maximum call stack size exceeded」になる。
	for(var key in consumers){
		if(consumers.hasOwnProperty(key)){
			var consumer = consumers[key];
			if(consumer.parents){
				delete consumer.parents;
			}
			if(consumer.parentMap){
				delete consumer.parentMap;
			}
		}
	}
	for(var i = 0 ; i < stocks.length ; i++){
		var stock = stocks[i];
		if(stock.children){
			delete stock.children;
		}
	}

	return { zan: Math.max(rngZan.toNumber(), 0), valid:stockValid, startDateMin:startDateMin, overSpend: overSpend, stocks: stocks, consumers: consumers, history: history, applys: applys };
};
/**
 * 積休付与の配列を有効開始日＞失効日＞付与日＞生成日時に並べ替える
 * ※マイナス付与時のプルダウンの並び順を付与・取得情報の並び順に合わせるのが目的
 * @param {Array.<Object>} stocks 付与データの配列
 * @return {Array.<Object>} ソート後配列
 */
teasp.data.Pouch.sortProvideStocks = function(stocks){
	return stocks.sort(function(a, b){
		if(a.startDate == b.startDate){
			if(a.limitDate == b.limitDate){
				if(a.date == b.date){
					return (a.createdDate < b.createdDate ? -1 : (a.createdDate > b.createdDate ? 1 : 0));
				}
				return (a.date < b.date ? -1 : 1);
			}
			return (a.limitDate < b.limitDate ? -1 : 1);
		}
		return (a.startDate < b.startDate ? -1 : 1);
	});
};
/**
 * マイナス付与時のプルダウンに表示する選択肢名
 * @param {Object} stock 付与データ
 */
teasp.data.Pouch.getProvideStockForMinus = function(stock){
/*
	console.log('startDate='   + stock.startDate
			+ ', limitDate='   + stock.limitDate
			+ ', date='        + stock.date
			+ ', createdDate=' + stock.createdDate
			+ ', name='        + stock.name
			+ ', remainDays='  + stock.remainDays
	);
*/
	return teasp.message.getLabel('tk10003750', teasp.util.date.formatDate(stock.date, 'SLA')
		, teasp.data.Pouch.formatDays(stock.remainDays, {baseTime:stock.baseTime}).disp); // {0} 付与分({1}日)
};

teasp.data.Pouch.formatDays = function(v, option){
	var opt = dojo.mixin({
			baseTime: 0,
			stepValue: 30,
			stepHalf: true,
			adjustHalf: true,
			flag: 0
		}, option);
	if(!opt.baseTime){
		var o = {
			raw: v,
			raw5: (new Decimal(v)).toDecimalPlaces(5).toNumber(),
			days:v,
			time: '0:00',
			minutes: 0
		};
		o.disp = teasp.message.getLabel('tm10001010', o.raw5);
		return o;
	}
	var stepd = opt.stepValue * 2;
	var stepq = opt.stepValue / 2;
	var n = new Decimal(v); // ex. v==1.73333
	var f = n.isPositive();
	if(opt.flag && !f){
		n = new Decimal(0);
	}
	var d = n.abs();
	if(opt.stepHalf){
		d = d.times(2).floor().div(2); // ex. d==1.73333 → 1.5
	}else{
		d = d.floor(); // ex. d==1.73333 → 1
	}
	var t = n.abs().minus(d); // ex. n==1.73333 - d==1.5 = 0.23333
	var bt = new Decimal(opt.baseTime || 0); // ex. BaseTime__c==450 (7:30)
	var m = t.times(bt).round(); // 残時間 ex. t==0.23333, bt==450 だとしたら 105 (1:45)
	if(opt.adjustHalf                       // 調整モード
	&& !m.isZero()                          // 分>0
	&& !m.mod(opt.stepValue).equals(0)      // 分は30で割り切れない
	&& d.greaterThanOrEqualTo(0.5)          // 残日数>=0.5日
	&& bt.mod(stepd).equals(opt.stepValue)  // 基準時間の端数=30分
	&& m.mod(opt.stepValue).equals(stepq)   // 残時間の端数=15分
	){
		// 残日数を切り崩して残時間にあてる
		d = d.minus(0.5); // d==1.5 → d==1
		t = t.plus(0.5); // t==0.23333 → 0.73333
		m = t.times(bt).round();
	}
	if(!t.isZero()){
		if(opt.flag){
			if(opt.flag == 1){
				t = m.div(opt.stepValue).ceil().times(opt.stepValue).round();
			}else if(opt.flag == 2){
				t = m.div(opt.stepValue).floor().times(opt.stepValue).round();
			}
		}else{
			t = t.times(bt).round();
		}
	}
	var nv = d.plus(t.div(bt)).times(f ? 1 : -1);
	var minutes = t.isZero() ? 0 : t.toNumber();
	var time = teasp.util.time.timeValue(minutes); // t==0.73333,bt==450なら330→"5:30"を返す
	var o = {
		raw: nv.toNumber(),
		raw5: nv.toDecimalPlaces(5).toNumber(),
		days:d.times(f ? 1 : -1).toNumber(), // ex.1.5
		time: (f || time == '0:00' ? '' : '-') + time,
		minutes: minutes * (f ? 1 : -1), // t==0.73333,bt==450なら330 を返す
		baseTime: opt.baseTime
	};
	var z = [];
	if(o.days){
		z.push(teasp.message.getLabel('tm10001010', o.days));
	}
	if(o.time != '0:00'){
		z.push(o.time);
	}
	o.disp = z.join('+') || teasp.message.getLabel('tm10001010', 0);
	return o;
};

/**
 * 代休付与消化状況の要素が指定年度内の情報かを判定
 * @param {Object} h 代休付与消化状況の要素
 * @param {string} sd 開始日(yyyy-MM-dd)
 * @param {string} ed 終了日(yyyy-MM-dd)
 */
teasp.data.Pouch.rangeStock = function(h, sd, ed){
	if(h.plus == '-'){ // 消化情報
		if(h.applyStartDate && h.applyEndDate){ // 期間がある場合
			return (sd <= h.applyEndDate && h.applyStartDate <= ed);
		}else{
			var d = teasp.util.date.formatDate(teasp.util.date.parseDate(h.date));
			return (sd <= d && d <= ed);
		}
	}else{ // 付与情報
		var ld = (h.limitDatex || h.limitDate);
		var d1 = teasp.util.date.formatDate(teasp.util.date.parseDate(h.startDate == '-' ? h.date : h.startDate)); // 有効開始日
		var d2 = teasp.util.date.formatDate(teasp.util.date.parseDate(ld == '-' ? h.date : ld)); // 失効日
		if(d1 < sd && sd < d2){ // 有効開始日が範囲外（古い）で失効日が範囲内にある
			if((h.zanNum || 0) > 0 || (h.overNum || 0) > 0){ // 残数ありまたは失効ありなら出力対象
				return true;
			}
			var xds = h.spendDates || [];
			for(var i = 0 ; i < xds.length ; i++){
				if(sd <= xds[i] && xds[i] <= ed){ // 消化日が範囲内なら出力対象
					break;
				}
			}
			return (i < xds.length);
		}else{
			return (sd < d2 && d1 <= ed); // 有効開始日～失効日が範囲と重なるか
		}
	}
};

/**
 * 【代休関連】代休可能残日数がないのに代休を取っているか
 *
 * @param {boolean} flag 是非
 */
teasp.data.Pouch.prototype.setDaiqLack = function(flag){
	this.dataObj.daiqLack = flag;
};

/**
 * 【代休関連】代休可能残日数がないのに代休を取っているか
 *
 * @return {boolean} trueなら代休可能残日数がないのに代休を取っている
 */
teasp.data.Pouch.prototype.isDaiqLack = function(){
	return this.dataObj.daiqLack;
};

/**
 * 【積休関連】積休可能残日数がないのに積休を休暇申請がある場合、その情報をセット
 *
 * @param {string} type 積休管理名
 * @param {Object} info 日付、休暇名、日数を持つオブジェクト
 * @param {number} zan 取得した場合の残日数
 */
teasp.data.Pouch.prototype.setStockLack = function(type, info, zan){
	if(!this.dataObj.stockLack){
		this.dataObj.stockLack = {};
	}
	this.dataObj.stockLack[type] = { type: type, info: info, zan: zan };
};

/**
 * 【積休関連】積休可能残日数がないのに積休の休暇申請をした情報を返す
 *
 * @return {Object}
 */
teasp.data.Pouch.prototype.getStockLack = function(){
	return (this.dataObj.stockLack || {});
};

/**
 * 【積休関連】積休可能残日数がないのに積休の休暇申請をした情報の個数を返す
 *
 * @return {number}
 */
teasp.data.Pouch.prototype.setStockLackCount = function(){
	if(!this.dataObj.stockLack){
		return 0;
	}
	var cnt = 0;
	for(var key in this.dataObj.stockLack){
		if(this.dataObj.stockLack.hasOwnProperty(key)){
			cnt++;
		}
	}
	return cnt;
};

/**
 * 有休計画付与日の日数を数えて返す
 *
 * @param {boolean=} flag =true:休日出勤申請がないものを返す =それ以外:単純に日数を返す
 * @param {string=} ed  (yyyy-MM-dd)
 * @return {number} 有休計画付与日の日数
 */
teasp.data.Pouch.prototype.countPlannedHoliday = function(flag, ed){
	var endDate = (ed || this.getMonthValueByKey('endDate')); // 月度内最終日
	var phdays  = this.getPlannedHoldays();
	var begDt = this.getObj().targetEmp.entryDate; // 入社日
	var endDt = this.getObj().targetEmp.endDate;   // 退社日
	var cnt = 0;
	if(phdays){
		for(var dkey in phdays){
			if(phdays.hasOwnProperty(dkey)
			&& (dkey > endDate && (!flag || phdays[dkey]))
			&& (!begDt || begDt <= dkey)
			&& (!endDt || dkey <= endDt)
			){
				cnt++;
			}
		}
	}
	return cnt;
};

/**
 * 【勤怠】勤怠月度の集計情報を返す
 *
 * @return {Object} 集計情報
 */
teasp.data.Pouch.prototype.getMonthSummary = function(){
	var hifn = '-';
	var m = {
		fixdays                     : { val: 0 }, // 所定出勤日数
		realdays                    : { val: 0 }, // 実出勤日数
		workLegalHolidays           : { val: 0 }, // 法定休日出勤日数
		workHolidays                : { val: 0 }, // 所定休日出勤日数
		//-------------------------------------------------------------------------------
		workFixedTime               : { val: 0 }, // 所定労働時間
		workWholeTime               : { val: 0 }, // 総労働時間
		workWholeOmitHolidayTime    : { val: 0 }, // 総労働時間－法定休日労働
		workRealOmitHolidayTime     : { val: 0 }, // 実労働時間－法定休日労働
		workRealTime                : { val: 0 }, // 実労働時間
		workRealTimeNoDiscretion    : { val: 0 }, // 実際の労働時間
		legalTime                   : { val: 0 }, // 法定労働時間
		amountTime                  : { val: 0 }, // 過不足時間
		curAmountTime               : { val: 0 }, // 過不足時間（本日までの）
		//-------------------------------------------------------------------------------
		legalOverTime               : { val: 0 }, // 法定時間内残業
		legalOutOverTime            : { val: 0 }, // 法定時間外残業
		workHolidayTime             : { val: 0 }, // 法定休日労働時間
		//-------------------------------------------------------------------------------
		workNightTime               : { val: 0 }, // 深夜労働時間
		workChargeTime              : { val: 0 }, // 法定時間外割増
		workOver45Time              : { val: 0 }, // 45時間を超える時間外労働
		workOver60Time              : { val: 0 }, // 60時間を超える時間外労働
		//-------------------------------------------------------------------------------
		periodWorkLegalMax          : { val: 0 }, // 変形期間(XXXX)における法定労働時間
		periodWorkLegalTime         : { val: 0 }, // 期間内(XX-XX)法定時間内労働合計
		overTimeInWeek              : { val: 0 }, // 週40時間超過時間
		overTimeInPeriod            : { val: 0 }, // 超過分
		//-------------------------------------------------------------------------------
		lateCount                   : { val: 0 }, // 遅刻回数
		lateTime                    : { val: 0 }, // 遅刻時間
		lateLostTime                : { val: 0 }, // 控除遅刻時間
		earlyCount                  : { val: 0 }, // 早退回数
		earlyTime                   : { val: 0 }, // 早退時間
		earlyLostTime               : { val: 0 }, // 控除早退時間
		privateInnerCount           : { val: 0 }, // 勤務時間内の私用外出回数
		privateInnerTime            : { val: 0 }, // 勤務時間内の私用外出時間
		privateInnerLostTime        : { val: 0 }, // 控除勤務時間内の私用外出時間
		//-------------------------------------------------------------------------------
		paidRestTime                : { val: 0 }, // 時間単位有休取得時間
		//-------------------------------------------------------------------------------
		yuqRemain                   : { val: 0 }, // 有休残日数
		plannedRemain               : { val: 0 }, // 計画付与予定日数
		//-------------------------------------------------------------------------------
		workOverTime36              : { val: 0 }, // 当月度の超過時間
		totalWorkOverTime36         : { val: 0 }, // 当年度の超過時間
		totalWorkOverCount36        : { val: 0 }, // 当年度の超過回数
		quartWorkOverTime36         : { val: 0 }, // 当四半期の超過時間
		workOver40perWeek           : { val: 0 }, // 安全配慮上の超過時間：実労働時間で算出
		//-------------------------------------------------------------------------------
		holidaySummary              : this.getHolidaySummary(), // 休暇情報
		periodParam                 : null,
		periodJp                    : '',
		periodSpan                  : null,
		currentSpan                 : null,
		flex                        : (this.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX),
		elapsedMonth                : 1,
		numberOfMonths              : 1,
		weeklyAvg50Label            : '',
		periodLegalTime             : { val: hifn }, // 清算期間の法定労働時間
		periodFixTime               : { val: hifn }, // 清算期間の所定労働時間
		weeklyAvg50                 : { val: hifn }, // 週平均50時間基準時間
		carryforwardFromPrev        : { val: hifn }, // 前月からの繰越時間
		carryforwardToNext          : { val: hifn }, // 来月への繰越時間
		settlementTime              : { val: hifn }, // 当月清算時間
		periodAmountTime            : { val: hifn }, // 期間の過不足時間
		curPeriodAmountTime         : { val: hifn }  // 期間の過不足時間（本日時点）
	};
	// 所定出勤日数
	m.fixdays.col                     = teasp.message.getLabel('fixDays_label');
	m.fixdays.val                     = teasp.message.getLabel('tm10001010', this.getMonthSubValueByKey('workFixedDay'));
	// 実出勤日数
	m.realdays.col                    = teasp.message.getLabel('realDays_label');
	m.realdays.val                    = teasp.message.getLabel('tm10001010', this.getMonthSubValueByKey('workRealDay'));
	// 法定休日出勤日数
	m.workLegalHolidays.col           = teasp.message.getLabel('legalHolidayWorkDays_label');
	m.workLegalHolidays.val           = teasp.message.getLabel('tm10001010', this.getMonthSubValueByKey('workLegalHolidayCount'));
	// 所定休日出勤日数
	m.workHolidays.col                = teasp.message.getLabel('holidayWorkDays_label');
	m.workHolidays.val                = teasp.message.getLabel('tm10001010', this.getMonthSubValueByKey('workHolidayCount')
											+ this.getMonthSubValueByKey('workPublicHolidayCount'));

	// 所定労働時間
	m.workFixedTime.col               = teasp.message.getLabel('fixTimeOfDay_label');
	m.workFixedTime.val               = this.getMonthSubTimeByKey('workFixedTime');
	// 総労働時間
	m.workWholeTime.col               = teasp.message.getLabel('wholeTime_label');
	m.workWholeTime.val               = this.getMonthSubTimeByKey('workWholeTime');
	// 総労働時間－法定休日労働
	m.workWholeOmitHolidayTime.col    = teasp.message.getLabel('tm10009210');
	m.workWholeOmitHolidayTime.val    = this.getDisplayTime(this.getMonthSubValueByKey('workWholeTime') - this.getMonthSubValueByKey('workHolidayTime'));
	// 実労働時間－法定休日労働
	m.workRealOmitHolidayTime.col     = teasp.message.getLabel('tm10009220');
	m.workRealOmitHolidayTime.val     = this.getDisplayTime(this.getMonthSubValueByKey('workRealTime') - this.getMonthSubValueByKey('workHolidayTime'));
	// 実労働時間
	m.workRealTime.col                = teasp.message.getLabel('workRealTime_label');
	m.workRealTime.val                = this.getMonthSubTimeByKey('workRealTime');
	// 実際の労働時間
	m.workRealTimeNoDiscretion.col    = teasp.message.getLabel('tm10009230');
	m.workRealTimeNoDiscretion.flag   = this.isDefaultUseDiscretionary();
	m.workRealTimeNoDiscretion.val    = (m.workRealTimeNoDiscretion.flag ? this.getMonthSubTimeByKey('workRealTime', false, null, teasp.constant.C_REAL) : 0);
	// 法定労働時間
	m.legalTime.col                   = teasp.message.getLabel('legalWorkTime_label');
	m.legalTime.val                   = this.getMonthTimeByKey('legalTime');
	// 過不足時間
	var amount = this.getMonthSubValueByKey('amountTime');
	m.amountTime.col                  = teasp.message.getLabel('amountTime_label');
	m.amountTime.val                  = (amount > 0 ? '+' : '') + this.getMonthSubTimeByKey('amountTime');

	var avg50week = this.getMonthValueByKey('avg50week');
	m.weeklyAvg50Label                = teasp.message.getLabel('tf10010420', teasp.util.time.timeValue(avg50week)); // 週平均50時間(221:15)超過時間
	m.weeklyAvg50.col                 = teasp.message.getLabel('tf10010450'); // 週平均50時間基準時間
	m.weeklyAvg50.val                 = teasp.util.time.timeValue(avg50week);

	m.periodLegalTime.col             = teasp.message.getLabel('tf10010270'); // 清算期間の法定労働時間
	m.periodFixTime.col               = teasp.message.getLabel('tf10010460'); // 清算期間の所定労働時間
	m.carryforwardFromPrev.col        = teasp.message.getLabel('tf10010220'); // 前月からの繰越時間
	m.carryforwardToNext.col          = teasp.message.getLabel('tf10010210'); // 来月への繰越時間
//	m.settlementTime.col              = teasp.message.getLabel('tf10010190'); // 当月清算時間
//	m.settlementTime.col             += '<br/><span style="font-size:85%;">' + teasp.message.getLabel('tk10004860', m.weeklyAvg50Label) + '</span>';
	m.settlementTime.col              = m.weeklyAvg50Label;
	m.settlementTime.col             += '<br/><span style="font-size:90%;">' + teasp.message.getLabel('tk10004860', teasp.message.getLabel('tf10010190')) + '</span>'; // 当月清算時間
	m.periodAmountTime.col            = teasp.message.getLabel('tf10010280'); // 清算期間の過不足時間
	m.curPeriodAmountTime.col         = teasp.message.getLabel('tf10010280'); // 清算期間の過不足時間

	// 法定時間内残業
	m.legalOverTime.col               = teasp.message.getLabel(this.getWorkSystem() != teasp.constant.WORK_SYSTEM_MANAGER && this.isDefaultUseDiscretionary() ? 'legalOverTimeM_label' : 'legalOverTime_label');
	m.legalOverTime.val               = this.getMonthSubTimeByKey('workLegalOverTime');
	// 法定時間外残業
	m.legalOutOverTime.col            = teasp.message.getLabel(this.getWorkSystem() != teasp.constant.WORK_SYSTEM_MANAGER && this.isDefaultUseDiscretionary() ? 'legalOutOverTimeM_label' : 'legalOutOverTime_label');
	m.legalOutOverTime.val            = this.getMonthSubTimeByKey('workLegalOutOverTime');
	// 法定時間外割増
	m.workChargeTime.col              = teasp.message.getLabel('legalExtWorkTime_label');
	m.workChargeTime.val              = this.getMonthSubTimeByKey('workChargeTime');

	if(this.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX){
		var carryforwardFromPrev = this.getMonthValueByKey('carryforwardFromPrev') || 0; // 前月からの繰越時間
		var carryforwardToNext   = this.getMonthValueByKey('carryforwardToNext') || 0; // 来月への繰越時間
		var settlementTimePrev   = this.getMonthValueByKey('settlementTimePrev')   || 0; // 前月までの当月清算時間合計
		m.elapsedMonth = this.getElapsedMonth(); // 経過月
		m.numberOfMonths = this.getNumberOfMonths(); // 清算期間
		m.startDateOfPeriod = this.getStartDateOfPeriod(); // 清算期間の開始日
		m.endDateOfPeriod   = this.getEndDateOfPeriod(); // 清算期間の終了日
		if(m.elapsedMonth == 1){
			carryforwardFromPrev = 0;
		}
		var periodAmount = carryforwardToNext;
		if(!this.isMissFlexPeriod()){
			m.periodAmountTime.val = (periodAmount > 0 ? '+' : '') + this.getDisplayTime(periodAmount);
		}
		if(m.elapsedMonth < m.numberOfMonths){
			m.periodAmountTime.atTheMoment = '<span style="font-size:0.9em;">' + teasp.message.getLabel('tf10010470') + '</span>';
			m.legalOverTime.val = hifn;
			m.workChargeTime.val = hifn;
		}
		var today = this.getToday();
		var atday = this.getObj().month.amountTimeDate;
		if(atday && this.getObj().month.startDate <= today && today <= this.getObj().month.endDate){ // 今月の月度の場合、現時点の過不足時間を表示する
			var curAmount = this.getMonthSubValueByKey('curAmountTime');
			m.curAmountTime.col       = teasp.message.getLabel('amountTime_label');
			m.curAmountTime.val       = (curAmount > 0 ? '+' : '') + this.getDisplayTime(curAmount);
			m.curAmountTime.atTheMoment = '<span style="font-size:0.9em;">' + teasp.message.getLabel('tm10001020', teasp.util.date.formatDate(atday, 'M/d')) + '</span>';
			if(!this.isMissFlexPeriod()){
				var periodAmount = carryforwardToNext;
				m.curPeriodAmountTime.val = (periodAmount > 0 ? '+' : '') + this.getDisplayTime(periodAmount);
			}
			m.curPeriodAmountTime.atTheMoment = m.curAmountTime.atTheMoment;
		}else{
			m.curAmountTime.col       = m.amountTime.col;
			m.curAmountTime.val       = m.amountTime.val;
			if(!this.isMissFlexPeriod()){
				m.curPeriodAmountTime.val = m.periodAmountTime.val;
			}
			if(m.elapsedMonth < m.numberOfMonths){
				m.curPeriodAmountTime.atTheMoment = '<span style="font-size:0.9em;">' + teasp.message.getLabel('tf10010470') + '</span>';
			}
		}
		m.elapsedMonthJp = '';
		if(m.elapsedMonth == m.numberOfMonths){
			m.elapsedMonthJp = teasp.message.getLabel('tf10010260'); // 最終月
		}else if(m.elapsedMonth == 1){
			m.elapsedMonthJp = teasp.message.getLabel('tf10010240'); // 1ヶ月目
		}else if(m.elapsedMonth == 2){
			m.elapsedMonthJp = teasp.message.getLabel('tf10010250'); // 2ヶ月目
		}
		if(this.getObj().month.startDate <= m.endDateOfPeriod && m.startDateOfPeriod <= this.getObj().month.endDate){
			m.periodParam = this.getPeriodParam();
			m.periodJp = teasp.message.getLabel('tm10010100', m.numberOfMonths); // {0}ヶ月
			m.periodSpan  = teasp.util.date.formatDate(m.startDateOfPeriod, 'M/d') + '-' + teasp.util.date.formatDate(m.endDateOfPeriod, 'M/d');
			m.periodLabel = teasp.message.getLabel('tf10010230', m.periodJp, m.periodSpan, m.elapsedMonthJp);
			m.periodLegalTime.val      = this.getMonthTimeByKey('legalTimeOfPeriod');
			m.periodFixTime.val        = this.getMonthTimeByKey('fixTimeOfPeriod');
		}else{
			m.periodLabel              = hifn;
			m.periodLegalTime.val      = hifn;
			m.periodFixTime.val        = hifn;
		}
		m.settlementTime.val       = this.getMonthSubTimeByKey('settlementTime');
		if(m.elapsedMonth > 1 && !this.isMissFlexPeriod()){
			m.carryforwardFromPrev.val = (carryforwardFromPrev > 0 ? '+' : '') + this.getMonthTimeByKey('carryforwardFromPrev');
		}
		if(m.elapsedMonth < m.numberOfMonths && !this.isMissFlexPeriod()){
			m.carryforwardToNext.val   = ((this.getMonthValueByKey('carryforwardToNext')||0)   > 0 ? '+' : '') + this.getMonthTimeByKey('carryforwardToNext');
		}
	}
	// 法定休日労働時間
	m.workHolidayTime.col             = teasp.message.getLabel('tm10009300');
	m.workHolidayTime.val             = this.getMonthSubTimeByKey('workHolidayTime');

	// 深夜労働時間
	m.workNightTime.col               = teasp.message.getLabel('nightWorkTime_label');
	m.workNightTime.val               = this.getMonthSubTimeByKey('workNightTime', false, null, teasp.constant.C_REAL);
	// 45時間を超える時間外労働
	m.workOver45Time.col              = teasp.message.getLabel('tm10009311');
	m.workOver45Time.val              = this.getMonthSubTimeByKey('workOver45Time');
	// 60時間を超える時間外労働
	m.workOver60Time.col              = teasp.message.getLabel('tm10009310');
	m.workOver60Time.val              = this.getMonthSubTimeByKey('workOver60Time');

	// 遅刻回数、遅刻時間、控除遅刻時間
	m.lateCount.col                   = teasp.message.getLabel(this.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX ? 'tm10009321' : 'tm10009320');
	m.lateCount.val                   = teasp.message.getLabel('tm10001670', this.getMonthSubValueByKey('lateCount'));
	m.lateTime.val                    = ' ' + this.getMonthSubTimeByKey('lateTime');
	m.lateLostTime.val                = teasp.message.getLabel('tm10001680', this.getMonthSubTimeByKey('lateLostTime'));
	// 早退回数、早退時間、控除早退時間
	m.earlyCount.col                  = teasp.message.getLabel(this.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX ? 'tm10009331' : 'tm10009330');
	m.earlyCount.val                  = teasp.message.getLabel('tm10001670', this.getMonthSubValueByKey('earlyCount'));
	m.earlyTime.val                   = ' ' + this.getMonthSubTimeByKey('earlyTime');
	m.earlyLostTime.val               = teasp.message.getLabel('tm10001680', this.getMonthSubTimeByKey('earlyLostTime'));
	// 勤務時間内の私用外出回数、勤務時間内の私用外出時間、控除勤務時間内の私用外出時間
	m.privateInnerCount.col           = teasp.message.getLabel(this.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX ? 'tm10009341' : 'tm10009340',
										this.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX ? teasp.message.getLabel('core_label') : teasp.message.getLabel('work_label')); // コア or 勤務
	m.privateInnerCount.val           = teasp.message.getLabel('tm10001670', this.getMonthSubValueByKey('privateInnerCount'));
	m.privateInnerTime.val            = ' ' + this.getMonthSubTimeByKey('privateInnerTime');
	m.privateInnerLostTime.val        = teasp.message.getLabel('tm10001680', this.getMonthSubTimeByKey('privateInnerLostTime'));

	// 時間単位有休取得時間
	m.paidRestTime.col                = teasp.message.getLabel('tm10009360');
	m.paidRestTime.val                = this.getMonthSubTimeByKey('paidRestTime');

	// 有休残日数
	var emLastDate = this.getEmpMonthLastDate();
	m.yuqRemain.col                   = teasp.message.getLabel('tm10009390') + teasp.message.getLabel('tm10009140', teasp.util.date.formatDate(emLastDate, 'M/d'));
	m.yuqRemain.val                   = this.getDspYuqRemain(emLastDate, true).display;
	// 計画付与有休日数
	var o = this.getEmpMonth(null, this.getStartDate(), 1);
	var nextY = teasp.util.date.formatMonth('zv00000020', Math.floor(o.yearMonth / 100), (o.yearMonth % 100), o.subNo);
	m.plannedRemain.col               = teasp.message.getLabel('tm10009150', nextY); // {0}年{1}月度以降の<br/>計画付与予定日
	m.plannedRemain.val               = teasp.message.getLabel('tm10001010', this.countPlannedHoliday());

	// 当月度の超過時間
	m.workOverTime36.col              = teasp.message.getLabel('overTimeOfMonth_label');
	m.workOverTime36.val              = this.getMonthSubTimeByKey('workOverTime36');
	// 当年度の超過時間
	m.totalWorkOverTime36.col         = teasp.message.getLabel('overTimeOfYear_label');
	m.totalWorkOverTime36.val         = this.getMonthSubTimeByKey('totalWorkOverTime36');
	// 当年度の超過回数
	m.totalWorkOverCount36.col        = teasp.message.getLabel('overCountOfYear_label');
	m.totalWorkOverCount36.val        = teasp.message.getLabel('tm10001670', (this.getMonthSubValueByKey('totalWorkOverCount36') || 0));
	// 当四半期の超過時間
	m.quartWorkOverTime36.col         = teasp.message.getLabel('tk10001173');
	m.quartWorkOverTime36.val         = this.getMonthSubTimeByKey('quartWorkOverTime36');
	// 安全配慮上の超過時間：実労働時間で算出
	m.workOver40perWeek.col           = teasp.message.getLabel('overTimeSafety_label');
	m.workOver40perWeek.val           = this.getMonthSubTimeByKey('workOver40perWeek', false, null, teasp.constant.C_REAL);

	if(this.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER){ // 労働時間制が管理監督者
		m.workWholeOmitHolidayTime.val    = hifn; // 総労働時間－法定休日労働
		m.workRealOmitHolidayTime.val     = hifn; // 実労働時間－法定休日労働
		m.legalTime.val                   = hifn; // 法定労働時間
		m.amountTime.val                  = hifn; // 過不足時間

		m.legalOverTime.val               = hifn; // 法定時間内残業
		m.legalOutOverTime.val            = hifn; // 法定時間外残業
		m.workHolidayTime.val             = hifn; // 法定休日労働時間

		m.workChargeTime.val              = hifn; // 法定時間外割増
		m.workOver45Time.val              = hifn; // 45時間を超える時間外労働
		m.workOver60Time.val              = hifn; // 60時間を超える時間外労働

		// 遅刻回数、遅刻時間、控除遅刻時間
		m.lateCount.val                   = '';
		m.lateTime.val                    = hifn;
		m.lateLostTime.val                = hifn;
		// 早退回数、早退時間、控除早退時間
		m.earlyCount.val                  = '';
		m.earlyTime.val                   = hifn;
		m.earlyLostTime.val               = hifn;
		// 勤務時間内の私用外出回数、勤務時間内の私用外出時間、控除勤務時間内の私用外出時間
		m.privateInnerCount.val           = '';
		m.privateInnerTime.val            = hifn;
		m.privateInnerLostTime.val        = hifn;

		m.workOverTime36.val              = hifn; // 当月度の超過時間
		m.totalWorkOverCount36.val        = hifn; // 当年度の超過時間
		m.totalWorkOverTime36.val         = hifn; // 当年度の超過回数
		m.quartWorkOverTime36.val         = hifn; // 当四半期の超過時間
	}

	if(this.getWorkSystem() == teasp.constant.WORK_SYSTEM_MUTATE){
		m.periodParam = this.getPeriodParam();
		if(m.periodParam.period > 0){
			m.periodJp = '';
			if(m.periodParam.period == 0){
				m.periodJp = teasp.message.getLabel('tm10009020'); // 1週間
			}else if(m.periodParam.period == 12){
				m.periodJp = teasp.message.getLabel('tm10009030'); // 1年
			}else{
				m.periodJp = m.periodParam.period + teasp.message.getLabel('tm10009040'); // ヶ月
			}
			var periodLeaglMax = this.getMonthValueByKey('legalTimeOfPeriod');
			var periodWorkLegalTime = (this.getMonthValueByKey('preWorkLegalTimeOfPeriod') || 0) + this.getMonthSubValueByKey('workLegalTime') - this.getMonthSubValueByKey('workChargeTime40H');
			var overTimeInPeriod = (periodLeaglMax < periodWorkLegalTime ? periodWorkLegalTime - periodLeaglMax : 0);

			m.periodSpan  = teasp.util.date.formatDate(m.periodParam.from, 'M/d') + '-' + teasp.util.date.formatDate(m.periodParam.to, 'M/d');
			m.currentSpan = teasp.util.date.formatDate(m.periodParam.from, 'M/d') + '-' + teasp.util.date.formatDate(m.periodParam.currentEd, 'M/d');

			// 変形期間(XXXX)における法定労働時間
			m.periodWorkLegalMax.col = teasp.message.getLabel('tm10009050') // 変形期間
										+ '(' + m.periodJp + ':' + m.periodSpan + ')'
										+ teasp.message.getLabel('tm10009060'); // における法定労働時間
			m.periodWorkLegalMax.val = teasp.util.time.timeValue(periodLeaglMax );
			// 期間内(XX-XX)法定時間内労働合計
			m.periodWorkLegalTime.col = teasp.message.getLabel('tm10009070') // 期間内
										+ '(' + m.currentSpan + ')'
										+ teasp.message.getLabel('tm10009080'); // 法定時間内労働合計
			m.periodWorkLegalTime.val = teasp.util.time.timeValue(Number(periodWorkLegalTime));
			// 超過分
			m.overTimeInPeriod.col = '';
			m.overTimeInPeriod.val = teasp.util.time.timeValue(overTimeInPeriod);
			m.overTimeInWeek.val   = this.getMonthSubTimeByKey('workChargeTime40H');
		}
	}

	var tipFields;
	if(this.getWorkSystem() == teasp.constant.WORK_SYSTEM_FIX){
		tipFields = [
			'fixdays'              // 所定出勤日数
			, 'realdays'             // 実出勤日数
			, null
			, 'workFixedTime'        // 所定労働時間
			, 'workWholeTime'        // 総労働時間
			, 'workRealTime'         // 実労働時間
		];
		if(this.isDiscretionaryOption() && this.isDefaultUseDiscretionary()){ // デフォルト勤務パターンが裁量労働
			tipFields.push('workRealTimeNoDiscretion'); // 実際の労働時間
		}
		tipFields = tipFields.concat([
			null
			, 'legalOverTime'        // 法定時間内残業
			, 'legalOutOverTime'     // 法定時間外残業
			, 'workHolidayTime'      // 法定休日労働時間
			, null
			, 'workNightTime'        // 深夜労働時間
			, 'workChargeTime'       // 法定時間外割増
		]);
	}else if(this.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX){
		tipFields = [
			'fixdays'              // 所定出勤日数
			, 'realdays'             // 実出勤日数
			, null
			, 'workFixedTime'        // 所定労働時間
			, 'workWholeTime'        // 総労働時間
			, 'amountTime'           // 過不足時間
			, null
			, 'legalOverTime'        // 法定時間内残業
			, 'legalOutOverTime'     // 法定時間外残業
			, 'workHolidayTime'      // 法定休日労働時間
			, null
			, 'workNightTime'        // 深夜労働時間
			, 'workChargeTime'       // 法定時間外割増
		];
	}else if(this.getWorkSystem() == teasp.constant.WORK_SYSTEM_MUTATE){
		tipFields = [
			'fixdays'              // 所定出勤日数
			, 'realdays'             // 実出勤日数
			, 'workFixedTime'        // 所定労働時間
			, 'workWholeTime'        // 総労働時間
			, null
			, 'workRealTime'         // 実労働時間
			, 'legalOverTime'        // 法定時間内残業
			, 'legalOutOverTime'     // 法定時間外残業
			, 'workHolidayTime'      // 法定休日労働時間
			, null
			, 'workNightTime'        // 深夜労働時間
			, 'workChargeTime'       // 法定時間外割増
		];
	}else{ // WORK_SYSTEM_MANAGER
		tipFields = [
			'fixdays'              // 所定出勤日数
			, 'realdays'             // 実出勤日数
			, 'workNightTime'        // 深夜労働時間
		];
	}
	var tipList = [];
	for(var i = 0 ; i < tipFields.length ; i++){
		tipList.push(tipFields[i] == null ? null : m[tipFields[i]]);
	}
	var v = this.getVariablePeriod();
	switch(this.getWorkSystem()){
	case '0':
		m.categoryL = 'fix';
		m.categoryS = (this.isDefaultUseDiscretionary() ? 'fixd' : 'fixn');
		break;
	case '1':
		if(v > 1){
			m.categoryL = 'flexp';
			if(m.elapsedMonth == m.numberOfMonths){
				m.categoryS = 'flexe'
			}else if(m.elapsedMonth == 1){
				m.categoryS = 'flexf'
			}else{
				m.categoryS = 'flexm'
			}
		}else{
			m.categoryL = 'flex';
			m.categoryS = 'flexo';
		}
		break;
	case '2':
		m.categoryL = 'var';
		if(v == 0){
			m.categoryS = 'varw';
		}else{
			m.categoryS = 'var' + v;
		}
		break;
	default:
		m.categoryL = 'man';
		m.categoryS = 'man';
	}
	return { o: m, tipList: tipList };
};

/**
 * 休暇明細を返す
 *
 * @return {Object} 休暇明細
 */
teasp.data.Pouch.prototype.getHolidayHistory = function(){
	var hh = (this.dataObj.holidayHistory || {});
	var dmap = {};
	var ymap = {};
	var lst = [];
	for(var i = 0 ; i < hh.empYuqs.length ; i++){
		if(hh.empYuqs[i].empApplyId){
			ymap[hh.empYuqs[i].empApplyId] = hh.empYuqs[i];
		}
	}
	for(var dkey in hh.empDays){
		if(!hh.empDays.hasOwnProperty(dkey)){
			continue;
		}
		var d = hh.empDays[dkey];
		for(i = 0 ; i < 2 ; i++){
			var id = (i == 0 ? d.applyId.holidayApplyId1 : d.applyId.holidayApplyId2);
			var h  = (i == 0 ? d.holiday1 : d.holiday2);
			var days = 0;
			if(h){
				if(h.range == teasp.constant.RANGE_ALL){
					days = 1;
				}else if(h.range == teasp.constant.RANGE_AM || h.range == teasp.constant.RANGE_PM){
					days = 0.5;
				}
			}
			if(id){
				if(!dmap[id]){
					dmap[id] = { date: dkey, days: 0 };
				}
				dmap[id].days += days;
			}
			if(!id && days > 0){
				lst.push({
					startDate : dkey,
					endDate   : dkey,
					subject   : h.name,
					range     : h.range,
					days      : days,
					time      : 0,
					note      : ''
				});
			}
		}
	}
	for(i = 0 ; i < hh.empApplys.length ; i++){
		var a = hh.empApplys[i];
		if(!a.holiday){
			continue;
		}
		var t = 0;
		if(a.holiday.range == teasp.constant.RANGE_TIME){
			t = Math.abs(ymap[a.id] && ymap[a.id].totalTime || 0);
		}
		if(dmap[a.id] || t > 0){
			lst.push({
				startDate : a.startDate,
				endDate   : a.endDate,
				subject   : a.holiday.name,
				range     : a.holiday.range,
				days      : (dmap[a.id] ? dmap[a.id].days : 0),
				time      : (t || 0),
				note      : (a.note || '')
			});
		}
	}
	lst = lst.sort(function(a, b){
		if(a.startDate == b.startDate){
			return (a.range == '2' ? -1 : 1);
		}
		return (a.startDate < b.startDate ? -1 : 1);
	});
	return { startDate: hh.startDate, list: lst };
};

/**
 * 【勤怠】失効した有給休暇を積立休暇として積立てるか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isEnableStockHoliday = function(){
	return (this.getObj().config.enableStockHoliday || false);
};

/**
 * 【勤怠】勤務表に工数入力ボタンを表示か
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isInputWorkingTimeOnWorkTImeView = function(){
	return (!teasp.isNarrow() && this.getObj().config.inputWorkingTimeOnWorkTimeView) || false;
};

/**
 * 入退館管理機能を使用するかつ入退館管理対象者か
 *
 * @param {boolean=} flag trueならteasp.isNarrow()が真のときfalseを返す
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isInputAccessControl = function(flag){
	if(flag && teasp.isNarrow()){
		return false;
	}
	if(!this.getObj().common.useAccessControlSystem){
		return false;
	}
	if(this.isEmpMonthFixed(null, true)){ // 月次確定済み
		return this.getObj().month.inputAccessControlFlag ? true : false;
	}else{
		return (this.getObj().config.useAccessControlSystem // 入退館管理機能を使用する
			&& this.getInputAccessControlFlagByDate()) // 入退館管理対象者フラグ
			? true : false;
	}
};

/**
 * 勤怠社員の入退館管理対象者フラグ履歴から入退館管理対象かどうかを判定
 * （Apex の AtkEmpLogic2.getInputAccessControlFlagByDate() と同じロジック）
 * @returns {number} 1 or 0
 */
teasp.data.Pouch.prototype.getInputAccessControlFlagByDate = function(){
	var dt = (this.getObj().month && this.getObj().month.endDate) || null;
	var te = this.getObj().targetEmp;
	if(!dt || te.inputAccessControlFlagLock){
		return te.inputAccessControlFlag;
	}
	var hists = te.inputAccessControlFlagHistory;
	// ※ inputAccessControlFlagHistory は teasp.logic.convert.convTargetEmpObj() で
	// オブジェクト配列化と日付昇順ソート済み
	if(hists && hists.length){
		for(var i = 0 ; i < hists.length ; i++){
			var h = hists[i];
			if(h.date > dt){
				return h.inputAccessControlFlag;
			}
		}
	}
	return te.inputAccessControlFlag;
};

// 入退館管理機能を使用する＝オンかを返す
teasp.data.Pouch.prototype.isInputAccessControlValid = function(){
	return (this.getObj().common.useAccessControlSystem
		&& this.getObj().config.useAccessControlSystem);
};

// 入退館管理対象者か否かを返す（個人設定画面用）
teasp.data.Pouch.prototype.getInputAccessControlStr = function(){
	if(this.isInputAccessControlValid()){ // 入退館管理機能を使用する
		if(this.getObj().targetEmp.inputAccessControlFlag == 1){
			return teasp.message.getLabel('em10001150'); // 対象
		}else{
			return teasp.message.getLabel('em10001160'); // 対象外
		}
	}
	return '';
};

/**
 * 月次サマリに入退館情報を表示する
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isMsAccessInfo = function(){
	return (this.isInputAccessControl() // 月次サマリに入退館情報を表示する
			&& this.getObj().config.msAccessInfo); // 入退館管理機能を使用するかつ入館管理対象者
};

/**
 * 2暦日で勤務日種別が異なる24:00以降の入力不可
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isLeavingAcrossNextDay = function(){
	return ((this.getObj().config.leavingAcrossNextDay || '0') != '0');
};

/**
 * 休日出勤時には24:00を超えた勤務を許さない
 * @returns {boolean} true:許さない
 */
teasp.data.Pouch.prototype.isProhibitAcrossNextDayOfHolidayWork = function(){
	return ((this.getObj().config.leavingAcrossNextDay || '0') == '2');
};

/**
 * 【勤怠】積立休暇の最大日数
 *
 * @return {number}
 */
teasp.data.Pouch.prototype.getMaxStockHoliday = function(){
	return (this.getObj().config.maxStockHoliday || 0);
};

/**
 * 【勤怠】1年で積立できる最大日数
 *
 * @return {number}
 */
teasp.data.Pouch.prototype.getMaxStockHolidayPerYear = function(){
	return (this.getObj().config.maxStockHolidayPerYear || 0);
};

/**
 * 【勤怠】法定休日がなくなる申請を禁止か
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isProhibitApplicantEliminatingLegalHoliday = function(){
	return (this.getObj().config.prohibitApplicantEliminatingLegalHoliday || false);
};

/**
 * 【勤怠】承認されるまで時間入力を禁止か
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isProhibitInputTimeUntilApproved = function(){
	return (this.getObj().config.prohibitInputTimeUntilApproved || false);
};

/**
 * 【勤怠】日次確定ボタンを独立させるか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isSeparateDailyFixButton = function(){
	return (this.getObj().config.separateDailyFixButton || false);
};

/**
 * 【勤怠】期間の36協定時間を集計するか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isSummary36TimePeriod = function(){
	return (this.getObj().config.summary36TimePeriod || false);
};

/**
 * 【共通】部署オブジェクトのリストを返す
 *
 * @param {string=} date
 * @return {Array.<Object>}
 */
teasp.data.Pouch.prototype.getDeptList = function(date){
	if(!date){
		return (this.getObj().depts || []);
	}
	var depts = dojo.clone(this.getObj().depts || []);
	teasp.util.levelingDepts(depts, date);
	return depts;
};

/**
 * 【共通】月次確定なしで部署確定可能か
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isPermitDeptFixWoMonthFix = function(){
	return this.getObj().common.permitDeptFixWoMonthFix;
};

/**
 * 【勤怠】勤務時間を修正できる社員を返す
 *
 * @return {number} =0:制限なし  =1:本人以外(上司、管理者)  =2:管理者のみ
 */
teasp.data.Pouch.prototype.getPermitUpdateTimeLevel = function(){
	return this.getObj().config.permitUpdateTimeLevel;
};

/**
 * 【勤怠】編集可能か
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isUpdater = function(){
	var p = this.getPermitUpdateTimeLevel();
	if(!p){
		return true;
	}
	if(p == 1 && !this.isOwner()){ // 対象社員以外のユーザが開いている
		return true;
	}else if(p == 2 && this.isAdmin(true)){
		return true;
	}else if(p == 3 && (this.isAdmin(true) || this.isAllEditor())){
		return true;
	}
	return false;
};

/**
 * 【勤怠】残業申請を必要とする時刻を返す
 *
 * @return {number}
 */
teasp.data.Pouch.prototype.getOverTimeBorderTime = function(endTime, config){
	var c = config || this.getObj().config;
	if(c.workSystem == teasp.constant.WORK_SYSTEM_FLEX){
		return Math.max(c.flexEndTime, endTime);
	}
	return c.overTimeBorderTime;
};

/**
 * 【勤怠】早朝勤務申請を必要とする時刻を返す
 *
 * @return {number}
 */
teasp.data.Pouch.prototype.getEarlyWorkBorderTime = function(startTime, config){
	var c = config || this.getObj().config;
	if(c.workSystem == teasp.constant.WORK_SYSTEM_FLEX){
		return Math.min(c.flexStartTime, startTime);
	}
	return c.earlyWorkBorderTime;
};

/**
 * 【勤怠】裁量の場合の残業は夜間割増のみ認めるか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isNightChargeOnly = function(){
	return (this.getObj().config.nightChargeOnly || false);
};

/**
 * 【勤怠】遅刻・早退を強調表示するか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isHighlightLateEarly = function(){
	return (this.getObj().config.highlightLateEarly || false);
};

/**
 * 1日の法定労働時間
 * @returns {Number}
 */
teasp.data.Pouch.prototype.getLegalTimeOfDay = function(){
	return (this.getObj().config.legalTimeOfDay || 0);
};

/**
 * フレックスタイム制の月の所定労働時間は「一律固定」か
 * @returns {Boolean}
 */
teasp.data.Pouch.prototype.isFlexFixTime = function(){
	return (this.getObj().config.flexFixOption == '1');
};

/**
 * 【勤怠】出社時刻から退社時刻の制限
 *
 * @return {number}
 */
teasp.data.Pouch.prototype.getLimitedTimeDistance = function(){
	return (this.dataObj.common.limitedTimeDistance || 48) * 60;
};

/**
 * 開始日～終了日にかかる月度オブジェクトのリストを返す
 *
 * @param {string} sd
 * @param {string} ed
 * @returns {Array.<Object>}
 */
teasp.data.Pouch.prototype.getRangeMonths = function(sd, ed){
	var months = this.dataObj.months;
	var l = [];
	for(var i = 0 ; i < months.length ; i++){
		if(months[i].startDate <= ed && months[i].endDate >= sd){
			l.push(months[i]);
		}
	}
	return l;
};

/**
 * 日付で下記のどちらかの条件に該当すれば、古いデータと判定する
 * ・本日日付の１年前以前である。
 * ・指定日の月度が直近の確定済みの月度以前である。
 * ※ クロージャ関数を返す
 * @returns {Function}
 */
teasp.data.Pouch.prototype.isOldDate = function(){
	var months = this.dataObj.months || []; // 月度オブジェクトのリスト（月度の昇順でソートされている前提）
	var lms = [];
	for(var i = months.length - 1 ; i >= 0 ; i--){
		var m = months[i];
		if(m.apply && teasp.constant.STATUS_FIX.contains(m.apply.status)){ // 確定済みである
			lms.push('' + m.yearMonth);
		}
	}
	return teasp.util.isOldDate(lms, this.getInitialDateOfMonth(), this.getMarkOfMonth());
};

/**
 * シフトしたコアタイムに対する標準時間を得る
 *
 * @param obj {{st:number,et:number,pattern:Object}} 開始・終了時刻、勤務パターン
 * @returns {Object}
 */
teasp.data.Pouch.prototype.getStandardRange = function(obj){
	var c = this.getObj().config;
	var dp = c.defaultPattern;
	if(obj.st == dp.stdStartTime && obj.et == dp.stdEndTime){ // 開始・終了時刻は標準の始業・終業時刻と同じ
		return { from: obj.st, to: obj.et };
	}
	if(obj.pattern && obj.pattern.disableCoreTime){ // 勤務パターンで「コア時間帯＝使用しない」設定
		if(obj.st == obj.pattern.stdStartTime && obj.et == obj.pattern.stdEndTime){ // 開始・終了時刻は勤務パターンの始業・終業時刻と同じ
			return { from: obj.st, to: obj.et };
		}
	}
	var st, et;
	if(obj.useCoreTime){ // 標準でコアタイムを使う場合
		st = obj.st - (c.coreStartTime - dp.stdStartTime); // 標準の始業時刻～コアタイム開始時刻の差分だけ開始時刻をずらす
		et = obj.et + (dp.stdEndTime   - c.coreEndTime  ); // コアタイム終了時刻～標準の終業時刻の差分だけ終了時刻をずらす
	}else{ // 標準でコアタイムを使わない場合、所定労働時間から範囲を判定する
		var aps = obj.timeHolidayApplys || []; // 時間単位有休
		// コアタイムの外に時間単位有休があれば、それに合わせて範囲を拡大する
		for(var i = 0 ; i < aps.length ; i++){
			if(aps[i].startTime < obj.st){
				obj.st = aps[i].startTime;
			}
			if(obj.et < aps[i].endTime){
				obj.et = aps[i].endTime;
			}
		}
		st = this.getReachTime(obj.et, obj.pattern.restTimes, obj.pattern.standardFixTime, true );
		et = this.getReachTime(obj.st, obj.pattern.restTimes, obj.pattern.standardFixTime, false);
	}
	return { from: (st < obj.st ? st : obj.st), to: (obj.et < et ? et : obj.et) };
};

/**
 * 所定労働時間に達する時刻を得る
 * @param {number} tm 基準の時刻
 * @param {Array.<Object>} rests 所定休憩
 * @param {number} ft 所定労働時間
 * @param {boolean} face 方向
 * @returns {number}
 */
teasp.data.Pouch.prototype.getReachTime = function(tm, rests, ft, face){
	var fh = this.getPushRestTime(ft);
	var nt = tm;
	if(!face){
		nt = teasp.logic.EmpTime.getReachTime(tm, rests, ft); // 所定に達する終了時刻
		var h = (nt - tm) - ft;
		if(h < fh){ // 自動挿入される休憩の分だけ終了をずらす
			nt = teasp.logic.EmpTime.getReachTime(nt, rests, fh - h);
		}
	}else{
		nt = teasp.logic.EmpTime.getReachTimeReverse(tm, rests, ft); // 所定に達する開始時間
		var h = (tm - nt) - ft;
		if(h < fh){ // 自動挿入される休憩の分だけ終了をずらす
			nt = teasp.logic.EmpTime.getReachTimeReverse(nt, rests, fh - h);
		}
	}
	return nt;
};

/**
 * 労働時間に対して自動挿入される休憩時間
 * @param {number} t 労働時間
 * @returns {number}
 */
teasp.data.Pouch.prototype.getPushRestTime = function(t){
	var rcs = this.getRestTimeCheck(); // 法定休憩時間のチェック
	var h = 0;
	for(var i = 0 ; i < rcs.length ; i++){
		var rc = rcs[i];
		if(rc.check && rc.push){
			if(t > rc.workTime && h < rc.restTime){
				h = rc.restTime;
			}
		}
	}
	return h;
};

/**
 * 乖離許容時間(分)
 * @returns {number}
 */
teasp.data.Pouch.prototype.getPermitDivergenceTime = function(){
	return this.getObj().config.permitDivergenceTime || 0;
};

/**
 * 乖離判定前でも日次確定申請可
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isPermitDailyApply = function(){
	return this.getObj().config.permitDailyApply || false;
};

/**
 * 月次確定は乖離が発生していても申請可能
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isPermitMonthlyApply = function(){
	return this.getObj().config.permitMonthlyApply || false;
};

/**
 * 乖離ありかつ理由なしのリストを返す
 * @param {Object} ng
 * @returns {Array.<Object>}
 */
teasp.data.Pouch.prototype.getDiverges = function(){
	return (this.isInputAccessControl() && this.diverges) || [];
};

/**
 * 乖離ありかつ理由なしをセット
 *
 * @param {Object} ng
 */
teasp.data.Pouch.prototype.setDiverges = function(ng){
	if(!this.diverges){
		this.diverges = [];
	}
	this.diverges.push(ng);
};

teasp.data.Pouch.prototype.clearDiverges = function(){
	this.diverges = null;
};

/**
 * 入退館管理使用かつ勤怠月次IDがnullの場合、勤怠月次・勤怠日次レコードを作成する
 * @param {Function} callback
 */
teasp.data.Pouch.prototype.checkEmpMonthHook = function(callback){
	if(this.isInputAccessControl() && !this.getObj().month.id){
		teasp.manager.request(
			'createEmpMonthHook',
			{
				empId      : this.getEmpId(),
				month      : this.getYearMonth(),
				startDate  : this.getStartDate()
			},
			this,
			{},
			this,
			function(){
				callback(true);
			},
			function(event){
				callback(false, event);
			}
		);
	}else{
		callback(true);
	}
};

/**
 * Config の集計エリアカスタマイズ設定のルートを返す
 * @return {Object|null}
 */
teasp.data.Pouch.prototype.getSummarySettings = function(){
	var settings = (this.dataObj.common.config && this.dataObj.common.config.summarySettings) || null;
	return (settings ? dojo.clone(settings) : null);
};

/**
 * Config の勤怠月次カスタム項目リストがあるかどうかを返す
 * @return {boolean}
 */
teasp.data.Pouch.prototype.existEmpMonthCustomKeys = function(){
	return (this.dataObj.common.config
		&& this.dataObj.common.config.summarySettings
		&& this.dataObj.common.config.summarySettings.empMonthCustomKeys) ? true : false;
};

/**
 * Config の勤怠月次カスタム項目リストを返す
 * @return {Array.<string>}
 */
teasp.data.Pouch.prototype.getEmpMonthCustomKeys = function(){
	var keys = (this.dataObj.common.config
		&& this.dataObj.common.config.summarySettings
		&& this.dataObj.common.config.summarySettings.empMonthCustomKeys) || '';
	return keys.split(',');
};

/**
 * 勤怠月次カスタム項目の値を返す
 * @return {*}
 */
teasp.data.Pouch.prototype.getEmpMonthValueByKey = function(key){
	var m = /^(\-)?([\d\.]+)$/.exec(key);
	if(m){ // keyが数字だけなら数値に変換して返す
		return parseFloat(m[0]);
	}
	var ks = key.split('.');
	var obj = this.getObj().month || {};
	for(var i = 0 ; i < ks.length ; i++){
		var k = ks[i];
		if(i < (ks.length - 1) && obj){
			obj = obj[k];
		}else if(obj){
			return (typeof(obj[k]) == 'number' ? obj[k] : (obj[k] || null));
		}else{
			return null;
		}
	}
	return null;
};

/**
 * 所定労働時間をMapにセット
 * ※ 変形労働時間制のみで使用
 * @param {Object} month
 * @param {string} dkey (yyyy-MM-dd)
 * @param {number} ft 所定労働時間
 */
teasp.data.Pouch.prototype.setFixTimeMap = function(month, dkey, ft){
	this.dataObj.fixTimeMap[dkey] = ft;
};

/**
 * 指定日の週の所定労働時間の合計を返す
 * ※ 変形労働時間制のみで使用
 * ※ setFixTimeMap で関係日に所定労働時間がセットされていること
 * @param {Object} month
 * @param {string} dkey (yyyy-MM-dd)
 * @returns {Number}
 */
teasp.data.Pouch.prototype.getLegalTimeWeek = function(month, dkey){
	var config = month.config;
	if(config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE
	&& config.variablePeriod > 0
	&& this.isUseLegacyIrregularLogicUntil(month)){
		return 0; // 変形労働制1ヶ月以上かつ旧計算ロジックオンの場合は常に0を返す
	}
	var legalTimeOfWeek = config.legalTimeOfWeek;
	var _sd = teasp.util.date.parseDate(dkey);
	var wx = _sd.getDay();
	var startOfWeek = parseInt(config.initialDayOfWeek, 10); // 起算曜日
	if(startOfWeek != wx){
		_sd = teasp.util.date.addDays(_sd, startOfWeek - wx - (wx < startOfWeek ? 7 : 0));
	}
	var _ed = teasp.util.date.addDays(_sd, 7);
	var sd = teasp.util.date.formatDate(_sd);
	var ed = teasp.util.date.formatDate(_ed);
	// 変形労働制1ヶ月以上の場合、期の区切りに合わせて週の法定労働時間を計算する
	if(config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE
	&& config.variablePeriod > 0
	&& month.periodInfo
	&& (month.periodInfo.elapsedMonth == 1 || month.periodInfo.elapsedMonth == month.periodInfo.numberOfMonths)
	){
		if(month.periodInfo.elapsedMonth == 1 && sd < month.startDate){
			sd = month.startDate;
		}
		var nsd = teasp.util.date.addDays(month.endDate, 1);
		if(month.periodInfo.elapsedMonth == month.periodInfo.numberOfMonths && ed > nsd){
			ed = nsd;
		}
		// 週途中に入社日か退社日があれば調整（#9353）
		var entryDate = this.getEntryDate(); // 入社日
		var retireDate = this.getEndDate();  // 退社日
		if(entryDate && sd < entryDate){
			sd = entryDate;
		}
		if(retireDate){
			retireDate = teasp.util.date.addDays(retireDate, 1); // ed は終了日+1日なので退社日も+1日してから比較する
			if(retireDate < ed){
				ed = retireDate;
			}
		}
		var n = teasp.util.date.daysInRange(sd, ed) - 1;
		var p = config.variablePeriod || 0;
		legalTimeOfWeek = Math.floor(n * (p > 1 ? (40 * 60) : config.legalTimeOfWeek) / 7);
	}
	var ft = 0;
	while(sd < ed){
		if(this.isAlive(sd)){
			ft += (this.dataObj.fixTimeMap[sd] || 0);
		}
		sd = teasp.util.date.addDays(sd, 1);
	}
	return Math.max(legalTimeOfWeek, ft);
};

/**
 * 変形労働時間の勤怠計算を旧ロジックに戻す（裏オプション）
 * @param {Object} month
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isUseLegacyIrregularLogicUntil = function(month){
	var ym = ((this.dataObj.common && this.dataObj.common.config) || {}).useLegacyIrregularLogicUntil;
	return (ym && month.yearMonth <= ym);
};

/**
 * 時間単位休の回数上限を返す
 * デフォルトは3
 * @returns {number}
 */
teasp.data.Pouch.prototype.getHourlyLeaveLimitOfDay = function(){
	var n = ((this.dataObj.common && this.dataObj.common.config) || {}).hourlyLeaveLimitOfDay;
	return n || 3;
};

/**
 * 時間単位休の回数上限に達しているか
 * @param {string} dkey (yyyy-MM-dd)
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isHourlyLeaveLimitOfDay = function(dkey){
	var day = this.getObj().days[dkey];
	var ht = (day && day.rack && day.rack.validApplys && day.rack.validApplys.holidayTime) || [];
	return (ht.length >= this.getHourlyLeaveLimitOfDay());
};

teasp.data.Pouch.prototype.getConfigHistory = function(){
	return this.dataObj.configHistory || [];
};
/**
 * 勤怠積休データの基準時間を検査し、不整合がある場合はtrueを返す。
 * オプションで再計算を実行する
 * @param {string} empId
 * @param {Array.<Object>} configHistory
 * @param {Array.<Object>} stocks
 * @param {string} td (yyyy-mm-dd)
 * @param {string} manageName nullの場合、再計算はすべての管理名が対象
 * @param {Function} callback 省略時は不整合の有無のみ返す。指定時は不整合があれば再計算を実行
 * @return {boolean}
 */
teasp.data.Pouch.checkStockBaseTime = function(empId, configHistory, stocks, td, manageName, callback){
	var unmatch = false;
	for(var i = 0 ; i < stocks.length ; i++){
		var stock = stocks[i];
		if((manageName && stock.type != manageName)
		|| (!manageName && stock.type == '代休')){
			continue;
		}
		if(!stock.baseTime && (stock.days < 0 || (new Decimal(stock.days)).times(2).isInteger())){
			continue;
		}
		var d = null;
		if(stock.days > 0){
			d = stock.startDate;
		}else if(stock.days < 0){
			d = stock.date;
		}
		var c = teasp.util.getConfigByDate(configHistory || [], d);
		var bt = null;
		if(c.config){
			bt = c.config.BaseTimeForStock__c || null;
		}else{
			bt = c.baseTimeForStock || null;
		}
		if(stock.baseTime != bt){
			unmatch = true;
			break;
		}
	}
	if(callback){
		if(unmatch){
			teasp.data.Pouch.rebuildStockWithTime(empId, td, manageName, callback);
		}else{
			callback(0);
		}
	}
	return unmatch;
};

/**
 * 勤怠積休の再計算実行
 * @param {string} empId
 * @param {string} td (yyyy-mm-dd)
 * @param {string} manageName nullの場合、再計算はすべての管理名が対象
 * @param {Function} callback 省略時は不整合の有無のみ返す。指定時は不整合があれば再計算を実行
 */
teasp.data.Pouch.rebuildStockWithTime = function(empId, td, manageName, callback){
	console.log('rebuildStockWithTime empId=' + empId + ', stockType=' + (manageName || 'null') + ', date=' + td);
	teasp.action.contact.remoteMethods(
		[{
			funcName: 'getExtResult',
			params  : {
				action: 'rebuildStockWithTime',
				empId: empId,
				stockType: manageName,
				date: td
			}
		}],
		{
			errorAreaId : null,
			nowait      : false
		},
		function(result){
			console.log(result);
			callback(1, teasp.logic.convert.convStockObjs(result.stocks), result.mapError);
		},
		function(event){
			console.log(event);
			callback(-1, teasp.message.getErrorMessage(event));
		},
		this
	);
};

/**
 * 対象日以降に基準時間変更を行っている場合、変更履歴を返す
 * @param {Array.<Object>} configHistory
 * @param {string} d 対象日
 * @return {Array.<Object>} 変更履歴
 */
teasp.data.Pouch.getFutureBaseTimeForStockChange = function(configHistory, d){
	var cbt = teasp.util.getBaseTimeForStock(teasp.util.getConfigByDate(configHistory, d));
	var nexts = teasp.util.getFutureConfigs(configHistory, d);
	for(var i = 0 ; i < nexts.length ; i++){
		var nbt = teasp.util.getBaseTimeForStock(nexts[i]);
		if(cbt != nbt){
			nexts.splice(0, i);
			return nexts;
		}
	}
	return [];
};

/**
 * 対象日以降に基準時間変更が行われていてかつ変更後に時間休の消化が行われているかを返す
 * @param {Object} anyZan teasp.data.Pouch.getStockZan の戻り値
 * @param {Array.<Object>} configHistory
 * @param {string} d 対象日
 * @return {number} 0:時間休消化なし 1:対象日以前に時間休消化あり 2:対象日より後の基準時間時間変更後に時間休消化あり 3:どちらも時間休消化あり
 */
teasp.data.Pouch.getSpendStockChangedBaseTime = function(anyZan, configHistory, d){
	if(!anyZan || !anyZan.stocks || !anyZan.stocks.length){
		return 0;
	}
	var nexts = teasp.data.Pouch.getFutureBaseTimeForStockChange(configHistory, d);
	if(!nexts.length){
		return 0;
	}
	var sd = nexts[0].startDate;
	var futures = [];
	var pasts = [];
	for(var i = 0 ; i < anyZan.stocks.length ; i++){
		var stock = anyZan.stocks[i];
		if(stock.days < 0 || d < stock.startDate || stock.limitDate <= d){
			continue;
		}
		for(var j = 0 ; j < stock.consumers.length ; j++){
			var c = stock.consumers[j];
			if(!c.lostFlag && c.timeUnit){
				if(sd <= c.date){
					futures.push(c);
				}else{
					pasts.push(c);
				}
			}
		}
	}
	if(!pasts.length && !futures.length){
		return 0;
	}else if(!futures.length){
		return 1;
	}else if(!pasts.length){
		return 2;
	}
	return 3;
};

/**
 * 指定期間内の基準時間変更の変遷を返す
 * @param {Array.<Object>} configHistory
 * @param {Object} anyZan teasp.data.Pouch.getStockZan の戻り値
 * @param {string} td 終了日
 * @return {boolean} true:有 false:無
 */
teasp.data.Pouch.getBaseTimeChanges = function(configHistory, anyZan, td){
	var chs = configHistory || [];
	var sd = anyZan.startDateMin;
	var cbt = teasp.util.getBaseTimeForStock(teasp.util.getConfigByDate(chs, td));
	var pbt = null;
	var pobj = null;
	var objs = [];
	for(var i = 0 ; i < chs.length ; i++){
		var ch = chs[i];
		if(ch.endDate && ch.endDate < sd){
			continue;
		}
		if(ch.startDate && td < ch.startDate){
			break;
		}
		var bt = teasp.util.getBaseTimeForStock(ch);
		if(!pbt){
			pobj = {
				startDate: ch.startDate,
				endDate: ch.endDate,
				baseTimeForStock: bt
			}
			objs.push(pobj);
		}else if(pbt == bt){
			pobj.endDate = ch.endDate;
		}else{
			pobj = {
				startDate: ch.startDate,
				endDate: ch.endDate,
				baseTimeForStock: bt
			}
			objs.push(pobj);
		}
		pbt = bt;
	}
	return objs;
};

/**
 * 残時間を切り上げるかどうかを返す
 * @param {Array.<Object>} configHistory
 * @param {Object} anyZan teasp.data.Pouch.getStockZan の戻り値
 * @param {string} td 対象日
 * @return {boolean} true:切上る false:切上げない
 */
teasp.data.Pouch.isZanRoundUp = function(configHistory, anyZan, td){
	var chs = teasp.data.Pouch.getBaseTimeChanges(configHistory, anyZan, td);
	var rd = new Decimal(0);
	var mp = {};
	var tx = -1;
	for(var x = 0 ; x < chs.length ; x++){
		var ch = chs[x];
		if((!ch.startDate || ch.startDate <= td) && (!ch.endDate || td <= ch.endDate)){
			tx = x;
		}
		if(!rd.isZero() && !rd.times(2).isInt() && ch.baseTimeForStock){
			var n = rd.mod(1);
			var m = n;
			if(n.greaterThan(0.5)){
				m = m.minus(0.5);
			}
			m = m.times(ch.baseTimeForStock).div(60);
			if(!m.isInt()){
				if(m.mod(1).greaterThan(0.5)){
					m = m.ceil();
				}else{
					m = m.ceil().minus(0.5);
				}
			}
			rd = rd.minus(n).plus(n.greaterThan(0.5) ? 0.5 : 0).plus(m.times(60).div(ch.baseTimeForStock));
		}
		ch.beginZan = rd.toNumber();
		var plusd = new Decimal(0);
		var minusd = new Decimal(0);
		var minusLst = [];
		for(var i = 0 ; i < anyZan.stocks.length ; i++){
			var stock = anyZan.stocks[i];
			if(stock.days < 0 || (ch.startDate && stock.limitDate <= ch.startDate) || (ch.endDate && ch.endDate < stock.startDate)){
				continue;
			}
			if(!mp[stock.id]){
				rd = rd.plus(stock.days);
				mp[stock.id] = 1;
				plusd = plusd.plus(stock.days);
			}
			for(var j = 0 ; j < stock.consumers.length ; j++){
				var c = stock.consumers[j];
				if(c.lostFlag){
					if(!mp[c.consumedByStockId]){
						rd = rd.plus(c.days);
						minusd = minusd.plus(Math.abs(c.days));
						minusLst.push(Math.abs(c.days));
						mp[c.consumedByStockId] = 1;
					}
				}else{
					if((!ch.startDate || ch.startDate <= c.date) && (!ch.endDate || c.date <= ch.endDate)){
						if(!mp[c.consumedByStockId]){
							rd = rd.plus(c.days);
							minusd = minusd.plus(Math.abs(c.days));
							minusLst.push(Math.abs(c.days));
							mp[c.consumedByStockId] = 1;
						}
					}
				}
			}
		}
		ch.plus = plusd.toNumber();
		ch.minus = minusd.toNumber();
		ch.minusLst = minusLst;
		ch.zan = rd.toNumber();
		ch.fraction = !rd.times(2).isInt();
	}
	console.log(chs);
	if(tx <= 0){
		return false;
	}
	return chs[tx - 1].fraction;
};

/**
 * シフト振替申請を使用するか
 * ★注意★ 下記の2つとも true の時だけ使用可能
 * AtkCommon__c.Config__c 内の useShiftChange
 * AtkConfig__c.Config__c 内の empApply.useShiftChange
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isUseShiftChange = function(){
	return ((this.dataObj.common.config || {}).useShiftChange
		&& (((this.dataObj.config.config || {}).empApply) || {}).useShiftChange) || false;
};

/**
 * シフト振替申請可能な候補日の情報を返す
 * @param {string} td YYYY-MM-DD
 * @returns {Object}
 */
teasp.data.Pouch.prototype.getShiftChangeableDates = function(td){
	var week = {};
	var m = this.getObj().month;
	var w = teasp.util.date.getWeekByDate(td, this.getInitialDayOfWeek());
	var dt = null;
	for(var i = 0 ; i < w.length ; i++){
		var d = w[i];
		var o = {
			own: (td == d)
		}
		week[d] = o;
		if(d < m.startDate || m.endDate < d){
			o.out = 1;
		}
		if(d < this.getEntryDate() || this.getEndDate() < d){
			o.out = 2;
		}
		var dw = this.getEmpDay(d);
		var va = dw.getValidApplys();
		if(va){
			o.validShiftSet    = (va.shiftSet && va.shiftSet.dayType ? true : false); // シフト設定あり
			o.validShiftChange = (va.shiftChange ? true : false); // シフト振替申請あり
			o.validDailyFix    = (va.dailyFix    ? true : false); // 日次確定あり
			if(o.validShiftSet && !o.validShiftChange && !o.validDailyFix){
				o.fine = true; // シフト振替の条件を満たす
				o.dayType = dw.getDayType();
				if(!o.out && o.own){
					dt = o.dayType;
				}
			}
		}
	}
	if(dt !== null){
		for(var key in week){
			if(!week.hasOwnProperty(key)){
				continue;
			}
			var o = week[key];
			if(o.out || !o.fine || o.own){
				continue;
			}
			// 振替元と振替先が平日と休日の組合せならシフト振替可能
			if((!dt && o.dayType) || (dt && !o.dayType)){
				o.changeable = true;
			}
		}
	}
	return week;
};

/**
 * 月内のシフト振替申請のエラーを調査する
 *
 */
teasp.data.Pouch.prototype.checkShiftChangeMonth = function(){
	var dlst = this.getMonthDateList();
	var checked = {};
	for(var i = 0 ; i < dlst.length ; i++){
		var dk = dlst[i];
		var dw = this.getEmpDay(dk);
		var dm = this.getObj().month;
		var sa = dw.getEmpApplyByKey(teasp.constant.APPLY_KEY_SHIFTCHANGE); // シフト振替申請
		if(!sa || checked[sa.id]){
			continue;
		}
		var ew = this.getEmpDay(dk == sa.exchangeDate ? sa.startDate : sa.exchangeDate);
		var w = teasp.util.date.getWeekByDate(sa.startDate, this.getInitialDayOfWeek());
		var inWeek = (w.indexOf(ew.getKey()) >= 0);
		var em = this.getEmpMonth(null, ew.getKey());
		var dayType1 = dw.getDayType();
		var dayType2 = ew.getDayType();
		checked[sa.id] = 1;
		if((!dayType1 && !dayType2) || (dayType1 && dayType2)){ // 組合せが不正
			dw.getObj().rack.invalidApplys.push({
				apply  : sa,
				reason : teasp.constant.REASON_NG_SHIFTCHANGE1,
				keep   : true
			});
		}
	}
};

/**
 * 月次残業申請を使用するか
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isUseMonthlyOverTimeApply = function(){
	var c = this.dataObj.config;
	// フレックスタイム制かつ清算期間=1ヵ月 以外はfalse
	if(c.workSystem != teasp.constant.WORK_SYSTEM_FLEX || c.variablePeriod != 1){
		return false;
	}
	return (((c.config || {}).empApply) || {}).useMonthlyOverTimeApply || false;
};
/**
 * 月次残業申請ボタンを表示するか
 */
teasp.data.Pouch.prototype.isShowMonthlyOverTimeApplyButton = function(){
	if(this.getMonthlyOverTimeApplys().length > 0){ // 月次残業申請がある
		return true;
	}
	return this.isUseMonthlyOverTimeApply();
};
/**
 * 勤務確定時に月次残業申請のチェックを行うか
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isMonthlyOverTimeRequireFlag = function(){
	if(!this.isUseMonthlyOverTimeApply()){
		return false;
	}
	return (((this.dataObj.config.config || {}).empApply) || {}).monthlyOverTimeRequireFlag || false;
};
/**
 * 勤務確定時の月次残業申請チェックの閾値
 * @return {number}
 */
teasp.data.Pouch.prototype.getMonthlyOverTimeRequireTime = function(){
	return (((this.dataObj.config.config || {}).empApply) || {}).monthlyOverTimeRequireTime || 0;
};
/**
 * 月次残業申請の複数申請可
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isMonthlyOverTimeDupl = function(){
	return (((this.dataObj.config.config || {}).empApply) || {}).monthlyOverTimeDupl || false;
};
/**
 * 申請が有効かチェックする
 * @param {Object} applyObj 月次残業申請
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isValidMonthlyOverTimeApply = function(applyObj){
	return this.isUseMonthlyOverTimeApply();
};
/**
 * 月次残業申請に表示する過不足時間
 * @param {Object} applyObj 月次残業申請
 * @return {string}
 */
teasp.data.Pouch.prototype.getAmountTimeForApply = function(applyObj){
	var c = this.dataObj.config;
	// フレックスタイム制かつ清算期間=1ヵ月のみ過不足時間を返す
	if(c.workSystem == teasp.constant.WORK_SYSTEM_FLEX && c.variablePeriod == 1){
		return this.getMonthSubTimeByKey('amountTime'); // 過不足時間
	}
	return '-';
};
/**
 * 月次残業申請の新規作成可
 * @return {boolean}
 */
teasp.data.Pouch.prototype.canSelectMonthlyOverTime = function(){
	if(!this.isUseMonthlyOverTimeApply()){
		return false;
	}
	if(!this.isMonthlyOverTimeDupl() && this.getMonthlyOverTimeApplys().length > 0){ // 複数申請不可かつすでに残業申請済み
		return false;
	}
	return true;
};
/**
 * 月次残業申請を変数に格納
 * 月度の開始日≦申請の開始日≦月度の終了日のものだけに絞る
 * @param {Array.<Object>} applys
 */
teasp.data.Pouch.prototype.setMonthlyOverTimeApplys = function(applys){
	this.monthlyOverTimeApplys = [];
	var sd = this.getEmpMonthStartDate();
	var ed = this.getEmpMonthLastDate();
	dojo.forEach(applys || [], function(apply){
		if(sd <= apply.startDate && apply.startDate <= ed){
			this.monthlyOverTimeApplys.push(apply);
		}
	}, this);
	// 申請日時の昇順にソート
	this.monthlyOverTimeApplys = this.monthlyOverTimeApplys.sort(function(a, b){
		if(a.applyTime == b.applyTime){ // 申請日時が同じ（通常あり得ない）ならID順
			return (a.id < b.id ? -1 : 1);
		}
		return (a.applyTime < b.applyTime ? -1 : 1);
	});
};
/**
 * 当月に紐づく月次残業申請の配列を返す
 */
teasp.data.Pouch.prototype.getMonthlyOverTimeApplys = function(){
	return this.monthlyOverTimeApplys || [];
};
/**
 * ボタン左側のステータスを示すアイコンのクラス名を返す
 * 「却下」＞「承認待ち」＞「それ以外」の優先で決める。
 */
teasp.data.Pouch.prototype.getStatusClassOfApplysIcon = function(applys){
	var rejects = [], waits = [], approves = [], others = [];
	dojo.forEach(applys || [], function(a){
		if(teasp.constant.STATUS_REJECTS.contains(a.status) && !a.close){
			rejects.push(a);
		}else if(teasp.constant.STATUS_WAIT == a.status){
			waits.push(a);
		}else if(teasp.constant.STATUS_APPROVES.contains(a.status)){
			approves.push(a);
		}
	});
	if(rejects.length){
		return 'png-sts006'; // 却下
	}else if(waits.length){
		return 'png-sts008'; // 承認待ち
	}else if(approves.length){
		return 'png-sts005'; // 承認済み
	}else{
		return 'png-add'; // (＋)
	}
};
/**
 * 月次残業申請のIDの配列を返す
 * @param {boolean} flag trueの場合は承認履歴がまだ読み込まれてない申請に絞る
 * return {Array.<string>}
 */
teasp.data.Pouch.prototype.getMonthlyOverTimeApplyIds = function(flag){
	var ids = [];
	dojo.forEach(this.getMonthlyOverTimeApplys(), function(apply){
		if(!flag || !apply.steps){
			ids.push(apply.id);
		}
	});
	return ids;
};

/**
 * 月次残業申請に承認履歴をセット
 * @param {Object} 承認履歴のリストを持つオブジェクト
 */
teasp.data.Pouch.prototype.setMonthlyApplySteps = function(obj){
	var applys = this.getMonthlyOverTimeApplys();
	for(var i = 0 ; i < applys.length ; i++){
		var a = applys[i];
		a.steps = [];
		dojo.forEach((obj || {}).steps || [], function(step){
			if(teasp.util.equalId(a.id, step.applyId)){
				a.steps.push(step);
			}
		});
	}
};
/**
 * 有効な申請の見込み残業時間を返す
 * 複数ある場合は申請日時が一番新しい申請の値を返す
 * @return {number|null}
 */
teasp.data.Pouch.prototype.getEstimatedOverTime = function(){
	var applys = this.getMonthlyOverTimeApplys();
	for(var i = (applys.length - 1) ; i >= 0 ; i--){
		var a = applys[i];
		if(teasp.constant.STATUS_FIX.contains(a.status)){
			return a.estimatedOverTime;
		}
	}
	return null;
};
/**
 * 承認待ちの申請あるいは却下を承諾していない月次残業申請を返す
 * @return {Array.<Object>}
 */
teasp.data.Pouch.prototype.getPendingMonthlyOverTimeApplys = function(){
	var waits = [];
	var applys = this.getMonthlyOverTimeApplys();
	for(var i = 0 ; i < applys.length ; i++){
		var a = applys[i];
		if((teasp.constant.STATUS_REJECTS.contains(a.status) && !a.close) // 却下後申請取消をしてない
		|| a.status == teasp.constant.STATUS_WAIT){ // 承認待ち
			waits.push(a); // 待ち状態（勤務確定できない）
		}
	}
	return waits;
};
/**
 * 過不足時間チェック
 * @return {{
 *   err {number} >0:エラー =-2:チェックしない =-1:閾値内  =0:見込み残業内
 *   errmsg {string} err>0 の場合のみ、エラーメッセージ
 * }}
 */
teasp.data.Pouch.prototype.checkMonthlyOverTimeApplys = function(){
	var result = {err:0, errmsg:null};
	if(!this.isMonthlyOverTimeRequireFlag()){ // チェックしない
		result.err = -2;
		return result;
	}
	var threshold = this.getMonthlyOverTimeRequireTime(); // 閾値
	var amount = this.getMonthSubValueByKey('amountTime'); // 過不足時間
	if(amount < threshold){ // 過不足時間は閾値未満
		result.err = -1;
		return result;
	}
	var estimated = this.getEstimatedOverTime();
	if(typeof(estimated) != 'number'){
		result.err = 1;
		result.errmsg = teasp.message.getLabel('mo00000011',  // 過不足時間が{0}以上の場合は月次残業申請を申請してください。
						teasp.util.time.timeValue(threshold));
		return result;
	}
	if(amount <= estimated){ // 過不足時間は見込み残業時間以下
		return result;
	}
	result.err = 2;
	result.errmsg = teasp.message.getLabel('mo00000012', // 過不足時間が申請した見込み残業時間（{0}）を超えています。月次残業申請の申請を修正し再申請してください。
					teasp.util.time.timeValue(estimated));
	return result;
};
/**
 * 公用外出入力欄を非表示にする
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isHideAwayTimeInputField = function(){
	return (this.dataObj.common.config || {}).hideAwayTimeInputField || false;
};

/**
 * 月次サマリーのヘルプURLを非表示にする
 * @returns {boolean}
 */
 teasp.data.Pouch.prototype.isHideMonthlySummaryHelpURL = function(){
	var hideURL = true;
	var empWorkSystem = this.getWorkSystem();
	if(empWorkSystem >= 0 || empWorkSystem <= 3)
		hideURL = false;
	if(this.dataObj.common.permitMonthlySummaryHelpURL)
		hideURL = true;
	return hideURL;
 };

 /**
 * 月次サマリーの勤務体系別のURLを返す
 * @returns {String}
 */
 teasp.data.Pouch.prototype.getHelpURL = function(){
	var helpURL;
	var empWorkSystem = this.getWorkSystem();
	
	if(empWorkSystem == 0){
		if(this.isDefaultUseDiscretionary()){
			//裁量労働
			if(this.dataObj.common.discretionaryWorkMSHelpURL == null){
				helpURL = "https://go.teamspirit.com/ts/help/msdw";
			}else{
				helpURL = this.dataObj.common.discretionaryWorkMSHelpURL;
			}
		}else{
			//固定労働制
			if(this.dataObj.common.fixedWorkMSHelpURL == null){
				helpURL = "https://go.teamspirit.com/ts/help/msfixed";
			}else{
				helpURL = this.dataObj.common.fixedWorkMSHelpURL;
			}
		}
	}else if(empWorkSystem == 1){
		//フレックスタイム制
		if(this.dataObj.common.flextimeMSHelpURL == null){
			helpURL = "https://go.teamspirit.com/ts/help/msflex";
		}else{
			helpURL = this.dataObj.common.flextimeMSHelpURL;
		}
	}else if(empWorkSystem == 2){
		//変形労働制
		if(this.dataObj.common.variableWorkMSHelpURL == null){
			helpURL = "https://go.teamspirit.com/ts/help/msvw";
		}else{
			helpURL = this.dataObj.common.variableWorkMSHelpURL;
		}
	}else if(empWorkSystem == 3){
		//管理監督者制
		if(this.dataObj.common.managerMSHelpURL == null){
			helpURL = "https://go.teamspirit.com/ts/help/msmanager";
		}else{
			helpURL = this.dataObj.common.managerMSHelpURL;
		}
	}
	return helpURL; 
 };