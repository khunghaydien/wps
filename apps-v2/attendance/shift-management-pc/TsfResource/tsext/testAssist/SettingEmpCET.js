define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/EntryBase1",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/TsError",
	"tsext/util/Util"
], function(declare, lang, array, str, EntryBase1, Current, Constant, TsError, Util){
	// 勤務体系変更
	return declare("tsext.testAssist.SettingEmpCET", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor: function(args, lineNo){
			this.empCET = this.getDefaultEmpCET();
			this.months = [];
		},
		/**
		 */
		setSetting: function(){
		},
		setSetting2: function(){
			try{
				this.empCET.empId			= Current.getIdByName('emps', this.getItem(0));
				this.empCET.empTypeId		= Current.getIdByName('empTypes', this.getItem(1));
				this.empCET.changeDate		= this.getDate(this.getItem(2), true);
			}catch(e){
				this.addError(e.getMessage());
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
		getEmpId: function(){
			return this.empCET.empId;
		},
		getEmpCET: function(flag){
			var obj = lang.clone(this.empCET);
			return obj;
		},
		getDefaultEmpCET: function(){
			return {
				empId: null,
				empTypeId: null,
				changeDate: null
			};
		},
		/**
		 * 関連情報取得
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			bagged.outputLog('社員の勤務体系情報取得');
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			var req = {
				action: 'operateTestAssist',
				operateType: 'fetchEmpTypeHistory',
				empId: this.getEmpId()
			};
			var chain = Current.request(req, bagged).then(
				lang.hitch(this, function(result){
					this.empInfo = result;
					return bagged.stayResult();
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(this, this.changeEmpType));
		},
		/**
		 * 勤務体系変更
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		changeEmpType: function(bagged){
			bagged.outputLog(this.getEntryName());
			var req = this.getEmpCET(true);
			if(this.empInfo.changeableDate
			&& req.changeDate < this.empInfo.changeableDate){
				return bagged.doneResult(this.addError(Constant.ERROR_INVALID_CHANGE_DATE));
			}
			// 変更後の勤務体系を得る
			var empType = null;
			var empTypes = this.empInfo.empTypes || [];
			for(var i = 0 ; i < empTypes.length ; i++){
				if(empTypes[i].Id == req.empTypeId){
					empType = empTypes[i];
					break;
				}
			}
			if(!empType){
				return bagged.doneResult(this.addError(Constant.ERROR_UNDEFINED));
			}
			// 切替日の日付が変更後の勤務体系の起算日と一致するかをチェック
			if(req.changeDate){
				var inid = parseInt(empType.ConfigBaseId__r.InitialDateOfMonth__c, 10);
				var cd = moment(req.changeDate, Constant.YMD1);
				if(inid != cd.date()){
					return bagged.doneResult(this.addError(Constant.ERROR_INVALID_CHANGE_DATE));
				}
			}
			// 勤務体系変更
			req.action = 'operateTestAssist';
			req.operateType = 'settingEmpCET';
			var chain = Current.request(req, bagged).then(
				lang.hitch(this, function(result){
					return bagged.stayResult();
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(this, this.fetchEmpTypeHistory));
		},
		/**
		 * 関連情報再取得
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		fetchEmpTypeHistory: function(bagged){
			if(bagged.stopped()){
				return;
			}
			bagged.outputLog('社員の勤務体系情報取得');
			var req = {
				action: 'operateTestAssist',
				operateType: 'fetchEmpTypeHistory',
				empId: this.getEmpId()
			};
			var chain = Current.request(req, bagged).then(
				lang.hitch(this, function(result){
					this.empInfo = result;
					this.months = this.getRecalcMonths(this.empInfo.monthList || []);
					return bagged.stayResult();
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(this, function(bagged){
				if(bagged.stopped()){
					return;
				}
				bagged.resetSubIndex();
				this.recalcEmpMonth(bagged);
			}));
		},
		/**
		 * 再計算対象の月度リスト作成
		 * @param {Array.<Object>} monthList
		 * @return {Array.<Object>}
		 */
		getRecalcMonths: function(monthList){
			var d = this.empCET.changeDate || null;
			var x = -1;
			if(d){
				for(var i = 0 ; i < monthList.length ; i++){
					var m = monthList[i];
					if(m.startDate <= d && d <= m.endDate){
						x = i;
						break;
					}
				}
			}
			x = Math.max(x-1, 0);
			var months = [];
			while(x < monthList.length){
				var m = monthList[x++];
				if(m.fix || !m.empMonthId){
					continue;
				}
				months.push(m);
			}
			return months;
		},
		/**
		 * 関連情報再取得
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		recalcEmpMonth: function(bagged){
			if(bagged.getSubIndex() >= this.months.length){
				bagged.loopNext();
				return;
			}
			if(bagged.stopped()){
				return;
			}
			bagged.outputLog('勤怠月次再計算');
			var sd = this.months[bagged.getSubIndex()].startDate;
			var req = {
				action: 'recalcEmpMonth',
				empId: this.getEmpId(),
				targetDate: sd
			};
			var chain = Current.request(req, bagged).then(
				lang.hitch(this, function(result){
					this.empInfo = result;
					return bagged.stayResult();
				}),
				lang.hitch(this, function(errmsg){
					return bagged.stayResult(this.addError(errmsg));
				})
			);
			chain.then(lang.hitch(this, function(bagged){
				if(bagged.stopped()){
					return;
				}
				this.recalcEmpMonth(bagged.nextSub());
			}));
		}
	});
});
