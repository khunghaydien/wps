if(typeof(teasp) == 'object' && !teasp.resolved['AKATSUKI'] && teasp.Tsf && teasp.Tsf.ExpDetail){
teasp.Tsf.ExpDetail.prototype.checkExpMatching0 = teasp.Tsf.ExpDetail.prototype.checkExpMatching;
teasp.Tsf.ExpDetail.prototype.checkExpMatching = function(vobj){
	this.checkExpMatching0(vobj);
	// 支払種別の値が空の時は支払種別の行を非表示にする
	if(!vobj.PayeeId__c && (!this.orgData.values || !this.orgData.values.PayeeId__c)){
		teasp.Tsf.Dom.show('.ts-row-payment, .ts-row-payee', this.getFormEl(), false);
	}
};
}
