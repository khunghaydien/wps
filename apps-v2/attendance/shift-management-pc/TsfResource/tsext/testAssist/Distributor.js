define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/service/Request",
	"tsext/testAssist/EntryFactory",
	"tsext/testAssist/Bagged",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/testAssist/export/ExportManager",
	"tsext/util/Util"
], function(declare, lang, array, str, Request, EntryFactory, Bagged, Current, Constant, ExportManager, Util){
	// CSVデータから指示データ配列を生成して実行させる
	return declare("tsext.testAssist.Distributor", null, {
		constructor: function(){
			this.view = null;
			this.clear();
			this.commonConfig = null;
			this.exportManager = new ExportManager({});
		},
		/**
		 * パラメータをデータ入力前の状態にする
		 */
		clear: function(){
			this.entrys = [];
			this.invalids = [];
			this.logs = [];
			this.cacheEntry = {};
			this.pauseFlag = false;
			this.pauseBagged = null;
			this.finished = false;
			this.clearProgress();
		},
		/**
		 * エラーフラグをクリア
		 */
		clearErrorFlag: function(){
			this.errorLevel = 0;
		},
		/**
		 * 処理済み件数、NG件数、エラーフラグをクリア
		 */
		clearProgress: function(){
			this.doneCount = 0;
			this.ngCount = 0;
			this.errorLevel = 0;
		},
		/**
		 * Viewインスタンスをセット
		 * @param {tsext.testAssist.TestAssistView} view
		 */
		setMainView: function(view){
			this.view = view;
			// AtkCommon__c を読み込む
			Current.fetchCommon(this).then(
				lang.hitch(this, function(records){
					var common = (records.length ? records[0] : null);
					if(common && typeof(common.Config__c) == 'string'){
						this.commonConfig = Util.fromJson(common.Config__c);
					}
					if(!this.isTestEnvironment()){
						this.showError('テスト環境ではないためデータ更新は行えません')
					}
					this.resetControl(Constant.BIT_C_INPUT);
				}),
				lang.hitch(this, function(errmsg){
					this.showError(errmsg);
				})
			);
		},
		// テスト環境か
		isTestEnvironment: function(){
			return (this.commonConfig && this.commonConfig.testEnvironment) || false;
		},
		resetControl:    function(value)  { if(this.view){ this.view.resetControl(value);    } }, // ボタンの活性/非活性制御
		setCursor:       function(index)  { if(this.view){ this.view.setCursor(index, this); } }, // カーソルセット
		clearCursor:     function()       { if(this.view){ this.view.clearCursor(this);      } }, // カーソルクリア
		setEntryResult:  function(index)  { if(this.view){ this.view.setEntryResult(index);  } }, // 結果をセット
		showError:       function(errmsg) { if(this.view){ this.view.showError(errmsg);      } }, // エラー表示
		showMessage:     function(message){ if(this.view){ this.view.showMessage(message);   } }, // メッセージ表示
		getDoneCount:    function()       { return this.doneCount;       }, // 処理済み件数
		getNgCount:      function()       { return this.ngCount;         }, // NG件数
		getEntryCount:   function()       { return this.entrys.length;   }, // 指示データ数を返す
		getEntrys:       function()       { return this.entrys;          }, // 指示データの配列を返す
		getInvalidCount: function()       { return this.invalids.length; }, // 不正データ数
		isFinished:      function()       { return this.finished;        }, // 終了後
		setFinished:     function(flag)   { this.finished = flag;        }, // 終了後/終了前をセット
		// 指示データを返す
		getEntryByIndex: function(index){
			return (index < this.entrys.length ? this.entrys[index] : null);
		},
		// 開始可否
		isReady: function(){
			return (this.entrys.length && !this.invalids.length && !this.isFinished());
		},
		// 一時停止要求の有無
		isPauseRequest: function(){
			return this.pauseFlag || false;
		},
		// 一時停止済みか
		isPause: function(){
			return (this.pauseFlag && this.pauseBagged) ? true : false;
		},
		// 一時停止解除
		unPause: function(){
			this.pauseFlag = false;
			this.pauseBagged = null;
		},
		// 再開用のbagged
		getPauseBagged: function(){
			return this.pauseBagged;
		},
		// 一時停止位置
		getPauseIndex: function(){
			return (this.pauseBagged && this.pauseBagged.getIndex()) || 0;
		},
		// 削除行を前に追加可否((一時停止中でないまたは1行目で停止中)かつ終了後でないなら可)
		isCanInjectTop : function(){
			return (!this.isPause() || this.getPauseIndex() <= 0) && !this.isFinished();
		},
		/**
		 * CSVデータを入力
		 * @param {string} csvData
		 * @param {boolean} injectFlag
		 * @param {Function} callback
		 */
		input: function(csvData, injectFlag, callback){
			this.clear();
			Current.fetchMaster(this).then(
				lang.hitch(this, function(){
					var value = csvData.replace(/\r\n/g, '\n');
					Papa.parse(value, {
						newline: '\n',
						delimiter: '',
						comments: '//',
						complete: lang.hitch(this, function(result){
							this.parse(result.data);
							this.injectStart(injectFlag, callback);
						}),
						error: lang.hitch(this, function(err, file, inputElem, reason){
							console.log(err);
							console.log(file);
							console.log(inputElem);
							console.log(reason);
							callback(false, reason);
						})
					});
				}),
				lang.hitch(this, function(errmsg){
					callback(false, errmsg);
				})
			);
		},
		/**
		 * CSVデータから指示データインスタンス配列を作成
		 * 書式誤りは無効配列に格納
		 * @param {Object} data Papa.parse が返したデータ
		 */
		parse: function(data){
			this.data = data;
			var entry = null;
			for(var i = 0 ; i < data.length ; i++){
				entry = this.allocateEntry(data[i], (i+1), entry);
				if(entry){
					if(!entry.isValid()){
						this.invalids.push(entry);
						entry = null;
					}else if(entry.isEmpty() || entry.isListed() || entry.isEnd()){
						continue;
					}else{
						this.entrys.push(entry);
						entry.setListed(true);
						this.addCacheEntry(entry);
					}
				}
			}
			for(i = 0 ; i < this.entrys.length ; i++){
				entry = this.entrys[i];
				if(entry.isContinued() && entry.isValid()){ // 終了行がない
					entry.addError(Constant.ERROR_INVALID_LINE); // 無効行
					this.invalids.push(entry);
				}
			}
		},
		injectStart: function(injectFlag, callback){
			this.exportManager.fetchCommonAndRelated({
				callback: lang.hitch(this, function(expObj){
					if(expObj.errmsg){
						console.log(expObj.errmsg);
					}
					this.injectDelete(injectFlag, callback);
				})
			});
		},
		/**
		 * 削除行を挿入
		 * @param {boolean} injectFlag
		 * @param {Function} callback 
		 */
		 injectDelete: function(injectFlag, callback){
			if(this.getInvalidCount() > 0){ // 構文エラーがある
				callback(true);
				return;
			}
			var news = [];
			// 新規を集める
			for(var i = 0 ; i < this.entrys.length ; i++){
				var entry = this.entrys[i];
				if(entry.getOption() == Constant.OPTION_NEW){ // 
					news.push(entry);
				}
			}
			// 新規を社員＞勤務体系＞勤務パターン＞休暇に並び替え
			var km = {};
			km[Constant.KEY_EMP]      = 1;
			km[Constant.KEY_CALENDAR] = 2;
			km[Constant.KEY_EMPTYPE]  = 3;
			km[Constant.KEY_PATTERN]  = 4;
			km[Constant.KEY_HOLIDAY]  = 5;
			km[Constant.KEY_WORK_LOCATION]  = 6;
			news = news.sort(function(a, b){
				var kx = (km[a.getSubKey()] || 0) - (km[b.getSubKey()] || 0);
				if(!kx){
					if(a.getSubKey() == Constant.KEY_HOLIDAY){ // 休暇
						// 大分類＝オンの休暇が下になるようにする
						if(a.isSummaryRoot() && !b.isSummaryRoot()){
							return 1;
						}else if(!a.isSummaryRoot() && b.isSummaryRoot()){
							return -1;
						}
					}
				}
				return kx;
			});
			// 新規1件ごとに削除行を作成
			var kc = {};
			kc[Constant.KEY_HOLIDAY] = 'holidays';
			kc[Constant.KEY_PATTERN] = 'patterns';
			kc[Constant.KEY_WORK_LOCATION] = 'workLocations';
			kc[Constant.KEY_EMPTYPE] = 'empTypes';
			kc[Constant.KEY_EMP]     = 'emps';
			var injectBefores = [];
			var injectAfters = [];
			for(var i = 0 ; i < news.length ; i++){
				var entry = news[i];
				if(entry.getSubKey() == Constant.KEY_CALENDAR){
					var line = [entry.getKey(), entry.getSubKey(), Constant.OPTION_DELETE, entry.getItem(0), "", "", entry.getItem(3)];
					injectBefores.push(line);
					injectAfters.push(line);
				}else if(kc[entry.getSubKey()]){
					var line = [entry.getKey(), entry.getSubKey(), Constant.OPTION_DELETE, entry.getItem(0)];
					var id = Current.getIdByName(kc[entry.getSubKey()], entry.getItem(0), true, true);
					if(id){
						injectBefores.push(line);
					}
					injectAfters.push(line);
				}
			}
			if(injectFlag && injectBefores.length){
				var newData = injectBefores.concat(this.data);
				this.clear();
				this.parse(newData);
			}
			var injectLines = [];
			for(var i = 0 ; i < injectAfters.length ; i++){
				injectLines.push(Util.arrayToCsvString(injectAfters[i]));
			}
			this.exportManager.outputExportCommon(injectLines);
			this.view.setClearnUpData(injectLines);
			callback(true);
		},
		/**
		 * 新規要素の名前をキャッシュに保存
		 * @param {tsext.testAssist.EntryBase1} entry 
		 */
		addCacheEntry: function(entry){
			if(entry.getOption() == Constant.OPTION_NEW){
				var subKey = entry.getSubKey();
				var l = this.cacheEntry[subKey];
				if(!l){
					l = this.cacheEntry[subKey] = [];
				}
				l.push(entry.getItem(0));
			}
		},
		/**
		 * 存在チェック
		 * @param {string} subKey 
		 * @param {string} name 
		 * @returns {boolean}
		 */
		isExistByName: function(subKey, name){
			var l = this.cacheEntry[subKey];
			if(l && l.length && l.indexOf(name) >= 0){
				return true;
			}
			var kc = {};
			kc[Constant.KEY_HOLIDAY] = 'holidays';
			kc[Constant.KEY_PATTERN] = 'patterns';
			kc[Constant.KEY_EMPTYPE] = 'empTypes';
			kc[Constant.KEY_EMP]     = 'emps';
			var id = Current.getIdByName(kc[subKey], name, true, true);
			return (id ? true : false);
		},
		/**
		 * 指示データインスタンスを取り込む
		 * @param {Array.<string>} v CSVの1行
		 * @param {number} lineNo 行番号
		 * @param {tsext.testAssist.EntryBase1} pEntry 直前の指示データ
		 * @return {tsext.testAssist.EntryBase1}(の継承クラス)
		 */
		allocateEntry: function(v, lineNo, pEntry){
			var entry = EntryFactory.createEntry(v, lineNo);
			if(!pEntry || !entry){
				if(entry && entry.isSetting() && !entry.isContinued() && entry.isValid() && !entry.isAlone()){
					entry.addError(Constant.ERROR_INVALID_LINE); // 無効行
				}
				return entry;
			}
			if(entry.isEmpty()){
				return pEntry;
			}
			if(pEntry.isSetting()){ // 設定系
				if(pEntry.isContinued()){
					if(pEntry.getKey()    != entry.getKey()
					|| pEntry.getSubKey() != entry.getSubKey()
					|| pEntry.isAlone()
					){
						entry.addError(Constant.ERROR_INVALID_LINE); // 無効行
						this.invalids.push(entry);
					}else{
						pEntry.addElement(entry, this);
						if(!entry.isValid()){
							this.invalids.push(entry);
						}else{
							pEntry.setContinued(entry.isEnd() ? false : true);
						}
					}
					return pEntry;
				}
				pEntry.setContinued(false);
			}else if(pEntry.isIO() && entry.isIO()){ // 打刻
				pEntry.addElement(entry, this);
				if(!entry.isValid()){
					this.invalids.push(entry);
				}
				return pEntry;
			}else if(pEntry.isAccessLog() && entry.isAccessLog()){ // 入退館ログ
				pEntry.addElement(entry, this);
				if(!entry.isValid()){
					this.invalids.push(entry);
				}
				return pEntry;
			}
			return entry;
		},
		/**
		 * CSVデータを出力用に加工して返す
		 * エラーメッセージを21列目にセットする
		 * @return {Object} Papa.unparse 用のデータ
		 */
		getData: function(){
			for(var i = 0 ; i < this.entrys.length ; i++){
				var entry = this.entrys[i];
				if(!entry.isEmpty() && !entry.isValid()){
					this.invalids.push(entry);
				}else if(entry.existNgElement()){
					this.invalids = this.invalids.concat(entry.getNgElements());
				}
			}
			this.invalids = this.invalids.sort(function(a, b){
				return a.getLineNo() - b.getLineNo();
			});
			for(var i = 0 ; i < this.invalids.length ; i++){
				var invalid = this.invalids[i];
				this.data[invalid.getLineNo() - 1][Constant.INDEX_ERROR] = invalid.getErrors().join(',');
			}
			return this.data;
		},
		/**
		 * 入力開始
		 * @param {tsext.testAssist.TestAssitView} view
		 * @param {Function} callback
		 */
		inputStart: function(){
			if(!this.isTestEnvironment()){
				this.showError('テスト環境ではないためデータ更新は行えません');
				return;
			}
			this.resetControl(Constant.BIT_C_PAUSE);
			this.clearErrorFlag();
			this.setFinished(false);
			Current.fetchMaster(this).then(
				lang.hitch(this, this.inputLoopStart),
				lang.hitch(this, function(errmsg){
					this.showError(errmsg);
				})
			);
		},
		/**
		 * 入力ループ開始
		 */
		inputLoopStart: function(){
			this.lastEntry = null;
			if(this.isPause()){
				var bagged = this.getPauseBagged();
				this.unPause();
				this.inputLoop(bagged);
				return;
			}
			var bagged = new Bagged(this);
			bagged.setLoopNext(lang.hitch(this, this.loopNext));
			bagged.resetIndex();
			this.clearProgress();
			this.resetControl(Constant.BIT_C_PAUSE);
			this.inputLoop(bagged);
		},
		/**
		 * 入力ループ
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		inputLoop: function(bagged){
			var entry = this.getEntryByIndex(bagged.getIndex());
			if(!entry){
				this.finish(true); // 終了
				this.setCursor(bagged.getIndex());
				return;
			}
			if(entry.isSkip()){ // スキップ
				this.setCursor(bagged.getIndex());
				this.lastEntry = entry;
				bagged.doneSkip();
				return;
			}
			if(this.lastEntry && (this.isPauseRequest() || entry.isPause())){ // 一時停止
				this.pauseRequest(bagged);
				this.resetControl(Constant.BIT_C_INPUT|Constant.BIT_C_START|Constant.BIT_C_LOG|Constant.BIT_C_OPTION);
				entry.setMode(Constant.OPE_PAUSE);
				this.setCursor(bagged.getIndex());
				this.showMessage('一時停止');
				return;
			}
			this.lastEntry = entry;
			if(entry.isInformation()){ // 説明行
				entry.resetResults();
				this.setCursor(bagged.getIndex());
				bagged.doneResult();
				return;
			}
			this.unPause();
			entry.resetResults();
			entry.setMode(Constant.OPE_DOING);
			this.showMessage(entry.getEntryName());
			this.setCursor(bagged.getIndex());
			this.resetControl(Constant.BIT_C_PAUSE|Constant.BIT_C_LOG);

			if(entry.isLoadEmpMonth()		// 勤怠月次読込
			|| entry.isIO() 				// 打刻
			|| entry.isAccessLog() 			// 入退館ログ
			|| entry.isChangeStatus()		// 日次申請の取消/承認/却下
			|| entry.isApplyEmpDay()		// 日次申請
			|| entry.isApplyEmpMonth()		// 月次確定
			|| entry.isEntryShift()			// シフト設定
			|| entry.isInspectValue()		// 検査
			|| entry.isSettingHoliday() 	// 休暇
			|| entry.isSettingPattern() 	// 勤務パターン
			|| entry.isSettingWorkLocation() // 勤務場所
			|| entry.isSettingEmpType() 	// 勤務体系
			|| entry.isSettingConfig() 		// 勤怠設定
			|| entry.isSettingCalendar() 	// カレンダー
			|| entry.isSettingEmp() 		// 社員
			|| entry.isSettingEmpLeave()	// 休暇付与
			|| entry.isSettingEmpCET()		// 勤務体系変更
			|| entry.isSettingCommon()		// 共通
			){
				entry.execute(bagged);
			}else{
				setTimeout(lang.hitch(this, function(){ this.inputLoop(bagged.next()); }), 100);
			}
		},
		/**
		 * 次の入力
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		loopNext: function(bagged){
			if(bagged.stopped()){
				return;
			}
			var entry = this.getEntryByIndex(bagged.getIndex());
			if(!entry.isSkip()){ // スキップ以外
				entry.setMode(Constant.OPE_DONE);
				this.setCursor(bagged.getIndex());
			}
			if(!entry.isError()){ // エラー以外
				if(entry.isTestNg()){
					this.ngCount++;
				}
				this.doneCount++;
			}
			this.inputLoop(bagged.next());
		},
		/**
		 * 実行結果を受け画面に反映
		 */
		pushResult: function(obj){
			this.addLog(obj);
			var entry = this.getEntryByIndex(obj.index);
			if(entry.isTest(true) && !obj.tested){
				var expectedErrmsg = entry.getExpectedError();
				if((!expectedErrmsg && !obj.errorLevel) // 期待値=OKかつ結果=OK
				|| (expectedErrmsg && obj.errorLevel && obj.message == expectedErrmsg)){ // 期待値エラーと結果エラーが同じ
					obj.result = 0;
					obj.message = str.substitute('エラー=[${0}]', [obj.message]);
				}else{
					obj.result = 1;
					obj.message = str.substitute('期待値=[${0}], 結果=[${1}]', [expectedErrmsg || 'OK', (obj.errorLevel ? obj.message : 'OK')]);
				}
//				if(!expectedErrmsg && obj.errorLevel >= Constant.ERROR_LEVEL_2){ // 期待値=OK,結果=エラーは停止
//					this.errorLevel = obj.errorLevel;
//					entry.setMode(Constant.OPE_PAUSE);
//				}else{
					entry.setErrorLevel(0);
					entry.setMode(obj.mode);
//				}
				entry.pushResult(obj);
			}else{
				entry.pushResult(obj);
				if(obj.errorLevel >= Constant.ERROR_LEVEL_2){
					this.errorLevel = obj.errorLevel;
					entry.setMode(Constant.OPE_PAUSE);
				}else if(obj.mode){
					entry.setMode(obj.mode);
				}
			}
			this.setEntryResult(obj.index);
		},
		/**
		 * 続行可否を判断し不可なら一時停止要求する
		 */
		canContinue: function(bagged){
			if(this.errorLevel < Constant.ERROR_LEVEL_2){
				return true;
			}else{
				this.pauseRequest(bagged);
				return false;
			}
		},
		/**
		 * 一時停止要求
		 * @param {Object|null} bagged
		 */
		pauseRequest : function(bagged){
			this.pauseFlag = true;
			if(bagged){
				this.pauseBagged = bagged;
			}
			this.resetControl(Constant.BIT_C_LOG);
		},
		/**
		 * 行の状態を切替
		 * @param {number} 行番号(0はじまり)
		 * @return {Object|null}
		 */
		toggleMode: function(index){
			var entry = this.getEntryByIndex(index);
			return (entry ? entry.toggleMode() : null);
		},
		/**
		 * ログ出力
		 * @param {string} log
		 * @param {Array.<string>} args
		 */
		outputLog : function(log, args){
			var obj = {
				timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
				message: str.substitute(log || '', args || [])
			};
			this.addLog(obj);
		},
		/**
		 * ログ追加
		 * @param {Object} obj
		 */
		addLog : function(obj){
			this.logs.push(obj.timestamp + ' ' + obj.message);
		},
		/**
		 * ログを返す(改行コード区切り)
		 * @return {string}
		 */
		getLog : function(){
			return this.logs.join('\n');
		},
		/**
		 * 終了
		 */
		finish: function(flag){
			if(flag){
				this.setFinished(true);
				this.showMessage('終了');
				this.outputLog(Constant.LOG_FINISHED);
				this.clearCursor();
				this.resetControl(Constant.BIT_C_INPUT|Constant.BIT_C_LOG|Constant.BIT_C_OPTION);
			}else{
				this.showError('エラーにより停止');
				this.resetControl(Constant.BIT_C_INPUT|Constant.BIT_C_START|Constant.BIT_C_LOG|Constant.BIT_C_OPTION);
			}
		}
	});
});
