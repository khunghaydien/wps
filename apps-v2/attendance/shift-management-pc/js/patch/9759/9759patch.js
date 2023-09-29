// 月次サマリー/勤務表カスタマイズ-開始-
if(typeof(teasp) == 'object' && !teasp.resolved['MBJS4'] && teasp.view && teasp.view.MonthlySummary && teasp.view.Monthly && !teasp.helper.Summary){
teasp.view.MonthlySummary.prototype.show = function(){
	console.log('teasp.view.MonthlySummary.prototype.show');
	this.monSum = this.pouch.getMonthSummary();

	//----------- カスタマイズ開始 -------------
	if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FIX
	|| this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX
	|| this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER
	){
		var monthId = this.pouch.dataObj.month.id;
		this.monSum.o.custom1 = {
			col: '所定時間内残業',
			val: (monthId ? 0 : '-')
		};
		this.monSum.o.custom2 = {
			col: '所定時間外残業',
			val: (monthId ? 0 : '-')
		};
		this.monSum.o.custom3 = {
			col: '前月不足繰越時間',
			val: (monthId ? 0 : '-')
		};
		if(!monthId){
			this.monSum.o.workWholeTime.val			  = '-'; // 総労働時間（有給含む）
			this.showMain();
		}else{
			teasp.prefixBar = 'teamspirit__';
			teasp.action.contact.remoteMethod(
				'getExtResult',
				{
					soql: "select WorkWholeTime__c,mj_time_001__c,mj_time_002__c,mj_time_010__c,mj_time_012_min__c from AtkEmpMonth__c where Id = '" + monthId + "'",
					limit: 1,
					offset: 0
				},
				dojo.hitch(this, function(result){
					teasp.util.excludeNameSpace(result);
					this.month = (result.records && result.records.length > 0 ? result.records[0] : null);
					this.monSum.o.workWholeTime.val = teasp.util.time.timeValue(this.month.WorkWholeTime__c);
					this.monSum.o.custom1.val = teasp.util.time.timeValue(this.month.mj_time_010__c || 0);
					this.monSum.o.custom2.val = teasp.util.time.timeValue((this.month.mj_time_001__c || 0) + (this.month.mj_time_002__c || 0));
					this.monSum.o.custom3.val = teasp.util.time.timeValue(this.month.mj_time_012_min__c || 0);
					this.showMain();
				}),
				null,
				this
			);
		}
	}else{
		this.showMain();
	}
	//----------- カスタマイズ終了 -------------
};
teasp.view.MonthlySummary.prototype.showSummaryDsp = function(){
	if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER){ // 管理監督者
		this.styleDisplay('monthlyWeekWholeTimeRow', false);
		this.styleDisplay('monthlyRealTimeRow'	   , false);
		this.styleDisplay('monthlyWorkWholeTimeRow', false);
		this.styleDisplay('realRealTimeRow' 	   , true );

		dojo.style('over36Table', 'display','none'); // 36協定関連
		dojo.style(teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monthlyLegalMax'), 'TABLE'), 'display', 'none'); // 法定時間内残業等
		dojo.style(teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monsumSum26')    , 'TABLE'), 'display', 'none'); // 遅刻等

		// 「所定労働時間」と「総労働時間(有休を含む)」の位置入れ替え
		var tr1 = teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monsumSum05'), 'TR'); // 所定労働時間
		var tr2 = dojo.byId('realRealTimeRow'); // 実労働時間（有休を含めない）
		dojo.place(tr1, tr2, 'after');
		dojo.toggleClass(tr1, 'odd' , true);
		dojo.toggleClass(tr1, 'even', false);

	}else if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX){ // フレックス
		this.styleDisplay('monthlyWeekWholeTimeRow', false);
		this.styleDisplay('monthlyRealTimeRow'	   , false);
		dojo.style(teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monsumSum20'), 'TR'), 'display', 'none');
		dojo.style(teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monsumSum21'), 'TR'), 'display', 'none');

		var tr1 = teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monsumSum05'), 'TR'); // 所定労働時間
		var tr2 = teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monsumSum22'), 'TR'); // 法定休日労働時間
		var tr3 = dojo.byId('monthlyWorkWholeTimeRow'); // 総労働時間（有休を含む）
		dojo.place(tr2, tr1, 'after');
		dojo.place(tr3, tr1, 'before');

		var today = this.pouch.getToday();
		var ysday = teasp.util.date.addDays(today, -1);
		var atday = this.pouch.getObj().month.amountTimeDate;
		// 過不足時間
		if(today == atday || ysday == atday){ // 現時点の過不足時間を表示する
			var amount = this.pouch.getMonthSubValueByKey('curAmountTime');
			dojo.byId('monsumSum10').innerHTML = teasp.message.getLabel('amountTime_label')  // 過不足時間
						+ '<span style="font-size:0.9em;">' + teasp.message.getLabel('tm10001020', teasp.util.date.formatDate(atday, 'M/d')) + '</span>';
			this.monSum.o.amountTime.val = (amount > 0 ? '+' : '') + this.pouch.getDisplayTime(amount);
		}

		dojo.style('over36Table', 'display','none'); // 36協定関連
		dojo.style(teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monthlyLegalMax'), 'TABLE'), 'display', 'none'); // 法定時間内残業等
		dojo.toggleClass('amountTime', 'odd' , false);
		dojo.toggleClass('amountTime', 'even', true);

		tr1 = dojo.byId('amountTime');
		var tr = dojo.create('tr', { className:'odd' }, tr1, 'after'); // 前月フレックス繰越時間
		dojo.create('div', { innerHTML:this.monSum.o.custom3.col }, dojo.create('td', { className:'column' }, tr));
		dojo.create('div', { innerHTML:this.monSum.o.custom3.val }, dojo.create('td', { className:'value'  }, tr));

	}else if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FIX){ // 固定労働時間
		this.styleDisplay('monthlyWeekWholeTimeRow', false);
		this.styleDisplay('monthlyRealTimeRow'	   , false);

		var tr1 = teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monsumSum05'), 'TR'); // 所定労働時間
		var tr2 = teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monsumSum22'), 'TR'); // 法定休日労働時間
		var tr3 = dojo.byId('monthlyWorkWholeTimeRow'); // 総労働時間（有休を含む）
		dojo.place(tr2, tr1, 'after');
		dojo.place(tr3, tr1, 'before');

		var tr = dojo.create('tr', { className:'even' }, tr1, 'after'); // 所定時間外残業
		dojo.create('div', { innerHTML:this.monSum.o.custom2.col }, dojo.create('td', { className:'column' }, tr));
		dojo.create('div', { innerHTML:this.monSum.o.custom2.val }, dojo.create('td', { className:'value'  }, tr));

		tr = dojo.create('tr', { className:'odd' }, tr1, 'after'); // 所定時間内残業
		dojo.create('div', { innerHTML:this.monSum.o.custom1.col }, dojo.create('td', { className:'column' }, tr));
		dojo.create('div', { innerHTML:this.monSum.o.custom1.val }, dojo.create('td', { className:'value'  }, tr));

		dojo.style('over36Table', 'display','none'); // 36協定関連
		dojo.style(teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monthlyLegalMax'), 'TABLE'), 'display', 'none'); // 法定時間内残業等

	}
	dojo.style(teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monsumSum24'), 'TR'), 'display', 'none'); // 法定時間外割増
	dojo.style(teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monsumSum34'), 'TR'), 'display', 'none'); // 45時間を超える時間外労働
	dojo.style(teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monsumSum25'), 'TR'), 'display', 'none'); // 60時間を超える時間外労働
	dojo.style(teasp.view.MonthlySummary.getAncestorByTagName(dojo.byId('monsumSum28'), 'TR'), 'display', 'none'); // XX時間内の私用外出回数・時間（控除対象）

};
teasp.view.MonthlySummary.getAncestorByTagName = function(el, tagName){
	var pel = null;
	var p = el;
	while(p != null && p.tagName != 'BODY'){
		if(p.tagName == tagName){
			pel = p;
			break;
		}
		p = p.parentNode;
	}
	return pel;
};
// 勤務表下部カスタマイズ
teasp.view.Monthly.prototype.createGraphArea = function(){
	if(!this.graph){
		this.graph = new teasp.helper.Graph({
			widthPerH		   : 20
		, startY			 : 48
		, sizeType			 : 'small'
		, movable			 : false
		, clickedEvent		 : this.openEditTime
		, clickedApply		 : this.openEmpApply
		, hideTimeGraphPopup : this.pouch.isHideTimeGraphPopup()
		, that				 : this
	});
	}
	this.graph.clear();
	this.graph.draw(this.pouch, 'graphDiv', this.pouch.getMonthDateList());
	setTimeout(dojo.hitch(this, this.adjustGraphAreaScroll), 100);

	//----------- カスタマイズ開始 -------------
	if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FIX
	|| this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX
	|| this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER
	){
		var monthId = this.pouch.dataObj.month.id;
		if(!monthId){
			this.refreshBottoms(null);
		}else{
			teasp.prefixBar = 'teamspirit__';
			teasp.action.contact.remoteMethod(
				'getExtResult',
				{
					soql: "select WorkWholeTime__c,mj_time_001__c,mj_time_002__c,mj_time_010__c,mj_time_012_min__c from AtkEmpMonth__c where Id = '" + monthId + "'",
					limit: 1,
					offset: 0
				},
				dojo.hitch(this, function(result){
					teasp.util.excludeNameSpace(result);
					var month = (result.records && result.records.length > 0 ? result.records[0] : null);
					this.refreshBottoms(month);
				}),
				null,
				this
			);
		}
	}
	//----------- カスタマイズ終了 -------------
};
// オリジナルにはない関数
teasp.view.Monthly.prototype.refreshBottoms = function(month){
	var hifn = '-';
	var flex = (this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX);
	var tbody = dojo.byId('totalValueLeft');
	dojo.empty(tbody);
	var row = dojo.create('tr', null, tbody);

	// 所定出勤日数
	dojo.create('div', { className: 'left top' , innerHTML: teasp.message.getLabel('fixDays_label') }, dojo.create('td', { className: 'left'  }, row));
	dojo.create('div', { className: 'right top', innerHTML: teasp.message.getLabel('tm10001010', this.pouch.getMonthSubValueByKey('workFixedDay')) }, dojo.create('td', { className: 'right' }, row));
	// 実出勤日数
	row = dojo.create('tr', null, tbody);
	dojo.create('div', { className: 'left middle' , innerHTML: teasp.message.getLabel('realDays_label') }, dojo.create('td', { className: 'left'  }, row));
	dojo.create('div', { className: 'right middle', innerHTML: teasp.message.getLabel('tm10001010', this.pouch.getMonthSubValueByKey('workRealDay')) }, dojo.create('td', { className: 'right' }, row));
	// 法定休日出勤日数
	row = dojo.create('tr', null, tbody);
	dojo.create('div', { className: 'left middle' , innerHTML: teasp.message.getLabel('legalHolidayWorkDays_label') }, dojo.create('td', { className: 'left'  }, row));
	dojo.create('div', { className: 'right middle', innerHTML: teasp.message.getLabel('tm10001010', this.pouch.getMonthSubValueByKey('workLegalHolidayCount')) }, dojo.create('td', { className: 'right' }, row));
	// 所定休日出勤日数
	row = dojo.create('tr', null, tbody);
	dojo.create('div', { className: 'left bottom' , innerHTML: teasp.message.getLabel('holidayWorkDays_label') }, dojo.create('td', { className: 'left'  }, row));
	dojo.create('div', { className: 'right bottom', innerHTML: teasp.message.getLabel('tm10001010', this.pouch.getMonthSubValueByKey('workHolidayCount')) }, dojo.create('td', { className: 'right' }, row));

	tbody = dojo.byId('totalValueRight');
	dojo.empty(tbody);
	row = dojo.create('tr', null, tbody);

	if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER){ // 管理監督者
		// 実労働時間
		dojo.create('div', {
			className: 'left top',
			innerHTML: teasp.message.getLabel('workRealTime_label')
					+ '<span style="font-size:85%;">'
					+ teasp.message.getLabel('tm10009250')
					+ '</span>'
		}, dojo.create('td', { className: 'left'  }, row));
		dojo.create('div', { className: 'right top', innerHTML: this.pouch.getMonthSubTimeByKey('workRealTime', false, null, teasp.constant.C_REAL) }, dojo.create('td', { className: 'right' }, row));
	}else{
		// 総労働時間
		dojo.create('div', {
			className: 'left top',
			innerHTML: teasp.message.getLabel('wholeTime_label')
					+ '<span style="font-size:85%;">'
					+ teasp.message.getLabel('tm10009240')
					+ '</span>'
		}, dojo.create('td', { className: 'left'  }, row));
		dojo.create('div', { className: 'right top', innerHTML: this.pouch.getMonthSubTimeByKey('workWholeTime') }, dojo.create('td', { className: 'right' }, row));
	}
	// 所定労働時間
	row = dojo.create('tr', null, tbody);
	dojo.create('div', { className: 'left middle' , innerHTML: teasp.message.getLabel('fixTimeOfDay_label') }, dojo.create('td', { className: 'left'  }, row));
	dojo.create('div', { className: 'right middle', innerHTML: this.pouch.getMonthSubTimeByKey('workFixedTime') }, dojo.create('td', { className: 'right' }, row));

	if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER){ // 管理監督者
		// 深夜労働時間
		row = dojo.create('tr', null, tbody);
		dojo.create('div', { className: 'left bottom' , innerHTML: teasp.message.getLabel('nightWorkTime_label') }, dojo.create('td', { className: 'left'  }, row));
		dojo.create('div', { className: 'right bottom', innerHTML: this.pouch.getMonthSubTimeByKey('workNightTime', false, null, teasp.constant.C_REAL) }, dojo.create('td', { className: 'right' }, row));

	}else if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX){ // フレックス
		var custom3 = (month ? teasp.util.time.timeValue(month.mj_time_012_min__c || 0) : '-');
		// 法定休日労働時間
		row = dojo.create('tr', null, tbody);
		dojo.create('div', { className: 'left middle' , innerHTML: teasp.message.getLabel('tm10009300') }, dojo.create('td', { className: 'left'  }, row));
		dojo.create('div', { className: 'right middle', innerHTML: this.pouch.getMonthSubTimeByKey('workHolidayTime') }, dojo.create('td', { className: 'right' }, row));

		var today = this.pouch.getToday();
		var ysday = teasp.util.date.addDays(today, -1);
		var atday = this.pouch.getObj().month.amountTimeDate;
		row = dojo.create('tr', null, tbody);
		// 過不足時間
		if(today == atday || ysday == atday){ // 現時点の過不足時間を表示する
			var amount = this.pouch.getMonthSubValueByKey('curAmountTime');
			dojo.create('div', { className: 'left middle' , innerHTML: teasp.message.getLabel('amountTime_label')  // 過不足時間
						+ '<span style="font-size:0.9em;">' + teasp.message.getLabel('tm10001020', teasp.util.date.formatDate(atday, 'M/d')) + '</span>'
						}, dojo.create('td', { className: 'left'  }, row));
			dojo.create('div', { className: 'right middle', innerHTML: (amount > 0 ? '+' : '') + this.pouch.getDisplayTime(amount) }, dojo.create('td', { className: 'right' }, row));
		}else{
			var amount = this.pouch.getMonthSubValueByKey('amountTime');
			dojo.create('div', { className: 'left middle' , innerHTML: teasp.message.getLabel('amountTime_label')                  }, dojo.create('td', { className: 'left'  }, row));
			dojo.create('div', { className: 'right middle', innerHTML: (amount > 0 ? '+' : '') + this.pouch.getDisplayTime(amount) }, dojo.create('td', { className: 'right' }, row));
		}
		row = dojo.create('tr', null, tbody);
		dojo.create('div', { className: 'left bottom' , innerHTML: '前月不足繰越時間' }, dojo.create('td', { className: 'left'  }, row));
		dojo.create('div', { className: 'right bottom', innerHTML: custom3 }, dojo.create('td', { className: 'right' }, row));

	}else if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FIX){ // 固定労働時間
		var custom1 = (month ? teasp.util.time.timeValue(month.mj_time_010__c || 0) : '-');
		var custom2 = (month ? teasp.util.time.timeValue((month.mj_time_001__c || 0) + (month.mj_time_002__c || 0)) : '-');
		// 所定時間内残業
		row = dojo.create('tr', null, tbody);
		dojo.create('div', { className: 'left middle' , innerHTML: '所定時間内残業' }, dojo.create('td', { className: 'left'  }, row));
		dojo.create('div', { className: 'right middle', innerHTML: custom1 }, dojo.create('td', { className: 'right' }, row));
		// 所定時間外残業
		row = dojo.create('tr', null, tbody);
		dojo.create('div', { className: 'left middle' , innerHTML: '所定時間外残業' }, dojo.create('td', { className: 'left'  }, row));
		dojo.create('div', { className: 'right middle', innerHTML: custom2 }, dojo.create('td', { className: 'right' }, row));

		// 法定休日労働時間
		row = dojo.create('tr', null, tbody);
		dojo.create('div', { className: 'left bottom' , innerHTML: teasp.message.getLabel('tm10009300') }, dojo.create('td', { className: 'left'  }, row));
		dojo.create('div', { className: 'right bottom', innerHTML: this.pouch.getMonthSubTimeByKey('workHolidayTime') }, dojo.create('td', { className: 'right' }, row));

	}
};
}
// 月次サマリー/勤務表カスタマイズ-終了-
