/**
 * J'sNAVI明細セクション
 *
 * @constructor
 */
teasp.Tsf.SectionJtb = function(parent){
    this.parent = parent;
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.sectionJtb);
    this.checkable = true;
};

teasp.Tsf.SectionJtb.prototype = new teasp.Tsf.SectionBase();

/**
 * J'sNAVI明細の行追加
 *
 * @override
 * @param {string=} hkey
 * @return {Object}
 */
teasp.Tsf.SectionJtb.prototype.insertRow = function(hkey){
    return this.insertTableRow(hkey);
};

/**
 * セクションのDOMを作る。予約連携ボタンを設置する。
 *
 * @override
 * @returns {Array.<Object>}
 */
teasp.Tsf.SectionJtb.prototype.createArea = function(){
	var status = this.parent.objBase.getStatus();
	var payStatus = this.parent.objBase.getPayStatus();
	var els = this.createTableArea();
	var el = els[els.length - 1];
	var div;
	var rsv = this.parent.getObjBase().obj.ExpJsNavi__r;
	var isTripBooking = false;
	var amount = this.parent.getObjBase().obj.PlannedAmount__c;

	// 予定金額に金額が設定されている場合は出張手配申請
	if (amount && amount > 0) {
		isTripBooking = true;
	}

	// 事前申請のステータスが「承認済み」「確定済み」「精算済み」かつ、経費申請のステータスが「承認待ち」「承認済み」「確定済み」「精算済み」以外かつ、出張手配申請の場合は下記を表示
	// 予約一覧、出張手配、予約連携、予約反映、予約確認ボタン
	if((status == '承認済み' || status == '確定済み' || status == '精算済み') && (payStatus != '承認待ち' && payStatus != '承認済み' && payStatus != '確定済み' && payStatus != '精算済み') && isTripBooking){
		div = this.getDomHelper().create('div', { className: 'ts-jtb-button-area' }, el);
		var container = this.getDomHelper().create('div', { className: 'ts-form-control-container' }, div);

		var jsNaviIcon = this.getDomHelper().create('div', { className: 'ts-jtb-logo', style: 'margin-top: 5px; margin-right: 3px;' }, this.getDomHelper().create('div', null, container));
		var btn1 = this.getDomHelper().create('button', null, this.getDomHelper().create('div', { className: 'ts-jtb-button' }, container));
		var btn3 = this.getDomHelper().create('button', null, this.getDomHelper().create('div', { className: 'ts-jtb-button' }, container));
		var btn4 = this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('jt12000030') }, this.getDomHelper().create('div', { className: 'ts-std-button' , id: 'ts-jtb-reserve-confirm', style: 'margin-left: 6px;' }, container));
		var btn2 = this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('jt12000040') }, this.getDomHelper().create('div', { className: 'ts-std-jtb-button' , style: 'margin-left: auto; margin-right: 3px;' }, container));

		this.getDomHelper().create('div', { className: 'ts-jtb-travel' }, btn1);
		this.getDomHelper().create('div', { className: 'ts-std-button-text', innerHTML: teasp.message.getLabel('jt12000010') }, btn1);
		this.getDomHelper().create('div', { className: 'ts-jtb-refresh' }, btn3);
		this.getDomHelper().create('div', { className: 'ts-std-button-text', innerHTML: teasp.message.getLabel('jt12000050') }, btn3);

		this.getDomHelper().connect(btn1, 'onclick', this, this.jtbTicket);			// 出張手配
		this.getDomHelper().connect(btn3, 'onclick', this, this.jtbSynchro);		// 予約反映
		this.getDomHelper().connect(btn4, 'onclick', this, this.jtbConfirmTicket);	// 予約確認
		this.getDomHelper().connect(btn2, 'onclick', this, this.jtbRelation);		// 予約連携

	// 経費申請のステータスが「承認待ち」「承認済み」「確定済み」「精算済み」かつ、出張手配申請の場合は下記を表示
	// 予約一覧、予約確認ボタン
	} else if((payStatus == '承認待ち' || payStatus == '承認済み' || payStatus == '確定済み' || payStatus == '精算済み') && isTripBooking) {
		div = this.getDomHelper().create('div', { className: 'ts-jtb-button-area' }, el);
		var table = this.getDomHelper().create('table', { className: 'ts-form-control', id: 'ts-jtb-reserve-table', style: 'width:0;' }, div);
		var tbody = this.getDomHelper().create('tbody', null, table);
		var tr = this.getDomHelper().create('tr', null, tbody);

		var jsNaviIcon = this.getDomHelper().create('div', { className: 'ts-jtb-logo' }, this.getDomHelper().create('td', null, tr));
		var btn = this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('jt12000030') }, this.getDomHelper().create('td', { className: 'ts-std-button', id: 'ts-jtb-reserve-confirm'}, tr));
		this.getDomHelper().connect(btn, 'onclick', this, this.jtbConfirmTicket);

	// それ以外の場合は表示しない
	} else {
		if (rsv == null || rsv.length == 0) {
			teasp.Tsf.Dom.show('.ts-section-jtb', el, false);
		}
		div = this.getDomHelper().create('div', { style: 'clear:both; margin:10px 0px;' });
	}

	var form = this.getDomHelper().create('div', { className: 'ts-jtb-form', style: 'display:none;' }, div);
	form.appendChild(teasp.Tsf.Dom.toDom(tsfManager.getJtbForm()));

	// J'sNAVIと予約データ連携
	// #7432
	//if(status != '未申請') {
	if (status == '承認済み' || status == '確定済み') {
		this.jtbSynchro(true);
	}

	return els;
};

/**
 * セクションのDOMを作る。セクションの一番上に手配予定金額と手配金額を表示する。
 *
 * @override
 * @returns {Array.<Object>}
 */
teasp.Tsf.SectionJtb.prototype.createSectionTop = function(){
	var status = this.parent.objBase.getStatus();
	var div = this.getDomHelper().create('div', { style: 'margin:10px 0px;' });

	// 警告表示用
	var warning = this.getDomHelper().create('div', { id: 'tsfWarningArea', className: 'ts-error-area', style: 'margin:0 0 8px 0; padding:0;' }, div);
	var warningDiv = this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('jt12000140') }, warning);

	// 手配予定金額
    var formZ1 = this.getDomHelper().create('div', { style: 'float:left;' }, div);
    var row1 = this.getDomHelper().create('div', { className: 'ts-form-row' }, formZ1);
    var label1 = this.getDomHelper().create('div', { className: 'ts-form-label', style: 'width:155px;' }, row1);
    var help = this.getDomHelper().create('div', { id: 'plannedAmountHelp', className: 'pp_base pp_icon_help', style: 'float:right; margin:6px 5px 0 3px;' }, label1);
    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('jt12000110'), style: 'float:right; margin-right:0' }, label1);
    this.getDomHelper().create('div', { className: 'ts-require' }, label1);

    // ツールチップ
    this.getDomHelper().createTooltip({
        connectId   : help,
        label       : teasp.message.getLabel('jt12000130'),
        position    : ['above'],
        showDelay   : 200
    }, this.EXPITEM_RECEIPT_TOOLTIP_HKEY);

    // ステータスが「承認待ち」「承認済み」「確定済み」「精算済み」の場合は、手配予定金額を編集不可に
    if(status == '承認待ち' || status == '承認済み' ||
    		status == '確定済み' || status == '精算済み'){
	    var input1 = this.getDomHelper().create('div', { className: 'ts-form-value ts-form-currency' }, row1);
	    this.getDomHelper().create('div', { id: 'plannedAmountInput', className: 'ts-form-currency', innerHTML: teasp.Tsf.Currency.formatMoney(this.parent.getObjBase().obj.PlannedAmount__c, teasp.Tsf.Currency.V_YEN, false, true) }, input1);

    // それ以外の場合は手配予定金額を編集可能に
    } else {
        var input1 = this.getDomHelper().create('div', { className: 'ts-form-value ts-form-currency' }, row1);
        this.getDomHelper().create('input', { type:'text', maxlength: '17', id: 'plannedAmountInput', className: 'ts-form-currency' }, input1);
    }

	var rsv = this.parent.getObjBase().obj.ExpJsNavi__r;
	var actualCost = 0;

    // ステータスが「未申請」以外
	if(status != '未申請') {

		// 予約一覧にデータが存在する場合は手配金額を表示する
		if (rsv.length != 0 ||
				(status == '承認済み' || status == '確定済み' || status == '精算済み')) {

			// 手配金額算出
			for (var i = 0; i < rsv.length; i++) {
				actualCost += parseInt(rsv[i].Cost__c);
			}

		    var formZ2 = this.getDomHelper().create('div', { style: 'float:left;margin-left:20px;' }, div);
		    var row2 = this.getDomHelper().create('div', { className: 'ts-form-row' }, formZ2);
		    var label2 = this.getDomHelper().create('div', { className: 'ts-form-label' }, row2);
		    this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('jt12000120') }, label2);
		    var input2 = this.getDomHelper().create('div', { className: 'ts-form-value ts-form-currency' }, row2);
		    this.getDomHelper().create('div', { id: 'ActualAmount', className: 'ts-form-currency ts-actual-amount', innerHTML: teasp.Tsf.Currency.formatMoney(actualCost, teasp.Tsf.Currency.V_YEN, false, true)}, input2);
		}
	}

	this.getDomHelper().create('div', { style: 'clear:both; margin:10px 0px;' }, div);
    return div;
};

//出張手配
teasp.Tsf.SectionJtb.prototype.jtbTicket = function(e){
	// 処理番号が発行されていない場合は一時保存した後にJ'sNAVIの画面を開く
	if(!this.parent.getObjBase().getDataObj().ExpPreApplyNo__c){
	    tsfManager.saveExpPreApply(true, teasp.Tsf.Dom.hitch(this, function(succeed, result){
	        if(succeed){
	        	tsfManager.changeView(null, result, function(){tsfManager.openJtbWindow("0");});
	        }else{
	            teasp.Tsf.Error.showError(result);
	        }
	    }));

	} else{
		// JTBウィンドウを予約手段選択画面で開く
		this.openJtbWindow("0");
	}
};

//予約連携
teasp.Tsf.SectionJtb.prototype.jtbRelation = function(e){

	// 処理番号が発行されていない場合は一時保存した後にJ'sNAVIの画面を開く
	if(!this.parent.getObjBase().getDataObj().ExpPreApplyNo__c){
	    tsfManager.saveExpPreApply(true, teasp.Tsf.Dom.hitch(this, function(succeed, result){
	        if(succeed){
	        	tsfManager.changeView(null, result, function(){tsfManager.openJtbWindow("1");});
	        }else{
	            teasp.Tsf.Error.showError(result);
	        }
	    }));
	} else{
		// 予約データ取込一覧画面を開く
		this.openJtbWindow("1");
	}
};

//予約確認
teasp.Tsf.SectionJtb.prototype.jtbConfirmTicket = function(e){
	this.openJtbWindow("3");
};

/**
 * J'sNAVI Jr画面を開く(SSOモード指定)
 */
teasp.Tsf.SectionJtb.prototype.openJtbWindow = function(ssoMode){
	var dataObj = this.parent.getObjBase().getDataObj();
	dataObj.ssoMode = ssoMode;
	this.getConnectParameter(dataObj, document, this.jtbWindow);
};

/**
 * J'sNAVI Jr接続用のパラメータをセットし、J'sNAVI Jr用のウィンドウを開く
 */
teasp.Tsf.SectionJtb.prototype.jtbWindow = function(serverParams, document, dataObj){
	if(tsfManager.isUseJsNaviDummy()){
		teasp.Tsf.SectionJtb.jtbWindowDummy(serverParams, document, dataObj);
		return;
	}
	// 取得パラメータ部分
	document.jtbform.action = serverParams.mainUrl;
	if(serverParams.isUsingJsNaviSystem2) {
		document.jtbform.acceptCharset = 'utf-8';
	}
	document.jtbform.EbbaKey.value = serverParams.EbbaKey;
	document.jtbform.ENCRYPTMODE.value = serverParams.ENCRYPTMODE;
	document.jtbform.LOCATIONCODE.value = serverParams.LOCATIONCODE;
	document.jtbform.LOCATIONPASSWORD.value = serverParams.LOCATIONPASSWORD;
	document.jtbform.USERID.value = serverParams.USERID;
	document.jtbform.USERPASSWORD.value = serverParams.USERPASSWORD;
	document.jtbform.PAYINGCCCD.value = serverParams.PAYINGCCCD;	// コストセンターコード
	// 代理ユーザー
	if(serverParams.DRIUSERID){
		document.jtbform.DRIUSERID.value = serverParams.DRIUSERID;
	}

	// 入力値から取得
	if(dojo.locale == 'ja'){
		var ds = teasp.util.date.formatDate(dataObj.StartDate__c, 'SLA');
		var de = teasp.util.date.formatDate(dataObj.EndDate__c  , 'SLA');
		if (ds=='???'){
			teasp.Tsf.Error.showError(teasp.message.getLabel('tf10007940',teasp.message.getLabel('tf10000770')));
			return;
		}
		if (de=='???'){
			teasp.Tsf.Error.showError(teasp.message.getLabel('tf10007940',teasp.message.getLabel('tf10000800')));
			return;
		}
		document.jtbform.TRIPSTARTDAY.value = ds;
		document.jtbform.TRIPENDDAY.value   = de;

	} else{
		var ds = teasp.util.date.parseDate(dataObj.StartDate__c);
		var de = teasp.util.date.parseDate(dataObj.EndDate__c);
		try{
			document.jtbform.TRIPSTARTDAY.value = dojo.date.locale.format(ds, {selector: "date",datePattern:"yyyy/MM/dd"});
		}catch(e){
			teasp.Tsf.Error.showError(teasp.message.getLabel('tf10007940',teasp.message.getLabel('tf10000770')));
			return;
		}
		try{
			document.jtbform.TRIPENDDAY.value   = dojo.date.locale.format(de, {selector: "date",datePattern:"yyyy/MM/dd"});
		}catch(e){
			teasp.Tsf.Error.showError(teasp.message.getLabel('tf10007940',teasp.message.getLabel('tf10000800')));
			return;
		}
	}

	document.jtbform.TCKOPERATIONMODE.value = dataObj.ssoMode;
	//document.jtbform.TRIPSTARTDAY.value = teasp.util.date.formatDate(dataObj.StartDate__c, 'SLA');
	//document.jtbform.TRIPENDDAY.value   = teasp.util.date.formatDate(dataObj.EndDate__c  , 'SLA');

	// 処理番号=P+申請番号
	document.jtbform.OPERATIONNUMBER.value = "P" + dataObj.ExpPreApplyNo__c;
	document.jtbform.SUBNUMBER.value = "00";		// 副番号

	// 業務種別(国内：J0、国外：F0)
	document.jtbform.BUSINESSNAME.value = dataObj.DestinationType__c && dataObj.DestinationType__c == "2" ? "F0" : "J0";

	// 内容をMEMOに登録する。(10文字まで）
	document.jtbform.MEMO1.value = dataObj.Content__c ? dataObj.Content__c.substr(0, 10) : "";

	console.log("処理番号=" + document.jtbform.OPERATIONNUMBER.value);

	// IE/Edgeの文字化け対処
	var isIE = (dojo.isIE || window.navigator.userAgent.toLowerCase().indexOf('trident') >= 0);
	var isEdge = window.navigator.userAgent.toLowerCase().indexOf('edge') !== -1;
	if((isIE || isEdge) && !serverParams.isUsingJsNaviSystem2){
		// IE/Edgeかつ旧I/F利用の場合
		document.charset='Shift_JIS';
	}

	teasp.Tsf.SectionJtb.jtbOpen();

	if((isIE || isEdge) && !serverParams.isUsingJsNaviSystem2){
		// 元に戻す
		document.charset = "utf-8";
	}
};

// ウィンドウを開く
teasp.Tsf.SectionJtb.jtbOpen = function(){
	// 空ウィンドウの表示
	window.open("", "TICKET_WEB", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,width=1014,height=712,top=0,left=0");
	// 表示した空ウィンドウに対してsubmit
	document.jtbform.target = "TICKET_WEB";	// 固定
	document.jtbform.submit();
};

/**
 * J'sNAVI Jr予約データ同期
 */
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
		id    : dataObj.Id,
		empId : tsfManager.getEmpId(),
		proxyEmpId : tsfManager.getSessionEmpId(),
		operationNo : 'P' + dataObj.ExpPreApplyNo__c	// P + 申請番号
	};

	tsfManager.jtbAction(req, teasp.Tsf.Dom.hitch(this,
		function(succeed, result){
			console.log("result:" + result);
			if(succeed){
				this.refreshView(result.data);
				// 実績データがある場合は出張手配・予約連携・予約反映ボタンを非表示にする
				if(result.hasActualData) {
					teasp.Tsf.Dom.show('.ts-jtb-button', null, false);
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

/**
 * J'sNAVI Jr明細の更新
 */
teasp.Tsf.SectionJtb.prototype.refreshView = function(data){
	console.log("refresh");
	console.log(data);
	var actualCost = 0;

	// 既存データ削除
	this.empty();
	this.parent.getObjBase().obj.ExpJsNavi__r = data;

	// 再作成
	// 手配金額を再計算
	if(data){
		for(var i=0; i < data.length; i++){
			if (data[i].Date__c) {
				data[i].Date__c = data[i].Date__c.replace(/[\/]/g, "-");
			}
			this.insertRow();
			actualCost += parseInt(data[i].Cost__c);
		}
	}

	// 手配金額を更新
	teasp.Tsf.Dom.html('.ts-actual-amount', null, teasp.Tsf.Currency.formatMoney(actualCost, teasp.Tsf.Currency.V_YEN, false, true));

	this.changedCurrency();
};

/**
 * J'sNAVI Jr接続用パラメータを取得する。
 */
teasp.Tsf.SectionJtb.prototype.getConnectParameter = function(dataObj, document, callback){
	var req = {
		method: 'getJsNaviParameter',
		empId : dataObj.EmpId__c
	};

	tsfManager.jtbAction(req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
		if(succeed){
			callback(result, document, dataObj);
		}else{
			teasp.Tsf.Error.showError(result);
		}
	}));
};

/**
 * 手配予定金額が登録されているかチェックする
 *
 * @returns {boolean}
 */
teasp.Tsf.SectionJtb.prototype.existValue = function(){
    var amount = this.parent.getObjBase().obj.PlannedAmount__c;

    // 手配予定金額に値が設定されている場合はtrueを返す
    return (amount && amount > 0) ? true : false;
};

/**
 * 手配予定金額の入力チェック
 *
 * @override
 */
teasp.Tsf.SectionJtb.prototype.getDomValues = function(flag, chklev){
    var yotei = this.parent.fp.getElementByApiKey('PlannedAmount__c', null, null);
    var plannedCost = teasp.Tsf.util.parseInt((yotei.value ? yotei.value : "").replace(/\\/g, "").split(",").join(""));
    var data = teasp.Tsf.SectionBase.prototype.getDomValues.call(this, flag,chklev);

    // 申請時、セクションにチェックあり、かつ金額が未入力の場合はエラー
    if(chklev && chklev == 1 && this.isOpen() && (!plannedCost || plannedCost == 0)) {
        if(!data.ngList) data.ngList = [];
	var fc = this.parent.fp.getFcByApiKey('PlannedAmount__c');
	data.ngList.push({ ngType: 1, fc: fc });
    }

    return data;
};

teasp.Tsf.SectionJtb.jtbWindowDummy = function(serverParams, document, dataObj){
    window.open(teasp.getPageUrl('timeSheetView') + '?support=jtb'
        + '&z=' + (new Date()).getTime() // キャッシュされないための措置
        + '#!compo!id:' + (dataObj.Id || '')
        + '!ssoMode:'   + (dataObj.ssoMode || ''),
        'jsNaviDummy', 'width=800,height=750,resizable=yes,scrollbars=yes');
};
