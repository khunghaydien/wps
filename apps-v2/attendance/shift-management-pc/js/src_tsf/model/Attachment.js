/**
 * 添付ファイル情報
 *
 * @constructor
 */
teasp.Tsf.Attachment = function(attachment){
    this.attachment = attachment;
};

/**
 * 配列を作成
 *
 * @param {Array.<Object>} ForeignCurrencys
 * @returns {Array.<Object>}
 */
teasp.Tsf.Attachment.createList = function(attachments){
    var lst = [];
    dojo.forEach(attachments, function(attachment){
        this.push(new teasp.Tsf.Attachment(attachment));
    }, lst);
    return lst;
};

/**
 *
 * @returns {string}
 */
teasp.Tsf.Attachment.prototype.getId = function(){
    return this.attachment.Id || '';
};

/**
 *
 * @returns {string}
 */
teasp.Tsf.Attachment.prototype.getName = function(){
    return /** @type {string} */this.attachment.Name || '---';
};

teasp.Tsf.Attachment.prototype.isImage = function(){
    if(/^image/i.test(this.attachment.ContentType)){
        return true;
    }
    return false;
};
