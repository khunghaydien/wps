/**
 * オブジェクト・セクションクラス
 *
 * @constructor
 */
teasp.Tsf.User = function(user){
    this.user = (user && user.length ? user[0] : (user || {}));
};

/**
 * ユーザIDを返す
 *
 * @returns {string}
 */
teasp.Tsf.User.prototype.getId = function(){
    return this.user.Id;
};

/**
 * 名前を返す
 *
 * @returns {string}
 */
teasp.Tsf.User.prototype.getName = function(){
    return this.user.Name || '';
};

/**
 * システム管理者
 *
 * @returns {boolean}
 */
teasp.Tsf.User.prototype.isSysAdmin = function(){
    return this.user.Profile.PermissionsModifyAllData || false;
};
