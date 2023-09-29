if(typeof(teasp) == 'object' && !teasp.resolved['V5-3961'] && teasp.Tsf && teasp.Tsf.InfoExpPay){
	// 経費精算の消込画面に項目追加
	// 「精算区分」（全支払種別）
	//     ＜一覧画面＞申請番号の右側
	//     ＜検索画面＞申請番号の下
	// 「精算金額-仮払金」（本人立替分のみ）
	//     ＜一覧画面＞「本人立替金額」を仮払金額の左側に移動、「精算金額ー仮払金」を仮払金額の右側に追加
	//     ＜検索画面＞「精算金額ー仮払金範囲」を仮払金額範囲の下に追加
	teasp.Tsf.InfoExpPay.prototype.init = function(res){
		teasp.Tsf.InfoBase.prototype.init.call(this, res);
		var pickList1 = [{v:'',n:''}];
		var expenseTypes = tsfManager.info.common.expPreApplyConfigs.expenseTypes || [];
		for(var i = 0 ; i < expenseTypes.length ; i++){
			pickList1.push({v:expenseTypes[i], n:expenseTypes[i]});
		}
		// 支払種別毎の一覧の表示項目に追加
		teasp.Tsf.formParams.ListExpPay1.fields.splice(10, 0, {label:'精算区分',msgId:'tf10006080',apiKey:'ExpenseType__c'				,domType:'text'    ,width:'9%',sortable:true,domId:'DispExpenseType1'});
		teasp.Tsf.formParams.ListExpPay1.fields.splice(17, 0, teasp.Tsf.formParams.ListExpPay1.fields.splice(14, 1)[0]); // 「本人立替金額」を仮払金額の左側に移動
		teasp.Tsf.formParams.ListExpPay1.fields.splice(19, 0, {label:'精算金額-仮払金'            ,apiKey:'CTotal__c'					,domType:'currency',width:72  ,sortable:true,domId:'DispCTotal1'     });
		teasp.Tsf.formParams.ListExpPay2.fields.splice(11, 0, {label:'精算区分',msgId:'tf10006080',apiKey:'ExpApplyId__r.ExpenseType__c',domType:'text',width:'9%',sortable:true,domId:'DispExpenseType2'});
		teasp.Tsf.formParams.ListExpPay3.fields.splice(11, 0, {label:'精算区分',msgId:'tf10006080',apiKey:'ExpApplyId__r.ExpenseType__c',domType:'text',width:'9%',sortable:true,domId:'DispExpenseType3'});
		teasp.Tsf.formParams.ListExpPay4.fields.splice( 9, 0, {label:'精算区分',msgId:'tf10006080',apiKey:'ExpenseType__c'				,domType:'text',width:'9%',sortable:true,domId:'DispExpenseType4'});
		// 支払種別毎の検索項目に追加
		teasp.Tsf.formParams.searchExpPay1.fields.splice(2, 0, {label:'精算区分',msgId:'tf10006080',apiKey:'ExpenseType__c' 			 ,domId:'SearchExpenseType1',domType:'select',width:350,pickList:pickList1});
		teasp.Tsf.formParams.searchExpPay1.fields.splice(11,0, {label:'精算金額-仮払金範囲'        ,apiKey:'CTotal__c' 					 ,domId:'SearchCTotal1'     ,domType:'currencyRange',width: 120, minus:true });
		teasp.Tsf.formParams.searchExpPay2.fields.splice(3, 0, {label:'精算区分',msgId:'tf10006080',apiKey:'ExpApplyId__r.ExpenseType__c',domId:'SearchExpenseType2',domType:'select',width:350,pickList:pickList1});
		teasp.Tsf.formParams.searchExpPay3.fields.splice(3, 0, {label:'精算区分',msgId:'tf10006080',apiKey:'ExpApplyId__r.ExpenseType__c',domId:'SearchExpenseType3',domType:'select',width:350,pickList:pickList1});
		teasp.Tsf.formParams.searchExpPay4.fields.splice(1, 0, {label:'精算区分',msgId:'tf10006080',apiKey:'ExpenseType__c' 			 ,domId:'SearchExpenseType4',domType:'select',width:350,pickList:pickList1});
	};
	// 検索結果の画面出力
	teasp.Tsf.ListExpPay.prototype.drawData = function(tb){
		var colCnt = this.drawHead();
		this.setSortMarker();
		if(this.fp.getDiscernment() == 'expPayList1' // 本人立替
		|| this.fp.getDiscernment() == 'expPayList4' // 仮払い
		){
			// 取得したレコードの「精算区分」「精算金額-仮払金」を検索する
			var records = this.records || [];
			var ids = [];
			for(var i = 0 ; i < records.length ; i++){
				ids.push(records[i].Id);
			}
			if(ids.length){
				var soql = dojo.string.substitute("select Id,ExpenseType__c${0} from ${1} where Id in ('${2}')",[
					(this.fp.getDiscernment() == 'expPayList1' ? ',CTotal__c' : ''),
					(this.fp.getDiscernment() == 'expPayList1' ? 'AtkExpApply__c' : 'AtkExpPreApply__c'),
					ids.join("','")
					]);
				var req = {
					soql		: soql,
					soqlForCnt	: null,
					limit		: 50000,
					offset		: 0,
					countUp 	: false,
					piw 		: null,
					irregularType : ''
				};
				console.log(req.soql);
				tsfManager['searchData'](req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
					teasp.Tsf.ListExpPay.mergeExpenseType(records, result);
					teasp.Tsf.ListBase.prototype.drawData.call(this, tb);
					if(this.disableCheckBox){
						this.disableCheckBox();
					}
					this.drawFoot(colCnt);
				}));
			}else{
				teasp.Tsf.ListBase.prototype.drawData.call(this, tb);
				if(this.disableCheckBox){
					this.disableCheckBox();
				}
				this.drawFoot(colCnt);
			}
		}else{
			teasp.Tsf.ListBase.prototype.drawData.call(this, tb);
			if(this.disableCheckBox){
				this.disableCheckBox();
			}
			this.drawFoot(colCnt);
		}
	};
	// 検索結果のCSV出力
	teasp.Tsf.ListExpPay.prototype.csvOutput0 = teasp.Tsf.ListExpPay.prototype.csvOutput;
	teasp.Tsf.ListExpPay.prototype.csvOutput = function(fname, records){
		if(this.fp.getDiscernment() == 'expPayList1' // 本人立替
		|| this.fp.getDiscernment() == 'expPayList4' // 仮払い
		){
			// 取得したレコードの「精算区分」「精算金額-仮払金」を検索する
			var ids = [];
			for(var i = 0 ; i < records.length ; i++){
				ids.push(records[i].Id);
			}
			if(ids.length){
				var soql = dojo.string.substitute("select Id,ExpenseType__c${0} from ${1} where Id in ('${2}')",[
					(this.fp.getDiscernment() == 'expPayList1' ? ',CTotal__c' : ''),
					(this.fp.getDiscernment() == 'expPayList1' ? 'AtkExpApply__c' : 'AtkExpPreApply__c'),
					ids.join("','")
					]);
				var req = {
					soql		: soql,
					soqlForCnt	: null,
					limit		: 50000,
					offset		: 0,
					countUp 	: false,
					piw 		: null,
					irregularType : ''
				};
				console.log(req.soql);
				tsfManager['searchData'](req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
					teasp.Tsf.ListExpPay.mergeExpenseType(records, result);
					this.csvOutput0(fname, records);
				}));
			}else{
				this.csvOutput0(fname, records);
			}
		}else{
			this.csvOutput0(fname, records);
		}
	};
	teasp.Tsf.ListExpPay.mergeExpenseType = function(records, assist){
		// 別途検索した「精算区分」「精算金額-仮払金」を先の検索結果にマージ
		var mp = {};
		var res = assist.records || [];
		for(let i = 0 ; i < res.length ; i++){
			mp[res[i].Id] = res[i];
		}
		for(let i = 0 ; i < records.length ; i++){
			var record = records[i];
			var et = mp[record.Id].ExpenseType__c;
			var ct = mp[record.Id].CTotal__c;
			record.ExpenseType__c = et || null;
			record.CTotal__c      = (typeof(ct) == 'number' ? ct : (ct || null));
		}
	};
}
