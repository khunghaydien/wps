// 勤務表カスタマイズ-開始-
if(typeof(teasp) == 'object' && !teasp.resolved['DLW2'] && teasp.view && teasp.view.Monthly){
if(teasp.helper.Summary){
	teasp.view.Monthly.prototype.showTimeViewBottom2 = teasp.view.Monthly.prototype.showTimeViewBottom;
	teasp.view.Monthly.prototype.showTimeViewBottom = function(){
		//----------- カスタマイズ開始 -------------
		if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX){
			this.refreshBottoms(null);
		}
		//----------- カスタマイズ終了 -------------
		this.showTimeViewBottom2();
		var tbl = dojo.query('#bottomSummaryTable > div:nth-child(2)');
		if(tbl.length){
			dojo.style(tbl[0], 'min-width', '260px');
			dojo.style(tbl[0], 'width', 'auto');
		}
	};
	teasp.helper.Summary.prototype.getTimeViewBottomContents = function(){
		var defaults = this.getDefaultTimeViewBottomContents(this.monSum.o);
		var contents = this.getSummaryContentsByCategory('timeViewBottom', this.categoryL, this.categoryS);
		if(!contents){
			contents = defaults;
		}else{
			contents = this.mergeFields(defaults, contents);
		}
		contents = this.buildFields(this.setDefaultSummaryValues(contents));
		contents.numberOfColumns = contents.numberOfColumns || 0;
		// カスタマイズ開始
		if(this.pouch.dataObj.month.dlw4Label){
			for(var key in contents){
				if(!/^column\d$/.test(key)){
					continue;
				}
				var lst = contents[key];
				for(var i = 0 ; i < lst.length ; i++){
					var o = lst[i];
					if(o.apiKey == 'dlw4'){
						o.label = this.pouch.dataObj.month.dlw4Label;
					}
				}
			}
		}
		// カスタマイズ終了
		return contents;
	};
}else{
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
		if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX){
			this.refreshBottoms(null);
		}
		//----------- カスタマイズ終了 -------------
	};
}
// オリジナルにはない関数
// 時間単位有休の正味時間を得る
teasp.view.Monthly.prototype.getRealRestTime = function(day){
	if(!day.rack){
		return 0;
	}
	var rests = ((day.startTime === null && day.endTime === null)
			? day.pattern.restTimes
			: day.rack.fixRests.concat(day.rack.freeRests));
	var holidayTimes = [];
	dojo.forEach(day.rack.validApplys.holidayTime || [], function(ht){
		holidayTimes.push({ from: ht.startTime, to: ht.endTime });
	});
	var realRestTimes = teasp.util.time.excludeRanges(holidayTimes, rests);
	return teasp.logic.EmpTime.getSpanTime(realRestTimes);
}
teasp.view.Monthly.prototype.refreshBottoms = function(month){
	var pouch = this.pouch;
	var workWholeTime   = pouch.getMonthSubValueByKey('workWholeTime')   || 0; // 総労働時間
	var workHolidayTime = pouch.getMonthSubValueByKey('workHolidayTime') || 0; // 法定休日労働

	var today = pouch.getToday();
	var ysday = teasp.util.date.addDays(today, -1);
	var atday = pouch.dataObj.month.amountTimeDate;

	var sd = pouch.dataObj.month.startDate;
	var d = sd;
	var prt = 0;
	var wht = 0;
	var fxt = 0;
	var hwk = 0;
	while(d <= atday){
		var day = pouch.dataObj.days[d];
		wht += (day.disc && day.disc.workWholeTime) || 0;   // 総労働時間
		hwk += (day.disc && day.disc.workHolidayTime) || 0; // 法定休日労働
		fxt += (day.rack && day.rack.fixTime) || 0;         // 所定労働時間
		prt += this.getRealRestTime(day);                   // 時間単位休（正味）
		d = teasp.util.date.addDays(d, 1);
	}
	var t = wht - hwk - fxt - prt;
	var made = '';
	if(today == atday || ysday == atday){
		made = teasp.message.getLabel('tm10001020', teasp.util.date.formatDate(atday, 'M/d'));
	}
	// 時間単位休（正味）の当月合計も得ておく（動作確認用として（adjustTimeYuq_Min__c と一致してなければならない。デバッガコンソールで teasp.viewPoint.pouch.dataObj.month を参照して確認可能））
	d = sd;
	prt = 0;
	while(d <= pouch.dataObj.month.endDate){
		var day = pouch.dataObj.days[d];
		prt += this.getRealRestTime(day); // 時間単位休（正味）
		d = teasp.util.date.addDays(d, 1);
	}
	paidRestTime = prt; // 時間単位休（正味）

	pouch.dataObj.month.dlw1 = teasp.util.time.timeValue(Math.max(workWholeTime - paidRestTime, 0));
	pouch.dataObj.month.dlw2 = teasp.util.time.timeValue(paidRestTime);
	pouch.dataObj.month.dlw3 = teasp.util.time.timeValue(Math.max(workWholeTime - paidRestTime - workHolidayTime, 0));
	pouch.dataObj.month.dlw4 = (t > 0 ? '+' : '') + teasp.util.time.timeValue(t);
	pouch.dataObj.month.dlw4Label = '●所定労働時間過不足' + made;

	if(!teasp.helper.Summary){
		// 集計エリア左側
		var lbody = dojo.byId('totalValueLeft');
		var lr1 = dojo.query('tr:first-child' , lbody)[0];
		var lr2 = dojo.query('tr:nth-child(2)', lbody)[0];
		var lr3 = dojo.query('tr:nth-child(3)', lbody)[0];
		var lr4 = dojo.query('tr:nth-child(4)', lbody)[0];
		dojo.place(lr2, lr3, 'after'); // 2行目と3行目入れ替え
		dojo.query('td.left > div' , lr1)[0].innerHTML = '所定労働日数';
		dojo.query('td.left > div' , lr2)[0].innerHTML = '労働日数';
		dojo.query('td.left > div' , lr4)[0].innerHTML = '労働時間';
		dojo.query('td.right > div', lr4)[0].innerHTML = pouch.dataObj.month.dlw1;

		// 集計エリア右側
		var rbody = dojo.byId('totalValueRight');
		var rr1 = dojo.query('tr:first-child' , rbody)[0];
		var rr2 = dojo.query('tr:nth-child(2)', rbody)[0];
		var rr3 = dojo.query('tr:nth-child(3)', rbody)[0];
		var rr4 = dojo.query('tr:nth-child(4)', rbody)[0];
		dojo.query('td.left > div' , rr1)[0].innerHTML = '調整時間';
		dojo.query('td.right > div', rr1)[0].innerHTML = pouch.dataObj.month.dlw2;
		dojo.query('td.left > div' , rr3)[0].innerHTML = '●清算対象時間';
		dojo.query('td.right > div', rr3)[0].innerHTML = pouch.dataObj.month.dlw3;
		dojo.query('td.left > div' , rr4)[0].innerHTML = pouch.dataObj.month.dlw4Label;
		dojo.query('td.right > div', rr4)[0].innerHTML = pouch.dataObj.month.dlw4;

		var tbl = dojo.query('#bottomSummaryTable > div:nth-child(2)');
		if(tbl.length){
			dojo.style(tbl[0], 'min-width', '260px');
			dojo.style(tbl[0], 'width', 'auto');
		}
	}
};
}
// 勤務表カスタマイズ-終了-
