define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/csvobj/Field",
	"tsext/service/Agent",
	"tsext/tsobj/Helper",
	"tsext/util/Util"
], function(declare, lang, json, array, Field, Agent, Helper, Util) {
	return declare("tsext.csvobj.Csobj", null, {
		constructor: function(csvRow){
			this.fields = [];
			this.name                  = csvRow.getValueByName('name');
			this.localName             = csvRow.getValueByName('localName') || this.name;
			this.label                 = csvRow.getValueByName('label');
			this.labelPlural           = csvRow.getValueByName('labelPlural');
			this.keyPrefix             = csvRow.getValueByName('keyPrefix');
			this.isAccessible          = csvRow.getBooleanByName('isAccessible');
			this.isCreateable          = csvRow.getBooleanByName('isCreateable');
			this.isCustom              = csvRow.getBooleanByName('isCustom');
			this.isCustomSetting       = csvRow.getBooleanByName('isCustomSetting');
			this.isDeletable           = csvRow.getBooleanByName('isDeletable');
			this.isDeprecatedAndHidden = csvRow.getBooleanByName('isDeprecatedAndHidden');
			this.isFeedEnabled         = csvRow.getBooleanByName('isFeedEnabled');
			this.isMergeable           = csvRow.getBooleanByName('isMergeable');
			this.isQueryable           = csvRow.getBooleanByName('isQueryable');
			this.isSearchable          = csvRow.getBooleanByName('isSearchable');
			this.isUndeletable         = csvRow.getBooleanByName('isUndeletable');
			this.isUpdateable          = csvRow.getBooleanByName('isUpdateable');
		},
		getName: function(){
			return this.name;
		},
		getRawName: function(){
			return Util.rawName(this.name);
		},
		getLabel: function(){
			return this.label;
		},
		getKeyPrefix: function(){
			return this.keyPrefix;
		},
		addField: function(csvRow){
			this.fields.push(new Field(csvRow));
		},
		getFields: function(){
			return this.fields;
		},
		getFieldByName: function(name){
			for(var i = 0 ; i < this.fields.length ; i++){
				var f = this.fields[i];
				if(f.name == name){
					return f;
				}
			}
			return null;
		},
		getCsvFields: function(){
			var reals = [];
			array.forEach(this.fields, function(field){
				if((field.name == 'Name' || field.isCustom)
				&& !field.isCalculated
				&& !field.isAutoNumber){
					reals.push(field);
				}
			});
			return reals;
		},
		setRecords: function(csvData){
			this.csvData = csvData;
		},
		getCsvRows: function(referMap){
			return (this.csvData ? this.csvData.getCsvRows(referMap) : []);
		},
		addCsvRow: function(csvRow){
			if(this.csvData){
				this.csvData.addCsvRow(csvRow);
			}
		},
		getCsvRowById: function(id){
			if(!this.csvData){
				return null;
			}
			var csvRows = this.csvData.getCsvRows();
			for(var i = 0 ; i < csvRows.length ; i++){
				if(csvRows[i].getId() == id){
					return csvRows[i];
				}
			}
			return null;
		},
		buildReferenceSet: function(childMap){
			for(var i = 0 ; i < this.fields.length ; i++){
				var field = this.fields[i];
				if(field.type != 'REFERENCE'){
					continue;
				}
				array.forEach(this.getCsvRows(), function(csvRow){
					var v = csvRow.getValueByName(field.name);
					var csobj = (v ? Agent.getSObjById(v) : null);
					if(csobj){
						var m = childMap[v];
						if(!m){
							m = {};
							childMap[v] = m;
						}
						m[csvRow.getId()] = 1;
					}
				});
			}
		},
		scanReferencesRecursive: function(targetId, referMap, childMap, layer){
			var csvRow = this.getCsvRowById(targetId);
			if(!csvRow){
				return;
			}
			for(var i = 0 ; i < this.fields.length ; i++){
				var field = this.fields[i];
				if(field.type != 'REFERENCE'){
					continue;
				}
				var id = csvRow.getValueByName(field.name);
				var csobj = (id ? Agent.getSObjById(id) : null);
				if(csobj && !referMap[id]){
					referMap[id] = csobj.getRawName();
					csobj.scanReferencesRecursive(id, referMap, childMap, (layer || 0) + 1);
					if(Helper.getScanRefers().indexOf(csobj.getRawName()) >= 0){
						this.scanChildrenRecursive(id, referMap, childMap, 0);
					}
				}
			}
		},
		scanChildrenRecursive: function(pid, referMap, childMap, layer){
			if(layer > 2){
				return;
			}
			var m = childMap[pid];
			for(var id in m){
				var csobj = Agent.getSObjById(id);
				if(csobj){
					referMap[id] = csobj.getRawName();
					this.scanChildrenRecursive(id, referMap, childMap, (layer || 0) + 1);
					csobj.scanReferencesRecursive(id, referMap, childMap, (layer || 0) + 1);
				}
			}
		}
	});
});
