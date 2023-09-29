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
	"tsext/configDownload/ConfigDownloadPattern",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Helper, DataLoader, Request, Agent, ConfigDownloadPattern, Util){
	return declare("tsext.configDownload.ConfigDownloadPatterns", null, {
		constructor : function(opt){
			this.opt = opt;
			this.patternObjs = [
			{ name:'勤務パターンID'										, oid:true },
			{ name:'勤務パターン名'										},
			{ name:'勤務パターン：作成日時'								, odt:true },
			{ name:'勤務パターン：作成者ID'								, oby:true, oid:true },
			{ name:'勤務パターン：作成者名'								, oby:true },
			{ name:'勤務パターン：最終更新日時'							, odt:true },
			{ name:'勤務パターン：最終更新者ID'							, oby:true, oid:true },
			{ name:'勤務パターン：最終更新者名'							, oby:true },
			{ name:'勤務パターン：削除フラグ'							},
			{ name:'勤務パターン：所有者ID'								, oby:true, oid:true },
			{ name:'勤務パターン：所有者名'								, oby:true },
			{ name:'勤務パターン：所有者有効'							, oby:true },
 			{ name:'勤務パターン：Copy'									},
 			{ name:'勤務パターン：オリジナルID'							, oid:true },
 			{ name:'始業時刻'											},
 			{ name:'終業時刻'											},
 			{ name:'所定労働時間'										},
 			{ name:'休憩'												},
 			{ name:'半日休暇取得可'										},
 			{ name:'午前半休開始時刻'									},
 			{ name:'午前半休終了時刻'									},
 			{ name:'午後半休開始時刻'									},
 			{ name:'午後半休終了時刻'									},
 			{ name:'半休取得時の休憩時間の適用'							},
 			{ name:'午前半休時休憩時間'									},
 			{ name:'午後半休時休憩時間'									},
 			{ name:'深夜労働割増'										},
 			{ name:'裁量労働を使用'										},
 			{ name:'対象期間'											},
 			{ name:'略称'												},
 			{ name:'シフト時に勤務時間の延長・短縮を禁止：平日勤務'			},
 			{ name:'シフト時に勤務時間の延長・短縮を禁止：休日出勤日'		},
 			{ name:'シフト時に勤務時間の延長・短縮を禁止：休日の振替勤務日'	},
 			{ name:'シフトした勤務時間と所定勤務時間を連動させる'			},
 			{ name:'シフト開始時刻に合わせて、所定休憩と半休の時間帯をずらす'},
 			{ name:'コア時間帯を使用しない'								},
 			{ name:'並び順'												}
			];
		},
		convertBase: function(records){
			array.forEach(records, function(record){
				record.CreatedDate      = Util.formatDateTime(record.CreatedDate);
				record.LastModifiedDate = Util.formatDateTime(record.LastModifiedDate);
			});
			return records;
		},
		setPatterns: function(records){
			this.patterns = this.convertBase(records);
		},
		createPatternContents: function(){
			this.patternList = [];
			array.forEach(this.patterns, function(pattern){
				this.patternList.push(new ConfigDownloadPattern(pattern, this));
			}, this);
		},
		getPatternCsvHeads: function(objs){
			var heads = [];
			var x = 0;
			array.forEach(this.patternObjs, function(obj){
				if(this.isPatternObj(x++)){
					heads.push(obj.name);
				}
			}, this);
			return heads;
		},
		isPatternObj: function(index){
			var obj = this.patternObjs[index];
			var flag = true;
			if(obj.oid && !this.opt.oid){ flag = false; }
			if(obj.oby && !this.opt.oby){ flag = false; }
			if(obj.odt && !this.opt.odt){ flag = false; }
			return flag;
		},
		getPatternCsvContents: function(){
			this.createPatternContents();
			var head = this.getPatternCsvHeads().join(',');
			var body = '';
			for(var i = 0 ; i < this.patternList.length ; i++){
				var pattern = this.patternList[i];
				if(pattern.isRemoved() && !this.opt.orm){
					continue;
				}
				var vals = [];
				var x = 0;
				if(this.isPatternObj(x++)){ vals.push(pattern.getId()); }
				if(this.isPatternObj(x++)){ vals.push(Util.escapeCsv(pattern.getName())); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getCreatedDate()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getCreatedById()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getCreatedByName()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getLastModifiedDate()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getLastModifiedById()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getLastModifiedByName()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.isRemoved()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getOwnerId()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getOwnerName()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getOwnerIsActive()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.isCopy()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getOriginalId()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getStdStartTime()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getStdEndTime()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getStandardFixTime()); }
				if(this.isPatternObj(x++)){ vals.push(Util.escapeCsv(pattern.getRestTimes())); }
				if(this.isPatternObj(x++)){ vals.push(pattern.isUseHalfHoliday()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getAmHolidayStartTime()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getAmHolidayEndTime()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getPmHolidayStartTime()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getPmHolidayEndTime()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.isUseHalfHolidayRestTime()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getAmHolidayRestTimes()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getPmHolidayRestTimes()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.isUseNightCharge()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.isUseDiscretionary()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getRange()); }
				if(this.isPatternObj(x++)){ vals.push(Util.escapeCsv(pattern.getSymbol())); }
				if(this.isPatternObj(x++)){ vals.push(pattern.isProhibitChangeWorkTime()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.isProhibitChangeHolidayWorkTime()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.isProhibitChangeExchangedWorkTime()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.isWorkTimeChangesWithShift()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.isEnableRestTimeShift()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.isDisableCoreTime()); }
				if(this.isPatternObj(x++)){ vals.push(pattern.getOrder()); }
				body += vals.join(',') + '\n';
			}
			return head + '\n' + body;
		}
	});
});
