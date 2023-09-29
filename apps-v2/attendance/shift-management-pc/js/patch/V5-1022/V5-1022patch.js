if(typeof(teasp) == 'object' && !teasp.resolved['V5-1022'] && location.pathname.indexOf('AtkManageView') > 0){
	var init0 = init;
	var init = function(){
		init0();
		dojo.style('tk10000859', 'display', 'none');
		dojo.style('2tk10000191', 'display', 'none');
		dojo.style('2tk10000192', 'display', 'none');
		dojo.style('2tk10000193', 'display', 'none');
		dojo.style('flexibleView', 'display', 'none');
	};
}
