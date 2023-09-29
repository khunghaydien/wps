if(typeof(teasp) == 'object' && !teasp.resolved['8989'] && teasp.data && teasp.data.Pouch){
teasp.data.Pouch.prototype.isNonDialogMode = function(){
	try{
		if(this.dataObj.nonDialogMode === undefined){
			if(!this.dataObj.common.nonDialogKey){
				this.dataObj.nonDialogMode = false;
			}else if(/iPad/.test(navigator.userAgent)){
				this.dataObj.nonDialogMode = true;
			}else{
				var regex = new RegExp(this.dataObj.common.nonDialogKey, 'i');
				this.dataObj.nonDialogMode = regex.test(navigator.userAgent);
			}
		}
	}catch(e){}
	return (this.dataObj.nonDialogMode || false);
};
}
