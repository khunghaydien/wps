teasp.provide('teasp.dialog.Base');
/**
 * ダイアログ基底クラスのコンストラクタ
 *
 * @constructor
 */
teasp.dialog.Base = function(){
    this.inited = false;
    this.dialog = null;
    this.id = null;
    this.args = {};
    this.callback = null;
    this.thisObject = null;
    this.bodyId = "bodyCell";
    this.pouch = null;

    this.title = '';
    this.duration = 1;
    this.content = null;
    this.widthHint = null;
    this.heightHint = null;
    this.okLink = null;
    this.cancelLink = null;
    this.closeLink = null;
};

/**
 * 疑似ダイアログのコンストラクタ
 *
 * @constructor
 */
teasp.dialog.Hack = function(obj){
    this.title    = ((obj && obj.title   ) || null);
    this.id       = ((obj && obj.id      ) || null);
    this.duration = ((obj && obj.duration) || null);
    this.content = null;
    if(!this.id){
        this.id = 'Dialog' + (teasp.sequence.dialog++);
    }
    var div = dojo.byId(this.id);
    if(!div){
        var area = dojo.byId('tsfDialog');
        if(!area){
            area = dojo.byId('tsfArea').parentNode;
        }
        div = dojo.create('div', { id: this.id, className: "ver-dialog", style: 'padding-bottom:80px;min-width:300px;' }, area);
        if(this.content){
            dojo.byId(this.id).innerHTML = this.content;
        }
    }
    this.domNode = div;
};

teasp.dialog.Hack.prototype.attr = function(key, value){
    this[key] = value;
    if(key == 'content' && !dojo.byId(this.id).innerHTML){
        dojo.byId(this.id).innerHTML = this.content;
    }
};

teasp.dialog.Hack.prototype.startup = function(){
};

teasp.dialog.Hack.prototype.show = function(){
    if(teasp.dialogStack.length <= 0){
        teasp.dialogStack.push('tsfArea');
    }
    teasp.dialogStack.unshift(this.id);
    dojo.style(teasp.dialogStack[1], 'display', 'none');
    dojo.style(teasp.dialogStack[0], 'display', '');
    document.body.scrollTop = 0;
};

teasp.dialog.Hack.prototype.destroy = function(){
	var div = dojo.byId(this.id);
	if(div){
		dojo.destroy(div);
	}
};

teasp.dialog.Hack.prototype.hide = function(){
    var id = teasp.dialogStack.shift();
    if(id && teasp.dialogStack.length > 0 && dojo.byId(id)){
        dojo.style(id, 'display', 'none');
    }
    if(teasp.dialogStack.length > 0){
        id = teasp.dialogStack[0];
        dojo.style(id, 'display', '');
        if(id == 'tsfArea'){
            // スクロールするエリアのスクロール位置がゼロになるので、デフォルト位置にセットする
            var graphDiv = dojo.byId('graphDiv');
            if(graphDiv){
                graphDiv.scrollLeft = 140;
            }
            var timgGrid = dojo.byId('timeGridView');
            if(timgGrid){
                timgGrid.scrollTop = (35 * 8);
            }
            if(teasp.viewPoint && teasp.viewPoint.viewPostProcess){
                teasp.viewPoint.viewPostProcess();
            }
        }
    }
};

/**
 * 初期化（インスタンス生成時１度しか行わない処理）
 *
 * @private
 */
teasp.dialog.Base.prototype._init = function(){
    if(this.inited){
        return;
    }
    require(["dijit/Dialog"]);
    this.free();
    this.preInit();
    this.inited = true;
    var o = {
        title    : this.title,
        id       : this.id,
        duration : this.duration
    };
    this.dialog = (this.noDialog() ? new teasp.dialog.Hack(o) : new dijit.Dialog(o));
    this.dialog.attr('content', this.content);

    if(this.okLink && dojo.byId(this.okLink.id)){
    	this.baseHandles.push(dojo.connect(dojo.byId(this.okLink.id), "onclick", this, this.okLink.callback));
    }

    if(this.cancelLink && dojo.byId(this.cancelLink.id)){
    	this.baseHandles.push(dojo.connect(dojo.byId(this.cancelLink.id), "onclick", this, this.cancelLink.callback));
    }

    if(this.closeLink && dojo.byId(this.closeLink.id)){
    	this.baseHandles.push(dojo.connect(dojo.byId(this.closeLink.id), "onclick", this, this.closeLink.callback));
    }

    if(this.noDialog()){
        var parent = dojo.byId(this.id);
        if(parent){
            var child = dojo.byId(this.id + '_title');
            if(child){
                dojo.destroy(child);
            }
            var div = dojo.create('div', {
            	id       : this.id + '_title',
            	style    : 'margin-top:2px;margin-bottom:4px;position:relative;',
            	className: 'dijitDialogTitleBar'
            }, parent.firstChild, 'before');
            if(this.title){
                div.innerHTML = this.title;
            }
            var btnClose = dojo.create('div', {
            	className: 'ts-status-img ts-ap_tab_rm',
            	style    : 'right:2px;top:8px;position:absolute;width:16px;height:14px;'
            }, div);
            this.baseHandles.push(dojo.connect(btnClose, 'onclick', this, this.close));
        }
    }

    this.preStart();
    this.dialog.startup();
    this.postStart();
};

teasp.dialog.Base.prototype.free = function(){
    if(this.baseHandles && this.baseHandles.length){
    	for(var i = 0 ; i < this.baseHandles.length ; i++){
    		dojo.disconnect(this.baseHandles[i]);
    		delete this.baseHandles[i];
    	}
    }
    this.baseHandles = [];
};

/**
 * ダイアログ非表示モードか
 *
 * @protected
 * @return {boolean}
 */
teasp.dialog.Base.prototype.noDialog = function(){
    return (this.pouch
            && this.pouch.isNonDialogMode
            && this.pouch.isNonDialogMode()
            && dojo.byId('tsfArea')
            && !this.nohack);
};

/**
 * ダイアログ表示
 *
 * @public
 */
teasp.dialog.Base.prototype.show = function(){
    this.dialog.show();
};

/**
 * ダイアログ非表示
 *
 * @public
 */
teasp.dialog.Base.prototype.hide = function(){
    this.dialog.hide();
};

/**
 * ダイアログを開く
 *
 * @public
 */
teasp.dialog.Base.prototype.open = function(pouch, args, callback, thisObject){
    this.pouch = pouch;
    this.args = (args || {});
    this.callback = callback;
    this.thisObject = thisObject;
    this.nohack = (this.args.nohack || this.nohack);

    this.ready();
    this._init();

    if(this.preShow()){
        this.show();
        this.postShow();
    }
};

/**
 * ダイアログを閉じる
 *
 * @public
 */
teasp.dialog.Base.prototype.close = function(){
    this.hide();
};

/**
 * open() の最初に必ず実行する仮想メソッド
 *
 * @protected
 */
teasp.dialog.Base.prototype.ready = function(){
};

/**
 * 初期化メソッドの最初に実行する仮想メソッド
 *
 * @protected
 */
teasp.dialog.Base.prototype.preInit = function(){
};

/**
 * 初期化メソッドの最後に実行する仮想メソッド
 *
 * @protected
 */
teasp.dialog.Base.prototype.preStart = function(){
};

/**
 *
 * @protected
 */
teasp.dialog.Base.prototype.postStart = function(){
};

/**
 * ダイアログを開くたびに（show()の前に）実行する仮想メソッド
 *
 * @protected
 */
teasp.dialog.Base.prototype.preShow = function(){
    return true;
};

/**
 * ダイアログを開くたびに（show()の後に）実行する仮想メソッド
 *
 * @protected
 */
teasp.dialog.Base.prototype.postShow = function(){
};

/**
 * ＯＫボタンで呼び出される仮想メソッド
 *
 * @protected
 */
teasp.dialog.Base.prototype.ok = function(){
    return true;
};

/**
 * キャンセルボタンで呼び出される仮想メソッド
 *
 * @protected
 */
teasp.dialog.Base.prototype.cancel = function(){
    return true;
};

/**
 * コールバックのメソッド呼び出し
 *
 * @protected
 * @param {...} args
 */
teasp.dialog.Base.prototype.onfinishfunc = function(args){
    if(this.callback){
        this.callback.apply((this.thisObject || this), arguments);
    }
};
