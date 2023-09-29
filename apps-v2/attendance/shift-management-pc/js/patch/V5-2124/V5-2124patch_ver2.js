if(typeof(teasp) == 'object' && !teasp.resolved['V5-2124'] && teasp.view && teasp.view.Monthly){
// ※注意：この内容には V5-1023 を含む。このパッチをあてる時V5-1023のパッチを削除すること。
teasp.view.Monthly.prototype.applyMonthly0 = teasp.view.Monthly.prototype.applyMonthly;
teasp.view.Monthly.prototype.applyMonthly = function(){
	this.Mcd_PublicHoliday_Mismatch = null; // 公休数チェック用変数初期化
	if(this.getMcdMonthId()){
		// 公休数チェック
		this.fetchV5_2124(dojo.hitch(this, function(success, month){
			if(!success){
				teasp.tsAlert('月次データの読み込みに失敗しました。', true);
			}else{
				if(month && month.EmpId__r.CompanyCode__c == '000000'){
					const publicHolidayNum = month.Mcd_PublicHolidayNum__c || 0; // 必要公休日数
					const holidayCount	   = month.Mcd_HolidayCount__c || 0; // 公休日
					if(publicHolidayNum != holidayCount){
						this.Mcd_PublicHoliday_Mismatch
							= teasp.message.format('必要な公休日数と一致していません。公休日数は {0} 日にする必要があります。', publicHolidayNum);
					}
				}
				setTimeout(dojo.hitch(this, this.applyMonthly0), 100);
			}
		}));
	}else{
		this.applyMonthly0();
	}
};
teasp.view.Monthly.prototype.checkPreApplyMonthly0 = teasp.view.Monthly.prototype.checkPreApplyMonthly;
teasp.view.Monthly.prototype.checkPreApplyMonthly = function(callback){
	this.checkPreApplyMonthly0(dojo.hitch(this, function(){
		if(this.checkV5_1023()
		&& this.checkV5_2124()){
			callback();
		}
	}));
};
teasp.view.Monthly.prototype.checkV5_1023 = function(){
	const config = this.pouch.getObj().config;
	const OVER_MAX = 30;
	const overs = [];
	if(config.workSystem == teasp.constant.WORK_SYSTEM_FIX // 固定
	|| config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE){ // 変形
		var dlst = this.pouch.getMonthDateList();
		for(var r = 0 ; r < dlst.length ; r++){
			var d = dlst[r];
			var dayWrap = this.pouch.getEmpDay(d);
			if(dayWrap.isHoliday() // 非勤務日
			|| dayWrap.isExistApply(teasp.constant.APPLY_KEY_ZANGYO) // 残業申請がある
			|| !dayWrap.getObj().disc){
				continue;
			}
			var st = dayWrap.getPattern().standardFixTime; // 所定労働時間
			var wt = dayWrap.getObj().disc.workRealTime;   // 実労働時間
			if(wt > (st + OVER_MAX)){
				overs.push(d);
			}
		}
	}
	if(overs.length){
		var msg = teasp.message.getLabel('tf10008730' // {0} {1}してください
				, teasp.util.date.joinEx(overs)
				, teasp.message.getLabel('tm10001293')); // 残業申請
		var wtitle = teasp.message.getLabel('tm10001060'); // ＊＊＊＊＊＊ 申請できません ＊＊＊＊＊＊
		var note = "\n（勤務時間が所定労働時間より30分を超える日は残業申請が必要です）";
		teasp.tsAlert(wtitle + '\n' + msg + note, true);
		return false;
	}
	return true;
};
teasp.view.Monthly.prototype.checkV5_2124 = function(){
	if(this.Mcd_PublicHoliday_Mismatch){ // 公休数不一致あり
		var wtitle = teasp.message.getLabel('tm10001060'); // ＊＊＊＊＊＊ 申請できません ＊＊＊＊＊＊
		teasp.tsAlert(wtitle + '\n' + this.Mcd_PublicHoliday_Mismatch, true);
		return false;
	}
	return true;
};
teasp.view.Monthly.prototype.fetchV5_2124 = function(callback){
	const soql = "select Mcd_PublicHolidayNum__c, Mcd_HolidayCount__c, EmpId__r.CompanyCode__c"
			+ " from AtkEmpMonth__c where Id = '" + this.getMcdMonthId() + "'";
	teasp.action.contact.remoteMethods(
		[{funcName:'getExtResult',params:{soql:soql,limit:1,offset:0}}],
		{errorAreaId:null,nowait:false},
		function(result){
			callback(true, (result.records.length && result.records[0]) || null);
		},
		function(result){
			console.log(result);
			callback(false);
		},
		this
	);
};
teasp.view.Monthly.prototype.getMcdMonthId = function(){
	return (this.pouch.dataObj.month || {}).id || null;
};
}