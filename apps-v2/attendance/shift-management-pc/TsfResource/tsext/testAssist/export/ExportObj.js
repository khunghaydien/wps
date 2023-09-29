define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, Constant, Util){
	// オブジェクト
	return declare("tsext.testAssist.ExportObj", null, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 * @param {tsext.testAssist.ExportObjs=} parent (省略可)
		 */
		constructor: function(manager, obj, parent){
			this.manager = manager;
			this.obj = obj;
			this.parent = parent;
			this.obj.CreatedDate = Util.formatDateTime(this.obj.CreatedDate);
			this.obj.LastModifiedDate = Util.formatDateTime(this.obj.LastModifiedDate);
		},
		getId: function(){
			return this.obj.Id;
		},
		getName: function(){
			return this.manager.getNamePrefix() + this.getRealName();
		},
		getCreatedDate: function(){
			return this.obj.CreatedDate;
		},
		getRealName: function(){
			return this.obj.Name;
		},
		getRaw: function(){
			return this.obj;
		},
		clearCollect: function(){
		},
		compare: function(other){
			if(this.getCreatedDate() == other.getCreatedDate()){
				return (this.obj.Id < other.obj.Id ? -1 : 1);
			}
			return (this.getCreatedDate() < other.getCreatedDate() ? -1 : 1);
		},
		Bool : function(v){
			return (v ? 'ON' : 'OFF');
		},
		/**
		 * 0/1 → false/true に変換
		 * @param {string|number} v 
		 * @returns {boolean}
		 */
		formatBoolean: function(v){
			if(typeof(v) == 'string'){
				return (v == '0' ? false : true);
			}else if(typeof(v) == 'number'){
				return (!v ? false : true);
			}
			return (v ? true : false);
		},
		/**
		 * 分 → H:mm に変換
		 * @param {number} t 
		 * @returns {string}
		 */
		formatTime: function(t){
			return Util.formatTime(t);
		},
		/**
		 * 分の配列 → H:mm-H:mm に変換
		 * @param {Array.<number>} ts
		 * @returns {string}
		 */
		formatTimeRange: function(ts){
			var st = Util.formatTime(ts[0]);
			var et = Util.formatTime(ts[1]);
			return st + '-' + et;
		},
		/**
		 * 複数の時間範囲の書式を変換
		 * (例) "720-780,1080-1110" → "12:00-13:00|18:00-18:30"
		 * @param {*} v 
		 * @returns 
		 */
		formatCommaTimes: function(v){
			var times = [];
			var vs = (v || '').split(/,/);
			for(var i = 0 ; i < vs.length ; i++){
				if(!vs[i]){
					continue;
				}
				var ts = vs[i].split(/-/);
				times.push(Util.formatTime(Util.parseInt(ts[0])) + '-' + Util.formatTime(Util.parseInt(ts[1])));
			}
			return times.join('|');
		},
		/**
		 * 引数1の配列に引数2または引数3が含まれているか
		 * @param {Array.<string|Object>|null} l
		 * @param {string|Array.<string>} key 
		 * @param {Object} keyObj
		 * @returns {boolean}
		 */
		containArray: function(l, key, keyObj){
			if(l && l.length && (key || keyObj)){
				var strs = [];
				var objs = [];
				for(var i = 0 ; i < l.length ; i++){
					var o = l[i];
					if(typeof(o) == 'string'){
						strs.push(o);
					}else if(typeof(o) == 'object'){
						objs.push(o);
					}
				}
				if(strs.length && key){
					var keys = lang.isArray(key) ? key : [key];
					for(var i = 0 ; i < keys.length ; i++){
						if(strs.indexOf(keys[i]) >= 0){
							return true;
						}
					}
				}
				if(objs.length && keyObj && keyObj.name){
					for(var i = 0 ; i < objs.length ; i++){
						var o = objs[i];
						if(o.name && o.name == keyObj.name){
							return true;
						}
					}
				}
			}
			return false;
		},
		/**
		 * this.obj の要素の値を取得する。
		 * @param {string} key 要素名
		 * @param {*=} defaultVal 値が空(null, undefined) の場合の代替値
		 * @returns {*}
		 */
		getValueByKey(key, defaultVal){
			var keys = key.split('.');
			var o = this.obj;
			var x = 0;
			while(o && x < keys.length){
				o = o[keys[x++]];
			}
			if(Util.isEmpty(o)){
				if(!Util.isEmpty(defaultVal)){
					o = defaultVal;
				}else{
					o = null;
				}
			}
			return o;
		},
		getValueByFunction(key, funcName, defaultVal){
			var arg = null;
			if(key){
				if(lang.isArray(key)){
					arg = [];
					for(var i = 0 ; i < key.length ; i++){
						arg.push(this.getValueByKey(key[i], defaultVal));
					}
				}else{
					arg = this.getValueByKey(key, defaultVal);
				}
			}
			var o = this[funcName](arg);
			if(Util.isEmpty(o)){
				if(!Util.isEmpty(defaultVal)){
					o = defaultVal;
				}else{
					o = null;
				}
			}
			return o;
		},
		/**
		 * key, funcName から取得した値、org との差異有無を返す
		 * ※ key が配列の場合は funcName は省略不可
		 * @param {string|Array.<string>} key 
		 * @param {string|null} funcName 
		 * @param {*} defaultVal
		 * @param {tsext.testAssist.ExportObj|null} org 
		 * @returns {{value:{*}, vary:{boolean}}}}
		 */
		getValueAndIdentify: function(key, funcName, defaultVal, org){
			var v1, v2 = null;
			if(funcName && typeof(this[funcName]) == 'function'){
				v1 = this.getValueByFunction(key, funcName, defaultVal);
				v2 = (org ? org.getValueByFunction(key, funcName, defaultVal) : null);
			}else{
				v1 = this.getValueByKey(key, defaultVal);
				v2 = (org ? org.getValueByKey(key, defaultVal) : null);
			}
			if(typeof(v1) == 'boolean' && !v2){
				v2 = false;
			}else if(typeof(v2) == 'boolean' && !v1){
				v1 = false;
			}
			return {
				value: v1,
				vary: (v1 != v2)
			}
		},
		/**
		 * 
		 * @param {Array.<string>} lst 
		 * @param {Array.<string|number|boolean|null>} items 
		 * @param {Array.<string>=} heads
		 */
		L: function(lst, items, heads){
			lst.push(Util.arrayToCsvString(heads ? heads.concat(items) : items));
		},
		/**
		 * 出力するべき値かどうかを識別して配列に格納
		 * @param {{lst:{Array.<string>}, head:{Array.<string>}, org:{tsext.testAssist.ExportObj}, seize:{Array.<string|Object>}, allin:{boolean}}} cpx 
		 * @param {Object|string} keyObj
		 * @param {string|Array.<string>} key
		 * @param {Function|null} funcName
		 * @param {*} defaultVal
		 */
		P: function(cpx, keyObj, key, funcName, defaultVal){
			var o = this.getValueAndIdentify(key, funcName, defaultVal, cpx.org);
			if(o.vary || cpx.allin || this.containArray(cpx.seize, key, keyObj)){
				var name = (typeof(keyObj) == 'string' ? keyObj : keyObj.name);
				this.L(cpx.lst, [name, (typeof(o.value)=='boolean' ? this.Bool(o.value) : (Util.isEmpty(o.value) ? '' : o.value))], cpx.head);
			}
		},
		/**
		 * 配列に格納
		 * @param {{lst:{Array.<string>}, head:{Array.<string>}, org:{tsext.testAssist.ExportObj}, seize:{Array.<string|Object>}, allin:{boolean}}} cpx 
		 * @param {Object|string} keyObj
		 * @param {string|boolean} value
		 */
		O: function(cpx, keyObj, value){
			var name = (typeof(keyObj) == 'string' ? keyObj : keyObj.name);
			this.L(cpx.lst, [name, (typeof(value)=='boolean' ? this.Bool(value) : value)], cpx.head);
		},
		/**
		 * 説明（コメント）行を生成
		 * @param {string} msg 
		 * @returns {string}
		 */
		getCommentLine: function(msg){
			return Util.arrayToCsvString([Constant.KEY_COMMENT, '', '', msg]);
		}
	});
});
