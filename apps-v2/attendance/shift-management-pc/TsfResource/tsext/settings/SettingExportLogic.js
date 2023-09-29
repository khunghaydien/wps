define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/tsobj/Helper",
	"tsext/logic/DataLoader",
	"tsext/service/Request",
	"tsext/service/Agent",
	"tsext/util/Util"
], function(declare, lang, array, str, Helper, DataLoader, Request, Agent, Util){
	return declare("tsext.settings.SettingExportLogic", null, {
		constructor : function(){
			this.dataLoader = new DataLoader();
			this.sobjs = [
				{ key: 'Organization'           , all: true  },
				{ key: 'AtkCommon__c'           , all: true  },
				{ key: 'AtkConfigBase__c'       , all: true, wh: "OriginalId__c = null and Removed__c = false" },
				{ key: 'AtkConfig__c'           , all: true, wh: "OriginalId__c = null and Removed__c = false" },
				{ key: 'AtkCalendar__c'         , all: true  },
				{ key: 'AtkPattern__c'          , all: true, wh: "OriginalId__c = null and Removed__c = false"  },
				{ key: 'AtkHoliday__c'          , all: true, wh: "OriginalId__c = null and Removed__c = false"  },
				{ key: 'AtkEmpType__c'          , all: true, wh: "Removed__c = false"  },
				{ key: 'AtkEmpTypeHoliday__c'   , all: true  },
				{ key: 'AtkEmpTypePattern__c'   , all: true  },
				{ key: 'AtkEmpTypeYuq__c'       , all: true  }
			];
		},
		loadSettingLoop: function(reqInfo, callback){
			this.outLog = reqInfo.outLog;
			this.finished = reqInfo.finished;
			this.downLink = reqInfo.downloadElement;
			this.option = reqInfo.option;
			this.getLog = reqInfo.getLog;
			this.outLog('オブジェクトリスト取得');
			this.dataLoader.getSObjectListLoop({
				outLog: this.outLog
			}).then(
				lang.hitch(this, this.loadSettings),
				lang.hitch(this, function(errmsg){
					console.log(errmsg);
					this.finished(false, errmsg);
				})
			);
		},
		loadSettings: function(){
			array.forEach(this.sobjs, function(sobj){
				var info = Agent.getSObjectList(Util.adaptPrefix(sobj.key));
				if(info){
					lang.mixin(sobj, info);
				}
			}, this);
			this.dataLoader.getSObjectInfoLoop({
				sobjs: this.sobjs,
				outLog: this.outLog
			}).then(
				lang.hitch(this, this.exportData),
				lang.hitch(this, function(errmsg){
					this.outLog(errmsg);
					this.finished(false, errmsg);
				})
			);
		},
		exportData: function(){
			this.outLog('データ取得');
			this.zip = new JSZip();
			this.dataLoader.getDataLoop({
				sobjs       : this.sobjs,
				outLog      : this.outLog,
				isTarget    : lang.hitch(this, this.isTarget),
				getCondition: lang.hitch(this, this.getCondition),
				receiveData : lang.hitch(this, this.receiveData)
			}).then(
				lang.hitch(this, function(){
					this.download();
					console.log('OK!!');
					this.finished(true);
				}),
				lang.hitch(this, function(errmsg){
					console.log(errmsg);
					this.finished(false, errmsg);
				})
			);
		},
		isTarget: function(sobj){
			return true;
		},
		getCondition: function(sobj){
			return (sobj.wh ? ' where ' + sobj.wh : '');
		},
		receiveData: function(sobj, soql, records){
			if(sobj.key == 'Organization' && records.length){
				this.organization = records[0];
			}
			this.createCsv(sobj, soql, records);
		},
		createCsv: function(sobj, soql, records){
			var fields = this.parseSoqlFields(soql);
			var hh = [];
			for(var i = 0 ; i < fields.length ; i++){
				var field = fields[i];
				hh.push('"' + (typeof(field) == 'string' ? field : field.join('.')) + '"');
			}
			var value = hh.join(',') + '\n';
			for(var i = 0 ; i < records.length ; i++){
				var pp = this.parseRecord(sobj, records[i], fields, true);
				value += pp.join(',') + '\n';
			}
			this.zip.file(sobj.key + '.csv', Util.unicodeStringToTypedArray(value, true), {binary:true});
		},
		parseSoqlFields: function(soql){
			var m = soql;
			var x = m.toLowerCase().indexOf('select');
			m = m.substring(x + 'select'.length + 1);
			x = m.toLowerCase().indexOf(' from ');
			m = m.substring(0, x);
			var ks = m.split(/,/);
			for(var i = 0 ; i < ks.length ; i++){
				ks[i] = ks[i].trim();
				var v = ks[i].split(/\./);
				if(v && v.length > 1){
					ks[i] = v;
				}
			}
			return ks;
		},
		parseRecord: function(sobj, record, fields, kakomi){
			var info = Agent.getSObject(sobj.name);
			var p = record;
			if(!info.fieldMap){
				info.fieldMap = {};
				for(var i = 0 ; i < info.fields.length ; i++){
					var f = info.fields[i];
					info.fieldMap[f.name.toLowerCase()] = f;
				}
			}
			var pp = [];
			for(var j = 0 ; j < fields.length ; j++){
				var field = fields[j];
				var v = '';
				var f = null;
				if(typeof(field) == 'string'){
					f = info.fieldMap[field.toLowerCase()];
					if(f && f.typeName == 'DATE'){
						v = Util.formatDate(p[field]) || '';
					}else if(f && f.typeName == 'DATETIME'){
						v = (p[field] ? Util.formatDateTime(p[field]) : '');
					}else if(f && f.typeName == 'BOOLEAN'){
						v = (p[field] || false);
					}else if(f && f.typeName == 'REFERENCE'){
						v = (p[field] || '');
					}else if(f && f.typeName == 'DOUBLE'){
						v = (typeof(p[field]) == 'number' ? p[field] : '');
					}else if(f && f.typeName == 'ADDRESS'){
						v = (p[field] && typeof(p[field]) == 'object' ? Util.toJson(p[field]) : '');
					}else{
						v = (typeof(p[field]) == 'number' ? p[field] : (p[field] || ''));
					}
				}else{
					var o = p;
					for(var n = 0 ; n < field.length ; n++){
						o = o[field[n]];
						if(!o){
							break;
						}
					}
					v = (o || '');
				}
				if(typeof(v) == 'string' && kakomi){
					pp.push('"' + v.replace(/"/g, '""') + '"');
				}else{
					pp.push(v);
				}
			}
			return pp;
		},
		download: function(){
			var objectList = this.dataLoader.getSObjectListCsv(this.sobjs);
			this.zip.file('object_list.csv', Util.unicodeStringToTypedArray(objectList.heads + '\n' + objectList.value, true), {binary:true});
			var fieldList = this.dataLoader.getFieldListCsv(this.sobjs);
			this.zip.file('object_fields.csv', Util.unicodeStringToTypedArray(fieldList.heads + '\n' + fieldList.value, true), {binary:true});
			var fname = str.substitute('settings_${0}_${1}.zip', [this.organization.Id, moment().format('YYYYMMDDHHmmss')]);
			this.outLog('ファイル名 ' + fname);
			if(this.option.comment){
				this.zip.file('comment.txt', this.option.comment);
			}
			this.zip.file('log.txt', this.getLog());
			this.zip.generateAsync({ type: 'blob', compression: "DEFLATE" }).then(lang.hitch(this, function(content){
				this.outLog('ダウンロード');
				// IEか他ブラウザかの判定
				if(window.navigator.msSaveBlob){
					// IEなら独自関数を使います。
					window.navigator.msSaveBlob(content, fname);
				} else {
					// それ以外はaタグを利用してイベントを発火させます
					var a = this.downLink;
					a.href = URL.createObjectURL(content);
					a.download = fname;
					a.target = '_blank';
					a.click();
					setTimeout(function(){
						URL.revokeObjectURL(a.href);
					}, 3000);
				}
			}));
		}
	});
});
