teasp.provide('teasp.hrm.HrmNaviManager');

/**
 * 諸届ナビ関連オブジェクトの管理クラス
 *
 * @constructor
 *
 */
teasp.hrm.HrmNaviManager = function(res){
	var obj = res;
	this.groups = [];
	for(var i = 0 ; i < obj.length ; i++){
		var groupObj = obj[i];
		this.groups.push(new teasp.hrm.HrmNaviGroup(this, groupObj));
	}
};

teasp.hrm.HrmNaviManager.prototype.getGroups = function(){ return this.groups; };

teasp.hrm.HrmNaviManager.prototype.getGroupById = function(groupId){
	for(var i = 0 ; i < this.groups.length ; i++){
		var group = this.groups[i];
		if(group.getId() === groupId){
			return group;
		}
	}
	return null;
};

teasp.hrm.HrmNaviManager.prototype.isSingleGroup = function(){ return this.groups.length === 1 };