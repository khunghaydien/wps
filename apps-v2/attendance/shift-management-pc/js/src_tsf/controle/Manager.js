/**
 * 社員情報管理クラス
 *
 *
 * @param {Object} res コントロールクラスの初期化メソッドの戻り値
 * @constructor
 */
teasp.Tsf.Manager = function(){
    this.imageMap = {};
};

teasp.Tsf.Manager.EXP_APPLY           = 'ExpApply';
teasp.Tsf.Manager.EXP_PRE_APPLY       = 'ExpPreApply';
teasp.Tsf.Manager.EXP_PAY             = 'ExpPay';
teasp.Tsf.Manager.EXP_PRINT           = 'ExpPrint';
teasp.Tsf.Manager.EXP_JSNAVI          = 'ExpJsNavi';
teasp.Tsf.Manager.EXP_JSNAVI_DETAIL   = 'ExpJsNaviDetail';
teasp.Tsf.Manager.PRINT_EXP_PAY       = 'PrintExpPay';
teasp.Tsf.Manager.ATTACH              = 'Attach';
teasp.Tsf.Manager.EMP_TABLE           = 'EmpTable';
teasp.Tsf.Manager.CSV_UPLOAD          = 'CsvUpload';

teasp.Tsf.Manager.EXP_LIST_VIEW = '_ExpListView_';
teasp.Tsf.Manager.EXP_APPLY_NEW = '_ExpApplyNew_';

teasp.Tsf.Manager.prototype.init = function(res){
    this.dialogs = {};
    this.legacyDialogs = {};
    this.target  = teasp.Tsf.Manager.EXP_PRE_APPLY;
    this.expCsvImportFlag = false;
    this.readParams();
    this.loading = new teasp.Tsf.Loading();
    this.error   = new teasp.Tsf.Error();
    this.info    = new teasp.Tsf[this.getTargetInfo()]();
    this.info.init(res);
    if(this.info.isOldRevi()){
      teasp.locationHref(teasp.getPageUrl('convertView') + '?forwardURL=' + encodeURIComponent(teasp.getHref(this.urlName)));
    }
    this.processPayeeType(); // 支払先情報の下処理
};

/**
 * 引数を読み込む
 */
teasp.Tsf.Manager.prototype.readParams = function(){
    var p = location.pathname;
    // target を決定
    if((/ExpApply/.test(p)) || (/EmpExp/.test(p)) || (/TimeReport/.test(p))){
        this.target = teasp.Tsf.Manager.EXP_APPLY;
    }else if(/ExpPay/.test(p)){
        this.target = teasp.Tsf.Manager.EXP_PAY;
    }else if(/ExpPrint/.test(p)){
        this.target = teasp.Tsf.Manager.EXP_PRINT;
    }else if(/ExpJtbDetail/.test(p)){
        this.target = teasp.Tsf.Manager.EXP_JSNAVI_DETAIL;
    }else if(/ExpJtb/.test(p)){
        this.target = teasp.Tsf.Manager.EXP_JSNAVI;
    }else if(/EmpRefView/.test(p)){
        this.target = teasp.Tsf.Manager.ATTACH;
    }else if(/AtkCsvUploadView/.test(p)){
        this.target = teasp.Tsf.Manager.CSV_UPLOAD;
    }else if(/DeptRefView/.test(p)){
        this.target = teasp.Tsf.Manager.EMP_TABLE;
    }
    var n = p.lastIndexOf('/');
    if(n){
        this.urlName = p.substring(n + 1);
    }
    this.params = {};
    teasp.Tsf.util.console(location.search);
    var args = location.search.split('&');
    for(var i = 0 ; i < args.length ; i++){
        var v = args[i];
        if(i == 0){
            v = v.substring(1);
        }
        var p = v.split('=');
        if(p.length > 1){
            this.params[p[0].toLowerCase()] = p[1];
        }else if(p[0] == 'expApplyId'){ // 経費精算の未申請明細の表示意図あり
            this.params[p[0].toLowerCase()] = null;
        }
    }
    if(this.target == teasp.Tsf.Manager.EXP_PRINT){
        var t = this.params['target'];
        if(/ExpPay/i.test(t)){
            this.target = teasp.Tsf.Manager.PRINT_EXP_PAY;
        }
    }
};

teasp.Tsf.Manager.prototype.setRedirectPage = function(domId){
    teasp.Tsf.Dom.byId(domId).value = location.pathname + location.search;
};

teasp.Tsf.Manager.prototype.getTarget = function(objectName){
    if(objectName){
        if(objectName == 'AtkExpPreApply__c'){
            return 'ExpPreApply';
        }else if(objectName == 'AtkExpApply__c'){
            return 'ExpApply';
        }
    }
    return this.target;
};

teasp.Tsf.Manager.prototype.getTargetMain = function(){
    return 'Main' + this.target;
};

teasp.Tsf.Manager.prototype.getTargetList = function(){
    return 'List' + this.target;
};

teasp.Tsf.Manager.prototype.getTargetInfo = function(){
    return 'Info' + this.target;
};

/**
 * 引数の ID を返す
 * @returns {string|null}
 */
teasp.Tsf.Manager.prototype.getArgId = function(){
    if(this.isTargetExpApply()){
        return this.params['expapplyid'] || null;
    }
    return this.params['id'] || null;
};

/**
 * 引数が指定されていたか
 * @returns {boolean}
 */
teasp.Tsf.Manager.prototype.hasArgId = function(){
    if(this.isTargetExpApply()){
        return this.params.hasOwnProperty('expapplyid');
    }
    return false;
};

teasp.Tsf.Manager.prototype.getListType = function(){
    return this.params['listtype'] || null;
};

teasp.Tsf.Manager.prototype.getParams = function(){
    return this.params || {};
};

teasp.Tsf.Manager.prototype.getMode = function(){
    var mode = this.params['mode'];
    return ((mode && /^read$/i.test(mode)) ? 'read' : 'edit');
};

teasp.Tsf.Manager.isReadMode = function(mode){
    return (mode == 'read');
};

teasp.Tsf.Manager.prototype.isReadMode = function(){
    return teasp.Tsf.Manager.isReadMode(this.getMode());
};

teasp.Tsf.Manager.prototype.isMainOnly = function(){
    return (this.target == teasp.Tsf.Manager.ATTACH);
};

teasp.Tsf.Manager.prototype.isOpenReceipt = function(){
    return this.getParams()['openreceipt'];
};

teasp.Tsf.Manager.prototype.getDebug = function(){
    var debug = this.params['debug'];
    return (debug || null);
};

teasp.Tsf.Manager.prototype.isTypeExp = function(){
    return (this.getParams()['type'] == 'Exp');
};

teasp.Tsf.Manager.prototype.isTypeExpPre = function(){
    return (this.getParams()['type'] == 'ExpPre');
};

teasp.Tsf.Manager.prototype.getType = function(){
    return (this.getParams()['type'] || null);
};

teasp.Tsf.Manager.prototype.getArgEmpId = function(){
    return this.getParams()['empid'] || null;
};

teasp.Tsf.Manager.prototype.getArgAttachId = function(){
    return this.getParams()['attachid'] || null;
};

teasp.Tsf.Manager.prototype.getAction = function(){
    return this.getParams()['action'] || this.getParams()['argaction'];
};

teasp.Tsf.Manager.prototype.isTargetExpApply = function(){
    return (this.target == 'ExpApply' || this.getParamByKey('target') == 'ExpApply');
};

teasp.Tsf.Manager.prototype.isArgNarrow = function(){
    // TS1の場合、引数に narrow=1 が追加される（「閉じる」ボタンを非表示にする）
    return (this.getParams()['narrow'] ? true : false);
};

teasp.Tsf.Manager.prototype.getParamByKey = function(key, flag){
    var v = this.getParams()[key.toLowerCase()] || null;
    if(flag && v){
        return decodeURIComponent(v);
    }
    return v;
};

teasp.Tsf.Manager.prototype.setParam = function(key, value){
    this.params[key.toLowerCase()] = value;
};

teasp.Tsf.Manager.prototype.setLoadingOff = function(flag){
    if(this.loading){
        this.loading.setOff(flag);
    }
};

/**
 * 初期処理
 * ※コンストラクタの後では、これが最初に呼ばれる。
 *
 */
teasp.Tsf.Manager.prototype.initView = function(){
    this.main = new teasp.Tsf[this.getTargetMain()]();
    this.main.init();

    if(this.info.isLoadError()){
        teasp.Tsf.Error.showError(this.info.getLoadError());
        return;
    }
    if(this.isMainOnly()){
        return;
    }

    this.list = new teasp.Tsf[this.getTargetList()](this.getListType());
    this.list.init();

    this.changeView(this.info.getStartView(this.getArgId(), this.hasArgId()), this.getArgId(), this.main.initViewEnd);
};

/**
 * タイムレポートの経費精算エリアの表示
 *
 * @param {Object|null} obj nullの場合は新規
 * @param {string=} view obj==nullかつview==nullならリストへ戻る
 * @param {string=} mode
 */
teasp.Tsf.Manager.prototype.showFormT = function(exps, targetDate){
    if(this.form){
        this.form = teasp.Tsf.FormBase.erase(this.form); // フォームを破棄して this.form に null をセット
    }
    if(!this.main){
        this.main = new teasp.Tsf.MainT();
        this.main.init();
    }
    var objBase = this.info.createObject();
    teasp.Tsf.EmpExp.convertExps(exps);
    objBase.setEmpExpComplex(exps);
    this.form = new teasp.Tsf.FormT(targetDate);
    this.form.refresh(objBase);
};

/**
 */
teasp.Tsf.Manager.prototype.refreshList = function(listType){
    if(this.list){
        this.list.destroy();
        delete this.list;
        this.list = null;
    }
    this.list = new teasp.Tsf[this.getTargetList()](listType);
    this.list.init();

    this.changeView();
};

/**
 * 画面切り替え
 *
 * @param {string|null} view
 * @param {string=} id
 * @param {Function=} callback
 */
teasp.Tsf.Manager.prototype.changeView = function(view, id, onSuccess, onFailure){
    teasp.Tsf.Error.showError();
    if(/apex\//.test(view)){
        teasp.locationHref(view + (id ? ('?id=' + id) : ''));
        return;
    }
    if(view == teasp.Tsf.Manager.EXP_LIST_VIEW){ // 経費申請の一覧へ
        this.setDiffView(false); // 「事前申請との差異を表示」をオフにする
        this.showForm();
    }else if(view == teasp.Tsf.Manager.EXP_APPLY_NEW){ // 新規の経費申請
        this.showForm(this.info.createObject(view, true));
    }else if(view == teasp.Tsf.Manager.CSV_UPLOAD){
        this.showForm();
    }else{
        if(this.info.isValid(id) || view){
            if(this.info.isValid(id)){
                this.getRecord(id, onSuccess, onFailure);
            }else{      // 新規
                this.showForm(null, view);
            }
        }else{ // リストへ戻る
            this.showForm();
        }
    }
    teasp.Tsf.MainBase.adjustArea();
};

teasp.Tsf.Manager.prototype.getRecord = function(id, onSuccess, onFailure){
    var arg = {
        id       : id || null,
        empId    : this.getEmpId(),
        mode     : this.getMode(),
        reqSteps : (this.target == teasp.Tsf.Manager.EXP_PRINT)
    };
    this.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_GET_RECORDS, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                var obj = this.info.setRecords(result, arg.id);
                if(!obj && id){
                    teasp.Tsf.Error.showError(teasp.message.getLabel('tf10001580')); // データが存在しません
                }else{
                    this.showForm(obj, null);
                    if(onSuccess){
                        onSuccess();
                    }
                }
            }else if(onFailure){
              onFailure(false, teasp.Tsf.Error.parse(event.status ? result : event));
            }else{
                teasp.Tsf.Error.showError(event.status ? result : event);
            }
        }),
        { escape : false }
    );
};

/**
 * フォームを表示
 *
 * @param {Object|null} obj nullの場合は新規
 * @param {string=} view obj==nullかつview==nullならリストへ戻る
 * @param {string=} mode
 */
teasp.Tsf.Manager.prototype.showForm = function(obj, view, mode){
    if(this.form){
        this.form = teasp.Tsf.FormBase.erase(this.form); // フォームを破棄して this.form に null をセット
    }
    if(this.target == teasp.Tsf.Manager.CSV_UPLOAD){
        this.form = teasp.Tsf.FormBase.factory('FormCsvUpload');
        this.form.refresh();
        this.list.show(false);
        this.main.show(true);
        return;
    }
    if(obj || view){
        if(this.target == teasp.Tsf.Manager.EXP_PRINT){
            this.form = teasp.Tsf.FormBase.factory('FormExpPrint');
            this.form.initFp(obj);
        }else{
            this.form = teasp.Tsf.FormBase.factory(obj ? obj.getConfig().view : view);
        }
        this.form.refresh(obj ? obj : this.info.createObject(view), mode);
        if(this.target != teasp.Tsf.Manager.EXP_PRINT){
            this.form.savePoint();
        }
        this.list.show(false);
        this.main.show(true);
    }else{ // リストへ戻る
        this.main.show(false);
        this.list.refresh();
    }
};

teasp.Tsf.Manager.prototype.getArea = function(){
    return teasp.Tsf.Dom.byId(teasp.Tsf.ROOT_AREA_ID);
};

teasp.Tsf.Manager.prototype.eventOpenCalendar = function(dom, node, around, param){
    this.main.eventOpenCalendar(dom, node, around, param);
};

teasp.Tsf.Manager.prototype.eventOpenExpRoute = function(dom, node, around, param){
    this.main.eventOpenExpRoute(dom, node, around, param);
};

teasp.Tsf.Manager.prototype.backToList = function(view){
    this.info.removeObject([{ Id: null }]);
    this.changeView(view || null);
};

/**
 * ウィンドウを閉じるか他ページへ画面遷移する
 *
 * @param {Object} e
 * @returns {string|undefined}
 */
teasp.Tsf.Manager.prototype.beforeUnload = function(e){
    if(this.checkDiff()){
        return teasp.message.getLabel('tf10001590'); // 編集中のデータは保存されていません。
    }
    this.clearCsvImport();
};

/**
 *
 * @returns {boolean}
 */
teasp.Tsf.Manager.prototype.checkDiff = function(){
    return (this.form && this.form.checkDiff());
};

teasp.Tsf.Manager.prototype.getCurrentObjectId = function(){
    if(!this.form){
        return null;
    }
    return this.form.getCurrentObjectId();
};

teasp.Tsf.Manager.prototype.getCurrentObjectIdSet = function(){
    if(!this.form){
        return null;
    }
    return this.form.getCurrentObjectIdSet();
};

teasp.Tsf.Manager.prototype.saveExpPreApply = function(nochk, callback){
    if(!this.form){
        return;
    }
    if(!nochk && !this.checkDiff()){
        callback(true, this.getCurrentObjectId());
        return;
    }
    var data = this.form.getDomValues(false, 2);
    if(data.ngList.length > 0){
        callback(false, teasp.Tsf.Error.messageFromNgList(data.ngList));
        return;
    }
    var obj = data.values[0];
    obj.days = (data.ExpPreApplyDay__r && data.ExpPreApplyDay__r.values) || [];
    obj.exps = (data.EmpExp__r         && data.EmpExp__r.values        ) || [];

    var arg = {
        method       : 'upsertExpPreApply',
        expPreApply  : obj
    };
    console.log('[Manager.saveExpPreApply] upsertExpPreApply');
    console.log(arg);

    this.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                this.info.removeObject([{ Id: null }]); // いらなくなったレコードを削除
                callback(true, result.id);
            }else{
                this.loading.hide(); // お待ちくださいオフ
                callback(false, teasp.Tsf.Error.parse(event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.Manager.prototype.submitApply = function(req, callback){
    if(!this.form){
        return;
    }
    this.info.submitApply(this.form, this.getCurrentObjectId(), req, callback);
};

teasp.Tsf.Manager.prototype.cancelApply = function(req, callback){
    if(!this.form){
        return;
    }
    this.info.cancelApply(this.getCurrentObjectIdSet(), req, callback);
};

teasp.Tsf.Manager.prototype.approveApply = function(obj, flag, callback){
    if(!this.form){
        return;
    }
    teasp.Tsf.util.mixin(obj, this.getCurrentObjectIdSet());
    this.info.approveApply(this.form, obj, flag, callback);
};

/**
 * 精算開始
 */
teasp.Tsf.Manager.prototype.generateExpFromPreApply = function(flag){
    var arg = {
        method  : 'generateExpFromPreApply',
        id      : this.getCurrentObjectId()
    };
    if(flag){
        arg.generateFlag = true; // 承認なしで精算開始するフラグ
    }
    console.log('[Manager.generateExpFromPreApply] ' + arg.method);
    console.log(arg);

    teasp.tsConfirm(teasp.message.getLabel('tf10001890'),this,function(result){
        if(result){ 
            // 出張手配ありの場合（手配予定金額が入力されている場合）は予約反映を行う
            var amount = this.form.getObjBase().obj.PlannedAmount__c;
            if(amount && amount > 0) {
                this.jtbSynchro();
            }
            this.loading.show(); // お待ちくださいオン
            Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
                teasp.Tsf.Dom.hitch(this, function(result, event){
                    this.loading.hide(); // お待ちくださいオフ
                    console.log(event);
                    if(event.status && result.result == 'OK'){
                        teasp.util.excludeNameSpace(result);
                        this.jumpExpApplyView(result.expApplyId);
                    }else{
                        teasp.Tsf.Error.showError(event.status ? result : event);
                    }
                }),
                { escape : false }
            );
        }
    });
};

/**
 * 精算画面へ遷移
 *
 * @param {string} id
 */
teasp.Tsf.Manager.prototype.jumpExpApplyView = function(id){
    var url = teasp.getPageUrl('empExpView') + '?expApplyId=' + id;
    teasp.locationHref(url);
};

/**
 * 事前申請レコードの削除
 *
 * @param {Function} callback
 */
teasp.Tsf.Manager.prototype.deleteExpPreApply = function(callback){
    if(!this.form){
        return;
    }
    var arg = {
       method   : 'deleteExpPreApply',
       id       : this.getCurrentObjectId()
    };
    console.log(arg);

    this.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            console.log(event);
            if(event.status && result.result != 'NG'){
                teasp.util.excludeNameSpace(result);
                this.info.removeObject([{ Id: arg.id }]);
                callback(true, result);
            }else{
                callback(false, (result.result == 'NG' ? result : event));
            }
        }),
        { escape : false }
    );
};

/**
 * 経費申請レコードの削除
 *
 * @param {Function} callback
 */
teasp.Tsf.Manager.prototype.deleteExpApply = function(callback){
    if(!this.form){
        return;
    }
    var arg = {
       method   : 'deleteExpApply',
       id       : this.getCurrentObjectId()
    };
    console.log(arg);

    this.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            console.log(event);
            if(event.status && result.result != 'NG'){
                teasp.util.excludeNameSpace(result);
                this.info.removeObject([{ Id: arg.id }]);
                callback(true, result);
            }else{
                callback(false, (result.result == 'NG' ? result : event));
            }
        }),
        { escape : false }
    );
};

/**
 * 申請レコードのコピー
 *
 * @param {Function} callback
 */
teasp.Tsf.Manager.prototype.copyExpApply = function(callback){
    if(!this.form){
        return;
    }

    var attachCnt = this.form.getObjBase().getAttachmentAllCount(); // 添付ファイルがあるか
    var messageText = teasp.message.getLabel('tf10006830'); // コピーを作成します。よろしいですか？
    if(this.isTargetExpApply() && this.info.isUseScannerStorage()){
        messageText += teasp.message.getLabel('ex00000150'); // 電帳法オプションが有効化されたため、経費明細の領収書などはコピーされません。
    }

    tsfManager.showDialog('MessageBox', {
        title   : teasp.message.getLabel('tk10000297'), // コピー
        message : messageText,
        option  : (attachCnt > 0 ? {
            type    : 'check',
            name    : teasp.message.getLabel('tf10006850'), // 添付ファイルもコピー
            checked : true
        } : null)
    }, teasp.Tsf.Dom.hitch(this, function(checked){
        this.copyExpApplyReal(checked, callback);
    }));
};

teasp.Tsf.Manager.prototype.copyExpApplyReal = function(checked, callback){
    var arg = {
       method     : this.isTargetExpApply() ? 'copyExpApply' : 'copyExpPreApply',
       id         : this.getCurrentObjectId(),
       attachCopy : checked
    };
    console.log(arg);

    this.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            console.log(event);
            if(event.status && result.result != 'NG'){
                teasp.util.excludeNameSpace(result);
                this.info.removeObject([{ Id: arg.id }]);
                this.changeView(null, result.id);
            }else{
                this.loading.hide(); // お待ちくださいオフ
                if(callback){
                    callback(false, teasp.Tsf.Error.parse(event.status ? result : event));
                }else{
                    teasp.Tsf.Error.showError(event.status ? result : event);
                }
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.Manager.prototype.saveExpApply = function(nochk, callback){
    if(!this.form){
        return;
    }
    if(!nochk && !this.checkDiff()){
        callback(true, { id: this.getCurrentObjectId() });
        return;
    }
    var data = this.form.getDomValues(false, 2);
    var obj = data.values[0];
    obj.ExpApplyId__c = obj.Id;
    obj.exps = (data.EmpExp__r && data.EmpExp__r.values) || [];
    obj.exps = obj.exps.sort(function(a, b){
        if(a.Date__c == b.Date__c){
            return 0;
        }
        return (a.Date__c < b.Date__c ? -1 : 1);
    });
    if(!obj.Id){ // removeExpIds をセットするのは未申請明細（ID がない時）だけ
        obj.removeExpIds = this.form.getObjBase().getRemoveExpIds(obj.exps);
    }

    var arg = {
        method       : 'upsertEmpExp',
        expApply     : obj,
        expsFlag     : true
    };
    console.log(arg);

    this.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                this.info.removeObject([{ Id: null }]); // いらなくなったレコードを削除
                callback(true, result);
            }else{
                this.loading.hide(); // お待ちくださいオフ
                callback(false, teasp.Tsf.Error.parse(event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

/**
 * 精算開始
 */
teasp.Tsf.Manager.prototype.startCreateExpApply = function(){
    if(!this.form){
        return;
    }
    this.form.createExpApply();
};

/**
 * 精算開始
 */
teasp.Tsf.Manager.prototype.createExpApply = function(obj, callback){
    var arg = {
        method       : 'upsertEmpExp',
        expApply     : obj,
        expsFlag     : true
    };
    console.log(arg);

    this.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                this.info.removeObject([{ Id: null }]); // いらなくなったレコードを削除
                callback(true, result);
            }else{
                this.loading.hide(); // お待ちくださいオフ
                callback(false, teasp.Tsf.Error.parse(event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.Manager.prototype.saveEmpExp = function(data, callback){
    var arg = {
        method      : 'upsertEmpExpNoApply',
        expApply    : data
    };
    console.log(arg);

    this.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result);
            }else{
                callback(false, teasp.Tsf.Error.parse(event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.Manager.prototype.deleteEmpExp = function(obj, callback){
    obj.method = 'deleteEmpExp';
    console.log(obj);

    this.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(obj),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result);
            }else{
                callback(false, teasp.Tsf.Error.parse(event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

/**
 * 駅探検索
 *
 * @param {string} mode
 * @param {Object} searchKey
 * @param {string=} date
 * @param {Function} callback
 */
teasp.Tsf.Manager.prototype.searchRoute = function(mode, searchKey, date, config, callback){
    var req = teasp.Tsf.util.mixin({
        empId       : this.getEmpId(),
        expDate     : date || teasp.util.date.formatDate(teasp.util.date.getToday()),
        mode        : mode,
        config      : (config ? teasp.Tsf.util.toJson(config) : null),
        ICCardMode  : this.getICCardMode()
    }, searchKey);

    this.loading.show(); // お待ちくださいオン
    console.log(req);
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_SEARCH_ROUTE, dojo.toJson(req),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result);
            }else{
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

/**
 * リスト取得
 *
 * @param {Object} req
 * @param {Function} callback
 */
teasp.Tsf.Manager.prototype.getList = function(req, callback){
    this.loading.show(); // お待ちくださいオン
    console.log(req);
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_GET_LIST, dojo.toJson(req),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result);
            }else{
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

/**
 * ジョブリスト取得
 *
 * @param {Object} req
 * @param {Function} callback
 */
teasp.Tsf.Manager.prototype.getJobList = function(req, callback){
    this.loading.show(); // お待ちくださいオン
    console.log(req);
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_GET_JOB_LIST, dojo.toJson(req),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result);
            }else{
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

/**
 * データ検索
 *
 * @param {Object} req
 * @param {Function} callback
 */
teasp.Tsf.Manager.prototype.searchData = function(req, callback){
    this.loading.show(); // お待ちくださいオン
    console.log(req);
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_SEARCH_DATA, dojo.toJson(req),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result);
            }else{
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

/**
 * 定期申請
 *
 * @param {Object} req
 * @param {Function} callback
 */
teasp.Tsf.Manager.prototype.submitCommuterPass = function(req, callback){
    this.loading.show(); // お待ちくださいオン
    console.log(req);
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_AROUND_COMMUTER_PASS, dojo.toJson(req),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result);
            }else{
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

/**
 * 承認者設定情報を取得
 *
 * @param {Object} req
 * @param {Function} callback
 */
teasp.Tsf.Manager.prototype.getApproverSet = function(req, callback){
    this.loading.show(); // お待ちくださいオン
    console.log(req);
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_GET_APPROVER_SET, dojo.toJson(req),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result);
            }else{
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

/**
 * 新規作成選択時のポップアップメニュー情報
 *
 * @returns {Array.<Object>}
 */
teasp.Tsf.Manager.prototype.getViewConfig = function(){
    return this.main.getViewConfig();
};

teasp.Tsf.Manager.prototype.showDialog = function(dlgName, obj, callback){
    if(!this.dialogs[dlgName]){
        this.dialogs[dlgName] = new teasp.Tsf[dlgName]();
    }
    this.dialogs[dlgName].show(obj, callback);
};

teasp.Tsf.Manager.prototype.removeDialog = function(dlgName){
    if(this.dialogs[dlgName]){
        delete this.dialogs[dlgName];
        this.dialogs[dlgName] = null;
    }
};

teasp.Tsf.Manager.prototype.showSearchListDialog = function(obj, option, callback){
    if(!this.searchList){
        this.searchList = {};
    }
    if(!this.searchList[obj.discernment]){
        this.searchList[obj.discernment] = new teasp.Tsf[obj.dialog || 'SearchList']();
        this.searchList[obj.discernment].init(teasp.Tsf.formParams[obj.discernment]);
    }
    this.searchList[obj.discernment].setOption(option);
    this.searchList[obj.discernment].show(obj, callback);
};

teasp.Tsf.Manager.prototype.removeSearchListDialog = function(discernment){
    if(this.searchList && this.searchList[discernment]){
        delete this.searchList[discernment];
        this.searchList[discernment] = null;
    }
};

teasp.Tsf.Manager.prototype.showProcessInstanceSteps = function(_obj, callback){
    var obj = teasp.Tsf.util.mixin({
        discernment : 'processInstanceSteps',
        dialog      : 'ProcessInstanceSteps'
    }, _obj);
    var fv;
    if(_obj.cancelApplyId){
        fv = teasp.Tsf.util.formatString("ProcessInstance.TargetObjectId in ('{0}', '{1}')", _obj.id, _obj.cancelApplyId);
    }else{
        fv = teasp.Tsf.util.formatString("ProcessInstance.TargetObjectId = '{0}'", _obj.id);
    }
    var option = {
        filts             : [{ filtVal: fv }],
        cancelCallback    : (_obj.cancelable ? _obj.cancelCallback : null),
        dataProcessingExt : function(cancelApplyId){
            return function(records){
                dojo.forEach(records, function(record){
                    if(cancelApplyId
                    && record.ProcessInstance
                    && teasp.Tsf.util.equalId(record.ProcessInstance.TargetObjectId, cancelApplyId)){
                        record.isCancelApply = true;
                    }
                });
            };
        }(_obj.cancelApplyId)
    };
    this.showSearchListDialog(obj, option, callback);
};

/**
 * 旧タイプのダイアログオープン用
 *
 * @param dialogName
 * @param params
 * @param pouch
 * @param thisObject
 * @param callback
 */
teasp.Tsf.Manager.prototype.dialogOpen = function(dialogName, params, pouch, thisObject, callback){
    if(!this.legacyDialogs[dialogName]){
        this.legacyDialogs[dialogName] = new teasp.Tsf.dialog[dialogName]();
    }
    this.legacyDialogs[dialogName].open(pouch, params, callback, thisObject);
};

/**
 * 旧タイプのダイアログクローズ用
 *
 * @param dialogName
 * @param params
 * @param pouch
 * @param thisObject
 * @param callback
 */
teasp.Tsf.Manager.prototype.dialogClose = function(dialogName){
    if(this.legacyDialogs[dialogName]){
        this.legacyDialogs[dialogName].close();
    }
};

/**
 * お待ちくださいダイアログ
 *
 * @param {boolean} flag
 */
teasp.Tsf.Manager.loading = function(flag){
    if(flag){
        tsfManager.loading.show.apply(tsfManager.loading);
    }else{
        tsfManager.loading.hide.apply(tsfManager.loading);
    }
};

teasp.Tsf.Manager.prototype.setImage = function(key, url){
    this.imageMap[key] = url;
};

teasp.Tsf.Manager.prototype.getImage = function(key){
    return this.imageMap[key];
};

teasp.Tsf.Manager.prototype.setImageSrc = function(){
    for(var key in this.imageMap){
        if(!this.imageMap.hasOwnProperty(key)){
            continue;
        }
        var url = this.imageMap[key];
        teasp.Tsf.Dom.query('img.' + key).forEach(function(el){
            el.src = url;
        });
    }
};

/**
 * 費目オブジェクトをIDで取得
 *
 * @param {string} id
 * @returns {teasp.Tsf.ExpItem|null}
 */
teasp.Tsf.Manager.prototype.getExpItemById = function(id){
    return this.info.getExpItemById(id);
};

/**
 * 費目オブジェクトを費目コードで取得
 *
 * @param {string} id
 * @returns {teasp.Tsf.ExpItem|null}
 */
teasp.Tsf.Manager.prototype.getExpItemByItemCode = function(itemCode){
    return this.info.getExpItemByItemCode(itemCode);
};

/**
 * 外貨オブジェクトをIDで取得
 *
 * @param {string} id
 * @returns {teasp.Tsf.ForeignCurrency|null}
 */
teasp.Tsf.Manager.prototype.getForeignById = function(id){
    return this.info.getForeignById(id);
};

teasp.Tsf.Manager.prototype.getForeignByName = function(name){
    return this.info.getForeignByName(name);
};

teasp.Tsf.Manager.prototype.getInfo                  = function(){ return this.info; };
teasp.Tsf.Manager.prototype.getLoadRes               = function(){ return this.info.getLoadRes(); };

teasp.Tsf.Manager.prototype.getSessionEmp            = function(){ return this.info.getSessionEmp(); };
teasp.Tsf.Manager.prototype.getSessionFullPhotoUrl   = function(){ return this.info.getSessionFullPhotoUrl(); };
teasp.Tsf.Manager.prototype.getSessionSmallPhotoUrl  = function(){ return this.info.getSessionSmallPhotoUrl(); };
teasp.Tsf.Manager.prototype.getSessionEmpId          = function(){ return this.info.getSessionEmpId(); };
teasp.Tsf.Manager.prototype.getSessionEmpCode        = function(){ return this.info.getSessionEmpCode(); };
teasp.Tsf.Manager.prototype.getSessionEmpName        = function(){ return this.info.getSessionEmpName(); };
teasp.Tsf.Manager.prototype.getSessionDeptId         = function(){ return this.info.getSessionDeptId(); };
teasp.Tsf.Manager.prototype.getSessionDeptCode       = function(){ return this.info.getSessionDeptCode(); };
teasp.Tsf.Manager.prototype.getSessionDeptName       = function(){ return this.info.getSessionDeptName(); };
teasp.Tsf.Manager.prototype.getSessionEmpTypeName    = function(){ return this.info.getSessionEmpTypeName(); };

teasp.Tsf.Manager.prototype.getTargetEmp             = function(){ return this.info.getTargetEmp(); };
teasp.Tsf.Manager.prototype.getFullPhotoUrl          = function(){ return this.info.getFullPhotoUrl(); };
teasp.Tsf.Manager.prototype.getDeptName              = function(){ return this.info.getDeptName(); };
teasp.Tsf.Manager.prototype.getEmpTypeName           = function(){ return this.info.getEmpTypeName(); };
teasp.Tsf.Manager.prototype.getEmpId                 = function(){ return this.info.getEmpId(); };
teasp.Tsf.Manager.prototype.getEmpName               = function(){ return this.info.getEmpName(); };
teasp.Tsf.Manager.prototype.getEmpExpHistory         = function(){ return this.info.getEmpExpHistory(); };
teasp.Tsf.Manager.prototype.getEmpExpConfig          = function(dt){ return this.info.getEmpExpConfig(dt); };
teasp.Tsf.Manager.prototype.getEmpJobAssigns         = function(){ return this.info.getEmpJobAssigns(); };
teasp.Tsf.Manager.prototype.getEmpUserId             = function(){ return this.info.getEmpUserId(); };
teasp.Tsf.Manager.prototype.isUsingReceiptSystem     = function(){ return this.info.isUsingReceiptSystem(); }; // 領収書入力システムを使用する
teasp.Tsf.Manager.prototype.isUsingJsNaviSystem      = function(){ return this.info.isUsingJsNaviSystem(); };	// J'sNAVI Jrを使用する
teasp.Tsf.Manager.prototype.isUseConnectICExpense    = function(){ return this.info.isUseConnectICExpense(); };	// IC連携機能の経費登録機能を使用する
teasp.Tsf.Manager.prototype.isUseScannerStorage      = function(){ return this.info.isUseScannerStorage(); };	// 電子帳簿保存法スキャナ保存対応機能を使用する
teasp.Tsf.Manager.prototype.getEmpJobSearchCondition = function(){ return this.info.getEmpJobSearchCondition(); };

teasp.Tsf.Manager.prototype.getStationFromHist       = function(){ return this.info.getStationFromHist(); };
teasp.Tsf.Manager.prototype.getStationToHist         = function(){ return this.info.getStationToHist(); };
teasp.Tsf.Manager.prototype.getDepts                 = function(){ return this.info.getDepts(); };
teasp.Tsf.Manager.prototype.getUnderDeptIds          = function(deptId){ return this.info.getUnderDeptIds(deptId); };
teasp.Tsf.Manager.prototype.getForeigns              = function(){ return this.info.getForeigns(); };
teasp.Tsf.Manager.prototype.getExpCouponList         = function(){ return this.info.getExpCouponList(); };
teasp.Tsf.Manager.prototype.getExpApplyNoList        = function(){ return this.info.getExpApplyNoList(); };
teasp.Tsf.Manager.prototype.getPayItems              = function(){ return this.info.getPayItems(); };
teasp.Tsf.Manager.prototype.getZgAccounts            = function(){ return this.info.getZgAccounts(); };
teasp.Tsf.Manager.prototype.getHelpLink              = function(){ return this.info.getHelpLink(); };

teasp.Tsf.Manager.prototype.isSysAdmin               = function(){ return this.info.isSysAdmin(); };
teasp.Tsf.Manager.prototype.isExpAdmin               = function(){ return this.info.isExpAdmin(); };
teasp.Tsf.Manager.prototype.isManager                = function(){ return this.info.isManager(); };
teasp.Tsf.Manager.prototype.isAllowEditExpAdmin      = function(){ return this.info.isAllowEditExpAdmin(); };
teasp.Tsf.Manager.prototype.isAllowEditManager       = function(){ return this.info.isAllowEditManager(); };
teasp.Tsf.Manager.prototype.isRequireChargeJob       = function(){ return this.info.isRequireChargeJob(); };
teasp.Tsf.Manager.prototype.isRequireChargeDept      = function(){ return this.info.isRequireChargeDept(); };  // 経費の負担部署を入力する
teasp.Tsf.Manager.prototype.getExpCountLimit         = function(){ return this.info.getExpCountLimit(); };     // １申請の最大明細数
teasp.Tsf.Manager.prototype.getDefaultChargeDept     = function(){ return this.info.getDefaultChargeDept(); }; // 負担部署のデフォルトを返す
teasp.Tsf.Manager.prototype.isExpLinkDocument        = function(){ return this.info.isExpLinkDocument(); };
teasp.Tsf.Manager.prototype.getAtkApplyTypeList      = function(){ return this.info.getAtkApplyTypeList(); }; // 稟議の「種別」選択肢
teasp.Tsf.Manager.prototype.isAllowMinusApply        = function(){ return this.info.isAllowMinusApply(); };
teasp.Tsf.Manager.prototype.getExpStartDate          = function(){ return this.info.getExpStartDate(); }; // 経費精算の起算日
teasp.Tsf.Manager.prototype.isUseExpApproverSet      = function(){ return this.info.isUseExpApproverSet(); }; // 経費の承認者設定を使用する
teasp.Tsf.Manager.prototype.getSocialExpenseItemId   = function(){ return this.info.getSocialExpenseItemId(); }; // 会議・交際費の費目ID
teasp.Tsf.Manager.prototype.isRequireNote            = function(key){ return this.info.isRequireNote(key); }; // 申請時の備考入力を必須にする
teasp.Tsf.Manager.prototype.isDisabledTimeReport     = function(){ return this.info.isDisabledTimeReport(); }; // タイムレポートを使用不可にする
teasp.Tsf.Manager.prototype.isUseExpCancelApply      = function(){ return this.info.isUseExpCancelApply(); }; // 経費申請の承認取消で赤伝票を申請する
teasp.Tsf.Manager.prototype.getJtbExpItems           = function(){ return this.info.getJtbExpItems(); }; // JTB連携用の費目
teasp.Tsf.Manager.prototype.isDoNotCopyExtraItem     = function(){ return this.info.isDoNotCopyExtraItem(); }; // 経費明細入力時に基本情報の拡張項目をコピーしない
teasp.Tsf.Manager.prototype.isUseJsNaviDummy         = function(){ return this.info.isUseJsNaviDummy(); }; // JsNAVIダミーを使用

teasp.Tsf.Manager.prototype.getTaxRoundFlag = function(){ return this.info.getTaxRoundFlag(); };
teasp.Tsf.Manager.prototype.isDiffView = function(){ return (this.form && this.form.canDiffView() ? this.diffView : false); };
teasp.Tsf.Manager.prototype.setDiffView = function(flag){ this.diffView = flag; };

teasp.Tsf.Manager.prototype.isOthers = function(){
    return this.isEmpTargetMode() || !teasp.Tsf.util.equalId(this.getSessionEmpId(), this.getEmpId());
};

teasp.Tsf.Manager.prototype.getCurrentFormType = function(){ return (this.form ? this.form.formType : null); };

/**
 * 費目の選択肢
 *
 * @param {Object} expItemFilter
 * @returns {Array.<teasp.Tsf.ExpItem>}
 */
teasp.Tsf.Manager.prototype.getExpItems = function(expItemFilter){
    return this.info.getExpItems(expItemFilter);
};

teasp.Tsf.Manager.prototype.getExpPreApplyConfigByName = function(name){
    return this.info.getExpPreApplyConfigByName(name);
};

teasp.Tsf.Manager.prototype.getExpPreApplyConfigByView = function(view){
    return this.info.getExpPreApplyConfigByView(view);
};

teasp.Tsf.Manager.prototype.getTicketPeriod = function(){
    return this.info.getTicketPeriod();
};

teasp.Tsf.Manager.prototype.isExpWorkflow = function(){
    return this.info.isExpWorkflow();
};

teasp.Tsf.Manager.prototype.isCommuterPassWorkflow = function(){
    return this.info.isCommuterPassWorkflow();
};

teasp.Tsf.Manager.prototype.getUseEkitan = function(){
    return this.info.getUseEkitan();
};

teasp.Tsf.Manager.prototype.isOutputJournal = function(){
    return this.info.isOutputJournal();
};

teasp.Tsf.Manager.prototype.getICCardMode = function(){
    return (this.getUseEkitan() == 2 ? '1' : null);
};

teasp.Tsf.Manager.prototype.setExpHistory = function(sh, route){
    this.info.setExpHistory(sh, route);
    var arg = {
        empId       : this.getEmpId(),
        expHistory  : dojo.toJson(this.getEmpExpHistory())
    };
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_UPDATE_EXPHISTORY, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
        }),
        { escape : false }
    );
};

teasp.Tsf.Manager.prototype.setExpConfig = function(expConfig, callback){
    var arg = {
        empId      : this.getEmpId(),
        expConfig  : dojo.toJson(expConfig)
    };
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_UPDATE_EXPCONFIG, teasp.Tsf.util.toJson(arg),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                this.info.setEmpExpConfig(expConfig);
                callback(true);
            }else{
                callback(false, teasp.Tsf.Error.parse(event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.Manager.prototype.setPaid = function(req, callback){
    console.log('[teasp.Tsf.Manager.prototype.setPaid]');
    console.log(req);
    this.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(req),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            this.loading.hide(); // お待ちくださいオフ
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true);
            }else{
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.Manager.prototype.resetPaid = function(req, callback){
    console.log('[teasp.Tsf.Manager.prototype.resetPaid]');
    console.log(req);
    this.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(req),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            this.loading.hide(); // お待ちくださいオフ
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true);
            }else{
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

/**
 * イメージ表示画面を開く
 *
 * @param {string} id
 * @param {boolean=} readOnly 表示モード (タイムレポート画面の場合のみ有効)
 */
teasp.Tsf.Manager.prototype.openExpImageView = function(id, readOnly){
    var editMode; // 領収書表示画面の編集モード
    // 通常の状態
    if (this.form) {
        // 編集モードの初期値は画面と一致
        editMode = !this.form.isReadOnly();
        if (this.form instanceof teasp.Tsf.FormT) {
            // タイムレポート画面から領収書表示の場合、引数の表示モードも利用
            editMode = editMode && !readOnly;
        }
    }
    // 編集画面以外から表示されたとき
    else {
        editMode = !readOnly;
    }

    var uriText = teasp.getPageUrl('expImageView')
            + '?expLogId=' + id
            + '&openerObj=view'
            + '&mode=' + (editMode ? 'edit' : 'view');
    var h = (screen.availHeight || 800);
    if(h > 800){
        h = 800;
    }
    if(teasp.isSforce1()){
        sforce.one.navigateToURL(uriText);
    }else{
        var wh = window.open(uriText, 'attachments', 'width=800,height=' + h + ',resizable=yes,scrollbars=yes');
        setTimeout(function(){ if(wh) { wh.resizeTo(810, h); wh.focus(); } }, 100);
    }
};

teasp.Tsf.Manager.prototype.openReceiptImageView = function(id, parentId){
    var url = teasp.getPageUrl('empRefView') + '?id=' + id + '&parentId=' + parentId;
    if(teasp.isSforce1()){
        sforce.one.navigateToURL(url);
    }else{
        var wh = window.open(url, 'attachment', 'width=700,height=600,resizable=yes,scrollbars=yes');
        if(wh){
            wh.focus();
        }
    }
};

/**
 * 経費明細履歴画面を開く
 *
 * @param {string} 経費明細id
 */
teasp.Tsf.Manager.prototype.openExpHistoryView = function(empExpId){
    // FIXME 経費履歴一覧画面に書き換え
    var uriText = teasp.getPageUrl('expHistoryView')
    + '?empExpId=' + empExpId;

    if(teasp.isSforce1()){
        sforce.one.navigateToURL(uriText);
    }
    else {
        var wh = window.open(uriText, 'attachments', 'width=900,height=400,resizable=yes,scrollbars=yes');
        if(wh){
            wh.focus();
        }
    }
};

/**
 * 領収書登録windowから登録・削除の状態を得る
 * @param {string} expLogId 該当expLog.id
 * @param {boolean} flag true 書き込み false 削除
 * @param {string} openerObj 添付子windowをopenしたクラスの名前
 * @author nekonekon
 */
teasp.Tsf.Manager.prototype.appliedReceipt = function(expLogId, flag, openerObj){
    this.info.setAttachmentExist(expLogId, flag);
    this.form.setAttachmentExist(expLogId, flag);
    if(this.dialogs.ExpDetail){
        this.dialogs.ExpDetail.setAttachmentExist(expLogId, flag);
    }
};

/**
 * 添付ファイルウィンドウから添付ファイルのリストを得る
 * @param {Object} attachObj
 */
teasp.Tsf.Manager.prototype.appliedAttach = function(attachObj){
    var attach = {
        id      : attachObj.id,
        attachs : [],
        deleted : []
    };
    dojo.forEach(attachObj.attachs, function(a){
        var o = {};
        for(var key in a){
            o[key] = a[key];
        }
        attach.attachs.push(o);
    });
    dojo.forEach(attachObj.deleted, function(v){
        attach.deleted.push(v);
    });
    this.form.setAttachmentInfo(attach);
};

/**
 * CSV読込ウィンドウから経費明細のリストを得る
 * @param {Object} attachObj
 */
teasp.Tsf.Manager.prototype.appliedEmpExp = function(COL, data){
    this.form.importEmpExps(COL, data);
};

/**
 * 指定の精算区分で選択可能な支払種別取得のための下処理。
 * カンマ区切りの精算区分を分解して、精算区分１件ごとのマップにする。
 */
teasp.Tsf.Manager.prototype.processPayeeType = function(){
    var res = this.getLoadRes();
    var payees = res.payees || {};
    // payees には下記のような構造で、精算区分ごとに選択可能な
    // 支払種別の配列がセットされている。
    // {
    //   "社員": ['1','2'],
    //   "購買": ['2'],
    //   ",社長,会長,購買,": ['3'],
    //   ""  : ['1']
    // }
    var pmap = {};
    for(var key in payees){
        if(!payees.hasOwnProperty(key)){
            continue;
        }
        if(!key || key.indexOf(',') < 0){
            pmap[key] = (pmap[key] || []).concat(payees[key] || []);
        }else{
            var o = payees[key]; // key・・",社長,会長,購買,"
            var ks = key.split(/,/);
            for(var i = 0 ;i < ks.length ; i++){
                var k = ks[i];
                if(k){
                    pmap[k] = (pmap[k] || []).concat(o || []);
                }
            }
        }
    }
    // 重複除去
    for(key in pmap){
        var types = pmap[key] || [];
        var m = {};
        for(var i = types.length - 1 ; i >= 0 ; i--){
            var type = types[i];
            if(m[type]){
                types.splice(i, 1);
            }else{
                m[type] = 1;
            }
        }
        pmap[key] = types;
    }
    res.payees = pmap;
};

/**
 * 指定の精算区分で選択可能な支払種別を返す
 *
 * @param {string|null} expenseType 精算区分
 * @returns {{<string>:Array.<string>}}
 */
teasp.Tsf.Manager.prototype.getPayeeTypeNums = function(expenseType){
    var res = this.getLoadRes();
    var payees = res.payees || {};
    // ※ this.processPayeeType() の処理を行った前提
    // payees には下記のような構造で、精算区分ごとに選択可能な
    // 支払種別の配列がセットされている。
    // {
    //   "社員": ['1','2'],
    //   "購買": ['2','3'],
    //   "社長": ['3'],
    //   "会長": ['3'],
    //   ""    : ['1']
    // }
    var nums = {};
    if(expenseType){
        var pts = payees[expenseType] || []; // 支払種別の配列
        for(var i = 0 ; i < pts.length ; i++){
            var pt = pts[i];
            nums[pt] = 1;
        }
    }
    var pts = payees[''] || []; // 精算区分フリーの支払種別の配列
    for(var i = 0 ; i < pts.length ; i++){
        var pt = pts[i];
        if(typeof(nums[pt]) == 'number'){
            nums[pt] = nums[pt] + 1;
        }else{
            nums[pt] = 1;
        }
    }
    return nums;
};

/**
 * 領収書読込関連
 * @param obj
 * @param callback
 */
teasp.Tsf.Manager.prototype.actionReceipt = function(obj, callback){
    this.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_ACTION_RECEIPT, teasp.Tsf.util.toJson(obj),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            this.loading.hide(); // お待ちくださいオフ
            if(event.status){
                callback(result.result != 'NG', result);
            }else{
                callback(false, event);
            }
        }),
        { escape : false }
    );
};

/**
 * 経費連携関連
 * @param obj
 * @param callback
 */
teasp.Tsf.Manager.prototype.actionExternal = function(obj, callback){
    this.loading.show(); // お待ちくださいオン
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_ACTION_EXTERNAL, teasp.Tsf.util.toJson(obj),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            this.loading.hide(); // お待ちくださいオフ
            if(event.status){
                callback(result.result != 'NG', result);
            }else{
                callback(false, event);
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.Manager.prototype.getDeptList = function(req, callback){
    console.log('[teasp.Tsf.Manager.prototype.getDeptList]');
    console.log(req);
    if(req.waitOn){
        this.loading.show(); // お待ちくださいオン
    }
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(req),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            if(req.waitOn){
                this.loading.hide(); // お待ちくださいオフ
            }
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result);
            }else{
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

/**
 * ジョブリスト取得
 *
 * @param {Object} req
 * @param {Function} callback
 */
teasp.Tsf.Manager.prototype.getEmpList = function(req, callback){
    this.loading.show(); // お待ちくださいオン
    console.log(req);
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_GET_EMP_LIST, dojo.toJson(req),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            this.loading.hide(); // お待ちくださいオフ
            console.log(event);
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result);
            }else{
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.Manager.prototype.resizedArea = function(box){
    if(this.list){
        this.list.resizedArea(box);
    }
};

teasp.Tsf.Manager.prototype.isEmpTargetMode = function(){
    var argEmpId = this.getArgEmpId();
    var targetId = this.getArgId();
    if(targetId){
        return true;
    }
    return (argEmpId && !teasp.Tsf.util.equalId(this.getSessionEmpId(), argEmpId) ? true : false);
};

teasp.Tsf.Manager.prototype.potalAction = function(req, callback){
    console.log('[teasp.Tsf.Manager.prototype.potalAction]');
    console.log(req);
    if(!req.hideBusy){
        this.loading.show(); // お待ちくださいオン
    }
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_POTAL_ACTION, teasp.Tsf.util.toJson(req),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            if(!req.hideBusy){
                this.loading.hide(); // お待ちくださいオフ
            }
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result);
            }else{
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.Manager.prototype.jtbAction = function(req, callback){
    console.log('[teasp.Tsf.Manager.prototype.jtbAction]');
    console.log(req);
    if(!req.hideBusy){
        this.loading.show(); // お待ちくださいオン
    }
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_JTB_ACTION, teasp.Tsf.util.toJson(req),
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            if(!req.hideBusy){
                this.loading.hide(); // お待ちくださいオフ
            }
            if(event.status && result.result == 'OK'){
                teasp.util.excludeNameSpace(result);
                callback(true, result);
            }else{
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

teasp.Tsf.Manager.prototype.getAttachmentBody = function(id, callback){
    console.log('[teasp.Tsf.Manager.prototype.getAttachmentBody]');
    console.log(id);
    Visualforce.remoting.Manager.invokeAction(teasp.Tsf.Manager.API_GET_ATTACHMENT_BODY, id,
        teasp.Tsf.Dom.hitch(this, function(result, event){
            console.log(event);
            if(event.status){
                teasp.util.excludeNameSpace(result);
                callback(true, result);
            }else{
                callback(false, (event.status ? result : event));
            }
        }),
        { escape : false }
    );
};

/**
 * 印刷
 */
teasp.Tsf.Manager.prototype.openPrintView = function(){
    if(!this.form){
        return;
    }
    this.form.openPrintView();
};

/**
 * 引数の情報で明細行を選択状態にする
 *
 * @params {Array.<Object>} exps
 */
teasp.Tsf.Manager.prototype.restoreCheck = function(exps){
    if(!this.form){
        return;
    }
    this.form.restoreCheck(exps);
};

/**
 * 明細行の移動
 */
teasp.Tsf.Manager.prototype.moveStart = function(){
    if(!this.form){
        return;
    }
    this.form.moveStart();
};

/**
 * 編集権限があるか
 */
teasp.Tsf.Manager.prototype.isEditable = function(){
    var rights = this.info.getRights();
    return ((rights & (teasp.constant.P_E|teasp.constant.P_AX)) != 0);
};

/**
 * CSV読込のヘッダ、データ情報をセット
 * @param {Array.<Object>} csvHeader
 * @param {Array.<Object>} csvData
 * @param {Array.<Object>} csvPayees
 * @param {Array.<Object>} csvDepts
 * @param {Array.<Object>} csvJobs
 * @param {string} fname
 */
teasp.Tsf.Manager.prototype.setCsvData = function(csvHeader, csvData, csvPayees, csvDepts, csvJobs, fname){
    if(this.target == teasp.Tsf.Manager.CSV_UPLOAD){
        this.form.setCsvData(csvHeader, csvData, csvPayees, csvDepts, csvJobs, fname);
    }
};

/**
 * 基本情報エリアの値を返す
 * （子ウィンドウへ）
 * @returns {Object}
 */
teasp.Tsf.Manager.prototype.getAssistParam = function(){
    return this.form.getAssistParam();
};

/**
 * CSV読込トークンを返す
 * （子ウィンドウへ）
 * @returns {string|null}
 */
teasp.Tsf.Manager.prototype.getToken = function(){
    return (this.form ? this.form.getToken() : null);
};

/**
 * CSV読込のデータ転送開始
 */
teasp.Tsf.Manager.prototype.startCsvImport = function(){
    var bp = teasp.Tsf.Dom.node('.ts-busy-panel');
    if(bp){
        var m = teasp.Tsf.Dom.node('button', bp);
        if(m){
            teasp.Tsf.Dom.style(m, 'display', 'none');
        }
    }
};

/**
 * CSV読込実行中の表示をクリア
 */
teasp.Tsf.Manager.prototype.closedCsvImport = function(){
    teasp.Tsf.Dom.setBusyPanel(false);
    this.setCsvImportFlag(false);
};

/**
 * CSV読込実行中の表示のキープをセット
 * @param {boolean=} flag trueならキープする
 */
teasp.Tsf.Manager.prototype.setKeepCsvImport = function(flag){
    this.keepCsvImport = flag;
};

/**
 * CSV読込実行中の表示のクリアを親ウィンドウに対して要求
 */
teasp.Tsf.Manager.prototype.closeCsvImport = function(){
    if(!this.keepCsvImport){
        var win = window.opener;
        if(win){
            win.tsfManager.closedCsvImport();
        }
    }
};

/**
 * CSV読込の子ウィンドウの開閉フラグをセット
 * @param flag true:開いた false:閉じた
 */
teasp.Tsf.Manager.prototype.setCsvImportFlag = function(flag){
    this.expCsvImportFlag = flag;
};

/**
 * CSV読込の子ウィンドウを強制で閉じる
 */
teasp.Tsf.Manager.prototype.clearCsvImport = function(){
    if(this.expCsvImportFlag){
        var w = window.open('', 'expCsvUpload');
        w.close();
        this.setCsvImportFlag(false);
    }
};

teasp.Tsf.Manager.prototype.setJtbForm = function(jtbform){
    this.jtbform = jtbform;
};

teasp.Tsf.Manager.prototype.getJtbForm = function(){
    return this.jtbform;
};

teasp.Tsf.Manager.prototype.openJtbWindow = function(ssoMode){
    if(!this.form){
        return;
    }
    var section = this.form.getSectionByDiscernment(teasp.Tsf.formParams.sectionJtb.discernment);
    section.openJtbWindow(ssoMode);
};

/**
 * 出張手配の予約反映処理を行う
 */
teasp.Tsf.Manager.prototype.jtbSynchro = function(){
    if(!this.form){
        return null;
    }
    return this.form.jtbSynchro();
};
