/*
 * 月次サマリーとCSV比較の手順。
 * 1.その他のデータ出力画面を一度開く→アドレス欄に「&debug=1」を追加して再表示→プルダウンに追加された「*」を選択
 * 2.テキストエリアに添付のテキストの内容をコピペして実行
 * 3.月度を選択してダウンロード→差異がある項目に▲印がつきます。
 *
 * 5/24 ネット労働時間,過不足時間,有休取得日数,有休失効日数,有休付与日数を追加
 * 7/3  無給休暇日数, 計画付与有休, 祝日出勤日数, 控除時間, 休憩時間, 残業時間, 代休取得日数,
 *      変形期間法定労働時間, 変形期間内法定時間内労働時間, 変形期間内超過時間 を追加
 *
 */
tsq.QueryObj.prototype.buildForm = function(){
    require(["dojo/string"]);

    this.destroy();
    var qform = dojo.byId('queryForm');

    var tbody = dojo.create('tbody', null, dojo.create('table', { className: 'pane_table' }, qform));
    var row = dojo.create('tr', null, tbody);
    var today = new Date();
    new dijit.form.NumberSpinner({ value:today.getFullYear() , constraints:{ min:1900,max:2100, pattern:'####' }, id:"queryStartYear" , style:"width:60px;margin-right:2px;" }, dojo.create('div', null, dojo.create('td', null, row)));
    new dijit.form.NumberSpinner({ value:today.getMonth() + 1, constraints:{ min:1   ,max:12  , pattern:'00'   }, id:"queryStartMonth", style:"width:42px;margin-right:2px;" }, dojo.create('div', null, dojo.create('td', null, row)));
    this.dijitParts['queryStartYear' ] = 1;
    this.dijitParts['queryStartMonth'] = 1;

//    var div = dojo.create('div', { style: { marginTop:"10px" } }, qform);
//    dojo.create('span', { innerHTML:"社員名" }, div);
//    dojo.create('input', { type:'text', id: 'queryEmps', style: { marginLeft:"5px", width:"200px" } }, div);
    var div = dojo.create('div', { style: { marginTop:"10px" } }, qform);
    var label = dojo.create('label', null, div);
    dojo.create('input', { type:'checkbox', id: 'outputScript' }, label);
    dojo.create('span', { innerHTML:" 修正スクリプトを出力" }, label);

    var inp = dojo.create('input', { type: 'button', value: 'ダウンロード', style: 'margin-top:10px;' }, dojo.create('div', null, qform));
    dojo.connect(inp, 'onclick', this, function(){
        this.folder = {};
        var y = parseInt(dijit.byId('queryStartYear').value, 10);
        var m = parseInt(dijit.byId('queryStartMonth').value, 10);
        this.folder.month = (y * 100 + m);
        this.fetchEmps();
    });
};

tsq.QueryObj.prototype.fetchEmps = function(){
    teasp.manager.dialogOpen('BusyWait');
    this.folder.emps = null;
    this.folder.empMonths = null;

    var soql = "select Id"
        + ", EmpId__r.Id"
        + ", EmpId__r.EmpCode__c"
        + ", EmpId__r.Name"
        + ", EmpId__r.DeptId__c"
        + ", EmpId__r.DeptId__r.DeptCode__c"
        + ", EmpId__r.DeptId__r.Name"
        + ", EmpId__r.EmpTypeId__r.Name"
        + ", EmpId__r.EmpTypeId__r.ConfigBaseId__r.InitialDateOfYear__c"
        + ", EmpId__r.EmpTypeId__r.ConfigBaseId__r.MarkOfYear__c"
        + ", EmpId__r.EmpTypeId__r.ConfigBaseId__r.InitialDateOfMonth__c"
        + ", EmpId__r.EmpTypeId__r.ConfigBaseId__r.MarkOfMonth__c"
        + ", EmpId__r.EmpTypeId__r.ConfigBaseId__r.InitialDayOfWeek__c"
        + ", YearMonth__c"
        + ", EmpApplyId__r.Status__c"
        + " from AtkEmpMonth__c"
        + " where YearMonth__c = " + this.folder.month;
    this.search(soql, true);
};

tsq.QueryObj.prototype.buildData = function(records){
    if(!this.folder.emps){
        this.folder.emps = records;
        var soql = "select"
            + " Id"
            + ",EmpId__r.Id"
            + ",EmpId__r.Name"
            + ",EmpId__r.EmpCode__c"
            + ",EmpId__r.EmpTypeId__r.Name"
            + ",EmpId__r.EmpTypeId__r.EmpTypeCode__c"
            + ",YearMonth__c"
            + ",DeptName__c"
            + ",DeptCode__c"
            + ",EmpId__r.DeptId__c"
            + ",EmpId__r.DeptId__r.DeptCode__c"
            + ",EmpId__r.DeptId__r.Name"
            + ",StartDate__c"
            + ",EndDate__c"
            + ",ConfigId__r.WorkSystem__c"
            + ",ConfigId__r.StandardFixTime__c"
            + ",ConfigId__r.UseDiscretionary__c"
            + ",EmpApplyId__r.Status__c"
            + ",WorkFixedDay__c"
            + ",WorkRealDay__c"
            + ",WorkLegalHolidayCount__c"
            + ",WorkPublicHolidayCount__c"
            + ",WorkFixedTime__c"
            + ",WorkWholeTime__c"
            + ",AmountTime__c"
            + ",LegalWorkTime__c"
            + ",WorkRealTime__c"
            + ",WorkLegalOverTime__c"
            + ",WorkLegalOutOverTime__c"
            + ",WorkChargeTime__c"
            + ",WorkOver60Time__c"
            + ",WorkOverTime36__c"
            + ",TotalWorkOverTime36__c"
            + ",TotalWorkOverCount36__c"
            + ",PeriodWorkOverTime36__c"
            + ",WorkOver40perWeek__c"
            + ",PaidHolidayCount__c"
            + ",PlannedHolidayCount__c"
            + ",PaidRestTime__c"
            + ",DaiqHolidayCount__c"
            + ",AbsentCount__c"
            + ",LostTime__c"
            + ",LateCount__c"
            + ",LateLostTime__c"
            + ",EarlyCount__c"
            + ",EarlyLostTime__c"
            + ",PrivateInnerCount__c"
            + ",WeekDayDayLegalFixTime__c"
            + ",WeekDayDayLegalExtTime__c"
            + ",WeekDayDayLegalOutTime__c"
            + ",WeekDayNightLegalFixTime__c"
            + ",WeekDayNightLegalExtTime__c"
            + ",WeekDayNightLegalOutTime__c"
            + ",WeekEndDayLegalTime__c"
            + ",WeekEndDayLegalOutTime__c"
            + ",WeekEndNightLegalTime__c"
            + ",WeekEndNightLegalOutTime__c"
            + ",HolidayDayTime__c"
            + ",HolidayNightTime__c"
            + ",DaiqExpired__c"
            + ",AverageEndTime__c"              // 平均退社時刻
            + ",AverageStartTime__c"            // 平均出社時刻
            + ",DaiqAllocated__c"               // 代休発生日数
            + ",DaiqAllocatedHoliday__c"        // 代休発生日数(所)
            + ",DaiqAllocatedLegalHoliday__c"   // 代休発生日数(法)
            + ",DaiqConsumedHoliday__c"         // 代休消化日数(所)
            + ",DaiqConsumedLegalHoliday__c"    // 代休消化日数(法)
            + ",DaiqExpiredHoliday__c"          // 代休失効日数(所)
            + ",DaiqExpiredLegalHoliday__c"     // 代休失効日数(法)
            + ",DaiqRemain__c"                  // 代休残日数
            + ",DaiqRemainHoliday__c"           // 代休残日数(所)
            + ",DaiqRemainLegalHoliday__c"      // 代休残日数(法)
            + ",EarlyTime__c"                   // 早退時間
            + ",EmpTypeId__r.EmpTypeCode__c"    // 勤務体系コード
            + ",EmpTypeId__r.Name"              // 勤務体系名
            + ",ExchangeFromPrev__c"            // 前月からの振替日数
            + ",ExchangeToNext__c"              // 来月への振替日数
            + ",FlexWeekend__c"                 // フレックス所定休日
            + ",FlexWeekendNight__c"            // フレックス所定休日夜間
            + ",LateTime__c"                    // 遅刻時間
            + ",LegalWorkTimeOfPeriod__c"       // 変形期間法定労働時間
            + ",OrgWorkFixedDay__c"             // 振替前の所定勤務日数
            + ",Over45Count__c"                 // 限度超過回数
            + ",Over45Time__c"                  // 限度超過時間
            + ",PeriodWorkOverCount36__c"       // 4半期36協定超過回数
            + ",PrivateCount__c"                // 私用外出回数
            + ",PrivateInnerLostTime__c"        // 控除私用外出時間
            + ",PrivateInnerTime__c"            // 勤務時間内私用外出時間
            + ",PrivateOuterTime__c"            // 勤務時間外私用外出時間
            + ",PushEndRate__c"                 // 退社打刻率
            + ",PushEndTimeCount__c"            // 退社打刻回数
            + ",PushRate__c"                    // 打刻率
            + ",PushStartRate__c"               // 出社打刻率
            + ",PushStartTimeCount__c"          // 出社打刻回数
            + ",RecentPushDate__c"              // 最終打刻日
            + ",RecentPushDateEnd__c"           // 最終退社打刻日
            + ",RecentPushDateStart__c"         // 最終出社打刻日
            + ",WorkHolidayCount__c"            // 休日出勤日数
            + ",WorkHolidayCountWithCH__c"      // 休日出勤日数(振替休日あり)
            + ",WorkHolidayCountWoCH__c"        // 休日出勤日数(振替休日なし)
            + ",WorkLegalOutOverTimePeriod__c"  // 変形期間内超過時間
            + ",WorkLegalTimePeriod__c"         // 変形期間内法定時間内労働時間
            + ",WorkNetTime__c"                 // ネット労働時間
            + ",WorkNightTime__c"               // 深夜労働時間
            + ",NightChargeTime__c"             // 深夜労働割増
            + ",WorkOffTime__c"                 // 休憩時間
            + ",WorkOver45Time__c"              // ４５時間超残業
            + ",WorkOverTime__c"                // 残業時間
            + ",YuqRemainDays__c"               // 有休残日数
            + ",YuqRemainHour__c"               // 有休残時間
            + ",InputFlag__c"                   // 対象者フラグ
            + ",YuqExpiredDays__c"              // 有休失効日数
            + ",YuqProvideDays__c"              // 有休付与日数
            + ",EmpId__r.EmpTypeId__r.ConfigBaseId__r.InitialDateOfYear__c"
            + ",EmpId__r.EmpTypeId__r.ConfigBaseId__r.MarkOfYear__c"
            + ",EmpId__r.EmpTypeId__r.ConfigBaseId__r.InitialDateOfMonth__c"
            + ",EmpId__r.EmpTypeId__r.ConfigBaseId__r.MarkOfMonth__c"
            + ",EmpId__r.EmpTypeId__r.ConfigBaseId__r.InitialDayOfWeek__c"
            + " from AtkEmpMonth__c"
            + " where YearMonth__c = " + this.folder.month;
        this.search(soql, true);
    }else if(!this.folder.empMonths){
        this.folder.empMonths = records;
        var soql = "select"
            + "  Id"
            + ", BaseTime__c"
            + ", Subject__c"
            + ", EmpId__c"
            + ", EmpId__r.Name"
            + ", Date__c"
            + ", StartDate__c"
            + ", LimitDate__c"
            + ", TempFlag__c"
            + ", AutoFlag__c"
            + ", (select"
            + "  Days__c"
            + ", Time__c"
            + ", EmpYuqId__r.LostFlag__c"
            + ", EmpYuqId__r.Date__c"
            + ", EmpYuqId__r.EmpApplyId__r.StartDate__c"
            + ", EmpYuqId__r.EmpApplyId__r.EndDate__c"
            + ", EmpYuqId__r.EmpApplyId__r.ExcludeDate__c"
            + " from EmpYuqGroupR__r"
            + " order by Time__c desc)"
            + " from AtkEmpYuq__c"
            + " where TotalTime__c > 0"
            + " order by EmpId__c, LimitDate__c, Id";
        this.search(soql, true);
    }else{
        this.folder.empYuqs = records;
        this.folder.index = 0;
        this.collectEmpMonth();
    }
};

tsq.QueryObj.prototype.collectEmpMonth = function(){
    if(this.folder.index >= this.folder.emps.length){
        this.outputSummary();
        return;
    }
    var emp = this.folder.emps[this.folder.index++];
    console.log(this.folder.index + ') ' + emp.EmpId__r.Name);
    this.step();
    emp.pouch = new teasp.data.Pouch();
    teasp.manager.request(
        'loadEmpMonthPrint',
        { target: "empMonth", noDelay: true, empId: emp.EmpId__r.Id, month: this.folder.month },
        emp.pouch,
        { hideBusy : true },
        this,
        function(){
            setTimeout(dojo.hitch(this, this.collectEmpMonth));
        },
        function(event){
        }
    );
};

tsq.QueryObj.convNum = function(v){
    var m = /([0-9\-:\.]+)/.exec(v);
    return (m ? m[1] : v);
};

tsq.QueryObj.convYuqZan = function(v, flg){
    if(flg == 2){ // 有休残日数
        var m = /([\d\.]+)/.exec(v);
        if(m){
            return parseFloat(m[1]);
        }
    }else if(flg == 3){
        var m = /(\d+):00/.exec(v);
        if(m){
            return parseInt(m[1], 10);
        }
    }
    return 0;
};

tsq.QueryObj.diffMark = function(a, b){
    var m, n;
    if(a == '-' || b == '-'){
        return '';
    }
    if(a == '0' || a == '0:00' || a == '-'){
        m = 0;
    }else{
        m = a;
    }
    if(b == '0' || b == '0:00' || b == '-'){
        n = 0;
    }else{
        n = b;
    }
    return (m != n ? '▲' : '');
};

tsq.QueryObj.diffValue = function(o1, o2, key, flg){
    var a = o1[key];
    var b = o2[key];
    var ta = null;
    var tb = null;

    if(flg == 2){ // 有休残日数
        ta = (a || 0);
        var m = /([\d\.]+)/.exec(b);
        if(m){
            tb = parseFloat(m[1]);
        }else{
            tb = 0;
        }
    }else if(flg == 3){
        ta = (a || 0);
        var m = /(\d+):00/.exec(b);
        if(m){
            tb = parseInt(m[1], 10);
        }else{
            tb = 0;
        }
    }else{
        var m = /^(\d+):(\d+)$/.exec(a);
        var typ = 0;
        if(m){
            ta = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
            typ = 1;
        }else if(/\./.test(a)){
            ta = parseFloat(a);
        }else if(/\d+/.test(a)){
            ta = parseInt(a, 10);
        }

        m = /^(\d+):(\d+)$/.exec(b);
        if(m){
            tb = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
        }else if(/\./.test(b)){
            tb = parseFloat(b);
        }else if(/\d+/.test(b)){
            tb = parseInt(b, 10);
        }
    }

    if(typeof(ta) == 'number' && typeof(tb) == 'number'){
        return { diff:(ta - tb), ov:tb, xv:ta, typ:typ };
    }
    return { diff:'', ov:'' };
};

tsq.QueryObj.prototype.outputSummary = function(){
    this.step();
    var fsets = [
        { key : 'workFixedTime'             , f: 'WorkFixedTime__c'            }
      , { key : 'workWholeTime'             , f: 'WorkWholeTime__c'            }
      , { key : 'workRealTime'              , f: 'WorkRealTime__c'             }
//      , { key : 'workRealTimeNoDiscretion'  , f: 'WorkNetTime__c'              }
      , { key : 'legalOverTime'             , f: 'WorkLegalOverTime__c'        }
      , { key : 'legalOutOverTime'          , f: 'WorkLegalOutOverTime__c'     }
      , { key : 'workNightTime'             , f: 'WorkNightTime__c'            }
      , { key : 'workChargeTime'            , f: 'WorkChargeTime__c'           }
      , { key : 'workOver45Time'            , f: 'WorkOver45Time__c'           }
      , { key : 'workOver60Time'            , f: 'WorkOver60Time__c'           }
      , { key : 'lateCount'                 , f: 'LateCount__c'                }
      , { key : 'lateTime'                  , f: 'LateTime__c'                 }
      , { key : 'lateLostTime'              , f: 'LateLostTime__c'             }
      , { key : 'earlyCount'                , f: 'EarlyCount__c'               }
      , { key : 'earlyTime'                 , f: 'EarlyTime__c'                }
      , { key : 'earlyLostTime'             , f: 'EarlyLostTime__c'            }
      , { key : 'privateInnerCount'         , f: 'PrivateInnerCount__c'        }
      , { key : 'privateInnerTime'          , f: 'PrivateInnerTime__c'         }
      , { key : 'privateInnerLostTime'      , f: 'PrivateInnerLostTime__c'     }
//      , { key : 'paidHolidayCount'          , f: 'PaidHolidayCount__c'         }
      , { key : 'paidRestTime'              , f: 'PaidRestTime__c'             }
      , { key : 'yuqRemain'                 , f: 'YuqRemainDays__c'            }
      , { key : 'yuqRemainHour'             , f: 'YuqRemainHour__c'            }
      , { key : 'yuqExpiredDays'            , f: 'YuqExpiredDays__c'           }
//      , { key : 'yuqProvideDays'            , f: 'YuqProvideDays__c'           }
      , { key : 'workOverTime36'            , f: 'WorkOverTime36__c'           }
      , { key : 'totalWorkOverTime36'       , f: 'TotalWorkOverTime36__c'      }
      , { key : 'totalWorkOverCount36'      , f: 'TotalWorkOverCount36__c'     }
      , { key : 'quartWorkOverTime36'       , f: 'PeriodWorkOverTime36__c'     }
      , { key : 'workOver40perWeek'         , f: 'WorkOver40perWeek__c'        }
//      , { key : 'weekDayDayLegalFixTime'    , f: 'WeekDayDayLegalFixTime__c'   }
//      , { key : 'weekDayDayLegalExtTime'    , f: 'WeekDayDayLegalExtTime__c'   }
//      , { key : 'weekDayDayLegalOutTime'    , f: 'WeekDayDayLegalOutTime__c'   }
//      , { key : 'weekDayNightLegalFixTime'  , f: 'WeekDayNightLegalFixTime__c' }
//      , { key : 'weekDayNightLegalExtTime'  , f: 'WeekDayNightLegalExtTime__c' }
//      , { key : 'weekDayNightLegalOutTime'  , f: 'WeekDayNightLegalOutTime__c' }
//      , { key : 'weekEndDayLegalTime'       , f: 'WeekEndDayLegalTime__c'      }
//      , { key : 'weekEndDayLegalOutTime'    , f: 'WeekEndDayLegalOutTime__c'   }
//      , { key : 'weekEndNightLegalTime'     , f: 'WeekEndNightLegalTime__c'    }
//      , { key : 'weekEndNightLegalOutTime'  , f: 'WeekEndNightLegalOutTime__c' }
//      , { key : 'holidayDayTime'            , f: 'HolidayDayTime__c'           }
//      , { key : 'holidayNightTime'          , f: 'HolidayNightTime__c'         }
    ];
    var value = '';
    var upcnt = 0;
    var outScript = dojo.byId('outputScript').checked;

    this.converYuqRemain();

    var buf = '';
    buf += '// 修正スクリプト start\r\n';
    buf += 'AtkEmpMonth__c m;\r\n';
    buf += 'List<AtkEmpMonth__c> l = new List<AtkEmpMonth__c>();\r\n';

    for(var i = 0 ; i < this.folder.emps.length ; i++){
        var e = this.folder.emps[i];
        var em = null;
        for(var j = 0 ; j < this.folder.empMonths.length ; j++){
            var m = this.folder.empMonths[j];
            if(m.EmpId__r.Id == e.EmpId__r.Id
            && m.YearMonth__c == e.YearMonth__c){
                em = m;
                break;
            }
        }
        var ms = e.pouch.getMonthSummary();
        var yuq1 = e.pouch.getDspYuqRemain(e.pouch.dataObj.month.endDate, true);
        var yuq2 = this.getYuqRemain(e.EmpId__r.Id, e.pouch.dataObj.month.startDate, e.pouch.dataObj.month.endDate, (e.pouch.isYuqZanFlag ? e.pouch.isYuqZanFlag() : false));
        var hd = ms.o.holidaySummary;
        var daiqm = hd.items[teasp.constant.HOLIDAY_TYPE_DAIQ];
        var daiqDays = 0;
        for(var key in daiqm){
            if(daiqm.hasOwnProperty(key)){
                daiqDays += daiqm[key].cnt;
            }
        }

        var monthSum = {
                empId                         : e.EmpId__r.Id
              , empName                       : e.EmpId__r.Name
              , empCode                       : (e.EmpId__r.EmpCode__c || '')
              , yearMonth                     : e.YearMonth__c
              , status                        : (e.EmpApplyId__r && e.EmpApplyId__r.Status__c || '')
              , deptName                      : (e.EmpId__r.DeptId__r && e.EmpId__r.DeptId__r.Name || '')
              , deptCode                      : (e.EmpId__r.DeptId__r && e.EmpId__r.DeptId__r.DeptCode__c || '')
              , empTypeName                   : e.EmpId__r.EmpTypeId__r.Name
              , workSystem                    : e.pouch.dataObj.config.workSystem
              , fixdays                       : tsq.QueryObj.convNum(ms.o.fixdays.val)
              , realdays                      : tsq.QueryObj.convNum(ms.o.realdays.val)
              , workLegalHolidays             : tsq.QueryObj.convNum(ms.o.workLegalHolidays.val)
              , workHolidays                  : tsq.QueryObj.convNum(ms.o.workHolidays.val)
              , workFixedTime                 : tsq.QueryObj.convNum(ms.o.workFixedTime.val)
              , workWholeTime                 : tsq.QueryObj.convNum(ms.o.workWholeTime.val)
              , workWholeOmitHolidayTime      : tsq.QueryObj.convNum(ms.o.workWholeOmitHolidayTime.val)
              , workRealOmitHolidayTime       : tsq.QueryObj.convNum(ms.o.workRealOmitHolidayTime.val)
              , workRealTime                  : tsq.QueryObj.convNum(ms.o.workRealTime.val)
              , workNetTime                   : tsq.QueryObj.convNum(ms.o.workRealTimeNoDiscretion.flag     ? ms.o.workRealTimeNoDiscretion.val : ms.o.workRealTime.val)
              , legalTime                     : tsq.QueryObj.convNum((ms.o.legalTime.val || ''))
              , amountTime                    : (e.pouch.dataObj.config.workSystem == 1 ? tsq.QueryObj.convNum(ms.o.amountTime.val) : '')
              , legalOverTime                 : tsq.QueryObj.convNum(ms.o.legalOverTime.val)
              , legalOutOverTime              : tsq.QueryObj.convNum(ms.o.legalOutOverTime.val)
              , workHolidayTime               : tsq.QueryObj.convNum(ms.o.workHolidayTime.val)
              , workNightTime                 : tsq.QueryObj.convNum(ms.o.workNightTime.val)
              , workChargeTime                : tsq.QueryObj.convNum(ms.o.workChargeTime.val)
              , workOver45Time                : tsq.QueryObj.convNum(ms.o.workOver45Time.val)
              , workOver60Time                : tsq.QueryObj.convNum(ms.o.workOver60Time.val)
              , lateCount                     : tsq.QueryObj.convNum(ms.o.lateCount.val)
              , lateTime                      : tsq.QueryObj.convNum(ms.o.lateTime.val)
              , lateLostTime                  : tsq.QueryObj.convNum(ms.o.lateLostTime.val)
              , earlyCount                    : tsq.QueryObj.convNum(ms.o.earlyCount.val)
              , earlyTime                     : tsq.QueryObj.convNum(ms.o.earlyTime.val)
              , earlyLostTime                 : tsq.QueryObj.convNum(ms.o.earlyLostTime.val)
              , privateInnerCount             : tsq.QueryObj.convNum(ms.o.privateInnerCount.val)
              , privateInnerTime              : tsq.QueryObj.convNum(ms.o.privateInnerTime.val)
              , privateInnerLostTime          : tsq.QueryObj.convNum(ms.o.privateInnerLostTime.val)
              , paidHolidayCount              : yuq2.spend.getDays()   // 有休消化日数
              , paidRestTime                  : tsq.QueryObj.convNum(ms.o.paidRestTime.val)
              , yuqRemain                     : yuq1.days
              , yuqRemainHour                 : Math.round(yuq1.time * 100 / 60) / 100
              , yuqExpiredDays                : yuq2.expire.getDays()  // 有休失効日数
              , yuqProvideDays                : yuq2.provide.getDays() // 有休付与日数
              , workOverTime36                : tsq.QueryObj.convNum(ms.o.workOverTime36.val)
              , totalWorkOverTime36           : tsq.QueryObj.convNum(ms.o.totalWorkOverTime36.val)
              , totalWorkOverCount36          : tsq.QueryObj.convNum(ms.o.totalWorkOverCount36.val)
              , quartWorkOverTime36           : tsq.QueryObj.convNum(ms.o.quartWorkOverTime36.val)
              , workOver40perWeek             : tsq.QueryObj.convNum(ms.o.workOver40perWeek.val)
              , weekDayDayLegalFixTime        : teasp.util.time.timeValue(e.pouch.dataObj.month.real.weekDayDayLegalFixTime)
              , weekDayDayLegalExtTime        : teasp.util.time.timeValue(e.pouch.dataObj.month.real.weekDayDayLegalExtTime)
              , weekDayDayLegalOutTime        : teasp.util.time.timeValue(e.pouch.dataObj.month.real.weekDayDayLegalOutTime)
              , weekDayNightLegalFixTime      : teasp.util.time.timeValue(e.pouch.dataObj.month.real.weekDayNightLegalFixTime)
              , weekDayNightLegalExtTime      : teasp.util.time.timeValue(e.pouch.dataObj.month.real.weekDayNightLegalExtTime)
              , weekDayNightLegalOutTime      : teasp.util.time.timeValue(e.pouch.dataObj.month.real.weekDayNightLegalOutTime)
              , weekEndDayLegalTime           : teasp.util.time.timeValue(e.pouch.dataObj.month.real.weekEndDayLegalTime)
              , weekEndDayLegalOutTime        : teasp.util.time.timeValue(e.pouch.dataObj.month.real.weekEndDayLegalOutTime)
              , weekEndNightLegalTime         : teasp.util.time.timeValue(e.pouch.dataObj.month.real.weekEndNightLegalTime)
              , weekEndNightLegalOutTime      : teasp.util.time.timeValue(e.pouch.dataObj.month.real.weekEndNightLegalOutTime)
              , holidayDayTime                : teasp.util.time.timeValue(e.pouch.dataObj.month.real.holidayDayTime)
              , holidayNightTime              : teasp.util.time.timeValue(e.pouch.dataObj.month.real.holidayNightTime)
              , absentCount                   : e.pouch.getMonthSubValueByKey('absentCount')            // 無給休暇日数
              , plannedHolidayCount           : e.pouch.getMonthSubValueByKey('plannedHolidayCount')    // 計画付与有休
              , workPublicHolidayCount        : e.pouch.getMonthSubValueByKey('workPublicHolidayCount') // 祝日出勤日数
              , lostTime                      : e.pouch.getMonthSubTimeByKey('lostTime')                // 控除時間
              , workOffTime                   : e.pouch.getMonthSubTimeByKey('workOffTime')             // 休憩時間
              , workOverTime                  : e.pouch.getMonthSubTimeByKey('workOverTime')            // 残業時間
              , daiqHolidayCount              : daiqDays                                                // 代休取得日数
              , legalWorkTimeOfPeriod         : tsq.QueryObj.convNum(ms.o.periodWorkLegalMax.val)       // 変形期間法定労働時間
              , workLegalTimePeriod           : tsq.QueryObj.convNum(ms.o.periodWorkLegalTime.val)      // 変形期間内法定時間内労働時間
              , workLegalOutOverTimePeriod    : tsq.QueryObj.convNum(ms.o.overTimeInPeriod.val)         // 変形期間内超過時間
              , periodWorkOverCount36         : 0  // 当四半期の超過回数
              , flexWeekend                   : 0  // フレックス所定休日
              , flexWeekendNight              : 0  // フレックス所定休日夜間
              , daiqAllocated                 : 0  // 代休発生日数
              , daiqAllocatedHoliday          : 0  // 代休発生日数(所)
              , daiqAllocatedLegalHoliday     : 0  // 代休発生日数(法)
              , daiqConsumedHoliday           : 0  // 代休消化日数(所)
              , daiqConsumedLegalHoliday      : 0  // 代休消化日数(法)
              , daiqExpired                   : 0  // 代休失効日数
              , daiqExpiredHoliday            : 0  // 代休失効日数(所)
              , daiqExpiredLegalHoliday       : 0  // 代休失効日数(法)
              , daiqRemain                    : 0  // 代休残日数
              , daiqRemainHoliday             : 0  // 代休残日数(所)
              , daiqRemainLegalHoliday        : 0  // 代休残日数(法)
              , daiqAllocatedHolidayTime      : 0  // 所定休日代休発生時間
              , daiqAllocatedLegalHolidayTime : 0  // 法定休日代休発生時間
              , workLegalOverTimeEx           : 0  // 法定時間内残業(代休調整済)
              , workOverTimeEx                : 0  // 残業時間(代休調整済)
              , workHolidayTimeEx             : 0  // 法定休日労働(代休調整済)
              , exchangeFromPrev              : 0  // 前月からの振替日数
              , exchangeToNext                : 0  // 来月への振替日数
              , orgWorkFixedDay               : 0  // 振替前の所定勤務日数
              , workHolidayCountWoCH          : 0  // 休日出勤日数(振替休日なし)
              , workHolidayCountWithCH        : 0  // 休日出勤日数(振替休日あり)
              , legalOverTimeEm               : 0  // 法定時間内残業(除みなし)
              , legalOutOverTimeEm            : 0  // 法定時間外残業(除みなし)
        };

        // 所定休日代休発生時間
        var daiqAllocatedHolidayTime = (em.DaiqAllocatedHoliday__c
                                        ? em.DaiqAllocatedHoliday__c * em.ConfigId__r.StandardFixTime__c
                                        : 0);
        // 法定休日代休発生時間
        var daiqAllocatedLegalHolidayTime = (em.DaiqAllocatedLegalHoliday__c
                                        ? em.DaiqAllocatedLegalHoliday__c * em.ConfigId__r.StandardFixTime__c
                                        : 0);
        // 法定時間内残業(代休調整済)
        var workLegalOverTimeEx = ((daiqAllocatedHolidayTime && em.WorkLegalOverTime__c)
                                ? em.WorkLegalOverTime__c - daiqAllocatedHolidayTime
                                : 0);
        // 残業時間(代休調整済)
        var workOverTimeEx      = ((daiqAllocatedHolidayTime && em.WorkLegalOverTime__c && em.WorkLegalOutOverTime__c)
                                ? em.WorkLegalOutOverTime__c + em.WorkLegalOverTime__c - daiqAllocatedHolidayTime
                                : 0);
        // 法定休日労働(代休調整済)
        var workHolidayTimeEx   = (daiqAllocatedLegalHolidayTime
                                ? (em.HolidayDayTime__c + em.HolidayNightTime__c) - daiqAllocatedLegalHolidayTime
                                : null);
        // 代休失効日数
        var daiqExpired         = (em.DaiqExpired__c != null
                                ? em.DaiqExpired__c
                                : 0);

        var legalOverTimeEm    = (em.WorkLegalOverTime__c    || 0); // 法定時間内残業(除みなし)
        var legalOutOverTimeEm = (em.WorkLegalOutOverTime__c || 0); // 法定時間外残業(除みなし)
        if(em.ConfigId__r.UseDiscretionary__c) {
            legalOverTimeEm    = (em.weekEndDayLegalTime__c    || 0) + (em.weekEndNightLegalTime__c    || 0);
            legalOutOverTimeEm = (em.weekEndDayLegalOutTime__c || 0) + (em.weekEndNightLegalOutTime__c || 0);
        }

        var empMonth = {
                id                            : em.Id
              , empId                         : em.EmpId__r.Id
              , empName                       : em.EmpId__r.Name
              , empCode                       : (em.EmpId__r.EmpCode__c || '')
              , yearMonth                     : em.YearMonth__c
              , status                        : (em.EmpApplyId__r      && em.EmpApplyId__r.Status__c        || '')
              , deptName                      : (em.EmpId__r.DeptId__r && em.EmpId__r.DeptId__r.Name        || '')
              , deptCode                      : (em.EmpId__r.DeptId__r && em.EmpId__r.DeptId__r.DeptCode__c || '')
              , empTypeName                   : em.EmpId__r.EmpTypeId__r.Name
              , workSystem                    : em.ConfigId__r.WorkSystem__c
              , fixdays                       : (em.WorkFixedDay__c          || 0)
              , realdays                      : (em.WorkRealDay__c           || 0)
              , workLegalHolidays             : (em.WorkLegalHolidayCount__c || 0)
              , workHolidays                  : (em.WorkHolidayCount__c      || 0) + (em.WorkPublicHolidayCount__c || 0)
              , workFixedTime                 : teasp.util.time.timeValue(em.WorkFixedTime__c)
              , workWholeTime                 : teasp.util.time.timeValue(em.WorkWholeTime__c)
              , workWholeOmitHolidayTime      : teasp.util.time.timeValue((em.WorkWholeTime__c || 0) - (em.HolidayDayTime__c || 0) + (em.HolidayNightTime__c || 0))
              , workRealOmitHolidayTime       : teasp.util.time.timeValue((em.WorkRealTime__c  || 0) - (em.HolidayDayTime__c || 0) + (em.HolidayNightTime__c || 0))
              , workRealTime                  : teasp.util.time.timeValue(em.WorkRealTime__c)
              , workNetTime                   : teasp.util.time.timeValue(em.WorkNetTime__c)
              , legalTime                     : teasp.util.time.timeValue(em.LegalWorkTime__c)
              , amountTime                    : (em.ConfigId__r.WorkSystem__c == 1 ? teasp.util.time.timeValue(em.AmountTime__c) : '')
              , legalOverTime                 : teasp.util.time.timeValue(em.WorkLegalOverTime__c   )
              , legalOutOverTime              : teasp.util.time.timeValue(em.WorkLegalOutOverTime__c)
              , workHolidayTime               : teasp.util.time.timeValue((em.HolidayDayTime__c || 0) + (em.HolidayNightTime__c || 0))
              , workNightTime                 : teasp.util.time.timeValue(em.WorkNightTime__c)
              , workChargeTime                : teasp.util.time.timeValue(em.WorkChargeTime__c)
              , workOver45Time                : teasp.util.time.timeValue(em.WorkOver45Time__c)
              , workOver60Time                : teasp.util.time.timeValue(em.WorkOver60Time__c)
              , lateCount                     : (em.LateCount__c                  || '')
              , lateTime                      : teasp.util.time.timeValue(em.LateTime__c)
              , lateLostTime                  : teasp.util.time.timeValue(em.LateLostTime__c)
              , earlyCount                    : (em.EarlyCount__c                 || '')
              , earlyTime                     : teasp.util.time.timeValue(em.EarlyTime__c)
              , earlyLostTime                 : teasp.util.time.timeValue(em.EarlyLostTime__c)
              , privateInnerCount             : (em.PrivateInnerCount__c          || '')
              , privateInnerTime              : teasp.util.time.timeValue(em.PrivateInnerTime__c)
              , privateInnerLostTime          : teasp.util.time.timeValue(em.PrivateInnerLostTime__c)
              , paidHolidayCount              : (em.PaidHolidayCount__c           || 0)
              , paidRestTime                  : teasp.util.time.timeValue(em.PaidRestTime__c)
              , yuqRemain                     : (em.YuqRemainDays__c              || '')
              , yuqRemainHour                 : (em.YuqRemainHour__c              || '')
              , yuqExpiredDays                : (em.YuqExpiredDays__c             || '') // 有休失効日数
              , yuqProvideDays                : (em.YuqProvideDays__c             || '') // 有休付与日数
              , workOverTime36                : teasp.util.time.timeValue(em.WorkOverTime36__c)
              , totalWorkOverTime36           : teasp.util.time.timeValue(em.TotalWorkOverTime36__c)
              , totalWorkOverCount36          : (em.TotalWorkOverCount36__c       || '')
              , quartWorkOverTime36           : teasp.util.time.timeValue(em.PeriodWorkOverTime36__c)
              , workOver40perWeek             : teasp.util.time.timeValue(em.WorkOver40perWeek__c)
              , weekDayDayLegalFixTime        : teasp.util.time.timeValue(em.WeekDayDayLegalFixTime__c  )
              , weekDayDayLegalExtTime        : teasp.util.time.timeValue(em.WeekDayDayLegalExtTime__c  )
              , weekDayDayLegalOutTime        : teasp.util.time.timeValue(em.WeekDayDayLegalOutTime__c  )
              , weekDayNightLegalFixTime      : teasp.util.time.timeValue(em.WeekDayNightLegalFixTime__c)
              , weekDayNightLegalExtTime      : teasp.util.time.timeValue(em.WeekDayNightLegalExtTime__c)
              , weekDayNightLegalOutTime      : teasp.util.time.timeValue(em.WeekDayNightLegalOutTime__c)
              , weekEndDayLegalTime           : teasp.util.time.timeValue(em.WeekEndDayLegalTime__c     )
              , weekEndDayLegalOutTime        : teasp.util.time.timeValue(em.WeekEndDayLegalOutTime__c  )
              , weekEndNightLegalTime         : teasp.util.time.timeValue(em.WeekEndNightLegalTime__c   )
              , weekEndNightLegalOutTime      : teasp.util.time.timeValue(em.WeekEndNightLegalOutTime__c)
              , holidayDayTime                : teasp.util.time.timeValue(em.HolidayDayTime__c          )
              , holidayNightTime              : teasp.util.time.timeValue(em.HolidayNightTime__c        )
              , absentCount                   : (em.AbsentCount__c                || 0)        // 無給休暇日数
              , plannedHolidayCount           : (em.PlannedHolidayCount__c        || 0)        // 計画付与有休
              , workPublicHolidayCount        : (em.WorkPublicHolidayCount__c     || 0)        // 祝日出勤日数
              , lostTime                      : teasp.util.time.timeValue(em.LostTime__c)      // 控除時間
              , workOffTime                   : teasp.util.time.timeValue(em.WorkOffTime__c)   // 休憩時間
              , workOverTime                  : teasp.util.time.timeValue(em.WorkOverTime__c)  // 残業時間
              , daiqHolidayCount              : (em.DaiqHolidayCount__c           || 0)  // 代休取得日数
              , legalWorkTimeOfPeriod         : (em.LegalWorkTimeOfPeriod__c      || 0)  // 変形期間法定労働時間
              , workLegalTimePeriod           : (em.WorkLegalTimePeriod__c        || 0)  // 変形期間内法定時間内労働時間
              , workLegalOutOverTimePeriod    : (em.WorkLegalOutOverTimePeriod__c || 0)  // 変形期間内超過時間
              , periodWorkOverCount36         : (em.PeriodWorkOverCount36__c      || 0)  // 当四半期の超過回数
              , flexWeekend                   : (em.FlexWeekend__c                || 0)  // フレックス所定休日
              , flexWeekendNight              : (em.FlexWeekendNight__c           || 0)  // フレックス所定休日夜間
              , daiqAllocated                 : (em.DaiqAllocated__c              || 0)  // 代休発生日数
              , daiqAllocatedHoliday          : (em.DaiqAllocatedHoliday__c       || 0)  // 代休発生日数(所)
              , daiqAllocatedLegalHoliday     : (em.DaiqAllocatedLegalHoliday__c  || 0)  // 代休発生日数(法)
              , daiqConsumedHoliday           : (em.DaiqConsumedHoliday__c        || 0)  // 代休消化日数(所)
              , daiqConsumedLegalHoliday      : (em.DaiqConsumedLegalHoliday__c   || 0)  // 代休消化日数(法)
              , daiqExpired                   : (daiqExpired                      || 0)  // 代休失効日数
              , daiqExpiredHoliday            : (em.DaiqExpiredHoliday__c         || 0)  // 代休失効日数(所)
              , daiqExpiredLegalHoliday       : (em.DaiqExpiredLegalHoliday__c    || 0)  // 代休失効日数(法)
              , daiqRemain                    : (em.DaiqRemain__c                 || 0)  // 代休残日数
              , daiqRemainHoliday             : (em.DaiqRemainHoliday__c          || 0)  // 代休残日数(所)
              , daiqRemainLegalHoliday        : (em.DaiqRemainLegalHoliday__c     || 0)  // 代休残日数(法)
              , daiqAllocatedHolidayTime      : (daiqAllocatedHolidayTime         || 0)  // 所定休日代休発生時間
              , daiqAllocatedLegalHolidayTime : (daiqAllocatedLegalHolidayTime    || 0)  // 法定休日代休発生時間
              , workLegalOverTimeEx           : (workLegalOverTimeEx              || 0)  // 法定時間内残業(代休調整済)
              , workOverTimeEx                : (workOverTimeEx                   || 0)  // 残業時間(代休調整済)
              , workHolidayTimeEx             : (workHolidayTimeEx                || 0)  // 法定休日労働(代休調整済)
              , exchangeFromPrev              : (em.ExchangeFromPrev__c           || 0)  // 前月からの振替日数
              , exchangeToNext                : (em.ExchangeToNext__c             || 0)  // 来月への振替日数
              , orgWorkFixedDay               : (em.OrgWorkFixedDay__c            || 0)  // 振替前の所定勤務日数
              , workHolidayCountWoCH          : (em.WorkHolidayCountWoCH__c       || 0)  // 休日出勤日数(振替休日なし)
              , workHolidayCountWithCH        : (em.WorkHolidayCountWithCH__c     || 0)  // 休日出勤日数(振替休日あり)
              , legalOverTimeEm               : (legalOverTimeEm                  || 0)  // 法定時間内残業(除みなし)
              , legalOutOverTimeEm            : (legalOutOverTimeEm               || 0)  // 法定時間外残業(除みなし)
        };
        value += '"月次サマリー'
            + '","' + monthSum.empName
            + '","' + monthSum.empCode
            + '","' + monthSum.yearMonth
            + '","' + monthSum.status
            + '","' + monthSum.deptName
            + '","' + monthSum.deptCode
            + '","' + monthSum.empTypeName
            + '","' + monthSum.workSystem
            + '","' + monthSum.fixdays
            + '","' + monthSum.realdays
            + '","' + monthSum.workLegalHolidays
            + '","' + monthSum.workHolidays
            + '","' + monthSum.workFixedTime
            + '","' + monthSum.workWholeTime
            + '","' + monthSum.workWholeOmitHolidayTime
            + '","' + monthSum.workRealOmitHolidayTime
            + '","' + monthSum.workRealTime
            + '","' + monthSum.workNetTime
            + '","' + monthSum.amountTime
            + '","' + monthSum.legalOverTime
            + '","' + monthSum.legalOutOverTime
            + '","' + monthSum.workHolidayTime
            + '","' + monthSum.workNightTime
            + '","' + monthSum.workChargeTime
            + '","' + monthSum.workOver45Time
            + '","' + monthSum.workOver60Time
            + '","' + monthSum.lateCount
            + '","' + monthSum.lateTime
            + '","' + monthSum.lateLostTime
            + '","' + monthSum.earlyCount
            + '","' + monthSum.earlyTime
            + '","' + monthSum.earlyLostTime
            + '","' + monthSum.privateInnerCount
            + '","' + monthSum.privateInnerTime
            + '","' + monthSum.privateInnerLostTime
            + '","' + monthSum.paidHolidayCount
            + '","' + monthSum.paidRestTime
            + '","' + monthSum.yuqRemain
            + '","' + monthSum.yuqRemainHour
            + '","' + monthSum.yuqExpiredDays
            + '","' + monthSum.yuqProvideDays
            + '","' + monthSum.workOverTime36
            + '","' + monthSum.totalWorkOverTime36
            + '","' + monthSum.totalWorkOverCount36
            + '","' + monthSum.quartWorkOverTime36
            + '","' + monthSum.workOver40perWeek
            + '","' + monthSum.weekDayDayLegalFixTime
            + '","' + monthSum.weekDayDayLegalExtTime
            + '","' + monthSum.weekDayDayLegalOutTime
            + '","' + monthSum.weekDayNightLegalFixTime
            + '","' + monthSum.weekDayNightLegalExtTime
            + '","' + monthSum.weekDayNightLegalOutTime
            + '","' + monthSum.weekEndDayLegalTime
            + '","' + monthSum.weekEndDayLegalOutTime
            + '","' + monthSum.weekEndNightLegalTime
            + '","' + monthSum.weekEndNightLegalOutTime
            + '","' + monthSum.holidayDayTime
            + '","' + monthSum.holidayNightTime
            + '","' + monthSum.absentCount
            + '","' + monthSum.plannedHolidayCount
            + '","' + monthSum.workPublicHolidayCount
            + '","' + monthSum.lostTime
            + '","' + monthSum.workOffTime
            + '","' + monthSum.workOverTime
            + '","' + monthSum.daiqHolidayCount
            + '","' + monthSum.legalWorkTimeOfPeriod
            + '","' + monthSum.workLegalTimePeriod
            + '","' + monthSum.workLegalOutOverTimePeriod
            + '"\r\n';
        value += '"データ出力'
            + '","' + empMonth.empName
            + '","' + empMonth.empCode
            + '","' + empMonth.yearMonth
            + '","' + empMonth.status
            + '","' + empMonth.deptName
            + '","' + empMonth.deptCode
            + '","' + empMonth.empTypeName
            + '","' + empMonth.workSystem
            + '","' + empMonth.fixdays
            + '","' + empMonth.realdays
            + '","' + empMonth.workLegalHolidays
            + '","' + empMonth.workHolidays
            + '","' + empMonth.workFixedTime
            + '","' + empMonth.workWholeTime
            + '","' + empMonth.workWholeOmitHolidayTime
            + '","' + empMonth.workRealOmitHolidayTime
            + '","' + empMonth.workRealTime
            + '","' + empMonth.workNetTime
            + '","' + empMonth.amountTime
            + '","' + empMonth.legalOverTime
            + '","' + empMonth.legalOutOverTime
            + '","' + empMonth.workHolidayTime
            + '","' + empMonth.workNightTime
            + '","' + empMonth.workChargeTime
            + '","' + empMonth.workOver45Time
            + '","' + empMonth.workOver60Time
            + '","' + empMonth.lateCount
            + '","' + empMonth.lateTime
            + '","' + empMonth.lateLostTime
            + '","' + empMonth.earlyCount
            + '","' + empMonth.earlyTime
            + '","' + empMonth.earlyLostTime
            + '","' + empMonth.privateInnerCount
            + '","' + empMonth.privateInnerTime
            + '","' + empMonth.privateInnerLostTime
            + '","' + empMonth.paidHolidayCount
            + '","' + empMonth.paidRestTime
            + '","' + empMonth.yuqRemain
            + '","' + empMonth.yuqRemainHour
            + '","' + empMonth.yuqExpiredDays
            + '","' + empMonth.yuqProvideDays
            + '","' + empMonth.workOverTime36
            + '","' + empMonth.totalWorkOverTime36
            + '","' + empMonth.totalWorkOverCount36
            + '","' + empMonth.quartWorkOverTime36
            + '","' + empMonth.workOver40perWeek
            + '","' + empMonth.weekDayDayLegalFixTime
            + '","' + empMonth.weekDayDayLegalExtTime
            + '","' + empMonth.weekDayDayLegalOutTime
            + '","' + empMonth.weekDayNightLegalFixTime
            + '","' + empMonth.weekDayNightLegalExtTime
            + '","' + empMonth.weekDayNightLegalOutTime
            + '","' + empMonth.weekEndDayLegalTime
            + '","' + empMonth.weekEndDayLegalOutTime
            + '","' + empMonth.weekEndNightLegalTime
            + '","' + empMonth.weekEndNightLegalOutTime
            + '","' + empMonth.holidayDayTime
            + '","' + empMonth.holidayNightTime
            + '","' + empMonth.absentCount
            + '","' + empMonth.plannedHolidayCount
            + '","' + empMonth.workPublicHolidayCount
            + '","' + empMonth.lostTime
            + '","' + empMonth.workOffTime
            + '","' + empMonth.workOverTime
            + '","' + empMonth.daiqHolidayCount
            + '","' + empMonth.legalWorkTimeOfPeriod
            + '","' + empMonth.workLegalTimePeriod
            + '","' + empMonth.workLegalOutOverTimePeriod
            + '"\r\n';
        value += '"差異'
            + '","' + tsq.QueryObj.diffMark(empMonth.empName                     ,monthSum.empName                 )
            + '","' + tsq.QueryObj.diffMark(empMonth.empCode                     ,monthSum.empCode                 )
            + '","' + tsq.QueryObj.diffMark(empMonth.yearMonth                   ,monthSum.yearMonth               )
            + '","' + tsq.QueryObj.diffMark(empMonth.status                      ,monthSum.status                  )
            + '","' + tsq.QueryObj.diffMark(empMonth.deptName                    ,monthSum.deptName                )
            + '","' + tsq.QueryObj.diffMark(empMonth.deptCode                    ,monthSum.deptCode                )
            + '","' + tsq.QueryObj.diffMark(empMonth.empTypeName                 ,monthSum.empTypeName             )
            + '","' + tsq.QueryObj.diffMark(empMonth.workSystem                  ,monthSum.workSystem              )
            + '","' + tsq.QueryObj.diffMark(empMonth.fixdays                     ,monthSum.fixdays                 )
            + '","' + tsq.QueryObj.diffMark(empMonth.realdays                    ,monthSum.realdays                )
            + '","' + tsq.QueryObj.diffMark(empMonth.workLegalHolidays           ,monthSum.workLegalHolidays       )
            + '","' + tsq.QueryObj.diffMark(empMonth.workHolidays                ,monthSum.workHolidays            )
            + '","' + tsq.QueryObj.diffMark(empMonth.workFixedTime               ,monthSum.workFixedTime           )
            + '","' + tsq.QueryObj.diffMark(empMonth.workWholeTime               ,monthSum.workWholeTime           )
            + '","' + tsq.QueryObj.diffMark(empMonth.workWholeOmitHolidayTime    ,monthSum.workWholeOmitHolidayTime)
            + '","' + tsq.QueryObj.diffMark(empMonth.workRealOmitHolidayTime     ,monthSum.workRealOmitHolidayTime )
            + '","' + tsq.QueryObj.diffMark(empMonth.workRealTime                ,monthSum.workRealTime            )
            + '","' + tsq.QueryObj.diffMark(empMonth.workNetTime                 ,monthSum.workNetTime             )
            + '","' + tsq.QueryObj.diffMark(empMonth.amountTime                  ,monthSum.amountTime              )
            + '","' + tsq.QueryObj.diffMark(empMonth.legalOverTime               ,monthSum.legalOverTime           )
            + '","' + tsq.QueryObj.diffMark(empMonth.legalOutOverTime            ,monthSum.legalOutOverTime        )
            + '","' + tsq.QueryObj.diffMark(empMonth.workHolidayTime             ,monthSum.workHolidayTime         )
            + '","' + tsq.QueryObj.diffMark(empMonth.workNightTime               ,monthSum.workNightTime           )
            + '","' + tsq.QueryObj.diffMark(empMonth.workChargeTime              ,monthSum.workChargeTime          )
            + '","' + tsq.QueryObj.diffMark(empMonth.workOver45Time              ,monthSum.workOver45Time          )
            + '","' + tsq.QueryObj.diffMark(empMonth.workOver60Time              ,monthSum.workOver60Time          )
            + '","' + tsq.QueryObj.diffMark(empMonth.lateCount                   ,monthSum.lateCount               )
            + '","' + tsq.QueryObj.diffMark(empMonth.lateTime                    ,monthSum.lateTime                )
            + '","' + tsq.QueryObj.diffMark(empMonth.lateLostTime                ,monthSum.lateLostTime            )
            + '","' + tsq.QueryObj.diffMark(empMonth.earlyCount                  ,monthSum.earlyCount              )
            + '","' + tsq.QueryObj.diffMark(empMonth.earlyTime                   ,monthSum.earlyTime               )
            + '","' + tsq.QueryObj.diffMark(empMonth.earlyLostTime               ,monthSum.earlyLostTime           )
            + '","' + tsq.QueryObj.diffMark(empMonth.privateInnerCount           ,monthSum.privateInnerCount       )
            + '","' + tsq.QueryObj.diffMark(empMonth.privateInnerTime            ,monthSum.privateInnerTime        )
            + '","' + tsq.QueryObj.diffMark(empMonth.privateInnerLostTime        ,monthSum.privateInnerLostTime    )
            + '","' + tsq.QueryObj.diffMark(empMonth.paidHolidayCount            ,monthSum.paidHolidayCount        )
            + '","' + tsq.QueryObj.diffMark(empMonth.paidRestTime                ,monthSum.paidRestTime            )
            + '","' + tsq.QueryObj.diffMark(empMonth.yuqRemain                   ,monthSum.yuqRemain               )
            + '","' + tsq.QueryObj.diffMark(empMonth.yuqRemainHour               ,monthSum.yuqRemainHour           )
            + '","' + tsq.QueryObj.diffMark(empMonth.yuqExpiredDays              ,monthSum.yuqExpiredDays          )
            + '","' + tsq.QueryObj.diffMark(empMonth.yuqProvideDays              ,monthSum.yuqProvideDays          )
            + '","' + tsq.QueryObj.diffMark(empMonth.workOverTime36              ,monthSum.workOverTime36          )
            + '","' + tsq.QueryObj.diffMark(empMonth.totalWorkOverTime36         ,monthSum.totalWorkOverTime36     )
            + '","' + tsq.QueryObj.diffMark(empMonth.totalWorkOverCount36        ,monthSum.totalWorkOverCount36    )
            + '","' + tsq.QueryObj.diffMark(empMonth.quartWorkOverTime36         ,monthSum.quartWorkOverTime36     )
            + '","' + tsq.QueryObj.diffMark(empMonth.workOver40perWeek           ,monthSum.workOver40perWeek       )
            + '","' + tsq.QueryObj.diffMark(empMonth.weekDayDayLegalFixTime      ,monthSum.weekDayDayLegalFixTime  )
            + '","' + tsq.QueryObj.diffMark(empMonth.weekDayDayLegalExtTime      ,monthSum.weekDayDayLegalExtTime  )
            + '","' + tsq.QueryObj.diffMark(empMonth.weekDayDayLegalOutTime      ,monthSum.weekDayDayLegalOutTime  )
            + '","' + tsq.QueryObj.diffMark(empMonth.weekDayNightLegalFixTime    ,monthSum.weekDayNightLegalFixTime)
            + '","' + tsq.QueryObj.diffMark(empMonth.weekDayNightLegalExtTime    ,monthSum.weekDayNightLegalExtTime)
            + '","' + tsq.QueryObj.diffMark(empMonth.weekDayNightLegalOutTime    ,monthSum.weekDayNightLegalOutTime)
            + '","' + tsq.QueryObj.diffMark(empMonth.weekEndDayLegalTime         ,monthSum.weekEndDayLegalTime     )
            + '","' + tsq.QueryObj.diffMark(empMonth.weekEndDayLegalOutTime      ,monthSum.weekEndDayLegalOutTime  )
            + '","' + tsq.QueryObj.diffMark(empMonth.weekEndNightLegalTime       ,monthSum.weekEndNightLegalTime   )
            + '","' + tsq.QueryObj.diffMark(empMonth.weekEndNightLegalOutTime    ,monthSum.weekEndNightLegalOutTime)
            + '","' + tsq.QueryObj.diffMark(empMonth.holidayDayTime              ,monthSum.holidayDayTime          )
            + '","' + tsq.QueryObj.diffMark(empMonth.holidayNightTime            ,monthSum.holidayNightTime        )
            + '","' + tsq.QueryObj.diffMark(empMonth.absentCount                 ,monthSum.absentCount             )
            + '","' + tsq.QueryObj.diffMark(empMonth.plannedHolidayCount         ,monthSum.plannedHolidayCount     )
            + '","' + tsq.QueryObj.diffMark(empMonth.workPublicHolidayCount      ,monthSum.workPublicHolidayCount  )
            + '","' + tsq.QueryObj.diffMark(empMonth.lostTime                    ,monthSum.lostTime                )
            + '","' + tsq.QueryObj.diffMark(empMonth.workOffTime                 ,monthSum.workOffTime             )
            + '","' + tsq.QueryObj.diffMark(empMonth.workOverTime                ,monthSum.workOverTime            )
            + '","' + tsq.QueryObj.diffMark(empMonth.daiqHolidayCount            ,monthSum.daiqHolidayCount          )
            + '","' + tsq.QueryObj.diffMark(empMonth.legalWorkTimeOfPeriod       ,monthSum.legalWorkTimeOfPeriod     )
            + '","' + tsq.QueryObj.diffMark(empMonth.workLegalTimePeriod         ,monthSum.workLegalTimePeriod       )
            + '","' + tsq.QueryObj.diffMark(empMonth.workLegalOutOverTimePeriod  ,monthSum.workLegalOutOverTimePeriod)
            + '"\r\n';
        if(outScript){
            var vf = '';
            var fs = [];
            for(var k = 0 ; k < fsets.length ; k++){
                var fset = fsets[k];
                var z = tsq.QueryObj.diffValue(empMonth, monthSum, fset.key, (fset.key == 'yuqRemain' ? 2 : (fset.key == 'yuqRemainHour' ? 3 : 0)));
                if(z.diff){
                    vf += ('m.' + fset.f + ' = ' + z.ov + ';  // '
                            + (z.typ ? teasp.util.time.timeValue(z.ov) : z.ov)
                            + '(old:'  + (z.typ ? teasp.util.time.timeValue(z.xv)   : z.xv)
                            + ' diff:' + (z.typ ? teasp.util.time.timeValue(z.diff) : z.diff)
                            + ')\r\n');
                    fs.push(',' + fset.f);
                }
            }
            if(fs.length > 0){
                buf += '\r\n//-----------------------------------------------------------\r\n';
                buf += '// ' + empMonth.empName + '(社員コード:' + empMonth.empCode + ', Id:\'' +  empMonth.empId + '\')  ' + empMonth.yearMonth + '\r\n';
                buf += '// 勤務体系名:' + empMonth.empTypeName + ', workSystem:' + empMonth.workSystem + '\r\n';
                buf += 'm = [select Id\r\n';
                buf += fs.join('\r\n');
                buf += '\r\n from AtkEmpMonth__c\r\n where Id = \'' + empMonth.id + '\'];\r\n';
                buf += vf;
                buf += 'l.add(m);\r\n';
                upcnt++;
            }
        }
    }
    if(outScript){
        buf += '\r\nupdate l; // ' + upcnt + '件更新\r\n// end';
        value += buf;
    }

    var heads = '"種類"'
        + ',"社員名"'
        + ',"社員コード"'
        + ',"月度"'
        + ',"ステータス"'
        + ',"部署名"'
        + ',"部署コード"'
        + ',"勤務体系名"'
        + ',"労働時間制"'
        + ',"所定出勤日数"'
        + ',"実出勤日数"'
        + ',"法定休日出勤日数"'
        + ',"所定休日出勤日数"'
        + ',"所定労働時間"'
        + ',"総労働時間"'
        + ',"総労働時間－法定休日労働"'
        + ',"実労働時間－法定休日労働"'
        + ',"実労働時間"'
        + ',"ネット労働時間"'
        + ',"過不足時間"'
        + ',"法定時間内残業"'
        + ',"法定時間外残業"'
        + ',"法定休日労働時間"'
        + ',"深夜労働時間"'
        + ',"法定時間外割増"'
        + ',"45時間を超える時間外労働"'
        + ',"60時間を超える時間外労働"'
        + ',"遅刻回数"'
        + ',"遅刻時間"'
        + ',"遅刻控除"'
        + ',"早退回数"'
        + ',"早退時間"'
        + ',"早退控除"'
        + ',"私用外出回数"'
        + ',"私用外出時間"'
        + ',"私用外出控除"'
        + ',"有休取得日数"'
        + ',"時間単位有休"'
        + ',"有休残日数"'
        + ',"有休残時間"'
        + ',"有休失効日数"'
        + ',"有休付与日数"'
        + ',"当月度の超過時間"'
        + ',"当年度の超過時間"'
        + ',"当年度の超過回数"'
        + ',"当四半期の超過時間"'
        + ',"安全配慮上の超過時間"'
        + ',"平日日中法内所定"'
        + ',"平日日中法内残業"'
        + ',"平日日中法外"'
        + ',"平日深夜法内所定"'
        + ',"平日深夜法内残業"'
        + ',"平日深夜法外"'
        + ',"休日日中法内"'
        + ',"休日日中法外"'
        + ',"休日深夜法内"'
        + ',"休日深夜法外"'
        + ',"法定休日日中"'
        + ',"法定休日深夜"'
        + ',"無給休暇日数"'
        + ',"計画付与有休"'
        + ',"祝日出勤日数"'
        + ',"控除時間"'
        + ',"休憩時間"'
        + ',"残業時間"'
        + ',"代休取得日数"'
        + ',"変形期間法定労働時間"'
        + ',"変形期間内法定時間内労働時間"'
        + ',"変形期間内超過時間"'
        ;
    this.inputDownload(heads, value, 'monthlySummary_' + this.folder.month + '.csv');
    teasp.manager.dialogClose('BusyWait');
};

tsq.QueryObj.prototype.converYuqRemain = function(){
    var l = this.folder.empYuqs;
    for(var i = 0 ; i < l.length ; i++){
        var y = l[i];
        y.Date__c      = teasp.logic.convert.valDate(y.Date__c);
        y.StartDate__c = teasp.logic.convert.valDate(y.StartDate__c);
        y.LimitDate__c = teasp.logic.convert.valDate(y.LimitDate__c);
        for(var j = 0 ; j < y.EmpYuqGroupR__r.length ; j++){
            var d = y.EmpYuqGroupR__r[j];
            d.EmpYuqId__r.Date__c = teasp.logic.convert.valDate(d.EmpYuqId__r.Date__c);
            if(d.EmpYuqId__r.EmpApplyId__r){
                d.EmpYuqId__r.EmpApplyId__r.StartDate__c   = teasp.logic.convert.valDate(d.EmpYuqId__r.EmpApplyId__r.StartDate__c);
                d.EmpYuqId__r.EmpApplyId__r.EndDate__c     = teasp.logic.convert.valDate(d.EmpYuqId__r.EmpApplyId__r.EndDate__c);
            }
        }
    }
};

tsq.QueryObj.prototype.getYuqRemain = function(empId, sd, ed, calZanFlag){
    var l = this.folder.empYuqs;
    var nd = teasp.util.date.addDays(ed, 1);
    var ys = [];
    for(var i = 0 ; i < l.length ; i++){
        var y = l[i];
        if(y.EmpId__c == empId && y.StartDate__c < nd && y.LimitDate__c >= sd){
            ys.push(y);
        }
    }
    var remainY = new teasp.logic.YuqDays();
    var providY = new teasp.logic.YuqDays();
    var spendY  = new teasp.logic.YuqDays();
    var expireY = new teasp.logic.YuqDays();
    for(var i = 0 ; i < ys.length ; i++){
        var y = ys[i];
        var sumP = 0;
        var sumS = 0;
        var thiS = 0;
        for(var j = 0 ; j < y.EmpYuqGroupR__r.length ; j++){
            var d = y.EmpYuqGroupR__r[j];
            if(d.Time__c > 0 || d.EmpYuqId__r.LostFlag__c){
                sumP += d.Time__c;
            }else if(d.EmpYuqId__r.Date__c < nd){
                sumS += this.getEncloseSpendTimes(d, ed, calZanFlag);
                if(sumP > 0 && sd <= d.EmpYuqId__r.EmpApplyId__r.EndDate__c){
                    thiS -= this.getEncloseSpendTimes(d, ed, calZanFlag);
                }
            }
        }
        if(sumP > 0 && sd <= y.StartDate__c){
            providY.append(new teasp.logic.YuqDays(y.BaseTime__c, sumP));
        }
        if(y.LimitDate__c > nd){
            remainY.append(new teasp.logic.YuqDays(y.BaseTime__c, sumP + sumS));
        }
        if(y.LimitDate__c <= nd && y.LimitDate__c > sd){
            expireY.append(new teasp.logic.YuqDays(y.BaseTime__c, sumP + sumS));
        }
        spendY.append(new teasp.logic.YuqDays(y.BaseTime__c, thiS));
    }
    return {
        remain  : remainY,
        spend   : spendY ,
        provide : providY,
        expire  : expireY
    };
};
tsq.QueryObj.prototype.getEncloseSpendTimes = function(child, dt, calZanFlag){
    var d  = child.EmpYuqId__r.EmpApplyId__r.StartDate__c; // {string} 'yyyy-MM-dd'
    var ed = child.EmpYuqId__r.EmpApplyId__r.EndDate__c;   // {string} 'yyyy-MM-dd'
    if(d == ed || !calZanFlag){
        return child.Time__c;
    }
    var exd = (child.EmpYuqId__r.EmpApplyId__r.ExcludeDate__c || '').split(/:/); // {string} 'yyyyMMdd:yyyyMMdd:...'
    var exm = {};
    for(var i = 0 ; i < exd.length ; i++){
        var m = /(\d{4})(\d{2})(\d{2})/.exec(exd[i]);
        if(m){
            var k = m[1] + '-' + m[2] + '-' + m[3];
            exm[k] = 1;
        }
    }
    var spn1 = 0;
    var spn2 = 0;
    while(d <= ed){
        if(!exm[d]){
            spn1++;
            if(d <= dt){
                spn2++;
            }
        }
        d = teasp.util.date.addDays(d, 1);
    }
    if(spn1 > spn2){
        return (child.Time__c * spn2 / spn1);
    }
    return child.Time__c;
};
