if(typeof(teasp) == 'object' && !teasp.resolved['8878'] && teasp.data && teasp.data.EmpDay){
teasp.data.EmpDay.prototype.isMissingLateStartApply=function(){var e=this.getBorderTime(!0);if(e.st<0)return!1;var t=this.day.disc?this.day.disc.calcStartTime:null;
if("number"!=typeof t)return!1;if(!this.day.disc.lateTime)return!1;if(this.day.dayType!=teasp.constant.DAY_TYPE_NORMAL&&this.day.rack&&this.day.rack.validApplys&&this.day.rack.validApplys.kyushtu&&this.day.rack.validApplys.kyushtu.length&&!this.day.rack.validApplys.kyushtu[0].useRegulateHoliday)return!1;var a=this.getEmpApplyByKey(teasp.constant.APPLY_KEY_LATESTART),o=a&&a.endTime<this.day.disc.startTime?teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges([{
from:a.endTime,to:this.day.disc.startTime}],this.day.rack.paidRests)):0;return!a||o>0&&a.endTime<e.et};
teasp.data.EmpDay.prototype.isMissingEarlyEndApply=function(){var e=this.getBorderTime(!0);if(e.et<0)return!1;var t=this.day.disc?this.day.disc.calcEndTime:null;if("number"!=typeof t)return!1;if(!this.day.disc.earlyTime)return!1;if(this.day.dayType!=teasp.constant.DAY_TYPE_NORMAL&&this.day.rack&&this.day.rack.validApplys&&this.day.rack.validApplys.kyushtu&&this.day.rack.validApplys.kyushtu.length&&!this.day.rack.validApplys.kyushtu[0].useRegulateHoliday)return!1;
var a=this.getEmpApplyByKey(teasp.constant.APPLY_KEY_EARLYEND),o=a&&this.day.disc.endTime<a.startTime?teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges([{from:this.day.disc.endTime,to:a.startTime}],this.day.rack.paidRests)):0;return!a||o>0&&e.st<a.startTime};
}