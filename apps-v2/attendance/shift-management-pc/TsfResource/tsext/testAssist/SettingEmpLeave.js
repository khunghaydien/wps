define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/service/Request",
	"tsext/testAssist/EntryBase1",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/TsError",
	"tsext/util/Util"
], function(declare, lang, array, str, Request, EntryBase1, Current, Constant, TsError, Util){
	// 有休・日数管理休暇付与
	return declare("tsext.testAssist.SettingEmpLeave", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor: function(args, lineNo){
			this.empLeave = this.getDefaultEmpLeave();
			if(this.subKey == Constant.KEY_LEAVE_REMOVE){
				this.minusFlag = true;
			}
			this.alone = true;
		},
		/**
		 */
		setSetting: function(){
		},
		setSetting2: function(){
			try{
				this.empLeave.empId				= Current.getIdByName('emps', this.getItem(0));
				this.empLeave.stockType			= this.getItem(1);
				this.empLeave.provideDays		= this.getFloat(this.getItem(2), true);
				this.empLeave.provideHours		= this.getTime(this.getItem(3), true);
				this.empLeave.startDate			= this.getDate(this.getItem(4));
				this.empLeave.limitDate			= this.getDate(this.getItem(5), true);
				this.empLeave.subject			= this.getItem(6);
				this.empLeave.autoFlag			= this.getBoolean(this.getItem(7), true);
				this.empLeave.notObligatoryFlag	= this.getBoolean(this.getItem(8), true);
				this.empLeave.nextProvideDate	= this.getDate(this.getItem(9), true);
				this.empLeave.minusSubject		= this.getItem(10);
			}catch(e){
				this.addError(e.getMessage());
			}
			if(this.empLeave.stockType == '年次有給休暇' || this.empLeave.stockType == '有休'){
				this.empLeave.stockType = null;
				if(this.empLeave.provideHours){
					this.empLeave.provideHours /= 60; // 有休の時間単位付与は1hなら1をセットする
				}
			}else if(this.empLeave.stockType == '代休'){
				this.empLeave.stockType = '代休';
			}else{
				var manageNames = Current.getManageNames();
				if(manageNames.indexOf(this.empLeave.stockType) < 0){
					this.addError(Constant.ERROR_UNDEFINED);
				}
			}
		},
		/**
		 * 入力直前のチェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			this.setSetting2();
			return this.isValid();
		},
		getEmpLeave: function(flag){
			var obj = lang.clone(this.empLeave);
			return obj;
		},
		getDefaultEmpLeave: function(){
			return {
				empId: null,
				stockType: null,
				provideDays: null,
				provideHours: null,
				startDate: null,
				limitDate: null,
				subject: null,
				plus: true,
				autoFlag: false,
				notObligatoryFlag: true,
				nextProvideDate: null,
				targetId: null
			};
		},
		/**
		 * 休暇付与
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			bagged.outputLog(this.getEntryName());
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			if(!this.minusFlag){ // 付与
				this.grantLeave(bagged);
			}else{ // 剥奪
				// 剥奪対象の付与を得るためデータを取得
				var empLeave = this.getEmpLeave(true);
				var soql = "select Id,Name,StartDate__c,LimitDate__c";
				if(!empLeave.stockType){ // 有休
					soql += str.substitute(",Subject__c,TotalTime__c from AtkEmpYuq__c where EmpId__c = '${0}'", [empLeave.empId]);
				}else{ // 代休or日数管理休暇
					soql += str.substitute(",Days__c from AtkEmpStock__c where EmpId__c = '${0}' and Type__c = '${1}'", [empLeave.empId, empLeave.stockType]);
				}
				console.log(soql);
				var fetch = Request.fetch(soql, true).then(
					lang.hitch(this, function(records){
						this.history = records;
						for(var i = 0 ; i < this.history.length ; i++){
							var h = this.history[i];
							h.StartDate__c = Util.formatDate(h.StartDate__c);
							h.LimitDate__c = Util.formatDate(h.LimitDate__c);
						}
						return bagged.stayResult();
					}),
					lang.hitch(this, function(errmsg){
						return bagged.stayResult(this.addError(errmsg));
					})
				);
				fetch.then(lang.hitch(this, function(bagged){
					if(bagged.stopped()){
						return;
					}
					this.removeLeave(bagged);
				}));
			}
		},
		/**
		 * 休暇付与
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		grantLeave: function(bagged){
			var empLeave = this.getEmpLeave(true);
			var req = {
				action: 'operateTestAssist',
				operateType: 'settingEmpLeave',
				empLeave: empLeave
			};
			Current.request(req, bagged).then(
				lang.hitch(this, function(){
					return bagged.doneResult();
				}),
				lang.hitch(this, function(errmsg){
					return bagged.doneResult(this.addError(errmsg));
				})
			);
		},
		/**
		 * 休暇剥奪対象を得る
		 * @param {Object} empLeave
		 */
		getRemoveTargetId: function(empLeave){
			for(var i = 0 ; i < this.history.length ; i++){
				var h = this.history[i];
				if(h.StartDate__c == empLeave.startDate
				&& h.LimitDate__c == empLeave.limitDate
				&& ((!empLeave.stockType && h.Subject__c == empLeave.subject) || empLeave.stockType)){
					return h.Id;
				}
			}
			return null;
		},
		/**
		 * 休暇剥奪
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		removeLeave: function(bagged){
			var empLeave = this.getEmpLeave(true);
			empLeave.targetId = this.getRemoveTargetId(empLeave);
			if(!empLeave.targetId){
				return bagged.doneResult(this.addError(Constant.ERROR_NOTFOUND));
			}
			empLeave.plus = false;
			empLeave.subject = empLeave.minusSubject || 'マイナス付与';
			delete empLeave.startDate;
			delete empLeave.limitDate;
			delete empLeave.autoFlag;
			delete empLeave.notObligatoryFlag;
			delete empLeave.nextProvideDate;
			delete empLeave.minusSubject;
			var req = {
				action: 'operateTestAssist',
				operateType: 'settingEmpLeave',
				empLeave: empLeave
			};
			Current.request(req, bagged).then(
				lang.hitch(this, function(){
					return bagged.doneResult();
				}),
				lang.hitch(this, function(errmsg){
					return bagged.doneResult(this.addError(errmsg));
				})
			);
		}
	});
});
