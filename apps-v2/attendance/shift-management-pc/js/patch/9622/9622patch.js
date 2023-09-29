if(typeof(teasp) == 'object' && !teasp.resolved['9622'] && teasp.dialog && teasp.dialog.EmpApply){
teasp.dialog.EmpApply.prototype.createTimeParts0 = teasp.dialog.EmpApply.prototype.createTimeParts;
teasp.dialog.EmpApply.prototype.createTimeParts = function(key, tbody, contId, obj, nocha, onchange){
	this.createTimeParts0(key, tbody, contId, obj, nocha, onchange);
	console.log('createTimeParts');
	if(key == 'holidayWork' && nocha){
		this.holidayWorkFix = {contId:contId};
	}
};
teasp.dialog.EmpApply.prototype.drawLast = function(applyObj, node){
	if(this.holidayWorkFix){
		var contId = this.holidayWorkFix.contId;
		var config = (this.pouch.dataObj && this.pouch.dataObj.config);
		
		if(config && config.workSystem == '1'){
			var inp1 = dojo.byId('dialogApplyStartTime' + contId);
			var inp2 = dojo.byId('dialogApplyEndTime'   + contId);
			if(inp1 && inp2){
				inp1.value = teasp.util.time.timeValue(config.flexStartTime);
				inp2.value = teasp.util.time.timeValue(config.flexEndTime);
			}
		}
	}
};
}
