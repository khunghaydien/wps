define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/EntryBase1",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/testAssist/DefaultSettings",
	"tsext/util/TsError",
	"tsext/util/Util"
], function(declare, lang, array, str, EntryBase1, Current, Constant, DefaultSettings, TsError, Util){
	// 勤務場所
	return declare("tsext.testAssist.SettingWorkLocation", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor: function(args, lineNo){
			this.alone = true;
			this.workLocation = DefaultSettings.getDefaultWorkLocation();
			try {
				this.workLocation.Name = this.getItem(0); // 名称
				var v = this.getItem(1);
				if(v){
					if(v == Constant.SET_CT_OFFICE.name){ // 出社
						this.workLocation.OfficeDays__c = 1;
						this.workLocation.HomeDays__c   = 0;
					}else if(v == Constant.SET_CT_HOME.name){ // テレワーク
						this.workLocation.OfficeDays__c = 0;
						this.workLocation.HomeDays__c   = 1;
					}else if(v == Constant.SET_CT_OFFICE_HOME.name){ // 出社・テレワーク
						this.workLocation.OfficeDays__c = 1;
						this.workLocation.HomeDays__c   = 1;
					}else if(v == Constant.SET_CT_OUT_OF_SCOPE.name){ // 対象外
						this.workLocation.OfficeDays__c = 0;
						this.workLocation.HomeDays__c   = 0;
					}else{
						this.addError(Constant.ERROR_UNDEFINED); // 未定義
					}
				}
				this.workLocation.Removed__c = this.getBoolean(this.getItem(2), true);
				this.workLocation.WorkLocationCode__c = this.getItem(3);
				if(this.getOption() != Constant.OPTION_NEW && this.getOption() != Constant.OPTION_DELETE){
					this.addError(Constant.ERROR_UNDEFINED); // 未定義
				}
			}catch(e){
				this.addError(e.getErrorLevel(), e.getMessage());
			}
		},
		/**
		 * 入力直前のチェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			this.workLocationId = null;
			if(this.isDelete()){ // 削除
				try{
					this.workLocationId = Current.getIdByName('workLocations', this.workLocation.Name, false, true);
				}catch(e){
					this.addError(e.getErrorLevel(), e.getMessage());
				}
				if(!this.workLocationId){
					this.addError(Constant.ERROR_LEVEL_1, Constant.ERROR_NOTFOUND);
				}
			}else{
				if(Current.getIdByName('workLocations', this.workLocation.Name, true, true)){
					this.addError(Constant.ERROR_NAME_DUPLICATE2, ['勤務場所']);
				}
			}
			return this.inherited(arguments);
		},
		getWorkLocation: function(flag){
			return lang.clone(this.workLocation);
		},
		/**
		 * 勤務場所を設定
		 * @param {tsext.testAssist.Bagged} bagged
		 */
		execute: function(bagged){
			bagged.outputLog(this.getEntryName());
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			var req = {
				action: 'operateTestAssist'
			};
			if(this.isDelete()){
				req.operateType = 'deleteWorkLocation';
				req.workLocationId = this.workLocationId;
			}else{
				req.operateType = 'settingWorkLocation';
				req.workLocation = this.getWorkLocation(true);
			}
			var chain = Current.request(req, bagged).then(
				lang.hitch(this, function(result){
					var resultObj = null;
					if(result && result.result == 'NG'){
						resultObj = this.addError(result.message);
					}else if(result && result.workLocation){
						resultObj = {
							result: 0,
							name: str.substitute('【勤務場所】 ${0}', [result.workLocation.Name]),
							href: '/' + result.workLocation.Id
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
				Current.fetchMaster(bagged.getDistributor(), ['workLocations']).then(
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
