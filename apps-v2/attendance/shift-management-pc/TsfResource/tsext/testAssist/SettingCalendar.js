define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/EntryBase1",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/TsError",
	"tsext/util/Util"
], function(declare, lang, array, str, EntryBase1, Current, Constant, TsError, Util){
	// 勤怠カレンダー
	return declare("tsext.testAssist.SettingCalendar", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor: function(args, lineNo){
			this.alone = true;
			this.calendar = this.getDefaultCalendar();
			try {
				this.calendar.Date__c = this.getDate(this.getItem(0));
				var v = this.getItem(1);
				var tp = null;
				if(v){
					if(v == '平日' || v == '0'){
						tp = 0;
					}else if(v == '休日' || v == '所定休日' || v == '1'){
						tp = 1;
					}else if(v == '法定休日' || v == '2'){
						tp = 2;
					}else if(v == '祝日' || v == '3'){
						tp = 3;
					}else if(v == '有休計画付与日' || v == '4'){
						tp = 0;
						this.calendar.PlannedHoliday__c = true;
					}else{
						this.addError(Constant.ERROR_UNDEFINED); // 未定義
					}
					this.calendar.Type__c = (tp !== null ? '' + tp : null);
				}else{
					this.calendar.Type__c = null;
				}
				this.calendar.Event__c = this.getItem(2);
				var pr = this.getBoolean(this.getItem(5), true);
				this.calendar.Priority__c = (pr ? '1' : '0');
				if(this.getOption() != Constant.OPTION_NEW && this.getOption() != Constant.OPTION_DELETE){
					this.addError(Constant.ERROR_UNDEFINED); // 未定義
				}
			}catch(e){
				this.addError(e.getErrorLevel(), e.getMessage());
			}
		},
		/**
		 * 入力直前のチェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			var empTypeName = this.getItem(3);
			var patternName = this.getItem(4);
			try {
				this.calendar.EmpTypeId__c = (empTypeName ? Current.getIdByName('empTypes', empTypeName) : null);
				this.calendar.PatternId__c = (patternName ? Current.getIdByName('patterns', patternName) : null);
			}catch(e){
				if(this.isDelete()){
					this.addError(Constant.ERROR_LEVEL_1, e.getMessage());
				}else{
					this.addError(e.getErrorLevel(), e.getMessage());
				}
			}
			return this.inherited(arguments);
		},
		getCalendar: function(flag){
			var obj = lang.clone(this.calendar);
			return obj;
		},
		getDefaultCalendar: function(){
			return {
				Date__c: null,				// 日付
				Type__c: null,				// 種別
				Event__c: null,				// イベント
				EmpTypeId__c: null,			// 勤務体系
				PatternId__c: null,			// 勤務パターン
				Priority__c: '0',			// 優先
				PlannedHoliday__c: false,	// 有休計画付与日
				Note__c: null,
				DeptId__c: null,
				ShiftPlan__c: null
			};
		},
		/**
		 * カレンダーを設定
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			bagged.outputLog(this.getEntryName());
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			var req;
			if(this.isDelete()){
				req = {
					action: 'operateTestAssist',
					operateType: 'deleteCalendar',
					calendar: this.getCalendar(true)
				};
			}else{
				req = {
					action: 'operateTestAssist',
					operateType: 'settingCalendar',
					calendar: this.getCalendar(true)
				};
			}
			var chain = Current.request(req, bagged).then(
				lang.hitch(this, function(result){
					var resultObj = null;
					if(result && result.calendar){
						resultObj = {
							result: 0,
							name: '【カレンダー】  ' + result.calendar.Name,
							href: '/' + result.calendar.Id
						};
					}
					return bagged.stayResult(resultObj);
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(bagged, bagged.doneResult));
		}
	});
});
