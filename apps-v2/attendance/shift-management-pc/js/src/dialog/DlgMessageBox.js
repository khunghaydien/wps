teasp.provide('teasp.dialog.MessageBox');
/**
 * コメント入力ダイアログ
 *
 * @constructor
 * @extends teasp.dialog.Base
 */
teasp.dialog.MessageBox = function(){
    this.id = 'messageBoxDialog';
    this.duration = 1;
    this.content = '<table id="messageBoxTable"><tr><td class="message_area"><div id="messageBoxMessage"></div><div id="messageBoxCheck"></div></td></tr><tr id="messageBoxErrorRow" style="display:none;"><td><div id="messageBoxError"></div></td></tr><tr class="ts-buttons-row"><td><div><button class="std-button1" id="messageBoxOk"><div></div></button><button class="std-button2" id="messageBoxCancel"><div></div></button></div></td></tr></table>';
    this.checkSeq = 0;
    this.okLink = {
        id       : 'messageBoxOk',
        callback : this.ok
    };
    this.cancelLink = {
        id       : 'messageBoxCancel',
        callback : this.cancel
    };
};

teasp.dialog.MessageBox.prototype = new teasp.dialog.Base();

/**
 * @override
 */
teasp.dialog.MessageBox.prototype.preShow = function(){
    dojo.byId('messageBoxMessage').innerHTML = (this.args.message || '');

    if(!this.args.title){
        this.widthHint = 0;
        dojo.query(".dijitDialogTitleBar", this.dialog.id)[0].style.display = 'none';
        this.dialog._position = dojo.hitch(this.dialog, function(){
            var style = this.domNode.style;
            style.left = "20px";
            style.top  = "4px";
        });
    }else{
        dojo.byId('messageBoxDialog_title').innerHTML = this.args.title;
        // タイトルバーの色とツールチップを変更
        dojo.query('.dijitDialogTitleBar', 'messageBoxDialog').forEach(function(elem){
            if(!this.args.defaultTitleColor){
                elem.style.backgroundColor = (this.args.titleBgColor || '#fef263');
            }
            elem.title = this.args.title;
        }, this);
    }

    // チェックボックスを配置
    var div = dojo.byId('messageBoxCheck');
    dojo.empty(div);
    var checks = (this.args.check || {});
    for(var key in checks){
        if(!checks.hasOwnProperty(key)){
            continue;
        }
        var c = checks[key];
        var msgDiv = dojo.create('div', { className:(c.checked === undefined ? "ts_message" : "ts_check") }, div);
        var pDiv = msgDiv;
        if(c.bullet){ // 箇条書き風にする
            dojo.create('div', {
                style: "display:inline-block;vertical-align:top;",
                innerHTML: teasp.message.getLabel('tf10009790') // ＊
            }, msgDiv);
            msgDiv = dojo.create('div', {
                style:"display:inline-block;width:95%;"
            }, msgDiv);
        }
        if(c.checked === undefined){
            msgDiv.appendChild(dojo.doc.createTextNode(' ' + (c.title || '')));
        }else{
            c.seq = (++this.checkSeq);
            var label = dojo.create('label', null, msgDiv);
            var inp   = dojo.create('input', { type: 'checkbox', id: 'messageBoxCheck' + c.seq }, label);
            label.appendChild(dojo.doc.createTextNode(' ' + (c.title || '')));
            if(this.args.hint){
                dojo.create('div', { className:'pp_base pp_icon_help' }
                , dojo.create('div', { style:'display:inline-block;margin-left:10px;', id:'messageBoxHint' + c.seq }, msgDiv));
                new dijit.Tooltip({
                    connectId: 'messageBoxHint' + c.seq,
                    label: this.args.hint,
                    position: ['below']
                })
            }
            inp.checked = c.checked;
        }
        if(c.style){
            for(var skey in c.style){
                dojo.style(pDiv, skey, c.style[skey]);
            }
        }
    }
    var radios = this.args.radios;
    if(radios){
        for(var i = 0 ; i < radios.length ; i++){
            var o = radios[i];
            var radio = dojo.byId(o.id);
            if(radio && o.checked){
                radio.checked = true;
                break;
            }
        }
    }

    if(this.args.closeOnly){
        dojo.style('messageBoxOk'    , 'display'    , 'none');
        dojo.style('messageBoxCancel', 'margin-left', '0px' );
    }else{
        dojo.style('messageBoxOk'    , 'display'    , ''    );
        dojo.style('messageBoxCancel', 'margin-left', '16px');
    }

    dojo.byId('messageBoxOk'    ).firstChild.innerHTML = teasp.message.getLabel('ok_btn_title');
    dojo.byId('messageBoxCancel').firstChild.innerHTML = teasp.message.getLabel(this.args.closeOnly ? 'close_btn_title' : 'cancel_btn_title');

	dojo.style('messageBoxTable', 'width', (teasp.isNarrow() ? '100%' : this.args.dialogWidth || '410px'));
	if(teasp.isNarrow()){
		dojo.style('messageBoxTable', 'border', '1px solid #ccc');
	}

	this.showError(null);

    return true;
};

teasp.dialog.MessageBox.prototype.cancel = function(){
	this.hide();
    if(this.args.closeFunc){
        this.args.closeFunc();
    }
};

/**
 * 登録
 * @override
 */
teasp.dialog.MessageBox.prototype.ok = function(){
    this.hide();
    if(this.args.radios){
        var radios = this.args.radios;
        var res = null;
        for(var i = 0 ; i < radios.length ; i++){
            var o = radios[i];
            var radio = dojo.byId(o.id);
            if(radio && radio.checked){
                res = o;
                break;
            }
        }
        this.onfinishfunc(res);
    }else{
        var checks = (this.args.check || {});
        for(var key in checks){
            if(!checks.hasOwnProperty(key)){
                continue;
            }
            var c = checks[key];
            var check = dojo.byId('messageBoxCheck' + c.seq);
            c.checked = (check ? check.checked : null);
        }
        this.onfinishfunc(checks);
    }
};

/**
 * エラー表示
 * @param {string|null=} msg エラーメッセージ。null（または省略）の場合は非表示にする。
 */
teasp.dialog.MessageBox.prototype.showError = function(msg){
    dojo.style('messageBoxErrorRow', 'display', (msg ? '' : 'none'));
    dojo.byId('messageBoxError').innerHTML = (msg ? msg.entitize() : '');
};
