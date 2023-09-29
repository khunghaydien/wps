if(typeof(teasp) == 'object' && !teasp.resolved['9476'] && teasp.data && teasp.data.Pouch){
teasp.data.Pouch.prototype.isEmpMonthFixedByDate = function(dkey){
	var m = this.getEmpMonthByDate(dkey);
	return (m && teasp.constant.STATUS_FIX.contains(m.apply.status));
};
teasp.logic.EmpTime.getDayInfo = function(dkey, em, cal, empTypePatterns){
	var d = teasp.util.date.parseDate(dkey);
	var day = {
		dayType        : teasp.constant.DAY_TYPE_NORMAL,
		plannedHoliday : false
	};
	var ho = (em ? em.fixHolidays[dkey] : null);
	day.dayType = (ho ? ho.dayType : teasp.constant.DAY_TYPE_NORMAL);
	if(em
	&& em.config.defaultLegalHoliday !== null
	&& day.dayType != teasp.constant.DAY_TYPE_NORMAL
	&& d.getDay() == em.config.defaultLegalHoliday){
		day.defaultLegalHolidayFlag = true;
	}
	if(cal){
		if(cal.type){
			day.dayType = (typeof(cal.type) == 'string' ? parseInt(cal.type, 10) : cal.type);
			day.plannedHoliday = cal.plannedHoliday;
		}
		if(cal.pattern){
			day.pattern = cal.pattern;
		}
		day.event = (ho && ho.title || '');
		day.event += (((day.event || '') != '' && cal.event) ? teasp.message.getLabel('tm10001470') : '') + (cal.event || '');
	}else{
		day.event = (ho && ho.title || '');
	}
	if(!day.pattern){
		var p = teasp.logic.EmpTime.getPatternByDate(empTypePatterns, d);
		if(p){
			day.pattern = p.pattern;
		}
	}
	return day;
};
teasp.data.Pouch.prototype.getEmpMonthByDate = function(dkey, amount){
	var keys = [];
	for(var key in this.getObj().empMonthMap){
		if(this.getObj().empMonthMap.hasOwnProperty(key)){
			keys.push(key);
			var m = this.getObj().empMonthMap[key];
			if(m.startDate <= dkey && dkey <= m.endDate){
				if(amount){
					var o = this.getEmpMonth(null, m.startDate, amount);
					m = this.getObj().empMonthMap[o.startDate];
				}
				return m;
			}
		}
	}
	if(!amount){
		keys = keys.sort(function(a, b){
			return (a < b ? -1 : 1);
		});
		if(dkey < keys[0]){
			key = keys[0];
			var m = this.getObj().empMonthMap[key];
			return m;
		}
	}
	return null;
};
}
