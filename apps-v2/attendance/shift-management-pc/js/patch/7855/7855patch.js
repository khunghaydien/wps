if(typeof(teasp) == 'object' && !teasp.resolved['7855'] && teasp.data && teasp.data.EmpDay){
teasp.data.EmpDay.prototype.getDayEvent = function(){
	var yqk = teasp.message.getLabel('tm10001360');
	var bufs = [];
	var va = this.day.rack.validApplys;
	var ep = (va.exchangeS || va.exchangeE);
	if(ep){
		bufs.push(teasp.message.getLabel(((va.exchangeS && va.exchangeE) ? 'tk10004390' : 'tm10001610')
				, teasp.util.date.formatDate((va.exchangeS ? va.exchangeS.exchangeDate : ep.originalStartDate), 'M/d')));
	}
	var buf = (this.day.event || '');
	if(buf.length > 0){
		bufs.push(buf);
	}
	if(this.day.plannedHoliday && (!this.day.event || this.day.event != yqk)){
		bufs.push(yqk);
	}
	var p = (va.patternS || va.patternL);
	if(p){
		bufs.push(teasp.message.getLabel('tm10001292', ((p.pattern && p.pattern.name) || '')));
	}
	if(va.patternD){
		bufs.push(teasp.message.getLabel('tm10001292', this.parent.getDisplayDayType(va.patternD.dayType)));
	}
	if(va.holidayAll){
		bufs.push(teasp.message.getLabel('tm10001291', ((va.holidayAll && va.holidayAll.holiday.name) || '')));
	}
	if(va.holidayAm){
		bufs.push(teasp.message.getLabel('tm10001291', ((va.holidayAm && va.holidayAm.holiday.name) || '')));
	}
	if(va.holidayPm && (!va.holidayAm || va.holidayAm.holiday.name != va.holidayPm.holiday.name)){
		bufs.push(teasp.message.getLabel('tm10001291', ((va.holidayPm && va.holidayPm.holiday.name) || '')));
	}
	var shl = this.getSummaryOfHourlyLeave();
	if(shl){
		bufs.push(shl);
	}
	if(va.kyushtu.length > 0){
		bufs.push(teasp.message.getLabel('tm10001390')
					+ ((this.day.deco.ct.st || this.day.deco.ct.et) ? '' : teasp.message.getLabel('tm10001620')));
	}
	if(va.zangyo.length > 0){
		bufs.push(teasp.message.getLabel('tm10001293'));
	}
	if(va.earlyStart.length > 0){
		bufs.push(teasp.message.getLabel('tm10001294'));
	}
	if(va.lateStart){
		bufs.push(teasp.message.getLabel('tk10001181', (!va.lateStart.treatDeduct ? '' : teasp.message.getLabel(va.lateStart.ownReason ? 'tk10001183' : 'tk10001184'))));
		if(this.day.real && this.day.real.latePlus){
			bufs.push(teasp.message.getLabel('tm10001420'));
		}
	}else if(this.day.real && this.day.real.lateTime > 0){
		bufs.push(teasp.message.getLabel('tm10001420'));
	}
	if(va.earlyEnd){
		bufs.push(teasp.message.getLabel('tk10001182', (!va.earlyEnd.treatDeduct ? '' : teasp.message.getLabel(va.earlyEnd.ownReason ? 'tk10001183' : 'tk10001184'))));
		if(this.day.real && this.day.real.earlyPlus){
			bufs.push(teasp.message.getLabel('tm10001430'));
		}
	}else if(this.day.real && this.day.real.earlyTime > 0){
		bufs.push(teasp.message.getLabel('tm10001430'));
	}
	if(va.dailyFix){
		bufs.push(teasp.message.getLabel('tm10001297'));
	}
	if(va.reviseTime.length > 0){
		bufs.push(teasp.message.getLabel('tm10001298'));
	}
	if(va.direct){
		var name = teasp.message.getLabel('tk10004650');
		if(va.direct.directFlag == 1){
			name = teasp.message.getLabel('tk10004760', teasp.message.getLabel('tk10004680'));
		}else if(va.direct.directFlag == 2){
			name = teasp.message.getLabel('tk10004760', teasp.message.getLabel('tk10004690'));
		}
		bufs.push(name);
	}
	return bufs.join(',');
};
}
