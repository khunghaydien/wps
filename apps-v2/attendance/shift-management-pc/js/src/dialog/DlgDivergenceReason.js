teasp.provide('teasp.dialog.DivergenceReason');
/**
 * 乖離理由入力ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.DivergenceReason = function(){
	this.widthHint = 410;
	this.heightHint = 225;
	this.id = 'dialogDivergenceReason';
	this.title = teasp.message.getLabel('ac00000290'); // 乖離理由入力
	this.duration = 1;
	this.content = '<table class="diverge-reason"><tr><td class="diverge-head"><table><tr><td class="diverge-date"><span></span></td><td class="diverge-event"><span></span></td></tr></table></td></tr><tr><td><table class="diverge-table1"><tr><td class="diverge-info"><div class="diverge-form"></div><table><tbody></tbody></table></td><td><div><select></select></div><div><textarea></textarea></div></td></tr></table><table class="diverge-table2"><tr><td class="diverge-info"><div class="diverge-form"></div><table><tbody></tbody></table></td><td><div><select></select></div><div><textarea></textarea></div></td></tr></table></td></tr><tr class="diverge-ctrl1"><td><div><button class="std-button1"><div></div></button><button class="std-button2"><div></div></button></div></td></tr><tr class="diverge-ctrl2"><td><div><button class="std-button2"><div></div></button></div></td></tr></table>';
	this.eventHandles = [];
};

teasp.dialog.DivergenceReason.prototype = new teasp.dialog.Base();

/**
 *
 * @override
 */
teasp.dialog.DivergenceReason.prototype.ready = function(){
	this.dayWrap = this.pouch.getEmpDay(this.args.date);
};

teasp.dialog.DivergenceReason.prototype.preStart = function(){
	var area = dojo.byId(this.dialog.id);

	var b1 = dojo.query('.diverge-ctrl1 .std-button1', area)[0];
	var b2 = dojo.query('.diverge-ctrl1 .std-button2', area)[0];
	var b3 = dojo.query('.diverge-ctrl2 .std-button2', area)[0];
	dojo.query('div', b1)[0].innerHTML = teasp.message.getLabel('save_btn_title'  );
	dojo.query('div', b2)[0].innerHTML = teasp.message.getLabel('cancel_btn_title');
	dojo.query('div', b3)[0].innerHTML = teasp.message.getLabel('close_btn_title' );

	dojo.connect(b1, "onclick", this, this.ok  );
	dojo.connect(b2, "onclick", this, this.hide);
	dojo.connect(b3, "onclick", this, this.hide);
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.DivergenceReason.prototype.preShow = function(){
	// 前回のイベントハンドルをクリアする
	for(var i = 0 ; i < this.eventHandles.length ; i++){
		dojo.disconnect(this.eventHandles[i]);
		delete this.eventHandles[i];
	}
	this.eventHandles = [];
	var area = dojo.byId(this.dialog.id);

	var single = this.isSingle(); // 休日・休暇日モード

	dojo.style(dojo.query('.diverge-ctrl1', area)[0], 'display', (this.isReadOnly() ? 'none' : ''));
	dojo.style(dojo.query('.diverge-ctrl2', area)[0], 'display', (this.isReadOnly() ? '' : 'none'));

	dojo.style(dojo.query('.diverge-table2', area)[0], 'display', (single ? 'none' : ''));

	dojo.query('.diverge-date' , area)[0].innerHTML = teasp.util.date.formatDate(this.args.date, 'JP1');
	dojo.query('.diverge-event', area)[0].innerHTML = this.dayWrap.getCalendarEvent();

	var dlst = this.pouch.getDivergenceReasonList();
	var vrea = (dlst.length > 0 && !this.isReadOnly());
	var tbody, tr;

	// 上段
	var select1 = dojo.query('.diverge-table1 select', area)[0];
	dojo.empty(select1);
	if(vrea){
		dojo.create('option', { innerHTML: '', value: '' }, select1);
		dojo.forEach(dlst, function(v){
			dojo.create('option', { innerHTML: v, value: v }, select1);
		});
		this.eventHandles.push(dojo.connect(select1, 'onchange', this, this.changedReason(1)));
	}
	dojo.style(select1, 'display', (vrea ? '' : 'none'));
	dojo.query('.diverge-table1 div.diverge-form', area)[0].innerHTML = teasp.message.getLabel(single ? 'ac00000230' : 'ac00000210'); // 入退館乖離理由 or 入館乖離理由
	dojo.query('.diverge-table1 textarea', area)[0].readOnly = (this.isReadOnly() ? 'readOnly' : '');
	dojo.toggleClass(dojo.query('.diverge-table1 textarea', area)[0], 'inputro', this.isReadOnly());
	dojo.query('.diverge-table1 textarea', area)[0].maxLength = teasp.constant.DIVERGE_REASON_MAX;
	dojo.query('.diverge-table1 textarea', area)[0].value = this.dayWrap.getEnterDivergenceReason(); // 入館乖離理由

	dojo.style(dojo.query('.diverge-table1 td.diverge-info', area)[0], 'min-width', '100px');
	tbody = dojo.query('.diverge-table1 td.diverge-info tbody', area)[0];
	dojo.empty(tbody);
	if(!single){
		tr = dojo.create('tr', null, tbody);
		dojo.create('td', { innerHTML: teasp.message.getLabel('startTime_head')                      }, tr); // 出社
		dojo.create('td', { innerHTML: this.dayWrap.getStartTime(false, null, teasp.constant.C_REAL) }, tr); // 出社時刻
	}
	tr = dojo.create('tr', null, tbody);
	dojo.create('td', { innerHTML: teasp.message.getLabel('ac00000250') }, tr);     // 入館
	dojo.create('td', { innerHTML: this.dayWrap.getEnterTime()          }, tr);     // 入館時刻
	if(single){
		tr = dojo.create('tr', null, tbody);
		dojo.create('td', { innerHTML: teasp.message.getLabel('ac00000260') }, tr); // 退館
		dojo.create('td', { innerHTML: this.dayWrap.getExitTime()           }, tr); // 退館時刻
	}else{
		tr = dojo.create('tr', null, tbody);
		dojo.create('td', { innerHTML: this.dayWrap.getEnterDivergence(), colSpan: 2 }, tr); // 入館の乖離判定表示
	}

	// 下段
	if(!single){
		var select2 = dojo.query('.diverge-table2 select', area)[0];
		dojo.empty(select2);
		if(vrea){
			dojo.create('option', { innerHTML: '', value: '' }, select2);
			dojo.forEach(dlst, function(v){
				dojo.create('option', { innerHTML: v, value: v }, select2);
			});
			this.eventHandles.push(dojo.connect(select2, 'onchange', this, this.changedReason(2)));
		}
		dojo.style(select2, 'display', (vrea ? '' : 'none'));
		dojo.query('.diverge-table2 div.diverge-form', area)[0].innerHTML = teasp.message.getLabel('ac00000220'); // 退館乖離理由
		dojo.query('.diverge-table2 textarea', area)[0].readOnly = (this.isReadOnly() ? 'readOnly' : '');
		dojo.toggleClass(dojo.query('.diverge-table2 textarea', area)[0], 'inputro', this.isReadOnly());
		dojo.query('.diverge-table2 textarea', area)[0].maxLength = teasp.constant.DIVERGE_REASON_MAX;
		dojo.query('.diverge-table2 textarea', area)[0].value = this.dayWrap.getExitDivergenceReason();  // 退館乖離理由

		tbody = dojo.query('.diverge-table2 td.diverge-info tbody', area)[0];
		dojo.empty(tbody);
		tr = dojo.create('tr', null, tbody);
		dojo.create('td', { innerHTML: teasp.message.getLabel('endTime_head')                      }, tr); // 退社
		dojo.create('td', { innerHTML: this.dayWrap.getEndTime(false, null, teasp.constant.C_REAL) }, tr); // 退社時刻
		tr = dojo.create('tr', null, tbody);
		dojo.create('td', { innerHTML: teasp.message.getLabel('ac00000260') }, tr); // 退館
		dojo.create('td', { innerHTML: this.dayWrap.getExitTime()           }, tr); // 退館時刻
		tr = dojo.create('tr', null, tbody);
		dojo.create('td', { innerHTML: this.dayWrap.getExitDivergence(), colSpan: 2 }, tr); // 退館の乖離判定表示
	}

	return true;
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.DivergenceReason.prototype.ok = function(){
	teasp.manager.request(
		'saveDivergenceReason',
		{
			empId            : this.pouch.getEmpId(),
			mode             : this.pouch.getMode(),
			date             : this.args.date,
			lastModifiedDate : this.pouch.getLastModifiedDate(),
			enterDivergenceReason : this.getEnterDivergenceReason(),
			exitDivergenceReason  : this.getExitDivergenceReason()
		},
		this.pouch,
		{},
		this,
		function(){
			this.onfinishfunc();
			this.close();
		},
		function(event){
			teasp.message.alertError(event);
		}
	);
};

/**
 * 参照モードか
 *
 * @return {boolean} true:参照モード
 */
teasp.dialog.DivergenceReason.prototype.isReadOnly = function(){
	return (this.pouch.isEmpMonthReadOnly() || this.dayWrap.isDailyFix());
};

/**
 * 乖離理由をプルダウンから選択した
 * @param {number} secn =1:入館乖離理由、=2:退館乖離理由
 * @returns {Function}
 */
teasp.dialog.DivergenceReason.prototype.changedReason = function(secn){
	return function(e){
		var v = e.target.value;
		if(v){
			var textArea = dojo.query('.diverge-table' + secn + ' textarea', dojo.byId(this.dialog.id))[0];
			textArea.value = textArea.value + v;
			if(textArea.value.length > teasp.constant.DIVERGE_REASON_MAX){
				textArea.value = textArea.value.substring(0, teasp.constant.DIVERGE_REASON_MAX);
			}
		}
	};
};

// 休日・休暇日用なら true を返す（乖離理由入力欄が１つ）
teasp.dialog.DivergenceReason.prototype.isSingle = function(){
	return !this.dayWrap.isInputable(); // 休日かつ休日出勤申請なしまたは終日の休暇
};

// 入館乖離理由の入力値
teasp.dialog.DivergenceReason.prototype.getEnterDivergenceReason = function(){
	var area = dojo.byId(this.dialog.id);
	return dojo.query('.diverge-table1 textarea', area)[0].value;
};

// 退館乖離理由の入力値
teasp.dialog.DivergenceReason.prototype.getExitDivergenceReason = function(){
	if(this.isSingle()){ // 休日・休暇日なら上段の入力値を返す
		return this.getEnterDivergenceReason();
	}
	var area = dojo.byId(this.dialog.id);
	return dojo.query('.diverge-table2 textarea', area)[0].value;
};
