define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/configDownload/ConfigDownloadConfig",
	"tsext/util/Util"
], function(declare, lang, json, array, ConfigDownloadConfig, Util) {
	return declare("tsext.configDownload.ConfigDownloadEmpType", null, {
		constructor: function(record, logic){
			this.empType = record;
			this.configBases = logic.getConfigBaseById(this.getConfigBaseId());
			var configs = logic.getConfigsByBaseId(this.getConfigBaseId());
			this.configList = [];
			for(var i = 0 ; i < configs.length ; i++){
				this.configList.push(new ConfigDownloadConfig(configs[i], logic));
			}
			this.empTypeHolidayCount = logic.getEmpTypeHolidayCount(this.getId());
			this.empTypePatternCount = logic.getEmpTypePatternCount(this.getId());
			this.empTypeYuqs = logic.getEmpTypeYuqs(this.getId());
		},
		getConfigList:			function(){ return this.configList; },
		getConfigBaseId:		function(){ return this.empType.ConfigBaseId__c; },
		getId:					function(){ return this.empType.Id; },
		getName:				function(){ return this.empType.Name; },
		getEmpTypeCode:			function(){ return this.empType.EmpTypeCode__c || ''; },
		getCreatedDate:			function(){ return this.empType.CreatedDate; },
		getCreatedById:			function(){ return this.empType.CreatedById; },
		getCreatedByName:		function(){ return this.empType.CreatedBy.Name; },
		getLastModifiedDate:	function(){ return this.empType.LastModifiedDate; },
		getLastModifiedById:	function(){ return this.empType.LastModifiedById; },
		getLastModifiedByName:	function(){ return this.empType.LastModifiedBy.Name; },
		getOwnerId:				function(){ return this.empType.OwnerId; },
		getOwnerName:			function(){ return this.empType.Owner.Name; },
		getOwnerIsActive:		function(){ return this.empType.Owner.IsActive; },
		// 削除フラグ
		isRemoved: function(){
			return this.empType.Removed__c || false;
		},
		// 選択可能な休暇数
		getEmpTypeHolidayCount: function(){
			return this.empTypeHolidayCount;
		},
		// 選択可能な勤務パターン数
		getEmpTypePatternCount: function(){
			return this.empTypePatternCount;
		},
		//-------------------------------------
		getConfigBaseCreatedDate:		function(){ return this.configBases[0].CreatedDate; },
		getConfigBaseCreatedById:		function(){ return this.configBases[0].CreatedById; },
		getConfigBaseCreatedByName:		function(){ return this.configBases[0].CreatedBy.Name; },
		getConfigBaseLastModifiedDate:	function(){ return this.configBases[0].LastModifiedDate; },
		getConfigBaseLastModifiedById:	function(){ return this.configBases[0].LastModifiedById; },
		getConfigBaseLastModifiedByName:function(){ return this.configBases[0].LastModifiedBy.Name; },
		getConfigBaseOwnerId:			function(){ return this.configBases[0].OwnerId; },
		getConfigBaseOwnerName:			function(){ return this.configBases[0].Owner.Name; },
		getConfigBaseOwnerIsActive:		function(){ return this.configBases[0].Owner.IsActive; },
		// 年度の起算月
		getInitMonth: function(){
			return this.configBases[0].InitialDateOfYear__c || '';
		},
		// 年度の表記
		getMarkOfYear: function(){
			var v = this.configBases[0].MarkOfYear__c || '';
			return (v == '2' ? '締め月に合わせる' : '起算月に合わせる');
		},
		// 月度の起算日
		getInitDate: function(){
			return this.configBases[0].InitialDateOfMonth__c || '';
		},
		// 月度の表記
		getMarkOfMonth: function(){
			var v = this.configBases[0].MarkOfMonth__c || '';
			return (v == '2' ? '締め日に合わせる' : '起算日に合わせる');
		},
		// 週の起算日
		getInitWeek: function(){
			var v = this.configBases[0].InitialDayOfWeek__c || '';
			var x = /[0-6]/.test(v) ? parseInt(v) : -1;
			return (x >= 0 ? '日月火水木金土'.substring(x, x + 1) : '');
		},
		//-------------------------------------
		// 積立休暇：有効（失効した有給休暇を積立休暇として積立てる）
		isEnableStockHoliday: function(){
			return this.empType.EnableStockHoliday__c || false;
		},
		// 積立休暇：積立休暇の選択
		getTargetStockHoliday: function(){
			return this.empType.TargetStockHoliday__c || '';
		},
		// 積立休暇：一回の積立日数
		getMaxStockHolidayPerYear: function(){
			var n = this.empType.MaxStockHolidayPerYear__c;
			return (typeof(n) == 'number' ? n : '');
		},
		// 積立休暇：最大積立日数
		getMaxStockHoliday: function(){
			var n = this.empType.MaxStockHoliday__c;
			return (typeof(n) == 'number' ? n : '');
		},
		//-------------------------------------
		// 代休管理：
		isUseDaiqManage: function(){
			return this.empType.UseDaiqManage__c || false;
		},
		// 代休管理：半日代休
		isUseHalfDaiq: function(){
			return this.empType.UseHalfDaiq__c || false;
		},
		// 代休管理：終日代休可能労働時間
		getDaiqAllBorderTime: function(){
			var t = this.empType.DaiqAllBorderTime__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 代休管理：半日代休可能労働時間
		getDaiqHalfBorderTime: function(){
			var t = this.empType.DaiqHalfBorderTime__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 代休管理：代休の有効期限
		getDaiqLimit: function(){
			var n = this.empType.DaiqLimit__c;
			if(typeof(n) == 'number'){
				if(n == 1){
					return '翌月度内';
				}else if(n > 1){
					return n + 'ヶ月後まで';
				}
			}
			return '当月度内';
		},
		// 代休管理：申請時に代休有無を指定
		isUseDaiqReserve: function(){
			return this.empType.UseDaiqReserve__c || false;
		},
		// 代休管理：法定休日出勤の代休可
		isUseDaiqLegalHoliday: function(){
			return this.empType.UseDaiqLegalHoliday__c || false;
		},
		// 代休管理：休日出勤の勤怠規則は平日に準拠する
		isUseRegulateHoliday: function(){
			return this.empType.UseRegulateHoliday__c || false;
		},
		// 代休管理：振替休日に出勤した場合は代休不可
		isNoDaiqExchanged: function(){
			return this.empType.NoDaiqExchanged__c || false;
		},
		//-------------------------------------
		// 月間残業時間：上限
		getOverTimeMonthLimit: function(){
			var t = this.empType.OverTimeMonthLimit__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 月間残業時間：警告１
		getOverTimeMonthAlert1: function(){
			var t = this.empType.OverTimeMonthAlert1__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 月間残業時間：警告２
		getOverTimeMonthAlert2: function(){
			var t = this.empType.OverTimeMonthAlert2__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 月間残業時間：警告３
		getOverTimeMonthAlert3: function(){
			var t = this.empType.OverTimeMonthAlert3__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 4半期残業時間：上限
		getOverTimeQuartLimit: function(){
			var t = this.empType.OverTimeQuartLimit__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 4半期残業時間：警告１
		getOverTimeQuartAlert1: function(){
			var t = this.empType.OverTimeQuartAlert1__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 4半期残業時間：警告２
		getOverTimeQuartAlert2: function(){
			var t = this.empType.OverTimeQuartAlert2__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 年間残業時間：上限
		getOverTimeYearLimit: function(){
			var t = this.empType.OverTimeYearLimit__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 年間残業時間：警告１
		getOverTimeYearAlert1: function(){
			var t = this.empType.OverTimeYearAlert1__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 年間残業時間：警告２
		getOverTimeYearAlert2: function(){
			var t = this.empType.OverTimeYearAlert2__c;
			return (typeof(t) == 'number' ? Util.formatTime(t) : '');
		},
		// 月間残業時間の超過回数：上限
		getOverTimeCountLimit: function(){
			var n = this.empType.OverTimeCountLimit__c;
			return (typeof(n) == 'number' ? n : '');
		},
		// 月間残業時間の超過回数：警告
		getOverTimeCountAlert: function(){
			var n = this.empType.OverTimeCountAlert__c;
			return (typeof(n) == 'number' ? n : '');
		},
		//-------------------------------------
		// 有休自動付与
		isYuqProvideAuto: function(){
			var v = this.empType.YuqOption__c;
			return (v == '1' || v == '2');
		},
		// 有休自動付与：付与方法
		getYuqProvideType: function(){
			var v = this.empType.YuqOption__c;
			return (v == '2' ? '指定日に定期付与' : (v == '1' ? '入社日を基準に付与' : ''));
		},
		// 有休自動付与：指定日
		getYuqProvideDate: function(){
			var v = this.empType.YuqOption__c;
			var md = (v == '2' && this.empType.YuqDate1__c) || 0;
			var m = (md >= 100 ? Math.floor(md / 100) : 0);
			var d = md % 100;
			return (m > 0 && d > 0) ? (m + '/' + d) : '';
		},
		// 有休自動付与：付与日数
		getYuqProvideDays: function(){
			var vs = [];
			array.forEach(this.empTypeYuqs, function(o){
				var v = '';
				if(o.Year__c){
					v += o.Year__c + '年';
				}
				if(o.Month__c){
					v += o.Month__c + 'ヵ月';
				}
				v += ':' + o.Provide__c + '日';
				vs.push(v);
			});
			return vs.join(',');
		},
		// 有休自動付与：付与の通知不要
		isYuqAssignNoMessages: function(){
			return this.empType.YuqAssignNoMessages__c || false;
		}
	});
});
