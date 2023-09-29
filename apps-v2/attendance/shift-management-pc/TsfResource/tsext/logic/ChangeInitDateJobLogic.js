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
	return declare("tsext.logic.ChangeInitDateJobLogic", null, {
		constructor : function(jobApplys, param, showLog){
			this.jobApplys = jobApplys;
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
		getRecoveryScripts: function(){
			return this.recoveryScripts.join('\n');
		},
		checkValid: function(){
			this.pr('バリデーションチェック');
			this.pr('切替日=' + this.param.changeDate);
			// 起算日変更前後比較表
			this.kisan = Util.getBarHead([
				{ name:' '         , len:  8             },
				{ name:'起算日'    , len:  6, right:true },
				{ name:'月度の表記', len: 16             }
			]);
			var cp = this.param.changeParam;
			var displayMonth    = (cp.displayMonth     == 1 ? '起算日に合わせる' : '締め日に合わせる');
			var orgDisplayMonth = (cp.org.displayMonth == 1 ? '起算日に合わせる' : '締め日に合わせる');
			this.pr(this.kisan.bar);
			this.pr(this.kisan.head);
			this.pr(this.kisan.bar);
			this.pr(Util.getBodyValues(this.kisan, [
				{ v:'(変更前)'               },
				{ v:cp.org.startDate  + '日' },
				{ v:orgDisplayMonth          }
			]));
			this.pr(Util.getBodyValues(this.kisan, [
				{ v:'(変更後)'               },
				{ v:cp.startDate  + '日'     },
				{ v:displayMonth             }
			]));
			this.pr(this.kisan.bar);
			// 変更しているかをチェック
			if(cp.startDate    == cp.org.startDate
			&& cp.displayMonth == cp.org.displayMonth){
				this.er("エラー: 起算日は変更されていません");
			}
			// 切替日と新しい起算日が同じかどうかをチェック
			var d = moment(this.param.changeDate, 'YYYY-MM-DD');
			if(d.date() != cp.startDate){
				this.wa("警告: 切替日と起算日が異なります。正しい設定か確認してください。");
			}
			var ngHistory = false;
			var hs = this.param.history || [];
			for(var i = 0 ; i < hs.length ; i++){
				if(hs[i].date >= this.param.changeDate){
					ngHistory = true;
					break;
				}
			}
			if(ngHistory){
				var errmsg = "エラー: 切替日以降の工数起算日履歴が存在します";
				this.er(errmsg);
				this.pr(errmsg);
			}
			var mrs = this.getVirJobMonths({ // 起算日変更した場合の月次配列
				cd            : this.param.changeDate,
				history       : this.param.history,
				startDate     : cp.startDate,
				displayMonth  : cp.displayMonth,
				org : {
					startDate     : cp.org.startDate,
					displayMonth  : cp.org.displayMonth
				}
			})
			this.pr('切替日前後の月度と期間');
			array.forEach(mrs, function(mr){
				this.pr(Util.padx(Util.formatMonthEx(mr.ym, mr.subNo), 14, ' ', true)
					+ ' '
					+ moment(mr.sd, 'YYYY-MM-DD').format('YYYY/MM/DD')
					+ '～'
					+ moment(mr.ed, 'YYYY-MM-DD').format('YYYY/MM/DD')
				);
			}, this);
			// 対象社員の表
			var empt = Util.getBarHead([
				{ name:'#'           , len:  4, right:true },
				{ name:'社員ID'      , len: 18             },
				{ name:'社員コード'  , len: 14             },
				{ name:'社員名'      , len: 30             },
				{ name:'入社日'      , len: 10             },
				{ name:'退社日'      , len: 10             },
				{ name:'更新対象月数', len: 12, right:true },
				{ name:'最大月度'    , len:  8             }
			]);
			// 対象社員リスト
			var emps = this.jobApplys.getEmps();
			if(!emps.length){
				this.pr('更新対象の工数実績申請データはありません。');
			}else{
				this.pr(empt.bar);
				this.pr(empt.head);
				this.pr(empt.bar);
				var n = 0;
				var existFixedMonth = false;
				array.forEach(emps, function(emp){
					var targetMonthCount = emp.getTargetJobMonthCount(this.param.changeDate);
					this.pr(Util.getBodyValues(empt, [
						{ v:++n                         },
						{ v:emp.getId()                 },
						{ v:emp.getEmpCode()            },
						{ v:emp.getName()               },
						{ v:emp.getEntryDate()          },
						{ v:emp.getEndDate()            },
						{ v:'' + targetMonthCount       },
						{ v:emp.getLastYearMonth()      }
					]));
					var fixedMonths = emp.getFixedMonthsAfterDate(this.param.changeDate);
					if(fixedMonths.length){
						this.er(str.substitute("エラー: 社員「${0}」の切替日以降の工数が確定済みです（${1}）"
							, [emp.getName(), Util.joinEx(fixedMonths, ',', 3)]));
						existFixedMonth = true;
					}
				}, this);
				this.pr(empt.bar);
				this.pr('バリデーションチェック終わり');
			}
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
		 *     history        :Array.<Object> 工数起算日履歴
		 *     startDate      :string|null, 変更後の起算日
		 *     displayMonth   :string|null, 変更後の月度の表記
		 *     org: {
		 *       startDate    :string, 変更前の起算日
		 *       displayMonth :string, 変更前の月度の表記
		 *     }
		 *     sd             :string|null, 月次情報の起点、省略時はcdの2ヵ月前
		 *     ed             :string|null  月次情報の終点、省略時はcdの2ヵ月後
		 *   }
		 * }
		 * @return {Array.<Object>}
		 */
		getVirJobMonths: function(param){
			var cd = param.cd;
			var jdhs = param.history || null;
			var F = 'YYYY-MM-DD';

			// 工数起算日履歴の配列を作る
			var hists = [];
			var xd = null;
			array.forEach(jdhs || [], function(jdh){
				var d = moment(jdh.date, F).format(F);
				var id = jdh.initialDateOfMonth;
				var mm = jdh.markOfMonth;
				if(d <= cd){
					var hist = {
						sd   : xd,
						ed   : moment(d, F).add(-1, 'd').format(F),
						inid : id,
						markm: mm
					}
					hists.push(hist);
					xd = d;
				}
			});
			var md = moment(cd, F);
			var ed = (param.startDate ? md.clone().add(-1, 'd').format(F) : null);
			hists.push({ sd:xd, ed:ed, inid:param.org.startDate, markm:param.org.displayMonth });
			if(param.startDate){
				hists.push({ sd:cd, ed:null, inid:param.startDate, markm:param.displayMonth });
			}

			// 工数起算日履歴の配列から HistoryRange の配列を作る
			var hrs = [];
			array.forEach(hists, function(hist){
				hrs.push(new HistoryRange({
					sd: hist.sd,
					ed: hist.ed,
					inid: hist.inid,
					markm: hist.markm
				}));
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
					ed     : hr.getEndDate(ym)
				};
				mrs.push(mr);
				d = moment(mr.ed, F).add(1, 'd').format(F);
			}
			return mrs;
		},
		executeStep1: function(callback){
			this.showLog(str.rep('=', 60));
			this.showLog('勤怠共通設定の更新開始');
			this.updateCommon().then(
				lang.hitch(this, function(result){
					this.executeStep2(callback);
				}),
				lang.hitch(this, function(errmsg){
					callback(-1, errmsg);
				})
			);
		},
		executeStep2: function(callback){
			this.showLog('工数実績申請の更新開始');
			this.updemp = Util.getBarHead([
				{ name:'社員ID'    , len: 18             },
				{ name:'社員コード', len: 14             },
				{ name:'社員名'    , len: 30             },
				{ name:'更新月数'  , len:  8, right:true },
				{ name:'挿入月数'  , len:  8, right:true },
				{ name:'更新ﾜｰｸ数' , len:  9, right:true }
			]);
			this.showLog(this.updemp.bar);
			this.showLog(this.updemp.head);
			this.showLog(this.updemp.bar);
			this.updateJobMonth().then(
				lang.hitch(this, function(result){
					callback(1, '起算日変更終了');
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
		// 勤怠共通設定の更新
		updateCommon: function(){
			var deferred = new Deferred();
			var cp = this.param.changeParam;
			var history = {
				date              : this.param.changeDate,
				initialDateOfMonth: '' + cp.org.startDate,
				markOfMonth       : cp.org.displayMonth
			};
			var req = {
				action            : "updateJobInitialDate",
				history           : Util.toJson(history),
				initialDateOfMonth: Util.parseInt(cp.startDate),
				markOfMonth       : cp.displayMonth
			};
			Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(result){
					deferred.resolve(this.updateCommonResult(result));
				}),
				lang.hitch(this, function(errmsg){
					deferred.reject(errmsg);
				})
			);
			return deferred.promise;
		},
		// 勤怠共通設定の更新回収
		updateCommonResult: function(result){
			this.showLog('勤怠共通設定の更新完了');
			var cp = this.param.changeParam;
			this.showLog(this.kisan.bar);
			this.showLog(this.kisan.head);
			this.showLog(this.kisan.bar);
			var orgDisplayMonth = (cp.org.displayMonth == 1   ? '起算日に合わせる' : '締め日に合わせる');
			var displayMonth    = (result.common.JobMarkOfMonth__c  == '1' ? '起算日に合わせる' : '締め日に合わせる');
			this.showLog(Util.getBodyValues(this.kisan, [
				{ v:'(変更前)'                       },
				{ v:cp.org.startDate  + '日'         },
				{ v:orgDisplayMonth                  }
			]));
			this.showLog(Util.getBodyValues(this.kisan, [
				{ v:'(変更後)'                       },
				{ v:result.common.JobInitialDayOfMonth__c + '日' },
				{ v:displayMonth                     }
			]));
			this.showLog(this.kisan.bar);
			return 1;
		},
		//---------------------------
		// 工数実績申請の修正
		updateJobMonth: function(){
			var deferred = new Deferred();
			var empIds = lang.clone(this.jobApplys.getEmpIdList());
			this.updateJobMonthLoop(empIds, lang.hitch(this, function(flag, result){
				if(flag == 1){
					deferred.resolve(this.updateJobMonthResult());
				}else if(flag == 0){
					deferred.progress(result);
				}else{
					deferred.reject(result);
				}
			}));
			return deferred.promise;
		},
		// 工数実績申請の修正(2)
		updateJobMonthLoop: function(empIds, callback){
			if(!empIds.length){
				callback(1);
				return;
			}
			var empId = empIds.splice(0, 1)[0];
			var emp = this.jobApplys.getEmpById(empId);
			var ed = emp.getLastDate();
			if(ed){
				ed = moment(ed, 'YYYY-MM-DD').add(1, 'M').format('YYYY-MM-DD');
			}
			var param = emp.getUpdateJobMonthParam(
				this.param,
				this.getVirJobMonths({ // 起算日変更しない場合の月次配列
					cd            : this.param.changeDate,
					history       : this.param.history,
					startDate     : null,
					displayMonth  : null,
					org : {
						startDate     : this.param.changeParam.org.startDate,
						displayMonth  : this.param.changeParam.org.displayMonth
					},
					ed            : ed
				}),
				this.getVirJobMonths({ // 起算日変更した場合の月次配列
					cd            : this.param.changeDate,
					history       : this.param.history,
					startDate     : this.param.changeParam.startDate,
					displayMonth  : this.param.changeParam.displayMonth,
					org : {
						startDate     : this.param.changeParam.org.startDate,
						displayMonth  : this.param.changeParam.org.displayMonth
					},
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
				this.updateJobMonthLoop(empIds, callback);
				return;
			}
			var req = {
				action    : "updateJobMonth",
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
						{ v:'' + result.works.length    }
					]));
					this.updateJobMonthLoop(empIds, callback);
				}),
				lang.hitch(this, function(errmsg){
					callback(-1, errmsg);
				})
			);
		},
		// 工数実績申請の修正結果回収
		updateJobMonthResult: function(){
			this.showLog(this.updemp.bar);
			this.showLog('工数実績申請の更新完了');
			return 1;
		}
	});
});
