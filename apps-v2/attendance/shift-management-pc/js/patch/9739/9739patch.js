if(typeof(teasp) == 'object' && !teasp.resolved['DLW'] && teasp.data && teasp.data.Pouch){
var cleaned = {
'a0c0I000008wBaOQAU':1,
'a0c0I000008wBdYQAU':1,
'a0c0I000008wBfFQAU':1,
'a0c0I000008wBfUQAU':1,
'a0c0I000008wBfyQAE':1,
'a0c0I000008wBg3QAE':1,
'a0c0I000008wBg8QAE':1,
'a0c0I000008xR0kQAE':1,
'a0c0I000008xxc7QAA':1,
'a0c0I000008ypRkQAI':1,
'a0c0I000008ypRuQAI':1,
'a0c0I000008gmA5QAI':1,
'a0c0I000008gTdwQAE':1,
'a0c0I000008gTeBQAU':1,
'a0c0I000008gUzRQAU':1,
'a0c0I000008hCfWQAU':1,
'a0c0I000008hmpEQAQ':1,
'a0c0I000008hoEbQAI':1,
'a0c0I000008i2HvQAI':1,
'a0c0I000008iCDsQAM':1,
'a0c0I000008iFJIQA2':1,
'a0c0I000008vzIzQAI':1,
'a0c0I000008vzJ0QAI':1,
'a0c0I000008vzJ1QAI':1,
'a0c0I000008vzJWQAY':1,
'a0c0I000008vzK0QAI':1,
'a0c0I000008vzKgQAI':1,
'a0c0I000008vzLEQAY':1,
'a0c0I000008vzLGQAY':1,
'a0c0I000008vzRxQAI':1,
'a0c0I000008vzRyQAI':1,
'a0c0I000008wBbqQAE':1,
'a0c0I000008wBegQAE':1,
'a0c0I000008wBelQAE':1,
'a0c0I000008wBeqQAE':1,
'a0c0I000008wI2oQAE':1,
'a0c0I000008wI2UQAU':1,
'a0c0I000008wQ3jQAE':1,
'a0c0I000008wQ3oQAE':1,
'a0c0I000008wQ3tQAE':1,
'a0c0I000008wRmmQAE':1,
'a0c0I000008wXgRQAU':1,
'a0c0I000008wzWLQAY':1,
'a0c0I000008xKMsQAM':1,
'a0c0I000008yYpcQAE':1,
'a0c0I00000A2BTMQA3':1
};
var invisible = {
'a0c0I00000ARjZ7QAL':1,
'a0c0I00000ARjZ8QAL':1,
'a0c0I00000ARjZ9QAL':1,
'a0c0I00000ARjZAQA1':1,
'a0c0I00000ARjZBQA1':1,
'a0c0I00000ARjZCQA1':1,
'a0c0I00000ARjZDQA1':1
};
teasp.data.Pouch.getDaiqZan = function(stocks, td, sd, ed, isOldDate, histAll){
	var obj = teasp.data.Pouch.getStockZan(stocks, teasp.constant.STOCK_DAIQ, td, sd, ed, isOldDate, histAll);
	var history = obj.history || [];
	for(var i = 0 ; i < history.length ; i++){
		var h = history[i];
		var pairIds = h.pairIds || [];
		for(var j = 0 ; j < pairIds.length ; j++){
			if(cleaned[pairIds[j]]){
				h.subject = '精算対象の為マイナス付与';
				h.status += ' 精算対象の為マイナス';
			}
		}
	}
	for(var i = history.length - 1 ; i >= 0 ; i--){
		var h = history[i];
		if(invisible[h.stockId]){
			history.splice(i, 1);
			continue;
		}
		var pairIds = h.pairIds || [];
		for(var j = 0 ; j < pairIds.length ; j++){
			if(invisible[pairIds[j]]){
				history.splice(i, 1);
				break;
			}
		}
	}
	return obj;
};
}