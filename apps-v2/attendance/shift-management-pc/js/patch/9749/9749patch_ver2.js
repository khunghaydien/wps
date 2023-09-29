if(typeof(teasp) == 'object' && !teasp.resolved['DENTSU2'] && teasp.dialog && teasp.dialog.EmpApply){
teasp.dialog.EmpApply.prototype.checkPluginHolidayApply = function(contId, req, o, spend, manad){
	if(!spend.days){ // 日数がない＝時間単位有休である
		var yqs = this.pouch.getObj().yuqRemains;
		var firstYq = null;
		for(var i = 0 ; i < yqs.length ; i++){
			var yq = yqs[i];
			if(yq.remainDays || yq.remainTime){ // 残あり
				firstYq = yq;
				break;
			}
		}
		if(firstYq && firstYq.remainDays == 0.5 && !firstYq.remainTime){ // 残日数＝0.5日
			teasp.dialog.EmpApply.showError(contId, '残日数が不足しているため、時間単位休ではなく、半日休を申請してください。');
			return false;
		}
		var day = this.pouch.getObj().days[req.apply.startDate];
		if(day && day.rack && day.rack.fixTime <= spend.minutes){
			teasp.dialog.EmpApply.showError(contId, '1日の所定労働時間を超える時間単位休は申請できません。');
			return false;
		}
	}
	return true;
};
}