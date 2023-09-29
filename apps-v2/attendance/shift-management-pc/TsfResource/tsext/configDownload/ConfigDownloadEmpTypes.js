define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/tsobj/Helper",
	"tsext/logic/DataLoader",
	"tsext/service/Request",
	"tsext/service/Agent",
	"tsext/configDownload/ConfigDownloadEmpType",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Helper, DataLoader, Request, Agent, ConfigDownloadEmpType, Util){
	return declare("tsext.configDownload.ConfigDownloadEmpTypes", null, {
		constructor : function(opt){
			this.opt = opt;
			this.empTypeObjs = [
 			{ name:'勤務体系ID'											, oid:true },
 			{ name:'勤務体系名'											},
 			{ name:'勤務体系コード'										},
 			{ name:'勤務体系：作成日時'									, odt:true },
 			{ name:'勤務体系：作成者ID'									, oby:true, oid:true },
 			{ name:'勤務体系：作成者名'									, oby:true },
 			{ name:'勤務体系：最終更新日時'								, odt:true },
 			{ name:'勤務体系：最終更新者ID'								, oby:true, oid:true },
 			{ name:'勤務体系：最終更新者名'								, oby:true },
 			{ name:'勤務体系：削除フラグ'								},
 			{ name:'勤務体系：所有者ID'									, oby:true, oid:true },
 			{ name:'勤務体系：所有者名'									, oby:true },
 			{ name:'勤務体系：所有者有効'								, oby:true },
 			{ name:'勤怠基本設定ID'										, oid:true },
 			{ name:'勤怠基本設定：作成日時'								, odt:true },
 			{ name:'勤怠基本設定：作成者ID'								, oby:true, oid:true },
 			{ name:'勤怠基本設定：作成者名'								, oby:true },
 			{ name:'勤怠基本設定：最終更新日時'							, odt:true },
 			{ name:'勤怠基本設定：最終更新者ID'							, oby:true, oid:true },
 			{ name:'勤怠基本設定：最終更新者名'							, oby:true },
 			{ name:'勤怠基本設定：所有者ID'								, oby:true, oid:true },
 			{ name:'勤怠基本設定：所有者名'								, oby:true },
 			{ name:'勤怠基本設定：所有者有効'							, oby:true },
 			{ name:'年度の起算月'										},
 			{ name:'年度の表記'											},
 			{ name:'月度の起算日'										},
 			{ name:'月度の表記'											},
 			{ name:'週の起算日'											},
 			{ name:'勤怠設定ID'											, oid:true },
 			{ name:'勤怠設定：作成日時'									, odt:true },
 			{ name:'勤怠設定：作成者ID'									, oby:true, oid:true },
 			{ name:'勤怠設定：作成者名'									, oby:true },
 			{ name:'勤怠設定：最終更新日時'								, odt:true },
 			{ name:'勤怠設定：最終更新者ID'								, oby:true, oid:true },
 			{ name:'勤怠設定：最終更新者名'								, oby:true },
 			{ name:'勤怠設定：所有者ID'									, oby:true, oid:true },
 			{ name:'勤怠設定：所有者名'									, oby:true },
 			{ name:'勤怠設定：所有者有効'								, oby:true },
 			{ name:'勤怠設定：Copy'										},
 			{ name:'勤怠設定：オリジナルID'								, oid:true },
 			{ name:'勤怠設定：世代番号'									},
 			{ name:'勤怠設定：有効開始日'								},
 			{ name:'勤怠設定：有効開始月'								},
 			{ name:'勤怠設定：有効終了日'								},
 			{ name:'勤怠設定：有効終了月'								},
 			{ name:'労働時間制'											},
 			{ name:'変形期間の単位'										},
 			{ name:'休日'												},
 			{ name:'法定休日自動判定'									},
 			{ name:'国民の祝日'											},
 			{ name:'始業時刻'											},
 			{ name:'終業時刻'											},
 			{ name:'所定労働時間'										},
 			{ name:'休憩'												},
 			{ name:'フレックス開始時刻'									},
 			{ name:'フレックス終了時刻'									},
 			{ name:'コア時間を使用'										},
 			{ name:'コア開始時刻'										},
 			{ name:'コア終了時刻'										},
 			{ name:'勤怠グラフにコア時間を表示'							},
 			{ name:'月の所定労働時間'									},
 			{ name:'所定労働時間を法定労働時間として扱う'				},
 			{ name:'半日休暇取得可'										},
 			{ name:'午前半休開始時刻'									},
 			{ name:'午前半休終了時刻'									},
 			{ name:'午後半休開始時刻'									},
 			{ name:'午後半休終了時刻'									},
 			{ name:'半休取得時の休憩時間の適用'							},
 			{ name:'午前半休時休憩時間'									},
 			{ name:'午後半休時休憩時間'									},
 			{ name:'１週間の法定労働時間'								},
 			{ name:'時間単位休の基準時間(年次有給休暇用)'				},
 			{ name:'時間単位休の基準時間(日数管理休暇用)'				},
 			{ name:'深夜労働割増'										},
 			{ name:'残業と控除の相殺をしない'							},
 			{ name:'代休を勤務時間とみなす'								},
 			{ name:'未来の時刻は入力不可'								},
 			{ name:'遅刻・早退を強調表示'								},
 			{ name:'承認されるまで勤務時間の入力不可'					},
 			{ name:'出社・退社時刻を含む休憩入力不可'					},
 			{ name:'裁量労働を使用'										},
 			{ name:'翌日にまたがる勤務時間の取扱い'						},
 			{ name:'2暦日で勤務日種別が異なる24:00以降の入力不可'		},
 			{ name:'休日出勤時の24:00以降の入力も不可'					},
 			{ name:'法定休憩時間のチェック１'							},
 			{ name:'法定休憩時間のチェック２'							},
 			{ name:'勤務時間を修正できる社員'							},
 			{ name:'時刻の丸め'											},
 			{ name:'出社時刻の端数処理'									},
 			{ name:'退社時刻の端数処理'									},
 			{ name:'時刻の表示形式'										},
 			{ name:'勤務表に工数入力ボタン表示'							},
 			{ name:'承認ワークフロー'									},
 			{ name:'承認者設定を使用する'								},
 			{ name:'休日出勤申請'										},
 			{ name:'休日出勤申請：休憩時間の変更を許可'					},
 			{ name:'休日出勤申請：複数申請可'							},
 			{ name:'振替申請'											},
 			{ name:'振替申請：期間制限あり'								},
 			{ name:'振替申請：振替休日の期間制限'						},
 			{ name:'振替申請：振替出勤の期間制限'						},
 			{ name:'振替申請：週内の法定休日がなくなる振替を禁止'		},
 			{ name:'勤務時間変更申請'									},
 			{ name:'勤務時間変更申請：シフト可'							},
 			{ name:'勤務時間変更申請：平日・休日変更を許可'				},
 			{ name:'勤務時間変更申請：法定休日を指定可'					},
 			{ name:'残業申請'											},
 			{ name:'残業申請：申請なし不可'								},
 			{ name:'残業申請：申請なし－所定まで許可'					},
 			{ name:'残業申請：申請なし－境界時刻'						},
 			{ name:'残業申請：申請なし－エラー時間'						},
 			{ name:'残業申請：初期値＝フレックス境界時刻'				},
 			{ name:'残業申請：複数申請可'								},
 			{ name:'残業申請：期間で申請可'								},
 			{ name:'早朝勤務申請'										},
 			{ name:'早朝勤務申請：申請なし不可'							},
 			{ name:'早朝勤務申請：申請なし－所定まで許可'				},
 			{ name:'早朝勤務申請：申請なし－境界時刻'					},
 			{ name:'早朝勤務申請：申請なし－エラー時間'					},
 			{ name:'早朝勤務申請：初期値＝フレックス境界時刻'			},
 			{ name:'早朝勤務申請：複数申請可'							},
 			{ name:'早朝勤務申請：期間で申請可'							},
 			{ name:'遅刻申請'											},
 			{ name:'遅刻申請：遅刻時は必須'								},
 			{ name:'早退申請'											},
 			{ name:'早退申請：早退時は必須'								},
 			{ name:'直行・直帰申請'										},
 			{ name:'直行・直帰申請：作業区分'							},
 			{ name:'勤怠時刻修正申請'									},
 			{ name:'日次確定申請'										},
 			{ name:'日次確定申請：勤務表にボタン表示'					},
 			{ name:'日次確定申請：日次確定申請の承認者'					},
 			{ name:'日次確定申請：日次確定申請漏れのチェック'			},
 			{ name:'工数入力時間のチェック：日次確定時'					},
 			{ name:'工数入力時間のチェック：月次確定時'					},
 			{ name:'勤務確定時の未入力日の扱い'							},
 			{ name:'入退館管理：使用する'								},
 			{ name:'入退館管理：乖離許容時間(分)'						},
 			{ name:'入退館管理：入退館基準時間(平日)'					},
 			{ name:'入退館管理：入退館基準時間(休日)'					},
 			{ name:'入退館管理：日次確定申請時の乖離判定'				},
 			{ name:'入退館管理：月次確定申請時の乖離判定'				},
 			{ name:'入退館管理：月次サマリーに入退館情報を表示'			},
 			{ name:'積立休暇：有効'										},
 			{ name:'積立休暇：積立休暇の選択'							},
 			{ name:'積立休暇：一回の積立日数'							},
 			{ name:'積立休暇：最大積立日数'								},
 			{ name:'代休管理：有効'										},
 			{ name:'代休管理：半日代休'									},
 			{ name:'代休管理：終日代休可能労働時間'						},
 			{ name:'代休管理：半日代休可能労働時間'						},
 			{ name:'代休管理：代休の有効期限'							},
 			{ name:'代休管理：申請時に代休有無を指定'					},
 			{ name:'代休管理：法定休日出勤の代休可'						},
 			{ name:'代休管理：休日出勤の勤怠規則は平日に準拠する'		},
 			{ name:'代休管理：振替休日に出勤した場合は代休不可'			},
 			{ name:'選択可能な休暇の数'									},
 			{ name:'選択可能な勤務パターンの数'							},
 			{ name:'月間残業時間：上限'									},
 			{ name:'月間残業時間：警告１'								},
 			{ name:'月間残業時間：警告２'								},
 			{ name:'月間残業時間：警告３'								},
 			{ name:'4半期残業時間：上限'								},
 			{ name:'4半期残業時間：警告１'								},
 			{ name:'4半期残業時間：警告２'								},
 			{ name:'年間残業時間：上限'									},
 			{ name:'年間残業時間：警告１'								},
 			{ name:'年間残業時間：警告２'								},
 			{ name:'月間残業時間の超過回数：上限'						},
 			{ name:'月間残業時間の超過回数：警告１'						},
 			{ name:'有休自動付与'										},
 			{ name:'有休自動付与：付与方法'								},
 			{ name:'有休自動付与：指定日'								},
 			{ name:'有休自動付与：付与日数'								},
 			{ name:'有休自動付与：付与の通知不要'						}
 			];
		},
		convertBase: function(records){
			array.forEach(records, function(record){
				record.CreatedDate      = Util.formatDateTime(record.CreatedDate);
				record.LastModifiedDate = Util.formatDateTime(record.LastModifiedDate);
			});
			return records;
		},
		setEmpTypes: function(records){
			this.empTypes = this.convertBase(records);
			this.empTypes = this.empTypes.sort(function(a, b){
				var eca = a.EmpTypeCode__c || null;
				var ecb = b.EmpTypeCode__c || null;
				if(eca == ecb){
					if(a.Name == b.Name){
						return (a.Id < b.Id ? -1 : 1);
					}
					return (a.Name < b.Name ? -1 : 1);
				}
				if(!eca && ecb){
					return 1;
				}else if(eca && !ecb){
					return -1;
				}
				return (eca < ecb ? -1 : 1);
			});
		},
		setConfigBases: function(records){
			this.configBases = this.convertBase(records);
		},
		setConfigs: function(records){
			this.configs = this.convertBase(records);
			array.forEach(this.configs, function(config){
				config.ValidStartDate__c = Util.formatDate(config.ValidStartDate__c);
				config.ValidEndDate__c   = Util.formatDate(config.ValidEndDate__c);
			});
		},
		setEmpTypeHolidays: function(records){
			this.empTypeHolidays = records;
		},
		setEmpTypePatterns: function(records){
			this.empTypePatterns = records;
		},
		setEmpTypeYuqs: function(records){
			this.empTypeYuqs = records;
		},
		setHolidays: function(records){
			this.holidays = this.convertBase(records);
		},
		getConfigBaseById: function(id){
			var configBases = [];
			for(var i = 0 ; i < this.configBases.length ; i++){
				if(this.configBases[i].Id == id){
					configBases.push(this.configBases[i]);
				}
			}
			return configBases;
		},
		getConfigsByBaseId: function(baseId){
			var configs = [];
			var configIds = {};
			var ocp = this.opt.ocp;
			array.forEach(this.configs, function(config){
				if(config.ConfigBaseId__c == baseId){
					if(ocp || !config.OriginalId__c){
						configs.push(config);
					}
					configIds[config.Id] = 1;
				}
			});
			if(ocp){
				array.forEach(this.configs, function(config){
					if(config.OriginalId__c && configIds[config.OriginalId__c]){
						configs.push(config);
					}
				});
			}
			return configs;
		},
		getEmpTypeYuqs: function(empTypeId){
			var yuqs = [];
			array.forEach(this.empTypeYuqs, function(yuq){
				if(yuq.EmpTypeId__c == empTypeId){
					yuqs.push(yuq);
				}
			});
			yuqs = yuqs.sort(function(a, b){
				if(a.Year__c == b.Year__c){
					if(a.Month__c == b.Month__c){
						return (a.Suffix__c < b.Suffix__c ? -1 : 1);
					}
					return a.Month__c - b.Month__c;
				}
				return a.Year__c - b.Year__c;
			});
			return yuqs;
		},
		getEmpTypeHolidayCount: function(empTypeId){
			var cnt = 0;
			array.forEach(this.empTypeHolidays, function(o){
				if(o.EmpTypeId__c == empTypeId){
					cnt++;
				}
			});
			return cnt;
		},
		getEmpTypePatternCount: function(empTypeId){
			var cnt = 0;
			array.forEach(this.empTypePatterns, function(o){
				if(o.EmpTypeId__c == empTypeId){
					cnt++;
				}
			});
			return cnt;
		},
		createEmpTypeContents: function(){
			this.empTypeList = [];
			array.forEach(this.empTypes, function(empType){
				this.empTypeList.push(new ConfigDownloadEmpType(empType, this));
			}, this);
		},
		getEmpTypeCsvHeads: function(objs){
			var heads = [];
			var x = 0;
			array.forEach(this.empTypeObjs, function(obj){
				if(this.isEmpTypeObj(x++)){
					heads.push(obj.name);
				}
			}, this);
			return heads;
		},
		isEmpTypeObj: function(index){
			var obj = this.empTypeObjs[index];
			var flag = true;
			if(obj.oid && !this.opt.oid){ flag = false; }
			if(obj.oby && !this.opt.oby){ flag = false; }
			if(obj.odt && !this.opt.odt){ flag = false; }
			return flag;
		},
		getEmpTypeCsvContents: function(){
			this.createEmpTypeContents();
			var head = this.getEmpTypeCsvHeads().join(',');
			var body = '';
			for(var i = 0 ; i < this.empTypeList.length ; i++){
				var empType = this.empTypeList[i];
				if(empType.isRemoved() && !this.opt.orm){
					continue;
				}
				var configList = empType.getConfigList();
				for(var j = 0 ; j < configList.length ; j++){
					var config = configList[j];
					var vals = [];
					var x = 0;
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getId()); }
					if(this.isEmpTypeObj(x++)){ vals.push(Util.escapeCsv(empType.getName())); }
					if(this.isEmpTypeObj(x++)){ vals.push(Util.escapeCsv(empType.getEmpTypeCode())); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getCreatedDate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getCreatedById()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getCreatedByName()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getLastModifiedDate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getLastModifiedById()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getLastModifiedByName()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.isRemoved()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOwnerId()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOwnerName()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOwnerIsActive()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getConfigBaseId()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getConfigBaseCreatedDate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getConfigBaseCreatedById()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getConfigBaseCreatedByName()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getConfigBaseLastModifiedDate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getConfigBaseLastModifiedById()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getConfigBaseLastModifiedByName()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getConfigBaseOwnerId()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getConfigBaseOwnerName()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getConfigBaseOwnerIsActive()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getInitMonth()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getMarkOfYear()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getInitDate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getMarkOfMonth()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getInitWeek()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getId()); }
//					if(this.isEmpTypeObj(x++)){ vals.push(Util.escapeCsv(config.getName())); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getCreatedDate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getCreatedById()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getCreatedByName()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getLastModifiedDate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getLastModifiedById()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getLastModifiedByName()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getOwnerId()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getOwnerName()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getOwnerIsActive()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isCopy()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getOriginalId()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getGeneration()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getValidStartDate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getValidStartMonth()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getValidEndDate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getValidEndMonth()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getWorkSystem()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getVariablePeriod()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getHolidays()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseAutoLegalHoliday()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUsePublicHoliday()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getStdStartTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getStdEndTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getStandardFixTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(Util.escapeCsv(config.getRestTimes())); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getFlexStartTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getFlexEndTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseCoreTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getCoreStartTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getCoreEndTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isCoreTimeGraph()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getFlexFixMonthlyTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isFlexLegalWorkTimeOption()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseHalfHoliday()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getAmHolidayStartTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getAmHolidayEndTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getPmHolidayStartTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getPmHolidayEndTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseHalfHolidayRestTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getAmHolidayRestTimes()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getPmHolidayRestTimes()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getLegalTimeOfWeek()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getBaseTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getBaseTimeForStock()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseNightCharge()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isDeductWithFixedTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isHalfDaiqReckontoWorked()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isPastTimeOnly()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isHighlightLateEarly()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isProhibitInputTimeUntilApproved()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isProhibitBorderRestTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseDiscretionary()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getWorkAcrossNextDay()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isLeavingAcrossNextDay()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isLeavingAcrossNextDay2()); }
					if(this.isEmpTypeObj(x++)){ vals.push(Util.escapeCsv(config.getRestTimeCheck(0))); }
					if(this.isEmpTypeObj(x++)){ vals.push(Util.escapeCsv(config.getRestTimeCheck(1))); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getPermitUpdateTimeLevel()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getTimeRound()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getTimeRoundBegin()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getTimeRoundEnd()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getTimeFormat()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isInputWorkingTimeOnWorkTimeView()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseWorkFlow()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseApplyApproverTemplate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseHolidayWorkFlag()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isHolidayWorkRestChangeable()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseHolidayWorkDuplicate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseMakeupHoliday()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isExchangeLimit()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isExchangeLimitA()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isExchangeLimitB()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isProhibitApplicantEliminatingLegalHoliday()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isChangePattern()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isChangeShift()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isChangeDayType()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isChangeDayType2()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseOverTimeFlag()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseOverTimeFlagOpt1()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseOverTimeFlagOpt2()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getUseOverTimeFlagOpt3()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getUseOverTimeFlagOpt4()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseOverTimeInitFlex()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseOverTimeDuplicate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseOverTimeBulk()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseEarlyWorkFlag()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseEarlyWorkFlagOpt1()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseEarlyWorkFlagOpt2()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getUseEarlyWorkFlagOpt3()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getUseEarlyWorkFlagOpt4()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseEarlyWorkInitFlex()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseEarlyWorkDuplicate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseEarlyWorkBulk()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseLateStartApply()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isRequireLateApply()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseEarlyEndApply()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isRequireEarlyEndApply()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseDirectApply()); }
					if(this.isEmpTypeObj(x++)){ vals.push(Util.escapeCsv(config.getWorkTypeList())); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseReviseTimeApply()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseDailyApply()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isInputWorkingTimeOnWorkTimeView()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getDailyApprover()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isCheckDailyFixLeak()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isCheckWorkingTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isCheckWorkingTimeMonthly()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isRequireDailyInput()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isUseAccessControlSystem()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getPermitDivergenceTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getWeekDayAccessBaseTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.getHolidayAccessBaseTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isPermitDailyApply()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isPermitMonthlyApply()); }
					if(this.isEmpTypeObj(x++)){ vals.push(config.isMsAccessInfo()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.isEnableStockHoliday()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getTargetStockHoliday()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getMaxStockHolidayPerYear()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getMaxStockHoliday()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.isUseDaiqManage()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.isUseHalfDaiq()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getDaiqAllBorderTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getDaiqHalfBorderTime()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getDaiqLimit()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.isUseDaiqReserve()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.isUseDaiqLegalHoliday()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.isUseRegulateHoliday()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.isNoDaiqExchanged()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getEmpTypeHolidayCount()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getEmpTypePatternCount()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOverTimeMonthLimit()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOverTimeMonthAlert1()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOverTimeMonthAlert2()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOverTimeMonthAlert3()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOverTimeQuartLimit()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOverTimeQuartAlert1()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOverTimeQuartAlert2()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOverTimeYearLimit()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOverTimeYearAlert1()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOverTimeYearAlert2()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOverTimeCountLimit()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getOverTimeCountAlert()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.isYuqProvideAuto()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getYuqProvideType()); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.getYuqProvideDate()); }
					if(this.isEmpTypeObj(x++)){ vals.push(Util.escapeCsv(empType.getYuqProvideDays())); }
					if(this.isEmpTypeObj(x++)){ vals.push(empType.isYuqAssignNoMessages()); }
					body += vals.join(',') + '\n';
				}
			}
			return head + '\n' + body;
		}
	});
});
