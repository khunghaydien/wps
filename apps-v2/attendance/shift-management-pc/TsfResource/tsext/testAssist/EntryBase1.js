define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/TsError",
	"tsext/util/Util"
], function(declare, lang, array, str, Current, Constant, TsError, Util){
	// 指示データクラスの基底クラス
	return declare("tsext.testAssist.EntryBase1", null, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor: function(args, lineNo){
			this.args = args;
			this.lineNo = lineNo;
			this.errors = [];
			this.errorLevel = 0;
			this.results = [];
			this.empty = false;
			this.continued = false;
			this.listed = false;
			this.alone = false;
			this.empMonthLoader = false;
			this.elements = [];
			this.ngElements = [];
			this.key    = this.getRawDataByIndex(args, Constant.INDEX_KEY);
			this.subKey = this.getRawDataByIndex(args, Constant.INDEX_SUBKEY);
			this.option = this.getRawDataByIndex(args, Constant.INDEX_OPTION);
			this.items = [];
			for(var i = 0 ; i < 17 ; i++){
				this.items.push(this.getRawDataByIndex(args, Constant.INDEX_ITEM1+i));
			}
			if((args.length == 1 && !args[0]) || this.key == Constant.HEAD_KEY){
				this.empty = true; // 空行
			}else if(args.length < 3){
				this.addError(Constant.ERROR_INVALID_LINE);
			}
			if(this.option == Constant.OPTION_DELETE){
				this.alone = true;
			}
		},
		getEntryName: function(flag){
			if(this.key == Constant.KEY_COMMENT){
				return this.items[0];
			}
			if(flag){
				var vs = [this.key, this.subKey, this.option];
				for(var i = 0 ; i < this.items.length ; i++){
					vs.push(this.items[i]);
				}
				return vs.join(',').replace(/,+$/, '');
			}else{
				return [
					this.key,
					this.subKey,
					this.option,
					this.items[0],
					this.items[1],
					this.items[2],
					this.items[3],
					this.items[4],
					this.items[5]
				].join(' ').trim();
			}
		},
		getTitle: function(){
			var lines = [];
			lines.push(this.getEntryName(true));
			for(var i = 0 ; i < this.elements.length ; i++){
				lines.push(this.elements[i].getEntryName(true));
			}
			return lines.join('\n');
		},
		getExpectedError: function(){
			return this.items[16];
		},
		getLinkTitle: function(){
			if(this.key == Constant.KEY_SETTING
			&& this.option == Constant.OPTION_NEW){
				if(this.subKey == Constant.KEY_EMP){
					return '社員設定画面を開く';
				}else if(this.subKey == Constant.KEY_EMPTYPE){
					return '勤務体系設定画面を開く';
				}else if(this.subKey == Constant.KEY_HOLIDAY || this.subKey == Constant.KEY_PATTERN){
					return '画面を開く(SF標準画面)';
				}
			}else if(this.key == Constant.KEY_LOAD
			&& this.subKey == Constant.KEY_SHEET){
				return '勤務表を開く';
			}else{
				return '';
			}
		},
		isLinkEmpType: function(){
			return (this.key == Constant.KEY_SETTING && this.option == Constant.OPTION_NEW && this.subKey == Constant.KEY_EMPTYPE);
		},
		isLinkEmp: function(){
			return (this.key == Constant.KEY_SETTING && this.option == Constant.OPTION_NEW && this.subKey == Constant.KEY_EMP);
		},
		isLinkSf: function(){
			if(this.key == Constant.KEY_SETTING){
				if(this.option == Constant.OPTION_NEW && (this.subKey == Constant.KEY_HOLIDAY || this.subKey == Constant.KEY_PATTERN)){
					return true;
				}else if(this.option != Constant.OPTION_DELETE && this.subKey == Constant.KEY_CALENDAR){
					return true;
				}
			}
			return false;
		},
		isLinkSheet: function(){
			return (this.key == Constant.KEY_LOAD && this.subKey == Constant.KEY_SHEET);
		},
		/**
		 * 指定列の値を返す
		 * @param {Array.<string>} CSVの1行
		 * @param {number} index
		 * @return {string|null}
		 */
		getRawDataByIndex: function(args, index){
			return (index < args.length ? this.args[index] : null);
		},
		getLineNo:    function(){ return this.lineNo; }, // 行番号を返す
		getItem:      function(index){ return (this.items[index] || '').trim(); }, // ITEM(n)の値を返す
		isContinued:  function(){ return this.continued; }, // 指示継続のgetter
		setContinued: function(flag){ this.continued = flag; }, // 指示継続のsetter
		isEmpty:      function(){ return this.empty;  }, // 空行ならtrueを返す
		isValid:      function(){ return ((!this.empty && !this.errors.length) || this.key == Constant.HEAD_KEY); }, // 有効ならtrueを返す
		isAlone:      function(){ return this.alone; }, // 単独データ（elementsを要しない）ならtrueを返す
		isSetting:    function(){ return (this.key    == Constant.KEY_SETTING);   }, // 設定
		isDelete:     function(){ return (this.option == Constant.OPTION_DELETE); }, // 削除
		isChange:     function(){ return (this.option == Constant.OPTION_CHANGE); }, // 変更
		isTest:       function(flag){ return ((this.key == Constant.KEY_TEST || this.option == Constant.OPTION_TEST) && (!flag || !this.isSkip())); }, // 検査
		isEnd:        function(){ return (this.option == Constant.OPTION_END);    }, // 終了
		isListed:     function(){ return this.listed; }, // 追加済み
		setListed:    function(flag){ this.listed = flag; }, // 追加済みをセット
		isEmpMonthLoader: function(){ return this.empMonthLoader; }, // 勤務表読込
		/**
		 * モード手動切り替え
		 * Waiting → Pause → Skip → Waiting
		 * @return {Object}
		 */
		toggleMode: function(){
			if(!this.ope){
				this.ope = {mode:Constant.OPE_WAITING};
			}
			if(this.ope.mode == Constant.OPE_WAITING){
				this.ope.mode = Constant.OPE_PAUSE;
			}else if(this.ope.mode == Constant.OPE_PAUSE){
				this.ope.mode = Constant.OPE_SKIP;
			}else{
				this.ope.mode = Constant.OPE_WAITING;
			}
			return this.ope;
		},
		/**
		 * モードセット
		 * ※ setMode() はDistributorが呼ぶこと（他で呼ぶと追いづらくなる）
		 * @param {string} mode Constant.OPE_XXX
		 * @return {Object}
		 */
		setMode: function(mode){
			if(!this.ope){
				this.ope = {};
			}
			this.ope.mode = mode;
		},
		getMode:      function(){ return (this.ope && this.ope.mode) || Constant.OPE_WAITING; },
		isWaiting:    function(){ return (!this.ope || !this.ope.mode || this.ope.mode == Constant.OPE_WAITING); },
		isPause:      function(){ return (this.ope && this.ope.mode == Constant.OPE_PAUSE) || false; },
		isSkip:       function(){ return (this.ope && this.ope.mode == Constant.OPE_SKIP)  || false; },
		isDone:       function(){ return (this.ope && this.ope.mode == Constant.OPE_DONE)  || false; },
		isDoing:      function(){ return (this.ope && this.ope.mode == Constant.OPE_DOING) || false; },
		resetResults: function(){
			this.errorLevel = 0;
			this.errors = [];
			this.results = [];
		},
		/**
		 * 直前チェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			if(this.isContinued()){
				this.setContinued(false);
			}
			return (!this.errors.length && !this.ngElements.length);
		},
		isIO:             function(){ return (this instanceof tsext.testAssist.EntryInOut);       },
		isAccessLog:      function(){ return (this instanceof tsext.testAssist.EntryAccessLog);   },
		isChangeStatus:   function(){ return (this instanceof tsext.testAssist.EntryApplyCommon); },
		isApplyEmpMonth:  function(){ return (this instanceof tsext.testAssist.EntryApplyMonth);  },
		isEntryShift:     function(){ return (this instanceof tsext.testAssist.EntryShift);       },
		isLoadEmpMonth:   function(){ return (this instanceof tsext.testAssist.LoadEmpMonth);     },
		isInspectValue:   function(){ return (this instanceof tsext.testAssist.InspectValue);     },
		isInformation:    function(){ return (this instanceof tsext.testAssist.Information);      },
		isSettingHoliday: function(){ return (this instanceof tsext.testAssist.SettingHoliday);   },
		isSettingPattern: function(){ return (this instanceof tsext.testAssist.SettingPattern);   },
		isSettingEmpType: function(){ return (this instanceof tsext.testAssist.SettingEmpType);   },
		isSettingConfig:  function(){ return (this instanceof tsext.testAssist.SettingConfig);    },
		isSettingCalendar:function(){ return (this instanceof tsext.testAssist.SettingCalendar);  },
		isSettingEmp:     function(){ return (this instanceof tsext.testAssist.SettingEmp);       },
		isSettingEmpLeave:function(){ return (this instanceof tsext.testAssist.SettingEmpLeave);  },
		isSettingEmpCET:  function(){ return (this instanceof tsext.testAssist.SettingEmpCET);    },
		isSettingCommon:  function(){ return (this instanceof tsext.testAssist.SettingCommon);    },
		isSettingWorkLocation: function(){ return (this instanceof tsext.testAssist.SettingWorkLocation);   },
		isApplyEmpDay: function(){
			var item1 = this.getItem(0);
			if(item1 && ((item1.length > 2 && item1.endsWith('申請')) || item1 == Constant.ITEM1_DAILY_FIX)){
				return true;
			}
			return false;
		},
		pushResult: function(obj){
			this.results.push(obj);
		},
		/**
		 * エラーを追加
		 * @param {number|string} arg1
		 * @param {string|Array.<string>} arg2
		 * @param {Array.<string>=} arg3
		 */
		addError: function(arg1, arg2, arg3){
			var errorLevel, message;
			if(typeof(arg1) == 'number'){
				errorLevel = arg1;
				message = str.substitute(arg2, arg3 || []);
			}else{
				errorLevel = Constant.ERROR_LEVEL_2;
				message = str.substitute(arg1, arg2 || []);
			}
			this.errors.push(message);
			if(this.errorLevel < errorLevel){
				this.errorLevel = errorLevel;
			}
			return {
				errorLevel: errorLevel,
				message: message
			};
		},
		getErrors:    function(){ return this.errors; }, // エラー配列を返す
		getErrorLevel:function(){ return this.errorLevel; }, // エラーレベルを返す
		setErrorLevel:function(errorLevel){ this.errorLevel = errorLevel; }, // エラーレベルをセット
		isError:      function(){ return (this.getErrorLevel() > Constant.ERROR_LEVEL_1); }, // エラーかどうかを返す
		/**
		 * エラーメッセージを返す
		 * @return {string}
		 */
		getErrorMessage: function(){
			if(this.errors.length){
				return this.errors[0];
			}
			if(this.ngElements.length){
				return this.ngElements[0].getErrorMessage();
			}
			return '';
		},
		getErrorObj: function(){
			return {
				errorLevel: this.errorLevel,
				message: this.getErrorMessage()
			};
		},
		getResultMessage: function(){
			var msgs = [];
			for(var i = 0 ; i < this.results.length ; i++){
				var result = this.results[i];
				var s = result.message || '';
				if(msgs.indexOf(s) < 0){
					msgs.push(s);
				}
			}
			var msg = (this.isSkip() ? 'SKIP ' : '') + msgs.join(' ').trim();
			return msg || this.getErrorMessage();
		},
		isTestNg: function(){
			for(var i = 0 ; i < this.results.length ; i++){
				var result = this.results[i];
				if(result.result){
					return true;
				}
			}
			return false;
		},
		isTestOk: function(){
			var okCnt = 0;
			var ngCnt = 0;
			for(var i = 0 ; i < this.results.length ; i++){
				var result = this.results[i];
				if(result.result){
					ngCnt++;
				}else{
					okCnt++;
				}
			}
			return (okCnt > 0 && !ngCnt);
		},
		getLink: function(){
			var link = null;
			for(var i = 0 ; i < this.results.length ; i++){
				var result = this.results[i];
				if(result.href){
					link = {
						href: result.href,
						title: result.name || ''
					};
					break;
				}
			}
			return link;
		},
		/**
		 * @param {tsext.testAssist.EntryBase1} entry
		 */
		addElement: function(entry, distributor){
			if(entry.getKey() != this.getKey()
			|| entry.getSubKey() != this.getSubKey()){
				this.addNgElement(entry, new TsError(Constant.ERROR_UNDEFINED)); // 未定義
				return;
			}
			if(entry.getOption() == Constant.OPTION_END){ // オプション=終了
				this.setContinued(false);
				return;
			}else if(entry.getOption()){ // 開始と終了以外の値がセットされている
				this.addNgElement(entry, new TsError(Constant.ERROR_UNDEFINED)); // 未定義
				return;
			}
			this.elements.push(entry);
			this.setSetting(entry, distributor);
			return entry;
		},
		setSetting:     function(entry){}, // 設定データ読み取り(オーバーライド)
		getElements:    function(){ return this.elements; },
		getElement:     function(index){ return this.elements[index]; },
		getNgElements:  function(){ return this.ngElements; },
		existNgElement: function(){ return (this.ngElements.length > 0); },
		addNgElement: function(entry, e){
//			this.addError(e.getErrorLevel() || Constant.ERROR_LEVEL_2, e.getMessage());
			entry.addError(e.getErrorLevel() || Constant.ERROR_LEVEL_2, e.getMessage());
			this.ngElements.push(entry);
		},
		getKey:       function(){ return this.key;    }, // キー
		getSubKey:    function(){ return this.subKey; }, // サブキー
		getOption:    function(){ return this.option; }, // オプション
		/**
		 * 項目値が空であることをチェック
		 * @param {Array.<number>} indexes
		 * @return {boolean} true:OK, false:NG
		 */
		checkEmpty: function(indexes){
			for(var i = 0 ; i < indexes.length ; i++){
				var index = indexes[i];
				if(index < this.items.length && this.items[index]){
					return false;
				}
			}
			return true;
		},
		/**
		 * 設定名の照会
		 * @param {string} v
		 * @param {{name:{string},sw:{boolean=},alias:{Array.<string>}} param
		 */
		MN: function(v, param){
			if(param.name == v
			|| (param.sw && v.startsWith(param.name))
			|| (param.alias && param.alias.indexOf(v) >= 0)
			){
				return true;
			}
			return false;
		},
		/**
		 * 月度(YYYYMM)の文字列→数値変換
		 * @param {string} v
		 * @param {boolean=} nullable
		 * @return {Object|null}
		 */
		getYm: function(v, nullable){
			if(!v){
				if(nullable){
					return {
						yearMonth: null,
						subNo: null
					};
				}
				throw new TsError(Constant.ERROR_INVALID_VALUE);
			}
			if(/^\d{6}$/.test(v)){
				var ym = parseInt(v, 10);
				if(this.isValidYm(ym)){
					return {
						yearMonth: ym,
						subNo: null
					};
				}
			}else{
				var m = /^(\d{6})\((\d+)\)$/.exec(v);
				if(m){
					var ym = parseInt(m[1], 10);
					var sn = parseInt(m[2], 10);
					if(this.isValidYm(ym) && sn >= 2 && sn <= 9){
						return {
							yearMonth: ym,
							subNo: sn - 1
						};
					}
				}
				m = /^(\d{6})_(\d+)$/.exec(v);
				if(m){
					var ym = parseInt(m[1], 10);
					var sn = parseInt(m[2], 10);
					if(this.isValidYm(ym) && sn >= 1 && sn <= 9){
						return {
							yearMonth: ym,
							subNo: sn
						};
					}
				}
			}
			throw new TsError(Constant.ERROR_INVALID_VALUE);
		},
		/**
		 * 月度の値が正しいかチェック
		 * @return {boolean}
		 */
		isValidYm: function(ym){
			if(typeof(ym) != 'number' || ym < 200000 || ym >= 300000){
				return false;
			}
			var m = ym % 100;
			return (m >= 1 && m <= 12);
		},
		/**
		 * 文字列をBooleanに変換して返す
		 * @param {string} v
		 * @param {boolean=} emptyIsFalse
		 * @return {boolean}
		 */
		getBoolean: function(v, emptyIsFalse){
			if(!v){
				if(!emptyIsFalse){
					throw new TsError(Constant.ERROR_UNDEFINED);
				}
				return false;
			}
			if(/^(true|yes|on|オン|ｵﾝ)$/i.test(v)){
				return true;
			}else if(/^(false|no|off|オフ|ｵﾌ)$/i.test(v)){
				return false;
			}
			throw new TsError(Constant.ERROR_UNDEFINED);
		},
		/**
		 * 文字列を整数に変換
		 * @param {string} v
		 * @param {boolean=} nullable
		 * @param {number} minN
		 * @param {number} maxN
		 * @return {number|null}
		 */
		getInteger: function(v, nullable, minN, maxN){
			if(typeof(v) != 'number' && !v){
				if(!nullable){
					throw new TsError(Constant.ERROR_UNDEFINED);
				}
				return null;
			}
			if(/^\d+$/.test(v)){
				var n = parseInt(v, 10);
				if((typeof(minN) == 'number' && n < minN)
				|| (typeof(maxN) == 'number' && n > maxN)){
					throw new TsError(Constant.ERROR_INVALID_VALUE);
				}
				return n;
			}
			throw new TsError(Constant.ERROR_UNDEFINED);
		},
		/**
		 * 文字列を数値に変換
		 * @param {string} v
		 * @param {boolean=} nullable
		 * @param {number} minN
		 * @param {number} maxN
		 * @return {number|null}
		 */
		getFloat: function(v, nullable, minN, maxN){
			if(typeof(v) != 'number' && !v){
				if(!nullable){
					throw new TsError(Constant.ERROR_UNDEFINED);
				}
				return null;
			}
			var n = parseFloat(v);
			if(isNaN(n)){
				throw new TsError(Constant.ERROR_UNDEFINED);
			}
			if((typeof(minN) == 'number' && n < minN)
			|| (typeof(maxN) == 'number' && n > maxN)){
				throw new TsError(Constant.ERROR_INVALID_VALUE);
			}
			return n;
		},
		/**
		 * 文字列を整数に変換
		 * @param {string} v
		 * @param {boolean=} nullable
		 * @param {number} maxLen
		 * @return {string|null}
		 */
		getStr: function(v, nullable, maxLen){
			if(!v){
				if(!nullable){
					throw new TsError(Constant.ERROR_UNDEFINED);
				}
				return null;
			}
			if(v.length > maxLen){
				throw new TsError(Constant.ERROR_INVALID_VALUE);
			}
			return v;
		},
		/**
		 * 時間(h:mm)を分に変換
		 * @param {string} v (h:mm)
		 * @param {boolean=} nullable
		 * @param {number} minN
		 * @param {number} maxN
		 * @return {number}
		 */
		getTime: function(v, nullable, minN, maxN){
			if(!v){
				if(!nullable){
					throw new TsError(Constant.ERROR_UNDEFINED);
				}
				return null;
			}
			var t = Util.str2minutes(v);
			if(t === null
			|| (typeof(minN) == 'number' && t < minN)
			|| (typeof(maxN) == 'number' && t > maxN)){
				throw new TsError(Constant.ERROR_INVALID_VALUE);
			}
			return t;
		},
		getDate: function(v, nullable){
			if(!v){
				if(!nullable){
					throw new TsError(Constant.ERROR_UNDEFINED);
				}
				return null;
			}
			var d = moment(v.replace(/\//g,'-'), Constant.YMD1);
			if(!d || !d.isValid()){
				throw new TsError(Constant.ERROR_INVALID_VALUE);
			}
			return d.format(Constant.YMD1);
		},
		getDateTime: function(v, nullable){
			if(!v){
				if(!nullable){
					throw new TsError(Constant.ERROR_UNDEFINED);
				}
				return null;
			}
			var d = moment(v.replace(/\//g,'-'), Constant.YMDHMS1);
			if(!d || !d.isValid()){
				throw new TsError(Constant.ERROR_INVALID_VALUE);
			}
			return d.format(Constant.YMDHMS1);
		},
		/**
		 * 開始・終了時刻
		 * @param {string} v
		 * @param {boolean=} flag true:どちらかがNullの場合はエラー
		 * @return {Object{st:{number|null},et:{number|null}}
		 */
		getStartEndTime: function(v, flag){
			var ps = (v || '').split(/\-/);
			if(ps.length > 2){
				throw new TsError(Constant.ERROR_INVALID_FORMAT, ['開始終了時刻']);
			}
			var st = (ps[0] ? Util.str2minutes(ps[0]) : null);
			var et = (ps.length > 1 && ps[1] ? Util.str2minutes(ps[1]) : null);
			if(ps[0] && st === null){
				throw new TsError(Constant.ERROR_INVALID_FORMAT, ['開始時刻']);
			}
			if(ps.length > 1 && ps[1] && et === null){
				throw new TsError(Constant.ERROR_INVALID_FORMAT, ['終了時刻']);
			}
			if(st !== null && et !== null && st >= et){
				throw new TsError(Constant.ERROR_INVALID_TIMES);
			}
			if(flag && (st === null || et === null)){
				throw new TsError(Constant.ERROR_INVALID_TIMES);
			}
			return { st: st, et: et };
		},
		/**
		 * 休憩時間
		 * @param {string} v
		 * @param {number=} flag
		 * @return {string}
		 */
		getRestTimes: function(v, flag){
			if(v == 'EMPTY'){
				return (flag == 2 ? [] : null);
			}
			var rests = [];
			var vals = (v || '').split(/[,\|]/);
			for(var i = 0 ; i < vals.length ; i++){
				var val = vals[i];
				var vs = (val || '').split(/\-/);
				if(vs.length){
					var rest = {
						from: (vs[0] ? Util.str2minutes(vs[0]) : null),
						to  : (vs.length > 1 && vs[1] ? Util.str2minutes(vs[1]) : null),
						type: 21
					};
					if((vs[0] && rest.from === null) || (vs.length > 1 && vs[1] && rest.to === null)){
						throw new TsError(Constant.ERROR_INVALID_FORMAT, ['休憩時間']);
					}else{
						rests.push(rest);
					}
				}
			}
			if(flag == 2){
				return rests;
			}else if(flag == 1){
				var ss = [];
				for(var i = 0 ; i < rests.length ; i++){
					var rest = rests[i];
					var s =   (rest.from !== null ? str.pad('' + rest.from, 4, '0', false) : '')
							+ (rest.to   !== null ? str.pad('' + rest.to  , 4, '0', false) : '');
					if(s){
						ss.push(s + '21');
					}
				}
				return ss.join(':') + ':';
			}else{
				var ss = [];
				for(var i = 0 ; i < rests.length ; i++){
					var rest = rests[i];
					var s = (rest.from !== null ? rest.from : '') + '-' + (rest.to !== null ? rest.to : '');
					if(s != '-'){
						ss.push(s);
					}
				}
				return ss.join(',');
			}
		},
		getDayType: function(v){
			if(!v){
				return null;
			}
			if(v == '勤務日'){
				return '0';
			}else if(v == '非勤務日' || v == '所定休日'){
				return '1';
			}else if(v == '法定休日'){
				return '2';
			}
			throw new TsError(Constant.ERROR_INVALID_VALUE);
		},
		getValueOfList: function(v, nullable, lst){
			if(v === undefined || v === null){
				if(!nullable){
					throw new TsError(Constant.ERROR_UNDEFINED);
				}
				return null;
			}
			if(lst.indexOf(v) < 0){
				throw new TsError(Constant.ERROR_INVALID_VALUE);
			}
			return v;
		}
	});
});
