teasp.provide('teasp.verify.VerView');
/**
 *
 */
teasp.verify.VerView = function(){
    this.scanTabs = [
        { title: '勤怠月次'          , num: 1, onclick: this.openEmpMonth, defa:true },
        { title: '勤怠日次'          , num: 2, onclick: this.openEmpDay    },
        { title: '有休'              , num: 3, onclick: this.openEmpYuq    },
        { title: '代休／日数管理休暇', num: 4, onclick: this.openEmpStock  },
        { title: 'オプション'        , num: 5, onclick: this.openOption    }
    ];
    this.errorNo = 0;
    var dataObj = null;
    if(window.opener){
        dataObj = window.opener.teasp.viewPoint.pouch.dataObj;
    }else{
        dataObj = {params:{empId:null,month:null}};
    }
    this.verCheck = new teasp.verify.VerCheck(dataObj);
    this.empId = (dataObj && dataObj.targetEmp && dataObj.targetEmp.id);
    this.events = [];
};

teasp.verify.VerView.MONTH_TITLE = '勤怠月次データ DB保存値';
teasp.verify.VerView.DAYS_TITLE  = '勤怠日次データ DB保存値';
teasp.verify.VerView.YUQ_TITLE   = '有給休暇 付与・消化状況';
teasp.verify.VerView.STOCK_TITLE = '代休／日数管理休暇 付与・消化状況';
teasp.verify.VerView.MONTH_DESCRIPTION = '<span>&#10003; : 一致</span><span style="margin-left:10px;color:red;font-weight:bold;">{0}</span> : 不一致（括弧内の値は画面表示値）<span style="margin-left:10px;">無印 : 比較対象外</span><br/><span>（※注）設定変更等により、正常系でも不一致になることはあります。</span>';
teasp.verify.VerView.DAYS_DESCRIPTION  = '<span>&#10003; : 一致</span><span style="margin-left:10px;color:red;font-weight:bold;">{0}</span> : 不一致（括弧内の値は画面表示値）<span style="margin-left:10px;">無印 : 比較対象外</span><br/><span>（※注）設定変更等により、正常系でも不一致になることはあります。</span>';
teasp.verify.VerView.NOTHING     = 'データはありません';
teasp.verify.VerView.LEAVE_DESCRIPTION =  '<span>・時系列順に付与・消化・失効状況を並べています。付与の日付は有効開始日を表示します。</span>'
                                    + '<br/><span>・付与日数・消化日数の右側の#{番号}は、付与と消化の紐づけを示すタグです。同じタグは紐づけ関係にあることを示します。</span>'
                                    + '<br/><span>・消化を複数の付与から行うものは、タグを太字で表示します（消化レコードの名前・申請名・IDが同一かどうかでも識別可）。</span>'
                                    + '<br/><span>・残日数は時系列順に付与・消化した場合の値です。そのため、TS本体で表示される残日数と一致しないことがあります。</span>';
teasp.verify.VerView.YUQ_DESCRIPTION   = teasp.verify.VerView.LEAVE_DESCRIPTION;
teasp.verify.VerView.STOCK_DESCRIPTION = teasp.verify.VerView.LEAVE_DESCRIPTION
                                    + '<br/><span>・代休の場合、付与日数＝０や付与日数＜消化日数になる場合があります。その場合は、タグを赤色で表示します。</span>'
                                    + '<br/><span>　（正常系でも、休日出勤労働時間が代休取得条件を満たさない・申請取消等の要因で、この状態になることがあります）</span>';

/**
 *
 * @param {Object} response
 */
teasp.verify.VerView.prototype.init = function(response){
    this.res = response;
};

/**
 *
 */
teasp.verify.VerView.prototype.initView = function(){
    this.createErrorArea();
    this.verCheck.loadEmpMonth(
        dojo.hitch(this, this.initArea),
        dojo.hitch(this, function(result){
        })
    );
};

teasp.verify.VerView.prototype.initArea = function(){
    this.createScanTabsArea();
    for(var i = 0 ; i < this.scanTabs.length ; i++){
        var tab = this.scanTabs[i];
        if(tab.defa && tab.onclick){
            tab.onclick.apply(this);
            break;
        }
    }
};

/**
 *
 */
teasp.verify.VerView.prototype.createScanTabsArea = function(){
    dojo.empty(dojo.byId('tsfArea'));
    var tabs = dojo.create('div', { className: 'verify-tabs' }, dojo.byId('tsfArea'));
    dojo.create('div', { className: 'main-area' }, dojo.byId('tsfArea'));
    dojo.forEach(this.scanTabs, function(tab){
        var n = dojo.create('div', {
            innerHTML: tab.title,
            className: 'verify-tab' + tab.num + ' ' + (tab.defa ? 'focus' : 'blur')
        }, tabs);
        if(tab.onclick){
            dojo.connect(n, 'click', this, tab.onclick);
        }
    }, this);
    dojo.connect(tabs, 'click', this, this.clickTab);
};

/**
 *
 * @param {Object} e
 */
teasp.verify.VerView.prototype.clickTab = function(e){
    var n = e.target;
    var fx = -1;
    for(var x = 1 ; x <= this.scanTabs.length ; x++){
        if(dojo.hasClass(n, 'verify-tab' + x)){
            fx = x;
            break;
        }
    }
    if(fx < 0){
        return;
    }
    dojo.query('.verify-tabs > div').forEach(function(el){
        dojo.toggleClass(el, 'focus',  dojo.hasClass(el, 'verify-tab' + fx));
        dojo.toggleClass(el, 'blur' , !dojo.hasClass(el, 'verify-tab' + fx));
    });
};

teasp.verify.VerView.prototype.getMainArea = function(){
    var n = dojo.query('#tsfArea > .main-area');
    return (n ? n[0] : null);
};

teasp.verify.VerView.prototype.createErrorArea = function(){
    var mainArea = this.getMainArea();
    var topArea = dojo.byId('tsfArea');
    var div = dojo.create('div', { className: 'error-area', id: 'verifyError' + (++this.errorNo) });
    if(!mainArea){
        dojo.place(div, topArea, 'first');
    }else if(mainArea.firstChild){
        dojo.place(div, mainArea.firstChild, 'before');
    }else{
        dojo.place(div, mainArea, 'first');
    }
    this.verCheck.setErrorId('verifyError' + this.errorNo);
};

teasp.verify.VerView.prototype.clearView = function(){
    for(var i = 0 ; i < this.events.length ; i++){
        dojo.disconnect(this.events[i]);
    }
    this.events = [];
    var n = this.getMainArea();
    if(n){
        dojo.empty(n);
    }
    this.createErrorArea();
};

teasp.verify.VerView.prototype.showError = function(result){
    dojo.query('.error-area').forEach(function(el){
        el.innerHTML = teasp.message.getErrorMessage(result);
    });
};

/**
 *
 */
teasp.verify.VerView.prototype.openEmpMonth = function(){
    this.clearView();
    this.verCheck.getDbEmpMonth(
        dojo.hitch(this, this.showEmpMonth),
        dojo.hitch(this, this.showError)
    );
};

teasp.verify.VerView.prototype.showEmpMonth = function(){
    var table = dojo.create('table', { className: 'verify-table' });
    var thead = dojo.create('thead', null, table);
    var tr = dojo.create('tr', null, thead);
    dojo.create('th', { innerHTML: '項目名' }, tr);
    dojo.create('th', { innerHTML: 'DB値'   }, tr);
    var tbody = dojo.create('tbody', null, table);
    var chkfls = this.verCheck.compareMonthResults();
    var n = 0;
    for(var i = 0 ; i < chkfls.length ; i++){
        var chkfl = chkfls[i];
        if(!chkfl.label){
            tr = dojo.create('tr', { className: 'empty-row' }, tbody);
            dojo.create('td', { colSpan: thead.rows[0].cells.length }, tr);
            continue;
        }
        tr = dojo.create('tr', { className: 'verify-' + ((n++)%2==0 ? 'even' : 'odd') }, tbody);
        dojo.create('td', {
            className : 'field-label',
            innerHTML : chkfl.label,
            title     : chkfl.title
        }, tr);
        var cmark = (chkfl.mark ? '<span class="check-result">' + chkfl.mark + '</span>' : '');
        dojo.create('td', {
            className : 'field-value align-' + chkfl.align + ' span-' + chkfl.check,
            innerHTML : chkfl.value + cmark
        }, tr);
    }
    this.getMainArea().appendChild(dojo.create('div',{
        className : 'verify-description',
        innerHTML : teasp.message.format(teasp.verify.VerView.MONTH_TITLE, teasp.verify.VerCheck.NG_MARK)
    }));
    this.getMainArea().appendChild(table);
    this.getMainArea().appendChild(dojo.create('div',{
        className : 'verify-description',
        innerHTML : teasp.message.format(teasp.verify.VerView.MONTH_DESCRIPTION, teasp.verify.VerCheck.NG_MARK)
    }));
};

teasp.verify.VerView.prototype.openEmpDay = function(){
    this.clearView();
    this.verCheck.getDbEmpDays(
        dojo.hitch(this, this.showEmpDays),
        dojo.hitch(this, this.showError)
    );
};

teasp.verify.VerView.prototype.showEmpDays = function(){
    var table = dojo.create('table', { className: 'verify-table' });
    var thead = dojo.create('thead', null, table);
    var chkfls = this.verCheck.compareDaysResults();
    var ds = chkfls['d']; // 日付列
    var fs = chkfls['f']; // フィールド列
    var tr = dojo.create('tr', null, thead);
    for(var x = 0 ; x < fs.length ; x++){
        var f = fs[x];
        if(!f.name){
            if(f.type == 'y'){
                dojo.create('th', { innerHTML: '曜日' }, tr);
            }
            continue;
        }
        dojo.create('th', { innerHTML: f.label, title: f.name }, tr);
    }
    var tbody = dojo.create('tbody', null, table);
    var n = 0;
    for(var y = 0 ; y < ds.length ; y++){
        var d = ds[y];
        tr = dojo.create('tr', { className: 'verify-' + ((n++)%2==0 ? 'even' : 'odd') }, tbody);
        for(var x = 0 ; x < fs.length ; x++){
            var f = fs[x];
            if(!f.name){
                if(f.type == 'y'){ // 曜日は日付から得る
                    dojo.create('td', {
                        innerHTML : teasp.util.date.formatDate(d, 'JPW'),
                        className : 'day-value align-center'
                    }, tr);
                }
                continue;
            }
            var chkfl = chkfls[d][f.name];
            var cmark = (chkfl.mark ? '<span class="check-result">' + chkfl.mark + '</span>' : '');
            dojo.create('td', {
                className : 'day-value align-' + chkfl.align + ' span-' + chkfl.check,
                innerHTML : chkfl.value + cmark
            }, tr);
        }
    }
    this.getMainArea().appendChild(dojo.create('div',{
        className : 'verify-description',
        innerHTML : teasp.message.format(teasp.verify.VerView.DAYS_TITLE, teasp.verify.VerCheck.NG_MARK)
    }));
    this.getMainArea().appendChild(table);
    this.getMainArea().appendChild(dojo.create('div',{
        className : 'verify-description',
        innerHTML : teasp.message.format(teasp.verify.VerView.DAYS_DESCRIPTION, teasp.verify.VerCheck.NG_MARK)
    }));
};

teasp.verify.VerView.prototype.openEmpYuq = function(){
    this.clearView();
    this.verCheck.getDbEmpYuq(
        dojo.hitch(this, this.showEmpYuq),
        dojo.hitch(this, this.showError)
    );
};

teasp.verify.VerView.prototype.showEmpYuq = function(){
    var ym = this.verCheck.verYuq.getYuqMap();
    this.getMainArea().appendChild(dojo.create('div',{
        className : 'verify-description',
        innerHTML : teasp.message.format(teasp.verify.VerView.YUQ_TITLE)
    }));
    if(ym.mix.length > 0){
        var table = dojo.create('table', { className: 'verify-stock' });
        var thead = dojo.create('thead', null, table);
        var tr = dojo.create('tr', null, thead);
        dojo.create('th', { innerHTML: ''           }, tr);
        dojo.create('th', { innerHTML: '日付'       }, tr);
        dojo.create('th', { innerHTML: '付与日数' , colSpan:2 }, tr);
        dojo.create('th', { innerHTML: '消化日数' , colSpan:2 }, tr);
        dojo.create('th', { innerHTML: '残日数'     }, tr);
        dojo.create('th', { innerHTML: '基準時間'   }, tr);
        dojo.create('th', { innerHTML: '失効日'     }, tr);
        dojo.create('th', { innerHTML: '事柄'       }, tr);
        dojo.create('th', { innerHTML: '名前'       }, tr);
        dojo.create('th', { innerHTML: '申請名'     }, tr);
        dojo.create('th', { innerHTML: '勤怠有休ID' }, tr);
        var tbody = dojo.create('tbody', null, table);
        for(var i = 0 ; i < ym.mix.length ; i++){
            var o = ym.mix[i];
            tr = dojo.create('tr', {
                className: 'stock-' + (i%2==0 ? 'even' : 'odd') + (o._limit ? ' stock-limit' : '')
            }, tbody);
            dojo.create('td', { className: 'align-right', innerHTML: (i + 1) }, tr);
            var ctag = (o._ng ? 'align-tag-ng' : 'align-tag');
            if(o._folk){
                ctag += ' tag-folk';
            }
            if(o.TotalTime__c >= 0){
                dojo.create('td', { className: 'align-center', innerHTML: o.StartDate__c   }, tr);
                dojo.create('td', { className: 'align-right' , innerHTML: o._obj.format()  }, tr);
                dojo.create('td', { className: ctag          , innerHTML: o._tag           }, tr);
                dojo.create('td', { className: 'align-right' , innerHTML: ''               }, tr);
                dojo.create('td', { className: 'align-tag'   , innerHTML: ''               }, tr);
                dojo.create('td', { className: 'align-right' , innerHTML: o._zan.format()  }, tr);
                dojo.create('td', { className: 'align-right' , innerHTML: o._bt            }, tr);
                dojo.create('td', { className: 'align-center', innerHTML: o.LimitDate__c   }, tr);
            }else{
                dojo.create('td', { className: 'align-center', innerHTML: o.Date__c        }, tr);
                dojo.create('td', { className: 'align-right' , innerHTML: ''               }, tr);
                dojo.create('td', { className: 'align-tag'   , innerHTML: ''               }, tr);
                dojo.create('td', { className: 'align-right' , innerHTML: o._obj.format()  }, tr);
                dojo.create('td', { className: ctag          , innerHTML: o._tag           }, tr);
                dojo.create('td', { className: 'align-right' , innerHTML: o._zan.format()  }, tr);
                dojo.create('td', { className: 'align-right' , innerHTML: o._bt            }, tr);
                dojo.create('td', { className: 'align-center', innerHTML: '-'              }, tr);
            }
            dojo.create('td', { className: 'align-left'  , innerHTML: (o.Subject__c || '')   }, tr);
            dojo.create('td', { className: 'align-left'  , innerHTML: o.Name                 }, tr);
            dojo.create('td', { className: 'align-left'  , innerHTML: o._empApplyName        }, tr);
            if(o._limit){
                dojo.create('td', null, tr);
            }else{
                dojo.create('a', {
                    href      : '/' + o.Id,
                    target    : 'verifyView',
                    innerHTML : o.Id
                }, dojo.create('td', { className: 'align-left' }, tr));
            }
        }
        this.getMainArea().appendChild(table);
        dojo.create('div', {
            className : 'verify-description',
            innerHTML : teasp.verify.VerView.YUQ_DESCRIPTION
        }, this.getMainArea());
    }else{
        dojo.create('div', {
            className : 'verify-description',
            innerHTML : teasp.verify.VerView.NOTHING
        }, this.getMainArea());
    }
};

teasp.verify.VerView.prototype.openEmpStock = function(){
    this.clearView();
// 旧「代休／日数管理休暇」は不要のためいったんコメントアウト
// （タイミングをみて VerEmpStock.js と関連個所を削除する）
//    this.verCheck.getDbEmpStock(
//        dojo.hitch(this, this.showEmpStock),
//        dojo.hitch(this, this.showError)
//    );

    // tsext.leave.LeaveMainViewクラスをインスタンス化（ソースは TsfResource/tsext 下にある）
    if(teasp.LeaveMain){
		teasp.LeaveMain.destroyRecursive();
		teasp.LeaveMain = null;
	}
	teasp.LeaveMain = new tsext.leave.LeaveMainView(1, this.empId);
	teasp.LeaveMain.placeAt(this.getMainArea());
};

teasp.verify.VerView.prototype.showEmpStock = function(){
    var sm = this.verCheck.verStock.getStockMap();
    var keys = [];
    for(var key in sm){
        if(sm.hasOwnProperty(key)){
            keys.push(key);
        }
    }
    var ox = {'代休': 1};
    keys = keys.sort(function(a, b){
        if(ox[a] && ox[b]){
            return ox[a] - ox[b];
        }else if(ox[a] || ox[b]){
            return (ox[a] ? -1 : 1);
        }
        return (a < b ? -1 : 1);
    });
    this.getMainArea().appendChild(dojo.create('div',{
        className : 'verify-description',
        innerHTML : teasp.message.format(teasp.verify.VerView.STOCK_TITLE)
    }));
    var cnt = 0;
    for(var i = 0 ; i < keys.length ; i++){
        var key = keys[i];
        var els = this.createEmpStockTable(key, sm[key]);
        cnt += els.length;
        dojo.forEach(els, function(el){
            this.getMainArea().appendChild(el);
        }, this);
    }
    if(!cnt){
        dojo.create('div', {
            className : 'verify-description',
            innerHTML : teasp.verify.VerView.NOTHING
        }, this.getMainArea());
    }else{
        dojo.create('div', {
            className : 'verify-description',
            innerHTML : teasp.verify.VerView.STOCK_DESCRIPTION
        }, this.getMainArea());
    }
};

teasp.verify.VerView.prototype.createEmpStockTable = function(key, so){
    if(!so){
        return [];
    }
    var tdiv = dojo.create('div', { innerHTML: key, className: 'verify-bold' });
    var table = dojo.create('table', { className: 'verify-stock' });
    var thead = dojo.create('thead', null, table);
    var tr = dojo.create('tr', null, thead);
    dojo.create('th', { innerHTML: ''           }, tr);
    dojo.create('th', { innerHTML: '日付'       }, tr);
    dojo.create('th', { innerHTML: '付与日数' , colSpan:2 }, tr);
    dojo.create('th', { innerHTML: '消化日数' , colSpan:2 }, tr);
    dojo.create('th', { innerHTML: '残日数'     }, tr);
    dojo.create('th', { innerHTML: '失効日'     }, tr);
    dojo.create('th', { innerHTML: '名前'       }, tr);
    dojo.create('th', { innerHTML: '申請名'     }, tr);
    if(key == '代休'){
        dojo.create('th', { innerHTML: '実労働時間'   }, tr);
        dojo.create('th', { innerHTML: '代終日休条件' }, tr);
        dojo.create('th', { innerHTML: '代半日休条件' }, tr);
    }
    dojo.create('th', { innerHTML: '勤怠積休ID' }, tr);
    dojo.create('th', { innerHTML: '剥奪フラグ' }, tr);
    var tbody = dojo.create('tbody', null, table);
    for(var i = 0 ; i < so.mix.length ; i++){
        var o = so.mix[i];
        tr = dojo.create('tr', {
            className: 'stock-' + (i%2==0 ? 'even' : 'odd') + (o._limit ? ' stock-limit' : '')
        }, tbody);
        dojo.create('td', { className: 'align-right', innerHTML: (i + 1) }, tr);
        var ctag = (o._ng ? 'align-tag-ng' : 'align-tag');
        if(o._folk){
            ctag += ' tag-folk';
        }
        if(o.Days__c >= 0){
            dojo.create('td', { className: 'align-center', innerHTML: o.StartDate__c      }, tr);
            dojo.create('td', { className: 'align-right' , innerHTML: o._days             }, tr);
            dojo.create('td', { className: ctag          , innerHTML: o._tag              }, tr);
            dojo.create('td', { className: 'align-right' , innerHTML: ''                  }, tr);
            dojo.create('td', { className: 'align-tag'   , innerHTML: ''                  }, tr);
            dojo.create('td', { className: 'align-right' , innerHTML: o._zan              }, tr);
            dojo.create('td', { className: 'align-center', innerHTML: o.LimitDate__c      }, tr);
        }else{
            dojo.create('td', { className: 'align-center', innerHTML: o.Date__c           }, tr);
            dojo.create('td', { className: 'align-right' , innerHTML: ''                  }, tr);
            dojo.create('td', { className: 'align-tag'   , innerHTML: ''                  }, tr);
            dojo.create('td', { className: 'align-right' , innerHTML: Math.abs(o._days)   }, tr);
            dojo.create('td', { className: ctag          , innerHTML: o._tag              }, tr);
            dojo.create('td', { className: 'align-right' , innerHTML: o._zan              }, tr);
            dojo.create('td', { className: 'align-center', innerHTML: '-'                 }, tr);
        }
        dojo.create('td', { className: 'align-left'  , innerHTML: (o._name || o.Name) }, tr);
        dojo.create('td', { className: 'align-left'  , innerHTML: o._empApplyName     }, tr);
        if(key == '代休'){
            dojo.create('td', { className: 'align-right'  , innerHTML: o.WorkRealTime__c       }, tr);
            dojo.create('td', { className: 'align-right'  , innerHTML: o.DaiqAllBorderTime__c  }, tr);
            dojo.create('td', { className: 'align-right'  , innerHTML: o.DaiqHalfBorderTime__c }, tr);
        }
        if(o._limit){
            dojo.create('td', null, tr);
            dojo.create('td', null, tr);
        }else{
            dojo.create('a', {
                href      : '/' + o.Id,
                target    : 'verifyView',
                innerHTML : o.Id
            }, dojo.create('td', { className: 'align-left' }, tr));
            dojo.create('td', { className: 'align-center'  , innerHTML: '' + (o.LostFlag__c || false) }, tr);
        }
    }
    return [tdiv, table];
};

teasp.verify.VerView.prototype.openOption = function(){
    this.clearView();
/*
    var div = dojo.create('div', { className: 'verify-option' });
    var btn = dojo.create('input', { type: 'button', value: 'file download (json)' }, div);
    this.events.push(dojo.connect(btn, 'click', this, this.downloadSample));

    this.getMainArea().appendChild(div);
    this.getMainArea().appendChild(dojo.create('div', { innerHTML: (dojo.version.major + '.' + dojo.version.minor + '.' + dojo.version.patch) }));
    this.getMainArea().appendChild(dojo.create('div', { innerHTML: navigator.userAgent }));
*/
    // tsext.testAssist.TestAssistExportViewクラスをインスタンス化（ソースは TsfResource/tsext 下にある）
    if(teasp.TestAssistExportView){
		teasp.TestAssistExportView.destroyRecursive();
		teasp.TestAssistExportView = null;
	}
	teasp.TestAssistExportView = new tsext.testAssist.TestAssistExportView(1, this.empId, this.verCheck.getVerData().getDataObj());
	teasp.TestAssistExportView.placeAt(this.getMainArea());
};

teasp.verify.VerView.prototype.downloadSample = function(){
    dojo.query('input[type="button"]').forEach(function(el){ el.disabled = true; });
    document.body.style.cursor = 'wait';
    this.verCheck.downloadSample(function(){
        dojo.query('input[type="button"]').forEach(function(el){ el.disabled = false; });
        document.body.style.cursor = 'default';
    }, dojo.hitch(this, this.showError));
};
