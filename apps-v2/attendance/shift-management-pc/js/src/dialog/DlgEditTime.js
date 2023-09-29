teasp.provide('teasp.dialog.EditTime');
/**
 * 休憩・公用外出情報編集ダイアログ
 *
 * @constructor
 * @extends teasp.dialog.Base
 */
teasp.dialog.EditTime = function(){
	this.title = teasp.message.getLabel('restAwayEdit_caption'); // 休憩・公用外出情報入力
	this.id = 'editTimeDialog';
	this.duration = 1;
	this.widthHint = 620;
	this.heightHint = 260;
	this.content = '<table class="pane_table" id="editTimeArea" width="600px"><tr><td colSpan="2" style="padding-bottom:4px;" width="600px"><table class="pane_table"><tr><td style="padding-left:4px;white-space:nowrap;"><span id="dlgEditTimeDate"></span></td><td style="padding-left:4px;" width="400px"><span id="dlgEditTimeEvent" style="word-break:break-all;"></span></td></tr></table></td></tr><tr><td colSpan="2" style="border:1px solid #78A8B6;" width="600px"><div id="editTimeView" class="overx_scr rel_div" width="600px" height="143px"><table id="editTable" class="pane_table editTable" style="width:2352px;"><thead><tr><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th><th>21</th><th>22</th><th>23</th><th>24</th><th>25</th><th>26</th><th>27</th><th>28</th><th>29</th><th>30</th><th>31</th><th>32</th><th>33</th><th>34</th><th>35</th><th>36</th><th>37</th><th>38</th><th>39</th><th>40</th><th>41</th><th>42</th><th>43</th><th>44</th><th>45</th><th>46</th><th>47</th><th>48</th></tr></thead><tbody><tr><td colSpan="49"></td></tr></tbody></table><div id="movetime" style="display:none;"><table class="movearea"><tr><td style="text-align:left;"><span id="movec1"></span></td></tr><tr><td style="text-align:center;"><span id="movev1"></span>-<span id="movev2"></span></td></tr></table></div></div></td></tr><tr id="dlgEditTimeErrorRow"><td colSpan="2" style="text-align:center;" width="600px"><span id="dlgEditTimeError" style="color:red;padding-top:2px;"></span></td></tr><tr id="dlgEditTimeCtrl1" class="ts-buttons-row"><td colSpan="2" style="text-align:center;padding-top:10px;padding-bottom:8px;" width="600px"><div><button class="std-button1" id="dlgEditTimeOk" ><div></div></button><button class="std-button2" id="dlgEditTimeCancel" ><div></div></button></div></td></tr><tr id="dlgEditTimeCtrl2" style="display:none;" class="ts-buttons-row"><td colSpan="2" style="text-align:center;padding-top:10px;padding-bottom:8px;" width="600px"><div><button class="std-button2" id="dlgEditTimeClose" ><div></div></button></div></td></tr></table>';
	this.okLink = {
		id       : 'dlgEditTimeOk',
		callback : this.ok
	};
	this.cancelLink = {
		id       : 'dlgEditTimeCancel',
		callback : this.close
	};
	this.closeLink = {
		id       : 'dlgEditTimeClose',
		callback : this.close
	};

	this.timerId = null;
	this.fired = false;
	this.graph = null;
	this.dayWrap = null;
	this.pattern = null;
};

teasp.dialog.EditTime.prototype = new teasp.dialog.Base();

/**
 *
 * @override
 */
teasp.dialog.EditTime.prototype.ready = function(){
	this.dayWrap = this.pouch.getEmpDay(this.args.date);
	this.pattern = this.dayWrap.getPattern();
};

/**
 * @override
 */
teasp.dialog.EditTime.prototype.preShow = function(){
	this.showError(null);

	dojo.byId('dlgEditTimeDate').innerHTML = teasp.util.date.formatDate(this.args.date, 'JP1');
	dojo.byId('dlgEditTimeEvent').innerHTML = this.dayWrap.getCalendarEvent();

	var o = this.pouch.getTimeFormObj();

	if(!this.graph){
		this.graph = new teasp.helper.Graph({
			widthPerH          : 48
		  , marginLeft         : 24
		  , startY             : 48
		  , sizeType           : 'large'
		  , edgeMark           : true
		  , movable            : true
		  , timeRound          : o.round
		  , hideTimeGraphPopup : this.pouch.isHideTimeGraphPopup()
		  , readOnly           : (this.isReadOnly() || !this.pouch.isUpdater())
		  , restFix            : (this.pouch.isUseReviseTimeApply() || this.dayWrap.getInputLimit().flag == 3)
	  });
	}else{
		this.graph.setParam({
			readOnly  : (this.isReadOnly() || !this.pouch.isUpdater())
		  , restFix   : (this.pouch.isUseReviseTimeApply() || this.dayWrap.getInputLimit().flag == 3)
		});
	}
	this.graph.clear();
	this.graph.draw(this.pouch, 'editTimeView', [this.dayWrap.getObj()]);

	dojo.style('dlgEditTimeCtrl1', 'display', (this.isReadOnly() ? 'none' : ''));
	dojo.style('dlgEditTimeCtrl2', 'display', (this.isReadOnly() ? '' : 'none'));

	dojo.byId('dlgEditTimeOk'    ).firstChild.innerHTML = teasp.message.getLabel('save_btn_title');
	dojo.byId('dlgEditTimeCancel').firstChild.innerHTML = teasp.message.getLabel('cancel_btn_title');
	dojo.byId('dlgEditTimeClose' ).firstChild.innerHTML = teasp.message.getLabel('close_btn_title');

	this.orgHolidayTime = this.dayWrap.getTimeHolidayTime(this.dayWrap.getTimeTable());

	return true;
};

/**
 * @override
 */
teasp.dialog.EditTime.prototype.postShow = function(){
	dojo.byId('editTimeView').scrollLeft = 400; // 初期表示Ｘ座標
};

/**
 * @override
 */
teasp.dialog.EditTime.prototype.cancel = function(){
	this.hide();
};

/**
 * 登録
 * @override
 */
teasp.dialog.EditTime.prototype.ok = function(){
	var dayObj = this.graph.getDayObj();

	this.showError(null);

	var st = dayObj.startTime;
	var et = dayObj.endTime;
	var rests = [];
	var aways = this.graph.getAways();

//    if(this.dayWrap.getDiscretionaryLevel() != 0){ // 裁量労働の場合、休憩時間は固定
//        rests = dojo.clone(this.pattern.restTimes);
//    }else{
		var _rests = this.graph.getRests();
		for(var i = 0 ; i < _rests.length ; i++){
			this.dayWrap.mergeRests(rests, _rests[i]);
		}
//    }
	rests = rests.concat(dayObj.rack.hourRests);
	rests = rests.sort(function(a, b){
		var na = (typeof(a.from) == 'number' ? a.from : a.to);
		var nb = (typeof(b.from) == 'number' ? b.from : b.to);
		return na - nb;
	});

	aways = aways.sort(function(a, b){
		var na = (typeof(a.from) == 'number' ? a.from : a.to);
		var nb = (typeof(b.from) == 'number' ? b.from : b.to);
		return na - nb;
	});

	var keepExterior = this.pouch.isKeepExteriorTime();
	var resp = checkTimes(rests, aways, this.getFixRests(), st, et, keepExterior);
	if(resp.message){
		this.showError(resp.message);
		return;
	}
	if(!keepExterior && resp.over && !confirm(teasp.message.getLabel('tm10004010'))){ // 勤務時間外の所定外休憩時間、公用外出時間は削除します。よろしいですか？
		return;
	}

	var newHolidayTime = this.dayWrap.getTimeHolidayTime(resp.timeTable);
	if(this.orgHolidayTime != newHolidayTime){
		this.showError(teasp.message.getLabel('tk10005110')); // 時間単位休の時間が申請時点と異なるため変更できません。
		return;
	}

	// 出社・退社時間を含む休憩は入力できないようにする＝オン
	if(this.pouch.isProhibitBorderRestTime()
	&& teasp.logic.EmpTime.checkBorderRestTime(resp.startTime, resp.endTime, resp.timeTable)){
		this.showError(teasp.message.getLabel('tf10008400')); // 休憩時間が出社時刻または退社時刻と重ならないようにしてください。
		return;
	}

	if(this.pouch.isValidRestTimeCheck()){
		// 実労働時間と休憩時間を得る
		var o = teasp.logic.EmpTime.getWorkAndRestTime(this.pouch.getObj(), this.dayWrap.getKey(), st, et, resp.rests);
		if(o.workTime > 0){
			// 法定休憩時間のチェック
			var rcs = this.pouch.getRestTimeCheck();
			var lack = 0;
			if(rcs && is_array(rcs)){
				for(var i = 0 ; i < rcs.length ; i++){
					var rc = rcs[i];
					if(rc.check && o.workTime > rc.workTime && o.restTime < rc.restTime){
						lack = (rc.push ? 2 : 1);
						break;
					}
				}
			}
			if(lack){
				if(lack == 2){
					alert(teasp.message.getLabel('tm10002121')); // 労働時間に対して休憩が不足しているため休憩が自動挿入されます。
				}else if(!confirm(teasp.message.getLabel('tm10002120'))){ // ！ 警告 ！\n労働時間に対して休憩が不足しています。\nOKでこのまま登録、キャンセルで入力画面に戻ります。
					return;
				}
			}
		}
	}

	teasp.manager.request(
		'inputTimeTable',
		{
			empId            : this.pouch.getEmpId(),
			month            : this.pouch.getYearMonth(),
			startDate        : this.pouch.getStartDate(),
			lastModifiedDate : this.pouch.getLastModifiedDate(),
			date             : dayObj.date,
			refreshWork      : this.pouch.isInputWorkingTimeOnWorkTImeView(),
			timeTable : [{
				from : (typeof(resp.startTime) == 'number' ? resp.startTime : null),
				to   : (typeof(resp.endTime  ) == 'number' ? resp.endTime   : null),
				type : 1
			}].concat(resp.timeTable)
		},
		this.pouch,
		{ hideBusy : false },
		this,
		function(){
			this.onfinishfunc();
			this.hide();
		},
		function(event){
			this.showError(teasp.message.getErrorMessage(event));
		}
	);
};

/**
 * 参照モード（V5-2271 で編集モードは廃止。true 固定）
 * @return {boolean} true:参照モード
 */
teasp.dialog.EditTime.prototype.isReadOnly = function(){
//	return (this.pouch.isEmpMonthReadOnly() || !this.dayWrap.isInputTime() || this.dayWrap.isDailyFix());
	return true;
};

/**
 * エラー表示
 * @param {string|null} msg メッセージ
 */
teasp.dialog.EditTime.prototype.showError = function(msg){
	dojo.style('dlgEditTimeErrorRow', 'display', (msg ? '' : 'none'));
	dojo.byId('dlgEditTimeError').innerHTML = (msg ? msg.entitize() : '');
};

teasp.dialog.EditTime.prototype.getFixRests = function(){
	var fixRests = [];
	if(this.pattern){
		for(var i = 0 ; i < this.pattern.restTimes.length ; i++){
			var tt = this.pattern.restTimes[i];
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
