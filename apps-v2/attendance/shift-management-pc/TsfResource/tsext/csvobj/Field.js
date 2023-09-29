define([
	"dojo/_base/declare",
	"dojo/_base/json",
	"dojo/_base/array",
	"tsext/util/Util"
], function(declare, json, array, Util) {
	return declare("tsext.csvobj.Field", null, {
		constructor: function(csvRow){
			this.objectLabel           = csvRow.getValueByName('objectLabel');
			this.objectName            = csvRow.getValueByName('objectName');
			this.label                 = csvRow.getValueByName('label');
			this.name                  = csvRow.getValueByName('name');
			this.type                  = csvRow.getValueByName('type');
			this.length                = csvRow.getNumberByName('length') || 0;
			this.precision             = csvRow.getNumberByName('precision') || 0;
			this.scale                 = csvRow.getNumberByName('scale') || 0;
			this.referenceTo           = csvRow.getValueByName('referenceTo');
			this.pickList              = csvRow.getValueByName('pickList');
			this.helpText              = csvRow.getValueByName('helpText');
			this.calculatedFormula     = csvRow.getValueByName('calculatedFormula');
			this.isAutoNumber          = csvRow.getBooleanByName('isAutoNumber');
			this.isIdLookup            = csvRow.getBooleanByName('isIdLookup');
			this.isCalculated          = csvRow.getBooleanByName('isCalculated');
			this.isCustom              = csvRow.getBooleanByName('isCustom');
			this.isNilable             = csvRow.getBooleanByName('isNilable');
			this.isUnique              = csvRow.getBooleanByName('isUnique');
			this.isExternalID          = csvRow.getBooleanByName('isExternalID');
			this.isGroupable           = csvRow.getBooleanByName('isGroupable');
			this.isHtmlFormatted       = csvRow.getBooleanByName('isHtmlFormatted');
			this.isRestrictedDelete    = csvRow.getBooleanByName('isRestrictedDelete');
			this.childRelationshipName = csvRow.getValueByName('childRelationshipName');
		},
		getName: function(){
			return this.name;
		},
		getType: function(){
			return this.type;
		},
		getObjectValue: function(obj){
			var name = this.name;
			if(tsCONST.prefixBar && !tsCONST.prefixOnCsv){
				if(name.indexOf('__') > 0){
					name = tsCONST.prefixBar + name;
				}
			}else if(!tsCONST.prefixBar && tsCONST.prefixOnCsv){
				name = name.replace(tsCONST.prefixOnCsv, '');
			}
			var v = obj[name];
			if(v === undefined){
				v = null;
			}
			if(v){
				if(typeof(v) == 'string'){
					v = v.replace(/\r?\n/g, '\n');
				}
				if(typeof(v) == 'number'){
					if(this.type == 'DATETIME'){
						v = moment(v).format('YYYY-MM-DD HH:mm');
					}else if(this.type == 'DATE'){
						v = moment(v).format('YYYY-MM-DD');
					}
				}
			}
			return v;
		}
	});
});
