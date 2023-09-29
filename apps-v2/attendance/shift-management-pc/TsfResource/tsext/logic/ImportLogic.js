define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/tsobj/Helper",
	"tsext/logic/DataLoader",
	"tsext/logic/SObjFromJson",
	"tsext/service/Request",
	"tsext/service/Agent",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Helper, DataLoader, SObjFromJson, Request, Agent, Util){
	return declare("tsext.logic.ImportLogic", null, {
		constructor : function(csobjs){
			this.csobjs = csobjs;
			this.dataLoader = new DataLoader();
			(new SObjFromJson()).load(this.dataLoader);
			this.referMap = {};
			this.updateReserveMap = {};
			this.idPairMap = {};
			this.empMonthEmpId = {};
			this.linkMap = {};
			this.empTypes = [];
			this.jobMasterMissing = false;
		},
		importLoop: function(reqInfo){
			this.reqInfo = reqInfo;
			this.exportSObjectList();
		},
		exportSObjectList: function(){
			this.reqInfo.outLog('オブジェクトリスト取得');
			this.dataLoader.getSObjectListLoop({
				outLog: this.reqInfo.outLog
			}).then(
				lang.hitch(this, this.exportSObjectInfo),
				lang.hitch(this, function(errmsg){
					this.reqInfo.finished(false, errmsg);
				})
			);
		},
		exportSObjectInfo: function(){
			this.reqInfo.outLog('オブジェクト定義取得');
			this.dataLoader.getSObjectInfoLoop({
				sobjs : Helper.getTargetSObjects(),
				outLog: this.reqInfo.outLog
			}).then(
				lang.hitch(this, function(){
					this.scanReference();
				}),
				lang.hitch(this, function(errmsg){
					this.reqInfo.finished(false, errmsg);
				})
			);
		},
		loadPrefixNames: function(index, nameMap, outLog, callback){
			if(index >= Helper.getTargetCheckName().length){
				callback(true);
				return;
			}
			var name = Helper.getTargetCheckName()[index];
			var req = {
				soql: str.substitute("select Id, Name from ${0} where Name like '\\_%'", [name]),
				limit: 50000,
				offset: 0
			};
			Request.actionA(tsCONST.API_SEARCH_DATA, req, true).then(
				lang.hitch(this, function(result){
					var mp = {};
					for(var i = 0 ; i < result.records.length ; i++){
						var m = /\_...\_/.exec(result.records[i].Name);
						if(m){
							mp[m[0]] = 1;
						}
					}
					console.log(name);
					console.log(mp);
					lang.mixin(nameMap, mp);
					this.loadPrefixNames(index + 1, nameMap, outLog, callback);
				}),
				lang.hitch(this, function(errmsg){
					callback(false, errmsg);
				})
			);
		},
		scanReference: function(){
			this.referMap = {};
			this.updateReserveMap = {};
			this.jobMasterMissing = false;
			this.csobjs.scanReferencesRecursive(this.reqInfo, this.referMap);
			this.csobjs.importAllOption(this.reqInfo, this.referMap);
			console.log(this.referMap);
			this.reqInfo.outLog('データインポート開始');
			if(this.reqInfo.updateCommon){
				this.dataImportStep1();
			}else{
				this.dataImportStep2();
			}
//			array.forEach(Helper.getImportOrder(), function(name){
//				var sobj = this.csobjs.getSobjByName(name);
//				var csvRows = sobj.getCsvRows();
//				var cnt = 0;
//				for(var i = 0 ; i < csvRows.length ; i++){
//					var csvRow = csvRows[i];
//					if(this.referMap[csvRow.getId()]){
//						cnt++;
//					}
//				}
//				console.log(sobj.getLocalName() + ' all=' + csvRows.length + ', target=' + cnt);
//			}, this);
		},
		dataImportStep1: function(){
			this.importAtkCommon().then(
				lang.hitch(this, function(){
					console.log('importAtkCommon - ok!');
					this.dataImportStep2();
				}),
				lang.hitch(this, function(errmsg){
					console.log('importAtkCommon - error!');
					this.reqInfo.finished(false, errmsg);
				})
			);
		},
		dataImportStep2: function(){
			this.empMonthEmpId = {};
			this.importSObject(
				Helper.getImportOrder(),
				0,
				0,
				lang.hitch(this, function(succeed, errmsg){
					if(succeed){
						this.updateReserved();
					}else{
						this.reqInfo.finished(false, errmsg);
					}
				}
			));
		},
		importAtkCommon: function(){
			var deferred = new Deferred();
			this.reqInfo.outLog('AtkCommon__c update');
			var common = this.csobjs.getSobjByName('AtkCommon__c');
			this.dataLoader.getData({
				sobj  : common,
				outLog: this.reqInfo.outLog
			}).then(
				lang.hitch(this, function(result){
					console.log(common);
					console.log(result.sobj);
					console.log(result.soql);
					console.log(result.records);
					var realFields = common.getCsvFields();
					var csvRows = common.getCsvRows();
					var csvRow = (csvRows.length ? csvRows[0] : null);
					var record = (result.records.length ? result.records[0] : null);
					var req = {
						action: "updateSObject",
						objName: Util.adaptPrefix(common.getName()),
						idList: [],
						values: {},
						typeMap: {}
					};
					if(csvRow && record){
						req.idList.push(record.Id);
						req.values[record.Id] = {};
						var orgId = csvRow.getId();
						this.idPairMap[orgId] = {
							objName: Util.adaptPrefix(common.getName()),
							newId: record.Id
						};
						// AtkCommon__cの更新対象項目を絞る。
						for(var i = 0 ; i < realFields.length ; i++){
							var f = realFields[i];
							var existField = this.getExistField(common, f);
							if(!existField || !f.isCustom || f.isCalculated || f.isAutoNumber){
								continue;
							}
							var fieldName = Util.adaptPrefix(f.name);
							if(fieldName.toLowerCase().indexOf('localkey__c') >= 0){
								continue;
							}
							var v1 = Util.combinedNull(f.getObjectValue(record));
							var v2 = Util.combinedNull(csvRow.getValueByField(f));
							var configContainsJtb = this.isCommonConfigContainsJtb(fieldName, v2);
							if(v2 && (f.type == 'REFERENCE' || configContainsJtb)){
								this.setUpdateReserve(orgId, {
									objName: Util.adaptPrefix(common.getName()),
									fieldName: fieldName,
									orgId: v2,
									configContainsJtb: configContainsJtb
								});
								if(f.type == 'REFERENCE' && f.referenceTo){
									this.referMap[v2] = f.referenceTo;
								}
								continue;
							}
							if(v1 != v2){
								this.reqInfo.outLog('  ' + fieldName + ' [' + (v1 || '') + '] => [' + (v2 || '') + ']');
								if(f.type == 'BOOLEAN'){
									req.values[record.Id][fieldName] = v2 || false;
								}else{
									req.values[record.Id][fieldName] = v2;
								}
								req.typeMap[fieldName] = f.getType();
							}
						}
					}
					if(Object.keys(req.typeMap).length){
						Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
							lang.hitch(this, function(result){
								deferred.resolve();
							}),
							lang.hitch(this, function(errmsg){
								this.reqInfo.outLog('AtkCommon__c update failed');
								this.reqInfo.outLog(errmsg);
								deferred.reject(errmsg);
							})
						);
					}else{
						deferred.resolve();
					}
				}),
				lang.hitch(this, function(errmsg){
					deferred.reject(errmsg);
				})
			);
			return deferred.promise;
		},
		isCommonConfigContainsJtb: function(fieldName, v){
			// AtkCommon__c.Config__cの項目でJTBの設定を含んでいれば、trueを返す
			if(!v || fieldName.toLowerCase() != Util.adaptPrefix("Config__c").toLowerCase()){
				return false;
			}
			var c = Util.fromJson(v);
			if(c && c.jtbExpItem){
				// 出張手配設定の費目はすべてインポートするため、this.referMapにセット
				var elements = ['j1','j2','j3','j4','f1','f2','f3','f4','e1','e2','e3','e4'];
				for(var i = 0 ; i < elements.length ; i++){
					var element = elements[i];
					var items = c.jtbExpItem[element] || [];
					for(var j = 0 ; j < items.length ; j++){
						this.referMap[items[j]] = 'AtkExpItem__c';
					}
				}
				return true;
			}
			return false;
		},
		getConvertedCommonConfig: function(v){
			// AtkCommon__c.Config__cのID値を差し替えて返す
			var c = Util.fromJson(v);
			if(c && c.jtbExpItem){
				var elements = ['j1','j2','j3','j4','f1','f2','f3','f4','e1','e2','e3','e4'];
				for(var i = 0 ; i < elements.length ; i++){
					var element = elements[i];
					var items = c.jtbExpItem[element] || [];
					for(var j = 0 ; j < items.length ; j++){
						var pair = this.idPairMap[items[j]];
						var newId = (pair && pair.newId) || null;
						if(newId){
							items[j] = newId;
						}
					}
					c.jtbExpItem[element] = items;
				}
				return Util.toJson(c);
			}
			return v;
		},
		importSObject: function(objNames, index, row, callback){
			if(objNames.length <= index){
				callback(true);
				return;
			}
			var objName = Util.adaptPrefix(objNames[index]);
			var sobj = this.csobjs.getSobjByName(objName);
			if(sobj.getRawName() == 'AtkJobAssign__c' && this.jobMasterMissing){
				// AtkJob__c がないのにAtkJobAssign__c を取り込もうとしてエラーになる不具合があったため、その防止策
				this.importSObject(objNames, index + 1, 0, callback);
				return;
			}
			var csvRows = sobj.getCsvRows(this.referMap);
			if(!csvRows.length){
				if(sobj.getRawName() == 'AtkJob__c'){
					this.jobMasterMissing = true;
				}
				this.importSObject(objNames, index + 1, 0, callback);
				return;
			}
			this.importSObjectRow(sobj, csvRows, row).then(
				lang.hitch(this, function(lastRow){
					if(lastRow){
						this.importSObject(objNames, index + 1, 0, callback);
					}else{
						this.importSObject(objNames, index, row + 1, callback);
					}
				}),
				lang.hitch(this, function(errmsg){
					this.reqInfo.outLog(objName + ' insert failed');
					this.reqInfo.outLog(errmsg);
					callback(false, errmsg);
				})
			);
		},
		/**
		 * フィールド名がインポート先のフィールド定義にある場合のみフィールド定義情報を返す
		 * @param {Object} sobj (インポート先の)SObject情報
		 * @param {Object} field CSVから読み取ったフィールド定義情報
		 * @return {Object|null} !=null:インポート先フィールド定義情報, ==null:該当なし
		 */
		getExistField: function(sobj, field){
			var info = Agent.getSObject(Util.adaptPrefix(sobj.getName()));
			if(!info){
				return null;
			}
			// 1)インポート先に合わせて名前空間を追加(または除去)したフィールド名で検索
			// （ユーザ定義の項目はヒットしない。例:sumh_KANGO__c）
			var name = Util.adaptPrefix(field.getName()).toLowerCase();
			for(var i = 0 ; i < info.exFields.length ; i++){
				var f = info.exFields[i];
				if(f.name.toLowerCase() == name){
					return f;
				}
			}
			// 2)名前空間考慮なしのフィールド名で検索(ユーザ定義の項目を検索)
			// TODO  型を考慮してない
			name = field.getName().toLowerCase();
			for(var i = 0 ; i < info.exFields.length ; i++){
				var f = info.exFields[i];
				if(f.name.toLowerCase() == name){
					return f;
				}
			}
			return null;
		},
		setLinkMap: function(sobj, record){
			var empId = null;
			if(sobj.getRawName() == 'AtkEmp__c'){
				empId = record.Id;
			}else if(sobj.getRawName() == 'AtkEmpType__c'){
				this.empTypes.push(record);
				return;
			}else{
				empId = record.EmpId__c || null;
			}
			if(!empId){
				return;
			}
			var obj = this.linkMap[empId];
			if(!obj){
				obj = this.linkMap[empId] = {times:[],jobs:[],exps:[],pres:[],empExp:false};
			}
			if(sobj.getRawName() == 'AtkEmp__c'){
				obj.name = record.Name;
			}else if(sobj.getRawName() == 'AtkEmpMonth__c'){
				obj.times.push({month:record.YearMonth__c, subNo:(record.SubNo__c || null)});
			}else if(sobj.getRawName() == 'AtkJobApply__c'){
				obj.jobs.push({month:record.YearMonth__c, subNo:(record.SubNo__c || null)});
			}else if(sobj.getRawName() == 'AtkExpApply__c'){
				obj.exps.push({id:record.Id}); // ExpApplyNo__cを拾えると良い
			}else if(sobj.getRawName() == 'AtkExpPreApply__c'){
				obj.pres.push({id:record.Id}); // ExpPreApplyNo__cを拾えると良い
			}else if(sobj.getRawName() == 'AtkEmpExp__c'){
				obj.empExp = true;
			}
		},
		getLinkMap: function(){
			return this.linkMap;
		},
		getEmpTypes: function(){
			return this.empTypes || [];
		},
		importSObjectRow: function(sobj, csvRows, row){
			var deferred = new Deferred();
			var csvRow = csvRows[row];
			if(sobj.getRawName() == 'AtkEmpMonth__c'){
				this.empMonthEmpId[csvRow.getId()] = csvRow.getValueByName('EmpId__c');
			}
			var req = {
				action: "insertSObject",
				key: Util.adaptPrefix(sobj.getName()),
				values: [],
				typeMap: {}
			};
			var realFields = sobj.getCsvFields();
			var orgId = csvRow.getId();
			var vobj = {};
			for(var i = 0 ; i < realFields.length ; i++){
				var f = realFields[i];
				var existField = this.getExistField(sobj, f);
				if(!existField || f.type == 'LOCATION'){
					continue;
				}
				var fieldName = existField.name;
				var v = csvRow.getValueByField(f);
				var fieldRawName = Util.rawName(f.name);
				if(/^(AtkEmpMonth__c|AtkJobApply__c)$/.test(sobj.getRawName()) && fieldRawName == 'UniqKey__c'){
					var empId = csvRow.getValueByName('EmpId__c');
					var yearMonth = csvRow.getValueByName('YearMonth__c');
					var subNo = csvRow.getNumberByName('SubNo__c');
					var pair = this.idPairMap[empId];
					vobj[fieldName] = pair.newId + yearMonth + (subNo ? ('_' + subNo) : '');
				}else if(sobj.getRawName() == 'AtkEmpDay__c' && fieldRawName == 'UniqKey__c'){
					var empMonthId = csvRow.getValueByName('EmpMonthId__c');
					var empId = this.empMonthEmpId[empMonthId];
					var dt = csvRow.getValueByName('Date__c');
					var pair = this.idPairMap[empId];
					vobj[fieldName] = pair.newId + dt.replace(/\-/g, '');
				}else if(sobj.getRawName() == 'AtkEmp__c' && fieldRawName == 'UsingJsNaviSystem__c'){
					vobj[fieldName] = false;
				}else if(sobj.getRawName() == 'AtkEmp__c' && fieldRawName == 'JsNaviId__c'){
					vobj[fieldName] = null;
				}else if(sobj.getRawName() == 'AtkEmp__c' && fieldRawName == 'Manager__c'){
					vobj[fieldName] = Agent.getUserId();
				}else if(sobj.getRawName() == 'AtkEmp__c' && fieldRawName == 'EmpTypeHistory__c'){ // 勤務体系履歴
					var eths = (v && Util.fromJson(v) || []);
					if(eths.length){
						for(var x = 0 ; x < eths.length ; x++){
							var eth = eths[x];
							var pair = (eth.empTypeId ? this.idPairMap[eth.empTypeId] : null);
							if(pair && pair.newId){
								eth.empTypeId = pair.newId;
							}
						}
						vobj[fieldName] = Util.toJson(eths);
					}else{
						vobj[fieldName] = null;
					}
				}else if(fieldRawName == 'Status__c'){
					if(v == '承認待ち' && !this.reqInfo.rawStatus){
						vobj[fieldName] = '承認済み';
					}else{
						vobj[fieldName] = v;
					}
				}else if(v && f.type == 'REFERENCE'){
					var pair = this.idPairMap[v];
					if(pair){
						vobj[fieldName] = pair.newId;
					}else{
						this.setUpdateReserve(orgId, {
							objName: Util.adaptPrefix(sobj.getName()),
							fieldName: fieldName,
							orgId: v
						});
						continue;
					}
				}else{
					if(/^(Name|DeptCode__c|ItemCode__c|IDm__c)$/i.test(fieldRawName)){
						vobj[fieldName] = this.reqInfo.prefix + v.replace(/^\_...\_/, '');
					}else if(/^EmpCode__c$/i.test(fieldRawName)){
						if(v){
							vobj[fieldName] = this.reqInfo.prefix + v.replace(/^\_...\_/, '');
						}else{
							vobj[fieldName] = null;
						}
					}else if(/^EmpTypeCode__c$/i.test(fieldRawName)){
						vobj[fieldName] = null;
					}else if(f.type == 'DATETIME'){
						vobj[fieldName] = (v ? v + ':00' : null);
					}else{
						vobj[fieldName] = v;
					}
					if((f.type == 'STRING' || f.type == 'TEXTAREA')
					&& vobj[fieldName]
					&& vobj[fieldName].length > f.length){
						vobj[fieldName] = vobj[fieldName].substring(0, f.length);
					}
				}
				// TODO JSONテキストでIDを参照している場合、IDを差し替える処理が必要
				req.typeMap[fieldName] = f.type;
			}
			this.reqInfo.outLog(sobj.getName() + ' insert ' + (vobj.Name || ''));
			req.values.push(vobj);
			Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(result){
					this.setLinkMap(sobj, result.records[0]);
					this.idPairMap[orgId] = {
						objName: Util.adaptPrefix(sobj.getName()),
						newId: result.records[0].Id
					};
					deferred.resolve(row == (csvRows.length - 1));
				}),
				lang.hitch(this, function(errmsg){
					this.reqInfo.outLog(sobj.getName() + ' insert failed');
					this.reqInfo.outLog(errmsg);
					deferred.reject(errmsg);
				})
			);
			return deferred.promise;
		},
		setUpdateReserve: function(id, vals){
			var obj = this.updateReserveMap[id];
			if(!obj){
				obj = { values:[] };
				this.updateReserveMap[id] = obj;
			}
			obj.values.push(vals);
		},
		updateReserved: function(){
			var upIds = Object.keys(this.updateReserveMap);
			this.updateSObject(upIds, 0, lang.hitch(this, function(){
				this.reqInfo.finished(true);
			}));
		},
		updateSObject: function(upIds, index, callback){
			if(upIds.length <= index){
				callback(true);
				return;
			}
			var upId = upIds[index];
			var pair = this.idPairMap[upId];
			if(!pair){
				this.updateSObject(upIds, index + 1, callback);
				return;
			}
			var targetId = pair.newId;
			var sobj = Agent.getSObjById(upId);
			if(!sobj){
				this.updateSObject(upIds, index + 1, callback);
				return;
			}
			var upd = this.updateReserveMap[upId];
			var req = {
				action: "updateSObject",
				objName: Util.adaptPrefix(sobj.getName()),
				idList: [],
				values: {},
				typeMap: {}
			};
			req.idList.push(targetId);
			req.values[targetId] = {};
			var logs = [];
			logs.push(sobj.getName() + ' update ' + targetId);
			for(var i = 0 ; i < upd.values.length ; i++){
				var v = upd.values[i];
				if(v.configContainsJtb){
					req.values[targetId][v.fieldName] = this.getConvertedCommonConfig(v.orgId);
					req.typeMap[v.fieldName] = 'TEXTAREA';
					logs.push('  ' + v.fieldName + ' [' + v.orgId + '] => [' + req.values[targetId][v.fieldName] + ']');
				}else{
					var pair = this.idPairMap[v.orgId];
					var newId = (pair && pair.newId) || null;
					if(newId){
						req.values[targetId][v.fieldName] = newId;
						req.typeMap[v.fieldName] = 'REFERENCE';
						logs.push('  ' + v.fieldName + ' [' + v.orgId + '] => [' + newId + ']');
					}
				}
			}
			if(!Object.keys(req.typeMap).length){
				this.updateSObject(upIds, index + 1, callback);
				return;
			}
			for(var i = 0 ; i < logs.length ; i++){
				this.reqInfo.outLog(logs[i]);
			}
			this.updateSObjectRow(sobj, req).then(
				lang.hitch(this, function(){
					this.updateSObject(upIds, index + 1, callback);
				}),
				lang.hitch(this, function(errmsg){
					callback(false, errmsg);
				})
			);
		},
		updateSObjectRow: function(sobj, req){
			var deferred = new Deferred();
			Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(result){
					deferred.resolve();
				}),
				lang.hitch(this, function(errmsg){
					this.reqInfo.outLog(sobj.getName() + ' update failed');
					this.reqInfo.outLog(errmsg);
					deferred.reject(errmsg);
				})
			);
			return deferred.promise;
		}
	});
});
