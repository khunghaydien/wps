define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/absorber/CsvRow",
	"tsext/absorber/LogAgent",
	"tsext/absorber/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, CsvRow, LogAgent, Constant, Util){
	return declare("tsext.absorber.CsvRows", null, {
		constructor : function(data){
			this.head = data[0];
			this.firstYearMonth = null;
			this.firstSubNo = null;
			this.csvRows = [];
			var checkMap = {};
			for(var i = 1 ; i < data.length ; i++){
				var values = data[i];
				if(values.length == 1 && !values[0]){
					continue;
				}
				var csvRow = new CsvRow(i, values, this.firstYearMonth, this.firstSubNo, checkMap);
				this.csvRows.push(csvRow);
				if(!this.firstYearMonth && !csvRow.isError()){
					this.firstYearMonth = csvRow.getYearMonth();
					this.firstSubNo = csvRow.getSubNo();
				}
			}
		},
		getCount: function(){
			return this.csvRows.length;
		},
		getCsvRows: function(){
			return this.csvRows;
		},
		getCsvRow: function(index){
			return this.csvRows[index];
		},
		getValues: function(index){
			return this.csvRows[index].getValues();
		},
		setEmp: function(emps){
			array.forEach(this.csvRows, function(csvRow){
				csvRow.setEmp(emps);
			}, this);
		},
		getEmpIds: function(){
			var empIds = [];
			array.forEach(this.csvRows, function(csvRow){
				if(!csvRow.isError()){
					var empId = csvRow.getEmpId();
					if(empId){
						empIds.push(empId);
					}
				}
			}, this);
			return empIds;
		},
		getErrorRowCount: function(){
			var cnt = 0;
			array.forEach(this.csvRows, function(csvRow){
				if(csvRow.isError()){
					cnt++;
				}
			}, this);
			return cnt;
		},
		getAllErrorRowCount: function(){
			var cnt = 0;
			array.forEach(this.csvRows, function(csvRow){
				if(csvRow.isAllError()){
					cnt++;
				}
			}, this);
			return cnt;
		},
		getFirstYearMonth: function(){
			return this.firstYearMonth;
		},
		getFirstSubNo: function(){
			return this.firstSubNo;
		},
		// エラー詳細ファイルのボディ部を返す
		getOutput: function(){
			var value = '';
			for(var i = 0 ; i < this.csvRows.length ; i++){
				var csvRow = this.csvRows[i];
				value += csvRow.getOutput();
			}
			return value;
		},
		// ログにエラー行のリストを出力
		outputLogError: function(){
			if(this.getErrorRowCount() <= 0){
				return;
			}
			LogAgent.addLog(Constant.MSG_FIRST_CHECK);
			LogAgent.addLog(Constant.getErrorTableBorder());
			LogAgent.addLog(Constant.getErrorTableHead());
			LogAgent.addLog(Constant.getErrorTableBorder());
			array.forEach(this.csvRows, function(csvRow){
				if(csvRow.isError()){
					LogAgent.addLog(str.substitute(Constant.MSG_PROC_ERROR_ROW, [
						Util.padx(csvRow.getLineNo(), 5, ' '),
						csvRow.getError()
					]));
				}
			}, this);
			LogAgent.addLog(Constant.getErrorTableBorder());
		}
	});
});
