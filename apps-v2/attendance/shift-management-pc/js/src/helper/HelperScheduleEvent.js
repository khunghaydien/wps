teasp.provide('teasp.helper.ScheduleEvent');

/**
 * 行動クラス
 *
 * @constructor
 * @param {Object} event Apexコントロールクラスから受け取ったeventほぼそのまま
 * @param {Object} cdt 本日日付の moment インスタンス
 * @param {string} markerId DOM のID
 * @param {number} zIndex DOM の z-index
 *
 */
teasp.helper.ScheduleEvent = function(event, cdt, markerId, zIndex){
	this.event = event;
	this.cdt = cdt;
	this.markerId = markerId;
	this.zIndex = zIndex;
	if(!this.event.isAllDayEvent){
		/*
		 * 終日以外の行動は、下記の値をセット
		 * sdt, edt  開始・終了日時 :momentインスタンス
		 * st, et    分単位の開始・終了日時, 0～ (48*60)
		 * subject   表記文字（時刻＋件名）
		 * title     ツールヒント
		 * markerId  マーカーDOMID
		 * y1        Y起点座標
		 * y2        Y終点座標
		 * h         高さ
		 * pos       表示開始レーン
		 * endPos    表示終了レーン
		*/
		this.sdt = moment(this.event.startDateTime, teasp.constant.DATETIME_F); // 開始日時
		this.edt = moment(this.event.endDateTime  , teasp.constant.DATETIME_F); // 終了日時

		this.st = this.sdt.hour() * 60 + this.sdt.minute();
		this.et = this.edt.hour() * 60 + this.edt.minute();

		if(this.sdt.isBefore(this.cdt, 'day')){
			this.st = 0; // 前日以前からなら0固定
		}else if(this.sdt.isAfter(this.cdt, 'day')){
			this.st += (24 * 60);
		}
		if(this.edt.isAfter(this.cdt, 'day')){ // 終了時刻が翌日以降
			var ddt = this.cdt.clone().add(2, 'd'); // 対象日の翌々日
			if(this.edt.isSameOrAfter(ddt)){
				this.et = (48 * 60); // 翌々日以降なら48h固定
			}else{
				this.et += (24 * 60);
			}
		}

		// 時刻＋件名のHTMLを生成
		this.subject = '<span>' + teasp.message.getLabel('tm10010460'
			, (!this.sdt.isSame(this.cdt, 'day')                                      ? '(' + this.sdt.format('M/D') + ')' : '') + this.sdt.format('H:mm')
			, (!this.edt.isSame(this.cdt, 'day') && !this.edt.isSame(this.sdt, 'day') ? '(' + this.edt.format('M/D') + ')' : '') + this.edt.format('H:mm')
			) + '</span>' + (this.et - this.st <= 45 ? ' ' : '<br/>') + teasp.util.entitizf(this.event.subject);
		var title = [];
		if(this.event.subject){
			title.push(this.event.subject);
		}
		if(this.event.what && this.event.what.type == 'AtkJob__c'){
			title.push(teasp.message.getLabel('tm20001380', (this.event.what.name || '???'))); // 関連ジョブ：{0}
		}
		this.title = title.join('\n');

		this.y1 = teasp.helper.Schedule.HEIGHT_PER_HOUR * (this.st / 60);
		var y2  = teasp.helper.Schedule.HEIGHT_PER_HOUR * (this.et / 60);
		this.h  = Math.max(y2 - this.y1, teasp.helper.Schedule.MARKER_MIN_HEIGHT);
		this.y2 = this.y1 + this.h;

		// pos と endPos の初期値
		this.pos = 0;
		this.endPos = -1;
	}
};

teasp.helper.ScheduleEvent.prototype.getStartLongTime = function(){ return this.sdt.toDate().getTime(); };
teasp.helper.ScheduleEvent.prototype.getEndLongTime   = function(){ return this.edt.toDate().getTime(); };
teasp.helper.ScheduleEvent.prototype.getY1         = function(){ return this.y1; };
teasp.helper.ScheduleEvent.prototype.getY2         = function(){ return this.y2; };
teasp.helper.ScheduleEvent.prototype.getSubject    = function(){ return (this.event.subject || ''); };
teasp.helper.ScheduleEvent.prototype.getSubjectDom = function(){ return this.subject; };
teasp.helper.ScheduleEvent.prototype.getTitle      = function(){ return this.title; };
teasp.helper.ScheduleEvent.prototype.getMarkerId   = function(){ return this.markerId; };
teasp.helper.ScheduleEvent.prototype.getPos        = function(){ return this.pos; };
teasp.helper.ScheduleEvent.prototype.setPos        = function(pos){ this.pos = pos; };
teasp.helper.ScheduleEvent.prototype.getEndPos     = function(){ return this.endPos; };
teasp.helper.ScheduleEvent.prototype.setEndPos     = function(endPos){ this.endPos = endPos; };

teasp.helper.ScheduleEvent.prototype.isAllDayEvent = function(){ return this.event.isAllDayEvent; }; // 終日の行動
teasp.helper.ScheduleEvent.prototype.getId         = function(){ return this.event.id; };


/**
 * 引数の行動との重なりをチェックする
 *
 * @param {Object} ev
 * @returns {boolean}
 */
teasp.helper.ScheduleEvent.prototype.isOverlap = function(ev){
	if((ev.getY1() <= this.getY1() && this.getY1() <  ev.getY2())
	|| (ev.getY1() <  this.getY2() && this.getY2() <= ev.getY2())
	|| (this.getY1() <= ev.getY1() && ev.getY2() <= this.getY2())){
		return true;
	}
	return false;
};

/**
 * マーカーDOMを生成
 * ここでセットされる X座標と幅は暫定。
 * teasp.helper.Schedule.prototype.arrangePosition() で、重なり状況に応じたX座標と幅がセットされる
 *
 * @param {Object} parentDom 親DOM
 * @param {number} x X座標
 * @param {number} w 幅
 * @param {boolean} isOwner ログインユーザがデータの所有者か
 * @returns {Object} DOM要素
 */
teasp.helper.ScheduleEvent.prototype.createDom = function(parentDom, x, w, isOwner){
	var dom = dojo.create('div', {
		className: 'event_marker',
		style	 : dojo.string.substitute('width:${0}px;left:${1}px;top:${2}px;height:${3}px;z-index:${4};'
				 , [w, x, this.y1, this.h + 1, this.zIndex]),
		id		 : this.getMarkerId(),
		title	 : this.getTitle()
	}, parentDom);
	var sub = dojo.create('div', null, dom);
	if(isOwner && this.getId() && !teasp.isSforce()){
		// 自身が所有者であり、IDがあり、LEX環境でない場合、リンクを表示する
		var dt = this.cdt;
		if(dt.isBefore(this.sdt, 'day')){
			dt = this.sdt;
		}
		dojo.create('a', {
			href     : this.getLink(dt),
			innerHTML: this.getSubjectDom(),
			target   : '_blank'
		}, sub);
	}else{
		sub.innerHTML = this.getSubjectDom();
	}
	return dom;
};

/**
 * リンクURLを返す
 * @param {moment=} dt (momentインスタンス)省略時はthis.cdtを参照する
 * @returns {string}
 */
teasp.helper.ScheduleEvent.prototype.getLink = function(dt){
	var d = (dt || this.cdt);
	return dojo.string.substitute('/00U/c?md0=${0}&md3=${1}', [d.format('YYYY'), d.dayOfYear()]);
};

/**
 * 指定範囲に行動が入るか
 *
 * @param {Object} range
 * @returns {boolean}
 */
teasp.helper.ScheduleEvent.prototype.isRange = function(range){
	if(this.isAllDayEvent()){
		return true;
	}
	if((range.st <= this.st && this.st <  range.et)
	|| (range.st <  this.et && this.et <= range.et)
	|| (this.st < range.st && range.et < this.et)){
		return true;
	}
	return false;
};

/**
 * 指定範囲の行動の時間（休憩除く）
 *
 * @param {Object} range
 * @returns {{
 *   st:{number},
 *   et:{number},
 *   minutes:{number},
 *   sdt:{moment},
 *   edt:{moment}
 * }}
 */
teasp.helper.ScheduleEvent.prototype.getRangeInfo = function(range){
	var o = {
		st: Math.max(this.st, range.st),
		et: Math.min(this.et, range.et),
		orgSdt: this.sdt || this.cdt,
		minutes: 0
	};
	if(this.isRange(range)){
		o.inner = true;
		if(o.st < o.et){
			var rt = teasp.util.time.rangeTime({from:o.st, to:o.et}, range.rests);
			o.minutes = Math.max(o.et - o.st - rt, 0);
		}
	}
	o.sdt = this.cdt.clone().add(o.st, 'm');
	o.edt = this.cdt.clone().add(o.et, 'm');
	return o;
};

/**
 * 関連ジョブがあるか
 * @returns {boolean}
 */
teasp.helper.ScheduleEvent.prototype.isRelayJob = function(){
	if(/\[.+?\]/.test(this.event.subject || '')
	|| (this.event.what && this.event.what.type == 'AtkJob__c')){
		return true;
	}
	return false;
};

/**
 * 関連ジョブの情報を返す
 * @param {Object} range
 * @param {teasp.helper.ScheduleJobs} helperJobs
 */
teasp.helper.ScheduleEvent.prototype.collectJobs = function(range, helperJobs){
	var timeInfo = this.getRangeInfo(range);
	var span = {
		sdt: timeInfo.sdt,
		edt: timeInfo.edt
	};
	if(this.event.what && this.event.what.type == 'AtkJob__c'){
		helperJobs.add(this.event.what.id, null, [span], timeInfo, this.isAllDayEvent(), false);
	}else if(/\[.+?\]/.test(this.event.subject || '')){
		var codes = [];
		var temp = this.event.subject;
		var match;
		while((match = /\[(.+?)\](.*)$/.exec(temp))){
			codes.push(match[1]);
			temp = match[2];
		}
		if(codes.length){
			var mm = (timeInfo.minutes ? Math.round(timeInfo.minutes / codes.length) : 0);
			var ti = {
				minutes: mm,
				inner: timeInfo.inner,
				orgSdt: timeInfo.orgSdt
			};
			for(var c = 0 ; c < codes.length ; c++){
				helperJobs.add(null, codes[c], [span], ti, this.isAllDayEvent(), false);
			}
		}
	}
};
