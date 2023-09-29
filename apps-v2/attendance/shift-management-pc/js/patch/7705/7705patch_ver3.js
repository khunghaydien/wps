if(typeof(teasp) == 'object' && !teasp.resolved['7705'] && teasp.view && teasp.view.EmpWorks){
teasp.view.EmpWorks.prototype.openExpApply = function(){
	var jobYmObj = this.pouch.getJobApply();
	var warning = null;
	var dlst = teasp.util.date.getDateList(jobYmObj.startDate, jobYmObj.endDate);
	var l = [];
	var mp = {};
	for(var i = 0 ; i < dlst.length ; i++){
		var dkey = dlst[i];
		var month = this.pouch.getEmpMonthByDate(dkey);
		if(mp[month.yearMonth]){
			continue;
		}
		mp[month.yearMonth] = 1;
		if(((month.config.useDailyApply && month.config.checkWorkingTime) || month.config.checkWorkingTimeMonthly)
		&& !teasp.constant.STATUS_FIX.contains(month.apply.status)){
			var y = Math.floor(month.yearMonth / 100);
			var m = month.yearMonth % 100;
			var sn = month.subNo;
			l.push(teasp.util.date.formatMonth('zv00000020', y, m, sn)); // yyyy年MM月度
		}
	}
	var addmsg = '';
	if(l.length > 0){
		if(!this.checkPreApplyMonthly(dlst)){
			return;
		}
		addmsg = '<br/><span style="font-size:90%;">（'
				+ teasp.util.date.formatDate(jobYmObj.startDate, 'M/d')
				+ '～'
				+ teasp.util.date.formatDate(jobYmObj.endDate, 'M/d')
				+ ' の勤怠は更新できなくなります。ご注意ください）</span>';
	}
	var innerOpenExpApply = dojo.hitch(this, function(){
		var req = {
			title      : teasp.message.getLabel('tm40001060'),
			buttonType : (this.pouch.isUseJobWorkFlow() ? 0 : 1),
			descript   : '',
			applyKey   : teasp.constant.APPLY_KEY_JOBAPPLY,
			warning    : warning
		};
		if(this.pouch.isUseJobWorkFlow()){
			req.descript = teasp.message.getLabel('tm40001070', this.pouch.getJobYearMonthJp());
		}else{
			req.descript = teasp.message.getLabel('tm40001080', this.pouch.getJobYearMonthJp());
		}
		req.descript += addmsg;
		teasp.manager.dialogOpen(
			'ApplyComment',
			req,
			this.pouch,
			this,
			function(obj){
				teasp.manager.request(
					'submitJobApply',
					{
						empId     : this.pouch.getEmpId(),
						month     : this.pouch.getJobYearMonth(),
						startDate : this.pouch.getJobStartDate(),
						comment   : obj.comment
					},
					this.pouch,
					{ hideBusy : false },
					this,
					function(){
						this.refreshMonthly();
					},
					function(event){
						teasp.message.alertError(event);
					}
				);
			}
		);
	});
	var works = this.pouch.getWorks() || [];
	if(!works.length){
		teasp.tsConfirmA(teasp.message.getLabel('tf10008160', // 工数実績が入力されていません。{0}してよろしいですか？
			(this.pouch.isUseJobWorkFlow() ? teasp.message.getLabel('applyx_btn_title') : teasp.message.getLabel('fix_btn_title')) // 承認申請 or 確定
		), this, function(){
			innerOpenExpApply();
		});
	}else{
		innerOpenExpApply();
	}
};
teasp.view.EmpWorks.prototype.checkPreApplyMonthly = function(dlst){
	console.log('EmpWorks checkPreApplyMonthly()');
	var wtitle = teasp.message.getLabel('tm10001060'); // ＊＊＊＊＊＊ 申請できません ＊＊＊＊＊＊
	var dataObj = this.pouch.dataObj;
	var allWorks = this.pouch.getWorks();
	var dwMap = {};
	var map = {};
	var noapprove = [];
	var noentered = [];
	var nokintai = [];
	var nomatch = [];
	var noDailyFixed = [];
	var beginDate = '2018-12-16'; // ★全社員この日から勤怠を入力
	if(dataObj.targetEmp.entryDate && beginDate < dataObj.targetEmp.entryDate){
		beginDate = dataObj.targetEmp.entryDate;
	}
	var mm = -1;
	for(var i = 0 ; i < dlst.length ; i++){
		var dkey = dlst[i];
		if(dkey < beginDate || (dataObj.targetEmp.endDate && dataObj.targetEmp.endDate < dkey)){
			continue;
		}
		var day = dataObj.days[dkey];
		dwMap[dkey] = { time: 0, works: [], timeFixTime: 0 };
		var dayWork = dwMap[dkey];
		for(var j = 0 ; j < allWorks.length ; j++){
			var work = allWorks[j];
			if(work.date == dkey
			&& (work.time > 0
			|| work.volume > 0
			|| ((work.taskNote || '') != '')
			|| ((work.progress || '') != '')
			|| ((work.extraItem1 || '') != '')
			|| ((work.extraItem2 || '') != '')
			)){
				dayWork.works.push(work);
				dayWork.time += work.time;
				if(work.timeFix){
					dayWork.timeFixTime += work.time;
				}
				var process = (!work.process)? '' : work.process;
				var mKey = work.jobId+':'+process;
				var wt = map[mKey];
				if(!wt){
					wt = map[mKey] = { jobName: work.job.name, time: 0, process:work.process, jobLeaderId: work.job.jobLeaderId };
				}
				wt.time += work.time;
			}
		}
		// 勤怠日次申請はすべて承認済みか
		var waiting = (day.rack.validApplys && day.rack.validApplys.waiting) || [];
		if(waiting.length){
			noapprove.push(dkey);
		}
		// 勤怠時刻修正申請は反映されているか
		var va = day.rack.validApplys || {};
		var ra = va.reviseTime || [];
		for(var j = 0 ; j < ra.length ; j++){
			var a = ra[j];
			if(teasp.constant.STATUS_APPROVES.indexOf(a.status) >= 0 && !a.entered){
				noentered.push(dkey);
			}
		}
		// 休日出勤申請はあるか
		var ka = (va.kyushtu && va.kyushtu.length ? va.kyushtu[0] : null); // 休日出勤申請
		// 勤怠と工数のチェック
		var kintain = (typeof(day.startTime) == 'number' && typeof(day.endTime) == 'number'); // 勤怠入力済みか
		var wrt = (dataObj.workNotes[dkey] ? (dataObj.workNotes[dkey].workNetTime || 0) : 0); // 実労働時間
		if(!day.dayType){ // 平日
			if((day.rack.holidayJoin && day.rack.holidayJoin.flag == 3) // 終日休
			|| (day.plannedHoliday && !ka)){ // 有休計画付与日で休日出勤申請がない
				if(dayWork.time > 0){
					nomatch.push(dkey);
				}
			}else if(!kintain && !day.dbDayType){ // 勤怠未入力（dbDayType==0 なら間違いなく平日）
				nokintai.push(dkey);
			}else if(dayWork.time != wrt){
				nomatch.push(dkey);
			}
		}else if(day.dayType){ // 休日
			if(!ka && dayWork.time > 0){
				nomatch.push(dkey);
			}
		}
		// 日次確定チェック
		if(day.rack.inputable && !day.rack.validApplys.dailyFix){
			var d = teasp.util.date.parseDate(dkey);
			var m = (d.getMonth() + 1);
			noDailyFixed.push(m == mm ? d.getDate() : m + '/' + d.getDate());
			mm = m;
		}
	}
	var msgs = [];
	if(noapprove.length){
		msgs.push(teasp.message.getLabel('tm10001080').replace(/^\n/, '') // 承認待ちの申請あるいは却下を承諾していない申請があります。
		+ '\n(' + teasp.view.EmpWorks.sliceDates(noapprove) + ')');
	}
	if(noentered.length){
		msgs.push('勤怠時刻修正申請が反映されていません（勤務表を開くと反映されます）。'
		+ '\n(' + teasp.view.EmpWorks.sliceDates(noentered) + ')');
	}
	if(nokintai.length){
		msgs.push('勤怠が入力されていない日があります。\n(' + teasp.view.EmpWorks.sliceDates(nokintai) + ')');
	}
	if(nomatch.length){
		msgs.push('工数の合計と実労働時間が合いません。\n(' + teasp.view.EmpWorks.sliceDates(nomatch) + ')');
	}
	if(msgs.length){
		teasp.tsAlert(wtitle + '\n' + msgs.join('\n'), this);
		return false;
	}
	if(this.pouch.isCheckDailyFixLeak() && noDailyFixed.length > 0){
		teasp.tsAlert(wtitle + '\n' + teasp.message.getLabel('tm10001710', noDailyFixed.join(',')), this);
		return false;
	}
	return true;
};
teasp.view.EmpWorks.sliceDates = function(dates){
	var n = (dates || []).length;
	if(n > 5){
		dates.splice(5, dates.length);
	}
	return dates.join(', ').replace(/-/g, '/') + (n > 5 ? ', ..' : '');
};
teasp.dialog.InputTime.prototype.isReadOnly0 = teasp.dialog.InputTime.prototype.isReadOnly;
teasp.dialog.InputTime.prototype.isReadOnly = function(inpTarget){
	if(this.pouch.isJobMonthFixedByDate(this.args.date)){
		return true;
	}
	return this.isReadOnly0(inpTarget);
};
teasp.dialog.EmpApply.prototype.isReadOnly = function(flag){
	if(this.pouch.isJobMonthFixedByDate(this.args.date)){
		return true;
	}
	return (this.monthFix || this.dayFix || this.pouch.isReadOnly() || (!flag && !this.applyable));
};
teasp.dialog.EmpApply.prototype.drawLast = function(applyObj, node){
	if(this.pouch.isJobMonthFixedByDate(this.args.date)){
		dojo.query('button.red-button1', dojo.byId('empApplyTab')).forEach(function(el){
			dojo.style(el, 'display', 'none');
		});
	}
};
}
