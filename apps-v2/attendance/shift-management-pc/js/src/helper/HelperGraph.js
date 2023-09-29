teasp.provide('teasp.helper.Graph');
/**
 * 勤怠グラフ描画
 *
 * @constructor
 * @param {Object} param
 */
teasp.helper.Graph = function(param){
    /** @private */
    this.toolTips = [];
    /** @private */
    this.pouch = null;

    this.TIME_TABLE_NORMAL   =  1;
    this.TIME_TABLE_LZAN     =  2;
    this.TIME_TABLE_LOUT     =  3;
    this.TIME_TABLE_CHARGE   =  4;
    this.TIME_TABLE_HOLYWORK =  5;
    this.TIME_TABLE_HOLYAM   =  6;
    this.TIME_TABLE_HOLYPM   =  7;
    this.TIME_TABLE_LATE     =  8;
    this.TIME_TABLE_EARLY    =  9;
    this.TIME_TABLE_REST_FIX = 21;
    this.TIME_TABLE_REST_FREE= 22;
    this.TIME_TABLE_REST_PAY = 23;
    this.TIME_TABLE_AWAY     = 30;

    this.MARKER_ID_PREFIX  = 'atkmarker';
    this.TOOLTIP_ID_PREFIX = 'atktooltip';
    this.OUT_COUNT_MAX   = 5;
    this.REST_COUNT_MAX  = 10;

    this.startY             = ((param && param.startY            ) || 48     ); // Y方向起点
    this.areaWidth          = ((param && param.areaWidth         ) || 0      ); // エリア幅
    this.marginLeft         = ((param && param.marginLeft        ) || 10     ); // X方向起点
    this.widthPerH          = ((param && param.widthPerH         ) || 24     ); // ピクセル数/時
    this.edgeMark           = ((param && param.edgeMark          ) || false  ); // 出退社時刻位置マーク表示
    this.movable            = ((param && param.movable           ) || false  ); // 編集モードなら true
    this.setDialogMode(); // ダイアログモードをセット
    this.clickedEvent       = ((param && param.clickedEvent      ) || null   ); // マーカークリックイベントハンドラ
    this.clickedApply       = ((param && param.clickedApply      ) || null   ); // 申請アイコンクリックイベントハンドラ
    this.sizeType           = ((param && param.sizeType          ) || 'small'); // サイズタイプ 'small' or 'large'
    this.timeRound          = ((param && param.timeRound         ) || 1      ); // 時刻丸め刻み値
    this.readOnly           = ((param && param.readOnly          ) || false  ); // 編集モードで編集不可
    this.restFix            = ((param && param.restFix           ) || false  ); // 休憩時間を編集モードで編集不可
    this.hideTimeGraphPopup = ((param && param.hideTimeGraphPopup) || false  ); // 勤怠グラフのポップアップを非表示にする
    this.that               = param.that;

    this.lineHeight   = 24;    // 行高さ
//    this.minW;                 // 丸めによる最小幅
    this.impactMakers = {};    // 休憩の編集によって影響をうけるマーカー
    this.restMarkers  = [];    // 休憩マーカーのIDコレクション
    this.awayMarkers  = [];    // 外出マーカーのIDコレクション
    this.tempMarker = {};
    this.dragObj      = null;  // ドラッグ中保持するオブジェクト
    this.eventHandles = [];
    this.baseDivId    = null;  // マーカーの親ノード
//    this.pMenu;                // ポップアップメニュー
//    this.targetDayObj;         // 編集モードの対象日情報

    this.typeStyleMap = [];
    this.typeStyleMap[this.TIME_TABLE_NORMAL]    = 'marker_work';
    this.typeStyleMap[this.TIME_TABLE_LZAN]      = 'marker_lzan';
    this.typeStyleMap[this.TIME_TABLE_CHARGE]    = 'marker_lext';
    this.typeStyleMap[this.TIME_TABLE_LOUT]      = 'marker_lout';
    this.typeStyleMap[this.TIME_TABLE_REST_FIX]  = 'marker_rest';
    this.typeStyleMap[this.TIME_TABLE_REST_FREE] = 'marker_rest';
    this.typeStyleMap[this.TIME_TABLE_REST_PAY]  = 'marker_line';
    this.typeStyleMap[this.TIME_TABLE_AWAY]      = 'marker_away';
    this.typeStyleMap[this.TIME_TABLE_HOLYWORK]  = 'marker_holy';

    this.markerSizeSet = {
        small: {
              shadow_fix   : {h: 10, zIndex: 100 }
            , shadow_rest  : {h: 10, zIndex: 105 }
            , marker_work  : {h: 10, zIndex: 110 }
            , marker_lzan  : {h: 10, zIndex: 120 }
            , marker_lout  : {h: 10, zIndex: 130 }
            , marker_holy  : {h: 10, zIndex: 140 }
            , marker_away  : {h:  6, zIndex: 150 }
            , marker_lext  : {h:  4, zIndex: 160 }
            , marker_night : {h:  3, zIndex: 170 }
            , marker_rest  : {h: 10, zIndex: 175 }
            , marker_line  : {h:  2, zIndex: 200 }
        },
        middle: {
              shadow_fix   : {h: 16, zIndex: 100 }
            , shadow_rest  : {h: 16, zIndex: 105 }
            , marker_work  : {h: 16, zIndex: 110 }
            , marker_lzan  : {h: 16, zIndex: 120 }
            , marker_lout  : {h: 16, zIndex: 130 }
            , marker_holy  : {h: 16, zIndex: 140 }
            , marker_away  : {h: 10, zIndex: 150 }
            , marker_lext  : {h:  7, zIndex: 160 }
            , marker_night : {h:  4, zIndex: 170 }
            , marker_rest  : {h: 16, zIndex: 175 }
            , marker_line  : {h:  3, zIndex: 200 }
        },
        large: {
              shadow_fix   : {h: 30, zIndex: 1000 }
            , shadow_rest  : {h: 30, zIndex: 1050 }
            , marker_work  : {h: 30, zIndex: 1100 }
            , marker_lzan  : {h: 30, zIndex: 1200 }
            , marker_lout  : {h: 30, zIndex: 1300 }
            , marker_holy  : {h: 30, zIndex: 1400 }
            , marker_away  : {h: 25, zIndex: 1500 }
            , marker_lext  : {h: 12, zIndex: 1600 }
            , marker_night : {h:  9, zIndex: 1700 }
            , marker_rest  : {h: 20, zIndex: 1750, eh: 30 }
            , marker_line  : {h:  5, zIndex: 2000 }
        }
    };
    this.MARK_APPS = [
        { elementKey: 'patternL'    , className: 'patl', applyType : teasp.message.getLabel('applyPatternL_label')   , title:teasp.message.getLabel('applyPatternL_label')    } // 長期時間変更申請
      , { elementKey: 'patternS'    , className: 'pats', applyType : teasp.message.getLabel('applyPatternS_label')   , title:teasp.message.getLabel('applyPatternS_label')    } // 勤務時間変更申請
      , { elementKey: 'patternD'    , className: 'patd', applyType : teasp.message.getLabel('applyPatternS_label')   , title:teasp.message.getLabel('applyPatternS_label')    } // 勤務時間変更申請
      , { elementKey: 'exchangeS'   , className: 'exch', applyType : teasp.message.getLabel('applyExchange_label')   , title:teasp.message.getLabel('applyExchange_label')    } // 振替申請
      , { elementKey: 'exchangeE'   , className: 'exch', applyType : teasp.message.getLabel('applyExchange_label')   , title:teasp.message.getLabel('applyExchange_label')    } // 振替申請
      , { elementKey: 'shiftChange' , className: 'exch', applyType : teasp.message.getLabel('tf10011260')            , title:teasp.message.getLabel('tf10011260')             } // シフト振替申請
      , { elementKey: 'holidayAll'  , className: 'kyun', applyType : teasp.message.getLabel('applyHoliday_label')    , title:teasp.message.getLabel('applyHoliday_label')     } // 休暇申請
      , { elementKey: 'holidayAm'   , className: 'kyun', applyType : teasp.message.getLabel('applyHoliday_label')    , title:teasp.message.getLabel('tm10001270')             } // 休暇申請(午前半休)
      , { elementKey: 'holidayPm'   , className: 'kyun', applyType : teasp.message.getLabel('applyHoliday_label')    , title:teasp.message.getLabel('tm10001280')             } // 休暇申請(午後半休)
      , { elementKey: 'holidayTime' , className: 'kyut', applyType : teasp.message.getLabel('applyHoliday_label')    , title:teasp.message.getLabel('tm10001290')             } // 休暇申請(時間単位)
      , { elementKey: 'kyushtu'     , className: 'hwrk', applyType : teasp.message.getLabel('applyHolidayWork_label'), title:teasp.message.getLabel('applyHolidayWork_label') } // 休日出勤申請
      , { elementKey: 'zangyo'      , className: 'zanw', applyType : teasp.message.getLabel('applyZangyo_label')     , title:teasp.message.getLabel('applyZangyo_label')      } // 残業申請
      , { elementKey: 'earlyStart'  , className: 'east', applyType : teasp.message.getLabel('applyEarlyWork_label')  , title:teasp.message.getLabel('applyEarlyWork_label')   } // 早朝勤務申請
      , { elementKey: 'lateStart'   , className: 'late', applyType : teasp.message.getLabel('applyLateStart_label')  , title:teasp.message.getLabel('applyLateStart_label')   } // 遅刻申請
      , { elementKey: 'earlyEnd'    , className: 'earl', applyType : teasp.message.getLabel('applyEarlyEnd_label')   , title:teasp.message.getLabel('applyEarlyEnd_label')    } // 早退申請
      , { elementKey: 'reviseTime'  , className: 'revt', applyType : teasp.message.getLabel('applyReviseTime_label') , title:teasp.message.getLabel('applyReviseTime_label')  } // 勤怠時刻修正申請
      , { elementKey: 'direct'      , className: 'drct', applyType : teasp.message.getLabel('tk10004650')            , title:teasp.message.getLabel('tk10004650')             } // 直行・直帰申請
    ];
    this.setStartY       = function(_startY      ){ this.startY       = _startY;       }; // Y方向起点
    this.setAreaWidth    = function(_areaWidth   ){ this.areaWidth    = _areaWidth;    }; // エリア幅
    this.setMarginLeft   = function(_marginLeft  ){ this.marginLeft   = _marginLeft;   }; // X方向起点
    this.setWidthPerH    = function(_widthPerH   ){ this.widthPerH    = _widthPerH;    }; // ピクセル数/時
    this.setEdgeMark     = function(_edgeMark    ){ this.edgeMark     = _edgeMark;     }; // 出退社時刻位置マーク表示
    this.setMovable      = function(_movable     ){ this.movable      = _movable;      }; // 編集モードなら true
    this.setClickedEvent = function(_clickedEvent){ this.clickedEvent = _clickedEvent; }; // マーカークリックイベントハンドラ
    this.setSizeType     = function(_sizeType    ){ this.sizeType     = _sizeType;     }; // サイズタイプ 0 or 1
    this.setTimeRound    = function(_timeRound   ){ this.timeRound    = _timeRound;    }; // 時刻丸め刻み値
    this.setReadOnly     = function(_readOnly    ){ this.readOnly     = _readOnly;     }; // 編集モードで編集不可
};

/**
 * V5-2271で編集モードを廃止したため、this.movable の値を this.dialogMode に引き継ぎ、
 * this.movable は false 固定にする。
 * this.movable =false にするのは、ポップアップメニューを表示させないため。
 * this.dialogMode = true の時は、勤怠グラフダイアログ向けのグラフ表示と判断され主に下記の制御が行われる。
 * ・申請アイコンや出退社時刻マーカー(▼)を表示しない
 * ・管理監督者や裁量労働の場合、常に実時間モードで表示する。
 */
teasp.helper.Graph.prototype.setDialogMode = function(){
    this.dialogMode = this.movable;
    this.movable    = false;
};

teasp.helper.Graph.prototype.clear = function(){
    if(this.baseDivId){
        for(var i = 0 ; i < this.toolTips.length ; i++){
            var t = dijit.byId(this.toolTips[i]);
            if(t){
                t.destroyRecursive();
                t.domNode = null;
                t = null;
            }
        }
        this.toolTips =[];
        // 前回のイベントハンドルをクリアする
        for(i = 0 ; i < this.eventHandles.length ; i++){
            dojo.disconnect(this.eventHandles[i]);
            delete this.eventHandles[i];
        }
        this.eventHandles = [];
        var div = dojo.byId(this.baseDivId);
        dojo.query('.marker_div', div).forEach(function(elem){
            dojo.destroy(elem);
            elem = null;
        });
    }
    this.impactMakers = {};    // 休憩の編集によって影響をうけるマーカー
    this.restMarkers  = [];    // 休憩マーカーのIDコレクション
    this.awayMarkers  = [];    // 外出マーカーのIDコレクション
};

/**
 * 勤怠グラフ作成開始
 *
 * @param {string} divId ノードID
 * @param {Array.<string>} dayList 日付リスト
 */
teasp.helper.Graph.prototype.draw = function(pouch, divId, dayList){
    this.pouch     = pouch;
    this.baseDivId = divId;

    // 丸め（5,10,15分刻み）ごとの最小ピクセル数
    // ※60分＝48ピクセルの場合、5分=4ピクセル、10分=8ピクセル、15分=12ピクセル
    // （1分刻みはピクセルが60より少ないため不可能なので5分刻みが最低）
    if(this.timeRound == 30){
        this.minW = 24;
    }else if(this.timeRound == 15){
        this.minW = 12;
    }else if(this.timeRound == 10){
        this.minW = 8;
    }else{
        this.minW = 4;
    }
    var posY = this.startY;

    if(this.dialogMode){
        if(this.movable){
            var table = dojo.byId('editTable');
            this.eventHandles.push(dojo.connect(table, 'onmousedown', this, function(_e){ this.extraMouseDown(table, (_e ? _e : window.event)); return false; }));
            this.eventHandles.push(dojo.connect(table, 'onmouseup'  , this, function(_e){ this.extraMouseUp(table, (_e ? _e : window.event)); }));
            this.eventHandles.push(dojo.connect(table, 'onmousemove', this, function(_e){ this.extraMouseMove(table, (_e ? _e : window.event)); return false; }));
            this.loadMenu();
        }
        this.targetDayObj = dojo.clone(this.pouch.getEmpDay(dayList[0]).getObj());

        this.createDivs(this.targetDayObj, posY);
    }else{
        for(var r = 0 ; r < dayList.length ; r++){
            this.createDivs(this.pouch.getEmpDay((typeof(dayList[r]) == 'string' ? dayList[r] : dayList[r].date)).getObj(), posY, (dayList.length == 1));
            posY += this.lineHeight;
        }
    }
};

/**
 * パラメータセット
 *
 * @param {Object} param
 */
teasp.helper.Graph.prototype.setParam = function(param){
    this.readOnly     = ((param && param.readOnly    ) || false  ); // 編集モードで編集不可
    this.restFix      = ((param && param.restFix     ) || false  ); // 休憩時間を編集モードで編集不可
};

teasp.helper.Graph.prototype.createMarkerId = function(){
    return this.MARKER_ID_PREFIX + (++teasp.sequence.marker);
};

/**
 * １日分の勤怠グラフを作成
 *
 * @param {Object} dayObj dayオブジェクト
 * @param {number} posY Y座標
 * @param {boolean=} montip trueならツールチップに月次サマリーを表示
 */
teasp.helper.Graph.prototype.createDivs = function(dayObj, posY, montip){
    var shadow = null, coreZone = null, worktm = [], absPos = null, i, o, r, t, a, mp;

    var calcMode = this.pouch.getCalcMode();
    if(this.dialogMode && calcMode == teasp.constant.C_DISC){ // 編集モードなら強制的に実時間モード
        calcMode = teasp.constant.C_REAL;
    }
    var dayWrap = this.pouch.getEmpDay(dayObj.date);

    if(!this.pouch.isAlive(dayObj.date)){
        return;
    }
    var pattern = dayWrap.getPattern(); // 勤務パターン
    var st = dayWrap.getStartTime(true, null, calcMode, true);    // 出社時刻（調整済み）
    var et = dayWrap.getEndTime(true, null, calcMode, true);      // 退社時刻（調整済み）
    var mixWork = { from: st, to: et };
    var whole   = (this.dialogMode ? { from: 0, to: (48*60) } : {from: st, to: et });
    var worked = ((typeof(st) == 'number' && typeof(et) == 'number' && st < et) || dayObj[calcMode].discReal);
    var timeTable = dayWrap.getTimeTable(true);
    var markerIdList = [];
    var markerH = this.markerSizeSet[this.sizeType];
    var lplus = (this.sizeType == 'large' ? 13 : (this.sizeType == 'middle' ? 7 : 4));
    var baseDiv = dojo.byId(this.baseDivId);
    var halfFix = null;

    var hourRestTimes = (dayObj.rack.hourRests || []);
    var restTable = [];
    this.tempMarker = {};
    for(i = 0 ; i < timeTable.length ; i++){
        t = timeTable[i];
        if(t.type == teasp.constant.REST_FIX || t.type == teasp.constant.REST_FREE || t.type == teasp.constant.AWAY){
            if(teasp.util.time.isValidRange(t.from, t.to)){
                restTable.push(t);
            }else if(typeof(t.from) == 'number' || typeof(t.to) == 'number'){
                // 開始・終了の片方のみ入力されている場合、グラフに表示するために5分のマーカーを作る
                // ※注 この時間帯はツールチップ表示の明細に現れない
                restTable.push({
                    from      : (typeof(t.from) == 'number' ? t.from : t.to   - 5),
                    to        : (typeof(t.to)   == 'number' ? t.to   : t.from + 5),
                    type      : t.type,
                    temporary : t
                });
            }
        }
    }

    var holyAll = dayObj.rack.validApplys.holidayAll;
    var holyAllType = null;
    if(holyAll){ // 終日の休暇
        if(holyAll.holiday.type == teasp.constant.HOLIDAY_TYPE_PAID || dayObj.rack.plannedHolidayReal){
            holyAllType = teasp.constant.HOLIDAY_TYPE_PAID; // 有休
        }else if(holyAll.holiday.type == teasp.constant.HOLIDAY_TYPE_DAIQ){
            holyAllType = teasp.constant.HOLIDAY_TYPE_DAIQ; // 代休
        }else if(holyAll.holiday.type == teasp.constant.HOLIDAY_TYPE_FREE){
            holyAllType = teasp.constant.HOLIDAY_TYPE_FREE; // 無給
        }
    }
    if(dayWrap.isPlannedHoliday() && !dayWrap.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)){ // 有休計画付与日かつ休日出勤申請なし
        holyAllType = teasp.constant.HOLIDAY_TYPE_PAID; // 有休
    }
    var minasi = false;
    var discretionaryLevel = dayWrap.getDiscretionaryLevel();
    if(worked && !this.dialogMode && discretionaryLevel > 0){  // 勤務した＆裁量労働の日
        minasi = true;
    }

    o = null;
    if(dayObj.rack.validApplys.kyushtu.length > 0){ // 休日かつ休日出勤申請済み
        // 休日出勤申請に記載の開始時間と終了時間を得る
        o = {st: dayObj.rack.validApplys.kyushtu[0].startTime, et: dayObj.rack.validApplys.kyushtu[0].endTime };
    }else if(teasp.util.time.isValidRange(dayObj.rack.fixStartTime2, dayObj.rack.fixEndTime2)){
        // 裁量労働＝オンで半休取得時のみなし出退社時刻がセット済み
        o = {st: dayObj.rack.fixStartTime2, et: dayObj.rack.fixEndTime2 };
    }else if(teasp.util.time.isValidRange(dayObj.rack.fixStartTime, dayObj.rack.fixEndTime)){
        o = {st: dayObj.rack.fixStartTime, et: dayObj.rack.fixEndTime };
    }else{
        // 勤務パターンの開始時間、終了時間を得る
        o = {st: pattern.stdStartTime, et: pattern.stdEndTime };
        if(holyAll && (dayObj.rack.paidHolySpans || []).length > 0){
            o = {st: dayObj.rack.paidHolySpans[0].from, et: dayObj.rack.paidHolySpans[0].to};
        }
    }
    // 所定（予定）勤務時間帯の座標情報を得る
    if(o){
        shadow = this.calcPosWidth(o.st, o.et, this.widthPerH);
    }
    if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX // 労働時間制＝フレックスタイム制
    && dayWrap.isNormalDay()          // 平日
    && this.pouch.isCoreTimeGraph()){ // グラフにコア時間を表示する
        var co = this.pouch.getConfigObj();
        if(!pattern.id || !dayObj.rack.useCoreTime){ // デフォルトの勤務パターン
            coreZone = {};
            if(dayObj.rack.useCoreTime){
                coreZone.zone = this.calcPosWidth(co.coreStartTime, co.coreEndTime, this.widthPerH);
            }
        }
    }
    // 実労働時間帯の座標情報を得る
    var workSpan = dayObj[calcMode].workSpan;
    if(workSpan.length > 0){
        for(i = 0 ; i < workSpan.length ; i++){
            worktm.push(this.calcPosWidth(workSpan[i].from, workSpan[i].to, this.widthPerH));
        }
    }

    if(this.areaWidth && (shadow || worktm.length > 0)){
        if(worktm.length > 0){
            var wk_begX = worktm[0].begX;
            var wk_endX = worktm[worktm.length - 1].endX;
            o = {
                begX : (wk_begX < shadow.begX ? wk_begX : shadow.begX),
                endX : (wk_endX > shadow.endX ? wk_endX : shadow.endX)
            };
            absPos = this.calcAbsolutePos(wk_begX, o.begX, (wk_endX - wk_begX), (o.endX - o.begX), this.areaWidth, this.marginLeft);
        }else{
            absPos = this.calcAbsolutePos(shadow.begX, shadow.begX, (shadow.endX - shadow.begX), (shadow.endX - shadow.begX), this.areaWidth, this.marginLeft);
        }
        baseDiv.style.backgroundPosition = '-' + absPos.x + 'px -3px';
    }
    if (!this.dialogMode) {
        // 出退時刻に▼のマーカーを配置
        var pst = dayWrap.getStartTime(true, null, teasp.constant.C_REAL);    // 出社時刻（調整前）
        var pet = dayWrap.getEndTime  (true, null, teasp.constant.C_REAL);    // 退社時刻（調整前）
        var itf = [];
        if(typeof(pst) == 'number'){
            var x = pst * this.widthPerH / 60;
            var y = posY - 4;
            if(!absPos || (absPos && absPos.leftX <= x && x < absPos.rightX)){
                x += (this.marginLeft - (absPos ? absPos.x : 0) - 2);
                var cl = ((dayWrap.getInputLimit().flag & 1) ? 'yellow' : 'blue');
                if(dayWrap.getObj().real.lateTime > 0){
                    cl = 'red';
                }
                var div = dojo.create('div', { className: 'marker_div abs_div pp_base pp_inout_' + cl, style: { left:(x + "px"), top:(y + "px"), zIndex:202 } }, baseDiv);
                if(dayWrap.getInputLimit().flag & 1){
                    div.title = teasp.message.getLabel('tk10004680'); // 直行
                }
                itf.push({ sx: x, ex: x + 5 });
                div = null;
            }
        }
        if(typeof(pet) == 'number'){
            var x = pet * this.widthPerH / 60;
            var y = posY - 3;
            if(!absPos || (absPos && absPos.leftX <= x && x < absPos.rightX)){
                x += (this.marginLeft - (absPos ? absPos.x : 0) - 2);
                var cl = ((dayWrap.getInputLimit().flag & 2) ? 'yellow' : 'blue');
                if(dayWrap.getObj().real.earlyTime > 0){
                    cl = 'red';
                }
                var div = dojo.create('div', { className: 'marker_div abs_div pp_base pp_inout_' + cl, style: { left:(x + "px"), top:(y + "px"), zIndex:202 } }, baseDiv);
                itf.push({ sx: x, ex: x + 5 });
                if(dayWrap.getInputLimit().flag & 2){
                    div.title = teasp.message.getLabel('tk10004690'); // 直帰
                }
                div = null;
            }
        }
        // 申請マーカーを配置
        var appmark = {
            'zangyo' : {
                applys : [],
                x      : (pattern ? (pattern.stdEndTime * this.widthPerH / 60) : shadow.endX)
            },
            'other' : {
                applys : [],
                x      : (pattern ? (pattern.stdStartTime * this.widthPerH / 60) : shadow.begX)
            }
        };
        for(var ax = 0 ; ax < this.MARK_APPS.length ; ax++){
            var va = [];
            var ta = dayObj.rack.validApplys[this.MARK_APPS[ax].elementKey];
            if(ta){
                if(is_array(ta)){
                    va = ta;
                }else{
                    va.push(ta);
                }
            }
            if(dayObj.rack.validApplys.rejects){
                ta = dayObj.rack.validApplys.rejects[this.MARK_APPS[ax].elementKey];
                if(ta){
                    if(is_array(ta)){
                        va = va.concat(ta);
                    }else{
                        va.push(ta);
                    }
                }
            }
            if (!va.length) {
                continue;
            }
            var applys = (this.MARK_APPS[ax].elementKey == 'zangyo' ? appmark.zangyo.applys : appmark.other.applys);
            if(is_array(va)){
                for (i = 0; i < va.length; i++) {
                    applys.push({
                        an     : va[i],
                        cn    : this.MARK_APPS[ax].className,
                        cnfx  : teasp.constant.getStatusStyleSuffix(va[i].status),
                        title : this.MARK_APPS[ax].title + '(' + teasp.constant.getDisplayStatus(va[i].status) + ')'
                    });
                }
            }else{
                applys.push({
                    an    : va,
                    cn    : this.MARK_APPS[ax].className,
                    cnfx  : teasp.constant.getStatusStyleSuffix(va.status),
                    title : this.MARK_APPS[ax].title + '(' + teasp.constant.getDisplayStatus(va.status) + ')'
                });
            }
        }
        for(var key in appmark){
            var ix = appmark[key].x;
            for(i = 0 ; i < appmark[key].applys.length ; i++){
                var x = ix;
                if(!absPos || (absPos && absPos.leftX <= x && x < absPos.rightX)){
                    x += (this.marginLeft - (absPos ? absPos.x : 0) + 2);
                    for(var j = 0 ; j < itf.length ; j++){
                        if(x <= itf[j].ex && itf[j].sx <= (x + 11)){
                            var mx = (itf[j].ex + 1 - x);
                            ix += mx;
                            x += mx;
                        }
                    }
                    ix += 12;
                    var y = posY - 3;
                    var div = dojo.create('div', {
                        style     : { cursor:"pointer", lineHeight:"11px", left:(x + "px"), top:(y + "px"), zIndex:201 },
                        className : 'marker_div abs_div pp_base pp_ap_' + appmark[key].applys[i].cn + appmark[key].applys[i].cnfx,
                        title     : appmark[key].applys[i].title,
                        width     : '11px'
                    }, baseDiv);
                    if(this.clickedApply){
                    	this.eventHandles.push(dojo.connect(div, 'onclick', this.that, this.clickedApply.apply(this.that, [dayObj.date, appmark[key].applys[i].an.id])));
                    }
                    div = null;
                }
            }
        }
    }
    if((!shadow && worktm.length <= 0)
    || (!dayWrap.isInputTime()
    && dayWrap.isHoliday()
    && !dayObj.rack.validApplys.kyushtu.length)){
        return;
    }

    // 所定（予定）勤務時間帯、休暇のマーカーをセット
    if(shadow){
        mp = this.calcMakerPos(shadow, absPos, this.marginLeft, posY);
        if(mp){
            var cn = '';
            if(dayWrap.isPlannedHoliday() && !dayWrap.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)){ // 有休計画付与日かつ休日出勤申請なし
                cn = 'marker_work'; // 終日有休
            }else{
                if(holyAllType == teasp.constant.HOLIDAY_TYPE_PAID){
                    cn = 'marker_work'; // 終日有休
                }else if(holyAllType == teasp.constant.HOLIDAY_TYPE_DAIQ){
                    cn = 'marker_rest'; // 終日代休
                }else{
                    if(coreZone){ // コア時間帯を表示する場合は、差し替え
                        mp = (coreZone.zone ? this.calcMakerPos(coreZone.zone, absPos, this.marginLeft, posY) : null);
                    }
                    cn = 'shadow_fix';  // グレイマーカー
                }
            }
            if(mp){
                o = dojo.clone(markerH[cn]);
                if(o.eh){
                    o.h = o.eh;
                }
                var markerId = this.createMarkerId();
                var div = dojo.create('div', { style: this.getStyleSize(mp.x, mp.y, mp.w, o), width: mp.w + 'px', className: 'marker_div ' + cn, id: markerId }, baseDiv);
                div.style.left = mp.x + 'px';
                div.style.top  = mp.y + 'px';
                div.style.width  = mp.w + 'px';
                div.style.height = o.h + 'px';
                markerIdList.push(markerId);
                if(holyAllType){ // 終日の休暇なら白いラインを引く
                    var ldiv = dojo.create('div', { style: this.getStyleSize(mp.x, mp.y + lplus, mp.w, markerH.marker_line), className: 'marker_div marker_line' }, baseDiv);
                    ldiv.style.left = mp.x + 'px';
                    ldiv.style.top  = (mp.y + lplus) + 'px';
                    ldiv.style.width  = mp.w + 'px';
                    ldiv.style.height = markerH.marker_line.h + 'px';
                    ldiv = null;
                }
                if(this.movable && !this.readOnly){
                	this.eventHandles.push(dojo.connect(div, 'onmousedown', this, function(_e){ this.extraMouseDown(div, (_e ? _e : window.event)); return false; }));
                	this.eventHandles.push(dojo.connect(div, 'onmouseup'  , this, function(_e){ this.extraMouseUp(div, (_e ? _e : window.event)); }));
                	this.eventHandles.push(dojo.connect(div, 'onmousemove', this, function(_e){ this.extraMouseMove(div, (_e ? _e : window.event)); return false; }));
                    this.pMenu.bindDomNode(div.id);
                }
                div = null;
            }
        }
        // 残業申請があれば、マーカーを追加でセット
        for(i = 0 ; i < dayObj.rack.validApplys.zangyo.length ; i++){
            a = dayObj.rack.validApplys.zangyo[i];
            o = this.calcPosWidth(a.startTime, a.endTime, this.widthPerH);
            mp = this.calcMakerPos(o, absPos, this.marginLeft, posY);
            if(mp){
                var markerId = this.createMarkerId();
                var div = dojo.create('div', { style: this.getStyleSize(mp.x, mp.y, mp.w, markerH.shadow_fix), className: 'marker_div shadow_fix', id: markerId }, baseDiv);
                div.style.left = mp.x + 'px';
                div.style.top  = mp.y + 'px';
                div.style.width  = mp.w + 'px';
                div.style.height = markerH.shadow_fix.h + 'px';
                markerIdList.push(markerId);
                div = null;
            }
        }
        // 早朝勤務申請があれば、マーカーを追加でセット
        for(i = 0 ; i < dayObj.rack.validApplys.earlyStart.length ; i++){
            a = dayObj.rack.validApplys.earlyStart[i];
            o = this.calcPosWidth(a.startTime, a.endTime, this.widthPerH);
            mp = this.calcMakerPos(o, absPos, this.marginLeft, posY);
            if(mp){
                var markerId = this.createMarkerId();
                var div = dojo.create('div', { style: this.getStyleSize(mp.x, mp.y, mp.w, markerH.shadow_fix), className: 'marker_div shadow_fix', id: markerId }, baseDiv);
                div.style.left = mp.x + 'px';
                div.style.top  = mp.y + 'px';
                div.style.width  = mp.w + 'px';
                div.style.height = markerH.shadow_fix.h + 'px';
                markerIdList.push(markerId);
                div = null;
            }
        }
        // 休憩マーカーをセット（終日代休の場合は不要）
        if(holyAllType != teasp.constant.HOLIDAY_TYPE_DAIQ){
            for(i = 0 ; i < pattern.restTimes.length ; i++){
                t = pattern.restTimes[i];
                if(holyAllType == teasp.constant.HOLIDAY_TYPE_PAID){
                    o = this.calcPosWidth((pattern.stdStartTime <= t.from ? t.from : pattern.stdStartTime), (t.to <= pattern.stdEndTime ? t.to : pattern.stdEndTime), this.widthPerH);
                }else{
                    o = this.calcPosWidth(t.from, t.to, this.widthPerH);
                }
                mp = this.calcMakerPos(o, absPos, this.marginLeft, posY);
                if(mp && mp.w > 0){
                    var cn = (holyAllType == teasp.constant.HOLIDAY_TYPE_PAID || holyAllType == teasp.constant.HOLIDAY_TYPE_FREE ? 'marker_rest' : 'shadow_rest');
                    var markerId = this.createMarkerId();
                    var div = dojo.create('div', { style: this.getStyleSize(mp.x, mp.y, mp.w, markerH[cn]), className: 'marker_div ' + cn, id: markerId }, baseDiv);
                    div.style.left = mp.x + 'px';
                    div.style.top  = mp.y + 'px';
                    div.style.width  = mp.w + 'px';
                    div.style.height = markerH[cn].h + 'px';
                    markerIdList.push(markerId);
                    if(this.movable && !this.readOnly){
                    	this.eventHandles.push(dojo.connect(div, 'onmousedown', this, function(_e){ this.extraMouseDown(div, (_e ? _e : window.event)); return false; }));
                    	this.eventHandles.push(dojo.connect(div, 'onmouseup'  , this, function(_e){ this.extraMouseUp(div, (_e ? _e : window.event)); }));
                    	this.eventHandles.push(dojo.connect(div, 'onmousemove', this, function(_e){ this.extraMouseMove(div, (_e ? _e : window.event)); return false; }));
                        this.pMenu.bindDomNode(div.id);
                    }
                    div = null;
                }
            }
        }
        // 終日の休暇ではないが休暇申請がある
        if(!holyAll && (dayObj.rack.validApplys.holidayAm || dayObj.rack.validApplys.holidayPm) && !dayWrap.isFlexHalfDayTimeDay()){
            for(i = 0 ; i < 2 ; i++){
                a = (i == 0 ? dayObj.rack.validApplys.holidayAm : dayObj.rack.validApplys.holidayPm);
                if(!a){
                    continue;
                }
                var half = {};
                if(a.holiday.range == teasp.constant.RANGE_AM){ // 午前半休
                    half.from = pattern.amHolidayStartTime;
                    half.to   = pattern.amHolidayEndTime;
                    halfFix = {from:0, to:half.to};
                }else{ // 午後半休
                    half.from = pattern.pmHolidayStartTime;
                    half.to   = pattern.pmHolidayEndTime;
                    halfFix = {from:half.from, to:(48*60)};
                }
                if(half.from < whole.from){
                    whole.from = half.from;
                }
                if(whole.to < half.to){
                    whole.to = half.to;
                }
                o = this.calcPosWidth(half.from, half.to, this.widthPerH);
                mp = this.calcMakerPos(o, absPos, this.marginLeft, posY);
                if(mp){
                    if(a.holiday.type == teasp.constant.HOLIDAY_TYPE_PAID || a.holiday.type == teasp.constant.HOLIDAY_TYPE_DAIQ){ // 有休または代休
                        var cn = (a.holiday.type == teasp.constant.HOLIDAY_TYPE_PAID ? 'marker_work' : 'marker_rest');
                        o = dojo.clone(markerH[cn]);
                        if(o.eh){
                            o.h = o.eh;
                        }
                        var markerId = this.createMarkerId();
                        var div = dojo.create('div', { style: this.getStyleSize(mp.x, mp.y, mp.w, o), className: 'marker_div ' + cn, id: markerId }, baseDiv);
                        div.style.left = mp.x + 'px';
                        div.style.top  = mp.y + 'px';
                        div.style.width  = mp.w + 'px';
                        div.style.height = o.h + 'px';
                        markerIdList.push(markerId);
                        div = null;
                    }
                    // 休暇の白いラインを引く
                    dojo.create('div', { style: this.getStyleSize(mp.x, mp.y + lplus, mp.w, markerH.marker_line), className: 'marker_div marker_line' }, baseDiv);
                }
                // 有給と無給の場合、休憩マーカーを追加
                if(a.holiday.type == teasp.constant.HOLIDAY_TYPE_PAID || a.holiday.type == teasp.constant.HOLIDAY_TYPE_FREE){
                    var ress = [];
                    for(r = 0 ; r < pattern.restTimes.length ; r++){
                        t = pattern.restTimes[r];
                        var res = {from: (half.from <= t.from ? t.from : half.from), to: (t.to <= half.to ? t.to : half.to)};
                        o = this.calcPosWidth(res.from, res.to, this.widthPerH);
                        mp = this.calcMakerPos(o, absPos, this.marginLeft, posY);
                        if(mp){
                            ress.push(res);
                            var markerId = this.createMarkerId();
                            var div = dojo.create('div', { style: this.getStyleSize(mp.x, mp.y, mp.w, markerH.marker_rest), className: 'marker_div marker_rest', id: markerId }, baseDiv);
                            div.style.left = mp.x + 'px';
                            div.style.top  = mp.y + 'px';
                            div.style.width  = mp.w + 'px';
                            div.style.height = markerH.marker_rest.h + 'px';
                            markerIdList.push(markerId);
                        }
                    }
                    if(ress.length > 0){
                        // 出社～退社範囲内の所定休憩は後で描画するので、描画済みの所定休憩を除いておく
                        restTable = teasp.helper.Graph.excludeRanges(restTable, ress);
                    }
                }
            }
        }
    }

    if(worked && worktm.length > 0){ // 出社・退社とも入力されている
        // 出社～退社のマーカーをセット
        for(i = 0 ; i < worktm.length ; i++){
            mp = this.calcMakerPos(worktm[i], absPos, this.marginLeft, posY);
            if(mp){
                var markerId = this.createMarkerId();
                var div = dojo.create('div', { style: this.getStyleSize(mp.x, mp.y, mp.w, markerH.marker_work), className: 'marker_div marker_work', id: markerId }, baseDiv);
                div.style.left = mp.x + 'px';
                div.style.top  = mp.y + 'px';
                div.style.width  = mp.w + 'px';
                div.style.height = markerH.marker_work.h + 'px';
                markerIdList.push(markerId);
                if(this.movable && !this.readOnly){
                	this.eventHandles.push(dojo.connect(div, 'onmousedown', this, function(_e){ this.extraMouseDown(div, (_e ? _e : window.event)); return false; }));
                	this.eventHandles.push(dojo.connect(div, 'onmouseup'  , this, function(_e){ this.extraMouseUp(div, (_e ? _e : window.event)); }));
                	this.eventHandles.push(dojo.connect(div, 'onmousemove', this, function(_e){ this.extraMouseMove(div, (_e ? _e : window.event)); return false; }));
                    this.pMenu.bindDomNode(div.id);
                }
                div = null;
            }
        }
        if(minasi){
            var incl = { begX: worktm[0].begX, endX: worktm[worktm.length - 1].endX };
            mp = this.calcMakerPos(incl, absPos, this.marginLeft, posY);
            if(mp){
                // みなしかつ（平日または休日出勤の勤怠は平日準拠）の場合、白いラインを引く
                var ldiv = dojo.create('div', { style: this.getStyleSize(mp.x, mp.y + lplus, mp.w, markerH.marker_line), className: 'marker_div marker_line' }, baseDiv);
                ldiv.style.left = mp.x + 'px';
                ldiv.style.top  = (mp.y + lplus) + 'px';
                ldiv.style.width  = mp.w + 'px';
                ldiv.style.height = markerH.marker_line.h + 'px';
                ldiv = null;
            }
        }
        // 法定内残業、法定外残業、休日出勤、割増のマーカーをセット
        var spans = [];
        for(i = 0 ; i < dayObj[calcMode].workHolidaySpan.length ; i++){ // 休日出勤
            spans.push({
                span : dayObj[calcMode].workHolidaySpan[i],
                key  : this.TIME_TABLE_HOLYWORK
            });
        }
        for(i = 0 ; i < dayObj[calcMode].workLegalOverSpan.length ; i++){ // 法定内残業
            spans.push({
                span : dayObj[calcMode].workLegalOverSpan[i],
                key  : this.TIME_TABLE_LZAN
            });
        }
        for(i = 0 ; i < dayObj[calcMode].workLegalOutOverSpan.length ; i++){ // 法定外残業
            spans.push({
                span : dayObj[calcMode].workLegalOutOverSpan[i],
                key  : this.TIME_TABLE_LOUT
            });
        }
        for(i = 0 ; i < dayObj[calcMode].workChargeSpan.length ; i++){ // 法定時間外割増
            spans.push({
                span : dayObj[calcMode].workChargeSpan[i],
                key  : this.TIME_TABLE_CHARGE
            });
        }
        for(i = 0 ; i < spans.length ; i++){
            var tt = spans[i].span;
            if(!tt){
                continue;
            }
            var cn = this.typeStyleMap[spans[i].key];
            o = this.calcPosWidth(tt.from, tt.to, this.widthPerH);
            mp = this.calcMakerPos(o, absPos, this.marginLeft, posY);
            if(mp){
                var markerId = this.createMarkerId();
                var div = dojo.create('div', {
                    style : this.getStyleSize(mp.x, mp.y, mp.w, markerH[cn]),
                    className : 'marker_div ' + cn,
                    id : markerId
                }, baseDiv);
                div.style.left = mp.x + 'px';
                div.style.top  = mp.y + 'px';
                div.style.width  = mp.w + 'px';
                div.style.height = markerH[cn].h + 'px';
                markerIdList.push(markerId);
                if(cn == 'marker_lout' || cn == 'marker_lzan' || cn == 'marker_lext'){
                    this.impactMakers[cn] = markerId;
                }
                if(this.movable && !this.readOnly){
                	this.eventHandles.push(dojo.connect(div, 'onmousedown', this, function(_e){
                        this.extraMouseDown(div, (_e ? _e : window.event));
                        return false;
                    }));
                	this.eventHandles.push(dojo.connect(div, 'onmouseup', this, function(_e){
                        this.extraMouseUp(div, (_e ? _e : window.event));
                    }));
                	this.eventHandles.push(dojo.connect(div, 'onmousemove', this, function(_e){
                        this.extraMouseMove(div, (_e ? _e : window.event));
                        return false;
                    }));
                }
                div = null;
            }
        }
        // 時間単位有休のマーカーをセット
        for(i = 0 ; i < hourRestTimes.length ; i++){
            var rt = hourRestTimes[i];
            o = this.calcPosWidth(rt.from, rt.to, this.widthPerH);
            mp = this.calcMakerPos(o, absPos, this.marginLeft, posY);
            if(mp){
                var markerId = this.createMarkerId();
                var div = dojo.create('div', {
                    style : this.getStyleSize(mp.x, mp.y, mp.w, markerH.marker_work),
                    className : 'marker_div ' + (rt.type == teasp.constant.REST_PAY ? 'marker_work' : 'shadow_fix'),
                    id : markerId
                }, baseDiv);
                div.style.left = mp.x + 'px';
                div.style.top  = mp.y + 'px';
                div.style.width  = mp.w + 'px';
                div.style.height = markerH.marker_work.h + 'px';
                markerIdList.push(markerId);
                div = dojo.create('div', {
                    style : this.getStyleSize(mp.x, mp.y + lplus, mp.w, markerH.marker_line),
                    className : 'marker_div marker_line'
                }, baseDiv);
                div.style.left = mp.x + 'px';
                div.style.top  = (mp.y + lplus) + 'px';
                div.style.width  = mp.w + 'px';
                div.style.height = markerH.marker_line.h + 'px';
                if(this.movable && !this.readOnly){
                	this.eventHandles.push(dojo.connect(div, 'onmousedown', this, function(_e){
                        this.extraMouseDown(div, (_e ? _e : window.event));
                        return false;
                    }));
                	this.eventHandles.push(dojo.connect(div, 'onmouseup', this, function(_e){
                        this.extraMouseUp(div, (_e ? _e : window.event));
                    }));
                	this.eventHandles.push(dojo.connect(div, 'onmousemove', this, function(_e){
                        this.extraMouseMove(div, (_e ? _e : window.event));
                        return false;
                    }));
                }
                if(rt.from < whole.from){
                    whole.from = rt.from;
                }
                if(whole.to < rt.to){
                    whole.to = rt.to;
                }
            }
        }
        // 深夜時間帯のマーカーをセット
        if(!pattern.igonreNightWork){
            var workNightSpans = (dayObj[teasp.constant.C_REAL].realWorkNightSpans || []); // 深夜時間の表示は常にリアルで良い
            if(workNightSpans.length > 0){
                for(i = 0 ; i < workNightSpans.length ; i++){
                    t = workNightSpans[i];
                    o = this.calcPosWidth(t.from, t.to, this.widthPerH);
                    mp = this.calcMakerPos(o, absPos, this.marginLeft, posY);
                    if(mp){
                        var div = dojo.create('div', {
                            style : this.getStyleSize(mp.x, mp.y, mp.w, markerH.marker_night),
                            className : 'marker_div marker_night'
                        }, baseDiv);
                        div.style.left = mp.x + 'px';
                        div.style.top  = mp.y + 'px';
                        div.style.width  = mp.w + 'px';
                        div.style.height = markerH.marker_night.h + 'px';
                        div = null;
                    }
                }
            }
        }
    }else{ // 出社・退社のどちらかまたは両方入力なし
        // 休暇申請をマーカーに反映（半休、時間単位有休等）
        for(i = 0 ; i < dayObj.rack.validApplys.holidayTime.length ; i++){
            a = dayObj.rack.validApplys.holidayTime[i];
            o = this.calcPosWidth(a.startTime, a.endTime, this.widthPerH);
            mp = this.calcMakerPos(o, absPos, this.marginLeft, posY);
            if(mp){
                var markerId = this.createMarkerId();
                var div = dojo.create('div', { style: this.getStyleSize(mp.x, mp.y, mp.w, markerH.marker_work), className: 'marker_div ' + (a.holiday.type == teasp.constant.HOLIDAY_TYPE_PAID ? 'marker_work' : 'shadow_fix'), id: markerId }, baseDiv);
                div.style.left = mp.x + 'px';
                div.style.top  = mp.y + 'px';
                div.style.width  = mp.w + 'px';
                div.style.height = markerH.marker_work.h + 'px';
                markerIdList.push(markerId);
                div = dojo.create('div', { style: this.getStyleSize(mp.x, mp.y + lplus, mp.w, markerH.marker_line), className: 'marker_div marker_line' }, baseDiv);
                div.style.left = mp.x + 'px';
                div.style.top  = (mp.y + lplus) + 'px';
                div.style.width  = mp.w + 'px';
                div.style.height = markerH.marker_line.h + 'px';
                div = null;
            }
            if(typeof(st) != 'number' && typeof(et) != 'number'){
                for(r = 0 ; r < pattern.restTimes.length ; r++){
                    t = pattern.restTimes[r];
                    var oo = this.calcPosWidth((a.startTime <= t.from ? t.from : a.startTime), (t.to <= a.endTime ? t.to : a.endTime), this.widthPerH);
                    mp = this.calcMakerPos(oo, absPos, this.marginLeft, posY);
                    if(mp){
                        var markerId = this.createMarkerId();
                        var div = dojo.create('div', { style: this.getStyleSize(mp.x, mp.y, mp.w, markerH.marker_rest), className: 'marker_div marker_rest', id: markerId }, baseDiv);
                        div.style.left = mp.x + 'px';
                        div.style.top  = mp.y + 'px';
                        div.style.width  = mp.w + 'px';
                        div.style.height = markerH.marker_rest.h + 'px';
                        markerIdList.push(markerId);
                        div = null;
                    }
                }
            }
        }
    }
    var rests = [];
    for(i = 0 ; i < restTable.length ; i++){
        t = restTable[i];
//        var b = false;
//        for(var j = 0 ; j < dayObj.rack.validApplys.holidayTime.length ; j++){
//            a = dayObj.rack.validApplys.holidayTime[j];
//            if((a.startTime < t.from && t.from < a.endTime)
//            || (a.startTime < t.to   && t.to   < a.endTime)
//            || (t.from < a.startTime && a.endTime < t.to  )){
//                b = true;
//                var z = { from: t.from, to: t.to, type: t.type, moveflg: 2 };
//                if(z.from < a.startTime){
//                    rests.push({ from: z.from, to: a.startTime, type: t.type, moveflg: 1 });
//                    z.from = a.startTime;
//                }
//                if(a.endTime < z.to){
//                    rests.push({ from: a.endTime, to: z.to, type: t.type, moveflg: 1 });
//                    z.to = a.endTime;
//                }
//                if(z.from < z.to){
//                    rests.push(z);
//                }
//                break;
//            }
//        }
//        if(!b){
            rests.push(t);
//        }
    }
    // 休憩のマーカーをセット
//    if(minasi && (dayWrap.getDayType() == teasp.constant.DAY_TYPE_NORMAL || this.pouch.isRegulateHoliday(dayObj.rack.key))){
    if(minasi){
        rests = pattern.restTimes;
    }
    for(i = 0 ; i < rests.length ; i++){
        t = rests[i];
        var cn = this.typeStyleMap[t.type];
        if(!cn){
            continue;
        }
        if(t.type == this.TIME_TABLE_REST_FIX && typeof(st) != 'number' && typeof(et) != 'number'){
            continue;
        }
        var tt = (t.moveflg == 2 ? t : { from: t.from, to: t.to, type: t.type, moveflg: t.moveflg });
        if(worked
        && tt.moveflg != 2
        && (!this.pouch.isKeepExteriorTime() || teasp.logic.EmpTime.isFixRest(t, (pattern && pattern.restTimes)))){
            var rst = Math.min(whole.from, mixWork.from);
            var ret = Math.max(whole.to  , mixWork.to  );
            tt.from = (rst  <= t.from ? t.from : mixWork.from);
            tt.to   = (t.to <= ret    ? t.to   : mixWork.to  );
        }
        if(halfFix){
            if(!halfFix.from){
                tt.from = (tt.from < halfFix.to ? halfFix.to : tt.from);
            }else{
                tt.to   = (halfFix.from < tt.to ? halfFix.from : tt.to);
            }
        }
        if(tt.from >= tt.to){
            continue;
        }
        if(this.dialogMode && t.type == this.TIME_TABLE_REST_FIX){
            tt.from = t.from;
            tt.to   = t.to;
        }
        o = this.calcPosWidth(tt.from, tt.to, this.widthPerH);
        mp = this.calcMakerPos(o, absPos, this.marginLeft, posY);
        if(mp){
            var markerId = this.createMarkerId();
            var div = dojo.create('div', { className: 'marker_div ' + cn, id: markerId }, baseDiv);
            div.style.left = mp.x + 'px';
            div.style.top  = mp.y + 'px';
            div.style.width  = mp.w + 'px';
            div.style.height = markerH[cn].h + 'px';
            div.style.zIndex = markerH[cn].zIndex;
            markerIdList.push(markerId);
            if(t.type == teasp.constant.REST_FREE || t.type == teasp.constant.REST_FIX){
                this.restMarkers.push(markerId);
            }else if(t.type == teasp.constant.AWAY){
                this.awayMarkers.push(markerId);
            }
            if(t.temporary){
                this.tempMarker[markerId] = t.temporary;
            }
            if(this.movable && !this.readOnly && t.moveflg != 2){
                if(!this.restFix || t.type == teasp.constant.AWAY){
                    dojo.style(div, 'cursor', 'pointer');
                    this.eventHandles.push(dojo.connect(div, 'onmousedown', this, this.onMouseDown(div)));
                }
                this.eventHandles.push(dojo.connect(div, 'onmouseup'  , this, function(_e){ this.mouseUp(div, (_e ? _e : window.event)); }));
                this.eventHandles.push(dojo.connect(div, 'onmousemove', this, function(_e){ this.mouseMove(div, (_e ? _e : window.event)); return false; }));
                this.pMenu.bindDomNode(div.id);
                if(!this.restFix || t.type == teasp.constant.AWAY){
                    var w = (mp.w >= 9 ? Math.round(mp.w / 3) : 2);
                    var lDiv = dojo.create('div', { className: 'marker_div ' + cn, id: markerId + '-L' }, div);
                    lDiv.style.cursor = 'w-resize';
                    lDiv.style.left   = '0px';
                    lDiv.style.top    = '0px';
                    lDiv.style.width  = w + 'px';
                    lDiv.style.height = markerH[cn].h + 'px';
                    lDiv.style.zIndex = markerH[cn].zIndex;
                    this.eventHandles.push(dojo.connect(lDiv, 'onmousedown', this, this.onMouseDown(lDiv)));
                    var rDiv = dojo.create('div', { className: 'marker_div ' + cn, id: markerId + '-R' }, div);
                    rDiv.style.cursor = 'w-resize';
                    rDiv.style.left   = (mp.w - w) + 'px';
                    rDiv.style.top    = '0px';
                    rDiv.style.width  = w + 'px';
                    rDiv.style.height = markerH[cn].h + 'px';
                    rDiv.style.zIndex = markerH[cn].zIndex;
                    this.eventHandles.push(dojo.connect(rDiv, 'onmousedown', this, this.onMouseDown(rDiv)));
                }
            }
            div = null;
        }
    }
    if(this.clickedEvent && navigator.userAgent.indexOf('Mobile') < 0){ // モバイル端末では公用外出・休憩編集ダイアログを出さないようにする
        for(i = 0 ; i < markerIdList.length ; i++){
            t = dojo.byId(markerIdList[i]);
            this.eventHandles.push(dojo.connect(dojo.byId(markerIdList[i]), 'onclick', this.that, this.clickedEvent(dayObj.date)));
        }
    }
    if(this.movable){
        this.pMenu.getChildren()[0].setDisabled(this.readOnly || this.restFix || this.restMarkers.length >= this.REST_COUNT_MAX);
        this.pMenu.getChildren()[1].setDisabled(this.readOnly || this.awayMarkers.length >=  this.OUT_COUNT_MAX );
        this.pMenu.getChildren()[3].setDisabled(true);
    }

    if((!this.movable || this.readOnly) && !this.hideTimeGraphPopup){
        var flexMute = (this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX) && (this.pouch.isFlexGraph());
        // マーカー上にカーソルを持ってきたときにツールチップを出す
        try{
            var tip = this.getPatternTip(dayWrap, flexMute, montip);
            if(tip){
                var tId = this.TOOLTIP_ID_PREFIX + (++teasp.sequence.toolTip);
                new dijit.Tooltip({
                    connectId : markerIdList,
                    label     : tip,
                    position  : ['above'],
                    id        : tId
                });
                this.toolTips.push(tId);
            }
        }catch(e){
            console.log(e.message);
        }
    }
    baseDiv = null;
};

/**
 * 勤務パターンのツールチップのラベル
 *
 * @param {Object} dayWrap
 * @param {boolean} flexMute true:フレックスタイム制かつフレックスで日ごとの残業を表示する
 * @param {boolean=} montip trueならツールチップに月次サマリーを表示
 * @return {string} ツールチップのラベル
 */
teasp.helper.Graph.prototype.getPatternTip = function(dayWrap, flexMute, montip){
    var tip = dayWrap.getDaySummary();
    //------------------------------
    var content = '<table border="0" class="tip_table">';
    if(tip.discretionary
    || this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_MANAGER){
    	var c = '';
        if(tip.st || tip.et){
            c += '<tr><td colspan="2">' + teasp.message.getLabel('startEndTime_label') + '</td><td class="tip_right">' + (tip.st || '') + '-' + (tip.et || '') + '</td></tr>'; // 出退社時刻
        }
        if(tip.restSpan){
            c += '<tr><td colspan="2">' + teasp.message.getLabel('restTime_label') + '</td><td class="tip_right">' + tip.restSpan + '</td></tr>'; // 休憩時間
        }
        if(tip.workRealTime){
            c += '<tr><td colspan="2">' + teasp.message.getLabel('workRealTime_label') + '</td><td class="tip_right">' + teasp.util.time.timeValue(tip.workNetTime) + '</td></tr>'; // 実労働時間
        }
        if(tip.legalext || tip.nightTime){
            c += '<tr style="height:2px;"><td colspan="3"><hr style="border-style: solid none none none;border-width:1px;border-color:#888888;" /></td></tr>';
        }
        if(tip.legalext){
            c += '<tr><td><div class="tip_lext" ></div></td><td>' + teasp.message.getLabel('legalExtWorkTime_label') + '</td><td class="tip_right">' + teasp.util.time.timeValue(tip.legalext) + '</td></tr>'; // 法定時間外割増
        }
        if(tip.nightTime){
            c += '<tr><td><div class="tip_night"></div></td><td>' + teasp.message.getLabel('nightWorkEx_label') + '</td><td class="tip_right">' + teasp.util.time.timeValue(tip.nightTime) + '</td></tr>'; // 深夜労働割増
        }
        if(!c){
            return null;
        }
        content += c;
    }else{
        content += '<tr><td colspan="3">' + tip.title + '</td></tr>';
        content += '<tr><td><div class="tip_sfix"></div></td><td>' + tip.fixTimeTitle + '</td><td class="tip_right">' + tip.fixTimeSpan + '</td></tr>';
        if(this.pouch.getWorkSystem() == teasp.constant.WORK_SYSTEM_FLEX && tip.core){
            content += '<tr><td><div class="tip_sfix"></div></td><td>' + teasp.message.getLabel('coreTime_label') + '</td><td class="tip_right">' + tip.core + '</td></tr>';
        }
        if(tip.fixRestSpan){
            content += '<tr><td><div class="tip_rfix"></div></td><td>' + teasp.message.getLabel('fixRestTime_label') + '</td><td class="tip_right">' + tip.fixRestSpan + '</td></tr>'; // 所定休憩時間
        }
        if(tip.st || tip.et || (tip.holys && tip.holys.length) || tip.restSpan){
            content += '<tr style="height:2px;"><td colspan="3"><hr style="border-style: solid none none none;border-width:1px;border-color:#888888;" /></td></tr>';
        }
        if(tip.holys && tip.holys.length){
            for(var i = 0 ; i < tip.holys.length ; i++){
                content += '<tr><td colspan="3" style="color:red;">' + tip.holys[i].name + '</td></tr>';
            }
        }
        if(tip.st || tip.et){
            content += '<tr><td colspan="2">' + teasp.message.getLabel('startEndTime_label') + '</td><td class="tip_right">' + (tip.st || '') + '-' + (tip.et || '') + '</td></tr>'; // 出退社時刻
        }
        if(tip.restSpan){
            content += '<tr><td colspan="2">' + teasp.message.getLabel('restTime_label') + '</td><td class="tip_right">' + tip.restSpan + '</td></tr>'; // 休憩時間
        }
        if(tip.workWholeTime){
            content += '<tr><td colspan="2">' + teasp.message.getLabel('wholeTime_label') + '</td><td class="tip_right">' + teasp.util.time.timeValue(tip.workWholeTime) + '</td></tr>'; // 総労働時間
        }
        if(tip.workRealTime){
            content += '<tr><td colspan="2">' + teasp.message.getLabel('workRealTime_label') + '</td><td class="tip_right">' + teasp.util.time.timeValue(tip.workRealTime) + '</td></tr>'; // 実労働時間
        }
        if(tip.restTime){
            content += '<tr><td><div class="tip_rest" ></div></td><td>' + teasp.message.getLabel('tm10001220') + '</td><td class="tip_right">' + teasp.util.time.timeValue(tip.restTime) + '</td></tr>'; // 休憩時間合計
        }
        if(tip.workFixTime){
            content += '<tr><td><div class="tip_fixt" ></div></td><td>' + teasp.message.getLabel('workFixTime_label') + '</td><td class="tip_right">' + teasp.util.time.timeValue(tip.workFixTime) + '</td></tr>'; // 所定内労働
        }
        if(tip.legalzan){
            content += '<tr><td><div class="tip_lzan" ></div></td><td>' + (flexMute ? teasp.message.getLabel('tm10001230') : teasp.message.getLabel('legalOverTime_label')) + '</td><td class="tip_right">' + teasp.util.time.timeValue(tip.legalzan) + '</td></tr>'; // 8h未満の超過時間 or 法定時間内残業
        }
        if(tip.legalout){
            content += '<tr><td><div class="tip_lout" ></div></td><td>' + (flexMute ? teasp.message.getLabel('tm10001240') : teasp.message.getLabel('legalOutOverTime_label')) + '</td><td class="tip_right">' + teasp.util.time.timeValue(tip.legalout) + '</td></tr>'; // 8h以上の超過時間 or 法定時間外残業
        }
        if(tip.hwrkTime){
            content += '<tr><td><div class="tip_holy" ></div></td><td>' + teasp.message.getLabel('legalHolidayWorkTime_label') + '</td><td class="tip_right">' + teasp.util.time.timeValue(tip.hwrkTime) + '</td></tr>'; // 法定休日労働
        }
        if(tip.legalext || tip.nightTime){
            content += '<tr style="height:2px;"><td colspan="3"><hr style="border-style: solid none none none;border-width:1px;border-color:#888888;" /></td></tr>';
        }
        if(tip.legalext){
            content += '<tr><td><div class="tip_lext" ></div></td><td>' + teasp.message.getLabel('legalExtWorkTime_label') + '</td><td class="tip_right">' + teasp.util.time.timeValue(tip.legalext) + '</td></tr>'; // 法定時間外割増
        }
        if(tip.nightTime){
            content += '<tr><td><div class="tip_night"></div></td><td>' + teasp.message.getLabel('nightWorkEx_label') + '</td><td class="tip_right">' + teasp.util.time.timeValue(tip.nightTime) + '</td></tr>'; // 深夜労働割増
        }
        if(tip.awaySpan){
            content += '<tr style="height:2px;"><td colspan="3"><hr style="border-style: solid none none none;border-width:1px;border-color:#888888;" /></td></tr>';
            content += '<tr><td colspan="2">' + teasp.message.getLabel('awayInput_label') + '</td><td class="tip_right">' + tip.awaySpan + '</td></tr>'; // 公用外出
            if(tip.awayTime){
                content += '<tr><td><div class="tip_away" ></div></td><td>' + teasp.message.getLabel('tm10001250') + '</td><td class="tip_right">' + teasp.util.time.timeValue(tip.awayTime) + '</td></tr>'; // 公用外出合計
            }
        }
        if(montip){
            content += '<tr style="height:2px;"><td colspan="3"><hr style="border-style: solid none none none;border-width:1px;border-color:#888888;" /></td></tr>';
            content += '<tr><td colspan="3">' + teasp.message.getLabel('tm10001660', this.pouch.getYearMonthJp()) + '</td></tr>'; // {0}年{1}月度の集計
            var tipMon = this.pouch.getMonthSummary();
            for(var i = 0 ; i < tipMon.tipList.length ; i++){
                if(tipMon.tipList[i]){
                    content += '<tr><td colspan="2">' + tipMon.tipList[i].col + '</td><td class="tip_right">' + tipMon.tipList[i].val + '</td></tr>';
                }else{
                    content += '<tr style="height:2px;"><td colspan="3"><div style="height:2px;"></div></td></tr>';
                }
            }
        }
    }
    content += '</table>';
    return content;
};

/**
 * 時間を座標に変換
 *
 * @param {number} st 開始時間
 * @param {number} et 終了時間
 * @param {number} widthPerH １時間あたりの幅
 * @return {Object} 座標を持つオブジェクト
 */
teasp.helper.Graph.prototype.calcPosWidth = function(st, et, widthPerH){
    var begX = st * widthPerH / 60;
    var endX = et * widthPerH / 60;
    return { begX: begX, endX: endX };
};

/**
 * エリアに収まるようなX座標を求める
 *
 * @param {number} x X座標(1)
 * @param {number} xL X座標(2)
 * @param {number} width 幅(1)
 * @param {number} widthL 幅(2)
 * @param {number} areaWidth エリア幅
 * @return {number} X座標
 */
teasp.helper.Graph.prototype.calcBackPos = function(x, xL, width, widthL, areaWidth){
    if(widthL < areaWidth){
        // 大エリア内に収まる場合
        var pos = xL - ((areaWidth - widthL) / 2);
        return (pos < 0 ? 0 : pos);
    }else if(width < areaWidth){
        // 小エリア内に収まる場合
        var pos = x - ((areaWidth - width) / 2);
        return (pos < 0 ? 0 : pos);
    }else{
        // エリアに収まらない場合は終了時間が入るようにする
        return (x + width - areaWidth + 10);
    }
};

/**
 * エリアに収まるようなX座標を求める
 *
 * @param {number} x X座標(1)
 * @param {number} xL X座標(2)
 * @param {number} width 幅(1)
 * @param {number} widthL 幅(2)
 * @param {number} areaWidth エリア幅
 * @param {number} marginLeft 左マージン
 * @return {Object} 座標情報
 */
teasp.helper.Graph.prototype.calcAbsolutePos = function(x, xL, width, widthL, areaWidth, marginLeft){
    var backPos = this.calcBackPos(x, xL, width, widthL, areaWidth);
    backPos = Math.floor(backPos / 10) * 10 + marginLeft;    // 10刻みになるように丸め
    return { x: backPos, leftX: (backPos - marginLeft), rightX: (backPos - marginLeft + teasp.constant.GRAPH_AREA_WIDTH) };
};

/**
 * 座標を計算
 *
 * @param {Object} p 座標情報
 * @param {Object} ap 座標情報
 * @param {number} marginLeft 左マージン
 * @param {number} y Y座標
 * @return {Object} 座標情報
 */
teasp.helper.Graph.prototype.calcMakerPos = function(p, ap, marginLeft, y){
    if(ap){
        if(p.endX > ap.rightX){
            p.endX = ap.rightX;
        }
        if(p.begX < ap.leftX){
            p.begX = ap.leftX;
        }
        if(p.endX <= ap.leftX || ap.rightX <= p.begX || (p.endX - p.begX) <= 0){
            return null;
        }
    }
    var x = p.begX + marginLeft - (ap ? ap.x : 0);
    var w = p.endX - p.begX;
    var style = 'width:' + w + 'px;left:' + x + 'px;top:' + y + 'px;';
    if(w < 0){
        return null;
    }
    return { x: x, y: y, w: w, style: style };
};

/**
 * スタイル設定の書式に整形して返す
 *
 * @param {number} x X座標
 * @param {number} y Y座標
 * @param {number} w 幅
 * @param {Object} o 座標情報
 * @return {string} スタイル設定の書式の座標情報
 */
teasp.helper.Graph.prototype.getStyleSize = function(x, y, w, o){
    return 'left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;' + (o.h ? ('height:' + o.h + 'px;') : '') + (o.zIndex ? ('z-index:' + o.zIndex + ';') : '');
};

/**
 * dojo.style() の複数スタイル設定の書式に整形して返す
 *
 * @param {number} x X座標
 * @param {number} y Y座標
 * @param {number} w 幅
 * @param {Object} o 座標情報
 * @return {Object} 座標情報を持つオブジェクト
 */
teasp.helper.Graph.prototype.getStyleSize2 = function(x, y, w, o){
    var res = {
        left  : x + 'px',
        top   : y + 'px',
        width : w + 'px'
    };
    if(o.h){
        res.height = o.h + 'px';
    }
    if(o.zIndex){
        res.zIndex = o.zIndex;
    }
    return res;
};

/**
 * 【編集モード】ブロック要素追加（休憩 or 公用外出）
 *
 * @param {number} x X座標
 * @param {string} cn スタイルシートのセレクタ
 */
teasp.helper.Graph.prototype.insertDiv = function(x, cn){
    var baseDiv = dojo.byId(this.baseDivId);
    var markerH = this.markerSizeSet[this.sizeType];
    var markerId = this.createMarkerId();
    var mp = this.calcMakerPos({ begX: x, endX: x + this.widthPerH }, null, this.marginLeft, this.startY);
    var div = dojo.create('div', { className: 'marker_div ' + cn, id: markerId }, baseDiv);
    div.style.cursor = 'pointer';
    div.style.left   = mp.x + 'px';
    div.style.top    = mp.y + 'px';
    div.style.width  = mp.w + 'px';
    div.style.height = markerH[cn].h + 'px';
    div.style.zIndex = markerH[cn].zIndex;
    if(cn == 'marker_rest'){
        this.restMarkers.push(markerId);
    }else{
        this.awayMarkers.push(markerId);
    }
    this.eventHandles.push(dojo.connect(div, 'onmousedown', this, this.onMouseDown(div)));
    this.eventHandles.push(dojo.connect(div, 'onmouseup'  , this, function(_e){ this.mouseUp(div, (_e ? _e : window.event)); }));
    this.eventHandles.push(dojo.connect(div, 'onmousemove', this, function(_e){ this.mouseMove(div, (_e ? _e : window.event)); return false; }));
    this.pMenu.bindDomNode(div.id);
    var w = (mp.w >= 9 ? Math.round(mp.w / 3) : 2);
    var lDiv = dojo.create('div', { className: 'marker_div ' + cn, id: markerId + '-L' }, div);
    lDiv.style.cursor = 'w-resize';
    lDiv.style.left   = '0px';
    lDiv.style.top    = '0px';
    lDiv.style.width  = w + 'px';
    lDiv.style.height = markerH[cn].h + 'px';
    lDiv.style.zIndex = markerH[cn].zIndex;
    this.eventHandles.push(dojo.connect(lDiv, 'onmousedown', this, this.onMouseDown(lDiv)));
    var rDiv = dojo.create('div', { className: 'marker_div ' + cn, id: markerId + '-R' }, div);
    rDiv.style.cursor = 'w-resize';
    rDiv.style.left   = (mp.w - w) + 'px';
    rDiv.style.top    = '0px';
    rDiv.style.width  = w + 'px';
    rDiv.style.height = markerH[cn].h + 'px';
    rDiv.style.zIndex = markerH[cn].zIndex;
    this.eventHandles.push(dojo.connect(rDiv, 'onmousedown', this, this.onMouseDown(rDiv)));
    if(cn == 'marker_rest'){
        this.pMenu.getChildren()[0].setDisabled(this.readOnly || this.restMarkers.length >= this.REST_COUNT_MAX);
    }else{
        this.pMenu.getChildren()[1].setDisabled(this.readOnly || this.awayMarkers.length >=  this.OUT_COUNT_MAX );
    }
    this.focus(div.id);
    this.movedRefresh();
};

/**
 * 【編集モード】ブロック要素削除（休憩 or 公用外出）
 *
 */
teasp.helper.Graph.prototype.deleteFocusDiv = function(){
    var id = this.getFocusId();
    if(!id){
        return;
    }
    for(var i = 0 ; i < this.restMarkers.length ; i++){
        if(this.restMarkers[i] == id){
            this.restMarkers.splice(i, 1);
            break;
        }
    }
    for(var i = 0 ; i < this.awayMarkers.length ; i++){
        if(this.awayMarkers[i] == id){
            this.awayMarkers.splice(i, 1);
            break;
        }
    }
    if(this.tempMarker[id]){
        delete this.tempMarker[id];
    }
    dojo.destroy(dojo.byId(id));
    this.pMenu.getChildren()[3].setDisabled(true);
};

/**
 * 【編集モード】休憩の移動 or 削除をしたので再計算・再表示
 *
 */
teasp.helper.Graph.prototype.movedRefresh = function(){
    var baseDiv = dojo.byId(this.baseDivId);
    var markerH = this.markerSizeSet[this.sizeType];
    this.recalc();
    var i;
    // 法定内残業、法定外残業、休日出勤、割増のマーカーをセット
    var calcMode = this.pouch.getCalcMode();
    if(this.dialogMode && calcMode == teasp.constant.C_DISC){ // 編集モードなら強制的に実時間モード
        calcMode = teasp.constant.C_REAL;
    }
    var spans = [];
    for(i = 0 ; i < this.targetDayObj[calcMode].workLegalOverSpan.length ; i++){ // 法定内残業
        spans.push({
            span : this.targetDayObj[calcMode].workLegalOverSpan[i],
            key  : this.TIME_TABLE_LZAN
        });
    }
    for(i = 0 ; i < this.targetDayObj[calcMode].workLegalOutOverSpan.length ; i++){ // 法定外残業
        spans.push({
            span : this.targetDayObj[calcMode].workLegalOutOverSpan[i],
            key  : this.TIME_TABLE_LOUT
        });
    }
    for(i = 0 ; i < this.targetDayObj[calcMode].workChargeSpan.length ; i++){ // 法定時間外割増
        spans.push({
            span : this.targetDayObj[calcMode].workChargeSpan[i],
            key  : this.TIME_TABLE_CHARGE
        });
    }
    for(i = 0 ; i < spans.length ; i++){
        var tt = spans[i].span;
        var cn = this.typeStyleMap[spans[i].key];
        var n = this.impactMakers[cn];
        if(tt){
            var o = this.calcPosWidth(tt.from, tt.to, this.widthPerH);
            var mp = this.calcMakerPos(o, null, this.marginLeft, this.startY);
            if(mp){
                if(!n){
                    var markerId = this.createMarkerId();
                    var div = dojo.create('div', { style: this.getStyleSize(mp.x, mp.y, mp.w, markerH[cn]), className: 'marker_div ' + cn, id: markerId }, baseDiv);
                    div.style.left   = mp.x + 'px';
                    div.style.top    = mp.y + 'px';
                    div.style.width  = mp.w + 'px';
                    div.style.height = markerH[cn].h + 'px';
                    n = this.impactMakers[cn] = markerId;
                }else{
                    dojo.style(n, this.getStyleSize2(mp.x, mp.y, mp.w, markerH[cn]));
                }
            }
            dojo.style(n, 'display', (mp ? '' : 'none'));
        }else if(n){
            dojo.style(n, 'display', 'none');
        }
    }
};

/**
 * 【編集モード】再計算
 *
 */
teasp.helper.Graph.prototype.recalc = function(){
    var rests = [];
    var aways = [];
    for(var i = 0 ; i < this.restMarkers.length ; i++){
        if(this.tempMarker[this.restMarkers[i]]){
            continue;
        }
        var div = dojo.byId(this.restMarkers[i]);
        var x1 = div.offsetLeft;
        var x2 = x1 + div.offsetWidth - (dojo.hasClass(div, 'marker_focus') ? 2 : 0);
        var o = {
            from : this.pixel2time(x1 - this.marginLeft),
            to   : this.pixel2time(x2 - this.marginLeft)
        };
        rests.push(o);
    }
    for(var i = 0 ; i < this.awayMarkers.length ; i++){
        if(this.tempMarker[this.awayMarkers[i]]){
            continue;
        }
        var div = dojo.byId(this.awayMarkers[i]);
        var x1 = div.offsetLeft;
        var x2 = x1 + div.offsetWidth - (dojo.hasClass(div, 'marker_focus') ? 2 : 0);
        var o = {
            from : this.pixel2time(x1 - this.marginLeft),
            to   : this.pixel2time(x2 - this.marginLeft),
            type : this.TIME_TABLE_AWAY
        };
        aways.push(o);
    }
    this.targetDayObj.rack.fixRests = rests;
    teasp.manager.recalcOneDay(this.pouch, this.targetDayObj);
};

/**
 * 【編集モード】休憩時間の配列を返す
 *
 * @return {Array.<Object>} 休憩時間の配列
 */
teasp.helper.Graph.prototype.getRests = function(){
    var rests = [];
    for(var i = 0 ; i < this.restMarkers.length ; i++){
        var o = this.tempMarker[this.restMarkers[i]];
        if(o){
            rests.push(o);
            continue;
        }
        var div = dojo.byId(this.restMarkers[i]);
        var x1 = div.offsetLeft;
        var x2 = x1 + div.offsetWidth - (dojo.hasClass(div, 'marker_focus') ? 2 : 0);
        rests.push({
            from : this.pixel2time(x1 - this.marginLeft),
            to   : this.pixel2time(x2 - this.marginLeft)
        });
    }
    return rests;
};

/**
 * 【編集モード】公用外出時間の配列を返す
 *
 * @return {Array.<Object>} 公用外出時間の配列
 */
teasp.helper.Graph.prototype.getAways = function(){
    var aways = [];
    for(var i = 0 ; i < this.awayMarkers.length ; i++){
        var o = this.tempMarker[this.awayMarkers[i]];
        if(o){
            aways.push(o);
            continue;
        }
        var div = dojo.byId(this.awayMarkers[i]);
        var x1 = div.offsetLeft;
        var x2 = x1 + div.offsetWidth - (dojo.hasClass(div, 'marker_focus') ? 2 : 0);
        aways.push({
            from : this.pixel2time(x1 - this.marginLeft),
            to   : this.pixel2time(x2 - this.marginLeft),
            type : this.TIME_TABLE_AWAY
        });
    }
    return aways;
};

/**
 * 【編集モード】ポップアップメニューを構築
 *
 */
teasp.helper.Graph.prototype.loadMenu = function(){
	this.unloadMenu();
    this.pMenu = new dijit.Menu({
        targetNodeIds : ["editTable"],
        style         : "font-size:12px;z-index:1000;",
        refocus       : false
    });
    var that = this;
    this.pMenu.addChild(new dijit.MenuItem({
        label: teasp.message.getLabel('tm10001210'), // 休憩の挿入
        onClick: function(_e) {
            var e = _e ? _e : window.event;
            var x = (e.pageX || e.x) - that.getAreaLeft() + dojo.byId('editTimeView').scrollLeft;
            that.insertDiv(that.roundTime(x), 'marker_rest');
        }
    }));
    this.pMenu.addChild(new dijit.MenuItem({
        label: teasp.message.getLabel('tm10001260'), // 公用外出の挿入
        onClick: function(_e) {
            var e = _e ? _e : window.event;
            var x = (e.pageX || e.x) - that.getAreaLeft() + dojo.byId('editTimeView').scrollLeft;
            that.insertDiv(that.roundTime(x), 'marker_away');
        }
    }));
    this.pMenu.addChild(new dijit.MenuSeparator());
    this.pMenu.addChild(new dijit.MenuItem({
        label: teasp.message.getLabel('delete_btn_title'), // 削除
        onClick: function(_e) {
            that.deleteFocusDiv();
            that.movedRefresh();
        }
    }));
    this.pMenu.startup();
};

teasp.helper.Graph.prototype.unloadMenu = function(){
    if(this.pMenu){
        this.pMenu.destroyDescendants();
        this.pMenu.destroyRecursive();
        this.pMenu.domNode = null;
        delete this.pMenu;
        this.pMenu = null;
    }
};

/**
 * 【編集モード】マウスボタンを押下
 *
 * @param {Object} _div ＤＯＭ要素
 */
teasp.helper.Graph.prototype.onMouseDown = function(_div){
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
        var match = /^(.+)-([LR])$/.exec(id);
        if(match){
            id = match[1];
            face = (match[2] == 'L' ? -1 : 1);
        }
        var div = dojo.byId(id);

        var x = div.offsetLeft;
        var w = div.offsetWidth - (dojo.hasClass(div, 'marker_focus') ? 2 : 0);
        this.dragObj = {
            id    : div.id,
            left  : div.offsetLeft,
            x     : (e.pageX || e.x),
            w     : div.offsetWidth,
            face  : face,
            x1    : x,
            x2    : (x + w),
            from  : this.pixel2time(x - this.marginLeft),
            to    : this.pixel2time((x + w) - this.marginLeft),
            minW  : this.minW
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
teasp.helper.Graph.prototype.mouseMove = function(_div, e){
    if(!this.dragObj){
        return;
    }
    var div = dojo.byId(this.dragObj.id);
    var x = (e.pageX || e.x);
    var l = div.offsetLeft;
    var w = this.dragObj.w;
    var inf = dojo.clone(this.dragObj);
    var maxTime = (this.widthPerH * 48);
    if(x != this.dragObj.x){
        var old = {
            x1: inf.x1,
            x2: inf.x2
        };
        var tmpx1 = (this.dragObj.face <= 0 ? this.dragObj.left + (x - this.dragObj.x) : l);
        if(inf.x1 != tmpx1){
            inf.x1 = this.roundTime(tmpx1);
        }
        if(inf.x1 < this.marginLeft){
            inf.x1 = this.marginLeft;
        }
        if(this.dragObj.face !== 0){
            if(this.dragObj.face < 0){
                w = inf.x2 - inf.x1;
                if(w < inf.minW){
                    return;
                }
                div.style.left = inf.x1 + 'px';
            }else{
                w = this.roundTime(Number(this.dragObj.w) + (x - this.dragObj.x));
                w -= (inf.x1 - this.roundTime(tmpx1));
                if(w < inf.minW){
                    return;
                }
                inf.x2 = inf.x1 + w;
            }
            if(inf.x2 > (maxTime + this.marginLeft)){
                inf.x2 = maxTime + this.marginLeft;
                w = inf.x2 - inf.x1;
            }
            div.style.width = w + 'px';
            var ew = (w >= 9 ? Math.round(w / 3) : 2);

            dojo.byId(div.id + '-L').style.width = ew + 'px';
            dojo.byId(div.id + '-R').style.width = ew + 'px';
            dojo.byId(div.id + '-R').style.left = (w - ew) + 'px';

            if(inf.x1 != old.x1){
                inf.from = this.pixel2time(inf.x1 - this.marginLeft);
            }
            if(inf.x2 != old.x2){
                inf.to   = this.pixel2time(inf.x2 - this.marginLeft);
            }
        }else{
            inf.x2 = inf.x1 + w;
            if(inf.x2 > (maxTime + this.marginLeft)){
                inf.x1 = (maxTime + this.marginLeft) - w;
            }
            div.style.left = inf.x1 + 'px';
            var span = inf.to - inf.from;
            inf.from = this.pixel2time(inf.x1 - this.marginLeft);
            inf.to   = inf.from + span;
        }
        if(dojo.hasClass(div, 'marker_rest')){
            this.movedRefresh();
        }
        if(this.tempMarker[div.id]){
            delete this.tempMarker[div.id];
        }
    }
    if(this.movable && !this.readOnly){
        l = (this.dragObj.face > 0 ? (inf.x2 - this.widthPerH) : inf.x1);
        var sx = (x - e.clientX + 1);
        if(l < sx){
            l = sx;
        }
        dojo.byId('movetime').style.top = '82px';
        dojo.byId('movetime').style.left = l + 'px';
        if(dojo.hasClass(div, 'marker_away')){
            dojo.byId('movec1').innerHTML = teasp.message.getLabel('awayInput_label'); // 公用外出
            dojo.byId('movetime').style.backgroundColor = '#83BDED';
        }else if(dojo.hasClass(div, 'marker_rest')){
            dojo.byId('movec1').innerHTML = teasp.message.getLabel('rest_head'); // 休憩
            dojo.byId('movetime').style.backgroundColor = '#1A69AB';
        }
        dojo.byId('movev1').innerHTML = teasp.util.time.timeValue(inf.from);
        dojo.byId('movev2').innerHTML = teasp.util.time.timeValue(inf.to);
        dojo.byId('movetime').style.display = 'block';
        this.eventHandles.push(dojo.connect(dojo.byId('movetime'), 'onmouseup', this, function(_e){ this.dragOff(); }));
    }
};

/**
 * 【編集モード】マウスアップ
 *
 * @param {Object} div ＤＯＭ要素
 * @param {Object} e イベント
 */
teasp.helper.Graph.prototype.mouseUp = function(div, e){
    this.dragOff();
};

/**
 * 【編集モード】（対象マーカー外で）マウスダウン
 *
 * @param {Object} table ＤＯＭ要素
 * @param {Object} e イベント
 */
teasp.helper.Graph.prototype.extraMouseDown = function(table, e){
    this.dragOff();
    this.focus(null);
};

/**
 * 【編集モード】（対象マーカー外で）マウス移動
 *
 * @param {Object} table テーブル要素
 * @param {Object} e イベント
 */
teasp.helper.Graph.prototype.extraMouseMove = function(table, e){
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
teasp.helper.Graph.prototype.extraMouseUp = function(table, e){
    this.dragOff();
};

/**
 * 【編集モード】ドラッグをオフにする
 */
teasp.helper.Graph.prototype.dragOff = function(){
    this.dragObj = null;
    dojo.byId('movetime').style.display = 'none';
};

/**
 * 【編集モード】フォーカスをセット
 *
 * @param {?string} markerId マーカーID
 */
teasp.helper.Graph.prototype.focus = function(markerId){
    dojo.query('.marker_focus').forEach(function(elem){
        if(!markerId || elem.id != markerId){
            dojo.removeClass(elem, 'marker_focus');
        }
    });
    if(markerId){
        var d = dojo.byId(markerId);
        var zIndex = 0;
        var flag = false;
        if(dojo.hasClass(d, 'marker_rest')){
            zIndex = this.getMaxZindex('marker_rest');
            flag = (this.restFix ? true : false);
        }else if(dojo.hasClass(d, 'marker_away')){
            zIndex = this.getMaxZindex('marker_away');
        }
        if(zIndex){
            d.style.zIndex = zIndex + 1;
        }
        dojo.addClass(d, 'marker_focus');
        this.pMenu.getChildren()[3].setDisabled(flag);
    }else{
        this.pMenu.getChildren()[3].setDisabled(true);
    }
};

/**
 * 【編集モード】今フォーカスを持っている要素を取得
 *
 * @return {string} 要素ID
 */
teasp.helper.Graph.prototype.getFocusId = function(){
    var id = null;
    dojo.query('.marker_focus').forEach(function(elem){
        id = elem.id;
    });
    return id;
};

/**
 * 【編集モード】同種類の要素内で z-index 値の最大値を得る
 *
 * @param {string} key キー
 * @return {number} z-index 値の最大値
 */
teasp.helper.Graph.prototype.getMaxZindex = function(key){
    var zIndex = 0;
    dojo.query('.' + key).forEach(function(elem){
        var zi = parseInt(elem.style.zIndex, 10);
        if(zIndex < zi){
            zIndex = zi;
        }
    });
    return zIndex;
};

/**
 * 【編集モード】座標のオフセット値を得る
 *
 * @return {number} 座標のオフセット値
 */
teasp.helper.Graph.prototype.getAreaLeft = function(){
    return dojo.byId('editTimeDialog').offsetLeft + dojo.byId('editTimeArea').offsetLeft + this.marginLeft;
};

/**
 * 【編集モード】座標を丸める.<br/>
 * 5,10,15分刻みで座標が変わるようにしたいのでピクセルの値を丸めた値にして返す<br/>
 * ※60分＝48ピクセルの場合、5分=4ピクセル、10分=8ピクセル、15分=12ピクセル
 *
 * @param {number} n 丸め対象の値
 * @return {number} 丸め後の値
 */
teasp.helper.Graph.prototype.roundTime = function(n){
    return Math.floor(n / this.minW) * this.minW;
};

/**
 * 【編集モード】ピクセルを時間に換算
 *
 * @return {number} 時間
 */
teasp.helper.Graph.prototype.pixel2time = function(p){
    return Math.round(p * 60 / this.widthPerH);
};

/**
 * 【編集モード】対象の dayObj を返す
 *
 * @return {Object} 対象の dayObj
 */
teasp.helper.Graph.prototype.getDayObj = function(){
    return this.targetDayObj;
};

/**
 * teasp.util.time.excludeRanges() を使いたいが、オブジェクト内の
 * from, to 以外の要素が消えてしまうため、補填する
 */
teasp.helper.Graph.excludeRanges = function(rests, excludes){
    var lst = [];
    for(var i = 0 ; i < rests.length ; i++){
        var o = rests[i];
        var nres = teasp.util.time.excludeRanges([o], excludes);
        if(nres.length > 0){
            for(var k in o){
                if(!o.hasOwnProperty(k) || k == 'from' || k == 'to'){
                    continue;
                }
                for(var x = 0 ; x < nres.length ; x++){
                    nres[x][k] = o[k];
                }
            }
            lst = lst.concat(nres);
        }
    }
    return lst;
};
