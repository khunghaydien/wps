/**
 * 区間の休日を計算する関数。
 *
 * 日付の区間[dt1,dt2) について,休日のマップを作る.
 * hw1, hw2 は, 1週間の休日を設定する. nullなら週休を使用しない
 * sunflagがfalseでhw1,hw2とも日曜が指定されていなければ,振替休日になった日曜日の祝日は休みにしない.
 *
 * @param {Object}   dt1 休日を計算する区間の下限(dt1<=)
 * @param {Object}   dt2 休日を計算する区間の上限(&lt;dt2)
 * @param {Array.<number>}  hws １週間の休日の曜日(0:日,1:月,..6:土,null:使用しない)
 * @param {?boolean} sunflag: hwsで日曜が休日でない場合も日曜の祝日を休暇にする場合は true, 振替休日のみ休暇の場合は false
 * @return {string|Object} 区間で休日になる日のマップ(オブジェクト)
 *         マップは 'yyyy-mm-dd' -> 以下の要素を持つオブジェクト
 *          dayOfWeek {number} 曜日を示す番号
 *          title     {string} 休日の名前
 * @author DCI有本
 */
function getHolidays(dt1, dt2, hws, sunflag) {
    var DOY_FRACTION = 0.242194; // 定数: 1年で発生する暦日のずれ
    var BASE_YEAR = 1980;        // 定数: 暦日計算の基準年
    var DAY1 = 24 * 60 * 60 * 1000; // 定数: 1日のミリ秒
    var dt1time = dt1.getTime(); // 区間の下限のtime
    var dt2time = dt2.getTime(); // 区間の上限のtime
    var holidayMap = {}; // 休日マップの組み立て先
    var baseDate = teasp.util.date.getToday();   // 計算している月の最初の日
    var baseWeek = null; // baseDate の曜日
    var baseTime = null; // baseDate のtime
    var dt = teasp.util.date.getToday(); // 作業用の日付変数

    var dateKey = function(d0) {
        var y = d0.getFullYear();
        var m = d0.getMonth()+1;
        var d = d0.getDate();
        if(m<10) { m = "0" + m; }
        if(d<10) { d = "0" + d; }
        return "" + y + '-' + m + '-' + d;
    };

    var getYear = function() {
        return baseDate.getFullYear();
    };

    var isSunday = function(d) {
        return baseWeek === (36-d) % 7;
    };
    var markDay = function(d, s, o) {
        var t = baseTime + (d-1) * DAY1;
        if(dt1time <= t && t <= dt2time) {
            dt.setTime(t);
            //holidayMap[dateKey(dt)] = (holidayMap[dateKey(dt)] || '0') + ',' + s;
            holidayMap[dateKey(dt)] = {dayOfWeek: dt.getDay() , title: s, org: o };
        }
    };
    var markNthMonday = function(n, s) {
        var d = (8 - baseWeek) % 7 + (n - 1) * 7;
        var t = baseTime + d * DAY1;
        if(dt1time <= t && t <= dt2time) {
            dt.setTime(t);
            //holidayMap[dateKey(dt)] = (holidayMap[dateKey(dt)] || '0') + ',' + s;
            holidayMap[dateKey(dt)] = {dayOfWeek: dt.getDay() ,  title: s };
        }
        return d+1;
    };
    var monthFunc = {
    1: function() {
        markDay(1, teasp.message.getLabel('tm00000130'), isSunday(1)); // 元日
        if(isSunday(1)) { markDay(2, teasp.message.getLabel('tm00000120')); } // 振替休日
        markNthMonday(2,teasp.message.getLabel('tm00000140')); // 成人の日
    },
    2: function() {
        markDay(11, teasp.message.getLabel('tm00000150'), isSunday(11)); // 建国記念の日
        if(isSunday(11)) { markDay(12, teasp.message.getLabel('tm00000120')); } // 振替休日
        if(getYear() > 2019){
            markDay(23, teasp.message.getLabel('tm00000270'), isSunday(23)); // 天皇誕生日 2020～
            if(isSunday(23)) { markDay(24, teasp.message.getLabel('tm00000120')); } // 振替休日
        }
    },
    3: function() {
        var adjust = DOY_FRACTION * (getYear() - BASE_YEAR) - (((getYear() - BASE_YEAR) / 4) | 0);
        var EQUINOX_DAY = 20.8431; // 基準年での春分時刻
        if(getYear() > 2000) {
            adjust += ((getYear() - 2000) / 100.0) | 0;
        }
        var d = (EQUINOX_DAY + adjust) | 0;
        markDay(d, teasp.message.getLabel('tm00000160'), isSunday(d)); // 春分の日
        if(isSunday(d)) { markDay(d + 1, teasp.message.getLabel('tm00000120')); } // 振替休日
    },
    4: function() {
        markDay(29, teasp.message.getLabel('tm00000170'), isSunday(29)); // 昭和の日
        if(isSunday(29)) { markDay(30, teasp.message.getLabel('tm00000120')); } // 振替休日
        if(getYear() == 2019){
            markDay(30, teasp.message.getLabel('tm00000110')); // 国民の休日 2019
        }
    },
    5: function() {
        if(getYear() == 2019){
            markDay(1, teasp.message.getLabel('tm00000900')); // 即位の日 2019
            markDay(2, teasp.message.getLabel('tm00000110')); // 国民の休日 2019
        }
        if(isSunday(3)||isSunday(4)||isSunday(5)) { markDay(6, teasp.message.getLabel('tm00000120')); } // 振替休日
        markDay(3, teasp.message.getLabel('tm00000180'), isSunday(3)); // 憲法記念日
        markDay(4, teasp.message.getLabel('tm00000190'), isSunday(4)); // みどりの日
        markDay(5, teasp.message.getLabel('tm00000200'), isSunday(5)); // こどもの日
    },
    6: function() {},
    7: function() {
        if(getYear() == 2020){
            markDay(23, teasp.message.getLabel('tm00000210')); // 海の日 2020
            markDay(24, teasp.message.getLabel('tm00000241')); // スポーツの日 2020
        }else if(getYear() == 2021){
            markDay(22, teasp.message.getLabel('tm00000210')); // 海の日 2021
            markDay(23, teasp.message.getLabel('tm00000241')); // スポーツの日 2021
        }else{
            markNthMonday(3, teasp.message.getLabel('tm00000210')); // 海の日 2020～21以外
        }
    },
    8: function() {
        if(getYear() == 2020){
            markDay(10, teasp.message.getLabel('tm00000280')); // 山の日 2020
        }else if(getYear() == 2021){
            markDay(8, teasp.message.getLabel('tm00000280')); // 山の日 2021
            markDay(9, teasp.message.getLabel('tm00000120')); // 振替休日
        }else if(getYear() >= 2016){
            markDay(11, teasp.message.getLabel('tm00000280'), isSunday(11)); // 山の日 2020～21以外
            if(isSunday(11)) { markDay(12, teasp.message.getLabel('tm00000120')); } // 振替休日
        }
    },
    9: function() {
        var d1 = markNthMonday(3, teasp.message.getLabel('tm00000220')); // 敬老の日
        var EQUINOX_DAY = 23.2488; // 基準年での秋分時刻
        var adjust = DOY_FRACTION * (getYear() - BASE_YEAR) - (((getYear() - BASE_YEAR) / 4) | 0);
        if(getYear() > 2000) {
            adjust += ((getYear() - 2000) / 100.0) | 0;
        }
        var d2 = (EQUINOX_DAY + adjust) | 0;
        markDay(d2, teasp.message.getLabel('tm00000230'), isSunday(d2)); // 秋分の日
        if(isSunday(d2)) { markDay(d2+1, teasp.message.getLabel('tm00000120')); } // 振替休日
        if(d1 + 2 == d2) { markDay(d1+1, teasp.message.getLabel('tm00000110')); } // 国民の休日
    },
    10: function() {
        if(getYear() > 2021) {
            markNthMonday(2, teasp.message.getLabel('tm00000241')); // スポーツの日 2022～
        }else if(getYear() < 2020){
            markNthMonday(2, teasp.message.getLabel('tm00000240')); // 体育の日 ～2019
        }
        if(getYear() == 2019){
            markDay(22, teasp.message.getLabel('tm00000910')); // 即位礼正殿の儀 2019
        }
    },
    11: function() {
        markDay(3, teasp.message.getLabel('tm00000250'), isSunday(3)); // 文化の日
        if(isSunday(3)) { markDay(4,teasp.message.getLabel('tm00000120')); } // 振替休日
        markDay(23, teasp.message.getLabel('tm00000260'), isSunday(23)); // 勤労感謝の日
        if(isSunday(23)) { markDay(24,teasp.message.getLabel('tm00000120')); } // 振替休日
    },
    12: function() {
        if(getYear() < 2019) {
            markDay(23, teasp.message.getLabel('tm00000270'), isSunday(23)); // 天皇誕生日 ～2018
            if(isSunday(23)) { markDay(24,teasp.message.getLabel('tm00000120')); } // 振替休日
        }
    }
    };
    var fillWeekly = function (hws) {
    	var i;
    	for (i=0;i<hws.length;i++){
    		var t = dt1time + ((hws[i] + 7 - dt1.getDay()) % 7) * DAY1;
    		for(; t <= dt2time; t += 7 * DAY1) {
    			dt.setTime(t);
    			holidayMap[dateKey(dt)] ={dayOfWeek: dt.getDay()  };
    		}
    	}
    };

    // ここからメイン
    fillWeekly(hws);
    //fillWeekly(hw2, "2");
    //if(hw1 === 0 || hw2 === 0) {
      //  sunflag = true;
    //}
    baseDate.setTime(dt1time);
    baseDate.setDate(1);
    baseTime = baseDate.getTime();
    while(baseTime <= dt2time) {
        baseWeek = baseDate.getDay();
        monthFunc[baseDate.getMonth()+1]();
        baseDate.setMonth(baseDate.getMonth()+1);
        baseTime = baseDate.getTime();
    }
    return holidayMap;
}

/**
 * 区間の休日を取得。
 *
 * 日付の区間[dt1,dt2) について,休日のマップを作る.
 * hw1, hw2 は, 1週間の休日を設定する. nullなら週休を使用しない
 * sunflagがfalseでhw1,hw2とも日曜が指定されていなければ,振替休日になった日曜日の祝日は休みにしない.
 *
 * @param {Object}   dt1 休日を計算する区間の下限(dt1<=)
 * @param {Object}   dt2 休日を計算する区間の上限(&lt;dt2)
 * @param {Array.<number>}  weekHolidays １週間の休日の曜日(0:日,1:月,..6:土,null:使用しない)
 * @param {?boolean} nonPublicHoliday 国民の祝日を休みにする場合は true
 * @return {Object} 区間で休日になる日のマップ(オブジェクト)
 *         マップは 'yyyy-mm-dd' -> 以下の要素を持つオブジェクト
 *          dayOfWeek {number} 曜日を示す番号
 *          title     {string} 休日の名前
 *          dayType   {number} 日の種別
 */
function getHolidaysEx(dt1, dt2, weekHolidays, nonPublicHoliday) {
    var holidays = (weekHolidays || '0000000');
    var weekHolys = [];
    var legalHolys = [];
    for(var j = 0 ; j < holidays.length ; j++){
        var h = holidays.substring(j, j + 1);
        if(h != '0'){
            weekHolys.push(j);
        }
        if(h == '2'){
            legalHolys.push(j);
        }
    }
    dt1.setHours(10);
    dt2.setHours(14);
    var fixHolidays = getHolidays(dt1, dt2, weekHolys, false);
    for(var dkey in fixHolidays){
        if(fixHolidays.hasOwnProperty(dkey)){
            var fh = fixHolidays[dkey];
            if(legalHolys.contains(fh.dayOfWeek)){
                fh.dayType = teasp.constant.DAY_TYPE_LEGAL_HOLIDAY;
            }else if(weekHolys.contains(fh.dayOfWeek)){
                fh.dayType = teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
            }else{
                if(nonPublicHoliday){
                    fh.dayType = teasp.constant.DAY_TYPE_NORMAL;
                }else if(!fh.org){
                    fh.dayType = teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY;
                }else{
                    fh.dayType = teasp.constant.DAY_TYPE_NORMAL;
                }
            }
        }
    }
    return fixHolidays;
}

// var hm = getHolidays(new Date(2012,3,1,0,0,0), new Date(2012,4,5,0,0,0), [0,6], true);

