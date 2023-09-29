if(typeof(teasp) == 'object' && !teasp.resolved['SEMBA'] && teasp.data && teasp.data.Pouch){
teasp.data.Pouch.prototype.getUseEarlyWorkFlag = function(){
  if(this.getObj().config.workSystem != teasp.constant.WORK_SYSTEM_FLEX){
    return false;
  }
  return this.getObj().config.useEarlyWorkFlag;
};
}
