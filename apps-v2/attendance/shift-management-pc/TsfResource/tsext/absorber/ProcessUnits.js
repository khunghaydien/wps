define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/absorber/ProcessUnit",
	"tsext/absorber/Constant",
	"tsext/absorber/LogAgent",
	"tsext/util/Util"
], function(declare, lang, array, str, ProcessUnit, Constant, LogAgent, Util){
	return declare("tsext.absorber.ProcessUnits", null, {
		constructor : function(csvRows){
			this.processUnits = [];
			array.forEach(csvRows.getCsvRows(), function(csvRow){
				csvRow.clearFaults();
				if(!csvRow.isError()){
					var p = this.getProcessUnitByEmpId(csvRow.getEmpId());
					if(!p){
						p = new ProcessUnit(csvRow.getEmp(), csvRow.getYearMonth(), csvRow.getSubNo());
						this.processUnits.push(p);
					}
					p.addCsvRow(csvRow);
				}
			}, this);
		},
		getProcessUnitByEmpId: function(empId){
			for(var i = 0 ; i < this.processUnits.length ; i++){
				var p = this.processUnits[i];
				if(p.getEmpId() == empId){
					return p;
				}
			}
			return null;
		},
		processStart: function(param, onFinish){
			LogAgent.addLog(str.substitute(Constant.MSG_EMP_COUNT, [this.processUnits.length]));
			this.processStep(0, param, onFinish);
		},
		processStep: function(index, param, onFinish){
			if(index >= this.processUnits.length){
				onFinish(param);
				return;
			}
			LogAgent.addLog(str.substitute(Constant.MSG_PROC_LOOP, [index + 1, this.processUnits.length]));
			var p = this.processUnits[index];
			p.processStart(
				param,
				lang.hitch(this, function(){
					setTimeout(lang.hitch(this, function(){
						this.processStep(index + 1, param, onFinish);
					}), 100);
				})
			);
		}
	});
});
