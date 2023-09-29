teasp.provide('teasp.dialog.Info');
/**
 * お知らせダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.Info = function(){
	this.id = 'dialogInfo';
	this.title = teasp.message.getLabel('info_caption'); // お知らせ
	this.duration = 1;
	this.content = '<table id="dialogInfoTable"><tr><td id="dialogInfoArea"><table class="info_table"><tbody><tr><td><table class="info_head"><tbody></tbody></table></td></tr><tr><td><div class="info_area" id="infoDiv" tabindex="1"><table class="info_body" id="infoTable"><tbody></tbody></table></div></td></tr></tbody></table></td><td id="dialogInfoRight" style="display:none;"><table><tr><td><label><input type="checkbox" class="check_old" /><span id="dialogInfoPast1"></span></label></td></tr><tr><td><button class="std-button2 close_button"><div></div></button></td></tr></table></td></tr><tr id="dialogInfoBottom"><td colspan="2"><table><tr><td></td><td><button class="std-button2 close_button" ><div></div></button></td><td><label><input type="checkbox" class="check_old" /><span id="dialogInfoPast2"></span></label></td></tr></table></td></tr></table>';

	this.agrees = null;
	this.eventHandles = [];
};

teasp.dialog.Info.prototype = new teasp.dialog.Base();

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.Info.prototype.preStart = function(){
	if(this.args.small){
		this.dialog.maxRatio = 1.0;
		this.widthHint = 0;
		dojo.query(".dijitDialogTitleBar", this.dialog.id)[0].style.display = 'none';
		this.dialog._position = dojo.hitch(this.dialog, function(){
			var style = this.domNode.style;
			style.left = "10px";
			style.top  = "16px";
		});
	}
	dojo.byId('dialogInfoTable').parentNode.style.paddingTop = '2px';
	dojo.byId('dialogInfoTable').parentNode.style.paddingBottom = '2px';

	dojo.query('.close_button').forEach(function(elem){
		elem.firstChild.innerHTML = teasp.message.getLabel('close_btn_title');
		dojo.connect(elem, 'onclick', this, this.ok);
	}, this);
	dojo.query('.check_old').forEach(function(elem){
		dojo.connect(elem, 'onclick', this, this.checkInfoOld);
	}, this);

	dojo.byId('dialogInfoPast1').innerHTML = ' ' + teasp.message.getLabel('infoPast_label');   // 過去のお知らせを見る
	dojo.byId('dialogInfoPast2').innerHTML = ' ' + teasp.message.getLabel('infoPast_label');   // 過去のお知らせを見る

	if(this.args.small){
		dojo.query('table.info_table', dojo.byId('dialogInfoArea')).forEach(function(el){
			dojo.toggleClass(el, 'info_small', true);
		}, this);
	}
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.Info.prototype.preShow = function(){
	// 前回のイベントハンドルをクリアする
	for(var i = 0 ; i < this.eventHandles.length ; i++){
		dojo.disconnect(this.eventHandles[i]);
		delete this.eventHandles[i];
	}
	this.eventHandles = [];

	this.agrees = [];

	if(this.args.small){
		dojo.style('dialogInfoRight' , 'display', '');
		dojo.style('dialogInfoBottom', 'display', 'none');
		dojo.byId('infoDiv').style.height = '84px';
	}

	dojo.query('.close_button').forEach(function(elem){
		dojo.toggleClass(elem, 'std-button2'		 , true);
		dojo.toggleClass(elem, 'std-button2-disabled', false);
	});
	dojo.query('.check_old').forEach(function(elem){
		elem.disabled = false;
		elem.checked = false;
	});

	dojo.style('dialogInfoTable', 'width', (teasp.isNarrow() ? '100%' : (this.args.small ? '572px' : '640px')));
	dojo.style('infoDiv'		, 'width', (teasp.isNarrow() ? '100%' : (this.args.small ? '572px' : '640px')));
	if(!teasp.isNarrow()){
		dojo.style('infoDiv', 'overflow-y', 'scroll');
	}

	var thead = dojo.query('#dialogInfoTable table.info_head > tbody')[0];
	dojo.empty(thead);
	var cr1 = dojo.create('tr', null, thead);
	var td1 = dojo.create('td', { className: 'date'  }, cr1);
	var td2 = dojo.create('td', { className: 'info'  }, cr1);
	var td3 = dojo.create('td', { className: 'agree' }, cr1);
	if(teasp.isNarrow()){
		dojo.style(td2, 'width', 'auto');
	}
	dojo.create('div', { innerHTML: teasp.message.getLabel('date_head') 	 }, td1); // 日付
	dojo.create('div', { innerHTML: teasp.message.getLabel('info_head') 	 }, td2); // お知らせ
	dojo.create('div', { innerHTML: teasp.message.getLabel('infoAgree_head') }, td3); // 了解

	this.createInfoTable();

	return true;
};

teasp.dialog.Info.prototype.postShow = function(){
	dojo.byId('infoDiv').scrollTop = 0;
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.Info.prototype.ok = function(){
	dojo.query('.close_button').forEach(function(elem){
		dojo.toggleClass(elem, 'std-button2'		 , false);
		dojo.toggleClass(elem, 'std-button2-disabled', true);
	});

	// チェックされたお知らせがあれば了解フラグを更新
	dojo.query('#infoDiv input[type="checkbox"]:checked').forEach(function(el){
		if(!el.disabled){
			var tr = teasp.util.getAncestorByTagName(el, 'TR');
			var match = /^info(.+)$/.exec(tr.id);
			if(match){
				this.agrees.push(match[1]);
			}
		}
	}, this);
	if(this.agrees.length > 0){
		teasp.manager.request(
			'setInfoAgree',
			{
				empId	  : this.pouch.getEmpId(),
				infoId	  : this.agrees
			},
			this.pouch,
			{ hideBusy : true },
			this,
			function(){
				this.close();
			},
			function(event){
				teasp.message.alertError(event);
				this.close();
			}
		);
	}else{
		this.close();
	}
};

/**
 * 閉じる
 *
 * @override
 */
teasp.dialog.Info.prototype.close = function(){
	this.hide();
	if(this.onfinishfunc){
		this.onfinishfunc();
	}
};

/**
 * お知らせ表示テーブル作成
 *
 * @param {boolean=} allFlag true:過去のお知らせも表示
 */
teasp.dialog.Info.prototype.createInfoTable = function(allFlag){
	var tbody = dojo.query('#dialogInfoTable table.info_body > tbody')[0];
	dojo.empty(tbody);
	var div;
	var infos	 = this.pouch.getInfos();
	var rejects  = this.pouch.getRejects();
	var invalids = this.pouch.getInvalidApplys();
	var tabIndex = 2;
	var blends = [];
	for(var i = 0 ; i < rejects.length ; i++){
		var reject = rejects[i];
		var text = '';
		if(reject.objectType == 0){
			var sb = '';
			if(reject.applyType == teasp.constant.APPLY_TYPE_MONTHLY){
				var ym = reject.yearMonth;
				var sn = reject.subNo;
				sb = teasp.util.date.formatMonth('zv00000020', Math.floor(ym / 100), (ym % 100), sn);
			}else if(!teasp.util.date.compareDate(reject.startDate, reject.endDate)){
				sb = teasp.util.date.formatDate(reject.startDate, 'SLA');
			}else{
				sb = teasp.util.date.formatDate(reject.startDate, 'SLA') + '-' + teasp.util.date.formatDate(reject.endDate, 'SLA');
			}
			text = teasp.message.getLabel('tm10007020', teasp.data.EmpApply.getDisplayApplyType(reject.applyType), sb); // {0}（{1}）の承認申請が却下されました。
		}else if(reject.objectType == 1){
			text = teasp.message.getLabel('tm10007030', teasp.message.getLabel('tm10007060', reject.expApplyNo)); // 経費精算（{0}）の承認申請が却下されました。
		}else{
			var ym = reject.yearMonth;
			var sn = reject.subNo;
			var sb = teasp.util.date.formatMonth('zv00000020', Math.floor(ym / 100), (ym % 100), sn);
			text = teasp.message.getLabel('tm10007040', sb); // 工数実績（{0}）の承認申請が却下されました。
		}
		blends.push({
			id		  : reject.id,
			date	  : teasp.util.date.formatDate(reject.rejectTime, 'SLA'),
			text	  : text,
			click	  : this.clickRejectLink(reject),
			margin	  : '4px',
			color	  : '#983660',
			cursor	  : 'pointer'
		});
	}
	for(var i = 0 ; i < invalids.length ; i++){
		var invalid = invalids[i];
		blends.push({
			id		  : invalid.id,
			date	  : teasp.util.date.formatDate(invalid.date, 'SLA'),
			text	  : invalid.text,
			margin	  : '4px'
		});
	}
	if(this.pouch.isDaiqLack()){
		blends.push({
			id		  : null,
			date	  : null,
			text	  : teasp.message.getLabel('tm10003780'), // 代休可能残日数が不足しています。代休の休暇申請を取消してください。
			margin	  : '4px'
		});
	}
	var stockLack = this.pouch.getStockLack();
	for(var key in stockLack){
		if(stockLack.hasOwnProperty(key)){
			var o = stockLack[key];
			blends.push({
				id		  : null,
				date	  : teasp.util.date.formatDate(o.info.date, 'SLA'),
				text	  : teasp.message.getLabel('tm10003781', o.info.name), // {0}取得可能残日数が不足しています。休暇申請を取消してください。
				margin	  : '4px'
			});
		}
	}
	for(var i = 0 ; i < infos.length ; i++){
		var info = infos[i];
		if(info.agree && !allFlag){
			continue;
		}
		blends.push({
			id			 : info.id,
			date		 : teasp.util.date.formatDate(info.createdDate, 'SLA', 0),
			dated		 : info.createdDate,
			text		 : (info.text ? info.text.replace(/\n/g, '<br/>') : ''),
			margin		 : '4px',
			check		 : true,
			checkDisable : (info.agree || this.pouch.isReadOnly()),
			agree		 : info.agree
		});
	}
	var diverges = this.pouch.getDiverges(); // 乖離あり(理由なし)
	for(var i = 0 ; i < diverges.length ; i++){
		var o = diverges[i];
		blends.push({
			id		  : null,
			date	  : teasp.util.date.formatDate(o.date, 'SLA'),
			dated	  : 0,
			text	  : teasp.message.getLabel('ac00000430'), // ログとの乖離があります。乖離理由を入力してください。
			margin	  : '4px'
		});
	}
	blends = blends.sort(function(a, b){
		return (a.dated < b.dated ? 1 : (a.dated > b.dated ? -1 : (a.date < b.date ? -1 : (a.date > b.date ? 1 : 0))));
	});
	if(blends <= 0){
		var row = dojo.create('tr', null, tbody);
		dojo.create('div', {
			innerHTML:teasp.message.getLabel('tm10007010'),
			style:"margin:4px;"
		}, dojo.create('td', { style:"text-align:left;" }, row));
	}else{
		var cnt = 0;
		for(var i = 0 ; i < blends.length ; i++){
			var blend = blends[i];
			var row = dojo.create('tr', { id: 'info' + (blend.id || ''), className: (((cnt++)%2) == 0 ? 'even' : 'odd') }, tbody);
			dojo.create('div', { innerHTML: (blend.date || '') }, dojo.create('td', { className:"date" }, row));
			var cell = dojo.create('td', { className:"info" }, row);
			if(teasp.isNarrow()){
				dojo.style(cell, 'width', 'auto');
			}
			div = dojo.create('div', { innerHTML : blend.text }, cell);
			if(blend.margin){
				div.style.margin = blend.margin;
			}
			if(blend.color){
				div.style.color = blend.color;
			}
			if(blend.cursor){
				div.style.cursor = blend.cursor;
			}
			this.eventHandles.push(dojo.connect(row, 'onclick', this, function(e){
			    if(e.target.tagName == 'INPUT' && e.target.type == 'checkbox'){
			        return;
			    }
				var tr = teasp.util.getAncestorByTagName(e.target, 'TR');
				dojo.query('input[type="checkbox"]', tr).forEach(function(el){
					if(!el.disabled){
						el.checked = !el.checked;
					}
				});
			}));
			this.eventHandles.push(dojo.connect(div, 'onclick', this, (blend.click ? blend.click : /** @ignore */function(){})));
			cell = dojo.create('td', { className:"agree" }, row);
			if(blend.check){
				var inp = dojo.create('input', { type: 'checkbox', tabindex:(tabIndex++) }, cell);
				if(blend.checkDisable){
					inp.checked = blend.agree;
					inp.disabled = true;
				}
			}
		}
	}
	if(this.args.small){
		dojo.query('input[type="checkbox"].check_old', this.dialog.domNode).forEach(function(el){ dojo.setAttr(el, 'tabindex', (tabIndex++)); });
		dojo.query('button.close_button'             , this.dialog.domNode).forEach(function(el){ dojo.setAttr(el, 'tabindex', (tabIndex++)); });
	}else{
		dojo.query('button.close_button'             , this.dialog.domNode).forEach(function(el){ dojo.setAttr(el, 'tabindex', (tabIndex++)); });
		dojo.query('input[type="checkbox"].check_old', this.dialog.domNode).forEach(function(el){ dojo.setAttr(el, 'tabindex', (tabIndex++)); });
	}
	setTimeout(dojo.hitch(this, function(){
		var tbody = dojo.query('#dialogInfoTable table.info_body > tbody')[0];
		var h = tbody.offsetHeight;
		if(!teasp.isNarrow()){
			if(this.args.small){
				dojo.style('infoDiv', 'height', '84px');
			}else if(h > 26){
				dojo.style('infoDiv', 'height', Math.min(h, 300) + 'px');
			}
		}
	}), 100);
};

/**
 * 却下のお知らせクリック（クロージャ）
 *
 * @param {Object} o 却下お知らせオブジェクト
 * @return {Function}
 */
teasp.dialog.Info.prototype.clickRejectLink = function(o){
	var reject = o;
	return function(){
		var url = '';
		var dt = (reject.startDate ? teasp.util.date.formatDate(reject.startDate, 'yyyyMMdd') : '');
		if(reject.objectType == 0){
			if(!this.args.small && this.pouch.getStartDate() == reject.startDate){
				this.dialog.hide();
				return;
			}
			var mp = teasp.viewPoint.viewParams || {};
			var comp = mp.comp || 0;
			// SF1環で、sforce.one.navigateToURL()でURLを指定する際に、前と同じURLだと無視されるため、
			// 前と異なるURLにするために、ダミーの引数'comp'(compensate)で1～の連番を指定する。
			if(/AtkWorkTimeView/.test(location.pathname)
			&& teasp.isSforce()
			&& mp.empId == this.pouch.getEmpId()
			&& mp.date == dt
			&& mp.mode == 'edit'
			){
				comp++;
			}
			url = teasp.getPageUrl('workTimeView') + '?empId=' + this.pouch.getEmpId() + '&date=' + dt + '&mode=edit' + (comp ? '&comp=' + comp : '');
		}else if(reject.objectType == 1){
			url = teasp.getPageUrl('empExpView') + '?empId=' + this.pouch.getEmpId() + '&expApplyId=' + reject.id + '&mode=edit';
		}else if(reject.objectType == 2){
			url = teasp.getPageUrl('empJobView') + '?empId=' + this.pouch.getEmpId() + '&date=' + dt + '&mode=edit';
		}
		teasp.locationHref(url, top.location);
	};
};

/**
 * 過去のお知らせを見る
 * @param {Event} e
 */
teasp.dialog.Info.prototype.checkInfoOld = function(e){
	this.createInfoTable(e.target.checked);
};
