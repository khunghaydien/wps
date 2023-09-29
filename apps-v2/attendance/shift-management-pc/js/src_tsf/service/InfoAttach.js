/**
 * 添付ファイルのサービスクラス
 *
 * @constructor
 */
teasp.Tsf.InfoAttach = function(){
};

teasp.Tsf.InfoAttach.prototype = new teasp.Tsf.InfoBase();

teasp.Tsf.InfoAttach.prototype.init = function(res){
    teasp.Tsf.InfoBase.prototype.init.call(this, res);

    this.attachments = teasp.Tsf.Attachment.createList(res.attachments);
};

teasp.Tsf.InfoAttach.prototype.getAttachments = function(){
    return this.attachments;
};
