if(getExtraMenu){
    var getExtraMenu0 = getExtraMenu;
    getExtraMenu = function(){
        getExtraMenu0();
        dojo.byId('tsPotalLinkHref').style.display = 'none';
        dojo.byId('tsPotalLinkHref').parentNode.innerHTML = '&nbsp;';
    };
}
