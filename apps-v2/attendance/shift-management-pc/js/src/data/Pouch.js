teasp.provide('teasp.data.Pouch');
/**
 * 【共通】データ管理クラス.
 *
 * @constructor
 */
teasp.data.Pouch = function(){
	/** @private */
	this.dataObj = {
		common : null,
		events : null,
		expItems : null,
		expApplyHistory : null,
		foreignCurrency : null,
		workNotes : [],
		fixTimeMap: {}
	};
	this.countNight = false; // 深夜労働をカウントするか
};

teasp.data.Pouch.NG_JOB_ASSIGN_EMP   = 1;
teasp.data.Pouch.NG_JOB_ASSIGN_CLASS = 2;
teasp.data.Pouch.NG_JOB_OUT_OF_TERM  = 3;

/**
 * 【共通】ルートオブジェクトを返す
 * @public
 * @return {Object} ルートオブジェクト
 */
teasp.data.Pouch.prototype.getObj = function(){
	return this.dataObj;
};

/**
 * 【共通】ルートオブジェクトの要素を返す
 * @public
 * @return {*} ルートオブジェクト
 */
teasp.data.Pouch.prototype.getKeyObj = function(key){
	return this.dataObj[key];
};

/**
 * 【共通】パラメータ情報を返す。
 * 画面呼び出しの引数（内部的に生成した値を含む）を返す
 * @public
 * @return {Object} パラメータ情報
 */
teasp.data.Pouch.prototype.getParams = function(){
	return (this.dataObj.params || {});
};

/**
 * 【共通】パラメータ情報をセット
 * @public
 * @param {Object} o パラメータ情報
 */
teasp.data.Pouch.prototype.setParams = function(o){
	this.dataObj.params = o;
};

/**
 * 【共通】パラメータ情報の要素を返す。
 * @public
 * @return {*} パラメータ情報の要素
 */
teasp.data.Pouch.prototype.getParamByKey = function(key){
	return this.dataObj.params[key];
};

/**
 * 【共通】パラメータ情報の日付を返す。
 * @public
 * @return {string} 日付('yyyy-MM-dd')
 */
teasp.data.Pouch.prototype.getParamDate = function(){
	return this.dataObj.params.date;
};

/**
 * 【共通】今日の日付を返す
 * @public
 * @return {string} 日付('yyyy-MM-dd')
 */
teasp.data.Pouch.prototype.getToday = function(){
	return teasp.util.date.formatDate(teasp.util.date.getToday());
};

/**
 * 【共通】データを格納する
 * @public
 * @param {string} key キー
 * @param {Object} o データオブジェクト
 */
teasp.data.Pouch.prototype.setKeyObj = function(key, o){
	var i, m, c;
	if(key == 'targetEmp'){
		this.dataObj.targetEmp = o;
		this.dataObj.targetEmp.originalEmpType = {
			empTypeId    : this.dataObj.targetEmp.empTypeId,
			empTypeName  : this.dataObj.targetEmp.empTypeName,
			configBase   : this.dataObj.targetEmp.configBase,
			daiqManage   : this.dataObj.targetEmp.daiqManage,
			holidayStock : this.dataObj.targetEmp.holidayStock
		};
	}else if(key == 'deptHist'){
		// ※ この中の処理は this.dataObj.targetEmp が既にあることが前提
		this.dataObj.deptHist    = (o && o.empDeptHist || []);
		this.dataObj.deptOwnHist = (o && o.deptOwnHist || []);
		var l = this.dataObj.deptHist.sort(function(a, b){
			if(!a.endDate && b.endDate){
				return -1;
			}else if(a.endDate && !a.endDate){
				return 1;
			}
			return (a.endDate < b.endDate ? 1 : (a.endDate > b.endDate ? -1 : 0));
		});
		var te = {
			deptId     : this.dataObj.targetEmp.deptId,
			deptName   : this.dataObj.targetEmp.deptName,
			deptCode   : this.dataObj.targetEmp.deptCode,
			startDate  : null,
			endDate    : null,
			startMonth : null,
			endMonth   : null
		};
		if(l.length > 0){
			te.startDate  = teasp.util.date.addDays(l[0].endDate, 1);
		}
		this.dataObj.deptHist.unshift(te);
	}else if(key == 'common'){
		this.dataObj[key] = o;
		var dm = {};
		var dl = [];
		var lst = o.jobInitialDateHistory || [];
		for(i = 0 ; i < lst.length ; i++){
			var h = lst[i];
			dm[h.date] = h;
			dl.push(h.date);
		}
		dl = dl.sort(function(a, b){
			return (a.date < b.date ? -1 : (a.date > b.date ? 1 : 0));
		});
		var hists = [];
		var xd = null;
		for(i = 0 ; i < dl.length ; i++){
			var d = dl[i];
			hists.push({
				sd					: xd,
				ed					: teasp.util.date.addDays(d, -1),
				initialDateOfMonth	: dm[d].initialDateOfMonth,
				markOfMonth 		: dm[d].markOfMonth
			});
			xd = d;
		}
		hists.push({
			sd					: xd,
			ed					: null,
			initialDateOfMonth	: o.jobInitialDayOfMonth,
			markOfMonth 		: o.jobMarkOfMonth
		});
		this.dataObj.jobInitHistory = hists;
	}else if(key == 'empTypeInfo'){ // 勤務体系の履歴、勤務体系リストの情報。※'months' のセットより前に呼ばれること。
		// ※ この中の処理は this.dataObj.targetEmp があることが前提
		if(!this.getEmpId()){
			return;
		}
		var dm = {};
		var dl = [];
		var eths = o.empTypeHistory || [];
		for(i = 0 ; i < eths.length ; i++){
			var eth = eths[i];
			if(eth.empType){
				dm[eth.date] = eth.empType;
				dl.push(eth.date);
			}
		}
		dl = dl.sort(function(a, b){
			return (a.date < b.date ? -1 : (a.date > b.date ? 1 : 0));
		});
		dl.push(null);
		dm[null] = o.empTypeMap[this.dataObj.targetEmp.originalEmpType.empTypeId];
		var hists = [];
		var xd = null;
		var ph = null;
		for(i = 0 ; i < dl.length ; i++){
			var d = dl[i];
			var h = {
				sd		: xd,
				ed		: (d ? teasp.util.date.addDays(d, -1) : null),
				empType	: dm[d]
			};
			h.stamp = h.empType.configBase.initialDateOfMonth
				+ '-' + h.empType.configBase.markOfMonth
				+ '-' + h.empType.configBase.initialDateOfYear
				+ '-' + h.empType.configBase.markOfYear
				+ '-' + h.empType.configBase.initialDayOfWeek;
			if(ph && ph.stamp == h.stamp){
				h.id = ph.id;
			}else if(ph){
				h.id = h.sd;
			}else{
				h.id = null;
			}
			hists.push(h);
			ph = h;
			xd = d;
		}
		// 次の勤務体系と起算情報が同じ場合、起算日変更と認識しないようにするため、
		// 切替日が起算日と異なる時は、切替日を起算日と合うように調整する。
		var hists2 = [];
		for(i = 0 ; i < hists.length ; i++){
			var h = hists[i];
			var nh = (i < (hists.length - 1) ? hists[i + 1] : null); // 次の勤務体系
			var ng = false;
			if(nh && h.stamp == nh.stamp){
				var nd = teasp.util.date.addDays(h.ed, 1);
				var yo = teasp.util.searchYearMonthDate(h.empType.configBase.initialDateOfMonth, h.empType.configBase.markOfMonth, null, nd);
				if(yo.startDate != nd){
					if(!h.sd || h.sd < yo.startDate){
						h.ed = teasp.util.date.addDays(yo.startDate, -1);
						nh.sd = yo.startDate;
					}else{
						// ここに来る場合は、次の勤務体系で上書きする
						nh.sd = h.sd;
						ng = true;
					}
				}
			}
			// 調整の結果、期間がマイナスになる場合は勤務体系履歴に含めない。
			if((!h.sd || !h.ed || h.sd <= h.ed) && !ng){
				hists2.push(h);
			}
		}
		for(i = 0 ; i < hists2.length ; i++){
			var h = hists2[i];
			console.log(h.sd + ' - ' + h.ed + ' empType=' + h.empType.empTypeName);
		}
		this.dataObj.empTypeHistory = hists2;
		this.dataObj.empTypeMap = o.empTypeMap;

		this.dataObj.empTypeInfo = o;
		if(o){
			this.setEmpTypeByDate(o.ym, o.dt);
		}
	}else if(key == 'empMonthList'){
		// ※ この中の処理は this.dataObj.empTypeMap があることが前提
		this.dataObj.empMonthList = o || [];
		this.dataObj.empMonthMap = {};
		for(i = 0 ; i < this.dataObj.empMonthList.length ; i++){
			m = this.dataObj.empMonthList[i];
			m.empType = (this.dataObj.empTypeMap[m.empTypeId] || null);
			m.monthEx = m.startDate;
			this.dataObj.empMonthMap[m.monthEx] = m;
		}
	}else if(key == 'months'){
		// ※ この中の処理は this.dataObj.targetEmp, this.dataObj.empMonthList があることが前提
		var months = o.months;
		var deptMonths = (o.deptMonths || []);
		var dm = {};
		for(i = 0 ; i < deptMonths.length ; i++){
			dm[deptMonths[i].yearMonth] = deptMonths[i];
		}
		var emm = {};
		for(i = 0 ; i < months.length ; i++){
			emm[months[i].id] = months[i];
		}
		// ※対象月度のレコードがない場合は作る
		var em = {};
		months = [];
		var month = null;
		for(i = 0 ;i < this.dataObj.empMonthList.length ; i++){
			m = this.dataObj.empMonthList[i];
			var mo;
			if(m.empMonthId){
				mo = emm[m.empMonthId] || {};
				mo._em = m;
			}else{
				mo = {
					yearMonth : m.yearMonth,
					startDate : m.startDate,
					endDate   : m.endDate,
					id        : null,
					apply     : { id : null, status : null },
					inputFlag : this.dataObj.targetEmp.inputFlag,
					empty     : true,
					_em       : m
				};
				if(dm[mo.yearMonth]){
					mo.deptMonth = dm[mo.yearMonth];
				}
			}
			mo.subNo   = mo._em.subNo;
			mo.monthEx = mo._em.monthEx;
			if(mo.startDate <= this.dataObj.params.startDate
			&& this.dataObj.params.startDate <= mo.endDate){
				month = mo;
				// 起算情報変更月の場合は、リセットフラグをオンにする
				if(months.length && months[months.length - 1]._em.initialDate != month._em.initialDate){
					month.resetFlag = true;
				}
			}
			months.push(mo);
			em[mo.monthEx] = mo;
		}
		this.dataObj.months = months;
		this.dataObj.empMonthMap = em;
		this.dataObj.month = month;
		if(this.dataObj.targetEmp){
			var cet = null;
			if(month
			&& month.empTypeId
			&& this.isEmpMonthFixed(month, true)){ // 月次確定されている場合、勤怠月次の勤務体系を参照
				cet = month;
			}else{
				cet = (this.dataObj.targetEmp.currentEmpType || this.dataObj.targetEmp.originalEmpType);
			}
			if(cet && this.dataObj.targetEmp.empTypeId != cet.empTypeId){
				this.dataObj.targetEmp.empTypeId    = cet.empTypeId;
				this.dataObj.targetEmp.empTypeName  = cet.empTypeName;
				this.dataObj.targetEmp.configBase   = cet.configBase;
				this.dataObj.targetEmp.daiqManage   = cet.daiqManage;
				this.dataObj.targetEmp.holidayStock = cet.holidayStock;
			}
			var dept = this.getDeptByMonth(month);
			if(dept){
				if(dept.histDept){
					dept = dept.histDept;
				}
				this.dataObj.targetEmp.deptId       = dept.deptId;
				this.dataObj.targetEmp.deptName     = dept.deptName;
				this.dataObj.targetEmp.deptCode     = dept.deptCode;
			}else{
				var od = this.getDeptAtTheTime(this.dataObj.targetEmp, month.endDate);
				if(od.deptId != this.dataObj.targetEmp.deptId){
					this.dataObj.targetEmp.deptId       = od.deptId;
					this.dataObj.targetEmp.deptName     = od.deptName;
					this.dataObj.targetEmp.deptCode     = od.deptCode;
				}
			}
		}
	}else if(key == 'configs'){
		// ※ この中の処理は this.dataObj.months があることが前提
		if(this.dataObj.months){
			var configs = o;
			// 月度オブジェクトに設定オブジェクトを紐づける
			for(i = 0 ; i < configs.length ; i++){
				c = configs[i];
				if(c.restTimeCheck && c.restTimeCheck.length > 1){
					c.restTimeCheck = c.restTimeCheck.sort(function(a, b){
						return a.workTime - b.workTime;
					});
				}
				for(var ymk in this.dataObj.empMonthMap){
					if(this.dataObj.empMonthMap.hasOwnProperty(ymk)){
						m = this.dataObj.empMonthMap[ymk];
						if(this.isEmpMonthFixed(m, true) && m.configId){
							// 確定していればその月に保存された ConfigId が指す Config を得る
							if(teasp.util.equalId(m.configId, c.id)){
								m.config = c;
							}
						}else{
							// 未確定なら、勤務体系履歴に整合する Config を得る。
							// 勤務体系履歴がなければ現在社員に設定されている勤務体系に紐づく Config を得る
							if(!c.originalId
							&& !c.removed
							&& c.configBaseId == m._em.configBaseId
							&& (!c.validStartDate || c.validStartDate <= m.endDate  )
							&& (!c.validEndDate   || c.validEndDate   >= m.startDate)){
								m.config = c;
							}
						}
					}
				}
			}
			// 月次オブジェクトに所定休日、祝日をマッピングしたリストを紐づける
			for(var ymk in this.dataObj.empMonthMap){
				if (this.dataObj.empMonthMap.hasOwnProperty(ymk)) {
					m = this.dataObj.empMonthMap[ymk];
					m.fixHolidays = getHolidaysEx(
									teasp.util.date.parseDate(m.startDate),
									teasp.util.date.parseDate(m.endDate),
									m.config.holidays,
									m.config.nonPublicHoliday);
				}
			}
			this.dataObj.configs = configs;
			// 対象月度が特定されていれば、メインの設定オブジェクトを特定
			if(this.dataObj.month){
				this.dataObj.config = this.dataObj.month.config;
			}
		}else if(o.length == 1){
			this.dataObj.config = o[0];
		}
		if(this.dataObj.config.workSystem == teasp.constant.WORK_SYSTEM_MANAGER){ // 管理監督者
			this.countNight = true; // 深夜労働カウントする
		}
	}else if(key == 'sumTime'){
		// ※ この中の処理は this.dataObj.configs, this.dataObj.month があることが前提
		this.dataObj.month.totalWorkOverTime36  = o.totalWorkOverTime36;
		this.dataObj.month.totalWorkOverCount36 = o.totalWorkOverCount36;
		var config = this.dataObj.month.config;
		// 前月までの四半期の超過時間をセット
		this.dataObj.month.quartWorkOverTime36 = o.quartWorkOverTime36;
		// 変形労働時間制かつ変形期間＞１ヶ月かつ対象月度が起算月ではない場合に、前月度までの法定内労働時間を得る
		if(config && config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE){
			if(config.variablePeriod > 1){
				this.dataObj.month.preWorkLegalTimeOfPeriod = o.periodWorkTime || 0;
				this.dataObj.month.legalTimeOfPeriod = (Math.floor((o.periodDayCount / 7) * 40 * 60));
			}
		}
		this.dataObj.carryforwardMap     = (o.carryforwardMap     || {}); // 繰越時間マップ
		this.dataObj.realWorkTimeWoLHMap = (o.realWorkTimeWoLHMap || {}); // 実労働－法休マップ
		this.dataObj.amountTimeMap       = (o.amountTimeMap       || {}); // 過不足時間マップ
		this.dataObj.settlementTimeMap   = (o.settlementTimeMap   || {}); // 当月清算時間マップ
	}else if(key == 'jobApply'){
		var jobApply = o;
		if(!jobApply){
			jobApply = {
				yearMonth : this.dataObj.params.month,
				startDate : this.dataObj.params.startDate,
				endDate   : this.dataObj.params.endDate,
				subNo     : this.dataObj.params.subNo,
				id        : null,
				status    : null
			};
		}
		this.dataObj.jobApply = jobApply;
	}else if(key == 'jobAssigns'){
		var jobAssigns = o.sort(function(a, b){
			return (a.order - b.order);
		});
		this.dataObj.jobAssigns = jobAssigns;
	}else if(key == 'works'){
		var works = o.sort(function(a, b){
			var n = teasp.util.date.compareDate(a.date, b.date);
			if(!n){
				return (a.order - b.order);
			}
			return n;
		});
		for(i = 0 ; i < works.length ; i++){
			works[i].no = (i + 1);
		}
		this.dataObj.works = works;
	}else if(key == 'expApply'){
		this.dataObj.expApply = (o.length > 0 ? o[0] : null);
	}else if(key == 'expLogs'){
		var expLogs = o.sort(function(a, b){
			var n = teasp.util.date.compareDate(a.date, b.date);
			if(!n){
				return (a.order - b.order);
			}
			return n;
		});
		var jobLink = {};
		var jobNames = {};
		var tagKeys = [];
		var n = 0;
		var d = null;
		for(i = 0 ; i < expLogs.length ; i++){
			var expLog = expLogs[i];
			var tagKey = expLog.date + ':' + (expLog.expApplyId || '') + ':' + (expLog.jobId || '');
			if(expLog.date != d){
				d = expLog.date;
				n = 1;
			}
			expLog.no = (n++);
			var l = jobLink[tagKey];
			if(!l){
				l = jobLink[tagKey] = [];
			}
			l.push(expLog);
			if(!tagKeys.contains(tagKey)){
				tagKeys.push(tagKey);
			}
			if(!jobNames.hasOwnProperty(tagKey)){
				jobNames[tagKey] = (expLog.job ? expLog.job.name : '');
			}
		}
		expLogs = [];
		for(i = 0 ; i < tagKeys.length ; i++){
			var tagKey = tagKeys[i];
			expLogs = expLogs.concat(jobLink[tagKey]);
		}
		this.dataObj.expLogs = expLogs;
	}else if(key == 'expHistory'){
		if(o){
			o = dojo.fromJson(o);
			this.dataObj.stationHist = (o.stationHist || []);
			this.dataObj.routeHist   = (o.routeHist   || []);
			if(this.dataObj.stationHist.length > 0){
				this.dataObj.stationHist = this.dataObj.stationHist.reverse();
			}
		}
	}else if(key == 'txsLogs'){
		var lst = [];
		if(o){
			for(i = 0 ; i < o.length ; i++){
				var log = o[i];
				if(!log.target){ // 対象オブジェクトがないものは無視
					continue;
				}
				log.date = this.dataObj.params.date;
				var dt = teasp.util.date.getTzDateTime(log.targetTime);
				log.st = dt.getHours() * 60 + dt.getMinutes();
				log.moved = false;
				var d = teasp.util.date.formatDate(dt);
				if(this.dataObj.params.date != d){ // 違う日付の場合
					var diff = teasp.util.date.daysInRange(this.dataObj.params.date, d);
					if(diff > 1){
						log.st += (1440 * (diff - 1));
					}
				}
				if(log.endTime){
					dt = teasp.util.date.getTzDateTime(log.endTime);
					log.et = dt.getHours() * 60 + dt.getMinutes();
					d = teasp.util.date.formatDate(dt);
					if(this.dataObj.params.date != d){ // 違う日付の場合
						var diff = teasp.util.date.daysInRange(this.dataObj.params.date, d);
						if(diff > 1){
							log.et += (1440 * (diff - 1));
						}
					}
				}
				if(log.target.type == 'Task' // ToDo
				|| log.target.type == 'Event' // 行動
				|| log.target.type == 'Account' // 取引先
				|| log.target.type == 'Opportunity' // 商談
				|| log.target.type == 'AtkJob__c' // ジョブ
				){
					lst.push(log);
				}
			}
			lst.sort(function(a, b){
				return a.targetTime.getTime() - b.targetTime.getTime();
			});
		}
		this.dataObj.txsLogs = lst;

	}else if(key == 'depts'){
		teasp.util.levelingDepts(o);
		this.dataObj.depts = o;

	}else if(key == 'workLocations'){
		this.setWorkLocations(o || []);

	}else{
		this.dataObj[key] = o;
	}
};

/**
 * 【共通】セッションユーザ、対象ユーザ情報を格納する
 * @param {Object} sessionInfo セッションユーザ
 * @param {Object} targetEmp 対象ユーザ
 */
teasp.data.Pouch.prototype.setEmpInfo = function(sessionInfo, targetEmp){
	this.dataObj.sessionInfo = sessionInfo;
	this.dataObj.targetEmp   = targetEmp;
};

/**
 * 【共通】指定日の勤務体系にセットする.<br/>
 * ※この関数が呼ばれた後、teasp.data.Pouch.prototype.setKeyObj('months', xx) が呼ばれること。
 *
 * @param {number} ym
 * @param {string} dt
 */
teasp.data.Pouch.prototype.setEmpTypeByDate = function(ym, dt){
	this.dataObj.targetEmp.currentEmpType = this.getEmpTypeByDate(ym, dt);
};

teasp.data.Pouch.prototype.getEmpTypeByDate = function(ym, dt){
	var d = dt;
	if(!dt){
		d = '' + ym;
		d = d.substring(0, 4) + '-' + d.substring(4, 6) + '-01';
	}
	var empMonthList = this.getEmpMonthList(d, 2, -2);
	var month = null;
	for(var i = 0 ; i < empMonthList.length ; i++){
		var m = empMonthList[i];
		if((!dt && m.yearMonth == ym)
		|| (dt && m.startDate <= dt && dt <= m.endDate)){
			month = m;
			break;
		}
	}
	return month.empType;
};

/**
 * 【共通】日次情報のうち、タイムレポートの日付変更で入れ替わる要素を削除
 *
 */
teasp.data.Pouch.prototype.resetDailyData = function(){
	delete this.dataObj.classifyJobWorks;
	delete this.dataObj.works;
	delete this.dataObj.expLogs;
	delete this.dataObj.events;
};

/**
 * 【共通】書式変換した、またはそのままの時間を返す
 *
 * @param {number} t 時間（分）
 * @param {boolean=} flag 表示形式 true:分のまま  false:設定に従い h:mm か #.00
 * @param {(string|number|null)=} defaultVal t の値が null の場合の代替値
 * @param {(string|number|null)=} zeroVal t の値が 0 の場合の代替値（''など）
 * @param {boolean=} prevFlag trueの場合、マイナスの時刻は「前日 XXXX」と表示する
 * @return {string|number} 書式変換した、またはそのままの時間
 */
teasp.data.Pouch.prototype.getDisplayTime = function(t, flag, defaultVal, zeroVal, prevFlag){
	if(typeof(t) != 'number'){
		return (defaultVal || '');
	}
	if(flag){
		return t;
	}
	var frm = (this.dataObj.config.timeFormat || 'hh:mm');
	if(t === 0){
		return ((zeroVal || zeroVal == '') ? zeroVal : (frm == 'hh:mm' ? '0:00' : '0.00'));
	}
	var minus = (t < 0);
	if(minus && prevFlag){
		t = (24 * 60 + t); // マイナスでprevFlag=オンの場合、24h から引いた値に直す
	}
	if(minus){
		t = Math.abs(t);
	}
	var h = Math.floor(t / 60);
	var m = (Math.round(t) % 60);
	var v;
	if(frm != 'hh:mm'){
		m = Math.round(m * 100 / 60);
		v = h + '.' + (m < 10 ? '0' : '') + m;
	}else{
		v = h + ':' + (m < 10 ? '0' : '') + m;
	}
	if(minus && prevFlag){
		return teasp.message.getLabel('ac00000600', v); // 前日 {0}
	}
	return (minus ? '-' : '') + v;
};

/**
 * 【共通】ステータスに応じたスタイルシートのセレクタを返す
 * @param {string} status ステータス値
 * @param {boolean} close 却下ステータスの場合、取消をしていたら true
 * @return {string} スタイルシートのセレクタ
 */
teasp.data.Pouch.prototype.getStatusIconClass = function(status, close){
	if(status == teasp.constant.STATUS_WAIT || status == teasp.constant.STATUS_APPROVING){
//        return 'pb_status_wait';
		return 'sts008';
	}else if(status == teasp.constant.STATUS_APPROVE){
//        return 'pb_status_aprv';
		return 'sts005';
	}else if(status == teasp.constant.STATUS_ADMIT){
//        return 'pb_status_fix';
		return 'sts005';
	}else if(teasp.constant.STATUS_REJECTS.contains(status)){
//        return (close ? 'pb_status_nofix' : 'pb_status_rejct');
		return 'sts006';
	}else{ // 未確定,未承認,申請取消,確定取消
//        return 'pb_status_nofix';
		return 'sts004';
	}
};

/**
 * 【共通】参照モードか
 * @param {number=} target  teasp.constant.TARGET_EXP なら経費関係
 * @return {boolean} true:参照モード
 */
teasp.data.Pouch.prototype.isReadOnly = function(target){
	var mask = teasp.constant.P_E;
	if(target == teasp.constant.TARGET_EXP){ // 経費関係
		mask |= teasp.constant.P_AX; // 経費管理機能の使用権限がある
	}
	return (this.dataObj.targetEmp.mode != 'edit' || (this.getRights(mask) == 0) ? true : false);
};

/**
 * 【共通】モードを返す。
 * @return {string} 'edit'または'read'
 */
teasp.data.Pouch.prototype.getMode = function(){
	return this.dataObj.targetEmp.mode;
};

/**
 * 【共通】ログインユーザ名を返す。
 * @return {string} ログインユーザ名
 */
teasp.data.Pouch.prototype.getSessionUserName = function(){
	return this.dataObj.sessionInfo.user.name;
};

/**
 * 【共通】共通設定オブジェクトを返す。
 * @return {Object} 共通設定オブジェクト
 */
teasp.data.Pouch.prototype.getCommonObj = function(){
	return this.dataObj.common;
};

/**
 * 【共通】HELPボタンのとび先のURLを返す。
 * @return {string} URL
 */
teasp.data.Pouch.prototype.getHelpLink = function(){
	return this.dataObj.common.helpLink;
};

/**
 * 【共通】INFOボタンのとび先のURLを返す。
 * @return {string} URL
 */
teasp.data.Pouch.prototype.getInfoLink = function(){
	return this.dataObj.common.infoLink;
};

/**
 * 【共通】退社打刻時の日次確定のデフォルトをオンにするか
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isCheckDefaultDailyFix = function(){
	return this.dataObj.common.checkDefaultDailyFix;
};

/**
 * 【共通】自分がジョブリーダーのジョブのみ表示するか
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isJobLeaderFilter = function(){
	return this.dataObj.common.jobLeaderFilter;
};

/**
 * 【共通】ログインユーザはシステム管理者か
 * @return {boolean} システム管理者である
 */
teasp.data.Pouch.prototype.isSysAdmin = function(){
	return this.dataObj.sessionInfo.user.sysAdmin;
};

/**
 * 【共通】ログインユーザは管理者か
 * @param {boolean=} flag
 * @return {boolean} 管理者である
 */
teasp.data.Pouch.prototype.isAdmin = function(flag){
	if(flag && this.isSysAdmin()){
		return true;
	}
	return this.dataObj.sessionInfo.emp.isAdmin;
};

/**
 * 【共通】ログインユーザは経費管理者か
 * @return {boolean} 経費管理者である
 */
teasp.data.Pouch.prototype.isExpAdmin = function(){
	return this.dataObj.sessionInfo.emp.isExpAdmin;
};

/**
 * 【共通】ログインユーザは全社員のデータ編集を許可されているか
 * @return {boolean} 全社員のデータ編集を許可されている
 */
teasp.data.Pouch.prototype.isAllEditor = function(){
	return this.dataObj.sessionInfo.emp.isAllEditor;
};

/**
 * 【共通】ログインユーザは全社員のデータ参照を許可されているか
 * @return {boolean} 全社員のデータ参照を許可されている
 */
teasp.data.Pouch.prototype.isAllReader = function(){
	return this.dataObj.sessionInfo.emp.isAllReader;
};

/**
 * 【共通】権限を返す。
 * @param {number} mask
 * @return {number}
 */
teasp.data.Pouch.prototype.getRights = function(mask){
	return (this.dataObj.sessionInfo.user.rights & (mask || 0));
};

/**
 * 【共通】自分がジョブリーダーのジョブのみ表示のみの権限か
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isOnlyJL = function(){
	var r = this.dataObj.sessionInfo.user.rights;
	return ((r & teasp.constant.P_JL) != 0 && (r & ~teasp.constant.P_JL) == 0);
};

/**
 * 【共通】対象社員オブジェクトを返す
 * @return {Object} 対象社員オブジェクト
 */
teasp.data.Pouch.prototype.getTargetEmpObj = function(){
	return this.dataObj.targetEmp;
};

/**
 * 【共通】対象社員のIDを返す
 * @return {string} 対象社員のID
 */
teasp.data.Pouch.prototype.getEmpId = function(){
	return (this.dataObj.targetEmp ? this.dataObj.targetEmp.id : null);
};

/**
 * 【共通】ユーザの写真のURLを返す
 * @return {string}
 */
teasp.data.Pouch.prototype.getSmallPhotoUrl = function(){
	return ((this.dataObj.targetEmp && this.dataObj.targetEmp.smallPhotoUrl) || null);
};

/**
 * 【共通】対象社員の勤務体系IDを返す
 * @return {string} 対象社員の勤務体系ID
 */
teasp.data.Pouch.prototype.getEmpTypeId = function(){
	return this.dataObj.targetEmp.empTypeId;
};

/**
 * 【共通】対象社員の勤務体系名を返す
 * @return {string} 対象社員の勤務体系名
 */
teasp.data.Pouch.prototype.getEmpTypeName = function(){
	return this.dataObj.targetEmp.empTypeName;
};

/**
 * 【共通】対象社員の役職を返す
 * @return {string} 対象社員の役職
 */
teasp.data.Pouch.prototype.getTitle = function(){
	return (this.dataObj.targetEmp.title || '');
};

/**
 * 【共通】対象社員の名前を返す
 * @return {string} 対象社員の名前
 */
teasp.data.Pouch.prototype.getName = function(){
	return this.dataObj.targetEmp.name;
};

/**
 * 【共通】対象社員の社員コードを返す
 * @return {string} 対象社員の社員コード
 */
teasp.data.Pouch.prototype.getEmpCode = function(){
	return this.dataObj.targetEmp.code;
};

/**
 * 【共通】対象社員の所属部署IDを返す
 * @return {string} 対象社員の所属部署ID
 */
teasp.data.Pouch.prototype.getDeptId = function(){
	return this.dataObj.targetEmp.deptId;
};

/**
 * 【共通】対象社員の所属部署コードを返す
 * @return {string} 対象社員の所属部署コード
 */
teasp.data.Pouch.prototype.getDeptCode = function(){
	return this.dataObj.targetEmp.deptCode;
};

/**
 * 【共通】対象社員の所属部署名を返す
 * @return {string} 対象社員の所属部署名
 */
teasp.data.Pouch.prototype.getDeptName = function(){
	return this.dataObj.targetEmp.deptName;
};

/**
 * 【共通】対象社員の入社日を返す
 * @return {?string} 入社日('yyyy-MM-dd')
 */
teasp.data.Pouch.prototype.getEntryDate = function(){
	return this.dataObj.targetEmp.entryDate;
};

/**
 * 【共通】対象社員の退社日を返す
 * @return {?string} 退社日('yyyy-MM-dd')
 */
teasp.data.Pouch.prototype.getEndDate = function(){
	return this.dataObj.targetEmp.endDate;
};

/**
 * 【共通】対象社員の次回有休付与日を返す
 * @return {?string} 次回有休付与日('yyyy-MM-dd')
 */
teasp.data.Pouch.prototype.getNextYuqProvideDate = function(){
	return this.dataObj.targetEmp.nextYuqProvideDate;
};

/**
 * 【共通】対象社員のSalesforceユーザ名を返す
 * @return {?String} Salesforceユーザ名
 */
teasp.data.Pouch.prototype.getUserName = function(){
	return this.dataObj.targetEmp.userName;
};

/**
 * 【共通】対象社員の上長名を返す
 * @return {?String} 上長名
 */
teasp.data.Pouch.prototype.getManagerName = function(){
	return this.dataObj.targetEmp.managerName;
};

/**
 * 【共通】ログインユーザ＝対象社員か
 * @return {boolean} true:ログインユーザ＝対象社員である
 */
teasp.data.Pouch.prototype.isOwner = function(){
	return teasp.util.equalId(this.dataObj.targetEmp.userId, this.dataObj.sessionInfo.user.id);
};

/**
 * 【共通】対象者フラグを返す
 * @return {number}
 */
teasp.data.Pouch.prototype.getInputFlag = function(){
//    return this.dataObj.targetEmp.inputFlag;
	return this.dataObj.month.inputFlag;
};

/**
 * 【共通】セッションユーザIDを返す
 * @return {string}
 */
teasp.data.Pouch.prototype.getSessionUserId = function(){
	return this.dataObj.sessionInfo.user.id;
};

/**
 * 【共通】勤務時間外の休憩・公用外出を記録する
 *
 * @return {boolean} 勤務時間外の休憩・公用外出を記録する
 */
teasp.data.Pouch.prototype.isKeepExteriorTime = function(){
	return this.dataObj.common.keepExteriorTime;
};

/**
 * 【共通】リビジョンアップによるデータ変換が必要かどうかを返す
 * @return {boolean} データ変換が必要である
 */
teasp.data.Pouch.prototype.isOldRevision = function(){
	if(this.dataObj.common.borderRevNo === undefined){
		return false;
	}
	if(!this.dataObj.common.borderRevNo){
		return false;
	}
	return (this.dataObj.common.revision < this.dataObj.common.borderRevNo ? true : false);
};

/**
 * 【共通】デバッグオプションを返す
 *
 * @return {Object} デバッグレベル
 */
teasp.data.Pouch.prototype.getDebugOption = function(){
	return {
		debugLev : /* teasp.constant.LEVEL_TRACE */teasp.constant.LEVEL_OFF
	};
};

/**
 * 【共通】デバッグモードか
 * @return {boolean} デバッグモードである
 */
teasp.data.Pouch.prototype.isDebug = function(){
	return ((this.dataObj.common.localKey && this.dataObj.common.localKey.length > 7 && this.dataObj.common.localKey.substring( 7, 8) == '1') ? true : false);
};

/**
 * 【共通】申請制限（１年前～１年後の期間でしか申請できない制限）ありか
 * @return {boolean} 申請制限（１年前～１年後の期間でしか申請できない制限）あり
 */
teasp.data.Pouch.prototype.isApplyLimitOff = function(){
	return ((this.dataObj.common.localKey && this.dataObj.common.localKey.length > 8 && this.dataObj.common.localKey.substring( 8, 9) == '1') ? true : false);
};

/**
 * 【共通】テスト・デモデータ作成ツール利用可か
 * @return {boolean} テスト・デモデータ作成ツール利用可
 */
teasp.data.Pouch.prototype.isBulkTestOn = function(){
	return ((this.dataObj.common.localKey && this.dataObj.common.localKey.length > 9 && this.dataObj.common.localKey.substring( 9,10) == '1') ? true : false);
};

/**
 * 【共通】出退社時刻一括入力を利用可か
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isBulkInputOn = function(){
	return ((this.dataObj.common.localKey && this.dataObj.common.localKey.length > 11 && this.dataObj.common.localKey.substring(11,12) == '1') ? true : false);
};

/**
 * 【共通】DISCOモード（仕訳データ出力、仕訳レポート出力を利用する）
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isDiscoFlag = function(){
	return ((this.dataObj.common.localKey && this.dataObj.common.localKey.length > 12 && this.dataObj.common.localKey.substring(12,13) == '1') ? true : false);
};

/**
 * 【共通】有休残日数計算で、休暇申請が月をまたいだ時、来月分を含めて消化させるか
 *
 * @return {boolean} true:来月分は含めない（新仕様） false:来月分を含める（旧仕様）
 */
teasp.data.Pouch.prototype.isYuqZanFlag = function(){
	return ((this.dataObj.common.localKey && this.dataObj.common.localKey.length > 13 && this.dataObj.common.localKey.substring(13,14) == '1') ? true : false);
};

/**
 * 【共通】合計金額がマイナスの経費申請を許可する
 *
 * @return {boolean} true:許可する false:許可しない
 */
teasp.data.Pouch.prototype.isAllowMinusExpApply = function(){
	return ((this.dataObj.common.localKey && this.dataObj.common.localKey.length > 14 && this.dataObj.common.localKey.substring(14,15) == '1') ? true : false);
};

/**
 * 【共通】申請取消時に必ず時間もクリアする
 *
 * @return {number}
 */
teasp.data.Pouch.prototype.getClearLevel = function(){
	if(this.dataObj.common.localKey && this.dataObj.common.localKey.length > 15){
		var n = this.dataObj.common.localKey.substring(15,16);
		if(/[0-9]/.test(n)){
			return parseInt(n, 10);
		}
	}
	return 0;
};

/**
 * 【共通】勤務時間が入力されていても実労働時間が0時間の場合、実勤務日数にカウントするか
 *
 * @return {boolean} true:許可する false:許可しない
 */
teasp.data.Pouch.prototype.isCountZeroWorkTime = function(){
	return ((this.dataObj.common.localKey && this.dataObj.common.localKey.length > 16 && this.dataObj.common.localKey.substring(16,17) == '1') ? true : false);
};

/**
 * 【共通】勤怠計算値自動ベリファイをする
 *
 * @return {boolean} true:する false:しない
 */
teasp.data.Pouch.prototype.isAutoVerify = function(){
	if(this.autoVerify === undefined){
		this.autoVerify = ((this.dataObj.common.localKey && this.dataObj.common.localKey.length > 17 && this.dataObj.common.localKey.substring(17,18) == '1') ? true : false);
	}
	return this.autoVerify;
};

/**
 * 残業申請・早朝勤務申請の開始・終了時刻のデフォルト値をフレックス時間帯の境界とする（フレックスタイム制で「申請の時間帯以外の勤務は認めない」オンの場合のみ）
 * @param {number} flag =1:残業申請、=2:早朝勤務申請
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isDefaultIsBorderTime = function(flag){
	var c = this.getObj().config.config;
	if(c && c.empApply){
		if(flag == 1 && typeof(c.empApply.overTimeInitOverFlexZone) == 'boolean'){
			return c.empApply.overTimeInitOverFlexZone;
		}
		if(flag == 2 && typeof(c.empApply.earlyWorkInitOverFlexZone) == 'boolean'){
			return c.empApply.earlyWorkInitOverFlexZone;
		}
	}
	return ((this.dataObj.common.localKey && this.dataObj.common.localKey.length > 19 && this.dataObj.common.localKey.substring(19,20) == '1') ? true : false);
};

/**
 * 勤怠日次レコードの備考が空の場合は「備考入力済み」と判定しない（控除のある日は備考必須にする＝オン、申請の備考と日次の備考を保存時に結合しない＝オンの場合のみ有効）
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isRemarksRigorous = function(){
	return ((this.dataObj.common.localKey && this.dataObj.common.localKey.length > 21 && this.dataObj.common.localKey.substring(21,22) == '1') ? true : false);
};

/**
 * 【共通】勤怠計算値自動ベリファイのオン／オフをセット
 *
 * @param {boolean} flag
 */
teasp.data.Pouch.prototype.setAutoVerify = function(flag){
	this.autoVerify = flag;
};

/**
 * 【共通】承認者が自分かどうか。<br/>
 * ※ ステータスが承認待ちでなければ常に false を返す。
 *
 * @param {Object} apply 申請オブジェクト（id と status の要素があること）
 * @return {boolean} 承認者である場合、true
 */
teasp.data.Pouch.prototype.isApprover = function(apply){
	if(apply.status != teasp.constant.STATUS_WAIT){
		return false;
	}
	return (this.dataObj.approver
		&& this.dataObj.approver[apply.id]);
};

/**
 * 【共通】申請時の備考入力を必須にする
 *
 * @param {Object} key 申請キー
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isRequireNote = function(key){
	if(!this.dataObj.common.requireNote){
		return false;
	}
	var rn = this.dataObj.common.requireNoteOption;
	if(!rn || rn.length <= 0){
		return true;
	}else if(rn.contains('all') || rn.contains(key)){
		return true;
	}
	return false;
};

/**
 * 【共通】非ダイアログ表示モードか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isNonDialogMode = function(){
	try{
		if(this.dataObj.nonDialogMode === undefined){
			if(!this.dataObj.common.nonDialogKey || /iPad/.test(navigator.userAgent)){
				this.dataObj.nonDialogMode = false;
			}else{
				var regex = new RegExp(this.dataObj.common.nonDialogKey, 'i');
				this.dataObj.nonDialogMode = regex.test(navigator.userAgent);
			}
		}
	}catch(e){}
	return (this.dataObj.nonDialogMode || false);
};

/**
 * 【共通】お知らせを自動表示しないか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isNotInfoAutoView = function(){
	return (this.dataObj.common.notInfoAutoView || false);
};

/**
 * 【共通】月次サマリーの日次の労働時間に実時間を表示か
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isMsDailyWorkTimeIsReal = function(){
	return (this.dataObj.common.msDailyWorkTimeIsReal || false);
};

/**
 * 【共通】タイムレポートを使用不可にするか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isDisabledTimeReport = function(){
	return (this.dataObj.common.disabledTimeReport || false);
};

/**
 * 【共通】経費精算を使用不可にするか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isDisabledEmpExp = function(){
	return (this.dataObj.common.disabledEmpExp || false);
};

/**
 * 【共通】工数実績を使用不可にするか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isDisabledEmpJob = function(){
	return (this.dataObj.common.disabledEmpJob || false);
};

/**
 * 【共通】作業報告、タスク別作業報告を改行して表示するか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isNoteNewLine = function(){
	return (this.dataObj.common.workNoteCrlfOn || false);
};

/**
 * 【共通】作業報告、タスク別作業報告を改行する設定なら改行して返す
 *
 * @param {string} str
 * @return {string}
 */
teasp.data.Pouch.prototype.convNoteString = function(str){
	if(this.isNoteNewLine()){
		return (str || '').replace(/\n/g, '<br/>');
	}
	return (str || '');
};

/**
 * 【共通】取消または却下された申請の扱い
 *
 * @return {number}
 */
teasp.data.Pouch.prototype.getHandleInvalidApply = function(){
	return (this.dataObj.common.handleInvalidApply || 0);
};

/**
 * 【共通】事前申請と事後申請を区別するか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isClarifyAfterApply = function(){
	return (this.dataObj.common.clarifyAfterApply || false);
};

/**
 * 【共通】月次サマリーボタンを非表示にするか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isHideMonthlySummary = function(){
	return (this.dataObj.common.hideMonthlySummary || false);
};

/**
 * 【共通】勤務表下部の集計欄を非表示にするか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isHideBottomSummary = function(){
	return (this.dataObj.common.hideBottomSummary || false);
};

/**
 * 【共通】勤怠グラフのポップアップを非表示にするか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isHideTimeGraphPopup = function(){
	return (this.dataObj.common.hideTimeGraphPopup || false);
};

/**
 * 【共通】退社打刻は出社時刻から24時間後までとするか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isPermitLeavingPush24hours = function(){
	return (this.dataObj.common.permitLeavingPush24hours || false);
};

/**
 * 【共通】退社時刻未入力でも日付が変われば出社打刻可か
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isPermitStartBtnDateChange = function(){
	return (this.dataObj.common.permitStartBtnDateChange || false);
};

/**
 * 【共通】日次の備考を保存時に結合しないか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isSeparateDailyNote = function(){
	return (this.dataObj.common.separateDailyNote || false);
};

/**
 * 【共通】申請期間が月度をまたぐ申請を禁止するか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isProhibitAcrossMonthApply = function(){
	return (this.dataObj.common.prohibitAcrossMonthApply || false);
};

/**
 * 【共通】承認者設定の承認者名をカンマ区切りテキストで返す
 *
 * @param {Object} obj 承認者設定情報を持つオブジェクト
 * @return {string}
 */
teasp.data.Pouch.prototype.getApproverName = function(obj){
	var l = (obj.approvers || []);
	var names = [];
	var fn = null;
	for(var i = 0 ; i < l.length ; i++){
		var o = l[i];
		if(!o){
			continue;
		}
		if(!fn || fn != o.id){
			names.push(o.name);
			if(!fn){
				fn = o.id;
			}
		}
	}
	return names.join(', ');
};

/**
 * 承認履歴を取得済みか
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isLoadedApproverSet = function(){
	return (this.dataObj.approverSet ? true : false);
};

teasp.data.Pouch.prototype.getApproverSetName = function(key){
	if(!this.dataObj.approverSet){
		return '';
	}
	return this.getApproverName(this.dataObj.approverSet[key]);
};

teasp.data.Pouch.prototype.getApproverSetId = function(key){
	if(!this.dataObj.approverSet || !this.dataObj.approverSet[key]){
		return '';
	}
	return this.dataObj.approverSet[key].id;
};

/**
 * 【共通】承認者設定を使用するか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isUseApproverSet = function(applyKey){
	if(applyKey == teasp.constant.APPLY_KEY_JOBAPPLY){
		return (this.isUseJobWorkFlow() && (this.dataObj.common.useJobApproverSet || false));
	}else if(applyKey == teasp.constant.APPLY_KEY_EXPAPPLY){
		return (this.isUseExpWorkFlow() && (this.dataObj.common.useExpApproverSet || false));
	}else{
		return (this.isUseWorkFlow() && (this.getObj().config.useApplyApproverTemplate || false));
	}
};

/**
 * 【共通】月度から部署を得る
 *
 * @param {Object|number} month
 * @return {boolean}
 */
teasp.data.Pouch.prototype.getDeptByMonth = function(month){
	if(month.deptMonth
	&& (teasp.constant.STATUS_FIX.contains(month.deptMonth.status)
	|| (month.apply && teasp.constant.STATUS_FIX.contains(month.apply.status)))){
		return month.deptMonth;
	}
	var l = (this.dataObj.deptHist || []);
	for(var i = 0 ; i < l.length ; i++){
		var h = l[i];
		if(!h.startDate || (h.startDate <= month.endDate)){
			return this.getDeptAtTheTime(h, month.endDate);
		}
	}
	return (l.length > 0 ? l[0] : null);
};

teasp.data.Pouch.prototype.getDeptIdByMonth = function(month){
	var dept = this.getDeptByMonth(month);
	return (dept && dept.deptId) || null;
};

teasp.data.Pouch.prototype.getDeptAtTheTime = function(dept, bd){
	var doh = (this.dataObj.deptOwnHist || []);
	for(var i = 0 ; i < doh.length ; i++){
		var o = doh[i];
		if(dept.deptCode != o.deptCode){
			continue;
		}
		if((!o.startDate || o.startDate <= bd)
		&& (!o.endDate   || o.endDate >= bd)){
			return o;
		}
	}
	return dept;
};

/**
 * 【共通】経費に稟議を関連付けるか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isExpLinkDocument = function(){
	return (this.dataObj.common.expLinkDocument || false);
};

/**
 * 【共通】経費とジョブの紐づけを必須とするか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isRequireExpLinkJob = function(){
	return (this.dataObj.common.requireExpLinkJob || false);
};

/**
 * 承認レイアウトに表示するメッセージを併記にするか
 *
 * @return {boolean}
 */
teasp.data.Pouch.prototype.isParallelMessage = function(){
	return (this.dataObj.common.namingRule == '1');
};

teasp.data.Pouch.prototype.mergeCalendar = function(sdt, edt){
	var obj = this.dataObj;
	var empTime = new teasp.logic.EmpTime(this);
	var amap = empTime.getApplyDateMap(obj.applys);
	var dlst = teasp.util.date.getDateList(sdt, edt);
	var n = dlst.length;
	obj.checkWorkingTime = false; // 暫定で工数入力時間のチェックをオフ
	for(var i = 0 ; i < obj.applys.length ; i++){
		var a = obj.applys[i];
		if(a.applyType == teasp.constant.APPLY_TYPE_EXCHANGE){
			if(a.exchangeDate < sdt || edt < a.exchangeDate){
				dlst.push(a.exchangeDate);
			}else if(a.startDate < sdt || edt < a.startDate){
				dlst.push(a.startDate);
			}
		}
	}
	if(n < dlst.length){ // 振替日を追加したので日付順にソート
		dlst = dlst.sort(function(a, b){
			return (a < b ? -1 : (a > b ? 1 : 0));
		});
	}
	// obj.days に dlst の日付が含まれてない場合、補完しつつ days の要素を配列に再格納する。
	var dayList = [];
	for(i = 0 ; i < dlst.length ; i++){
		var key = dlst[i];
		if(obj.days[key]){
			obj.days[key].date = key;
		}else{
			obj.days[key] = { date: key };
		}
		dayList.push(obj.days[key]);
	}
	for(i = 0 ; i < dayList.length ; i++){
		var day = dayList[i];
		var dkey = day.date;
		day.dbDayType = day.dayType; // DBに保存されている dayType の値を別要素に保存
		// 日付を含む月度が確定済みの場合、day の要素をそのまま使う。
		for(var j = 0 ; j < obj.months.length ; j++){
			var m = obj.months[j];
			if(m.startDate <= dkey && dkey <= m.endDate){
				day.month = m;
			}
		}
		var em = day.month;
		if(em.config.useDailyApply && em.config.checkWorkingTime){
			obj.checkWorkingTime = true; // 工数入力時間のチェックをする
		}
		var monthFix = (em && em.apply && teasp.constant.STATUS_FIX.contains(em.apply.status));
		if(monthFix){ // 勤怠月次確定済み
			var config = em.config;
			if(config.holidays.indexOf('2') < 0                           // 法定休日の設定なし
			&& !teasp.util.time.isValidRange(day.startTime, day.endTime)  // 勤怠未入力
			&& day.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){     // 法定休日に設定されている
				day.dayType = teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
			}
			// 勤務確定後、holiday1 の plannedHoliday が真ならその日は有休計画付与日と判定
			if(day.holiday1 && day.holiday1.plannedHoliday){
				day.plannedHoliday = true;
			}
			// 確定済みなら平日以外で出退時刻が入っていても問題ない（振替などが行われている）
			// フラグをセットして「休日の労働時間は休日出勤申請がなければ無効です。」の警告が出るのを防ぐ。
			if(day.dayType != teasp.constant.DAY_TYPE_NORMAL
			&& teasp.util.time.isValidRange(day.startTime, day.endTime)){
				day.workFlag = true;
			}
		}else{
			// day の要素を再構築する前にいったん削除
			delete day.dayType;
			delete day.event;
			delete day.plannedHoliday;
			delete day.pattern;
			delete day.holiday1;
			delete day.holiday2;
			delete day.exchangeDate;

			delete day.rack;
			delete day.period;
			delete day.real;
			delete day.deco;

			day.dayType = teasp.constant.DAY_TYPE_NORMAL; // 暫定で平日にセット
			day.plannedHoliday = false;                   // 暫定で有休計画付与日オフ

			// 日付オブジェクトを得る
			var d = teasp.util.date.parseDate(dkey);

			// dayType、plannedHoliday、event は Config、カレンダーとマージして決定
			// 勤怠設定の繰り返し休日と国民の祝日で dayType をセット
			var ho = em.fixHolidays[dkey];
			day.dayType = (ho ? ho.dayType : teasp.constant.DAY_TYPE_NORMAL);
			if(em.config.defaultLegalHoliday !== null
			&& day.dayType != teasp.constant.DAY_TYPE_NORMAL
			&& d.getDay() == em.config.defaultLegalHoliday){
				day.defaultLegalHolidayFlag = true;
			}
			// 勤怠カレンダーとマージ
			var events = [];
			if(ho && ho.title){
				events.push('(' + ho.title + ')');
			}
			var c = obj.cals[dkey];
			if(c){
				if(c.type){
					day.dayType = (typeof(c.type) == 'string' ? parseInt(c.type, 10) : c.type);
					day.plannedHoliday = c.plannedHoliday;
				}
				if(c.pattern){
					day.pattern = c.pattern;
				}
				if(c.event){
					events.push(c.event);
				}
			}
			var deptId = this.getDeptIdByMonth(em);
			var c2 = (deptId && obj.cals[deptId] && obj.cals[deptId][dkey]) || null;
			if(c2 && c2.event){
				events.push(c2.event);
			}
			day.event = events.join(teasp.message.getLabel('tm10001470')); // ／(区切り)
			if(!day.pattern){
				// 勤務パターンの適用日で pattern を決定
				// ※他の要素については別ロジックで申請レコードとマージして決定する
				var p = teasp.logic.EmpTime.getPatternByDate(obj.empTypePatterns, d);
				if(p){
					day.pattern = p.pattern;
				}
			}
			day.explicDayType = day.dayType;
		}

		day.rack = {};
		day.rack.key = dkey;
		day.rack.inputable = true;
		if(day.plannedHoliday && day.dayType != teasp.constant.DAY_TYPE_NORMAL){
			day.plannedHoliday = false;
		}
		var na = [];   // 無効な申請リスト
		var va = empTime.getValidApplys((amap[dkey] || []), na, dkey); // 仕訳済みの有効な申請情報
		day.rack.validApplys = va;
		if(va.shiftSet){
			var p = va.shiftSet;
			if(p.pattern){
				day.pattern = p.pattern;
			}
			if(p.dayType !== null){
				day.dayType = (p.dayType == '0' ? teasp.constant.DAY_TYPE_NORMAL : teasp.constant.DAY_TYPE_NORMAL_HOLIDAY);
			}
		}

		/*
		 * 振替申請（元）がある場合、振替先と dayType を入れ替える
		 */
		if(va.exchangeS || va.exchangeE){
			var sm = !day.month.config.prohibitInputTimeUntilApproved;
			var xs = (va.exchangeS ? {
				dkey1   : va.exchangeS.startDate,
				dkey2   : va.exchangeS.exchangeDate,
				valid   : (sm || teasp.constant.STATUS_APPROVES.contains(va.exchangeS.status))
			} : null);
			var xe = (va.exchangeE ? {
				dkey1   : va.exchangeE.exchangeDate,
				dkey2   : va.exchangeE.originalStartDate,
				valid   : (sm || teasp.constant.STATUS_APPROVES.contains(va.exchangeE.status))
			} : null);
			var xer = teasp.logic.EmpTime.exchangeDateInfo(this, obj.days, dkey, dlst, xe);
			if(xer && xer.valid){
				day.dayType = xer.dayType;
			}
			var xsr = teasp.logic.EmpTime.exchangeDateInfo(this, obj.days, dkey, dlst, xs);
			var xr = (xsr && xsr.valid ? xsr : (xer || xsr));
			if(xr){
				day.exchangeDate = xr.exchangeDate;
				day.dayType      = xr.dayType;
				if(xr.orgDayType !== undefined){
					day.orgDayType = xr.orgDayType;
				}
				if(xr.interim){
					day.interim = xr.interim;
				}else if(xsr && xsr.interim){
					day.interim = xsr.interim;
				}
			}
		}
		/*
		 * dayに申請の勤務パターン情報をセット
		 */
		if(va.patternS || va.patternL){
			var p = (va.patternS || va.patternL);
			if(!monthFix){ // 確定状態ではない
				if(p.pattern){
					day.pattern   = p.pattern;
				}
				if(p.dayType !== null){
					day.dayType = (p.dayType == '0' ? teasp.constant.DAY_TYPE_NORMAL : teasp.constant.DAY_TYPE_NORMAL_HOLIDAY);
				}
			}
		}
		var dayType = day.dayType;
		if(dayType == teasp.constant.DAY_TYPE_NORMAL && !day.plannedHoliday){ // 平日
			if(va.kyushtu.length > 0){ // 休日出勤申請がある
				if(!monthFix){
					va.kyushtu = [];
				}else{
					// 勤務確定後なら、有休計画付与日と判断する
					day.plannedHoliday = true;
				}
			}
		}else{ // 休日
			if(va.holidayAll || va.holidayAm || va.holidayPm){ // 休暇申請がある
				if(va.holidayAll && !va.holidayAll.holiday.displayDaysOnCalendar){
					va.holidayAll = null;
				}
				if(va.holidayAm && !va.holidayAm.holiday.displayDaysOnCalendar){
					va.holidayAm = null;
				}
				if(va.holidayPm && !va.holidayPm.holiday.displayDaysOnCalendar){
					va.holidayPm = null;
				}
			}
		}
		/*
		 * 勤務パターン最終決定
		 */
		if(!day.pattern){
			day.pattern = day.month.config.defaultPattern;
		}
		var pattern = day.pattern;

		if(!monthFix){ // 確定状態ではない
			day.holiday1   = null;
			day.holiday2   = null;
			if(va.holidayAll){ // 終日休
				day.holiday1   = va.holidayAll.holiday;
			}else if(va.holidayAm || va.holidayPm){ // 午前休または午後休が申請されている
				if(!pattern.useHalfHoliday){ // 半日休が許可されてない勤務パターン
					if(va.holidayAm){
						va.holidayAm = null;
					}
					if(va.holidayPm){
						va.holidayPm = null;
					}
				}else{
					if(va.holidayAm && va.holidayPm){   // 午前休と午後休両方申請
						day.holiday1   = va.holidayAm.holiday;
						day.holiday2   = va.holidayPm.holiday;
					}else if(va.holidayAm){ // 午前休
						day.holiday1   = va.holidayAm.holiday;
					}else if(va.holidayPm){ // 午後休
						day.holiday1   = va.holidayPm.holiday;
					}
				}
			}
		}
		if(dayType == teasp.constant.DAY_TYPE_NORMAL || (va.kyushtu.length > 0) || day.workFlag || day.autoLH){
			if(day.holiday1 && day.holiday1.range == teasp.constant.RANGE_ALL){ // 終日休
				day.rack.holidayJoin = {
					flag    : 3,
					name    : day.holiday1.name,
					type    : day.holiday1.type,
					planned : (day.holiday1.plannedHoliday || false)
				};
			}else if(day.holiday1 && day.holiday2 && day.holiday1.range == teasp.constant.RANGE_AM && day.holiday2.range == teasp.constant.RANGE_PM){ // 午前休＋午後休
				day.rack.holidayJoin = {
					flag    : 3,
					name    : day.holiday1.name + teasp.message.getLabel('tm10001560') + day.holiday2.name, // '，'
					type    : (day.holiday1.type <= day.holiday2.type ? day.holiday1.type : day.holiday2.type)
				};
			}else if(day.holiday1){
				if(day.holiday1.range == teasp.constant.RANGE_AM){ // 午前休
					day.rack.holidayJoin = {
						flag : 1,
						name : day.holiday1.name,
						type : day.holiday1.type
					};
				}else{ // 午後休
					day.rack.holidayJoin = {
						flag : 2,
						name : day.holiday1.name,
						type : day.holiday1.type
					};
				}
			}
			if(dayType == teasp.constant.DAY_TYPE_NORMAL || day.workFlag || day.autoLH){
				day.rack.inputable = (!day.rack.holidayJoin || day.rack.holidayJoin.flag != 3);
			}else if(va.kyushtu.length > 0
			&& !teasp.constant.STATUS_APPROVES.contains(va.kyushtu[0].status)
			&& day.month.config.prohibitInputTimeUntilApproved){
				day.rack.inputable = false;
			}
		}else{
			day.rack.inputable = false;
		}
		/*
		 * 有休計画付与日
		 */
		day.rack.plannedHolidayReal = false;
		if(day.plannedHoliday && (va.kyushtu.length <= 0)){ // 休日出勤申請がない場合、有休取得日と判定
			day.rack.plannedHolidayReal = true;
			day.rack.inputable = false;
		}
		/*
		 * 出退時刻とも入力されている場合、出勤フラグをセット
		 * 平日以外の場合、休日出勤申請がない場合は、出退時刻が入力されていても出勤フラグはオフ
		 */
		if(dayType == teasp.constant.DAY_TYPE_NORMAL || (va.kyushtu.length > 0) || day.workFlag || day.autoLH){
			day.rack.worked = teasp.util.time.isValidRange(day.startTime, day.endTime);
		}else{
			day.rack.worked = false;
		}
	}
};

/**
 * 勤怠計算ベリファイ実行
 *
 * @param {Function} 成功時コールバック
 * @param {Function} 失敗時コールバック
 */
teasp.data.Pouch.prototype.verifyMonth = function(onFind, onSuccess, onFailure){
	var verCheck = new teasp.verify.VerCheck(this.dataObj, true);
	verCheck.verifyMonth(onFind, onSuccess, onFailure);
};

/**
 * 経費事前申請種別設定 を返す
 * @returns {Object}
 */
teasp.data.Pouch.prototype.getExpPreApplyConfig = function(){
	return this.dataObj.common.expPreApplyConfig || {};
};

/**
 * 申請情報を使うか
 * @returns {Object}
 */
teasp.data.Pouch.prototype.getUseApplyHeader = function(){
	var c = this.getExpPreApplyConfig() || {};
	var v = {
		'expenseType' : this.getExpenseType(),
		'payMethod'   : this.getPayExpItemName(),
		'applyDate'   : this.getApplyDate(),
		'payDate'     : this.getPayDate(),
		'provisional' : this.getProvisionalPaymentTitle(),
		'chargeJob'   : this.getChargeJobName(),
		'chargeDept'  : this.getChargeDeptName(),
		'extraItem1'  : this.getExtraItem1(),
		'extraItem2'  : this.getExtraItem2()
	};
	var o = {
		useExpenseType : (c.expApply.useExpenseType || v['expenseType']), // 精算区分を指定する
		usePayMethod   : (c.expApply.usePayMethod   || v['payMethod']  ), // 精算方法を指定する
		useApplyDate   : (c.expApply.useApplyDate   || v['applyDate']  ), // 申請日を指定する
		usePayDate     : (c.expApply.usePayDate     || v['payDate']    ), // 支払予定日を指定する
		useProvisional : (c.expApply.useProvisional || v['provisional']) && !this.getExpPreApplyPpAmount(), // 仮払い申請を指定する（紐づいている事前申請の仮払金額が０）
		useChargeJob   : (c.expApply.useChargeJob   || v['chargeJob']  ), // ジョブを指定する
		useChargeDept  : (c.expApply.useChargeDept  || v['chargeDept'] ), // 負担部署を指定する
		useExtraItem1  : (c.expApply.useExtraItem1  || v['extraItem1'] ), // 拡張項目1を指定する
		useExtraItem2  : (c.expApply.useExtraItem2  || v['extraItem2'] ), // 拡張項目2を指定する
		value          : v
	};
	o.anyUse = (o.useExpenseType
			|| o.usePayMethod
			|| o.useApplyDate
			|| o.usePayDate
			|| o.useProvisional
			|| o.useChargeJob
			|| o.useChargeDept
			|| o.useExtraItem1
			|| o.useExtraItem2
			);
	return o;
};

/**
 * 拡張項目１のラベル名
 * @returns {String}
 */
teasp.data.Pouch.prototype.getExtraItemOutPutDataName1 = function(){
	return this.dataObj.common.extraItemOutPutDataName1 || '';
};

/**
 * 拡張項目２のラベル名
 * @returns {String}
 */
teasp.data.Pouch.prototype.getExtraItemOutPutDataName2 = function(){
	return this.dataObj.common.extraItemOutPutDataName2 || '';
};

/**
 * ジョブ割当区分
 * @returns
 */
teasp.data.Pouch.prototype.getJobAssignClass = function(){
	return (this.dataObj.targetEmp && this.dataObj.targetEmp.jobAssignClass) || null;
};

/**
 * 【勤怠】｛基準日を含む月度開始日 - [pmon 月前]｝ ～ fmon 月後の月度締め日の期間の月リストを返す
 * ※ 加算月数、減算月数の指定より多めに返す場合がある
 * 読み込んだ AtkEmpMonth__c 配列と AtkEmp__c.EmpTypeHistory__c から生成する
 *
 * @param {Object|string} bd 基準日
 * @param {number} fmon 加算月数
 * @param {?number} pmon 減算月数
 * @return {Array.<Object>} 月度、開始日、終了日、勤務体系を格納したオブジェクトの配列
 */
teasp.data.Pouch.prototype.getEmpMonthList = function(bd, fmon, pmon){
	if(typeof(bd) != 'object'){ bd = teasp.util.date.parseDate('' + bd); }
	var months = this.dataObj.months || [];
	var eths = this.dataObj.empTypeHistory || [];
	// ラフ（多め）に開始日、終了日を決める
	var sd = teasp.util.date.formatDate((pmon && pmon < 0 ? teasp.util.date.addDays(bd, (pmon - 1) * 31) : bd));
	var ed = teasp.util.date.formatDate(teasp.util.date.addDays(bd, (fmon + 1) * 31));
	var empMonthList = new Array();
	var d = teasp.util.date.addMonths(sd, -2); // 正しいサブナンバーを得るために開始日の2カ月前を起点とする
	var pm = null;
	var ymm = {};
	while(d <= ed){
		// 勤務体系履歴から月度情報を作成
		var m = null;
		for(var i = 0 ; i < eths.length ; i++){
			var eth = eths[i];
			if((!eth.sd || eth.sd <= d) && (!eth.ed || d <= eth.ed)){
				var o = teasp.util.searchYearMonthDate(eth.empType.configBase.initialDateOfMonth, eth.empType.configBase.markOfMonth, null, d);
				m = {
					yearMonth : o.yearMonth,
					startDate : ((eth.sd && eth.sd > o.startDate) ? eth.sd : o.startDate),
					endDate   : ((eth.ed && eth.ed < o.endDate  ) ? eth.ed : o.endDate  ),
					empType   : eth.empType,
					initialDate: eth.id,
					fix       : false
				};
				// 月度が確定済みの場合、月度の勤務体系を優先
				for(var x = 0 ; x < months.length ; x++){
					var month = months[x];
					if(month._em.startDate <= d && month._em.endDate >= d && this.isEmpMonthFixed(month, true)){
						m.empType = month._em.empType;
						m.fix = true;
						break;
					}
				}
				break;
			}
		}
		if(!pm || pm.startDate != m.startDate){
			// サブナンバーを取得
			var n = ymm[m.yearMonth];
			if(!n){
				ymm[m.yearMonth] = 1;
			}else{
				m.subNo = n;
				ymm[m.yearMonth] = (n + 1);
			}
			m.yearMonthEx = teasp.util.date.formatDate(m.startDate, 'yyyyMMdd');
			if(m.endDate >= sd){
				empMonthList.push(m);
			}
			pm = m;
		}
		d = teasp.util.date.addDays(m.endDate, 1);
	}
	return empMonthList;
};

teasp.data.Pouch.prototype.getEmpMonthListByYear = function(em){
	var all = this.getEmpMonthList(em.startDate, 15, -15);
	var yms = teasp.data.Pouch.getYmRangeOfYear(em.yearMonth, em.empType.configBase.initialDateOfYear);
	var id = em.initialDate || null;
	var months = new Array();
	for(var x = 0 ; x < yms.length ; x++){
		var ym = yms[x];
		for(var i = 0 ; i < all.length ; i++){
			var m = all[i];
			if(m.yearMonth == ym && (m.initialDate || null) == id){
				months.push(m);
			}
		}
	}
	return months;
};

teasp.data.Pouch.prototype.getEmpMonthListByPeriod = function(em, vp){
	var all = this.getEmpMonthList(em.startDate, 15, -15);
	var yms = teasp.data.Pouch.getYmRangeOfPeriod(em.yearMonth, em.empType.configBase.initialDateOfYear, vp);
	var id = em.initialDate || null;
	var months = new Array();
	for(var x = 0 ; x < yms.length ; x++){
		var ym = yms[x];
		for(var i = 0 ; i < all.length ; i++){
			var m = all[i];
			if(m.yearMonth == ym && (m.initialDate || null) == id && this.compatibleMonth(m, em)){
				months.push(m);
			}
		}
	}
	return months;
};

teasp.data.Pouch.prototype.compatibleMonth = function(m1, m2){
	var month1 = this.getMonthByStartDate(m1.startDate);
	var month2 = this.getMonthByStartDate(m2.startDate);
	if(!month1 || !month2){
		return true;
	}
	var ws1 = month1.config.workSystem;
	var ws2 = month2.config.workSystem;
	if(ws1 == teasp.constant.WORK_SYSTEM_FLEX || ws2 == teasp.constant.WORK_SYSTEM_FLEX){
		var empTypeId1 = month1._em && month1._em.empTypeId;
		var empTypeId2 = month2._em && month2._em.empTypeId;
		return (empTypeId1 == empTypeId2);
	}
	// TODO #8748 検討事項
	// 労働時間制と変形期間を見て、期間を区切るなら false、区切らないなら true を返す
	return true;
};

teasp.data.Pouch.prototype.getMonthByStartDate = function(sd){
	var months = this.dataObj.months || [];
	for(var i = 1 ; i < months.length ; i++){
		var m = months[i];
		if(m.startDate == sd){
			return months[i];
		}
	}
	return null;
};

/**
 * 日付から月度情報を得る
 * @param {string} d
 * @returns {Object|null}
 */
teasp.data.Pouch.prototype.getMonthByDate = function(d){
	var months = this.dataObj.months || [];
	for(var i = 1 ; i < months.length ; i++){
		var m = months[i];
		if(m.startDate <= d && d <= m.endDate){
			return months[i];
		}
	}
	return null;
};

teasp.data.Pouch.getYmRangeOfYear = function(ym, im){
	var yms = new Array();
	var y = Math.floor(ym / 100);
	var m = ym % 100;
	if(m < im){
		y--;
	}
	m = im;
	while(yms.length < 12){
		yms.push(y * 100 + (m++));
		if(m > 12){
			y++;
			m = 1;
		}
	}
	return yms;
};

teasp.data.Pouch.getYmRangeOfPeriod = function(ym, im, vp){
	var tmp = new Array();
	var y = Math.floor(ym / 100);
	var m = ym % 100;
	if(m < im){
		y--;
	}
	var x = im;
	var pos = -1;
	while(tmp.length < 12){
		var n = y * 100 + (x++);
		if(n == ym){
			pos = tmp.length;
		}
		tmp.push(n);
		if(x > 12){
			y++;
			x = 1;
		}
	}
	var n = Math.floor(pos / vp) * vp;
	var yms = new Array();
	while(yms.length < vp){
		yms.push(tmp[n++]);
	}
	return yms;
};

teasp.data.Pouch.prototype.getJobMonthList = function(bd, fmon, pmon){
	if(typeof(bd) != 'object'){ bd = teasp.util.date.parseDate('' + bd); }
	var jihs = this.dataObj.jobInitHistory || [];
	// ラフ（多め）に開始日、終了日を決める
	var sd = teasp.util.date.formatDate((pmon && pmon < 0 ? teasp.util.date.addDays(bd, (pmon - 1) * 31) : bd));
	var ed = teasp.util.date.formatDate(teasp.util.date.addDays(bd, (fmon + 1) * 31));
	var jobMonthList = new Array();
	var d = teasp.util.date.addMonths(sd, -2); // 正しいサブナンバーを得るために開始日の2カ月前を起点とする
	var pm = null;
	var ymm = {};
	while(d <= ed){
		var m = null;
		for(var i = 0 ; i < jihs.length ; i++){
			var jih = jihs[i];
			if((!jih.sd || jih.sd <= d)
			&& (!jih.ed || d <= jih.ed)){
				var o = teasp.util.searchYearMonthDate(jih.initialDateOfMonth, jih.markOfMonth, null, d);
				m = {
					yearMonth : o.yearMonth,
					startDate : ((jih.sd && jih.sd > o.startDate) ? jih.sd : o.startDate),
					endDate   : ((jih.ed && jih.ed < o.endDate  ) ? jih.ed : o.endDate  )
				};
				break;
			}
		}
		if(!pm || pm.startDate != m.startDate){
			// サブナンバーを取得
			var n = ymm[m.yearMonth];
			if(!n){
				ymm[m.yearMonth] = 1;
			}else{
				m.subNo = n;
				ymm[m.yearMonth] = (n + 1);
			}
			m.yearMonthEx = teasp.util.date.formatDate(m.startDate, 'yyyyMMdd');
			if(m.endDate >= sd){
				jobMonthList.push(m);
			}
			pm = m;
		}
		d = teasp.util.date.addDays(m.endDate, 1);
	}
	return jobMonthList;
};

teasp.data.Pouch.prototype.getEmpMonth = function(ym, dt, mv, flag){
	if(dt && typeof(dt) == 'object'){ dt = teasp.util.date.formatDate(dt); }
	var d = dt;
	if(!dt){
		d = '' + ym;
		d = d.substring(0, 4) + '-' + d.substring(4, 6) + '-01';
	}
	var fmon =  2 + ((mv && mv > 0) ? mv : 0);
	var tmon = -2 + ((mv && mv < 0) ? mv : 0);
	var months = this.getEmpMonthList(d, fmon, tmon);
	var month = null;
	for(var i = 0 ; i < months.length ; i++){
		var m = months[i];
		if((!dt && m.yearMonth >= ym)
		|| (dt && m.startDate <= dt && dt <= m.endDate)){
			if(m.yearMonth > ym && flag && !mv && i > 0){
				month = months[i - 1];
			}else{
				if(mv){
					month = months[i + mv];
				}else{
					month = m;
				}
			}
			break;
		}
	}
	return month;
};

teasp.data.Pouch.prototype.getJobMonth = function(ym, dt, mv){
	if(dt && typeof(dt) == 'object'){
		dt = teasp.util.date.formatDate(dt);
	}
	var d = dt;
	if(!dt){
		d = '' + ym;
		d = d.substring(0, 4) + '-' + d.substring(4, 6) + '-01';
	}
	var fmon =  2 + ((mv && mv > 0) ? mv : 0);
	var tmon = -2 + ((mv && mv < 0) ? mv : 0);
	var months = this.getJobMonthList(d, fmon, tmon);
	var month = null;
	for(var i = 0 ; i < months.length ; i++){
		var m = months[i];
		if((!dt && m.yearMonth == ym)
		|| (dt && m.startDate <= dt && dt <= m.endDate)){
			if(mv){
				month = months[i + mv];
			}else{
				month = m;
			}
			break;
		}
	}
	return month;
};

/**
 * 乖離理由候補
 * @returns {Array.<string>}
 */
teasp.data.Pouch.prototype.getDivergenceReasonList = function(){
	return this.dataObj.common.divergenceReasonList || [];
};
/**
 * タイムレポートの勤怠情報と経費精算を非表示にする
 */
teasp.data.Pouch.prototype.isTimeReportDedicatedToJob = function(){
	return (this.dataObj.common.config && this.dataObj.common.config.timeReportDedicatedToJob) || false;
};
/**
 * 工数実績画面で勤務時間と工数時間不一致日に警告アイコンを表示
 */
teasp.data.Pouch.prototype.isWarningOnMAPHW = function(){
	return (this.dataObj.common.config && this.dataObj.common.config.warningOnMAPHW) || false;
};
/**
 * 工数実績入力時に工数と勤務時間が合わなければ入力不可とする
 */
teasp.data.Pouch.prototype.isCheckInputWorkHours = function(){
	return (this.dataObj.common.config && this.dataObj.common.config.checkInputWorkHours) || false;
};
/**
 * Webタイムレコーダーとタイムレポートによる打刻時に位置情報を記録する
 */
teasp.data.Pouch.prototype.isPushTimeWithLocationWeb = function(){
	return (this.dataObj.common.config && this.dataObj.common.config.pushTimeWithLocationWeb) || false;
};
/**
 * 個人設定を非表示にする
 */
teasp.data.Pouch.prototype.isHidePersonalInfo = function(){
	return (this.dataObj.common.config && this.dataObj.common.config.hidePersonalInfo) || false;
};
/**
 * 退社後または出社前に時間単位休や半休がある時、定時で所定勤務に達していれば遅刻・早退時間をカウントしない
 */
teasp.data.Pouch.prototype.isAdjustLateTimeEarlyTime = function(){
	return (this.dataObj.common.config && this.dataObj.common.config.adjustLateTimeEarlyTime) || false;
};
/**
 * コア時間帯が設定されていないフレックスの半日休暇適用時間を使用しない
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isFlexibleHalfDayTime = function(){
	return (this.dataObj.common.config && this.dataObj.common.config.flexibleHalfDayTime) || false;
};
/**
 * 勤務場所入力可否を返す
 * @param {boolean=} flag trueならteasp.isNarrow()が真のときfalseを返す
 * @returns {boolean}
 */
 teasp.data.Pouch.prototype.isUseWorkLocation = function(flag){
	if(flag && teasp.isNarrow()){
		return false;
	}
	return this.getObj().config.useWorkLocation || false;
};
/**
 * 勤務場所入力が必須か
 * @returns {boolean}
 */
teasp.data.Pouch.prototype.isRequireWorkLocation = function(){
	if(!this.getObj().config.useWorkLocation){
		return false;
	}
	return this.getObj().config.requireWorkLocation || false;
};
/**
 * 勤務場所クラスインスタンスの配列を作る
 * ※この関数が呼ばれる前に this.dataObj.common に値が格納されていること
 * @param {Array.<Object>} objs WorkLocation__c の SObject の配列
 */
teasp.data.Pouch.prototype.setWorkLocations = function(objs){
	this.dataObj.workLocations = [];
	const defaultId = this.dataObj.common.defaultWorkLocationId || null;
	for(var i = 0 ; i < objs.length ; i++){
		const workLocation = new teasp.data.WorkLocation(objs[i]);
		if(defaultId && workLocation.getId() == defaultId){
			workLocation.setInitFlag(true);
		}
		this.dataObj.workLocations.push(workLocation);
	}
};
/**
 * 勤務場所の配列を返す
 * @param {boolean=} true:すべて  false:有効のみ
 * @returns {Array.<teasp.data.WorkLocation>}
 */
teasp.data.Pouch.prototype.getWorkLocations = function(flag){
	const workLocations = this.dataObj.workLocations || [];
	if(flag){
		return workLocations;
	}
	const valids = [];
	for(var i = 0 ; i < workLocations.length ; i++){
		if(!workLocations[i].isRemoved()){
			valids.push(workLocations[i]);
		}
	}
	return valids;
};
/**
 * デフォルトの勤務場所を返す
 * @returns {teasp.data.WorkLocation|null}
 */
teasp.data.Pouch.prototype.getDefaultWorkLocation = function(){
	var workLocation = null;
	const workLocations = this.dataObj.workLocations || [];
	for(var i = 0 ; i < workLocations.length ; i++){
		if(workLocations[i].isInitFlag()){
			workLocation = workLocations[i];
			break;
		}
	}
	return workLocation;
};
/**
 * 勤務場所IDから勤務場所を返す
 * @param {string} id
 * @returns {teasp.data.WorkLocation|null}
 */
teasp.data.Pouch.prototype.getWorkLocationById = function(id){
	if(!id){
		return null;
	}
	const workLocations = this.dataObj.workLocations || [];
	for(var i = 0 ; i < workLocations.length ; i++){
		const workLocation = workLocations[i];
		if(workLocation.getId() == id){
			return workLocation;
		}
	}
	return null;
};
