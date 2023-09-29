define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/util/Util"
], function(declare, lang, json, array, Util) {
	return declare("tsext.configDownload.ConfigDownloadHoliady", null, {
		constructor: function(record){
			this.holiday = record;
			if(this.holiday.Config__c){
				this.holiday.config = Util.fromJson(this.holiday.Config__c);
			}
		},
		getId:					function(){ return this.holiday.Id; },
		getName:				function(){ return this.holiday.Name; },
		getCreatedDate:			function(){ return this.holiday.CreatedDate; },
		getCreatedById:			function(){ return this.holiday.CreatedById; },
		getCreatedByName:		function(){ return this.holiday.CreatedBy.Name; },
		getLastModifiedDate:	function(){ return this.holiday.LastModifiedDate; },
		getLastModifiedById:	function(){ return this.holiday.LastModifiedById; },
		getLastModifiedByName:	function(){ return this.holiday.LastModifiedBy.Name; },
		getOwnerId:				function(){ return this.holiday.OwnerId; },
		getOwnerName:			function(){ return this.holiday.Owner.Name; },
		getOwnerIsActive:		function(){ return this.holiday.Owner.IsActive; },
		isCopy:					function(){ return (this.holiday.OriginalId__c ? true : false); },
		getOriginalId:			function(){ return this.holiday.OriginalId__c || ''; },
		// 削除フラグ
		isRemoved: function(){
			return this.holiday.Removed__c || false;
		},
		// 種類
		getType: function(){
			var v = this.holiday.Type__c || '';
			switch(v){
			case '1': return '有給';
			case '2': return '無給';
			case '3': return '代休';
			default: return '';
			}
		},
		// 範囲
		getRange: function(){
			var v = this.holiday.Range__c || '';
			switch(v){
			case '1': return '終日休';
			case '2': return '午前半休';
			case '3': return '午後半休';
			case '4': return '時間単位休';
			default: return '';
			}
		},
		// 略称
		getSymbol: function(){
			return this.holiday.Symbol__c || '';
		},
		// 有休消化
		isYuqSpend: function(){
			return this.holiday.YuqSpend__c || false;
		},
		// 出勤率判定
		isWorking: function(){
			return this.holiday.IsWorking__c || false;
		},
		// 暦日表示
		isDisplayDaysOnCalendar: function(){
			return this.holiday.DisplayDaysOnCalendar__c || false;
		},
		// 前日の勤務：24時を超える勤務を禁止する
		isProhibitOverNightWork: function(){
			var c = this.holiday.config;
			return (c && c.prohibitOverNightWork) || false;
		},
		// 日数管理
		isManaged: function(){
			return this.holiday.Managed__c || false;
		},
		// 管理名
		getManageName: function(){
			return this.holiday.ManageName__c || '';
		},
		// 大分類に設定
		isSummaryRoot: function(){
			return this.holiday.IsSummaryRoot__c || false;
		},
		// 大分類名
		getSummaryName: function(){
			return this.holiday.SummaryName__c || '';
		},
		// 連携時の休暇番号
		getLinkNumber: function(){
			return this.holiday.LinkNumber__c || '';
		},
		// 集計コード
		getSummaryCode: function(){
			return this.holiday.SummaryCode__c || '';
		},
		// 説明
		getDescription: function(){
			return this.holiday.Description__c || '';
		},
		// 計画付与有休
		getPlannedHoliday: function(){
			return this.holiday.PlannedHoliday__c || false;
		},
		// 並び順
		getOrder: function(flag){
			return (flag || typeof(this.holiday.Order__c) == 'number' ? (this.holiday.Order__c || 0) : '');
		}
	});
});
