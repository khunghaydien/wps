if(typeof(teasp) == 'object' && (!teasp.resolved || !teasp.resolved['7677']) && teasp.view && teasp.view.Monthly){
teasp.view.Monthly.prototype.openWorkBalance = function(_date){
	var date = _date;
	return dojo.hitch(this, function(e){
		e.preventDefault();
		e.stopPropagation();
		var classifyJobWorks = this.pouch.getClassifyJobWorks(date);
		var dayWrap 		 = this.pouch.getEmpDay(date);
		var jm				 = this.pouch.getJobMonthByDate(date);
		var zanteiFlag = false;
		var workRealTime = dayWrap.getDaySubTimeByKey('workRealTime', true, 0, 0, teasp.constant.C_REAL);
		if(!workRealTime){
			var t = dayWrap.getZanteiRealTime(teasp.util.date.getToday());
			if(t){
				zanteiFlag = true;
				workRealTime = t;
			}
		}
		var lastModifiedDate = this.pouch.getLastModifiedDate();
		teasp.manager.dialogOpen(
			'WorkBalance',
			{
				date			  : date,
				jobMonth		  : jm,
				workRealTime	  : workRealTime,
				worked			  : dayWrap.isWorked(),
				workNote		  : dayWrap.getWorkNote(),
				zanteiFlag		  : zanteiFlag,
				classifyJobWorks  : dojo.clone(classifyJobWorks),
				reflectWorkOption : null,
				monthFix		  : this.pouch.isEmpMonthFixed(),
				dayFix			  : dayWrap.isDailyFix(),
				client			  : teasp.constant.APPLY_CLIENT_MONTHLY
			},
			this.pouch,
			this,
			function(newClassifyJobWorks, workNote, flag){
				if(!flag){
					if(lastModifiedDate != this.pouch.getLastModifiedDate()){
console.log(lastModifiedDate + ' != ' + this.pouch.getLastModifiedDate());
						this.changeMonth(this.pouch.dataObj.month);
					}else{
console.log(lastModifiedDate + ' == ' + this.pouch.getLastModifiedDate());
						this.refreshMonthly();
					}
				}
			}
		);
	});
};
teasp.view.Daily.prototype.openEmpWorkDialog = function(classifyJobWorks, scheduleImport){
	var date = this.pouch.getParamDate();
	var dayWrap = this.pouch.getEmpDay(date);
	var workRealTime = dayWrap.getDaySubTimeByKey('workRealTime', true, 0, 0, teasp.constant.C_REAL);
	var workNote = dayWrap.getWorkNote();
	var zanteiFlag = false;
	if(!workRealTime){
		var t = dayWrap.getZanteiRealTime(teasp.util.date.getToday());
		if(t){
			zanteiFlag = true;
			workRealTime = t;
		}
	}
	var lastModifiedDate = this.pouch.getLastModifiedDate();
	teasp.manager.dialogOpen(
		'WorkBalance',
		{
			date			  : date,
			jobMonth		  : this.pouch.getJobYearMonth(),
			classifyJobWorks  : dojo.clone(classifyJobWorks),
			workRealTime	  : workRealTime,
			worked			  : dayWrap.isWorked(),
			workNote		  : workNote,
			zanteiFlag		  : zanteiFlag,
			reflectWorkOption : this.reflectWorkOption,
			thisObject		  : this,
			monthFix		  : dayWrap.isMonthFix(),
			dayFix			  : dayWrap.isDailyFix(),
			client			  : teasp.constant.APPLY_CLIENT_DAILY,
			scheduleImport	  : scheduleImport || false,
			reflectJobAssign  : dojo.hitch(this, this.reflectTsfJobAssign)
		},
		this.pouch,
		this,
		function(newClassifyJobWorks, workNote, flag){
			if(lastModifiedDate != this.pouch.getLastModifiedDate()){
console.log(lastModifiedDate + ' != ' + this.pouch.getLastModifiedDate());
console.log(this.pouch.getParamDate());
				this.changeDate(this.pouch.getParamDate(), true);
			}else{
console.log(lastModifiedDate + ' == ' + this.pouch.getLastModifiedDate());
				var classifyJobWorks = this.pouch.getClassifyJobWorks(date);
				this.reflectTsfJobAssign(classifyJobWorks);
				this.jobWorks = this.pouch.getJobWorks(classifyJobWorks);
				if(!flag){
					dojo.byId('empWorkNote').value = workNote;
				}
				this.showWorkBalance();
			}
		}
	);
};
teasp.view.Daily.prototype.changeDate = function(d, flag){
	var dkey = this.pouch.getParamDate();
	if(!flag && teasp.util.date.compareDate(d, dkey) == 0){
		return false;
	}
	dojo.style('commentArea', 'height', '0px');
	dojo.style('timeReportContents', 'margin-top', '0px');

	document.body.style.cursor = 'wait';

	teasp.manager.request(
		'transEmpDay',
		{
			empId  : this.pouch.getEmpId(),
			date   : teasp.util.date.formatDate(d)
		},
		this.pouch,
		{ hideBusy : false },
		this,
		function(){
			this.refreshDaily(true);
			document.body.style.cursor = 'default';
		},
		function(event){
			document.body.style.cursor = 'default';
			teasp.message.alertError(event);
		}
	);
	return false;
};
}
