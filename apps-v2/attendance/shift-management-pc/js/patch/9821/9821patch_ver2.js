if(typeof(teasp) == 'object' && !teasp.resolved['9821'] && teasp.dialog){
teasp.dialog.InputTime.prototype.ready0 = teasp.dialog.InputTime.prototype.ready;
teasp.dialog.InputTime.prototype.ready = function(){
	this.zenNum = ['１','２','３','４','５','６','７','８','９','１０','１１','１２','１３','１４','１５','１６','１７','１８','１９','２０','２１','２２','２３','２４','２５','２６','２７','２８','２９','３０'];
	this.restMax = 15;
	this.ready0();
};
teasp.dialog.EmpApply.prototype.getRestMax = function(){
	return 15;
};
}