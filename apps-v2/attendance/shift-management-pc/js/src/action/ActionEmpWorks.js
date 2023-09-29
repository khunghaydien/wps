/**
 * 月次工数実績のロード
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId  </td><td>{String}</td><td>社員ID    </td><td>省略可</td></tr>
 *     <tr><td>month  </td><td>{Number}</td><td>月度      </td><td>省略可</td></tr>
 *     <tr><td>mode   </td><td>{String}</td><td>モード    </td><td>省略可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.loadJobMonth = function(params, pouch, thisObject, onSuccess, onFailure){
	var o = { params: params };
	teasp.action.contact.remoteMethod('loadJobMonth',
		[
			params.empId
			, params.month
			, (params.mode  || '')
			, (params.date  || '')
			, (params.subNo || '')
		],
		function(result){
			if(result.result == 'OK'){
				o.params.month      = result.jobYearMonth;
				o.params.subNo      = result.jobSubNo;
				o.params.startDate  = result.jobStartDate;
				o.params.endDate    = result.jobEndDate;
				o.params.startYm    = teasp.util.date.addYearMonth(o.params.month, -13);
				o.params.endYm      = teasp.util.date.addYearMonth(o.params.month,  13);
				pouch.setKeyObj('params', o.params);
				var s = null, t = null;
				if(result.targetEmp.length == 1){ // レコードが１件の場合、対象社員とセッションユーザは同じ
					t  = result.targetEmp[0];
					s  = result.targetEmp[0];
				}else if(result.targetEmp.length > 1){
					t  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 0 : 1];
					s  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 1 : 0];
				}
				pouch.setKeyObj('sessionInfo'      , teasp.logic.convert.convSessionInfoObj(s, t, result.rights));
				pouch.setKeyObj('targetEmp'        , teasp.logic.convert.convTargetEmpObj(t, o.params.mode));

				// 勤務体系履歴と勤務体系リストをセット（必ず pouch.setKeyObj('months'..) より前で呼ぶ）
				pouch.setKeyObj('empTypeInfo', teasp.logic.convert.convEmpTypeInfo(result.empTypeInfo, result.yearMonth, result.jobStartDate));

				pouch.setKeyObj('common'           , teasp.logic.convert.convCommonObj(result.common, result.borderRevNo));
				if(!pouch.getEmpId()){
					onSuccess.apply(thisObject, [true]);
				}else{
					pouch.setKeyObj('empMonthList'     , result.empMonthList);
					pouch.setKeyObj('deptHist'         , teasp.logic.convert.convDeptHist(result.deptHist));
					pouch.setKeyObj('monthSimple'      , teasp.logic.convert.convEmpMonthSimpleObjs(result.empMonthSimple));
					pouch.setKeyObj('infos'            , teasp.logic.convert.convInfoObjs(result.infos));
					pouch.setKeyObj('rejects'          , teasp.logic.convert.convRejectApplyList(result));
					pouch.setKeyObj('jobAssigns'       , teasp.logic.convert.convJobAssignObjs(result.jobAssign || []));
					pouch.setKeyObj('works'            , teasp.logic.convert.convWorkObjs(result.empWorks || []));
					pouch.setKeyObj('jobApply'         , teasp.logic.convert.convJobApplyObj(result.jobApply || null));
					pouch.setKeyObj('workNotes'        , teasp.logic.convert.convWorkNoteList(result.workNotes || []));
					pouch.setKeyObj('approver'         , teasp.logic.convert.convApprover(result.approver));
					pouch.setKeyObj('approverSet'      , teasp.logic.convert.convApproverSetObjs(result.approverSet));
					pouch.setKeyObj('depts'            , teasp.logic.convert.convDeptList(result.depts));

					// 休みの日を入力不可にするために必要な情報
					pouch.setKeyObj('empTypePatterns', teasp.logic.convert.convEmpTypePatternObjs(result.empTypePattern));
					pouch.setKeyObj('months'         , teasp.logic.convert.convEmpMonthObjs(result.empMonths, result.deptMonths, pouch.getEmpMonthCustomKeys()));
					pouch.setKeyObj('configs'        , teasp.logic.convert.convConfigObjs(result.configs));
					pouch.setKeyObj('cals'           , teasp.logic.convert.convCalendarObjs(result.calendar));
					pouch.setKeyObj('days'           , teasp.logic.convert.convEmpDayObjs(result.empDays));
					pouch.setKeyObj('applys'         , teasp.logic.convert.convEmpApplyObjs(result.empApplys));

					pouch.mergeCalendar(o.params.startDate, o.params.endDate);

					onSuccess.apply(thisObject, [true]);
				}
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 月次工数実績の月度変更
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId  </td><td>{String}</td><td>社員ID    </td><td>省略不可</td></tr>
 *     <tr><td>month  </td><td>{Number}</td><td>月度      </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.transJobMonth = function(params, pouch, thisObject, onSuccess, onFailure){
	var o = { params: params };
	teasp.action.contact.remoteMethod('transJobMonth',
		[
			params.empId
			, params.month
			, pouch.getMode()
			, (params.startDate || '')
		],
		function(result){
			if(result.result == 'OK'){
				o.params.month      = result.jobYearMonth;
				o.params.subNo      = result.jobSubNo;
				o.params.startDate  = result.jobStartDate;
				o.params.endDate    = result.jobEndDate;
				o.params.startYm    = teasp.util.date.addYearMonth(o.params.month, -13);
				o.params.endYm      = teasp.util.date.addYearMonth(o.params.month,  13);
				pouch.setKeyObj('params', o.params);

				// 勤務体系履歴から勤務体系をセット（必ず pouch.setKeyObj('months'..) より前で呼ぶ）
				pouch.setEmpTypeByDate(result.yearMonth, result.jobStartDate);

				pouch.setKeyObj('monthSimple'      , teasp.logic.convert.convEmpMonthSimpleObjs(result.empMonthSimple));
				pouch.setKeyObj('works'            , teasp.logic.convert.convWorkObjs(result.empWorks || []));
				pouch.setKeyObj('rejects'          , teasp.logic.convert.convRejectApplyList(result));
				pouch.setKeyObj('jobApply'         , teasp.logic.convert.convJobApplyObj(result.jobApply || null));
				pouch.setKeyObj('workNotes'        , teasp.logic.convert.convWorkNoteList(result.workNotes || []));
				pouch.setKeyObj('approver'         , teasp.logic.convert.convApprover(result.approver));

				// 休みの日を入力不可にするために必要な情報
				pouch.setKeyObj('empMonthList'   , result.empMonthList);
				pouch.setKeyObj('empTypePatterns', teasp.logic.convert.convEmpTypePatternObjs(result.empTypePattern));
				pouch.setKeyObj('months'         , teasp.logic.convert.convEmpMonthObjs(result.empMonths, result.deptMonths, pouch.getEmpMonthCustomKeys()));
				pouch.setKeyObj('configs'        , teasp.logic.convert.convConfigObjs(result.configs));
				pouch.setKeyObj('cals'           , teasp.logic.convert.convCalendarObjs(result.calendar));
				pouch.setKeyObj('days'           , teasp.logic.convert.convEmpDayObjs(result.empDays));
				pouch.setKeyObj('applys'         , teasp.logic.convert.convEmpApplyObjs(result.empApplys));

				pouch.mergeCalendar(o.params.startDate, o.params.endDate);

				onSuccess.apply(thisObject, [true]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 工数実績の承認履歴取得
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId</td><td>{String}</td><td>社員ID </td><td>省略不可</td></tr>
 *     <tr><td>month</td><td>{Number}</td><td>月度   </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getJobApplySteps = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('getJobApplySteps',
		[
			obj.empId,
			obj.month,
			obj.subNo
		],
		function(result){
			if(result.result == 'OK'){
				onSuccess.apply(thisObject, [true, teasp.logic.convert.convMixApplySteps(result, true)]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * ジョブ検索
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId        </td><td>{String}  </td><td>社員ID            </td><td>省略不可</td></tr>
 *     <tr><td>date         </td><td>{String}  </td><td>日付              </td><td>省略不可</td></tr>
 *     <tr><td>jobCode      </td><td>{String}  </td><td>ジョブコード      </td><td>省略可  </td></tr>
 *     <tr><td>jobName      </td><td>{String}  </td><td>ジョブ名          </td><td>省略可  </td></tr>
 *     <tr><td>excludes     </td><td>{Array.<string>}</td><td>除外するジョブID  </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.searchJob = function(params, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('searchJob', params,
		function(result){
			if(result.result == 'OK'){
				onSuccess.apply(thisObject, [true, teasp.logic.convert.convUnlimitedJobObjs(result.jobs || [])]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 工数実績の登録
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td colspan="2">empId           </td><td>{String} </td><td>社員ID                </td><td>省略不可                 </td></tr>
 *     <tr><td colspan="2">month           </td><td>{Number} </td><td>月度                  </td><td>省略不可                 </td></tr>
 *     <tr><td colspan="2">date            </td><td>{String} </td><td>日付                  </td><td>省略不可                 </td></tr>
 *     <tr><td colspan="2">jobs            </td><td>[        </td><td>アサイン              </td><td>                         </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>id     </td><td>{String} </td><td>アサインID            </td><td>省略不可                 </td></tr>
 *     <tr><td></td><td>jobId              </td><td>{String} </td><td>ジョブID              </td><td>省略不可                 </td></tr>
 *     <tr><td colspan="2">works           </td><td>[        </td><td>工数実績              </td><td>                         </td></tr>
 *     <tr><td></td><td>id                 </td><td>{String} </td><td>ワークID              </td><td>省略不可                 </td></tr>
 *     <tr><td></td><td>jobId              </td><td>{String} </td><td>ジョブID              </td><td>省略不可                 </td></tr>
 *     <tr><td></td><td>time               </td><td>{Number} </td><td>時間(分)              </td><td>timeFix=trueの場合、必須 </td></tr>
 *     <tr><td></td><td>timeFix            </td><td>{Boolean}</td><td>true:時間固定         </td><td>省略不可                 </td></tr>
 *     <tr><td></td><td>percent            </td><td>{Number} </td><td>パーセント            </td><td>省略不可                 </td></tr>
 *     <tr><td></td><td>volume             </td><td>{Number} </td><td>ボリューム            </td><td>timeFix=falseの場合、必須</td></tr>
 *     <tr><td></td><td>progress           </td><td>{String} </td><td>進捗                  </td><td>省略可                   </td></tr>
 *     <tr><td></td><td>order              </td><td>{Number} </td><td>並び順                </td><td>省略不可                 </td></tr>
 *     <tr><td colspan="2">workNote        </td><td>{String} </td><td>作業報告              </td><td>省略不可                 </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.saveEmpWork = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('saveEmpWork',
		obj,
		function(result){
			if(result.result == 'OK'){
				if(result.lastModifiedDate){
					pouch.setLastModifiedDate(result.lastModifiedDate);
				}
				pouch.setKeyObj('jobAssigns', teasp.logic.convert.convJobAssignObjs(result.jobAssign || []));
				pouch.replaceWorks(obj.startDate, teasp.logic.convert.convWorkObjs(result.empWorks || []));
				pouch.replaceWorkNote(obj.startDate, obj.workNote);
				onSuccess.apply(thisObject, [true]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 工数入力設定の登録
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId           </td><td>{String} </td><td>社員ID                </td><td>省略不可                 </td></tr>
 *     <tr><td>workInputType   </td><td>{Number} </td><td>入力方式              </td><td>省略不可                 </td></tr>
 *     <tr><td>workNoteOption  </td><td>{Boolean}</td><td>true:作業報告入力する </td><td>省略不可                 </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.saveEmpWorkOption = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('saveEmpWorkOption',
		obj,
		function(result){
			if(result.result == 'OK'){
				onSuccess.apply(thisObject, [true, obj, result]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 工数実績申請
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId           </td><td>{String} </td><td>社員ID                </td><td>省略不可    </td></tr>
 *     <tr><td>month           </td><td>{Number} </td><td>月度                  </td><td>省略不可    </td></tr>
 *     <tr><td>comment         </td><td>{String} </td><td>コメント              </td><td>省略不可    </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.submitJobApply = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('submitJobApply',
		obj,
		function(result){
			if(result.result == 'OK'){
//                pouch.setKeyObj('jobApply' , teasp.logic.convert.convJobApplyObj(result.jobApply || null));
//                onSuccess.apply(thisObject, [true]);
				teasp.action.contact.transJobMonth(obj, pouch, thisObject, onSuccess, onFailure);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 工数実績申請の取消
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId           </td><td>{String} </td><td>社員ID                </td><td>省略不可    </td></tr>
 *     <tr><td>month           </td><td>{Number} </td><td>月度                  </td><td>省略不可    </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.cancelJobApply = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('cancelJobApply',
		obj,
		function(result){
			if(result.result == 'OK'){
				pouch.setKeyObj('jobApply' , teasp.logic.convert.convJobApplyObj(result.jobApply || null));
				onSuccess.apply(thisObject, [true]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * ジョブ名の配列からジョブID取得（テスト・デモデータ作成用）
 *
 * @param {Array.<string>} names ジョブ名
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getJobIdByNames = function(names, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('getJobIdByNames',
		[
			names
		],
		function(result){
			teasp.logic.convert.excludeNameSpace(result);
			onSuccess.apply(thisObject, [true, result]);
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

