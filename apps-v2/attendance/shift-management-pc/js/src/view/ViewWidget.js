teasp.provide('teasp.view.Widget');
/**
 * ホームウィジェット画面
 *
 * @constructor
 * @extends {teasp.view.Base}
 * @author DCI小島
 */
teasp.view.Widget = function(){
	this.timerID = null;
	this.eventHandles = {};
	this.token = 0;
};

teasp.view.Widget.prototype = new teasp.view.Base();

/**
 * 画面初期化
 *
 * @param {Object} messageMap メッセージテーブル
 * @param {Function=} onSuccess レスポンス正常受信時の処理
 * @param {Function=} onFailure レスポンス異常受信時の処理
 * @this {teasp.view.Widget}
 */
teasp.view.Widget.prototype.init = function(messageMap, onSuccess, onFailure){
	teasp.message.mergeLabels(globalMessages || {});
	teasp.message.mergeLabels(messageMap ? (messageMap[teasp.message.getLanguageLocaleKey()] || {}) : {});

	this.pushTimeWithLocationWeb = (teasp.commonConfig && teasp.commonConfig.pushTimeWithLocationWeb) || false;

	dojo.byId('jumpMonthly').title = teasp.message.getLabel('empTimeView_btn_title'); // 勤務表へ
	dojo.byId('jumpDaily'  ).title = teasp.message.getLabel('timeReport_link_title'); // タイムレポートへ
	dojo.byId('jumpExp'    ).title = teasp.message.getLabel('tf10000480'); // 経費精算へ
	dojo.byId('btnTstInput').title = teasp.message.getLabel('tm50001160'); // 定時出社打刻
	dojo.byId('btnTetInput').title = teasp.message.getLabel('tm50001170'); // 定時退社打刻
	dojo.byId('btnTweet'   ).title = teasp.message.getLabel('tm50001180'); // Chatterへ投稿

	dojo.byId('btnStInput' ).value = teasp.message.getLabel('tw00000270'); // 出勤
	dojo.byId('btnEtInput' ).value = teasp.message.getLabel('tw00000280'); // 退勤
	dojo.byId('btnTstInput').value = teasp.message.getLabel('tw00000290'); // 定時 出勤
	dojo.byId('btnTetInput').value = teasp.message.getLabel('tw00000300'); // 定時 退勤
	dojo.toggleClass('btnTstInput', 'pw_btn_english', teasp.isEnglish());
	dojo.toggleClass('btnTetInput', 'pw_btn_english', teasp.isEnglish());

	if(teasp.permitPushTime){
		dojo.byId('btnStInput' ).title = teasp.message.getLabel('tm50001140'); // 出社打刻
		dojo.byId('btnEtInput' ).title = teasp.message.getLabel('tm50001150'); // 退社打刻
	}else{
		dojo.byId('btnStInput' ).title = teasp.message.getLabel('tk10005330'); // 利用しているネットワークからの打刻はできません
		dojo.byId('btnEtInput' ).title = teasp.message.getLabel('tk10005330'); // 〃
	}

	this.clockStart();
	// サーバへリクエスト送信
	teasp.manager.request(
		'loadWidget',
		{},
		this.pouch,
		{ hideBusy : true },
		this,
		function(){
			this.receiveDashboard();
		},
		function(event){
			dojo.style('infoError', 'display', 'block');
			if(!/Unable to connect to the server/.test(event.message)){
				dojo.byId('errorMessage').innerHTML = teasp.message.getErrorMessage(event);
			}
		}
	);
};

teasp.view.Widget.prototype.clockStart = function() {
	var clockIn = dojo.hitch(this, function(){
		var dt = teasp.util.date.getToday();
		this.showClock(dt);
		if(dt.getSeconds() == 0 && this.pouch && this.pouch.getEmpId()){
			this.setPushButtons();
		}
	});
	this.timerID = setInterval(clockIn, 1000);
};

teasp.view.Widget.prototype.showClock = function(dt){
	dojo.byId('clock_date').innerHTML = teasp.util.date.formatDate(dt, 'SLA');
	dojo.byId('clock_time').innerHTML = dt.getHours() + ':' + (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
	dojo.byId('clock_week').innerHTML = ['(SUN)','(MON)','(TUE)','(WED)','(THU)','(FRI)','(SAT)'][dt.getDay()];
};

teasp.view.Widget.prototype.receiveDashboard = function(){
	dojo.connect(dojo.byId('jumpMonthly'), 'onclick', this, this.jumpToMonthly);
	dojo.byId('jumpMonthly').className = 'pw_base pw_jumpmo';
	if(!this.pouch.isDisabledTimeReport()){
		dojo.connect(dojo.byId('jumpDaily')  , 'onclick', this, this.jumpToDaily);
		dojo.byId('jumpDaily').className = 'pw_base pw_jumpda';
	}else{
		dojo.byId('jumpDaily').className = 'pw_base pw_jumpda_dis';
		dojo.byId('jumpDaily').title = '';
	}
	if(!this.pouch.isDisabledEmpExp()){
		dojo.connect(dojo.byId('jumpExp')  , 'onclick', this, this.jumpToExp);
		dojo.byId('jumpExp').className = 'pw_base pw_jumpex';
	}else{
		dojo.byId('jumpExp').className = 'pw_base pw_jumpex_dis';
		dojo.byId('jumpExp').title = '';
	}
	if(this.pouch.getEmpId()){
		// コメント入力欄のスタイル切替
		dojo.toggleClass('bgComment', 'pw_bgcomment1', !this.pouch.isUseWorkLocation());
		dojo.toggleClass('bgComment', 'pw_bgcomment2',  this.pouch.isUseWorkLocation());
		dojo.byId('btnTweet').className = 'pw_base pw_btntwe';
		dojo.connect(dojo.byId('btnTweet')   , 'onclick', this, function(){ this.pushTimeStep1({type:0}); });
		this.setPushButtons();

		if(this.pouch.isUseWorkLocation()){
			this.buildWorkLocationArea(); // 勤務場所選択エリア構築
		}
		this.showInfoRedIcon();
	}
};
/**
 * 勤務場所選択用パラメータ初期化
 */
 teasp.view.Widget.prototype.initWorkLocationParameters = function(){
	this.scrollTimerID = null;
	// 定数
	// Firefoxはスクロール速度が異なるため、移動量を調整する
	this.SCROLL_AMOUNT1 = (dojo.isFF ?  5 : 1); // LRボタン押下時の移動量
	this.SCROLL_AMOUNT2 = (dojo.isFF ? 10 : 4); // 自動位置合わせ時の移動量
	this.SCROLL_INTERVAL1 = 500; // LRボタン押下時の間隔
	this.SCROLL_INTERVAL2 = 200; // 自動位置合わせ時の間隔
	this.POSITION_XMARGIN = 20; // 自動位置合わせ時のマージン
};
/**
 * 勤務場所選択エリア作成
 * エリア・ラベル・LRボタンを作る。各エリアの表示位置・サイズは AtkStyle.css で設定される
 */
teasp.view.Widget.prototype.createWorkLocationArea = function(){
	this.initWorkLocationParameters();
	const bigArea = dojo.byId('big_area');
	// ラベル
	dojo.create('div', { id:'workLocationAreaTitle', innerHTML:teasp.message.getLabel('tw00000260') }, bigArea); // 勤務場所を選択して打刻をしてください
	// ベース領域を作成
	const workLocationArea = dojo.create('div', { id:'workLocationArea' }, bigArea);
	// スクロールエリアの左側にボタンを配置
	dojo.create('input', { type:'button', id:'workLocationScrollL', className:'pw_base workLocation_scrollL', style:'display:none;' }, workLocationArea);
	// スクロールエリア
	dojo.create('div', { id:'workLocationButtons' }, dojo.create('div', { id:'workLocationButtonArea' }, workLocationArea));
	// スクロールエリアの右側にボタンを配置
	dojo.create('input', { type:'button', id:'workLocationScrollR', className:'pw_base workLocation_scrollR', style:'display:none;' }, workLocationArea);
	// Chrome(Edgeも含まれる)以外はスクロールバーのデザインを変えられないため、非表示にする
	if(!dojo.isChrome){
		dojo.style('workLocationButtonArea', 'overflow-x', 'hidden');
	}
};
/**
 * 勤務場所選択エリア構築
 * エリア作成、勤務場所ボタンの配置、イベントリスナーをセット
 */
teasp.view.Widget.prototype.buildWorkLocationArea = function(){
	this.createWorkLocationArea(); // エリア作成
	// 勤務場所ボタンを配置
	const workLocationButtons = dojo.byId('workLocationButtons');
	const workLocations = this.pouch.getWorkLocations();
	const defaultId = this.getDefaultWorkLocationId();
	for(var i = 0 ; i < workLocations.length ; i++){
		const workLocation = workLocations[i];
		const button = dojo.create('input', {
			type: 'radio',
			className: 'workLocation_radio',
			name: 'workLocation',
			id: 'workLocationButton'+(i+1),
			checked: (defaultId && workLocation.getId() == defaultId ? true : false)
		}, workLocationButtons);
		dojo.create('div', {
			className: 'workLocation_radio',
			innerHTML: workLocation.getName().substring(0, 20),
			title: workLocation.getName()
		}, dojo.create('label', {
			for: 'workLocationButton'+(i+1),
			className: 'workLocation_radio'
		}, workLocationButtons));
		dojo.setAttr(button, 'data', workLocation.getId());
		dojo.connect(button, 'click', this, this.scrollWorkLocationAutoPos);
	}
	// ボタンエリアのサイズを計算してスクロール領域幅をセット
	var width = 0;
	dojo.query('label.workLocation_radio', workLocationButtons).forEach(function(el){
		width += (el.offsetWidth + 1);
	});
	this.workLocationButtonsWidth = width;
	dojo.style('workLocationButtons', 'width', this.workLocationButtonsWidth + 'px');
	// スクロールイベントリスナー
	dojo.connect(dojo.byId('workLocationScrollL'), 'mousedown', this, function(e){if(!e.button){this.scrollWorkLocationLRPress(this.SCROLL_AMOUNT1*(-1));}});
	dojo.connect(dojo.byId('workLocationScrollL'), 'mouseup'  , this, this.clearScrollWorkLocationInterval);
	dojo.connect(dojo.byId('workLocationScrollL'), 'dblclick' , this, function(e){if(!e.button){this.scrollWorkLocationAutoPos(e, true);}});
	dojo.connect(dojo.byId('workLocationScrollR'), 'mousedown', this, function(e){if(!e.button){this.scrollWorkLocationLRPress(this.SCROLL_AMOUNT1);}});
	dojo.connect(dojo.byId('workLocationScrollR'), 'mouseup'  , this, this.clearScrollWorkLocationInterval);
	dojo.connect(dojo.byId('workLocationScrollR'), 'dblclick' , this, function(e){if(!e.button){this.scrollWorkLocationAutoPos(e, true);}});
	dojo.connect(dojo.byId('workLocationButtonArea'), 'scroll', this, function(e){this.scrollWorkLocationButtons();});
	// 選択中の勤務場所ボタンが見える位置へスクロール
	this.scrollWorkLocationAutoPos(null, true);
};
/**
 * 登録済みまたはデフォルトの勤務場所を返す
 * @returns {string|null}
 */
teasp.view.Widget.prototype.getDefaultWorkLocationId = function(){
	const tinfo = this.getTimeInfo();
	const dayWrap = this.pouch.getEmpDay(tinfo.pTime > 0 ? tinfo.pkey : tinfo.tkey);
	const id = dayWrap.getWorkLocationId(); // 登録済みの勤務場所
	const workLocation = (id ? this.pouch.getWorkLocationById(id) : null);
	if(workLocation && !workLocation.isRemoved()){
		return workLocation.getId();
	}
	const defaultWorkLocation = this.pouch.getDefaultWorkLocation();
	return (defaultWorkLocation ? defaultWorkLocation.getId() : null);
};
/**
 * 選択中の勤務場所を返す
 * @returns {{workLocation:{teasp.data.WorkLocation}, index:{number}}}
 */
teasp.view.Widget.prototype.getCheckedWorkLocation = function(){
	var index = -1;
	var i = 0;
	var id = null;
	dojo.query('input.workLocation_radio', dojo.byId('workLocationButtons')).some(function(el){
		if(el.checked){
			index = i;
			id = dojo.getAttr(el, 'data');
			return true;
		}
		i++;
	});
	if(id !== null){
		return {
			workLocation: this.pouch.getWorkLocationById(id),
			index: index
		};
	}
	return null;
};
/**
 * ボタンの両端のX座標を取得
 * @returns {Array.<{x1:{number}, x2:{number}}>}
 */
teasp.view.Widget.prototype.getWorkLocationButtonXPos = function(){
	var x = 0;
	const xpos = [];
	dojo.query('label.workLocation_radio', dojo.byId('workLocationButtons')).forEach(function(el){
		xpos.push({
			x1: x,
			x2: x + el.offsetWidth
		});
		x += el.offsetWidth;
	});
	return xpos;
};
/**
 * 選択中の勤務場所ボタンが見える位置へスクロール
 * @param {Event} e
 * @param {boolean=} flag  true:即移動、false:タイマーで少しずつ移動
 */
teasp.view.Widget.prototype.scrollWorkLocationAutoPos = function(e, flag){
	const selected = this.getCheckedWorkLocation(); // 選択中の勤務場所を取得
	if(!selected){ // 選択中の勤務場所はない
		this.scrollWorkLocationButtons(null);
	}else{
		const xpos = this.getWorkLocationButtonXPos(); // ボタンの両端のX座標
		// ボタン位置へスクロール（自動位置合わせ）
		const scrollArea = dojo.byId('workLocationButtonArea');
		const scrollLeft = scrollArea.scrollLeft;
		const reqL = xpos[selected.index].x1 - this.POSITION_XMARGIN;
		const reqR = Math.max(xpos[selected.index].x2 + this.POSITION_XMARGIN - scrollArea.clientWidth, 0);
		if(reqL < scrollLeft){
			if(flag){
				this.scrollWorkLocationButtons(reqL - scrollLeft);
			}else{
				this.setScrollWorkLocationInterval(this.SCROLL_AMOUNT2*(-1), reqL);
			}
		}else if(scrollLeft < reqR){
			if(flag){
				this.scrollWorkLocationButtons(reqR - scrollLeft);
			}else{
				this.setScrollWorkLocationInterval(this.SCROLL_AMOUNT2, reqR);
			}
		}else{
			this.scrollWorkLocationButtons(null);
		}
	}
};
/**
 * LRボタンを押している間スクロール
 * @param {number=} increment 1回あたりの移動量（左=マイナス、右=プラス）
 */
teasp.view.Widget.prototype.scrollWorkLocationLRPress = function(increment){
	this.clearScrollWorkLocationInterval();
	this.scrollTimerID = setInterval(dojo.hitch(this, function(){
		this.scrollWorkLocationButtons(increment);
	}, this.SCROLL_INTERVAL1));
};
/**
 * 指定位置へ自動スクロール
 * @param {number} increment 1回あたりの移動量（左=マイナス、右=プラス）
 * @param {number} reqx 指定位置
 */
teasp.view.Widget.prototype.setScrollWorkLocationInterval = function(increment, reqx){
	this.clearScrollWorkLocationInterval();
	this.scrollTimerID = setInterval(dojo.hitch(this, function(){
		const x = dojo.byId('workLocationButtonArea').scrollLeft;
		if((increment < 0 && x <= reqx)
		|| (increment > 0 && x >= reqx)){ // 指定位置に達したため終了
			this.clearScrollWorkLocationInterval();
		}else{
			this.scrollWorkLocationButtons(increment);
		}
	}, this.SCROLL_INTERVAL2));
};
/**
 * 勤務場所ボタンスクロールタイマー解除
 */
teasp.view.Widget.prototype.clearScrollWorkLocationInterval = function(){
	if(this.scrollTimerID !== null){
		clearInterval(this.scrollTimerID);
	}
	this.scrollTimerID = null;
};
/**
 * 勤務場所ボタンスクロール
 * @param {number=} increment 移動量（左=マイナス、右=プラス）、省略時は移動なし
 */
teasp.view.Widget.prototype.scrollWorkLocationButtons = function(increment){
	const reqx = (typeof(increment) == 'number' ? increment : null);
	const scrollArea = dojo.byId('workLocationButtonArea');
	const maxLeft = Math.max(this.workLocationButtonsWidth - scrollArea.clientWidth, 0); // 右端
	var x = Math.min(Math.max(scrollArea.scrollLeft + (reqx || 0), 0), maxLeft);
	if(!x || x == maxLeft){ // 左端または右端に到達
		this.clearScrollWorkLocationInterval();
	}
	if(reqx !== null){
		scrollArea.scrollLeft = x;
	}
	// LRボタンの表示/非表示切替
	dojo.style('workLocationScrollL', 'display', (!x ? 'none' : ''));
	dojo.style('workLocationScrollR', 'display', (x == maxLeft ? 'none' : ''));
};
/**
 * お知らせの赤い丸数字を表示
 */
teasp.view.Widget.prototype.showInfoRedIcon = function(){
	if(!this.pouch.getEmpId()){
		return;
	}
	const cnt = this.pouch.getAllInfoCount();
	const icons = dojo.query('div.info_red_icon', dojo.byId('big_area'));
	if(cnt > 0 && !icons.length){
		const infoRed = dojo.create('div', {
			innerHTML: cnt,
			title: teasp.message.getLabel('tm50001010', cnt),
			className: 'pw_base info_red_icon'
		}, dojo.byId('big_area'));
		dojo.connect(infoRed, 'click', this, this.openInfoView);
	}
	if(icons.length){
		icons[0].innerHTML = cnt;
		icons[0].title = teasp.message.getLabel('tm50001010', cnt);
		if(!cnt){
			dojo.style(icons[0], 'display', 'none');
		}
	}
};

teasp.view.Widget.prototype.getTimeInfo = function(){
	var now         = teasp.util.date.getToday();       // 現在時刻
	var todayKey    = teasp.util.date.formatDate(now);
	var yestaKey    = teasp.util.date.addDays(todayKey, -1);
	var todayWrap   = this.pouch.getEmpDay(todayKey);
	var yestaWrap   = this.pouch.getEmpDay(yestaKey);
	var todayObj    = todayWrap.getObj();
	var yestaObj    = yestaWrap.getObj();

	var t   = now.getHours() * 60 + now.getMinutes();   // 現在時刻を分単位の数字に変換

	var st      = (todayObj && typeof(todayObj.startTime)         == 'number') ? todayObj.startTime         : -1; // 当日の出社時刻
	var et      = (todayObj && typeof(todayObj.endTime)           == 'number') ? todayObj.endTime           : -1; // 当日の退社時刻
	var bst     = (yestaObj && typeof(yestaObj.startTime)         == 'number') ? yestaObj.startTime         : -1; // 前日の出社時刻
	var bet     = (yestaObj && typeof(yestaObj.endTime)           == 'number') ? yestaObj.endTime           : -1; // 前日の退社時刻

	var todaySt = (todayObj && typeof(todayObj.rack.fixStartTime) == 'number') ? todayObj.rack.fixStartTime : -1; // 当日の始業時刻
	var todayEt = (todayObj && typeof(todayObj.rack.fixEndTime)   == 'number') ? todayObj.rack.fixEndTime   : -1; // 当日の終業時刻
	var yestaSt = (todayObj && typeof(yestaObj.rack.fixStartTime) == 'number') ? yestaObj.rack.fixStartTime : -1; // 前日の始業時刻
	var yestaEt = (yestaObj && typeof(yestaObj.rack.fixEndTime)   == 'number') ? yestaObj.rack.fixEndTime   : -1; // 前日の終業時刻

	if(et === 0){
		st = -1;
		et = -1;
	}
	if(bet === 0){
		bst = -1;
		bet = -1;
	}

	var todayMonth  = this.pouch.getEmpMonthByDate(todayKey);                                    // 当日の月度
	var yestaMonth  = this.pouch.getEmpMonthByDate(yestaKey);                                    // 前日の月度
	var todayFixed  = (this.pouch.isEmpMonthFixed(todayMonth, true) || todayWrap.isDailyFix());  // 当日が月次確定済みまたは日次確定済みか
	var yestaFixed  = (this.pouch.isEmpMonthFixed(yestaMonth, true) || yestaWrap.isDailyFix());  // 前日が月次確定済みまたは日次確定済みか
	var ua          = this.pouch.isProhibitInputTimeUntilApproved();
	var tdw         = (teasp.view.Widget.isWorkDay(todayObj, ua) && todayObj && !todayFixed);    // 当日は出勤日かつ確定済みでない ＝ 打刻できる日
	var ydw         = (teasp.view.Widget.isWorkDay(yestaObj, ua) && yestaObj && !yestaFixed);    // 前日は出勤日かつ確定済みでない ＝ 打刻できる日

	if(tdw && !this.pouch.isAlive(todayKey)){
		tdw = false;
	}
	if(ydw && !this.pouch.isAlive(yestaKey)){
		ydw = false;
	}

	var pstFlag              = this.pouch.isPermitStartBtnDateChange();                  // 退社時刻未入力でも日付が変われば出社打刻可
	var directFlag           = todayWrap.getInputLimit().flag;                           // 直行・直帰
	var restartable          = (this.pouch.isUseRestartable() && !(directFlag & 2));     // 再出社ボタンは設定がオンかつ直帰申請がないときだけ有効
	var leavingAcrossNextDay = this.pouch.isLeavingAcrossNextDay();                      // 2暦日で勤務日種別が異なる24:00以降の入力不可
	var limitedTimeDistance  = this.pouch.getLimitedTimeDistance();                      // 出社時刻から退社時刻の制限

	var diffDayType = false;
	if(leavingAcrossNextDay
	&& todayObj
	&& yestaObj
	){
		var ydt = (yestaObj.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY && (yestaObj.workFlag || yestaObj.autoLH) ? teasp.constant.DAY_TYPE_NORMAL : yestaObj.dayType);
		var tdt = (todayObj.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY && (todayObj.workFlag || todayObj.autoLH) ? teasp.constant.DAY_TYPE_NORMAL : todayObj.dayType);
		if(ydt == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
			ydt = teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
		}
		if(tdt == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
			tdt = teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
		}
		if(ydt != tdt){
			diffDayType = true; // 2暦日で勤務日種別が異なる
		}
	}

	return teasp.view.Widget.judgePushTime(
			todayKey
			, yestaKey
			, tdw
			, ydw
			, t
			, bst
			, bet
			, st
			, et
			, todaySt
			, todayEt
			, yestaSt
			, yestaEt
			, this.pouch.isPermitLeavingPush24hours()
			, pstFlag
			, restartable
			, limitedTimeDistance
			, diffDayType
			);
};

/**
 *
 * @param {string}  tkey 当日日付の 'yyyy-MM-dd'
 * @param {string}  pkey 前日日付の 'yyyy-MM-dd'
 * @param {boolean} tdw  当日は打刻可
 * @param {boolean} ydw  前日は打刻可
 * @param {number}  t    現在時刻（分単位）
 * @param {number}  pst  前日の出社時刻（未入力の場合、マイナス）
 * @param {number}  pet  前日の退社時刻（未入力の場合、マイナス）
 * @param {number}  st   当日の出社時刻（未入力の場合、マイナス）
 * @param {number}  et   当日の退社時刻（未入力の場合、マイナス）
 * @param {number}  tst  当日の始業時刻
 * @param {number}  tet  当日の終業時刻
 * @param {number}  ptst 前日の始業時刻
 * @param {number}  ptet 前日の終業時刻
 * @param {boolean} plpf 「退社打刻は出社時刻から24時間後までとする」
 * @param {boolean} dstf 「退社時刻未入力でも日付が変われば出社打刻可」
 * @param {boolean} rstf 「退社後の再出社打刻可能」
 * @param {boolean} ltdf 「出社時刻から退社時刻の制限」
 * @param {boolean} ddtf 「2暦日で勤務日種別が異なる24:00以降の入力不可」
 * @returns {Object}
 */
teasp.view.Widget.judgePushTime = function(tkey, pkey, tdw, ydw, t, pst, pet, st, et, tst, tet, ptst, ptet, plpf, dstf, rstf, ltdf, ddtf){
	var borderEt = (5 * 60); // 境界時刻
	if(plpf && pst >= 0 && pst > borderEt){ // 「退社打刻は出社時刻から24時間後までとする」かつ 前日出社時刻あり かつ 前日出社時刻が 5:00 より後の場合
		borderEt = pst;
	}
	var stFlag   = false;
	var etFlag   = false;
	var tstFlag  = false;
	var tetFlag  = false;
	var rstFlag  = false;
	var petFlag  = false;
	var ptetFlag = false;
	/*
	 * 前日退社打刻モードの判定
	 * ・前日の退社打刻なし
	 * ・現在時刻＜境界時刻以前
	 * ・2暦日で勤務日種別が異なる24:00以降の入力不可に該当しない
	 * ・出社時刻から退社時刻の制限がある場合、それを超えない
	 */
	var lasd = (ydw && pet < 0 && t <= borderEt && !ddtf);
	if(lasd && pst >= 0 && ltdf < (48*60)){ // 出社時刻から退社時刻の制限
		var x = (t + 1440) - pst;
		if(x > ltdf){
			lasd = false;
		}
	}

	if(!teasp.permitPushTime){
		return {
			borderEt      : borderEt + 1440,        // 前日退社境界時刻
			pkey          : pkey,                   // 退社打刻の対象日
			tkey          : tkey,                   // 退社打刻の対象日
			pTime         : (lasd ? t + 1440 : -1), // 前日退社の場合、打刻時刻
			tTime         : t,                      // 当日出退社の場合、打刻時刻
			restartable   : false,                  // 再出社打刻モード
			stFlag        : false,                  // 出社打刻ボタン
			etFlag        : false,                  // 退社打刻ボタン
			tstFlag       : false,                  // 定時出社打刻ボタン
			tetFlag       : false,                  // 定時退社打刻ボタン
			petFlag       : false,                  // 前日退社打刻ボタン
			ptetFlag      : false,                  // 前日定時退社打刻ボタン
			stdStartTime  : tst,                    // 始業時刻
			stdEndTime    : tet,                    // 終業時刻
			pstdStartTime : ptst,                   // 前日の始業時刻
			pstdEndTime   : ptet                    // 前日の終業時刻
		};
	}

	if(tdw){
		// 出社打刻ボタンの活性／非活性の判定
		if(rstf && et >= 0 && et < t){                  // 再出社打刻可かつ退社時刻入力済みかつ退社時刻が現在時刻より前
			stFlag  = true;  // 出社打刻可
			rstFlag = true;
		}else if(
			(!lasd || dstf)                             // 前日の退社打刻モードではない または「退社時刻未入力でも日付が変われば出社打刻可」
			&& (st < 0 && (et < 0 || t < et))         // 出社時刻未入力かつ（退社時刻未入力または退社時刻は現在時刻より後）
		){
			stFlag  = true;  // 出社打刻可
		}
		// 定時出社打刻ボタンの活性／非活性の判定
		tstFlag = (stFlag && tst >= 0 && t <= tst && (ptet < 0 || ptet <= (t + 1440)));// 出社打刻可かつ現在時刻が定時出社時刻前

		// 退社打刻ボタン・定時退社打刻ボタンの活性／非活性の判定
		if(lasd && (st < 0 || t <= st) && (et < 0 || t < et)){                                  // 前日の退社打刻モード かつ 出社時刻未入力または現在時刻≦出社時刻
			petFlag  = true;                                                                    // 退社打刻可
			ptetFlag = (petFlag && ptet >= 0 && ptet <= (t + 1440) && (pst < 0 || pst < ptet)); // 退社打刻可かつ定時退社時刻＜現在時刻
		}
		if(et < 0 && (st < 0 || st < t)){                                                       // 前日の退社打刻モードではない かつ 退社時刻未入力かつ（出社時刻未入力または出社時刻＜現在時刻）
			etFlag  = true;                                                                     // 退社打刻可
			tetFlag = (etFlag && tet >= 0 && tet <= t && (st < 0 || st < tet));                 // 退社打刻可かつ定時退社時刻＜現在時刻かつ（出社時刻未入力または出社時刻＜定時退社時刻）
		}
	}else if(ydw){
		// 当日が確定済みの場合、前日分の退社打刻の判定だけ行う
		// 前日分の退社打刻ボタン・定時退社打刻ボタンの活性／非活性の判定
		if(lasd && (st < 0 || t <= st) && (et < 0 || t < et)){                                  // 前日の退社打刻モード かつ 出社時刻未入力または現在時刻≦出社時刻
			petFlag  = true;                                                                    // 退社打刻可
			ptetFlag = (petFlag && ptet >= 0 && ptet <= (t + 1440) && (pst < 0 || pst < ptet)); // 退社打刻可かつ定時退社時刻＜現在時刻
		}
	}
	return {
		borderEt      : borderEt + 1440,        // 前日退社境界時刻
		pkey          : pkey,                   // 退社打刻の対象日
		tkey          : tkey,                   // 退社打刻の対象日
		pTime         : (lasd ? t + 1440 : -1), // 前日退社の場合、打刻時刻
		tTime         : t,                      // 当日出退社の場合、打刻時刻
		restartable   : rstFlag,                // 再出社打刻モード
		stFlag        : stFlag,                 // 出社打刻ボタン
		etFlag        : etFlag,                 // 退社打刻ボタン
		tstFlag       : tstFlag,                // 定時出社打刻ボタン
		tetFlag       : tetFlag,                // 定時退社打刻ボタン
		petFlag       : petFlag,                // 前日退社打刻ボタン
		ptetFlag      : ptetFlag,               // 前日定時退社打刻ボタン
		stdStartTime  : tst,                    // 始業時刻
		stdEndTime    : tet,                    // 終業時刻
		pstdStartTime : ptst,                   // 前日の始業時刻
		pstdEndTime   : ptet                    // 前日の終業時刻
	};
};

/**
 * 出勤日かどうかを判定する
 *
 * @param {Object} dayObj
 * @returns {boolean}
 */
teasp.view.Widget.isWorkDay = function(dayObj, untilAp){
	return (
		dayObj
		&& (
			( (  dayObj.dayType == teasp.constant.DAY_TYPE_NORMAL            //   平日
			|| dayObj.workFlag
			|| dayObj.autoLH
			)
				&& !dayObj.plannedHoliday                                    //   かつ有休計画付与日ではない
			) || (                                                           // または
				dayObj.rack.validApplys.kyushtu.length > 0                   //   休日出勤申請がある
				&&                                                           //   かつ
				(   !untilAp                                                 //   「承認されるまで時間入力を禁止」がオフ
					|| teasp.constant.STATUS_APPROVES.contains(dayObj.rack.validApplys.kyushtu[0].status) // または休日出勤申請が承認済み
				)
			)
		)
		&& (!dayObj.rack.holidayJoin || dayObj.rack.holidayJoin.flag != 3)   // かつ終日の休暇申請がない
		&& !dayObj.interim                                                   // かつ（「承認されるまで時間入力を禁止」の設定かつ振替申請の承認待ち）ではない
	);
};

teasp.view.Widget.prototype.setPushButtons = function(){
	var tinfo = this.getTimeInfo();

	if(tinfo.stFlag){ // 出社打刻可
		dojo.setAttr('btnStInput', 'disabled', false);
		if (!this.eventHandles['btnStInput']) {
			this.eventHandles['btnStInput'] = dojo.connect(dojo.byId('btnStInput'), 'onclick', this, function(){ this.pushTimeStep1({type:10,face:0,fix:false}); }); // 出社打刻
		}
	}else{
		dojo.setAttr('btnStInput', 'disabled', true);
		if(this.eventHandles['btnStInput']){
			dojo.disconnect(this.eventHandles['btnStInput']);
			delete this.eventHandles['btnStInput'];
		}
	}
	if(tinfo.etFlag || tinfo.petFlag){ // 退社打刻可
		dojo.setAttr('btnEtInput', 'disabled', false);
		if (!this.eventHandles['btnEtInput']) {
			this.eventHandles['btnEtInput'] = dojo.connect(dojo.byId('btnEtInput'), 'onclick', this, function(){
				this.pushTimeStep1({type:10,face:1,fix:false});
			}); // 退社打刻
		}
	}else{
		dojo.setAttr('btnEtInput', 'disabled', true);
		if(this.eventHandles['btnEtInput']){
			dojo.disconnect(this.eventHandles['btnEtInput']);
			delete this.eventHandles['btnEtInput'];
		}
	}
	if(this.pouch.isUseFixedButton()){ // 定時出退時刻あり
		dojo.style('btnTstInput', 'display', '');
		dojo.style('btnTetInput', 'display', '');
		dojo.style('btnBoard'   , 'display', 'none');
		if(tinfo.tstFlag){ // 定時出社打刻可
			dojo.setAttr('btnTstInput', 'disabled', false);
			if (!this.eventHandles['btnTstInput']) {
				this.eventHandles['btnTstInput'] = dojo.connect(dojo.byId('btnTstInput'), 'onclick', this, function(){
					this.pushTimeStep1({type:10,face:0,fix:true});
				}); // 定時出社打刻
			}
		}else{
			dojo.setAttr('btnTstInput', 'disabled', true);
			if(this.eventHandles['btnTstInput']){
				dojo.disconnect(this.eventHandles['btnTstInput']);
				delete this.eventHandles['btnTstInput'];
			}
		}
		if(tinfo.tetFlag || tinfo.ptetFlag){ // 定時退社打刻可
			dojo.setAttr('btnTetInput', 'disabled', false);
			if (!this.eventHandles['btnTetInput']) {
				this.eventHandles['btnTetInput'] = dojo.connect(dojo.byId('btnTetInput'), 'onclick', this, function(){
					this.pushTimeStep1({type:10,face:1,fix:true});
				}); // 定時退社打刻
			}
		}else{
			dojo.setAttr('btnTetInput', 'disabled', true);
			if(this.eventHandles['btnTetInput']){
				dojo.disconnect(this.eventHandles['btnTetInput']);
				delete this.eventHandles['btnTetInput'];
			}
		}
	}else{
		dojo.style('btnTstInput', 'display', 'none');
		dojo.style('btnTetInput', 'display', 'none');
		dojo.style('btnBoard'   , 'display', 'block');
	}
};

// お知らせ
teasp.view.Widget.prototype.openInfoView = function(){
	teasp.manager.dialogOpen(
		'Info',
		{ small: true },
		this.pouch,
		this,
		function(){
			this.showInfoRedIcon();
		}
	);
};

teasp.view.Widget.prototype.isLeaveMsg = function(){
	if((typeof(sforce) == 'object' && sforce.one) || dojo.isSafari){
		return false;
	}
	return true;
};

teasp.view.Widget.prototype.jumpToMonthly = function(){
	teasp.manager.dialogOpen(
		'BusyWait2',
		{message: teasp.message.getLabel('tm50001020')} // 勤務表を開いています...
	);
	if(!this.isLeaveMsg()){
		setTimeout(function(){
			teasp.manager.dialogClose('BusyWait2');
			teasp.locationHref(teasp.getPageUrl('workTimeView'), parent.location);
		}, 200);
	}else{
		teasp.locationHref(teasp.getPageUrl('workTimeView'), parent.location);
	}
};

teasp.view.Widget.prototype.jumpToDaily = function(){
	teasp.manager.dialogOpen(
		'BusyWait2',
		{message: teasp.message.getLabel('tm50001030')} // タイムレポートを開いています...
	);
	if(!this.isLeaveMsg()){
		setTimeout(function(){
			teasp.manager.dialogClose('BusyWait2');
			teasp.locationHref(teasp.getPageUrl('timeReportView'), parent.location);
		}, 200);
	}else{
		teasp.locationHref(teasp.getPageUrl('timeReportView'), parent.location);
	}
};

teasp.view.Widget.prototype.jumpToExp = function(){
	teasp.manager.dialogOpen(
		'BusyWait2',
		{message: teasp.message.getLabel('tf10000470')} // 経費精算を開いています...
	);
	if(!this.isLeaveMsg()){
		setTimeout(function(){
			teasp.manager.dialogClose('BusyWait2');
			teasp.locationHref(teasp.getPageUrl('empExpView'), parent.location);
		}, 200);
	}else{
		teasp.locationHref(teasp.getPageUrl('empExpView'), parent.location);
	}
};
// 「打刻しています」表示
teasp.view.Widget.prototype.showBusyWait = function(waitmsg){
	teasp.manager.dialogOpen(
		'BusyWait2',
		{message:waitmsg},
		this.pouch,
		null,
		function(){}
	);
};
//位置情報取得エラー表示
teasp.view.Widget.prototype.showMessage = function(err, callback){
	if(!err.msg){
		return;
	}
	teasp.manager.dialogOpen(
		'Message',
		err,
		this.pouch,
		null,
		callback
	);
};
// 位置情報取得エラーメッセージ
teasp.view.Widget.getGetLocationError = function(geoerr){
	var res = {msg:'',sub1:'',sub2:''};
	if(geoerr){
		res.msg = teasp.message.getLabel('tf10008620'); // 打刻しました
		res.sub1 = teasp.message.getLabel('tf10008630'); // 位置情報を取得できませんでした
		res.sub2 = geoerr.message;
	}
	return res;
};
/**
 * 位置情報エラーを表示
 */
teasp.view.Widget.prototype.showLocationError = function(geoerr, callback){
	var err = teasp.view.Widget.getGetLocationError(geoerr);
	this.showMessage(err, callback);
};
/**
 * 打刻step1
 * @param {{
 *   type  : number, 0:投稿のみ, 10:打刻
 *   face  : number, 0:出社、1:退社
 *   fix   : boolean, false:通常打刻、true:定時打刻
 *   prefix: string|null (未使用)
 * }} para
 */
teasp.view.Widget.prototype.pushTimeStep1 = function(para){
	para.comment = dojo.byId('comment').value.trim();
	if(!para.type && !para.comment){
		return;
	}
	if(para.comment.length > 990){
		teasp.tsAlert(teasp.message.getLabel('tm50001120', 990)); // 投稿は {0} 文字以内で入力してください。
		return;
	}
	var tinfo = this.getTimeInfo();
	var dayWrap = this.pouch.getEmpDay(para.face && tinfo.pTime > 0 ? tinfo.pkey : tinfo.tkey);
	var dayObj  = dayWrap.getObj();
	var restartable = this.pouch.isUseRestartable();

	var mm = (para.face && tinfo.pTime > 0 ? tinfo.pTime : tinfo.tTime);
	var st = (dayObj && typeof(dayObj.startTime) == 'number' ? dayObj.startTime : -1);
	var et = (dayObj && typeof(dayObj.endTime)   == 'number' ? dayObj.endTime   : -1);
	if(para.fix){ // 定時の出退打刻
		mm = (para.face == 0 ? tinfo.stdStartTime : (tinfo.pTime > 0 ? tinfo.pstdEndTime : tinfo.stdEndTime));
	}
	var s = '';
	para.waitmsg = teasp.message.getLabel('tm50001040'); // chatterへ投稿しています...
	if(para.type == 10){
		if(restartable && (para.face === 0 && et >= 0 && !para.fix)){
			// 再出社打刻
		}else if((para.face === 0 && et >= 0 && mm >= et) || (para.face !== 0 && st >= 0 && mm <= st)){
			teasp.tsAlert(teasp.message.getLabel('tm50001130')); // エラー！\n出社時刻と退社時刻が同じか逆転するため、打刻できません。\n勤務表を確認してください。
			return;
		}
		if(para.face !== 0 && mm > 1440){ // 24時を超える退社打刻
//			if(this.pouch.isProhibitAcrossNextDayOfHolidayWork() // 休日出勤時には24:00を超えた勤務を許さない
//			&& dayWrap.isHoliday()
//			&& dayWrap.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)
//			){
//				alert(teasp.message.getLabel('tf10008430')); // 休日出勤時には24:00以降の退社時刻を入力できません。
//				return;
//			}
			var nd = this.pouch.getEmpDay(teasp.util.date.addDays(dayWrap.getKey(), 1));
			var h = nd.getProhibitOverNightWorkHoliday(); // 翌日に延長勤務禁止の休暇申請があるか
			if(h){
				teasp.tsAlert(teasp.message.getLabel('tf10008360', h.name)); // {0}の前日は24:00を超える勤務はできません。
				return;
			}
		}
		para.waitmsg = teasp.message.getLabel('tm50001050'); // 打刻しています...
		if(para.fix){
			s = teasp.message.getLabel(para.face === 0 ? 'tm50001060' : 'tm50001070');
		}else{
			s = teasp.message.getLabel(para.face === 0 ? 'tm50001080' : 'tm50001090');
		}
	}else if(para.prefix){
		s = '(' + para.prefix + ') ';
	}
	var innerNextStep = dojo.hitch(this, function(){
		para.comment = s + para.comment;
		this.showBusyWait(para.waitmsg);
		this.pushTimeStep2(para, tinfo);
	});
	if(para.type == 10 && para.face === 0){
		var cet = dayObj.endTime;
		if(typeof(cet) == 'number' && cet <= mm){
			teasp.tsConfirm(teasp.message.getLabel('tm50001200'), this, function(result){ // 本日すでに退社打刻されていますが、再出社ということでよろしいですか？
				if(result){
					innerNextStep();
				}
			});
		}else{
			innerNextStep();
		}
	}else{
		innerNextStep();
	}
};
/**
 * 打刻step2
 * @param {{
 *   type   : number, 0:投稿のみ, 10:打刻
 *   face   : number, 0:出社、1:退社
 *   fix    : boolean, false:通常打刻、true:定時打刻
 *   comment: string  コメント
 * }} para
 * @param {Object} tinfo @see teasp.view.Widget.judgePushTime
 * ※ firefox で何故か getCurrentPosition から正常系と異常系両方のcallbackが呼ばれたことがあったため、
 * 防御措置を取っています。
 */
teasp.view.Widget.prototype.pushTimeStep2 = function(para, tinfo){
	var currentToken = this.token;
	if(para.type != 0 && this.pushTimeWithLocationWeb && navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			dojo.hitch(this, function(position){
				if(currentToken == this.token){
					this.token++;
					this.pushTimeStep3(para, tinfo, position.coords);
				}
			}),
			dojo.hitch(this, function(err){
				if(currentToken == this.token){
					this.token++;
					this.pushTimeStep3(para, tinfo, null, err);
				}
			}),
			{
				enableHighAccuracy: true,
				timeout: 30000,
				maximumAge: 0
			}
		);
	}else{
		this.pushTimeStep3(para, tinfo);
	}
};
/**
 * 打刻step3
 * @param {{
 *   type   : number, 0:投稿のみ, 10:打刻
 *   face   : number, 0:出社、1:退社
 *   fix    : boolean, false:通常打刻、true:定時打刻
 *   comment: string  コメント
 * }} para
 * @param {Object=} tinfo @see teasp.view.Widget.judgePushTime
 * @param {Object=} coords 位置情報
 * @param {Object=} geoerr 位置情報取得エラー
 */
teasp.view.Widget.prototype.pushTimeStep3 = function(para, tinfo, coords, geoerr){
	var d   = tinfo.tkey;
	var ym  = this.pouch.getYearMonth();
	var sd  = this.pouch.getStartDate();
	var lmd = this.pouch.getLastModifiedDate();
	var lasd = false;
	if(para.face && tinfo.pTime > 0){ // 前日の退社打刻
		d = tinfo.pkey;
		lasd = true;
		var o = this.pouch.getEmpMonth(null, d);
		if(sd != o.startDate){
			ym  = o.yearMonth;
			lmd = this.pouch.getPrevMonthLastModifiedDate();
		}
	}
	var req = {
		empId            : this.pouch.getEmpId(),
		month            : ym,
		startDate        : sd,
		lastModifiedDate : lmd,
		date             : d,
		prevFlag         : lasd,                                                // {boolean} 前日退社打刻モードか
		stdStartTime     : (lasd ? tinfo.stdStartTime : tinfo.pstdStartTime),   // {number}  始業時刻
		stdEndTime       : (lasd ? tinfo.stdEndTime   : tinfo.pstdEndTime  ),   // {number}  終業時刻
		input : {
			comment : para.comment
		},
		device           : 'TSW',
        latitude         : (coords ? coords.latitude  : null),
        longitude        : (coords ? coords.longitude : null)
	};
	if(para.type){
		req.input.time = (para.face && tinfo.pTime >= 0 ? tinfo.pTime : tinfo.tTime);  // {number}  打刻時刻参考値（サーバ側で改めて採取される）
		req.input.face = para.face;                                                    // {number}  0:出社 1:退社
		req.input.fix  = para.fix;                                                     // {boolean} trueなら定時出社or退社打刻
		req.input.type = para.type;                                                    // {number}  10:打刻、0:chatter投稿
	}
	if(this.pouch.isUseWorkLocation()){ // 勤務場所
		const selected = this.getCheckedWorkLocation();
		req.input.workLocationId = (selected && selected.workLocation.getId()) || null;
	}
	teasp.manager.request(
		'inputTime',
		req,
		this.pouch,
		{ hideBusy : true },
		this,
		function(){
			this.pushTimeStep4(geoerr, function(){
				if(lasd){
					location.reload();
				}
			});
		},
		function(event){
			teasp.manager.dialogClose('BusyWait2');
			teasp.message.alertError(event);
		}
	);
	return false;
};
/**
 * 打刻step4（打刻後の処理）
 * @param {boolean} lasd true:リフレッシュする
 * @param {Object=} geoerr 位置情報エラー
 */
teasp.view.Widget.prototype.pushTimeStep4 = function(geoerr, callback){
	// 情報を再取得する
	teasp.manager.request(
		'loadWidget',
		{},
		this.pouch,
		{ hideBusy : true },
		this,
		function(){
			teasp.manager.dialogClose('BusyWait2');
			dojo.byId('comment').value = '';
			this.setPushButtons();
			if(geoerr){
				this.showLocationError(geoerr, callback);
			}else{
				callback();
			}
		},
		function(event){
			dojo.style('infoError', 'display', 'block');
			if(!/Unable to connect to the server/.test(event.message)){
				dojo.byId('errorMessage').innerHTML = teasp.message.getErrorMessage(event);
			}
		}
	);
};
