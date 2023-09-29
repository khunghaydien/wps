/**
 * 勤怠時刻修正申請フォーム生成
 *
 * @param {string} key 申請キー
 * @param {Object} node フォームの親ノード
 * @param {string} contId IDに使用する番号
 */
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
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('startTime_label') }, row); // 出社時刻
	if(applyObj && (fix || !applyObj.active)){
		var msg;
		if(rtSt == '0'){
			msg = teasp.message.getLabel('tk10004100'); // 修正なし
		}else{
			msg = teasp.message.getLabel('tk10004091' // 修正：{0}
					, teasp.message.getLabel('tk10004130'  // {0} → {1}
					, (rtSt == '2'
					? teasp.message.getLabel('tk10004110') // 未入力
					: teasp.util.time.timeValue(ott.from))
					, (typeof(ntt.from) != 'number'
					? teasp.message.getLabel('tk10004120') // 入力なし
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
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('endTime_label') }, row); // 退社時刻
	if(applyObj && (fix || !applyObj.active)){
		var msg;
		if(rtEt == '0'){
			msg = teasp.message.getLabel('tk10004100'); // 修正なし
		}else{
			msg = teasp.message.getLabel('tk10004091' // 修正：{0}
					, teasp.message.getLabel('tk10004130'  // {0} → {1}
					, (rtEt == '2'
					? teasp.message.getLabel('tk10004110') // 未入力
					: teasp.util.time.timeValue(ott.to))
					, (typeof(ntt.to) != 'number'
					? teasp.message.getLabel('tk10004120') // 入力なし
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
		dojo.attr(inp, 'fxtimes', fxtimes); // 所定休憩の設定時刻は丸めないようにする

		dojo.create('td', {
			innerHTML : teasp.message.getLabel('wave_label'), // ～
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
		dojo.attr(inp, 'fxtimes', fxtimes); // 所定休憩の設定時刻は丸めないようにする

		cell = dojo.create('td', { width: '66px', style: { paddingTop:"1px", paddingLeft:"12px", textAlign:"center" } }, row);
		// 休憩時間の値を得る
		dojo.create('div', {
			className : 'pp_base pp_btn_del',
			style     : { cursor:"pointer" },
			title     : teasp.message.getLabel('delete_menu'), // 削除
			onclick   : dojo.hitch(this, function(e){
				if (!e) e = window.event;
				var div = (e.srcElement ? e.srcElement : e.target);
				var r = div.parentNode.parentNode;
				if(r.tagName == 'TR'){
					var st = r.cells[0].firstChild.value.trim(); // 開始時刻
					var et = r.cells[2].firstChild.value.trim(); // 終了時刻
					st = (st != '' ? teasp.util.time.clock2minutes(st) : null);
					et = (et != '' ? teasp.util.time.clock2minutes(et) : null);
					var t = { from: st, to: et };
					var deleteRest = function(){
						dojo.byId('dialogApplyReviseRestAdd' + contId).className = 'pb_base pb_btn_plus';
						dojo.byId('dialogApplyReviseRestAdd' + contId).disabled = false;
						var tbody = dojo.byId('dialogApplyReviseRestBody' + contId);
						tbody.deleteRow(r.rowIndex);
						teasp.dialog.EmpApply.adjustContentHeight();
					};
					if(t.from != null || t.to != null){
						// 休憩時間を削除しますか？
						teasp.manager.dialogOpen('MessageBox', {
							title   : teasp.message.getLabel('em10002080'), // 確認
							message : teasp.message.getLabel('tm10003940')
						}, this.pouch, this, function(){
							deleteRest();
						});
					}else{
						deleteRest();
					}
				}
			})
		}, cell);

		if(tbody.rows.length >= this.getRestMax()){
			dojo.byId('dialogApplyReviseRestAdd' + contId).className = 'pb_base pb_btn_plus_dis';
			dojo.byId('dialogApplyReviseRestAdd' + contId).disabled = true;
		}
		teasp.dialog.EmpApply.adjustContentHeight();
	});
	row = dojo.create('div', { className:'empApply2Div' }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('restTime_label') }, row); // 休憩時間
	if(applyObj && (fix || !applyObj.active)){
		var msg;
		if(rtRe == '0'){
			msg = teasp.message.getLabel('tk10004100'); // 修正なし
		}else{
			var oldRests = [];
			for(var i = 0 ; i < orest.length ; i++){
				oldRests.push(teasp.message.getLabel('tm10010461', teasp.util.time.timeValue(orest[i].from), teasp.util.time.timeValue(orest[i].to)));
			}
			var newRests = [];
			for(var i = 0 ; i < nrest.length ; i++){
				newRests.push(teasp.message.getLabel('tm10010461', teasp.util.time.timeValue(nrest[i].from), teasp.util.time.timeValue(nrest[i].to)));
			}
			msg = teasp.message.getLabel('tk10004091' // 修正：{0}
				, teasp.message.getLabel('tk10004130'  // {0} → {1}
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
		label.appendChild(dojo.doc.createTextNode(' ' + teasp.message.getLabel('tm10003930'))); // 休憩時間修正
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

	this.createNoteParts(key, tbody, contId, applyObj); // 備考

	this.createApplySetParts (key, tbody, contId, applyObj); // 承認者設定
	this.createApplyTimeParts(key, tbody, contId, applyObj); // 申請日時
	this.createStatusParts   (key, tbody, contId, applyObj); // 状況
	this.createErrorParts    (key, tbody, contId); // エラーメッセージ出力エリア

	if(btnbox){
		dojo.place(btnbox, tbody);
	}

	var timeTable = (this.dayWrap.getTimeTable() || []);
	// 所定休憩と私用外出だけの配列を作成
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
	var oht = this.dayWrap.getTimeHolidayTime(ttx.length > 0 ? ttx : (pattern ? pattern.restTimes : [])); // 時間単位休の時間帯から所定休憩時間を引いた時間

	this.drawLast(applyObj, node);

	// 申請ボタンが押された時の処理
	var btnOk = dojo.byId('empApplyDone' + contId);
	if(btnOk){
		this.eventHandles.push(dojo.connect(btnOk, 'onclick', this, function(e){
			var st = teasp.util.time.clock2minutes(dojo.byId('dialogApplyStartTime' + contId).value);
			var et = teasp.util.time.clock2minutes(dojo.byId('dialogApplyEndTime'   + contId).value);

			// 出社時刻または退社時刻が入力されていて、
			// 休日または「承認されるまで時間入力を禁止」の設定かつ承認待ちの振替申請または休日出勤申請がある
			if(typeof(st) == 'number' || typeof(et) == 'number'){ // 出社時刻または退社時刻が入力済み
				if(!this.dayWrap.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)){       // 休日出勤申請なし
					if(this.dayWrap.isHoliday()){                                       // 休日
						teasp.dialog.EmpApply.showError(contId
								, teasp.message.getLabel('tk10005250'                   // {0}は時刻のクリアだけ認められています。
								, teasp.message.getLabel('confHoliday_label')));        // 休日
						return;
					}
					if(this.dayWrap.isPlannedHoliday()){                                // 有休計画付与日
						teasp.dialog.EmpApply.showError(contId
								, teasp.message.getLabel('tk10005250'                   // {0}は時刻のクリアだけ認められています。
								, teasp.message.getLabel('tm10001360')));               // 有休計画付与日
						return;
					}
				}
				if(this.dayWrap.getObj().interim){                                      // 「承認されるまで時間入力を禁止」の設定かつ承認待ちの振替申請または休日出勤申請がある
					teasp.dialog.EmpApply.showError(contId
								, teasp.message.getLabel('tk10005250'                   // {0}は時刻のクリアだけ認められています。
								, teasp.message.getLabel('tk10005260')));               // 休日出勤申請または振替申請が未承認の間
					return;
				}
			}
			if(typeof(st) == 'number' && typeof(et) == 'number' && st >= et){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002020')); // 出社・退社時刻が正しくありません
				return;
			}
			if(typeof(st) == 'number' && st >= 1440){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002030')); // 出社時刻に 24:00 以降の時刻を入力できません
				return;
			}
			if(typeof(et) == 'number' && et > 2880){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002040')); // 退社時刻に 48:00 以降の時刻を入力できません
				return;
			}
			var pd = this.pouch.getEmpDay(teasp.util.date.addDays(this.args.date, -1));
			var nd = this.pouch.getEmpDay(teasp.util.date.addDays(this.args.date, 1));
			if(pd && typeof(pd.getObj().endTime) == 'number' && pd.getObj().endTime > 1440){
				var pe = pd.getObj().endTime - 1440;
				if(typeof(st) == 'number' && st < pe){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002060')); // 勤務時間が前日の勤務時間と重なっています
					return;
				}
			}
			if(nd && typeof(et) == 'number' && et > 1440){
				if(typeof(nd.getObj().startTime) == 'number'){
					var ce = et - 1440;
					if(ce > nd.getObj().startTime){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002070')); // 勤務時間が翌日の勤務時間と重なっています
						return;
					}
				}
//				if(this.pouch.isProhibitAcrossNextDayOfHolidayWork() // 休日出勤時には24:00を超えた勤務を許さない
//				&& this.dayWrap.isHoliday()
//				&& this.dayWrap.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)
//				){
//					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008430')); // 休日出勤時には24:00以降の退社時刻を入力できません。
//					return;
//				}
				// 翌日に休暇の延長勤務禁止＝オンの休暇申請があれば、退社時刻が24時超は不可
				var h = nd.getProhibitOverNightWorkHoliday();
				if(h){
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008360', h.name)); // {0}の前日は24:00を超える勤務はできません。
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
					rests = rests.concat(this.dayWrap.getHourRests()); // 時間単位休を含める
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
			if(adjust < 0){ // 調整不可
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10002080')); // 出社・退社時刻が休暇の時間帯と重なっています
				return;
			}else if(adjust){
				if(adjust == 1){
					st = inprng.from;
				}else{
					et = inprng.to;
				}
			}
			var fixRests  = getFixRests();
			var keepExterior = this.pouch.isKeepExteriorTime();
			var resp = checkTimes(getInputRests(true), [], fixRests, st, et, keepExterior);
			if(resp.message){
				teasp.dialog.EmpApply.showError(contId, resp.message);
				return;
			}
			var nht = this.dayWrap.getTimeHolidayTime(resp.timeTable); // 時間単位休の時間帯から所定休憩時間を引いた時間
			if(oht != nht){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10005110')); // 時間単位休の時間が申請時点と異なるため変更できません。
				return;
			}
			var oldSt = this.dayWrap.getStartTime(true, '', teasp.constant.C_REAL);
			var oldEt = this.dayWrap.getEndTime  (true, '', teasp.constant.C_REAL);
			if(oldSt === ''){ oldSt = null; }
			if(oldEt === ''){ oldEt = null; }
			var newSt = (typeof(resp.startTime) == 'number' ? resp.startTime : null);
			var newEt = (resp.endTime   || null);
			var old = { from: (typeof(oldSt) == 'number' ? oldSt : null), to: (typeof(oldEt) == 'number' ? oldEt : null), type: 1 };
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
			// 出社・退社時間を含む休憩は入力できないようにする＝オン
			if(this.pouch.isProhibitBorderRestTime()
			&& teasp.logic.EmpTime.checkBorderRestTime(newSt, newEt, resp.timeTable)){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008400')); // 休憩時間が出社時刻または退社時刻と重ならないようにしてください。
				return;
			}
			var timeTable = [{ from: newSt, to: newEt, type: 1 }].concat(resp.timeTable).concat(oldAways);
			var revise = revRt + revEt + revSt;
			if(revise == '000'){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003950')); // 修正していません
				return;
			}
			var ignoreRest = false;
			if(revise == '100' && (old.from === null && old.to === null)){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008520')); // 出社時刻と退社時刻が入力されるまで、休憩の修正は行えません
				return;
			}else if(newSt === null && newEt === null){ // 出社・退社時刻が空欄である
				var diff = false;
				var tgtrs = (revRt == '1' ? newRests : oldRests); // 休憩を変更していたら変更後の休憩を、変更してなければ前の休憩を所定休憩と比較
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
				if(diff){ // (revRt=='1'なら)変更後の休憩は所定休憩と異なる / (revRt!='1'なら)現在の休憩は所定休憩と異なる
					if(revRt == '0'){ // 休憩の修正なしだった場合
						revRt = '1';
					}else{ // 休憩の修正ありだった場合
						// 修正前の値が所定休憩と同じかどうかをチェックする
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
						if(!diff){ // 修正前の値は所定休憩と同じ
							if(revise.substring(1) == '00'){
								teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tf10008530'));
								return;
							}
							revRt = '0'; // 「修正なし」を表記させる
						}
					}
					ignoreRest = true; // 出退社が空欄で休憩だけを修正
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
			var noMod = teasp.message.getLabel(para ? 'zw00102200' : 'zv00102200'); // 修正なし
			var noEnt = teasp.message.getLabel(para ? 'zw00102190' : 'zv00102190'); // 未入力
			var noInp = teasp.message.getLabel(para ? 'zw00102210' : 'zv00102210'); // 入力なし
			var contss = [
				[
					teasp.message.getLabel(para ? 'zw00102160' : 'zv00102160'), // 出社時刻
					(revSt == '0' ? noMod : (old.from === null ? noEnt : teasp.util.time.timeValue(old.from))), // 修正前の値
					(revSt == '0' ? null  : (newSt    === null ? noInp : teasp.util.time.timeValue(newSt   )))  // 修正後の値
				],
				[
					teasp.message.getLabel(para ? 'zw00102170' : 'zv00102170'), // 退社時刻
					(revEt == '0' ? noMod : (old.to   === null ? noEnt : teasp.util.time.timeValue(old.to  ))), // 修正前の値
					(revEt == '0' ? null  : (newEt    === null ? noInp : teasp.util.time.timeValue(newEt   )))  // 修正後の値
				],
				[
					teasp.message.getLabel(para ? 'zw00102180' : 'zv00102180'), // 休憩時間
					(revRt == '0' ? noMod : (!oldRt ? noInp : oldRt)), // 修正前の値
					(revRt == '0' ? null  : (!newRt ? noInp : newRt))  // 修正後の値
				]
			];
			var parts = [];
			for(var i = 0 ; i < contss.length ; i++){
				var conts = contss[i];
				var fmt = (para ? 'zw00102140' : 'zv00102140'); // {0}・・{1} → {2}
				if(!conts[2]){
					fmt = (para ? 'zw00102150' : 'zv00102150'); // {0}・・{1}
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
			&& (!req.apply.note || !req.apply.note.replace(/[\s　]+$/g,''))){
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003680')); // 備考を入力してください
				return;
			}
			if(ignoreRest){
				// 出社時刻と退社時刻をクリアする場合は、休憩の修正は無効となります
				teasp.manager.dialogOpen('MessageBox', {
					title   : teasp.message.getLabel('em10002080'), // 確認
					message : teasp.message.getLabel('tf10008530')
				}, this.pouch, this, function(){
					// サーバへ送信
					this.requestSend(contId, req);
				});
			}else if(adjust){
				// {0}が休暇の時間帯と重なっているため調整した時刻を入力します。\nよろしければＯＫをクリックしてください
				teasp.manager.dialogOpen('MessageBox', {
					title   : teasp.message.getLabel('em10002080'), // 確認
					message : teasp.message.getLabel('tm10002090',
								(adjust == 1 ? teasp.message.getLabel('startTime_label') : teasp.message.getLabel('endTime_label'))) // 出社時刻 or 退社時刻
				}, this.pouch, this, function(){
					if(adjust == 1){
						dojo.byId('dialogApplyStartTime' + contId).value = teasp.util.time.timeValue(st);
					}else{
						dojo.byId('dialogApplyEndTime'   + contId).value = teasp.util.time.timeValue(et);
					}
					// サーバへ送信
					this.requestSend(contId, req);
				});
			}else{
				// サーバへ送信
				this.requestSend(contId, req);
			}
		}));
	}
};
/**
 * 休憩の最大件数を返す
 * （差し込み用。I/Fを変更する場合は注意すること）
 * 標準では10固定。
 * @returns 
 */
teasp.dialog.EmpApply.prototype.getRestMax = function(){
	return 10;
};