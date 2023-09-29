if(location.pathname.indexOf('AtkManageView') > 0 && typeof(setTsLink) == 'function' && !teasp.resolved['MBJS5']){
var setTsLink = function(){
	dojo.prop('tsPotalLinkHref', 'href', 'https://www.teamspirit.co.jp/TSCircleLogin');

	var td = dojo.create('td', null, dojo.create('tr', null, dojo.byId('tk10000865').parentNode.parentNode, 'after'));
	dojo.create('a', {
		href:"/apex/teamspirit__AtkConfigEditView?support=full#!absorber",
		className:'system_menu',
		innerHTML:'・【システム】出向者休暇読込'
	}, td);
};
}
