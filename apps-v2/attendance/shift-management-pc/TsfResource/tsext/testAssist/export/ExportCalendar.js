define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤怠カレンダー
	return declare("tsext.testAssist.ExportCalendar", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 */
		constructor: function(manager, obj){
			this.obj.Date__c = Util.formatDate(this.obj.Date__c);
			this.all = [this];
		},
		getDate: function(){
			return this.obj.Date__c;
		},
		/**
		 * 同一日のカレンダーを追加
		 * @param {tsext.testAssist.ExportCalendar} obj
		 */
		addCalendar: function(obj){
			this.all.push(obj);
		},
		isPriority: function(){
			return (this.obj.Priority__c == '1');
		},
		isCommon: function(){
			return (this.obj.EmpTypeId__c ? false : true);
		},
		getEmpType: function(){
			return (this.obj.EmpTypeId__c ? this.manager.getEmpTypeById(this.obj.EmpTypeId__c) : null);
		},
		getPatternId: function(){
			return this.obj.PatternId__c || null;
		},
		getPattern: function(){
			return (this.obj.PatternId__c ? this.manager.getPatternById(this.obj.PatternId__c) : null);
		},
		getDayType: function(flag){
			var v = this.obj.Type__c;
			if(flag){
				switch(v){
				case '1': return '休日';
				case '2': return '法定休日';
				case '3': return '祝日';
				default : return '平日';
				}
			}
			return v;
		},
		getEvent: function(){
			return this.obj.Event__c || '';
		},
		/**
		 * 共通（勤務体系に紐づかない）カレンダーを返す
		 * @returns {tsext.testAssist.ExportCalendar}
		 */
		 getCommonCalendar: function(){
			for(var i = 0 ; i < this.all.length ; i++){
				var c = this.all[i];
				if(c.isCommon()){
					return c;
				}
			}
			return null;
		},
		/**
		 * 勤務体系に紐づくカレンダーを返す
		 * @returns {Array.<tsext.testAssist.ExportCalendar>}
		 */
		getEmpTypeCalendars: function(){
			var cs = [];
			for(var i = 0 ; i < this.all.length ; i++){
				var c = this.all[i];
				if(!c.isCommon()){
					cs.push(c);
				}
			}
			return cs;
		},
		/**
		 * カレンダーをエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {Object} empTypeMap
		 * @returns {Array.<string>}
		 */
		 outputExportCalendar: function(lst, visit, empTypeMap){
			var cc = this.getCommonCalendar(); // 同日の共通カレンダーを得る
			var pushed = {};
			if(!cc || !cc.isPriority()){ // 同日に共通カレンダーなし、または優先低
				var ecs = this.getEmpTypeCalendars();
				for(var i = 0 ; i < ecs.length ; i++){
					var ec = ecs[i];
					var empType = ec.getEmpType();
					if(!empTypeMap[empType.getId()]){
						continue;
					}
					pushed[empType.getId()] = 1;
					var p = this.getPattern();
					this.L(lst, [
						Constant.KEY_SETTING, // 設定
						Constant.KEY_CALENDAR, // カレンダー
						Constant.OPTION_NEW, // 新規
						ec.getDate(), // 日付
						ec.getDayType(true), // 種別
						ec.getEvent(), // イベント
						empType.getName(), // 勤務体系
						(p ? p.getName() : '') // 勤務パターン
					]);
				}
			}
			if(cc){ // 共通のカレンダー
				// 勤務体系別カレンダーに変換
				for(empTypeId in empTypeMap){
					if(pushed[empTypeId]){
						continue;
					}
					var empType = empTypeMap[empTypeId];
					this.L(lst, [
						Constant.KEY_SETTING, // 設定
						Constant.KEY_CALENDAR, // カレンダー
						Constant.OPTION_NEW, // 新規
						cc.getDate(), // 日付
						cc.getDayType(true), // 種別
						cc.getEvent(), // イベント
						empType.getName() // 勤務体系
					]);
				}
			}
			return lst;
		}
	});
});
