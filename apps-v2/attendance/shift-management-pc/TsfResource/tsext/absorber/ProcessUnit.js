define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/absorber/CommonAgent",
	"tsext/absorber/HolidayAgent",
	"tsext/absorber/EmpMonth",
	"tsext/absorber/YuqDays",
	"tsext/absorber/Constant",
	"tsext/absorber/LogAgent",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, CommonAgent, HolidayAgent, EmpMonth, YuqDays, Constant, LogAgent, Util){
	return declare("tsext.absorber.ProcessUnit", null, {
		constructor : function(emp, yearMonth, subNo){
			this.emp = emp;
			this.month = this.emp.getEmpMonth(yearMonth, subNo);
			this.monthInfo = this.emp.getMonthInfo(yearMonth, subNo);
			this.yearMonth = yearMonth;
			this.subNo = subNo;
			this.rows = [];
			this.holidays = {};
		},
		getEmpId: function(){
			return this.emp.getId();
		},
		addCsvRow: function(csvRow){
			this.rows.push(csvRow);
		},
		processStart: function(param, onNext){
			// ログに社員、月次、取り込み対象データを出力
			LogAgent.addLog(str.substitute(Constant.MSG_PROC_EMP, [this.emp.getName(), this.emp.getId()]));
			LogAgent.addLog(str.substitute(Constant.MSG_PROC_MONTH, [
				Util.formatMonthEx(this.yearMonth, this.subNo),
				(this.month ? this.month.getId() : Constant.MSG_NO_MONTH)
			]));
			if(!this.monthInfo){
				// !this.monthInfo はこの社員に存在しない月度が指定されていることを示す（例えば "201809(2)"）。
				LogAgent.addLog(Constant.NOT_EXIST_MONTH);
				this.addFaultAllRows(Constant.NOT_EXIST_MONTH);
				onNext(); // 次の社員へ
				return;
			}
			LogAgent.addLog(str.substitute(Constant.MSG_PROC_RANGE, [this.monthInfo.sd, this.monthInfo.ed]));
			LogAgent.addLog(str.substitute(Constant.MSG_PROC_MONTH_STATUS, [this.month ? this.month.getStatus() || '-' : '-']));
			console.log(this.emp.getName());
			// 勤怠月次がない、または月次確定されてない
			if(!this.month && param.update){
				// DML 勤怠月次生成
				var req = {
					action: "recalcEmpMonth",
					empId: this.emp.getId(),
					targetDate: this.monthInfo.sd
				};
				LogAgent.addLog(str.substitute(Constant.MSG_PROC_CREATE_MONTH, ['' + this.yearMonth + (this.subNo ? '(' + (this.subNo + 1) + ')' : ''), req.targetDate]));
				Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
					lang.hitch(this, function(result){ // 成功
						LogAgent.addLog(Constant.MSG_PROC_DML_SUCCESS);
						this.fetchEmpMonth(param, onNext); // 勤怠月次取得
					}),
					lang.hitch(this, function(errmsg){ // エラー
						LogAgent.addLog(str.substitute(Constant.MSG_PROC_CREATE_MONTH_NG, [errmsg]));
						this.addFaultAllRows(errmsg);
						onNext(); // 次の社員へ
					})
				);
			}else{
				this.outputLogTarget(param, onNext); // 取り込み対象のリストを出力
			}
		},
		// 勤怠月次取得
		fetchEmpMonth: function(param, onNext){
			var plus = CommonAgent.getValidMappedFields();
			var soql = "select Id"
				+ ",Name"
				+ ",CreatedDate"
				+ ",CreatedById"
				+ ",CreatedBy.Name"
				+ ",LastModifiedDate"
				+ ",LastModifiedById"
				+ ",LastModifiedBy.Name"
				+ ",EmpId__c"
				+ ",StartDate__c"
				+ ",EndDate__c"
				+ ",YearMonth__c"
				+ ",SubNo__c"
				+ ",EmpApplyId__r.Status__c"
				+ ",DeptMonthId__r.DeptId__c"
				+ (plus.length ? "," + plus.join(",") : "")
				+ " from AtkEmpMonth__c"
				+ " where EmpId__c = '" + this.emp.getId() + "'"
				+ " and YearMonth__c = " + this.yearMonth
				+ " and SubNo__c = " + (this.subNo || "null")
				;
			LogAgent.addLog(Constant.MSG_PROC_FETCH_MONTH);
			Request.actionA(
				tsCONST.API_SEARCH_DATA,
				{ soql:soql, limit:50000, offset:0 },
				true
			).then(
				lang.hitch(this, function(result){
					LogAgent.addLog(Constant.MSG_PROC_SUCCESS);
					var month = new EmpMonth(result.records[0]);
					this.emp.replaceEmpMonth(month);
					this.month = this.emp.getEmpMonth(this.yearMonth, this.subNo);
					this.outputLogTarget(param, onNext); // 取り込み対象のリストを出力
				}),
				lang.hitch(this, function(errmsg){ // エラー
					LogAgent.addLog(str.substitute(Constant.MSG_PROC_FETCH_MONTH_NG, [errmsg]));
					this.addFaultAllRows(errmsg);
					onNext(); // 次の社員へ
				})
			);
		},
		// 取り込み対象のリストを出力
		outputLogTarget: function(param, onNext){
			LogAgent.addLog(Constant.MSG_PROC_IMPORT_TARGET);
			LogAgent.addLog(Constant.getRequestTableBorder());
			LogAgent.addLog(Constant.getRequestTableHead());
			LogAgent.addLog(Constant.getRequestTableBorder());
			for(var i = 0 ; i < this.rows.length ; i++){
				var csvRow = this.rows[i];
				LogAgent.addLog(str.substitute(Constant.MSG_PROC_REQUST_TABLE, [
					Util.padx(csvRow.getLineNo(), 5, ' '),
					Util.padx(csvRow.getHolidayName(), 30, ' ', true),
					Util.padx(csvRow.getSpendDays(), 8, ' '),
					Util.padx(csvRow.getSpendTime(), 8, ' ')
				]));
			}
			LogAgent.addLog(Constant.getRequestTableBorder());
			this.checkAndFillHoliday(0, param, onNext); // 休暇処理へ
		},
		// 1行ずつ休暇取得日数のチェック、マイナス付与
		checkAndFillHoliday: function(index, param, onNext){
			if(index >= this.rows.length){ // 全行終わり
				this.registHolidays(param, onNext); // 勤怠月次更新へ
				return;
			}
			if(index){
				LogAgent.addLog(Constant.MSG_PROC_DIV);
			}
			var csvRow = this.rows[index];
			var holidayName = csvRow.getHolidayName();
			var holidayKey = HolidayAgent.getHolidayKeyByName(holidayName);
			var holiday    = HolidayAgent.getHolidayByName(holidayName);
			var h = {
				days:  csvRow.getSpendDays(),
				hours: csvRow.getSpendTime()
			};
			this.holidays[holidayKey] = lang.clone(h);
			LogAgent.addLog(str.substitute(Constant.MSG_PROC_HOLIDAY, [holiday.getName()]));
			console.log('request -- ' + [holidayKey, h.days, h.hours].join(','));
			if(holiday.isYuqSpend()){ // 有休を消化する休暇
				// 残日数詳細をログに出力
				var remain = this.emp.getYuqRemainDaysInRange(this.monthInfo.sd, this.monthInfo.ed);
				var spend  = this.emp.getYuqSpendDaysInRange(this.monthInfo.sd, this.monthInfo.ed);
				var remainYuqDays = this.emp.getRemainYuqDaysInRange(this.monthInfo.sd, this.monthInfo.ed);
				var reqDays = h.days + (h.hours ? '+' + h.hours + ':00' : '');
				LogAgent.addLog(str.substitute(Constant.MSG_PROC_SPEND_DAYS  , [spend.dispValue]));
				LogAgent.addLog(str.substitute(Constant.MSG_PROC_REQUEST_DAYS, [reqDays]));
				LogAgent.addLog(str.substitute(Constant.MSG_PROC_REMAIN_DAYS , [remain.dispValue]));
				if(remainYuqDays.length > 0){
					LogAgent.addLog(Constant.MSG_PROC_REMAIN_DETAIL);
					LogAgent.addLog(Constant.getYuqRemainTableBorder());
					LogAgent.addLog(Constant.getYuqRemainTableHead());
					LogAgent.addLog(Constant.getYuqRemainTableBorder());
					var px = 0;
					while(px < remainYuqDays.length){
						var ryo = remainYuqDays[px];
						LogAgent.addLog(str.substitute(Constant.MSG_PROC_YUQ_REMAIN, [
							Util.padx(px + 1, 2, ' ', true),
							ryo.empYuq.getId(),
							ryo.empYuq.getStartDate(),
							ryo.empYuq.getLimitDate(),
							Util.padx(ryo.empYuq.getBaseTime(), 8, ' '),
							Util.padx(ryo.yd.format(), 10, ' '),
							Util.padx(ryo.empYuq.getName(), 40, ' ', true),
							ryo.empYuq.getSubject()
						]));
						px++;
					}
					LogAgent.addLog(Constant.getYuqRemainTableBorder());
				}
				// 期間内の消化日数と取り込む消化日数を比較
				var bt = (remainYuqDays.length > 0 ? remainYuqDays[0].yd.getBaseTime() : 480);
				var sp = new YuqDays(bt, bt * spend.days + (spend.hours * 60)); // 期間内の消化日数
				var rq = new YuqDays(bt, bt * h.days     + (h.hours     * 60)); // 取り込む消化日数
				var compared = sp.getAllMinutes() - rq.getAllMinutes();
				// 残日数チェック
				var newMinus = [];
				var px = 0;
				while((h.days > 0 || h.hours > 0) && px < remainYuqDays.length && compared < 0){
					var ryo = remainYuqDays[px];
					var ry = ryo.yd;
					var rq = new YuqDays(ry.getBaseTime(), ry.getBaseTime() * h.days + (h.hours * 60));
					if(px == 0){
						var sp = new YuqDays(ry.getBaseTime(), ry.getBaseTime() * spend.days + (spend.hours * 60));
						if(sp.getAllMinutes() < rq.getAllMinutes()){
							rq.setValue(rq.getBaseTime(), rq.getAllMinutes() - sp.getAllMinutes());
						}else{
							compared = sp.getAllMinutes() - rq.getAllMinutes();
							rq.setValue(rq.getBaseTime(), 0);
						}
					}
					if(rq.getAllMinutes() > 0){
						var minus = {
							empId: this.emp.getId(),
							subject: CommonAgent.getMinusSubject(),
							targetId: ryo.empYuq.getId(),
							targetDate: this.monthInfo.ed
						};
						if(ry.getAllMinutes() < rq.getAllMinutes()){
							rq.subtract(ry);
							h.days  = rq.getDays();
							h.hours = rq.getHours();
							minus.days  = ry.getDays();
							minus.hours = ry.getHours();
						}else{
							h.days  = 0;
							h.hours = 0;
							minus.days  = rq.getDays();
							minus.hours = rq.getHours();
						}
						newMinus.push(minus);
						LogAgent.addLog(str.substitute(Constant.MSG_PROC_MINUS, [
							Util.padx(minus.days + (minus.hours ? '+' + minus.hours + ':00' : ''), 10, ' ', true),
							minus.targetId
						]));
					}
					px++;
				}
				if(!compared){
					LogAgent.addLog(Constant.MSG_PROC_FULFILL); // 期間内の消化日数＝取り込む消化日数
				}else if(compared > 0){
					var errmsg = str.substitute(Constant.MSG_PROC_EXCEED, [spend.dispValue, reqDays]); // 期間内の消化日数＞取り込む消化日数
					LogAgent.addLog(Constant.MSG_PROC_ERROR + errmsg);
					csvRow.addFault(errmsg);
				}else if(h.days > 0 || h.hours > 0){ // 残日数不足
					LogAgent.addLog(Constant.MSG_PROC_ERROR + Constant.LackOfRemaining(h));
					csvRow.addFault(Constant.LackOfRemaining(h));
				}else if(newMinus.length && param.update){
					// DML 有休のマイナス付与実行
					var req = {
						action: "provideYuqEx",
						targets: newMinus
					};
					LogAgent.addLog(Constant.MSG_PROC_MINUS_DO);
					Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
						lang.hitch(this, function(){ // 成功
							LogAgent.addLog(Constant.MSG_PROC_DML_SUCCESS);
							this.checkAndFillHoliday(index + 1, param, onNext); // 次の行へ
						}),
						lang.hitch(this, function(errmsg){ // エラー
							LogAgent.addLog(str.substitute(Constant.MSG_PROC_MINUS_NG, [errmsg]));
							csvRow.addFault(errmsg);
							this.checkAndFillHoliday(index + 1, param, onNext); // 次の行へ
						})
					);
					return;
				}
			}else if(holiday.isManaged()){ // 日数管理休暇
				// 残日数詳細をログに出力
				var remainDays = this.emp.getStockRemainDaysInRange(holidayKey, this.monthInfo.sd, this.monthInfo.ed);
				var spendDays  = this.emp.getStockSpendDaysInRange(holidayKey, this.monthInfo.sd, this.monthInfo.ed);
				var remainStocks = this.emp.getRemainStocksInRange(holidayKey, this.monthInfo.sd, this.monthInfo.ed);
				var reqDays = h.days || 0;
				LogAgent.addLog(str.substitute(Constant.MSG_PROC_SPEND_DAYS  , [spendDays  || 0]));
				LogAgent.addLog(str.substitute(Constant.MSG_PROC_REQUEST_DAYS, [reqDays]));
				LogAgent.addLog(str.substitute(Constant.MSG_PROC_REMAIN_DAYS , [remainDays || 0]));
				if(remainStocks.length > 0){
					LogAgent.addLog(Constant.MSG_PROC_REMAIN_DETAIL);
					LogAgent.addLog(Constant.getStockRemainTableBorder());
					LogAgent.addLog(Constant.getStockRemainTableHead());
					LogAgent.addLog(Constant.getStockRemainTableBorder());
					var px = 0;
					while(px < remainStocks.length){
						var rs = remainStocks[px];
						LogAgent.addLog(str.substitute(Constant.MSG_PROC_STOCK_REMAIN, [
							Util.padx(px + 1, 2, ' ', true),
							rs.stock.getId(),
							rs.stock.getStartDate(),
							rs.stock.getLimitDate(),
							Util.padx(rs.days, 10, ' '),
							rs.stock.getName()
						]));
						px++;
					}
					LogAgent.addLog(Constant.getStockRemainTableBorder());
				}
				// 期間内の消化日数と取り込む消化日数を比較
				var compared = spendDays - h.days;
				// 残日数チェック
				var newMinus = [];
				var px = 0;
				while(h.days > 0 && px < remainStocks.length && compared < 0){
					var rs = remainStocks[px];
					var rq = { days: h.days };
					if(px == 0){
						var sp = { days: spendDays };
						if(sp.days < rq.days){
							rq.days -= sp.days;
						}else{
							compared = sp.days - rq.days;
							rq.days = 0;
						}
					}
					if(rq.days > 0){
						var minus = {
							empId: this.emp.getId(),
							subject: CommonAgent.getMinusSubject(),
							stockType: holidayKey,
							targetId: rs.stock.getId(),
							targetDate: this.monthInfo.ed
						};
						if(rs.days < rq.days){
							rq.days -= rs.days;
							h.days = rq.days;
							minus.days = rs.days * (-1);
						}else{
							h.days  = 0;
							minus.days = rq.days * (-1);
						}
						newMinus.push(minus);
						LogAgent.addLog(str.substitute(Constant.MSG_PROC_MINUS, [
							Util.padx(minus.days * (-1), 10, ' ', true),
							minus.targetId
						]));
					}
					px++;
				}
				if(!compared){
					LogAgent.addLog(Constant.MSG_PROC_FULFILL); // 期間内の消化日数＝取り込む消化日数
				}else if(compared > 0){
					var errmsg = str.substitute(Constant.MSG_PROC_EXCEED, [spendDays, reqDays]); // 期間内の消化日数＞取り込む消化日数
					LogAgent.addLog(Constant.MSG_PROC_ERROR + errmsg);
					csvRow.addFault(errmsg);
				}else if(h.days > 0){ // 残日数不足
					LogAgent.addLog(Constant.MSG_PROC_ERROR + Constant.LackOfRemaining(h));
					csvRow.addFault(Constant.LackOfRemaining(h));
				}else if(newMinus.length && param.update){
					// DML 積休のマイナス付与実行
					var req = {
						action: "provideStockEx",
						targets: newMinus
					};
					LogAgent.addLog(Constant.MSG_PROC_MINUS_DO);
					Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
						lang.hitch(this, function(){ // 成功
							LogAgent.addLog(Constant.MSG_PROC_DML_SUCCESS);
							this.checkAndFillHoliday(index + 1, param, onNext); // 次の行へ
						}),
						lang.hitch(this, function(errmsg){ // エラー
							LogAgent.addLog(str.substitute(Constant.MSG_PROC_MINUS_NG, [errmsg]));
							csvRow.addFault(errmsg);
							this.checkAndFillHoliday(index + 1, param, onNext); // 次の行へ
						})
					);
					return;
				}
			}
			this.checkAndFillHoliday(index + 1, param, onNext); // 次の行へ
		},
		// 勤怠月次更新（休暇取得日数を登録）
		registHolidays: function(param, onNext){
			if(!param.update){
				onNext(); // 次の社員へ
				return;
			}
			var values = {};
			var dmlLogs = [];
			var tmpLogs = [];
			for(var index = 0 ; index < this.rows.length ; index++){
				var csvRow = this.rows[index];
				if(csvRow.isAllError()){
					continue;
				}
				var holidayKey = HolidayAgent.getHolidayKeyByName(csvRow.getHolidayName());
				var fields = CommonAgent.getFieldsByHolidayName(holidayKey);
				for(var i = 0 ; i < fields.length && i < 2 ; i++){
					var field = fields[i];
					var orgVal = this.month.getValueByKey(field.name);
					var newVal = (i == 0 ? csvRow.getSpendDays() : csvRow.getSpendTime());
					if(orgVal != newVal){
						values[field.name] = newVal;
						dmlLogs.push(str.substitute(Constant.MSG_PROC_MONTH_VALUE, [field.name, newVal]));
					}
					tmpLogs.push(
						str.substitute(Constant.MSG_FIELD_VALUES, [
							Util.padx(field.name, 44, ' ', true),
							Util.padx((typeof(orgVal) == 'number' ? '' + orgVal : (orgVal || 'null')), 6, ' '),
							Util.padx((typeof(newVal) == 'number' ? '' + newVal : (newVal || 'null')), 6, ' ')
						])
					);
				}
			}
			if(tmpLogs.length){
				LogAgent.addLog(Constant.MSG_FIELD_VALUES_TITLE);
				LogAgent.addLog(Constant.getFieldValueTableBorder());
				LogAgent.addLog(Constant.getFieldValueTableHead());
				LogAgent.addLog(Constant.getFieldValueTableBorder());
				for(var i = 0 ; i < tmpLogs.length ; i++){
					LogAgent.addLog(tmpLogs[i]);
				}
				LogAgent.addLog(Constant.getFieldValueTableBorder());
			}
			if(!Object.keys(values).length){
				// 更新する値がないため、勤怠月次更新スキップ
				if(tmpLogs.length > 0){
					LogAgent.addLog(Constant.MSG_PROC_UPDATE_MONTH_SKIP);
				}
				this.fixMonth(param, onNext); // 勤怠月次確定へ
				return;
			}
			LogAgent.addLog(Constant.MSG_PROC_UPDATE_MONTH);
			for(var i = 0 ; i < dmlLogs.length ; i++){
				LogAgent.addLog(dmlLogs[i]);
			}

			// DML 勤怠月次更新
			var req = {
				action: "updateSObject",
				objName: 'AtkEmpMonth__c',
				idList: [],
				values: {},
				typeMap: {}
			};
			req.idList.push(this.month.getId());
			req.values[this.month.getId()] = values;
			for(var key in values){
				req.typeMap[key] = 'DOUBLE';
			}
			Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(){ // 成功
					LogAgent.addLog(Constant.MSG_PROC_DML_SUCCESS);
					this.fixMonth(param, onNext); // 勤怠月次確定へ
				}),
				lang.hitch(this, function(errmsg){ // エラー
					LogAgent.addLog(str.substitute(Constant.MSG_PROC_UPDATE_MONTH_NG, [errmsg]));
					this.addFaultAllRows(errmsg);
					onNext(); // 次の社員へ
				})
			);
		},
		// 勤怠月次確定
		fixMonth: function(param, onNext){
			if(!param.update        // 事前チェックである
			|| this.month.isFixed() // 月次確定済みである
			|| this.isExstError() // 取り込み対象レコードに1件でもエラーがあった
			|| CommonAgent.isNoLock() // ロックしない
			){
				onNext(); // 次の社員へ
				return;
			}
			LogAgent.addLog(str.substitute(Constant.MSG_PROC_FIX_MONTH, ['' + this.yearMonth + (this.subNo ? '(' + (this.subNo + 1) + ')' : '')]));
			// DML 勤怠月次確定
			var req = {
				empId: this.emp.getId(),
				month: this.yearMonth,
				startDate: this.monthInfo.sd,
				lastModifiedDate: 'NOLMDCHECK',
				note: CommonAgent.getApplyComment()
			};
			Request.actionA(tsCONST.API_APPLY_EMP_MONTH, req, true).then(
				lang.hitch(this, function(){ // 成功
					LogAgent.addLog(Constant.MSG_PROC_SUCCESS);
					onNext(); // 次の社員へ
				}),
				lang.hitch(this, function(errmsg){ // エラー
					LogAgent.addLog(str.substitute(Constant.MSG_PROC_FIX_MONTH_NG, [errmsg]));
					this.addFaultAllRows(errmsg);
					onNext(); // 次の社員へ
				})
			);
		},
		// 取り込み対象レコードに 1 件でもエラーがあれば true を返す
		isExstError: function(){
			for(var i = 0 ; i < this.rows.length ; i++){
				var csvRow = this.rows[i];
				if(csvRow.isAllError()){
					return true;
				}
			}
			return false;
		},
		// エラーメッセージを関連行にセット
		addFaultAllRows: function(errmsg){
			for(var i = 0 ; i < this.rows.length ; i++){
				this.rows[i].addFault(errmsg);
			}
		}
	});
});
