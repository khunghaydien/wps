if(typeof(teasp) == 'object' && !teasp.resolved['V5-1578'] && location.pathname.indexOf('AtkHolidayView') > 0){
var createYuqRemain = function(yuqList){
	// 説明の追加
	dojo.byId('holiday_title2').innerHTML += " <span style='margin-left:16px;'>10日以上付与者は本年中に5日取得してください</span>";
	// ヘッダから失効日、付与日を削除
	var div1 = dojo.byId('yuqLimitDate_head');
	if(div1){ dojo.destroy(teasp.util.getAncestorByTagName(div1, 'TD')); }
	var div2 = dojo.byId('yuqProvideDate_head');
	if(div2){ dojo.destroy(teasp.util.getAncestorByTagName(div2, 'TD')); }

	var row, cell, r;
	var tbody = dojo.byId('yuqTable').getElementsByTagName('tbody')[0];
	dojo.empty(tbody);
	for(r = 0 ; r < yuqList.size() ; r++){
		var yuqInfo = yuqList.getByIndex(r);
		if(yuqInfo.getProvide() == '0:00') continue; //付与日数は0の場合、表示しない

		row = dojo.create('tr', { className: ((r%2)==0 ? 'even' : 'odd') }, tbody);
		var remain = yuqInfo.getRemain();
		if(remain == '0:00') remain = teasp.message.getLabel('tm10010480',0);

		dojo.create('div', { innerHTML: yuqInfo.getStartDate(DATE_FORM_SLASH) }, dojo.create('td', null, row));
//		dojo.create('div', { innerHTML: yuqInfo.getLimitDate(DATE_FORM_SLASH) }, dojo.create('td', null, row));
//		dojo.create('div', { innerHTML: yuqInfo.getDate(DATE_FORM_SLASH)		}, dojo.create('td', null, row));
		dojo.create('div', { innerHTML: yuqInfo.getProvide()				  }, dojo.create('td', null, row));
		dojo.create('div', { innerHTML: yuqInfo.getSpend()					  }, dojo.create('td', null, row));
		dojo.create('div', { innerHTML: remain								 }, dojo.create('td', null, row));
		dojo.create('div', { innerHTML: yuqInfo.getSubject()			 }, dojo.create('td', { style:'text-align:left;' }, row));
	}
	row = dojo.create('tr', { style : 'height:2px;background-color:white;border-top:1px solid #A0A1A7;border-bottom:1px solid #A0A1A7;' }, tbody);
	dojo.create('td', { colSpan : 7 }, row);
	row = dojo.create('tr', null, tbody);
	dojo.create('div', { innerHTML: teasp.message.getLabel('total_label')}, dojo.create('td', null, row));
//  dojo.create('div', { innerHTML: ''				   }, dojo.create('td', null, row));
//  dojo.create('div', { innerHTML: ''				   }, dojo.create('td', null, row));
	dojo.create('div', { innerHTML: yuqList.getProvide(true) }, dojo.create('td', null, row));
	dojo.create('div', { innerHTML: yuqList.getSpend(true)	 }, dojo.create('td', null, row));
	dojo.create('div', { innerHTML: yuqList.getRemain()  }, dojo.create('td', null, row));
	dojo.create('div', { innerHTML: ''					 }, dojo.create('td', { className:'remarks' }, row));
};
}
