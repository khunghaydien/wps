teasp.provide('teasp.dialog.Calendar');
/**
 * 日付選択ダイアログ
 *
 * @constructor
 * @extends teasp.dialog.Base
 */
teasp.dialog.Calendar = function(){
    this.id = 'dialogCalendar';
    this.title = teasp.message.getLabel('tm60001010'); // 日付選択
    this.duration = 1;
//    this.widthHint = 236;
//    this.heightHint = 300;
    this.content = '<table border="0" cellpadding="0" cellspacing="0" style="font-size:12px;"><tr><td style="padding-left:4px;padding-right:4px;"><div id="_atk_cal"></div></td></tr><tr><td style="text-align:center;padding-top:0px;"><input type="button" class="pb_base pb_btn_cancel" id="_atk_cal_cancel" style="font-size:13px;padding:6px 16px;"/></td></tr></table>';
    this.cancelLink = {
        id       : '_atk_cal_cancel',
        callback : this.close
    };

    this.calendar = null;
    this.busy = false;
};

teasp.dialog.Calendar.prototype = new teasp.dialog.Base();

/**
 * @override
 */
teasp.dialog.Calendar.prototype.preInit = function(){
    dojo.require("dijit.Calendar");
};

/**
 * @override
 */
teasp.dialog.Calendar.prototype.preShow = function(){
    this.busy = true;

    if(this.calendar){
        this.calendar.destroy('_atk_cal');
    }
    this.calendar = new dijit.Calendar({
        isDisabledDate  : this.args.isDisabledDateFunc
    }, "_atk_cal");

    dojo.connect(this.calendar, 'onValueSelected', this, this.selected);

    if(this.args.date){
        this.calendar.setValue(this.args.date);
    }

    this.calendar.startup();
    this.dialog.startup();

    // 初期値と同じ日付をクリックしても、onValueSelected イベントが呼ばれないため、
    // 強制で呼ばれるようにする。
    var that = this;
    if(this.args.date){
        var ad = (typeof(this.args.date) == 'object' ? this.args.date : teasp.util.date.parseDate(this.args.date));
        var day = ad.getDate();
        dojo.query('.dijitCalendarDateLabel', '_atk_cal').forEach(function(elem){
            if(elem.parentNode.className.indexOf('dijitCalendarSelectedDate') >= 0){
                var s = (elem.textContent || elem.innerText);
                if(s == day){
                    dojo.connect(elem.parentNode, 'onclick', that, function(){
                        var d = that.args.date;
                        return function(){
                            this.selected(d);
                        };
                    }());
                }
            }
        });
    }

    this.busy = false;

    return true;
};

/**
 * 日付を選択して閉じる
 */
teasp.dialog.Calendar.prototype.selected = function(){
    if(this.busy){
        return;
    }
    this.dialog.hide();
    this.onfinishfunc(arguments[0]);
};
