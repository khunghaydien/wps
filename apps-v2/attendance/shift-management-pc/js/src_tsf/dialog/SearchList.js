/**
 * 検索リストダイアログ
 *
 * @constructor
 */
teasp.Tsf.SearchList = function(){
};

teasp.Tsf.SearchList.prototype = new teasp.Tsf.ListBase();

/**
 * 親クラスの init() が実行されないようにする。
 *
 */
teasp.Tsf.SearchList.prototype.init = function(param){
    this.fp = teasp.Tsf.Fp.createFp(param);
    this.showInit = false;
};

teasp.Tsf.SearchList.prototype.getArea = function(){
    return teasp.Tsf.Dom.byId(this.dialog.id);
};

teasp.Tsf.SearchList.prototype.getListArea = function(){
    return teasp.Tsf.Dom.node('table.ts-list-body', this.getArea());
};

teasp.Tsf.SearchList.prototype.getFp = function(){
    return this.fp;
};

teasp.Tsf.SearchList.prototype.show = function(obj, callback){
    teasp.Tsf.Error.showError();
    if(!this.dialog){
        this.discernment = obj.discernment;
        this.domHelper = new teasp.Tsf.Dom();
        this.dialog = new dijit.Dialog({
            title       : obj.title || this.fp.getTitle(),
            className   : this.fp.getFormCss()
        });
        this.dialog.attr('content', this.getContent());
        this.dialog.startup();
        this.domHelper.connect(this.dialog, 'onCancel', this, function(){ this.hide(); });
        if(dojo.isIE == 9){
            this.domHelper.connect(this.dialog, 'onKeyDown', this, function(e){ if(e.keyCode===13){ dojo.stopEvent(e); } return false; });
        }
    }
    this.callback = callback;
//    if(obj.filts && obj.filts.length > 0){
//        this.setFreeFilts(obj.filts);
//    }
    this.orgData = obj || {};
    if(this.orgData.delay){
        this.records = [];
        this.recordCount = 0;
        this.drawData();
        this.showDataEnd();
        setTimeout(teasp.Tsf.Dom.hitch(this, this.search), 100);
    }else{
        this.showData();
    }
};

teasp.Tsf.SearchList.prototype.showDataEnd = function(){
    if(!this.showInit){
        var vobj = this.orgData.values || {};
        this.fp.searchFcLoop(function(fc){
            if(fc.getApiKey()){
                fc.drawText(this.getDomHelper(), vobj);
            }
        }, this);

        var width = dojo.style(teasp.Tsf.Dom.node('div.ts-search-list-box', this.getArea()), 'width');
        dojo.style(teasp.Tsf.Dom.node('div.ts-section-form', this.getArea()), 'width', width + 'px');

        this.dialog.show();
        this.showInit = true;
    }
    teasp.Tsf.ListBase.prototype.showDataEnd.call(this);
};

teasp.Tsf.SearchList.prototype.isShowInit = function(){
    return this.showInit;
};

teasp.Tsf.SearchList.prototype.hide = function(){
    if(this.dialog){
        this.dialog.hide();
        this.domHelper.free();
        this.dialog.destroy();
        tsfManager.removeSearchListDialog(this.discernment);
    }
};

teasp.Tsf.SearchList.prototype.getContent = function(){
    var areaEl = this.getDomHelper().create('div', { className: 'ts-dialog ts-search-list' });
    this.createScrollTable(areaEl);
    return areaEl;
};

teasp.Tsf.SearchList.prototype.setSearchContent = function(areaEl){
    if(this.fp.getSearchFields().length > 0){
        var searchEl = this.getDomHelper().create('div', { className: 'ts-section-form' }, areaEl);
        var pfc = null;
        var row = null;
        this.fp.searchFcLoop(function(fc){
            if(fc.isHidden()){
                this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId() }, searchEl);
            }else{
                if(!pfc || !pfc.isNoNL()){
                    row = this.getDomHelper().create('div', { className: 'ts-form-row' }, searchEl);
                }
                // ラベル部作成
                var label = this.getDomHelper().create('div', { className: 'ts-form-label' }, row);
                if(fc.getLw()){
                    teasp.Tsf.Dom.style(label, 'width', fc.getLw());
                }
                this.getDomHelper().create('div', { innerHTML: fc.getLabel() }, label);
                // 入力欄作成
                fc.appendFieldDiv(this.getDomHelper(), row);
                pfc = fc;
            }
        }, this);

        // 検索ボタン
        var searchBtn = this.getDomHelper().create('button', null, this.getDomHelper().create('div', { className: 'ts-search-button' }, row));
        teasp.Tsf.Dom.append(searchBtn, this.getDomHelper().create('div', { innerHTML: teasp.message.getLabel('search_btn_title') })); // 検索
        this.getDomHelper().connect(searchBtn, 'onclick', this, this.search);

        this.setEventHandler(searchEl);
    }
};

teasp.Tsf.SearchList.prototype.setEventHandler = function(formEl){
    // 日付選択ボタンクリックのイベントハンドラ作成
    teasp.Tsf.Dom.query('.ts-form-cal', formEl).forEach(function(cal){
        var n = teasp.Tsf.Dom.node('div.ts-form-date > input[type="text"]', cal.parentNode.parentNode);
        if(n){
            tsfManager.eventOpenCalendar(this.getDomHelper(), cal, n, { tagName: n.name, isDisabledDate: function(d){ return false; } });
        }
    }, this);

    // 金額入力欄のイベントハンドラをセット
    teasp.Tsf.Dom.query('.ts-form-currency input', formEl).forEach(function(n){
        teasp.Tsf.Currency.eventInput(this.getDomHelper(), n, teasp.Tsf.Dom.hitch(this, this.changedCurrency));
    }, this);
};

teasp.Tsf.SearchList.prototype.createButtons = function(areaEl){
    var area = this.getDomHelper().create('div', { className: 'ts-dialog-buttons' }, areaEl);
    var div  = this.getDomHelper().create('div', null, area);
    var buttons = this.getButtons();
    if(buttons.length <= 0){
        var okbtn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('ok_btn_title')    , 'ts-dialog-ok'    , div); // ＯＫ
        var canbtn = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('cancel_btn_title'), 'ts-dialog-cancel', div); // キャンセル
        this.getDomHelper().connect(okbtn , 'onclick', this, this.ok);
        this.getDomHelper().connect(canbtn, 'onclick', this, this.hide);
    }
    dojo.forEach(buttons, function(b){
        if(b.key == 'close'){
            var button = teasp.Tsf.Dialog.createButton(this.getDomHelper(), b.label || teasp.message.getLabel(b.labelId), 'ts-dialog-cancel', div);
            this.getDomHelper().connect(button, 'onclick', this, this.hide);
        }else{
            var disabled = (this.option[b.key] && typeof(this.option[b.key]) == 'function' ? '' : '-disabled');
            var button = teasp.Tsf.Dialog.createButton(this.getDomHelper(), b.label || teasp.message.getLabel(b.labelId), (b.css || 'ts-dialog-ok') + disabled, div);
            if(!disabled){
                this.getDomHelper().connect(button, 'onclick', this, function(e){
                    var data = {
                        id          : this.orgData.id,
                        cancelLabel : this.orgData.cancelLabel,
                        records     : this.collectRecords(),
                        dialogTitle : this.option.dialogTitle
                    };
                    this.showError();
                    this.option[b.key](data, teasp.Tsf.Dom.hitch(this, this.hide), teasp.Tsf.Dom.hitch(this, this.showError));
                });
            }else{
                button.disabled = true;
            }
        }
    }, this);
};

teasp.Tsf.SearchList.prototype.getButtons = function(e){
    return this.fp.getButtons();
};

teasp.Tsf.SearchList.prototype.getCheckboxHead = function(e){
    return teasp.Tsf.Dom.node('table.ts-list-head thead', this.getArea());
};

/**
 * リスト描画
 * 最低限の行数に満たない場合は空行を描画する
 * @param {*} tb tbody - optional
 */
teasp.Tsf.SearchList.prototype.drawData = function(tb){
    this.getDomHelper().freeBy(this.reskey);
    var tbody = (tb || teasp.Tsf.Dom.node('tbody', this.getListArea()));
    teasp.Tsf.Dom.empty(tbody);

    var rowSize = this.fp.getRowLimit();
    if(this.records.length < rowSize){
        rowSize = Math.max(this.fp.getRowDisp(), this.records.length);
    }

    for(var i = 0 ; i < rowSize ; i++){
        var tr = this.getDomHelper().create('tr', null, tbody);
        teasp.Tsf.Dom.toggleClass(tr, 'ts-row-even', !(i%2));
        teasp.Tsf.Dom.toggleClass(tr, 'ts-row-odd' ,  (i%2));
        var hkey = teasp.Tsf.Fp.setHkey(this.getDomHelper(), tr);
        // セルと入力欄を作成
        this.fp.fcLoop(function(fc){
            if(fc.isHidden()){
                this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId(hkey) }, tr);
            }else{
                fc.appendFieldCell(this.getDomHelper(), tr, hkey);
            }
        }, this);
        this.getDomHelper().create('td', { className: 'last', style: 'width:16px;display:none;' }, tr); // Macのブラウザでスクロールバーが非表示になる対策：ダミーのセルを挿入
        var record = (i < this.records.length ? this.records[i] : {});
        this.fp.fcLoop(function(fc){
            if(fc.getDomType() == 'route' && !record._route){ // domType=='_route' の時は、特別なことをする
                record._route = new teasp.Tsf.EmpExp(record, false, true);
            }
            fc.drawText(this.getDomHelper(), record, hkey, tr);
            if(fc.isLinkAttachments() && record.Attachments && record.Attachments.length > 0){ // 添付ファイルがある
                var a = teasp.Tsf.Dom.query('.ts-form-children .pp_ico_receipt_r', tr);
                this.getDomHelper().connect(a, 'onclick', this, this.openAttach);
            }else if(fc.isLink() && !this.notOpenLink && record.Id){
                this.getDomHelper().connect(teasp.Tsf.Dom.query('a', tr), 'onclick', this, this.openLink, this.reskey);
            }
        }, this);
        if(i < this.records.length){
            tr.style.cursor = 'pointer';
            this.getDomHelper().connect(tr, 'onclick', this, this.clickTr, this.reskey);
        }else{
            tr.style.cursor = 'default';
        }
    }

    var box = teasp.Tsf.Dom.node('div.ts-search-list-box', this.getArea());
    if(box){
        box.scrollTop = 0;
    }

    teasp.Tsf.ListBase.setPaging({
            pageNo   : this.pageNo,
            cntAll   : this.recordCount,
            rowLimit : this.fp.getRowLimit()
        },
        teasp.Tsf.Dom.node('.ts-list-paging', this.getArea()),
        this.getDomHelper(),
        'paging',
        this
    );
};

teasp.Tsf.SearchList.prototype.search = function(e){
    var vobj = {};
    var lst = [];
    this.fp.searchFcLoop(function(fc){
        if(fc.getApiKey()){
            var vals = fc.fetchValues();
            fc.fillValue(vobj, vals);
            if(vals[0].value || (vals.length > 1 && vals[1].value) || vals[0].array || fc.isNullSpec()){
                fc.setFilts(lst, vals);
            }
        }
    }, this);
    this.setFreeFilts(lst);
    this.refresh();
};

teasp.Tsf.SearchList.prototype.collectData = function(){
    var lst = [];
    var tbody = teasp.Tsf.Dom.node('tbody', this.getListArea());
    teasp.Tsf.Dom.query('input.ts-check', tbody).forEach(function(el){
        if(el.checked){
            var tr = teasp.Tsf.Dom.getAncestorByTagName(el, 'TR');
            var hkey = teasp.Tsf.Fp.getHkey(tr);
            var v = {};
            // 入力欄から値を取得
            this.fp.fcLoop(function(fc){
                if(fc.getApiKey()){
                    fc.fillValue(v, fc.fetchValue(hkey));
                }
            }, this);
            var fv1 = this.fp.getFcByApiKey('Id'  ).fetchValue(hkey);
            var fv2 = this.fp.getFcByApiKey('Name').fetchValue(hkey);
            v.value     = fv1.value;
            v.dispValue = fv2.value;
            v.nameValue = fv2.value;
            lst.push(v);
        }
    }, this);
    return lst;
};

teasp.Tsf.SearchList.prototype.openLink = function(e){
    var tr = teasp.Tsf.Dom.getAncestorByTagName(e.target, 'TR');
    if(tr){
        var hkey = teasp.Tsf.Fp.getHkey(tr);
        var id = this.fp.getFcByApiKey('Id').fetchValue(hkey).value;
        if(id){
            if(teasp.isSforce1()){
                sforce.one.navigateToURL('/' + id);
            }else{
                window.open('/' + id);
            }
        }
    }
};

teasp.Tsf.SearchList.prototype.openAttach = function(e){
    var tr = teasp.Tsf.Dom.getAncestorByTagName(e.target, 'TR');
    if(tr){
        var hkey = teasp.Tsf.Fp.getHkey(tr);
        var id = this.fp.getFcByApiKey('Id').fetchValue(hkey).value;
        var record = this.getRecordById(id);
        if(record && record.Attachments && record.Attachments.length > 0){
            var url = teasp.getPageUrl('empRefView') + '?id=' + record.Attachments[0].Id + '&parentId=' + record.Attachments[0].ParentId;
            if(teasp.isSforce1()){
                sforce.one.navigateToURL(url);
            }else{
                var wh = window.open(url, 'attachment', 'width=700,height=600,resizable=yes,scrollbars=yes');
                if(wh){
                    wh.focus();
                }
            }
        }
    }
};

teasp.Tsf.SearchList.prototype.collectRecords = function(){
    var lst = this.collectData();
    var records = [];
    dojo.forEach(lst, function(fv){
        var record = this.getRecordById(fv.value);
        if(record){
            records.push(record);
        }
    }, this);
    return records;
};

teasp.Tsf.SearchList.prototype.getRecordById = function(id){
    for(var i = 0 ; i < this.records.length ; i++){
        if(this.records[i].Id == id){
            return this.records[i];
        }
    }
    return null;
};

teasp.Tsf.SearchList.prototype.ok = function(e){
    var lst = this.collectData();
    if(lst.length <= 0){
        return;
    }
    if(this.callback){
        this.callback(lst);
    }
    this.hide();
};
