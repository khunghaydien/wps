/**
 * 定期区間申請用コメント入力ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ApplyCommentCommuterPass = function(){
    this.params = null;
};

teasp.Tsf.ApplyCommentCommuterPass.prototype = new teasp.Tsf.ApplyComment();

teasp.Tsf.ApplyCommentCommuterPass.prototype.show = function(obj, callback){
    teasp.Tsf.ApplyComment.prototype.show.call(this, obj, callback);

    if(obj.noComment){ // コメント入力なし
        teasp.Tsf.Dom.show('div.ts-dialog-comment', this.getArea(), false);
        var node = teasp.Tsf.Dom.node('div.ts-dialog-title', this.getArea());
        node.innerHTML = teasp.message.getLabel('tf10001620'); // 定期区間申請を取り消します。
        node.style.width = '300px';
        node.style.height = '50px';
        node.style.padding = '5px 20px';
    }
};

teasp.Tsf.ApplyCommentCommuterPass.prototype.cancelApply = function(comment){
    var req = {
        method  : 'cancelCommuterPass',
        id      : this.orgData.id,
        empId   : this.orgData.empId,
        comment : comment
    };
    tsfManager.submitCommuterPass(req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            this.hide();
            if(this.params.parentHide){
                this.params.parentHide();
            }
            this.callback(result);
        }else{
            this.showError(result);
        }
    }));
};
