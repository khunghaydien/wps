/**
 * 経費事前申請クラス
 *
 * @constructor
 */
teasp.Tsf.ExpApply = function(obj, rights, piwks, steps){
    this.obj = (obj || {});
    this.rights = rights;
    this.steps = steps;

    this.obj._uniqKey = teasp.Tsf.ExpApply.createUniqKey();
    this.mergePiwks(piwks || []);
    this.approved = this.isApproved();

    dojo.forEach(this.obj.EmpExp__r || [], function(exp){
        exp._uniqKey = teasp.Tsf.ExpApply.createUniqKey();
        teasp.Tsf.ObjBase.covertEmpExp(exp);
    }, this);

    this.rebirthEmp();
    this.createOrgExpIds(this.obj.EmpExp__r);
};

teasp.Tsf.ExpApply.prototype = new teasp.Tsf.ObjBase();

teasp.Tsf.ExpApply.UNIQ_SEQ = 100; // ユニークであれば良いので、この値に深い意味はない

teasp.Tsf.ExpApply.createUniqKey = function(){
    return 'X' + teasp.Tsf.ExpApply.UNIQ_SEQ++;
};

/**
 * 申請番号プルダウンの選択肢になる配列を作成
 *
 * @param {Array.<Object>} expApplys
 * @returns {Array.<Object>}
 */
teasp.Tsf.ExpApply.createList = function(expApplys, targetId){
    var lst = [];
    dojo.forEach(expApplys, function(expApply){
        if(expApply.Id == targetId
        || !['申請取消','確定取消'].contains(expApply.StatusC__c)
        || (expApply.EmpExp__r && expApply.EmpExp__r.length > 0)){
            this.push(new teasp.Tsf.ExpApply(expApply));
        }
    }, lst);
    return lst;
};

/**
 * 社員データを配列化（1件だけの配列）
 */
teasp.Tsf.ExpApply.prototype.rebirthEmp = function(){
    this.obj.emps = teasp.Tsf.ExpPreApply.rebirthArray(this.obj, teasp.Tsf.formParams.sectionEmp.fields, 1, 1);
};

/**
 * 申請日付
 *
 * @returns {string}
 */
teasp.Tsf.ExpApply.prototype.getApplyDate = function(){
    if(typeof(this.obj.CreatedDate) == 'number'){
        return teasp.util.date.formatDate(this.obj.CreatedDate, 'SLA', 0);
    }else{
        var d = new Date(this.obj.CreatedDate);
        if(typeof(d) == 'object' && d.getFullYear()){
            return d.getFullYear()
            + '/' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1)
            + '/' + (d.getDate() < 10 ? '0' : '') + d.getDate();
        }else{
            return '';
        }
    }
};

/**
 * 経費申請番号
 *
 * @returns {string}
 */
teasp.Tsf.ExpApply.prototype.getApplyNo = function(){
    return this.obj.ExpApplyNo__c || null;
};

/**
 * 経費事前申請ID
 *
 * @returns {string}
 */
teasp.Tsf.ExpApply.prototype.getExpPreApplyId = function(){
    return this.obj.ExpPreApplyId__c || null;
};

/**
 * 稟議ID
 *
 * @returns {string}
 */
teasp.Tsf.ExpApply.prototype.getRingiApplyId = function(){
    return this.obj.ApplyId__c || null;
};

/**
 * 稟議情報を返す
 *
 * @returns {string}
 */
teasp.Tsf.ExpApply.prototype.getRingiApplyObj = function(){
    var a = (this.obj.ApplyId__r || {});
    if(this.obj.ApplyId__c && !a.Id){
        a.Id = this.obj.ApplyId__c;
    }
    return a;
};

/**
 * ステータス
 *
 * @returns {string}
 */
teasp.Tsf.ExpApply.prototype.getStatus = function(flag){
    var status = teasp.Tsf.ObjBase.prototype.getStatus.call(this, flag);
    if(!status || status == teasp.constant.STATUS_NOTADMIT){ // 未確定
        return teasp.constant.STATUS_NOTREQUEST; // 未申請
    }
    return status;
};

/**
 * 論理削除済み
 * @returns {boolean}
 */
teasp.Tsf.ExpApply.prototype.isRemoved = function(){
    return (this.obj.Removed__c || false);
};

/**
 * 申請取下（明細をばらす）できるか
 *
 * @returns {boolean}
 */
teasp.Tsf.ExpApply.prototype.isUnknotable = function(){
    if(this.getExpPreApplyId()){
        return false; // 事前申請に紐づいている場合は不可。
    }
    // 現状では、ステータスが却下の場合だけ、申請取下できる。
//    return (this.isReject() || this.isCancel());
    return this.isReject();
};

/**
 * 申請取下選択時の確認用メッセージ
 * @returns
 */
teasp.Tsf.ExpApply.prototype.getUnknotWarning = function(){
    return teasp.message.getLabel('tm30001151', this.getApplyNo()); // 申請番号 {0} の申請を取り下げます（申請前の状態に戻ります）。よろしいですか？
};

/**
 *
 * @returns {string|null}
 */
teasp.Tsf.ExpApply.prototype.getConfig = function(){
    return { view: 'Form0' };
};

/**
 * 金額
 *
 * @returns {String}
 */
teasp.Tsf.ExpApply.prototype.getTotalCost = function(){
    if(!this.fcTotalCost){
        var field = {
            apiKey  : 'TotalCost__c',
            domType : 'currency'
        };
        this.fcTotalCost = new teasp.Tsf.Fc(field);
    }
    return this.fcTotalCost.parseValue(this.obj).dispValue;
};

teasp.Tsf.ExpApply.prototype.getSectionValues = function(discernment){
    switch(discernment){
    case 'detail'   : return this.getEmpExps();
    case 'emp'      : return this.obj.emps || [];
    case 'expAssist': return [this.obj];
    }
    return [this.obj];
};

teasp.Tsf.ExpApply.prototype.getSectionValuesByRowIndex = function(discernment, index){
    var lst = this.getSectionValues(discernment);
    if(index < lst.length){
        return lst[index];
    }
    // 新規レコード
    if(discernment == 'detail'){
        return this.createEmpExp();
    }else{
        return {
            _uniqKey : teasp.Tsf.ExpApply.createUniqKey()
        };
    }
};

teasp.Tsf.ExpApply.prototype.createEmpExp = function(assist){
    var chargeDept = tsfManager.getDefaultChargeDept();
    var reqChargeDept = tsfManager.isRequireChargeDept();
    var o = {
        _uniqKey            : teasp.Tsf.ExpApply.createUniqKey(),
        Id                  : null,
        EmpId__c            : this.getEmpId(),
        ExpApplyId__c       : this.getId(),
        ExpApplyId__r       : {
            ExpPreApplyId__c    : this.getExpPreApplyId()
        },
        ChargeDeptId__c     : (reqChargeDept && chargeDept.ChargeDeptId__c) || null,
        ChargeDeptId__r     : (reqChargeDept && chargeDept.ChargeDeptId__r) || null,
        Detail__c              : null,
        JobId__c               : null,
        Cost__c                : null,
        startName__c           : null,
        startCode__c           : null,
        endName__c             : null,
        endCode__c             : null,
        roundTrip__c           : false,
        Route__c               : null,
        Receipt__c             : false,
        TransportType__c       : null,
        CurrencyName__c        : null,
        CurrencyRate__c        : 0,
        ForeignAmount__c       : 0,
        Tax__c                 : 0,
        TaxAuto__c             : true,
        TaxRate__c             : 0,
        TaxType__c             : null,
        WithoutTax__c          : 0,
        ExtraItem1__c          : null,
        ExtraItem2__c          : null,
        CardStatementLineId__c : null,
        IsPaid__c              : false,
        PayeeId__c             : null,
        PaymentDate__c         : null,
        Quantity__c            : 0,
        UnitPrice__c           : 0,
        Item__c                : null,
        PreEmpExpId__c         : null,
        PreExpItemId__c        : null,
        Order__c               : 0
    };
    if(assist){
        if(assist.ChargeDeptId__c && reqChargeDept){ // 負担部署の指定ありかつ明細単位の負担部署入力オン
            o.ChargeDeptId__c = assist.ChargeDeptId__c || null;
            o.ChargeDeptId__r = assist.ChargeDeptId__r || null;
        }
        if(assist.ChargeJobId__c){ // ジョブの指定あり
            o.JobId__c = assist.ChargeJobId__c || null;
            o.JobId__r = assist.ChargeJobId__r || null;
        }
        if(assist.PayExpItemId__c){ // 精算方法の指定あり
            var payItem = tsfManager.getInfo().getPayItemById(assist.PayExpItemId__c);
            if(payItem.isForPayable()){
                o.PayeeId__r = { PayeeType__c : '2' };
            }
        }
        if(!tsfManager.isDoNotCopyExtraItem()){ // 経費明細入力時に基本情報の拡張項目をコピーする
            o.ExtraItem1__c = assist.ExtraItem1__c || null; // 拡張項目１
            o.ExtraItem2__c = assist.ExtraItem2__c || null; // 拡張項目２
        }
    }
    return o;
};

/**
 * カード明細から経費明細データを作成
 *
 * @param {teasp.Tsf.ExpItem} expItem 費目クラスのインスタンス
 * @param {teasp.Tsf.Job|null} job ジョブクラスのインスタンス
 * @param {Object} chargeDept 負担部署
 * @param {Object} extraItem1 拡張項目１
 * @param {Object} extraItem2 拡張項目２
 * @param {Object} cardObj カード明細レコード
 * @param {string|null} expenseType 精算区分
 * @param {Object} ng NGのリスト
 * @returns {Object}
 */
teasp.Tsf.ExpApply.prototype.createEmpExpFromCard = function(expItem, job, chargeDept, extraItem1, extraItem2, cardObj, expenseType, ng){
    // 詳細欄の値を作成
    var detail = '';
    var tempAttach = '';

    // J'sNAVI分追加の際、既存箇所に影響が無いようにnullにしておく
    var tempStartName = null;
    var tempEndName = null;
    var tempItem = null;

    var cardId = cardObj.Id;
    var jsNaviObjId = null;
    var functionCode = null;
    var data01 = null;
    var jsNaviStatus = '';			// #7470 実績読込から読み込んだ時に表示する出張手配ステータス
    var date = teasp.util.date.formatDate(cardObj.Date__c);		// #7470 初期値は日付
    var systemType = null;
    var publisher = null;

    if(cardObj.RecordType && cardObj.RecordType.Name == '領収書'){ // 領収書入力の場合
        detail = cardObj.Note__c || null;           // 摘要
        publisher = cardObj.Publisher__c || null;   //発行者（店名）
        tempAttach = (cardObj.Attachments && cardObj.Attachments.length > 0 ? teasp.Tsf.util.toJson(cardObj.Attachments[0]) : null);
    }else if(cardObj.JsNaviId__c){ // J'sNAVIの場合
    	cardId = null;	// カード明細オブジェクトは使用しないのでクリアする
    	jsNaviObjId = cardObj.Id;
    	functionCode = cardObj.FunctionCode__c || null;
    	data01 = cardObj.Data01__c || null;
    	data11 = cardObj.Data11__c || null;
        systemType = cardObj.SystemType__c || null;
    	detail = cardObj.Note__c || null;
        tempStartName = cardObj.Data03__c || null;
        tempEndName = cardObj.Data04__c || null;
        tempItem = 'JTB';

        // #7470 実績読込から取り込んだデータの日付を出発日にする
        date = teasp.util.date.formatDate(cardObj.StartDate__c);

        // #7470　出張手配ステータスを表示(#7352)
        var statusCd = cardObj.Data11__c || null;

        if (statusCd != null) {

            // J'sNavi 旧I/F用のステータス変換マップ（新I/Fの場合は変換しない）
        	var JL = {'なし':'','取消':'取消'};
        	var NH = {'なし':'','取消':'取消'};
        	var BH = {'NEW':'新規予約','REF':'データ参照','CNL':'取消'};
        	var JE = {'購入':'購入','取消':'取消','受取':'JR券受取','出１':'出場イレギュラーケース１','出1':'出場イレギュラーケース１','出２':'出場イレギュラーケース２','出2':'出場イレギュラーケース２','出場':'ICカードでの出場','入場':'ICカードでの入場','払戻':'払戻発生'};
        	var DT = {'0':'取消済','1':'旅程表作成中','2':'発注データ送信待ち','3':'手配依頼済','4':'予約回答受信済','5':'最終確認待ち','6':'最終確認送信待ち','7':'最終確認済','8':'最終確認済','9':'切符受渡済'};
        	var AD = {'0':'取消済','2':'手配済','9':'実績データ作成済'};
        	var GT = {'NEW':'新規予約済','CHG':'変更済','CXL':'取消済'};
        	var DP = {'40':'予約済','80':'取消済'};

        	var jsNaviStatus = statusCd;
        	var val = null;

    		// JAL
    		if (functionCode == 'JL') {
    			val = JL[statusCd];

    		// ANA
    		} else if (functionCode == 'NH') {
    			val = NH[statusCd];

    		// JR
    		} else if (functionCode == 'JE') {
    			val = JE[statusCd];

    		// るるぶトラベル
    		} else if (functionCode == 'BH') {
    			val = BH[statusCd];

    		// 代理店発注
    		} else if (functionCode == 'DT') {
    			val = DT[statusCd];

    		// GTA
    		} else if (functionCode == 'GT') {
    			val = GT[statusCd];

    		// Amadeus
    		} else if (functionCode == 'AD') {
    			val = AD[statusCd];

    		// ダイナミックパッケージ（るるぶトラベルツアー）
    		} else if (functionCode == 'DP') {
    			val = DP[statusCd];
    		}

            // ステータスの説明を取得できた場合
            // （新I/Fの場合val=nullのため、ステータスは変換されない）
    		if (val != null && val != '') {
    			jsNaviStatus = statusCd + '(' + val + ')';
    		}
        }
    }else{
        detail = (cardObj.Note__c || null);
        publisher = cardObj.Publisher__c || null;   //発行者（店名）
    }
    var res = {
        _uniqKey                : teasp.Tsf.ExpApply.createUniqKey(),
        Id                      : null,
        EmpId__c                : this.getEmpId(),                                      // 社員ID
        ExpApplyId__c           : this.getId(),                                         // 交通費申請
        ExpApplyId__r           : {
            ExpPreApplyId__c    : this.getExpPreApplyId()                               // 経費事前申請ID
        },
        ExpItemId__c            : (expItem != null ? expItem.getId() : null),             // 費目
        ExpItemId__r            : {
            Name                : (expItem != null ? expItem.getName() : null),
        },
        Date__c                 : date,          										// 日付（#7470 実績読込の場合は出発日を設定）
        CardStatementLineId__c  : cardId,                                               // カード明細ID
        CardStatementLineId__r  : {
            Name                : cardObj.Name,
            RecordType : {
                Name            : (cardObj.RecordType && cardObj.RecordType.Name || null)
            }
        },
        Publisher__c            : publisher,                                            // 発行者（店名）
        _temp_attach            : tempAttach,                                           // 領収書読込の添付情報
        Cost__c                 : cardObj.Amount__c,                                    // 金額
        // 外貨
        CurrencyName__c         : cardObj.FCName__c || null,                            // 通貨名
        CurrencyRate__c         : cardObj.FCRate__c || null,                            // 換算レート
        ForeignAmount__c        : cardObj.FCAmount__c || null,                          // 現地金額
        // 支払先、支払日
        PayeeId__c              : cardObj.PayeeId__c || null,                           // 支払先ID
        PayeeId__r              : (cardObj.PayeeId__r ? {
            Name                : cardObj.PayeeId__r.Name         || null,
            PayeeType__c        : cardObj.PayeeId__r.PayeeType__c || '1',
            ExpenseType__c      : cardObj.PayeeId__r.ExpenseType__c || null
        } : null),
        PayeeName__c            : (cardObj.PayeeId__r ? cardObj.PayeeId__r.Name : null), // 支払先名
        PaymentDate__c          : teasp.util.date.formatDate(cardObj.PaymentDate__c),   // 支払日
        // 単価、数量
        UnitPrice__c            : (expItem != null ? (expItem.isEnableQuantity() ? cardObj.Amount__c : null) : null),// 単価
        Quantity__c             : (expItem != null ? (expItem.isEnableQuantity() ? 1 : null) : null),                // 数量
        //
        Detail__c               : detail,                                               // 詳細
        IsPaid__c               : false,                                                // 支払い済み
        JobId__c                : (job && job.getId() || null),                         // 勤怠ジョブマスタ
        JobId__r                : (job ? {
            JobCode__c          : job.getCode(),
            StartDate__c        : job.getStartDate(),
            EndDate__c          : job.getEndDate(),
            Name                : job.getName()
        } : null),
        ChargeDeptId__c         : chargeDept.Id || null,
        ChargeDeptId__r         : chargeDept.Id ? {
            DeptCode__c         : chargeDept.DeptCode__c || null,
            Name                : chargeDept.Name || null
        } : null,
        Order__c                : 1,                                                    // 並び順
        Receipt__c              : (expItem != null ? expItem.isReceipt() : null),       // 領収書あり
        Item__c                 : tempItem,                                             // 外部入力元
        // 税
        TaxType__c              : null,                                                 // 消費税タイプ
        TaxAuto__c              : true,                                                 // 消費税自動計算
        TaxRate__c              : null,                                                 // 消費税率
        Tax__c                  : null,                                                 // 消費税額
        WithoutTax__c           : null,                                                 // 税抜金額
        // 交通費
        TransportType__c        : (expItem != null ? (expItem.getTransportType() == '1' ? '2' : expItem.getTransportType()) : null), // 交通費種別
        startCode__c            : null,                                                 // 発駅コード
        startName__c            : tempStartName,                                        // 発駅名
        endCode__c              : null,                                                 // 着駅コード
        endName__c              : tempEndName,                                           // 着駅名
        roundTrip__c            : false,                                                // 往復フラグ
        Route__c                : null,                                                 // 経路
        // 拡張
        ExtraItem1__c           : extraItem1 || null,                                   // 拡張項目1
        ExtraItem2__c           : extraItem2 || null,                                   // 拡張項目2
        ExpenseType__c          : expenseType || null,                                  // 精算区分
        Text__c                 : jsNaviStatus,											// #7352 出張手配ステータス
        JsNaviActualId__c       : jsNaviObjId,
        JsNaviActualId__r       : jsNaviObjId ? {
            FunctionCode__c     : functionCode,
            Data01__c           : data01,
            SystemType__c       : systemType
        } : null,
        // 会議・交際費
        InternalParticipantsNumber__c : cardObj.InternalParticipantsNumber__c || null,
        InternalParticipants__c : cardObj.InternalParticipants__c || null,
        ExternalParticipantsNumber__c : cardObj.ExternalParticipantsNumber__c || null,
        ExternalParticipants__c : cardObj.ExternalParticipants__c || null,
        PlaceName__c : cardObj.PlaceName__c || null,
        PlaceAddress__c : cardObj.PlaceAddress__c || null
    };
    if(job && !job.activeOnDate(res.Date__c)){
        if(!ng.f){
            ng.f = { ids: [], message: teasp.message.getLabel('tf10001810') }; // 利用日とジョブの有効期間が整合しません。
        }
        ng.f.ids.push(cardObj.Id);
    }
    if(cardObj.Amount__c < 0 && (expItem && !expItem.isAllowMinus())){
        if(!ng.f){
            ng.f = { ids: [], message: teasp.message.getLabel('tf10008850') }; // 読込対象にマイナスの金額がありますが、マイナス入力しない費目が指定されているため読み込めません。
        }
        ng.f.ids.push(cardObj.Id);
    }
    if(expItem != null && expItem.isForeignFlag()  // 外貨入力する費目の場合、通貨名、レート、外貨金額のいずれかがセットされてなければ入力不可（エラー）にする
    && (!cardObj.FCName__c || typeof(cardObj.FCRate__c) != 'number' || typeof(cardObj.FCAmount__c) != 'number')){
        if(!cardObj.FCName__c && typeof(cardObj.FCRate__c) != 'number' && typeof(cardObj.FCAmount__c) != 'number'){
            var foreign = tsfManager.getForeignByName(teasp.Tsf.JPY);
            if(foreign){
                var rateV = foreign.getRateByDate(res.Date__c); // 換算レートを取得
                var rate = teasp.util.currency.formatDecimal(rateV , teasp.constant.CU_DEC_POINT_MIN, teasp.constant.CU_DEC_POINT_MAX); // 換算レート
                var o = teasp.Tsf.ExpDetail.calcForeign(res.Cost__c, rate.n, res.Cost__c, 0, 0, expItem.isAllowMinus()); // 日付時点の換算レートで再計算する
                res.CurrencyName__c  = teasp.Tsf.JPY;
                res.CurrencyRate__c  = rate.n;
                res.ForeignAmount__c = o.amount;
            }else{
                if(!ng.f){
                    ng.f = { ids: [], message: teasp.message.getLabel('tf10002050') }; // 読み込み元のデータに外貨の情報がありません。
                }
                ng.f.ids.push(cardObj.Id);
                res.CurrencyName__c = null;
            }
        }else{
            if(!ng.f){
                ng.f = { ids: [], message: teasp.message.getLabel('tf10008170') }; // 読み込み元データの外貨の情報が不正です。
            }
            ng.f.ids.push(cardObj.Id);
            res.CurrencyName__c = null;
        }
    }
    if(expItem != null && expItem.isTaxFlag()){ // 税入力する費目
        var taxType      = expItem.getTaxType() || '0';                 // 税タイプ
        var allowMinus   = expItem.isAllowMinus();                      // マイナス可
        var taxRoundFlag = tsfManager.getTaxRoundFlag();                // 端数処理
        var taxAuto      = true;                                        // 手入力ボタン
        var taxRate      = expItem.getTaxRate(res.Date__c);             // 税率
        var cost         = res.Cost__c;                                 // 金額

        var o = teasp.Tsf.ExpDetail.calcTax(
                cost,       // 金額
                0,          // withoutTax
                0,          // tax
                0,          // flag
                taxType,
                taxRate,
                taxAuto,
                taxRoundFlag,
                allowMinus
                );

        res.TaxType__c      = taxType;
        res.TaxRate__c      = (taxType != '0' ? taxRate : null);
        res.Tax__c          = '' + o.tax;
        res.WithoutTax__c   = '' + o.withoutTax;
    }

    // 人数割金額の計算(参加者人数が未入力の場合はnullに設定する)
    var price = res.WithoutTax__c || res.Cost__c;
    var totalParticipants = (teasp.util.currency.string2number('' + res.InternalParticipantsNumber__c).num || 0)
        + (teasp.util.currency.string2number('' + res.ExternalParticipantsNumber__c).num || 0);
    res.AmountPerParticipant__c = totalParticipants ? teasp.Tsf.Currency.roundSameAsSalesforce(price / totalParticipants) : null;
    return res;
};
/**
 * 経費連携から経費明細データを作成
 *
 * @param {teasp.Tsf.ExpItem} expItem 費目クラスのインスタンス
 * @param {teasp.Tsf.Job|null} job ジョブクラスのインスタンス
 * @param {Object} chargeDept 負担部署
 * @param {Object} extraItem1 拡張項目１
 * @param {Object} extraItem2 拡張項目２
 * @param {Object} extObj 経費連携レコード
 * @param {string|null} expenseType 精算区分
 * @param {Object} ng NGのリスト
 * @returns {Object}
 */
teasp.Tsf.ExpApply.prototype.createEmpExpFromExternalExpense = function(expItem, job, chargeDept, extraItem1, extraItem2, extObj, expenseType, ng){
    var detail = (extObj.Note__c || null);
    var usageDate = teasp.util.date.formatDate(extObj.UsageDate__c);
    var res = {
        _uniqKey                : teasp.Tsf.ExpApply.createUniqKey(),
        Id                      : null,
        EmpId__c                : this.getEmpId(),                                     // 社員ID
        ExpApplyId__c           : this.getId(),                                        // 交通費申請
        ExpApplyId__r           : {
            ExpPreApplyId__c    : this.getExpPreApplyId()                              // 経費事前申請ID
        },
        ExpItemId__c            : (expItem != null ? expItem.getId() : null),          // 費目
        ExpItemId__r            : {
            Name                : (expItem != null ? expItem.getName() : null),
        },
        Date__c                 : usageDate,        // 日付
        CardStatementLineId__c  : null,             // カード明細ID
        CardStatementLineId__r  : null,
        ExternalICExpenseId__c  : extObj.Id,        // 経費連携ID
        ExternalICExpenseId__r  : {
            UsageDate__c        : usageDate,
            Amount__c           : extObj.Amount__c
        },
        Cost__c                 : extObj.Amount__c, // 金額
        // 外貨
        CurrencyName__c         : null,   // 通貨名
        CurrencyRate__c         : null,   // 換算レート
        ForeignAmount__c        : null,   // 現地金額
        // 支払先、支払日
        PayeeId__c              : null,   // 支払先ID
        PayeeId__r              : null,
        PayeeName__c            : null,   // 支払先名
        PaymentDate__c          : null,   // 支払日
        // 単価、数量
        UnitPrice__c            : (expItem != null ? (expItem.isEnableQuantity() ? extObj.Amount__c : null) : null),// 単価
        Quantity__c             : (expItem != null ? (expItem.isEnableQuantity() ? 1 : null) : null),               // 数量
        //
        Detail__c               : detail,                                               // 詳細
        IsPaid__c               : false,                                                // 支払い済み
        JobId__c                : (job && job.getId() || null),                         // 勤怠ジョブマスタ
        JobId__r                : (job ? {
            JobCode__c          : job.getCode(),
            StartDate__c        : job.getStartDate(),
            EndDate__c          : job.getEndDate(),
            Name                : job.getName()
        } : null),
        ChargeDeptId__c         : chargeDept.Id || null,
        ChargeDeptId__r         : chargeDept.Id ? {
            DeptCode__c         : chargeDept.DeptCode__c || null,
            Name                : chargeDept.Name || null
        } : null,
        Order__c                : 1,                                                    // 並び順
        Receipt__c              : (expItem != null ? expItem.isReceipt() : null),       // 領収書あり
        Item__c                 : teasp.Tsf.ITEM_EXTERNAL,                              // TODO:外部入力元（仮の値をセット）
        // 税
        TaxType__c              : null,                                                 // 消費税タイプ
        TaxAuto__c              : true,                                                 // 消費税自動計算
        TaxRate__c              : null,                                                 // 消費税率
        Tax__c                  : null,                                                 // 消費税額
        WithoutTax__c           : null,                                                 // 税抜金額
        // 交通費
        TransportType__c        : (expItem != null ? (expItem.getTransportType() == '1' ? '2' : expItem.getTransportType()) : null), // 交通費種別
        startCode__c            : null,                                                 // 発駅コード
        startName__c            : extObj.StationNameFrom__c,                            // 発駅名
        endCode__c              : null,                                                 // 着駅コード
        endName__c              : extObj.StationNameTo__c,                              // 着駅名
        roundTrip__c            : false,                                                // 往復フラグ
        Route__c                : null,                                                 // 経路
        // 拡張
        ExtraItem1__c           : extraItem1 || null,                                   // 拡張項目1
        ExtraItem2__c           : extraItem2 || null,                                   // 拡張項目2
        ExpenseType__c          : expenseType || null,                                  // 精算区分
        JsNaviActualId__c       : null,
        JsNaviActualId__r       : null,
        // 会議・交際費
        InternalParticipantsNumber__c : extObj.InternalParticipantsNumber__c || null,
        InternalParticipants__c : extObj.InternalParticipants__c || null,
        ExternalParticipantsNumber__c : extObj.ExternalParticipantsNumber__c || null,
        ExternalParticipants__c : extObj.ExternalParticipants__c || null,
        PlaceName__c : extObj.PlaceName__c || null,
        PlaceAddress__c : extObj.PlaceAddress__c || null
    };
    if(job && !job.activeOnDate(res.UsageDate__c)){
        if(!ng.f){
            ng.f = { ids: [], message: teasp.message.getLabel('tf10001810') }; // 利用日とジョブの有効期間が整合しません。
        }
        ng.f.ids.push(extObj.Id);
    }
    if(expItem != null && expItem.isForeignFlag()){  // 外貨入力する費目の場合、通貨名、レート、外貨金額のいずれかがセットされてなければ入力不可（エラー）にする
        var foreign = tsfManager.getForeignByName(teasp.Tsf.JPY);
        if(foreign){
            var rateV = foreign.getRateByDate(res.Date__c); // 換算レートを取得
            var rate = teasp.util.currency.formatDecimal(rateV , teasp.constant.CU_DEC_POINT_MIN, teasp.constant.CU_DEC_POINT_MAX); // 換算レート
            var o = teasp.Tsf.ExpDetail.calcForeign(res.Cost__c, rate.n, res.Cost__c, 0, 0, expItem.isAllowMinus()); // 日付時点の換算レートで再計算する
            res.CurrencyName__c  = teasp.Tsf.JPY;
            res.CurrencyRate__c  = rate.n;
            res.ForeignAmount__c = o.amount;
        }else{
            if(!ng.f){
                ng.f = { ids: [], message: teasp.message.getLabel('tf10002050') }; // 読み込み元のデータに外貨の情報がありません。
            }
            ng.f.ids.push(cardObj.Id);
            res.CurrencyName__c = null;
        }
    }
    if(expItem != null && expItem.isTaxFlag()){ // 税入力する費目
        var taxType      = expItem.getTaxType() || '0';                 // 税タイプ
        var allowMinus   = expItem.isAllowMinus();                      // マイナス可
        var taxRoundFlag = tsfManager.getTaxRoundFlag();                // 端数処理
        var taxAuto      = true;                                        // 手入力ボタン
        var taxRate      = expItem.getTaxRate(usageDate);               // 税率
        var cost         = res.Cost__c;                                 // 金額

        var o = teasp.Tsf.ExpDetail.calcTax(
                cost,       // 金額
                0,          // withoutTax
                0,          // tax
                0,          // flag
                taxType,
                taxRate,
                taxAuto,
                taxRoundFlag,
                allowMinus
                );

        res.TaxType__c      = taxType;
        res.TaxRate__c      = (taxType != '0' ? taxRate : null);
        res.Tax__c          = '' + o.tax;
        res.WithoutTax__c   = '' + o.withoutTax;
    }

    // 人数割金額の計算(参加者人数が未入力の場合はnullに設定する)
    var price = res.WithoutTax__c || res.Cost__c;
    var totalParticipants = (teasp.util.currency.string2number('' + res.InternalParticipantsNumber__c).num || 0)
        + (teasp.util.currency.string2number('' + res.ExternalParticipantsNumber__c).num || 0);
    res.AmountPerParticipant__c = totalParticipants ? teasp.Tsf.Currency.roundSameAsSalesforce(price / totalParticipants) : null;
    return res;
};
/**
 * CSV のレコードから経費明細データを作成
 * @param {Object} COL
 * @param {Object} record
 * @param {string=} expenseType
 * @returns {Object}
 */
teasp.Tsf.ExpApply.prototype.createEmpExpFromCsv = function(COL, record, expenseType){
    var expItem = tsfManager.getExpItemByItemCode(record[COL.ITEM_CODE.key]);
    var payee = record[COL.PAYEE_INFO.key];
    var dept  = record[COL.DEPT_INFO.key];
    var job   = record[COL.JOB_INFO.key];
    var res = {
        _uniqKey                : teasp.Tsf.ExpApply.createUniqKey(),
        Id                      : null,
        EmpId__c                : this.getEmpId(),                                      // 社員ID
        ExpApplyId__c           : null,                                                 // 交通費申請
        ExpItemId__c            : expItem.getId(),                                      // 費目
        ExpItemId__r            : {
            Name                : expItem.getName()
        },
        Date__c                 : record[COL.DATE.key],                                 // 日付
        CardStatementLineId__c  : null,                                                 // カード明細ID
        Cost__c                 : teasp.Tsf.util.getNumStr(record[COL.COST.key]),       // 金額
        // 外貨
        CurrencyName__c         : record[COL.CURRENCY_NAME.key] || null,                // 通貨名
        CurrencyRate__c         : teasp.Tsf.util.getNumStr(record[COL.CURRENCY_RATE.key]), // 換算レート
        ForeignAmount__c        : teasp.Tsf.util.getNumStr(record[COL.FOREIGN_AMOUNT.key]),// 現地金額
        // 支払先、支払日
        PayeeId__c              : (payee && payee.PayeeId) || null,                     // 支払先ID
        PayeeId__r              : payee ? {
            Name                : payee.PayeeName || null,
            PayeeType__c        : payee.PayeeType || null,
            ExpenseType__c      : payee.PayeeExpenseType || null
        } : null,
        PayeeName__c            : (payee && payee.PayeeName) || null,                   // 支払先名
        PaymentDate__c          : record[COL.PAYMENT_DATE.key] || null,                 // 支払日
        // 単価、数量
        UnitPrice__c            : teasp.Tsf.util.getNumStr(record[COL.UNIT_PRICE.key]), // 単価
        Quantity__c             : teasp.Tsf.util.getNumStr(record[COL.QUANTITY.key]),   // 数量
        //
        Detail__c               : record[COL.DETAIL.key] || null,                       // 詳細
        IsPaid__c               : false,                                                // 支払い済み
        JobId__c                : (job && job.JobId) || null,                           // 勤怠ジョブマスタ
        JobId__r                : job ? {
            JobCode__c          : job.JobCode,
            StartDate__c        : job.JobStartDate || null,
            EndDate__c          : job.JobEndDate || null,
            Name                : job.JobName
        } : null,
        ChargeDeptId__c         : (dept && dept.ChargeDeptId) || null,
        ChargeDeptId__r         : dept ? {
            DeptCode            : dept.ChargeDeptCode,
            Name                : dept.ChargeDeptName,
            ExpItemClass__c     : dept.ExpItemClass || null
        } : null,
        Order__c                : 1,                                                    // 並び順
        Receipt__c              : expItem.isReceipt(),                                  // 領収書あり
        Item__c                 : 'csv',                                                // 外部入力元
        // 税
        TaxType__c              : record[COL.TAX_TYPE.key],                             // 消費税タイプ
        TaxAuto__c              : record[COL.TAX_AUTO.key],                             // 消費税自動計算
        TaxRate__c              : teasp.Tsf.util.parseInt(record[COL.TAX_RATE.key]),   // 消費税率
        Tax__c                  : teasp.Tsf.util.getNumStr(record[COL.TAX.key]),        // 消費税額
        WithoutTax__c           : teasp.Tsf.util.getNumStr(record[COL.WITHOUT_TAX.key]),// 税抜金額
        // 交通費
        TransportType__c        : record[COL.TRANSPORT_TYPE.key],                       // 交通費種別
        startCode__c            : null,                                                 // 発駅コード
        startName__c            : record[COL.START_NAME.key] || null,                   // 発駅名
        endCode__c              : null,                                                 // 着駅コード
        endName__c              : record[COL.END_NAME.key] || null,                     // 着駅名
        roundTrip__c            : record[COL.ROUND_TRIP.key] || false,                  // 往復フラグ
        Route__c                : null,                                                 // 経路
        // 拡張
        ExtraItem1__c           : record[COL.EXTRA_ITEM_1.key] || null,                 // 拡張項目1
        ExtraItem2__c           : record[COL.EXTRA_ITEM_2.key] || null,                 // 拡張項目2
        ExpenseType__c          : expenseType || null                                   // 精算区分
    };
    return res;
};

teasp.Tsf.ExpApply.prototype.createDayExp = function(date, expItemId, obj, word, cost){
    var expItem = tsfManager.getExpItemById(expItemId);
    if(!expItem){
        return null;
    }
    var d = teasp.util.date.formatDate(date);
    var res = {
        Id                      : null,
        EmpId__c                : this.getEmpId(),              // 社員ID
        ExpApplyId__c           : this.getId(),                 // 交通費申請
        ExpApplyId__r           : {
            ExpPreApplyId__c    : this.getExpPreApplyId()       // 経費事前申請ID
        },
        ExpItemId__c            : expItemId,                    // 費目
        ExpItemId__r            : {
            Id                  : expItemId,
            Name                : expItem.getName()
        },
        TransportType__c        : expItem.getTransportType(),   // 交通費種別
        Date__c                 : d,                            // 日付
        Cost__c                 : (cost || expItem.getCost(d)), // 金額
        JobId__c                : obj.ChargeJobId__c || null,   // ジョブID
        JobId__r                : obj.ChargeJobId__r || null,   // ジョブ
        Detail__c               : (word ? (word + ' ' + teasp.util.date.formatDate(date, 'SLA')) : null) // 詳細
    };
    if(expItem.isEnableQuantity()){ // 数量あり
        res.UnitPrice__c        = res.Cost__c;
        res.Quantity__c         = 1;
    }
    if(expItem.isForeignFlag()){ // 外貨入力＝オンの費目の場合、暫定の値をセット
        res.ForeignAmount__c    = res.Cost__c;
        res.CurrencyName__c     = null;
        res.CurrencyRate__c     = 1;
        if(expItem.getCurrencyName()){
            res.ForeignAmount__c = expItem.getCost();
            res.CurrencyName__c  = expItem.getCurrencyName();
            var foreign = tsfManager.getForeignByName(res.CurrencyName__c);
            res.CurrencyRate__c  = (foreign ? foreign.getRateByDate(d) : 1);  // 換算レートを取得
        }
    }
    if(expItem.isTaxFlag()){ // 税入力＝オンの費目
        var taxType      = expItem.getTaxType();                // 税タイプ
        var allowMinus   = expItem.isAllowMinus();              // マイナス可
        var taxRoundFlag = tsfManager.getTaxRoundFlag();        // 端数処理
        var taxRate      = expItem.getTaxRate();                // 税率
        var taxAuto      = true;
        var o = teasp.Tsf.ExpDetail.calcTax(res.Cost__c || 0, 0, 0, 0, taxType, taxRate, taxAuto, taxRoundFlag, allowMinus);
        res.WithoutTax__c   = o.withoutTax;
        res.Tax__c          = o.tax;
        res.TaxType__c      = taxType;
        res.TaxAuto__c      = taxAuto;
    }
    //社内参加者
    if(expItem.isInternalParticipants()){
        res.InternalParticipants__c = obj.InternalParticipants__c;
        res.InternalParticipantsNumber__c = obj.OurNumber__c;
    }
    //社外参加者
    if(expItem.isExternalParticipants()){
        res.ExternalParticipants__c = obj.ExternalParticipants__c;
        res.ExternalParticipantsNumber__c = obj.TheirNumber__c;
    }
    //店舗
    if(expItem.isPlace()){
        res.PlaceName__c = obj.PlaceName__c;
        res.PlaceAddress__c = obj.PlaceAddress__c;
    }
    return res;
};

teasp.Tsf.ExpApply.prototype.getEmpExps = function(){
    var exps = this.obj.EmpExp__r || [];
    dojo.forEach(exps, function(exp){
        if(!exp._route){
            exp._route = new teasp.Tsf.EmpExp(exp);
        }
    }, this);
    return exps;
};

teasp.Tsf.ExpApply.prototype.addEmpExps = function(exps){
    this.obj.EmpExp__r = (this.obj.EmpExp__r || []).concat(exps);
    return this.obj.EmpExp__r;
};

teasp.Tsf.ExpApply.prototype.setEmpExpComplex = function(exps){
    var nots = [];
    var others = {};
    dojo.forEach((exps || []), function(exp){
        exp._route = new teasp.Tsf.EmpExp(exp);
        if(!exp.ExpApplyId__c){
            nots.push(exp);
        }else{
            var lst = others[exp.ExpApplyId__c];
            if(!lst){
                lst = others[exp.ExpApplyId__c] = [];
            }
            lst.push(exp);
        }
    });
    this.obj.EmpExp__r = nots;
    this.others = others;
};

teasp.Tsf.ExpApply.prototype.getSectionDetailCount = function(){
    var n = 1;
    for(var key in this.others){
        if(this.others.hasOwnProperty(key)){
            n++;
        }
    }
    return n;
};

teasp.Tsf.ExpApply.prototype.getSectionDetailObjs = function(){
    var lst = [];
    lst.push({
        values  : this.obj.EmpExp__r,
        id      : null,
        empId   : this.obj.EmpId__c,
        title   : teasp.message.getLabel(tsfManager.isExpWorkflow() ? 'tf10001490' : 'tf10001491'), // 経費精算（未申請） or 経費精算（未確定）
        assist  : {
            ChargeDeptId__r  : { ExpItemClass__c: tsfManager.getTargetEmp().getDeptExpItemClass() },
            ExpenseType__c   : null
        }
    });
    var titleStr = teasp.message.getLabel('tf10000550') + ' {0}  ({1})'; // 精算申請番号
    for(var key in this.others){
        if(this.others.hasOwnProperty(key)){
            var vz = this.others[key];
            var v = vz[0];
            lst.push({
                values  : vz,
                id      : v.ExpApplyId__c,
                empId   : v.EmpId__c,
                title   : teasp.Tsf.util.formatString(titleStr
                        , ((v.ExpApplyId__r && v.ExpApplyId__r.ExpApplyNo__c) || '-')
                        , ((v.ExpApplyId__r && teasp.constant.getDisplayStatus(teasp.Tsf.ObjBase.RepStatus(v.ExpApplyId__r.StatusC__c))) || teasp.message.getLabel('tf10000550'))), // tm10003560
                assist  : {
                    ChargeDeptId__r  : v.ExpApplyId__r.ChargeDeptId__r || { ExpItemClass__c: tsfManager.getTargetEmp().getDeptExpItemClass() },
                    ExpenseType__c   : v.ExpApplyId__r.ExpenseType__c || null
                }
            });
        }
    }
    return lst;
};

/**
 * 申請取消で明細をばらすか
 * ※ V5.10 からばらさないことになったので false 固定
 */
teasp.Tsf.ExpApply.prototype.isSolve = function(){
//    return (this.getExpPreApplyId() == null);
    return false;
};

teasp.Tsf.ExpApply.prototype.getExpPreApply = function(){
    return this.expPreApply || null;
};

teasp.Tsf.ExpApply.prototype.setExpPreApply = function(o){
    this.expPreApply = o;
    this.expDays = [];
    this.socialExp = null;
    dojo.forEach((o.obj.ExpPreApplyDay__r || []), function(p){
        if(p.AllowanceItemId__c){
            var exp = this.createDayExp(p.Date__c, p.AllowanceItemId__c, o.obj, teasp.message.getLabel('tf10000890')); // 日当
            if(exp){
                this.expDays.push(exp);
            }
        }
        if(p.HotelItemId__c){
            var exp = this.createDayExp(p.Date__c, p.HotelItemId__c, o.obj, teasp.message.getLabel('tf10000030')); // 宿泊手当
            if(exp){
                this.expDays.push(exp);
            }
        }
    }, this);
    if(o.obj.SocialExpItemId__c){
        this.socialExp = this.createDayExp(o.obj.StartDate__c, o.obj.SocialExpItemId__c, o.obj, null, o.obj.TotalAmount__c);
    }
    this.linkPreApplyAll();
};

teasp.Tsf.ExpApply.prototype.linkPreApplyAll = function(){
    var exps = (this.obj.EmpExp__r || []);
    for(var i = exps.length - 1 ; i >= 0 ; i--){
        if(exps[i]._removed){
            exps.splice(i, 1);
        }
    }
    dojo.forEach(exps, function(exp){
        this.linkPreApply(exp);
    }, this);

    if(tsfManager.isDiffView()){
        var removes = [];
        var o = this.expPreApply;
        var pexps = (o && o.obj.EmpExp__r) || [];

        if(this.obj.JsNaviData){
            for(i = 0; i < exps.length; i++){
            	if(exps[i].Item__c == 'JTB'){
                    // JTB明細は比較を行わない
            	    exps[i]._addJsNavi = true;
            	    exps[i].jsnaviEqualFlag = true;
            	}
            }
        }

        for(i = 0 ; i < pexps.length ; i++){
            var p = pexps[i];
            if(p.Item__c == 'JTB'){
           		continue;
            }
            for(var j = 0 ; j < exps.length ; j++){
                if(exps[j].preObj == p){
                    break;
                }
            }
            if(j >= exps.length){ // 紐づけられている明細がない＝削除された
                p._removed = true;
                p.Order__c = (exps.length + removes.length);
                removes.push(p);
            }
        }
        for(i = 0 ; i < this.expDays.length ; i++){
            var p = this.expDays[i];
            for(var j = 0 ; j < exps.length ; j++){
                if(exps[j].preObj == p){
                    break;
                }
            }
            if(j >= exps.length){ // 紐づけられている明細がない＝削除された
                p._removed = true;
                p.Order__c = (exps.length + removes.length);
                removes.push(p);
            }
        }
        if(this.socialExp){
            var p = this.socialExp;
            for(var j = 0 ; j < exps.length ; j++){
                if(exps[j].preObj == p){
                    break;
                }
            }
            if(j >= exps.length){ // 紐づけられている明細がない＝削除された
                p._removed = true;
                p.Order__c = (exps.length + removes.length);
                removes.push(p);
            }
        }

        exps = exps.concat(removes);
        exps = exps.sort(function(a, b){
            var ad = teasp.util.date.formatDate(a.Date__c);
            var bd = teasp.util.date.formatDate(b.Date__c);
            if(ad == bd){
                return a.Order__c - b.Order__c;
            }
            return (ad < bd ? -1 : 1);
        });
        this.obj.EmpExp__r = exps;
    }
};

teasp.Tsf.ExpApply.prototype.linkPreApply = function(exp){
    if(exp.PreEmpExpId__c){ // 事前申請の社員立替交通費に紐づけあり
        var o = this.expPreApply;
        var pexps = (o && o.obj.EmpExp__r) || [];
        // 事後申請の明細と事前申請の社員立替交通費のオブジェクトを紐づける
        for(var i = 0 ; i < pexps.length ; i++){
            var p = pexps[i];
            if(exp.PreEmpExpId__c == p.Id){
                exp.preObj = p;
                break;
            }
        }
    }else if(exp.PreExpItemId__c){ // 事前申請の日当・宿泊費or会議・交際費に紐づけあり
        if(this.socialExp && exp.PreExpItemId__c == this.socialExp.ExpItemId__c){
            exp.preObj = this.socialExp;
        }else{
            var d = teasp.util.date.formatDate(exp.Date__c);
            // 事後申請の明細と事前申請の日当・宿泊費のオブジェクトを紐づける
            for(var i = 0 ; i < this.expDays.length ; i++){
                var p = this.expDays[i];
                if(p.Date__c == d && exp.PreExpItemId__c == p.ExpItemId__c){ // 日付と費目でマッチング
                    exp.preObj = p;
                    break;
                }
            }
        }
    }
};

/**
 * 差異を表示可能か
 * @returns {Boolean}
 */
teasp.Tsf.ExpApply.prototype.canDiffView = function(){
    return (this.getExpPreApplyId() ? true : false);
};

/**
 * 新規作成か
 *
 * @returns {boolean}
 */
teasp.Tsf.ExpApply.prototype.isCreateFlag = function(){
    return (this.obj.createFlag || false);
};

/**
 * 引数のオブジェクトに要素を追加
 */
teasp.Tsf.ExpApply.prototype.addElement = function(obj){
    obj.createFlag = this.isCreateFlag();
};

/**
 * 精算日
 *
 * @returns {string}
 */
teasp.Tsf.ExpApply.prototype.getPayDate = function(){
    return teasp.util.date.formatDate(this.obj.payDate__c, 'SLA');
};

/**
 * 添付ファイル数を返す（申請レベルと明細レベルを合計）
 * @returns {number}
 */
teasp.Tsf.ExpApply.prototype.getAttachmentAllCount = function(){
    var cnt = 0;
    cnt += (this.obj.Attachments && this.obj.Attachments.length) || 0;
    dojo.forEach(this.obj.EmpExp__r || [], function(exp){
        cnt += (exp.Attachments && exp.Attachments.length) || 0;
    }, this);
    return cnt;
};

teasp.Tsf.ExpApply.prototype.filterEmpExp = function(filter){
    if(!this.obj.OrgEmpExp__r){
        this.obj.OrgEmpExp__r = this.obj.EmpExp__r || [];
    }
    var filtExpenseType = (filter && filter.expenseType) || null;
    var exps = [];
    dojo.forEach(this.obj.OrgEmpExp__r, function(exp){
        var expenseType = exp.ExpenseType__c || null;
        if(expenseType == filtExpenseType){
            exps.push(teasp.Tsf.Dom.clone(exp));
        }
    }, this);
    this.obj.EmpExp__r = exps;
};

teasp.Tsf.ExpApply.prototype.getPullExpenseTypes = function(){
    if(!this.expenseTypes){
        var ets = tsfManager.getTargetEmp().getExpenseTypes() || []; // 社員の精算区分候補
        if(!ets.length){
            var config = tsfManager.getInfo().getExpPreApplyConfigs();
            ets = config.expenseTypes || []; // 共通の精算区分候補
        }
        this.expenseTypes = teasp.Tsf.Dom.clone(ets);
    }
    var em1 = {};
    dojo.forEach(this.obj.OrgEmpExp__r || [], function(exp){
        var v = exp.ExpenseType__c || '';
        if(!this.isRemovedExp(exp.Id)){
            em1[v] = (typeof(em1[v]) == 'number' ? (em1[v] + 1) : 1);
        }
    }, this);
    var em2 = {};
    dojo.forEach(this.obj.EmpExp__r || [], function(exp){
        var v = exp.ExpenseType__c || '';
        if(!this.isRemovedExp(exp.Id)){
            em2[v] = (typeof(em2[v]) == 'number' ? (em2[v] + 1) : 1);
        }
    }, this);
    var em = teasp.Tsf.util.mixin(em1, em2);
    for(var v in em){
        if(!this.expenseTypes.contains(v)){
            if(!v){
                this.expenseTypes.unshift(v);
            }else{
                this.expenseTypes.push(v);
            }
        }
    }
    var lst = [];
    dojo.forEach(this.expenseTypes, function(et){
        lst.push({
            v : et,
            n : (et ? et : teasp.message.getLabel('ci00000220')) // なし
                   + ' ' + teasp.message.getLabel('tf10009580', (em[et] || 0)) // ({0}件)
        });
    });
    return lst;
};

/**
 * J'sNAVI Jr明細用の内容を取得する。
 * TODO サーバーとロジックが分かれているのでどこかに統一する
 * @param obj TsfPortalCtl.innerSyncJsNaviReserveData で格納したデータ
 */
teasp.Tsf.ExpApply.getJtbContent = function(obj){
	var content = '';
	return content;
};
