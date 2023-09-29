teasp.provide('teasp.helper.ScheduleImport');

/**
 * スケジュール取込クラス
 *
 * @constructor
 */
teasp.helper.ScheduleImport = function(){
};

/**
 * 取込対象の時間範囲を得る
 * @param {teasp.data.EmpDay} dayWrap
 * @returns {{
 *   st:{number},
 *   et:{number},
 *   sdt:{moment},
 *   edt:{moment}
 * }}
 */
teasp.helper.ScheduleImport.prototype.getImportRange = function(dayWrap){
	var day = dayWrap.getObj();
	var vt = {
		from  : day.rack.startTimeEx, // 出社時刻
		to    : day.rack.endTimeEx,   // 退社時刻
		rests : [], // 休憩
		border: {
			from: Math.max((dayWrap.getFixStartTime() || 0) - (4 * 60) , 0),   // 出社時刻がない時の開始
			to  : Math.max((dayWrap.getFixStartTime() || 0) + (20 * 60), 1440) // 退社時刻未入力時の終了
		},
		nowork: false
	};
	if(vt.from === null && vt.to === null){ // 出退社時刻未入力
		var holidayTimes = [];
		dojo.forEach(day.rack.validApplys.holidayTime || [], function(ht){
			holidayTimes.push({ from: ht.startTime, to: ht.endTime });
		});
		vt.rests = teasp.util.time.margeTimeSpans(holidayTimes.concat(day.pattern.restTimes));
	}else{
		var timeTable = (day.timeTable || []);
		for(var i = 0 ; i < timeTable.length ; i++){
			var t = timeTable[i];
			if(t.type == teasp.constant.REST_FIX
			|| t.type == teasp.constant.REST_FREE
			|| t.type == teasp.constant.REST_PAY
			|| t.type == teasp.constant.REST_UNPAY){
				vt.rests.push(t);
			}
		}
	}
	if(day.rack.holidayJoin && day.rack.holidayJoin.flag == 3){ // 終日休
		vt.nowork = true;
	}else{
		if(day.rack.validApplys.holidayAm){ // 午前半休
			if(vt.border.from < day.pattern.amHolidayEndTime){
				vt.border.from = day.pattern.amHolidayEndTime;
			}
		}else if(day.rack.validApplys.holidayPm){ // 午後半休
			if(vt.border.to > day.pattern.pmHolidayStartTime){
				vt.border.to = day.pattern.pmHolidayStartTime;
			}
		}
	}
	vt.st = (vt.from !== null ? vt.from : vt.border.from);
	vt.et = (vt.to   !== null ? vt.to   : vt.border.to  );
	var d = moment(dayWrap.getKey(), teasp.constant.DATE_F);
	vt.sdt = d.clone().add(vt.st, 'm');
	vt.edt = d.clone().add(vt.et, 'm');

	console.log(dojo.string.substitute('RANGE)${0}～${1}', [
		vt.sdt.format('YYYY/MM/DD HH:mm'),
		vt.edt.format('YYYY/MM/DD HH:mm')
	]));
	var rests = vt.rests || [];
	for(var i = 0 ; i < rests.length ; i++){
		var rest = rests[i];
		console.log(dojo.string.substitute('REST-${0})${1}～${2}', [
			(i+1),
			d.clone().add(rest.from, 'm').format('YYYY/MM/DD HH:mm'),
			d.clone().add(rest.to  , 'm').format('YYYY/MM/DD HH:mm')
		]));
	}
	return vt;
};

/**
 * スケジュールからジョブIDまたはジョブコードを取り込み、サーバからジョブ情報を得る
 * @param {Function} callback
 * @param {teasp.data.Pouch} pouch
 * @param {teasp.helper.Schedule} helperSche
 * @param {teasp.helper.ScheduleTxsLog} helperTxsLog
 */
teasp.helper.ScheduleImport.prototype.import = function(callback, pouch, helperSche, helperTxsLog){
	this.callback = callback;
	this.pouch = pouch;
	this.helperSche = helperSche;
	this.helperTxsLog = helperTxsLog;
	this.helperJobs = new teasp.helper.ScheduleJobs();

	var dayWrap = this.pouch.getEmpDay(this.pouch.getParamDate());
	var evs = this.helperSche.getAllEvs();
	var range = this.getImportRange(dayWrap);
	var jobLinked = 0;

	var existTxsLogs = this.helperTxsLog.getTxsLogJobs(dayWrap.getEndTime(true), range, this.helperJobs); // TxsLogを取得
	if(!existTxsLogs){
		// 取込対象のジョブと時間を取得
		if(!evs.length){ // イベントは登録されてない
			teasp.tsAlert(teasp.message.getLabel('tm20001240'), this); // スケジュールが登録されていません
			return;
		}
		for(var i = 0 ; i < evs.length ; i++){
			var ev = evs[i];
			if(ev.isRelayJob()){ // 関連ジョブがある
				jobLinked++;
			}
			if(range.nowork){ // 終日の休暇日
				continue;
			}
			ev.collectJobs(range, this.helperJobs);
		}
		if(!jobLinked){ // ジョブに紐づくスケジュールははない
			teasp.tsAlert(teasp.message.getLabel('tm20001250'), this); // スケジュールの件名にジョブコードは埋め込まれていません。
			return;
		}
	}

	var allIds   = this.helperJobs.getJobIds();
	var allCodes = this.helperJobs.getJobCodes();
	if(!allCodes.length && !allIds.length){ // ジョブに紐づくスケジュールはあるが、取込対象はない
		teasp.tsAlert(teasp.message.getLabel('tm20001241'), this); // スケジュール取込の対象がありません。
		return;
	}
	// ジョブID、ジョブコードで検索
	teasp.manager.request(
		'searchJob',
		{
			empId	 : this.pouch.getEmpId(),
			jobCodes : allCodes,
			jobIds	 : allIds
		},
		this.pouch,
		{},
		this,
		function(jobs){
			this.openEmpWorkEx(jobs);
		},
		function(event){
			teasp.message.alertError(event);
		}
	);
};

/**
 * 取込対象チェック、工数入力画面を表示
 *
 * @param {Array.<Object>} jobs
 */
teasp.helper.ScheduleImport.prototype.openEmpWorkEx = function(jobs){
	var dkey = this.pouch.getParamDate();
	var classifyJobWorks = dojo.clone(this.pouch.getClassifyJobWorks(dkey));
	var codeList = this.helperJobs.getJobCodeList(jobs);
	var assignLimits = [];
	var jaClassLimits = [];
	var outOfTerms = [];
	var importCount = 0;
	var validCount = 0;
	for(var i = 0 ; i < codeList.length ; i++){
		var c = codeList[i];
		var jw = this.pouch.entryScheduledJob(classifyJobWorks, c, jobs, dkey);
		if(jw && !jw.ngFact){
			if(!jw.isAssigned && jw.key == 'scheduleWorks'){
				jw.onlyScheduled = true;
			}
			if(c.isAllDayEvent){
				jw.timeFix = false;
				jw.volume = 1000;
			}else{
				jw.timeFix = true;
				jw.time = c.minutes;
			}
			if(c.isAllDayEvent || c.inner || jw.onlyScheduled){
				importCount++;
			}
			validCount++;
		}else if(jw && jw.ngFact){
			if(jw.ngFact == teasp.data.Pouch.NG_JOB_ASSIGN_EMP){
				assignLimits.push(teasp.message.getLabel('tf10003670', jw.jobCode, jw.jobName));
			}
			if(jw.ngFact == teasp.data.Pouch.NG_JOB_ASSIGN_CLASS){
				jaClassLimits.push(teasp.message.getLabel('tf10003670', jw.jobCode, jw.jobName));
			}
			if(jw.ngFact == teasp.data.Pouch.NG_JOB_OUT_OF_TERM){
				outOfTerms.push(teasp.message.getLabel('tf10003670', jw.jobCode, jw.jobName));
			}
		}
	}
	var alertMessage = null;
	if(assignLimits.length || jaClassLimits.length || outOfTerms.length){
		var ngmsg = [];
		if(outOfTerms.length){
			ngmsg.push(teasp.message.getLabel('tf10003640', outOfTerms.join(','))); // {0}は期限切れのため、取り込みできません。
		}
		if(assignLimits.length){
			ngmsg.push(teasp.message.getLabel('tf10003641', assignLimits.join(','))); // {0}は社員割当が制限されているため、取り込みできません。
		}
		if(jaClassLimits.length){
			ngmsg.push(teasp.message.getLabel('tf10003642', jaClassLimits.join(','))); // {0}はジョブ割当区分で制限されているため、取り込みできません。
		}
		if(!importCount){ // 取り込み対象なし
			ngmsg.push(teasp.message.getLabel('tm20001241')); // スケジュール取込の対象がありません。
			teasp.tsAlert(ngmsg.join('\n'), this);
			return;
		}else{
			alertMessage = ngmsg.join('\n');
		}
	}
	if(!validCount){
		teasp.tsAlert(teasp.message.getLabel('tm20001241'), this);
		return;
	}
	if(classifyJobWorks.assignTmps){
		if(!classifyJobWorks.assignJobs){
			classifyJobWorks.assignJobs = classifyJobWorks.assignTmps;
		}else{
			classifyJobWorks.assignJobs = classifyJobWorks.assignJobs.concat(classifyJobWorks.assignTmps);
		}
	}
	if(alertMessage){
		teasp.tsAlert(alertMessage, this, function(){
			this.callback(classifyJobWorks, true);
		});
	}else{
		this.callback(classifyJobWorks, true);
	}
};
