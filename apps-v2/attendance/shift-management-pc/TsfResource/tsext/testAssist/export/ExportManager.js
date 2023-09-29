define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/service/Request",
	"dojo/text!tsext/tsobj/json_fields.txt",
	"tsext/testAssist/export/ExportOrganization",
	"tsext/testAssist/export/ExportCommon",
	"tsext/testAssist/export/ExportEmps",
	"tsext/testAssist/export/ExportEmpTypes",
	"tsext/testAssist/export/ExportConfigs",
	"tsext/testAssist/export/ExportPatterns",
	"tsext/testAssist/export/ExportHolidays",
	"tsext/testAssist/export/ExportWorkLocations",
	"tsext/testAssist/export/ExportCalendars",
	"tsext/testAssist/export/ExportObjs",
	"tsext/testAssist/export/ExportVisitor",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, Request, json_fields, ExportOrganization, ExportCommon, ExportEmps, ExportEmpTypes, ExportConfigs, ExportPatterns, ExportHolidays, ExportWorkLocations, ExportCalendars, ExportObjs, ExportVisitor, Constant, Util){
	// 打刻
	return declare("tsext.testAssist.ExportManager", null, {
		/**
		 * @constructor
		 */
		constructor : function(parameter){
			this.sobjs = Util.fromJson(json_fields);
			this.organization = null;
			this.common = null;
			this.emps = new ExportEmps(this);
			this.empTypes = new ExportEmpTypes(this);
			this.configs  = new ExportConfigs(this);
			this.patterns = new ExportPatterns(this);
			this.holidays = new ExportHolidays(this);
			this.workLocations = new ExportWorkLocations(this);
			this.calendars = new ExportCalendars(this);
			this.privateOptions = new ExportObjs(this);
			this.empTypeIds = [];
			this.setParameter(parameter);
			this.tsVersion = '';
		},
		setParameter: function(parameter){
			this.applyStored = {};
			this.parameter = parameter;
		},
		checkApplyStored: function(applyId){
			if(this.applyStored[applyId]){
				return true;
			}
			this.applyStored[applyId] = 1;
			return false;
		},
		getSObj: function(key){
			var k = key.toLowerCase();
			for(var i = 0 ; i < this.sobjs.length ; i++){
				if(this.sobjs[i].key == k){
					return this.sobjs[i];
				}
			}
			return null;
		},
		getFieldNames: function(sobj){
			var names = [];
			var fields = sobj.fields || [];
			for(var i = 0 ; i < fields.length ; i++){
				names.push(fields[i].name);
			}
			return names;
		},
		setOrganization: function(records){
			this.organization = new ExportOrganization(this, records[0]);
		},
		// 組織
		getOrganization: function(){
			return this.organization;
		},
		setTsVersion: function(tsVersion){
			this.tsVersion = tsVersion;
		},
		getTsVersion: function(){
			return this.tsVersion;
		},
		getInfo: function(){
			var info = dojo.clone(this.organization.getRaw());
			delete info.CreatedDate;
			delete info.LastModifiedDate;
			info.TeamSpiritVersion = this.tsVersion;
			return info;
		},
		setCommon: function(records){
			this.common = new ExportCommon(this, records[0]);
		},
		getPrivateOptionsJson: function(){
			return Util.toJson(this.privateOptions.getRaws(), true);
		},
		isExistPrivateOptions: function(){
			return (this.privateOptions.size() > 0);
		},
		getTargetEmpIds: function(flag){
			if(flag){
				return "'" + this.parameter.empId + "'";
			}
			return [this.parameter.empId];
		},
		// 名前のプレフィックス
		getNamePrefix: function(){
			if(this.parameter.isPrefixOrgId){
				return this.organization.getId() + '-';
			}else{
				return this.parameter.prefixValue || '';
			}
		},
		getTargetStartDate: function(){ return this.parameter.sd; }, // CSV作成対象期間の開始日
		getTargetEndDate  : function(){ return this.parameter.ed; }, // CSV作成対象期間の終了日
		isHideEmpName: function(){ return this.parameter.isHideName || false; }, // 実名を使用しない
		isRangeAll: function(){ return this.parameter.isRangeAll || false; }, // 全期間
		getFullRange: function(){
			var emp = this.emps.get(0);
			if(emp){
				return emp.getFullRange();
			}
			return null;
		},
		/**
		 * Step2 で取得した情報をクリア
		 * ※ Step2 を再実行した時に重複してしまうのを防ぐため Step2 の再実行前に行う
		 */
		clearCollect: function(){
			this.emps.clearCollect();
			this.empTypes.clearCollect();
			this.configs.clearCollect();
			this.patterns.clearCollect();
			this.holidays.clearCollect();
			this.workLocations.clearCollect();
			this.calendars.clearCollect();
		},
		/**
		 * データ読み込みチェーンの開始
		 * @param {number} step  1 or 2
		 * @param {{errmsg:{string}, callback:{function}}}} expObj 
		 */
		fetchStart: function(step, expObj){
			expObj.errmsg = null;
			expObj.step = step;
			expObj.fetchNo = 0;
			if(step == 2){
				this.clearCollect();
			}
			expObj.fetchNext = lang.hitch(this, function(expObj){
				if(expObj.errmsg){
					return expObj.callback(expObj);
				}
				var fetchNo = expObj.fetchNo++;
				var funcs = null;
				if(expObj.step == 1){ // Step1（初期表示時）は下記を順番に取得
					funcs = [
						this.fetchOrganization,			// 組織（1件）
						this.fetchTsVersion,			// TSバージョン（1件）
						this.fetchCommon,				// 勤怠共通設定（1件）
						this.fetchPrivateOptions,		// チームスピリット設定（1件）
						this.fetchEmps, 				// 勤怠社員（1件）
						this.fetchEmpMonths,			// 勤怠月次（社員に関連する全て）
						this.fetchEmpTypes				// 勤務体系（社員の勤務体系,勤務体系履歴,勤怠月次に関連する全て）
					];
				}else{ // Step2（[CSV生成]ボタンで実行）は下記を順番に取得
					funcs = [
						this.fetchEmpApplys,			// 勤怠申請（社員に関連する承認済み/承認待ち/確定済みすべて）
						this.fetchEmpDays,				// 勤怠日次（社員に関連する全て）
						this.fetchEmpYuqs,				// 勤怠有休（社員に関連する全て）
						this.fetchEmpYuqDetails,		// 勤怠有休詳細（社員に関連する全て）
						this.fetchEmpStocks,			// 勤怠積休（社員に関連する全て）
						this.fetchEmpStockDetails,		// 勤怠積休詳細（社員に関連する全て）
						this.fetchEmpTypePatterns,		// 勤務体系別パターン（Step1で得た勤務体系に関連する全て）
						this.fetchEmpTypeHolidays,		// 勤務体系別休暇（Step1で得た勤務体系に関連する全て）
						this.fetchConfigs,				// 勤怠設定（Step1で得た勤務体系,勤怠月次に関連する全て）
						this.fetchCalendars,			// 勤怠カレンダー（Step1で得た勤務体系に紐づくか勤務体系がNullすべて）
						this.fetchPatterns, 			// 勤務パターン（Step1で得た勤務体系, Step2で得た勤怠カレンダー, 社員の勤怠申請,勤怠日次に関連する全て）
						this.fetchHolidays,				// 勤怠休暇（Step1で得た勤務体系, Step2で得た社員の勤怠申請,勤怠日次に関連する全て）
						this.fetchWorkLocations			// 勤務場所（全て）
					];
				}
				var func = (fetchNo >= funcs.length ? this.fetchFinish : funcs[fetchNo]);
				lang.hitch(this, func)(expObj);
			});
			expObj.fetchNext(expObj);
		},
		/**
		 * 勤怠共通設定と勤務場所データのみ読み込む
		 * @param {{errmsg:{string}, callback:{function}}}} expObj 
		 */
		fetchCommonAndRelated: function(expObj){
			expObj.errmsg = null;
			expObj.fetchNo = 0;
			this.workLocations.clearCollect();
			expObj.fetchNext = lang.hitch(this, function(expObj){
				if(expObj.errmsg){
					return expObj.callback(expObj);
				}
				var fetchNo = expObj.fetchNo++;
				var funcs = [
					this.fetchCommon,				// 勤怠共通設定（1件）
					this.fetchWorkLocations			// 勤務場所（全て）
				];
				var func = (fetchNo >= funcs.length ? this.fetchFinish : funcs[fetchNo]);
				lang.hitch(this, func)(expObj);
			});
			expObj.fetchNext(expObj);
		},
		outputExportCommon: function(lst){
			var visit = new ExportVisitor();
			this.common.outputExportCommon(lst, visit);
		},
		/**
		 * データ読み込みチェーンを終了後、親画面のcallback関数をコール
		 * @param {Object} expObj 
		 */
		fetchFinish: function(expObj){
			expObj.callback(expObj);
		},
		/**
		 * データ読み込み共通関数
		 * @param {Object} expObj 
		 * @param {string}} soql 
		 * @param {Function} method 
		 * @returns 
		 */
		fetchObjs: function(expObj, soql, method){
			return Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					if(method){
						method(records);
					}
					return expObj;
				}),
				lang.hitch(this, function(errmsg){
					expObj.errmsg = errmsg;
					return expObj;
				})
			);
		},
		/**
		 * 組織の読み込み
		 * @param {Object} expObj 
		 */
		fetchOrganization: function(expObj){
			this.fetchObjs(
				expObj,
				"select Id,Name,CreatedDate,LastModifiedDate,InstanceName,IsSandbox,FiscalYearStartMonth,OrganizationType from Organization",
				lang.hitch(this, this.setOrganization)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * TSバージョン
		 * @param {Object} expObj 
		 */
		fetchTsVersion: function(expObj){
			var chain = Request.actionA(
				tsCONST.API_GET_EXT_RESULT,
				{
					action: 'operateTestAssist',
					operateType: 'fetchTsVersion'
				},
				true
			).then(
				lang.hitch(this, function(result){
					this.setTsVersion(result.tsVersion);
					return expObj;
				}),
				lang.hitch(this, function(errmsg){
					expObj.errmsg = errmsg;
					return expObj;
				})
			);
			chain.then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤怠共通設定の読み込み
		 * @param {Object} expObj 
		 */
		 fetchCommon: function(expObj){
			var sobj = this.getSObj('AtkCommon__c');
			var fieldNames = this.getFieldNames(sobj);
			fieldNames.push('DefaultWorkLocationId__r.Name');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1}", [
					fieldNames.join(","),
					sobj.name
				]),
				lang.hitch(this, this.setCommon)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 
		 * @param {Object} expObj 
		 */
		 fetchPrivateOptions: function(expObj){
			var sobj = this.getSObj('AtkPrivateOptions__c');
			var fields = [
				'DisableFieldPrivilegeCheck__c',		// 項目権限チェックの無効化（#4386）
				'DisableTrigger__c',                    // トリガの無効化（#4386）
				'SmccApiUrl__c',                        // SMCC連携APIのURL（#4386）
				'EnableExtendedExpenseFunction__c',     // 拡張経費精算機能を使用する（#4705）
				'EmActive__c',                          // 人事マスターを使用する（#5492）
				'HRMActive__c',                         // TeamSpirit HRM を利用する（#8048）
				'UsingConnectICforPitTouch__c',         // IC連携機能でピットタッチ利用可（#7012）
				'UsingConnectICforPitTouchExpense__c',  // IC経費連携機能をピットタッチで利用可（#7393）
				'PitTouchLicenses__c',                  // ピットタッチライセンス数（#7137）
				'UsingJsNaviSystem__c',                 // J'sNAVI を使用する（#5761）
				'UsingJsNaviSystem2__c',                // J'sNAVI新インターフェイス を使用する（#8808）
				'UsingJudgeLegalHoliday__c'             // 法定休日判定を利用する（V5-394 月の最低休日日数の法定所定分割）
			];
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1}", [
					fields.join(","),
					sobj.name
				]),
				lang.hitch(this.privateOptions, this.privateOptions.initialize)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤怠社員の読み込み
		 * @param {Object} expObj 
		 */
		fetchEmps: function(expObj){
			var sobj = this.getSObj('AtkEmp__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where Id in (${2})", [
					this.getFieldNames(sobj).join(","),
					sobj.name,
					this.getTargetEmpIds(true)
				]),
				lang.hitch(this.emps, this.emps.initialize)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤怠月次の読み込み
		 * @param {Object} expObj 
		 */
		fetchEmpMonths: function(expObj){
			var sobj = this.getSObj('AtkEmpMonth__c');
			var fieldNames = this.getFieldNames(sobj);
			fieldNames.push('EmpApplyId__r.Status__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where EmpId__c in (${2})", [
					fieldNames.join(","),
					sobj.name,
					this.getTargetEmpIds(true)
				]),
				lang.hitch(this.emps, this.emps.addEmpMonths)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤務体系の読み込み
		 * 勤怠共通設定、勤怠有休付与設定も連結
		 * @param {Object} expObj 
		 */
		fetchEmpTypes: function(expObj){
			// 社員の勤務体系,勤務体系履歴,勤怠月次に紐づくすべての勤務体系IDの配列を得る
			this.empTypeIds = this.emps.getEmpTypeIds();
			var sobj = this.getSObj('AtkEmpType__c');
			var fieldNames = this.getFieldNames(sobj);
			fieldNames.push('ConfigBaseId__r.InitialDateOfMonth__c');
			fieldNames.push('ConfigBaseId__r.MarkOfMonth__c');
			fieldNames.push('ConfigBaseId__r.InitialDateOfYear__c');
			fieldNames.push('ConfigBaseId__r.MarkOfYear__c');
			fieldNames.push('ConfigBaseId__r.InitialDayOfWeek__c');
			fieldNames.push('(select Days__c,Year__c,Month__c,Suffix__c,Provide__c from AtkEmpTypeYuqR1__r order by Year__c, Month__c)');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where Id in ('${2}')", [
					fieldNames.join(","),
					sobj.name,
					this.empTypeIds.join("','")
				]),
				lang.hitch(this.empTypes, this.empTypes.initialize)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤怠申請の読み込み
		 * @param {Object} expObj 
		 */
		fetchEmpApplys: function(expObj){
			var sobj = this.getSObj('AtkEmpApply__c');
			var fieldNames = this.getFieldNames(sobj);
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where EmpId__c in (${2})"
					+ " and Status__c in ('承認済み','承認待ち','確定済み')", [
					fieldNames.join(","),
					sobj.name,
					this.getTargetEmpIds(true)
				]),
				lang.hitch(this.emps, this.emps.addEmpApplys)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤怠日次の読み込み
		 * @param {Object} expObj 
		 */
		fetchEmpDays: function(expObj){
			var sobj = this.getSObj('AtkEmpDay__c');
			var fieldNames = this.getFieldNames(sobj);
			fieldNames.push('EmpMonthId__r.EmpId__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where EmpMonthId__r.EmpId__c in (${2})", [
					fieldNames.join(","),
					sobj.name,
					this.getTargetEmpIds(true)
				]),
				lang.hitch(this.emps, this.emps.addEmpDays)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤怠有休の読み込み
		 * @param {Object} expObj 
		 */
		fetchEmpYuqs: function(expObj){
			var sobj = this.getSObj('AtkEmpYuq__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where EmpId__c in (${2})", [
					this.getFieldNames(sobj).join(","),
					sobj.name,
					this.getTargetEmpIds(true)
				]),
				lang.hitch(this.emps, this.emps.addEmpYuqs)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤怠有休詳細の読み込み
		 * @param {Object} expObj 
		 */
		fetchEmpYuqDetails: function(expObj){
			var sobj = this.getSObj('AtkEmpYuqDetail__c');
			var fieldNames = this.getFieldNames(sobj);
			fieldNames.push('EmpYuqId__r.EmpId__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where EmpYuqId__r.EmpId__c in (${2})", [
					fieldNames.join(","),
					sobj.name,
					this.getTargetEmpIds(true)
				]),
				lang.hitch(this.emps, this.emps.addEmpYuqDetails)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤怠積休の読み込み
		 * @param {Object} expObj 
		 */
		fetchEmpStocks: function(expObj){
			var sobj = this.getSObj('AtkEmpStock__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where EmpId__c in (${2})", [
					this.getFieldNames(sobj).join(","),
					sobj.name,
					this.getTargetEmpIds(true)
				]),
				lang.hitch(this.emps, this.emps.addEmpStocks)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤怠積休詳細の読み込み
		 * @param {Object} expObj 
		 */
		fetchEmpStockDetails: function(expObj){
			var sobj = this.getSObj('AtkEmpStockDetail__c');
			var fieldNames = this.getFieldNames(sobj);
			fieldNames.push('ConsumedByStockId__r.EmpId__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where ConsumedByStockId__r.EmpId__c in (${2})", [
					fieldNames.join(","),
					sobj.name,
					this.getTargetEmpIds(true)
				]),
				lang.hitch(this.emps, this.emps.addEmpStockDetails)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤務体系別パターンの読み込み
		 * @param {Object} expObj 
		 */
		fetchEmpTypePatterns: function(expObj){
			var sobj = this.getSObj('AtkEmpTypePattern__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where EmpTypeId__c in ('${2}')", [
					this.getFieldNames(sobj).join(","),
					sobj.name,
					this.empTypeIds.join("','")
				]),
				lang.hitch(this.empTypes, this.empTypes.addEmpTypePatterns)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤務体系別休暇休暇の読み込み
		 * @param {Object} expObj 
		 */
		fetchEmpTypeHolidays: function(expObj){
			var sobj = this.getSObj('AtkEmpTypeHoliday__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where EmpTypeId__c in ('${2}')", [
					this.getFieldNames(sobj).join(","),
					sobj.name,
					this.empTypeIds.join("','")
				]),
				lang.hitch(this.empTypes, this.empTypes.addEmpTypeHolidays)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤怠設定の読み込み
		 * @param {Object} expObj 
		 */
		fetchConfigs: function(expObj){
			var sobj = this.getSObj('AtkConfig__c');
			var fieldNames = this.getFieldNames(sobj);
			fieldNames.push('ConfigBaseId__r.OriginalId__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where (ConfigBaseId__c in ('${2}') or ConfigBaseId__r.OriginalId__c in ('${2}') or Id in ('${3}'))", [
					fieldNames.join(","),
					sobj.name,
					this.empTypes.getConfigBaseIds().join("','"),
					this.emps.getConfigIds().join("','")
				]),
				lang.hitch(this.configs, this.configs.initialize)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤怠カレンダーの読み込み
		 * @param {Object} expObj 
		 */
		fetchCalendars: function(expObj){
			var sobj = this.getSObj('AtkCalendar__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where (EmpTypeId__c = null or EmpTypeId__c in ('${2}'))", [
					this.getFieldNames(sobj).join(","),
					sobj.name,
					this.empTypeIds.join("','")
				]),
				lang.hitch(this.calendars, this.calendars.initialize)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤務パターンの読み込み
		 * @param {Object} expObj 
		 */
		fetchPatterns: function(expObj){
			var sobj = this.getSObj('AtkPattern__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where Id in ('${2}')", [
					this.getFieldNames(sobj).join(","),
					sobj.name,
					this.getPatternIds().join("','")
				]),
				lang.hitch(this.patterns, this.patterns.initialize)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤怠休暇の読み込み
		 * @param {Object} expObj 
		 */
		fetchHolidays: function(expObj){
			var sobj = this.getSObj('AtkHoliday__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1} where Id in ('${2}')", [
					this.getFieldNames(sobj).join(","),
					sobj.name,
					this.getHolidayIds().join("','")
				]),
				lang.hitch(this.holidays, this.holidays.initialize)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		/**
		 * 勤務場所の読み込み
		 * @param {Object} expObj 
		 */
		 fetchWorkLocations: function(expObj){
			var sobj = this.getSObj('WorkLocation__c');
			this.fetchObjs(
				expObj,
				str.substitute("select ${0} from ${1}", [
					this.getFieldNames(sobj).join(","),
					sobj.name
				]),
				lang.hitch(this.workLocations, this.workLocations.initialize)
			).then(lang.hitch(this, expObj.fetchNext));
		},
		getPatternIds: function(){
			var ids = [];
			Util.mergeList(ids, this.empTypes.getPatternIds());
			Util.mergeList(ids, this.emps.getPatternIds());
			Util.mergeList(ids, this.calendars.getPatternIds());
			return ids;
		},
		getHolidayIds: function(){
			var ids = [];
			Util.mergeList(ids, this.empTypes.getHolidayIds());
			Util.mergeList(ids, this.emps.getHolidayIds());
			return ids;
		},
		getEmpTypeById: function(id){
			return this.empTypes.getEmpTypeById(id);
		},
		getConfigById: function(id){
			return this.configs.getConfigById(id);
		},
		getConfigsByConfigBaseId: function(configBaseId){
			return this.configs.getConfigsByConfigBaseId(configBaseId);
		},
		getConfigByConfigBaseIdAndDate: function(configBaseId, d){
			return this.configs.getConfigByConfigBaseIdAndDate(configBaseId, d);
		},
		getPatternById: function(id){
			return this.patterns.getPatternById(id);
		},
		getHolidayById: function(id){
			return this.holidays.getHolidayById(id);
		},
		getPatternsByIds: function(ids, flag){
			return this.patterns.getPatternsByIds(ids, flag);
		},
		getHolidaysByIds: function(ids, flag){
			return this.holidays.getHolidaysByIds(ids, flag);
		},
		getWorkLocationById: function(id){
			return this.workLocations.getWorkLocationById(id);
		},
		getEmpYuqById: function(empId, yuqId){
			return this.emps.getEmpYuqById(empId, yuqId);
		},
		getEmpStockById: function(empId, stockId){
			return this.emps.getEmpStockById(empId, stockId);
		},
		getHolidayByManageName: function(name, flag){
			return this.holidays.getHolidayByManageName(name, flag);
		},
		getEmp: function(index){
			return this.emps.get(index);
		},
		getEmpMonthYmList: function(range){
			this.emps.buildEmps();
			var emp = this.emps.get(0);
			return emp.getEmpMonthYmList(range);
		},
		getExportCommon: function(){
			return this.common;
		},
		outputExportHeader: function(lst){
			lst.push(Util.arrayToCsvString(Constant.HEADERS));
		},
		/**
		 * CSVエクスポート（メイン）
		 * @param {Array.<string>} lst 
		 * @returns {Array.<string>}
		 */
		outputExportList: function(lst){
			var visit = new ExportVisitor();
			this.emps.buildEmps();
			var emp = this.emps.get(0);
			var virMonths = emp.getVirMonthsByDate(this.getTargetStartDate(), this.getTargetEndDate());
			// ヘッダ行
			this.outputExportHeader(lst);
			// 説明,,,{組織名} {TsVer} {社員名} {対象期間}
			this.organization.outputExportOrganization(lst, visit, emp, virMonths, this.tsVersion);
			// 勤務場所
			for(var i = 0 ; i < this.workLocations.size() ; i++){
				this.workLocations.get(i).outputExportWorkLocation(lst, visit);
			}
			// 勤怠共通設定
			this.common.outputExportCommon(lst, visit);
			var patterns = [];
			var holidays = [];
			for(var x = 0 ; x < virMonths.length ; x++){
				var virMonth = virMonths[x];
				patterns = virMonth.mergePatterns(patterns);
				holidays = virMonth.mergeHolidays(holidays);
			}
			// 勤怠休暇
			for(var i = 0 ; i < holidays.length ; i++){
				holidays[i].outputExportHoliday(lst, visit);
			}
			// 勤務パターン
			for(var i = 0 ; i < patterns.length ; i++){
				patterns[i].outputExportPattern(lst, visit);
			}
			// 勤務体系
			var empTypeMap = {};
			var dateMap = {};
			for(var x = 0 ; x < virMonths.length ; x++){
				var virMonth = virMonths[x];
				var empType = virMonth.getEmpType();
				virMonth.addInvolvedDateMap(dateMap); // 月度に関与する日付を収集
				if(empTypeMap[empType.getId()]){
					continue;
				}
				empTypeMap[empType.getId()] = empType;
				empType.outputExportEmpType(lst, visit, virMonth.getConfig(), holidays, patterns);
			}
			// 勤怠カレンダー
			this.calendars.outputExportCalendars(lst, visit, empTypeMap, dateMap);
			// 社員
			var empType = emp.getFirstEmpType(virMonths);
			emp.outputExportEmp(lst, visit, empType, virMonths);
			// 申請＆打刻
			var curLoad = {virMonth:virMonths[0], loaded:false};
			var prevEmpType = empType;
			var prevConfig = null;
			for(var x = 0 ; x < virMonths.length ; x++){
				var virMonth = virMonths[x];
				var empType = virMonth.getEmpType();
				var config = virMonth.getConfig();
				if(empType.getId() != prevEmpType.getId()){ // 勤務体系が変わった
					if(!virMonth.isChangeEmpType()){ // 勤務体系履歴にない
						emp.outputExportEmpChange(lst, visit, empType); // 社員の勤務体系を直接変更
					}
				}else if(prevConfig){
					// 勤務体系は同じで勤怠設定の内容が変わったかどうかをチェックし変わった場合は勤怠設定を変更
					config.outputExportConfigChange(lst, visit, empType, prevConfig, virMonth.getStartDate());
				}
				prevEmpType = empType;
				prevConfig = config;
				// 月次単位の申請、打刻
				virMonth.outputExportMonth(lst, visit, emp, config, curLoad);
			}
			return lst;
		}
	});
});
