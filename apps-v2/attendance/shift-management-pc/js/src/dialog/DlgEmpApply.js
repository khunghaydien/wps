teasp.provide('teasp.dialog.EmpApply');
/**
 * 勤怠関連申請ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.EmpApply = function(){
	this.id = 'dialogApply';
	this.duration = 1;
	this.content = '<table class="dialogApplyTable" id="dialogApplyTable"><tr><td><table id="dialogApplyTop"><tr><td style="width:20%;"><span id="dialogApplyDate"></span></td><td><span id="dialogApplyEvent" style="word-break:break-all;"></span></td></tr></table></td></tr><tr id="dialogApplyInputRow"><td id="empApplyTabArea"></td></tr><tr id="dialogApplyCloseRow" class="ts-buttons-row"><td><div><button id="dialogApplyClose" class="std-button2"><div></div></button></div></td></tr></table>';
	this.readOnlyCnt = 0;
	this.contentSeq = 0;
	this.holidayList = null;
	this.patternLList = null;
	this.patternSList = null;
	this.applyList = null;
	this.dayWrap = null;
	this.enableMap = null;
	this.daiqableMap = null;
	this.monthFix = false;
	this.dayFix = false;
	this.daiqZan = null;
	this.stockZan = {};
	this.timeForm = 'hh:mm';
	this.newEntry = {};
	this.appEntry = {};
	this.client = null;
	this.eventHandles = [];
	this.valueWidth = '' + Math.min((window.innerWidth - 50), 370) + 'px';
	this.applyHandle = {};
	this.initParam();
};

teasp.dialog.EmpApply.prototype = new teasp.dialog.Base();

teasp.dialog.EmpApply.prototype.initParam = function(){
	this.title = teasp.message.getLabel('dayApply_caption'); // 勤怠関連申請
	this.dialogManageKey = 'EmpApply';
	this.initHeight = 300;
	this.applyMenus = [
		'daily'
	, null
	, 'holiday'
	, 'holidayWork'
	, 'zangyo'
	, 'earlyStart'
	, 'exchange'
	, 'shiftChange'
	, 'patternS'
	, 'patternL'
	, 'lateStart'
	, 'earlyEnd'
	, 'direct'
	, 'reviseTime'
	];
	this.applyTypes = {
		'daily' : {
			name  : teasp.constant.APPLY_TYPE_DAILY,
			title : teasp.message.getLabel('applyDaily_label'), // 日次確定
			create : this.createDailyForm,
			descript : teasp.message.getLabel('tm10003375'), // 日次確定を申請します。
			getMenuFlag : function(){
				if(this.pouch.isUseDailyApply()){
					var o = this.dayWrap.canSelectDailyEx(1);
					return ((o.flag || o.active) ? 1 : 0);
				}else{
					return -1;
				}
			}
		},
		'reviseTime' : {
			name  : teasp.constant.APPLY_TYPE_REVISETIME,
			title : teasp.message.getLabel('applyReviseTime_label'), // 勤怠時刻修正申請
			create : this.createReviseTimeForm,
			descript : teasp.message.getLabel('tm10003850'), // 勤怠時刻の修正を申請します。
			getMenuFlag : function(){
				if(this.pouch.isUseReviseTimeApply()){
					return (this.dayWrap.canSelectReviseTime() ? 1 : 0);
				}else{
					return -1;
				}
			}
		},
		'holiday' : {
			name  : teasp.constant.APPLY_TYPE_HOLIDAY,
			title : teasp.message.getLabel('applyHoliday_label'), // 休暇申請
			create : this.createHolidayForm,
			descript : teasp.message.getLabel('tm10003380'), // 休暇を申請します。
			getMenuFlag : function(){
				var rekiH = false;
				for(var i = 0 ; i < this.holidayList.length ; i++){
					if(this.holidayList[i].displayDaysOnCalendar){
						rekiH = true;
						break;
					}
				}
				return (this.dayWrap.canSelectHoliday(rekiH) && this.holidayList.length > 0 ? 1 : 0);
			}
		},
		'holidayWork' : {
			name  : teasp.constant.APPLY_TYPE_KYUSHTU,
			title : teasp.message.getLabel('applyHolidayWork_label'), // 休日出勤申請
			create : this.createHolidayWorkForm,
			descript : teasp.message.getLabel('tm10003390'), // 休日出勤を申請します。
			getMenuFlag : function(){
				if(this.pouch.getUseHolidayWorkFlag()){
					return (this.dayWrap.canSelectKyushtu() ? 1 : 0);
				}else{
					return -1;
				}
			}
		},
		'zangyo' : {
			name  : teasp.constant.APPLY_TYPE_ZANGYO,
			title : teasp.message.getLabel('applyZangyo_label'), // 残業申請
			create : this.createZangyoForm,
			descript : teasp.message.getLabel('tm10003400'), // 残業を申請します。
			getMenuFlag : function(){
				if(!this.pouch.getUseOverTimeFlag()){
					return -1;
				}
				return (this.dayWrap.canSelectZangyo() ? 1 : 0);
			}
		},
		'earlyStart' : {
			name  : teasp.constant.APPLY_TYPE_EARLYSTART,
			title : teasp.message.getLabel('applyEarlyWork_label'), // 早朝勤務申請
			create : this.createEarlyStartForm,
			descript : teasp.message.getLabel('tm10003410'), // 早朝勤務を申請します。
			getMenuFlag : function(){
				if(!this.pouch.getUseEarlyWorkFlag()){
					return -1;
				}
				return (this.dayWrap.canSelectZangyo(true) ? 1 : 0);
			}
		},
		'exchange' : {
			name  : teasp.constant.APPLY_TYPE_EXCHANGE,
			title : teasp.message.getLabel('applyExchange_label'), // 振替申請
			create : this.createExchangeForm,
			descript : teasp.message.getLabel('tm10003420'), // 振替を申請します。
			getMenuFlag : function(){
				// 前月度～翌月度締め日の範囲を取得
				var twoMon = this.pouch.getDateRangeOfMonth(this.args.date, 2, -1);
				if(this.pouch.isUseExchangeDate()){
					return ((this.dayWrap.canSelectExchange()
					&& teasp.util.date.compareDate(twoMon.to,   this.args.date) >= 0) ? 1 : 0);
				}else{
					return -1;
				}
			}
		},
		'shiftChange' : {
			name  : teasp.constant.APPLY_TYPE_SHIFTCHANGE,
			title : teasp.message.getLabel('tf10011260'), // シフト振替申請
			create : this.createShiftChangeForm,
			descript : teasp.message.getLabel('tf10011270'), // シフト振替を申請します。
			getMenuFlag : function(){
				if(this.pouch.isUseShiftChange()){
					return (this.dayWrap.canSelectShiftChange(this.args.date) ? 1 : 0);
				}else{
					return -1;
				}
			}
		},
		'patternS' : {
			name  : teasp.constant.APPLY_TYPE_PATTERNS,
			title : teasp.message.getLabel('applyPatternS_label'), // 勤務時間変更申請
			create : this.createChangePatternForm,
			descript : teasp.message.getLabel('tm10003430'), // 勤務時間変更を申請します。
			getMenuFlag : function(){
				if(this.pouch.isUseChangePattern()){
					if(this.patternSList.length <= 0 && this.patternLList.length <= 0 && !this.pouch.isChangeDayType()){ // 勤務パターンの選択肢がない
						return 0;
					}
					var pas = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNS);
					var pal = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNL);
					var pad = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERND);
					if(this.pouch.isProhibitWorkShiftChange()){ // 勤務パターンの指定不可=オン
						if(pas || pal ||  pad){ // 既存の勤務時間変更申請があれば非活性
							return 0;
						}
						if(!this.pouch.isChangeDayType()    // 平日・休日変更を許可=オフ
						&& !this.pouch.isUseChangeShift()){ // シフト可=オフ
							// この組合せの設定は無効（勤務体系設定画面では保存できない）
							return 0;
						}
						var p = this.dayWrap.getPattern();
						if(!this.pouch.isChangeDayType() && (!p || !p.id)){ // 勤務パターンが指定されてない日
							return 0;
						}
					}
					if(!this.pouch.isRegulateHoliday(this.args.date) // 勤怠規則平日準拠の休日出勤申請がない
					&& this.dayWrap.isHoliday()                      // 休日
					&& !this.pouch.isChangeDayType()                 // 個人単位で平日・休日を設定不可
					&& !this.pouch.isUseRegulateHoliday()){          // 「休日出勤の勤怠規則は平日に準拠する」＝オフ
						return 0; // 申請不可
					}
					if(this.dayWrap.isInterim()){ //「承認されるまで時間入力を禁止」の設定で、振替申請の承認待ちなので、申請不可
						return 0;
					}
					if(pas && pal && (pad || !this.pouch.isChangeDayType() || pas.dayType || pal.dayType)){ // 目いっぱい申請済みなのでこれ以上申請不可
						return 0;
					}
					if(pas){
						if(pas.pattern && this.patternLList.length <= 0){ // 長期間用の勤務パターンがないならこれ以上申請不可
							return 0;
						}
						return 1;
					}
					if(pal){
						if(pal.pattern && this.patternSList.length <= 0){ // 短期間用の勤務パターンがないならこれ以上申請不可
							return 0;
						}
						return 1;
					}
					return 1;
				}else{
					return -1;
				}
			}
		},
		'shiftSet' : {
			name  : teasp.constant.APPLY_TYPE_PATTERNS,
			title : teasp.message.getLabel('shiftDisplay_title'), // シフト連絡
			create : this.createShiftSettingForm,
			descript : null,
			getMenuFlag : function(){
				return -1;
			}
		},
		'patternL' : {
			name  : teasp.constant.APPLY_TYPE_PATTERNL,
			title : teasp.message.getLabel('applyPatternL_label'), // 長期時間変更申請
			create : this.createChangePatternForm,
			descript : teasp.message.getLabel('tm10003440'), // 長期時間変更を申請します。
			getMenuFlag : function(){
				return -1;
			}
		},
		'lateStart' : {
			name  : teasp.constant.APPLY_TYPE_LATESTART,
			title : teasp.message.getLabel('applyLateStart_label'), // 遅刻申請
			create : this.createLateStartForm,
			descript : teasp.message.getLabel('tm10003450'), // 遅刻を申請します。
			getMenuFlag : function(){
				if(this.pouch.isUseLateStartApply()){ // 設定で「遅刻申請を使用する」か
					return (this.dayWrap.canSelectLateStart() ? 1 : 0);
				}else{
					return -1;
				}
			}
		},
		'earlyEnd' : {
			name  : teasp.constant.APPLY_TYPE_EARLYEND,
			title : teasp.message.getLabel('applyEarlyEnd_label'), // 早退申請
			create : this.createEarlyEndForm,
			descript : teasp.message.getLabel('tm10003460'), // 早退を申請します。
			getMenuFlag : function(){
				if(this.pouch.isUseEarlyEndApply()){ // 設定で「早退申請を使用する」か
					return (this.dayWrap.canSelectEarlyEnd() ? 1 : 0);
				}else{
					return -1;
				}
			}
		},
		'direct' : {
			name  : teasp.constant.APPLY_TYPE_DIRECT,
			title : teasp.message.getLabel('tk10004650'), // 直行・直帰申請
			create : this.createDirectForm,
			descript : teasp.message.getLabel('tk10004660'), // 直行・直帰を申請します。
			getMenuFlag : function(){
				if(this.pouch.isUseDirectApply()){ // 設定で「直行・直帰申請を使用する」か
					return (this.dayWrap.canSelectDirect() ? 1 : 0);
				}else{
					return -1;
				}
			}
		}
	};
};

/**
 * @override
 */
//teasp.dialog.EmpApply.prototype.preInit = function(){
//	require(["dijit/layout/TabContainer", "dijit/layout/ContentPane", "dijit/Tooltip"]);
//};

/**
 * @override
 */
teasp.dialog.EmpApply.prototype.ready = function(){
	this.dayWrap       = this.pouch.getEmpDay(this.args.date);

	this.enableMap     = this.pouch.createExchangeEnableMap(this.args.date); // 振替可能な日付のマップ
	this.daiqableMap   = this.pouch.createDaiqEnableMap();
	this.holidayList   = this.pouch.getHolidayList(this.args.date);
	this.patternSList  = this.pouch.getPatternList(1);
	this.patternLList  = this.pouch.getPatternList(2);
	this.applyList     = this.dayWrap.getEmpApplyList('ALL');
	this.monthFix      = this.pouch.isEmpMonthFixed();
	this.dayFix        = this.dayWrap.isDailyFix();
	this.monthLastDate = this.pouch.getEmpMonthLastDate();
	this.daiqZan       = teasp.data.Pouch.getDaiqZan( // 当日取得可能な代休の残日数を取得
							this.pouch.getStocks(),
							this.args.date,
							this.pouch.getEmpMonthStartDate(),
//                            this.monthLastDate,
							null,
							this.pouch.isOldDate());
	for(var i = 0 ; i < this.holidayList.length ; i++){
		var holiday = this.holidayList[i];
		if(!holiday.managed){
			continue;
		}
		this.stockZan[holiday.manageName] = teasp.data.Pouch.getStockZan( // 当日取得可能な積休の残日数を取得
				this.pouch.getStocks(),
				holiday.manageName,
				this.args.date);
		if(this.stockZan[holiday.manageName].zan <= 0
		&& this.stockZan[holiday.manageName].valid){
			var spendTimeUnitFlag = teasp.data.Pouch.getSpendStockChangedBaseTime(
				this.stockZan[holiday.manageName],
				this.pouch.getConfigHistory(),
				this.args.date
			);
			if(spendTimeUnitFlag < 2){
				this.stockZan[holiday.manageName].valid = false;
			}
		}
	}
	this.client       = this.args.client;
	teasp.util.time.setTimeFormat(this.pouch.getTimeFormObj());

	this.rangeYear = this.pouch.getDateRangeOfMonth(teasp.util.date.getToday(), 13, -12);
	this.applyable = ((teasp.util.date.compareDate(this.rangeYear.from, this.args.date) <= 0 && teasp.util.date.compareDate(this.rangeYear.to, this.args.date) >= 0)
					|| this.pouch.isApplyLimitOff());
};

teasp.dialog.EmpApply.prototype.deleteTabChild = function(tc, c){
	tc.removeChild(c);
	c.destroyRecursive();
	delete c;
};

teasp.dialog.EmpApply.prototype.hide = function(){
    if(!this.dialog){
    	return;
    }
	if(this.tc){
		this.tc.destroyRecursive(false);
	}
	for(var i = 0 ; i < this.eventHandles.length ; i++){
		dojo.disconnect(this.eventHandles[i]);
		delete this.eventHandles[i];
	}
	this.eventHandles = [];
    this.dialog.hide();
    this.free();
    this.dialog.destroy();
    teasp.manager.dialogRemove(this.dialogManageKey);
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.EmpApply.prototype.preStart = function(){
	this.dialogWidth = Math.min((window.innerWidth - 16), 690);
	if(teasp.isMobile() && !teasp.isNarrow()){
		this.dialogWidth = 690;
	}

	dojo.style('dialogApplyTop', 'width', this.dialogWidth + 'px');
	var empApplyTab = dojo.create('div', { id:"empApplyTab" }, dojo.byId('empApplyTabArea'));
	this.tc = new dijit.layout.TabContainer({
		style:"height:" + (this.initHeight || 300) + "px;width:" + this.dialogWidth + "px"
	}, empApplyTab);

	var c = new dijit.layout.ContentPane({
		id: 'empApplyContent0',
		title: teasp.message.getLabel('applyMenu_label'), // メニュー
		content: '<table class="emp_apply_menu" style="width:100%;"><tbody></tbody></table>'
	});
	this.tc.addChild(c);
	dojo.connect(c, 'onShow', this, this.adjustMenuHeight);

	var btnClose = dojo.byId('dialogApplyClose');
	btnClose.firstChild.innerHTML = teasp.message.getLabel('close_btn_title'); // 閉じる
	this.eventHandles.push(dojo.connect(btnClose, "onclick", this, function(){
		teasp.manager.testSignal();
		this.close();
	}));
	this.eventHandles.push(dojo.connect(this.dialog, 'onCancel', this, this.close));

	this.newEntry = {};
	this.appEntry = {};
	this.appWaitReviseTime = null;
	this.contentSeq = 1;

	var tbody = dojo.query('table.emp_apply_menu > tbody', c.domNode)[0];
	this.showInfo(tbody);
};

/**
 *
 * @override
 */
teasp.dialog.EmpApply.prototype.postShow = function(){
	dojo.byId('dialogApplyDate').innerHTML = teasp.util.date.formatDate(this.args.date, 'JP1'); // 日付
	dojo.byId('dialogApplyEvent').innerHTML = this.dayWrap.getCalendarEvent(); // イベント文字列

	if(this.args.dailyFix && this.applyHandle['daily']){
		this.applyHandle['daily'].apply(this);
	}
	teasp.manager.testSignal();
	this.tc.startup();
};
/**
 * 表示する/しないを返す
 * @param {Object} apply
 * @return {number} 0:不可  1:可（ステータス≠承認済み）  2:可（ステータス＝承認済み）  3:可（ステータス＝確定済み） -1:可（ステータス＝却下）
 */
teasp.dialog.EmpApply.prototype.isShowApply = function(apply){
	return this.dayWrap.isShowApply(apply);
};
/**
 * 申請を取消できるかを返す
 * @param {Object} applyObj
 * @return {number} 0:不可  1:可（ステータス≠承認済み）  2:可（ステータス＝承認済み）  3:可（ステータス＝確定済み） -1:可（ステータス＝却下）
 */
teasp.dialog.EmpApply.prototype.canCancelApply = function(applyObj){
	return this.dayWrap.canCancelDayApply(applyObj);
};
/**
 * 承認者種別を返す
 * @param {string} key 申請タイプキー
 * @return {string} '勤怠日次確定' or '勤怠日次申請'
 */
teasp.dialog.EmpApply.prototype.getApproverType = function(key){
	return (key == 'daily' ? teasp.constant.APPROVER_TYPE_DAILYFIX : teasp.constant.APPROVER_TYPE_DAILY);
};

teasp.dialog.EmpApply.prototype.showInfo = function(tbody){
	this.createApplyMenu(tbody);
	var lastp = null;
	var focus = null;
	if(this.applyList.length > 0){
		for(var i = 0 ; i < this.applyList.length ; i++){
			var a = this.applyList[i];
			if(this.isShowApply(a)){
				var key = this.getApplyKey(a);
				if(!this.isNeedPane(key, a)){
					continue;
				}
				if(key){
					lastp = this.createContentPane(key, a);
					if(!this.appEntry[key]){
						this.appEntry[key] = [];
					}
					this.appEntry[key].push({
						paneId   : lastp.id,
						applyObj : a
					});
					if(this.args.applyId && this.args.applyId == a.id){
						focus = lastp;
					}
					if(key == 'reviseTime' && a.status == teasp.constant.STATUS_WAIT){ // 勤怠時刻修正申請かつステータスが承認待ち
						this.appWaitReviseTime = lastp.id;
					}
				}
			}
		}
	}
	if(lastp || focus){
		this.tc.selectChild(focus || lastp);
	}
};

/**
 * タブ化する必要があるかを判定.
 * 直行・直帰申請で開始日が指定日と異なりかつ申請済みでなければ false を返す。
 * それ以外は全部 true
 * @param {string} key
 * @param {Object} a
 * @returns {boolean}
 */
teasp.dialog.EmpApply.prototype.isNeedPane = function(key, a){
	if(key == 'direct'
	&& a.startDate != this.args.date
	&& !teasp.constant.STATUS_FIX.contains(a.status)){
		return false;
	}
	return true;
};

/**
 * 申請オブジェクトから申請種類キーを得る
 *
 * @param {Object} applyObj 申請オブジェクト
 * @return {string|null}
 */
teasp.dialog.EmpApply.prototype.getApplyKey = function(applyObj){
	for(var key in this.applyTypes){
		if(this.applyTypes.hasOwnProperty(key)
		&& this.applyTypes[key].name == applyObj.applyType){
			if(key == 'patternL'){
				return 'patternS';
			}else if(key == 'patternS' && applyObj.decree){
				return 'shiftSet';
			}
			return key;
		}
	}
	return null;
};

teasp.dialog.EmpApply.prototype.isReadOnly = function(flag){
	return (this.monthFix || this.dayFix || this.pouch.isReadOnly() || (!flag && !this.applyable));
};

/**
 * リードオンリーの理由を返す
 *
 * @return {number} bit-1:日次確定、bit-2:月次確定、bit-3:モード
 */
teasp.dialog.EmpApply.prototype.getReadOnlyReason = function(){
	var n = 0;
	if(this.dayFix            ){ n |= 1; }
	if(this.monthFix          ){ n |= 2; }
	if(this.pouch.isReadOnly()){ n |= 4; }
	return n;
};

/**
 * ノード表示／非表示
 *
 * @param {string} id ノードID
 * @param {boolean} flag true:表示 false:非表示
 */
teasp.dialog.EmpApply.prototype.displayOnOff = function(id, flag){
	var d = dojo.byId(id);
	if(d){
		dojo.style(d, 'display', (flag ? '' : 'none'));
	}
};

/**
 * 連続した平日の範囲を得る
 *
 * @param {string} sd
 * @return {string} ed
 */
teasp.dialog.EmpApply.prototype.getEndOfNormal = function(sd){
	var d = sd;
	var lastd = this.pouch.getEmpMonthLastDate();
	var ld = d;
	while(d <= lastd){
		if(!teasp.logic.EmpTime.isFixDay(this.pouch.dataObj.days[d])){
			return ld;
		}
		ld = d;
		d = teasp.util.date.addDays(d, 1);
	}
	return ld;
};

/**
 * 非活性の項目の場合、入力欄の背景色を透明にする
 *
 * @param {Object} inp 入力欄のＤＯＭオブジェクト
 * @param {Object} obj 申請オブジェクト
 */
teasp.dialog.EmpApply.prototype.changeInputAreaView = function(inp, obj){
	if(obj && !obj.active){
		inp.style.backgroundColor = 'transparent';
		inp.readOnly = 'readOnly';
	}
};

/**
 * 入力欄の枠のスタイルを決める
 *
 * @param {boolean} fix 確定済みか
 * @param {Object} obj 申請オブジェクト
 */
teasp.dialog.EmpApply.prototype.getInputClass = function(fix, obj){
	return ((fix || (obj && !obj.active)) ? 'inputro' : 'inputab');
};

/**
 * 申請メニューを挿入する
 *
 */
teasp.dialog.EmpApply.prototype.createApplyMenu = function(tbody){
	for(var i = 0 ; i < this.applyMenus.length ; i++){
		var key = this.applyMenus[i];
		if(!key){
			dojo.create('td', {
				style   : { height:"1px" },
				colSpan : 2
			}, dojo.create('tr', null, tbody));
			continue;
		}
		var at = this.applyTypes[key];
		var menuf = (at.getMenuFlag ? at.getMenuFlag.apply(this) : 1);
		if(menuf < 0){
			continue;
		}
		if(this.isReadOnly()){
			menuf = 0;
		}
		// メニュー作成
		var row = dojo.create('tr', null, tbody);
		var cell = dojo.create('td', {
			id        : 'applyNew_' + key,
			className : 'empApplyMenuCellL',
			style     : { cursor: (menuf ? "pointer" : "default") }
		}, row);
		dojo.create('div', {
			className : (menuf ? 'empApplyMenuOn' : 'empApplyMenuOff'),
			innerHTML : at.title,
			style     : (teasp.isNarrow() ? 'width:100%;' : 'width:160px')
		}, cell);
		if(!teasp.isNarrow()){
			dojo.create('div', {
				className : 'empApplyDescript',
				innerHTML : at.descript
			}, dojo.create('td', {
				className : 'empApplyMenuCellR'
			}, row));
		}
		if(menuf == 1){
			this.applyHandle[key] = this.createNewApply(cell.id);
			this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.applyHandle[key]));
		}
	}
};

teasp.dialog.EmpApply.prototype.isReapplyType = function(key){
	if((key == 'zangyo'      && (this.pouch.getUseOverTimeFlag()   & 4) != 0)
	|| (key == 'earlyStart'  && (this.pouch.getUseEarlyWorkFlag()   & 4) != 0)
	|| (key == 'holidayWork' && (this.pouch.getUseHolidayWorkFlag() & 4) != 0)){
		return true;
	}
	if(key == 'direct'){ // 直行・直帰申請
		for(var i = 0 ; i < this.applyList.length ; i++){
			var a = this.applyList[i];
			if(a.applyType != teasp.constant.APPLY_TYPE_DIRECT){
				continue;
			}
			if(a.startDate == this.args.date || teasp.constant.STATUS_FIX.contains(a.status)){
				return false;
			}
		}
		return true;
	}
	return false;
};

teasp.dialog.EmpApply.prototype.getAfterFlag = function(key, date, st, et){
	var td = teasp.util.date.getToday();
	var est = teasp.util.date.parseDate(teasp.util.date.formatDate(date) + ' ' + teasp.util.time.timeValue(st));
	return (est.getTime() <= td.getTime());
};

/**
 * 申請タブを作成してフォーカスを移す
 *
 * @param {string} id
 * @returns {Function}
 */
teasp.dialog.EmpApply.prototype.createNewApply = function(id){
	var key = id.substring(9);
	return function(){
		for(var k in this.newEntry){
			if(this.newEntry.hasOwnProperty(k)){
				this.deleteTabChild(this.tc, dijit.byId(this.newEntry[k]));
				delete this.newEntry[k];
				break;
			}
		}
		// 勤怠時刻修正申請が選択された場合、承認待ちの勤怠時刻修正申請が既存の場合は、そのタブを選択状態にする
		if(key == 'reviseTime' && this.appWaitReviseTime){
			this.tc.selectChild(dijit.byId(this.appWaitReviseTime));
			return;
		}
		var appEntry = this.choiceAppEntry(key);
		if(key != 'exchange' && !this.isReapplyType(key) && appEntry){
			this.tc.selectChild(dijit.byId(appEntry.paneId));
			return;
		}
		var cp = this.createContentPane(key);
		this.newEntry[key] = cp.id;
		this.tc.selectChild(cp);
	};
};

/**
 * 同種の申請がタブ化されている場合、その情報を返す
 * @param {string} key 申請種類の識別キー
 * @returns {Object|null}
 */
teasp.dialog.EmpApply.prototype.choiceAppEntry = function(key){
	var ae = this.appEntry[key];
	if(!ae || !ae.length){
		return null;
	}
	if(key == 'holiday' || key == 'reviseTime' || key == 'patternS'){ // 休暇申請、勤怠時刻修正申請、勤務時間変更申請
		for(var i = 0 ; i < ae.length ; i++){
			var a = ae[i].applyObj;
			// 開始日＝指定日かつ申請済みでない申請があれば、そのタブが表示されるようにする
			if(a.startDate == this.args.date && !teasp.constant.STATUS_FIX.contains(a.status)){
				return ae[i];
			}
		}
		return null;
	}
	if(ae.length == 1){ // タブは１つ
		return ae[0];
	}
	if(key == 'direct'){ // タブは複数かつ直行・直帰申請
		for(var i = 0 ; i < ae.length ; i++){
			var a = ae[i].applyObj;
			// 開始日が指定日と合っている方または申請済みの方を有効とする
			if(a.startDate == this.args.date || teasp.constant.STATUS_FIX.contains(a.status)){
				return ae[i];
			}
		}
	}
	return ae[0];
};

/**
 * 申請タブを作成
 *
 * @param {string} key 申請種類キー
 * @param {Object=} applyObj 申請データ
 * @returns {Object}
 */
teasp.dialog.EmpApply.prototype.createContentPane = function(key, applyObj){
	var contId = (this.contentSeq++);

	var iconKey = 'ne';
	if(applyObj){
		applyObj.active = true;
		if(teasp.constant.STATUS_CANCELS.contains(applyObj.status)){
			iconKey = 'rm';
		}else if(teasp.constant.STATUS_REJECTS.contains(applyObj.status)){
			iconKey = 'ng';
		}else if(teasp.constant.STATUS_APPROVES.contains(applyObj.status)){
			iconKey = 'ok';
		}else{
			iconKey = 'up';
		}
	}

	// 新規のタブを作成
	var cp = new dijit.layout.ContentPane({
		id     : 'empApplyContent' + contId,
		title  : this.applyTypes[(applyObj && applyObj.aliasKey || key)].title,
		style  : { backgroundColor:(applyObj ? '#eeeeee' : '#ffffff') },
		iconClass : 'ts-status-img ts-ap_tab_' + iconKey,
		content: '<div class="empApplyContHigh" id="empApplyContHigh' + contId + '" style="display:table;width:100%;"></div>'
	});
	this.tc.addChild(cp);

	var div  = dojo.byId('empApplyContHigh' + contId);
//	var tbody = dojo.create('tbody', null, dojo.create('table' , { className: 'empApply2Table', width:(this.dialogWidth - 20) + "px" }, div));
	var tbody = dojo.create('tbody', null, dojo.create('table' , { className: 'empApply2Table', style:"width:100%;" }, div));
	var row  = dojo.create('tr', null, tbody);
	var cel1 = dojo.create('td', null, row);

	// ボタンエリア作成
	var btnbox = dojo.create('div', { className:(teasp.isNarrow() ? 'empApplyBtnH' : 'empApplyBtnV') });
	if(!applyObj){
		// 申請ボタン
		dojo.create('div', {
			innerHTML: teasp.message.getLabel(this.pouch.isUseWorkFlow() ? 'applyx_btn_title' : 'fix_btn_title') // 承認申請 or 確定
		}, dojo.create('button', {
			className: 'std-button1',
			style    : 'margin:4px;margin-left:auto;',
			id       : 'empApplyDone' + contId
		}, dojo.create('div', null, btnbox)));

		// キャンセルボタン
		var btnCancel = dojo.create('button', {
			className: 'std-button2',
			style    : 'margin:4px;margin-left:auto;',
			id       : 'empApplyCancel' + contId
		}, dojo.create('div', null, btnbox));
		dojo.create('div', {
			innerHTML: teasp.message.getLabel('cancel_btn_title') // キャンセル
		}, btnCancel);
		// キャンセルイベント
		this.eventHandles.push(dojo.connect(btnCancel, 'onclick', this, function(){
			for(var k in this.newEntry){
				if(!this.newEntry.hasOwnProperty(k)){
					continue;
				}
				if(this.newEntry[k] == 'empApplyContent' + contId){
					delete this.newEntry[k];
					break;
				}
			}
			this.deleteTabChild(this.tc, dijit.byId('empApplyContent' + contId));
		}));
	}else if(!applyObj.decree || applyObj.applyType == teasp.constant.APPLY_TYPE_HOLIDAY){
		var cans = teasp.constant.STATUS_CANCELS.contains(applyObj.status);
		var reje = teasp.constant.STATUS_REJECTS.contains(applyObj.status);

		if(!this.monthFix){
			if(this.pouch.isApprover(applyObj)){
				// 承認／却下
				var btnApprove = dojo.create('button', {
					className: 'std-button3',
					style    : 'margin:4px;margin-left:auto;',
					id       : 'empApplyApprove' + contId
				}, dojo.create('div', null, btnbox));
				dojo.create('div', {
					innerHTML: teasp.message.getLabel('tf10000270') // 承認／却下
				}, btnApprove);
				// 承認／却下イベント
				this.eventHandles.push(dojo.connect(btnApprove, 'onclick', this, function(){
					this.approveApply(contId, applyObj);
				}));
			}else if(!this.dayFix && !this.isReadOnly()){
				// 再申請
				div = dojo.create('div', {
					innerHTML: teasp.message.getLabel('tf10000280') // 再申請
				}, dojo.create('button', {
					className: 'std-button1',
					style    : 'margin:4px;margin-left:auto;',
					id       : 'empApplyDone' + contId
				}, dojo.create('div', null, btnbox)));
				if(!reje && !cans){
					div.parentNode.style.display = 'none';
				}else{
					var ra = this.checkReapplyable(applyObj);
					if(ra <= 0 || this.isNotTheDayApply(applyObj, this.args.date)){
						div.parentNode.style.display = 'none';
						applyObj.active = false;
					}
				}
			}

			if(!this.isReadOnly(true) || (key == 'daily' && this.getReadOnlyReason() == 1)){
				var btnRemove = null;
				if(cans || (reje && applyObj.close)){
					if(!this.pouch.getHandleInvalidApply()){
						// 申請取下
						btnRemove = dojo.create('button', {
							className: 'red-button1',
							style    : 'margin:4px;margin-left:auto;',
							id       : 'empApplyRemove' + contId
						}, dojo.create('div', null, btnbox));
						dojo.create('div', {
							innerHTML: teasp.message.getLabel('retractApply_label') // 申請取下
						}, btnRemove);
					}
				}else{
					var cancel = this.canCancelApply(applyObj);
					if(cancel){
						// 申請取下
						btnRemove = dojo.create('button', {
							className: 'red-button1',
							style    : 'margin:4px;margin-left:auto;',
							id       : 'empApplyRemove' + contId
						}, dojo.create('div', null, btnbox));
						dojo.create('div', {
							innerHTML: teasp.message.getLabel(cancel == 1 ? 'cancelApply_btn_title' // 申請取消
									: (cancel == 2 ? 'tk10000741'            // 承認取消
									: (cancel == 3 ? 'cancelFix_btn_title'   // 確定取消
									: 'retractApply_label')))               // 申請取下
						}, btnRemove);
					}
				}
				if(btnRemove){
					// 申請取下イベント
					this.eventHandles.push(dojo.connect(btnRemove, 'onclick', this, function(){
						this.cancelApply(contId, applyObj);
					}));
				}
			}
		}
	}

	if(!teasp.isNarrow()){
		var cel2 = dojo.create('td', { style:'width:140px;vertical-align:top;', id:'empApplyRight' + contId }, row);
		dojo.place(btnbox, cel2);
	}

	// 入力フォーム作成
	this.applyTypes[key].create.apply(this, [key, cel1, contId, applyObj, (teasp.isNarrow() ? btnbox : null)]);

	if(applyObj){
		// 承認履歴テーブル作成
		this.createHistoryTable(contId, applyObj.steps || []);
	}

	teasp.manager.testSignal({ key: key, contId: contId });

	dojo.connect(cp, 'onShow', this, teasp.dialog.EmpApply.adjustContentHeight);
	return cp;
};

/**
 * 再申請可能か
 *
 * @param {Object} applyObj 申請オブジェクト
 * @param {number} -1 or 0:不可  1:可
 */
teasp.dialog.EmpApply.prototype.checkReapplyable = function(applyObj){
	var applyType = (applyObj ? applyObj.applyType : '');
	if(applyType == teasp.constant.APPLY_TYPE_DAILY){ // 日次確定
		if(this.pouch.isUseDailyApply()){
			var o = this.dayWrap.canSelectDailyEx(1);
			return ((o.flag || o.active) ? 1 : 0);
		}else{
			return -1;
		}
	}else if(applyType == teasp.constant.APPLY_TYPE_REVISETIME){ // 勤怠時刻修正申請
		if(this.pouch.isUseReviseTimeApply()){
			if(this.dayWrap.existWaitReviseTime()){ // 承認待ちの勤怠時刻修正申請がある
				return 0;
			}
			return (this.dayWrap.canSelectReviseTime() ? 1 : 0);
		}else{
			return -1;
		}
	}else if(applyType == teasp.constant.APPLY_TYPE_HOLIDAY){ // 休暇申請
		var rekiH = false;
		for(var i = 0 ; i < this.holidayList.length ; i++){
			if(this.holidayList[i].displayDaysOnCalendar){
				rekiH = true;
				break;
			}
		}
		return (this.dayWrap.canSelectHoliday(rekiH) && this.holidayList.length > 0 ? 1 : 0);
	}else if(applyType == teasp.constant.APPLY_TYPE_KYUSHTU){ // 休日出勤申請
		if(this.pouch.getUseHolidayWorkFlag()){
			return (this.dayWrap.canSelectKyushtu() ? 1 : 0);
		}else{
			return -1;
		}
	}else if(applyType == teasp.constant.APPLY_TYPE_ZANGYO){ // 残業申請
		if(!this.pouch.getUseOverTimeFlag()){
			return -1;
		}
		return (this.dayWrap.canSelectZangyo() ? 1 : 0);
	}else if(applyType == teasp.constant.APPLY_TYPE_EARLYSTART){ // 早朝勤務申請
		if(!this.pouch.getUseEarlyWorkFlag()){
			return -1;
		}
		return (this.dayWrap.canSelectZangyo(true) ? 1 : 0);
	}else if(applyType == teasp.constant.APPLY_TYPE_EXCHANGE){ // 振替申請
		// 前月度～翌月度締め日の範囲を取得
		var twoMon = this.pouch.getDateRangeOfMonth(this.args.date, 2, -1);
		if(this.pouch.isUseExchangeDate()){
			return ((this.dayWrap.canSelectExchange()
			&& teasp.util.date.compareDate(twoMon.to,   this.args.date) >= 0) ? 1 : 0);
		}else{
			return -1;
		}
	}else if(applyType == teasp.constant.APPLY_TYPE_PATTERNS
		|| applyType == teasp.constant.APPLY_TYPE_PATTERNL){ // 勤務時間変更申請
		if(this.pouch.isUseChangePattern()){
			if(this.patternSList.length <= 0 && this.patternLList.length <= 0){ // 勤務パターンの選択肢がない
				return 0;
			}
			if(!this.pouch.isRegulateHoliday(this.args.date) // 勤怠規則平日準拠の休日出勤申請がない
			&& this.dayWrap.isHoliday()                      // 休日
			&& !this.pouch.isChangeDayType()                 // 個人単位で平日・休日を設定不可
			&& !this.pouch.isUseRegulateHoliday()){          // 「休日出勤の勤怠規則は平日に準拠する」＝オフ
				return 0; // 申請不可
			}
			if(this.dayWrap.isInterim()){ //「承認されるまで時間入力を禁止」の設定で、振替申請の承認待ちなので、申請不可
				return 0;
			}
			var pas = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNS); // 振替申請
			var pal = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNL);
			var pad = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERND);
			if(pas && pal && (pad || !this.pouch.isChangeDayType())){ // 目いっぱい申請済みなのでこれ以上申請不可
				return 0;
			}
			if(pas){
				if(pas.pattern && this.patternLList.length <= 0){ // 長期間用の勤務パターンがないならこれ以上申請不可
					return 0;
				}
				return 1;
			}
			if(pal){
				if(pal.pattern && this.patternSList.length <= 0){ // 短期間用の勤務パターンがないならこれ以上申請不可
					return 0;
				}
				return 1;
			}
			return 1;
		}else{
			return -1;
		}
	}else if(applyType == teasp.constant.APPLY_TYPE_LATESTART){ // 遅刻申請
		if(this.pouch.isUseLateStartApply()){ // 設定で「遅刻申請を使用する」か
			return (this.dayWrap.canSelectLateStart() ? 1 : 0);
		}else{
			return -1;
		}
	}else if(applyType == teasp.constant.APPLY_TYPE_EARLYEND){ // 早退申請
		if(this.pouch.isUseEarlyEndApply()){ // 設定で「早退申請を使用する」か
			return (this.dayWrap.canSelectEarlyEnd() ? 1 : 0);
		}else{
			return -1;
		}
	}else if(applyType == teasp.constant.APPLY_TYPE_DIRECT){ // 直行・直帰申請
		if(this.pouch.isUseDirectApply()){ // 設定で「直行・直帰申請を使用する」か
			return (this.dayWrap.canSelectDirect() ? 1 : 0);
		}else{
			return -1;
		}
	}else if(applyType == teasp.constant.APPLY_TYPE_SHIFTCHANGE){ // シフト振替申請
		if(this.pouch.isUseShiftChange()){
			return (this.dayWrap.canSelectShiftChange(this.args.date) ? 1 : 0);
		}else{
			return -1;
		}
	}
	return 1;
};

/**
 * 承認履歴テーブル作成
 *
 * @param {string|number} contId IDに使用する番号
 * @param {Array.<Object>|null} steps 承認履歴
 */
teasp.dialog.EmpApply.prototype.createHistoryTable = function(contId, steps){
	// 承認履歴エリア
	var rdiv = dojo.byId('empApplyContHigh' + contId);

	var div = dojo.create('div', { style:"font-weight:bold;text-align:left;margin:4px 0px 0px 4px;", innerHTML: teasp.message.getLabel('approvalHistory_label') }, rdiv); // 承認履歴
	var table = dojo.create('table', { className:'emp_apply_steps' }, rdiv);
	var tbody = dojo.create('tbody', null, table);

	dojo.style(div  , 'width', (teasp.isNarrow() ? '100%' : '650px'));
	dojo.style(table, 'width', (teasp.isNarrow() ? '100%' : '650px'));

	// ヘッダ部
	var cell = dojo.create('td', null, dojo.create('tr', null, tbody));
	var tb = dojo.create('tbody' , null, dojo.create('table' , { className:"emp_apply_steps_head" }, cell));
	var cr1 = dojo.create('tr', null, tb);
	var td1 = dojo.create('td', { className: 'number'  }, cr1);
	var td2 = dojo.create('td', { className: 'datetime'}, cr1);
	var td3 = dojo.create('td', { className: 'status'  }, cr1);
	var td4 = dojo.create('td', { className: 'actor'   }, cr1);
	var td5 = (teasp.isNarrow() ? null : dojo.create('td', { className: 'comment' }, cr1));
	if(teasp.isNarrow()){
		dojo.style(td4, 'width', 'auto');
	}
	dojo.create('div', { innerHTML: teasp.message.getLabel('number_head')   }, td1); // #
	dojo.create('div', { innerHTML: teasp.message.getLabel('dateTime_head') }, td2); // 日時
	dojo.create('div', { innerHTML: teasp.message.getLabel('statusj_head')  }, td3); // 状況
	dojo.create('div', { innerHTML: teasp.message.getLabel('actor_head')    }, td4); // 実行者
	if(td5){
		dojo.create('div', { innerHTML: teasp.message.getLabel('comment_head')  }, td5); // コメント
	}

	// データ部
	cell = dojo.create('td', null, dojo.create('tr', null, tbody));
	div = dojo.create('div', { id: 'dialogApplyHistoryDiv' + contId, className: 'emp_apply_steps_area' }, cell);
	if(!teasp.isNarrow()){
		dojo.style(div, 'width', (teasp.isNarrow() ? '100%' : '650px'));
		dojo.style(div, 'height', '100px');
		dojo.style(div, 'overflow-y', 'scroll');
	}
	var ctb = dojo.create('tbody', null, dojo.create('table', { id: 'dialogApplyHistoryTable' + contId, className: 'emp_apply_steps_body' }, div));
	var reverseSteps = dojo.clone(steps).reverse();
	var stepCnt = Math.max(reverseSteps.length || 0, 5);
	var n = reverseSteps.length;
	for(var i = 0 ; i < stepCnt ; i++){
		var step = (i < reverseSteps.length ? reverseSteps[i] : null);
		cr1  = dojo.create('tr' , { className: ((i%2)==0 ? 'even' : 'odd') }, ctb);
		cr2  = (teasp.isNarrow() ? dojo.create('tr' , { className: ((i%2)==0 ? 'even' : 'odd') }, ctb) : null);
		td1 = dojo.create('td', { className:"number"   }, cr1);
		td2 = dojo.create('td', { className:"datetime" }, cr1);
		td3 = dojo.create('td', { className:"status"   }, cr1);
		td4 = dojo.create('td', { className:"actor"    }, cr1);
		td5 = dojo.create('td', { className:"comment"  }, cr2 || cr1);
		if(teasp.isNarrow()){
			dojo.attr(td1, 'rowSpan', '2');
			dojo.attr(td5, 'colSpan', '3');
		}
		if(step){
			var v1 = n--;
			var v2 = teasp.util.date.formatDateTime(step.createdDate, 'SLA-HM');
			var v3 = teasp.constant.getDisplayStatus(step.stepStatus);
			var v4 = dojo.string.substitute(step.stepStatus == teasp.constant.STATUS_REASSIGNED // 再割当の場合
					? '(${0}) ${1}' : '${1}', [
						teasp.message.getLabel('reallot_label'), // 再割当
						(step.actorName || '')
					]);
			var v5 = teasp.util.entitize(step.comments, '');
			dojo.create('div', { innerHTML:v1 }, td1); // #
			dojo.create('div', { innerHTML:v2 }, td2); // 日時
			dojo.create('div', { innerHTML:v3 }, td3); // 状況
			dojo.create('div', { innerHTML:v4 }, td4); // 実行者
			dojo.create('div', { innerHTML:v5 }, td5); // コメント
			if(!v5){
				dojo.style(td5, 'height', '1px');
			}
		}else{
			dojo.style(td5, 'height', '1px');
		}
	}
};

/**
 * 申請取消
 *
 * @param {string} contId IDに使用する番号
 * @param {Object} applyObj 申請オブジェクト
 */
teasp.dialog.EmpApply.prototype.cancelApply = function(contId, applyObj){
	var applyWrap = this.pouch.getEmpApply(applyObj);
	var rejected = applyWrap.isReject();
	var canceled = applyWrap.isCancel();
	var msg = teasp.message.getLabel(((rejected || canceled) ? 'tm10003011' : 'tm10003010'), applyWrap.getDisplayApplyType()) ; // {0}を取り消しますか？
	var clearMsg = null;
	var clearFlag = false;
	var clearLevel = this.pouch.getClearLevel();
	var workLocationClear = false;
	if(applyWrap.isApplyKyushtu() || applyWrap.isApplyExchange()){ // 休日出勤または振替申請の場合、すでに打刻された可能性がある
		var stdkey = this.args.date, exdkey = null;
		stdkey = applyWrap.getStartDate();
		if(applyWrap.isApplyExchange()){ // 振替申請
			exdkey = applyWrap.getExchangeDate();
		}
		var dw1  = this.pouch.getEmpDay(stdkey);
		var dw2  = (exdkey ? this.pouch.getEmpDay(exdkey) : null);
		if(!canceled){ // 取消操作
			var sm = this.pouch.getEmpMonthByDate(stdkey);
			var em = this.pouch.getEmpMonthByDate(exdkey);
			var sf = (sm && sm.apply && teasp.constant.STATUS_FIX.contains(sm.apply.status));
			var ef = (em && em.apply && teasp.constant.STATUS_FIX.contains(em.apply.status));
			if(sf || ef){
				var ym;
				var sn;
				if(sf && sm.yearMonth != this.pouch.getYearMonth()){
					ym = sm.yearMonth;
					sn = sm.subNo;
				}else{
					ym = em.yearMonth;
					sn = em.subNo;
				}
				var ymj = teasp.util.date.formatMonth('zv00000020', Math.floor(ym / 100), (ym % 100), sn);
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003020', ymj)); // {0}が勤務確定されているため、振替申請の取消はできません
				return;
			}
			if(!rejected){
				if(applyWrap.isApplyExchange()){ // 振替申請
					if(this.args.date == exdkey){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10004810')); // 振替申請の取り消しは振替元の日付の申請画面から行ってください。
						return;
					}
					var ignore0 = [ // 振替申請取消により平日→休日に変わる日にあっても無視する申請
						teasp.constant.APPLY_TYPE_PATTERNS,
						teasp.constant.APPLY_TYPE_PATTERNL,
						teasp.constant.APPLY_TYPE_REVISETIME
					];
					var ignore1 = [ // 振替申請取消により休日→平日に変わる日にあっても無視する申請
						teasp.constant.APPLY_TYPE_PATTERNS,
						teasp.constant.APPLY_TYPE_PATTERNL,
						teasp.constant.APPLY_TYPE_ZANGYO,
						teasp.constant.APPLY_TYPE_EARLYSTART,
						teasp.constant.APPLY_TYPE_LATESTART,
						teasp.constant.APPLY_TYPE_EARLYEND,
						teasp.constant.APPLY_TYPE_REVISETIME
					];
					var exApplys1 = this.pouch.getApplyListByDate(stdkey, (dw1.getDayType() == 0 ? ignore0 : ignore1).concat([teasp.constant.APPLY_TYPE_EXCHANGE]));
					var exApplys2 = this.pouch.getApplyListByDate(exdkey, (dw1.getDayType() == 0 ? ignore1 : ignore0), applyWrap.getId());
					if(exApplys1.length > 0 || exApplys2.length > 0){
						var d = (exApplys1.length > 0 ? stdkey : exdkey);
						teasp.dialog.EmpApply.showError(contId
								, teasp.message.getLabel('tm10003030'  // 先に{0}の{1}を取り消してください or 先に{1}を取り消してください
								, teasp.util.date.formatDate(d, 'M/d')
								, teasp.dialog.EmpApply.getApplyTypesName(exApplys1.length > 0 ? exApplys1 : exApplys2)));
						return;
					}
				}else{  // 休日出勤申請
					var ignore0 = [ // 休日出勤申請取消により休日出勤日→休日に変わる日にあっても無視する申請
						teasp.constant.APPLY_TYPE_KYUSHTU,
						teasp.constant.APPLY_TYPE_PATTERNS,
						teasp.constant.APPLY_TYPE_PATTERNL,
						teasp.constant.APPLY_TYPE_EXCHANGE,
						teasp.constant.APPLY_TYPE_REVISETIME,
						teasp.constant.APPLY_TYPE_SHIFTCHANGE
					];
					var exApplys = this.pouch.getApplyListByDate(this.args.date, ignore0);
					var lx = [];
					for(var i = 0 ; i < exApplys.length ; i++){
						var a = exApplys[i];
						if(a.applyType == teasp.constant.APPLY_TYPE_HOLIDAY // 暦日表示する休暇の休暇申請があれば除外する
						&& a.holiday
						&& a.holiday.displayDaysOnCalendar){
							lx.push(i);
						}
					}
					for(i = lx.length - 1 ; i >= 0 ; i--){
						exApplys.splice(lx[i], 1);
					}
					if(exApplys.length > 0){
						teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003040', '', teasp.dialog.EmpApply.getApplyTypesName(exApplys)));
						return;
					}
				}
			}else if(applyWrap.isApplyExchange() && this.args.date == exdkey){ // 却下済みの振替申請かつ対象日付が振替先の日付
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10005410')); // 振替申請の取り下げは振替元の日付の申請画面から行ってください。
				return;
			}
			var cjw1 = this.pouch.getClassifyJobWorks(stdkey);
			var cjw2 = (exdkey ? this.pouch.getClassifyJobWorks(exdkey) : null);
			var d1 = ((dw1.isInputTime()          || (cjw1 && (cjw1.sumTime > 0 || cjw1.sumVolume > 0))) ? stdkey : null);
			var d2 = (((dw2 && dw2.isInputTime()) || (cjw2 && (cjw2.sumTime > 0 || cjw2.sumVolume > 0))) ? exdkey : null);
			if(rejected){
				if(d1 && dw1.isInputable(true) && dw1.isInputableEx().inputable){ // 出勤日の場合、クリアする必要はない
					d1 = null;
				}
				if(d2 && dw2 && dw2.isInputable(true) && dw2.isInputableEx().inputable){ // 出勤日の場合、クリアする必要はない
					d2 = null;
				}
			}else if(d2){ // 振替の取消
				if(d1 && dw1.isInputable(true) && dw1.isInputableEx().inputable){ // d1 が出勤日（取り消して休日に変わる）
					d2 = null;
				}
				if(d2 && dw2 && dw2.isInputable(true) && dw2.isInputableEx().inputable){ // d2 が出勤日（取り消して休日に変わる）
					d1 = null;
				}
			}
			if(d1 || d2){
				clearFlag = true;
				if(!dw2){ // 休日出勤の取消
					clearMsg = teasp.message.getLabel((clearLevel == 1 ? 'tm10003193' : 'tm10003191'), teasp.util.date.formatDate(d1, 'M/d'));
				}else{ // 振替の取消
					clearMsg = teasp.message.getLabel((clearLevel == 1 ? 'tm10003193' : 'tm10003191'), teasp.util.date.formatDate((d2 || d1), 'M/d'));
				}
			}else{
				if(!dw2){
					workLocationClear = (dw1.getWorkLocationId() ? true : false);
				}else{
					workLocationClear = (dw2.getWorkLocationId() || dw1.getWorkLocationId() ? true : false);
				}
				clearFlag = workLocationClear;
			}
		}
	}else if(applyWrap.isApplyShiftChange()){ // シフト振替申請
		var stdkey = applyWrap.getStartDate();
		var exdkey = applyWrap.getExchangeDate();
		var dw1  = this.pouch.getEmpDay(stdkey);
		var dw2  = this.pouch.getEmpDay(exdkey);
		if(!canceled){ // 取消操作
			if(!rejected && !this.checkOtherApplyAtShiftChange(contId, applyObj, dw1, dw2, true)){
				return;
			}
			var cjw1 = this.pouch.getClassifyJobWorks(stdkey);
			var cjw2 = this.pouch.getClassifyJobWorks(exdkey);
			var d1 = ((dw1.isInputTime() || (cjw1 && (cjw1.sumTime > 0 || cjw1.sumVolume > 0))) ? stdkey : null);
			var d2 = ((dw2.isInputTime() || (cjw2 && (cjw2.sumTime > 0 || cjw2.sumVolume > 0))) ? exdkey : null);
			if(rejected){
				if(d1 && dw1.isInputable(true) && dw1.isInputableEx().inputable){ // 出勤日の場合、クリアする必要はない
					d1 = null;
				}
				if(d2 && dw2 && dw2.isInputable(true) && dw2.isInputableEx().inputable){ // 出勤日の場合、クリアする必要はない
					d2 = null;
				}
			}else if(d2){ // 振替の取消
				if(d1 && dw1.isInputable(true) && dw1.isInputableEx().inputable){ // d1 が出勤日（取り消して休日に変わる）
					d2 = null;
				}
				if(d2 && dw2 && dw2.isInputable(true) && dw2.isInputableEx().inputable){ // d2 が出勤日（取り消して休日に変わる）
					d1 = null;
				}
			}
			if(d1 || d2){
				clearFlag = true;
				clearMsg = teasp.message.getLabel((clearLevel == 1 ? 'tm10003193' : 'tm10003191'), teasp.util.date.formatDate((d2 || d1), 'M/d'));
			}else{
				workLocationClear = (dw2.getWorkLocationId() || dw1.getWorkLocationId() ? true : false);
				clearFlag = workLocationClear;
			}
		}
	}else if(applyWrap.getStartDate() != applyWrap.getEndDate()){ // 期間指定
		var ignoreExcludeDate = ((applyObj.holiday && applyObj.holiday.displayDaysOnCalendar) || false);
		var dkey = applyWrap.getStartDate();
		while(dkey <= applyWrap.getEndDate()){
			if(!ignoreExcludeDate && applyObj.excludeDate.contains(dkey)){
				dkey = teasp.util.date.addDays(dkey, 1);
				continue;
			}
			var empMonth = this.pouch.getEmpMonthByDate(dkey);
			if(empMonth
			&& empMonth.apply
			&& teasp.constant.STATUS_FIX.contains(empMonth.apply.status)){ // 対象日の月度は確定済み
				var ym = empMonth.yearMonth;
				var sn = empMonth.subNo;
				var ymj = teasp.util.date.formatMonth('zv00000020', Math.floor(ym / 100), (ym % 100), sn);
				teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tk10005170'
						, ymj, applyWrap.getApplyType())); // {0}が勤務確定されているため、{1}の取消はできません
				return;
			}
			var empDay = this.pouch.getEmpDay(dkey);
			if(empDay.isValid()){
				var a = empDay.getEmpApplyByKey(teasp.constant.APPLY_KEY_DAILY);
				if(a && teasp.constant.STATUS_FIX.contains(a.status)){ // 期間内に有効な日次確定申請がある
					teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003030'
							, teasp.util.date.formatDate(dkey, 'M/d'), a.applyType)); // 先に{0}の{1}を取り消してください
					return;
				}
			}
			dkey = teasp.util.date.addDays(dkey, 1);
		}
	}
	// 勤務パターンの指定ありの勤務時間変更申請を取り消す。
	// 半休や時間単位有休が存在する場合、取り消し後の勤務パターンとの整合をチェックして
	// 不整合になる場合は、先に休暇を取り消してくださいとメッセージを表示する
	if((applyWrap.isApplyPatternS() || applyWrap.isApplyPatternL()) && applyWrap.apply.pattern){
		var dkey = applyWrap.getStartDate();
		while(dkey <= applyWrap.getEndDate()){
			var empDay = this.pouch.getEmpDay(dkey);
			if(empDay.isValid()){
				var pas = empDay.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNS);
				var pal = empDay.getEmpApplyByKey(teasp.constant.APPLY_KEY_PATTERNL);
				var pax = (applyWrap.isApplyPatternL() ? pas : pal);
				if(!pax || pax !== pas){
					var p = (pax ? pax.pattern : this.pouch.getObj().config.defaultPattern); // 取り消し後の勤務パターン
					var ham = empDay.getEmpApplyByKey(teasp.constant.APPLY_KEY_HOLIDAY_AM);   // 休暇申請（午前）
					var hpm = empDay.getEmpApplyByKey(teasp.constant.APPLY_KEY_HOLIDAY_PM);   // 休暇申請（午後）
					var htm = empDay.getEmpApplyByKey(teasp.constant.APPLY_KEY_HOLIDAY_TIME); // 休暇申請（時間単位）
					if((ham || hpm || htm) && !(ham && hpm)){ // 半休を取っている場合、出退社時刻が半休と重なる場合はエラーにする。
						// シフト開始時刻に合わせて、所定休憩と半休の時間帯をずらす＝オン かつ 開始時刻！＝始業時刻
						var diff = ((pax && pax.pattern.enableRestTimeShift && pax.startTime != p.stdStartTime) ? (pax.startTime - p.stdStartTime) : 0);
						var ic = empDay.checkInconsistent(ham ? teasp.constant.RANGE_AM : (hpm ? teasp.constant.RANGE_PM : null), p, diff);
						if(ic){
							teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003030' // 先に{0}の{1}を取り消してください
									, teasp.util.date.formatDate(dkey, 'M/d')
									, teasp.data.EmpApply.getDisplayApplyType(teasp.constant.APPLY_TYPE_HOLIDAY))); // 休暇申請
							return;
						}
					}
				}
			}
			dkey = teasp.util.date.addDays(dkey, 1);
		}
	}
	var req = {
		action           : ((applyWrap.isReject() || applyWrap.isCancel()) ? 'closeApplyEmpDay' : 'cancelApplyEmpDay'),
		empId            : this.pouch.getEmpId(),
		date             : this.args.date,
		month            : this.pouch.getYearMonth(),
		startDate        : this.pouch.getStartDate(),
		lastModifiedDate : this.pouch.getLastModifiedDate(),
		appId            : applyWrap.getId(),
		clearTime        : true,
		client           : this.client,
		noDelay          : true
	};
	if(applyWrap.getApplyType() == teasp.constant.APPLY_TYPE_REVISETIME
	&& teasp.constant.STATUS_APPROVES.contains(applyObj.status)){
		req.timeTable = this.dayWrap.getReviseOldValue(applyObj);
		if(this.dayWrap.isConflictTimeHoliay(this.dayWrap.getTimeTable(), req.timeTable)){
			teasp.dialog.EmpApply.showError(contId, teasp.message.getLabel('tm10003040' // 先に{1}を取り消してください
					, '', teasp.data.EmpApply.getDisplayApplyType(teasp.constant.APPLY_TYPE_HOLIDAY))); // 休暇申請
			return;
		}
	}
	var checkObj = {};
	if(clearMsg){
		checkObj.clear = { title: clearMsg };
		if(!clearLevel){
			checkObj.clear.checked = true;
		}
	}
	if(applyWrap.isReject() && !applyWrap.isClose() && !this.pouch.getHandleInvalidApply()){
		checkObj.nohist = { checked: false, title: teasp.message.getLabel('tk10001177') };
	}
	var what = '';
	if(applyWrap.isApprove()){
		what = teasp.message.getLabel('tk10000741'); // 承認取消
	}else if(rejected || canceled){
		what = teasp.message.getLabel('retractApply_label'); // 申請取下
	}else{
		what = teasp.message.getLabel('cancelApply_btn_title'); // 申請取消
	}

	teasp.manager.dialogOpen(
		'MessageBox',
		{
			title   : teasp.message.getLabel('tk10004240', what), // {0}の確認
			message : msg,
			check   : checkObj
		},
		this.pouch,
		this,
		function(obj){
			req.clearTime = (!clearLevel ? ((obj.clear && obj.clear.checked) || workLocationClear) : clearFlag);
			if(this.dayWrap.getInputLimit().directFlag){
				this.cancelDirectApply.apply(this, [contId, req, applyObj]);
			}else{
				req.remove = ((obj.nohist && obj.nohist.checked) || false);
				teasp.manager.dialogOpen('BusyWait');
				teasp.manager.request(
					'cancelApplyEmpDay',
					req,
					this.pouch,
					{ hideBusy : true },
					this,
					function(){
						this.onfinishfunc();
						this.close();
						teasp.manager.dialogClose('BusyWait');
					},
					function(event){
						teasp.manager.dialogClose('BusyWait');
						teasp.message.alertError(event);
					}
				);
			}
		}
	);
};

/**
 * 承認／却下
 *
 * @param {string} contId IDに使用する番号
 * @param {Object} applyObj 申請オブジェクト
 */
teasp.dialog.EmpApply.prototype.approveApply = function(contId, applyObj){
	teasp.manager.dialogOpen(
		'Approval',
		{
			apply   : { id: applyObj.id },
			objKey  : 'empApply',
			refresh : true,
			noDelay : true
		},
		this.pouch,
		this,
		function(){
			this.onfinishfunc(true);
			this.close();
		}
	);
};

/**
 * 期間入力共通フォーム作成
 *
 * @param {string} key 申請タイプキー
 * @param {Object} tbody 親テーブルボディ
 * @param {string} contId IDに使用する番号
 * @param {Object|null|undefined} obj {startDate:{string}, endDate:{string}} 初期値の開始日・終了日
 * @param {Object} range {from:{string|Object}, to:{string|Object} 選択可能な日付範囲
 */
teasp.dialog.EmpApply.prototype.createRangeParts = function(key, tbody, contId, obj, range){
	var fix = (obj && (teasp.constant.STATUS_FIX.contains(obj.status) || this.isNotTheDayApply(obj, this.args.date))) || this.isReadOnly();
	var ro = (fix || (obj && !obj.active));
	var inputClass = this.getInputClass(fix, obj);

	var row  = dojo.create('div', { id: 'dialogApplyRangeRow' + contId, className:'empApply2Div' }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('range_label') }, row); // 期間

	var ctb  = dojo.create('tbody' , null, dojo.create('table' , { className: 'pane_table' }, dojo.create('div', { className:'empApply2VL' }, row)));
	var cr   = dojo.create('tr'    , null, ctb);
	var dt = teasp.util.date.formatDate((obj ? obj.startDate : range.from), 'SLA');
	var inpSd = dojo.create('input', {
		type      : 'text',
		id        : 'dialogApplyStartDate' + contId,
		readOnly  : 'readOnly',
		className : 'inpudate inputro',
		style     : { margin:"2px" },
		value     : dt
	}, dojo.create('td', null, cr));

	this.changeInputAreaView(inpSd, obj, fix);

	var cc = dojo.create('td', { style:"vertical-align:middle;" }, cr);
	var lblTo = dojo.create('label', { style:"margin:2px;", id: 'dialogApplyRangeLabel' + contId }, cc);
	var chkTo = dojo.create('input', { type: 'checkbox', style:"margin:2px;", id: 'dialogApplyRangeOn' + contId }, lblTo);
	lblTo.appendChild(dojo.doc.createTextNode(teasp.message.getLabel('kara_label'))); // から
	if(fix){
		chkTo.disabled = true;
	}

	var inpEd = dojo.create('input', { type:'text', style:'margin:2px;', id:'dialogApplyEndDate' + contId, className:'inpudate ' + inputClass, maxLength:12 }, dojo.create('td', null, cr));
	inpEd.value = dt;
	var btCal = (ro ? null : dojo.create('input', { type:'button', style:"margin:2px;", id:'dialogApplyEndDateCal' + contId, className:'pp_base pp_btn_cal' }, dojo.create('td', null, cr)));

	this.changeInputAreaView(inpEd, obj, fix);

	if(obj && obj.startDate != obj.endDate){
		chkTo.checked = true; // から
		inpEd.value = teasp.util.date.formatDate(obj.endDate, 'SLA'); // 期間終了日
		if(fix){
			inpEd.readOnly = 'readOnly';
		}
		if(btCal){
			btCal.className = 'pp_base ' + (fix ? 'pp_btn_cal_dis' : 'pp_btn_cal');
		}
		dojo.toggleClass(inpEd, 'inputro', fix);
	}else{
		chkTo.checked = false; // から
		inpEd.disabled = true; // 期間終了日
		if(btCal){
			btCal.className = 'pp_base pp_btn_cal_dis';
		}
		dojo.toggleClass(inpEd, 'inputro', true);
	}

	if(btCal){
		// 期間のチェックボックスがクリックされた時の処理
		this.eventHandles.push(dojo.connect(chkTo, 'onclick', this, function(e){
			inpEd.value = inpSd.value;
			inpEd.disabled = (e.target.checked ? false : true); // 期間終了日
			dojo.toggleClass(inpEd, 'inputro', !e.target.checked);
			btCal.className = 'pp_base ' + (e.target.checked ? 'pp_btn_cal' : 'pp_btn_cal_dis'); // カレンダーボタン
		}));

		// カレンダーボタンが押された時の処理
		this.eventHandles.push(dojo.connect(btCal, 'onclick', this, function(e){
			if(fix || !chkTo.checked){
				return;
			}
			var ind = teasp.util.date.parseDate(inpEd.value); // 期間終了日の入力値を取得
			teasp.manager.dialogOpen(
				'Calendar',
				{
					date: (ind ? ind : range.from),
					isDisabledDateFunc: function(d) {
						// 選択可能なのは今日～１か月後の日付として、それ以外は無効化する
						return (teasp.util.date.compareDate(range.from, d) > 0 || teasp.util.date.compareDate(range.to, d) < 0);
					}
				},
				null,
				this,
				function(o){
					// 選択された日付を期間終了日にセット
					inpEd.value = teasp.util.date.formatDate(o, 'SLA');
					teasp.dialog.EmpApply.showError(contId, null);
				}
			);
		}));
	}
};

/**
 * 時間入力共通フォーム作成
 *
 * @param {string} key 申請タイプキー
 * @param {Object} tbody 親テーブルボディ
 * @param {string} contId IDに使用する番号
 * @param {Object|null|undefined} obj {startTime:{number}, endTime:{number}} 初期値の開始時間・終了時間
 * @param {boolean=} nocha true の場合、時間変更不可
 * @param {Function=} onchange 時刻変更時に呼び出す関数
 */
teasp.dialog.EmpApply.prototype.createTimeParts = function(key, tbody, contId, obj, nocha, onchange){
	var row, ctb, cr;

	var fix = (obj && (teasp.constant.STATUS_FIX.contains(obj.status) || this.isNotTheDayApply(obj, this.args.date))) || this.isReadOnly() || nocha;
	var inputClass = this.getInputClass(fix, obj);

	row  = dojo.create('div', { id: 'dialogApplyTimeRow' + contId, className:'empApply2Div', style:'margin-top:3px;' }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('time_label') }, row); // 時間

	var area = dojo.create('div', { className:'empApply2VL' + (teasp.isNarrow() ? '' : ' horizon') }, row);
	ctb  = dojo.create('tbody' , null, dojo.create('table' , { className: 'pane_table horizon' }, area));
	cr   = dojo.create('tr', null, ctb);
	var inp1 = dojo.create('input', { type: 'text', style:"margin:2px;", id: 'dialogApplyStartTime' + contId, className: 'inputime ' + inputClass, maxLength: 5 }, dojo.create('td', { className:'time-parts' }, cr));
	dojo.create('td', { style:"margin:2px 6px;", innerHTML: teasp.message.getLabel('wave_label'), className:'time-parts' }, cr); // ～
	var inp2 = dojo.create('input', { type: 'text', style:"margin:2px;", id: 'dialogApplyEndTime'   + contId, className: 'inputime ' + inputClass, maxLength: 5 }, dojo.create('td', { className:'time-parts', style:"padding-right:8px;" }, cr));

	this.changeInputAreaView(inp1, obj, fix);
	this.changeInputAreaView(inp2, obj, fix);

	dojo.create('div', { id:'dialogApplyTimeNote' + contId, className:'horizon', style:"margin:" + (teasp.isNarrow() ? "" : "5px ") + "2px;color:red;max-width:240px;word-break:break-all;" }, area);

	if(!fix){
		this.eventHandles.push(dojo.connect(inp1, 'blur'      , this, function(e){ teasp.util.time.onblurTime(e);     if(onchange){ onchange.apply(this); } }));
		this.eventHandles.push(dojo.connect(inp1, 'onkeypress', this, function(e){ teasp.util.time.onkeypressTime(e); if(e.keyCode === 13 && onchange){ onchange.apply(this); } }));
		this.eventHandles.push(dojo.connect(inp2, 'blur'      , this, function(e){ teasp.util.time.onblurTime(e);     if(onchange){ onchange.apply(this); } }));
		this.eventHandles.push(dojo.connect(inp2, 'onkeypress', this, function(e){ teasp.util.time.onkeypressTime(e); if(e.keyCode === 13 && onchange){ onchange.apply(this); } }));
	}

	if(obj){
		inp1.value = teasp.util.time.timeValue(obj.startTime, this.timeForm);
		inp2.value = teasp.util.time.timeValue(obj.endTime  , this.timeForm);
	}
	if(fix){
		inp1.readOnly = 'readOnly';
		inp2.readOnly = 'readOnly';
	}
};

/**
 * 備考入力共通フォーム作成
 *
 * @param {string} key 申請タイプキー
 * @param {Object} tbody 親テーブルボディ
 * @param {string} contId IDに使用する番号
 * @param {Object|null|undefined} obj {note:{string}} 初期値の備考
 * @param {string=} name 項目名（省略時は'備考'）
 */
teasp.dialog.EmpApply.prototype.createNoteParts = function(key, tbody, contId, obj, name){
	var fix = (obj && (teasp.constant.STATUS_FIX.contains(obj.status) || this.isNotTheDayApply(obj, this.args.date))) || this.isReadOnly();
	var inputClass = this.getInputClass(fix, obj);

	var row  = dojo.create('div', { id: 'dialogApplyNoteRow' + contId, className:'empApply2Div' }, tbody);
	dojo.create('div', {
		className : 'empApply2CL noteArea',
		innerHTML : (name || teasp.message.getLabel('note_head'))
	}, row); // 備考
	var inp = dojo.create('textarea', {
		id    : 'dialogApplyNote' + contId,
		style : {
			width   : '97%'/*"390px"*/,
			height  : "42px",
			margin  : "2px",
			padding : "2px"
		},
		className : 'noteArea ' + inputClass,
		maxLength : 255
	}, dojo.create('div', { className:'empApply2VL', style:dojo.string.substitute('width:${0};', [this.valueWidth]) }, row));

	this.changeInputAreaView(inp, obj, fix);

	if(obj){
		if(obj.applyType == teasp.constant.APPLY_TYPE_PATTERNS && obj.decree){ // シフト設定の場合
			inp.value = (obj.content || '');
		}else{
			inp.value = (obj.note || '');
		}
		if(fix){
			inp.readOnly = 'readOnly'; // 備考
		}
	}
};

/**
 * 連絡先入力共通フォーム作成
 *
 * @param {string} key 申請タイプキー
 * @param {Object} tbody 親テーブルボディ
 * @param {string} contId IDに使用する番号
 * @param {Object|null|undefined} obj {contact:{string}} 初期値の連絡先
 */
teasp.dialog.EmpApply.prototype.createContactParts = function(key, tbody, contId, obj){
	var fix = (obj && (teasp.constant.STATUS_FIX.contains(obj.status) || this.isNotTheDayApply(obj, this.args.date))) || this.isReadOnly();
	var inputClass = this.getInputClass(fix, obj);

	var row  = dojo.create('div', { id: 'dialogApplyContactRow' + contId, className:'empApply2Div' }, tbody);
	dojo.create('div', {
		className : 'empApply2CL',
		innerHTML : teasp.message.getLabel('contact_label')
	}, row); // 連絡先
	var inp = dojo.create('input', {
		id        : 'dialogApplyContact' + contId,
		type      : 'text',
		style     : {
			width   : "97%"/*"390px"*/,
			margin  : "2px",
			padding : "2px"
		},
		className : 'noteArea ' + inputClass,
		maxLength : '255'
	}, dojo.create('div', { className:'empApply2VL', style:dojo.string.substitute('width:${0};', [this.valueWidth]) }, row));

	this.changeInputAreaView(inp, obj, fix);

	if(obj){
		inp.value = (obj.contact || '');
		if(fix){
			inp.readOnly = 'readOnly'; // 連絡先
		}
	}
};

/**
 * 承認者設定選択共通フォーム作成
 *
 * @param {string} key 申請タイプキー
 * @param {Object} tbody 親テーブルボディ
 * @param {string} contId IDに使用する番号
 * @param {Object|null|undefined} obj {contact:{string}} 初期値の連絡先
 */
teasp.dialog.EmpApply.prototype.createApplySetParts = function(key, tbody, contId, obj){
	if(!this.pouch.isUseApproverSet()){
		return;
	}
	var retryable = (!obj || teasp.constant.STATUS_CANCELS.contains(obj.status) || teasp.constant.STATUS_REJECTS.contains(obj.status));
	var row  = dojo.create('div', { id: 'dialogApplyApproverSetRow' + contId, className:'empApply2Div' }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('tk10000071') }, row); // 承認者
	var cell = dojo.create('div', { className:'empApply2VL' }, row);
	var type = this.getApproverType(key);

	var pdiv = dojo.create('div', { className:"horiz" }, cell);
	dojo.create('div', {
		id       : 'dialogApplyApproverSetVal' + contId,
		style    : { "float":"left" },
		innerHTML: (obj && !retryable ? this.pouch.getApproverName(obj) : this.pouch.getApproverSetName(type))
	}, pdiv);

	if(retryable && !this.isReadOnly()){
		dojo.create('a', {
			innerHTML: teasp.message.getLabel('tk10004000'), // 再読み込み
			onclick  : this.reloadApproverSet(contId, type),
			style    : { marginLeft:"12px", verticalAlign:"bottom", color:"#000080", textDecoration:"underline", cursor:"pointer" }
		}, dojo.create('div', { style: { "float":"left", fontSize:"0.95em" } }, pdiv));

		if(!teasp.isSforce1()){ // SF1では「承認者設定画面を開く」を非表示にする
			dojo.create('a', {
				innerHTML: teasp.message.getLabel('tk10004010'), // 承認者設定画面を開く
				onclick  : this.openApproverSet(type),
				style    : { marginLeft:"12px", verticalAlign:"bottom", color:"#000080", textDecoration:"underline", cursor:"pointer" }
			}, dojo.create('div', { style: { "float":"left", fontSize:"0.95em" } }, pdiv));
		}
	}
};

/**
 * 承認者設定選択を再読み込み
 *
 * @param {string} contId
 * @param {string} type
 */
teasp.dialog.EmpApply.prototype.reloadApproverSet = function(contId, type){
	var _contId = contId;
	var _type = type;
	return dojo.hitch(this, function(){
		teasp.dialog.EmpApply.showError(contId, null);
		this.getApproverSet.apply(this, [null,
			function(){
				dojo.byId('dialogApplyApproverSetVal' + _contId).innerHTML = this.pouch.getApproverSetName(_type);
			},
			function(event){
				teasp.message.alertError(event);
			}
		]);
	});
};

/**
 * 承認者設定画面を開く
 *
 * @param {string} type
 */
teasp.dialog.EmpApply.prototype.openApproverSet = function(type){
	var _type = type;
	return dojo.hitch(this, function(){
		var id = this.pouch.getApproverSetId(_type);
		if(id){
			window.open('/' + id + '/e', '_blank');
			return false;
		}else{
			this.getApproverSet.apply(this, [_type,
				function(){
					id = this.pouch.getApproverSetId(_type);
					window.open('/' + id + '/e', '_blank');
					return false;
				},
				function(event){
					teasp.message.alertError(event);
				}
			]);
			return false;
		}
	});
};

/**
 * 承認者設定を読み込む
 *
 * @param {string} type
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
teasp.dialog.EmpApply.prototype.getApproverSet = function(type, onSuccess, onFailure){
	teasp.manager.request(
		'getAtkApproverSet',
		{
			action : 'getAtkApproverSet',
			empId  : this.pouch.getEmpId(),
			type   : type
		},
		this.pouch,
		{ hideBusy : false },
		this, onSuccess, onFailure
	);
};

/**
 * 申請日時表示共通フォーム作成
 *
 * @param {string} key 申請タイプキー
 * @param {Object} tbody 親テーブルボディ
 * @param {string} contId IDに使用する番号
 * @param {Object|null|undefined} obj {applyTime:{string}} 初期値の申請日時
 */
teasp.dialog.EmpApply.prototype.createApplyTimeParts = function(key, tbody, contId, obj){
	if(!obj){
		return;
	}
	var row  = dojo.create('div', { id: 'dialogApplyAppTimeRow' + contId, className:'empApply2Div' }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('applyTime_label') }, row); // 申請日時
	var div = dojo.create('div', { id: 'dialogApplyAppTime' + contId }, dojo.create('div', { className: 'empApply2VL' }, row));
	div.innerHTML = teasp.util.date.formatDateTime(obj.applyTime, 'SLA-HM'); // 申請日時
};

/**
 * 承認申請画面のリンクURLを取得
 *
 * @param {string} itemId
 * @return {string}
 */
teasp.dialog.EmpApply.getWorkItemHref = function(itemId){
	return '/p/process/ProcessInstanceWorkitemWizardStageManager?id=' + itemId;
};

/**
 * 申請種類名を列挙する
 *
 * @param {Array.<Object>} as
 * @return {string}
 */
teasp.dialog.EmpApply.getApplyTypesName = function(as){
	var l = [];
	if(as && is_array(as)){
		for(var i = 0 ; i < as.length ; i++){
			var a = as[i];
			if(a && a.applyType){
				var s = a.applyType;
				if(s == teasp.constant.APPLY_TYPE_PATTERNL){
					s = teasp.constant.APPLY_TYPE_PATTERNS;
				}

				l.push(teasp.data.EmpApply.getDisplayApplyType(s));
			}
		}
	}else if(typeof(as) == 'object'){
		for(var key in as){
			if(as.hasOwnProperty(key) && key != 'cnt'){
				l.push(teasp.data.EmpApply.getDisplayApplyType(key));
			}
		}
	}
	return (l.length > 0 ? l.join(', ') : '');
};

/**
 * 状況表示共通フォーム作成
 *
 * @param {string} key 申請タイプキー
 * @param {Object} tbody 親テーブルボディ
 * @param {string} contId IDに使用する番号
 * @param {Object|null|undefined} obj {status:{string}} 初期値のステータス
 */
teasp.dialog.EmpApply.prototype.createStatusParts = function(key, tbody, contId, obj){
	if(!obj){
		return;
	}
	var row  = dojo.create('div', { id: 'dialogApplyAppStatusRow' + contId, className:"empApply2Div" }, tbody);
	dojo.create('div', { className: 'empApply2CL', innerHTML: teasp.message.getLabel('statusj_head') }, row); // 状況
	var cell = dojo.create('div', { className: 'empApply2VL', style:"vertical-align:bottom;" }, row);
	var pdiv = dojo.create('div', { className:"horiz" }, cell);
	var div = dojo.create('div', { id: 'dialogApplyAppStatus' + contId, style:"float:left;" }, pdiv);
	var status = (teasp.constant.getDisplayStatus(obj.status) || teasp.message.getLabel('notFix_label')); // 状況
	if(teasp.constant.STATUS_REJECTS.contains(obj.status)){
		status += (' ' + teasp.message.getLabel(obj.close ? 'tk10004790' : 'tk10004780')); // （取下または再申請を行ってください） or （取下済み）
	}
	div.innerHTML = status;
	div.style.color = (teasp.constant.STATUS_REJECTS.contains(obj.status) ? 'red' : 'black');
	if(teasp.constant.STATUS_WAIT == obj.status){
		var a = dojo.create('a', {
			href     : 'javascript:void(0);',
			style    : { "float":"left", marginLeft:"12px", fontSize:"0.9em", verticalAlign:"bottom" },
			innerHTML: teasp.message.getLabel('tm10001680', teasp.message.getLabel('tk10004020')) // (承認申請画面を開く)
		}, pdiv); // 承認申請画面のリンク
		if(teasp.isSforce1()){
			this.eventHandles.push(dojo.connect(a, 'onclick', this, function(){
				sforce.one.navigateToURL('/' + obj.id);
			}));
		}else{
			dojo.attr(a, 'href', '/' + obj.id);
			dojo.attr(a, 'target', '_blank');
		}
	}
};

/**
 * 注意事項出力共通フォーム作成
 *
 * @param {string} key 申請タイプキー
 * @param {Object} tbody 親テーブルボディ
 * @param {string} contId IDに使用する番号
 */
teasp.dialog.EmpApply.prototype.createAnnotateParts = function(key, tbody, contId){
	var row  = dojo.create('div', { id:'dialogApplyAnnotateRow' + contId, style:"display:none;margin-left:-16px;" }, tbody);
	dojo.create('div', { id:'dialogApplyAnnotate' + contId, style:"marginTop:8px;text-align:center;margin:6px;" }, row);
};

/**
 * エラー出力共通フォーム作成
 *
 * @param {string} key 申請タイプキー
 * @param {Object} tbody 親テーブルボディ
 * @param {string} contId IDに使用する番号
 */
teasp.dialog.EmpApply.prototype.createErrorParts = function(key, tbody, contId){
	var row = dojo.create('div', { id:'dialogApplyErrorRow' + contId, style:"display:none;text-align:center;margin-left:-16px;" }, tbody);
	dojo.create('div', { id:'dialogApplyError' + contId, style:"color:red;margin:6px;" }, row);
};

/**
 * 警告出力共通フォーム作成
 *
 * @param {string} key 申請タイプキー
 * @param {Object} tbody 親テーブルボディ
 * @param {string} contId IDに使用する番号
 */
teasp.dialog.EmpApply.prototype.createWarnParts = function(key, tbody, contId){
	dojo.create('div', {
		id    : 'dialogApplyWarn' + contId,
		style : { textAlign:"left", marginTop:"6px" }
	}, dojo.create('div', {
		id    : 'dialogApplyWarnRow' + contId,
		style : "display:none;margin-left:-16px;"
	}, tbody));
};

/**
 * エラーメッセージ表示
 *
 * @param {string} contId IDに使用する番号
 * @param {string|null} msg メッセージ
 * @param {boolean=} flag
 */
teasp.dialog.EmpApply.showError = function(contId, msg, flag){
	dojo.style('dialogApplyErrorRow' + contId, 'display', (msg ? '' : 'none'));
	dojo.byId('dialogApplyError' + contId).innerHTML = (msg ? (flag ? msg : msg.entitize()) : '');
	teasp.dialog.EmpApply.adjustContentHeight();
};

/**
 * 警告メッセージ表示
 *
 * @param {string} contId IDに使用する番号
 * @param {string|null} msg メッセージ
 */
teasp.dialog.EmpApply.showWarn = function(contId, msg){
	var div = dojo.byId('dialogApplyWarn' + contId);
	dojo.empty(div);
	if(msg){
		dojo.create('div', { className:'pp_base pp_icon_caution', style:"display:inline-block;margin:6px;vertical-align:middle;" }, div);
		dojo.create('div', { innerHTML:msg, style:"display:inline-block;width:78%;vertical-align:middle;" }, div);
	}
	dojo.style('dialogApplyWarnRow' + contId, 'display', (msg ? '' : 'none'));
	teasp.dialog.EmpApply.adjustContentHeight();
};

/**
 * サーバへ送信
 *
 * @param {string} contId IDに使用する番号
 * @param {Object} req 送信内容を持つオブジェクト
 * @param {boolean=} nobusy =true:お待ちくださいダイアログを非表示にする
 *
 * 勤務表から申請ダイアログが呼び出された時、勤怠時刻修正申請で自動承認されるケースを
 * 考慮してクリーンアップ（teasp.view.Monthly.prototype.disposeInit）が呼ばれるようにする。
 */
teasp.dialog.EmpApply.prototype.requestSend = function(contId, req, nobusy){
	var client  = req.client = this.client;
	var noDelay = req.noDelay = true;
	var note    = req.apply.note;
	if(!nobusy){
		teasp.manager.dialogOpen('BusyWait');
	}
	teasp.manager.request(
		'applyEmpDay',
		req,
		this.pouch,
		{ hideBusy : true },
		this,
		function(){
			if(note){
				var s = this.dayWrap.getDayNote(!this.pouch.isSeparateDailyNote());
				this.dayWrap.setDayNote((s ? s + '\n' : '') + note);
			}
			if(client == teasp.constant.APPLY_CLIENT_DAILY || noDelay){
				this.onfinishfunc(true);
				this.close();
			}
		},
		function(event){
			teasp.manager.dialogClose('BusyWait');
			teasp.dialog.EmpApply.showError(contId, teasp.message.getErrorMessage(event));
		},
		function(){
			this.onfinishfunc();
			this.close();
			teasp.manager.dialogClose('BusyWait');
		}
	);
};

/**
 * 対象期間の申請リストを取得
 *
 * @param {string} sd 開始日 ('yyyy-MM-dd')
 * @param {string=} ed 終了日 ('yyyy-MM-dd')
 * @return {Object}
 */
teasp.dialog.EmpApply.prototype.getRangeApplys = function(sd, ed){
	var mp = {};
	var d = sd;
	while(d <= (ed || sd)){
		var o = this.pouch.getObj().days[d];
		if(!o){
			o = { date: d, rack: {} };
			var dm = this.pouch.getObj().dayMap[d];
			o.rack.invalidApplys = [];  // 無効な申請リストを入れる変数
			o.rack.validApplys   = teasp.logic.EmpTime.getValidApplyMap((dm && dm.applys) || [], o.rack.invalidApplys, d);
		}
		mp[d] = o;
		d = teasp.util.date.addDays(d, 1);
	}
	return mp;
};

/**
 * 休暇申請を取れる日かどうかをチェックする
 *
 * @param {Object} day 日次オブジェクト（getRangeApplys の戻り値の１要素を想定）
 * @param {Object} holy range 要素を持つオブジェクト
 * @param {Object} revw メッセージ要素を持つオブジェクト
 * @param {Object} oths 休暇日に無効な申請を集めるオブジェクト
 * @return {string} エラーの場合はメッセージ、エラーでなければ null
 */
teasp.dialog.EmpApply.prototype.conflictHoliday = function(day, holy, revw, oths){
	var m = this.pouch.getEmpMonthByDate(day.date);
	if(m && this.pouch.isEmpMonthFixed(m)){ // 対象日の月度は確定済み
		var ym = m.yearMonth;
		var sn = m.subNo;
		var ymj = teasp.util.date.formatMonth('zv00000020', Math.floor(ym / 100), (ym % 100), sn);
		return teasp.message.getLabel('tk10005180' // {0}は勤務確定されています。{1}を見直してください。
				, ymj
				, revw.msge1);
	}
	if((holy.displayDaysOnCalendar || !day.rack.validApplys.kyushtu || !day.rack.validApplys.kyushtu.length)
	&& day.rack.validApplys.dailyFix){ // 対象日は日次確定済みかつ（休日出勤申請なしまたは暦日表示休暇をとろうとしている）
		return teasp.message.getLabel('tk10005190' // {0} は日次確定されています。{1}を見直してください。
				, teasp.util.date.formatDate(day.date, 'M/d')
				, revw.msge1);
	}
	var hflag = 0;
	if(day.rack.validApplys.holidayAm){
		hflag |= 1;
	}
	if(day.rack.validApplys.holidayPm){
		hflag |= 2;
	}
	if(day.rack.validApplys.holidayAll){
		hflag |= 3;
	}
	var htlst = day.rack.validApplys.holidayTime;
	var pattern = (day.pattern || null);
	if(holy.range == teasp.constant.RANGE_ALL){
		if(hflag || htlst.length > 0){
			return teasp.message.getLabel('tk10004610', revw.msge2); // {0}に他の休暇が申請されています。
		}
	}
	if(holy.range == teasp.constant.RANGE_AM || holy.range == teasp.constant.RANGE_PM){
		if(hflag == 3
		|| (holy.range == teasp.constant.RANGE_AM && hflag == 1)
		|| (holy.range == teasp.constant.RANGE_PM && hflag == 2)
		|| (hflag && htlst.length)){ // 半休と時間単位休がある（#9867 comment27）
			return teasp.message.getLabel('tk10004610', revw.msge2); // {0}に他の休暇が申請されています。
		}
		if(htlst.length > 0 && pattern && !day.rack.flexHalfDayTime){
			var pr = {
				from : (holy.range == teasp.constant.RANGE_AM ? pattern.amHolidayStartTime : pattern.pmHolidayStartTime),
				to   : (holy.range == teasp.constant.RANGE_AM ? pattern.amHolidayEndTime   : pattern.pmHolidayEndTime  )
			};
			var hl = [];
			for(var j = 0 ; j < htlst.length ; j++){
				hl.push({
					from : htlst[j].startTime,
					to   : htlst[j].endTime
				});
			}
			if(teasp.util.time.rangeTime(pr, hl) > 0){
				return teasp.message.getLabel('tk10004610', revw.msge2); // {0}に他の休暇が申請されています。
			}
		}
	}
	if(this.pouch.isProhibitInputTimeUntilApproved()){ // 承認されるまで時間入力を禁止
		var a = day.rack.validApplys.exchangeS;
		if(a && a.status == teasp.constant.STATUS_WAIT){
			return teasp.message.getLabel('tk10005240', revw.msge2, a.applyType); // {0}に承認されていない{1}があるため、申請できません。
		}
		a = day.rack.validApplys.exchangeE;
		if(a && a.status == teasp.constant.STATUS_WAIT){
			return teasp.message.getLabel('tk10005240', revw.msge2, a.applyType); // {0}に承認されていない{1}があるため、申請できません。
		}
		a = (day.rack.validApplys.kyushtu && day.rack.validApplys.kyushtu.length > 0 ? day.rack.validApplys.kyushtu[0] : null);
		if(a && a.status == teasp.constant.STATUS_WAIT){
			return teasp.message.getLabel('tk10005240', revw.msge2, a.applyType); // {0}に承認されていない{1}があるため、申請できません。
		}
	}
	if(!(this.pouch.getEmpDay(day.date)).isFlexHalfDayTimeDay() // コア時間帯が設定されていないフレックスの半日休暇適用時間を使用しない
	|| (holy.range != teasp.constant.RANGE_AM && holy.range != teasp.constant.RANGE_PM)
	){
		var ra = (day.rack.validApplys.reviseTime.length > 0 ? day.rack.validApplys.reviseTime[0] : null); // 勤怠時刻修正申請
		if(ra && ra.status == teasp.constant.STATUS_WAIT){
			return teasp.message.getLabel('tf10011300', revw.msge2); // {0}に承認待ちの勤怠時刻修正申請があるため申請できません。
		}
	}
	if(oths && holy.range == teasp.constant.RANGE_ALL){
		var za = (day.rack.validApplys.zangyo.length     > 0 ? day.rack.validApplys.zangyo[0]     : null); // 残業申請
		var es = (day.rack.validApplys.earlyStart.length > 0 ? day.rack.validApplys.earlyStart[0] : null); // 早朝勤務申請
		var ls = day.rack.validApplys.lateStart;     // 遅刻申請
		var ee = day.rack.validApplys.earlyEnd;      // 早退申請
		if(za){ oths[za.applyType] = 1; oths.cnt++; }
		if(es){ oths[es.applyType] = 1; oths.cnt++; }
		if(ls){ oths[ls.applyType] = 1; oths.cnt++; }
		if(ee){ oths[ee.applyType] = 1; oths.cnt++; }
	}
	return null;
};

/**
 * 直行・直帰申請をサーバへ送信
 *
 * @param {string} contId IDに使用する番号
 * @param {Object} req 送信内容を持つオブジェクト
 * @param {boolean} flag trueの場合、既申請の直行･直帰申請を反映させる
 */
teasp.dialog.EmpApply.prototype.requestDirectApply = function(contId, req, flag){
	req.client      = this.client;
	teasp.manager.dialogOpen('BusyWait');
	var dlst = teasp.util.date.getDateList(req.apply.startDate, req.apply.endDate);
	var directFlag = 0;
	var client     = req.client;
	var note       = req.apply.note;
	if(flag){
		var dr = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_DIRECT); // 直行・直帰申請
		var hw = this.dayWrap.getEmpApplyByKey(teasp.constant.APPLY_KEY_KYUSHTU); // 休日出勤申請
		directFlag = ((dr && dr.directFlag) || (hw && hw.directFlag) || 0);
	}else{
		directFlag = req.apply.directFlag;
	}
	var index = 0;
	var f = null;
	f = dojo.hitch(this, function(){
		var dw = this.pouch.getEmpDay(dlst[index]);
		var tt = dw.createTimeTableFix(directFlag);
		var x = -1;
		for(var i = 0 ; i < tt.length ; i++){
			if(tt[i].type == 1){
				x = i;
				break;
			}
		}
		if(x >= 0 && this.pouch.isProhibitBorderRestTime()){ // 出社・退社時刻を含む休憩＝入力不可
			var o = {
				from  : tt[x].from,
				to    : tt[x].to,
				rests : teasp.logic.EmpTime.filterTimeTable(tt, [teasp.constant.REST_FIX, teasp.constant.REST_FREE], 3)
			};
			var it = teasp.logic.EmpTime.adjustInputTime(o, directFlag);
			if((directFlag & 1) && tt[x].from != it.from){
				tt[x].from = it.from;
			}
			if((directFlag & 2) && tt[x].to != it.to){
				tt[x].to = it.to;
			}
		}
		var newSt = (x < 0 ? null : tt[x].from);
		var newEt = (x < 0 ? null : tt[x].to);
		var orgSt = dw.getStartTime(true, null, teasp.constant.C_REAL); // 入力済みの出社時刻
		var orgEt = dw.getEndTime(true, null, teasp.constant.C_REAL);   // 入力済みの退社時刻
		if(orgSt === ''){ orgSt = null; }
		if(orgEt === ''){ orgEt = null; }
		if(orgSt === newSt && orgEt === newEt){
			index++;
			if(index < dlst.length){
				setTimeout(f, 100);
			}else{
				this.onfinishfunc();
				this.close();
				teasp.manager.dialogClose('BusyWait');
			}
			return;
		}
		var ireq = {
			empId             : this.pouch.getEmpId(),
			month             : this.pouch.getYearMonth(),
			startDate         : this.pouch.getStartDate(),
			lastModifiedDate  : this.pouch.getLastModifiedDate(),
			mode              : this.pouch.getMode(),
			date              : dlst[index],
			dayFix            : false,
			client            : client,
			timeTable         : tt,
			refreshWork       : true,
			clearWork         : false,
			useInputAccessControl : this.pouch.isInputAccessControl()
		};
		teasp.manager.request(
			'inputTimeTable',
			ireq,
			this.pouch,
			{ hideBusy : true },
			this,
			function(){
				index++;
				if(index < dlst.length){
					setTimeout(f, 100);
				}else{
					this.onfinishfunc();
					this.close();
					teasp.manager.dialogClose('BusyWait');
				}
			},
			function(event){
				teasp.manager.dialogClose('BusyWait');
				teasp.dialog.EmpApply.showError(contId, teasp.message.getErrorMessage(event));
			}
		);
	});
	teasp.manager.request(
		'applyEmpDay',
		req,
		this.pouch,
		{ hideBusy : true },
		this,
		function(){
			if(note){
				var s = this.dayWrap.getDayNote(!this.pouch.isSeparateDailyNote());
				this.dayWrap.setDayNote((s ? s + '\n' : '') + note);
			}
			setTimeout(f, 100);
		},
		function(event){
			teasp.manager.dialogClose('BusyWait');
			teasp.dialog.EmpApply.showError(contId, teasp.message.getErrorMessage(event));
		},
		function(){
		}
	);
};

/**
 * 直行・直帰申請を取り消すまたは直行・直帰申請のある日の他の申請を取り消す
 *
 * @param {string} contId IDに使用する番号
 * @param {Object} req 送信内容を持つオブジェクト
 */
teasp.dialog.EmpApply.prototype.cancelDirectApply = function(contId, req, applyObj){
	var dlst = teasp.util.date.getDateList(applyObj.startDate, applyObj.endDate);
	var directFlag = applyObj.directFlag;
	var client     = this.client;

	teasp.manager.dialogOpen('BusyWait');
	var index = 0;
	var f = null;
	f = dojo.hitch(this, function(){
		var dw = this.pouch.getEmpDay(dlst[index]);
		var orgSt = dw.getStartTime(true, null, teasp.constant.C_REAL); // 入力済みの出社時刻
		var orgEt = dw.getEndTime(true, null, teasp.constant.C_REAL);   // 入力済みの退社時刻
		if(orgSt === ''){ orgSt = null; }
		if(orgEt === ''){ orgEt = null; }
		var tt = null;
		if(directFlag){ // 直行・直帰申請の取り消し
			tt = dw.createTimeTable(((directFlag & 1) ? null : orgSt), ((directFlag & 2) ? null : orgEt));
		}else{ // 直行・直帰申請以外の申請の取り消し
			tt = dw.createTimeTableFix(dw.getInputLimit().directFlag);
		}
		var x = -1;
		for(var i = 0 ; i < tt.length ; i++){
			if(tt[i].type == 1){
				x = i;
				break;
			}
		}
		if(x >= 0 && this.pouch.isProhibitBorderRestTime()){ // 出社・退社時刻を含む休憩＝入力不可
			var df = (directFlag ? directFlag : dw.getInputLimit().directFlag);
			var o = {
				from  : tt[x].from,
				to    : tt[x].to,
				rests : teasp.logic.EmpTime.filterTimeTable(tt, [teasp.constant.REST_FIX, teasp.constant.REST_FREE], 3)
			};
			var it = teasp.logic.EmpTime.adjustInputTime(o, df);
			if((df & 1) && tt[x].from != it.from){
				tt[x].from = it.from;
			}
			if((df & 2) && tt[x].to != it.to){
				tt[x].to = it.to;
			}
		}
		var newSt = (x < 0 ? null : tt[x].from);
		var newEt = (x < 0 ? null : tt[x].to);
		if(orgSt === newSt && orgEt === newEt){
			index++;
			if(index < dlst.length){
				setTimeout(f, 100);
			}else{
				this.onfinishfunc();
				this.close();
				teasp.manager.dialogClose('BusyWait');
			}
			return;
		}
		var ireq = {
			empId             : this.pouch.getEmpId(),
			month             : this.pouch.getYearMonth(),
			startDate         : this.pouch.getStartDate(),
			lastModifiedDate  : this.pouch.getLastModifiedDate(),
			mode              : this.pouch.getMode(),
			date              : dlst[index],
			dayFix            : false,
			client            : client,
			timeTable         : tt,
			refreshWork       : true,
			clearWork         : false,
			empApplyId        : applyObj.id,
			useInputAccessControl : this.pouch.isInputAccessControl()
		};
		teasp.manager.request(
			'inputTimeTable',
			ireq,
			this.pouch,
			{ hideBusy : true },
			this,
			function(){
				index++;
				if(index < dlst.length){
					setTimeout(f, 100);
				}else{
					this.onfinishfunc();
					this.close();
					teasp.manager.dialogClose('BusyWait');
				}
			},
			function(event){
				teasp.manager.dialogClose('BusyWait');
				teasp.dialog.EmpApply.showError(contId, teasp.message.getErrorMessage(event));
			}
		);
	});
	teasp.manager.request(
		'cancelApplyEmpDay',
		req,
		this.pouch,
		{ hideBusy : true },
		this,
		function(){
			setTimeout(f, 100);
		},
		function(event){
			teasp.manager.dialogClose('BusyWait');
			teasp.dialog.EmpApply.showError(contId, teasp.message.getErrorMessage(event));
		}
	);
};

teasp.dialog.EmpApply.getString = function() {
	var a = arguments;
	var b = dojo.clone(a[0]);
	for (var i = 1; i < a.length; i++)
		b = b.replace(RegExp("\\{" + (i - 1) + "\\}", "g"), a[i]);
	return b;
};

teasp.dialog.EmpApply.prototype.checkExchangeApplys = function(osd, ed, callback){
	var soql = "select Id, Status__c, ApplyType__c, StartDate__c, ExchangeDate__c, OriginalStartDate__c, ApplyTime__c"
		+ " from AtkEmpApply__c"
		+ " where EmpId__c = '{0}'"
		+ " and ApplyType__c = '{1}'"
		+ " and OriginalStartDate__c = {2}"
		+ " and TempFlag__c = false"
		+ " and Removed__c = false"
	;
	soql = teasp.dialog.EmpApply.getString(soql, this.pouch.getEmpId(), teasp.constant.APPLY_TYPE_EXCHANGE, osd);
	var req = {
		funcName: 'getExtResult',
		params  : {
			soql   : soql,
			limit  : 1000,
			offset : 0
		}
	};
	teasp.action.contact.remoteMethods(
		[req],
		{
			errorAreaId : null,
			nowait      : true
		},
		function(result){
			var applys = teasp.logic.convert.convEmpApplyObjs(result.records);
			callback(applys, osd, ed);
		},
		null,
		this
	);
};

/**
 * 申請メニュータブエリア高さ調整
 * onShow イベントではアクティブなタブが取れないため、setTimeout で 100ms 後に処理を行う。
 *
 */
teasp.dialog.EmpApply.prototype.adjustMenuHeight = function(e){
	setTimeout(dojo.hitch(this, function(){
		var area = dojo.byId('empApplyTableArea');
		var h = dojo.query('table.emp_apply_menu', area)[0].clientHeight;
		dojo.query('.dijitTabPaneWrapper,.dijitTabContainerTopChildWrapper,.dijitTabPane', area).forEach(function(el){
			dojo.style(el, 'height', '' + (h + 30) + 'px');
		});
		dojo.query('.dijitTabContainer', area).forEach(function(el){
			dojo.style(el, 'height', '' + (h + 60) + 'px');
		});
	}), 100);
};

/**
 * 申請タブエリア高さ調整
 * onShow イベントではアクティブなタブが取れないため、setTimeout で 100ms 後に処理を行う。
 *
 */
teasp.dialog.EmpApply.adjustContentHeight = function(){
	setTimeout(dojo.hitch(this, function(){
		var area = dojo.byId('empApplyTableArea');
		var cp = dijit.byId('empApplyTab').selectedChildWidget; // アクティブなタブを取得
		if(cp){
			var conts = dojo.query('div.empApplyContHigh', cp.domNode);
			if(conts.length){
				var h = conts[0].offsetHeight;
				dojo.query('.dijitTabPaneWrapper,.dijitTabContainerTopChildWrapper,.dijitTabPane', area).forEach(function(el){
					dojo.style(el, 'height', '' + (h + 30) + 'px');
				});
				dojo.query('.dijitTabContainer', area).forEach(function(el){
					dojo.style(el, 'height', '' + (h + 60) + 'px');
				});
			}
		}
	}), 100);
};

/**
 */
teasp.dialog.EmpApply.prototype.drawLast = function(applyObj, node){
};

teasp.dialog.EmpApply.prototype.disableApplyButton = function(contId, flag){
	var btn = dojo.byId('empApplyDone' + contId);
	if(btn){
		dojo.setAttr(btn, 'disabled', flag);
		dojo.toggleClass(btn, 'std-button1'         , !flag);
		dojo.toggleClass(btn, 'std-button1-disabled',  flag);
	}
};

teasp.dialog.EmpApply.prototype.isNotTheDayApply = function(applyObj, dt){
	return (applyObj.startDate != dt && applyObj.applyType != teasp.constant.APPLY_TYPE_SHIFTCHANGE);
};
