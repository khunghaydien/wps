if(typeof(teasp)=='object' && !teasp.resolved['FUJITV2'] && teasp.view && teasp.view.Monthly){
teasp.view.Monthly.prototype.refreshContents0 = teasp.view.Monthly.prototype.refreshContents;
teasp.view.Monthly.prototype.refreshContents = function(){
	this.refreshContents0();
	dojo.query('div.pp_exclamation', dojo.byId('mainTableBody')).forEach(function(el){
		this.replaceMark(el);
	}, this);
};
teasp.view.Monthly.prototype.replaceMark = function(el){
	dojo.toggleClass(el, 'pp_exclamation', false);
	var tr = teasp.util.getAncestorByTagName(el, 'TR');
	var m = /^dateRow(.+)$/.exec(tr.id);
	if(!m){
		return;
	}
	console.log(m[1]);
	var dayWrap = this.pouch.getEmpDay(m[1]);
	if(!dayWrap){
		return;
	}
	dojo.query('td.vstatus > div', tr).forEach(function(el){
		el.className = 'wt-f07';
		el.title = teasp.message.getLabel('tm10002130');
	}, this);
};
}