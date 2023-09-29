define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"tsext/util/Util"
], function(declare, lang, Util) {
	return declare("tsext.csvobj.CsvRow", null, {
		constructor: function(heads, data){
			this.heads = heads;
			this.row = data;
		},
		getHeads: function(){
			return this.heads;
		},
		getCloneRow: function(){
			return lang.clone(this.row);
		},
		convertValue: function(v, field){
			if(!field){
				if(v){
					if(/^true$/i.test(v)){
						return true;
					}else if(/^false$/i.test(v)){
						return false;
					}
				}else if(v === undefined || v == ''){
					return null;
				}
			}else{
				if(field.type == 'BOOLEAN'){
					if(v){
						if(/^true$/i.test(v)){
							return true;
						}else if(/^false$/i.test(v)){
							return false;
						}
					}
					return false;
				}else if(['INTEGER','DOUBLE','CURRENCY','PERCENT'].indexOf(field.type) >= 0){
					return Util.parseInt(v);
				}
			}
			if(v && typeof(v) == 'string'){
				v = v.replace(/\r?\n/g, '\n');
			}
			return v;
		},
		getIndexByName: function(name){
			var index = -1;
			var h = Util.rawName(name).toLowerCase();
			for(var i = 0 ; i < this.heads.length ; i++){
				if(Util.rawName(this.heads[i]).toLowerCase() == h){
					index = i;
					break;
				}
			}
			return index;
		},
		getValueByIndex: function(index){
			if(index < this.heads.length){
				return {
					head: this.heads[index],
					value: this.convertValue(this.row[index])
				};
			}else{
				return null;
			}
		},
		getValueByName: function(name){
			var index = this.getIndexByName(name);
			return (index >= 0 ? this.convertValue(this.row[index]) : null);
		},
		setValueByName: function(name, value){
			var index = this.getIndexByName(name);
			if(index >= 0){
				this.row[index] = value;
			}
		},
		getValueByField: function(field){
			var index = -1;
			var h = Util.rawName(field.name).toLowerCase();
			for(var i = 0 ; i < this.heads.length ; i++){
				if(Util.rawName(this.heads[i]).toLowerCase() == h){
					index = i;
					break;
				}
			}
			return (index >= 0 ? this.convertValue(this.row[index], field) : null);
		},
		getBooleanByName: function(name){
			var s = this.getValueByName(name) || '';
			return (s == '○' || s.toLowerCase() == 'true') ? true : false;
		},
		getNumberByName: function(name){
			var s = this.getValueByName(name) || '';
			return Util.parseInt(s);
		},
		getId: function(){
			return this.getValueByName('Id');
		},
		getName: function(){
			return this.getValueByName('Name');
		}
	});
});
