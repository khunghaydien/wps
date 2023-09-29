if(typeof(teasp) == 'object' && !teasp.resolved['8830'] && teasp.Tsf && teasp.Tsf.InfoExpPay){
// 経費精算の消込画面で精算日、清算実行日による検索と、一覧に同項目を表示する機能を追加する
// 対象支払種別：本人立替、請求書、法人カード
teasp.Tsf.InfoExpPay.prototype.init = function(res){
	teasp.Tsf.InfoBase.prototype.init.call(this, res);
	// 検索項目の拡張（支払種別毎の検索項目セットの最後行に追加）
	teasp.Tsf.formParams.searchExpPay1.fields.push({label:'精算日'	  ,msgId:'payDate_label',apiKey:'EmpExpId__r.ExpApplyId__r.payDate__c',domType:'dateRange',width:108,domId:'SearchExpPay1PD',name:'payDate',mask:2});
	teasp.Tsf.formParams.searchExpPay2.fields.push({label:'精算日'	  ,msgId:'payDate_label',apiKey:'JournalId__r.Date__c',domType:'dateRange',width:108,domId:'SearchExpPay2PD',name:'payDate',mask:2});
	teasp.Tsf.formParams.searchExpPay3.fields.push({label:'精算日'	  ,msgId:'payDate_label',apiKey:'JournalId__r.Date__c',domType:'dateRange',width:108,domId:'SearchExpPay3PD',name:'payDate',mask:2});

	// 一覧の表示項目拡張（最後列に追加）
	teasp.Tsf.formParams.ListExpPay1.fields.push({label:'精算日'	,msgId:'payDate_label',apiKey:'Seisanbi'  ,domType:'date',width:72,sortable:false,domId:'DispExpPay1PD',mask:2});
	teasp.Tsf.formParams.ListExpPay2.fields.push({label:'精算日'	,msgId:'payDate_label',apiKey:'Seisanbi'  ,domType:'date',width:72,sortable:false,domId:'DispExpPay2PD',mask:2});
	teasp.Tsf.formParams.ListExpPay3.fields.push({label:'精算日'	,msgId:'payDate_label',apiKey:'Seisanbi'  ,domType:'date',width:72,sortable:false,domId:'DispExpPay3PD',mask:2});
};
teasp.Tsf.ListExpPay.prototype.showData = function(){
	if(this.fp.getDiscernment() == 'expPayList1' // 本人立替
	|| this.fp.getDiscernment() == 'expPayList2' // 請求書
	|| this.fp.getDiscernment() == 'expPayList3' // 法人カード
	){
		this.journalPayDate = null;
		var filts = dojo.clone(this.fp.getFilts()); // 固定の検索条件
		for(var i = filts.length - 1 ; i >= 0 ; i--){
			var f = filts[i];
			if(f.fix || freeFilts.length <= 0){
				if(f.filtVal){
					f.filtVal = 'EmpExpId__r.' + (this.fp.getDiscernment() == 'expPayList1' ? 'ExpApplyId__r.' : '') + f.filtVal;
				}
				if(f.mask && f.mask != this.mask){
					filts.splice(i, 1);
				}
			}
		}
		var freeFilts = this.freeFilts || []; // 任意の検索条件
		var seisanbis = [];
		for(var i = freeFilts.length - 1 ; i >= 0 ; i--){
			if(!freeFilts[i].filtVal){
				continue;
			}
			if(freeFilts[i].filtVal.indexOf('JournalId__r.Date__c') >= 0){
				seisanbis.push(freeFilts[i]);
				freeFilts.splice(i, 1);
			}else if(freeFilts[i].filtVal.indexOf('EmpExpId__r.ExpApplyId__r.payDate__c') >= 0){
				seisanbis.push(freeFilts[i]);
				freeFilts.splice(i, 1);
			}else if(freeFilts[i].filtVal.indexOf('CreatedDate') >= 0){
				var tm = (freeFilts[i].filtVal.indexOf('>=') > 0 ? 'T00:00:00+0900' : 'T23:59:59+0900');
				freeFilts[i].filtVal = freeFilts[i].filtVal.replace(/(\d{4}\-\d{2}\-\d{2})/, '$1' + tm);
				seisanbis.push(freeFilts[i]);
				freeFilts.splice(i, 1);
			}else{
				var of = dojo.clone(freeFilts[i]);
				of.filtVal = 'EmpExpId__r.' + (this.fp.getDiscernment() == 'expPayList1' ? 'ExpApplyId__r.' : '') + of.filtVal;
				filts.push(of);
			}
		}
		if(seisanbis.length){ // 精算日または清算実行日の検索条件が指定されている場合
			// 精算仕訳明細(AtkJournalDetail__c) を検索
			var lst = [];
			dojo.forEach(seisanbis, function(f){
				lst.push(f.filtVal);
			});
			dojo.forEach(filts, function(f){
				lst.push(f.filtVal);
			});
			var req = {
				soql		: "select Id,JournalId__r.Date__c,EmpExpId__r.ExpApplyId__r.payDate__c,CreatedDate,EmpExpId__c,EmpExpId__r.ExpApplyId__c from AtkJournalDetail__c where Removed__c = false and " + lst.join(" and "),
				soqlForCnt	: null,
				limit		: 50000,
				offset		: 0,
				countUp 	: false,
				piw 		: null,
				irregularType : ''
			};
			console.log(req.soql);
			this.journalPayDate = {};
			tsfManager['searchData'](req, teasp.Tsf.Dom.hitch(this, this.filterEmpExp));
		}else{
			teasp.Tsf.ListBase.prototype.showData.call(this);
		}
	}else{
		teasp.Tsf.ListBase.prototype.showData.call(this);
	}
};
// 検索結果を表示する関数
teasp.Tsf.ListExpPay.prototype.drawData = function(tb){
	var colCnt = this.drawHead();
	this.setSortMarker();

	if(this.fp.getDiscernment() == 'expPayList1' // 本人立替
	|| this.fp.getDiscernment() == 'expPayList2' // 請求書
	|| this.fp.getDiscernment() == 'expPayList3' // 法人カード
	){
		if(this.journalPayDate){
			// 勤怠交通費IDから精算日を引けるマッピングテーブルが作成済みの場合、
			// 先の検索結果にマージして一覧を再表示
			var records = this.records || [];
			for(var i = 0 ; i < records.length ; i++){
				var record = records[i];
				record.Seisanbi = this.journalPayDate[record.Id];
			}
			teasp.Tsf.ListBase.prototype.drawData.call(this, tb);
			this.drawFoot(colCnt);
		}else{
			// 検索結果のレコードの精算日と清算実行日を取得する
			var records = this.records || [];
			var ids = [];
			for(var i = 0 ; i < records.length ; i++){
				ids.push(records[i].Id);
			}
			var soql = "select Id,JournalId__r.Date__c,EmpExpId__r.ExpApplyId__r.payDate__c,CreatedDate,EmpExpId__c,EmpExpId__r.ExpApplyId__c from AtkJournalDetail__c where Removed__c = false";
			if(this.fp.getDiscernment() == 'expPayList1'){
				soql += " and EmpExpId__r.ExpApplyId__c in ('" + ids.join("','") + "')";
			}else{
				soql += " and EmpExpId__c in ('" + ids.join("','") + "')";
			}
			if(ids.length){
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
				tsfManager['searchData'](req, teasp.Tsf.Dom.hitch(this, this.mergePayDate));
			}else{
				teasp.Tsf.ListBase.prototype.drawData.call(this, tb);
				this.drawFoot(colCnt);
			}
		}
	}else{
		teasp.Tsf.ListBase.prototype.drawData.call(this, tb);
		this.drawFoot(colCnt);
	}
};
teasp.Tsf.ListExpPay.prototype.mergePayDate = function(succeed, result){
	// 検索結果の精算日を先の検索結果にマージして一覧を再表示
	var journalPayDate = {};
	var res = result.records || [];
	for(var i = 0 ; i < res.length ; i++){
		var o = res[i];
		var pd = null;
		if(this.fp.getDiscernment() == 'expPayList1' && o.EmpExpId__r && o.EmpExpId__r.ExpApplyId__r && o.EmpExpId__r.ExpApplyId__r.payDate__c){
			pd = teasp.util.date.formatDate(o.EmpExpId__r.ExpApplyId__r.payDate__c);
		}else if(this.fp.getDiscernment() != 'expPayList1' && o.JournalId__r.Date__c){
			pd = teasp.util.date.formatDate(o.JournalId__r.Date__c);
		}
		var cd = (o.CreatedDate ? teasp.util.date.formatDate(o.CreatedDate, 0, 0) : null);
		if(this.fp.getDiscernment() == 'expPayList1' && o.EmpExpId__r){
			journalPayDate[o.EmpExpId__r.ExpApplyId__c] = pd;
		}else if(this.fp.getDiscernment() != 'expPayList1' && o.EmpExpId__c){
			journalPayDate[o.EmpExpId__c] = pd;
		}
	}
	var records = this.records || [];
	for(var i = 0 ; i < records.length ; i++){
		var record = records[i];
		record.Seisanbi = journalPayDate[record.Id];
	}
	teasp.Tsf.ListBase.prototype.drawData.call(this);
	var colCnt = this.drawHead();
	this.drawFoot(colCnt);
};
teasp.Tsf.ListExpPay.prototype.filterEmpExp = function(succeed, result){
	// 精算仕訳の検索結果からIDの配列を作り、元の検索条件にマージして元の検索を実行
	var res = result.records || [];
	if(this.fp.getDiscernment() != 'expPayList1' && res.length > 2000){ // （請求書、法人カード）2000件超該当の場合、エラーにする
		this.showError('検索結果が 2000 件以内に絞り込まれるように検索条件を指定してください');
		return;
	}
	// 本来の検索に対して検索条件を追加、勤怠交通費IDから精算日を引けるようにマッピングテーブルを作成
	var idmap = [];
	for(var i = 0 ; i < res.length ; i++){
		var o = res[i];
		var pd = null;
		if(this.fp.getDiscernment() == 'expPayList1' && o.EmpExpId__r && o.EmpExpId__r.ExpApplyId__r && o.EmpExpId__r.ExpApplyId__r.payDate__c){
			pd = teasp.util.date.formatDate(o.EmpExpId__r.ExpApplyId__r.payDate__c);
		}else if(this.fp.getDiscernment() != 'expPayList1' && o.JournalId__r.Date__c){
			pd = teasp.util.date.formatDate(o.JournalId__r.Date__c);
		}
		var cd = (o.CreatedDate ? teasp.util.date.formatDate(o.CreatedDate, 0, 0) : null);
		if(this.fp.getDiscernment() == 'expPayList1' && o.EmpExpId__r){
			this.journalPayDate[o.EmpExpId__r.ExpApplyId__c] = pd;
			idmap[o.EmpExpId__r.ExpApplyId__c] = 1;
		}else if(this.fp.getDiscernment() != 'expPayList1' && o.EmpExpId__c){
			this.journalPayDate[o.EmpExpId__c] = pd;
			idmap[o.EmpExpId__c] = 1;
		}
	}
	var ids = Object.keys(idmap);
	if(this.fp.getDiscernment() == 'expPayList1' && ids.length > 2000){ // （本人立替）2000件超該当の場合、エラーにする
		this.showError('検索結果が 2000 件以内に絞り込まれるように検索条件を指定してください');
		return;
	}
	this.freeFilts.push({ filtVal: "Id in ('" + ids.join("','") + "')" });
	// 本来の検索を実行
	teasp.Tsf.ListBase.prototype.showData.call(this);
};
}
