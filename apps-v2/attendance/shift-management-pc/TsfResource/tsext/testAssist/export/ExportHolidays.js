define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObjs",
	"tsext/testAssist/export/ExportHoliday",
	"tsext/testAssist/DefaultSettings",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObjs, ExportHoliday, DefaultSettings, Util){
	// 勤怠休暇のコレクション
	return declare("tsext.testAssist.ExportHolidays", ExportObjs, {
		createObj: function(record){
			return new ExportHoliday(this.manager, record, this);
		},
		getDefaultHoliday: function(){
			if(!this.defaultHoliday){
				this.defaultHoliday = new ExportHoliday(this.mangager, DefaultSettings.getDefaultHoliday(), this);
			}
			return this.defaultHoliday;
		},
		getHolidayById: function(id){
			return this.getObjById(id);
		},
		getHolidaysByIds: function(ids, flag){
			var holidays = [];
			var pmap = {};
			for(var i = 0 ; i < this.objs.length ; i++){
				var holiday = this.objs[i];
				if(ids.indexOf(holiday.getId()) >= 0){
					if(flag && holiday.isCopy()){
						holiday = this.getHolidayById(holiday.getOriginalId());
					}
					if(holiday){
						if(!pmap[holiday.getId()]){
							holidays.push(holiday);
						}
						pmap[holiday.getId()] = true;
					}
				}
			}
			return holidays;
		},
		getHolidayByManageName: function(name, flag){
			for(var i = 0 ; i < this.objs.length ; i++){
				var holiday = this.objs[i];
				var manageName = holiday.getManageName(flag);
				if(manageName == name){
					return holiday;
				}
			}
			return null;
		}
	});
});
