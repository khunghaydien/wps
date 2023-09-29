if(typeof(teasp) == 'object' && !teasp.resolved['V5-3293'] && teasp.dialog && teasp.dialog.InputTime){
teasp.dialog.InputTime.prototype.isReadOnly = function(inpTarget){
	if(this.pouch.isEmpMonthReadOnly() || this.dayWrap.isDailyFix()){
		return true;
	}
	if(this.pouch.isUseReviseTimeApply() || !this.pouch.isUpdater()){
		if(inpTarget == this.IO_AREA || inpTarget == this.REST_AREA){
			return true;
		}else{
			const empty = (typeof(this.dayWrap.getObj().startTime) != 'number' && typeof(this.dayWrap.getObj().endTime) != 'number');
			if(inpTarget == this.OUT_AREA){
				return empty;
			}
			const existAwayTime = (!empty && this.dayWrap.getAwayTimes().length >  0);
			return ((empty || (!existAwayTime && this.pouch.isHideAwayTimeInputField()))
				&& !this.pouch.isUseWorkLocation()
				&& !this.pouch.isInputAccessControl(true));
		}
	}
	return false;
};
}
