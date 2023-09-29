define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, Constant, Util){
	// 勤務場所
	return declare("tsext.testAssist.ExportWorkLocation", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 * @param {tsext.testAssist.ExportObjs=} parent
		 */
		constructor: function(manager, obj, parent){
		},
		getCountTarget: function(){
			if(this.getOfficeDays() == 1 && this.getHomeDays() == 0){
				return Constant.SET_CT_OFFICE.name; // 出社
			}else if(this.getOfficeDays() == 0 && this.getHomeDays() == 1){
				return Constant.SET_CT_HOME.name; // テレワーク
			}else if(this.getOfficeDays() == 1 && this.getHomeDays() == 1){
				return Constant.SET_CT_OFFICE_HOME.name; // 出社・テレワーク
			}else{
				return Constant.SET_CT_OUT_OF_SCOPE.name; // 対象外
			}
		},
		getOfficeDays: function(){
			return this.obj.OfficeDays__c || 0;
		},
		getHomeDays: function(){
			return this.obj.HomeDays__c || 0;
		},
		getWorkLocationCode: function(){
			return this.obj.WorkLocationCode__c || '';
		},
		isRemoved: function(){
			return this.obj.Removed__c || false;
		},
		/**
		 * 勤務場所をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @returns {Array.<string>}
		 */
		 outputExportWorkLocation: function(lst, visit){
			this.L(lst, [
				Constant.KEY_SETTING, // 設定
				Constant.KEY_WORK_LOCATION, // 勤務場所
				Constant.OPTION_NEW, // 新規
				this.getName(),
				this.getCountTarget(),
				(this.isRemoved() ? this.Bool(true) : ''),
				this.getWorkLocationCode()
			]);
			return lst;
		}
	});
});
