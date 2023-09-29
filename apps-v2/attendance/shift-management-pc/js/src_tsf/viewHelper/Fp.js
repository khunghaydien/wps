/**
 * フォーム・セクション情報
 *
 * @constructor
 */
teasp.Tsf.Fp = function(fp, subkey){
    this.fp = fp;
    this.fp.fcs = teasp.Tsf.Fc.createList(fp.fields || [], this);
    this.fp.searchFcs = teasp.Tsf.Fc.createList(fp.searchFields || [], this);
    this.subkey = subkey;
};

/** ユニーク文字列生成用 @type {number} */
teasp.Tsf.Fp.UNIQ_SEQ = 1;

/**
 * teasp.Tsf.Fp インスタンスを生成
 *
 * @param {Object} obj
 * @returns {teasp.Tsf.Fp}
 */
teasp.Tsf.Fp.createFp = function(obj, subkey){
    return /** @type {teasp.Tsf.Fp} */new teasp.Tsf.Fp(teasp.Tsf.util.clone(obj), subkey);
};

/**
 *
 * fc の notUse==true はスキップする(flag==true以外)。それ以外は、dojo.forEach() と同じ処理
 * @param {Function} callback
 * @param {Object=} thisObj
 * @param {boolean=} flag trueなら notUse==trueをスキップしない
 */
teasp.Tsf.Fp.prototype.fcLoop = function(callback, thisObj, flag){
    var fcs = this.fp.fcs;
    var i = 0, l = fcs && fcs.length || 0;
    if(thisObj){
        for(; i < l; ++i){
            if(fcs[i].isNotUse() && !flag){
                continue;
            }
            if(!fcs[i].isTargetMask(thisObj.mask)) {
                continue;
            }
            callback.call(thisObj, fcs[i], i, fcs);
        }
    }else{
        for(; i < l; ++i){
            if(fcs[i].isNotUse() && !flag){
                continue;
            }
            callback(fcs[i], i, fcs);
        }
    }
};

teasp.Tsf.Fp.prototype.searchFcLoop = function(method, thisObj){
    dojo.forEach(this.fp.searchFcs, method, thisObj);
};

/**
 * Apikey から teasp.Tsf.Fc インスタンスを得る
 *
 * @param {string} apiKey
 * @returns {teasp.Tsf.Fc|null}
 */
teasp.Tsf.Fp.prototype.getFcByApiKey = function(apiKey){
    for(var i = 0 ; i < this.fp.fcs.length ; i++){
        var fc = this.fp.fcs[i];
        if(fc.getApiKey() == apiKey){
            return fc;
        }
    }
    return null;
};

teasp.Tsf.Fp.prototype.getFcById = function(id, key){
    for(var i = 0 ; i < this.fp.fcs.length ; i++){
        var fc = this.fp.fcs[i];
        if(fc.getDomId(key) == id){
            return fc;
        }
    }
    return null;
};

/**
 * ApiKey と key から要素を得る
 *
 * @param {string} apiKey ApiKey
 * @param {string=} key キー
 * @param {Object=} context エリア
 * @returns {Object|null}
 */
teasp.Tsf.Fp.prototype.getElementByApiKey = function(apiKey, key, context){
    var fc = this.getFcByApiKey(apiKey);
    return (fc ? fc.getElement(key, context) : null);
};

teasp.Tsf.Fp.getTitle = function(title){
    var s = title;
    if(title && teasp.Tsf.util.isArray(title)){
        s = teasp.message.mixLabel(title);
    }else if(title){
        s = teasp.message.getLabel(title);
    }
    return s || title;
};

/**
* タイトルを返す
*
* @returns {string}
*/
teasp.Tsf.Fp.prototype.getTitle = function(){
    return teasp.Tsf.Fp.getTitle(this.fp.title);
};

/**
 * セクションのタイトルを返す
 *
 * @param {string=} セクション識別名
 * @returns {string}
 */
teasp.Tsf.Fp.prototype.getSectionTitle = function(discernment){
    if(discernment && this.fp.sectionTitles){
        return teasp.Tsf.Fp.getTitle(this.fp.sectionTitles[discernment]);
    }
    if(this.fp.sectionTitle){
        return teasp.Tsf.Fp.getTitle(this.fp.sectionTitle);
    }
    return '';
};

/**
* 項目幅の合計値を返す
*
* @returns {number}
*/
teasp.Tsf.Fp.prototype.getWidth = function(){
    var w = 0;
    this.fcLoop(function(fc){
        w += fc.getWidthNum();
    }, this);
    return w;
};

/**
* データ検索用の SOQL を返す
*
* @param {string=} filt
* @param {string=} childFilt
* @param {boolean=} notail
* @returns {string}
*/
teasp.Tsf.Fp.prototype.createSoql = function(filt, childFilt, notail){
    var lst = [];
    this.fcLoop(function(fc){
        if(fc.isApiField(true)){
            lst.push(fc.getApiKey());
        }
    }, this, true); // notUse==true の項目も使う
    lst = lst.concat(this.createChildSoqls(childFilt));

    var soql = 'select '
            + lst.join(',')
            + ' from '
            + this.getObjectName()
            + (filt || '');

    if(!notail){
        soql += (this.createOrderBy() || '');
    }
    return soql;
};

/**
 * Order by 句だけ返す
 *
 * @returns {string}
 */
teasp.Tsf.Fp.prototype.createOrderBy = function(){
    var sl = [];
    dojo.forEach(this.getSortKeys(), function(sort){
        sl.push(sort.apiKey + (sort.desc ? ' desc nulls last' : ''));
    }, this);
    if(sl.length > 0){
        sl.push('Id');
        return ' order by ' + sl.join(',');
    }
    return null;
};

/**
 * データ数カウント用のSOQLを返す
 *
 * @param {Object=} filt
 * @param {boolean=} notail
 * @returns {string}
 */
teasp.Tsf.Fp.prototype.createSoqlForCnt = function(filt, notail){
    var soql = 'select Count() from '
            + this.getObjectName()
            + (filt || '');
    if(!notail){
        soql += ' limit ' + teasp.constant.COUNT_LIMIT;
    }
    return soql;
};

teasp.Tsf.Fp.prototype.setChildren = function(children){
    this.fp.children = children;
};

teasp.Tsf.Fp.prototype.getChildren = function(){
    return this.fp.children;
};

teasp.Tsf.Fp.prototype.createChildSoqls = function(filt){
    var children = this.fp.children || {};
    var lst = [];
    for(var key in children){
        if(!children.hasOwnProperty(key)){
            continue;
        }
        var fields = children[key].fields || [];
        var l = [];
        for(var i = 0 ; i < fields.length ; i++){
            var field = fields[i];
            if(field.apiKey){
                l.push(field.apiKey);
            }
        }
        if(l.length > 0){
            lst.push('(select ' + l.join(',') + ' from ' + key + (filt || '') + ')');
        }
    }
    return lst;
};

/**
 * データ検索の条件句を返す
 *
 * @returns {Array.<Object>}
 */
teasp.Tsf.Fp.prototype.getFilts = function(){
    return this.fp.filts || [];
};

teasp.Tsf.Fp.prototype.getChildFilts = function(){
    return this.fp.childFilts || [];
};

teasp.Tsf.Fp.prototype.getSortKeys = function(){
    return this.fp.sortKeys || [];
};

teasp.Tsf.Fp.prototype.setSortKeys = function(o){
    var lst = this.fp.sortKeys || [];
    if(lst.length > 0 && lst[0].apiKey == o.apiKey){
        lst[0].desc = (lst[0].desc ? false : true);
    }else{
        lst.unshift(o);
        for(var i = lst.length - 1 ; i > 0 ; i--){
            if(lst[i].apiKey == o.apiKey){
                lst.splice(i, 1);
                break;
            }
        }
    }
    if(lst.length > 3){
        lst.splice(3);
    }
    this.fp.sortKeys = lst;
};

/**
* 項目幅の合計値を返す
*
* @returns {number}
*/
teasp.Tsf.Fp.prototype.parseValueByDomType = function(dataObj, domType){
    var lst = [];
    this.fcLoop(function(fc){
        if(fc.getDomType() == domType){
            lst.push(fc.parseValue(dataObj));
        }
    }, this);
    return lst;
};

/**
* 項目幅の値を返す
*
* @returns {number}
*/
teasp.Tsf.Fp.prototype.getDispValueByApiKey = function(dataObj, apiKey){
    var fc = this.getFcByApiKey(apiKey);
    if(fc){
        var o = fc.parseValue(dataObj);
        return o.dispValue;
    }
    return null;
};

/**
*
*
* @returns {Object|null}
*/
teasp.Tsf.Fp.prototype.getDefaultFilts = function(){
    var o = {};
    var n = 0;
    var filts = this.getFilts();
    dojo.forEach(filts, function(f){
        if(f.apiKey && f.value){
            var fc = this.getFcByApiKey(f.apiKey);
            if(fc){
                fc.fillValue(o, { value: f.value });
            }
            n++;
        }
    }, this);
    return (n > 0 ? o : null);
};

teasp.Tsf.Fp.prototype.getAreaId            = function(){ return this.fp.areaId;           };
teasp.Tsf.Fp.prototype.getSectionTitles     = function(){ return this.fp.sectionTitles;    };
teasp.Tsf.Fp.prototype.getObjectName        = function(){ return this.fp.objectName;       };
teasp.Tsf.Fp.prototype.getFields            = function(){ return this.fp.fields;           };
teasp.Tsf.Fp.prototype.getDiscernment       = function(){ return this.fp.discernment;      };
teasp.Tsf.Fp.prototype.getRelationshipName  = function(){ return this.fp.relationshipName; };
teasp.Tsf.Fp.prototype.isChild              = function(){ return this.fp.child;            };
teasp.Tsf.Fp.prototype.isVirChild           = function(){ return this.fp.virChild;         };
teasp.Tsf.Fp.prototype.isPiw                = function(){ return this.fp.piw || false;     };
teasp.Tsf.Fp.prototype.getVirMax            = function(){ return this.fp.virMax;           };
teasp.Tsf.Fp.prototype.getRowLimit          = function(){ return this.fp.rowLimit;         };
teasp.Tsf.Fp.prototype.getPageLimit         = function(){ return this.fp.pageLimit;        };
teasp.Tsf.Fp.prototype.getType              = function(){ return this.fp.type;             };
teasp.Tsf.Fp.prototype.getSelType           = function(){ return this.fp.selType;          };
teasp.Tsf.Fp.prototype.isReadOnly           = function(){ return this.fp.readOnly;         };
teasp.Tsf.Fp.prototype.getFoots             = function(){ return this.fp.foots || [];      };
teasp.Tsf.Fp.prototype.getButtons           = function(){ return this.fp.buttons || [];    };
teasp.Tsf.Fp.prototype.isStereoType         = function(){ return this.fp.stereoType || false; };
teasp.Tsf.Fp.prototype.isJobList            = function(){ return this.fp.jobList || false; };
teasp.Tsf.Fp.prototype.isEmpList            = function(){ return this.fp.empList || false; };
teasp.Tsf.Fp.prototype.getSearchFields      = function(){ return this.fp.searchFields || [];  };
teasp.Tsf.Fp.prototype.isSearchCondition    = function(){ return (this.fp.type == 'searchCondition'); };
teasp.Tsf.Fp.prototype.getSubkey            = function(){ return this.subkey || null; };
teasp.Tsf.Fp.prototype.getPayManage         = function(){ return this.fp.payManage || null; };
teasp.Tsf.Fp.prototype.getDock              = function(){ return this.fp.dock || null; };

teasp.Tsf.Fp.prototype.getFormCss = function(){
    return this.fp.formCss + (this.subkey ? this.subkey : '');
};

/**
 * 表示行数を返す
 *
 * @returns {number}
 */
teasp.Tsf.Fp.prototype.getRowDisp = function(){
    return (this.fp.rowDisp || 10);
};

teasp.Tsf.Fp.prototype.setReadOnly = function(flag){
    this.fp.readOnly = flag;
};

/**
 * 検索時の変則キー
 *
 * @returns {string}
 */
teasp.Tsf.Fp.prototype.getIrregularType = function(){
    return this.fp.irregularType || null;
};

/**
 * ユニークな文字列を返す
 *
 * @static
 * @returns {string}
 */
teasp.Tsf.Fp.createHkey = function(){
    return 'R' + (teasp.Tsf.Fp.UNIQ_SEQ++);
};

/**
 * 指定ノードにユニーク文字列を値として持つ hidden タグを追加する
 *
 * @static
 * @param {teasp.Tsf.Dom} domHelper
 * @param {Object} tr 指定ノード
 * @param {string=} hkey ユニーク文字列。省略の場合、自動作成
 * @returns {string}
 */
teasp.Tsf.Fp.setHkey = function(domHelper, tr, hkey){
    var hk = (hkey || teasp.Tsf.Fp.createHkey());
    domHelper.create('input', {
        type        : 'hidden',
        value       : hk,
        className   : teasp.Tsf.HKEY_HOLD_CSS
    }, tr);
    return hk;
};

/**
 * 指定ノードにセットされた hidden タグの値を返す
 *
 * @static
 * @param {Object} tr 指定ノード
 * @returns {string|null}
 */
teasp.Tsf.Fp.getHkey = function(tr){
    var node = teasp.Tsf.Dom.node('.' + teasp.Tsf.HKEY_HOLD_CSS, tr);
    return (node && node.value) || null;
};

/**
 * tbody 下の各 row のユニーク文字列を集めて配列で返す
 *
 * @static
 * @param {Object} tbody
 * @returns {Array.<string>} ユニーク文字列の配列
 */
teasp.Tsf.Fp.getHkeys = function(tbody){
    var lst = [];
    if(tbody){
        for(var i = 0 ; i < tbody.rows.length ; i++){
            var tr = tbody.rows[i];
            lst.push(this.getHkey(tr));
        }
    }
    return lst;
};

/**
 * tbody 下から指定ユニークキーを有する row を見つけて返す
 *
 * @static
 * @param {Object} tbody
 * @param {string} hkey
 * @returns {Object|null}
 */
teasp.Tsf.Fp.getRowByHkey = function(tbody, hkey){
    if(tbody){
        for(var i = 0 ; i < tbody.rows.length ; i++){
            var tr = tbody.rows[i];
            if(teasp.Tsf.Fp.getHkey(tr) == hkey){
                return tr;
            }
        }
    }
    return null;
};

/**
 * 選択リストを作成
 *
 * @param {Array.<Array.<string>>} picks
 * @param {boolean=} flag
 * @returns {Array.<Object>}
 */
teasp.Tsf.Fp.createPickList = function(picks, flag){
    var lst = [];
    if(flag){
        lst.push({ n:teasp.message.getLabel('tk10004480'), v:'' }); // (すべて)
    }
    dojo.forEach(picks, function(p){
        this.push({ n:p[0], v:p[1] });
    }, lst);
    return lst;
};
