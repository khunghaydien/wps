/**
 * 振込元
 * @typedef {Object} ZGAccount.account
 * @property {string} Id
 * @property {string} Name
 * @property {string} ZGCompanyCode__c
 * @property {string} ZGSenderAccountNo__c
 * @property {string} ZGSenderAccountType__c
 * @property {string} ZGSenderBankCode__c
 * @property {string} ZGSenderBankName__c
 * @property {string} ZGSenderBranchCode__c
 * @property {string} ZGSenderBranchName__c
 * @property {string} ZGSenderName__c
 */

/**
 * 全銀口座マスター情報
 *
 * @constructor
 */
teasp.Tsf.ZGAccount = function(account){
    this.account = account;
};

/**
 * 配列を作成
 *
 * @param {Array.<Object>} ForeignCurrencys
 * @returns {Array.<ZGAccount.account>}
 */
teasp.Tsf.ZGAccount.createList = function(accounts){
    var lst = [];
    dojo.forEach(accounts, function(account){
        this.push(new teasp.Tsf.ZGAccount(account));
    }, lst);
    return lst;
};

/**
 *
 * @returns {string}
 */
teasp.Tsf.ZGAccount.prototype.getId = function(){
    return this.account.Id || '';
};

/**
 *
 * @returns {string}
 */
teasp.Tsf.ZGAccount.prototype.getName = function(){
    return /** @type {string} */this.account.Name || '---';
};
