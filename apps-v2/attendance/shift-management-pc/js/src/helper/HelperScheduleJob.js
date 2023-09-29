teasp.provide('teasp.helper.ScheduleJob');

/**
 * スケジュールの関連ジョブクラス
 *
 * @constructor
 * @param {string|null} id
 * @param {string|null} code
 * @param {Array.<{{sdt:{moment},edt:{moment}}}>} spans
 * @param {{
 *            minutes:{number}, // 時間
 *            inner:{boolean},  // 取込範囲ならtrue
 *            orgSdt:{moment}   // 行動の開始日時
 *        }} timeInfo
 * @param {boolean} isAllDayEvent
 * @param {boolean=} txflag
 */
teasp.helper.ScheduleJob = function(id, code, spans, timeInfo, isAllDayEvent, txflag){
	this.id = id;
	this.code = code;
	this.spans = spans;
	this.minutes = timeInfo.minutes;
	this.inner = timeInfo.inner;
	this.orgSdt = timeInfo.orgSdt;
	this.isAllDayEvent = isAllDayEvent;
	this.txflag = txflag;
};

teasp.helper.ScheduleJob.prototype.getId = function(){ return this.id; };
teasp.helper.ScheduleJob.prototype.getCode = function(){ return this.code; };
teasp.helper.ScheduleJob.prototype.getSpans = function(){ return this.spans; };
teasp.helper.ScheduleJob.prototype.getMinutes = function(){ return this.minutes; };
teasp.helper.ScheduleJob.prototype.getInner = function(){ return this.inner; };
teasp.helper.ScheduleJob.prototype.getOrgSdt = function(){ return this.orgSdt; };
teasp.helper.ScheduleJob.prototype.isAllDayEvent = function(){ return this.isAllDayEvent; };

/**
 * オブジェクトとして返す
 * @returns {{
 *   id:{string},
 *   code:{string},
 *   spans:{Array.<{{sdt:{moment},edt:{moment}}}>},
 *   minutes:{number},
 *   inner:{boolean},
 *   orgSdt:{moment},
 *   isAllDayEvent:{boolean},
 *   txflag:{boolean}
 * }}
 */
teasp.helper.ScheduleJob.prototype.getObj = function(){
	return {
		id            : this.id,
		code          : this.code,
		spans         : this.spans,
		minutes       : this.minutes,
		inner         : this.inner,
		orgSdt        : this.orgSdt,
		isAllDayEvent : this.isAllDayEvent,
		txflag        : this.txflag
	};
};

/**
 * 情報を追加
 * @param {Array.<Object>} spans 時間帯
 * @param {number} minutes 時間
 * @param {boolean} isAllDayEvent 終日の行動
 */
teasp.helper.ScheduleJob.prototype.add = function(spans, timeInfo, isAllDayEvent){
	this.spans = this.spans.concat(spans).sort(function(a, b){
		var sn = a.sdt.toDate().getTime() - b.sdt.toDate().getTime();
		if(!sn){
			return a.edt.toDate().getTime() - b.edt.toDate().getTime();
		}
		return sn;
	});
	this.minutes += timeInfo.minutes;
	if(timeInfo.inner){
		this.inner = timeInfo.inner;
	}
	if(timeInfo.orgSdt.isBefore(this.orgSdt)){
		this.orgSdt = timeInfo.orgSdt;
	}
	if(isAllDayEvent){
		this.isAllDayEvent = true;
	}
};

/**
 * 引数のjobsの情報からジョブコードまたはジョブIDを補完
 * @param {Array.<Object>} jobs
 * @returns {teasp.helper.ScheduleJob}
 */
teasp.helper.ScheduleJob.prototype.supplement = function(jobs){
	for(var i = 0 ; i < jobs.length ; i++){
		var job = jobs[i];
		if(this.id){
			if(this.id == job.jobId){
				this.code = job.jobCode;
				break;
			}
		}else{
			if(this.code == job.jobCode){
				this.id = job.jobId;
				break;
			}
		}
	}
	return this;
};
