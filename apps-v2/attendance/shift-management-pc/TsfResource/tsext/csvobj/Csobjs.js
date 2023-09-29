define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/csvobj/Csobj",
	"tsext/csvobj/CsvRow",
	"tsext/service/Agent",
	"tsext/util/Util"
], function(declare, lang, json, array, Csobj, CsvRow, Agent, Util) {
	return declare("tsext.csvobj.Csobjs", null, {
		constructor: function(csvData){
			this.csobjs = [];
			this.childMap = {};
			array.forEach(csvData.getCsvRows(), function(csvRow){
				this.csobjs.push(new Csobj(csvRow));
			}, this);
			array.forEach(this.csobjs, function(csobj){
				Agent.setSObjByKeyPrefix(csobj.getKeyPrefix(), csobj);
			}, this);
		},
		getSobjByName: function(name){
			var n = Util.rawName(name).toLowerCase();
			for(var i = 0 ; i < this.csobjs.length ; i++){
				var csobj = this.csobjs[i];
				var m = Util.rawName(csobj.getName()).toLowerCase();
				if(n == m){
					return csobj;
				}
			}
			return null;
		},
		setFields: function(csvData){
			array.forEach(csvData.getCsvRows(), function(csvRow){
				var o = csvRow.getValueByIndex(1);
				var csobj = this.getSobjByName(o.value);
				if(csobj){
					csobj.addField(csvRow);
				}
			}, this);
		},
		setRecords: function(csvMap){
			for(var key in csvMap){
				if(!csvMap.hasOwnProperty(key)){
					continue;
				}
				var csobj = this.getSobjByName(key);
				if(csobj){
					csobj.setRecords(csvMap[key]);
					delete csvMap[key];
				}
			}
		},
		buildReferenceSet: function(){
			array.forEach(this.csobjs, function(csobj){
				csobj.buildReferenceSet(this.childMap);
			}, this);
		},
		scanReferencesRecursive: function(reqInfo, referMap){
			array.forEach(reqInfo.empIds, function(targetId){
				var csobj = Agent.getSObjById(targetId);
				csobj.scanReferencesRecursive(targetId, referMap, this.childMap, 0);
			}, this);
			this.adjustCalendar(reqInfo, referMap);
		},
		importAllOption: function(reqInfo, referMap){
			var lst = [];
			if(reqInfo.allDept   ){ lst.push('AtkDept__c'   ); }
			if(reqInfo.allExpItem){ lst.push('AtkExpItem__c'); }
			if(reqInfo.allPayee  ){ lst.push('AtkPayee__c'  ); }
			for(var i = 0 ; i < lst.length ; i++){
				var csobjs = this.getSobjByName(lst[i]);
				array.forEach(csobjs.getCsvRows(), function(csvRow){
					referMap[csvRow.getId()] = lst[i];
				}, this);
			}
		},
		// 勤怠カレンダーは共通、関連の勤務体系のレコードを取り込む
		// ★共通カレンダーは勤務体系別に変換する
		adjustCalendar: function(reqInfo, referMap){
			var calendar = this.getSobjByName('AtkCalendar__c');
			if(!calendar){
				return;
			}
			var calendarMap = (reqInfo.rawCalendar ? null : {});
			array.forEach(calendar.getCsvRows(), function(csvRow){
				var empTypeId = csvRow.getValueByName('EmpTypeId__c');
				if(!empTypeId || referMap[empTypeId]){
					var id = csvRow.getId();
					referMap[id] = calendar.getRawName();
					calendar.scanReferencesRecursive(id, referMap, this.childMap, 0);
					var d = csvRow.getValueByName('Date__c');
					if(calendarMap){
						var o = calendarMap[d];
						if(!o){
							o = calendarMap[d] = {};
						}
						o[empTypeId ? empTypeId : 'common'] = csvRow;
					}
				}
			}, this);
			if(!calendarMap){
				return;
			}
			var dates = [];
			array.forEach(Object.keys(calendarMap), function(d){
				dates.push(d);
			});
			if(!dates.length){
				return;
			}
			dates = dates.sort(function(a, b){
				return (a < b ? -1 : 1);
			});
			var referEmpTypeIds = this.getReferEmpTypeIds(referMap);
			for(var i = 0 ; i < dates.length ; i++){
				var d = dates[i];
				var o = calendarMap[d];
				if(!o.common){ // 共通カレンダーはない
					continue;
				}
				var priority       = o.common.getValueByName('Priority__c');
				var ctype          = o.common.getValueByName('Type__c');
				var plannedHoliday = o.common.getValueByName('PlannedHoliday__c');
				for(var x = 0 ; x < referEmpTypeIds.length ; x++){
					var referEmpTypeId = referEmpTypeIds[x];
					var csvRow = o[referEmpTypeId];
					if(csvRow){
						if(priority == '1'){
							csvRow.setValueByName('Type__c', ctype);
							csvRow.setValueByName('PlannedHoliday__c', plannedHoliday);
						}
					}else{
						var newRow = new CsvRow(o.common.getHeads(), o.common.getCloneRow());
						var newId = Agent.getLocalId();
						newRow.setValueByName('Id', newId);
						newRow.setValueByName('EmpTypeId__c', referEmpTypeId);
						newRow.setValueByName('Priority__c', null);
						referMap[newId] = 'AtkCalendar__c';
						calendar.addCsvRow(newRow);
					}
				}
				delete referMap[o.common.getId()];
			}
		},
		// インポート対象の勤務体系IDの配列を返す
		getReferEmpTypeIds: function(referMap){
			var empType = this.getSobjByName('AtkEmpType__c');
			var ids = [];
			if(empType){
				array.forEach(empType.getCsvRows(), function(csvRow){
					var id = csvRow.getId();
					if(referMap[id]){
						ids.push(id);
					}
				}, this);
			}
			return ids;
		}
	});
});
