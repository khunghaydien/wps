if(typeof(teasp) == 'object' && !teasp.resolved['7674'] && teasp.view && teasp.view.Shift){
teasp.view.Shift.prototype.collectData=function(e){this.localObj.param=e.param,this.localObj.emps=[],this.localObj.dateList=[],this.localObj.patterns=[],this.localObj.holidays=[],this.localObj.allPatterns=[],this.localObj.empIdIndex={},this.localObj.deptMap={},
this.localObj.events={},this.localObj.pubEvents={},this.localObj.deptEvents={},this.localObj.notes={},this.localObj.countDays={},this.startCell=null,this.temporaryShiftId=[],this.sumColumns=dojo.clone(this.sumColumnsFix);var t,a,o,s=teasp.util.date.getDateList(e.param.startDate,e.param.endDate),i={},n={},r={},l={},p={common:{}},d={},c={},m={},h={},u={};for(t=0;t<e.empApplys.length;t++){var y=e.empApplys[t];y.startDate=teasp.logic.convert.valDate(y.StartDate__c),
y.endDate=teasp.logic.convert.valDate(y.EndDate__c),y.exchangeDate=teasp.logic.convert.valDate(y.ExchangeDate__c),y.originalStartDate=teasp.logic.convert.valDate(y.OriginalStartDate__c),m[y.EmpId__c]||(m[y.EmpId__c]=[]),m[y.EmpId__c].push(y),s.contains(y.startDate)||(u[y.startDate]=1),s.contains(y.endDate)||(u[y.endDate]=1),y.exchangeDate&&!s.contains(y.exchangeDate)&&(u[y.exchangeDate]=1),y.originalStartDate&&!s.contains(y.originalStartDate)&&(u[y.originalStartDate]=1),
y.HolidayId__r&&(r[y.HolidayId__r.Id]=y.HolidayId__r)}var g=[].concat(s);for(var f in u)u.hasOwnProperty(f)&&g.push(f);g=g.sort(function(e,t){return t>e?-1:e>t?1:0});var v=g[0],b=g[g.length-1],_=this.getPermission();for(t=0;t<e.configs.length;t++){var T=e.configs[t];i[T.ConfigBaseId__c]||(i[T.ConfigBaseId__c]=[]),T.validStartDate=T.ValidStartDate__c?teasp.logic.convert.valDate(T.ValidStartDate__c):null,T.validEndDate=T.ValidEndDate__c?teasp.logic.convert.valDate(T.ValidEndDate__c):null;
var j=T.Holidays__c||"0000000",E=[],L=[];for(a=0;a<j.length;a++){var k=j.substring(a,a+1);"0"!=k&&E.push(a),"2"==k&&L.push(a)}T.fixHolys=getHolidays(teasp.util.date.parseDate(T.validStartDate?T.validStartDate<=v?v:T.validStartDate:v),teasp.util.date.parseDate(T.validEndDate?T.validEndDate>=b?b:T.validEndDate:b),E,!1);for(var D in T.fixHolys)if(T.fixHolys.hasOwnProperty(D)){var I=T.fixHolys[D];L.contains(I.dayOfWeek)?I.dayType=teasp.constant.DAY_TYPE_LEGAL_HOLIDAY:E.contains(I.dayOfWeek)?I.dayType=teasp.constant.DAY_TYPE_NORMAL_HOLIDAY:T.NonPublicHoliday__c?I.dayType=teasp.constant.DAY_TYPE_NORMAL:I.dayType=teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY;
}i[T.ConfigBaseId__c].push(T)}for(t=0;t<e.calendars.length;t++){var A=e.calendars[t],D=teasp.logic.convert.valDate(A.Date__c);if(A.DeptId__c){var f=A.DeptId__c;d[f]||(d[f]={}),d[f][D]=A}else{var f=A.EmpTypeId__c?A.EmpTypeId__c:"common";p[f]||(p[f]={}),p[f][D]=A}}for(t=0;t<e.patterns.length;t++){var x=e.patterns[t];n[x.Id]=x}for(t=0;t<e.empTypePatterns.length;t++){var S=e.empTypePatterns[t];S.pattern=n[S.PatternId__c],
l[S.EmpTypeId__c]||(l[S.EmpTypeId__c]=[]),l[S.EmpTypeId__c].push(S)}for(t=0;t<e.empMonths.length;t++){var w=e.empMonths[t];w.startDate=teasp.logic.convert.valDate(w.StartDate__c),w.endDate=teasp.logic.convert.valDate(w.EndDate__c),h[w.EmpId__c]||(h[w.EmpId__c]=[]),h[w.EmpId__c].push(w)}for(t=0;t<e.empTypes.length;t++){var M=e.empTypes[t];c[M.Id]=M,M.patterns=(l[M.Id]||[]).sort(function(e,t){return e.Order__c-t.Order__c;
}),M.days={};var O=i[M.ConfigBaseId__c];for(a=0;a<g.length;a++){var D=g[a],N=M.days[D]={date:teasp.util.date.parseDate(D)};if(1==O.length)N.config=O[0];else for(o=0;o<O.length;o++){var T=O[o];if((!T.validStartDate||T.validStartDate<=D)&&(!T.validEndDate||T.validEndDate>=D)){N.config=T;break}}N.layer1=function(){var e={},t=N.config.fixHolys[D];e.dayType=t?t.dayType:teasp.constant.DAY_TYPE_NORMAL,e.event=t&&t.title||null;
var a=teasp.view.Shift.getPatternByDate(M.patterns,N.date);return e.pattern=a&&a.pattern||null,e}(),N.layer2=function(e,t){if(!e&&!t)return{};var a={},o=function(e){switch(e){case"1":return teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;case"2":return teasp.constant.DAY_TYPE_LEGAL_HOLIDAY;case"3":return teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY;default:return teasp.constant.DAY_TYPE_NORMAL}};return e&&(e.Type__c&&(a.dayType=o(e.Type__c),
a.plannedHoliday=e.PlannedHoliday__c||!1,a.commonPriority="1"==e.Priority__c),e.Event__c&&e.Event__c.length>0&&(a.commonEvent=e.Event__c),e.Note__c&&e.Note__c.length>0&&(a.commonNote=e.Note__c)),t&&(t.Type__c&&!a.commonPriority&&(a.dayType=o(t.Type__c),a.plannedHoliday=t.PlannedHoliday__c||!1),t.Event__c&&t.Event__c.length>0&&(a.event=t.Event__c),t.Note__c&&t.Note__c.length>0&&(a.note=t.Note__c),a.pattern=t.PatternId__r||null),
a}(p.common[D]||null,(p[M.Id]||{})[D]||null),N.dayType="number"==typeof N.layer2.dayType?N.layer2.dayType:N.layer1.dayType,N.plannedHoliday=N.dayType==teasp.constant.DAY_TYPE_NORMAL&&N.layer2.plannedHoliday||!1,N.pattern=N.layer2.pattern?N.layer2.pattern:N.layer1.pattern;var P=[];N.layer1.event&&P.push(N.layer1.event),N.layer2.commonEvent&&P.push(N.layer2.commonEvent),N.layer2.event&&P.push(N.layer2.event),N.event=P.length>0?P.join(teasp.message.getLabel("tm10001470")):null,
N.note=N.layer2.note,this.localObj.pubEvents[D]=N.layer1.event,this.localObj.events[D]=N.layer2.commonEvent}}for(t=0;t<this.localObj.depts.length;t++){var C=this.localObj.depts[t];for(this.localObj.deptEvents[C.Id]={days:{}},a=0;a<g.length;a++){var D=g[a],N=this.localObj.deptEvents[C.Id].days[D]={},R=(d[C.Id]||{})[D];R&&(N.event=R.Event__c,N.note=R.Note__c)}}n={},r={};var H=0;for(e.emps=e.emps.sort(function(e,t){return e.Title__c==t.Title__c?e.EmpCode__c==t.EmpCode__c?e.Name<t.Name?-1:1:!e.EmpCode__c&&t.EmpCode__c?1:e.EmpCode__c&&!t.EmpCode__c?-1:e.EmpCode__c<t.EmpCode__c?-1:1:!e.Title__c&&t.Title__c?1:e.Title__c&&!t.Title__c?-1:e.Title__c<t.Title__c?-1:1;
}),t=0;t<e.emps.length;t++){var Y=e.emps[t];Y.empType=c[Y.EmpTypeId__c];var W=Y.DeptId__c||"(null)";this.localObj.deptMap[W]||(this.localObj.deptMap[W]=[]),this.localObj.deptMap[W].push(Y),Y.days={},Y.countDays={workDays:0,holiDays:0,offDays:0};var F=this.isEditable(Y,_);for(a=0;a<s.length;a++){var D=s[a],N=Y.days[D]={};if(h[Y.Id]){var B=h[Y.Id];for(o=0;o<B.length;o++){var q=B[o];if(q.startDate<=D&&D<=q.endDate){N.monthStatus=q.EmpApplyId__r?q.EmpApplyId__r.Status__c:null;
break}}}var V=[];if(m[Y.Id]){var B=m[Y.Id];for(o=0;o<B.length;o++){var K=B[o];(K.startDate<=D&&D<=K.endDate||K.ApplyType__c==teasp.constant.APPLY_TYPE_EXCHANGE&&D==K.exchangeDate)&&V.push(K)}}var J={},U={};for(o=0;o<V.length;o++){var K=V[o];teasp.view.Shift.setApplyToDayObj(K.Decree__c?U:J,teasp.view.Shift.getApplyKey(K,D),K)}N.applys=teasp.view.Shift.getValidApplys(J),N.decrees=teasp.view.Shift.getValidApplys(U),N.dayType=Y.empType.days[D].dayType,
N.plannedHoliday=Y.empType.days[D].plannedHoliday,N.pattern=Y.empType.days[D].pattern,N.pattern?(N.startTime=N.pattern.StdStartTime__c,N.endTime=N.pattern.StdEndTime__c,N.restTimes=N.pattern.RestTimes__c):(N.startTime=Y.empType.days[D].config.StdStartTime__c,N.endTime=Y.empType.days[D].config.StdEndTime__c,N.restTimes=Y.empType.days[D].config.RestTimes__c),N.orgDayType=N.dayType;var G=N.decrees.patternS||N.decrees.patternL;
if(G&&(G.Removed__c||("string"==typeof G.DayType__c&&(N.dayType=parseInt(G.DayType__c,10)),N.pattern=G.PatternId__r||null,N.workPlace=G.WorkPlaceId__r||null,N.startTime=G.StartTime__c,N.endTime=G.EndTime__c,G.PatternId__r&&(N.restTimes=G.PatternId__r.RestTimes__c)),N.temporary=G.TempFlag__c,N.memo=G.Content__c||null,N.temporary&&(this.temporaryShiftId.push(G.Id),N.decrees.patternS.orgs&&N.decrees.patternS.orgs.length>0)))for(o=0;o<N.decrees.patternS.orgs.length;o++)this.temporaryShiftId.push(N.decrees.patternS.orgs[o].Id);
var z=N.applys.patternS||N.applys.patternL;if(z&&("string"==typeof z.DayType__c&&(N.dayType=parseInt(z.DayType__c,10)),N.pattern=z.PatternId__r||null,N.startTime=z.StartTime__c,N.endTime=z.EndTime__c,z.PatternId__r&&(N.restTimes=z.PatternId__r.RestTimes__c)),N.applys.exchangeS?N.dayType=Y.empType.days[N.applys.exchangeS.exchangeDate].dayType:!N.applys.exchangeS&&N.applys.exchangeE&&(N.dayType=Y.empType.days[N.applys.exchangeE.originalStartDate].dayType),
N.pattern){var X=n[N.pattern.Id];X?X.cnt++:n[N.pattern.Id]={cnt:1,pattern:N.pattern}}if(N.applys.holidayAll){var Z=r[N.applys.holidayAll.HolidayId__r.Id];Z?Z.cnt++:r[N.applys.holidayAll.HolidayId__r.Id]={cnt:1,holiday:N.applys.holidayAll.HolidayId__r}}if(N.applys.holidayAm){var Z=r[N.applys.holidayAm.HolidayId__r.Id];Z?Z.cnt++:r[N.applys.holidayAm.HolidayId__r.Id]={cnt:1,holiday:N.applys.holidayAm.HolidayId__r}}if(N.applys.holidayPm){
var Z=r[N.applys.holidayPm.HolidayId__r.Id];Z?Z.cnt++:r[N.applys.holidayPm.HolidayId__r.Id]={cnt:1,holiday:N.applys.holidayPm.HolidayId__r}}if(N.fix=teasp.constant.STATUS_FIX.contains(N.monthStatus)||N.applys.dailyFix,N.editable=F,N.dayType==teasp.constant.DAY_TYPE_NORMAL){if(N.plannedHoliday&&!N.applys.kyushtu&&(Y.countDays.offDays++,H++),N.applys.holidayAll&&(Y.countDays[N.applys.holidayAll.HolidayId__r.Id]?Y.countDays[N.applys.holidayAll.HolidayId__r.Id]++:Y.countDays[N.applys.holidayAll.HolidayId__r.Id]=1),
N.applys.holidayAm&&(Y.countDays[N.applys.holidayAm.HolidayId__r.Id]?Y.countDays[N.applys.holidayAm.HolidayId__r.Id]++:Y.countDays[N.applys.holidayAm.HolidayId__r.Id]=1),N.applys.holidayPm&&(Y.countDays[N.applys.holidayPm.HolidayId__r.Id]?Y.countDays[N.applys.holidayPm.HolidayId__r.Id]++:Y.countDays[N.applys.holidayPm.HolidayId__r.Id]=1),!(N.applys.holidayAll||N.applys.holidayAm&&N.applys.holidayPm)){Y.countDays.workDays++;
var Q=N.pattern?N.pattern.Id:"(null)",$=N.workPlace?N.workPlace.Id:Y.DeptId__c?Y.DeptId__c:"(null)";Y.countDays[Q]?Y.countDays[Q]++:Y.countDays[Q]=1,this.localObj.countDays[$]||(this.localObj.countDays[$]={}),this.localObj.countDays[$][D]||(this.localObj.countDays[$][D]={}),this.localObj.countDays[$][D][Q]?this.localObj.countDays[$][D][Q]++:this.localObj.countDays[$][D][Q]=1}}else Y.countDays.holiDays++}}this.localObj.emps=e.emps,
this.localObj.dateList=s;for(var f in n)n.hasOwnProperty(f)&&this.localObj.patterns.push(n[f]);this.localObj.patterns=this.localObj.patterns.sort(function(e,t){return t.cnt-e.cnt}),this.localObj.patterns.unshift({}),this.localObj.allPatterns=e.patterns,console.log(this.localObj.emps);for(var f in r)r.hasOwnProperty(f)&&this.localObj.holidays.push(r[f]);for(this.localObj.holidays=this.localObj.holidays.sort(function(e,t){
return t.cnt-e.cnt}),0>=H&&this.sumColumns.splice(2,1),t=0;t<this.localObj.holidays.length;t++){var k=this.localObj.holidays[t].holiday;this.sumColumns.push({name:k.Name,headId:k.Id,headClassName:"sumHoriz1Cell",holiday:k})}this.deptKeys=[];for(var f in this.localObj.deptMap)this.localObj.deptMap.hasOwnProperty(f)&&this.deptKeys.push(f);var ee=this.localObj.param.deptId;this.deptKeys=this.deptKeys.sort(function(e,t){return"-1"==ee?"(null)"==e?-1:"(null)"==t?1:0:e==ee?-1:t==ee?1:0;
})};

teasp.view.Shift.prototype.createExplanation2 = teasp.view.Shift.prototype.createExplanation;
teasp.view.Shift.prototype.createExplanation = function(baseDiv, places){
    this.createExplanation2(baseDiv, places);
    for(var m = 0 ; m < this.deptKeys.length ; m++){
        deptKey = this.deptKeys[m];
        var emps = this.localObj.deptMap[deptKey];
        for(var i = 0 ; i < emps.length ; i++){
            var emp = emps[i];
            for(var n = 0 ; n < this.localObj.dateList.length ; n++){
                var dkey = this.localObj.dateList[n];
                var d = emp.days[dkey];
                var p = null;
                if(d.pattern){
                    p = d.pattern;
                }else{
                    p = emp.empType.days[dkey].config;
                }
                if(p && (p.StdStartTime__c != d.startTime || p.StdEndTime__c != d.endTime)){
                    var cellId = ((d.fix || !d.editable) ? 'xd' : 'ed') + dkey + emp.Id;
                    var divs = dojo.query('#' + cellId + ' div.dayTime');
                    if(divs.length){
                        divs[0].innerHTML = teasp.util.time.timeValue(d.startTime) + ' -<br/>' + teasp.util.time.timeValue(d.endTime);
                    }
                }
            }
        }
    }
};

teasp.view.Shift.prototype.getCsvValue1=function(e){for(var t='"部署コード","部署名","役職","社員コード","社員名"',a=teasp.util.date.getDateList(this.localObj.param.startDate,this.localObj.param.endDate),o=this.localObj.param.deptId||"(null)",s=0;s<a.length;s++)t+=',"'+teasp.util.date.formatDate(a[s],"SLA")+'"';
for(var i='"","","",""',s=0;s<a.length;s++){var n=a[s],r=[];this.localObj.pubEvents[n]&&r.push(this.localObj.pubEvents[n]),this.localObj.events[n]&&r.push(this.localObj.events[n]),i+=',"'+r.join(teasp.message.getLabel("tm10001470"))+'"'}i+='\n"","","",""';for(var s=0;s<a.length;s++){var n=a[s];i+=',"'+(this.localObj.deptEvents[o]&&this.localObj.deptEvents[o].days[n]&&this.localObj.deptEvents[o].days[n].event||"")+'"'}
i+='\n"","","",""';for(var s=0;s<a.length;s++){var n=a[s];i+=',"'+(this.localObj.deptEvents[o]&&this.localObj.deptEvents[o].days[n]&&this.localObj.deptEvents[o].days[n].note||"")+'"'}for(var l=0;l<this.deptKeys.length;l++)for(var p=this.deptKeys[l],d=this.localObj.deptMap[p],c=0;c<d.length;c++){var m=d[c];i+='\n"'+(m.DeptId__r&&m.DeptId__r.DeptCode__c||"")+'","'+(m.DeptId__r&&m.DeptId__r.Name||"")+'","'+(m.Title__c||"")+'","'+(m.EmpCode__c||"")+'","'+m.Name+'"';
for(var s=0;s<a.length;s++){var n=a[s],h=m.days[n],u=null,y="";if(h.dayType==teasp.constant.DAY_TYPE_NORMAL_HOLIDAY)y="(所定休日)";else if(h.dayType==teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY)y="(祝日)";else if(h.dayType==teasp.constant.DAY_TYPE_LEGAL_HOLIDAY)y="(法定休日)";else{var g=h.applys.holidayAll||h.applys.holidayAm&&h.applys.holidayPm;if(h.plannedHoliday&&!h.applys.kyushtu)y="[休暇](計画)";else if(g)y=h.applys.holidayAll?"[休暇]("+this.getHolidayName(h.applys.holidayAll.HolidayId__r,e.holidayFull)+")":"[休暇]("+this.getHolidayName(h.applys.holidayAm.HolidayId__r,e.holidayFull)+","+this.getHolidayName(h.applys.holidayPm.HolidayId__r,e.holidayFull)+")";else{
if(h.applys.holidayAm?y="[午前休]("+this.getHolidayName(h.applys.holidayAm.HolidayId__r,e.holidayFull)+")":h.applys.holidayPm&&(y="[午後休]("+this.getHolidayName(h.applys.holidayPm.HolidayId__r,e.holidayFull)+")"),h.pattern)if(u=h.pattern,e.patternFull)y+=(y?"\n":"")+h.pattern.Name;else{var f=h.pattern.Symbol__c||h.pattern.Name.substring(0,1);y+=(y?"\n":"")+f}else u=m.empType.days[n].config,e.patternFull&&(y+=(y?"\n":"")+"(通常勤務)");
h.workPlace&&h.workPlace.Id!=m.DeptId__c&&(y+=(y?"\n":"")+"主管部署:"+h.workPlace.Name)}}u&&e.timeIn&&(y+=(y?"\n":"")+teasp.util.time.timeValue(h.startTime)+" -"+teasp.util.time.timeValue(h.endTime)),h.temporary&&(y+=(y?"\n":"")+"(仮)"),i+=',"'+y+'"'}}return{head:t,value:i}};

teasp.view.Shift.prototype.getCsvValue2=function(e){var t='"部署コード","部署名","役職","社員コード","社員名","日付","曜日","設定","勤務パターン"';e.timeIn&&(t+=',"始業時刻","終業時刻"'),t+=',"主管部署","メモ","共通のイベント","部署のイベント","備考"';
for(var a=teasp.util.date.getDateList(this.localObj.param.startDate,this.localObj.param.endDate),o=this.localObj.param.deptId||"(null)",s="",i={},n=0;n<a.length;n++){var r=a[n];i[r]={},i[r].date=teasp.util.date.formatDate(r,"SLA"),i[r].week=teasp.util.date.formatDate(r,"JPW");var l=[];this.localObj.pubEvents[r]&&l.push(this.localObj.pubEvents[r]),this.localObj.events[r]&&l.push(this.localObj.events[r]),i[r].pubEvent=l.join(teasp.message.getLabel("tm10001470")),
i[r].event=this.localObj.deptEvents[o]&&this.localObj.deptEvents[o].days[r]&&this.localObj.deptEvents[o].days[r].event||"",i[r].note=this.localObj.deptEvents[o]&&this.localObj.deptEvents[o].days[r]&&this.localObj.deptEvents[o].days[r].note||""}for(var p=0;p<this.deptKeys.length;p++)for(var d=this.deptKeys[p],c=this.localObj.deptMap[d],m=0;m<c.length;m++)for(var h=c[m],n=0;n<a.length;n++){var r=a[n],u=i[r],y=h.days[r],g=null,f="",v="",b="",_="",T="";
if(y.dayType==teasp.constant.DAY_TYPE_NORMAL_HOLIDAY)f="(所定休日)";else if(y.dayType==teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY)f="(祝日)";else if(y.dayType==teasp.constant.DAY_TYPE_LEGAL_HOLIDAY)f="(法定休日)";else{var j=y.applys.holidayAll||y.applys.holidayAm&&y.applys.holidayPm;y.plannedHoliday&&!y.applys.kyushtu?f="[休暇](計画)":j?f=y.applys.holidayAll?"[休暇]("+this.getHolidayName(y.applys.holidayAll.HolidayId__r,e.holidayFull)+")":"[休暇]("+this.getHolidayName(y.applys.holidayAm.HolidayId__r,e.holidayFull)+","+this.getHolidayName(y.applys.holidayPm.HolidayId__r,e.holidayFull)+")":(y.applys.holidayAm?f="[午前休]("+this.getHolidayName(y.applys.holidayAm.HolidayId__r,e.holidayFull)+")":y.applys.holidayPm&&(f="[午後休]("+this.getHolidayName(y.applys.holidayPm.HolidayId__r,e.holidayFull)+")"),
y.pattern?(g=y.pattern,v=e.patternFull?y.pattern.Name:y.pattern.Symbol__c||y.pattern.Name.substring(0,1)):(g=h.empType.days[r].config,v=e.patternFull?"(通常勤務)":""),y.workPlace&&y.workPlace.Id!=h.DeptId__c&&(b=y.workPlace.Name))}g&&(_=teasp.util.time.timeValue(y.startTime),T=teasp.util.time.timeValue(y.endTime)),s+='"'+(h.DeptId__r&&h.DeptId__r.DeptCode__c||""),s+='","'+(h.DeptId__r&&h.DeptId__r.Name||""),s+='","'+(h.Title__c||""),
s+='","'+(h.EmpCode__c||""),s+='","'+h.Name,s+='","'+u.date,s+='","'+u.week,s+='","'+f+(y.temporary?"(仮)":""),s+='","'+v,e.timeIn&&(s+='","'+_,s+='","'+T),s+='","'+b,s+='","'+(y.memo||""),s+='","'+u.pubEvent,s+='","'+u.event,s+='","'+u.note,s+='"\n'}return{head:t,value:s}};

teasp.dialog.EmpDay.prototype.createContent=function(){var e,t,a;for(e=dojo.byId("EmpDayTbody");e.firstChild;)dojo.destroy(e.firstChild);var o=this.emp.days[this.dkey],s=this.emp.DeptId__r?this.emp.DeptId__r.DeptCode__c+"-"+this.emp.DeptId__r.Name:null;
s&&(t=dojo.create("tr",null,e),dojo.create("div",{innerHTML:s},dojo.create("td",null,t))),t=dojo.create("tr",null,e),dojo.create("div",{innerHTML:(this.emp.EmpCode__c||"")+"  "+this.emp.Name},dojo.create("td",null,t)),t=dojo.create("tr",null,e),dojo.create("div",{innerHTML:teasp.util.date.formatDate(this.dkey,"JP1")},dojo.create("td",null,t));var i=[],n=null,r=!1;if(o.dayType==teasp.constant.DAY_TYPE_NORMAL_HOLIDAY?i.push("所定休日"):o.dayType==teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY?i.push("祝日"):o.dayType==teasp.constant.DAY_TYPE_LEGAL_HOLIDAY?i.push("法定休日"):!o.plannedHoliday||o.applys.kyushtu&&o.applys.kyushtu.length?o.applys.holidayAll?i.push(o.applys.holidayAll.HolidayId__r.Name+" (終日)"):(i.push("勤務日"),
r=!0,n=o.pattern,o.applys.holidayAm&&i.push(o.applys.holidayAm.HolidayId__r.Name+" (午前休)"),o.applys.holidayPm&&i.push(o.applys.holidayPm.HolidayId__r.Name+" (午後休)")):i.push("有休計画付与日"),t=dojo.create("tr",null,e),dojo.create("div",{innerHTML:i.join(", ")},dojo.create("td",null,t)),r&&(n||(n=this.emp.empType.days[this.dkey].config,n.Name=" 通常勤務",n.Symbol__c=this.normalPatternSymbol)),n){if(t=dojo.create("tr",null,e),a=dojo.create("td",null,t),
o.pattern){var l=n.Symbol__c||n.Name.substring(0,1);dojo.create("div",{className:"pattern dayDiv",style:{"float":"left"},innerHTML:l},a)}dojo.create("div",{innerHTML:n.Name},a),t=dojo.create("tr",null,e);var p=teasp.util.time.timeValue(o.startTime)+"～"+teasp.util.time.timeValue(o.endTime);dojo.create("div",{innerHTML:p},dojo.create("td",null,t)),t=dojo.create("tr",null,e);for(var d=n.RestTimes__c&&n.RestTimes__c.length>0?n.RestTimes__c.split(/,/):[],c=[],m=0;m<d.length;m++){
var h=/(\d+)\-(\d+)/.exec(d[m]);h&&c.push(teasp.util.time.timeValue(h[1])+"～"+teasp.util.time.timeValue(h[2]))}dojo.create("div",{innerHTML:"(休憩："+(c.length>0?c.join(", "):"なし")+")"},dojo.create("td",null,t)),n.UseDiscretionary__c&&(t=dojo.create("tr",null,e),dojo.create("div",{innerHTML:"裁量"},dojo.create("td",null,t)))}if(o.workPlace&&o.workPlace.Id!=this.emp.DeptId__c){var l=o.workPlace.Symbol__c||o.workPlace.Name.substring(0,1);
t=dojo.create("tr",null,e),a=dojo.create("td",null,t),dojo.create("div",{innerHTML:"主管部署：",style:{"float":"left"}},a),dojo.create("div",{className:"workPlace dayDiv",style:{"float":"left",marginRight:"2px"},innerHTML:l},a),dojo.create("div",{innerHTML:" "+o.workPlace.Name},a)}for(var u in o.applys)if(o.applys.hasOwnProperty(u))for(var y=is_array(o.applys[u])?o.applys[u]:[o.applys[u]],g=0;g<y.length;g++){var f=y[g];t=dojo.create("tr",null,e),
a=dojo.create("td",null,t),dojo.create("div",{className:"pp_base pp_ap_"+teasp.view.Shift.getApplyStyleKey(u)+teasp.constant.getStatusStyleSuffix(o.applys[u].Status__c),style:{"float":"left",marginTop:"2px",marginRight:"2px"}},a);var p=f.ApplyType__c;f.ApplyType__c==teasp.constant.APPLY_TYPE_HOLIDAY?p+=f.HolidayId__r.Range__c==teasp.constant.RANGE_TIME?"("+f.HolidayId__r.Name+"/"+teasp.util.time.timeValue(f.StartTime__c)+"-"+teasp.util.time.timeValue(f.EndTime__c)+")":"("+f.HolidayId__r.Name+")":f.ApplyType__c==teasp.constant.APPLY_TYPE_PATTERNS||f.ApplyType__c==teasp.constant.APPLY_TYPE_PATTERNL?p+="("+(f.PatternId__r?f.PatternId__r.Name:"0"==f.DayType__c?"勤務日":"1"==f.DayType__c?"非勤務日":"")+")":f.ApplyType__c==teasp.constant.APPLY_TYPE_EXCHANGE&&(p+="("+teasp.util.date.formatDate(f.StartDate__c,"M/d")+"⇔"+teasp.util.date.formatDate(f.ExchangeDate__c,"M/d")+")"),
p+="("+f.Status__c+")",dojo.create("div",{innerHTML:p},a)}o.memo&&(t=dojo.create("tr",null,e),dojo.create("div",{innerHTML:teasp.util.entitize(o.memo).replace(/\n/g,"<br/>")},dojo.create("td",null,t)))};

teasp.dialog.ShiftSetting.prototype.changedPattern=function(){for(var e=dojo.byId("shiftSettingPatterns").value,t=this.pouch.allPatterns,a=null,o=0;o<t.length;o++)if(t[o].Id==e){a=t[o];break}dojo.attr("shiftSettingSt","readOnly",!1),dojo.attr("shiftSettingEt","readOnly",!1),
dojo.attr("shiftSettingSt","disabled",!("-"!=e&&"*"!=e&&a)),dojo.attr("shiftSettingEt","disabled",!("-"!=e&&"*"!=e&&a));var s=dojo.byId("shiftSettingPatternIcon");if(dojo.empty(s),"-"!=e&&"*"!=e)if(a){var i=a.Symbol__c||a.Name.substring(0,1);dojo.create("div",{className:"pattern dayDiv",style:{marginLeft:"auto",marginRight:"auto"},innerHTML:i},s),dojo.byId("shiftSettingSt").value=teasp.util.time.timeValue(a.StdStartTime__c),
dojo.byId("shiftSettingEt").value=teasp.util.time.timeValue(a.StdEndTime__c)}else dojo.byId("shiftSettingSt").value="",dojo.byId("shiftSettingEt").value="";else{var n="-"==e?this.defaultVals.normalSEList:this.defaultVals.currentSEList;if(1==n.length){var r=n[0];dojo.byId("shiftSettingSt").value=teasp.util.time.timeValue(r.st),dojo.byId("shiftSettingEt").value=teasp.util.time.timeValue(r.et)}else dojo.byId("shiftSettingSt").value="",
dojo.byId("shiftSettingEt").value=""}if(1==this.defaultVals.memoList.length)this.getNoteDisNode().checked=!1,dojo.style("shiftSettingNoteDis","display","none"),dojo.byId("shiftSettingNote").disabled=!1,dojo.byId("shiftSettingNote").value=this.defaultVals.memoList[0];else{var l=this.defaultVals.memoList.length;this.getNoteDisNode().checked=l>1,dojo.style("shiftSettingNoteDis","display",l>1?"":"none"),dojo.byId("shiftSettingNote").disabled=l>1,
dojo.byId("shiftSettingNote").value=""}};

teasp.dialog.ShiftSetting.prototype.ok=function(){var e=dojo.byId("shiftSettingDepts").value,t=dojo.byId("shiftSettingPatterns").value,a="*"==dojo.byId("shiftSettingDayType").value?null:dojo.byId("shiftSettingDayType").value,o=dojo.byId("shiftSettingNote").value,s=teasp.util.time.clock2minutes(dojo.byId("shiftSettingSt").value),i=teasp.util.time.clock2minutes(dojo.byId("shiftSettingEt").value);
s="number"==typeof s?s:null,i="number"==typeof i?i:null;var n=this.args.target;for(var r in n)if(n.hasOwnProperty(r)){for(var l={},p=0;p<n[r].dateList.length;p++){var d=n[r].dateList[p];l[d]={dayType:a,workPlaceId:e||null,deptId:this.getDeptIdByEmpId(r),patternId:t,note:this.getNoteDisNode().checked?this.getOrgMemo(r,d):o,startTime:s,endTime:i}}n[r]=l}this.onfinishfunc({target:n},"shiftSettingErrorRow",function(e){this.hide();
},this)};

teasp.dialog.EmpShift.prototype.changedPattern=function(){for(var e=dojo.byId("empShiftPatterns").value,t=this.pouch.allPatterns,a=null,o=0;o<t.length;o++)if(t[o].Id==e){a=t[o];break}dojo.attr("empShiftSt","disabled",!0),
dojo.attr("empShiftEt","disabled",!0);var s=dojo.byId("empShiftPatternIcon");if(dojo.empty(s),"-"!=e&&"*"!=e)if(a){var i=a.Symbol__c||a.Name.substring(0,1);dojo.create("div",{className:"pattern dayDiv",style:{marginLeft:"auto",marginRight:"auto"},innerHTML:i},s),dojo.byId("empShiftSt").value=teasp.util.time.timeValue(a.StdStartTime__c),dojo.byId("empShiftEt").value=teasp.util.time.timeValue(a.StdEndTime__c)}else dojo.byId("empShiftSt").value="",
dojo.byId("empShiftEt").value="";else dojo.byId("empShiftSt").value="",dojo.byId("empShiftEt").value=""};
}
