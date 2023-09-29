if(typeof(teasp) == 'object' && !teasp.resolved['9468'] && location.href.indexOf('AtkExpImageView') > 0){
var init0 = init;
var init = function() {
    init0();
    var imageObj = dojo.byId('imageObj');
    if(imageObj){
        var path = imageObj.src;
        if(path.indexOf('visualforce.com') > 0){
            imageObj.src = path.replace(/--.*visualforce.com/, '--c.documentforce.com');
        }else if(path.indexOf('salesforce.com') > 0){
            imageObj.src = path.replace(/salesforce.com/, 'content.force.com');
        }
    }
    dojo.query('a', dojo.byId('imageArea')).forEach(function(el){
        var path = el.href;
        if(path.indexOf('visualforce.com') > 0){
            el.href = path.replace(/--.*visualforce.com/, '--c.documentforce.com');
        }else if(path.indexOf('salesforce.com') > 0){
            el.href = path.replace(/salesforce.com/, 'content.force.com');
        }
    });
}
}
