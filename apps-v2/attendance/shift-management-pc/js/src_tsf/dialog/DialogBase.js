teasp.Tsf.dialog = {};
/**
 * ダイアログ基底クラスのコンストラクタ
 *
 * @constructor
 */
teasp.Tsf.dialog.Base = function(){
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
teasp.Tsf.dialog.Hack = function(obj){
    this.title    = ((obj && obj.title   ) || null);
    this.id       = ((obj && obj.id      ) || null);
    this.duration = ((obj && obj.duration) || null);
    this.content = null;
    if(!this.id){
        this.id = 'Dialog' + (teasp.sequence.dialog++);
    }
    var div = dojo.byId(this.id);
    if(!div){
        div = dojo.create('div', { id: this.id, className: "ver-dialog", style: 'padding-bottom:80px;' }, dojo.byId('big_area').parentNode);
        if(this.content){
            dojo.byId(this.id).innerHTML = this.content;
        }
    }
};

teasp.Tsf.dialog.Hack.prototype.attr = function(key, value){
    this[key] = value;
    if(key == 'content' && !dojo.byId(this.id).innerHTML){
        dojo.byId(this.id).innerHTML = this.content;
    }
};

teasp.Tsf.dialog.Hack.prototype.startup = function(){
};

teasp.Tsf.dialog.Hack.prototype.show = function(){
    if(teasp.Tsf.dialogStack.length <= 0){
        teasp.Tsf.dialogStack.push('big_area');
    }
    teasp.Tsf.dialogStack.unshift(this.id);
    dojo.style(teasp.Tsf.dialogStack[1], 'display', 'none');
    dojo.style(teasp.Tsf.dialogStack[0], 'display', '');
};

teasp.Tsf.dialog.Hack.prototype.hide = function(){
    var id = teasp.Tsf.dialogStack.shift();
    dojo.style(id, 'display', 'none');
    if(teasp.Tsf.dialogStack.length > 0){
        id = teasp.Tsf.dialogStack[0];
        dojo.style(id, 'display', '');
        if(id == 'big_area'){
            // スクロールするエリアのスクロール位置がゼロになるので、デフォルト位置にセットする
            var graphDiv = dojo.byId('graphDiv');
            if(graphDiv){
                graphDiv.scrollLeft = 140;
            }
            var timgGrid = dojo.byId('timeGridView');
            if(timgGrid){
                timgGrid.scrollTop = (35 * 8);
            }
        }
    }
};

/**
 * 初期化（インスタンス生成時１度しか行わない処理）
 *
 * @private
 */
teasp.Tsf.dialog.Base.prototype._init = function(){
    if(this.inited){
        return;
    }
    require(["dijit/Dialog"]);
    this.domHelper = new teasp.Tsf.Dom();
    this.preInit();
    this.inited = true;
    var o = {
        title    : this.title,
        id       : this.id,
        duration : this.duration
    };
    this.dialog = (this.noDialog() ? new teasp.Tsf.dialog.Hack(o) : new dijit.Dialog(o));
    this.dialog.attr('content', this.content);

    if(this.okLink && dojo.byId(this.okLink.id)){
        this.domHelper.connect(teasp.Tsf.Dom.byId(this.okLink.id), "onclick", this, this.okLink.callback);
    }

    if(this.cancelLink && dojo.byId(this.cancelLink.id)){
        this.domHelper.connect(teasp.Tsf.Dom.byId(this.cancelLink.id), "onclick", this, this.cancelLink.callback);
    }

    if(this.closeLink && dojo.byId(this.closeLink.id)){
        this.domHelper.connect(teasp.Tsf.Dom.byId(this.closeLink.id), "onclick", this, this.closeLink.callback);
    }

    var d = dojo.byId(this.id + '_title');
    if(!d){
        var parent = dojo.byId(this.id);
        if(parent && parent.firstChild){
            var cw = parent.firstChild.clientWidth;
            var div = dojo.create('div', { id: this.id + '_title', style: { marginTop:"2px", marginBottom:"4px" }, className: 'dijitDialogTitleBar' }, parent.firstChild, 'before');
            div.style.width = cw + 'px';
            if(this.title){
                div.innerHTML = this.title;
            }
        }
    }

    this.preStart();
    this.dialog.startup();
    this.postStart();
};

teasp.Tsf.dialog.Base.prototype.getDomHelper = function(){
    return this.domHelper;
};

/**
 * ダイアログ非表示モードか
 *
 * @protected
 * @return {boolean}
 */
teasp.Tsf.dialog.Base.prototype.noDialog = function(){
    return (this.pouch
            && this.pouch.isNonDialogMode
            && this.pouch.isNonDialogMode()
            && !this.nohack);
};

/**
 * ダイアログ表示
 *
 * @public
 */
teasp.Tsf.dialog.Base.prototype.show = function(){
    this.dialog.show();
};

/**
 * ダイアログ非表示
 *
 * @public
 */
teasp.Tsf.dialog.Base.prototype.hide = function(){
    this.dialog.hide();
};

/**
 * ダイアログを開く
 *
 * @public
 */
teasp.Tsf.dialog.Base.prototype.open = function(pouch, args, callback, thisObject){
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
teasp.Tsf.dialog.Base.prototype.close = function(){
    this.hide();
};

/**
 * open() の最初に必ず実行する仮想メソッド
 *
 * @protected
 */
teasp.Tsf.dialog.Base.prototype.ready = function(){
};

/**
 * 初期化メソッドの最初に実行する仮想メソッド
 *
 * @protected
 */
teasp.Tsf.dialog.Base.prototype.preInit = function(){
};

/**
 * 初期化メソッドの最後に実行する仮想メソッド
 *
 * @protected
 */
teasp.Tsf.dialog.Base.prototype.preStart = function(){
};

/**
 *
 * @protected
 */
teasp.Tsf.dialog.Base.prototype.postStart = function(){
};

/**
 * ダイアログを開くたびに（show()の前に）実行する仮想メソッド
 *
 * @protected
 */
teasp.Tsf.dialog.Base.prototype.preShow = function(){
    return true;
};

/**
 * ダイアログを開くたびに（show()の後に）実行する仮想メソッド
 *
 * @protected
 */
teasp.Tsf.dialog.Base.prototype.postShow = function(){
};

/**
 * ＯＫボタンで呼び出される仮想メソッド
 *
 * @protected
 */
teasp.Tsf.dialog.Base.prototype.ok = function(){
    return true;
};

/**
 * キャンセルボタンで呼び出される仮想メソッド
 *
 * @protected
 */
teasp.Tsf.dialog.Base.prototype.cancel = function(){
    return true;
};

/**
 * コールバックのメソッド呼び出し
 *
 * @protected
 * @param {...} args
 */
teasp.Tsf.dialog.Base.prototype.onfinishfunc = function(args){
    if(this.callback){
        this.callback.apply((this.thisObject || this), arguments);
    }
};
