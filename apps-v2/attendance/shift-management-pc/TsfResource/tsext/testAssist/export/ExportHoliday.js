define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤怠休暇
	return declare("tsext.testAssist.ExportHoliday", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 * @param {tsext.testAssist.ExportObjs=} parent
		 */
		constructor: function(manager, obj, parent){
		},
		isPlannedHoliday: function(){
			return this.obj.PlannedHoliday__c || false;
		},
		isTimeHoliday: function(){
			return (this.obj.Range__c == '4');
		},
		isCopy: function(){
			return (this.obj.OriginalId__c ? true : false);
		},
		getOriginalId: function(){
			return this.obj.OriginalId__c || null;
		},
		getType: function(){
			var type = '';
			switch(this.obj.Type__c){
			case '1': type = '有給'; break;
			case '2': type = '無給'; break;
			case '3': type = '代休'; break;
			}
			return type;
		},
		getRange: function(){
			var range = '';
			switch(this.obj.Range__c){
			case '1': range = '終日休'; break;
			case '2': range = '午前半休'; break;
			case '3': range = '午後半休'; break;
			case '4': range = '時間単位休'; break;
			}
			return range;
		},
		isManaged: function(){
			return this.obj.Managed__c || false;
		},
		/**
		 * 日数管理休暇の管理名を返す
		 * @param {boolean=} flag true:オリジナルの管理名, false:プレフィックスつきの管理名
		 * @returns 
		 */
		getManageName: function(flag){
			if(this.obj.Managed__c && this.obj.ManageName__c){
				return (!flag ? this.manager.getNamePrefix() : '') + this.obj.ManageName__c;
			}
			return null;
		},
		getDescription: function(){
			return (this.obj.Description__c || '').split(/\r?\n/).join('\\n');
		},
		/**
		 * 勤怠休暇をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @returns {Array.<string>}
		 */
		 outputExportHoliday: function(lst, visit){
			var heads = [Constant.KEY_SETTING, Constant.KEY_HOLIDAY]; // 設定,休暇
			this.L(lst, [Constant.OPTION_NEW, this.getName()], heads); // 新規,{休暇名}
			this.outputExportHolidayImpl({
				lst   : lst,
				head  : heads.concat(''),
				org   : this.parent.getDefaultHoliday(),
				seize : []
			});
			this.L(lst, [Constant.OPTION_END], heads); // 終了
			return lst;
		},
		outputExportHolidayImpl: function(cpx){
			this.P(cpx, Constant.SET_TYPE                   , null, 'getType'                                            ); // 種類
			this.P(cpx, Constant.SET_RANGE                  , null, 'getRange'                                           ); // 範囲
			this.P(cpx, Constant.SET_YUQ_SPEND              , 'YuqSpend__c'                                              ); // 有休消化
			this.P(cpx, Constant.SET_IS_WORKING             , 'IsWorking__c'                                             ); // 出勤率判定
			this.P(cpx, Constant.SET_DISP_ON_CALENDAR       , 'DisplayDaysOnCalendar__c'                                 ); // 暦日表示
			this.P(cpx, Constant.SET_HOLIDAY_TIME_UNIT      , 'TimeUnit__c'                                              ); // 休暇時間制限単位
			this.P(cpx, Constant.SET_MANAGED                , 'Managed__c'                                               ); // 日数管理
			this.P(cpx, Constant.SET_MANAGE_NAME            , null, 'getManageName'                                      ); // 管理名
			this.P(cpx, Constant.SET_SYMBOL                 , 'Symbol__c'                                                ); // 略称
			this.P(cpx, Constant.SET_SUMMARY_CODE           , 'SummaryCode__c'                                           ); // 集計コード
			this.P(cpx, Constant.SET_SUMMARY_ROOT           , 'IsSummaryRoot__c'                                         ); // 大分類に設定
			this.P(cpx, Constant.SET_SUMMARY_NAME           , 'SummaryName__c'                                           ); // 大分類名
			this.P(cpx, Constant.SET_LINK_NUMBER            , 'LinkNumber__c'                                            ); // 連携時の休暇番号
			this.P(cpx, Constant.SET_DESCRIPTION            , null, 'getDescription'                                     ); // 説明
			this.P(cpx, Constant.SET_PLANNED_HOLIDAY        , 'PlannedHoliday__c'                                        ); // 計画付与
			this.P(cpx, Constant.SET_REMOVED                , 'Removed__c'                                               ); // 無効
			return cpx.lst;
		}
	});
});
