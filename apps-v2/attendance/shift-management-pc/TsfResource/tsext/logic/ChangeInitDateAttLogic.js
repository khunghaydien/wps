define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/tsobj/Helper",
	"tsext/logic/DataLoader",
	"tsext/service/Request",
	"tsext/service/Agent",
	"tsext/obj/HistoryRange",
	"tsext/util/Util"
], function(declare, lang, json, array, str, Deferred, Helper, DataLoader, Request, Agent, HistoryRange, Util){
	return declare("tsext.logic.ChangeInitDateAttLogic", null, {
		constructor : function(empTypes, param, showLog){
			this.empTypes = empTypes;
			this.param = param;
			this.showLog = showLog;
			this.reset();
		},
		reset: function(msg){
			this.reports = [];
			this.warns = [];
			this.errors = [];
			this.recoveryScripts = [];
		},
		pr: function(msg){
			this.reports.push(msg);
		},
		wa: function(msg){
			this.warns.push(msg);
		},
		er: function(msg){
			this.errors.push(msg);
		},
		getPlan: function(){
			var msg = this.reports.join('\n');
			if(this.warns.length){
				msg += '\n';
				msg += this.warns.join('\n');
			}
			if(this.errors.length){
				msg += '\n';
				msg += this.errors.join('\n');
			}
			msg += '\n';
			return msg;
		},
		getEmpTypeById: function(id){
			for(var i = 0 ; i < this.param.empTypes.length ; i++){
				var empType = this.param.empTypes[i];
				if(empType.getId() == id){
					return empType;
				}
			}
			return null;
		},
		//
		getRecoveryScripts: function(){
			return this.recoveryScripts.join('\n');
		},
		// 仮想勤務体系を作成
		getVirtualEmpType: function(){
			var cp = this.param.changeParam;
			return {
				Name: '',
				EmpTypeCode__c: null,
				Removed__c: false,
				ConfigBaseId__r: {
					InitialDateOfYear__c  : cp.startMonth,
					InitialDateOfMonth__c : cp.startDate,
					InitialDayOfWeek__c   : cp.startWeek,
					MarkOfYear__c         : cp.displayYear,
					MarkOfMonth__c        : cp.displayMonth
				}
			};
		},
		checkValid: function(){
			var virEmpType = this.getVirtualEmpType();
			this.pr('バリデーションチェック');
			this.pr('＊ 設定内容');
			this.pr('切替日=' + this.param.changeDate);
			// 起算日変更前後比較表
			var kisan = Util.getBarHead([
				{ name:' '         , len:  8             },
				{ name:'起算月'    , len:  6, right:true },
				{ name:'年度の表記', len: 16             },
				{ name:'起算日'    , len:  6, right:true },
				{ name:'月度の表記', len: 16             },
				{ name:'週の起算日', len: 10, right:true }
			]);
			// 勤務体系の表
			var ett = Util.getBarHead([
				{ name:'勤務体系ID'    , len: 18 },
				{ name:'勤務体系コード', len: 14 },
				{ name:'勤務体系名'    , len: 30 }
			]);
			// 対象社員の表
			var empt = Util.getBarHead([
				{ name:'#'         , len:  4, right:true },
				{ name:'社員ID'    , len: 18             },
				{ name:'社員コード', len: 14             },
				{ name:'社員名'    , len: 30             },
				{ name:'入社日'    , len: 10             },
				{ name:'退社日'    , len: 10             },
				{ name:'月数'      , len:  4, right:true },
				{ name:'更新'      , len:  4, right:true },
				{ name:'最小月度'  , len:  8             },
				{ name:'最大月度'  , len:  8             },
				{ name:'備考'      , len:  4             }
			]);
			// カレンダーの表
			var calt = Util.getBarHead([
				{ name:'ID'       , len: 18 },
				{ name:'日付'     , len: 10 },
				{ name:'イベント' , len: 40 }
			]);
			var cp = this.param.changeParam;
			if(cp.empTypeId){
				this.pr('変更先の勤務体系='
					+ cp.empTypeName
					+ (cp.empTypeCode ? (' (勤務体系コード:' + cp.empTypeCode + ')') : ''));
			}
			this.pr('旧勤務体系の無効化=' + (cp.invalidate ? 'する' : 'しない'));
			// 切替日と新しい起算日が同じかどうかをチェック
			var d = moment(this.param.changeDate, 'YYYY-MM-DD');
			if(d.date() != cp.startDate){
				this.wa("警告: 切替日と起算日が異なります。正しい設定か確認してください。");
			}
			var displayYear  = (cp.displayYear  == 1 ? '起算月に合わせる' : '締め月に合わせる');
			var displayMonth = (cp.displayMonth == 1 ? '起算日に合わせる' : '締め日に合わせる');
			var kisanInfo = Util.getBodyValues(kisan, [
				{ v:'(変更後)'           },
				{ v:cp.startMonth + '月' },
				{ v:displayYear          },
				{ v:cp.startDate  + '日' },
				{ v:displayMonth         },
				{ v:Util.getWeekJp(cp.startWeek) }
			]);
			this.pr(kisan.bar);
			this.pr(kisan.head);
			this.pr(kisan.bar);
			this.pr(kisanInfo);
			this.pr(kisan.bar);
			this.pr('＊ 勤務体系毎の変更情報');
			// 勤務体系ごとに変更内容、変更社員リストを出力
			for(var i = 0 ; i < this.param.empTypes.length ; i++){
				this.pr(str.rep('=', 80));
				var empType = this.param.empTypes[i];
				// 勤務体系情報
				this.pr(ett.bar);
				this.pr(ett.head);
				this.pr(ett.bar);
				this.pr(Util.getBodyValues(ett, [
					{ v:empType.getId()          },
					{ v:empType.getEmpTypeCode() },
					{ v:empType.getName()        }
				]));
				this.pr(ett.bar);
				this.pr('勤怠基本設定ID: ' + empType.getConfigBaseId());
				// 起算日変更前後の値
				this.pr(kisan.bar);
				this.pr(kisan.head);
				this.pr(kisan.bar);
				this.pr(Util.getBodyValues(kisan, [
					{ v:'(変更前)'                     },
					{ v:empType.getStartMonth() + '月' },
					{ v:empType.getDisplayYear(2)      },
					{ v:empType.getStartDate()  + '日' },
					{ v:empType.getDisplayMonth(2)     },
					{ v:empType.getStartWeek(2)        }
				]));
				this.pr(kisanInfo);
				this.pr(kisan.bar);

				var mrs = this.getVirEmpMonths({ // 起算日変更した場合の月次配列
					cd            : this.param.changeDate,
					empTypeHistory: null,
					empType       : empType.getObj(),
					virEmpType    : this.getVirtualEmpType()
				});
				if(empType.getStartMonth()   == cp.startMonth
				&& empType.getStartDate()    == cp.startDate
				&& empType.getStartWeek()    == cp.startWeek
				&& empType.getDisplayYear()  == cp.displayYear
				&& empType.getDisplayMonth() == cp.displayMonth
				){
					this.er(str.substitute("エラー: 勤務体系「${0}」は起算日の変更はありません", [empType.getName()]));
					this.pr('エラー: 起算日の変更はありません');
				}
				this.pr('関連社員数= ' + empType.getEmpCount());
				this.pr('関連月度数= ' + empType.getEmpMonthCount());
				if(!empType.getEmpCount()){
					this.er(str.substitute("エラー: 勤務体系「${0}」は対象社員がいません", [empType.getName()]));
					this.pr('エラー: 対象社員がいません');
				}
				this.pr('切替日前後の月度と期間');
				array.forEach(mrs, function(mr){
					this.pr(Util.padx(Util.formatMonthEx(mr.ym, mr.subNo), 14, ' ', true)
						+ ' '
						+ moment(mr.sd, 'YYYY-MM-DD').format('YYYY/MM/DD')
						+ '～'
						+ moment(mr.ed, 'YYYY-MM-DD').format('YYYY/MM/DD')
					);
				}, this);
				// 対象社員リスト
				this.pr(empt.bar);
				this.pr(empt.head);
				this.pr(empt.bar);
				var n = 0;
				var ngEmpTypeHisotry = false;
				var existFixedMonth = false;
				var emps = empType.getEmps();
				array.forEach(emps, function(emp){
					if(emp.getEmpTypeId() == empType.getId()){
						var targetMonthCount = emp.getTargetEmpMonthCount(this.param.changeDate);
						var ng = emp.isOverEmpTypeHistory(this.param.changeDate);
//						var ng = emp.getEmpTypeHistory();
						if(ng){
							ngEmpTypeHisotry = true;
						}
						this.pr(Util.getBodyValues(empt, [
							{ v:++n                         },
							{ v:emp.getId()                 },
							{ v:emp.getEmpCode()            },
							{ v:emp.getName()               },
							{ v:emp.getEntryDate()          },
							{ v:emp.getEndDate()            },
							{ v:'' + emp.getEmpMonthCount() },
							{ v:'' + targetMonthCount       },
							{ v:emp.getFirstYearMonth()     },
							{ v:emp.getLastYearMonth()      },
							{ v:(ng ? '*' : '')             }
						]));
						var fixedMonths = emp.getFixedMonthsAfterDate(this.param.changeDate);
						if(fixedMonths.length){
							this.er(str.substitute("エラー: 社員「${0}」の切替日以降の勤怠が確定済みです（${1}）"
								, [emp.getName(), Util.joinEx(fixedMonths, ',', 3)]));
							existFixedMonth = true;
						}
					}
				}, this);
				this.pr(empt.bar);
				if(ngEmpTypeHisotry){
					this.er(str.substitute("エラー: 勤務体系「${0}」に切替日以降の勤務体系履歴が存在する社員がいます", [empType.getName()]));
					this.pr("エラー: 切替日以降の勤務体系履歴が存在する社員がいます（該当者は備考欄に'*'を表示）");
				}
				if(existFixedMonth){
					this.pr('エラー: 切替日以降の勤怠が確定済みです');
				}
				var cals = empType.getCalendars();
				if(cals && cals.length){
					this.pr('カレンダー');
					this.pr(calt.bar);
					this.pr(calt.head);
					this.pr(calt.bar);
					array.forEach(cals, function(cal){
						this.pr(Util.getBodyValues(calt, [
							{ v:cal.Id                      },
							{ v:cal.Date__c                 },
							{ v:cal.Event__c                }
						]));
					}, this);
					this.pr(calt.bar);
				}
			}
			this.pr('バリデーションチェック終わり');
			return {
				log: this.getPlan(),
				errorCnt: this.errors.length,
				warnCnt: this.warns.length,
				errors: this.errors,
				warns: this.warns
			};
		},
		/**
		 * 月次配列を返す
		 * @param {
		 *   {
		 *     cd             :string, 切替日yyyy-MM-dd
		 *     empType        :Object, 切替前の勤務体系
		 *     empTypeHistory :{Array.<Object>}|null, 勤務体系履歴
		 *     virEmpType     :Object|null, 切替後の勤務体系
		 *     sd             :string|null, 月次情報の起点、省略時はcdの2ヵ月前
		 *     ed             :string|null  月次情報の終点、省略時はcdの2ヵ月後
		 *   }
		 * }
		 * @return {Array.<Object>}
		 */
		getVirEmpMonths: function(param){
			var cd = param.cd;
			var eths = param.empTypeHistory || null;
			var F = 'YYYY-MM-DD';

			// 勤務体系履歴の配列を作る
			var hists = [];
			var xd = null;
			array.forEach(eths || [], function(eth){
				var d = moment(eth.date, F).format(F);
				var et = this.empTypes.getEmpTypeById(eth.empTypeId);
				if(d <= cd && et){
					var hist = {
						sd: xd,
						ed: moment(d, F).add(-1, 'd').format(F),
						empType: et.getObj()
					}
					hists.push(hist);
					xd = d;
				}
			}, this);
			var md = moment(cd, F);
			var ed = (param.virEmpType ? md.clone().add(-1, 'd').format(F) : null);
			hists.push({ sd:xd, ed:ed  , empType:param.empType    });
			if(param.virEmpType){
				hists.push({ sd:cd, ed:null, empType:param.virEmpType });
			}

			// 勤務体系履歴の配列から HistoryRange の配列を作る
			var hrs = [];
			var prevHr = null;
			array.forEach(hists, function(hist){
				var hr = new HistoryRange({
					sd: hist.sd,
					ed: hist.ed,
					et: hist.empType,
					prevHr: prevHr
				});
				prevHr = hr;
				hrs.push(hr);
			});

			// HistoryRange の配列から月次情報の配列を作る（最小範囲は切替日の2ヵ月前～2ヵ月後）
			var d  = md.clone().add(-2,'M').format(F);
			var ld = md.clone().add( 2,'M').format(F);
			if(param.sd && d > param.sd){ // sd まで範囲を広げる
				d = param.sd;
			}
			if(param.ed && ld < param.ed){ // ed まで範囲を広げる
				ld = param.ed;
			}
			var mrs = [];
			var ymMap = {};
			while(d <= ld){
				var hr = null;
				for(var i = 0 ; i < hrs.length ; i++){
					if(hrs[i].contains(d)){
						hr = hrs[i];
						break;
					}
				}
				var ym = hr.getYearMonth(d);
				var subNo = ymMap[ym] || null;
				ymMap[ym] = (!subNo ? 1 : subNo + 1);
				var mr = {
					ym     : ym,
					subNo  : subNo,
					sd     : hr.getStartDate(ym),
					ed     : hr.getEndDate(ym),
					empType: hr.getEmpType(),
					inid   : hr.getInitialDate()
				};
				mrs.push(mr);
				d = moment(mr.ed, F).add(1, 'd').format(F);
			}
			return mrs;
		},
		executeStep1: function(index, callback){
			if(index >= this.param.empTypes.length){
				callback(1, '起算日変更終了');
				return;
			}
			this.showLog(str.rep('=', 60));
			if(this.param.changeParam.empTypeId){ // 変更先の勤務体系が指定されている時は Step1 をスキップする
				this.param.dstEmpTypeId = this.param.changeParam.empTypeId; // ★重要 this.param.dstEmpTypeId に変更先の勤務体系IDをセット
				this.executeStep2(index, callback);
				return;
			}
			var empType = this.param.empTypes[index];
			this.showLog(str.substitute('勤務体系「${0}」のコピー開始', [empType.getName()]));
			this.copyEmpType(index).then(
				lang.hitch(this, function(result){
					this.executeStep2(index, callback);
				}),
				lang.hitch(this, function(errmsg){
					callback(-1, errmsg);
				})
			);
		},
		executeStep2: function(index, callback){
			var empType = this.param.empTypes[index];
			this.showLog(str.substitute('勤務体系「${0}」の社員の勤務体系履歴の更新開始', [empType.getName()]));
			this.updateEmpTypeHistory(index).then(
				lang.hitch(this, function(result){
					if(this.param.changeParam.empTypeId){ // 変更先の勤務体系が指定されている時は Step3 をスキップする
						this.executeStep4(index, callback);
					}else{
						this.executeStep3(index, callback);
					}
				}),
				lang.hitch(this, function(errmsg){
					callback(-1, errmsg);
				}),
				lang.hitch(this, function(result){
					this.showLog(result);
				})
			);
		},
		executeStep3: function(index, callback){
			var empType = this.param.empTypes[index];
			if(!empType.getCalendars().length){
				this.executeStep4(index, callback);
				return;
			}
			this.showLog(str.substitute('勤務体系「${0}」のカレンダー${1}開始',
					[empType.getName(), (this.param.changeParam.invalidate ? '更新' : 'コピー')]));
			this.updateEmpTypeCals(index).then(
				lang.hitch(this, function(result){
					this.executeStep4(index, callback);
				}),
				lang.hitch(this, function(errmsg){
					callback(-1, errmsg);
				}),
				lang.hitch(this, function(result){
					this.showLog(result);
				})
			);
		},
		executeStep4: function(index, callback){
			var empType = this.param.empTypes[index];
			this.showLog(str.substitute('勤務体系「${0}」の社員の勤務月次・勤怠日次の更新開始', [empType.getName()]));
			this.updemp = Util.getBarHead([
				{ name:'社員ID'    , len: 18             },
				{ name:'社員コード', len: 14             },
				{ name:'社員名'    , len: 30             },
				{ name:'更新月数'  , len:  8, right:true },
				{ name:'挿入月数'  , len:  8, right:true },
				{ name:'更新日数'  , len:  8, right:true }
			]);
			this.showLog(this.updemp.bar);
			this.showLog(this.updemp.head);
			this.showLog(this.updemp.bar);
			this.updateEmpMonth(index).then(
				lang.hitch(this, function(result){
					this.executeStep1(index + 1, callback);
				}),
				lang.hitch(this, function(errmsg){
					callback(-1, errmsg);
				}),
				lang.hitch(this, function(result){
					this.showLog(result);
				})
			);
		},
		//---------------------------
		// 勤務体系のコピー
		copyEmpType: function(index){
			var deferred = new Deferred();
			var cp = this.param.changeParam;
			var req = {
				action            : "copyEmpType",
				changeDate        : this.param.changeDate,
				empTypeId         : this.param.empTypes[index].getId(),
				invalidate        : cp.invalidate,
				initialDateOfMonth: cp.startDate,
				initialDateOfYear : cp.startMonth,
				initialDayOfWeek  : cp.startWeek,
				markOfMonth       : cp.displayMonth,
				markOfYear        : cp.displayYear
			};
			Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(result){
					deferred.resolve(this.copyEmpTypeResult(result));
				}),
				lang.hitch(this, function(errmsg){
					deferred.reject(errmsg);
				})
			);
			return deferred.promise;
		},
		// 勤務体系のコピー結果回収
		copyEmpTypeResult: function(result){
			var empTypeId;
			for(var key in result){
				empTypeId = key;
			}
			var empType = this.getEmpTypeById(empTypeId);
			empType.setCopyResult(result[empTypeId]);
			this.showLog(str.substitute('勤務体系「${0}」のコピー完了', [empType.getName()]));

			// コピー元・コピー先の勤務体系を表示
			var orgEmpType = empType.getCopyOrgEmpType();
			var dstEmpType = empType.getCopyToEmpType();

			this.param.dstEmpTypeId = dstEmpType.Id;    // ★重要 this.param.dstEmpTypeId に新勤務体系のIDをセット

			var ett = Util.getBarHead([
				{ name:' '             , len: 10 },
				{ name:'勤務体系ID'    , len: 18 },
				{ name:'勤務体系コード', len: 14 },
				{ name:'勤務体系名'    , len: 30 },
				{ name:'有効'          , len:  4 }
			]);
			// 勤務体系情報
			this.showLog(ett.bar);
			this.showLog(ett.head);
			this.showLog(ett.bar);
			this.showLog(Util.getBodyValues(ett, [
				{ v:'(コピー元)'                      },
				{ v:orgEmpType.Id                     },
				{ v:orgEmpType.EmpTypeCode__c         },
				{ v:orgEmpType.Name                   },
				{ v:orgEmpType.Removed__c ? '×':'〇' }
			]));
			this.showLog(Util.getBodyValues(ett, [
				{ v:'(コピー先)'                      },
				{ v:dstEmpType.Id                     },
				{ v:dstEmpType.EmpTypeCode__c         },
				{ v:dstEmpType.Name                   },
				{ v:dstEmpType.Removed__c ? '×':'〇' }
			]));
			this.showLog(ett.bar);

			// 勤務体系コピーリカバリー用スクリプト（デバッグ用）
			this.recoveryScripts.unshift(empType.getCopyEmpTypeRecoveryScripts());
			return 1;
		},
		//---------------------------
		// 勤務体系履歴の更新
		updateEmpTypeHistory: function(index){
			var deferred = new Deferred();
			var empType = this.param.empTypes[index];
			var param = {
				empTypeId: this.param.dstEmpTypeId,
				empTypeHistoryStr: json.toJson(empType.getEmpTypeHistory(this.param.changeDate))
			};
			var empIds = lang.clone(empType.getEmpIdList());
			this.updateEmpTypeHistoryLoop(empIds, param, lang.hitch(this, function(flag, result){
				if(flag == 1){
					deferred.resolve(this.updateEmpTypeHistoryResult(empType));
				}else if(flag == 0){
					deferred.progress(result);
				}else{
					deferred.reject(result);
				}
			}));
			return deferred.promise;
		},
		// 勤務体系履歴の更新(2)
		updateEmpTypeHistoryLoop: function(empIds, param, callback){
			if(!empIds.length){
				callback(1);
				return;
			}
			var req = {
				action        : "updateEmpTypeHistory",
				empIds        : empIds.splice(0, 100),
				empTypeId     : param.empTypeId,
				empTypeHistory: param.empTypeHistoryStr
			};
			Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(result){
					this.showLog(req.empIds.length + '件更新');
					this.updateEmpTypeHistoryLoop(empIds, param, callback);
				}),
				lang.hitch(this, function(errmsg){
					callback(-1, errmsg);
				})
			);
		},
		// 勤務体系履歴の更新結果回収
		updateEmpTypeHistoryResult: function(empType){
			this.showLog(str.substitute('勤務体系「${0}」の社員の勤務体系履歴の更新完了', [empType.getName()]));
			// 勤務体系履歴更新リカバリースクリプト
			this.recoveryScripts.unshift(empType.getUpdateEmpTypeHistoryRecoveryScripts());
			return 1;
		},
		//---------------------------
		// 勤務体系カレンダー更新
		updateEmpTypeCals: function(index){
			var deferred = new Deferred();
			var empType = this.param.empTypes[index];
			var param = {
				empTypeId: empType.getCopyToEmpType().Id,
				invalidate: this.param.changeParam.invalidate
			};
			var calIds = lang.clone(empType.getCalendarIds(this.param.changeDate));
			this.updateEmpTypeCalsLoop(calIds, param, lang.hitch(this, function(flag, result){
				if(flag == 1){
					deferred.resolve(this.updateEmpTypeCalsResult(empType));
				}else if(flag == 0){
					deferred.progress(result);
				}else{
					deferred.reject(result);
				}
			}));
			return deferred.promise;
		},
		// 勤務体系カレンダー更新(2)
		updateEmpTypeCalsLoop: function(calIds, param, callback){
			if(!calIds.length){
				callback(1);
				return;
			}
			var req = {
				action    : "updateEmpTypeCals",
				calIds    : calIds.splice(0, 100),
				empTypeId : param.empTypeId,
				invalidate: param.invalidate
			};
			Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(result){
					this.showLog(req.calIds.length + '件更新');
					this.updateEmpTypeCalsLoop(calIds, param, callback);
				}),
				lang.hitch(this, function(errmsg){
					callback(-1, errmsg);
				})
			);
		},
		// 勤務体系カレンダー更新結果回収
		updateEmpTypeCalsResult: function(empType){
			this.showLog(str.substitute('勤務体系「${0}」のカレンダー${1}完了',
					[empType.getName(), (this.param.changeParam.invalidate ? '更新' : 'コピー')]));
			// カレンダーリカバリースクリプト
			this.recoveryScripts.unshift(empType.getUpdateEmpTypeCalsRecoveryScripts(this.param.changeParam.invalidate));
			return 1;
		},
		//---------------------------
		// 勤怠月次の修正
		updateEmpMonth: function(index){
			var deferred = new Deferred();
			var empType = this.param.empTypes[index];
			var empIds = lang.clone(empType.getEmpIdList());
			this.updateEmpMonthLoop(empType, empIds, lang.hitch(this, function(flag, result){
				if(flag == 1){
					deferred.resolve(this.updateEmpMonthResult(empType));
				}else if(flag == 0){
					deferred.progress(result);
				}else{
					deferred.reject(result);
				}
			}));
			return deferred.promise;
		},
		// 勤怠月次の修正(2)
		updateEmpMonthLoop: function(empType, empIds, callback){
			if(!empIds.length){
				callback(1);
				return;
			}
			var empId = empIds.splice(0, 1)[0];
			var emp = empType.getEmpById(empId);
			var virEmpType = this.getVirtualEmpType();
			virEmpType.Id = this.param.dstEmpTypeId; // ★ copyEmpTypeResult でセットした新勤務体系のID
			var ed = emp.getLastDate();
			if(ed){
				ed = moment(ed, 'YYYY-MM-DD').add(1, 'M').format('YYYY-MM-DD');
			}
			var param = emp.getUpdateEmpMonthParam(
				this.param,
				this.getVirEmpMonths({ // 起算日変更しない場合の月次配列
					cd            : this.param.changeDate,
					empTypeHistory: emp.getEmpTypeHistory(),
					empType       : empType.getObj(),
					virEmpType    : null,
					ed            : ed
				}),
				this.getVirEmpMonths({ // 起算日変更した場合の月次配列
					cd            : this.param.changeDate,
					empTypeHistory: emp.getEmpTypeHistory(),
					empType       : empType.getObj(),
					virEmpType    : virEmpType,
					ed            : ed
				})
			);
			if(!param.updates.length && !param.inserts.length){
				this.showLog(Util.getBodyValues(this.updemp, [
					{ v:emp.getId()            },
					{ v:emp.getEmpCode() || '' },
					{ v:emp.getName()          },
					{ v:'0'                    },
					{ v:'0'                    },
					{ v:'0'                    }
				]));
				this.updateEmpMonthLoop(empType, empIds, callback);
				return;
			}
			var req = {
				action    : "updateEmpMonth",
				empId     : empId,
				updates   : param.updates,
				inserts   : param.inserts
			};
			Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(result){
					this.showLog(Util.getBodyValues(this.updemp, [
						{ v:result.emp.Id               },
						{ v:result.emp.EmpCode__c || '' },
						{ v:result.emp.Name             },
						{ v:'' + result.updates.length  },
						{ v:'' + result.inserts.length  },
						{ v:'' + result.days.length     }
					]));
					this.updateEmpMonthLoop(empType, empIds, callback);
				}),
				lang.hitch(this, function(errmsg){
					callback(-1, errmsg);
				})
			);
		},
		// 勤怠月次の修正結果回収
		updateEmpMonthResult: function(empType){
			this.showLog(this.updemp.bar);
			this.showLog(str.substitute('勤務体系「${0}」の社員の勤務月次・勤怠日次の更新完了', [empType.getName()]));
			return 1;
		}
	});
});
