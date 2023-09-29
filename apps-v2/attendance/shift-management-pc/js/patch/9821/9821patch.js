if(typeof(teasp) == 'object' && !teasp.resolved['9821'] && teasp.dialog){
teasp.dialog.InputTime.prototype.ready0 = teasp.dialog.InputTime.prototype.ready;
teasp.dialog.InputTime.prototype.ready = function(){
	this.zenNum = ['１','２','３','４','５','６','７','８','９','１０','１１','１２','１３','１４','１５','１６','１７','１８','１９','２０','２１','２２','２３','２４','２５','２６','２７','２８','２９','３０'];
	this.restMax = 15;
	this.ready0();
};
teasp.dialog.EmpApply.prototype.createReviseTimeForm = function(key, node, contId, applyObj, btnbox){
	var fix = (applyObj && teasp.constant.STATUS_FIX.contains(applyObj.status)) || this.isReadOnly();
	var inputClass = this.getInputClass(fix, applyObj);

	var tbody = dojo.create('div', null, node);
	var cell, div;
	var newTimeTable = (applyObj ? dojo.fromJson(applyObj.timeTable.replace(/\\"/g, '"')) : null);
	var oldTimeTable = (applyObj ? dojo.fromJson(applyObj.oldValue.replace(/\\"/g, '"')) : null);
	var reviseType   = (applyObj ? applyObj.reviseType : null);
	var rtSt = (reviseType ? reviseType.substring(2, 3) : null);
	var rtEt = (reviseType ? reviseType.substring(1, 2) : null);
	var rtRe = (reviseType ? reviseType.substring(0, 1) : null);
	var ott = null, ntt = null, orest = [], nrest = [];
	if(oldTimeTable && newTimeTable && reviseType){
		for(var i = 0 ; i < oldTimeTable.length ; i++){
			if (oldTimeTable[i].type == 1) {
				ott = oldTimeTable[i];
			} else if (oldTimeTable[i].type == 21 || oldTimeTable[i].type == 22) {
				orest.push(oldTimeTable[i]);
			}
		}
		for(var i = 0 ; i < newTimeTable.length ; i++){
			if(newTimeTable[i].type == 1){
				ntt = newTimeTable[i];
			} else if (newTimeTable[i].type == 21 || newTimeTable[i].type == 22) {
				nrest.push(newTimeTable[i]);
			}
		}
	}
	orest = teasp.util.sortSpans(orest);
	nrest = teasp.util.sortSpans(nrest);

	var inpLimit = this.dayWrap.getInputLimit();

	var row = dojo.create('div', { className:'empApply2Div' }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('startTime_label') }, row);
	if(applyObj && (fix || !applyObj.active)){
		var msg;
		if(rtSt == '0'){
			msg = teasp.message.getLabel('tk10004100');
		}else{
			msg = teasp.message.getLabel('tk10004091'
					, teasp.message.getLabel('tk10004130'
					, (rtSt == '2'
					? teasp.message.getLabel('tk10004110')
					: teasp.util.time.timeValue(ott.from))
					, (typeof(ntt.from) != 'number'
					? teasp.message.getLabel('tk10004120')
					: teasp.util.time.timeValue(ntt.from))
					)
				);
		}
		dojo.create('div', { innerHTML: msg }, dojo.create('div', { className:'empApply2VL' }, row));
	}else{
		var inp = dojo.create('input', { type:'text', id:'dialogApplyStartTime' + contId, style:'margin:2px;', className: 'inputime roundBegin ' + inputClass, maxLength: 5 }, dojo.create('div', { className:'empApply2VL' }, row));
		inp.value = (ntt ? teasp.util.time.timeValue(ntt.from) : this.dayWrap.getStartTime(false, null, teasp.constant.C_REAL));
		inp.disabled = (inpLimit.flag & 1);
		inp.style.backgroundColor = ((inpLimit.flag & 1) ? '#f5f5f5' : '#ffffff');
		this.eventHandles.push(dojo.connect(inp, 'blur'      , this, teasp.util.time.onblurTime    ));
		this.eventHandles.push(dojo.connect(inp, 'onkeypress', this, teasp.util.time.onkeypressTime));
	}
	row = dojo.create('div', { className:'empApply2Div' }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('endTime_label') }, row);
	if(applyObj && (fix || !applyObj.active)){
		var msg;
		if(rtEt == '0'){
			msg = teasp.message.getLabel('tk10004100');
		}else{
			msg = teasp.message.getLabel('tk10004091'
					, teasp.message.getLabel('tk10004130'
					, (rtEt == '2'
					? teasp.message.getLabel('tk10004110')
					: teasp.util.time.timeValue(ott.to))
					, (typeof(ntt.to) != 'number'
					? teasp.message.getLabel('tk10004120')
					: teasp.util.time.timeValue(ntt.to))
					)
				);
		}
		dojo.create('div', { innerHTML: msg }, dojo.create('div', { className:'empApply2VL' }, row));
	}else{
		var inp = dojo.create('input', { type:'text', id:'dialogApplyEndTime' + contId, style:'margin:2px;', className: 'inputime roundEnd ' + inputClass, maxLength: 5 }, dojo.create('div', { className:'empApply2VL' }, row));
		inp.value = (ntt ? teasp.util.time.timeValue(ntt.to) : this.dayWrap.getEndTime(false, null, teasp.constant.C_REAL));
		inp.disabled = (inpLimit.flag & 2);
		inp.style.backgroundColor = ((inpLimit.flag & 2) ? '#f5f5f5' : '#ffffff');
		this.eventHandles.push(dojo.connect(inp, 'blur'      , this, teasp.util.time.onblurTime    ));
		this.eventHandles.push(dojo.connect(inp, 'onkeypress', this, teasp.util.time.onkeypressTime));
		inp = null;
	}

	var insertRestRow = dojo.hitch(this, function(){
		var div = dojo.byId('dialogApplyReviseRestArea' + contId);
		if(!div){
			return;
		}
		var fxtimes = this.dayWrap.getFixTimeNums();
		var tbody = dojo.byId('dialogApplyReviseRestBody' + contId);
		var row = dojo.create('tr', null, tbody);

		var cell = dojo.create('td', { style: { paddingTop:"1px" } }, row);
		var inp = dojo.create('input', {
			type      : 'text',
			value     : '',
			maxlength : '5',
			style     : { margin:"0px" },
			className : 'inputran inputime roundBegin'
		}, cell);
		this.eventHandles.push(dojo.connect(inp, 'blur'      , this, teasp.util.time.onblurTime    ));
		this.eventHandles.push(dojo.connect(inp, 'onkeypress', this, teasp.util.time.onkeypressTime));
		dojo.attr(inp, 'fxtimes', fxtimes);

		dojo.create('td', {
			innerHTML : teasp.message.getLabel('wave_label'),
			width     : '20px',
			style     : { paddingTop:"1px", textAlign:"center" }
		}, row);

		cell = dojo.create('td', { style: { paddingTop:"1px" } }, row);
		inp = dojo.create('input', {
			type      : 'text',
			value     : '',
			maxlength : '5',
			style     : { margin:"0px" },
			className : 'inputran inputime roundEnd'
		}, cell);
		this.eventHandles.push(dojo.connect(inp, 'blur'      , this, teasp.util.time.onblurTime    ));
		this.eventHandles.push(dojo.connect(inp, 'onkeypress', this, teasp.util.time.onkeypressTime));
		dojo.attr(inp, 'fxtimes', fxtimes);

		cell = dojo.create('td', { width: '66px', style: { paddingTop:"1px", paddingLeft:"12px", textAlign:"center" } }, row);
		dojo.create('div', {
			className : 'pp_base pp_btn_del',
			style     : { cursor:"pointer" },
			title     : teasp.message.getLabel('delete_menu'),
			onclick   : function(e){
				if (!e) e = window.event;
				var div = (e.srcElement ? e.srcElement : e.target);
				var r = div.parentNode.parentNode;
				if(r.tagName == 'TR'){
					var st = r.cells[0].firstChild.value.trim();
					var et = r.cells[2].firstChild.value.trim();
					st = (st != '' ? teasp.util.time.clock2minutes(st) : null);
					et = (et != '' ? teasp.util.time.clock2minutes(et) : null);
					var t = { from: st, to: et };
					if(t.from != null || t.to != null){
						if(!confirm(teasp.message.getLabel('tm10003940'))){
							return;
						}
					}
					dojo.byId('dialogApplyReviseRestAdd' + contId).className = 'pb_base pb_btn_plus';
					dojo.byId('dialogApplyReviseRestAdd' + contId).disabled = false;
					var tbody = dojo.byId('dialogApplyReviseRestBody' + contId);
					tbody.deleteRow(r.rowIndex);
					teasp.dialog.EmpApply.adjustContentHeight();
				}
			}
		}, cell);

		if(tbody.rows.length >= 15){
			dojo.byId('dialogApplyReviseRestAdd' + contId).className = 'pb_base pb_btn_plus_dis';
			dojo.byId('dialogApplyReviseRestAdd' + contId).disabled = true;
		}
		teasp.dialog.EmpApply.adjustContentHeight();
	});
	row = dojo.create('div', { className:'empApply2Div' }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('restTime_label') }, row);
	if(applyObj && (fix || !applyObj.active)){
		var msg;
		if(rtRe == '0'){
			msg = teasp.message.getLabel('tk10004100');
		}else{
			var oldRests = [];
			for(var i = 0 ; i < orest.length ; i++){
				oldRests.push(teasp.message.getLabel('tm10010461', teasp.util.time.timeValue(orest[i].from), teasp.util.time.timeValue(orest[i].to)));
			}
			var newRests = [];
			for(var i = 0 ; i < nrest.length ; i++){
				newRests.push(teasp.message.getLabel('tm10010461', teasp.util.time.timeValue(nrest[i].from), teasp.util.time.timeValue(nrest[i].to)));
			}
			msg = teasp.message.getLabel('tk10004091'
				, teasp.message.getLabel('tk10004130'
				, (oldRests.length ? oldRests.join(', ') : teasp.message.getLabel('tk10004120'))
				, (newRests.length ? newRests.join(', ') : teasp.message.getLabel('tk10004120'))));
		}
		dojo.create('div', {
			innerHTML: msg
		}, dojo.create('div', {
			className:'empApply2VL',
			style:dojo.string.substitute('width:${0};', [this.valueWidth])
		}, row));
	}else{
		var hidR = (!rtRe || rtRe == '0');
		var rtb = dojo.create('tbody', null, dojo.create('table', { className: 'pane_tble' }, dojo.create('div', { className:'empApply2VL' }, row)));
		row  = dojo.create('tr', { id: 'dialogApplyReviseRestRow1' + contId }, rtb);
		if(!hidR){
			row.style.display = 'none';
		}
		cell = dojo.create('td', null, row);
		var label = dojo.create('label', null, cell);
		var chk  = dojo.create('input', { type: 'checkbox', id: 'dialogApplyReviseRestChk' + contId }, label);
		label.appendChild(dojo.doc.createTextNode(' ' + teasp.message.getLabel('tm10003930')));
		this.eventHandles.push(dojo.connect(chk, 'onclick', this, function(){
			dojo.style('dialogApplyReviseRestRow1' + contId, 'display', 'none');
			dojo.style('dialogApplyReviseRestRow2' + contId, 'display', '');
			teasp.dialog.EmpApply.adjustContentHeight();
		}));
		row  = dojo.create('tr', { id: 'dialogApplyReviseRestRow2' + contId }, rtb);
		if(hidR){
			row.style.display = 'none';
		}
		cell = dojo.create('td', null, row);
		div  = dojo.create('div', { id: 'dialogApplyReviseRestArea' + contId, style:"width:200px;min-height:24px;padding:0px;margin:0px;border:1px solid #539AC7;overflow-x:hidden;" }, cell);
		if(!teasp.isNarrow()){
			dojo.style(div, 'max-height', '110px');
		}
		dojo.create('tbody', { id: 'dialogApplyReviseRestBody' + contId }, dojo.create('table', { className: 'pane_tble', style: { width:"100%" } }, div));
		cell = dojo.create('td', { style: { paddingLeft:"8px", verticalAlign:"bottom" } }, row);
		var inp = dojo.create('input', { type: 'button', id: 'dialogApplyReviseRestAdd' + contId, className: 'pb_base pb_btn_plus' }, cell);
		inp.onclick = insertRestRow;
	}
	insertRestRow();

	this.createNoteParts(key, tbody, contId, applyObj);

	this.createApplySetParts (key, tbody, contId, applyObj);
	this.createApplyTimeParts(key, tbody, contId, applyObj);
	this.createStatusParts   (key, tbody, contId, applyObj);
	this.createErrorParts    (key, tbody, contId);

	if(btnbox){
		dojo.place(btnbox, tbody);
	}

	var timeTable = (this.dayWrap.getTimeTable() || []);
	var ttx = dojo.clone(timeTable);
	for(var i = ttx.length - 1 ; i >= 0 ; i--){
		if(ttx[i].type != teasp.constant.REST_FIX
		&& ttx[i].type != teasp.constant.REST_FREE){
			ttx.splice(i, 1);
		}
	}
	var pattern   = this.dayWrap.getPattern();
	if(!applyObj){
		var rests = [];
		if((this.dayWrap.getStartTime(false, '', teasp.constant.C_REAL) !== ''
		 || this.dayWrap.getEndTime  (false, '', teasp.constant.C_REAL) !== '')
		&& timeTable.length > 0){
			for(var i = 0 ; i < timeTable.length ; i++){
				var tt = timeTable[i];
				if(tt.type == teasp.constant.REST_FIX || tt.type == teasp.constant.REST_FREE){
					rests.push(tt);
				}
			}
		}else{
			if(pattern){
				for(i = 0 ; i < pattern.restTimes.length ; i++){
					var tt = pattern.restTimes[i];
					rests.push(tt);
				}
			}
		}
		rests = rests.sort(function(a, b){
			var na = (typeof(a.from) == 'number' ? a.from : a.to);
			var nb = (typeof(b.from) == 'number' ? b.from : b.to);
			return na - nb;
		});
		tbody = dojo.byId('dialogApplyReviseRestBody' + contId);
		for(var i = 0 ; i < rests.length ; i++){
			if(i >= tbody.rows.length){
				insertRestRow();
			}
			row = tbody.rows[i];
			row.cells[0].firstChild.value = this.pouch.getDisplayTime(rests[i].from);
			row.cells[2].firstChild.value = this.pouch.getDisplayTime(rests[i].to  );
		}
	}else if(!fix && nrest && applyObj.active){
		tbody = dojo.byId('dialogApplyReviseRestBody' + contId);
		for(var i = 0 ; i < nrest.length ; i++){
			if(i >= tbody.rows.length){
				insertRestRow();
			}
			row = tbody.rows[i];
			row.cells[0].firstChild.value = this.pouch.getDisplayTime(nrest[i].from);
			row.cells[2].firstChild.value = this.pouch.getDisplayTime(nrest[i].to  );
		}
	}
	var oht = this.dayWrap.getTimeHolidayTime(ttx.length > 0 ? ttx : (pattern ? pattern.restTimes : []));

	this.drawLast(applyObj, node);

	var btnOk = dojo.byId('empApplyDone' + contId);
	if(btnOk){
		this.eventHandles.push(dojo.connect(btnOk, 'onclick', this, function(e){
			var st = teasp.util.time.clock2minutes(dojo.byId('dialogApplyStartTime' + contId).value);
			var et = teasp.util.time.clock2minutes(dojo.byId('dialogApplyEndTime'   + contId).value);

			if(typeof(st) == 'number' || typeof(et) == 'number'){
				if(!this.dayWrap.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)){
					if(this.dayWrap.isHoliday()){
						teasp.dialog.EmpApply.showError(contId
								, teasp.message.getLabel('tk10005250'
								, teasp.message.getLabel('confHoliday_label')));
						return;
					}
					if(this.dayWrap.isPlannedHoliday()){
						teasp.dialog.EmpApply.showError(contId
								, teasp.message.getLabel('tk10005250'
								, teasp.message.getLabel('tm10001360')));
						return;
					}
				}
				if(this.dayWrap.getObj().interim){
					teasp.dialog.EmpApply.showError(contId
								, teasp.message.getLabel('tk10005250'
								, teasp.message.getLabel('tk10005260')));
					return;
				}
			}
			if(typeof(st) == 'number' && typeof(et) == 'number' && st >= et){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002020'));
				return;
			}
			if(typeof(st) == 'number' && st >= 1440){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002030'));
				return;
			}
			if(typeof(et) == 'number' && et > 2880){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002040'));
				return;
			}
			var pd = this.pouch.getEmpDay(teasp.util.date.addDays(this.args.date, -1));
			var nd = this.pouch.getEmpDay(teasp.util.date.addDays(this.args.date, 1));
			if(pd && typeof(pd.getObj().endTime) == 'number' && pd.getObj().endTime > 1440){
				var pe = pd.getObj().endTime - 1440;
				if(typeof(st) == 'number' && st < pe){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002060'));
					return;
				}
			}
			if(nd && typeof(et) == 'number' && et > 1440){
				if(typeof(nd.getObj().startTime) == 'number'){
					var ce = et - 1440;
					if(ce > nd.getObj().startTime){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002070'));
						return;
					}
				}
				var h = nd.getProhibitOverNightWorkHoliday();
				if(h){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008360', h.name));
					return;
				}
			}
			var pattern = this.dayWrap.getPattern();
			var isFixRest = function(o){
				if(pattern){
					for(var i = 0 ; i < pattern.restTimes.length ; i++){
						var rt = pattern.restTimes[i];
						if(rt.from == o.from && rt.to == o.to){
							return true;
						}
					}
				}
				return false;
			};
			var getFixRests = function(){
				var fixRests = [];
				if(pattern){
					for(var i = 0 ; i < pattern.restTimes.length ; i++){
						var tt = pattern.restTimes[i];
						tt.type = teasp.constant.REST_FIX;
						fixRests.push(tt);
					}
				}
				if(fixRests.length > 0){
					fixRests = fixRests.sort(function(a, b){
						var na = (typeof(a.from) == 'number' ? a.from : a.to);
						var nb = (typeof(b.from) == 'number' ? b.from : b.to);
						return na - nb;
					});
				}
				return fixRests;
			};
			var getInputRests = dojo.hitch(this, function(flag){
				var o, from, to;
				var rests = [];
				var tbody = dojo.byId('dialogApplyReviseRestBody' + contId);
				for(var i = 0 ; i < tbody.rows.length ; i++){
					var row = tbody.rows[i];
					from = teasp.util.time.clock2minutes(row.cells[0].firstChild.value);
					to   = teasp.util.time.clock2minutes(row.cells[2].firstChild.value);
					if(typeof(from) == 'number' || typeof(to) == 'number'){
						o = {
							from: (typeof(from) == 'number' ? from : null),
							to  : (typeof(to)   == 'number' ? to   : null)
						};
						o.type = isFixRest(o) ? teasp.constant.REST_FIX : teasp.constant.REST_FREE;
						rests.push(o);
					}
				}
				if(flag){
					rests = rests.concat(this.dayWrap.getHourRests());
				}
				rests = rests.sort(function(a, b){
					var na = (typeof(a.from) == 'number' ? a.from : a.to);
					var nb = (typeof(b.from) == 'number' ? b.from : b.to);
					return na - nb;
				});
				return rests;
			});
			var newRests = getInputRests(false);
			var inprng = this.dayWrap.getInputTimeRange(newRests);
			var adjust = 0;
			if(typeof(st) == 'number' && st < inprng.from){
				adjust = (typeof(et) == 'number' && et <= inprng.from) ? -1 : 1;
			}
			if(typeof(et) == 'number' && et > inprng.to){
				adjust = (typeof(st) == 'number' && st >= inprng.to) ? -1 : 2;
			}
			if(adjust < 0){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002080'));
				return;
			}else if(adjust){
				if(confirm(teasp.message.getLabel('tm10002090',
						(adjust == 1 ? teasp.message.getLabel('startTime_label') : teasp.message.getLabel('endTime_label'))))){
					if(adjust == 1){
						st = inprng.from;
						dojo.byId('dialogApplyStartTime' + contId).value = teasp.util.time.timeValue(st);
					}else{
						et = inprng.to;
						dojo.byId('dialogApplyEndTime'   + contId).value = teasp.util.time.timeValue(et);
					}
				}else{
					return;
				}
			}
			var fixRests  = getFixRests();
			var keepExterior = this.pouch.isKeepExteriorTime();
			var resp = checkTimes(getInputRests(true), [], fixRests, st, et, keepExterior);
			if(resp.message){
				teasp.dialog.EmpApply.showError(contId, resp.message);
				return;
			}
			var nht = this.dayWrap.getTimeHolidayTime(resp.timeTable);
			if(oht != nht){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10005110'));
				return;
			}
			var oldSt = this.dayWrap.getStartTime(true, '', teasp.constant.C_REAL);
			var oldEt = this.dayWrap.getEndTime  (true, '', teasp.constant.C_REAL);
			if(oldSt === ''){ oldSt = null; }
			if(oldEt === ''){ oldEt = null; }
			var newSt = (typeof(resp.startTime) == 'number' ? resp.startTime : null);
			var newEt = (resp.endTime   || null);
			var old = { from: (oldSt == '' ? null : oldSt), to: (oldEt == '' ? null : oldEt), type: 1 };
			var revSt = (old.from === newSt ? '0' : (old.from === null ? '2' : '1'));
			var revEt = (old.to   === newEt ? '0' : (old.to   === null ? '2' : '1'));
			var revRt = '0';
			var ott = [];
			ott.push(old);
			var oldAways = [];
			var oldRests = [];
			if(old.from === null && old.to === null){
				ott = ott.concat(pattern.restTimes);
				oldRests = pattern.restTimes;
			}else{
				var tt = this.dayWrap.getTimeTable();
				for(var i = 0 ; i < tt.length ; i++){
					if(tt[i].type == teasp.constant.AWAY){
						oldAways.push(tt[i]);
					}else if(tt[i].type == teasp.constant.REST_FIX || tt[i].type == teasp.constant.REST_FREE){
						oldRests.push(tt[i]);
					}
				}
				ott = ott.concat(tt);
			}
			oldRests = oldRests.sort(function(a, b){
				var na = (typeof(a.from) == 'number' ? a.from : a.to);
				var nb = (typeof(b.from) == 'number' ? b.from : b.to);
				return na - nb;
			});
			if(newRests.length != oldRests.length){
				revRt = '1';
			}else{
				for(i = 0 ; i < newRests.length ; i++){
					if(newRests[i].from !== oldRests[i].from
					|| newRests[i].to !== oldRests[i].to){
						revRt = '1';
						break;
					}
				}
			}
			if(this.pouch.isProhibitBorderRestTime()
			&& teasp.logic.EmpTime.checkBorderRestTime(newSt, newEt, resp.timeTable)){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008400'));
				return;
			}
			var timeTable = [{ from: newSt, to: newEt, type: 1 }].concat(resp.timeTable).concat(oldAways);
			var revise = revRt + revEt + revSt;
			if(revise == '000'){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003950'));
				return;
			}
			if(revise == '100' && (old.from === null && old.to === null)){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008520'));
				return;
			}else if(newSt === null && newEt === null){
				var diff = false;
				var tgtrs = (revRt == '1' ? newRests : oldRests);
				if(tgtrs.length != fixRests.length){
					diff = true;
				}else{
					for(var i = 0 ; i < tgtrs.length ; i++){
						var rest = tgtrs[i];
						var fr = (i < fixRests.length ? fixRests[i] : null);
						if(!fr || rest.from != fr.from || rest.to != fr.to){
							diff = true;
							break;
						}
					}
				}
				if(diff){
					if(revRt == '0'){
						revRt = '1';
					}else{
						tgtrs = oldRests;
						diff = false;
						if(tgtrs.length != fixRests.length){
							diff = true;
						}else{
							for(var i = 0 ; i < tgtrs.length ; i++){
								var rest = tgtrs[i];
								var fr = (i < fixRests.length ? fixRests[i] : null);
								if(!fr || rest.from != fr.from || rest.to != fr.to){
									diff = true;
									break;
								}
							}
						}
						if(!diff){
							if(revise.substring(1) == '00'){
								teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008530'));
								return;
							}
							revRt = '0';
						}
					}
					alert(teasp.message.getLabel('tf10008530'));
					newRests = fixRests;
					timeTable = [{ from: newSt, to: newEt, type: 1 }].concat(newRests).concat(oldAways);
					revise = revRt + revEt + revSt;
				}
			}
			var oldRt = null, newRt = null;
			if (revRt != '0') {
				var or = [], nr = [];
				for(var i = 0 ; i < oldRests.length ; i++){
					or.push(teasp.message.getLabel('tm10010461', teasp.util.time.timeValue(oldRests[i].from), teasp.util.time.timeValue(oldRests[i].to)));
				}
				for(var i = 0 ; i < newRests.length ; i++){
					nr.push(teasp.message.getLabel('tm10010461', teasp.util.time.timeValue(newRests[i].from), teasp.util.time.timeValue(newRests[i].to)));
				}
				oldRt = or.join(', ');
				newRt = nr.join(', ');
			}
			var para = this.pouch.isParallelMessage();
			var noMod = teasp.message.getLabel(para ? 'zw00102200' : 'zv00102200');
			var noEnt = teasp.message.getLabel(para ? 'zw00102190' : 'zv00102190');
			var noInp = teasp.message.getLabel(para ? 'zw00102210' : 'zv00102210');
			var contss = [
				[
					teasp.message.getLabel(para ? 'zw00102160' : 'zv00102160'),
					(revSt == '0' ? noMod : (old.from === null ? noEnt : teasp.util.time.timeValue(old.from))),
					(revSt == '0' ? null  : (newSt    === null ? noInp : teasp.util.time.timeValue(newSt   )))
				],
				[
					teasp.message.getLabel(para ? 'zw00102170' : 'zv00102170'),
					(revEt == '0' ? noMod : (old.to   === null ? noEnt : teasp.util.time.timeValue(old.to  ))),
					(revEt == '0' ? null  : (newEt    === null ? noInp : teasp.util.time.timeValue(newEt   )))
				],
				[
					teasp.message.getLabel(para ? 'zw00102180' : 'zv00102180'),
					(revRt == '0' ? noMod : (!oldRt ? noInp : oldRt)),
					(revRt == '0' ? null  : (!newRt ? noInp : newRt))
				]
			];
			var parts = [];
			for(var i = 0 ; i < contss.length ; i++){
				var conts = contss[i];
				var fmt = (para ? 'zw00102140' : 'zv00102140');
				if(!conts[2]){
					fmt = (para ? 'zw00102150' : 'zv00102150');
				}
				parts.push(teasp.message.getLabel(fmt, conts[0], conts[1], conts[2]));
			}
			var content = parts.join('\n');

			var req = {
				empId            : this.pouch.getEmpId(),
				month            : this.pouch.getYearMonth(),
				startDate        : this.pouch.getStartDate(),
				lastModifiedDate : this.pouch.getLastModifiedDate(),
				date             : this.args.date,
				apply            : {
					id           : (applyObj ? applyObj.id : null),
					applyType    : teasp.constant.APPLY_TYPE_REVISETIME,
					patternId    : null,
					holidayId    : null,
					status       : null,
					startDate    : this.args.date,
					endDate      : this.args.date,
					exchangeDate : null,
					startTime    : null,
					endTime      : null,
					note         : (dojo.byId('dialogApplyNote' + contId).value || null),
					contact      : null,
					timeTable    : dojo.toJson(timeTable),
					oldValue     : dojo.toJson(ott),
					reviseType   : revise,
					content      : content
				}
			};
			if(this.pouch.isRequireNote(teasp.constant.APPLY_KEY_REVISETIME)
			&& !req.apply.note){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003680'));
				return;
			}
			this.requestSend(contId, req);
		}));
	}
};
}