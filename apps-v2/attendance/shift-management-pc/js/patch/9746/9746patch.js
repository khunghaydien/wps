if(typeof(teasp) == 'object' && !teasp.resolved['AKATSUKI2'] && teasp.view && teasp.view.Widget){
teasp.view.Widget.prototype.clock = function() {
	var that = this;
	var clockIn = function(){
		var dt = teasp.util.date.getToday();
		dojo.byId('img_hizuke').innerHTML = teasp.util.date.formatDate(dt, 'SLA');

		var h = '' + dt.getHours();
		var mm = '' + (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
		dojo.byId('img_clock1').className = 'pw_base pw_clock' + h.substring(0, 1);
		if(h.length > 1){
			dojo.byId('img_clock2').className = 'pw_base pw_clock' + h.substring(1, 2);
		}else{
			dojo.byId('img_clock2').className = 'pw_base pw_clockNone';
		}
		dojo.byId('img_clock3').className = 'pw_base pw_kolon';
		dojo.byId('img_clock4').className = 'pw_base pw_clock' + mm.substring(0, 1);
		dojo.byId('img_clock5').className = 'pw_base pw_clock' + mm.substring(1, 2);

		dojo.byId('img_week').className = 'pw_base pw_week' + dt.getDay();
		if(dt.getSeconds() == 0 && that.pouch && that.pouch.getEmpId()){
			that.setPushButtons();
		}
	};
	this.timerID = setInterval(clockIn, 1000);
	dojo.style('jumpExp', 'display', 'none'); // 経費精算ボタン非表示
};
}
