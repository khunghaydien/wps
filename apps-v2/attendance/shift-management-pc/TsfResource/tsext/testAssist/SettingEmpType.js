define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/SettingConfig",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/testAssist/DefaultSettings",
	"tsext/util/TsError",
	"tsext/util/TimeUtil",
	"tsext/util/Util"
], function(declare, lang, array, str, SettingConfig, Current, Constant, DefaultSettings, TsError, TimeUtil, Util){
	// 勤務体系
	return declare("tsext.testAssist.SettingEmpType", SettingConfig, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor: function(args, lineNo){
			this.empType    = DefaultSettings.getDefaultEmpType();
			this.configBase = DefaultSettings.getDefaultConfigBase();
			if(this.getOption() == Constant.OPTION_NEW){ // オプション=新規
				this.setContinued(true);
			}else if(this.getOption() != Constant.OPTION_DELETE){
				this.addError(Constant.ERROR_UNDEFINED); // 未定義
			}
			this.empType.Name = this.configBase.Name = this.config.Name = this.getItem(0); // 名称
			this.empTypeHolidays = [];
			this.empTypePatterns = [];
			this.empTypeYuqs = [];
		},
		/**
		 * @param {tsext.testAssist.Setting} el
		 * @param {tsext.testAssist.Distributor} distributor
		 */
		setSetting: function(el, distributor){
			var item1 = el.getItem(0);
			var item2 = el.getItem(1);
			if(this.MN(item1, Constant.SET_EMPTYPE_NAME)){ // 名称
				this.empType.Name = this.configBase.Name = this.config.Name = item2;
			}else if(this.MN(item1, Constant.SET_EMPTYPE_CODE)){ // 勤務体系コード
				this.empType.EmpTypeCode__c = item2;
			}else if(this.MN(item1, Constant.SET_LEAVE_PROVIDE_NOTICE)){ try{ this.empType.YuqAssignNoMessages__c = this.getBoolean(item2); }catch(e){ this.addNgElement(el,e); } // 付与のお知らせ
			// 起算日
			}else if(this.MN(item1, Constant.SET_START_MONTH)       ){ try{ this.configBase.InitialDateOfYear__c  = '' + this.getInteger(item2, false, 1, 12); }catch(e){ this.addNgElement(el, e); } // 起算月
			}else if(this.MN(item1, Constant.SET_START_DATE)        ){ try{ this.configBase.InitialDateOfMonth__c = '' + this.getInteger(item2, false, 1, 28); }catch(e){ this.addNgElement(el, e); } // 起算日
			}else if(this.MN(item1, Constant.SET_YEAR_NOTATION)     ){ // 年度の表記
				try{
					if(item2 == '起算月に合わせる'){
						this.configBase.MarkOfYear__c = '1';
					}else if(item2 == '締め月に合わせる'){
						this.configBase.MarkOfYear__c = '2';
					}else{
						this.configBase.MarkOfYear__c = '' + this.getInteger(item2, false, 1, 2);
					}
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_MONTH_NOTATION)    ){ // 月度の表記
				try{
					if(item2 == '起算日に合わせる'){
						this.configBase.MarkOfMonth__c = '1';
					}else if(item2 == '締め日に合わせる'){
						this.configBase.MarkOfMonth__c = '2';
					}else{
						this.configBase.MarkOfMonth__c = '' + this.getInteger(item2, false, 1, 2);
					}
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_START_DAYOFWEEK)   ){ // 週の起算日
				try{
					if(/^\d+$/.test(item2)){
						this.configBase.InitialDayOfWeek__c = '' + this.getInteger(item2, false, 0, 6);
					}else{
						var n = ['日','月','火','水','木','金','土'].indexOf(item2);
						if(n >= 0){
							this.configBase.InitialDayOfWeek__c = '' + n;
						}else{
							throw new TsError(Constant.ERROR_INVALID_VALUE);
						}
					}
				}catch(e){
					this.addNgElement(el, e);
				}
			// 積立休暇の設定
			}else if(this.MN(item1, Constant.SET_STOCK_HOLIDAY_ENABLE)){ try{ this.empType.EnableStockHoliday__c    = this.getBoolean(item2);            }catch(e){ this.addNgElement(el, e); } // 積立休暇設定
			}else if(this.MN(item1, Constant.SET_STOCK_HOLIDAY_TARGET)){ try{ this.empType.TargetStockHoliday__c    = item2;                             }catch(e){ this.addNgElement(el, e); } // 積立休暇の選択
			}else if(this.MN(item1, Constant.SET_STOCK_MAX_DAYS_YEAR) ){ try{ this.empType.MaxStockHolidayPerYear__c= this.getInteger(item2,false,0,99); }catch(e){ this.addNgElement(el, e); } // 一回の積立日数
			}else if(this.MN(item1, Constant.SET_STOCK_MAX_DAYS)      ){ try{ this.empType.MaxStockHoliday__c       = this.getInteger(item2,false,0,999);}catch(e){ this.addNgElement(el, e); } // 最大積立日数
			// 代休管理の設定
			}else if(this.MN(item1, Constant.SET_USE_DAIQ_MANAGE)   ){ try{ this.empType.UseDaiqManage__c       = this.getBoolean(item2); }catch(e){ this.addNgElement(el, e); } // 代休管理
			}else if(this.MN(item1, Constant.SET_USE_HALF_DAIQ)     ){ try{ this.empType.UseHalfDaiq__c         = this.getBoolean(item2); }catch(e){ this.addNgElement(el, e); } // 半日代休
			}else if(this.MN(item1, Constant.SET_DAIQ_ALL_BORDER)   ){ try{ this.empType.DaiqAllBorderTime__c   = this.getTime(item2);    }catch(e){ this.addNgElement(el, e); } // 終日代休可
			}else if(this.MN(item1, Constant.SET_DAIQ_HALF_BORDER)  ){ try{ this.empType.DaiqHalfBorderTime__c  = this.getTime(item2);    }catch(e){ this.addNgElement(el, e); } // 半日代休可
			}else if(this.MN(item1, Constant.SET_DAIQ_LIMIT)        ){ try{ this.empType.DaiqLimit__c = this.getInteger(item2,false,0,99);}catch(e){ this.addNgElement(el, e); } // 代休の有効期間
			}else if(this.MN(item1, Constant.SET_DAIQ_RESERVE)      ){ try{ this.empType.UseDaiqReserve__c      = this.getBoolean(item2); }catch(e){ this.addNgElement(el, e); } // 申請時に代休有無を指定
			}else if(this.MN(item1, Constant.SET_DAIQ_LEGAL_HOLIDAY)){ try{ this.empType.UseDaiqLegalHoliday__c = this.getBoolean(item2); }catch(e){ this.addNgElement(el, e); } // 法定休日出勤の代休可
			}else if(this.MN(item1, Constant.SET_REGULATE_HOLIDAY)  ){ try{ this.empType.UseRegulateHoliday__c  = this.getBoolean(item2); }catch(e){ this.addNgElement(el, e); } // 休日出勤の勤怠規則は平日に準拠
			}else if(this.MN(item1, Constant.SET_NO_DAIQ_EXCHANGED) ){ try{ this.empType.NoDaiqExchanged__c     = this.getBoolean(item2); }catch(e){ this.addNgElement(el, e); } // 振替休日に出勤した場合は代休不可
			// 残業警告の設定
			}else if(this.MN(item1, Constant.SET_OVERTIME_MONTH_MAX  )){ try{ this.empType.OverTimeMonthLimit__c  = this.getTime(item2, true);       }catch(e){ this.addNgElement(el, e); } // 月間残業時間上限
			}else if(this.MN(item1, Constant.SET_OVERTIME_MONTH_WARN1)){ try{ this.empType.OverTimeMonthAlert1__c = this.getTime(item2, true);       }catch(e){ this.addNgElement(el, e); } // 月間残業時間警告1
			}else if(this.MN(item1, Constant.SET_OVERTIME_MONTH_WARN2)){ try{ this.empType.OverTimeMonthAlert2__c = this.getTime(item2, true);       }catch(e){ this.addNgElement(el, e); } // 月間残業時間警告2
			}else if(this.MN(item1, Constant.SET_OVERTIME_MONTH_WARN3)){ try{ this.empType.OverTimeMonthAlert3__c = this.getTime(item2, true);       }catch(e){ this.addNgElement(el, e); } // 月間残業時間警告3
			}else if(this.MN(item1, Constant.SET_OVERTIME_QTR_MAX    )){ try{ this.empType.OverTimeQuartLimit__c  = this.getTime(item2, true);       }catch(e){ this.addNgElement(el, e); } // 4半期残業時間上限
			}else if(this.MN(item1, Constant.SET_OVERTIME_QTR_WARN1  )){ try{ this.empType.OverTimeQuartAlert1__c = this.getTime(item2, true);       }catch(e){ this.addNgElement(el, e); } // 4半期残業時間警告1
			}else if(this.MN(item1, Constant.SET_OVERTIME_QTR_WARN2  )){ try{ this.empType.OverTimeQuartAlert2__c = this.getTime(item2, true);       }catch(e){ this.addNgElement(el, e); } // 4半期残業時間警告2
			}else if(this.MN(item1, Constant.SET_OVERTIME_YEAR_MAX   )){ try{ this.empType.OverTimeYearLimit__c   = this.getTime(item2, true);       }catch(e){ this.addNgElement(el, e); } // 年間残業時間上限
			}else if(this.MN(item1, Constant.SET_OVERTIME_YEAR_WARN1 )){ try{ this.empType.OverTimeYearAlert1__c  = this.getTime(item2, true);       }catch(e){ this.addNgElement(el, e); } // 年間残業時間警告1
			}else if(this.MN(item1, Constant.SET_OVERTIME_YEAR_WARN2 )){ try{ this.empType.OverTimeYearAlert2__c  = this.getTime(item2, true);       }catch(e){ this.addNgElement(el, e); } // 年間残業時間警告2
			}else if(this.MN(item1, Constant.SET_OVERTIME_COUNT_MAX  )){ try{ this.empType.OverTimeCountLimit__c  = this.getInteger(item2,true,1,12);}catch(e){ this.addNgElement(el, e); } // 残業超過回数上限
			}else if(this.MN(item1, Constant.SET_OVERTIME_COUNT_WARN1)){ try{ this.empType.OverTimeCountAlert__c  = this.getInteger(item2,true,1,12);}catch(e){ this.addNgElement(el, e); } // 残業超過回数警告1
			// 有休自動付与
			}else if(this.MN(item1, Constant.SET_LEAVE_PROVIDE_AUTO)){ // 有休を自動付与する
				try{
					if(item2 == '入社日基準'){
						this.empType.YuqOption__c = '1';
					}else if(item2 == '指定日に定期付与'){
						this.empType.YuqOption__c = '2';
					}else if(item2 == 'しない' || item2 == 'オフ'){
						this.empType.YuqOption__c = '0';
					}
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_LEAVE_PROVIDE_DATE)){ // 指定日
				try{
					var m = /^(\d+)([月\/])(\d+)日?$/.exec(item2);
					if(m){
						var mm = parseInt(m[1], 10);
						var dd = parseInt(m[3], 10);
						if(mm < 1 || mm > 12 || dd < 1 || dd > 31){
							throw new TsError(Constant.ERROR_INVALID_VALUE);
						}
						this.empType.YuqDate1__c = (mm * 100) + dd;
					}else{
						throw new TsError(Constant.ERROR_INVALID_VALUE);
					}
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_WORKING_DAYS_BORDER)){ // 継続勤務日数の範囲条件
				try{
					if(item2 == '以下'){
						this.empType.workingDaysBorder = 0;
					}else if(item2 == '未満'){
						this.empType.workingDaysBorder = -1;
					}else{
						throw new TsError(Constant.ERROR_INVALID_VALUE);
					}
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_EMPTYPE_HOLIDAY)){
				if(item2 != 'DEFAULT' && !distributor.isExistByName(Constant.KEY_HOLIDAY, item2)){
					this.addNgElement(el, new TsError(Constant.ERROR_UNDEFINED));
				}
			}else if(this.MN(item1, Constant.SET_EMPTYPE_PATTERN)){
				if(!distributor.isExistByName(Constant.KEY_PATTERN, item2)){
					this.addNgElement(el, new TsError(Constant.ERROR_UNDEFINED));
				}
			}else if(this.MN(item1, Constant.SET_EMPTYPE_GRANTDAYS)){
			}else{
				this.inherited(arguments);  // SettingConfig の setSetting()
			}
		},
		/**
		 * @param {tsext.testAssist.Setting} el
		 */
		setSetting2: function(el){
			var item1 = el.getItem(0);
			var item2 = el.getItem(1);
			if(this.MN(item1, Constant.SET_EMPTYPE_HOLIDAY)){ // 休暇
				this.addEmpTypeHoliday(el);
			}else if(this.MN(item1, Constant.SET_EMPTYPE_PATTERN)){ // パターン
				this.addEmpTypePattern(el);
			}else if(this.MN(item1, Constant.SET_EMPTYPE_GRANTDAYS)){ // 付与日数
				this.addEmpTypeYuq(el);
			}
			this.inherited(arguments);
		},
		/**
		 * 入力直前のチェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			for(var i = 0 ; i < this.getElements().length ; i++){
				this.setSetting2(this.getElement(i));
			}
			var errmsg = this.getErrorMessage();
			if(errmsg){
				this.addError(errmsg);
			}
			this.calcSetting();
			this.empTypeId = null;
			if(this.isDelete()){ // 削除
				try{
					this.empTypeId = Current.getIdByName('empTypes', this.empType.Name, false, true);
				}catch(e){
					this.addError(e.getErrorLevel(), e.getMessage());
				}
				if(!this.empTypeId){
					this.addError(Constant.ERROR_LEVEL_1, Constant.ERROR_NOTFOUND);
				}
			}else{
				if(Current.getIdByName('empTypes', this.empType.Name, true, true)){
					this.addError(Constant.ERROR_NAME_DUPLICATE2, ['勤務体系']);
				}
			}
			return this.inherited(arguments);
		},
		/**
		 * 勤務体系別休暇を追加
		 * @param {tsext.testAssist.Setting} entry
		 */
		addEmpTypeHoliday: function(entry){
			var item2 = entry.getItem(1);
			try{
				if(item2 == 'DEFAULT'){
					var builtIns = ['年次有給休暇','午前半休','午後半休','時間単位有休','代休','午前半代休','午後半代休','慶弔休暇']
					for(var i = 0 ; i < builtIns.length ; i++){
						var name = builtIns[i];
						var id = Current.getIdByName('holidays', name, true, true);
						if(id){
							this.empTypeHolidays.push({ HolidayId__c: id });
						}
					}
				}else{
					var id = Current.getIdByName('holidays', item2);
					this.empTypeHolidays.push({
						HolidayId__c: id
					});
				}
			}catch(e){
				this.addNgElement(entry, e);
			}
		},
		/**
		 * 勤務体系別パターンを追加
		 * @param {tsext.testAssist.Setting} entry
		 */
		addEmpTypePattern: function(entry){
			var item2 = entry.getItem(1);
			var item3 = entry.getItem(2);
			try{
				var id = Current.getIdByName('patterns', item2);
				var o = {
					PatternId__c: id,
					SchedOption__c: '0',
					SchedWeekly__c: '12345',
					SchedMonthlyLine__c: '1',
					SchedMonthlyWeek__c: '0',
					SchedMonthlyDate__c: 1
				};
				if(item3){
					if(item3.startsWith('毎週')){
						o.SchedOption__c = '1';
						o.SchedWeekly__c = '';
						var ws = item3.substring(2).trim();
						for(var i = 0 ; i < ws.length ; i++){
							var x = ['日','月','火','水','木','金','土'].indexOf(ws[i]);
							if(x < 0){
								throw new TsError(Constant.ERROR_INVALID_VALUE);
							}
							var w = ('' + x);
							if(o.SchedWeekly__c.indexOf(w) < 0){
								o.SchedWeekly__c += w;
							}
						}
						if(!o.SchedWeekly__c){
							throw new TsError(Constant.ERROR_INVALID_VALUE);
						}
					}else if(item3.startsWith('毎月')){
						var s = item3.substring(2).trim();
						var m = /^(\d+)日$/.exec(s);
						if(m){
							var n = parseInt(m[1], 10);
							if((n < 1 || n > 28) && n != 32){
								throw new TsError(Constant.ERROR_INVALID_VALUE);
							}
							o.SchedOption__c = '2';
							o.SchedMonthlyDate__c = n;
							o.SchedWeekly__c = null;
						}else{
							m = /^第(\d)(.)曜?日?$/.exec(s);
							if(m){
								var n = parseInt(m[1], 10);
								var w = ['日','月','火','水','木','金','土'].indexOf(m[2]);
								if(n < 1 || n > 5 || w < 0){
									throw new TsError(Constant.ERROR_INVALID_VALUE);
								}
								o.SchedOption__c = '3';
								o.SchedMonthlyLine__c = '' + n;
								o.SchedMonthlyWeek__c = '' + w;
								o.SchedWeekly__c = null;
							}else{
								throw new TsError(Constant.ERROR_INVALID_VALUE);
							}
						}
					}else if(item3 != '任意日'){
						throw new TsError(Constant.ERROR_INVALID_VALUE);
					}
				}
				this.empTypePatterns.push(o);
			}catch(e){
				this.addNgElement(entry, e);
			}
		},
		/**
		 * 有休付与・付与日数を追加
		 * @param {tsext.testAssist.Setting} entry
		 */
		addEmpTypeYuq: function(entry){
			var item2 = entry.getItem(1);
			try{
				if(item2 == 'DEFAULT'){
					this.empTypeYuqs.push({Year__c:0, Month__c:6, Provide__c:10, Days__c:0, Suffix__c:'0'});
					this.empTypeYuqs.push({Year__c:1, Month__c:6, Provide__c:11, Days__c:0, Suffix__c:'0'});
					this.empTypeYuqs.push({Year__c:2, Month__c:6, Provide__c:12, Days__c:0, Suffix__c:'0'});
					this.empTypeYuqs.push({Year__c:3, Month__c:6, Provide__c:14, Days__c:0, Suffix__c:'0'});
					this.empTypeYuqs.push({Year__c:4, Month__c:6, Provide__c:16, Days__c:0, Suffix__c:'0'});
					this.empTypeYuqs.push({Year__c:5, Month__c:6, Provide__c:18, Days__c:0, Suffix__c:'0'});
					this.empTypeYuqs.push({Year__c:6, Month__c:6, Provide__c:20, Days__c:0, Suffix__c:'1'});
				}else{
					var year    = this.getInteger(entry.getItem(1));
					var month   = this.getInteger(entry.getItem(2));
					var provide = this.getInteger(entry.getItem(3));
					this.empTypeYuqs.push({
						Year__c: year,
						Month__c: month,
						Provide__c: provide,
						Days__c: 0,
						Suffix__c: '0'
					});
				}
			}catch(e){
				this.addNgElement(entry, e);
			}
		},
		getEmpType: function(flag){
			var obj = lang.clone(this.empType);
			if(flag){
				obj.Config__c = Util.toJson(obj.Config__c);
			}
			return obj;
		},
		getConfigBase: function(flag){
			var obj = lang.clone(this.configBase);
			return obj;
		},
		getEmpTypeHolidays: function(){
			var objs = lang.clone(this.empTypeHolidays);
			return objs;
		},
		getEmpTypePatterns: function(){
			var objs = lang.clone(this.empTypePatterns);
			return objs;
		},
		getEmpTypeYuqs: function(border){
			this.empTypeYuqs = this.empTypeYuqs.sort(function(a, b){
				if(a.Year__c == b.Year__c){
					return a.Month__c - b.Month__c;
				}
				return a.Month__c - b.Month__c;
			});
			for(var i = 0 ; i < this.empTypeYuqs.length ; i++){
				var empTypeYuq = this.empTypeYuqs[i];
				empTypeYuq.Days__c = (border < 0 ? -1 : 0);
				empTypeYuq.Suffix__c = (i < (this.empTypeYuqs.length - 1) ? '0' : '1');
			}
			var objs = lang.clone(this.empTypeYuqs);
			return objs;
		},
		/**
		 * 勤務体系を入力
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			bagged.outputLog(this.getEntryName());
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			var empType = this.getEmpType(true);
			var req;
			if(this.isDelete()){
				req = {
					action: 'operateTestAssist',
					operateType: 'deleteEmpType',
					empTypeId: this.empTypeId
				};
			}else{
				req = {
					action: 'operateTestAssist',
					operateType: 'settingEmpType',
					empType: empType,
					configBase: this.getConfigBase(true),
					config: this.getConfig(true),
					empTypeHolidays: this.getEmpTypeHolidays(),
					empTypePatterns: this.getEmpTypePatterns(),
					empTypeYuqs: this.getEmpTypeYuqs(empType.workingDaysBorder),
				};
			}
			var chain = Current.request(req, bagged).then(
				lang.hitch(this, function(result){
					var resultObj = null;
					if(result && result.empType){
						resultObj = {
							result: 0,
							name: str.substitute('【勤務体系】${0}', [result.empType.Name]),
							href: tsCONST.empTypeEditView + '?empTypeId=' + result.empType.Id
						};
					}
					return bagged.stayResult(resultObj);
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(this, function(bagged){
				if(bagged.stopped()){
					return;
				}
				Current.fetchMaster(bagged.getDistributor(), ['empTypes']).then(
					lang.hitch(this, function(){
						bagged.doneResult();
					}),
					lang.hitch(this, function(errmsg){
						bagged.doneResult(this.addError(errmsg));
					})
				);
			}));
		}
	});
});
