define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/absorber/HolidayAgent",
	"tsext/absorber/LogAgent",
	"tsext/absorber/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, HolidayAgent, LogAgent, Constant, Util){
	return declare("tsext.absorber.CsvRow", null, {
		constructor : function(lineNo, data, firstYearMonth, firstSubNo, checkMap){
			this.lineNo = lineNo;
			this.data = data;
			this.empCode     = (this.data.length > 0 && this.data[0] || '').trim();
			this.empName     = (this.data.length > 1 && this.data[1] || '').trim();
			this.yearMonth   = (this.data.length > 2 && this.data[2] || '').trim();
			this.subNo       = null; // checkValue() でセットする
			this.holidayName = (this.data.length > 3 && this.data[3] || '').trim();
			this.spendDays   = (this.data.length > 4 && this.data[4] || '').trim();
			this.spendTime   = (this.data.length > 5 && this.data[5] || '').trim();
			this.emp = null;
			this.errors = [];
			this.faults = [];
			this.checkValue(firstYearMonth, firstSubNo, checkMap);
		},
		clearFaults: function(){
			this.faults = [];
		},
		checkValue: function(firstYearMonth, firstSubNo, checkMap){
			if(!this.yearMonth){
				// 月度入力なし
				this.errors.push(Constant.Empty(Constant.YEAR_MONTH));
			}else{
				var v = /^(\d{6})(.*)$/.exec('' + this.yearMonth);
				if(!v){
					// 月度形式不正
					this.errors.push(Constant.Invalid(Constant.YEAR_MONTH));
				}else{
					this.yearMonth = parseInt(v[1], 10);
					if(v[2]){
						var n = /^([_\(])(\d+)([\)]*)$/.exec(v[2]);
						if(n){
							if(n[1] == '(' && n[3] == ')'){
								this.subNo = parseInt(n[2], 10) - 1;
							}else if(n[1] == '_' && !n[3]){
								this.subNo = parseInt(n[2], 10);
							}
							if(this.subNo <= 0){
								this.subNo = null;
							}
						}
					}
					var y = (this.yearMonth > 100 ? Math.floor(this.yearMonth / 100) : 0);
					var m = this.yearMonth % 100;
					if(y < 2000 || y >= 3000 || m < 1 || m > 12){
						// 200001～299912 の範囲にない
						this.errors.push(Constant.Invalid(Constant.YEAR_MONTH));
					}else if(firstYearMonth && (this.yearMonth != firstYearMonth || this.subNo != firstSubNo)){
						// 先頭行の月度と一致しない
						this.errors.push(Constant.Irregularity(Constant.YEAR_MONTH));
					}
				}
			}
			var holiday = null;
			if(!this.holidayName){
				// 休暇種類入力なし
				this.errors.push(Constant.Empty(Constant.HOLIDAY_NAME));
			}else{
				holiday = HolidayAgent.getHolidayByName(this.holidayName);
				if(!holiday){
					// 休暇種類が登録外
					this.errors.push(Constant.NotIdentify(Constant.HOLIDAY_NAME));
				}else if(this.empCode){
					var holidayKey = HolidayAgent.getHolidayKeyByName(this.holidayName);
					var k = this.empCode + ':' + holidayKey;
					if(checkMap[k]){
						// 重複行（{社員コード}+{休暇名} は既出）
						this.errors.push(Constant.DUPLICATE_ROW);
					}
					checkMap[k] = 1;
				}
			}
			var v;
			v = /^[\d\.]+$/.exec('' + this.spendDays);
			if(!v && this.spendDays){
				this.errors.push(Constant.Invalid(Constant.SPEND_DAYS));
			}else{
				this.spendDays = (this.spendDays ? parseFloat(this.spendDays) : 0);
				var n = this.spendDays - Math.floor(this.spendDays);
				if(n != 0 && n != 0.5){
					// 取得日数の少数点以下が5でない
					this.errors.push(Constant.Invalid(Constant.SPEND_DAYS));
				}
			}

			// 取得時間
			v = /^[\d\.]+$/.exec('' + this.spendTime);
			if(!v && this.spendTime){
				this.errors.push(Constant.Invalid(Constant.SPEND_TIME));
			}else{
				this.spendTime = (this.spendTime ? parseFloat(this.spendTime) : 0);
				var n = this.spendTime - Math.floor(this.spendTime);
				if(n != 0){
					// 取得時間に少数点以下がある
					this.errors.push(Constant.Invalid(Constant.SPEND_TIME));
				}else if(holiday && holiday.isManaged() && this.spendTime != 0){
					this.errors.push(Constant.NotAvailable(Constant.SPEND_TIME));
				}
			}
		},
		getLineNo      : function(){ return this.lineNo; },
		getEmpCode     : function(){ return this.empCode; },
		getEmpName     : function(){ return this.empName; },
		getYearMonth   : function(){ return this.yearMonth; },
		getSubNo       : function(){ return this.subNo; },
		getSpendDays   : function(){ return this.spendDays; },
		getSpendTime   : function(){ return this.spendTime; },
		getHolidayName : function(){ return this.holidayName; },
		// 休暇名を返す。日数管理休暇の場合は管理名を返す
		getHolidayKey : function(){
			return HolidayAgent.getKeyByHolidayName(this.holidayName);
		},
		getDispYearMonth: function(){
			return Constant.getDispYearMonth(this.yearMonth, this.subNo);
		},
		getValues: function(){
			return this.data;
		},
		getEmpId: function(){
			return (this.emp && this.emp.getId()) || null;
		},
		getEmp: function(){
			return this.emp || null;
		},
		setEmp: function(emps){
			if(!this.getEmpCode()){
				this.errors.push(Constant.Empty(Constant.EMP));
			}else{
				this.emp = emps.getEmpByEmpCode(this.getEmpCode());
				if(!this.emp){
					this.errors.push(Constant.NotIdentify(Constant.EMP));
				}
			}
			console.log('this.emp = ' + (this.emp ? this.emp.getName() : 'null'));
		},
		addError: function(errmsg){
			this.errors.push(errmsg);
		},
		addFault: function(fault){
			this.faults.push(fault);
		},
		isError: function(){
			return (this.errors.length > 0);
		},
		getError: function(){
			var msgs = [];
			array.forEach(this.errors, function(error){
				if(msgs.indexOf(error) < 0){
					msgs.push(error);
				}
			});
			return msgs.join(',');
		},
		isAllError: function(){
			return (this.errors.length > 0 || this.faults.length > 0);
		},
		getAllError: function(){
			var msgs = [];
			array.forEach(this.errors, function(error){
				if(msgs.indexOf(error) < 0){
					msgs.push(error);
				}
			});
			array.forEach(this.faults, function(fault){
				if(msgs.indexOf(fault) < 0){
					msgs.push(fault);
				}
			});
			return msgs.join(',');
		},
		// エラー詳細の行を返す
		getOutput: function(){
			var line = [];
			line.push(Util.escapeCsv(this.empCode));
			line.push(Util.escapeCsv(this.empName));
			line.push(Util.escapeCsv(this.getDispYearMonth()));
			line.push(Util.escapeCsv(this.holidayName));
			line.push(Util.escapeCsv(this.spendDays));
			line.push(Util.escapeCsv(this.spendTime));
			line.push(Util.escapeCsv(this.getAllError()));
			return line.join(',') + '\n';
		}
	});
});
