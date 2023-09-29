teasp.provide('teasp.dialog.BulkInput');
/**
 * コメント入力ダイアログ
 *
 * @constructor
 * @extends teasp.dialog.Base
 */
teasp.dialog.BulkInput = function(){
	this.width = 550;
	this.height = 210;
	this.id = 'bulkInputDialog';
	this.title = teasp.message.getLabel('tk10004040'); // 出社退社時刻一括入力
	this.duration = 1;
	this.content = '<table class="pane_table"><tr><td style="vertical-align:top;text-align:left;width:500px;"><div style="width:240px;display:table-cell;" id="bulkInputL"></div><div style="width:10px;display:table-cell;"></div><div style="width:240px;display:table-cell;" id="bulkInputR"></div></td></tr><tr><td><div id="bulkInputError"></div></td></tr><tr><td style="text-align:center;padding-top:10px;padding-bottom:4px;"><input type="button" value="" id="bulkInputCopy" style="padding:4px 12px;margin-right:8px;" /><label style="margin-right:8px;"><input type="checkbox" id="bulkInputDayFix" /><span id="spanBulkInputDayFix"></span></label><input type="button" value="" id="bulkInputOk" style="padding:4px 12px;margin-right:8px;" /><input type="button" value="" id="bulkInputCancel" style="padding:4px 12px;margin-left:8px;" /></td></tr></table>';
	this.checkSeq = 0;
	this.orgValues = {};
	this.dateList = [];
	this.okLink = {
		id       : 'bulkInputOk',
		callback : this.ok
	};
	this.cancelLink = {
		id       : 'bulkInputCancel',
		callback : this.hide
	};
};

teasp.dialog.BulkInput.prototype = new teasp.dialog.Base();

/**
 * @override
 */
teasp.dialog.BulkInput.prototype.preStart = function(){
	teasp.message.setLabelEx('spanBulkInputDayFix', 'tk10004050');      // 日次確定する
	dojo.byId('bulkInputOk').value     = teasp.message.getLabel('tk10004060');      // 一括登録
	dojo.byId('bulkInputCancel').value = teasp.message.getLabel('close_btn_title'); // 閉じる
	dojo.byId('bulkInputCopy').value   = '先頭値ｺﾋﾟｰ';
	dojo.connect(dojo.byId('bulkInputCopy'), 'click', this, this.copy);
};

/**
 * @override
 */
teasp.dialog.BulkInput.prototype.preShow = function(){
	var inL = dojo.byId('bulkInputL');
	while(inL.firstChild){
		dojo.destroy(inL.firstChild);
	}
	var inR = dojo.byId('bulkInputR');
	while(inR.firstChild){
		dojo.destroy(inR.firstChild);
	}
	inL.style.border = '1px solid #4F8AB6';
	inR.style.border = '1px solid #4F8AB6';
	this.dateList = this.pouch.getMonthDateList();
	var mm = 0;
	this.orgValues = {};
	var half = Math.ceil(this.dateList.length / 2);
	for(var r = 0 ; r < this.dateList.length ; r++){
		var dkey = this.dateList[r];
		var aliveDay = this.pouch.isAlive(dkey);
		var dayWrap = this.pouch.getEmpDay(dkey);
		var dayFix = dayWrap.isExistApply(teasp.constant.APPLY_KEY_DAILY);
		var d = teasp.util.date.parseDate(dkey);
		var val = '' + d.getDate();
		if(mm != (d.getMonth() + 1)){
			val = '' + (d.getMonth() + 1) + '/' + val;
			mm = (d.getMonth() + 1);
		}
		var inP = (r < half ? inL : inR);
		var xdType = dayWrap.getDayType();
		if(dayWrap.getHolidayFlag() == 3 || dayWrap.isPlannedHoliday()){
			xdType = 4;
		}
		var bg = (!xdType ? ((r%2)==0 ? 'even' : 'odd') : 'rowcl' + xdType);
		var div = dojo.create('div', { className: bg }, inP);
		dojo.create('div', { innerHTML: val, style: { margin:"4px 2px 2px 2px" } }, dojo.create('div', { style: { width:"50px", textAlign:"right", "float":"left" } }, div));
		var divY = dojo.create('div', { innerHTML: teasp.util.date.formatDate(dkey, 'JPW'), style: { margin:"4px 2px 2px 2px" } }, dojo.create('div', { style: { width:"24px", textAlign:"center", "float":"left" } }, div));
		if(d.getDay() == 0){
			divY.style.color = 'red';
		}
		if(d.getDay() == 6){
			divY.style.color = 'blue';
		}
		if(aliveDay && !dayFix && dayWrap.isInputable()){
			var inpS = dojo.create('input', { type: 'text', className: 'inputime roundBegin', style: { padding:"1px", border:"1px solid #8C8C8C" }, id: 'bulkInputS' + dkey }, dojo.create('div', { style: { margin:"2px", "float":"left" } }, div));
			var inpE = dojo.create('input', { type: 'text', className: 'inputime roundEnd'  , style: { padding:"1px", border:"1px solid #8C8C8C" }, id: 'bulkInputE' + dkey }, dojo.create('div', { style: { margin:"2px", "float":"left" } }, div));
			inpS.value = this.orgValues['S' + dkey] = (dayWrap.getStartTime(false, null, teasp.constant.C_REAL) || '');
			inpE.value = this.orgValues['E' + dkey] = (dayWrap.getEndTime  (false, null, teasp.constant.C_REAL) || '');
			this.colorTimeBackground(inpS, dayWrap, 'S');
			this.colorTimeBackground(inpE, dayWrap, 'E');
			dojo.connect(inpS, 'blur'      , this, function(e){ teasp.util.time.onblurTime(e);     this.onchange(e); });
			dojo.connect(inpS, 'onkeypress', this, function(e){ teasp.util.time.onkeypressTime(e); if(e.keyCode === 13){ this.onchange(e); } });
			dojo.connect(inpE, 'blur'      , this, function(e){ teasp.util.time.onblurTime(e);     this.onchange(e); });
			dojo.connect(inpE, 'onkeypress', this, function(e){ teasp.util.time.onkeypressTime(e); if(e.keyCode === 13){ this.onchange(e); } });
		}
		dojo.create('div', { style: { width:"48px", margin:"4px 2px 2px 2px", "float":"left" }, id: 'bulkInputP' + dkey }, div);
		dojo.create('div', { style: { clear:"both" } }, div);
	}

	teasp.util.showErrorArea(null, 'bulkInputError');
	return true;
};

/**
 * 入力時刻変更イベント
 *
 */
teasp.dialog.BulkInput.prototype.onchange = function(e){
	var m = /bulkInput(.)(.+)/.exec(e.target.id);
	if(m){
		var f = m[1];
		var dkey = m[2];
		this.setInputStatus(f, dkey, e.target);
	}
};

teasp.dialog.BulkInput.prototype.setInputStatus = function(f, dkey, inp){
	var v = inp.value;
	inp.style.borderColor = ((this.orgValues[f + dkey] != v) ? 'red' : '#8C8C8C');
	this.colorTimeBackground(inp, this.pouch.getEmpDay(dkey), f);
	var t = teasp.util.time.clock2minutes(inp.value);
	var ot = teasp.util.time.clock2minutes(dojo.byId('bulkInput' + (f == 'S' ? 'E' : 'S') + dkey).value);
	if((typeof(t) == 'number' && typeof(ot) == 'number') && ((f == 'S' && t >= ot) || (f == 'E' && t <= ot))){
		this.setLineStatus(dkey, -1, teasp.message.getLabel('tk10004070')); // 入力時刻の値不正
	}else{
		this.setLineStatus(dkey);
	}
};

teasp.dialog.BulkInput.prototype.colorTimeBackground = function(node, dayWrap, face){
	var pt = (face == 'S' ? dayWrap.getObj().pushStartTime : dayWrap.getObj().pushEndTime) || null;
	var t = teasp.util.time.clock2minutes(node.value);
	if(typeof(t) == 'number' && (typeof(pt) != 'number' || pt != t)){
		node.style.backgroundColor = '#ffffc6';
	}else{
		node.style.backgroundColor = '#ffffff';
	}
};

teasp.dialog.BulkInput.prototype.setLineStatus = function(dkey, flag, msg){
	if(!flag){
		dojo.byId('bulkInputP' + dkey).innerHTML = '';
		dojo.byId('bulkInputP' + dkey).title = '';
		dojo.byId('bulkInputP' + dkey).style.color = 'black';
	}else if(flag < 0){
		dojo.byId('bulkInputP' + dkey).innerHTML = 'error';
		dojo.byId('bulkInputP' + dkey).title = (msg || '');
		dojo.byId('bulkInputP' + dkey).style.color = 'red';
	}else if(flag == 1){
		dojo.byId('bulkInputP' + dkey).innerHTML = 'inputing';
		dojo.byId('bulkInputP' + dkey).style.color = 'red';
	}else if(flag == 2){
		dojo.byId('bulkInputP' + dkey).innerHTML = 'ok';
		dojo.byId('bulkInputP' + dkey).style.color = 'blue';
		dojo.byId('bulkInputS' + dkey).style.borderColor = '#8C8C8C';
		dojo.byId('bulkInputE' + dkey).style.borderColor = '#8C8C8C';
		this.orgValues['S' + dkey] = dojo.byId('bulkInputS' + dkey).value;
		this.orgValues['E' + dkey] = dojo.byId('bulkInputE' + dkey).value;
	}
};

/**
 * コピー
 * @override
 */
teasp.dialog.BulkInput.prototype.copy = function(){
	var firstSt = null;
	var firstEt = null;
	for(var r = 0 ; r < this.dateList.length ; r++){
		var dkey = this.dateList[r];
		var bs = dojo.byId('bulkInputS' + dkey);
		var be = dojo.byId('bulkInputE' + dkey);
		if(!bs || !be){
			continue;
		}
		var st = bs.value;
		var et = be.value;
		if(firstSt){
			bs.value = firstSt;
			this.setInputStatus('S', dkey, bs);
		}else{
			firstSt = st;
		}
		if(firstEt){
			be.value = firstEt;
			this.setInputStatus('E', dkey, be);
		}else{
			firstEt = et;
		}
	}
};

/**
 * 登録
 * @override
 */
teasp.dialog.BulkInput.prototype.ok = function(){
	var reqs = [];
	for(var r = 0 ; r < this.dateList.length ; r++){
		var dkey = this.dateList[r];
		var dayWrap = this.pouch.getEmpDay(dkey);
		var bs = dojo.byId('bulkInputS' + dkey);
		var be = dojo.byId('bulkInputE' + dkey);
		if(!bs || !be){
			continue;
		}
		var st = bs.value;
		var et = be.value;
		var p = dojo.byId('bulkInputP' + dkey);
		p.innerHTML = '';
		if(this.orgValues['S' + dkey] != st || this.orgValues['E' + dkey] != et){
			st = teasp.util.time.clock2minutes(st);
			et = teasp.util.time.clock2minutes(et);
			if(st >= et){
				this.setLineStatus(dkey, -1, teasp.message.getLabel('tk10004080')); // 入力時刻の値が不正
			}else{
				reqs.push({
					funcName: 'inputTimeTable',
					params  : {
						empId            : this.pouch.getEmpId(),
						month            : this.pouch.getYearMonth(),
						startDate        : this.pouch.getStartDate(),
						lastModifiedDate : this.pouch.getLastModifiedDate(),
						mode             : this.pouch.getMode(),
						dayFix           : false,
						date             : dkey,
						timeTable        : dayWrap.createTimeTable(st, et, true),
						refreshWork      : false
					}
				});
				if(dojo.byId('bulkInputDayFix').checked){
					reqs.push({
						funcName: 'applyEmpDay',
						params  : {
							empId            : this.pouch.getEmpId(),
							month            : this.pouch.getYearMonth(),
							startDate        : this.pouch.getStartDate(),
							lastModifiedDate : this.pouch.getLastModifiedDate(),
							date             : dkey,
							client           : "monthly",
							apply            : {
								id           : null,
								applyType    : teasp.message.getLabel('applyDaily_label'), // 日次確定
								patternId    : null,
								holidayId    : null,
								status       : null,
								startDate    : dkey,
								endDate      : dkey,
								exchangeDate : null,
								startTime    : null,
								endTime      : null,
								note         : null,
								contact      : null
							}
						}
					});
				}
			}
		}
	}
	if(reqs.length <= 0){
		teasp.util.showErrorArea(teasp.message.getLabel('tk10001133'), 'bulkInputError'); // 変更はありません
		return;
	}
	teasp.util.showErrorArea(null, 'bulkInputError');
	this.setLineStatus(reqs[0].params.date, 1);
	teasp.manager.dialogOpen('BusyWait');

	teasp.action.contact.remoteMethods(
		reqs,
		{ nowait: true, errorAreaId: 'bulkInputError' },
		function(result, index){
			console.log('------------------(' + index + ')');
			console.log(result);
			console.log('------------------');
			this.setLineStatus(reqs[index].params.date, 2);
			this.pouch.setLastModifiedDate(result.lastModifiedDate);
			if(index < (reqs.length - 1)){
				reqs[index + 1].params.lastModifiedDate = this.pouch.getLastModifiedDate();
				this.setLineStatus(reqs[index + 1].params.date, 1);
			}else{
				teasp.manager.request(
					'transEmpMonth',
					{
						empId     : reqs[index].params.empId,
						month     : reqs[index].params.month,
						startDate : reqs[index].params.startDate
					},
					this.pouch,
					{ hideBusy : true },
					this,
					function(obj){
						teasp.manager.dialogClose('BusyWait');
						this.onfinishfunc();
						this.hide();
					},
					function(event){
						teasp.manager.dialogClose('BusyWait');
						teasp.util.showErrorArea(event, 'bulkInputError');
					}
				);
			}
		},
		function(result, index){
			teasp.manager.dialogClose('BusyWait');
			this.setLineStatus(reqs[index].params.date, -1, teasp.message.getErrorMessage(result));
			teasp.util.showErrorArea(result, 'bulkInputError');
		},
		this
	);
};
