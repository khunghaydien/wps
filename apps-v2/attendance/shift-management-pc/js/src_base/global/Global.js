/**
 * JavaScript Remoting のタイムアウト値をMaxの120秒に設定する。
 */
if(typeof(Visualforce) == "object"){
    Visualforce.remoting.timeout = 120000;
}
/**
 * teasp 名前空間
 * @name teasp
 * @namespace
 */
var teasp = {
    /**
     * @name teasp.logic
     * @namespace
     */
    logic  : {},
    /**
     * @name teasp.action
     * @namespace
     */
    action : {},
    /**
     * @name teasp.data
     * @namespace
     */
    data   : {},
    /**
     * @name teasp.dialog
     * @namespace
     */
    dialog : {},
    /**
     * @name teasp.helper
     * @namespace
     */
    helper : {},
    /**
     * @name teasp.view
     * @namespace
     */
    view   : {},
    manager : null,
    message : null,
    viewPoint : null,
    sequence : {
        marker  : 0,
        toolTip : 0,
        jobWork : 1,
        dialog  : 1
    },
    dialogStack  : [],
    prefixPt     : '',
    prefixBar    : '',
    controlClass : 'RtkPotalCtl',
    permitPushTime : true,
    ts1OptimizeOnBrowser: false,
    ts1OptimizeWidth    : null,
    timestamp    : function(msg, dt){
        var d = (dt || new Date());
        var s = (d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
            + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds() + ' ' + (msg || ''));
        globalTimeLog.push(s.substring(0, 100));
        console.log(s);
        return d;
    },
    decode : function(v, flag){
        try{
            if(v){
                if(flag == 1){
                    return dojo.fromJson(v);
                }else if(flag == 2){
                    return parseInt(v, 10);
                }
            }
            return v;
        }catch(e){
            console.log(e.message);
            console.log(e.stack);
        }
    },
    jsondecode : function(v){
        return teasp.decode(v, 1);
    },
    eval : function(v){
        if(!v){
            return;
        }
        try{
            dojo.eval(v);
        }catch(e){
            console.log(e.message);
            console.log(e.stack);
        }
    },
    getHref : function(pstr){
        return '/apex/' + (teasp.prefixBar || '') + (pstr || '');
    },
    ts1OptimizeOptionValue : { // TS1から勤務表を開いたときの動作（格納値）
        OptimizedTs1      : '1',
        PcVerWithoutGraph : '2'
    },
    resolved : { // 差込の無効化用変数
        '4652':1,
        '4666':1,
        '4795':1,
        '4932':1,
        '5259':1,
        '5385':1,
        '5446':1,
        '5476':1,
        '5844':1,
        '5909':1,
        '5974':1,
        '6089':1,
        '6381':1,
        '6664':1,
        '6670':1,
        '6905':1,
        '6983':1,
        '6980':1,
        '6717':1,
        '7010':1,
        '7540':1,
        '7866':1,
        '7990':1,
        '8150':1,
        '8159':1,
        '8161':1,
        '8178':1,
        '8540':1,
        '8538':1,
        '8771':1,
        '8957':1,
        '9046':1,
        '9050':1,
        '9185':1,
        '9203':1,
        '9353':1,
        '9358':1,
        '9429':1,
        '9471':1,
        '9523':1,
        '9887':1,
        'SECOM':1,
        'V5-1028':1,
        'V5-3293':1,
        'V5-4865':1
//      '{チケット番号}': 1
    }
};
var globalLoadRes = null;
var globalTimeLog = [];
var globalPageUrl = {};
var DATE_FORM_S  = {formatLength:'medium', selector:'date'};
/**
 * 名前空間管理メソッド
 * @param ns_string 'teasp.' ではじまる名前空間の文字列
 */
teasp.provide = function(ns_string){
    var names = ns_string.split('.');
    for(var i = 1 ; i < names.length ; i++){
        var name = names[i];
        if(!teasp[name]){
            teasp[name] = {};
        }
    }
};
teasp.setPageUrl = function(key, val){
    globalPageUrl[key] = val;
};
teasp.getPageUrl = function(key){
    return globalPageUrl[key] || null;
};
teasp.isSforce = function(){
    return (typeof(sforce) == 'object' && sforce.one);
};
teasp.isSforce1 = function(){
    return (typeof(sforce) == 'object' && sforce.one && navigator.userAgent.indexOf('Salesforce') >= 0);
};
teasp.locationHref = function(url, obj, flag){
    if(typeof(sforce) == 'object' && sforce.one && !flag){
		sforce.one.navigateToURL(url);
    }else if(obj){
    	obj['href'] = url;
	}else{
		location.href = url;
    }
};
teasp.downloadHref = function(url){
	location.href = url;
};
teasp.postScript = function(){
    // TS1でテキスト入力できなくなる回避策(#5974)
    // （VisualforcePage が読み込まれた後で実行されるようにすること）
    if(typeof(sforce) == 'object' && sforce.one && navigator.userAgent.indexOf('Salesforce') >= 0){
        window.onkeydown = function(){ window.focus(); };
    }
};
// COOKIEはLEXで使用不可のため、非推奨。LocalStorageを使用する。
// COOKIE のキー
teasp.COOKIE_KEY = 'TeamSpiritConfig';
// COOKIE から設定値取得（設定なしは{}を返す）
teasp.getCookie = function(subkey){
    var s = dojo.cookie(teasp.COOKIE_KEY);
    var o = (s && dojo.fromJson(s)) || {};
    return o[subkey] || null;
};
// COOKIE へ設定値保存
teasp.setCookie = function(subkey, obj){
    var s = dojo.cookie(teasp.COOKIE_KEY);
    var o = (s && dojo.fromJson(s)) || {};
    o[subkey] = obj;
    dojo.cookie(teasp.COOKIE_KEY, dojo.toJson(o), {expires:365,secure:true});
};
// LocalStorage のキー
teasp.STORAGE_KEY = 'TeamSpiritConfig';
// LocalStorage から設定値取得（設定なしは{}を返す）
teasp.getLocalStorage = function(subkey){
    var s = localStorage.getItem(teasp.STORAGE_KEY);
    var o = (s && dojo.fromJson(s)) || {};
    return o[subkey] || null;
};
// LocalStorage へ設定値保存
teasp.setLocalStorage = function(subkey, obj){
    var s = localStorage.getItem(teasp.STORAGE_KEY);
    var o = (s && dojo.fromJson(s)) || {};
    o[subkey] = obj;
    localStorage.setItem(teasp.STORAGE_KEY, dojo.toJson(o));
};
// LEXからClassicに切り替えたとき、dojoのモジュールがロードできないことがある(#7866)
// *.page 内でモジュールをロードしておくことで回避する。
teasp.dojoRequire = function(){
	require([
		"dojo/parser",
		"dojo/window",
		"dojo/cookie",
		"dojo/string",
		"dojo/Deferred",
		"dojo/date/locale",
		"dojo/store/Memory",
		"dojo/data/ItemFileReadStore",
		"dojo/data/ItemFileWriteStore",
		"dijit/Calendar",
		"dijit/Dialog",
		"dijit/ProgressBar",
		"dijit/form/ComboBox",
		"dijit/form/DropDownButton",
		"dijit/form/HorizontalRule",
		"dijit/form/HorizontalSlider",
		"dijit/form/NumberSpinner",
		"dijit/form/Select",
		"dijit/form/Slider",
		"dijit/layout/ContentPane",
		"dijit/layout/TabContainer",
		"dijit/Menu",
		"dijit/MenuItem",
		"dijit/MenuSeparator",
		"dijit/PopupMenuItem",
		"dijit/ProgressBar",
		"dijit/Tooltip",
		"dijit/TooltipDialog",
		"dojox/layout/ResizeHandle"
	]);
};
/**
 * TS1勤務表モバイル最適化作動条件を満たすかどうかを返す
 * @param {number=} w 最低幅条件（特に必要なければ省略すること）
 * @returns {boolean} true:TS1勤務表モバイル最適化作動条件を満たしている, false:TS1勤務表モバイル最適化作動条件を満たしていない
 */
teasp.isNarrow = function(w){
	return (teasp.isSforce1() || teasp.ts1OptimizeOnBrowser) && teasp.isTs1Optimize() && (window.innerWidth < (w || teasp.ts1OptimizeWidth || 768));
};

/**
 * TS1でPC版勤務表を表示する設定になっているか？
 * @returns {boolean} true:TS1でPC版勤務表を表示する設定になっている, false:TS1でPC版勤務表を表示する設定になっていない
 */
teasp.isDisplayingPcVersionOnTs1 = function(){
    return teasp.isSforce1() && (teasp.ts1OptimizeOption == teasp.ts1OptimizeOptionValue.PcVerWithoutGraph );
};
/**
 * ブラウザ幅が狭いかどうかのみ判定(isNarrow()の判定条件の一部)
 * @return {boolean} true:ブラウザ幅は狭い, false:ブラウザ幅は狭くない
 */
teasp.isOnlyNarrow = function(w){
	return (window.innerWidth < (w || teasp.ts1OptimizeWidth || 768));
};
/**
 * TS1勤務表モバイル最適化作動条件の裏オプションをセット
 */
teasp.setTs1OptimizeOnBrowser = function(flag){
	teasp.ts1OptimizeOnBrowser = flag;
};
teasp.setTs1OptimizeWidth = function(width){
	teasp.ts1OptimizeWidth = width;
};
/**
 * TS1上で利用する勤務表の表示タイプ
 * @param {number|null} null or 1=TS1最適化(デフォルト版), 2=グラフ無PC版画面(拡張版)
 */
teasp.setTs1OptimizeOption = function(v){
	teasp.ts1OptimizeOption = v;
};
/**
 * モバイル最適化設定になっているか
 * @return {boolean} true:モバイル最適化設定が有効, false:モバイル最適化設定なし(または無効)
 */
teasp.isTs1Optimize = function(){
	return (teasp.ts1OptimizeOption == teasp.ts1OptimizeOptionValue.OptimizedTs1);
};
/**
 * グラフ表示する
 * @return {boolean}
 */
teasp.isShowGraph = function(){
	return !teasp.isSforce1();
};
/**
 * 英語モードであればtrueを返す
 */
teasp.isEnglish = function(){
	return (teasp.message && (teasp.message.getLanguageLocaleKey() == 'en_US'));
};
/**
 * Android
 */
teasp.isAndroid = function(){
	return (/Android/i.test(navigator.userAgent));
};
/**
 * Android or iPhone or iPad
 */
teasp.isMobile = function(){
	return (/(Android|iPhone|iPad)/i.test(navigator.userAgent));
};
/**
 * エミュレータ用に meta viewport をセット
 */
teasp.setDeviceWidth = function(){
	if(teasp.ts1OptimizeOnBrowser && teasp.isMobile()){
		var meta = document.createElement('meta');
		meta.setAttribute('name', 'viewport');
		meta.setAttribute('content', 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no');
		document.getElementsByTagName('head')[0].appendChild(meta);
	}
};
/**
 * LEXで画面上部にすき間が空いてしまう対策
 * @parma {string} 大枠エリアのID
 */
teasp.adjustMarginTop = function(areaId, plus){
    var area = dojo.byId(areaId);
    var n = plus || 0;
    if(area){
        var top = area.offsetTop;
        if(top > 0){
            dojo.style(area, 'margin-top', (top * (-1) + n) + 'px');
        }
    }
};
/**
 * 裏画面へ遷移
 * 隠しテキストボックスにキーワードを入力してEnter押下で裏画面へ遷移する。
 *  "view=2"       .. AtkExtView?view=2 の画面へ遷移
 *  "support=full" .. AtkConfigEditView?support=full の画面へ遷移
 *  @param {{
 *    areaId {string}
 *    id     {string}
 *    page1  {string}
 *    page2  {string}
 *  }}
 */
teasp.backyard = function(obj){
	var area = dojo.byId(obj.areaId);
	var inp = dojo.create('input', { type:"text", id:obj.id, maxLength:30, style:"display:none;" }, area);
	dojo.connect(inp, 'onkeypress', function(e){
		if(e.keyCode == 13){ // Enter
			var pv = inp.value.trim();
			var v = pv.split(/=/);
			if(v.length > 1 && v[0].length && v[1].length){
				teasp.locationHref((/^(support|check)$/.test(v[0]) ? obj.page2 : (v[0]=='view' && v[1]=='3' ? obj.page3 : obj.page1)) + '?' + pv);
			}else{
				dojo.style(inp, 'display', 'none');
			}
		}else if(e.keyCode == 27){ // ESC
			dojo.style(inp, 'display', 'none');
		}
	});
	// エリアをALT+SHIFT+ダブルクリックでテキストボックスの表示/非表示を切り替え
	dojo.connect(area, 'ondblclick', function(e){
		var n = dojo.style(inp, 'display');
		if(n == 'none' && e.shiftKey && e.altKey){
			inp.value = '';
			dojo.style(inp, 'display', '');
			inp.focus();
		}else{
			dojo.style(inp, 'display', 'none');
		}
	});
	// エリアをクリックでテキストボックスを非表示化
	dojo.connect(area, 'onclick', function(){
		dojo.style(inp, 'display', 'none');
	});
};
