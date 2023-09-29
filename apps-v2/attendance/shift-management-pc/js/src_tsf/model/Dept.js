/**
 * オブジェクト・セクションクラス
 *
 * @constructor
 */
teasp.Tsf.Dept = function(dept){
    this.dept = dept;
};

/**
 * 部署情報に階層情報を付与してから
 * 部署クラスインスタンスの配列を作成して返す
 *
 * @param {Array.<Object>} depts
 * @returns {Array.<Object>}
 */
teasp.Tsf.Dept.createList = function(depts){
    for(var i = 0 ; i < depts.length ; i++){
        depts[i].DeptCode__c = (depts[i].DeptCode__c || depts[i].code || '');
        depts[i].order = 0;
    }
    depts = depts.sort(function(a, b){
        return (a.DeptCode__c < b.DeptCode__c ? -1 : (a.DeptCode__c > b.DeptCode__c ? 1 : 0));
    });
    var parents = {};
    var setDeptLevel = function(depts, parent, oo){
        var parentId = (parent ? parent.Id : null);
        for(var i = 0 ; i < depts.length ; i++){
            var dept = depts[i];
            if(dept.ParentId__c == parentId){
                if(parent){
                    parent.parentFlag = true;
                    dept.parentMap = (parent.parentMap ? teasp.Tsf.Dom.clone(parent.parentMap) : {});
                    dept.parentMap[parent.Id] = parent.level;
                    parents[parentId] = parent;
                }
                dept.level = (parent ? parent.level + 1 : 1);
                var spc = '';
                for(var j = 1 ; j < dept.level ; j++){
                    spc += '&nbsp;&nbsp;';
                }
                dept.displayName = spc + dept.DeptCode__c + '-' + dept.Name;
                dept.order = oo.order++;
                setDeptLevel(depts, dept, oo);
            }
        }
    };
    setDeptLevel(depts, null, { order: 1 });
    depts = depts.sort(function(a, b){
        return a.order - b.order;
    });
    var lst = [];
    dojo.forEach(depts, function(dept){
        if(!dept.ParentId__c || parents[dept.ParentId__c]){
            this.push(new teasp.Tsf.Dept(dept));
        }
    }, lst);
    return lst;
};

teasp.Tsf.Dept.getUnderDeptIds = function(depts, deptId){
    var collectDepts = function(depts, parentId, lst){
        for(var i = 0 ; i < depts.length ; i++){
            var dept = depts[i];
            if(dept.getParentId() == parentId){
                lst.push(dept.getId());
                collectDepts(depts, dept.getId(), lst);
            }
        }
    };
    var lst = [deptId];
    collectDepts(depts, deptId, lst);
    return lst;
};

/**
 * 部署IDを返す
 *
 * @returns {string}
 */
teasp.Tsf.Dept.prototype.getId = function(){
    return this.dept.Id || null;
};

teasp.Tsf.Dept.prototype.getParentId = function(){
    return this.dept.ParentId__c || null;
};

/**
 * 部署名を返す
 *
 * @returns {string}
 */
teasp.Tsf.Dept.prototype.getName = function(){
    return /** @type {string} */this.dept.Name || '';
};

/**
 * 階層でインデントした部署名を返す
 *
 * @returns {string}
 */
teasp.Tsf.Dept.prototype.getDisplayName = function(){
    return /** @type {string} */this.dept.displayName || '';
};

/**
 * 部署オブジェクト
 *
 * @returns {Object}
 */
teasp.Tsf.Dept.prototype.getObj = function(){
    return this.dept;
};
