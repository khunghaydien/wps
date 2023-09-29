/**
 * 社員選択画面
 *
 * @constructor
 */
teasp.Tsf.InfoEmpTable = function(){
};

teasp.Tsf.InfoEmpTable.prototype = new teasp.Tsf.InfoBase();

teasp.Tsf.InfoEmpTable.prototype.init = function(res){
	teasp.Tsf.InfoBase.prototype.init.call(this, res);

	this.selectDeptId = res.deptId;
	this.month  = res.month + (res.subNo ? ('.' + res.subNo) : '');
	this.months = res.months;
	this.todayYm = res.todayYm;
	var tm = res.targetMonth;
	if(tm){
		for(var i = 0 ; i < this.months.length ; i++){
			var m = this.months[i];
			if(m.yearMonth == tm.yearMonth
			&& m.subNo     == tm.subNo){
				break;
			}
		}
		if(i >= this.months.length){
			this.months.push(tm);
		}
	}

};

teasp.Tsf.InfoEmpTable.prototype.getSelectDeptId = function(){
	return this.selectDeptId;
};

teasp.Tsf.InfoEmpTable.prototype.setSelectDeptId = function(val){
	this.selectDeptId = val;
};

teasp.Tsf.InfoEmpTable.prototype.getMonth = function(){
	return '' + this.month;
};

teasp.Tsf.InfoEmpTable.addYm = function(ym, n){
	var y = Math.floor(ym / 100);
	var m = ym % 100;
	m += n;
	if(n < 0 && m <= 0){
		var o = m * (-1);
		var p = Math.floor((o + 12) / 12);
		var q = o % 12;
		y -= p;
		m = 12 - q;
	}else if(n > 0 && m > 12){
		var p = Math.floor((m - 1) / 12);
		var q = (m - 1) % 12 + 1;
		y += p;
		m = q;
	}
	return y * 100 + m;
};

teasp.Tsf.InfoEmpTable.prototype.getMonthList = function(){
	var ms = [];
	var yms = [];
	dojo.forEach(this.months, function(m){
		ms.push({
			ym : m.yearMonth,
			sn : m.subNo,
			key: m.yearMonth + (m.subNo ? '.' + m.subNo : '')
		});
	});
	ms = ms.sort(function(a, b){
		if(a.ym == b.ym){
			return (b.sn || 0) - (a.sn || 0);
		}
		return b.ym - a.ym;
	});
	dojo.forEach(ms, function(m){
		yms.push({ value: m.key, label: teasp.util.date.formatMonth('zv00000021', Math.floor(m.ym / 100), (m.ym % 100), m.sn) }); // yyyy年MM月
	});
	return yms;
};

teasp.Tsf.InfoEmpTable.prototype.getStartEndByYearMonth = function(month){
	var s = '' + month;
	var ms = s.split('.');
	var ym = ms[0];
	var sn = (ms.length > 1 && ms[1]) || null;
	var mx = null;
	for(var i = 0 ; i < this.months.length ; i++){
		var m = this.months[i];
		if(m.yearMonth == ym && m.subNo == sn){
			mx = m;
			break;
		}
	}
	return {
		yearMonth : mx.yearMonth,
		subNo     : mx.subNo,
		startDate : mx.startDate,
		endDate   : mx.endDate
	};
};

