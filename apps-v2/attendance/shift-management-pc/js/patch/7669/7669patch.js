if(typeof(teasp) == 'object' && !teasp.resolved['7669'] && teasp.dialog && teasp.dialog.WorkBalance){
teasp.dialog.WorkBalance.prototype.isReadOnly = function(){
    var chkWrk = (this.pouch.isCheckWorkingTime2() || this.pouch.isCheckWorkingTimeMonthly());
    return (this.pouch.isJobMonthFixedByDate(this.args.date)
         || this.pouch.isJobMonthReadOnly()
         || (chkWrk && this.args.monthFix)
         || (chkWrk && this.args.dayFix)
         || (this.notApprove && !this.notApprove.inputable));
};
teasp.dialog.WorkBalance.prototype.setTopRightMessage = function(){
    var chkWrk = (this.pouch.isCheckWorkingTime2() || this.pouch.isCheckWorkingTimeMonthly());
    if(this.pouch.isJobMonthFixedByDate(this.args.date)){
        dojo.byId('empWorkLockMsg').innerHTML = teasp.message.getLabel('tm20002070'); // ※月次工数実績確定済みのため変更不可
    }else if(chkWrk && this.args.monthFix){
        dojo.byId('empWorkLockMsg').innerHTML = teasp.message.getLabel('tm20002090'); // ※勤怠月次確定済みのため変更不可
    }else if(chkWrk && this.args.dayFix){
        dojo.byId('empWorkLockMsg').innerHTML = teasp.message.getLabel('tm20002080'); // ※勤怠日次確定済みのため変更不可
    }else if(this.notApprove && !this.notApprove.inputable){
        dojo.byId('empWorkLockMsg').innerHTML = teasp.message.getLabel('tk10001152', this.notApprove.applyName); // {0} が未承認のため入力できません
    }else{
        dojo.byId('empWorkLockMsg').innerHTML = '';
    }
};
teasp.data.Pouch.prototype.isCheckWorkingTime2 = function(){
    return (this.isUseDailyApply() && this.getObj().config.checkWorkingTime);
};
teasp.data.Pouch.prototype.isCheckWorkingTime = function(){
    return true;
};
}
