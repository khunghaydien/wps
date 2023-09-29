/**
 * ジョブ検索ダイアログ
 *
 * @constructor
 */
teasp.Tsf.JobList = function(){
};

teasp.Tsf.JobList.prototype = new teasp.Tsf.SearchList();

teasp.Tsf.JobList.prototype.show = function(obj, callback){
    if(obj && obj.values && obj.values.DeptId__c == null){
        obj.values.DeptId__c = '-1'; // 部署なしの場合、検索条件の主担当部署の初期値が「（部署未設定のジョブ）」になるようにする
    }
    teasp.Tsf.SearchList.prototype.show.call(this, obj, callback);
};

teasp.Tsf.JobList.prototype.setSearchContent = function(areaEl){
    teasp.Tsf.SearchList.prototype.setSearchContent.call(this, areaEl);

    var select = teasp.Tsf.Dom.node('select.ts-form-select', areaEl);
    if(select){
        this.loadDeptSelect(select);
    }

    teasp.Tsf.Dom.style(teasp.Tsf.Dom.node('div.ts-section-form > div.ts-form-row', areaEl), 'margin-bottom', '0px');
};

/**
 * 部署選択リストの候補をセット
 * @param {Object} select
 */
teasp.Tsf.JobList.prototype.loadDeptSelect = function(select){
    var depts = tsfManager.getDepts();
    var deptVal = null;
    teasp.Tsf.Dom.empty(select);
    this.getDomHelper().create('option', { value: ''  , innerHTML: teasp.message.getLabel('tk10000344') }, select); // （すべて）
    this.getDomHelper().create('option', { value: '-1', innerHTML: teasp.message.getLabel('tk10000807') }, select); // （部署未設定のジョブ）
    var f = false;
    for(var i = 0 ; i < depts.length ; i++){
        this.getDomHelper().create('option', { value: (depts[i].getId() || ''), innerHTML: depts[i].getDisplayName() }, select);
        if(depts[i].getId() == deptVal){
            f = true;
        }
    }
    select.value = ((f || deptVal == '-1') ? deptVal : '');
};
