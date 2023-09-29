teasp.provide('teasp.view.DataReader');

/**
 * その他のデータ出力画面
 *
 * @constructor
 * @extends {teasp.view.Base}
 * @author DCI小島
 */
teasp.view.DataReader = function(level){
    this.errorAreaId = 'errorArea';
    this.ROW_MAX = 40;
    this.valueCache = {};
    this.stopped = false;
    this.level = level;
    this.commonObj = null;
    this.handlesL1 = [];
    this.hendlesL2 = [];
    this.handlesL3 = [];
    this.L1 = 1;
    this.L2 = 2;
    this.L3 = 4;
    this.bfld = {
            id                : 1
          , name              : 2
          , createddate       : 3
          , createdbyid       : 4
          , lastmodifieddate  : 5
          , lastmodifiedbyid  : 6
          , systemmodstamp    : 7
          , isdeleted         : 8
          , ownerid           : 9
      };
};

teasp.view.DataReader.prototype = new teasp.view.Base();

teasp.view.DataReader.prototype.contact = function(req, onSuccess, onFailure, nowait){
    teasp.action.contact.remoteMethods(
        (is_array(req) ? req : [req]),
        {
            errorAreaId : (req.errorAreaId ? req.errorAreaId : this.errorAreaId),
            nowait      : (nowait || false)
        },
        onSuccess,
        onFailure,
        this
    );
};

teasp.view.DataReader.prototype.editable = function(){
    return (this.level == '2');
};

/**
 * 画面初期化
 *
 * @param {Function=} onSuccess レスポンス正常受信時の処理
 * @param {Function=} onFailure レスポンス異常受信時の処理
 */
teasp.view.DataReader.prototype.init = function(onSuccess, onFailure){
    this.createTab(dojo.byId('baseArea'));
    this.nameMap = {};
    this.localNameMap = {};
    this.contact(
        {
            funcName: 'getExtResult',
            params  : {
                action : 'SObjectList',
                keepNs : true
            }
        },
        function(result){
            this.sObjects = result.sObjects;
            for(var key in this.sObjects){
                if(!this.sObjects.hasOwnProperty(key)){
                    continue;
                }
                var o = this.sObjects[key];
                o.key = key;
                this.nameMap[o.name.toLowerCase()] = key;
                this.localNameMap[o.localName.toLowerCase()] = key;
            }
            this.createSelect(dojo.byId('dataReaderPane1'));
            this.createTsBaseArea(dojo.byId('dataReaderPane2'));
            this.getOrganization();
        },
        null,
        false
    );
};

teasp.view.DataReader.prototype.getOrganization = function(){
    this.contact(
        {
            funcName: 'getExtResult',
            params  : {
                action : 'SObject',
                key : 'organization'
            }
        },
        function(res, _so){
            this.scanRefer(res, _so, dojo.hitch(this, function(so){
                var soql = this.getSoql(so);
                this.contact(
                    {
                        funcName: 'getExtResult',
                        params  : {
                            soql   : soql,
                            limit  : null,
                            offset : null
                        }
                    },
                    function(result){
                        this.organization = result.records[0];
                        var fields = this.getSoqlFields(soql);
                        var pp = this.parseRecord(so, this.organization, fields, false);
                        this.organizationValue = '';
                        for(var i = 0 ; i < fields.length ; i++){
                            var f = fields[i];
                            this.organizationValue += ((typeof(f) == 'string' ? f : f.join('.')) + '=' + pp[i] + '\n');
                        }
                    },
                    null,
                    false
                );
            }));
        },
        null,
        true
    );
};

teasp.view.DataReader.prototype.createTab = function(area){
    var tabArea = dojo.create('div', { style: { width:"1800px", marginBottom:"8px" } }, area);
    var tab1 = dojo.create('div', {
        id        : 'dataReaderTab1',
        innerHTML : 'Object',
        style     : { border:"1px solid gray", display:"table", "float":"left", padding:"2px 8px", marginRight:"10px", cursor:"pointer", fontWeight:"bold" }
    }, tabArea);
    var tab2 = dojo.create('div', {
        id        : 'dataReaderTab2',
        innerHTML : 'TeamSpirit',
        style     : { border:"1px solid gray", display:"table", "float":"left", padding:"2px 8px", marginRight:"10px", cursor:"pointer" }
    }, tabArea);
    var link = dojo.create('a', { innerHTML: '別ウィンドウを開く', style: { fontSize:"0.9em", cursor:"pointer" } },
        dojo.create('div', {
        style     : { display:"table", "float":"left", padding:"2px 8px", marginLeft:"20px", marginRight:"10px" }
    }, tabArea));
    dojo.create('a', { innerHTML: 'Download', id: 'dataReaderDL', target:'_blank' },
        dojo.create('div', { style: { display:"none", "float":"left", padding:"2px 8px", marginLeft:"20px", marginRight:"10px" }
    }, tabArea));
    dojo.create('div', { style: { clear:"both" } }, tabArea);

    dojo.connect(link, 'onclick', this, function(){
        window.open(location.href);
    });

    dojo.create('div', { id:'dataReaderPane1', style: { display:"table", position:"relative", zoom:1 } }, area);
    dojo.create('div', { id:'dataReaderPane2', style: { display:"none"  } }, area);

    dojo.connect(tab1, 'onclick', this, function(e){
        dojo.style('dataReaderTab1' , 'font-weight', 'bold');
        dojo.style('dataReaderTab2' , 'font-weight', 'normal');
        dojo.style('dataReaderPane1', 'display', 'table');
        dojo.style('dataReaderPane2', 'display', 'none');
        this.closeVertView();
    });
    dojo.connect(tab2, 'onclick', this, function(e){
        this.closeVertView();
        dojo.style('dataReaderTab1' , 'font-weight', 'normal');
        dojo.style('dataReaderTab2' , 'font-weight', 'bold');
        dojo.style('dataReaderPane1', 'display', 'none');
        dojo.style('dataReaderPane2', 'display', 'table');
        this.onActiveTsAreaM();
    });
};

teasp.view.DataReader.prototype.switchBusy = function(flag){
    if(flag){
        teasp.manager.dialogOpen('BusyWait', null, null);
    }else{
        teasp.manager.dialogClose('BusyWait');
    }
};

teasp.view.DataReader.prototype.getSObjectByKey = function(key){
    return this.sObjects[key];
};

teasp.view.DataReader.prototype.getFieldName = function(key){
    return key;
};

teasp.view.DataReader.prototype.getFieldValue = function(o, key, defa){
    var keys = key.split('.');
    var v = o;
    for(var i = 0 ; (v && i < keys.length) ; i++){
        v = v[this.getFieldName(keys[i])];
    }
    return (v || defa);
};

teasp.view.DataReader.prototype.getLocalName = function(name){
    var keys = name.split('__');
    if(keys.length == 3){
    	return keys[1] + '__' + keys[2];
    }
    return name;
};

teasp.view.DataReader.prototype.getSObjectById = function(id){
    var prefix = (id && id.length > 3 ? id.substring(0, 3) : null);
    if(!prefix){
        return null;
    }
    var so = this.sObjects;
    for(var key in so){
        if(!so.hasOwnProperty(key)){
            continue;
        }
        var o = so[key];
        o.key = key;
        if(o.keyPrefix == prefix){
            return o;
        }
    }
    return null;
};

teasp.view.DataReader.prototype.getSObjectKeyByName = function(name){
    var so = this.sObjects;
    for(var key in so){
        if(!so.hasOwnProperty(key)){
            continue;
        }
        var o = so[key];
        if(o.name.toLowerCase() == name.toLowerCase()){
            return key;
        }
    }
    return null;
};

// パッケージオブジェクトとAPI参照名が重複するオブジェクトであるかどうかを返す
// （このオブジェクトは検索できない）
teasp.view.DataReader.prototype.isUnableSearchObject = function(key){
	var so = this.sObjects[key];
	var sos = this.sObjects;
	for(var k in sos){
		if(!sos.hasOwnProperty(k)){
			continue;
		}
		var o = sos[k];
		if(o.localName.toLowerCase() == so.localName.toLowerCase()){
			// ローカル名が一致する場合、文字列長が長い方（名前空間がある方）を有効とする
			return (o.name.length > so.name.length ? true : false);
		}
	}
	return false;
};

teasp.view.DataReader.random62 = function(k){
    var num = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var a = '';
    var n = 1;
    for(var i = 0 ; i < k ; i++){
        n *= 10;
    }
    var b = Math.floor(Math.random() * n);
    while (b > 0){
        a = num.charAt(b % 62) + a;
        b = Math.floor(b / 62);
    }
    return a;
};

teasp.view.DataReader.prototype.isReadOnlyField = function(fieldObj){
    if(!fieldObj || fieldObj.isCalculated || fieldObj.isAutoNumber){
        return true;
    }
    var fn = fieldObj.name;
    if(fn.toLowerCase() == 'ownerid'){
        return false;
    }
    if(!fieldObj.isCustom && fn.toLowerCase() != 'name'){ // 標準項目は Name 以外はリードオンリー
        return true;
    }
    return false;
};

teasp.view.DataReader.prototype.getPickLabels = function(values, d, cutLen){
    if(!values || values.length <= 0){
        return '';
    }
    var labels = [];
    for(var i = 0 ; i < values.length ; i++){
        labels.push(values[i][0]);
        if(cutLen && labels.length >= cutLen){
            labels.push('※' + cutLen + '件に達したため打ち切り※');
            break;
        }
    }
    return labels.join(d);
};

teasp.view.DataReader.prototype.getTypeMap = function(so, flag, flag2){
    var m = {};
    var flst = this.excludeDuplicateField(so.fieldList || []);
    for(var i = 0 ; i < flst.length ; i++){
        var f = flst[i];
        if(flag2 && f.typeName == 'REFERENCE' && !f.isNillable){
            continue;
        }
        if(flag || !this.isReadOnlyField(f)){
            m[f.name] = f.typeName;
        }
    }
    return m;
};

// オブジェクト選択リスト作成
teasp.view.DataReader.prototype.createSelect = function(area){
    var so = this.sObjects;
    var lst = [];
    for(var key in so){
        so[key].key = key;
        lst.push(so[key]);
    }
    lst = lst.sort(function(a, b){
        return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
    });

    var setSObjectList = function(){
        var customOnly = dojo.byId('dataReaderCustomOnly').checked;
        var select = dojo.byId('dataReaderSObject');
        var oldv = select.value;
        dojo.empty(select);
        dojo.create('option', { innerHTML: '', value: '-' }, select);
        var v = null;
        for(var i = 0 ; i < lst.length ; i++){
            var o = lst[i];
            if(!customOnly || o.isCustom){
                dojo.create('option', { innerHTML: o.name + '(' + o.label + ')', value: o.key }, select);
                if(o.key == oldv){
                    v = o.key;
                }
            }
        }
        if(v){
            select.value = v;
        }
    };

    var div   = dojo.create('div', { style: { padding: "1px" } }, area);
    var label = dojo.create('label', null, div);
    var inp   = dojo.create('input', { type: "checkbox", id: 'dataReaderCustomOnly' }, label);
    dojo.create('span' , { innerHTML: ' Custom Object Only' }, label);
    inp.checked = true;
    dojo.connect(inp, 'onclick', this, setSObjectList);

    // オブジェクト選択コンボボックス生成
    dojo.create('select', { id: 'dataReaderSObject', style: { marginRight:"10px" } }, area);
    setSObjectList();

    // オブジェクト選択変更時のイベント
    dojo.connect(dojo.byId('dataReaderSObject'), 'onchange', this, function(){
        var key = dojo.byId('dataReaderSObject').value;
        if(key == '-'){
            return;
        }
        dojo.style('dataReaderOptionArea', 'display', 'table');
        this.changeSelect(key);
    });

    // フィールド定義情報一括ダウンロードエリア作成
    var btn = dojo.create('input', { type:'button', value: 'Export', style: { padding:"1px 4px" } }, area);
    dojo.connect(btn, 'onclick', this, function(){
        if(this.dLdialog){
            this.dLdialog.show();
        }else{
            var that = this;
            require([
                "dijit/Dialog",
                "dijit/ProgressBar"
            ], function(Dialog, ProgressBar) {
                that.dLdialog = new Dialog({
                    title: "Export",
                    content: that.createDownloadPanel()
                });

                var progressBar = new ProgressBar({ style: "width:340px;" }).placeAt(dojo.byId('dataReaderDLProgress'));

                var uiBlock = dojo.hitch(this, function(flag){
                    dojo.query('input', dojo.byId('dataReaderDLArea')).forEach(function(el){ el.disabled = flag; });
                });

                dojo.connect(dojo.byId('dataReaderDLCancel'), 'onclick', that, function(){
                    this.dLdialog.hide();
                });
                dojo.connect(dojo.byId('dataReaderDLGo'), 'onclick', that, function(){
                    dojo.style('dataReaderDLProgress', 'display', '');
                    progressBar.set({ maximum: 100, value: 0 });
                    uiBlock(true);
                    var dldata = dojo.byId('dataReaderDLDataDownload').checked;
                    this.getBulkFields(progressBar, dldata, function(objs){
                        if(dldata){ // データダウンロード
                            this.buildDlRecord(objs, progressBar, function(){
                                progressBar.set({ value: progressBar.maximum });
                            });
                        }else{
                            this.buildFieldListCsv(objs, function(){
                                uiBlock(false);
                                progressBar.set({ value: progressBar.maximum });
                                dojo.style('dataReaderDLProgress', 'display', 'none');
                            });
                        }
                    }, function(result){
                        uiBlock(false);
                        dojo.style('dataReaderDLProgress', 'display', 'none');
                    });
                });
                var doneButton = dojo.query('#dataReaderDLDataDone input[type="button"]')[0];
                dojo.connect(doneButton, 'onclick', that, function(){
                    uiBlock(false);
                    dojo.style('dataReaderDLDataDone', 'display', 'none');
                    dojo.style('dataReaderDLProgress', 'display', 'none');
                });
                dojo.connect(dojo.byId('dataReaderDLDataDownload'), 'onclick', that, function(e){
                    dojo.byId('dataReaderDLDataWhere'  ).disabled = !dojo.byId('dataReaderDLDataDownload').checked;
                    dojo.byId('dataReaderDLDataAllRows').disabled = !dojo.byId('dataReaderDLDataDownload').checked;
                });
                that.dLdialog.show();
            });
        }
    });

    div = dojo.create('div', { id: 'dataReaderOptionArea', style: 'display:none;margin-top:4px;' }, area);
    var l = [
        { toggle:'dataReaderAttrToggle'          , area:'dataReaderAttrArea'      , name:' Attribute'                    },
        { toggle:'dataReaderFieldToggle'         , area:'dataReaderFieldArea'     , name:' Fields'                       },
        { toggle:'dataReaderRelationToggle'      , area:'dataReaderRelationArea'  , name:' RelationShip'                 },
        { toggle:'dataReaderRecordTextAreaToggle', area:'dataReaderRecordTextArea', name:' SOQL'                         },
//        { toggle:'dataReaderScriptToggle'        , area:'dataReaderScriptArea'    , name:' Script for Developer Console' }
    ];
    for(var i = 0 ; i < l.length ; i++){
        var o = l[i];
        var divc   = dojo.create('div'  , { style: { "float":"left", marginRight:"10px" } }, div);
        var label  = dojo.create('label', null, divc);
        var toggle = dojo.create('input', { type: 'checkbox', id: o.toggle }, label);
        dojo.create('span', { innerHTML: o.name }, label);
        dojo.connect(toggle, 'onclick', this, function(){
            var t = o.toggle;
            var a = o.area;
            return function(){
                var d = dojo.byId(t);
                if(d){
                    dojo.style(a, 'display', (d.checked ? 'table' : 'none'));
                }
            };
        }());
    }
    dojo.create('div', { style: { clear:"both" } }, div);

    dojo.create('div', { id: 'dataReaderDyna' }, area);
};

teasp.view.DataReader.prototype.createTsBaseArea = function(area){
    // メニューごとのエリアを作成
    var tsAreaM = dojo.create('div', { id: 'dataReaderTsAreaM', style: { display:"table" } }, area);
    this.createTsAreaM(tsAreaM);
};

teasp.view.DataReader.prototype.createTsAreaM = function(area){
    var optArea = dojo.create('div', { style: { margin:"8px 0px 8px 0px" } }, area);

    //----------------------------------------------------------------
    dojo.create('div', { innerHTML:'非標準オプション', style: { "float":"left", marginRight:"4px", marginTop:"4px" } }, optArea);
    dojo.create('input', {
        type     : 'text',
        value    : '',
        id       : 'dataReaderDataLocalKey',
        style    : { width:"200px", padding:"0px" },
        readonly : "readonly"
    }, dojo.create('div', { style: { marginRight:"10px", marginBottom:"8px", "float":"left" } }, optArea));
    dojo.create('div', { style: { clear:"both" } }, optArea);

    var lkdiv = dojo.create('div', { style: { margin:"0px 0px 0px 20px" } }, optArea);

    var div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    var label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt1' }, label);
    dojo.create('span', { innerHTML:' Salesforceユーザに紐づかない社員を設定可' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt2' }, label);
    dojo.create('span', { innerHTML:' （未使用）' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt3' }, label);
    dojo.create('span', { innerHTML:' 日次の申請を本日の前後１年以内にする制限を解除' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt4' }, label);
    dojo.create('span', { innerHTML:' （未使用）' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt5' }, label);
    dojo.create('span', { innerHTML:' 勤怠設定の時刻の丸めに「30分刻み」を追加' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt6' }, label);
    dojo.create('span', { innerHTML:' 出退社時刻一括入力機能を追加' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt7' }, label);
    dojo.create('span', { innerHTML:' （未使用）' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt8' }, label);
    dojo.create('span', { innerHTML:' 休暇申請の期間内の来月分を除いて有休残日数を計算' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt10' }, label);
    dojo.create('span', { innerHTML:' 振替申請と休日出勤申請の取消時に入力時間を強制クリア' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt11' }, label);
    dojo.create('span', { innerHTML:' 出退社時刻が入力されていれば実労働時間が０時間でも実勤務日数にカウントする' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt12' }, label);
    dojo.create('span', { innerHTML:' 勤怠計算自動ベリファイをオンにする' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt13' }, label);
    dojo.create('span', { innerHTML:' 事前申請の「申請なしで事後精算を開始できる」オプションを表示する' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt14' }, label);
    dojo.create('span', { innerHTML:' 残業申請・早朝勤務申請の開始・終了時刻のデフォルト値をフレックス時間帯の境界とする<br/>'
        + '<span style="font-size:90%;">&nbsp;&nbsp;（フレックスタイム制で「申請の時間帯以外の勤務は認めない」オンの場合のみ有効）</span>' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt15' }, label);
    dojo.create('span', { innerHTML:' 経費精算のCSV読込機能を有効にする' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt16' }, label);
    dojo.create('span', { innerHTML:' 勤怠日次レコードの備考に入力がなければ備考入力済みと判定しない<br/>'
        + '<span style="font-size:90%;">&nbsp;&nbsp;（システム設定の「ＸＸＸは備考必須にする」=オンかつ「申請の備考と日次の備考を保存時に結合しない」=オンの場合のみ有効）</span>' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, lkdiv);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDataLocalKeyOpt17' }, label);
    dojo.create('span', { innerHTML:' 勤務表をモバイルブラウザで開く際にヘッダを表示する<br/>'
        + '<span style="font-size:90%;">&nbsp;&nbsp;（TS1勤務表モバイル専用画面をブラウザで作動させる時はオンにしないこと。<br/>'
        + '&nbsp;&nbsp;&nbsp;Salesforce1で画面の左右に余白が追加され、Salesforce1を使う場合は見栄えの問題で非推奨）</span>' }, label);

    //----------------------------------------------------------------
    dojo.create('hr', {style:"bordr:1px solid #eee;"}, optArea);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    dojo.create('span', { innerHTML:'有休を何か月前の勤怠確定時に付与するか' }, div);
    dojo.create('input', {
        type      : 'text',
        id        : 'dataReaderDataYuqProvidePriorMonth',
        className : 'inputran',
        maxLength : 2,
        style : {
            width      : "24px",
            marginLeft : "10px",
            textAlign  : "right",
            padding    : "1px 4px"
        }
    }, div);
    dojo.create('span', { innerHTML:'（YuqProvidePriorMonth__c）' }, div);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    dojo.create('span', { innerHTML:'事前申請及び経費精算の１申請あたりの明細数の上限' }, div);
    dojo.create('input', {
        type      : 'text',
        id        : 'dataReaderExpCountLimit',
        className : 'inputran',
        maxLength : 3,
        style : {
            width      : "30px",
            marginLeft : "10px",
            textAlign  : "right",
            padding    : "1px 4px"
        }
    }, div);
    dojo.create('span', { innerHTML:'（ExpPreApplyConfig__c.expCountLimit）' }, div);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderEnableShift' }, label);
    dojo.create('span', { innerHTML:' シフト管理機能を有効にする' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderEnableShiftCsvImport' }, label);
    dojo.create('span', { innerHTML:' シフト管理のCSVインポート機能を有効にする' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderEnableShiftImportToolDownload' }, label);
    dojo.create('span', { innerHTML:' シフト登録ツールのダウンロードリンクを表示する', style:'margin-right:30px;' }, label);
    dojo.create('span', { innerHTML:' ダウンロードリンクを差し替え' }, div);
    dojo.create('input', {
        type      : 'text',
        id        : 'dataReaderShiftImportToolCustomURL',
        className : 'inputran',
        maxLength : 255,
        style : {
            width      : "300px",
            marginLeft : "10px",
            marginRight: "10px",
            textAlign  : "left",
            padding    : "1px 4px"
        }
    }, div);

    // シフトバリデーションを設定する
    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderUseShiftValidationSetting' }, label);
    dojo.create('span', { innerHTML:' シフトバリデーションを設定する', style:'margin-right:30px;' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderEnableAccessControlSystem' }, label);
    dojo.create('span', { innerHTML:' 入退館管理機能を有効にする' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderDivergenceInnerCheck' }, label);
    dojo.create('span', { innerHTML:' 入退館管理機能の内側の乖離判定を有効にする' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderSuppressDivergenceCheck' }, label);
    dojo.create('span', { innerHTML:' 入退館管理機能：月次確定後は乖離判定しない' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px 0px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderAutoReJudgeDaysCheck' }, label);
    dojo.create('span', { innerHTML:' 入退館管理機能：再判定期間' }, label);
    var inp = dojo.create('input', {
        type      : 'text',
        id        : 'dataReaderAutoReJudgeDays',
        className : 'inputran',
        maxLength : 2,
        style : {
            width      : "20px",
            marginLeft : "8px",
            marginRight: "8px",
            textAlign  : "right",
            padding    : "1px 4px"
        }
    }, div);
    dojo.connect(inp, 'blur', this, this.enterAutoReJudgeDays);
    dojo.connect(inp, 'keypress', this, function(e){
        if(e.keyCode == 13){ // Enterキー入力
            this.enterAutoReJudgeDays(e);
        }
    });
    dojo.create('span', { innerHTML:'日' }, div);
    div = dojo.create('div', { style:"margin-left:20px;font-size:90%;" }, optArea);
    div.innerHTML = 'バッチ実行時間から上記日数以内に追加/更新/削除された入退館ログがある日付に対して、乖離判定フラグの状態によらず強制的に再判定を行う（その際、前日の判定も更新される場合がある）。';

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderTimeReportDedicatedToJob' }, label);
    dojo.create('span', { innerHTML:' タイムレポートの勤怠情報と経費精算を非表示にする' }, label);

    dojo.create('hr', {style:"bordr:1px solid #eee;"}, optArea);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderWarningOnMAPHW' }, label);
    dojo.create('span', { innerHTML:' 工数実績画面に勤務時間と工数時間不一致の警告アイコンを表示する' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderRecalcTimeOnJobFix' }, label);
    dojo.create('span', { innerHTML:' 工数確定申請時に工数の再計算を行う' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderCheckTimeOnJobFix' }, label);
    dojo.create('span', { innerHTML:' 工数確定申請時に工数の再計算＋工数と勤務時間のチェックを行う' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderCheckInputWorkHours' }, label);
    dojo.create('span', { innerHTML:' 工数実績入力時に工数と勤務時間が合わなければ入力不可とする' }, label);

    dojo.create('hr', {style:"bordr:1px solid #eee;"}, optArea);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderTs1OptimizeOnBrowser' }, label);
    dojo.create('span', { innerHTML:' TS1勤務表モバイル専用画面をエミュレータやモバイルブラウザで作動させる' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    dojo.create('span', { innerHTML:'TS1勤務表モバイル専用化の境界幅 ' }, div);
    dojo.create('input', {
        type      : 'text',
        id        : 'dataReaderTs1OptimizeWidth',
        className : 'inputran',
        maxLength : 3,
        style : {
            width      : "30px",
            marginLeft : "10px",
            marginRight: "10px",
            textAlign  : "right",
            padding    : "1px 4px"
        }
    }, div);
    dojo.create('span', { innerHTML:'未満 (Null時のデフォルトは768)' }, div);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderHidePersonalInfo' }, label);
    dojo.create('span', { innerHTML:' 個人設定を非表示にする' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderUseJsNaviDummy' }, label);
    dojo.create('span', { innerHTML:" J'sNAVIダミーを使用する（本番環境では使用不可）" }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderAdjustLateTimeEarlyTime' }, label);
    dojo.create('span', { innerHTML:" 退社後または出社前に時間単位休や半休がある時、定時で所定勤務に達していれば遅刻・早退時間をカウントしない" }, label);

    dojo.create('hr', {style:"bordr:1px solid #eee;"}, optArea);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderUseExpPayPrint' }, label);
    dojo.create('span', { innerHTML:" 経費精算の消込画面に印刷ボタンを表示する" }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('span', { innerHTML:" 経費精算：電帳法オプションがオンの場合でも精算取消が可能な期間" }, label);
    dojo.create('input', {
        type      : 'date',
        id        : 'dataReaderExpCancelDeadline',
        className : 'inputran',
        maxLength : 3,
        style : {
            width      : "140px",
            marginLeft : "10px",
            marginRight: "10px",
            textAlign  : "right",
            padding    : "1px 4px"
        }
    }, div);
    dojo.create('span', { innerHTML:' 23:59まで' }, div);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderUseExpEntryData' }, label);
    dojo.create('span', { innerHTML:" 仕訳データCSV出力を使用する", style:'margin-right:30px;' }, label);
    dojo.create('span', { innerHTML:'Visualforceページ ' }, div);
    dojo.create('input', {
        type      : 'text',
        id        : 'dataReaderExpEntryDataUrl',
        className : 'inputran',
        maxLength : 255,
        style : {
            width      : "300px",
            marginLeft : "10px",
            marginRight: "10px",
            textAlign  : "left",
            padding    : "1px 4px"
        }
    }, div);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'overwriteStampEndTime' }, label);
    dojo.create('span', { innerHTML:' 勤怠連携バッチで反映されるデータで、退社打刻を常に上書きする' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderUseShiftChange' }, label);
    dojo.create('span', { innerHTML:' シフト振替申請を利用可能にする' }, label);
    dojo.create('span', { innerHTML:'（同月度同週内の勤務日/非勤務日のシフト設定を入れ替える。振替申請との併用不可）' ,style:'font-size:90%;' }, label);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderUse36AgreementCap' }, label);
    dojo.create('span', { innerHTML:' 36協定上限設定を勤務体系設定画面に表示する' }, label);

    dojo.create('hr', {style:"bordr:1px solid #eee;"}, optArea);

    div = dojo.create('div', { style: { margin:"4px 0px" } }, optArea);
    label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id:'dataReaderTestEnvironment' }, label);
    dojo.create('span', { innerHTML:' テスト環境である（テスト支援ツールでデータの削除・更新可）' }, label);

    //----------------------------------------------------------------
    div = dojo.create('div', { style: { margin:"12px 4px" } }, optArea);
    var inp = dojo.create('input', { type:'button', value:'保存', id:'dataReaderDataLocalKeySave', style: { padding:"1px 2px" } }, div);
    dojo.connect(inp, 'onclick', this, function(){
        dojo.byId('dataReaderDataLocalKeyResult').innerHTML = '';
        var localKey             = dojo.byId('dataReaderDataLocalKey').value;
        var yuqProvidePriorMonth = dojo.byId('dataReaderDataYuqProvidePriorMonth').value;
        var expCountLimit        = dojo.byId('dataReaderExpCountLimit').value;
        var enableShift          = dojo.byId('dataReaderEnableShift').checked;
        var enableShiftCsvImport = dojo.byId('dataReaderEnableShiftCsvImport').checked;
        var enableShiftImportToolDownload = dojo.byId('dataReaderEnableShiftImportToolDownload').checked;
        var useShiftValidationSetting = dojo.byId('dataReaderUseShiftValidationSetting').checked;
        var shiftImportToolCustomURL = dojo.byId('dataReaderShiftImportToolCustomURL').value;
        var enableAccessControlSystem = dojo.byId('dataReaderEnableAccessControlSystem').checked;
        var divergenceInnerCheck      = dojo.byId('dataReaderDivergenceInnerCheck').checked;
        var suppressDivergenceCheck   = dojo.byId('dataReaderSuppressDivergenceCheck').checked;
        var autoReJudgeDaysCheck      = dojo.byId('dataReaderAutoReJudgeDaysCheck').checked;
        var autoReJudgeDays           = dojo.byId('dataReaderAutoReJudgeDays').value;
        var timeReportDedicatedToJob = dojo.byId('dataReaderTimeReportDedicatedToJob').checked;
        var warningOnMAPHW       = dojo.byId('dataReaderWarningOnMAPHW').checked;
        var recalcTimeOnJobFix   = dojo.byId('dataReaderRecalcTimeOnJobFix').checked;
        var checkTimeOnJobFix    = dojo.byId('dataReaderCheckTimeOnJobFix').checked;
        var checkInputWorkHours  = dojo.byId('dataReaderCheckInputWorkHours').checked;
        var ts1OptimizeOnBrowser = dojo.byId('dataReaderTs1OptimizeOnBrowser').checked;
        var ts1OptimizeWidth     = dojo.byId('dataReaderTs1OptimizeWidth').value;
        var hidePersonalInfo     = dojo.byId('dataReaderHidePersonalInfo').checked;
        var useJsNaviDummy       = dojo.byId('dataReaderUseJsNaviDummy').checked;
        var adjustLateTimeEarlyTime = dojo.byId('dataReaderAdjustLateTimeEarlyTime').checked;
        var useExpPayPrint       = dojo.byId('dataReaderUseExpPayPrint').checked;
        var expCancelDeadline    = dojo.byId('dataReaderExpCancelDeadline').value;
        var useExpEntryData      = dojo.byId('dataReaderUseExpEntryData').checked;
        var expEntryDataUrl      = dojo.byId('dataReaderExpEntryDataUrl').value;
        var overwriteStampEndTime = dojo.byId('overwriteStampEndTime').checked;
        var useShiftChange        = dojo.byId('dataReaderUseShiftChange').checked;
        var use36AgreementCap     = dojo.byId('dataReaderUse36AgreementCap').checked;
        var testEnvironment       = dojo.byId('dataReaderTestEnvironment').checked;
        if(yuqProvidePriorMonth != ''){
            if(!/^\d+$/.test(yuqProvidePriorMonth)){
                teasp.tsAlert('有休を何か月前の勤怠確定時に付与するかの値は数値を入力してください');
                return;
            }
            yuqProvidePriorMonth = parseInt(yuqProvidePriorMonth, 10);
        }else{
            dojo.byId('dataReaderDataYuqProvidePriorMonth').value = '';
            yuqProvidePriorMonth = null;
        }
        if(expCountLimit){
            if(!/^\d+$/.test(expCountLimit)){
                teasp.tsAlert('経費精算で申請あたりの明細数の上限の値は数値を入力してください');
                return;
            }
            expCountLimit = parseInt(expCountLimit, 10);
        }else{
            expCountLimit = null;
        }
        if(autoReJudgeDaysCheck){
            if(!/^\d+$/.test(autoReJudgeDays)){
                dojo.byId('dataReaderAutoReJudgeDays').focus();
                teasp.tsAlert('入退館管理機能：再判定期間の値は数値を入力してください');
                return;
            }
            autoReJudgeDays = parseInt(autoReJudgeDays, 10);
        }else{
            autoReJudgeDays = null;
            dojo.byId('dataReaderAutoReJudgeDays').value = '';
        }
        var K_LocalKey             = teasp.prefixBar + 'LocalKey__c';
        var K_YuqProvidePriorMonth = teasp.prefixBar + 'YuqProvidePriorMonth__c';
        var K_ExpPreApplyConfig    = teasp.prefixBar + 'ExpPreApplyConfig__c';
        var K_Config               = teasp.prefixBar + 'Config__c';
        var K_UseAccessControlSystem = teasp.prefixBar + 'UseAccessControlSystem__c';
        var values = {};
        values[this.commonObj.Id] = {};
        values[this.commonObj.Id][K_LocalKey]             = localKey;
        values[this.commonObj.Id][K_YuqProvidePriorMonth] = yuqProvidePriorMonth;
        var typeMap = {};
        typeMap[K_LocalKey]             = 'STRING';
        typeMap[K_YuqProvidePriorMonth] = 'DOUBLE';
        typeMap[K_ExpPreApplyConfig]    = 'STRING';
        typeMap[K_Config]               = 'STRING';

        if(expCountLimit != this.getExpCountLimit()){
            if(!this.commonObj.ExpPreApplyConfig__c){
                this.commonObj.ExpPreApplyConfig__c = {};
            }
            if(expCountLimit != this.getExpCountLimit()){
                this.commonObj.ExpPreApplyConfig__c.expCountLimit = expCountLimit;
            }
            values[this.commonObj.Id][K_ExpPreApplyConfig] = dojo.toJson(this.commonObj.ExpPreApplyConfig__c);
        }
        if(ts1OptimizeWidth != ''){
            if(!/^\d+$/.test(ts1OptimizeWidth)){
                teasp.tsAlert('TS1勤務表モバイル化の作動境界幅の値は無効です');
                return;
            }
            ts1OptimizeWidth = parseInt(ts1OptimizeWidth, 10);
        }else{
            dojo.byId('dataReaderTs1OptimizeWidth').value = '';
            ts1OptimizeWidth = null;
        }
        if(enableShift != this.getEnableShift()
        || enableShiftCsvImport != this.getEnableShiftCsvImport()
        || enableShiftImportToolDownload != this.getEnableShiftImportToolDownload()
        || useShiftValidationSetting != this.getUseShiftValidationSetting()
        || shiftImportToolCustomURL != this.getShiftImportToolCustomURL()
        || timeReportDedicatedToJob != this.getTimeReportDedicatedToJob()
        || warningOnMAPHW != this.getWarningOnMAPHW()
        || recalcTimeOnJobFix != this.getRecalcTimeOnJobFix()
        || checkTimeOnJobFix != this.getCheckTimeOnJobFix()
        || checkInputWorkHours != this.getCheckInputWorkHours()
        || ts1OptimizeOnBrowser != this.getTs1OptimizeOnBrowser()
        || ts1OptimizeWidth != this.getTs1OptimizeWidth()
        || hidePersonalInfo != this.getHidePersonalInfo()
        || divergenceInnerCheck != this.getDivergenceInnerCheck()
        || suppressDivergenceCheck != this.getSuppressDivergenceCheck()
        || autoReJudgeDays != this.getAutoReJudgeDays()
        || useJsNaviDummy != this.getUseJsNaviDummy()
        || adjustLateTimeEarlyTime != this.getAdjustLateTimeEarlyTime()
        || useExpPayPrint != this.getUseExpPayPrint()
        || expCancelDeadline != this.getExpCancelDeadline()
        || useExpEntryData != this.getUseExpEntryData()
        || expEntryDataUrl != this.getExpEntryDataUrl()
        || overwriteStampEndTime != this.getOverwriteStampEndTime()
        || useShiftChange != this.getUseShiftChange()
        || use36AgreementCap != this.getUse36AgreementCap()
        || testEnvironment != this.getTestEnvironment()
        ){
            if(!this.commonObj.Config__c){
                this.commonObj.Config__c = {};
            }
            this.commonObj.Config__c.enableShiftManagement = enableShift;
            this.commonObj.Config__c.enableShiftCsvImport = enableShiftCsvImport;
            this.commonObj.Config__c.enableShiftImportToolDownload = enableShiftImportToolDownload;
            this.commonObj.Config__c.useShiftValidationSetting = useShiftValidationSetting;
            this.commonObj.Config__c.shiftImportToolCustomURL = shiftImportToolCustomURL;
            this.commonObj.Config__c.timeReportDedicatedToJob = timeReportDedicatedToJob;
            this.commonObj.Config__c.warningOnMAPHW = warningOnMAPHW;
            this.commonObj.Config__c.recalcTimeOnJobFix = recalcTimeOnJobFix;
            this.commonObj.Config__c.checkTimeOnJobFix = checkTimeOnJobFix;
            this.commonObj.Config__c.checkInputWorkHours = checkInputWorkHours;
            this.commonObj.Config__c.ts1OptimizeOnBrowser = ts1OptimizeOnBrowser;
            this.commonObj.Config__c.ts1OptimizeWidth = ts1OptimizeWidth;
            this.commonObj.Config__c.hidePersonalInfo = hidePersonalInfo;
            this.commonObj.Config__c.DivergenceInnerCheck = divergenceInnerCheck;
            this.commonObj.Config__c.SuppressDivergenceCheckOnFixedMonth = suppressDivergenceCheck;
            this.commonObj.Config__c.useJsNaviDummy = useJsNaviDummy;
            this.commonObj.Config__c.adjustLateTimeEarlyTime = adjustLateTimeEarlyTime;
            this.commonObj.Config__c.useExpPayPrint = useExpPayPrint;
            this.commonObj.Config__c.expCancelDeadline = expCancelDeadline;
            this.commonObj.Config__c.useExpEntryData = useExpEntryData;
            this.commonObj.Config__c.expEntryDataUrl = expEntryDataUrl;
            this.commonObj.Config__c.overwriteStampEndTime = overwriteStampEndTime;
            this.commonObj.Config__c.useShiftChange = useShiftChange;
            this.commonObj.Config__c.use36AgreementCap = use36AgreementCap;
            this.commonObj.Config__c.testEnvironment = testEnvironment;
            if(autoReJudgeDays === null){
                if(this.commonObj.Config__c.AutoReJudgeDays !== undefined){
                    delete this.commonObj.Config__c.AutoReJudgeDays;
                }
            }else{
                this.commonObj.Config__c.AutoReJudgeDays = autoReJudgeDays;
            }
            values[this.commonObj.Id][K_Config] = dojo.toJson(this.commonObj.Config__c);
        }
        if(enableAccessControlSystem != this.getEnableAccessControlSystem()){
            typeMap[K_UseAccessControlSystem] = 'BOOLEAN';
            values[this.commonObj.Id][K_UseAccessControlSystem] = enableAccessControlSystem;
        }

        var idList = [];
        idList.push(this.commonObj.Id);
        this.contact(
            {
                funcName : 'getExtResult',
                params   : {
                    action  : 'updateSObject',
                    objName : teasp.prefixBar + 'AtkCommon__c',
                    idList  : idList,
                    values  : values,
                    typeMap : typeMap
                }
            },
            dojo.hitch(this, function(res){
                this.commonObj.LocalKey__c             = localKey;
                this.commonObj.YuqProvidePriorMonth__c = yuqProvidePriorMonth;
                dojo.byId('dataReaderDataLocalKeyResult').innerHTML = '保存しました';
            }),
            function(result){
                teasp.message.alertError(result);
            },
            true
        );
    });
    div = dojo.create('div', { style: { margin:"12px 4px" } }, optArea);
    dojo.create('div', { id:'dataReaderDataLocalKeyResult' }, div);

    this.localKeyOpts = [
      { id:'dataReaderDataLocalKeyOpt1', pos: 0, value:'132DBE4' }
    , { id:'dataReaderDataLocalKeyOpt2', pos: 7, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt3', pos: 8, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt4', pos: 9, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt5', pos:10, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt6', pos:11, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt7', pos:12, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt8', pos:13, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt10',pos:15, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt11',pos:16, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt12',pos:17, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt13',pos:18, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt14',pos:19, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt15',pos:20, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt16',pos:21, value:'1' }
    , { id:'dataReaderDataLocalKeyOpt17',pos:22, value:'1' }
    ];
    var las = this.localKeyOpts[this.localKeyOpts.length - 1];
    var keyLen = las.pos + las.value.length;
    this.offLocalKey = '';
    for(var i = 0 ; i < keyLen ; i++){
        this.offLocalKey += '0';
    }
    for(var i = 0 ; i < this.localKeyOpts.length ; i++){
        var o = this.localKeyOpts[i];
        dojo.connect(dojo.byId(o.id), 'onclick', this, function(_o){
            return function(){
                var v = (dojo.byId('dataReaderDataLocalKey').value
                        + this.offLocalKey).substring(0, this.offLocalKey.length);
                dojo.byId('dataReaderDataLocalKey').value
                    = v.substring(0, _o.pos)
                    + (dojo.byId(_o.id).checked ? _o.value : this.offLocalKey.substring(0, _o.value.length))
                    + v.substring(_o.pos + _o.value.length);
            };
        }(o));
    }
};

teasp.view.DataReader.prototype.setLocalKey = function(){
    var lkey = (this.commonObj ? (this.commonObj.LocalKey__c || '')     : '');
    var yppm = (this.commonObj ? this.commonObj.YuqProvidePriorMonth__c : '');
    var v = (lkey + this.offLocalKey).substring(0, this.offLocalKey.length);
    for(var i = 0 ; i < this.localKeyOpts.length ; i++){
        var o = this.localKeyOpts[i];
        dojo.byId(o.id).checked = (v.substring(o.pos, o.pos + o.value.length) == o.value);
    }
    var epac = (this.commonObj && this.commonObj.ExpPreApplyConfig__c) || null;
    if(epac){
        this.commonObj.ExpPreApplyConfig__c = dojo.fromJson(epac);
    }
    var conf = (this.commonObj && this.commonObj.Config__c) || null;
    if(conf){
        this.commonObj.Config__c = dojo.fromJson(conf);
    }
    var expCountLimit = this.getExpCountLimit() || 100;
    var autoReJudgeDays = this.getAutoReJudgeDays();
    dojo.byId('dataReaderDataLocalKey').value             = v;
    dojo.byId('dataReaderDataYuqProvidePriorMonth').value = (typeof(yppm) == 'number' ? yppm : '');
    dojo.byId('dataReaderExpCountLimit').value            = '' + expCountLimit;
    dojo.byId('dataReaderEnableShift').checked            = this.getEnableShift();
    dojo.byId('dataReaderEnableShiftCsvImport').checked   = this.getEnableShiftCsvImport();
    dojo.byId('dataReaderEnableShiftImportToolDownload').checked   = this.getEnableShiftImportToolDownload();
    dojo.byId('dataReaderUseShiftValidationSetting').checked   = this.getUseShiftValidationSetting();
    dojo.byId('dataReaderShiftImportToolCustomURL').value   = this.getShiftImportToolCustomURL();
    dojo.byId('dataReaderEnableAccessControlSystem').checked = this.getEnableAccessControlSystem();
    dojo.byId('dataReaderTimeReportDedicatedToJob').checked = this.getTimeReportDedicatedToJob();
    dojo.byId('dataReaderWarningOnMAPHW').checked         = this.getWarningOnMAPHW();
    dojo.byId('dataReaderRecalcTimeOnJobFix').checked     = this.getRecalcTimeOnJobFix();
    dojo.byId('dataReaderCheckTimeOnJobFix').checked      = this.getCheckTimeOnJobFix();
    dojo.byId('dataReaderCheckInputWorkHours').checked    = this.getCheckInputWorkHours();
    dojo.byId('dataReaderTs1OptimizeOnBrowser').checked   = this.getTs1OptimizeOnBrowser();
    dojo.byId('dataReaderTs1OptimizeWidth').value         = this.getTs1OptimizeWidth();
    dojo.byId('dataReaderHidePersonalInfo').checked       = this.getHidePersonalInfo();
    dojo.byId('dataReaderDivergenceInnerCheck').checked   = this.getDivergenceInnerCheck();
    dojo.byId('dataReaderSuppressDivergenceCheck').checked = this.getSuppressDivergenceCheck();
    dojo.byId('dataReaderUseJsNaviDummy').checked         = this.getUseJsNaviDummy();
    dojo.byId('dataReaderAdjustLateTimeEarlyTime').checked = this.getAdjustLateTimeEarlyTime();
    dojo.byId('dataReaderAutoReJudgeDaysCheck').checked   = (autoReJudgeDays === null ? false : true);
    dojo.byId('dataReaderAutoReJudgeDays').value          = (autoReJudgeDays === null ? '' : autoReJudgeDays);
    dojo.byId('dataReaderUseExpPayPrint').checked         = this.getUseExpPayPrint();
    dojo.byId('dataReaderExpCancelDeadline').value        = this.getExpCancelDeadline();
    dojo.byId('dataReaderUseExpEntryData').checked        = this.getUseExpEntryData();
    dojo.byId('dataReaderExpEntryDataUrl').value          = this.getExpEntryDataUrl();
    dojo.byId('overwriteStampEndTime').checked            = this.getOverwriteStampEndTime();
    dojo.byId('dataReaderUseShiftChange').checked         = this.getUseShiftChange();
    dojo.byId('dataReaderUse36AgreementCap').checked      = this.getUse36AgreementCap();
    dojo.byId('dataReaderTestEnvironment').checked        = this.getTestEnvironment();
};

teasp.view.DataReader.prototype.getExpCountLimit = function(){
    return (this.commonObj && this.commonObj.ExpPreApplyConfig__c && this.commonObj.ExpPreApplyConfig__c.expCountLimit) || null;
};

teasp.view.DataReader.prototype.getEnableShift = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.enableShiftManagement) || false;
};

teasp.view.DataReader.prototype.getEnableShiftCsvImport = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.enableShiftCsvImport) || false;
};

teasp.view.DataReader.prototype.getEnableShiftImportToolDownload = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.enableShiftImportToolDownload) || false;
};

// シフトバリデーションを設定する
teasp.view.DataReader.prototype.getUseShiftValidationSetting = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.useShiftValidationSetting) || false;
};

teasp.view.DataReader.prototype.getShiftImportToolCustomURL = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.shiftImportToolCustomURL) || '';
};

teasp.view.DataReader.prototype.getEnableAccessControlSystem = function(){
    return (this.commonObj && this.commonObj.UseAccessControlSystem__c) || false;
};

teasp.view.DataReader.prototype.getTimeReportDedicatedToJob = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.timeReportDedicatedToJob) || false;
};

teasp.view.DataReader.prototype.getWarningOnMAPHW = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.warningOnMAPHW) || false;
};

teasp.view.DataReader.prototype.getRecalcTimeOnJobFix = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.recalcTimeOnJobFix) || false;
};

teasp.view.DataReader.prototype.getCheckTimeOnJobFix = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.checkTimeOnJobFix) || false;
};

teasp.view.DataReader.prototype.getCheckInputWorkHours = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.checkInputWorkHours) || false;
};

teasp.view.DataReader.prototype.getTs1OptimizeOnBrowser = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.ts1OptimizeOnBrowser) || false;
};

teasp.view.DataReader.prototype.getTs1OptimizeWidth = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.ts1OptimizeWidth) || null;
};

teasp.view.DataReader.prototype.getOverwriteStampEndTime = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.overwriteStampEndTime) || null;
};

teasp.view.DataReader.prototype.getTestEnvironment = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.testEnvironment) || false;
};

teasp.view.DataReader.prototype.onActiveTsAreaM = function(){
    if(!this.commonObj){
        var so = this.getSObjectByKey(this.nameMap[(teasp.prefixBar + 'atkcommon__c').toLowerCase()]);
        var searchParam = {
            soql     : 'select Id, LocalKey__c, YuqProvidePriorMonth__c, ExpPreApplyConfig__c, Config__c, UseAccessControlSystem__c from AtkCommon__c',
            cntAll   : 1,
            rowMax   : 1,
            pageNo   : 1,
            callback : dojo.hitch(this, function(_so, _records){
                if(_records.length > 0){
                    this.commonObj = _records[0];
                }
                this.setLocalKey();
            })
        };
        this.search2(so, searchParam, false);
    }
};

teasp.view.DataReader.prototype.getHidePersonalInfo = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.hidePersonalInfo) || false;
};

teasp.view.DataReader.prototype.getDivergenceInnerCheck = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.DivergenceInnerCheck) || false;
};

teasp.view.DataReader.prototype.getSuppressDivergenceCheck = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.SuppressDivergenceCheckOnFixedMonth) || false;
};

teasp.view.DataReader.prototype.getAutoReJudgeDays = function(){
    var n = (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.AutoReJudgeDays);
    return (typeof(n) == 'number' ? n : null);
};

teasp.view.DataReader.prototype.getUseJsNaviDummy = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.useJsNaviDummy) || false;
};

teasp.view.DataReader.prototype.getAdjustLateTimeEarlyTime = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.adjustLateTimeEarlyTime) || false;
};

teasp.view.DataReader.prototype.getUseExpPayPrint = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.useExpPayPrint) || false;
};
teasp.view.DataReader.prototype.getExpCancelDeadline = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.expCancelDeadline) || '';
};
teasp.view.DataReader.prototype.getUseExpEntryData = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.useExpEntryData) || false;
};
teasp.view.DataReader.prototype.getExpEntryDataUrl = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.expEntryDataUrl) || '';
};
teasp.view.DataReader.prototype.getUseShiftChange = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.useShiftChange) || false;
};
teasp.view.DataReader.prototype.getUse36AgreementCap = function(){
    return (this.commonObj && this.commonObj.Config__c && this.commonObj.Config__c.use36AgreementCap) || false;
};

/**
 * フィールド定義情報一括ダウンロードエリア作成
 *
 */
teasp.view.DataReader.prototype.createDownloadPanel = function(){
    return '<div id="dataReaderDLArea">'
    + '  <div style="padding:4px;">'
    + '    <div style="float:left;padding-top:2px;padding-right:8px;">API参照名</div>'
    + '    <div style="float:left;"><input type="text" id="dataReaderDLName" style="width:260px;" /></div>'
    + '    <div style="clear:both;"></div>'
    + '    <div style="float:left;margin-left:70px;"><label><input type="radio" name="dataReaderDLNameOpt" id="dataReaderDLNameOpt1" checked="checked" /><span> 前方一致</span></label></div>'
    + '    <div style="float:left;"                 ><label><input type="radio" name="dataReaderDLNameOpt" id="dataReaderDLNameOpt2"                   /><span> 完全一致</span></label></div>'
    + '    <div style="clear:both;"></div>'
    + '    <div style="margin-left:70px;font-size:90%;">（カンマ区切りで複数指定可）</div>'
    + '  </div>'
    + '  <div><label><input type="checkbox" id="dataReaderDLCustomObjectOnly"   checked="checked" /><span> カスタムオブジェクトのみ                      </span></label></div>'
    + '  <div><label><input type="checkbox" id="dataReaderDLExcludeRemoveObject"                  /><span> ラベル名に「削除予定」を含むオブジェクトを除く</span></label></div>'
    + '  <div><label><input type="checkbox" id="dataReaderDLExcludeFeedObject"  checked="checked" /><span> フィードオブジェクトを除く                    </span></label></div>'
    + '  <table>'
    + '  <tr><td colSpan="2" style="border-top:1px dashed #e0e0e0;"></td></tr>'
    + '  <tr><td>フィールド定義'
    + '  </td><td>'
    + '  <div><label><input type="checkbox" id="dataReaderDLCustomFieldOnly"                      /><span> カスタム項目のみ                              </span></label></div>'
    + '  <div><label><input type="checkbox" id="dataReaderDLExcludeRemoveField"                   /><span> ラベル名に「削除予定」を含む項目を除く        </span></label></div>'
    + '  <div><label><input type="checkbox" id="dataReaderDLExcludeCalcField"                     /><span> 数式項目を除く                                </span></label></div>'
    + '  <div><label><input type="checkbox" id="dataReaderDLCutPickList"                          /><span> 選択リスト値の出力は最大100件                 </span></label></div>'
    + '  <div><label><input type="checkbox" id="dataReaderDLLastReferencedDate"                   /><span> 「最終参照日」を含める                        </span></label></div>'
    + '  </td></tr>'
    + '  <tr><td colSpan="2" style="border-top:1px dashed #e0e0e0;"></td></tr>'
    + '  <tr><td colSpan="2">'
    + '    <div><label><input type="checkbox" id="dataReaderDLUseLocalNameField"  checked="checked" /><span> localName で出力                            </span></label></div>'
    + '  </td></tr>'
    + '  <tr><td colSpan="2" style="border-top:1px dashed #e0e0e0;"></td></tr>'
    + '  <tr><td colSpan="2">'
    + '    <div><label><input type="checkbox" id="dataReaderDLDataDownload"                       /><span> データを含める                                </span></label></div>'
    + '  </td></tr>'
    + '  <tr><td colSpan="2">'
    + '    <div style="padding-left:10px;font-size:90%;">'
    + '      <span style="margin-right:20px;">where</span>'
    + '      <input type="text" id="dataReaderDLDataWhere" style="width:260px;font-size:90%;" disabled="disabled" />'
    + '  </div>'
    + '  </td></tr>'
    + '  <tr><td colSpan="2">'
    + '    <div style="padding-left:10px;">'
    + '      <label><input type="checkbox" id="dataReaderDLDataAllRows" disabled="disabled" /><span style="font-size:90%;"> ゴミ箱のレコードも含める</span></label>'
    + '    </div>'
    + '  </td></tr>'
    + '  <tr><td colSpan="2" style="font-size:90%;">※データを含める場合はZIP、それ以外はフィールド定義情報のみ<br/>CSVをダウンロードします。</td></tr>'
    + '  </table>'
    + '  <div>'
    + '    <input type="button" value="ダウンロード" id="dataReaderDLGo"     style="margin:12px;" />'
    + '    <input type="button" value="閉じる"       id="dataReaderDLCancel" style="margin:12px;" />'
    + '  </div>'
    + '  <div id="dataReaderDLProgress" style="padding:0px 8px 4px 8px;display:none;"></div>'
    + '  <div id="dataReaderDLDataDone" style="padding:4px;display:none;position:relative;font-size:90%;color:#9C1717;">'
    + '    <div></div><div style="position:absolute;top:0px;right:16px;"><input type="button" value="OK" /></div>'
    + '  </div>'
    + '  <a id="dataReaderDLUrl" />'
    + '</div>';
};

/**
 * オブジェクト選択リストで選択時の動作
 *
 */
teasp.view.DataReader.prototype.changeSelect = function(key){
    var so = this.getSObjectByKey(key);
    if(!so.fieldList){
        // オブジェクト情報を取得
        this.switchBusy(true);
        this.contact(
            {
                funcName: 'getExtResult',
                params  : {
                    action : 'SObject',
                    key : key
                }
            },
            function(res, _so){
                this.scanRefer(res, _so, dojo.hitch(this, this.createInfo));
            },
            null,
            true
        );
    }else{
        this.scanRefer(null, so, dojo.hitch(this, this.createInfo));
    }
};

teasp.view.DataReader.prototype.scanRefer = function(res, _so, callback){
    var so = _so;
    if(!so){
        console.log(res);
        // 選択されたオブジェクトをメンバ変数にセット
        so = this.setObjectInfo(this.getSObjectByKey(res.key), res);
    }

    var flst = so.fieldList;
    var m = {};
    for(var i = 0 ; i < flst.length ; i++){
        var o = flst[i];
        var refs = (o.referenceTo || []);
        for(var j = 0 ; j < refs.length ; j++){
            var k = this.getSObjectKeyByName(refs[j]);
            if(k){
                m[k] = 1;
            }
        }
    }
    var l = [];
    for(var key in m){
        var o = this.getSObjectByKey(key);
        if(o && !o.fieldList){
            l.push(o);
        }
    }
    if(l.length > 0){
        if(_so){
            this.switchBusy(true);
        }
        var index = 0;
        innerSearch = dojo.hitch(this, function(){
            this.contact(
                {
                    funcName: 'getExtResult',
                    params  : {
                        action : 'SObject',
                        key : l[index++].key
                    }
                },
                function(result){
                    this.setObjectInfo(this.getSObjectByKey(result.key), result);
                    if(index < l.length){
                        setTimeout(innerSearch, 100);
                    }else{
                        callback(so);
                        this.switchBusy(false);
                    }
                },
                function(result){
                    this.switchBusy(false);
                },
                true
            );
        });
        innerSearch();
    }else{
        if(callback){
            callback(so);
        }
        this.switchBusy(false);
    }
};

teasp.view.DataReader.prototype.addHandle = function(level, handle){
	if(level & this.L1){
		this.handlesL1.push(handle);
	}
	if(level & this.L2){
		this.hendlesL2.push(handle);
	}
	if(level & this.L3){
		this.handlesL3.push(handle);
	}
};
teasp.view.DataReader.prototype.clearHandle = function(level){
	if(level & this.L1){
		for(var i = 0 ; i < this.handlesL1.length ; i++){
			dojo.disconnect(this.handlesL1[i]);
		}
		this.handlesL1 = [];
	}
	if(level & this.L2){
		for(var i = 0 ; i < this.hendlesL2.length ; i++){
			dojo.disconnect(this.hendlesL2[i]);
		}
		this.hendlesL2 = [];
	}
	if(level & this.L3){
		for(var i = 0 ; i < this.handlesL3.length ; i++){
			dojo.disconnect(this.handlesL3[i]);
		}
		this.handlesL3 = [];
	}
};

/**
 * オブジェクトの情報を表示
 *
 */
teasp.view.DataReader.prototype.createInfo = function(so){
    this.clearHandle(this.L1|this.L2|this.L3);
    var dyna = dojo.byId('dataReaderDyna');
    dojo.empty(dyna);
    // オブジェクト属性情報
    var idiv = dojo.create('div', {
        id       : 'dataReaderAttrArea',
        style    : { marginTop:"10px", display:(dojo.byId('dataReaderAttrToggle').checked ? "table" : "none") }
    }, dyna);
    // 出力する項目名と順番
    var cols = [
         'name'
       , 'localName'
       , 'label'
       , 'labelPlural'
       , 'keyPrefix'
       , 'isAccessible'
       , 'isCreateable'
       , 'isCustom'
       , 'isCustomSetting'
       , 'isDeletable'
       , 'isDeprecatedAndHidden'
       , 'isFeedEnabled'
       , 'isMergeable'
       , 'isQueryable'
       , 'isSearchable'
       , 'isUndeletable'
       , 'isUpdateable'
    ];

    // オブジェクトの属性情報を表示
    dojo.create('div', {
        innerHTML : 'Attribute',
        style     : { marginTop:"4px", fontWeight:"bold" }
    }, idiv);
    for(var i = 0 ; i < cols.length ; i++){
        var c = cols[i];
        var cd = dojo.create('div', { style: { "float":"left" } }, idiv);
        dojo.create('div', { innerHTML: c + ':', style: { "float":"left", marginRight:"2px" }  }, cd);
        dojo.create('div', { innerHTML: so[c], style: { "float":"left", marginRight:"10px" } }, cd);
        dojo.create('div', { style: { clear:"both" } }, cd);
    }
    dojo.create('div', { style: { clear:"both" } }, idiv);

    // フィールド定義表示エリアを作成
    idiv = dojo.create('div', {
        id        : 'dataReaderFieldArea',
        style     : { marginTop:"4px", display:(dojo.byId('dataReaderFieldToggle').checked ? "table" : "none") }
    }, dyna);
    this.createFieldTable(so, idiv);

    // 関連情報表示エリアを作成
    idiv = dojo.create('div', {
        id        : 'dataReaderRelationArea',
        style     : { marginTop:"4px", display:(dojo.byId('dataReaderRelationToggle').checked ? "table" : "none") }
    }, dyna);
    this.createRelationTable(so, idiv);

    // 補助情報表示エリアを作成
    idiv = dojo.create('div', {
        id        : 'dataReaderRecordArea',
        style     : { width:"100%", display:"table" }
    }, dyna);
    this.createRecordTable(so, idiv);
};

/**
 * フィールド定義リストを作成
 *
 * @param {Object} so
 * @param {string} area
 */
teasp.view.DataReader.prototype.createFieldTable = function(so, area){
    dojo.create('div', { innerHTML: 'Fields', style: { fontWeight:"bold" } }, area);

    var label = dojo.create('label', { style: { marginLeft:"20px" } }, dojo.create('div', { style: { "float":"left" } }, area));
    var chkbox = dojo.create('input', { type: 'checkbox', id: 'dataReaderFieldCalc' }, label); // 計算式を含めるかどうかのチェックボックス
    chkbox.checked = true;
    dojo.create('span', { innerHTML: ' 数式項目を含む' }, label);
    this.addHandle(this.L1, dojo.connect(chkbox, 'onclick', this, function(){
        this.buildFieldTable(so, dojo.byId('dataReaderFieldTbody'));
    }));

    label = dojo.create('label', { style: { marginLeft:"20px" } }, dojo.create('div', { style: { "float":"left" } }, area));
    chkbox = dojo.create('input', { type: 'checkbox', id: 'dataReaderFieldColor' }, label); // 参照項目を目立たせる
    dojo.create('span', { innerHTML: ' 参照項目を目立たせる' }, label);
	this.addHandle(this.L1, dojo.connect(chkbox, 'onclick', this, function(){
        this.buildFieldTable(so, dojo.byId('dataReaderFieldTbody'));
    }));
    dojo.create('div', { style: { clear:"both" } }, area);
    // フィールド定義リスト作成
    var tbody = dojo.create('tbody', { id: 'dataReaderFieldTbody' }, dojo.create('table', { className: 'defview', style: { marginTop:"4px" } }, area));
    this.buildFieldTable(so, tbody);
};

/**
 * フィールド定義リストを作成
 *
 * @param {Object} so
 * @param {Object} tbody
 */
teasp.view.DataReader.prototype.buildFieldTable = function(so, tbody){
    var l = so.fieldList;
    var calculated = dojo.byId('dataReaderFieldCalc').checked;
    var colorRefer = dojo.byId('dataReaderFieldColor').checked;
    dojo.empty(tbody);
    var row = dojo.create('tr', null, tbody);
    dojo.create('div', { innerHTML: 'name'              }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'label'             }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'type'              }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'referenceTo'       }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'picklist'          }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'length'            }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'precision'         }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'scale'             }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'calculatedFormula' }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'inlineHelpText'    }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'defaultValue'      }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'isAutoNumber'      }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'isCalculated'      }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'isCustom'          }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'isIdLookup'        }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'isNillable'        }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'isUnique'          }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'isAccessible'      }, dojo.create('th', null, row));
    for(var i = 0 ; i < l.length ; i++){
        var f = l[i];
        if(!calculated && f.isCalculated){
            continue;
        }
        row = dojo.create('tr', { className: ((i%2)==0 ? 'even' : 'odd') }, tbody);
        if(f.typeName == 'REFERENCE' && colorRefer){
            if(this.isReadOnlyField(f) || f.name == 'OwnerId'){
                row.style.backgroundColor = '#CFFEFF';
            }else if(!f.isNillable){
                row.style.backgroundColor = '#FFCDA9';
            }else{
                row.style.backgroundColor = '#FFE0C9';
            }
        }
        dojo.create('div', { innerHTML: f.name         }, dojo.create('td', { className: 'left'   }, row));
        dojo.create('div', { innerHTML: f.label        }, dojo.create('td', { className: 'left'   }, row));
        var cell = dojo.create('td', { className: 'left'   }, row);
        dojo.create('div', { innerHTML: f.typeName     }, cell);
        cell.title = (f.relationshipName || '');
        dojo.create('div', { innerHTML: (f.referenceTo && f.referenceTo.length > 0 ? f.referenceTo.join(',') : ''), style: { wordBreak:"break-all" } }, dojo.create('td', { className: 'left'   }, row));
        dojo.create('div', { innerHTML: this.getPickLabels(f.picklistValues, '<br/>') }, dojo.create('td', { className: 'left', style: { width:"100px" } }, row));
        dojo.create('div', { innerHTML: f.length       }, dojo.create('td', { className: 'right'  }, row));
        dojo.create('div', { innerHTML: f.precision    }, dojo.create('td', { className: 'right'  }, row));
        dojo.create('div', { innerHTML: f.scale        }, dojo.create('td', { className: 'right'  }, row));
        var d = dojo.create('div', { style: { wordBreak:"break-all" } }, dojo.create('td', { className: 'left', style: { width:"200px" } }, row));
        d.textContent = (f.calculatedFormula || '');
        d = dojo.create('div', { style: { wordBreak:"break-all" } }, dojo.create('td', { className: 'left', style: { width:"200px" } }, row));
        d.textContent = (f.inlineHelpText || '');
        dojo.create('div', { innerHTML: (f.defaultValueFormula || '') }, dojo.create('td', { className: 'left' }, row));
        dojo.create('div', { innerHTML: (f.isAutoNumber ? '○' : '') }, dojo.create('td', { className: 'center' }, row));
        dojo.create('div', { innerHTML: (f.isCalculated ? '○' : '') }, dojo.create('td', { className: 'center' }, row));
        dojo.create('div', { innerHTML: (f.isCustom     ? '○' : '') }, dojo.create('td', { className: 'center' }, row));
        dojo.create('div', { innerHTML: (f.isIdLookup   ? '○' : '') }, dojo.create('td', { className: 'center' }, row));
        dojo.create('div', { innerHTML: (f.isNillable   ? '○' : '') }, dojo.create('td', { className: 'center' }, row));
        dojo.create('div', { innerHTML: (f.isUnique     ? '○' : '') }, dojo.create('td', { className: 'center' }, row));
        dojo.create('div', { innerHTML: (f.isAccessible ? '○' : '') }, dojo.create('td', { className: 'center' }, row));
    }
};

/**
 * 関連テーブルを作成
 *
 * @param {Object} so
 * @param {Object} area
 */
teasp.view.DataReader.prototype.createRelationTable = function(so, area){
    dojo.create('div', { innerHTML: 'RelationShip', style: { fontWeight:"bold" } }, area);

    var tbody = dojo.create('tbody', { id: 'dataReaderRelationTbody' }, dojo.create('table', { className: 'defview', style: { marginTop:"4px" } }, area));
    // 関連テーブル作成
    this.buildRelationTable(so, tbody);
};

/**
 * 関連テーブルを作成
 *
 * @param {Object} so
 * @param {Object} tbody
 */
teasp.view.DataReader.prototype.buildRelationTable = function(so, tbody){
    var l = so.childRelationships;
    dojo.empty(tbody);
    var row = dojo.create('tr', null, tbody);
    dojo.create('div', { innerHTML: 'objectName'            }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'fieldName'             }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'relationshipName'      }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'isCascadeDelete'       }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'isDeprecatedAndHidden' }, dojo.create('th', null, row));
    dojo.create('div', { innerHTML: 'isRestrictedDelete'    }, dojo.create('th', null, row));
    for(var i = 0 ; i < l.length ; i++){
        var o = l[i];
        row = dojo.create('tr', { className: ((i%2)==0 ? 'even' : 'odd') }, tbody);
        dojo.create('div', { innerHTML: o.objectName               }, dojo.create('td', { className: 'left'   }, row));
        dojo.create('div', { innerHTML: o.fieldName                }, dojo.create('td', { className: 'left'   }, row));
        dojo.create('div', { innerHTML: (o.relationshipName || '') }, dojo.create('td', { className: 'left'   }, row));
        dojo.create('div', { innerHTML: (o.isCascadeDelete       ? '○' : '') }, dojo.create('td', { className: 'center' }, row));
        dojo.create('div', { innerHTML: (o.isDeprecatedAndHidden ? '○' : '') }, dojo.create('td', { className: 'center' }, row));
        dojo.create('div', { innerHTML: (o.isRestrictedDelete    ? '○' : '') }, dojo.create('td', { className: 'center' }, row));
    }
};

/**
 * データ表示エリアを作成
 *
 * @param {Object} so
 * @param {Object} area
 */
teasp.view.DataReader.prototype.createRecordTable = function(so, area){
    // SOQL
    var div = dojo.create('div', {
        id        : 'dataReaderRecordTextArea',
        style     : { display:"none" }
    }, area);
    dojo.create('div', { innerHTML: 'SOQL', style: { fontWeight:"bold" } }, div);
    var textArea = dojo.create('textarea', {
        id        : 'dataReaderRecordSoql',
        style     : { marginTop:"2px", marginLeft:"10px", width:"200px", height:"200px" },
        readOnly  : 'readOnly'
    }, div);
    textArea.value = this.getSoql(so, true);

    var tbody = dojo.create('tbody', {
        id        : 'dataReaderRecordTbody'
    }, dojo.create('table', {
        style     : { marginTop:"4px", marginLeft:"10px" }
    }, area));
    // 条件入力エリア作成
    this.buildRecordTable(so, tbody);

    // 検索結果表示エリア
    dojo.create('div', {
        id        : 'dataReaderValueArea',
        style     : { marginTop:"2px", marginLeft:"10px" }
    }, area);

    // Script for Developer Console
    div = dojo.create('div', { id: 'dataReaderScriptArea', style: { display:"none" } }, area);
    dojo.create('div', {
        innerHTML : 'Script for Developer Console',
        style     : { fontWeight:"bold" }
    }, div);
    textArea = dojo.create('textarea', {
        style     : { marginTop:"2px", marginLeft:"10px", width:"600px", height:"200px" },
        readOnly  : 'readOnly'
    }, div);

    var l = so.fieldList;
    var fv = [];
    var buf = 'System.debug(LoggingLevel.WARN, \'"';
    for(var i = 0 ; i < l.length ; i++){
        var o = l[i];
        fv.push(o.name);
        if(o.relationshipName){
            fv.push(o.relationshipName + '.Name');
        }
    }
    buf += fv.join('\'\n+ \'","');
    buf += '"\');\n';
    buf += 'for(' + so.name
        + ' a : ['
        + this.getSoql(so, true)
        + ']){\n'
        + 'System.debug(LoggingLevel.WARN, \'"\' + ';
    fv = [];
    for(var i = 0 ; i < l.length ; i++){
        var o = l[i];
        if(o.typeName == 'DATE' || o.typeName == 'DATETIME'){
            fv.push('String.valueOf(a.' + o.name + ')');
        }else if(o.typeName == 'STRING' || o.typeName == 'TEXTAREA'){
            fv.push('(a.' + o.name + ' != null ? a.' + o.name + '.replaceAll(\'"\', \'""\').replaceAll(\'\\r\\n\', \'\').replaceAll(\'\\r\', \'\').replaceAll(\'\\n\', \'\') : \'\')');
        }else{
            fv.push('a.' + o.name);
        }
        if(o.relationshipName){
            fv.push('a.' + o.relationshipName + '.Name');
        }
    }
    buf += fv.join('\n+ \'","\' + ');
    buf += '\n+ \'"\');\n}';
    textArea.value = buf;
};

/**
 * データ表示テーブルを作成
 *
 * @param {Object} so
 * @param {Object} tbody
 */
teasp.view.DataReader.prototype.buildRecordTable = function(so, tbody){
    var row = dojo.create('tr', null, tbody);
    dojo.create('div', { innerHTML: 'where' }, dojo.create('td', null, row));
    var cell = dojo.create('td', null, row);
    dojo.create('input', { type: 'text', style: { width:"800px" }, id: 'dataReaderWhere' }, cell);

    row = dojo.create('tr', null, tbody);
    dojo.create('div', { innerHTML: 'order by' }, dojo.create('td', null, row));
    cell = dojo.create('td', null, row);
    dojo.create('input', { type: 'text', style: { width:"800px" }, id: 'dataReaderSortKey' }, cell);

    row = dojo.create('tr', null, tbody);
    var label = dojo.create('label', null, dojo.create('td', { colSpan: 2 }, row));
    dojo.create('input', { type: 'checkbox', id: 'dataReaderAllRows' }, label);
    dojo.create('span', { innerHTML: ' ゴミ箱のレコードも含める' }, label);

    row = dojo.create('tr', null, tbody);
    cell = dojo.create('td', { colSpan: 2 }, row);
    var sect1 = dojo.create('div', { style: { padding:"4px", display:"table-cell" } }, cell);
    var btn1 = dojo.create('input', { type: 'button', value: '検索'  , style: { padding:"1px 4px", marginRight:"10px" }, id: 'dataReaderSearch' }, sect1);
    this.addHandle(this.L1, dojo.connect(btn1, 'onclick', this, function(){
        var soql = dojo.byId('dataReaderRecordSoql').value;
        soql = soql.replace(/\n/g, '');
        var where = dojo.byId('dataReaderWhere').value.trim();
        if(where){
            where = ' where ' + where;
        }
        var orderBy = dojo.byId('dataReaderSortKey').value.trim();
        if(orderBy){
            orderBy = ' order by ' + orderBy;
        }
        var allRows = dojo.byId('dataReaderAllRows').checked;
        this.search(so, { soql: soql, where: where, orderBy: orderBy, allRows: allRows }, this.showSearchResult);
    }));
    var btn2 = dojo.create('input', { type: 'button', value: 'ダウンロード', style: { padding:"1px 4px", marginLeft:'20px' }, id: 'dataReaderDownload' }, sect1);
    this.addHandle(this.L1, dojo.connect(btn2, 'onclick', this, function(){
        var soql = dojo.byId('dataReaderRecordSoql').value;
        soql = soql.replace(/\n/g, '');
        var where = dojo.byId('dataReaderWhere').value.trim();
        if(where){
            soql += ' where (' + where + ')';
        }
        var allRows = dojo.byId('dataReaderAllRows').checked;
        this.fetch(so, soql, allRows, true, dojo.hitch(this, this.buildValueTable));
    }));

    // 検索できないオブジェクトの場合、検索ボタンとダウンロードボタンを非活性にする
    var unableSearch = this.isUnableSearchObject(so.key);
    dojo.attr(btn1, 'disabled', unableSearch);
    dojo.attr(btn2, 'disabled', unableSearch);
    var msg = (unableSearch ? 'API参照名重複のため検索不可' : '※ダウンロードはID順固定');
    dojo.create('div', { innerHTML:msg, style:{ fontSize:"0.85em", marginLeft:"12px", display:"table-cell" } }, cell);
};

/**
 * 検索実行
 *
 * @param {Object} so
 * @param {string} soql
 * @param {string} where
 * @param {string} orderBy
 */
teasp.view.DataReader.prototype.search = function(so, param, callback){
    this.contact(
        {
            funcName: 'getExtCount',
            params  : {
                soql   : 'select count() from ' + so.name + (param.where || '') + (param.allRows ? ' ALL ROWS' : '')
            }
        },
        function(result){
            var searchParam = {
                soql     : param.soql + (param.where || '') + (param.orderBy || ''),
                cntAll   : result.count,
                rowMax   : (param.max || this.ROW_MAX),
                pageNo   : 1,
                callback : dojo.hitch(this, callback),
                allRows  : param.allRows || false
            };
            this.search2(so, searchParam, true);
        },
        null,
        false
    );
};

/**
 * 検索実行
 *
 * @param {Object} so
 * @param {Object} searchParam
 * @param {boolean} keepNs
 */
teasp.view.DataReader.prototype.search2 = function(so, searchParam, keepNs){
    this.contact(
        {
            funcName: 'getExtResult',
            params  : {
                soql   : searchParam.soql,
                limit  : searchParam.rowMax,
                offset : (searchParam.pageNo - 1) * searchParam.rowMax,
                allRows: searchParam.allRows || false,
                keepNs : keepNs
            }
        },
        function(result){
            searchParam.callback(so, result.records, searchParam);
        },
        null,
        false
    );
};

/**
 * 検索実行
 *
 * @param {Object} searchParam
 */
teasp.view.DataReader.prototype.searchLoop = function(soql, onSuccess, onFailure){
    var pool = [];
    var max = 1000;
    var offset = 0;
    var innerSearch = function(){};
    innerSearch = dojo.hitch(this, function(){
        this.contact(
            {
                funcName: 'getExtResult',
                params  : {
                    soql   : soql,
                    limit  : max,
                    offset : offset,
                    keepNs : true
                }
            },
            function(result){
                pool = pool.concat(result.records);
                if(result.records.length >= max){
                    offset += max;
                    setTimeout(innerSearch, 100);
                }else{
                    onSuccess.apply(this, [pool]);
                }
            },
            onFailure,
            true
        );
    });
    innerSearch();
};

/**
 * 検索実行
 *
 * @param {Object} so
 * @param {number} pageNo
 * @param {Object} searchParam
 */
teasp.view.DataReader.prototype.searchFunc = function(so, pageNo, searchParam){
    var pn = pageNo;
    var sp = searchParam;
    return function(){
        sp.pageNo = pn;
        this.search2(so, sp, true);
    };
};

/**
 * 抽出実行
 *
 * @param {Object} so
 * @param {string} soql
 */
teasp.view.DataReader.prototype.fetch = function(so, soql, allRows, flag, onSuccess, onFailure){
    var max = 100;
    var counter = 0;
    var beginTm = (new Date()).getTime();
    var pool = [];
    var offset = 0;
    var nextId = null;
    var innerSearch = function(){};
    if(flag){
        this.switchBusy(true);
    }
    innerSearch = dojo.hitch(this, function(){
        var _soql;
        if(nextId){
            if(soql.indexOf(' where ') > 0){
                _soql = soql + " and ";
            }else{
                _soql = soql + " where ";
            }
            _soql += "Id > '" + nextId + "' order by Id";
        }else{
            _soql = soql + " order by Id";
        }
        console.log('(' + ++counter + ') limit=' + max + ', time=' + Math.round(((new Date()).getTime() - beginTm) / 1000));
        this.contact(
            {
                funcName: 'getExtResult',
                params  : {
                    soql   : _soql,
                    limit  : max,
                    offset : offset,
                    allRows: allRows,
                    keepNs : true
                }
            },
            function(result){
                var record = (result.records.length > 0 ? result.records[result.records.length - 1] : null);
                pool = pool.concat(result.records);
                if(result.records.length >= max){
                    nextId = record.Id;
                    setTimeout(innerSearch, 100);
                }else{
                    if(flag){
                        this.switchBusy(false);
                    }
                    onSuccess(so, pool, soql, true);
                }
            },
            onFailure,
            true
        );
    });
    innerSearch();
};

// 項目リストのうち、ローカル名が重複しているものがあれば、名前空間なしの方を削除する
teasp.view.DataReader.prototype.excludeDuplicateField = function(orgFields){
	var fields = dojo.clone(orgFields);
	var fmap = {};
	var dels = [];
	for(var i = 0 ; i < fields.length ; i++){
		var f = fields[i];
		var key = f.localName.toLowerCase();
		var x = fmap[key];
		if(x !== undefined){ // ローカル名が重複している
			// 文字列長が長い方(名前空間つき)を残す
			if(fields[x].name.length > fields[i].name.length){
				dels.push(i);
			}else{
				dels.push(x);
			}
		}else{
			fmap[key] = i;
		}
	}
	console.log(dels.join(','));
	dels = dels.sort(function(a, b){ return b - a; });
	for(var i = 0 ; i < dels.length ; i++){
		var x = dels[i];
		fields.splice(x, 1);
	}
	return fields;
};

teasp.view.DataReader.prototype.getSoql = function(so, flag, mode){
    var l = this.excludeDuplicateField(so.fieldList || []);
    var fv = [];
    for(var i = 0 ; i < l.length ; i++){
        var f = l[i];
        if(mode && f.isCalculated){
            continue;
        }
        fv.push(f.name);
        if(!mode && f.typeName == 'REFERENCE' && f.relationshipName){
            var e = true;
            var refs = (f.referenceTo || []);
            for(var j = 0 ; j < refs.length ; j++){
                var k = this.getSObjectKeyByName(refs[j]);
                var o = (k ? this.getSObjectByKey(k) : null);
                if(!o || !this.existNameField(o)){
                    e = false;
                    break;
                }
            }
            if(e){
                fv.push(f.relationshipName + '.Name');
            }
        }
    }
    return 'select ' + fv.join(flag ? '\n,' : ',') + (flag ? '\n' : '') + ' from ' + so.name;
};

teasp.view.DataReader.prototype.existNameField = function(so){
    var l = (so.fieldList || []);
    for(var i = 0 ; i < l.length ; i++){
        if(l[i].localName == 'Name'){
            return true;
        }
    }
    return false;
};

/**
 * フィールド名のリストを返す.<br/>
 * 「.」区切りの項目は配列化する。<br/>
 * ※戻り値の配列は、string、Array.<string> が混在する
 *
 * @param {string} soql
 * @return {Array.<string|Array.<string>>}
 */
teasp.view.DataReader.prototype.getSoqlFields = function(soql){
    var m = soql;
    var x = m.toLowerCase().indexOf('select');
    m = m.substring(x + 'select'.length + 1);
    x = m.toLowerCase().indexOf(' from ');
    m = m.substring(0, x);
    var ks = m.split(/,/);
    for(var i = 0 ; i < ks.length ; i++){
        ks[i] = ks[i].trim();
        var v = ks[i].split(/\./);
        if(v && v.length > 1){
            ks[i] = v;
        }
    }
    return ks;
};

/**
 * レコード（JSONオブジェクト）を配列にして返す.<br/>
 *
 * @param {Object} record
 * @param {Array.<Object>} fields
 * @param {boolean} kakomi
 * @return {Array.<string>}
 */
teasp.view.DataReader.prototype.parseRecord = function(sobj, record, fields, kakomi){
    var p = record;
    var pp = [];
    for(var j = 0 ; j < fields.length ; j++){
        var field = fields[j];
        var v = '';
        var f = null;
        if(typeof(field) == 'string'){
            f = sobj.fieldMap[field.toLowerCase()];
            if(f && f.typeName == 'DATE'){
                v = teasp.util.date.formatDate(p[field]);
            }else if(f && f.typeName == 'DATETIME'){
                v = (p[field] ? teasp.util.date.formatDateTime(p[field]) : '');
            }else if(f && f.typeName == 'BOOLEAN'){
                v = (p[field] || false);
            }else if(f && f.typeName == 'DOUBLE'){
                v = (typeof(p[field]) == 'number' ? p[field] : '');
            }else if(f && f.typeName == 'ADDRESS'){
                v = (p[field] ? dojo.toJson(p[field]) : '');
            }else{
                v = (typeof(p[field]) == 'number' ? p[field] : (p[field] || ''));
            }
        }else{
            var o = p;
            for(var n = 0 ; n < field.length ; n++){
                o = o[field[n]];
                if(!o){
                    break;
                }
            }
            v = (o || '');
        }
        if(typeof(v) == 'string' && kakomi){
            pp.push('"' + v.replace(/"/g, '""') + '"');
        }else{
            pp.push(v);
        }
    }
    return pp;
};

/**
 * 検索結果を表示
 *
 * @param {Object} so
 * @param {Object} record
 * @param {Object} searchParam
 */
teasp.view.DataReader.prototype.showSearchResult = function(so, records, searchParam){
    this.clearHandle(this.L2|this.L3);
    var area = dojo.byId('dataReaderValueArea');
    dojo.empty(area);
    dojo.create('div', { id: 'dataReaderValuePaging' }, area);

    this.setPaging(searchParam, so, 'dataReaderValuePaging', this.searchFunc);

    var table = dojo.create('table', { className: 'defview', style: { marginTop:"4px" } }, area);
    var thead = dojo.create('thead', null, table);
    var fields = this.getSoqlFields(searchParam.soql);
    var row = dojo.create('tr', null, thead);
    var inp = dojo.create('input', {
        type: 'checkbox'
    }, dojo.create('th', { style:'width:20px;' }, row));
    this.addHandle(this.L2, dojo.connect(inp, 'onclick', this, this.checkedHead));
    for(var i = 0 ; i < fields.length ; i++){
        var field = fields[i];
        var fn = (typeof(field) == 'string' ? field : field.join('.'));
        fn = fn.replace(/teamspirit__/g, '<span style="font-size:80%;">teamspirit__</span><br/>');
        dojo.create('div', {
            innerHTML : fn,
            style     : { wordBreak:"break-all" }
        }, dojo.create('th', { style:'white-space:nowrap;' }, row));
    }
    var tbody = dojo.create('tbody', { id:'dataReaderValueTbody', data:so.name }, table);
    for(i = 0 ; i < records.length ; i++){
        this.valueCache[records[i].Id] = records[i];
        row = dojo.create('tr', { className: ((i%2)==0 ? 'even' : 'odd') }, tbody);
        if(records[i].IsDeleted){
            dojo.style(row, 'backgroundColor', '#D2D2D2');
        }
        var pp = this.parseRecord(so, records[i], fields);
        dojo.create('input', {
            type: 'checkbox',
            data: records[i].Id + (records[i].IsDeleted ? ':DELETED' : '')
        }, dojo.create('td', { style:'text-align:center;' }, row));
        for(var j = 0 ; j < fields.length ; j++){
            var field = fields[j];
            var f = (typeof(field) == 'string' ? so.fieldMap[field.toLowerCase()] : null);
            var v = (j < pp.length ? pp[j] : '');
            if(v.length > 50){
                v = v.substring(0, 50) + '...';
            }
            var cell = dojo.create('td', null, row);
            dojo.create('div', {
                innerHTML : (f && f.plmap ? (f.plmap[v] || v) : v),
                style     : dojo.mixin(this.getTextAlign(so, field), this.getWhiteSpace(so, field))
            }, cell);
            this.setEvent(so, cell, field, v, this.L2);
        }
    }
    var div1 = dojo.create('div', { id:'dataReaderDeleteGate', style:'padding:10px;' }, area);
    var a = dojo.create('a', { innerHTML:'削除／復元', style:'cursor:pointer;color:#0d3daf;text-decoration:underline;' }, div1);
    this.addHandle(this.L2, dojo.connect(a, 'onclick', this, function(){
    	dojo.style('dataReaderDeleteGate', 'display', 'none');
    	dojo.style('dataReaderDeleteArea', 'display', '');
    }));
    var div2 = dojo.create('div', { id:'dataReaderDeleteArea', style:'display:none;' }, area);
    var inp1 = dojo.create('input', { type:'button', value:'削除', style:'margin:10px;' }, div2);
    this.addHandle(this.L2, dojo.connect(inp1, 'onclick', this, this.deleteObjcts));
    var inp2 = dojo.create('input', { type:'button', value:'復元', style:'margin:10px;' }, div2);
    this.addHandle(this.L2, dojo.connect(inp2, 'onclick', this, this.undeleteObjcts));
};
teasp.view.DataReader.prototype.checkedHead = function(){
	var chk = dojo.query('#dataReaderValueArea table th input[type="checkbox"]')[0];
	dojo.query('#dataReaderValueTbody td input[type="checkbox"]').forEach(function(el){
		el.checked = chk.checked;
	});
};
teasp.view.DataReader.prototype.delUndelTargets = function(){
	var targets = {
		key: dojo.attr('dataReaderValueTbody', 'data'),
		dels: [],
		undels: []
	};
	dojo.query('#dataReaderValueTbody td input[type="checkbox"]:checked').forEach(function(el){
		var id = dojo.attr(el, 'data');
		if(id.endsWith(':DELETED')){
			targets.undels.push(id.substring(0, id.indexOf(':')));
		}else{
			targets.dels.push(id);
		}
	});
	return targets;
};
teasp.view.DataReader.prototype.deleteObjcts = function(e){
	var targets = this.delUndelTargets();
	if(!targets.dels.length){
		return;
	}
    const msg1 = '選択された' + targets.dels.length + '件のレコードを削除します。よろしいですか？';
    const msg2 = '【最終確認】削除を実行します。よろしいですか？';
    const msg3 = '削除完了しました。OKクリックで検索画面に戻ってリフレッシュします';
    teasp.tsConfirmA(msg1, this, function(){
        teasp.tsConfirmA(msg2, this, function(){
            this.switchBusy(true);
            // オブジェクト情報を取得
            this.contact(
                {
                    funcName: 'getExtResult',
                    params	: {
                        action : 'deleteByIds',
                        key    : targets.key,
                        ids    : targets.dels
                    }
                },
                function(res){
                    this.switchBusy(false);
                    teasp.tsConfirmA(msg3, this, function(){
                        this.closeVertView();
                        teasp.util.Test.pushEvent('dataReaderSearch', 'onclick');
                    });
                },
                function(result){
                    this.switchBusy(false);
                    teasp.message.alertError(result);
                },
                true
            );
        });
    });
};
teasp.view.DataReader.prototype.undeleteObjcts = function(e){
	var targets = this.delUndelTargets();
	if(!targets.undels.length){
		return;
	}
    const msg1 = '選択された' + targets.undels.length + '件のレコードを復元します。よろしいですか？';
    const msg2 = '復元完了しました。OKクリックで検索画面に戻ってリフレッシュします';
    teasp.tsConfirmA(msg1, this, function(){
        this.switchBusy(true);
        // オブジェクト情報を取得
        this.contact(
            {
                funcName: 'getExtResult',
                params	: {
                    action : 'undeleteByIds',
                    key    : targets.key,
                    ids    : targets.undels
                }
            },
            function(res){
                this.switchBusy(false);
                teasp.tsConfirmA(msg2, this, function(){
                    this.closeVertView();
                    teasp.util.Test.pushEvent('dataReaderSearch', 'onclick');
                });
            },
            function(result){
                this.switchBusy(false);
                teasp.message.alertError(result);
            },
            true
        );
    });
};

/**
 * ページングエリアを作成
 *
 * @param {Object} searchParam
 * @param {Object} so
 * @param {Function} callback
 */
teasp.view.DataReader.prototype.setPaging = function(searchParam, so, areaId, callback){
    var div = dojo.byId(areaId);
    dojo.empty(div);
    var pgcnt = Math.ceil(searchParam.cntAll / searchParam.rowMax);
    var pp = dojo.create('div', { className:'pageDiv', innerHTML: '&lt;' }, div);
    if(searchParam.pageNo > 1){
        dojo.style(pp, 'color' , 'blue');
        dojo.style(pp, 'cursor', 'pointer');
        this.addHandle(this.L2, dojo.connect(pp, 'onclick', this, callback(so, searchParam.pageNo - 1, searchParam)));
    }else{
        dojo.style(pp, 'color' , 'gray');
    }
    var boxs = teasp.util.getPageBox(pgcnt, searchParam.pageNo, 5, 5, 5);
    for(var i = 0 ; i < boxs.length ; i++){
        var n = boxs[i];
        if(n === null){
            dojo.create('div', { className:'pageDiv', innerHTML: '･･', style: { color:"gray" } }, div);
            continue;
        }
        var p = dojo.create('div', { className:'pageDiv', innerHTML: n }, div);
        if(searchParam.pageNo == n){
            dojo.style(p, 'color' , 'gray');
        }else{
            dojo.style(p, 'color' , 'blue');
            dojo.style(p, 'cursor', 'pointer');
            this.addHandle(this.L2, dojo.connect(p, 'onclick', this, callback(so, n, searchParam)));
        }
    }
    var pn = dojo.create('div', { className:'pageDiv', innerHTML: '&gt;' }, div);
    if(searchParam.pageNo < pgcnt){
        dojo.style(pn, 'color' , 'blue');
        dojo.style(pn, 'cursor', 'pointer');
        this.addHandle(this.L2, dojo.connect(pn, 'onclick', this, callback(so, searchParam.pageNo + 1, searchParam)));
    }else{
        dojo.style(pn, 'color' , 'gray');
    }

    var beg = ((searchParam.pageNo - 1) * searchParam.rowMax) + 1;
    var end = beg + searchParam.rowMax - 1;
    if(end > searchParam.cntAll){
        end = searchParam.cntAll;
    }
    var msg = '';
    if(searchParam.cntAll > 0){
        if(searchParam.cntAll <= searchParam.rowMax){
            msg = teasp.message.getLabel('tk10003230', searchParam.cntAll); // {0} 件を表示
        }else{
            msg = teasp.message.getLabel('tk10003240', searchParam.cntAll, (beg || 1), (end || 1)); // {0} 件中 {1}～{2} 件を表示
        }
    }
    dojo.create('div', { className:'pageDiv', style: { width:"10px", height:"2px" } }, div);
    dojo.create('div', { innerHTML: msg, style: { whiteSpace:"nowrap", display:"table" } }, div);
};

/**
 * ダウンロード用のデータを作成
 *
 * @param {Object} so
 * @param {Array.<string>} pool
 * @param {string} soql
 */
teasp.view.DataReader.prototype.buildValueTable = function(so, pool, soql, flag){
    var fields = this.getSoqlFields(soql);
    var value = '';
    for(var i = 0 ; i < pool.length ; i++){
        var pp = this.parseRecord(so, pool[i], fields, true);
        value += pp.join(',') + '\n';
    }
    var hh = [];
    for(var j = 0 ; j < fields.length ; j++){
        var field = fields[j];
        hh.push('"' + (typeof(field) == 'string' ? field : field.join('.')) + '"');
    }
    var head = hh.join(',');
    this.inputDownload(head, value, so.name + '.csv');
};

/**
 * フィールド定義から寄せスタイルを得る
 *
 * @param {Object} so
 * @param {<string|Array.<string>>} pool
 * @return {string}
 */
teasp.view.DataReader.prototype.getTextAlign = function(so, field){
    var f = null;
    if(typeof(field) == 'string'){
        f = so.fieldMap[field.toLowerCase()];
        if(f && f.typeName == 'DATE'){
            return { textAlign:"center" };
        }else if(f && f.typeName == 'DATETIME'){
            return { textAlign:"center" };
        }else if(f && f.typeName == 'BOOLEAN'){
            return { textAlign:"center" };
        }else if(f && f.typeName == 'DOUBLE'){
            return { textAlign:"right" };
        }else{
            return { textAlign:"left" };
        }
    }else{
        return { textAlign:"left" };
    }
};

/**
 * フィールド定義から折り返しスタイルを得る
 *
 * @param {Object} so
 * @param {<string|Array.<string>>} pool
 * @return {string}
 */
teasp.view.DataReader.prototype.getWhiteSpace = function(so, field){
    var f = null;
    if(typeof(field) == 'string'){
        f = so.fieldMap[field.toLowerCase()];
        if(f && (f.typeName == 'DATE' || f.typeName == 'DATETIME' || f.typeName == 'ID')){
            return { whiteSpace:"nowrap" };
        }else if(field.toLowerCase() == 'name'){
            return { whiteSpace:"nowrap" };
        }
    }
    return { whiteSpace:"nowrap" };
};

/**
* データをサーバへ書き込み、ＣＳＶダウンロードを呼び出す
*
* @param {string} head
* @param {string} value
* @param {string} fname
* @param {boolean} nowait
*/
teasp.view.DataReader.prototype.inputDownload = function(head, value, fname, nowait, callback){
  if(window.navigator.msSaveBlob || dojo.isChrome || dojo.isFF){
      var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      var blob = new Blob([bom, head + '\n' + value], {"type": "text/csv"});
      // IEか他ブラウザかの判定
      if(window.navigator.msSaveBlob){
          // IEなら独自関数を使います。
          window.navigator.msSaveBlob(blob, fname);
          if(callback){
              callback();
          }
      } else {
          // それ以外はaタグを利用してイベントを発火させます
          var a = dojo.byId('dataReaderDL');
          a.href = URL.createObjectURL(blob);
          a.download = fname;
          a.click();
          setTimeout(function(){
              URL.revokeObjectURL(a.href);
              if(callback){
                  callback();
              }
          }, 3000);
      }
  }else{
      var key = '' + (new Date()).getTime();
      var values = teasp.util.splitByLength(value, 30000);
      var valot = [];
      var cnt = Math.ceil(values.length / 9);
      var x = 0;
      for(var i = 0 ; i < cnt ; i++){
          valot[i] = [];
          for(var j = 0 ; j < 9 ; j++){
              var k = (x * 9) + j;
              if(k < values.length){
                  valot[i].push(values[k]);
              }
          }
          x++;
      }
      var reqs = [];
      i = 0;
      do{
          reqs.push({
              funcName  : 'inputData',
              params    : {
                  key   : key,
                  head  : (i == 0 ? head : null),
                  values: valot[i],
                  order : (i + 1)
              }
          });
          i++;
      }while(i < valot.length);

      this.contact(
          reqs,
          function(result, index){
              if(reqs.length <= (index + 1)){
                  teasp.downloadHref(teasp.getPageUrl('extCsvView') + '?key=' + key + (fname ? '&fname=' + fname : ''));
                  if(callback){
                      callback();
                  }
              }
          },
          null,
          (nowait || false)
      );
  }
};

/**
 * フィールド定義情報を一括で取得
 *
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
teasp.view.DataReader.prototype.getBulkFields = function(progressBar, dldata, onSuccess, onFailure){
    var pool = [];
    var innerSearch = function(){};
    var lst = [];
    var orgmap = {};

    var searchName          = dojo.byId('dataReaderDLName').value.toLowerCase();
    var searchOpt           = dojo.byId('dataReaderDLNameOpt1'           ).checked;
    var customObjectOnly    = dojo.byId('dataReaderDLCustomObjectOnly'   ).checked;
    var excludeRemoveObject = dojo.byId('dataReaderDLExcludeRemoveObject').checked;
    var excludeFeedObject   = dojo.byId('dataReaderDLExcludeFeedObject'  ).checked;

    var searchNames = [];
    if(searchName){
        dojo.forEach(searchName.split(/[, ]/), function(sn){
            var v = sn.trim();
            if(v){
                searchNames.push(v);
            }
        });
    }

    for(var key in this.sObjects){
        if(!this.sObjects.hasOwnProperty(key)){
            continue;
        }
        var k = key.toLowerCase();
        var lk = this.getLocalName(k);
        if(searchNames.length){
            var f = false;
            for(var i = 0 ; i < searchNames.length ; i++){
                if((searchOpt && (!k.indexOf(searchNames[i]) || !lk.indexOf(searchNames[i])))
                || (!searchOpt && (k == searchNames[i] || lk == searchNames[i]))){
                    f = true;
                    break;
                }
            }
            if(!f){
                continue;
            }
        }
        var o = this.sObjects[key];
        if(customObjectOnly && !o.isCustom){
            continue;
        }
        if(excludeRemoveObject && o.label.indexOf('削除予定') >= 0){
            continue;
        }
        if(excludeFeedObject && o.name.indexOf('__Feed') >= 0){
            continue;
        }
        o.key = key;
        orgmap[key] = 1;
        lst.push(o);
    }
    if(lst.length <= 0){
        teasp.tsAlert('対象のオブジェクトはありません');
        onFailure.apply(this);
        return;
    }

    lst = lst.sort(function(a, b){
        return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
    });
    var plusmax = (dldata ? lst.length + 2 : 0);
    progressBar.set({ maximum: (lst.length + 1 + plusmax) });
    var addmap = {};
    var index = 0;
    innerSearch = dojo.hitch(this, function(){
        this.contact(
            {
                funcName: 'getExtResult',
                params  : {
                    action : 'SObject',
                    key : lst[index++].key
                }
            },
            function(result){
                if(addmap[result.key]){
                    this.setObjectInfo(addmap[result.key], result);
                }else{
                    pool.push(result);
                }
                var fields = result.fields || [];
                for(var i = 0 ; i < fields.length ; i++){
                    var f = fields[i];
                    if(f.typeName == 'REFERENCE'){
                        var refs = (f.referenceTo || []);
                        for(var j = 0 ; j < refs.length ; j++){
                            var ref = refs[j].toLowerCase();
                            ref = this.nameMap[ref] || this.localNameMap[ref];
                            var so = this.getSObjectByKey(ref);
                            if(so && !so.fieldList && !addmap[ref] && !orgmap[ref]){
                                lst.push({ key: ref });
                                addmap[ref] = so;
                                progressBar.set({ maximum: (lst.length + 1) + plusmax });
                            }
                        }
                    }
                }
                if(this.stopped){
                    onFailure.apply(this);
                }else{
                    progressBar.set({ value: progressBar.value + 1 });
                    if(index < lst.length){
                        setTimeout(innerSearch, 100);
                    }else{
                        onSuccess.apply(this, [pool]);
                    }
                }
            },
            onFailure,
            true
        );
    });
    innerSearch();
};

// from String to Uint8Array
teasp.view.DataReader.unicodeStringToTypedArray = function(s, bomflg) {
    var escstr = encodeURIComponent(s);
    var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    });
    var ua = new Uint8Array(binstr.length + (bomflg ? 3 : 0));
    if(bomflg){
        ua[0] = 0xEF;
        ua[1] = 0xBB;
        ua[2] = 0xBF;
    }
    Array.prototype.forEach.call(binstr, function (ch, i) {
        ua[i + (bomflg ? 3 : 0)] = ch.charCodeAt(0);
    });
    return ua;
};

teasp.view.DataReader.prototype.showDone = function(msg){
    var el = dojo.query('#dataReaderDLDataDone div:first-child');
    if(el && el.length){
        el[0].innerHTML = msg;
    }
    dojo.style('dataReaderDLDataDone', 'display', '');
    dojo.query('#dataReaderDLDataDone input[type="button"]')[0].disabled = false;
};

teasp.view.DataReader.prototype.buildDlRecord = function(pool, progressBar, callback){
    var zip = new JSZip();
    var index = 0;
    dojo.forEach(pool, function(o){
        var so = this.getSObjectByKey(o.key);
        this.setObjectInfo(so, o);
    }, this);
    for(var i = pool.length - 1 ; i >= 0 ; i--){
    	var o = pool[i];
    	if(this.isUnableSearchObject(o.key)){
    		pool.splice(i, 1);
    	}
    }

    var sl = this.getSObjectListCsv(pool);
    zip.file('object_list.csv', teasp.view.DataReader.unicodeStringToTypedArray(sl.heads + '\n' + sl.value, true), {binary:true});
    progressBar.set({ value: progressBar.value + 1 });

    var fd = this.getFieldListCsv(pool);
    zip.file('object_fields.csv', teasp.view.DataReader.unicodeStringToTypedArray(fd.heads + '\n' + fd.value, true), {binary:true});
    progressBar.set({ value: progressBar.value + 1 });

    zip.file('organization.txt', teasp.view.DataReader.unicodeStringToTypedArray(this.organizationValue));
    progressBar.set({ value: progressBar.value + 1 });

    var allRows = dojo.byId('dataReaderDLDataAllRows').checked;

    var dlLog = '';
    var errorCnt = 0;

    var finish = dojo.hitch(this, function(){
        if(dlLog){
            zip.file('error.log', teasp.view.DataReader.unicodeStringToTypedArray(dlLog));
        }
        var fname = this.organization.Id.substring(0, 15)
        + '_' + teasp.util.date.formatDateTime(new Date(), 'N14', true)
        + '.zip';
        zip.generateAsync({ type: 'blob', compression: "DEFLATE" }).then(function(content){
            // IEか他ブラウザかの判定
            if(window.navigator.msSaveBlob){
                // IEなら独自関数を使います。
                window.navigator.msSaveBlob(content, fname);
                callback();
            } else {
                // それ以外はaタグを利用してイベントを発火させます
                var a = dojo.byId('dataReaderDLUrl');
                a.href = URL.createObjectURL(content);
                a.download = fname;
                a.target = '_blank';
                a.click();
                setTimeout(function(){
                    URL.revokeObjectURL(a.href);
                    callback();
                }, 3000);
            }
        });
        this.showDone((errorCnt > 0 ? '読込エラー:' + errorCnt + '件 (詳細は error.log 参照)' : '完了'));
    });

    innerSearch = dojo.hitch(this, function(){
        var o = pool[index];
        var so = this.getSObjectByKey(o.key);
        var soql = this.getSoql(so);
        var where = dojo.byId('dataReaderDLDataWhere').value.trim();
        if(where){
            soql += ' where (' + where + ')';
        }
        console.log(soql);
        this.fetch(so, soql, allRows, false, dojo.hitch(this, function(so, records, soql, flag){
            if(records.length > 0){
                var fields = this.getSoqlFields(soql);
                var hh = [];
                for(var j = 0 ; j < fields.length ; j++){
                    var field = fields[j];
                    hh.push('"' + (typeof(field) == 'string' ? field : field.join('.')) + '"');
                }
                var value = hh.join(',') + '\n';
                for(var i = 0 ; i < records.length ; i++){
                    var pp = this.parseRecord(so, records[i], fields, true);
                    value += pp.join(',') + '\n';
                }
                zip.file(so.name + '.csv', teasp.view.DataReader.unicodeStringToTypedArray(value, true), {binary:true});
            }else{
                dlLog += teasp.util.date.formatDateTime(new Date(), 'SLA-HMS', true) + ' ' + so.name + ' : 該当なし\n';
            }
            progressBar.set({ value: progressBar.value + 1 });
            index++;
            if(index < pool.length){
                console.log(records);
                setTimeout(innerSearch, 100);
            }else{
                finish();
            }
        }), dojo.hitch(this, function(result){
            console.log(result);
            errorCnt++;
            dlLog += teasp.util.date.formatDateTime(new Date(), 'SLA-HMS', true);
            dlLog += ' ' + so.name + ' の読込でエラー: ';
            dlLog += teasp.message.getErrorMessage(result) + '\n';
            progressBar.set({ value: progressBar.value + 1 });
            index++;
            if(index < pool.length){
                setTimeout(innerSearch, 100);
            }else{
                finish();
            }
        }));
    });
    innerSearch();
};

teasp.view.DataReader.prototype.sortFields = function(fields){
    fields = fields.sort(dojo.hitch(this, function(a, b){
        var x = this.bfld[a.name.toLowerCase()];
        var y = this.bfld[b.name.toLowerCase()];
        if(x && y){
            return x - y;
        }else if(x){
            return -1;
        }else if(y){
            return 1;
        }else{
            if(a.isCustom && !b.isCustom){
                return 1;
            }else if(!a.isCustom && b.isCustom){
                return -1;
            }
            return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
        }
    }));
    return fields;
};

/**
 * フィールド定義リストのダウンロード用のデータを作成
 *
 * @param {Array.<string>} pool
 */
teasp.view.DataReader.prototype.buildFieldListCsv = function(pool, callback){
    var o = this.getFieldListCsv(pool);
    this.inputDownload(
        o.heads,
        o.value,
        'fields_' + teasp.util.date.formatDate(new Date(), 'yyyyMMdd') + '.csv',
        true,
        callback
    );
};

teasp.view.DataReader.prototype.getFieldListCsv = function(pool){
    var value = '';
    var customFieldOnly     = dojo.byId('dataReaderDLCustomFieldOnly'    ).checked;
    var excludeRemoveField  = dojo.byId('dataReaderDLExcludeRemoveField' ).checked;
    var excludeRemoveCalc   = dojo.byId('dataReaderDLExcludeCalcField'   ).checked;
    var useLocalName        = dojo.byId('dataReaderDLUseLocalNameField'  ).checked;
    var cutPickList         = dojo.byId('dataReaderDLCutPickList'        ).checked;
    var lastReferencedDate  = dojo.byId('dataReaderDLLastReferencedDate' ).checked;
    for(var i = 0 ; i < pool.length ; i++){
        var o = pool[i];
        if(!o.key){
            continue;
        }
        o.fields = this.sortFields(o.fields);
        var so = this.getSObjectByKey(o.key);
        for(var j = 0 ; j < o.fields.length ; j++){
            var field = o.fields[j];
            if(customFieldOnly && !field.isCustom){
                continue;
            }
            if(excludeRemoveField && field.label.indexOf('削除予定') >= 0){
                continue;
            }
            if(excludeRemoveCalc && field.isCalculated){
                continue;
            }
            if(!lastReferencedDate && /^(LastReferencedDate|LastViewedDate)$/i.test(field.name)){
            	continue;
            }
            var lst = [];
            lst.push(so.label);
            lst.push(useLocalName ? so.localName : so.name);
            lst.push(field.label);
            lst.push(useLocalName ? field.localName : field.name);
            lst.push(field.typeName);
            lst.push('' + field.length);
            lst.push('' + field.precision);
            lst.push('' + field.scale);
            lst.push(this.getReferenceTo(field));
            lst.push(this.getPickLabels(field.picklistValues, '\n', (cutPickList ? 100 : 0)));
            lst.push(field.inlineHelpText    ? field.inlineHelpText.replace(/"/g, '""')    : '');
            lst.push(field.calculatedFormula ? field.calculatedFormula.replace(/"/g, '""') : '');
            lst.push(field.isAutoNumber ? '○' : '');
            lst.push(field.isIdLookup   ? '○' : '');
            lst.push(field.isCalculated ? '○' : '');
            lst.push(field.isCustom     ? '○' : '');
            lst.push(field.isNillable   ? '○' : '');
            lst.push(field.isUnique     ? '○' : '');
            lst.push(field.isExternalID              ? '○' : '');
            lst.push(field.isGroupable               ? '○' : '');
            lst.push(field.isHtmlFormatted           ? '○' : '');
            lst.push(field.isRestrictedDelete        ? '○' : '');
            lst.push(this.getChildRelationshipName(pool, so.name, field.name) || '');
            value += '"' + lst.join('","') + '"\n';
        }
    }
    var heads = [
         "objectLabel"
       , "objectName"
       , "label"
       , "name"
       , "type"
       , "length"
       , "precision"
       , "scale"
       , "referenceTo"
       , "pickList"
       , "helpText"
       , "calculatedFormula"
       , "isAutoNumber"
       , "isIdLookup"
       , "isCalculated"
       , "isCustom"
       , "isNilable"
       , "isUnique"
       , "isExternalID"
       , "isGroupable"
       , "isHtmlFormatted"
       , "isRestrictedDelete"
       , "childRelationshipName"
    ];
    return {
        heads: '"' + heads.join('","') + '"',
        value: value
    };
};

teasp.view.DataReader.prototype.getSObjectListCsv = function(pool){
    var heads = [
         'name'
       , 'localName'
       , 'label'
       , 'labelPlural'
       , 'keyPrefix'
       , 'isAccessible'
       , 'isCreateable'
       , 'isCustom'
       , 'isCustomSetting'
       , 'isDeletable'
       , 'isDeprecatedAndHidden'
       , 'isFeedEnabled'
       , 'isMergeable'
       , 'isQueryable'
       , 'isSearchable'
       , 'isUndeletable'
       , 'isUpdateable'
    ];
    var value = '';
    for(var i = 0 ; i < pool.length ; i++){
        var o = pool[i];
        if(!o.key){
            continue;
        }
        var so = this.getSObjectByKey(o.key);
        var lst = [];
        lst.push(so.name);
        lst.push(so.localName);
        lst.push(so.label);
        lst.push(so.labelPlural);
        lst.push(so.keyPrefix);
        lst.push(so.isAccessible          ? '○' : '');
        lst.push(so.isCreateable          ? '○' : '');
        lst.push(so.isCustom              ? '○' : '');
        lst.push(so.isCustomSetting       ? '○' : '');
        lst.push(so.isDeletable           ? '○' : '');
        lst.push(so.isDeprecatedAndHidden ? '○' : '');
        lst.push(so.isFeedEnabled         ? '○' : '');
        lst.push(so.isMergeable           ? '○' : '');
        lst.push(so.isQueryable           ? '○' : '');
        lst.push(so.isSearchable          ? '○' : '');
        lst.push(so.isUndeletable         ? '○' : '');
        lst.push(so.isUpdateable          ? '○' : '');
        value += '"' + lst.join('","') + '"\n';
    }
    return {
        heads: '"' + heads.join('","') + '"',
        value: value
    };
};

teasp.view.DataReader.prototype.getChildRelationshipName = function(pool, soName, fieldName){
    var sn = soName.toLowerCase();
    var fn = fieldName.toLowerCase();
    for(var i = 0 ; i < pool.length ; i++){
        var o = pool[i];
        var ships = o.childRelationships || [];
        for(var j = 0 ; j < ships.length ; j++){
            var ship = ships[j];
            if(ship.objectName.toLowerCase() == sn
            && ship.fieldName.toLowerCase() == fn){
                return ship.relationshipName;
            }
        }
    }
    return null;
};

teasp.view.DataReader.prototype.getReferenceTo = function(field){
    var refs = [];
    var referenceTo = field.referenceTo || [];
    for(var i = 0 ; i < referenceTo.length ; i++){
        var ref = referenceTo[i];
        if(teasp.prefixBar.length && ref.substring(0, teasp.prefixBar.length) == teasp.prefixBar){
            refs.push(ref.substring(teasp.prefixBar.length));
        }else{
            refs.push(ref);
        }
    }
    return (refs.length ? refs.join(',') : '');
};

teasp.view.DataReader.prototype.setEvent = function(so, cell, field, value, lev){
    var f = null;
    if(typeof(field) == 'string'){
        f = so.fieldMap[field.toLowerCase()];
        if(f && (f.typeName == 'ID' || f.typeName == 'REFERENCE')){
            cell.style.cursor = 'pointer';
            this.addHandle(lev, dojo.connect(cell, 'onclick', this, this.clickId(value)));
        }
    }
};

teasp.view.DataReader.prototype.clickId = function(id, mode){
    return function(){
        this.showVert(id, mode);
    };
};

teasp.view.DataReader.prototype.deleteId = function(key, record){
    return function(){
        const msg1 = '本当に削除してよろしいですか？\n\nオブジェクト:'                 + key + '\nID:' + record.Id + (record.Name ? '\nName:' + record.Name : '');
        const msg2 = '【最終確認】削除を実行します。よろしいですか？\n\nオブジェクト:' + key + '\nID:' + record.Id + (record.Name ? '\nName:' + record.Name : '');
        const msg3 = '削除完了しました。OKクリックで検索画面に戻ってリフレッシュします';
        teasp.tsConfirmA(msg1, this, function(){
            teasp.tsConfirmA(msg2, this, function(){
                this.switchBusy(true);
                // オブジェクト情報を取得
                this.contact(
                    {
                        funcName: 'getExtResult',
                        params  : {
                            action : 'deleteById',
                            key    : key,
                            id     : record.Id
                        }
                    },
                    function(res){
                        this.switchBusy(false);
                        teasp.tsConfirmA(msg3, this, function(){
                            this.closeVertView();
                            teasp.util.Test.pushEvent('dataReaderSearch', 'onclick');
                        });
                    },
                    function(result){
                        this.switchBusy(false);
                        teasp.message.alertError(result);
                    },
                    true
                );
            });
        });
    };
};

teasp.view.DataReader.prototype.undeleteId = function(key, record){
    return function(){
        const msg1 = '本当に復元してよろしいですか？\n\nオブジェクト:' + key + '\nID:' + record.Id + (record.Name ? '\nName:' + record.Name : '');
        const msg2 = '復元完了しました。OKクリックで検索画面に戻ってリフレッシュします';
        teasp.tsConfirmA(msg1, this, function(){
            this.switchBusy(true);
            // オブジェクト情報を取得
            this.contact(
                {
                    funcName: 'getExtResult',
                    params  : {
                        action : 'undeleteByIds',
                        key    : key,
                        ids    : [record.Id]
                    }
                },
                function(res){
                    this.switchBusy(false);
                    teasp.tsConfirmA(msg2, this, function(){
                        this.closeVertView();
                        teasp.util.Test.pushEvent('dataReaderSearch', 'onclick');
                    });
                },
                function(result){
                    this.switchBusy(false);
                    teasp.message.alertError(result);
                },
                true
            );
        });
    };
};

teasp.view.DataReader.prototype.showVert = function(id, mode){
    var o = this.getSObjectById(id);
    if(!o){
        return;
    }
    if(this.valueCache[id]){
        this.createVertView(o, this.valueCache[id], null, mode);
    }else{
        this.switchBusy(true);
        var f = dojo.hitch(this, function(){
            var soql = this.getSoql(o) + " where Id = '" + id + "'";
            this.searchLoop(soql,
                function(res){
                    this.createVertView(o, res[0], soql, mode);
                    this.switchBusy(false);
                },
                function(res){
                    this.switchBusy(false);
                }
            );
        });
        if(o.fieldList){
            f();
        }else{
            // オブジェクト情報を取得
            this.contact(
                {
                    funcName: 'getExtResult',
                    params  : {
                        action : 'SObject',
                        key    : o.key
                    }
                },
                function(res){
                    this.setObjectInfo(o, res);
                    f();
                },
                function(res){
                    this.switchBusy(false);
                },
                true
            );
        }
    }
};

teasp.view.DataReader.prototype.setObjectInfo = function(o, res){
    o.fieldList = this.sortFields(res.fields);
    for(var i = 0 ; i < o.fieldList.length ; i++){
        var f = o.fieldList[i];
        if(f.picklistValues && f.picklistValues.length > 0){
            f.plmap = {};
            for(var j = 0 ; j < f.picklistValues.length ; j++){
                var k = f.picklistValues[j][1];
                var v = f.picklistValues[j][0];
                f.plmap[k] = v;
            }
        }
    }
    // フィールドをキー名でマッピング
    o.fieldMap = {};
    for(var i = 0 ; i < o.fieldList.length ; i++){
        var f = o.fieldList[i];
        o.fieldMap[f.name.toLowerCase()] = f;
    }
    // 関連情報をオブジェクト名順に並べ替え
    o.childRelationships = res.childRelationships.sort(function(a, b){
        return (a.objectName < b.objectName ? -1 : (a.objectName > b.objectName ? 1 : 0));
    });
    return o;
};

/**
 * データ縦表示エリア作成
 *
 * @param {string} area
 */
teasp.view.DataReader.prototype.createVertView = function(so, record, soql, mode){
    this.valueCache[record.Id] = record;
    var area = dojo.byId('baseArea');

    this.closeVertView();

    dojo.style('dataReaderPane1', 'display', 'none');
    window.scrollTo(0, 0);

    var div = dojo.create('div', {
        id    : 'dataReaderVertTable',
        style : { border:"none" }
    }, area);

    var btn;
    var a = dojo.create('a', {
        innerHTML : '検索画面に戻る',
        style     : { textDecoration:"underline", fontSize:"0.9em", cursor:"pointer" }
    }, dojo.create('div', {
        style     : { paddingTop:"2px", marginRight:"50px", "float":"left" }
    }, div));
    this.addHandle(this.L3, dojo.connect(a, 'onclick', this, this.closeVertView));
    if(this.editable()){
        if(!mode){
            if(!record.IsDeleted){
                btn = dojo.create('input', {
                    type      : 'button',
                    value     : '編集',
                    style     : { margin:"0px 8px" }
                }, dojo.create('div', {
                    style     : { marginRight:"20px", "float":"left" }
                }, div));
                this.addHandle(this.L3, dojo.connect(btn, 'onclick', this, this.clickId(record.Id, true)));

                btn = dojo.create('input', {
                    type      : 'button',
                    value     : '削除',
                    style     : { margin:"0px 8px" }
                }, dojo.create('div', {
                    style     : { marginRight:"20px", "float":"left" }
                }, div));
                this.addHandle(this.L3, dojo.connect(btn, 'onclick', this, this.deleteId(so.name, record)));
            }else{
                btn = dojo.create('input', {
                    type      : 'button',
                    value     : '復元',
                    style     : { margin:"0px 8px" }
                }, dojo.create('div', {
                    style     : { marginRight:"20px", "float":"left" }
                }, div));
                this.addHandle(this.L3, dojo.connect(btn, 'onclick', this, this.undeleteId(so.name, record)));
            }

            dojo.create('div', { style: { clear:"both" } }, div);
        }else{
            btn = dojo.create('input', {
                type      : 'button',
                value     : '登録',
                style     : { margin:"0px 8px" }
            }, dojo.create('div', {
                style     : { marginRight:"10px", "float":"left" }
            }, div));
            this.addHandle(this.L3, dojo.connect(btn, 'onclick', this, this.saveValue(so, record)));
            btn = dojo.create('input', {
                type      : 'button',
                value     : 'キャンセル',
                style     : { margin:"0px 8px" }
            }, dojo.create('div', {
                style     : { marginRight:"10px", "float":"left" }
            }, div));
            this.addHandle(this.L3, dojo.connect(btn, 'onclick', this, this.clickId(record.Id, false)));
            dojo.create('div', { style: { clear:"both" } }, div);
        }
    }

    var objDiv = dojo.create('div', { style: { margin:"2px 8px" } }, div);
    dojo.create('div', { innerHTML: so.name , style: { marginRight:"8px", "float":"left" } }, objDiv);
    dojo.create('div', { innerHTML: so.label, style: { "float":"left" } }, objDiv);
    dojo.create('div', { style: { clear:"both" } }, objDiv);

    var tableStyle = 'margin:2px 8px;';
    if(record.IsDeleted){
        tableStyle += 'background-color:#D2D2D2';
    }
    var tbody = dojo.create('tbody', null, dojo.create('table', { className: 'defview', style: tableStyle }, div));
    var fields = this.getSoqlFields(soql || this.getSoql(so));
    var pp = this.parseRecord(so, record, fields);
    var fieldNames = [];
    for(var i = 0 ; i < fields.length ; i++){
        var field = fields[i];
        var row = dojo.create('tr', null, tbody);
        var fn = (typeof(field) == 'string' ? field : field.join('.'));
        var f  = (typeof(field) == 'string' ? so.fieldMap[field.toLowerCase()] : null);
        var v = pp[i];
        var t = typeof(v);
        if(t == 'number' || t == 'string' || t == 'boolean'){
            v = pp[i];
        }else if(t != 'undefined'){
            v = '(' + t + ')';
        }else{
            v = '';
        }
        dojo.create('div', { innerHTML: fn                        }, dojo.create('td', null, row));
        var cell = dojo.create('td', null, row);
        dojo.create('div', {
            innerHTML : ((f && f.label) || ''),
            title     : ((f && f.inlineHelpText) || '')
        }, cell);
        dojo.create('div', {
            innerHTML : ((f && f.typeName) || ''),
            title     : (f ? (
                              'length='             + f.length
                            + '\nprecision='        + f.precision
                            + '\nscale='            + f.scale
                            + '\ndefaultValue='     + (f.defaultValue || '')
                            + '\nisAutoNumber='     + f.isAutoNumber
                            + '\nisCalculated='     + f.isCalculated
                            + '\nisCustom='         + f.isCustom
                            + '\nisIdLookup='       + f.isIdLookup
                            + '\nisNillable='       + f.isNillable
                            + '\nisUnique='         + f.isUnique
                            + '\nisAccessible='     + f.isAccessible
                            ) : '')
        }, dojo.create('td', null, row));
        cell = dojo.create('td', null, row);

        if(!mode || typeof(field) != 'string' || this.isReadOnlyField(f) || (f && f.typeName == 'LOCATION')){
            if(f && f.typeName == 'PICKLIST'){
                dojo.create('div', { innerHTML: (f.plmap[v] || v) }, cell);
                this.setEvent(so, cell, field, v, this.L3);
            }else{
                dojo.create('div', { innerHTML: v }, cell);
                this.setEvent(so, cell, field, v, this.L3);
            }
        }else if(f && f.typeName == 'BOOLEAN'){
            var chk = dojo.create('input', {
                type      : 'checkbox',
                style     : { margin:"2px" },
                id        : field
            }, cell);
            chk.checked = v;
            fieldNames.push(field);

        }else if(f && f.typeName == 'TEXTAREA'){
            dojo.create('textarea', {
                value     : v,
                style     : { width:"300px", height:"40px", padding:"1px", margin:"2px" },
                id        : field
            }, cell);
            fieldNames.push(field);

        }else if(f && f.typeName == 'PICKLIST'){
            var select = dojo.create('select', {
                style     : { margin:"2px" },
                title     : ((f && f.inlineHelpText) || ''),
                id        : field
            }, cell);
            fieldNames.push(field);
            var vv = null;
            dojo.create('option', { innerHTML: '', value: '' }, select);
            for(var j = 0 ; j < f.picklistValues.length ; j++){
                var pv = f.picklistValues[j];
                dojo.create('option', { innerHTML: pv[0], value: pv[1] }, select);
                if(pv[1] == v){
                    vv = v;
                }
            }
            if(!vv){
                dojo.create('option', { innerHTML: v, value: v }, select);
            }
            if(typeof(v) != 'string'){
                select.value = '';
            }else{
                select.value = v;
            }

        }else if(f && f.typeName == 'DATE'){
            dojo.create('input', {
                type      : 'text',
                value     : v,
                style     : { width:"86px", padding:"1px", margin:"2px", border:"1px solid #2f5d50" },
                id        : field
            }, cell);
            fieldNames.push(field);
        }else if(f && f.typeName == 'REFERENCE'){
            dojo.create('input', {
                type      : 'text',
                value     : v,
                style     : { width:"150px", padding:"1px", margin:"2px", border:"1px solid #2f5d50", backgroundColor:"#e0ffff" },
                id        : field
            }, cell);
            fieldNames.push(field);
        }else if(f && f.typeName == 'DOUBLE'){
            dojo.create('input', {
                type      : 'text',
                value     : v,
                style     : { width:"90px", padding:"1px", margin:"2px", border:"1px solid #2f5d50" },
                id        : field
            }, cell);
            fieldNames.push(field);
        }else{
            dojo.create('input', {
                type      : 'text',
                value     : v,
                style     : { width:(f.length > 50 ? "300px" : "150px"), padding:"1px", margin:"2px", border:"1px solid #2f5d50" },
                id        : field
            }, cell);
            fieldNames.push(field);
        }
    }
    a = dojo.create('a', {
        innerHTML : '検索画面に戻る',
        style     : { textDecoration:"underline", fontSize:"0.9em", cursor:"pointer" }
    }, dojo.create('div', {
        style     : { paddingTop:"2px", marginRight:"50px", "float":"left" }
    }, div));
    this.addHandle(this.L3, dojo.connect(a, 'onclick', this, this.closeVertView));
    if(this.editable()){
        if(!mode){
            btn = dojo.create('input', {
                type      : 'button',
                value     : '編集',
                style     : { margin:"0px 8px" }
            }, dojo.create('div', {
                style     : { marginRight:"20px", "float":"left" }
            }, div));
            this.addHandle(this.L3, dojo.connect(btn, 'onclick', this, this.clickId(record.Id, true)));

            btn = dojo.create('input', {
                type      : 'button',
                value     : '削除',
                style     : { margin:"0px 8px" }
            }, dojo.create('div', {
                style     : { marginRight:"20px", "float":"left" }
            }, div));
            this.addHandle(this.L3, dojo.connect(btn, 'onclick', this, this.deleteId(so.name, record)));

            dojo.create('div', { style: { clear:"both" } }, div);
        }else{
            btn = dojo.create('input', {
                type      : 'button',
                value     : '登録',
                style     : { margin:"0px 8px" }
            }, dojo.create('div', {
                style     : { marginRight:"10px", "float":"left" }
            }, div));
            this.addHandle(this.L3, dojo.connect(btn, 'onclick', this, this.saveValue(so, record)));
            btn = dojo.create('input', {
                type      : 'button',
                value     : 'キャンセル',
                style     : { margin:"0px 8px" }
            }, dojo.create('div', {
                style     : { marginRight:"10px", "float":"left" }
            }, div));
            this.addHandle(this.L3, dojo.connect(btn, 'onclick', this, this.clickId(record.Id, false)));
            dojo.create('div', { style: { clear:"both" } }, div);
        }
    }
};

teasp.view.DataReader.prototype.saveValue = function(so, record){
    return function(){
        var v = {};
        var fieldList = this.excludeDuplicateField(so.fieldList || []);
        for(var i = 0 ; i < fieldList.length ; i++){
            var f = fieldList[i];
            if(this.isReadOnlyField(f) || f.typeName == 'LOCATION'){
                continue;
            }
            var name = f.name;
            var node = dojo.byId(name);
            if(f.typeName == 'BOOLEAN'){
                v[name] = node.checked;
            }else if(f.typeName == 'DATE'){
                var d = teasp.util.date.parseDate(node.value);
                v[name] = (d ? teasp.util.date.formatDate(d) : null);
            }else if(f.typeName == 'DATETIME'){
                var d = teasp.util.date.parseDate(node.value);
                v[name] = (d ? teasp.util.date.formatDateTime(d, null, true) : null);
            }else if(f.typeName == 'DOUBLE'){
                if(node.value == ''){
                    v[name] = null;
                }else{
                    if(f.scale > 0){
                        v[name] = parseFloat(node.value);
                    }else{
                        v[name] = parseInt(node.value, 10);
                    }
                }
            }else{
                v[name] = node.value;
            }
        }
        var typeMap = this.getTypeMap(so, false, true);
        var values = {};
        values[record.Id] = v;
        this.switchBusy(true);
        this.contact(
            {
                funcName : 'getExtResult',
                params   : {
                    action  : 'updateSObject',
                    objName : so.name,
                    idList  : [ record.Id ],
                    values  : values,
                    typeMap : typeMap
                }
            },
            function(res){
                this.switchBusy(false);
                setTimeout(dojo.hitch(this, function(){
//                    if(confirm('更新完了しました。OKクリックで検索画面に戻ってリフレッシュします')){
                        this.closeVertView();
                        teasp.util.Test.pushEvent('dataReaderSearch', 'onclick');
//                    }
                }), 200);
            },
            function(result){
                this.switchBusy(false);
                teasp.message.alertError(result);
            },
            true
        );
    };
};

teasp.view.DataReader.prototype.closeVertView = function(){
    this.clearHandle(this.L3);
    var v2 = dojo.byId('dataReaderVertTable');
    if(v2){
        dojo.destroy(v2);
    }
    dojo.style('dataReaderPane1', 'display', 'table');
};

/**
 * ダウンロード用のデータを作成
 *
 * @param {Array.<string>} pool
 * @param {string} soql
 */
teasp.view.DataReader.prototype.buildBulkTsData = function(pool){
    var head  = '';
    var fm1 = dojo.byId('dataReaderExportForm1');
    if(fm1.checked){
        var value = dojo.toJson(pool);
        this.inputDownload(head, value, 'tsexport-json.txt');
    }else{
        var value = '';
        for(var i = 0 ; i < pool.length ; i++){
            var o = pool[i];
            var so = this.getSObjectByKey(o.key);
            if(!head){
                head = '"' + o.key + '"\n';
            }else{
                value += '\n"' + o.key + '"\n';
            }
            var fields = this.getSoqlFields(o.soql);
            var hh = [];
            for(var j = 0 ; j < fields.length ; j++){
                var field = fields[j];
                hh.push('"' + (typeof(field) == 'string' ? field : field.join('.')) + '"');
            }
            value += hh.join(',');
            value += '\n';
            for(var r = 0 ; r < o.values.length ; r++){
                var pp = this.parseRecord(so, o.values[r], fields, true);
                value += pp.join(',') + '\n';
            }
        }
        this.inputDownload(head, value, 'tsexport.csv');
    }
};

// 入退館管理機能：再判定期間に入力された
teasp.view.DataReader.prototype.enterAutoReJudgeDays = function(e){
    var v = dojo.byId('dataReaderAutoReJudgeDays').value;
    if(v){
        v = teasp.util.time.zenNum2han(v); // 数字以外を削除、全角→半角に変換
        v = '' + (v ? parseInt(v, 10) : '');
        dojo.byId('dataReaderAutoReJudgeDays').value = v;
    }
    var n = dojo.byId('dataReaderAutoReJudgeDaysCheck');
    if(v && !n.checked){
        n.checked = true;
    }
};
