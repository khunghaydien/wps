if(typeof(teasp) == 'object' && teasp.logic && teasp.logic.EmpTime){
teasp.logic.EmpTime.prototype.decorateEmpDays=function(e,t,a,o){var s=o.dlst,i=teasp.data.Pouch.getDaiqZan(this.pouch.getStocks(),s[s.length-1],s[0],s[s.length-1],this.pouch.isOldDate()),n=this.pouch.isInputAccessControl();this.pouch.clearDiverges();for(var r=0,l=0;l<s.length;l++){var p=s[l],d=a[p];if(d){t.workSystem==teasp.constant.WORK_SYSTEM_MANAGER&&d.real&&(d.real.lateTime=0,
d.real.lateLostTime=0,d.real.earlyTime=0,d.real.earlyLostTime=0,d.real.privateInnerTime=0,d.real.privateInnerLostTime=0),this.decorateEmpDay(e,t,d),r+=this.getDaiqCount(d);var c=this.getStockCount(d);if(c)for(var m in c)if(c.hasOwnProperty(m)){var h=teasp.data.Pouch.getStockZan(this.pouch.getStocks(),m,p);h.zan<0&&this.pouch.setStockLack(m,c[m],h.zan)}if(n&&o.startDate<=p&&p<=o.endDate){var u=this.pouch.getEmpDay(p);u.isDivergeNoReason()&&this.pouch.setDiverges({
date:p})}}}this.pouch.setDaiqLack(i.overSpend<0&&r>0)};
}