if(typeof(teasp) == 'object' && teasp.view && teasp.view.Daily){
if(dojo.byId('tsfFormArea'))
    dojo.style('tsfFormArea', 'display', 'none');
if(dojo.byId('toggleWorkEnd'))
    dojo.style('toggleWorkEnd', 'display', 'none');
dojo.query('#timeAreaR > table > tbody > tr:nth-child(2)').forEach(function(el){
    dojo.style(el, 'display', 'none');
});
teasp.view.Daily.prototype.initDaily = function(){
    teasp.message.setLabelHtml('section_label');
    teasp.message.setLabelHtml('empName_label');
    teasp.message.setLabelHtml('chatter_Info_1');
    teasp.message.setLabelHtml('chatter_Info_2');
    teasp.message.setLabelHtml('schedule_label','schedule_label');
    teasp.message.setLabelHtml('empWork_label','empWork_label');
    teasp.message.setLabelHtml('importFromSchedule_Info');
    teasp.message.setLabelHtml('workReport_label','workReport_label');
    teasp.message.setLabelHtml('totalCost_foot','total_label');
    teasp.message.setLabelHtml('atkWorlInfo_label','empTime_label');
    teasp.message.setLabelHtml('expAdjustment_label','empExp_caption');
    teasp.message.setLabelHtml('tr_type_head','expItem_head');
    teasp.message.setLabelHtml('tr_route_head','expRoute_head');
    teasp.message.setLabelHtml('tr_cost_head','expCost_head');
    teasp.message.setLabelHtml('tr_detail_head','expNote_head');
    teasp.message.setLabelHtml('totalCost_foot_2','total_label');

    teasp.message.setLabelTitle('buttonDateSelect','calendar_btn_title');
    teasp.message.setLabelTitle('clearComment');
    teasp.message.setLabelTitle('empWorkEdit'      , 'empWorkEdit_btn_title');
    teasp.message.setLabelTitle('jumpToEmpJob'     , 'empWorkView_btn_title');
    teasp.message.setLabelTitle('jumpToEmpWorkTime', 'empTimeView_btn_title');
    teasp.message.setLabelTitle('empExpInsert'     , 'empExpNew_btn_title');
    teasp.message.setLabelTitle('tr_btn_tomon'     , 'empExpView_btn_title');

    dojo.query('td.ts-top-title > div.main-title').forEach(function(elem){
        elem.innerHTML = teasp.message.getLabel('tk10000238');
    }, this);
    dojo.query('td.ts-top-title > div.sub-title').forEach(function(elem){
        elem.innerHTML = teasp.message.getLabel('tf10004560');
    }, this);

    dojo.byId('buttonPrevDate').firstChild.innerHTML = teasp.message.getLabel('tf10000320');
    dojo.byId('buttonCurrDate').firstChild.innerHTML = teasp.message.getLabel('nextDay_btn_title');
    dojo.byId('buttonNextDate').firstChild.innerHTML = teasp.message.getLabel('tf10000330');

    dojo.byId('clearComment').firstChild.innerHTML  = teasp.message.getLabel('clearLabel');

    dojo.query('#endAndDayFixLabel > span').forEach(function(el){
        el.innerHTML = teasp.message.getLabel('tk10004050');
    });

    dojo.byId('empTypeTitle').innerHTML  = teasp.message.getLabel('empType_label');

    dojo.connect(dojo.byId('empWorkEdit')    , 'onclick', this, this.openEmpWork   );
    dojo.connect(dojo.byId('empWorkFromSche'), 'onclick', this, this.openEmpWorkImp);
    dojo.connect(dojo.byId('buttonPrevDate') , 'onclick', this, this.changePrevDate);
    dojo.connect(dojo.byId('buttonCurrDate') , 'onclick', this, this.changeCurrDate);
    dojo.connect(dojo.byId('buttonNextDate') , 'onclick', this, this.changeNextDate);

    var helpLinks = dojo.query('td.ts-top-button3 > a', dojo.byId('expTopView'));
    if(helpLinks.length > 0){
        helpLinks[0].href = this.pouch.getHelpLink();
    }
    dojo.query('.emp_work_note_area').forEach(function(elem){
        dojo.style(elem, 'display', (this.pouch.getWorkNoteOption() ? '' : 'none'));
    }, this);
    dojo.style('empWorkDiv', 'height', (this.pouch.getWorkNoteOption() ? '275px' : '392px'));

    var pDiv = dojo.query('#expTopView td.ts-top-photo > div')[0];
    var photoUrl = this.pouch.getSmallPhotoUrl();
    var photoDiv = null;
    if(photoUrl){
        photoDiv = dojo.create('img', {
            src       : photoUrl,
            style     : { cursor:"pointer" },
            className : 'smallPhoto'
        }, pDiv);
    }else{
        photoDiv = dojo.create('img', {
            style     : { cursor:"pointer" },
            className : 'pp_base pp_default_photo'
        }, pDiv);
    }
    dojo.connect(photoDiv, 'onclick', this, this.openEmpView);
    photoDiv.title  = teasp.message.getLabel('personal_link_title');

    this.dateList = new dijit.form.Select({
        id: "dateList",
        maxHeight : 480,
        name: "selectdate",
        style: { fontSize:"12px", width:"108px" },
        className: 'dojo_date_list'
    },
    "dateListArea");
    dojo.connect(this.dateList, 'onChange', this, this.changedDateSelect);

    this.createSfcalTable();

    dojo.style('endAndDayFixLabel', 'display', this.pouch.isUseDailyApply() ? '' : 'none');

    this.refreshDaily(true);

    dojo.connect(dojo.byId('clearComment') , 'onclick', this, this.clearComment);
    var comment = dojo.byId('endComment');
    comment.value = this.COMMENT_QUEST;
    dojo.style(comment, 'color', this.COMMENT_QUEST_COLOR);
    dojo.connect(comment, 'onfocus', this, function(e){
        if(comment.value == this.COMMENT_QUEST){
            comment.value = '';
        }
        dojo.style(comment, 'color', '#222222');
    });
    dojo.connect(comment, 'onblur', this, function(e){
        if(comment.value == ''){
            comment.value = this.COMMENT_QUEST;
            dojo.style(comment, 'color', this.COMMENT_QUEST_COLOR);
        }
    });
    this.viewPlus();
};
teasp.view.Daily.prototype.reflectWorkOption = function(){
    dojo.query('.emp_work_note_area').forEach(function(elem){
        dojo.style(elem, 'display', (this.pouch.getWorkNoteOption() ? '' : 'none'));
    }, this);
    dojo.style('empWorkDiv', 'height', (this.pouch.getWorkNoteOption() ? '275px' : '392px'));
};
teasp.view.Daily.prototype.setPushButton = function(){
};
}
