/**
 * 経費事前申請クラス
 *
 * @constructor
 */
teasp.Tsf.ExpPreApply = function(obj, rights, piwks, steps){
    this.obj = (obj || {});
    this.rights = rights;
    this.steps = steps;

    this.obj._uniqKey = teasp.Tsf.ExpPreApply.createUniqKey();
    this.mergePiwks(piwks || []);
    this.approved = this.isApproved();

    dojo.forEach(this.obj.ExpPreApplyDay__r || [], function(day){
        day._uniqKey = teasp.Tsf.ExpPreApply.createUniqKey();
    }, this);

    dojo.forEach(this.obj.EmpExp__r || [], function(exp){
        exp._uniqKey = teasp.Tsf.ExpPreApply.createUniqKey();
        teasp.Tsf.ObjBase.covertEmpExp(exp);
    }, this);

    dojo.forEach(this.obj.ExpApplications__r || [], function(ep){
        this.obj._payId     = ep.Id;
        this.obj._payStatus = ep.StatusC__c;
    }, this);

    this.obj._linked = [];
    dojo.forEach(this.obj.AdjustmentExpApply__r || [], function(ep){ // 経費精算の仮払申請（ProvisionalPaymentId__c）で参照されている
        this.obj._linked.push(ep);
    }, this);

    dojo.forEach(this.obj.ExpApplications__r || [], function(ep){ // 経費精算の事前申請（ExpPreApplyId__c）で参照されている
        this.obj._linked.push(ep);
    }, this);

    this.rebirthEmp();
    this.rebirthTicket();
    this.rebirthCoupon();
    this.rebirthForeign();
    this.rebirthProvisional();
};

teasp.Tsf.ExpPreApply.prototype = new teasp.Tsf.ObjBase();

teasp.Tsf.ExpPreApply.DESTINATION_TYPE_DOMESTIC = '1'; // 国内出張
teasp.Tsf.ExpPreApply.DESTINATION_TYPE_OVERSEA  = '2'; // 海外出張
teasp.Tsf.ExpPreApply.DESTINATION_TYPE_DAYTRIP  = '3'; // 日帰り交通費

teasp.Tsf.ExpPreApply.UNIQ_SEQ = 100; // ユニークであれば良いので、この値に深い意味はない

teasp.Tsf.ExpPreApply.createUniqKey = function(){
    return 'D' + teasp.Tsf.ExpPreApply.UNIQ_SEQ++;
};

/**
 * 非配列のレコードから配列のデータを作る
 *
 * @static
 * @param {Object} obj
 * @param {Array.<Object>} flds
 * @param {number} fromNo
 * @param {number} toNo
 * @param {boolean=} omit
 * @returns {Array.<Object>}
 */
teasp.Tsf.ExpPreApply.rebirthArray = function(obj, flds, fromNo, toNo, omit){
    var lst = [];
    for(var x = fromNo ; x <= toNo ; x++){
        var o = {};
        for(var i = 0 ; i < flds.length ; i++){
            var fld = flds[i];
            if(fld.check || !fld.apiKey){
                continue;
            }
            if(fld.apiKey == '_uniqKey'){
                o[fld.apiKey] = teasp.Tsf.ExpPreApply.createUniqKey();
            }else{
                var key = (fld.apiName ? teasp.Tsf.util.formatString(fld.apiName, x) : fld.apiKey);
                teasp.Tsf.Fc.setObjValue(o, obj, fld.apiKey, key);
            }
        }
        lst.push(o);
    }
    if(omit){
        // 値が空のレコードを削除する
        for(var n = lst.length - 1 ; n >= 0 ; n--){
            var o = lst[n];
            var b = false;
            for(var i = 0 ; i < flds.length ; i++){
                var fld = flds[i];
                if(o[fld.apiKey] && fld.apiKey.substring(0, 1) != '_'){
                    b = true;
                    break;
                }
            }
            if(!b){
                lst.splice(n, 1);
            }else{
                break;
            }
        }
    }
    return lst;
};

/**
 * チケットデータを配列化
 */
teasp.Tsf.ExpPreApply.prototype.rebirthTicket = function(){
    this.obj.tickets = teasp.Tsf.ExpPreApply.rebirthArray(this.obj, teasp.Tsf.formParams.sectionTicket.fields, 1, 5, true);
};

/**
 * 回数券データを配列化
 */
teasp.Tsf.ExpPreApply.prototype.rebirthCoupon = function(){
    this.obj.coupons = teasp.Tsf.ExpPreApply.rebirthArray(this.obj, teasp.Tsf.formParams.sectionCoupon.fields, 1, 2, true);
};

/**
 * 海外出張データを配列化（1件だけの配列）
 */
teasp.Tsf.ExpPreApply.prototype.rebirthForeign = function(){
    this.obj.foreigns = teasp.Tsf.ExpPreApply.rebirthArray(this.obj, teasp.Tsf.formParams.sectionForeign.fields, 1, 1);
};

/**
 * 仮払い申請データを配列化（1件だけの配列）
 */
teasp.Tsf.ExpPreApply.prototype.rebirthProvisional = function(){
    this.obj.provisionals = teasp.Tsf.ExpPreApply.rebirthArray(this.obj, teasp.Tsf.formParams.sectionProvisional.fields, 1, 1);
};

/**
 * 社員データを配列化（1件だけの配列）
 */
teasp.Tsf.ExpPreApply.prototype.rebirthEmp = function(){
    this.obj.emps = teasp.Tsf.ExpPreApply.rebirthArray(this.obj, teasp.Tsf.formParams.sectionEmp.fields, 1, 1);
};

/**
 * 申請日付
 *
 * @returns {string}
 */
teasp.Tsf.ExpPreApply.prototype.getApplyDate = function(){
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
 * 経費事前申請番号
 *
 * @returns {string}
 */
teasp.Tsf.ExpPreApply.prototype.getApplyNo = function(){
    return this.obj.ExpPreApplyNo__c || null;
};

/**
 * 件名
 *
 * @returns {string}
 */
teasp.Tsf.ExpPreApply.prototype.getTitle = function(){
    return this.obj.Title__c || '';
};

/**
 *
 * @returns {string|null}
 */
teasp.Tsf.ExpPreApply.prototype.getConfig = function(){
    var config = tsfManager.getExpPreApplyConfigByName(this.getTypeName());
    if(config){
        this.obj.instantFlag = config.instant || false;
    }
    return (config || {});
};

/**
 * 種別
 *
 * @returns {String}
 */
teasp.Tsf.ExpPreApply.prototype.getTypeName = function(){
    return this.obj.Type__c || '';
};

/**
 * 出張種別
 *
 * @returns {String}
 */
teasp.Tsf.ExpPreApply.prototype.getDestinationType = function(){
    return this.obj.DestinationType__c || '';
};

/**
 * 出張種別をセット
 *
 * @returns {String}
 */
teasp.Tsf.ExpPreApply.prototype.setDestinationType = function(t){
    this.obj.DestinationType__c = t;
};

/**
 * 利用日付
 *
 * @returns {String}
 */
teasp.Tsf.ExpPreApply.prototype.getDate = function(){
    if(!this.fcDate){
        var field = {
            apiKey  : 'StartDate__c',
            domType : 'date'
        };
        this.fcDate = new teasp.Tsf.Fc(field);
    }
    return this.fcDate.parseValue(this.obj).dispValue;
};

/**
 * ステータス
 *
 * @returns {string}
 */
teasp.Tsf.ExpPreApply.prototype.getStatus = function(flag){
    var status = teasp.Tsf.ObjBase.prototype.getStatus.call(this, flag);
    if(!status || status == teasp.constant.STATUS_NOTADMIT){ // 未確定
        return teasp.constant.STATUS_NOTREQUEST; // 未申請
    }
    return status;
};

/**
 * 申請せずに精算開始できる
 * @returns {Boolean}
 */
teasp.Tsf.ExpPreApply.prototype.isInstant = function(){
    return (this.obj.instantFlag || false);
};

/**
 * 申請ボタンのラベル
 *
 * @returns {string}
 */
teasp.Tsf.ExpPreApply.prototype.getApplyButtonLabel = function(){
    if(this.isManifestEditMode()){ // 編集モードに移行した状態
        return null;
    }
    if(this.isApproved() || this.isInstant()){
        if(this.getPayId()){
            return teasp.message.getLabel('tf10001530'); // 精算画面へ
        }else if(this.getLinked() > 0){
            return null;
        }else{
            return teasp.message.getLabel('tf10001520'); // 精算開始
        }
    }
    return teasp.Tsf.ObjBase.prototype.getApplyButtonLabel.call(this);
};

/**
 * 精算ステータス
 *
 * @returns {string}
 */
teasp.Tsf.ExpPreApply.prototype.getPayStatus = function(){
    return /** @type {string} */(this.obj._payStatus || null);
};

/**
 * 精算ID
 *
 * @returns {string}
 */
teasp.Tsf.ExpPreApply.prototype.getPayId = function(){
    return /** @type {string} */(this.obj._payId || null);
};

/**
 * 経費精算の仮払申請（ProvisionalPaymentId__c）で参照されている
 *
 * @returns {number}
 */
teasp.Tsf.ExpPreApply.prototype.getLinked = function(){
    return this.obj._linked.length;
};

/**
 * 金額
 *
 * @returns {String}
 */
teasp.Tsf.ExpPreApply.prototype.getTotalAmount = function(){
    if(!this.fcTotalAmount){
        var field = {
            apiKey  : 'TotalAmount__c',
            domType : 'currency'
        };
        this.fcTotalAmount = new teasp.Tsf.Fc(field);
    }
    return this.fcTotalAmount.parseValue(this.obj).dispValue;
};
/**
 * 仮払金額
 *
 * @returns {String}
 */
teasp.Tsf.ExpPreApply.prototype.getProvisionalPaymentAmount = function(){
    if(!this.fcProvisionalPaymentAmount){
        var field = {
            apiKey  : 'ProvisionalPaymentAmount__c',
            domType : 'currency'
        };
        this.fcProvisionalPaymentAmount = new teasp.Tsf.Fc(field);
    }
    return this.fcProvisionalPaymentAmount.parseValue(this.obj).dispValue;
};

teasp.Tsf.ExpPreApply.prototype.getSectionValues = function(discernment){
    switch(discernment){
    case 'jtbDetail'   : return this.getJtbExps();
    case 'allowance'   : return this.obj.ExpPreApplyDay__r || [];
    case 'coupon'      : return this.obj.coupons           || [];
    case 'detail'      : return this.getEmpExps();
    case 'foreign'     : return this.obj.foreigns          || [];
    case 'provisional' : return this.obj.provisionals      || [];
    case 'ticket'      : return this.obj.tickets           || [];
    case 'emp'         : return this.obj.emps              || [];
    case 'expAssist'   : return [this.obj];
    }
    return [];
};

teasp.Tsf.ExpPreApply.prototype.getJtbExps = function(){
    return this.obj.ExpJsNavi__r || [];
};

teasp.Tsf.ExpPreApply.prototype.getEmpExps = function(){
    var exps = this.obj.EmpExp__r || [];
    dojo.forEach(exps, function(exp){
        if(!exp._route){
            exp._route = new teasp.Tsf.EmpExp(exp, true);
        }
    }, this);
    return exps;
};

teasp.Tsf.ExpPreApply.prototype.getSectionValuesByRowIndex = function(discernment, index){
    var lst = this.getSectionValues(discernment);
    if(index < lst.length){
        return lst[index];
    }
    // 新規レコード
    if(discernment == 'detail'){
        return this.createEmpExp();
    }else{
        return {
            _uniqKey : teasp.Tsf.ExpPreApply.createUniqKey()
        };
    }
};

teasp.Tsf.ExpPreApply.prototype.createEmpExp = function(assist){
    var chargeDept = tsfManager.getDefaultChargeDept();
    var reqChargeDept = tsfManager.isRequireChargeDept();
    var o = {
        _uniqKey            : teasp.Tsf.ExpApply.createUniqKey(),
        Id                  : null,
        EmpId__c            : this.getEmpId(),
        ExpPreApplyId__c    : this.getId(),
        ChargeDeptId__c     : (reqChargeDept && chargeDept.ChargeDeptId__c) || null,
        ChargeDeptId__r     : (reqChargeDept && chargeDept.ChargeDeptId__r) || null,
        IsPaid__c           : false
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

teasp.Tsf.ExpPreApply.prototype.rebuildExpPreApplyDay = function(sd, ed, data){
    // 古いリストからマップを作成
    var ol = this.obj.ExpPreApplyDay__r || [];
    var dm = {};
    dojo.forEach(ol, function(o){
        if(typeof(o.Date__c) == 'number'){
            o.Date__c = teasp.util.date.formatDate(o.Date__c);
        }
        dm[o.Date__c] = o;
    });
    // マップに入力エリアの値をセット
    dojo.forEach(data.values, function(v){
        dm[v.Date__c] = v;
    });
    // 新しいリストを作成
    var lst = [];
    if(sd && ed){
        var d = sd;
        while(d <= ed){
            if(dm[d]){
                lst.push(dm[d]);
            }else{
                lst.push({
                    Id                  : null,
                    _uniqKey            : teasp.Tsf.ExpPreApply.createUniqKey(),
                    ExpPreApplyId__c    : this.getId(),
                    Date__c             : d
                });
            }
            d = teasp.util.date.addDays(d, 1);
        }
    }
    this.obj.ExpPreApplyDay__r = lst;
    return lst;
};

/**
 * 添付ファイル数を返す（事前申請の場合は、明細レベルの添付ファイルはないので、申請レベルだけ）
 * @returns {number}
 */
teasp.Tsf.ExpPreApply.prototype.getAttachmentAllCount = function(){
    return (this.obj.Attachments && this.obj.Attachments.length) || 0;
};

/**
 * J'sNAVI Jr明細用。
 * 機能コードと交通機関名の組み合わせ。
 * 交通機関名がなぜか空の場合があるのでその際に使用する。
 * TODO 仕様書と実際にとれるものと違う場合があるので、実データで要確認
 */
teasp.Tsf.ExpPreApply.JTB_TRANSPORT_MAP = {
		JL : "日本航空(JAL)",	// JAL ONLINEの場合の可能性あり
		NH : "全日空(ANA)",		// ANA@deskで来ることもある？
		JE : "JR Express",		// 仕様書ではJR東海？
		BH : "るるぶトラベル",
		RT : "他ホテル予約",	// 要確認。そもそも無いかも
		GT : "GTA",
		DA : "代理店発注(交通機関)",
		DB : "代理店発注(宿泊)",
		DC : "代理店発注(レンタカー)",
		DD : "代理店発注(その他)",
		AA : "海外オンライン(交通機関)",
		AB : "海外オンライン(宿泊)",
		AC : "海外オンライン(レンタカー)",
		AD : "海外オンライン(その他)",
		RA : "ダイナミックパッケージ(交通機関)",
		RB : "ダイナミックパッケージ(宿泊)",
		RC : "ダイナミックパッケージ(レンタカー)",
		RD : "ダイナミックパッケージ(その他)"
};

