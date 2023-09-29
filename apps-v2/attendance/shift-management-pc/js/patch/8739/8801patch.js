if(typeof (teasp) == 'object' && teasp.Tsf && teasp.Tsf.SectionJtb) {
	teasp.Tsf.SectionJtb.prototype.jtbSynchro = function(initFlag){

		// 出張手配を利用しない設定の場合は処理しない
		if(!tsfManager.isUsingJsNaviSystem()){
				return;
		}

		// 事前申請起動時で処理番号が発行されていない（新規で開いた）場合は何もしない
		if(initFlag && !this.parent.getObjBase().getDataObj().ExpPreApplyNo__c){
				console.log("申請番号が発行されていません");
				return;
		}

		var dataObj = this.parent.getObjBase().getDataObj();

		// 予約データ同期処理
		var req = {
			method: 'syncJsNaviReserveData',
			id		: dataObj.Id,
			empId : tsfManager.getEmpId(),
			proxyEmpId : tsfManager.getSessionEmpId(),
			operationNo : 'P' + dataObj.ExpPreApplyNo__c		// P + 申請番号
		};

		tsfManager.jtbAction(req, teasp.Tsf.Dom.hitch(this,
			function(succeed, result){
				console.log("result:" + result);
				if(succeed){
					this.refreshView(result.data);
					// 実績データがある場合は予約連携・予約反映ボタンを非表示にする
					if(result.hasActualData) {
							teasp.Tsf.Dom.show('.ts-std-jtb-button', null, false);
					}
					if(result.disableJtbButtons) {
						// 新インターフェイス有効かつ旧I/Fの予約データが事前申請に紐付いている
						// または、旧インターフェイス有効かつ新I/Fの予約データが事前申請に紐付いている場合は
						// 出張手配のボタンを非表示にする
						teasp.Tsf.Dom.show('.ts-jtb-button', null, false);
						teasp.Tsf.Dom.show('#ts-jtb-reserve-confirm', null, false);
						teasp.Tsf.Dom.show('.ts-std-jtb-button', null, false);
					}
				}else{
					teasp.Tsf.Error.showError(result);
				}
			})
		);
	};
}
