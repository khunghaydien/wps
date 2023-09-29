/**
 * IC交通費読込ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ExternalExpense = function(){
    this.notOpenLink = true;
};

teasp.Tsf.ExternalExpense.prototype = new teasp.Tsf.SearchList();

teasp.Tsf.ExternalExpense.prototype.show = function(obj, callback){
    this.option['deleteExtExp'] = teasp.Tsf.Dom.hitch(this, this.deleteExtExp);

    teasp.Tsf.SearchList.prototype.show.call(this, obj, callback);
};

teasp.Tsf.ExternalExpense.prototype.getButtons = function(e){
    return [
        { key:'extExpImport'  , label:teasp.message.getLabel('tf10002260') , css:'ts-dialog-ok'    }, // 読み込み
        { key:'deleteExtExp'  , label:teasp.message.getLabel('tf10005040') , css:'ts-cancel-apply' }, // 削 除
        { key:'close'         , label:teasp.message.getLabel('cancel_btn_title') } // キャンセル
    ];
};

/**
 * IC交通費の削除
 *
 */
teasp.Tsf.ExternalExpense.prototype.deleteExtExp = function(){
    var records = this.collectRecords();
    if(records.length <= 0){
        this.showError(teasp.message.getLabel('tf10005060')); // 削除対象を選択してください
        return;
    }
    var ids = [];
    dojo.forEach(records, function(record){
        ids.push(record.Id);
    });
    if(!ids.length){
        return;
    }
    teasp.tsConfirm(teasp.message.getLabel('pit10001080'),this,function(result){// 選択されたデータを削除してよろしいですか？
        if(result){
            tsfManager.actionExternal({
                action      : 'remove',
                empId       : tsfManager.getEmpId(),
                externalIds : ids
            }, teasp.Tsf.Dom.hitch(this, function(succeed, result){
                if(succeed){
                    this.orgData.statusNums = result.statusNums;
                    this.search(); // 再検索
                }else{
                    this.showError(result);
                }
            }));
        }
    });
};
