define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/tsobj/Helper",
	"tsext/logic/DataLoader",
	"tsext/service/Request",
	"tsext/service/Agent",
	"tsext/configDownload/ConfigDownloadHoliday",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Helper, DataLoader, Request, Agent, ConfigDownloadHoliday, Util){
	return declare("tsext.configDownload.ConfigDownloadHolidays", null, {
		constructor : function(opt){
			this.opt = opt;
			this.holidayObjs = [
			{ name:'休暇ID'										, oid:true },
			{ name:'休暇名'										},
			{ name:'休暇：作成日時'								, odt:true },
			{ name:'休暇：作成者ID'								, oby:true, oid:true },
			{ name:'休暇：作成者名'								, oby:true },
			{ name:'休暇：最終更新日時'							, odt:true },
			{ name:'休暇：最終更新者ID'							, oby:true, oid:true },
			{ name:'休暇：最終更新者名'							, oby:true },
			{ name:'休暇：削除フラグ'							},
			{ name:'休暇：所有者ID'								, oby:true, oid:true },
			{ name:'休暇：所有者名'								, oby:true },
			{ name:'休暇：所有者有効'							, oby:true },
 			{ name:'休暇：Copy'									},
 			{ name:'休暇：オリジナルID'							, oid:true },
 			{ name:'種類'										},
 			{ name:'範囲'										},
 			{ name:'略称'										},
 			{ name:'有休消化'									},
 			{ name:'出勤率判定'									},
 			{ name:'暦日表示'									},
 			{ name:'前日の勤務：24時を超える勤務を禁止する'		},
 			{ name:'日数管理'									},
 			{ name:'管理名'										},
 			{ name:'大分類に設定'								},
 			{ name:'大分類'										},
 			{ name:'連携時の休暇番号'							},
 			{ name:'集計コード'									},
 			{ name:'説明'										},
 			{ name:'計画付与有休'								},
 			{ name:'並び順'										}
			];
		},
		convertBase: function(records){
			array.forEach(records, function(record){
				record.CreatedDate      = Util.formatDateTime(record.CreatedDate);
				record.LastModifiedDate = Util.formatDateTime(record.LastModifiedDate);
			});
			return records;
		},
		setHolidays: function(records){
			this.holidays = this.convertBase(records);
		},
		createHolidayContents: function(){
			this.holidayList = [];
			array.forEach(this.holidays, function(holiday){
				this.holidayList.push(new ConfigDownloadHoliday(holiday, this));
			}, this);
		},
		getHolidayCsvHeads: function(objs){
			var heads = [];
			var x = 0;
			array.forEach(this.holidayObjs, function(obj){
				if(this.isHolidayObj(x++)){
					heads.push(obj.name);
				}
			}, this);
			return heads;
		},
		isHolidayObj: function(index){
			var obj = this.holidayObjs[index];
			var flag = true;
			if(obj.oid && !this.opt.oid){ flag = false; }
			if(obj.oby && !this.opt.oby){ flag = false; }
			if(obj.odt && !this.opt.odt){ flag = false; }
			return flag;
		},
		getHolidayCsvContents: function(){
			this.createHolidayContents();
			var head = this.getHolidayCsvHeads().join(',');
			var body = '';
			for(var i = 0 ; i < this.holidayList.length ; i++){
				var holiday = this.holidayList[i];
				if(holiday.isRemoved() && !this.opt.orm){
					continue;
				}
				var vals = [];
				var x = 0;
				if(this.isHolidayObj(x++)){ vals.push(holiday.getId()); }
				if(this.isHolidayObj(x++)){ vals.push(Util.escapeCsv(holiday.getName())); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getCreatedDate()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getCreatedById()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getCreatedByName()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getLastModifiedDate()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getLastModifiedById()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getLastModifiedByName()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.isRemoved()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getOwnerId()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getOwnerName()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getOwnerIsActive()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.isCopy()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getOriginalId()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getType()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getRange()); }
				if(this.isHolidayObj(x++)){ vals.push(Util.escapeCsv(holiday.getSymbol())); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.isYuqSpend()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.isWorking()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.isDisplayDaysOnCalendar()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.isProhibitOverNightWork()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.isManaged()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getManageName()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.isSummaryRoot()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getSummaryName()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getLinkNumber()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getSummaryCode()); }
				if(this.isHolidayObj(x++)){ vals.push(Util.escapeCsv(holiday.getDescription())); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getPlannedHoliday()); }
				if(this.isHolidayObj(x++)){ vals.push(holiday.getOrder()); }
				body += vals.join(',') + '\n';
			}
			return head + '\n' + body;
		}
	});
});
