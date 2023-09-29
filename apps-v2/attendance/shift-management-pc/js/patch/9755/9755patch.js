if(typeof(teasp) == 'object' && !teasp.resolved['MBJS2'] && teasp.dialog && teasp.dialog.EmpApply){
teasp.dialog.EmpApply.prototype.drawLast=function(applyObj,node){dojo.query('div.empApply2Div',node).forEach(function(el){if(/^dialogApplyZangyoRow\d$/.test(el.id)||/^dialogApplyEarlyStartRow\d$/.test(el.id)){dojo.style(el,'display','none');}},this);};
}
