// 日付一括変換
if(typeof(teasp) == 'object' && !teasp.resolved['DISCO2'] && teasp.Tsf && teasp.Tsf.SectionDetail){
//--------------------------------------------------------------
// 明細エリア
teasp.Tsf.SectionDetail.prototype.createTableArea = function(plus){
	var res = teasp.Tsf.SectionBase.prototype.createTableArea.call(this, plus);
	console.log('createTableArea');
	if(this.parent.fp.getAreaId() != 'expApplyFormT'){ // タイムレポート以外
		for(var i = 0 ; i < res.length ; i++){
			var els = dojo.query('tr.ts-table-bottom', res[i]);
			if(els.length){
				var trs = dojo.query('table tr', els[0]);
				if(trs.length){
					this.insertDateChangeButton(trs[0]);
					break;
				}
				break;
			}
		}
	}
	return res;
};
teasp.Tsf.SectionDetail.prototype.insertDateChangeButton = function(tr){
	var btn6 = this.getDomHelper().create('button', { className:'png-edit' , title:'日付変換', style:'margin:auto;cursor:pointer;' },
		this.getDomHelper().create('div', null, this.getDomHelper().create('td', null, tr)));
	this.getDomHelper().connect(btn6, 'onclick', this, this.dateChange);
	if(this.isPre()){
		var idos = dojo.query('button.png-ido', tr);
		if(idos.length){
			var td = teasp.Tsf.Dom.getAncestorByTagName(idos[0], 'TD');
			if(td){
				dojo.style(td, 'display', 'none');
			}
		}
	}
};
teasp.Tsf.SectionDetail.prototype.dateChange = function(e){
	var indexes = this.getCheckedRowIndexes();
	if(indexes.length <= 0){
		return;
	}
	var exps = [];
	var tbody = this.getTbody();
	for(var i = 0 ; i < indexes.length ; i++){
		var index = indexes[i];
		var tr = tbody.rows[index];
		var o = this.getChildValues(teasp.Tsf.Fp.getHkey(tr), tbody);
		console.log(o);
		var expItem = tsfManager.getExpItemById(o.ExpItemId__c);
		console.log(expItem);
		exps.push({
			index: index,
			values: o
		});
	}
	tsfManager.showDialog('DateChangeInBulk', {
		title	: '日付変更',
		message : '選択された明細の日付を一括変換します。',
		option	: null,
		exps	: exps
	}, teasp.Tsf.Dom.hitch(this, function(exps, dt){
		this.changeDateValue(exps, dt);
	}));
};
teasp.Tsf.SectionDetail.prototype.changeDateValue = function(exps, dt){
	var tbody = this.getTbody();
	for(var i = 0 ; i < exps.length ; i++){
		var exp = exps[i];
		var o = exp.values;
		if(o.Date__c != dt){
			o.Date__c = dt;
			if(o.TransportType__c == '1'){
				o.TransportType__c = '2';
			}
		}
		var tr = tbody.rows[exp.index];
		this.entryDetail({
			hkey: teasp.Tsf.Fp.getHkey(tr),
			values: exp.values
		});
	}
};

//--------------------------------------------------------------
/**
 * 日付入力ダイアログ
 */
teasp.Tsf.DateChangeInBulk = function(){};
teasp.Tsf.DateChangeInBulk.prototype.show = function(obj, callback){
	teasp.Tsf.Error.showError();
	this.domHelper = new teasp.Tsf.Dom();
	this.exps = obj.exps;

	this.dialog = new dijit.Dialog({
		title		: obj.title || '',
		className	: ''
	});
	this.dialog.attr('content', this.getContent(obj));
	this.dialog.startup();
	this.domHelper.connect(this.dialog, 'onCancel', this, function(){ this.hide(); });

	this.callback = callback;
	this.showData(obj);
};
teasp.Tsf.DateChangeInBulk.prototype.showData = function(obj){
	this.dialog.show();
};
teasp.Tsf.DateChangeInBulk.prototype.getDomHelper = function(){
	return this.domHelper;
};
teasp.Tsf.DateChangeInBulk.prototype.getFormEl = function(){
	return teasp.Tsf.Dom.node('.ts-section-form', teasp.Tsf.Dom.byId(this.dialog.id));
};
teasp.Tsf.DateChangeInBulk.prototype.hide = function(){
	if(this.dialog){
		this.dialog.hide();
		this.domHelper.free();
		this.dialog.destroy();
		tsfManager.removeDialog('DateChangeInBulk');
	}
};
teasp.Tsf.DateChangeInBulk.prototype.getContent = function(obj){
	var areaEl = this.getDomHelper().create('div', { className: 'ts-dialog', style:'max-width:280px;' });
	this.getDomHelper().create('div', null
			, this.getDomHelper().create('div', { className: 'ts-error-area', style: 'display:none;' }, areaEl));

	var formEl = this.getDomHelper().create('div', { className: 'ts-section-form' }, areaEl);
	this.getDomHelper().create('div', { innerHTML: obj.message, className: 'ts-message' }, formEl);

	var area  = this.getDomHelper().create('div', { style:'margin-top:8px;text-align:center;' }, formEl);
	var div1  = this.getDomHelper().create('div', { style:'display:inline-block;vertical-align:middle;' }, area)
	var div2  = this.getDomHelper().create('div', { style:'display:inline-block;vertical-align:middle;margin-left:4px;' }, area)
	var input = this.getDomHelper().create('input', { type:'text', name:'dateChangeBulk', style:'width:100px;text-align:center;' }, div1);
	var cal   = this.getDomHelper().create('button', { className: 'ts-form-cal', name:'dateChangeBulk' }, div2);

	tsfManager.eventOpenCalendar(this.getDomHelper(), cal, area, { tagName:'dateChangeBulk', isDisabledDate:function(d){ return false; } });

	var warnArea = this.getDomHelper().create('div', { className: 'my-warning-area', style:'display:none;margin-top:8px;' }, areaEl);
	this.getDomHelper().create('div', { style:'font-size:90%;' }, warnArea);
	this.setWarningArea(warnArea);

	this.createButtons(areaEl);
	return areaEl;
};
teasp.Tsf.DateChangeInBulk.prototype.createButtons = function(areaEl){
	var area = this.getDomHelper().create('div', { className: 'ts-dialog-buttons' }, areaEl);
	var div  = this.getDomHelper().create('div', null, area);

	var okbtn  = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('ok_btn_title')	  , 'ts-dialog-ok'	  , div);
	var canbtn = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('cancel_btn_title'), 'ts-dialog-cancel', div);

	this.getDomHelper().connect(okbtn , 'onclick', this, this.ok);
	this.getDomHelper().connect(canbtn, 'onclick', this, this.hide);
};
teasp.Tsf.DateChangeInBulk.prototype.setWarningArea = function(area){
	var cardCnt = 0;
	var ekitanCnt = 0;
	var foreignCnt = 0;
	for(var i = 0 ; i < this.exps.length ; i++){
		var exp = this.exps[i];
		var o = exp.values;
		var expItem = tsfManager.getExpItemById(o.ExpItemId__c);
		if(o.CardStatementLineId__c){ // カード明細
			cardCnt++;
		}else if(expItem.isForeignFlag()){ // 外貨入力オン
			foreignCnt++;
		}else if(o.TransportType__c == '1'){ // 駅探アイコン
			ekitanCnt++;
		}
	}
	if(cardCnt || foreignCnt || ekitanCnt){
		dojo.style(area, 'display', '');
		var msgs = [];
		if(cardCnt){
			msgs.push('・カード明細データの日付は変更できません。');
		}
		if(foreignCnt){
			msgs.push('・外貨の換算レートの自動変更は行いません。');
		}
		if(ekitanCnt){
			msgs.push('・駅探アイコンは非表示になります。');
		}
		dojo.query('div', area).forEach(function(el){
			el.innerHTML = '(注意)<br/>' + msgs.join('<br/>');
		});
	}
};
teasp.Tsf.DateChangeInBulk.prototype.showError = function(result){
	var er = teasp.Tsf.Dom.node('.ts-error-area', teasp.Tsf.Dom.byId(this.dialog.id));
	teasp.Tsf.Error.showError(result, er);
};
teasp.Tsf.DateChangeInBulk.prototype.ok = function(e){
	var node = teasp.Tsf.Dom.node('input[type="text"]', this.getFormEl());
	if(!node){
		return;
	}
	var od = teasp.util.strToDate(node.value);
	if(od.failed){
		this.showError(dojo.replace(od.tmpl, [teasp.message.getLabel('date_head')])); // 日付
		return null;
	}
	node.value = od.dater;
	var dt = od.datef; // 変更後日付
	var nexps = [];
	var taxNgNames = [];
	var T20191001 = '2019-10-01';
	for(var i = 0 ; i < this.exps.length ; i++){
		var exp = this.exps[i];
		var o = exp.values;
		if(o.Date__c != dt){
			var expItem = tsfManager.getExpItemById(o.ExpItemId__c);
			if(o.CardStatementLineId__c){ // カード明細データ
				continue;
			}else if(expItem.isTaxFlag() && expItem.getDefaultTaxRate() === null){ // 税入力オン＆税率自動
				var d1 = (o.Date__c < dt ? o.Date__c : dt);
				var d2 = (o.Date__c < dt ? dt : o.Date__c);
				if(d1 < T20191001 && d2 >= T20191001){
					if(taxNgNames.indexOf(expItem.getName()) < 0){
						taxNgNames.push(expItem.getName());
					}
					continue;
				}
			}
			nexps.push(exp);
		}
	}
	if(taxNgNames.length){
		this.showError('下記費目は消費税率自動選択のため、2019/10/01 をまたぐ日付の一括変更は行えません。<br/>・' + taxNgNames.join('・'));
		return;
	}
	this.callback(nexps, dt);
	this.hide();
};
//--------------------------------------------------------------
}