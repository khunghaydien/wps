/**
 * 日付選択ツールチップダイアログ
 *
 * @constructor
 */
teasp.Tsf.Calendar = function(){
    this.dialog = new dijit.TooltipDialog({
        id       : 'tsfCalendar',
        content  : '<div><div id="tsfCalendarArea"></div></div>',
        onClick  : function(e){
            // クリックイベントを親ウィンドウへ伝播させない
            e.preventDefault();
            e.stopPropagation();
        },
        onKeyPress : dojo.hitch(this, function(e){
            if(e.keyCode === 27){
                dijit.popup.close(this.dialog);
            }
        })/*,
        onMouseLeave: function(e){
            dijit.popup.close(that.dialog);
        }*/
    });

    this.dialog.startup();

    // ダイアログを開いた時のイベント
    dojo.connect(this.dialog, 'onOpen', this, function(e){
        // 前のカレンダーを破棄
        if(this.calendar){
            this.calendar.destroyRecursive(true);
            dojo.disconnect(this.calendarEvent);
        }
        // カレンダー本体作成
        this.calendar = new dijit.Calendar({ isDisabledDate  : this.param.isDisabledDate }, "tsfCalendarArea");
        if(this.param.tagName){
            var inp = dojo.query('input[name="' + this.param.tagName + '"]');
            if(inp && inp.length){
                var d = (teasp.util.date.parseDate(inp[0].value) || new Date());
                this.calendar.setValue(d);
            }
        }
        // 日付が選択された時の処理
        this.calendarEvent = dojo.connect(this.calendar, 'onValueSelected', this, function(d){
            // 選択値を入力欄にセット
            if(this.param.tagName){
                dojo.query('input[name="' + this.param.tagName + '"]').forEach(function(el){
                    el.value = teasp.util.date.formatDate(d, 'SLA');
//                    el.value = d.getFullYear()
//                            + '/' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1)
//                            + '/' + (d.getDate() < 10 ? '0' : '') + d.getDate();
                    if(this.param.selectedDate){
                        this.param.selectedDate(el);
                    }
                }, this);
                dijit.popup.close(this.dialog); // ダイアログを閉じる
            }
        });
        this.calendar.startup();
    });
};

/**
 * ボタンがクリックされたら、ダイアログを開くイベントハンドラをセット
 *
 * @param {Object} domHelper teasp.Tsf.Dom インスタンス
 * @param {Object} button ボタン
 * @param {Object} around 日付入力欄
 * @param {Object} param 選択値の入力欄、日付を有効/無効を判定するファンクション
 * @param {Object} hkey リソース解放用キー
 */
teasp.Tsf.Calendar.prototype.eventOpenCalendar = function(domHelper, button, around, param, hkey){
    domHelper.connect(button, 'onclick', this, function(){
        this.param = param || {};
        dijit.popup.open({
            popup: this.dialog,
            around: around
        });
    }, hkey);
};

/**
 * ダイアログ領域外がクリックされたら、ダイアログを閉じるイベントハンドラをセット
 *
 * @param {teasp.Tsf.Dom} domHelper
 * @param {string} areaId
 * @param {string} ignoreClass このクラス名のタグがクリックされた場合は閉じない
 * @param {string} hkey リソース解放用キー
 */
teasp.Tsf.Calendar.prototype.eventCloseCalendar = function(domHelper, areaId, ignoreClass, hkey){
//    domHelper.connect(dojo.byId(areaId), 'onclick', this, function(e){
      domHelper.connect(window, 'onclick', this, function(e){
        if(e.target.className.indexOf('dijitCalendar') >= 0){
            // カレンダーの月プルダウン選択で、ここにきた場合、無視する
            return;
        }
        if(!dojo.hasClass(e.target, ignoreClass)
        && !dojo.hasClass(e.target, 'ts-legacy-cal')
        && !dojo.hasClass(e.target, 'pp_btn_ektsrch')){
            dijit.popup.close(this.dialog);
        }
    }, hkey);
};
