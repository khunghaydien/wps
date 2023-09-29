if(typeof(teasp) == 'object' && !teasp.resolved['FUJITV'] && teasp.view && teasp.view.MonthlySummary && teasp.view.Monthly && /(AtkHomeView|AtkWorkTimePrintView)/.test(location.pathname)){
if(teasp.helper.Summary){
	teasp.data.Pouch.prototype.getEmpDay = function(dkey){
		var dw = new teasp.data.EmpDay(this, dkey);
		var day = dw.day;
		var va = (day && day.rack && day.rack.validApplys);
		if(va){
			delete va.lateStart;
			delete va.earlyEnd;
		}
		if(day.real && day.real.lateTime > 0){
			day.real.lateTime = day.real.lateLostTime = day.real.lateCount = 0;
		}
		if(day.real && day.real.earlyTime > 0){
			day.real.earlyTime = day.real.earlyLostTime = day.real.earlyCount = 0;
		}
		return dw;
	};
}else{
	teasp.prefixBar = 'teamspirit__';
	teasp.view.MonthlySummary.prototype.show = function(){
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
		var monthId = this.pouch.dataObj.month.id;
		if(!monthId){
			this.showMain();
		}else{
			teasp.action.contact.remoteMethod(
				'getExtResult',
				{
					soql: "select TS_001__c,TS_015__c,TS_019__c,zancount__c,WorkRealTimeH__c,WorkRealTime__c,WorkOverTime36H__c,WorkOverTime36__c from AtkEmpMonth__c where Id = '" + monthId + "'",
					limit: 1,
					offset: 0
				},
				dojo.hitch(this, function(result){
					if(result.result == 'NG'){
						this.errmsg = teasp.message.getErrorMessage(result);
						console.log(this.errmsg);
					}else{
						teasp.util.excludeNameSpace(result);
						this.month = (result.records && result.records.length > 0 ? result.records[0] : null);
					}
					this.showMain();
				}),
				null,
				this
			);
		}
		//----------- カスタマイズ終了 -------------
	};
	// 関数カスタマイズ
	teasp.view.MonthlySummary.prototype.showMain = function(){
		this.eraseLateAndEarly(); // カスタマイズ=遅刻・早退を非表示にする
		this.showControl();
		this.showLabel();
		this.showHead();
		this.showVariant();
		this.showDayBody();
		this.showDayFoot();
		this.showSummaryLabel();
	};
	teasp.view.MonthlySummary.prototype.showSummaryLabel = function(){
		var eL = teasp.util.getAncestorByTagName(dojo.byId('monsumSum01')    , 'TABLE').parentNode;
		var eM = teasp.util.getAncestorByTagName(dojo.byId('monthlyLegalMax'), 'TABLE').parentNode;
		var eR = teasp.util.getAncestorByTagName(dojo.byId('monsumSum29')    , 'TABLE').parentNode;
		dojo.empty(eL);
		dojo.empty(eM);
		dojo.empty(eR);
		console.log(this.month);

		var msum = [
			{ col:'実就業日数'    , val:this.getRealDays() },
			{ col:'実休日日数'    , val:this.getTS015()    }, // TS_015__c
			{ col:'総労働時間'    , val:this.getRealTime() }, // teamspirit__WorkRealTimeH__c
			{ col:'法定労働時間'  , val:this.getTS001()    }, // TS_001__c
			{ col:'法定超過時間'  , val:this.getTS019()    }, // TS_019__c
			{ col:'36協定時間外'  , val:this.getWorkOverTime36() }, // teamspirit__WorkOverTime36H__c
			{ col:'特別条項残回数', val:this.getZancount() } // zancount__c
		];

		var n = 0;
		var tbody = dojo.create('tbody', null, dojo.create('table', { className:'total_table' }, eL));
		for(var i = 0 ; i < 2 ; i++){
			var tr = dojo.create('tr', { className:((i%2)==0?'even':'odd') }, tbody);
			dojo.create('div', { innerHTML:msum[n].col }, dojo.create('td', { className:'column' }, tr));
			dojo.create('div', { innerHTML:msum[n].val }, dojo.create('td', { className:'value'  }, tr));
			n++
		}
		dojo.create('div', { style:'height:4px;' }, eL);

		tbody = dojo.create('tbody', null, dojo.create('table', { className:'total_table' }, eL));
		for(var i = 0 ; i < 3 ; i++){
			var tr = dojo.create('tr', { className:((i%2)==0?'even':'odd') }, tbody);
			dojo.create('div', { innerHTML:msum[n].col }, dojo.create('td', { className:'column' }, tr));
			dojo.create('div', { innerHTML:msum[n].val }, dojo.create('td', { className:'value'  }, tr));
			n++
		}
		dojo.create('div', { style:'height:4px;' }, eL);

		tbody = dojo.create('tbody', null, dojo.create('table', { className:'total_table' }, eL));
		for(var i = 0 ; i < 2 ; i++){
			var tr = dojo.create('tr', { className:((i%2)==0?'even':'odd') }, tbody);
			dojo.create('div', { innerHTML:msum[n].col }, dojo.create('td', { className:'column' }, tr));
			dojo.create('div', { innerHTML:msum[n].val }, dojo.create('td', { className:'value'  }, tr));
			n++
		}

		if(this.errmsg){
			dojo.create('div', { innerHTML:'ERROR:' + this.errmsg, style:'color:red;' }, dojo.byId('areaBody'));
		}
	};
	// オリジナルにはない関数
	teasp.view.MonthlySummary.prototype.eraseLateAndEarly = function(){ // イベント／勤務状況欄の遅刻・早退を非表示にする
		var dayList = this.pouch.getMonthDateList();
		for(var i = 0 ; i < dayList.length ; i++){
			var dk = dayList[i];
			var day = this.pouch.dataObj.days[dk];
			var va = (day && day.rack && day.rack.validApplys);
			if(va){
				delete va.lateStart;
				delete va.earlyEnd;
			}
			if(day.real && day.real.lateTime > 0){
				day.real.lateTime = day.real.lateLostTime = day.real.lateCount = 0;
			}
			if(day.real && day.real.earlyTime > 0){
				day.real.earlyTime = day.real.earlyLostTime = day.real.earlyCount = 0;
			}
		}
	};
	teasp.view.MonthlySummary.prototype.getRealDays = function(){ // 実就業日数
		return (this.month ? this.monSum.o.realdays.val : '-');
	};
	teasp.view.MonthlySummary.prototype.getTS015 = function(){ // 実休日日数
		return (this.month ? teasp.message.getLabel('tm10001010', this.month.TS_015__c || 0) : '-');
	};
	teasp.view.MonthlySummary.prototype.getRealTime = function(){ // 総労働時間
		return (this.month ? teasp.util.time.timeValue(this.month.WorkRealTime__c) : '-');
	};
	teasp.view.MonthlySummary.prototype.getTS001 = function(){ // 法定労働時間
		return (this.month ? (typeof(this.month.TS_001__c) == 'number' ? teasp.util.time.timeValue(this.month.TS_001__c * 60) : '') : '-');
	};
	teasp.view.MonthlySummary.prototype.getTS019 = function(){ // 法定超過時間
		return (this.month ? (typeof(this.month.TS_019__c) == 'number' ? teasp.util.time.timeValue(this.month.TS_019__c * 60) : '') : '-');
	};
	teasp.view.MonthlySummary.prototype.getWorkOverTime36 = function(){ // 36協定時間外
		return (this.month ? teasp.util.time.timeValue(this.month.WorkOverTime36__c) : '-');
	};
	teasp.view.MonthlySummary.prototype.getZancount = function(){ // 特別条項残回数
		return (this.month ? teasp.message.getLabel('tm10001670', this.month.zancount__c || 0) : '-');
	};
}
}