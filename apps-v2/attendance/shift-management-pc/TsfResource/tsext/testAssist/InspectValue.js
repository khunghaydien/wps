define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/EntryBase1",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, EntryBase1, Current, Constant, Util){
	// 打刻
	return declare("tsext.testAssist.InspectValue", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor : function(args, lineNo){
			this.mode = 0;
			this.manageName = null;
			this.expectedValue = null;
			var item1 = this.getItem(0);
			if(item1 == '残日数'){
				this.mode = Constant.INSPECT_REMAIN_DAYS; // 残日数
			}else if(!item1){
				this.mode = Constant.INSPECT_NORMAL; // ベリファイ
			}else{
				this.addError(Constant.ERROR_UNDEFINED); // 未定義
			}
			this.expectedValue = this.getItem(5); // 期待値
		},
		isNormal: function(){
			return (this.mode == Constant.INSPECT_NORMAL);
		},
		isRemainDays: function(){
			return (this.mode == Constant.INSPECT_REMAIN_DAYS);
		},
		lastCheck: function(){
			if(this.isRemainDays()){
				var manageNames = Current.getManageNames();
				var item2 = this.getItem(1);
				if(manageNames.indexOf(item2) < 0){
					this.addError(Constant.ERROR_UNDEFINED);
				}
				this.manageName = item2;
				try{
					this.targetDate = this.getDate(this.getItem(2)); // 日付
				}catch(e){
					this.addError(Constant.ERROR_INVALID_VALUE); // 無効
				}
			}
			return this.inherited(arguments);
		},
		execute: function(bagged){
			bagged.outputLog(this.getEntryName());
			if(!this.lastCheck()){
				bagged.doneResult(this.getErrorObj());
				return;
			}
			if(this.isRemainDays()){
				Current.calcEmpStockRemainDays(this.manageName, this.targetDate, lang.hitch(this, function(flag, result){
					if(flag){
						var resultObj = {tested:true, result:0};
						if(this.expectedValue){
							var level = (this.expectedValue == result ? 0 : 1);
							resultObj.result = level;
							resultObj.message = (level ? str.substitute('期待値=[${0}],実際の値=[${1}]', [this.expectedValue, result]) : '');
						}else{
							resultObj.message = str.substitute('実際の値=[${0}]', [result]);
						}
						return bagged.doneResult(resultObj);
					}else{
						return bagged.doneResult(this.addError(result));
					}
				}));
			}else{
				Current.verifyMonth(lang.hitch(this, function(flag, result){
					if(flag){
						var ngCnt = (typeof(result) == 'number' && result) || 0;
						return bagged.doneResult({
							result: (ngCnt > 0 ? 1 : 0),
							message: (ngCnt > 0 ? '不一致' : '一致'),
							tested: true
						});
					}else{
						return bagged.doneResult(this.addError(result));
					}
				}));
			}
		}
	});
});
