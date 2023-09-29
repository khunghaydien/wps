if(typeof(teasp) == 'object'){
if(teasp.view){
    if(teasp.view.Monthly)
        teasp.view.Monthly.prototype.openEmpView = function(){};
    if(teasp.view.Daily)
        teasp.view.Daily.prototype.openEmpView = function(){};
}
}