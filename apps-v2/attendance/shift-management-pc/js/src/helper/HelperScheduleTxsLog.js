teasp.provide('teasp.helper.ScheduleTxsLog');
/**
 * 行動ログ描画
 *
 * @param {Object=} param パラメータ
 * @constructor
 */
teasp.helper.ScheduleTxsLog = function(param){
    /** @private */
    this.pouch = null;

    this.MARKER_ID_PREFIX  = 'logmarker';

    this.leftX        = ((param && param.leftX       ) || 182); // Y方向起点
    this.marginTop    = ((param && param.marginLeft  ) || 0  ); // Y方向マージン
    this.heightPerH   = ((param && param.heightPerH  ) || teasp.helper.Schedule.HEIGHT_PER_HOUR); // ピクセル数/時

    this.dragObj      = null;  // ドラッグ中保持するオブジェクト
    this.markerZindex = 150;

    this.txsLogs = [];
    this.markMap = {};
    this.eventHandles = [];

    this.colorMap = {
        'AtkJob__c'     : [
              '#98fb98'
            , '#90ee90'
            , '#00ff7f'
            , '#7cfc00'
            , '#adff2f'
            , '#00ff00'
            , '#32cd32'
            , '#9acd32'
        ],
        'Task'          : [
              '#87ceeb'
            , '#add8e6'
            , '#b0e0e6'
            , '#afeeee'
            , '#48d1cc'
            , '#00ffff'
            , '#40e0d0'
            , '#00ced1'
        ],
        'Event'         : [
              '#c0a2c7'
            , '#dbd0e6'
            , '#867ba9'
            , '#a59aca'
            , '#68699b'
            , '#9079ad'
            , '#706caa'
            , '#cca6bf'
        ],
        'Opportunity'   : [
              '#f6b894'
            , '#f4b3c2'
            , '#f7b977'
            , '#f19072'
            , '#eebbcb'
            , '#eb9b6f'
            , '#f9c89b'
            , '#e4ab9b'
        ],
        'Account'       : [
              '#ffd900'
            , '#ffec47'
            , '#fcd575'
            , '#fbd26b'
            , '#f5e56b'
            , '#eec362'
            , '#ebd842'
            , '#ffdb4f'
        ],
        'other' : [
              '#d3d3d3'
        ]
    };
};

/**
 * 行動ログマーカー描画開始
 *
 * @param {string} divId ノードID
 */
teasp.helper.ScheduleTxsLog.prototype.draw = function(pouch, divId){
    this.pouch = pouch;
    this.baseDivId = divId;
    this.minH = 3;

    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    var dkey = this.pouch.getParamDate();
    this.txsLogs = this.getTxsLogs(this.pouch.getEmpDay(dkey).getEndTime(true));

    var table = dojo.byId('editTable');
    if(table){
        this.eventHandles.push(dojo.connect(table, 'onmousedown', this, function(_e){ this.extraMouseDown(table, (_e ? _e : window.event)); return false; }));
        this.eventHandles.push(dojo.connect(table, 'onmouseup'  , this, function(_e){ this.extraMouseUp  (table, (_e ? _e : window.event)); }));
        this.eventHandles.push(dojo.connect(table, 'onmousemove', this, function(_e){ this.extraMouseMove(table, (_e ? _e : window.event)); return false; }));
    }

    this.createDivs();
};

teasp.helper.ScheduleTxsLog.prototype.createMarkerId = function(){
    return this.MARKER_ID_PREFIX + (++teasp.sequence.marker);
};

/**
 * 行動ログマーカー描画
 *
 */
teasp.helper.ScheduleTxsLog.prototype.createDivs = function(){
    var baseDiv = dojo.byId(this.baseDivId);
    dojo.query('.txslog_marker').forEach(function(elem){
        dojo.destroy(elem);
    });

    var colorPos = {};
    for( var i = 0 ; i < this.txsLogs.length ; i++){
        var log = this.txsLogs[i];
        // 分に換算した時刻を取得
        var st = log.st;
        var et = log.et;
        var tz = teasp.util.time.timeValue(st) + '-' + teasp.util.time.timeValue(et);
        var markerId = this.createMarkerId();
        var mp = this.calcMakerPos(this.calcPosWidth(st, et), this.marginTop, this.leftX);
        var title = (log.target.name || '???');
        var other = null;
        if(log.target.type == 'Task'){
            title += '\n ' + teasp.message.getLabel('tm20001330'); // (TODO)
        }else if(log.target.type == 'Event'){
            title += '\n ' + teasp.message.getLabel('tm20001340'); // (行動)
        }else if(log.target.type == 'Account'){
            title += '\n ' + teasp.message.getLabel('tm20001350'); // (取引先)
        }else if(log.target.type == 'Opportunity'){
            title += '\n ' + teasp.message.getLabel('tm20001360'); // (商談)
        }else if(log.target.type == 'AtkJob__c'){
            title += '\n ' + teasp.message.getLabel('tm20001370'); // (ジョブ)
        }else{
            other = 'other';
        }

        var ckey = (other || log.target.type);
        var colors = this.colorMap[ckey];
        var colorX = colorPos[ckey];
        if(colorX === undefined){
            colorX = colorPos[ckey] = 0;
        }
        colorPos[ckey]++;

        if(log.target.what && log.target.what.type == 'AtkJob__c'){
            title += '\n ' + teasp.message.getLabel('tm20001380', (log.target.what.name || '???')); // 関連ジョブ：{0}
        }

        mp.y = Math.round(mp.y);
        mp.h = Math.round(mp.h);
        // マーカー（本体）
        var div = dojo.create('div', {
            className   : 'txslog_marker',
            style       : { width:"136px", left:(mp.x + "px"), top:(mp.y + "px"), height:(mp.h + "px"), backgroundColor: colors[colorX], zIndex: this.markerZindex },
            id          : markerId,
            title       : title
        }, baseDiv);
        if (log.target.type == 'AtkJob__c' || (log.target.what && log.target.what.type == 'AtkJob__c')) {
            dojo.create('div', {
                className : 'pp_base pp_txlog_job2',
                style     : { position:"absolute", left:"116px", top:"2px" }
            }, div);
        }
        dojo.create('div', {
            id        : markerId + '-T',
            style     : { margin:"1px 2px 0px 2px", padding:"0px", color:"black" },
            innerHTML : tz
        }, div);
        dojo.create('div', {
            style     : { margin:"0px 2px 1px 2px", padding:"0px", color:"black" },
            innerHTML : (log.target.name || '???')
        }, div);

        this.markMap[markerId] = {
            log       : log,
            moved     : false,
            orgTop    : mp.y,
            orgHeight : mp.h
        };

        this.eventHandles.push(dojo.connect(div, 'onmousedown', this, this.onMouseDown(div)));
        this.eventHandles.push(dojo.connect(div, 'onmouseup'  , this, function(_e){ this.mouseUp(div, (_e ? _e : window.event)); }));
        this.eventHandles.push(dojo.connect(div, 'onmousemove', this, function(_e){ this.mouseMove(div, (_e ? _e : window.event)); return false; }));
        this.eventHandles.push(dojo.connect(div, 'ondblclick' , this, this.clickDblMarker(log)));

        var h = (mp.h >= 5 ? Math.round(mp.h / 3) : 1);
        // マーカーリサイズ用つかみ領域（上側）
        var style = this.getStyleSize(0, 0, h, {
            w : 136,
            zIndex : 100
        });
        style.cursor = 'n-resize';
        style.position = 'absolute';
        style.backgroundColor = 'transparent';
        var uDiv = dojo.create('div', {
            style   : style,
            id      : markerId + '-U',
            title   : title
        }, div);
        this.eventHandles.push(dojo.connect(uDiv, 'onmousedown', this, this.onMouseDown(uDiv)));

        // マーカーリサイズ用つかみ領域（下側）
        style = this.getStyleSize(0, (mp.h - h), h, {
            w : 136,
            zIndex : 100
        });
        style.cursor = 's-resize';
        style.position = 'absolute';
        style.backgroundColor = 'transparent';
        var dDiv = dojo.create('div', {
            style   : style,
            id      : markerId + '-D',
            title   : title
        }, div);
        this.eventHandles.push(dojo.connect(dDiv, 'onmousedown', this, this.onMouseDown(dDiv)));

        this.markerZindex++;
    }

};

teasp.helper.ScheduleTxsLog.prototype.backPos = function(){
    dojo.query('.txslog_marker').forEach(function(elem){
        var log = this.markMap[elem.id];
        if(log && log.moved){
            var d = dojo.byId(elem.id + '-T');
            var s = (d.textContent || d.innerText);
            var match = /^(\d+):(\d+)\s*\-\s*(\d+):(\d+)$/.exec(s);
            if(match && match.length > 0){
                log.log.st = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
                log.log.et = parseInt(match[3], 10) * 60 + parseInt(match[4], 10);
                log.log.moved = true;
            }
        }
    }, this);
};

/**
 * 時間を座標に変換
 *
 * @param {number} st 開始時間
 * @param {number} et 終了時間
 * @param {number=} heightPerH １時間あたりの幅
 * @return {Object} 座標を持つオブジェクト
 */
teasp.helper.ScheduleTxsLog.prototype.calcPosWidth = function(st, et, heightPerH){
    var begY = st * (heightPerH || this.heightPerH) / 60;
    var endY = et * (heightPerH || this.heightPerH) / 60;
    var h = endY - begY;
    return { begY: begY, endY: endY, h: h };
};

/**
 * 座標を計算
 *
 * @param {Object} p 座標情報
 * @param {number} marginTop 上マージン
 * @param {number} x x座標
 * @return {Object} 座標情報
 */
teasp.helper.ScheduleTxsLog.prototype.calcMakerPos = function(p, marginTop, x){
    var y = p.begY + marginTop;
    var h = p.endY - p.begY;
    var style = { height:(h + "px"), top:(y + "px"), left:(x + "px") };
    return { x: x, y: y, h: h, style: style };
};

/**
 * スタイル設定の書式に整形して返す
 *
 * @param {number} x X座標
 * @param {number} y Y座標
 * @param {number} h 高さ
 * @param {Object} o 座標情報
 * @return {Object} スタイル設定の書式の座標情報
 */
teasp.helper.ScheduleTxsLog.prototype.getStyleSize = function(x, y, h, o){
    var res = {
        left   : (x + "px"),
        top    : (y + "px"),
        height : (h + "px")
    };
    if(o.w){
        res.width = (o.w + "px");
    }
    if(o.zIndex){
        res.zIndex = o.zIndex;
    }
    return res;
};

teasp.helper.ScheduleTxsLog.prototype.clickDblMarker = function(log){
    var txsLog = log;
    return function(){
        console.log(dojo.toJson(txsLog));
        window.open('/' + txsLog.target.id);
    };
};

/**
 * 【編集モード】マウスボタンを押下
 *
 * @param {Object} _div ＤＯＭ要素
 */
teasp.helper.ScheduleTxsLog.prototype.onMouseDown = function(_div){
    var divId = _div.id;
    return function(_e){
        var e = (_e ? _e : window.event);
        if(e.button == 2){
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        var face = 0;
        var id = divId;
        var match = /^(.+)-([UD])$/.exec(id);
        if(match){
            id = match[1];
            face = (match[2] == 'U' ? -1 : 1);
        }
        var div = dojo.byId(id);

        var y = div.offsetTop;
        var h = div.offsetHeight - (dojo.hasClass(div, 'txslog_focus') ? 2 : 0);
        this.dragObj = {
            id    : div.id,
            top   : div.offsetTop,
            y     : (e.pageY || e.y),
            h     : div.offsetHeight,
            face  : face,
            y1    : y,
            y2    : (y + h),
            from  : this.pixel2time(y - this.marginTop),
            to    : this.pixel2time((y + h) - this.marginTop),
            minH  : this.minH
        };
        this.focus(div.id);
        this.mouseMove(div, e);
    };
};

/**
 * 【編集モード】マウスカーソルを移動
 *
 * @param {Object} _div ＤＯＭ要素
 * @param {Object} e イベント
 */
teasp.helper.ScheduleTxsLog.prototype.mouseMove = function(_div, e){
    if(!this.dragObj){
        return;
    }
    var div = dojo.byId(this.dragObj.id);
    var y = (e.pageY || e.y);
    var t = div.offsetTop;
    var h = this.dragObj.h;
    var inf = dojo.clone(this.dragObj);
    var maxTime = (this.heightPerH * 48);
    if(y != this.dragObj.y){
        var old = {
            y1: inf.y1,
            y2: inf.y2
        };
        var tmpy1 = (this.dragObj.face <= 0 ? this.dragObj.top + (y - this.dragObj.y) : t);
        if(inf.y1 != tmpy1){
            inf.y1 = this.roundTime(tmpy1);
        }
        if(inf.y1 < this.marginTop){
            inf.y1 = this.marginTop;
        }
        if(this.dragObj.face !== 0){
            if(this.dragObj.face < 0){
                h = inf.y2 - inf.y1;
                if(h < inf.minH){
                    return;
                }
                div.style.top = inf.y1 + 'px';
            }else{
                h = this.roundTime(Number(this.dragObj.h) + (y - this.dragObj.y));
                h -= (inf.y1 - this.roundTime(tmpy1));
                if(h < inf.minH){
                    return;
                }
                inf.y2 = inf.y1 + h;
            }
            if(inf.y2 > (maxTime + this.marginTop)){
                inf.y2 = maxTime + this.marginTop;
                h = inf.y2 - inf.y1;
            }
            div.style.height = h + 'px';
            var eh = (h >= 9 ? Math.round(h / 3) : 2);

            dojo.byId(div.id + '-U').style.height = eh + 'px';
            dojo.byId(div.id + '-D').style.height = eh + 'px';
            dojo.byId(div.id + '-D').style.top = (h - eh) + 'px';

            if(inf.y1 != old.y1){
                inf.from = this.pixel2time(inf.y1 - this.marginTop);
            }
            if(inf.y2 != old.y2){
                inf.to   = this.pixel2time(inf.y2 - this.marginTop);
            }
        }else{
            inf.y2 = inf.y1 + h;
            if(inf.y2 > (maxTime + this.marginTop)){
                inf.y1 = (maxTime + this.marginTop) - h;
            }
            div.style.top = inf.y1 + 'px';
            var span = inf.to - inf.from;
            inf.from = this.pixel2time(inf.y1 - this.marginTop);
            inf.to   = inf.from + span;
        }
        dojo.byId(div.id + '-T').innerHTML = teasp.util.time.timeValue(inf.from) + '-' + teasp.util.time.timeValue(inf.to);
        var log = this.markMap[div.id];
        if(log){
            log.moved = true;
        }
    }
};

/**
 * 【編集モード】マウスアップ
 *
 * @param {Object} div ＤＯＭ要素
 * @param {Object} e イベント
 */
teasp.helper.ScheduleTxsLog.prototype.mouseUp = function(div, e){
    this.dragOff();
    this.backPos();
};

/**
 * 【編集モード】（対象マーカー外で）マウスダウン
 *
 * @param {Object} table ＤＯＭ要素
 * @param {Object} e イベント
 */
teasp.helper.ScheduleTxsLog.prototype.extraMouseDown = function(table, e){
    this.dragOff();
    this.focus(null);
};

/**
 * 【編集モード】（対象マーカー外で）マウス移動
 *
 * @param {Object} table テーブル要素
 * @param {Object} e イベント
 */
teasp.helper.ScheduleTxsLog.prototype.extraMouseMove = function(table, e){
    if(this.dragObj){
        this.mouseMove(dojo.byId(this.dragObj.id), e);
    }
};

/**
 * 【編集モード】（対象マーカー外で）マウスアップ
 *
 * @param {Object} table テーブル要素
 * @param {Object} e イベント
 */
teasp.helper.ScheduleTxsLog.prototype.extraMouseUp = function(table, e){
    this.dragOff();
};

/**
 * 【編集モード】ドラッグをオフにする
 */
teasp.helper.ScheduleTxsLog.prototype.dragOff = function(){
    this.dragObj = null;
};

/**
 * 【編集モード】フォーカスをセット
 *
 * @param {?string} markerId マーカーID
 */
teasp.helper.ScheduleTxsLog.prototype.focus = function(markerId){
    dojo.query('.txslog_focus').forEach(function(elem){
        if(!markerId || elem.id != markerId){
            dojo.removeClass(elem, 'txslog_focus');
        }
    });
    if(markerId){
        var d = dojo.byId(markerId);
        d.style.zIndex = this.markerZindex++;
        dojo.addClass(d, 'txslog_focus');
    }
};

/**
 * 【編集モード】今フォーカスを持っている要素を取得
 *
 * @return {string} 要素ID
 */
teasp.helper.ScheduleTxsLog.prototype.getFocusId = function(){
    var id = null;
    dojo.query('.txslog_focus').forEach(function(elem){
        id = elem.id;
    });
    return id;
};

/**
 * 【編集モード】座標を丸める.<br/>
 * 5,10,15分刻みで座標が変わるようにしたいのでピクセルの値を丸めた値にして返す<br/>
 * ※60分＝48ピクセルの場合、5分=4ピクセル、10分=8ピクセル、15分=12ピクセル
 *
 * @param {number} n 丸め対象の値
 * @return {number} 丸め後の値
 */
teasp.helper.ScheduleTxsLog.prototype.roundTime = function(n){
    return Math.floor(n / this.minH) * this.minH;
};

/**
 * 【編集モード】ピクセルを時間に換算
 *
 * @return {number} 時間
 */
teasp.helper.ScheduleTxsLog.prototype.pixel2time = function(p){
    return Math.round(p * 60 / this.heightPerH);
};

/**
 * 【タイムレポート】 行動ログリストを返す
 * @return {Array.<Object>} 行動ログリスト
 */
teasp.helper.ScheduleTxsLog.prototype.getTxsLogs = function(et){
	var txsLogs = this.pouch.getObj().txsLogs;
	if(txsLogs.length > 0){
		for(var i = 1 ; i < txsLogs.length ; i++){
			if(!txsLogs[i-1].moved && !txsLogs[i-1].et){
				txsLogs[i-1].et = txsLogs[i].st;
			}
		}
		if(!txsLogs[i-1].moved && !txsLogs[i-1].et){
			if(typeof(et) == 'number' && i > 0){
				if(et < txsLogs[i-1].st){
					txsLogs[i-1].et = txsLogs[i-1].st + 20;
				}else{
					txsLogs[i-1].et = et;
				}
			}else if(i > 0){
				txsLogs[i-1].et = txsLogs[i-1].st + 20;
			}
		}
	}
	return txsLogs;
};

/**
 * 行動ログの関連ジョブ情報を返す
 * @param {number} et
 * @param {Object} range
 * @return {boolean} true:行動ログがある false:ない
 */
teasp.helper.ScheduleTxsLog.prototype.getTxsLogJobs = function(et, range, helperJobs){
	var txsLogs = this.getTxsLogs(et);
	for (var i = 0; i < txsLogs.length; i++) {
		var log = txsLogs[i];
		if(log.target.type != 'AtkJob__c' && (!log.target.what || log.target.what.type != 'AtkJob__c')){
			continue;
		}
		if(log.st < range.st || range.et <= log.st){ // 取り込み範囲外
			continue;
		}
		var rt = teasp.util.time.rangeTime({ from: log.st, to: log.et }, range.rests);
		var minutes = (log.et - log.st - rt);
		if(minutes < 0){
			minutes = 0;
		}
		var dt = moment(log.date, teasp.constant.DATE_F);
		var span = {
			sdt: dt.clone().add(log.st, 'm'),
			edt: dt.clone().add(log.et, 'm')
		};
		var jp = (log.target.type == 'AtkJob__c' ? log.target : log.target.what);

		helperJobs.add(jp.id, null, [span], {minutes:minutes, inner:true, orgSdt:span.sdt}, false, true);
	}
	return (txsLogs.length > 0);
};
