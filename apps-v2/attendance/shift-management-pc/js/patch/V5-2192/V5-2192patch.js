if(typeof(teasp) == 'object' && !teasp.resolved['V5-2192'] && teasp.dialog && teasp.dialog.EmpApply){
teasp.dialog.EmpApply.prototype.checkReapplyable0 = teasp.dialog.EmpApply.prototype.checkReapplyable;
teasp.dialog.EmpApply.prototype.checkReapplyable = function(applyObj){
	var applyType = (applyObj ? applyObj.applyType : '');
	if(applyType == teasp.constant.APPLY_TYPE_PATTERNS
		|| applyType == teasp.constant.APPLY_TYPE_PATTERNL){
		if(this.pouch.isUseChangePattern()){
			if(this.patternSList.length <= 0 && this.patternLList.length <= 0 && !this.pouch.isChangeDayType()){
				return 0;
			}
			if(!this.pouch.isRegulateHoliday(this.args.date)
			&& this.dayWrap.isHoliday()
			&& !this.pouch.isChangeDayType()
			&& !this.pouch.isUseRegulateHoliday()){
				return 0;
			}
			if(this.dayWrap.isInterim()){
				return 0;
			}
			var pas = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNS);
			var pal = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNL);
			var pad = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERND);
			if(pas && pal && (pad || !this.pouch.isChangeDayType())){
				return 0;
			}
			if(pas){
				if(pas.pattern && this.patternLList.length <= 0){
					return 0;
				}
				return 1;
			}
			if(pal){
				if(pal.pattern && this.patternSList.length <= 0){
					return 0;
				}
				return 1;
			}
			return 1;
		}else{
			return -1;
		}
	}else{
		return this.checkReapplyable0(applyObj);
	}
};
}