define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"tsext/csvobj/CsvRow",
	"tsext/util/Util"
], function(declare, array, CsvRow, Util) {
	return declare("tsext.csvobj.CsvObj", null, {
		constructor: function(objName, fname){
			this.objName = objName;
			this.fname = fname;
			this.csvRows = null;
		},
		getObjName: function(){
			return this.objName;
		},
		getFname: function(){
			return this.fname;
		},
		set: function(data){
			var csvRowMap = {};
			this.heads = data[0];
			this.csvRows = [];
			for(var i = 1 ; i < data.length ; i++){
				if(i == (data.length - 1) && data[i].length <= 1){
					break;
				}
				var csvRow = new CsvRow(this.heads, data[i]);
				var id = csvRow.getId();
				if(id){
					csvRowMap[id] = csvRow;
				}
				this.csvRows.push(csvRow);
			}
			return csvRowMap;
		},
		isEmpty: function(){
			return (this.csvRows ? false : true);
		},
		getCsvRows: function(referMap){
			if(!referMap){
				return this.csvRows;
			}
			var rows = [];
			array.forEach(this.csvRows, function(csvRow){
				if(referMap[csvRow.getId()]){
					rows.push(csvRow);
				}
			}, this);
			return rows;
		}
	});
});
