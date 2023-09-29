/**
 * AtkCommon__c クラス
 *
 * @constructor
 */
teasp.Tsf.Common = function(common){
    this.common = common || {};
    if(this.common.Config__c && typeof(this.common.Config__c) == 'string'){
        this.common.Config__c = teasp.Tsf.util.fromJson(this.common.Config__c);
    }
};

/**
 * 経費事前申請種別設定
 *
 * @returns {Array.<string>}
 */
teasp.Tsf.Common.prototype.getExpPreApplyConfigs = function(){
    if(!this.expPreApplyConfigs){
        var c = this.common.ExpPreApplyConfig__c;
        var config = this.common.ExpPreApplyConfig__c = teasp.constant.getExpPreApplyConfig(typeof(c) == 'string' ? teasp.Tsf.util.fromJson(c) : c);
        if(typeof(config.requireChargeJob) != 'number'){
            config.requireChargeJob = (this.common.RequireExpLinkJob__c ? 2 : 1); // 必須/入力する
        }
        if(typeof(config.requireChargeDept) != 'number'){
            config.requireChargeDept = (this.common.RequireChargeDept__c ? 1 : 0); // 入力する/入力しない
        }
        var n = 1000;
        var l = [];
        for(var key in config){
            var o = config[key];
            if(!o || typeof(o) != 'object' || dojo.isArray(o) || o.removed || !o.view){
                continue;
            }
            if(o.order === undefined){
                o.order = n++;
            }
            o.key = key;
            o.name = (o.msgId ? teasp.message.getLabel(o.msgId) : key);
            l.push(o);
        }
        l = l.sort(function(a, b){
            return a.order - b.order;
        });
        config.views = l;
        this.expPreApplyConfigs = config;
    }
    return this.expPreApplyConfigs;
};

teasp.Tsf.Common.prototype.getExpPreApplyConfigByName = function(name){
    this.getExpPreApplyConfigs();
    return this.common.ExpPreApplyConfig__c[name] || {};
};

teasp.Tsf.Common.prototype.getExpPreApplyConfigByView = function(view){
    var lst = this.getExpPreApplyConfigs().views;
    for(var i = 0 ; i < lst.length ; i++){
        if(lst[i].view == view){
            return lst[i];
        }
    }
    return null;
};

/**
 * 回数券候補を返す
 *
 * @returns {Array.<string>}
 */
teasp.Tsf.Common.prototype.getExpCouponList = function(){
    if(!this.expCouponList){
        var s = (this.common.ExpCouponList__c || '');
        this.expCouponList = s.split(/\r?\n/);
    }
    return this.expCouponList;
};

teasp.Tsf.Common.prototype.getTaxRoundFlag = function(){
    return parseInt(this.common.TaxRoundFlag__c || '0', 10);
};

teasp.Tsf.Common.prototype.getTicketPeriod = function(){
    return this.common.TicketPeriod__c || '1';
};

/**
 * 経費ワークフローの使用
 * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isExpWorkflow = function(){
    return this.common.ExpWorkflow__c || false;
};

/**
 * 経費の承認者設定を使用する
 * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isUseExpApproverSet = function(){
    return (this.isExpWorkflow() && this.common.UseExpApproverSet__c) || false;
};

/**
 * 定期区間申請にワークフローを使用する
 * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isCommuterPassWorkflow = function(){
    return this.common.CommuterPassWorkflow__c || false;
};

/**
 * 承認済みでも経費管理者は経費明細の修正ができる
 * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isAllowEditExpAdmin = function(){
    return this.common.AllowEditExpAdmin__c || false;
};

/**
 * 承認中でも上長が経費明細の修正ができる
 * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isAllowEditManager = function(){
    return this.common.AllowEditManager__c || false;
};

/**
 * 仕訳データを作成する.<br/>
 * 1またはnull なら作成する
 * * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isOutputJournal = function(){
    return (this.common.OutputJournal__c != '0');
};

/**
 * 申請時の備考入力を必須にする
 * @param {string=} key
 * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isRequireNote = function(key){
    if(!key || !this.common.RequireNote__c){
        return false;
    }
    var opts = (this.common.RequireNoteOption__c || '').split(',');
    if((opts.length == 1 && !opts[0]) || opts.contains('all') || opts.contains(key)){
        return true;
    }
    return false;
};

/**
 * 経費とジョブの紐づけを必須とする
 * @returns {number} 0:入力しない 1:入力する 2:必須
 */
teasp.Tsf.Common.prototype.isRequireChargeJob = function(){
    return this.getExpPreApplyConfigs().requireChargeJob;
};

/**
 * 経費の負担部署を入力する
 * @returns {number} 0:入力しない 1:入力する 2:必須
 */
teasp.Tsf.Common.prototype.isRequireChargeDept = function(){
    return this.getExpPreApplyConfigs().requireChargeDept;
};

/**
 * １申請の最大明細数
 * @returns {number}
 */
teasp.Tsf.Common.prototype.getExpCountLimit = function(){
    return this.getExpPreApplyConfigs().expCountLimit || 100;
};

/**
 * 経費に稟議を関連付ける
 * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isExpLinkDocument = function(){
    return this.common.ExpLinkDocument__c || false;
};

/**
 * 駅探検索を利用するか
 * * @returns
 */
teasp.Tsf.Common.prototype.getUseEkitan = function(){
    if(this.common.UseEkitan__c == '利用しない'){
        return 0;
    }else if(typeof(this.common.EkitanICCardMode__c) != 'string'){
        return (this.common.CheckWorkingTime__c ? 2 : 1);
    }else{
        return (this.common.EkitanICCardMode__c == '1' ? 2 : 1);
    }
};

/**
 * HELP リンク
 *  * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.getHelpLink = function(){
    return this.common.HelpLink__c || null;
};

/**
 * LocalKey
 *  * @returns {string}
 */
teasp.Tsf.Common.prototype.getLocalKey = function(){
    return (this.common.LocalKey__c || '') + '000000000000000000000000000000';
};

/**
 * 合計金額がマイナスの経費申請を許可する
 *
 * @returns {string}
 */
teasp.Tsf.Common.prototype.isAllowMinusApply = function(){
    return (this.getLocalKey().substring(14, 15) == '1');
};

/**
 * 経費精算の起算日
 *
 * @returns {number}
 */
teasp.Tsf.Common.prototype.getExpStartDate = function(){
    return this.common.ExpStartDate__c || 0;
};

/**
 * 会議・交際費の費目
 *
 * @returns {string|null}
 */
teasp.Tsf.Common.prototype.getSocialExpenseItemId = function(){
    return this.common.SocialExpenseItemId__c || null;
};

/**
 * @returns {string|null}
 */
teasp.Tsf.Common.prototype.getRevision = function(){
    return this.common.Revision__c || null;
};

/**
 * タイムレポートを使用不可にする
 * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isDisabledTimeReport = function(){
    return this.common.DisabledTimeReport__c || false;
};

/**
 * 領収書入力システムを使用する
 * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isUsingReceiptSystem = function(){
    return this.common.UsingReceiptSystem__c || false;
};

/**
 * J'sNAVIを使用する
 * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isUsingJsNaviSystem = function(){
    return this.common.UsingJsNaviSystem__c || false;
};

/**
 * IC連携機能の経費登録機能を使用する
 * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isUseConnectICExpense = function(){
    return this.common.UseConnectICExpense__c || false;
};

/**
 * 電子帳簿保存法スキャナ保存対応機能を使用する
 * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isUseScannerStorage = function(){
    return this.common.UseScannerStorage__c || false;
};

/**
 * 拡張項目1のデータ名
 * @returns {string}
 */
teasp.Tsf.Common.prototype.getExtraItemOutputDataName1 = function(){
    return this.common.ExtraItemOutputDataName1__c || null;
};

/**
 * 拡張項目2のデータ名
 * @returns {string}
 */
teasp.Tsf.Common.prototype.getExtraItemOutputDataName2 = function(){
    return this.common.ExtraItemOutputDataName2__c || null;
};

/**
 * 経費申請の承認取消で赤伝票を申請する
 * @returns {Boolean}
 */
teasp.Tsf.Common.prototype.isUseExpCancelApply = function(){
    return this.common.UseExpCancelApply__c || false;
};

/**
 * JTB連携用費目
 * @returns {Array.<string>}
 */
teasp.Tsf.Common.prototype.getJtbExpItems = function(){
    return (this.common.Config__c && this.common.Config__c.jtbExpItem) || {};
};

/**
 * JTBダミーを使用
 * @returns {boolean}
 */
teasp.Tsf.Common.prototype.isUseJsNaviDummy = function(){
    return (this.common.Config__c && this.common.Config__c.useJsNaviDummy) || false;
};

/**
 * 経費エリア基準幅
 * @returns {number} 未設定の時はデフォルト（768）を返す
 */
teasp.Tsf.Common.prototype.getExpenseAreaReferWidth = function(){
    return (this.common.Config__c && this.common.Config__c.expenseAreaReferWidth) || 768;
};

/**
 * 経費エリア最小幅
 * 用途: 経費精算・事前申請のウィンドウ幅（window.innerWidth）が経費エリア基準幅に満たない時、
 *       画面崩れを防ぐため、最小幅をセットする。
 * @returns {number} 未設定の時はデフォルト（1024）を返す
 */
teasp.Tsf.Common.prototype.getExpenseAreaMinWidth = function(){
    return (this.common.Config__c && this.common.Config__c.expenseAreaMinWidth) || 1024;
};

/**
 * 経費精算の消込画面の印刷ボタン（ディスコ様限定）
 * @returns {boolean}
 */
teasp.Tsf.Common.prototype.isUseExpPayPrint = function(){
    return (this.common.Config__c && this.common.Config__c.useExpPayPrint) || false;
};

/**
 * 仕訳データCSV出力（ディスコ様限定）
 * @returns {boolean}
 */
teasp.Tsf.Common.prototype.isUseExpEntryData = function(){
    return (this.common.Config__c && this.common.Config__c.useExpEntryData) || false;
};

/**
 * 仕訳データCSV出力のVisualforceページを返す（ディスコ様限定）
 * @returns {string}
 */
teasp.Tsf.Common.prototype.getExpEntryDataUrl = function(){
    return (this.common.Config__c && this.common.Config__c.expEntryDataUrl) || '';
};

/**
 * 1回の精算実行最大件数を返す
 * 上限値が設定されていればその値を上限とする。0は無制限
 * 設定されてなければ2000件
 * @returns {number}
 */
teasp.Tsf.Common.prototype.getExpPayCountMax = function(){
    var n = (this.common.Config__c && this.common.Config__c.expPayCountMax);
    return (typeof(n) == 'number' ? n : 2000);
};

/**
 * 経費精算取消を許可するかどうか
 * expCancelDeadlineの日付を過ぎていなければ精算取消ができる。
 * expCancelDeadlineが2021/10/25だった場合、2021/10/25 23:59までは取消可能。
 */
teasp.Tsf.Common.prototype.isExpCancelable = function(){
    if(this.common.Config__c == null || this.common.Config__c.expCancelDeadline == null){
        return false;
    }
    var deadline = new Date(this.common.Config__c.expCancelDeadline + 'T00:00:00+0900');
    deadline.setDate(deadline.getDate() + 1);
    var today = new Date();
    return today < deadline;
}