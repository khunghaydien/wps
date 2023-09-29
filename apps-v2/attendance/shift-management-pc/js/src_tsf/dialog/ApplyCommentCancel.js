/**
 * 申請取消用コメント入力ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ApplyCommentCancel = function(){
    this.params = null;
};

teasp.Tsf.ApplyCommentCancel.prototype = new teasp.Tsf.ApplyComment();

teasp.Tsf.ApplyCommentCancel.prototype.show = function(obj, callback){
    teasp.Tsf.ApplyComment.prototype.show.call(this, obj, callback);

    if(obj.noComment){ // コメント入力なし
        teasp.Tsf.Dom.show('div.ts-dialog-comment', this.getArea(), false);
        var node = teasp.Tsf.Dom.node('div.ts-dialog-title', this.getArea());
        node.innerHTML = (obj.warning || '');
        node.style.width = '350px';
        node.style.height = '60px';
        node.style.padding = '5px 20px';
    }
};

teasp.Tsf.ApplyCommentCancel.prototype.cancelApply = function(comment){
    var req = {
        solve   : this.orgData.solve,
        comment : comment
    };
    tsfManager.cancelApply(req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
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
