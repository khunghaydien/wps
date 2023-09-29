define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/date/locale",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/_base/fx",
	"dojo/string",
	"dojo/dom-style"
], function(declare, lang, locale, json, array, fx, str, domStyle){
	return new (declare("tsext.util.Util", null, {
		loadingShow: function(){
			domStyle.set('loadingOverlay', 'display', '');
		},
		loadingHide : function(){
			domStyle.set('loadingOverlay', 'display', 'none');
		},
		today: function(){
			return moment().format('YYYY-MM-DD');
		},
		formatDate : function(v, dp){
			var fmt = (dp || 'YYYY-MM-DD');
			if( v == null ){
				return null;
			}else if(typeof(v) == 'number'){
				var d = new Date();
				d.setTime(v);
				return moment(d).format(fmt);
			}else if(typeof(v) == 'string'){
				var m = moment(v, 'YYYY/MM/DD');
				return (m.isValid() ? m.format(fmt) : null);
			}
			return moment(v).format(fmt);
		},
		parseDate : function(s){
			var match;
			if((match = /\d{8}/.exec(s))){
				return new Date(
					  parseInt(s.substring(0, 4), 10)
					, parseInt(s.substring(4, 6), 10) - 1
					, parseInt(s.substring(6), 10)
				);
			}else if((match = /^(\d+)[\-](\d+)[\-](\d+)\s*(.*)$/.exec(s))){
				var y = parseInt(match[1], 10);
				var m = parseInt(match[2], 10);
				var d = parseInt(match[3], 10);
				var t = match[4];
				if(t && ((match = /^(\d+):(\d+):?(\d*)$/.exec(t)))){
					var hh = parseInt(match[1], 10);
					var mm = parseInt(match[2], 10);
					var ss = parseInt(match[3], 10);
					var f = false;
					if(hh >= 24){
						hh -= 24;
						f = true;
					}
					var rd = new Date(y, m - 1, d, hh, mm, (ss || 0));
					if(f){
						rd = this.addDays(rd, 1, true);
					}
					return rd;
				}
				return new Date(y, m - 1, d);
			}else if(s){
				var hm = false, hh = 0, mm = 0;
				if((match = /(.+) (\d{2}):(\d{2})$/.exec(s))){
					s = match[1];
					hm = true;
					hh = parseInt(match[2], 10);
					mm = parseInt(match[3], 10);
				}
				var d = locale.parse(s, { formatLength:'medium', selector:'date' });
				if(d){
					if(hm){
						d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh, mm, 0);
					}
					return d;
				}
				return null;
			}
			return null;
		},
		addDays : function(dt, amount, nosup){
			var _dt = dt;
			var flag = (typeof(dt) === 'string');
			if(flag){
				_dt = this.parseDate(dt);
			}
			if(!nosup){
				_dt.setHours(10); // 夏時間調整の対策として、0:00→10:00 を基準にする
			}
			var d = new Date();
			d.setTime(_dt.getTime() + (86400000 * amount));
			return (flag ? this.formatDate(d) : d);
		},
		formatDateTime : function(v, dp, tp){
			if(v === undefined || v === null){
				return null;
			}
			if(typeof(v) == 'number'){
				var d = new Date();
				d.setTime(v);
				return locale.format(d, { datePattern: (dp || 'yyyy-MM-dd'), timePattern: (tp || 'HH:mm:ss'), selector: 'date time' });
			}else if(typeof(v) == 'object'){
				return locale.format(v, { datePattern: (dp || 'yyyy-MM-dd'), timePattern: (tp || 'HH:mm:ss'), selector: 'date time' });
			}else if(typeof(v) == 'string'){
				return v;
			}
			return locale.format(v, { datePattern: (dp || 'yyyy-MM-dd'), timePattern: (tp || 'HH:mm:ss'), selector: 'date time' });
		},
		formatTime : function(t, flag){
			if(typeof(t) != 'number'){
				return '';
			}
			var minus = (t < 0);
			t = Math.abs(t || 0);
			var h = Math.floor(t / 60);
			var m = Math.round(t % 60);
			return (minus ? '-' : '') + ((flag && h < 10) ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
		},
		str2minutes: function(s){
			var hm = s.split(/:/);
			if(hm.length > 1){
				var h = parseInt(hm[0], 10);
				var m = parseInt(hm[1], 10);
				return h * 60 + m;
			}
			return null;
		},
		zen2han: function(v){
			var N = '０１２３４５６７８９．：';
			var s = '';
			for(var i = 0 ; i < v.length ; i++){
				var c = v.substring(i, i+1);
				var x = N.indexOf(c);
				if(x >= 0 && x < 10){
					s += x;
				}else if(x == 10){
					s += '.';
				}else if(x == 11){
					s += ':';
				}else{
					s += c;
				}
			}
			return s;
		},
		formatHour : function(s){
			s = this.zen2han(s);
			var match = /(\d+)(.)?(\d+)?$/.exec(s);
			if(match){
				var h = match[1] || null;
				var c = match[2];
				var m = match[3] || 0;
				if(c == '.' && m){
					if(m.length < 2){ m += '0'; }
					m = Math.round(60 * parseInt(m, 10) / 100);
					if(!h){
						h = '0';
					}
				}else if(m){
					m = parseInt(m, 10);
				}
				if(h !== null){
					var sh = h.replace(/^0+/, '') || '0';
					if(sh.length <= 2){
						h = parseInt(sh, 10);
					}else{
						if(c){
							return '';
						}
						if(sh.length > 4){
							sh = sh.substring(0, 4);
						}
						h = parseInt(sh.substring(0, sh.length - 2), 10);
						m = parseInt(sh.substring(sh.length - 2), 10);
					}
					if(h >= 48){
						return '';
					}
					if(m >= 60){
						m = 0;
					}
					return '' + h + ':' + (m < 10 ? '0' : '') + m;
				}
			}
			return '';
		},
		formatHourEx : function(s, bt){
			s = this.zen2han(s);
			var match = /(\d+)(.)?(\d+)?$/.exec(s);
			if(match){
				var h = match[1] || null;
				var c = match[2];
				var m = match[3] || 0;
				if(c == '.' && m){
					if(m.length < 2){ m += '0'; }
					if(bt){
						var n = Math.round(parseFloat(s) * bt);
						return this.formatTime(n);
					}else{
						m = Math.round(60 * parseInt(m, 10) / 100);
						if(!h){
							h = '0';
						}
					}
				}else if(m){
					m = parseInt(m, 10);
				}
				if(h !== null){
					var sh = h.replace(/^0+/, '') || '0';
					if(sh.length <= 2){
						h = parseInt(sh, 10);
					}else{
						if(c){
							return '';
						}
						if(sh.length > 4){
							sh = sh.substring(0, 4);
						}
						h = parseInt(sh.substring(0, sh.length - 2), 10);
						m = parseInt(sh.substring(sh.length - 2), 10);
					}
					if(h >= 48){
						return '';
					}
					if(m >= 60){
						m = 0;
					}
					return '' + h + ':' + (m < 10 ? '0' : '') + m;
				}
			}
			return '';
		},
		// 数字を日本語の曜日に変える
		getWeekJp: function(n){
			return {'0':'日','1':'月','2':'火','3':'水','4':'木','5':'金','6':'土'}[n];
		},
		getNights: function(d1, d2){
			var a = moment(d1, 'YYYY/MM/DD');
			var b = moment(d2, 'YYYY/MM/DD');
			return (a.isValid() && b.isValid()) ? b.diff(a, 'days') : null;
		},
		getYearMonth: function(s){
			var m = moment(s, 'YYYY/MM/DD');
			return (m.isValid() ? (m.year() * 100 + (m.month() + 1)) : null);
		},
		format: function() {
			var a = arguments;
			var b = "";
			if (a.length > 0){
				b = (a[0] || '');
			}
			for (var i = 1; i < a.length; i++)
				b = b.replace(RegExp("\\{" + (i - 1) + "\\}", "g"), (a[i] || ''));
			return b;
		},
		formatMonth: function(v) {
			if(typeof(v) == 'number'){
				var y = Math.floor(v / 100);
				var m = v % 100;
				return str.substitute('${0}年${1}月', [y, (m < 10 ? '0' : '') + m]);
			}
			return '';
		},
		formatMonthEx: function(ym, subNo) {
			if(typeof(ym) == 'number'){
				var y = Math.floor(ym / 100);
				var m = ym % 100;
				return (!subNo
						? str.substitute('${0}年${1}月' 	 , [y, (m < 10 ? '0' : '') + m])
						: str.substitute('${0}年${1}月(${2})', [y, (m < 10 ? '0' : '') + m, subNo + 1])
						);
			}
			return '';
		},
		formatMoney: function(v, flag){
			if(typeof(v) === 'number'){
				v = '' + v;
			}else if(!v){
				return (flag ? '\\0' : '');
			}
			var num = v.replace(/,/g, "");
			while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2"))){;}
			return '\\' + num;
		},
		str2num: function(v){
			if(typeof(v) === 'number'){
				return Math.round(v);
			}
			var N = '0123456789０１２３４５６７８９.．';
			var s = '';
			var p = null;
			for(var i = 0 ; i < v.length ; i++){
				var c = v.substring(i, i+1);
				var x = N.indexOf(c);
				if(x < 0){
					continue;
				}
				if(x < 20){
					s += (x >= 10 ? x - 10 : x);
				}else if(!p){
					s += '.';
					p = (i + 1);
				}
			}
			return (s.length ? Math.round(Math.round(s)) : 0);
		},
		str2number: function(v){
			if(typeof(v) == 'number'){
				return v;
			}
			var N = '0123456789０１２３４５６７８９.．';
			var s = '';
			var p = null;
			for(var i = 0 ; i < v.length ; i++){
				var c = v.substring(i, i+1);
				var x = N.indexOf(c);
				if(x < 0){
					continue;
				}
				if(x < 20){
					s += (x >= 10 ? x - 10 : x);
				}else if(!p){
					s += '.';
					p = (i + 1);
				}
			}
			return (s.length ? (p ? parseFloat(s) : parseInt(s, 10)) : 0);
		},
		entitize : function(v, d) {
			if(typeof(v) == 'string'){
				v = v.replace(/&/g , "&amp;" );
				v = v.replace(/</g , "&lt;"  );
				v = v.replace(/>/g , "&gt;"  );
				v = v.replace(/\"/g, "&quot;");
				v = v.replace(/{/g , "&#123;");
				v = v.replace(/}/g , "&#125;");
				v = v.replace(/\'/g, "&#039;");
			}
			return (v || d);
		},
		addPrefix : function(prefix, o, key){
			if(!prefix){
				return o;
			}
			if(typeof(o) == 'string'){
				if(/([A-Za-z0-9]+__[cr])/.test(o)){
					return prefix + o;
				}
			}else if(typeof(o) != 'object'){
				return o;
			}
			if(!key){
				for(var k in o){
					this.addPrefix(prefix, o, k);
				}
			}else{
				if(/([A-Za-z0-9]+__[cr])/.test(key)){
					o[prefix + key] = o[key];
					delete o[key];
				}
			}
			return o;
		},
		replacePrefix : function(v){
			var prefix = tsCONST.prefixBar;
			if(!prefix && !tsCONST.prefixOnCsv){
				return v;
			}
			var p = tsCONST.prefixOnCsv || prefix;
			if(p){
				v = v.replace(new RegExp(p, 'ig'), '');
			}
			return (prefix ? v.replace(/([A-Za-z0-9_]+__[cr])/g, prefix + '$1') : v);
		},
		adaptPrefix : function(v){
			var name = this.rawName(v);
			var n = name.indexOf('__');
			var m = (n < 0 ? -1 : name.substring(n + 2).indexOf('__'));
			if(n > 0 && m < 0 && /.+__[cr]/.test(name)){
				return tsCONST.prefixBar + name;
			}
			return name;
		},
		rawName: function(name){
			if(name.startsWith(tsCONST.TS_PREFIX)){
				return name.substring(tsCONST.TS_PREFIX.length);
			}
			return name;
		},
		getPrefix: function(name){
			var n = name.indexOf('__');
			var m = (n < 0 ? -1 : name.substring(n + 2).indexOf('__'));
			return (m < 0 ? '' : name.substring(0, n + 2));
		},
		/**
		 * オブジェクトの要素名から名前空間プレフィックスを取り除く
		 * @param {Object} obj オブジェクト※メソッドで更新。
		 */
		excludeNameSpace : function(obj){
			if(!tsCONST.prefixBar){
				return;
			}
			if(lang.isArray(obj)){
				for(var i = 0 ; i < obj.length ; i++){
					this.excludeNameSpace(obj[i]);
				}
			}else{
				for(var key in obj){
					if(obj.hasOwnProperty(key)){
						if(key.substring(0, tsCONST.prefixBar.length) == tsCONST.prefixBar){
							var name = key.substring(tsCONST.prefixBar.length);
							obj[name] = dojo.clone(obj[key]);
							delete obj[key];
							if(typeof(obj[name]) == 'object'){
								this.excludeNameSpace(obj[name]);
							}
						}else if(typeof(obj[key]) == 'object'){
							this.excludeNameSpace(obj[key]);
						}
					}
				}
			}
		},
		getLabel: function() {
			var b = "", a = arguments;
			if (a[0])
				b = (globalMessages && globalMessages[a[0]] || '');
			for (var i = 1; i < a.length; i++)
				b = b.replace(RegExp("\\{" + (i - 1) + "\\}", "g"), a[i]);
			return b;
		},
		getLabel2: function(mid, args) {
			var b = (globalMessages && globalMessages[mid] || '');
			for (var i = 0; i < args.length; i++)
				b = b.replace(RegExp("\\{" + i + "\\}", "g"), args[i]);
			return b;
		},
		convertArgs: function(args){
			if(!args || typeof(args) != 'object'){
				return [];
			}
			if(lang.isArray(args)){
				return args;
			}
			var res = [];
			for(var key in args){
				if(args.hasOwnProperty(key)){
					res[parseInt(key, 10)] = args[key];
				}
			}
			return res;
		},
		getErrorMessage : function(errobj){
			var ep = errobj;
			if(typeof(ep) == 'object'){
				if(!ep.error && ep.result){
					ep = ep.result;
				}
				var pep = ep;
				if(ep.error && typeof(ep.error) == 'object'){
					ep = ep.error;
				}
				if(ep.messageId){
					return this.getLabel2(ep.messageId, this.convertArgs(ep.args));
				}
				return (ep.message || ep.name || pep.message || 'Error');
			}else{
				return (ep || 'Error');
			}
		},
		toJson : function(v, f){
			try {
				if(v && typeof(v) == 'object'){
					return json.toJson(v, f).replace(/\t/g, '    ');
				}
			}catch(e){}
			return null;
		},
		fromJson : function(v){
			try {
				if(v && typeof(v) == 'string'){
					return json.fromJson(v);
				}
			}catch(e){}
			return v || null;
		},
		getAncestorByTagName : function(el, _tagName){
			var pel = null;
			var p = el;
			var ET = 'BODY';
			var tagName = _tagName.toUpperCase();
			while(p != null){
				var t = (p.tagName || '').toUpperCase();
				if(t == ET){
					break;
				}
				if(t == tagName){
					pel = p;
					break;
				}
				p = p.parentNode;
			}
			return pel;
		},
		consoleLog : function(msg){
			console.log(msg);
		},
		parseInt : function(v){
			if(typeof(v) == 'number'){
				return v;
			}
			if(v){
				v = v.trim();
				if(v.indexOf('.') >= 0){
					return parseFloat(v);
				}else{
					return parseInt(v, 10);
				}
			}
			return null;
		},
		parseValue : function(obj, key){
			var ks = key.split(/\./);
			var v = obj || {};
			for(var i = 0 ; i < ks.length ; i++){
				var k = ks[i];
				if(v[k] === undefined){
					v = null;
					break;
				}else{
					v = v[k];
				}
			}
			return '' + ((v === null || v === undefined) ? '' : v);
		},
		combinedNull : function(v){
			if(typeof(v) != 'number' && !v){
				return null;
			}
			return v;
		},
		isNum : function(v){
			return (typeof(v) == 'number');
		},
		isEmpty : function(v){
			return (v === null || v === undefined);
		},
		dispNum : function(v, alt){
			if(typeof(v) == 'number'){
				return v;
			}
			return alt;
		},
		unicodeStringToTypedArray: function(v, bomflg) {
			var escstr = encodeURIComponent(v);
			var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
				return String.fromCharCode('0x' + p1);
			});
			var ua = new Uint8Array(binstr.length + (bomflg ? 3 : 0));
			if(bomflg){
				ua[0] = 0xEF;
				ua[1] = 0xBB;
				ua[2] = 0xBF;
			}
			Array.prototype.forEach.call(binstr, function (ch, i) {
				ua[i + (bomflg ? 3 : 0)] = ch.charCodeAt(0);
			});
			return ua;
		},
		uint8arrayToUtf8String: function(uint8array) {
			if(uint8array[0] == 0xEF && uint8array[1] == 0xBB && uint8array[2] == 0xBF){
				uint8array = uint8array.subarray(3);
			}
			return new TextDecoder("utf-8").decode(uint8array);
		},
		countHalfChar: function (val) {
			var len = 0;
			var v = escape(val);
			for (var i = 0 ; i < v.length ; i++, len++) {
				if (v.charAt(i) == "%") {
					if (v.charAt(++i) == "u") {
						var s = v.substring(i, i + 5);
						if('uFF65' <= s && s <= 'uFF9F'){
							i += 3;
						}else{
							i += 3;
							len++;
						}
					}else if(v.substring(i, i + 2) == 'D7'){ // %D7 = 全角の×
						i++;
						len++;
					}
					i++;
				}
			}
			return len;
		},
		padx: function (text, size, ch, end) {
			var v = text;
			if(typeof(v) != 'number' && !v){
				v = '';
			}
			var len = this.countHalfChar(v);
			var s = (len < size ? str.rep(ch || '0', size - len) : '');
			return (end ? v + s : s + v);
		},
		getBarHead: function(lst){
			var bars = [];
			var heads = [];
			array.forEach(lst, function(o){
				bars.push(str.rep('-', o.len));
				heads.push(this.padx(o.name, o.len, ' ', !o.right));
			}, this);
			return {
				bar: bars.join(' '),
				head: heads.join(' '),
				lst: lst
			};
		},
		getBodyValues: function(barHead, vals){
			var values = [];
			for(var i = 0 ; i < barHead.lst.length ; i++){
				var o = barHead.lst[i];
				var val = vals[i];
				values.push(this.padx(val.v, o.len, ' ', !o.right));
			}
			return values.join(' ');
		},
		joinEx: function(lst, sep, max){
			var l = (lst.length < max ? lst : lst.slice(0, max));
			return (lst.length < max ? l : l.concat('..')).join(sep);
		},
		escapeCsv: function(v){
			if(v && typeof(v) == 'string'){
				if(v.indexOf('"') >= 0){
					v = v.replace(/"/g, '""');
				}
				if(/[,\r\n]/.test(v)){
					return '"' + v + '"';
				}
			}
			if(!v && typeof(v) != 'number' && typeof(v) != 'boolean'){
				return '';
			}
			return v;
		},
		fadeInOut: function(flag, args){
			if(flag){
				fx.fadeIn(args).play();
			}else{
				fx.fadeOut(args).play();
			}
		},
		// fromDtからtoDtまでの継続勤務日数（y年mか月d日）を返す
		getElapsedDays: function(fromDt, toDt){
			if(!fromDt || !toDt){ // どっちかが空の場合nullを返す
				return null;
			}
			var a = moment(toDt);
			var b = moment(fromDt);
			var y = a.diff(b, 'years');
			if(y){
				b.add(y, 'years');
			}
			var m = a.diff(b, 'months');
			if(m){
				b.add(m, 'months');
			}
			var d = a.diff(b, 'days');
			return {
				years: y || 0,
				months: m || 0,
				days: d || 0
			};
		},
		// getElapsedDays の戻り値を「y年mか月d日」の形式に変換する
		getElapsedString: function(elapsed){
			return (elapsed ?
			  (elapsed.years  ? elapsed.years  + '年'   : '')
			+ (elapsed.months ? elapsed.months + 'ヵ月' : '')
			+ (elapsed.days   ? elapsed.days   + '日'   : '')
			: '');
		},
		/**
		 * 日数換算値を日数、時間、表示用の文字列に解析する
		 * @param {number} v 解析対象の日数換算値
		 * @param {number} baseTime 基準時間
		 * @param {number} stepValue 切り上げる最小単位（30 or 60）
		 * @param {boolean} stepHalf true:日数は0.5日単位 false:1日単位
		 * @param {boolean} adjustHalf 時間の部分が最小単位の半分になる場合、日数を繰り下げる
		 * @param {number} flag =1:切り上げ =2:切り下げ
		 * @return {Object}
		 */
		parseDaysAndHours: function(v, option){
			var opt = lang.mixin({
				baseTime: 0,
				stepValue: 30,
				stepHalf: true,
				adjustHalf: true,
				flag: 0
			}, option);
			if(!opt.baseTime){
				var o = {
					raw:  v,
					raw5: (new Decimal(v)).toDecimalPlaces(5).toNumber(),
					days: 0,
					time: '0:00',
					minutes: 0
				};
				o.days = o.raw5;
				o.disp = o.days + '日';
				return o;
			}
			var stepd = opt.stepValue * 2;
			var stepq = opt.stepValue / 2;
			var n = new Decimal(v); // ex. v==1.73333
			var f = n.isPositive();
			if(opt.flag && !f){
				n = new Decimal(0);
			}
			var d = n.abs();
			if(opt.stepHalf){
				d = d.times(2).floor().div(2); // ex. d==1.73333 → 1.5
			}else{
				d = d.floor(); // ex. d==1.73333 → 1
			}
			var t = n.abs().minus(d); // ex. n==1.73333 - d==1.5 = 0.23333
			var bt = new Decimal(opt.baseTime || 0); // ex. BaseTime__c==450 (7:30)
			var m = t.times(bt).round(); // 残時間(分) ex. t==0.23333, bt==450 だとしたら 105 (1:45)
			if(opt.adjustHalf                      // 調整モード
			&& !m.isZero()                         // 分>0
			&& !m.mod(opt.stepValue).equals(0)     // 分は30で割り切れない
			&& d.greaterThanOrEqualTo(0.5)         // 残日数>=0.5日
			&& bt.mod(stepd).equals(opt.stepValue) // 基準時間の端数=30分
			&& m.mod(opt.stepValue).equals(stepq)  // 残時間の端数=15分
			){
				// 残日数を切り崩して残時間にあてる
				d = d.minus(0.5); // d==1.5 → d==1
				t = t.plus(0.5); // t==0.23333 → 0.73333
				m = t.times(bt).round();
			}
			if(!t.isZero()){
				if(opt.flag){
					if(opt.flag == 1){
						t = m.div(opt.stepValue).ceil().times(opt.stepValue).round();
					}else if(opt.flag == 2){
						t = m.div(opt.stepValue).floor().times(opt.stepValue).round();
					}
				}else{
					t = t.times(bt).round();
				}
			}
			var nv = d.plus(t.div(bt)).times(f ? 1 : -1);
			var minutes = t.isZero() ? 0 : t.toNumber();
			var time = this.formatTime(minutes); // t==0.73333,bt==450なら330→"5:30"を返す
			var o = {
				raw: nv.toNumber(),
				raw5: nv.toDecimalPlaces(5).toNumber(),
				days: d.times(f ? 1 : -1).toDecimalPlaces(5).toNumber(), // ex.1.5
				time: (f || time == '0:00' ? '' : '-') + time,
				minutes: minutes * (f ? 1 : -1), // t==0.73333,bt==450なら330 を返す
				baseTime: opt.baseTime
			};
			var z = [];
			if(o.days){
				z.push(o.days + '日');
			}
			if(o.time != '0:00'){
				z.push(o.time);
			}
			o.disp = z.join('+') || '0日';
			return o;
		},
		toDecimalPlaces: function(v, p){
			var n = new Decimal(v);
			return (p ? n.toDecimalPlaces(p).toNumber() : n);
		},
		getStartEndDate: function(d1, d2, sp){
			if(!d1){
				return '';
			}
			if(!d2 || d1 == d2){
				return d1;
			}
			return d1 + (sp || '～') + d2;
		},
		getStartEndTime: function(t1, t2, p){
			var sp = (p || '-');
			var t = [];
			t.push(typeof(t1) == 'number' ? this.formatTime(t1) : '');
			t.push(typeof(t2) == 'number' ? this.formatTime(t2) : '');
			var s = t.join(sp);
			return (s == sp ? '' : s);
		},
		/**
		 * 配列同士をマージ
		 * @param {Array.<string>} a 
		 * @param {Array.<string>|string} b 
		 */
		mergeList: function(a, b){
			if(!a || !lang.isArray(a)){
				return a;
			}
			if(lang.isArray(b)){
				for(var i = 0 ; i < b.length ; i++){
					var v = b[i];
					if(v && a.indexOf(v) < 0){
						a.push(v);
					}
				}
			}else if(b && a.indexOf(b) < 0){
				a.push(b);
			}
			return a;
		},
		/**
		 * TimeTable__c を JSON または文字列に変換
		 *  types==null: JSONに変換[{from:{number},to:{number},type:{number}},..]
		 *  types!=null の場合、"H:mm-H:mm|..." に変換
		 * @param {string} timeTable 
		 * @param {Array.<number>|null} types 例:[21,22]
		 * @returns {Array.<Object>|string}
		 */
		convertTimeTable: function(timeTable, types){
			var tt = timeTable.split(/:/);
			var objs = [];
			for(var i = 0 ; i < tt.length ; i++){
				var t = tt[i];
				if(!t){
					continue;
				}
				var n1 = t.substring(0, 4);
				var n2 = t.substring(4, 8);
				var n3 = t.substring(8, 10);
				var obj = {
					from: (/^\d{4}$/.test(n1) ? this.parseInt(n1) : null),
					to  : (/^\d{4}$/.test(n2) ? this.parseInt(n2) : null),
					type: (/^\d{2}$/.test(n3) ? this.parseInt(n3) : null)
				};
				objs.push(obj);
			}
			if(!types){
				return objs;
			}
			var items = [];
			for(var i = 0 ; i < objs.length ; i++){
				var obj = objs[i];
				if(types.indexOf(obj.type) >= 0){
					var st = (obj.from === null ? '' : this.formatTime(obj.from));
					var et = (obj.to   === null ? '' : this.formatTime(obj.to)  );
					items.push(st + '-' + et);
				}
			}
			return items.join('|');
		},
		getRangeNumToJp: function(range){
			switch(range){
			case '1': return '終日休';
			case '2': return '午前半休';
			case '3': return '午後半休';
			case '4': return '時間単位休';
			default: return '';
			}
		},
		/**
		 * 配列をCSV形式の文字列に変換
		 * Papa parse を利用
		 * @see https://www.papaparse.com/docs#strings
		 * @param {Array.<string|number|boolean|null>} items 
		 * @returns {string}
		 */
		arrayToCsvString: function(items){
			return Papa.unparse([items], {
				quotes: false, //or array of booleans
				quoteChar: '"',
				escapeChar: '"',
				delimiter: ",",
				header: true,
				newline: "\n",
				skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
				columns: null //or array of strings
			});
		}
	}))();
});
