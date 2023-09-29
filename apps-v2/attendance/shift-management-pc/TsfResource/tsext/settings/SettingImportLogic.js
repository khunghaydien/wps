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
	"tsext/settings/SettingCsvEmpTypes",
	"tsext/settings/SettingCsvPatterns",
	"tsext/settings/SettingCsvHolidays",
	"tsext/settings/SettingImportHelper",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Helper, DataLoader, Request, Agent, SettingCsvEmpTypes, SettingCsvPatterns, SettingCsvHolidays, SettingImportHelper, Util){
	return declare("tsext.settings.SettingImportLogic", null, {
		constructor : function(csobjs){
			this.csobjs = csobjs;
			this.dataLoader = new DataLoader();
			this.helper = new SettingImportHelper();
			this.sobjs = [
				{ key: 'AtkConfigBase__c'       , all: true  },
				{ key: 'AtkConfig__c'           , all: true  },
				{ key: 'AtkEmpType__c'          , all: true  },
				{ key: 'AtkPattern__c'          , all: true  },
				{ key: 'AtkHoliday__c'          , all: true  },
				{ key: 'AtkCalendar__c'         , all: true  },
				{ key: 'AtkEmpTypeHoliday__c'   , all: true  },
				{ key: 'AtkEmpTypePattern__c'   , all: true  },
				{ key: 'AtkEmpTypeYuq__c'       , all: true  }
			];
			this.loadCsvObjs();
		},
		loadCsvObjs: function(){
			this.settingCsvPatterns = new SettingCsvPatterns(this.csobjs.getSobjByName('AtkPattern__c'));
			this.settingCsvHolidays = new SettingCsvHolidays(this.csobjs.getSobjByName('AtkHoliday__c'));
			this.settingCsvEmpTypes = new SettingCsvEmpTypes(this.csobjs.getSobjByName('AtkEmpType__c'));
			this.settingCsvEmpTypes.setConfigBases(this.csobjs.getSobjByName('AtkConfigBase__c'));
			this.settingCsvEmpTypes.setConfigs(this.csobjs.getSobjByName('AtkConfig__c'));
			this.settingCsvEmpTypes.setEmpTypePatterns(this.csobjs.getSobjByName('AtkEmpTypePattern__c'));
			this.settingCsvEmpTypes.setEmpTypeHolidays(this.csobjs.getSobjByName('AtkEmpTypeHoliday__c'));
			this.settingCsvEmpTypes.setEmpTypeYuqs(this.csobjs.getSobjByName('AtkEmpTypeYuq__c'));
			this.settingCsvEmpTypes.verify();
		},
		importLoop: function(reqInfo){
			this.outLog   = reqInfo.outLog;
			this.finished = reqInfo.finished;
			this.exportSObjectList();
		},
		exportSObjectList: function(){
			this.outLog('オブジェクトリスト取得');
			this.dataLoader.getSObjectListLoop({
				outLog: this.outLog
			}).then(
				lang.hitch(this, this.exportSObjectInfo),
				lang.hitch(this, function(errmsg){
					this.finished(false, errmsg);
				})
			);
		},
		exportSObjectInfo: function(){
			this.outLog('オブジェクト定義取得');
			array.forEach(this.sobjs, function(sobj){
				var info = Agent.getSObjectList(Util.adaptPrefix(sobj.key));
				if(info){
					lang.mixin(sobj, info);
				}
			}, this);
			this.dataLoader.getSObjectInfoLoop({
				sobjs : this.sobjs,
				outLog: this.outLog
			}).then(
				lang.hitch(this, function(){
					this.loadDestinationData();
				}),
				lang.hitch(this, function(errmsg){
					this.finished(false, errmsg);
				})
			);
		},
		loadDestinationData: function(){
			var reqs = [];
			reqs.push({ soql: "select Id,Name from AtkCommon__c", limit: 50000, offset: 0 });
			reqs.push({ soql: "select Id,Name from AtkEmpType__c where Removed__c = false", limit: 50000, offset: 0 });
			reqs.push({ soql: "select Id,Name from AtkPattern__c where Removed__c = false and OriginalId__c = null", limit: 50000, offset: 0 });
			reqs.push({ soql: "select Id,Name from AtkHoliday__c where Removed__c = false and OriginalId__c = null", limit: 50000, offset: 0 });
			Request.actionB(tsCONST.API_SEARCH_DATA, reqs).then(
				lang.hitch(this, function(result){
					this.excludeExisting();
				}),
				lang.hitch(this, this.showError),
				lang.hitch(this, function(result){
					switch(result.index){
					case 0:
						this.commons = result.records;
						break;
					case 1:
						this.empTypes = result.records;
						break;
					case 2:
						this.patterns = result.records;
						break;
					case 3:
						this.holidays = result.records;
						break;
					}
				})
			);
		},
		excludeExisting: function(){
			for(var i = 0 ; i < this.empTypes.length ; i++){
				var empType = this.empTypes[i];
				this.settingCsvEmpTypes.excludeExisting(this.helper, empType.Name, empType.Id);
			}
			for(var i = 0 ; i < this.patterns.length ; i++){
				var pattern = this.patterns[i];
				this.settingCsvPatterns.excludeExisting(this.helper, pattern.Name, pattern.Id);
			}
			for(var i = 0 ; i < this.holidays.length ; i++){
				var holiday = this.holidays[i];
				this.settingCsvHolidays.excludeExisting(this.helper, holiday.Name, holiday.Id);
			}
			var targets = [];
			var excludes = [];
			this.settingCsvPatterns.fillTargetsAndExcludes(targets, excludes);
			this.settingCsvHolidays.fillTargetsAndExcludes(targets, excludes);
			this.settingCsvEmpTypes.fillTargetsAndExcludes(targets, excludes);
			this.outLog(['インポート対象外（同一名が存在するため）'].concat(excludes).join('\n'));
			this.outLog(['インポート対象'].concat(targets).join('\n'));
			this.importStep1();
		},
		importStep1: function(){
			this.outLog('インポート開始');
			this.settingCsvPatterns.importStart(this.helper, lang.hitch(this, function(flag, result){
				if(flag){
					this.importStep2();
				}else{
					this.finished(false, result);
				}
			}));
		},
		importStep2: function(){
			this.settingCsvHolidays.importStart(this.helper, lang.hitch(this, function(flag, result){
				if(flag){
					this.importStep3();
				}else{
					this.finished(false, result);
				}
			}));
		},
		importStep3: function(){
			this.settingCsvEmpTypes.importStart(this.helper, lang.hitch(this, function(flag, result){
				if(flag){
					this.finished(true);
				}else{
					this.finished(false, result);
				}
			}));
		}
	});
});
