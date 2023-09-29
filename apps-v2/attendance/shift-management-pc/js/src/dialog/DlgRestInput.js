teasp.provide('teasp.dialog.RestInput');
/**
 * 休憩時間入力ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.RestInput = function(){
    this.id = 'dialogRestInput';
    this.title = '';
    this.duration = 1;
    this.content = '<table id="dialogRestInputTable"><tr><td class="restInputTop"></td></tr><tr><td class="restInputBody"><table><tbody><tr><td><div class="restInputLabel"></div></td><td><table><tbody><tr><td><div class="restInputArea"><table><tbody id="dialogRestInputBody"></tbody></table></div></td><td class="restInputPlus"><input type="button" id="dialogRestInputAdd" class="pb_base pb_btn_plus"></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr id="dialogRestInputError" style="display:none;"><td><div></div></td></tr><tr id="dialogRestInputNote" style="display:none;"><td><div></div><div></div></td></tr><tr class="ts-buttons-row"><td><div><button class="std-button1" id="dialogRestInputOk"><div></div></button><button class="std-button2" id="dialogRestInputCancel"><div></div></button><button class="std-button2" id="dialogRestInputClose"><div></div></button></div></td></tr></table>';
    this.okLink = {
        id       : 'dialogRestInputOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'dialogRestInputCancel',
        callback : this.hide
    };
    this.closeLink = {
        id       : 'dialogRestInputClose',
        callback : this.hide
    };
    this.eventHandles = [];
};

teasp.dialog.RestInput.prototype = new teasp.dialog.Base();

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.RestInput.prototype.preShow = function(){
    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    this.showError();

    dojo.byId('dialogRestInput_title').innerHTML = teasp.message.getLabel('tf10007280'); // 休憩時間の設定
    dojo.query('#dialogRestInputTable div.restInputLabel')[0].innerHTML = teasp.message.getLabel('restTime_label'); // 休憩時間
    // ボタン
    dojo.byId('dialogRestInputOk'    ).firstChild.innerHTML = teasp.message.getLabel('ok_btn_title');
    dojo.byId('dialogRestInputCancel').firstChild.innerHTML = teasp.message.getLabel('cancel_btn_title');
    dojo.byId('dialogRestInputClose' ).firstChild.innerHTML = teasp.message.getLabel('close_btn_title');

    dojo.style('dialogRestInputOk'    , 'display', (this.args.fix ? 'none' : ''));
    dojo.style('dialogRestInputCancel', 'display', (this.args.fix ? 'none' : ''));
    dojo.style('dialogRestInputClose' , 'display', (this.args.fix ? '' : 'none'));

    dojo.style(dojo.byId('dialogRestInputTable').parentNode, 'background-color', (this.args.fix ? '#eee' : 'white'));
    if(this.args.fix){
        dojo.byId('dialogRestInputAdd').className = 'pb_base pb_btn_plus_dis';
    }else{
        dojo.byId('dialogRestInputAdd').className = 'pb_base pb_btn_plus';
        this.eventHandles.push(dojo.connect(dojo.byId('dialogRestInputAdd'), 'onclick', this, this.insertRestRow));
    }

    var tbody = dojo.byId('dialogRestInputBody');
    dojo.empty(tbody);

    var rests = this.args.rests || [];
    rests = rests.sort(function(a, b){
        var na = (typeof(a.from) == 'number' ? a.from : a.to);
        var nb = (typeof(b.from) == 'number' ? b.from : b.to);
        return na - nb;
    });
    for(var i = 0 ; i < rests.length ; i++){
        if(i >= tbody.rows.length){
            this.insertRestRow();
        }
        row = tbody.rows[i];
        row.cells[0].firstChild.value = this.pouch.getDisplayTime(rests[i].from);
        row.cells[2].firstChild.value = this.pouch.getDisplayTime(rests[i].to  );
    }
    while(tbody.rows.length < 5){
        this.insertRestRow();
    }

	if(!teasp.isNarrow()){
		dojo.style('dialogRestInputTable', 'width', '270px');
	}else{
		dojo.style('dialogRestInputTable', 'width', '100%');
	}

	dojo.style('dialogRestInputNote', 'display', (this.args.note ? '' : 'none'));
    if(this.args.note){
        dojo.query('#dialogRestInputNote div')[0].innerHTML = teasp.message.getLabel('tk10000611');
        dojo.query('#dialogRestInputNote div')[1].innerHTML = this.args.note;
    }

    return true;
};

teasp.dialog.RestInput.prototype.insertRestRow = function(){
    var fxtimes = this.args.fxtimes;
    var tbody = dojo.byId('dialogRestInputBody');
    if(tbody.rows.length >= 10){
        return;
    }
    var row = dojo.create('tr', null, tbody);

    var cell = dojo.create('td', { style: { paddingTop:"1px" } }, row);
    var inp = dojo.create('input', {
        type      : 'text',
        value     : '',
        maxlength : '5',
        style     : { margin:"0px" },
        className : (this.args.fix ? 'inputro' : 'inputran') + ' inputime roundBegin'
    }, cell);
    if(this.args.fix){
        inp.readOnly = true;
    }else{
        inp.readOnly = false;
        this.eventHandles.push(dojo.connect(inp, 'blur'      , this, teasp.util.time.onblurTime    ));
        this.eventHandles.push(dojo.connect(inp, 'onkeypress', this, teasp.util.time.onkeypressTime));
        dojo.attr(inp, 'fxtimes', fxtimes); // 所定休憩の設定時刻は丸めないようにする
    }

    dojo.create('td', {
        innerHTML : teasp.message.getLabel('wave_label'), // ～
        width     : '20px',
        style     : { paddingTop:"1px", textAlign:"center" }
    }, row);

    cell = dojo.create('td', { style: { paddingTop:"1px" } }, row);
    inp = dojo.create('input', {
        type      : 'text',
        value     : '',
        maxlength : '5',
        style     : { margin:"0px" },
        className : (this.args.fix ? 'inputro' : 'inputran') + ' inputime roundEnd'
    }, cell);
    if(this.args.fix){
        inp.readOnly = true;
    }else{
        inp.readOnly = false;
        this.eventHandles.push(dojo.connect(inp, 'blur'      , this, teasp.util.time.onblurTime    ));
        this.eventHandles.push(dojo.connect(inp, 'onkeypress', this, teasp.util.time.onkeypressTime));
        dojo.attr(inp, 'fxtimes', fxtimes); // 所定休憩の設定時刻は丸めないようにする
    }

    cell = dojo.create('td', { width: '66px', style: { paddingTop:"1px", paddingLeft:"12px", textAlign:"center" } }, row);

    // 休憩削除ボタン
    dojo.create('input', {
        type      : 'button',
        className : 'pp_base pp_btn_del' + (this.args.fix ? '_dis' : ''),
        style     : { cursor:(this.args.fix ? "pointer" : "default") },
        title     : teasp.message.getLabel('delete_menu'), // 削除
        onclick   : !this.args.fix ? dojo.hitch(this, function(e){
            if (!e) e = window.event;
            var div = (e.srcElement ? e.srcElement : e.target);
            var r = div.parentNode.parentNode;
            if(r.tagName == 'TR'){
                var st = r.cells[0].firstChild.value.trim(); // 開始時刻
                var et = r.cells[2].firstChild.value.trim(); // 終了時刻
                st = (st != '' ? teasp.util.time.clock2minutes(st) : null);
                et = (et != '' ? teasp.util.time.clock2minutes(et) : null);
                var t = { from: st, to: et };
                var deleteRest = function(){
                    dojo.byId('dialogRestInputAdd').className = 'pb_base pb_btn_plus';
                    dojo.byId('dialogRestInputBody').deleteRow(r.rowIndex);
                };
                if(t.from != null || t.to != null){
                    // 休憩時間を削除しますか？
                    teasp.manager.dialogOpen('MessageBox', {
                        title   : teasp.message.getLabel('em10002080'), // 確認
                        message : teasp.message.getLabel('tm10003940')
                    }, this.pouch, this, function(){
                        deleteRest();
                    });
                }else{
                    deleteRest();
                }
            }
        }) : function(){}
    }, cell);

    if(!this.args.fix && tbody.rows.length >= 10){
        dojo.byId('dialogRestInputAdd').className = 'pb_base pb_btn_plus_dis';
    }
};

/**
 * エラー表示
 */
teasp.dialog.RestInput.prototype.showError = function(msg){
    dojo.style('dialogRestInputError', 'display', (msg ? '' : 'none'));
    dojo.query('#dialogRestInputError div')[0].innerHTML = msg;
};

/**
 * OK
 *
 * @override
 */
teasp.dialog.RestInput.prototype.ok = function(){
    this.showError();
    var rests = [];
    var tbody = dojo.byId('dialogRestInputBody');
    var total = 0;
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var row = tbody.rows[i];
        var from = teasp.util.time.clock2minutes(row.cells[0].firstChild.value);
        var to   = teasp.util.time.clock2minutes(row.cells[2].firstChild.value);
        if(typeof(from) == 'number' || typeof(to) == 'number'){
            o = {
                from: (typeof(from) == 'number' ? from : null),
                to  : (typeof(to)   == 'number' ? to   : null)
            };
            o.type = teasp.constant.REST_FIX;
            rests.push(o);
            if(o.from === null || o.to === null || o.from >= o.to || o.to > 2880){
                this.showError(teasp.message.getLabel('tk10001096')); // 休憩時間を正しく入力してください
                return;
            }
            total += (o.to - o.from);
        }
    }
    if(rests.length){
        rests = rests.sort(function(a, b){
            var na = (typeof(a.from) == 'number' ? a.from : a.to);
            var nb = (typeof(b.from) == 'number' ? b.from : b.to);
            return na - nb;
        });
        var rs = teasp.util.time.margeTimeSpans(rests);
        var t = teasp.util.time.rangeTime({from:0,to:2880}, rs);
        if(t < total){
            this.showError(teasp.message.getLabel('tm10001480')); // 休憩時間同士が重複しないように入力してください
            return;
        }
    }
    this.dialog.hide();
    this.onfinishfunc(rests);
};
