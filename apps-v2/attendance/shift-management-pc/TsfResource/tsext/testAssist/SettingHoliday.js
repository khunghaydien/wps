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
	// 休暇
	return declare("tsext.testAssist.SettingHoliday", EntryBase1, {
		/**
		 * @constructor
		 * @param {Array.<string>} args CSVの1行
		 * @param {number} lineNo 行番号
		 */
		constructor: function(args, lineNo){
			this.holiday = DefaultSettings.getDefaultHoliday();
			this.holiday.Name = this.getItem(0); // 名称
			if(this.getOption() == Constant.OPTION_NEW){ // オプション=新規
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
			if(this.MN(item1, Constant.SET_HOLIDAY_NAME)){ // 名称
				this.holiday.Name = item2;
			}else if(this.MN(item1, Constant.SET_TYPE)){ // 種類
				try{
					if(item2.startsWith('有')){			this.holiday.Type__c = '1';
					}else if(item2.startsWith('無')){	this.holiday.Type__c = '2';
					}else if(item2.startsWith('代')){	this.holiday.Type__c = '3';
					}else{
						throw new TsError(Constant.ERROR_UNDEFINED);
					}
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_RANGE)){ // 範囲
				try{
					if(this.MN(item2, Constant.SET_ALL_HOLIDAY)){			this.holiday.Range__c = '1';
					}else if(this.MN(item2, Constant.SET_AM_HOLIDAY)){		this.holiday.Range__c = '2';
					}else if(this.MN(item2, Constant.SET_PM_HOLIDAY)){		this.holiday.Range__c = '3';
					}else if(this.MN(item2, Constant.SET_TIME_HOLIDAY)){	this.holiday.Range__c = '4';
					}else{
						throw new TsError(Constant.ERROR_UNDEFINED);
					}
				}catch(e){
					this.addNgElement(el, e);
				}
			}else if(this.MN(item1, Constant.SET_YUQ_SPEND)       ){ try{ this.holiday.YuqSpend__c             = this.getBoolean(item2); }catch(e){ this.addNgElement(el,e); } // 有休消化
			}else if(this.MN(item1, Constant.SET_IS_WORKING)      ){ try{ this.holiday.IsWorking__c            = this.getBoolean(item2); }catch(e){ this.addNgElement(el,e); } // 出勤率判定
			}else if(this.MN(item1, Constant.SET_DISP_ON_CALENDAR)){ try{ this.holiday.DisplayDaysOnCalendar__c= this.getBoolean(item2); }catch(e){ this.addNgElement(el,e); } // 暦日表示
			}else if(this.MN(item1, Constant.SET_HOLIDAY_TIME_UNIT)){ try{ this.holiday.TimeUnit__c            = this.getInteger(item2,true,0,60); }catch(e){ this.addNgElement(el,e); } // 休暇時間制限単位
			}else if(this.MN(item1, Constant.SET_MANAGED)         ){ try{ this.holiday.Managed__c              = this.getBoolean(item2); }catch(e){ this.addNgElement(el,e); } // 日数管理
			}else if(this.MN(item1, Constant.SET_MANAGE_NAME)     ){ try{ this.holiday.ManageName__c           = item2;                  }catch(e){ this.addNgElement(el,e); } // 管理名
			}else if(this.MN(item1, Constant.SET_SYMBOL)          ){ try{ this.holiday.Symbol__c               = item2;                  }catch(e){ this.addNgElement(el,e); } // 略称
			}else if(this.MN(item1, Constant.SET_SUMMARY_CODE)    ){ try{ this.holiday.SummaryCode__c          = item2;                  }catch(e){ this.addNgElement(el,e); } // 集計コード
			}else if(this.MN(item1, Constant.SET_SUMMARY_ROOT)    ){ try{ this.holiday.IsSummaryRoot__c        = this.getBoolean(item2); }catch(e){ this.addNgElement(el,e); } // 大分類に設定
			}else if(this.MN(item1, Constant.SET_SUMMARY_NAME)    ){ try{ this.holiday.SummaryName__c          = item2;                  }catch(e){ this.addNgElement(el,e); } // 大分類名
			}else if(this.MN(item1, Constant.SET_LINK_NUMBER)     ){ try{ this.holiday.LinkNumber__c           = this.getInteger(item2,true,0,9999999); }catch(e){ this.addNgElement(el,e); } // 連携時の休暇番号
			}else if(this.MN(item1, Constant.SET_DESCRIPTION)     ){ try{ this.holiday.Description__c          = item2.split(/\\n/).join('\n'); }catch(e){ this.addNgElement(el,e); } // 説明
			}else if(this.MN(item1, Constant.SET_PLANNED_HOLIDAY) ){ try{ this.holiday.PlannedHoliday__c       = this.getBoolean(item2); }catch(e){ this.addNgElement(el,e); } // 計画付与
			}else if(this.MN(item1, Constant.SET_REMOVED)         ){ try{ this.holiday.Removed__c              = this.getBoolean(item2); }catch(e){ this.addNgElement(el,e); } // 無効
			}else{
				this.addNgElement(el, new TsError(Constant.ERROR_UNDEFINED)); // 未定義
			}
		},
		/**
		 * 入力直前のチェック
		 * @return {boolean}
		 */
		lastCheck: function(){
			this.holidayId = null;
			if(this.isDelete()){ // 削除
				try{
					this.holidayId = Current.getIdByName('holidays', this.holiday.Name, false, true);
				}catch(e){
					this.addError(e.getErrorLevel(), e.getMessage());
				}
				if(!this.holidayId){
					this.addError(Constant.ERROR_LEVEL_1, Constant.ERROR_NOTFOUND);
				}
			}else{
				if(Current.getIdByName('holidays', this.holiday.Name, true, true)){
					this.addError(Constant.ERROR_NAME_DUPLICATE2, ['休暇']);
				}
				if(!this.holiday.SummaryName__c){
					this.holiday.SummaryName__c = this.holiday.Name;
				}
			}
			return this.inherited(arguments);
		},
		getHoliday: function(flag){
			var obj = lang.clone(this.holiday);
			if(flag){
				obj.Config__c = Util.toJson(obj.Config__c);
			}
			return obj;
		},
		isSummaryRoot: function(){
			return this.holiday.IsSummaryRoot__c || false;
		},
		/**
		 * 休暇を設定
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
				req.operateType = 'deleteHoliday';
				req.holidayId = this.holidayId;
			}else{
				req.operateType = 'settingHoliday';
				req.holiday = this.getHoliday(true);
			}
			var chain = Current.request(req, bagged).then(
				lang.hitch(this, function(result){
					var resultObj = null;
					if(result && result.result == 'NG'){
						resultObj = this.addError(result.message);
					}else if(result && result.holiday){
						resultObj = {
							result: 0,
							name: str.substitute('【休暇】 ${0}', [result.holiday.Name]),
							href: '/' + result.holiday.Id
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
				Current.fetchMaster(bagged.getDistributor(), ['holidays']).then(
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
