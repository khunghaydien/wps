teasp.data.WorkLocation = function(obj){
    this.obj = obj;
    this.initFlag = false;
};
teasp.data.WorkLocation.prototype.getId = function(){
    return this.obj.Id;
};
teasp.data.WorkLocation.prototype.getName = function(){
    return this.obj.Name;
};
teasp.data.WorkLocation.prototype.isRemoved = function(){
    return this.obj.Removed__c || false;
};
teasp.data.WorkLocation.prototype.setInitFlag = function(flag){
    this.initFlag = flag;
};
teasp.data.WorkLocation.prototype.isInitFlag = function(){
    return this.initFlag;
};
