define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/util/Util"
], function(declare, lang, json, array, Util) {
	return declare("tsext.configDownload.ConfigDownloadPattern", null, {
		constructor: function(record){
			this.pattern = record;
		},
		getId:					function(){ return this.pattern.Id; },
		getName:				function(){ return this.pattern.Name; },
		getCreatedDate:			function(){ return this.pattern.CreatedDate; },
		getCreatedById:			function(){ return this.pattern.CreatedById; },
		getCreatedByName:		function(){ return this.pattern.CreatedBy.Name; },
		getLastModifiedDate:	function(){ return this.pattern.LastModifiedDate; },
		getLastModifiedById:	function(){ return this.pattern.LastModifiedById; },
		getLastModifiedByName:	function(){ return this.pattern.LastModifiedBy.Name; },
		getOwnerId:				function(){ return this.pattern.OwnerId; },
		getOwnerName:			function(){ return this.pattern.Owner.Name; },
		getOwnerIsActive:		function(){ return this.pattern.Owner.IsActive; },
		isCopy:					function(){ return (this.pattern.OriginalId__c ? true : false); },
		getOriginalId:			function(){ return this.pattern.OriginalId__c || ''; },
		// 削除フラグ
		isRemoved: function(){
			return this.pattern.Removed__c || false;
		},
		// 始業時刻
		getStdStartTime: function(){
			return Util.formatTime(this.pattern.StdStartTime__c);
		},
		// 終業時刻
		getStdEndTime: function(){
			return Util.formatTime(this.pattern.StdEndTime__c);
		},
		// 所定労働時間
		getStandardFixTime: function(){
			return Util.formatTime(this.pattern.StandardFixTime__c);
		},
		// 時間範囲をカンマ区切りにする
		formatTimeRanges: function(times){
			var times = (times || '').split(/,/);
			var rests = [];
			array.forEach(times, function(ts){
				var t = ts.split(/-/);
				if(t.length == 2){
					var st = Util.formatTime(t[0].trim());
					var et = Util.formatTime(t[1].trim());
					rests.push(st + '-' + et);
				}
			});
			return rests.join(',');
		},
		// 休憩
		getRestTimes: function(){
			return this.formatTimeRanges(this.pattern.RestTimes__c);
		},
		//-------------------------------------
		// 半日休暇取得可
		isUseHalfHoliday: function(){
			return this.pattern.UseHalfHoliday__c || false;
		},
		// 午前半休開始時刻
		getAmHolidayStartTime: function(){
			return Util.formatTime(this.pattern.AmHolidayStartTime__c);
		},
		// 午前半休終了時刻
		getAmHolidayEndTime: function(){
			return Util.formatTime(this.pattern.AmHolidayEndTime__c);
		},
		// 午後半休開始時刻
		getPmHolidayStartTime: function(){
			return Util.formatTime(this.pattern.PmHolidayStartTime__c);
		},
		// 午後半休終了時刻
		getPmHolidayEndTime: function(){
			return Util.formatTime(this.pattern.PmHolidayEndTime__c);
		},
		// 半休取得時の休憩時間を適用する
		isUseHalfHolidayRestTime: function(){
			return this.pattern.UseHalfHolidayRestTime__c || false;
		},
		// 午前半休時休憩時間
		getAmHolidayRestTimes: function(){
			return this.formatTimeRanges(this.pattern.AmHolidayRestTimes__c);
		},
		// 午後半休時休憩時間
		getPmHolidayRestTimes: function(){
			return this.formatTimeRanges(this.pattern.PmHolidayRestTimes__c);
		},
		// 深夜労働割増
		isUseNightCharge: function(){
			return !this.pattern.IgonreNightWork__c;
		},
		// 裁量労働を採用
		isUseDiscretionary: function(){
			return this.pattern.UseDiscretionary__c || false;
		},
		// 対象期間
		getRange: function(){
			var v = this.pattern.Range__c || '';
			switch(v){
			case '1': return '短期';
			case '2': return '長期';
			default:  return '';
			}
		},
		// 略称
		getSymbol: function(){
			return this.pattern.Symbol__c || '';
		},
		// 平日勤務で所定時間の変更を禁止する
		isProhibitChangeWorkTime: function(){
			return this.pattern.ProhibitChangeWorkTime__c || false;
		},
		// 休日出勤で所定時間の変更を禁止する
		isProhibitChangeHolidayWorkTime: function(){
			return this.pattern.ProhibitChangeHolidayWorkTime__c || false;
		},
		// 休日の振替勤務日で所定時間の変更を禁止する
		isProhibitChangeExchangedWorkTime: function(){
			return this.pattern.ProhibitChangeExchangedWorkTime__c || false;
		},
		// シフト時刻と所定勤務時間を連動させる
		isWorkTimeChangesWithShift: function(){
			return this.pattern.WorkTimeChangesWithShift__c || false;
		},
		// シフト始業時刻と所定休・半休を連動させる
		isEnableRestTimeShift: function(){
			return this.pattern.EnableRestTimeShift__c || false;
		},
		// コア時間帯を使用しない
		isDisableCoreTime: function(){
			return this.pattern.DisableCoreTime__c || false;
		},
		// 並び順
		getOrder: function(flag){
			return (flag || typeof(this.pattern.Order__c) == 'number' ? (this.pattern.Order__c || 0) : '');
		}
	});
});
