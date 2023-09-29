/**
 * セクション共通基底クラス
 *
 * @constructor
 */
teasp.Tsf.SectionBase = function(parent){
    this.parent = parent;
    this.rowMax = 0;
    this.checkable = true;
    this.objMap = {};
};

teasp.Tsf.SectionBase.createSectionBar = function(domHelper, title, check, cssName){
    var bar = domHelper.create('div', { className: cssName || 'ts-section-bar2' });
    var label = domHelper.create('label', null, bar);
    domHelper.create('div', { className: 'ts-section-vbar'  }, label);
    if(check){
        label.style.cursor = 'pointer';
        domHelper.create('input', { type: 'checkbox' }, domHelper.create('div', { className: 'ts-section-check' }, label));
    }
    domHelper.create('div', { className: 'ts-section-title', innerHTML: title }, label);
    return bar;
};

teasp.Tsf.SectionBase.prototype.createSectionBar = function(domHelper, title, check, cssName){
    return teasp.Tsf.SectionBase.createSectionBar(domHelper, title, check, cssName);
};

teasp.Tsf.SectionBase.prototype.createSectionApron = function(){
    return null;
};

teasp.Tsf.SectionBase.prototype.getTbody = function(){
    return teasp.Tsf.Dom.node('table.' + this.getFormCss() + ' tbody');
};

teasp.Tsf.SectionBase.prototype.getDomHelper = function(){
    return this.parent.getDomHelper();
};

teasp.Tsf.SectionBase.prototype.getDiscernment = function(){
    return this.fp.getDiscernment();
};

teasp.Tsf.SectionBase.prototype.getTitle = function(){
    if(this.fp.getTitle()){
        return this.fp.getTitle();
    }
    return this.parent.getSectionTitle(this.getDiscernment());
};

teasp.Tsf.SectionBase.prototype.isChild = function(){
    return this.fp.isChild();
};

teasp.Tsf.SectionBase.prototype.getRelationshipName = function(){
    return this.fp.getRelationshipName();
};

teasp.Tsf.SectionBase.prototype.getObjBase = function(){
    return this.parent.getObjBase();
};

teasp.Tsf.SectionBase.prototype.getValues = function(){
    return this.parent.getSectionValues(this.getDiscernment());
};

teasp.Tsf.SectionBase.prototype.getValuesByRowIndex = function(index){
    if(this.source){
        return (index < this.source.values.length ? this.source.values[index] : {});
    }
    return this.parent.getSectionValuesByRowIndex(this.getDiscernment(), index);
};

teasp.Tsf.SectionBase.prototype.getValuesByUniqKey = function(key){
    return this.parent.getSectionValuesByUniqKey(this.getDiscernment(), key);
};

teasp.Tsf.SectionBase.prototype.isReadOnly = function(){
    return this.fp.isReadOnly();
};

teasp.Tsf.SectionBase.prototype.setReadOnly = function(flag){
    this.fp.setReadOnly(flag);
};

/**
 *
 */
teasp.Tsf.SectionBase.prototype.createArea = function(){
    return [];
};

teasp.Tsf.SectionBase.prototype.getDock = function(){
    return this.fp.getDock();
};

teasp.Tsf.SectionBase.prototype.getAreaCss = function(){
    return ' ts-main-form';
};

teasp.Tsf.SectionBase.prototype.getFormCss = function(){
    return this.fp.getFormCss();
};

teasp.Tsf.SectionBase.prototype.getFormEl = function(){
    return teasp.Tsf.Dom.node('div.' + this.getFormCss());
};

teasp.Tsf.SectionBase.prototype.createTableArea = function(plus){
    var formEl = this.getDomHelper().create('div'  , { className: 'ts-section-form ' + this.getFormCss() + this.getAreaCss() });
    teasp.Tsf.Dom.show(formEl, null, !this.checkable);

    var top = this.createSectionTop();
    if(top){
        teasp.Tsf.Dom.append(formEl, top);
    }

    var table   = this.getDomHelper().create('table', { className: 'ts-section-content ' + this.getFormCss() }, formEl);
    // ヘッダ部作成
    var thead   = this.getDomHelper().create('thead', null, table);
    var tr      = this.getDomHelper().create('tr'   , null, thead);
    var headCellCount = 0;
    var existCheck = false;

    this.fp.fcLoop(function(fc){
        if(!fc.isHidden()){
            headCellCount += fc.appendFieldHead(this.getDomHelper(), tr);
            if(fc.isCheck()){
                existCheck = true;
            }
        }
    }, this);

    // ボディ部作成
    var tbody   = this.getDomHelper().create('tbody', null, table);

    // フッタ部作成
    var tfoot   = this.getDomHelper().create('tfoot', null, table);
    // 空セル行作成（table width=100% の時、空セル行がないと、列幅が指定どおりにならないため入れる）
    tr = this.getDomHelper().create('tr', { className: 'ts-table-empty-row' }, tfoot);
    this.fp.fcLoop(function(fc){
        if(!fc.isHidden()){
            fc.appendFieldEmptyCell(this.getDomHelper(), tr);
        }
    }, this);
    // ＋ボタン部作成
    if(plus && !this.isReadOnly()){
        // 罫線
        this.getDomHelper().create('td', { colSpan: headCellCount }, this.getDomHelper().create('tr', { className: 'ts-table-border-1' }, tfoot));
        this.getDomHelper().create('td', { colSpan: headCellCount }, this.getDomHelper().create('tr', { className: 'ts-table-border-2' }, tfoot));
        // ＋ボタン等
        var td = this.getDomHelper().create('td', { colSpan: headCellCount }, this.getDomHelper().create('tr', { className: 'ts-table-bottom' }, tfoot));
        var tr2 = this.getDomHelper().create('tr', null, this.getDomHelper().create('table', null, td));
        var btn1 = this.getDomHelper().create('button', { className: 'png-add' , title: teasp.message.getLabel('tk10000985')       }, this.getDomHelper().create('div', null, this.getDomHelper().create('td', null, tr2))); // 追加
        var btn2 = this.getDomHelper().create('button', { className: 'png-del' , title: teasp.message.getLabel('delete_btn_title') }, this.getDomHelper().create('div', null, this.getDomHelper().create('td', null, tr2))); // 削除
        var btn3 = this.getDomHelper().create('button', { className: 'png-up'  , title: teasp.message.getLabel('up_btn_title')     }, this.getDomHelper().create('div', null, this.getDomHelper().create('td', null, tr2))); // 上へ
        var btn4 = this.getDomHelper().create('button', { className: 'png-down', title: teasp.message.getLabel('down_btn_title')   }, this.getDomHelper().create('div', null, this.getDomHelper().create('td', null, tr2))); // 下へ
        var btn5 = this.getDomHelper().create('button', { className: 'png-ido' , title: teasp.message.getLabel('tf10006300')       }, this.getDomHelper().create('div', null, this.getDomHelper().create('td', null, tr2))); // 移動
        // ＋ボタン等クリック時処理
        this.getDomHelper().connect(btn1, 'onclick', this, this.pushInsert);
        this.getDomHelper().connect(btn2, 'onclick', this, this.pushDelete);
        this.getDomHelper().connect(btn3, 'onclick', this, this.upRow);
        this.getDomHelper().connect(btn4, 'onclick', this, this.downRow);
        this.getDomHelper().connect(btn5, 'onclick', this, this.pushMove);
        // 移動ボタンは初期値で非表示にする
        teasp.Tsf.Dom.show(btn5, null, false);
        // 並び順を保存ボタン
        var btn6 = this.getDomHelper().create('button', { innerHTML: teasp.message.getLabel('tf10001570'), style: 'display:none;', className: 'ts-save-order' }, td); // 並び順を保存
        this.getDomHelper().connect(btn6, 'onclick', this, this.saveOrder);
    }
    if(existCheck){
        this.getDomHelper().connect(teasp.Tsf.Dom.node('.ts-form-checkbox input[type="checkbox"]', thead), 'onclick', this, function(e){
            var chkAll = teasp.Tsf.Dom.node('.ts-form-checkbox input[type="checkbox"]', thead);
            teasp.Tsf.Dom.query('div.ts-form-checkbox input[type="checkbox"]', tbody).forEach(function(el){
                if(teasp.Tsf.Dom.isVisible(el)){
                    el.checked = chkAll.checked;
                }
            }, this);
        });
    }
    var els = [];
    if(this.getTitle()){
        els.push(this.createSectionBar(this.getDomHelper(), this.getTitle(), this.checkable));
    }
    els.push(formEl);
    var el = this.createSectionApron();
    if(el){
        els.push(el);
    }
    return els;
};

teasp.Tsf.SectionBase.prototype.refreshView = function(){
};

teasp.Tsf.SectionBase.prototype.refreshDiffView = function(){
};

teasp.Tsf.SectionBase.prototype.createSectionTop = function(){
    return null;
};

teasp.Tsf.SectionBase.prototype.getCheckedRowIndexes = function(){
    var indexes = [];
    var tbody = this.getTbody();
    teasp.Tsf.Dom.query('div.ts-form-checkbox input[type="checkbox"]', tbody).forEach(function(el){
        if(el.checked){
            var tr = teasp.Tsf.Dom.getAncestorByTagName(el, 'TR');
            indexes.push(tr.rowIndex - 1);
        }
    }, this);
    return indexes;
};

teasp.Tsf.SectionBase.prototype.setCheckedByIndexes = function(indexes){
    var tbody = this.getTbody();
    teasp.Tsf.Dom.query('div.ts-form-checkbox input[type="checkbox"]', tbody).forEach(function(el){
        var tr = teasp.Tsf.Dom.getAncestorByTagName(el, 'TR');
        var n = tr.rowIndex - 1;
        if(indexes.contains(n)){
            el.checked = true;
        }
    }, this);
};

teasp.Tsf.SectionBase.prototype.pushInsert = function(e){
    this.insertRow();
    return false;
};

teasp.Tsf.SectionBase.prototype.insertRow = function(hkey){
    return null;
};

teasp.Tsf.SectionBase.prototype.pushDelete = function(e){
    var indexes = this.getCheckedRowIndexes();
    if(indexes.length <= 0){
        return;
    }
    this.deleteRows(indexes);
};

teasp.Tsf.SectionBase.prototype.deleteRows = function(indexes, flag){
    if(!flag){
        teasp.tsConfirm(teasp.message.getLabel('tm20004550', indexes.length),this,function(result){// {0} 件のデータを削除します。よろしいですか？  
            if(result){
                var tbody = this.getTbody();
                for(var i = indexes.length - 1 ; i >= 0 ; i--){
                    var x = indexes[i];
                    this.deleteRow(tbody.rows[x]);
                }
                if(this.rowMax > 0){
                    this.showPlusButton(this.getRowCount() < this.rowMax);
                }
                this.setRowBgColor();
                this.refreshDiffView();
                // 金額を更新
                this.changedCurrency();
            }
        }); 
    }
};

/**
 * 行削除
 *
 * @param {Object} tr 行
 * @param {boolean=} viewOnly true ならデータを残す
 * @param {boolean=} calcOnly true ならデータ更新ではない
 */
teasp.Tsf.SectionBase.prototype.deleteRow = function(tr, viewOnly, calcOnly){
    var key = this.getUniqKeyByRow(tr);
    if(!viewOnly){
        // 削除対象行のデータを保持していたら削除フラグをつける
        this.parent.deleteSectionValueByUniqKey(this.getDiscernment(), key);
    }
    this.getDomHelper().freeBy(teasp.Tsf.Fp.getHkey(tr));
    teasp.Tsf.Dom.destroy(tr);
};

teasp.Tsf.SectionBase.prototype.getRemoveIdList = function(){
    return this.parent.getRemoveIdList(this.getDiscernment());
};

teasp.Tsf.SectionBase.prototype.upRow = function(e){
    var tbody = this.getTbody();
    var cr = null;
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var tr = tbody.rows[i];
        var chk = teasp.Tsf.Dom.node('div.ts-form-checkbox input[type="checkbox"]', tr);
        if(!chk){
            break;
        }
        if(cr && chk.checked){
            dojo.place(tr, cr, 'before');
        }else if(!chk.checked){
            cr = tr;
        }else{
            cr = null;
        }
    }
    this.setRowBgColor();
};

teasp.Tsf.SectionBase.prototype.downRow = function(e){
    var tbody = this.getTbody();
    var cr = null;
    for(var i = tbody.rows.length - 1 ; i >= 0 ; i--){
        var tr = tbody.rows[i];
        var chk = teasp.Tsf.Dom.node('div.ts-form-checkbox input[type="checkbox"]', tr);
        if(chk){
            if(cr && chk.checked){
                dojo.place(tr, cr, 'after');
            }else if(!chk.checked){
                cr = tr;
            }else{
                cr = null;
            }
        }
    }
    this.setRowBgColor();
};

teasp.Tsf.SectionBase.prototype.pushMove = function(e){
    var indexes = this.getCheckedRowIndexes();
    if(indexes.length <= 0){
        return;
    }
    this.moveCheck(indexes);
};

teasp.Tsf.SectionBase.prototype.moveStart = function(){
    var indexes = this.getCheckedRowIndexes();
    if(indexes.length <= 0){
        return;
    }
    this.moveLine(indexes);
};

teasp.Tsf.SectionBase.prototype.moveCheck = function(indexes){
};

teasp.Tsf.SectionBase.prototype.moveLine = function(indexes){
};

teasp.Tsf.SectionBase.prototype.saveOrder = function(e){
};

teasp.Tsf.SectionBase.prototype.getUniqKeyByRow = function(tr){
    return this.getValueByApiKey('_uniqKey', teasp.Tsf.Fp.getHkey(tr));
};

/**
 * テーブルリストに行を追加
 *
 * @param {string=} _hkey
 * @returns {Object}
 */
teasp.Tsf.SectionBase.prototype.insertTableRow = function(_hkey){
    var tr = this.getDomHelper().create('tr', { className: 'ts-table-row' });
    var hkey = teasp.Tsf.Fp.setHkey(this.getDomHelper(), tr, _hkey);

    // セルと入力欄を作成
    this.fp.fcLoop(function(fc){
        if(fc.isHidden()){
            this.getDomHelper().create('input', { type:'hidden', id: fc.getDomId(hkey) }, tr);
        }else{
            fc.appendFieldCell(this.getDomHelper(), tr, hkey);
        }
    }, this);

    // 日付選択ボタンクリックのイベントハンドラ作成
    var cal = teasp.Tsf.Dom.node('.ts-form-cal', tr);
    if(cal){
        var n = teasp.Tsf.Dom.node('input[type="text"]', cal.parentNode);
        if(n){
            tsfManager.eventOpenCalendar(this.getDomHelper(), cal, n, { tagName: n.name, isDisabledDate: function(d){ return false; } }, hkey);
        }
    }

    // 金額入力欄のイベントハンドラをセット
    var n = teasp.Tsf.Dom.node('.ts-form-currency input', tr);
    if(n){
        teasp.Tsf.Currency.eventInput(this.getDomHelper(), n, teasp.Tsf.Dom.hitch(this, this.changedCurrency), hkey);
    }

    // 拡張クラスで個別の処理
    this.insertTableRowEx(tr, hkey);

    var rowIndex = this.getRowCount(); // 現在の行数を得る
    var dataObj = this.getValuesByRowIndex(rowIndex);

    var o = {};
    for(var key in dataObj){
        if(dataObj.hasOwnProperty(key) && (key.substring(0, 1) != '_' || key == '_temp_attach')){
            o[key] = dataObj[key];
        }
    }
    this.objMap[hkey] = o;

    // 値を入力欄にセット
    this.fp.fcLoop(function(fc){
        fc.drawText(this.getDomHelper(), dataObj, hkey, tr);
    }, this);

    // 行を挿入
    teasp.Tsf.Dom.append(this.getTbody(), tr);

    // 削除レコードの場合、チェックボックスを非表示にする
    teasp.Tsf.Dom.show('input[type="checkbox"]', tr, (dataObj._removed ? false : true));

    this.setRowBgColor();

    // 行数がMaxに達していたら＋ボタンを非表示にする
    if(this.rowMax > 0){
        this.showPlusButton(this.getRowCount() < this.rowMax);
    }
    return tr;
};

/**
 * テーブルリストに行を追加の拡張用
 *
 * @param tr
 * @param hkey
 */
teasp.Tsf.SectionBase.prototype.insertTableRowEx = function(tr, hkey){
};

/**
 * データ行数を返す
 *
 * @returns {number}
 */
teasp.Tsf.SectionBase.prototype.getRowCount = function(){
    var tbody = this.getTbody();
    return (tbody ? tbody.rows.length : 0);
};

/**
 * 全削除
 *
 * @param {boolean=} viewOnly true ならデータを残して画面だけクリアする
 * @param {boolean=} calcOnly true ならデータ更新ではない
 */
teasp.Tsf.SectionBase.prototype.empty = function(viewOnly, calcOnly){
    var tbody = this.getTbody();
    if(tbody){
        var lastIndex = tbody.rows.length - 1;
        for(var i = lastIndex ; i >= 0 ; i--){
            this.deleteRow(tbody.rows[i], viewOnly, calcOnly);
        }
    }
};

teasp.Tsf.SectionBase.prototype.setRowBgColor = function(){
    var tbody = this.getTbody();
    if(tbody){
        for(var i = 0 ; i < tbody.rows.length ; i++){
            var tr = tbody.rows[i];
            teasp.Tsf.Dom.toggleClass(tr, 'ts-row-even', !(i%2));
            teasp.Tsf.Dom.toggleClass(tr, 'ts-row-odd' ,  (i%2));
        }
    }
};

teasp.Tsf.SectionBase.prototype.showPlusButton = function(flag){
    var formEl = teasp.Tsf.Dom.node('table.' + this.getFormCss());
    if(flag){
        teasp.Tsf.Dom.show('.png-add', formEl, true);
    }else{
        teasp.Tsf.Dom.show('.png-add', formEl, false);
    }
};

teasp.Tsf.SectionBase.prototype.refresh = function(obj){
    this.source = obj;
    this.objMap = {};

    if(this.source && this.source.title){
        var body = teasp.Tsf.Dom.node('div.' + this.getFormCss());
        var bar  = teasp.Tsf.Dom.previousSibling(body);
        var n = teasp.Tsf.Dom.node('.ts-section-title', bar);
        n.innerHTML = this.source.title;
        var a = teasp.Tsf.Dom.node('.ts-section-jump', bar);
        if(!a){
            a = this.getDomHelper().create('a', { className: 'ts-section-jump' }, bar);
            a.title = teasp.message.getLabel('tf10000480'); // 経費精算へ
            this.getDomHelper().create('div', null, a);
        }
        var arg = 'expApplyId=' + (this.source.id || '');
        arg += '&empId=' + tsfManager.getEmpId();
        if(tsfManager.isReadMode()){
            arg += '&mode=read';
        }
        a.href = teasp.getPageUrl('empExpView') + '?' + arg;
    }
    var lst = (obj ? obj.values : this.getValues());
    var rcnt = this.getRowCount();
    var n = lst.length - rcnt;
    for(var i = 0 ; i < n ; i++){
        this.insertRow();
    }
};

/**
 * 合計金額を再計算
 *
 */
teasp.Tsf.SectionBase.prototype.changedCurrency = function(e){
    this.parent.changedCurrency(e);
};

teasp.Tsf.SectionBase.prototype.show = function(flag){
//    var body = teasp.Tsf.Dom.node('div.' + this.getFormCss());
//    var bar  = teasp.Tsf.Dom.previousSibling(body);
//    teasp.Tsf.Dom.show(bar , null, flag);
//    teasp.Tsf.Dom.show(body, null, flag);
    dojo.forEach(teasp.Tsf.Dom.query('div.' + this.getFormCss()), function(body){
        var bar  = teasp.Tsf.Dom.previousSibling(body);
        teasp.Tsf.Dom.show(bar , null, flag);
        teasp.Tsf.Dom.show(body, null, flag);
    });
};

teasp.Tsf.SectionBase.prototype.isVisible = function(){
    return teasp.Tsf.Dom.isVisible(teasp.Tsf.Dom.node('div.' + this.getFormCss()));
};

teasp.Tsf.SectionBase.prototype.open = function(flag){
    if(this.checkable){
        var body = teasp.Tsf.Dom.node('div.' + this.getFormCss());
        var bar  = teasp.Tsf.Dom.previousSibling(body);
        teasp.Tsf.Dom.show(body, null, flag);
        var chk = teasp.Tsf.Dom.node('input[type="checkbox"]', bar);
        if(chk){
            chk.checked = flag;
        }
    }
};

teasp.Tsf.SectionBase.prototype.isOpen = function(){
    if(this.checkable){
        var body = teasp.Tsf.Dom.node('div.' + this.getFormCss());
        var bar  = teasp.Tsf.Dom.previousSibling(body);
        var chk = teasp.Tsf.Dom.node('input[type="checkbox"]', bar);
        return (chk ? chk.checked : true);
    }else{
        return true;
    }
};

teasp.Tsf.SectionBase.prototype.existValue = function(){
    var lst = this.getValues();
    if(this.fp.isChild() || this.fp.isVirChild()){
        return (lst.length > 0);
    }else{
        var exist = false;
        var dataObj = this.getValuesByRowIndex(0);
        this.fp.fcLoop(function(fc){
            if(!fc.isHidden() && fc.parseSimple(dataObj).value){
                exist = true;
            }
        }, this);
        return exist;
    }
};

teasp.Tsf.SectionBase.prototype.setValueByApiKey = function(apiKey, key, val){
    var el = this.fp.getElementByApiKey(apiKey, key);
    if(el){
        el.value = val;
    }
};

teasp.Tsf.SectionBase.prototype.getValueByApiKey = function(apiKey, key){
    var fc = this.fp.getFcByApiKey(apiKey);
    return fc.fetchValue(key).value;
};

teasp.Tsf.SectionBase.prototype.getChildValues = function(key, tbody, flag, ngList, chklev){
    var v = this.objMap[key] || {};
    if(flag){
        // 最初の文字が '_'、名前が'checked' のキーはハンドリング用に追加したキーなので削除
        var dl = [];
        for(var k in v){
            if(v.hasOwnProperty(k)
            && (k.substring(0, 1) == '_' || k == 'checked')){
                dl.push(k);
            }
        }
        for(var i = 0 ; i < dl.length ; i++){
            delete v[dl[i]];
        }
    }
    var vn = 0;
    var ngs = [];
    if(this.isChild()){
        // 入力欄から値を取得
        this.fp.fcLoop(function(fc){
            if(fc.getApiKey(null, flag) || (!flag && fc.isCheck())){
                var val = fc.fillValue(v, fc.fetchValue(key, flag));
                fc.checkValid(val, chklev, ngs);
                if(val){
                    vn++;
                }
            }
        }, this);
    }
    if(ngList && vn > 0){
        for(var n = 0 ; n < ngs.length ; n++){
            ngList.push(ngs[n]);
        }
    }
    return v;
};

/**
 * 入力欄から値を取得
 *
 * @param {boolean=} flag =true:ハンドリング用の要素を除く
 * @param {number=} chklev 1:申請時用エラーチェック、2:一時保存用エラーチェック
 * @returns {Array.<Object>}
 */
teasp.Tsf.SectionBase.prototype.getDomValues = function(flag, chklev){
    var data = {
        objectName  : this.fp.getObjectName(),
        values      : [],
        types       : {},
        fixes       : {},
        removes     : []
    };
    var tbody = this.getTbody();
    var hkeys = teasp.Tsf.Fp.getHkeys(tbody);
    var ngList = [];
    if(this.isChild()){
        this.fp.fcLoop(function(fc){
            if(fc.isApiField(true)){
                var k = fc.getApiKey();
                data.types[k] = fc.getSObjType();
                if(fc.getFix()){
                    data.fixes[k] = fc.getFix();
                }
            }
        }, this);
        for(var i = 0 ; i < hkeys.length ; i++){
            var v = this.getChildValues(hkeys[i], tbody, flag, ngList, chklev);
            if(!v._removed){
                data.values.push(v);
            }
        }
        data.removes = this.getRemoveIdList();
    }else{
        var valid = this.isOpen();
        if(this.fp.isVirChild()){
            var siz = (this.fp.getVirMax() || hkeys.length);
            for(var i = 0 ; i < siz ; i++){
                var v = {};
                var vn = 0;
                var ngs = [];
                // 入力欄から値を取得
                this.fp.fcLoop(function(fc){
                    if(fc.isApiField(true)){
                        var k = fc.getApiKey(i + 1);
                        v[k] = (valid && i < hkeys.length ? fc.fetchValue(hkeys[i]).value : null);
                        teasp.Tsf.Fc.setObjSimpleValue(v, k, v[k]);
                        data.types[k] = fc.getSObjType();
                        if(fc.getFix()){
                            data.fixes[k] = fc.getFix();
                        }
                        if(valid){
                            fc.checkValid(v[k], chklev, ngs);
                        }
                        if(v[k]){
                            vn++;
                        }
                    }
                }, this);
                data.values.push(v);
                for(var n = 0 ; vn > 0 && n < ngs.length ; n++){
                    ngList.push(ngs[n]);
                }
            }
        }else{
            var v = {};
            var ngs = [];
            // 入力欄から値を取得
            this.fp.fcLoop(function(fc){
                if(fc.isApiField(true)){
                    var k = fc.getApiKey();
                    v[k] = (valid ? fc.fetchValue().value : null);
                    teasp.Tsf.Fc.setObjSimpleValue(v, k, v[k]);
                    data.types[k] = fc.getSObjType();
                    if(fc.getFix()){
                        data.fixes[k] = fc.getFix();
                    }
                    if(valid){
                        fc.checkValid(v[k], chklev, ngs);
                    }
                }
            }, this);
            data.values.push(v);
            for(var n = 0 ; n < ngs.length ; n++){
                ngList.push(ngs[n]);
            }
        }
        if(chklev){
            data.ngList = ngList;
        }
    }
    return data;
};

/**
 * 子ウィンドウから受信した情報で添付ファイル情報を更新
 *
 * @param attachObj
 */
teasp.Tsf.SectionBase.prototype.setAttachmentInfo = function(attachObj){
};

/**
 * 経費明細をインポート
 * @param {Array.<Object>} empExps
 */
teasp.Tsf.SectionBase.prototype.importEmpExps = function(COL, data){
};

teasp.Tsf.SectionBase.prototype.restoreCheck = function(exps){
};

teasp.Tsf.SectionBase.prototype.getMisMatchFlag = function(){
    return 0;
};

teasp.Tsf.SectionBase.prototype.getMisMatchFlagCheckedOnly = function(){
    return 0;
};

/**
 * 絞り込み条件を変更した
 */
teasp.Tsf.SectionBase.prototype.changedFilter = function(filter){
};
