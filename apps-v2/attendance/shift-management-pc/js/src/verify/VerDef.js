teasp.provide('teasp.verify.VerDef');
/**
 *
 */
teasp.verify.VerDef = function(){
};

teasp.verify.VerDef.getNames = function(fields){
    var lst = [];
    for(var i = 0 ; i < fields.length ; i++){
        if(!fields[i].name || fields[i].viewOnly || fields[i].viewVal){
            continue;
        }
        lst.push(fields[i].name);
    }
    return lst.join(',');
};

teasp.verify.VerDef.parse = function(obj, field, key){
    var o = teasp.verify.VerDef.parseSimple(obj, (key || field.name));
    o.orgValue = o.value;
    o.value = (field.method ? field.method(o.value, obj) : o.value);
    o.dispValue = o.value;
    o.align = 'left';
    if(o.spec){
        if(field.dataType == 'DATETIME'){
            o.dispValue = teasp.util.date.formatDateTime(o.value);
        }else if(field.dataType == 'DATE'){
            o.dispValue = teasp.util.date.formatDate(o.value);
        }
        if(field.type == 't'){
            o.dispValue = teasp.util.time.timeValue(o.value);
        }
    }
    if(field.type == 't' || field.type == 'n' || field.type == 'np'){
        o.align = 'right';
    }
    return o;
};

teasp.verify.VerDef.parseSimple = function(obj, key){
    var spec = false;
    var keys = key.split('.');
    var v = obj;
    for(var i = 0 ; i < keys.length ; i++){
        var k = keys[i];
        if(v && typeof(v[k]) !== 'undefined'){
            if(i == (keys.length - 1)){
                spec = true;
            }
            v = v[k];
        }else{
            v = null;
            break;
        }
    }
    return {
        value   : v,
        spec    : spec
    };
};

teasp.verify.VerDef.getWorkSystem = function(v){
    return { '0':'固定時間制', '1':'フレックスタイム制', '2':'変形労働時間制', '3':'管理監督' }[v] || '';
};

teasp.verify.VerDef.getAmountTime = function(v, obj){
    if(obj.config && obj.config.workSystem == '1'){
        return v;
    }else if(obj.ConfigId__r){
        return v;
    }
    return null;
};

teasp.verify.VerDef.getCarryforwardTime = function(v, obj){
    if(obj.config && obj.config.workSystem == '1'){
        return v;
    }else if(obj.ConfigId__r){
        return v;
    }
    return null;
};

teasp.verify.VerDef.getSettlementTime = function(v, obj){
    if(obj.config && obj.config.workSystem == '1'){
        return v;
    }else if(obj.ConfigId__r){
        return v;
    }
    return null;
};

teasp.verify.VerDef.getAvg50week = function(v, obj){
    if(obj.config && obj.config.workSystem == '1'){
        return v;
    }
    return null;
};

teasp.verify.VerDef.getAdditionalWorkChargeTime = function(v, obj){
    if(obj.config && obj.config.workSystem == '2'){
        return v || '';
    }else if(obj.ConfigId__r){
        return v;
    }
    return null;
};

teasp.verify.VerDef.getYesNo = function(v){
	return (v ? 'Yes' : 'No');
};

teasp.verify.VerDef.EmpMonthFields = [
  { label: '社員ID'                       , name: 'EmpId__c'                           , dataType: 'REFERENCE' , type: 's'  },
  { label: '社員名'                       , name: 'EmpId__r.Name'                      , dataType: 'STRING'    , type: 's'  },
  { label: '勤務体系'                     , name: 'EmpTypeId__r.Name'                  , dataType: 'REFERENCE' , type: 's'  },
  { label: '労働時間制'                   , name: 'ConfigId__r.WorkSystem__c'          , dataType: 'STRING'    , type: 'p' , method: teasp.verify.VerDef.getWorkSystem },
  { label: '適用期間'                     , name: 'ConfigId__r.VariablePeriod__c'      , dataType: 'STRING'    , type: 'n'  },
  { label: '裁量労働制の採用'             , name: 'ConfigId__r.UseDiscretionary__c'    , dataType: 'BOOLEAN'   , type: 'p' , method: teasp.verify.VerDef.getYesNo      },
  { label: '残業と控除の相殺をしない'     , name: 'ConfigId__r.DeductWithFixedTime__c' , dataType: 'BOOLEAN'   , type: 'p' , method: teasp.verify.VerDef.getYesNo      },
  { label: '月度'                         , name: 'YearMonth__c'                       , dataType: 'DOUBLE'    , type: 'n'  },
  { label: 'サブナンバー'                 , name: 'SubNo__c'                           , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '起算日'                       , name: 'StartDate__c'                       , dataType: 'DATE'      , type: 's'  },
  { label: '締め日'                       , name: 'EndDate__c'                         , dataType: 'DATE'      , type: 's'  },
  { label: '起算情報変更日'               , name: 'InitialDate__c'                     , dataType: 'DATE'      , type: 's'  },
  { label: '申請ID'                       , name: 'EmpApplyId__c'                      , dataType: 'REFERENCE' , type: 's'  },
  { label: 'ステータス'                   , name: 'EmpApplyId__r.Status__c'            , dataType: 'STRING'    , type: 's'  },
  {},
  { label: '所定出勤日数'                 , name: 'WorkFixedDay__c'                    , dataType: 'DOUBLE'    , type: 'np' },
  { label: '実出勤日数'                   , name: 'WorkRealDay__c'                     , dataType: 'DOUBLE'    , type: 'np' },
  { label: '法定休日出勤日数'             , name: 'WorkLegalHolidayCount__c'           , dataType: 'DOUBLE'    , type: 'np' },
  { label: '休日出勤日数'                 , name: 'WorkHolidayCount__c'                , dataType: 'DOUBLE'    , type: 'np' },
  { label: '祝日出勤日数'                 , name: 'WorkPublicHolidayCount__c'          , dataType: 'DOUBLE'    , type: 'np' },
  {},
  { label: '所定労働時間'                 , name: 'WorkFixedTime__c'                   , dataType: 'DOUBLE'    , type: 't'  },
  { label: '総労働時間'                   , name: 'WorkWholeTime__c'                   , dataType: 'DOUBLE'    , type: 't'  },
  { label: '総労働・法休(含有休)'         , name: 'WholeWorkTimeWoLH__c'               , dataType: 'DOUBLE'    , type: 't'  },
  { label: '実労働時間'                   , name: 'WorkRealTime__c'                    , dataType: 'DOUBLE'    , type: 't'  },
  { label: 'ネット労働時間'               , name: 'WorkNetTime__c'                     , dataType: 'DOUBLE'    , type: 't'  },
  {},
  { label: '過不足時間'                   , name: 'AmountTime__c'                      , dataType: 'DOUBLE'    , type: 't' , method: teasp.verify.VerDef.getAmountTime },
  { label: '当月清算時間'                 , name: 'SettlementTime__c'                  , dataType: 'DOUBLE'    , type: 't' , method: teasp.verify.VerDef.getSettlementTime },
  { label: '繰越時間'                     , name: 'CarryforwardTime__c'                , dataType: 'DOUBLE'    , type: 't' , method: teasp.verify.VerDef.getCarryforwardTime },
  { label: '経過月'                       , name: 'ElapsedMonth__c'                    , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '前月からの繰越時間'           , name: 'carryforwardFromPrev'               , dataType: 'DOUBLE'    , type: 't' , viewVal:true, method: teasp.verify.VerDef.getCarryforwardTime },
  { label: '週平均50H基準時間'            , name: 'avg50week'                          , dataType: 'DOUBLE'    , type: 't' , viewVal:true, method: teasp.verify.VerDef.getAvg50week },
  { label: '実適用期間'                   , name: 'numberOfMonths'                     , dataType: 'DOUBLE'    , type: 'n' , viewVal:true },
  {},
  { label: '月の法定労働時間'             , name: 'LegalWorkTime__c'                   , dataType: 'DOUBLE'    , type: 't'  },
  { label: '実労働・法休(除有休)'         , name: 'RealWorkTimeWoLH__c'                , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定時間内残業'               , name: 'WorkLegalOverTime__c'               , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定時間外残業'               , name: 'WorkLegalOutOverTime__c'            , dataType: 'DOUBLE'    , type: 't'  },
  { label: '残業時間'                     , name: 'WorkOverTime__c'                    , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定休日労働時間'             , name: 'HolidayWorkTime__c'                 , dataType: 'DOUBLE'    , type: 't'  },
  {},
  { label: '深夜労働時間'                 , name: 'WorkNightTime__c'                   , dataType: 'DOUBLE'    , type: 't'  },
  { label: '割増労働時間'                 , name: 'WorkChargeTime__c'                  , dataType: 'DOUBLE'    , type: 't'  },
  { label: '追加割増労働時間'             , name: 'AdditionalWorkChargeTime__c'        , dataType: 'DOUBLE'    , type: 't' , method: teasp.verify.VerDef.getAdditionalWorkChargeTime },
  { label: '４５時間超残業'               , name: 'WorkOver45Time__c'                  , dataType: 'DOUBLE'    , type: 't'  },
  { label: '６０時間超残業'               , name: 'WorkOver60Time__c'                  , dataType: 'DOUBLE'    , type: 't'  },
  {},
  { label: '遅刻回数'                     , name: 'LateCount__c'                       , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '遅刻時間'                     , name: 'LateTime__c'                        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '控除遅刻時間'                 , name: 'LateLostTime__c'                    , dataType: 'DOUBLE'    , type: 't'  },
  { label: '早退回数'                     , name: 'EarlyCount__c'                      , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '早退時間'                     , name: 'EarlyTime__c'                       , dataType: 'DOUBLE'    , type: 't'  },
  { label: '控除早退時間'                 , name: 'EarlyLostTime__c'                   , dataType: 'DOUBLE'    , type: 't'  },
  { label: '勤務時間内私用外出回数'       , name: 'PrivateInnerCount__c'               , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '勤務時間内私用外出時間'       , name: 'PrivateInnerTime__c'                , dataType: 'DOUBLE'    , type: 't'  },
  { label: '控除私用外出時間'             , name: 'PrivateInnerLostTime__c'            , dataType: 'DOUBLE'    , type: 't'  },
  { label: '控除時間'                     , name: 'LostTime__c'                        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休暇控除時間'                 , name: 'HolidayDeductionTime__c'            , dataType: 'DOUBLE'    , type: 't'  },
  {},
  { label: '36協定対象残業時間'           , name: 'WorkOverTime36__c'                  , dataType: 'DOUBLE'    , type: 't'  },
  { label: '4半期36協定対象残業時間'      , name: 'PeriodWorkOverTime36__c'            , dataType: 'DOUBLE'    , type: 't'  },
  { label: '累計３６協定対象残業時間'     , name: 'TotalWorkOverTime36__c'             , dataType: 'DOUBLE'    , type: 't'  },
  { label: '累計３６協定超過回数'         , name: 'TotalWorkOverCount36__c'            , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '週４０時間超労働時間'         , name: 'WorkOver40perWeek__c'               , dataType: 'DOUBLE'    , type: 't'  },
  {},
  { label: '有休取得日数'                 , name: 'PaidHolidayCount__c'                , dataType: 'DOUBLE'    , type: 'np' },
  { label: '時間単位有休取得時間'         , name: 'PaidRestTime__c'                    , dataType: 'DOUBLE'    , type: 't'  },
  { label: '有休残日数'                   , name: 'YuqRemainDays__c'                   , dataType: 'DOUBLE'    , type: 'np' },
  { label: '有休残時間'                   , name: 'YuqRemainHour__c'                   , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '無給休暇日数'                 , name: 'AbsentCount__c'                     , dataType: 'DOUBLE'    , type: 'np' },
  {},
  { label: '平日日中法内所定'             , name: 'WeekDayDayLegalFixTime__c'          , dataType: 'DOUBLE'    , type: 't'  },
  { label: '平日日中法内残業'             , name: 'WeekDayDayLegalExtTime__c'          , dataType: 'DOUBLE'    , type: 't'  },
  { label: '平日日中法外'                 , name: 'WeekDayDayLegalOutTime__c'          , dataType: 'DOUBLE'    , type: 't'  },
  { label: '平日深夜法内所定'             , name: 'WeekDayNightLegalFixTime__c'        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '平日深夜法内残業'             , name: 'WeekDayNightLegalExtTime__c'        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '平日深夜法外'                 , name: 'WeekDayNightLegalOutTime__c'        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休日日中法内'                 , name: 'WeekEndDayLegalTime__c'             , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休日日中法外'                 , name: 'WeekEndDayLegalOutTime__c'          , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休日深夜法内'                 , name: 'WeekEndNightLegalTime__c'           , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休日深夜法外'                 , name: 'WeekEndNightLegalOutTime__c'        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定休日日中'                 , name: 'HolidayDayTime__c'                  , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定休日深夜'                 , name: 'HolidayNightTime__c'                , dataType: 'DOUBLE'    , type: 't'  },
  {},
  { label: '休日日中所定'                 , name: 'WeekEndDayLegalFixTime__c'          , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休日深夜所定'                 , name: 'WeekEndNightLegalFixTime__c'        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定休日日中所定'             , name: 'HolidayDayFixTime__c'               , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定休日深夜所定'             , name: 'HolidayNightFixTime__c'             , dataType: 'DOUBLE'    , type: 't'  },
  { label: '割増労働時間・所定休日'       , name: 'HolidayWorkChargeTime__c'           , dataType: 'DOUBLE'    , type: 't'  },
  {},
  { label: '所定休日労働時間'             , name: 'WeekEndWorkTime__c'                 , dataType: 'DOUBLE'    , type: 't'  },
  { label: '深夜勤務割増'                 , name: 'NightChargeTime__c'                 , dataType: 'DOUBLE'    , type: 't'  },
  { label: '深夜労働時間・集計'           , name: 'WorkNightTimeS__c'                  , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休憩時間'                     , name: 'WorkOffTime__c'                     , dataType: 'DOUBLE'    , type: 't'  },
  { label: '公用外出時間'                 , name: 'WorkAwayTime__c'                    , dataType: 'DOUBLE'    , type: 't'  },
  { label: '私用外出回数'                 , name: 'PrivateCount__c'                    , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '勤務時間外私用外出時間'       , name: 'PrivateOuterTime__c'                , dataType: 'DOUBLE'    , type: 't'  },
  { label: '4半期36協定超過回数'          , name: 'PeriodWorkOverCount36__c'           , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定休日勤務日数1'            , name: 'LegalWorkHolidayCountBelow4__c'     , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '法定休日勤務日数2'            , name: 'LegalWorkHolidayCountOver4__c'      , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '計画付与有休取得日数'         , name: 'PlannedHolidayCount__c'             , dataType: 'DOUBLE'    , type: 'np' },
  { label: '無給休暇日数(暦日)'           , name: 'AbsentCount2__c'                    , dataType: 'DOUBLE'    , type: 'np' },
  { label: '慶弔休暇'                     , name: 'SUMH_YYYY__c'                       , dataType: 'DOUBLE'    , type: 'np' },
  { label: '有休失効日数'                 , name: 'YuqExpiredDays__c'                  , dataType: 'DOUBLE'    , type: 'np' },
  { label: '有休付与日数'                 , name: 'YuqProvideDays__c'                  , dataType: 'DOUBLE'    , type: 'np' },
  { label: '有休付与ログ'                 , name: 'YuqLog__c'                          , dataType: 'TEXTAREA'  , type: 's'  },
  {},
  { label: '所定休日代休発生'             , name: 'AddedHolidayDaiq__c'                , dataType: 'DOUBLE'    , type: 'np' },
  { label: '法定休日代休発生'             , name: 'AddedLegalHolidayDaiq__c'           , dataType: 'DOUBLE'    , type: 'np' },
  { label: '代休発生日数'                 , name: 'DaiqAllocated__c'                   , dataType: 'DOUBLE'    , type: 'np' },
  { label: '代休発生日数(法)'             , name: 'DaiqAllocatedLegalHoliday__c'       , dataType: 'DOUBLE'    , type: 'np' },
  { label: '代休消化日数'                 , name: 'DaiqConsumed__c'                    , dataType: 'DOUBLE'    , type: 'np' },
  { label: '代休消化日数(法)'             , name: 'DaiqConsumedLegalHoliday__c'        , dataType: 'DOUBLE'    , type: 'np' },
  { label: '代休取得日数'                 , name: 'DaiqHolidayCount__c'                , dataType: 'DOUBLE'    , type: 'np' },
  { label: '代休残日数'                   , name: 'DaiqRemain__c'                      , dataType: 'DOUBLE'    , type: 'np' },
  { label: '代休残日数(法)'               , name: 'DaiqRemainLegalHoliday__c'          , dataType: 'DOUBLE'    , type: 'np' },
  { label: '代休失効日数'                 , name: 'DaiqExpired__c'                     , dataType: 'DOUBLE'    , type: 'np' },
  { label: '代休失効日数(法)'             , name: 'DaiqExpiredLegalHoliday__c'         , dataType: 'DOUBLE'    , type: 'np' },
  { label: '期限切れ代休日数'             , name: 'ExpiredDaiqCount__c'                , dataType: 'DOUBLE'    , type: 'np' },
  { label: '所定休日代休消化'             , name: 'UsedHolidayDaiq__c'                 , dataType: 'DOUBLE'    , type: 'np' },
  { label: '法定休日代休消化'             , name: 'UsedLegalHolidayDaiq__c'            , dataType: 'DOUBLE'    , type: 'np' },
  { label: '所定休日勤務日数(振休あり1)'  , name: 'WorkHolidayCountWithCHBelow4__c'    , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '所定休日勤務日数(振休あり2)'  , name: 'WorkHolidayCountWithCHOver4__c'     , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '所定休日勤務日数(振休なし1)'  , name: 'WorkHolidayCountWoCHBelow4__c'      , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '所定休日勤務日数(振休なし2)'  , name: 'WorkHolidayCountWoCHOver4__c'       , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '休日出勤日数(振替休日あり)'   , name: 'WorkHolidayCountWithCH__c'          , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '休日出勤日数(振替休日なし)'   , name: 'WorkHolidayCountWoCH__c'            , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '前月からの振替日数'           , name: 'ExchangeFromPrev__c'                , dataType: 'DOUBLE'    , type: 'np' },
  { label: '前月からの振替休日日数'       , name: 'ExchangeHolidayFromPrev__c'         , dataType: 'DOUBLE'    , type: 'np' },
  { label: '前月からの振替勤務日数'       , name: 'ExchangeWorkdayFromPrev__c'         , dataType: 'DOUBLE'    , type: 'np' },
  { label: '来月への振替日数'             , name: 'ExchangeToNext__c'                  , dataType: 'DOUBLE'    , type: 'np' },
  { label: '来月への振替休日日数'         , name: 'ExchangeHolidayToNext__c'           , dataType: 'DOUBLE'    , type: 'np' },
  { label: '来月への振替勤務日数'         , name: 'ExchangeWorkdayToNext__c'           , dataType: 'DOUBLE'    , type: 'np' },
  { label: '振替前の所定勤務日数'         , name: 'OrgWorkFixedDay__c'                 , dataType: 'DOUBLE'    , type: 'n'  },
  { label: 'フレックス所定休日'           , name: 'FlexWeekend__c'                     , dataType: 'DOUBLE'    , type: 't'  },
  { label: 'フレックス所定休日夜間'       , name: 'FlexWeekendNight__c'                , dataType: 'DOUBLE'    , type: 't'  },
  {},
  { label: '変形期間法定労働時間'         , name: 'LegalWorkTimeOfPeriod__c'           , dataType: 'DOUBLE'    , type: 't'  },
  { label: '変形期間内法定時間内労働時間' , name: 'WorkLegalTimePeriod__c'             , dataType: 'DOUBLE'    , type: 't'  },
  { label: '変形期間内超過時間'           , name: 'WorkLegalOutOverTimePeriod__c'      , dataType: 'DOUBLE'    , type: 't'  },
  {},
  { label: '平均出社時刻'                 , name: 'AverageStartTime__c'                , dataType: 'DOUBLE'    , type: 't'  },
  { label: '平均退社時刻'                 , name: 'AverageEndTime__c'                  , dataType: 'DOUBLE'    , type: 't'  },
  {},
  { label: '勤怠月次ID'                   , name: 'Id'                                 , dataType: 'ID'        , type: 's'  },
  { label: '勤怠月次名'                   , name: 'Name'                               , dataType: 'STRING'    , type: 's'  },
  { label: '作成日'                       , name: 'CreatedDate'                        , dataType: 'DATETIME'  , type: 's'  },
  { label: '作成者 ID'                    , name: 'CreatedBy.Name'                     , dataType: 'REFERENCE' , type: 's'  },
  { label: '最終更新日'                   , name: 'LastModifiedDate'                   , dataType: 'DATETIME'  , type: 's'  },
  { label: '最終更新者 ID'                , name: 'LastModifiedBy.Name'                , dataType: 'REFERENCE' , type: 's'  },
  { label: 'System Modstamp'              , name: 'SystemModstamp'                     , dataType: 'DATETIME'  , type: 's'  },
  { label: '勤怠部署月次'                 , name: 'DeptMonthId__r.Name'                , dataType: 'REFERENCE' , type: 's'  }
  //  { label: '対象者フラグ'                 , name: 'InputFlag__c'                       , dataType: 'PICKLIST'  , type: 's'  },
];

teasp.verify.VerDef.EmpDayFields = [
  { label: '日付'                         , name: 'Date__c'                            , dataType: 'DATE'      , type: 's'  },
  { type: 'y' },
  { label: '未申請早朝勤務'               , name: 'svEst'                              , dataType: 'DOUBLE'    , type: 't', viewOnly:true  },
  { label: '未申請残業'                   , name: 'svZan'                              , dataType: 'DOUBLE'    , type: 't', viewOnly:true  },
  { label: '日タイプ'                     , name: 'DayType__c'                         , dataType: 'STRING'    , type: 's'  },
  { label: '日タイプ(変更前)'             , name: 'OrgDayType__c'                      , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '有給計画付与日'               , name: 'PlannedHoliday__c'                  , dataType: 'BOOLEAN'   , type: 's'  },
  { label: '振替日'                       , name: 'ExchangeDate__c'                    , dataType: 'DATE'      , type: 's'  },
  { label: '所定労働時間'                 , name: 'WorkFixedTime__c'                   , dataType: 'DOUBLE'    , type: 't'  },
  { label: '総労働時間'                   , name: 'WorkWholeTime__c'                   , dataType: 'DOUBLE'    , type: 't'  },
  { label: '実労働時間'                   , name: 'WorkRealTime__c'                    , dataType: 'DOUBLE'    , type: 't'  },
  { label: 'ネット労働時間'               , name: 'WorkNetTime__c'                     , dataType: 'DOUBLE'    , type: 't'  },

  { label: '法定時間内残業'               , name: 'WorkLegalOverTime__c'               , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定時間外残業'               , name: 'WorkLegalOutOverTime__c'            , dataType: 'DOUBLE'    , type: 't'  },
  { label: '残業時間'                     , name: 'WorkOverTime__c'                    , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定休日労働時間'             , name: 'WorkHolidayTime__c'                 , dataType: 'DOUBLE'    , type: 't'  },
  { label: '深夜労働時間'                 , name: 'WorkNightTime__c'                   , dataType: 'DOUBLE'    , type: 't'  },
  { label: '割増労働時間'                 , name: 'WorkChargeTime__c'                  , dataType: 'DOUBLE'    , type: 't'  },

  { label: '遅刻時間'                     , name: 'LateTime__c'                        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '遅刻控除時間'                 , name: 'LateLostTime__c'                    , dataType: 'DOUBLE'    , type: 't'  },
  { label: '早退時間'                     , name: 'EarlyTime__c'                       , dataType: 'DOUBLE'    , type: 't'  },
  { label: '早退控除時間'                 , name: 'EarlyLostTime__c'                   , dataType: 'DOUBLE'    , type: 't'  },
  { label: '勤務時間内私用外出回数'       , name: 'PrivateInnerCount__c'               , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '勤務時間内私用外出'           , name: 'PrivateInnerTime__c'                , dataType: 'DOUBLE'    , type: 't'  },
  { label: '控除私用外出時間'             , name: 'PrivateInnerLostTime__c'            , dataType: 'DOUBLE'    , type: 't'  },
  { label: '欠勤時間'                     , name: 'AbsentTime__c'                      , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休暇控除時間'                 , name: 'HolidayDeductionTime__c'            , dataType: 'DOUBLE'    , type: 't'  },

  { label: '出社時刻'                     , name: 'StartTime__c'                       , dataType: 'DOUBLE'    , type: 't'  },
  { label: '退社時刻'                     , name: 'EndTime__c'                         , dataType: 'DOUBLE'    , type: 't'  },
  { label: '勤務場所'                     , name: 'WorkLocationId__r.Name'             , dataType: 'STRING'    , type: 's'  },
  { label: '出社時刻（ボタン）'           , name: 'PushStartTime__c'                   , dataType: 'DOUBLE'    , type: 't'  },
  { label: '退社時刻（ボタン）'           , name: 'PushEndTime__c'                     , dataType: 'DOUBLE'    , type: 't'  },
  { label: '出社時刻(ボタン丸めなし)'     , name: 'RealStartTime__c'                   , dataType: 'DOUBLE'    , type: 't'  },
  { label: '退社時刻(ボタン丸めなし)'     , name: 'RealEndTime__c'                     , dataType: 'DOUBLE'    , type: 't'  },
  { label: '時間配分'                     , name: 'TimeTable__c'                       , dataType: 'TEXTAREA'  , type: 's'  },
  { label: 'シフト始業時刻'               , name: 'ShiftStartTime__c'                  , dataType: 'DOUBLE'    , type: 't'  },
  { label: 'シフト終業時刻'               , name: 'ShiftEndTime__c'                    , dataType: 'DOUBLE'    , type: 't'  },

  { label: '法定内労働時間'               , name: 'WorkLegalTime__c'                   , dataType: 'DOUBLE'    , type: 't'  },
  { label: '深夜勤務割増'                 , name: 'NightChargeTime__c'                 , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定時間外割増'               , name: 'ChargeTime__c'                      , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休憩時間'                     , name: 'WorkOffTime__c'                     , dataType: 'DOUBLE'    , type: 't'  },
  { label: '所定休憩時間'                 , name: 'restTime__c'                        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '無給休憩時間'                 , name: 'unpaidRestTime__c'                  , dataType: 'DOUBLE'    , type: 't'  },
  { label: '公用外出時間'                 , name: 'WorkAwayTime__c'                    , dataType: 'DOUBLE'    , type: 't'  },
  { label: '時間単位有休取得時間'         , name: 'PaidRestTime__c'                    , dataType: 'DOUBLE'    , type: 't'  },

  { label: '平日日中法内所定'             , name: 'WeekDayDayLegalFixTime__c'          , dataType: 'DOUBLE'    , type: 't'  },
  { label: '平日日中法内残業'             , name: 'WeekDayDayLegalExtTime__c'          , dataType: 'DOUBLE'    , type: 't'  },
  { label: '平日日中法外'                 , name: 'WeekDayDayLegalOutTime__c'          , dataType: 'DOUBLE'    , type: 't'  },
  { label: '平日深夜法内所定'             , name: 'WeekDayNightLegalFixTime__c'        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '平日深夜法内残業'             , name: 'WeekDayNightLegalExtTime__c'        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '平日深夜法外'                 , name: 'WeekDayNightLegalOutTime__c'        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休日日中法内'                 , name: 'WeekEndDayLegalTime__c'             , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休日日中法外'                 , name: 'WeekEndDayLegalOutTime__c'          , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休日深夜法内'                 , name: 'WeekEndNightLegalTime__c'           , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休日深夜法外'                 , name: 'WeekEndNightLegalOutTime__c'        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定休日日中'                 , name: 'HolidayDayTime__c'                  , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定休日深夜'                 , name: 'HolidayNightTime__c'                , dataType: 'DOUBLE'    , type: 't'  },

  { label: '休日日中所定'                 , name: 'WeekEndDayLegalFixTime__c'          , dataType: 'DOUBLE'    , type: 't'  },
  { label: '休日深夜所定'                 , name: 'WeekEndNightLegalFixTime__c'        , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定休日日中所定'             , name: 'HolidayDayFixTime__c'               , dataType: 'DOUBLE'    , type: 't'  },
  { label: '法定休日深夜所定'             , name: 'HolidayNightFixTime__c'             , dataType: 'DOUBLE'    , type: 't'  },
  { label: '割増労働時間・所定休日'       , name: 'HolidayWorkChargeTime__c'           , dataType: 'DOUBLE'    , type: 't'  },

  { label: '前月からの振替日数'           , name: 'ExchangeFromPrev__c'                , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '来月への振替日数'             , name: 'ExchangeToNext__c'                  , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '法定休日勤務日数1'            , name: 'LegalWorkHolidayCountBelow4__c'     , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '法定休日勤務日数2'            , name: 'LegalWorkHolidayCountOver4__c'      , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '勤務換算休暇時間'             , name: 'PaidAbsentTime__c'                  , dataType: 'DOUBLE'    , type: 't'  },
  { label: '勤務時間外私用外出'           , name: 'PrivateOuterTime__c'                , dataType: 'DOUBLE'    , type: 't'  },
  { label: '時間入力分差引'               , name: 'SubtractTime__c'                    , dataType: 'DOUBLE'    , type: 't'  },
  { label: '所定休日勤務日数(振休あり1)'  , name: 'WorkHolidayCountWithCHBelow4__c'    , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '所定休日勤務日数(振休あり2)'  , name: 'WorkHolidayCountWithCHOver4__c'     , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '所定休日勤務日数(振休なし1)'  , name: 'WorkHolidayCountWoCHBelow4__c'      , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '所定休日勤務日数(振休なし2)'  , name: 'WorkHolidayCountWoCHOver4__c'       , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '日次申請ID'                   , name: 'DailyApplyId__c'                    , dataType: 'REFERENCE' , type: 's'  },
  { label: '勤務時間変更申請ID'           , name: 'PatternSApplyId__c'                 , dataType: 'REFERENCE' , type: 's'  },
  { label: '長期時間変更申請ID'           , name: 'PatternLApplyId__c'                 , dataType: 'REFERENCE' , type: 's'  },
  { label: '勤務パターンID'               , name: 'PatternId__c'                       , dataType: 'REFERENCE' , type: 's'  },
  { label: '休暇申請ID1'                  , name: 'HolidayApplyId1__c'                 , dataType: 'REFERENCE' , type: 's'  },
  { label: '休暇申請ID2'                  , name: 'HolidayApplyId2__c'                 , dataType: 'REFERENCE' , type: 's'  },
  { label: '休暇ID1'                      , name: 'HolidayId1__c'                      , dataType: 'REFERENCE' , type: 's'  },
  { label: '休暇ID2'                      , name: 'HolidayId2__c'                      , dataType: 'REFERENCE' , type: 's'  },
  { label: '休日出勤申請ID'               , name: 'HolidayWorkApplyId__c'              , dataType: 'REFERENCE' , type: 's'  },
  { label: '振替申請ID(元)'               , name: 'ExchangeSApplyId__c'                , dataType: 'REFERENCE' , type: 's'  },
  { label: '振替申請ID(先)'               , name: 'ExchangeEApplyId__c'                , dataType: 'REFERENCE' , type: 's'  },
  { label: '早朝勤務申請ID'               , name: 'EarlyStartApplyId__c'               , dataType: 'REFERENCE' , type: 's'  },
  { label: '残業申請ID'                   , name: 'ZangyoApplyId__c'                   , dataType: 'REFERENCE' , type: 's'  },
  { label: '遅刻申請ID'                   , name: 'LateStartApplyId__c'                , dataType: 'REFERENCE' , type: 's'  },
  { label: '早退申請ID'                   , name: 'EarlyEndApplyId__c'                 , dataType: 'REFERENCE' , type: 's'  },
  { label: '勤怠月次'                     , name: 'EmpMonthId__c'                      , dataType: 'REFERENCE' , type: 's'  },
  { label: '勤務体系'                     , name: 'EmpTypeId__c'                       , dataType: 'REFERENCE' , type: 's'  },
  { label: '部署ID'                       , name: 'DeptId__c'                          , dataType: 'REFERENCE' , type: 's'  },
  { label: 'イベントタイプ'               , name: 'EventType__c'                       , dataType: 'STRING'    , type: 's'  },
  { label: 'イベント'                     , name: 'Event__c'                           , dataType: 'STRING'    , type: 's'  },
  { label: 'エラー有り'                   , name: 'HasError__c'                        , dataType: 'BOOLEAN'   , type: 's'  },
  { label: '備考'                         , name: 'Note__c'                            , dataType: 'TEXTAREA'  , type: 's'  },
  { label: '日次一意キー'                 , name: 'UniqKey__c'                         , dataType: 'STRING'    , type: 's'  },
  { label: '作業報告'                     , name: 'WorkNote__c'                        , dataType: 'TEXTAREA'  , type: 's'  },
  { label: '確定'                         , name: 'Lock__c'                            , dataType: 'BOOLEAN'   , type: 's'  },
  { label: '勤怠日次ID'                   , name: 'Id'                                 , dataType: 'ID'        , type: 's'  },
  { label: '勤怠日次名'                   , name: 'Name'                               , dataType: 'STRING'    , type: 's'  },
  { label: '作成日'                       , name: 'CreatedDate'                        , dataType: 'DATETIME'  , type: 's'  },
  { label: '作成者 ID'                    , name: 'CreatedById'                        , dataType: 'REFERENCE' , type: 's'  },
  { label: '最終更新日'                   , name: 'LastModifiedDate'                   , dataType: 'DATETIME'  , type: 's'  },
  { label: '最終更新者 ID'                , name: 'LastModifiedById'                   , dataType: 'REFERENCE' , type: 's'  },
  { label: 'System Modstamp'              , name: 'SystemModstamp'                     , dataType: 'DATETIME'  , type: 's'  }
];

teasp.verify.VerDef.EmpStockFields = [
  { label: '種類'                         , name: 'Type__c'                            , dataType: 'STRING'    , type: 's'  },
  { label: '日数'                         , name: 'Days__c'                            , dataType: 'DOUBLE'    , type: 'n'  },
  { label: '発生日'                       , name: 'Date__c'                            , dataType: 'DATE'      , type: 's'  },
  { label: '開始日'                       , name: 'StartDate__c'                       , dataType: 'DATE'      , type: 's'  },
  { label: '失効日'                       , name: 'LimitDate__c'                       , dataType: 'DATE'      , type: 's'  },
  { label: '申請名'                       , name: 'EmpApplyId__r.Name'                 , dataType: 'STRING'    , type: 's'  },
  { label: '日タイプ'                     , name: 'DayType__c'                         , dataType: 'STRING'    , type: 's'  },
  { label: '実労働時間'                   , name: 'WorkRealTime__c'                    , dataType: 'DOUBLE'    , type: 't'  },
  { label: '代終日休可能な休日労働時間'   , name: 'DaiqAllBorderTime__c'               , dataType: 'DOUBLE'    , type: 't'  },
  { label: '代半日休可能な休日労働時間'   , name: 'DaiqHalfBorderTime__c'              , dataType: 'DOUBLE'    , type: 't'  },
  { label: 'バッチキー'                   , name: 'BatchKey__c'                        , dataType: 'STRING'    , type: 's'  }
];
