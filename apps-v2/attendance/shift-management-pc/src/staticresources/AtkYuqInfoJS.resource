//******************************************************************************
// グローバル変数
if(!ATK){
    var ATK = {};
}
if(!ATK.view){
    ATK.view = {};

    // 日付
    var DATE_FORM_SLASH = 1;    // YYYY/MM/DD
    var DATE_FORM_SIMPLE = 2;   // MM/DD
}
var DATE_FORM_OBJECT = 4;   // Dateオブジェクトで返す

/**
 * 有休残日数リスト
 *
 * @param {Array.<Object>} yuqRemains 有休情報の配列
 * @param {(Object|string)=} dt 日付（省略可。文字列の場合は 'yyyy-MM-dd'）
 * @return {Object}
 */
ATK.view.YuqList = function(yuqRemains, dt){
    var yuqList = [];
    var provides = [];
    var bdrDt = dt;
    if(typeof(bdrDt) != 'string'){
        try{
            bdrDt = dojo.date.locale.format(dt, { datePattern:'yyyy-MM-dd', selector:'date' });
        }catch(e){
            bdrDt = null;
        }
    }
    for(var i = 0 ; i < yuqRemains.length ; i++){
        yuqList.push(ATK.view.YuqInfo(yuqRemains[i], bdrDt));
    }
    yuqList.sort(function(a, b){ return a.getSdNum() - b.getSdNum(); });

    var init = function(){
        for(var i = 0 ; i < yuqList.length ; i++){
            var yuqInfo = yuqList[i];
            if(!yuqInfo.isRemain()){
                continue;
            }
            if(yuqInfo.isRemain()){
                provides.push({
                    str        : teasp.message.getLabel('tk10003750', yuqInfo.getDate(DATE_FORM_SLASH), yuqInfo.getRemain()), // {0} 付与分({1})
                    index      : i
                });
            }
        }
    };

    // レコード数
    var size = function(){
        return yuqList.length;
    };

    var getByIndex = function(index){
        return yuqList[index];
    };

    // 残日数表記文字列を返す
    var getDspRemain = function(dt){
        var hon = {days:0, time:0};
        var dspRemain = '';
        for(var i = 0 ; i < yuqList.length ; i++){
            var yuqInfo = yuqList[i];
            if(dojo.date.compare(dt, yuqInfo.getLimitDate(DATE_FORM_OBJECT)) >= 0){ // dt は失効日以降の日付
                continue;
            }
            if(dojo.date.compare(dt, yuqInfo.getStartDate(DATE_FORM_OBJECT)) < 0){ // dt は有効開始日より前の日付
                continue;
            }
            hon.days += yuqInfo.getRemainDays();
            hon.time += yuqInfo.getRemainTime();
        }
        dspRemain = teasp.message.getLabel('tk10005151', '' + hon.days) // 日
                    + (hon.time > 0 ? (' + ' + ATK.util.timeValue(hon.time)) : '');
        return dspRemain;
    };

    // 有効な付与単位内の合計の付与日数
    var getProvide = function(flag){
        var provideDays = 0;
        var provideTime = 0;
        for(var i = 0 ; i < yuqList.length ; i++){
            var yuqInfo = yuqList[i];
            if(!flag && !yuqInfo.isRemain()){
                continue;
            }
            provideDays += yuqInfo.getProvideDays();
            provideTime += yuqInfo.getProvideTime();
        }
        return teasp.message.getLabel('tk10005151', '' + provideDays) // 日
                + (provideTime > 0 ? ('+' + ATK.util.timeValue(provideTime)) : '');
    };

    // 有効な付与単位内の合計の消化日数
    var getSpend = function(flag){
        var spendDays = 0;
        var spendTime = 0;
        for(var i = 0 ; i < yuqList.length ; i++){
            var yuqInfo = yuqList[i];
            if(!flag && !yuqInfo.isRemain()){
                continue;
            }
            spendDays += yuqInfo.getSpendDays();
            spendTime += yuqInfo.getSpendTime();
        }
        return teasp.message.getLabel('tk10005151', '' + spendDays) // 日
                + (spendTime > 0 ? ('+' + ATK.util.timeValue(spendTime)) : '');
    };

    // 有効な付与単位内の合計の残日数
    var getRemain = function(flag){
        var remainDays = 0;
        var remainTime = 0;
        var lastBaseTime = 0;
        for(var i = 0 ; i < yuqList.length ; i++){
            var yuqInfo = yuqList[i];
            if(!flag && !yuqInfo.isRemain()){
                continue;
            }
            remainDays += yuqInfo.getRemainDays();
            if(yuqInfo.getRemainTime() > 0){
                remainTime += yuqInfo.getRemainTime();
            }
            lastBaseTime = yuqInfo.getBaseTime();
        }
        var d = remainDays;
        var h = remainTime;
        return teasp.message.getLabel('tk10005151', '' + d) // 日
                + (h > 0 ? ('+' + ATK.util.timeValue(h)) : '');
    };

    var getRecords = function(){
        var yuqRecords = [];
        for(var i = 0 ; i < yuqList.length ; i++){
            var yuqInfo = yuqList[i];
            if(!yuqInfo.isRemain()){
                continue;
            }
            yuqRecords.push({
                date        : yuqInfo.getDate(DATE_FORM_SLASH),
                provideDays : yuqInfo.getProvide(),
                spendDays   : yuqInfo.getSpend(),
                remainDays  : yuqInfo.getRemain(),
                autoFlag    : yuqInfo.isAuto(),
                startDate   : yuqInfo.getStartDate(DATE_FORM_SLASH),
                limitDate   : yuqInfo.getLimitDate(DATE_FORM_SLASH),
                subject     : yuqInfo.getSubject()
            });
        }
        yuqRecords.push({
            date        : teasp.message.getLabel('total_label'), // 合計
            provideDays : '',
            spendDays   : '',
            remainDays  : getRemain(),
            startDate   : '',
            limitDate   : '',
            autoFlag    : '',
            subject     : ''
        });
        return yuqRecords;
    };

    var getRemainInfo = function(index){
        var yuqInfo = (index < yuqList.length ? yuqList[index] : null);
        return {
            id       : (yuqInfo ? yuqInfo.getId() : null),
            baseTime : (yuqInfo ? yuqInfo.getBaseTime() : 0),
            minutes  : (yuqInfo ? yuqInfo.getRemainMinutes() : 0)
        }
    };

    var getProvideNames = function(){
        return provides;
    };

    init();

    return {
        size            : size,
        getByIndex      : getByIndex,
        getDspRemain    : getDspRemain,
        getProvide      : getProvide,
        getSpend        : getSpend,
        getRemain       : getRemain,
        getRecords      : getRecords,
        getProvideNames : getProvideNames,
        getRemainInfo   : getRemainInfo
    };
}; // ATK.view.YuqList

/**
 * 有休残日数情報
 *
 * @param {Object} _yuqRemain 有休情報
 * @param {string=} _bdrDt 日付（省略可。'yyyy-MM-dd'）
 * @return {Object}
 */
ATK.view.YuqInfo = function(_yuqRemain, _bdrDt){
    var yr    = _yuqRemain;
    var bdrDt = _bdrDt;
    var startDate, limitDate, proviDate;
    var sdNum = 0;

    var init = function(){
        proviDate = (yr.date      ? dojo.date.locale.parse(yr.date     , {datePattern:'yyyy-M-d', selector:'date'}) : null);
        startDate = (yr.startDate ? dojo.date.locale.parse(yr.startDate, {datePattern:'yyyy-M-d', selector:'date'}) : null);
        limitDate = (yr.limitDate ? dojo.date.locale.parse(yr.limitDate, {datePattern:'yyyy-M-d', selector:'date'}) : null);
        sdNum = startDate.getFullYear() * 10000 + (startDate.getMonth() + 1) * 100 + startDate.getDate();
        if((yr.remainTime % 60) && yr.remainDays > 0 && (yr.baseTime % 60) > 0){
            yr.remainDays -= 0.5;
            yr.remainTime += (yr.baseTime / 2);
        }
    };

    var getId = function(){
        return yr.id;
    };

    var getBaseTime = function(){
        return yr.baseTime;
    };

    // 事柄
    var getSubject = function(){
        var subj = (yr.subject || '').entitize();
        if(!isValid() && isRemain()){
            subj += teasp.message.getLabel('tk10005130', getRemain(true)); // （失効日数：{0}）
        }
        return subj;
    };

    // 発生日
    var getDate = function(mode){
        if(!mode){
            return yr.date;
        }else if(mode == DATE_FORM_OBJECT){
            return proviDate;
        }else{ // DATE_FORM_SLASH
            return dojo.date.locale.format(proviDate, DATE_FORM_S);
        }
    };

    // 有効開始日
    var getStartDate = function(mode){
        if(!mode){
            return yr.startDate;
        }else if(mode == DATE_FORM_OBJECT){
            return startDate;
        }else{ // DATE_FORM_SLASH
            return dojo.date.locale.format(startDate, DATE_FORM_S);
        }
    };

    // 失効日
    var getLimitDate = function(mode){
        if(!mode){
            return yr.limitDate;
        }else if(mode == DATE_FORM_OBJECT){
            return limitDate;
        }else{ // DATE_FORM_SLASH
            return dojo.date.locale.format(limitDate, DATE_FORM_S);
        }
    };

    var getDateRange = function(){
        return dojo.date.locale.format(startDate, DATE_FORM_S)
        + teasp.message.getLabel('wave_label') // ～
        + dojo.date.locale.format(dojo.date.add(limitDate, 'day', -1), DATE_FORM_S);
    };

    // 付与日数（日）
    var getProvideDays = function(){
        return yr.provideDays;
    };

    // 付与日数（分）
    var getProvideTime = function(){
        return yr.provideTime;
    };

    // 消化日数（日）
    var getSpendDays = function(){
        return yr.spendDays;
    };

    // 消化日数（分）
    var getSpendTime = function(){
        return yr.spendTime;
    };

    // 残日数（日）
    var getRemainDays = function(flag){
        if(!flag && !isValid()){
            return 0;
        }
        return yr.remainDays;
    };

    // 残日数（分）
    var getRemainTime = function(flag){
        if(!flag && !isValid()){
            return 0;
        }
        return yr.remainTime;
    };

    // 残日数（分）
    var getRemainMinutes = function(){
        return (yr.remainDays * yr.baseTime + yr.remainTime);
    };

    // 付与日数
    var getProvide = function(){
        if(yr.provideDays > 0){
            return teasp.message.getLabel('tk10005151', '' + yr.provideDays) // 日
                    + (yr.provideTime > 0 ? ('+' + ATK.util.timeValue(yr.provideTime)) : '');
        }
        return ATK.util.timeValue(yr.provideTime);
    };

    // 消化日数
    var getSpend = function(){
        if(yr.spendDays === 0 && yr.spendTime === 0){
            return '-';
        }
        if(yr.spendDays > 0){
            return teasp.message.getLabel('tk10005151', '' + yr.spendDays) // 日
                    + (yr.spendTime > 0 ? ('+' + ATK.util.timeValue(yr.spendTime)) : '');
        }
        return ATK.util.timeValue(yr.spendTime);
    };

    // 残日数
    var getRemain = function(flag){
        if(!flag && !isValid()){
            return teasp.message.getLabel('tm10010710'); // 失効
        }
        if(yr.remainDays > 0){
            return teasp.message.getLabel('tk10005151', '' + yr.remainDays) // 日
                    + (yr.remainTime > 0 ? ('+' + ATK.util.timeValue(yr.remainTime)) : '');
        }
        return ATK.util.timeValue(yr.remainTime);
    };

    // 仮付与フラグ
    var isTemp = function(){
        return yr.tempFlag;
    };

    // 自動付与フラグ
    var isAuto = function(){
        return yr.autoFlag;
    };

    // 取得義務対象外フラグ
    var isNotObligatoryFlag = function(){
        return yr.notObligatoryFlag || false;
    };

    // 取得義務対象外フラグの更新
    var setNotObligatoryFlag = function(flag){
        yr.notObligatoryFlag = flag;
    };

    // 残日数があるか
    var isRemain = function(){
        return (yr.remainDays > 0 || yr.remainTime > 0);
    };

    // 失効日が bdrDt 以前の場合、失効と判定
    var isValid = function(){
        if(bdrDt && yr.limitDate && yr.limitDate <= bdrDt){
            return false;
        }
        return true;
    };

    var getSdNum = function(){
        return sdNum;
    };

    init();

    return {
        getId                 : getId,
        getSubject            : getSubject,
        getDate               : getDate,
        getStartDate          : getStartDate,
        getLimitDate          : getLimitDate,
        getDateRange          : getDateRange,
        getProvideDays        : getProvideDays,
        getProvideTime        : getProvideTime,
        getSpendDays          : getSpendDays,
        getSpendTime          : getSpendTime,
        getRemainDays         : getRemainDays,
        getRemainTime         : getRemainTime,
        getRemainMinutes      : getRemainMinutes,
        getProvide            : getProvide,
        getSpend              : getSpend,
        getRemain             : getRemain,
        getBaseTime           : getBaseTime,
        isTemp                : isTemp,
        isAuto                : isAuto,
        isRemain              : isRemain,
        getSdNum              : getSdNum,
        isNotObligatoryFlag   : isNotObligatoryFlag,
        setNotObligatoryFlag  : setNotObligatoryFlag
    };
}; // ATK.view.YuqInfo

/**
 * 有休履歴リスト
 *
 * @param {Array.<Object>} _yuqHistorys 有休履歴の配列
 * @return {Object}
 */
ATK.view.YuqHistorys = function(_yuqHistorys){
    var yuqHistorys = [];
    for(var i = 0 ; i < _yuqHistorys.length ; i++){
        yuqHistorys.push(ATK.view.YuqHistory(_yuqHistorys[i]));
    }

    var getRecords = function(){
        var yuqRecords = [];
        for(var i = 0 ; i < yuqHistorys.length ; i++){
            var yuqInfo = yuqHistorys[i];
            yuqRecords.push({
                date        : yuqInfo.getDate(),
                provideDays : yuqInfo.getProvide(),
                spendDays   : yuqInfo.getSpend(),
                subject     : yuqInfo.getSubject(),
                note        : yuqInfo.getNote()
            });
        }
        return yuqRecords.sort(function(a, b){
            return (a.date == b.date ? 0 : (a.date < b.date ? -1 : 1));
        });
    };

    return {
        getRecords   : getRecords
    };
}; // ATK.view.YuqHistorys

/**
 * 有休履歴
 *
 * @param {Object} _yuqHistory 有休履歴
 * @return {Object}
 */
ATK.view.YuqHistory = function(_yuqHistory){
    var yh = _yuqHistory;

    // 事柄
    var getSubject = function(){
        var subj = (yh.subject || '').entitize();
        return subj;
    };

    // 発生日
    var getDate = function(mode){
        var dt = (((yh.totalTime > 0 || yh.realProvideDays > 0) && yh.startDate) ? yh.startDate : yh.date);
        if(!mode){
            return dt;
        }else{ // DATE_FORM_SLASH
            var d = dojo.date.locale.parse(dt, {datePattern:'yyyy-M-d', selector:'date'});
            return dojo.date.locale.format(d, DATE_FORM_S);
        }
    };

    // 付与日数
    var getProvide = function(){
        if (yh.provide != null) {
            return teasp.message.getLabel('tk10005151', '' + yh.provide); // 日
        }

        if(yh.totalTime < 0 && !yh.lostFlag){
            return '-';
        }
        var t = Math.abs(yh.totalTime);
        if(yh.timeUnit){
            return (yh.lostFlag ? '-' : '') + ATK.util.timeValue(t);
        }
        var half = yh.baseTime / 2;
        var d = Math.floor(t / half);
        d /= 2;
        var h = (t % half);
        if(d > 0 && (h % 60) > 0 && (half % 60) > 0){
            d -= 0.5;
            h += half;
        }
        if(d > 0){
            return teasp.message.getLabel('tk10005151', (yh.lostFlag ? '-' : '') + d) // 日
                    + (h > 0 ? ('+' + ATK.util.timeValue(h)) : '');
        }
        else if (d == 0 && h == 0) {
            return teasp.message.getLabel('tk10005151', 0) // 0日
        }
        return (yh.lostFlag ? '-' : '') + ATK.util.timeValue(h);
    };

    // 消化日数
    var getSpend = function(){
        if(yh.totalTime > 0 || yh.lostFlag || yh.provide != null || yh.realProvideDays > 0){
            return '-';
        }
        var t = Math.abs(yh.totalTime);
        if(yh.timeUnit){
            return ATK.util.timeValue(t);
        }
        var half = yh.baseTime / 2;
        var d = Math.floor(t / half);
        d /= 2;
        var h = (t % half);
        if(d > 0){
            return teasp.message.getLabel('tk10005151', '' + d) // 日
                    + (h > 0 ? ('+' + ATK.util.timeValue(h)) : '');
        }
        return ATK.util.timeValue(h);
    };

    // 備考
    var getNote = function(){
        var noteStr = '';

        if (yh.totalTime > 0 || yh.realProvideDays > 0) {
            var startDateStr = '';
            if (yh.startDate != null) {
                var startDateVal = dojo.date.locale.parse(yh.startDate, {datePattern:'yyyy-M-d', selector:'date'});
                startDateStr = dojo.date.locale.format(startDateVal, DATE_FORM_S);
            }

            var limitDateStr = '';
            if (yh.limitDate != null) {
                var limitDateVal = dojo.date.locale.parse(yh.limitDate, {datePattern:'yyyy-M-d', selector:'date'});
                limitDateStr = dojo.date.locale.format(limitDateVal, DATE_FORM_S);
            }

            var typeStr = '';
            if (yh.autoFlag) {
                typeStr = teasp.message.getLabel('tk10001056'); // 定期付与
            } else {
                typeStr = teasp.message.getLabel('tk10001055'); // 臨時付与
            }
            noteStr = teasp.message.getLabel('tk10005140', typeStr, startDateStr, limitDateStr); // {0} 有効開始日：{1} 失効日:{2}
        }

        return noteStr;
    }

    return {
        getSubject            : getSubject,
        getDate               : getDate,
        getProvide            : getProvide,
        getSpend              : getSpend,
        getNote               : getNote
    };
}; // ATK.view.YuqHistory

