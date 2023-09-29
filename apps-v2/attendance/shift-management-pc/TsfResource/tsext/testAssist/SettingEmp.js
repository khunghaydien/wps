define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/service/Request",
	"tsext/testAssist/EntryBase1",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/testAssist/DefaultSettings",
	"tsext/util/TsError",
	"tsext/util/Util"
], function(declare, lang, array, str, Request, EntryBase1, Current, Constant, DefaultSettings, TsError, Util){
	// 社員
	return declare("tsext.testAssist.SettingEmp", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor: function(args, lineNo){
			this.emp = DefaultSettings.getDefaultEmp();
			this.emp.Name = this.getItem(0); // 名称
			if(this.getOption() == Constant.OPTION_NEW // オプション=新規
			|| this.getOption() == Constant.OPTION_CHANGE // 変更
			){
				this.setContinued(true);
			}else if(this.getOption() != Constant.OPTION_DELETE){
				this.addError(Constant.ERROR_UNDEFINED); // 未定義
			}
		},
		/**
		 * @param {tsext.testAssist.EntryBase1} el
		 */
		setSetting: function(el){
			var item1 = el.getItem(0);
			var item2 = el.getItem(1);
			if(this.MN(item1, Constant.SET_EMP_NAME)){ // 名称
				this.emp.Name = item2;
			}else if(this.MN(item1, Constant.SET_EMP_CODE)){ // コード
				this.emp.EmpCode__c = item2;
			}else if(this.MN(item1, Constant.SET_ENTRY_DATE)       ){ try{ this.emp.EntryDate__c          = this.getDate(item2, true);    }catch(e){ this.addNgElement(el,e); } // 入社日
			}else if(this.MN(item1, Constant.SET_END_DATE)         ){ try{ this.emp.EndDate__c            = this.getDate(item2, true);    }catch(e){ this.addNgElement(el,e); } // 退社日
			}else if(this.MN(item1, Constant.SET_NEXT_PROVIDE_DATE)){ try{ this.emp.NextYuqProvideDate__c = this.getDate(item2, true);    }catch(e){ this.addNgElement(el,e); } // 次回有休付与日
			}else if(this.MN(item1, Constant.SET_TS_ADMIN)         ){ try{ this.emp.IsAdmin__c            = this.getBoolean(item2, true); }catch(e){ this.addNgElement(el,e); } // 管理機能の使用
			}else if(this.MN(item1, Constant.SET_TS_ALL_EDIT)      ){ try{ this.emp.IsAllEditor__c        = this.getBoolean(item2, true); }catch(e){ this.addNgElement(el,e); } // 全社員のデータ編集
			}else if(this.MN(item1, Constant.SET_TS_ALL_READ)      ){ try{ this.emp.IsAllReader__c        = this.getBoolean(item2, true); }catch(e){ this.addNgElement(el,e); } // 全社員のデータ参照
			}else if(this.MN(item1, Constant.SET_TS_EXP_ADMIN)     ){ try{ this.emp.IsExpAdmin__c         = this.getBoolean(item2, true); }catch(e){ this.addNgElement(el,e); } // 経費管理機能の使用
			}else if(this.MN(item1, Constant.SET_TS_JOB_ADMIN)     ){ try{ this.emp.IsJobAdmin__c         = this.getBoolean(item2, true); }catch(e){ this.addNgElement(el,e); } // ジョブ管理機能の使用
			}else if(this.MN(item1, Constant.SET_ACCESS_CONTROL)   ){ // 入退館管理
				try{
					if(item2 == '対象'){
						this.emp.InputAccessControlFlag__c = '1';
					}else if(item2 == '対象外'){
						this.emp.InputAccessControlFlag__c = '0';
					}else{
						this.emp.InputAccessControlFlag__c = (this.getBoolean(item2, true) ? '1' : '0');
					}
				}catch(e){
					this.addNgElement(el,e);
				}
			}else if(this.MN(item1, Constant.SET_EMPTYPE_NAME)
					|| this.MN(item1, Constant.SET_DEPT_NAME)
					|| this.MN(item1, Constant.SET_MANAGER)
					|| this.MN(item1, Constant.SET_USER)){
			}else{
				this.addNgElement(el, new TsError(Constant.ERROR_UNDEFINED)); // 未定義
			}
		},
		setSetting2: function(el){
			var item1 = el.getItem(0);
			var item2 = el.getItem(1);
			if(this.MN(item1, Constant.SET_EMPTYPE_NAME)   ){ try{ this.emp.EmpTypeId__c = Current.getIdByName('empTypes', item2); }catch(e){ this.addNgElement(el,e); } // 勤務体系名
			}else if(this.MN(item1, Constant.SET_DEPT_NAME)){ try{ this.emp.DeptId__c    = Current.getIdByName('depts'   , item2); }catch(e){ this.addNgElement(el,e); } // 部署名
			}else if(this.MN(item1, Constant.SET_MANAGER)  ){ try{ this.emp.Manager__c   = Current.getIdByName('users'   , item2); }catch(e){ this.addNgElement(el,e); } // 上長
			}else if(this.MN(item1, Constant.SET_USER)     ){ try{ this.emp.UserId__c    = Current.getIdByName('users'   , item2); }catch(e){ this.addNgElement(el,e); } // ユーザ
			}
		},
		/**
		 * 入力直前のチェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			for(var i = 0 ; i < this.getElements().length ; i++){
				this.setSetting2(this.getElement(i));
			}
			this.empId = null;
			if(this.isDelete() || this.isChange()){ // 削除 or 変更
				try{
					this.empId = Current.getIdByName('emps', this.emp.Name, false, true);
				}catch(e){
					this.addError(e.getErrorLevel(), e.getMessage());
				}
				if(!this.empId){
					this.addError(Constant.ERROR_LEVEL_1, Constant.ERROR_NOTFOUND);
				}
			}else{
				if(Current.getIdByName('emps', this.emp.Name, true, true)){
					this.addError(Constant.ERROR_NAME_DUPLICATE2, ['社員']);
				}
			}
			return this.inherited(arguments);
		},
		getEmp: function(flag){
			var obj = lang.clone(this.emp);
			if(flag){
				obj.Config__c    = Util.toJson(obj.Config__c);
				obj.ExpConfig__c = Util.toJson(obj.ExpConfig__c);
			}
			return obj;
		},
		getSoql: function(){
			var obj = this.getEmp();
			var keys = ['Id'].concat(Object.keys(obj));
			var soql = "select ${0} from AtkEmp__c where Id = '${1}'";
			return str.substitute(soql, [keys.join(','), this.empId]);
		},
		/**
		 * 社員を入力
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			bagged.outputLog(this.getEntryName());
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			if(this.isChange()){ // 変更（勤務体系の変更のみ）
				var soql = this.getSoql();
				var chain = Request.fetch(soql, true).then(
					lang.hitch(this, function(records){
						var settingEmp = this.getEmp();
						this.emp = records[0];
						this.emp.EmpTypeId__c = settingEmp.EmpTypeId__c;
						return bagged.stayResult();
					}),
					lang.hitch(this, function(errmsg){
						return bagged.stayResult(this.addError(errmsg));
					})
				);
				chain.then(lang.hitch(this, this.execute2));
			}else{
				this.execute2(bagged);
			}
		},
		/**
		 * 社員を入力2
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute2: function(bagged){
			if(bagged.stopped()){
				return;
			}
			var req = {
				action: 'operateTestAssist'
			};
			if(this.isDelete()){
				req.operateType = 'deleteEmp';
				req.empId = this.empId;
			}else if(this.isChange()){
				req.operateType = 'changeEmp';
				req.empId = this.empId;
				req.emp = this.getEmp(true);
			}else{
				req.operateType = 'settingEmp';
				req.emp = this.getEmp(true);
			}
			var chain = Current.request(req, bagged).then(
				lang.hitch(this, function(result){
					var resultObj = null;
					if(result && result.emp){
						resultObj = {
							result: 0,
							name: str.substitute('【社員】 ${0}', [result.emp.Name]),
							href: tsCONST.empEditView + '?empId=' + result.emp.Id
						};
					}
					return bagged.stayResult(resultObj);
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(this, function(bagged){
				if(bagged.stopped()){
					return;
				}
				Current.fetchMaster(bagged.getDistributor(), ['emps']).then(
					lang.hitch(this, function(){
						bagged.doneResult();
					}),
					lang.hitch(this, function(errmsg){
						bagged.doneResult(this.addError(errmsg));
					})
				);
			}));
		}
	});
});
