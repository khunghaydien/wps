teasp.provide('teasp.verify.VerCheck');
/**
 *
 */
teasp.verify.VerCheck = function(dataObj, flag){
    this.verData  = new teasp.verify.VerData(dataObj, flag);
    this.verMonth = new teasp.verify.VerEmpMonth();
    this.verDays  = new teasp.verify.VerEmpDays();
    this.verYuq   = new teasp.verify.VerEmpYuq();
    this.verStock = new teasp.verify.VerEmpStock();
};

teasp.verify.VerCheck.NG_MARK = 'Ｘ';

teasp.verify.VerCheck.prototype.getVerData = function(){
    return this.verData;
};

teasp.verify.VerCheck.prototype.loadEmpMonth = function(onSuccess, onFailure){
    this.verData.loadEmpMonth(onSuccess, onFailure);
};

teasp.verify.VerCheck.prototype.downloadSample = function(onSuccess, onFailure){
    this.verData.downloadSample(onSuccess, onFailure);
};

teasp.verify.VerCheck.prototype.getDbEmpMonth = function(onSuccess, onFailure){
    this.verMonth.getEmpMonth({ monthId: this.verData.getMonthId() }, onSuccess, onFailure);
};

teasp.verify.VerCheck.prototype.getDbEmpDays = function(onSuccess, onFailure){
    this.verDays.getEmpDays({ monthId: this.verData.getMonthId() }, onSuccess, onFailure);
};

teasp.verify.VerCheck.prototype.getDbEmpYuq = function(onSuccess, onFailure){
    this.verYuq.getEmpYuq({ empId: this.verData.getEmpId() }, onSuccess, onFailure);
};

teasp.verify.VerCheck.prototype.getDbEmpStock = function(onSuccess, onFailure){
    this.verStock.getEmpStock({ empId: this.verData.getEmpId() }, onSuccess, onFailure);
};

teasp.verify.VerCheck.prototype.setErrorId = function(errorId){
    this.verMonth.setErrorId(errorId);
    this.verDays.setErrorId(errorId);
    this.verYuq.setErrorId(errorId);
    this.verStock.setErrorId(errorId);
};

teasp.verify.VerCheck.displayValue = function(v){
    if(v === null || v === undefined){
        return '';
    }
    return teasp.util.entitize(v, '');
};

teasp.verify.VerCheck.prototype.verifyMonth = function(onFind, onSuccess, onFailure){
    this.getDbEmpMonth(
        dojo.hitch(this, function(){
            onSuccess(this.getVerifyMonthNg(onFind));
        }),
        onFailure
    );
};

teasp.verify.VerCheck.prototype.getVerifyMonthNg = function(onFind){
    var values = this.compareMonthResults();
    var cnt = 0;
    for(var i = 0 ; i < values.length ; i++){
        if(values[i].check == 'ng'){
            if(onFind){
                onFind(values[i]);
            }
            cnt++;
        }
    }
    return cnt;
};

/**
 * 勤怠月次データの照合
 *
 * @returns {Array.<Object>}
 */
teasp.verify.VerCheck.prototype.compareMonthResults = function(){
    var monthSum = this.verData.getMonthSummary();
    var cmap = this.monthViewValues(monthSum);
    var empMonth = this.verMonth.getRecord();
    var values = [];
    var fields = teasp.verify.VerDef.EmpMonthFields;
    for(var i = 0 ; i < fields.length ; i++){
        var field = fields[i];
        if(!field.label){
            values.push({});
            continue;
        }
        var o = teasp.verify.VerDef.parse(empMonth, field);
        var val = teasp.verify.VerCheck.displayValue(o.dispValue);
        var c = cmap[field.name];
        var cm = '';
        var cr = 'ok';
        if(field.viewVal){
             val += c.obj.dispValue || '';
        }else if(c && c.obj){
            if(!(!o.value && !c.obj.value) && o.value != c.obj.value){
                val += '<span>(' + c.obj.dispValue + ')</span>';
                cm = teasp.verify.VerCheck.NG_MARK;
                cr = (c.w == 1 ? 'wa' : 'ng');
            }else{
                cm = '&#10003;';
            }
        }
        values.push({
            label    : field.label,
            title    : field.name,
            align    : o.align,
            value    : val,
            check    : cr,
            mark     : cm
        });
    }
    return values;
};

/**
 * 勤怠日次データの照合
 *
 * @returns {Array.<Object>}
 */
teasp.verify.VerCheck.prototype.compareDaysResults = function(){
    var empDays = this.verDays.getRecords();
    var cmap = this.dayViewValues();
    var fields = teasp.verify.VerDef.EmpDayFields;
    var values = {};
    var fs = []; // フィールドの配列
    var ds = []; // 日付の配列
    for(var i = 0 ; i < fields.length ; i++){
        var field = fields[i];
        fs.push(field);
    }
    var dataObj = this.verData.getDataObj();
    values['f'] = fs;
    dojo.forEach(empDays, function(day){
        var dkey = teasp.util.date.formatDate(day.Date__c);
        ds.push(dkey);
        var obj = {};
        for(i = 0 ; i < fields.length ; i++){
            var field = fields[i];
            if(!field.label){
                continue;
            }
            var o = teasp.verify.VerDef.parse(day, field);
            var val = teasp.verify.VerCheck.displayValue(o.dispValue);
            var c = cmap[field.name];
            var cm = '';
            var cr = 'ok';
            if(c && (dkey < dataObj.targetEmp.entryDate || dataObj.targetEmp.endDate < dkey)){
                c.w = 1;
            }
            if(field.viewOnly){
                val = c.obj[dkey].dispValue || '';
            }else if(c && c.obj && c.obj[dkey]){
                if((o.value || 0) != (c.obj[dkey].value || 0)){
                    val += ' <span>(' + c.obj[dkey].dispValue + ')</span>';
                    cm = teasp.verify.VerCheck.NG_MARK;
                    cr = (c.w == 1 ? 'wa' : 'ng');
                }else{
                    cm = '&#10003;';
                }
            }
            obj[field.name] = {
                label    : field.label,
                title    : field.name,
                align    : o.align,
                value    : val,
                check    : cr,
                mark     : cm
            };
        }
        values[dkey] = obj;
    }, this);
    values['d'] = ds;
    return values;
};

/**
 * 画面側が持つ勤怠月次データを取得
 *
 * @param {Object}
 * @returns {Object}
 *
 */
teasp.verify.VerCheck.prototype.monthViewValues = function(monthSum){
    // 照合する対象
    var chks = [
        { name: 'WorkFixedDay__c'            , key: 'disc.workFixedDay'                   }, // 所定出勤日数
        { name: 'WorkRealDay__c'             , key: 'disc.workRealDay'                    }, // 実出勤日数
        { name: 'WorkLegalHolidayCount__c'   , key: 'disc.workLegalHolidayCount'          }, // 法定休日出勤日数
        { name: 'WorkHolidayCount__c'        , key: 'disc.workHolidayCount'               }, // 休日出勤日数
        { name: 'WorkPublicHolidayCount__c'  , key: 'disc.workPublicHolidayCount'         }, // 祝日出勤日数
        { name: 'WorkFixedTime__c'           , key: 'disc.workFixedTime'                  }, // 所定労働時間
        { name: 'WorkWholeTime__c'           , key: 'disc.workWholeTime'                  }, // 総労働時間
        { name: 'WholeWorkTimeWoLH__c'                                                    }, // 総労働・法休(含有休)
        { name: 'WorkRealTime__c'            , key: 'disc.workRealTime'                   }, // 実労働時間
        { name: 'WorkNetTime__c'             , key: 'real.workRealTime'                   }, // ネット労働時間
        { name: 'AmountTime__c'              , key: 'disc.amountTime'                     }, // 過不足時間
        { name: 'SettlementTime__c'          , key: 'disc.settlementTime'                 }, // 当月清算時間
        { name: 'CarryforwardTime__c'        , key: 'carryforwardToNext'                  }, // 繰越時間
        { name: 'ElapsedMonth__c'            , key: 'periodInfo.elapsedMonth'             }, // 経過月
        { name: 'carryforwardFromPrev'       , key: 'carryforwardFromPrev'                }, // 前月までの繰越時間
        { name: 'avg50week'                  , key: 'avg50week'                           }, // 週50基準時間
        { name: 'numberOfMonths'             , key: 'periodInfo.numberOfMonths'           }, // 実適用期間
        { name: 'WorkOverTime36__c'          , key: 'disc.workOverTime36'                 }, // 36協定対象残業時間
        { name: 'PeriodWorkOverTime36__c'    , key: 'disc.quartWorkOverTime36'            }, // 4半期36協定対象残業時間
        { name: 'TotalWorkOverTime36__c'     , key: 'disc.totalWorkOverTime36'            }, // 累計３６協定対象残業時間
        { name: 'TotalWorkOverCount36__c'    , key: 'disc.totalWorkOverCount36'           }, // 累計３６協定超過回数
        { name: 'WorkOver40perWeek__c'       , key: 'real.workOver40perWeek'              }, // 週４０時間超労働時間
        { name: 'LegalWorkTime__c'           , key: 'legalTime'                           }, // 月の法定労働時間
        { name: 'RealWorkTimeWoLH__c'                                                     }, // 実労働・法休(除有休)
        { name: 'WorkLegalOverTime__c'       , key: 'disc.workLegalOverTime'              }, // 法定時間内残業
        { name: 'WorkLegalOutOverTime__c'    , key: 'disc.workLegalOutOverTime'           }, // 法定時間外残業
        { name: 'WorkOverTime__c'            , key: 'disc.workOverTime'                   }, // 残業時間
        { name: 'HolidayWorkTime__c'         , key: 'disc.workHolidayTime'                }, // 法定休日労働時間
        { name: 'WorkNightTime__c'           , key: 'real.workNightTime'                  }, // 深夜労働時間
        { name: 'WorkChargeTime__c'          , key: 'disc.workChargeTime'                 }, // 割増労働時間
        { name: 'AdditionalWorkChargeTime__c', key: 'overTimeInPeriod'                    }, // 追加割増労働時間
        { name: 'WorkOver45Time__c'          , key: 'disc.workOver45Time'                 }, // ４５時間超残業
        { name: 'WorkOver60Time__c'          , key: 'disc.workOver60Time'                 }, // ６０時間超残業
        { name: 'LateCount__c'               , key: 'disc.lateCount'                      }, // 遅刻回数
        { name: 'LateTime__c'                , key: 'disc.lateTime'                       }, // 遅刻時間
        { name: 'LateLostTime__c'            , key: 'disc.lateLostTime'                   }, // 控除遅刻時間
        { name: 'EarlyCount__c'              , key: 'disc.earlyCount'                     }, // 早退回数
        { name: 'EarlyTime__c'               , key: 'disc.earlyTime'                      }, // 早退時間
        { name: 'EarlyLostTime__c'           , key: 'disc.earlyLostTime'                  }, // 控除早退時間
        { name: 'PrivateInnerCount__c'       , key: 'disc.privateInnerCount'              }, // 勤務時間内私用外出回数
        { name: 'PrivateInnerTime__c'        , key: 'disc.privateInnerTime'               }, // 勤務時間内私用外出時間
        { name: 'PrivateInnerLostTime__c'    , key: 'disc.privateInnerLostTime'           }, // 控除私用外出時間
        { name: 'LostTime__c'                , key: 'disc.lostTime'                       }, // 控除時間
        { name: 'HolidayDeductionTime__c'    , key: 'disc.holidayDeductionTime'           }, // 休暇控除時間
        { name: 'WorkOffTime__c'             , key: 'real.restTime'                 , w:1 }, // 休憩時間
        { name: 'WorkAwayTime__c'            , key: 'real.workAwayTime'                   }, // 公用外出時間
        { name: 'PaidHolidayCount__c'                                               , w:1 }, // 有休取得日数
        { name: 'PaidRestTime__c'            , key: 'disc.paidRestTime'             , w:1 }, // 時間単位有休取得時間
        { name: 'YuqRemainDays__c'                                                  , w:1 }, // 有休残日数
        { name: 'YuqRemainHour__c'                                                  , w:1 }, // 有休残時間
        { name: 'AbsentCount__c'                                                    , w:1 }, // 無給休暇日数
        { name: 'WeekDayDayLegalFixTime__c'  , key: 'disc.weekDayDayLegalFixTime'   , w:1 }, // 平日日中法内所定
        { name: 'WeekDayDayLegalExtTime__c'  , key: 'disc.weekDayDayLegalExtTime'   , w:1 }, // 平日日中法内残業
        { name: 'WeekDayDayLegalOutTime__c'  , key: 'disc.weekDayDayLegalOutTime'   , w:1 }, // 平日日中法外
        { name: 'WeekDayNightLegalFixTime__c', key: 'disc.weekDayNightLegalFixTime' , w:1 }, // 平日深夜法内所定
        { name: 'WeekDayNightLegalExtTime__c', key: 'disc.weekDayNightLegalExtTime' , w:1 }, // 平日深夜法内残業
        { name: 'WeekDayNightLegalOutTime__c', key: 'disc.weekDayNightLegalOutTime' , w:1 }, // 平日深夜法外
        { name: 'WeekEndDayLegalTime__c'     , key: 'disc.weekEndDayLegalTime'      , w:1 }, // 休日日中法内
        { name: 'WeekEndDayLegalOutTime__c'  , key: 'disc.weekEndDayLegalOutTime'   , w:1 }, // 休日日中法外
        { name: 'WeekEndNightLegalTime__c'   , key: 'disc.weekEndNightLegalTime'    , w:1 }, // 休日深夜法内
        { name: 'WeekEndNightLegalOutTime__c', key: 'disc.weekEndNightLegalOutTime' , w:1 }, // 休日深夜法外
        { name: 'HolidayDayTime__c'          , key: 'disc.holidayDayTime'           , w:1 }, // 法定休日日中
        { name: 'HolidayNightTime__c'        , key: 'disc.holidayNightTime'         , w:1 }  // 法定休日深夜
    ];
    var fields = teasp.verify.VerDef.EmpMonthFields;
    var fmap = {};
    dojo.forEach(fields, function(field){
        if(field.name){
            fmap[field.name] = field;
        }
    });
    var dataObj = this.verData.getDataObj();
    var cmap = {};
    dojo.forEach(chks, function(chk){
        var field = fmap[chk.name];
        if(field){
            if(chk.key){
                chk.obj = teasp.verify.VerDef.parse(dataObj.month, field, chk.key);
            }else{
                if(dataObj.yuqRemains){
                    if(chk.name == 'PaidHolidayCount__c'){ // 有休取得日数
                        var n = monthSum.monSum.o.holidaySummary.sums[teasp.constant.HOLIDAY_TYPE_PAID];
                        chk.obj = teasp.verify.VerDef.parse({ v: n }, field, 'v');
                    }else if(chk.name == 'YuqRemainDays__c'){ // 有休残日数
                        chk.obj = teasp.verify.VerDef.parse(monthSum.yuqRemain, field, 'days');
                    }else if(chk.name == 'YuqRemainHour__c'){ // 有休残時間
                        var o = teasp.verify.VerDef.parse(monthSum.yuqRemain, field, 'time');
                        if(o && o.value){
                            o.value = (o.value / 60);
                        }
                        chk.obj = o;
                    }else if(chk.name == 'AbsentCount__c'){ // 無給休暇日数
                        var n = monthSum.monSum.o.holidaySummary.sums[teasp.constant.HOLIDAY_TYPE_FREE];
                        chk.obj = teasp.verify.VerDef.parse({ v: n }, field, 'v');
                    }
                }
                if(chk.name == 'WholeWorkTimeWoLH__c'){ // 総労働・法休(含有休)
                    var n = dataObj.month.disc.workWholeTime - dataObj.month.disc.workHolidayTime;
                    chk.obj = teasp.verify.VerDef.parse({ v: n }, field, 'v');
                }else if(chk.name == 'RealWorkTimeWoLH__c'){ // 実労働・法休(除有休)
                    var n = dataObj.month.disc.workRealTime - dataObj.month.disc.workHolidayTime;
                    chk.obj = teasp.verify.VerDef.parse({ v: n }, field, 'v');
                }
            }
        }
        cmap[chk.name] = chk;
    }, this);
    if(dataObj.config.workSystem != '1' || dataObj.config.variablePeriod != 1){
        if(cmap['LegalWorkTime__c'    ]){ cmap['LegalWorkTime__c'    ].w = 1; }
    }
    if(dataObj.config.workSystem != '1' || dataObj.config.variablePeriod <= 1){
        if(cmap['ElapsedMonth__c'     ]){ cmap['ElapsedMonth__c'     ].w = 1; }
    }
    if(dataObj.config.workSystem != '2'){
        if(cmap['AdditionalWorkChargeTime__c']){ cmap['AdditionalWorkChargeTime__c'].w = 1; }
    }
    return cmap;
};

/**
 * 画面側が持つ勤怠日次データを取得
 *
 * @returns {Object}
 *
 */
teasp.verify.VerCheck.prototype.dayViewValues = function(){
    var chks = [
        { name: 'WorkFixedTime__c'           , key: 'rack.fixTime'                        }, // 所定労働時間
        { name: 'WorkWholeTime__c'           , key: 'disc.workWholeTime'                  }, // 総労働時間
        { name: 'WorkRealTime__c'            , key: 'disc.workRealTime'                   }, // 実労働時間
        { name: 'WorkNetTime__c'             , key: 'real.workRealTime'                   }, // ネット労働時間
        { name: 'WorkLegalOverTime__c'       , key: 'disc.workLegalOverTime'              }, // 法定時間内残業
        { name: 'WorkLegalOutOverTime__c'    , key: 'disc.workLegalOutOverTime'           }, // 法定時間外残業
        { name: 'WorkOverTime__c'            , key: 'disc.workOverTime'                   }, // 残業時間
        { name: 'WorkHolidayTime__c'         , key: 'disc.workHolidayTime'                }, // 法定休日労働時間
        { name: 'WorkNightTime__c'           , key: 'real.workNightTime'                  }, // 深夜労働時間
        { name: 'WorkChargeTime__c'          , key: 'disc.workChargeTime'                 }, // 法定時間外割増
        { name: 'LateTime__c'                , key: 'disc.lateTime'                       }, // 遅刻時間
        { name: 'LateLostTime__c'            , key: 'disc.lateLostTime'                   }, // 遅刻控除時間
        { name: 'EarlyTime__c'               , key: 'disc.earlyTime'                      }, // 早退時間
        { name: 'EarlyLostTime__c'           , key: 'disc.earlyLostTime'                  }, // 早退控除時間
        { name: 'PrivateInnerTime__c'        , key: 'disc.privateInnerTime'               }, // 勤務時間内私用外出
        { name: 'PrivateInnerLostTime__c'    , key: 'disc.privateInnerLostTime'           }, // 控除私用外出時間
        { name: 'HolidayDeductionTime__c'    , key: 'rack.holidayDeductionTime'           }, // 休暇控除時間
        { name: 'WorkOffTime__c'             , key: 'real.restTime'                 , w:1 }, // 休憩時間
        { name: 'WorkAwayTime__c'            , key: 'real.awayTime'                       }, // 公用外出時間
        { name: 'WeekDayDayLegalFixTime__c'  , key: 'disc.weekDayDayLegalFixTime'   , w:1 }, // 平日日中法内所定
        { name: 'WeekDayDayLegalExtTime__c'  , key: 'disc.weekDayDayLegalExtTime'   , w:1 }, // 平日日中法内残業
        { name: 'WeekDayDayLegalOutTime__c'  , key: 'disc.weekDayDayLegalOutTime'   , w:1 }, // 平日日中法外
        { name: 'WeekDayNightLegalFixTime__c', key: 'disc.weekDayNightLegalFixTime' , w:1 }, // 平日深夜法内所定
        { name: 'WeekDayNightLegalExtTime__c', key: 'disc.weekDayNightLegalExtTime' , w:1 }, // 平日深夜法内残業
        { name: 'WeekDayNightLegalOutTime__c', key: 'disc.weekDayNightLegalOutTime' , w:1 }, // 平日深夜法外
        { name: 'WeekEndDayLegalTime__c'     , key: 'disc.weekEndDayLegalTime'      , w:1 }, // 休日日中法内
        { name: 'WeekEndDayLegalOutTime__c'  , key: 'disc.weekEndDayLegalOutTime'   , w:1 }, // 休日日中法外
        { name: 'WeekEndNightLegalTime__c'   , key: 'disc.weekEndNightLegalTime'    , w:1 }, // 休日深夜法内
        { name: 'WeekEndNightLegalOutTime__c', key: 'disc.weekEndNightLegalOutTime' , w:1 }, // 休日深夜法外
        { name: 'HolidayDayTime__c'          , key: 'disc.holidayDayTime'           , w:1 }, // 法定休日日中
        { name: 'HolidayNightTime__c'        , key: 'disc.holidayNightTime'         , w:1 }, // 法定休日深夜
        { name: 'svEst'                      , key: 'disc.svEst'                    , w:1 }, // 未申請早朝勤務
        { name: 'svZan'                      , key: 'disc.svZan'                    , w:1 }  // 未申請残業
    ];
    var fields = teasp.verify.VerDef.EmpDayFields;
    var fmap = {};
    dojo.forEach(fields, function(field){
        if(field.name){
            fmap[field.name] = field;
        }
    });
    // 変形労働の場合、法定時間外割増の列は、workChargeTime40H を参照する
    if(this.verData.getDataObj().config.workSystem == '2'){
    	for(var i = 0 ; i < chks.length ; i++){
    		if(chks[i].name == 'WorkChargeTime__c'){
    			chks[i].key  = 'disc.workChargeTime40H';
    			break;
    		}
    	}
    }
    var days = this.verData.getDataObj().days;
    var cmap = {};
    dojo.forEach(chks, function(chk){
        chk.obj = {};
        var field = fmap[chk.name];
        if(field){
            if(chk.key){
                for(var dkey in days){
                    chk.obj[dkey] = teasp.verify.VerDef.parse(days[dkey], field, chk.key);
                }
            }
        }
        cmap[chk.name] = chk;
    }, this);
    // 複数月フレックスの場合、勤怠日次の法定時間内残業,法定時間外残業,残業の差異はNG扱いしない
    if(this.verData.getDataObj().config.workSystem == '1' && this.verData.getDataObj().config.variablePeriod > 1){
        if(cmap['WorkLegalOverTime__c'    ]){ cmap['WorkLegalOverTime__c'    ].w = 1; }
        if(cmap['WorkLegalOutOverTime__c' ]){ cmap['WorkLegalOutOverTime__c' ].w = 1; }
        if(cmap['WorkOverTime__c'         ]){ cmap['WorkOverTime__c'         ].w = 1; }
        if(cmap['WorkChargeTime__c'       ]){ cmap['WorkChargeTime__c'       ].w = 1; }
    }
    return cmap;
};
