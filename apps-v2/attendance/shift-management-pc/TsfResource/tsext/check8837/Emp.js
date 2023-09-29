define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/check8837/EmpMonths",
	"tsext/check8837/Const",
	"tsext/util/Util"
], function(declare, lang, array, str, EmpMonths, Const, Util){
	return declare("tsext.check8837.Emp", null, {
		constructor : function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			o.EntryDate__c	   = Util.formatDate(o.EntryDate__c);
			o.EndDate__c	   = Util.formatDate(o.EndDate__c);
			this.obj = o;
		},
		reset: function(){
			this.months   = new EmpMonths();
		},
		getId: function(){
			return this.obj.Id;
		},
		getEmpCode: function(){
			return this.obj.EmpCode__c || null;
		},
		getName: function(){
			return this.obj.Name;
		},
		getDeptCode   : function(){ return (this.obj.DeptId__r && this.obj.DeptId__r.DeptCode__c) || ''; },
		getDeptName   : function(){ return (this.obj.DeptId__r && this.obj.DeptId__r.Name) || ''; },
		getEntryDate  : function(){ return this.obj.EntryDate__c || ''; },
		getEndDate    : function(){ return this.obj.EndDate__c || ''; },
		getEmpTypeName: function(){ return (this.obj.EmpTypeId__r && this.obj.EmpTypeId__r.Name) || ''; },
		addEmpMonth: function(month){
			this.months.addEmpMonth(month);
		},
		getEmpMonth: function(yearMonth, subNo){
			return this.months.getEmpMonth(yearMonth, subNo);
		},
		compare: function(other){
			var c1 = this.getEmpCode();
			var c2 = other.getEmpCode();
			if(c1 && c2){
				return (c1 < c2 ? -1 : 1);
			}else if(!c1 && !c2){
				return (this.getName() < other.getName() ? -1 : 1);
			}else{
				return (c1 ? 1 : -1);
			}
		},
		getErrorLines: function(param){
			this.months.sort();
			var months = this.months.getEmpMonths();
			if(!months.length){
				return '';
			}
			var lines = [];
			var bs = [];
			bs.push(Util.escapeCsv(this.getEmpCode())    );
			bs.push(Util.escapeCsv(this.getName())       );
			for(var i = 0 ; i < months.length ; i++){
				var month = months[i];
				if(param.normal && !month.isNg()){
					continue;
				}
				var line = lang.clone(bs);
				line.push(Util.escapeCsv(month.getDeptCode())   );       // 部署コード
				line.push(Util.escapeCsv(month.getDeptName())   );       // 部署名
				line.push(Util.escapeCsv(month.getEmpTypeName()) );      // 勤務体系名
				line.push(Util.escapeCsv(month.getYearMonthS())  );      // 月度
				line.push(Util.escapeCsv(month.getStartDate())   );      // 開始日
				line.push(Util.escapeCsv(month.getEndDate())     );      // 終了日
				line.push(Util.escapeCsv(month.getStatus())      );      // ステータス
				line.push(Util.escapeCsv(month.getLastModifiedDate()));  // 最終更新日時
				line.push(Util.escapeCsv(month.getWeekEndWorkTime()));   // 所定休日労働時間
				line.push(Util.escapeCsv(month.getExpectedValue()));     // 本来の所定休日労働時間
				lines.push(line.join(','));
			}
			return (lines.length ? lines.join('\n') : '');
		}
	});
});
