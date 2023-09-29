teasp.provide('teasp.helper.Schedule');

/**
 * スケジュール描画
 *
 * @constructor
 */
teasp.helper.Schedule = function(){
	this.pouch = null;
	this.markerZindex = 100;
	this.eventHandles = [];
	this.evs = [];
	this.grps = [];
	this.importLogic = new teasp.helper.ScheduleImport();
};

teasp.helper.Schedule.MARKER_X = 43; // X座標起点
teasp.helper.Schedule.RIGHT_MARGIN = 12; // 右マージン
teasp.helper.Schedule.HEIGHT_PER_HOUR = 35; // ピクセル数/時
teasp.helper.Schedule.MARKER_MIN_HEIGHT = 17; // 最小縦サイズ
teasp.helper.Schedule.MARKER_MIN_WIDTH = 120; // 最小幅

teasp.helper.Schedule.prototype.createMarkerId = function(){
	return 'evmarker' + (++teasp.sequence.marker);
};

/**
 * スケジュール描画開始
 * @param {Object} pouch
 * @param {string} divId ノードID
 */
teasp.helper.Schedule.prototype.draw = function(pouch, divId){
	this.pouch = pouch;
	this.baseDivId = divId;
	this.cdt = moment(this.pouch.getParamDate(), teasp.constant.DATE_F); // 対象日付
	for(var i = 0 ; i < this.eventHandles.length ; i++){
		dojo.disconnect(this.eventHandles[i]);
		delete this.eventHandles[i];
	}
	this.eventHandles = [];

	// スクロール時イベントハンドラをセット
	this.eventHandles.push(dojo.connect(dojo.byId(this.baseDivId), 'onscroll', this, this.scrollArea));

	this.evs = []; // 終日以外の行動
	this.allDayEvs = []; // 終日の行動
	this.grps = []; // 行動グループの配列
	this.loadEvents(); // 表示対象の行動を取得
	this.showAllDayEvent(); // 終日の行動を描画
	this.createDivs(); // 終日以外の行動を描画
};

teasp.helper.Schedule.prototype.getEvs = function(){ return this.evs; };
teasp.helper.Schedule.prototype.getAllEvs = function(){ return this.evs.concat(this.allDayEvs); };

/**
 * 表示対象の行動をロード
 *
 */
teasp.helper.Schedule.prototype.loadEvents = function(){
	var allEvents = this.pouch.getEvents(); // 全行動
	var ndt = this.cdt.clone().add(1, 'd'); // 対象日の翌日
	var ddt = this.cdt.clone().add(2, 'd'); // 対象日の翌々日
	// 対象日とその翌日のスケジュールに絞る
	for(var i = 0 ; i < allEvents.length ; i++){
		var event = allEvents[i];
		var sdt = moment(event.startDateTime, teasp.constant.DATETIME_F); // 開始日時
		var edt = moment(event.endDateTime	, teasp.constant.DATETIME_F); // 終了日時
		if(edt.isBefore(this.cdt)
		|| sdt.isSameOrAfter(ddt)
		|| (event.isAllDayEvent && sdt.isSameOrAfter(ndt))){
			continue;
		}
		if(event.isAllDayEvent){
			this.allDayEvs.push(new teasp.helper.ScheduleEvent(event, this.cdt));
			continue;
		}
		this.evs.push(new teasp.helper.ScheduleEvent(event, this.cdt, this.createMarkerId(), this.markerZindex));
	}
	if(this.evs.length){
		// 開始日時＞終了日時＞件名でソート
		this.evs = this.evs.sort(function(a, b){
			if(a.getStartLongTime() == b.getStartLongTime()){
				if(a.getEndLongTime() == b.getEndLongTime()){
					return (a.getSubject() < b.getSubject() ? -1 : 1);
				}else{
					return a.getEndLongTime() - b.getEndLongTime();
				}
			}
			return a.getStartLongTime() - b.getStartLongTime();
		});
		// 重複する行動どうしを1グループとしたグループ分け
		this.grps.push(new teasp.helper.ScheduleGroup(this.evs[0]));
		for(var i = 1 ; i < this.evs.length ; i++){
			var ev = this.evs[i];
			var x = 0;
			while(x < this.grps.length){
				var grp = this.grps[x];
				if(grp.isOverlap(ev)){
					grp.addEv(ev);
					break;
				}
				x++;
			}
			if(x >= this.grps.length){
				this.grps.push(new teasp.helper.ScheduleGroup(ev));
			}
		}
		teasp.helper.ScheduleGroup.buildEndPosAll(this.grps);
	}
};

/**
 * 矩形配置エリア幅を返す
 * @returns {number}
 */
teasp.helper.Schedule.prototype.getAreaWidth = function(){
	var baseDiv = dojo.byId(this.baseDivId);
	return baseDiv.clientWidth - teasp.helper.Schedule.MARKER_X - teasp.helper.Schedule.RIGHT_MARGIN;
};

/**
 * 矩形描画
 *
 */
teasp.helper.Schedule.prototype.createDivs = function(){
	var baseDiv = dojo.byId(this.baseDivId);
	dojo.query('.event_marker', baseDiv).forEach(function(elem){
		dojo.destroy(elem);
	});
	var x = teasp.helper.Schedule.MARKER_X;
	var areaw = this.getAreaWidth();
	for(var i = 0 ; i < this.evs.length ; i++){
		this.evs[i].createDom(baseDiv, x, areaw, this.pouch.isOwner());
	}
	this.arrangePosition();
	this.adjustSubject();
};

/**
 * 矩形の位置と幅を調整
 * 初期表示時とウィンドウリサイズ時に呼ばれる
 */
teasp.helper.Schedule.prototype.arrangePosition = function(){
	var areaw = this.getAreaWidth(); // 矩形配置エリア幅
	for(var i = 0 ; i < this.grps.length ; i++){
		var grp = this.grps[i];
		var bw = areaw / grp.getLaneSize(); // 1レーンの幅
		var mx = bw;
		if(bw < teasp.helper.Schedule.MARKER_MIN_WIDTH){
			mx = (areaw - teasp.helper.Schedule.MARKER_MIN_WIDTH) / (grp.getLaneSize() - 1); // X座標の刻み幅
		}
		grp.getEvs().forEach(function(ev){
			var w = areaw;
			var x = teasp.helper.Schedule.MARKER_X;
			if(grp.getLaneSize() > 1){ // 複数レーンの場合、幅とX座標の調整を行う
				w = Math.max(mx * (ev.getEndPos() - ev.getPos() + 1), teasp.helper.Schedule.MARKER_MIN_WIDTH); // 領域幅を重なり数で割る(1件の幅)
				x += (areaw - (mx * (grp.getLaneSize() - ev.getEndPos() - 1)) - w);
				if(ev.getPos()){
					x -= 1;
					w += 1;
				}
			}
			dojo.style(ev.getMarkerId(), 'left' , x + 'px');
			dojo.style(ev.getMarkerId(), 'width', w + 'px');
		});
	}
};

/**
 * スケジュールエリアがスクロールした時、
 * 矩形内の件名要素のY座標を見える位置に移動する
 */
teasp.helper.Schedule.prototype.adjustSubject = function(){
	var area = dojo.byId(this.baseDivId);
	var top = area.scrollTop;
	for(var i = 0 ; i < this.evs.length ; i++){
		var ev = this.evs[i];
		var div = dojo.byId(ev.getMarkerId());
		var subs = dojo.query('div', div);
		if(subs.length){
			var sub = subs[0];
			var y1 = div.offsetTop;
			var y2 = y1 + div.offsetHeight - 1;
			var y  = (y1 < top && top < y2 ? (top - y1) : 0);
			dojo.style(sub, 'top', y + 'px');
		}
	}
};

/**
 * ウィンドウ リサイズ時処理
 *
 */
teasp.helper.Schedule.prototype.onresize = function(){
	this.arrangePosition();
};

/**
 * スケジュールエリア スクロール時処理
 */
teasp.helper.Schedule.prototype.scrollArea = function(){
	this.adjustSubject();
};

/**
 * 終日のスケジュールを表示
 *
 */
teasp.helper.Schedule.prototype.showAllDayEvent = function(){
	if(this.allDayEvs.length > 0){ // 終日の行動がある
		var subjects = [];
		for(var i = 0 ; i < this.allDayEvs.length ; i++){
			subjects.push(this.allDayEvs[i].getSubject());
		}
		var atmpl;
		if(this.pouch.isOwner() && this.allDayEvs[0].getId() && !teasp.isSforce()){
			atmpl = '<a href="' + this.allDayEvs[0].getLink() + '" style="text-decoration:none;" target="_blank">{0}</a>';
		}else{
			atmpl = '{0}';
		}
		var s = teasp.message.getLabel('tm20001090') + teasp.util.entitize(subjects[0]); // 終日：XX
		dojo.style('ruler2', 'font-size', '12px');
		s = s.truncateTailInWidth((this.allDayEvs.length > 1 ? (320-50) : 320), dojo.byId('ruler2')); // 文字列が領域サイズをはみ出る場合カット
		var e = (this.allDayEvs.length > 1 ? teasp.message.getLabel('tm20001100',(this.allDayEvs.length - 1)) : ''); // (他{0}件)
		dojo.style('timeGridTopRow', 'display', '');
		dojo.byId('timeGridTop').style.height = '30px';
		dojo.byId('timeGridTop').innerHTML = '<div style="padding:0px;margin:8px 2px 8px 8px;white-space:nowrap;overflow-x:hidden;" id="allDayEvent">'
											+ dojo.replace(atmpl, [s + e])
											+ '</div>';
		dojo.byId('timeGridTop').title = [teasp.message.getLabel('tm20001110')].concat(subjects).join('\n'); // 【終日】xxxx...
		dojo.byId('timeGridView').style.height = (436 - 35) + 'px';
	}else{ // 終日の行動がない
		dojo.style('timeGridTopRow', 'display', 'none');
		dojo.byId('timeGridTop').innerHTML = '';
		dojo.byId('timeGridTop').title = '';
		dojo.byId('timeGridView').style.height = '436px';
	}

	dojo.byId('timeGridView').scrollTop = (35 * 8); // スケジュールのスクロール位置を8時にする
};

/**
 * スケジュール取込
 * @param {Function} callback
 * @param {teasp.helper.ScheduleTxsLog} helperTxsLog
 */
teasp.helper.Schedule.prototype.import = function(callback, helperTxsLog){
	this.importLogic.import(callback, this.pouch, this, helperTxsLog);
};
