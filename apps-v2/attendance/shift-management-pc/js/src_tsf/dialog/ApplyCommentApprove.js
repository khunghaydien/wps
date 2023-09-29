/**
 * 承認／却下用コメント入力ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ApplyCommentApprove = function(){
    this.params = null;
};

teasp.Tsf.ApplyCommentApprove.prototype = new teasp.Tsf.ApplyComment();

teasp.Tsf.ApplyCommentApprove.prototype.approveApply = function(comment){
    tsfManager.approveApply({ comment: comment }, true, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            this.hide();
            this.callback(result);
        }else{
            this.showError(result);
        }
    }));
};

teasp.Tsf.ApplyCommentApprove.prototype.rejectApply = function(comment){
    tsfManager.approveApply({ comment: comment }, false, teasp.Tsf.Dom.hitch(this, function(succeed, result){
        if(succeed){
            this.hide();
            this.callback(result);
        }else{
            this.showError(result);
        }
    }));
};
