teasp.provide('teasp.helper.ScheduleJobs');

/**
 * スケジュールの関連ジョブ収集クラス
 *
 * @constructor
 */
teasp.helper.ScheduleJobs = function(){
	this.idMap = {};
	this.codeMap = {};
};

/**
 * ジョブIDかジョブコードのどちらかで取得
 * @param {string|null} id
 * @param {string|null} code
 * @returns {teasp.helper.ScheduleJob}
 */
teasp.helper.ScheduleJobs.prototype.get = function(id, code){
	if(id){
		return this.idMap[id];
	}else{
		return this.codeMap[code];
	}
};

/**
 * ジョブIDかジョブコードのどちらかのマップにセット
 * @param {string|null} id
 * @param {string|null} code
 * @param {teasp.helper.ScheduleJob} job
 */
teasp.helper.ScheduleJobs.prototype.set = function(id, code, job){
	if(id){
		this.idMap[id] = job;
	}else{
		this.codeMap[code] = job;
	}
};

/**
 * 関連ジョブを追加
 * @param {string|null} id ジョブID
 * @param {string|null} code ジョブコード
 * @param {Array.<Object>} spans 時間帯
 * @param {{
 *            minutes:{number}, // 時間
 *            inner:{boolean},  // 取込範囲ならtrue
 *            orgSdt:{moment}   // 行動の開始日時
 *        }} timeInfo
 * @param {boolean} isAllDayEvent 終日の行動
 * @param {boolean=} txflag TxsLogの関連ジョブ
 */
teasp.helper.ScheduleJobs.prototype.add = function(id, code, spans, timeInfo, isAllDayEvent, txflag){
	var job = this.get(id, code);
	if(!job){
		this.set(id, code, new teasp.helper.ScheduleJob(id, code, spans, timeInfo, isAllDayEvent, txflag));
	}else{
		job.add(spans, timeInfo, isAllDayEvent);
	}
};

/**
 * ジョブIDの配列を返す
 * @returns {Array.<string>}
 */
teasp.helper.ScheduleJobs.prototype.getJobIds = function(){
	var lst = [];
	for(var id in this.idMap){
		lst.push(id);
	}
	return lst;
};

/**
 * ジョブコードの配列を返す
 * @returns {Array.<string>}
 */
teasp.helper.ScheduleJobs.prototype.getJobCodes = function(){
	var lst = [];
	for(var code in this.codeMap){
		lst.push(code);
	}
	return lst;
};

/**
 * ジョブコードをキーとしてマップオブジェクトを生成
 * 同じジョブコードはマージする
 * @param {Object} map
 * @param {teasp.helper.ScheduleJob} job
 */
teasp.helper.ScheduleJobs.prototype.mapByCode = function(map, job){
	var o = map[job.getCode()];
	if(!o){
		map[job.getCode()] = job;
	}else{
		o.add(job.getSpans(), {minutes:job.getMinutes(), inner:job.getInner()}, job.isAllDayEvent());
	}
};

/**
 * すべてのジョブ情報のオブジェクトの配列を返す
 * @param {Array.<Object>} jobs
 * @returns {Array}
 */
teasp.helper.ScheduleJobs.prototype.getJobCodeList = function(jobs){
	var map = {};
	for(var id in this.idMap){
		this.mapByCode(map, this.idMap[id].supplement(jobs));
	}
	for(var code in this.codeMap){
		this.mapByCode(map, this.codeMap[code].supplement(jobs));
	}
	var lst = [];
	for(var code in map){
		lst.push(map[code].getObj());
	}
	// 時間順にソート
	lst = lst.sort(function(a, b){
		var sn = 0;
		if(a.spans[0].sdt.isSame(b.spans[0].sdt)){
			sn = a.orgSdt.toDate().getTime() - b.orgSdt.toDate().getTime();
		}else{
			sn = a.spans[0].sdt.toDate().getTime() - b.spans[0].sdt.toDate().getTime();
		}
		if(!sn){
			return a.spans[0].edt.toDate().getTime() - b.spans[0].edt.toDate().getTime();
		}
		return sn;
	});
	return lst;
};
