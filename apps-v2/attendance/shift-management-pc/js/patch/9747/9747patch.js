if(typeof(teasp) == 'object' && !teasp.resolved['SECOM'] && teasp.dialog && teasp.dialog.InputTime){
teasp.dialog.InputTime.prototype.createInputArea=function(e,t){var a=0,o=e<2?2:e,s=dojo.byId("timeInputArea");
dojo.empty(s);var i=this.dayWrap.getInputLimit().flag,n=dojo.create("tr",null,s);dojo.create("td",{className:"edge_gray_tl"},n),dojo.create("td",{colSpan:"5"},n),dojo.create("td",{className:"edge_gray_tr"},n),n=dojo.create("tr",{style:{height:"5px"}},s),dojo.create("td",{colSpan:"7"},n),n=dojo.create("tr",null,s),dojo.create("td",null,n);var r=dojo.create("td",{style:"width:124px;vertical-align:middle;"},n);dojo.create("div",{
className:"tt_col start-end",innerHTML:teasp.message.getLabel("startTime_head")},r),r=dojo.create("td",{style:"width:49px;"},n);var l=dojo.create("input",{type:"text",className:"inputime roundBegin",id:"startTime"},r);this.isReadOnly()||this.isNoEntry()||1&i?(l.readOnly="readOnly",dojo.toggleClass(l,"inputro",!0)):(this.eventHandles.startTimeb=dojo.connect(l,"blur",this,function(e){teasp.util.time.onblurTime(e),this.changedTime();
}),this.eventHandles.startTimek=dojo.connect(l,"onkeypress",this,function(e){teasp.util.time.onkeypressTime(e),13===e.keyCode&&this.changedTime()})),r=dojo.create("td",{id:"pushStartTime",colSpan:"4",style:"padding-left:8px;font-size:0.8em;color:#3333CC;white-space:nowrap;"},n),n=dojo.create("tr",null,s),dojo.create("td",null,n),dojo.create("td",{colSpan:"5",className:"gyokan_dash"},n),dojo.create("td",null,n),n=dojo.create("tr",null,s),
dojo.create("td",null,n),r=dojo.create("td",{style:"width:124px;vertical-align:middle;"},n),dojo.create("div",{className:"tt_col start-end",innerHTML:teasp.message.getLabel("endTime_head")},r),r=dojo.create("td",{style:"width:49px;"},n),l=dojo.create("input",{type:"text",className:"inputime roundEnd",id:"endTime"},r),this.isReadOnly()||this.isNoEntry()||2&i?(l.readOnly="readOnly",dojo.toggleClass(l,"inputro",!0)):(this.eventHandles.endTimeb=dojo.connect(l,"blur",this,function(e){
teasp.util.time.onblurTime(e),this.changedTime()}),this.eventHandles.endTimek=dojo.connect(l,"onkeypress",this,function(e){teasp.util.time.onkeypressTime(e),13===e.keyCode&&this.changedTime()})),r=dojo.create("td",{id:"pushEndTime",colSpan:"4",style:"padding-left:8px;font-size:0.8em;color:#3333CC;white-space:nowrap;"},n),n=dojo.create("tr",null,s),dojo.create("td",null,n),dojo.create("td",{colSpan:"5",className:"gyokan_dash"
},n),dojo.create("td",null,n);for(var p=0;p<o;p++)this.createRestRow(s,p,-1,0===p,2*o-1);for(dojo.query(".tt_rest_plus").forEach(function(e){e.firstChild.disabled=o>=this.restMax,e.firstChild.className=o>=this.restMax||this.isReadOnly()||this.isNoEntry()?"pb_btn_plusL_dis":"pb_btn_plusL"},this),n=dojo.create("tr",{className:"tt_rest_end"},s),dojo.create("td",null,n),dojo.create("td",{colSpan:"5",className:a?"gyokan_dash":""
},n),dojo.create("td",null,n),p=0;p<a;p++)this.createOutRow(s,p,-1,0===p,2*a-1);dojo.query(".tt_out_plus").forEach(function(e){e.firstChild.disabled=a>=this.outMax,e.firstChild.className=a>=this.outMax||this.isReadOnly()?"pb_btn_plusL_dis":"pb_btn_plusL"},this),n=dojo.create("tr",{className:"tt_out_end"},s),dojo.create("td",null,n),dojo.create("td",{colSpan:"5",className:"tt_gyokan"},n),dojo.create("td",null,n),n=dojo.create("tr",null,s),
dojo.create("td",{className:"edge_gray_bl"},n),dojo.create("td",{colSpan:"5"},n),dojo.create("td",{className:"edge_gray_br"},n)};
teasp.data.EmpDay.prototype.getTimeTable=function(e){for(var t=this.day.timeTable||[],a=t.length-1;a>=0;a--){var o=t[a];o.type==teasp.constant.AWAY&&t.splice(a,1);
}if(!e||!t.length)return t;var s=this.day.real?this.day.real.blankSpan||[]:[];if(!s.length)return t;t=dojo.clone(t);for(var a=t.length-1;a>=0;a--){var o=t[a];if(o.type==teasp.constant.REST_FIX){var i=teasp.util.time.rangeTime(o,s);if(i>0)if(i==o.to-o.from)t.splice(a,1);else{var n=teasp.util.time.excludeRanges([o],s);n&&n.length>0&&(o.from=n[0].from,o.to=n[0].to)}}}return t};
}