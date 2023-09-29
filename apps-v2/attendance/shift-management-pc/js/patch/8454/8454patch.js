if(typeof(teasp) == 'object' && !teasp.resolved['8454'] && teasp.data && teasp.data.Pouch){
teasp.data.Pouch.prototype.getStandardRange = function(obj){
	var c = this.getObj().config;
	teasp.message.labels['tm10003142'] = 'フレックス時間帯内の時間を設定してください';
	return { from: (c.flexStartTime || 0), to: (c.flexEndTime || (24 * 60)) };
}
}
