if(typeof(teasp) == 'object' && !teasp.resolved['MBJS'] && teasp.logic && teasp.logic.EmpTime){
teasp.logic.EmpTime.prototype.calculateEmpDays=function(e,t,a,o,s,i){for(var n={},r=0;r<o.length;r++){var l=o[r],p=t[l];if(p&&this.pouch.isAlive(l)){
var d=this.getMonthByDate(e,l),c=s[d.monthEx],m=d.config;if(i!=teasp.constant.C_FREAL&&i!=teasp.constant.C_FDISC||m.workSystem==teasp.constant.WORK_SYSTEM_FLEX){c.dbWorkLegalVal+=(p.workLegalTime||0)+(p.workLegalOverTime||0)-(p.workChargeTime||0),n.period&&n.period!=c&&!d.resetFlag&&(m.workSystem==teasp.constant.WORK_SYSTEM_FIX&&m.workSystem==n.config.workSystem?n.config.defaultPattern.useDiscretionary||m.defaultPattern.useDiscretionary?c.workLegalTime=n.period.dbWorkLegalVal:c.workLegalTime=n.period.workLegalTime:m.workSystem==teasp.constant.WORK_SYSTEM_MUTATE&&(m.workSystem!=n.config.workSystem?c.workLegalTime=0:c.workLegalTime=n.period.workLegalTime)),
c.presetMonth.hasOwnProperty(l)&&(c.workTime=0,c.workLegalTime=c.presetMonth[l]),c.presetWeek.hasOwnProperty(p.rack.weekOfDay)&&(c.workLegalTime=c.presetWeek[p.rack.weekOfDay]),m.workSystem==teasp.constant.WORK_SYSTEM_FIX&&p.preWorkLegalTimeOfWeek>0?c.workLegalTime=p.preWorkLegalTimeOfWeek:m.workSystem==teasp.constant.WORK_SYSTEM_MUTATE&&p.preWorkLegalTimeOfMonth>0&&(c.workLegalTime=p.preWorkLegalTimeOfMonth),p.period=dojo.clone(c),
this.calculateEmpDay(p,c,m,a,i),n.period=c,n.config=m;var h=this.pouch.getEmpDay(p.date);h.isExchangedEdge()&&(p[i].lateTime=0,p[i].earlyTime=0,p[i].privateInnerTime=0,p[i].lateLostTime=0,p[i].earlyLostTime=0,p[i].privateInnerLostTime=0)}}}};
teasp.logic.EmpTime.prototype.recalcEmpDay=function(e){var t=this.pouch.getObj(),a=t.common,o=t.config,s=t.months,i=t.days,n=t.applys,r=this.getApplyDateMap(n),l=[];for(var p in i)l.push(p);l=l.sort(function(e,t){return e<t?-1:1});var d=this.mergeEmpDay(i,e,r[e]||[],l,o),c=this.getPeriodMap(s),m=this.getMonthByDate(s,e);
o=m.config;var h=c[m.monthEx];d.period=dojo.clone(h),this.calculateEmpDay(d,h,o,a,teasp.constant.C_REAL),this.calculateEmpDay(d,h,o,a,teasp.constant.C_DISC);var u=this.pouch.getEmpDay(d.date);u.isExchangedEdge()&&(d[teasp.constant.C_REAL].lateTime=d[teasp.constant.C_DISC].lateTime=0,d[teasp.constant.C_REAL].earlyTime=d[teasp.constant.C_DISC].earlyTime=0,d[teasp.constant.C_REAL].privateInnerTime=d[teasp.constant.C_DISC].privateInnerTime=0,
d[teasp.constant.C_REAL].lateLostTime=d[teasp.constant.C_DISC].lateLostTime=0,d[teasp.constant.C_REAL].earlyLostTime=d[teasp.constant.C_DISC].earlyLostTime=0,d[teasp.constant.C_REAL].privateInnerLostTime=d[teasp.constant.C_DISC].privateInnerLostTime=0)};
teasp.data.EmpDay.prototype.isMissingLateStartApply=function(){var e=this.getBorderTime(!0);if(e.st<0)return!1;var t=this.day.disc?this.day.disc.calcStartTime:null;
if("number"!=typeof t)return!1;if(this.day.disc&&!this.day.disc.lateTime)return!1;if(t<=e.st)return!1;if(this.day.dayType!=teasp.constant.DAY_TYPE_NORMAL&&this.day.rack&&this.day.rack.validApplys&&this.day.rack.validApplys.kyushtu&&this.day.rack.validApplys.kyushtu.length&&!this.day.rack.validApplys.kyushtu[0].useRegulateHoliday)return!1;var a=this.getEmpApplyByKey(teasp.constant.APPLY_KEY_LATESTART),o=a&&a.endTime<this.day.disc.startTime?teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges([{
from:a.endTime,to:this.day.disc.startTime}],this.day.rack.paidRests)):0;return!a||o>0&&a.endTime<e.et};
teasp.data.EmpDay.prototype.isMissingEarlyEndApply=function(){var e=this.getBorderTime(!0);if(e.et<0)return!1;var t=this.day.disc?this.day.disc.calcEndTime:null;if("number"!=typeof t)return!1;if(this.day.disc&&!this.day.disc.earlyTime)return!1;if(e.et<=t)return!1;if(this.day.dayType!=teasp.constant.DAY_TYPE_NORMAL&&this.day.rack&&this.day.rack.validApplys&&this.day.rack.validApplys.kyushtu&&this.day.rack.validApplys.kyushtu.length&&!this.day.rack.validApplys.kyushtu[0].useRegulateHoliday)return!1;
var a=this.getEmpApplyByKey(teasp.constant.APPLY_KEY_EARLYEND),o=a&&this.day.disc.endTime<a.startTime?teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges([{from:this.day.disc.endTime,to:a.startTime}],this.day.rack.paidRests)):0;return!a||o>0&&e.st<a.startTime};
}
