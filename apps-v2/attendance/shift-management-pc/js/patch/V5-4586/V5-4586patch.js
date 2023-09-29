if(typeof(teasp) == 'object' && !teasp.resolved['V5-4586'] && teasp.Tsf && teasp.Tsf.InfoExpPay){
	teasp.Tsf.InfoExpPay.prototype.init = function(res){
		teasp.Tsf.InfoBase.prototype.init.call(this, res);
		teasp.Tsf.formParams.ListExpPay1.filts = [
			{ filtVal: "Status__c in ('承認済み','確定済み')", fix:true, mask: 1 },
			{ filtVal: "Status__c = '精算済み'"              , fix:true, mask: 2 },
			{ filtVal: "Removed__c = false", fix: true }
		];
	};
}
