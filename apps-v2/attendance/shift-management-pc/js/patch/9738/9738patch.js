if(typeof(teasp) == 'object' && !teasp.resolved['TGINET'] && teasp.view && teasp.view.MonthlySummary && teasp.view.Monthly && !(teasp.helper.Summary)){
teasp.view.MonthlySummary.prototype.show = function(){
	console.log('teasp.view.MonthlySummary.prototype.show!!!');
	this.monSum = this.pouch.getMonthSummary();

	// 入館管理情報の表示/非表示
	var msac = this.pouch.isMsAccessInfo(); // 月次サマリに入退館情報を表示する
	var table = dojo.byId('workTable');
	dojo.query('td.prtv_head_entr,td.prtv_head_exit,td.prtv_head_dive,td.prtv_entr,td.prtv_exit,td.prtv_dive', table).forEach(function(el){
		dojo.style(el, 'display', (msac ? '' : 'none'));
	});
	dojo.attr(dojo.query('td.prtv_foot_goke', table)[0], 'colSpan', (msac ? 9 : 6));

	//----------- カスタマイズ開始 -------------
	this.errmsg = null;
	if(this.pouch.getWorkSystem() != teasp.constant.WORK_SYSTEM_FLEX){ // フレックスタイム制以外はノーマル
		this.showMain();
	}else{
		var monthId = this.pouch.dataObj.month.id;
		if(!monthId){
			this.monSum.o.fixdays.val		   = '-'; // 所定出勤日数
			this.monSum.o.workFixedTime.val    = '-'; // 所定労働時間
			this.monSum.o.amountTime.val	   = '-'; // 過不足時間
			this.monSum.o.legalOverTime.val    = '-'; // 法定時間内残業
			this.monSum.o.workChargeTime.val   = '-'; // 法定時間外割増
			this.monSum.o.legalOutOverTime.val = '-'; // 法定時間外残業
			this.showMain();
		}else{
			teasp.action.contact.remoteMethod(
				'getExtResult',
				{
					soql: "select tgi100__c,tgi110__c,tgi111__c,tgi112__c,tgi113__c,tgi114__c from AtkEmpMonth__c where Id = '" + monthId + "'",
					limit: 1,
					offset: 0
				},
				dojo.hitch(this, function(result){
					if(result.result == 'NG'){
						this.errmsg = teasp.message.getErrorMessage(result);
						console.log(this.errmsg);
						dojo.create('div', { innerHTML:'ERROR:' + this.errmsg, style:'color:red;' }, dojo.byId('areaBody'));
					}else{
						teasp.util.excludeNameSpace(result);
						this.month = (result.records && result.records.length > 0 ? result.records[0] : null);
						this.monSum.o.fixdays.val		   = teasp.message.getLabel('tm10001010', this.month.tgi100__c); // 所定出勤日数
						this.monSum.o.workFixedTime.val    = this.month.tgi110__c; // 所定労働時間
						this.monSum.o.amountTime.val	   = this.month.tgi111__c; // 過不足時間
						this.monSum.o.legalOverTime.val    = this.month.tgi112__c; // 法定時間内残業
						this.monSum.o.workChargeTime.val   = this.month.tgi113__c; // 法定時間外割増
						this.monSum.o.legalOutOverTime.val = this.month.tgi114__c; // 法定時間外残業
					}
					this.showMain();
				}),
				null,
				this
			);
		}
	}
	//----------- カスタマイズ終了 -------------
};
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
	if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX){ // フレックスタイム制のみ
		var monthId = this.pouch.dataObj.month.id;
		if(!monthId){
			this.refreshBottoms(null);
		}else{
			teasp.action.contact.remoteMethod(
				'getExtResult',
				{
					soql: "select tgi100__c,tgi110__c,tgi111__c,tgi112__c,tgi113__c,tgi114__c from AtkEmpMonth__c where Id = '" + monthId + "'",
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
	var exFixDays = (month ? teasp.message.getLabel('tm10001010', month.tgi100__c) : hifn);
	dojo.create('div', { className: 'left top' , innerHTML: teasp.message.getLabel('fixDays_label') }, dojo.create('td', { className: 'left'  }, row));
	dojo.create('div', { className: 'right top', innerHTML: exFixDays								}, dojo.create('td', { className: 'right' }, row));
	// 実出勤日数
	var exRealDays = (month ? teasp.message.getLabel('tm10001010', this.pouch.getMonthSubValueByKey('workRealDay')) : hifn);
	row = dojo.create('tr', null, tbody);
	dojo.create('div', { className: 'left middle' , innerHTML: teasp.message.getLabel('realDays_label') }, dojo.create('td', { className: 'left'  }, row));
	dojo.create('div', { className: 'right middle', innerHTML: exRealDays								}, dojo.create('td', { className: 'right' }, row));
	var dc = ((this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER) ? 'bottom' : 'middle');
	// 所定労働時間
	var exWorkFixedTime = (month ? month.tgi110__c : hifn);
	row = dojo.create('tr', null, tbody);
	dojo.create('div', { className: 'left '  + dc, innerHTML: teasp.message.getLabel('fixTimeOfDay_label') }, dojo.create('td', { className: 'left'  }, row));
	dojo.create('div', { className: 'right ' + dc, innerHTML: exWorkFixedTime							   }, dojo.create('td', { className: 'right' }, row));
	// 総労働時間
	if(dc == 'middle'){
		row = dojo.create('tr', null, tbody);
		var exWorkWholeTime = (month ? this.pouch.getMonthSubTimeByKey('workWholeTime') : hifn);
		dojo.create('div', { className: 'left bottom' , innerHTML: teasp.message.getLabel('wholeTime_label') }, dojo.create('td', { className: 'left'  }, row));
		dojo.create('div', { className: 'right bottom', innerHTML: exWorkWholeTime							 }, dojo.create('td', { className: 'right' }, row));
	}
	tbody = dojo.byId('totalValueRight');
	dojo.empty(tbody);
	row = dojo.create('tr', null, tbody);
	if(flex){
		var exAmountTime = (month ? month.tgi111__c : hifn);
		dojo.create('div', { className: 'left top' , innerHTML: teasp.message.getLabel('amountTime_label') }, dojo.create('td', { className: 'left'  }, row));
		dojo.create('div', { className: 'right top', innerHTML: exAmountTime							   }, dojo.create('td', { className: 'right' }, row));
	}
	// 法定休日労働
	var workHolidayTime = (!month || this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER ? hifn : this.pouch.getMonthSubTimeByKey('workHolidayTime'));
	row = dojo.create('tr', null, tbody);
	dojo.create('div', { className: 'left '  + (flex ? 'middle' : 'top'), innerHTML: teasp.message.getLabel('legalHolidayWorkTime_label') }, dojo.create('td', { className: 'left'	}, row));
	dojo.create('div', { className: 'right ' + (flex ? 'middle' : 'top'), innerHTML: workHolidayTime									  }, dojo.create('td', { className: 'right' }, row));
	// 法定時間内残業
	var workLegalOverLabel = teasp.message.getLabel(this.pouch.getWorkSystem() != teasp.constant.WORK_SYSTEM_MANAGER && this.pouch.isDefaultUseDiscretionary() ? 'legalOverTimeM_label' : 'legalOverTime_label');
	var workLegalOverTime = (!month || this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER ? hifn : month.tgi112__c);
	row = dojo.create('tr', null, tbody);
	dojo.create('div', { className: 'left middle' , innerHTML: workLegalOverLabel }, dojo.create('td', { className: 'left'	}, row));
	dojo.create('div', { className: 'right middle', innerHTML: workLegalOverTime  }, dojo.create('td', { className: 'right' }, row));
	// 法定時間外残業
	var workLegalOutOverLabel = teasp.message.getLabel(this.pouch.getWorkSystem() != teasp.constant.WORK_SYSTEM_MANAGER && this.pouch.isDefaultUseDiscretionary() ? 'legalOutOverTimeM_label' : 'legalOutOverTime_label');
	var workLegalOutOverTime = (!month || this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER ? hifn : month.tgi114__c);
	dc = (flex || (this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER) ? 'bottom' : 'middle');
	row = dojo.create('tr', null, tbody);
	dojo.create('div', { className: 'left '  + dc, innerHTML: workLegalOutOverLabel }, dojo.create('td', { className: 'left'  }, row));
	dojo.create('div', { className: 'right ' + dc, innerHTML: workLegalOutOverTime	}, dojo.create('td', { className: 'right' }, row));
	if(dc == 'middle'){
		// 空行
		row = dojo.create('tr', null, tbody);
		dojo.create('div', { className: 'left  bottom', innerHTML: '&nbsp;' }, dojo.create('td', { className: 'left'  }, row));
		dojo.create('div', { className: 'right bottom', innerHTML: '&nbsp;' }, dojo.create('td', { className: 'right' }, row));
	}
};
}