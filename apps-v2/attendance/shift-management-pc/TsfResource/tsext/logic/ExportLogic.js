define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/tsobj/Helper",
	"tsext/logic/DataLoader",
	"tsext/logic/SObjFromJson",
	"tsext/service/Request",
	"tsext/service/Agent",
	"tsext/util/Util"
], function(declare, lang, array, str, Helper, DataLoader, SObjFromJson, Request, Agent, Util){
	return declare("tsext.logic.ExportLogic", null, {
		constructor : function(){
			this.emp = null;
			this.month = null;
			this.jobIdMap = {};
			this.dataLoader = new DataLoader();
			(new SObjFromJson()).load(this.dataLoader);
		},
		exportLoop: function(reqInfo){
			this.empIds   = reqInfo.targetEmpIds;
			this.empNames = reqInfo.targetEmpNames;
			this.option   = reqInfo.option;
			this.downLink = reqInfo.downloadElement;
			this.finished = reqInfo.finished;
			this.outLog   = reqInfo.outLog;
			this.getLog   = reqInfo.getLog;
			this.sobjs    = Helper.getTargetSObjects();
			this.exportSObjectList();
		},
		exportSObjectList: function(){
			this.outLog('オブジェクトリスト取得');
			this.dataLoader.getSObjectListLoop({
				outLog: this.outLog
			}).then(
				lang.hitch(this, this.exportSObjectInfo),
				lang.hitch(this, function(errmsg){
					console.log(errmsg);
					this.finished(false, errmsg);
				})
			);
		},
		exportSObjectInfo: function(){
			this.outLog('オブジェクト定義取得');
			array.forEach(this.sobjs, function(sobj){
				var info = Agent.getSObjectList(Util.adaptPrefix(sobj.key));
				if(info){
					lang.mixin(sobj, info);
				}
			}, this);
			var req = {
				sobjs : lang.clone(this.sobjs),
				outLog: this.outLog
			}
			if(this.option.stepHistory){
				req.sobjs.push({key:'ProcessInstanceStep'});
			}
			this.dataLoader.getSObjectInfoLoop(req).then(
				lang.hitch(this, this.exportData),
				lang.hitch(this, function(errmsg){
					console.log(errmsg);
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
					this.finished(true);
				}),
				lang.hitch(this, function(errmsg){
					console.log(errmsg);
					this.finished(false, errmsg);
				})
			);
		},
		isTarget: function(sobj){
			if(sobj.type == 'time' && !this.option.exportTime.checked){
				return false;
			}else if(sobj.type == 'exp' && !this.option.exportExp.checked){
				return false;
			}else if(sobj.type == 'job' && !this.option.jointWork){
				return false;
			}
			if(this.option.jobMinimum && sobj.key == 'AtkJob__c' && !Object.keys(this.jobIdMap).length){
				return false;
			}
			return true;
		},
		getCondition: function(sobj){
			var wheres = [];
			if(sobj.emp){
				var v = "'" + this.empIds.join("','") + "'";
				wheres.push(str.substitute(sobj.wh, [v]));
			}
			if(sobj.type && sobj.wh2){
				var o = null;
				if(sobj.type == 'time' && this.option.exportTime.type == 1){
					o = this.option.exportTime;
				}else if(sobj.type == 'exp' && this.option.exportExp.type == 1){
					o = this.option.exportExp;
				}
				if(o){
					var d1 = (o.from || '1970-01-01');
					var d2 = (o.to   || '2999-12-31');
					var md1 = moment(d1, 'YYYY-MM-DD').add(-1, 'months');
					var md2 = moment(d2, 'YYYY-MM-DD').add( 1, 'months');
					var ym1 = md1.year() * 100 + (md1.month() + 1);
					var ym2 = md2.year() * 100 + (md2.month() + 1);
					wheres.push(str.substitute(sobj.wh2, [d1, d2, ym1, ym2]));
				}
			}
			if(this.option.jobMinimum && sobj.key == 'AtkJob__c'){
				var jobIds = Object.keys(this.jobIdMap);
				if(jobIds.length > 0){
					wheres.push("Id in ('" + jobIds.join("','") + "')");
				}
			}
			return (wheres.length ? ' where ' + wheres.join(' and ') : '');
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
		maskEmp: function(v, field){
			if(!v){
				return null;
			}
			// ユーザ名をマスク
			if(lang.isArray(field)
			&& field.length == 2
			&& /(CreatedBy|LastModifiedBy|Owner|Manager.Id__r|ManagerId__r|JobLeaderId__r|InputManager__r|Manager__r|UserId__r|ActorId__r|Approver.__r|Approver..__r|ApproverId__r)/.test(field[0])
			&& field[1] == 'Name'){
				return str.pad(v.substring(0, 1), v.length, "*", true);
			}
			// 社員名をマスク
			for(var i = 0 ; i < this.empNames.length ; i++){
				var name = this.empNames[i];
				if(v.indexOf(name) >= 0){
					var fistChar = name.replace(/^\_...\_/, '').substring(0, 1);
					return v.replace(name, str.pad(fistChar, name.length - (/^\_...\_/.test(name) ? 5 : 0), "*", true));
				}
			}
			return v;
		},
		maskNote: function(v, sobj, field){
			if(!v){
				return null;
			}
			// 備考、コメントをマスク
			if((sobj.key == 'AtkCommuterPass__c'   && ['Note__c'].indexOf(field.name) >= 0)
			|| (sobj.key == 'AtkEmpApply__c'       && ['Content__c','Note__c','ProcessComment__c'].indexOf(field.name) >= 0)
			|| (sobj.key == 'AtkEmpDay__c'         && ['Note__c','WorkNote__c'].indexOf(field.name) >= 0)
			|| (sobj.key == 'AtkEmpExp__c'         && ['Detail__c'].indexOf(field.name) >= 0)
			|| (sobj.key == 'AtkEmpWork__c'        && ['TaskNote__c'].indexOf(field.name) >= 0)
			|| (sobj.key == 'AtkExpApply__c'       && ['Comment__c','ProcessComment__c'].indexOf(field.name) >= 0)
			|| (sobj.key == 'AtkExpPreApply__c'    && ['Comment__c','ProcessComment__c','Content__c'].indexOf(field.name) >= 0)
			|| (sobj.key == 'AtkExpPreApplyDay__c' && ['Note__c'].indexOf(field.name) >= 0)
			|| (sobj.key == 'AtkJobApply__c'       && ['Note__c','ProcessComment__c'].indexOf(field.name) >= 0)
			|| (sobj.key == 'AtkJournal__c'        && ['Note__c'].indexOf(field.name) >= 0)
			){
				return str.pad("", v.length, "*", true);
			}
			return v;
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
						if(v && this.option.jobMinimum && f.referenceTo && f.referenceTo.indexOf('AtkJob__c') >= 0){
							this.jobIdMap[v] = 1;
						}
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
				if(typeof(v) == 'string' && (!f || f.typeName == 'STRING' || f.typeName == 'TEXTAREA')){
					if(this.option.maskEmp){
						v = this.maskEmp(v, field);
					}
					if(this.option.maskNote && f){
						v = this.maskNote(v, sobj, f);
					}
				}
				if(typeof(v) == 'string' && kakomi){
					pp.push('"' + v.replace(/"/g, '""') + '"');
				}else{
					pp.push(v);
				}
				if(this.option.stepHistory
				&& typeof(field) == 'string'
				&& field.toLowerCase() == 'id'
				&& Helper.getTargetApplyObjects().indexOf(sobj.key) >= 0){
					Agent.setApplyId(v);
				}
			}
			return pp;
		},
		download: function(){
			var objectList = this.dataLoader.getSObjectListCsv(this.sobjs);
			this.zip.file('object_list.csv', Util.unicodeStringToTypedArray(objectList.heads + '\n' + objectList.value, true), {binary:true});
			var fieldList = this.dataLoader.getFieldListCsv(this.sobjs);
			this.zip.file('object_fields.csv', Util.unicodeStringToTypedArray(fieldList.heads + '\n' + fieldList.value, true), {binary:true});
			var fname = str.substitute('${0}_${1}.zip', [this.organization.Id, moment().format('YYYYMMDDHHmmss')]);
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
