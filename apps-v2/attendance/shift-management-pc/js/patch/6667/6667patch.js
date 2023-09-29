if(typeof(teasp) == 'object' && !teasp.resolved['6667'] && teasp.data && teasp.data.Pouch){
// 勤怠月次の起算情報日(InitialDate__c)を補完
teasp.data.Pouch.prototype.setKeyObj0 = teasp.data.Pouch.prototype.setKeyObj;
teasp.data.Pouch.prototype.setKeyObj = function(key, o){
	this.setKeyObj0(key, o);
	if(key == 'months'){
		var vms = this.getEmpMonthList(this.dataObj.month.startDate, 15, -15);
		var vmap = {};
		for(var i = 0 ;i < vms.length ; i++){
			var vm = vms[i];
			vmap[vm.startDate] = vm;
		}
		var ems = this.dataObj.empMonthList || [];
		for(var i = 0 ;i < ems.length ; i++){
			var em = ems[i];
			var vm = vmap[em.startDate];
			if(vm && em.initialDate != vm.initialDate){
				em.initialDate = vm.initialDate;
			}
		}
	}
};
teasp.controlClass = teamspirit.RtkPotalCtl;
teasp.prefixBar = 'teamspirit__';
// 月次サマリーの当四半期の超過時間,当年度の超過時間,当年度の超過回数の補正
teasp.view.MonthlySummary.prototype.show0 = teasp.view.MonthlySummary.prototype.show;
teasp.view.MonthlySummary.prototype.show = function(){
	this.getLatestWorkOverTime36(dojo.hitch(this, function(records){
		var month = this.pouch.dataObj.month;
		var pms = this.pouch.getEmpMonthListByPeriod(month._em, 3); // 当四半期の期間
		var sd  = month.startDate;
		var totalWorkOverTime36 = 0;
		var quartWorkOverTime36 = 0;
		var totalWorkOverCount36 = 0;
		var limit36 = (month.config.variablePeriod > 3 ? 42 * 60 : 45 * 60);
		for(var i = 0 ; i < records.length ; i++){
			var record = records[i];
			record.StartDate__c = teasp.logic.convert.valDate(record.StartDate__c);
			record.EndDate__c   = teasp.logic.convert.valDate(record.EndDate__c);
			if(pms[0].startDate <= record.StartDate__c && record.EndDate__c < sd){
				quartWorkOverTime36 += records[i].WorkOverTime36__c;
			}
			totalWorkOverTime36 += records[i].WorkOverTime36__c;
			totalWorkOverCount36 += (records[i].WorkOverTime36__c > limit36 ? 1 : 0);
		}
		// メモリ上の該当項目を再計算した値で上書き
		var o = month.disc;
		o.totalWorkOverTime36  = totalWorkOverTime36 + o.workOverTime36;
		o.quartWorkOverTime36  = quartWorkOverTime36 + o.workOverTime36;
		o.totalWorkOverCount36 = totalWorkOverCount36 + (o.workOverTime36 > limit36 ? 1 : 0);
		this.show0();
	}));
};
teasp.view.MonthlySummary.prototype.getLatestWorkOverTime36 = function(callback){
	var month = this.pouch.dataObj.month;
	var yms = this.pouch.getEmpMonthListByPeriod(month._em, 12); // 当年度の期間
	if(yms[0].startDate >= month.startDate){ // 当月=年度初月
		callback([]);
		return;
	}
	// 当年度の初月～前月までの WorkOverTime36__c を読込
	var soql = dojo.string.substitute("select Id, YearMonth__c, SubNo__c, StartDate__c, EndDate__c, WorkOverTime36__c"
		+ " from AtkEmpMonth__c where EmpId__c = '${0}' and StartDate__c >= ${1} and EndDate__c < ${2}"
		, [this.pouch.getEmpId(), yms[0].startDate, month.startDate]);
	var req = {
		funcName: 'getExtResult',
		params  : {
			soql   : soql,
			limit  : 100,
			offset : 0
		}
	};
	teasp.action.contact.remoteMethods([req], {
			errorAreaId : null,
			nowait      : true
		},
		function(result){
			teasp.util.excludeNameSpace(result);
			callback(result.records);
		},
		null,
		this
	);
};
}
