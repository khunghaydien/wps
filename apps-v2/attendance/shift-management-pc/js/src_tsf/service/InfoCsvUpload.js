/**
 * CSVインポートのサービスクラス
 *
 * @constructor
 */
teasp.Tsf.InfoCsvUpload = function(){
};

teasp.Tsf.InfoCsvUpload.prototype = new teasp.Tsf.InfoExpApply();

teasp.Tsf.InfoCsvUpload.prototype.init = function(res){
    teasp.Tsf.InfoBase.prototype.init.call(this, res);

    this.attachments = teasp.Tsf.Attachment.createList(res.attachments);
};

teasp.Tsf.InfoCsvUpload.prototype.getAttachments = function(){
    return this.attachments;
};

teasp.Tsf.InfoCsvUpload.prototype.getStartView = function(){
    return teasp.Tsf.Manager.CSV_UPLOAD;
};
