define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤務体系
	return declare("tsext.testAssist.ExportEmpType", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 */
		constructor: function(manager, obj, parent){
			this.stamp = this.obj.ConfigBaseId__r.InitialDateOfMonth__c
					+ '-' + this.obj.ConfigBaseId__r.MarkOfMonth__c
					+ '-' + this.obj.ConfigBaseId__r.InitialDateOfYear__c
					+ '-' + this.obj.ConfigBaseId__r.MarkOfYear__c
					+ '-' + this.obj.ConfigBaseId__r.InitialDayOfWeek__c;
			this.empTypePatterns = [];
			this.empTypeHolidays = [];
		},
		clearCollect: function(){
			this.empTypePatterns = [];
			this.empTypeHolidays = [];
		},
		getInitialDateOfYear  : function(){ return this.obj.ConfigBaseId__r.InitialDateOfYear__c; },
		getMarkOfYear         : function(){ return this.obj.ConfigBaseId__r.MarkOfYear__c; },
		getInitialDateOfMonth : function(){ return this.obj.ConfigBaseId__r.InitialDateOfMonth__c; },
		getMarkOfMonth        : function(){ return this.obj.ConfigBaseId__r.MarkOfMonth__c; },
		getInitialDayOfWeek   : function(){ return this.obj.ConfigBaseId__r.InitialDayOfWeek__c; },
		getMarkOfYearItem: function(){
			return (this.obj.ConfigBaseId__r.MarkOfYear__c == '1' ? '起算月に合わせる' : '締め月に合わせる');
		},
		getMarkOfMonthItem: function(){
			return (this.obj.ConfigBaseId__r.MarkOfMonth__c == '1' ? '起算日に合わせる' : '締め日に合わせる');
		},
		getInitialDayOfWeekItem: function(){
			var w = Util.parseInt(this.obj.ConfigBaseId__r.InitialDayOfWeek__c);
			return '日月火水木金土'.substring(w, w + 1);
		},
		getStamp: function(){
			return this.stamp;
		},
		calcYearMonth: function(d) {
			var dt = (typeof(d) == 'string' ? Util.parseDate(d) : d);
			var inid = Util.parseInt(this.getInitialDateOfMonth());
			var mark = Util.parseInt(this.getMarkOfMonth());
			var delta = 0;
			if(inid > dt.getDate()){
				delta = -1;
			}
			if(mark == 2){
				delta += 1;
			}
			var zd = new Date(dt.getFullYear(), dt.getMonth() + delta, dt.getDate());
			return zd.getFullYear() * 100 + (zd.getMonth() + 1);
		},
		getYmListOfYear: function(ym){
			var yms = [];
			var y = Math.floor(ym / 100);
			var m = ym % 100;
			if(m < this.inim){
				y--;
			}
			m = this.inim;
			while(yms.length < 12){
				yms.push(y * 100 + (m++));
				if(m > 12){
					y++;
					m = 1;
				}
			}
			return yms;
		},
		getConfigBaseId: function(){
			return this.obj.ConfigBaseId__c;
		},
		addEmpTypePattern: function(empTypePattern){
			this.empTypePatterns.push(empTypePattern);
		},
		addEmpTypeHoliday: function(empTypeHoliday){
			this.empTypeHolidays.push(empTypeHoliday);
		},
		sortEmpTypePatterns: function(){
			this.empTypePatterns = this.empTypePatterns.sort(function(a, b){
				return (a.getOrder() - b.getOrder());
			});
		},
		sortEmpTypeHolidays: function(){
			this.empTypeHolidays = this.empTypeHolidays.sort(function(a, b){
				return (a.getOrder() - b.getOrder());
			});
		},
		getPatternIds: function(){
			var ids = [];
			for(var x = 0 ; x < this.empTypePatterns.length ; x++){
				var empTypePattern = this.empTypePatterns[x];
				Util.mergeList(ids, empTypePattern.getPatternId());
			}
			return ids;
		},
		getHolidayIds: function(){
			var ids = [];
			for(var x = 0 ; x < this.empTypeHolidays.length ; x++){
				var empTypeHoliday = this.empTypeHolidays[x];
				Util.mergeList(ids, empTypeHoliday.getHolidayId());
			}
			return ids;
		},
		getConfigRevisions: function(){
			return this.manager.getConfigsByConfigBaseId(this.getConfigBaseId());
		},
		getTargetStockHoliday: function(){
			if(this.obj.EnableStockHoliday__c){
				return this.obj.TargetStockHoliday__c || '';
			}
			return '';
		},
		getHolidayByTargetStock: function(){
			if(this.obj.TargetStockHoliday__c){
				var holiday = this.manager.getHolidayByManageName(this.obj.TargetStockHoliday__c, true);
				if(holiday){
					return holiday.getManageName();
				}
			}
			return null;
		},
		/**
		 * 勤務体系をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {tsext.testAssist.ExportConfig} config
		 * @param {Array.<tsext.testAssist.ExportHoliday>} holidays
		 * @param {Array.<tsext.testAssist.ExportPattern>} patterns
		 * @returns {Array.<string>}
		 */
		 outputExportEmpType: function(lst, visit, config, holidays, patterns){
			var edge_heads = [Constant.KEY_SETTING, Constant.KEY_EMPTYPE]; // 設定,勤務体系
			this.L(lst, [Constant.OPTION_NEW, this.getName()], edge_heads); // 新規,{社員名}
			var heads = edge_heads.concat('');
			this.outputExportEmpTypeImpl({
				lst    : lst,
				head   : heads,
				org    : this.parent.getDefaultEmpType(),
				seize  : [
					Constant.SET_START_MONTH,
					Constant.SET_START_DATE,
					Constant.SET_START_DAYOFWEEK,
					Constant.SET_USE_DAIQ_MANAGE,
					Constant.SET_USE_HALF_DAIQ
				]
			}, visit, config);

			var comments = [];
			var holidayMap = {};
			// 勤務体系別休暇
			for(var i = 0 ; i < this.empTypeHolidays.length ; i++){
				var eth = this.empTypeHolidays[i];
				var holiday = this.manager.getHolidayById(eth.getHolidayId());
				this.L(lst, [Constant.SET_EMPTYPE_HOLIDAY.name, holiday.getName()], heads);
				holidayMap[holiday.getId()] = 1;
			}
			for(var i = 0 ; i < holidays.length ; i++){
				var holiday = holidays[i];
				if(!holidayMap[holiday.getId()]){
					this.L(lst, [Constant.SET_EMPTYPE_HOLIDAY.name, holiday.getName()], heads);
				}
			}
			var patternMap = {};
			// 勤務体系別パターン
			for(var i = 0 ; i < this.empTypePatterns.length ; i++){
				var etp = this.empTypePatterns[i];
				var pattern = this.manager.getPatternById(etp.getPatternId());
				var schedule = etp.getSchedule();
				this.L(lst, [Constant.SET_EMPTYPE_PATTERN.name, pattern.getName(), schedule], heads); // 勤務パターン
				patternMap[pattern.getId()] = 1;
			}
			for(var i = 0 ; i < patterns.length ; i++){
				var pattern = patterns[i];
				if(!patternMap[pattern.getId()]){
					this.L(lst, [Constant.SET_EMPTYPE_PATTERN.name, pattern.getName()], heads);
				}
			}

			// 有休自動付与
			var yuqOption = Util.parseInt(this.obj.YuqOption__c) || 0;
			var yo = 'しない';
			var yd = '';
			if(yuqOption){
				if(yuqOption == 2){
					yo = '指定日に定期付与';
					var yuqDate1 = this.obj.YuqDate1__c || 0;
					var m = Math.floor(yuqDate1 / 100);
					var d = yuqDate1 % 100;
					yd = ('' + m + '/' + d);
				}else{
					yo = '入社日基準';
				}
//				comments.push(this.getCommentLine('※勤務体系の有休自動付与「' + yo + (yd ? ('（' + yd + '）') : '') + '」→無効化'));
			}
			this.L(lst, [Constant.SET_LEAVE_PROVIDE_AUTO.name, 'しない'], heads); // 有休自動付与
			if(yuqOption == 2){
				this.L(lst, [Constant.SET_LEAVE_PROVIDE_DATE.name, yd], heads); // 指定日
			}
			var yuqs = this.obj.AtkEmpTypeYuqR1__r || [];
			var ika = 0, miman = 0;
			for(var i = 0 ; i < yuqs.length ; i++){
				var yuq = yuqs[i];
				if(yuq.Days__c == 0){ ika++; }else if(yuq.Days__c < 0){ miman++; }
			}
			this.L(lst, [Constant.SET_WORKING_DAYS_BORDER.name, (ika > 0 ? '以下' : '未満')], heads); // 継続勤務日数の範囲条件
			for(var i = 0 ; i < yuqs.length ; i++){
				var yuq = yuqs[i];
				this.L(lst, [Constant.SET_EMPTYPE_GRANTDAYS.name, yuq.Year__c, yuq.Month__c, yuq.Provide__c], heads); // 付与日数
			}
			if(this.obj.YuqAssignNoMessages__c){
				this.L(lst, [Constant.SET_LEAVE_PROVIDE_NOTICE.name, this.Bool(true)], heads); // 付与のお知らせ
			}

			this.L(lst, [Constant.OPTION_END], edge_heads); // 終了
			for(var i = 0 ; i < comments.length ; i++){
				lst.push(comments[i]);
			}
			return lst;
		},
		/**
		 * 勤務体系をエクスポート
		 * @param {{lst:{Array.<Object>}, head:{string}, org:{Object}, seize:{Array.<string|Object>}, allin:{boolean}}} cpx 
		 * @param {tsext.testAssist.ExportConfig} config
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @returns {Array.<string>}
		 */
		outputExportEmpTypeImpl: function(cpx, visit, config){
//			this.P(cpx, Constant.SET_EMPTYPE_CODE              , 'EmpTypeCode__c'                                      ); // 勤務体系コード
			config.outputExportConfig(cpx.lst, visit); // 基本設定
			this.P(cpx, Constant.SET_START_MONTH               , null, 'getInitialDateOfYear'                          ); // 起算月
			this.P(cpx, Constant.SET_YEAR_NOTATION             , null, 'getMarkOfYearItem'                             ); // 年度の表記
			this.P(cpx, Constant.SET_START_DATE                , null, 'getInitialDateOfMonth'                         ); // 起算日
			this.P(cpx, Constant.SET_MONTH_NOTATION            , null, 'getMarkOfMonthItem'                            ); // 月度の表記
			this.P(cpx, Constant.SET_START_DAYOFWEEK           , null, 'getInitialDayOfWeekItem'                       ); // 週の起算日
			// 積立休暇の設定
			this.P(cpx, Constant.SET_STOCK_HOLIDAY_ENABLE      , 'EnableStockHoliday__c'                               ); // 積立休暇設定
			this.P(cpx, Constant.SET_STOCK_HOLIDAY_TARGET      , null, 'getHolidayByTargetStock'                       ); // 積立休暇の選択
			this.P(cpx, Constant.SET_STOCK_MAX_DAYS_YEAR       , 'MaxStockHolidayPerYear__c'                           ); // 一回の積立日数
			this.P(cpx, Constant.SET_STOCK_MAX_DAYS            , 'MaxStockHoliday__c'                                  ); // 最大積立日数
			// 代休管理の設定
			this.P(cpx, Constant.SET_USE_DAIQ_MANAGE           , 'UseDaiqManage__c'                                    ); // 代休管理
			this.P(cpx, Constant.SET_USE_HALF_DAIQ             , 'UseHalfDaiq__c'                                      ); // 半日代休
			this.P(cpx, Constant.SET_DAIQ_ALL_BORDER           , 'DaiqAllBorderTime__c' , 'formatTime'                 ); // 終日代休可
			this.P(cpx, Constant.SET_DAIQ_HALF_BORDER          , 'DaiqHalfBorderTime__c', 'formatTime'                 ); // 半日代休可
			this.P(cpx, Constant.SET_DAIQ_LIMIT                , 'DaiqLimit__c'                                        ); // 代休の有効期間
			this.P(cpx, Constant.SET_DAIQ_RESERVE              , 'UseDaiqReserve__c'                                   ); // 申請時に代休有無を指定
			this.P(cpx, Constant.SET_DAIQ_LEGAL_HOLIDAY        , 'UseDaiqLegalHoliday__c'                              ); // 法定休日出勤の代休可
			this.P(cpx, Constant.SET_REGULATE_HOLIDAY          , 'UseRegulateHoliday__c'                               ); // 休日出勤の勤怠規則は平日に準拠
			this.P(cpx, Constant.SET_NO_DAIQ_EXCHANGED         , 'NoDaiqExchanged__c'                                  ); // 振替休日に出勤した場合は代休不可
			// 残業警告の設定
			if(!config.isWorkSystemManager()){
				this.P(cpx, Constant.SET_OVERTIME_MONTH_MAX        , 'OverTimeMonthLimit__c' , 'formatTime'                ); // 月間残業時間上限
				this.P(cpx, Constant.SET_OVERTIME_MONTH_WARN1      , 'OverTimeMonthAlert1__c', 'formatTime'                ); // 月間残業時間警告1
				this.P(cpx, Constant.SET_OVERTIME_MONTH_WARN2      , 'OverTimeMonthAlert2__c', 'formatTime'                ); // 月間残業時間警告2
				this.P(cpx, Constant.SET_OVERTIME_MONTH_WARN3      , 'OverTimeMonthAlert3__c', 'formatTime'                ); // 月間残業時間警告3
				this.P(cpx, Constant.SET_OVERTIME_QTR_MAX          , 'OverTimeQuartLimit__c' , 'formatTime'                ); // 4半期残業時間上限
				this.P(cpx, Constant.SET_OVERTIME_QTR_WARN1        , 'OverTimeQuartAlert1__c', 'formatTime'                ); // 4半期残業時間警告1
				this.P(cpx, Constant.SET_OVERTIME_QTR_WARN2        , 'OverTimeQuartAlert2__c', 'formatTime'                ); // 4半期残業時間警告2
				this.P(cpx, Constant.SET_OVERTIME_YEAR_MAX         , 'OverTimeYearLimit__c'  , 'formatTime'                ); // 年間残業時間上限
				this.P(cpx, Constant.SET_OVERTIME_YEAR_WARN1       , 'OverTimeYearAlert1__c' , 'formatTime'                ); // 年間残業時間警告1
				this.P(cpx, Constant.SET_OVERTIME_YEAR_WARN2       , 'OverTimeYearAlert2__c' , 'formatTime'                ); // 年間残業時間警告2
				this.P(cpx, Constant.SET_OVERTIME_COUNT_MAX        , 'OverTimeCountLimit__c' ,                             ); // 残業超過回数上限
				this.P(cpx, Constant.SET_OVERTIME_COUNT_WARN1      , 'OverTimeCountAlert__c' ,                             ); // 残業超過回数警告1
			}
		}
	});
});
